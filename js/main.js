/* ════════════════════════════════════════════════════════════
   main.js  —  全站通用脚本（先于 data/*.js 加载）
   ════════════════════════════════════════════════════════════ */

/* ══════════════════════════════════════════════════════════
   1. 星空 Canvas
   ══════════════════════════════════════════════════════════ */
class StarField {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    if (getComputedStyle(this.canvas).display === 'none') return;  /* Bug3-fix: 跳过被 CSS 隐藏的 canvas */
    this.ctx    = this.canvas.getContext('2d');
    this.stars  = [];
    this.shoots = [];
    this._raf   = null;
    this._resize = this._resize.bind(this);
    window.addEventListener('resize', this._resize);
    this._resize();
    this._animate();
  }
  _resize() {
    this.canvas.width  = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this._createStars(320);
  }
  _createStars(count) {
    const { width: w, height: h } = this.canvas;
    this.stars = Array.from({ length: count }, () => {
      const r = Math.random();
      let color;
      if      (r < .55) color = '#ffffff';
      else if (r < .75) color = '#b8d8ff';
      else if (r < .88) color = '#ffe8c8';
      else              color = '#00d4ff';
      return { x: Math.random()*w, y: Math.random()*h,
               size: Math.random()*1.7+.2, base: Math.random()*.55+.2,
               speed: Math.random()*.025+.004, phase: Math.random()*Math.PI*2, color };
    });
  }
  _maybeShoot() {
    if (Math.random() > .004 || this.shoots.length >= 3) return;
    const { width: w, height: h } = this.canvas;
    const ang = Math.PI/4 + (Math.random()-.5)*.35;
    const spd = Math.random()*9+6;
    this.shoots.push({ x: Math.random()*w*.75, y: Math.random()*h*.35,
      dx: Math.cos(ang)*spd, dy: Math.sin(ang)*spd, len: Math.random()*160+80, op: 1 });
  }
  _animate() {
    const ctx = this.ctx;
    const { width: w, height: h } = this.canvas;
    const now = performance.now()*.001;
    const bg = ctx.createLinearGradient(0,0,0,h);
    bg.addColorStop(0,'#07080f'); bg.addColorStop(.45,'#090c18'); bg.addColorStop(1,'#070810');
    ctx.fillStyle = bg; ctx.fillRect(0,0,w,h);
    this.stars.forEach(s => {
      const op = s.base*(.72+.28*Math.sin(now*s.speed*55+s.phase));
      ctx.save(); ctx.globalAlpha = op;
      if (s.size > 1.1) {
        const gr = ctx.createRadialGradient(s.x,s.y,0,s.x,s.y,s.size*3.5);
        gr.addColorStop(0,s.color); gr.addColorStop(.4,s.color+'55'); gr.addColorStop(1,'transparent');
        ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(s.x,s.y,s.size*3.5,0,Math.PI*2); ctx.fill();
      }
      ctx.fillStyle = s.color; ctx.beginPath(); ctx.arc(s.x,s.y,s.size,0,Math.PI*2); ctx.fill();
      ctx.restore();
    });
    this._maybeShoot();
    this.shoots = this.shoots.filter(s => s.op > .02);
    this.shoots.forEach(s => {
      const tail = s.len/Math.hypot(s.dx,s.dy);
      const gr = ctx.createLinearGradient(s.x,s.y,s.x-s.dx*tail,s.y-s.dy*tail);
      gr.addColorStop(0,`rgba(255,255,255,${s.op})`);
      gr.addColorStop(.25,`rgba(0,212,255,${s.op*.6})`);
      gr.addColorStop(1,'transparent');
      ctx.save(); ctx.globalAlpha=s.op; ctx.strokeStyle=gr; ctx.lineWidth=1.5;
      ctx.beginPath(); ctx.moveTo(s.x,s.y); ctx.lineTo(s.x-s.dx*tail,s.y-s.dy*tail);
      ctx.stroke(); ctx.restore();
      s.x+=s.dx; s.y+=s.dy; s.op-=.018;
    });
    this._raf = requestAnimationFrame(() => this._animate());
  }
  destroy() { cancelAnimationFrame(this._raf); window.removeEventListener('resize',this._resize); }
}

/* ══════════════════════════════════════════════════════════
   2. 导航栏
   ══════════════════════════════════════════════════════════ */
function initNav() {
  /* PC 端：下拉菜单由 CSS :hover 控制，此处仅处理点击区域外关闭 */
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.site-nav')) {
      document.querySelectorAll('.nav-item.mob-open').forEach(function(i) {
        i.classList.remove('mob-open');
      });
    }
  });
}

/* ══════════════════════════════════════════════════════════
   2b. 手机端全新导航抽屉
   ══════════════════════════════════════════════════════════ */
function initMobileNav() {
  var hamburger = document.querySelector('.nav-hamburger');
  if (!hamburger) return;

  /* ── 全部菜单数据 ── */
  /* ⚠️  维护提醒：如新增/修改榜单页面，需同步更新此数组，否则移动端菜单会缺项。
       页面列表以 navigation 导航栏 HTML 为准（各 HTML 页面的 .site-nav 结构）。 */
  var MENU = [
    { cn: '中断竞速', sub: [
        { cn: '单人', href: 'disruption.html' },
        { cn: '双人', href: 'disruption-duo.html' },
        { cn: '多人', href: 'disruption-multi.html' }
    ]},
    { cn: '夜灵竞速', sub: [
        { cn: '有限制',  href: 'eidolon.html' },
        { cn: '无限制', href: 'eidolon-macro.html' }
    ]},
    { cn: '蜘蛛竞速', sub: [
        { cn: '有限制',  href: 'profit-taker.html' },
        { cn: '无限制', href: 'profit-taker-macro.html' }
    ]},
    { cn: '捕获',           href: 'capture.html' },
    { cn: '歼灭',           href: 'exterminate.html' },
    { cn: '救援',           href: 'rescue.html' },
    { cn: '破坏',           href: 'sabotage.html' },
    { cn: '间谍',           href: 'spy.html' },
    { cn: '刺杀',           href: 'assassination.html' },
    { cn: '特殊挑战',       href: 'special_challenge.html' },
    { cn: '防御裂缝60轮',   href: 'defense-relic.html' },
    { cn: '元素转换',       href: 'cambire.html' },
    { cn: '1999 任务',      href: 'hollvania.html' },
    { cn: '蝠力使',         href: 'ropalolyst.html' },
    { cn: '面纱前哨战',     href: 'skirmish.html' },
    { cn: '叛逃任务',       href: 'defection.html' },
    { cn: '仲裁任务',       href: 'arbitration.html' },
    { cn: '站内特殊活动',   href: 'special-events.html' },
    { cn: '关于本站',       href: 'about.html' }
  ];

  var currentPage = (location.pathname.split('/').pop() || 'index.html')
                      .split('?')[0].split('#')[0];

  /* ── 创建遮罩层 ── */
  var overlay = document.createElement('div');
  overlay.className = 'mob-nav-overlay';
  document.body.appendChild(overlay);

  /* ── 创建抽屉面板 ── */
  var drawer = document.createElement('div');
  drawer.className = 'mob-nav-drawer';
  document.body.appendChild(drawer);

  /* ── 构建菜单项 ── */
  MENU.forEach(function(item) {
    if (item.sub) {
      /* 有子菜单的父级 */
      var group = document.createElement('div');

      var parent = document.createElement('div');
      parent.className = 'mnd-item';
      var isGroupActive = item.sub.some(function(s) { return s.href === currentPage; });
      if (isGroupActive) parent.classList.add('mnd-active');

      var label = document.createElement('span');
      label.textContent = item.cn;

      var arrow = document.createElement('span');
      arrow.className = 'mnd-arrow';
      arrow.textContent = '▶';

      parent.appendChild(label);
      parent.appendChild(arrow);

      var sub = document.createElement('div');
      sub.className = 'mnd-sub';

      item.sub.forEach(function(s) {
        var a = document.createElement('a');
        a.className = 'mnd-sub-item';
        a.href = s.href;
        a.textContent = s.cn;
        if (s.href === currentPage) a.classList.add('mnd-active');
        sub.appendChild(a);
      });

      /* 点击父级切换子菜单 */
      function toggleSub(e) {
        e.stopPropagation();
        var isOpen = sub.classList.contains('mnd-sub-open');
        /* 收起其他所有子菜单 */
        drawer.querySelectorAll('.mnd-sub.mnd-sub-open').forEach(function(p) {
          p.classList.remove('mnd-sub-open');
        });
        drawer.querySelectorAll('.mnd-item.mnd-parent-open').forEach(function(p) {
          p.classList.remove('mnd-parent-open');
        });
        if (!isOpen) {
          sub.classList.add('mnd-sub-open');
          parent.classList.add('mnd-parent-open');
        }
      }
      parent.addEventListener('click', toggleSub);
      parent.addEventListener('touchend', function(e) {
        e.preventDefault();
        toggleSub(e);
      });

      group.appendChild(parent);
      group.appendChild(sub);
      drawer.appendChild(group);

    } else {
      /* 普通链接项 */
      var a = document.createElement('a');
      a.className = 'mnd-item';
      a.href = item.href;
      a.textContent = item.cn;
      if (item.href === currentPage) a.classList.add('mnd-active');
      drawer.appendChild(a);
    }
  });

  /* ── 开关函数（含 iOS 兼容的 body 滚动锁定） ── */
  var _savedScrollY = 0;

  function openDrawer() {
    /* 记录当前滚动位置，再锁定 body（iOS Safari 必须 position:fixed 才能真正阻止下层滚动） */
    _savedScrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top      = '-' + _savedScrollY + 'px';
    document.body.style.left     = '0';
    document.body.style.right    = '0';

    hamburger.classList.add('open');
    overlay.classList.add('mnd-show');
    drawer.classList.add('mnd-show');
  }

  function closeDrawer() {
    /* 先还原 body，再恢复滚动位置（同步执行，避免视觉跳动） */
    var sy = _savedScrollY;
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.top      = '';
    document.body.style.left     = '';
    document.body.style.right    = '';
    window.scrollTo(0, sy);

    hamburger.classList.remove('open');
    overlay.classList.remove('mnd-show');
    drawer.classList.remove('mnd-show');
  }

  /* ── 汉堡按钮绑定 ── */
  hamburger.addEventListener('click', function(e) {
    e.stopPropagation();
    if (drawer.classList.contains('mnd-show')) closeDrawer();
    else openDrawer();
  });

  /* ── 点击遮罩关闭 ── */
  overlay.addEventListener('click', closeDrawer);

  /* ── 窗口变大时自动关闭（切换到PC） ── */
  window.addEventListener('resize', function() {
    if (window.innerWidth > 860) closeDrawer();
  });

  /* ── 手机端"更多榜单"按钮：展开/收起下方面板 ── */
  /* 注意：PC 端 #nav-more-btn 由各页面内联脚本单独处理，此处不冲突 */
  var mobMoreBtn = document.getElementById('nav-more-mobile');
  var mobPanel  = document.getElementById('mob-more-panel');
  if (mobMoreBtn && mobPanel) {
    mobMoreBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      mobPanel.classList.toggle('open');
    });
    document.addEventListener('click', function(e) {
      if (!mobPanel.contains(e.target) && !mobMoreBtn.contains(e.target)) {
        mobPanel.classList.remove('open');
      }
    });
  }
}

/* ══════════════════════════════════════════════════════════
   3. 滚动进入动画
   ══════════════════════════════════════════════════════════ */
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const obs = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    }),
    { threshold: .12 }
  );
  els.forEach(el => obs.observe(el));
}

/* ══════════════════════════════════════════════════════════
   4. 工具函数
   ══════════════════════════════════════════════════════════ */
function parseTimeMs(timeStr) {
  if (!timeStr) return Infinity;
  const parts = timeStr.split(':');
  let ms = 0;
  if (parts.length === 3)      ms = (parseInt(parts[0],10)*3600 + parseInt(parts[1],10)*60 + parseFloat(parts[2]))*1000;
  else if (parts.length === 2) ms = (parseInt(parts[0],10)*60   + parseFloat(parts[1]))*1000;
  else                         ms = parseFloat(parts[0])*1000;
  return isNaN(ms) ? Infinity : ms;
}

function _isValidVideoUrl(url) {
  if (!url || typeof url !== 'string' || url.trim().length < 10) return false;
  try {
    var u = new URL(url.trim());
    // 裸 youtu.be（无视频 ID）
    if (u.hostname === 'youtu.be' && (u.pathname === '/' || u.pathname.length <= 1)) return false;
    // youtube.com 无 v= 参数且无 /live/ /shorts/
    if ((u.hostname.includes('youtube.com') && u.pathname === '/') &&
        !u.searchParams.get('v')) return false;
    return true;
  } catch(e) { return false; }
}

function getVideoUrls(rec) {
  if (rec.videoUrls && Array.isArray(rec.videoUrls))
    return rec.videoUrls.filter(u => u && typeof u === 'string' && _isValidVideoUrl(u));
  if (rec.videoUrl && typeof rec.videoUrl === 'string' && _isValidVideoUrl(rec.videoUrl))
    return [rec.videoUrl.trim()];
  return [];
}

function getDomain(url) {
  try { return new URL(url).hostname.replace(/^www\./, ''); }
  catch(e) { return url.slice(0, 24); }
}

/* ══════════════════════════════════════════════════════════
   5. 多视角弹窗（注入样式 + 创建 DOM）
   ══════════════════════════════════════════════════════════ */

/* --- 注入弹窗样式 --- */
(function injectPopupStyle() {
  const s = document.createElement('style');
  s.textContent = `
/* ── 多视角弹窗（暗金风格） ── */
#vp-popup {
  position: fixed;
  z-index: 99999;
  min-width: 230px;
  max-width: 350px;
  pointer-events: auto;
  opacity: 0;
  transform: translateY(-10px) scale(0.94);
  transition: opacity .2s cubic-bezier(.22,.68,0,1.2),
              transform .2s cubic-bezier(.22,.68,0,1.2);
  background: rgba(10, 7, 2, 0.98);
  border: 1px solid rgba(185,142,52,.5);
  border-radius: 4px;
  overflow: hidden;
  box-shadow:
    0 0 0 1px rgba(185,142,52,.08),
    0 20px 65px rgba(0,0,0,.98),
    0 0 50px rgba(185,142,52,.18),
    inset 0 1px 0 rgba(185,142,52,.22);
  backdrop-filter: blur(28px);
  -webkit-backdrop-filter: blur(28px);
  visibility: hidden;
}
#vp-popup.vp-show {
  visibility: visible;
  opacity: 1;
  transform: translateY(0) scale(1);
}
.vp-head {
  display: flex;
  align-items: center;
  gap: .5rem;
  padding: .55rem 1rem;
  font-family: 'Orbitron', sans-serif;
  font-size: .88rem;
  font-weight: 700;
  letter-spacing: .14em;
  color: rgba(185,142,52,.65);
  text-transform: uppercase;
  border-bottom: 1px solid rgba(185,142,52,.14);
  background: linear-gradient(90deg,
    rgba(185,142,52,.08) 0%,
    rgba(140,95,20,.04) 100%);
}
.vp-head-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px; height: 18px;
  background: rgba(185,142,52,.15);
  border-radius: 50%;
  border: 1px solid rgba(185,142,52,.35);
}
.vp-row {
  display: flex;
  align-items: center;
  gap: .7rem;
  padding: .72rem 1rem;
  text-decoration: none;
  color: rgba(185,155,90,.8);
  font-family: 'Orbitron', sans-serif;
  font-size: .96rem;
  font-weight: 600;
  letter-spacing: .06em;
  border-bottom: 1px solid rgba(185,142,52,.08);
  position: relative;
  overflow: hidden;
  transition:
    background .15s ease,
    color .15s ease,
    padding-left .18s cubic-bezier(.22,.68,0,1.2);
  cursor: pointer;
  white-space: nowrap;
}
.vp-row:last-child { border-bottom: none; }
.vp-row::before {
  content: '';
  position: absolute;
  top: -20%; left: -10%;
  width: 38%; height: 140%;
  background: linear-gradient(105deg,
    transparent 20%,
    rgba(185,142,52,.22) 50%,
    rgba(255,220,100,.08) 55%,
    transparent 80%);
  transform: translateX(-200%) skewX(-15deg);
  transition: transform .38s ease;
  pointer-events: none;
}
.vp-row:hover {
  background: rgba(185,142,52,.10);
  color: rgba(215,172,65,.95);
  padding-left: 1.35rem;
}
.vp-row:hover::before { transform: translateX(420%) skewX(-15deg); }
.vp-num {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 26px; height: 26px;
  border-radius: 50%;
  background: rgba(185,142,52,.10);
  border: 1px solid rgba(185,142,52,.32);
  font-size: .7rem;
  font-weight: 700;
  color: rgba(210,165,60,.88);
  flex-shrink: 0;
  transition: background .15s ease, box-shadow .15s ease;
}
.vp-row:hover .vp-num {
  background: rgba(185,142,52,.22);
  box-shadow: 0 0 12px rgba(185,142,52,.5);
  color: #e8c060;
}
.vp-label { flex: 1; min-width: 0; }
.vp-domain {
  display: block;
  font-size: .56rem;
  opacity: .42;
  margin-top: .06rem;
  overflow: hidden;
  text-overflow: ellipsis;
  letter-spacing: .04em;
  font-weight: 400;
}
.vp-arrow {
  font-size: .65rem;
  opacity: .35;
  flex-shrink: 0;
  transition: opacity .15s ease, transform .15s ease;
}
.vp-row:hover .vp-arrow { opacity: 1; transform: translateX(4px); }

/* 榜单行：有视频时显示指针 */
.lb-table tbody tr[data-has-video] { cursor: pointer; }
/* ── 玩家主页弹窗（暗金风格，与视频弹窗一致） ── */
#pp-popup {
  position: fixed; z-index: 99999; min-width: 210px; max-width: 320px;
  pointer-events: auto; opacity: 0;
  transform: translateY(-10px) scale(0.94);
  transition: opacity .2s cubic-bezier(.22,.68,0,1.2), transform .2s cubic-bezier(.22,.68,0,1.2);
  background: rgba(10,7,2,0.98); border: 1px solid rgba(185,142,52,.5);
  border-radius: 4px; overflow: hidden;
  box-shadow: 0 0 0 1px rgba(185,142,52,.08), 0 20px 65px rgba(0,0,0,.98),
              0 0 50px rgba(185,142,52,.18), inset 0 1px 0 rgba(185,142,52,.22);
  backdrop-filter: blur(28px); -webkit-backdrop-filter: blur(28px); visibility: hidden;
}
#pp-popup.pp-show { visibility: visible; opacity: 1; transform: translateY(0) scale(1); }
.pp-head {
  display: flex; align-items: center; gap: .5rem; padding: .55rem 1rem;
  font-family: 'Orbitron', sans-serif; font-size: .88rem; font-weight: 700;
  letter-spacing: .12em; color: rgba(185,142,52,.65); text-transform: uppercase;
  border-bottom: 1px solid rgba(185,142,52,.14);
  background: linear-gradient(90deg, rgba(185,142,52,.08) 0%, rgba(140,95,20,.04) 100%);
}
.pp-row {
  display: flex; align-items: center; gap: .7rem; padding: .62rem 1rem;
  color: rgba(185,155,90,.8); font-family: 'Orbitron', sans-serif;
  font-size: .96rem; font-weight: 600; letter-spacing: .05em;
  border-bottom: 1px solid rgba(185,142,52,.08); cursor: pointer;
  position: relative; overflow: hidden;
  transition: background .15s ease, color .15s ease, padding-left .18s cubic-bezier(.22,.68,0,1.2);
}
.pp-row:last-child { border-bottom: none; }
.pp-row::before {
  content: ''; position: absolute; top: -20%; left: -10%; width: 38%; height: 140%;
  background: linear-gradient(105deg, transparent 20%, rgba(185,142,52,.22) 50%, rgba(255,220,100,.08) 55%, transparent 80%);
  transform: translateX(-200%) skewX(-15deg); transition: transform .38s ease; pointer-events: none;
}
.pp-row:hover { background: rgba(185,142,52,.10); color: rgba(215,172,65,.95); padding-left: 1.35rem; }
.pp-row:hover::before { transform: translateX(420%) skewX(-15deg); }
.pp-icon {
  width: 26px; height: 26px; border-radius: 50%;
  background: rgba(185,142,52,.10); border: 1px solid rgba(185,142,52,.32);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; color: rgba(210,165,60,.88);
  transition: background .15s, box-shadow .15s;
}
.pp-row:hover .pp-icon { background: rgba(185,142,52,.22); box-shadow: 0 0 12px rgba(185,142,52,.5); color: #e8c060; }
.pp-arr { font-size: .85rem; opacity: .45; flex-shrink: 0; margin-left: auto; transition: opacity .15s, transform .15s; display:flex; align-items:center; }
.pp-row:hover .pp-arr { opacity: 1; transform: translateX(4px); }
.lb-table td.player-col { cursor: pointer; line-height: 1; }
.player-line1 { display: block; font-size: 1em; opacity: 1;   line-height: 1.7; }
.player-line2 { display: block; font-size: 1em; opacity: .55; line-height: 1.7; }
`;
  document.head.appendChild(s);
})();

/* --- 弹窗 DOM 单例 --- */
let _popup     = null;
let _hideTimer = null;

function _getPopup() {
  if (_popup) return _popup;
  _popup = document.createElement('div');
  _popup.id = 'vp-popup';
  _popup.setAttribute('role', 'menu');
  document.body.appendChild(_popup);
  _popup.addEventListener('mouseenter', _cancelHide);
  _popup.addEventListener('mouseleave', _scheduleHide);
  return _popup;
}

function _cancelHide() { clearTimeout(_hideTimer); }

function _scheduleHide() {
  clearTimeout(_hideTimer);
  _hideTimer = setTimeout(() => {
    if (_popup) _popup.classList.remove('vp-show');
  }, 220);
}

/* ══════════════════════════════════════════════════════════
   玩家主页弹窗
   ══════════════════════════════════════════════════════════ */
let _ppPopup = null, _ppHideTimer = null;

function _getPpPopup() {
  if (_ppPopup) return _ppPopup;
  _ppPopup = document.createElement('div');
  _ppPopup.id = 'pp-popup';
  document.body.appendChild(_ppPopup);
  _ppPopup.addEventListener('mouseenter', _ppCancelHide);
  _ppPopup.addEventListener('mouseleave', _ppScheduleHide);
  return _ppPopup;
}
function _ppCancelHide() { clearTimeout(_ppHideTimer); }
function _ppScheduleHide() {
  clearTimeout(_ppHideTimer);
  _ppHideTimer = setTimeout(() => { if (_ppPopup) _ppPopup.classList.remove('pp-show'); }, 220);
}

function _showPlayerPopup(anchorEl, ids) {
  const p = _getPpPopup();
  _ppCancelHide();
  const idCardSvg = '<svg width="15" height="11" viewBox="0 0 15 11" fill="none" style="flex-shrink:0"><rect x=".5" y=".5" width="14" height="10" rx="1.8" stroke="currentColor" stroke-width="1"/><circle cx="4.5" cy="5" r="1.8" stroke="currentColor" stroke-width="1"/><line x1="8" y1="3.5" x2="13" y2="3.5" stroke="currentColor" stroke-width="1" stroke-linecap="round"/><line x1="8" y1="5.5" x2="12" y2="5.5" stroke="currentColor" stroke-width="1" stroke-linecap="round"/><line x1="2.5" y1="8.5" x2="12.5" y2="8.5" stroke="currentColor" stroke-width="1" stroke-linecap="round"/></svg>';
  let html = '<div class="pp-head">'+idCardSvg+'玩家主页</div>';
  ids.forEach(id => {
    const safe = id.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
    html += '<div class="pp-row" data-pid="'+safe+'"><span class="pp-icon"><svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M3.5 2L7 5l-3.5 3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></span><span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+safe+'</span><span class="pp-arr">&#8594;</span></div>';
  });
  p.innerHTML = html;
  p.querySelectorAll('.pp-row').forEach(row => {
    row.addEventListener('click', () => { if (row.dataset.pid) _navigateToPlayer(row.dataset.pid); });
  });
  p.classList.remove('pp-show');
  p.style.visibility = 'hidden'; p.style.display = 'block';
  const rect = anchorEl.getBoundingClientRect();
  const vpW = window.innerWidth, vpH = window.innerHeight;
  const popW = p.offsetWidth || 240, popH = p.offsetHeight || 100;
  let left = rect.left + 12;
  if (left + popW > vpW - 10) left = vpW - popW - 10;
  if (left < 8) left = 8;
  const below = vpH - rect.bottom;
  let top = below >= popH + 10 ? rect.bottom + 6 : rect.top - popH - 6;
  if (top < 4) top = 4;
  p.style.left = left+'px'; p.style.top = top+'px';
  p.style.display = ''; p.style.visibility = '';
  requestAnimationFrame(() => requestAnimationFrame(() => p.classList.add('pp-show')));
}

function _bindPlayerCell(tr, rec) {
  const playerTd = tr.querySelector('.player-col');
  if (!playerTd || !rec.playerId) return;
  // 多人ID按 ' / '（空格斜杠空格）拆分，trim去掉前后空格
  const ids = rec.playerId.split(' / ').map(s => s.trim()).filter(Boolean);
  if (!ids.length) return;
  let enterTimer = null;
  playerTd.addEventListener('mouseenter', () => {
    enterTimer = setTimeout(() => _showPlayerPopup(playerTd, ids), 80);
  });
  playerTd.addEventListener('mouseleave', () => {
    clearTimeout(enterTimer);
    _ppScheduleHide();
  });
}

/* 显示弹窗 */
function _showPopup(anchorEl, urls, rec) {
  const p = _getPopup();
  _cancelHide();

  /* 构建内容 */
  const labels = ['视角 1','视角 2','视角 3','视角 4'];
  let html = `
    <div class="vp-head">
      <span class="vp-head-icon">
        <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
          <polygon points="1.5,1 8,4.5 1.5,8" fill="rgba(185,142,52,.9)"/>
        </svg>
      </span>
      视频录像&nbsp;·&nbsp;${urls.length}&nbsp;个视角
    </div>`;

  urls.forEach((url, i) => {
    const domain = getDomain(url);
    const label  = labels[i] || `视角 ${i+1}`;
    html += `
    <a class="vp-row" href="redirect.html?url=${encodeURIComponent(url)}&lbl=${encodeURIComponent(label)}&player=${encodeURIComponent((rec&&rec.playerId)||'')}&time=${encodeURIComponent((rec&&(rec.clearTime||rec.avgRealTime))||'')}&cap=${encodeURIComponent((rec&&rec.captureStatus)||'')}&date=${encodeURIComponent((rec&&rec.uploadTime)||'')}&from=${encodeURIComponent((location.pathname.split('/').pop())||'index.html')}" target="_blank" rel="noopener" role="menuitem">
      <span class="vp-num">${i+1}</span>
      <span class="vp-label">
        ${label}
        <span class="vp-domain">${domain}</span>
      </span>
      <span class="vp-arrow">→</span>
    </a>`;
  });
  p.innerHTML = html;

  /* 定位：紧贴行的下方或上方 */
  p.classList.remove('vp-show'); // 先隐藏，避免测量到旧尺寸
  p.style.visibility = 'hidden';
  p.style.opacity = '0';

  // 临时让它可测量
  p.style.display = 'block';
  const rect  = anchorEl.getBoundingClientRect();
  const vpW   = window.innerWidth;
  const vpH   = window.innerHeight;
  const popW  = p.offsetWidth  || 260;
  const popH  = p.offsetHeight || 180;

  let left = rect.left + 12;
  if (left + popW > vpW - 10) left = vpW - popW - 10;
  if (left < 8) left = 8;

  const below = vpH - rect.bottom;
  let top;
  if (below >= popH + 10) {
    top = rect.bottom + 6;
  } else {
    top = rect.top - popH - 6;
  }
  if (top < 4) top = 4;

  p.style.left    = left + 'px';
  p.style.top     = top  + 'px';
  p.style.display = '';
  p.style.visibility = '';
  p.style.opacity = '';

  /* 触发过渡 */
  requestAnimationFrame(() => requestAnimationFrame(() => p.classList.add('vp-show')));
}

/* ══════════════════════════════════════════════════════════
   6. 榜单行绑定（所有有视频的行）
   ══════════════════════════════════════════════════════════ */
function _bindRow(tr, urls, rec) {
  if (!urls || !urls.length) return;
  tr.setAttribute('data-has-video', '1');

  // 视频弹窗仅限时间列触发，避免与玩家主页弹窗冲突
  const timeTd = tr.querySelector('.time-col');
  const anchor = timeTd || tr;
  anchor.style.cursor = 'pointer';

  let enterTimer = null;
  anchor.addEventListener('mouseenter', () => {
    enterTimer = setTimeout(() => _showPopup(anchor, urls, rec), 80);
  });
  anchor.addEventListener('mouseleave', () => {
    clearTimeout(enterTimer);
    _scheduleHide();
  });

  anchor.addEventListener('click', (e) => {
    if (e.target.closest('#vp-popup')) return;
    if (urls.length === 1) {
      _vcShow(urls[0], rec, '视角 1');
    } else {
      _showPopup(anchor, urls, rec);
    }
  });
}

/* ESC 关闭 */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') _scheduleHide();
});

/* ══════════════════════════════════════════════════════════
   7. 榜单渲染：结算时间类
   ══════════════════════════════════════════════════════════ */
function renderTimeLeaderboard(records, tbodyId, timeField) {
  const tbody = document.getElementById(tbodyId);
  if (!tbody) return;

  const sorted = [...records].sort((a,b) => parseTimeMs(a[timeField]) - parseTimeMs(b[timeField]));

  if (!sorted.length) {
    tbody.innerHTML = `<tr><td class="lb-empty-cell" colspan="4"><div class="lb-empty-state"><div class="lb-empty-ring"></div><svg class="lb-empty-icon" width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="13" stroke="rgba(0,212,255,.28)" stroke-width="1.2" stroke-dasharray="5 3"/><path d="M10 16h12M16 10v12" stroke="rgba(0,212,255,.55)" stroke-width="1.5" stroke-linecap="round"/></svg><p class="lb-empty-text">NO SIGNAL</p><p class="lb-empty-sub">暂无记录 &nbsp;·&nbsp; 期待你成为第一</p></div></td></tr>`;
    return;
  }

  tbody.innerHTML = '';
  sorted.forEach((rec, idx) => {
    const rank = idx + 1;
    const urls = getVideoUrls(rec);
    const tr   = document.createElement('tr');
    if (rank <= 3) tr.classList.add(`rank-${rank}`);

    /* 无"录像"字，改为仅凭 cursor:pointer 暗示可点 */
    tr.innerHTML = `
      <td class="rank-col" style="vertical-align:middle"><span class="rank-badge">#${rank}</span></td>
      <td class="time-col" style="vertical-align:middle">${rec[timeField] || '—'}</td>
      <td class="player-col" style="vertical-align:middle">${(rec.playerId2||rec.playerId3||rec.playerId4) ? '<span class="player-line1">'+(rec.playerId||'—')+'</span>' : (rec.playerId||'—')}${rec.playerId2 ? '<span class="player-line2">'+rec.playerId2+'</span>' : ''}${rec.playerId3 ? '<span class="player-line2">'+rec.playerId3+'</span>' : ''}${rec.playerId4 ? '<span class="player-line2">'+rec.playerId4+'</span>' : ''}</td>
      <td style="vertical-align:middle">${rec.uploadTime || '—'}</td>`;

    _bindRow(tr, urls, rec);
    _bindPlayerCell(tr, rec);
    tbody.appendChild(tr);
  });

  const stats = document.getElementById('lb-stats');
  if (stats) stats.textContent = `共 ${sorted.length} 条记录`;
  animateTableRows(tbody);
}

/* ══════════════════════════════════════════════════════════
   8. 榜单渲染：夜灵类
   ══════════════════════════════════════════════════════════ */
const CAPTURE_RANK = { '7×3':1,'6×3+2':2,'6×3+1':3,'6×3':4 };
function captureWeight(s) { return CAPTURE_RANK[s] !== undefined ? CAPTURE_RANK[s] : 99; }

function renderEidolonLeaderboard(records, tbodyId) {
  const tbody = document.getElementById(tbodyId);
  if (!tbody) return;

  const sorted = [...records].sort((a,b) => {
    const cw = captureWeight(a.captureStatus) - captureWeight(b.captureStatus);
    return cw !== 0 ? cw : parseTimeMs(a.avgRealTime) - parseTimeMs(b.avgRealTime);
  });

  if (!sorted.length) {
    tbody.innerHTML = `<tr><td class="lb-empty-cell" colspan="5"><div class="lb-empty-state"><div class="lb-empty-ring"></div><svg class="lb-empty-icon" width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="13" stroke="rgba(0,212,255,.28)" stroke-width="1.2" stroke-dasharray="5 3"/><path d="M10 16h12M16 10v12" stroke="rgba(0,212,255,.55)" stroke-width="1.5" stroke-linecap="round"/></svg><p class="lb-empty-text">NO SIGNAL</p><p class="lb-empty-sub">暂无记录 &nbsp;·&nbsp; 期待你成为第一</p></div></td></tr>`;
    return;
  }

  tbody.innerHTML = '';
  sorted.forEach((rec, idx) => {
    const rank = idx + 1;
    const urls = getVideoUrls(rec);
    const tr   = document.createElement('tr');
    if (rank <= 3) tr.classList.add(`rank-${rank}`);

    tr.innerHTML = `
      <td class="rank-col"><span class="rank-badge">#${rank}</span></td>
      <td class="time-col">${rec.avgRealTime || '—'}</td>
      <td>${rec.captureStatus || '—'}</td>
      <td class="player-col">${rec.playerId || '—'}</td>
      <td>${rec.uploadTime || '—'}</td>`;

    _bindRow(tr, urls, rec);
    _bindPlayerCell(tr, rec);
    tbody.appendChild(tr);
  });

  const stats = document.getElementById('lb-stats');
  if (stats) stats.textContent = `共 ${sorted.length} 条记录`;
  animateTableRows(tbody);
}

/* ══════════════════════════════════════════════════════════
   页面加载
   ══════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  new StarField('star-canvas');
  initNav();
  initMobileNav();
  initReveal();
  initHashState();
  initAutoActiveNav();
  alignLogoText();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(alignLogoText);
  window.addEventListener('resize', alignLogoText);
});

/* ══════════════════════════════════════════════════════════
   Logo 等宽对齐
   ══════════════════════════════════════════════════════════ */
function alignLogoText() {
  const title  = document.querySelector('.logo-title');
  const domain = document.querySelector('.logo-domain');
  if (!title || !domain) return;
  domain.style.letterSpacing = '0px';
  const tw = el => { const r = document.createRange(); r.selectNodeContents(el); return r.getBoundingClientRect().width; };
  const titleW = tw(title), domainW = tw(domain);
  if (titleW <= domainW || titleW < 1) { domain.style.letterSpacing = ''; return; }
  const chars = domain.textContent.trim().length;
  if (chars < 1) return;
  domain.style.letterSpacing = ((titleW - domainW) / chars).toFixed(3) + 'px';
}


/* ══════════════════════════════════════════════════════════
   榜单行错开入场动画
   ══════════════════════════════════════════════════════════ */
/* ══════════════════════════════════════════════════════════
   横幅提醒通用函数 — _updatePageNotice(dataFn)
   dataFn : 当前选中分类的数据函数（如 _catData[c] / _allData[key]）
   从函数源码中提取变量名，再读取 window[vn+'Notice_cn'] 和 Notice_en
   cn 留空则隐藏横幅，非空则显示；鼠标悬停切换为英文。
   ══════════════════════════════════════════════════════════ */
function _updatePageNotice(dataFn) {
  var el = document.getElementById('page-notice');
  if (!el) return;
  var cn = '', en = '';
  if (dataFn) {
    try {
      var src = dataFn.toString();
      /* 支持多种函数格式：
         1. function(){return xxxRecords;} 
         2. function() { return xxxRecords; }
         3. ()=>xxxRecords 或 () => xxxRecords
         4. function name(){return xxxRecords;} */
      var m = src.match(/return\s+([a-zA-Z_][a-zA-Z0-9_$]*)Records/) || 
              src.match(/=>\s*([a-zA-Z_][a-zA-Z0-9_$]*)Records/);
      if (m) {
        var vn = m[1];
        var cnVar = vn + 'Notice_cn';
        var enVar = vn + 'Notice_en';
        cn = (typeof window[cnVar] !== 'undefined') ? (window[cnVar] || '') : '';
        en = (typeof window[enVar] !== 'undefined') ? (window[enVar] || '') : '';
      }
    } catch(e) {}
  }
  if (cn && cn.trim()) {
    el.style.display = 'flex';
    var cnEl = document.getElementById('notice-cn');
    var enEl = document.getElementById('notice-en');
    if (cnEl) cnEl.textContent = cn;
    if (enEl) enEl.textContent = en || '';
  } else {
    el.style.display = 'none';
  }
}

function animateTableRows(tbody) {
  if (!tbody) return;
  var rows = tbody.querySelectorAll('tr');
  rows.forEach(function(tr, i) {
    tr.classList.add('lb-row-pre');
    setTimeout(function() {
      tr.classList.remove('lb-row-pre');
      tr.classList.add('lb-row-in');
    }, 30 + i * 30);
  });
}

/* ══════════════════════════════════════════════════════════
   URL Hash 状态同步（Tab 可书签 / 分享）
   ══════════════════════════════════════════════════════════ */
function initHashState() {
  var hash = location.hash.replace('#', '').trim();
  if (hash) {
    var btn = document.querySelector('[data-map="' + hash + '"], [data-tab="' + hash + '"]');
    if (btn) setTimeout(function() { btn.click(); }, 60);
  }
  document.addEventListener('click', function(e) {
    var btn = e.target.closest('[data-map],[data-tab]');
    if (!btn) return;
    var key = btn.dataset.map || btn.dataset.tab;
    if (key) history.replaceState(null, '', '#' + key);
  });
}

/* ══════════════════════════════════════════════════════════
   导航栏当前页自动高亮
   ══════════════════════════════════════════════════════════ */
function initAutoActiveNav() {
  var page = (location.pathname.split('/').pop() || 'index.html').split('?')[0].split('#')[0];
  document.querySelectorAll('.nav-item').forEach(function(item) {
    var links = item.querySelectorAll('a[href]');
    var match = false;
    links.forEach(function(a) {
      var href = (a.getAttribute('href') || '').split('?')[0].split('#')[0];
      if (href === page) match = true;
    });
    if (match) item.classList.add('active');
  });
}

/* ══════════════════════════════════════════════════════════
   全站搜索 / 玩家主页 — 像素故障过渡动画（共享函数）
   ══════════════════════════════════════════════════════════ */
var _glitchBusy = false;

function _doGlitchNav(dest) {
  /* 安全回退：若动画异常，2.5s 后强制跳转并重置状态 */
  var _navFallback = setTimeout(function() {
    try { document.body.style.filter = ''; } catch(e) {}
    _glitchBusy = false;
    window.location.href = dest;
  }, 10000);

  try {

    /* ══ 三阶段故障像素特效 ══
       Phase 1 (0→320ms):  CSS filter 让页面内容变为霓虹彩色 + 少量扫描线
       Phase 2 (320→1000ms): CSS 极端色调旋转 + Canvas 故障线条/RGB偏移/噪声块
       Phase 3 (1000→1380ms): 渐黑收尾
    ══════════════════════════════════════════════════════════ */
    var W=innerWidth, H=innerHeight;
    var cv=document.createElement('canvas');
    cv.setAttribute('data-glitch-canvas','1');  /* 问题6-fix: 标记故障动画 canvas，供 pageshow 清理 */
    cv.style.cssText='position:fixed;inset:0;z-index:99999;pointer-events:all;';
    cv.width=W; cv.height=H;
    document.body.appendChild(cv);
    var ctx=cv.getContext('2d');

    var P1=320, P2=680, P3=380, TOTAL=P1+P2+P3;

    /* ── 预生成随机故障线数据 ── */
    var NS=52;
    var sy=new Float32Array(NS),sh=new Float32Array(NS);
    var sof=new Float32Array(NS),sph=new Float32Array(NS),ssp=new Float32Array(NS);
    var scR=new Uint8Array(NS),scG=new Uint8Array(NS),scB=new Uint8Array(NS);
    for(var i=0;i<NS;i++){
      sy[i]=Math.random()*H; sh[i]=1+Math.random()*14;
      sof[i]=(Math.random()-0.5)*130; sph[i]=Math.random()*6.28; ssp[i]=3+Math.random()*8;
      var rc=Math.random();
      if(rc<0.33){scR[i]=0;scG[i]=220;scB[i]=255;}
      else if(rc<0.66){scR[i]=255;scG[i]=0;scB[i]=90;}
      else{scR[i]=255;scG[i]=210;scB[i]=0;}
    }

    /* ── 预生成噪声块数据 ── */
    var NB=200;
    var bx=new Float32Array(NB),by=new Float32Array(NB);
    var bw=new Float32Array(NB),bh=new Float32Array(NB);
    var bph=new Float32Array(NB),bsp=new Float32Array(NB);
    var bR=new Uint8Array(NB),bG=new Uint8Array(NB),bBB=new Uint8Array(NB);
    var pN=[[0,210,255],[255,50,180],[255,190,0],[0,255,160],[160,60,255],[0,255,220]];
    for(var i=0;i<NB;i++){
      bx[i]=Math.random()*W; by[i]=Math.random()*H;
      bw[i]=3+Math.random()*32; bh[i]=2+Math.random()*20;
      bph[i]=Math.random()*6.28; bsp[i]=4+Math.random()*9;
      var pl=pN[Math.floor(Math.random()*pN.length)];
      bR[i]=pl[0];bG[i]=pl[1];bBB[i]=pl[2];
    }

    var t0=null;
    function frame(now){
      if(!t0)t0=now;
      var el=now-t0, t=el*0.001;
      ctx.clearRect(0,0,W,H);

      /* ─── Phase 1: 页面内容变彩色 ─── */
      if(el<P1){
        var fp=el/P1;
        document.body.style.filter='saturate('+(1+fp*14)+') hue-rotate('+(fp*180)+'deg) brightness('+(1-fp*0.38)+') contrast('+(1+fp*1.5)+')';

        /* 扫描线 */
        ctx.fillStyle='rgba(0,0,0,0.07)';
        for(var y=0;y<H;y+=4)ctx.fillRect(0,y,W,1);

        /* 零散噪声块开始出现 */
        var nc=Math.floor(fp*55);
        for(var i=0;i<nc;i++){
          ctx.globalAlpha=Math.abs(Math.sin(t*bsp[i]+bph[i]))*fp*0.65;
          ctx.fillStyle='rgb('+bR[i]+','+bG[i]+','+bBB[i]+')';
          ctx.fillRect(bx[i],by[i],bw[i],bh[i]);
        }
        ctx.globalAlpha=1;

      /* ─── Phase 2: 故障高峰 ─── */
      }else if(el<P1+P2){
        var gp=(el-P1)/P2;
        var hue=180+gp*420, sat=Math.max(15-gp*11,1), bri=Math.max(0.62-gp*0.57,0.04);
        document.body.style.filter='saturate('+sat+') hue-rotate('+hue+'deg) brightness('+bri+') contrast('+(3-gp*1.5)+')';

        /* RGB 横向撕裂线 */
        for(var i=0;i<NS;i++){
          if(Math.random()>0.42)continue;
          if(Math.sin(t*ssp[i]+sph[i])<0)continue;
          var ofs=sof[i]*(0.6+gp*2)*(Math.random()>0.5?1:-1);
          ctx.globalAlpha=0.26;
          ctx.fillStyle='rgb('+scR[i]+','+scG[i]+','+scB[i]+')';
          ctx.fillRect(0,sy[i]+ofs,W,sh[i]);
          ctx.globalAlpha=0.14;
          ctx.fillStyle='rgb('+(255-scR[i])+','+(255-scG[i])+','+(255-scB[i])+')';
          ctx.fillRect(ofs*0.35,sy[i]-ofs*0.25,W,sh[i]*0.6);
        }
        ctx.globalAlpha=1;

        /* 全屏噪声块 */
        for(var i=0;i<NB;i++){
          var flick=0.5+0.5*Math.abs(Math.sin(t*bsp[i]*2+bph[i]));
          ctx.globalAlpha=flick*0.90;
          ctx.fillStyle='rgb('+bR[i]+','+bG[i]+','+bBB[i]+')';
          ctx.fillRect(bx[i]+Math.sin(t*9+i*0.3)*20*gp,by[i],bw[i],bh[i]);
        }
        ctx.globalAlpha=1;

        /* 扫描线加深 */
        ctx.fillStyle='rgba(0,0,0,'+(0.07+gp*0.14)+')';
        for(var y=0;y<H;y+=4)ctx.fillRect(0,y,W,1);

        /* 垂直同步撕裂 */
        if(gp>0.2){
          var ty=Math.floor((Math.sin(t*6)*0.5+0.5)*H);
          ctx.fillStyle='rgba(0,210,255,0.30)';ctx.fillRect(0,ty,W,3);
          ctx.fillStyle='rgba(255,0,90,0.24)';ctx.fillRect(0,ty+3,W,2);
        }

        /* 暗角渐长 */
        var vg=ctx.createRadialGradient(W/2,H/2,H*0.15,W/2,H/2,H*0.75);
        vg.addColorStop(0,'transparent');vg.addColorStop(1,'rgba(0,0,0,1)');
        ctx.globalAlpha=gp*0.7;ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);ctx.globalAlpha=1;

      /* ─── Phase 3: 渐黑 ─── */
      }else{
        var dp=(el-P1-P2)/P3;
        document.body.style.filter='brightness('+Math.max(0.04-dp*0.04,0)+') saturate(2)';
        ctx.fillStyle='rgba(0,0,0,'+Math.min(dp*dp*1.5,1)+')';
        ctx.fillRect(0,0,W,H);
        if(dp<0.45){
          for(var i=0;i<22;i++){
            var idx=(i*9)%NB;
            ctx.globalAlpha=(0.45-dp)*0.65;
            ctx.fillStyle='rgb('+bR[idx]+','+bG[idx]+','+bBB[idx]+')';
            ctx.fillRect(bx[idx],by[idx],bw[idx],bh[idx]);
          }
          ctx.globalAlpha=1;
        }
      }

      if(el<TOTAL){requestAnimationFrame(frame);}
      else{clearTimeout(_navFallback);document.body.style.filter='';window.location.href=dest;}
    }
    requestAnimationFrame(frame);

  } catch(e) {
    /* 动画异常：立即清理并直接跳转 */
    clearTimeout(_navFallback);
    try { document.body.style.filter = ''; } catch(e2) {}
    _glitchBusy = false;
    window.location.href = dest;
  }
}

document.addEventListener('click', function(e) {
  var link = e.target.closest('.nav-serch-link');
  if (!link || _glitchBusy) return;
  e.preventDefault();
  _glitchBusy = true;
  _doGlitchNav(link.getAttribute('href') || 'search.html');  /* 问题9-fix: 同步文件名修正 */
});

function _navigateToPlayer(playerId) {
  if (_glitchBusy) return;
  _glitchBusy = true;
  _doGlitchNav('player.html?id=' + encodeURIComponent(playerId));
}
  

/* ══════════════════════════════════════════════════════════
   页面显示时重置样式（返回 / bfcache 恢复）
   ══════════════════════════════════════════════════════════ */
window.addEventListener('pageshow', function() {
  _glitchBusy = false;
  document.body.style.opacity = '';
  document.body.style.filter = '';
  document.body.style.animation = '';
  document.body.style.transition = '';
  /* 清理残留 canvas 遮罩（匹配所有高层级固定覆盖层） */
  document.querySelectorAll('canvas[data-glitch-canvas]').forEach(function(c) {  /* 问题6-fix: 用属性选择器替代脆弱的 style 字符串匹配 */
    if (c.parentNode) c.parentNode.removeChild(c);
  });
});

/* ══════════════════════════════════════════════════════════
   过渡页跳转（赛博风格 redirect.html）
   ══════════════════════════════════════════════════════════ */
function _vcShow(url, rec, lbl) {
  var q = ['url=' + encodeURIComponent(url)];
  if (lbl) q.push('lbl=' + encodeURIComponent(lbl));
  if (rec) {
    if (rec.playerId)      q.push('player=' + encodeURIComponent(rec.playerId));
    if (rec.clearTime || rec.avgRealTime) q.push('time=' + encodeURIComponent(rec.clearTime || rec.avgRealTime));
    if (rec.captureStatus) q.push('cap='    + encodeURIComponent(rec.captureStatus));
    if (rec.uploadTime)    q.push('date='   + encodeURIComponent(rec.uploadTime));
  }
  q.push('from=' + encodeURIComponent((location.pathname.split('/').pop()) || 'index.html'));
  window.open('redirect.html?' + q.join('&'), '_blank', 'noopener');
}