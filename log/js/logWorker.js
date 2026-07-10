/* 超大文件解析 Worker —— 把 scanStream 完全挪出主线程。
 * 主线程为了不卡 UI，每处理一批行就 setTimeout(0) 让步一次；浏览器对连续嵌套的
 * setTimeout(0) 有最低 4ms 的强制节流（HTML5 clamp 规则），文件越大、批次越多，
 * 这个强制等待的总开销就越可观。Worker 没有渲染任务，可以不间断地跑完整个循环，
 * 同时主线程 UI 全程保持响应——这是本文件存在的唯一原因。
 * 只依赖纯数据处理逻辑（logReader + 解析器 + 其纯数据 mixin），不碰任何 DOM。 */
self.window = self; // 兼容被 importScripts 的既有文件里的 `window.WF = window.WF || {}`（Worker 无 window）

importScripts(
  'logReader.js',
  'solNodes.js',
  'arbNodeBaseline.js',
  'squadMixin.js',
  'chatMixin.js',
  'parsers/eidolon.js',
  'parsers/disruption.js',
  'parsers/profitTaker.js',
  'parsers/arbitration.js',
  'parsers/general.js'
);

self.onmessage = function (e) {
  const { file, baselineUrl } = e.data;

  const start = function () {
    const eidolon     = WF.EidolonParser.create();
    const disruption  = WF.DisruptionParser.create();
    const profitTaker = WF.ProfitTakerParser.create();
    const arbitration = WF.ArbitrationParser.create();
    const general     = WF.GeneralParser.create();
    const parsers = [eidolon, disruption, profitTaker, arbitration, general];

    WF.logReader.scanStream(
      file, parsers,
      function (pct) { postMessage({ type: 'progress', pct: pct }); },
      function (scan) {
        if (!scan) { postMessage({ type: 'error' }); return; }
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
    );
  };

  // 仲裁的分节点生息基准依赖这份小 JSON；等它就位再开始扫描，
  // 避免扫描过程中基准仍在请求途中导致查不到数据（与主线程原有的"预热"效果对齐）。
  if (baselineUrl) {
    WF.ArbNodeBaseline.load(baselineUrl).then(start);
  } else {
    start();
  }
};
