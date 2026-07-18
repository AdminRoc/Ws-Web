/* 赛博导航按钮
 * 右下角常驻按钮，鼠标悬停时以赛博蒸汽风格展开，列出当前详情区内所有可见模块，
 * 点击任一模块名精准平滑滚动定位。列表随详情内容变化自动重建（MutationObserver）。
 * 与暗金主题无关，独立赛博配色（青/品红霓虹）。
 *
 * 二级展开（逐轮导管时间轴 R1…RN 扇形分叉面板）：
 * 通用探测——仅当某导航项对应标题所在的直接区块内能查到 [id^="dis-tl-round-"]
 * 轮次锚点时，该项才获得二级能力；其他页面/其他导航项行为与之前逐字一致。
 * 悬停约 150ms（意图延迟，防止扫过误触）后向左多列蛇形爆发展开 R 按钮矩阵：
 * 纯 transform/opacity 错峰动画（60fps）、整体时长 > 1s、上下左右视口 clamp。
 * 展开即"锁定态"：主导航不再因鼠标离开而收起；点击任一 R 按钮平滑滚动到对应
 * 轮次并整体收回；点击页面空白需两次才收回（第一次仅边框闪烁/抖动提示）。
 * 锁定自 openSub 被调用的瞬间生效（含错峰动画进行期间），此后只有
 * 两次空白点击 / 点击 R 按钮 / Esc 三条收回路径；鼠标移动类事件一律不收回。
 * 图表 hover 自愈：ECharts tooltip、SVG 高亮等瞬态 DOM 噪声会命中 #detail 的
 * MutationObserver，rebuild 以"标题元素身份+标签+轮次锚点"指纹判变，内容零
 * 变化时整体跳过重建——噪声不再撤掉悬停意图，也不再瞬时收回已锁定的二级面板。
 * 样式全部在 css/cyber-nav-expand.css，不动 style.css。 */
window.WF = window.WF || {};

WF.cyberNav = (function () {
  // 详情区内代表"模块标题"的选择器（涵盖各任务类型的分节标题）
  // 仲裁页面的 ECharts 图表卡片标题 .arb-chart-title 也加入，使右下角导航能映射到每个子模块。
  // 大蜘蛛 Profit-Taker 页面只用 .squad-title 和 .pt-bar-label（全程时间轴），
  // .pt-sec-title 等小节标题不加入，避免导航冗余。
  const HEADING_SEL = '.arb-meta-title, .squad-title, .section-title, .arb-dist-title, .arb-chart-title, .gen-section-title, .dis-tl-title, .pt-bar-label, .gen-timing-title';
  const HEADER_OFFSET = 84; // 顶部固定导航栏高度补偿

  // ── 二级展开：探测选择器与布局/动画常量 ──────────────────
  const ROUND_ID_SEL = '[id^="dis-tl-round-"]'; // 轮次锚点（通用探测，不限定具体页面）
  const ROUND_NO_SEL = '.dis-tl2-rno';          // 轮次号文本来源（如 "R12"）
  const SUB_BTN_W = 46, SUB_BTN_H = 30;         // 单个 R 按钮尺寸（px）
  const SUB_GAP = 8, SUB_PAD = 12;              // 网格间距 / 面板内边距
  const SUB_MAX_ROWS = 11, SUB_MIN_ROWS = 2;    // 每列行数钳制 → 超出自动向左加列
  const SUB_TOP_MARGIN = 90;                    // 面板顶部不得越过的视口边界（避开固定导航栏）
  const SUB_BOTTOM_MARGIN = 20, SUB_SIDE_GAP = 12, SUB_MIN_LEFT = 12;
  const SUB_OPEN_INTENT = 150;   // 悬停意图延迟（ms）：扫过列表不误触发锁定
  const SUB_ANIM_DUR = 680;      // 单按钮展开时长（ms，与 CSS 过渡一致）
  const SUB_MIN_SPREAD = 380;    // 最小错峰跨度（ms）：保证任何 N 下整体展开 > 1s
  const SUB_CLOSE_DUR = 400;     // 单按钮收回时长（ms）

  let root, panelEl, listEl, detail, observer, rebuildTimer;
  let closeTimer = null; // 主导航 260ms 延迟收起计时（模块级：二级锁定期间需可取消/抑制）

  // ── 二级展开运行态 ──
  let subPanel = null;       // 二级面板 DOM（挂在 body 下，fixed 定位）
  let subOpen = false;       // 锁定态：true 期间主导航禁止因鼠标离开而收起
  let subItemEl = null;      // 触发二级的导航项（用于高亮与锚点定位）
  let subBlankArmed = false; // 空白点击两段式：第一次置位并闪烁提示，第二次才收回
  let subRemoveTimer = null; // 收回动画结束后的 DOM 移除计时
  let subIntentTimer = null; // 悬停意图计时
  let subMaxDelay = 0;       // 本次展开的最大错峰延迟（收回时反向错峰用）

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
    panelEl = root.querySelector('#cyber-nav-panel');

    // 悬停展开：改用 JS 控制 + 延迟收起，而不是纯 CSS :hover。
    // 面板与按钮之间隔着一小段间距（视觉呼吸感），鼠标从按钮斜向移动到面板条目
    // 途中会短暂离开两者的盒子范围——纯 CSS :hover 没有记忆，一旦离开哪怕一帧
    // 就立刻收起，导致正在挪向条目时导航栏突然关掉。加一个短暂延迟，只要在延迟
    // 时间内重新进入按钮或面板就会取消收起，跨越间隙也不会误关。
    const btn = root.querySelector('.cyber-nav-btn');
    function openNow() { clearTimeout(closeTimer); root.classList.add('open'); }
    btn.addEventListener('mouseenter', openNow);
    btn.addEventListener('mouseleave', scheduleMainClose);
    panelEl.addEventListener('mouseenter', openNow);
    panelEl.addEventListener('mouseleave', scheduleMainClose);
    // 鼠标回到按钮/面板视为重新 engaging：解除"空白点击一段"武装
    btn.addEventListener('mouseenter', disarmBlank);
    panelEl.addEventListener('mouseenter', disarmBlank);
    // 移动端 / 无 hover 场景：点击切换
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      clearTimeout(closeTimer);
      // 二级锁定中点击主按钮：连带收回二级并整体关闭
      if (subOpen) { collapseSub(false); root.classList.remove('open'); return; }
      root.classList.toggle('open');
    });
    document.addEventListener('click', function () {
      clearTimeout(closeTimer);
      // 二级锁定中：面板/条目/按钮上的点击均已 stopPropagation，
      // 能冒泡到这里的都是页面空白点击 → 走两段式收回，不再直接关主导航。
      if (subOpen) { onBlankClick(); return; }
      root.classList.remove('open');
    });
    panelEl.addEventListener('click', function (e) { e.stopPropagation(); });
    // Esc：收回二级面板（锁定态的键盘出口）
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && subOpen) collapseSub(false);
    });
    // 视口尺寸变化：几何全部失效，瞬时收回（下次悬停按新视口重排）
    window.addEventListener('resize', function () { if (subOpen) collapseSub(true); });
  }

  // 主导航 260ms 延迟收起；二级展开锁定期间完全抑制，鼠标短暂离开不收起
  function scheduleMainClose() {
    if (subOpen) return;
    clearTimeout(closeTimer);
    closeTimer = setTimeout(function () { root.classList.remove('open'); }, 260);
  }

  function labelOf(el) {
    // 若显式指定了导航标签，优先使用
    const navLabel = el.dataset.navLabel;
    if (navLabel) return navLabel;
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

  // 重建内容指纹：标题元素身份 + 渲染标签 + 各二级项轮次锚点 id/标签。
  // 图表 hover（ECharts tooltip 的 append/innerHTML 更新、SVG 高亮插删节点）会
  // 命中 #detail 的 MutationObserver，但不会改变指纹 → 整体跳过重建：噪声不再
  // 撤掉悬停意图定时器，也不再瞬时收回已锁定的二级面板（原 bug 根因）。
  // 指纹含元素身份：整棵重渲染（即便文本完全相同）也会正确触发真实重建；
  // 点击回调闭包引用的元素身份与渲染标签都在指纹内，跳过重建绝不会用到过期引用。
  let lastHeads = null; // 上次重建时的标题元素引用数组（身份比较）
  let lastSig = '';     // 上次重建时的文本指纹

  function rebuild() {
    if (!detail) return;
    const heads = Array.from(detail.querySelectorAll(HEADING_SEL))
      .filter((el) => el.offsetParent !== null && (el.textContent || '').trim());
    const roundsList = heads.map(collectRounds);
    const sig = heads.map(function (el, i) {
      return labelOf(el) + '|' + roundsList[i].map(function (r) { return r.id + ':' + r.label; }).join(',');
    }).join(';;');
    const sameHeads = !!lastHeads && lastHeads.length === heads.length
      && heads.every(function (el, i) { return el === lastHeads[i]; });
    if (sameHeads && sig === lastSig) return; // 瞬态噪声：导航相关内容零变化
    lastHeads = heads;
    lastSig = sig;

    clearTimeout(subIntentTimer);
    // 列表即将重建：二级面板引用的锚点几何全部作废，瞬时收回（不播动画）
    if (subOpen) collapseSub(true);
    if (!heads.length) { root.classList.remove('show'); return; }
    root.classList.add('show');
    listEl.innerHTML = '';
    // 顶部锚
    addItem('▲ 顶部', () => smoothScrollTo(0));
    heads.forEach((el, i) => {
      const gotoHeading = () => {
        const y = el.getBoundingClientRect().top + window.pageYOffset - HEADER_OFFSET;
        smoothScrollTo(y);
      };
      // 通用探测：目标区块内存在轮次锚点 → 该项升级为带二级展开的导航项
      const rounds = roundsList[i];
      if (rounds.length) addSubItem(labelOf(el), gotoHeading, rounds);
      else addItem(labelOf(el), gotoHeading);
    });
  }

  function addItem(text, onClick) {
    const it = document.createElement('button');
    it.className = 'cyber-nav-item';
    it.type = 'button';
    it.innerHTML = '<span class="cyber-nav-dot"></span><span>' + text + '</span>';
    it.addEventListener('click', function (e) {
      e.stopPropagation();
      // 二级锁定中点击其他普通条目：连带收回二级（无二级时此行为零影响）
      if (subOpen) collapseSub(false);
      onClick();
      root.classList.remove('open');
    });
    listEl.appendChild(it);
  }

  // 带二级展开能力的导航项：悬停 SUB_OPEN_INTENT ms 激活锁定态二级面板；
  // 点击行为与普通项一致（滚动到区块标题并收起全部）。
  function addSubItem(text, onClick, rounds) {
    const it = document.createElement('button');
    it.className = 'cyber-nav-item cyber-nav-item--sub';
    it.type = 'button';
    it.innerHTML = '<span class="cyber-nav-dot"></span><span>' + text + '</span><span class="cyber-nav-subcue">◂</span>';
    it.addEventListener('click', function (e) {
      e.stopPropagation();
      clearTimeout(subIntentTimer);
      if (subOpen) collapseSub(false);
      onClick();
      root.classList.remove('open');
    });
    it.addEventListener('mouseenter', function () {
      clearTimeout(subIntentTimer);
      subIntentTimer = setTimeout(function () { openSub(it, rounds); }, SUB_OPEN_INTENT);
    });
    it.addEventListener('mouseleave', function () { clearTimeout(subIntentTimer); });
    listEl.appendChild(it);
  }

  // 通用探测：仅在标题所在的直接区块内查找轮次锚点（不向上冒泡，避免
  // 同页其他区块的锚点被误判进来）。查不到 → 空数组 → 不附加任何新行为。
  function collectRounds(el) {
    const scope = el.parentElement;
    if (!scope) return [];
    return Array.from(scope.querySelectorAll(ROUND_ID_SEL))
      .filter((b) => b.offsetParent !== null)
      .map((b) => {
        const no = b.querySelector(ROUND_NO_SEL);
        const label = ((no && no.textContent) || '').trim()
          || b.id.replace(/^dis-tl-round-/, 'R');
        return { id: b.id, label };
      });
  }

  // ── 二级面板：布局计算 ──────────────────────────────────
  // 每列最多 SUB_MAX_ROWS 行（视口越矮行数越少），N 大时自动向左加列；
  // 面板总高 = rows 行按钮 + 间距 + 内边距，必然落在视口垂直安全区内。
  function computeSubLayout(n) {
    const availH = window.innerHeight - SUB_TOP_MARGIN - SUB_BOTTOM_MARGIN;
    let rows = Math.floor((availH - SUB_PAD * 2 + SUB_GAP) / (SUB_BTN_H + SUB_GAP));
    rows = Math.max(SUB_MIN_ROWS, Math.min(SUB_MAX_ROWS, rows));
    rows = Math.min(rows, n);
    const cols = Math.ceil(n / rows);
    return {
      rows: rows,
      cols: cols,
      w: SUB_PAD * 2 + cols * SUB_BTN_W + (cols - 1) * SUB_GAP,
      h: SUB_PAD * 2 + rows * SUB_BTN_H + (rows - 1) * SUB_GAP,
    };
  }

  // 面板定位：右缘贴主导航面板左缘（留呼吸缝），垂直中心对齐触发项，
  // 随后上下 clamp 进视口安全区；返回爆发锚点（面板局部坐标）。
  function positionSubPanel(itemEl, lay) {
    const mpLeft = panelEl.getBoundingClientRect().left;
    const itRect = itemEl.getBoundingClientRect();
    const centerY = itRect.top + itRect.height / 2;
    const left = Math.max(SUB_MIN_LEFT, mpLeft - SUB_SIDE_GAP - lay.w);
    const top = Math.max(SUB_TOP_MARGIN,
      Math.min(centerY - lay.h / 2, window.innerHeight - SUB_BOTTOM_MARGIN - lay.h));
    subPanel.style.left = left + 'px';
    subPanel.style.top = top + 'px';
    return {
      // 锚点位于面板右缘外侧、朝向触发项的缝隙中
      ax: lay.w + Math.max(10, (mpLeft - left - lay.w) / 2 + 6),
      ay: Math.max(24, Math.min(centerY - top, lay.h - 24)),
    };
  }

  // 生成 R 按钮：列主序填充（第 0 列贴最右靠导航），奇数列自下而上蛇形迂回；
  // 每个按钮记录从锚点出发的位移/扭转/错峰延迟（CSS 变量驱动，纯 transform）。
  function buildSubButtons(rounds, lay, anchor) {
    const items = [];
    let rawMax = 0;
    rounds.forEach(function (r, i) {
      const col = Math.floor(i / lay.rows);
      const rawRow = i % lay.rows;
      const row = (col % 2 === 1) ? (lay.rows - 1 - rawRow) : rawRow; // 蛇形
      const x = lay.w - SUB_PAD - SUB_BTN_W - col * (SUB_BTN_W + SUB_GAP);
      const y = SUB_PAD + row * (SUB_BTN_H + SUB_GAP);
      const bx = x + SUB_BTN_W / 2, by = y + SUB_BTN_H / 2;
      // 入场起点：沿锚点向量缩回 72% + 缩放到 .22 + 按离锚纵向距离扇形扭转
      const dx = (anchor.ax - bx) * 0.72;
      const dy = (anchor.ay - by) * 0.72;
      const rot = Math.max(-26, Math.min(26, (by - anchor.ay) * 0.14));
      // 错峰：列波为主（向左逐列推进）、离锚行距为辅，叠加微序号形成涟漪
      const rowDist = Math.round(Math.abs(by - anchor.ay) / (SUB_BTN_H + SUB_GAP));
      const delay = col * 90 + rowDist * 34 + i * 3;
      rawMax = Math.max(rawMax, delay);

      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'cyber-sub-btn';
      b.textContent = r.label;
      b.style.left = x + 'px';
      b.style.top = y + 'px';
      b.style.setProperty('--sx', dx.toFixed(1) + 'px');
      b.style.setProperty('--sy', dy.toFixed(1) + 'px');
      b.style.setProperty('--sr', rot.toFixed(1) + 'deg');
      b.addEventListener('click', function (e) {
        e.stopPropagation();
        const t = document.getElementById(r.id);
        collapseSub(false);
        root.classList.remove('open');
        if (t) {
          smoothScrollTo(t.getBoundingClientRect().top + window.pageYOffset - HEADER_OFFSET);
        }
      });
      items.push({ b: b, delay: delay });
    });
    // 错峰归一化：小列表也把跨度拉满，保证整体展开时长 > 1s
    const scale = (rawMax > 0 && rawMax < SUB_MIN_SPREAD) ? SUB_MIN_SPREAD / rawMax : 1;
    subMaxDelay = rawMax === 0 ? 320 : Math.round(rawMax * scale);
    items.forEach(function (it) {
      // 单按钮（rawMax=0）也给足基准延迟，保证整体展开 > 1s
      const d = rawMax === 0 ? 320 : Math.round(it.delay * scale);
      it.b.dataset.od = d; // 收回时反向错峰的基准
      it.b.style.setProperty('--sd', d + 'ms');
      subPanel.appendChild(it.b);
    });
  }

  // ── 二级面板：展开（悬停激活 → 锁定态） ──────────────────
  // 锁定自本函数被调用的瞬间生效，覆盖整个错峰展开动画期：
  // 此后只有三条收回路径——两次空白点击（第一次仅警告）/ 点击 R 按钮选中 / Esc；
  // 任何鼠标移动类事件（mouseleave/mouseout/mouseover/pointerleave 等）一律不得
  // 收回或暂停展开（scheduleMainClose 在 subOpen=true 时整体短路）。
  function openSub(itemEl, rounds) {
    if (!rounds.length || !itemEl.isConnected) return;
    if (subOpen && subItemEl === itemEl) return;
    collapseSub(true); // 防御：清掉可能残留的旧面板（会短暂解锁，随即重新锁定）

    // ── 从此刻起进入完整锁定态（含展开动画进行期间）──
    subOpen = true;
    subItemEl = itemEl;
    subBlankArmed = false;
    // 清理一切可能在锁定期内误伤的过期定时器：
    clearTimeout(closeTimer);      // 进入锁定前已排期的主导航 260ms 收起
    clearTimeout(subIntentTimer);  // 已完成使命的悬停意图计时（防锁死后旧定时器再触发）
    clearTimeout(subRemoveTimer);  // 旧面板移除计时（其回调内的补收起判定以 !subOpen 为闸）
    root.classList.add('open'); // 锁定期间主导航保持展开

    const lay = computeSubLayout(rounds.length);
    subPanel = document.createElement('div');
    subPanel.className = 'cyber-sub-panel';
    subPanel.style.width = lay.w + 'px';
    subPanel.style.height = lay.h + 'px';
    // 面板上的点击不冒泡到 document（否则会被误计为空白点击）
    subPanel.addEventListener('click', function (e) { e.stopPropagation(); });
    subPanel.addEventListener('mouseenter', disarmBlank);

    const anchor = positionSubPanel(itemEl, lay);
    buildSubButtons(rounds, lay, anchor);

    document.body.appendChild(subPanel);
    itemEl.classList.add('sub-active');
    // 双 rAF：确保初始 transform/opacity 先应用，再加 open 触发从锚点的爆发过渡
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        if (subPanel) subPanel.classList.add('open');
      });
    });
  }

  // ── 二级面板：收回（错峰涌回锚点，动画结束才移除 DOM） ──
  function collapseSub(instant) {
    clearTimeout(subIntentTimer);
    if (!subPanel) { subOpen = false; return; }
    const p = subPanel;
    subPanel = null;
    subOpen = false;
    subBlankArmed = false;
    clearTimeout(subRemoveTimer);
    if (subItemEl) { subItemEl.classList.remove('sub-active'); subItemEl = null; }
    if (instant) { p.remove(); return; }
    // 反向错峰：展开越晚的按钮越早收回，整体涌回锚点。
    // 只内联覆盖 delay/duration，动画属性仍是纯 transform/opacity。
    Array.prototype.forEach.call(p.querySelectorAll('.cyber-sub-btn'), function (b) {
      const od = +b.dataset.od || 0;
      b.style.transitionDelay = Math.round((subMaxDelay - od) * 0.5) + 'ms';
      b.style.transitionDuration = SUB_CLOSE_DUR + 'ms, ' + Math.round(SUB_CLOSE_DUR * 0.7) + 'ms';
    });
    // 面板自身的淡出延迟到按钮收回的最后 300ms 才开始——否则面板框体会
    // 在按钮错峰涌回途中提前消失，破坏收回动画的完整性。
    const totalMs = Math.round(subMaxDelay * 0.5) + SUB_CLOSE_DUR;
    p.style.transitionDelay = Math.max(0, totalMs - 300) + 'ms';
    p.classList.remove('open');
    subRemoveTimer = setTimeout(function () {
      p.remove();
      // 收回完成后若鼠标已不在导航上（如 Esc 触发），补一次延迟收起判定
      if (root && !subOpen && root.classList.contains('open') && !root.matches(':hover')) {
        scheduleMainClose();
      }
    }, totalMs + 80);
  }

  // ── 空白点击两段式：第一次仅边框闪烁/抖动提示，第二次才收回 ──
  function onBlankClick() {
    if (!subOpen) return;
    if (!subBlankArmed) {
      subBlankArmed = true;
      if (subPanel) {
        subPanel.classList.remove('warn');
        void subPanel.offsetWidth; // 强制 reflow，使连续提示能重启动画
        subPanel.classList.add('warn');
      }
      return;
    }
    collapseSub(false);
    root.classList.remove('open');
  }

  function disarmBlank() { subBlankArmed = false; }

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
