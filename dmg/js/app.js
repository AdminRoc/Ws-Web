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
      mirageEclipse: false,
      xakuWhisper: false,
      sarynSpores: false,
      grendelNourish: false,
      kullervoCrit: false,
      harrowCrit: false
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
    modPickerType: 'regular'
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
        if (opt in this.state.options) {
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
      btn.addEventListener('click', () => {
        const key = btn.dataset.ability;
        btn.classList.toggle('active');
        this.state.abilities[key] = btn.classList.contains('active');
        this.recalculate();
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
        }
        this.recalculate();
      });
    });
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

    this.updateWeaponInfo(data);
    this.renderModSlots();
    this.recalculate();

    document.querySelectorAll('#weapon-list .weapon-item').forEach(item => {
      item.classList.toggle('active', item.dataset.name === name);
    });
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

    container.innerHTML = `
      <div class="stat-section">
        <h3>${weapon.category} / ${weapon.type} ${attack.name !== 'Normal Attack' ? '/ ' + attack.name : ''}</h3>
        ${attackTabs}
        <div class="stat-row"><span class="stat-label">伤害</span><span class="stat-value">${totalDmg.toFixed(1)}</span></div>
        <div class="stat-row"><span class="stat-label">暴击几率</span><span class="stat-value">${attack.crit_chance}%</span></div>
        <div class="stat-row"><span class="stat-label">暴击倍率</span><span class="stat-value">${attack.crit_mult}x</span></div>
        <div class="stat-row"><span class="stat-label">状态几率</span><span class="stat-value">${attack.status_chance}%</span></div>
        <div class="stat-row"><span class="stat-label">射速</span><span class="stat-value">${attack.speed.toFixed(2)}/s</span></div>
        ${weapon.magazineSize ? `<div class="stat-row"><span class="stat-label">弹匣</span><span class="stat-value">${weapon.magazineSize}</span></div>` : ''}
        ${weapon.reloadTime ? `<div class="stat-row"><span class="stat-label">装填</span><span class="stat-value">${weapon.reloadTime}s</span></div>` : ''}
        ${weapon.multishot > 1 ? `<div class="stat-row"><span class="stat-label">多重</span><span class="stat-value">${weapon.multishot}</span></div>` : ''}
      </div>
      <div class="stat-section">
        <h3>伤害分布</h3>
        ${Object.entries(attack.damage || {}).filter(([,v]) => v > 0).map(([type, value]) => `
          <div class="stat-row">
            <span class="stat-label" style="display:flex;align-items:center;gap:6px;">
              <span style="width:10px;height:10px;border-radius:50%;background:${DamageCalculator.getColor(type)};display:inline-block;"></span>
              ${DamageCalculator.getName(type)}
            </span>
            <span class="stat-value">${value.toFixed(1)}</span>
          </div>
          <div class="damage-bar">
            <div class="damage-bar-fill" style="width: ${(value / totalDmg) * 100}%; background: ${DamageCalculator.getColor(type)}"></div>
          </div>
        `).join('')}
      </div>
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
    container.innerHTML = `
      <div class="enemy-config">
        <div class="enemy-header">
          <div>
            <div class="enemy-name">${enemy.localeName || this.state.selectedEnemyName}</div>
            <div class="enemy-level">等级 ${this.state.enemyLevel}${this.state.steelPath ? ' [铁臂之路]' : ''}</div>
          </div>
        </div>
        <div class="stat-row"><span class="stat-label">生命值</span><span class="stat-value">${scaled.health.toLocaleString()}</span></div>
        <div class="stat-row"><span class="stat-label">护甲</span><span class="stat-value">${scaled.armor.toLocaleString()}</span></div>
        <div class="stat-row"><span class="stat-label">护盾</span><span class="stat-value">${scaled.shield.toLocaleString()}</span></div>
        <div class="stat-row"><span class="stat-label">护甲减伤</span><span class="stat-value">${dr.toFixed(1)}%</span></div>
        <div class="stat-row"><span class="stat-label">阵营</span><span class="stat-value">${enemy.faction}</span></div>
      </div>
    `;
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
        const imgSrc = mod.img ? `https://warframe-damage.com/data/mods/${mod.img}` : '';
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
            const imgSrc = m.img ? `https://warframe-damage.com/data/mods/${m.img}` : '';
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
        const imgSrc = mod.img ? `https://warframe-damage.com/data/mods/${mod.img}` : '';
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
            const imgSrc = m.img ? `https://warframe-damage.com/data/mods/${m.img}` : '';
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
    const positiveSelects = document.querySelectorAll('.riven-positive-select');
    const negativeSelect = document.getElementById('riven-negative');

    positiveSelects.forEach(select => {
      select.innerHTML = '<option value="">选择属性...</option>' +
        this.RIVEN_POSITIVE_STATS.map(s => {
          const zh = this.RIVEN_STATS_ZH[s] || s;
          return `<option value="${s}">${zh}</option>`;
        }).join('');
    });

    negativeSelect.innerHTML = '<option value="">无负面属性</option>' +
      this.RIVEN_NEGATIVE_STATS.map(s => {
        const zh = this.RIVEN_STATS_ZH[s] || s;
        return `<option value="${s}">${zh}</option>`;
      }).join('');
  },

  createRivenConfirm() {
    const positives = [];
    const positiveValues = [];
    document.querySelectorAll('.riven-positive-select').forEach((select, i) => {
      if (select.value) {
        positives.push(select.value);
        const valInput = document.querySelectorAll('.riven-positive-value')[i];
        positiveValues.push(valInput ? parseFloat(valInput.value) || 0 : 0);
      }
    });

    const negative = document.getElementById('riven-negative').value || null;
    const negValInput = document.getElementById('riven-negative-value');
    const negativeValue = negValInput ? parseFloat(negValInput.value) || 0 : 0;
    const rank = parseInt(document.getElementById('riven-rank-slider').value) || 0;
    const weaponType = document.getElementById('riven-weapon-type').value;

    if (positives.length === 0) return;

    this.state.riven = {
      active: true,
      weaponType: weaponType,
      positives: positives,
      positiveValues: positiveValues,
      negative: negative,
      negativeValue: negativeValue,
      rank: rank
    };

    this.closeRivenCreator();
    this.recalculate();
  },

  // ═══════════════ 计算核心 ═══════════════

  recalculate() {
    if (!this.state.selectedWeapon || !this.state.selectedEnemy) return;

    const weapon = this.state.selectedWeapon;
    const attack = weapon.attacks[this.state.activeAttackIndex] || weapon.attacks[0];

    const effectiveWeapon = {
      ...weapon,
      attacks: [attack],
      multishot: weapon.multishot || 1,
      magazineSize: weapon.magazineSize || 1,
      reloadTime: weapon.reloadTime || 0
    };

    const scaledEnemy = GameData.scaleEnemy(
      this.state.selectedEnemy,
      this.state.enemyLevel,
      this.state.steelPath,
      this.state.eximus
    );

    const equippedMods = this.state.mods.filter(m => m !== null);

    const opts = {
      headshot: this.state.options.headshot,
      steelPath: this.state.steelPath,
      comboMultiplier: this.state.options.comboMultEnabled ? this.state.options.comboMultSlider : 1,
      statusStacks: this.state.options.manualStatusCount ? this.buildStatusStacks() : {},
      heavyAttack: this.state.options.heavyAttack
    };

    const result = DamageCalculator.calculateDPS(effectiveWeapon, equippedMods, scaledEnemy, opts);

    if (result) {
      this.applyAbilities(result);
      this.applyMadurai(result);
      this.applyExternalVirus(result);
      this.applyArmorStrip(result, scaledEnemy);
    }

    this.state.dpsResult = result;
    this.updateDPSDisplay(result);
    this.updateDamageBreakdown(result ? result.breakdown : {});
    this.updateStatusInfo(result);
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
    const dr = DamageCalculator.getDamageReduction(strippedArmor);
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
      return;
    }

    const dps = $('dps-value');
    const raw = $('raw-dps');
    const shot = $('per-shot');
    const fr = $('fire-rate');
    const dot = $('dot-dps');
    const drEl = $('armor-dr');

    if (dps) {
      dps.textContent = DamageCalculator.formatNumber(result.effectiveDPS);
      gsap.set(dps, { scale: 1.2, opacity: 0.5 });
      gsap.to(dps, { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.7)' });
    }
    if (raw) raw.textContent = DamageCalculator.formatNumber(result.rawDPS);
    if (shot) shot.textContent = DamageCalculator.formatNumber(result.total);
    if (fr) fr.textContent = result.fireRate.toFixed(2);
    if (dot) dot.textContent = DamageCalculator.formatNumber(result.dotDPS);
    if (drEl) drEl.textContent = result.dr.toFixed(1) + '%';
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
              ${DamageCalculator.formatNumber(value)}
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
        <div class="stat-row"><span class="stat-label">DoT DPS</span><span class="stat-value">${DamageCalculator.formatNumber(result.dotDPS)}</span></div>
        <div class="stat-row"><span class="stat-label">暴击几率</span><span class="stat-value">${result.critChance.toFixed(1)}%</span></div>
        <div class="stat-row"><span class="stat-label">暴击倍率</span><span class="stat-value">${result.critDamage.toFixed(2)}x</span></div>
        <div class="stat-row"><span class="stat-label">多重射击</span><span class="stat-value">${result.ms.toFixed(2)}</span></div>
        <div class="stat-row"><span class="stat-label">弹丸数</span><span class="stat-value">${result.pellets}</span></div>
      </div>
    `;
    this.updateDetailedDamage(result);
  },

  // ═══════════════ 详细伤害分段 ═══════════════

  updateDetailedDamage(result) {
    if (!result || !this.state.selectedEnemy) return;
    const enemy = this.state.selectedEnemy;
    const scaled = GameData.scaleEnemy(enemy, this.state.enemyLevel, this.state.steelPath, this.state.eximus);
    const breakdown = result.breakdown || {};
    const faction = enemy.faction;

    // 护甲减伤计算
    const armorDR = DamageCalculator.armorDR(scaled.armor);
    const hpContainer = document.getElementById('hp-damage-breakdown');
    if (hpContainer) {
      const totalRaw = Object.values(breakdown).reduce((s, v) => s + v, 0);
      const hpDmg = totalRaw * (1 - armorDR);
      const factionMult = this.getFactionHealthMult(faction);
      const effectiveHpDmg = hpDmg * factionMult;
      hpContainer.innerHTML = `
        <div class="stat-row"><span class="stat-label">原始伤害</span><span class="stat-value">${DamageCalculator.formatNumber(totalRaw)}</span></div>
        <div class="stat-row"><span class="stat-label">护甲减伤后</span><span class="stat-value">${DamageCalculator.formatNumber(hpDmg)}</span></div>
        <div class="stat-row"><span class="stat-label">阵营抗性倍率</span><span class="stat-value">${factionMult.toFixed(2)}x</span></div>
        <div class="stat-row"><span class="stat-label">有效生命值伤害</span><span class="stat-value" style="color:var(--c-red);">${DamageCalculator.formatNumber(effectiveHpDmg)}</span></div>
        ${Object.entries(breakdown).filter(([,v]) => v > 0).map(([type, value]) => `
          <div class="stat-row"><span class="stat-label" style="display:flex;align-items:center;gap:4px;">
            <span style="width:8px;height:8px;border-radius:50%;background:${DamageCalculator.getColor(type)};display:inline-block;"></span>
            ${DamageCalculator.getName(type)}
          </span><span class="stat-value">${DamageCalculator.formatNumber(value * (1 - armorDR) * this.getTypeFactionMult(type, faction, 'health'))}</span></div>
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
          <div class="stat-row"><span class="stat-label">原始伤害</span><span class="stat-value">${DamageCalculator.formatNumber(totalRaw)}</span></div>
          <div class="stat-row"><span class="stat-label">护盾抗性倍率</span><span class="stat-value">${shieldMult.toFixed(2)}x</span></div>
          <div class="stat-row"><span class="stat-label">有效护盾伤害</span><span class="stat-value" style="color:var(--c-cyan);">${DamageCalculator.formatNumber(shieldDmg)}</span></div>
          ${Object.entries(breakdown).filter(([,v]) => v > 0).map(([type, value]) => `
            <div class="stat-row"><span class="stat-label" style="display:flex;align-items:center;gap:4px;">
              <span style="width:8px;height:8px;border-radius:50%;background:${DamageCalculator.getColor(type)};display:inline-block;"></span>
              ${DamageCalculator.getName(type)}
            </span><span class="stat-value">${DamageCalculator.formatNumber(value * this.getTypeFactionMult(type, faction, 'shield'))}</span></div>
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
          <div class="stat-row"><span class="stat-label">原始伤害</span><span class="stat-value">${DamageCalculator.formatNumber(totalRaw)}</span></div>
          <div class="stat-row"><span class="stat-label">有效超宏防护伤害</span><span class="stat-value" style="color:var(--c-purple);">${DamageCalculator.formatNumber(totalRaw)}</span></div>
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
