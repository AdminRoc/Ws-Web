/* 仲裁详情视图
 * 布局（自上而下，信息层层递进）：
 *   综合评分徽章 + 任务标题/元信息 + 熟练度三指标概览
 *   → 队伍成员 → 核心指标网格 → 效率指标（生息/击杀/熟练度）
 *   → 三张分布图（敌人饱和度 / 无人机真空期 / 无人机连续生成）
 *   → 生息计算细项 → 评分说明 → 对话记录 */
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

  // 通用横向分布条组
  function distBars(container, opts) {
    const box = U.el('div', 'arb-dist');
    const hd = U.el('div', 'arb-dist-hd');
    hd.appendChild(U.el('span', 'arb-dist-title', opts.title));
    if (opts.en) hd.appendChild(U.el('span', 'arb-dist-en', opts.en));
    if (opts.headRight) hd.appendChild(U.el('span', 'arb-dist-max', opts.headRight));
    box.appendChild(hd);
    const maxPct = Math.max(1, ...opts.rows.map((r) => r.pct));
    opts.rows.forEach((r) => {
      const row = U.el('div', 'arb-bar-row');
      row.appendChild(U.el('span', 'arb-bar-label', r.label));
      const track = U.el('div', 'arb-bar-track');
      const fill = U.el('div', 'arb-bar-fill' + (r.pct > 0 ? '' : ' zero'));
      fill.style.width = (r.pct / maxPct * 100).toFixed(1) + '%';
      const hue = 120 * Math.min(1, r.pct / maxPct);
      fill.style.background = `hsl(${hue}, 72%, 52%)`;
      track.appendChild(fill);
      row.appendChild(track);
      row.appendChild(U.el('span', 'arb-bar-pct', r.pct.toFixed(1) + '%'));
      if (r.right != null) row.appendChild(U.el('span', 'arb-bar-right', r.right));
      box.appendChild(row);
    });
    if (opts.footer) box.appendChild(U.el('div', 'arb-dist-foot', opts.footer));
    container.appendChild(box);
  }

  function render(container, rec) {
    container.innerHTML = '';
    const eff = rec.eff || { essence: 0, kill: 0, proficiency: 0 };

    /* ─── 顶行：综合评分徽章 + 任务元信息 ─── */
    const topRow = U.el('div', 'arb-top-row');

    const badge = U.el('div', 'arb-score-badge ' + tierClass(rec.score));
    badge.appendChild(U.el('div', 'arb-score-num', String(rec.score)));
    badge.appendChild(U.el('div', 'arb-score-sub', '/ 120'));
    badge.appendChild(U.el('div', 'arb-score-tier', rec.scoreTier || ''));
    badge.title = `熟练度 ${eff.proficiency.toFixed(1)}%`;
    topRow.appendChild(badge);

    const meta = U.el('div', 'arb-meta');
    const titleParts = [rec.node, rec.planet, rec.missionTypeName, rec.factionZh].filter(Boolean);
    meta.appendChild(U.el('div', 'arb-meta-title', titleParts.join(' · ')));
    const metaSubs = [
      `任务时长 ${fmtHMS(rec.duration)}（${U.fmtDurationLong(rec.duration)}）`,
      rec.rounds > 0 ? `${rec.missionType === 'survival' ? '生存轮次' : '轮/波次'} ${rec.rounds}` : null,
      [rec.node, rec.nodeId].filter(Boolean).length ? `节点 ${rec.node || '—'}（${rec.nodeId || '未知 ID'}）` : null,
      !rec.complete ? '（未检测到完整结算，时长为估算值）' : null,
    ].filter(Boolean);
    metaSubs.forEach((s) => meta.appendChild(U.el('div', 'arb-meta-sub', s)));
    meta.appendChild(U.el('div', 'arb-grade-desc',
      `熟练度 ${eff.proficiency.toFixed(1)}% ＝ 生息效率 ${eff.essence.toFixed(1)}% × 0.6 ＋ 击杀效率 ${eff.kill.toFixed(1)}% × 0.4`));
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
      { label: '无人机稀疏度',  value: rec.sparsity.toFixed(2),              cls: '' },
      { label: '期望生息',      value: rec.essence.fullBuffTotal.toFixed(3), cls: 'accent' },
      { label: '生息效率 / 小时', value: rec.essence.fullBuffPerHour.toFixed(1), cls: '' },
    ];
    metrics.forEach(({ label, value, cls }) => {
      const cell = U.el('div', 'stat ' + cls);
      cell.appendChild(U.el('div', 'stat-value', value));
      cell.appendChild(U.el('div', 'stat-label', label));
      grid.appendChild(cell);
    });
    container.appendChild(grid);

    /* ─── 效率指标（生息 / 击杀 / 熟练度）─── */
    const effBox = U.el('div', 'arb-eff-box');
    effBox.appendChild(U.el('div', 'section-title', '效率指标'));
    const effGrid = U.el('div', 'arb-eff-grid');
    effBar(effGrid, '生息效率', eff.essence, `期望生息/小时 ${rec.essence.fullBuffPerHour.toFixed(1)} · 相对 600/时 基准`);
    effBar(effGrid, '击杀效率', eff.kill, `由稀疏度 ${rec.sparsity.toFixed(2)} 换算 · 越低越高`);
    effBar(effGrid, '熟练度',   eff.proficiency, '生息效率与击杀效率的综合');
    effBox.appendChild(effGrid);
    container.appendChild(effBox);

    /* ─── 分布图区 ─── */
    const distWrap = U.el('div', 'arb-dist-wrap');
    if (rec.dist && rec.dist.saturation) {
      const sat = rec.dist.saturation;
      distBars(distWrap, {
        title: '敌人饱和度', en: '存活',
        headRight: 'Max ' + sat.maxLive,
        rows: sat.rows.map((r) => ({ label: r.hi == null ? r.lo + '+' : `${r.lo}-${r.hi}`, pct: r.pct, right: r.seconds.toFixed(1) + 's' })),
        footer: `≥15 占比：${sat.geq15Pct.toFixed(1)}%`,
      });
    }
    if (rec.dist && rec.dist.vacuum) {
      const vac = rec.dist.vacuum;
      distBars(distWrap, {
        title: '无人机真空期', en: '间隔(s)',
        headRight: '最长 ' + vac.maxGap.toFixed(1) + 's',
        rows: vac.rows.map((r) => ({ label: r.hi == null ? r.lo + '+' : `${r.lo}-${r.hi}`, pct: r.pct, right: r.seconds.toFixed(1) + 's' })),
        footer: `>2s 占比：${vac.over2Pct.toFixed(1)}%`,
      });
    }
    if (rec.dist && rec.dist.consecutive) {
      const con = rec.dist.consecutive;
      distBars(distWrap, {
        title: '无人机连续生成', en: '数量',
        rows: con.rows.map((r) => ({ label: String(r.size), pct: r.pct, right: r.count + '次' })),
        footer: `共生成 ${con.totalBatches} 批次`,
      });
    }
    container.appendChild(distWrap);

    /* ─── 生息计算细项 ─── */
    const essBox = U.el('div', 'arb-ess-box');
    essBox.appendChild(U.el('div', 'section-title', '生息计算'));
    const e = rec.essence;
    const essRows = [
      ['无人机生成（总）', `${rec.droneCount}`],
      ['无人机基础期望',   `${rec.droneCount} × 6% = ${e.fromDrones.toFixed(2)}`],
      ['无人机掉落倍率',   `×${e.buffMul.toFixed(2)}（蓝盒 ×2 · 富足 ×1.18 · 黄盒 ×2 · 祝福 ×1.25）`],
      ['无人机期望生息',   `${e.droneFullBuff.toFixed(3)}`],
      ['轮次奖励期望',     rec.rounds > 0 ? `保底 ${e.roundGuarantee.toFixed(1)} ＋ 额外 ${e.roundExtra.toFixed(1)} = ${e.fromRounds.toFixed(2)}` : '—'],
      ['期望生息（合计）', `${e.fullBuffTotal.toFixed(3)}`],
      ['生息效率 / 小时',  `${e.fullBuffPerHour.toFixed(1)}`],
      ['生息效率 / 分钟',  `${e.fullBuffPerMin.toFixed(2)}`],
    ];
    const essTable = U.el('div', 'arb-ess-rows');
    essRows.forEach(([k, v]) => {
      const row = U.el('div', 'arb-ess-row');
      row.appendChild(U.el('span', 'arb-ess-key', k));
      row.appendChild(U.el('span', 'arb-ess-val', v));
      essTable.appendChild(row);
    });
    essBox.appendChild(essTable);
    container.appendChild(essBox);

    /* ─── 评分说明 ─── */
    const explain = U.el('div', 'arb-explain');
    explain.appendChild(U.el('div', 'section-title', '评分说明'));

    const defWrap = U.el('div', 'arb-explain-defs');
    [
      ['生息效率', '期望生息 ÷ 任务时长换算成每小时产出，再相对 600/小时 的高标准基准取达成度。反映单位时间的生息产出速度。'],
      ['击杀效率', '由无人机稀疏度（敌人生成 ÷ 无人机生成）换算。稀疏度越低，说明每只磁盾无人机对应的杂兵越少、火力越集中在无人机上，击杀越干净利落。'],
      ['熟练度',   '生息效率与击杀效率的加权综合（生息 60% ＋ 击杀 40%），衡量队伍整体的走位、节奏与击杀手法，是决定综合评分的核心指标。'],
    ].forEach(([k, v]) => {
      const d = U.el('div', 'arb-def-row');
      d.appendChild(U.el('span', 'arb-def-key', k));
      d.appendChild(U.el('span', 'arb-def-val', v));
      defWrap.appendChild(d);
    });
    explain.appendChild(defWrap);

    explain.appendChild(U.el('div', 'arb-explain-sub', '综合评分 ＝ 熟练度映射到 0-120 分'));
    const scaleRows = [
      ['101 - 120', '巅峰',  '生息与击杀俱佳，接近或达到顶尖水平'],
      ['80 - 100',  '优秀',  '产出稳定且击杀干净，属高效队伍'],
      ['70 - 79',   '良好',  '整体表现不错，细节仍可打磨'],
      ['60 - 69',   '及格',  '达到基本效率，产出或击杀存在明显短板'],
      ['0 - 59',    '待提升', '效率偏低，建议优化配装、站位或击杀节奏'],
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
      '无人机、敌人生成、存活饱和度、轮次结算均取自房主（Host）本地日志对应字段；轮次结算不足 1 分钟的记录已自动排除。'));
    container.appendChild(explain);

    WF.chatMixin.renderChatLog(container, rec);
  }

  return { render, summary };
})();
