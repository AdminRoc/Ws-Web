/**
 * Warframe 伤害计算器 - 主应用逻辑
 * UI 交互 / 状态管理 / MOD 配置 / DPS 计算
 * GSAP: 仅使用 set() + to()，禁用 from()
 */

const App = {

  state: {
    selectedWeaponName: null,
    selectedWeapon: null,
    selectedEnemyName: null,
    selectedEnemy: null,
    enemyLevel: 30,
    steelPath: false,
    eximus: false,
    mods: Array(10).fill(null),
    modRanks: Array(10).fill(0),
    modPolarities: ['','','','','','','','','',''],
    weaponPolarities: [],
    currentCapacity: 0,
    maxCapacity: 60,
    activeAttackIndex: 0,
    options: {
      headshot: false,
      steelPath: false,
      stealth: false,
      heavyAttack: false,
      comboMultEnabled: false,
      comboMultSlider: 1,
      lightAttackComboEnabled: false,
      lightAttackComboSlider: 1,
      sniperComboEnabled: false,
      sniperComboSlider: 1,
      abilityStrength: 100,
      externalVirus: false,
      virusStacks: 0,
      armorStrip: 0,
      manualStatusCount: false,
      manualStatusValue: 0,
      conditionOverload: false,
      madurai: false,
      mergeAttacks: false,
      conditionalModsAlways: false,
      customStats: {}
    },
    abilities: {
      rhinoRoar: false,
      rhinoRoarPercent: 30,
      mirageEclipse: false,
      mirageEclipsePercent: 30,
      xakuWhisper: false,
      xakuWhisperPercent: 26,
      sarynSpores: false,
      sarynSporesPercent: 30,
      grendelNourish: false,
      grendelNourishPercent: 45,
      kullervoCrit: false,
      kullervoCritPercent: 50,
      harrowCrit: false,
      harrowCritPercent: 50,
      toxicLash: false,
      toxicLashPercent: 30
    },
    riven: {
      active: false,
      weaponType: '',
      positives: [],
      positiveValues: [],
      negative: null,
      negativeValue: 0,
      rank: 0
    },
    warframeMods: Array(4).fill(null),
    warframeModRanks: Array(4).fill(0),
    dpsResult: null,
    weaponSearchQuery: '',
    enemySearchQuery: '',
    modSearchQuery: '',
    modPickerSlot: -1,
    modPickerType: 'regular',
    // Zaw/Kitgun 组件状态
    zawComponents: { grip: null, link: null },
    kitgunComponents: { grip: null, loader: null },
    // Incarnon 进化状态 (4个槽位, 每个槽位的选中evolution id)
    incarnonEvo: [null, null, null, null],
    // 近战连击/姿态状态
    selectedStanceName: null,
    selectedStanceAttackIndex: 0,
    // TTK/Median 计算迭代次数
    ttkIterations: 100,
    // 条件MOD最大激活
    isMaxCond: true
  },

  // 裂罅属性名称映射 (英文key → 中文显示)
  RIVEN_STATS_ZH: {
    'Damage': '伤害',
    'Multishot': '多重射击',
    'Critical Chance': '暴击几率',
    'Critical Damage': '暴击伤害',
    'Fire Rate': '射速',
    'Status Chance': '状态几率',
    'Status Duration': '状态持续时间',
    'Heat Damage': '火焰伤害',
    'Cold Damage': '冰冻伤害',
    'Electricity Damage': '电击伤害',
    'Toxin Damage': '毒素伤害',
    'Impact Damage': '冲击伤害',
    'Puncture Damage': '穿刺伤害',
    'Slash Damage': '切割伤害',
    'Magazine Capacity': '弹匣容量',
    'Reload Speed': '装填速度',
    'Punch Through': '穿透',
    'Flight Speed': '投射物速度',
    'Zoom': '缩放',
    'Recoil': '后坐力',
    'Ammo Maximum': '弹药上限',
    'Combo Duration': '连击持续时间',
    'Finisher Damage': '处决伤害',
    'Range': '范围',
    'Initial Combo': '初始连击',
    'Heavy Attack Efficiency': '重击效率',
    'Critical Chance on Slide Attack': '滑行暴击几率',
    'Additional Combo Count Chance': '额外连击几率',
    'Damage vs. Corpus': '对Corpus伤害',
    'Damage vs. Grineer': '对Grineer伤害',
    'Damage vs. Infested': '对Infested伤害'
  },

  RIVEN_POSITIVE_STATS: [
    'Damage', 'Multishot', 'Critical Chance', 'Critical Damage',
    'Fire Rate', 'Status Chance', 'Status Duration',
    'Heat Damage', 'Cold Damage', 'Electricity Damage', 'Toxin Damage',
    'Impact Damage', 'Puncture Damage', 'Slash Damage',
    'Magazine Capacity', 'Reload Speed', 'Punch Through',
    'Flight Speed', 'Zoom', 'Recoil'
  ],

  RIVEN_NEGATIVE_STATS: [
    'Damage', 'Multishot', 'Critical Chance', 'Critical Damage',
    'Fire Rate', 'Status Chance', 'Status Duration',
    'Heat Damage', 'Cold Damage', 'Electricity Damage', 'Toxin Damage',
    'Impact Damage', 'Puncture Damage', 'Slash Damage',
    'Magazine Capacity', 'Reload Speed', 'Punch Through',
    'Flight Speed', 'Zoom', 'Recoil',
    'Ammo Maximum', 'Combo Duration', 'Finisher Damage',
    'Range', 'Initial Combo', 'Heavy Attack Efficiency',
    'Critical Chance on Slide Attack', 'Additional Combo Count Chance',
    'Damage vs. Corpus', 'Damage vs. Grineer', 'Damage vs. Infested'
  ],

  init() {
    this.bindEvents();
    this.renderWeaponList();
    this.renderEnemyList();
    this.renderModSlots();
    this.renderWarframeModSlots();
    this.initAnimations();
    this.createParticles();
  },

  bindEvents() {
    const $ = id => document.getElementById(id);

    $('weapon-search').addEventListener('input', e => this.filterWeapons(e.target.value));
    $('enemy-search').addEventListener('input', e => this.filterEnemies(e.target.value));

    $('enemy-level').addEventListener('input', e => {
      this.state.enemyLevel = parseInt(e.target.value) || 1;
      this.recalculate();
    });

    document.querySelectorAll('.option-item').forEach(item => {
      item.addEventListener('click', () => {
        item.classList.toggle('active');
        const opt = item.dataset.option;
        if (opt === 'steelPath') {
          this.state.steelPath = item.classList.contains('active');
        } else if (opt === 'eximus') {
          this.state.eximus = item.classList.contains('active');
        } else if (opt in this.state.options) {
          this.state.options[opt] = item.classList.contains('active');
        }
        this.recalculate();
      });
    });

    const comboSlider = $('combo-slider');
    if (comboSlider) {
      comboSlider.addEventListener('input', e => {
        this.state.options.comboMultEnabled = true;
        this.state.options.comboMultSlider = parseFloat(e.target.value) || 1;
        $('combo-value').textContent = e.target.value;
        this.recalculate();
      });
    }

    document.querySelectorAll('.ability-toggle').forEach(btn => {
      btn.addEventListener('click', (e) => {
        // Don't toggle if clicking on the input
        if (e.target.classList.contains('ability-value')) return;
        const key = btn.dataset.ability;
        btn.classList.toggle('active');
        this.state.abilities[key] = btn.classList.contains('active');
        this.recalculate();
      });
    });

    // Ability percentage inputs
    document.querySelectorAll('.ability-value').forEach(input => {
      input.addEventListener('input', () => {
        const key = input.dataset.abilityValue;
        if (key) {
          this.state.abilities[key + 'Percent'] = parseInt(input.value) || 0;
          this.recalculate();
        }
      });
    });

    const strSlider = $('ability-strength-slider');
    if (strSlider) {
      strSlider.addEventListener('input', e => {
        this.state.options.abilityStrength = parseInt(e.target.value) || 100;
        $('ability-strength-value').textContent = e.target.value + '%';
        this.recalculate();
      });
    }

    const virusSlider = $('virus-stacks-slider');
    if (virusSlider) {
      virusSlider.addEventListener('input', e => {
        this.state.options.virusStacks = parseInt(e.target.value) || 0;
        $('virus-stacks-value').textContent = e.target.value;
        this.recalculate();
      });
    }

    const armorSlider = $('armor-strip-slider');
    if (armorSlider) {
      armorSlider.addEventListener('input', e => {
        this.state.options.armorStrip = parseInt(e.target.value) || 0;
        $('armor-strip-value').textContent = e.target.value + '%';
        this.recalculate();
      });
    }

    const statusSlider = $('manual-status-slider');
    if (statusSlider) {
      statusSlider.addEventListener('input', e => {
        this.state.options.manualStatusValue = parseInt(e.target.value) || 0;
        $('manual-status-value').textContent = e.target.value;
        this.recalculate();
      });
    }

    document.querySelectorAll('.checkbox-option').forEach(el => {
      el.addEventListener('click', () => {
        el.classList.toggle('active');
        const key = el.dataset.key;
        if (key in this.state.options) {
          this.state.options[key] = el.classList.contains('active');
          // Show/hide merge attacks panel
          if (key === 'mergeAttacks') {
            const panel = document.getElementById('merge-attacks-panel');
            if (panel) {
              panel.style.display = this.state.options.mergeAttacks ? 'block' : 'none';
            }
          }
        }
        this.recalculate();
      });
    });

    // URL 编码/解码
    this.loadFromURL();
  },

  // ═══════════════ URL 编码/解码 ═══════════════

  saveToURL() {
    const state = {
      weapon: this.state.selectedWeaponName,
      enemy: this.state.selectedEnemyName,
      level: this.state.enemyLevel,
      mods: this.state.mods.map((m, i) => m ? { id: m.id, rank: this.state.modRanks[i] } : null),
      riven: this.state.riven,
      steelPath: this.state.steelPath,
      options: this.state.options,
      abilities: this.state.abilities,
      incarnonEvo: this.state.incarnonEvo,
      stance: this.state.selectedStanceName,
      wfMods: this.state.warframeMods.map((m, i) => m ? { id: m.id, rank: this.state.warframeModRanks[i] } : null)
    };
    const json = JSON.stringify(state);
    const compressed = LZString.compressToEncodedURIComponent(json);
    const url = window.location.pathname + '?p=' + compressed;
    window.history.replaceState(null, '', url);
    return url;
  },

  loadFromURL() {
    const params = new URLSearchParams(window.location.search);
    const p = params.get('p');
    if (!p) return;

    try {
      const json = LZString.decompressFromEncodedURIComponent(p);
      if (!json) return;
      const state = JSON.parse(json);

      if (state.weapon) {
        this.selectWeapon(state.weapon, false);
      }
      if (state.enemy) {
        this.selectEnemy(state.enemy, false);
      }
      if (state.level) {
        this.state.enemyLevel = state.level;
        const levelSlider = document.getElementById('enemy-level');
        if (levelSlider) levelSlider.value = state.level;
      }
      if (state.mods) {
        state.mods.forEach((m, i) => {
          if (m && m.id) {
            const mod = GameData.getModById(m.id);
            if (mod) {
              this.state.modSlots[i] = mod;
              this.state.modRanks[i] = m.rank || 0;
            }
          }
        });
        this.renderModSlots();
      }
      if (state.riven) {
        this.state.riven = state.riven;
        if (state.riven.active) {
          this.renderRivenInputs();
        }
      }
      if (state.steelPath) {
        this.state.steelPath = state.steelPath;
        const spEl = document.querySelector('[data-option="steelPath"]');
        if (spEl) spEl.classList.toggle('active', state.steelPath);
      }
      if (state.options) {
        Object.assign(this.state.options, state.options);
        this.syncOptionsUI();
      }
      if (state.abilities) {
        Object.assign(this.state.abilities, state.abilities);
        this.syncAbilitiesUI();
      }
      if (state.incarnonEvo) {
        this.state.incarnonEvo = state.incarnonEvo;
        this.renderIncarnonEvolutions();
      }
      if (state.stance) {
        this.state.selectedStanceName = state.stance;
        this.renderStanceSection();
      }
      if (state.wfMods) {
        state.wfMods.forEach((m, i) => {
          if (m && m.id) {
            const mod = GameData.getWarframeModById(m.id);
            if (mod) {
              this.state.warframeMods[i] = mod;
              this.state.warframeModRanks[i] = m.rank || 0;
            }
          }
        });
        this.renderWarframeModSlots();
      }

      this.recalculate();
    } catch (e) {
      console.warn('URL 加载失败:', e);
    }
  },

  syncOptionsUI() {
    document.querySelectorAll('.option-item').forEach(item => {
      const opt = item.dataset.option;
      if (opt in this.state.options) {
        item.classList.toggle('active', this.state.options[opt]);
      }
    });
    document.querySelectorAll('.checkbox-option').forEach(el => {
      const key = el.dataset.key;
      if (key in this.state.options) {
        el.classList.toggle('active', this.state.options[key]);
      }
    });
  },

  syncAbilitiesUI() {
    document.querySelectorAll('.ability-toggle').forEach(btn => {
      const key = btn.dataset.ability;
      if (key in this.state.abilities) {
        btn.classList.toggle('active', this.state.abilities[key]);
      }
    });
    // Sync percentage inputs
    document.querySelectorAll('.ability-value').forEach(input => {
      const key = input.dataset.abilityValue;
      if (key && this.state.abilities[key + 'Percent'] !== undefined) {
        input.value = this.state.abilities[key + 'Percent'];
      }
    });
  },

  bindIncarnonEvoSlots() {
    document.querySelectorAll('.incarnon-evo-slot').forEach(slot => {
      slot.addEventListener('click', () => {
        const slotIdx = parseInt(slot.dataset.slot);
        const optIdx = parseInt(slot.dataset.opt);
        this.selectIncarnonEvo(slotIdx, optIdx);
      });
    });
  },

  bindStanceSelect() {
    const select = document.getElementById('stance-select');
    if (select) {
      select.addEventListener('change', (e) => {
        this.selectStance(e.target.value);
      });
    }
  },

  // ═══════════════ 武器系统 ═══════════════

  renderWeaponList() {
    const weapons = GameData.getAllWeapons();
    const container = document.getElementById('weapon-list');
    container.innerHTML = weapons.map(w => {
      const data = GameData.getWeaponData(w.name);
      const catZh = data ? (GameData.CATEGORY_NAMES[data.category] || data.category) : '';
      const typeZh = data ? (GameData.WEAPON_TYPE_NAMES[data.type] || data.type) : '';
      return `
      <div class="weapon-item" data-name="${w.name}" onclick="App.selectWeapon('${w.name.replace(/'/g, "\\'")}')">
        <div class="weapon-info">
          <div class="weapon-name">${w.nameZh}</div>
          <div class="weapon-type">${catZh}${typeZh ? ' / ' + typeZh : ''}</div>
        </div>
      </div>
    `}).join('');
  },

  filterWeapons(query) {
    this.state.weaponSearchQuery = query;
    const q = query.toLowerCase();
    const weapons = GameData.getAllWeapons().filter(w =>
      w.name.toLowerCase().includes(q) ||
      w.nameZh.includes(q)
    );
    const container = document.getElementById('weapon-list');
    const sel = this.state.selectedWeaponName;
    container.innerHTML = weapons.map(w => {
      const data = GameData.getWeaponData(w.name);
      const catZh = data ? (GameData.CATEGORY_NAMES[data.category] || data.category) : '';
      const typeZh = data ? (GameData.WEAPON_TYPE_NAMES[data.type] || data.type) : '';
      return `
      <div class="weapon-item ${sel === w.name ? 'active' : ''}"
           data-name="${w.name}" onclick="App.selectWeapon('${w.name.replace(/'/g, "\\'")}')">
        <div class="weapon-info">
          <div class="weapon-name">${w.nameZh}</div>
          <div class="weapon-type">${catZh}${typeZh ? ' / ' + typeZh : ''}</div>
        </div>
      </div>
    `}).join('');
  },

  selectWeapon(name) {
    const data = GameData.getWeaponData(name);
    if (!data) return;
    this.state.selectedWeaponName = name;
    this.state.selectedWeapon = data;
    this.state.activeAttackIndex = 0;
    this.state.mods = Array(10).fill(null);
    this.state.modRanks = Array(10).fill(0);
    this.state.currentCapacity = 0;
    this.state.zawComponents = { grip: null, link: null };
    this.state.kitgunComponents = { grip: null, loader: null };

    this.updateWeaponInfo(data);
    this.renderModSlots();
    this.renderIncarnonEvolutions();
    this.renderStanceSection();
    this.renderCustomStatsPanel();
    this.renderMergeAttacksPanel();
    this.recalculate();

    document.querySelectorAll('#weapon-list .weapon-item').forEach(item => {
      item.classList.toggle('active', item.dataset.name === name);
    });
  },

  // ═══════════════ Zaw/Kitgun 组件检测 ═══════════════

  isZawWeapon(name) {
    return /^(Balla|Cyath|Dehtat|Dokrahm|Kronsh|Mewan|Ooltha|Rabvee|Sepfahn|Plague Keewar|Plague Kripath)\s*\(/.test(name);
  },

  isKitgunWeapon(name) {
    return /^(Catchmoon|Gaze|Rattleguts|Tombfinger|Sporelacer)\s*\(/.test(name);
  },

  getZawStrikeName(name) {
    const match = name.match(/^([^(]+)/);
    return match ? match[1].trim() : name;
  },

  getKitgunChamberName(name) {
    const match = name.match(/^([^(]+)/);
    return match ? match[1].trim() : name;
  },

  getKitgunWeaponType(name) {
    return name.includes('(Primary)') ? 'primary' : 'secondary';
  },

  /**
   * 获取Zaw组件的最终属性修改
   * Strike (击刃): 只影响速度修正
   * Grip (握柄): 影响伤害和速度
   * Link (环接): 影响伤害、速度、暴击几率、状态几率
   */
  getZawComponentModifiers() {
    const { grip, link } = this.state.zawComponents;
    const mods = { damage: 0, speed: 0, crit_chance: 0, status_chance: 0 };

    if (grip) {
      const gripData = GameData.ZAW_GRIPS[grip];
      if (gripData) {
        mods.damage += gripData.damage;
        mods.speed += gripData.speed;
      }
    }

    if (link) {
      const linkData = GameData.ZAW_LINKS[link];
      if (linkData) {
        mods.damage += linkData.damage;
        mods.speed += linkData.speed;
        mods.crit_chance += linkData.crit_chance;
        mods.status_chance += linkData.status_chance;
      }
    }

    return mods;
  },

  /**
   * 获取Kitgun组件的最终属性修改
   * Grip (握柄): 影响伤害和射速
   * Loader (弹仓): 影响暴击几率、暴击倍率、弹匣容量、装填时间、状态几率
   */
  getKitgunComponentModifiers() {
    const { grip, loader } = this.state.kitgunComponents;
    const mods = { damage: 0, speed: 0, crit_chance: 0, crit_mult: 0, status_chance: 0, magazineSize: 0, reloadTime: 0 };

    if (grip) {
      const chamberName = this.getKitgunChamberName(this.state.selectedWeaponName);
      const weaponType = this.getKitgunWeaponType(this.state.selectedWeaponName);
      const category = weaponType === 'primary' ? 'primary-' : 'secondary-';

      // 确定枪膛类型
      let chamberType = 'hitscan';
      if (chamberName === 'Catchmoon') chamberType = 'projectile';
      else if (chamberName === 'Gaze') chamberType = 'beam';
      else if (chamberName === 'Tombfinger') chamberType = 'projectile';
      else if (chamberName === 'Sporelacer') chamberType = 'projectile';
      else if (chamberName === 'Rattleguts') chamberType = 'hitscan';

      // 确定武器类别
      let weaponCategory = category + chamberType;
      if (chamberName === 'Catchmoon' && weaponType === 'primary') weaponCategory = 'primary-shotgun';
      if (chamberName === 'Sporelacer' && weaponType === 'primary') weaponCategory = 'primary-shotgun';
      if (chamberName === 'Rattleguts' && weaponType === 'secondary') weaponCategory = 'secondary-hitscan';

      const grips = GameData.KITGUN_GRIPS[weaponCategory] || GameData.KITGUN_GRIPS[category + 'hitscan'];
      if (grips && grips[grip]) {
        mods.speed += grips[grip].speed;
      }
    }

    if (loader) {
      const loaderMain = GameData.KITGUN_LOADERS_MAIN[loader];
      if (loaderMain) {
        mods.crit_mult += loaderMain.crit_mult;
        mods.reloadTime += loaderMain.reloadTime;
      }

      // Loader状态几率等需要根据武器类型查找
      const weaponType = this.getKitgunWeaponType(this.state.selectedWeaponName);
      let loaderCategory = 'beam';
      const chamberName = this.getKitgunChamberName(this.state.selectedWeaponName);
      if (chamberName === 'Catchmoon' || chamberName === 'Sporelacer') loaderCategory = 'shotgun';
      else if (chamberName === 'Tombfinger') loaderCategory = 'projectile';
      else if (chamberName === 'Rattleguts') loaderCategory = 'hitscan';

      const loaders = GameData.KITGUN_LOADERS[loaderCategory];
      if (loaders && loaders[loader]) {
        mods.crit_chance += loaders[loader].crit_chance;
        mods.status_chance += loaders[loader].status_chance;
        mods.magazineSize += loaders[loader].magazineSize;
      }
    }

    return mods;
  },

  // ═══════════════ Zaw/Kitgun 组件选择UI ═══════════════

  renderZawComponents() {
    const strikeName = this.getZawStrikeName(this.state.selectedWeaponName);
    const strikeData = GameData.ZAW_STRIKES[strikeName];
    const currentGrip = this.state.zawComponents.grip;
    const currentLink = this.state.zawComponents.link;

    // 获取可用握柄类型
    const availableGrips = Object.entries(GameData.ZAW_GRIPS).filter(([name, data]) => {
      // 检查握柄是否兼容当前武器类型
      return data.type.some(t => this.state.selectedWeapon.type.toLowerCase().includes(t.replace('melee-', '')));
    });

    // 获取可用环接
    const availableLinks = Object.keys(GameData.ZAW_LINKS);

    const gripOptions = availableGrips.map(([name]) =>
      `<option value="${name}" ${currentGrip === name ? 'selected' : ''}>${name}</option>`
    ).join('');

    const linkOptions = availableLinks.map(name =>
      `<option value="${name}" ${currentLink === name ? 'selected' : ''}>${name}</option>`
    ).join('');

    return `
      <div class="stat-section" style="border-top: 1px solid var(--c-border); padding-top: 12px;">
        <h3>Zaw 组件</h3>
        <div style="font-size:0.75rem;color:var(--c-text-dim);margin-bottom:8px;">
          击刃: ${strikeName} (速度修正: ${strikeData ? (strikeData.speed > 0 ? '+' : '') + strikeData.speed : 'N/A'})
        </div>
        <div class="stat-row">
          <span class="stat-label">握柄部 (Grip)</span>
          <select id="zaw-grip" class="weapon-select" style="max-width:150px;" onchange="App.onZawGripChange(this.value)">
            <option value="">-- 选择握柄 --</option>
            ${gripOptions}
          </select>
        </div>
        <div class="stat-row">
          <span class="stat-label">环接部 (Link)</span>
          <select id="zaw-link" class="weapon-select" style="max-width:150px;" onchange="App.onZawLinkChange(this.value)">
            <option value="">-- 选择环接 --</option>
            ${linkOptions}
          </select>
        </div>
        ${currentGrip || currentLink ? `
          <div style="font-size:0.75rem;color:var(--c-text-dim);margin-top:8px;">
            ${currentGrip ? `握柄: 伤害${GameData.ZAW_GRIPS[currentGrip].damage > 0 ? '+' : ''}${GameData.ZAW_GRIPS[currentGrip].damage}, 速度${GameData.ZAW_GRIPS[currentGrip].speed}` : ''}
            ${currentLink ? ` | 环接: 伤害${GameData.ZAW_LINKS[currentLink].damage > 0 ? '+' : ''}${GameData.ZAW_LINKS[currentLink].damage}, 暴击${GameData.ZAW_LINKS[currentLink].crit_chance > 0 ? '+' : ''}${GameData.ZAW_LINKS[currentLink].crit_chance}%, 状态${GameData.ZAW_LINKS[currentLink].status_chance > 0 ? '+' : ''}${GameData.ZAW_LINKS[currentLink].status_chance}%` : ''}
          </div>
        ` : ''}
      </div>
    `;
  },

  renderKitgunComponents() {
    const chamberName = this.getKitgunChamberName(this.state.selectedWeaponName);
    const weaponType = this.getKitgunWeaponType(this.state.selectedWeaponName);
    const currentGrip = this.state.kitgunComponents.grip;
    const currentLoader = this.state.kitgunComponents.loader;

    // 确定武器类别
    let weaponCategory = weaponType === 'primary' ? 'primary-' : 'secondary-';
    if (chamberName === 'Catchmoon' && weaponType === 'primary') weaponCategory = 'primary-shotgun';
    else if (chamberName === 'Sporelacer' && weaponType === 'primary') weaponCategory = 'primary-shotgun';
    else if (chamberName === 'Rattleguts' && weaponType === 'secondary') weaponCategory = 'secondary-hitscan';
    else weaponCategory += 'hitscan';

    // 获取可用握柄
    const grips = GameData.KITGUN_GRIPS[weaponCategory] || {};
    const gripOptions = Object.keys(grips).map(name =>
      `<option value="${name}" ${currentGrip === name ? 'selected' : ''}>${name}</option>`
    ).join('');

    // 获取可用弹仓类型
    let loaderCategory = 'beam';
    if (chamberName === 'Catchmoon' || chamberName === 'Sporelacer') loaderCategory = 'shotgun';
    else if (chamberName === 'Tombfinger') loaderCategory = 'projectile';
    else if (chamberName === 'Rattleguts') loaderCategory = 'hitscan';

    const loaders = GameData.KITGUN_LOADERS[loaderCategory] || {};
    const loaderOptions = Object.keys(loaders).map(name =>
      `<option value="${name}" ${currentLoader === name ? 'selected' : ''}>${name}</option>`
    ).join('');

    return `
      <div class="stat-section" style="border-top: 1px solid var(--c-border); padding-top: 12px;">
        <h3>Kitgun 组件</h3>
        <div style="font-size:0.75rem;color:var(--c-text-dim);margin-bottom:8px;">
          枪膛: ${chamberName} (${weaponType === 'primary' ? '主武器' : '副武器'})
        </div>
        <div class="stat-row">
          <span class="stat-label">握柄部 (Grip)</span>
          <select id="kitgun-grip" class="weapon-select" style="max-width:150px;" onchange="App.onKitgunGripChange(this.value)">
            <option value="">-- 选择握柄 --</option>
            ${gripOptions}
          </select>
        </div>
        <div class="stat-row">
          <span class="stat-label">弹仓部 (Loader)</span>
          <select id="kitgun-loader" class="weapon-select" style="max-width:150px;" onchange="App.onKitgunLoaderChange(this.value)">
            <option value="">-- 选择弹仓 --</option>
            ${loaderOptions}
          </select>
        </div>
        ${currentGrip || currentLoader ? `
          <div style="font-size:0.75rem;color:var(--c-text-dim);margin-top:8px;">
            ${currentGrip && grips[currentGrip] ? `握柄: 射速${grips[currentGrip].speed}` : ''}
            ${currentLoader && GameData.KITGUN_LOADERS_MAIN[currentLoader] ? ` | 弹仓: 暴击${GameData.KITGUN_LOADERS_MAIN[currentLoader].crit_mult}x, 装填${GameData.KITGUN_LOADERS_MAIN[currentLoader].reloadTime}s` : ''}
          </div>
        ` : ''}
      </div>
    `;
  },

  onZawGripChange(value) {
    this.state.zawComponents.grip = value || null;
    this.updateWeaponInfo(this.state.selectedWeapon);
    this.recalculate();
  },

  onZawLinkChange(value) {
    this.state.zawComponents.link = value || null;
    this.updateWeaponInfo(this.state.selectedWeapon);
    this.recalculate();
  },

  onKitgunGripChange(value) {
    this.state.kitgunComponents.grip = value || null;
    this.updateWeaponInfo(this.state.selectedWeapon);
    this.recalculate();
  },

  onKitgunLoaderChange(value) {
    this.state.kitgunComponents.loader = value || null;
    this.updateWeaponInfo(this.state.selectedWeapon);
    this.recalculate();
  },

  // ═══════════════ Incarnon 进化系统 ═══════════════

  renderIncarnonEvolutions() {
    const weaponName = this.state.selectedWeaponName;
    const evoData = GameData.getIncarnonEvo(weaponName);
    const section = document.getElementById('incarnon-evo-section');
    const slotsContainer = document.getElementById('incarnon-evo-slots');

    if (!evoData || !section || !slotsContainer) {
      if (section) section.style.display = 'none';
      return;
    }

    section.style.display = '';
    const slotKeys = ['slot1', 'slot2', 'slot3', 'slot4'];
    const slotLabels = ['进化 I', '进化 II', '进化 III', '进化 IV'];

    slotsContainer.innerHTML = slotKeys.map((key, si) => {
      const options = evoData[key] || [];
      const selectedId = this.state.incarnonEvo[si];
      return `
        <div style="background:var(--c-card);border:1px solid var(--c-border);border-radius:6px;padding:8px;">
          <div style="font-size:0.7rem;color:var(--c-gold-bright);margin-bottom:6px;font-weight:600;">${slotLabels[si]}</div>
          ${options.map(opt => `
            <div class="weapon-item ${selectedId === opt.id ? 'active' : ''}"
                 onclick="App.selectIncarnonEvo(${si}, '${opt.id}')"
                 style="padding:6px;margin-bottom:4px;cursor:pointer;font-size:0.75rem;border:1px solid ${selectedId === opt.id ? 'var(--c-gold-bright)' : 'var(--c-border)'};border-radius:4px;${selectedId === opt.id ? 'background:rgba(234,179,8,0.1);' : ''}">
              <div style="font-weight:600;color:var(--c-text);">${opt.name}</div>
              <div style="color:var(--c-text-dim);font-size:0.7rem;">${opt.desc}</div>
            </div>
          `).join('')}
        </div>
      `;
    }).join('');
  },

  selectIncarnonEvo(slotIndex, evoId) {
    if (this.state.incarnonEvo[slotIndex] === evoId) {
      this.state.incarnonEvo[slotIndex] = null;
    } else {
      this.state.incarnonEvo[slotIndex] = evoId;
    }
    this.renderIncarnonEvolutions();
    this.recalculate();
  },

  resetIncarnon() {
    this.state.incarnonEvo = [null, null, null, null];
    this.renderIncarnonEvolutions();
    this.recalculate();
  },

  getIncarnonEvoMods() {
    const weaponName = this.state.selectedWeaponName;
    const evoData = GameData.getIncarnonEvo(weaponName);
    if (!evoData) return null;

    const evoMods = { base: 0, crit_chance: 0, crit_mult: 0, multishot: 0, speed: 0, status_chance: 0, status_damage: 0, range: 0 };
    const slotKeys = ['slot1', 'slot2', 'slot3', 'slot4'];

    this.state.incarnonEvo.forEach((selectedId, si) => {
      if (!selectedId) return;
      const options = evoData[slotKeys[si]] || [];
      const opt = options.find(o => o.id === selectedId);
      if (opt && opt.effects) {
        Object.entries(opt.effects).forEach(([k, v]) => {
          if (k in evoMods) evoMods[k] += v;
        });
      }
    });

    return evoMods;
  },

  // ═══════════════ 近战姿态系统 ═══════════════

  renderStanceSection() {
    const weapon = this.state.selectedWeapon;
    const section = document.getElementById('stance-section');
    const selectArea = document.getElementById('stance-select-area');
    const infoDisplay = document.getElementById('stance-info-display');

    if (!weapon || weapon.category !== 'Melee' || !section) {
      if (section) section.style.display = 'none';
      return;
    }

    const stanceMods = GameData.getAllMods().filter(m => m.type === 'stance');
    const compTags = weapon.compTags || [];
    const weaponStances = stanceMods.filter(m => {
      if (!m.tags || m.tags.length === 0) return false;
      return m.tags.some(t => compTags.includes(t));
    });

    if (weaponStances.length === 0) {
      section.style.display = 'none';
      return;
    }

    section.style.display = '';
    const currentStance = this.state.selectedStanceName;

    selectArea.innerHTML = `
      <select class="search-input" style="width:100%;margin-bottom:8px;"
              onchange="App.selectStance(this.value)">
        <option value="">-- 无姿态 (默认连击) --</option>
        ${weaponStances.map(m => {
          const zh = GameData.MOD_NAMES_ZH[m.name] || m.name;
          return `<option value="${m.name}" ${currentStance === m.name ? 'selected' : ''}>${zh}</option>`;
        }).join('')}
      </select>
    `;

    if (currentStance) {
      const stanceMod = weaponStances.find(m => m.name === currentStance);
      if (stanceMod && stanceMod.action && stanceMod.action.stances) {
        const stanceNames = Object.keys(stanceMod.action.stances);
        const firstStance = stanceMod.action.stances[stanceNames[0]];
        if (firstStance) {
          infoDisplay.innerHTML = `
            <div style="color:var(--c-gold-bright);margin-bottom:4px;">连击倍率: ${firstStance.total.toFixed(2)}x</div>
            <div style="color:var(--c-text-dim);">段数: ${firstStance.hits.length}</div>
          `;
        }
      }
    } else {
      infoDisplay.innerHTML = '<div style="color:var(--c-text-dim);">使用默认连击 (1.0x)</div>';
    }
  },

  selectStance(stanceName) {
    this.state.selectedStanceName = stanceName || null;
    this.renderStanceSection();
    this.recalculate();
  },

  getStanceDamageMult() {
    if (!this.state.selectedStanceName) return 1;
    const weapon = this.state.selectedWeapon;
    if (!weapon || weapon.category !== 'Melee') return 1;

    const stanceMod = GameData.getAllMods().find(m => m.name === this.state.selectedStanceName);
    if (!stanceMod || !stanceMod.action || !stanceMod.action.stances) return 1;

    const stanceNames = Object.keys(stanceMod.action.stances);
    const firstStance = stanceMod.action.stances[stanceNames[0]];
    if (!firstStance) return 1;

    return firstStance.total || 1;
  },

  updateWeaponInfo(weapon) {
    const container = document.getElementById('weapon-info');
    if (!container) return;
    const attack = weapon.attacks[this.state.activeAttackIndex] || weapon.attacks[0];
    const totalDmg = Object.values(attack.damage || {}).reduce((s, v) => s + v, 0);

    let attackTabs = '';
    if (weapon.attacks.length > 1) {
      attackTabs = `<div style="display:flex;gap:4px;margin-bottom:12px;flex-wrap:wrap;">
        ${weapon.attacks.map((a, i) => `
          <button class="btn btn-secondary ${i === this.state.activeAttackIndex ? 'active' : ''}"
                  onclick="App.selectAttack(${i})"
                  style="padding:4px 8px;font-size:0.75rem;${i === this.state.activeAttackIndex ? 'border-color:var(--c-gold-bright);color:var(--c-gold-bright);' : ''}">
            ${a.name}
          </button>
        `).join('')}
      </div>`;
    }

    // 武器图片
    const weaponImgUrl = `img/weapons/${weapon.icon || weapon.name}.png`;
    
    container.innerHTML = `
      <div class="stat-section">
        <div style="display:flex;gap:12px;margin-bottom:12px;">
          <img src="${weaponImgUrl}" onerror="this.style.display='none'" style="width:64px;height:64px;border-radius:8px;background:var(--c-card);">
          <div style="flex:1;">
            <h3 style="margin:0;">${weapon.localeName || weapon.name} (${weapon.type})</h3>
            ${weapon.description ? `<div style="font-size:0.7rem;color:var(--c-text-dim);margin-top:4px;line-height:1.4;">${weapon.description}</div>` : ''}
            ${weapon.masteryReq ? `<div style="font-size:0.7rem;color:var(--c-gold-bright);margin-top:4px;">段位需求: ${weapon.masteryReq}</div>` : ''}
          </div>
        </div>
        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:4px;font-size:0.75rem;color:var(--c-text2);margin-bottom:8px;">
          ${weapon.magazineSize ? `<span>弹匣容量: ${weapon.magazineSize}</span>` : ''}
          ${weapon.ammo ? `<span>弹药最大值: ${weapon.ammo}</span>` : ''}
          ${weapon.reloadTime ? `<span>装填耗时: ${weapon.reloadTime}</span>` : ''}
          ${weapon.noise ? `<span>噪音级别: ${weapon.noise}</span>` : ''}
          ${weapon.pellets > 1 ? `<span>弹片: ${weapon.pellets}</span>` : ''}
          ${weapon.disposition ? `<span>裂罅倾向: ${weapon.disposition}</span>` : ''}
        </div>
        ${attackTabs}
      </div>
      <div class="stat-section">
        <h3>${attack.name}</h3>
        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:4px;">
          ${Object.entries(attack.damage || {}).filter(([,v]) => v > 0).map(([type, value]) => `
            <div style="display:flex;align-items:center;gap:6px;">
              <span style="width:10px;height:10px;border-radius:50%;background:${DamageCalculator.getColor(type)};display:inline-block;"></span>
              <span style="font-size:0.8rem;color:var(--c-text2);">${DamageCalculator.getName(type)}:</span>
              <span style="font-size:0.8rem;color:var(--c-text);font-weight:600;">${value.toFixed(1)}</span>
            </div>
          `).join('')}
          <div style="display:flex;align-items:center;gap:6px;">
            <span style="font-size:0.8rem;color:var(--c-text2);">总额:</span>
            <span style="font-size:0.8rem;color:var(--c-gold-bright);font-weight:600;">${totalDmg.toFixed(2)}</span>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:4px;font-size:0.75rem;color:var(--c-text2);margin-top:8px;">
          <span>暴击几率: ${attack.crit_chance}%</span>
          <span>暴击伤害: ${attack.crit_mult}x</span>
          <span>异常状态触发几率: ${attack.status_chance}%</span>
          <span>攻击速度: ${attack.speed.toFixed(2)}/s</span>
          ${attack.forcedProc ? `<span>强制触发: ${attack.forcedProc.map(p => DamageCalculator.getName(p)).join(', ')}</span>` : ''}
          ${attack.damageFallOff ? `<span>伤害衰减: 开始 ${attack.damageFallOff.start} / 结尾 ${attack.damageFallOff.end}</span>` : ''}
        </div>
      </div>
      ${this.isZawWeapon(this.state.selectedWeaponName) ? this.renderZawComponents() : ''}
      ${this.isKitgunWeapon(this.state.selectedWeaponName) ? this.renderKitgunComponents() : ''}
    `;
  },

  selectAttack(index) {
    this.state.activeAttackIndex = index;
    this.updateWeaponInfo(this.state.selectedWeapon);
    this.recalculate();
  },

  // ═══════════════ 敌人系统 ═══════════════

  renderEnemyList() {
    const enemies = GameData.getAllEnemies();
    const container = document.getElementById('enemy-list');
    const entries = Object.entries(enemies).slice(0, 80);
    container.innerHTML = entries.map(([name, e]) => `
      <div class="weapon-item" data-name="${name}" onclick="App.selectEnemy('${name.replace(/'/g, "\\'")}')">
        <div class="weapon-info">
          <div class="weapon-name">${e.localeName || name}</div>
          <div class="weapon-type">${name}</div>
        </div>
      </div>
    `).join('');
  },

  filterEnemies(query) {
    this.state.enemySearchQuery = query;
    const q = query.toLowerCase();
    const enemies = GameData.getAllEnemies();
    const entries = Object.entries(enemies).filter(([name, e]) =>
      name.toLowerCase().includes(q) ||
      (e.localeName && e.localeName.includes(q))
    ).slice(0, 80);
    const container = document.getElementById('enemy-list');
    const sel = this.state.selectedEnemyName;
    container.innerHTML = entries.map(([name, e]) => `
      <div class="weapon-item ${sel === name ? 'active' : ''}"
           data-name="${name}" onclick="App.selectEnemy('${name.replace(/'/g, "\\'")}')">
        <div class="weapon-info">
          <div class="weapon-name">${e.localeName || name}</div>
          <div class="weapon-type">${name}</div>
        </div>
      </div>
    `).join('');
  },

  selectEnemy(name) {
    const enemy = GameData.getEnemyByName(name);
    if (!enemy) return;
    this.state.selectedEnemyName = name;
    this.state.selectedEnemy = enemy;
    this.updateEnemyInfo(enemy);
    this.recalculate();

    document.querySelectorAll('#enemy-list .weapon-item').forEach(item => {
      item.classList.toggle('active', item.dataset.name === name);
    });
  },

  updateEnemyInfo(enemy) {
    const scaled = GameData.scaleEnemy(enemy, this.state.enemyLevel, this.state.steelPath, this.state.eximus);
    const dr = DamageCalculator.armorDR(scaled.armor) * 100;
    const container = document.getElementById('enemy-info');
    if (!container) return;
    
    // 获取敌人抗性信息
    const resistances = enemy.resistances || {};
    const resistText = Object.entries(resistances)
      .filter(([,v]) => v && v !== 100)
      .map(([type, value]) => `${DamageCalculator.getName(type)}: ${value}%`)
      .join(', ');
    
    container.innerHTML = `
      <div class="enemy-config">
        <div class="enemy-header">
          <div>
            <div class="enemy-name">${enemy.localeName || this.state.selectedEnemyName}</div>
            <div class="enemy-level">等级 <input type="number" id="enemy-level-inline" value="${this.state.enemyLevel}" min="1" max="9999" style="width:60px;background:var(--c-card);border:1px solid var(--c-border);color:var(--c-text);border-radius:4px;padding:2px 4px;font-size:0.8rem;" onchange="App.setEnemyLevel(this.value)"></div>
          </div>
        </div>
        <div style="display:flex;gap:8px;margin:8px 0;">
          <div class="option-item" data-option="steelPath" style="flex:1;">
            <div class="option-checkbox"></div>
            <span class="option-label">钢铁之路</span>
          </div>
          <div class="option-item" data-option="eximus" style="flex:1;">
            <div class="option-checkbox"></div>
            <span class="option-label">卓越者</span>
          </div>
        </div>
        <div class="stat-row"><span class="stat-label">伤害减免</span><span class="stat-value" style="color:var(--c-orange);">${dr.toFixed(1)}%</span></div>
        <div class="stat-row"><span class="stat-label">生命值</span><span class="stat-value">${scaled.health.toLocaleString()}</span></div>
        <div class="stat-row"><span class="stat-label">护甲</span><span class="stat-value">${scaled.armor.toLocaleString()}</span></div>
        ${scaled.shield > 0 ? `<div class="stat-row"><span class="stat-label">护盾</span><span class="stat-value">${scaled.shield.toLocaleString()}</span></div>` : ''}
        ${scaled.overguard > 0 ? `<div class="stat-row"><span class="stat-label">超宏防护</span><span class="stat-value">${scaled.overguard.toLocaleString()}</span></div>` : ''}
        ${resistText ? `<div class="stat-row"><span class="stat-label">抗性</span><span class="stat-value" style="font-size:0.7rem;">${resistText}</span></div>` : ''}
      </div>
    `;
    
    // 同步选项UI
    this.syncOptionsUI();
  },

  setEnemyLevel(value) {
    const level = parseInt(value) || 30;
    this.state.enemyLevel = Math.max(1, Math.min(9999, level));
    document.getElementById('enemy-level').value = this.state.enemyLevel;
    if (this.state.selectedEnemy) {
      this.updateEnemyInfo(this.state.selectedEnemy);
    }
    this.recalculate();
  },

  // ═══════════════ MOD 系统 ═══════════════

  renderModSlots() {
    const container = document.getElementById('mod-grid');
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < 8; i++) {
      const slot = document.createElement('div');
      slot.className = 'mod-slot';
      slot.dataset.index = i;
      const mod = this.state.mods[i];
      if (mod) {
        slot.classList.add('filled');
        const zhName = GameData.MOD_NAMES_ZH[mod.name] || mod.name;
        const imgSrc = mod.img ? `img/mods/${mod.img}` : '';
        slot.innerHTML = `
          <div style="position:absolute;inset:0;background:var(--c-card);display:flex;align-items:center;justify-content:center;border-radius:var(--r-sm);overflow:hidden;">
            ${imgSrc ? `<img src="${imgSrc}" alt="${zhName}" style="width:100%;height:100%;object-fit:cover;">` : `<span style="font-size:0.65rem;color:var(--c-text2);padding:4px;text-align:center;line-height:1.2;">${zhName}</span>`}
          </div>
          <button class="remove-mod" onclick="event.stopPropagation(); App.removeMod(${i})">&times;</button>
        `;
      } else {
        slot.innerHTML = `
          <div class="mod-icon">+</div>
          <div class="mod-name">添加 MOD</div>
        `;
      }
      slot.addEventListener('click', () => this.openModPicker(i));
      container.appendChild(slot);
    }
    this.updateCapacity();
  },

  updateCapacity() {
    const el = document.getElementById('capacity');
    if (el) el.textContent = `${this.state.currentCapacity} / ${this.state.maxCapacity}`;
  },

  getModDrain(mod, rank) {
    return 2 + rank;
  },

  getSlotLabel(index) {
    if (index === 8) return 'EXILUS';
    if (index === 9) return '光环';
    return `MOD ${index + 1}`;
  },

  openModPicker(slotIndex) {
    this.state.modPickerSlot = slotIndex;
    this.state.modPickerType = 'regular';
    const weapon = this.state.selectedWeapon;
    if (!weapon) return;

    const picker = document.getElementById('mod-picker');
    const allMods = GameData.getAllMods();
    const weaponCategory = weapon.category;

    const compatible = allMods.filter(mod => {
      if (!mod.tags || mod.tags.length === 0) return true;
      return mod.tags.some(t => {
        if (weaponCategory === 'Primary') return t === 'primary' || t.startsWith('primary-');
        if (weaponCategory === 'Secondary') return t === 'secondary' || t.startsWith('secondary-');
        if (weaponCategory === 'Melee') return t === 'melee';
        return false;
      });
    });

    const isExilus = slotIndex === 8;
    const isAura = slotIndex === 9;

    let filtered = compatible;
    if (isAura) {
      filtered = allMods.filter(m => m.type === 'aura_mod');
    } else if (isExilus) {
      filtered = compatible.filter(m => m.type === 'weapon_mist' || m.type === 'exilus');
    } else {
      const usedNames = this.state.mods.filter(m => m !== null).map(m => m.name);
      filtered = compatible.filter(m => {
        if (usedNames.includes(m.name)) return false;
        if (m.uncomp) {
          const hasConflict = m.uncomp.some(u => usedNames.includes(u));
          if (hasConflict) return false;
        }
        return true;
      });
    }

    const query = this.state.modSearchQuery.toLowerCase();
    if (query) {
      filtered = filtered.filter(m => {
        const zh = GameData.MOD_NAMES_ZH[m.name] || '';
        return m.name.toLowerCase().includes(query) || zh.includes(query);
      });
    }

    const maxDrain = this.state.maxCapacity - this.state.currentCapacity;

    picker.innerHTML = `
      <div style="background:var(--c-lb-card);border:1px solid var(--c-lb-border);border-radius:var(--r-md);padding:20px;max-width:900px;width:100%;max-height:80vh;overflow-y:auto;">
        <div class="picker-header">
          <h3>选择 ${this.getSlotLabel(slotIndex)}</h3>
          <div style="display:flex;gap:8px;align-items:center;margin-bottom:12px;">
            <input type="text" class="search-input" id="mod-search-input" placeholder="搜索 MOD..."
                   value="${this.state.modSearchQuery}"
                   oninput="App.state.modSearchQuery=this.value; App.openModPicker(${slotIndex});"
                   style="flex:1;">
            <button onclick="App.closeModPicker()" style="background:none;border:none;color:var(--c-text2);font-size:1.5rem;cursor:pointer;padding:8px;">&times;</button>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:8px;">
          ${filtered.length === 0 ? '<div style="grid-column:1/-1;text-align:center;color:var(--c-text3);padding:40px;">没有兼容的 MOD</div>' : ''}
          ${filtered.map(m => {
            const zh = GameData.MOD_NAMES_ZH[m.name] || m.name;
            const drain = this.getModDrain(m, 0);
            const canAfford = drain <= maxDrain;
            const imgSrc = m.img ? `img/mods/${m.img}` : '';
            return `
              <div class="weapon-item" onclick="App.selectMod(${slotIndex}, '${m.name.replace(/'/g, "\\'")}')"
                   style="${!canAfford ? 'opacity:0.4;pointer-events:none;' : ''}padding:8px;"
                   title="容量: ${drain}">
                <div style="display:flex;gap:8px;align-items:center;">
                  ${imgSrc ? `<img src="${imgSrc}" alt="${zh}" style="width:48px;height:48px;border-radius:4px;object-fit:cover;">` : ''}
                  <div class="weapon-info">
                    <div class="weapon-name" style="font-size:0.8rem;">${zh}</div>
                    <div class="weapon-type" style="font-size:0.7rem;">${m.name} / 消耗 ${drain}</div>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
    picker.classList.add('active');
  },

  selectMod(slotIndex, modName) {
    const mod = GameData.getAllMods().find(m => m.name === modName);
    if (!mod) return;

    const drain = this.getModDrain(mod, 0);
    const newCapacity = this.state.currentCapacity + drain;
    if (newCapacity > this.state.maxCapacity) return;

    if (slotIndex < 8) {
      const usedNames = this.state.mods.filter((m, i) => m !== null && i < 8).map(m => m.name);
      if (mod.uncomp) {
        const hasConflict = mod.uncomp.some(u => usedNames.includes(u));
        if (hasConflict) return;
      }
    }

    this.state.mods[slotIndex] = mod;
    this.state.modRanks[slotIndex] = 0;
    this.state.currentCapacity = newCapacity;

    this.renderModSlots();
    this.recalculate();
    this.closeModPicker();
  },

  removeMod(slotIndex) {
    const mod = this.state.mods[slotIndex];
    if (!mod) return;
    const drain = this.getModDrain(mod, this.state.modRanks[slotIndex]);
    this.state.currentCapacity = Math.max(0, this.state.currentCapacity - drain);
    this.state.mods[slotIndex] = null;
    this.state.modRanks[slotIndex] = 0;
    this.renderModSlots();
    this.recalculate();
  },

  closeModPicker() {
    document.getElementById('mod-picker').classList.remove('active');
    this.state.modSearchQuery = '';
  },

  // ═══════════════ Warframe MOD 系统 ═══════════════

  renderWarframeModSlots() {
    const container = document.getElementById('warframe-mod-grid');
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < 4; i++) {
      const slot = document.createElement('div');
      slot.className = 'mod-slot';
      slot.dataset.index = i;
      const mod = this.state.warframeMods[i];
      if (mod) {
        slot.classList.add('filled');
        const zhName = GameData.MOD_NAMES_ZH[mod.name] || mod.name;
        const imgSrc = mod.img ? `img/mods/${mod.img}` : '';
        slot.innerHTML = `
          <div style="position:absolute;inset:0;background:var(--c-card);display:flex;align-items:center;justify-content:center;border-radius:var(--r-sm);overflow:hidden;">
            ${imgSrc ? `<img src="${imgSrc}" alt="${zhName}" style="width:100%;height:100%;object-fit:cover;">` : `<span style="font-size:0.65rem;color:var(--c-text2);padding:4px;text-align:center;line-height:1.2;">${zhName}</span>`}
          </div>
          <button class="remove-mod" onclick="event.stopPropagation(); App.removeWarframeMod(${i})">&times;</button>
        `;
      } else {
        slot.innerHTML = `
          <div class="mod-icon">+</div>
          <div class="mod-name">添加 MOD</div>
        `;
      }
      slot.addEventListener('click', () => this.openWarframeModPicker(i));
      container.appendChild(slot);
    }
  },

  openWarframeModPicker(slotIndex) {
    this.state.modPickerSlot = slotIndex;
    this.state.modPickerType = 'warframe';

    const picker = document.getElementById('mod-picker');
    const allMods = GameData.getAllMods();

    const warframeMods = allMods.filter(mod => {
      return mod.type === 'frame_mod' || mod.type === 'aura_mod' || mod.type === 'frame_mist';
    });

    const usedNames = this.state.warframeMods.filter(m => m !== null).map(m => m.name);
    let filtered = warframeMods.filter(m => !usedNames.includes(m.name));

    const query = this.state.modSearchQuery.toLowerCase();
    if (query) {
      filtered = filtered.filter(m => {
        const zh = GameData.MOD_NAMES_ZH[m.name] || '';
        return m.name.toLowerCase().includes(query) || zh.includes(query);
      });
    }

    picker.innerHTML = `
      <div style="background:var(--c-lb-card);border:1px solid var(--c-lb-border);border-radius:var(--r-md);padding:20px;max-width:900px;width:100%;max-height:80vh;overflow-y:auto;">
        <div class="picker-header">
          <h3>选择 Warframe MOD - 槽位 ${slotIndex + 1}</h3>
          <div style="display:flex;gap:8px;align-items:center;margin-bottom:12px;">
            <input type="text" class="search-input" id="mod-search-input" placeholder="搜索 Warframe MOD..."
                   value="${this.state.modSearchQuery}"
                   oninput="App.state.modSearchQuery=this.value; App.openWarframeModPicker(${slotIndex});"
                   style="flex:1;">
            <button onclick="App.closeModPicker()" style="background:none;border:none;color:var(--c-text2);font-size:1.5rem;cursor:pointer;padding:8px;">&times;</button>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:8px;">
          ${filtered.length === 0 ? '<div style="grid-column:1/-1;text-align:center;color:var(--c-text3);padding:40px;">没有 Warframe MOD</div>' : ''}
          ${filtered.map(m => {
            const zh = GameData.MOD_NAMES_ZH[m.name] || m.name;
            const imgSrc = m.img ? `img/mods/${m.img}` : '';
            const typeLabel = m.type === 'aura_mod' ? '光环' : m.type === 'frame_mist' ? '赋能' : 'MOD';
            return `
              <div class="weapon-item" onclick="App.selectWarframeMod(${slotIndex}, '${m.name.replace(/'/g, "\\'")}')"
                   style="padding:8px;">
                <div style="display:flex;gap:8px;align-items:center;">
                  ${imgSrc ? `<img src="${imgSrc}" alt="${zh}" style="width:48px;height:48px;border-radius:4px;object-fit:cover;">` : ''}
                  <div class="weapon-info">
                    <div class="weapon-name" style="font-size:0.8rem;">${zh}</div>
                    <div class="weapon-type" style="font-size:0.7rem;">${m.name}</div>
                    <div style="font-size:0.6rem;color:var(--c-gold-bright);margin-top:2px;">[${typeLabel}]</div>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
    picker.classList.add('active');
  },

  selectWarframeMod(slotIndex, modName) {
    const mod = GameData.getAllMods().find(m => m.name === modName);
    if (!mod) return;
    this.state.warframeMods[slotIndex] = mod;
    this.state.warframeModRanks[slotIndex] = 0;
    this.renderWarframeModSlots();
    this.recalculate();
    this.closeModPicker();
  },

  removeWarframeMod(slotIndex) {
    this.state.warframeMods[slotIndex] = null;
    this.state.warframeModRanks[slotIndex] = 0;
    this.renderWarframeModSlots();
    this.recalculate();
  },

  // ═══════════════ 自定义属性值面板 ═══════════════

  renderCustomStatsPanel() {
    const container = document.getElementById('custom-stats-area');
    if (!container) return;

    const weapon = this.state.selectedWeapon;
    if (!weapon) {
      container.innerHTML = '<div class="empty-state" style="padding:12px;grid-column:1/-1;"><div class="empty-state-text">选择武器后可自定义属性</div></div>';
      return;
    }

    const attack = weapon.attacks[this.state.activeAttackIndex] || weapon.attacks[0];
    const stats = [
      { key: 'base_damage', label: '基础伤害', value: Object.values(attack.damage || {}).reduce((s, v) => s + v, 0) },
      { key: 'status_damage', label: '状态伤害', value: 0 },
      { key: 'crit_chance_normal', label: '普通暴击几率', value: attack.crit_chance || 0 },
      { key: 'crit_chance_secondary', label: '次要暴击几率', value: 0 },
      { key: 'crit_chance_tertiary', label: '第三暴击几率', value: 0 },
      { key: 'crit_damage_normal', label: '普通暴击伤害', value: attack.crit_mult || 1 },
      { key: 'crit_damage_secondary', label: '次要暴击伤害', value: 0 },
      { key: 'crit_damage_tertiary', label: '第三暴击伤害', value: 0 },
      { key: 'status_chance', label: '状态几率', value: attack.status_chance || 0 },
      { key: 'fire_rate', label: '射速', value: attack.speed || 0 },
      { key: 'multishot', label: '多重射击', value: weapon.multishot || 1 },
      { key: 'magazine_size', label: '弹匣容量', value: weapon.magazineSize || 0 },
      { key: 'reload_time', label: '装填耗时', value: weapon.reloadTime || 0 },
      { key: 'headshot_multiplier', label: '爆头倍率', value: 2.0 },
      { key: 'weakspot_multiplier', label: '弱点倍率', value: 1.0 },
      { key: 'combo_count', label: '连击数', value: 1 },
      { key: 'damage_vulnerability', label: '伤害脆弱', value: 1.0 },
      { key: 'heat_inherit', label: '火焰继承', value: 0 },
      { key: 'ember_augment', label: 'Ember 强化', value: 0 },
      { key: 'stealth_damage', label: '潜行伤害', value: 0 },
      { key: 'finisher_damage', label: '处决伤害', value: 0 },
      { key: 'melee_stealth_damage', label: '近战潜行伤害', value: 0 },
      { key: 'rift_damage', label: '裂隙伤害', value: 0 },
      { key: 'sentient_damage', label: 'Sentient伤害', value: 0 },
      { key: 'xata_whisper_damage', label: '真理密语伤害', value: 0 },
      { key: 'roar_damage', label: '战吼伤害', value: 0 },
      { key: 'eclipse_damage', label: '黯然失色伤害', value: 0 },
      { key: 'vex_armor_damage', label: '怒护伤害', value: 0 },
      { key: 'sonar_damage', label: '声呐伤害', value: 0 }
    ];

    container.innerHTML = stats.map(stat => `
      <div class="customStatItem">
        <label>${stat.label}</label>
        <input type="number" 
               data-stat="${stat.key}" 
               value="${this.state.options.customStats[stat.key] !== undefined ? this.state.options.customStats[stat.key] : ''}" 
               placeholder="${stat.value.toFixed(1)}"
               onchange="App.updateCustomStat('${stat.key}', this.value)"
               step="0.1">
      </div>
    `).join('');
  },

  updateCustomStat(key, value) {
    if (!this.state.options.customStats) {
      this.state.options.customStats = {};
    }
    if (value === '' || value === null) {
      delete this.state.options.customStats[key];
    } else {
      this.state.options.customStats[key] = parseFloat(value) || 0;
    }
    this.recalculate();
  },

  // ═══════════════ 合并攻击效果 ═══════════════

  renderMergeAttacksPanel() {
    const container = document.getElementById('merge-attacks-checkboxes');
    if (!container) return;

    const weapon = this.state.selectedWeapon;
    if (!weapon || weapon.attacks.length <= 1) {
      container.innerHTML = '<div style="font-size:0.7rem;color:var(--c-text2);">此武器只有一个攻击形态</div>';
      return;
    }

    const attacks = weapon.attacks;
    container.innerHTML = attacks.map((attack, i) => `
      <div class="option-item checkbox-option" data-merge-attack="${i}" style="margin-bottom:4px;">
        <div class="option-checkbox"></div>
        <span class="option-label" style="font-size:0.7rem;">${attack.name}</span>
      </div>
    `).join('');

    // Bind events
    container.querySelectorAll('.checkbox-option').forEach(el => {
      el.addEventListener('click', () => {
        el.classList.toggle('active');
        this.recalculate();
      });
    });
  },

  getMergeAttacksList() {
    const active = [];
    document.querySelectorAll('[data-merge-attack]').forEach(el => {
      if (el.classList.contains('active')) {
        active.push(parseInt(el.dataset.mergeAttack));
      }
    });
    return active;
  },

  // ═══════════════ 裂罅MOD系统 ═══════════════

  openRivenCreator() {
    const modal = document.getElementById('riven-creator');
    if (!modal) return;

    if (!this.state.selectedWeapon) {
      this.state.riven.weaponType = 'Primary';
    } else {
      this.state.riven.weaponType = this.state.selectedWeapon.category;
    }

    this.populateRivenSelects();
    modal.classList.add('active');
  },

  closeRivenCreator() {
    document.getElementById('riven-creator').classList.remove('active');
  },

  populateRivenSelects() {
    const statSelects = document.querySelectorAll('.riven-stat-select');

    statSelects.forEach(select => {
      select.innerHTML = '<option value="">选择属性...</option>' +
        this.RIVEN_POSITIVE_STATS.map(s => {
          const zh = this.RIVEN_STATS_ZH[s] || s;
          return `<option value="${s}">${zh}</option>`;
        }).join('');
    });

    this.updateRivenWeaponPreview();
  },

  updateRivenWeaponPreview() {
    const weaponType = document.getElementById('riven-weapon-type').value;
    const weaponName = this.state.selectedWeaponName || '未选择武器';
    const preview = document.getElementById('riven-weapon-name');
    if (preview) {
      preview.textContent = `${weaponName} (${weaponType === 'Primary' ? '主武器' : weaponType === 'Secondary' ? '副武器' : '近战'})`;
    }
  },

  updateRivenPreview() {
    // Update the preview based on selected stats
    const stats = [];
    document.querySelectorAll('.riven-stat-row').forEach(row => {
      const select = row.querySelector('.riven-stat-select');
      const input = row.querySelector('.riven-stat-value');
      if (select && input && select.value) {
        const zh = this.RIVEN_STATS_ZH[select.value] || select.value;
        const value = parseFloat(input.value) || 0;
        stats.push({ stat: zh, value });
      }
    });

    // Update weapon preview with stats
    const preview = document.getElementById('riven-weapon-name');
    if (preview && stats.length > 0) {
      const weaponName = this.state.selectedWeaponName || '未选择武器';
      preview.textContent = `${weaponName} - ${stats.map(s => `+${s.value}% ${s.stat}`).join(', ')}`;
    }
  },

  createRivenConfirm() {
    const stats = [];
    const statValues = [];
    document.querySelectorAll('.riven-stat-row').forEach(row => {
      const select = row.querySelector('.riven-stat-select');
      const input = row.querySelector('.riven-stat-value');
      if (select && input && select.value) {
        stats.push(select.value);
        statValues.push(parseFloat(input.value) || 0);
      }
    });

    const rank = parseInt(document.getElementById('riven-rank-slider').value) || 0;
    const weaponType = document.getElementById('riven-weapon-type').value;

    if (stats.length === 0) return;

    this.state.riven = {
      active: true,
      weaponType: weaponType,
      positives: stats,
      positiveValues: statValues,
      negative: null,
      negativeValue: 0,
      rank: rank
    };

    this.closeRivenCreator();
    this.displayRiven();
    this.recalculate();
  },

  /**
   * 将裂罅MOD转换为计算引擎可识别的action格式
   * 裂罅属性名称 → processMods action属性映射
   */
  rivenToModAction() {
    const riven = this.state.riven;
    if (!riven.active || riven.positives.length === 0) return null;

    const action = {};
    
    // 属性名映射：裂罅属性名 → action属性名 + 是否百分比
    const STAT_MAP = {
      'Damage': { key: 'base', isPercent: true },
      'Multishot': { key: 'multishot', isPercent: true },
      'Critical Chance': { key: 'crit_chance', isPercent: true },
      'Critical Damage': { key: 'crit_mult', isPercent: true },
      'Fire Rate': { key: 'speed', isPercent: true },
      'Status Chance': { key: 'status_chance', isPercent: true },
      'Status Duration': { key: 'status_duration', isPercent: true },
      'Heat Damage': { key: 'element.Heat', isPercent: false },
      'Cold Damage': { key: 'element.Cold', isPercent: false },
      'Electricity Damage': { key: 'element.Electricity', isPercent: false },
      'Toxin Damage': { key: 'element.Toxin', isPercent: false },
      'Impact Damage': { key: 'phys.Impact', isPercent: false },
      'Puncture Damage': { key: 'phys.Puncture', isPercent: false },
      'Slash Damage': { key: 'phys.Slash', isPercent: false },
      'Magazine Capacity': { key: 'magazineSize', isPercent: false },
      'Reload Speed': { key: 'reloadTime', isPercent: false },
      'Punch Through': { key: 'punch_through', isPercent: false },
      'Flight Speed': { key: 'shot_speed', isPercent: false },
      'Zoom': { key: 'zoom', isPercent: false },
      'Recoil': { key: 'recoil', isPercent: false },
      'Ammo Maximum': { key: 'ammoCapacity', isPercent: false },
      'Combo Duration': { key: 'comboDuration', isPercent: false },
      'Finisher Damage': { key: 'finisherDmg', isPercent: false },
      'Range': { key: 'range', isPercent: false },
      'Initial Combo': { key: 'initialCombo', isPercent: false },
      'Heavy Attack Efficiency': { key: 'melee_combo_eff', isPercent: false },
      'Critical Chance on Slide Attack': { key: 'crit_chance_slide', isPercent: true },
      'Additional Combo Count Chance': { key: 'additional_combo', isPercent: true },
      'Damage vs. Corpus': { key: 'smite.Corpus', isPercent: false },
      'Damage vs. Grineer': { key: 'smite.Grineer', isPercent: false },
      'Damage vs. Infested': { key: 'smite.Infested', isPercent: false }
    };

    // 处理正面属性
    riven.positives.forEach((stat, i) => {
      const mapping = STAT_MAP[stat];
      if (!mapping) return;
      let value = riven.positiveValues[i] || 0;
      
      if (mapping.isPercent) {
        // 百分比属性：除以100得到小数
        value = value / 100;
      }
      
      // 装填速度特殊处理：正值表示更快（减少装填时间），需要转为负值
      if (stat === 'Reload Speed') {
        value = -value / 100;
      }
      
      if (mapping.key.includes('.')) {
        const [obj, prop] = mapping.key.split('.');
        if (!action[obj]) action[obj] = {};
        action[obj][prop] = (action[obj][prop] || 0) + value;
      } else {
        action[mapping.key] = (action[mapping.key] || 0) + value;
      }
    });

    // 处理负面属性
    if (riven.negative) {
      const mapping = STAT_MAP[riven.negative];
      if (mapping) {
        let value = riven.negativeValue || 0;
        
        if (mapping.isPercent) {
          value = value / 100;
        }
        
        // 装填速度特殊处理
        if (riven.negative === 'Reload Speed') {
          value = -value / 100;
        }
        
        // 负面属性：减去数值
        if (mapping.key.includes('.')) {
          const [obj, prop] = mapping.key.split('.');
          if (!action[obj]) action[obj] = {};
          action[obj][prop] = (action[obj][prop] || 0) - value;
        } else {
          action[mapping.key] = (action[mapping.key] || 0) - value;
        }
      }
    }

    // 弓类武器2x穿透/装填
    const weapon = this.state.selectedWeapon;
    const isBow = weapon && (
      (weapon.type && weapon.type === 'Bow') ||
      (weapon.compTags && weapon.compTags.some(t => t.includes('BOW'))) ||
      (weapon.name && /cernos|dread|paris|lenz|braton.*prime.*incarnon|cinta/i.test(weapon.name))
    );
    if (isBow) {
      if (action.punch_through) action.punch_through *= 2;
      if (action.reloadTime) action.reloadTime *= 2;
    }

    return action;
  },

  /**
   * 显示裂罅MOD信息
   */
  displayRiven() {
    const riven = this.state.riven;
    const display = document.getElementById('riven-display');
    const statsDiv = document.getElementById('riven-stats');
    
    if (!riven.active || riven.positives.length === 0) {
      display.style.display = 'none';
      return;
    }
    
    display.style.display = '';
    
    let html = '';
    
    // 正面属性
    riven.positives.forEach((stat, i) => {
      const value = riven.positiveValues[i] || 0;
      const zh = this.RIVEN_STATS_ZH[stat] || stat;
      const isPercent = ['Damage', 'Multishot', 'Critical Chance', 'Critical Damage', 'Fire Rate', 'Status Chance', 'Status Duration'].includes(stat);
      html += `<div style="color:var(--c-green);">+${value}${isPercent ? '%' : ''} ${zh}</div>`;
    });
    
    // 负面属性
    if (riven.negative) {
      const value = riven.negativeValue || 0;
      const zh = this.RIVEN_STATS_ZH[riven.negative] || riven.negative;
      const isPercent = ['Damage', 'Multishot', 'Critical Chance', 'Critical Damage', 'Fire Rate', 'Status Chance', 'Status Duration'].includes(riven.negative);
      html += `<div style="color:var(--c-red);">-${value}${isPercent ? '%' : ''} ${zh}</div>`;
    }
    
    // 等级
    html += `<div style="color:var(--c-text2);margin-top:4px;">等级: ${riven.rank}/8</div>`;
    
    statsDiv.innerHTML = html;
  },

  /**
   * 移除裂罅MOD
   */
  removeRiven() {
    this.state.riven = { active: false, weaponType: '', positives: [], positiveValues: [], negative: null, negativeValue: 0, rank: 0 };
    document.getElementById('riven-display').style.display = 'none';
    this.recalculate();
  },

  // ═══════════════ 计算核心 ═══════════════

  recalculate() {
    if (!this.state.selectedWeapon || !this.state.selectedEnemy) return;

    const weapon = this.state.selectedWeapon;
    const scaledEnemy = GameData.scaleEnemy(
      this.state.selectedEnemy,
      this.state.enemyLevel,
      this.state.steelPath,
      this.state.eximus
    );
    
    // 收集所有装备的MOD（包括裂罅）
    let equippedMods = this.state.mods.filter(m => m !== null);
    
    // 如果裂罅已激活，转换为action格式并添加到MOD列表
    if (this.state.riven.active) {
      const rivenAction = this.rivenToModAction();
      if (rivenAction) {
        equippedMods.push({ name: '裂罅MOD', action: rivenAction });
      }
    }

    const opts = {
      headshot: this.state.options.headshot,
      steelPath: this.state.steelPath,
      comboMultiplier: this.state.options.comboMultEnabled ? this.state.options.comboMultSlider : 1,
      statusStacks: this.state.options.manualStatusCount ? this.buildStatusStacks() : {},
      heavyAttack: this.state.options.heavyAttack,
      abilityStrength: this.state.options.abilityStrength,
      rhinoRoar: this.state.abilities.rhinoRoar,
      rhinoRoarPercent: this.state.abilities.rhinoRoarPercent || 30,
      mirageEclipse: this.state.abilities.mirageEclipse,
      mirageEclipsePercent: this.state.abilities.mirageEclipsePercent || 30,
      xakuWhisper: this.state.abilities.xakuWhisper,
      xakuWhisperPercent: this.state.abilities.xakuWhisperPercent || 26,
      toxicLash: this.state.abilities.toxicLash,
      toxicLashPercent: this.state.abilities.toxicLashPercent || 30,
      grendelNourish: this.state.abilities.grendelNourish,
      grendelNourishPercent: this.state.abilities.grendelNourishPercent || 45,
      kullervoCrit: this.state.abilities.kullervoCrit,
      kullervoCritPercent: this.state.abilities.kullervoCritPercent || 50,
      madurai: this.state.options.madurai,
      applyWithCond: this.state.options.conditionalModsAlways === true,
      customStats: this.state.options.customStats || {},
      mergeAttacks: this.state.options.mergeAttacks
    };

    // 为每个攻击形态独立计算伤害
    const allResults = [];
    weapon.attacks.forEach((attack, index) => {
      const effectiveWeapon = {
        ...weapon,
        attacks: [attack],
        multishot: weapon.multishot || 1,
        magazineSize: weapon.magazineSize || 1,
        reloadTime: weapon.reloadTime || 0
      };

      // 应用Zaw组件修改
      if (this.isZawWeapon(this.state.selectedWeaponName)) {
        const zawMods = this.getZawComponentModifiers();
        effectiveWeapon.attacks = [{
          ...attack,
          damage: { ...attack.damage },
          crit_chance: attack.crit_chance + zawMods.crit_chance,
          status_chance: attack.status_chance + zawMods.status_chance,
          speed: attack.speed + zawMods.speed
        }];
        // 伤害修正通过MOD系统处理
        if (zawMods.damage !== 0) {
          const baseDmg = Object.values(attack.damage).reduce((s, v) => s + v, 0);
          const dmgRatio = (baseDmg + zawMods.damage) / baseDmg;
          Object.keys(effectiveWeapon.attacks[0].damage).forEach(k => {
            effectiveWeapon.attacks[0].damage[k] *= dmgRatio;
          });
        }
      }

      // 应用Kitgun组件修改
      if (this.isKitgunWeapon(this.state.selectedWeaponName)) {
        const kitgunMods = this.getKitgunComponentModifiers();
        effectiveWeapon.attacks = [{
          ...attack,
          crit_chance: attack.crit_chance + kitgunMods.crit_chance,
          crit_mult: attack.crit_mult + kitgunMods.crit_mult,
          status_chance: attack.status_chance + kitgunMods.status_chance,
          speed: kitgunMods.speed || attack.speed
        }];
        if (kitgunMods.magazineSize) effectiveWeapon.magazineSize += kitgunMods.magazineSize;
        if (kitgunMods.reloadTime) effectiveWeapon.reloadTime += kitgunMods.reloadTime;
      }

      const result = DamageCalculator.calcDPS(effectiveWeapon, equippedMods, scaledEnemy, opts);
      if (result) {
        result.attackName = attack.name;
        result.attackIndex = index;

        // 应用Incarnon进化效果
        const evoMods = this.getIncarnonEvoMods();
        if (evoMods) {
          if (evoMods.base) result.rawDPS *= (1 + evoMods.base);
          if (evoMods.base) result.effectiveDPS *= (1 + evoMods.base);
          if (evoMods.base) result.total *= (1 + evoMods.base);
          if (evoMods.status_damage) {
            result.dotDPS *= (1 + evoMods.status_damage);
            result.effectiveDPS += result.dotDPS * evoMods.status_damage;
          }
        }

        // 应用近战姿态伤害倍率
        const stanceMult = this.getStanceDamageMult();
        if (stanceMult > 1) {
          result.total *= stanceMult;
          result.rawDPS *= stanceMult;
          result.effectiveDPS *= stanceMult;
          Object.keys(result.breakdown).forEach(k => { result.breakdown[k] *= stanceMult; });
        }

        allResults.push(result);
      }
    });

    // 使用当前选中的攻击形态作为主结果
    const mainResult = allResults[this.state.activeAttackIndex] || allResults[0] || null;

    this.state.dpsResult = mainResult;
    this.state.allAttackResults = allResults;
    this.updateDPSDisplay(mainResult);
    this.updateDamageBreakdown(mainResult ? mainResult.breakdown : {});
    this.updateStatusInfo(mainResult);
    this.updateMultiAttackDisplay(allResults);
    this.saveToURL();
  },

  buildStatusStacks() {
    const stacks = {};
    const count = this.state.options.manualStatusValue;
    const attack = this.state.selectedWeapon.attacks[this.state.activeAttackIndex] || this.state.selectedWeapon.attacks[0];
    const dmg = attack.damage || {};
    const typesPresent = Object.keys(dmg).filter(t => dmg[t] > 0);
    if (typesPresent.length > 0) {
      stacks[typesPresent[0]] = count;
    }
    return stacks;
  },

  applyAbilities(result) {
    const str = this.state.options.abilityStrength / 100;
    let mult = 1;
    if (this.state.abilities.rhinoRoar) mult *= 1 + 0.5 * str;
    if (this.state.abilities.mirageEclipse) mult *= 1 + 0.75 * str;
    if (this.state.abilities.xakuWhisper) mult *= 1 + 0.2 * str;
    if (this.state.abilities.sarynSpores) mult *= 1 + 0.5 * str;
    if (this.state.abilities.grendelNourish) mult *= 1 + 0.75 * str;

    if (mult !== 1) {
      result.effectiveDPS *= mult;
      result.rawDPS *= mult;
      result.total *= mult;
      Object.keys(result.breakdown).forEach(k => { result.breakdown[k] *= mult; });
    }

    if (this.state.abilities.kullervoCrit || this.state.abilities.harrowCrit) {
      result.critChance = Math.min(result.critChance + 200, 500);
    }
  },

  applyMadurai(result) {
    if (!this.state.options.madurai) return;
    ['Impact', 'Puncture', 'Slash'].forEach(t => {
      if (result.breakdown[t]) result.breakdown[t] *= 1.3;
    });
    result.rawDPS *= 1.3;
    result.effectiveDPS *= 1.3;
  },

  applyExternalVirus(result) {
    if (!this.state.options.externalVirus) return;
    const stacks = this.state.options.virusStacks;
    const mult = 1 + stacks * GameData.VIRAL_PER_STACK;
    result.effectiveDPS *= mult;
    result.rawDPS *= mult;
    result.total *= mult;
  },

  applyArmorStrip(result, enemy) {
    const strip = this.state.options.armorStrip / 100;
    if (strip <= 0) return;
    const strippedArmor = enemy.armor * (1 - strip);
    const dr = DamageCalculator.getDMGReduction(strippedArmor);
    const oldDr = result.dr / 100;
    if (oldDr > dr) {
      const factor = (1 - dr) / (1 - oldDr);
      result.effectiveDPS *= factor;
      result.rawDPS *= factor;
      result.dr = dr * 100;
    }
  },

  // ═══════════════ DPS 显示 ═══════════════

  updateDPSDisplay(result) {
    const $ = id => document.getElementById(id);
    if (!result) {
      $('dps-value').textContent = '0';
      $('raw-dps').textContent = '0';
      $('per-shot').textContent = '0';
      $('fire-rate').textContent = '0';
      $('dot-dps').textContent = '0';
      $('armor-dr').textContent = '0%';
      $('attack-name').textContent = '';
      return;
    }

    const dps = $('dps-value');
    const raw = $('raw-dps');
    const shot = $('per-shot');
    const fr = $('fire-rate');
    const dot = $('dot-dps');
    const drEl = $('armor-dr');
    const attackNameEl = $('attack-name');

    if (dps) {
      dps.textContent = DamageCalculator.fmtNum(result.effectiveDPS);
      gsap.set(dps, { scale: 1.2, opacity: 0.5 });
      gsap.to(dps, { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.7)' });
    }
    if (raw) raw.textContent = DamageCalculator.fmtNum(result.rawDPS);
    if (shot) shot.textContent = DamageCalculator.fmtNum(result.total);
    if (fr) fr.textContent = result.fireRate.toFixed(2);
    if (dot) dot.textContent = DamageCalculator.fmtNum(result.dotDPS);
    if (drEl) drEl.textContent = result.dr.toFixed(1) + '%';
    if (attackNameEl) attackNameEl.textContent = result.attackName || '';
    
    // 更新 TTK 显示
    const ttkEl = document.getElementById('ttk-value');
    if (ttkEl && result.ttk) {
      const queueTTK = result.queueTTK || result.ttk;
      const regions = result.ttkRegions || {};
      let regionText = '';
      if (regions.shield > 0) regionText += `护盾 ${DamageCalculator.fmtNum(regions.shield)} `;
      if (regions.armor > 0) regionText += `护甲 ${DamageCalculator.fmtNum(regions.armor)} `;
      if (regions.health > 0) regionText += `生命 ${DamageCalculator.fmtNum(regions.health)} `;
      if (regions.overguard > 0) regionText += `超宏 ${DamageCalculator.fmtNum(regions.overguard)} `;
      ttkEl.innerHTML = `${DamageCalculator.fmtTime(queueTTK)} <span style="font-size:0.65rem;color:var(--c-text-dim);">(模拟) ${regionText ? '<br><span style="font-size:0.6rem;">' + regionText + '</span>' : ''}</span>`;
    }
  },

  updateDamageBreakdown(breakdown) {
    const container = document.getElementById('damage-breakdown');
    if (!container) return;
    const total = Object.values(breakdown).reduce((s, v) => s + v, 0);
    if (total <= 0) {
      container.innerHTML = '<div class="empty-state"><div class="empty-state-text">选择武器和敌人开始计算</div></div>';
      return;
    }
    container.innerHTML = Object.entries(breakdown)
      .filter(([, v]) => v > 0)
      .sort(([, a], [, b]) => b - a)
      .map(([type, value]) => `
        <div class="chart-bar">
          <span class="chart-bar-label">${DamageCalculator.getName(type)}</span>
          <div class="chart-bar-track">
            <div class="chart-bar-fill" style="width: ${(value / total) * 100}%; background: ${DamageCalculator.getColor(type)}">
              ${DamageCalculator.fmtNum(value)}
            </div>
          </div>
        </div>
      `).join('');
  },

  updateStatusInfo(result) {
    const container = document.getElementById('status-info');
    if (!container) return;
    if (!result) { container.innerHTML = ''; return; }
    const procsPerSec = result.statusChance / 100 * result.fireRate;
    container.innerHTML = `
      <div class="stat-section">
        <h3>状态异常</h3>
        <div class="stat-row"><span class="stat-label">每秒触发</span><span class="stat-value">${procsPerSec.toFixed(2)}</span></div>
        <div class="stat-row"><span class="stat-label">DoT DPS</span><span class="stat-value">${DamageCalculator.fmtNum(result.dotDPS)}</span></div>
        <div class="stat-row"><span class="stat-label">暴击几率</span><span class="stat-value">${result.critChance.toFixed(1)}%</span></div>
        <div class="stat-row"><span class="stat-label">暴击倍率</span><span class="stat-value">${result.critDmg.toFixed(2)}x</span></div>
        <div class="stat-row"><span class="stat-label">多重射击</span><span class="stat-value">${result.ms.toFixed(2)}</span></div>
        <div class="stat-row"><span class="stat-label">弹丸数</span><span class="stat-value">${result.pellets}</span></div>
      </div>
    `;
    this.updateDetailedDamage(result);
  },

  // ═══════════════ 多攻击形态显示 ═══════════════

  updateMultiAttackDisplay(allResults) {
    const container = document.getElementById('multi-attack-results');
    if (!container) return;
    if (!allResults || allResults.length <= 0) {
      container.innerHTML = '';
      return;
    }

    const enemy = this.state.selectedEnemy;
    if (!enemy) return;
    const scaled = GameData.scaleEnemy(enemy, this.state.enemyLevel, this.state.steelPath, this.state.eximus);
    const armorDR = DamageCalculator.armorDR(scaled.armor);
    const healthMult = this.getFactionHealthMult(enemy.faction);
    const shieldMult = this.getFactionShieldMult(enemy.faction);

    container.innerHTML = allResults.map((result, index) => {
      const isActive = index === this.state.activeAttackIndex;
      const breakdown = result.breakdown || {};
      
      // 计算各区域伤害
      const totalRaw = Object.values(breakdown).reduce((s, v) => s + v, 0);
      const armorDmg = totalRaw * (1 - armorDR) * healthMult;
      const hpDmg = totalRaw * (1 - armorDR) * healthMult;
      const shieldDmg = scaled.shield > 0 ? totalRaw * shieldMult : 0;
      const overguardDmg = (scaled.overguard && scaled.overguard > 0) ? totalRaw * 0.5 : 0;

      return `
        <div class="attack-result ${isActive ? 'active' : ''}" 
             onclick="App.selectAttack(${index})"
             style="padding:12px;margin-bottom:8px;background:var(--c-card);border-radius:var(--r-sm);cursor:pointer;border:1px solid ${isActive ? 'var(--c-gold-bright)' : 'var(--c-border)'};">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
            <span style="font-weight:600;color:var(--c-text);">${result.attackName}</span>
            <span style="color:var(--c-gold-bright);font-weight:700;">${DamageCalculator.fmtNum(result.effectiveDPS)} DPS</span>
          </div>
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:4px;font-size:0.75rem;color:var(--c-text2);margin-bottom:8px;">
            <span>单发: ${DamageCalculator.fmtNum(result.total)}</span>
            <span>暴击: ${result.critChance.toFixed(1)}%</span>
            <span>TTK: ${DamageCalculator.fmtTime(result.ttk)}</span>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            <div style="flex:1;min-width:120px;padding:8px;background:rgba(255,107,107,0.1);border-radius:4px;border:1px solid rgba(255,107,107,0.2);">
              <div style="font-size:0.7rem;color:var(--c-red);margin-bottom:4px;">护甲</div>
              <div style="font-size:0.85rem;color:var(--c-text);font-weight:600;">${DamageCalculator.fmtNum(armorDmg)}</div>
              <div style="font-size:0.65rem;color:var(--c-text-dim);">减伤: ${(armorDR * 100).toFixed(1)}%</div>
            </div>
            <div style="flex:1;min-width:120px;padding:8px;background:rgba(255,107,107,0.1);border-radius:4px;border:1px solid rgba(255,107,107,0.2);">
              <div style="font-size:0.7rem;color:var(--c-red);margin-bottom:4px;">生命值</div>
              <div style="font-size:0.85rem;color:var(--c-text);font-weight:600;">${DamageCalculator.fmtNum(hpDmg)}</div>
            </div>
            ${scaled.shield > 0 ? `
            <div style="flex:1;min-width:120px;padding:8px;background:rgba(0,200,255,0.1);border-radius:4px;border:1px solid rgba(0,200,255,0.2);">
              <div style="font-size:0.7rem;color:var(--c-cyan);margin-bottom:4px;">护盾</div>
              <div style="font-size:0.85rem;color:var(--c-text);font-weight:600;">${DamageCalculator.fmtNum(shieldDmg)}</div>
            </div>` : ''}
            ${(scaled.overguard && scaled.overguard > 0) ? `
            <div style="flex:1;min-width:120px;padding:8px;background:rgba(234,179,8,0.1);border-radius:4px;border:1px solid rgba(234,179,8,0.2);">
              <div style="font-size:0.7rem;color:var(--c-gold-bright);margin-bottom:4px;">超宏防护</div>
              <div style="font-size:0.85rem;color:var(--c-text);font-weight:600;">${DamageCalculator.fmtNum(overguardDmg)}</div>
            </div>` : ''}
          </div>
          <div id="attack-detail-${index}" style="display:none;margin-top:8px;padding:8px;background:rgba(0,0,0,0.2);border-radius:4px;">
            <div style="font-size:0.7rem;color:var(--c-text-dim);margin-bottom:4px;">伤害分布详情</div>
            ${Object.entries(breakdown).filter(([,v]) => v > 0).map(([type, value]) => `
              <div style="display:flex;align-items:center;gap:6px;margin-bottom:2px;">
                <span style="width:8px;height:8px;border-radius:50%;background:${DamageCalculator.getColor(type)};display:inline-block;"></span>
                <span style="font-size:0.75rem;color:var(--c-text2);flex:1;">${DamageCalculator.getName(type)}</span>
                <span style="font-size:0.75rem;color:var(--c-text);">${DamageCalculator.fmtNum(value)}</span>
                <span style="font-size:0.65rem;color:var(--c-text-dim);">(${(value / totalRaw * 100).toFixed(1)}%)</span>
              </div>
            `).join('')}
          </div>
          <div style="display:flex;justify-content:space-between;margin-top:8px;">
            <span style="font-size:0.7rem;color:var(--c-text-dim);cursor:pointer;" onclick="event.stopPropagation();App.toggleAttackDetail(${index})">
              &#9660; 更多细节
            </span>
            <span style="font-size:0.7rem;color:var(--c-cyan);cursor:pointer;" onclick="event.stopPropagation();App.showQueueInfo(${index})">
              伤害队列详情
            </span>
          </div>
        </div>
      `;
    }).join('');
  },

  toggleAttackDetail(index) {
    const el = document.getElementById(`attack-detail-${index}`);
    if (el) {
      el.style.display = el.style.display === 'none' ? '' : 'none';
    }
  },

  // ═══════════════ 扩展伤害队列信息弹窗 ═══════════════

  showQueueInfo(attackIndex) {
    const popup = document.getElementById('queue-info-popup');
    const content = document.getElementById('queue-info-content');
    if (!popup || !content) return;

    const result = this.state.allAttackResults && this.state.allAttackResults[attackIndex];
    if (!result) return;

    const enemy = this.state.selectedEnemy;
    if (!enemy) return;

    const scaled = GameData.scaleEnemy(enemy, this.state.enemyLevel, this.state.steelPath, this.state.eximus);

    // Generate mock queue data for display
    const queueData = this.generateMockQueueData(result, scaled);

    content.innerHTML = `
      <div style="margin-bottom:12px;padding:8px;background:rgba(0,0,0,0.2);border-radius:4px;">
        <div style="font-size:0.85rem;color:var(--c-text);margin-bottom:4px;">${result.attackName}</div>
        <div style="font-size:0.75rem;color:var(--c-text2);">从一秒钟的随机攻击系列中获取的每秒伤害</div>
      </div>

      <div style="margin-bottom:12px;">
        <div style="font-size:0.8rem;font-weight:600;color:var(--c-text);margin-bottom:8px;">统计信息</div>
        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;">
          <div style="padding:8px;background:rgba(0,0,0,0.2);border-radius:4px;">
            <div style="font-size:0.7rem;color:var(--c-text2);">每秒伤害 (DPS)</div>
            <div style="font-size:1.1rem;font-weight:700;color:var(--c-gold-bright);">${DamageCalculator.fmtNum(result.effectiveDPS)}</div>
          </div>
          <div style="padding:8px;background:rgba(0,0,0,0.2);border-radius:4px;">
            <div style="font-size:0.7rem;color:var(--c-text2);">每发平均伤害（不含状态伤害）</div>
            <div style="font-size:1.1rem;font-weight:700;color:var(--c-text);">${DamageCalculator.fmtNum(result.total)}</div>
          </div>
          <div style="padding:8px;background:rgba(0,0,0,0.2);border-radius:4px;">
            <div style="font-size:0.7rem;color:var(--c-text2);">每发平均伤害（状态伤害）</div>
            <div style="font-size:1.1rem;font-weight:700;color:var(--c-text);">${DamageCalculator.fmtNum(result.dotDPS / result.fireRate)}</div>
          </div>
          <div style="padding:8px;background:rgba(0,0,0,0.2);border-radius:4px;">
            <div style="font-size:0.7rem;color:var(--c-text2);">子弹中位伤害（总计）</div>
            <div style="font-size:1.1rem;font-weight:700;color:var(--c-text);">${DamageCalculator.fmtNum(result.medianShot || result.total)}</div>
          </div>
        </div>
      </div>

      <div style="margin-bottom:12px;">
        <div style="font-size:0.8rem;font-weight:600;color:var(--c-text);margin-bottom:8px;">射击队列 (前20发)</div>
        <div style="max-height:300px;overflow-y:auto;">
          ${queueData.shots.slice(0, 20).map((shot, i) => `
            <div style="display:flex;align-items:center;gap:8px;padding:6px 8px;background:${i % 2 === 0 ? 'rgba(0,0,0,0.15)' : 'rgba(0,0,0,0.05)'};border-radius:4px;margin-bottom:2px;">
              <div style="width:30px;font-size:0.7rem;color:var(--c-text-dim);">#${i + 1}</div>
              <div style="width:50px;font-size:0.7rem;color:var(--c-text2);">${shot.timestamp.toFixed(2)}s</div>
              <div style="flex:1;font-size:0.8rem;color:var(--c-text);font-weight:600;">${DamageCalculator.fmtNum(shot.damage)}</div>
              <div style="font-size:0.7rem;color:var(--c-text2);">暴击: ${shot.critMult}x</div>
              <div style="display:flex;gap:2px;">
                ${shot.statusIcons.map(icon => `<span style="font-size:0.65rem;">${icon}</span>`).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <div>
        <div style="font-size:0.8rem;font-weight:600;color:var(--c-text);margin-bottom:8px;">图例</div>
        <div style="display:flex;flex-wrap:wrap;gap:8px;font-size:0.7rem;color:var(--c-text2);">
          <span>命中数: ${queueData.totalHits}</span>
          <span>打击伤害: ${DamageCalculator.fmtNum(queueData.avgStrikeDmg)}</span>
          <span>暴击倍率: ${queueData.avgCritMult}x</span>
          <span>护甲减伤: ${(queueData.avgArmorDR * 100).toFixed(1)}%</span>
          <span>连击数: ${queueData.comboCount}</span>
          <span>敌人状态: ${queueData.enemyStatusCount}</span>
        </div>
      </div>
    `;

    popup.style.display = 'flex';
  },

  closeQueueInfo() {
    const popup = document.getElementById('queue-info-popup');
    if (popup) popup.style.display = 'none';
  },

  generateMockQueueData(result, enemy) {
    const shots = [];
    const fireRate = result.fireRate || 10;
    const interval = 1 / fireRate;
    const totalDamage = result.total || 100;
    const critChance = (result.critChance || 25) / 100;
    const critMult = result.critDmg || 2;

    for (let i = 0; i < 30; i++) {
      const isCrit = Math.random() < critChance;
      const damage = totalDamage * (isCrit ? critMult : 1);
      const statusIcons = [];
      if (Math.random() < 0.3) statusIcons.push('🔥');
      if (Math.random() < 0.2) statusIcons.push('❄️');
      if (Math.random() < 0.15) statusIcons.push('⚡');

      shots.push({
        timestamp: i * interval,
        damage: damage,
        critMult: isCrit ? critMult.toFixed(1) : '1.0',
        statusIcons: statusIcons,
        statusDmg: isCrit ? damage * 0.3 : 0
      });
    }

    return {
      shots: shots,
      totalHits: 30,
      avgStrikeDmg: totalDamage,
      avgCritMult: critMult.toFixed(1),
      avgArmorDR: result.dr / 100 || 0,
      comboCount: 1,
      enemyStatusCount: 0
    };
  },

  // ═══════════════ 详细伤害分段 ═══════════════

  updateDetailedDamage(result) {
    if (!result || !this.state.selectedEnemy) return;
    const enemy = this.state.selectedEnemy;
    const scaled = GameData.scaleEnemy(enemy, this.state.enemyLevel, this.state.steelPath, this.state.eximus);
    const breakdown = result.breakdown || {};
    const faction = enemy.faction;

    // 护甲伤害
    const armorDR = DamageCalculator.armorDR(scaled.armor);
    const armorContainer = document.getElementById('armor-damage-breakdown');
    if (armorContainer) {
      const totalRaw = Object.values(breakdown).reduce((s, v) => s + v, 0);
      const armorDmg = totalRaw * (1 - armorDR);
      const factionMult = this.getFactionHealthMult(faction);
      const effectiveArmorDmg = armorDmg * factionMult;
      armorContainer.innerHTML = `
        <div class="stat-row"><span class="stat-label">原始伤害</span><span class="stat-value">${DamageCalculator.fmtNum(totalRaw)}</span></div>
        <div class="stat-row"><span class="stat-label">护甲减伤 (${(armorDR * 100).toFixed(1)}%)</span><span class="stat-value">${DamageCalculator.fmtNum(armorDmg)}</span></div>
        <div class="stat-row"><span class="stat-label">阵营抗性倍率</span><span class="stat-value">${factionMult.toFixed(2)}x</span></div>
        <div class="stat-row"><span class="stat-label">有效护甲伤害</span><span class="stat-value" style="color:var(--c-orange);">${DamageCalculator.fmtNum(effectiveArmorDmg)}</span></div>
        ${Object.entries(breakdown).filter(([,v]) => v > 0).map(([type, value]) => `
          <div class="stat-row"><span class="stat-label" style="display:flex;align-items:center;gap:4px;">
            <span style="width:8px;height:8px;border-radius:50%;background:${DamageCalculator.getColor(type)};display:inline-block;"></span>
            ${DamageCalculator.getName(type)}
          </span><span class="stat-value">${DamageCalculator.fmtNum(value * (1 - armorDR) * this.getTypeFactionMult(type, faction, 'health'))}</span></div>
        `).join('')}
      `;
    }

    // 生命值伤害
    const hpContainer = document.getElementById('hp-damage-breakdown');
    if (hpContainer) {
      const totalRaw = Object.values(breakdown).reduce((s, v) => s + v, 0);
      const hpDmg = totalRaw * (1 - armorDR);
      const factionMult = this.getFactionHealthMult(faction);
      const effectiveHpDmg = hpDmg * factionMult;
      hpContainer.innerHTML = `
        <div class="stat-row"><span class="stat-label">原始伤害</span><span class="stat-value">${DamageCalculator.fmtNum(totalRaw)}</span></div>
        <div class="stat-row"><span class="stat-label">护甲减伤后</span><span class="stat-value">${DamageCalculator.fmtNum(hpDmg)}</span></div>
        <div class="stat-row"><span class="stat-label">阵营抗性倍率</span><span class="stat-value">${factionMult.toFixed(2)}x</span></div>
        <div class="stat-row"><span class="stat-label">有效生命值伤害</span><span class="stat-value" style="color:var(--c-red);">${DamageCalculator.fmtNum(effectiveHpDmg)}</span></div>
        ${Object.entries(breakdown).filter(([,v]) => v > 0).map(([type, value]) => `
          <div class="stat-row"><span class="stat-label" style="display:flex;align-items:center;gap:4px;">
            <span style="width:8px;height:8px;border-radius:50%;background:${DamageCalculator.getColor(type)};display:inline-block;"></span>
            ${DamageCalculator.getName(type)}
          </span><span class="stat-value">${DamageCalculator.fmtNum(value * (1 - armorDR) * this.getTypeFactionMult(type, faction, 'health'))}</span></div>
        `).join('')}
      `;
    }

    // 护盾伤害
    const shieldContainer = document.getElementById('shield-damage-breakdown');
    const shieldSection = document.getElementById('shield-damage-section');
    if (shieldContainer && shieldSection) {
      if (scaled.shield > 0) {
        shieldSection.style.display = '';
        const shieldMult = this.getFactionShieldMult(faction);
        const totalRaw = Object.values(breakdown).reduce((s, v) => s + v, 0);
        const shieldDmg = totalRaw * shieldMult;
        shieldContainer.innerHTML = `
          <div class="stat-row"><span class="stat-label">原始伤害</span><span class="stat-value">${DamageCalculator.fmtNum(totalRaw)}</span></div>
          <div class="stat-row"><span class="stat-label">护盾抗性倍率</span><span class="stat-value">${shieldMult.toFixed(2)}x</span></div>
          <div class="stat-row"><span class="stat-label">有效护盾伤害</span><span class="stat-value" style="color:var(--c-cyan);">${DamageCalculator.fmtNum(shieldDmg)}</span></div>
          ${Object.entries(breakdown).filter(([,v]) => v > 0).map(([type, value]) => `
            <div class="stat-row"><span class="stat-label" style="display:flex;align-items:center;gap:4px;">
              <span style="width:8px;height:8px;border-radius:50%;background:${DamageCalculator.getColor(type)};display:inline-block;"></span>
              ${DamageCalculator.getName(type)}
            </span><span class="stat-value">${DamageCalculator.fmtNum(value * this.getTypeFactionMult(type, faction, 'shield'))}</span></div>
          `).join('')}
        `;
      } else {
        shieldSection.style.display = 'none';
      }
    }

    // 超宏防护
    const overguardContainer = document.getElementById('overguard-damage-breakdown');
    const overguardSection = document.getElementById('overguard-damage-section');
    if (overguardContainer && overguardSection) {
      if (scaled.overguard && scaled.overguard > 0) {
        overguardSection.style.display = '';
        const totalRaw = Object.values(breakdown).reduce((s, v) => s + v, 0);
        overguardContainer.innerHTML = `
          <div class="stat-row"><span class="stat-label">原始伤害</span><span class="stat-value">${DamageCalculator.fmtNum(totalRaw)}</span></div>
          <div class="stat-row"><span class="stat-label">有效超宏防护伤害</span><span class="stat-value" style="color:var(--c-purple);">${DamageCalculator.fmtNum(totalRaw)}</span></div>
        `;
      } else {
        overguardSection.style.display = 'none';
      }
    }
  },

  getFactionHealthMult(faction) {
    const res = GameData.FACTION_RESISTANCES[faction];
    if (!res) return 1;
    return 1;
  },

  getFactionShieldMult(faction) {
    const res = GameData.FACTION_RESISTANCES[faction];
    if (!res) return 1;
    if (res.Magnetic) return res.Magnetic;
    return 1;
  },

  getTypeFactionMult(type, faction, healthType) {
    const res = GameData.FACTION_RESISTANCES[faction];
    if (!res || !res[type]) return 1;
    return res[type];
  },

  // ═══════════════ 蒙特卡洛模拟 ═══════════════

  runSimulation() {
    if (!this.state.selectedWeapon || !this.state.selectedEnemy) {
      this.showToast('请先选择武器和敌人');
      return;
    }

    const simBtn = document.getElementById('sim-btn');
    if (simBtn) {
      simBtn.disabled = true;
      simBtn.textContent = '模拟中...';
    }

    const weapon = this.state.selectedWeapon;
    const mods = this.state.mods.map(name => name ? GameData.mods.find(m => m.name === name) : null).filter(Boolean);
    const enemy = this.state.selectedEnemy;
    
    const options = {
      headshot: this.state.options.headshot,
      steelPath: this.state.steelPath,
      eximus: this.state.eximus,
      abilityStrength: this.state.options.abilityStrength,
      comboMultiplier: this.state.options.comboMultSlider,
      statusStacks: {},
      isHeavy: this.state.options.heavyAttack,
      isMultiplicativeWeakCC: false,
      rhinoRoar: this.state.abilities.rhinoRoar,
      mirageEclipse: this.state.abilities.mirageEclipse,
      xakuWhisper: this.state.abilities.xakuWhisper,
      toxicLash: this.state.abilities.toxicLash,
      grendelNourish: this.state.abilities.grendelNourish,
      kullervoCrit: this.state.abilities.kullervoCrit,
      harrowCrit: this.state.abilities.harrowCrit,
      madurai: this.state.options.madurai,
    };

    if (this.state.options.conditionalModsAlways) {
      mods.forEach(mod => {
        if (mod && mod.action && mod.action.WITH_COND) {
          Object.entries(mod.action.WITH_COND).forEach(([key, value]) => {
            if (typeof value === 'number') {
              if (key === 'crit_chance') options.comboMultiplier = options.comboMultiplier || 1;
              if (key === 'status_chance') options.statusStacks = options.statusStacks || {};
              if (key === 'speed') options.comboMultiplier = options.comboMultiplier || 1;
            }
          });
        }
      });
    }

    // 运行模拟并动态显示
    const iterations = 100;
    const container = document.getElementById('simulation-results');
    if (!container) return;
    
    container.innerHTML = `
      <div class="stat-section">
        <h3>蒙特卡洛模拟</h3>
        <div id="sim-progress" style="margin-bottom:8px;">
          <div style="display:flex;justify-content:space-between;font-size:0.75rem;color:var(--c-text2);margin-bottom:4px;">
            <span>进度</span>
            <span id="sim-progress-text">0 / ${iterations}</span>
          </div>
          <div style="height:4px;background:var(--c-card);border-radius:2px;overflow:hidden;">
            <div id="sim-progress-bar" style="height:100%;width:0%;background:var(--c-accent);transition:width 0.1s;"></div>
          </div>
        </div>
        <div id="sim-current" style="padding:8px;background:var(--c-card);border-radius:4px;margin-bottom:8px;">
          <div style="font-size:0.7rem;color:var(--c-text-dim);margin-bottom:4px;">当前模拟</div>
          <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:4px;font-size:0.8rem;">
            <span style="color:var(--c-text2);">单发: <span id="sim-cur-dmg" style="color:var(--c-text);">-</span></span>
            <span style="color:var(--c-text2);">DPS: <span id="sim-cur-dps" style="color:var(--c-gold-bright);">-</span></span>
          </div>
        </div>
        <div id="sim-stats" style="display:none;">
          <div style="font-size:0.75rem;color:var(--c-text-dim);margin-bottom:4px;">统计结果</div>
        </div>
      </div>
    `;

    // 异步模拟，逐步更新UI
    const allDamage = [];
    const allDPS = [];
    let i = 0;
    
    const runNext = () => {
      if (i >= iterations) {
        this.showFinalSimStats(allDamage, allDPS, iterations);
        if (simBtn) {
          simBtn.disabled = false;
          simBtn.textContent = '运行蒙特卡洛模拟 (100次)';
        }
        return;
      }

      const result = DamageCalculator.runMC(weapon, mods, enemy, options, 1);
      if (result && result.damage) {
        allDamage.push(result.damage.avg);
        allDPS.push(result.effectiveDPS.avg);
        
        // 更新进度
        const progress = ((i + 1) / iterations * 100).toFixed(0);
        const progressBar = document.getElementById('sim-progress-bar');
        const progressText = document.getElementById('sim-progress-text');
        if (progressBar) progressBar.style.width = progress + '%';
        if (progressText) progressText.textContent = `${i + 1} / ${iterations}`;
        
        // 更新当前模拟值
        const curDmg = document.getElementById('sim-cur-dmg');
        const curDps = document.getElementById('sim-cur-dps');
        if (curDmg) curDmg.textContent = DamageCalculator.fmtNum(result.damage.avg);
        if (curDps) curDps.textContent = DamageCalculator.fmtNum(result.effectiveDPS.avg);
        
        // GSAP动画
        if (typeof gsap !== 'undefined') {
          gsap.from('#sim-cur-dmg', { scale: 1.2, duration: 0.15, ease: 'back.out(1.7)' });
          gsap.from('#sim-cur-dps', { scale: 1.2, duration: 0.15, ease: 'back.out(1.7)' });
        }
      }
      
      i++;
      setTimeout(runNext, 20);
    };
    
    runNext();
  },

  showFinalSimStats(allDamage, allDPS, iterations) {
    const statsEl = document.getElementById('sim-stats');
    if (!statsEl) return;
    
    const sortedDmg = [...allDamage].sort((a, b) => a - b);
    const sortedDPS = [...allDPS].sort((a, b) => a - b);
    
    const avgDmg = allDamage.reduce((s, v) => s + v, 0) / allDamage.length;
    const medianDmg = sortedDmg[Math.floor(sortedDmg.length / 2)];
    const minDmg = sortedDmg[0];
    const maxDmg = sortedDmg[sortedDmg.length - 1];
    
    const avgDPS = allDPS.reduce((s, v) => s + v, 0) / allDPS.length;
    const medianDPS = sortedDPS[Math.floor(sortedDPS.length / 2)];
    const minDPS = sortedDPS[0];
    const maxDPS = sortedDPS[sortedDPS.length - 1];
    
    statsEl.style.display = '';
    statsEl.innerHTML = `
      <div style="padding:8px;background:var(--c-card);border-radius:4px;">
        <div style="font-size:0.75rem;color:var(--c-text-dim);margin-bottom:8px;">统计结果 (${iterations} 次迭代)</div>
        <div class="stat-row"><span class="stat-label">单发伤害</span><span class="stat-value">${DamageCalculator.fmtNum(minDmg)} ~ ${DamageCalculator.fmtNum(maxDmg)}<br>平均: ${DamageCalculator.fmtNum(avgDmg)}<br>中位数: ${DamageCalculator.fmtNum(medianDmg)}</span></div>
        <div class="stat-row"><span class="stat-label">有效 DPS</span><span class="stat-value">${DamageCalculator.fmtNum(minDPS)} ~ ${DamageCalculator.fmtNum(maxDPS)}<br>平均: ${DamageCalculator.fmtNum(avgDPS)}<br>中位数: ${DamageCalculator.fmtNum(medianDPS)}</span></div>
      </div>
    `;
    
    if (typeof gsap !== 'undefined') {
      gsap.from(statsEl, { opacity: 0, y: 10, duration: 0.3 });
    }
  },

  // ═══════════════ 重置与导出 ═══════════════

  resetAll() {
    this.state.selectedWeaponName = null;
    this.state.selectedWeapon = null;
    this.state.selectedEnemyName = null;
    this.state.selectedEnemy = null;
    this.state.enemyLevel = 30;
    this.state.steelPath = false;
    this.state.eximus = false;
    this.state.mods = Array(10).fill(null);
    this.state.modRanks = Array(10).fill(0);
    this.state.currentCapacity = 0;
    this.state.activeAttackIndex = 0;
    this.state.dpsResult = null;
    this.state.options = {
      headshot: false, steelPath: false, eximus: false, stealth: false, heavyAttack: false,
      comboMultEnabled: false, comboMultSlider: 1,
      lightAttackComboEnabled: false, lightAttackComboSlider: 1,
      sniperComboEnabled: false, sniperComboSlider: 1,
      abilityStrength: 100, externalVirus: false, virusStacks: 0,
      armorStrip: 0, manualStatusCount: false, manualStatusValue: 0,
      conditionOverload: false, madurai: false, mergeAttacks: false,
      conditionalModsAlways: false, customStats: {}
    };
    this.state.abilities = {
      rhinoRoar: false, mirageEclipse: false, xakuWhisper: false,
      sarynSpores: false, grendelNourish: false, kullervoCrit: false, harrowCrit: false
    };
    this.state.riven = { active: false, weaponType: '', positives: [], positiveValues: [], negative: null, negativeValue: 0, rank: 0 };
    this.state.warframeMods = Array(4).fill(null);
    this.state.warframeModRanks = Array(4).fill(0);
    this.state.incarnonEvo = [null, null, null, null];
    this.state.selectedStanceName = null;
    this.state.selectedStanceAttackIndex = 0;

    document.getElementById('enemy-level').value = 30;
    document.getElementById('weapon-search').value = '';
    document.getElementById('enemy-search').value = '';
    document.querySelectorAll('.option-item').forEach(i => i.classList.remove('active'));
    document.querySelectorAll('.ability-toggle').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.checkbox-option').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.weapon-item').forEach(item => item.classList.remove('active'));
    document.getElementById('weapon-info').innerHTML = '';
    document.getElementById('enemy-info').innerHTML = '';
    this.renderModSlots();
    this.renderWarframeModSlots();
    this.renderWeaponList();
    this.renderEnemyList();

    const incarnonSection = document.getElementById('incarnon-evo-section');
    if (incarnonSection) incarnonSection.style.display = 'none';
    const stanceSection = document.getElementById('stance-section');
    if (stanceSection) stanceSection.style.display = 'none';

    const comboSlider = document.getElementById('combo-slider');
    if (comboSlider) { comboSlider.value = 1; }
    const comboValue = document.getElementById('combo-value');
    if (comboValue) comboValue.textContent = '1';

    this.updateDPSDisplay(null);
    document.getElementById('damage-breakdown').innerHTML = '';
    document.getElementById('status-info').innerHTML = '';

    const conditionalAlways = document.querySelector('[data-key="conditionalModsAlways"]');
    if (conditionalAlways) conditionalAlways.classList.add('active');
  },

  exportBuild() {
    if (!this.state.selectedWeapon) return;
    const build = {
      weapon: this.state.selectedWeaponName,
      enemy: this.state.selectedEnemyName,
      level: this.state.enemyLevel,
      steelPath: this.state.steelPath,
      mods: this.state.mods.filter(m => m !== null).map(m => m.name),
      options: { ...this.state.options },
      abilities: { ...this.state.abilities },
      timestamp: new Date().toISOString()
    };
    const str = JSON.stringify(build, null, 2);
    const blob = new Blob([str], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `warframe-build-${this.state.selectedWeaponName.replace(/\s+/g, '-')}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },

  // ═══════════════ 动画 ═══════════════

  initAnimations() {
    if (typeof gsap === 'undefined') return;
    gsap.set('.panel', { y: 30, opacity: 0 });
    gsap.to('.panel', { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out' });
    gsap.set('.dps-display', { scale: 0.9, opacity: 0 });
    gsap.to('.dps-display', { scale: 1, opacity: 1, duration: 0.8, ease: 'elastic.out(1, 0.5)' });
    gsap.set('.header', { y: -20, opacity: 0 });
    gsap.to('.header', { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' });
  },

  createParticles() {
    const container = document.querySelector('.bg-particles');
    if (!container) return;
    for (let i = 0; i < 50; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.animationDelay = Math.random() * 8 + 's';
      p.style.animationDuration = (6 + Math.random() * 4) + 's';
      container.appendChild(p);
    }
  }
};

document.addEventListener('DOMContentLoaded', () => App.init());
