# Warframe 伤害计算完整逻辑

> 本文档为调试参考，完整记录伤害计算管线中每一个公式、常量和判定流程。

---

## 1. 基础伤害类型

### 1.1 物理伤害
| 类型 | 缩写 | DoT 持续 | 每 tick | 最大层数 | 效果 |
|------|------|----------|---------|----------|------|
| Impact | IMP | 1s | — | 5 | 硬直 (Stagger)，5层=击倒 (Knockdown) |
| Puncture | PUN | 6s | — | 5 | 削弱 (Weaken)：减少目标造成的伤害 |
| Slash | SLS | 6s | 基础伤害的 50% | ∞ | 流血 (Bleed)：**无视护甲**的真实伤害 |

### 1.2 元素伤害
| 类型 | DoT 持续 | 每 tick | 最大层数 | 效果 |
|------|----------|---------|----------|------|
| Heat | 6s | 基础伤害的 50% | ∞ | 硬直 + 50% 护甲削减 (永久) |
| Toxin | 6s | 基础伤害的 50% | ∞ | 穿透护盾，直接伤害生命值 |
| Electricity | 6s | 基础伤害的 50% | ∞ | 连锁闪电 (AOE) |
| Cold | 6s | — | 10 | 减速 (Slow)：减缓敌人行动 |

### 1.3 复合元素伤害
| 类型 | DoT 持续 | 每 tick | 最大层数 | 效果 |
|------|----------|---------|----------|------|
| Blast | 1.5s | — | — | 硬直 (弱于 Heat) |
| Gas | 6s | 基础伤害的 50% (AOE) | 10 | 毒气云 (AOE 持续伤害) |
| Magnetic | 6s | — | 10 | 削弱护盾：+100% 护盾伤害，-50% 生命伤害 |
| Radiation | 12s | — | 10 | 混乱 (Confuse)：敌人攻击友方 |
| Viral | 6s | — | 10 | 增伤：每层 +90% 对生命值伤害 (最高 +900%) |
| Corrosive | 8s | — | 10 | 永久削减护甲：每层 -25% (最低 0) |

### 1.4 特殊伤害
| 类型 | DoT | 效果 |
|------|-----|------|
| Void | 3s | 对 Sentient 效果翻倍，强制打断 (Daze) |
| Tau | 8s | Sentient 专属抗性 |
| Finisher | — | 处决伤害，无视所有防御 |

---

## 2. 敌人抗性表 (typeOfFaction)

```javascript
const factionResistances = {
  "Grineer":        { Corrosive: 1.5, Impact: 1.5, Viral: 1.25, Heat: 1.0, Radiation: 0.75, Slash: 0.75, Magnetic: 0.5 },
  "Kuva Grineer":   { Corrosive: 1.5, Impact: 1.5, Heat: 0.5 },
  "Corpus":         { Magnetic: 1.5, Puncture: 1.5, Toxin: 1.25, Slash: 0.75, Radiation: 0.75, Corrosive: 0.5 },
  "Corpus Amalgam": { Electricity: 1.5, Blast: 0.5 },
  "Infested":       { Slash: 1.5, Heat: 1.5, Toxin: 1.25, Blast: 0.75, Corrosive: 0.5 },
  "Infested Deimos":{ Blast: 1.5, Gas: 1.5, Viral: 0.5, Magnetic: 0.5 },
  "Corrupted":      { Slash: 1.5, Viral: 1.25, Radiation: 1.25, Corrosive: 0.5, Magnetic: 0.5 },
  "Orokin":         { Puncture: 1.5, Viral: 1.5, Radiation: 0.5, Corrosive: 0.5 },
  "Sentient":       { Corrosive: 0.5, Cold: 1.5, Magnetic: 1.5, Radiation: 1.5 },
  "Narmer":         { Toxin: 1.5, Slash: 1.5, Magnetic: 0.5 },
  "Anarchs":        { Electricity: 1.5, Radiation: 0.5, Impact: 1.5 },
  "Zariman":        { Void: 1.5 },
  "Scaldra":        { Toxin: 0.5, Corrosive: 1.5, Impact: 1.5 },
  "Techrot":        { Cold: 0.5, Gas: 1.5, Magnetic: 1.5 },
};
```

**使用方式**: `damage *= factionResistance[faction][elementType] || 1.0`

---

## 3. 敌人等级缩放

### 3.1 基础公式 (双曲线平滑过渡)

```javascript
function enemyStatScaling(base, level, faction) {
  const delta = level - 1;
  // 阶段 1: 低等级快速增长
  const f1 = 1 + 0.0155 * Math.pow(delta, 1.55);
  // 阶段 2: 高等级线性增长
  const f2 = 1 + 0.00783 * delta + 0.000373 * delta * delta;
  // 平滑过渡区间
  const t = clamp((delta - 80) / (200 - 80), 0, 1);
  const smooth = t * t * (3 - 2 * t); // smoothstep
  const factor = f1 * (1 - smooth) + f2 * smooth;
  return Math.round(base * factor);
}
```

### 3.2 铁臂之路 (Steel Path) 加成
- 等级 +100
- 生命值 × 2.5
- 护盾 × 2.5

### 3.3 护甲缩放
```javascript
// 等级 < 80: 线性增长
armor = baseArmor + baseArmor * 0.005 * (level - 1)
// 等级 >= 80: 加速增长
armor = baseArmor * (1 + 0.4 * Math.pow(level / 80, 2))
```

---

## 4. 护甲伤害减免 (Armor Damage Reduction)

### 4.1 核心公式
```javascript
function getDamageReduction(armor) {
  return Math.sqrt(3 * armor) / 100;
}

// 简化形式 (wfsim 参考)
function armorDR(armor) {
  return 0.9 * Math.sqrt(armor / 2700);
  // 其中 ARMOR_CAP = 2700
}
```

### 4.2 护甲削减 (Corrosive / Heat)
```javascript
// Corrosive Proc: 永久 -25% 护甲 (最低 0), 最多 10 层
// Heat Proc: -50% 护甲 (永久, 但 Heat 状态本身有持续时间)
// 部分武器/技能有护甲穿透 (armorPierce)
function applyArmorReduction(armor, corrosionStacks, heatStacks) {
  let reduced = armor;
  reduced *= Math.pow(0.75, corrosionStacks); // -25% per stack
  reduced *= Math.pow(0.5, heatStacks); // -50% per heat proc
  return Math.max(0, reduced);
}
```

### 4.3 护盾机制
- 护盾受到的所有伤害 × 0.5 (默认)
- 护盾为 0 时, 有 0.1s 的无敌帧 (damage gate)
- Magnetic: 对护盾 +100% 伤害
- Toxin: **穿透护盾**, 直接伤害生命值

---

## 5. 暴击计算

### 5.1 暴击率
```javascript
function getFinalCritChance(baseCritChance, mods) {
  // flat_crit: 绝对值加成 (如 +20%)
  // add_crit: 加成百分比 (如 +100% means ×2)
  // mult_crit: 独立乘区 (如 Vigilante Set)
  const flat = mods.flat_crit || 0;
  const add = mods.add_crit || 0;
  const mult = mods.mult_crit || 1;
  
  const cc = (baseCritChance * (1 + add) + flat) * mult;
  
  // Vigilante Set: 暴击时有几率提升一级
  // 即: critTier = floor(cc) + chance(frac(cc))
  return cc;
}
```

### 5.2 暴击倍率
```javascript
function getCritMultiplier(baseCritDamage, mods) {
  // 每级暴击的基础倍率 = baseCritDamage
  // T0 (无暴击): ×1
  // T1 (1×cd): ×(1 + cd)
  // T2 (2×cd): ×(1 + 2*cd)
  // Tn: ×(1 + n*cd)
  return baseCritDamage;
}

// 最终暴击伤害
function critDamage(tier, baseCritDamage) {
  if (tier === 0) return 1;
  return 1 + tier * baseCritDamage;
}
```

### 5.3 暴击等级判定
```javascript
function getHitTier(cc) {
  // cc = 最终暴击率
  const floor = Math.floor(cc);
  const frac = cc - floor;
  // 有 frac 的概率提升到 floor+1 级
  const upgraded = Math.random() < frac;
  return upgraded ? floor + 1 : floor;
}
```

### 5.4 期望暴击倍率 (DPS计算专用)
```javascript
// 用于确定性DPS计算，避免随机值导致结果不稳定
// E[critMult] = (1 - critChance) * 1 + critChance * (1 + critDamage)
// 简化: E[critMult] = 1 + critChance * critDamage
function getExpectedCritMult(critChance, critDamage) {
  return 1 + critChance * critDamage;
}

// 示例:
// 武器暴击率 12%, 暴击倍率 1.6x
// E[critMult] = 1 + 0.12 * 1.6 = 1.192
// 即: 平均每次攻击造成 1.192 倍基础伤害
```

---

## 6. 状态异常 (Status Procs)

### 6.1 状态触发数量
```javascript
function rollProcCount(statusChance) {
  if (statusChance <= 0) return 0;
  const floor = Math.floor(statusChance);
  const frac = statusChance - floor;
  // 100% 触发 floor 个, 加上 frac 的概率再触发 1 个
  return floor + (Math.random() < frac ? 1 : 0);
}
```

### 6.2 状态类型选择
```javascript
function drawProcType(damageVector) {
  // 按伤害权重随机选择 (物理伤害有 4× 权重)
  const weighted = damageVector.map((dmg, type) => {
    const weight = isPhysical(type) ? dmg * 4 : dmg;
    return { type, weight };
  });
  const totalWeight = weighted.reduce((s, w) => s + w.weight, 0);
  let roll = Math.random() * totalWeight;
  for (const { type, weight } of weighted) {
    roll -= weight;
    if (roll <= 0) return type;
  }
  return weighted[weighted.length - 1].type;
}
```

### 6.3 DoT (持续伤害) tick 公式
```javascript
function dotDamage(type, element, baseDamage, modsMult, armorPierce) {
  // baseDamage: 武器的基础伤害 (不含元素加成)
  // element: 元素加成 (1 + Σ 元素 mod)
  // modsMult: 其他独立乘区 (如 Condition Overload)
  
  let damage = baseDamage * element * modsMult;
  
  // 物理 DoT: 伤害 = 基础物理 × 元素 mod × 其他 mod
  // 元素 DoT: 伤害 = 基础伤害 × (1 + Σ 该元素 mod) × 其他 mod
  
  // 应用派系抗性
  const resist = getFactionResistance(type, faction);
  damage *= resist;
  
  // 应用护甲减免 (Slash 忽略护甲)
  if (type !== 'Slash') {
    const armor = getEffectiveArmor(armorPierce);
    damage *= (1 - getDamageReduction(armor));
  }
  
  return damage;
}
```

---

## 7. 伤害计算管线 (完整流程)

### 7.1 单次射击计算
```
1. 多段射击 (Multishot)
   - floor(ms) + chance(frac(ms)) 个弹丸
   - 每个弹丸独立计算

2. 弹丸命中判定
   - 确定命中的身体部位 (body part)
   - 获取部位倍率 (head=3×, body=1×, 其他)

3. 暴击判定
   - rollCrit(baseCritChance, mods)
   - 确定暴击等级 tier

4. 基础伤害计算
   baseDmg = Σ(baseDamage * (1 + dmgMods)) * elementMultiplier

5. 暴击倍率
   critMult = 1 + tier * critDamage

6. 弱点倍率
   weakpointMult = 1 + (isHead ? headshotMult : 1) + weakpointDamage

7. Condition Overload
   coMult = 1 + (statusStacks * coPerStack)

8. 最终伤害
   finalDmg = baseDmg * critMult * weakpointMult * coMult * bodyPartMult

9. 护甲减免
   finalDmg *= (1 - armorDR(effectiveArmor))

10. 派系抗性
    finalDmg *= factionResistance[faction][element]

11. 处理伤害分配
    shieldDmg = finalDmg * 0.5 (护盾减半)
    healthDmg = finalDmg (生命值全伤)
```

### 7.2 DoT (持续伤害) 处理
```
1. 确定 DoT 类型 (物理/元素)
2. 计算 tick 伤害 (见 §6.3)
3. 确定持续时间 (见 §1)
4. 每秒 tick 一次 (大部分 1 tick/s, Heat/Electricity 也 1 tick/s)
5. 叠加上限 (见 §1 表格)
6. Slash DoT 无视护甲, 是真实伤害
7. Toxin DoT 穿透护盾
8. 部分 DoT 受派系 mod 双倍加成 (faction mod double-dip on DoT)
```

### 7.3 护甲削减流程
```
1. 初始护甲 = baseArmor * armorScaling(level)
2. Corrosive Proc: 每层 -25% (永久), 最多 10 层 → 0 护甲
3. Heat Proc: -50% (永久, 但 heat 状态有持续时间)
4. 护甲穿透 (armorPierce): 武器/技能的固定护甲减免
5. 最终护甲 = max(0, base * 0.75^corrosive * 0.5^heat - armorPierce)
```

---

## 8. 元素组合表 (Mod Load Order)

### 8.1 基础元素
Heat, Electricity, Toxin, Cold

### 8.2 复合元素 (在 Mod 栏位中按顺序组合)
```
Mod 4 (最后一个元素 mod) 组合规则:
  Heat + Cold    = Blast
  Heat + Toxin  = Gas
  Heat + Electricity = Radiation
  Electricity + Cold  = Magnetic
  Electricity + Toxin = Corrosive
  Toxin + Cold       = Viral
```

### 8.3 元素优先级 (Mod 栏位从上到下)
```
[Mod1: 基础元素] → [Mod2: 基础元素] → [Mod3: 复合元素] → [Mod4: 复合元素]
   ↓                    ↓                    ↓                    ↓
  Heat               Cold              Heat+Cold=Blast      Blast+Viral=?
```

---

## 9. 状态效果详细表

### Impact
- 硬直 (Stagger): 0.5s 动画中断
- 5 层: 击倒 (Knockdown) 6s
- 对 Sentient 有额外效果

### Puncture
- 削弱 (Weaken): 持续 6s
- 减少目标造成的伤害 5%
- 最多 5 层 = -25% 伤害

### Slash
- 流血 (Bleed): 持续 6s
- 每 tick 造成: 基础伤害 × 50% 的**真实伤害** (无视护甲)
- 无叠加上限
- 可叠加多个独立的 Bleed DoT

### Heat
- 硬直 + 持续 6s 的燃烧 DoT
- 每 tick: 基础伤害 × 50%
- 永久削减 50% 护甲 (每次触发刷新)
- 敌人被点燃时 +50% Heat 伤害

### Toxin
- 穿透护盾, 直接伤害生命值
- 持续 6s 的毒素 DoT
- 每 tick: 基础伤害 × 50%

### Electricity
- 连锁闪电 AOE
- 持续 6s
- 每 tick: 基础伤害 × 50%
- 跳转到附近敌人

### Cold
- 减速 (Slow)
- 持续 6s
- 最多 10 层叠加
- 每层增加减速效果

### Blast
- 弱硬直
- 持续 1.5s
- 无 DoT

### Gas
- 毒气云 AOE
- 持续 6s
- 每 tick: 基础伤害 × 50%
- 最多 10 层
- AOE 范围随层数增加

### Magnetic
- 削弱护盾
- 持续 6s
- +100% 护盾伤害, -50% 生命伤害
- 最多 10 层

### Radiation
- 混乱 (Confuse)
- 持续 12s
- 敌人攻击友方单位
- 最多 10 层

### Viral
- 增伤
- 持续 6s
- 每层 +90% 对生命值伤害
- 最多 10 层 = +900% 伤害
- **不**作用于护盾

### Corrosive
- 永久削减护甲
- 持续 8s (但效果永久)
- 每层 -25% 护甲 (最低 0)
- 最多 10 层 = 0 护甲

### Void
- 对 Sentient 有额外效果
- 强制打断 (Daze)
- 持续 3s

### Tau
- Sentient 专属
- 持续 8s

---

## 10. 伤害计算示例

### 示例: 步枪 vs Grineer 士兵
```
武器: 基础伤害 = 50 (Impact 20, Slash 20, Puncture 10)
Mod: +150% 基础伤害, +90% Heat
敌人: Grineer, 等级 50, 护甲 200, 生命 500

1. Mod 后伤害:
   Impact: 20 * (1 + 1.5) = 50
   Slash: 20 * (1 + 1.5) = 50
   Puncture: 10 * (1 + 1.5) = 25
   Heat: 0 + (50+50+25) * 0.9 = 112.5
   总计: 50 + 50 + 25 + 112.5 = 237.5

2. 暴击: 假设 T1 (1×0.5=1.5×)
   总计: 237.5 * 1.5 = 356.25

3. 弱点: 头部 3×
   总计: 356.25 * 3 = 1068.75

4. 护甲减免: armor=200 → DR = sqrt(600)/100 = 7.7%
   总计: 1068.75 * (1 - 0.077) = 986.5

5. 派系抗性:
   Impact: 1.5×, Slash: 0.75×, Heat: 1.0×
   (加权平均) ≈ 1.1×
   最终: 986.5 * 1.1 ≈ 1085
```

---

## 11. 关键常量

```javascript
const HEADSHOT_MULT_INITIAL = 3;      // 基础头部倍率
const COMBO_COUNTER_INITIAL = 11;      // 初始连击计数
const ARMOR_CAP = 2700;                // 护甲上限
const ARMOR_SPAWN_MIN = 200;           // 护甲最低值
const SHIELD_DAMAGE_MULT = 0.5;        // 护盾伤害倍率
const SHIELD_GATE_DURATION = 0.1;      // 护盾破碎无敌帧 (秒)
const VIRAL_PER_STACK = 0.9;           // Viral 每层增伤
const CORROSIVE_PER_STACK = 0.25;      // Corrosive 每层减甲
const HEAT_ARMOR_STRIP = 0.5;         // Heat 护甲削减
const PUNCTURE_WEAKEN = 0.05;         // Puncture 每层削弱
const STATUS_DURATION = {
  Impact: 1, Slash: 6, Puncture: 6,
  Heat: 6, Toxin: 6, Electricity: 6, Cold: 6,
  Blast: 1.5, Gas: 6, Magnetic: 6, Radiation: 12,
  Viral: 6, Corrosive: 8, Void: 3, Tau: 8
};
```

---

## 12. 元素组合完整规则

```javascript
const ELEMENT_COMBOS = {
  'Heat+Cold': 'Blast',
  'Heat+Toxin': 'Gas',
  'Heat+Electricity': 'Radiation',
  'Electricity+Toxin': 'Corrosive',
  'Electricity+Cold': 'Magnetic',
  'Toxin+Cold': 'Viral',
};

// Mod 栏位顺序决定最终元素
// 第 4 个元素 Mod 决定最终复合元素
// 如果已有 Blast, 再加 Viral → Blast + Viral (独立元素)
```

---

## 13. 完整伤害管线伪代码

```javascript
function calculateDamage(weapon, mods, enemy, options) {
  // 1. 基础伤害
  const baseDmg = {
    Impact: weapon.impact * (1 + mods.physImpact),
    Puncture: weapon.puncture * (1 + mods.physPuncture),
    Slash: weapon.slash * (1 + mods.physSlash),
  };
  
  // 2. 元素组合
  const element = resolveElement(mods.elements);
  const elementDmg = calculateElementDamage(baseDmg, element, mods);
  
  // 3. 基础伤害总计
  const totalBase = sum(baseDmg) + elementDmg;
  const baseDmgMod = 1 + mods.baseDamage;
  
  // 4. 多段射击
  const ms = getMultishot(weapon, mods);
  const pellets = Math.floor(ms) + (Math.random() < (ms - Math.floor(ms)) ? 1 : 0);
  
  let totalDamage = 0;
  
  for (let i = 0; i < pellets; i++) {
    // 5. 身体部位
    const part = rollBodyPart(weapon.bodyParts);
    const partMult = part.multiplier;
    
    // 6. 暴击
    const critChance = getFinalCritChance(weapon.baseCrit, mods);
    const tier = getHitTier(critChance);
    const critMult = 1 + tier * weapon.critDamage;
    
    // 7. 弱点
    const headMult = part.isHead ? (1 + weapon.headshotMult + mods.weakpointDamage) : 1;
    
    // 8. CO
    const coMult = 1 + (countStatuses(enemy) * mods.coPerStack);
    
    // 9. 派系
    const factionMult = getFactionMult(mods, enemy.faction);
    
    // 10. 单弹丸伤害
    let dmg = totalBase * baseDmgMod * critMult * partMult * headMult * coMult * factionMult;
    
    // 11. 护甲
    const armor = getEffectiveArmor(enemy, mods);
    dmg *= (1 - armorDR(armor));
    
    // 12. 派系抗性
    dmg *= getFactionResistance(enemy.faction, element);
    
    totalDamage += dmg;
  }
  
  return totalDamage;
}
```

---

## 14. DoT 伤害独立计算

```javascript
function calculateDoT(type, baseDmg, mods, enemy) {
  // DoT 不受暴击影响
  // DoT 受派系 mod 双倍加成 (faction double-dip)
  
  const tickDmg = getTickDamage(type, baseDmg, mods);
  const duration = STATUS_DURATION[type];
  const ticks = duration; // 每秒 1 tick
  
  let totalDot = 0;
  for (let i = 0; i < ticks; i++) {
    let dmg = tickDmg;
    
    // 派系双倍加成
    dmg *= mods.factionMult; // 第一次
    dmg *= mods.factionMult; // 第二次 (double-dip)
    
    // 护甲 (Slash 忽略)
    if (type !== 'Slash') {
      const armor = getEffectiveArmor(enemy, mods);
      dmg *= (1 - armorDR(armor));
    }
    
    // 派系抗性
    dmg *= getFactionResistance(enemy.faction, type);
    
    totalDot += dmg;
  }
  
  return totalDot;
}
```

---

## 15. 裂罅MOD属性词条

### 15.1 属性名称中英文映射

| 英文名称 | 中文名称 | 说明 |
|----------|----------|------|
| Damage | 伤害 | 基础伤害加成 |
| Multishot | 多重射击 | 额外弹丸数 |
| Critical Chance | 暴击几率 | 暴击概率加成 |
| Critical Damage | 暴击伤害 | 暴击倍率加成 |
| Fire Rate | 射速 | 攻击速度加成 |
| Status Chance | 状态几率 | 状态触发概率加成 |
| Status Duration | 状态持续时间 | 状态效果持续时间加成 |
| Heat Damage | 火焰伤害 | 火焰元素伤害加成 |
| Cold Damage | 冰冻伤害 | 冰冻元素伤害加成 |
| Electricity Damage | 电击伤害 | 电击元素伤害加成 |
| Toxin Damage | 毒素伤害 | 毒素元素伤害加成 |
| Impact Damage | 冲击伤害 | 冲击物理伤害加成 |
| Puncture Damage | 穿刺伤害 | 穿刺物理伤害加成 |
| Slash Damage | 切割伤害 | 切割物理伤害加成 |
| Magazine Capacity | 弹匣容量 | 弹匣大小加成 |
| Reload Speed | 装填速度 | 装填时间减少 |
| Punch Through | 穿透 | 子弹穿透敌人数量 |
| Flight Speed | 投射物速度 | 飞行速度加成 |
| Zoom | 缩放 | 瞄准倍率加成 |
| Recoil | 后坐力 | 后坐力减少 |
| Ammo Maximum | 弹药上限 | 最大弹药数加成 |
| Combo Duration | 连击持续时间 | 连击保持时间加成 |
| Finisher Damage | 处决伤害 | 处决攻击伤害加成 |
| Range | 范围 | 近战攻击范围加成 (近战专属) |
| Initial Combo | 初始连击 | 初始连击数加成 (近战专属) |
| Heavy Attack Efficiency | 重击效率 | 重击消耗连击效率加成 (近战专属) |
| Critical Chance on Slide Attack | 滑行暴击几率 | 滑行攻击暴击几率加成 (近战专属) |
| Additional Combo Count Chance | 额外连击几率 | 额外连击数概率加成 (近战专属) |
| Damage vs. Corpus | 对Corpus伤害 | 对Corpus阵营伤害加成 |
| Damage vs. Grineer | 对Grineer伤害 | 对Grineer阵营伤害加成 |
| Damage vs. Infested | 对Infested伤害 | 对Infested阵营伤害加成 |

### 15.2 负面属性特殊说明

负面属性是裂罅MOD的诅咒效果，会降低对应的属性值。以下属性只能作为负面属性出现：
- 所有正面属性均可作为负面属性
- 元素伤害负面效果为减少对应元素伤害
- 物理伤害负面效果为减少对应物理伤害
- 特殊属性负面效果为减少对应属性值

### 15.3 裂罅倾向性

裂罅倾向性 (Disposition) 是武器的裂罅MOD倍率系数，范围 0.5-1.55：
- ●●●●● (1.31-1.55): 强力: 分配给最不常用的武器
- ●●●●○ (1.11-1.3): 较强: 分配给较少使用的武器
- ●●●○○ (0.9-1.1): 中性: 使用频率平均的武器
- ●●○○○ (0.7-0.89): 较弱: 分配给较常用的武器
- ●○○○○ (0.5-0.69): 弱: 分配给最常用的武器
