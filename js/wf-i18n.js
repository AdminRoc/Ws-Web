/* 统一中英映射运行时 WF.i18n —— worldstate + eelog 两模块共用的翻译查表层。
 * 详见开发记忆 unified-i18n-plan / optimize-without-weakening。
 *
 * 数据来自同源 data/i18n/wf-i18n.json（由 .github/scripts/gen_i18n.py 生成），
 * 各 resolver 的查表+兜底顺序与两模块迁移前的现状逐字一致，所以接入时只是把
 * 原来散落的查表逻辑改调这里，行为零变化：
 *   itemNameByPath() ←复刻→ eelog profileView._itemName
 *   shortName()      ←复刻→ eelog profileView._i18nShortMap 反查
 *   tr()             ←复刻→ worldstate tr()
 *   byLang/mission/planet/misc ← 供 worldstate resolveNode/trMission/trLocation 调用
 *
 * 加载策略（守 optimize-without-weakening，不削弱汉化）：
 *   - 大表(byPath/byName/byLang)异步 load()，ready 是其加载完成的 Promise；
 *     调用方在"真正要用大表的渲染"前 await ready，绝不在未就绪时回退英文。
 *   - 小的共用类别表(override/mission/planet/misc)优先读同步已加载的 window.WF_TR，
 *     因此即便大表还没下完也立即可用，无竞态。
 *   - init(data) 可直接注入数据（测试用，也为将来"内联零网络快照"预留）。
 */
window.WF = window.WF || {};
window.WF.i18n = (function () {
  var M = null;          // 已加载的大表数据（来自 wf-i18n.json）
  var shortIdx = null;   // byPath 末段反查索引（懒构建）
  var started = false;
  var resolveReady;
  var ready = new Promise(function (res) { resolveReady = res; });

  function _wftr() {
    return (typeof window !== 'undefined' && window.WF_TR) ? window.WF_TR : null;
  }

  /* 类别表：优先同步的 WF_TR，其次大表里的同名子表（二者内容一致，前者无竞态） */
  function _cat(wftKey, mapKey) {
    var t = _wftr();
    if (t && t[wftKey]) return t[wftKey];
    return (M && M[mapKey]) || null;
  }
  function _override(key) { var o = _cat('ITEM_OVERRIDE', 'override'); return o ? o[key] : undefined; }

  function _camelSplit(raw) {
    return raw.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2');
  }

  /* eelog 物品名（按对象路径）：override[path] → byPath[path] → override[末段] → 末段驼峰拆词 */
  function itemNameByPath(path) {
    if (!path) return '';
    var ov = _override(path); if (ov) return ov;
    var zh = M && M.byPath && M.byPath[path]; if (zh) return zh;
    var parts = path.split('/');
    var raw = parts[parts.length - 1] || parts[parts.length - 2] || '';
    var ovr = _override(raw); if (ovr) return ovr;
    return _camelSplit(raw);
  }

  /* eelog 短名反查表：byPath 每个键取末段 → 中文（首个出现者优先），懒构建。
     shortMap() 返回整张表（供 profileView._i18nShortMap 直接返回），shortName() 查单条。 */
  function shortMap() {
    if (!shortIdx) {
      shortIdx = {};
      var bp = (M && M.byPath) || {};
      for (var k in bp) {
        if (!Object.prototype.hasOwnProperty.call(bp, k)) continue;
        var last = k.split('/').pop();
        if (last && !(last in shortIdx)) shortIdx[last] = bp[k];
      }
    }
    return shortIdx;
  }
  function shortName(seg) { return shortMap()[seg]; }

  /* worldstate tr()：override[key] → byName[key] → byLang[key] → 原样返回 key
     （byName 是英文显示名键、byLang 是 /Lotus/Language 键，两者键空间不重叠，先后无歧义） */
  function tr(key) {
    if (!key) return '';
    var ov = _override(key); if (ov) return ov;
    if (M) {
      if (M.byName && M.byName[key] != null) return M.byName[key];
      if (M.byLang && M.byLang[key] != null) return M.byLang[key];
    }
    return key;
  }

  function byLang(key) { return (M && M.byLang) ? M.byLang[key] : undefined; }
  /* 颗粒查找：byName 优先、其次 byLang，命中返回译名、未命中返回 undefined（不回退原 key）。
     供 worldstate 作"同源兜底"——它自己的 _dict（远程广字典）未命中时再查这里，只增不减。 */
  function find(key) {
    if (!M || !key) return undefined;
    if (M.byName && M.byName[key] != null) return M.byName[key];
    if (M.byLang && M.byLang[key] != null) return M.byLang[key];
    return undefined;
  }
  function mission(t) { var m = _cat('MISSION_TYPE', 'mission'); return m ? m[t] : undefined; }
  function planet(p)  { var m = _cat('PLANET', 'planet');        return m ? m[p] : undefined; }
  function misc(k)    { var m = _cat('MISC', 'misc');            return m ? m[k] : undefined; }

  function _apply(data) { M = data || {}; shortIdx = null; }

  /* 直接注入数据并立即就绪（测试 / 将来内联快照用） */
  function init(data) {
    _apply(data);
    if (!started) { started = true; resolveReady(api); }
    return ready;
  }

  /* ── localStorage 缓存：字典极少变化，缓存命中可让重访"零网络等待"、离线也有上次的字典 ── */
  var LS_KEY = 'wf_i18n_v1';
  var TTL = 7 * 86400 * 1000; /* 7 天 */
  function _readCache() {
    try {
      var raw = localStorage.getItem(LS_KEY);
      if (raw) { var o = JSON.parse(raw); if (o && o.data) return o; }
    } catch (e) {}
    return null;
  }
  function _writeCache(data) {
    try { localStorage.setItem(LS_KEY, JSON.stringify({ ts: Date.now(), data: data })); } catch (e) {}
  }
  function _fetchJson(url) {
    return fetch(url).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    });
  }

  /* 从同源 URL 加载大表。url 由调用页给出（eelog 传 ../data/...，worldstate 传 data/...）。
     - 命中新鲜缓存：立即同步就绪（重访不等网络），再后台校验刷新。
     - 无缓存/已过期：联网取；成功写缓存，失败退用过期缓存（离线兜底），再不行空表降级。
     缓存即真实字典，不削弱翻译；正常路径调用方在 await ready 之后才渲染。 */
  function load(url) {
    if (started) return ready;
    started = true;
    var cached = _readCache();

    if (cached && (Date.now() - cached.ts) < TTL) {
      _apply(cached.data);
      resolveReady(api);
      /* 后台校验更新（不重置 ready）：失败就继续用缓存 */
      try { _fetchJson(url).then(function (d) { _apply(d); _writeCache(d); }).catch(function () {}); } catch (e) {}
      return ready;
    }

    try {
      _fetchJson(url).then(function (d) {
        _apply(d); _writeCache(d); resolveReady(api);
      }).catch(function (e) {
        if (cached && cached.data) { _apply(cached.data); }   /* 过期缓存离线兜底 */
        else { _apply({}); if (typeof console !== 'undefined') console.warn('[WF.i18n] 字典加载失败且无缓存，已降级:', e && e.message); }
        resolveReady(api);
      });
    } catch (e) {
      _apply(cached && cached.data ? cached.data : {});
      resolveReady(api);
    }
    return ready;
  }

  var api = {
    ready: ready,
    load: load,
    init: init,
    itemNameByPath: itemNameByPath,
    shortName: shortName,
    shortMap: shortMap,
    tr: tr,
    byLang: byLang,
    find: find,
    mission: mission,
    planet: planet,
    misc: misc,
    getMaps: function () { return M; },
  };
  return api;
})();
