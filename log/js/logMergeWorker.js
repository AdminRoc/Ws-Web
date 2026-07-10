/* 并行分片扫描的合并 Worker —— 通过 MessageChannel 的 port 直接从各 logShardWorker.js
 * 接收扫描结果（不经过主线程中转，见 logShardWorker.js 顶部注释），按文件原始顺序
 * 拼接会话时间戳（sessionOffset 桥接）、重放 wall-clock 锚点，再把匹配行顺序喂给
 * 真正的解析器（这一步只处理命中关键字的少数行，耗时可忽略）。 */
self.window = self;

importScripts(
  'logReader.js?v=20260710d',
  'solNodes.js?v=20260707b',
  'arbNodeBaseline.js?v=20260710b',
  'squadMixin.js?v=20260707b',
  'chatMixin.js?v=20260707b',
  'parsers/eidolon.js?v=20260707b',
  'parsers/disruption.js?v=20260707b',
  'parsers/profitTaker.js?v=20260707b',
  'parsers/arbitration.js?v=20260710a',
  'parsers/general.js?v=20260710a'
);

self.onmessage = function (e) {
  const { ports, baselineUrl, shardCount, shardSizes } = e.data;
  const shardResults = new Array(shardCount).fill(null);
  const shardProgress = new Array(shardCount).fill(0);
  const totalSize = shardSizes.reduce((a, b) => a + b, 0) || 1;
  let doneCount = 0;
  let failed = false;

  function reportProgress() {
    let weighted = 0;
    for (let i = 0; i < shardCount; i++) weighted += shardProgress[i] * shardSizes[i];
    postMessage({ type: 'progress', pct: Math.round((weighted / totalSize) * 90) }); // 分片阶段占 90%
  }

  function finishMerging() {
    if (failed) return;
    const start = function () {
      const eidolon     = WF.EidolonParser.create();
      const disruption  = WF.DisruptionParser.create();
      const profitTaker = WF.ProfitTakerParser.create();
      const arbitration = WF.ArbitrationParser.create();
      const general     = WF.GeneralParser.create();
      const parsers = [eidolon, disruption, profitTaker, arbitration, general];

      const scan = WF.logReader.mergeShardsAndFeed(shardResults, parsers);

      postMessage({
        type: 'done',
        scan: scan,
        results: {
          general:     general.results(),
          eidolon:     eidolon.results(),
          disruption:  disruption.results(),
          profitTaker: profitTaker.results(),
          arbitration: arbitration.results(),
        },
      });
    };

    postMessage({ type: 'progress', pct: 92 });
    if (baselineUrl) {
      WF.ArbNodeBaseline.load(baselineUrl).then(start);
    } else {
      start();
    }
  }

  ports.forEach(function (port, idx) {
    port.onmessage = function (pe) {
      const msg = pe.data;
      if (msg.type === 'progress') {
        shardProgress[msg.shardIndex] = msg.pct;
        reportProgress();
      } else if (msg.type === 'error') {
        failed = true;
        postMessage({ type: 'error' });
      } else if (msg.type === 'done') {
        shardResults[msg.shardIndex] = msg.result;
        doneCount++;
        if (doneCount === shardCount) finishMerging();
      }
    };
  });
};
