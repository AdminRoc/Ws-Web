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
  font-size: .56rem;
  font-weight: 700;
  letter-spacing: .22em;
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
  font-size: .72rem;
  font-weight: 600;
  letter-spacing: .1em;
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
          <polygon points="1.5,1 8,4.5 1.5,8" fill="rgba(0,212,255,.9)"/>
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

  // 悬停：200ms 延迟显示（防止划过误触）
  let enterTimer = null;
  tr.addEventListener('mouseenter', () => {
    enterTimer = setTimeout(() => _showPopup(tr, urls, rec), 80);
  });
  tr.addEventListener('mouseleave', () => {
    clearTimeout(enterTimer);
    _scheduleHide();
  });

  // 点击：如果只有1个视角直接跳转；多视角点击也显示菜单
  tr.addEventListener('click', (e) => {
    if (e.target.closest('#vp-popup')) return; // 点击弹窗内部不处理
    if (urls.length === 1) {
      _vcShow(urls[0], rec, '视角 1');
    } else {
      _showPopup(tr, urls, rec);
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
      <td class="rank-col"><span class="rank-badge">#${rank}</span></td>
      <td class="time-col">${rec[timeField] || '—'}</td>
      <td class="player-col">${rec.playerId || '—'}</td>
      <td>${rec.uploadTime || '—'}</td>`;

    _bindRow(tr, urls, rec);
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
   全站搜索 — 点击按钮时：故障艺术效果（Glitch Art）
   彩色扭曲 → 破碎消散 → 慢慢暗淡
   ══════════════════════════════════════════════════════════ */
(function(){
  var isTransitioning = false;

  document.addEventListener('click', function(e) {
    var link = e.target.closest('.nav-serch-link');
    if (!link) return;
    e.preventDefault();

    /* 防止重复触发 */
    if (isTransitioning) return;
    isTransitioning = true;

    var dest = link.getAttribute('href') || 'serch.html';

    /* 添加故障动画关键帧 */
    var style = document.createElement('style');
    style.id = 'glitch-style';
    style.textContent = 
      '@keyframes glitchColor{0%,100%{filter:hue-rotate(0deg) saturate(1)}25%{filter:hue-rotate(90deg) saturate(2)}50%{filter:hue-rotate(180deg) saturate(3)}75%{filter:hue-rotate(270deg) saturate(2)}}' +
      '@keyframes glitchShake{0%,100%{transform:translate(0)}20%{transform:translate(-3px,2px)}40%{transform:translate(3px,-2px)}60%{transform:translate(-2px,-3px)}80%{transform:translate(2px,3px)}}' +
      '@keyframes fragmentFade{to{transform:translate(var(--tx),var(--ty)) rotate(var(--rot)) scale(0.5);opacity:0}}';
    document.head.appendChild(style);

    /* 第一阶段：故障彩色效果 - 亮度降低20% */
    document.body.style.animation = 'glitchColor 0.4s ease-out';
    document.body.style.filter = 'saturate(2.0) contrast(1.2) brightness(0.8)';

    /* 所有元素添加抖动 */
    var allEls = document.querySelectorAll('body > *');
    allEls.forEach(function(el){
      if(!el.style) return;
      el.style.animation = 'glitchShake 0.15s ease-in-out 2';
    });

    /* 第二阶段：创建随机碎片（无网格线） */
    setTimeout(function(){
      var fragmentContainer = document.createElement('div');
      fragmentContainer.id = 'glitch-fragments';
      fragmentContainer.style.cssText = 'position:fixed;inset:0;z-index:99998;pointer-events:none;overflow:hidden;background:rgba(3,6,15,0.3)';
      document.body.appendChild(fragmentContainer);

      var fragments = [];
      var fragmentCount = 40;

      for(var i = 0; i < fragmentCount; i++){
        var frag = document.createElement('div');
        var w = 50 + Math.random() * 150;
        var h = 30 + Math.random() * 100;
        var x = Math.random() * (window.innerWidth - w);
        var y = Math.random() * (window.innerHeight - h);
        var angle = Math.random() * Math.PI * 2;
        var flyDist = 100 + Math.random() * 400;
        var rotation = Math.random() * 180 - 90;

        /* 随机暗色调，无网格线 */
        var darkness = 0.85 + Math.random() * 0.14;
        var color = 'rgba(' + Math.floor(5*darkness) + ',' + Math.floor(10*darkness) + ',' + Math.floor(25*darkness) + ',' + (0.9 + Math.random()*0.1) + ')';

        frag.style.cssText = 
          'position:absolute;' +
          'left:' + x + 'px;' +
          'top:' + y + 'px;' +
          'width:' + w + 'px;' +
          'height:' + h + 'px;' +
          'background:' + color + ';' +
          'backdrop-filter:blur(1px);' +
          '--tx:' + (Math.cos(angle) * flyDist) + 'px;' +
          '--ty:' + (Math.sin(angle) * flyDist) + 'px;' +
          '--rot:' + rotation + 'deg;';

        fragmentContainer.appendChild(frag);
        fragments.push({el: frag, delay: Math.random() * 0.4});
      }

      /* 第三阶段：碎片消散 + 页面暗淡 */
      setTimeout(function(){
        /* 页面整体暗淡 */
        document.body.style.transition = 'filter 0.8s ease, opacity 0.8s ease';
        document.body.style.filter = 'brightness(0.05) contrast(2) saturate(0)';
        document.body.style.opacity = '0';

        /* 碎片飞散消失 */
        fragments.forEach(function(f){
          setTimeout(function(){
            f.el.style.transition = 'transform 0.7s cubic-bezier(0.4,0,0.2,1), opacity 0.6s ease';
            f.el.style.animation = 'fragmentFade 0.7s cubic-bezier(0.4,0,0.2,1) forwards';
          }, f.delay * 1000);
        });

        /* 第四阶段：跳转 - 使用 replace 避免 history 记录中间状态 */
        setTimeout(function(){
          window.location.replace(dest);
        }, 1000);
      }, 300);
    }, 400);
  });
})();

/* ══════════════════════════════════════════════════════════
   页面加载时重置样式 - 修复返回黑屏问题
   ══════════════════════════════════════════════════════════ */
window.addEventListener('pageshow', function(e) {
  /* 重置 body 样式，确保从任何状态返回都正常显示 */
  document.body.style.opacity = '';
  document.body.style.filter = '';
  document.body.style.animation = '';
  document.body.style.transition = '';

  /* 清理可能残留的动画元素 */
  var fragments = document.getElementById('glitch-fragments');
  if (fragments && fragments.parentNode) {
    fragments.parentNode.removeChild(fragments);
  }

  /* 清理动画样式 */
  var style = document.getElementById('glitch-style');
  if (style && style.parentNode) {
    style.parentNode.removeChild(style);
  }

  /* 重置所有子元素动画 */
  var allEls = document.querySelectorAll('body > *');
  allEls.forEach(function(el){
    if(el.style) {
      el.style.animation = '';
      el.style.transition = '';
    }
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