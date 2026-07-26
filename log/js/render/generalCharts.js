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
    try {
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
    } catch (error) {
      console.error('segDurationChart error:', error);
      return null;
    }
  }

  /* ── 2. 场上敌量曲线（X=任务相对秒，Y=场上敌数，青色面积+辉光）
        沿用中断敌量曲线视觉，但不含「每轮前 10 秒」红色高亮（中断战术专属）。
        markLine：每段起点（虚线+段号）；
        markArea：开局段（青紫半透明，标注「开局」）、撤离段（品红半透明，标注「撤离」）、
                  Stalker 时段（红色半透明竖带，标注「Stalker」）。
        segs 为视图层归一化后的段数组：[{startT, endT, no, incomplete}]（可缺省/缺字段）。 ── */
  function liveCountChart(container, rec, segs) {
    if (!isAvailable() || !rec) return null;
    try {
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
        grid: { left: '3%', right: '4%', bottom: '10%', top: '14%', containLabel: true },
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
    } catch (error) {
      console.error('liveCountChart error:', error);
      return null;
    }
  }

  // ── 通用 dispose 辅助 ──
  function dispose(chart) {
    if (chart && typeof chart.dispose === 'function') chart.dispose();
  }

  /* ═══════════════════════════════════════════════════════════════
     P0 级图表（复用仲裁分析逻辑，去除无人机/生息相关字段）
     适用于：防御、镜像防御、生存、拦截、挖掘、叛逃、传承种收割、
           虚空覆涌、虚空洪流、虚空决战、元素转换、INFESTED 资源回收、
           Nethercells、联结生存
     ═══════════════════════════════════════════════════════════════ */

  // ── 分模式压力画像（与仲裁保持一致：镜像防御/拦截/生存/防御各自校准阈值）──
  const PRESSURE_DEFAULT = { high: 12, recovery: 10, bands: [4, 9, 14, 20] };
  const PRESSURE_BY_MODE = {
    '防御':               { high: 12, recovery: 10, bands: [4, 9, 14, 20] },
    '镜像防御':           { high: 28, recovery: 20, bands: [17, 23, 30, 36] },
    '生存':               { high: 12, recovery: 10, bands: [4, 9, 14, 20] },
    '拦截':               { high: 16, recovery: 13, bands: [9, 14, 20, 26] },
    '挖掘':               { high: 12, recovery: 10, bands: [4, 9, 14, 20] },
    '叛逃':               { high: 12, recovery: 10, bands: [4, 9, 14, 20] },
    '传承种收割':         { high: 12, recovery: 10, bands: [4, 9, 14, 20] },
    '虚空覆涌':           { high: 12, recovery: 10, bands: [4, 9, 14, 20] },
    '虚空洪流':           { high: 12, recovery: 10, bands: [4, 9, 14, 20] },
    '虚空决战':           { high: 12, recovery: 10, bands: [4, 9, 14, 20] },
    '元素转换':           { high: 12, recovery: 10, bands: [4, 9, 14, 20] },
    'INFESTED 资源回收':  { high: 12, recovery: 10, bands: [4, 9, 14, 20] },
    'Nethercells':        { high: 12, recovery: 10, bands: [4, 9, 14, 20] },
    '联结生存':           { high: 12, recovery: 10, bands: [4, 9, 14, 20] },
  };
  function pressureOf(rec) {
    return (rec && rec.endlessTypeCN && PRESSURE_BY_MODE[rec.endlessTypeCN]) || PRESSURE_DEFAULT;
  }

  // ── 1. 任务时间轴总览（每分钟：平均/峰值活跃敌人、生成数、击杀数）──
  function timelineOverview(container, rec) {
    if (!isAvailable() || !rec || !rec.dist || !rec.dist.perMinute) return null;
    const pm = rec.dist.perMinute.rows;
    const categories = pm.map((r) => 'M' + r.minute);

    const option = mergeOption({
      tooltip: {
        formatter: function (params) {
          let html = `<div style="font-weight:bold;margin-bottom:4px;">${params[0].axisValue}</div>`;
          params.forEach((p) => {
            if (p.seriesName === '生成数' || p.seriesName === '击杀数') {
              html += `<div>${p.marker} ${p.seriesName}: ${p.data.value || p.data}</div>`;
            } else {
              html += `<div>${p.marker} ${p.seriesName}: ${p.value}</div>`;
            }
          });
          return html;
        },
      },
      legend: { top: 4, right: 12, itemGap: 20, data: ['平均活跃敌人', '最大活跃敌人', '生成数', '击杀数'], textStyle: { fontSize: 12, color: COLORS.text }, icon: 'roundRect' },
      grid: { left: '3%', right: '4%', bottom: '16%', top: '22%', containLabel: true },
      xAxis: { type: 'category', data: categories, boundaryGap: false },
      yAxis: [
        { type: 'value', name: '活跃敌人', position: 'left', axisLabel: { color: COLORS.cyan } },
        { type: 'value', name: '数量', position: 'right', max: Math.max(1, ...pm.map((r) => r.spawn)) * 1.5, axisLabel: { color: COLORS.amber } },
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
          name: '生成数',
          type: 'bar',
          yAxisIndex: 1,
          barWidth: '35%',
          itemStyle: { color: 'rgba(255,170,0,0.25)', borderColor: COLORS.amber, borderWidth: 1 },
          data: pm.map((r) => r.spawn),
        },
        {
          name: '击杀数',
          type: 'bar',
          yAxisIndex: 1,
          barWidth: '35%',
          itemStyle: { color: 'rgba(0,255,136,0.25)', borderColor: COLORS.green, borderWidth: 1 },
          data: pm.map((r) => r.kills || 0),
        },
      ],
    });

    const chart = echarts.init(container);
    chart.setOption(option);
    return chart;
  }

  // ── 2. 清图压力趋势（高压线随分模式画像动态）──
  function pressureTrendChart(container, rec) {
    if (!isAvailable() || !rec || !rec.dist || !rec.dist.perMinute) return null;
    const pm = rec.dist.perMinute.rows;
    const categories = pm.map((r) => 'M' + r.minute);
    const p = pressureOf(rec);

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
            data: [{ yAxis: p.high, label: { show: false }, lineStyle: { color: COLORS.red, type: 'dashed', width: 1.5 } }],
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
        /* 哑系列：仅用于在图例中展示"高压线"图示（红色虚线段），不在绘图区绘制任何内容 */
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

  // ── 3. 高压恢复时间线──
  function recoveryTimeline(container, rec) {
    if (!isAvailable() || !rec || !rec.cross || !rec.cross.recoveryEvents) return null;
    const events = rec.cross.recoveryEvents;
    if (!events.length) return null;
    const p = pressureOf(rec);

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
            color: function (par) {
              const v = par.value;
              if (v <= p.recovery / 2) return COLORS.green;
              if (v <= p.recovery) return COLORS.amber;
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

  // ── 4. 刷怪数量期望表（仅 Defense/镜像防御：waveBudgets 有数据时显示）──
  function waveBudgetChart(container, rec) {
    if (!isAvailable() || !rec || !rec.waveBudgets || !rec.waveBudgets.length) return null;
    const budgets = rec.waveBudgets;
    const actuals = rec.waveActuals || [];
    const categories = budgets.map((w) => 'W' + w.wave);

    const actualMap = {};
    for (const a of actuals) actualMap[a.wave] = a.actual;

    const rates = budgets.map((w) => {
      const act = actualMap[w.wave] != null ? actualMap[w.wave] : 0;
      return w.budget > 0 ? +(act / w.budget * 100).toFixed(1) : 0;
    });

    // Tier 分界 markLine
    const tierLines = [];
    let lastTier = -1;
    for (let i = 0; i < budgets.length; i++) {
      if (budgets[i].tier > lastTier) {
        if (lastTier >= 0) {
          tierLines.push({
            xAxis: categories[i],
            label: { formatter: 'T' + lastTier + '→T' + budgets[i].tier, color: COLORS.muted, fontSize: 10, position: 'insideEndTop' },
            lineStyle: { color: COLORS.red, type: 'dashed', width: 1 },
          });
        }
        lastTier = budgets[i].tier;
      }
    }

    const budgetGrad = new echarts.graphic.LinearGradient(0, 0, 0, 1, [
      { offset: 0, color: 'rgba(0,240,255,0.85)' },
      { offset: 1, color: 'rgba(0,140,200,0.25)' },
    ]);
    const actualGrad = new echarts.graphic.LinearGradient(0, 0, 0, 1, [
      { offset: 0, color: 'rgba(255,170,0,0.85)' },
      { offset: 1, color: 'rgba(200,120,0,0.25)' },
    ]);

    const option = mergeOption({
      tooltip: {
        trigger: 'axis',
        formatter: function (params) {
          const idx = params[0].dataIndex;
          const w = budgets[idx];
          const act = actualMap[w.wave] != null ? actualMap[w.wave] : 0;
          const rate = rates[idx];
          const gap = w.budget - act;
          let html = `<div style="font-weight:bold;margin-bottom:4px;">W${w.wave}（tier-${w.tier}）</div>`;
          html += `<div>${params[0].marker} 预算: ${w.budget}</div>`;
          html += `<div>${params[1].marker} 实际: ${act}</div>`;
          html += `<div>${params[2].marker} 达成率: ${rate}%</div>`;
          html += `<div style="color:${COLORS.muted}">Eximus: ${w.eximusPct}% ｜ 同屏: ${w.simultaneous}</div>`;
          if (gap > 0) html += `<div style="color:${COLORS.red}">缺口: ${gap}只</div>`;
          return html;
        },
      },
      legend: { top: 0, right: 12, itemGap: 20, data: ['预算', '实际', '达成率'], textStyle: { fontSize: 12, color: COLORS.text } },
      grid: { left: '3%', right: '6%', bottom: '12%', top: '18%', containLabel: true },
      xAxis: {
        type: 'category',
        data: categories,
        axisLabel: { color: COLORS.muted, fontSize: 10, interval: Math.max(0, Math.floor(categories.length / 20)) },
      },
      yAxis: [
        { type: 'value', name: '敌人数量', position: 'left', axisLabel: { color: COLORS.cyan }, splitLine: { lineStyle: { color: COLORS.grid } } },
        { type: 'value', name: '达成率', position: 'right', min: 0, max: 120, axisLabel: { color: COLORS.green, formatter: '{value}%' }, splitLine: { show: false } },
      ],
      dataZoom: [
        { type: 'inside', start: 0, end: 100 },
        { type: 'slider', start: 0, end: 100, height: 18, bottom: 2, borderColor: COLORS.axis, fillerColor: 'rgba(0,240,255,0.15)', handleStyle: { color: COLORS.cyan } },
      ],
      series: [
        {
          name: '预算',
          type: 'bar',
          barMaxWidth: 20,
          itemStyle: { color: budgetGrad, borderRadius: [2, 2, 0, 0] },
          data: budgets.map((w) => w.budget),
          markLine: { symbol: 'none', data: tierLines, animation: false },
        },
        {
          name: '实际',
          type: 'bar',
          barMaxWidth: 20,
          itemStyle: { color: actualGrad, borderRadius: [2, 2, 0, 0] },
          data: budgets.map((w) => actualMap[w.wave] != null ? actualMap[w.wave] : 0),
        },
        {
          name: '达成率',
          type: 'line',
          yAxisIndex: 1,
          smooth: true,
          showSymbol: budgets.length <= 30,
          symbolSize: 6,
          lineStyle: { width: 2, color: COLORS.green },
          itemStyle: { color: COLORS.green },
          data: rates,
          markLine: {
            symbol: 'none',
            data: [
              { yAxis: 100, label: { formatter: '100%', color: 'rgba(255,255,255,0.4)', fontSize: 10, position: 'insideEndTop' }, lineStyle: { color: 'rgba(255,255,255,0.2)', type: 'dashed', width: 1 } },
              { yAxis: 95, label: { formatter: '95%', color: 'rgba(255,100,100,0.4)', fontSize: 10, position: 'insideEndTop' }, lineStyle: { color: 'rgba(255,100,100,0.15)', type: 'dotted', width: 1 } },
            ],
            animation: false,
          },
        },
      ],
    });
    const chart = echarts.init(container);
    chart.setOption(option);
    return chart;
  }

  // ── 5. 清图效率分布（liveDist：横向条形图，带高压占比 footer）──
  function liveDistChart(container, rec) {
    if (!isAvailable() || !rec || !rec.dist || !rec.dist.liveDist) return null;
    const ld = rec.dist.liveDist;
    const p = pressureOf(rec);

    const option = mergeOption({
      tooltip: {
        trigger: 'axis',
        formatter: function (params) {
          const d = params[0].data;
          return `${d.label}：${d.pct.toFixed(1)}%（${d.seconds.toFixed(1)}s）`;
        },
      },
      grid: { left: '22%', right: '4%', bottom: '10%', top: '12%', containLabel: true },
      xAxis: { type: 'value', name: '时间占比 %', axisLabel: { color: COLORS.muted } },
      yAxis: { type: 'category', data: ld.rows.map((r) => r.hi == null ? r.lo + '+' : `${r.lo}-${r.hi}`), inverse: true, axisLabel: { color: COLORS.text } },
      series: [{
        name: '驻留占比',
        type: 'bar',
        barWidth: '60%',
        itemStyle: {
          color: function (par) {
            const lo = ld.rows[par.dataIndex].lo;
            if (lo >= p.bands[3]) return COLORS.red;
            if (lo >= p.bands[2]) return COLORS.amber;
            if (lo >= p.bands[1]) return COLORS.cyan;
            return COLORS.green;
          },
        },
        label: { show: true, position: 'right', color: COLORS.text, fontSize: 11, formatter: '{c}%' },
        data: ld.rows.map((r) => ({ value: +r.pct.toFixed(1), label: r.hi == null ? r.lo + '+' : `${r.lo}-${r.hi}`, pct: r.pct, seconds: r.seconds })),
      }],
    });
    const chart = echarts.init(container);
    chart.setOption(option);
    return chart;
  }

  return {
    isAvailable,
    baseOption,
    mergeOption,
    segDurationChart,
    liveCountChart,
    timelineOverview,
    pressureTrendChart,
    recoveryTimeline,
    waveBudgetChart,
    liveDistChart,
    pressureOf,
    dispose,
    COLORS,
  };
})();