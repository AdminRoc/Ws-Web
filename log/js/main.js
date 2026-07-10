/* 入口：文件上传、解析调度、Tab 路由
 * 大文件（≥ LARGE_THRESHOLD）走 scanAsync 分块扫描，UI 保持响应并显示进度 */
(function () {
  const U = WF.utils;

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
    const fileInput = $('file-input');

    drop.addEventListener('click', () => fileInput.click());

    // 右侧快捷框：复制路径，阻止冒泡避免触发文件选择
    const shortcut = $('dz-shortcut');
    const feedback = $('dz-sc-feedback');
    let fbTimer = null;
    shortcut.addEventListener('click', (e) => {
      e.stopPropagation();
      navigator.clipboard.writeText('%LOCALAPPDATA%\\Warframe').then(() => {
        feedback.textContent = '✓ 已复制！';
        clearTimeout(fbTimer);
        fbTimer = setTimeout(() => { feedback.textContent = ''; }, 2000);
      }).catch(() => {
        feedback.textContent = '复制失败，请手动复制';
        clearTimeout(fbTimer);
        fbTimer = setTimeout(() => { feedback.textContent = ''; }, 2500);
      });
    });
    fileInput.addEventListener('change', () => { if (fileInput.files[0]) loadFile(fileInput.files[0]); });

    ['dragenter', 'dragover'].forEach((ev) => drop.addEventListener(ev, (e) => {
      e.preventDefault(); drop.classList.add('dragging');
    }));
    ['dragleave', 'drop'].forEach((ev) => drop.addEventListener(ev, (e) => {
      e.preventDefault(); drop.classList.remove('dragging');
    }));
    drop.addEventListener('drop', (e) => {
      const f = e.dataTransfer.files && e.dataTransfer.files[0];
      if (f) loadFile(f);
    });

    const tabBar = $('tab-bar');
    TABS.forEach((tab) => {
      const btn = U.el('button', 'tab-btn');
      btn.dataset.tab = tab.id;
      btn.appendChild(U.el('span', 'tab-cn', tab.label));
      btn.appendChild(U.el('span', 'tab-en', tab.en));
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

    const shardCount = Math.min(8, Math.max(1, (navigator.hardwareConcurrency || 1)));

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
      const worker = new Worker('js/logWorker.js');
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
      reader.readAsText(file);
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

      const mergeWorker = new Worker('js/logMergeWorker.js');
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
        const worker = new Worker('js/logShardWorker.js');
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
