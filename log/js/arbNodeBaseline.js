/* 仲裁分节点生息效率基准——双通道加载，任何单一通道失效都不退回默认基准：
 *
 *   通道一（内嵌种子，零网络）：data/arb-node-baseline.js 与 JSON 同源、同步生成，
 *     通过 <script src>（页面）或 importScripts（Worker）随模块一起加载，在
 *     file:// 协议（双击打开页面）下也能同步就位——这是基准数据的可靠性底座。
 *   通道二（fetch 升级）：data/arb-node-baseline.json 可能更新（CDN 已刷新而
 *     本地/缓存的 JS 种子偏旧），load() 在种子就位后仍后台拉取，仅当 JSON 的
 *     generatedAt 不早于当前数据时才覆盖；种子缺失时才阻塞等待 fetch。
 *
 * 查不到节点时一律返回 null，调用方按 节点基准 → 任务类型兜底 → 默认 1000/时
 * 的顺序自行降级，不阻塞、不影响任何既有流程。fetch 失败会 console.warn 显式
 * 告警（历史教训：静默 catch 导致评分悄悄退回 1000/时而无人察觉）。 */
window.WF = window.WF || {};

WF.ArbNodeBaseline = (function () {
  let data = null;   // { nodes: { <nodeId>: {nodeName, missionType, perHour} } }
  let ready = false;
  let fallbackByType = null; // { <missionType>: { perHour, nodeName } }，节点级查不到时的兜底

  let _pending = null; // 复用同一个 fetch Promise，避免多次调用重复发起网络请求

  /* 采用一份基准数据并重建任务类型兜底索引；数据无效时返回 false */
  function adopt(json) {
    if (!json || !json.nodes) return false;
    data = json;
    // 构建 missionType → 最高 perHour 索引（包含常规节点与 MISSION_FALLBACK 条目）
    const map = {};
    for (const [nodeId, v] of Object.entries(json.nodes)) {
      const mt = v.missionType;
      if (!mt) continue;
      const cur = map[mt];
      if (!cur || v.perHour > cur.perHour) map[mt] = { perHour: v.perHour, nodeName: v.nodeName };
    }
    fallbackByType = map;
    ready = true;
    return true;
  }

  // 通道一：内嵌种子同步就位（data/arb-node-baseline.js 先于本文件加载时生效）
  if (WF.ARB_NODE_BASELINE_DATA) {
    adopt(WF.ARB_NODE_BASELINE_DATA);
  }

  function load(url) {
    // 已有数据（内嵌种子）：仍在后台拉取 JSON 尝试升级，但不阻塞调用方——
    // 解析可立即使用种子基准；JSON 仅在不更旧时覆盖（防 CDN 旧缓存降级）。
    if (ready && data) {
      if (!_pending && url && typeof fetch === 'function') {
        _pending = fetch(url).then((r) => (r.ok ? r.json() : null)).then((json) => {
          if (json && json.nodes && (json.generatedAt || 0) >= (data.generatedAt || 0)) {
            adopt(json);
          }
        }).catch(() => { /* 种子已在位，升级失败无损 */ })
          .finally(() => { _pending = null; });
      }
      return Promise.resolve();
    }
    // 无数据（种子缺失，如部署不同步）：fetch 是唯一途径，阻塞等待
    if (_pending) return _pending;
    _pending = fetch(url).then((r) => (r.ok ? r.json() : null)).then((json) => {
      if (!adopt(json)) {
        console.warn('[ArbNodeBaseline] 基准数据请求无效（404/空响应？），仲裁生息效率将退回默认基准 1000/时：', url);
      }
      ready = true;
    }).catch((err) => {
      console.warn('[ArbNodeBaseline] 基准数据加载失败（file:// 协议或网络问题），仲裁生息效率将退回默认基准 1000/时：', (err && err.message) || err);
      ready = true;
    }).finally(() => { _pending = null; });
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
