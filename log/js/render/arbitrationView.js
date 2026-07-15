/* 仲裁详情视图
 * 布局（自上而下，信息层层递进）：
 *   综合评分徽章 + 任务标题/元信息（主机时长 + 最后客机时间）+ 综合熟练度速览
 *   → 队伍成员 → 核心指标网格 → 每轮明细（可展开）→ 效率指标（生息/清图/综合效率）
 *   → 六张分布图，单列纵向排列，统一横向柱状条风格：
 *     无人机刷新间隔 → 无人机生成趋势（每分钟）→ 无人机刷新连续度 →
 *     敌人生成速率（每分钟）→ 清图压力趋势（每分钟）→ 清图效率
 *   → 生息计算 → 评分说明 → 对话记录 */
window.WF = window.WF || {};

WF.arbitrationView = (function () {
  const U = WF.utils;

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

  function summary(rec) {
    const head = ['仲裁', rec.missionTypeName].filter(Boolean).join(' ');
    const loc  = [rec.node, rec.planet].filter(Boolean).join(' · ');
    return {
      title: loc ? `${head} · ${loc}` : head,
      sub: `${fmtHMS(rec.duration)} ｜ 无人机 ${rec.droneCount} ｜ 评分 ${rec.score}`,
    };
  }

  // 单条效率进度条；title 可选——鼠标停留在指标名上时显示详细概念说明
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


  // 分节点基准数据是页面打开时异步加载的，体量很小、几乎总能在用户点开某条
  // 记录之前就绪；但仍留一道保险——如果解析当时基准还没到位（用了默认 600
  // 兜底），这里发现现在已经有该节点的专属基准了，就用它重新算一遍评分再展示，
  // 而不是让用户看到一个本该更准确却没用上节点基准的结果。
  function maybeRecalcWithNodeBaseline(rec) {
    if (rec.essBaselineIsNode) return;
    const P = WF.ArbitrationParser;
    if (!WF.ArbNodeBaseline || !P) return;
    const nb = WF.ArbNodeBaseline.lookup(rec.nodeId);
    if (!nb) return;
    const essEff = P.essenceEfficiency(rec.essence.fullBuffPerHour, nb.perHour);
    const score  = P.computeScore(essEff, rec.eff.clear, rec.eff.clearComp);
    rec.eff.essence = essEff;
    rec.score = score;
    rec.scoreTier = P.scoreTierName(score);
    rec.essBaseline = nb.perHour;
    rec.essBaselineIsNode = true;
  }

  function render(container, rec, clock) {
    container.innerHTML = '';
    maybeRecalcWithNodeBaseline(rec);
    const eff = rec.eff || { essence: 0, clear: 0, clearComp: 0, proficiency: 0 };

    /* ─── 顶行：综合评分徽章 + 任务元信息 ─── */
    const topRow = U.el('div', 'arb-top-row');

    const badge = U.el('div', 'arb-score-badge ' + tierClass(rec.score));
    badge.appendChild(U.el('div', 'arb-score-num', String(rec.score)));
    badge.appendChild(U.el('div', 'arb-score-sub', '/ 120'));
    badge.appendChild(U.el('div', 'arb-score-tier', rec.scoreTier || ''));
    badge.title = `生息效率 ${eff.essence.toFixed(1)}%`;
    topRow.appendChild(badge);

    const meta = U.el('div', 'arb-meta');
    const titleParts = [rec.node, rec.planet, rec.missionTypeName, rec.factionZh].filter(Boolean);
    meta.appendChild(U.el('div', 'arb-meta-title', titleParts.join(' · ')));

    const durRow = U.el('div', 'arb-meta-sub arb-meta-hint has-tip');
    durRow.appendChild(document.createTextNode('总时长 ' + fmtHMS(rec.duration) + `（${U.fmtDurationLong(rec.duration)}）`));
    durRow.title = '从 SS_STARTED（本机正式进入任务、开始计时）到"系统结算时间"之间经过的时长，'
      + '与下方核心指标网格里的"总时长"是同一个数值。它和"系统结算时间"描述的是同一个任务终点——'
      + '前者用经过了多久（时长）表示，后者用当时的真实时钟时间（几点几分几秒）表示，两者不是相互独立的两套计时。';
    meta.appendChild(durRow);

    /* 以下四行——系统结算时间 / 全队在场时间 / 首帧时间 / 尾帧时间——无论数据是否
       缺失、是否与其它行数值相同，都固定展示（缺失时用"—"+原因说明），
       避免用户误以为是"没读出来"而非"这局本来就没有这项数据/两者恰好相同"。 */
    const _recDate = (t, recDate) => recDate || (clock && clock.available ? clock.toDate(t) : null);
    const approx = clock ? clock.approx : true;

    function _metaRow(label, text, hint) {
      const row = U.el('div', 'arb-meta-sub arb-meta-hint has-tip');
      row.appendChild(document.createTextNode(label + ' ' + text));
      if (hint) row.title = hint;
      meta.appendChild(row);
      return row;
    }

    // 全队在场时间
    if (rec.lastClientDuration != null) {
      _metaRow('全队在场时间', fmtHMS(rec.lastClientDuration) + `（${U.fmtDurationLong(rec.lastClientDuration)}）`,
        '系统结算时间 − 最后一个队友进入任务的时刻。测量的是"全员到齐后一起玩的有效时长"。');
    } else {
      _metaRow('全队在场时间', '— （全员已在任务开始前入场，无需等待）',
        '所有队友进入任务的时刻都早于总时长的计时起点，说明开局前队伍已到齐，不存在"等待最后一人"的时长。');
    }

    // 首帧时间（HUD REDUX 首次渲染）
    const ffDate = rec.firstFrameT != null ? _recDate(rec.firstFrameT, rec.firstFrameDate) : null;
    _metaRow('首帧时间', ffDate ? U.fmtAbsTime(ffDate, approx) : '— （日志中未捕获到 HUD REDUX 信号）',
      'HUD REDUX 首次渲染（载入完成、UI 就绪）的实际时刻');

    // 尾帧时间（与"系统结算时间"取自同一个任务有效终点——无尽任务没有独立于
    // 轮次结算之外的"尾帧"事件，故两行数值通常相同，仍分别列出以免误解为漏读）
    const endDate = _recDate(rec.endT, rec.endDate);
    _metaRow('尾帧时间', endDate ? U.fmtAbsTime(endDate, approx) : '— （无法换算绝对时刻）',
      '任务有效终点（无尽任务=最后一次轮/波结算）对应的实际时钟时间');

    // 系统结算时间
    _metaRow('系统结算时间', endDate ? U.fmtAbsTime(endDate, approx) : '— （无法换算绝对时刻）',
      '本解析器认定的任务终点（无尽任务=最后一次轮/波结算触发的时刻），与"尾帧时间"取自同一个终点，数值相同属正常现象。'
      + '它不等价于"游戏内结算画面弹出的确切帧"——如果最后一轮结算后还经过一段时间才提取，'
      + '真实的结算/提取画面会比这个时刻更晚一些，暂无法从日志中拿到更精确的信号。');

    if (rec.frameDuration != null) {
      const fdRow = U.el('div', 'arb-meta-sub arb-meta-hint has-tip');
      fdRow.appendChild(document.createTextNode('首帧 → 系统结算 ' + fmtHMS(rec.frameDuration) + `（${U.fmtDurationLong(rec.frameDuration)}）`));
      fdRow.title = '系统结算时间 − 首帧时间，最接近"进入任务画面→系统结算"的体感时长。'
        + '首帧（HUD REDUX 首次渲染）通常发生在 SS_STARTED 之前一小段时间（先加载完成、状态机才切换），'
        + '所以这段时长起点比"总时长"更早，数值往往会略长于总时长，属正常现象。';
      meta.appendChild(fdRow);
    }
    const metaSubs = [
      rec.rounds > 0 ? `${rec.missionType === 'survival' ? '生存轮次' : '轮/波次'} ${rec.rounds}` : null,
      [rec.node, rec.nodeId].filter(Boolean).length ? `节点 ${rec.node || '—'}（${rec.nodeId || '未知 ID'}）` : null,
      !rec.complete ? '（未检测到完整结算，时长为估算值）' : null,
    ].filter(Boolean);
    metaSubs.forEach((s) => meta.appendChild(U.el('div', 'arb-meta-sub', s)));
    const clearStr = eff.clear != null ? eff.clear.toFixed(1) + '%' : '—';
    const clearCompStr = eff.clearComp != null ? eff.clearComp.toFixed(1) + '%' : '—';
    meta.appendChild(U.el('div', 'arb-grade-desc',
      `生息效率 ${eff.essence.toFixed(1)}% · 清图效率 ${clearStr} · 综合效率 ${clearCompStr}`));
    topRow.appendChild(meta);
    container.appendChild(topRow);

    WF.squadMixin.renderSquad(container, rec);

    /* ─── 核心指标网格 ─── */
    const grid = U.el('div', 'arb-metrics-grid');
    const SPAWN_NOTE = 'EE.log 不会记录"某个敌人被谁击杀"这类具体事件，所以这里不展示确切击杀数。'
      + '"敌人生成"是房主日志里每次 OnAgentCreated 事件携带的 Spawned 字段峰值——这是游戏引擎自己上报的累计生成数，'
      + '理论上应与游戏内实际数值一致；但如果这份日志不是从任务最开始就在记录（比如日志文件被裁切、或从中途接入），'
      + '开局阶段的生成会缺失一部分，导致这里显示的数字比实际偏低。无人机生成同理，逐行精确计数，一般更可靠。';
    const metrics = [
      { label: '无人机生成',      value: String(rec.droneCount),               cls: 'accent' },
      { label: '敌人生成',        value: String(rec.maxSpawned),               cls: 'accent', title: SPAWN_NOTE },
      { label: '无人机 / 分钟',   value: rec.dronesPerMin.toFixed(2),          cls: 'accent' },
      { label: '总时长',          value: fmtHMS(rec.duration),                 cls: 'big',
        title: '从 SS_STARTED 到系统结算时间的经过时长，与上方"总时长"行是同一个数值，这里仅作为核心指标之一再展示一次' },
      { label: rec.missionType === 'survival' ? '生存轮次' : '轮 / 波次', value: String(rec.rounds), cls: 'accent' },
      { label: '期望生息',        value: rec.essence.fullBuffTotal.toFixed(3), cls: 'accent' },
      { label: '期望生息 / 小时',  value: rec.essence.fullBuffPerHour.toFixed(1), cls: 'accent' },
      { label: '期望生息 / 分钟',  value: rec.essence.fullBuffPerMin.toFixed(2), cls: 'accent' },
    ];
    metrics.forEach(({ label, value, cls, title }) => {
      const cell = U.el('div', 'stat ' + cls);
      if (title) { cell.title = title; cell.classList.add('has-tip'); }
      cell.appendChild(U.el('div', 'stat-value', value));
      cell.appendChild(U.el('div', 'stat-label', label));
      grid.appendChild(cell);
    });

    container.appendChild(grid);

    /* ─── 每轮明细（可展开）─── */
    if (rec.roundDetail && rec.roundDetail.length && WF.roundDetail) {
      WF.roundDetail.renderToggle(container, rec.roundDetail.map((r) => ({
        label: r.label, durSec: r.durSec,
        countA: r.drones, countB: r.spawned,
        sparsity: r.sparsity, essence: r.essence, incomplete: r.incomplete,
      })), {
        countALabel: '无人机生成', countBLabel: '敌人生成',
        showSparsity: true, showEssence: true,
        footnote: '"敌人生成"来自日志 Spawned 字段峰值，不是确切击杀数（EE.log 不记录具体击杀事件）；若日志非从任务开局记录，数字会偏低。',
        footnoteTip: SPAWN_NOTE,
      });
    }

    /* ─── 效率指标（生息 / 清图 / 综合效率）─── */
    const effBox = U.el('div', 'arb-eff-box');
    effBox.appendChild(U.el('div', 'section-title', '效率指标'));
    const effGrid = U.el('div', 'arb-eff-grid');
    const baseHint = `经过大数据分析后，得出生息效率评价`;
    const ACTIVE_ENEMY_DEF = '"活跃敌人"指日志里 MonitoredTicking 字段代表的、当前正被游戏 AI 持续追踪行为逻辑的敌人数量——'
      + '不是玩家肉眼在场景里能看到的全部单位，也不完全等于游戏内 UI 顶部显示的确切怪物计数，是引擎内部的一个采样值，用来大致反映"场上压力"，仅供参考。';
    effBar(effGrid, '生息效率', eff.essence,
      `期望生息速率 ${rec.essence.fullBuffPerHour.toFixed(1)}/时 · ${baseHint}（权重 50%）`);
    effBar(effGrid, '清图效率', eff.clear != null ? eff.clear : 50,
      eff.clear != null
        ? `场上≥10只敌人的时间占比 ${(100 - eff.clear).toFixed(1)}%，越低越好（权重 20%）`
        : '采样数据不足，本维度以 50 分中性值计入（权重 20%）',
      ACTIVE_ENEMY_DEF);
    effBar(effGrid, '综合效率', eff.clearComp != null ? eff.clearComp : 50,
      eff.clearComp != null
        ? `清洁度 × 70% + 操作稳定度 × 30% = ${eff.clearComp.toFixed(1)}%（权重 30%）`
        : '数据不足，本维度以 50 分中性值计入（权重 30%）',
      '清洁度：把整场任务按"场上活跃敌人数量"分成几个区间（0-4/5-9/10-14/15-20/20以上），'
      + '每个区间按驻留时长加权算出一个 0-100 的分数（敌人越少分数越高），场上越"干净"这项越高。'
      + ACTIVE_ENEMY_DEF
      + ' 操作稳定度：统计场上敌人从"高压"（≥10）恢复到正常水平所花的平均时间，恢复越快分数越高。');
    effBox.appendChild(effGrid);
    container.appendChild(effBox);

    /* ─── 分布图区（赛博风，单列纵向排列，统一横向柱状条风格） ─── */
    const distWrap = U.el('div', 'arb-dist-wrap');
    const pm = rec.dist && rec.dist.perMinute;

    if (rec.dist && rec.dist.vacuum) {
      const vac = rec.dist.vacuum;
      distBars(distWrap, {
        title: '无人机刷新间隔',
        rows: vac.rows.map((r) => ({ label: r.hi == null ? r.lo + '+' : `${r.lo}-${r.hi}`, pct: r.pct, right: r.seconds.toFixed(1) + 's' })),
        footer: `>2s 占比：${vac.over2Pct.toFixed(1)}%`,
      });
    }
    if (pm && pm.rows.length > 1) {
      distBars(distWrap, {
        title: '无人机生成趋势（每分钟）',
        rows: pm.rows.map((r) => ({ label: 'M' + r.minute, pct: pm.maxDrones > 0 ? r.drones / pm.maxDrones * 100 : 0, right: r.drones + ' 只' })),
        footer: '按任务进行时间切片，观察产出节奏是否随时间衰减或提升',
      });
    }
    if (rec.dist && rec.dist.consecutive) {
      const con = rec.dist.consecutive;
      distBars(distWrap, {
        title: '无人机刷新连续度',
        rows: con.rows.map((r) => ({ label: String(r.size), pct: r.pct, right: r.count + '次' })),
        footer: `共生成 ${con.totalBatches} 批次`,
      });
    }
    if (pm && pm.rows.length > 1) {
      distBars(distWrap, {
        title: '敌人生成速率（每分钟）',
        rows: pm.rows.map((r) => ({ label: 'M' + r.minute, pct: pm.maxSpawn > 0 ? r.spawn / pm.maxSpawn * 100 : 0, right: r.spawn + ' 个' })),
        footer: '突增 / 骤降的分钟段通常对应地图切换或走位调整',
      });
      distBars(distWrap, {
        title: '清图压力趋势（每分钟）',
        rows: pm.rows.map((r) => ({ label: 'M' + r.minute, pct: pm.maxCleared > 0 ? r.cleared / pm.maxCleared * 100 : 0, right: r.cleared + ' 个' })),
        footer: '由生成数与活跃监控数的净变化反推每分钟清图量，反映各分钟段清图压力的起伏',
      });
    }
    if (rec.dist && rec.dist.liveDist) {
      const ld = rec.dist.liveDist;
      distBars(distWrap, {
        title: '清图效率',
        rows: ld.rows.map((r) => ({ label: r.hi == null ? r.lo + '+' : `${r.lo}-${r.hi}`, pct: r.pct, right: r.seconds.toFixed(1) + 's' })),
        footer: `高压占比（≥10）：${ld.geq10Pct.toFixed(1)}%`,
      });
    }
    container.appendChild(distWrap);

    /* ─── 生息计算（紧凑双列对齐） ─── */
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

    /* ─── 评分说明 ─── */
    const explain = U.el('div', 'arb-explain');
    explain.appendChild(U.el('div', 'section-title', '评分说明'));

    const defWrap = U.el('div', 'arb-explain-defs');
    [
      ['生息效率（50%）', '把期望生息 ÷ 任务时长换算成期望生息速率（每小时全 Buff 产出），再除以基准数量，得到这里的百分比。此外，期望生息按掉落规则进行推算，排除运气影响。'],
      ['清图效率（20%）', '依据房主日志中，每次敌人生成行的 MonitoredTicking 字段采样，统计全场中场上同时受监控的活跃敌人数 ≥10（"高压"阈值）的时间占比（geq10Pct），取 100 − geq10Pct 作为得分。清图越干净、场上高压时段越少，这项得分越高。完全来自日志内采样，不依赖任何外部基准。'],
      ['综合效率（30%）', '由两个独立维度融合而成：① 清洁度（70%）——按活跃敌人分布区间评分，第1区间=100分、第2区间=80分、第3区间=70分、第4区间=30分、超过=0分，再按各区间的驻留时长加权平均；② 操作稳定度（30%）——扫描日志中所有从≥10只敌人回到<10只的恢复事件，计算平均恢复时间（秒），按 100 − 平均恢复时间×2 换算得分。操作稳定度的数值越高，说明队伍的稳定程度越高。'],
    ].forEach(([k, v]) => {
      const d = U.el('div', 'arb-def-row');
      d.appendChild(U.el('span', 'arb-def-key', k));
      d.appendChild(U.el('span', 'arb-def-val', v));
      defWrap.appendChild(d);
    });
    explain.appendChild(defWrap);

    explain.appendChild(U.el('div', 'arb-explain-sub', '综合评分 ＝ 0.50×生息效率 + 0.20×清图效率 + 0.30×综合效率，上限 120 分。清图效率与综合效率两项完全由日志推算，不依赖外部排行榜数据，确保节点基准数据缺失时评分仍具参考价值。'));
    const scaleRows = [
      ['101 - 120', '顶尖', '综合效率与操作水平的提升空间已经不大，整体表现趋近完美'],
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
      '无人机、敌人生成、清图效率、轮次结算均取自房主（Host）本地日志对应字段；此处的"1 分钟"是针对整场任务的门槛——只有当整局仲裁的主机时长不足 1 分钟（例如误触任务、中途放弃重开）时，这整条记录才会被判定为无效数据并整体排除，与单轮时长无关，单轮低于 1 分钟的正常结算完全会被保留计入。' +
      '受限于客户端日志的记录范围，任务实际结算获得的生息精华数量无法被读取——本页展示的"生息"均为按掉落规则推算出的统计期望值，并非实际到手数量。'));
    container.appendChild(explain);

    WF.chatMixin.renderChatLog(container, rec);
  }

  return { render, summary };
})();
