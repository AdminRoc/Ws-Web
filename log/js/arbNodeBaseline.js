/* 仲裁分节点生息效率基准——异步加载 data/arb-node-baseline.json（每个节点的
 * 历史最高生息速率/时），供仲裁评分按节点换算达成度时使用。查不到时（数据还
 * 没加载完，或该节点暂无人上传过战绩）一律返回 null，调用方自行退回默认基准，
 * 不阻塞、不影响任何既有流程。 */
window.WF = window.WF || {};

WF.ArbNodeBaseline = (function () {
  let data = null;   // { nodes: { <nodeId>: {nodeName, missionType, perHour} } }
  let ready = false;

  function load(url) {
    fetch(url).then((r) => (r.ok ? r.json() : null)).then((json) => {
      data = json;
      ready = true;
    }).catch(() => { ready = true; });
  }

  function lookup(nodeId) {
    if (!nodeId || !data || !data.nodes) return null;
    return data.nodes[nodeId] || null;
  }

  return { load, lookup, isReady: () => ready };
})();
