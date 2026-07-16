/* 仲裁分节点生息效率基准——异步加载 data/arb-node-baseline.json（每个节点的
 * 基准生息速率/时），供仲裁评分按节点换算达成度时使用。查不到时（数据还
 * 没加载完，或该节点尚缺数据）一律返回 null，调用方自行退回默认基准，
 * 不阻塞、不影响任何既有流程。 */
window.WF = window.WF || {};

WF.ArbNodeBaseline = (function () {
  let data = null;   // { nodes: { <nodeId>: {nodeName, missionType, perHour} } }
  let ready = false;
  let fallbackByType = null; // { <missionType>: { perHour, nodeName } }，节点级查不到时的兜底

  let _pending = null; // 复用同一个 fetch Promise，避免多次调用重复发起网络请求

  function load(url) {
    // 如果已有数据且 ready，直接返回已 resolved 的 Promise，不重复请求
    if (ready && data) return Promise.resolve();
    // 如果正在加载中（前一次 load 还没完成），返回同一个 Promise，不发起新请求
    if (_pending) return _pending;
    _pending = fetch(url).then((r) => (r.ok ? r.json() : null)).then((json) => {
      data = json;
      // 构建 missionType → 最高 perHour 索引（包含常规节点与 MISSION_FALLBACK 条目）
      if (json && json.nodes) {
        const map = {};
        for (const [nodeId, v] of Object.entries(json.nodes)) {
          const mt = v.missionType;
          if (!mt) continue;
          const cur = map[mt];
          if (!cur || v.perHour > cur.perHour) map[mt] = { perHour: v.perHour, nodeName: v.nodeName };
        }
        fallbackByType = map;
      }
      ready = true;
    }).catch(() => { ready = true; }).finally(() => { _pending = null; });
    return _pending;
  }

  function lookup(nodeId) {
    if (!nodeId || !data || !data.nodes) return null;
    return data.nodes[nodeId] || null;
  }

  function fallback(missionType) {
    if (!missionType || !fallbackByType) return null;
    return fallbackByType[missionType] || null;
  }

  return { load, lookup, fallback, isReady: () => ready };
})();
