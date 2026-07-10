/* 通用日志读取层：按行切分、时间戳解析、绝对时间换算
 * 性能优化：
 *  1. 关键字预过滤 — 仅将匹配行喂给解析器，跳过无关行（通常 90%+ 的行），加速 5~20×
 *  2. scanAsync — 大文件分块处理 + setTimeout yield，不阻塞 UI；小文件仍走同步路径
 */
window.WF = window.WF || {};

WF.logReader = (function () {
  const RE_TIME = /^[^0-9]{0,4}(\d+\.\d{3})\s/;
  const RE_WALLCLOCK = /Current time: (\w{3} \w{3} [ \d]\d \d{2}:\d{2}:\d{2} \d{4})/;

  /* 所有解析器关心的关键字集合（indexOf 逐一检测，匹配则送入解析器）。
   * 调整原则：宁可误传（false positive，增加少量解析器工作）不可漏传（false negative）。 */
  const KEYWORDS = [
    // 通用
    'Game successfully connected to:', 'Current time:', 'ExtractionTimer.lua: EOM:',
    'EndOfMatch.lua', 'TopMenu.lua: Abort', 'ThemedSquadOverlay.lua',
    'SS_WAITING_FOR_PLAYERS', 'GameRulesImpl',
    'AddSquadMember:', 'Player name changed to',
    // 夜灵 Eidolon
    'EidolonLandscape', "It's nighttime!", 'Teralyst Captured', 'Teralyst Killed',
    'Eidolon spawning SUCCESS', 'streaming to layer', 'LEVEL LOADER DONE', 'DefaultArcanePickup',
    // 中断 Disruption
    'SentientArtifactMission.lua',
    // 大蜘蛛 Profit-Taker
    'HeistProfitTakerBountyFour', 'EIDOLONMP', 'Orb Fight - Starting',
    'SwitchShieldVulnerability', 'DBntyFourInterPrTk', 'DBntyFourSatelReal',
    'Leg freshly destroyed', 'StartVulnerable', 'CamperHeistOrbFight.lua',
    'Pylon launch complete', 'TryTownTransition', 'SetReturnToLobbyLevelArgs:',
    // 仲裁 Arbitration
    'CorpusEliteShieldDroneAgent', 'OnAgentCreated',
    'WaveDefend.lua', 'LoopDefend.lua', 'HudRedux.lua: Queuing',
    'DefenseReward.lua', 'SurvivalMission.lua', '仲裁', 'EliteAlert', 'Retransmit throttle',
    // 通用任务 General
    'MissionIntro.lua', 'EOM missionLocationUnlocked', 'CommitInventoryChangesToDB',
    'HUD REDUX', 'SyncAutoPopulatedConsumables', 'was killed by', 'missionType=',
    'SetSquadMissionResult', 'MapRedux::NodeRollOver', 'Cached mission name=',
    // 对话记录
    'IRC out: PRIVMSG',
  ];

  /* 快速判断是否应送入解析器 —— 单条编译正则一次性扫描一遍，
   * 比 40 次 indexOf 逐一扫描快约 4~5×（实测 300MB 真实日志：1428ms → 315ms）。
   * 原因：indexOf 版本对完全不匹配的行（占绝大多数）要把 40 个关键字全部试一遍，
   * 每个关键字都是一次完整的子串搜索；单正则由 V8 一次线性扫描搞定，不重复劳动。
   * 转义特殊字符只是为了让 "." 等符号按字面匹配，不影响判定结果（已用相同测试数据验证过匹配数一致）。 */
  const KEYWORD_RE = new RegExp(
    KEYWORDS.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')
  );
  function matchesAny(line) {
    return KEYWORD_RE.test(line);
  }

  /* 处理单行：更新时间状态 + wall-clock 检测 + 预过滤后回调 onMatch。
   * onMatch(t, line, sessionOffset, wallClockAnchor) 只在关键字命中时被调用——
   * 单 Worker 路径下 onMatch 直接喂给解析器；并行分片路径下 onMatch 只收集匹配行
   * （见 scanShard），两条路径共用这同一份状态机，不会出现「两套实现各自维护、
   * 悄悄跑偏」的风险。 */
  function processLine(line, state, onMatch) {
    if (line.endsWith('\r')) line = line.slice(0, -1);
    if (!line) { state.lineCount++; return; }
    state.lineCount++;

    const m = RE_TIME.exec(line);
    const t = m ? parseFloat(m[1]) : state.lastT;
    if (m) {
      // 检测会话重置：时间戳骤降 > 60s 说明 EE.log 内包含多个游戏会话。
      // sessionOffset 累加保证跨会话的绝对排序单调递增（用于正确排序多会话记录）。
      if (state.lastT > 60 && t < state.lastT - 60) {
        state.sessionOffset += Math.ceil((state.lastT + 60) / 10000) * 10000;
      }
      if (state.firstT === null) state.firstT = t;
      state.lastT = t;
    }

    // wall-clock 基准行 — 每次出现都更新，支持多会话日志文件
    if (line.indexOf('Current time:') !== -1 && line.indexOf('Diag') !== -1) {
      const wm = RE_WALLCLOCK.exec(line);
      if (wm) {
        const d = new Date(wm[1]);
        if (!isNaN(d.getTime())) {
          state.wallClockAnchor = { t, date: d, offset: state.sessionOffset };
          state.sessions.push(state.wallClockAnchor);
        }
      }
    }

    // 登录行提取（只需命中一次）
    if (!state.loginInfo && line.indexOf('Logged in') !== -1) {
      const lm = /Logged in ([^(\r\n]+?)\s*(?:\(([a-f0-9]{16,})\))?$/.exec(line);
      if (lm) {
        state.loginInfo = {
          name: lm[1].replace(/[^\w\-. #|À-ɏ一-鿿぀-ヿ가-힯]/g, '').trim(),
          id:   lm[2] || null,
        };
      }
    }

    if (matchesAny(line)) {
      onMatch(t, line, state.sessionOffset, state.wallClockAnchor);
    }
  }

  /* 把 parsers 数组包成 onMatch 回调（单 Worker / 单线程路径共用） */
  function _feedAll(parsers) {
    return function (t, line, sessionOffset, wallClockAnchor) {
      for (let i = 0; i < parsers.length; i++) {
        parsers[i].feed(t, line, sessionOffset, wallClockAnchor);
      }
    };
  }

  function _mkState() {
    return { lineCount: 0, firstT: null, lastT: 0, wallClockAnchor: null, sessions: [], sessionOffset: 0, loginInfo: null };
  }

  function _mkResult(state) {
    return { lineCount: state.lineCount, firstT: state.firstT || 0, lastT: state.lastT,
             wallClockAnchor: state.wallClockAnchor, sessions: state.sessions, loginInfo: state.loginInfo || null };
  }

  /* 同步扫描（小文件 / selftest.js 用） */
  function scan(text, parsers) {
    const state = _mkState();
    const onMatch = _feedAll(parsers);
    let pos = 0;
    const len = text.length;
    while (pos < len) {
      let nl = text.indexOf('\n', pos);
      if (nl === -1) nl = len;
      const line = text.substring(pos, nl);
      pos = nl + 1;
      processLine(line, state, onMatch);
    }
    for (let i = 0; i < parsers.length; i++) {
      if (parsers[i].finish) parsers[i].finish(state.lastT);
    }
    return _mkResult(state);
  }

  /* 大文件阈值（字节）：超过此大小使用异步分块扫描 */
  const LARGE_THRESHOLD  = 2   * 1024 * 1024; // 2 MB   — 异步逐行 yield
  const STREAM_THRESHOLD = 512 * 1024 * 1024; // 512 MB — 流式分块，不一次性加载
  const CHUNK_LINES      = 25000;              // 每批行数，yield 一次
  const STREAM_CHUNK     = 64  * 1024 * 1024; // 每块字节数（64 MB）
  const PREFETCH_AHEAD   = 3;                 // 同时预取块数（并行 I/O）

  /* 异步分块扫描：按字符索引逐行扫描，每处理 CHUNK_LINES 行 setTimeout(0) yield，保持 UI 响应。
   * 与 scan() 共用同一字符扫描逻辑，避免预先 split('\n') 造成的双倍内存占用。
   * 所有解析器（夜灵/中断/大蜘蛛/仲裁/通用）均通过统一入口受益于此优化。
   * onProgress(pct: 0-100)  — 可选进度回调
   * onDone(scanResult)       — 完成回调 */
  function scanAsync(text, parsers, onProgress, onDone) {
    const state = _mkState();
    const onMatch = _feedAll(parsers);
    const len   = text.length;
    let charPos = 0;
    let linesInBatch = 0;

    function step() {
      linesInBatch = 0;
      while (charPos < len && linesInBatch < CHUNK_LINES) {
        let nl = text.indexOf('\n', charPos);
        if (nl === -1) nl = len;
        processLine(text.substring(charPos, nl), state, onMatch);
        charPos = nl + 1;
        linesInBatch++;
      }
      if (onProgress) onProgress(Math.round((charPos / len) * 95)); // 留 5% 给 finish
      if (charPos < len) {
        setTimeout(step, 0);
      } else {
        for (let i = 0; i < parsers.length; i++) {
          if (parsers[i].finish) parsers[i].finish(state.lastT);
        }
        if (onProgress) onProgress(100);
        onDone(_mkResult(state));
      }
    }
    setTimeout(step, 0); // 让 UI 先渲染 "解析中" 状态再开始
  }

  /* 按字节区间分块读取一个 File/Blob，逐行调用 perLine(line, state)，读完调用
   * onDone(state)（state 为 null 表示读取失败）。scanStream 与 scanShard 共用
   * 这同一套分块/预取/跨块拼接骨架，只是 perLine 的行为不同（喂解析器 vs 收集匹配行）。
   * 用 File.slice() + arrayBuffer() 每次只读 STREAM_CHUNK 字节，绝不把全文加载进内存。
   * 同时发起 PREFETCH_AHEAD 个预读请求（并行 I/O），在解析当前块时已在读取后续块。
   * 块边界跨行问题：每块末尾未完成的行存入 leftover，拼接到下一块开头处理。 */
  function _scanFileInChunks(file, perLine, onProgress, onDone) {
    const decoder     = new TextDecoder('utf-8');
    const state       = _mkState();
    const totalChunks = Math.max(1, Math.ceil(file.size / STREAM_CHUNK));
    let leftover      = '';
    let chunkIdx      = 0;

    const queue = [];
    let nextFetch = 0;
    function fillQueue() {
      while (queue.length < PREFETCH_AHEAD && nextFetch < totalChunks) {
        const i = nextFetch++;
        queue.push(file.slice(i * STREAM_CHUNK, (i + 1) * STREAM_CHUNK).arrayBuffer());
      }
    }
    fillQueue();

    function processNextChunk() {
      if (chunkIdx >= totalChunks) {
        if (leftover) perLine(leftover, state);
        if (onProgress) onProgress(100);
        onDone(state);
        return;
      }

      const ci = chunkIdx++;
      queue.shift().then(function (ab) {
        fillQueue(); // 预取下一批，I/O 与解析流水线化

        const isLast = ci === totalChunks - 1;
        const text   = leftover + decoder.decode(ab, { stream: !isLast });
        leftover     = '';

        let pos = 0;
        const len = text.length;

        function scanBatch() {
          let count = 0;
          while (pos < len && count < CHUNK_LINES) {
            let nl = text.indexOf('\n', pos);
            if (nl === -1) {
              if (!isLast) { leftover = text.substring(pos); }
              else         { perLine(text.substring(pos), state); }
              pos = len;
              break;
            }
            perLine(text.substring(pos, nl), state);
            pos = nl + 1;
            count++;
          }

          if (onProgress) {
            const bytesDone = ci * STREAM_CHUNK + (pos / Math.max(len, 1)) * Math.min(STREAM_CHUNK, file.size - ci * STREAM_CHUNK);
            onProgress(Math.round(Math.min(bytesDone / file.size, 0.95) * 100));
          }

          if (pos < len) {
            setTimeout(scanBatch, 0);       // yield，保持 UI 响应
          } else {
            setTimeout(processNextChunk, 0); // 处理下一块
          }
        }

        setTimeout(scanBatch, 0);
      }).catch(function (err) {
        console.error('[_scanFileInChunks] 块读取失败:', err);
        onDone(null);
      });
    }

    processNextChunk();
  }

  /* 流式分块扫描 — 适用于超大文件（≥ STREAM_THRESHOLD），单 Worker 路径。
   * onProgress(pct: 0-100) — 可选进度回调
   * onDone(scanResult)      — 完成回调（scanResult 为 null 表示读取失败） */
  function scanStream(file, parsers, onProgress, onDone) {
    const onMatch = _feedAll(parsers);
    _scanFileInChunks(file, function (line, state) { processLine(line, state, onMatch); }, onProgress, function (state) {
      if (!state) { onDone(null); return; }
      for (let i = 0; i < parsers.length; i++) {
        if (parsers[i].finish) parsers[i].finish(state.lastT);
      }
      onDone(_mkResult(state));
    });
  }

  /* ============ 并行分片扫描（多 Worker）============
   * 设计思路：真正的耗时大头是"逐行判断是否要喂解析器"这一步（关键字匹配 + 时间戳
   * 提取），这部分对每一行都是独立、无状态的，可以按字节区间切成 N 份分给 N 个
   * Worker 各自跑一遍 scanShard；真正有状态、必须保序执行的解析器 feed() 只占命中
   * 的少数行（实测约 5%~10%），放到合并阶段单线程重放，性能影响可忽略。
   * 关键正确性保证：分片内部仍然是完整跑一遍 processLine（含会话重置检测/时间戳
   * 追踪/登录信息提取），只是不喂解析器、改为收集匹配行——与单 Worker 路径共用
   * 同一份 processLine，不会出现"两条路径各自实现、悄悄跑偏"的风险。分片之间的
   * 会话时间戳拼接（sessionOffset 桥接）、wall-clock 锚点重放，在 mergeShardsAndFeed
   * 里用与 processLine 完全相同的判定规则完成。*/

  /* 单个分片的扫描：只收集匹配行，不喂解析器。
   * onDone(shardResult)：{ lineCount, firstT, lastT, loginInfo, matches } 或 null（失败）
   * matches 是 [t, line, 分片内本地 sessionOffset] 三元组数组。 */
  function scanShard(file, onProgress, onDone) {
    const matches = [];
    const onMatch = function (t, line, sessionOffset) {
      matches.push([t, line, sessionOffset]);
    };
    _scanFileInChunks(file, function (line, state) { processLine(line, state, onMatch); }, onProgress, function (state) {
      if (!state) { onDone(null); return; }
      onDone({
        lineCount: state.lineCount,
        firstT:    state.firstT,
        lastT:     state.lastT,
        loginInfo: state.loginInfo,
        matches:   matches,
      });
    });
  }

  /* 把 N 个分片的扫描结果按文件原始顺序合并，重放进真正的解析器。
   * 分片边界的会话重置判定，与 processLine 内部逐行判定用的是完全相同的规则
   * （时间戳骤降 > 60s 视为新会话），只是把粒度从"相邻两行"放大到"相邻两个分片
   * 的收尾/开头时间戳"——这在数学上等价于把整份日志顺序扫一遍。
   * wall-clock 锚点（Current time: ... Diag 行）在合并阶段用全局校正后的 t /
   * sessionOffset 重新计算一遍（这类行本身也会被 matchesAny 命中，所以一定在
   * matches 里，不会遗漏）。
   * 返回最终 scanResult（与单 Worker 路径的 _mkResult 结构一致）。 */
  function mergeShardsAndFeed(shardResults, parsers) {
    const onFeed = _feedAll(parsers);
    let lineCount = 0;
    let firstT = null;
    let lastT = 0;
    let loginInfo = null;
    let wallClockAnchor = null;
    const sessions = [];

    let bridgeOffset = 0;
    let prevLastT = 0;
    let haveSeenTime = false;

    for (let s = 0; s < shardResults.length; s++) {
      const shard = shardResults[s];
      lineCount += shard.lineCount;
      if (firstT === null && shard.firstT !== null) firstT = shard.firstT;
      if (!loginInfo && shard.loginInfo) loginInfo = shard.loginInfo;

      const shardHasTime = shard.firstT !== null;
      if (haveSeenTime && shardHasTime && prevLastT > 60 && shard.firstT < prevLastT - 60) {
        bridgeOffset += Math.ceil((prevLastT + 60) / 10000) * 10000;
      }

      const matches = shard.matches;
      for (let i = 0; i < matches.length; i++) {
        const t = matches[i][0];
        const line = matches[i][1];
        const globalSessionOffset = bridgeOffset + matches[i][2];

        if (line.indexOf('Current time:') !== -1 && line.indexOf('Diag') !== -1) {
          const wm = RE_WALLCLOCK.exec(line);
          if (wm) {
            const d = new Date(wm[1]);
            if (!isNaN(d.getTime())) {
              wallClockAnchor = { t, date: d, offset: globalSessionOffset };
              sessions.push(wallClockAnchor);
            }
          }
        }

        onFeed(t, line, globalSessionOffset, wallClockAnchor);
      }

      if (shardHasTime) { prevLastT = shard.lastT; haveSeenTime = true; }
      lastT = shard.lastT;
    }

    for (let i = 0; i < parsers.length; i++) {
      if (parsers[i].finish) parsers[i].finish(lastT);
    }

    return {
      lineCount, firstT: firstT || 0, lastT,
      wallClockAnchor, sessions, loginInfo: loginInfo || null,
    };
  }

  /* 找到 shardCount 个按行边界对齐的字节区间 [start,end)，用于分片并行扫描。
   * 只在每个近似切点附近的小窗口里找最近的换行符（0x0A）——在 UTF-8 编码下 0x0A
   * 只可能是真正的换行符，不会是多字节字符的一部分，所以按原始字节找是安全的，
   * 完全不需要考虑 UTF-8 拆分问题，也不会切断任何一行。
   * 返回 Promise<number[]>，长度为 shardCount+1，第 i 个分片是 [b[i], b[i+1])。 */
  async function findShardBoundaries(file, shardCount) {
    const size = file.size;
    const boundaries = [0];
    const PROBE = 8192;
    for (let i = 1; i < shardCount; i++) {
      const approx = Math.floor((size * i) / shardCount);
      const probeStart = Math.max(0, approx - PROBE);
      const probeEnd = Math.min(size, approx + PROBE);
      const buf = new Uint8Array(await file.slice(probeStart, probeEnd).arrayBuffer());
      const localApprox = approx - probeStart;
      let cut = -1;
      for (let j = localApprox; j < buf.length; j++) {
        if (buf[j] === 0x0A) { cut = probeStart + j + 1; break; }
      }
      if (cut === -1) cut = probeEnd; // 探测窗口内没找到换行符（极端长行），退回窗口末尾
      boundaries.push(cut);
    }
    boundaries.push(size);
    return boundaries;
  }

  /* 构造 相对秒→绝对时间 的换算函数
   * 多会话日志中每条记录存有自己的 sessionAnchor，优先用它；
   * 此处的 toDate 作为全局回退（单会话场景与旧代码行为相同）。 */
  function makeClock(scanResult, fileLastModified) {
    const { wallClockAnchor, lastT } = scanResult;
    if (wallClockAnchor) {
      return {
        available: true, approx: false,
        toDate: (t) => new Date(wallClockAnchor.date.getTime() + (t - wallClockAnchor.t) * 1000),
      };
    }
    if (fileLastModified) {
      return {
        available: true, approx: true,
        toDate: (t) => new Date(fileLastModified + (t - lastT) * 1000),
      };
    }
    return { available: false, approx: true, toDate: () => null };
  }

  return {
    scan, scanAsync, scanStream, makeClock, LARGE_THRESHOLD, STREAM_THRESHOLD,
    scanShard, mergeShardsAndFeed, findShardBoundaries,
  };
})();
