window.WF = window.WF || {};

WF.GeneralParser = (function () {
  const MIN_DURATION = 5;

  const SKIP_TYPES = {
    MT_HUB: 1, MT_PVP: 1, MT_TUTORIAL: 1,
  };

  const TYPE_CN = {
    MT_EXTERMINATION:       '歼灭',
    MT_DEFENSE:             '防御',
    MT_SURVIVAL:            '生存',
    MT_EXCAVATION:          '掘矿',
    MT_INTERCEPTION:        '拦截',
    MT_CAPTURE:             '捕获',
    MT_RESCUE:              '救援',
    MT_SPY:                 '间谍',
    MT_MOBILE_DEFENSE:      '移动防御',
    MT_ASSAULT:             '突击',
    MT_SABOTAGE:            '破坏',
    MT_HIVE:                '蜂巢',
    MT_JUNCTION:            '通道',
    MT_PURSUIT:             '追击',
    MT_ALCHEMY:             '炼金',
    MT_ASSASSINATION:       '刺杀',
    MT_ARENA:               '竞技场',
    MT_CACHES:              '缓存',
    MT_CORPUS_LOOT_DEFENSE: '奸商托管',
    MT_ARTIFACT:            '中断',
    MT_LANDSCAPE:           '开放世界',
    MT_RAILJACK:            '铁骨战舰',
    MT_VOID_CASCADE:        '虚空瀑布',
    MT_VOID_FLOOD:          '虚空洪流',
    MT_VOID_ARMAGEDDON:     '虚空末日',
    MT_VOID_FISSURE:        '虚空裂缝',
    MT_NETHERCELLS:         '深渊',
    MT_FEED_THE_TENNO:      '纳罗供养',
    MT_GENERIC_COOPTIVE:    '合作任务',
  };

  // Endless mission type labels
  const ENDLESS_CN = {
    defense:      '防御',
    loopDefense:  '镜像防御',
    survival:     '生存',
    interception: '拦截',
  };

  const PAT = {
    connected:       'Game successfully connected to:',
    syncMission:     'SyncAutoPopulatedConsumables for mission ',
    missionTypeFB:   'missionType=',
    missionName:     'MissionIntro.lua: MissionName:',
    missionNameOvl:  'ThemedSquadOverlay.lua: Mission name:',
    nodeRollOver:    'MapRedux::NodeRollOver ',
    cachedMission:   'Cached mission name=',
    ssStarted:       'SS_WAITING_FOR_PLAYERS to SS_STARTED',
    ssEnding:        'SS_STARTED to SS_ENDING',
    hudRedux:        'HUD REDUX: Pushing background movie from Update',
    eomUnlock:       'EOM missionLocationUnlocked',
    eomExtract:      'ExtractionTimer.lua: EOM: All players extracting',
    commitDB:        'CommitInventoryChangesToDB',
    squadResult:     'SetSquadMissionResult',
    abort:           'TopMenu.lua: Abort',
    failed:          'EndOfMatch.lua: Mission Failed',
    // Defense / wave tracking
    waveStart:       'WaveDefend.lua: Starting wave ',        // "Starting wave N, spawning a total of M"
    defenseWaveAlt:  'WaveDefend.lua: Defense wave:',         // "Defense wave: N"
    waveSpawned:     'total spawned in current wave:',
    waveLeft:        'WaveDefend.lua: WaveDefend: num enemies left ',
    // 镜像防御（LoopDefend）
    loopDefWave:     'LoopDefend.lua: Loop Defense wave:',
    // 拦截新一轮开始信号
    interRoundStart: 'InterNewRoundLotusTransmission',
    defenseReward:   'DefenseReward::TransitionOut',
    // 生存轮次奖励层
    survivalTier:    'Survival: Gave reward tier',
    // Kill / spawn
    killed:          'was killed by',
    agentCreated:    'OnAgentCreated',
    // Chat
    ircPrivmsg:      'IRC out: PRIVMSG ',
  };


  // NPC path substrings indicating non-combat agents (pets, players, objectives, drones)
  const AGENT_SKIP = ['PetAgent', 'PlayerPawnAgent', 'DefenseAgent', 'CleaningDroneAgent', 'CrewAgent', 'CrewmemberAgent'];

  // Warframe internal localization key paths (/Lotus/Language/...) that show up raw in EE.log
  // because the game engine resolves them at runtime but never writes the resolved string back.
  // Map well-known substrings to their Chinese display names; unknown paths are dropped (null).
  const LANG_PATH_MAP = [
    // ── 火卫二 / 解剖圣所 ─────────────────────────────────────
    ['EntratiLabSixMinuteChallenge', '解剖圣所（火卫二）'],  // 6分钟孽杀附加挑战
    ['EntratiLab',                   '解剖圣所（火卫二）'],  // 火卫二圣所通用
    // ── 特殊任务类型 ───────────────────────────────────────────
    ['NarmerSortie',                 '奥拉姆突袭'],
    ['SteelPath',                    '钢铁之路'],
    ['KuvaSiphon',                   '赤毒虹吸'],
    ['KuvaFlood',                    '赤毒洪潮'],
    ['VoidFissure',                  '虚空裂缝'],
    ['SentinelChallenge',            '哨兵任务'],
    // ── 深层/时序科研 ──────────────────────────────────────────
    ['DeepArchimedea',               '深层科研'],
    ['TemporalArchimedea',           '时光科研'],
    // ── 双衍王境 ──────────────────────────────────────────────
    ['DuvirrParadox',                '双衍悖论'],
    ['Duviri',                       '双衍王境'],
    // ── 开放世界（通常由 NodeRollOver 提供正确名称，此为备用）──
    ['EidolonLandscape',             '夜灵平野'],
    ['OrbVallis',                    '奥布山谷'],
    ['CambionDrift',                 '魔胎之境'],
  ];

  // Chinese hub/social-area names that may appear in MissionIntro.lua:MissionName but are NOT
  // mission names — they indicate the player was in a hub when the log line fired.
  // Returning null causes the card to fall back to locationDisplay (the real node name).
  const HUB_SUPPRESS = new Set([
    '羽化之穹',  // Chrysalith — Zariman Ten Zero 社交中枢
    '殁世幽都',  // Necralisk  — 火卫二 社交中枢
    '希图斯',    // Cetus       — 地球平原 社交中枢
    '福尔图纳',  // Fortuna     — 金星平原 社交中枢
    '双衍王境',  // Duviri      — 双衍王境 (作为中枢出现时抑制，节点名另有来源)
  ]);

  function _cleanMissionName(raw) {
    if (!raw) return null;
    if (HUB_SUPPRESS.has(raw)) return null;         // 社交中枢名 → 抑制，使用 locationDisplay
    if (/^[A-Z0-9_]+$/.test(raw)) return null;      // 全大写内部代码（COPERNICUS 等）→ 抑制
    if (!raw.startsWith('/Lotus/Language/')) return raw;
    for (let i = 0; i < LANG_PATH_MAP.length; i++) {
      if (raw.indexOf(LANG_PATH_MAP[i][0]) !== -1) return LANG_PATH_MAP[i][1];
    }
    return null;  // 未知 Lotus 路径 → 调用方回退到 locationDisplay
  }

  function create() {
    const records = [];
    const nodeNameMap = {};  // SolNodeN → display name (session-wide)
    let m = null;
    let pendingSync = null;  // buffered before 'connected'
    let _sessionOffset = 0;    // 多会话绝对排序偏移（由 logReader 传入）
    let _sessionAnchor = null; // 当前会话 wall-clock 锚点（由 logReader 传入）
    const sq   = WF.squadMixin.create();
    const chat = WF.chatMixin.create();

    function reset() { m = null; }

    function newMission(t, carry) {
      carry = carry || {};
      m = {
        loadT:           t,
        startT:          null,
        firstFrameT:     null,
        endT:            null,
        missionType:     carry.missionType     || null,
        missionName:     carry.missionName     || null,
        locationNode:    carry.locationNode    || null,
        locationDisplay: carry.locationDisplay || null,
        sessionOffset:   _sessionOffset,   // 用于多会话绝对排序
        sessionAnchor:   _sessionAnchor,   // 用于计算绝对时刻
        // ── Endless mission segments ──
        endlessType:      null,       // 'defense'|'loopDefense'|'survival'|'interception'
        waves:            [],         // defense / loopDefense wave records (pushed by closeCurrentWave)
        currentWave:      null,       // open defense/loopDefense wave
        survivalSegs:     [],         // [{tier, startT, endT, duration, spawned}] for survival
        survivalSegStart: null,       // start of current survival segment
        survivalSegSpawned: 0,        // enemy spawn count for the segment currently in progress
        interSegs:        [],         // [{round, startT, endT, duration}] for interception
        interSegStart:    null,       // start of current interception segment
        // ── Kill / spawn totals ──
        kills:   0,
        spawned: 0,
        aborted: false,
      };
    }

    function closeCurrentWave(endT) {
      if (!m || !m.currentWave) return;
      const w = m.currentWave;
      w.endT     = endT;
      w.duration = endT - w.startT;
      if (w.segType === 'defense' || w.segType === 'loopDefense') {
        // Use WaveDefend "total spawned" count when available — more accurate than kill-event counting
        const accurate = w.totalSpawned > 0 ? w.totalSpawned : (w.totalEnemies || 0);
        w.actualSpawned = accurate;
        if (accurate > 0) {
          // kills = spawned − remaining; also keep per-event count as lower bound
          w.kills = Math.max(w.kills, accurate - (w.enemiesLeft || 0));
        }
      }
      m.waves.push(w);
      m.currentWave = null;
    }

    // 收尾时把"进行中但还没被 defenseReward 关闭"的最后一轮拦截补上——
    // 结算流程里 "EOM missionLocationUnlocked" 往往比最后一轮真正的
    // DefenseReward::TransitionOut 早几十毫秒触发，若不在这里补上，
    // 最后一轮会被直接丢弃（例如 10 轮的任务只统计出 9 轮）。
    function closeCurrentInterSeg(endT) {
      if (!m || m.endlessType !== 'interception') return;
      if (m.interSegStart == null || endT <= m.interSegStart) return;
      m.interSegs.push({
        round:    m.interSegs.length + 1,
        startT:   m.interSegStart,
        endT,
        duration: endT - m.interSegStart,
      });
      m.interSegStart = endT;
    }

    function resolveDisplay() {
      if (m.locationDisplay) return m.locationDisplay;
      if (m.locationNode && nodeNameMap[m.locationNode]) return nodeNameMap[m.locationNode];
      return m.locationNode || null;
    }

    function finalize(t) {
      if (!m || m.aborted) { reset(); return; }
      if (!m.missionType || SKIP_TYPES[m.missionType]) { reset(); return; }
      const start = m.startT || m.loadT;
      const end   = m.endT || t;
      if (end - start < MIN_DURATION) { reset(); return; }
      closeCurrentWave(end);
      closeCurrentInterSeg(end);
      const anchor = m.sessionAnchor;
      const offset = m.sessionOffset || 0;
      records.push({
        type:            'general',
        missionType:     m.missionType,
        missionTypeCN:   TYPE_CN[m.missionType] || m.missionType,
        missionName:     m.missionName || '—',
        locationNode:    m.locationNode,
        locationDisplay: resolveDisplay(),
        startT:          start,
        firstFrameT:     m.firstFrameT,
        endT:            end,
        // 多会话支持：endAbsT 用于跨会话正确排序
        endAbsT:         end + offset,
        // 每条记录存自己的 wall-clock 锚点，保证多会话日志中时刻计算准确
        startDate:      anchor ? new Date(anchor.date.getTime() + (start - anchor.t) * 1000) : null,
        endDate:        anchor ? new Date(anchor.date.getTime() + (end   - anchor.t) * 1000) : null,
        firstFrameDate: (anchor && m.firstFrameT != null)
          ? new Date(anchor.date.getTime() + (m.firstFrameT - anchor.t) * 1000) : null,
        totalDuration:   end - start,
        frameDuration:   (m.firstFrameT != null) ? (end - m.firstFrameT) : null,
        // Endless data
        endlessType:     m.endlessType,
        endlessTypeCN:   ENDLESS_CN[m.endlessType] || null,
        waves:           m.waves,
        survivalSegs:    m.survivalSegs,
        interSegs:       m.interSegs,
        // Totals
        kills:           m.kills,
        spawned:         m.spawned,
        squadInfo:       sq.getSquadInfo(),
        chatLog:         chat.getChatLog(m.loadT, start, end),
      });
      reset();
    }

    return {
      feed(t, line, sessionOffset, sessionAnchor) {
        sq.feed(line);
        // 跟踪会话信息（用于跨会话绝对排序和日期计算）
        if (sessionOffset !== undefined) _sessionOffset = sessionOffset;
        if (sessionAnchor !== undefined) _sessionAnchor = sessionAnchor;

        // ── NodeRollOver: build name map (no m required) ──────
        if (line.indexOf(PAT.nodeRollOver) !== -1) {
          const rx = /MapRedux::NodeRollOver ([\w/:.+-]+) - (.+)/.exec(line);
          if (rx) nodeNameMap[rx[1].trim()] = rx[2].trim();
          return;
        }

        // ── SyncAutoPopulatedConsumables (BEFORE !m guard) ───
        // Fires before 'connected'. Buffer into pendingSync so type isn't lost when m is null.
        if (line.indexOf(PAT.syncMission) !== -1) {
          const rx = /SyncAutoPopulatedConsumables for mission (\w+) with location (\w+)/.exec(line);
          if (rx) {
            const type = rx[1];
            const node = rx[2];
            pendingSync = { missionType: type, locationNode: node };
            if (m) {
              if (!SKIP_TYPES[type]) m.missionType = type;
              m.locationNode = m.locationNode || node;
              if (!m.locationDisplay && nodeNameMap[node]) m.locationDisplay = nodeNameMap[node];
            }
          }
          return;
        }

        // ── connected: apply pendingSync and start new mission ──
        if (line.indexOf(PAT.connected) !== -1) {
          const ps = pendingSync;
          let carry = null;
          if (ps) {
            carry = {
              missionType:     ps.missionType,
              locationNode:    ps.locationNode,
              locationDisplay: nodeNameMap[ps.locationNode] || null,
              missionName:     m ? m.missionName : null,
            };
          } else if (m && !m.startT) {
            carry = {
              missionType:     m.missionType,
              missionName:     m.missionName,
              locationNode:    m.locationNode,
              locationDisplay: m.locationDisplay,
            };
          }
          pendingSync = null;
          newMission(t, carry);
          return;
        }

        // ── IRC 对话（全局收集，不依赖 m） ───────────────────────
        if (line.indexOf(PAT.ircPrivmsg) !== -1) {
          chat.feed(t, line);
          return;
        }

        if (!m) return;

        // ── Cached mission name (rich node display) ───────────
        if (line.indexOf(PAT.cachedMission) !== -1) {
          const i   = line.indexOf(PAT.cachedMission);
          const raw = line.substring(i + PAT.cachedMission.length).trim();
          const rx  = /^(.+?)\s*\(SolNode(\d+)\)\s*$/.exec(raw);
          if (rx) {
            m.locationDisplay = rx[1].trim();
            const solKey = 'SolNode' + rx[2];
            if (!m.locationNode) m.locationNode = solKey;
            if (!nodeNameMap[solKey]) {
              nodeNameMap[solKey] = rx[1].trim().split(/\s*[-—]\s*/)[0].split(' (')[0].trim();
            }
          }
          return;
        }

        // ── mission type fallback ─────────────────────────────
        if (!m.missionType && line.indexOf(PAT.missionTypeFB) !== -1) {
          const rx = /missionType=(\w+)/.exec(line);
          if (rx && !SKIP_TYPES[rx[1]]) m.missionType = rx[1];
          return;
        }

        // ── mission name ──────────────────────────────────────
        // MissionIntro fires early with internal codes or hub names; only adopt if useful.
        if (line.indexOf(PAT.missionName) !== -1) {
          const i = line.indexOf(PAT.missionName);
          const cleaned = _cleanMissionName(line.substring(i + PAT.missionName.length).trim());
          if (cleaned !== null) m.missionName = cleaned;
          return;
        }
        // ThemedSquadOverlay provides the human-readable display name; use it to fill gaps.
        if (!m.missionName && line.indexOf(PAT.missionNameOvl) !== -1) {
          const i = line.indexOf(PAT.missionNameOvl);
          const cleaned = _cleanMissionName(line.substring(i + PAT.missionNameOvl.length).trim());
          if (cleaned !== null) m.missionName = cleaned;
          return;
        }

        // ── timing anchors ────────────────────────────────────
        if (line.indexOf(PAT.ssStarted) !== -1) {
          m.startT = t;
          return;
        }
        if (line.indexOf(PAT.hudRedux) !== -1 && m.firstFrameT == null) {
          m.firstFrameT = t;
          return;
        }

        // ══ ENDLESS MISSION WAVE / SEGMENT TRACKING ══════════

        // ── Defense: "Starting wave N, spawning a total of M" ─
        if (line.indexOf(PAT.waveStart) !== -1) {
          const rx = /Starting wave (\d+),?\s*spawning a total of (\d+)/.exec(line);
          if (rx) {
            const wn    = parseInt(rx[1], 10);
            const total = parseInt(rx[2], 10);
            if (m.currentWave && m.currentWave.index === wn) {
              // defenseWaveAlt already opened this wave — just update the enemy count
              m.currentWave.totalEnemies = total;
            } else {
              closeCurrentWave(t);
              if (!m.endlessType) m.endlessType = 'defense';
              m.currentWave = {
                segType: 'defense',
                index: wn, totalEnemies: total,
                startT: t, endT: null, duration: null,
                totalSpawned: 0, enemiesLeft: 0, kills: 0, spawned: 0,
              };
            }
          }
          return;
        }
        if (line.indexOf(PAT.waveLeft) !== -1 && m.currentWave) {
          const rx = /num enemies left (\d+)/.exec(line);
          if (rx) m.currentWave.enemiesLeft = parseInt(rx[1], 10);
          return;
        }
        if (line.indexOf(PAT.waveSpawned) !== -1 && m.currentWave) {
          const rx = /total spawned in current wave:\s*(\d+)/.exec(line);
          if (rx) {
            const n = parseInt(rx[1], 10);
            if (n > m.currentWave.totalSpawned) m.currentWave.totalSpawned = n;
          }
          return;
        }

        // ── Defense alt: "Defense wave: N" ───
        if (line.indexOf(PAT.defenseWaveAlt) !== -1) {
          const rx = /Defense wave:\s*(\d+)/.exec(line);
          if (rx) {
            const wn = parseInt(rx[1], 10);
            // Only open a new wave if no wave is already open for this index
            if (!m.currentWave || m.currentWave.index !== wn) {
              closeCurrentWave(t);
              if (!m.endlessType) m.endlessType = 'defense';
              m.currentWave = {
                segType: 'defense',
                index: wn,
                totalEnemies: 0,
                startT: t, endT: null, duration: null,
                totalSpawned: 0, enemiesLeft: 0,
                kills: 0, spawned: 0,
              };
            }
          }
          return;
        }

        // ── Mirror Defense: "Loop Defense wave: N" ─
        if (line.indexOf(PAT.loopDefWave) !== -1) {
          const rx = /Loop Defense wave:\s*(\d+)/.exec(line);
          if (rx) {
            const wn = parseInt(rx[1], 10);
            if (!m.currentWave || m.currentWave.index !== wn) {
              closeCurrentWave(t);
              m.endlessType = 'loopDefense';
              m.currentWave = {
                segType: 'loopDefense',
                index: wn,
                totalEnemies: 0,
                startT: t, endT: null, duration: null,
                totalSpawned: 0, enemiesLeft: 0,
                kills: 0, spawned: 0,
              };
            }
          }
          return;
        }

        // ── DefenseReward TransitionOut: marks round end for interception ─
        // 每轮结算只应由这一个事件驱动边界（同时充当"上一轮结束"与"下一轮开始"）。
        // 注意：InterNewRoundLotusTransmission（下面那个信号）会在这次结算前 1~2 秒
        // 提前触发，如果也用它来刷新 interSegStart，会把边界提前到资源加载的那一刻，
        // 导致每轮时长被腰斩成"资源加载信号 → 结算信号"之间的 1~3 秒空档，
        // 而不是真正的整轮时长——所以该信号只用于确认任务类型，不参与边界计算。
        if (line.indexOf(PAT.defenseReward) !== -1) {
          const et = m.endlessType;
          if (et !== null && et !== 'interception') return;  // defense/survival use other trackers
          if (et === null) m.endlessType = 'interception';
          if (m.endlessType === 'interception') {
            // interSegStart 的初始化只看它自己有没有被设过，不依赖 endlessType 是否
            // 早于本行就被 interRoundStart 提前确认——否则第一轮的起点永远不会被设置。
            if (m.interSegStart == null) m.interSegStart = m.startT || m.loadT;
            m.interSegs.push({
              round:    m.interSegs.length + 1,
              startT:   m.interSegStart,
              endT:     t,
              duration: t - m.interSegStart,
            });
            m.interSegStart = t;
          }
          return;
        }

        // ── Interception: new round start signal ──────────
        // 仅用于在 DefenseReward 尚未出现前提前确认任务类型为拦截，不参与边界计算
        // （原因见上面 defenseReward 分支的注释）。
        if (line.indexOf(PAT.interRoundStart) !== -1) {
          if (!m.endlessType) m.endlessType = 'interception';
          return;
        }

        // ── Survival tier reward ──────────────
        // "Survival: Gave reward tier N at TIME" — fires at each 5-min reward checkpoint
        if (line.indexOf(PAT.survivalTier) !== -1) {
          const rx = /Survival: Gave reward tier (\d+)/.exec(line);
          if (rx) {
            const tier = parseInt(rx[1], 10);
            if (!m.endlessType) m.endlessType = 'survival';
            const segStart = m.survivalSegStart || m.startT || m.loadT;
            m.survivalSegs.push({
              tier,
              startT:   segStart,
              endT:     t,
              duration: t - segStart,
              spawned:  m.survivalSegSpawned,
            });
            m.survivalSegStart    = t;
            m.survivalSegSpawned  = 0;
          }
          return;
        }

        // ══ KILL / SPAWN COUNTING ═════════════════════════════

        // Enemy spawn counting (filtered OnAgentCreated)
        if (line.indexOf(PAT.agentCreated) !== -1 && line.indexOf('/Npc/') !== -1) {
          let skip = false;
          for (let k = 0; k < AGENT_SKIP.length; k++) {
            if (line.indexOf(AGENT_SKIP[k]) !== -1) { skip = true; break; }
          }
          if (!skip) {
            m.spawned++;
            if (m.currentWave) m.currentWave.spawned++;
            else if (m.endlessType === 'survival') m.survivalSegSpawned++;
          }
          return;
        }

        // NOTE: 'was killed by' in EE.log captures friendly NPCs killed by enemies,
        // NOT player kills of enemies. Warframe does not log individual enemy kill events
        // for most mission types. Kill totals for defense waves come from spawned-remaining.

        // ══ EOM TRIGGERS ══════════════════════════════════════
        // Any one of these finalises the record.
        // abort/fail detection below resets m first, so SS_ENDING only reaches
        // successfully completed missions.
        if (line.indexOf(PAT.eomUnlock)   !== -1 ||
            line.indexOf(PAT.eomExtract)  !== -1 ||
            line.indexOf(PAT.commitDB)    !== -1 ||
            line.indexOf(PAT.squadResult) !== -1 ||
            line.indexOf(PAT.ssEnding)    !== -1) {
          if (!m.endT) m.endT = t;
          finalize(t);
          return;
        }

        // Abort / fail
        if (line.indexOf(PAT.abort) !== -1 || line.indexOf(PAT.failed) !== -1) {
          m.aborted = true;
          reset();
        }
      },

      finish() {},
      results() { return records; },
    };
  }

  return { create };
})();
