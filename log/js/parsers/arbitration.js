/* 仲裁 (Arbitration) 解析器
 * 全部识别逻辑均由本项目对客户端 EE.log 的字段实测归纳得出：
 *   - 磁盾无人机：OnAgentCreated /Npc/CorpusEliteShieldDroneAgent（每行一只，Spawned/MonitoredTicking 字段随行给出）
 *   - 敌人生成数：OnAgentCreated 行的 "Spawned N" 取全程最大值（累计生成计数）
 *   - 存活饱和度：OnAgentCreated 行的 "MonitoredTicking N" 字段（当前受 AI 监控的活跃敌人数），按驻留时长加权分布
 *   - 轮/波边界：DefenseReward::TransitionOut（防御/拦截/镜像防御的每轮结算一次）；
 *                生存则用 SurvivalMission 奖励层
 *   - 主机时长：SS_STARTED 起，至最后一次轮次结算（无尽任务的有效计时终点）
 *   - 队内在场时长：各队伍成员对应网络连接最后一次同步诊断的时间戳，取其中最早出现
 *     静默的一个——反映"全员仍稳定在场"的窗口，常年短于主机时长（房主经常独自续留farm）
 *   - 节点/星球/派系/类型：任务名行 + 关卡资源路径（/Lotus/Levels/.../Proc/<派系>/<关卡名>）
 * 关键修复：无尽任务里 EndOfMatch.lua:Initialize 每轮都会触发，不能据此结束任务，
 *          否则会把一场 1 小时的仲裁误截成开局几分钟。
 */
window.WF = window.WF || {};

WF.ArbitrationParser = (function () {
  const RE = {
    missionName:      /ThemedSquadOverlay\.lua: Mission name:\s*(.+?)\s*$/,
    cachedName:       /ThemedSquadOverlay\.lua: Cached mission name=(.+?)\s*$/,
    voteName:         /ThemedSquadOverlay\.lua: ShowMissionVote\s+(.+?)\s*$/,
    // 节点 (星球) - 仲裁 (SolNodeXXX) —— 尽量拆出节点名、星球名、节点 ID
    nameParts:        /^(.+?)\s*\(([^()]+)\)\s*-\s*仲裁(?:\s*-[^()]*)?(?:\s*\(([A-Za-z0-9_]+?)(?:_EliteAlert)?\))?/,
    nodeIdParen:      /\(([A-Za-z0-9_/]+?)_EliteAlert\)/,
    // 关卡资源路径：/Lotus/Levels/.../Proc/<派系>/<关卡名> —— 关卡名含任务类型关键字
    levelPath:        /\/Lotus\/Levels\/(?:[A-Za-z]+\/)*Proc\/([A-Za-z]+)\/([A-Za-z0-9]+)/,
    stateStarted:     /GameRulesImpl - changing state from SS_WAITING_FOR_PLAYERS to SS_STARTED/,
    stateEnding:      /GameRulesImpl - changing state from SS_STARTED to SS_ENDING/,
    droneCreated:     /OnAgentCreated \/Npc\/CorpusEliteShieldDroneAgent\d*\b/,
    // OnAgentCreated ... Spawned M ... MonitoredTicking K
    agentSpawned:         /OnAgentCreated\b.*?\bSpawned\s+(\d+)\b/,
    agentMonitoredTick:   /\bMonitoredTicking\s+(\d+)\b/,
    defenseReward:    /DefenseReward\.lua: DefenseReward::TransitionOut\b/,
    survivalTier:     /SurvivalMission\.lua: Survival: Gave reward tier (\d+) at ([\d.]+)/,
    interceptionRound:/InterceptionNewRound|InterNewRoundLotusTransmission/,
    // 每个远端队伍连接独立的网络诊断行，形如 "Net [Info]: 2: Retransmit throttle: ..."
    // 连接编号是每名非本机队员各自的通信通道；某一路长时间不再出现即视为该成员早于
    // 主机停止稳定在场（例如提前挂机/切出游戏，房主自己继续 farm 到本轮结算）。
    netPeerLine:      /Net \[Info\]: (\d+): Retransmit throttle/,
  };
  const ARB_NAME_MARK = '- 仲裁';

  // 期望生息常量（本项目按掉落规则实测标定）
  const BASE_DROP       = 0.06;                 // 每只磁盾无人机的基础期望
  const EXTRA_PER_ROUND = 1 + 0.1 * 3;          // 每轮额外 1.3（10% 概率多掉 3）
  const FULL_BUFF_MUL   = 2 * 1.18 * 2 * 1.25;  // 蓝盒×富足×黄盒×祝福 = 5.9（仅作用于无人机项）
  const DRONE_BATCH_GAP = 0.3;                  // 同批次无人机的最大间隔（秒）
  const SAT_DWELL_CAP   = 10;                   // 饱和度采样两点间最大计入驻留（秒）
  const VACUUM_BUCKETS  = [0.5, 1, 1.5, 2, 3, 4, 6, 8, 10, 15, 20, 30, 40, 50]; // 生成间隔分桶上界

  // ── 派系中文名 ──
  const FACTION_ZH = {
    Grineer: 'Grineer', Corpus: 'Corpus', Infested: 'Infested', Infestation: 'Infested',
    Orokin: 'Orokin', Crossfire: '交火', Corrupted: 'Orokin',
  };
  // ── 任务类型：从关卡名/日志事件推断 ──
  const TYPE_KEY = [
    [/Survival/i,      'survival'],
    [/Interception/i,  'interception'],
    [/(LoopDefense|Onslaught)/i, 'loopDefense'],
    [/Defen(s|c)e/i,   'defense'],
    [/Excavation/i,    'excavation'],
    [/Disruption/i,    'disruption'],
    [/(Mobile|MobileDefense)/i, 'mobileDefense'],
    [/Rescue/i,        'rescue'],
    [/Sabotage/i,      'sabotage'],
    [/(Extermination|Exterminate)/i, 'exterminate'],
    [/Capture/i,       'capture'],
    [/Assault/i,       'assault'],
  ];
  const TYPE_NAMES = {
    survival: '生存', defense: '防御', loopDefense: '镜像防御', interception: '拦截',
    excavation: '挖掘', disruption: '中断', mobileDefense: '移动防御', rescue: '救援',
    sabotage: '破坏', exterminate: '歼灭', capture: '捕获', assault: '突袭',
    rounds: '轮次型', unknown: '未知',
  };
  function typeFromLevel(levelName) {
    for (const [re, key] of TYPE_KEY) if (re.test(levelName)) return key;
    return null;
  }
  // 中文任务类型名 → 内部 key（用于节点库回填 missionType）
  const TYPE_NAME_TO_KEY = (() => {
    const map = {};
    Object.keys(TYPE_NAMES).forEach((k) => { map[TYPE_NAMES[k]] = k; });
    return map;
  })();

  /* 节点解析：优先查权威节点库 WF.SOL_NODES（由 solNodes.js 提供，格式：
   *   "Cinxia, 谷神星 (拦截 - Grineer)"），回退到日志内解析出的节点名/星球/派系/类型。 */
  function resolveNode(nodeId, m) {
    const out = {
      node: m.node, planet: m.planet,
      faction: FACTION_ZH[m.faction] || m.faction || null,
      typeKey: m.type, typeName: TYPE_NAMES[m.type] || m.type,
    };
    const db = (typeof WF !== 'undefined' && WF.SOL_NODES) ? WF.SOL_NODES[nodeId] : null;
    if (db) {
      // 格式："节点名, 星球 (类型 - 派系)" 或 "节点名 (类型 - 派系)"
      const mm = /^(.+?)(?:,\s*([^(),]+?))?\s*\(([^()]*?)\s*-\s*([^()]+?)\)\s*$/.exec(db);
      if (mm) {
        out.node    = mm[1].trim();
        if (mm[2]) out.planet = mm[2].trim();
        const tName = (mm[3] || '').trim();
        const fName = (mm[4] || '').trim();
        if (fName) out.faction = fName;
        if (tName) {
          out.typeName = tName;
          if (TYPE_NAME_TO_KEY[tName]) out.typeKey = TYPE_NAME_TO_KEY[tName];
        }
      } else {
        out.node = db;
      }
    }
    return out;
  }

  /* ══════════════════════════════════════════════════════════════
     评分体系（0-120 分，全过程透明可推导，不做任何隐藏加权）
     ══════════════════════════════════════════════════════════════
     子指标一：生息效率 —— 期望生息/小时 相对一个"高标准基准"的达成度。基准优先
       取该节点的历史最高生息速率（见 WF.ArbNodeBaseline，不同节点天然产出节奏
       不同，不能用同一个数字硬套所有节点）；某节点暂无人上传过战绩时，退回
       默认基准 600/小时。基准的 60% 记 0 分，
       达到基准记 100 分，二者之间用凸曲线过渡（低分段增长慢，越接近基准每一分
       进步换来的得分越多）；超过基准后曲线继续外推，允许突破 100。
     子指标二：击杀效率 —— 由"杂兵负荷比"（敌人生成 ÷ 无人机生成）换算，
       负荷比越低代表火力越集中在无人机身上、杂兵清理越干净。负荷比 20 记 0 分，
       5 记 100 分，同样用凸曲线过渡，越逼近满分曲线越陡，允许突破 100。
     综合：综合熟练度 —— 两个子指标先按各自权重（约 54:46，生息效率略重）做"弹性
       替代"加权（不是普通加权平均——两者不能互相完全替代，任一项偏低都会明显
       拉低总分，兼顾发展的队伍得分才会高于单项突出但另一项拖后腿的队伍），再经一条
       平滑曲线拉伸至百分比（低分段被压缩、越接近满分提升越明显），两个子指标同时
       达到 100 时综合熟练度精确为 100。
     最终把综合熟练度乘以 1.2 映射到 0-120 分，为顶尖表现留出"超出满分"的展示空间。
     ══════════════════════════════════════════════════════════════ */
  const ESS_BASELINE     = 600;   // 默认基准（该节点暂无分节点基准数据时兜底使用）
  const ESS_FLOOR_RATIO  = 0.6;   // 基准的 60% 记 0 分
  const ESS_CURVE_K      = 3;     // 生息效率凸曲线陡峭度
  const SPARSITY_FLOOR   = 20;    // 负荷比 20 记 0 分
  const SPARSITY_TOP     = 5;     // 负荷比 5 记 100 分
  const KILL_CURVE_K     = 3;     // 击杀效率凸曲线陡峭度
  const W_ESS  = Math.PI / (Math.PI + Math.E);  // ≈ 0.536，生息效率权重
  const W_KILL = Math.E  / (Math.PI + Math.E);  // ≈ 0.464，击杀效率权重
  const CES_RHO   = 0.6;   // 弹性替代的替代弹性参数（<1，任一项偏低都拖累整体）
  const FINAL_POW = 1.4;   // 末端平滑曲线指数（低段压缩、高段陡峭）

  function clamp(x, lo, hi) { return Math.max(lo, Math.min(hi, x)); }
  // 凸曲线映射：progress∈[0,1]→[0,100]，可外推至 >100（progress>1 时）
  function convexCurve(progress, k) {
    return 100 * (Math.exp(k * progress) - 1) / (Math.exp(k) - 1);
  }
  // 生息效率（%）：baseline 缺省为默认基准 600/时，若调用方传入该节点的
  // 历史最高生息速率（来自分节点基准数据），则改用节点专属基准换算，更公平。
  function essenceEfficiency(perHour, baseline) {
    const base = baseline > 0 ? baseline : ESS_BASELINE;
    const floor = base * ESS_FLOOR_RATIO;
    if (perHour <= floor) return 0;
    const progress = (perHour - floor) / (base - floor);
    return Math.max(0, convexCurve(progress, ESS_CURVE_K));
  }
  // 击杀效率（%）：负荷比越低越好
  function killEfficiency(sparsity) {
    if (!isFinite(sparsity) || sparsity <= 0) return 0;
    if (sparsity >= SPARSITY_FLOOR) return 0;
    const progress = (SPARSITY_FLOOR - sparsity) / (SPARSITY_FLOOR - SPARSITY_TOP);
    return Math.max(0, convexCurve(progress, KILL_CURVE_K));
  }
  // 综合熟练度（%）：两项弹性替代加权 + 末端平滑拉伸
  function proficiency(essEffPct, killEffPct) {
    const a = Math.max(0, essEffPct), b = Math.max(0, killEffPct);
    if (a === 0 && b === 0) return 0;
    const ces = Math.pow(
      W_ESS * Math.pow(a, CES_RHO) + W_KILL * Math.pow(b, CES_RHO),
      1 / CES_RHO
    );
    const capped = clamp(ces, 0, 999); // 极端情况下防止数值溢出
    return 100 * Math.pow(clamp(capped / 100, 0, 10), FINAL_POW);
  }
  function computeScore(essEffPct, killEffPct) {
    return Math.round(clamp(proficiency(essEffPct, killEffPct) * 1.2, 0, 120));
  }
  function scoreTierName(s) {
    if (s >= 101) return '巅峰';
    if (s >= 80)  return '优秀';
    if (s >= 70)  return '良好';
    if (s >= 60)  return '及格';
    return '待提升';
  }

  // ── 分布计算：无人机生成间隔（相邻生成时间差，按时长加权分桶）──
  function vacuumDist(times) {
    if (times.length < 2) return null;
    const edges = VACUUM_BUCKETS;
    const n = edges.length + 1;
    const bucket = new Array(n).fill(0);
    let total = 0, over2 = 0, maxGap = 0;
    for (let i = 0; i < times.length - 1; i++) {
      const g = times[i + 1] - times[i];
      if (g <= 0) continue;
      let bi = edges.findIndex((e) => g <= e);
      if (bi < 0) bi = n - 1;
      bucket[bi] += g; total += g;
      if (g > 2) over2 += g;
      if (g > maxGap) maxGap = g;
    }
    if (total <= 0) return null;
    const rows = bucket.map((v, i) => ({
      lo: i === 0 ? 0 : edges[i - 1],
      hi: i < edges.length ? edges[i] : null,
      seconds: v, pct: v / total * 100,
    }));
    return { rows, over2Pct: over2 / total * 100, maxGap };
  }

  // ── 分布计算：清图效率（受监控活跃敌人数采样，按驻留时长加权，5 宽分桶）──
  function saturationDist(samples) {
    if (samples.length < 2) return null;
    let maxLive = 1;
    for (const s of samples) if (s.live > maxLive) maxLive = s.live;
    const nb = Math.max(1, Math.ceil((maxLive + 1) / 5));
    const bucket = new Array(nb).fill(0);
    let total = 0, geq15 = 0;
    for (let i = 0; i < samples.length - 1; i++) {
      const dwell = samples[i + 1].t - samples[i].t;
      if (dwell <= 0 || dwell > SAT_DWELL_CAP) continue;
      const live = samples[i].live;
      const bi = Math.min(Math.floor(live / 5), nb - 1);
      bucket[bi] += dwell; total += dwell;
      if (live >= 15) geq15 += dwell;
    }
    if (total <= 0) return null;
    const rows = bucket.map((v, i) => ({
      lo: 5 * i, hi: i < nb - 1 ? 5 * i + 4 : null,
      seconds: v, pct: v / total * 100,
    }));
    return { rows, maxLive, geq15Pct: geq15 / total * 100 };
  }

  // ── 分布计算：无人机刷新连续度（同批次数量直方图）──
  function consecutiveDist(times) {
    if (!times.length) return null;
    const sizes = [1];
    for (let i = 1; i < times.length; i++) {
      if (times[i] - times[i - 1] > DRONE_BATCH_GAP) sizes.push(1);
      else sizes[sizes.length - 1]++;
    }
    let maxSize = 1;
    for (const s of sizes) if (s > maxSize) maxSize = s;
    const hist = new Array(maxSize).fill(0);
    for (const s of sizes) if (s >= 1 && s <= maxSize) hist[s - 1]++;
    const totalBatches = sizes.length;
    const rows = hist.map((c, i) => ({ size: i + 1, count: c, pct: totalBatches > 0 ? c / totalBatches * 100 : 0 }));
    return { rows, totalBatches };
  }

  // ── 分布计算：按分钟切片的无人机生成 / 敌人生成 / 敌人击杀速率趋势 ──
  // 击杀速率为近似推算，非直接日志字段：本分钟净消灭数 ≈ 本分钟新增生成数 −
  // 本分钟末活跃监控数相对上一分钟末的净变化（若活跃数下降说明消灭快于生成）。
  function perMinuteTrend(buckets, durationSec) {
    if (!buckets || !buckets.length) return null;
    const totalMin = Math.max(1, Math.ceil(durationSec / 60));
    const rows = [];
    let prevLive = 0;
    for (let i = 0; i < totalMin; i++) {
      const b = buckets[i] || { drones: 0, spawn: 0, liveEnd: null };
      const liveEnd = b.liveEnd != null ? b.liveEnd : prevLive;
      const killed = Math.max(0, b.spawn - (liveEnd - prevLive));
      rows.push({ minute: i + 1, drones: b.drones, spawn: b.spawn, killed });
      prevLive = liveEnd;
    }
    const maxDrones = Math.max(1, ...rows.map((r) => r.drones));
    const maxSpawn  = Math.max(1, ...rows.map((r) => r.spawn));
    const maxKilled = Math.max(1, ...rows.map((r) => r.killed));
    return { rows, maxDrones, maxSpawn, maxKilled };
  }

  function create() {
    const records = [];
    const sq   = WF.squadMixin.create();
    const chat = WF.chatMixin.create();
    let m = null;

    function newMission(t, name) {
      m = {
        nameLineT: t,
        rawName:   name || null,
        node:      null,
        planet:    null,
        nodeId:    null,
        faction:   null,
        levelName: null,
        startedT:  null,
        type:      'unknown',
        droneTimes: [],      // 无人机生成绝对时刻（秒）
        maxSpawned: 0,       // 累计敌人生成数（Spawned 峰值）
        satSamples: [],      // {t(相对), live}
        rounds:     0,       // 已结算轮/波数
        lastRoundT: null,    // 最后一次轮次结算的绝对时刻（无尽任务有效终点）
        roundBoundaries: [], // {label, t(绝对), droneCum, spawnedCum} 每轮结算时的快照
        netLastSeen: {},     // 连接编号 -> 最后一次网络诊断行的绝对时刻
        minuteBuckets: [],   // 按分钟切片：[{drones, spawn}]，用于生成 / 敌人速率趋势
        endT:       null,
      };
    }

    // 把某个时间点的一次增量计入对应分钟切片（drones 或 spawn 累加 delta）
    function bumpMinute(t, field, delta) {
      const idx = Math.floor((t - m.startedT) / 60);
      if (idx < 0) return;
      if (!m.minuteBuckets[idx]) m.minuteBuckets[idx] = { drones: 0, spawn: 0, liveEnd: null };
      m.minuteBuckets[idx][field] += delta;
    }
    // 记录某个时间点所在分钟切片"末尾时刻"的活跃监控数快照（同一分钟内反复覆盖，
    // 最终留下的就是这一分钟最后一次采样值，供击杀速率近似推算使用）
    function setMinuteLive(t, live) {
      const idx = Math.floor((t - m.startedT) / 60);
      if (idx < 0) return;
      if (!m.minuteBuckets[idx]) m.minuteBuckets[idx] = { drones: 0, spawn: 0, liveEnd: null };
      m.minuteBuckets[idx].liveEnd = live;
    }

    // 从 OnAgentCreated 行采样：累计生成峰值 + 活跃敌人饱和度
    function sampleAgentLine(line, t) {
      const sp = RE.agentSpawned.exec(line);
      if (sp) {
        const v = parseInt(sp[1], 10);
        if (v > m.maxSpawned) { bumpMinute(t, 'spawn', v - m.maxSpawned); m.maxSpawned = v; }
      }
      const mt = RE.agentMonitoredTick.exec(line);
      if (mt) {
        const live = parseInt(mt[1], 10);
        m.satSamples.push({ t: t - m.startedT, live });
        setMinuteLive(t, live);
      }
    }

    function applyName(raw) {
      if (!raw) return;
      const clean = raw.replace(/\s*-1\s*$/, '').trim();
      const mm = RE.nameParts.exec(clean);
      if (mm) {
        m.node   = mm[1].trim();
        m.planet = mm[2].trim();
        if (mm[3]) m.nodeId = mm[3];
      } else if (!m.node) {
        m.node = clean.replace(ARB_NAME_MARK, '').replace(/-\s*$/, '').trim();
      }
    }

    function recordRoundBoundary(label, t) {
      m.roundBoundaries.push({ label, t, droneCum: m.droneTimes.length, spawnedCum: m.maxSpawned });
    }

    function finalize(fallbackEndT, viaEnding) {
      if (!m || m.startedT == null) { m = null; return; }
      // 无尽任务的有效终点：最后一次轮次结算；否则退回状态结束/日志末尾
      const hostEnd = (m.rounds > 0 && m.lastRoundT != null) ? m.lastRoundT : fallbackEndT;
      const duration = hostEnd - m.startedT;
      const droneCount = m.droneTimes.length;
      const valid = duration >= 60 && (viaEnding || droneCount > 0);
      if (valid) {
        const rounds     = m.rounds;
        const fromDrones = droneCount * BASE_DROP;
        const fromRounds = rounds * EXTRA_PER_ROUND;
        const total      = fromDrones + fromRounds;
        const fullBuffTotal   = fromDrones * FULL_BUFF_MUL + fromRounds;
        const perHour        = duration > 0 ? total * 3600 / duration : 0;
        const fullBuffPerHour = duration > 0 ? fullBuffTotal * 3600 / duration : 0;
        const perMin         = duration > 0 ? total * 60 / duration : 0;
        const fullBuffPerMin = duration > 0 ? fullBuffTotal * 60 / duration : 0;
        const dronesPerMin   = duration > 0 ? droneCount / (duration / 60) : 0;
        const sparsity       = droneCount > 0 ? m.maxSpawned / droneCount : 0;

        // 权威节点库解析：节点名 / 星球 / 类型 / 派系（优先，回退到日志解析）
        const resolved = resolveNode(m.nodeId, m);

        // 分节点生息效率基准：若已加载到该节点的历史最高生息速率（见
        // WF.ArbNodeBaseline，数据来源见 build_arb_baseline.py），用它替代
        // 默认的 600/时，不同节点天然产出节奏不同、按节点比较更公平；
        // 查不到时（该节点暂无人上传过战绩）退回默认基准。
        const nodeBase = (typeof WF !== 'undefined' && WF.ArbNodeBaseline)
          ? WF.ArbNodeBaseline.lookup(m.nodeId) : null;
        const essBaseline = nodeBase ? nodeBase.perHour : ESS_BASELINE;

        const essEff  = essenceEfficiency(fullBuffPerHour, essBaseline);
        const killEff = killEfficiency(sparsity);
        const prof    = proficiency(essEff, killEff);
        const score   = computeScore(essEff, killEff);

        // 无人机相对时刻（供分布/表格）
        const relTimes = m.droneTimes.map((x) => x - m.startedT);

        // 生息细分（对齐"无人机项 + 轮次奖励期望"口径）
        const droneFullBuff  = fromDrones * FULL_BUFF_MUL;   // 无人机期望生息（满 Buff）
        const roundGuarantee = rounds * 1;                   // 轮次保底
        const roundExtra     = rounds * 0.3;                 // 轮次额外期望（10%×3）

        // 队内在场时长：各连接最后一次诊断时间戳中最早的一个（相对任务开始）。
        // 诊断行本身按网络波动触发、频率并不均匀——样本数过少的连接（<5 次）
        // 大概率只是全程网络很干净、没触发几次诊断，并非真的提前退场，
        // 排除掉这类连接以避免把"信号稀疏"误判成"提前离场"。
        const NET_MIN_SAMPLES = 5;
        const netIdxs = Object.keys(m.netLastSeen).filter((k) => m.netLastSeen[k].count >= NET_MIN_SAMPLES);
        let lastClientEndAbs = null;
        if (netIdxs.length) {
          lastClientEndAbs = Math.min.apply(null, netIdxs.map((k) => m.netLastSeen[k].last));
        }
        const lastClientDuration = (lastClientEndAbs != null && lastClientEndAbs > m.startedT)
          ? lastClientEndAbs - m.startedT : null;

        // 每轮明细：按 roundBoundaries 做相邻差分，得到每轮新增无人机/敌人生成与对应期望生息
        const roundDetail = [];
        let prevT = 0, prevDrone = 0, prevSpawn = 0;
        m.roundBoundaries.forEach((b, i) => {
          const relT = b.t - m.startedT;
          const segDrone = b.droneCum - prevDrone;
          const segSpawn = b.spawnedCum - prevSpawn;
          const segEssence = segDrone * BASE_DROP * FULL_BUFF_MUL + EXTRA_PER_ROUND;
          roundDetail.push({
            index: i + 1, label: b.label,
            durSec: relT - prevT, atSec: relT,
            drones: segDrone, spawned: segSpawn,
            sparsity: segDrone > 0 ? segSpawn / segDrone : null,
            essence: segEssence,
          });
          prevT = relT; prevDrone = b.droneCum; prevSpawn = b.spawnedCum;
        });
        // 末段（未结算的尾巴，仍计入无人机产出但没有轮次保底）
        const tailDrone = droneCount - prevDrone;
        const tailSpawn = m.maxSpawned - prevSpawn;
        if (tailDrone > 0 || tailSpawn > 0) {
          roundDetail.push({
            index: roundDetail.length + 1, label: '未结算尾段',
            durSec: duration - prevT, atSec: duration,
            drones: tailDrone, spawned: tailSpawn,
            sparsity: tailDrone > 0 ? tailSpawn / tailDrone : null,
            essence: tailDrone * BASE_DROP * FULL_BUFF_MUL,
            incomplete: true,
          });
        }

        records.push({
          type:            'arbitration',
          startT:          m.startedT,
          endT:            hostEnd,
          duration,
          lastClientDuration,
          node:            resolved.node,
          planet:          resolved.planet,
          nodeId:          m.nodeId,
          faction:         resolved.faction,
          factionZh:       resolved.faction,
          name:            resolved.node,               // 兼容旧字段
          missionType:     resolved.typeKey,
          missionTypeName: resolved.typeName,
          droneCount,
          drones:          relTimes,
          maxSpawned:      m.maxSpawned,
          sparsity,
          rounds,
          roundDetail,
          dronesPerMin,
          complete:        viaEnding || m.lastRoundT != null,
          essence: {
            fromDrones, fromRounds, total,
            fullBuffTotal, perHour, fullBuffPerHour, perMin, fullBuffPerMin,
            droneFullBuff, roundGuarantee, roundExtra, buffMul: FULL_BUFF_MUL,
          },
          dist: {
            vacuum:      vacuumDist(relTimes),
            saturation:  saturationDist(m.satSamples),
            consecutive: consecutiveDist(m.droneTimes),
            perMinute:   perMinuteTrend(m.minuteBuckets, duration),
          },
          eff: {
            essence: essEff,       // 生息效率 %
            kill:    killEff,      // 击杀效率 %
            proficiency: prof,     // 综合熟练度 %
          },
          essBaseline,                          // 本局评分实际采用的生息效率基准（/时）
          essBaselineIsNode: !!nodeBase,         // 是否命中了节点专属基准（否则为默认基准兜底）
          score,
          scoreTier: scoreTierName(score),
          squadInfo: sq.getSquadInfo(),
          chatLog:   chat.getChatLog(m.startedT, m.startedT, hostEnd),
        });
      }
      m = null;
    }

    return {
      feed(t, line) {
        sq.feed(line);
        chat.feed(t, line);

        // ---- 任务识别 ----
        let nm = null;
        if (line.indexOf('ThemedSquadOverlay.lua') !== -1) {
          const r = RE.missionName.exec(line) || RE.cachedName.exec(line) || RE.voteName.exec(line);
          if (r && r[1].indexOf(ARB_NAME_MARK) !== -1) nm = r[1].trim();
          // 括号形式的节点 ID 兜底
          const v = RE.nodeIdParen.exec(line);
          if (v && m) { if (!m.nodeId) m.nodeId = v[1]; }
        }
        if (nm) {
          if (m && m.startedT != null) finalize(t, false);
          if (!m || m.startedT != null) newMission(t, nm);
          applyName(nm);
          return;
        }
        if (!m) return;

        // 关卡资源路径（派系 + 任务类型），可能在开局前后出现
        if (m.faction == null && line.indexOf('/Lotus/Levels/') !== -1) {
          const lp = RE.levelPath.exec(line);
          if (lp) {
            m.faction = lp[1];
            m.levelName = lp[2];
            const tp = typeFromLevel(lp[2]);
            if (tp && m.type === 'unknown') m.type = tp;
          }
        }

        if (m.startedT == null) {
          // 开局前也可能已经开始刷怪，但计时以 SS_STARTED 为准
          if (RE.stateStarted.test(line)) m.startedT = t;
          return;
        }

        // ---- 任务内事件 ----
        // 磁盾无人机（每行一只）
        if (RE.droneCreated.test(line)) {
          m.droneTimes.push(t);
          bumpMinute(t, 'drones', 1);
          sampleAgentLine(line, t);
          return;
        }
        // 其它单位生成：饱和度采样 + Spawned 峰值
        if (line.indexOf('OnAgentCreated') !== -1) {
          sampleAgentLine(line, t);
          return;
        }
        // 队员网络连接诊断（用于推断"队内在场时长"）
        if (line.indexOf('Retransmit throttle') !== -1) {
          const np = RE.netPeerLine.exec(line);
          if (np) {
            const idx = np[1];
            if (!m.netLastSeen[idx]) m.netLastSeen[idx] = { last: t, count: 0 };
            m.netLastSeen[idx].last = t;
            m.netLastSeen[idx].count++;
          }
          return;
        }

        // 轮/波结算（防御/拦截/镜像防御）
        if (RE.defenseReward.test(line)) {
          m.rounds++;
          m.lastRoundT = t;
          if (m.type === 'unknown') m.type = 'rounds';
          recordRoundBoundary('轮 ' + m.rounds, t);
          return;
        }
        // 生存奖励层（生存任务的轮）
        let r;
        if ((r = RE.survivalTier.exec(line))) {
          m.type = 'survival';
          const tier = parseInt(r[1], 10);
          m.rounds = Math.max(m.rounds, tier);
          m.lastRoundT = t;
          recordRoundBoundary('轮 ' + tier, t);
          return;
        }
        if (m.type === 'unknown' && RE.interceptionRound.test(line)) {
          m.type = 'interception';
          return;
        }

        // 真正的任务结束：状态从 STARTED → ENDING
        if (RE.stateEnding.test(line)) {
          m.endT = t;
          finalize(t, true);
        }
        // 注意：不再用 EndOfMatch.lua:Initialize 结束任务（无尽任务每轮都会触发）
      },

      finish(lastT) {
        if (m && m.startedT != null) finalize(m.endT != null ? m.endT : lastT, m.endT != null);
      },

      results() { return records; },
    };
  }

  return { create, computeScore, scoreTierName, essenceEfficiency, killEfficiency, proficiency };
})();
