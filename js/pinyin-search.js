/* 拼音 + 模糊 检索辅助（item.html / search.html 共用）。
   数据是自托管的 data/pinyin-map.json（汉字->无声调读音，由 harvest_pinyin.py 离线
   用 pypinyin 生成），运行时只读这份静态 JSON，零外部依赖、大陆访问友好。
   作为各页"原有精确匹配"之外的兜底匹配层：精确命中优先，拼音/模糊只在精确未命中时补充。 */
(function () {
  var MAP = null;            // { 汉字: [读音, ...] }
  var cache = {};            // 原中文串 -> { full, init } 缓存
  var _resolve, ready = new Promise(function (r) { _resolve = r; });

  function load(url) {
    fetch(url || 'data/pinyin-map.json')
      .then(function (r) { return r.json(); })
      .then(function (m) { MAP = m; _resolve(true); })
      .catch(function () { MAP = {}; _resolve(false); });
    return ready;
  }

  /* 中文串 -> { full:全拼, init:首字母 }，每字取第一个读音；非汉字里的字母/数字
     原样并入(让"Forma 蓝图"这种中英混名也能整体拼)，标点/空格跳过。 */
  function keys(zh) {
    if (!zh) return { full: '', init: '' };
    if (cache[zh]) return cache[zh];
    var full = '', init = '';
    for (var i = 0; i < zh.length; i++) {
      var ch = zh[i], rd = MAP && MAP[ch];
      if (rd && rd.length) { full += rd[0]; init += rd[0].charAt(0); }
      else if (/[a-z0-9]/i.test(ch)) { var c = ch.toLowerCase(); full += c; init += c; }
    }
    var k = { full: full, init: init };
    cache[zh] = k;
    return k;
  }

  /* q(小写) 是否命中 zh 的拼音：全拼子串 或 首字母子串。 */
  function pyHit(zh, q) {
    if (!MAP || !q) return false;
    var k = keys(zh);
    return (k.full && k.full.indexOf(q) !== -1) || (k.init && k.init.indexOf(q) !== -1);
  }

  /* 轻量模糊：q 的字符按序出现在 text 中(允许间隔)，且命中跨度不过分大，
     避免 "ab" 命中 "a……b" 这类太远的误配。q/text 均小写，q 至少 2 字符。 */
  function subseq(text, q) {
    if (!q || q.length < 2 || !text) return false;
    var ti = 0, qi = 0, first = -1, last = -1;
    for (; ti < text.length && qi < q.length; ti++) {
      if (text.charAt(ti) === q.charAt(qi)) { if (first < 0) first = ti; last = ti; qi++; }
    }
    if (qi < q.length) return false;
    return (last - first) <= q.length * 3 + 2;
  }

  window.PYS = { ready: ready, load: load, keys: keys, pyHit: pyHit, subseq: subseq };
})();
