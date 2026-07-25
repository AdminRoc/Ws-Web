/* 入口：文件上传、解析调度、Tab 路由
 * 大文件（≥ LARGE_THRESHOLD）走 scanAsync 分块扫描，UI 保持响应并显示进度 */
(function () {
  const U = WF.utils;

  /* ══════════════════════════════════════════════════════
     安全复制模块：目录授权 + IndexedDB 持久化 + OPFS 流式复制
     ══════════════════════════════════════════════════════ */
  const IDB_DB = 'wtf-eelog';
  const IDB_STORE = 'handles';
  const IDB_DIR_KEY = 'warframe-dir-handle';
  const OPFS_NAME = 'eelog_copy.log';
  const HAS_FSAPI = typeof window.showOpenFilePicker === 'function';

  const safeCopy = {
    _overlay: null, _pctEl: null, _fillEl: null,
    _copiedEl: null, _speedEl: null, _subEl: null, _detailEl: null,
    _abortCtrl: null,

    _cache() {
      if (this._overlay) return;
      this._overlay  = document.getElementById('safe-copy-overlay');
      this._pctEl    = document.getElementById('sco-pct');
      this._fillEl   = document.getElementById('sco-bar-fill');
      this._copiedEl = document.getElementById('sco-copied');
      this._speedEl  = document.getElementById('sco-speed');
      this._subEl    = document.getElementById('sco-sub');
      this._detailEl = document.getElementById('sco-detail');
    },

    /* ── 进度弹窗控制 ── */
    show() {
      this._cache();
      if (!this._overlay) return;
      this._pctEl.textContent = '0%';
      this._fillEl.style.width = '0%';
      this._copiedEl.textContent = '0 MB';
      this._speedEl.textContent = '—';
      this._detailEl.textContent = '复制完成后将自动开始解析';
      this._overlay.classList.remove('closing');
      this._overlay.classList.add('visible');
      this._overlay.setAttribute('aria-hidden', 'false');
    },
    hide() {
      this._cache();
      if (!this._overlay) return;
      this._overlay.classList.add('closing');
      this._overlay.setAttribute('aria-hidden', 'true');
      setTimeout(() => { this._overlay.classList.remove('visible', 'closing'); }, 500);
    },
    update(pct, copiedBytes, speedMBps) {
      this._cache();
      const p = Math.min(100, Math.round(pct * 100));
      this._pctEl.textContent = p + '%';
      this._fillEl.style.width = p + '%';
      this._copiedEl.textContent = (copiedBytes / 1048576).toFixed(1) + ' MB';
      if (speedMBps != null && speedMBps > 0) this._speedEl.textContent = speedMBps.toFixed(1) + ' MB/s';
    },
    abort() { if (this._abortCtrl) this._abortCtrl.abort(); },

    /* ── IndexedDB 操作 ── */
    async _idbOpen() {
      return new Promise((resolve, reject) => {
        const req = indexedDB.open(IDB_DB, 1);
        req.onupgradeneeded = () => { req.result.createObjectStore(IDB_STORE); };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      });
    },
    async _idbGet(key) {
      try {
        const db = await this._idbOpen();
        return new Promise((resolve, reject) => {
          const tx = db.transaction(IDB_STORE, 'readonly');
          const req = tx.objectStore(IDB_STORE).get(key);
          req.onsuccess = () => resolve(req.result || null);
          req.onerror = () => reject(req.error);
        });
      } catch { return null; }
    },
    async _idbPut(key, value) {
      try {
        const db = await this._idbOpen();
        return new Promise((resolve, reject) => {
          const tx = db.transaction(IDB_STORE, 'readwrite');
          tx.objectStore(IDB_STORE).put(value, key);
          tx.oncomplete = () => resolve();
          tx.onerror = () => reject(tx.error);
        });
      } catch { /* 静默 */ }
    },

    /* ── 目录 handle 持久化 ── */
    async getDirHandle() { return this._idbGet(IDB_DIR_KEY); },
    async saveDirHandle(h) { return this._idbPut(IDB_DIR_KEY, h); },

    /* ── 权限检查与恢复 ── */
    async verifyPermission(handle, write) {
      const opts = { mode: write ? 'readwrite' : 'read' };
      if ((await handle.queryPermission(opts)) === 'granted') return true;
      if ((await handle.requestPermission(opts)) === 'granted') return true;
      return false;
    },

    /* ── 判断文件是否来自游戏目录 ── */
    async isFromGameDir(fileHandle) {
      const dir = await this.getDirHandle();
      if (!dir) return false;
      try {
        const rel = await dir.resolve(fileHandle);
        return Array.isArray(rel) && rel.length === 1 && rel[0] === 'EE.log';
      } catch { return false; }
    },

    /* ── OPFS 流式复制 ── */
    async copyToOPFS(sourceHandle) {
      this._abortCtrl = new AbortController();
      const signal = this._abortCtrl.signal;
      const srcFile = await sourceHandle.getFile();
      const opfs = await navigator.storage.getDirectory();
      try { await opfs.removeEntry(OPFS_NAME); } catch {}
      const dest = await opfs.getFileHandle(OPFS_NAME, { create: true });
      const writable = await dest.createWritable();
      const reader = srcFile.stream().getReader();
      let copied = 0;
      const t0 = performance.now();
      const totalSize = srcFile.size;
      while (true) {
        if (signal.aborted) { reader.cancel(); await writable.close().catch(() => {}); throw new DOMException('Aborted', 'AbortError'); }
        const { done, value } = await reader.read();
        if (done) break;
        await writable.write(value);
        copied += value.byteLength;
        const elapsed = (performance.now() - t0) / 1000;
        this.update(totalSize > 0 ? copied / totalSize : 0, copied, elapsed > 0 ? (copied / 1048576) / elapsed : null);
      }
      await writable.close();
      const copyHandle = await opfs.getFileHandle(OPFS_NAME);
      return { copyFile: await copyHandle.getFile(), srcName: srcFile.name, srcLastModified: srcFile.lastModified };
    },

    /* ── 清理 OPFS ── */
    async cleanup() {
      try { const opfs = await navigator.storage.getDirectory(); await opfs.removeEntry(OPFS_NAME).catch(() => {}); } catch {}
    },

    /* ═══ 入口 A：读取游戏路径（目录授权 → 自动找 EE.log → 复制 → 读取）═══ */
    async gamePathRead(statusEl) {
      let dirHandle = await this.getDirHandle();
      if (dirHandle) {
        const ok = await this.verifyPermission(dirHandle, false);
        if (!ok) dirHandle = null;
      }
      if (!dirHandle) {
        dirHandle = await window.showDirectoryPicker({ mode: 'read' });
        await this.saveDirHandle(dirHandle);
      }
      let fileHandle;
      try {
        fileHandle = await dirHandle.getFileHandle('EE.log');
      } catch {
        throw new Error('在所选目录中未找到 EE.log');
      }
      this.show();
      try {
        const { copyFile, srcName, srcLastModified } = await this.copyToOPFS(fileHandle);
        const elapsed = ((performance.now()) / 1000).toFixed(1);
        this._detailEl.textContent = '复制完成，开始解析…';
        await new Promise(r => setTimeout(r, 300));
        return new File([copyFile], srcName, { type: copyFile.type, lastModified: srcLastModified });
      } finally {
        this.hide();
        this.cleanup();
      }
    },

    /* ═══ 入口 B：读取其他路径（直接选择文件 → 直接读取）═══ */
    async otherPathRead() {
      const [handle] = await window.showOpenFilePicker({
        types: [{ description: 'EE.log', accept: { 'text/plain': ['.log', '.txt'] } }],
        multiple: false,
      });
      return await handle.getFile();
    },

    /* ═══ 入口 C：拖拽（检测来源 → 分流）═══ */
    async dragRead(file, fileHandle) {
      if (HAS_FSAPI && fileHandle) {
        const fromGame = await this.isFromGameDir(fileHandle);
        if (fromGame) {
          this.show();
          try {
            const { copyFile, srcName, srcLastModified } = await this.copyToOPFS(fileHandle);
            this._detailEl.textContent = '复制完成，开始解析…';
            await new Promise(r => setTimeout(r, 300));
            return new File([copyFile], srcName, { type: copyFile.type, lastModified: srcLastModified });
          } finally {
            this.hide();
            this.cleanup();
          }
        }
      }
      return file;  // 非游戏目录，直接读取
    },
  };

  const TABS = [
    { id: 'profile',     label: '个人信息', en: 'PROFILE',       special: true },
    { id: 'eidolon',     label: '夜灵',    en: 'EIDOLON',       view: () => WF.eidolonView,     empty: '未找到夜灵捕获记录', priority: (rec) => (rec.full ? 0 : 1) },
    { id: 'disruption',  label: '中断',    en: 'DISRUPTION',    view: () => WF.disruptionView,  empty: '未找到中断任务记录（需房主日志，任务须正常结算或至少完成 1 轮）' },
    { id: 'profitTaker', label: '大蜘蛛',  en: 'PROFIT-TAKER',  view: () => WF.profitTakerView, empty: '未找到完整的 Profit-Taker 击杀记录' },
    { id: 'arbitration', label: '仲裁',    en: 'ARBITRATION',   view: () => WF.arbitrationView, empty: '未找到有效的仲裁任务记录（需房主日志，时长 ≥60 秒）' },
    { id: 'general',     label: '通用',    en: 'GENERAL',       view: () => WF.generalView,     empty: '未找到有效的通用任务记录（仅记录正常结算、非大厅/PVP 任务）' },
  ];

  const _urlTab = new URLSearchParams(window.location.search).get('tab');
  const _initTab = TABS.find((t) => t.id === _urlTab) ? _urlTab : 'disruption';
  let state = {
    results: null, clock: null, activeTab: _initTab,
    profileState: { accountId: null, playerName: null, profileJson: null },
  };
  const $ = (id) => document.getElementById(id);

  function init() {
    const drop = $('dropzone');
    const btnGame = $('dz-btn-game');
    const btnOther = $('dz-btn-other');
    const statusEl = $('dropzone-status');

    // ── 按钮 A：读取游戏路径（目录授权 → 复制 → 读取）──
    btnGame.addEventListener('click', async () => {
      if (!HAS_FSAPI) {
        statusEl.textContent = '浏览器不支持 File System Access API，请使用"读取其他路径"';
        return;
      }
      btnGame.disabled = true;
      btnOther.disabled = true;
      try {
        const file = await safeCopy.gamePathRead(statusEl);
        loadFile(file);
      } catch (err) {
        if (err.name !== 'AbortError') {
          statusEl.textContent = '读取失败：' + err.message;
          console.error('游戏路径读取失败:', err);
        }
      } finally {
        btnGame.disabled = false;
        btnOther.disabled = false;
      }
    });

    // ── 按钮 B：读取其他路径（直接选择 → 直接读取）──
    btnOther.addEventListener('click', async () => {
      if (HAS_FSAPI) {
        btnGame.disabled = true;
        btnOther.disabled = true;
        try {
          const file = await safeCopy.otherPathRead();
          loadFile(file);
        } catch (err) {
          if (err.name !== 'AbortError') {
            statusEl.textContent = '读取失败：' + err.message;
            console.error('其他路径读取失败:', err);
          }
        } finally {
          btnGame.disabled = false;
          btnOther.disabled = false;
        }
      } else {
        // 降级：传统 file input
        $('file-input').click();
      }
    });

    // ── 传统 file input 降级 ──
    $('file-input').addEventListener('change', () => {
      if ($('file-input').files[0]) loadFile($('file-input').files[0]);
    });

    // ── 拖拽：全窗体可拖入，检测来源分流 ──
    ['dragenter', 'dragover'].forEach((ev) => drop.addEventListener(ev, (e) => {
      e.preventDefault(); drop.classList.add('dragging');
    }));
    ['dragleave', 'drop'].forEach((ev) => drop.addEventListener(ev, (e) => {
      e.preventDefault(); drop.classList.remove('dragging');
    }));
    drop.addEventListener('drop', async (e) => {
      const f = e.dataTransfer.files && e.dataTransfer.files[0];
      if (!f) return;
      let fileHandle = null;
      if (HAS_FSAPI && e.dataTransfer.items && e.dataTransfer.items[0]) {
        try {
          const h = await e.dataTransfer.items[0].getAsFileSystemHandle();
          if (h instanceof FileSystemFileHandle) fileHandle = h;
        } catch {}
      }
      try {
        const file = await safeCopy.dragRead(f, fileHandle);
        loadFile(file);
      } catch (err) {
        if (err.name !== 'AbortError') {
          statusEl.textContent = '读取失败：' + err.message;
          console.error('拖拽读取失败:', err);
        }
      }
    });

    const tabBar = $('tab-bar');
    TABS.forEach((tab) => {
      const btn = U.el('button', 'tab-btn');
      btn.dataset.tab = tab.id;
      btn.appendChild(U.el('span', 'tab-glow', ''));
      const text = U.el('span', 'tab-text');
      text.appendChild(U.el('span', 'tab-cn', tab.label));
      text.appendChild(U.el('span', 'tab-en', tab.en));
      btn.appendChild(text);
      const badge = U.el('span', 'tab-count', '');
      badge.style.display = 'none';
      btn.appendChild(badge);
      btn.addEventListener('click', () => switchTab(tab.id));
      tabBar.appendChild(btn);
    });
    updateTabBar();
  }

  function loadFile(file) {
    const statusEl = $('dropzone-status');
    const sizeMB   = (file.size / 1048576).toFixed(1);
    const t0       = performance.now();
    statusEl.innerHTML = `解析中… <b>${U.escapeHtml(file.name)}</b>（${sizeMB} MB）`;

    const onProgress = (pct) => {
      statusEl.innerHTML = `解析中… <b>${U.escapeHtml(file.name)}</b>（${sizeMB} MB）&nbsp;&nbsp;${pct}%`;
    };

    function onDone(scan, results) {
      if (!scan) { statusEl.textContent = '文件读取失败'; return; }
      try {
        const clock = WF.logReader.makeClock(scan, file.lastModified);
        state.results = results;
        state.clock = clock;

        // 每次新上传都重置个人资料状态，避免旧数据/旧 loading 状态阻塞新流程
        state.profileState = { accountId: null, playerName: null, profileJson: null };

        // 登录信息由 logReader 在逐行扫描时提取（支持流式大文件路径）
        // 账号 ID 只在客户端完整冷启动的登录握手行才会带括号；日志若从中途片段
        // 开始（常见于长任务/日志轮转裁切），可能只留下不带括号的 "Logged in Name"，
        // 此时账号 ID 无法从本地日志推断——不臆造，转入下方手动补充流程。
        if (scan.loginInfo) {
          state.profileState.playerName = scan.loginInfo.name;
          if (scan.loginInfo.id) state.profileState.accountId = scan.loginInfo.id;
        }

        const ms = (performance.now() - t0).toFixed(0);
        const r = state.results;
        statusEl.innerHTML =
          `<b>${U.escapeHtml(file.name)}</b>（${sizeMB} MB，${scan.lineCount.toLocaleString()} 行，${ms} ms）` +
          ` — 通用 <b>${r.general.length}</b> ｜ 夜灵 <b>${r.eidolon.length}</b> ｜ 中断 <b>${r.disruption.length}</b>` +
          ` ｜ 大蜘蛛 <b>${r.profitTaker.length}</b> ｜ 仲裁 <b>${r.arbitration.length}</b>` +
          (clock.approx && clock.available ? '<br><span class="muted">日志内无系统时间行，绝对时间按文件修改时间估算（前缀 ≈）</span>' : '');

        document.body.classList.add('has-data');

        if (state.activeTab === 'profile') {
          _showProfileGuide();
        } else {
          const nonSpecial = TABS.filter((t) => !t.special);
          const urlTabHasData = _urlTab && !TABS.find((t) => t.id === _urlTab)?.special
            && state.results[_urlTab] && state.results[_urlTab].length;
          const firstWithData = urlTabHasData
            ? TABS.find((t) => t.id === _urlTab)
            : (nonSpecial.find((t) => state.results[t.id].length) || nonSpecial[0]);
          switchTab(firstWithData.id);
        }
      } catch (err) {
        statusEl.textContent = `结果处理失败：${err.message}`;
        console.error(err);
      }
    }

    // 超大文件（>4GB）即使多核也强制走单 Worker 流式路径：
    // 8 分片并行时每个 shard Worker 积累全量匹配行再一次性发给 merge Worker，
    // 10GB 级文件实测峰值内存超过渲染进程上限导致崩溃；单 Worker 流式路径
    // 只保留当前 64MB 块，内存恒定约 200MB。KEYWORD_RE 优化后速度约 70-100s，
    // 仍满足 <3min 目标。≤4GB 文件继续走并行（安全且更快）。
    const PARALLEL_SIZE_LIMIT = 4 * 1024 * 1024 * 1024;
    const shardCount = (file.size <= PARALLEL_SIZE_LIMIT)
      ? Math.min(8, Math.max(1, (navigator.hardwareConcurrency || 1)))
      : 1;

    if (file.size >= WF.logReader.STREAM_THRESHOLD && shardCount > 1) {
      // 超大文件 + 多核：按字节区间切成 shardCount 份并行扫描（真正的多核并行，
      // 而不只是把单线程逻辑挪进 Worker）。耗时大头「逐行判断是否命中关键字」
      // 对每一行都是无状态的，可以安全地分片并行；有状态的解析器 feed() 只发生在
      // 命中的少数行上，放到合并阶段单线程重放，性能影响可忽略。
      // 正确性：合并阶段用与单 Worker 路径完全相同的会话重置规则拼接分片边界，
      // 结果与单 Worker 路径逐字段比对完全一致（见 selftest 校验）。
      const baselineUrl = new URL('../data/arb-node-baseline.json', window.location.href).href;
      runParallelScan(file, shardCount, baselineUrl, onProgress, onDone, statusEl);
    } else if (file.size >= WF.logReader.STREAM_THRESHOLD) {
      // 超大文件但单核（或浏览器不支持 hardwareConcurrency）：退回单 Worker 流式扫描
      const baselineUrl = new URL('../data/arb-node-baseline.json', window.location.href).href;
      const worker = new Worker('js/logWorker.js?v=20260718d');
      worker.onmessage = (e) => {
        const msg = e.data;
        if (msg.type === 'progress') { onProgress(msg.pct); }
        else if (msg.type === 'error') { onDone(null); worker.terminate(); }
        else if (msg.type === 'done') { onDone(msg.scan, msg.results); worker.terminate(); }
      };
      worker.onerror = (err) => {
        statusEl.textContent = `解析失败：${err.message}`;
        console.error(err);
        worker.terminate();
      };
      worker.postMessage({ file, baselineUrl });
    } else {
      // 普通文件（< 512 MB）：FileReader 一次性读入，异步分块解析（主线程）
      const eidolon     = WF.EidolonParser.create();
      const disruption  = WF.DisruptionParser.create();
      const profitTaker = WF.ProfitTakerParser.create();
      const arbitration = WF.ArbitrationParser.create();
      const general     = WF.GeneralParser.create();
      const parsers = [eidolon, disruption, profitTaker, arbitration, general];
      const collectResults = () => ({
        general:     general.results(),
        eidolon:     eidolon.results(),
        disruption:  disruption.results(),
        profitTaker: profitTaker.results(),
        arbitration: arbitration.results(),
      });

      const reader = new FileReader();
      reader.onload = () => {
        const text = reader.result;
        try {
          if (file.size >= WF.logReader.LARGE_THRESHOLD) {
            WF.logReader.scanAsync(text, parsers, onProgress, (scan) => onDone(scan, collectResults()));
          } else {
            onDone(WF.logReader.scan(text, parsers), collectResults());
          }
        } catch (err) {
          statusEl.textContent = `解析失败：${err.message}`;
          console.error(err);
        }
      };
      reader.onerror = () => { statusEl.textContent = '文件读取失败'; };

      // 与超大文件 Worker 路径对齐：确保仲裁分节点基准数据就绪后再开始解析。
      // 页面初始化时 analyzer.html 已发起预热请求，此处 load() 若数据已就绪则
      // 浏览器会命中 HTTP 缓存立即返回；仅当预热请求尚未完成或此前失败时才会
      // 真正发起网络请求。load() 内部有 catch 兜底，失败时 data 保持 null、
      // 解析器会退回默认 1000/时基准——不阻塞、不影响任何既有流程。
      const baselineUrl = new URL('../data/arb-node-baseline.json', window.location.href).href;
      WF.ArbNodeBaseline.load(baselineUrl).then(() => reader.readAsText(file));
    }
  }

  /* 多 Worker 并行分片扫描：
   * 1. 按行边界把 file 切成 shardCount 份（findShardBoundaries，主线程做，探测窗口很小很快）
   * 2. 每份丢给一个 logShardWorker.js 并行扫描，只收集匹配行，不喂解析器
   * 3. 分片结果通过 MessageChannel 直接发给 logMergeWorker.js，不经过主线程中转——
   *    命中行文本量可能有几十到几百 MB，若先回传主线程再转发，等于让主线程做两次
   *    大数据量结构化克隆，会把主线程堵死一段时间（真实 10GB 文件上实测会卡住）。
   *    主线程全程只收发很小的进度数字和最终结果，不摸这份大数据。 */
  function runParallelScan(file, shardCount, baselineUrl, onProgress, onDone, statusEl) {
    WF.logReader.findShardBoundaries(file, shardCount).then((boundaries) => {
      const shardSizes = [];
      for (let i = 0; i < shardCount; i++) shardSizes.push(boundaries[i + 1] - boundaries[i]);

      const mergeWorker = new Worker('js/logMergeWorker.js?v=20260718d');
      const shardWorkers = [];
      let failed = false;

      function cleanup() {
        shardWorkers.forEach((w) => w.terminate());
        mergeWorker.terminate();
      }

      mergeWorker.onmessage = (e) => {
        const msg = e.data;
        if (msg.type === 'progress') {
          onProgress(msg.pct);
        } else if (msg.type === 'error') {
          if (failed) return;
          failed = true;
          onDone(null);
          cleanup();
        } else if (msg.type === 'done') {
          onDone(msg.scan, msg.results);
          cleanup();
        }
      };
      mergeWorker.onerror = (err) => {
        if (failed) return;
        failed = true;
        statusEl.textContent = `解析失败：${err.message}`;
        console.error(err);
        cleanup();
      };

      const ports = [];
      for (let i = 0; i < shardCount; i++) {
        const channel = new MessageChannel();
        ports.push(channel.port1);
        const worker = new Worker('js/logShardWorker.js?v=20260718a');
        shardWorkers.push(worker);
        worker.onerror = (err) => {
          if (failed) return;
          failed = true;
          statusEl.textContent = `解析失败：${err.message}`;
          console.error(err);
          cleanup();
        };
        worker.postMessage(
          { file, start: boundaries[i], end: boundaries[i + 1], shardIndex: i, port: channel.port2 },
          [channel.port2]
        );
      }
      mergeWorker.postMessage({ ports, baselineUrl, shardCount, shardSizes }, ports);
    }).catch((err) => {
      statusEl.textContent = `解析失败：${err.message}`;
      console.error(err);
    });
  }

  function updateTabBar() {
    document.querySelectorAll('.tab-btn').forEach((b) => {
      b.classList.toggle('active', b.dataset.tab === state.activeTab);
      const badge = b.querySelector('.tab-count');
      const tabDef = TABS.find((t) => t.id === b.dataset.tab);
      if (tabDef && tabDef.special) { badge.style.display = 'none'; return; }
      if (state.results) {
        const n = (state.results[b.dataset.tab] || []).length;
        badge.textContent = String(n);
        badge.style.display = '';
        badge.classList.toggle('zero', n === 0);
      }
    });
  }

  /* 个人资料获取：通过剪贴板引导用户自行复制 Warframe API JSON
   * （Warframe API 直接禁止跨域访问，代理方案均已失效） */
  function _showProfileGuide() {
    /* 个人信息页要翻译大量物品名，依赖完整字典：等 WF.i18n.ready 后再渲染，
       保证字典已就位、绝不出现未翻译英文（遵守"优化不削弱汉化"原则）。
       其它 tab（中断/夜灵等）不依赖大字典，不经过这里、无需等待。
       仍不做任何网络请求之外的事，只显示剪贴板引导面板。 */
    if (state.activeTab !== 'profile') return;
    WF.i18n.ready.then(function () {
      if (state.activeTab === 'profile') WF.profileView.render($('detail'), state.profileState);
    });
  }

  function switchTab(tabId) {
    state.activeTab = tabId;
    document.body.classList.toggle('profile-active', tabId === 'profile');
    updateTabBar();

    const listBox   = $('record-list');
    const detailBox = $('detail');
    listBox.innerHTML   = '';
    detailBox.innerHTML = '';

    if (tabId === 'profile') {
      _showProfileGuide();
      return;
    }

    if (!state.results) {
      detailBox.appendChild(U.el('div', 'empty-state', '上传 EE.log 后在此查看分析结果'));
      return;
    }
    const tab     = TABS.find((t) => t.id === tabId);
    const records = state.results[tabId];
    const view    = tab.view();

    if (!records.length) {
      detailBox.appendChild(U.el('div', 'empty-state', tab.empty));
      return;
    }
    WF.recordList.render(listBox, records, state.clock, view.summary, (rec) => {
      view.render(detailBox, rec, state.clock);
    }, tab.priority);
  }

  document.addEventListener('DOMContentLoaded', init);
})();
