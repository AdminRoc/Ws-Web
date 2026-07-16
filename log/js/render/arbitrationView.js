/* 仲裁详情视图 v2.0
 * 布局（自上而下，信息层层递进）：
 *   任务标题 → 综合评分徽章+四维效率 → 时间元信息 → 核心指标网格
 *   → 任务时间轴总览 → 异常诊断 → 每轮明细（可展开）
 *   → 分布图区（8 张图：原有横向条形图 + ECharts 时序/散点图）
 *   → 交叉分析 → 生息计算 → 评分说明（含节奏稳定性详细解释） → 对话记录
 *
 * 赛博朋克辉光风格：深色玻璃态卡片、霓虹边框 hover 辉光、青色/洋红/琥珀高亮。
 * 所有图表通过 WF.arbitrationCharts 工厂生成，失败时优雅降级。
 */
window.WF = window.WF || {};

WF.arbitrationView = (function () {
  const U = WF.utils;
  const C = WF.arbitrationCharts;

  // 用于在容器切换时清理旧 ECharts 实例
  const activeCharts = [];
  let currentResizeHandler = null;
  function clearCharts() {
    for (const c of activeCharts) C.dispose(c);
    activeCharts.length = 0;
    if (currentResizeHandler) {
      window.removeEventListener('resize', currentResizeHandler);
      currentResizeHandler = null;
    }
  }
  function pushChart(c) { if (c) activeCharts.push(c); }

  function fmtHMS(sec) {
    if (sec == null || isNaN(sec)) return '-';
    sec = Math.max(0, Math.floor(sec));
    const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
    if (h > 0) return `${h}h ${m}m ${s}s`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  }
  function tierClass(score) {
    if (score >= 101) return 'grade-s';
    if (score >= 80)  return 'grade-a';
    if (score >= 70)  return 'grade-b';
    if (score >= 60)  return 'grade-c';
    return 'grade-d';
  }

  // ── 通用 tooltip 说明文案 ──
  const TOOLTIPS = {
    rhythm: '节奏稳定性衡量本局任务中敌人与无人机刷新节奏的平稳程度，由三个子指标加权合成：\n' +
            '1. 无人机密度稳定性（40%）：各轮次无人机密度（只/分钟）的波动越小得分越高。\n' +
            '2. 无人机批次间隔稳定性（35%）：相邻无人机批次之间的时间间隔越稳定得分越高。\n' +
            '3. 高压恢复稳定性（25%）：场上活跃敌人从 ≥10 的高压状态恢复到 <10 所需时间越短、越稳定得分越高。\n' +
            '100 表示节奏非常稳定；数据不足时以 50 分中性值计入。',
    spawnNote: 'EE.log 不会记录"某个敌人被谁击杀"这类具体事件，所以这里不展示确切击杀数。' +
               '"敌人生成"是房主日志里每次 OnAgentCreated 事件携带的 Spawned 字段峰值——这是游戏引擎自己上报的累计生成数。' +
               '"生成事件数"则是真实 OnAgentCreated 行数。两者差距大说明日志可能被裁切或采样稀疏。',
    activeEnemy: '"活跃敌人"指日志里 MonitoredTicking 字段代表的、当前正被游戏 AI 持续追踪行为逻辑的敌人数量——' +
                 '不是玩家肉眼在场景里能看到的全部单位，也不完全等于游戏内 UI 顶部显示的确切怪物计数，是引擎内部的一个采样值，用来大致反映"场上压力"，仅供参考。',
    timeline: '时间轴总览：青色面积 = 每分钟平均活跃敌人，绿色散点 = 每分钟无人机生成数量，红色虚线 = 轮次/波次结算。可拖动下方滑块缩放查看细节。',
    batchGap: '批次之间间隔：把连续 0.3 秒内生成的无人机视为同一批次，计算各批次首只无人机之间的时间间隔。间隔越稳定，说明刷新循环越规律。',
    pressureScatter: '每个点代表一次无人机生成事件：X 轴是生成时刻场上的活跃敌人数，Y 轴是接下来 15 秒内出现的无人机数量。用于观察"高压时是否更容易/更不容易刷无人机"。',
  };

  function summary(rec) {
    const head = ['仲裁', rec.missionTypeName].filter(Boolean).join(' ');
    const loc  = [rec.node, rec.planet].filter(Boolean).join(' · ');
    return {
      title: loc ? `${head} · ${loc}` : head,
      sub: `${fmtHMS(rec.duration)} ｜ 无人机 ${rec.droneCount} ｜ 评分 ${rec.score}`,
    };
  }

  // 带 tooltip 的标签元素
  function tipLabel(text, tip, tagName) {
    const el = U.el(tagName || 'span', 'has-tip', text);
    if (tip) el.title = tip;
    return el;
  }

  // 单条效率进度条
  function effBar(container, label, pct, hint, title) {
    const row = U.el('div', 'arb-eff-row');
    const top = U.el('div', 'arb-eff-top');
    const nameEl = U.el('span', 'arb-eff-name', label);
    if (title) { nameEl.title = title; nameEl.classList.add('has-tip'); }
    top.appendChild(nameEl);
    top.appendChild(U.el('span', 'arb-eff-val', pct.toFixed(1) + '%'));
    row.appendChild(top);
    const track = U.el('div', 'arb-eff-track');
    const fill = U.el('div', 'arb-eff-fill');
    fill.style.width = Math.min(100, pct) + '%';
    track.appendChild(fill);
    row.appendChild(track);
    if (hint) row.appendChild(U.el('div', 'arb-eff-hint', hint));
    container.appendChild(row);
  }

  // 通用横向分布条组（赛博风）
  function distBars(container, opts) {
    const box = U.el('div', 'arb-dist cy-panel');
    const hd = U.el('div', 'arb-dist-hd');
    hd.appendChild(U.el('span', 'arb-dist-title', opts.title));
    if (opts.headRight) hd.appendChild(U.el('span', 'arb-dist-max', opts.headRight));
    box.appendChild(hd);
    const maxPct = Math.max(1, ...opts.rows.map((r) => r.pct));
    opts.rows.forEach((r) => {
      const row = U.el('div', 'arb-bar-row');
      row.appendChild(U.el('span', 'arb-bar-label', r.label));
      const track = U.el('div', 'arb-bar-track cy-track');
      const fill = U.el('div', 'arb-bar-fill cy-fill' + (r.pct > 0 ? '' : ' zero'));
      fill.style.width = (r.pct / maxPct * 100).toFixed(1) + '%';
      track.appendChild(fill);
      row.appendChild(track);
      row.appendChild(U.el('span', 'arb-bar-pct', r.pct.toFixed(1) + '%'));
      if (r.right != null) row.appendChild(U.el('span', 'arb-bar-right', r.right));
      box.appendChild(row);
    });
    if (opts.footer) box.appendChild(U.el('div', 'arb-dist-foot', opts.footer));
    container.appendChild(box);
  }

  // ECharts 卡片容器
  function chartCard(container, title, tip) {
    const box = U.el('div', 'arb-chart-card cy-panel');
    const hd = U.el('div', 'arb-chart-hd');
    hd.appendChild(U.el('span', 'arb-chart-title', title));
    if (tip) {
      const icon = U.el('span', 'arb-chart-tip has-tip', '?');
      icon.title = tip;
      hd.appendChild(icon);
    }
    box.appendChild(hd);
    const body = U.el('div', 'arb-chart-body');
    box.appendChild(body);
    container.appendChild(box);
    return body;
  }

  // 分节点基准数据是页面打开时异步加载的，体量很小、几乎总能在用户点开某条
  // 记录之前就绪；但仍留一道保险——如果解析当时基准还没到位（用了默认 600
  // 兜底），这里发现现在已经有该节点的专属基准了，就用它重新算一遍评分再展示。
  function maybeRecalcWithNodeBaseline(rec) {
    if (rec.essBaselineIsNode) return;
    const P = WF.ArbitrationParser;
    if (!WF.ArbNodeBaseline || !P) return;
    const nb = WF.ArbNodeBaseline.lookup(rec.nodeId);
    if (!nb) return;
    const essEff = P.essenceEfficiency(rec.essence.fullBuffPerHour, nb.perHour);
    const score  = P.computeScore(essEff, rec.eff.clear, rec.eff.clearComp, rec.eff.rhythm);
    rec.eff.essence = essEff;
    rec.score = score;
    rec.scoreTier = P.scoreTierName(score);
    rec.essBaseline = nb.perHour;
    rec.essBaselineIsNode = true;
  }

  function render(container, rec, clock) {
    container.innerHTML = '';
    clearCharts();
    maybeRecalcWithNodeBaseline(rec);
    const eff = rec.eff || { essence: 0, clear: 0, clearComp: 0, rhythm: 0 };

    /* ─── 1. 页面头部 ─── */
    const header = U.el('div', 'arb-header');
    const sum = summary(rec);
    header.appendChild(U.el('div', 'arb-header-title', sum.title));
    header.appendChild(U.el('div', 'arb-header-sub', sum.sub));
    header.appendChild(U.el('div', 'arb-header-line'));
    container.appendChild(header);

    /* ─── 2. 综合评分区 ─── */
    const scoreWrap = U.el('div', 'arb-score-wrap');
    const badge = U.el('div', 'arb-score-badge ' + tierClass(rec.score));
    badge.appendChild(U.el('div', 'arb-score-num', String(rec.score)));
    badge.appendChild(U.el('div', 'arb-score-sub', '/ 120'));
    badge.appendChild(U.el('div', 'arb-score-tier', rec.scoreTier || ''));
    badge.title = `生息效率 ${eff.essence.toFixed(1)}% · 节奏稳定性 ${(eff.rhythm != null ? eff.rhythm : 50).toFixed(1)}%`;
    scoreWrap.appendChild(badge);

    const effBox = U.el('div', 'arb-eff-box-score');
    effBar(effBox, '生息效率', eff.essence,
      `期望生息速率 ${rec.essence.fullBuffPerHour.toFixed(1)}/时（权重 40%）`);
    const clearStr = eff.clear != null ? eff.clear.toFixed(1) + '%' : '—';
    effBar(effBox, '清图效率', eff.clear != null ? eff.clear : 50,
      eff.clear != null ? `场上≥10只敌人的时间占比 ${(100 - eff.clear).toFixed(1)}%（权重 20%）` : '采样数据不足，本维度以 50 分中性值计入（权重 20%）',
      TOOLTIPS.activeEnemy);
    const clearCompStr = eff.clearComp != null ? eff.clearComp.toFixed(1) + '%' : '—';
    effBar(effBox, '综合效率', eff.clearComp != null ? eff.clearComp : 50,
      eff.clearComp != null ? `清洁度×70% + 高压响应×30% = ${eff.clearComp.toFixed(1)}%（权重 20%）` : '数据不足，本维度以 50 分中性值计入（权重 20%）',
      '清洁度：按活跃敌人分布区间评分，0-4=100分、5-9=80分、10-14=70分、15-20=30分、>20=0分，再按驻留时长加权平均。' + TOOLTIPS.activeEnemy + ' 高压响应：统计从≥10只敌人恢复到<10只的平均时间。');
    effBar(effBox, '节奏稳定性', eff.rhythm != null ? eff.rhythm : 50,
      eff.rhythm != null ? `${eff.rhythm.toFixed(1)}%（权重 20%）` : '数据不足，本维度以 50 分中性值计入（权重 20%）',
      TOOLTIPS.rhythm);
    scoreWrap.appendChild(effBox);
    container.appendChild(scoreWrap);

    /* ─── 3. 时间元信息区 ─── */
    const metaGrid = U.el('div', 'arb-meta-grid');
    const metaItems = [
      { label: '总时长', value: fmtHMS(rec.duration), tip: '从 SS_STARTED 到系统结算时间的经过时长。' },
      { label: '全队在场时间', value: rec.lastClientDuration != null ? fmtHMS(rec.lastClientDuration) : '—', tip: rec.lastClientDuration != null ? '系统结算时间 − 最后一个队友进入任务的时刻。' : '所有队友进入任务的时刻都早于计时起点，开局前队伍已到齐。' },
      { label: '首帧时间', value: rec.firstFrameDate ? U.fmtAbsTime(rec.firstFrameDate, clock ? clock.approx : true) : '—', tip: 'HUD REDUX 首次渲染（载入完成、UI 就绪）的实际时刻。' },
      { label: '系统结算时间', value: rec.endDate ? U.fmtAbsTime(rec.endDate, clock ? clock.approx : true) : '—', tip: '无尽任务 = 最后一次轮/波结算触发的时刻。' },
    ];
    metaItems.forEach(({ label, value, tip }) => {
      const cell = U.el('div', 'arb-meta-cell cy-panel');
      cell.appendChild(U.el('div', 'arb-meta-label', label));
      const val = U.el('div', 'arb-meta-value', value);
      if (tip) { val.classList.add('has-tip'); val.title = tip; }
      cell.appendChild(val);
      metaGrid.appendChild(cell);
    });
    container.appendChild(metaGrid);

    /* ─── 4. 核心 KPI 指标网格 ─── */
    const grid = U.el('div', 'arb-metrics-grid');
    const metrics = [
      { label: '无人机生成',      value: String(rec.droneCount),               cls: 'accent' },
      { label: '敌人生成',        value: String(rec.maxSpawned),               cls: 'accent', title: TOOLTIPS.spawnNote },
      { label: '生成事件数',      value: String(rec.enemyEventCount || 0),     cls: 'accent', title: TOOLTIPS.spawnNote },
      { label: '无人机 / 分钟',   value: rec.dronesPerMin.toFixed(2),          cls: 'accent' },
      { label: '总时长',          value: fmtHMS(rec.duration),                 cls: 'big', title: '从 SS_STARTED 到系统结算时间的经过时长。' },
      { label: rec.missionType === 'survival' ? '生存轮次' : '轮 / 波次', value: String(rec.rounds), cls: 'accent' },
      { label: '期望生息',        value: rec.essence.fullBuffTotal.toFixed(3), cls: 'accent' },
      { label: '期望生息 / 小时',  value: rec.essence.fullBuffPerHour.toFixed(1), cls: 'accent' },
    ];
    metrics.forEach(({ label, value, cls, title }) => {
      const cell = U.el('div', 'stat ' + cls);
      if (title) { cell.title = title; cell.classList.add('has-tip'); }
      cell.appendChild(U.el('div', 'stat-value', value));
      cell.appendChild(U.el('div', 'stat-label', label));
      grid.appendChild(cell);
    });
    container.appendChild(grid);

    /* ─── 5. 任务时间轴总览 ─── */
    const timelineSection = U.el('div', 'arb-section');
    const timelineTitle = U.el('div', 'section-title has-tip', '任务时间轴总览');
    timelineTitle.title = TOOLTIPS.timeline;
    timelineSection.appendChild(timelineTitle);
    const timelineBody = chartCard(timelineSection, '', null);
    container.appendChild(timelineSection); // 先挂载，确保 echarts.init 时容器有宽度
    pushChart(C.timelineOverview(timelineBody, rec));

    /* ─── 6. 异常诊断区 ─── */
    if (rec.anomalies && rec.anomalies.length) {
      const anomalySection = U.el('div', 'arb-section');
      anomalySection.appendChild(U.el('div', 'section-title', '异常诊断'));
      const anomalyList = U.el('div', 'arb-anomaly-list');
      for (const a of rec.anomalies) {
        const row = U.el('div', 'arb-anomaly-row ' + (a.severity === 'danger' ? 'danger' : 'warning'));
        const icon = U.el('span', 'arb-anomaly-icon', a.severity === 'danger' ? '!' : '⚠');
        const text = U.el('span', 'arb-anomaly-text', a.text);
        row.appendChild(icon);
        row.appendChild(text);
        anomalyList.appendChild(row);
      }
      anomalySection.appendChild(anomalyList);
      container.appendChild(anomalySection);
    }

    /* ─── 7. 每轮明细（可展开）─── */
    if (rec.roundDetail && rec.roundDetail.length && WF.roundDetail) {
      WF.roundDetail.renderToggle(container, rec.roundDetail.map((r) => ({
        label: r.label, durSec: r.durSec,
        countA: r.drones, countB: r.spawned,
        spawnEvents: r.spawnEvents,
        liveAvg: r.liveAvg, liveMax: r.liveMax,
        droneGapAvg: r.droneGapAvg, droneGapMax: r.droneGapMax,
        highPressurePct: r.highPressurePct,
        essence: r.essence, incomplete: r.incomplete,
      })), {
        countALabel: '无人机生成', countBLabel: '敌人生成',
        showSparsity: false, showEssence: true,
        extraColumns: [
          { key: 'spawnEvents', label: '生成事件数' },
          { key: 'liveAvg', label: '平均活跃敌', fmt: (v) => v != null ? v.toFixed(1) : '—' },
          { key: 'liveMax', label: '峰值活跃敌', fmt: (v) => v != null ? v : '—' },
          { key: 'droneGapAvg', label: '无人机均隔', fmt: (v) => v != null ? v.toFixed(1) + 's' : '—' },
          { key: 'highPressurePct', label: '高压占比', fmt: (v) => v != null ? v.toFixed(1) + '%' : '—' },
        ],
        footnote: '"敌人生成"来自日志 Spawned 字段峰值，"生成事件数"来自真实 OnAgentCreated 行数，两者差距大说明日志可能不完整。',
        footnoteTip: TOOLTIPS.spawnNote,
      });
    }

    /* ─── 8. 分布图区 ─── */
    const distSection = U.el('div', 'arb-section');
    distSection.appendChild(U.el('div', 'section-title', '分布图区'));
    const distWrap = U.el('div', 'arb-dist-wrap');
    distSection.appendChild(distWrap);
    container.appendChild(distSection); // 先挂载，确保后续 echarts.init 时容器有宽度

    // 8.1 无人机刷新间隔
    if (rec.dist && rec.dist.vacuum) {
      const vac = rec.dist.vacuum;
      distBars(distWrap, {
        title: '无人机刷新间隔',
        rows: vac.rows.map((r) => ({ label: r.hi == null ? r.lo + '+' : `${r.lo}-${r.hi}`, pct: r.pct, right: r.seconds.toFixed(1) + 's' })),
        footer: `>2s 占比：${vac.over2Pct.toFixed(1)}% · 最大间隔：${vac.maxGap.toFixed(1)}s`,
      });
    }

    // 8.2 无人机批次分析（左：批次大小，右：批次间间隔）
    if (rec.dist && rec.dist.consecutive && rec.dist.interBatch) {
      const con = rec.dist.consecutive;
      const inter = rec.dist.interBatch;
      const batchWrap = U.el('div', 'arb-batch-split cy-panel');
      const batchHd = U.el('div', 'arb-dist-hd');
      batchHd.appendChild(tipLabel('无人机批次分析', TOOLTIPS.batchGap, 'span'));
      batchHd.appendChild(U.el('span', 'arb-dist-max', `共 ${con.totalBatches} 批次`));
      batchWrap.appendChild(batchHd);
      const batchBody = U.el('div', 'arb-batch-body');
      // 批次大小
      const sizeBox = U.el('div', 'arb-batch-col');
      sizeBox.appendChild(U.el('div', 'arb-batch-subtitle', '批次大小'));
      const maxSizePct = Math.max(1, ...con.rows.map((r) => r.pct));
      con.rows.forEach((r) => {
        const row = U.el('div', 'arb-bar-row small');
        row.appendChild(U.el('span', 'arb-bar-label', r.size + ' 只'));
        const track = U.el('div', 'arb-bar-track cy-track');
        const fill = U.el('div', 'arb-bar-fill cy-fill');
        fill.style.width = (r.pct / maxSizePct * 100).toFixed(1) + '%';
        track.appendChild(fill);
        row.appendChild(track);
        row.appendChild(U.el('span', 'arb-bar-pct', r.pct.toFixed(1) + '%'));
        sizeBox.appendChild(row);
      });
      batchBody.appendChild(sizeBox);
      // 批次间间隔
      const gapBox = U.el('div', 'arb-batch-col');
      gapBox.appendChild(tipLabel('批次间间隔', TOOLTIPS.batchGap, 'div'));
      const maxGapPct = Math.max(1, ...inter.rows.map((r) => r.pct));
      inter.rows.forEach((r) => {
        const row = U.el('div', 'arb-bar-row small');
        row.appendChild(U.el('span', 'arb-bar-label', r.hi == null ? r.lo + '+' : `${r.lo}-${r.hi}`));
        const track = U.el('div', 'arb-bar-track cy-track');
        const fill = U.el('div', 'arb-bar-fill cy-fill magenta');
        fill.style.width = (r.pct / maxGapPct * 100).toFixed(1) + '%';
        track.appendChild(fill);
        row.appendChild(track);
        row.appendChild(U.el('span', 'arb-bar-pct', r.pct.toFixed(1) + '%'));
        gapBox.appendChild(row);
      });
      batchBody.appendChild(gapBox);
      batchWrap.appendChild(batchBody);
      distWrap.appendChild(batchWrap);
    }

    // 8.3 无人机生成趋势
    const droneTrendBody = chartCard(distWrap, '无人机生成趋势（每分钟）', '按任务进行时间切片，观察产出节奏是否随时间衰减或提升。');
    pushChart(C.droneTrendChart(droneTrendBody, rec));

    // 8.4 敌人生成速率
    const spawnBody = chartCard(distWrap, '敌人生成速率（每分钟）', '实线 = Spawned 峰值差分，半透明柱 = 真实生成事件数。差距大说明日志可能被裁切。');
    pushChart(C.spawnRateChart(spawnBody, rec));

    // 8.5 清图压力趋势
    const pressureBody = chartCard(distWrap, '清图压力趋势（每分钟）', '青色面积 = 平均活跃敌人，洋红虚线 = 最大活跃敌人，青色柱 = 估算清图量。');
    pushChart(C.pressureTrendChart(pressureBody, rec));

    // 8.6 清图效率分布
    if (rec.dist && rec.dist.liveDist) {
      const ld = rec.dist.liveDist;
      distBars(distWrap, {
        title: '清图效率',
        rows: ld.rows.map((r) => ({ label: r.hi == null ? r.lo + '+' : `${r.lo}-${r.hi}`, pct: r.pct, right: r.seconds.toFixed(1) + 's' })),
        footer: `高压占比（≥10）：${ld.geq10Pct.toFixed(1)}%`,
      });
    }

    // 8.7 压力-产出散点图
    const scatterBody = chartCard(distWrap, '压力-产出关联', TOOLTIPS.pressureScatter);
    pushChart(C.pressureDroneScatter(scatterBody, rec));

    // 8.8 高压恢复时间线
    const recoveryBody = chartCard(distWrap, '高压恢复时间线', '每次场上活跃敌人从≥10恢复到<10所花费的时间。颜色越绿越快，越红越慢。');
    pushChart(C.recoveryTimeline(recoveryBody, rec));

    /* ─── 9. 交叉分析区 ─── */
    const crossSection = U.el('div', 'arb-section');
    crossSection.appendChild(U.el('div', 'section-title', '交叉分析：压力与产出'));
    const crossGrid = U.el('div', 'arb-cross-grid');
    const crossItems = [
      {
        label: '无人机生成时的场上压力',
        value: rec.cross && rec.cross.droneAtPressurePct ? `低压 ${rec.cross.droneAtPressurePct.low.toFixed(0)}% · 中压 ${rec.cross.droneAtPressurePct.mid.toFixed(0)}% · 高压 ${rec.cross.droneAtPressurePct.high.toFixed(0)}%` : '—',
        tip: TOOLTIPS.activeEnemy,
      },
      {
        label: '平均高压恢复时间',
        value: rec.cross && rec.cross.recoveryAvg != null ? (rec.cross.recoveryAvg === 0 ? '从未高压' : rec.cross.recoveryAvg.toFixed(1) + 's') : '—',
        tip: '场上活跃敌人从≥10恢复到<10的平均时间。',
      },
      {
        label: '清图效率指数 CEI',
        value: rec.cross && rec.cross.clearEfficiencyIndex != null ? rec.cross.clearEfficiencyIndex.toFixed(0) : '—',
        tip: '综合清图效率指数：清图效率×40% + 高压响应×30% + 生成-清图比×30%。',
      },
      {
        label: '压力-产出最大相关滞后',
        value: rec.cross && rec.cross.pressureCorrelation && rec.cross.pressureCorrelation.best ? `${rec.cross.pressureCorrelation.best.lagSec}s (r=${(rec.cross.pressureCorrelation.best.correlation || 0).toFixed(2)})` : '—',
        tip: '计算场上压力与未来不同时刻无人机产出之间的 Pearson 相关系数，找出相关性最强的滞后时间。',
      },
    ];
    crossItems.forEach(({ label, value, tip }) => {
      const cell = U.el('div', 'arb-cross-cell cy-panel');
      cell.appendChild(tipLabel(label, tip, 'div'));
      cell.appendChild(U.el('div', 'arb-cross-value', value));
      crossGrid.appendChild(cell);
    });
    crossSection.appendChild(crossGrid);
    container.appendChild(crossSection);

    /* ─── 10. 生息计算 ─── */
    const essBox = U.el('div', 'arb-ess-box');
    essBox.appendChild(U.el('div', 'section-title', '生息计算'));
    const e = rec.essence;
    const essRows = [
      ['无人机生成（总）', `${rec.droneCount}`],
      ['无人机基础期望',   `${rec.droneCount} × 6% = ${e.fromDrones.toFixed(2)}`],
      ['无人机掉落倍率',   `×${e.buffMul.toFixed(2)}`],
      ['无人机期望生息',   `${e.droneFullBuff.toFixed(3)}`],
      ['轮次奖励期望',     rec.rounds > 0 ? `保底 ${e.roundGuarantee.toFixed(1)} + 额外 ${e.roundExtra.toFixed(1)} = ${e.fromRounds.toFixed(2)}` : '—'],
      ['期望生息（合计）', `${e.fullBuffTotal.toFixed(3)}`],
      ['期望生息 / 小时',  `${e.fullBuffPerHour.toFixed(1)}`],
      ['期望生息 / 分钟',  `${e.fullBuffPerMin.toFixed(2)}`],
    ];
    const essTable = U.el('div', 'arb-ess-grid');
    essRows.forEach(([k, v]) => {
      essTable.appendChild(U.el('span', 'arb-ess-key', k));
      essTable.appendChild(U.el('span', 'arb-ess-val', v));
    });
    essBox.appendChild(essTable);
    essBox.appendChild(U.el('div', 'arb-ess-buffnote', '掉落倍率组成：蓝盒 ×2 · 富足 ×1.18 · 黄盒 ×2 · 祝福 ×1.25'));
    container.appendChild(essBox);

    /* ─── 11. 评分说明 ─── */
    const explain = U.el('div', 'arb-explain');
    explain.appendChild(U.el('div', 'section-title', '评分说明'));

    const defWrap = U.el('div', 'arb-explain-defs');
    const defs = [
      ['生息效率（40%）', '把期望生息 ÷ 任务时长换算成期望生息速率（每小时全 Buff 产出），再除以节点基准数量，得到百分比。'],
      ['清图效率（20%）', '依据房主日志中 MonitoredTicking 字段采样，统计全场中场上同时受监控的活跃敌人数 ≥10（"高压"阈值）的时间占比，取 100 减去该占比作为得分。', TOOLTIPS.activeEnemy],
      ['综合效率（20%）', '由两个维度融合：① 清洁度（70%）——按活跃敌人分布区间评分；② 高压响应（30%）——统计从≥10只敌人恢复到<10只的平均时间。'],
      ['节奏稳定性（20%）', TOOLTIPS.rhythm],
    ];
    defs.forEach(([k, v, tip]) => {
      const d = U.el('div', 'arb-def-row');
      const key = U.el('span', 'arb-def-key', k);
      if (k.includes('节奏稳定性')) { key.classList.add('has-tip'); key.title = TOOLTIPS.rhythm; }
      d.appendChild(key);
      const val = U.el('span', 'arb-def-val', v);
      if (tip) { val.classList.add('has-tip'); val.title = tip; }
      d.appendChild(val);
      defWrap.appendChild(d);
    });
    explain.appendChild(defWrap);

    explain.appendChild(U.el('div', 'arb-explain-sub', '综合评分 ＝ 0.40×生息效率 + 0.20×清图效率 + 0.20×综合效率 + 0.20×节奏稳定性，上限 120 分。清图效率、综合效率与节奏稳定性三项完全由日志推算，不依赖外部排行榜数据，确保节点基准数据缺失时评分仍具参考价值。'));
    const scaleRows = [
      ['101 - 120', '巅峰', '综合效率与操作水平的提升空间已经不大，整体表现趋近完美'],
      ['80 - 100',  '优秀', '操作表现较为稳定、清图流畅、地图整体的清洁度高，属广义上的高效队伍'],
      ['70 - 79',   '良好', '整体表现不错，但至少某一维度仍有明显提升空间'],
      ['60 - 69',   '及格', '勉强达到了能够正常执行任务的水平，建议多加练习'],
      ['0 - 59',    '初学', '建议寻找靠谱的学习资料，优化配装、继续在实战中提升熟练度'],
    ];
    const scaleTable = U.el('div', 'arb-scale-rows');
    scaleRows.forEach(([range, tier, desc]) => {
      const row = U.el('div', 'arb-scale-row' + (tier === rec.scoreTier ? ' cur' : ''));
      row.appendChild(U.el('span', 'arb-scale-range', range));
      row.appendChild(U.el('span', 'arb-scale-tier', tier));
      row.appendChild(U.el('span', 'arb-scale-desc', desc));
      scaleTable.appendChild(row);
    });
    explain.appendChild(scaleTable);
    explain.appendChild(U.el('div', 'note',
      '无人机、敌人生成、清图效率、轮次结算均取自房主（Host）本地日志对应字段；此处的"1 分钟"是针对整场任务的门槛——只有当整局仲裁的主机时长不足 1 分钟时，这整条记录才会被判定为无效数据并整体排除。' +
      '受限于客户端日志的记录范围，任务实际结算获得的生息精华数量无法被读取——本页展示的"生息"均为按掉落规则推算出的统计期望值，并非实际到手数量。'));
    container.appendChild(explain);

    /* ─── 12. 对话记录 ─── */
    WF.chatMixin.renderChatLog(container, rec);

    // 窗口大小变化时重绘图表
    currentResizeHandler = () => { for (const c of activeCharts) if (c && c.resize) c.resize(); };
    window.addEventListener('resize', currentResizeHandler);
    // 兜底：下一帧再 resize 一次，确保所有图表容器完成布局后正确绘制
    requestAnimationFrame(() => { for (const c of activeCharts) if (c && c.resize) c.resize(); });
  }

  return { render, summary };
})();
