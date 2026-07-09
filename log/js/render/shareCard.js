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

  /* ════════════════════════════════════════════════════════════════
     字体预加载：将 XSZT 字体转为 Base64 Data URL，供克隆文档内嵌使用
     ════════════════════════════════════════════════════════════════ */
  let cachedFont = null;
  function loadFontAsDataURL() {
    if (cachedFont) return Promise.resolve(cachedFont);
    const tryFetch = (path) => fetch(path).then(r =>
      r.ok ? r.blob().then(b => ({ blob: b, path })) : Promise.reject(new Error('fetch failed: ' + path))
    );
    const toBase64 = ({ blob, path }) => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve({ dataUrl: reader.result, path });
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
    // 字体相对 log/analyzer.html 的路径为 ../fonts/
    return tryFetch('../fonts/xszt.woff2')
      .catch(() => tryFetch('../fonts/xszt.ttf'))
      .then(toBase64)
      .then(({ dataUrl, path }) => {
        const format = path.endsWith('.woff2') ? 'woff2' : 'truetype';
        cachedFont = { dataUrl, format };
        return cachedFont;
      })
      .catch(err => {
        console.warn('Share card font preload failed:', err);
        return null;
      });
  }

  function injectFontFace(doc, font) {
    if (!font || !font.dataUrl) return;
    try {
      const style = doc.createElement('style');
      style.id = 'share-font-style';
      style.textContent = `
        @font-face {
          font-family: 'XSZT';
          src: url("${font.dataUrl}") format("${font.format}");
          font-weight: normal;
          font-style: normal;
          font-display: block;
        }
        #detail, #detail *, #detail *::before, #detail *::after,
        #detail svg text, #detail svg tspan, #detail svg,
        .opening-kills-chart text, .dis-chart-zoom text,
        .round-chart text { font-family: 'XSZT', 'Microsoft YaHei', monospace !important; }
        /* SVG 内文本最小字体大小保底（XSZT 字体在过小尺寸下难以识别，12px起） */
        #detail svg text, #detail svg tspan, #detail text { font-size: inherit !important; }
      `;
      doc.head.appendChild(style);
    } catch (e) {
      console.warn('injectFontFace error:', e);
    }
  }

  /* ════════════════════════════════════════════════════════════════
     截图克隆修复（所有 DOM 操作都包裹 try-catch，确保不导致 html2canvas 失败）
     ════════════════════════════════════════════════════════════════ */
  function fixClone(doc, font) {
    try {
      /* ── 1. 注入通用样式规则 ── */
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
          position: static !important;
          width: 960px !important;
          min-width: 960px !important;
          max-width: 960px !important;
          height: auto !important;
          min-height: 0 !important;
          max-height: none !important;
          background: #04050c !important;
          padding: 28px 36px 36px !important;
          margin: 0 !important;
          overflow: visible !important;
          border: none !important;
          box-sizing: border-box !important;
        }
        #detail-wrap { background: transparent !important; border: none !important; padding: 0 !important; overflow: visible !important; min-width: 0 !important; }
        #detail-wrap > .panel-label { display: none !important; }

        /* 统一卡片间距与边框 */
        .stat, .chart-box, .round-card, .phase-card,
        .arb-ess-box, .arb-eff-box, .arb-explain, .arb-scale-box,
        .gen-timing-box, .arb-dist.cy-panel, .record-card,
        .extra-box, .profile-info-box, .arb-score-badge,
        .squad-section {
          background: #0d1019 !important;
          border: 1px solid rgba(95,208,232,0.12) !important;
          border-radius: 12px !important;
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
        }
        .chart-box, .arb-dist.cy-panel, .arb-ess-box, .arb-eff-box,
        .arb-explain, .arb-scale-box, .gen-timing-box, .squad-section,
        .extra-box, .profile-info-box, .record-card {
          padding: 18px 20px !important;
          margin: 0 0 20px !important;
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
          margin: 6px 0 20px !important;
        }
        .hero-row {
          display: flex !important;
          gap: 14px !important;
          margin: 0 0 20px !important;
        }
        .stat {
          border-radius: 12px !important;
          padding: 16px 20px 14px !important;
          margin: 0 !important;
          flex: 1 1 0 !important;
        }
        .section-title, .gen-section-title, .dis-section-title {
          margin: 0 0 12px !important;
          padding: 0 !important;
          line-height: 1.3 !important;
        }
        .chart-box > .section-title:first-child,
        .chart-box > .gen-section-title:first-child,
        .chart-box > .dis-section-title:first-child { margin-top: 0 !important; }
        .chart-box > *:last-child { margin-bottom: 0 !important; }
        .dis-chart-zoom { margin: 10px 0 0 !important; }
        .round-table { margin: 10px 0 0 !important; }

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

        /* 确保 SVG 条形图填充色可见（html2canvas 有时无法解析 CSS 变量和 url(#gradient) 引用） */
        .bar-ok { fill: #3a8ba0 !important; }
        .bar-ok:hover { fill: #5fd0e8 !important; }
        .bar-fail { fill: #ff6b75 !important; }
        .bar-fail:hover { fill: #ff8e96 !important; }

        /* 每轮前10秒击杀数柱状图：覆盖 url(#cyber-bar-gradient) 为实色，确保克隆文档中有效 */
        .cyber-bar { fill: #1a7a9a !important; filter: none !important; }
        .cyber-bar-group:hover .cyber-bar { fill: #2a9aca !important; }
        .cyber-grid-line { stroke: rgba(95,208,232,0.18) !important; stroke-width: 1; stroke-dasharray: 3 3; }
        .cyber-axis-text { fill: #6b7690 !important; font-family: 'XSZT', 'Microsoft YaHei', monospace !important; font-size: 10px !important; }
        .cyber-axis-title { fill: #5fd0e8 !important; font-family: 'XSZT', 'Microsoft YaHei', monospace !important; font-size: 11px !important; }
        .cyber-bar-value { fill: #dffbff !important; font-family: 'XSZT', 'Microsoft YaHei', monospace !important; font-size: 10px !important; }
        /* 柱状图容器在克隆中关闭动画和伪元素 */
        .cyber-chart-box::before, .cyber-chart-box::after, .chart-box.dis-tl-wrap::before, .chart-box.dis-tl-wrap::after { display: none !important; }
        .cyber-bar-group { animation: none !important; }

        svg { overflow: visible !important; }
        .round-chart { max-width: 100% !important; height: auto !important; }
        .dis-tl-wrap .round-chart { width: auto !important; min-width: 0 !important; display: block !important; }

        /* 每轮前10秒击杀数 SVG —— 固定 760px 宽度并等比缩放 */
        .opening-kills-chart {
          width: 760px !important;
          max-width: 100% !important;
          height: auto !important;
          display: block !important;
          font-family: 'XSZT', 'Microsoft YaHei', monospace !important;
        }

        /* 击杀走势图在分享图中完整显示（取消横向滚动，等比缩放） */
        .dis-chart-zoom {
          overflow: visible !important;
          width: 100% !important;
        }
        .dis-chart-zoom svg {
          width: 100% !important;
          height: auto !important;
          max-width: 100% !important;
          display: block !important;
        }

        /* 强制所有 SVG 文本在分享图中使用 XSZT 字体 */
        svg text, svg tspan { font-family: 'XSZT', 'Microsoft YaHei', monospace !important; }

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

      /* ── 2. 直接在克隆元素上设置内联样式，确保 html2canvas 读取到正确的宽高 ── */
      var detailClone = doc.getElementById('detail');
      if (detailClone) {
        detailClone.style.display = 'block';
        detailClone.style.position = 'static';
        detailClone.style.width = '960px';
        detailClone.style.minWidth = '960px';
        detailClone.style.maxWidth = '960px';
        detailClone.style.height = 'auto';
        detailClone.style.minHeight = '0';
        detailClone.style.maxHeight = 'none';
        detailClone.style.overflow = 'visible';
        detailClone.style.padding = '28px 36px 36px';
        detailClone.style.margin = '0';
        detailClone.style.border = 'none';
        detailClone.style.boxSizing = 'border-box';
        detailClone.style.background = '#04050c';
      }
      var detailWrap = doc.getElementById('detail-wrap');
      if (detailWrap) {
        detailWrap.style.background = 'transparent';
        detailWrap.style.border = 'none';
        detailWrap.style.padding = '0';
        detailWrap.style.overflow = 'visible';
        detailWrap.style.minWidth = '0';
      }

      /* ── 3. 注入内嵌 XSZT 字体 ── */
      injectFontFace(doc, font);

      /* ── 4. 在分享图中隐藏导管成功率的具体数字，只显示百分比 ── */
      var statLabels = doc.querySelectorAll('.stat-label');
      for (var i = 0; i < statLabels.length; i++) {
        var label = statLabels[i];
        if (label.textContent.trim() === '导管成功率') {
          var stat = label.parentElement;
          var valueEl = stat && stat.querySelector('.stat-value');
          if (valueEl) {
            valueEl.textContent = valueEl.textContent.replace(/\s*[（(].*?[）)]/g, '');
          }
        }
      }

      /* ── 5. JS 兜底：渐变文字 ── */
      var fixes = [
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
      for (var f = 0; f < fixes.length; f++) {
        var sel = fixes[f][0];
        var color = fixes[f][1];
        var nodes = doc.querySelectorAll(sel);
        for (var j = 0; j < nodes.length; j++) {
          var el = nodes[j];
          el.style.background = 'none';
          el.style.webkitBackgroundClip = 'border-box';
          el.style.backgroundClip = 'border-box';
          el.style.webkitTextFillColor = 'initial';
          el.style.color = color;
        }
      }

      /* ── 6. html2canvas 不支持 outline，将黄色 outline 转为 border + box-shadow ── */
      var cdNodes = doc.querySelectorAll('.cd');
      for (var k = 0; k < cdNodes.length; k++) {
        var cd = cdNodes[k];
        var outline = (cd.style.outline || '').toLowerCase();
        var outlineColor = (cd.style.outlineColor || '').toLowerCase();
        var isGold = outline.indexOf('#ffd700') >= 0 || outline.indexOf('rgb(255, 215, 0)') >= 0 ||
                     outline.indexOf('gold') >= 0 || outlineColor.indexOf('#ffd700') >= 0 ||
                     outlineColor.indexOf('rgb(255, 215, 0)') >= 0 || outlineColor.indexOf('gold') >= 0;
        if (isGold) {
          cd.style.outline = 'none';
          cd.style.border = '2px solid #ffd700';
          cd.style.boxShadow = '0 0 0 1px #ffd700';
          cd.style.padding = '1px 3px';
          cd.style.borderRadius = '2px';
        }
      }

      /* ── 7. XSZT 字体预加载（同步触发，不 await —— 克隆文档中 FontFaceSet 可能不响应） ── */
      try {
        if (doc.fonts && typeof doc.fonts.load === 'function' && font && font.dataUrl) {
          doc.fonts.load("16px 'XSZT'");
          doc.fonts.load("24px 'XSZT'");
        }
      } catch (e) { /* ignore */ }
    } catch (e) {
      console.error('fixClone error:', e);
    }
  }

  /* ═══════════════════════════════════════════════════════════════
     Canvas 后处理：赛博朋克风格装饰
     ═══════════════════════════════════════════════════════════════ */
  function decorateCanvas(srcCanvas, fontFace) {
    const PAD = 40;
    const HEADER_H = 96;
    const FOOTER_H = 72;
    const INNER_PAD = 18;
    const CARD_RADIUS = 18;
    // srcCanvas 已经是 html2canvas 输出的物理像素（width/height 已包含 scale）
    const pxW = srcCanvas.width;
    const pxH = srcCanvas.height;
    const w = pxW;
    const h = pxH;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = w + PAD * 2;
    canvas.height = h + HEADER_H + FOOTER_H + PAD * 2;

    const fontFamily = fontFace ? "'XSZT', 'Microsoft YaHei', monospace" : "'Microsoft YaHei', sans-serif";

    /* 背景 */
    ctx.fillStyle = '#04050c';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    /* 外层卡片（与截图等宽，圆角） */
    ctx.fillStyle = '#080a14';
    roundRect(ctx, PAD, PAD + HEADER_H, w, h + FOOTER_H, CARD_RADIUS);
    ctx.fill();

    /* 外层卡片微光边框 */
    ctx.strokeStyle = 'rgba(95,208,232,0.16)';
    ctx.lineWidth = 1;
    roundRect(ctx, PAD + 0.5, PAD + HEADER_H + 0.5, w - 1, h + FOOTER_H - 1, CARD_RADIUS);
    ctx.stroke();

    /* 截图底衬：让截图嵌在深色卡片内 */
    ctx.fillStyle = '#04050c';
    roundRect(ctx, PAD + INNER_PAD, PAD + HEADER_H + INNER_PAD, w - INNER_PAD * 2, h - INNER_PAD * 2, 14);
    ctx.fill();

    /* 原始截图 */
    ctx.save();
    roundRect(ctx, PAD + INNER_PAD, PAD + HEADER_H + INNER_PAD, w - INNER_PAD * 2, h - INNER_PAD * 2, 14);
    ctx.clip();
    ctx.drawImage(srcCanvas, PAD + INNER_PAD, PAD + HEADER_H + INNER_PAD);
    ctx.restore();

    /* ═══════ 顶部赛博朋克品牌栏 ═══════ */
    const headerY = PAD;
    const headerW = w;
    const headerX = PAD;

    /* 品牌栏底色 */
    ctx.fillStyle = '#080a14';
    roundRect(ctx, headerX, headerY, headerW, HEADER_H, CARD_RADIUS);
    ctx.fill();

    /* 品牌栏顶部发光细线 */
    const glowGrad = ctx.createLinearGradient(headerX, 0, headerX + headerW, 0);
    glowGrad.addColorStop(0, 'transparent');
    glowGrad.addColorStop(0.08, 'rgba(95,208,232,0.35)');
    glowGrad.addColorStop(0.5, 'rgba(95,208,232,0.9)');
    glowGrad.addColorStop(0.92, 'rgba(95,208,232,0.35)');
    glowGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = glowGrad;
    ctx.fillRect(headerX + 2, headerY + 2, headerW - 4, 2);

    /* 品牌栏底部细线 */
    ctx.fillStyle = 'rgba(95,208,232,0.16)';
    ctx.fillRect(headerX + 28, headerY + HEADER_H - 2, headerW - 56, 1);

    /* 左侧 Logo 区域 */
    const logoX = headerX + 28;
    const logoY = headerY + HEADER_H / 2;

    /* Logo 六边形 */
    const hx = logoX + 14;
    const hy = headerY + 30;
    const size = 14;
    ctx.fillStyle = 'rgba(95,208,232,0.12)';
    ctx.strokeStyle = 'rgba(95,208,232,0.5)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = Math.PI / 3 * i - Math.PI / 6;
      const x = hx + size * Math.cos(angle);
      const y = hy + size * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    /* 网站名：SUPER EELOG（先画灰色 SUPER，量宽度，再画青色 EELOG，永不错位） */
    ctx.textBaseline = 'middle';
    ctx.font = `500 22px ${fontFamily}`;
    ctx.fillStyle = '#c9d4e8';
    ctx.fillText('SUPER', logoX + 38, logoY - 7);
    const superW = ctx.measureText('SUPER').width;
    ctx.font = `600 22px ${fontFamily}`;
    ctx.fillStyle = '#5fd0e8';
    ctx.fillText('EELOG', logoX + 38 + superW + 6, logoY - 7);

    /* 副标题 */
    ctx.fillStyle = 'rgba(107,118,144,0.75)';
    ctx.font = `12px ${fontFamily}`;
    ctx.fillText('WARFRAME SPEED  ·  EE.LOG ANALYZER', logoX + 40, logoY + 16);

    /* 分隔竖线 */
    ctx.fillStyle = 'rgba(95,208,232,0.12)';
    ctx.fillRect(headerX + 330, headerY + 24, 1, HEADER_H - 48);

    /* 右侧时间戳 */
    const ts = new Date().toLocaleString('zh-CN', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit'
    });
    ctx.fillStyle = 'rgba(107,118,144,0.6)';
    ctx.font = `13px ${fontFamily}`;
    ctx.textAlign = 'right';
    ctx.fillText(ts, headerX + headerW - 28, logoY + 1);
    ctx.textAlign = 'left';

    /* ═══════ 底部信息栏 ═══════ */
    const footerY = headerY + HEADER_H + h;
    const footerW = w;
    const footerX = headerX;

    /* 底色（与外层卡片连成一体，但保持视觉分区） */
    ctx.fillStyle = '#080a14';
    roundRect(ctx, footerX, footerY, footerW, FOOTER_H, CARD_RADIUS);
    ctx.fill();

    /* 顶部分隔线 */
    ctx.fillStyle = 'rgba(95,208,232,0.12)';
    ctx.fillRect(footerX + 28, footerY + 1, footerW - 56, 1);

    /* 底部左侧：站点 */
    ctx.fillStyle = '#5fd0e8';
    ctx.font = `600 14px ${fontFamily}`;
    ctx.textBaseline = 'middle';
    ctx.fillText('WFSpeed.run', footerX + 28, footerY + FOOTER_H / 2);

    /* 分隔点 */
    ctx.fillStyle = 'rgba(107,118,144,0.45)';
    ctx.beginPath();
    ctx.arc(footerX + 136, footerY + FOOTER_H / 2, 2.5, 0, Math.PI * 2);
    ctx.fill();

    /* 底部中间：组织 */
    ctx.fillStyle = 'rgba(201,212,232,0.75)';
    ctx.font = `13px ${fontFamily}`;
    ctx.fillText('由 CSC 联盟建立并维护', footerX + 152, footerY + FOOTER_H / 2);

    /* 底部右侧：免责声明 */
    ctx.fillStyle = 'rgba(107,118,144,0.55)';
    ctx.font = `12px ${fontFamily}`;
    ctx.textAlign = 'right';
    ctx.fillText('本工具仅读取本地日志，完全离线运行', footerX + footerW - 28, footerY + FOOTER_H / 2);
    ctx.textAlign = 'left';

    return { canvas, w: w + PAD * 2, h: h + HEADER_H + FOOTER_H + PAD * 2 };
  }

  function roundRect(ctx, x, y, w, h, r) {
    const rr = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + rr, y);
    ctx.lineTo(x + w - rr, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + rr);
    ctx.lineTo(x + w, y + h - rr);
    ctx.quadraticCurveTo(x + w, y + h, x + w - rr, y + h);
    ctx.lineTo(x + rr, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - rr);
    ctx.lineTo(x, y + rr);
    ctx.quadraticCurveTo(x, y, x + rr, y);
    ctx.closePath();
  }

  function setBusy(state, text) {
    busy = state;
    btn.classList.toggle('busy', state);
    btn.querySelector('.share-card-txt').textContent = text || '一键分享';
  }

  /* 将生成的 PNG Blob 写入用户指定的 Downloads 目录（已禁用 showSaveFilePicker，
     因为该 API 需要用户手势才能调用，在分享图生成的异步流程中不可用） */
  function saveToDownloads(blob, fileName) {
    // 尝试 File System Access API（只在实际用户点击流中可用），静默失败即可
    try {
      if (typeof showSaveFilePicker === 'function') {
        showSaveFilePicker({
          suggestedName: fileName,
          types: [{ description: 'PNG Image', accept: { 'image/png': ['.png'] } }]
        }).then(handle => handle.createWritable().then(writable => {
          writable.write(blob);
          return writable.close();
        })).catch(function() { /* 静默 */ });
      }
    } catch (e) {
      /* 静默 */
    }
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

    /* ═══ 关键：临时将真实页面上的 #detail 改为 960px，html2canvas 据此测量宽高 ═══ */
    var origDetailWidth = detail.style.width;
    var origDetailMinW = detail.style.minWidth;
    var origDetailMaxW = detail.style.maxWidth;
    var origDetailOverflow = detail.style.overflow;
    var origDetailMargin = detail.style.margin;
    var origDetailBoxSizing = detail.style.boxSizing;

    var origWrapOverflow, origWrapMinW;
    var detailWrap = document.getElementById('detail-wrap');
    if (detailWrap) {
      origWrapOverflow = detailWrap.style.overflow;
      origWrapMinW = detailWrap.style.minWidth;
      detailWrap.style.overflow = 'visible';
      detailWrap.style.minWidth = '0';
    }

    detail.style.width = '960px';
    detail.style.minWidth = '960px';
    detail.style.maxWidth = '960px';
    detail.style.overflow = 'visible';
    detail.style.margin = '0';
    detail.style.boxSizing = 'border-box';
    /* 强制浏览器重新计算布局，确保 html2canvas 读取到新的宽高 */
    void detail.offsetWidth;

    function restorePage() {
      detail.style.width = origDetailWidth;
      detail.style.minWidth = origDetailMinW;
      detail.style.maxWidth = origDetailMaxW;
      detail.style.overflow = origDetailOverflow;
      detail.style.margin = origDetailMargin;
      detail.style.boxSizing = origDetailBoxSizing;
      if (detailWrap) {
        detailWrap.style.overflow = origWrapOverflow;
        detailWrap.style.minWidth = origWrapMinW;
      }
      hideEls.forEach(el => { el.style.visibility = ''; });
    }

    loadFontAsDataURL().then((font) => {
      html2canvas(detail, {
        backgroundColor: '#04050c',
        scale: 1.5,
        width: 960,
        windowWidth: 960,
        useCORS: true,
        allowTaint: true,
        imageTimeout: 0,
        logging: false,
        scrollX: 0,
        scrollY: 0,
        onclone: function(doc) { fixClone(doc, font); },
      }).then((rawCanvas) => {
        restorePage();
        window.scrollTo(0, savedScroll);

        const { canvas: finalCanvas, w: finalW, h: finalH } = decorateCanvas(rawCanvas, font && font.dataUrl ? 'XSZT' : null);

        finalCanvas.toBlob((blob) => {
          if (!blob) { setBusy(false, '生成失败'); resetSoon(); return; }
          const url = URL.createObjectURL(blob);
          const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
          const fileName = 'EElog分析_' + stamp + '.png';

          /* 同时保存到 Downloads 目录供用户/程序读取 */
          saveToDownloads(blob, fileName);

          const a = document.createElement('a');
          a.href = url; a.download = fileName;
          document.body.appendChild(a); a.click(); a.remove();
          setTimeout(() => URL.revokeObjectURL(url), 4000);
          setBusy(false, '已保存 ✓'); resetSoon();
        }, 'image/png');
      }).catch((err) => {
        console.error('Share card capture error:', err);
        console.error('Error stack:', err.stack);
        console.error('Error message:', err.message);
        restorePage();
        window.scrollTo(0, savedScroll);
        setBusy(false, '生成失败'); resetSoon();
      });
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
