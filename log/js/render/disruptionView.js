window.WF = window.WF || {};

WF.disruptionView = (function () {
  const U = WF.utils;

  // ── ECharts 实例管理（仿仲裁分页：重渲染前 dispose 旧实例，防泄漏） ──
  const activeCharts = [];
  let currentResizeHandler = null;
  function clearCharts() {
    const DC = WF.disruptionCharts;
    for (const c of activeCharts) {
      if (DC) DC.dispose(c);
      else if (c && typeof c.dispose === 'function') { try { c.dispose(); } catch (e) { /* 忽略 */ } }
    }
    activeCharts.length = 0;
    if (currentResizeHandler) {
      window.removeEventListener('resize', currentResizeHandler);
      currentResizeHandler = null;
    }
  }
  function pushChart(c) { if (c) activeCharts.push(c); }

  // 挂载一张 ECharts 全宽图：echarts 不可用或工厂返回 null 时跳过整个区块
  function _mountChart(container, title, sub, bodyCls, factory) {
    const DC = WF.disruptionCharts;
    if (!DC || !DC.isAvailable()) return;
    const box = U.el('div', 'chart-box dis-tl-wrap');
    box.appendChild(U.el('div', 'dis-tl-title', title));
    if (sub) box.appendChild(U.el('div', 'dis-tl-sub', sub));
    const body = U.el('div', 'dis-chart-body' + (bodyCls ? ' ' + bodyCls : ''));
    box.appendChild(body);
    container.appendChild(box); // 先挂载，确保 echarts.init 时容器有宽度
    const chart = factory(body);
    if (chart) pushChart(chart);
    else container.removeChild(box);
  }

  function summary(rec) {
    const avgRound = rec.totalDuration / rec.roundCount;
    return {
      title: `中断 ${rec.roundCount} 轮${rec.name ? ' · ' + rec.name : ''}`,
      sub: `${U.fmtDurationLong(rec.totalDuration)} ｜ 平均每轮 ${U.fmtDuration(avgRound)}`,
    };
  }

  function render(container, rec) {
    clearCharts(); // dispose 必须在 innerHTML 清空之前，防止 ECharts 实例泄漏
    container.innerHTML = '';

    // ── 总览统计行 ────────────────────────────────────────────
    const avgRound = rec.totalDuration / rec.roundCount;
    const hero = U.el('div', 'hero-row');
    hero.appendChild(_st('任务总时长', U.fmtDurationLong(rec.totalDuration), 'big'));
    hero.appendChild(_st('完成轮次',   String(rec.roundCount), 'accent'));
    hero.appendChild(_st('平均每轮时长', U.fmtDuration(avgRound), ''));
    if (rec.totalConduits > 0) {
      const rate = (rec.conduitRate * 100).toFixed(1) + '%';
      hero.appendChild(_st('导管成功率', rate, ''));
    }
    // 前置 Roll 图次数：载入中断任务但未进入第 3 轮就退出的次数，仅 >0 时显示
    if (rec.preRollCount > 0) {
      const rollStat = _st('前置 Roll 图次数', String(rec.preRollCount), 'has-tip');
      rollStat.title = '本次练习前，载入中断任务但未进入第 3 轮就退出的 Roll 图次数';
      hero.appendChild(rollStat);
    }
    if (rec.name) hero.appendChild(_st('任务地图', rec.name, ''));
    container.appendChild(hero);

    WF.squadMixin.renderSquad(container, rec);

    // ── 每轮耗时概览（ECharts 全宽柱状图） ────────────────────
    _mountChart(container, '每轮耗时概览',
      '青蓝色为本轮导管全部守住，红色为存在失守的情况',
      'dis-dur-body', (body) => WF.disruptionCharts.roundDurationChart(body, rec));

    // ── 击杀数量走势图（ECharts 全局阶梯累计折线） ────────────
    _mountChart(container, '击杀数量走势图', null,
      'dis-kill-body', (body) => WF.disruptionCharts.killTrendChart(body, rec));

    // ── 场上敌量曲线（liveSamples 缺失/空则跳过本区块，保持原语义） ──
    _mountChart(container, '场上敌量曲线',
      '场上同时存在的敌人数，取自房主日志生成采样；高亮段为每轮开始后的前 10 秒',
      'dis-live-body', (body) => WF.disruptionCharts.liveCountChart(body, rec));

    // ── 每轮前10秒击杀数（ECharts 青色渐变柱） ────────────────
    _mountChart(container, '每轮前10秒击杀数',
      '每轮战斗开始10秒内的击杀总数；数值高意味着起手清场速度快',
      'dis-open-body', (body) => WF.disruptionCharts.openingKillsChart(body, rec));

    // ── 插满耗时·折线图（紧邻每轮前10秒击杀数下方，同轴逐轮对齐） ──
    _mountChart(container, '插满耗时·折线图', null,
      'dis-ifull-body', (body) => WF.disruptionCharts.insertFullChart(body, rec));

    // ── 轮次详情表格 ─────────────────────────────────────────
    const tblSection = U.el('div', 'chart-box dis-tl-wrap');
    tblSection.appendChild(U.el('div', 'dis-tl-title', '中断任务进程总览'));
    tblSection.appendChild(U.el('div', 'dis-tl-sub', '逐轮明细：本轮/累计耗时、导管守护结果与击杀/生成数'));
    container.appendChild(tblSection);

    const tbl = U.el('table', 'round-table');
    tbl.innerHTML = '<thead><tr><th>轮次</th><th>本轮耗时</th><th>累计耗时</th><th>导管</th><th>击杀 / 生成</th></tr></thead>';

    const tbody = U.el('tbody');
    rec.rounds.forEach(r => {
      const tr = U.el('tr', 'dis-row-link');
      // 点击行平滑滚动到「逐轮导管时间轴」中对应轮次的区块
      tr.addEventListener('click', () => {
        const target = document.getElementById('dis-tl-round-' + r.index);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      tr.appendChild(U.el('td', 'td-idx', String(r.index)));
      tr.appendChild(U.el('td', 'td-mono', U.fmtDuration(r.duration)));
      tr.appendChild(U.el('td', 'td-mono', U.fmtDurationLong(r.cumulative)));

      const cd = U.el('td', 'td-conduits');
      if (r.conduits.length === 0) {
        cd.textContent = '—';
      } else {
        r.conduits.forEach(c => {
          const label = c.success === true ? '✓' : c.success === false ? '✗' : '?';
          const cls   = c.success === true ? 'cd ok' : c.success === false ? 'cd fail' : 'cd';
          const sp    = U.el('span', cls, label);
          let tip = _conduitEffectLabel(c);
          if (c.insertRelT != null) tip += (tip ? '\n' : '') + `插入 +${U.fmtDuration(c.insertRelT)}`;
          if (c.doneRelT   != null) tip += (tip ? '\n' : '') + `${c.success ? '守卫成功' : '守卫失败'} +${U.fmtDuration(c.doneRelT)}`;
          if (tip) sp.title = tip;
          if (_isBadDebuff(c)) sp.style.outline = '1.5px solid #ffd700';
          cd.appendChild(sp);
        });
      }
      tr.appendChild(cd);

      const ksCell = U.el('td', 'td-mono');
      const spawnStr = r.spawned != null && r.spawned > 0 ? String(r.spawned) : '—';
      ksCell.textContent = `${r.kills} / ${spawnStr}`;
      if (r.spawned > 0 && r.kills < r.spawned) ksCell.style.color = 'var(--c-text2)';
      tr.appendChild(ksCell);

      tbody.appendChild(tr);
    });
    tbl.appendChild(tbody);

    const tblWrap = U.el('div', 'table-wrap');
    tblWrap.appendChild(tbl);
    tblSection.appendChild(tblWrap);

    const ksFoot = U.el('div', 'gen-table-foot has-tip',
      '击杀/生成均为房主日志的间接推算值，非游戏内确切数字（悬停查看详细逻辑）');
    ksFoot.title = 'EE.log 不会记录"某个敌人被谁击杀"这类具体事件，这里的击杀数是这样推算出来的：'
      + '每次读到新的敌人生成记录时，比较"上一次生成后场上活跃监控数"和"这一次生成前场上活跃监控数"——'
      + '如果后者更少，说明这段时间里有敌人在没有新增生成的情况下减少了，差值就计为击杀。'
      + '这不是逐个击杀事件的直接计数，只是活跃数量的净变化，宠物/召唤物/自己的无人机等已排除。'
      + '"生成"数取自房主日志里敌人生成事件，理论上应与游戏内一致，但如果日志不是从任务最开始记录的，数字会偏低。'
      + '两个数字都限于轮次战斗期间（ModeState=3→4），不含休整/传送阶段。';
    tblSection.appendChild(ksFoot);

    WF.chatMixin.renderChatLog(container, rec);

    // ── 逐轮导管时间轴（全页最下方，聊天记录之后） ───────────
    container.appendChild(_buildConduitTimeline(rec));

    // 窗口尺寸变化时重绘全部 ECharts（仿仲裁分页）
    currentResizeHandler = () => { for (const c of activeCharts) if (c && c.resize) c.resize(); };
    window.addEventListener('resize', currentResizeHandler);
  }

  /* ════════════════════════════════════════════════════════════
     逐轮导管时间轴：每轮一个区块，泳道按 insertRelT 升序排列，
     冰蓝 = 寻钥段，青绿/红 = 守管段，黄框 = 危险 Buff 导管；
     Ctrl+滚轮横向缩放（重渲染 SVG），点击轮头折叠/展开。

     全宽化：1× 基准宽度 = 容器（.dis-tl2-scroll/.dis-tl2-inner）实测
     clientWidth，SVG 始终填满容器；缩放范围 [容器宽度, 6000]；
     ResizeObserver 监听容器，宽度变化时保持当前缩放系数按新基准重渲染。
     ════════════════════════════════════════════════════════════ */
  const TL2_BASE_W = 940;   // 容器宽度不可测（尚未挂载/隐藏）时的 1× 兜底基准宽度
  const TL2_MAX_W  = 6000;  // Ctrl+滚轮放大上限
  const TL2_STEP   = 1.25;  // Ctrl+滚轮缩放步进

  function _buildConduitTimeline(rec) {
    const section = U.el('div', 'chart-box dis-tl-wrap');
    section.appendChild(U.el('div', 'dis-tl-title', '逐轮导管时间轴'));
    section.appendChild(U.el('div', 'dis-tl-sub',
      '每轮一个区块，四条泳道按插入先后排列，共用同一秒级时间轴；冰蓝为寻钥段、青绿/红为守管段，黄框为危险 Buff 导管；泳道按 Tile 分组，以小分割线隔开。悬停查看精确数据，Ctrl+滚轮缩放，点击轮头折叠。'));

    // 泳道自建浮层 tooltip（复用 chart-bar-tooltip 定位模式，支持多行）
    const tip = U.el('div', 'chart-bar-tooltip dis-tl2-tip');
    section.appendChild(tip);

    const scroll = U.el('div', 'dis-tl2-scroll');
    const inner  = U.el('div', 'dis-tl2-inner');
    scroll.appendChild(inner);
    section.appendChild(scroll);

    const bodies = []; // { r, host }：有导管数据的轮次泳道区
    const heads = [];  // 全部轮头：sticky 吸左 + JS 同步可视宽度，保证缩放/横滚时完整可见

    rec.rounds.forEach((r, i) => {
      // 轮与轮之间的霓虹分隔带（明显强于泳道间小分割线）
      if (i > 0) inner.appendChild(U.el('div', 'dis-tl2-sep'));

      const conduits = r.conduits || [];
      const hasData  = conduits.length > 0;
      const block    = U.el('div', 'dis-tl2-round' + (i % 2 === 1 ? ' alt' : ''));
      block.id = 'dis-tl-round-' + r.index;

      // ── 轮头：R序号 + 本轮耗时 + 各导管✓✗ + 危险Buff中文名 ──
      const head  = U.el('div', 'dis-tl2-head' + (hasData ? ' has-lanes' : ''));
      const arrow = U.el('span', 'dis-tl2-arrow', hasData ? '▾' : '');
      if (!hasData) arrow.style.visibility = 'hidden';
      head.appendChild(arrow);
      head.appendChild(U.el('span', 'dis-tl2-rno', 'R' + r.index));
      head.appendChild(U.el('span', 'dis-tl2-dur', U.fmtDuration(r.duration)));

      if (hasData) {
        const sorted = _sortConduits(conduits);
        const cds = U.el('span', 'dis-tl2-cds');
        sorted.forEach(c => {
          const label = c.success === true ? '✓' : c.success === false ? '✗' : '?';
          const cls   = c.success === true ? 'cd ok' : c.success === false ? 'cd fail' : 'cd';
          const sp    = U.el('span', cls, label);
          sp.title = _laneTip(c);
          if (_isBadDebuff(c)) sp.style.outline = '1.5px solid #ffd700';
          cds.appendChild(sp);
        });
        head.appendChild(cds);

        // 危险 Buff 中文名（去重，黄色标注继承旧图例体系）
        const badNames = [];
        sorted.forEach(c => {
          if (_isBadDebuff(c)) {
            const n = _effectName(c);
            if (!badNames.includes(n)) badNames.push(n);
          }
        });
        if (badNames.length) {
          const bad = U.el('span', 'dis-tl2-bad');
          bad.appendChild(U.el('span', 'dis-tl2-bad-dot', '●'));
          bad.appendChild(document.createTextNode(badNames.join('、')));
          head.appendChild(bad);
        }
      }
      block.appendChild(head);
      heads.push(head);

      // ── 泳道区（整段无导管数据的轮跳过，只画轮头） ──
      if (hasData) {
        const body = U.el('div', 'dis-tl2-body');
        const host = U.el('div', 'dis-tl2-svg');
        body.appendChild(host);
        block.appendChild(body);
        bodies.push({ r, host });

        // 点击轮头折叠/展开该轮泳道（默认全展开）
        head.addEventListener('click', () => {
          const collapsed = block.classList.toggle('collapsed');
          arrow.textContent = collapsed ? '▸' : '▾';
        });
      }
      inner.appendChild(block);
    });

    // 1× 基准宽度 = 容器实测宽度（inner 未撑开时其 clientWidth 即容器可视宽度）
    function measureBase() {
      return inner.clientWidth || scroll.clientWidth || 0;
    }
    let baseW = measureBase() || TL2_BASE_W;
    let zoomW = baseW;

    // 轮头宽度跟随滚动容器可视宽度：轮头整体 sticky 吸左且宽度 = clientWidth - 轮区块横向留白，
    // 无论 Ctrl+滚轮放到多宽、横向滚动到任何位置（含最右端），R序号/耗时/✓✗/Buff名都完整停留在可视区内
    function syncHeads(w) {
      w = w || scroll.clientWidth || 0;
      if (!w) return;
      // 轮区块 padding+border 会吃掉 sticky 行程末端的可视宽度，扣除后才能保证滚到最右端时轮头不被裁切
      const chrome = Math.max(0, (scroll.scrollWidth || 0) - zoomW);
      const px = Math.max(240, w - chrome) + 'px';
      for (let i = 0; i < heads.length; i++) heads[i].style.width = px;
    }

    // 按当前缩放宽度重渲染全部轮次 SVG（参照全屏图的 rebuild 模式）
    function rebuildAll() {
      bodies.forEach(({ r, host }) => {
        const { svgStr, td } = _buildRoundTlSvgStr(r, zoomW);
        host.innerHTML = svgStr;
        _addRoundTlInteractivity(host.querySelector('svg'), td, tip);
      });
      syncHeads();
    }
    rebuildAll();

    // 容器尺寸变化：保持当前缩放系数，按新基准宽度重渲染（全宽自适应）
    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(() => {
        const w = scroll.clientWidth || inner.clientWidth || 0;
        if (!w) return;
        syncHeads(w); // 宽度未变时轮头宽度也要保持同步（初始挂载/临界变化）
        if (Math.abs(w - baseW) < 2) return;
        const factor = zoomW / baseW;
        baseW = w;
        zoomW = Math.max(baseW, Math.min(TL2_MAX_W, Math.round(baseW * factor)));
        rebuildAll();
      });
      ro.observe(scroll);
    }

    // Ctrl+滚轮横向缩放：范围 [容器宽度, 6000]，放大后容器横向滚动
    scroll.addEventListener('wheel', e => {
      if (!e.ctrlKey) return;
      e.preventDefault();
      zoomW = Math.max(baseW, Math.min(TL2_MAX_W, Math.round(zoomW * (e.deltaY < 0 ? TL2_STEP : 1 / TL2_STEP))));
      rebuildAll();
    }, { passive: false });

    return section;
  }

  // 泳道排序：insertRelT 升序（缺失者排后，按 doneRelT / 导管号兜底）
  function _sortConduits(conduits) {
    return [...conduits].sort((a, b) => {
      const ai = a.insertRelT != null ? a.insertRelT : Infinity;
      const bi = b.insertRelT != null ? b.insertRelT : Infinity;
      if (ai !== bi) return ai - bi;
      const ad = a.doneRelT != null ? a.doneRelT : Infinity;
      const bd = b.doneRelT != null ? b.doneRelT : Infinity;
      if (ad !== bd) return ad - bd;
      return (a.artNum || 0) - (b.artNum || 0);
    });
  }

  function _fmtSeg(v) { return v != null ? v.toFixed(1) + 's' : '—'; }

  // 泳道 tooltip 内容：首行固定「Tile：N」，其后依次为导管/寻钥段/守管段/插入/完成
  function _laneTip(c) {
    const lines = [];
    lines.push('Tile：' + (c.tile != null ? c.tile : '—'));
    lines.push('导管 ' + (c.artNum != null ? c.artNum : '?'));
    lines.push('Buff：' + (c.effectKind ? _effectName(c) : '—'));
    lines.push('寻钥段：' + _fmtSeg(c.insertRelT));
    lines.push('守管段：' + (c.insertRelT != null && c.doneRelT != null ? _fmtSeg(c.doneRelT - c.insertRelT) : '—'));
    lines.push('插入：' + (c.insertRelT != null ? '第 ' + c.insertRelT.toFixed(1) + 's' : '—'));
    lines.push('完成：' + (c.doneRelT   != null ? '第 ' + c.doneRelT.toFixed(1)   + 's' : '—'));
    return lines.join('\n');
  }

  // 单轮泳道 SVG（W 可变，供 Ctrl+滚轮缩放 / 容器尺寸变化重渲染）
  function _buildRoundTlSvgStr(r, W) {
    const conduits = _sortConduits(r.conduits || []);
    const n = conduits.length;
    const laneH = 30, laneGap = 10;          // 泳道高/间距（显微镜式大字号分析）
    const ML = 160, MR = 30, MT = 22;        // 左标签区/右边距（防刻度文字裁切）/顶部留白
    const dur = Math.max(r.combatDuration || 0, 1);
    const plotW = W - ML - MR;
    const lanesH = n * laneH + (n - 1) * laneGap;
    const axisY  = MT + lanesH;
    const H      = axisY + 30;
    // 刻度标签避免过密：轮 >60s 自动切 10s 步长
    const tickStep = dur > 60 ? 10 : 5;
    const tx = t => ML + Math.min(plotW, Math.max(0, (t / dur) * plotW));

    let s = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" style="display:block;font-family:inherit">`;
    s += `<defs>
      <linearGradient id="dis-tl2-key" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#5bc8ff" stop-opacity="0.07"/>
        <stop offset="45%" stop-color="#5bc8ff" stop-opacity="0.26"/>
        <stop offset="100%" stop-color="#5bc8ff" stop-opacity="0.52"/>
      </linearGradient>
      <linearGradient id="dis-tl2-ok" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#0d6b40" stop-opacity="0.88"/>
        <stop offset="55%" stop-color="#1a8a52" stop-opacity="0.94"/>
        <stop offset="100%" stop-color="#41ff8e" stop-opacity="0.98"/>
      </linearGradient>
      <linearGradient id="dis-tl2-fail" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#7a1f2b" stop-opacity="0.88"/>
        <stop offset="55%" stop-color="#b03a45" stop-opacity="0.94"/>
        <stop offset="100%" stop-color="#ff5f6b" stop-opacity="0.98"/>
      </linearGradient>
      <linearGradient id="dis-tl2-unk" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#8a8f9e" stop-opacity="0.10"/>
        <stop offset="100%" stop-color="#8a8f9e" stop-opacity="0.32"/>
      </linearGradient>
    </defs>`;

    // X 轴竖网格线（贯穿全部泳道）与秒级刻度
    for (let t = 0; t <= dur + 0.001; t += tickStep) {
      const tt = Math.min(t, dur);
      const x  = tx(tt).toFixed(1);
      s += `<line x1="${x}" y1="${MT}" x2="${x}" y2="${axisY}" stroke="rgba(255,255,255,0.07)" stroke-width="1"/>`;
      s += `<text x="${x}" y="${axisY + 19}" fill="var(--c-text2)" font-size="12.5" text-anchor="middle">${Math.round(tt)}s</text>`;
      if (tt >= dur) break;
    }
    s += `<line x1="${ML}" y1="${axisY}" x2="${(ML + plotW).toFixed(1)}" y2="${axisY}" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>`;

    conduits.forEach((c, i) => {
      const y   = MT + i * (laneH + laneGap);
      const bad = _isBadDebuff(c);
      const tip = U.escapeHtml(_laneTip(c)).replace(/\n/g, '&#10;');

      // 相邻泳道 tile 不同时，在两者之间画一条细小虚线分割（明显弱于轮间分隔带）
      if (i > 0 && conduits[i - 1].tile !== c.tile) {
        const dy = (y - laneGap / 2).toFixed(1);
        s += `<line x1="${ML}" y1="${dy}" x2="${(ML + plotW).toFixed(1)}" y2="${dy}" stroke="rgba(255,255,255,0.12)" stroke-width="1" stroke-dasharray="2,4"/>`;
      }

      s += `<g class="dis-tl2-lane" data-tip="${tip}">`;

      // 泳道底轨：危险 Buff 整条加 #ffd700 外发光框
      s += `<rect x="${ML}" y="${y}" width="${plotW}" height="${laneH}" rx="3" fill="rgba(255,255,255,0.03)"`
        + ` stroke="${bad ? '#ffd700' : 'rgba(95,208,232,0.12)'}" stroke-width="${bad ? 1.2 : 1}"`
        + (bad ? ' style="filter:drop-shadow(0 0 5px rgba(255,215,0,0.45))"' : '') + '/>';

      // 泳道左标签：导管N + Buff 中文名（危险 Buff 黄字）
      const artLbl = '导管' + (c.artNum != null ? c.artNum : '?');
      const effLbl = U.escapeHtml(c.effectKind ? _effectName(c) : '—');
      s += `<text x="${ML - 8}" y="${y + 13}" fill="#c9d4e8" font-size="13" text-anchor="end">${artLbl}</text>`;
      s += `<text x="${ML - 8}" y="${y + 26}" fill="${bad ? '#ffd700' : 'var(--c-text2)'}" font-size="13" text-anchor="end"${bad ? ' style="text-shadow:0 0 6px rgba(255,215,0,0.4)"' : ''}>${effLbl}</text>`;

      const barY = y + 4, barH = laneH - 8;
      if (c.insertRelT != null) {
        const xi = tx(c.insertRelT);
        // 寻钥段：[0 → insertRelT] 冰蓝半透明渐变条（霓虹辉光由 CSS 类承载）
        if (xi > ML + 0.5) {
          s += `<rect class="dis-tl2-seg-key" x="${ML}" y="${barY}" width="${(xi - ML).toFixed(1)}" height="${barH}" rx="2" fill="url(#dis-tl2-key)"/>`;
        }
        // 守管段：[insertRelT → doneRelT] 青绿渐变（失败则红色；缺 doneRelT 画到轮末的灰色未知段）
        const guardEnd = c.doneRelT != null ? c.doneRelT : dur;
        const xd = tx(guardEnd);
        if (xd > xi + 0.5) {
          const cls  = c.doneRelT == null ? 'dis-tl2-seg-unk' : (c.success === false ? 'dis-tl2-seg-fail' : 'dis-tl2-seg-ok');
          const fill = c.doneRelT == null ? 'url(#dis-tl2-unk)' : (c.success === false ? 'url(#dis-tl2-fail)' : 'url(#dis-tl2-ok)');
          s += `<rect class="${cls}" x="${xi.toFixed(1)}" y="${barY}" width="${(xd - xi).toFixed(1)}" height="${barH}" rx="2" fill="${fill}"/>`;
        }
        // 段界处 ▼ 插入标记（带发光，同比放大）
        s += `<polygon points="${xi.toFixed(1)},${(barY + 1.5).toFixed(1)} ${(xi - 6.5).toFixed(1)},${(barY - 7).toFixed(1)} ${(xi + 6.5).toFixed(1)},${(barY - 7).toFixed(1)}" fill="#5bc8ff" opacity="0.9" style="filter:drop-shadow(0 0 3px rgba(91,200,255,0.7))"/>`;
      } else if (c.doneRelT != null) {
        // 缺 insertRelT：该泳道只从 doneRelT 画灰色未知段
        const xd = tx(c.doneRelT);
        const xe = tx(dur);
        if (xe > xd + 0.5) {
          s += `<rect class="dis-tl2-seg-unk" x="${xd.toFixed(1)}" y="${barY}" width="${(xe - xd).toFixed(1)}" height="${barH}" rx="2" fill="url(#dis-tl2-unk)"/>`;
        }
      }

      s += '</g>';
    });

    s += `</svg>`;
    const td = { ML, MT, plotW, lanesH, axisY, dur, W };
    return { svgStr: s, td };
  }

  // 单轮泳道交互：贯穿全部泳道的竖直十字线（发光） + 「第 X.Xs」标注 + 泳道自建浮层
  function _addRoundTlInteractivity(svgEl, td, tipEl) {
    if (!svgEl) return;
    const ns = 'http://www.w3.org/2000/svg';
    svgEl.style.cursor = 'crosshair';

    // ── 十字线组 ──
    const g = document.createElementNS(ns, 'g');
    g.style.pointerEvents = 'none'; g.style.display = 'none';

    const vline = document.createElementNS(ns, 'line');
    vline.setAttribute('stroke', 'rgba(0,240,255,0.55)');
    vline.setAttribute('stroke-width', '1');
    vline.setAttribute('stroke-dasharray', '4,3');
    vline.setAttribute('y1', String(td.MT - 4));
    vline.setAttribute('y2', String(td.axisY));
    vline.style.filter = 'drop-shadow(0 0 4px rgba(0,240,255,0.65))';
    g.appendChild(vline);

    const txt = document.createElementNS(ns, 'text');
    txt.setAttribute('fill', 'rgba(255,255,255,0.92)');
    txt.setAttribute('font-size', '12');
    txt.setAttribute('font-family', 'monospace');
    txt.setAttribute('y', String(td.MT - 7));
    txt.style.paintOrder = 'stroke';
    txt.style.stroke = 'rgba(4,5,12,0.85)';
    txt.style.strokeWidth = '3';
    g.appendChild(txt);

    svgEl.appendChild(g);

    // 十字线监听挂在 SVG 根上（事件冒泡），不遮挡泳道 <g>，泳道 tooltip 不受影响
    svgEl.addEventListener('mousemove', e => {
      const rect = svgEl.getBoundingClientRect();
      const svgW = (svgEl.viewBox && svgEl.viewBox.baseVal.width) || td.W;
      const scaleX = svgW / rect.width;
      const svgX = (e.clientX - rect.left) * scaleX;
      if (svgX < td.ML || svgX > td.ML + td.plotW) { g.style.display = 'none'; return; }
      const relT = Math.max(0, Math.min(td.dur, ((svgX - td.ML) / td.plotW) * td.dur));
      const lx   = td.ML + (relT / td.dur) * td.plotW;
      vline.setAttribute('x1', String(lx));
      vline.setAttribute('x2', String(lx));
      const isRight = lx > svgW * 0.8;
      txt.setAttribute('text-anchor', isRight ? 'end' : 'start');
      txt.setAttribute('x', String(isRight ? lx - 6 : lx + 6));
      txt.textContent = `第 ${relT.toFixed(1)}s`;
      g.style.display = '';
    });
    svgEl.addEventListener('mouseleave', () => { g.style.display = 'none'; });

    // ── 泳道自建浮层（多行 tooltip，首行固定「Tile：N」） ──
    if (tipEl) {
      svgEl.querySelectorAll('.dis-tl2-lane').forEach(lane => {
        lane.addEventListener('mouseenter', () => {
          tipEl.textContent = lane.getAttribute('data-tip') || '';
          tipEl.classList.add('visible');
        });
        lane.addEventListener('mousemove', e => {
          let lx = e.clientX + 14;
          let ly = e.clientY + 14;
          // 靠近右/下边缘时反向翻出，避免溢出屏幕
          if (lx + tipEl.offsetWidth > window.innerWidth - 8) lx = e.clientX - tipEl.offsetWidth - 10;
          if (ly + tipEl.offsetHeight > window.innerHeight - 8) ly = e.clientY - tipEl.offsetHeight - 10;
          tipEl.style.left = lx + 'px';
          tipEl.style.top  = ly + 'px';
        });
        lane.addEventListener('mouseleave', () => { tipEl.classList.remove('visible'); });
      });
    }
  }

  // ── Conduit effect helpers ────────────────────────────────
  // 危险减益 ID（黄色高亮）：能量值消耗=3，更强大的密钥搬运者=6，敌方毒素武器=15，群居狩猎野兽=23
  const BAD_IDS = new Set([3, 6, 15, 23]);

  // 减益 ID → 中文名（已用实测 log 全面校准）
  const DEBUFF_NAMES = {
    1:  '护盾消耗',
    2:  '生命值消耗',
    3:  '能量值消耗',
    4:  '敌人伤害加成',
    5:  '待翻译',
    6:  '更强大的密钥搬运者',
    7:  '待翻译',
    8:  '敌人技能抗性',
    9:  '敌人速度加成',
    10: '虚能导管',
    11: '待翻译',
    12: '通电的导管',
    13: '敌方火焰武器',
    14: '敌方冰冻武器',
    15: '敌方毒素武器',
    16: '敌方电击武器',
    17: '磁场异常',
    18: '待翻译',
    19: '待翻译',
    20: '待翻译',
    21: '敌人护甲增强',
    22: '待翻译',
    23: '群居狩猎野兽',
    24: '待翻译',
    25: '雷区',
    26: '待翻译',
    27: '待翻译',
    28: '灵刹涌入',
  };

  // 增益 ID → 中文名（已用实测 log 全面校准）
  const BUFF_NAMES = {
    31: '补给导管',
    32: 'Tenno速度加成',
    33: '50%经验值加成',
    34: '50%资源加成',
    35: '50%现金加成',
    36: 'Tenno武器吸血加成',
    37: 'Tenno射速加成',
    38: '导管卫士',
  };

  function _isBadDebuff(c) {
    return c.effectKind === 'debuff' && c.effectId != null && BAD_IDS.has(c.effectId);
  }

  function _effectName(c) {
    if (c.effectId == null) return '—';
    const id = c.effectId;
    const name = c.effectKind === 'buff' ? (BUFF_NAMES[id] || null) : (DEBUFF_NAMES[id] || null);
    if (name === null || name === '待翻译') return `[${id}] 待翻译`;
    return name;
  }

  function _conduitEffectLabel(c) {
    if (c.effectKind == null) return '';
    return `Buff效果: ${_effectName(c)}`;
  }

  function _st(label, value, cls) {
    const d = U.el('div', 'stat ' + (cls || ''));
    d.appendChild(U.el('div', 'stat-value', value));
    d.appendChild(U.el('div', 'stat-label', label));
    return d;
  }

  return { render, summary };
})();
