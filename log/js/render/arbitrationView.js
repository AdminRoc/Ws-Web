/* 仲裁详情视图
 * 布局（自上而下，信息层层递进）：
 *   综合评分徽章 + 任务标题/元信息（主机时长 + 队内在场时长）+ 熟练度速览
 *   → 队伍成员 → 核心指标网格 → 每轮明细（可展开）→ 效率指标（生息/击杀/熟练度）
 *   → 三张分布图（清图效率 / 无人机刷新间隔 / 无人机刷新连续度）
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

    const durRow = U.el('div', 'arb-meta-sub');
    durRow.appendChild(document.createTextNode('主机时长 ' + fmtHMS(rec.duration) + `（${U.fmtDurationLong(rec.duration)}）`));
    meta.appendChild(durRow);
    if (rec.lastClientDuration != null) {
      const cliRow = U.el('div', 'arb-meta-sub arb-meta-hint');
      cliRow.appendChild(document.createTextNode('队内在场时长 ' + fmtHMS(rec.lastClientDuration) + `（${U.fmtDurationLong(rec.lastClientDuration)}）`));
      cliRow.title = '取各队伍成员对应网络连接"最后一次同步诊断"时间戳中最早的一个：只要有一名成员早于房主停止稳定在场（例如提前挂机/退出），这里就会先于主机时长停止推进，反映"全员仍在场farm"的实际窗口。';
      cliRow.classList.add('has-tip');
      meta.appendChild(cliRow);
    }
    const metaSubs = [
      rec.rounds > 0 ? `${rec.missionType === 'survival' ? '生存轮次' : '轮/波次'} ${rec.rounds}` : null,
      [rec.node, rec.nodeId].filter(Boolean).length ? `节点 ${rec.node || '—'}（${rec.nodeId || '未知 ID'}）` : null,
      !rec.complete ? '（未检测到完整结算，时长为估算值）' : null,
    ].filter(Boolean);
    metaSubs.forEach((s) => meta.appendChild(U.el('div', 'arb-meta-sub', s)));
    meta.appendChild(U.el('div', 'arb-grade-desc',
      `熟练度 ${eff.proficiency.toFixed(1)}% ／ 生息效率 ${eff.essence.toFixed(1)}% ・ 击杀效率 ${eff.kill.toFixed(1)}%`));
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

    /* ─── 效率指标（生息 / 击杀 / 熟练度）─── */
    const effBox = U.el('div', 'arb-eff-box');
    effBox.appendChild(U.el('div', 'section-title', '效率指标'));
    const effGrid = U.el('div', 'arb-eff-grid');
    effBar(effGrid, '生息效率', eff.essence, `期望生息/小时 ${rec.essence.fullBuffPerHour.toFixed(1)} · 相对基准换算`);
    effBar(effGrid, '击杀效率', eff.kill, `由稀疏度 ${rec.sparsity.toFixed(2)} 换算 · 越低越高`);
    effBar(effGrid, '熟练度',   eff.proficiency, '生息效率与击杀效率的综合');
    effBox.appendChild(effGrid);
    container.appendChild(effBox);

    /* ─── 分布图区（赛博风） ─── */
    const distWrap = U.el('div', 'arb-dist-wrap');
    if (rec.dist && rec.dist.saturation) {
      const sat = rec.dist.saturation;
      distBars(distWrap, {
        title: '清图效率',
        headRight: 'Max ' + sat.maxLive,
        rows: sat.rows.map((r) => ({ label: r.hi == null ? r.lo + '+' : `${r.lo}-${r.hi}`, pct: r.pct, right: r.seconds.toFixed(1) + 's' })),
        footer: `高压占比（≥15）：${sat.geq15Pct.toFixed(1)}%`,
      });
    }
    if (rec.dist && rec.dist.vacuum) {
      const vac = rec.dist.vacuum;
      distBars(distWrap, {
        title: '无人机刷新间隔',
        headRight: '最长 ' + vac.maxGap.toFixed(1) + 's',
        rows: vac.rows.map((r) => ({ label: r.hi == null ? r.lo + '+' : `${r.lo}-${r.hi}`, pct: r.pct, right: r.seconds.toFixed(1) + 's' })),
        footer: `>2s 占比：${vac.over2Pct.toFixed(1)}%`,
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
      ['生息效率 / 小时',  `${e.fullBuffPerHour.toFixed(1)}`],
      ['生息效率 / 分钟',  `${e.fullBuffPerMin.toFixed(2)}`],
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
      ['生息效率', '期望生息 ÷ 任务时长换算成每小时产出，相对一个恒定的高标准基准（600/小时，本项目暂无排行榜数据、故长期沿用此基准）取达成度。基准的 60% 记 0 分、达到基准记 100 分，中间用凸曲线过渡——越接近基准，每一分进步换来的得分越多；超过基准后曲线继续外推，允许突破 100%。'],
      ['击杀效率', '由无人机稀疏度（敌人生成 ÷ 无人机生成）换算。稀疏度 20 记 0 分、5 记 100 分，同样是凸曲线过渡，越逼近满分越陡；低于 5 可突破 100%。稀疏度越低，说明火力越集中在无人机身上、杂兵清理越干净利落。'],
      ['熟练度',   '生息效率与击杀效率并非简单加权平均，而是按各自权重做"弹性替代"合成——任一项明显偏低都会拉低整体，兼顾发展的队伍得分会高于单项突出但另一项拖后腿的队伍；合成值最后经一条平滑曲线拉伸成百分比（低分段压缩、越接近满分提升越明显），两项都达到 100% 时熟练度精确为 100%。'],
    ].forEach(([k, v]) => {
      const d = U.el('div', 'arb-def-row');
      d.appendChild(U.el('span', 'arb-def-key', k));
      d.appendChild(U.el('span', 'arb-def-val', v));
      defWrap.appendChild(d);
    });
    explain.appendChild(defWrap);

    explain.appendChild(U.el('div', 'arb-explain-sub', '综合评分 ＝ 熟练度 × 1.2，映射到 0-120 分（为顶尖表现留出"超出满分"的展示空间）'));
    const scaleRows = [
      ['101 - 120', '巅峰',  '生息与击杀俱佳，两项均接近或突破基准，属顶尖水平'],
      ['80 - 100',  '优秀',  '产出稳定且击杀干净，两项均衡发展，属高效队伍'],
      ['70 - 79',   '良好',  '整体表现不错，某一项仍有明显提升空间'],
      ['60 - 69',   '及格',  '达到基本效率，产出或击杀效率有一项偏弱'],
      ['0 - 59',    '待提升', '两项效率均偏低，建议优化配装、走位或击杀节奏'],
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
      '无人机、敌人生成、清图效率、轮次结算均取自房主（Host）本地日志对应字段；轮次结算不足 1 分钟的记录已自动排除。' +
      '受限于客户端日志的记录范围，任务实际结算获得的生息精华数量无法被读取——本页展示的"生息"均为按掉落规则推算出的统计期望值，并非实际到手数量。'));
    container.appendChild(explain);

    WF.chatMixin.renderChatLog(container, rec);
  }

  return { render, summary };
})();
