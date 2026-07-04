/* ═══════════════════════════════════════════════════════════
   fui-core.js —— Ws-Web 全站 FUI 地基
   在 <head> 内、CSS 之后同步引入。立即读取主题；注入战术接入
   界面（精美载入动画），字体/数据就绪后淡出，页面元素才渐显。
   纯叠加，不触碰任何业务逻辑。
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── 主题 ── */
  var THEME_KEY = 'fui_theme';
  var _htmlAttr = document.documentElement.getAttribute('data-fui-theme') || 'gold';
  var _theme = _htmlAttr;
  try { var _s = localStorage.getItem(THEME_KEY); if (_s) _theme = _s; } catch (e) {}
  function applyTheme(t) {
    if (t === 'cyber') document.documentElement.setAttribute('data-fui-theme', 'cyber');
    else document.documentElement.removeAttribute('data-fui-theme');
  }
  applyTheme(_theme);

  function updateToggleLabels() {
    document.querySelectorAll('.ws-theme-toggle').forEach(function(b) {
      b.setAttribute('data-theme', _theme);
      var l = b.querySelector('.ws-theme-toggle-label');
      if (l) l.textContent = _theme === 'cyber' ? '赛博朋克' : 'Orokin 金';
    });
  }
  window.fuiTheme = {
    get: function() { return _theme; },
    set: function(t) {
      _theme = t === 'cyber' ? 'cyber' : 'gold';
      try { localStorage.setItem(THEME_KEY, _theme); } catch (e) {}
      applyTheme(_theme); updateToggleLabels();
    },
    toggle: function() { this.set(_theme === 'cyber' ? 'gold' : 'cyber'); }
  };
  document.addEventListener('click', function(e) {
    var t = e.target.closest && e.target.closest('.ws-theme-toggle');
    if (t) { e.preventDefault(); window.fuiTheme.toggle(); }
  });
  document.addEventListener('DOMContentLoaded', function() {
    var footer = document.querySelector('footer.site-footer');
    if (footer && !footer.querySelector('.ws-theme-toggle')) {
      var w = document.createElement('div');
      w.className = 'ws-theme-toggle-row';
      w.innerHTML = '<button class="ws-theme-toggle" type="button" aria-label="切换视觉风格">'
        + '<span class="ws-theme-toggle-icon" aria-hidden="true">◈</span>'
        + '<span class="ws-theme-toggle-label">Orokin 金</span></button>';
      footer.appendChild(w);
    }
    updateToggleLabels();
  });

  /* ── 各页面标题映射 ── */
  var PAGE_TITLES = {
    'arbitration.html':      { cn: '仲裁竞速',   en: 'ARBITRATION SPEED' },
    'assassination.html':    { cn: '刺杀竞速',   en: 'ASSASSINATION SPEED' },
    'cambire.html':          { cn: '元素转换竞速', en: 'CAMBIRE SPEED' },
    'capture.html':          { cn: '捕获竞速',   en: 'CAPTURE SPEED' },
    'defection.html':        { cn: '叛逃任务竞速', en: 'DEFECTION SPEED' },
    'defense-relic.html':    { cn: '裂缝防御竞速', en: 'DEFENSE RELIC SPEED' },
    'disruption-duo.html':   { cn: '中断竞速·双人', en: 'DISRUPTION DUO' },
    'disruption-multi.html': { cn: '中断竞速·多人', en: 'DISRUPTION MULTI' },
    'disruption.html':       { cn: '中断竞速',   en: 'DISRUPTION SPEED' },
    'eidolon-macro.html':    { cn: '夜灵竞速·无限', en: 'EIDOLON MACRO' },
    'eidolon.html':          { cn: '夜灵竞速',   en: 'EIDOLON SPEED' },
    'exterminate.html':      { cn: '歼灭竞速',   en: 'EXTERMINATE SPEED' },
    'hollvania.html':        { cn: '1999 竞速',  en: 'HOLLVANIA SPEED' },
    'profit-taker-macro.html': { cn: '大蜘蛛竞速·无限', en: 'PROFIT-TAKER MACRO' },
    'profit-taker.html':     { cn: '大蜘蛛竞速', en: 'PROFIT-TAKER SPEED' },
    'rescue.html':           { cn: '救援竞速',   en: 'RESCUE SPEED' },
    'ropalolyst.html':       { cn: '蝠力使竞速', en: 'ROPALOLYST SPEED' },
    'sabotage.html':         { cn: '破坏竞速',   en: 'SABOTAGE SPEED' },
    'skirmish.html':         { cn: '前哨战竞速', en: 'SKIRMISH SPEED' },
    'special-events.html':   { cn: '特别活动竞速', en: 'SPECIAL EVENTS' },
    'special_challenge.html':{ cn: '特殊挑战',   en: 'SPECIAL CHALLENGE' },
    'spy.html':              { cn: '间谍竞速',   en: 'SPY SPEED' },
    'item.html':             { cn: '物品索引',   en: 'ITEM DATABASE' },
    'player.html':           { cn: '玩家数据',   en: 'PLAYER PROFILE' },
    'search.html':           { cn: '全站搜索',   en: 'GLOBAL SEARCH' },
    'about.html':            { cn: '关于本站',   en: 'ABOUT' }
  };

  /* 侧边数据流文字素材 */
  var _hexChars = '0123456789ABCDEF';
  function _rHex(n) {
    var s = ''; for (var i = 0; i < n; i++) s += _hexChars[Math.floor(Math.random() * 16)];
    return s;
  }
  function _genSideLines() {
    var lines = [];
    for (var i = 0; i < 40; i++) {
      var r = Math.random();
      if (r < 0.4) lines.push(_rHex(8) + ' ' + _rHex(4));
      else if (r < 0.7) lines.push('0x' + _rHex(6));
      else lines.push(_rHex(4) + ':' + _rHex(4) + ':' + _rHex(4));
    }
    return lines.join('\n');
  }

  /* UTC 时钟 */
  var _utcTimer = null;
  function _startUtc(el) {
    function tick() {
      var d = new Date();
      el.textContent = 'UTC ' +
        String(d.getUTCHours()).padStart(2,'0') + ':' +
        String(d.getUTCMinutes()).padStart(2,'0') + ':' +
        String(d.getUTCSeconds()).padStart(2,'0');
    }
    tick();
    _utcTimer = setInterval(tick, 1000);
  }

  /* ── 已有自有载入遮罩的页面跳过注入 ── */
  var _hasOwn = !!(document.getElementById('ws-splash') || document.getElementById('el-overlay'));
  if (_hasOwn) {
    window.__fuiBoot = { done: function() { if (document.body) document.body.classList.add('fui-in'); } };
    return;
  }

  /* ── 确定当前页面标题 ── */
  var _pageName = (location.pathname.split('/').pop() || 'index.html').replace(/\?.*$/, '');
  var _titles = PAGE_TITLES[_pageName] || { cn: 'WFSPEED', en: 'WARFRAME LEADERBOARD' };

  /* ── 注入 #fui-splash HTML ── */
  var spl = document.createElement('div');
  spl.id = 'fui-splash';
  spl.setAttribute('aria-hidden', 'true');
  spl.innerHTML =
    '<div class="fui-spl-scan"></div>'
    + '<div class="fui-spl-corner fui-spl-corner--tl"></div>'
    + '<div class="fui-spl-corner fui-spl-corner--tr"></div>'
    + '<div class="fui-spl-corner fui-spl-corner--bl"></div>'
    + '<div class="fui-spl-corner fui-spl-corner--br"></div>'
    + '<div class="fui-spl-side fui-spl-side--l" id="fui-spl-left"></div>'
    + '<div class="fui-spl-side fui-spl-side--r" id="fui-spl-right"></div>'
    + '<div class="fui-spl-center">'
    +   '<div class="fui-spl-hex-area">'
    +     '<div class="fui-spl-hex-wrap" id="fui-spl-hex">'
    +       '<svg class="fui-spl-ring-svg" viewBox="-110 -110 220 220" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">'
    +         '<circle cx="0" cy="0" r="102" fill="none" stroke="rgba(201,164,50,.35)" stroke-width="1" stroke-dasharray="30 130"/>'
    +         '<circle class="fui-spl-ring-o" cx="0" cy="0" r="88"/>'
    +         '<circle class="fui-spl-ring-i" cx="0" cy="0" r="76"/>'
    +         '<line class="fui-spl-ring-tk" x1="0" y1="-88" x2="0" y2="-100"/>'
    +         '<line class="fui-spl-ring-tk" x1="88" y1="0" x2="100" y2="0"/>'
    +         '<line class="fui-spl-ring-tk" x1="0" y1="88" x2="0" y2="100"/>'
    +         '<line class="fui-spl-ring-tk" x1="-88" y1="0" x2="-100" y2="0"/>'
    +       '</svg>'
    +     '</div>'
    +     '<div class="fui-spl-logo-cnt">'
    +       '<div class="fui-spl-logo-bg"></div>'
    +       '<img class="fui-spl-logo-img" src="picture/WS-logo-2.png" alt="" aria-hidden="true">'
    +     '</div>'
    +   '</div>'
    +   '<div class="fui-spl-label-cn" id="fui-spl-cn">' + _titles.cn + '</div>'
    +   '<div class="fui-spl-label-en" id="fui-spl-en">' + _titles.en + ' <span class="fui-spl-dot">◈</span> UPLINK</div>'
    +   '<div class="fui-spl-sr">'
    +     '<span class="fui-spl-sr-dot"></span>'
    +     '<span class="fui-spl-sr-txt" id="fui-spl-status">ESTABLISHING CONNECTION</span>'
    +   '</div>'
    +   '<div class="fui-spl-bar">'
    +     '<div class="fui-spl-bar-track"><div class="fui-spl-bar-fill" id="fui-spl-fill"></div></div>'
    +     '<span class="fui-spl-bar-pct" id="fui-spl-pct">0%</span>'
    +   '</div>'
    +   '<div class="fui-spl-info" id="fui-spl-info">// INITIALIZING TACTICAL UPLINK</div>'
    + '</div>'
    + '<div class="fui-spl-footer">'
    +   '<span>WFSpeed.run</span>'
    +   '<span>TENNO TACTICAL NETWORK</span>'
    +   '<span id="fui-spl-utc">UTC 00:00:00</span>'
    + '</div>';

  (document.body || document.documentElement).appendChild(spl);

  /* ── 动画控制器 ── */
  var _statusEl = document.getElementById('fui-spl-status');
  var _infoEl   = document.getElementById('fui-spl-info');
  var _fillEl   = document.getElementById('fui-spl-fill');
  var _pctEl    = document.getElementById('fui-spl-pct');
  var _leftEl   = document.getElementById('fui-spl-left');
  var _rightEl  = document.getElementById('fui-spl-right');
  var _utcEl    = document.getElementById('fui-spl-utc');
  var _hexWrap  = document.getElementById('fui-spl-hex');

  /* 侧边数据流 */
  if (_leftEl)  _leftEl.textContent  = _genSideLines();
  if (_rightEl) _rightEl.textContent = _genSideLines();
  if (_utcEl)   _startUtc(_utcEl);

  /* 进度条 */
  var _pct = 0;
  function _setBar(v) {
    _pct = Math.min(100, Math.max(0, v));
    if (_fillEl) _fillEl.style.width = _pct + '%';
    if (_pctEl)  _pctEl.textContent  = Math.round(_pct) + '%';
  }

  /* 状态文字阶段 */
  var _stages = [
    { at: 200,  status: 'ESTABLISHING CONNECTION',    info: '// INITIALIZING TACTICAL UPLINK',      pct: 12 },
    { at: 500,  status: 'AUTHENTICATING TENNO ID',    info: '// VERIFYING ACCESS CREDENTIALS',       pct: 32 },
    { at: 900,  status: 'DOWNLOADING MISSION DATA',   info: '// LOADING ' + _titles.en,             pct: 58 },
    { at: 1300, status: 'SYNCHRONIZING LEADERBOARD',  info: '// SYNCING OPERATIONAL RECORDS',        pct: 80 },
    { at: 1700, status: 'UPLINK ESTABLISHED',         info: '// ALL SYSTEMS NOMINAL · READY',        pct: 96 }
  ];
  _stages.forEach(function(s) {
    setTimeout(function() {
      if (_statusEl) _statusEl.textContent = s.status;
      if (_infoEl)   _infoEl.textContent   = s.info;
      _setBar(s.pct);
    }, s.at);
  });

  /* 环旋转 */
  setTimeout(function() {
    if (_hexWrap) _hexWrap.classList.add('fui-spl-spinning');
  }, 1100);

  /* ── 淡出逻辑 ── */
  var _dismissed = false;
  var MIN_VISIBLE = 2000;
  var _startTime  = Date.now();

  function _dismiss() {
    if (_dismissed) return;
    _dismissed = true;
    clearInterval(_utcTimer);
    _setBar(100);
    var remain = Math.max(0, MIN_VISIBLE - (Date.now() - _startTime));
    setTimeout(function() {
      spl.classList.add('fui-splash--done');
      if (document.body) document.body.classList.add('fui-in');
      setTimeout(function() { if (spl.parentNode) spl.parentNode.removeChild(spl); }, 850);
    }, remain);
  }

  /* 对外接口：数据驱动页面调用 done() 可精确控制消失时机 */
  window.__fuiBoot = { done: _dismiss };

  /* 非手动控制页面：字体就绪后自动淡出 */
  (document.fonts ? document.fonts.ready : Promise.resolve())
    .catch(function() {})
    .then(function() {
      if (!window.__fuiBootManual) _dismiss();
    });

  /* 兜底 */
  setTimeout(_dismiss, 8000);
}());
