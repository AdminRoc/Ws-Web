/* ═══════════════════════════════════════════════════════════
   fui-core.js —— Ws-Web 全站 FUI 地基
   在 <head> 内、CSS 之后同步引入。立即读取主题、注入开机遮罩，
   字体就绪后自动淡出。纯叠加，不触碰任何业务逻辑。
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── 主题：早于绘制从 localStorage 恢复，避免闪烁 ── */
  var THEME_KEY = 'fui_theme';
  /* 读顺序：① localStorage 存储偏好 → ② HTML data-fui-theme 属性（页面默认） → ③ gold */
  var _htmlAttr = document.documentElement.getAttribute('data-fui-theme') || 'gold';
  var _theme = _htmlAttr;
  try {
    var _stored = localStorage.getItem(THEME_KEY);
    if (_stored) _theme = _stored;
  } catch (e) {}

  function applyTheme(t) {
    if (t === 'cyber') document.documentElement.setAttribute('data-fui-theme', 'cyber');
    else document.documentElement.removeAttribute('data-fui-theme');
  }
  applyTheme(_theme);

  function updateToggleLabels() {
    var btns = document.querySelectorAll('.ws-theme-toggle');
    for (var i = 0; i < btns.length; i++) {
      btns[i].setAttribute('data-theme', _theme);
      var lbl = btns[i].querySelector('.ws-theme-toggle-label');
      if (lbl) lbl.textContent = _theme === 'cyber' ? '赛博朋克' : 'Orokin 金';
    }
  }

  window.fuiTheme = {
    get: function () { return _theme; },
    set: function (t) {
      _theme = (t === 'cyber') ? 'cyber' : 'gold';
      try { localStorage.setItem(THEME_KEY, _theme); } catch (e) {}
      applyTheme(_theme); updateToggleLabels();
    },
    toggle: function () { this.set(_theme === 'cyber' ? 'gold' : 'cyber'); }
  };

  /* 点击委托：任意 .ws-theme-toggle 均可切换 */
  document.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('.ws-theme-toggle');
    if (t) { e.preventDefault(); window.fuiTheme.toggle(); }
  });

  /* DOM 就绪后向 footer.site-footer 注入切换按钮 */
  document.addEventListener('DOMContentLoaded', function () {
    var footer = document.querySelector('footer.site-footer');
    if (footer && !footer.querySelector('.ws-theme-toggle')) {
      var wrap = document.createElement('div');
      wrap.className = 'ws-theme-toggle-row';
      wrap.innerHTML = '<button class="ws-theme-toggle" type="button" aria-label="切换视觉风格">'
        + '<span class="ws-theme-toggle-icon" aria-hidden="true">◈</span>'
        + '<span class="ws-theme-toggle-label">Orokin 金</span></button>';
      footer.appendChild(wrap);
    }
    updateToggleLabels();
  });

  /* ── 开机遮罩（防重复注入） ── */
  if (document.getElementById('fui-boot')) return;

  var MIN_VISIBLE = 600;
  var SAFETY      = 5000;
  var startTime   = Date.now();
  var finished    = false;

  var SVG_NS = 'http://www.w3.org/2000/svg';
  function svg(tag, attrs) {
    var el = document.createElementNS(SVG_NS, tag);
    for (var k in attrs) el.setAttribute(k, attrs[k]);
    return el;
  }

  var boot = document.createElement('div');
  boot.id = 'fui-boot';
  boot.setAttribute('aria-hidden', 'true');

  /* HUD 瞄准环 SVG */
  var reticle = svg('svg', { 'class': 'fui-boot-reticle', viewBox: '0 0 100 100' });
  reticle.appendChild(svg('circle', { 'class': 'fui-ring-outer', cx: 50, cy: 50, r: 44 }));
  reticle.appendChild(svg('circle', { 'class': 'fui-ring-inner', cx: 50, cy: 50, r: 33 }));
  var ticks = svg('g', { 'class': 'fui-tick' });
  [[50,4,50,12],[50,88,50,96],[4,50,12,50],[88,50,96,50]].forEach(function (c) {
    ticks.appendChild(svg('line', { x1: c[0], y1: c[1], x2: c[2], y2: c[3] }));
  });
  reticle.appendChild(ticks);
  reticle.appendChild(svg('circle', { 'class': 'fui-core-dot', cx: 50, cy: 50, r: 3.5 }));
  boot.appendChild(reticle);

  var brand = document.createElement('div');
  brand.className = 'fui-boot-brand';
  brand.innerHTML = 'WFSPEED.RUN<small>WARFRAME LEADERBOARD</small>';
  boot.appendChild(brand);

  var prog = document.createElement('div');
  prog.className = 'fui-boot-progress';
  boot.appendChild(prog);

  (document.body || document.documentElement).appendChild(boot);

  function hide() {
    if (finished) return;
    finished = true;
    var wait = Math.max(0, MIN_VISIBLE - (Date.now() - startTime));
    setTimeout(function () {
      boot.classList.add('fui-done');
      if (document.body) document.body.classList.add('fui-in');
      setTimeout(function () { if (boot.parentNode) boot.parentNode.removeChild(boot); }, 600);
    }, wait);
  }

  window.__fuiBoot = { done: hide };

  /* 字体就绪后自动淡出 */
  (document.fonts ? document.fonts.ready : Promise.resolve())
    .catch(function () {})
    .then(function () { hide(); });

  /* 兜底 */
  setTimeout(hide, SAFETY);
}());
