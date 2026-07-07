/* 一键分享
 * 将当前"详情"分析结果（#detail）渲染为一张 PNG 图片并下载。
 * 截图库 html2canvas 已内置于本地 js/lib/，运行时无任何外部依赖。 */
window.WF = window.WF || {};

WF.shareCard = (function () {
  let btn, detail, busy = false;

  function build() {
    if (btn) return;
    btn = document.createElement('button');
    btn.className = 'share-card-btn';
    btn.type = 'button';
    btn.innerHTML = '<span class="share-card-ico">⬇</span><span class="share-card-txt">一键分享</span>';
    document.body.appendChild(btn);
    btn.addEventListener('click', capture);
  }

  function toggleShow() {
    if (!btn) return;
    const has = detail && detail.querySelector('*') && !detail.querySelector('.empty-state');
    btn.classList.toggle('show', !!has);
  }

  /* ═══════════════════════════════════════════════════════════════
     截图克隆修复（所有 DOM 操作都包裹 try-catch，确保不导致 html2canvas 失败）
     ═══════════════════════════════════════════════════════════════ */
  function fixClone(doc) {
    try {
      const style = doc.createElement('style');
      style.id = 'share-fix-style';
      style.textContent = `
        html, body {
          background: #04050c !important;
          background-image: none !important;
          margin: 0 !important; padding: 0 !important;
        }
        body::before, body::after { display: none !important; }

        #detail {
          display: block !important;
          width: 960px !important;
          min-width: 960px !important;
          max-width: 960px !important;
          background: #04050c !important;
          padding: 0 !important;
          margin: 0 !important;
          overflow: visible !important;
          max-height: none !important;
          border: none !important;
        }
        #detail-wrap { background: transparent !important; border: none !important; padding: 0 !important; }
        #detail-wrap > .panel-label { display: none !important; }

        .stat, .chart-box, .round-card, .phase-card,
        .arb-ess-box, .arb-eff-box, .arb-explain, .arb-scale-box,
        .gen-timing-box, .arb-dist.cy-panel, .record-card,
        .extra-box, .profile-info-box, .arb-score-badge,
        .squad-section {
          background: #0d1019 !important;
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
        }
        .arb-dist.cy-panel {
          background: #080a14 !important;
          border-color: rgba(95,208,232,0.18) !important;
        }
        .chart-box { background: #0a0d16 !important; }
        .arb-score-badge {
          background: #0d1019 !important;
          border-color: rgba(95,208,232,0.2) !important;
        }
        .squad-section {
          border-color: rgba(95,208,232,0.15) !important;
        }

        .rainbow, .logo-main, .panel-label, .record-title,
        .tab-btn.active .tab-cn, .section-title, .gen-section-title,
        .stat.accent .stat-value,
        .grade-s .arb-score-label, .grade-s .arb-score-num,
        .arb-score-num, .arb-score-label,
        .arb-dist-title, .arb-dist-foot,
        .hero-title, .home-section-title, .step-num, .cta-text,
        .feat-title.rainbow, .footer-logo, .squad-title {
          background: none !important;
          -webkit-background-clip: border-box !important;
          background-clip: border-box !important;
          -webkit-text-fill-color: initial !important;
          color: #5fd0e8 !important;
        }
        .grade-s .arb-score-num { color: #41ff8e !important; }
        .grade-a .arb-score-num { color: #5fd0e8 !important; }
        .grade-b .arb-score-num { color: #ffb648 !important; }
        .grade-c .arb-score-num { color: #c87840 !important; }
        .grade-d .arb-score-num { color: #6b7690 !important; }
        .stat.accent .stat-value { color: #7fe9c8 !important; }
        .stat.big  .stat-value { color: #ffb648 !important; }

        .stat.big .stat-value, .round-dur, .pt-phase-dur,
        .arb-dist-title, .arb-dist-foot, .logo-main, .hero-title {
          text-shadow: none !important;
          filter: none !important;
        }
        .arb-bar-fill.cy-fill, .arb-eff-fill,
        .round-card:hover, .phase-card:hover { box-shadow: none !important; }
        .arb-dist.cy-panel::before,
        .dz-scan, .hero-scan, .el-scan { display: none !important; }

        .round-table th { background: #0d1019 !important; color: #5fd0e8 !important; }
        .rd-table th { background: #0a0d16 !important; }
        .round-table tr:hover td, .rd-table tr:hover td { background: transparent !important; }

        /* 确保 SVG 条形图填充色可见（html2canvas 有时无法解析 CSS 变量） */
        .bar-ok { fill: #3a8ba0 !important; }
        .bar-ok:hover { fill: #5fd0e8 !important; }

        svg { overflow: visible !important; }

        .share-card-btn, .cyber-nav, .rd-toggle-btn,
        .record-card::before, .tab-btn::after,
        #dropzone, #record-list-wrap, .site-nav, footer,
        .ws-back-btn, .nav-links, .nav-glow {
          display: none !important;
        }

        .stat-label, .arb-meta-sub, .note,
        .arb-eff-hint, .arb-def-val, .arb-scale-desc,
        .squad-note { color: #6b7690 !important; }
        .stat-value, .arb-meta-title, .arb-eff-name,
        .round-no, .arb-def-key, .arb-scale-range { color: #c9d4e8 !important; }
      `;
      doc.head.appendChild(style);

      /* JS 兜底：渐变文字 */
      const fixes = [
        ['.arb-score-num', '#e8f6ff'],
        ['.grade-s .arb-score-num', '#41ff8e'],
        ['.grade-a .arb-score-num', '#5fd0e8'],
        ['.grade-b .arb-score-num', '#ffb648'],
        ['.grade-c .arb-score-num', '#c87840'],
        ['.stat.accent .stat-value', '#7fe9c8'],
        ['.stat.big .stat-value', '#ffb648'],
        ['.section-title', '#5fd0e8'],
        ['.gen-section-title', '#5fd0e8'],
        ['.panel-label', '#5fd0e8'],
        ['.arb-dist-title', '#5fd0e8'],
        ['.arb-dist-foot', '#5fd0e8'],
        ['.rainbow', '#5fd0e8'],
        ['.squad-title', '#5fd0e8'],
      ];
      for (let f = 0; f < fixes.length; f++) {
        const sel = fixes[f][0];
        const color = fixes[f][1];
        const nodes = doc.querySelectorAll(sel);
        for (let i = 0; i < nodes.length; i++) {
          const el = nodes[i];
          el.style.background = 'none';
          el.style.webkitBackgroundClip = 'border-box';
          el.style.backgroundClip = 'border-box';
          el.style.webkitTextFillColor = 'initial';
          el.style.color = color;
        }
      }

      /* html2canvas 不支持 outline，将黄色 outline 转为 border */
      const cdNodes = doc.querySelectorAll('.cd');
      for (let i = 0; i < cdNodes.length; i++) {
        const el = cdNodes[i];
        const outline = el.style.outline;
        if (outline && outline.includes('#ffd700')) {
          el.style.outline = 'none';
          el.style.border = '1.5px solid #ffd700';
          el.style.padding = '1px 3px';
          el.style.borderRadius = '2px';
        }
      }
    } catch (e) {
      console.error('fixClone error:', e);
    }
  }

  /* ═══════════════════════════════════════════════════════════════
     Canvas 后处理：赛博朋克风格装饰
     ═══════════════════════════════════════════════════════════════ */
  function decorateCanvas(srcCanvas) {
    const PAD = 24;
    const HEADER_H = 72;
    const FOOTER_H = 56;
    const w = srcCanvas.width;
    const h = srcCanvas.height;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = w + PAD * 2;
    canvas.height = h + HEADER_H + FOOTER_H + PAD * 2;

    /* 背景 */
    ctx.fillStyle = '#04050c';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    /* 外边框 */
    ctx.strokeStyle = 'rgba(95,208,232,0.12)';
    ctx.lineWidth = 1;
    ctx.strokeRect(PAD - 0.5, HEADER_H + PAD - 0.5, w + 1, h + 1);

    /* 原始截图 */
    ctx.drawImage(srcCanvas, PAD, HEADER_H + PAD);

    /* ═══════ 顶部赛博朋克品牌栏 ═══════ */
    const headerY = PAD;
    const headerW = w;
    const headerX = PAD;

    /* 品牌栏底色 */
    ctx.fillStyle = '#080a14';
    ctx.fillRect(headerX, headerY, headerW, HEADER_H);

    /* 品牌栏顶部发光细线 */
    const glowGrad = ctx.createLinearGradient(headerX, 0, headerX + headerW, 0);
    glowGrad.addColorStop(0, 'transparent');
    glowGrad.addColorStop(0.15, 'rgba(95,208,232,0.35)');
    glowGrad.addColorStop(0.5, 'rgba(95,208,232,0.7)');
    glowGrad.addColorStop(0.85, 'rgba(95,208,232,0.35)');
    glowGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = glowGrad;
    ctx.fillRect(headerX, headerY, headerW, 2);

    /* 品牌栏底部细线 */
    ctx.fillStyle = 'rgba(95,208,232,0.15)';
    ctx.fillRect(headerX, headerY + HEADER_H - 1, headerW, 1);

    /* 网站名：SUPER EELOG */
    const textStartX = headerX + 24;
    ctx.fillStyle = '#c9d4e8';
    ctx.font = 'bold 18px "Microsoft YaHei", sans-serif';
    ctx.textBaseline = 'middle';
    ctx.fillText('SUPER', textStartX, headerY + HEADER_H / 2 - 6);
    ctx.fillStyle = '#5fd0e8';
    ctx.fillText('EELOG', textStartX + 58, headerY + HEADER_H / 2 - 6);

    /* 副标题 */
    ctx.fillStyle = 'rgba(107,118,144,0.6)';
    ctx.font = '11px "Microsoft YaHei", sans-serif';
    ctx.fillText('WARFRAME SPEED  ·  EE.log Analyzer', textStartX, headerY + HEADER_H / 2 + 12);

    /* 分隔竖线 */
    ctx.fillStyle = 'rgba(95,208,232,0.12)';
    ctx.fillRect(textStartX + 276, headerY + 18, 1, HEADER_H - 36);

    /* 右侧时间戳 */
    const ts = new Date().toLocaleString('zh-CN', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit'
    });
    ctx.fillStyle = 'rgba(107,118,144,0.5)';
    ctx.font = '11px monospace';
    ctx.textAlign = 'right';
    ctx.fillText(ts, headerX + headerW - 20, headerY + HEADER_H / 2 + 1);
    ctx.textAlign = 'left';

    /* ═══════ 底部信息栏 ═══════ */
    const footerY = headerY + HEADER_H + h;
    const footerW = w;
    const footerX = headerX;

    /* 底色 */
    ctx.fillStyle = '#080a14';
    ctx.fillRect(footerX, footerY, footerW, FOOTER_H);

    /* 顶部细线 */
    ctx.fillStyle = 'rgba(95,208,232,0.08)';
    ctx.fillRect(footerX, footerY, footerW, 1);

    /* 底部居中：网站 + 组织 */
    ctx.fillStyle = '#5fd0e8';
    ctx.font = '14px "Microsoft YaHei", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('WFSpeed.run  ·  由CSC联盟建立并维护', canvas.width / 2, footerY + FOOTER_H / 2 + 5);
    ctx.textAlign = 'left';

    return canvas;
  }

  function setBusy(state, text) {
    busy = state;
    btn.classList.toggle('busy', state);
    btn.querySelector('.share-card-txt').textContent = text || '一键分享';
  }

  function capture() {
    if (busy || !detail || typeof html2canvas === 'undefined') return;
    if (!detail.querySelector('*') || detail.querySelector('.empty-state')) return;

    setBusy(true, '生成中…');

    const savedScroll = window.scrollY;
    window.scrollTo(0, 0);

    const hideEls = [];
    document.querySelectorAll('.cyber-nav, .share-card-btn').forEach(el => {
      if (el && el.style.display !== 'none') {
        hideEls.push(el);
        el.style.visibility = 'hidden';
      }
    });

    html2canvas(detail, {
      backgroundColor: '#04050c',
      scale: 1.5,
      useCORS: true,
      allowTaint: true,
      imageTimeout: 0,
      logging: false,
      scrollX: 0,
      scrollY: 0,
      onclone: (doc) => fixClone(doc),
    }).then((rawCanvas) => {
      hideEls.forEach(el => { el.style.visibility = ''; });
      window.scrollTo(0, savedScroll);

      const finalCanvas = decorateCanvas(rawCanvas);

      finalCanvas.toBlob((blob) => {
        if (!blob) { setBusy(false, '生成失败'); resetSoon(); return; }
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
        a.href = url; a.download = 'EElog分析_' + stamp + '.png';
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 4000);
        setBusy(false, '已保存 ✓'); resetSoon();
      }, 'image/png');
    }).catch((err) => {
      console.error('Share card capture error:', err);
      console.error('Error stack:', err.stack);
      console.error('Error message:', err.message);
      hideEls.forEach(el => { el.style.visibility = ''; });
      window.scrollTo(0, savedScroll);
      setBusy(false, '生成失败'); resetSoon();
    });
  }

  function resetSoon() { setTimeout(() => setBusy(false, '一键分享'), 1800); }

  function init() {
    detail = document.getElementById('detail');
    if (!detail) return;
    build();
    new MutationObserver(toggleShow).observe(detail, { childList: true, subtree: true });
    toggleShow();
  }

  return { init };
})();

if (document.readyState !== 'loading') WF.shareCard.init();
else document.addEventListener('DOMContentLoaded', WF.shareCard.init);
