/* 赛博导航按钮
 * 右下角常驻按钮，鼠标悬停时以赛博蒸汽风格展开，列出当前详情区内所有可见模块，
 * 点击任一模块名精准平滑滚动定位。列表随详情内容变化自动重建（MutationObserver）。
 * 与暗金主题无关，独立赛博配色（青/品红霓虹）。 */
window.WF = window.WF || {};

WF.cyberNav = (function () {
  // 详情区内代表"模块标题"的选择器（涵盖各任务类型的分节标题）
  // 大蜘蛛 Profit-Taker 页面只用 .squad-title 和 .pt-bar-label（全程时间轴），
  // .pt-sec-title 等小节标题不加入，避免导航冗余。
  const HEADING_SEL = '.arb-meta-title, .squad-title, .section-title, .arb-dist-title, .gen-section-title, .dis-tl-title, .pt-bar-label, .gen-timing-title';
  const HEADER_OFFSET = 84; // 顶部固定导航栏高度补偿

  let root, listEl, detail, observer, rebuildTimer;

  function build() {
    if (root) return;
    root = document.createElement('div');
    root.className = 'cyber-nav';
    root.innerHTML =
      '<div class="cyber-nav-panel" id="cyber-nav-panel">' +
        '<div class="cyber-nav-hd"><span>导航</span><i>NAV</i></div>' +
        '<div class="cyber-nav-list" id="cyber-nav-list"></div>' +
      '</div>' +
      '<button class="cyber-nav-btn" type="button" aria-label="模块导航">' +
        '<span class="cyber-nav-core"></span>' +
        '<span class="cyber-nav-ring"></span>' +
        '<span class="cyber-nav-glyph">☰</span>' +
      '</button>';
    document.body.appendChild(root);
    listEl = root.querySelector('#cyber-nav-list');

    // 悬停展开：改用 JS 控制 + 延迟收起，而不是纯 CSS :hover。
    // 面板与按钮之间隔着一小段间距（视觉呼吸感），鼠标从按钮斜向移动到面板条目
    // 途中会短暂离开两者的盒子范围——纯 CSS :hover 没有记忆，一旦离开哪怕一帧
    // 就立刻收起，导致正在挪向条目时导航栏突然关掉。加一个短暂延迟，只要在延迟
    // 时间内重新进入按钮或面板就会取消收起，跨越间隙也不会误关。
    const btn   = root.querySelector('.cyber-nav-btn');
    const panel = root.querySelector('.cyber-nav-panel');
    let closeTimer = null;
    function openNow() { clearTimeout(closeTimer); root.classList.add('open'); }
    function closeSoon() {
      clearTimeout(closeTimer);
      closeTimer = setTimeout(function () { root.classList.remove('open'); }, 260);
    }
    btn.addEventListener('mouseenter', openNow);
    btn.addEventListener('mouseleave', closeSoon);
    panel.addEventListener('mouseenter', openNow);
    panel.addEventListener('mouseleave', closeSoon);
    // 移动端 / 无 hover 场景：点击切换
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      clearTimeout(closeTimer);
      root.classList.toggle('open');
    });
    document.addEventListener('click', function () { clearTimeout(closeTimer); root.classList.remove('open'); });
    panel.addEventListener('click', function (e) { e.stopPropagation(); });
  }

  function labelOf(el) {
    // 取标题文本首段（去掉英文副标题/计数括注），保持简短
    let t = (el.textContent || '').trim();
    t = t.replace(/（.*?）|\(.*?\)/g, '').replace(/\s+/g, ' ').trim();
    // meta-title 可能很长（节点·星球·类型·派系），压成"任务概览"
    if (el.classList.contains('arb-meta-title')) return '任务概览';
    // 大蜘蛛全程时间轴专用标签
    if (el.classList.contains('pt-bar-label')) return '全程时间轴';
    return t.length > 10 ? t.slice(0, 10) : t;
  }

  function smoothScrollTo(targetY) {
    const startY = window.pageYOffset;
    const diff = targetY - startY;
    const duration = 600; // ms
    const startTime = performance.now();
    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      window.scrollTo(0, startY + diff * eased);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function rebuild() {
    if (!detail) return;
    const heads = Array.from(detail.querySelectorAll(HEADING_SEL))
      .filter((el) => el.offsetParent !== null && (el.textContent || '').trim());
    if (!heads.length) { root.classList.remove('show'); return; }
    root.classList.add('show');
    listEl.innerHTML = '';
    // 顶部锚
    addItem('▲ 顶部', () => smoothScrollTo(0));
    heads.forEach((el) => {
      addItem(labelOf(el), () => {
        const y = el.getBoundingClientRect().top + window.pageYOffset - HEADER_OFFSET;
        smoothScrollTo(y);
      });
    });
  }

  function addItem(text, onClick) {
    const it = document.createElement('button');
    it.className = 'cyber-nav-item';
    it.type = 'button';
    it.innerHTML = '<span class="cyber-nav-dot"></span><span>' + text + '</span>';
    it.addEventListener('click', function (e) {
      e.stopPropagation();
      onClick();
      root.classList.remove('open');
    });
    listEl.appendChild(it);
  }

  function scheduleRebuild() {
    clearTimeout(rebuildTimer);
    rebuildTimer = setTimeout(rebuild, 80);
  }

  function init() {
    detail = document.getElementById('detail');
    if (!detail) return;
    build();
    observer = new MutationObserver(scheduleRebuild);
    observer.observe(detail, { childList: true, subtree: true });
    scheduleRebuild();
  }

  return { init };
})();

if (document.readyState !== 'loading') WF.cyberNav.init();
else document.addEventListener('DOMContentLoaded', WF.cyberNav.init);
