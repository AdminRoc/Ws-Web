/**
 * 伤害计算引擎 v3.0 - 13步随机DPS队列算法
 * 完整复刻 warframe-damage.com/zh 的计算逻辑
 * 支持: MOD解析 / 元素组合 / 多重攻击 / AoE / 光束武器 / 蓄力武器 / 状态异常 / DoT / 队列模拟
 */

const DamageCalculator = {

  // ═══════════════ 常量 ═══════════════
  HEADSHOT_MULT_INITIAL: 3,
  ARMOR_CAP: 2700,
  SHIELD_DAMAGE_MULT: 0.5,
  SHIELD_GATE_DURATION: 0.1,
  VIRAL_BASE_MULT: 2.0,
  VIRAL_PER_STACK: 0.25,
  MAGNETIC_BASE_MULT: 2.0,
  MAGNETIC_PER_STACK: 0.25,
  CORROSIVE_BASE_REDUCTION: 0.26,
  CORROSIVE_PER_STACK: 0.06,
  HEAT_ARMOR_STRIP: 0.5,
  PUNCTURE_WEAKEN: 0.05,
  COLD_CRIT_PER_STACK: 0.05,
  COLD_CRIT_BONUS_AT_10: 0.5,
  QUEUE_DURATION: 10,

  STATUS_DURATION: {
    Impact: 1, Slash: 6, Puncture: 6,
    Heat: 6, Toxin: 6, Electricity: 6, Cold: 6,
    Blast: 6, Gas: 6, Magnetic: 6, Radiation: 12,
    Viral: 6, Corrosive: 8, Void: 3, Tau: 8
  },

  STATUS_MAX_STACKS: {
    Impact: 5, Slash: Infinity, Puncture: 5,
    Heat: Infinity, Toxin: Infinity, Electricity: Infinity, Cold: 10,
    Blast: 10, Gas: 10, Magnetic: 10, Radiation: 10,
    Viral: 10, Corrosive: 10, Void: 1, Tau: 10
  },

  STATUS_DELAY: {
    Impact: 0, Slash: 1, Puncture: 0,
    Heat: 1, Toxin: 1, Electricity: 0, Cold: 0,
    Blast: 1, Gas: 0, Magnetic: 0, Radiation: 0,
    Viral: 0, Corrosive: 0, Void: 0, Tau: 0
  },

  DOT_TICK_MULT: {
    Slash: 0.35, Heat: 0.5, Toxin: 0.5, Electricity: 0.5,
    Gas: 0.5, Blast: 0.3, Radiation: 0, Magnetic: 0, Viral: 0, Corrosive: 0
  },

  // ═══════════════ 状态效果公式 ═══════════════

  getViralMult(stacks) {
    return this.VIRAL_BASE_MULT + this.VIRAL_PER_STACK * Math.max(0, stacks - 1);
  },

  getMagneticMult(stacks) {
    return this.MAGNETIC_BASE_MULT + this.MAGNETIC_PER_STACK * Math.max(0, stacks - 1);
  },

  getCorrosiveReduction(stacks) {
    if (!stacks || stacks <= 0) return 0;
    return this.CORROSIVE_BASE_REDUCTION + this.CORROSIVE_PER_STACK * stacks;
  },

  getColdCritBonus(stacks) {
    let bonus = this.COLD_CRIT_PER_STACK * stacks;
    if (stacks >= 10) {
      bonus += this.COLD_CRIT_BONUS_AT_10;
    }
    return bonus;
  },

  // ═══════════════ 核心入口 ═══════════════

  calculateBuild(weaponName, modNames, enemyName, enemyLevel, options = {}) {
    const weapon = GameData.weapons[weaponName];
    if (!weapon) return null;
    const enemy = GameData.enemies[enemyName];
    if (!enemy) return null;
    const scaledEnemy = GameData.scaleEnemy(enemy, enemyLevel, options.steelPath || false, options.eximus || false);

    // 队伍人数缩放 (1-4人)
    const partySize = Math.max(1, Math.min(4, options.partySize || 1));
    const partyHealthMult = { 1: 1, 2: 1.5, 3: 2, 4: 3 };
    scaledEnemy.health = Math.floor((scaledEnemy.health || 0) * (partyHealthMult[partySize] || 1));
    scaledEnemy.shield = Math.floor((scaledEnemy.shield || 0) * (partyHealthMult[partySize] || 1));
    scaledEnemy.overguard = Math.floor((scaledEnemy.overguard || 0) * (partyHealthMult[partySize] || 1));

    const mods = modNames.map(name => GameData.mods.find(m => m.name === name)).filter(Boolean);
    return this.calcDPS(weapon, mods, scaledEnemy, options);
  },

  /**
   * 主计算入口 - 使用13步随机队列算法
   */
  calcDPS(weapon, mods, enemy, opts = {}) {
    const applyWithCond = opts.applyWithCond === true;
    const modRanks = opts.modRanks || mods.map(() => 0);
    const pMods = this.processMods(mods, weapon, applyWithCond, modRanks);

    // ═══════════════ 应用自定义属性值 ═══════════════
    // 自定义属性作为加法修正器，在MOD处理之后、队列模拟之前应用
    // 参考站点的data-d=1表示百分比(用户输入10=10%, 存储为0.1)
    // data-d=0表示绝对值(用户输入直接使用)
    const cs = opts.customStats || {};
    if (cs) {
      // 百分比属性(data-d=1): 用户输入值已除以100存储
      if (cs.base_damage) pMods.base += cs.base_damage;
      if (cs.base_damage_per_status) pMods.basePerStatus += cs.base_damage_per_status;
      if (cs.crit_chance_normal) pMods.critChance += cs.crit_chance_normal;
      if (cs.crit_chance_secondary) pMods.multCritChance += cs.crit_chance_secondary;
      if (cs.crit_chance_tertiary) pMods.flatCritChance += cs.crit_chance_tertiary;
      if (cs.weakspot_crit_chance) pMods.weakCritChance += cs.weakspot_crit_chance;
      if (cs.crit_damage_normal) pMods.critMult += cs.crit_damage_normal;
      if (cs.status_chance) pMods.statusChance += cs.status_chance;
      if (cs.status_chance_flat) pMods.flatStatusChance += cs.status_chance_flat;
      if (cs.status_vulnerability) pMods.vulnStatusDamage += cs.status_vulnerability;
      if (cs.status_damage_bonus) pMods.statusDamage += cs.status_damage_bonus;
      if (cs.viral_status_damage) pMods.vulnStatusDamage += cs.viral_status_damage;
      if (cs.fire_rate) pMods.speed += cs.fire_rate;
      if (cs.magazine_size) pMods.magazineSize += cs.magazine_size;
      if (cs.reload_time) pMods.reloadTime += cs.reload_time;
      if (cs.headshot_multiplier) pMods.multForHead += cs.headshot_multiplier;
      if (cs.weakspot_multiplier) pMods.headshotMult += cs.weakspot_multiplier;
      if (cs.damage_vulnerability) pMods.dmgVulnerability += cs.damage_vulnerability;
      if (cs.heat_inherit) pMods.heatInherit += cs.heat_inherit;
      if (cs.ember_augment) pMods.heatAdd += cs.ember_augment;
      // 绝对值属性(data-d=0): 直接使用
      if (cs.flat_base_damage) pMods.flatChangeDmg += cs.flat_base_damage;
      if (cs.combo_mult && cs.combo_mult !== 1) pMods.abilityCombo += (cs.combo_mult - 1);
      if (cs.crit_damage_secondary) pMods.flatCritMult += cs.crit_damage_secondary;
      if (cs.crit_damage_tertiary) pMods.critMultMult += cs.crit_damage_tertiary;
      if (cs.multishot) pMods.flatMultishot += cs.multishot;
      if (cs.combo_count) pMods.initialCombo += cs.combo_count;
    }

    // 映射calcDuration到queueDuration
    const enrichedOpts = { 
      ...opts, 
      rawMods: mods,
      queueDuration: opts.calcDuration || opts.queueDuration || this.QUEUE_DURATION
    };

    // 运行13步队列模拟
    const queueResult = this.runQueueSimulation(weapon, pMods, enemy, enrichedOpts);

    // TTK计算
    const ttkResult = this.calcTTKQueue(queueResult, weapon, pMods, enemy, opts);

    // 计算护甲DR
    const enemyArmor = enemy.armor || 0;
    const dr = this.getDMGReduction(enemyArmor) * 100;

    // 分攻击模拟 + 随机1s窗口语义 (参考站 "一秒钟随机攻击系列" 等价)
    const perAttackResult = this.runPerAttackSimulation(weapon, pMods, enemy, enrichedOpts, enrichedOpts.queueDuration);

    // 格式化输出
    return {
      ...queueResult,
      perAttack: perAttackResult.perAttack,
      ttk: ttkResult.ttk,
      ttkRegions: ttkResult.regions,
      dr,
      format: {
        effective: this.fmtNum(queueResult.effectiveDPS),
        raw: this.fmtNum(queueResult.rawDPS),
        perShot: this.fmtNum(queueResult.avgPerShot),
        ttk: this.fmtTime(ttkResult.ttk)
      }
    };
  },

  // ═══════════════ 13步随机队列算法 ═══════════════

  /**
   * 步骤1-13: 完整的随机DPS队列模拟
   */
  runQueueSimulation(weapon, pMods, enemy, opts = {}) {
    const queueDuration = opts.queueDuration || this.QUEUE_DURATION;
    const iterations = opts.iterations || 100;

    let totalDPS = 0;
    let totalAvgPerShot = 0;
    let totalAvgPerShotStatus = 0;
    let totalMedianDmg = 0;
    const allResults = [];
    let firstTimeline = null;

    for (let iter = 0; iter < iterations; iter++) {
      const result = this.runSingleQueue(weapon, pMods, enemy, opts, queueDuration);
      allResults.push(result);
      totalDPS += result.dps;
      totalAvgPerShot += result.avgPerShot;
      totalAvgPerShotStatus += result.avgPerShotStatus;
      totalMedianDmg += result.medianDmg;
      if (!firstTimeline && result.perShotTimeline) {
        firstTimeline = result.perShotTimeline;
      }
    }

    // 计算平均值和中位数
    const avgDPS = totalDPS / iterations;
    const avgPerShot = totalAvgPerShot / iterations;
    const avgPerShotStatus = totalAvgPerShotStatus / iterations;
    const avgMedianDmg = totalMedianDmg / iterations;

    // 计算统计信息
    const dpsValues = allResults.map(r => r.dps);
    const shotValues = allResults.map(r => r.totalDamage);
    const stats = this.getStats(dpsValues);
    const shotStats = this.getStats(shotValues);

    // 伤害分解
    const breakdown = this.aggregateBreakdown(allResults);

    // 状态信息
    const statusInfo = this.aggregateStatusInfo(allResults);

    return {
      dps: avgDPS,
      effectiveDPS: avgDPS,
      rawDPS: avgDPS,
      avgPerShot: avgPerShot,
      avgPerShotStatus: avgPerShotStatus,
      dotDPS: avgPerShotStatus * this.calcFireRate(weapon, pMods),
      total: avgPerShot,
      medianDmg: avgMedianDmg,
      minDPS: stats.min,
      maxDPS: stats.max,
      medianDPS: stats.median,
      minDmg: shotStats.min,
      maxDmg: shotStats.max,
      medianDmgStat: shotStats.median,
      breakdown,
      statusInfo,
      pellets: pMods.multishot || 1,
      ms: pMods.multishot || 1,
      fireRate: this.calcFireRate(weapon, pMods),
      magSize: this.calcMagSize(weapon, pMods),
      reloadTime: this.calcReload(weapon, pMods),
      critChance: this.estimateCritChance(weapon, pMods),
      critDmg: this.estimateCritMult(weapon, pMods),
      statusChance: this.estimateStatusChance(weapon, pMods),
      dr: 0,
      iterations,
      perShotTimeline: firstTimeline
    };
  },

  /**
   * 单次队列模拟 - 执行13步算法
   */
  runSingleQueue(weapon, pMods, enemy, opts, duration, attackOnly = null) {
    // ═══ 步骤1: 计算射击/命中次数 ═══
    const fireRate = this.calcFireRate(weapon, pMods, attackOnly);
    const magSize = this.calcMagSize(weapon, pMods);
    const reloadTime = this.calcReload(weapon, pMods);
    const isBeam = (weapon.compTags && weapon.compTags.includes('BEAM')) ||
      (weapon.attacks || []).some(a => a && a.isBeam === true);
    const isMelee = weapon.category === 'Melee';

    // 重击模式下使用maxHeavyCombo作为连击计数器
    const effectiveComboMult = opts.isHeavy && isMelee
      ? (weapon.maxHeavyCombo || 12)
      : (opts.comboMultiplier || 1) + (pMods.abilityCombo || 0);

    // 初始连击加成 (Initial Combo from mods)
    const initialCombo = isMelee ? (pMods.initialCombo || 0) : 0;

    // ═══ 步骤1b: 射击次数 (参考站 createDmgQueue L686-689 三分类语义)
    // M: 光束=0.5 弹药/帧; 普通=攻击级 ammoCost||1; "all"=整匣一发
    const costAtk = weapon.attacks[attackOnly ?? 0] || weapon.attacks[0] || {};
    let ammoCost;
    if (isBeam) ammoCost = 0.5;
    else if (costAtk.ammoCost === 'all') ammoCost = magSize || 1;
    else ammoCost = Number(costAtk.ammoCost) || 1;
    const shotsPerMag = Math.max(1, Math.floor((magSize || 1) / ammoCost));
    const fireTimePerMag = shotsPerMag / fireRate; // ka/ja: 一匣打空所需时间
    let shotCount;
    if (duration < fireTimePerMag) {
      // 弹匣未打空 (参考站 z<Z): 纯射击, 不扣装弹
      shotCount = Math.floor(duration * fireRate);
      if (shotCount === 0 && duration >= 1 / fireRate) shotCount = 1;
    } else {
      // 跨越重装: 首匣打空后每 cycle = 打空时长 + 装弹
      const afterFirst = duration - fireTimePerMag;
      const cycleTime = fireTimePerMag + reloadTime;
      const extraCycles = Math.floor(afterFirst / cycleTime);
      const remainder = afterFirst - extraCycles * cycleTime;
      const remainingShots = Math.min(shotsPerMag, Math.floor(Math.max(0, remainder - reloadTime) * fireRate));
      shotCount = shotsPerMag + extraCycles * shotsPerMag + remainingShots;
    }

    // ═══ 步骤2: 创建队列 ═══
    const queue = [];
    for (let i = 0; i < shotCount; i++) {
      queue.push({
        index: i,
        time: i / fireRate,
        pellets: [],
        statusProcs: [],
        dotEffects: []
      });
    }

    // ═══ 步骤3: 多重射击概率 ═══
    // 参考站: 攻击级 multishot 作为基础值 (base+flat)*(1+multishot%), 覆盖武器级
    const attacks = weapon.attacks || [weapon.attacks[0]];
    const baseMultishot = this.calcMultishot(weapon, pMods);
    const flatMS = pMods.flatMultishot || 0;
    const mMS = pMods.multishot || 0;
    queue.forEach(shot => {
      const atkIdx = attackOnly ?? (shot.index % attacks.length);
      const atk = attacks[atkIdx] || attacks[0];
      const atkBaseMS = atk && atk.multishot ? (atk.multishot + flatMS) * (1 + mMS) : baseMultishot;
      const pelletCount = this.rollMultishot(atkBaseMS);
      for (let p = 0; p < pelletCount; p++) {
        shot.pellets.push({
          damage: {},
          isCrit: false,
          critTier: 0,
          critMult: 1,
          statusProcs: [],
          headshot: opts.headshot || false
        });
      }
    });

    // ═══ 步骤4: 计算基础伤害 (不包含暴击) ═══
    queue.forEach(shot => {
      shot.pellets.forEach(pellet => {
        const atkIdx = attackOnly ?? (shot.index % attacks.length);
        const atk = attacks[atkIdx] || attacks[0];
        if (!atk) return;
        const baseDmg = this.getAttackBaseDamage(atk, pMods, weapon, opts);
        pellet.damage = baseDmg;
        pellet._atkIndex = atkIdx;
        pellet._sniperCombo = !!atk.sniperCombo;
        pellet._baseDamageVec = { ...baseDmg };
      });
    });

    // ═══ 步骤6-7: 状态触发概率和类型 ═══
    const enemyImmunities = enemy.immun?.status || [];
    queue.forEach(shot => {
      shot.pellets.forEach(pellet => {
        const atk = attacks[pellet._atkIndex] || attacks[0];
        if (!atk) return;

        // 参考站 noIncrStatus: 该攻击状态机率不随MOD/连击加成缩放 (保持基础值)
        const statusChance = atk.noIncrStatus
          ? ((atk.status_chance || 0) / 100)
          : this.getAttackStatusChance(atk, pMods, {
              comboMultiplier: effectiveComboMult
            });

        const procCount = this.rollProcCount(statusChance);

        for (let i = 0; i < procCount; i++) {
          const procType = this.drawProcType(pellet.damage, enemyImmunities);
          pellet.statusProcs.push(procType);
        }

        // 强制状态 (force_procs): 攻击级 + unique + 最大条件时 WITH_COND (参考站 setForceProcs)
        const forcedProcs = [
          ...(atk.force_procs || []),
          ...((atk.unique && atk.unique.force_procs) || []),
          ...(opts.applyWithCond && atk.unique && atk.unique.WITH_COND && atk.unique.WITH_COND.force_procs
            ? atk.unique.WITH_COND.force_procs : [])
        ];
        forcedProcs.forEach(fp => {
          if (typeof fp === 'string') pellet.statusProcs.push(fp);
        });

        // Cedo/Cedo Prime 特殊 (参考站 cedoRnd): 每发补随机基础元素 + 随机伤害类型状态
        if (atk.cedoRnd && (weapon.name === 'Cedo' || weapon.name === 'Cedo Prime')) {
          const baseElems = ['heat', 'cold', 'electricity', 'toxin'];
          const dmgKeys = Object.keys(atk.damage || {});
          pellet.statusProcs.push(baseElems[Math.floor(Math.random() * baseElems.length)]);
          if (dmgKeys.length) pellet.statusProcs.push(dmgKeys[Math.floor(Math.random() * dmgKeys.length)]);
        }

        // 保证触发Puncture状态 (addPunctureStatus)
        if (pMods.addPunctureStatus > 0) {
          pellet.statusProcs.push('Puncture');
        }

        // impactToPuncture: Impact转为Puncture
        if (pMods.impactToPuncture > 0) {
          const impactCount = pellet.statusProcs.filter(p => p === 'Impact').length;
          const convertCount = Math.floor(impactCount * pMods.impactToPuncture);
          for (let i = 0; i < convertCount; i++) {
            const idx = pellet.statusProcs.indexOf('Impact');
            if (idx !== -1) {
              pellet.statusProcs.splice(idx, 1);
              pellet.statusProcs.push('Puncture');
            }
          }
        }
      });
    });

    // ═══ 步骤8: 近战武器特殊处理 ═══
    if (isMelee) {
      // 姿态攻击加成 - 从姿态MOD数据中读取
      const rawMods = opts.rawMods || [];
      const stanceMod = rawMods.find(m => m.type === 'stance');
      let stanceMult = opts.stanceMultiplier || 1;
      let forcedStatuses = [];
      if (stanceMod && stanceMod.action && stanceMod.action.stances) {
        const stanceNames = Object.keys(stanceMod.action.stances);
        if (stanceNames.length > 0) {
          // 选择第一个连击
          const comboName = stanceNames[0];
          const combo = stanceMod.action.stances[comboName];
          if (combo && combo.total) {
            stanceMult = combo.total;
          }
          // 收集强制状态触发
          if (combo && combo.statuses) {
            forcedStatuses = combo.statuses.filter(s => s && s.trim());
          }
        }
      }

      queue.forEach(shot => {
        shot.pellets.forEach(pellet => {
          Object.keys(pellet.damage).forEach(type => {
            pellet.damage[type] *= stanceMult;
          });
          // 添加姿态强制状态触发
          forcedStatuses.forEach(status => {
            if (status && status.trim()) {
              pellet.statusProcs.push(status.trim());
            }
          });
        });
      });

      // 连击倍率加成 (近战基础伤害 × 连击倍率)
      const comboMult = effectiveComboMult + initialCombo;
      if (comboMult > 1) {
        queue.forEach(shot => {
          shot.pellets.forEach(pellet => {
            Object.keys(pellet.damage).forEach(type => {
              pellet.damage[type] *= comboMult;
            });
          });
        });
      }

      // ═══ 步骤8: 连击倍率加成 (近战基础伤害 × 连击倍率) ═══
      // (base_heavy 已由 getBaseDamageModifier 加法并入基础, 不再后置乘法)
    }

    // ═══ 步骤9: 猎人弹药/内部出血效果 (移至暴击判定后) ═══
    // (Hunter Munitions check moved to after crit determination at step 4-5)

    // ═══ 步骤10: 强制触发效果 (攻击级 force_procs, 参考站 setForceProcs 等价) ═══
    queue.forEach(shot => {
      shot.pellets.forEach(pellet => {
        const atk = attacks[pellet._atkIndex] || attacks[0];
        if (!atk || !atk.unique) return;
        const forceProcs = atk.unique.force_procs || [];
        forceProcs.forEach(proc => {
          const procName = proc.charAt(0).toUpperCase() + proc.slice(1);
          pellet.statusProcs.push(procName);
        });
      });
    });

    // ═══ 步骤11: 状态时间队列 ═══
    const statusTimeQueue = this.buildStatusTimeQueue(queue, pMods, enemy, opts.mergeStatusEvents);

    // Secondary Encumber: 状态触发时有几率添加随机状态
    if (pMods.randomStatusAfterStatus > 0) {
      const allStatusTypes = ['Impact', 'Puncture', 'Slash', 'Heat', 'Cold', 'Electricity', 'Toxin', 'Blast', 'Radiation', 'Viral', 'Corrosive', 'Magnetic', 'Gas'];
      queue.forEach(shot => {
        shot.pellets.forEach(pellet => {
          if (pellet.statusProcs.length > 0) {
            if (Math.random() < pMods.randomStatusAfterStatus) {
              const randomType = allStatusTypes[Math.floor(Math.random() * allStatusTypes.length)];
              pellet.statusProcs.push(randomType);
            }
          }
        });
      });
      // 重建状态时间队列以包含额外状态
      Object.keys(statusTimeQueue).forEach(k => delete statusTimeQueue[k]);
      Object.assign(statusTimeQueue, this.buildStatusTimeQueue(queue, pMods, enemy, opts.mergeStatusEvents));
    }

    // ═══ 步骤4-5 (延迟): 暴击概率和倍率 (包含状态效果) ═══
    const isColdImmune = enemyImmunities.includes('Cold') || enemyImmunities.includes('all');
    const isPunctureImmune = enemyImmunities.includes('Puncture') || enemyImmunities.includes('all');
    
    const disableBodyCrit = pMods.disableBodyCrit || false;
    const critFlatChancePerStatuses = pMods.critFlatChancePerStatuses || 0;
    const flatCritWithStatus = pMods.flatCritWithStatus || 0;
    
    queue.forEach(shot => {
      const frozenStacksShot = isColdImmune ? 0 : this.getStatusStacksAtTime(statusTimeQueue, 'Cold', shot.time);
      const frozenDmgMultShot = 1 + (pMods.dmgMultAgainstFrozen || 0) * (frozenStacksShot >= 10 ? 1 : 0);
      
      shot.pellets.forEach(pellet => {
        const atk = attacks[pellet._atkIndex] || attacks[0];
        if (!atk) return;

        let baseCritChance = this.getAttackCritChance(atk, pMods, {
          isHeadshot: pellet.headshot,
          comboMultiplier: effectiveComboMult,
          isHeavy: opts.isHeavy || false
        });

        const coldStacks = isColdImmune ? 0 : this.getStatusStacksAtTime(statusTimeQueue, 'Cold', shot.time);
        const punctureStacks = isPunctureImmune ? 0 : this.getStatusStacksAtTime(statusTimeQueue, 'Puncture', shot.time);

        let finalCritChance = baseCritChance;

        // 冷冻状态暴击加成 (含10层升级tier)
        let coldTierUpgrade = 0;
        if (coldStacks > 0) {
          finalCritChance += 0.05 * coldStacks;
          if (coldStacks >= 10) {
            finalCritChance += 0.5;
            coldTierUpgrade = 1;
          }
        }

        if (punctureStacks > 0) {
          const totalDmg = Object.values(atk.damage || {}).reduce((s, v) => s + v, 0);
          const punctureDmg = atk.damage?.Puncture || 0;
          if (totalDmg > 0) {
            const punctureRatio = punctureDmg / totalDmg;
            const punctureCritBonus = punctureRatio * ((atk.status_chance || 0) / 100) * 0.1;
            finalCritChance += Math.min(punctureCritBonus * punctureStacks, 0.5);
          }
        }

        if (critFlatChancePerStatuses > 0) {
          const activeStatuses = this.getActiveStatusCount(statusTimeQueue, shot.time);
          finalCritChance += critFlatChancePerStatuses * activeStatuses;
        }

        if (disableBodyCrit && !pellet.headshot) {
          finalCritChance = 0;
        }

        if (flatCritWithStatus !== 0) {
          const totalStatusStacks = this.getActiveStatusCount(statusTimeQueue, shot.time);
          if (totalStatusStacks < 3) {
            finalCritChance *= (1 + flatCritWithStatus);
          }
        }

        const critTier = Math.min(this.getHitTier(finalCritChance) + coldTierUpgrade, 5);

        // Vigilante set bonus: 每5%概率升级一层暴击
        let finalTier = critTier;
        if (pMods.doubleCrit > 0) {
          const doubleCritChance = Math.min(pMods.doubleCrit, 1);
          if (Math.random() < doubleCritChance) {
            finalTier = Math.min(finalTier + 1, 5);
          }
        }

        const baseCritMult = atk.crit_mult * (1 + pMods.critMult);
        let critMult = this.getEffCritMult(finalTier, baseCritMult, coldStacks);

        // 应用额外暴击倍率加成/乘算
        if (pMods.critMultAdd > 0) critMult += pMods.critMultAdd;
        if (pMods.critMultMult > 0) critMult *= (1 + pMods.critMultMult);

        // Puncture状态每层增加暴击倍率
        if (pMods.incrCMPuncStatus > 0 && punctureStacks > 0) {
          critMult += pMods.incrCMPuncStatus * punctureStacks;
        }

        // critAfterStatus: 对有状态的敌人强制暴击
        if (pMods.critAfterStatus > 0) {
          const activeStatuses = this.getActiveStatusCount(statusTimeQueue, shot.time);
          if (activeStatuses > 0) {
            finalTier = Math.max(finalTier, 1);
            critMult = this.getEffCritMult(finalTier, baseCritMult, coldStacks);
            if (pMods.critMultAdd > 0) critMult += pMods.critMultAdd;
            if (pMods.critMultMult > 0) critMult *= (1 + pMods.critMultMult);
          }
        }

        if (opts.stealthBonus && weapon.category === 'Melee') {
          critMult = this.getStealthDmgBonus(finalTier);
        }

        pellet.isCrit = finalTier > 0;
        pellet.critTier = finalTier;
        pellet.critMult = critMult;
        pellet.finalCritChance = finalCritChance;
        pellet.frozenDmgMult = frozenDmgMultShot;

        // Melee Duplicate: 暴击时额外攻击一次
        if (isMelee && pMods.mDuplicate > 0 && finalTier > 0) {
          if (Math.random() < pMods.mDuplicate) {
            pellet._duplicateStrike = true;
          }
        }
      });
    });

    // ═══ 步骤9 (延迟): 猎人弹药/内部出血效果 - 在暴击判定后 ═══
    const hasHunterMunitions = pMods.addSlash > 0;
    const hasInternalBleeding = pMods.addSlashOnImpact > 0;
    const hasMagneticWelt = pMods.addMagneticOnImpact > 0;
    if (hasHunterMunitions || hasInternalBleeding || hasMagneticWelt) {
      queue.forEach(shot => {
        shot.pellets.forEach(pellet => {
          // Hunter Munitions: 暴击时有几率触发Slash
          if (hasHunterMunitions && pellet.isCrit) {
            if (Math.random() < pMods.addSlash) {
              pellet.statusProcs.push('Slash');
            }
          }
          // Internal Bleeding/Hemorrhage: Impact触发时有几率转为Slash
          if (hasInternalBleeding) {
            const hasImpact = pellet.statusProcs.includes('Impact');
            if (hasImpact && Math.random() < pMods.addSlashOnImpact) {
              pellet.statusProcs = pellet.statusProcs.filter(p => p !== 'Impact');
              pellet.statusProcs.push('Slash');
            }
          }
          // Magnetic Welt: Impact触发时有几率添加Magnetic
          if (hasMagneticWelt) {
            const hasImpact = pellet.statusProcs.includes('Impact');
            if (hasImpact && Math.random() < pMods.addMagneticOnImpact) {
              pellet.statusProcs.push('Magnetic');
            }
          }
          // Corrosive by Toxin: Toxin触发时额外添加Corrosive
          if (pMods.corrosiveByToxin > 0) {
            const hasToxin = pellet.statusProcs.includes('Toxin');
            if (hasToxin && Math.random() < pMods.corrosiveByToxin) {
              pellet.statusProcs.push('Corrosive');
            }
          }
        });
      });
    }

    // ═══ 步骤12: 状态伤害计算 ═══
    const dotResults = this.calculateStatusDamage(statusTimeQueue, pMods, enemy, weapon, opts);

    // ═══ 步骤13: 计算DPS ═══
    let totalDamage = 0;
    let totalDirectDamage = 0;
    let totalStatusDamage = 0;

    // per-shot 时间线数据收集 (参考站 infoDmg 等价)
    const perShotTimeline = [];

    queue.forEach(shot => {
      shot.pellets.forEach(pellet => {
        let pelletDmg = 0;

        // 计算阵营元素抗性调整后的伤害 (使用calcPercentAdd正确处理弱点/抗性)
        let resistAdjustedTotal = 0;
        Object.entries(pellet.damage).forEach(([type, dmg]) => {
          const resist = this.getFactResist(enemy.faction, type);
          let adjusted = this.calcPercentAdd(dmg, resist);
          const elemMult = this.getElemResist(enemy.elemRes, type);
          if (elemMult !== 1) adjusted *= elemMult;
          resistAdjustedTotal += adjusted;
        });

        // Viral状态: 对生命值伤害增加 (2 + 0.25*(stacks-1), 最大10层)
        const viralStacks = this.getStatusStacksAtTime(statusTimeQueue, 'Viral', shot.time);
        if (viralStacks > 0 && enemy.health > 0) {
          const viralMult = this.getViralMult(viralStacks);
          resistAdjustedTotal *= viralMult;
        }

        // 非暴击额外基础伤害 (baseNoncrit)
        if (!pellet.isCrit && pMods.baseNoncrit > 0) {
          const noncritBonus = Object.values(pellet._baseDamageVec || {}).reduce((s, v) => s + v, 0);
          resistAdjustedTotal += noncritBonus * pMods.baseNoncrit;
        }

        // 应用暴击倍率
        let dmgWithCrit = resistAdjustedTotal * pellet.critMult;

        // 应用冻结敌人伤害加成
        dmgWithCrit *= (pellet.frozenDmgMult || 1);

        // 应用头部倍率
        if (pellet.headshot) {
          let headMult = this.HEADSHOT_MULT_INITIAL;
          if (pMods.multForHead > 0) headMult += pMods.multForHead;
          if (pMods.headshotMult > 0) headMult += pMods.headshotMult;
          dmgWithCrit *= headMult;
          if (pMods.multForHeadMult > 0) dmgWithCrit *= (1 + pMods.multForHeadMult);
        }

        // 应用Condition Overload (参考站 reCalcWithNonCritBase @19w:195296)
        // 门 控: isMaxCond(默认true) && shot_type!="AoE" && !名字含"slam" && !免疫all
        // k = base_per_status(MOD+攻击unique) ; r = base_per_cold ; h = BaseModsDmg(基础MOD倍率=1+pMods.base)
        // 乘法分支(atk.isCoMult||multiplicative): 每型 = (1 + r + count*k) * h
        // 加法分支(默认CO):               每型 = count*k + r + h
        // diffCount = 手动(is_set?) : auto主张damage键数 + (damage含Viral?0:externalVirus?1:0)
        // auto 语义参考站: 攻击经过MOD组合后的实际伤害键数 (参考站 getCountDifferentStatuses→damage按键)
        const atkSimple = attacks[pellet._atkIndex] || attacks[0];
        const basePerStatus = pMods.basePerStatus || 0;
        const basePerCold = pMods.basePerCold || 0;
        const atkNowBPS = (atkSimple.unique && atkSimple.unique.base_per_status) || 0;
        const kStat = basePerStatus + atkNowBPS;
        const rStat = basePerCold;
        const hStat = this.getBaseDamageModifier(pMods, weapon, atkSimple, opts);
        const atkNameNow = String(atkSimple.name || '').toLowerCase();
        const coGated = (opts.isMaxCond !== false)
          && atkSimple.shot_type !== 'AoE'
          && !atkNameNow.includes('slam')
          && !(enemy.immun && enemy.immun.status && enemy.immun.status.includes('all'));
        let diffCount;
        if (opts.manualCountStatus !== undefined) {
          diffCount = opts.manualCountStatus;
        } else {
          // 用当前 pellet 已完成MOD组合的伤害向量键数 (= 参考站攻击实际伤害键数)
          const atkDamageKeys = Object.keys(pellet.damage || {}).filter(k => (pellet.damage[k] || 0) > 0);
          diffCount = atkDamageKeys.length;
          if (opts.externalVirus && !atkDamageKeys.includes('Viral')) diffCount += 1;
        }
        let coMult = 1;
        if ((kStat > 0 || rStat > 0) && coGated) {
          if (atkSimple.isCoMult || pMods.multiplicativeBasePerStatus) {
            coMult = 1 + rStat + diffCount * kStat;
          } else {
            coMult = (diffCount * kStat + rStat + hStat) / hStat;
          }
        }
        dmgWithCrit *= coMult;

        // 处决伤害加成 (参考站: 仅攻击级 enableFinisherModsWithSlash 标记时生效)
        if (atkSimple.enableFinisherModsWithSlash && pMods.finisherDmg > 0) {
          dmgWithCrit *= (1 + pMods.finisherDmg);
        }

        // 应用阵营加成
        const factMult = this.getFactMult(enemy.faction, pMods);
        dmgWithCrit *= factMult;

        // 应用护甲减免 (实时护甲)
        const currentArmor = this.getCurrentArmor(enemy.armor, statusTimeQueue, shot.time);
        const armorDR = this.getDMGReduction(currentArmor);
        dmgWithCrit *= (1 - armorDR);

        // 敌人固有伤害减免 (根据当前伤害区域)
        // 优先级: overguard > shield > armor > health
        let currentRegion = 'health';
        if (enemy.overguard && enemy.overguard > 0) currentRegion = 'overguard';
        else if (enemy.shield > 0) currentRegion = 'shield';
        else if (currentArmor > 0) currentRegion = 'armor';
        const innateDr = this.getInnateDR(enemy, currentRegion);
        if (innateDr > 0) dmgWithCrit *= (1 - innateDr);

        // 应用特殊敌人DR (Demolisher, Acolyte, Eidolon, Archon, Lephantis)
        dmgWithCrit = this.applySpecialEnemyDR(dmgWithCrit, enemy, pMods.fireRate || 1, pMods.multishot || 1);

        // Overguard: Void伤害+50%
        if (currentRegion === 'overguard') {
          const voidDmg = pellet.damage.Void || 0;
          const totalDmg = Object.values(pellet.damage).reduce((s, v) => s + v, 0);
          if (voidDmg > 0 && totalDmg > 0) {
            const voidBonus = dmgWithCrit * (voidDmg / totalDmg) * 0.5;
            dmgWithCrit += voidBonus;
          }
        }

        // 护盾伤害减半 (Toxin bypass shields)
        if (enemy.shield > 0) {
          // 计算Toxin伤害占比 (Toxin bypass shields)
          const toxinDmg = pellet.damage.Toxin || 0;
          const totalDmg = Object.values(pellet.damage).reduce((s, v) => s + v, 0);
          const toxinRatio = totalDmg > 0 ? toxinDmg / totalDmg : 0;
          
          // 非Toxin伤害受护盾减半影响
          const nonToxinDmg = dmgWithCrit * (1 - toxinRatio);
          const toxinPart = dmgWithCrit * toxinRatio;
          dmgWithCrit = nonToxinDmg * this.SHIELD_DAMAGE_MULT + toxinPart;
          
          // Magnetic状态: 对护盾伤害增加 (2 + 0.25*(stacks-1), 最大10层)
          const magneticStacks = this.getStatusStacksAtTime(statusTimeQueue, 'Magnetic', shot.time);
          if (magneticStacks > 0) {
            const magneticMult = this.getMagneticMult(magneticStacks);
            dmgWithCrit *= magneticMult;
          }
        }

        // 应用额外伤害倍率
        dmgWithCrit *= (1 + (pMods.multiple || 0));
        dmgWithCrit *= (1 + (pMods.dblMult || 0));
        dmgWithCrit *= (1 + (pMods.multDAIKYUBroadhead || 0));
        dmgWithCrit *= (1 + (pMods.multSharpshot || 0));
        dmgWithCrit *= (1 + (pMods.vulnStatusDamage || 0));
        dmgWithCrit *= (1 + (pMods.dmgVulnerability || 0));

        // 应用狙击连击倍率 (参考站: 攻击级 sniperCombo 标记, 带标记默认×1.5, 用户设置覆盖, 无标记×1)
        const sniperMult = pellet._sniperCombo
          ? ((opts.sniperCombo && opts.sniperCombo > 1) ? opts.sniperCombo : 1.5)
          : 1;
        if (sniperMult > 1) {
          dmgWithCrit *= sniperMult;
        }

        // 连击能力倍率 (仅显赫武器, 参考站 optAbilityCombo Z 逻辑 - 每发应用)
        if (opts.abilityComboMult && opts.abilityComboMult > 1 && weapon.type === 'Exalted Weapon') {
          dmgWithCrit *= opts.abilityComboMult;
        }

        // 应用额外固定伤害
        dmgWithCrit += (pMods.flatChangeDmg || 0);

        // Cascadia Empowered: 每种负面状态+额外伤害
        if (pMods.dmgOnStatusEff > 0) {
          const statusCount = this.getActiveStatusCount(statusTimeQueue, shot.time);
          dmgWithCrit += pMods.dmgOnStatusEff * statusCount;
        }

        pelletDmg = dmgWithCrit;
        totalDirectDamage += pelletDmg;
        totalDamage += pelletDmg;

        // 收集 per-shot 时间线数据
        pellet._finalDamage = pelletDmg;
        pellet._armorAtTime = currentArmor;
        pellet._statusProcsAtTime = [...(pellet.statusProcs || [])];

        // Melee Duplicate: 额外攻击一次
        if (pellet._duplicateStrike) {
          totalDirectDamage += pelletDmg;
          totalDamage += pelletDmg;
        }
      });

      // 汇总该发的总伤害 (所有弹片)
      const shotTotal = shot.pellets.reduce((sum, p) => sum + (p._finalDamage || 0), 0);
      if (shotTotal > 0) {
        perShotTimeline.push({
          index: shot.index,
          time: shot.time,
          damage: shotTotal,
          pellets: shot.pellets.length,
          isCrit: shot.pellets.some(p => p.isCrit),
          maxCritMult: Math.max(0, ...shot.pellets.map(p => p.critMult || 1)),
          critTier: Math.max(0, ...shot.pellets.map(p => p.critTier || 0)),
          procs: [...new Set(shot.pellets.flatMap(p => p.statusProcs || []))],
          isReload: false
        });
      }
    });

    // 加入状态伤害
    totalStatusDamage = dotResults.totalDotDamage;
    totalDamage += totalStatusDamage;

    // 应用Rhino Roar和Mirage Eclipse (简单乘法加成)
    if (opts.rhinoRoar || opts.mirageEclipse) {
      const abilityMult = this.calcAbilityMult(pMods, opts);
      if (abilityMult !== 1) {
        totalDamage *= abilityMult;
        totalDirectDamage *= abilityMult;
      }
    }

    // ═══ Xata's Whisper: 作为独立伤害组件添加 (匹配参考站点getXataDmg) ═══
    let xataTotalDmg = 0;
    if (opts.xakuWhisper && weapon && weapon.attacks && weapon.attacks[0]) {
      const xataPercent = (opts.xakuWhisperPercent || 26) / 100;
      if (xataPercent > 0) {
        const str = (opts.abilityStrength || 100) / 100;
        const attack = weapon.attacks[0];

        // 1. 求和武器所有基础伤害类型
        let totalBaseDmg = 0;
        for (const type in attack.damage) {
          totalBaseDmg += attack.damage[type];
        }

        // 2. 使用最后计算时的伤害区域 (优先级: overguard > shield > armor > health)
        const currentArmor = this.getCurrentArmor(enemy.armor, statusTimeQueue, duration > 0 ? duration : 0);
        let currentRegion = 'health';
        if (enemy.overguard && enemy.overguard > 0) currentRegion = 'overguard';
        else if (enemy.shield > 0) currentRegion = 'shield';
        else if (currentArmor > 0) currentRegion = 'armor';

        // 3. 应用伤害区域乘数
        xataTotalDmg = totalBaseDmg;
        if (currentRegion === 'overguard') {
          xataTotalDmg *= 1.5; // Overguard时+50%
        }

        // 4. 应用护甲DR或innateDR
        if (currentRegion === 'armor' && currentArmor > 0) {
          const armorDR = this.getDMGReduction(currentArmor);
          const innateDr = this.getInnateDR(enemy, 'armor');
          xataTotalDmg *= (1 - armorDR) * (1 - innateDr);
        } else {
          const innateDr = this.getInnateDR(enemy, currentRegion);
          if (innateDr > 0) xataTotalDmg *= (1 - innateDr);
        }

        // 5. 乘以Xata's Whisper百分比并取整 (连击能力倍率仅显赫武器, 参考站 Z)
        xataTotalDmg = Math.round(xataTotalDmg * xataPercent * str * ((opts.abilityComboMult > 1 && weapon.type === 'Exalted Weapon') ? opts.abilityComboMult : 1));
        totalDamage += xataTotalDmg;
        totalDirectDamage += xataTotalDmg;
      }
    }

    // ═══ ToxicLash: 作为独立伤害组件添加 (匹配参考站点toxicLashDmg) ═══
    let toxicLashDirectDmg = 0;
    let toxicLashTickDmg = 0;
    if (opts.toxicLash && weapon && weapon.attacks && weapon.attacks[0]) {
      const tlPercent = (opts.toxicLashPercent || 30) / 100;
      if (tlPercent > 0) {
        const isMelee = weapon.category === 'Melee';
        const str = (opts.abilityStrength || 100) / 100;
        // 近战武器双倍百分比
        const effectivePercent = isMelee ? 2 * tlPercent * str : tlPercent * str;

        // 计算武器总基础伤害
        const attack = weapon.attacks[0];
        let totalBaseDmg = 0;
        for (const type in attack.damage) {
          totalBaseDmg += attack.damage[type];
        }

        // 计算当前伤害区域的DR因子
        const currentArmor = this.getCurrentArmor(enemy.armor, statusTimeQueue, duration > 0 ? duration : 0);
        let armorFactor = 1;
        let currentRegion = 'health';
        if (enemy.overguard && enemy.overguard > 0) currentRegion = 'overguard';
        else if (enemy.shield > 0) currentRegion = 'shield';
        else if (currentArmor > 0) currentRegion = 'armor';

        if (currentRegion === 'armor' && currentArmor > 0) {
          armorFactor = (1 - this.getDMGReduction(currentArmor)) * (1 - this.getInnateDR(enemy, 'armor'));
        } else {
          armorFactor = 1 - this.getInnateDR(enemy, currentRegion);
        }

        // 直接伤害 = 基础伤害 * DR因子 * ToxicLash百分比
        toxicLashDirectDmg = Math.ceil(totalBaseDmg * armorFactor * effectivePercent);
        totalDamage += toxicLashDirectDmg;
        totalDirectDamage += toxicLashDirectDmg;

        // DoT伤害 (简化版: 基础伤害 * 0.5 tick乘数 * DR因子 * ToxicLash百分比)
        toxicLashTickDmg = Math.ceil(totalBaseDmg * 0.5 * armorFactor * effectivePercent);
      }
    }

    // ═══ Nourish: Viral伤害已通过processMods添加到武器伤害池 ═══
    // 此处仅记录Nourish贡献用于显示 (不在totalDamage中再次添加)
    let nourishViralDmg = 0;
    if (opts.grendelNourish && weapon && weapon.attacks && weapon.attacks[0]) {
      const nourPercent = (opts.grendelNourishPercent || 45) / 100;
      if (nourPercent > 0) {
        let totalBaseDmg = 0;
        for (const type in weapon.attacks[0].damage) {
          totalBaseDmg += weapon.attacks[0].damage[type];
        }
        nourishViralDmg = totalBaseDmg * nourPercent;
      }
    }

    const dps = totalDamage / duration;
    const avgPerShot = shotCount > 0 ? totalDirectDamage / shotCount : 0;
    const avgPerShotStatus = shotCount > 0 ? totalStatusDamage / shotCount : 0;

    // Reference site approach: per-second median DPS
    // Each shot's totalDmg is distributed proportionally into per-second buckets
    // Status DoT is distributed evenly across all seconds
    const perSecondDmg = new Array(Math.ceil(duration)).fill(0);
    const statusPerSec = totalStatusDamage / duration;
    queue.forEach((shot, idx) => {
      const shotStart = shot.time;
      const shotEnd = idx < queue.length - 1 ? queue[idx + 1].time : duration;
      const shotTotalDmg = shot.pellets.reduce((sum, p) => {
        const baseTotal = Object.values(p.damage).reduce((s, v) => s + v, 0);
        return sum + baseTotal * p.critMult;
      }, 0) * ((opts.abilityComboMult > 1 && weapon.type === 'Exalted Weapon') ? opts.abilityComboMult : 1);
      // Distribute direct damage proportionally into per-second buckets
      const startSec = Math.floor(shotStart);
      const endSec = Math.min(Math.ceil(shotEnd), Math.ceil(duration));
      for (let s = startSec; s < endSec; s++) {
        const secStart = Math.max(shotStart, s);
        const secEnd = Math.min(shotEnd, s + 1);
        const overlap = Math.max(0, secEnd - secStart);
        if (overlap > 0 && shotEnd > shotStart) {
          perSecondDmg[s] += (overlap / (shotEnd - shotStart)) * shotTotalDmg;
        }
      }
    });
    // Add status DoT damage evenly across all seconds
    for (let s = 0; s < perSecondDmg.length; s++) {
      perSecondDmg[s] += statusPerSec;
    }
    // Calculate median of per-second damage
    const sortedPerSec = [...perSecondDmg].filter(v => v > 0).sort((a, b) => a - b);
    const medianDps = sortedPerSec.length > 0 
      ? sortedPerSec[Math.floor(sortedPerSec.length / 2)] 
      : dps;

    // 中位数伤害 (per-shot)
    const abilityComboShotMult = (opts.abilityComboMult > 1 && weapon.type === 'Exalted Weapon') ? opts.abilityComboMult : 1;
    const shotDamages = queue.map(shot => {
      return shot.pellets.reduce((sum, p) => {
        const baseTotal = Object.values(p.damage).reduce((s, v) => s + v, 0);
        return sum + baseTotal * p.critMult;
      }, 0) * abilityComboShotMult;
    });
    const sortedDamages = [...shotDamages].sort((a, b) => a - b);
    const medianDmg = sortedDamages[Math.floor(sortedDamages.length / 2)] || 0;

    return {
      dps: medianDps,
      totalDamage,
      avgPerShot,
      avgPerShotStatus,
      medianDmg,
      breakdown: this.getShotBreakdown(queue, statusTimeQueue, pMods, enemy, weapon),
      statusInfo: this.getStatusInfoFromQueue(statusTimeQueue),
      perShotTimeline,
      // 本攻击的原始状态事件 (供合并攻击效果使用: 合并对中的其他攻击需要看到这些状态)
      statusEvents: this.collectStatusEvents(queue)
    };
  },

  // 收集队列中所有状态事件 (原始形式, 供合并攻击效果跨攻击传递)
  collectStatusEvents(queue) {
    const events = [];
    (queue || []).forEach(shot => {
      shot.pellets.forEach(pellet => {
        pellet.statusProcs.forEach(procType => {
          events.push({
            type: procType,
            time: shot.time,
            duration: this.STATUS_DURATION[procType] || 6,
            stacks: 1,
            critTier: pellet.critTier || 0,
            isCrit: pellet.isCrit || false,
            atkIndex: pellet._atkIndex
          });
        });
      });
    });
    return events;
  },

  // ═══════════════ 分攻击模拟 + 随机窗口语义 (参考站等价) ═══════════════

  calcWindowDPS(timeline, duration, windows = 200) {
    if (!timeline || timeline.length === 0) return 0;
    let acc = 0;
    const maxStart = Math.max(duration - 1, 0.001);
    for (let w = 0; w < windows; w++) {
      const start = Math.random() * maxStart;
      const end = start + 1;
      let dmg = 0;
      for (const shot of timeline) {
        if (shot.time >= start && shot.time < end) dmg += shot.damage;
      }
      acc += dmg;
    }
    return acc / windows;
  },

  runPerAttackSimulation(weapon, pMods, enemy, opts = {}, duration = 20) {
    const attacks = weapon.attacks || [];
    const perAttack = [];
    if (attacks.length <= 1) {
      const r = this.runSingleQueue(weapon, pMods, enemy, opts, duration);
      perAttack.push({
        index: 0,
        name: (attacks[0] && attacks[0].name) || '攻击',
        ...r,
        windowDPS: this.calcWindowDPS(r.perShotTimeline, duration)
      });
      return { perAttack, primaryIndex: 0 };
    }

    // ═══════════════ 合并攻击效果 (参考站 mergeStatuses) ═══════════════
    // 合并对中的攻击共享状态效果: 攻击A触发的状态(护甲削减/暴击提升/易伤等)
    // 在攻击B的伤害计算时可见。每个攻击仍独立全速射击, 仅状态池共享。
    const mergeCombs = (opts.mergeCombs || []).filter(c => Array.isArray(c) && c.length >= 2);
    if (mergeCombs.length > 0) {
      const mergedIndices = new Set();
      mergeCombs.forEach(c => c.forEach(i => mergedIndices.add(i)));

      // 阶段1: 收集每个攻击的状态事件 (独立全速射击)
      const collectedEvents = {};
      for (let i = 0; i < attacks.length; i++) {
        const r1 = this.runSingleQueue(weapon, pMods, enemy, opts, duration, i);
        collectedEvents[i] = r1.statusEvents || [];
      }

      // 阶段2: 合并对中的攻击使用共享状态重算; 未合并的攻击独立计算
      for (let i = 0; i < attacks.length; i++) {
        const mergedOpts = { ...opts };
        if (mergedIndices.has(i)) {
          // 收集所有包含攻击i的合并对的状态事件
          const mergeEvents = [];
          for (const comb of mergeCombs) {
            if (comb.includes(i)) {
              for (const j of comb) {
                if (j !== i && collectedEvents[j]) {
                  mergeEvents.push(...collectedEvents[j]);
                }
              }
            }
          }
          mergedOpts.mergeStatusEvents = mergeEvents.length > 0 ? mergeEvents : undefined;
        }
        const r = this.runSingleQueue(weapon, pMods, enemy, mergedOpts, duration, i);
        perAttack.push({
          index: i,
          name: (attacks[i] && attacks[i].name) || ('攻击 ' + (i + 1)),
          ...r,
          windowDPS: this.calcWindowDPS(r.perShotTimeline, duration)
        });
      }
      return { perAttack, primaryIndex: 0 };
    }

    // ═══════════════ 无合并: 组合攻击混跑 (参考站 comb 语义近似) ═══════════════
    const hasComb = weapon.comb && weapon.comb.length > 0;
    let combIdx = null;
    if (hasComb) {
      for (const group of weapon.comb) {
        const idxs = (group || []).filter(i => i >= 0 && i < attacks.length);
        if (idxs.length > 0) { combIdx = idxs; break; }
      }
    }
    if (combIdx && combIdx.length > 0) {
      // 组合攻击: 组内按序交替混跑
      const r = this.runSingleQueue(weapon, pMods, enemy, opts, duration);
      perAttack.push({
        index: combIdx[0],
        name: combIdx.map(i => (attacks[i] && attacks[i].name) || ('攻击 ' + (i + 1))).join(' + '),
        ...r,
        windowDPS: this.calcWindowDPS(r.perShotTimeline, duration)
      });
      return { perAttack, primaryIndex: combIdx[0] };
    }
    // 无组合: 每个攻击独立全速队列
    for (let i = 0; i < attacks.length; i++) {
      const r = this.runSingleQueue(weapon, pMods, enemy, opts, duration, i);
      perAttack.push({
        index: i,
        name: (attacks[i] && attacks[i].name) || ('攻击 ' + (i + 1)),
        ...r,
        windowDPS: this.calcWindowDPS(r.perShotTimeline, duration)
      });
    }
    return { perAttack, primaryIndex: 0 };
  },

  // ═══════════════ 步骤3: 多重射击 ═══════════════

  rollMultishot(baseMultishot) {
    const floor = Math.floor(baseMultishot);
    const frac = baseMultishot - floor;
    return floor + (Math.random() < frac ? 1 : 0);
  },

  // ═══════════════ 步骤4-5: 暴击系统 ═══════════════

  getAttackCritChance(atk, pMods, opts = {}) {
    if (!atk) return 0;
    const bCrit = (atk.crit_chance || 0) / 100;
    const mCrit = pMods.critChance || 0;
    const fCrit = pMods.flatCritChance || 0;
    const mCritMult = 1 + (pMods.multCritChance || 0);
    const wCrit = opts.isHeadshot ? (pMods.weakCritChance || 0) : 0;
    const wMult = opts.isMultiplicativeWeakCC ? (1 + wCrit) : 1;
    const cCrit = opts.comboMultiplier ? opts.comboMultiplier * (pMods.comboCritPer || 0) : 0;
    const hCrit = opts.isHeavy ? (pMods.heavyCritMult || 0) : 0;
    const absCritBonus = this.getAbsCritBonus(opts);
    const fCritChance = (bCrit * (1 + mCrit) + fCrit) * mCritMult * wMult + cCrit + hCrit + absCritBonus;
    return Math.min(fCritChance, 5);
  },

  getHitTier(critChance) {
    const floor = Math.floor(critChance);
    const frac = critChance - floor;
    const upgraded = Math.random() < frac;
    return upgraded ? floor + 1 : floor;
  },

  getEffCritMult(tier, critDmg, coldStacks = 0) {
    if (tier === 0) return 1;
    return 1 + tier * critDmg;
  },

  getStealthDmgBonus(critTier) {
    if (critTier === 1) return 7;
    return 8 + (critTier - 1);
  },

  getAbsCritBonus(opts) {
    let bonus = 0;
    if (opts.kullervoCrit) bonus += (opts.kullervoCritPercent || 50) / 100;
    if (opts.harrowCrit) bonus += (opts.harrowCritPercent || 50) / 100;
    return bonus;
  },

  // ═══════════════ 步骤6-7: 状态系统 ═══════════════

  getAttackStatusChance(atk, pMods, opts = {}) {
    if (!atk) return 0;
    const bSC = (atk.status_chance || 0) / 100;
    const mSC = pMods.statusChance || 0;
    const cSC = opts.comboMultiplier ? opts.comboMultiplier * (pMods.statusChanceByCombo || 0) : 0;
    const hSC = opts.isHeavy ? (pMods.heavyStatusChance || 0) : 0;
    const flatSC = pMods.flatStatusChance || 0;
    return Math.min(bSC * (1 + mSC + cSC + hSC) + flatSC, 10);
  },

  rollProcCount(statusChance) {
    if (statusChance <= 0) return 0;
    const floor = Math.floor(statusChance);
    const frac = statusChance - floor;
    return floor + (Math.random() < frac ? 1 : 0);
  },

  drawProcType(dmgVec, enemyImmunities = []) {
    const types = Object.keys(dmgVec);
    const weights = types.map(type => {
      if (enemyImmunities.includes(type) || enemyImmunities.includes('all')) {
        return 0;
      }
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

  // ═══════════════ 步骤11: 状态时间队列 ═══════════════

  buildStatusTimeQueue(queue, pMods, enemy, externalEvents = []) {
    const statusQueue = {};

    queue.forEach(shot => {
      shot.pellets.forEach(pellet => {
        pellet.statusProcs.forEach(procType => {
          if (!statusQueue[procType]) {
            statusQueue[procType] = [];
          }
          statusQueue[procType].push({
            time: shot.time,
            duration: this.STATUS_DURATION[procType] || 6,
            stacks: 1,
            tickDamage: 0,
            critTier: pellet.critTier || 0,
            isCrit: pellet.isCrit || false,
            atkIndex: pellet._atkIndex
          });
        });
      });
    });

    // 合并外部状态事件 (参考站 mergeStatuses: 合并对攻击的状态共享)
    // 外部事件来自同一合并对中的其他攻击, 使本攻击的伤害计算能看到它们的状态效果
    (externalEvents || []).forEach(evt => {
      if (!evt || !evt.type) return;
      if (!statusQueue[evt.type]) {
        statusQueue[evt.type] = [];
      }
      statusQueue[evt.type].push({
        time: evt.time,
        duration: evt.duration !== undefined ? evt.duration : (this.STATUS_DURATION[evt.type] || 6),
        stacks: evt.stacks || 1,
        tickDamage: 0,
        critTier: evt.critTier || 0,
        isCrit: evt.isCrit || false,
        atkIndex: evt.atkIndex
      });
    });

    // 保留未合并的原始 proc 事件 (DoT 计算用; 合并版供状态效果查询)
    Object.keys(statusQueue).forEach(type => {
      const rawEvents = statusQueue[type];
      statusQueue[type] = this.mergeStatusEvents(rawEvents, type, enemy);
      statusQueue[type]._raw = rawEvents;
    });

    return statusQueue;
  },

  mergeStatusEvents(events, type, enemy) {
    if (events.length === 0) return [];

    // 敌人最大状态层数限制 (参考站 maxProcStacks: 爆破型等敌人, 腐蚀例外可+剥离层数)
    const maxProcStacks = (enemy && enemy.maxProcStacks) || 0;

    events.sort((a, b) => a.time - b.time);
    const merged = [];
    let currentStacks = 0;
    let currentEndTime = 0;

    events.forEach(event => {
      if (event.time >= currentEndTime) {
        // 新的状态周期
        currentStacks = event.stacks;
        currentEndTime = event.time + event.duration;
        merged.push({
          time: event.time,
          endTime: currentEndTime,
          stacks: currentStacks,
          type: type,
          critTier: event.critTier || 0,
          isCrit: event.isCrit || false
        });
      } else {
        // 叠加到现有状态 (受 STATUS_MAX_STACKS 和 敌人 maxProcStacks 限制)
        const maxStacks = this.STATUS_MAX_STACKS[type] || 10;
        if (maxProcStacks > 0) {
          if (type === 'Corrosive') {
            // 腐蚀例外: 限制 = maxProcStacks + 已有腐蚀层数 (参考站 timelineStatus 逻辑)
            currentStacks = Math.min(currentStacks + event.stacks, Math.min(maxStacks, maxProcStacks + currentStacks));
          } else {
            // 其他状态: 限制 = maxProcStacks
            currentStacks = Math.min(currentStacks + event.stacks, Math.min(maxStacks, maxProcStacks));
          }
        } else {
          currentStacks = Math.min(currentStacks + event.stacks, maxStacks);
        }
        currentEndTime = Math.max(currentEndTime, event.time + event.duration);
        merged[merged.length - 1].stacks = currentStacks;
        merged[merged.length - 1].endTime = currentEndTime;
      }
    });

    return merged;
  },

  // ═══════════════ 步骤12: 状态伤害计算 ═══════════════

  calculateStatusDamage(statusTimeQueue, pMods, enemy, weapon, opts) {
    let totalDotDamage = 0;
    const dotBreakdown = {};

    // 获取武器的基础伤害向量(未含MOD)
    const baseDmgVec = this.getWeaponBaseDamageVec(weapon);

    Object.entries(statusTimeQueue).forEach(([type, typeQueue]) => {
      const tickMult = this.DOT_TICK_MULT[type];
      if (!tickMult || tickMult === 0) return;

      // DoT 按原始 proc 事件独立计算 (参考站语义: 每proc完整DoT, 期望等价稳态叠加)
      const events = (typeQueue._raw && typeQueue._raw.length) ? typeQueue._raw : (typeQueue.events || typeQueue);
      if (!Array.isArray(events)) return;

      events.forEach(event => {
        if (!event || typeof event.time !== 'number') return;
        const eventDuration = event.duration != null ? event.duration : (event.endTime - event.time);
        const ticks = Math.floor(eventDuration);

        // DoT基础伤害 = 总MOD后伤害 × tick倍率 (Slash/Heat/Toxin/Electricity/Gas都用总伤害)
        const totalModdedDmg = this.getTotalModdedDamage(baseDmgVec, pMods);
        let tickDmg = totalModdedDmg * tickMult;

        // 元素MOD加成 (Heat用heat mods, Gas用gas mods等)
        // Heat继承: 如果heatInherit > 0, 用heatInherit替代元素自身的mod bonus
        if (pMods.heatInherit > 0 && (type === 'Heat' || type === 'Gas')) {
          tickDmg *= (1 + pMods.heatInherit);
        } else {
          const elementModBonus = pMods.element[type] || 0;
          if (elementModBonus > 0) {
            tickDmg *= (1 + elementModBonus);
          }
        }

        // 每元素状态伤害加成
        const perElementBonus = this.getPerElementStatusBonus(type, pMods);
        if (perElementBonus > 0) {
          tickDmg *= (1 + perElementBonus);
        }

        // Mirage Eclipse加成
        const mirageMult = opts?.mirageBuff || 1;
        tickDmg *= mirageMult;

        // 双重加成
        const dblMult = 1 + (pMods.dblMult || 0);
        tickDmg *= dblMult;

        // 状态伤害加成 (含 Incarnon 进化 status_damage 效果)
        const totalStatusDmg = (pMods.statusDamage || 0) + (opts?.evoStatusDamage || 0);
        if (totalStatusDmg > 0) {
          tickDmg *= (1 + totalStatusDmg);
        }

        // 重击状态伤害加成
        if (opts && opts.isHeavy && pMods.heavyStatusDmg > 0) {
          tickDmg *= (1 + pMods.heavyStatusDmg);
        }

        // 应用阵营元素抗性 (typeOfFaction) - 通过calcPercentAdd
        const typeFactionRes = this.findTypeOfRes(type, enemy);
        if (typeFactionRes !== false) {
          tickDmg = this.calcPercentAdd(tickDmg, typeFactionRes);
        }

        // 物理DoT (Slash无视护甲)
        if (type !== 'Slash') {
          const armorDR = this.getDMGReduction(enemy.armor || 0);
          tickDmg *= (1 - armorDR);
          // 敌人固有伤害减免 (armor region)
          const innateDrArmor = this.getInnateDR(enemy, 'armor');
          if (innateDrArmor > 0) tickDmg *= (1 - innateDrArmor);
        }

        // 暴击倍率 - 参考站用武器完整暴击倍率 (k[n].crit: 非暴击1, 暴击=weapon crit_mult×tier)
        let dotCritMult = 1;
        if (event.isCrit) {
          const dotAtk = event.atkIndex != null ? (weapon.attacks[event.atkIndex] || weapon.attacks[0]) : (weapon.attacks[0] || {});
          const dotAtkMult = (dotAtk && dotAtk.crit_mult) || 2;
          const dotBaseCritMult = dotAtkMult * (1 + (pMods.critMult || 0));
          dotCritMult = this.getEffCritMult(event.critTier || 1, dotBaseCritMult);
        }
        tickDmg *= dotCritMult;

        // 阵营双倍加成 (faction mods double-dip on DoT)
        const factMult = this.getFactMult(enemy.faction, pMods);
        tickDmg *= factMult * factMult;

        // 阵营元素抗性 (使用calcPercentAdd正确处理弱点/抗性)
        const factResist = this.getFactResist(enemy.faction, type);
        tickDmg = this.calcPercentAdd(tickDmg, factResist);
        const elemMult = this.getElemResist(enemy.elemRes, type);
        if (elemMult !== 1) tickDmg *= elemMult;

        // 应用特殊敌人DR (proc版本)
        tickDmg = this.applySpecialEnemyDR(tickDmg, enemy, 1, 1, true);

        // 应用Archon双重DR (if applicable)
        if (enemy.unique === 'archon') {
          const archonDR = GameData.SPECIAL_ENEMY_DR.getArchonDR(tickDmg, 1, true);
          if (archonDR) tickDmg = archonDR;
        }

        // 叠加层数
        tickDmg *= event.stacks;

        const totalEventDamage = tickDmg * ticks;
        totalDotDamage += totalEventDamage;

        if (!dotBreakdown[type]) dotBreakdown[type] = 0;
        dotBreakdown[type] += totalEventDamage;
      });
    });

    return {
      totalDotDamage,
      dotBreakdown
    };
  },

  getWeaponBaseDamageVec(weapon) {
    if (!weapon || !weapon.attacks || weapon.attacks.length === 0) return {};
    return weapon.attacks[0].damage || {};
  },

  getModdedElementDmg(baseDmgVec, elementType, pMods) {
    const totalBase = Object.values(baseDmgVec).reduce((s, v) => s + v, 0);
    const baseVal = baseDmgVec[elementType] || 0;
    const baseMult = 1 + (pMods.base || 0);

    // 物理伤害
    if (GameData.PHYSICAL.includes(elementType)) {
      const physMult = pMods.phys[elementType] || 0;
      return baseVal * baseMult * (1 + physMult);
    }

    // 基础元素 (武器自带)
    if (GameData.BASE_ELEMENTS.includes(elementType) && baseVal > 0) {
      const elemMult = pMods.element[elementType] || 0;
      return baseVal * baseMult * (1 + elemMult);
    }

    // 组合元素或武器没有的元素
    const elemMult = pMods.element[elementType] || 0;
    if (elemMult > 0) {
      return totalBase * baseMult * elemMult;
    }

    return baseVal * baseMult;
  },

  // 计算所有元素的MOD后总伤害 (用于DoT基础伤害)
  getTotalModdedDamage(baseDmgVec, pMods) {
    const baseMult = 1 + (pMods.base || 0);
    let total = 0;

    // 物理伤害
    GameData.PHYSICAL.forEach(type => {
      const baseVal = baseDmgVec[type] || 0;
      const physMult = pMods.phys[type] || 0;
      total += baseVal * baseMult * (1 + physMult);
    });

    // 基础元素 (武器自带)
    GameData.BASE_ELEMENTS.forEach(type => {
      const baseVal = baseDmgVec[type] || 0;
      if (baseVal > 0) {
        const elemMult = pMods.element[type] || 0;
        total += baseVal * baseMult * (1 + elemMult);
      }
    });

    // 组合元素
    GameData.COMBINED_ELEMENTS.forEach(type => {
      const elemMult = pMods.element[type] || 0;
      if (elemMult > 0) {
        const totalBase = Object.values(baseDmgVec).reduce((s, v) => s + v, 0);
        total += totalBase * baseMult * elemMult;
      }
    });

    return total;
  },

  // DoT暴击倍率 - 固定按tier计算 (1x, 1.5x, 2.25x, 3.375x...)
  getDoTCritMult(critTier) {
    if (!critTier || critTier <= 0) return 1;
    return 1 + critTier * 0.5;
  },

  getPerElementStatusBonus(type, pMods) {
    switch (type) {
      case 'Toxin': return pMods.statusDamageToxin || 0;
      case 'Heat': return pMods.statusDamageHeat || 0;
      case 'Electricity': return pMods.statusDamageElectricity || 0;
      case 'Slash': return pMods.statusDamageSlash || 0;
      case 'Gas': return pMods.statusDamageGas || 0;
      default: return 0;
    }
  },

  getCurrentArmor(baseArmor, statusTimeQueue, time) {
    let armor = baseArmor;

    // Corrosive削减
    const corrosiveEvents = statusTimeQueue.Corrosive || [];
    let corrosiveStacks = 0;
    corrosiveEvents.forEach(event => {
      if (time >= event.time && time < event.endTime) {
        corrosiveStacks = Math.max(corrosiveStacks, event.stacks);
      }
    });
    armor *= (1 - this.getCorrosiveReduction(corrosiveStacks));

    // Heat削减
    const heatEvents = statusTimeQueue.Heat || [];
    let hasHeat = false;
    heatEvents.forEach(event => {
      if (time >= event.time && time < event.endTime) {
        hasHeat = true;
      }
    });
    if (hasHeat) {
      armor *= 0.5;
    }

    return Math.max(0, armor);
  },

  getActiveStatusCount(statusTimeQueue, time) {
    let count = 0;
    Object.entries(statusTimeQueue).forEach(([type, events]) => {
      let isActive = false;
      events.forEach(event => {
        if (time >= event.time && time < event.endTime) {
          isActive = true;
        }
      });
      if (isActive) count++;
    });
    return count;
  },

  getStatusStacksAtTime(statusTimeQueue, statusType, time) {
    const events = statusTimeQueue[statusType] || [];
    let maxStacks = 0;
    events.forEach(event => {
      if (time >= event.time && time < event.endTime) {
        maxStacks = Math.max(maxStacks, event.stacks);
      }
    });
    return maxStacks;
  },

  // ═══════════════ 步骤13: DPS计算 ═══════════════

  getShotBreakdown(queue, statusTimeQueue, pMods, enemy, weapon) {
    const breakdown = {};
    let totalDirect = 0;
    let totalStatus = 0;

    queue.forEach(shot => {
      shot.pellets.forEach(pellet => {
        Object.entries(pellet.damage).forEach(([type, dmg]) => {
          const finalDmg = dmg * pellet.critMult;
          breakdown[type] = (breakdown[type] || 0) + finalDmg;
          totalDirect += finalDmg;
        });
      });
    });

    // 添加状态伤害到breakdown — 传递真实武器数据计算DoT基础伤害
    const weaponForDot = weapon && weapon.attacks && weapon.attacks.length > 0 ? weapon : { attacks: queue.length > 0 ? [{}] : [] };
    const dotResults = this.calculateStatusDamage(statusTimeQueue, pMods, enemy, weaponForDot, {});
    Object.entries(dotResults.dotBreakdown || {}).forEach(([type, dmg]) => {
      breakdown[type] = (breakdown[type] || 0) + dmg;
      totalStatus += dmg;
    });

    return {
      breakdown,
      totalDirect,
      totalStatus,
      total: totalDirect + totalStatus
    };
  },

  getStatusInfoFromQueue(statusTimeQueue) {
    const info = {};
    Object.entries(statusTimeQueue).forEach(([type, events]) => {
      const totalStacks = events.reduce((sum, e) => sum + e.stacks, 0);
      info[type] = {
        stacks: totalStacks,
        duration: this.STATUS_DURATION[type],
        maxStacks: this.STATUS_MAX_STACKS[type]
      };
    });
    return info;
  },

  aggregateBreakdown(allResults) {
    const breakdown = {};
    allResults.forEach(result => {
      Object.entries(result.breakdown.breakdown || {}).forEach(([type, dmg]) => {
        breakdown[type] = (breakdown[type] || 0) + dmg;
      });
    });
    // 取平均
    const count = allResults.length;
    Object.keys(breakdown).forEach(type => {
      breakdown[type] /= count;
    });
    return breakdown;
  },

  aggregateStatusInfo(allResults) {
    const info = {};
    allResults.forEach(result => {
      Object.entries(result.statusInfo || {}).forEach(([type, data]) => {
        if (!info[type]) info[type] = { stacks: 0, count: 0 };
        info[type].stacks += data.stacks;
        info[type].count++;
      });
    });
    Object.keys(info).forEach(type => {
      info[type].stacks = info[type].stacks / (info[type].count || 1);
    });
    return info;
  },

  // ═══════════════ TTK计算 ═══════════════

  calcTTKQueue(queueResult, weapon, pMods, enemy, opts = {}) {
    if (!enemy) return { ttk: 0, regions: { overguard: 0, shield: 0, armor: 0, health: 0 } };

    let overguard = enemy.overguard || 0;
    let shield = enemy.shield || 0;
    let health = enemy.health || 0;

    if (overguard + shield + health <= 0) return { ttk: 0, regions: { overguard: 0, shield: 0, armor: 0, health: 0 } };

    const fireRate = queueResult.fireRate || 1;
    const magSize = queueResult.magSize || 1;
    const reloadTime = queueResult.reloadTime || 0;
    const pellets = queueResult.pellets || 1;
    const critChance = (queueResult.breakdown?.totalDirect || 0) > 0 ? 0.5 : 0;
    const critDmg = pMods.critMult || 1;

    const timePerShot = 1 / fireRate;
    const perPelletDmg = queueResult.avgPerShot / pellets;

    const dr = this.getDMGReduction(enemy.armor);
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

      // 超宏防护阶段 (应用 multOverguard 加成 + Void伤害1.5x)
      if (overguard > 0) {
        const ogDmgMult = 1 + (pMods.multOverguard || 0);
        // Void伤害对Overguard有1.5x加成
        const voidBonus = 1.5;
        const ogDmg = pelletDmg * pellets * ogDmgMult * voidBonus;
        overguard -= ogDmg;
        regions.overguard += ogDmg;
        if (overguard <= 0) { regions.overguard += overguard; overguard = 0; }
      }
      // 护盾阶段
      else if (shield > 0) {
        const shDmg = pelletDmg * pellets * this.SHIELD_DAMAGE_MULT;
        shield -= shDmg;
        regions.shield += shDmg;
        if (shield <= 0) { regions.shield += shield; shield = 0; }
      }
      // 生命值阶段
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

  // ═══════════════ MOD处理 ═══════════════

  processMods(mods, weapon, applyWithCond = false, modRanks = []) {
    const result = {
      base: 0, critChance: 0, critMult: 0, multishot: 0, speed: 0,
      statusChance: 0, flatStatusChance: 0, punchThrough: 0, magazineSize: 0, reloadTime: 0,
      statusDamage: 0, basePerStatus: 0, addSlash: 0, addSlashOnImpact: 0,
      smite: {}, element: {}, phys: {},
      flatCritChance: 0, flatCritMult: 0, withCond: {},
      multCritChance: 0, weakCritChance: 0, comboCritPer: 0,
      heavyCritMult: 0, heavyBaseMult: 0, flagBaseMagazineSize: 0,
      heavyStatusDmg: 0, heavyStatusChance: 0,
      statusChanceByCombo: 0,
      lifesteal: 0, finisherDmg: 0, slamMult: 0, windUp: 0,
      range: 0, meleeComboEff: 0, comboDuration: 0, initialCombo: 0,
      ammoCapacity: 0, accuracy: 0, recoil: 0, shotSpeed: 0,
      beamLength: 0, blastRadius: 0, zoom: 0, statusDuration: 0,
      doubleCrit: 0,
      addRadiation: 0, addMagnetic: 0, addGas: 0, addViral: 0,
      addCorrosive: 0, addBlast: 0,
      addRadiationS: 0, addMagneticS: 0, addGasS: 0, addBlastS: 0, addCorrosiveS: 0,
      addHeatNotCombined: 0, addColdNotCombined: 0,
      addElectricityNotCombined: 0, addToxinNotCombined: 0,
      addHeatNotCombinedSBS: 0, addColdNotCombinedSBS: 0,
      addElectricityNotCombinedSBS: 0, addToxinNotCombinedSBS: 0,
      dmgMultAgainstFrozen: 0, critFlatChancePerStatuses: 0,
      flatCritWithStatus: 0, disableBodyCrit: false,
      multiplicativeBasePerStatus: false,
      multiple: 0, dblMult: 0, multDAIKYUBroadhead: 0, multSharpshot: 0,
      vulnStatusDamage: 0, basePerCold: 0,
      baseNoncrit: 0, baseUncritUnstatus: 0, flatChangeDmg: 0,
      critMultAdd: 0, critMultMult: 0, critChanceSlide: 0,
      flatMultishot: 0, setMultishotToDefault: false,
      speedMult: 0, setSpeedToDefault: false,
      chargeTime: 0, burstCount: 0, burstDelay: 0, spread: 0,
      baseMagazineSize: 0, addMagazineSize: 0, hasInfiniteMagazine: false,
      comboDurationP: 0, comboIn: 0,
      dmgVulnerability: 0, heatInherit: 0, heatAdd: 0,
      addMagneticOnImpact: 0, randomStatusAfterStatus: 0,
      incMaxStacksCorrosion: 0, statusDamageToxin: 0, statusDamageHeat: 0,
      statusDamageElectricity: 0, statusDamageSlash: 0, statusDamageGas: 0,
      mInfluence: 0, mDuplicate: 0, multOverguard: 0,
      debilitate: 0, archonVitality: 0, corrosiveByToxin: 0,
      dmgOnStatusEff: 0, electricityBonus: 0, electricityShardAbilityDmg: 0,
      incrCMPuncStatus: 0, incrCCHitReset: 0,
      critAfterStatus: 0, addPunctureStatus: 0, impactToPuncture: 0,
      multForHead: 0, multForHeadMult: 0, headshotMult: 0,
      sniperComboDuration: 0, abilityCombo: 0,
      energy: 0, dSound: 0, archRange: 0, reloadRate: 0, reloadDelay: 0,
      ammoEff: 0, na: 0, meleeComboEffP: 0,
    };

    // set 套装计数 (参考站 findAllBaseModsDmg @516: mods.hasOwnProperty("set") 时 base × set[套件数])
    // 例 Sacrificial set {1:1, 2:1.25}: 同套装装1件=1×, 装2件=1.25×
    const setCounts = {};
    if (mods) {
      mods.forEach(m => { if (m && m.set && m.set.name) setCounts[m.set.name] = (setCounts[m.set.name] || 0) + 1; });
    }

    mods.forEach((mod, idx) => {
      if (!mod || !mod.action) return;
      const rank = modRanks[idx] || 0;
      // 满级判定: 基础伤害MOD(膛线类)满级10, 其余满级5 (与 app.js getModMaxRank 一致)
      let maxRank = (mod.maxRank !== undefined) ? mod.maxRank : ((mod.rank !== undefined) ? mod.rank : 5);
      if (maxRank === 5 && mod.action.base !== undefined && mod.action.base > 1) maxRank = 10;
      if (maxRank === 5 && mod.action.flat_base_damage && mod.action.flat_base_damage > 0) maxRank = 10;
      const rankScale = maxRank > 0 ? (rank / maxRank) : 1;
      const a = mod.action;
      // set 加成: 同套装件数 → set[count] 倍 (参考 findAllBaseModsDmg modsPanel[c].set[a])
      const setMult = (mod.set && mod.set.name && setCounts[mod.set.name])
        ? (mod.set[setCounts[mod.set.name]] || 1) : 1;
      if (a.base) result.base += a.base * rankScale * setMult;
      if (a.crit_chance) result.critChance += a.crit_chance * rankScale;
      if (a.crit_mult) result.critMult += a.crit_mult * rankScale;
      if (a.multishot) result.multishot += a.multishot * rankScale;
      if (a.speed) result.speed += a.speed * rankScale;
      if (a.status_chance) result.statusChance += a.status_chance * rankScale;
      if (a.absolute_status_chance) result.flatStatusChance += a.absolute_status_chance * rankScale;
      if (a.punch_through) result.punchThrough += a.punch_through * rankScale;
      if (a.magazineSize) result.magazineSize += a.magazineSize * rankScale;
      if (a.reloadTime) result.reloadTime += a.reloadTime * rankScale;
      if (a.status_damage) result.statusDamage += a.status_damage * rankScale;
      if (a.base_per_status) result.basePerStatus += a.base_per_status * rankScale;
      if (a.add_slash) result.addSlash += a.add_slash * rankScale;
      if (a.add_slash_on_impact) result.addSlashOnImpact += a.add_slash_on_impact * rankScale;
      if (a.SMITE) Object.entries(a.SMITE).forEach(([f, m]) => { result.smite[f] = (result.smite[f] || 0) + m * rankScale; });
      if (a.element) Object.entries(a.element).forEach(([e, m]) => { result.element[e] = (result.element[e] || 0) + m * rankScale; });
      if (a.phys) Object.entries(a.phys).forEach(([e, m]) => { result.phys[e] = (result.phys[e] || 0) + m * rankScale; });
      if (a.flat_crit_chance) result.flatCritChance += a.flat_crit_chance * rankScale;
      if (a.crit_mult_add) result.flatCritMult += a.crit_mult_add * rankScale;
      if (a.WITH_COND) Object.entries(a.WITH_COND).forEach(([k, v]) => { if (typeof v === 'number') result.withCond[k] = (result.withCond[k] || 0) + v * rankScale; });
      if (a.mult_crit_chance) result.multCritChance += a.mult_crit_chance * rankScale;
      if (a.crit_chance_weakp) result.weakCritChance += a.crit_chance_weakp * rankScale;
      if (a.crit_chance_per_combo) result.comboCritPer += a.crit_chance_per_combo * rankScale;
      if (a.heavy_crit_mult) result.heavyCritMult += a.heavy_crit_mult * rankScale;
      if (a.base_heavy) result.heavyBaseMult += a.base_heavy * rankScale;
      if (a.base_per_magasize || (a.WITH_COND && a.WITH_COND.base_per_magasize)) result.flagBaseMagazineSize += 1;
      if (a.h_status_damage) result.heavyStatusDmg += a.h_status_damage * rankScale;
      if (a.h_status_chance) result.heavyStatusChance += a.h_status_chance * rankScale;
      if (a.status_chance_by_combo) result.statusChanceByCombo += a.status_chance_by_combo * rankScale;
      if (a.lifesteal) result.lifesteal += a.lifesteal * rankScale;
      if (a.finisherDmg) result.finisherDmg += a.finisherDmg * rankScale;
      if (a.slam_mult) result.slamMult += a.slam_mult * rankScale;
      if (a.windUp) result.windUp += a.windUp * rankScale;
      if (a.range) result.range += a.range * rankScale;
      if (a.melee_combo_eff) result.meleeComboEff += a.melee_combo_eff * rankScale;
      if (a.comboDuration) result.comboDuration += a.comboDuration * rankScale;
      if (a.initialCombo) result.initialCombo += a.initialCombo * rankScale;
      if (a.ammoCapacity) result.ammoCapacity += a.ammoCapacity * rankScale;
      if (a.accuracy) result.accuracy += a.accuracy * rankScale;
      if (a.recoil) result.recoil += a.recoil * rankScale;
      if (a.shot_speed) result.shotSpeed += a.shot_speed * rankScale;
      if (a.beam_length) result.beamLength += a.beam_length * rankScale;
      if (a.blast_radius) result.blastRadius += a.blast_radius * rankScale;
      if (a.zoom) result.zoom += a.zoom * rankScale;
      if (a.status_duration) result.statusDuration += a.status_duration * rankScale;
      if (a.double_crit) result.doubleCrit += a.double_crit * rankScale;
      if (a.addRadiation) result.addRadiation += a.addRadiation * rankScale;
      if (a.addMagnetic) result.addMagnetic += a.addMagnetic * rankScale;
      if (a.addGas) result.addGas += a.addGas * rankScale;
      if (a.addViral) result.addViral += a.addViral * rankScale;
      if (a.dmgMultAgainstFrozen) result.dmgMultAgainstFrozen += a.dmgMultAgainstFrozen * rankScale;
      if (a.critFlatChancePerStatuses) result.critFlatChancePerStatuses += a.critFlatChancePerStatuses * rankScale;
      if (a.flatCritWithStatus) result.flatCritWithStatus += a.flatCritWithStatus * rankScale;
      if (a.disableBodyCrit) result.disableBodyCrit = true;
      if (a.multiplicativeBasePerStatus) result.multiplicativeBasePerStatus = true;
      if (a.multiple) result.multiple += a.multiple * rankScale;
      if (a.dbl_mult) result.dblMult += a.dbl_mult * rankScale;
      if (a.multDAIKYUBroadhead) result.multDAIKYUBroadhead += a.multDAIKYUBroadhead * rankScale;
      if (a.multSharpshot) result.multSharpshot += a.multSharpshot * rankScale;
      if (a.vuln_status_damage) result.vulnStatusDamage += a.vuln_status_damage * rankScale;
      if (a.base_per_cold) result.basePerCold += a.base_per_cold * rankScale;
      if (a.base_noncrit) result.baseNoncrit += a.base_noncrit * rankScale;
      if (a.base_uncrit_unstatus) result.baseUncritUnstatus += a.base_uncrit_unstatus * rankScale;
      if (a.flat_change_dmg) result.flatChangeDmg += a.flat_change_dmg * rankScale;
      if (a.crit_mult_add) result.critMultAdd += a.crit_mult_add * rankScale;
      if (a.crit_mult_mult) result.critMultMult += a.crit_mult_mult * rankScale;
      if (a.crit_chance_slide) result.critChanceSlide += a.crit_chance_slide * rankScale;
      if (a.flat_multishot) result.flatMultishot += a.flat_multishot * rankScale;
      if (a.set_mutishot_to_default) result.setMultishotToDefault = true;
      if (a.speed_mult) result.speedMult += a.speed_mult * rankScale;
      if (a.set_speed_to_default) result.setSpeedToDefault = true;
      if (a.charge_time) result.chargeTime += a.charge_time * rankScale;
      if (a.burst_count) result.burstCount += a.burst_count * rankScale;
      if (a.burst_delay) result.burstDelay += a.burst_delay * rankScale;
      if (a.spread) result.spread += a.spread * rankScale;
      if (a.baseMagazineSize) result.baseMagazineSize += a.baseMagazineSize * rankScale;
      if (a.add_magazineSize) result.addMagazineSize += a.add_magazineSize * rankScale;
      if (a.hasInfiniteMagazine) result.hasInfiniteMagazine = true;
      if (a.comboDurationP) result.comboDurationP += a.comboDurationP * rankScale;
      if (a.comboIn) result.comboIn += a.comboIn * rankScale;
      if (a.dmgVulnerability) result.dmgVulnerability += a.dmgVulnerability * rankScale;
      if (a.heatInherit) result.heatInherit += a.heatInherit * rankScale;
      if (a.heatAdd) result.heatAdd += a.heatAdd * rankScale;
      if (a.add_magnetic_on_impact) result.addMagneticOnImpact += a.add_magnetic_on_impact * rankScale;
      if (a.random_status_after_status) result.randomStatusAfterStatus += a.random_status_after_status * rankScale;
      if (a.incMaxStacks_Corrosion) result.incMaxStacksCorrosion += a.incMaxStacks_Corrosion * rankScale;
      if (a.status_damage_toxin) result.statusDamageToxin += a.status_damage_toxin * rankScale;
      if (a.status_damage_heat) result.statusDamageHeat += a.status_damage_heat * rankScale;
      if (a.status_damage_electricity) result.statusDamageElectricity += a.status_damage_electricity * rankScale;
      if (a.status_damage_slash) result.statusDamageSlash += a.status_damage_slash * rankScale;
      if (a.status_damage_gas) result.statusDamageGas += a.status_damage_gas * rankScale;
      if (a.mInfluence) result.mInfluence += a.mInfluence * rankScale;
      if (a.mDuplicate) result.mDuplicate += a.mDuplicate * rankScale;
      if (a.mult_overguard) result.multOverguard += a.mult_overguard * rankScale;
      if (a.debilitate) result.debilitate += a.debilitate * rankScale;
      if (a.archon_vitality) result.archonVitality += a.archon_vitality * rankScale;
      if (a.corrosive_by_toxin) result.corrosiveByToxin += a.corrosive_by_toxin * rankScale;
      if (a.dmgOnStatusEff) result.dmgOnStatusEff += a.dmgOnStatusEff * rankScale;
      if (a.electricityBonus) result.electricityBonus += a.electricityBonus * rankScale;
      if (a.electricityShardAbilityDmg) result.electricityShardAbilityDmg += a.electricityShardAbilityDmg * rankScale;
      if (a.incr_CM_by_punc_status) result.incrCMPuncStatus += a.incr_CM_by_punc_status * rankScale;
      if (a.incr_CC_by_hit_with_reset6tier2) result.incrCCHitReset += a.incr_CC_by_hit_with_reset6tier2 * rankScale;
      if (a.crit_after_status) result.critAfterStatus += a.crit_after_status * rankScale;
      if (a.addPunctureStatus) result.addPunctureStatus += a.addPunctureStatus * rankScale;
      if (a.impactToPuncture) result.impactToPuncture += a.impactToPuncture * rankScale;
      if (a.mult_for_head) result.multForHead += a.mult_for_head * rankScale;
      if (a.mult_for_head_mult) result.multForHeadMult += a.mult_for_head_mult * rankScale;
      if (a.headshot_mult) result.headshotMult += a.headshot_mult * rankScale;
      if (a.sniper_combo_duration) result.sniperComboDuration += a.sniper_combo_duration * rankScale;
      if (a.abilityCombo) result.abilityCombo += a.abilityCombo * rankScale;
      if (a.energy) result.energy += a.energy * rankScale;
      if (a.d_sound) result.dSound += a.d_sound * rankScale;
      if (a.arch_range) result.archRange += a.arch_range * rankScale;
      if (a.reloadRate) result.reloadRate += a.reloadRate * rankScale;
      if (a.reloadDelay) result.reloadDelay += a.reloadDelay * rankScale;
      if (a.ammoEff) result.ammoEff += a.ammoEff * rankScale;
      if (a.na) result.na += a.na * rankScale;
      if (a.melee_combo_effP) result.meleeComboEffP += a.melee_combo_effP * rankScale;
      // 战甲MOD元素注入键 (参考站 setAdditionalMods @740-746)
      // NotCombined = 独立添加(不组合); ScaledByStrength = 按能力强度缩放; S后缀 = 按强度缩放
      if (a.addHeatNotCombined) result.addHeatNotCombined += a.addHeatNotCombined * rankScale;
      if (a.addColdNotCombined) result.addColdNotCombined += a.addColdNotCombined * rankScale;
      if (a.addElectricityNotCombined) result.addElectricityNotCombined += a.addElectricityNotCombined * rankScale;
      if (a.addToxinNotCombined) result.addToxinNotCombined += a.addToxinNotCombined * rankScale;
      if (a.addHeatNotCombinedScaledByStrength) result.addHeatNotCombinedSBS += a.addHeatNotCombinedScaledByStrength * rankScale;
      if (a.addColdNotCombinedScaledByStrength) result.addColdNotCombinedSBS += a.addColdNotCombinedScaledByStrength * rankScale;
      if (a.addElectricityNotCombinedScaledByStrength) result.addElectricityNotCombinedSBS += a.addElectricityNotCombinedScaledByStrength * rankScale;
      if (a.addToxinNotCombinedScaledByStrength) result.addToxinNotCombinedSBS += a.addToxinNotCombinedScaledByStrength * rankScale;
      if (a.addCorrosive) result.addCorrosive += a.addCorrosive * rankScale;
      if (a.addBlast) result.addBlast += a.addBlast * rankScale;
      if (a.addCorrosiveS) result.addCorrosiveS += a.addCorrosiveS * rankScale;
      if (a.addRadiationS) result.addRadiationS += a.addRadiationS * rankScale;
      if (a.addMagneticS) result.addMagneticS += a.addMagneticS * rankScale;
      if (a.addGasS) result.addGasS += a.addGasS * rankScale;
      if (a.addBlastS) result.addBlastS += a.addBlastS * rankScale;
    });

    // 应用条件MOD
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

  // ═══════════════ 元素组合 ═══════════════

  resolveElements(modActions) {
    const baseElements = {};
    const physicalElements = {};
    modActions.forEach(action => {
      if (action.phys) Object.entries(action.phys).forEach(([el, mult]) => { physicalElements[el] = (physicalElements[el] || 0) + mult; });
      if (action.element) Object.entries(action.element).forEach(([el, mult]) => {
        if (GameData.BASE_ELEMENTS.includes(el)) baseElements[el] = (baseElements[el] || 0) + mult;
      });
    });

    // 按照游戏元素层级排序, 两两组合 (低层级优先)
    const activeElements = Object.keys(baseElements).filter(el => baseElements[el] > 0);
    const combinedElements = {};
    const temp = [...activeElements];

    while (temp.length >= 2) {
      // 按层级排序, 最低的两个先组合
      temp.sort((a, b) => (GameData.ELEMENT_HIERARCHY[a] || 99) - (GameData.ELEMENT_HIERARCHY[b] || 99));
      const a = temp.shift();
      const b = temp.shift();
      const comboKey = [a, b].sort().join('+');
      const combined = GameData.ELEMENT_COMBOS[comboKey];
      if (combined) {
        combinedElements[combined] = (combinedElements[combined] || 0) + 1;
        temp.push(combined);
      }
    }

    const allElements = {};
    Object.entries(physicalElements).forEach(([k, v]) => { allElements[k] = (allElements[k] || 0) + v; });
    Object.entries(baseElements).forEach(([k, v]) => { allElements[k] = (allElements[k] || 0) + v; });
    Object.entries(combinedElements).forEach(([k, v]) => { allElements[k] = (allElements[k] || 0) + v; });
    return { physical: physicalElements, base: baseElements, combined: combinedElements, all: allElements };
  },

  // ═══════════════ 武器属性计算 ═══════════════

  getAttackCombos(weapon) {
    if (weapon.comb && weapon.comb.length > 0) return weapon.comb;
    return [[0]];
  },

  // setQuantize: 参考站 16 等分网格量化 (min.js @206711)
  // 对武器总伤害按 /16 网格取整到最近网格点:
  //   step = totalBase / 16; 该型伤害 = Math.round(typeDmg / step) * step
  // 总伤害是 16 的倍数时各型无变形; 非 16 倍数时产生量化变形 (如 Aeolak Alt 97 → 58.2→60.625)
  setQuantize(totalBase, typeDmg) {
    if (typeDmg === 0) return 0;
    const step = totalBase / 16;
    return Math.round(typeDmg / step) * step;
  },

  // findAllBaseModsDmg 等价 (参考站 min.js @516): 收集基础伤害加成总和 b
  // b = slam_base + base_heavy(近战重击) + 武器unique.base + customStat.base + base_per_magasize + ΣΣ槽(base×set)
  // BaseModsDmg (参考站 @517):
  //   noncrit路径 (hasNonCritModsF -> base_noncrit/base_uncrit_unstatus): (1+b+ADD)×(1+MULT)
  //   常规路径: 1+b + (strengthType==="mesa" ? 1.5×strengthMult : 0)
  // isNeedCalcHeavy 等价 (参考站 @507): 攻击定义 isHeavy 字段时以攻击自身为准, 未定义才用全局 is_Heavy
  isHeavyAttack(attack, opts) {
    const hl = attack && attack.isHeavy;
    if (attack && Object.prototype.hasOwnProperty.call(attack, 'isHeavy')) return hl === true;
    return !!opts.isHeavy;
  },

  getBaseDamageModifier(processedMods, weapon, attack, opts = {}) {
    let b = (processedMods.base || 0);
    // Incarnon进化 base 效果 (参考站 evo "狂暴" +50% base damage)
    if (opts.evoBase) b += opts.evoBase;
    // 近战重击: base_heavy 加法并入基础 (参考 findAllBaseModsDmg isNeedCalcHeavy 时收集 base_heavy)
    const isMelee = weapon && (weapon.productCategory === 'Melee' || weapon.category === 'Melee');
    if (isMelee && this.isHeavyAttack(attack, opts)) {
      b += (processedMods.heavyBaseMult || 0);
    }
    // 武器级 unique.base (参考 getStatFromUnique("base"), isMaxCond 时取 WITH_COND.base)
    const uni = weapon && weapon.unique;
    if (uni) {
      if (opts.isMaxCond !== false && uni.WITH_COND && uni.WITH_COND.base) b += uni.WITH_COND.base;
      else if (uni.base) b += uni.base;
    }
    // getBasePerMagasize (参考 @516: 有 base_per_magasize mod 时 0.33×√弹匣)
    if (processedMods.flagBaseMagazineSize > 0) {
      b += 0.33 * Math.sqrt(weapon.magazineSize || 10);
    }
    // mesa 特判: strengthType==="mesa" 时额外 1.5×strengthMult; 本地无该类武器 → 恒 0 (骨架)
    // noncrit 路径: 本地无 base_noncrit/base_uncrit_unstatus mod 数据 → 恒走常规路径 (骨架备用)
    return 1 + b;
  },

  getAttackBaseDamage(attack, processedMods, weapon, opts = {}) {
    const weaponDamage = attack.damage || {};
    const result = {};
    Object.entries(weaponDamage).forEach(([type, value]) => { result[type] = value; });
    const baseMultiplier = this.getBaseDamageModifier(processedMods, weapon, attack, opts);
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

    // 添加额外组合元素伤害 (参考站 setAdditionalMods @740-746)
    // 注入基准 = 初始总基础伤害 e (getTotalBaseDmg = currWeaponInitial.damage 总和, 不含MOD)
    // 注入量 = e × 系数; ScaledByStrength/S后缀键按能力强度缩放
    const nourishMult = (opts.grendelNourish && opts.grendelNourishPercent) ? (opts.grendelNourishPercent / 100) : 0;
    const strengthMult = (opts.abilityStrength || 100) / 100;
    const baseForInject = Object.values(weaponDamage).reduce((s, v) => s + v, 0);
    const injectElements = {
      Heat: (processedMods.addHeatNotCombined || 0) + (processedMods.addHeatNotCombinedSBS || 0) * strengthMult + (processedMods.heatAdd || 0),
      Electricity: (processedMods.addElectricityNotCombined || 0) + (processedMods.addElectricityNotCombinedSBS || 0) * strengthMult,
      Cold: (processedMods.addColdNotCombined || 0) + (processedMods.addColdNotCombinedSBS || 0) * strengthMult,
      Toxin: (processedMods.addToxinNotCombined || 0) + (processedMods.addToxinNotCombinedSBS || 0) * strengthMult,
      Viral: (processedMods.addViral || 0) + nourishMult,
      Corrosive: (processedMods.addCorrosive || 0) + (processedMods.addCorrosiveS || 0) * strengthMult,
      Radiation: (processedMods.addRadiation || 0) + (processedMods.addRadiationS || 0) * strengthMult,
      Magnetic: (processedMods.addMagnetic || 0) + (processedMods.addMagneticS || 0) * strengthMult,
      Gas: (processedMods.addGas || 0) + (processedMods.addGasS || 0) * strengthMult,
      Blast: (processedMods.addBlast || 0) + (processedMods.addBlastS || 0) * strengthMult
    };
    Object.entries(injectElements).forEach(([type, mult]) => {
      if (mult > 0) {
        result[type] = (result[type] || 0) + baseForInject * mult;
      }
    });

    // 16 等分网格量化 (参考站 reCalcWithTypeBase→setQuantize, @206711):
    // 网格基准 = 原始总base × (1+基础伤害MOD倍率) × 阵营MOD  → y*w*l (不含物理/元素/组合MOD)
    // 被量化值 = 该型MOD后伤害 (含物理/元素/组合MOD, 不含阵营相性)
    // 参考站: D=setQuantize(y*w*l, damage[t]*l*c*p*k*v*u*(D?f:1)*d); e[x][t]=calcPercentAdd(D, findTypeOfRes(t))
    // 总基准非 16 倍数时各型量化后总和偏离原总和 (如 Aeolak Alt 97 → 58.2→60.625)
    if (!opts.disableQuantize) {
      const quantBaseRaw = Object.values(weaponDamage).reduce((s, v) => s + v, 0);
      // 阵营对敌MOD (l): 有 faction 时精确 smite[faction], 否则按 smite 池 max (无 smite = 1)
      let factionMult = 1;
      if (processedMods && processedMods.smite) {
        factionMult = opts.faction ? (processedMods.smite[opts.faction] || 0) : Math.max(0, ...Object.values(processedMods.smite));
        factionMult = 1 + factionMult;
      }
      const quantBase = quantBaseRaw * baseMultiplier * factionMult;
      Object.keys(result).forEach(type => {
        if (result[type] > 0) result[type] = this.setQuantize(quantBase, result[type]);
      });
    }

    return result;
  },

  // getFactMult 的 MOD 侧取值 (无需 enemy, 参考站 getFactionMod 语义: 武器上某阵营的对敌歧视MOD)
  // 参考站用 currWeapon 上 smite[faction]; 本地经 opts.faction 精确匹配, 无则按 1+对照 smite_all
  getFactMultFromMods(processedMods) {
    if (!processedMods || !processedMods.smite) return 1;
    const vals = Object.values(processedMods.smite);
    if (vals.length === 0) return 1;
    return 1 + Math.max(0, ...vals);
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

  calcMultishot(weapon, pMods) {
    if (pMods.setMultishotToDefault) return 1;
    const bMS = weapon.multishot || 1;
    const mMS = pMods.multishot || 0;
    const flatMS = pMods.flatMultishot || 0;
    return bMS * (1 + mMS) + flatMS;
  },

  calcFireRate(weapon, pMods, attackIndex = 0) {
    // 防御 null (runSingleQueue 传 attackOnly=null 时默认参数不生效)
    const atk = weapon.attacks[attackIndex ?? 0];
    if (!atk) return 1;
    if (pMods.setSpeedToDefault) return 1;
    const bSpd = atk.speed || 1;
    const mSpd = pMods.speed || 0;
    const mSpdMult = 1 + (pMods.speedMult || 0);
    let spd = bSpd * (1 + mSpd) * mSpdMult;
    if (atk.unique && atk.unique.speed_mult) spd *= atk.unique.speed_mult;
    // 点射: ja = burst / ((burst-1)*burstDelay + 1/speed), burstDelay 随射速加成缩短
    if (atk.burst_count && atk.burst_count > 1) {
      const burstDelay = (atk.burst_delay || 0) / (1 + mSpd) * mSpdMult;
      spd = atk.burst_count / ((atk.burst_count - 1) * burstDelay + 1 / spd);
    }
    // 蓄力: ja = 1 / (chargeTime + reloadTime), Lanka 特例 ja = 1 / chargeTime
    if (atk.charge_time) {
      const chargeTime = atk.charge_time / (1 + (pMods.chargeTime || 0));
      if (weapon.name === 'Lanka') return 1 / chargeTime;
      return 1 / (chargeTime + this.calcReload(weapon, pMods));
    }
    return spd;
  },

  calcMagSize(weapon, pMods) {
    const bMag = weapon.magazineSize || 1;
    const mMag = pMods.magazineSize || 0;
    const addMag = pMods.addMagazineSize || 0;
    const baseMag = pMods.baseMagazineSize || 0;
    let mag = Math.floor((bMag + baseMag) * (1 + mMag) + addMag);
    // 弹药效率增加有效弹匣容量
    if (pMods.ammoEff > 0) {
      mag = Math.floor(mag / (1 - Math.min(pMods.ammoEff, 0.99)));
    }
    return Math.max(1, mag);
  },

  /**
   * 有效装填时间 — 对齐参考站 reCalcWithTypeBase (min-js @550-552)
   *   普通武器: reloadTime = initial.reloadTime / (1 + reloadTimeMods + unique.reloadTime)
   *   电池武器(有 reloadRate+reloadDelay): reloadTime = reloadDelay/(1+reloadTimeMods) + magazineSize/reloadRate
   *   其中 reloadRate = initial.reloadRate / (1 + reloadRateMods)，magazineSize 含 ammoEff
   */
  calcReload(weapon, pMods) {
    const bRel = weapon.reloadTime || 0;
    const mRel = pMods.reloadTime || 0;
    // 装填速度加成 → 装填时间缩短: 参考 /(1+mods) 而非乘法
    const base = bRel / (1 + mRel);
    if (weapon.reloadRate && weapon.reloadDelay !== undefined) {
      const rate = weapon.reloadRate / (1 + (pMods.reloadRate || 0));
      const delay = weapon.reloadDelay / (1 + mRel);
      const mag = this.calcMagSize(weapon, pMods);
      // 试试参考: reloadDelay/a + magazineSize/reloadRate
      return Math.max(0, delay + mag / rate);
    }
    return base;
  },

  // ═══════════════ 护甲/护盾系统 ═══════════════

  getDMGReduction(armor) {
    if (armor <= 0) return 0;
    // Reference site: only uses sqrt(3*armor)/100, armor is capped at 2700 in scaling
    return Math.sqrt(3 * armor) / 100;
  },

  getEffArmor(baseArmor, corrStacks = 0, heatStacks = 0) {
    let armor = baseArmor;
    armor *= (1 - this.getCorrosiveReduction(corrStacks));
    if (heatStacks > 0) armor *= 0.5;
    return Math.max(0, armor);
  },

  armorDR(armor) { return this.getDMGReduction(armor); },

  // ═══════════════ 敌人固有伤害减免 ═══════════════

  getInnateDR(enemy, region) {
    if (!enemy || !enemy.innateDR) return 0;
    return enemy.innateDR[region] || 0;
  },

  // ═══════════════ 阵营系统 ═══════════════

  getFactMult(faction, mods) {
    if (!mods.smite || !mods.smite[faction]) return 1;
    return 1 + mods.smite[faction];
  },

  getFactResist(faction, dmgType) {
    const table = GameData.TYPE_OF_FACTION[faction];
    if (!table) return 0;
    return table[dmgType] || 0;
  },

  findTypeOfRes(dmgType, enemy) {
    const faction = enemy?.faction;
    const typeOfFaction = GameData.TYPE_OF_FACTION;
    if (!faction || !typeOfFaction[faction]) return false;
    for (const key in typeOfFaction[faction]) {
      if (key.toLowerCase() === dmgType.toLowerCase()) {
        return parseFloat(typeOfFaction[faction][key]);
      }
    }
    return false;
  },

  getCombinedResist(faction, dmgType, elemRes) {
    let mult = this.getFactResist(faction, dmgType);
    if (elemRes) {
      const key = dmgType.toLowerCase();
      if (elemRes[key]) mult *= elemRes[key];
    }
    return mult;
  },

  getElemResist(elemRes, dmgType) {
    if (!elemRes) return 1;
    const key = dmgType.toLowerCase();
    return elemRes[key] || 1;
  },

  // calcPercentAdd: 模拟参考站点的阵营元素抗性计算
  // b > 1 (弱点): 返回 a * b (增加伤害)
  // 0 < b <= 1 (抗性): 返回 a * (1 - b) (减少伤害)
  // b = 0 或 falsy (无抗性): 返回 a (不变)
  calcPercentAdd(dmg, resist) {
    if (!resist || resist === 0) return dmg;
    if (resist > 1) return dmg * resist;
    return dmg * (1 - resist);
  },

  // ═══════════════ 特殊敌人DR ═══════════════

  applySpecialEnemyDR(dmg, enemy, speed, multishot, isProc) {
    if (!enemy || !enemy.unique) return dmg;
    
    const DR = GameData.SPECIAL_ENEMY_DR;
    let dr = 1;
    
    switch (enemy.unique) {
      case 'demolisher':
        dr = DR.demolisherDR(dmg);
        break;
      case 'eidolon':
        dr = DR.eidolonDR(dmg, speed || 1);
        break;
      case 'acolytes':
        dr = DR.acolytesDR(dmg);
        break;
      case 'amalgam':
      case 'amalgam-machinist':
      case 'empyrean-corpus':
        dr = DR.amalgamDR(dmg);
        break;
      case 'jugulus':
        dr = isProc ? DR.jugulusDRProc(dmg) : DR.jugulusDR(dmg);
        break;
      case 'saxum':
        dr = DR.jugulusDR(dmg);
        break;
      case 'lephantis':
      case 'hemocyte':
        dr = DR.lephantisDR(dmg, speed || 1);
        break;
      case 'orphix':
        dr = DR.orphixDR(dmg);
        break;
      case 'bursa':
        dr = DR.bursaDR(dmg);
        break;
      case 'suzerain':
        dr = DR.suzerainDR(dmg);
        break;
      case 'archon':
        dr = DR.archonDR(dmg, multishot || 1);
        break;
      case 'demolisherNecramech':
        dr = DR.demolisherNecramechDR();
        break;
      case 'dedicant':
        dr = DR.demolisherNecramechDR();
        break;
      default:
        dr = 1;
    }
    
    // 爆破虚空锐将/斯卡德拉信徒: 每次攻击伤害上限 176000 (参考站 176E3/U 逻辑, U=多重射击)
    if (enemy.unique === 'demolisherNecramech' || enemy.unique === 'dedicant') {
      const ms = multishot || 1;
      const cap = 176000 / ms;
      if (dmg > cap) {
        return cap;
      }
    }
    
    return dmg * dr;
  },

  // ═══════════════ 技能系统 ═══════════════

  calcAbilityDMG(bDmg, abStr, pMods, opts = {}) {
    let totalAbDMG = 0;
    const totalBase = Object.values(bDmg).reduce((s, v) => s + v, 0);

    if (opts.rhinoRoar) {
      const roarM = 1 + (opts.rhinoRoarPercent || 30) / 100;
      totalAbDMG += totalBase * (roarM - 1);
    }
    if (opts.mirageEclipse) {
      const eclM = 1 + (opts.mirageEclipsePercent || 30) / 100;
      totalAbDMG += totalBase * (eclM - 1);
    }
    if (opts.xakuWhisper) {
      const xataM = (opts.xakuWhisperPercent || 26) / 100;
      totalAbDMG += totalBase * xataM * (abStr / 100);
    }
    if (opts.toxicLash) {
      const tlM = (opts.toxicLashPercent || 30) / 100;
      totalAbDMG += totalBase * tlM * (abStr / 100);
    }
    if (opts.grendelNourish) {
      const nourM = (opts.grendelNourishPercent || 45) / 100;
      totalAbDMG += totalBase * nourM * (abStr / 100);
    }
    if (opts.madurai) {
      const physTypes = ['Impact', 'Puncture', 'Slash'];
      const physDmg = physTypes.reduce((sum, type) => sum + (bDmg[type] || 0), 0);
      totalAbDMG += physDmg * 0.3;
    }

    return totalAbDMG;
  },

  /**
   * 计算技能伤害倍率 (用于对总伤害的乘法加成)
   * 只包含Rhino Roar和Mirage Eclipse
   */
  calcAbilityMult(pMods, opts = {}) {
    let mult = 1;

    if (opts.rhinoRoar) {
      const str = (opts.abilityStrength || 100) / 100;
      mult *= 1 + ((opts.rhinoRoarPercent || 30) / 100) * str;
    }
    if (opts.mirageEclipse) {
      const str = (opts.abilityStrength || 100) / 100;
      mult *= 1 + ((opts.mirageEclipsePercent || 30) / 100) * str;
    }
    if (opts.madurai) {
      mult *= 1.3;
    }

    return mult;
  },

  // ═══════════════ Xata's Whisper ═══════════════

  /**
   * 计算Xata's Whisper伤害 (匹配参考站点getXataDmg)
   * @param {number} attackIndex - 武器攻击索引
   * @param {string} damageType - 当前伤害区域 (health/shield/armor/overguard)
   * @param {number} armorMul - 护甲减少倍率 (W)
   * @param {number} damageFactor - 伤害因子 (Ha*P*ca*J*T 或 21*Ha*P*ca*J*T)
   * @param {number} baseDamage - 武器伤害倍率 (J)
   * @param {object} enemy - 敌人对象
   * @param {object} opts - 额外选项 {xakuWhisperPercent, abilityStrength, weapon}
   * @returns {number} Xata's Whisper伤害值
   */
  getXataDmg(attackIndex, damageType, armorMul, damageFactor, baseDamage, enemy, opts = {}) {
    let totalDamage = 0;
    const xataPercent = (opts.xakuWhisperPercent || 26) / 100;
    const str = (opts.abilityStrength || 100) / 100;

    if (xataPercent > 0) {
      const weapon = opts.weapon;
      if (!weapon || !weapon.attacks || !weapon.attacks[attackIndex]) return 0;

      // 1. 求和武器所有基础伤害类型
      const attack = weapon.attacks[attackIndex];
      for (const type in attack.damage) {
        totalDamage += attack.damage[type];
      }

      // 2. 乘以伤害因子和武器伤害倍率
      totalDamage *= damageFactor * baseDamage;

      // 3. Overguard时+50%
      if (damageType === 'overguard') {
        totalDamage *= 1.5;
      }

      // 4. 应用护甲DR或innateDR
      if (damageType === 'armor' && enemy.armor > 0) {
        const effectiveArmor = enemy.armor * Math.max(0, armorMul);
        const effectiveDR = 1 - this.getDMGReduction(effectiveArmor) * (1 - this.getInnateDR(enemy, 'armor'));
        totalDamage *= effectiveDR;
      } else {
        totalDamage *= 1 - this.getInnateDR(enemy, damageType);
      }

      // 5. 乘以Xata's Whisper百分比并取整
      totalDamage = Math.round(totalDamage * xataPercent * str);
    }

    return totalDamage;
  },

  // ═══════════════ ToxicLash ═══════════════

  /**
   * 计算ToxicLash伤害 (匹配参考站点toxicLashDmg)
   * @param {number} baseDmg - 武器基础伤害 (D或c)
   * @param {boolean} isMelee - 是否为近战武器
   * @param {number} armorFactor - 护甲/DR因子
   * @param {number} healthMult - 敌人生命类型倍率 (J)
   * @param {number} elemMod - 元素MOD值 (Gb)
   * @param {number} statusDmg - 状态伤害加成 (Da + mb)
   * @param {string} damageType - 当前伤害区域
   * @param {object} enemy - 敌人对象
   * @param {object} opts - 额外选项 {toxicLashPercent, abilityStrength}
   * @returns {object} {direct_hit, tick_dmg}
   */
  toxicLashDmg(baseDmg, isMelee, armorFactor, healthMult, elemMod, statusDmg, damageType, enemy, opts = {}) {
    const result = { direct_hit: 0, tick_dmg: 0 };
    const tlPercent = (opts.toxicLashPercent || 30) / 100;
    const str = (opts.abilityStrength || 100) / 100;

    if (tlPercent > 0) {
      // 近战武器双倍
      const effectivePercent = isMelee ? 2 * tlPercent * str : tlPercent * str;

      // 直接伤害 = 基础伤害 * 护甲因子 * 生命倍率 * ToxicLash百分比
      result.direct_hit = baseDmg * armorFactor * healthMult * effectivePercent;

      // DoT伤害 = 基础伤害 * 生命倍率 * ToxicLash百分比 * 0.5 * (1+状态伤害) * 生命倍率 * 护甲因子 * 元素MOD
      result.tick_dmg = baseDmg * healthMult * effectivePercent * 0.5 * (1 + statusDmg) * healthMult * armorFactor * elemMod;

      // 取整
      result.direct_hit = Math.ceil(result.direct_hit);
      result.tick_dmg = Math.ceil(result.tick_dmg);
    }

    return result;
  },

  // ═══════════════ Nourish ═══════════════

  /**
   * 计算Nourish添加的Viral伤害 (匹配参考站点newElements中的Nourish处理)
   * Nourish添加Viral伤害到武器基础伤害池
   * @param {object} weapon - 武器对象
   * @param {number} attackIndex - 攻击索引
   * @param {object} pMods - MOD后数据
   * @param {object} opts - 额外选项 {grendelNourishPercent}
   * @returns {number} 添加的Viral伤害值
   */
  calcNourishViralDmg(weapon, attackIndex, pMods, opts = {}) {
    const nourPercent = (opts.grendelNourishPercent || 45) / 100;

    if (nourPercent <= 0 || !weapon || !weapon.attacks || !weapon.attacks[attackIndex]) {
      return 0;
    }

    // 计算武器总基础伤害
    const attack = weapon.attacks[attackIndex];
    let totalBaseDmg = 0;
    for (const type in attack.damage) {
      totalBaseDmg += attack.damage[type];
    }

    // Nourish添加的Viral伤害 = 总基础伤害 * 百分比
    return totalBaseDmg * nourPercent;
  },

  // ═══════════════ 统计工具 ═══════════════

  getStats(vals) {
    if (vals.length === 0) return { min: 0, max: 0, avg: 0, median: 0 };
    const sorted = [...vals].sort((a, b) => a - b);
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    const avg = vals.reduce((s, v) => s + v, 0) / vals.length;
    const median = sorted[Math.floor(sorted.length / 2)];
    return { min, max, avg, median };
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

  fmtNum(num) {
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
    return num.toFixed(1);
  },

  getColor(type) { return GameData.COLORS[type] || '#ffffff'; },
  getName(type) { return GameData.TYPE_NAMES[type] || type; },

  getStatusInfo(type) {
    return {
      duration: this.STATUS_DURATION[type] || 0,
      tickMult: this.DOT_TICK_MULT[type] || 0,
      maxStacks: this.STATUS_MAX_STACKS[type] || 0
    };
  },

  // ═══════════════ 兼容旧接口 ═══════════════

  calcPerShot(weapon, pMods, enemy, opts = {}) {
    const result = this.runSingleQueue(weapon, pMods, enemy, opts, 1);
    return {
      total: result.avgPerShot,
      totalWithDot: result.avgPerShot + result.avgPerShotStatus,
      breakdown: result.breakdown.breakdown,
      dotDPS: result.avgPerShotStatus,
      rawDPS: result.dps,
      effectiveDPS: result.dps,
      pellets: pMods.multishot || 1,
      critChance: 50,
      critDmg: pMods.critMult || 1,
      statusChance: 50,
      ms: this.calcMultishot(weapon, pMods),
      fireRate: this.calcFireRate(weapon, pMods),
      magSize: this.calcMagSize(weapon, pMods),
      reloadTime: this.calcReload(weapon, pMods),
      dr: this.getDMGReduction(enemy.armor) * 100
    };
  },

  runMC(weapon, mods, enemy, opts = {}, iters = 100) {
    const res = [];
    for (let i = 0; i < iters; i++) {
      const r = this.calcDPS(weapon, mods, enemy, opts);
      res.push(r);
    }
    const dps = res.map(r => r.dps);
    const ttk = res.map(r => r.ttk).filter(t => t !== Infinity && t > 0);
    return {
      damage: this.getStats(res.map(r => r.avgPerShot)),
      dotDPS: this.getStats(res.map(r => r.avgPerShotStatus)),
      effectiveDPS: this.getStats(dps),
      ttk: ttk.length > 0 ? this.getStats(ttk) : { min: Infinity, max: Infinity, avg: Infinity, median: Infinity },
      iterations: iters
    };
  },

  // ═══════════════ 估算统计 (用于UI显示) ═══════════════

  estimateCritChance(weapon, pMods) {
    const atk = weapon.attacks[0];
    if (!atk) return 0;
    const bCrit = (atk.crit_chance || 0) / 100;
    const mCrit = pMods.critChance || 0;
    const fCrit = pMods.flatCritChance || 0;
    const mCritMult = 1 + (pMods.multCritChance || 0);
    return Math.min(((bCrit * (1 + mCrit) + fCrit) * mCritMult) * 100, 500);
  },

  estimateCritMult(weapon, pMods) {
    const atk = weapon.attacks[0];
    if (!atk) return 1;
    const baseCM = atk.crit_mult || 2;
    let cm = baseCM * (1 + (pMods.critMult || 0));
    if (pMods.critMultAdd) cm += pMods.critMultAdd;
    if (pMods.critMultMult) cm *= (1 + pMods.critMultMult);
    return cm;
  },

  estimateStatusChance(weapon, pMods) {
    const atk = weapon.attacks[0];
    if (!atk) return 0;
    const bSC = (atk.status_chance || 0) / 100;
    const mSC = pMods.statusChance || 0;
    return Math.min(bSC * (1 + mSC) * 100, 1000);
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = DamageCalculator;
}
