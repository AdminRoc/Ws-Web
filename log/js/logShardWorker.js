/* 并行分片扫描 Worker —— 只做"逐行判断是否要喂解析器"这一步（关键字匹配 + 时间戳
 * 追踪），不接触任何解析器逻辑，所以不需要 importScripts 解析器/mixin 文件，
 * 启动更轻。
 * 结果通过 MessageChannel 的 port 直接发给 logMergeWorker.js，不经过主线程中转——
 * 命中的匹配行文本量可能相当大（大文件下几十万到几百万条），如果先发回主线程
 * 再由主线程转发给合并 Worker，等于让主线程做两次大数据量的结构化克隆，会把主
 * 线程堵死一段时间。直连合并 Worker 后，这份数据完全不经过主线程。 */
self.window = self; // 兼容 logReader.js 里的 `window.WF = window.WF || {}`（Worker 无 window）

importScripts('logReader.js');

self.onmessage = function (e) {
  const { file, start, end, shardIndex, port } = e.data;
  const shardFile = file.slice(start, end);
  WF.logReader.scanShard(
    shardFile,
    function (pct) { port.postMessage({ type: 'progress', shardIndex: shardIndex, pct: pct }); },
    function (result) {
      if (!result) { port.postMessage({ type: 'error', shardIndex: shardIndex }); port.close(); return; }
      port.postMessage({ type: 'done', shardIndex: shardIndex, result: result });
      port.close();
    }
  );
};
