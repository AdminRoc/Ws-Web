window.WF = window.WF || {};

WF.generalView = (function () {
  const U = WF.utils;

  // ── ECharts 实例管理（仿中断分页：重渲染前 dispose 旧实例，防泄漏） ──
  const activeCharts = [];
  let currentResizeHandler = null;
  function clearCharts() {
    const GC = WF.generalCharts;
    for (const c of activeCharts) {
      if (GC) GC.dispose(c);
      else if (c && typeof c.dispose === 'function') { try { c.dispose(); } catch (e) { /* 忽略 */ } }
    }
    activeCharts.length = 0;
    if (currentResizeHandler) {
      window.removeEventListener('resize', currentResizeHandler);
      currentResizeHandler = null;
    }
  }
  function pushChart(c) { if (c) activeCharts.push(c); }

  // 挂载一张 ECharts 全宽图（仿中断 _mountChart：chart-box 外壳+标题+副标题+先挂载后 init）。
  // echarts 不可用或工厂返回 null 时移除外壳并返回 false，调用方据此回退手写 SVG 或跳过该区块。
  function _mountChart(container, title, sub, bodyCls, factory) {
    const GC = WF.generalCharts;
    if (!GC || !GC.isAvailable()) return false;
    const box = U.el('div', 'chart-box dis-tl-wrap');
    box.appendChild(U.el('div', 'dis-tl-title', title));
    if (sub) box.appendChild(U.el('div', 'dis-tl-sub', sub));
    const body = U.el('div', 'dis-chart-body' + (bodyCls ? ' ' + bodyCls : ''));
    box.appendChild(body);
    container.appendChild(box); // 先挂载，确保 echarts.init 时容器有宽度
    const chart = factory(body);
    if (!chart) { container.removeChild(box); return false; }
    pushChart(chart);
    return true;
  }

  // 段数组归一化（waves.index / survivalSegs.tier / interSegs.round → no），供敌量曲线 markLine/markArea 使用
  function _normSegs(segs) {
    if (!Array.isArray(segs)) return [];
    return segs.map(sg => ({
      startT:     sg && sg.startT,
      endT:       sg && sg.endT,
      no:         (sg && (sg.index != null ? sg.index : (sg.tier != null ? sg.tier : sg.round))) || null,
      incomplete: !!(sg && sg.incomplete),
    }));
  }

  // 开局时长 = openingEndT − startT（>0.5s 才展示）；撤离时间 = endT − 最后一段.endT
  //（仅当该段非 incomplete 且差值 >0.5s 才展示）
  function _openingDur(rec) {
    return (rec.openingEndT != null && rec.startT != null) ? rec.openingEndT - rec.startT : 0;
  }
  function _extractDur(rec, segs) {
    const last = Array.isArray(segs) && segs.length ? segs[segs.length - 1] : null;
    if (!last || last.incomplete || rec.endT == null || last.endT == null) return 0;
    return rec.endT - last.endT;
  }

  // 开局/撤离汇总行（复用中断 dis-extract-row / dis-opening-row 类；
  // 不可点击——通用分页没有时间轴区块可跳，故不加 dis-row-link 与点击跳转）
  function _boundaryRow(kind, dur, desc, nCols) {
    const tr = U.el('tr', kind === 'opening' ? 'dis-extract-row dis-opening-row' : 'dis-extract-row');
    tr.appendChild(U.el('td', 'td-idx', kind === 'opening' ? '开局' : '撤离'));
    tr.appendChild(U.el('td', 'td-mono', U.fmtDuration(dur)));
    tr.appendChild(U.el('td', 'td-mono', '—'));
    if (nCols > 3) {
      const td = U.el('td', '', desc);
      if (nCols > 4) td.colSpan = nCols - 3; // 描述文字合并占据剩余数据列，保持列数对齐
      tr.appendChild(td);
    }
    return tr;
  }

  function summary(rec) {
    const loc = rec.locationDisplay || rec.locationNode || '';
    return {
      title: `${rec.missionTypeCN}  ${rec.missionName !== '—' ? rec.missionName : (loc || '')}`,
      sub:   U.fmtDurationLong(rec.totalDuration) + (loc ? `  ｜  ${loc}` : ''),
    };
  }

  function render(container, rec, clock) {
    clearCharts();
    container.innerHTML = '';

    // ── 专用视图委托（仲裁/中断/夜灵/蜘蛛 → 复用各自分页完整渲染）──
    // 这四类任务在通用分页内直接调用专属视图的 render()，不重复渲染基础标头
    if (rec.type === 'arbitration' && WF.arbitrationView) {
      WF.arbitrationView.render(container, rec, clock);
      gotoPostCommon(container, rec, []);
      return;
    }
    if (rec.type === 'disruption' && WF.disruptionView) {
      WF.disruptionView.render(container, rec, clock);
      gotoPostCommon(container, rec, []);
      return;
    }
    if (rec.type === 'eidolon' && WF.eidolonView) {
      WF.eidolonView.render(container, rec, clock);
      gotoPostCommon(container, rec, []);
      return;
    }
    if (rec.type === 'profitTaker' && WF.profitTakerView) {
      WF.profitTakerView.render(container, rec, clock);
      gotoPostCommon(container, rec, []);
      return;
    }

    // ── 以下为所有非专用任务类型的通用渲染路径 ─────────────────────

    // ── 1. 任务标头（核心一览） ──────────────────────────────────
    const hero = U.el('div', 'hero-row');
    hero.appendChild(_st('任务模式', rec.missionTypeCN, 'accent'));
    if (rec.missionName && rec.missionName !== '—') {
      hero.appendChild(_st('任务名称', rec.missionName, ''));
    }
    hero.appendChild(_st('总时长', U.fmtDurationLong(rec.totalDuration), 'big'));
    const locLabel = rec.locationDisplay || rec.locationNode;
    if (locLabel) hero.appendChild(_st('任务节点', locLabel, ''));
    if (rec.frameDuration != null) {
      hero.appendChild(_st('首帧→尾帧', U.fmtDurationLong(rec.frameDuration), ''));
    }
    // 击杀估算卡：killEvents 为房主日志的间接推算值，无数据显示「—」
    const killEvents = Array.isArray(rec.killEvents) ? rec.killEvents : [];
    hero.appendChild(_st('击杀估算', killEvents.length > 0 ? String(killEvents.length) : '—', '',
      '击杀数为房主日志的间接推算值，非游戏内确切数字'));
    container.appendChild(hero);

    // ── 2. 队伍成员 ──────────────────────────────────────────────
    WF.squadMixin.renderSquad(container, rec);

    // ── 3. 时间节点详情 ──────────────────────────────────────────
    const timingBox = U.el('div', 'gen-timing-box');
    timingBox.appendChild(U.el('div', 'gen-timing-title', '时间节点'));
    const timingGrid = U.el('div', 'gen-timing-grid');

    // 优先用记录自带的精确日期（多会话场景），回退到全局 clock
    const _recDate = (t, recDate) => recDate || (clock && clock.available ? clock.toDate(t) : null);
    const approx = clock ? clock.approx : true;
    {
      const absDate = _recDate(rec.startT, rec.startDate);
      if (absDate) {
        _timingRow(timingGrid, '任务开始时刻',
          U.fmtAbsTime(absDate, approx),
          '由日志内 Current time 行换算的实际时钟时间，精度约 ±1s');
      }
      if (rec.firstFrameT != null) {
        const ffDate = _recDate(rec.firstFrameT, rec.firstFrameDate);
        if (ffDate) {
          _timingRow(timingGrid, '首帧时刻',
            U.fmtAbsTime(ffDate, approx),
            'HUD REDUX 首次渲染（载入完成 UI 就绪）的实际时刻');
        }
      }
      const endDate = _recDate(rec.endT, rec.endDate);
      if (endDate) {
        _timingRow(timingGrid, '尾帧时刻',
          U.fmtAbsTime(endDate, approx),
          'EOM 结算信号触发时刻（任务成功/提取屏出现瞬间）');
      }
    }

    _timingRow(timingGrid, '任务总时长',
      U.fmtDurationLong(rec.totalDuration),
      'SS_STARTED → EOM 触发，与游戏结算界面显示数字一致');

    if (rec.firstFrameT != null) {
      const ffOffset = rec.firstFrameT - rec.startT;
      _timingRow(timingGrid, '首帧偏移（相对任务计时起点）',
        (ffOffset >= 0 ? '+' : '') + U.fmtDuration(ffOffset),
        'HUD REDUX 首次渲染相对 SS_STARTED 的偏移；通常 ≤ 0.1s，可能略负');
    }
    if (rec.frameDuration != null) {
      _timingRow(timingGrid, '首帧 → 尾帧时差',
        U.fmtDurationLong(rec.frameDuration),
        '尾帧时刻 − 首帧时刻，最接近"按下第一个键→成功屏弹出"的体感时长');
    }

    timingBox.appendChild(timingGrid);
    container.appendChild(timingBox);

    // ── 4. 无尽任务段表 / 击杀概况 ─────────────────────────────
    const hasWaves    = rec.waves      && rec.waves.length      > 0;
    const hasSurvival = rec.survivalSegs && rec.survivalSegs.length > 0;
    const hasInter    = rec.interSegs  && rec.interSegs.length  > 0;
    const hasKillData = rec.spawned > 0;

    // 段表渲染：defense/waves → 防御表，survivalSegs → 生存表，interSegs → 拦截表
    if (hasWaves) {
      _renderWaveSection(container, rec);
    } else if (hasSurvival) {
      _renderSurvivalSection(container, rec);
    } else if (hasInter) {
      _renderInterceptionSection(container, rec);
    } else if (hasKillData) {
      _renderKillSummary(container, rec);
    }

    // P0 级增强图表：所有有 liveSamples 的无尽任务均挂载（defense/survival/interception
    // 在段表之后挂载；defection/excavation/endlessCapture/voidCascade/voidFlood/
    // voidArmageddon/alchemy/nethercells/feedTheTenno 等类型在段表兜底之后挂载）
    const hasLiveSamples = Array.isArray(rec.liveSamples) && rec.liveSamples.length > 0;
    if (hasLiveSamples) {
      _mountP0Charts(container, rec, rec.endlessType || 'general');
    }

    // ── 5. 通用后置内容（备注、对话记录、resize）───────────────────
    gotoPostCommon(container, rec, killEvents);
  }

  // ── 共用后置渲染逻辑（接收 render() 作用域变量） ──
  function gotoPostCommon(container, rec, killEvents) {
    // 备注
    const hasEstimate = (Array.isArray(rec.liveSamples) && rec.liveSamples.length > 0)
      || (killEvents && killEvents.length > 0);
    container.appendChild(U.el('div', 'note',
      '总时长 = SS_STARTED → EOM，与游戏结算界面一致。' +
      '首帧 = HUD REDUX 首次渲染。尾帧 = 最先触发的 EOM 信号。' +
      '波次/轮次时间为各段独立耗时+累计。生成（近似）来自 OnAgentCreated，已过滤宠物/目标实体。' +
      (hasEstimate ? '敌量/击杀为房主日志的间接推算值。' : '')));

    // 对话记录
    WF.chatMixin.renderChatLog(container, rec);

    // 窗口尺寸变化时重绘全部 ECharts（仿中断分页）
    currentResizeHandler = () => { for (const c of activeCharts) if (c && c.resize) c.resize(); };
    window.addEventListener('resize', currentResizeHandler);

    // 初次渲染后重置所有 ECharts 尺寸
    requestAnimationFrame(() => {
      for (const c of activeCharts) if (c && c.resize) c.resize();
    });
  }

  // ── P0 级增强图表挂载（非仲裁、非中断的无尽任务）─────────────────
  function _mountP0Charts(container, rec, mode) {
    // mode: 'defense' | 'survival' | 'interception'
    const GC = WF.generalCharts;
    if (!GC || !GC.isAvailable()) return;

    // 1) 任务时间轴总览（每分钟：平均/峰值活跃敌人、生成数、击杀数）
    _mountChart(container, '任务时间轴总览',
      '青色面积 = 每分钟平均活跃敌人，绿色散点 = 每分钟生成数，琥珀柱 = 每分钟击杀数，红色虚线 = 段边界',
      'gen-tl-body', (body) => GC.timelineOverview(body, rec));

    // 2) 清图压力趋势（高压线随分模式画像动态）
    _mountChart(container, '清图压力趋势',
      '青色面积 = 平均活跃敌人，洋红虚线 = 最大活跃敌人，青色柱 = 估算清图量，红色虚线 = 高压线',
      'gen-pressure-body', (body) => GC.pressureTrendChart(body, rec));

    // 3) 高压恢复时间线
    const p = GC.pressureOf ? GC.pressureOf(rec) : { recovery: 10 };
    _mountChart(container, '高压恢复时间线',
      `每次场上活跃敌人从≥${p.recovery}恢复到<${p.recovery}所花费的时间。颜色越绿越快，越红越慢。`,
      'gen-recovery-body', (body) => GC.recoveryTimeline(body, rec));

    // 4) 清图效率分布（ECharts 横向条形图）
    _mountChart(container, '清图效率',
      `横轴为活跃敌人数区间，柱长为驻留时间占比。高压占比（≥${(GC.pressureOf ? GC.pressureOf(rec) : { high: 12 }).high}）：见页脚`,
      'gen-live-dist-body', (body) => GC.liveDistChart(body, rec));

    // 5) 刷怪数量期望表（Defense/镜像防御：waveBudgets 有数据时显示）
    if ((mode === 'defense' || mode === 'loopDefense') && rec.waveBudgets && rec.waveBudgets.length > 0) {
      _mountChart(container, '刷怪数量期望表',
        '双柱并排 = 每波理论预算（青色）vs 实际生成数（琥珀色），绿色折线 = 达成率。Tier 分界线标注敌人等级档位升级点。达成率低于 95% 说明放置失败率偏高。',
        'gen-wave-budget-body', (body) => GC.waveBudgetChart(body, rec));
    }
  }

  // ── 防御 / 镜像防御 波次表 ─────────────────────────────────
  function _renderWaveSection(container, rec) {
    const isLoop    = rec.endlessType === 'loopDefense';
    const waveLbl   = isLoop ? '波次（镜像防御）' : '波次详情';
    const waveNoun  = isLoop ? '波' : '波';
    const segTotal  = rec.waves.length;

    const section = U.el('div', 'gen-section');
    section.appendChild(U.el('div', 'gen-section-title',
      `${waveLbl}（共 ${segTotal} ${waveNoun}）`));

    const totalKills   = rec.waves.reduce((s, w) => s + (w.kills || 0), 0);
    const totalSpawned = rec.waves.reduce((s, w) => s + (w.actualSpawned || w.totalEnemies || w.spawned || 0), 0);
    const avgDur       = rec.waves.reduce((s, w) => s + (w.duration || 0), 0) / segTotal;
    const KILL_SPAWN_NOTE = 'EE.log 不会记录"某个敌人被谁击杀"这类具体事件，这里的击杀数不是直接读出来的，'
      + '而是用"该波次生成总数 − 波次结束时仍剩余未消灭的数量"反推出来的，只对防御/波次类任务有效。'
      + '"生成"数取自房主日志里 WaveDefend 上报的该波次生成总数，理论上应与游戏内一致，但如果日志不是从任务最开始记录的，数字可能偏低。'
      + '所以这两个数字都是尽量贴近真实情况的估算值，不等同于游戏结算界面里的确切数字。';
    const statRow = U.el('div', 'hero-row');
    statRow.appendChild(_st('总波次', String(segTotal), 'accent'));
    statRow.appendChild(_st('波均时长', U.fmtDuration(avgDur), ''));
    if (totalKills > 0 || totalSpawned > 0)
      statRow.appendChild(_st('总击杀 / 生成', `${totalKills} / ${totalSpawned}`, '', KILL_SPAWN_NOTE));
    section.appendChild(statRow);

    // 每波时长图：优先 ECharts 挂载（ECharts 不可用时回退手写 SVG，统计行与表格不受影响）
    const durMounted = _mountChart(section, '每波时长概览',
      '横轴为波次，柱高为该波耗时；悬停查看波次/耗时/击杀',
      'gen-dur-body',
      (body) => WF.generalCharts.segDurationChart(body, rec.waves, {
        noun:    waveNoun,
        labelOf: (w) => (w && w.index != null) ? w.index : '?',
        killsOf: (w) => (w && typeof w.kills === 'number') ? w.kills : null,
      }));
    if (!durMounted) {
      // ── 回退：手写 SVG 时长条形图 ──
      const maxDur = Math.max(...rec.waves.map(w => w.duration || 0), 1);
      const barH = 8, barGap = 3, svgW = 760;
      const svgH = segTotal * (barH + barGap);
      let svg = `<svg viewBox="0 0 ${svgW} ${svgH}" height="${svgH}" class="round-chart" preserveAspectRatio="none">`;
      rec.waves.forEach((w, i) => {
        const bw = Math.max(2, ((w.duration || 0) / maxDur) * (svgW - 60));
        const y  = i * (barH + barGap);
        const sp = w.actualSpawned || w.totalEnemies || w.spawned || 0;
        svg += `<rect x="50" y="${y}" width="${bw}" height="${barH}" rx="2" fill="#3a8ba0">` +
          `<title>第 ${w.index} 波：${U.fmtDuration(w.duration)} | 击杀 ${w.kills} / 生成 ${sp}</title></rect>`;
        if (i % 5 === 4 || i === 0)
          svg += `<text x="44" y="${y + barH}" class="bar-label" text-anchor="end">${w.index}</text>`;
      });
      svg += '</svg>';
      const chartBox = U.el('div', 'chart-box');
      chartBox.innerHTML = '<div style="font-size:12px;color:var(--c-text2);margin-bottom:6px;letter-spacing:1px;">每波时长概览</div>' + svg;
      section.appendChild(chartBox);
      _addBarTooltip(chartBox, rec.waves);
    }

    // ── 场上敌量曲线（有 liveSamples 才渲染；ECharts 不可用时整块跳过） ──
    _mountChart(section, '场上敌量曲线',
      '场上同时存在的敌人数，取自房主日志生成采样；红色竖带为 Stalker 入侵时段',
      'gen-live-body',
      (body) => WF.generalCharts.liveCountChart(body, rec, _normSegs(rec.waves)));

    // 波次进程总览表
    const tblBox = U.el('div', 'chart-box dis-tl-wrap');
    tblBox.appendChild(U.el('div', 'dis-tl-title', '防御任务进程总览'));
    const tbl = U.el('table', 'round-table gen-round-table');
    const totalEnemiesCol = rec.waves.some(w => w.totalEnemies) ? '<th>波次敌人上限</th>' : '';
    const nCols = 4 + (totalEnemiesCol ? 1 : 0);
    tbl.innerHTML = `<thead><tr><th>波次</th><th>波次耗时</th><th>累计耗时</th><th>击杀 / 生成</th>${totalEnemiesCol}</tr></thead>`;
    const tbody = U.el('tbody');

    // ── 开局时长行：openingEndT − startT（任务开始 → 击杀首个敌人），仅 >0.5s 时显示 ──
    const openingDur = _openingDur(rec);
    if (openingDur > 0.5) tbody.appendChild(_boundaryRow('opening', openingDur, '击杀首个敌人', nCols));

    let cumulative = 0;
    rec.waves.forEach((w, index) => {
      cumulative += w.duration || 0;
      const isLast = (index === rec.waves.length - 1);
      const trClass = isLast ? 'gen-last-row' : (w.incomplete ? 'gen-incomplete-row' : '');
      const tr = U.el('tr', trClass);
      tr.appendChild(U.el('td', 'td-idx', String(w.index) + (w.incomplete && !isLast ? '（未打完）' : '')));
      tr.appendChild(U.el('td', 'td-mono', w.duration != null ? U.fmtDuration(w.duration) : '—'));
      tr.appendChild(U.el('td', 'td-mono', U.fmtDurationLong(cumulative)));
      const sp = w.actualSpawned || w.totalEnemies || w.spawned || 0;
      const killCell = U.el('td', 'td-mono');
      killCell.textContent = `${w.kills} / ${sp}`;
      if (w.kills < sp) killCell.style.color = 'var(--c-text2)';
      tr.appendChild(killCell);
      if (totalEnemiesCol) {
        const teCell = U.el('td', 'td-mono');
        teCell.textContent = w.totalEnemies ? String(w.totalEnemies) : '—';
        tr.appendChild(teCell);
      }
      tbody.appendChild(tr);
    });

    // ── 撤离时间行：endT − 最后一波 endT（仅当该波非 incomplete 且差值 >0.5s 时显示） ──
    const extractDur = _extractDur(rec, rec.waves);
    if (extractDur > 0.5) tbody.appendChild(_boundaryRow('extract', extractDur, '撤离成功', nCols));

    tbl.appendChild(tbody);
    tblBox.appendChild(tbl);
    const waveFoot = U.el('div', 'gen-table-foot has-tip',
      '击杀数由"生成总数 − 剩余未消灭数量"反推得出，生成数取自房主日志字段，均为估算值，非游戏内确切数字');
    waveFoot.title = KILL_SPAWN_NOTE;
    tblBox.appendChild(waveFoot);
    section.appendChild(tblBox);
    container.appendChild(section);
  }

  // ── 生存 轮次/档位表 ──────────────────────────────────────
  function _renderSurvivalSection(container, rec) {
    const segs = rec.survivalSegs;
    const section = U.el('div', 'gen-section');
    section.appendChild(U.el('div', 'gen-section-title',
      `生存奖励档次（共 ${segs.length} 档）`));

    const totalDur     = segs.reduce((s, sg) => s + (sg.duration || 0), 0);
    const totalSpawned = segs.reduce((s, sg) => s + (sg.spawned  || 0), 0);
    const avgDur       = totalDur / segs.length;
    const hasSpawnData = totalSpawned > 0;   // false on client logs (no OnAgentCreated)
    const hasSegKills  = segs.some(sg => typeof (sg && sg.kills) === 'number'); // 段级击杀（房主日志推算）
    const SURVIVAL_SPAWN_NOTE = '生存任务没有"剩余敌人数"这类可用于反推击杀数的信号，所以这里只统计"生成数"，不显示击杀数。'
      + '生成数取自房主日志里 OnAgentCreated 事件的敌人生成记录，理论上应与游戏内一致，'
      + '但如果日志不是从任务最开始记录的，或者部分敌人生成时未被日志捕捉到，数字会比实际偏低，'
      + '标"近似"是提醒这不是绝对精确值。';

    const statRow = U.el('div', 'hero-row');
    statRow.appendChild(_st('奖励档数',   String(segs.length),          'accent'));
    statRow.appendChild(_st('档均时长',   U.fmtDuration(avgDur),        ''));
    statRow.appendChild(_st('生存总时长', U.fmtDurationLong(totalDur),  ''));
    if (hasSpawnData)
      statRow.appendChild(_st('本局生成（近似）', String(totalSpawned), '', SURVIVAL_SPAWN_NOTE));
    section.appendChild(statRow);

    if (!hasSpawnData) {
      const hint = U.el('div', 'gen-hint');
      hint.textContent = '生成数据需要主机日志（OnAgentCreated）；客户端日志无此信息。';
      section.appendChild(hint);
    }

    // 每档时长图：优先 ECharts 挂载（ECharts 不可用时回退手写 SVG）
    const durMounted = _mountChart(section, '每档时长概览',
      '横轴为奖励档，柱高为该档耗时；悬停查看档次/耗时/击杀',
      'gen-dur-body',
      (body) => WF.generalCharts.segDurationChart(body, segs, {
        noun:    '档',
        labelOf: (sg) => (sg && sg.tier != null) ? sg.tier : '?',
        killsOf: (sg) => (sg && typeof sg.kills === 'number') ? sg.kills : null,
      }));
    if (!durMounted) {
      // ── 回退：手写 SVG 时长条形图（每档可视化） ──
      const maxDur = Math.max(...segs.map(sg => sg.duration || 0), 1);
      const barH = 8, barGap = 3, svgW = 760;
      const svgH = segs.length * (barH + barGap);
      let svg = `<svg viewBox="0 0 ${svgW} ${svgH}" height="${svgH}" class="round-chart" preserveAspectRatio="none">`;
      segs.forEach((sg, i) => {
        const bw = Math.max(2, ((sg.duration || 0) / maxDur) * (svgW - 60));
        const y  = i * (barH + barGap);
        const spawnTip = hasSpawnData ? ` | 生成 ${sg.spawned || 0}` : '';
        svg += `<rect x="50" y="${y}" width="${bw}" height="${barH}" rx="2" fill="#3a8ba0">` +
          `<title>第 ${sg.tier} 档：${U.fmtDuration(sg.duration)}${spawnTip}</title></rect>`;
        svg += `<text x="44" y="${y + barH}" class="bar-label" text-anchor="end">${sg.tier}</text>`;
      });
      svg += '</svg>';
      const chartBox = U.el('div', 'chart-box');
      chartBox.innerHTML = '<div style="font-size:12px;color:var(--c-text2);margin-bottom:6px;letter-spacing:1px;">每档时长概览</div>' + svg;
      section.appendChild(chartBox);
    }

    // ── 场上敌量曲线（有 liveSamples 才渲染；ECharts 不可用时整块跳过） ──
    _mountChart(section, '场上敌量曲线',
      '场上同时存在的敌人数，取自房主日志生成采样；红色竖带为 Stalker 入侵时段',
      'gen-live-body',
      (body) => WF.generalCharts.liveCountChart(body, rec, _normSegs(segs)));

    // 生存进程总览表
    const tblBox = U.el('div', 'chart-box dis-tl-wrap');
    tblBox.appendChild(U.el('div', 'dis-tl-title', '生存任务进程总览'));
    const tbl = U.el('table', 'round-table gen-round-table');
    const killTh  = hasSegKills  ? '<th>击杀</th>' : '';
    const spawnTh = hasSpawnData ? '<th>生成（近似）</th>' : '';
    const nCols = 3 + (hasSegKills ? 1 : 0) + (hasSpawnData ? 1 : 0);
    tbl.innerHTML = `<thead><tr><th>档次</th><th>段落耗时</th><th>累计耗时</th>${killTh}${spawnTh}</tr></thead>`;
    const tbody = U.el('tbody');

    // ── 开局时长行：openingEndT − startT（任务开始 → 击杀首个敌人），仅 >0.5s 时显示 ──
    const openingDur = _openingDur(rec);
    if (openingDur > 0.5) tbody.appendChild(_boundaryRow('opening', openingDur, '击杀首个敌人', nCols));

    let cumulative = 0;
    segs.forEach((sg, index) => {
      cumulative += sg.duration || 0;
      const isLast = (index === segs.length - 1);
      const trClass = isLast ? 'gen-last-row' : (sg.incomplete ? 'gen-incomplete-row' : '');
      const tr = U.el('tr', trClass);
      tr.appendChild(U.el('td', 'td-idx',  `第 ${sg.tier} 档` + (sg.incomplete && !isLast ? '（未打完）' : '')));
      tr.appendChild(U.el('td', 'td-mono', sg.duration != null ? U.fmtDuration(sg.duration) : '—'));
      tr.appendChild(U.el('td', 'td-mono', U.fmtDurationLong(cumulative)));
      if (hasSegKills) {
        const killTd = U.el('td', 'td-mono');
        killTd.textContent = typeof sg.kills === 'number' ? String(sg.kills) : '—';
        tr.appendChild(killTd);
      }
      if (hasSpawnData) {
        const spawnTd = U.el('td', 'td-mono');
        spawnTd.textContent = String(sg.spawned || 0);
        tr.appendChild(spawnTd);
      }
      tbody.appendChild(tr);
    });

    // ── 撤离时间行：endT − 最后一档 endT（仅当该档非 incomplete 且差值 >0.5s 时显示） ──
    const extractDur = _extractDur(rec, segs);
    if (extractDur > 0.5) tbody.appendChild(_boundaryRow('extract', extractDur, '撤离成功', nCols));

    tbl.appendChild(tbody);
    tblBox.appendChild(tbl);
    if (hasSpawnData) {
      const survFoot = U.el('div', 'gen-table-foot has-tip',
        '生存任务无法反推击杀数（没有"剩余敌人数"信号），"生成"取自日志采样，为估算值');
      survFoot.title = SURVIVAL_SPAWN_NOTE;
      tblBox.appendChild(survFoot);
    }
    section.appendChild(tblBox);
    container.appendChild(section);
  }

  // ── 拦截 轮次表 ────────────────────────────────────────────
  function _renderInterceptionSection(container, rec) {
    const segs = rec.interSegs;
    const section = U.el('div', 'gen-section');
    section.appendChild(U.el('div', 'gen-section-title',
      `拦截轮次（共 ${segs.length} 轮）`));

    const totalDur = segs.reduce((s, sg) => s + (sg.duration || 0), 0);
    const avgDur   = totalDur / segs.length;
    const hasSegKills = segs.some(sg => typeof (sg && sg.kills) === 'number'); // 段级击杀（房主日志推算）
    const statRow  = U.el('div', 'hero-row');
    statRow.appendChild(_st('完成轮次', String(segs.length), 'accent'));
    statRow.appendChild(_st('轮均时长', U.fmtDuration(avgDur), ''));
    statRow.appendChild(_st('拦截总时长', U.fmtDurationLong(totalDur), ''));
    section.appendChild(statRow);

    // 每轮时长图：优先 ECharts 挂载（ECharts 不可用时回退手写 SVG）
    const durMounted = _mountChart(section, '每轮时长概览',
      '横轴为轮次，柱高为该轮耗时；悬停查看轮次/耗时/击杀',
      'gen-dur-body',
      (body) => WF.generalCharts.segDurationChart(body, segs, {
        noun:    '轮',
        labelOf: (sg) => (sg && sg.round != null) ? sg.round : '?',
        killsOf: (sg) => (sg && typeof sg.kills === 'number') ? sg.kills : null,
      }));
    if (!durMounted) {
      // ── 回退：手写 SVG 时长条形图 ──
      const maxDur = Math.max(...segs.map(sg => sg.duration || 0), 1);
      const barH = 8, barGap = 3, svgW = 760;
      const svgH = segs.length * (barH + barGap);
      let svg = `<svg viewBox="0 0 ${svgW} ${svgH}" height="${svgH}" class="round-chart" preserveAspectRatio="none">`;
      segs.forEach((sg, i) => {
        const bw = Math.max(2, ((sg.duration || 0) / maxDur) * (svgW - 60));
        const y  = i * (barH + barGap);
        svg += `<rect x="50" y="${y}" width="${bw}" height="${barH}" rx="2" fill="#3a8ba0">` +
          `<title>第 ${sg.round} 轮：${U.fmtDuration(sg.duration)}</title></rect>`;
        svg += `<text x="44" y="${y + barH}" class="bar-label" text-anchor="end">${sg.round}</text>`;
      });
      svg += '</svg>';
      const chartBox = U.el('div', 'chart-box');
      chartBox.innerHTML = '<div style="font-size:12px;color:var(--c-text2);margin-bottom:6px;letter-spacing:1px;">每轮时长概览</div>' + svg;
      section.appendChild(chartBox);
    }

    // ── 场上敌量曲线（有 liveSamples 才渲染；ECharts 不可用时整块跳过） ──
    _mountChart(section, '场上敌量曲线',
      '场上同时存在的敌人数，取自房主日志生成采样；红色竖带为 Stalker 入侵时段',
      'gen-live-body',
      (body) => WF.generalCharts.liveCountChart(body, rec, _normSegs(segs)));

    // 拦截进程总览表
    const tblBox = U.el('div', 'chart-box dis-tl-wrap');
    tblBox.appendChild(U.el('div', 'dis-tl-title', '拦截任务进程总览'));
    const tbl = U.el('table', 'round-table gen-round-table');
    const killTh = hasSegKills ? '<th>击杀</th>' : '';
    const nCols = 3 + (hasSegKills ? 1 : 0);
    tbl.innerHTML = `<thead><tr><th>轮次</th><th>轮次耗时</th><th>累计耗时</th>${killTh}</tr></thead>`;
    const tbody = U.el('tbody');

    // ── 开局时长行：openingEndT − startT（任务开始 → 击杀首个敌人），仅 >0.5s 时显示 ──
    const openingDur = _openingDur(rec);
    if (openingDur > 0.5) tbody.appendChild(_boundaryRow('opening', openingDur, '击杀首个敌人', nCols));

    let cumulative = 0;
    segs.forEach((sg, index) => {
      cumulative += sg.duration || 0;
      const isLast = (index === segs.length - 1);
      const trClass = isLast ? 'gen-last-row' : (sg.incomplete ? 'gen-incomplete-row' : '');
      const tr = U.el('tr', trClass);
      tr.appendChild(U.el('td', 'td-idx', `第 ${sg.round} 轮` + (sg.incomplete && !isLast ? '（未打完）' : '')));
      tr.appendChild(U.el('td', 'td-mono', sg.duration != null ? U.fmtDuration(sg.duration) : '—'));
      tr.appendChild(U.el('td', 'td-mono', U.fmtDurationLong(cumulative)));
      if (hasSegKills) {
        const killTd = U.el('td', 'td-mono');
        killTd.textContent = typeof sg.kills === 'number' ? String(sg.kills) : '—';
        tr.appendChild(killTd);
      }
      tbody.appendChild(tr);
    });

    // ── 撤离时间行：endT − 最后一轮 endT（仅当该轮非 incomplete 且差值 >0.5s 时显示） ──
    const extractDur = _extractDur(rec, segs);
    if (extractDur > 0.5) tbody.appendChild(_boundaryRow('extract', extractDur, '撤离成功', nCols));

    tbl.appendChild(tbody);
    tblBox.appendChild(tbl);
    section.appendChild(tblBox);
    container.appendChild(section);
  }

  // ── 单轮任务敌人生成概况 ─────────────────────────────────
  function _renderKillSummary(container, rec) {
    const killSection = U.el('div', 'gen-section');
    killSection.appendChild(U.el('div', 'gen-section-title', '敌人生成概况'));
    const killRow = U.el('div', 'hero-row');
    if (rec.spawned > 0) {
      killRow.appendChild(_st('生成（近似）', String(rec.spawned), 'accent',
        'EE.log 不会记录"某个敌人被谁击杀"这类具体事件，所以这里不展示确切击杀数，只统计生成数。'
        + '生成数取自房主日志里 OnAgentCreated 事件，理论上应与游戏内一致，但如果日志不是从任务最开始记录的，'
        + '或部分敌人生成时未被日志捕捉到，数字会比实际偏低，标"近似"是提醒这不是绝对精确值。'
        + '仅防御/波次类任务能用"生成 − 剩余"这个思路间接推算出击杀数，其余任务类型没有这类信号，只能展示生成数。'));
    } else {
      killRow.appendChild(_st('生成（近似）', '—（需主机日志）', '',
        '生成数据依赖房主日志里的 OnAgentCreated 事件；如果读取的是客户端（非房主）日志，没有这项信息，故无法显示。'));
    }
    killSection.appendChild(killRow);
    container.appendChild(killSection);
  }

  // ── 共用组件 ──────────────────────────────────────────────
  function _st(label, value, cls, title) {
    const d = U.el('div', 'stat ' + (cls || ''));
    if (title) { d.title = title; d.classList.add('has-tip'); }
    d.appendChild(U.el('div', 'stat-value', value));
    d.appendChild(U.el('div', 'stat-label', label));
    return d;
  }

  function _timingRow(grid, label, value, hint) {
    const row = U.el('div', 'gen-timing-row');
    row.appendChild(U.el('span', 'gen-timing-label', label));
    const valEl = U.el('span', 'gen-timing-val', value);
    if (hint) valEl.title = hint;
    row.appendChild(valEl);
    if (hint) row.appendChild(U.el('span', 'gen-timing-hint', hint));
    grid.appendChild(row);
  }

  // ── 条形图悬浮 tooltip（ECharts 不可用时的手写 SVG 回退路径使用） ──
  function _addBarTooltip(container, waves) {
    const svg = container.querySelector('svg.round-chart');
    if (!svg || !waves.length) return;

    const tt = U.el('div', 'chart-bar-tooltip');
    container.appendChild(tt);

    const rects = svg.querySelectorAll('rect');
    rects.forEach((rect, i) => {
      if (i >= waves.length) return;
      const w = waves[i];
      const sp = w.actualSpawned || w.totalEnemies || w.spawned || 0;
      const label = `第 ${w.index} 波：${U.fmtDuration(w.duration)} | 击杀 ${w.kills} / 生成 ${sp}`;
      rect.addEventListener('mouseenter', () => {
        tt.textContent = label;
        tt.classList.add('visible');
      });
      rect.addEventListener('mousemove', e => {
        tt.style.left = (e.clientX + 12) + 'px';
        tt.style.top  = (e.clientY - 28) + 'px';
      });
      rect.addEventListener('mouseleave', () => {
        tt.classList.remove('visible');
      });
    });
  }

  return { render, summary };
})();
