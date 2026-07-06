/* 仲裁详情视图
 * 布局：综合评分徽章 + 任务元信息 + 核心指标网格 + 效率指标 +
 *       三张分布图（敌人饱和度 / 无人机真空期 / 无人机连续生成） +
 *       赋灵母液计算细项 + 分数带说明 */
window.WF = window.WF || {};

WF.arbitrationView = (function () {
  const U = WF.utils;
  const BASE_DROP = 0.06, EXTRA_PER_ROUND = 1.3;

  // 秒 → "Xh Ym Zs" / "Ym Zs" / "Zs"
  function fmtHMS(sec) {
    if (sec == null || isNaN(sec)) return '-';
    sec = Math.max(0, Math.floor(sec));
    const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
    if (h > 0) return `${h}h ${m}m ${s}s`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  }
  // 分数带 → 徽章配色类
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

  // ── 通用横向分布条 ──
  function distBars(container, opts) {
    // opts: { title, en, rows:[{label, pct, right}], footer }
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
      // 按比例着色：高占比偏绿，低占比偏黄/红
      const hue = 120 * Math.min(1, r.pct / maxPct);
      fill.style.background = `hsl(${hue}, 70%, 52%)`;
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

    /* ─── 顶行：综合评分徽章 + 任务元信息 ─── */
    const topRow = U.el('div', 'arb-top-row');

    const badge = U.el('div', 'arb-score-badge ' + tierClass(rec.score));
    badge.appendChild(U.el('div', 'arb-score-num', String(rec.score)));
    badge.appendChild(U.el('div', 'arb-score-sub', '/ 120'));
    badge.appendChild(U.el('div', 'arb-score-tier', rec.scoreTier || ''));
    badge.title = `满 Buff 期望母液 / 小时：${rec.essence.fullBuffPerHour.toFixed(1)}`;
    topRow.appendChild(badge);

    const meta = U.el('div', 'arb-meta');
    const titleParts = [rec.node, rec.planet, rec.missionTypeName, rec.factionZh].filter(Boolean);
    meta.appendChild(U.el('div', 'arb-meta-title', titleParts.join(' · ')));

    const metaSubs = [
      `任务时长 ${fmtHMS(rec.duration)}（${U.fmtDurationLong(rec.duration)}）`,
      rec.rounds > 0 ? `${rec.missionType === 'survival' ? '生存轮次' : '轮/波次'} ${rec.rounds}` : null,
      rec.nodeId ? `节点 ID：${rec.nodeId}` : null,
      !rec.complete ? '（未检测到完整结算，时长为估算值）' : null,
    ].filter(Boolean);
    metaSubs.forEach((s) => meta.appendChild(U.el('div', 'arb-meta-sub', s)));
    meta.appendChild(U.el('div', 'arb-grade-desc',
      `综合评分 ${rec.score} / 120 · ${rec.scoreTier}　（生息效率 ${rec.eff.essence.toFixed(1)}% · 击杀效率 ${rec.eff.kill.toFixed(1)}%）`));
    topRow.appendChild(meta);
    container.appendChild(topRow);

    WF.squadMixin.renderSquad(container, rec);

    /* ─── 核心指标网格 ─── */
    const grid = U.el('div', 'arb-metrics-grid');
    const metrics = [
      { label: '无人机生成',   value: String(rec.droneCount),           cls: 'accent' },
      { label: '敌人生成',     value: String(rec.maxSpawned),           cls: '' },
      { label: '无人机 / 分钟', value: rec.dronesPerMin.toFixed(2),      cls: '' },
      { label: '总时间',       value: fmtHMS(rec.duration),             cls: 'big' },
      { label: rec.missionType === 'survival' ? '生存轮次' : '轮 / 波次', value: String(rec.rounds), cls: '' },
      { label: '无人机稀疏度', value: rec.sparsity.toFixed(2),          cls: '' },
      { label: '期望生息',     value: rec.essence.fullBuffTotal.toFixed(3), cls: 'accent' },
      { label: '生息效率 / 小时', value: rec.essence.fullBuffPerHour.toFixed(1), cls: '' },
    ];
    metrics.forEach(({ label, value, cls }) => {
      const cell = U.el('div', 'stat ' + cls);
      cell.appendChild(U.el('div', 'stat-value', value));
      cell.appendChild(U.el('div', 'stat-label', label));
      grid.appendChild(cell);
    });
    container.appendChild(grid);

    /* ─── 分布图区 ─── */
    const distWrap = U.el('div', 'arb-dist-wrap');

    // 敌人饱和度
    if (rec.dist && rec.dist.saturation) {
      const sat = rec.dist.saturation;
      distBars(distWrap, {
        title: '敌人饱和度', en: '存活',
        headRight: 'Max ' + sat.maxLive,
        rows: sat.rows.map((r) => ({
          label: r.hi == null ? r.lo + '+' : `${r.lo}-${r.hi}`,
          pct: r.pct, right: r.seconds.toFixed(1) + 's',
        })),
        footer: `≥15 占比：${sat.geq15Pct.toFixed(1)}%`,
      });
    }
    // 无人机真空期
    if (rec.dist && rec.dist.vacuum) {
      const vac = rec.dist.vacuum;
      distBars(distWrap, {
        title: '无人机真空期', en: '间隔(s)',
        headRight: '最长 ' + vac.maxGap.toFixed(1) + 's',
        rows: vac.rows.map((r) => ({
          label: r.hi == null ? r.lo + '+' : `${r.lo}-${r.hi}`,
          pct: r.pct, right: r.seconds.toFixed(1) + 's',
        })),
        footer: `>2s 占比：${vac.over2Pct.toFixed(1)}%`,
      });
    }
    // 无人机连续生成
    if (rec.dist && rec.dist.consecutive) {
      const con = rec.dist.consecutive;
      distBars(distWrap, {
        title: '无人机连续生成', en: '数量',
        rows: con.rows.map((r) => ({
          label: String(r.size), pct: r.pct, right: r.count + '次',
        })),
        footer: `共生成 ${con.totalBatches} 批次`,
      });
    }
    container.appendChild(distWrap);

    /* ─── 赋灵母液计算细项 ─── */
    const essBox = U.el('div', 'arb-ess-box');
    essBox.appendChild(U.el('div', 'section-title', '赋灵母液计算'));
    const essRows = [
      ['无人机贡献', `${rec.droneCount} × 6% = ${rec.essence.fromDrones.toFixed(2)}`],
      ['轮次贡献',   rec.rounds > 0 ? `${rec.rounds} × 1.3 = ${rec.essence.fromRounds.toFixed(2)}` : '—'],
      ['普通期望',   `${rec.essence.total.toFixed(3)}`],
      ['满 Buff 期望', `${rec.essence.fullBuffTotal.toFixed(3)}（无人机项 × 5.9 + 轮次项）`],
      ['Buff 组成', '蓝盒 ×2 · 富足 ×1.18 · 黄盒 ×2 · 祝福 ×1.25 = 5.9'],
      ['满 Buff / 小时', `${rec.essence.fullBuffPerHour.toFixed(1)}`],
      ['满 Buff / 分钟', `${rec.essence.fullBuffPerMin.toFixed(2)}`],
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

    /* ─── 分数带说明（本项目 0-120 评分标准）─── */
    const scaleBox = U.el('div', 'arb-scale-box');
    scaleBox.appendChild(U.el('div', 'section-title', '评分标准 · 0-120 分'));
    const scaleRows = [
      ['101 - 120', '巅峰', '满 Buff 生息效率与击杀效率俱佳'],
      ['80 - 100',  '优秀', '生息效率接近满配、击杀节奏良好'],
      ['70 - 79',   '良好', '产出稳定，仍有提升空间'],
      ['60 - 69',   '及格', '产出或击杀效率偏低'],
      ['0 - 59',    '待提升', '整体效率明显不足'],
    ];
    const scaleTable = U.el('div', 'arb-scale-rows');
    scaleRows.forEach(([range, tier, desc]) => {
      const row = U.el('div', 'arb-scale-row' + (tier === rec.scoreTier ? ' cur' : ''));
      row.appendChild(U.el('span', 'arb-scale-range', range));
      row.appendChild(U.el('span', 'arb-scale-tier', tier));
      row.appendChild(U.el('span', 'arb-scale-desc', desc));
      scaleTable.appendChild(row);
    });
    scaleBox.appendChild(scaleTable);
    container.appendChild(scaleBox);

    container.appendChild(U.el('div', 'note',
      '无人机、敌人生成、存活饱和度、轮次结算均取自房主（Host）本地日志的对应字段；' +
      '综合评分由「满 Buff 生息效率（相对 600/小时）」与「击杀效率（由稀疏度换算）」加权得出，映射到 0-120 分。'));

    WF.chatMixin.renderChatLog(container, rec);
  }

  return { render, summary };
})();
