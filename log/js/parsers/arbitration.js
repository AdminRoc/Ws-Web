/* 仲裁 (Arbitration) 解析器 v2.0
 * 全部识别逻辑均由本项目对客户端 EE.log 的字段实测归纳得出：
 *   - 磁盾无人机：OnAgentCreated /Npc/CorpusEliteShieldDroneAgent（每行一只，Spawned/MonitoredTicking 字段随行给出）
 *   - 敌人生成数：OnAgentCreated 行的 "Spawned N" 取全程最大值（累计生成计数）
 *   - 敌人生成事件数：OnAgentCreated 行本身的数量（与 Spawned 峰值双轨记录）
 *   - 场上活跃敌人数：OnAgentCreated 行的 "MonitoredTicking N" 字段（当前受 AI 监控的活跃敌人数），按驻留时长加权分布
 *   - 轮/波边界：DefenseReward::TransitionOut（防御/拦截/镜像防御的每轮结算一次）；
 *                生存则用 SurvivalMission 奖励层
 *   - 主机时长：SS_STARTED 起，至最后一次轮次结算（无尽任务的有效计时终点）
 *   - 最后客机时间：任务结束时间 − 最后一个外部玩家实体创建时刻。
 *   - 节点/星球/派系/类型：任务名行 + 关卡资源路径（/Lotus/Levels/.../Proc/<派系>/<关卡名>）
 * 关键修复：无尽任务里 EndOfMatch.lua:Initialize 每轮都会触发，不能据此结束任务，
 *          否则会把一场 1 小时的仲裁误截成开局几分钟。
 * 国际化修复：兼容中英文客户端（简体中文 "- 仲裁" / 英文 "- Arbitration"），
 *          并以 _EliteAlert 节点 ID 后缀作为语言无关的最终兜底，确保任何语言客户端
 *          的日志都能被正确识别为仲裁任务。
 *
 * v2.0 升级：
 *   - 引入 eventStream 原始事件流，所有下游分析基于同一数据源。
 *   - 无人机批次聚类：区分同批次内间隔与批次间间隔。
 *   - 多时间尺度分析：全局 / 轮次 / 分钟 / wave（尽力探测）。
 *   - 敌人双轨统计：Spawned 峰值差分 + 真实生成事件数。
 *   - 交叉分析：压力-产出相关、清图效率指数 CEI、高压恢复。
 *   - 节奏稳定性：参与综合评分，衡量刷新节奏平稳程度。
 *   - 异常诊断：自动标出可能的刷怪卡顿、漏无人机、清图压力过高时段。
 */
window.WF = window.WF || {};

WF.ArbitrationParser = (function () {
  const RE = {
    missionName:      /ThemedSquadOverlay\.lua: Mission name:\s*(.+?)\s*$/,
    cachedName:       /ThemedSquadOverlay\.lua: Cached mission name=(.+?)\s*$/,
    voteName:         /ThemedSquadOverlay\.lua: ShowMissionVote\s+(.+?)\s*$/,
    // 节点 (星球) - 仲裁 (SolNodeXXX) —— 尽量拆出节点名、星球名、节点 ID
    // 国际化：同时兼容中文 "仲裁" 与英文 "Arbitration"（忽略大小写）
    nameParts:        /^(.+?)\s*\(([^()]+)\)\s*-\s*(?:仲裁|Arbitration)(?:\s*-[^()]*)?(?:\s*\(([A-Za-z0-9_]+?)(?:_EliteAlert)?\))?/i,
    nodeIdParen:      /\(([A-Za-z0-9_/]+?)_EliteAlert\)/,
    // 关卡资源路径：/Lotus/Levels/.../Proc/<派系>/<关卡名> —— 关卡名含任务类型关键字
    levelPath:        /\/Lotus\/Levels\/(?:[A-Za-z]+\/)*Proc\/([A-Za-z]+)\/([A-Za-z0-9]+)/,
    stateStarted:     /GameRulesImpl - changing state from SS_WAITING_FOR_PLAYERS to SS_STARTED/,
    stateEnding:      /GameRulesImpl - changing state from SS_STARTED to SS_ENDING/,
    droneCreated:     /OnAgentCreated \/Npc\/CorpusEliteShieldDroneAgent\d*\b/,
    // OnAgentCreated ... Spawned M ... MonitoredTicking K
    agentSpawned:         /OnAgentCreated\b.*?\bSpawned\s+(\d+)\b/,
    agentMonitoredTick:   /\bMonitoredTicking\s+(\d+)\b/,
    // 尝试提取 agent 路径（尽力而为，不同敌人格式可能不一致）
    agentPath:        /OnAgentCreated\s+(\/[^\s]+)/,
    defenseReward:    /DefenseReward\.lua: DefenseReward::TransitionOut\b/,
    survivalTier:     /SurvivalMission\.lua: Survival: Gave reward tier (\d+) at ([\d.]+)/,
    interceptionRound:/InterceptionNewRound|InterNewRoundLotusTransmission/,
    // Wave 相关字段探测（尽力而为）
    waveExplicit:     /wave\s*(\d+)/i,
    waveTotalSpawned: /total spawned in current wave\s*(\d+)/i,
    waveCurrent:      /current wave\s*(\d+)/i,
    // 每个远端队伍连接独立的网络诊断行，形如 "Net [Info]: 2: Retransmit throttle: ..."
    // 连接编号是每名非本机队员各自的通信通道；某一路长时间不再出现即视为该成员早于
    // 主机停止稳定在场（例如提前挂机/切出游戏，房主自己继续 farm 到本轮结算）。
    netPeerLine:      /Net \[Info\]: (\d+): Retransmit throttle/,
    clientCreated:    /Game \[Info\]: CreatePlayerForClient\. id=(\d+), user name=(.+)$/,
  };
  const HUD_REDUX = 'HUD REDUX: Pushing background movie from Update';
  // 国际化：同时匹配中文 "- 仲裁" 与英文 "- Arbitration"（忽略大小写）
  const ARB_NAME_MARK = /-\s*(?:仲裁|Arbitration)\b/i;
  // 语言无关的最终兜底：任何客户端日志中只要出现 _EliteAlert 节点 ID 后缀，即判定为仲裁
  const ARB_ELITE_ALERT = /_EliteAlert\)/;

  // 期望生息常量（本项目按掉落规则实测标定）
  const BASE_DROP       = 0.06;                 // 每只磁盾无人机的基础期望
  const EXTRA_PER_ROUND = 1 + 0.1 * 3;          // 每轮额外 1.3（10% 概率多掉 3）
  const FULL_BUFF_MUL   = 2 * 1.18 * 2 * 1.25;  // 蓝盒×富足×黄盒×祝福 = 5.9（仅作用于无人机项）
  const DRONE_BATCH_GAP = 0.3;                  // 同批次无人机的最大间隔（秒）
  const DWELL_CAP       = 10;                   // 活跃敌人采样两点间最大计入驻留（秒）
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

  // ── Agent 分类规则（尽力而为）──
  // Pet / Sentinel / MoaCompanion 等同伴单位不计入敌人生成事件，避免虚高。
  const AGENT_CLASSIFIERS = [
    [/CorpusEliteShieldDroneAgent/i, 'drone'],
    [/Pet|Companion|Sentinel|MoaCompanion|Catbrow|Vulpaphyla|Hound/i, 'companion'],
    [/Elite/i, 'elite'],
    [/Boss|Golem|Lephantis/i, 'boss'],
    [/Drone|Osprey|Moa\b|Roller/i, 'machine'],
    [/Lancer|Crewman|Butcher|Runner/i, 'grunt'],
  ];
  function classifyAgent(path, typeHint) {
    if (typeHint === 'drone') return 'drone';
    if (!path) return 'enemy';
    for (const [re, type] of AGENT_CLASSIFIERS) {
      if (re.test(path)) return type;
    }
    return 'enemy';
  }

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
     评分体系（0-120 分，四维加权，数据全部来自日志，不依赖单一外部基准）
     ══════════════════════════════════════════════════════════════
     ① 生息效率（权重 40%）：
        期望生息速率（全 Buff，/时）÷ 节点基准 × 100，线性，可超过 100。
        节点基准优先取该节点基准数据（WF.ArbNodeBaseline），无数据时退回 600/时。
     ② 清图效率（权重 20%）：
        100 − geq12Pct。geq12Pct = 场上同时受 AI 监控的活跃敌人数 ≥12（"高压"阈值）的时间占比。
        完全来自日志内采样，不依赖任何外部基准；清图越干净这项得分越高。
     ③ 综合效率（权重 20%）：
        双维度融合——清洁度（70%）+ 高压响应（30%）。
        清洁度：按活跃敌人分布区间评分，0-4=100、5-9=80、10-14=70、15-20=30、>20=0，
        再按驻留时长加权平均。高压响应：扫描从≥10恢复到<10的高压事件，
        平均恢复时间越短得分越高（100 − 平均秒数×2），从未高压=100。
        仅依赖日志数据。
     ④ 节奏稳定性（权重 20%）：
        衡量敌人与无人机刷新节奏的平稳程度。
        无人机密度稳定性（40%）：各轮次无人机密度（只/分钟）的波动越小得分越高。
        无人机批次间隔稳定性（35%）：相邻无人机批次之间的时间间隔越稳定得分越高。
        高压恢复稳定性（25%）：场上活跃敌人从 ≥10 的高压状态恢复到 <10 所需时间越短、越稳定得分越高。
        数据不足时该项以 50 分中性值计入。
     ──────────────────────────────────────────────────────────────
     综合评分 = 0.40×生息效率 + 0.20×清图效率 + 0.20×综合效率 + 0.20×节奏稳定性，上限 120。
     ══════════════════════════════════════════════════════════════ */
  const ESS_BASELINE = 600;   // 默认基准（该节点暂无分节点基准数据时兜底使用）
  const W_ESS   = 0.40;       // 生息效率权重
  const W_CLEAR = 0.20;       // 清图效率权重（场上敌人压力）
  const W_CLEAR_COMP  = 0.20; // 综合效率权重（整体清图质量）
  const W_RHYTHM = 0.20;      // 节奏稳定性权重

  function clamp(x, lo, hi) { return Math.max(lo, Math.min(hi, x)); }
  // ① 生息效率（%）：perHour ÷ baseline × 100，线性，允许超过 100
  function essenceEfficiency(perHour, baseline) {
    const base = baseline > 0 ? baseline : ESS_BASELINE;
    return Math.max(0, perHour / base * 100);
  }
  // ② 清图效率（%）：由 clearEffDist 的 geq12Pct 取反；数据缺失时返回 null
  function clearEfficiency(geq12Pct) {
    if (geq12Pct == null || !isFinite(geq12Pct)) return null;
    return Math.max(0, 100 - geq12Pct);
  }
  // ③ 综合效率（%）：双维度融合
  //   清洁度（70%）：基于活跃敌人分布的分段评分，0-4=100, 5-9=80, 10-14=70, 15-20=30, >20=0
  //   高压响应（30%）：扫描从 ≥10 恢复到 <10 的高压事件，平均恢复时间越短得分越高
  function extractRecoveryEvents(liveSamples, firstRoundT) {
    const events = [];
    if (!liveSamples || liveSamples.length < 2) return events;
    let inHigh = false, highStart = null;
    const cut = firstRoundT != null ? firstRoundT : -Infinity;
    for (let i = 0; i < liveSamples.length; i++) {
      const s = liveSamples[i];
      if (!inHigh && s.live >= 10) {
        inHigh = true;
        highStart = s.t;
      } else if (inHigh && s.live < 10) {
        inHigh = false;
        if (highStart >= cut) events.push(s.t - highStart);
      }
    }
    return events;
  }

  function clearComprehensiveEfficiency(liveSamples, liveDistData, recoveryEvents) {
    if (!liveDistData || !liveDistData.rows || liveDistData.rows.length < 2) return null;
    // ── 清洁度 ──
    let cleanTotal = 0, cleanWeighted = 0;
    for (const r of liveDistData.rows) {
      if (r.seconds <= 0) continue;
      const mid = r.lo + (r.hi != null ? (r.hi - r.lo) / 2 : 2);
      let score;
      if (mid <= 4)       score = 100;  // 0-4: 完美
      else if (mid <= 9)  score = 80;   // 5-9: 良好
      else if (mid <= 14) score = 70;   // 10-14: 正常波动
      else if (mid <= 20) score = 30;   // 15-20: 偏高
      else                score = 0;    // >20: 严重堆积
      cleanWeighted += score * r.seconds;
      cleanTotal += r.seconds;
    }
    const cleanliness = cleanTotal > 0 ? cleanWeighted / cleanTotal : 50;

    // ── 高压响应 ──
    let recovery = 50; // 中性兜底
    if (recoveryEvents && recoveryEvents.length) {
      const avgRecovery = recoveryEvents.reduce((a, b) => a + b, 0) / recoveryEvents.length;
      recovery = Math.max(0, 100 - avgRecovery * 2);
    } else if (recoveryEvents && recoveryEvents.length === 0) {
      if (liveSamples && liveSamples.some((s) => s.live >= 10)) {
        // 出现了高压但直到任务结束仍未恢复，直接 0 分
        recovery = 0;
      } else {
        // 从未出现高压，完美
        recovery = 100;
      }
    } else if (liveSamples && liveSamples.length >= 2) {
      // 兼容旧调用：未传入 recoveryEvents 时兜底计算（不过滤开局）
      const events = extractRecoveryEvents(liveSamples);
      if (events.length > 0) {
        const avgRecovery = events.reduce((a, b) => a + b, 0) / events.length;
        recovery = Math.max(0, 100 - avgRecovery * 2);
      } else if (liveSamples.some((s) => s.live >= 10)) {
        recovery = 0;
      } else {
        recovery = 100;
      }
    }
    return Math.round(cleanliness * 0.7 + recovery * 0.3);
  }
  // ④ 节奏稳定性（%）
  function rhythmStability(roundStats, interBatchData, liveSamples, recoveryEvents) {
    // 需要至少一些数据
    const hasRounds = roundStats && roundStats.length >= 2;
    const hasBatches = interBatchData && interBatchData.rows && interBatchData.totalBatches >= 2;
    const hasLive = liveSamples && liveSamples.length >= 2;
    if (!hasRounds && !hasBatches && !hasLive) return null;

    const NEUTRAL = 70; // 数据不足或样本过少时的中性回归值
    let densityScore = NEUTRAL, batchGapScore = NEUTRAL, recoveryScore = NEUTRAL;
    let weightsUsed = 0;

    // CV 软阈值映射（分段缓降，避免线性惩罚把正常波动压到过低）
    function cvScore(cv, tiers) {
      // tiers: [[lo, hi, base, slope], ...] 按 cv 范围升序，最后一项 hi 为 Infinity
      for (let i = 0; i < tiers.length; i++) {
        const [lo, hi, base, slope] = tiers[i];
        if (cv <= hi) return Math.max(0, base - (cv - lo) * slope);
      }
      return 0;
    }

    // 无人机密度稳定性（40%）
    if (hasRounds) {
      const densities = roundStats.map((r) => r.droneDensity).filter((v) => v != null && isFinite(v) && v >= 0);
      if (densities.length >= 2) {
        const mean = densities.reduce((a, b) => a + b, 0) / densities.length;
        const variance = densities.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / densities.length;
        const cv = mean > 0 ? Math.sqrt(variance) / mean : 0;
        densityScore = cvScore(cv, [
          [0, 0.25, 100, 0],
          [0.25, 0.45, 100, 100],
          [0.45, 0.75, 80, 66.7],
          [0.75, Infinity, 60, 40],
        ]);
        weightsUsed += 0.40;
      }
      // 轮次极少时向中性值回归，但不完全等于中性值：保留一点原始信息
      if (densities.length === 1) {
        densityScore = (densityScore + NEUTRAL) / 2;
        weightsUsed += 0.40;
      }
    }

    // 无人机批次间隔稳定性（35%）
    if (hasBatches) {
      const gaps = [];
      for (let i = 0; i < interBatchData.rows.length; i++) {
        const row = interBatchData.rows[i];
        if (row.seconds <= 0) continue;
        const lo = row.lo;
        const hi = row.hi != null ? row.hi : lo + 5;
        const mid = (lo + hi) / 2;
        gaps.push(mid);
      }
      if (gaps.length >= 2) {
        const mean = gaps.reduce((a, b) => a + b, 0) / gaps.length;
        const variance = gaps.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / gaps.length;
        const cv = mean > 0 ? Math.sqrt(variance) / mean : 0;
        batchGapScore = cvScore(cv, [
          [0, 0.30, 100, 0],
          [0.30, 0.50, 100, 100],
          [0.50, 0.80, 80, 66.7],
          [0.80, Infinity, 60, 40],
        ]);
        weightsUsed += 0.35;
      }
      if (gaps.length === 1) {
        batchGapScore = (batchGapScore + NEUTRAL) / 2;
        weightsUsed += 0.35;
      }
    }

    // 高压恢复稳定性（25%）：使用已过滤开局段的 recoveryEvents
    if (recoveryEvents && recoveryEvents.length) {
      const avg = recoveryEvents.reduce((a, b) => a + b, 0) / recoveryEvents.length;
      const variance = recoveryEvents.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / recoveryEvents.length;
      const cv = avg > 0 ? Math.sqrt(variance) / avg : 0;
      let avgScore;
      if (avg <= 5) avgScore = 100;
      else if (avg <= 12) avgScore = 100 - (avg - 5) * 3;
      else if (avg <= 25) avgScore = 79 - (avg - 12) * 3;
      else avgScore = Math.max(0, 40 - (avg - 25) * 1);
      const cvPenalty = Math.min(15, cv * 15);
      recoveryScore = Math.max(0, avgScore - cvPenalty);
      weightsUsed += 0.25;
    } else if (recoveryEvents && recoveryEvents.length === 0) {
      // 明确无恢复事件：要么从未高压，要么高压未恢复
      if (liveSamples && liveSamples.some((s) => s.live >= 10)) {
        recoveryScore = 0;
      } else {
        recoveryScore = 100;
      }
      weightsUsed += 0.25;
    }

    if (weightsUsed <= 0) return null;
    // 缺失子项用 NEUTRAL 补齐，已激活子项按原权重加权
    const raw = (densityScore * 0.40 + batchGapScore * 0.35 + recoveryScore * 0.25) /
                (0.40 + 0.35 + 0.25);
    return Math.round(raw);
  }

  // 四维加权综合评分（某项为 null 时用 50 中性兜底）
  function computeScore(essEff, clearEff, clearCompEff, rhythmEff) {
    const e = essEff  != null ? essEff  : 50;
    const c = clearEff != null ? clearEff : 50;
    const k = clearCompEff != null ? clearCompEff : 50;
    const r = rhythmEff != null ? rhythmEff : 50;
    return Math.round(clamp(W_ESS * e + W_CLEAR * c + W_CLEAR_COMP * k + W_RHYTHM * r, 0, 120));
  }
  function scoreTierName(s) {
    if (s >= 101) return '巅峰';
    if (s >= 80)  return '优秀';
    if (s >= 70)  return '良好';
    if (s >= 60)  return '及格';
    return '初学';
  }

  // ── 工具函数 ──
  function avg(arr) {
    if (!arr || !arr.length) return null;
    return arr.reduce((a, b) => a + b, 0) / arr.length;
  }
  function median(arr) {
    if (!arr || !arr.length) return null;
    const s = arr.slice().sort((a, b) => a - b);
    const m = Math.floor(s.length / 2);
    return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
  }
  function stdDev(arr, mean) {
    if (!arr || arr.length < 2) return null;
    const m = mean != null ? mean : avg(arr);
    return Math.sqrt(arr.reduce((a, b) => a + Math.pow(b - m, 2), 0) / arr.length);
  }
  function coefficientOfVariation(arr) {
    const m = avg(arr);
    if (!m) return null;
    const s = stdDev(arr, m);
    return s != null ? s / m : null;
  }
  function pearson(x, y) {
    if (!x || !y || x.length !== y.length || x.length < 3) return null;
    const n = x.length;
    const mx = avg(x), my = avg(y);
    let num = 0, dx2 = 0, dy2 = 0;
    for (let i = 0; i < n; i++) {
      const dx = x[i] - mx;
      const dy = y[i] - my;
      num += dx * dy;
      dx2 += dx * dx;
      dy2 += dy * dy;
    }
    if (dx2 === 0 || dy2 === 0) return 0;
    return num / Math.sqrt(dx2 * dy2);
  }

  // ── 分布计算：无人机生成间隔（相邻生成时间差，按时长加权分桶）──
  function vacuumDist(times) {
    if (times.length < 2) return null;
    const edges = VACUUM_BUCKETS;
    const n = edges.length + 1;
    const bucket = new Array(n).fill(0);
    let total = 0, over3 = 0, maxGap = 0;
    for (let i = 0; i < times.length - 1; i++) {
      const g = times[i + 1] - times[i];
      if (g <= 0) continue;
      let bi = edges.findIndex((e) => g <= e);
      if (bi < 0) bi = n - 1;
      bucket[bi] += g; total += g;
      if (g > 3) over3 += g;
      if (g > maxGap) maxGap = g;
    }
    if (total <= 0) return null;
    const rows = bucket.map((v, i) => ({
      lo: i === 0 ? 0 : edges[i - 1],
      hi: i < edges.length ? edges[i] : null,
      seconds: v, pct: v / total * 100,
    }));
    return { rows, over3Pct: over3 / total * 100, maxGap };
  }

  // ── 分布计算：清图效率（受监控活跃敌人数采样，按驻留时长加权，5 宽分桶）──
  function clearEffDist(samples) {
    if (samples.length < 2) return null;
    let maxLive = 1;
    for (const s of samples) if (s.live > maxLive) maxLive = s.live;
    const nb = Math.max(1, Math.ceil((maxLive + 1) / 5));
    const bucket = new Array(nb).fill(0);
    let total = 0, geq12 = 0;
    for (let i = 0; i < samples.length - 1; i++) {
      const dwell = samples[i + 1].t - samples[i].t;
      if (dwell <= 0 || dwell > DWELL_CAP) continue;
      const live = samples[i].live;
      const bi = Math.min(Math.floor(live / 5), nb - 1);
      bucket[bi] += dwell; total += dwell;
      if (live >= 12) geq12 += dwell;
    }
    if (total <= 0) return null;
    const rows = bucket.map((v, i) => ({
      lo: 5 * i, hi: i < nb - 1 ? 5 * i + 4 : null,
      seconds: v, pct: v / total * 100,
    }));
    return { rows, maxLive, geq12Pct: geq12 / total * 100 };
  }

  // ── 分布计算：无人机刷新连续度（同批次数量直方图）──
  function consecutiveDist(times) {
    if (!times.length) return null;
    const batches = clusterDroneBatches(times, DRONE_BATCH_GAP);
    const sizes = batches.map((b) => b.length);
    let maxSize = 1;
    for (const s of sizes) if (s > maxSize) maxSize = s;
    const hist = new Array(maxSize).fill(0);
    for (const s of sizes) if (s >= 1 && s <= maxSize) hist[s - 1]++;
    const totalBatches = sizes.length;
    const rows = hist.map((c, i) => ({ size: i + 1, count: c, pct: totalBatches > 0 ? c / totalBatches * 100 : 0 }));
    return { rows, totalBatches, avgBatchSize: avg(sizes) };
  }

  // ── 无人机批次聚类 ──
  function clusterDroneBatches(times, gapThreshold) {
    if (!times || !times.length) return [];
    const batches = [];
    let current = [times[0]];
    for (let i = 1; i < times.length; i++) {
      if (times[i] - times[i - 1] <= gapThreshold) {
        current.push(times[i]);
      } else {
        batches.push(current);
        current = [times[i]];
      }
    }
    if (current.length) batches.push(current);
    return batches;
  }

  // ── 分布计算：同批次内间隔 ──
  function intraBatchGapDist(times) {
    const batches = clusterDroneBatches(times, DRONE_BATCH_GAP);
    const gaps = [];
    for (const b of batches) {
      for (let i = 1; i < b.length; i++) gaps.push(b[i] - b[i - 1]);
    }
    if (!gaps.length) return null;
    return bucketGaps(gaps);
  }

  // ── 分布计算：批次之间间隔 ──
  function interBatchGapDist(times) {
    const batches = clusterDroneBatches(times, DRONE_BATCH_GAP);
    if (batches.length < 2) return null;
    const firstTimes = batches.map((b) => b[0]);
    const gaps = [];
    for (let i = 1; i < firstTimes.length; i++) gaps.push(firstTimes[i] - firstTimes[i - 1]);
    const dist = bucketGaps(gaps);
    if (!dist) return null;
    const over5s = gaps.filter((g) => g > 5).reduce((a, b) => a + b, 0);
    const over10s = gaps.filter((g) => g > 10).reduce((a, b) => a + b, 0);
    const total = gaps.reduce((a, b) => a + b, 0);
    return {
      ...dist,
      avgGap: avg(gaps),
      medianGap: median(gaps),
      maxGap: Math.max(...gaps),
      over5sPct: total > 0 ? over5s / total * 100 : 0,
      over10sPct: total > 0 ? over10s / total * 100 : 0,
      totalBatches: batches.length,
    };
  }

  // 对间隔数组做分桶（复用 vacuumDist 的分桶逻辑）
  function bucketGaps(gaps) {
    if (!gaps || gaps.length < 1) return null;
    const edges = VACUUM_BUCKETS;
    const n = edges.length + 1;
    const bucket = new Array(n).fill(0);
    let total = 0;
    for (const g of gaps) {
      if (g <= 0) continue;
      let bi = edges.findIndex((e) => g <= e);
      if (bi < 0) bi = n - 1;
      bucket[bi] += g; total += g;
    }
    if (total <= 0) return null;
    const rows = bucket.map((v, i) => ({
      lo: i === 0 ? 0 : edges[i - 1],
      hi: i < edges.length ? edges[i] : null,
      seconds: v, pct: v / total * 100,
    }));
    return { rows, maxGap: Math.max(...gaps) };
  }

  // ── 分布计算：按分钟切片的无人机生成 / 敌人生成 / 清图量趋势 ──
  // 清图量为近似推算，非直接日志字段：本分钟净消灭数 ≈ 本分钟新增生成数 −
  // 本分钟末活跃监控数相对上一分钟末的净变化（若活跃数下降说明消灭快于生成）。
  function perMinuteTrend(buckets, durationSec) {
    if (!buckets || !buckets.length) return null;
    const totalMin = Math.max(1, Math.ceil(durationSec / 60));
    const rows = [];
    let prevLive = 0;
    for (let i = 0; i < totalMin; i++) {
      const b = buckets[i] || { drones: 0, spawn: 0, spawnEvents: 0, liveEnd: null, liveSum: 0, liveSamples: 0 };
      const liveEnd = b.liveEnd != null ? b.liveEnd : prevLive;
      const liveMax = b.liveMax != null ? b.liveMax : liveEnd;
      const liveAvg = b.liveSamples > 0 ? b.liveSum / b.liveSamples : liveEnd;
      const cleared = Math.max(0, b.spawn - (liveEnd - prevLive));
      rows.push({
        minute: i + 1,
        drones: b.drones,
        spawn: b.spawn,
        spawnEvents: b.spawnEvents || 0,
        liveAvg: liveAvg,
        liveMax: liveMax,
        cleared,
      });
      prevLive = liveEnd;
    }
    let totalCleared = 0;
    for (const r of rows) totalCleared += r.cleared;
    const maxDrones = Math.max(1, ...rows.map((r) => r.drones));
    const maxSpawn  = Math.max(1, ...rows.map((r) => r.spawn));
    const maxSpawnEvents = Math.max(1, ...rows.map((r) => r.spawnEvents));
    const maxCleared = Math.max(1, ...rows.map((r) => r.cleared));
    return { rows, maxDrones, maxSpawn, maxSpawnEvents, maxCleared, totalCleared };
  }

  // ── 轮次级统计 ──
  function perRoundStats(roundBoundaries, eventStream, startedT, liveSamples) {
    if (!roundBoundaries || !roundBoundaries.length || !eventStream || !eventStream.length) return [];
    const stats = [];
    for (let i = 0; i < roundBoundaries.length; i++) {
      const b = roundBoundaries[i];
      const prev = i === 0 ? { t: startedT, droneCum: 0, spawnedCum: 0, eventCum: 0 } : roundBoundaries[i - 1];
      const segEvents = eventStream.filter((e) => e[0] > prev.t && e[0] <= b.t);
      const droneEvents = segEvents.filter((e) => e[2] === 'drone');
      const enemyEvents = segEvents.filter((e) => e[2] !== 'drone');
      const gaps = [];
      for (let j = 1; j < droneEvents.length; j++) gaps.push(droneEvents[j][0] - droneEvents[j - 1][0]);

      const duration = b.t - prev.t;
      const segLiveSamples = liveSamples.filter((s) => s.t + startedT > prev.t && s.t + startedT <= b.t);
      const liveValues = segLiveSamples.map((s) => s.live).filter((v) => v != null && isFinite(v));
      let geq12Duration = 0;
      for (let j = 0; j < segLiveSamples.length - 1; j++) {
        const dwell = segLiveSamples[j + 1].t - segLiveSamples[j].t;
        if (segLiveSamples[j].live >= 12 && dwell > 0 && dwell <= DWELL_CAP) geq12Duration += dwell;
      }

      stats.push({
        round: i + 1,
        label: b.label,
        duration,
        drones: droneEvents.length,
        enemiesSpawned: b.spawnedCum - prev.spawnedCum,
        enemyEvents: enemyEvents.length,
        eventCum: b.eventCum != null ? b.eventCum : prev.eventCum + enemyEvents.length,
        droneGapAvg: avg(gaps),
        droneGapMedian: median(gaps),
        droneGapMax: gaps.length ? Math.max(...gaps) : null,
        droneDensity: duration > 0 ? droneEvents.length / (duration / 60) : 0,
        liveAvg: liveValues.length ? avg(liveValues) : null,
        liveMax: liveValues.length ? Math.max(...liveValues) : null,
        highPressurePct: duration > 0 ? geq12Duration / duration * 100 : 0,
      });
    }
    return stats;
  }

  // ── Wave 边界推断 ──
  function inferWaveBoundaries(eventStream) {
    const waves = [];
    let lastWave = null;
    let lastSpawn = 0;
    for (const e of eventStream) {
      // 显式 wave 字段（agentPath 中不包含 wave 信息，此分支在旧逻辑中已失效；
      // 保留结构避免破坏调用方，实际 wave 推断由下方 Spawned 峰值回落完成）
      // Spawned 峰值回落推断
      if (e[3] != null && e[3] < lastSpawn && lastSpawn > 0) {
        waves.push({ t: e[0], wave: (lastWave || 0) + 1, explicit: false });
        lastWave = (lastWave || 0) + 1;
      }
      if (e[3] != null) lastSpawn = e[3];
    }
    return waves;
  }

  // ── 压力-产出滞后相关分析 ──
  function pressureDroneCorrelation(liveSamples, droneTimes, maxLagSec = 60, stepSec = 5) {
    if (!liveSamples || liveSamples.length < 5 || !droneTimes || droneTimes.length < 5) return null;
    const maxT = liveSamples[liveSamples.length - 1].t;
    if (maxT <= 0) return null;
    const size = Math.ceil(maxT) + 1;
    const liveBySec = new Array(size).fill(0);
    for (let i = 0; i < liveSamples.length - 1; i++) {
      const t0 = Math.floor(liveSamples[i].t);
      const t1 = Math.floor(liveSamples[i + 1].t);
      const live = liveSamples[i].live;
      for (let t = t0; t <= t1 && t < size; t++) liveBySec[t] = live;
    }
    const droneBySec = new Array(size).fill(0);
    for (const t of droneTimes) {
      const idx = Math.floor(t);
      if (idx >= 0 && idx < size) droneBySec[idx]++;
    }
    const results = [];
    for (let lag = 0; lag <= maxLagSec; lag += stepSec) {
      const x = [], y = [];
      for (let i = 0; i + lag < size; i++) {
        x.push(liveBySec[i]);
        y.push(droneBySec[i + lag]);
      }
      results.push({ lagSec: lag, correlation: pearson(x, y) });
    }
    const best = results.reduce((a, b) => (Math.abs(b.correlation || 0) > Math.abs(a.correlation || 0) ? b : a), { correlation: 0 });
    return { results, best };
  }

  // ── 清图效率指数 CEI ──
  function clearEfficiencyIndex(clearEff, recoveryEvents, spawnTotal, clearedTotal) {
    const clearScore = clearEff != null ? clearEff : 50;
    let recoveryScore = 50;
    if (recoveryEvents && recoveryEvents.length) {
      const avgRecovery = recoveryEvents.reduce((a, b) => a + b, 0) / recoveryEvents.length;
      recoveryScore = Math.max(0, 100 - avgRecovery * 2);
    } else if (recoveryEvents && recoveryEvents.length === 0) {
      recoveryScore = 100;
    }
    let spawnClearRatio = 50;
    if (spawnTotal > 0 && clearedTotal != null) {
      const ratio = clearedTotal / spawnTotal;
      // 理想情况下 cleared 接近 spawn，ratio -> 1 得 100
      spawnClearRatio = Math.min(100, ratio * 100);
    }
    return Math.round(clearScore * 0.4 + recoveryScore * 0.3 + spawnClearRatio * 0.3);
  }

  // ── 异常诊断 ──
  function detectAnomalies(perMinData, roundStats, interBatchData, firstRoundT, startedT) {
    const anomalies = [];
    if (!perMinData || !perMinData.rows) return anomalies;

    // 开局分钟索引，避免开局阶段的正常无无人机/低活跃被误报
    const firstRoundIdx = (firstRoundT != null && startedT != null)
      ? Math.max(0, Math.ceil((firstRoundT - startedT) / 60))
      : 0;

    // 规则 1：连续 2 分钟敌人生成正常但无无人机（排除开局阶段）
    let noDroneStart = null;
    for (let i = 0; i < perMinData.rows.length; i++) {
      const r = perMinData.rows[i];
      const qualifies = r.minute - 1 >= firstRoundIdx && r.spawnEvents > 0 && r.drones === 0;
      if (qualifies) {
        if (noDroneStart == null) noDroneStart = r.minute;
      } else {
        if (noDroneStart != null && r.minute - noDroneStart >= 2) {
          anomalies.push({
            type: 'no-drone',
            minute: noDroneStart,
            duration: r.minute - noDroneStart,
            text: `第 ${noDroneStart}-${r.minute - 1} 分钟敌人生成正常但连续无无人机生成，可能存在漏拾取或刷新异常`,
            severity: 'warning',
          });
        }
        noDroneStart = null;
      }
    }
    // 循环结束时若仍有未闭合的连续段
    if (noDroneStart != null && perMinData.rows.length - noDroneStart + 1 >= 2) {
      const last = perMinData.rows[perMinData.rows.length - 1].minute;
      anomalies.push({
        type: 'no-drone',
        minute: noDroneStart,
        duration: last - noDroneStart + 1,
        text: `第 ${noDroneStart}-${last} 分钟敌人生成正常但连续无无人机生成，可能存在漏拾取或刷新异常`,
        severity: 'warning',
      });
    }

    // 规则 2：连续 2 分钟以上高压占比 > 60%
    let highPressureStart = null;
    for (const r of perMinData.rows) {
      if (r.liveAvg >= 10) {
        if (highPressureStart == null) highPressureStart = r.minute;
      } else {
        if (highPressureStart != null && r.minute - highPressureStart >= 2) {
          anomalies.push({
            type: 'high-pressure',
            minute: highPressureStart,
            duration: r.minute - highPressureStart,
            text: `第 ${highPressureStart}-${r.minute - 1} 分钟场上持续高压，清图压力过大`,
            severity: 'danger',
          });
        }
        highPressureStart = null;
      }
    }

    // 规则 3：单批次间隔 ≥30s，或连续出现 ≥20s
    if (interBatchData && interBatchData.rows) {
      let prevWarningLo = null;
      for (const row of interBatchData.rows) {
        if (row.lo >= 30 && row.seconds > 0) {
          anomalies.push({
            type: 'batch-gap',
            gapLo: row.lo,
            text: `存在无人机批次间隔 ≥${row.lo}s 的情况，总时长 ${row.seconds.toFixed(1)}s，可能存在刷怪卡顿`,
            severity: 'warning',
          });
        } else if (row.lo >= 20 && row.seconds > 0) {
          if (prevWarningLo != null) {
            anomalies.push({
              type: 'batch-gap',
              gapLo: row.lo,
              text: `存在连续无人机批次间隔 ≥20s 的情况，总时长 ${row.seconds.toFixed(1)}s，可能存在刷怪卡顿`,
              severity: 'warning',
            });
            prevWarningLo = null;
          } else {
            prevWarningLo = row.lo;
          }
        }
      }
    }

    // 规则 4：某轮无人机密度比相邻轮低 50% 以上
    if (roundStats && roundStats.length >= 3) {
      for (let i = 1; i < roundStats.length - 1; i++) {
        const prev = roundStats[i - 1].droneDensity;
        const cur = roundStats[i].droneDensity;
        const next = roundStats[i + 1].droneDensity;
        const neighborAvg = (prev + next) / 2;
        if (neighborAvg > 0 && cur < neighborAvg * 0.5 && cur > 0) {
          anomalies.push({
            type: 'low-density-round',
            round: roundStats[i].round,
            text: `第 ${roundStats[i].round} 轮无人机密度明显低于相邻轮次，可能存在挂机或走位问题`,
            severity: 'warning',
          });
        }
      }
    }

    return anomalies;
  }

  function create() {
    const records = [];
    const sq   = WF.squadMixin.create();
    const chat = WF.chatMixin.create();
    let m = null;
    let _sessionAnchor = null; // 当前会话 wall-clock 锚点（由 logReader 传入，见 feed 末两参）

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
        firstFrameT: null,   // HUD REDUX 首次渲染绝对时刻（"首帧"）
        sessionAnchor: _sessionAnchor, // 用于把相对秒数换算成真实时钟时间
        type:      'unknown',
        eventStream: [],     // v2.0：原始事件流
        droneTimes: [],      // 无人机生成绝对时刻（秒），保留兼容
        maxSpawned: 0,       // 累计敌人生成数（Spawned 峰值）
        enemyEventCount: 0,  // v2.0：真实生成事件累计
        liveSamples: [],      // {t(相对), live}
        rounds:     0,       // 已结算轮/波数
        lastRoundT: null,    // 最后一次轮次结算的绝对时刻（无尽任务有效终点）
        roundBoundaries: [], // {label, t(绝对), droneCum, spawnedCum, eventCum} 每轮结算时的快照
        netLastSeen: {},     // 连接编号 -> 最后一次网络诊断行的绝对时刻（保留，仅不再用于客机时长）
        lastClientJoinTime: null, // 最晚的外部玩家实体创建时刻（绝对值）
        minuteBuckets: [],   // 按分钟切片：[{drones, spawn, spawnEvents, liveSum, liveMax, liveSamples, liveEnd}]，用于生成 / 敌人速率趋势
        endT:       null,
        explicitWaves: [],   // v2.0：显式 wave 边界
        inferredWaves: [],   // v2.0：推断 wave 边界
      };
    }

    // 把某个时间点的一次增量计入对应分钟切片（drones 或 spawn 累加 delta）
    function bumpMinute(t, field, delta) {
      const idx = Math.floor((t - m.startedT) / 60);
      if (idx < 0) return;
      if (!m.minuteBuckets[idx]) m.minuteBuckets[idx] = { drones: 0, spawn: 0, spawnEvents: 0, liveSum: 0, liveMax: 0, liveSamples: 0, liveEnd: null };
      m.minuteBuckets[idx][field] += delta;
    }
    // 记录某个时间点所在分钟切片"末尾时刻"的活跃监控数快照（同一分钟内反复覆盖，
    // 最终留下的就是这一分钟最后一次采样值，供清图量趋势近似推算使用）
    function setMinuteLive(t, live) {
      const idx = Math.floor((t - m.startedT) / 60);
      if (idx < 0) return;
      if (!m.minuteBuckets[idx]) m.minuteBuckets[idx] = { drones: 0, spawn: 0, spawnEvents: 0, liveSum: 0, liveMax: 0, liveSamples: 0, liveEnd: null };
      m.minuteBuckets[idx].liveEnd = live;
      m.minuteBuckets[idx].liveSum += live;
      m.minuteBuckets[idx].liveMax = Math.max(m.minuteBuckets[idx].liveMax, live);
      m.minuteBuckets[idx].liveSamples++;
    }

    // v2.0：从 OnAgentCreated 行采样，写入事件流，并更新累计/分钟统计
    function sampleAgentLine(line, t, typeHint) {
      const sp = RE.agentSpawned.exec(line);
      const mt = RE.agentMonitoredTick.exec(line);
      const ap = RE.agentPath.exec(line);
      const agentPath = ap ? ap[1] : null;
      const type = classifyAgent(agentPath, typeHint);

      const event = [
        t,                    // 0
        t - m.startedT,       // 1 relT
        type,                 // 2
        sp ? parseInt(sp[1], 10) : null,  // 3 spawned
        mt ? parseInt(mt[1], 10) : null,  // 4 live
        null,                 // 5 roundIndex
        null,                 // 6 batchId
        null,                 // 7 waveId
      ];
      // 同伴单位不写入事件流（不贡献任何分析数据，且会虚增 enemyEvents 计数）
      if (type !== 'companion') {
        m.eventStream.push(event);
      }

      if (type !== 'drone' && type !== 'companion') {
        m.enemyEventCount++;
        bumpMinute(t, 'spawnEvents', 1);
      }

      if (sp) {
        const v = parseInt(sp[1], 10);
        if (v > m.maxSpawned) { bumpMinute(t, 'spawn', v - m.maxSpawned); m.maxSpawned = v; }
      }
      if (mt && type !== 'companion') {
        const live = parseInt(mt[1], 10);
        m.liveSamples.push({ t: t - m.startedT, live });
        setMinuteLive(t, live);
      }

      return event;
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
        // 兼容旧 fallback：清理语言标记（中文或英文）
        m.node = clean.replace(ARB_NAME_MARK, '').replace(/-\s*$/, '').trim();
      }
    }

    function recordRoundBoundary(label, t) {
      m.roundBoundaries.push({
        label,
        t,
        droneCum: m.droneTimes.length,
        spawnedCum: m.maxSpawned,
        eventCum: m.enemyEventCount,
      });
    }

    function finalize(fallbackEndT, viaEnding) {
      if (!m || m.startedT == null) { m = null; return; }
      // 无尽任务的有效终点：最后一次轮次结算；否则退回状态结束/日志末尾
      const hostEnd = (m.rounds > 0 && m.lastRoundT != null) ? m.lastRoundT : fallbackEndT;
      const duration = hostEnd - m.startedT;
      const droneCount = m.droneTimes.length;
      // 绝对时刻换算：sessionAnchor = {t, date}，把相对秒数差换成真实时钟时间
      const anchor = m.sessionAnchor;
      const toDate = (relT) => (anchor && relT != null)
        ? new Date(anchor.date.getTime() + (relT - anchor.t) * 1000) : null;
      const startDate      = toDate(m.startedT);
      const endDate         = toDate(hostEnd);           // "系统结算时刻"
      const firstFrameDate = toDate(m.firstFrameT);       // "首帧时刻"
      const frameDuration  = (m.firstFrameT != null) ? (hostEnd - m.firstFrameT) : null; // 首帧→尾帧
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

        // 分节点生息效率基准
        const nodeBase = (typeof WF !== 'undefined' && WF.ArbNodeBaseline)
          ? WF.ArbNodeBaseline.lookup(m.nodeId) : null;
        const essBaseline = nodeBase ? nodeBase.perHour : ESS_BASELINE;

        // 事件流后处理：回填 roundIndex、batchId、waveId
        let roundIdx = 0;
        for (const e of m.eventStream) {
          while (roundIdx < m.roundBoundaries.length && e[0] > m.roundBoundaries[roundIdx].t) roundIdx++;
          e[5] = roundIdx;
        }
        const droneBatches = clusterDroneBatches(m.droneTimes, DRONE_BATCH_GAP);
        let batchId = 0, eventIdx = 0;
        for (let i = 0; i < droneBatches.length; i++) {
          const batch = droneBatches[i];
          for (const t of batch) {
            while (eventIdx < m.eventStream.length && m.eventStream[eventIdx][0] < t) eventIdx++;
            if (eventIdx < m.eventStream.length && m.eventStream[eventIdx][0] === t && m.eventStream[eventIdx][2] === 'drone') {
              m.eventStream[eventIdx][6] = i;
            }
          }
        }
        // wave 探测
        const inferredWaves = inferWaveBoundaries(m.eventStream);
        m.inferredWaves = inferredWaves;

        // 分布数据
        const relTimes = m.droneTimes.map((x) => x - m.startedT);
        const liveDistData  = clearEffDist(m.liveSamples);
        const perMinData   = perMinuteTrend(m.minuteBuckets, duration);
        const roundStats = perRoundStats(m.roundBoundaries, m.eventStream, m.startedT, m.liveSamples);
        const vacuumData = vacuumDist(relTimes);
        const consecutiveData = consecutiveDist(m.droneTimes);
        const intraBatchData = intraBatchGapDist(relTimes);
        const interBatchData = interBatchGapDist(relTimes);
        const pressureCorr = pressureDroneCorrelation(m.liveSamples, relTimes);

        // 高压恢复事件（过滤开局阶段：SS_STARTED 到第一次轮次结算前）
        // 注：清图效率阈值已改为 ≥12，但高压恢复仍沿用 ≥10 的原始高压定义
        const firstRoundT = m.roundBoundaries && m.roundBoundaries.length ? m.roundBoundaries[0].t : m.startedT;
        const recoveryEvents = extractRecoveryEvents(m.liveSamples, firstRoundT);

        const essEff   = essenceEfficiency(fullBuffPerHour, essBaseline);
        const clearEff = clearEfficiency(liveDistData ? liveDistData.geq12Pct : null);
        const clearCompEff = clearComprehensiveEfficiency(m.liveSamples, liveDistData, recoveryEvents);
        const rhythmEff = rhythmStability(roundStats, interBatchData, m.liveSamples, recoveryEvents);
        const score    = computeScore(essEff, clearEff, clearCompEff, rhythmEff);

        const cei = clearEfficiencyIndex(clearEff, recoveryEvents, m.maxSpawned, perMinData ? perMinData.totalCleared : null);
        const anomalies = detectAnomalies(perMinData, roundStats, interBatchData, firstRoundT, m.startedT);

        // 无人机生成时的场上压力分布 + 散点数据
        const droneAtPressure = { low: 0, mid: 0, high: 0, total: 0 };
        const dronePressurePoints = [];
        for (const e of m.eventStream) {
          if (e[2] !== 'drone' || e[4] == null) continue;
          droneAtPressure.total++;
          if (e[4] < 5) droneAtPressure.low++;
          else if (e[4] < 10) droneAtPressure.mid++;
          else droneAtPressure.high++;
          dronePressurePoints.push({ live: e[4], relT: e[1] });
        }
        const droneAtPressurePct = droneAtPressure.total > 0 ? {
          low: droneAtPressure.low / droneAtPressure.total * 100,
          mid: droneAtPressure.mid / droneAtPressure.total * 100,
          high: droneAtPressure.high / droneAtPressure.total * 100,
        } : null;

        // 生息细分（对齐"无人机项 + 轮次奖励期望"口径）
        const droneFullBuff  = fromDrones * FULL_BUFF_MUL;   // 无人机期望生息（满 Buff）
        const roundGuarantee = rounds * 1;                   // 轮次保底
        const roundExtra     = rounds * 0.3;                 // 轮次额外期望（10%×3）

        // 最后客机时间：任务结束时间 − 最后一个外部玩家实体创建时刻。
        const lastClientDuration = (m.lastClientJoinTime != null && m.lastClientJoinTime > m.startedT)
          ? (hostEnd - m.lastClientJoinTime) : null;

        // 每轮明细：按 roundBoundaries 做相邻差分
        const roundDetail = [];
        let prevT = 0, prevDrone = 0, prevSpawn = 0, prevEvent = 0;
        m.roundBoundaries.forEach((b, i) => {
          const relT = b.t - m.startedT;
          const segDrone = b.droneCum - prevDrone;
          const segSpawn = b.spawnedCum - prevSpawn;
          const segEvent = (b.eventCum != null ? b.eventCum : 0) - prevEvent;
          const segEssence = segDrone * BASE_DROP * FULL_BUFF_MUL + EXTRA_PER_ROUND;
          roundDetail.push({
            index: i + 1, label: b.label,
            durSec: relT - prevT, atSec: relT,
            drones: segDrone, spawned: segSpawn, spawnEvents: segEvent,
            liveAvg: roundStats[i] ? roundStats[i].liveAvg : null,
            liveMax: roundStats[i] ? roundStats[i].liveMax : null,
            droneGapAvg: roundStats[i] ? roundStats[i].droneGapAvg : null,
            droneGapMax: roundStats[i] ? roundStats[i].droneGapMax : null,
            highPressurePct: roundStats[i] ? roundStats[i].highPressurePct : null,
            essence: segEssence,
          });
          prevT = relT; prevDrone = b.droneCum; prevSpawn = b.spawnedCum; prevEvent = b.eventCum || 0;
        });
        // 末段（未结算的尾巴）
        const tailDrone = droneCount - prevDrone;
        const tailSpawn = m.maxSpawned - prevSpawn;
        const tailEvent = m.enemyEventCount - prevEvent;
        if (tailDrone > 0 || tailSpawn > 0) {
          roundDetail.push({
            index: roundDetail.length + 1, label: '未结算尾段',
            durSec: duration - prevT, atSec: duration,
            drones: tailDrone, spawned: tailSpawn, spawnEvents: tailEvent,
            liveAvg: null, liveMax: null, droneGapAvg: null, droneGapMax: null, highPressurePct: null,
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
          firstFrameT:     m.firstFrameT,
          frameDuration,
          startDate,
          endDate,
          firstFrameDate,
          node:            resolved.node,
          planet:          resolved.planet,
          nodeId:          m.nodeId,
          faction:         resolved.faction,
          factionZh:       resolved.faction,
          name:            resolved.node,
          missionType:     resolved.typeKey,
          missionTypeName: resolved.typeName,
          droneCount,
          drones:          relTimes,
          maxSpawned:      m.maxSpawned,
          enemyEventCount: m.enemyEventCount,
          sparsity,
          rounds,
          roundDetail,
          roundStats,
          dronesPerMin,
          complete:        viaEnding || m.lastRoundT != null,
          essence: {
            fromDrones, fromRounds, total,
            fullBuffTotal, perHour, fullBuffPerHour, perMin, fullBuffPerMin,
            droneFullBuff, roundGuarantee, roundExtra, buffMul: FULL_BUFF_MUL,
          },
          dist: {
            vacuum:      vacuumData,
            liveDist:    liveDistData,
            consecutive: consecutiveData,
            intraBatch:  intraBatchData,
            interBatch:  interBatchData,
            perMinute:   perMinData,
          },
          cross: {
            pressureCorrelation: pressureCorr,
            clearEfficiencyIndex: cei,
            droneAtPressurePct,
            dronePressurePoints,
            recoveryEvents,
            recoveryAvg: recoveryEvents.length ? avg(recoveryEvents) : (m.liveSamples.some(s => s.live >= 10) ? null : 0),
          },
          anomalies,
          waves: {
            inferred: inferredWaves,
            count: inferredWaves.length,
          },
          eff: {
            essence: essEff,
            clear:   clearEff,
            clearComp: clearCompEff,
            rhythm:  rhythmEff,
          },
          essBaseline,
          essBaselineIsNode: !!nodeBase,
          score,
          scoreTier: scoreTierName(score),
          squadInfo: sq.getSquadInfo(),
          chatLog:   chat.getChatLog(m.startedT, m.startedT, hostEnd),
        });
      }
      m = null;
    }

    return {
      feed(t, line, sessionOffset, sessionAnchor) {
        if (sessionAnchor !== undefined) _sessionAnchor = sessionAnchor;
        sq.feed(line);
        chat.feed(t, line);

        // ---- 任务识别 ----
        let nm = null;
        if (line.indexOf('ThemedSquadOverlay.lua') !== -1) {
          const r = RE.missionName.exec(line) || RE.cachedName.exec(line) || RE.voteName.exec(line);
          // 国际化三重保险
          if (r && (ARB_NAME_MARK.test(r[1]) || ARB_ELITE_ALERT.test(r[1]))) nm = r[1].trim();
          // 括号形式的节点 ID 兜底
          const v = RE.nodeIdParen.exec(line);
          if (v && m) { if (!m.nodeId) m.nodeId = v[1]; }
        }
        if (nm) {
          // 关键修复：无尽仲裁任务进行到一半时，重复任务名行不触发 finalize
          const dupNodeId = RE.nodeIdParen.exec(line);
          const sameNode = m && m.startedT != null && dupNodeId && m.nodeId && dupNodeId[1] === m.nodeId;
          const sameRaw  = m && m.startedT != null && m.rawName === nm;
          if (sameNode || sameRaw) return;
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

        // 首帧：HUD REDUX 首次渲染
        if (m.firstFrameT == null && line.indexOf(HUD_REDUX) !== -1) {
          m.firstFrameT = t;
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
          sampleAgentLine(line, t, 'drone');
          return;
        }
        // 其它单位生成：活跃敌人数采样 + Spawned 峰值 + 事件流
        if (line.indexOf('OnAgentCreated') !== -1) {
          sampleAgentLine(line, t, null);
          return;
        }
        // 队员网络连接诊断
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
        // 外部玩家实体创建事件（id>0 = 非主机）
        if (line.indexOf('CreatePlayerForClient') !== -1) {
          const cc = RE.clientCreated.exec(line);
          if (cc) {
            const pid = parseInt(cc[1], 10);
            if (pid > 0) {
              if (m.lastClientJoinTime == null || t > m.lastClientJoinTime) {
                m.lastClientJoinTime = t;
              }
            }
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
      },

      finish(lastT) {
        if (m && m.startedT != null) finalize(m.endT != null ? m.endT : lastT, m.endT != null);
      },

      results() { return records; },
    };
  }

  return {
    create,
    computeScore,
    scoreTierName,
    essenceEfficiency,
    clearEfficiency,
    clearComprehensiveEfficiency,
    rhythmStability,
    clusterDroneBatches,
  };
})();
