/**
 * 伤害计算引擎 v2.0
 * 基于公开游戏机制文档和社区数据分析
 * 支持: MOD解析 / 元素组合 / 多重攻击 / AoE / 光束武器 / 蓄力武器 / 状态异常
 */

const DamageCalculator = {

  calculateBuild(weaponName, modNames, enemyName, enemyLevel, options = {}) {
    const weapon = GameData.weapons[weaponName];
    if (!weapon) return null;
    const enemy = GameData.enemies[enemyName];
    if (!enemy) return null;
    const scaledEnemy = GameData.scaleEnemy(enemy, enemyLevel, options.steelPath || false, options.eximus || false);
    const mods = modNames.map(name => GameData.mods.find(m => m.name === name)).filter(Boolean);
    return this.calcDPS(weapon, mods, scaledEnemy, options);
  },

  processMods(mods, weapon, applyWithCond = false) {
    const result = {
      base: 0, critChance: 0, critMult: 0, multishot: 0, speed: 0,
      statusChance: 0, punchThrough: 0, magazineSize: 0, reloadTime: 0,
      statusDamage: 0, basePerStatus: 0, addSlash: 0, addSlashOnImpact: 0,
      smite: {}, element: {}, phys: {},
      flatCritChance: 0, flatCritMult: 0, withCond: {},
      // 暴击系统
      multCritChance: 0,  // 乘法暴击几率
      weakCritChance: 0,  // 弱点暴击几率
      comboCritPer: 0,    // 连击暴击
      heavyCritMult: 0,   // 重击暴击加成
      heavyBaseMult: 0,   // 重击基础伤害加成
      // 状态系统
      statusChanceByCombo: 0,  // 连击状态几率
      // 技能系统
      lifesteal: 0,
      finisherDmg: 0,
      slamMult: 0,
      windUp: 0,
      range: 0,
      meleeComboEff: 0,
      comboDuration: 0,
      initialCombo: 0,
      // 武器特殊属性
      ammoCapacity: 0,
      accuracy: 0,
      recoil: 0,
      shotSpeed: 0,
      beamLength: 0,
      blastRadius: 0,
      zoom: 0,
      statusDuration: 0,
      doubleCrit: 0,      // Vigilante 套装双倍暴击概率
      // 新增：元素特殊效果
      addRadiation: 0,
      addMagnetic: 0,
      addGas: 0,
      addViral: 0,
    };
    mods.forEach(mod => {
      if (!mod || !mod.action) return;
      const a = mod.action;
      if (a.base) result.base += a.base;
      if (a.crit_chance) result.critChance += a.crit_chance;
      if (a.crit_mult) result.critMult += a.crit_mult;
      if (a.multishot) result.multishot += a.multishot;
      if (a.speed) result.speed += a.speed;
      if (a.status_chance) result.statusChance += a.status_chance;
      if (a.punch_through) result.punchThrough += a.punch_through;
      if (a.magazineSize) result.magazineSize += a.magazineSize;
      if (a.reloadTime) result.reloadTime += a.reloadTime;
      if (a.status_damage) result.statusDamage += a.status_damage;
      if (a.base_per_status) result.basePerStatus += a.base_per_status;
      if (a.add_slash) result.addSlash += a.add_slash;
      if (a.add_slash_on_impact) result.addSlashOnImpact += a.add_slash_on_impact;
      if (a.SMITE) Object.entries(a.SMITE).forEach(([f, m]) => { result.smite[f] = (result.smite[f] || 0) + m; });
      if (a.element) Object.entries(a.element).forEach(([e, m]) => { result.element[e] = (result.element[e] || 0) + m; });
      if (a.phys) Object.entries(a.phys).forEach(([e, m]) => { result.phys[e] = (result.phys[e] || 0) + m; });
      if (a.flat_crit_chance) result.flatCritChance += a.flat_crit_chance;
      if (a.crit_mult_add) result.flatCritMult += a.crit_mult_add;
      if (a.WITH_COND) Object.entries(a.WITH_COND).forEach(([k, v]) => { if (typeof v === 'number') result.withCond[k] = (result.withCond[k] || 0) + v; });
      
      // 新增：暴击系统属性
      if (a.mult_crit_chance) result.multCritChance += a.mult_crit_chance;
      if (a.crit_chance_weakp) result.weakCritChance += a.crit_chance_weakp;
      if (a.crit_chance_per_combo) result.comboCritPer += a.crit_chance_per_combo;
      if (a.heavy_crit_mult) result.heavyCritMult += a.heavy_crit_mult;
      if (a.base_heavy) result.heavyBaseMult += a.base_heavy;
      
      // 新增：状态系统属性
      if (a.status_chance_by_combo) result.statusChanceByCombo += a.status_chance_by_combo;
      
      // 新增：技能属性
      if (a.lifesteal) result.lifesteal += a.lifesteal;
      if (a.finisherDmg) result.finisherDmg += a.finisherDmg;
      if (a.slam_mult) result.slamMult += a.slam_mult;
      if (a.windUp) result.windUp += a.windUp;
      if (a.range) result.range += a.range;
      if (a.melee_combo_eff) result.meleeComboEff += a.melee_combo_eff;
      if (a.comboDuration) result.comboDuration += a.comboDuration;
      if (a.initialCombo) result.initialCombo += a.initialCombo;
      
      // 新增：武器特殊属性
      if (a.ammoCapacity) result.ammoCapacity += a.ammoCapacity;
      if (a.accuracy) result.accuracy += a.accuracy;
      if (a.recoil) result.recoil += a.recoil;
      if (a.shot_speed) result.shotSpeed += a.shot_speed;
      if (a.beam_length) result.beamLength += a.beam_length;
      if (a.blast_radius) result.blastRadius += a.blast_radius;
      if (a.zoom) result.zoom += a.zoom;
      if (a.status_duration) result.statusDuration += a.status_duration;
      if (a.double_crit) result.doubleCrit += a.double_crit;
      
      // 新增：元素特殊效果
      if (a.addRadiation) result.addRadiation += a.addRadiation;
      if (a.addMagnetic) result.addMagnetic += a.addMagnetic;
      if (a.addGas) result.addGas += a.addGas;
      if (a.addViral) result.addViral += a.addViral;
    });

    // 当 isMaxCond 为 true 时, 将 WITH_COND 的值叠加到对应的基础属性上
    if (applyWithCond && result.withCond) {
      const wc = result.withCond;
      if (wc.base) result.base += wc.base;
      if (wc.crit_chance) result.critChance += wc.crit_chance;
      if (wc.crit_mult) result.critMult += wc.crit_mult;
      if (wc.multishot) result.multishot += wc.multishot;
      if (wc.speed) result.speed += wc.speed;
      if (wc.status_chance) result.statusChance += wc.status_chance;
      if (wc.status_damage) result.statusDamage += wc.status_damage;
      if (wc.flat_crit_chance) result.flatCritChance += wc.flat_crit_chance;
      if (wc.crit_mult_add) result.flatCritMult += wc.crit_mult_add;
      if (wc.reloadTime) result.reloadTime += wc.reloadTime;
      if (wc.punch_through) result.punchThrough += wc.punch_through;
      if (wc.range) result.range += wc.range;
      if (wc.status_chance_by_combo) result.statusChanceByCombo += wc.status_chance_by_combo;
      if (wc.crit_chance_per_combo) result.comboCritPer += wc.crit_chance_per_combo;
      if (wc.element) Object.entries(wc.element).forEach(([e, m]) => { result.element[e] = (result.element[e] || 0) + m; });
    }

    return result;
  },

  resolveElements(modActions) {
    const baseElements = {};
    const physicalElements = {};
    modActions.forEach(action => {
      if (action.phys) Object.entries(action.phys).forEach(([el, mult]) => { physicalElements[el] = (physicalElements[el] || 0) + mult; });
      if (action.element) Object.entries(action.element).forEach(([el, mult]) => {
        if (GameData.BASE_ELEMENTS.includes(el)) baseElements[el] = (baseElements[el] || 0) + mult;
      });
    });
    const elementOrder = ['Cold', 'Heat', 'Toxin', 'Electricity'];
    const activeElements = elementOrder.filter(el => baseElements[el] > 0);
    const combinedElements = {};
    const temp = [...activeElements];
    while (temp.length >= 2) {
      const a = temp.shift(), b = temp.shift();
      const combined = GameData.ELEMENT_COMBOS[[a, b].sort().join('+')];
      if (combined) { combinedElements[combined] = (combinedElements[combined] || 0) + 1; temp.push(combined); }
    }
    const allElements = {};
    Object.entries(physicalElements).forEach(([k, v]) => { allElements[k] = (allElements[k] || 0) + v; });
    Object.entries(baseElements).forEach(([k, v]) => { allElements[k] = (allElements[k] || 0) + v; });
    Object.entries(combinedElements).forEach(([k, v]) => { allElements[k] = (allElements[k] || 0) + v; });
    return { physical: physicalElements, base: baseElements, combined: combinedElements, all: allElements };
  },

  getAttackCombos(weapon) {
    if (weapon.comb && weapon.comb.length > 0) return weapon.comb;
    return [[0]];
  },

  getAttackBaseDamage(attack, processedMods, weapon) {
    const weaponDamage = attack.damage || {};
    const result = {};
    Object.entries(weaponDamage).forEach(([type, value]) => { result[type] = value; });
    const baseMultiplier = 1 + processedMods.base;
    const physMult = {};
    if (processedMods.phys) Object.entries(processedMods.phys).forEach(([type, mult]) => { physMult[type] = 1 + mult; });
    const elements = this.resolveElements([processedMods]);
    Object.keys(result).forEach(type => { result[type] *= baseMultiplier; });
    Object.keys(result).forEach(type => { if (physMult[type]) result[type] *= physMult[type]; });
    Object.entries(elements.base).forEach(([type, mult]) => {
      const baseVal = weaponDamage[type] || 0;
      if (baseVal > 0) {
        result[type] = baseVal * baseMultiplier * (1 + mult);
        if (physMult[type]) result[type] *= physMult[type];
      } else {
        const totalBase = Object.values(weaponDamage).reduce((s, v) => s + v, 0);
        result[type] = totalBase * baseMultiplier * mult;
      }
    });
    const totalBaseDmg = Object.values(result).reduce((s, v) => s + v, 0);
    Object.entries(elements.combined).forEach(([type, count]) => {
      result[type] = (result[type] || 0) + totalBaseDmg * count;
    });
    return result;
  },

  getAoEFalloff(attack, distance) {
    if (!attack.falloff) return 1;
    const { start, end, reduction } = attack.falloff;
    if (distance === undefined || distance === null) return 1 - reduction;
    if (distance <= start) return 1;
    if (distance >= end) return 1 - reduction;
    const range = end - start;
    const factor = (distance - start) / range;
    return 1 - (reduction * factor);
  },

  isBeamAttack(attack) {
    return attack.shot_type === 'Beam' || attack.shot_type === 'Discharge';
  },

  isAoEAttack(attack) {
    return attack.shot_type === 'AoE';
  },

  calculateBaseDamage(weapon, processedMods) {
    const combos = this.getAttackCombos(weapon);
    const result = {};
    combos.forEach(combo => {
      combo.forEach(attackIndex => {
        const attack = weapon.attacks[attackIndex];
        if (!attack) return;
        const attackDmg = this.getAttackBaseDamage(attack, processedMods, weapon);
        const falloffMult = this.getAoEFalloff(attack);
        Object.entries(attackDmg).forEach(([type, value]) => {
          result[type] = (result[type] || 0) + value * falloffMult;
        });
      });
    });
    return result;
  },

  getAttackCritChance(atk, pMods, opts = {}) {
    const bCrit = atk.crit_chance / 100;
    const mCrit = pMods.critChance;
    const fCrit = pMods.flatCritChance;
    
    // 乘法暴击几率
    const mCritMult = 1 + pMods.multCritChance;
    
    // 弱点暴击几率
    const wCrit = opts.isHeadshot ? pMods.weakCritChance : 0;
    const wMult = opts.isMultiplicativeWeakCC ? 1 + wCrit : 1;
    
    // 连击暴击
    const cCrit = opts.comboMultiplier ? opts.comboMultiplier * pMods.comboCritPer : 0;
    
    // 重击暴击加成
    const hCrit = opts.isHeavy ? pMods.heavyCritMult : 0;
    
    // 最终暴击几率
    const fCritChance = (bCrit * (1 + mCrit) + fCrit) * mCritMult * wMult + cCrit + hCrit;
    return Math.min(fCritChance, 5);
  },

  getAttackCritMultiplier(atk, pMods, opts = {}) {
    const bMult = atk.crit_mult;
    const mMult = pMods.critMult;
    const fMult = pMods.flatCritMult;
    
    // 重击暴击倍率
    const hMult = opts.isHeavy ? pMods.heavyCritMult : 0;
    
    // 暴击等级判定
    const critChance = this.getAttackCritChance(atk, pMods, opts);
    const tier = Math.floor(critChance);
    const frac = critChance - tier;
    const hitTier = Math.random() < frac ? tier + 1 : tier;
    
    // 计算暴击倍率
    let critMult;
    if (opts.isHeadshot) {
      const headMult = GameData.HEADSHOT_MULT_INITIAL;
      critMult = headMult * (1 + hitTier * (2 * bMult * (1 + mMult) - 1));
    } else {
      critMult = 1 + hitTier * (bMult * (1 + mMult) - 1);
    }
    
    // 添加平坦暴击倍率
    critMult += fMult;
    
    // 添加武器特殊暴击倍率
    if (atk.unique && atk.unique.crit_mult) critMult += atk.unique.crit_mult;
    
    // 应用重击倍率
    critMult *= (1 + hMult);
    
    return { critMult, hitTier };
  },

  getAttackStatusChance(atk, pMods, opts = {}) {
    const bSC = atk.status_chance / 100;
    const mSC = pMods.statusChance;
    
    // 连击状态几率
    const cSC = opts.comboMultiplier ? opts.comboMultiplier * pMods.statusChanceByCombo : 0;
    
    // 最终状态几率
    const fSC = bSC * (1 + mSC + cSC);
    return Math.min(fSC, 10);
  },

  getAttackFireRate(atk, pMods) {
    const bSpd = atk.speed;
    const mSpd = pMods.speed;
    let spd = bSpd * (1 + mSpd);
    if (atk.unique && atk.unique.speed_mult) spd *= atk.unique.speed_mult;
    return spd;
  },

  calculateCritChance(weapon, pMods) {
    const atk = weapon.attacks[0];
    return this.getAttackCritChance(atk, pMods);
  },

  calculateCritMultiplier(weapon, pMods) {
    const atk = weapon.attacks[0];
    return this.getAttackCritMultiplier(atk, pMods);
  },

  getExpectedCritMult(critChance, critDamage) {
    return 1 + critChance * critDamage;
  },

  calcDotDPS(bDmg, statusChance, critChance, critDmg, eArmor, fMult, pMods, sStacks = {}) {
    let totalDotDPS = 0;
    Object.entries(bDmg).forEach(([type, dmg]) => {
      if (dmg <= 0) return;
      const tMult = GameData.DOT_TICK_MULT[type] || 0;
      if (tMult === 0) return;
      let tDmg = 0;
      const isPhys = GameData.PHYSICAL.includes(type);
      if (isPhys) {
        tDmg = dmg * tMult;
        if (type !== 'Slash') tDmg *= (1 - this.getDMGReduction(eArmor));
      } else {
        const totalBase = Object.values(bDmg).reduce((s, v) => s + v, 0);
        tDmg = totalBase * tMult;
        tDmg *= (1 - this.getDMGReduction(eArmor));
      }
      if (pMods && pMods.statusDamage) tDmg *= (1 + pMods.statusDamage);
      tDmg *= fMult * fMult;
      const expectedProcs = statusChance;
      const duration = GameData.STATUS_DURATION[type] || 6;
      totalDotDPS += tDmg * expectedProcs / duration;
    });
    return totalDotDPS;
  },

  // 状态效果对伤害的增益
  getStatusDmgMult(sStacks, dmgType, isShield = false) {
    let mult = 1;
    
    // Viral: 每层 +25% 对生命值伤害，最多10层
    if (sStacks.Viral > 0 && !isShield) {
      const viralCount = Math.min(sStacks.Viral, 10);
      mult *= (1 + viralCount * 0.25);
    }
    
    // Magnetic: 每层 +25% 护盾伤害，最多10层
    if (sStacks.Magnetic > 0 && isShield) {
      const magCount = Math.min(sStacks.Magnetic, 10);
      mult *= (1 + magCount * 0.25);
    }
    
    // Corrosive: 每层 -25% 护甲，最多10层（永久）
    if (sStacks.Corrosive > 0) {
      const corrCount = Math.min(sStacks.Corrosive, 10);
      // 护甲削减已在 getEffArmor 中处理
    }
    
    // Heat: 立即削减50%护甲 + 持续6秒燃烧
    if (sStacks.Heat > 0) {
      // Heat 护甲削减已在 getEffArmor 中处理
    }
    
    return mult;
  },

  // 状态效果对护盾的伤害
  getShieldDmgMult(sStacks) {
    let mult = 1;
    
    // Magnetic: 每层 +25% 护盾伤害，最多10层
    if (sStacks.Magnetic > 0) {
      const magCount = Math.min(sStacks.Magnetic, 10);
      mult *= (1 + magCount * 0.25);
    }
    
    return mult;
  },

  // 状态效果对护甲的削减
  getArmorReduction(sStacks) {
    let red = 0;
    
    // Corrosive: 每层 -25% 护甲，最多10层（永久）
    if (sStacks.Corrosive > 0) {
      const corrCount = Math.min(sStacks.Corrosive, 10);
      red += corrCount * 0.25;
    }
    
    // Heat: 立即削减50%护甲
    if (sStacks.Heat > 0) {
      red += 0.5;
    }
    
    return Math.min(red, 1); // 最多削减100%护甲
  },

  // 状态效果的持续伤害
  calcStatusDoT(type, bDmg, cMult, eArmor, fMult, pMods, sStacks = {}) {
    const tMult = GameData.DOT_TICK_MULT[type] || 0;
    if (tMult === 0) return 0;
    
    let tDmg = 0;
    const isPhys = GameData.PHYSICAL.includes(type);
    
    if (isPhys) {
      tDmg = bDmg * tMult;
      if (type !== 'Slash') tDmg *= (1 - this.getDMGReduction(eArmor));
    } else {
      const totalBase = Object.values(bDmg).reduce((s, v) => s + v, 0);
      tDmg = totalBase * tMult;
      tDmg *= (1 - this.getDMGReduction(eArmor));
    }
    
    // 暴击倍率
    tDmg *= cMult;
    
    // 状态伤害加成
    if (pMods && pMods.statusDamage) {
      tDmg *= (1 + pMods.statusDamage);
    }
    
    // 阵营双倍加成
    tDmg *= fMult * fMult;
    
    return tDmg;
  },

  // Slash DoT（无视护甲）
  calcSlashDoT(bDmg, cMult, fMult, pMods) {
    const slashDmg = bDmg * 0.35; // 35% 基础伤害
    let tDmg = slashDmg * cMult;
    
    // 状态伤害加成
    if (pMods && pMods.statusDamage) {
      tDmg *= (1 + pMods.statusDamage);
    }
    
    // 阵营双倍加成
    tDmg *= fMult * fMult;
    
    return tDmg;
  },

  // Toxin DoT（穿透护盾）
  calcToxinDoT(bDmg, cMult, eArmor, fMult, pMods) {
    const totalBase = Object.values(bDmg).reduce((s, v) => s + v, 0);
    const tDmg = totalBase * 0.5 * cMult; // 50% 基础伤害
    
    // Toxin 穿透护盾，直接伤害生命值
    // 但仍受护甲减伤影响
    let fDmg = tDmg * (1 - this.getDMGReduction(eArmor));
    
    // 状态伤害加成
    if (pMods && pMods.statusDamage) {
      fDmg *= (1 + pMods.statusDamage);
    }
    
    // 阵营双倍加成
    fDmg *= fMult * fMult;
    
    return fDmg;
  },

  // Electricity DoT（连锁闪电）
  calcElectricDoT(bDmg, cMult, eArmor, fMult, pMods) {
    const totalBase = Object.values(bDmg).reduce((s, v) => s + v, 0);
    const tDmg = totalBase * 1.0 * cMult; // 100% 基础伤害瞬间
    
    // Electricity 受护甲减伤影响
    let fDmg = tDmg * (1 - this.getDMGReduction(eArmor));
    
    // 状态伤害加成
    if (pMods && pMods.statusDamage) {
      fDmg *= (1 + pMods.statusDamage);
    }
    
    // 阵营双倍加成
    fDmg *= fMult * fMult;
    
    return fDmg;
  },

  // Gas DoT（毒气云）
  calcGasDoT(bDmg, cMult, eArmor, fMult, pMods) {
    const totalBase = Object.values(bDmg).reduce((s, v) => s + v, 0);
    const tDmg = totalBase * 0.75 * cMult; // 75% 基础伤害
    
    // Gas 受护甲减伤影响
    let fDmg = tDmg * (1 - this.getDMGReduction(eArmor));
    
    // 状态伤害加成
    if (pMods && pMods.statusDamage) {
      fDmg *= (1 + pMods.statusDamage);
    }
    
    // 阵营双倍加成
    fDmg *= fMult * fMult;
    
    return fDmg;
  },

  // Heat DoT（燃烧）
  calcHeatDoT(bDmg, cMult, eArmor, fMult, pMods) {
    const totalBase = Object.values(bDmg).reduce((s, v) => s + v, 0);
    const tDmg = totalBase * 0.5 * cMult; // 50% 基础伤害
    
    // Heat 受护甲减伤影响
    let fDmg = tDmg * (1 - this.getDMGReduction(eArmor));
    
    // 状态伤害加成
    if (pMods && pMods.statusDamage) {
      fDmg *= (1 + pMods.statusDamage);
    }
    
    // 阵营双倍加成
    fDmg *= fMult * fMult;
    
    return fDmg;
  },

  // Radiation DoT（辐射）
  calcRadDoT(bDmg, cMult, eArmor, fMult, pMods) {
    const totalBase = Object.values(bDmg).reduce((s, v) => s + v, 0);
    const tDmg = totalBase * 0.5 * cMult; // 50% 基础伤害
    
    // Radiation 受护甲减伤影响
    let fDmg = tDmg * (1 - this.getDMGReduction(eArmor));
    
    // 状态伤害加成
    if (pMods && pMods.statusDamage) {
      fDmg *= (1 + pMods.statusDamage);
    }
    
    // 阵营双倍加成
    fDmg *= fMult * fMult;
    
    return fDmg;
  },

  // Blast DoT（爆炸）
  calcBlastDoT(bDmg, cMult, eArmor, fMult, pMods) {
    const totalBase = Object.values(bDmg).reduce((s, v) => s + v, 0);
    const tDmg = totalBase * 3.0 * cMult; // 300% 基础伤害 AoE
    
    // Blast 受护甲减伤影响
    let fDmg = tDmg * (1 - this.getDMGReduction(eArmor));
    
    // 状态伤害加成
    if (pMods && pMods.statusDamage) {
      fDmg *= (1 + pMods.statusDamage);
    }
    
    // 阵营双倍加成
    fDmg *= fMult * fMult;
    
    return fDmg;
  },

  // 技能附加伤害
  calcAbilityDMG(bDmg, abStr, pMods, opts = {}) {
    let totalAbDMG = 0;
    
    // Rhino Roar: 乘法伤害加成
    if (opts.rhinoRoar) {
      const roarM = 1 + (opts.rhinoRoarPercent || 30) / 100;
      totalAbDMG += Object.values(bDmg).reduce((s, v) => s + v, 0) * (roarM - 1);
    }
    
    // Mirage Eclipse: 乘法伤害加成
    if (opts.mirageEclipse) {
      const eclM = 1 + (opts.mirageEclipsePercent || 30) / 100;
      totalAbDMG += Object.values(bDmg).reduce((s, v) => s + v, 0) * (eclM - 1);
    }
    
    // Xata's Whisper: 虚空伤害基于武器伤害
    if (opts.xakuWhisper) {
      const xataM = (opts.xakuWhisperPercent || 26) / 100;
      const totalBase = Object.values(bDmg).reduce((s, v) => s + v, 0);
      totalAbDMG += totalBase * xataM * (abStr / 100);
    }
    
    // Toxic Lash: 毒素伤害附加
    if (opts.toxicLash) {
      const tlM = (opts.toxicLashPercent || 30) / 100;
      const totalBase = Object.values(bDmg).reduce((s, v) => s + v, 0);
      totalAbDMG += totalBase * tlM * (abStr / 100);
    }
    
    // Nourish: 病毒伤害附加
    if (opts.grendelNourish) {
      const nourM = (opts.grendelNourishPercent || 45) / 100;
      const totalBase = Object.values(bDmg).reduce((s, v) => s + v, 0);
      totalAbDMG += totalBase * nourM * (abStr / 100);
    }
    
    // Madurai: 物理伤害提高30%
    if (opts.madurai) {
      const physTypes = ['Impact', 'Puncture', 'Slash'];
      const physDmg = physTypes.reduce((sum, type) => sum + (bDmg[type] || 0), 0);
      totalAbDMG += physDmg * 0.3;
    }
    
    return totalAbDMG;
  },

  // Kullervo/Harrow 绝对暴击几率加成
  getAbsCritBonus(opts) {
    let bonus = 0;
    
    // Kullervo 暴怒突进
    if (opts.kullervoCrit) {
      bonus += (opts.kullervoCritPercent || 50) / 100;
    }
    
    // Harrow 庇佑圣约
    if (opts.harrowCrit) {
      bonus += (opts.harrowCritPercent || 50) / 100;
    }
    
    return bonus;
  },

  calcMultishot(weapon, pMods) {
    const bMS = weapon.multishot || 1;
    const mMS = pMods.multishot;
    return bMS * (1 + mMS);
  },

  calcFireRate(weapon, pMods) {
    const atk = weapon.attacks[0];
    return this.getAttackFireRate(atk, pMods);
  },

  calcStatusChance(weapon, pMods) {
    const atk = weapon.attacks[0];
    return this.getAttackStatusChance(atk, pMods);
  },

  calcMagSize(weapon, pMods) {
    const bMag = weapon.magazineSize;
    const mMag = pMods.magazineSize;
    return Math.floor(bMag * (1 + mMag));
  },

  calcReload(weapon, pMods) {
    const bRel = weapon.reloadTime;
    const mRel = pMods.reloadTime;
    return bRel * (1 + mRel);
  },

  getHitTier(critChance) {
    const floor = Math.floor(critChance);
    const frac = critChance - floor;
    const upgraded = Math.random() < frac;
    return upgraded ? floor + 1 : floor;
  },

  getEffCritMult(tier, critDmg) {
    if (tier === 0) return 1;
    return 1 + tier * critDmg;
  },

  rollProcCount(statusChance) {
    if (statusChance <= 0) return 0;
    const floor = Math.floor(statusChance);
    const frac = statusChance - floor;
    return floor + (Math.random() < frac ? 1 : 0);
  },

  drawProcType(dmgVec) {
    const types = Object.keys(dmgVec);
    const weights = types.map(type => {
      const dmg = dmgVec[type] || 0;
      return dmg * (GameData.PHYSICAL.includes(type) ? 4 : 1);
    });
    const totalW = weights.reduce((s, w) => s + w, 0);
    if (totalW <= 0) return 'Impact';
    let roll = Math.random() * totalW;
    for (let i = 0; i < types.length; i++) {
      roll -= weights[i];
      if (roll <= 0) return types[i];
    }
    return types[types.length - 1];
  },

  getDMGReduction(armor) {
    if (armor <= 0) return 0;
    return 0.9 * Math.sqrt(Math.min(armor, GameData.ARMOR_CAP) / GameData.ARMOR_CAP);
  },

  getEffArmor(baseArmor, corrStacks = 0, heatStacks = 0) {
    let armor = baseArmor;
    armor *= Math.pow(0.75, corrStacks);
    armor *= Math.pow(0.5, heatStacks);
    return Math.max(0, armor);
  },

  armorDR(armor) { return this.getDMGReduction(armor); },

  getFactMult(faction, mods) {
    if (!mods.smite || !mods.smite[faction]) return 1;
    return 1 + mods.smite[faction];
  },

  getFactResist(faction, dmgType) {
    const res = GameData.FACTION_RESISTANCES[faction];
    if (!res) return 1;
    return res[dmgType] || 1;
  },

  calcPerShot(weapon, pMods, enemy, opts = {}) {
    const {
      headshot = false,
      corrStacks = 0,
      heatStacks = 0,
      comboMultiplier = 0,
      statusStacks = {},
      isHeavy = false,
      isMultiplicativeWeakCC = false,
    } = opts;

    const ms = this.calcMultishot(weapon, pMods);
    const fireRate = this.calcFireRate(weapon, pMods);
    const magSize = this.calcMagSize(weapon, pMods);
    const reloadTime = this.calcReload(weapon, pMods);
    const factMult = this.getFactMult(enemy.faction, pMods);
    const eArmor = this.getEffArmor(enemy.armor, corrStacks, heatStacks);
    const dr = this.getDMGReduction(eArmor);
    const coStacks = Object.values(statusStacks).reduce((s, v) => s + v, 0);
    const coMult = 1 + coStacks * pMods.basePerStatus;

    const combos = this.getAttackCombos(weapon);
    let totalDmg = 0;
    let totalDotDPS = 0;
    const breakdown = {};
    let wCritChance = 0;
    let wCritDmg = 0;
    let wStatusChance = 0;

    combos.forEach(combo => {
      combo.forEach(atkIdx => {
        const atk = weapon.attacks[atkIdx];
        if (!atk) return;

        const bDmg = this.getAttackBaseDamage(atk, pMods, weapon);
        const fallMult = this.getAoEFalloff(atk);

        // 暴击和状态计算选项
        const critOpts = {
          isHeadshot: headshot,
          comboMultiplier,
          isHeavy,
          isMultiplicativeWeakCC,
        };
        
        const critChance = this.getAttackCritChance(atk, pMods, critOpts);
        const critRes = this.getAttackCritMultiplier(atk, pMods, critOpts);
        const critDmg = critRes.critMult;
        const hitTier = critRes.hitTier;
        const statusChance = this.getAttackStatusChance(atk, pMods, { comboMultiplier });

        wCritChance += critChance;
        wCritDmg += critDmg;
        wStatusChance += statusChance;

        const isAoE = this.isAoEAttack(atk);
        const noHead = atk.no_headshot_mult || false;
        const headM = headshot && !noHead ? GameData.HEADSHOT_MULT_INITIAL : 1;

        let atkTotalDmg = 0;
        Object.entries(bDmg).forEach(([type, dmg]) => {
          if (dmg <= 0) return;
          
          // 暴击倍率计算
          let fDmg = dmg * fallMult * critDmg * coMult;
          
          // 头部倍率
          if (headshot && !noHead) {
            fDmg *= headM;
          }
          
          if (type !== 'Slash') fDmg *= (1 - dr);
          const resist = this.getFactResist(enemy.faction, type);
          fDmg *= resist;
          breakdown[type] = (breakdown[type] || 0) + fDmg;
          atkTotalDmg += fDmg;
        });

        // 重击基础伤害加成
        if (isHeavy) {
          atkTotalDmg *= (1 + pMods.heavyBaseMult);
        }

        atkTotalDmg *= factMult;
        
        // 技能附加伤害
        const abDmg = this.calcAbilityDMG(bDmg, opts.abilityStrength || 100, pMods, opts);
        atkTotalDmg += abDmg;
        
        totalDmg += atkTotalDmg;

        const dotDPS = this.calcDotDPS(bDmg, statusChance, critChance, critDmg, eArmor, factMult, pMods, opts.statusStacks);
        totalDotDPS += dotDPS;
      });
    });

    const numCombos = combos.length;
    const avgCritChance = numCombos > 0 ? wCritChance / numCombos : 0;
    const avgCritDmg = numCombos > 0 ? wCritDmg / numCombos : 0;
    const avgStatusChance = numCombos > 0 ? wStatusChance / numCombos : 0;

    const pellets = ms;
    const totalPerShot = totalDmg * pellets;
    const cycleTime = magSize / fireRate + reloadTime;
    const magDmg = totalPerShot;
    const effDPS = (magDmg * fireRate) / cycleTime;
    const rawDPS = totalDmg * pellets * fireRate;

    return {
      total: totalPerShot,
      totalWithDot: totalPerShot + totalDotDPS,
      breakdown,
      dotDPS: totalDotDPS,
      rawDPS,
      effectiveDPS: effDPS + totalDotDPS,
      pellets,
      critChance: Math.min(avgCritChance * 100, 500),
      critDmg: avgCritDmg,
      statusChance: Math.min(avgStatusChance * 100, 1000),
      ms,
      fireRate,
      magSize,
      reloadTime,
      dr: dr * 100
    };
  },

  calcDotDMG(type, bDmg, eArmor, fMult, pMods) {
    const tMult = GameData.DOT_TICK_MULT[type] || 0;
    if (tMult === 0) return 0;
    let tDmg = 0;
    const isPhys = GameData.PHYSICAL.includes(type);
    if (isPhys) {
      tDmg = (bDmg[type] || 0) * tMult;
      if (type !== 'Slash') tDmg *= (1 - this.getDMGReduction(eArmor));
    } else {
      const totalBase = Object.values(bDmg).reduce((s, v) => s + v, 0);
      tDmg = totalBase * tMult;
      tDmg *= (1 - this.getDMGReduction(eArmor));
    }
    if (pMods && pMods.statusDamage) tDmg *= (1 + pMods.statusDamage);
    tDmg *= fMult * fMult;
    return tDmg;
  },

  calcDPS(weapon, mods, enemy, opts = {}) {
    const applyWithCond = opts.applyWithCond === true;
    const pMods = this.processMods(mods, weapon, applyWithCond);
    const perShot = this.calcPerShot(weapon, pMods, enemy, opts);
    
    // TTK
    const ttk = this.calcTTK(perShot, enemy);
    
    // 队列式TTK (更精确)
    const queueTTK = this.calcTTKQueue(perShot, enemy, opts);
    
    return {
      ...perShot,
      ttk,
      queueTTK: queueTTK.ttk,
      ttkRegions: queueTTK.regions,
      format: {
        effective: this.fmtNum(perShot.effectiveDPS),
        raw: this.fmtNum(perShot.rawDPS),
        perShot: this.fmtNum(perShot.total),
        ttk: this.fmtTime(ttk),
        queueTTK: this.fmtTime(queueTTK.ttk)
      }
    };
  },

  calcTTK(perShot, enemy) {
    if (!enemy || !perShot) return 0;
    
    const totalHP = (enemy.health || 0) + (enemy.shield || 0) + (enemy.overguard || 0);
    if (totalHP <= 0) return 0;
    
    // DPS
    const dps = perShot.effectiveDPS || perShot.rawDPS || 0;
    if (dps <= 0) return Infinity;
    
    // TTK = 总生命值 / DPS
    const ttk = totalHP / dps;
    
    return ttk;
  },

  /**
   * 队列式TTK计算 (弹匣-by-弹匣模拟)
   * 按照实际射击节奏: 射击→装填→射击, 更精确地计算击杀时间
   * 同时追踪4个区域 (超宏防护/护盾/护甲/生命值)
   */
  calcTTKQueue(perShot, enemy, opts = {}) {
    if (!enemy || !perShot) return { ttk: 0, regions: { overguard: 0, shield: 0, armor: 0, health: 0 } };

    let overguard = enemy.overguard || 0;
    let shield = enemy.shield || 0;
    let armor = enemy.armor || 0;
    let health = enemy.health || 0;

    if (overguard + shield + armor + health <= 0) return { ttk: 0, regions: { overguard: 0, shield: 0, armor: 0, health: 0 } };

    const fireRate = perShot.fireRate || 1;
    const magSize = perShot.magSize || 1;
    const reloadTime = perShot.reloadTime || 0;
    const pellets = perShot.pellets || 1;
    const critChance = (perShot.critChance || 0) / 100;
    const critDmg = perShot.critDmg || 1;

    const timePerShot = 1 / fireRate;
    const cycleTime = (magSize / fireRate) + reloadTime;
    const perPelletDmg = perShot.total / pellets;

    const dr = perShot.dr / 100 || 0;
    const faction = enemy.faction || 'Unknown';

    let totalTime = 0;
    let shotsInMag = 0;
    let regions = { overguard: 0, shield: 0, armor: 0, health: 0 };

    const maxIterations = 10000;
    let iterations = 0;

    while ((overguard + shield + health) > 0 && iterations < maxIterations) {
      iterations++;

      const isCrit = Math.random() < critChance;
      const critMult = isCrit ? (1 + critDmg) : 1;

      let pelletDmg = perPelletDmg * critMult;
      let dotDmg = perShot.dotDPS ? (perShot.dotDPS / fireRate) : 0;

      // 超宏防护阶段 (所有伤害类型均等)
      if (overguard > 0) {
        const ogDmg = pelletDmg * pellets;
        overguard -= ogDmg;
        regions.overguard += ogDmg;
        if (overguard <= 0) { regions.overguard += overguard; overguard = 0; }
      }
      // 护盾阶段 (磁力伤害+25%, 毒素穿透)
      else if (shield > 0) {
        const shDmg = pelletDmg * pellets;
        shield -= shDmg;
        regions.shield += shDmg;
        if (shield <= 0) { regions.shield += shield; shield = 0; }
      }
      // 生命值阶段 (受护甲减伤)
      else if (health > 0) {
        const hpDmg = pelletDmg * pellets * (1 - dr);
        health -= hpDmg;
        regions.health += hpDmg;
        if (health <= 0) { regions.health += health; health = 0; }
      }

      shotsInMag++;
      totalTime += timePerShot;

      if (shotsInMag >= magSize && (overguard + shield + health) > 0) {
        totalTime += reloadTime;
        shotsInMag = 0;
      }
    }

    return {
      ttk: totalTime,
      regions,
      experimental: true
    };
  },

  /**
   * 中位数TTK计算 (多次模拟取中位数)
   */
  calcMedianTTK(perShot, enemy, iterations = 100) {
    const results = [];
    for (let i = 0; i < iterations; i++) {
      const r = this.calcTTKQueue(perShot, enemy);
      results.push(r.ttk);
    }
    results.sort((a, b) => a - b);
    const median = results[Math.floor(results.length / 2)];
    const avg = results.reduce((s, v) => s + v, 0) / results.length;
    const min = results[0];
    const max = results[results.length - 1];
    return { median, avg, min, max, experimental: true };
  },

  fmtTime(sec) {
    if (sec === Infinity) return '∞';
    if (sec <= 0) return '0s';
    if (sec < 1) return (sec * 1000).toFixed(0) + 'ms';
    if (sec < 60) return sec.toFixed(2) + 's';
    const min = Math.floor(sec / 60);
    const rem = sec % 60;
    return `${min}m ${rem.toFixed(1)}s`;
  },

  // 蒙特卡洛模拟
  runMC(weapon, mods, enemy, opts = {}, iters = 100) {
    const res = [];
    
    for (let i = 0; i < iters; i++) {
      const r = this.calcDPS(weapon, mods, enemy, opts);
      res.push(r);
    }
    
    // 统计数据
    const dmg = res.map(r => r.total);
    const dot = res.map(r => r.dotDPS);
    const eff = res.map(r => r.effectiveDPS);
    const ttk = res.map(r => r.ttk).filter(t => t !== Infinity && t > 0);
    
    const stats = {
      damage: this.getStats(dmg),
      dotDPS: this.getStats(dot),
      effectiveDPS: this.getStats(eff),
      ttk: ttk.length > 0 ? this.getStats(ttk) : { min: Infinity, max: Infinity, avg: Infinity, median: Infinity },
      iterations: iters
    };
    
    return stats;
  },

  getStats(vals) {
    if (vals.length === 0) return { min: 0, max: 0, avg: 0, median: 0 };
    
    const sorted = [...vals].sort((a, b) => a - b);
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    const avg = vals.reduce((s, v) => s + v, 0) / vals.length;
    const median = sorted[Math.floor(sorted.length / 2)];
    
    return { min, max, avg, median };
  },

  fmtNum(num) {
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
    return num.toFixed(1);
  },

  getColor(type) { return GameData.COLORS[type] || '#ffffff'; },
  getName(type) { return GameData.TYPE_NAMES[type] || type; },

  getStatusInfo(type) {
    return {
      duration: GameData.STATUS_DURATION[type] || 0,
      tickMult: GameData.DOT_TICK_MULT[type] || 0,
      maxStacks: GameData.STATUS_MAX_STACKS[type] || 0
    };
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = DamageCalculator;
}
