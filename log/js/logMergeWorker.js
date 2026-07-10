/* 并行分片扫描的合并 Worker —— 通过 MessageChannel 的 port 直接从各 logShardWorker.js
 * 接收扫描结果（不经过主线程中转），按文件原始顺序增量喂解析器。
 *
 * 内存优化：每个分片到达后立即按顺序喂 createShardFeeder，喂完置 null 释放 matches 数组。
 * 不等全部分片到齐再统一处理，峰值内存从"全部分片同时驻留"降为"至多 1~2 个分片"。 */
self.window = self;

importScripts(
  'logReader.js?v=20260710e',
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

  const eidolon     = WF.EidolonParser.create();
  const disruption  = WF.DisruptionParser.create();
  const profitTaker = WF.ProfitTakerParser.create();
  const arbitration = WF.ArbitrationParser.create();
  const general     = WF.GeneralParser.create();
  const parsers = [eidolon, disruption, profitTaker, arbitration, general];

  const totalSize   = shardSizes.reduce((a, b) => a + b, 0) || 1;
  const shardProgress = new Array(shardCount).fill(0);
  // 缓冲乱序到达的分片结果，最终按顺序喂；喂完立即置 null 释放
  const shardBuffer = new Array(shardCount).fill(null);
  let doneCount  = 0;
  let nextToFeed = 0;
  let failed     = false;
  let feeder     = null; // createShardFeeder 实例，baseline 就绪后创建

  function reportProgress() {
    let weighted = 0;
    for (let i = 0; i < shardCount; i++) weighted += shardProgress[i] * shardSizes[i];
    postMessage({ type: 'progress', pct: Math.round((weighted / totalSize) * 90) });
  }

  /* 尝试按序喂下一个（或多个已缓冲的）分片 */
  function tryFeedNext() {
    if (!feeder) return; // baseline 尚未就绪
    while (nextToFeed < shardCount && shardBuffer[nextToFeed] !== null) {
      feeder.feedShard(shardBuffer[nextToFeed]);
      shardBuffer[nextToFeed] = null; // 立即释放，GC 可回收
      nextToFeed++;
    }
    if (nextToFeed === shardCount) {
      // 全部分片已喂完，收尾
      postMessage({ type: 'progress', pct: 96 });
      const scan = feeder.finish();
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
    }
  }

  // 立即启动 baseline 预热（不等分片完成），通常在分片扫描期间就绪
  const baselineP = baselineUrl ? WF.ArbNodeBaseline.load(baselineUrl) : Promise.resolve();
  baselineP.then(function () {
    feeder = WF.logReader.createShardFeeder(parsers);
    tryFeedNext(); // baseline 已就绪，处理期间可能已有分片在 shardBuffer 中等待
  });

  ports.forEach(function (port, idx) {
    port.onmessage = function (pe) {
      const msg = pe.data;
      if (msg.type === 'progress') {
        shardProgress[msg.shardIndex] = msg.pct;
        reportProgress();
      } else if (msg.type === 'error') {
        if (failed) return;
        failed = true;
        postMessage({ type: 'error' });
      } else if (msg.type === 'done') {
        shardBuffer[msg.shardIndex] = msg.result;
        doneCount++;
        tryFeedNext();
      }
    };
  });
};
