/* 通用任务视图 ECharts 图表封装
 * 与 disruptionCharts.js / arbitrationCharts.js 同一套赛博朋克辉光风格：
 * 深色透明背景、霓虹系列色、暗网格、玻璃态 tooltip。
 * 所有工厂函数返回 echarts 实例，调用方负责 dispose；echarts 不可用时返回 null，
 * 视图层据此回退手写 SVG 或跳过该图。
 *
 * 数据契约（解析器 general.js 产出，全部字段可能缺失，调用前需自行容错）：
 *   rec.liveSamples   = [{t, live}]      场上敌数采样（绝对秒）
 *   rec.killEvents    = [t, ...]         击杀事件时刻（绝对秒，升序）
 *   rec.openingEndT   = number | null    击杀首个敌人的时刻（绝对秒）
 *   rec.stalkerEvents = [{startT, endT|null}]  Stalker 入侵时段（绝对秒）
 *   段对象（waves/survivalSegs/interSegs）带 startT/endT/duration，末段可能 incomplete:true
 */
window.WF = window.WF || {};

WF.generalCharts = (function () {
  const U = WF.utils;

  // ── 赛博朋克配色（与中断/仲裁一致） ──
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

  // inside + slider 缩放对（slider 样式与中断/仲裁分页一致）
  function _zoomPair() {
    return [
      { type: 'inside', start: 0, end: 100 },
      { type: 'slider', start: 0, end: 100, height: 18, bottom: 4, borderColor: COLORS.axis, fillerColor: 'rgba(0,240,255,0.15)', handleStyle: { color: COLORS.cyan } },
    ];
  }

  /* ── 1. 段耗时柱状图（横轴=段序号，柱高=耗时，tooltip 含段号/耗时/击杀）
        单青色渐变+辉光，直接沿用中断「每轮前10秒击杀数」柱图样式。
        opts = {
          noun:    '波' | '档' | '轮',        // tooltip「第 N 波」量词
          labelOf: function(seg, i) → 段序号,  // 横轴类目
          killsOf: function(seg) → number|null // 段击杀（缺失时 tooltip 不含该行）
        } ── */
  function segDurationChart(container, segs, opts) {
    if (!isAvailable() || !Array.isArray(segs) || !segs.length) return null;
    opts = opts || {};
    const noun    = opts.noun || '段';
    const labelOf = typeof opts.labelOf === 'function' ? opts.labelOf : function (sg, i) { return i + 1; };
    const killsOf = typeof opts.killsOf === 'function' ? opts.killsOf : function () { return null; };

    const grad = new echarts.graphic.LinearGradient(0, 0, 0, 1, [
      { offset: 0, color: 'rgba(0,240,255,0.95)' },
      { offset: 0.55, color: 'rgba(0,180,220,0.68)' },
      { offset: 1, color: 'rgba(0,90,130,0.28)' },
    ]);
    const data = segs.map((sg, i) => {
      const dur = (sg && typeof sg.duration === 'number') ? sg.duration : 0;
      const kills = killsOf(sg);
      return {
        value: +dur.toFixed(1),
        segNo: labelOf(sg, i),
        kills: (typeof kills === 'number' && isFinite(kills)) ? kills : null,
        incomplete: !!(sg && sg.incomplete),
        itemStyle: {
          color: grad,
          borderRadius: [3, 3, 0, 0],
          shadowBlur: 10,
          shadowColor: 'rgba(0,240,255,0.45)',
        },
      };
    });

    const option = mergeOption({
      tooltip: {
        trigger: 'item',
        formatter: function (p) {
          const d = p.data || {};
          let html = `<div style="font-weight:bold;margin-bottom:4px;">第 ${d.segNo} ${noun}${d.incomplete ? '（未打完）' : ''}</div>`
            + `<div>耗时：${U.fmtDuration(d.value)}</div>`;
          if (d.kills != null) html += `<div>击杀：${d.kills}</div>`;
          return html;
        },
      },
      grid: { left: '3%', right: '4%', bottom: data.length > 30 ? '17%' : '10%', top: '12%', containLabel: true },
      xAxis: { type: 'category', data: data.map((d) => String(d.segNo)) },
      yAxis: { type: 'value', name: '秒' },
      dataZoom: data.length > 30 ? _zoomPair() : [{ type: 'inside', start: 0, end: 100 }],
      series: [{
        type: 'bar',
        barMaxWidth: 26,
        data,
        emphasis: { itemStyle: { shadowBlur: 18, shadowColor: 'rgba(0,240,255,0.8)' } },
      }],
    });
    const chart = echarts.init(container);
    chart.setOption(option);
    return chart;
  }

  /* ── 2. 场上敌量曲线（X=任务相对秒，Y=场上敌数，青色面积+辉光）
        沿用中断敌量曲线视觉，但不含「每轮前 10 秒」红色高亮（中断战术专属）。
        markLine：每段起点（虚线+段号）；
        markArea：开局段（青紫半透明，标注「开局」）、撤离段（品红半透明，标注「撤离」）、
                  Stalker 时段（红色半透明竖带，标注「Stalker」）。
        segs 为视图层归一化后的段数组：[{startT, endT, no, incomplete}]（可缺省/缺字段）。 ── */
  function liveCountChart(container, rec, segs) {
    if (!isAvailable() || !rec) return null;
    const start = rec.startT;
    const dur   = rec.totalDuration;
    if (start == null || !(dur > 0)) return null;
    const samples = (Array.isArray(rec.liveSamples) ? rec.liveSamples : [])
      .map((p) => ({ relT: (p && p.t) - start, live: p && p.live }))
      .filter((p) => isFinite(p.relT) && isFinite(p.live) && p.relT >= -0.5 && p.relT <= dur + 0.5)
      .sort((a, b) => a.relT - b.relT);
    if (!samples.length) return null;

    const data = samples.map((p) => [+Math.max(0, p.relT).toFixed(2), p.live]);
    const segList = Array.isArray(segs) ? segs.filter((sg) => sg && sg.startT != null) : [];

    // 每段起点细分隔虚线；段数少时全标注，段数多时每 5 段标注（沿用中断每 5 轮标 R# 的密度口径）
    const showAll = segList.length <= 12;
    const lines = segList.map((sg, i) => {
      const no = sg.no != null ? sg.no : i + 1;
      return {
        xAxis: +Math.max(0, sg.startT - start).toFixed(2),
        label: {
          show: showAll || i === 0 || no % 5 === 0,
          formatter: '#' + no,
          color: COLORS.muted, fontSize: 10, position: 'insideEndTop',
        },
        lineStyle: { color: 'rgba(255,255,255,0.14)', width: 1, type: 'dashed' },
      };
    });

    const areas = [];
    // 开局段：任务开始 → 击杀首个敌人（openingEndT − startT > 0.5s 才画），青紫半透明
    const openingDur = (rec.openingEndT != null) ? rec.openingEndT - start : 0;
    if (openingDur > 0.5) {
      areas.push([
        { xAxis: 0, itemStyle: { color: 'rgba(99,102,241,0.12)' },
          label: { show: true, formatter: '开局', color: '#a6b8ff', fontSize: 10, position: 'insideTop' } },
        { xAxis: +Math.min(dur, openingDur).toFixed(2) },
      ]);
    }
    // 撤离段：最后一段结束 → 尾帧（仅当该段非 incomplete 且差值 > 0.5s 才画），品红半透明
    const lastSeg = segList.length ? segList[segList.length - 1] : null;
    const extractDur = (lastSeg && !lastSeg.incomplete && rec.endT != null && lastSeg.endT != null)
      ? rec.endT - lastSeg.endT : 0;
    if (extractDur > 0.5) {
      const ex0 = Math.max(0, Math.min(dur, lastSeg.endT - start));
      const ex1 = Math.max(0, Math.min(dur, rec.endT - start));
      if (ex1 > ex0) {
        areas.push([
          { xAxis: +ex0.toFixed(2), itemStyle: { color: 'rgba(255,0,170,0.10)' },
            label: { show: true, formatter: '撤离', color: '#f0a6ff', fontSize: 10, position: 'insideTop' } },
          { xAxis: +ex1.toFixed(2) },
        ]);
      }
    }
    // Stalker 入侵时段：红色半透明竖带；endT 缺失视为持续至任务结束
    (Array.isArray(rec.stalkerEvents) ? rec.stalkerEvents : []).forEach((ev) => {
      if (!ev || ev.startT == null) return;
      const evEndAbs = ev.endT != null ? ev.endT : (rec.endT != null ? rec.endT : start + dur);
      const s0 = Math.max(0, Math.min(dur, ev.startT - start));
      const s1 = Math.max(0, Math.min(dur, evEndAbs - start));
      if (!(s1 > s0)) return;
      areas.push([
        { xAxis: +s0.toFixed(2), itemStyle: { color: 'rgba(255,51,51,0.12)' },
          label: { show: true, formatter: 'Stalker', color: '#ff6b7d', fontSize: 10, position: 'insideTop' } },
        { xAxis: +s1.toFixed(2) },
      ]);
    });

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
    segDurationChart,
    liveCountChart,
    dispose,
    COLORS,
  };
})();
