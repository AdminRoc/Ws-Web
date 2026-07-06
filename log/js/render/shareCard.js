/* 一键分享
 * 将当前"详情"分析结果（#detail）渲染为一张 PNG 图片并下载。
 * 只截取分析结果本体，不含顶部标题栏、右下角导航按钮、左侧记录列表。
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

  // 在克隆节点上把"渐变裁剪文字"改回实心色，避免截图里变透明/发黑
  function fixClone(doc) {
    const fixes = [
      ['.arb-score-num', '#e8f6ff'],
      ['.grade-s .arb-score-num', '#41ff8e'],
      ['.grade-a .arb-score-num', '#5fd0e8'],
      ['.grade-b .arb-score-num', '#ffb648'],
      ['.grade-c .arb-score-num', '#c87840'],
      ['.stat.accent .stat-value', '#7fe9c8'],
      // 渐变裁剪文字标题：截图里需还原为实心色，否则被渲染成整条色块
      ['.section-title', '#7fe9c8'],
      ['.gen-section-title', '#7fe9c8'],
    ];
    fixes.forEach(([sel, color]) => {
      doc.querySelectorAll(sel).forEach((el) => {
        el.style.background = 'none';
        el.style.webkitBackgroundClip = 'border-box';
        el.style.backgroundClip = 'border-box';
        el.style.color = color;
      });
    });
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
    const bg = getComputedStyle(document.body).backgroundColor || '#0a0d16';
    html2canvas(detail, {
      backgroundColor: bg && bg !== 'rgba(0, 0, 0, 0)' ? bg : '#0a0d16',
      scale: Math.min(2, window.devicePixelRatio || 1.5),
      useCORS: true,
      logging: false,
      onclone: (doc) => fixClone(doc),
    }).then((canvas) => {
      canvas.toBlob((blob) => {
        if (!blob) { setBusy(false, '生成失败'); resetSoon(); return; }
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
        a.href = url; a.download = `EElog分析_${stamp}.png`;
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 4000);
        setBusy(false, '已保存 ✓'); resetSoon();
      }, 'image/png');
    }).catch(() => { setBusy(false, '生成失败'); resetSoon(); });
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
