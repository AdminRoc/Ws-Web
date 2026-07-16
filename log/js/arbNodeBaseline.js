/* 仲裁分节点生息效率基准——异步加载 data/arb-node-baseline.json（每个节点的
 * 基准生息速率/时），供仲裁评分按节点换算达成度时使用。查不到时（数据还
 * 没加载完，或该节点尚缺数据）一律返回 null，调用方自行退回默认基准，
 * 不阻塞、不影响任何既有流程。 */
window.WF = window.WF || {};

WF.ArbNodeBaseline = (function () {
  let data = null;   // { nodes: { <nodeId>: {nodeName, missionType, perHour} } }
  let ready = false;
  let fallbackByType = null; // { <missionType>: { perHour, nodeName } }，节点级查不到时的兜底

  function load(url) {
    return fetch(url).then((r) => (r.ok ? r.json() : null)).then((json) => {
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
    }).catch(() => { ready = true; });
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
