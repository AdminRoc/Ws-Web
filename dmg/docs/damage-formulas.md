# 伤害计算公式详解

> 本文档详细记录每个计算步骤的具体公式和伪代码，用于调试和验证。

---

## 1. 基础伤害计算

### 1.1 Mod 后基础伤害
```
weapon.damage = { impact, puncture, slash, heat, cold, electricity, toxin }

// 1. 基础伤害加成 (Serration 等)
baseMult = 1 + Σ(baseMod.value)

// 2. 物理伤害加成 (每个物理元素独立)
physicalMod = {
  impact: 1 + Σ(impactMod.value),
  puncture: 1 + Σ(punctureMod.value),
  slash: 1 + Σ(slashMod.value)
}

// 3. 元素伤害 (mod 元素直接加算)
elementMod = {
  heat: 1 + Σ(heatMod.value),
  cold: 1 + Σ(coldMod.value),
  electricity: 1 + Σ(electricityMod.value),
  toxin: 1 + Σ(toxinMod.value)
}

// 4. 最终基础伤害
finalDamage.impact = weapon.damage.impact * baseMult * physicalMod.impact
finalDamage.puncture = weapon.damage.puncture * baseMult * physicalMod.puncture
finalDamage.slash = weapon.damage.slash * baseMult * physicalMod.slash
finalDamage.heat = weapon.damage.heat * baseMult * elementMod.heat
// ... 其他元素同理

// 5. 组合元素 (Mod 栏位组合)
// 组合元素伤害 = 基础总伤害 * 组合元素倍率
totalBaseDmg = Σ(finalDamage[物理+元素])
combinedDmg.heat = totalBaseDmg * 1.0 // 单个组合元素
combinedDmg.viral = totalBaseDmg * 1.0 // 单个组合元素

// 如果有多个组合元素，依次应用
combinedDmg.blast = totalBaseDmg * 1.0
combinedDmg.viral = totalBaseDmg * 1.0
```

### 1.2 元素组合规则
```
Mod 栏位从上到下加载:
[Mod1: 基础元素] → [Mod2: 基础元素] → [Mod3: 复合元素] → [Mod4: 复合元素]

组合顺序 (优先级从高到低):
  Heat + Cold = Blast
  Heat + Toxin = Gas
  Heat + Electricity = Radiation
  Electricity + Toxin = Corrosive
  Electricity + Cold = Magnetic
  Toxin + Cold = Viral

例:
  Mod1: Toxin (90%)
  Mod2: Cold (90%)
  → Toxin + Cold = Viral (90%)
  → 最终: Viral 元素伤害 = 基础总伤害 * 0.9
```

---

## 2. 暴击计算

### 2.1 暴击率
```
baseCrit = weapon.critChance / 100

// Mod 加成
addCrit = Σ(critChanceMod.value) // 百分比加成
flatCrit = Σ(critChanceFlatMod.value) // 绝对值加成
multCrit = 1 // 独立乘区 (Vigilante Set)

// 最终暴击率
finalCrit = (baseCrit * (1 + addCrit) + flatCrit) * multCrit
```

### 2.2 暴击倍率
```
baseCritMult = weapon.critMult

// Mod 加成
multBonus = 1 + Σ(critMultMod.value) // 百分比加成
flatBonus = Σ(critMultFlatMod.value) // 绝对值加成

// 最终暴击倍率
finalCritMult = baseCritMult * multBonus + flatBonus
```

### 2.3 暴击等级判定
```
// Tn = 暴击等级 (T0=无暴击, T1=1级暴击, T2=2级暴击...)
floorCrit = floor(finalCrit)
fracCrit = finalCrit - floorCrit

// 有 fracCrit 的概率提升到 floorCrit+1 级
hitTier = random() < fracCrit ? floorCrit + 1 : floorCrit

// 暴击伤害倍率
critMult = hitTier === 0 ? 1 : 1 + hitTier * finalCritMult
```

---

## 3. 多重射击

```
baseMultishot = weapon.multishot || 1

// Mod 加成
msMult = 1 + Σ(multishotMod.value)

// 最终多重射击
finalMs = baseMultishot * msMult

// 弹丸数 = floor(finalMs) + chance(frac(finalMs))
pellets = floor(finalMs) + (random() < frac(finalMs) ? 1 : 0)
```

---

## 4. 射速

```
baseFireRate = weapon.fireRate

// Mod 加成
frMult = 1 + Σ(fireRateMod.value)

// 最终射速
finalFireRate = baseFireRate * frMult
```

---

## 5. 状态几率

```
baseStatusChance = weapon.statusChance / 100

// Mod 加成
scMult = 1 + Σ(statusChanceMod.value)

// 最终状态几率
finalSC = min(baseStatusChance * scMult, 10) // 上限 1000%

// 状态触发数量 = floor(finalSC) + chance(frac(finalSC))
procCount = floor(finalSC) + (random() < frac(finalSC) ? 1 : 0)
```

---

## 6. 状态类型选择

```
// 按伤害权重随机选择
weights = damageVector.map(dmg => {
  isPhysical = ['impact', 'puncture', 'slash'].includes(type)
  return dmg * (isPhysical ? 4 : 1) // 物理伤害有 4x 权重
})

totalWeight = Σ(weights)
roll = random() * totalWeight

// 选择状态类型
for each (type, weight) in weights:
  roll -= weight
  if roll <= 0: return type
```

---

## 7. 身体部位

```
// 默认人形敌人: 50% body, 50% head
bodyParts = [
  { name: 'body', multiplier: 1.0, isHead: false, aimWeight: 0.5 },
  { name: 'head', multiplier: 3.0, isHead: true, aimWeight: 0.5 }
]

// 随机选择
roll = random()
for each part in bodyParts:
  roll -= part.aimWeight
  if roll <= 0: return part
```

---

## 8. 敌人抗性

### 8.1 阵营抗性表
```
factionResistances = {
  grineer: {
    impact: 1.5,   // 弱点
    puncture: 0.75, // 抗性
    slash: 0.75,
    heat: 1.0,
    cold: 0.75,
    electricity: 1.0,
    toxin: 1.0,
    viral: 1.25,
    corrosive: 1.5,
    radiation: 0.75,
    magnetic: 0.5,
    gas: 0.75,
    blast: 1.0,
    void: 1.0
  },
  corpus: {
    impact: 0.75,
    puncture: 1.5,
    slash: 0.75,
    heat: 0.75,
    cold: 1.0,
    electricity: 0.5,
    toxin: 1.25,
    viral: 0.75,
    corrosive: 0.5,
    radiation: 0.75,
    magnetic: 1.5,
    gas: 0.75,
    blast: 0.75,
    void: 1.0
  },
  // ... 其他阵营
}

// 使用方式
damage *= factionResistances[faction][damageType] || 1.0
```

### 8.2 护甲减伤
```
// 公式: DR = 0.9 * sqrt(armor / 2700)
armorDR = 0.9 * sqrt(min(armor, 2700) / 2700)

// 护甲削减
corrosiveStacks = min(corrosiveProcCount, 10)
heatStacks = heatProcCount

effectiveArmor = baseArmor * 0.75^corrosiveStacks * 0.5^heatStacks
finalDR = armorDR(effectiveArmor)

// 伤害减免
damage *= (1 - finalDR)

// Slash 无视护甲
if damageType === 'slash':
  // 不应用护甲减免
```

---

## 9. 阵营 Mod (双倍加成)

```
// 阵营 mod 加成
factionMult = 1 + Σ(factionMod.value) // 对匹配阵营

// 直接伤害: ×1
directDamage *= factionMult

// DoT 伤害: ×2 (双倍加成)
dotDamage *= factionMult * factionMult
```

---

## 10. 单弹丸完整伤害公式

```
// 输入
baseDmg = { impact, puncture, slash, heat, cold, electricity, toxin }
critChance, critMult, partMult, headMult, coMult, factionMult, dr

// 计算
for each (type, dmg) in baseDmg:
  if dmg <= 0: continue
  
  // 1. 暴击倍率
  critDamage = getEffectiveCritMult(tier, critMult)
  
  // 2. 身体部位倍率
  finalDmg = dmg * critDamage * partMult * headMult * coMult * factionMult
  
  // 3. 护甲减免 (Slash 忽略)
  if type !== 'slash':
    finalDmg *= (1 - dr)
  
  // 4. 阵营抗性
  finalDmg *= factionResistances[faction][type]
  
  // 5. 累加
  totalDmg += finalDmg
  breakdown[type] += finalDmg
```

---

## 11. DPS 计算

```
// 单发伤害
perShot = totalDmg // 所有弹丸的总伤害

// 射速
fireRate = weapon.fireRate * (1 + Σ(fireRateMod.value))

// 弹匣 DPS (无装填)
rawDPS = perShot * fireRate

// 有效 DPS (考虑装填)
magazineSize = weapon.magazineSize
reloadTime = weapon.reloadTime

magazineTime = magazineSize / fireRate // 打完弹匣时间
cycleTime = magazineTime + reloadTime // 完整循环时间
effectiveDPS = (perShot * magazineSize) / cycleTime

// DoT DPS
dotDPS = Σ(dotTickDamage * fireRate)

// 最终 DPS
finalDPS = effectiveDPS + dotDPS
```

---

## 12. DoT (持续伤害)

### 12.1 DoT Tick 伤害
```
// Slash (物理 DoT)
slashTickDmg = weapon.damage.slash * baseMult * 0.5
// 注意: Slash DoT 无视护甲

// 元素 DoT
totalBaseDmg = Σ(baseDmg[所有类型])
elementTickDmg = totalBaseDmg * 0.5

// 阵营双倍加成
dotDmg *= factionMult * factionMult

// 护甲减免 (非 Slash)
if type !== 'slash':
  dotDmg *= (1 - armorDR(effectiveArmor))

// 阵营抗性
dotDmg *= factionResistances[faction][type]
```

### 12.2 DoT 持续时间
```
statusDuration = {
  impact: 1, slash: 6, puncture: 6,
  heat: 6, toxin: 6, electricity: 6, cold: 6,
  blast: 1.5, gas: 6, magnetic: 6, radiation: 12,
  viral: 6, corrosive: 8, void: 3, tau: 8
}

// DoT DPS = tickDmg * duration (每秒 tick 一次)
dotDPS = tickDmg * duration
```

---

## 13. 敌人等级缩放

```
// 双曲线平滑过渡
delta = max(0, level - baseLevel)
smoothstep(t) = t * t * (3 - 2 * t)

// 阶段 1: 低等级快速增长
f1 = 1 + 0.015 * pow(delta, 2.12)

// 阶段 2: 高等级线性增长
f2 = 1 + 10.7332 * pow(delta, 0.72)

// 平滑过渡区间 [70, 80]
t = clamp((delta - 70) / (80 - 70), 0, 1)
factor = f1 * (1 - smoothstep(t)) + f2 * smoothstep(t)

// 护甲: [70, 80] 过渡
armorF1 = 1 + 0.005 * pow(delta, 1.75)
armorF2 = 1 + 0.4 * pow(delta, 0.75)
armorFactor = armorF1 * (1 - smoothstep(t)) + armorF2 * smoothstep(t)

// 护盾: [70, 80] 过渡
shieldF1 = 1 + 0.02 * pow(delta, 1.76)
shieldF2 = 1 + 2.0 * pow(delta, 0.76)
shieldFactor = shieldF1 * (1 - smoothstep(t)) + shieldF2 * smoothstep(t)

// 最终属性
health = floor(baseHealth * healthFactor)
armor = min(2700, max(200, floor(baseArmor * armorFactor)))
shield = floor(baseShield * shieldFactor)

// 铁臂之路加成
if steelPath:
  health *= 2.5
  shield *= 2.5
```

---

## 14. 状态效果

### Impact (冲击)
- 硬直 (Stagger): 0.5s 动画中断
- 5 层: 击倒 (Knockdown) 6s
- DoT: 无

### Puncture (穿刺)
- 削弱 (Weaken): 减少目标造成的伤害 5%
- 最多 5 层 = -25% 伤害
- DoT: 无

### Slash (切割)
- 流血 (Bleed): 持续 6s
- 每 tick: 基础伤害 × 50% 的**真实伤害** (无视护甲)
- 无叠加上限
- 可叠加多个独立的 Bleed DoT

### Heat (火焰)
- 硬直 + 持续 6s 的燃烧 DoT
- 每 tick: 基础伤害 × 50%
- 永久削减 50% 护甲 (每次触发刷新)
- 敌人被点燃时 +50% Heat 伤害

### Toxin (毒素)
- 穿透护盾, 直接伤害生命值
- 持续 6s 的毒素 DoT
- 每 tick: 基础伤害 × 50%

### Electricity (电击)
- 连锁闪电 AOE
- 持续 6s
- 每 tick: 基础伤害 × 50%
- 跳转到附近敌人

### Cold (冰冻)
- 减速 (Slow)
- 持续 6s
- 最多 10 层叠加

### Blast (爆炸)
- 弱硬直
- 持续 1.5s
- 无 DoT

### Gas (毒气)
- 毒气云 AOE
- 持续 6s
- 每 tick: 基础伤害 × 50%
- 最多 10 层

### Magnetic (磁力)
- 削弱护盾
- 持续 6s
- +100% 护盾伤害, -50% 生命伤害
- 最多 10 层

### Radiation (辐射)
- 混乱 (Confuse)
- 持续 12s
- 敌人攻击友方单位
- 最多 10 层

### Viral (病毒)
- 增伤
- 持续 6s
- 每层 +90% 对生命值伤害
- 最多 10 层 = +900% 伤害
- **不**作用于护盾

### Corrosive (腐蚀)
- 永久削减护甲
- 持续 8s (但效果永久)
- 每层 -25% 护甲 (最低 0)
- 最多 10 层 = 0 护甲

### Void (虚空)
- 对 Sentient 有额外效果
- 强制打断 (Daze)
- 持续 3s
