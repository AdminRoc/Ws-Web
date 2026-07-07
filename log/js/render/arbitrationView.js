/* 仲裁详情视图
 * 布局（自上而下，信息层层递进）：
 *   综合评分徽章 + 任务标题/元信息（主机时长 + 队内在场时长）+ 综合熟练度速览
 *   → 队伍成员 → 核心指标网格 → 每轮明细（可展开）→ 效率指标（生息/击杀/综合熟练度）
 *   → 六张分布图，单列纵向排列，统一横向柱状条风格：
 *     无人机刷新间隔 → 无人机生成趋势（每分钟）→ 无人机刷新连续度 →
 *     敌人生成速率（每分钟）→ 敌人击杀速率（每分钟，近似推算）→ 清图效率
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

  // 单条效率进度条
  function effBar(container, label, pct, hint) {
    const row = U.el('div', 'arb-eff-row');
    const top = U.el('div', 'arb-eff-top');
    top.appendChild(U.el('span', 'arb-eff-name', label));
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
    const score  = P.computeScore(essEff, rec.eff.clear, rec.eff.kill);
    rec.eff.essence = essEff;
    rec.score = score;
    rec.scoreTier = P.scoreTierName(score);
    rec.essBaseline = nb.perHour;
    rec.essBaselineIsNode = true;
  }

  function render(container, rec) {
    container.innerHTML = '';
    maybeRecalcWithNodeBaseline(rec);
    const eff = rec.eff || { essence: 0, kill: 0, proficiency: 0 };

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

    const durRow = U.el('div', 'arb-meta-sub');
    durRow.appendChild(document.createTextNode('主机时长 ' + fmtHMS(rec.duration) + `（${U.fmtDurationLong(rec.duration)}）`));
    meta.appendChild(durRow);
    if (rec.lastClientDuration != null) {
      const cliRow = U.el('div', 'arb-meta-sub arb-meta-hint');
      cliRow.appendChild(document.createTextNode('队内在场时长 ' + fmtHMS(rec.lastClientDuration) + `（${U.fmtDurationLong(rec.lastClientDuration)}）`));
      cliRow.title = '本项目自有指标（口径与其他分析工具可能不同）：房主本地日志会为每一名队员各自的网络连接单独记录同步诊断行，取这些连接"最后一次诊断"时间戳中最早出现的一个。只要有一名队员早于房主停止发出这类诊断（例如提前挂机、切出游戏、或提前退出留房主单刷），这里就会先于主机时长停止推进——反映的是"全员仍稳定在场"的窗口，而非整场任务的时长。为避免把"这名队员网络一直很干净、诊断行本来就少"误判成"提前离场"，诊断次数低于 5 次的连接不参与判定；若全队诊断样本都太少，则不显示本行。';
      cliRow.classList.add('has-tip');
      meta.appendChild(cliRow);
    }
    const metaSubs = [
      rec.rounds > 0 ? `${rec.missionType === 'survival' ? '生存轮次' : '轮/波次'} ${rec.rounds}` : null,
      [rec.node, rec.nodeId].filter(Boolean).length ? `节点 ${rec.node || '—'}（${rec.nodeId || '未知 ID'}）` : null,
      !rec.complete ? '（未检测到完整结算，时长为估算值）' : null,
    ].filter(Boolean);
    metaSubs.forEach((s) => meta.appendChild(U.el('div', 'arb-meta-sub', s)));
    const clearStr = eff.clear != null ? eff.clear.toFixed(1) + '%' : '—';
    const killStr  = eff.kill  != null ? eff.kill.toFixed(1)  + '%' : '—';
    meta.appendChild(U.el('div', 'arb-grade-desc',
      `生息效率 ${eff.essence.toFixed(1)}% · 清图效率 ${clearStr} · 击杀效率 ${killStr}`));
    topRow.appendChild(meta);
    container.appendChild(topRow);

    WF.squadMixin.renderSquad(container, rec);

    /* ─── 核心指标网格 ─── */
    const grid = U.el('div', 'arb-metrics-grid');
    const metrics = [
      { label: '无人机生成',    value: String(rec.droneCount),               cls: 'accent' },
      { label: '敌人生成',      value: String(rec.maxSpawned),               cls: '' },
      { label: '无人机 / 分钟',  value: rec.dronesPerMin.toFixed(2),          cls: '' },
      { label: '总时间',        value: fmtHMS(rec.duration),                 cls: 'big' },
      { label: rec.missionType === 'survival' ? '生存轮次' : '轮 / 波次', value: String(rec.rounds), cls: '' },
      { label: '敌人负荷比',  value: rec.sparsity.toFixed(2),              cls: '' },
      { label: '期望生息',      value: rec.essence.fullBuffTotal.toFixed(3), cls: 'accent' },
      { label: '生息速率 / 小时', value: rec.essence.fullBuffPerHour.toFixed(1), cls: '' },
    ];
    metrics.forEach(({ label, value, cls }) => {
      const cell = U.el('div', 'stat ' + cls);
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
      });
    }

    /* ─── 效率指标（生息 / 击杀 / 综合熟练度）─── */
    const effBox = U.el('div', 'arb-eff-box');
    effBox.appendChild(U.el('div', 'section-title', '效率指标'));
    const effGrid = U.el('div', 'arb-eff-grid');
    const baseHint = rec.essBaselineIsNode
      ? `相对本节点历史最高 ${rec.essBaseline.toFixed(1)}/时 换算`
      : `相对默认基准 ${(rec.essBaseline || 600).toFixed(0)}/时 换算（本节点暂无人上传战绩）`;
    effBar(effGrid, '生息效率', eff.essence,
      `生息速率 ${rec.essence.fullBuffPerHour.toFixed(1)}/时 · ${baseHint}（权重 55%）`);
    effBar(effGrid, '清图效率', eff.clear != null ? eff.clear : 50,
      eff.clear != null
        ? `场上≥15只敌人的时间占比 ${(100 - eff.clear).toFixed(1)}%，越低越好（权重 25%）`
        : '采样数据不足，本维度以 50 分中性值计入（权重 25%）');
    effBar(effGrid, '击杀效率', eff.kill != null ? eff.kill : 50,
      eff.kill != null
        ? `累计击杀 / 总敌人生成 = ${eff.kill.toFixed(1)}%（权重 20%）`
        : '数据不足，本维度以 50 分中性值计入（权重 20%）');
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
        title: '敌人击杀速率（每分钟，近似）',
        rows: pm.rows.map((r) => ({ label: 'M' + r.minute, pct: pm.maxKilled > 0 ? r.killed / pm.maxKilled * 100 : 0, right: r.killed + ' 个' })),
        footer: '由生成数与活跃监控数的净变化反推，非直接日志字段，仅供参考走势',
      });
    }
    if (rec.dist && rec.dist.saturation) {
      const sat = rec.dist.saturation;
      distBars(distWrap, {
        title: '清图效率',
        rows: sat.rows.map((r) => ({ label: r.hi == null ? r.lo + '+' : `${r.lo}-${r.hi}`, pct: r.pct, right: r.seconds.toFixed(1) + 's' })),
        footer: `高压占比（≥15）：${sat.geq15Pct.toFixed(1)}%`,
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
      ['生息速率 / 小时',  `${e.fullBuffPerHour.toFixed(1)}`],
      ['生息速率 / 分钟',  `${e.fullBuffPerMin.toFixed(2)}`],
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
      ['生息效率（55%）', '把期望生息 ÷ 任务时长换算成生息速率（每小时全 Buff 产出），再除以节点基准，得到这里的百分比。基准优先取该节点的历史最高生息速率（不同节点天然产出节奏不同，不能用同一数字硬套）；某节点暂无人上传过战绩时，退回默认基准 600/时。达到节点历史最高 = 100%，超过则可突破 100%，属顶尖水平。'],
      ['清图效率（25%）', '依据房主日志中每次敌人生成行的 MonitoredTicking 字段采样，统计全场中场上同时受 AI 监控的活跃敌人数 ≥15 的时间占比（geq15Pct），取 100 − geq15Pct 作为得分。清图越干净、场上高压时段越少，这项得分越高。完全来自日志内采样，不依赖任何外部基准。'],
      ['击杀效率（20%）', '利用每分钟切片数据：击杀数 ≈ 本分钟新增生成数 − 本分钟末活跃监控数相对上分钟末的净变化，对全程各分钟求和得到累计近似击杀数，再除以总敌人生成数（maxSpawned），得到全局消灭率百分比。反映生成的敌人有多大比例被及时清理；仅依赖日志数据，近似推算，供参考走势。若数据不足则以 50 分中性值占位。'],
    ].forEach(([k, v]) => {
      const d = U.el('div', 'arb-def-row');
      d.appendChild(U.el('span', 'arb-def-key', k));
      d.appendChild(U.el('span', 'arb-def-val', v));
      defWrap.appendChild(d);
    });
    explain.appendChild(defWrap);

    explain.appendChild(U.el('div', 'arb-explain-sub', '综合评分 ＝ 0.55×生息效率 + 0.25×清图效率 + 0.20×击杀效率，上限 120 分。清图与击杀两项完全由日志推算，不依赖外部排行榜数据，确保节点基准数据缺失时评分仍具参考价值。'));
    const scaleRows = [
      ['101 - 120', '巅峰',  '生息超出节点历史最高，且清图与击杀效率同样出色，属顶尖水平'],
      ['80 - 100',  '优秀',  '三维均衡发展，产出稳定、清图流畅、击杀率高，属高效队伍'],
      ['70 - 79',   '良好',  '整体表现不错，某一维度仍有明显提升空间'],
      ['60 - 69',   '及格',  '达到基本效率，某维度偏弱拉低了整体'],
      ['0 - 59',    '待提升', '三维中有一项或多项明显偏低，建议优化配装、走位或击杀节奏'],
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
