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
        value: +r.combatDuration.toFixed(1),
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

  // ── 2. 场上敌量曲线（markArea=每轮前 10 秒窗口，markLine=每轮起点） ──
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

    // 每轮开始后的前 10 秒：红色竖带（与红色线段协调）
    const areas = [];
    rec.rounds.forEach((r) => {
      const w0 = Math.max(0, r.startT - start);
      const w1 = Math.min(dur, r.startT - start + LIVE_WINDOW);
      if (w1 > w0) {
        areas.push([
          { xAxis: +w0.toFixed(2), itemStyle: { color: 'rgba(255,51,51,0.10)' } },
          { xAxis: +w1.toFixed(2) },
        ]);
      }
    });

    // 每轮前 10 秒窗口内的折线线段：独立红色覆盖系列（窗与窗之间以空点断开；
    // 窗口起点值向前取最近采样做阶梯 carry-forward，窗尾延伸到最后一次取值）
    const RED = '#ff3333';
    const redData = [];
    rec.rounds.forEach((r) => {
      const w0 = Math.max(0, r.startT - start);
      const w1 = Math.min(dur, r.startT - start + LIVE_WINDOW);
      if (w1 <= w0) return;
      let v0 = null;
      for (let i = 0; i < samples.length; i++) {
        if (samples[i].relT <= w0) v0 = samples[i].live;
        else break;
      }
      if (v0 == null) return; // 窗口开始前尚无采样，无法定位线段
      const pts = [[+w0.toFixed(2), v0]];
      for (let i = 0; i < samples.length; i++) {
        const p = samples[i];
        if (p.relT > w0 && p.relT <= w1) pts.push([+p.relT.toFixed(2), p.live]);
      }
      pts.push([+w1.toFixed(2), pts[pts.length - 1][1]]);
      redData.push(...pts, [null, null]);
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
          const arr = Array.isArray(params) ? params : [params];
          const p = arr.find((q) => q && q.seriesName === '场上敌数') || arr[0];
          if (!p || !p.value) return '';
          return `${_mmss(p.value[0])}  场上敌数 ${p.value[1]}`;
        },
      },
      legend: { data: ['场上敌数'] },
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
      }, {
        // 每轮前 10 秒红色线段覆盖层（与上图同轴同步缩放，空点断开各窗口）
        name: '前10秒',
        type: 'line',
        step: 'end',
        showSymbol: false,
        silent: true,
        z: 3,
        lineStyle: { width: 2.5, color: RED, shadowBlur: 12, shadowColor: 'rgba(255,51,51,0.65)' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(255,51,51,0.26)' },
            { offset: 1, color: 'rgba(255,51,51,0.02)' },
          ]),
        },
        data: redData,
      }],
    });
    const chart = echarts.init(container);
    chart.setOption(option);
    return chart;
  }

  // ── 3. 每轮前 10 秒击杀数（青色渐变柱 + 辉光 + 柱顶数值） ──
  // 插满耗时：从本轮开始，到所有导管都被插入钥匙（最后一根导管被插入）的时长。
  // 只取 max(insertRelT)，与完成时刻无关；任一导管缺 insertRelT（或本轮无导管）则为 null。
  function _insertFullTime(r) {
    const cs = (r && r.conduits) || [];
    if (!cs.length) return null;
    let mx = -1;
    for (let i = 0; i < cs.length; i++) {
      const v = cs[i].insertRelT;
      if (v == null) return null;
      if (v > mx) mx = v;
    }
    return mx;
  }

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
      return { value: count, round: r.index, insertFull: _insertFullTime(r) };
    });
    const option = mergeOption({
      tooltip: {
        trigger: 'item',
        formatter: function (p) {
          const d = p.data || {};
          return `<div style="font-weight:bold;margin-bottom:4px;">第 ${d.round} 轮</div>`
            + `<div>前 10 秒击杀：${d.value}</div>`
            + `<div>插满耗时：${d.insertFull != null ? d.insertFull.toFixed(1) + 's' : '—'}</div>`;
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

  // ── 4. 插满耗时·折线图（与「每轮前10秒击杀数」严格同轮次类目轴/同 grid/同 dataZoom，逐轮对齐） ──
  function insertFullChart(container, rec) {
    if (!isAvailable() || !rec || !rec.rounds || !rec.rounds.length) return null;
    const data = rec.rounds.map((r) => {
      const v = _insertFullTime(r);
      return { value: v != null ? +v.toFixed(2) : null, round: r.index };
    });
    const option = mergeOption({
      tooltip: {
        trigger: 'axis',
        formatter: function (params) {
          const p = Array.isArray(params) ? params[0] : params;
          const d = (p && p.data) || {};
          const v = d.value;
          const rd = d.round != null ? d.round : (p && p.name);
          return `<div style="font-weight:bold;margin-bottom:4px;">第 ${rd} 轮</div>`
            + `<div>插满耗时：${v != null ? Number(v).toFixed(1) + 's' : '—'}</div>`;
        },
      },
      grid: { left: '3%', right: '4%', bottom: data.length > 30 ? '17%' : '10%', top: '14%', containLabel: true },
      xAxis: { type: 'category', data: data.map((d) => String(d.round)) },
      yAxis: { type: 'value', name: '秒', min: 0 },
      dataZoom: data.length > 30 ? _zoomPair() : [{ type: 'inside', start: 0, end: 100 }],
      series: [{
        name: '插满耗时',
        type: 'line',
        connectNulls: false, // 缺 insertRelT 的轮次折线断开
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: { width: 2.5, color: COLORS.amber, shadowBlur: 10, shadowColor: 'rgba(255,170,0,0.50)' },
        itemStyle: { color: COLORS.amber, borderColor: '#fff2cc', borderWidth: 1, shadowBlur: 8, shadowColor: 'rgba(255,170,0,0.60)' },
        emphasis: { scale: 1.5, itemStyle: { shadowBlur: 14, shadowColor: 'rgba(255,170,0,0.85)' } },
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
    liveCountChart,
    openingKillsChart,
    insertFullChart,
    dispose,
    COLORS,
  };
})();
