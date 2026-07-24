window.WF = window.WF || {};

WF.DisruptionParser = (function () {
  const MIN_ROUNDS = 1;

  const PAT = {
    connected:     'Game successfully connected to:',
    missionName:   'ThemedSquadOverlay.lua: Mission name:',
    ssStarted:     'SS_WAITING_FOR_PLAYERS to SS_STARTED',
    modeState:     'SentientArtifactMission.lua: ModeState =',
    randomized:    'SentientArtifactMission.lua: Disruption: Randomized ',
    artifactStatus: 'SentientArtifactMission.lua: Disruption: Artifact ',
    conduitStart:  'SentientArtifactMission.lua: Disruption: Starting defense for artifact',
    conduitDone:   'SentientArtifactMission.lua: Disruption: Completed defense for artifact',
    conduitFail:   'SentientArtifactMission.lua: Disruption: Failed defense for artifact',
    totalScore:    'SentientArtifactMission.lua: Disruption: Total score is',
    intervalEnded: 'SentientArtifactMission.lua: Disruption: Interval timer ended',
    eom:           'ExtractionTimer.lua: EOM: All players extracting',
    abort:         'TopMenu.lua: Abort',
    failed:        'EndOfMatch.lua: Mission Failed',
    agentCreated:  'OnAgentCreated',
    stalkerSpawn:  'LotusGameRules.lua: spawned persistent enemy!',
    stalkerKill:   'LotusGameRules.lua: persistent enemy was killed!',
  };

  // Conduit effect ID → Chinese display name（按维基表格顺序，ID 映射待游戏内验证）
  // 减益 (debuff) IDs 1-27；增益 (buff) IDs 31-38
  const EFFECT_NAMES = {
    // ── 减益效果 (debuffs) ── 已校准 ID 以实测 log 为准 ────────
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
    // ── 增益效果 (buffs) ── 已校准 ────────────────────────────
    31: '补给导管',
    32: 'Tenno速度加成',
    33: '50%经验值加成',
    34: '50%资源加成',
    35: '50%现金加成',
    36: 'Tenno武器吸血加成',
    37: 'Tenno射速加成',
    38: '导管卫士',
  };

  // 危险减益 ID（需黄色高亮）：能量值消耗=3，更强大的密钥搬运者=6，群居狩猎野兽=23，敌方毒素武器=15
  const BAD_DEBUFF_IDS = new Set([3, 6, 15, 23]);

  // NPC path substrings indicating non-combat agents (pets, players, objectives, drones)
  const AGENT_SKIP = ['PetAgent', 'PlayerPawnAgent', 'DefenseAgent', 'CleaningDroneAgent', 'CrewAgent', 'CrewmemberAgent'];

  function create() {
    const records = [];
    let mission = null;
    let roundStartT = null;
    let _sessionOffset = 0;    // 多会话绝对排序偏移（由 logReader 传入，见 feed 末两参）
    let _sessionAnchor = null; // 当前会话 wall-clock 锚点（由 logReader 传入，见 feed 末两参）
    let pendingRoll = 0;       // 前置 Roll 图计数：载入中断任务但未进入第3轮（轮次<3）就退出的次数
    const sq   = WF.squadMixin.create();
    const chat = WF.chatMixin.create();

    function reset() { mission = null; roundStartT = null; }

    // 提取存档逻辑为独立函数，供 eom 和 finish() 复用
    // opts: { unsettled } — true 时表示中止/失败的未结算任务（≥3轮），截断到最后完成轮
    function saveMission(endT, opts) {
      if (!mission || !mission.isDisruption) return;
      const unsettled = !!(opts && opts.unsettled);
      // 未结算任务：截断到最后一个完成轮的 ModeState=4 时刻（该轮次完成=导管全部结算的时刻），
      // 避免将中止/失败后的空闲时间计入统计。
      let effectiveEndT = endT;
      if (unsettled) {
        effectiveEndT = (mission.lastModeState4T != null) ? mission.lastModeState4T : endT;
      }
      // 关闭还未结算的尾轮（仅正常结算流程）：
      // lastModeState4T 仅当属于最后一轮（>= 最后一轮.startT）时才有效——
      // 否则意味着最后一轮从未到达 ModeState=4（例如中途撤离），回退到 endT。
      // 未结算任务跳过此步骤：不完整轮不压入 rounds，保留 rounds 仅含已完成轮。
      let roundEndT = endT;
      if (unsettled) {
        mission.roundOpen = false;
        mission.openConduits = [];
      } else {
        const lr = mission.rounds.length > 0 ? mission.rounds[mission.rounds.length - 1] : null;
        roundEndT = (mission.lastModeState4T != null && lr && mission.lastModeState4T >= lr.startT)
          ? mission.lastModeState4T : endT;
        if (mission.roundOpen) closeRoundAt(roundEndT);
      }
      // 轮次<3 的中断任务不生成记录，计为一次前置 Roll 图
      if (mission.rounds.length < 3) { pendingRoll++; return; }
      const start  = mission.startT || mission.loadT;
      const dur    = effectiveEndT - start;
      if (dur <= 0) return;
      const n      = mission.rounds.length;
      const successConds = mission.rounds.reduce((s, r) => s + r.conduits.filter(c => c.success === true).length, 0);
      const totalConds   = mission.rounds.reduce((s, r) => s + r.conduits.filter(c => c.success !== null).length, 0);
      const condRate  = totalConds > 0 ? successConds / totalConds : 1;
      const rndPerMin = n / (dur / 60);
      const effScore  = Math.min(70, (rndPerMin / 1.8) * 70);
      const ps = Math.round(effScore + condRate * 30);
      const pg = ps >= 90 ? 'S' : ps >= 75 ? 'A' : ps >= 55 ? 'B' : ps >= 35 ? 'C' : 'D';
      // 第1轮重定基：剥离开局时长（进场→首次击杀的准备段）。
      // killEvents 只在 roundOpen 期间记录，首个元素即全场第一次击杀。
      // 首杀落在 R1 区间内时，把 R1 起点平移到首杀时刻，导管 relT 同步减去 shift；
      // r1.duration / r1.cumulative 保持自任务开始起算，不动；killEvents 数组本身不动。
      let openingEndT = null;
      if (mission.killEvents.length > 0) {
        const fk = mission.killEvents[0];
        const r1 = mission.rounds[0];
        if (fk > r1.startT && fk < r1.endT) {
          const shift = fk - r1.startT;
          r1.startT = fk;
          r1.combatDuration = r1.endT - fk;
          r1.conduits.forEach(c => {
            // 结果 <0 时 clamp 为 0：极端日志兜底（导管记录在首杀之前的开局段内），正常日志不会触发
            if (c.insertRelT !== null) c.insertRelT = Math.max(0, c.insertRelT - shift);
            if (c.doneRelT  !== null) c.doneRelT  = Math.max(0, c.doneRelT  - shift);
          });
          openingEndT = fk;
        }
      }
      // 绝对时刻换算：sessionAnchor = {t, date}，把相对秒数差换成真实时钟时间；
      // endAbsT 用于跨会话绝对排序（格式与仲裁记录一致）
      const anchor = mission.sessionAnchor;
      const offset = mission.sessionOffset || 0;
      records.push({
        type: 'disruption',
        startT: start, endT: effectiveEndT,
        endAbsT:  effectiveEndT + offset,
        startDate: anchor ? new Date(anchor.date.getTime() + (start - anchor.t) * 1000) : null,
        endDate:   anchor ? new Date(anchor.date.getTime() + (effectiveEndT - anchor.t) * 1000) : null,
        totalDuration: dur,
        name: mission.name, score: mission.score,
        rounds: mission.rounds, roundCount: n,
        openingEndT, // 第1轮开局段终点（首杀时刻）；不满足条件时 null。开局时长 = openingEndT − startT
        roundsPerMin: rndPerMin, conduitRate: condRate,
        successConduits: successConds, totalConduits: totalConds,
        perfScore: ps, perfGrade: pg,
        preRollCount: pendingRoll,
        liveSamples: mission.liveSamples,
        killEvents: mission.killEvents,
        stalkerEvents: mission.stalkerEvents,
        lastModeState4T: unsettled ? null : (roundEndT !== endT ? mission.lastModeState4T : null),
        unsettled: unsettled || undefined,
        squadInfo: sq.getSquadInfo(),
        chatLog:   chat.getChatLog(mission.loadT, start, effectiveEndT),
      });
      pendingRoll = 0;
    }

    function newMission(t) {
      mission = {
        loadT: t, startT: null,
        name: null,
        rounds: [],
        openConduits: [],
        roundOpen: false,
        prevEndT: null,
        score: null,
        isDisruption: false,
        currentRoundKills: 0,
        currentRoundSpawned: 0,
        killEvents: [],
        stalkerEvents: [],  // Stalker 入侵事件 {startT, endT|null}，与 rounds[].startT 同一时钟
        liveSamples: [],      // {t(日志内绝对秒，与 rounds[].startT 同一时钟), live(生成后的场上敌数)}，轮内与轮间间隔都采
        tiles: {},            // 导管编号 → tile 数字（Artifact status 行给出，整局有效）
        sessionOffset: _sessionOffset, // 用于多会话绝对排序
        sessionAnchor: _sessionAnchor, // 用于把相对秒数换算成真实时钟时间
        areaEffects: {},      // area 1-4 → {kind:'buff'|'debuff', id:N} for current round
        intervalEndedT: null, // Interval timer ended timestamp (precise round start for rounds > 1)
        lastModeState4T: null, // 最后一次 ModeState=4 的时刻（用于计算撤离时间）
        _prevLiveAfter: null, // Live count after previous enemy agent was created (for kill delta)
      };
      roundStartT = null;
    }

    function effectiveStart() {
      return mission.startT || mission.loadT;
    }

    function closeRoundAt(t) {
      if (!mission) return;
      if (mission.prevEndT === null) mission.prevEndT = effectiveStart();
      const idx   = mission.rounds.length + 1;
      const rStart = roundStartT !== null ? roundStartT : mission.prevEndT;
      const conduits = mission.openConduits.map(c => ({
        success:    c.success,
        artNum:     c.artNum,
        insertT:    c.insertT,
        insertRelT: c.insertRelT,
        doneT:      c.doneT,
        doneRelT:   c.doneRelT,
        effectKind: c.effectKind,
        effectId:   c.effectId,
        tile:       mission.tiles[c.artNum] != null ? mission.tiles[c.artNum] : null,
      }));
      mission.rounds.push({
        index:           idx,
        startT:          rStart,
        endT:            t,
        combatDuration:  t - rStart,
        duration:        t - mission.prevEndT,
        cumulative:      t - effectiveStart(),
        conduits,
        kills:           mission.currentRoundKills,
        spawned:         mission.currentRoundSpawned,
      });
      mission.prevEndT = t;
      mission.openConduits = [];
      mission.roundOpen = false;
      mission.currentRoundKills = 0;
      mission.currentRoundSpawned = 0;
      mission._prevLiveAfter = null;
      roundStartT = null;
    }

    return {
      feed(t, line, sessionOffset, sessionAnchor) {
        if (sessionOffset !== undefined) _sessionOffset = sessionOffset;
        if (sessionAnchor !== undefined) _sessionAnchor = sessionAnchor;
        sq.feed(line);
        chat.feed(t, line);
        if (line.indexOf(PAT.connected) !== -1) {
          newMission(t);
          return;
        }
        // 日志从中途开始时无 connected 行——遇到中断专属行时自动建立 mission
        if (!mission && line.indexOf('SentientArtifactMission.lua') !== -1) {
          newMission(t);
        }
        if (!mission) return;

        if (line.indexOf(PAT.missionName) !== -1) {
          const i = line.indexOf(PAT.missionName);
          mission.name = line.substring(i + PAT.missionName.length).trim();
          return;
        }
        if (line.indexOf(PAT.ssStarted) !== -1) {
          mission.startT = t;
          mission.prevEndT = null;
          return;
        }
        if (line.indexOf(PAT.modeState) !== -1) {
          mission.isDisruption = true;
          const m = /ModeState\s*=\s*(\d+)/.exec(line);
          if (!m) return;
          const state = parseInt(m[1], 10);
          if (state === 3) {
            mission.roundOpen = true;
            mission.areaEffects = {};   // reset for new round
            mission._prevLiveAfter = null; // reset Live-delta tracking for new round
            // 轮次起点精度优化：
            // 第1轮没有 Interval timer ended，用 ModeState=3 时间；
            // 后续轮次若已记录 Interval timer ended，则用该更精确时刻作为起点。
            if (mission.rounds.length === 0 || mission.intervalEndedT == null) {
              roundStartT = t;
            } else {
              roundStartT = mission.intervalEndedT;
            }
            mission.intervalEndedT = null;
          } else if (state === 4) {
            // 孤儿 ModeState=4 守卫：日志从中途接入（错过 state=3）时不压入零导管幻影轮
            if (mission.roundOpen) closeRoundAt(t);
            mission.lastModeState4T = t;  // 记录最后 ModeState=4 时刻，用于计算撤离时间
          }
          return;
        }
        if (line.indexOf(PAT.intervalEnded) !== -1) {
          mission.intervalEndedT = t;
          return;
        }
        if (line.indexOf(PAT.artifactStatus) !== -1) {
          mission.isDisruption = true;
          const am = /Artifact (\d+) status=\d+, timer=\d+, auraId=\d+, tile=(\d+)/.exec(line);
          if (am) mission.tiles[parseInt(am[1], 10)] = parseInt(am[2], 10);
          return;
        }
        if (line.indexOf(PAT.randomized) !== -1) {
          mission.isDisruption = true;
          const rx = /Randomized (buff|debuff) for area (\d+): (\d+)/.exec(line);
          if (rx) {
            mission.areaEffects[parseInt(rx[2], 10)] = {
              kind: rx[1],   // 'buff' | 'debuff'
              id:   parseInt(rx[3], 10),
            };
          }
          return;
        }
        if (line.indexOf(PAT.conduitStart) !== -1) {
          mission.isDisruption = true;
          const rBase  = roundStartT !== null ? roundStartT : (mission.prevEndT || effectiveStart());
          const artRx  = /Starting defense for artifact\s+(\d+)/.exec(line);
          const artNum = artRx ? parseInt(artRx[1], 10) : null;
          const effect = (artNum != null && mission.areaEffects[artNum]) || null;
          mission.openConduits.push({
            success: null, artNum,
            insertT: t, insertRelT: t - rBase,
            effectKind: effect ? effect.kind : null,
            effectId:   effect ? effect.id   : null,
          });
          return;
        }
        if (line.indexOf(PAT.conduitDone) !== -1 || line.indexOf(PAT.conduitFail) !== -1) {
          mission.isDisruption = true;
          const ok    = line.indexOf(PAT.conduitDone) !== -1;
          const rBase = roundStartT !== null ? roundStartT : (mission.prevEndT || effectiveStart());
          const artRx  = /(Completed|Failed) defense for artifact\s+(\d+)/.exec(line);
          const artNum = artRx ? parseInt(artRx[2], 10) : null;
          const pending = mission.openConduits.find(c =>
            c.success === null && (artNum == null || c.artNum === artNum)
          );
          if (pending) {
            pending.success  = ok;
            pending.doneT    = t;
            pending.doneRelT = t - rBase;
          } else {
            mission.openConduits.push({ success: ok, artNum, insertT: null, insertRelT: null, doneT: t, doneRelT: t - rBase });
          }
          return;
        }

        // Kill + spawn counting via Live-delta on OnAgentCreated lines
        // Live=X means X agents alive BEFORE this new agent is created.
        // When Live drops between consecutive enemy spawns, enemies died in between.
        // SentinelAgent0 (Live=0 or very low) is a sentinel setup/reset — rebase the counter.
        // 场上敌量采样：只要中断任务存在（isDisruption）就采，不要求 roundOpen，轮间间隔也采；
        // 击杀/生成计数仍仅在 roundOpen 内进行（与原有逻辑一致）。
        if (mission.isDisruption &&
            line.indexOf(PAT.agentCreated) !== -1 &&
            line.indexOf('/Npc/') !== -1) {
          // Parse Live value from "Live N"
          const liveM = /\bLive\s+(\d+)/.exec(line);
          if (!liveM) return;
          const liveBefore = parseInt(liveM[1], 10);

          // Check if this is a sentinel agent (named "SentinelAgent")
          const isSentinel = line.indexOf('SentinelAgent') !== -1;

          if (isSentinel) {
            // Sentinel resets the baseline without contributing kills or spawns
            // （Sentinel 行不参与场上敌量采样）
            if (mission.roundOpen) mission._prevLiveAfter = liveBefore + 1;
            return;
          }

          // Check skip list (pets, players, drones, etc.)
          let skip = false;
          for (let k = 0; k < AGENT_SKIP.length; k++) {
            if (line.indexOf(AGENT_SKIP[k]) !== -1) { skip = true; break; }
          }
          if (skip) return;

          // 场上敌量采样：live 取生成后的场上数（liveBefore+1，与 _prevLiveAfter 同口径）
          mission.liveSamples.push({ t, live: liveBefore + 1 });

          if (!mission.roundOpen) return;

          // Compute kills from Live drop since last tracked agent
          if (mission._prevLiveAfter !== null) {
            const kills = Math.max(0, mission._prevLiveAfter - liveBefore);
            if (kills > 0) {
              mission.currentRoundKills += kills;
              for (let ki = 0; ki < kills; ki++) mission.killEvents.push(t);
            }
          }
          mission._prevLiveAfter = liveBefore + 1;
          mission.currentRoundSpawned++;
          return;
        }
        if (line.indexOf(PAT.totalScore) !== -1) {
          const m = /Total score is\s*(\d+)/.exec(line);
          if (m) mission.score = parseInt(m[1], 10);
          return;
        }
        // Stalker 入侵事件采集：开始以 spawned persistent enemy! 为准（'Spawning Stalker' 是提前约 12 秒的预警行，不用）
        if (line.indexOf(PAT.stalkerSpawn) !== -1) {
          mission.stalkerEvents.push({ startT: t, endT: null });
          return;
        }
        if (line.indexOf(PAT.stalkerKill) !== -1) {
          // 配对最近一个未结束的事件；无未配对事件则忽略
          for (let si = mission.stalkerEvents.length - 1; si >= 0; si--) {
            if (mission.stalkerEvents[si].endT === null) { mission.stalkerEvents[si].endT = t; break; }
          }
          return;
        }
        if (line.indexOf(PAT.eom) !== -1) {
          saveMission(t);
          reset();
          return;
        }
        if (line.indexOf(PAT.abort) !== -1 || line.indexOf(PAT.failed) !== -1) {
          if (mission.isDisruption && mission.rounds.length >= 3) {
            // ≥3 轮的中止/失败：保存为未结算记录，截断到最后完成轮
            saveMission(t, { unsettled: true });
          } else if (mission.isDisruption && mission.rounds.length < 3) {
            // 轮次<3 计为一次前置 Roll 图
            pendingRoll++;
          }
          reset();
        }
      },

      finish(lastT) {
        if (mission) { saveMission(lastT); reset(); }
      },
      results() { return records; },
      MIN_ROUNDS,
    };
  }

  return { create, MIN_ROUNDS };
})();
