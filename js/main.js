/* ════════════════════════════════════════════════════════════
   main.js  —  全站通用脚本
   包含：
   1. StarField 星空 Canvas 类（动态星空 + 流星）
   2. 导航栏：汉堡菜单、移动端下拉点击展开
   3. 滚动进入动画（IntersectionObserver）
   4. 榜单渲染工具函数（供各榜单页调用）
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
    this.shoots = [];   // 流星
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
      // 星色：大多白/蓝白，少量暖色/青色
      let color;
      if      (r < .55) color = '#ffffff';
      else if (r < .75) color = '#b8d8ff';
      else if (r < .88) color = '#ffe8c8';
      else              color = '#00d4ff';
      return {
        x:      Math.random() * w,
        y:      Math.random() * h,
        size:   Math.random() * 1.7 + .2,
        base:   Math.random() * .55 + .2,
        speed:  Math.random() * .025 + .004,
        phase:  Math.random() * Math.PI * 2,
        color
      };
    });
  }

  _maybeShoot() {
    // 每帧约 0.4% 概率生成一颗流星，最多同时 3 颗
    if (Math.random() > .004 || this.shoots.length >= 3) return;
    const { width: w, height: h } = this.canvas;
    const ang = Math.PI / 4 + (Math.random() - .5) * .35;
    const spd = Math.random() * 9 + 6;
    this.shoots.push({
      x:   Math.random() * w * .75,
      y:   Math.random() * h * .35,
      dx:  Math.cos(ang) * spd,
      dy:  Math.sin(ang) * spd,
      len: Math.random() * 160 + 80,
      op:  1
    });
  }

  _animate() {
    const ctx = this.ctx;
    const { width: w, height: h } = this.canvas;
    const now = performance.now() * .001;

    /* ── 深空背景 ── */
    const bg = ctx.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0,   '#07080f');
    bg.addColorStop(.45, '#090c18');
    bg.addColorStop(1,   '#070810');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    /* ── 闪烁星点 ── */
    this.stars.forEach(s => {
      const op = s.base * (.72 + .28 * Math.sin(now * s.speed * 55 + s.phase));
      ctx.save();
      ctx.globalAlpha = op;
      // 较大星星加一圈辉光
      if (s.size > 1.1) {
        const gr = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.size * 3.5);
        gr.addColorStop(0,   s.color);
        gr.addColorStop(.4,  s.color + '55');
        gr.addColorStop(1,   'transparent');
        ctx.fillStyle = gr;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * 3.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = s.color;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    /* ── 流星 ── */
    this._maybeShoot();
    this.shoots = this.shoots.filter(s => s.op > .02);
    this.shoots.forEach(s => {
      const tail = s.len / Math.hypot(s.dx, s.dy);
      const gr = ctx.createLinearGradient(s.x, s.y, s.x - s.dx * tail, s.y - s.dy * tail);
      gr.addColorStop(0,   `rgba(255,255,255,${s.op})`);
      gr.addColorStop(.25, `rgba(0,212,255,${s.op * .6})`);
      gr.addColorStop(1,   'transparent');
      ctx.save();
      ctx.globalAlpha = s.op;
      ctx.strokeStyle = gr;
      ctx.lineWidth   = 1.5;
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(s.x - s.dx * tail, s.y - s.dy * tail);
      ctx.stroke();
      ctx.restore();
      s.x  += s.dx;
      s.y  += s.dy;
      s.op -= .018;
    });

    this._raf = requestAnimationFrame(() => this._animate());
  }

  destroy() {
    cancelAnimationFrame(this._raf);
    window.removeEventListener('resize', this._resize);
  }
}

/* ══════════════════════════════════════════════════════════
   2. 导航栏交互（移动端汉堡 + 下拉）
   ══════════════════════════════════════════════════════════ */
function initNav() {
  const hamburger = document.querySelector('.nav-hamburger');
  const navLinks  = document.querySelector('.nav-links');
  if (!hamburger || !navLinks) return;

  // ── 汉堡菜单开关 ──
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // ── 移动端下拉点击展开 ──
  const dropItems = document.querySelectorAll('.nav-item.has-dropdown');
  dropItems.forEach(item => {
    const link = item.querySelector(':scope > a');
    if (!link) return;
    // 仅在窄屏时拦截点击进入子页面，改为展开菜单
    link.addEventListener('click', (e) => {
      if (window.innerWidth <= 860) {
        e.preventDefault();
        // 关闭其他已展开项
        dropItems.forEach(other => {
          if (other !== item) other.classList.remove('mob-open');
        });
        item.classList.toggle('mob-open');
      }
    });
  });

  // ── 点击页面空白处关闭菜单 ──
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.site-nav')) {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      dropItems.forEach(i => i.classList.remove('mob-open'));
    }
  });
}

/* ══════════════════════════════════════════════════════════
   3. 滚动进入动画（IntersectionObserver）
   ══════════════════════════════════════════════════════════ */
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const obs = new IntersectionObserver(
    (entries) => entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    }),
    { threshold: .12 }
  );
  els.forEach(el => obs.observe(el));
}

/* ══════════════════════════════════════════════════════════
   4. 榜单渲染工具
   ══════════════════════════════════════════════════════════ */

/**
 * 将时间字符串（如 "01:23.456" 或 "12:34:56.789"）解析为毫秒数
 * 用于对榜单记录按成绩从小到大自动排序
 */
function parseTimeMs(timeStr) {
  if (!timeStr) return Infinity;
  const parts = timeStr.split(':');
  let ms = 0;
  if (parts.length === 3) {
    // HH:MM:SS.mmm
    ms = (parseInt(parts[0], 10) * 3600
        + parseInt(parts[1], 10) * 60
        + parseFloat(parts[2])) * 1000;
  } else if (parts.length === 2) {
    // MM:SS.mmm
    ms = (parseInt(parts[0], 10) * 60
        + parseFloat(parts[1])) * 1000;
  } else {
    // SS.mmm
    ms = parseFloat(parts[0]) * 1000;
  }
  return isNaN(ms) ? Infinity : ms;
}

/**
 * 渲染「结算时间」类榜单（disruption、profit-taker）
 * @param {Array}  records   - 数据文件中的记录数组
 * @param {string} tbodyId   - 目标 <tbody> 的 id
 * @param {string} timeField - 时间字段名（clearTime 等）
 */
function renderTimeLeaderboard(records, tbodyId, timeField) {
  const tbody = document.getElementById(tbodyId);
  if (!tbody) return;

  // 按时间升序排序
  const sorted = [...records].sort(
    (a, b) => parseTimeMs(a[timeField]) - parseTimeMs(b[timeField])
  );

  if (!sorted.length) {
    tbody.innerHTML =
      `<tr><td class="lb-empty" colspan="4">暂无记录，快来提交第一个成绩！</td></tr>`;
    return;
  }

  tbody.innerHTML = '';
  sorted.forEach((rec, idx) => {
    const rank = idx + 1;
    const tr   = document.createElement('tr');
    if (rank <= 3) tr.classList.add(`rank-${rank}`);
    if (rec.videoUrl) {
      tr.addEventListener('click', () =>
        window.open(rec.videoUrl, '_blank', 'noopener'));
    }

    const videoHint = rec.videoUrl
      ? `<span class="video-indicator">
           <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
             <polygon points="2,1 9,5 2,9" fill="currentColor"/>
           </svg>录像
         </span>`
      : '';

    tr.innerHTML = `
      <td class="rank-col">
        <span class="rank-badge">#${rank}</span>
      </td>
      <td class="time-col">${rec[timeField] || '—'}</td>
      <td class="player-col">${rec.playerId || '—'} ${videoHint}</td>
      <td>${rec.uploadTime || '—'}</td>`;
    tbody.appendChild(tr);
  });

  // 更新表格底部统计
  const stats = document.getElementById('lb-stats');
  if (stats) stats.textContent = `共 ${sorted.length} 条记录`;
}

/**
 * 渲染「夜灵」类榜单（含捕获情况列）
 * @param {Array}  records - 数据文件中的记录数组
 * @param {string} tbodyId - 目标 <tbody> 的 id
 */
function renderEidolonLeaderboard(records, tbodyId) {
  const tbody = document.getElementById(tbodyId);
  if (!tbody) return;

  const sorted = [...records].sort(
    (a, b) => parseTimeMs(a.avgRealTime) - parseTimeMs(b.avgRealTime)
  );

  if (!sorted.length) {
    tbody.innerHTML =
      `<tr><td class="lb-empty" colspan="5">暂无记录，快来提交第一个成绩！</td></tr>`;
    return;
  }

  tbody.innerHTML = '';
  sorted.forEach((rec, idx) => {
    const rank = idx + 1;
    const tr   = document.createElement('tr');
    if (rank <= 3) tr.classList.add(`rank-${rank}`);
    if (rec.videoUrl) {
      tr.addEventListener('click', () =>
        window.open(rec.videoUrl, '_blank', 'noopener'));
    }

    const videoHint = rec.videoUrl
      ? `<span class="video-indicator">
           <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
             <polygon points="2,1 9,5 2,9" fill="currentColor"/>
           </svg>录像
         </span>`
      : '';

    tr.innerHTML = `
      <td class="rank-col">
        <span class="rank-badge">#${rank}</span>
      </td>
      <td class="time-col">${rec.avgRealTime || '—'}</td>
      <td>${rec.captureStatus || '—'}</td>
      <td class="player-col">${rec.playerId || '—'} ${videoHint}</td>
      <td>${rec.uploadTime || '—'}</td>`;
    tbody.appendChild(tr);
  });

  const stats = document.getElementById('lb-stats');
  if (stats) stats.textContent = `共 ${sorted.length} 条记录`;
}

/* ══════════════════════════════════════════════════════════
   页面加载时初始化
   ══════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  // 启动星空 Canvas（所有页面共用同一个 canvas#star-canvas）
  new StarField('star-canvas');
  // 导航栏交互
  initNav();
  // 滚动动画
  initReveal();
});
