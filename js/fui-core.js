/* ═══════════════════════════════════════════════════════════
   fui-core.js —— Ws-Web 全站 FUI 地基
   在 <head> 内、CSS 之后同步引入。立即读取主题；若页面无自有载入
   遮罩则注入标准暗金带Logo遮罩；字体就绪后自动淡出。
   纯叠加，不触碰任何业务逻辑。
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── 主题：早于绘制从 localStorage 恢复，避免闪烁 ── */
  var THEME_KEY = 'fui_theme';
  /* 读顺序：① localStorage → ② HTML data-fui-theme → ③ gold */
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

  document.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('.ws-theme-toggle');
    if (t) { e.preventDefault(); window.fuiTheme.toggle(); }
  });

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

  /* ── 载入遮罩 ── */
  var MIN_VISIBLE = 600;
  var SAFETY      = 5000;
  var startTime   = Date.now();
  var finished    = false;

  /* 检测页面是否已有自有载入遮罩（item/player/worldstate/eelog等） */
  var _hasOwn = !!(document.getElementById('load-overlay')
               || document.getElementById('ws-splash')
               || document.getElementById('el-overlay'));

  function dismiss(overlay) {
    if (finished) return;
    finished = true;
    var wait = Math.max(0, MIN_VISIBLE - (Date.now() - startTime));
    setTimeout(function () {
      overlay.classList.add('lo-close');
      if (document.body) document.body.classList.add('fui-in');
      setTimeout(function () { if (overlay.parentNode) overlay.parentNode.removeChild(overlay); }, 950);
    }, wait);
  }

  if (_hasOwn) {
    /* 已有遮罩：fui-core 只管主题/切换按钮，对外暴露空 done() 钩子供 shared.js 兼容调用 */
    window.__fuiBoot = { done: function () {
      if (document.body) document.body.classList.add('fui-in');
    }};
    return;
  }

  /* 注入标准暗金带Logo遮罩 */
  var ov = document.createElement('div');
  ov.id = 'load-overlay';
  ov.setAttribute('aria-hidden', 'true');
  ov.innerHTML = '<div class="lo-grid"></div>'
    + '<div class="lo-scan"></div>'
    + '<div class="lo-core">'
    +   '<div class="lo-ring lo-ring1"></div>'
    +   '<div class="lo-ring lo-ring2"></div>'
    +   '<div class="lo-ring lo-ring3"></div>'
    +   '<img class="lo-logo" src="picture/WS-logo-2.png" alt="WS">'
    + '</div>'
    + '<div class="lo-title">WFSPEED.RUN</div>'
    + '<div class="lo-sub">WARFRAME LEADERBOARD'
    +   '<span class="lo-d">·</span><span class="lo-d">·</span><span class="lo-d">·</span>'
    + '</div>'
    + '<div class="lo-bar"><span></span></div>';

  (document.body || document.documentElement).appendChild(ov);

  window.__fuiBoot = { done: function () { dismiss(ov); } };

  (document.fonts ? document.fonts.ready : Promise.resolve())
    .catch(function () {})
    .then(function () { dismiss(ov); });

  setTimeout(function () { dismiss(ov); }, SAFETY);
}());
