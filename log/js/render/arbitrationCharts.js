/* 仲裁子页面 ECharts 图表封装
 * 统一赛博朋克辉光风格：深色透明背景、霓虹系列色、暗网格、玻璃态 tooltip。
 * 所有工厂函数返回 echarts 实例，调用方负责 dispose。
 */
window.WF = window.WF || {};

WF.arbitrationCharts = (function () {
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

  // ── 1. 任务时间轴总览 ──
  function timelineOverview(container, rec) {
    if (!isAvailable() || !rec || !rec.dist || !rec.dist.perMinute) return null;
    const pm = rec.dist.perMinute.rows;
    const startRel = rec.drones[0] || 0;
    const endRel = rec.duration;
    const categories = pm.map((r) => 'M' + r.minute);

    // 轮次竖线
    const markLines = [];
    if (rec.roundDetail) {
      for (const rd of rec.roundDetail) {
        if (rd.incomplete) continue;
        const min = Math.round(rd.atSec / 60);
        if (min >= 1 && min <= pm.length) {
          markLines.push({
            xAxis: 'M' + min,
            label: { formatter: rd.label, color: COLORS.text, fontSize: 10 },
            lineStyle: { color: COLORS.red, type: 'dashed', width: 1.5 },
          });
        }
      }
    }

    const option = mergeOption({
      tooltip: {
        formatter: function (params) {
          let html = `<div style="font-weight:bold;margin-bottom:4px;">${params[0].axisValue}</div>`;
          params.forEach((p) => {
            if (p.seriesName === '无人机') {
              html += `<div>${p.marker} 无人机: ${p.data.value || p.data} 只</div>`;
            } else {
              html += `<div>${p.marker} ${p.seriesName}: ${p.value}</div>`;
            }
          });
          return html;
        },
      },
      legend: { top: 4, right: 12, itemGap: 20, data: ['平均活跃敌人', '最大活跃敌人', '无人机'], textStyle: { fontSize: 12, color: COLORS.text }, icon: 'roundRect' },
      grid: { left: '3%', right: '4%', bottom: '16%', top: '22%', containLabel: true },
      xAxis: { type: 'category', data: categories, boundaryGap: false },
      yAxis: [
        { type: 'value', name: '活跃敌人', position: 'left', axisLabel: { color: COLORS.cyan } },
        { type: 'value', name: '无人机', position: 'right', max: Math.max(1, ...pm.map((r) => r.drones)) * 1.5, axisLabel: { color: COLORS.green } },
      ],
      dataZoom: [
        { type: 'inside', start: 0, end: 100 },
        { type: 'slider', start: 0, end: 100, height: 18, bottom: 4, borderColor: COLORS.axis, fillerColor: 'rgba(0,240,255,0.15)', handleStyle: { color: COLORS.cyan } },
      ],
      series: [
        {
          name: '平均活跃敌人',
          type: 'line',
          smooth: true,
          showSymbol: false,
          lineStyle: { width: 2, color: COLORS.cyan },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(0,240,255,0.35)' },
              { offset: 1, color: 'rgba(0,240,255,0.02)' },
            ]),
          },
          data: pm.map((r) => r.liveAvg.toFixed(1)),
          markLine: { symbol: 'none', data: markLines, animation: false },
        },
        {
          name: '最大活跃敌人',
          type: 'line',
          smooth: true,
          showSymbol: false,
          lineStyle: { width: 1, color: COLORS.magenta, type: 'dashed' },
          data: pm.map((r) => r.liveMax),
        },
        {
          name: '无人机',
          type: 'scatter',
          yAxisIndex: 1,
          symbolSize: function (val) { return val > 0 ? Math.min(12, 6 + val * 0.35) : 0; },
          itemStyle: { color: COLORS.green, shadowBlur: 6, shadowColor: COLORS.green },
          data: pm.map((r) => r.drones),
        },
      ],
    });

    const chart = echarts.init(container);
    chart.setOption(option);
    return chart;
  }

  // ── 2. 敌人生成速率（双轨：Spawned 峰值 + 真实事件数）──
  function spawnRateChart(container, rec) {
    if (!isAvailable() || !rec || !rec.dist || !rec.dist.perMinute) return null;
    const pm = rec.dist.perMinute.rows;
    const categories = pm.map((r) => 'M' + r.minute);
    const option = mergeOption({
      tooltip: { trigger: 'axis' },
      legend: { data: ['Spawned 峰值差分', '真实生成事件数'], top: 0 },
      xAxis: { type: 'category', data: categories },
      yAxis: { type: 'value', name: '数量' },
      series: [
        {
          name: 'Spawned 峰值差分',
          type: 'line',
          smooth: true,
          showSymbol: false,
          lineStyle: { width: 2, color: COLORS.amber },
          data: pm.map((r) => r.spawn),
        },
        {
          name: '真实生成事件数',
          type: 'bar',
          barWidth: '40%',
          itemStyle: { color: 'rgba(255,170,0,0.25)', borderColor: COLORS.amber, borderWidth: 1 },
          data: pm.map((r) => r.spawnEvents),
        },
      ],
    });
    const chart = echarts.init(container);
    chart.setOption(option);
    return chart;
  }

  // ── 3. 无人机生成趋势 ──
  function droneTrendChart(container, rec) {
    if (!isAvailable() || !rec || !rec.dist || !rec.dist.perMinute) return null;
    const pm = rec.dist.perMinute.rows;
    const categories = pm.map((r) => 'M' + r.minute);
    const option = mergeOption({
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: categories },
      yAxis: { type: 'value', name: '只' },
      series: [
        {
          name: '无人机',
          type: 'bar',
          barWidth: '50%',
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(0,255,136,0.9)' },
              { offset: 1, color: 'rgba(0,255,136,0.15)' },
            ]),
            borderRadius: [3, 3, 0, 0],
            shadowBlur: 6,
            shadowColor: 'rgba(0,255,136,0.4)',
          },
          data: pm.map((r) => r.drones),
        },
      ],
    });
    const chart = echarts.init(container);
    chart.setOption(option);
    return chart;
  }

  // ── 4. 清图压力趋势 ──
  function pressureTrendChart(container, rec) {
    if (!isAvailable() || !rec || !rec.dist || !rec.dist.perMinute) return null;
    const pm = rec.dist.perMinute.rows;
    const categories = pm.map((r) => 'M' + r.minute);
    const option = mergeOption({
      tooltip: { trigger: 'axis' },
      legend: { data: ['平均活跃敌人', '最大活跃敌人', '估算清图量', '高压线'], top: 0 },
      xAxis: { type: 'category', data: categories },
      yAxis: { type: 'value', name: '数量' },
      series: [
        {
          name: '平均活跃敌人',
          type: 'line',
          smooth: true,
          showSymbol: false,
          lineStyle: { width: 2, color: COLORS.cyan },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(0,240,255,0.25)' },
              { offset: 1, color: 'rgba(0,240,255,0.02)' },
            ]),
          },
          data: pm.map((r) => r.liveAvg.toFixed(1)),
          markLine: {
            silent: true,
            /* 标签交给图例展示，不在绘图区内贴字，避免遮挡柱线内容 */
            data: [{ yAxis: 10, label: { show: false }, lineStyle: { color: COLORS.red, type: 'dashed', width: 1.5 } }],
          },
        },
        {
          name: '最大活跃敌人',
          type: 'line',
          smooth: true,
          showSymbol: false,
          lineStyle: { width: 1, color: COLORS.magenta, type: 'dotted' },
          data: pm.map((r) => r.liveMax),
        },
        {
          name: '估算清图量',
          type: 'bar',
          barWidth: '35%',
          itemStyle: { color: 'rgba(0,240,255,0.15)', borderColor: COLORS.cyan, borderWidth: 1 },
          data: pm.map((r) => r.cleared),
        },
        /* 空数据哑系列：仅用于在图例中展示"高压线"图示（红色虚线段），不在绘图区绘制任何内容 */
        {
          name: '高压线',
          type: 'line',
          data: [],
          symbol: 'none',
          silent: true,
          lineStyle: { color: COLORS.red, type: 'dashed', width: 1.5 },
        },
      ],
    });
    const chart = echarts.init(container);
    chart.setOption(option);
    return chart;
  }

  // ── 5. 压力-产出散点图 ──
  function pressureDroneScatter(container, rec) {
    if (!isAvailable() || !rec || !rec.cross || !rec.cross.droneAtPressurePct) return null;
    const points = rec.cross.dronePressurePoints || [];
    const data = [];
    for (const p of points) {
      const futureDrones = rec.drones.filter((t) => t > p.relT && t <= p.relT + 15).length;
      data.push([p.live, futureDrones]);
    }
    if (!data.length) return null;
    const option = mergeOption({
      tooltip: {
        trigger: 'item',
        formatter: function (p) {
          return `压力: ${p.value[0]} 只<br/>随后 15s 无人机: ${p.value[1]} 只`;
        },
      },
      grid: { left: '8%', right: '8%', bottom: '12%', top: '14%' },
      legend: { data: ['高压线'], top: 0, right: 12, textStyle: { fontSize: 11 } },
      xAxis: { type: 'value', name: '生成时活跃敌人', nameLocation: 'middle', nameGap: 22 },
      yAxis: { type: 'value', name: '随后 15s 无人机数', nameLocation: 'middle', nameGap: 28 },
      series: [
        {
          type: 'scatter',
          symbolSize: 8,
          itemStyle: {
            color: COLORS.green,
            shadowBlur: 8,
            shadowColor: COLORS.green,
            opacity: 0.85,
          },
          data,
          markLine: {
            silent: true,
            /* 标签交给图例展示，不在绘图区内贴字，避免遮挡散点 */
            data: [{ xAxis: 10, lineStyle: { color: COLORS.red, type: 'dashed', width: 1.5 }, label: { show: false } }],
          },
        },
        /* 空数据哑系列：仅用于在图例中展示"高压线"图示（红色虚线段） */
        {
          name: '高压线',
          type: 'line',
          data: [],
          symbol: 'none',
          silent: true,
          lineStyle: { color: COLORS.red, type: 'dashed', width: 1.5 },
        },
      ],
    });
    const chart = echarts.init(container);
    chart.setOption(option);
    return chart;
  }

  // ── 6. 高压恢复时间线 ──
  function recoveryTimeline(container, rec) {
    if (!isAvailable() || !rec || !rec.cross || !rec.cross.recoveryEvents) return null;
    const events = rec.cross.recoveryEvents;
    if (!events.length) return null;
    // 将恢复事件按顺序展示为横向条形
    const option = mergeOption({
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      grid: { left: '3%', right: '8%', bottom: '12%', top: '4%', containLabel: true },
      xAxis: { type: 'value', name: '恢复时间(s)', nameLocation: 'middle', nameGap: 30, max: (value) => Math.max(value.max, 30), axisLabel: { color: COLORS.text } },
      yAxis: { type: 'category', data: events.map((_, i) => '事件 ' + (i + 1)), inverse: true, axisLabel: { color: COLORS.text } },
      series: [
        {
          type: 'bar',
          barWidth: '60%',
          itemStyle: {
            color: function (p) {
              const v = p.value;
              if (v <= 5) return COLORS.green;
              if (v <= 15) return COLORS.amber;
              return COLORS.red;
            },
            borderRadius: [0, 4, 4, 0],
            shadowBlur: 8,
            shadowColor: 'rgba(255,0,170,0.4)',
          },
          emphasis: { itemStyle: { shadowBlur: 16, shadowColor: 'rgba(255,255,255,0.5)' } },
          data: events,
        },
      ],
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
    timelineOverview,
    spawnRateChart,
    droneTrendChart,
    pressureTrendChart,
    pressureDroneScatter,
    recoveryTimeline,
    dispose,
    COLORS,
  };
})();
