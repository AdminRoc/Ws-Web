window.WF = window.WF || {};

WF.disruptionView = (function () {
  const U = WF.utils;

  function summary(rec) {
    const avgRound = rec.totalDuration / rec.roundCount;
    return {
      title: `中断 ${rec.roundCount} 轮${rec.name ? ' · ' + rec.name : ''}`,
      sub: `${U.fmtDurationLong(rec.totalDuration)} ｜ 平均每轮 ${U.fmtDuration(avgRound)}`,
    };
  }

  function render(container, rec) {
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

    // ── 每轮耗时条形图（概览） ────────────────────────────────
    const maxDur = Math.max(...rec.rounds.map(r => r.duration));
    const barH = 6, gap = 2, w = 760;
    const h = rec.rounds.length * (barH + gap);
    let svg = `<svg viewBox="0 0 ${w} ${h}" height="${h}" class="round-chart" style="max-width:${w}px">`;
    svg += _svgDefs();
    rec.rounds.forEach((r, i) => {
      const bw  = Math.max(2, (r.duration / maxDur) * (w - 60));
      const y   = i * (barH + gap);
      const ok  = r.conduits.length === 0 || r.conduits.every(c => c.success);
      svg += `<rect x="50" y="${y}" width="${bw}" height="${barH}" rx="2" class="${ok ? 'bar-ok' : 'bar-fail'}"><title>第 ${r.index} 轮：${U.fmtDuration(r.duration)}</title></rect>`;
      if (i % 5 === 4 || i === 0) svg += `<text x="44" y="${y + barH}" class="bar-label" text-anchor="end">${r.index}</text>`;
    });
    svg += '</svg>';
    const chartBox = U.el('div', 'chart-box dis-tl-wrap');
    chartBox.appendChild(U.el('div', 'dis-tl-title', '每轮耗时概览'));
    chartBox.appendChild(U.el('div', 'dis-tl-sub', '每条横条对应一轮，长度 = 本轮耗时；青蓝色为本轮导管全部守住，红色为存在失守'));
    const chartSvg = U.el('div');
    chartSvg.innerHTML = svg;
    chartBox.appendChild(chartSvg);
    container.appendChild(chartBox);

    // ── 击杀走势折线图（点击全屏） ───────────────────────────
    container.appendChild(_buildKillChart(rec));

    // ── 场上敌量曲线（无采样数据则不渲染） ───────────────────
    const liveChart = _buildLiveChart(rec);
    if (liveChart) container.appendChild(liveChart);

    // ── 每轮前10秒击杀数 ─────────────────────────────────────
    container.appendChild(_buildOpeningKillsChart(rec));

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

    container.appendChild(U.el('div', 'note',
      '折线图可点击全屏查看；悬停标记可见精确时间戳。'));

    WF.chatMixin.renderChatLog(container, rec);

    // ── 逐轮导管时间轴（全页最下方，聊天记录之后） ───────────
    container.appendChild(_buildConduitTimeline(rec));
  }

  // ── SVG 字符串构建（纯函数，W 可变，供全屏缩放重渲染） ──────
  function _buildChartSvgStr(rec, W) {
    const H = 400;
    const start = rec.startT;
    const dur   = rec.totalDuration;

    const killTimes = (rec.killEvents || [])
      .map(t => t - start)
      .filter(t => t >= 0 && t <= dur)
      .sort((a, b) => a - b);
    const totalKills = killTimes.length;

    const insertEvts = [];
    const doneEvts   = [];
    rec.rounds.forEach(r => {
      r.conduits.forEach(c => {
        if (c.insertT != null) {
          const relT = c.insertT - start;
          if (relT >= 0) insertEvts.push({ relT, round: r.index, artNum: c.artNum, effectKind: c.effectKind, effectId: c.effectId });
        }
        if (c.doneT != null) {
          const relT = c.doneT - start;
          if (relT >= 0) doneEvts.push({ relT, round: r.index, success: c.success, artNum: c.artNum, effectKind: c.effectKind, effectId: c.effectId });
        }
      });
    });

    const ML = 72, MR = 24, MT = 36;
    const plotH = 210;
    const plotW = W - ML - MR;
    const xAxisY  = MT + plotH;
    const stripY   = xAxisY + 30;
    const insRowY  = stripY + 12;
    const doneRowY = stripY + 36;
    const legendY  = stripY + 62;

    const tx = relT => ML + Math.min(plotW, Math.max(0, (relT / dur) * plotW));
    const ty = k    => xAxisY - (totalKills > 0 ? (k / totalKills) * plotH : 0);

    const niceX = [15, 30, 60, 120, 300, 600];
    const tickX = niceX.find(n => n >= dur / 18) || 600;
    const niceY = [5, 10, 20, 25, 50, 100, 200, 250, 500, 1000];
    const tickY = totalKills > 0 ? (niceY.find(n => n >= totalKills / 8) || 1000) : 10;

    let s = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" style="display:block;font-family:inherit">`;

    s += `<rect x="${ML}" y="${MT}" width="${plotW}" height="${plotH}" fill="rgba(255,255,255,0.015)" rx="2"/>`;

    rec.rounds.forEach(r => {
      const x = tx(r.startT - start).toFixed(1);
      s += `<line x1="${x}" y1="${MT}" x2="${x}" y2="${xAxisY}" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>`;
    });
    rec.rounds
      .filter((r, i) => i === 0 || r.index % 5 === 0)
      .forEach(r => {
        const x = tx(r.startT - start).toFixed(1);
        s += `<text x="${x}" y="${MT - 5}" fill="var(--c-text2)" font-size="9" text-anchor="middle">R${r.index}</text>`;
      });

    for (let k = tickY; k <= totalKills + tickY; k += tickY) {
      const y = ty(k);
      if (y < MT - 2) break;
      s += `<line x1="${ML}" y1="${y.toFixed(1)}" x2="${(ML + plotW).toFixed(1)}" y2="${y.toFixed(1)}" stroke="rgba(255,255,255,0.07)" stroke-width="1" stroke-dasharray="4,4"/>`;
      s += `<text x="${(ML - 6).toFixed(1)}" y="${(y + 4).toFixed(1)}" fill="var(--c-text2)" font-size="10" text-anchor="end">${k}</text>`;
    }

    if (killTimes.length > 0) {
      let d = `M ${ML.toFixed(1)},${xAxisY.toFixed(1)}`;
      let k = 0;
      for (const relT of killTimes) {
        k++;
        d += ` H ${tx(relT).toFixed(1)} V ${ty(k).toFixed(1)}`;
      }
      d += ` H ${(ML + plotW).toFixed(1)}`;
      s += `<path d="${d} V ${xAxisY.toFixed(1)} Z" fill="rgba(65,255,142,0.07)" stroke="none"/>`;
      s += `<path d="${d}" fill="none" stroke="#41ff8e" stroke-width="1.5" stroke-linejoin="round"/>`;
      s += `<text x="${(W - 3).toFixed(1)}" y="${(ty(totalKills) - 7).toFixed(1)}" fill="#41ff8e" font-size="10" text-anchor="end" dominant-baseline="middle">${totalKills}</text>`;
    }

    s += `<line x1="${ML}" y1="${xAxisY}" x2="${(ML + plotW).toFixed(1)}" y2="${xAxisY}" stroke="rgba(255,255,255,0.25)" stroke-width="1"/>`;

    for (let t2 = 0; t2 <= dur + tickX * 0.5; t2 += tickX) {
      if (t2 > dur + 1) break;
      const x  = tx(t2).toFixed(1);
      const mm = Math.floor(t2 / 60);
      const ss = String(Math.floor(t2 % 60)).padStart(2, '0');
      s += `<line x1="${x}" y1="${xAxisY}" x2="${x}" y2="${xAxisY + 5}" stroke="rgba(255,255,255,0.25)" stroke-width="1"/>`;
      s += `<text x="${x}" y="${xAxisY + 17}" fill="var(--c-text2)" font-size="10" text-anchor="middle">${mm}:${ss}</text>`;
    }

    s += `<line x1="${ML}" y1="${MT}" x2="${ML}" y2="${xAxisY}" stroke="rgba(255,255,255,0.25)" stroke-width="1"/>`;
    const ylx = ML - 52, yly = MT + plotH / 2;
    s += `<text transform="rotate(-90,${ylx},${yly})" x="${ylx}" y="${yly}" fill="var(--c-text2)" font-size="10" text-anchor="middle" dominant-baseline="middle">累计击杀数</text>`;
    s += `<line x1="${ML}" y1="${stripY + 2}" x2="${(ML + plotW).toFixed(1)}" y2="${stripY + 2}" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>`;
    s += `<text x="${ML - 4}" y="${insRowY + 4}" fill="#5bc8ff" font-size="9" text-anchor="end">插入</text>`;
    s += `<text x="${ML - 4}" y="${doneRowY + 4}" fill="var(--c-text2)" font-size="9" text-anchor="end">完成</text>`;

    insertEvts.forEach(ev => {
      const effLabel = ev.effectKind ? _conduitEffectLabel(ev) : '';
      const tip = `R${ev.round}${ev.artNum != null ? ' 导管' + ev.artNum : ''}${effLabel ? ' ' + effLabel : ''} 插入 +${U.fmtDuration(ev.relT)}`;
      const x  = tx(ev.relT);
      const x1 = x.toFixed(1), x2 = (x - 4).toFixed(1), x3 = (x + 4).toFixed(1);
      const y1 = (insRowY - 7).toFixed(1), y23 = (insRowY + 5).toFixed(1);
      s += `<polygon points="${x1},${y1} ${x2},${y23} ${x3},${y23}" fill="#5bc8ff" opacity="0.85"><title>${tip}</title></polygon>`;
    });

    doneEvts.forEach(ev => {
      const x   = tx(ev.relT).toFixed(1);
      const col = _conduitColor(ev);
      const lbl = ev.success === true ? '守卫成功' : ev.success === false ? '守卫失败' : '结果未知';
      const effLabel = ev.effectKind ? _conduitEffectLabel(ev) : '';
      const tip = `R${ev.round}${ev.artNum != null ? ' 导管' + ev.artNum : ''}${effLabel ? ' ' + effLabel : ''} ${lbl} +${U.fmtDuration(ev.relT)}`;
      s += `<circle cx="${x}" cy="${doneRowY}" r="4.5" fill="${col}" opacity="0.82"><title>${tip}</title></circle>`;
    });

    const lx = ML;
    s += `<rect x="${lx}" y="${legendY}" width="18" height="2.5" rx="1" fill="#41ff8e"/>`;
    s += `<text x="${lx + 22}" y="${legendY + 10}" fill="var(--c-text2)" font-size="10">击杀累计折线</text>`;
    s += `<polygon points="${lx+105},${legendY-1} ${lx+101},${legendY+11} ${lx+109},${legendY+11}" fill="#5bc8ff" opacity="0.85"/>`;
    s += `<text x="${lx + 114}" y="${legendY + 10}" fill="var(--c-text2)" font-size="10">钥匙插入</text>`;
    s += `<circle cx="${lx + 210}" cy="${legendY + 5}" r="4.5" fill="#41ff8e" opacity="0.82"/>`;
    s += `<text x="${lx + 220}" y="${legendY + 10}" fill="var(--c-text2)" font-size="10">守卫成功</text>`;
    s += `<circle cx="${lx + 278}" cy="${legendY + 5}" r="4.5" fill="#ff5f6b" opacity="0.82"/>`;
    s += `<text x="${lx + 288}" y="${legendY + 10}" fill="var(--c-text2)" font-size="10">守卫失败</text>`;
    s += `<circle cx="${lx + 346}" cy="${legendY + 5}" r="4.5" fill="#ffd700" opacity="0.82"/>`;
    s += `<text x="${lx + 356}" y="${legendY + 10}" fill="var(--c-text2)" font-size="10">危险Buff效果</text>`;
    s += `</svg>`;

    const tipData = { ML, MT, plotH, plotW, xAxisY, W, dur, killTimes, totalKills, roundCount: rec.roundCount };
    return { svgStr: s, tipData };
  }

  // ── 击杀走势折线图构建（小图容器 + 全屏入口） ────────────────
  function _buildKillChart(rec) {
    const pxPerMin = 50;
    const baseW = Math.max(1400, Math.ceil(rec.totalDuration / 60) * pxPerMin + 120);
    const { svgStr, tipData } = _buildChartSvgStr(rec, baseW);

    const section = U.el('div', 'chart-box dis-tl-wrap');
    section.appendChild(U.el('div', 'dis-tl-title', '击杀走势 · 全程累计折线 + 导管事件时间轴'));

    const hint = U.el('div', 'dis-chart-hint', '▸ 点击图表查看全屏（支持 Ctrl+滚轮 缩放）');
    hint.style.cssText = 'margin-bottom:8px';
    section.appendChild(hint);

    const scroll = U.el('div', 'dis-chart-zoom');
    scroll.style.cssText = 'overflow-x:auto;padding-bottom:6px';
    scroll.innerHTML = svgStr;

    _addKillChartInteractivity(scroll.querySelector('svg'), tipData);
    scroll.addEventListener('click', () => _showFullscreen(rec, baseW));
    section.appendChild(scroll);

    return section;
  }

  // ── 折线图交互提示（二分查找 + SVG crosshair） ────────────
  function _addKillChartInteractivity(svgEl, td) {
    if (!svgEl || td.killTimes.length === 0) return;
    const ns = 'http://www.w3.org/2000/svg';
    const ktimes = td.killTimes;

    // 二分查找：时间 t 时的累计击杀数
    function bisect(t) {
      let lo = 0, hi = ktimes.length;
      while (lo < hi) { const m = (lo + hi) >> 1; if (ktimes[m] <= t) lo = m + 1; else hi = m; }
      return lo;
    }
    const txFn = relT => td.ML + Math.min(td.plotW, Math.max(0, (relT / td.dur) * td.plotW));
    const tyFn = k    => td.xAxisY - (td.totalKills > 0 ? (k / td.totalKills) * td.plotH : 0);

    // Crosshair group
    const g = document.createElementNS(ns, 'g');
    g.style.pointerEvents = 'none'; g.style.display = 'none';

    const vline = document.createElementNS(ns, 'line');
    vline.setAttribute('stroke', 'rgba(255,255,255,0.3)');
    vline.setAttribute('stroke-width', '1');
    vline.setAttribute('stroke-dasharray', '4,3');
    g.appendChild(vline);

    const dot = document.createElementNS(ns, 'circle');
    dot.setAttribute('r', '4.5');
    dot.setAttribute('fill', '#41ff8e');
    dot.setAttribute('stroke', 'rgba(0,0,0,0.55)');
    dot.setAttribute('stroke-width', '1.5');
    g.appendChild(dot);

    const bg = document.createElementNS(ns, 'rect');
    bg.setAttribute('rx', '3');
    bg.setAttribute('fill', 'rgba(4,5,12,0.88)');
    bg.setAttribute('stroke', 'rgba(255,255,255,0.14)');
    bg.setAttribute('stroke-width', '1');
    g.appendChild(bg);

    const txt = document.createElementNS(ns, 'text');
    txt.setAttribute('fill', 'rgba(255,255,255,0.92)');
    txt.setAttribute('font-size', '11');
    txt.setAttribute('font-family', 'monospace');
    g.appendChild(txt);

    svgEl.appendChild(g);

    // Transparent hit area over the plot region
    const hit = document.createElementNS(ns, 'rect');
    hit.setAttribute('x', String(td.ML));
    hit.setAttribute('y', String(td.MT));
    hit.setAttribute('width', String(td.plotW));
    hit.setAttribute('height', String(td.plotH));
    hit.setAttribute('fill', 'transparent');
    hit.style.cursor = 'crosshair';
    svgEl.appendChild(hit);

    hit.addEventListener('mousemove', e => {
      const rect = svgEl.getBoundingClientRect();
      // 始终用 viewBox 宽度作为 SVG 坐标空间，而非 width 属性（二者在缩放后可能不同）
      const svgW = (svgEl.viewBox && svgEl.viewBox.baseVal.width) || parseFloat(svgEl.getAttribute('width'));
      const scaleX = svgW / rect.width;
      const svgX = (e.clientX - rect.left) * scaleX;
      const relT = Math.max(0, Math.min(td.dur, ((svgX - td.ML) / td.plotW) * td.dur));
      const k    = bisect(relT);
      const mm   = String(Math.floor(relT / 60));
      const ss   = String(Math.floor(relT % 60)).padStart(2, '0');
      const label = `${mm}:${ss}  击杀 ${k}`;

      const lx = txFn(relT), ly = tyFn(k);
      vline.setAttribute('x1', String(lx)); vline.setAttribute('y1', String(td.MT));
      vline.setAttribute('x2', String(lx)); vline.setAttribute('y2', String(td.xAxisY));
      dot.setAttribute('cx', String(lx)); dot.setAttribute('cy', String(ly));

      const isRight = lx > svgW * 0.65;
      const anchor  = isRight ? 'end' : 'start';
      const tx2     = isRight ? lx - 7 : lx + 7;
      txt.setAttribute('x', String(tx2));
      txt.setAttribute('y', String(td.MT + 16));
      txt.setAttribute('text-anchor', anchor);
      txt.textContent = label;

      const bw = label.length * 6.6 + 10;
      const bx = isRight ? tx2 - bw + 4 : tx2 - 5;
      bg.setAttribute('x', String(bx)); bg.setAttribute('y', String(td.MT + 4));
      bg.setAttribute('width', String(bw)); bg.setAttribute('height', '17');

      g.style.display = '';
    });
    hit.addEventListener('mouseleave', () => { g.style.display = 'none'; });
  }

  // ── 全屏弹窗 ──────────────────────────────────────────────
  function _showFullscreen(rec, baseW) {
    const overlay = U.el('div', 'dis-chart-overlay');
    const modal   = U.el('div', 'dis-chart-modal');

    // ≤45 轮初始宽度适配屏幕，>45 轮用 baseW（可横向滚动）
    const fitW = Math.max(400, window.innerWidth - 68);
    let currentW = rec.roundCount <= 45 ? fitW : baseW;

    // 重新用新 W 生成 SVG 并注入 modal（元素坐标完整重算，非像素拉伸）
    function rebuild() {
      const { svgStr, tipData } = _buildChartSvgStr(rec, currentW);
      modal.innerHTML = svgStr;
      _addKillChartInteractivity(modal.querySelector('svg'), tipData);
    }

    rebuild();
    modal.addEventListener('click', e => e.stopPropagation());

    // Ctrl+滚轮：横向无限拉宽（重新渲染），纵向随比例增长但不超过屏幕 80%
    const MAX_H = Math.round(window.innerHeight * 0.8);
    const STEP  = 1.2;
    overlay.addEventListener('wheel', e => {
      if (!e.ctrlKey) return;
      e.preventDefault();
      currentW = Math.max(300, Math.round(currentW * (e.deltaY < 0 ? STEP : 1 / STEP)));
      rebuild();
      // 高度随比例缩放，但上限为屏幕 80%
      const svgEl = modal.querySelector('svg');
      if (svgEl) {
        const ratio = currentW / baseW;
        const newH  = Math.min(MAX_H, Math.round(400 * ratio));
        svgEl.setAttribute('height', Math.max(120, newH));
      }
    }, { passive: false });

    overlay.appendChild(modal);

    overlay.appendChild(U.el('div', 'dis-chart-hint', 'Ctrl+滚轮 缩放 · 点击空白处 或 Esc 关闭'));

    const close = () => {
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
      document.removeEventListener('keydown', onKey);
    };
    const onKey = e => { if (e.key === 'Escape') close(); };
    overlay.addEventListener('click', close);
    document.addEventListener('keydown', onKey);
    document.body.appendChild(overlay);
  }

  // ── SVG 共享渐变定义 ──────────────────────────────────────
  function _svgDefs() {
    return `
      <defs>
        <linearGradient id="cyber-bar-ok" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#0a2d3a"/>
          <stop offset="45%" stop-color="#0d4a5a"/>
          <stop offset="80%" stop-color="#1a7a8a"/>
          <stop offset="100%" stop-color="#3ad0e8"/>
        </linearGradient>
        <linearGradient id="cyber-bar-fail" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#5a1a22"/>
          <stop offset="55%" stop-color="#a83a42"/>
          <stop offset="100%" stop-color="#ff6b75"/>
        </linearGradient>
        <linearGradient id="cyber-bar-gradient" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stop-color="#0a3a4a"/>
          <stop offset="40%" stop-color="#1a7a9a"/>
          <stop offset="100%" stop-color="#5fd0e8"/>
        </linearGradient>
        <linearGradient id="cyber-bar-hover" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stop-color="#0a4a5a"/>
          <stop offset="40%" stop-color="#2a9aca"/>
          <stop offset="100%" stop-color="#8eefff"/>
        </linearGradient>
      </defs>
    `;
  }

  /* ════════════════════════════════════════════════════════════
     场上敌量曲线：X=任务全程秒数，Y=场上同时存在的敌人数
     高亮段 = 每轮开始后的前 10 秒（亮霓虹线 + 淡色背景竖带）
     ════════════════════════════════════════════════════════════ */
  const LIVE_WINDOW = 10; // 每轮开始后的高亮窗口（秒）

  function _buildLiveChart(rec) {
    // liveSamples: [{t(日志内绝对秒，与 rounds[].startT 同一时钟), live(场上敌数)}]
    const start = rec.startT;
    const dur   = rec.totalDuration;
    const samples = (Array.isArray(rec.liveSamples) ? rec.liveSamples : [])
      .map(p => ({ relT: p.t - start, live: p.live }))
      .filter(p => isFinite(p.relT) && isFinite(p.live) && p.relT >= -0.5 && p.relT <= dur + 0.5)
      .sort((a, b) => a.relT - b.relT);
    if (samples.length === 0) return null;

    const pxPerMin = 50;
    const baseW = Math.max(1400, Math.ceil(dur / 60) * pxPerMin + 120);
    const { svgStr, tipData } = _buildLiveSvgStr(rec, samples, baseW);

    const section = U.el('div', 'chart-box dis-tl-wrap');
    section.appendChild(U.el('div', 'dis-tl-title', '场上敌量曲线'));
    section.appendChild(U.el('div', 'dis-tl-sub', '场上同时存在的敌人数，取自房主日志生成采样；高亮段为每轮开始后的前 10 秒'));

    const scroll = U.el('div', 'dis-live-scroll');
    scroll.innerHTML = svgStr;
    _addLiveChartInteractivity(scroll.querySelector('svg'), tipData);
    section.appendChild(scroll);

    return section;
  }

  function _buildLiveSvgStr(rec, samples, W) {
    const H = 300;
    const start = rec.startT;
    const dur   = rec.totalDuration;

    const ML = 56, MR = 24, MT = 30;
    const plotH = 200;
    const plotW = W - ML - MR;
    const xAxisY = MT + plotH;

    const times = samples.map(p => p.relT);
    const lives = samples.map(p => p.live);
    const maxLive = Math.max(1, ...lives);

    const tx = relT => ML + Math.min(plotW, Math.max(0, (relT / dur) * plotW));
    const ty = v    => xAxisY - (v / maxLive) * plotH;

    // 阶梯取值：t 时刻的场上敌数 = 最后一个不晚于 t 的采样值
    function liveAt(t) {
      let lo = 0, hi = times.length;
      while (lo < hi) { const m = (lo + hi) >> 1; if (times[m] <= t) lo = m + 1; else hi = m; }
      return lo > 0 ? lives[lo - 1] : lives[0];
    }

    // 每轮开始后的前 10 秒高亮窗口
    const wins = rec.rounds.map(r => ({
      w0: Math.max(0, r.startT - start),
      w1: Math.min(dur, r.startT - start + LIVE_WINDOW),
    })).filter(w => w.w1 > w.w0);

    const niceX = [15, 30, 60, 120, 300, 600];
    const tickX = niceX.find(n => n >= dur / 18) || 600;
    const niceY = [1, 2, 5, 10, 20, 25, 50, 100, 200];
    const tickY = niceY.find(n => n >= maxLive / 6) || 200;

    let s = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" style="display:block;font-family:inherit">`;

    s += `<rect x="${ML}" y="${MT}" width="${plotW}" height="${plotH}" fill="rgba(255,255,255,0.015)" rx="2"/>`;

    // 高亮窗口淡色背景竖带
    wins.forEach(w => {
      s += `<rect x="${tx(w.w0).toFixed(1)}" y="${MT}" width="${(tx(w.w1) - tx(w.w0)).toFixed(1)}" height="${plotH}" fill="rgba(65,255,142,0.05)"/>`;
    });

    // 每轮起点细分隔竖线；每 5 轮标 R#
    rec.rounds.forEach((r, i) => {
      const x = tx(r.startT - start).toFixed(1);
      s += `<line x1="${x}" y1="${MT}" x2="${x}" y2="${xAxisY}" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>`;
      if (i === 0 || r.index % 5 === 0) {
        s += `<text x="${x}" y="${MT - 5}" fill="var(--c-text2)" font-size="9" text-anchor="middle">R${r.index}</text>`;
      }
    });

    // Y 网格与刻度
    for (let k = tickY; k <= maxLive + tickY; k += tickY) {
      const y = ty(k);
      if (y < MT - 2) break;
      s += `<line x1="${ML}" y1="${y.toFixed(1)}" x2="${(ML + plotW).toFixed(1)}" y2="${y.toFixed(1)}" stroke="rgba(255,255,255,0.07)" stroke-width="1" stroke-dasharray="4,4"/>`;
      s += `<text x="${(ML - 6).toFixed(1)}" y="${(y + 4).toFixed(1)}" fill="var(--c-text2)" font-size="10" text-anchor="end">${k}</text>`;
    }

    // 全程阶梯线（暗青色）
    let d = `M ${tx(times[0]).toFixed(1)},${ty(lives[0]).toFixed(1)}`;
    for (let i = 1; i < times.length; i++) {
      d += ` H ${tx(times[i]).toFixed(1)} V ${ty(lives[i]).toFixed(1)}`;
    }
    d += ` H ${(ML + plotW).toFixed(1)}`;
    s += `<path d="${d}" fill="none" stroke="rgba(26,122,138,0.7)" stroke-width="1.5" stroke-linejoin="round"/>`;

    // 高亮段（每轮前 10 秒窗口内的线段，亮霓虹）
    wins.forEach(w => {
      let hd = `M ${tx(w.w0).toFixed(1)},${ty(liveAt(w.w0)).toFixed(1)}`;
      for (let i = 0; i < times.length; i++) {
        if (times[i] > w.w0 && times[i] <= w.w1) {
          hd += ` H ${tx(times[i]).toFixed(1)} V ${ty(lives[i]).toFixed(1)}`;
        }
      }
      hd += ` H ${tx(w.w1).toFixed(1)}`;
      s += `<path d="${hd}" fill="none" stroke="#41ff8e" stroke-width="2" stroke-linejoin="round"/>`;
    });

    // X 轴与刻度
    s += `<line x1="${ML}" y1="${xAxisY}" x2="${(ML + plotW).toFixed(1)}" y2="${xAxisY}" stroke="rgba(255,255,255,0.25)" stroke-width="1"/>`;
    for (let t2 = 0; t2 <= dur + tickX * 0.5; t2 += tickX) {
      if (t2 > dur + 1) break;
      const x  = tx(t2).toFixed(1);
      const mm = Math.floor(t2 / 60);
      const ss = String(Math.floor(t2 % 60)).padStart(2, '0');
      s += `<line x1="${x}" y1="${xAxisY}" x2="${x}" y2="${xAxisY + 5}" stroke="rgba(255,255,255,0.25)" stroke-width="1"/>`;
      s += `<text x="${x}" y="${xAxisY + 17}" fill="var(--c-text2)" font-size="10" text-anchor="middle">${mm}:${ss}</text>`;
    }
    s += `<line x1="${ML}" y1="${MT}" x2="${ML}" y2="${xAxisY}" stroke="rgba(255,255,255,0.25)" stroke-width="1"/>`;
    const ylx = ML - 46, yly = MT + plotH / 2;
    s += `<text transform="rotate(-90,${ylx},${yly})" x="${ylx}" y="${yly}" fill="var(--c-text2)" font-size="10" text-anchor="middle" dominant-baseline="middle">场上敌数</text>`;
    s += `</svg>`;

    const tipData = { ML, MT, plotH, plotW, xAxisY, W, dur, times, lives, maxLive };
    return { svgStr: s, tipData };
  }

  // ── 场上敌量曲线交互（与击杀走势图同一套二分查找 crosshair 模式） ──
  function _addLiveChartInteractivity(svgEl, td) {
    if (!svgEl || td.times.length === 0) return;
    const ns = 'http://www.w3.org/2000/svg';
    const times = td.times, lives = td.lives;

    // 二分查找：时间 t 时的场上敌数（阶梯取值）
    function liveAt(t) {
      let lo = 0, hi = times.length;
      while (lo < hi) { const m = (lo + hi) >> 1; if (times[m] <= t) lo = m + 1; else hi = m; }
      return lo > 0 ? lives[lo - 1] : lives[0];
    }
    const txFn = relT => td.ML + Math.min(td.plotW, Math.max(0, (relT / td.dur) * td.plotW));
    const tyFn = v    => td.xAxisY - (v / td.maxLive) * td.plotH;

    const g = document.createElementNS(ns, 'g');
    g.style.pointerEvents = 'none'; g.style.display = 'none';

    const vline = document.createElementNS(ns, 'line');
    vline.setAttribute('stroke', 'rgba(255,255,255,0.3)');
    vline.setAttribute('stroke-width', '1');
    vline.setAttribute('stroke-dasharray', '4,3');
    g.appendChild(vline);

    const dot = document.createElementNS(ns, 'circle');
    dot.setAttribute('r', '4.5');
    dot.setAttribute('fill', '#41ff8e');
    dot.setAttribute('stroke', 'rgba(0,0,0,0.55)');
    dot.setAttribute('stroke-width', '1.5');
    g.appendChild(dot);

    const bg = document.createElementNS(ns, 'rect');
    bg.setAttribute('rx', '3');
    bg.setAttribute('fill', 'rgba(4,5,12,0.88)');
    bg.setAttribute('stroke', 'rgba(255,255,255,0.14)');
    bg.setAttribute('stroke-width', '1');
    g.appendChild(bg);

    const txt = document.createElementNS(ns, 'text');
    txt.setAttribute('fill', 'rgba(255,255,255,0.92)');
    txt.setAttribute('font-size', '11');
    txt.setAttribute('font-family', 'monospace');
    g.appendChild(txt);

    svgEl.appendChild(g);

    const hit = document.createElementNS(ns, 'rect');
    hit.setAttribute('x', String(td.ML));
    hit.setAttribute('y', String(td.MT));
    hit.setAttribute('width', String(td.plotW));
    hit.setAttribute('height', String(td.plotH));
    hit.setAttribute('fill', 'transparent');
    hit.style.cursor = 'crosshair';
    svgEl.appendChild(hit);

    hit.addEventListener('mousemove', e => {
      const rect = svgEl.getBoundingClientRect();
      const svgW = (svgEl.viewBox && svgEl.viewBox.baseVal.width) || parseFloat(svgEl.getAttribute('width'));
      const scaleX = svgW / rect.width;
      const svgX = (e.clientX - rect.left) * scaleX;
      const relT = Math.max(0, Math.min(td.dur, ((svgX - td.ML) / td.plotW) * td.dur));
      const v    = liveAt(relT);
      const mm   = String(Math.floor(relT / 60));
      const ss   = String(Math.floor(relT % 60)).padStart(2, '0');
      const label = `${mm}:${ss}  场上敌数 ${v}`;

      const lx = txFn(relT), ly = tyFn(v);
      vline.setAttribute('x1', String(lx)); vline.setAttribute('y1', String(td.MT));
      vline.setAttribute('x2', String(lx)); vline.setAttribute('y2', String(td.xAxisY));
      dot.setAttribute('cx', String(lx)); dot.setAttribute('cy', String(ly));

      const isRight = lx > svgW * 0.65;
      const anchor  = isRight ? 'end' : 'start';
      const tx2     = isRight ? lx - 7 : lx + 7;
      txt.setAttribute('x', String(tx2));
      txt.setAttribute('y', String(td.MT + 16));
      txt.setAttribute('text-anchor', anchor);
      txt.textContent = label;

      const bw = label.length * 6.6 + 10;
      const bx = isRight ? tx2 - bw + 4 : tx2 - 5;
      bg.setAttribute('x', String(bx)); bg.setAttribute('y', String(td.MT + 4));
      bg.setAttribute('width', String(bw)); bg.setAttribute('height', '17');

      g.style.display = '';
    });
    hit.addEventListener('mouseleave', () => { g.style.display = 'none'; });
  }

  /* ════════════════════════════════════════════════════════════
     逐轮导管时间轴：每轮一个区块，泳道按 insertRelT 升序排列，
     冰蓝 = 寻钥段，青绿/红 = 守管段，黄框 = 危险 Buff 导管；
     Ctrl+滚轮横向缩放（重渲染 SVG），点击轮头折叠/展开。
     ════════════════════════════════════════════════════════════ */
  const TL2_BASE_W = 940;   // 1× 缩放时每轮 SVG 的基准宽度
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

    let zoomW = TL2_BASE_W;
    const bodies = []; // { r, host }：有导管数据的轮次泳道区

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

    // 按当前缩放宽度重渲染全部轮次 SVG（参照全屏图的 rebuild 模式）
    function rebuildAll() {
      bodies.forEach(({ r, host }) => {
        const { svgStr, td } = _buildRoundTlSvgStr(r, zoomW);
        host.innerHTML = svgStr;
        _addRoundTlInteractivity(host.querySelector('svg'), td, tip);
      });
    }
    rebuildAll();

    // Ctrl+滚轮横向缩放：重渲染 SVG，放大后容器横向滚动
    scroll.addEventListener('wheel', e => {
      if (!e.ctrlKey) return;
      e.preventDefault();
      zoomW = Math.max(500, Math.min(6000, Math.round(zoomW * (e.deltaY < 0 ? TL2_STEP : 1 / TL2_STEP))));
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

  // 单轮泳道 SVG（W 可变，供 Ctrl+滚轮缩放重渲染）
  function _buildRoundTlSvgStr(r, W) {
    const conduits = _sortConduits(r.conduits || []);
    const n = conduits.length;
    const laneH = 22, laneGap = 9;
    const ML = 150, MR = 14, MT = 18;
    const dur = Math.max(r.combatDuration || 0, 1);
    const plotW = W - ML - MR;
    const lanesH = n * laneH + (n - 1) * laneGap;
    const axisY  = MT + lanesH;
    const H      = axisY + 24;
    const tickStep = dur > 75 ? 10 : 5;
    const tx = t => ML + Math.min(plotW, Math.max(0, (t / dur) * plotW));

    let s = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" style="display:block;font-family:inherit">`;
    s += `<defs>
      <linearGradient id="dis-tl2-key" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#5bc8ff" stop-opacity="0.10"/>
        <stop offset="100%" stop-color="#5bc8ff" stop-opacity="0.45"/>
      </linearGradient>
      <linearGradient id="dis-tl2-ok" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#1a8a52" stop-opacity="0.85"/>
        <stop offset="100%" stop-color="#41ff8e" stop-opacity="0.95"/>
      </linearGradient>
      <linearGradient id="dis-tl2-fail" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#8a2a35" stop-opacity="0.85"/>
        <stop offset="100%" stop-color="#ff5f6b" stop-opacity="0.95"/>
      </linearGradient>
      <linearGradient id="dis-tl2-unk" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#8a8f9e" stop-opacity="0.12"/>
        <stop offset="100%" stop-color="#8a8f9e" stop-opacity="0.35"/>
      </linearGradient>
    </defs>`;

    // X 轴竖网格线（贯穿全部泳道）与秒级刻度
    for (let t = 0; t <= dur + 0.001; t += tickStep) {
      const tt = Math.min(t, dur);
      const x  = tx(tt).toFixed(1);
      s += `<line x1="${x}" y1="${MT}" x2="${x}" y2="${axisY}" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>`;
      s += `<text x="${x}" y="${axisY + 14}" fill="var(--c-text2)" font-size="9" text-anchor="middle">${Math.round(tt)}s</text>`;
      if (tt >= dur) break;
    }
    s += `<line x1="${ML}" y1="${axisY}" x2="${(ML + plotW).toFixed(1)}" y2="${axisY}" stroke="rgba(255,255,255,0.18)" stroke-width="1"/>`;

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
        + ` stroke="${bad ? '#ffd700' : 'rgba(95,208,232,0.10)'}" stroke-width="${bad ? 1.2 : 1}"`
        + (bad ? ' style="filter:drop-shadow(0 0 5px rgba(255,215,0,0.45))"' : '') + '/>';

      // 泳道左标签：导管N + Buff 中文名（危险 Buff 黄字）
      const artLbl = '导管' + (c.artNum != null ? c.artNum : '?');
      const effLbl = U.escapeHtml(c.effectKind ? _effectName(c) : '—');
      s += `<text x="${ML - 8}" y="${y + 9}" fill="#c9d4e8" font-size="10" text-anchor="end">${artLbl}</text>`;
      s += `<text x="${ML - 8}" y="${y + 19}" fill="${bad ? '#ffd700' : 'var(--c-text2)'}" font-size="8.5" text-anchor="end"${bad ? ' style="text-shadow:0 0 6px rgba(255,215,0,0.4)"' : ''}>${effLbl}</text>`;

      const barY = y + 4, barH = laneH - 8;
      if (c.insertRelT != null) {
        const xi = tx(c.insertRelT);
        // 寻钥段：[0 → insertRelT] 冰蓝半透明渐变条
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
        // 段界处 ▼ 插入标记
        s += `<polygon points="${xi.toFixed(1)},${(barY + 1).toFixed(1)} ${(xi - 4.5).toFixed(1)},${(barY - 5).toFixed(1)} ${(xi + 4.5).toFixed(1)},${(barY - 5).toFixed(1)}" fill="#5bc8ff" opacity="0.9"/>`;
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

  // 单轮泳道交互：贯穿全部泳道的竖直十字线 + 「第 X.Xs」标注 + 泳道自建浮层
  function _addRoundTlInteractivity(svgEl, td, tipEl) {
    if (!svgEl) return;
    const ns = 'http://www.w3.org/2000/svg';
    svgEl.style.cursor = 'crosshair';

    // ── 十字线组 ──
    const g = document.createElementNS(ns, 'g');
    g.style.pointerEvents = 'none'; g.style.display = 'none';

    const vline = document.createElementNS(ns, 'line');
    vline.setAttribute('stroke', 'rgba(255,255,255,0.3)');
    vline.setAttribute('stroke-width', '1');
    vline.setAttribute('stroke-dasharray', '4,3');
    vline.setAttribute('y1', String(td.MT - 4));
    vline.setAttribute('y2', String(td.axisY));
    g.appendChild(vline);

    const txt = document.createElementNS(ns, 'text');
    txt.setAttribute('fill', 'rgba(255,255,255,0.92)');
    txt.setAttribute('font-size', '10');
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

  // ── 每轮前 10 秒击杀数赛博柱状图 ──────────────────────────
  function _buildOpeningKillsChart(rec) {
    const WINDOW = 10;
    const data = rec.rounds.map(r => {
      const end = r.startT + WINDOW;
      const count = (rec.killEvents || []).filter(t => t >= r.startT && t < end).length;
      return { index: r.index, count };
    });
    const maxCount = Math.max(1, ...data.map(d => d.count));

    const chartW = 760;
    const chartH = 220;
    const ml = 44, mr = 16, mt = 28, mb = 40;
    const plotW = chartW - ml - mr;
    const plotH = chartH - mt - mb;
    const barGap = Math.max(2, Math.min(8, plotW / data.length / 4));
    const barW = Math.max(4, (plotW / data.length) - barGap);

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', `0 0 ${chartW} ${chartH}`);
    svg.setAttribute('class', 'opening-kills-chart');
    svg.innerHTML = _svgDefs();

    // 网格背景
    const grid = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    for (let i = 0; i <= 4; i++) {
      const y = mt + (plotH * i / 4);
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', ml);
      line.setAttribute('y1', y);
      line.setAttribute('x2', chartW - mr);
      line.setAttribute('y2', y);
      line.setAttribute('class', 'cyber-grid-line');
      grid.appendChild(line);
    }
    svg.appendChild(grid);

    // 柱子
    data.forEach((d, i) => {
      const h = (d.count / maxCount) * plotH;
      const x = ml + i * (barW + barGap) + barGap / 2;
      const y = mt + plotH - h;

      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('class', 'cyber-bar-group');

      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', x);
      rect.setAttribute('y', y);
      rect.setAttribute('width', barW);
      rect.setAttribute('height', h);
      rect.setAttribute('rx', Math.min(3, barW / 2));
      rect.setAttribute('class', 'cyber-bar');

      const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
      title.textContent = `第 ${d.index} 轮\n前 ${WINDOW} 秒击杀：${d.count}`;
      g.appendChild(rect);
      g.appendChild(title);

      // 轮次标签，每 5 轮或首尾显示
      if (i === 0 || i === data.length - 1 || (d.index) % 5 === 0) {
        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('x', x + barW / 2);
        label.setAttribute('y', chartH - mb + 16);
        label.setAttribute('text-anchor', 'middle');
        label.setAttribute('class', 'cyber-axis-text');
        label.textContent = d.index;
        g.appendChild(label);
      }

      // 顶部数值：固定在柱子正上方，若与标题区/网格顶部重叠则不显示
      const valY = y - 7;
      if (barW >= 10 && valY >= mt + 4) {
        const val = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        val.setAttribute('x', x + barW / 2);
        val.setAttribute('y', valY);
        val.setAttribute('text-anchor', 'middle');
        val.setAttribute('class', 'cyber-bar-value');
        val.textContent = d.count;
        g.appendChild(val);
      }

      svg.appendChild(g);
    });

    // Y 轴标题
    const yTitle = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    yTitle.setAttribute('transform', `rotate(-90, ${ml - 34}, ${mt + plotH / 2})`);
    yTitle.setAttribute('x', ml - 34);
    yTitle.setAttribute('y', mt + plotH / 2);
    yTitle.setAttribute('text-anchor', 'middle');
    yTitle.setAttribute('class', 'cyber-axis-title');
    yTitle.textContent = '前10秒击杀数';
    svg.appendChild(yTitle);

    const section = U.el('div', 'chart-box dis-tl-wrap cyber-chart-box');
    section.appendChild(U.el('div', 'dis-tl-title', '每轮前10秒击杀数'));
    section.appendChild(U.el('div', 'dis-tl-sub', '每轮战斗开始10秒内的击杀总数；数值高意味着起手清场速度快'));
    section.appendChild(svg);
    return section;
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

  function _conduitColor(c) {
    if (c.success === false && _isBadDebuff(c)) return '#c97fff'; // 危险减益且失守 → 紫色
    if (c.success === false) return '#ff5f6b';                    // 普通失守 → 红色
    if (_isBadDebuff(c))     return '#ffd700';                    // 危险减益但守住 → 黄色
    if (c.success === true)  return '#41ff8e';                    // 普通成功 → 绿色
    return '#aaa';
  }

  function _st(label, value, cls) {
    const d = U.el('div', 'stat ' + (cls || ''));
    d.appendChild(U.el('div', 'stat-value', value));
    d.appendChild(U.el('div', 'stat-label', label));
    return d;
  }

  return { render, summary };
})();
