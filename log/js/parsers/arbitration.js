/* 仲裁 (Arbitration) 解析器
 * 全部识别逻辑均由本项目对客户端 EE.log 的字段实测归纳得出：
 *   - 磁盾无人机：OnAgentCreated /Npc/CorpusEliteShieldDroneAgent（每行一只，Live/Spawned 字段随行给出）
 *   - 敌人生成数：OnAgentCreated 行的 "Spawned N" 取全程最大值（累计生成计数）
 *   - 存活饱和度：OnAgentCreated 行的 "Live N" 字段（当前存活单位数），按驻留时长加权分布
 *   - 轮/波边界：DefenseReward::TransitionOut（防御/拦截/镜像防御的每轮结算一次）；
 *                生存则用 SurvivalMission 奖励层
 *   - 任务窗口：SS_STARTED 起，至最后一次轮次结算（无尽任务的有效计时终点）
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
    //   Spawned=累计生成（敌人生成总数）；MonitoredTicking=当前受 AI 监控的活跃敌人数（饱和度取此值，
    //   不含友军/无人机之外的静默单位，峰值与实战存活敌人数一致）
    agentSpawned:         /OnAgentCreated\b.*?\bSpawned\s+(\d+)\b/,
    agentMonitoredTick:   /\bMonitoredTicking\s+(\d+)\b/,
    defenseReward:    /DefenseReward\.lua: DefenseReward::TransitionOut\b/,
    survivalTier:     /SurvivalMission\.lua: Survival: Gave reward tier (\d+) at ([\d.]+)/,
    interceptionRound:/InterceptionNewRound|InterNewRoundLotusTransmission/,
  };
  const ARB_NAME_MARK = '- 仲裁';

  // 期望赋灵母液常量（本项目按掉落规则实测标定）
  const BASE_DROP       = 0.06;                 // 每只磁盾无人机的基础期望
  const EXTRA_PER_ROUND = 1 + 0.1 * 3;          // 每轮额外 1.3（10% 概率多掉 3）
  const FULL_BUFF_MUL   = 2 * 1.18 * 2 * 1.25;  // 蓝盒×富足×黄盒×祝福 = 5.9（仅作用于无人机项）
  const DRONE_BATCH_GAP = 0.3;                  // 同批次无人机的最大间隔（秒）
  const SAT_DWELL_CAP   = 10;                   // 饱和度采样两点间最大计入驻留（秒）
  const VACUUM_BUCKETS  = [0.5, 1, 1.5, 2, 3, 4, 6, 8, 10, 15, 20, 30, 40, 50]; // 真空期分桶上界

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

  /* ── 评分体系（0-120 分）──
   * 三个指标，逐层递进：
   *   1) 生息效率 essenceEff：期望生息/小时 相对 600/时 高标准基准的达成度（0-100%+）
   *      —— 衡量"这一局单位时间的生息产出"。
   *   2) 击杀效率 killEff：由无人机稀疏度(敌人生成÷无人机生成)换算，稀疏度越低说明
   *      单位无人机对应的杂兵越少、击杀越干净利落（0-100%）。
   *   3) 熟练度 proficiency：生息效率与击杀效率的综合，衡量队伍整体的走位、节奏与
   *      击杀手法（0-100%+）。这是决定综合评分的核心指标。
   * 综合评分 = 熟练度 映射到 0-120，分数带（不使用字母等级称谓）：
   *   101-120 巅峰 ｜ 80-100 优秀 ｜ 70-79 良好 ｜ 60-69 及格 ｜ 0-59 待提升
   */
  const ESS_TARGET      = 600;   // 期望生息/小时 高标准基准（满 4 Buff）
  const SPARSITY_GREAT  = 4;     // 稀疏度达到此值即满击杀效率
  const SPARSITY_POOR   = 10;    // 稀疏度到此值击杀效率归零
  function clamp(x, lo, hi) { return Math.max(lo, Math.min(hi, x)); }
  // 生息效率（%）：达标基准 600/时；上限 120% 留给超常发挥
  function essenceEfficiency(perHour) { return clamp(perHour / ESS_TARGET * 100, 0, 120); }
  // 击杀效率（%）：稀疏度线性映射，越低越高
  function killEfficiency(sparsity) {
    if (!isFinite(sparsity) || sparsity <= 0) return 0;
    return clamp((SPARSITY_POOR - sparsity) / (SPARSITY_POOR - SPARSITY_GREAT) * 100, 0, 100);
  }
  // 熟练度（%）：生息效率 60% + 击杀效率 40% 加权综合
  function proficiency(perHour, sparsity) {
    return 0.6 * essenceEfficiency(perHour) + 0.4 * killEfficiency(sparsity);
  }
  // 综合评分（0-120）：熟练度 ×1.2 映射，给顶尖局留出"巅峰"空间
  function computeScore(perHour, sparsity) {
    return Math.round(clamp(proficiency(perHour, sparsity) * 1.2, 0, 120));
  }
  function scoreTierName(s) {
    if (s >= 101) return '巅峰';
    if (s >= 80)  return '优秀';
    if (s >= 70)  return '良好';
    if (s >= 60)  return '及格';
    return '待提升';
  }

  // ── 分布计算：无人机真空期（相邻生成间隔，按时长加权分桶）──
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

  // ── 分布计算：敌人饱和度（Live 采样，按驻留时长加权，5 宽分桶）──
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

  // ── 分布计算：无人机连续生成（同批次数量直方图）──
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
    return { rows, totalBatches, gt2Pct: 0 };
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
        droneTimes: [],    // 无人机生成绝对时刻（秒）
        maxSpawned: 0,     // 累计敌人生成数（Spawned 峰值）
        satSamples: [],    // {t(相对), live}
        rounds:     0,     // 已结算轮/波数
        lastRoundT: null,  // 最后一次轮次结算的绝对时刻（无尽任务有效终点）
        endT:       null,
      };
    }

    // 从 OnAgentCreated 行采样：累计生成峰值 + 活跃敌人饱和度
    function sampleAgentLine(line, t) {
      const sp = RE.agentSpawned.exec(line);
      if (sp) { const v = parseInt(sp[1], 10); if (v > m.maxSpawned) m.maxSpawned = v; }
      const mt = RE.agentMonitoredTick.exec(line);
      if (mt) m.satSamples.push({ t: t - m.startedT, live: parseInt(mt[1], 10) });
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
        const essEff         = essenceEfficiency(fullBuffPerHour);
        const killEff        = killEfficiency(sparsity);
        const prof           = proficiency(fullBuffPerHour, sparsity);
        const score          = computeScore(fullBuffPerHour, sparsity);

        // 权威节点库解析：节点名 / 星球 / 类型 / 派系（优先，回退到日志解析）
        const resolved = resolveNode(m.nodeId, m);

        // 无人机相对时刻（供分布/表格）
        const relTimes = m.droneTimes.map((x) => x - m.startedT);

        // 生息细分（对齐"无人机项 + 轮次奖励期望"口径）
        const droneFullBuff  = fromDrones * FULL_BUFF_MUL;   // 无人机期望生息（满 Buff）
        const roundGuarantee = rounds * 1;                   // 轮次保底
        const roundExtra     = rounds * 0.3;                 // 轮次额外期望（10%×3）

        records.push({
          type:            'arbitration',
          startT:          m.startedT,
          endT:            hostEnd,
          duration,
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
          },
          eff: {
            essence: essEff,       // 生息效率 %
            kill:    killEff,      // 击杀效率 %
            proficiency: prof,     // 熟练度 %
          },
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
          sampleAgentLine(line, t);
          return;
        }
        // 其它单位生成：饱和度采样 + Spawned 峰值
        if (line.indexOf('OnAgentCreated') !== -1) {
          sampleAgentLine(line, t);
          return;
        }

        // 轮/波结算（防御/拦截/镜像防御）
        if (RE.defenseReward.test(line)) {
          m.rounds++;
          m.lastRoundT = t;
          if (m.type === 'unknown') m.type = 'rounds';
          return;
        }
        // 生存奖励层（生存任务的轮）
        let r;
        if ((r = RE.survivalTier.exec(line))) {
          m.type = 'survival';
          m.rounds = Math.max(m.rounds, parseInt(r[1], 10));
          m.lastRoundT = t;
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

  return { create, computeScore, scoreTierName };
})();
