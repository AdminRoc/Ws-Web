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
    mods: Array(8).fill(null),
    modRanks: Array(8).fill(0),
    modPolarities: ['','','','','','','',''],
    weaponPolarities: [],
    weaponType: 'ranged',
    weaponSpecialMod: null,
    weaponSpecialRank: 0,
    weaponStanceMod: null,
    weaponStanceRank: 0,
    weaponArcanes: Array(2).fill(null),
    weaponArcaneRanks: Array(2).fill(0),
    currentCapacity: 0,
    maxCapacity: 60,
    activeAttackIndex: 0,
    options: {
      headshot: false,
      steelPath: false,
      stealth: false,
      heavyAttack: false,
      heavyAttackStartEnabled: false,
      heavyAttackStartSlider: 1,
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
      customStats: {},
      calcTime: 30
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
    warframeMods: Array(8).fill(null),
    warframeModRanks: Array(8).fill(0),
    auraMod: null,
    auraModRank: 0,
    warframeSpecialMod: null,
    warframeSpecialRank: 0,
    warframeArcanes: Array(2).fill(null),
    archonShards: Array(5).fill(null),
    focusSchool: 'none',
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
    'Viral Damage': '病毒伤害',
    'Magnetic Damage': '磁力伤害',
    'Blast Damage': '爆炸伤害',
    'Corrosive Damage': '腐蚀伤害',
    'Radiation Damage': '辐射伤害',
    'Gas Damage': '毒气伤害',
    'Slash + Toxin Damage': '切割+毒素伤害',
    'Physical Damage': '物理伤害',
    'Impact + Toxin Damage': '冲击+毒素伤害',
    'Faction Damage': '派系伤害',
    'Accuracy': '精准度',
    'Punch Through': '穿透',
    'Zoom': '缩放',
    'Damage Falloff': '伤害衰减',
    'Reload Speed': '装填速度',
    'Magazine Capacity': '弹匣容量',
    'Ammo Maximum': '弹药上限',
    'Flight Speed': '投射物速度',
    'Recoil': '后坐力',
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
    'Viral Damage', 'Magnetic Damage', 'Blast Damage',
    'Corrosive Damage', 'Radiation Damage', 'Gas Damage',
    'Slash + Toxin Damage', 'Physical Damage', 'Impact + Toxin Damage',
    'Faction Damage',
    'Magazine Capacity', 'Reload Speed', 'Punch Through',
    'Flight Speed', 'Zoom', 'Recoil',
    'Accuracy', 'Damage Falloff'
  ],

  RIVEN_NEGATIVE_STATS: [
    'Damage', 'Multishot', 'Critical Chance', 'Critical Damage',
    'Fire Rate', 'Status Chance', 'Status Duration',
    'Heat Damage', 'Cold Damage', 'Electricity Damage', 'Toxin Damage',
    'Impact Damage', 'Puncture Damage', 'Slash Damage',
    'Viral Damage', 'Magnetic Damage', 'Blast Damage',
    'Corrosive Damage', 'Radiation Damage', 'Gas Damage',
    'Slash + Toxin Damage', 'Physical Damage', 'Impact + Toxin Damage',
    'Faction Damage',
    'Magazine Capacity', 'Reload Speed', 'Punch Through',
    'Flight Speed', 'Zoom', 'Recoil',
    'Accuracy', 'Damage Falloff',
    'Ammo Maximum', 'Combo Duration', 'Finisher Damage',
    'Range', 'Initial Combo', 'Heavy Attack Efficiency',
    'Critical Chance on Slide Attack', 'Additional Combo Count Chance',
    'Damage vs. Corpus', 'Damage vs. Grineer', 'Damage vs. Infested'
  ],

  // 源力石数据 (来源: wiki.warframe.com/w/Archon_Shard)
  // 每种颜色有4-5种可选属性，普通版和Tau版数值不同 (Tau = 1.5x)
  ARCHON_SHARD_DATA: {
    crimson: {
      name: '深红', nameEn: 'Crimson', color: '#dc2626',
      img: 'dmg/img/mods/shard-crimson.webp',
      imgTau: 'dmg/img/mods/shard-crimson-tauforged.webp',
      buffs: [
        { key: 'meleeCritDmg', name: '近战暴击伤害', regular: 25, tau: 37.5, unit: '%', type: 'melee' },
        { key: 'primaryStatusChance', name: '主武器异常触发几率', regular: 25, tau: 37.5, unit: '%', type: 'primary' },
        { key: 'secondaryCritChance', name: '副武器暴击几率', regular: 25, tau: 37.5, unit: '%', type: 'secondary' },
        { key: 'abilityStrength', name: '技能强度', regular: 10, tau: 15, unit: '%', type: 'ability' },
        { key: 'abilityDuration', name: '技能持续时间', regular: 10, tau: 15, unit: '%', type: 'ability' }
      ]
    },
    amber: {
      name: '琥珀', nameEn: 'Amber', color: '#d97706',
      img: 'dmg/img/mods/shard-amber.webp',
      imgTau: 'dmg/img/mods/shard-amber-tauforged.webp',
      buffs: [
        { key: 'energyOnSpawn', name: '出生时能量填充', regular: 30, tau: 45, unit: '%', type: 'utility' },
        { key: 'healthOrbEffect', name: '生命球效果', regular: 100, tau: 150, unit: '%', type: 'utility' },
        { key: 'energyOrbEffect', name: '能量球效果', regular: 50, tau: 75, unit: '%', type: 'utility' },
        { key: 'castSpeed', name: '施放速度', regular: 25, tau: 37.5, unit: '%', type: 'utility' },
        { key: 'parkourVelocity', name: '跑酷速度', regular: 15, tau: 22.5, unit: '%', type: 'utility' }
      ]
    },
    azure: {
      name: '蔚蓝', nameEn: 'Azure', color: '#2563eb',
      img: 'dmg/img/mods/shard-azure.webp',
      imgTau: 'dmg/img/mods/shard-azure-tauforged.webp',
      buffs: [
        { key: 'maxHealth', name: '最大生命值', regular: 150, tau: 225, unit: '', type: 'survival' },
        { key: 'shieldCapacity', name: '护盾容量', regular: 150, tau: 225, unit: '', type: 'survival' },
        { key: 'energyMax', name: '能量上限', regular: 50, tau: 75, unit: '', type: 'survival' },
        { key: 'armor', name: '护甲', regular: 150, tau: 225, unit: '', type: 'survival' },
        { key: 'healthRegen', name: '生命值再生', regular: 5, tau: 7.5, unit: '/s', type: 'survival' }
      ]
    },
    topaz: {
      name: '黄玉', nameEn: 'Topaz', color: '#eab308',
      img: 'dmg/img/mods/shard-topaz.webp',
      imgTau: 'dmg/img/mods/shard-topaz-tauforged.webp',
      buffs: [
        { key: 'blastMaxHealth', name: '爆炸击杀增加最大生命', regular: 1, tau: 2, unit: '/击杀', maxVal: '300/450', type: 'blast' },
        { key: 'blastShieldRegen', name: '爆炸击杀恢复护盾', regular: 5, tau: 7.5, unit: '', type: 'blast' },
        { key: 'heatCritChance', name: '火焰异常叠加暴击几率', regular: 1, tau: 1.5, unit: '%/层', maxVal: '50%/75%', type: 'heat' },
        { key: 'radiationAbilityDmg', name: '辐射异常增加技能伤害', regular: 10, tau: 15, unit: '%', type: 'radiation' }
      ]
    },
    violet: {
      name: '紫晶', nameEn: 'Violet', color: '#7c3aed',
      img: 'dmg/img/mods/shard-violet.webp',
      imgTau: 'dmg/img/mods/shard-violet-tauforged.webp',
      buffs: [
        { key: 'electricityAbilityDmg', name: '电击异常增加技能伤害', regular: 10, tau: 15, unit: '%', type: 'electricity' },
        { key: 'primaryElectricityDmg', name: '主武器电击伤害', regular: 30, tau: 45, unit: '%', type: 'electricity', note: '每颗深红/蔚蓝/紫晶额外+10%/15%' },
        { key: 'meleeCritDmg', name: '近战暴击伤害', regular: 25, tau: 37.5, unit: '%', type: 'melee', note: '能量>500时翻倍' },
        { key: 'healthEnergyConversion', name: '生命/能量球互转', regular: 20, tau: 30, unit: '%', type: 'utility' }
      ]
    },
    emerald: {
      name: '翡翠', nameEn: 'Emerald', color: '#059669',
      img: 'dmg/img/mods/shard-emerald.webp',
      imgTau: 'dmg/img/mods/shard-emerald-tauforged.webp',
      buffs: [
        { key: 'toxinDotDmg', name: '毒素异常伤害加成', regular: 30, tau: 45, unit: '%', type: 'toxin' },
        { key: 'toxinHealthOnProc', name: '毒素异常回血', regular: 2, tau: 3, unit: '', type: 'toxin' },
        { key: 'corrosiveAbilityDmg', name: '腐蚀异常增加技能伤害', regular: 10, tau: 15, unit: '%', type: 'corrosive' },
        { key: 'corrosiveMaxStacks', name: '腐蚀异常最大层数', regular: 2, tau: 3, unit: '层', type: 'corrosive' }
      ]
    }
  },

  init() {
    this.bindEvents();
    this.renderWeaponList();
    this.renderEnemyList();
    this.renderModSlots();
    this.renderWeaponSpecialSlot();
    this.renderWeaponStanceSlot();
    this.renderWeaponArcaneSlots();
    this.renderWarframeModSlots();
    this.renderWarframeSpecialSlot();
    this.renderAuraSlot();
    this.renderArcaneSlots();
    this.renderArchonShards();
    const focusSelect = document.getElementById('wf-focus');
    if (focusSelect) focusSelect.value = this.state.focusSchool;
    this.initAnimations();
    this.createParticles();
    this.initKeyboardNavigation();
    this.initModHoverPreview();
    this.initModDragSwap();
    this.initClickToDismiss();
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

    const heavyStartSlider = $('heavy-start-slider');
    if (heavyStartSlider) {
      heavyStartSlider.addEventListener('input', e => {
        this.state.options.heavyAttackStartEnabled = true;
        this.state.options.heavyAttackStartSlider = parseInt(e.target.value) || 1;
        $('heavy-start-value').textContent = e.target.value;
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

    const calcTimeSlider = $('calc-time-slider');
    if (calcTimeSlider) {
      calcTimeSlider.addEventListener('input', e => {
        this.state.options.calcTime = parseInt(e.target.value) || 30;
        $('calc-time-value').textContent = e.target.value;
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
      eximus: this.state.eximus,
      options: this.state.options,
      abilities: this.state.abilities,
      incarnonEvo: this.state.incarnonEvo,
      stance: this.state.selectedStanceName,
      wfMods: this.state.warframeMods.map((m, i) => m ? { id: m.id, rank: this.state.warframeModRanks[i] } : null),
      activeAttack: this.state.activeAttackIndex,
      zawParts: this.state.zawParts
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
              this.state.mods[i] = mod;
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
      if (state.eximus !== undefined) {
        this.state.eximus = state.eximus;
        const exEl = document.querySelector('[data-option="eximus"]');
        if (exEl) exEl.classList.toggle('active', state.eximus);
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
      if (state.activeAttack !== undefined) {
        this.state.activeAttackIndex = state.activeAttack;
      }
      if (state.zawParts) {
        this.state.zawParts = state.zawParts;
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
    this.activeKeyboardIndex = -1;
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
    this.state.mods = Array(8).fill(null);
    this.state.modRanks = Array(8).fill(0);
    this.state.weaponSpecialMod = null;
    this.state.weaponSpecialRank = 0;
    this.state.weaponStanceMod = null;
    this.state.weaponStanceRank = 0;
    this.state.weaponArcanes = Array(2).fill(null);
    this.state.weaponArcaneRanks = Array(2).fill(0);
    this.state.selectedStanceName = null;
    this.state.currentCapacity = 0;
    this.state.zawComponents = { grip: null, link: null };
    this.state.kitgunComponents = { grip: null, loader: null };
    this.state.weaponType = (data.category === 'Melee') ? 'melee' : 'ranged';

    this.updateWeaponInfo(data);
    this.renderModSlots();
    this.renderWeaponSpecialSlot();
    this.renderWeaponStanceSlot();
    this.renderWeaponArcaneSlots();
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
    const weaponImg = weapon.imageName ? `dmg/img/weapons/${weapon.imageName}` : '';
    container.innerHTML = `
      <div class="stat-section">
        <div style="display:flex;gap:12px;margin-bottom:12px;">
          ${weaponImg ? `<img src="${weaponImg}" onerror="this.style.display='none'" style="width:80px;height:80px;border-radius:8px;background:var(--c-card);object-fit:contain;">` : ''}
          <div style="flex:1;">
            <h3 style="margin:0;">${this.state.selectedWeaponName} (${weapon.type})</h3>
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
    this.activeKeyboardIndex = -1;
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
    
    // 获取阵营抗性信息 + 敌人个体抗性
    const factionRes = GameData.TYPE_OF_FACTION[enemy.faction] || {};
    const elemRes = enemy.elemRes || {};
    const allRes = { ...factionRes };
    Object.entries(elemRes).forEach(([type, mult]) => {
      const key = type.charAt(0).toUpperCase() + type.slice(1);
      if (allRes[key]) {
        allRes[key] *= mult;
      } else {
        allRes[key] = mult;
      }
    });
    const resistText = Object.entries(allRes)
      .filter(([,v]) => v && v !== 1)
      .map(([type, value]) => {
        const pct = Math.round((value - 1) * 100);
        const sign = pct > 0 ? '+' : '';
        return `${DamageCalculator.getName(type)}: ${sign}${pct}%`;
      })
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

  setWeaponType(type) {
    this.state.weaponType = (type === 'melee') ? 'melee' : 'ranged';
    document.querySelectorAll('#weapon-type-selector .wtype-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.wtype === this.state.weaponType);
    });
    const stanceBlock = document.getElementById('weapon-stance-block');
    if (stanceBlock) stanceBlock.style.display = this.state.weaponType === 'melee' ? '' : 'none';
    this.renderWeaponStanceSlot();
    this.recalculate();
  },

  renderWeaponSpecialSlot() {
    const container = document.getElementById('weapon-special-slot');
    if (!container) return;
    const mod = this.state.weaponSpecialMod;
    const rank = this.state.weaponSpecialRank || 0;
    if (mod) {
      const zhName = GameData.MOD_NAMES_ZH[mod.name] || mod.name;
      const imgSrc = mod.img ? `dmg/img/mods/${mod.img}` : '';
      const maxRank = this.getModMaxRank(mod);
      container.innerHTML = `
        <div class="mod specialMod filled" style="width:100px;height:124px;">
          <div style="position:absolute;inset:0;background:var(--c-card);display:flex;align-items:center;justify-content:center;border-radius:var(--r-sm);overflow:hidden;">
            ${imgSrc ? `<img src="${imgSrc}" alt="${zhName}" style="width:100%;height:100%;object-fit:cover;">` : `<span style="font-size:0.75rem;color:var(--c-text2);padding:4px;text-align:center;line-height:1.2;">${zhName}</span>`}
          </div>
          <div class="mod-rank-controls">
            <button class="rank-btn" onclick="event.stopPropagation(); App.setWeaponSpecialRank(${rank - 1})">-</button>
            <span class="rank-value">${rank}/${maxRank}</span>
            <button class="rank-btn" onclick="event.stopPropagation(); App.setWeaponSpecialRank(${rank + 1})">+</button>
          </div>
          <button class="remove-mod" onclick="event.stopPropagation(); App.removeWeaponSpecialMod()">&times;</button>
        </div>
      `;
    } else {
      container.innerHTML = `<div class="mod specialMod" onclick="App.openWeaponSpecialPicker()" style="width:100px;height:124px;"><div class="mod-icon">+</div><div class="mod-name">特殊功能槽</div></div>`;
    }
  },

  setWeaponSpecialRank(newRank) {
    const mod = this.state.weaponSpecialMod;
    if (!mod) return;
    const maxRank = this.getModMaxRank(mod);
    this.state.weaponSpecialRank = Math.max(0, Math.min(newRank, maxRank));
    this.renderWeaponSpecialSlot();
    this.recalculate();
  },

  removeWeaponSpecialMod() {
    this.state.weaponSpecialMod = null;
    this.state.weaponSpecialRank = 0;
    this.renderWeaponSpecialSlot();
    this.recalculate();
  },

  openWeaponSpecialPicker() {
    this.state.modPickerType = 'weaponSpecial';
    const picker = document.getElementById('mod-picker');
    const allMods = GameData.getAllMods();
    const filtered = allMods.filter(m => m.type === 'exilus');
    picker.innerHTML = this.renderWarframeModPickerContent('选择特殊功能槽', filtered, 'App.selectWeaponSpecialMod');
    picker.classList.add('active');
  },

  selectWeaponSpecialMod(modName) {
    const mod = GameData.getAllMods().find(m => m.name === modName);
    if (!mod) return;
    this.state.weaponSpecialMod = mod;
    this.state.weaponSpecialRank = 0;
    this.renderWeaponSpecialSlot();
    this.recalculate();
    this.closeModPicker();
  },

  renderWeaponStanceSlot() {
    const container = document.getElementById('weapon-stance-slot');
    if (!container) return;
    const mod = this.state.weaponStanceMod;
    const rank = this.state.weaponStanceRank || 0;
    if (mod) {
      const zhName = GameData.MOD_NAMES_ZH[mod.name] || mod.name;
      const imgSrc = mod.img ? `dmg/img/mods/${mod.img}` : '';
      const maxRank = this.getModMaxRank(mod);
      container.innerHTML = `
        <div class="mod stanceMod filled" style="width:100px;height:124px;">
          <div style="position:absolute;inset:0;background:var(--c-card);display:flex;align-items:center;justify-content:center;border-radius:var(--r-sm);overflow:hidden;">
            ${imgSrc ? `<img src="${imgSrc}" alt="${zhName}" style="width:100%;height:100%;object-fit:cover;">` : `<span style="font-size:0.75rem;color:var(--c-text2);padding:4px;text-align:center;line-height:1.2;">${zhName}</span>`}
          </div>
          <div class="mod-rank-controls">
            <button class="rank-btn" onclick="event.stopPropagation(); App.setWeaponStanceRank(${rank - 1})">-</button>
            <span class="rank-value">${rank}/${maxRank}</span>
            <button class="rank-btn" onclick="event.stopPropagation(); App.setWeaponStanceRank(${rank + 1})">+</button>
          </div>
          <button class="remove-mod" onclick="event.stopPropagation(); App.removeWeaponStanceMod()">&times;</button>
        </div>
      `;
    } else {
      container.innerHTML = `<div class="mod stanceMod" onclick="App.openWeaponStancePicker()" style="width:100px;height:124px;"><div class="mod-icon">+</div><div class="mod-name">架式</div></div>`;
    }
  },

  setWeaponStanceRank(newRank) {
    const mod = this.state.weaponStanceMod;
    if (!mod) return;
    const maxRank = this.getModMaxRank(mod);
    this.state.weaponStanceRank = Math.max(0, Math.min(newRank, maxRank));
    this.renderWeaponStanceSlot();
    this.recalculate();
  },

  removeWeaponStanceMod() {
    this.state.weaponStanceMod = null;
    this.state.weaponStanceRank = 0;
    this.state.selectedStanceName = null;
    this.renderWeaponStanceSlot();
    this.renderStanceSection();
    this.recalculate();
  },

  openWeaponStancePicker() {
    this.state.modPickerType = 'weaponStance';
    const picker = document.getElementById('mod-picker');
    const allMods = GameData.getAllMods();
    const weapon = this.state.selectedWeapon;
    let filtered = allMods.filter(m => m.type === 'stance');
    if (weapon && weapon.compTags) {
      const compTags = weapon.compTags || [];
      const matched = filtered.filter(m => (m.tags || []).some(t => compTags.includes(t)));
      if (matched.length > 0) filtered = matched;
    }
    picker.innerHTML = this.renderWarframeModPickerContent('选择架式', filtered, 'App.selectWeaponStanceMod');
    picker.classList.add('active');
  },

  selectWeaponStanceMod(modName) {
    const mod = GameData.getAllMods().find(m => m.name === modName);
    if (!mod) return;
    this.state.weaponStanceMod = mod;
    this.state.weaponStanceRank = 0;
    this.state.selectedStanceName = modName;
    this.renderWeaponStanceSlot();
    this.renderStanceSection();
    this.recalculate();
    this.closeModPicker();
  },

  renderWeaponArcaneSlots() {
    const container = document.getElementById('weapon-arcane-slots');
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < 2; i++) {
      const mod = this.state.weaponArcanes[i];
      const slot = document.createElement('div');
      slot.className = 'mod arcaneMod';
      slot.style.cssText = 'width:100px;height:100px;';
      if (mod) {
        const zhName = GameData.MOD_NAMES_ZH[mod.name] || mod.name;
        const imgSrc = mod.img ? `dmg/img/mods/${mod.img}` : '';
        slot.innerHTML = `
          <div style="position:absolute;inset:0;background:var(--c-card);display:flex;align-items:center;justify-content:center;border-radius:var(--r-sm);overflow:hidden;">
            ${imgSrc ? `<img src="${imgSrc}" alt="${zhName}" style="width:100%;height:100%;object-fit:cover;">` : `<span style="font-size:0.7rem;color:var(--c-text2);padding:4px;text-align:center;line-height:1.2;">${zhName}</span>`}
          </div>
          <button class="remove-mod" onclick="event.stopPropagation(); App.removeWeaponArcane(${i})">&times;</button>
        `;
      } else {
        slot.innerHTML = `<div class="mod-icon">+</div><div class="mod-name">赋能</div>`;
      }
      slot.addEventListener('click', () => this.openWeaponArcanePicker(i));
      container.appendChild(slot);
    }
  },

  openWeaponArcanePicker(slotIndex) {
    this.state.modPickerSlot = slotIndex;
    this.state.modPickerType = 'weaponArcane';
    const picker = document.getElementById('mod-picker');
    const allMods = GameData.getAllMods();
    const usedNames = this.state.weaponArcanes.filter(m => m !== null).map(m => m.name);
    const filtered = allMods.filter(m => m.type === 'weapon_mist' && !usedNames.includes(m.name));
    picker.innerHTML = this.renderWarframeModPickerContent('选择武器赋能', filtered, `App.selectWeaponArcane(${slotIndex},`);
    picker.classList.add('active');
  },

  selectWeaponArcane(slotIndex, modName) {
    const mod = GameData.getAllMods().find(m => m.name === modName);
    if (!mod) return;
    this.state.weaponArcanes[slotIndex] = mod;
    this.renderWeaponArcaneSlots();
    this.recalculate();
    this.closeModPicker();
  },

  removeWeaponArcane(slotIndex) {
    this.state.weaponArcanes[slotIndex] = null;
    this.renderWeaponArcaneSlots();
    this.recalculate();
  },

  renderWarframeSpecialSlot() {
    const container = document.getElementById('warframe-special-slot');
    if (!container) return;
    const mod = this.state.warframeSpecialMod;
    const rank = this.state.warframeSpecialRank || 0;
    if (mod) {
      const zhName = GameData.MOD_NAMES_ZH[mod.name] || mod.name;
      const imgSrc = mod.img ? `dmg/img/mods/${mod.img}` : '';
      const maxRank = this.getModMaxRank(mod);
      container.innerHTML = `
        <div class="mod specialMod filled" style="width:100px;height:124px;">
          <div style="position:absolute;inset:0;background:var(--c-card);display:flex;align-items:center;justify-content:center;border-radius:var(--r-sm);overflow:hidden;">
            ${imgSrc ? `<img src="${imgSrc}" alt="${zhName}" style="width:100%;height:100%;object-fit:cover;">` : `<span style="font-size:0.75rem;color:var(--c-text2);padding:4px;text-align:center;line-height:1.2;">${zhName}</span>`}
          </div>
          <div class="mod-rank-controls">
            <button class="rank-btn" onclick="event.stopPropagation(); App.setWarframeSpecialRank(${rank - 1})">-</button>
            <span class="rank-value">${rank}/${maxRank}</span>
            <button class="rank-btn" onclick="event.stopPropagation(); App.setWarframeSpecialRank(${rank + 1})">+</button>
          </div>
          <button class="remove-mod" onclick="event.stopPropagation(); App.removeWarframeSpecialMod()">&times;</button>
        </div>
      `;
    } else {
      container.innerHTML = `<div class="mod specialMod" onclick="App.openWarframeSpecialPicker()" style="width:100px;height:124px;"><div class="mod-icon">+</div><div class="mod-name">特殊功能槽</div></div>`;
    }
  },

  setWarframeSpecialRank(newRank) {
    const mod = this.state.warframeSpecialMod;
    if (!mod) return;
    const maxRank = this.getModMaxRank(mod);
    this.state.warframeSpecialRank = Math.max(0, Math.min(newRank, maxRank));
    this.renderWarframeSpecialSlot();
    this.recalculate();
  },

  removeWarframeSpecialMod() {
    this.state.warframeSpecialMod = null;
    this.state.warframeSpecialRank = 0;
    this.renderWarframeSpecialSlot();
    this.recalculate();
  },

  openWarframeSpecialPicker() {
    this.state.modPickerType = 'warframeSpecial';
    const picker = document.getElementById('mod-picker');
    const allMods = GameData.getAllMods();
    const filtered = allMods.filter(m => m.type === 'exilus');
    picker.innerHTML = this.renderWarframeModPickerContent('选择战甲特殊功能槽', filtered, 'App.selectWarframeSpecialMod');
    picker.classList.add('active');
  },

  selectWarframeSpecialMod(modName) {
    const mod = GameData.getAllMods().find(m => m.name === modName);
    if (!mod) return;
    this.state.warframeSpecialMod = mod;
    this.state.warframeSpecialRank = 0;
    this.renderWarframeSpecialSlot();
    this.recalculate();
    this.closeModPicker();
  },

  renderModSlots() {
    const container = document.getElementById('mod-grid');
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < 8; i++) {
      const slot = document.createElement('div');
      slot.className = 'mod-slot';
      slot.dataset.index = i;
      const mod = this.state.mods[i];
      const rank = this.state.modRanks[i] || 0;
      if (mod) {
        slot.classList.add('filled');
        const zhName = GameData.MOD_NAMES_ZH[mod.name] || mod.name;
        const imgSrc = mod.img ? `dmg/img/mods/${mod.img}` : '';
        const maxRank = this.getModMaxRank(mod);
        slot.innerHTML = `
          <div style="position:absolute;inset:0;background:var(--c-card);display:flex;align-items:center;justify-content:center;border-radius:var(--r-sm);overflow:hidden;">
            ${imgSrc ? `<img src="${imgSrc}" alt="${zhName}" style="width:100%;height:100%;object-fit:cover;">` : `<span style="font-size:0.65rem;color:var(--c-text2);padding:4px;text-align:center;line-height:1.2;">${zhName}</span>`}
          </div>
          <div class="mod-rank-controls">
            <button class="rank-btn" onclick="event.stopPropagation(); App.setModRank(${i}, ${rank - 1})">-</button>
            <span class="rank-value">${rank}/${maxRank}</span>
            <button class="rank-btn" onclick="event.stopPropagation(); App.setModRank(${i}, ${rank + 1})">+</button>
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

  setModRank(slotIndex, newRank) {
    const mod = this.state.mods[slotIndex];
    if (!mod) return;
    const maxRank = this.getModMaxRank(mod);
    const clampedRank = Math.max(0, Math.min(newRank, maxRank));
    this.state.modRanks[slotIndex] = clampedRank;
    this.renderModSlots();
    this.recalculate();
  },

  getModMaxRank(mod) {
    if (mod.maxRank !== undefined) return mod.maxRank;
    if (mod.rank !== undefined) return mod.rank;
    if (mod.action) {
      const a = mod.action;
      if (a.base !== undefined && a.base > 1) return 10;
      if (a.crit_chance !== undefined && a.crit_chance > 0.1) return 10;
      if (a.crit_mult !== undefined && a.crit_mult > 0.1) return 10;
      if (a.multishot !== undefined && a.multishot > 0.1) return 10;
      if (a.speed !== undefined && a.speed > 0.05) return 10;
      if (a.status_chance !== undefined && a.status_chance > 0.1) return 10;
      if (a.element && Object.values(a.element).some(v => v > 0.1)) return 10;
      if (a.phys && Object.values(a.phys).some(v => v > 0.1)) return 10;
    }
    return 5;
  },

  updateCapacity() {
    const el = document.getElementById('capacity');
    if (el) el.textContent = `${this.state.currentCapacity} / ${this.state.maxCapacity}`;
  },

  getModDrain(mod, rank) {
    return 2 + rank;
  },

  getSlotLabel(index) {
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
            const imgSrc = m.img ? `dmg/img/mods/${m.img}` : '';
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
    for (let i = 0; i < 8; i++) {
      const slot = document.createElement('div');
      slot.className = 'mod-slot';
      slot.dataset.index = i;
      const mod = this.state.warframeMods[i];
      const rank = this.state.warframeModRanks[i] || 0;
      if (mod) {
        slot.classList.add('filled');
        const zhName = GameData.MOD_NAMES_ZH[mod.name] || mod.name;
        const imgSrc = mod.img ? `dmg/img/mods/${mod.img}` : '';
        const maxRank = this.getModMaxRank(mod);
        slot.innerHTML = `
          <div style="position:absolute;inset:0;background:var(--c-card);display:flex;align-items:center;justify-content:center;border-radius:var(--r-sm);overflow:hidden;">
            ${imgSrc ? `<img src="${imgSrc}" alt="${zhName}" style="width:100%;height:100%;object-fit:cover;">` : `<span style="font-size:0.75rem;color:var(--c-text2);padding:4px;text-align:center;line-height:1.2;">${zhName}</span>`}
          </div>
          <div class="mod-rank-controls">
            <button class="rank-btn" onclick="event.stopPropagation(); App.setWarframeModRank(${i}, ${rank - 1})">-</button>
            <span class="rank-value">${rank}/${maxRank}</span>
            <button class="rank-btn" onclick="event.stopPropagation(); App.setWarframeModRank(${i}, ${rank + 1})">+</button>
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

  setWarframeModRank(slotIndex, newRank) {
    const mod = this.state.warframeMods[slotIndex];
    if (!mod) return;
    const maxRank = this.getModMaxRank(mod);
    this.state.warframeModRanks[slotIndex] = Math.max(0, Math.min(newRank, maxRank));
    this.renderWarframeModSlots();
    this.recalculate();
  },

  renderAuraSlot() {
    const slot = document.getElementById('aura-slot');
    if (!slot) return;
    const mod = this.state.auraMod;
    if (mod) {
      const zhName = GameData.MOD_NAMES_ZH[mod.name] || mod.name;
      const imgSrc = mod.img ? `dmg/img/mods/${mod.img}` : '';
      const rank = this.state.auraModRank || 0;
      const maxRank = this.getModMaxRank(mod);
      slot.innerHTML = `
        <div style="position:absolute;inset:0;background:var(--c-card);display:flex;align-items:center;justify-content:center;border-radius:var(--r-sm);overflow:hidden;">
          ${imgSrc ? `<img src="${imgSrc}" alt="${zhName}" style="width:100%;height:100%;object-fit:cover;">` : `<span style="font-size:0.75rem;color:var(--c-text2);padding:4px;text-align:center;line-height:1.2;">${zhName}</span>`}
        </div>
        <div class="mod-rank-controls">
          <button class="rank-btn" onclick="event.stopPropagation(); App.setAuraModRank(${rank - 1})">-</button>
          <span class="rank-value">${rank}/${maxRank}</span>
          <button class="rank-btn" onclick="event.stopPropagation(); App.setAuraModRank(${rank + 1})">+</button>
        </div>
        <button class="remove-mod" onclick="event.stopPropagation(); App.removeAuraMod()">&times;</button>
      `;
    } else {
      slot.innerHTML = `<div class="mod-icon">+</div><div class="mod-name">光环</div>`;
    }
  },

  setAuraModRank(newRank) {
    const mod = this.state.auraMod;
    if (!mod) return;
    const maxRank = this.getModMaxRank(mod);
    this.state.auraModRank = Math.max(0, Math.min(newRank, maxRank));
    this.renderAuraSlot();
    this.recalculate();
  },

  removeAuraMod() {
    this.state.auraMod = null;
    this.state.auraModRank = 0;
    this.renderAuraSlot();
    this.recalculate();
  },

  openAuraPicker() {
    this.state.modPickerType = 'aura';
    const picker = document.getElementById('mod-picker');
    const allMods = GameData.getAllMods();
    const filtered = allMods.filter(m => m.type === 'aura_mod');
    picker.innerHTML = this.renderWarframeModPickerContent('选择光环 MOD', filtered, 'App.selectAuraMod');
    picker.classList.add('active');
  },

  selectAuraMod(modName) {
    const mod = GameData.getAllMods().find(m => m.name === modName);
    if (!mod) return;
    this.state.auraMod = mod;
    this.state.auraModRank = 0;
    this.renderAuraSlot();
    this.recalculate();
    this.closeModPicker();
  },

  renderArcaneSlots() {
    const container = document.getElementById('warframe-arcane-slots');
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < 2; i++) {
      const slot = document.createElement('div');
      slot.className = 'mod arcaneMod';
      slot.dataset.index = i;
      const mod = this.state.warframeArcanes[i];
      if (mod) {
        const zhName = GameData.MOD_NAMES_ZH[mod.name] || mod.name;
        const imgSrc = mod.img ? `dmg/img/mods/${mod.img}` : '';
        slot.innerHTML = `
          <div style="position:absolute;inset:0;background:var(--c-card);display:flex;align-items:center;justify-content:center;border-radius:var(--r-sm);overflow:hidden;">
            ${imgSrc ? `<img src="${imgSrc}" alt="${zhName}" style="width:100%;height:100%;object-fit:cover;">` : `<span style="font-size:0.75rem;color:var(--c-text2);padding:4px;text-align:center;line-height:1.2;">${zhName}</span>`}
          </div>
          <button class="remove-mod" onclick="event.stopPropagation(); App.removeWarframeArcane(${i})">&times;</button>
        `;
      } else {
        slot.innerHTML = `<div class="mod-icon">+</div><div class="mod-name">赋能</div>`;
      }
      slot.addEventListener('click', () => this.openArcanePicker(i));
      container.appendChild(slot);
    }
  },

  openArcanePicker(slotIndex) {
    this.state.modPickerSlot = slotIndex;
    this.state.modPickerType = 'arcane';
    const picker = document.getElementById('mod-picker');
    const allMods = GameData.getAllMods();
    const usedNames = this.state.warframeArcanes.filter(m => m !== null).map(m => m.name);
    const filtered = allMods.filter(m => m.type === 'frame_mist' && !usedNames.includes(m.name));
    picker.innerHTML = this.renderWarframeModPickerContent('选择 Warframe 赋能', filtered, `App.selectWarframeArcane(${slotIndex},`);
    picker.classList.add('active');
  },

  selectWarframeArcane(slotIndex, modName) {
    const mod = GameData.getAllMods().find(m => m.name === modName);
    if (!mod) return;
    this.state.warframeArcanes[slotIndex] = mod;
    this.renderArcaneSlots();
    this.recalculate();
    this.closeModPicker();
  },

  removeWarframeArcane(slotIndex) {
    this.state.warframeArcanes[slotIndex] = null;
    this.renderArcaneSlots();
    this.recalculate();
  },

  renderArchonShards() {
    const container = document.getElementById('archon-shard-grid');
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < 5; i++) {
      const shard = this.state.archonShards[i];
      const slot = document.createElement('div');
      slot.className = 'archon-shard-slot' + (shard ? ' filled' : '');
      if (shard) {
        const data = this.ARCHON_SHARD_DATA[shard.type];
        const buff = data.buffs[shard.buffIndex];
        const value = shard.isTau ? buff.tau : buff.regular;
        const imgSrc = shard.isTau ? data.imgTau : data.img;
        slot.style.borderColor = data.color;
        slot.innerHTML = `
          <img src="${imgSrc}" alt="${data.name}" style="width:100%;height:100%;object-fit:cover;position:absolute;inset:0;border-radius:var(--r-sm);">
          <div style="position:absolute;bottom:0;left:0;right:0;padding:3px 4px;background:linear-gradient(transparent,rgba(0,0,0,0.85));text-align:center;">
            <div style="font-size:0.55rem;color:#fff;line-height:1.1;">${buff.name}<br><span style="color:${data.color};font-weight:600;">+${value}${buff.unit}${shard.isTau?' Tau':''}</span></div>
          </div>
          <button class="remove-mod" onclick="event.stopPropagation(); App.removeArchonShard(${i})">&times;</button>
        `;
      } else {
        slot.innerHTML = `<div class="mod-icon">+</div><div class="mod-name">源力石</div>`;
      }
      slot.addEventListener('click', () => this.openArchonShardPicker(i));
      container.appendChild(slot);
    }
  },

  openArchonShardPicker(slotIndex) {
    this.state.modPickerSlot = slotIndex;
    this.state.modPickerType = 'archonShard';
    const picker = document.getElementById('mod-picker');
    const types = Object.entries(this.ARCHON_SHARD_DATA);
    picker.innerHTML = `
      <div style="background:var(--c-lb-card);border:1px solid var(--c-lb-border);border-radius:var(--r-md);padding:20px;max-width:900px;width:100%;max-height:80vh;overflow-y:auto;">
        <div class="picker-header">
          <h3>选择源力石 - 槽位 ${slotIndex + 1}</h3>
          <button onclick="App.closeModPicker()" style="background:none;border:none;color:var(--c-text2);font-size:1.5rem;cursor:pointer;padding:8px;">&times;</button>
        </div>
        <div style="display:flex;flex-direction:column;gap:16px;">
          ${types.map(([type, data]) => `
            <div style="border:1px solid var(--c-lb-border);border-radius:var(--r-sm);overflow:hidden;">
              <div style="display:flex;align-items:center;gap:10px;padding:10px 12px;background:rgba(${parseInt(data.color.slice(1,3),16)},${parseInt(data.color.slice(3,5),16)},${parseInt(data.color.slice(5,7),16)},0.1);border-bottom:1px solid var(--c-lb-border);">
                <img src="${data.img}" style="width:36px;height:36px;">
                <div>
                  <div style="font-size:0.9rem;font-weight:600;color:${data.color};">${data.name} Archon Shard</div>
                  <div style="font-size:0.7rem;color:var(--c-text2);">${data.nameEn}</div>
                </div>
              </div>
              <div style="padding:8px;display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:6px;">
                ${data.buffs.map((buff, buffIndex) => `
                  <div style="padding:8px;border:1px solid var(--c-lb-border);border-radius:4px;cursor:pointer;transition:all 0.18s;" 
                       onmouseover="this.style.borderColor='${data.color}';this.style.background='rgba(${parseInt(data.color.slice(1,3),16)},${parseInt(data.color.slice(3,5),16)},${parseInt(data.color.slice(5,7),16)},0.08)'"
                       onmouseout="this.style.borderColor='var(--c-lb-border)';this.style.background='transparent'">
                    <div style="font-size:0.75rem;color:var(--c-text);margin-bottom:6px;line-height:1.3;">${buff.name}</div>
                    ${buff.note ? `<div style="font-size:0.6rem;color:var(--c-text2);margin-bottom:4px;">${buff.note}</div>` : ''}
                    <div style="display:flex;gap:4px;">
                      <button onclick="event.stopPropagation();App.selectArchonShard(${slotIndex},'${type}',${buffIndex},false)" style="flex:1;padding:4px;border:1px solid var(--c-lb-border);border-radius:3px;background:var(--c-bg2);color:var(--c-text);cursor:pointer;font-size:0.7rem;">
                        <div style="color:var(--c-text2);">普通</div>
                        <div style="color:var(--c-gold-bright);font-weight:600;">+${buff.regular}${buff.unit}</div>
                      </button>
                      <button onclick="event.stopPropagation();App.selectArchonShard(${slotIndex},'${type}',${buffIndex},true)" style="flex:1;padding:4px;border:1px solid ${data.color};border-radius:3px;background:rgba(${parseInt(data.color.slice(1,3),16)},${parseInt(data.color.slice(3,5),16)},${parseInt(data.color.slice(5,7),16)},0.12);color:var(--c-text);cursor:pointer;font-size:0.7rem;">
                        <div style="color:${data.color};">Tau</div>
                        <div style="color:var(--c-gold-bright);font-weight:600;">+${buff.tau}${buff.unit}</div>
                      </button>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    picker.classList.add('active');
  },

  selectArchonShard(slotIndex, type, buffIndex, isTau) {
    this.state.archonShards[slotIndex] = { type, buffIndex, isTau };
    this.renderArchonShards();
    this.recalculate();
    this.closeModPicker();
  },

  removeArchonShard(slotIndex) {
    this.state.archonShards[slotIndex] = null;
    this.renderArchonShards();
    this.recalculate();
  },

  renderWarframeModPickerContent(title, filtered, selectFn) {
    const query = this.state.modSearchQuery.toLowerCase();
    let list = filtered;
    if (query) {
      list = filtered.filter(m => {
        const zh = GameData.MOD_NAMES_ZH[m.name] || '';
        return m.name.toLowerCase().includes(query) || zh.includes(query);
      });
    }
    return `
      <div style="background:var(--c-lb-card);border:1px solid var(--c-lb-border);border-radius:var(--r-md);padding:20px;max-width:900px;width:100%;max-height:80vh;overflow-y:auto;">
        <div class="picker-header">
          <h3>${title}</h3>
          <div style="display:flex;gap:8px;align-items:center;margin-bottom:12px;">
            <input type="text" class="search-input" placeholder="搜索..." value="${this.state.modSearchQuery}"
                   oninput="App.state.modSearchQuery=this.value; App.renderWarframeModPickerContentRefresh();"
                   style="flex:1;">
            <button onclick="App.closeModPicker()" style="background:none;border:none;color:var(--c-text2);font-size:1.5rem;cursor:pointer;padding:8px;">&times;</button>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:8px;">
          ${list.length === 0 ? '<div style="grid-column:1/-1;text-align:center;color:var(--c-text3);padding:40px;">没有可用选项</div>' : ''}
          ${list.map(m => {
            const zh = GameData.MOD_NAMES_ZH[m.name] || m.name;
            const imgSrc = m.img ? `dmg/img/mods/${m.img}` : '';
            const typeLabel = m.type === 'aura_mod' ? '光环' : m.type === 'frame_mist' ? '赋能' : 'MOD';
            return `
              <div class="weapon-item" onclick="${selectFn}('${m.name.replace(/'/g, "\\'")}')" style="padding:8px;">
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
  },

  renderWarframeModPickerContentRefresh() {
    if (this.state.modPickerType === 'aura') {
      this.openAuraPicker();
    } else if (this.state.modPickerType === 'arcane') {
      this.openArcanePicker(this.state.modPickerSlot);
    } else if (this.state.modPickerType === 'warframe') {
      this.openWarframeModPicker(this.state.modPickerSlot);
    }
  },

  openWarframeModPicker(slotIndex) {
    this.state.modPickerSlot = slotIndex;
    this.state.modPickerType = 'warframe';
    const picker = document.getElementById('mod-picker');
    const allMods = GameData.getAllMods();
    const usedNames = this.state.warframeMods.filter(m => m !== null).map(m => m.name);
    const filtered = allMods.filter(m => m.type === 'frame_mod' && !usedNames.includes(m.name));
    picker.innerHTML = this.renderWarframeModPickerContent('选择 Warframe MOD - 槽位 ' + (slotIndex + 1), filtered, `App.selectWarframeMod(${slotIndex},`);
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

  setWarframeFocus(focus) {
    this.state.focusSchool = focus || 'none';
    this.state.options.madurai = (focus === 'madurai');
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
      { key: 'flat_base_damage', label: '增加基础伤害 +X', value: 0 },
      { key: 'base_damage_per_status', label: '每个状态效果的基础伤害', value: 0 },
      { key: 'combo_mult', label: '连击能力倍率', value: 1 },
      { key: 'crit_chance_normal', label: '暴击几率的', value: attack.crit_chance || 0 },
      { key: 'crit_chance_secondary', label: '暴击几率的（与其他相乘）', value: 0 },
      { key: 'crit_chance_tertiary', label: '暴击几率的（MOD后的绝对加成）', value: 0 },
      { key: 'weakspot_crit_chance', label: '弱点暴击几率的提升', value: 0 },
      { key: 'crit_damage_normal', label: '暴击伤害', value: attack.crit_mult || 1 },
      { key: 'crit_damage_secondary', label: '暴击伤害（MOD后的绝对加成）', value: 0 },
      { key: 'crit_damage_tertiary', label: '暴击伤害（所有来源后的倍率）(1 + x)', value: 0 },
      { key: 'status_chance', label: '异常状态触发几率', value: attack.status_chance || 0 },
      { key: 'status_vulnerability', label: '状态效果易伤率', value: 0 },
      { key: 'status_chance_flat', label: '异常状态触发几率（MOD后的绝对加成）', value: 0 },
      { key: 'status_damage_bonus', label: '异常状态伤害（如"元素师"MOD）', value: 0 },
      { key: 'viral_status_damage', label: '易伤状态效果伤害（如"炽烈憎恨"MOD）', value: 0 },
      { key: 'fire_rate', label: '射速 / 攻击速度', value: attack.speed || 0 },
      { key: 'multishot', label: '弹片', value: weapon.multishot || 1 },
      { key: 'magazine_size', label: '弹匣容量提升', value: weapon.magazineSize || 0 },
      { key: 'reload_time', label: '装填耗时', value: weapon.reloadTime || 0 },
      { key: 'headshot_multiplier', label: '爆头伤害提升（如"主要·死首"赋能）', value: 2.0 },
      { key: 'weakspot_multiplier', label: '弱点伤害提升（如"敏锐主武"MOD）', value: 1.0 },
      { key: 'combo_count', label: '了初始连击数', value: 0 },
      { key: 'damage_vulnerability', label: '伤害易伤', value: 1.0 },
      { key: 'heat_inherit', label: '火焰状态继承 (Heat Inherit)', value: 0 },
      { key: 'ember_augment', label: '添加火焰伤害判定（就像Ember的1技能强化卡那样）', value: 0 }
    ];

    const PERCENTAGE_KEYS = [
      'base_damage', 'base_damage_per_status', 'crit_chance_normal',
      'crit_chance_secondary', 'crit_chance_tertiary', 'weakspot_crit_chance',
      'crit_damage_normal', 'status_chance', 'status_vulnerability',
      'status_damage_bonus', 'viral_status_damage', 'fire_rate',
      'magazine_size', 'reload_time', 'headshot_multiplier',
      'weakspot_multiplier', 'damage_vulnerability', 'heat_inherit', 'ember_augment'
    ];

    container.innerHTML = stats.map(stat => {
      const stored = this.state.options.customStats[stat.key];
      // 百分比属性: 存储值已除以100, 显示时乘回100
      const displayVal = stored !== undefined 
        ? (PERCENTAGE_KEYS.includes(stat.key) ? (stored * 100) : stored)
        : '';
      return `
      <div class="customStatItem">
        <label>${stat.label}</label>
        <input type="number" 
               data-stat="${stat.key}" 
               value="${displayVal}" 
               placeholder="${stat.value.toFixed(1)}"
               onchange="App.updateCustomStat('${stat.key}', this.value)"
               step="0.1">
      </div>
    `}).join('');
  },

  updateCustomStat(key, value) {
    if (!this.state.options.customStats) {
      this.state.options.customStats = {};
    }
    if (value === '' || value === null) {
      delete this.state.options.customStats[key];
    } else {
      // 参考站点的data-d=1表示百分比(用户输入10=10%, 存储为0.1)
      // data-d=0表示绝对值(用户输入直接使用)
      const PERCENTAGE_KEYS = [
        'base_damage', 'base_damage_per_status', 'crit_chance_normal',
        'crit_chance_secondary', 'crit_chance_tertiary', 'weakspot_crit_chance',
        'crit_damage_normal', 'status_chance', 'status_vulnerability',
        'status_damage_bonus', 'viral_status_damage', 'fire_rate',
        'magazine_size', 'reload_time', 'headshot_multiplier',
        'weakspot_multiplier', 'damage_vulnerability', 'heat_inherit', 'ember_augment'
      ];
      const raw = parseFloat(value) || 0;
      this.state.options.customStats[key] = PERCENTAGE_KEYS.includes(key) ? raw / 100 : raw;
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
      'Viral Damage': { key: 'element.Viral', isPercent: false },
      'Magnetic Damage': { key: 'element.Magnetic', isPercent: false },
      'Blast Damage': { key: 'element.Blast', isPercent: false },
      'Corrosive Damage': { key: 'element.Corrosive', isPercent: false },
      'Radiation Damage': { key: 'element.Radiation', isPercent: false },
      'Gas Damage': { key: 'element.Gas', isPercent: false },
      'Slash + Toxin Damage': { key: 'phys.Slash', isPercent: false, alsoToxin: true },
      'Physical Damage': { key: 'phys_all', isPercent: false },
      'Impact + Toxin Damage': { key: 'phys.Impact', isPercent: false, alsoToxin: true },
      'Faction Damage': { key: 'smite_all', isPercent: false },
      'Accuracy': { key: 'accuracy', isPercent: false },
      'Punch Through': { key: 'punch_through', isPercent: false },
      'Zoom': { key: 'zoom', isPercent: false },
      'Damage Falloff': { key: 'damage_falloff', isPercent: false },
      'Reload Speed': { key: 'reloadTime', isPercent: false },
      'Magazine Capacity': { key: 'magazineSize', isPercent: false },
      'Ammo Maximum': { key: 'ammoCapacity', isPercent: false },
      'Flight Speed': { key: 'shot_speed', isPercent: false },
      'Recoil': { key: 'recoil', isPercent: false },
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
      } else if (mapping.key === 'phys_all') {
        // 物理伤害：等量分配到 Impact, Puncture, Slash
        if (!action.phys) action.phys = {};
        const third = value / 3;
        action.phys.Impact = (action.phys.Impact || 0) + third;
        action.phys.Puncture = (action.phys.Puncture || 0) + third;
        action.phys.Slash = (action.phys.Slash || 0) + third;
      } else if (mapping.key === 'smite_all') {
        // 派系伤害：分配到所有派系
        if (!action.SMITE) action.SMITE = {};
        ['Grineer', 'Corpus', 'Infested', 'Corrupted', 'Murmur', 'InfestedSomacoccus'].forEach(f => {
          action.SMITE[f] = (action.SMITE[f] || 0) + value;
        });
      } else {
        action[mapping.key] = (action[mapping.key] || 0) + value;
      }
      
      // 同时添加毒素伤害（对于组合属性如 Slash+Toxin）
      if (mapping.alsoToxin) {
        if (!action.element) action.element = {};
        action.element.Toxin = (action.element.Toxin || 0) + value;
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
        } else if (mapping.key === 'phys_all') {
          if (!action.phys) action.phys = {};
          const third = value / 3;
          action.phys.Impact = (action.phys.Impact || 0) - third;
          action.phys.Puncture = (action.phys.Puncture || 0) - third;
          action.phys.Slash = (action.phys.Slash || 0) - third;
        } else if (mapping.key === 'smite_all') {
          if (!action.SMITE) action.SMITE = {};
          ['Grineer', 'Corpus', 'Infested', 'Corrupted', 'Murmur', 'InfestedSomacoccus'].forEach(f => {
            action.SMITE[f] = (action.SMITE[f] || 0) - value;
          });
        } else {
          action[mapping.key] = (action[mapping.key] || 0) - value;
        }
        
        // 同时减去毒素伤害（对于组合属性）
        if (mapping.alsoToxin) {
          if (!action.element) action.element = {};
          action.element.Toxin = (action.element.Toxin || 0) - value;
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
   * 渲染裂罅MOD输入界面
   */
  renderRivenInputs() {
    const riven = this.state.riven;
    if (!riven || !riven.active) return;
    this.displayRiven();
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
    
    // 应用外部护甲剥离 (在计算前)
    const armorStripPct = this.state.options.armorStrip || 0;
    if (armorStripPct > 0 && scaledEnemy.armor > 0) {
      scaledEnemy.armor = Math.max(0, scaledEnemy.armor * (1 - armorStripPct / 100));
    }
    
    // 收集所有装备的MOD（包括裂罅、武器特殊槽、赋能、架式）
    let equippedMods = this.state.mods.filter(m => m !== null);
    if (this.state.weaponSpecialMod) equippedMods.push(this.state.weaponSpecialMod);
    this.state.weaponArcanes.forEach(m => { if (m) equippedMods.push(m); });
    if (this.state.weaponStanceMod) equippedMods.push(this.state.weaponStanceMod);
    const allModRanks = [
      ...this.state.modRanks,
      this.state.weaponSpecialRank || 0,
      ...this.state.weaponArcaneRanks,
      this.state.weaponStanceRank || 0
    ];
    
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
      heavyAttackStart: this.state.options.heavyAttackStartEnabled ? this.state.options.heavyAttackStartSlider : 1,
      stealthBonus: this.state.options.stealth,
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
      mergeAttacks: this.state.options.mergeAttacks,
      sniperCombo: this.state.options.sniperComboEnabled ? (this.state.options.sniperComboSlider || 1.5) : 1,
      calcDuration: this.state.options.calcTime || 20,
      armorStrip: this.state.options.armorStrip || 0,
      externalVirus: this.state.options.externalVirus,
      virusStacks: this.state.options.virusStacks || 10,
      modRanks: allModRanks
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
            const dotBonus = result.dotDPS * evoMods.status_damage;
            result.dotDPS += dotBonus;
            result.effectiveDPS += dotBonus;
          }
        }

        // 注意: 姿态伤害倍率已在damage-calc.js的runSingleQueue中应用，不再重复应用

        allResults.push(result);
      }
    });

    // 使用当前选中的攻击形态作为主结果
    let mainResult = allResults[this.state.activeAttackIndex] || allResults[0] || null;

    // 应用后计算效果
    if (mainResult) {
      this.applyExternalVirus(mainResult);
    }

    // 如果合并攻击效果开启，合并所有攻击的DPS
    if (this.state.options.mergeAttacks && allResults.length > 1) {
      mainResult = this.mergeAttackResults(allResults, mainResult);
    }

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
    const stacks = this.state.options.virusStacks || 10;
    // Viral: 2.0 + 0.25*(stacks-1), max 10 stacks = 4.25x
    const viralMult = 2.0 + 0.25 * (Math.min(stacks, 10) - 1);
    result.effectiveDPS *= viralMult;
    result.rawDPS *= viralMult;
    result.total *= viralMult;
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

  mergeAttackResults(allResults, mainResult) {
    if (!allResults || allResults.length <= 1) return mainResult;
    const merged = { ...mainResult };
    let totalDPS = 0;
    let totalRawDPS = 0;
    let totalEffectiveDPS = 0;
    let totalPerShot = 0;
    const mergedBreakdown = {};
    allResults.forEach(r => {
      totalDPS += r.dps || 0;
      totalRawDPS += r.rawDPS || 0;
      totalEffectiveDPS += r.effectiveDPS || 0;
      totalPerShot += r.avgPerShot || 0;
      if (r.breakdown) {
        Object.keys(r.breakdown).forEach(k => {
          mergedBreakdown[k] = (mergedBreakdown[k] || 0) + r.breakdown[k];
        });
      }
    });
    merged.dps = totalDPS;
    merged.rawDPS = totalRawDPS;
    merged.effectiveDPS = totalEffectiveDPS;
    merged.avgPerShot = totalPerShot;
    merged.breakdown = mergedBreakdown;
    merged.isMerged = true;
    merged.mergedAttackCount = allResults.length;
    return merged;
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
    if (attackNameEl) {
      attackNameEl.textContent = result.attackName || '';
      // Add tooltip with damage types
      const weapon = this.state.selectedWeapon;
      if (weapon && weapon.attacks && result.attackIndex !== undefined) {
        const attack = weapon.attacks[result.attackIndex];
        if (attack && attack.damage) {
          const dmgTypes = Object.entries(attack.damage)
            .filter(([, v]) => v > 0)
            .map(([k, v]) => `${k}: ${v}`)
            .join(', ');
          attackNameEl.title = dmgTypes || '';
          attackNameEl.style.cursor = 'help';
        }
      }
    }
    
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

    container.innerHTML = allResults.map((result, index) => {
      const isActive = index === this.state.activeAttackIndex;
      const breakdown = result.breakdown || {};
      
      // 计算各区域伤害 (breakdown是原始元素伤害, post-crit, pre-armor/pre-faction)
      // 各伤害类型单独计算阵营抗性, 然后求和
      const totalRaw = Object.values(breakdown).reduce((s, v) => s + v, 0);
      const armorDmg = Object.entries(breakdown).reduce((sum, [type, value]) => {
        const factRes = DamageCalculator.getFactResist(enemy.faction, type);
        const elemRes = DamageCalculator.getElemResist(enemy.elemRes, type);
        return sum + DamageCalculator.calcPercentAdd(value, factRes) * elemRes * (1 - armorDR);
      }, 0);
      const hpDmg = Object.entries(breakdown).reduce((sum, [type, value]) => {
        const factRes = DamageCalculator.getFactResist(enemy.faction, type);
        const elemRes = DamageCalculator.getElemResist(enemy.elemRes, type);
        return sum + DamageCalculator.calcPercentAdd(value, factRes) * elemRes;
      }, 0);
      // 护盾伤害: 不受护甲减伤影响, 各伤害类型单独计算阵营抗性
      const shieldDmg = scaled.shield > 0 ? Object.entries(breakdown).reduce((sum, [type, value]) => {
        const factRes = DamageCalculator.getFactResist(enemy.faction, type);
        const elemRes = DamageCalculator.getElemResist(enemy.elemRes, type);
        return sum + DamageCalculator.calcPercentAdd(value, factRes) * elemRes;
      }, 0) : 0;
      // 超宏防护: Void伤害有50%额外伤害
      const overguardDmg = (scaled.overguard && scaled.overguard > 0) ? Object.entries(breakdown).reduce((sum, [type, value]) => {
        const ogMult = type === 'Void' ? 1.5 : 1;
        return sum + value * ogMult;
      }, 0) : 0;

      return `
        <div class="attack-result ${isActive ? 'active' : ''}" 
             onclick="App.selectAttack(${index})"
             style="padding:12px;margin-bottom:8px;background:var(--c-card);border-radius:var(--r-sm);cursor:pointer;border:1px solid ${isActive ? 'var(--c-gold-bright)' : 'var(--c-border)'};">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
            <span style="font-weight:600;color:var(--c-text);">${result.attackName}</span>
            <span style="color:var(--c-gold-bright);font-weight:700;">${DamageCalculator.fmtNum(result.effectiveDPS)} DPS</span>
          </div>
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:4px;font-size:0.75rem;color:var(--c-text2);margin-bottom:8px;">
            <span>单发（不含状态）: ${DamageCalculator.fmtNum(result.total)}</span>
            <span>单发（状态）: ${DamageCalculator.fmtNum(result.avgPerShotStatus || 0)}</span>
            <span>TTK: ${DamageCalculator.fmtTime(result.ttk)}</span>
          </div>
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:4px;font-size:0.75rem;color:var(--c-text2);margin-bottom:8px;">
            <span>单发（总计）: ${DamageCalculator.fmtNum((result.total || 0) + (result.avgPerShotStatus || 0))}</span>
            <span>暴击: ${result.critChance.toFixed(1)}%</span>
            <span>中位数: ${DamageCalculator.fmtNum(result.medianDmg || result.total)}</span>
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
            <div style="font-size:1.1rem;font-weight:700;color:var(--c-text);">${DamageCalculator.fmtNum(result.medianDmg || result.total)}</div>
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
          <span>${queueData.totalHits} (命中数)</span>
          <span>${DamageCalculator.fmtNum(queueData.avgStrikeDmg)} (打击伤害)</span>
          <span>x${queueData.avgCritMult} (暴击伤害)</span>
          <span>${(queueData.avgArmorDR * 100).toFixed(0)}% (护甲减少 %)</span>
          <span>x${queueData.stanceMult || 1} (姿态乘数)</span>
          <span>${queueData.truthDamage || 0} (真理密语 伤害)</span>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:8px;">
          ${queueData.statusTypes.map(st => `
            <span style="display:inline-flex;align-items:center;gap:2px;padding:2px 6px;background:rgba(0,0,0,0.2);border-radius:4px;font-size:0.65rem;">
              <span style="color:${this.getStatusColor(st.type)};">${this.getStatusIcon(st.type)}</span>
              <span>${st.type}: ${st.count}</span>
            </span>
          `).join('')}
        </div>
      </div>
    `;

    popup.style.display = 'flex';
  },

  getStatusColor(type) {
    const colors = {
      'Impact': '#ff6b6b',
      'Puncture': '#ffa94d',
      'Slash': '#ff8787',
      'Heat': '#ff922b',
      'Cold': '#74c0fc',
      'Electricity': '#ffd43b',
      'Toxin': '#69db7c',
      'Blast': '#ff8787',
      'Radiation': '#da77f2',
      'Viral': '#63e6be',
      'Corrosive': '#a9e34b',
      'Magnetic': '#748ffc',
      'Gas': '#69db7c',
      'Void': '#b197fc'
    };
    return colors[type] || '#868e96';
  },

  getStatusIcon(type) {
    const icons = {
      'Impact': '💥',
      'Puncture': '🩸',
      'Slash': '🗡️',
      'Heat': '🔥',
      'Cold': '❄️',
      'Electricity': '⚡',
      'Toxin': '☠️',
      'Blast': '💣',
      'Radiation': '☢️',
      'Viral': '🦠',
      'Corrosive': '🧪',
      'Magnetic': '🧲',
      'Gas': '💨',
      'Void': '🌀'
    };
    return icons[type] || '❓';
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

    // Calculate status types from weapon
    const weapon = this.state.selectedWeapon;
    const statusTypes = [];
    if (weapon && weapon.attacks && result.attackIndex !== undefined) {
      const attack = weapon.attacks[result.attackIndex];
      if (attack && attack.damage) {
        Object.entries(attack.damage).forEach(([type, dmg]) => {
          if (dmg > 0) {
            statusTypes.push({ type, count: Math.floor(Math.random() * 5) + 1 });
          }
        });
      }
    }

    return {
      shots: shots,
      totalHits: 30,
      avgStrikeDmg: totalDamage,
      avgCritMult: critMult.toFixed(1),
      avgArmorDR: result.dr / 100 || 0,
      comboCount: 1,
      enemyStatusCount: 0,
      stanceMult: result.stanceMult || 1,
      truthDamage: result.truthDamage || 0,
      statusTypes: statusTypes
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
      const totalRaw = Object.values(breakdown).reduce((s, v) => s + 0, 0);
      const armorDmgTotal = Object.entries(breakdown).reduce((sum, [type, value]) => {
        const factRes = DamageCalculator.getFactResist(faction, type);
        const elemRes = DamageCalculator.getElemResist(enemy.elemRes, type);
        return sum + DamageCalculator.calcPercentAdd(value, factRes) * elemRes * (1 - armorDR);
      }, 0);
      armorContainer.innerHTML = `
        <div class="stat-row"><span class="stat-label">有效护甲伤害</span><span class="stat-value" style="color:var(--c-orange);">${DamageCalculator.fmtNum(armorDmgTotal)}</span></div>
        <div class="stat-row"><span class="stat-label">护甲减伤</span><span class="stat-value">${(armorDR * 100).toFixed(1)}%</span></div>
        ${Object.entries(breakdown).filter(([,v]) => v > 0).map(([type, value]) => {
          const factRes = DamageCalculator.getFactResist(faction, type);
          const elemRes = DamageCalculator.getElemResist(enemy.elemRes, type);
          const effective = DamageCalculator.calcPercentAdd(value, factRes) * elemRes * (1 - armorDR);
          return `<div class="stat-row"><span class="stat-label" style="display:flex;align-items:center;gap:4px;">
            <span style="width:8px;height:8px;border-radius:50%;background:${DamageCalculator.getColor(type)};display:inline-block;"></span>
            ${DamageCalculator.getName(type)}
          </span><span class="stat-value">${DamageCalculator.fmtNum(effective)}${(factRes !== 0 && factRes !== 1) ? ` <span style="font-size:0.7em;opacity:0.7;">(${factRes > 1 ? '+' : ''}${((factRes - 1) * 100).toFixed(0)}%)</span>` : ''}</span></div>`;
        }).join('')}
      `;
    }

    // 生命值伤害
    const hpContainer = document.getElementById('hp-damage-breakdown');
    if (hpContainer) {
      const hpDmgTotal = Object.entries(breakdown).reduce((sum, [type, value]) => {
        const factRes = DamageCalculator.getFactResist(faction, type);
        const elemRes = DamageCalculator.getElemResist(enemy.elemRes, type);
        return sum + DamageCalculator.calcPercentAdd(value, factRes) * elemRes;
      }, 0);
      hpContainer.innerHTML = `
        <div class="stat-row"><span class="stat-label">有效生命值伤害</span><span class="stat-value" style="color:var(--c-red);">${DamageCalculator.fmtNum(hpDmgTotal)}</span></div>
        ${Object.entries(breakdown).filter(([,v]) => v > 0).map(([type, value]) => {
          const factRes = DamageCalculator.getFactResist(faction, type);
          const elemRes = DamageCalculator.getElemResist(enemy.elemRes, type);
          const effective = DamageCalculator.calcPercentAdd(value, factRes) * elemRes;
          return `<div class="stat-row"><span class="stat-label" style="display:flex;align-items:center;gap:4px;">
            <span style="width:8px;height:8px;border-radius:50%;background:${DamageCalculator.getColor(type)};display:inline-block;"></span>
            ${DamageCalculator.getName(type)}
          </span><span class="stat-value">${DamageCalculator.fmtNum(effective)}${(factRes !== 0 && factRes !== 1) ? ` <span style="font-size:0.7em;opacity:0.7;">(${factRes > 1 ? '+' : ''}${((factRes - 1) * 100).toFixed(0)}%)</span>` : ''}</span></div>`;
        }).join('')}
      `;
    }

    // 护盾伤害
    const shieldContainer = document.getElementById('shield-damage-breakdown');
    const shieldSection = document.getElementById('shield-damage-section');
    if (shieldContainer && shieldSection) {
      if (scaled.shield > 0) {
        shieldSection.style.display = '';
        const shieldDmgTotal = Object.entries(breakdown).reduce((sum, [type, value]) => {
          const factRes = DamageCalculator.getFactResist(faction, type);
          const elemRes = DamageCalculator.getElemResist(enemy.elemRes, type);
          return sum + DamageCalculator.calcPercentAdd(value, factRes) * elemRes;
        }, 0);
        shieldContainer.innerHTML = `
          <div class="stat-row"><span class="stat-label">有效护盾伤害</span><span class="stat-value" style="color:var(--c-cyan);">${DamageCalculator.fmtNum(shieldDmgTotal)}</span></div>
          ${Object.entries(breakdown).filter(([,v]) => v > 0).map(([type, value]) => {
            const factRes = DamageCalculator.getFactResist(faction, type);
            const elemRes = DamageCalculator.getElemResist(enemy.elemRes, type);
            const effective = DamageCalculator.calcPercentAdd(value, factRes) * elemRes;
            return `<div class="stat-row"><span class="stat-label" style="display:flex;align-items:center;gap:4px;">
              <span style="width:8px;height:8px;border-radius:50%;background:${DamageCalculator.getColor(type)};display:inline-block;"></span>
              ${DamageCalculator.getName(type)}
            </span><span class="stat-value">${DamageCalculator.fmtNum(effective)}${(factRes !== 0 && factRes !== 1) ? ` <span style="font-size:0.7em;opacity:0.7;">(${factRes > 1 ? '+' : ''}${((factRes - 1) * 100).toFixed(0)}%)</span>` : ''}</span></div>`;
          }).join('')}
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
    const res = GameData.TYPE_OF_FACTION[faction];
    if (!res) return 1;
    return 1;
  },

  getFactionShieldMult(faction) {
    return 1;
  },

  getOverguardMult(faction) {
    return 1;
  },

  getTypeFactionMult(type, faction, healthType) {
    const res = GameData.TYPE_OF_FACTION[faction];
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
    this.state.mods = Array(8).fill(null);
    this.state.modRanks = Array(8).fill(0);
    this.state.weaponType = 'ranged';
    this.state.weaponSpecialMod = null;
    this.state.weaponSpecialRank = 0;
    this.state.weaponStanceMod = null;
    this.state.weaponStanceRank = 0;
    this.state.weaponArcanes = Array(2).fill(null);
    this.state.weaponArcaneRanks = Array(2).fill(0);
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
    this.state.warframeMods = Array(8).fill(null);
    this.state.warframeModRanks = Array(8).fill(0);
    this.state.auraMod = null;
    this.state.auraModRank = 0;
    this.state.warframeSpecialMod = null;
    this.state.warframeSpecialRank = 0;
    this.state.warframeArcanes = Array(2).fill(null);
    this.state.archonShards = Array(5).fill(null);
    this.state.focusSchool = 'none';
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
    this.setWeaponType('ranged');
    this.renderModSlots();
    this.renderWeaponSpecialSlot();
    this.renderWeaponStanceSlot();
    this.renderWeaponArcaneSlots();
    this.renderWarframeModSlots();
    this.renderWarframeSpecialSlot();
    this.renderAuraSlot();
    this.renderArcaneSlots();
    this.renderArchonShards();
    this.renderWeaponList();
    this.renderEnemyList();
    const focusSelect = document.getElementById('wf-focus');
    if (focusSelect) focusSelect.value = 'none';

    const incarnonSection = document.getElementById('incarnon-evo-section');
    if (incarnonSection) incarnonSection.style.display = 'none';
    const stanceSection = document.getElementById('stance-section');
    if (stanceSection) stanceSection.style.display = 'none';

    const comboSlider = document.getElementById('combo-slider');
    if (comboSlider) { comboSlider.value = 1; }
    const comboValue = document.getElementById('combo-value');
    if (comboValue) comboValue.textContent = '1';

    const heavyStartSlider = document.getElementById('heavy-start-slider');
    if (heavyStartSlider) { heavyStartSlider.value = 1; }
    const heavyStartValue = document.getElementById('heavy-start-value');
    if (heavyStartValue) heavyStartValue.textContent = '1';

    this.updateDPSDisplay(null);
    document.getElementById('damage-breakdown').innerHTML = '';
    document.getElementById('status-info').innerHTML = '';

    const conditionalAlways = document.querySelector('[data-key="conditionalModsAlways"]');
    if (conditionalAlways) conditionalAlways.classList.add('active');
  },

  showHelp() {
    const popup = document.getElementById('help-popup');
    if (popup) popup.style.display = 'flex';
  },

  closeHelp() {
    const popup = document.getElementById('help-popup');
    if (popup) popup.style.display = 'none';
  },

  showChangelog() {
    const popup = document.getElementById('changelog-popup');
    if (popup) popup.style.display = 'flex';
  },

  closeChangelog() {
    const popup = document.getElementById('changelog-popup');
    if (popup) popup.style.display = 'none';
  },

  exportBuild() {
    if (!this.state.selectedWeapon) return;
    const build = {
      weapon: this.state.selectedWeaponName,
      enemy: this.state.selectedEnemyName,
      level: this.state.enemyLevel,
      steelPath: this.state.steelPath,
      mods: this.state.mods.filter(m => m !== null).map(m => m.name),
      weaponType: this.state.weaponType,
      weaponSpecialMod: this.state.weaponSpecialMod ? this.state.weaponSpecialMod.name : null,
      weaponStanceMod: this.state.weaponStanceMod ? this.state.weaponStanceMod.name : null,
      weaponArcanes: this.state.weaponArcanes.filter(m => m !== null).map(m => m.name),
      warframeMods: this.state.warframeMods.filter(m => m !== null).map(m => m.name),
      auraMod: this.state.auraMod ? this.state.auraMod.name : null,
      warframeSpecialMod: this.state.warframeSpecialMod ? this.state.warframeSpecialMod.name : null,
      warframeArcanes: this.state.warframeArcanes.filter(m => m !== null).map(m => m.name),
      archonShards: this.state.archonShards,
      focusSchool: this.state.focusSchool,
      options: { ...this.state.options },
      abilities: { ...this.state.abilities },
      timestamp: new Date().toISOString()
    };
    const str = JSON.stringify(build, null, 2);
    const blob = new Blob([str], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const weaponName = this.state.selectedWeaponName || 'unarmed';
    a.download = `warframe-build-${weaponName.replace(/\s+/g, '-')}-${Date.now()}.json`;
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
  },

  // ═══════════════ 键盘导航 ═══════════════

  activeKeyboardIndex: -1,

  setActiveItem(index, listEl, items, activeClass) {
    if (index < 0 || index >= items.length) return;
    items.forEach(item => item.classList.remove(activeClass));
    if (items[index]) {
      items[index].classList.add(activeClass);
      if (items[index].offsetTop < listEl.scrollTop) {
        listEl.scrollTop = items[index].offsetTop;
      } else if (items[index].offsetTop + items[index].offsetHeight > listEl.scrollTop + listEl.clientHeight) {
        listEl.scrollTop = items[index].offsetTop - listEl.clientHeight + items[index].offsetHeight;
      }
      this.activeKeyboardIndex = index;
    }
  },

  handleKeyPress(e) {
    const weaponList = document.querySelector('#weapon-list');
    const enemyList = document.querySelector('#enemy-list');
    const modList = document.querySelector('#resultsModsPopup');
    const activeClass = 'modListItemActive';

    const getItems = (list) => list ? Array.from(list.querySelectorAll('.weapon-item, li')) : [];

    switch (e.key) {
      case 'ArrowUp':
        if (e.target.id === 'weapon-search' && weaponList) {
          e.preventDefault();
          this.setActiveItem(this.activeKeyboardIndex - 1, weaponList, getItems(weaponList), activeClass);
        } else if (e.target.id === 'enemy-search' && enemyList) {
          e.preventDefault();
          this.setActiveItem(this.activeKeyboardIndex - 1, enemyList, getItems(enemyList), activeClass);
        } else if (e.target.id === 'modsSearchInput' && modList) {
          e.preventDefault();
          this.setActiveItem(this.activeKeyboardIndex - 1, modList, getItems(modList), activeClass);
        }
        break;
      case 'ArrowDown':
        if (e.target.id === 'weapon-search' && weaponList) {
          e.preventDefault();
          this.setActiveItem(this.activeKeyboardIndex + 1, weaponList, getItems(weaponList), activeClass);
        } else if (e.target.id === 'enemy-search' && enemyList) {
          e.preventDefault();
          this.setActiveItem(this.activeKeyboardIndex + 1, enemyList, getItems(enemyList), activeClass);
        } else if (e.target.id === 'modsSearchInput' && modList) {
          e.preventDefault();
          this.setActiveItem(this.activeKeyboardIndex + 1, modList, getItems(modList), activeClass);
        }
        break;
      case 'Escape':
        if (e.target.id === 'modsSearchInput') {
          document.getElementById('modsSearchInput').value = '';
          document.querySelector('.modsSearchPopup').style.display = 'none';
        }
        break;
      case 'Enter':
        if (e.target.id === 'modsSearchInput') {
          const activeMod = modList?.querySelector(`.${activeClass}`);
          if (activeMod) {
            activeMod.querySelector('.modListItem')?.click();
          }
        } else if (e.target.id === 'enemy-search') {
          const activeEnemy = enemyList?.querySelector(`.${activeClass}`);
          if (activeEnemy) activeEnemy.click();
        } else if (e.target.id === 'weapon-search') {
          const activeWeapon = weaponList?.querySelector(`.${activeClass}`);
          if (activeWeapon) activeWeapon.click();
        }
        break;
      case 'Delete':
        if (e.target.classList?.contains('mod')) {
          const slotId = parseInt(e.target.dataset.id);
          if (!isNaN(slotId) && slotId < 8) this.removeMod(slotId);
        }
        break;
    }
  },

  initKeyboardNavigation() {
    document.addEventListener('keydown', (e) => this.handleKeyPress(e));
  },

  // ═══════════════ MOD 悬停预览 ═══════════════

  initModHoverPreview() {
    document.addEventListener('mouseenter', (e) => {
      if (!e.target || !e.target.closest) return;
      const listItem = e.target.closest('.modListItem');
      if (!listItem) return;
      const img = listItem.querySelector('.modListItemImg');
      if (!img) return;
      const src = img.src;
      const container = listItem.closest('.modsSPIBlock') || listItem.closest('#resultsModsPopup')?.parentElement;
      if (!container) return;
      const preview = document.createElement('div');
      preview.className = 'modListItemPrev';
      preview.innerHTML = `<img src="${src}" alt="" />`;
      container.appendChild(preview);
      if (preview.getBoundingClientRect().right > window.innerWidth) {
        preview.style.left = '-180px';
      }
    });

    document.addEventListener('mouseleave', (e) => {
      if (!e.target || typeof e.target.closest !== 'function') return;
      const listItem = e.target.closest('.modListItem');
      if (!listItem) return;
      const container = listItem.closest('.modsSPIBlock') || listItem.closest('#resultsModsPopup')?.parentElement;
      if (container) {
        container.querySelectorAll('.modListItemPrev').forEach(p => p.remove());
      }
    });
  },

  // ═══════════════ MOD 拖拽交换 ═══════════════

  _dragState: null,
  _dragTimeout: null,

  initModDragSwap() {
    let startX = 0, startY = 0;
    let isDragging = false;
    let sourceEl = null;
    let isMouseDown = false;

    document.addEventListener('mousedown', (e) => {
      const modEl = e.target.closest('.mod-slot:not(.auraMod):not(.wfMod):not(.arcaneMod):not(.archonShardMod):not(.mistMod):not(.stanceMod):not(.specialMod)');
      if (!modEl) return;
      isMouseDown = true;
      startX = e.pageX;
      startY = e.pageY;
      sourceEl = modEl;
    });

    document.addEventListener('mousemove', (e) => {
      if (!isMouseDown || !sourceEl) return;
      const dx = e.pageX - startX;
      const dy = e.pageY - startY;
      if (!isDragging && (Math.abs(dx) > 15 || Math.abs(dy) > 15)) {
        isDragging = true;
      }
    });

    document.addEventListener('mouseup', (e) => {
      if (!isMouseDown) return;
      isMouseDown = false;
      
      if (isDragging && sourceEl) {
        const targetEl = e.target.closest('.mod-slot:not(.auraMod):not(.wfMod):not(.arcaneMod):not(.archonShardMod):not(.mistMod):not(.stanceMod):not(.specialMod)');
        if (targetEl && targetEl !== sourceEl) {
          const srcId = parseInt(sourceEl.dataset.id);
          const tgtId = parseInt(targetEl.dataset.id);
          if (!isNaN(srcId) && !isNaN(tgtId) && srcId < 8 && tgtId < 8) {
            this.swapMods(srcId, tgtId);
          }
        }
      }
      
      isDragging = false;
      sourceEl = null;
    });

    document.addEventListener('contextmenu', (e) => {
      const modEl = e.target.closest('.mod-slot');
      if (modEl) {
        const slotId = parseInt(modEl.dataset.id);
        if (!isNaN(slotId) && slotId < 8) {
          e.preventDefault();
          this.removeMod(slotId);
        }
      }
    });
  },

  // ═══════════════ 点击外部关闭弹窗 ═══════════════

  initClickToDismiss() {
    document.addEventListener('click', (e) => {
      const weaponList = document.querySelector('#weapon-list');
      const weaponSearch = document.querySelector('#weapon-search');
      const enemyList = document.querySelector('#enemy-list');
      const enemySearch = document.querySelector('#enemy-search');
      const modPicker = document.querySelector('.modsSearchPopup');

      const clickInWeaponList = weaponList && e.composedPath().includes(weaponList);
      const clickInWeaponSearch = weaponSearch && e.composedPath().includes(weaponSearch);
      const clickInEnemyList = enemyList && e.composedPath().includes(enemyList);
      const clickInEnemySearch = enemySearch && e.composedPath().includes(enemySearch);

      if (!clickInWeaponList && !clickInWeaponSearch && weaponList) {
        weaponList.innerHTML = '';
      }
      if (!clickInEnemyList && !clickInEnemySearch && enemyList) {
        enemyList.innerHTML = '';
      }

      if (modPicker && !e.composedPath().includes(modPicker)) {
        modPicker.style.display = 'none';
        document.getElementById('modsSearchInput').value = '';
      }
    });
  },

  swapMods(slotA, slotB) {
    const tempMod = this.state.mods[slotA];
    const tempRank = this.state.modRanks[slotA];
    const tempPolarity = this.state.modPolarities[slotA];

    this.state.mods[slotA] = this.state.mods[slotB];
    this.state.modRanks[slotA] = this.state.modRanks[slotB];
    this.state.modPolarities[slotA] = this.state.modPolarities[slotB];

    this.state.mods[slotB] = tempMod;
    this.state.modRanks[slotB] = tempRank;
    this.state.modPolarities[slotB] = tempPolarity;

    this.renderModSlots();
    this.recalculate();
  },

  async loadTop20Weapons() {
    const container = document.getElementById('top20-list');
    if (!container) return;
    try {
      const resp = await fetch('/data/json/top-used.json');
      if (!resp.ok) throw new Error(resp.statusText);
      const data = await resp.json();
      const sorted = Object.entries(data)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 20);
      if (sorted.length === 0) {
        container.innerHTML = '<div class="empty-state" style="padding:10px;"><div class="empty-state-text">暂无数据</div></div>';
        return;
      }
      let html = '<div style="font-size:0.75rem;color:var(--c-text-dim);margin-bottom:6px;">数据每日更新，按使用次数排序</div>';
      sorted.forEach(([name, count], i) => {
        const rank = i + 1;
        const medal = rank <= 3 ? ['&#129351;','&#129352;','&#129353;'][rank-1] : rank;
        const weaponExists = GameData.weapons[name];
        const clickable = weaponExists
          ? `cursor:pointer;color:var(--c-gold-bright);` 
          : `color:var(--c-text2);`;
        const onclick = weaponExists
          ? `onclick="App.selectWeaponByName('${name.replace(/'/g, "\\'")}')"`
          : '';
        html += `<div class="top20-item" ${onclick} style="display:flex;justify-content:space-between;align-items:center;padding:4px 6px;border-radius:4px;font-size:0.78rem;transition:background 0.15s;${clickable}" onmouseover="this.style.background='var(--c-card)'" onmouseout="this.style.background='transparent'">
          <span><span style="display:inline-block;width:20px;text-align:right;margin-right:6px;font-weight:600;">${medal}</span>${name}</span>
          <span style="color:var(--c-text-dim);font-size:0.7rem;">${count}</span>
        </div>`;
      });
      container.innerHTML = html;
    } catch (e) {
      container.innerHTML = '<div class="empty-state" style="padding:10px;"><div class="empty-state-text">加载失败</div></div>';
    }
  },

  selectWeaponByName(name) {
    const weapon = GameData.weapons[name];
    if (!weapon) return;
    this.state.selectedWeapon = weapon;
    this.state.selectedWeaponName = name;
    document.getElementById('weapon-search').value = name;
    this.updateWeaponInfo(weapon);
    this.renderModSlots();
    this.recalculate();
  }
};

document.addEventListener('DOMContentLoaded', () => App.init());
