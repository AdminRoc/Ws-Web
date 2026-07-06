/* 个人信息视图 v6 — 5 标签，对齐 browse.wf 布局
 * tab: 统计信息 / 外观 / 任务统计 / 成就统计 / 集团声望
 * URL: ?tab=profile&subtab=stats|fashion|missions|achievements|syndicates */
window.WF = window.WF || {};

WF.profileView = (function () {
  /* ── 模块级状态 ── */
  var _shareData = null;
  var _activeTab = 'stats';
  try {
    var _pt = new URLSearchParams(window.location.search).get('subtab');
    if (['stats','fashion','missions','achievements','syndicates'].indexOf(_pt) !== -1) _activeTab = _pt;
  } catch(e) {}

  /* 白名单：只保留 Warframe 名字/氏族名中合法的字符，彻底移除任何未知后缀字符 */
  var _NAME_KEEP = /[^\w\-. #|À-ɏ一-鿿぀-ヿ가-힯]/g;
  function _cleanStr(s) {
    if (!s) return s;
    return s.replace(_NAME_KEEP, '').trim();
  }

  /* ── 集团名称中文映射 ── */
  var SYN_CN = {
    'ArbitersSyndicate':'均衡仲裁者', 'CephalonSudaSyndicate':'中枢苏达',
    'PerrinSequenceSyndicate':'佩兰数列', 'PerrinSyndicate':'佩兰数列',
    'NewLokaSyndicate':'新世间',
    'RedVeilSyndicate':'血色面纱',    'SteelMeridianSyndicate':'钢铁防线',
    'CetusSyndicate':'希图斯 (Ostron)', 'QuillsSyndicate':'羽族',
    'SolarisSyndicate':'索拉里斯联盟', 'VoxSolarisSyndicate':'索拉里斯之声',
    'VoxSyndicate':'索拉里斯之声',    'VentKidsSyndicate':'通风小子',
    'EntratiSyndicate':'以太神殿',    'EntratiLabSyndicate':'以太实验室',
    'NecraloidSyndicate':'灵骸',
    'ZarimanSyndicate':'坚守者',      'HexSyndicate':'英择谛',
    'KahlSyndicate':'卡尔的阵营',     'CaviaSyndicate':'Cavia',
    'LibrarySyndicate':'中枢图书馆',  'ConclaveSyndicate':'肃杀竞技',
    'EventSyndicate':'活动',          'NightcapJournalSyndicate':'夜帽日志',
    /* 兼容旧格式 */
    'CephalonSuda':'中枢苏达',        'PerrinSequence':'佩兰数列',
    'NewLoka':'新世间',               'SteelMeridian':'钢铁防线',
    'Ostron':'Ostron',                'Quills':'羽族',
    'SolarisUnited':'索拉里斯联盟',   'VoxSolaris':'通风小子',
    'VoxSolaris2':'索拉里斯之声',     'EntatiSyndicate':'以太神殿',
    'Murmur':'殃世缄灵',
    'RadioLegion':'夜羽',             'NightWave':'夜羽',
    'NightWaveSeries':'夜羽',
  };

  /* ── 集团等级名称 ── */
  var RANK_TITLES = {
    '-2':'敌对', '-1':'不信任', '0':'中立',
    '1':'勇气', '2':'坚韧', '3':'信赖', '4':'挚友', '5':'崇高'
  };

  /* ── 颜色转换 ── */
  function _colorHex(signedInt) {
    var n = signedInt >>> 0;
    var r = (n >> 16) & 0xFF, g = (n >> 8) & 0xFF, b = n & 0xFF;
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
  }

  /* ════════════════════════════════════════
     公开入口
  ════════════════════════════════════════ */
  function render(detailEl, state) {
    detailEl.innerHTML = '';
    if (!state.accountId) {
      // 账号 ID 只在客户端完整冷启动的登录握手行才带括号；日志若从中途片段开始
      // （常见于长任务、日志轮转裁切），可能只提取到玩家名而没有账号 ID——
      // 不再是死胡同提示，改为让用户手动补充账号 ID 后继续同一套流程。
      _renderAccountIdFallback(detailEl, state);
      return;
    }
    if (state.profileJson) {
      _renderProfile(detailEl, state.profileJson, state.playerName, state.accountId, state);
      return;
    }
    // 无 profileJson → 显示剪贴板引导（默认流程，无需代理）
    _renderManualFallback(detailEl, state);
  }

  /* ════════════════════════════════════════
     账号 ID 缺失时的手动补充面板
  ════════════════════════════════════════ */
  function _renderAccountIdFallback(el, state) {
    var box = _el('div', 'pf-manual-box');
    if (state.playerName) {
      var idLine = _el('div', 'pf-guide-id-line');
      idLine.appendChild(_el('span', 'pf-guide-player-name', state.playerName));
      idLine.appendChild(_el('span', 'pf-guide-account-id', '账号 ID 未识别'));
      box.appendChild(idLine);
    }
    box.appendChild(_el('div', 'pf-manual-title', '未能从本段日志自动识别账号 ID'));
    box.appendChild(_el('div', 'pf-manual-desc',
      '账号 ID 只出现在客户端完整启动时的登录记录中；若本次 EE.log 是从任务中途开始记录（常见于长时间任务或日志轮转），会只留下玩家名而没有账号 ID。' +
      (state.playerName ? '已识别玩家名「' + state.playerName + '」，' : '') +
      '可在下方手动填入账号 ID 继续查看个人资料（可从 Warframe 官网个人主页地址中获取，通常是一段 24 位十六进制字符串）。'));
    var row = _el('div', 'pf-manual-idrow');
    var input = document.createElement('input');
    input.type = 'text'; input.className = 'pf-manual-idinput';
    input.placeholder = '例如：5c8a1f2e9b0d3a4f5e6c7b8a';
    input.maxLength = 40;
    var err = _el('div', 'pf-guide-err', '');
    var okBtn = _el('button', 'pf-guide-btn pf-guide-btn-primary', '确认');
    okBtn.onclick = function () {
      var v = input.value.trim().toLowerCase();
      if (!/^[a-f0-9]{16,32}$/.test(v)) {
        err.textContent = '格式不对：应为 16-32 位十六进制字符（0-9、a-f）。';
        return;
      }
      state.accountId = v;
      render(el, state);
    };
    row.appendChild(input); row.appendChild(okBtn);
    box.appendChild(row);
    box.appendChild(err);
    el.appendChild(box);
  }

  /* ════════════════════════════════════════
     剪贴板引导面板（默认流程）
  ════════════════════════════════════════ */
  function _renderManualFallback(el, state) {
    var apiUrl = 'https://api.warframe.com/cdn/getProfileViewingData.php?playerId=' + state.accountId;
    var box = _el('div', 'pf-manual-box');
    // 玩家名 + ID
    if (state.playerName || state.accountId) {
      var idLine = _el('div', 'pf-guide-id-line');
      if (state.playerName) idLine.appendChild(_el('span', 'pf-guide-player-name', state.playerName));
      idLine.appendChild(_el('span', 'pf-guide-account-id', state.accountId));
      box.appendChild(idLine);
    }
    box.appendChild(_el('div', 'pf-manual-title', '获取 Warframe 个人资料'));
    box.appendChild(_el('div', 'pf-manual-desc', '请按以下步骤操作，约需 10 秒：'));
    var stepList = _el('div', 'pf-manual-steps');
    [
      { n:'1', text:'点击下方按钮，在新标签页打开您的个人资料数据页面。' },
      { n:'2', text:'在新标签页按 Ctrl+A 全选，再按 Ctrl+C 复制全部内容。' },
      { n:'3', text:'返回此页面，点击"粘贴并读取"按钮。' },
    ].forEach(function (s) {
      var row = _el('div', 'pf-manual-step');
      row.appendChild(_el('span', 'pf-manual-stepnum', s.n));
      row.appendChild(_el('span', 'pf-manual-steptxt', s.text));
      stepList.appendChild(row);
    });
    box.appendChild(stepList);
    var openBtn = _el('button', 'pf-guide-btn', '▶ 打开数据页面（新标签页）');
    openBtn.onclick = function () {
      window.open(apiUrl, '_blank', 'noopener');
      openBtn.textContent = '✓ 已打开，请复制后回来点击下方按钮';
      openBtn.disabled = true;
    };
    box.appendChild(openBtn);
    var pasteErr = _el('div', 'pf-guide-err', '');
    var pasteBtn = _el('button', 'pf-guide-btn pf-guide-btn-primary', '📋 粘贴并读取');
    pasteBtn.onclick = function () {
      pasteBtn.disabled = true; pasteBtn.textContent = '读取中…';
      navigator.clipboard.readText().then(function (text) {
        try {
          var json = JSON.parse(text);
          state.needsManual = false; state.profileJson = json;
          el.innerHTML = ''; _renderProfile(el, json, state.playerName, state.accountId, state);
        } catch (e) {
          pasteErr.textContent = '解析失败：请确保复制了完整页面内容再试。';
          pasteBtn.disabled = false; pasteBtn.textContent = '📋 粘贴并读取';
        }
      }).catch(function () {
        pasteErr.textContent = '无法访问剪贴板，请允许权限后重试，或改用文件上传。';
        pasteBtn.disabled = false; pasteBtn.textContent = '📋 粘贴并读取';
      });
    };
    box.appendChild(pasteBtn); box.appendChild(pasteErr);
    box.appendChild(_el('div', 'pf-guide-or', '— 或直接上传已保存的 JSON 文件 —'));
    var fileLabel = _el('label', 'pf-guide-btn', '📁 上传 JSON 文件');
    var fileInput = document.createElement('input');
    fileInput.type = 'file'; fileInput.accept = '.json,application/json'; fileInput.hidden = true;
    fileInput.onchange = function () {
      var f = fileInput.files[0]; if (!f) return;
      var r = new FileReader();
      r.onload = function () {
        try {
          var json = JSON.parse(r.result);
          state.needsManual = false; state.profileJson = json;
          el.innerHTML = ''; _renderProfile(el, json, state.playerName, state.accountId, state);
        } catch (e) { pasteErr.textContent = '文件解析失败：不是有效 JSON。'; }
      };
      r.readAsText(f);
    };
    fileLabel.insertBefore(fileInput, fileLabel.firstChild);
    box.appendChild(fileLabel);
    el.appendChild(box);
  }

  /* ════════════════════════════════════════
     主渲染
  ════════════════════════════════════════ */
  function _renderProfile(el, json, logName, accountId, state) {
    var d = (json.Results && json.Results.length) ? json.Results[0] : json;

    var name         = _cleanStr(d.DisplayName || logName) || '未知玩家';
    var mr           = d.PlayerLevel != null ? d.PlayerLevel : _calcMR(d.XPInfo || (d.LoadOutInventory && d.LoadOutInventory.XPInfo));
    var clan         = d.GuildName   || null;
    var tier         = d.GuildTier   || null;
    var accolades    = _arr(d.Accolades);
    var inv          = d.LoadOutInventory || {};
    var xp           = _arr(d.XPInfo || inv.XPInfo);
    var skills       = d.PlayerSkills    || {};
    var challenges   = _arr(d.ChallengeProgress);
    var missions     = _arr(d.Missions);
    var syndicates   = _arr(d.Affiliations);
    var achievements = _arr(d.ChallengeProgress);
    var created      = null;
    try { created = new Date(parseInt(d.Created.$date.$numberLong)); } catch(e) {}

    _shareData = { name:name, mr:mr, clan:clan, tier:tier,
      xp:xp, inv:inv, skills:skills, challenges:challenges, missions:missions, created:created,
      syndicates:syndicates,
      fashionSlots:[
        { label:'战甲',   items:_arr(inv.Suits) },
        { label:'主武器', items:_arr(inv.LongGuns) },
        { label:'副武器', items:_arr(inv.Pistols) },
        { label:'近战',   items:_arr(inv.Melee) },
      ]
    };

    /* ── 头部 ── */
    var header = _el('div', 'pf-header');
    var nameWrap = _el('div', 'pf-name-wrap');
    nameWrap.appendChild(_el('div', 'pf-name', name));
    nameWrap.appendChild(_el('div', 'pf-mr-badge', 'MR ' + mr));
    header.appendChild(nameWrap);
    var metaRow = _el('div', 'pf-meta-row');
    if (clan) {
      var clanEl = _el('div', 'pf-meta-item');
      clanEl.innerHTML = '<span class="pf-meta-icon">⚑</span>氏族：' + _esc(clan) +
        (tier ? ' <span class="pf-tier">T'+tier+'</span>' : '');
      metaRow.appendChild(clanEl);
    }
    if (created) {
      var dateEl = _el('div', 'pf-meta-item');
      var dateStr = created.getFullYear() + '/' + (created.getMonth()+1) + '/' + created.getDate();
      dateEl.innerHTML = '<span class="pf-meta-icon">⏱</span>注册时间: ' + _esc(dateStr);
      metaRow.appendChild(dateEl);
    }
    if (accolades.length) {
      var accEl = _el('div', 'pf-meta-item');
      accEl.innerHTML = '<span class="pf-meta-icon">★</span>' +
        _esc(accolades.map(function(a){ return a.Tag||String(a); }).join('，'));
      metaRow.appendChild(accEl);
    }
    var idEl = _el('div', 'pf-meta-item pf-id-item');
    idEl.innerHTML = '<span class="pf-meta-icon">ID</span><span class="pf-id-val">'+_esc(accountId)+'</span>';
    metaRow.appendChild(idEl);
    header.appendChild(metaRow);
    var btnRow = _el('div', 'pf-btn-row');
    var reloadBtn = _el('button', 'pf-reload-btn', '↺ 刷新资料');
    reloadBtn.onclick = function () {
      if (state) { state.profileJson=null; state.error=null; render(el, state); }
    };
    btnRow.appendChild(reloadBtn);
    var shareBtn = _el('button', 'pf-share-btn');
    shareBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 14 14" fill="none">' +
      '<circle cx="11" cy="2.5" r="1.8" stroke="currentColor" stroke-width="1.3"/>' +
      '<circle cx="11" cy="11.5" r="1.8" stroke="currentColor" stroke-width="1.3"/>' +
      '<circle cx="3" cy="7" r="1.8" stroke="currentColor" stroke-width="1.3"/>' +
      '<line x1="9.4" y1="3.2" x2="4.5" y2="6.4" stroke="currentColor" stroke-width="1.3"/>' +
      '<line x1="4.5" y1="7.6" x2="9.4" y2="10.8" stroke="currentColor" stroke-width="1.3"/></svg> 生成分享图片';
    shareBtn.onclick = function () { _generateShareCard(shareBtn); };
    btnRow.appendChild(shareBtn);
    header.appendChild(btnRow);
    el.appendChild(header);

    /* ── 内联 Tab 导航（固定 5 个）── */
    if (['stats','fashion','missions','achievements','syndicates'].indexOf(_activeTab) === -1)
      _activeTab = 'stats';

    var TABS_DEF = [
      { id:'stats',        label:'统计信息' },
      { id:'fashion',      label:'外观' },
      { id:'missions',     label:'任务统计' },
      { id:'achievements', label:'成就统计' },
      { id:'syndicates',   label:'集团声望' },
    ];
    var panels = {};
    var tabBar = _el('div', 'pf-inner-tab-bar');

    function switchPfTab(id) {
      _activeTab = id;
      tabBar.querySelectorAll('.pf-inner-tab-btn').forEach(function(b){
        b.classList.toggle('active', b.dataset.tab === id);
      });
      Object.keys(panels).forEach(function(k){
        panels[k].style.display = k === id ? '' : 'none';
      });
    }
    TABS_DEF.forEach(function(tab){
      var btn = _el('button', 'pf-inner-tab-btn', tab.label);
      btn.dataset.tab = tab.id;
      if (_activeTab === tab.id) btn.classList.add('active');
      btn.onclick = function(){ switchPfTab(tab.id); };
      tabBar.appendChild(btn);
    });
    el.appendChild(tabBar);

    /* ════════════════
       PANEL: 统计信息
    ════════════════ */
    var statsPanel = panels.stats = _el('div', 'pf-panel');
    statsPanel.style.display = _activeTab === 'stats' ? '' : 'none';

    /* 综合战绩 — 从 Missions / XPInfo 计算 */
    var totalCompletes = missions.reduce(function(s,m){ return s + (m.Completes||0); }, 0);
    var totalXPAll = xp.reduce(function(s,x){ return s + (x.XP||0); }, 0);
    var spNodes = missions.filter(function(m){ return m.Tier >= 1; }).length;

    statsPanel.appendChild(_sectionTitle('综合战绩'));
    var sg = _el('div', 'pf-stat-grid');
    sg.appendChild(_statCard('任务完成总数', _fmtNum(totalCompletes), 'big'));
    sg.appendChild(_statCard('已访问节点', _fmtNum(missions.length)));
    sg.appendChild(_statCard('钢铁之路节点', _fmtNum(spNodes)));
    sg.appendChild(_statCard('掌握道具数', _fmtNum(xp.length)));
    sg.appendChild(_statCard('总掌握度 XP', _fmtNum(totalXPAll)));
    if (created) {
      var dateStr2 = created.getFullYear() + '/' + (created.getMonth()+1) + '/' + created.getDate();
      sg.appendChild(_statCard('注册时间', dateStr2));
    }
    statsPanel.appendChild(sg);
    statsPanel.appendChild(_el('div', 'pf-empty-hint', '部分统计信息可能不准确或不可用（部分数据需要游戏内的接口，且官方 API 返回的信息可能会异常）'));

    /* 内秉技能 */
    var railjackKeys=[['LPS_TACTICAL','战术'],['LPS_PILOTING','驾驶'],['LPS_GUNNERY','炮击'],['LPS_ENGINEERING','工程'],['LPS_COMMAND','指挥']];
    var drifterKeys=[['LPS_DRIFT_RIDING','骑乘'],['LPS_DRIFT_COMBAT','战斗'],['LPS_DRIFT_OPPORTUNITY','机遇'],['LPS_DRIFT_ENDURANCE','耐力']];
    if (railjackKeys.some(function(k){ return skills[k[0]]>0; })) {
      statsPanel.appendChild(_sectionTitle('九重天·内源之力（满级 10）'));
      statsPanel.appendChild(_skillGrid(railjackKeys, skills, 10));
    }
    if (drifterKeys.some(function(k){ return skills[k[0]]>0; })) {
      statsPanel.appendChild(_sectionTitle('双衍王境·内源之力（满级 5）'));
      statsPanel.appendChild(_skillGrid(drifterKeys, skills, 5));
    }

    /* 掌握度 XP 列表 */
    if (xp.length) {
      var totalXP = xp.reduce(function(s,x){ return s+(x.XP||0); }, 0);
      var sortedXP = xp.slice().sort(function(a,b){ return (b.XP||0)-(a.XP||0); });
      var maxXP = sortedXP[0] ? (sortedXP[0].XP||1) : 1;
      statsPanel.appendChild(_sectionTitle('经验统计（共 '+_fmtNum(totalXP)+' 点，'+xp.length+' 件道具）'));
      var xpScroll=_el('div','pf-xp-scroll');
      sortedXP.forEach(function(item){
        var n=_itemName(item.ItemType||''); if (!n) return;
        var row=_el('div','pf-xp-row');
        row.appendChild(_el('span','pf-xp-name',n));
        var bw=_el('div','pf-xp-bar-wrap'); var b=_el('div','pf-xp-bar');
        b.style.width=Math.round((item.XP||0)/maxXP*100)+'%'; bw.appendChild(b); row.appendChild(bw);
        row.appendChild(_el('span','pf-xp-val',_fmtNum(item.XP||0)));
        xpScroll.appendChild(row);
      });
      statsPanel.appendChild(xpScroll);
    }

    if (!xp.length && !missions.length)
      statsPanel.appendChild(_el('div','pf-empty-hint','暂无统计数据'));
    el.appendChild(statsPanel);

    /* ════════════════
       PANEL: 外观（browse.wf 风格）
    ════════════════ */
    var fashionPanel = panels.fashion = _el('div', 'pf-panel');
    fashionPanel.style.display = _activeTab === 'fashion' ? '' : 'none';

    /* pricol 键名 → 中文颜色槽名称（Warframe 中文客户端 UI 用语） */
    var COLOR_SLOT_NAMES = {
      t0: '主色', t1: '辅色', t2: '第三色', t3: '点缀色',
      en: '自发光 1', e1: '自发光 2', en2: '能量色 1', e2: '能量色 2',
    };
    /* 颜色槽显示顺序 */
    var COLOR_SLOT_ORDER = ['t0','t1','t2','t3','en','e1','en2','e2'];

    var fashionSlots = [
      { label:'战甲',   items: _arr(inv.Suits)    },
      { label:'主武器', items: _arr(inv.LongGuns)  },
      { label:'副武器', items: _arr(inv.Pistols)   },
      { label:'近战',   items: _arr(inv.Melee)     },
    ];
    var companions = _arr(inv.Sentinels || inv.Pets || inv.SpaceSuits);
    if (companions.length) fashionSlots.push({ label:'伙伴 / 弧翼', items: companions });

    /* 色板查询提示 */
    var paletteTip = _el('div', 'pf-palette-tip');
    var tipIcon = _el('span', 'pf-palette-tip-icon', '🎨');
    var tipBody = _el('span', 'pf-palette-tip-body');
    tipBody.innerHTML = '看到心仪的颜色代码？将 HEX 值粘贴至 ' +
      '<a class="pf-palette-tip-link" href="https://polychrome.seldszar.fr" target="_blank" rel="noopener">polychrome.seldszar.fr</a>' +
      '，即可反查出对应的游戏内色板名称与编号。';
    paletteTip.appendChild(tipIcon);
    paletteTip.appendChild(tipBody);
    fashionPanel.appendChild(paletteTip);

    var hasAny = fashionSlots.some(function(s){ return s.items.length>0; });
    if (hasAny) {
      fashionPanel.appendChild(_sectionTitle('当前装备'));
      fashionSlots.forEach(function(slot){
        if (!slot.items.length) return;
        var item = slot.items[0];
        var n = _itemName(item.ItemType || ''); if (!n) return;
        var card = _el('div', 'pf-fashion-card');
        card.appendChild(_el('div', 'pf-fashion-label', slot.label));
        card.appendChild(_el('div', 'pf-fashion-name', n));

        var cfg = (item.Configs && item.Configs[0]) ? item.Configs[0] : null;

        /* 皮肤列表 */
        if (cfg && cfg.Skins) {
          var skinNames = [];
          for (var si = 0; si < cfg.Skins.length; si++) {
            if (cfg.Skins[si]) skinNames.push(_itemName(cfg.Skins[si]));
          }
          if (skinNames.length) {
            card.appendChild(_el('div', 'pf-fashion-detail', '皮肤: ' + skinNames.join(', ')));
          }
        }

        /* 颜色 — 按键名有序输出，显示中文槽名 */
        var colorSrc = cfg ? (cfg.pricol || cfg.Colors) : null;
        if (colorSrc) {
          var colorSection = _el('div', 'pf-fashion-color-section');
          colorSection.appendChild(_el('div', 'pf-fashion-color-title', '配色'));
          var colorList = _el('div', 'pf-fashion-color-list');
          var hasColor = false;
          for (var ci = 0; ci < COLOR_SLOT_ORDER.length; ci++) {
            var slotKey = COLOR_SLOT_ORDER[ci];
            var val = colorSrc[slotKey];
            if (typeof val !== 'number') continue;
            var hex = _colorHex(val);
            var row = _el('div', 'pf-fashion-color-item');
            var dot = _el('span', 'pf-fashion-color-dot');
            dot.style.backgroundColor = hex;
            row.appendChild(dot);
            row.appendChild(_el('span', 'pf-fashion-color-label', COLOR_SLOT_NAMES[slotKey]));
            row.appendChild(_el('span', 'pf-fashion-color-hex', hex));
            colorList.appendChild(row);
            hasColor = true;
          }
          if (hasColor) { colorSection.appendChild(colorList); card.appendChild(colorSection); }
        }

        /* 附件 — Configs[0].Upgrades 或 attachments */
        if (cfg && cfg.Upgrades && cfg.Upgrades.length) {
          var attSec = _el('div', 'pf-fashion-color-section');
          attSec.appendChild(_el('div', 'pf-fashion-color-title', 'ATTACHMENTS'));
          cfg.Upgrades.forEach(function(u) {
            if (u) attSec.appendChild(_el('div', 'pf-fashion-detail', _itemName(u)));
          });
          card.appendChild(attSec);
        }

        fashionPanel.appendChild(card);
      });
    }

    if (!hasAny)
      fashionPanel.appendChild(_el('div', 'pf-empty-hint', '暂无外观数据'));
    el.appendChild(fashionPanel);

    /* ════════════════
       PANEL: 任务统计
    ════════════════ */
    var mPanel = panels.missions = _el('div', 'pf-panel');
    mPanel.style.display = _activeTab === 'missions' ? '' : 'none';

    if (missions.length) {
      var sortedM = missions.slice().sort(function(a,b){
        return (b.Completes||0)-(a.Completes||0);
      });
      mPanel.appendChild(_sectionTitle('任务完成记录（'+missions.length+' 个节点）'));
      var solMap = (WF.SOL_NODES) || {};
      mPanel.appendChild(_dataTable(
        ['节点','完成次数','钢铁之路'],
        sortedM.map(function(m){
          var tag = m.Tag || '?';
          var loc = solMap[tag] || tag;
          return [loc, _fmtNum(m.Completes||0), m.Tier >= 1 ? '✓' : ''];
        })
      ));
    } else {
      mPanel.appendChild(_el('div','pf-empty-hint','该账号未公开任务完成记录'));
    }
    el.appendChild(mPanel);

    /* ════════════════
       PANEL: 成就统计
    ════════════════ */
    var achPanel = panels.achievements = _el('div', 'pf-panel');
    achPanel.style.display = _activeTab === 'achievements' ? '' : 'none';

    /* 成就翻译说明 */
    var achNote = _el('div', 'pf-ach-note');
    achNote.innerHTML = '<span class="pf-ach-note-icon">ℹ</span>' +
      '成就名称翻译来源：<a href="https://github.com/calamity-inc/warframe-public-export-plus" target="_blank" rel="noopener" class="pf-ach-note-link">warframe-public-export-plus</a> 官方导出数据。' +
      '部分早期挑战（如武器精通、每周任务）未被收录于公开导出，将以英文原名或驼峰拆分形式显示，内容准确，仅名称不完整。';
    achPanel.appendChild(achNote);

    if (achievements.length) {
      var doneCh = achievements.filter(function(c){ return c.Progress >= 1; });
      var pendCh = achievements.filter(function(c){ return !(c.Progress >= 1); });
      achPanel.appendChild(_sectionTitle('挑战进度（共 '+achievements.length+' 项，已完成 '+doneCh.length+'）'));
      var chGrid = _el('div', 'pf-stat-grid');
      chGrid.appendChild(_statCard('已记录', String(achievements.length), 'accent'));
      chGrid.appendChild(_statCard('已完成', String(doneCh.length)));
      chGrid.appendChild(_statCard('进行中', String(pendCh.length)));
      achPanel.appendChild(chGrid);
      if (doneCh.length) {
        achPanel.appendChild(_sectionTitle('已完成（'+doneCh.length+'）'));
        achPanel.appendChild(_challengeList(doneCh.slice(0,200), true));
        if (doneCh.length>200) achPanel.appendChild(_el('div','pf-xp-more','…还有 '+(doneCh.length-200)+' 条'));
      }
      if (pendCh.length) {
        achPanel.appendChild(_sectionTitle('进行中（'+pendCh.length+'）'));
        achPanel.appendChild(_challengeList(pendCh.slice(0,100), false));
      }
    } else {
      achPanel.appendChild(_el('div','pf-empty-hint','暂无成就数据'));
    }
    el.appendChild(achPanel);

    /* ════════════════
       PANEL: 集团声望
    ════════════════ */
    var synPanel = panels.syndicates = _el('div', 'pf-panel');
    synPanel.style.display = _activeTab === 'syndicates' ? '' : 'none';

    if (syndicates.length) {
      synPanel.appendChild(_sectionTitle('集团声望（'+syndicates.length+' 个）'));
      var synGrid = _el('div', 'pf-syn-grid');
      syndicates.forEach(function(syn){
        var tag   = syn.Tag || '';
        var cname = SYN_CN[tag]
          || (tag.indexOf('RadioLegion') === 0 ? '夜羽' : null)
          || tag.replace(/Syndicate$/,'').replace(/([A-Z])/g,' $1').trim()
          || '未知集团';
        var rank  = syn.Title != null ? syn.Title : syn.Rank;
        var stand = syn.Standing || 0;
        var card  = _el('div', 'pf-syn-card');
        card.appendChild(_el('div', 'pf-syn-name', cname));
        if (rank != null) {
          var rankName = RANK_TITLES[String(rank)] || '';
          card.appendChild(_el('div', 'pf-syn-rank', 'Rank ' + rank + (rankName ? ' (' + rankName + ')' : '')));
        }
        card.appendChild(_el('div', 'pf-syn-standing', _fmtNum(stand)));
        card.appendChild(_el('div', 'pf-syn-label', '当前声望'));
        synGrid.appendChild(card);
      });
      synPanel.appendChild(synGrid);
    } else {
      synPanel.appendChild(_el('div','pf-empty-hint','暂无集团声望数据'));
    }
    el.appendChild(synPanel);
  }

  /* ════════════════════════════════════════
     分享长图（全量五模块）
  ════════════════════════════════════════ */
  function _generateShareCard(btn) {
    if (!_shareData) return;
    btn.disabled = true; btn.textContent = '渲染中…';

    var d = _shareData;
    var W = 1080;
    var PL = 48, PR = 48;                   // 左右内边距
    var CW = W - PL - PR;                   // 内容区宽度
    var F = "'XSZT','Microsoft YaHei',monospace";
    var C = {
      bg:'#07091a', card:'#0e1328', line:'rgba(95,208,232,0.12)',
      teal:'#5fd0e8', gold:'#ffb648', white:'#dde4f4', text2:'#6b7690',
      done:'#3dd68c', pend:'#6b7690', accent:'#a86bff',
    };

    /* ── 测量用临时 canvas ── */
    var tmpCv = document.createElement('canvas');
    tmpCv.width = W; tmpCv.height = 1;
    var tx = tmpCv.getContext('2d');
    function mw(text, size, bold) {
      tx.font = (bold?'700':'400') + ' ' + size + 'px ' + F;
      return tx.measureText(text).width;
    }

    /* ── 彩虹渐变 ── */
    function rainbow(ctx, x1, x2, y0) {
      var g = ctx.createLinearGradient(x1, y0, x2, y0);
      ['#41ff8e','#3affd5','#45c8ff','#6f8bff','#a86bff','#e05fff','#ff5f9e','#ff7a5f']
        .forEach(function(c,i){ g.addColorStop(i/7,c); });
      return g;
    }

    /* ── 数据预处理 ── */
    var xpSorted  = (d.xp||[]).slice().sort(function(a,b){ return (b.XP||0)-(a.XP||0); });
    var xpMaxVal  = xpSorted.length ? (xpSorted[0].XP||1) : 1;
    var xpTotal   = xpSorted.reduce(function(s,x){ return s+(x.XP||0); }, 0);
    var mSorted   = (d.missions||[]).slice().sort(function(a,b){ return (b.Completes||0)-(a.Completes||0); });
    var mTotal    = mSorted.reduce(function(s,m){ return s+(m.Completes||0); }, 0);
    var spNodes   = mSorted.filter(function(m){ return m.Tier>=1; }).length;
    var chDone    = (d.challenges||[]).filter(function(c){ return c.Progress>=1; });
    var chPend    = (d.challenges||[]).filter(function(c){ return !(c.Progress>=1); });
    var solMap    = WF.SOL_NODES || {};
    var i18nS     = _i18nShortMap();
    var COLOR_SLOT_NAMES2 = { t0:'主色',t1:'辅色',t2:'第三色',t3:'点缀色',en:'自发光1',e1:'自发光2',en2:'能量色1',e2:'能量色2' };
    var COLOR_SLOT_ORDER2 = ['t0','t1','t2','t3','en','e1','en2','e2'];
    var rjKeys = [['LPS_TACTICAL','战术'],['LPS_PILOTING','驾驶'],['LPS_GUNNERY','炮击'],['LPS_ENGINEERING','工程'],['LPS_COMMAND','指挥']];
    var drKeys = [['LPS_DRIFT_RIDING','骑乘'],['LPS_DRIFT_COMBAT','战斗'],['LPS_DRIFT_OPPORTUNITY','机遇'],['LPS_DRIFT_ENDURANCE','耐力']];
    var hasRJ = rjKeys.some(function(k){ return (d.skills||{})[k[0]]>0; });
    var hasDR = drKeys.some(function(k){ return (d.skills||{})[k[0]]>0; });

    /* ── 高度预计算 ── */
    var ROW   = 28;   // 基础行高
    var SEC   = 52;   // 章节标题高度
    var GAP   = 24;   // 章节间距
    var CARD  = 80;   // 统计卡片高
    var H_HEAD= 190;
    var H_DIV = 1;

    function statsH() {
      var h = GAP + SEC;                         // 章节标题
      h += Math.ceil(6/4)*CARD + 16;             // 6张统计卡 (4列)
      if (hasRJ) h += 32 + rjKeys.length*30 + 12;
      if (hasDR) h += 32 + drKeys.length*30 + 12;
      return h;
    }
    function xpH() {
      var rows = Math.ceil(xpSorted.length/2);
      return GAP + SEC + rows*ROW + 8;
    }
    function fashionH() {
      var h = GAP + SEC;
      var slots = (d.fashionSlots||[]).filter(function(s){ return s.items.length>0; });
      slots.forEach(function(slot){
        var item = slot.items[0];
        var cfg  = item.Configs && item.Configs[0];
        var colorSrc = cfg ? (cfg.pricol||cfg.Colors) : null;
        var colorCnt = colorSrc ? Object.keys(colorSrc).filter(function(k){ return typeof colorSrc[k]==='number'; }).length : 0;
        h += 30 + 22 + (colorCnt*24) + 20 + 20; // label + name + colors + skin hint + gap
      });
      return h + 16;
    }
    function missionsH() {
      var rows = Math.ceil(mSorted.length/3);
      return GAP + SEC + 30 + rows*ROW + 8;
    }
    function achH() {
      var h = GAP + SEC;
      h += 30;  // 摘要行
      if (chDone.length) h += 32 + Math.ceil(chDone.length/2)*ROW;
      if (chPend.length) h += 32 + Math.ceil(chPend.length/2)*ROW;
      return h + 8;
    }
    function synH() {
      var rows = Math.ceil((d.syndicates||[]).length/3);
      return GAP + SEC + rows*90 + 16;
    }

    var TOTAL_H = H_HEAD + statsH() + xpH() + fashionH() + missionsH() + achH() + synH() + 60;

    /* ── 创建 canvas ── */
    var cv = document.createElement('canvas');
    cv.width  = W;
    cv.height = TOTAL_H;
    var ctx = cv.getContext('2d');

    /* 背景 */
    ctx.fillStyle = C.bg;
    ctx.fillRect(0, 0, W, TOTAL_H);

    /* 运行 y 指针 */
    var y = 0;

    /* ────────── 工具函数 ────────── */
    function setFont(size, bold) {
      ctx.font = (bold?'700':'400') + ' ' + size + 'px ' + F;
    }
    function text(t, x, yy, color, size, bold, align) {
      setFont(size||15, bold);
      ctx.fillStyle = color || C.white;
      ctx.textAlign = align || 'left';
      ctx.textBaseline = 'top';
      ctx.fillText(t, x, yy);
    }
    function divider(yy) {
      ctx.strokeStyle = C.line;
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(PL, yy); ctx.lineTo(W-PR, yy); ctx.stroke();
    }
    function sectionTitle(label, yy) {
      /* 标题左侧竖线 */
      ctx.fillStyle = C.teal;
      ctx.fillRect(PL, yy+4, 3, 20);
      text(label, PL+12, yy+4, C.teal, 17, true);
      divider(yy + SEC - 8);
    }
    function statCard(label, value, x, yy, w) {
      ctx.fillStyle = C.card;
      roundRect(ctx, x, yy, w, CARD-8, 6);
      text(value, x+14, yy+12, C.white, 20, true);
      text(label,  x+14, yy+42, C.text2, 12);
    }
    function roundRect(c, rx, ry, rw, rh, r) {
      c.beginPath();
      c.moveTo(rx+r, ry);
      c.lineTo(rx+rw-r, ry); c.arcTo(rx+rw, ry, rx+rw, ry+r, r);
      c.lineTo(rx+rw, ry+rh-r); c.arcTo(rx+rw, ry+rh, rx+rw-r, ry+rh, r);
      c.lineTo(rx+r, ry+rh); c.arcTo(rx, ry+rh, rx, ry+rh-r, r);
      c.lineTo(rx, ry+r); c.arcTo(rx, ry, rx+r, ry, r);
      c.closePath(); c.fill();
    }
    function skillBar(label, val, maxVal, x, yy, bw) {
      text(label, x, yy, C.text2, 13);
      var barX = x + 80, barW = bw - 80 - 40;
      ctx.fillStyle = 'rgba(95,208,232,0.1)';
      ctx.fillRect(barX, yy+3, barW, 12);
      ctx.fillStyle = C.teal;
      ctx.fillRect(barX, yy+3, barW*Math.min(1,val/maxVal), 12);
      text(String(val), barX+barW+8, yy, C.white, 13);
    }

    /* ═══════════════════════════════
       头部
    ═══════════════════════════════ */
    /* 头部背景 */
    var hg = ctx.createLinearGradient(0, 0, 0, H_HEAD);
    hg.addColorStop(0, '#0c1230'); hg.addColorStop(1, C.bg);
    ctx.fillStyle = hg;
    ctx.fillRect(0, 0, W, H_HEAD);

    /* 顶部细线 */
    var tg = ctx.createLinearGradient(0,0,W,0);
    ['#41ff8e','#3affd5','#45c8ff','#6f8bff','#a86bff','#e05fff','#ff5f9e','#ff7a5f']
      .forEach(function(c,i){ tg.addColorStop(i/7,c); });
    ctx.fillStyle = tg;
    ctx.fillRect(0, 0, W, 3);

    /* 水印 */
    text('WFSpeed.run · 个人资料档案', W/2, 18, 'rgba(95,208,232,0.45)', 11, false, 'center');

    /* 玩家名 (彩虹) */
    var nameSize = 38, nameY = 42;
    setFont(nameSize, true);
    ctx.textBaseline = 'top';
    var nameW = ctx.measureText(d.name).width;
    ctx.fillStyle = rainbow(ctx, (W-nameW)/2, (W+nameW)/2, nameY);
    ctx.textAlign = 'center';
    ctx.fillText(d.name, W/2, nameY);

    /* MR */
    var mrText = 'MR ' + d.mr;
    var mrX = (W+nameW)/2 + 16, mrY = nameY + 8;
    ctx.fillStyle = C.gold;
    setFont(13); ctx.textAlign = 'left'; ctx.textBaseline = 'top';
    ctx.strokeStyle = 'rgba(255,182,72,0.3)'; ctx.lineWidth = 1;
    var mrW = mw(mrText, 13)+16;
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(mrX-1, mrY, mrW, 22, 4) : ctx.rect(mrX-1, mrY, mrW, 22);
    ctx.stroke();
    text(mrText, mrX+7, mrY+4, C.gold, 13, true);

    /* 元信息行 */
    var metaY = nameY + nameSize + 18;
    var metaParts = [];
    if (d.clan) metaParts.push('⚑ ' + d.clan + (d.tier ? '  T'+d.tier : ''));
    if (d.created) {
      var ds = d.created;
      metaParts.push('⏱ 注册时间: ' + ds.getFullYear()+'/'+(ds.getMonth()+1)+'/'+ds.getDate());
    }
    if (metaParts.length) text(metaParts.join('    '), W/2, metaY, C.text2, 13, false, 'center');

    /* 快速摘要 */
    var eq = _categorize(d.xp, d.inv);
    var summaryParts = [];
    if (mTotal) summaryParts.push('任务完成 ' + _fmtNum(mTotal) + ' 次');
    summaryParts.push('已访问 ' + mSorted.length + ' 个节点');
    if (spNodes) summaryParts.push('钢铁之路 ' + spNodes + ' 个');
    summaryParts.push('道具 ' + _fmtNum(d.xp.length) + ' 件');
    text(summaryParts.join('  ·  '), W/2, metaY+26, '#8899bb', 12, false, 'center');

    y = H_HEAD;

    /* ═══════════════════════════════
       统计信息
    ═══════════════════════════════ */
    y += GAP;
    sectionTitle('统计信息', y);
    y += SEC;

    /* 统计卡片 4列 */
    var cards = [
      { label:'任务完成总数', value: _fmtNum(mTotal) },
      { label:'已访问节点',   value: _fmtNum(mSorted.length) },
      { label:'钢铁之路节点', value: _fmtNum(spNodes) },
      { label:'掌握道具数',   value: _fmtNum(d.xp.length) },
      { label:'总经验值',     value: _fmtNum(xpTotal) },
      { label:'精通等级',     value: 'MR ' + d.mr },
    ];
    var cols4 = 4, cardGap = 10;
    var cardW = (CW - cardGap*(cols4-1)) / cols4;
    cards.forEach(function(c, i) {
      var col = i % cols4, row = Math.floor(i / cols4);
      statCard(c.label, c.value, PL + col*(cardW+cardGap), y + row*(CARD-8+cardGap), cardW);
    });
    y += Math.ceil(cards.length/cols4) * (CARD-8+cardGap) + 8;

    /* 铁骨技能 */
    if (hasRJ) {
      text('九重天·内源之力', PL, y, C.teal, 13, true); y += 26;
      var skHalf = Math.floor(CW/2) - 20;
      rjKeys.forEach(function(pair, i) {
        var val = (d.skills||{})[pair[0]]||0;
        if (!val) return;
        var col = i%2, row = Math.floor(i/2);
        skillBar(pair[1], val, 10, PL + col*(skHalf+40), y + row*28, skHalf);
      });
      y += Math.ceil(rjKeys.length/2)*28 + 12;
    }
    if (hasDR) {
      text('双衍王境·内源之力', PL, y, C.teal, 13, true); y += 26;
      var skHalf2 = Math.floor(CW/2) - 20;
      drKeys.forEach(function(pair, i) {
        var val = (d.skills||{})[pair[0]]||0;
        if (!val) return;
        var col = i%2, row = Math.floor(i/2);
        skillBar(pair[1], val, 5, PL + col*(skHalf2+40), y + row*28, skHalf2);
      });
      y += Math.ceil(drKeys.length/2)*28 + 12;
    }

    /* ═══════════════════════════════
       经验统计
    ═══════════════════════════════ */
    y += GAP;
    sectionTitle('经验统计  （共 ' + _fmtNum(xpTotal) + ' 点，' + xpSorted.length + ' 件道具）', y);
    y += SEC;

    var xpColW = Math.floor(CW/2) - 8;
    var xpBarMax = xpColW - 200 - 60; // name area + value area
    xpSorted.forEach(function(item, i) {
      var n = _itemName(item.ItemType||''); if (!n) return;
      var col = i%2, row = Math.floor(i/2);
      var cx = PL + col*(xpColW+16);
      var cy = y + row*ROW;
      /* 名称 */
      ctx.fillStyle = C.white; setFont(13); ctx.textAlign='left'; ctx.textBaseline='top';
      var nTrunc = n.length>22 ? n.slice(0,21)+'…' : n;
      ctx.fillText(nTrunc, cx, cy+6);
      /* 进度条 */
      var barX = cx + 190, barW = xpBarMax;
      ctx.fillStyle = 'rgba(255,255,255,0.06)'; ctx.fillRect(barX, cy+10, barW, 8);
      ctx.fillStyle = C.teal; ctx.globalAlpha = 0.7;
      ctx.fillRect(barX, cy+10, barW*((item.XP||0)/xpMaxVal), 8);
      ctx.globalAlpha = 1;
      /* 数值 */
      text(_fmtNum(item.XP||0), cx+xpColW-2, cy+6, C.text2, 11, false, 'right');
    });
    y += Math.ceil(xpSorted.length/2)*ROW + 8;

    /* ═══════════════════════════════
       外观
    ═══════════════════════════════ */
    y += GAP;
    sectionTitle('外观', y);
    y += SEC;

    var fashSlots = (d.fashionSlots||[]).filter(function(s){ return s.items.length>0; });
    fashSlots.forEach(function(slot) {
      var item = slot.items[0];
      var n = _itemName(item.ItemType||''); if (!n) return;
      var cfg = item.Configs && item.Configs[0];
      var colorSrc = cfg ? (cfg.pricol||cfg.Colors) : null;

      /* 槽标签 */
      text(slot.label, PL, y+2, C.text2, 12);
      /* 道具名 */
      text(n, PL+60, y, C.white, 16, true);
      y += 26;

      /* 皮肤 */
      if (cfg && cfg.Skins && cfg.Skins.length) {
        var skinNames = [];
        cfg.Skins.forEach(function(s){ if(s) skinNames.push(_itemName(s)); });
        if (skinNames.length) {
          text('皮肤: ' + skinNames.slice(0,4).join('，') + (skinNames.length>4?'…':''), PL+60, y, C.text2, 11);
          y += 18;
        }
      }

      /* 颜色行 */
      if (colorSrc) {
        var colorCols = 4, ci2 = 0;
        var swatchW = Math.floor(CW/4);
        COLOR_SLOT_ORDER2.forEach(function(k) {
          var val = colorSrc[k];
          if (typeof val !== 'number') return;
          var hex = _colorHex(val);
          var col = ci2%colorCols, row = Math.floor(ci2/colorCols);
          var cx2 = PL + col*swatchW;
          var cy2 = y + row*24;
          /* 色块 */
          ctx.fillStyle = hex;
          ctx.beginPath(); ctx.roundRect ? ctx.roundRect(cx2, cy2+2, 16, 16, 3) : ctx.rect(cx2, cy2+2, 16, 16);
          ctx.fill();
          ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.lineWidth=0.8;
          ctx.stroke();
          text((COLOR_SLOT_NAMES2[k]||k) + '  ' + hex, cx2+22, cy2+3, C.text2, 11);
          ci2++;
        });
        y += Math.ceil(ci2/colorCols)*24 + 8;
      }
      y += 12;
    });

    /* ═══════════════════════════════
       任务统计
    ═══════════════════════════════ */
    y += GAP;
    sectionTitle('任务统计  （' + mSorted.length + ' 个节点，共完成 ' + _fmtNum(mTotal) + ' 次）', y);
    y += SEC;

    /* 3列任务表 */
    var mCols = 3, mColW = Math.floor(CW/mCols) - 8;
    /* 表头 */
    for (var mi = 0; mi < mCols; mi++) {
      var mhx = PL + mi*(mColW+12);
      ctx.fillStyle = 'rgba(95,208,232,0.07)';
      ctx.fillRect(mhx, y, mColW, 22);
      text('节点', mhx+8, y+4, C.text2, 11);
      text('次数', mhx+mColW-40, y+4, C.text2, 11, false, 'right');
      text('钢铁', mhx+mColW-4, y+4, C.text2, 11, false, 'right');
    }
    y += 24;
    mSorted.forEach(function(m, i) {
      var col = i%mCols, row = Math.floor(i/mCols);
      var cx3 = PL + col*(mColW+12);
      var cy3 = y + row*ROW;
      if (row%2===0) { ctx.fillStyle='rgba(255,255,255,0.02)'; ctx.fillRect(cx3, cy3, mColW, ROW-2); }
      var loc = solMap[m.Tag||''] || m.Tag || '?';
      if (loc.length>20) loc = loc.slice(0,19)+'…';
      text(loc, cx3+8, cy3+5, C.white, 11);
      text(_fmtNum(m.Completes||0), cx3+mColW-40, cy3+5, C.text2, 11, false, 'right');
      if (m.Tier>=1) text('✓', cx3+mColW-4, cy3+5, C.teal, 11, false, 'right');
    });
    y += Math.ceil(mSorted.length/mCols)*ROW + 8;

    /* ═══════════════════════════════
       成就统计
    ═══════════════════════════════ */
    y += GAP;
    sectionTitle('成就统计  （共 ' + (d.challenges||[]).length + ' 项，已完成 ' + chDone.length + '）', y);
    y += SEC;

    function drawChallenges(arr, done) {
      if (!arr.length) return;
      text(done?'已完成（'+arr.length+'）':'进行中（'+arr.length+'）', PL, y, done?C.done:C.text2, 13, true);
      y += 26;
      var cCols = 2, cColW = Math.floor(CW/cCols) - 8;
      arr.forEach(function(c, i) {
        var col = i%cCols, row = Math.floor(i/cCols);
        var cx4 = PL + col*(cColW+16);
        var cy4 = y + row*ROW;
        text(done?'✓':'○', cx4, cy4+5, done?C.done:C.pend, 11);
        var cn = _challengeNameZh(c.Name);
        if (cn.length>30) cn = cn.slice(0,29)+'…';
        text(cn, cx4+18, cy4+5, done?C.white:C.text2, 12);
        if (!done && c.Progress) text(_fmtNum(c.Progress), cx4+cColW-4, cy4+5, C.text2, 11, false, 'right');
      });
      y += Math.ceil(arr.length/cCols)*ROW + 12;
    }
    drawChallenges(chDone, true);
    drawChallenges(chPend, false);

    /* ═══════════════════════════════
       集团声望
    ═══════════════════════════════ */
    y += GAP;
    sectionTitle('集团声望  （' + (d.syndicates||[]).length + ' 个集团）', y);
    y += SEC;

    var syns = d.syndicates||[];
    var sCols = 3, sColW = Math.floor(CW/sCols) - 8;
    syns.forEach(function(syn, i) {
      var tag   = syn.Tag||'';
      var cname = SYN_CN[tag]||(tag.indexOf('RadioLegion')===0?'夜羽':null)||tag.replace(/Syndicate$/,'').replace(/([A-Z])/g,' $1').trim()||'未知集团';
      var rank  = syn.Title!=null?syn.Title:syn.Rank;
      var stand = syn.Standing||0;
      var col = i%sCols, row = Math.floor(i/sCols);
      var cx5 = PL + col*(sColW+12);
      var cy5 = y + row*88;
      ctx.fillStyle = C.card; roundRect(ctx, cx5, cy5, sColW, 78, 6);
      text(cname, cx5+12, cy5+12, C.white, 14, true);
      var rankName = rank!=null?(RANK_TITLES[String(rank)]||''):'';
      if (rank!=null) text('Rank '+rank+(rankName?' ('+rankName+')':''), cx5+12, cy5+34, C.text2, 11);
      text(_fmtNum(stand), cx5+12, cy5+52, C.teal, 16, true);
      text('当前声望', cx5+12, cy5+72, C.text2, 10, false);
    });
    y += Math.ceil(syns.length/sCols)*88 + 16;

    /* ── 页脚 ── */
    y += 24;
    divider(y);
    y += 10;
    text('Generated by WFSpeed.run · ' + new Date().toISOString().slice(0,10), W/2, y, C.text2, 11, false, 'center');
    y += 30;

    /* ── 裁剪到实际高度并下载 ── */
    var finalCv = document.createElement('canvas');
    finalCv.width = W; finalCv.height = y;
    finalCv.getContext('2d').drawImage(cv, 0, 0);

    finalCv.toBlob(function(blob) {
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url; a.download = 'wf-profile-' + (d.name||'player') + '.png'; a.click();
      URL.revokeObjectURL(url);
      btn.disabled = false; btn.textContent = '✓ 已保存';
      setTimeout(function(){
        btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 14 14" fill="none">' +
          '<circle cx="11" cy="2.5" r="1.8" stroke="currentColor" stroke-width="1.3"/>' +
          '<circle cx="11" cy="11.5" r="1.8" stroke="currentColor" stroke-width="1.3"/>' +
          '<circle cx="3" cy="7" r="1.8" stroke="currentColor" stroke-width="1.3"/>' +
          '<line x1="9.4" y1="3.2" x2="4.5" y2="6.4" stroke="currentColor" stroke-width="1.3"/>' +
          '<line x1="4.5" y1="7.6" x2="9.4" y2="10.8" stroke="currentColor" stroke-width="1.3"/></svg> 生成分享图片';
      }, 3000);
    }, 'image/png');
  }

  /* ════════════════════════════════════════
     辅助函数
  ════════════════════════════════════════ */
  function _dataTable(headers, rows) {
    var tbl=document.createElement('table'); tbl.className='pf-data-table';
    var thead=document.createElement('thead'); var hRow=document.createElement('tr');
    headers.forEach(function(h){ var th=document.createElement('th'); th.textContent=h; hRow.appendChild(th); });
    thead.appendChild(hRow); tbl.appendChild(thead);
    var tbody=document.createElement('tbody');
    rows.forEach(function(r){
      var tr=document.createElement('tr');
      r.forEach(function(cell){ var td=document.createElement('td'); td.textContent=cell; tr.appendChild(td); });
      tbody.appendChild(tr);
    });
    tbl.appendChild(tbody); return tbl;
  }

  function _challengeList(arr, done) {
    var wrap=_el('div','pf-challenge-list');
    arr.forEach(function(c){
      var row=_el('div','pf-challenge-row'+(done?' pf-ch-done':''));
      var name=_challengeNameZh(c.Name);
      row.appendChild(_el('span','pf-ch-icon',done?'✓':'○'));
      row.appendChild(_el('span','pf-ch-name',name));
      if (!done&&c.Progress!=null) row.appendChild(_el('span','pf-ch-prog',_fmtNum(c.Progress)));
      wrap.appendChild(row);
    });
    return wrap;
  }

  function _categorize(xpInfo,inv){
    var suits=0,longGuns=0,pistols=0,melee=0,archwing=0,companions=0,space=0;
    (xpInfo||[]).forEach(function(x){
      var t=x.ItemType||'';
      if(t.indexOf('/Powersuits/')!==-1)suits++;
      else if(t.indexOf('/SpaceSuits/')!==-1)archwing++;
      else if(t.indexOf('/LongGuns/')!==-1||t.indexOf('/Rifles/')!==-1||t.indexOf('/Shotgun')!==-1||t.indexOf('/Sniper')!==-1||t.indexOf('/Launchers/')!==-1)longGuns++;
      else if(t.indexOf('/Pistols/')!==-1||t.indexOf('/Pistol/')!==-1)pistols++;
      else if(t.indexOf('/Melee/')!==-1||t.indexOf('/Blades/')!==-1||t.indexOf('/Swords/')!==-1||t.indexOf('/Hammers/')!==-1||t.indexOf('/Scythes/')!==-1)melee++;
      else if(t.indexOf('/SpaceWeapons/')!==-1||t.indexOf('/ArchGun')!==-1||t.indexOf('/ArchMelee')!==-1)space++;
      else if(t.indexOf('/Sentinels/')!==-1||t.indexOf('/Companions/')!==-1||t.indexOf('/Dogs/')!==-1||t.indexOf('/Cats/')!==-1)companions++;
    });
    if(suits===0&&inv.Suits)suits=inv.Suits.length;
    if(longGuns===0&&inv.LongGuns)longGuns=inv.LongGuns.length;
    if(pistols===0&&inv.Pistols)pistols=inv.Pistols.length;
    if(melee===0&&inv.Melee)melee=inv.Melee.length;
    return{suits:suits,longGuns:longGuns,pistols:pistols,melee:melee,archwing:archwing,companions:companions,space:space,total:(xpInfo||[]).length};
  }

  function _calcMR(xpInfo){
    if(!xpInfo||!xpInfo.length)return 0;
    var total=xpInfo.reduce(function(s,x){return s+(x.XP||0);},0);
    return Math.min(40,Math.floor((-1+Math.sqrt(1+8*total/750))/2));
  }

  /* 物品名翻译统一走共享运行时 WF.i18n（见 js/wf-i18n.js）。
     itemNameByPath 内部已复刻原"override[路径]→字典[路径]→override[末段]→驼峰拆词"链，行为不变。 */
  function _itemName(path){ return WF.i18n.itemNameByPath(path); }

  /* 短名反查表同样取自 WF.i18n（byPath 末段→中文，首个出现优先），与原逻辑一致 */
  function _i18nShortMap() { return WF.i18n.shortMap(); }

  /* 挑战/成就名称翻译 */
  function _challengeNameZh(raw) {
    if (!raw) return '未知';
    var m = _i18nShortMap();
    /* 直接短名命中 */
    if (m[raw]) return m[raw];
    /* 武器精通挑战：BratonChallengeA/B/C */
    var wm = /^(.+)Challenge([ABC])$/.exec(raw);
    if (wm) {
      var tier = {A:'铜级',B:'银级',C:'金级'}[wm[2]] || wm[2];
      var wName = m[wm[1]] || _camelSplit(wm[1]);
      return wName + ' 精通·' + tier;
    }
    /* 称号挑战 */
    if (/TitleChallenge$/.test(raw))
      return _camelSplit(raw.replace(/TitleChallenge$/,'')) + ' 称号';
    /* 隐藏统计 */
    if (/Hidden$/.test(raw))
      return _camelSplit(raw.replace(/Hidden$/,'')) + '（隐藏统计）';
    /* 回退：驼峰拆分 */
    return _camelSplit(raw);
  }
  function _camelSplit(s) {
    return s.replace(/([a-z])([A-Z])/g,'$1 $2').replace(/([A-Z]+)([A-Z][a-z])/g,'$1 $2');
  }

  function _arr(v){ return Array.isArray(v)?v:[]; }
  function _el(tag,cls,text){
    var e=document.createElement(tag);
    if(cls)e.className=cls;
    if(text!==undefined)e.textContent=text;
    return e;
  }
  function _sectionTitle(text){ return _el('div','pf-section-title',text); }
  function _statCard(label,value,cls){
    var d=_el('div','pf-stat-card'+(cls?' pf-stat-'+cls:''));
    d.appendChild(_el('div','pf-stat-value',value));
    d.appendChild(_el('div','pf-stat-label',label));
    return d;
  }
  function _skillGrid(keys,skills,maxVal){
    var grid=_el('div','pf-skill-grid');
    keys.forEach(function(pair){
      var val=skills[pair[0]]||0;
      var item=_el('div','pf-skill-item');
      var bar=_el('div','pf-skill-bar'); var fill=_el('div','pf-skill-fill');
      fill.style.width=Math.min(100,val/(maxVal||10)*100)+'%'; bar.appendChild(fill);
      item.appendChild(_el('span','pf-skill-name',pair[1]));
      item.appendChild(bar);
      item.appendChild(_el('span','pf-skill-val',String(val)));
      grid.appendChild(item);
    });
    return grid;
  }
  function _esc(str){ return String(str==null?'':str).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];}); }
  function _fmtNum(n){ return Number(n).toLocaleString(); }

  return { render: render };
})();
