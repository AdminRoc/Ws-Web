/* 入口：文件上传、解析调度、Tab 路由
 * 大文件（≥ LARGE_THRESHOLD）走 scanAsync 分块扫描，UI 保持响应并显示进度 */
(function () {
  const U = WF.utils;

  const TABS = [
    { id: 'profile',     label: '个人信息', en: 'PROFILE',       special: true },
    { id: 'eidolon',     label: '夜灵',    en: 'EIDOLON',       view: () => WF.eidolonView,     empty: '未找到满足 6×3 条件的夜灵捕获记录' },
    { id: 'disruption',  label: '中断',    en: 'DISRUPTION',    view: () => WF.disruptionView,  empty: '未找到完成 ≥45 轮且成功结算的中断任务（需房主日志）' },
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
    const sizeMB = (file.size / 1048576).toFixed(1);
    statusEl.innerHTML = `解析中… <b>${U.escapeHtml(file.name)}</b>（${sizeMB} MB）`;

    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result;
      const t0 = performance.now();

      const eidolon     = WF.EidolonParser.create();
      const disruption  = WF.DisruptionParser.create();
      const profitTaker = WF.ProfitTakerParser.create();
      const arbitration = WF.ArbitrationParser.create();
      const general     = WF.GeneralParser.create();
      const parsers = [eidolon, disruption, profitTaker, arbitration, general];

      function onDone(scan) {
        try {
          const clock = WF.logReader.makeClock(scan, file.lastModified);
          state.results = {
            general:     general.results(),
            eidolon:     eidolon.results(),
            disruption:  disruption.results(),
            profitTaker: profitTaker.results(),
            arbitration: arbitration.results(),
          };
          state.clock = clock;

          // 每次新上传都重置个人资料状态，避免旧数据/旧 loading 状态阻塞新流程
          state.profileState = { accountId: null, playerName: null, profileJson: null };

          // 从 EE.log 提取账号 ID（格式："Logged in DisplayName (accountId)"）
          const loginM = text.match(/Logged in ([^(]+)\(([a-f0-9]{16,})\)/i);
          if (loginM) {
            state.profileState.accountId  = loginM[2].trim();
            // 白名单：只保留名字合法字符，彻底移除 Warframe 日志中任何未知后缀
            state.profileState.playerName = loginM[1]
              .replace(/[^\w\-. #|À-ɏ一-鿿぀-ヿ가-힯]/g, '').trim();
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

      try {
        if (file.size >= WF.logReader.LARGE_THRESHOLD) {
          // 大文件：异步分块，UI 保持响应
          WF.logReader.scanAsync(
            text, parsers,
            (pct) => { statusEl.innerHTML = `解析中… <b>${U.escapeHtml(file.name)}</b>（${sizeMB} MB）&nbsp;&nbsp;${pct}%`; },
            onDone
          );
        } else {
          // 小文件：同步扫描
          const scan = WF.logReader.scan(text, parsers);
          onDone(scan);
        }
      } catch (err) {
        statusEl.textContent = `解析失败：${err.message}`;
        console.error(err);
      }
    };
    reader.onerror = () => { $('dropzone-status').textContent = '文件读取失败'; };
    reader.readAsText(file);
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
    /* 不做任何网络请求，直接显示剪贴板引导面板 */
    if (state.activeTab === 'profile') WF.profileView.render($('detail'), state.profileState);
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
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
