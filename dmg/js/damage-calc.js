/**
 * Warframe 伤害计算引擎 - 完整重写
 * 基于 warframe-damage.com 公开数据格式
 * 支持: MOD action 解析 / 元素组合 / 多重攻击 / AoE / 光束武器 / 蓄力武器 / 状态异常
 * 新增: 武器特殊效果 (comb 组合攻击 / AoE 衰减 / 光束 / 无弱点)
 */

const DamageCalculator = {

  calculateBuild(weaponName, modNames, enemyName, enemyLevel, options = {}) {
    const weapon = GameData.weapons[weaponName];
    if (!weapon) return null;
    const enemy = GameData.enemies[enemyName];
    if (!enemy) return null;
    const scaledEnemy = GameData.scaleEnemy(enemy, enemyLevel, options.steelPath || false, options.eximus || false);
    const mods = modNames.map(name => GameData.mods.find(m => m.name === name)).filter(Boolean);
    return this.calculateDPS(weapon, mods, scaledEnemy, options);
  },

  processMods(mods, weapon) {
    const result = {
      base: 0, critChance: 0, critMult: 0, multishot: 0, speed: 0,
      statusChance: 0, punchThrough: 0, magazineSize: 0, reloadTime: 0,
      statusDamage: 0, basePerStatus: 0, addSlash: 0, addSlashOnImpact: 0,
      smite: {}, element: {}, phys: {},
      flatCritChance: 0, flatCritMult: 0, withCond: {},
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
    });
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

  getAttackCritChance(attack, processedMods) {
    const baseCrit = attack.crit_chance / 100;
    const modCrit = processedMods.critChance;
    const flatCrit = processedMods.flatCritChance;
    const finalCrit = baseCrit * (1 + modCrit) + flatCrit;
    return Math.min(finalCrit, 5);
  },

  getAttackCritMultiplier(attack, processedMods) {
    const baseMult = attack.crit_mult;
    const modMult = processedMods.critMult;
    const flatMult = processedMods.flatCritMult;
    let critMult = baseMult * (1 + modMult) + flatMult;
    if (attack.unique && attack.unique.crit_mult) critMult += attack.unique.crit_mult;
    return critMult;
  },

  getAttackStatusChance(attack, processedMods) {
    const baseSC = attack.status_chance / 100;
    const modSC = processedMods.statusChance;
    return Math.min(baseSC * (1 + modSC), 10);
  },

  getAttackFireRate(attack, processedMods) {
    const baseSpeed = attack.speed;
    const modSpeed = processedMods.speed;
    let speed = baseSpeed * (1 + modSpeed);
    if (attack.unique && attack.unique.speed_mult) speed *= attack.unique.speed_mult;
    return speed;
  },

  calculateCritChance(weapon, processedMods) {
    const attack = weapon.attacks[0];
    return this.getAttackCritChance(attack, processedMods);
  },

  calculateCritMultiplier(weapon, processedMods) {
    const attack = weapon.attacks[0];
    return this.getAttackCritMultiplier(attack, processedMods);
  },

  getExpectedCritMult(critChance, critDamage) {
    return 1 + critChance * critDamage;
  },

  calculateDotDPS(baseDmg, statusChance, critChance, critDamage, effArmor, factionMult, processedMods) {
    let totalDotDPS = 0;
    Object.entries(baseDmg).forEach(([type, dmg]) => {
      if (dmg <= 0) return;
      const tickMult = GameData.DOT_TICK_MULT[type] || 0;
      if (tickMult === 0) return;
      let tickDmg = 0;
      const isPhysical = GameData.PHYSICAL.includes(type);
      if (isPhysical) {
        tickDmg = dmg * tickMult;
        if (type !== 'Slash') tickDmg *= (1 - this.getDamageReduction(effArmor));
      } else {
        const totalBase = Object.values(baseDmg).reduce((s, v) => s + v, 0);
        tickDmg = totalBase * tickMult;
        tickDmg *= (1 - this.getDamageReduction(effArmor));
      }
      if (processedMods && processedMods.statusDamage) tickDmg *= (1 + processedMods.statusDamage);
      tickDmg *= factionMult * factionMult;
      const expectedProcs = statusChance;
      const duration = GameData.STATUS_DURATION[type] || 6;
      totalDotDPS += tickDmg * expectedProcs / duration;
    });
    return totalDotDPS;
  },

  calculateMultishot(weapon, processedMods) {
    const baseMS = weapon.multishot || 1;
    const modMS = processedMods.multishot;
    return baseMS * (1 + modMS);
  },

  calculateFireRate(weapon, processedMods) {
    const attack = weapon.attacks[0];
    return this.getAttackFireRate(attack, processedMods);
  },

  calculateStatusChance(weapon, processedMods) {
    const attack = weapon.attacks[0];
    return this.getAttackStatusChance(attack, processedMods);
  },

  calculateMagazineSize(weapon, processedMods) {
    const baseMag = weapon.magazineSize;
    const modMag = processedMods.magazineSize;
    return Math.floor(baseMag * (1 + modMag));
  },

  calculateReloadTime(weapon, processedMods) {
    const baseReload = weapon.reloadTime;
    const modReload = processedMods.reloadTime;
    return baseReload * (1 + modReload);
  },

  getHitTier(critChance) {
    const floor = Math.floor(critChance);
    const frac = critChance - floor;
    const upgraded = Math.random() < frac;
    return upgraded ? floor + 1 : floor;
  },

  getEffectiveCritMult(tier, critDamage) {
    if (tier === 0) return 1;
    return 1 + tier * critDamage;
  },

  rollProcCount(statusChance) {
    if (statusChance <= 0) return 0;
    const floor = Math.floor(statusChance);
    const frac = statusChance - floor;
    return floor + (Math.random() < frac ? 1 : 0);
  },

  drawProcType(damageVector) {
    const types = Object.keys(damageVector);
    const weights = types.map(type => {
      const dmg = damageVector[type] || 0;
      return dmg * (GameData.PHYSICAL.includes(type) ? 4 : 1);
    });
    const totalWeight = weights.reduce((s, w) => s + w, 0);
    if (totalWeight <= 0) return 'Impact';
    let roll = Math.random() * totalWeight;
    for (let i = 0; i < types.length; i++) {
      roll -= weights[i];
      if (roll <= 0) return types[i];
    }
    return types[types.length - 1];
  },

  getDamageReduction(armor) {
    if (armor <= 0) return 0;
    return 0.9 * Math.sqrt(Math.min(armor, GameData.ARMOR_CAP) / GameData.ARMOR_CAP);
  },

  getEffectiveArmor(baseArmor, corrosiveStacks = 0, heatStacks = 0) {
    let armor = baseArmor;
    armor *= Math.pow(0.75, corrosiveStacks);
    armor *= Math.pow(0.5, heatStacks);
    return Math.max(0, armor);
  },

  armorDR(armor) { return this.getDamageReduction(armor); },

  getFactionMult(faction, mods) {
    if (!mods.smite || !mods.smite[faction]) return 1;
    return 1 + mods.smite[faction];
  },

  getFactionResistance(faction, damageType) {
    const res = GameData.FACTION_RESISTANCES[faction];
    if (!res) return 1;
    return res[damageType] || 1;
  },

  calculatePerShot(weapon, processedMods, enemy, options = {}) {
    const {
      headshot = false,
      corrosiveStacks = 0,
      heatStacks = 0,
      comboMultiplier = 0,
      statusStacks = {},
    } = options;

    const ms = this.calculateMultishot(weapon, processedMods);
    const fireRate = this.calculateFireRate(weapon, processedMods);
    const magazineSize = this.calculateMagazineSize(weapon, processedMods);
    const reloadTime = this.calculateReloadTime(weapon, processedMods);
    const factionMult = this.getFactionMult(enemy.faction, processedMods);
    const effArmor = this.getEffectiveArmor(enemy.armor, corrosiveStacks, heatStacks);
    const dr = this.getDamageReduction(effArmor);
    const coStacks = Object.values(statusStacks).reduce((s, v) => s + v, 0);
    const coMult = 1 + coStacks * processedMods.basePerStatus;

    const combos = this.getAttackCombos(weapon);
    let totalDamage = 0;
    let totalDotDPS = 0;
    const breakdown = {};
    let weightedCritChance = 0;
    let weightedCritDamage = 0;
    let weightedStatusChance = 0;

    combos.forEach(combo => {
      combo.forEach(attackIndex => {
        const attack = weapon.attacks[attackIndex];
        if (!attack) return;

        const baseDmg = this.getAttackBaseDamage(attack, processedMods, weapon);
        const falloffMult = this.getAoEFalloff(attack);

        const critChance = this.getAttackCritChance(attack, processedMods);
        const critDamage = this.getAttackCritMultiplier(attack, processedMods);
        const statusChance = this.getAttackStatusChance(attack, processedMods);

        weightedCritChance += critChance;
        weightedCritDamage += critDamage;
        weightedStatusChance += statusChance;

        const expectedCritMult = this.getExpectedCritMult(critChance, critDamage);

        const isAoE = this.isAoEAttack(attack);
        const noHeadshot = attack.no_headshot_mult || false;
        const headMult = headshot && !noHeadshot ? GameData.HEADSHOT_MULT_INITIAL : 1;

        let attackTotalDamage = 0;
        Object.entries(baseDmg).forEach(([type, dmg]) => {
          if (dmg <= 0) return;
          let finalDmg = dmg * falloffMult * expectedCritMult * headMult * coMult;
          if (type !== 'Slash') finalDmg *= (1 - dr);
          const resist = this.getFactionResistance(enemy.faction, type);
          finalDmg *= resist;
          breakdown[type] = (breakdown[type] || 0) + finalDmg;
          attackTotalDamage += finalDmg;
        });

        attackTotalDamage *= factionMult;
        totalDamage += attackTotalDamage;

        const dotDPS = this.calculateDotDPS(baseDmg, statusChance, critChance, critDamage, effArmor, factionMult, processedMods);
        totalDotDPS += dotDPS;
      });
    });

    const numCombos = combos.length;
    const avgCritChance = numCombos > 0 ? weightedCritChance / numCombos : 0;
    const avgCritDamage = numCombos > 0 ? weightedCritDamage / numCombos : 0;
    const avgStatusChance = numCombos > 0 ? weightedStatusChance / numCombos : 0;

    const pellets = ms;
    const totalPerShot = totalDamage * pellets;
    const cycleTime = magazineSize / fireRate + reloadTime;
    const magazineDamage = totalPerShot;
    const effectiveDPS = (magazineDamage * fireRate) / cycleTime;
    const rawDPS = totalDamage * pellets * fireRate;

    return {
      total: totalPerShot,
      totalWithDot: totalPerShot + totalDotDPS,
      breakdown,
      dotDPS: totalDotDPS,
      rawDPS,
      effectiveDPS: effectiveDPS + totalDotDPS,
      pellets,
      critChance: Math.min(avgCritChance * 100, 500),
      critDamage: avgCritDamage,
      statusChance: Math.min(avgStatusChance * 100, 1000),
      ms,
      fireRate,
      magazineSize,
      reloadTime,
      dr: dr * 100
    };
  },

  calculateDotDamage(type, baseDmg, effArmor, factionMult, processedMods) {
    const tickMult = GameData.DOT_TICK_MULT[type] || 0;
    if (tickMult === 0) return 0;
    let tickDmg = 0;
    const isPhysical = GameData.PHYSICAL.includes(type);
    if (isPhysical) {
      tickDmg = (baseDmg[type] || 0) * tickMult;
      if (type !== 'Slash') tickDmg *= (1 - this.getDamageReduction(effArmor));
    } else {
      const totalBase = Object.values(baseDmg).reduce((s, v) => s + v, 0);
      tickDmg = totalBase * tickMult;
      tickDmg *= (1 - this.getDamageReduction(effArmor));
    }
    if (processedMods && processedMods.statusDamage) tickDmg *= (1 + processedMods.statusDamage);
    tickDmg *= factionMult * factionMult;
    return tickDmg;
  },

  calculateDPS(weapon, mods, enemy, options = {}) {
    const processedMods = this.processMods(mods, weapon);
    const perShot = this.calculatePerShot(weapon, processedMods, enemy, options);
    return {
      ...perShot,
      format: {
        effective: this.formatNumber(perShot.effectiveDPS),
        raw: this.formatNumber(perShot.rawDPS),
        perShot: this.formatNumber(perShot.total)
      }
    };
  },

  formatNumber(num) {
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
