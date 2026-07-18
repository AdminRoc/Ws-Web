/* 中断子页面 ECharts 图表封装
 * 与 arbitrationCharts.js 同一套赛博朋克辉光风格：深色透明背景、霓虹系列色、暗网格、玻璃态 tooltip。
 * 所有工厂函数返回 echarts 实例，调用方负责 dispose；echarts 不可用时返回 null，视图层跳过该图。
 */
window.WF = window.WF || {};

WF.disruptionCharts = (function () {
  const U = WF.utils;

  // ── 赛博朋克配色 ──
  const COLORS = {
    cyan:    '#00f0ff',
    magenta: '#ff00aa',
    amber:   '#ffaa00',
    green:   '#00ff88',
    red:     '#ff3333',
    purple:  '#a855f7',
    text:    '#c7d6e3',
    muted:   '#6b7f94',
    grid:    '#1a2633',
    axis:    '#334455',
    bg:      'transparent',
  };
  const SERIES_COLORS = [COLORS.cyan, COLORS.amber, COLORS.magenta, COLORS.green, COLORS.purple, COLORS.red];

  function isAvailable() {
    return typeof echarts !== 'undefined';
  }

  function baseOption() {
    return {
      backgroundColor: COLORS.bg,
      textStyle: { fontFamily: "'Microsoft YaHei', 'XSZT', sans-serif", color: COLORS.text },
      title: { show: false },
      legend: {
        textStyle: { color: COLORS.text },
        inactiveColor: COLORS.muted,
        itemGap: 16,
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(10,15,30,0.92)',
        borderColor: 'rgba(0,240,255,0.35)',
        borderWidth: 1,
        padding: [8, 12],
        textStyle: { color: COLORS.text, fontSize: 12 },
        extraCssText: 'box-shadow: 0 0 14px rgba(0,240,255,0.18); backdrop-filter: blur(6px);',
        axisPointer: {
          type: 'cross',
          label: { backgroundColor: 'rgba(0,240,255,0.2)', color: COLORS.text },
          lineStyle: { color: COLORS.cyan, type: 'dashed', width: 1 },
        },
      },
      grid: {
        left: '3%', right: '4%', bottom: '10%', top: '12%', containLabel: true,
        borderColor: COLORS.grid,
      },
      xAxis: {
        type: 'category',
        axisLine: { lineStyle: { color: COLORS.axis } },
        axisTick: { show: false },
        axisLabel: { color: COLORS.muted, fontSize: 11 },
        splitLine: { show: true, lineStyle: { color: COLORS.grid } },
      },
      yAxis: {
        type: 'value',
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: COLORS.muted, fontSize: 11 },
        splitLine: { lineStyle: { color: COLORS.grid } },
      },
      color: SERIES_COLORS,
      animation: true,
      animationDuration: 900,
      animationEasing: 'cubicOut',
    };
  }

  function mergeOption(custom) {
    const base = baseOption();
    // 简单深度合并关键对象
    return {
      ...base,
      ...custom,
      legend: { ...base.legend, ...(custom.legend || {}) },
      tooltip: { ...base.tooltip, ...(custom.tooltip || {}) },
      grid: { ...base.grid, ...(custom.grid || {}) },
      xAxis: Array.isArray(custom.xAxis)
        ? custom.xAxis.map((x) => ({ ...base.xAxis, ...x }))
        : { ...base.xAxis, ...(custom.xAxis || {}) },
      yAxis: Array.isArray(custom.yAxis)
        ? custom.yAxis.map((y) => ({ ...base.yAxis, ...y }))
        : { ...base.yAxis, ...(custom.yAxis || {}) },
      series: custom.series || [],
    };
  }

  // 秒 → "m:ss"
  function _mmss(sec) {
    sec = Math.max(0, Math.floor(sec));
    return Math.floor(sec / 60) + ':' + String(sec % 60).padStart(2, '0');
  }

  // inside + slider 缩放对（slider 样式与仲裁分页一致）
  function _zoomPair() {
    return [
      { type: 'inside', start: 0, end: 100 },
      { type: 'slider', start: 0, end: 100, height: 18, bottom: 4, borderColor: COLORS.axis, fillerColor: 'rgba(0,240,255,0.15)', handleStyle: { color: COLORS.cyan } },
    ];
  }

  // ── 1. 每轮耗时概览（柱状图：全部守住=青绿，有失守=红橙） ──
  function roundDurationChart(container, rec) {
    if (!isAvailable() || !rec || !rec.rounds || !rec.rounds.length) return null;
    const rounds = rec.rounds;
    const okGrad = new echarts.graphic.LinearGradient(0, 0, 0, 1, [
      { offset: 0, color: 'rgba(0,255,136,0.95)' },
      { offset: 0.55, color: 'rgba(0,210,170,0.72)' },
      { offset: 1, color: 'rgba(0,120,120,0.32)' },
    ]);
    const failGrad = new echarts.graphic.LinearGradient(0, 0, 0, 1, [
      { offset: 0, color: 'rgba(255,107,117,0.95)' },
      { offset: 0.55, color: 'rgba(255,110,60,0.72)' },
      { offset: 1, color: 'rgba(140,40,30,0.32)' },
    ]);
    const data = rounds.map((r) => {
      const ok = r.conduits.length === 0 || r.conduits.every((c) => c.success);
      return {
        value: +r.duration.toFixed(1),
        round: r.index,
        held: r.conduits.filter((c) => c.success === true).length,
        total: r.conduits.length,
        itemStyle: {
          color: ok ? okGrad : failGrad,
          borderRadius: [3, 3, 0, 0],
          shadowBlur: 8,
          shadowColor: ok ? 'rgba(0,255,136,0.32)' : 'rgba(255,80,80,0.38)',
        },
      };
    });
    const option = mergeOption({
      tooltip: {
        trigger: 'item',
        formatter: function (p) {
          const d = p.data || {};
          return `<div style="font-weight:bold;margin-bottom:4px;">第 ${d.round} 轮</div>`
            + `<div>耗时：${U.fmtDuration(d.value)}</div>`
            + `<div>守住 ${d.held}/${d.total}</div>`;
        },
      },
      grid: { left: '3%', right: '4%', bottom: rounds.length > 30 ? '17%' : '10%', top: '12%', containLabel: true },
      xAxis: { type: 'category', data: rounds.map((r) => String(r.index)) },
      yAxis: { type: 'value', name: '秒' },
      dataZoom: rounds.length > 30 ? _zoomPair() : [{ type: 'inside', start: 0, end: 100 }],
      series: [{
        type: 'bar',
        barMaxWidth: 26,
        data,
        emphasis: { itemStyle: { shadowBlur: 16, shadowColor: 'rgba(0,240,255,0.5)' } },
      }],
    });
    const chart = echarts.init(container);
    chart.setOption(option);
    return chart;
  }

  // ── 2. 击杀走势（阶梯累计折线 + 导管事件 markPoint 时间轴） ──
  // helpers: { effectName(c), isBad(c) } 由视图层注入，复用同一份中文名映射与危险判定
  function killTrendChart(container, rec, helpers) {
    if (!isAvailable() || !rec) return null;
    helpers = helpers || {};
    const effName = helpers.effectName || function () { return '—'; };
    const isBad   = helpers.isBad      || function () { return false; };

    const start = rec.startT;
    const dur   = rec.totalDuration;
    if (!(dur > 0)) return null;
    const killTimes = (rec.killEvents || [])
      .map((t) => t - start)
      .filter((t) => t >= 0 && t <= dur)
      .sort((a, b) => a - b);
    if (!killTimes.length) return null;

    // 二分查找：t 时刻的累计击杀数
    function killAt(relT) {
      let lo = 0, hi = killTimes.length;
      while (lo < hi) { const m = (lo + hi) >> 1; if (killTimes[m] <= relT) lo = m + 1; else hi = m; }
      return lo;
    }

    // 阶梯累计数据
    const data = [[0, 0]];
    for (let i = 0; i < killTimes.length; i++) data.push([+killTimes[i].toFixed(2), i + 1]);
    data.push([+dur.toFixed(2), killTimes.length]);

    // 导管事件 markPoint：插入=青色三角，完成=圆点（成功绿 / 失败红 / 危险 Buff 黄）
    const marks = [];
    rec.rounds.forEach((r) => {
      (r.conduits || []).forEach((c) => {
        const buff = c.effectKind ? effName(c) : null;
        const head = `R${r.index}${c.artNum != null ? ' 导管' + c.artNum : ''}`;
        if (c.insertT != null) {
          const relT = c.insertT - start;
          if (relT >= 0 && relT <= dur) {
            marks.push({
              coord: [+relT.toFixed(2), killAt(relT)],
              symbol: 'triangle', symbolSize: 12,
              itemStyle: { color: COLORS.cyan, shadowBlur: 8, shadowColor: COLORS.cyan, opacity: 0.9 },
              tip: `<div style="font-weight:bold;margin-bottom:4px;">${head}</div>`
                + (buff ? `<div>Buff：${buff}</div>` : '')
                + `<div>插入 +${U.fmtDuration(relT)}</div>`,
            });
          }
        }
        if (c.doneT != null) {
          const relT = c.doneT - start;
          if (relT >= 0 && relT <= dur) {
            const col = isBad(c) ? '#ffd700'
              : c.success === false ? COLORS.red
              : c.success === true ? COLORS.green : '#8a8f9e';
            const lbl = c.success === true ? '守卫成功' : c.success === false ? '守卫失败' : '结果未知';
            marks.push({
              coord: [+relT.toFixed(2), killAt(relT)],
              symbol: 'circle', symbolSize: 9,
              itemStyle: { color: col, shadowBlur: 8, shadowColor: col, opacity: 0.88 },
              tip: `<div style="font-weight:bold;margin-bottom:4px;">${head}</div>`
                + (buff ? `<div>Buff：${buff}</div>` : '')
                + `<div>${lbl} +${U.fmtDuration(relT)}</div>`,
            });
          }
        }
      });
    });

    const option = mergeOption({
      tooltip: {
        formatter: function (params) {
          // markPoint 悬停时 params 为单个对象；折线轴触发时为数组
          if (!Array.isArray(params)) return (params.data && params.data.tip) || '';
          const p = params[0];
          if (!p || !p.value) return '';
          return `<div style="font-weight:bold;margin-bottom:4px;">${_mmss(p.value[0])}</div>`
            + `<div>${p.marker || ''} 累计击杀 ${p.value[1]}</div>`;
        },
      },
      grid: { left: '3%', right: '4%', bottom: '17%', top: '12%', containLabel: true },
      xAxis: { type: 'value', min: 0, max: Math.ceil(dur), axisLabel: { color: COLORS.muted, fontSize: 11, formatter: _mmss } },
      yAxis: { type: 'value', name: '累计击杀', minInterval: 1 },
      dataZoom: _zoomPair(),
      series: [{
        name: '累计击杀',
        type: 'line',
        step: 'end',
        showSymbol: false,
        lineStyle: { width: 2, color: COLORS.green, shadowBlur: 8, shadowColor: 'rgba(0,255,136,0.45)' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(0,255,136,0.30)' },
            { offset: 1, color: 'rgba(0,255,136,0.02)' },
          ]),
        },
        data,
        markPoint: { data: marks, label: { show: false }, emphasis: { scale: 1.4 } },
      }],
    });
    const chart = echarts.init(container);
    chart.setOption(option);
    return chart;
  }

  // ── 3. 场上敌量曲线（markArea=每轮前 10 秒窗口，markLine=每轮起点） ──
  const LIVE_WINDOW = 10; // 每轮开始后的高亮窗口（秒）

  function liveCountChart(container, rec) {
    if (!isAvailable() || !rec) return null;
    const start = rec.startT;
    const dur   = rec.totalDuration;
    if (!(dur > 0)) return null;
    const samples = (Array.isArray(rec.liveSamples) ? rec.liveSamples : [])
      .map((p) => ({ relT: p.t - start, live: p.live }))
      .filter((p) => isFinite(p.relT) && isFinite(p.live) && p.relT >= -0.5 && p.relT <= dur + 0.5)
      .sort((a, b) => a.relT - b.relT);
    if (!samples.length) return null;

    const data = samples.map((p) => [+Math.max(0, p.relT).toFixed(2), p.live]);

    // 每轮开始后的前 10 秒：亮绿半透明竖带
    const areas = [];
    rec.rounds.forEach((r) => {
      const w0 = Math.max(0, r.startT - start);
      const w1 = Math.min(dur, r.startT - start + LIVE_WINDOW);
      if (w1 > w0) {
        areas.push([
          { xAxis: +w0.toFixed(2), itemStyle: { color: 'rgba(0,255,136,0.08)' } },
          { xAxis: +w1.toFixed(2) },
        ]);
      }
    });

    // 每轮起点细分隔线；每 5 轮标 R#
    const lines = rec.rounds.map((r, i) => ({
      xAxis: +(r.startT - start).toFixed(2),
      label: {
        show: i === 0 || r.index % 5 === 0,
        formatter: 'R' + r.index,
        color: COLORS.muted, fontSize: 10, position: 'insideEndTop',
      },
      lineStyle: { color: 'rgba(255,255,255,0.14)', width: 1 },
    }));

    const option = mergeOption({
      tooltip: {
        formatter: function (params) {
          const p = Array.isArray(params) ? params[0] : params;
          if (!p || !p.value) return '';
          return `${_mmss(p.value[0])}  场上敌数 ${p.value[1]}`;
        },
      },
      grid: { left: '3%', right: '4%', bottom: '17%', top: '14%', containLabel: true },
      xAxis: { type: 'value', min: 0, max: Math.ceil(dur), axisLabel: { color: COLORS.muted, fontSize: 11, formatter: _mmss } },
      yAxis: { type: 'value', name: '场上敌数', min: 0, minInterval: 1 },
      dataZoom: _zoomPair(),
      series: [{
        name: '场上敌数',
        type: 'line',
        step: 'end',
        showSymbol: false,
        lineStyle: { width: 2, color: COLORS.cyan, shadowBlur: 10, shadowColor: 'rgba(0,240,255,0.5)' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(0,240,255,0.32)' },
            { offset: 1, color: 'rgba(0,240,255,0.02)' },
          ]),
        },
        data,
        markArea: { silent: true, data: areas, animation: false },
        markLine: { silent: true, symbol: 'none', data: lines, animation: false },
      }],
    });
    const chart = echarts.init(container);
    chart.setOption(option);
    return chart;
  }

  // ── 4. 每轮前 10 秒击杀数（青色渐变柱 + 辉光 + 柱顶数值） ──
  function openingKillsChart(container, rec) {
    if (!isAvailable() || !rec || !rec.rounds || !rec.rounds.length) return null;
    const WINDOW = 10;
    const kills = rec.killEvents || [];
    const data = rec.rounds.map((r) => {
      const end = r.startT + WINDOW;
      let count = 0;
      for (let i = 0; i < kills.length; i++) {
        if (kills[i] >= r.startT && kills[i] < end) count++;
      }
      return { value: count, round: r.index };
    });
    const option = mergeOption({
      tooltip: {
        trigger: 'item',
        formatter: function (p) {
          const d = p.data || {};
          return `<div style="font-weight:bold;margin-bottom:4px;">第 ${d.round} 轮</div>`
            + `<div>前 10 秒击杀：${d.value}</div>`;
        },
      },
      grid: { left: '3%', right: '4%', bottom: data.length > 30 ? '17%' : '10%', top: '14%', containLabel: true },
      xAxis: { type: 'category', data: data.map((d) => String(d.round)) },
      yAxis: { type: 'value', min: 0, minInterval: 1 },
      dataZoom: data.length > 30 ? _zoomPair() : [{ type: 'inside', start: 0, end: 100 }],
      series: [{
        type: 'bar',
        barMaxWidth: 26,
        label: {
          show: true, position: 'top', color: '#dffbff', fontSize: 10,
          textShadowBlur: 6, textShadowColor: 'rgba(0,240,255,0.6)',
        },
        labelLayout: { hideOverlap: true },
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(0,240,255,0.95)' },
            { offset: 0.55, color: 'rgba(0,180,220,0.68)' },
            { offset: 1, color: 'rgba(0,90,130,0.28)' },
          ]),
          borderRadius: [3, 3, 0, 0],
          shadowBlur: 10,
          shadowColor: 'rgba(0,240,255,0.45)',
        },
        emphasis: { itemStyle: { shadowBlur: 18, shadowColor: 'rgba(0,240,255,0.8)' } },
        data,
      }],
    });
    const chart = echarts.init(container);
    chart.setOption(option);
    return chart;
  }

  // ── 通用 dispose 辅助 ──
  function dispose(chart) {
    if (chart && typeof chart.dispose === 'function') chart.dispose();
  }

  return {
    isAvailable,
    baseOption,
    mergeOption,
    roundDurationChart,
    killTrendChart,
    liveCountChart,
    openingKillsChart,
    dispose,
    COLORS,
  };
})();
