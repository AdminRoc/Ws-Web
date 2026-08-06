/**
 * Warframe 伤害计算器 - 完整游戏数据 (v3)
 * 数据来源: 公开游戏数据和社区分析
 * 包含: 662武器 / 587MOD / 495敌人 / 阵营抗性表
 * 生成时间: 2026-08-01T13:13:13.730Z
 */

const GameData = {
  // === 伤害类型 ===
  PHYSICAL: ['Impact', 'Puncture', 'Slash'],
  BASE_ELEMENTS: ['Heat', 'Cold', 'Electricity', 'Toxin'],
  COMBINED_ELEMENTS: ['Blast', 'Radiation', 'Viral', 'Corrosive', 'Magnetic', 'Gas'],
  SPECIAL_ELEMENTS: ['Void', 'Tau', 'Finisher'],

  ELEMENT_COMBOS: {
    'Cold+Heat': 'Blast', 'Heat+Toxin': 'Gas', 'Heat+Electricity': 'Radiation',
    'Electricity+Toxin': 'Corrosive', 'Electricity+Cold': 'Magnetic', 'Toxin+Cold': 'Viral'
  },

  ELEMENT_HIERARCHY: { Cold:1, Heat:2, Toxin:3, Electricity:4, Blast:5, Radiation:6, Viral:7, Corrosive:8, Magnetic:9, Gas:10 },

  COLORS: {
    Impact:'#9ca3af', Puncture:'#fbbf24', Slash:'#f87171',
    Heat:'#fb923c', Cold:'#22d3ee', Electricity:'#facc15', Toxin:'#4ade80',
    Viral:'#f472b6', Corrosive:'#a3e635', Radiation:'#f59e0b',
    Magnetic:'#60a5fa', Gas:'#86efac', Blast:'#fca5a5',
    Void:'#c084fc', Tau:'#a78bfa', Finisher:'#fbbf24'
  },

  // === 武器类别/类型 中文映射 ===
  CATEGORY_NAMES: {
    'Primary': '主武器',
    'Secondary': '副武器',
    'Melee': '近战',
    'Archgun': '空战武器',
    'Companion': '同伴'
  },

  WEAPON_TYPE_NAMES: {
    'Rifle': '步枪',
    'Shotgun': '霰弹枪',
    'Sniper': '狙击枪',
    'Bow': '弓',
    'Launcher': '发射器',
    'Pistol': '手枪',
    'Dual Pistols': '双持手枪',
    'Throwing': '投掷',
    'Blade': '刃器',
    'Staff': '长柄',
    'Fist': '拳套',
    'Gunblade': '枪刃',
    'Nikana': '太刀',
    'Whip': '鞭',
    'Glaive': '飞盘',
    'Hammer': '锤',
    'Heavy': '重型',
    'Polearm': '长柄武器',
    'Scythe': '镰刀',
    'Sword': '剑',
    'Shield': '盾',
    'Sparring': '格斗',
    'Tonfa': '拐',
    'Warfan': '战扇',
    'Axes': '斧',
    'Claws': '爪',
    'Daggers': '匕首',
    'Dual Blades': '双刃',
    'Glaives': '飞盘',
    'Heavy Blade': '重刃',
    'Heavy Scythe': '重镰',
    'Machete': '砍刀',
    'Nikanas': '太刀',
    'Polearms': '长柄武器',
    'Scythes': '镰刀',
    'Swords': '剑',
    'Tonfas': '拐',
    'Warfans': '战扇',
    'Whips': '鞭',
    'Exalted': '显赫武器',
    'Sentinel': '守护',
    'Kubrow': '库巴',
    'Kavat': '卡瓦',
    'Moa': 'MOA',
    'Hound': '猎犬',
    'Melee': '近战',
    'Archgun': '空战武器',
    'Zaw Component': 'Zaw组件',
    'Kitgun': 'Kitgun',
    'Exalted Weapon': '显赫武器',
    'Dual Pistol': '双持手枪',
    'Pistols': '手枪',
    'Secondary': '副武器'
  },

  // === 攻击类型 中文映射 ===
  ATTACK_TYPE_NAMES: {
    'Normal Attack': '普通攻击',
    'Charged Attack': '蓄力攻击',
    'Heavy Attack': '重击',
    'Slide Attack': '滑行攻击',
    'AoE': '范围伤害',
    'Radial Attack': '范围伤害',
    'Radial Self Damage': '范围自伤',
    'Direct Hit': '直接命中',
    'Explosion': '爆炸',
    'Beam': '光束',
    'Incarnon Form': '化身形态',
    'Incarnon Form Radial Attack': '化身形态范围伤害',
    'Rocket Impact': '火箭冲击',
    'Rocket Explosion': '火箭爆炸'
  },

  TYPE_NAMES: {
    Impact:'冲击', Puncture:'穿刺', Slash:'切割',
    Heat:'火焰', Cold:'冰冻', Electricity:'电击', Toxin:'毒素',
    Viral:'病毒', Corrosive:'腐蚀', Radiation:'辐射',
    Magnetic:'磁力', Gas:'毒气', Blast:'爆炸',
    Void:'虚空', Tau:'Tau', Finisher:'处决'
  },

  STATUS_DURATION: {
    Impact:1, Slash:6, Puncture:6,
    Heat:6, Toxin:6, Electricity:6, Cold:6,
    Blast:6, Gas:6, Magnetic:6, Radiation:12,
    Viral:6, Corrosive:8, Void:3, Tau:8
  },

  DOT_TICK_MULT: { Slash:0.35, Heat:0.5, Toxin:0.5, Electricity:0.5, Gas:0.5 },

  STATUS_MAX_STACKS: {
    Impact:5, Puncture:5, Cold:10, Viral:10, Corrosive:10,
    Magnetic:10, Radiation:10, Gas:10, Heat:Infinity,
    Toxin:Infinity, Electricity:Infinity, Slash:Infinity, Blast:10
  },

  // === 阵营抗性表 ===
  // 与参考站点 typeOfFaction 完全一致:
  // >1 = 弱点加成 (如 1.5 表示 +50%)
  // <1 = 抗性减成 (如 0.5 表示 -50%)
  // 未列出的伤害类型不做任何调整 (无默认0.75x)
  TYPE_OF_FACTION: {
    Grineer: { Corrosive: 1.5, Impact: 1.5 },
    'Kuva Grineer': { Corrosive: 1.5, Impact: 1.5, Heat: 0.5 },
    Corpus: { Puncture: 1.5, Magnetic: 1.5 },
    'Corpus Amalgam': { Electricity: 1.5, Blast: 0.5, Magnetic: 1.5 },
    Infested: { Slash: 1.5, Heat: 1.5 },
    'Infested Deimos': { Blast: 1.5, Gas: 1.5, Viral: 0.5 },
    Orokin: { Puncture: 1.5, Radiation: 0.5, Viral: 1.5 },
    Sentient: { Corrosive: 0.5, Cold: 1.5, Magnetic: 1.5, Radiation: 1.5 },
    Narmer: { Toxin: 1.5, Slash: 1.5, Magnetic: 0.5 },
    Zariman: { Void: 1.5 },
    Murmur: { Electricity: 1.5, Radiation: 1.5, Viral: 0.5 },
    Anarchs: { Electricity: 1.5, Radiation: 0.5, Impact: 1.5 },
    Scaldra: { Toxin: 0.5, Corrosive: 1.5, Impact: 1.5, Gas: 0.5 },
    Techrot: { Cold: 0.5, Gas: 1.5, Magnetic: 1.5 }
  },

  // === 特殊敌人伤害减免公式 ===
  SPECIAL_ENEMY_DR: {
    demolisherDR: function(a) {
      if (1e3 >= a) return 1;
      if (1e3 < a && 2500 >= a) return .8 + 200 / a;
      if (2500 < a && 5e3 >= a) return .7 + 450 / a;
      if (5e3 < a && 1e4 >= a) return .4 + 1950 / a;
      if (1e4 < a && 2e4 >= a) return .2 + 3950 / a;
      if (2e4 < a) return .1 + 5950 / a;
    },
    archonDR: function(a, b) {
      const ms = (typeof currWeapon !== 'undefined' && currWeapon && currWeapon.multishot) ? currWeapon.multishot : (b || 1);
      return 1 / (1 + a * ms / 46e4);
    },
    getArchonDR: function(a, b, c) {
      a = a * b * (c ? (0 < b ? .7 : 1) : 1) / 46e4;
      return a / (a + 1) * 46e4 / b;
    },
    eidolonDR: function(a, b) {
      const ms = (typeof currWeapon !== 'undefined' && currWeapon && currWeapon.multishot) ? currWeapon.multishot : 1;
      b = 108 / (b * ms);
      if (a <= b) return .4 * a;
      if (a > b) return .02 * a + b;
    },
    acolytesDR: function(a) {
      if (4e3 >= a) return .75;
      if (4e3 < a && 1e4 >= a) return .6 + 600 / a;
      if (1e4 < a && 3e4 >= a) return .4 + 2600 / a;
      if (3e4 < a) return 14600 / a;
    },
    amalgamDR: function(a) {
      if (1e3 >= a) return 1;
      if (1e3 < a && 6e3 >= a) return .8 + 200 / a;
      if (6e3 < a && 1e4 >= a) return .7 + 800 / a;
      if (1e4 < a && 3e4 >= a) return .5 + 2800 / a;
      if (3e4 < a) return .2 + 11800 / a;
    },
    jugulusDR: function(a) {
      if (1e3 >= a) return 1;
      if (1e3 < a && 2500 >= a) return .8 + 200 / a;
      if (2500 < a && 5e3 >= a) return .7 + 450 / a;
      if (5e3 < a && 1e4 >= a) return .4 + 1950 / a;
      if (1e4 < a && 2e4 >= a) return .2 + 3950 / a;
      if (2e4 < a) return .1 + 5950 / a;
    },
    jugulusDRProc: function(a) {
      if (1562.5 >= a) return .64;
      if (1562.5 < a && 3906 >= a) return .512 + 200 / a;
      if (3906 < a && 7812.5 >= a) return .448 + 450 / a;
      if (7812.5 < a && 15625 >= a) return .256 + 1950 / a;
      if (15625 < a && 31250 >= a) return .128 + 3950 / a;
      if (31250 < a) return .064 + 5950 / a;
    },
    lephantisDR: function(a, b) {
      if (450 >= a) return 1;
      if (450 < a) return 1 < b / .25 ? .1 : .1 + 450 / a;
    },
    orphixDR: function(a) {
      if (1e3 >= a) return 1;
      if (1e3 < a && 2500 >= a) return .7 + 300 / a;
      if (2500 < a && 5e3 >= a) return .5 + 800 / a;
      if (5e3 < a && 1e4 >= a) return .2 + 2300 / a;
      if (1e4 < a) return .02 + 4100 / a;
    },
    bursaDR: function(a) {
      if (1e3 >= a) return 1;
      if (1e3 < a && 6e3 >= a) return .8 + 200 / a;
      if (6e3 < a && 1e4 >= a) return .7 + 800 / a;
      if (1e4 < a && 3e4 >= a) return .5 + 2800 / a;
      if (3e4 < a) return .2 + 11800 / a;
    },
    suzerainDR: function(a) {
      return 1;
    },
    demolisherNecramechDR: function() {
      return .5875;
    }
  },

  // === 关键常量 ===
  HEADSHOT_MULT_INITIAL: 3,
  ARMOR_CAP: 2700,
  VIRAL_PER_STACK: 0.25,
  CORROSIVE_PER_STACK: 0.06,
  CORROSIVE_BASE_REDUCTION: 0.26,
  HEAT_ARMOR_STRIP: 0.5,

  // === 武器名列表 (662个, 含中文名) ===
  weaponList: [
    {
      "name": "Acceltra",
      "nameZh": "迅发电浆炮"
    },
    {
      "name": "Acceltra Prime",
      "nameZh": "迅发电浆炮Prime"
    },
    {
      "name": "Acrid",
      "nameZh": "阿克里德"
    },
    {
      "name": "AX-52",
      "nameZh": "AX-52"
    },
    {
      "name": "Aegrit",
      "nameZh": "骇敌榴弹"
    },
    {
      "name": "Afentis Prime",
      "nameZh": "圣英Prime"
    },
    {
      "name": "Afentis",
      "nameZh": "圣英"
    },
    {
      "name": "Afuris Prime",
      "nameZh": "盗贼双枪Prime"
    },
    {
      "name": "Afuris",
      "nameZh": "盗贼双枪"
    },
    {
      "name": "Aeolak",
      "nameZh": "风鸣"
    },
    {
      "name": "Ack & Brunt",
      "nameZh": "认知&冲击"
    },
    {
      "name": "Akbronco Prime",
      "nameZh": "野马双枪Prime"
    },
    {
      "name": "Akjagara Prime",
      "nameZh": "觉醒双枪Prime"
    },
    {
      "name": "Akarius",
      "nameZh": "阿利乌双枪"
    },
    {
      "name": "Akbolto",
      "nameZh": "螺钉双枪"
    },
    {
      "name": "Akjagara",
      "nameZh": "觉醒双枪"
    },
    {
      "name": "Akbolto Prime",
      "nameZh": "螺钉双枪Prime"
    },
    {
      "name": "Akarius Prime",
      "nameZh": "阿利乌双枪Prime"
    },
    {
      "name": "Akbronco",
      "nameZh": "野马双枪"
    },
    {
      "name": "Aklato",
      "nameZh": "拉托双枪"
    },
    {
      "name": "Aklex Prime",
      "nameZh": "雷克斯双枪Prime"
    },
    {
      "name": "Aksomati",
      "nameZh": "轻灵月神双枪"
    },
    {
      "name": "Aksomati Prime",
      "nameZh": "轻灵月神双枪Prime"
    },
    {
      "name": "Akmagnus Prime",
      "nameZh": "麦格努斯双枪Prime"
    },
    {
      "name": "Akmagnus",
      "nameZh": "麦格努斯双枪"
    },
    {
      "name": "Akvasto",
      "nameZh": "瓦斯托双枪"
    },
    {
      "name": "Akstiletto",
      "nameZh": "史提托双枪"
    },
    {
      "name": "Aklex",
      "nameZh": "雷克斯双枪"
    },
    {
      "name": "Akstiletto Prime",
      "nameZh": "史提托双枪Prime"
    },
    {
      "name": "Akvasto Prime",
      "nameZh": "瓦斯托双枪Prime"
    },
    {
      "name": "Amanata",
      "nameZh": "天薙刀"
    },
    {
      "name": "Ambassador",
      "nameZh": "使节"
    },
    {
      "name": "Alternox Prime",
      "nameZh": "电幻步枪Prime"
    },
    {
      "name": "Akzani",
      "nameZh": "荒谬双枪"
    },
    {
      "name": "Amprex",
      "nameZh": "安培克斯"
    },
    {
      "name": "Amphis",
      "nameZh": "双头蛇"
    },
    {
      "name": "Angstrum",
      "nameZh": "安格斯壮"
    },
    {
      "name": "Alternox",
      "nameZh": "电幻步枪"
    },
    {
      "name": "Anku",
      "nameZh": "夺魂死神"
    },
    {
      "name": "Ankyros",
      "nameZh": "甲龙双拳"
    },
    {
      "name": "Arbucep (Atmo-mode)",
      "nameZh": "蕈菇 (大气)"
    },
    {
      "name": "Arca Scisco",
      "nameZh": "弧电探知者"
    },
    {
      "name": "Arbucep (Arch-mode)",
      "nameZh": "蕈菇 (Archwing)"
    },
    {
      "name": "Ankyros Prime",
      "nameZh": "甲龙双拳Prime"
    },
    {
      "name": "Arca Titron",
      "nameZh": "弧电振子锤"
    },
    {
      "name": "Artemis Bow (Ivara)",
      "nameZh": "月神狩弓 (Ivara)"
    },
    {
      "name": "Argo & Vel",
      "nameZh": "星舟 & 帆"
    },
    {
      "name": "Arca Plasmor",
      "nameZh": "弧电离子枪"
    },
    {
      "name": "Argonak",
      "nameZh": "氩格纳克"
    },
    {
      "name": "Arquebex",
      "nameZh": "钩铳"
    },
    {
      "name": "Arum Spinosa",
      "nameZh": "疆南星刺"
    },
    {
      "name": "Athodai",
      "nameZh": "阿索代"
    },
    {
      "name": "Astilla",
      "nameZh": "碎裂者"
    },
    {
      "name": "Astilla Prime",
      "nameZh": "碎裂者Prime"
    },
    {
      "name": "Athodai Prime",
      "nameZh": "阿索代Prime"
    },
    {
      "name": "Azima",
      "nameZh": "方位角"
    },
    {
      "name": "Attica",
      "nameZh": "阿提卡"
    },
    {
      "name": "Atomos",
      "nameZh": "原子矿融炮"
    },
    {
      "name": "Azothane",
      "nameZh": "溶灵尊"
    },
    {
      "name": "Atterax",
      "nameZh": "阿特拉克斯"
    },
    {
      "name": "Balla (Dagger)",
      "nameZh": "宝拉 (匕首)"
    },
    {
      "name": "Balla (Staff)",
      "nameZh": "宝拉 (长棍)"
    },
    {
      "name": "Ballistica Prime",
      "nameZh": "布里斯提卡Prime"
    },
    {
      "name": "Ballistica",
      "nameZh": "布里斯提卡"
    },
    {
      "name": "Baza",
      "nameZh": "苍鹰"
    },
    {
      "name": "Battacor",
      "nameZh": "武使之力"
    },
    {
      "name": "Basmu",
      "nameZh": "巴什穆"
    },
    {
      "name": "Balefire Charger (Hildryn)",
      "nameZh": "野火充能 (Hildryn)"
    },
    {
      "name": "Baza Prime",
      "nameZh": "苍鹰Prime"
    },
    {
      "name": "Bo",
      "nameZh": "玻之武杖"
    },
    {
      "name": "Bo Prime",
      "nameZh": "玻之武杖Prime"
    },
    {
      "name": "Boar",
      "nameZh": "野猪"
    },
    {
      "name": "Boltor Prime",
      "nameZh": "螺钉步枪Prime"
    },
    {
      "name": "Brakk",
      "nameZh": "布拉克"
    },
    {
      "name": "Boltor",
      "nameZh": "螺钉步枪"
    },
    {
      "name": "Boar Prime",
      "nameZh": "野猪Prime"
    },
    {
      "name": "Boltace",
      "nameZh": "螺钉拐刃"
    },
    {
      "name": "Bolto",
      "nameZh": "螺钉手枪"
    },
    {
      "name": "Braton Prime",
      "nameZh": "布莱顿Prime"
    },
    {
      "name": "Braton",
      "nameZh": "布莱顿"
    },
    {
      "name": "Broken War",
      "nameZh": "破碎的战争之剑"
    },
    {
      "name": "Bronco",
      "nameZh": "野马"
    },
    {
      "name": "Cadus",
      "nameZh": "卡德斯"
    },
    {
      "name": "Burston Prime",
      "nameZh": "伯斯顿Prime"
    },
    {
      "name": "Buzlok",
      "nameZh": "巴兹火枪"
    },
    {
      "name": "Burston",
      "nameZh": "伯斯顿"
    },
    {
      "name": "Broken Scepter",
      "nameZh": "破损珽杖"
    },
    {
      "name": "Bubonico",
      "nameZh": "横痃重炮"
    },
    {
      "name": "Bronco Prime",
      "nameZh": "野马Prime"
    },
    {
      "name": "Braton Vandal",
      "nameZh": "布莱顿破坏者"
    },
    {
      "name": "Carmine Penta",
      "nameZh": "嫣红潘塔"
    },
    {
      "name": "Cantare",
      "nameZh": "歌颂"
    },
    {
      "name": "Castanas",
      "nameZh": "雷爆信镖"
    },
    {
      "name": "Catchmoon (Primary)",
      "nameZh": "捕月 (主要)"
    },
    {
      "name": "Cassowar",
      "nameZh": "鹤鸵长戟"
    },
    {
      "name": "Catabolyst",
      "nameZh": "异化者"
    },
    {
      "name": "Caustacyst",
      "nameZh": "灼蚀变体镰"
    },
    {
      "name": "Catchmoon (Secondary)",
      "nameZh": "捕月 (次要)"
    },
    {
      "name": "Cedo",
      "nameZh": "塞多"
    },
    {
      "name": "Cedo Prime",
      "nameZh": "塞多Prime"
    },
    {
      "name": "Ceramic Dagger",
      "nameZh": "陶瓷匕首"
    },
    {
      "name": "Cestra",
      "nameZh": "锡斯特"
    },
    {
      "name": "Cinta",
      "nameZh": "遂心"
    },
    {
      "name": "Cobra & Crane Prime",
      "nameZh": "眼镜蛇&鹤Prime"
    },
    {
      "name": "Cernos",
      "nameZh": "西诺斯"
    },
    {
      "name": "Cernos Prime",
      "nameZh": "西诺斯Prime"
    },
    {
      "name": "Ceti Lacera",
      "nameZh": "天仓悲痛之刃"
    },
    {
      "name": "Cobra & Crane",
      "nameZh": "眼镜蛇&鹤"
    },
    {
      "name": "Cerata",
      "nameZh": "裸鳃刃"
    },
    {
      "name": "Coda Bassocyst",
      "nameZh": "终幕·低音爆囊"
    },
    {
      "name": "Coda Bubonico",
      "nameZh": "终幕·横痃重炮"
    },
    {
      "name": "Coda Hema",
      "nameZh": "终幕·血肢"
    },
    {
      "name": "Coda Catabolyst",
      "nameZh": "终幕·异化者"
    },
    {
      "name": "Coda Caustacyst",
      "nameZh": "终幕·灼蚀变体镰"
    },
    {
      "name": "Coda Pox",
      "nameZh": "终幕·脓痘"
    },
    {
      "name": "Coda Motovore",
      "nameZh": "终幕·噬轮"
    },
    {
      "name": "Coda Synapse",
      "nameZh": "终幕·突触生化枪"
    },
    {
      "name": "Coda Hirudo",
      "nameZh": "终幕·蚂蝗"
    },
    {
      "name": "Coda Mire",
      "nameZh": "终幕·米尔"
    },
    {
      "name": "Coda Pathocyst",
      "nameZh": "终幕·病囊飞刃"
    },
    {
      "name": "Convectrix",
      "nameZh": "导热聚焦枪"
    },
    {
      "name": "Coda Sporothrix",
      "nameZh": "终幕·孢丝感染枪"
    },
    {
      "name": "Coda Tysis",
      "nameZh": "终幕·啐沫者"
    },
    {
      "name": "Corinth",
      "nameZh": "科林斯"
    },
    {
      "name": "Cortege (Arch-mode)",
      "nameZh": "送葬者 (Archwing)"
    },
    {
      "name": "Corinth Prime",
      "nameZh": "科林斯Prime"
    },
    {
      "name": "Corvas (Arch-mode)",
      "nameZh": "黑鸦 (Archwing)"
    },
    {
      "name": "Corvas Prime (Arch-mode)",
      "nameZh": "黑鸦 Prime (Archwing)"
    },
    {
      "name": "Cortege (Atmo-mode)",
      "nameZh": "送葬者 (大气)"
    },
    {
      "name": "Corvas (Atmo-mode)",
      "nameZh": "黑鸦 (大气)"
    },
    {
      "name": "Corvas Prime (Atmo-mode)",
      "nameZh": "黑鸦 Prime (大气)"
    },
    {
      "name": "Cronus",
      "nameZh": "克洛诺斯"
    },
    {
      "name": "Cyath (Machete)",
      "nameZh": "西亚什 (大砍刀)"
    },
    {
      "name": "Corufell",
      "nameZh": "闪劫"
    },
    {
      "name": "Cyanex",
      "nameZh": "氰毒"
    },
    {
      "name": "Daikyu",
      "nameZh": "大久和弓"
    },
    {
      "name": "Cyngas (Atmo-mode)",
      "nameZh": "合成燃气炮 (大气)"
    },
    {
      "name": "Cycron",
      "nameZh": "循环离子枪"
    },
    {
      "name": "Cyath (Polearm)",
      "nameZh": "西亚什 (长柄武器)"
    },
    {
      "name": "Cyngas (Arch-mode)",
      "nameZh": "合成燃气炮 (Archwing)"
    },
    {
      "name": "Dark Split-Sword (Dual Swords)",
      "nameZh": "暗黑分合剑（双剑）"
    },
    {
      "name": "Dark Sword",
      "nameZh": "暗黑长剑"
    },
    {
      "name": "Dakra Prime",
      "nameZh": "达克拉Prime"
    },
    {
      "name": "Dera",
      "nameZh": "德拉"
    },
    {
      "name": "Dark Split-Sword (Heavy Blade)",
      "nameZh": "暗黑分合剑（巨刃）"
    },
    {
      "name": "Dehtat (Polearm)",
      "nameZh": "德塔特 (长柄武器)"
    },
    {
      "name": "Daikyu Prime",
      "nameZh": "大久和弓 Prime"
    },
    {
      "name": "Dehtat (Rapier)",
      "nameZh": "德塔特 (细剑)"
    },
    {
      "name": "Dark Dagger",
      "nameZh": "暗黑匕首"
    },
    {
      "name": "Dera Vandal",
      "nameZh": "德拉破坏者"
    },
    {
      "name": "Detron",
      "nameZh": "德特昂"
    },
    {
      "name": "Desert Wind (Baruuk)",
      "nameZh": "沙漠之风 (Baruuk)"
    },
    {
      "name": "Despair",
      "nameZh": "绝望"
    },
    {
      "name": "Dex Dakra",
      "nameZh": "Dex达克拉双剑"
    },
    {
      "name": "Dex Nikana",
      "nameZh": "Dex侍刃"
    },
    {
      "name": "Destreza Prime",
      "nameZh": "技巧之剑Prime"
    },
    {
      "name": "Destreza",
      "nameZh": "技巧之剑"
    },
    {
      "name": "Dex Furis",
      "nameZh": "Dex盗贼双枪"
    },
    {
      "name": "Dex Pixia (Titania)",
      "nameZh": "Dex妖精 (Titania)"
    },
    {
      "name": "Dex Sybaris",
      "nameZh": "Dex席芭莉丝"
    },
    {
      "name": "Diwata Prime (Titania)",
      "nameZh": "仙女 Prime (Titania)"
    },
    {
      "name": "Dread",
      "nameZh": "恐惧"
    },
    {
      "name": "Dorrclave",
      "nameZh": "怒斩"
    },
    {
      "name": "Dokrahm (Scythe)",
      "nameZh": "多克拉姆 (镰刀)"
    },
    {
      "name": "Drakgoon",
      "nameZh": "龙骑兵"
    },
    {
      "name": "Dual Cestra",
      "nameZh": "锡斯特双枪"
    },
    {
      "name": "Dragon Nikana",
      "nameZh": "龙之侍刃"
    },
    {
      "name": "Dokrahm (Heavy Blade)",
      "nameZh": "多克拉姆 (巨刃)"
    },
    {
      "name": "Dual Cleavers",
      "nameZh": "斩肉双刀"
    },
    {
      "name": "Dual Coda Torxica",
      "nameZh": "终幕·孢蚀双枪"
    },
    {
      "name": "Dual Decurion (Arch-mode)",
      "nameZh": "德库瑞昂双枪（空战模式）"
    },
    {
      "name": "Dual Decurion (Atmo-mode)",
      "nameZh": "什长双枪 (大气)"
    },
    {
      "name": "Dual Keres",
      "nameZh": "凯瑞斯双刀"
    },
    {
      "name": "Dual Ether",
      "nameZh": "苍穹双剑"
    },
    {
      "name": "Dual Heat Swords",
      "nameZh": "烈焰双剑"
    },
    {
      "name": "Dual Kamas Prime",
      "nameZh": "双短柄战镰Prime"
    },
    {
      "name": "Dual Ichor",
      "nameZh": "恶脓双斧"
    },
    {
      "name": "Dual Kamas",
      "nameZh": "双短柄战镰"
    },
    {
      "name": "Dual Keres Prime",
      "nameZh": "凯瑞斯双刀Prime"
    },
    {
      "name": "Dual Raza",
      "nameZh": "锋月双斧"
    },
    {
      "name": "Dual Zoren Prime",
      "nameZh": "佐伦双斧Prime"
    },
    {
      "name": "Embolist",
      "nameZh": "安柏勒斯"
    },
    {
      "name": "Ekhein",
      "nameZh": "映声战锤"
    },
    {
      "name": "EFV-5 Jupiter",
      "nameZh": "艾弗旺-5 木星"
    },
    {
      "name": "Dual Toxocyst",
      "nameZh": "毒囊双枪"
    },
    {
      "name": "Dual Viciss",
      "nameZh": "双子恶行"
    },
    {
      "name": "Dual Skana",
      "nameZh": "空刃双刀"
    },
    {
      "name": "Edun",
      "nameZh": "雷石祭"
    },
    {
      "name": "EFV-8 Mars",
      "nameZh": "艾弗旺-8 火星"
    },
    {
      "name": "Dual Zoren",
      "nameZh": "佐伦双斧"
    },
    {
      "name": "Endura",
      "nameZh": "三叶坚韧"
    },
    {
      "name": "Ether Reaper",
      "nameZh": "苍穹死神"
    },
    {
      "name": "Ether Sword",
      "nameZh": "苍穹之剑"
    },
    {
      "name": "Epitaph Prime",
      "nameZh": "葬铭Prime"
    },
    {
      "name": "Euphona Prime",
      "nameZh": "悦音Prime"
    },
    {
      "name": "Ether Daggers",
      "nameZh": "苍穹匕首"
    },
    {
      "name": "Evensong",
      "nameZh": "晚祷"
    },
    {
      "name": "Enkaus",
      "nameZh": "绘墨"
    },
    {
      "name": "Exalted Blade (Excalibur)",
      "nameZh": "显赫刀剑 (Excalibur)"
    },
    {
      "name": "Epitaph",
      "nameZh": "葬铭"
    },
    {
      "name": "Falcor",
      "nameZh": "猎鹰轮"
    },
    {
      "name": "Fluctus (Arch-mode)",
      "nameZh": "巨浪 (Archwing)"
    },
    {
      "name": "Fluctus (Atmo-mode)",
      "nameZh": "巨浪 (大气)"
    },
    {
      "name": "Exergis",
      "nameZh": "晶能放射器"
    },
    {
      "name": "Fang Prime",
      "nameZh": "狼牙Prime"
    },
    {
      "name": "Fang",
      "nameZh": "狼牙"
    },
    {
      "name": "Ferrox",
      "nameZh": "铁晶磁轨炮"
    },
    {
      "name": "Felarx",
      "nameZh": "逐枭"
    },
    {
      "name": "Fragor",
      "nameZh": "重击巨锤"
    },
    {
      "name": "Flux Rifle",
      "nameZh": "通量步枪"
    },
    {
      "name": "Fragor Prime",
      "nameZh": "重击巨锤Prime"
    },
    {
      "name": "Furis",
      "nameZh": "盗贼"
    },
    {
      "name": "Fusilai",
      "nameZh": "齐射玻刃"
    },
    {
      "name": "Galariak Prime",
      "nameZh": "加拉亚 Prime"
    },
    {
      "name": "Fulmin",
      "nameZh": "雷霆"
    },
    {
      "name": "Furax",
      "nameZh": "弗拉克斯"
    },
    {
      "name": "Galatine",
      "nameZh": "迦伦提恩"
    },
    {
      "name": "Fulmin Prime",
      "nameZh": "雷霆 Prime"
    },
    {
      "name": "Galatine Prime",
      "nameZh": "迦伦提恩Prime"
    },
    {
      "name": "Furax Wraith",
      "nameZh": "弗拉克斯亡魂"
    },
    {
      "name": "Gazal Machete",
      "nameZh": "加扎勒反曲刀"
    },
    {
      "name": "Garuda Talons",
      "nameZh": "Garuda的利爪"
    },
    {
      "name": "Gaze (Secondary)",
      "nameZh": "凝目 (次要)"
    },
    {
      "name": "Garuda Prime Talons",
      "nameZh": "Garuda的利爪Prime"
    },
    {
      "name": "Ghoulsaw",
      "nameZh": "尸鬼电锯"
    },
    {
      "name": "Galvacord",
      "nameZh": "电流刺索"
    },
    {
      "name": "Gaze (Primary)",
      "nameZh": "凝目 (主要)"
    },
    {
      "name": "Gammacor",
      "nameZh": "咖玛腕甲枪"
    },
    {
      "name": "Glaive Prime",
      "nameZh": "战刃Prime"
    },
    {
      "name": "Glaive",
      "nameZh": "战刃"
    },
    {
      "name": "Glory (Jade)",
      "nameZh": "荣耀（Jade）"
    },
    {
      "name": "Glaxion",
      "nameZh": "冷冻光束步枪"
    },
    {
      "name": "Glaxion Vandal",
      "nameZh": "冷冻光束步枪破坏者"
    },
    {
      "name": "Gorgon Wraith",
      "nameZh": "蛇发女妖亡魂"
    },
    {
      "name": "Gotva Prime",
      "nameZh": "骨葬 Prime"
    },
    {
      "name": "Gorgon",
      "nameZh": "蛇发女妖"
    },
    {
      "name": "Grattler (Atmo-mode)",
      "nameZh": "葛拉特勒 (大气)"
    },
    {
      "name": "Grattler (Arch-mode)",
      "nameZh": "葛拉特勒 (Archwing)"
    },
    {
      "name": "Grakata",
      "nameZh": "葛拉卡达"
    },
    {
      "name": "Gram",
      "nameZh": "格拉姆"
    },
    {
      "name": "Guandao",
      "nameZh": "关刀"
    },
    {
      "name": "Haalvu",
      "nameZh": "哈尔武"
    },
    {
      "name": "Guandao Prime",
      "nameZh": "关刀Prime"
    },
    {
      "name": "Grinlok",
      "nameZh": "葛恩火枪"
    },
    {
      "name": "Gram Prime",
      "nameZh": "格拉姆Prime"
    },
    {
      "name": "Gunsen Prime",
      "nameZh": "军扇 Prime"
    },
    {
      "name": "Halikar",
      "nameZh": "哈利卡"
    },
    {
      "name": "Gunsen",
      "nameZh": "军扇"
    },
    {
      "name": "Halikar Wraith",
      "nameZh": "哈利卡亡魂"
    },
    {
      "name": "Grimoire",
      "nameZh": "魔典"
    },
    {
      "name": "Hate",
      "nameZh": "憎恨"
    },
    {
      "name": "Harmony",
      "nameZh": "和谐"
    },
    {
      "name": "Harpak",
      "nameZh": "哈帕克"
    },
    {
      "name": "Hema",
      "nameZh": "血肢"
    },
    {
      "name": "Heat Sword",
      "nameZh": "烈焰长剑"
    },
    {
      "name": "Hek",
      "nameZh": "海克"
    },
    {
      "name": "Heat Dagger",
      "nameZh": "烈焰匕首"
    },
    {
      "name": "Heliocor",
      "nameZh": "赫利俄光锤"
    },
    {
      "name": "Hespar",
      "nameZh": "暮斩"
    },
    {
      "name": "Higasa",
      "nameZh": "晴日伞"
    },
    {
      "name": "Hikou Prime",
      "nameZh": "飞扬Prime"
    },
    {
      "name": "Hind",
      "nameZh": "雌鹿"
    },
    {
      "name": "Ignis",
      "nameZh": "伊格尼斯"
    },
    {
      "name": "Hikou",
      "nameZh": "飞扬"
    },
    {
      "name": "Hystrix Prime",
      "nameZh": "豪猪Prime"
    },
    {
      "name": "Ignis Wraith",
      "nameZh": "伊格尼斯亡魂"
    },
    {
      "name": "Hystrix",
      "nameZh": "豪猪"
    },
    {
      "name": "Imperator (Arch-mode)",
      "nameZh": "凯旋将军 (Archwing)"
    },
    {
      "name": "Imperator (Atmo-mode)",
      "nameZh": "凯旋将军 (大气)"
    },
    {
      "name": "Hirudo",
      "nameZh": "蚂蟥"
    },
    {
      "name": "Imperator Vandal (Atmo-mode)",
      "nameZh": "凯旋将军·破坏者 (大气)"
    },
    {
      "name": "Imperator Vandal (Arch-mode)",
      "nameZh": "凯旋将军·破坏者 (Archwing)"
    },
    {
      "name": "Iron Staff (Wukong)",
      "nameZh": "定海神针 (Wukong)"
    },
    {
      "name": "Jat Kittag",
      "nameZh": "喷射战锤"
    },
    {
      "name": "Innodem",
      "nameZh": "清刚"
    },
    {
      "name": "Jaw Sword",
      "nameZh": "蛇颚刀"
    },
    {
      "name": "Jat Kusar",
      "nameZh": "喷射锁镰"
    },
    {
      "name": "Karak",
      "nameZh": "卡拉克"
    },
    {
      "name": "Javlok",
      "nameZh": "燃焰标枪"
    },
    {
      "name": "Kama",
      "nameZh": "短柄战镰"
    },
    {
      "name": "Kesheg",
      "nameZh": "怯薛"
    },
    {
      "name": "Kestrel",
      "nameZh": "红隼"
    },
    {
      "name": "Karyst",
      "nameZh": "凯洛斯特"
    },
    {
      "name": "Karyst Prime",
      "nameZh": "凯洛斯特Prime"
    },
    {
      "name": "Keratinos",
      "nameZh": "卡提努之爪"
    },
    {
      "name": "Knell",
      "nameZh": "丧钟"
    },
    {
      "name": "Karak Wraith",
      "nameZh": "卡拉克亡魂"
    },
    {
      "name": "Whipclaw (Khora)",
      "nameZh": "长鞭利爪 (Khora)"
    },
    {
      "name": "Kestrel Prime",
      "nameZh": "红隼Prime"
    },
    {
      "name": "Knell Prime",
      "nameZh": "丧钟Prime"
    },
    {
      "name": "Kogake",
      "nameZh": "科加基"
    },
    {
      "name": "Kogake Prime",
      "nameZh": "科加基Prime"
    },
    {
      "name": "Kompressa Prime",
      "nameZh": "卡帕压力枪 Prime"
    },
    {
      "name": "Kohm",
      "nameZh": "寇恩热能枪"
    },
    {
      "name": "Korrudo",
      "nameZh": "库鲁多"
    },
    {
      "name": "Kohmak",
      "nameZh": "寇恩霰机枪"
    },
    {
      "name": "Kompressa",
      "nameZh": "卡帕压力枪"
    },
    {
      "name": "Korumm",
      "nameZh": "雷霆暴君"
    },
    {
      "name": "Komorex",
      "nameZh": "猛毒"
    },
    {
      "name": "Kraken",
      "nameZh": "北海巨妖"
    },
    {
      "name": "Kronen Prime",
      "nameZh": "皇家拐刃Prime"
    },
    {
      "name": "Krohkur",
      "nameZh": "克鲁古尔"
    },
    {
      "name": "Kronen",
      "nameZh": "皇家拐刃"
    },
    {
      "name": "Kronsh (Machete)",
      "nameZh": "客隆什 (大砍刀)"
    },
    {
      "name": "Kulstar",
      "nameZh": "杀星"
    },
    {
      "name": "Kuva Bramma",
      "nameZh": "赤毒布拉玛"
    },
    {
      "name": "Kronsh (Polearm)",
      "nameZh": "客隆什 (长柄武器)"
    },
    {
      "name": "Kuva Brakk",
      "nameZh": "赤毒布拉克"
    },
    {
      "name": "Kunai",
      "nameZh": "苦无"
    },
    {
      "name": "Kreska",
      "nameZh": "直镐"
    },
    {
      "name": "Kuva Chakkhurr",
      "nameZh": "赤毒邪眼"
    },
    {
      "name": "Kuva Drakgoon",
      "nameZh": "赤毒龙骑兵"
    },
    {
      "name": "Kuva Hek",
      "nameZh": "赤毒海克"
    },
    {
      "name": "Kuva Ayanga (Arch-mode)",
      "nameZh": "赤毒·怒雷 (Archwing)"
    },
    {
      "name": "Kuva Hind",
      "nameZh": "赤毒雌鹿"
    },
    {
      "name": "Kuva Karak",
      "nameZh": "赤毒卡拉克"
    },
    {
      "name": "Kuva Grattler (Atmo-mode)",
      "nameZh": "赤毒·葛拉特勒 (大气)"
    },
    {
      "name": "Kuva Ghoulsaw",
      "nameZh": "赤毒·尸鬼电锯"
    },
    {
      "name": "Kuva Grattler (Arch-mode)",
      "nameZh": "赤毒·葛拉特勒 (Archwing)"
    },
    {
      "name": "Kuva Ayanga (Atmo-mode)",
      "nameZh": "赤毒·怒雷 (大气)"
    },
    {
      "name": "Kuva Seer",
      "nameZh": "赤毒预言者"
    },
    {
      "name": "Kuva Kraken",
      "nameZh": "赤毒北海巨妖"
    },
    {
      "name": "Kuva Kohm",
      "nameZh": "赤毒寇恩热能枪"
    },
    {
      "name": "Kuva Quartakk",
      "nameZh": "赤毒夸塔克"
    },
    {
      "name": "Kuva Shildeg",
      "nameZh": "赤毒希尔德"
    },
    {
      "name": "Kuva Nukor",
      "nameZh": "赤毒努寇微波枪"
    },
    {
      "name": "Kuva Sobek",
      "nameZh": "赤毒·鳄神"
    },
    {
      "name": "Kuva Ogris",
      "nameZh": "赤毒食人女魔"
    },
    {
      "name": "Kuva Tonkor",
      "nameZh": "赤毒征服榴炮"
    },
    {
      "name": "Kuva Twin Stubbas",
      "nameZh": "赤毒双子史度巴"
    },
    {
      "name": "Laetum",
      "nameZh": "奏凯"
    },
    {
      "name": "Landslide Fists (Atlas)",
      "nameZh": "土石坍方 (Atlas)"
    },
    {
      "name": "Larkspur (Arch-mode)",
      "nameZh": "翠雀 (Archwing)"
    },
    {
      "name": "Kuva Zarr",
      "nameZh": "赤毒沙皇"
    },
    {
      "name": "Larkspur Prime (Arch-mode)",
      "nameZh": "翠雀 Prime (Archwing)"
    },
    {
      "name": "Lato",
      "nameZh": "拉托"
    },
    {
      "name": "Lacera",
      "nameZh": "悲痛之刃"
    },
    {
      "name": "Lanka",
      "nameZh": "兰卡"
    },
    {
      "name": "Larkspur Prime (Atmo-mode)",
      "nameZh": "翠雀 Prime (大气)"
    },
    {
      "name": "Larkspur (Atmo-mode)",
      "nameZh": "翠雀 (大气)"
    },
    {
      "name": "Latron Prime",
      "nameZh": "拉特昂Prime"
    },
    {
      "name": "Lesion",
      "nameZh": "病变"
    },
    {
      "name": "Lato Vandal",
      "nameZh": "拉托破坏者"
    },
    {
      "name": "Latron Wraith",
      "nameZh": "拉特昂亡魂"
    },
    {
      "name": "Lato Prime",
      "nameZh": "拉托Prime"
    },
    {
      "name": "Lecta",
      "nameZh": "勒克塔"
    },
    {
      "name": "Lex Prime",
      "nameZh": "雷克斯Prime"
    },
    {
      "name": "Latron",
      "nameZh": "拉特昂"
    },
    {
      "name": "Lex",
      "nameZh": "雷克斯"
    },
    {
      "name": "Machete Wraith",
      "nameZh": "马谢特砍刀亡魂"
    },
    {
      "name": "Lenz",
      "nameZh": "楞次弓"
    },
    {
      "name": "Magnus",
      "nameZh": "麦格努斯"
    },
    {
      "name": "Lizzie (Temple)",
      "nameZh": "丽兹（Temple）"
    },
    {
      "name": "Magistar",
      "nameZh": "执法者"
    },
    {
      "name": "Machete",
      "nameZh": "马谢特砍刀"
    },
    {
      "name": "Mandonel (Arch-mode)",
      "nameZh": "辐光弩炮 (Archwing)"
    },
    {
      "name": "Magnus Prime",
      "nameZh": "麦格努斯Prime"
    },
    {
      "name": "Mara Detron",
      "nameZh": "苦痛德特昂"
    },
    {
      "name": "Mandonel (Atmo-mode)",
      "nameZh": "辐光弩炮 (大气)"
    },
    {
      "name": "Marelok",
      "nameZh": "玛瑞火枪"
    },
    {
      "name": "Masseter",
      "nameZh": "咀嚼金棒"
    },
    {
      "name": "Mios",
      "nameZh": "牡狮神"
    },
    {
      "name": "Miter",
      "nameZh": "米特尔"
    },
    {
      "name": "Mewan (Polearm)",
      "nameZh": "密丸 (长柄武器)"
    },
    {
      "name": "Mk1-Furax",
      "nameZh": "MK1-弗拉克斯"
    },
    {
      "name": "Mk1-Bo",
      "nameZh": "MK1-玻之武杖"
    },
    {
      "name": "Mewan (Sword)",
      "nameZh": "密丸 (剑)"
    },
    {
      "name": "Masseter Prime",
      "nameZh": "咀嚼金棒 Prime"
    },
    {
      "name": "Mire",
      "nameZh": "米尔"
    },
    {
      "name": "Mk1-Braton",
      "nameZh": "MK1-布莱顿"
    },
    {
      "name": "Mk1-Furis",
      "nameZh": "MK1-盗贼"
    },
    {
      "name": "Mk1-Kunai",
      "nameZh": "MK1-苦无"
    },
    {
      "name": "Mk1-Paris",
      "nameZh": "MK1-帕里斯"
    },
    {
      "name": "Morgha (Arch-mode)",
      "nameZh": "置灵者 (Archwing)"
    },
    {
      "name": "Mk1-Strun",
      "nameZh": "MK1-斯特朗"
    },
    {
      "name": "Mausolon (Arch-mode)",
      "nameZh": "惩戒者 (Archwing)"
    },
    {
      "name": "Morgha (Atmo-mode)",
      "nameZh": "置灵者 (大气)"
    },
    {
      "name": "Mausolon (Atmo-mode)",
      "nameZh": "惩戒者 (大气)"
    },
    {
      "name": "Mutalist Quanta",
      "nameZh": "异融量子枪"
    },
    {
      "name": "Mutalist Cernos",
      "nameZh": "异融西诺斯"
    },
    {
      "name": "Nagantaka Prime",
      "nameZh": "噬蛇弩Prime"
    },
    {
      "name": "Nagantaka",
      "nameZh": "噬蛇弩"
    },
    {
      "name": "Nepheri",
      "nameZh": "赤炎流星"
    },
    {
      "name": "Nami Skyla Prime",
      "nameZh": "海波斯库拉对剑Prime"
    },
    {
      "name": "Nikana Prime",
      "nameZh": "侍刃Prime"
    },
    {
      "name": "Nami Skyla",
      "nameZh": "海波斯库拉对剑"
    },
    {
      "name": "Nataruk",
      "nameZh": "太始弓"
    },
    {
      "name": "Nikana",
      "nameZh": "侍刃"
    },
    {
      "name": "Nami Solo",
      "nameZh": "海波单剑"
    },
    {
      "name": "Neutralizer  (Cyte-09)",
      "nameZh": "中和者（Cyte-09）"
    },
    {
      "name": "Ninkondi Prime",
      "nameZh": "降灵追猎者Prime"
    },
    {
      "name": "Noctua (Dante)",
      "nameZh": "夜枭 (Dante)"
    },
    {
      "name": "Ninkondi",
      "nameZh": "降灵追猎者"
    },
    {
      "name": "Nukor",
      "nameZh": "努寇微波枪"
    },
    {
      "name": "Ohma",
      "nameZh": "欧玛"
    },
    {
      "name": "Obex",
      "nameZh": "奥比克斯"
    },
    {
      "name": "Ocucor",
      "nameZh": "视使之触"
    },
    {
      "name": "Ogris",
      "nameZh": "食人女魔"
    },
    {
      "name": "Okina",
      "nameZh": "翁"
    },
    {
      "name": "Okina Prime",
      "nameZh": "翁Prime"
    },
    {
      "name": "Orthos Prime",
      "nameZh": "欧特鲁斯Prime"
    },
    {
      "name": "Onos",
      "nameZh": "赘骨"
    },
    {
      "name": "Orthos",
      "nameZh": "欧特鲁斯"
    },
    {
      "name": "Orvius",
      "nameZh": "灵枢"
    },
    {
      "name": "Opticor Vandal",
      "nameZh": "奥堤克光子枪破坏者"
    },
    {
      "name": "Ooltha (Staff)",
      "nameZh": "乌尔萨 (长棍)"
    },
    {
      "name": "Ooltha (Sword)",
      "nameZh": "乌尔萨 (剑)"
    },
    {
      "name": "Pandero",
      "nameZh": "手鼓"
    },
    {
      "name": "Opticor",
      "nameZh": "奥堤克光子枪"
    },
    {
      "name": "Pandero Prime",
      "nameZh": "手鼓Prime"
    },
    {
      "name": "Pangolin Prime",
      "nameZh": "鲮鲤剑Prime"
    },
    {
      "name": "Pangolin Sword",
      "nameZh": "鲮鲤剑"
    },
    {
      "name": "Panthera",
      "nameZh": "猎豹"
    },
    {
      "name": "Panthera Prime",
      "nameZh": "猎豹Prime"
    },
    {
      "name": "Paracesis",
      "nameZh": "心智之殁"
    },
    {
      "name": "Paris Prime",
      "nameZh": "帕里斯Prime"
    },
    {
      "name": "Paracyst",
      "nameZh": "附肢寄生者"
    },
    {
      "name": "Pennant",
      "nameZh": "尖幡"
    },
    {
      "name": "Paris",
      "nameZh": "帕里斯"
    },
    {
      "name": "Pathocyst",
      "nameZh": "病囊飞刃"
    },
    {
      "name": "Perigale",
      "nameZh": "月面狂风"
    },
    {
      "name": "Phantasma",
      "nameZh": "幻离子"
    },
    {
      "name": "Phaedra (Arch-mode)",
      "nameZh": "菲德菈 (Archwing)"
    },
    {
      "name": "Perigale Prime",
      "nameZh": "月面狂风 Prime"
    },
    {
      "name": "Phage",
      "nameZh": "噬菌者"
    },
    {
      "name": "Plague Keewar (Scythe)",
      "nameZh": "瘟疫奇沃	(镰刀)"
    },
    {
      "name": "Penta",
      "nameZh": "潘塔"
    },
    {
      "name": "Phantasma Prime",
      "nameZh": "幻离子Prime"
    },
    {
      "name": "Phenmor",
      "nameZh": "凤殁"
    },
    {
      "name": "Phaedra (Atmo-mode)",
      "nameZh": "菲德菈 (大气)"
    },
    {
      "name": "Plague Keewar (Staff)",
      "nameZh": "瘟疫奇沃	(长棍)"
    },
    {
      "name": "Praedos",
      "nameZh": "双雄"
    },
    {
      "name": "Prisma Angstrum",
      "nameZh": "棱晶安格斯壮"
    },
    {
      "name": "Plague Kripath (Rapier)",
      "nameZh": "瘟疫克里帕丝 (细剑)"
    },
    {
      "name": "Pride",
      "nameZh": "骄傲"
    },
    {
      "name": "Plague Kripath (Polearm)",
      "nameZh": "瘟疫克里帕丝 (长柄武器)"
    },
    {
      "name": "Prisma Dual Cleavers",
      "nameZh": "棱晶斩肉双刀"
    },
    {
      "name": "Plasma Sword",
      "nameZh": "等离子长剑"
    },
    {
      "name": "Pox",
      "nameZh": "脓痘"
    },
    {
      "name": "Plinx",
      "nameZh": "漫射者"
    },
    {
      "name": "Prisma Dual Decurions (Arch-mode)",
      "nameZh": "棱晶·什长双枪 (Archwing)"
    },
    {
      "name": "Prisma Grinlok",
      "nameZh": "棱晶葛恩火枪"
    },
    {
      "name": "Prisma Dual Decurions (Atmo-mode)",
      "nameZh": "棱晶·什长双枪 (大气)"
    },
    {
      "name": "Prisma Lenz",
      "nameZh": "棱晶楞次弓"
    },
    {
      "name": "Prisma Gorgon",
      "nameZh": "棱晶蛇发女妖"
    },
    {
      "name": "Prisma Obex",
      "nameZh": "棱晶奥比克斯"
    },
    {
      "name": "Prisma Grakata",
      "nameZh": "棱晶葛拉卡达"
    },
    {
      "name": "Prisma Skana",
      "nameZh": "棱晶空刃"
    },
    {
      "name": "Prisma Ohma",
      "nameZh": "棱晶欧玛"
    },
    {
      "name": "Prisma Machete",
      "nameZh": "棱晶马谢特砍刀"
    },
    {
      "name": "Prisma Tetra",
      "nameZh": "棱晶特拉"
    },
    {
      "name": "Proboscis Cernos",
      "nameZh": "刺吸西诺斯"
    },
    {
      "name": "Prisma Twin Gremlins",
      "nameZh": "棱晶双子小精灵"
    },
    {
      "name": "Prova",
      "nameZh": "普罗沃"
    },
    {
      "name": "Pulmonars",
      "nameZh": "感染连枷"
    },
    {
      "name": "Pupacyst",
      "nameZh": "毒囊骨茧"
    },
    {
      "name": "Prova Vandal",
      "nameZh": "普罗沃破坏者"
    },
    {
      "name": "Pyrana",
      "nameZh": "食人鱼"
    },
    {
      "name": "Pyrana Prime",
      "nameZh": "食人鱼Prime"
    },
    {
      "name": "Purgator 1",
      "nameZh": "净化者 1"
    },
    {
      "name": "Quartakk",
      "nameZh": "夸塔克"
    },
    {
      "name": "Quanta",
      "nameZh": "量子切割器"
    },
    {
      "name": "Quatz",
      "nameZh": "夸兹"
    },
    {
      "name": "Rabvee (Machete)",
      "nameZh": "拉比威 (大砍刀)"
    },
    {
      "name": "Rabvee (Hammer)",
      "nameZh": "拉比威 (锤)"
    },
    {
      "name": "Quassus Prime",
      "nameZh": "威震武扇Prime"
    },
    {
      "name": "Quellor",
      "nameZh": "压制者"
    },
    {
      "name": "Quanta Vandal",
      "nameZh": "量子切割器破坏者"
    },
    {
      "name": "Rakta Ballistica",
      "nameZh": "绯红布里斯提卡"
    },
    {
      "name": "Quassus",
      "nameZh": "威震武扇"
    },
    {
      "name": "Rakta Cernos",
      "nameZh": "绯红西诺斯"
    },
    {
      "name": "Rattleguts (Primary)",
      "nameZh": "响胆 (主要)"
    },
    {
      "name": "Reaper Prime",
      "nameZh": "收割者Prime"
    },
    {
      "name": "Reconifex",
      "nameZh": "侦查者步枪"
    },
    {
      "name": "Rakta Dark Dagger",
      "nameZh": "绯红暗黑匕首"
    },
    {
      "name": "Rauta",
      "nameZh": "锐铁"
    },
    {
      "name": "Redeemer Prime",
      "nameZh": "救赎者Prime"
    },
    {
      "name": "Regulators (Mesa)",
      "nameZh": "监察者双枪 (Mesa)"
    },
    {
      "name": "Rattleguts (Secondary)",
      "nameZh": "响胆 (次要)"
    },
    {
      "name": "Redeemer",
      "nameZh": "救赎者"
    },
    {
      "name": "Riot-848",
      "nameZh": "暴乱-848"
    },
    {
      "name": "Ruvox",
      "nameZh": "古声"
    },
    {
      "name": "Rubico",
      "nameZh": "绝路"
    },
    {
      "name": "Rumblejack",
      "nameZh": "电匕怪杰"
    },
    {
      "name": "Sancti Castanas",
      "nameZh": "圣洁雷爆信镖"
    },
    {
      "name": "Ripkas",
      "nameZh": "锐卡斯"
    },
    {
      "name": "Sancti Magistar",
      "nameZh": "圣洁执法者"
    },
    {
      "name": "Sagek Prime",
      "nameZh": "杀格 Prime"
    },
    {
      "name": "Rubico Prime",
      "nameZh": "绝路Prime"
    },
    {
      "name": "Sampotes",
      "nameZh": "三宝聚"
    },
    {
      "name": "Sancti Tigris",
      "nameZh": "圣洁猛虎"
    },
    {
      "name": "Scindo Prime",
      "nameZh": "分裂斩斧Prime"
    },
    {
      "name": "Scourge Prime",
      "nameZh": "祸根Prime"
    },
    {
      "name": "Scourge",
      "nameZh": "祸根"
    },
    {
      "name": "Sarofang",
      "nameZh": "沙罗之牙"
    },
    {
      "name": "Scoliac",
      "nameZh": "脊椎节鞭"
    },
    {
      "name": "Sarpa",
      "nameZh": "蛇刃"
    },
    {
      "name": "Sarofang Prime",
      "nameZh": "沙罗之牙 Prime"
    },
    {
      "name": "Scindo",
      "nameZh": "分裂斩斧"
    },
    {
      "name": "Scyotid",
      "nameZh": "镰刃刺"
    },
    {
      "name": "Secura Lecta",
      "nameZh": "保障勒克塔"
    },
    {
      "name": "Sepfahn (Staff)",
      "nameZh": "瑟普梵 (长棍)"
    },
    {
      "name": "Secura Penta",
      "nameZh": "保障潘塔"
    },
    {
      "name": "Serro",
      "nameZh": "电能斩锯"
    },
    {
      "name": "Sepfahn (Nikana)",
      "nameZh": "瑟普梵 (侍刃)"
    },
    {
      "name": "Seer",
      "nameZh": "预言者"
    },
    {
      "name": "Secura Dual Cestra",
      "nameZh": "保障锡斯特双枪"
    },
    {
      "name": "Sepulcrum",
      "nameZh": "追击者"
    },
    {
      "name": "Shadow Claws (Sevagoth)",
      "nameZh": "幽影之爪 (Sevagoth)"
    },
    {
      "name": "Shaku",
      "nameZh": "双节尺棍"
    },
    {
      "name": "Sicarus",
      "nameZh": "暗杀者"
    },
    {
      "name": "Sibear",
      "nameZh": "西伯利亚冰锤"
    },
    {
      "name": "Shedu",
      "nameZh": "舍杜"
    },
    {
      "name": "Sigma & Octantis",
      "nameZh": "西格玛&南极座"
    },
    {
      "name": "Sheev",
      "nameZh": "希芙"
    },
    {
      "name": "Sicarus Prime",
      "nameZh": "暗杀者Prime"
    },
    {
      "name": "Shadow Clones (Ash)",
      "nameZh": "影分身 (Ash)"
    },
    {
      "name": "Silva & Aegis Prime",
      "nameZh": "席瓦&神盾Prime"
    },
    {
      "name": "Silva & Aegis",
      "nameZh": "席瓦&神盾"
    },
    {
      "name": "Simulor",
      "nameZh": "重力奇点拟成枪"
    },
    {
      "name": "Snipetron",
      "nameZh": "狙击特昂"
    },
    {
      "name": "Skana Prime",
      "nameZh": "空刃Prime"
    },
    {
      "name": "Sobek",
      "nameZh": "鳄神"
    },
    {
      "name": "Skana",
      "nameZh": "空刃"
    },
    {
      "name": "Skiajati",
      "nameZh": "影生"
    },
    {
      "name": "Snipetron Vandal",
      "nameZh": "狙击特昂破坏者"
    },
    {
      "name": "Shattered Lash (Gara)",
      "nameZh": "琉璃碎击 (Gara)"
    },
    {
      "name": "Slaytra",
      "nameZh": "屠煞"
    },
    {
      "name": "Soma Prime",
      "nameZh": "月神Prime"
    },
    {
      "name": "Soma",
      "nameZh": "月神"
    },
    {
      "name": "Spectra",
      "nameZh": "光谱切割器"
    },
    {
      "name": "Spira",
      "nameZh": "旋刃飞刀"
    },
    {
      "name": "Sonicor",
      "nameZh": "超音波冲击枪"
    },
    {
      "name": "Spinnerex",
      "nameZh": "丝蛛皇"
    },
    {
      "name": "Sporothrix",
      "nameZh": "孢丝感染枪"
    },
    {
      "name": "Sporelacer (Primary)",
      "nameZh": "孢射 (主要)"
    },
    {
      "name": "Spira Prime",
      "nameZh": "旋刃飞刀Prime"
    },
    {
      "name": "Sporelacer (Secondary)",
      "nameZh": "孢射 (次要)"
    },
    {
      "name": "Spectra Vandal",
      "nameZh": "光谱切割器破坏者"
    },
    {
      "name": "Stahlta",
      "nameZh": "钢刃步枪"
    },
    {
      "name": "Steflos",
      "nameZh": "石晶之花"
    },
    {
      "name": "Strun Wraith",
      "nameZh": "斯特朗亡魂"
    },
    {
      "name": "Stradavar",
      "nameZh": "斯特拉迪瓦"
    },
    {
      "name": "Stropha",
      "nameZh": "诡计之刃"
    },
    {
      "name": "Staticor",
      "nameZh": "静电能量导引枪"
    },
    {
      "name": "Stubba",
      "nameZh": "史度巴"
    },
    {
      "name": "Stradavar Prime",
      "nameZh": "斯特拉迪瓦Prime"
    },
    {
      "name": "Strun",
      "nameZh": "斯特朗"
    },
    {
      "name": "Strun Prime",
      "nameZh": "斯特朗Prime"
    },
    {
      "name": "Stug",
      "nameZh": "史特克"
    },
    {
      "name": "Sun & Moon",
      "nameZh": "赤阳 & 幽月"
    },
    {
      "name": "Supra",
      "nameZh": "苏普拉"
    },
    {
      "name": "Sybaris",
      "nameZh": "席芭莉丝"
    },
    {
      "name": "Syam",
      "nameZh": "业珀"
    },
    {
      "name": "Synapse",
      "nameZh": "突触生化枪"
    },
    {
      "name": "Synoid Gammacor",
      "nameZh": "枢议咖玛腕甲枪"
    },
    {
      "name": "Supra Vandal",
      "nameZh": "苏普拉破坏者"
    },
    {
      "name": "Sydon",
      "nameZh": "恶龙"
    },
    {
      "name": "Sybaris Prime",
      "nameZh": "席芭莉丝Prime"
    },
    {
      "name": "Synoid Heliocor",
      "nameZh": "枢议赫利俄光锤"
    },
    {
      "name": "Synoid Simulor",
      "nameZh": "枢议重力奇点拟成枪"
    },
    {
      "name": "Tak & Lug",
      "nameZh": "塔克 & 卢格"
    },
    {
      "name": "Tekko",
      "nameZh": "铁钩手甲"
    },
    {
      "name": "Telos Akbolto",
      "nameZh": "终极螺钉双枪"
    },
    {
      "name": "Telos Boltace",
      "nameZh": "终极螺钉拐刃"
    },
    {
      "name": "Tatsu",
      "nameZh": "龙辰"
    },
    {
      "name": "Talons",
      "nameZh": "鹰爪"
    },
    {
      "name": "Tatsu Prime",
      "nameZh": "龙辰Prime"
    },
    {
      "name": "Tekko Prime",
      "nameZh": "铁钩手甲Prime"
    },
    {
      "name": "Thalys",
      "nameZh": "大力士"
    },
    {
      "name": "Tenet Agendus",
      "nameZh": "信条集议"
    },
    {
      "name": "Telos Boltor",
      "nameZh": "终极螺钉步枪"
    },
    {
      "name": "Tenet Arca Plasmor",
      "nameZh": "信条弧电离子枪"
    },
    {
      "name": "Tenet Cycron",
      "nameZh": "信条循环离子枪"
    },
    {
      "name": "Tenet Glaxion",
      "nameZh": "信条冷冻光束步枪"
    },
    {
      "name": "Tenet Diplos",
      "nameZh": "信条纵横双枪"
    },
    {
      "name": "Tenet Detron",
      "nameZh": "信条德特昂"
    },
    {
      "name": "Tenet Exec",
      "nameZh": "信条枢密"
    },
    {
      "name": "Tenet Envoy",
      "nameZh": "信条典客"
    },
    {
      "name": "Tenet Ferrox",
      "nameZh": "信条铁晶磁轨炮"
    },
    {
      "name": "Tenet Flux Rifle",
      "nameZh": "信条通量步枪"
    },
    {
      "name": "Tenet Grigori",
      "nameZh": "信条格里高利"
    },
    {
      "name": "Tetra",
      "nameZh": "特拉"
    },
    {
      "name": "Tenora Prime",
      "nameZh": "双簧管Prime"
    },
    {
      "name": "Tenet Spirex",
      "nameZh": "信条斯派克斯"
    },
    {
      "name": "Tenet Plinx",
      "nameZh": "信条漫射者"
    },
    {
      "name": "Tenet Tetra",
      "nameZh": "信条特拉"
    },
    {
      "name": "Tenora",
      "nameZh": "双簧管"
    },
    {
      "name": "Tenet Quanta",
      "nameZh": "信条·量子切割器"
    },
    {
      "name": "Tenet Livia",
      "nameZh": "信条莉薇娅"
    },
    {
      "name": "Tiberon Prime",
      "nameZh": "狂鲨Prime"
    },
    {
      "name": "Thornbak",
      "nameZh": "棘背"
    },
    {
      "name": "Tigris",
      "nameZh": "猛虎"
    },
    {
      "name": "Tipedo Prime",
      "nameZh": "提佩多Prime"
    },
    {
      "name": "Tiberon",
      "nameZh": "狂鲨"
    },
    {
      "name": "Tigris Prime",
      "nameZh": "猛虎Prime"
    },
    {
      "name": "Tipedo",
      "nameZh": "提佩多"
    },
    {
      "name": "Tombfinger (Secondary)",
      "nameZh": "墓指 (次要)"
    },
    {
      "name": "Tonbo",
      "nameZh": "蜻蛉薙"
    },
    {
      "name": "Tombfinger (Primary)",
      "nameZh": "墓指 (主要)"
    },
    {
      "name": "Tonkkatt",
      "nameZh": "通卡拐刃"
    },
    {
      "name": "Twin Krohkur",
      "nameZh": "双子克鲁古尔"
    },
    {
      "name": "Twin Kohmak",
      "nameZh": "双子寇恩霰机枪"
    },
    {
      "name": "Twin Grakatas",
      "nameZh": "双子葛拉卡达"
    },
    {
      "name": "Trumna Prime",
      "nameZh": "灭杀者Prime"
    },
    {
      "name": "Trumna",
      "nameZh": "灭杀者"
    },
    {
      "name": "Twin Gremlins",
      "nameZh": "双子小精灵"
    },
    {
      "name": "Torid",
      "nameZh": "托里德"
    },
    {
      "name": "Twin Basolk",
      "nameZh": "双子巴萨克"
    },
    {
      "name": "Tonkor",
      "nameZh": "征服榴炮"
    },
    {
      "name": "Tysis",
      "nameZh": "啐沫者"
    },
    {
      "name": "Wrath",
      "nameZh": "愤怒"
    },
    {
      "name": "Twin Rogga",
      "nameZh": "双子罗格"
    },
    {
      "name": "Twin Vipers Wraith",
      "nameZh": "双子蝰蛇亡魂"
    },
    {
      "name": "Vadarya Prime",
      "nameZh": "瓦德雅 Prime"
    },
    {
      "name": "Twin Vipers",
      "nameZh": "双子蝰蛇"
    },
    {
      "name": "Vasto",
      "nameZh": "瓦斯托"
    },
    {
      "name": "Valkyr Talons (Valkyr)",
      "nameZh": "Valkyr之爪"
    },
    {
      "name": "Vastilok",
      "nameZh": "瓦斯提枪刃"
    },
    {
      "name": "Vasto Prime",
      "nameZh": "瓦斯托Prime"
    },
    {
      "name": "Vaykor Marelok",
      "nameZh": "勇气玛瑞火枪"
    },
    {
      "name": "Velox",
      "nameZh": "逐电"
    },
    {
      "name": "Vaykor Sydon",
      "nameZh": "勇气恶龙"
    },
    {
      "name": "Vaykor Hek",
      "nameZh": "勇气海克"
    },
    {
      "name": "Vectis Prime",
      "nameZh": "守望者Prime"
    },
    {
      "name": "Vectis",
      "nameZh": "守望者"
    },
    {
      "name": "Velocitus (Atmo-mode)",
      "nameZh": "极速电磁步枪 (大气)"
    },
    {
      "name": "Veldt",
      "nameZh": "草原猎手"
    },
    {
      "name": "Venka",
      "nameZh": "凯旋之爪"
    },
    {
      "name": "Velocitus (Arch-mode)",
      "nameZh": "极速电磁步枪 (Archwing)"
    },
    {
      "name": "Velox Prime",
      "nameZh": "逐电Prime"
    },
    {
      "name": "Venato Prime",
      "nameZh": "脉纹 Prime"
    },
    {
      "name": "Venka Prime",
      "nameZh": "凯旋之爪Prime"
    },
    {
      "name": "Verdilac",
      "nameZh": "蝰首骨妖"
    },
    {
      "name": "Venato",
      "nameZh": "脉纹"
    },
    {
      "name": "Vericres",
      "nameZh": "真月武扇"
    },
    {
      "name": "Vermisplicer (Primary)",
      "nameZh": "虫置 (主要)"
    },
    {
      "name": "Vermisplicer (Secondary)",
      "nameZh": "虫置 (次要)"
    },
    {
      "name": "Viper Wraith",
      "nameZh": "蝰蛇亡魂"
    },
    {
      "name": "Viper",
      "nameZh": "蝰蛇"
    },
    {
      "name": "War",
      "nameZh": "战争之剑"
    },
    {
      "name": "Volnus",
      "nameZh": "创伤"
    },
    {
      "name": "Volnus Prime",
      "nameZh": "创伤Prime"
    },
    {
      "name": "Vinquibus (Rifle)",
      "nameZh": "制胜者 (突击步枪)"
    },
    {
      "name": "Vinquibus (Melee)",
      "nameZh": "制胜者 (近战)"
    },
    {
      "name": "Vulkar",
      "nameZh": "金工火神"
    },
    {
      "name": "Vulkar Wraith",
      "nameZh": "金工火神亡魂"
    },
    {
      "name": "Vitrica",
      "nameZh": "金璃剑"
    },
    {
      "name": "War Prime",
      "nameZh": "战争之剑Prime"
    },
    {
      "name": "Vesper 77",
      "nameZh": "夜语者 77"
    },
    {
      "name": "Zakti Prime",
      "nameZh": "毒芽Prime"
    },
    {
      "name": "Zakti",
      "nameZh": "毒芽"
    },
    {
      "name": "Wolf Sledge",
      "nameZh": "恶狼战锤"
    },
    {
      "name": "Xoris",
      "nameZh": "驱魔之刃"
    },
    {
      "name": "Zarr",
      "nameZh": "沙皇"
    },
    {
      "name": "Zenistar",
      "nameZh": "天顶之星"
    },
    {
      "name": "Zhuge",
      "nameZh": "诸葛连弩"
    },
    {
      "name": "Zenith",
      "nameZh": "天穹之顶"
    },
    {
      "name": "Zhuge Prime",
      "nameZh": "诸葛连弩Prime"
    },
    {
      "name": "Zylok",
      "nameZh": "席尔火枪"
    },
    {
      "name": "Zymos",
      "nameZh": "邪莫斯"
    },
    {
      "name": "Zylok Prime",
      "nameZh": "席尔火枪 Prime"
    },
  ],
  // === 武器完整数据 (662个) ===
  weapons: {"Acceltra":{"masteryReq":8,"description":"Using a barrage of rapid-fire plasma rockets, Gauss’ signature weapon lays down a path of destruction. Reloads are faster while sprinting, even more so in Gauss’ hands. For safety, rockets arm after traveling a safe distance.","noise":"Alarming","releaseDate":"2019-08-29","ammoCapacity":96,"productCategory":"LongGuns","equipTime":1.1,"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":48,"reloadTime":2,"multishot":1,"attacks":[{"name":"Rocket Impact","speed":12,"crit_chance":32,"crit_mult":2.8,"status_chance":6,"shot_type":"Projectile","shot_speed":70,"flight":70,"unique":{"force_procs":["impact"]},"damage":{"Impact":35}},{"name":"Rocket Explosion","speed":12,"crit_chance":32,"crit_mult":2.8,"status_chance":6,"shot_type":"AoE","damage":{"Slash":8.8,"Puncture":35.2},"falloff":{"start":0,"end":4,"reduction":0.5},"no_headshot_mult":true}],"name":"Acceltra","imageName":"acceltra.webp","tags":["Tenno"],"compTags":["PROJECTILE","AOE","ASSAULT_AMMO"],"comb":[[0,1]]},
  "Acceltra Prime":{"masteryReq":14,"description":"Engage your enemies with deadly speed. This weapon reloads faster when its wielder sprints, faster still with Gauss.","noise":"Alarming","releaseDate":"2024-01-17","ammoCapacity":96,"productCategory":"LongGuns","category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":48,"reloadTime":1.6,"multishot":1,"attacks":[{"name":"Rocket Impact","speed":10,"crit_chance":34,"crit_mult":3,"status_chance":18,"shot_type":"Projectile","shot_speed":70,"flight":70,"unique":{"force_procs":["impact"]},"damage":{"Impact":44}},{"name":"Rocket Explosion","speed":10,"crit_chance":34,"crit_mult":3,"status_chance":18,"shot_type":"AoE","damage":{"Slash":10.6,"Puncture":42.4},"falloff":{"start":0,"end":4,"reduction":0.5},"no_headshot_mult":true}],"name":"Acceltra Prime","imageName":"AcceltraPrime.webp","tags":["Tenno"],"compTags":["PROJECTILE","AOE","ASSAULT_AMMO"],"comb":[[0,1]]},
  "Acrid":{"masteryReq":7,"description":"The Acrid fires an acidic-infused needle.","noise":"Alarming","releaseDate":"2013-05-23","productCategory":"Pistols","category":"Secondary","trigger":"Semi","type":"Pistol","magazineSize":15,"reloadTime":1.2,"multishot":1,"attacks":[{"name":"Normal Attack","speed":6.67,"crit_chance":5,"crit_mult":2,"status_chance":10,"shot_type":"Projectile","shot_speed":65,"flight":65,"unique":{"force_procs":["toxin"]},"damage":{"Toxin":35}}],"name":"Acrid","imageName":"acrid.webp","tags":["Grineer"],"compTags":["PROJECTILE"]},
  "AX-52":{"masteryReq":12,"description":"This pre-Orokin weapon earned its popularity for its reliability in tough conditions. When hip-firing, its Ammo Efficiency increases. When aiming, headshots have a high Critical Chance.","noise":"Alarming","releaseDate":"2024-07-20","ammoCapacity":540,"productCategory":"LongGuns","category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":40,"reloadTime":2,"multishot":1,"attacks":[{"name":"Normal Attack","speed":10,"crit_chance":26,"crit_mult":2.4,"status_chance":18,"shot_type":"Hit-Scan","damage":{"Puncture":40}}],"name":"AX-52","imageName":"AX-52.webp","tags":[""],"compTags":["ASSAULT_AMMO","AX52"]},
  "Aegrit":{"masteryReq":11,"description":"What the Aegrit lacks in quantity it makes up for in destructive power. Toss the Aegrit onto your enemy’s position then detonate remotely at the right moment for maximum destructive effect.","noise":"Silent","releaseDate":"2022-09-07","ammoCapacity":4,"productCategory":"Pistols","zoomProps":[[]],"category":"Secondary","trigger":"Active","type":"Throwing","magazineSize":2,"reloadTime":1.3,"multishot":1,"attacks":[{"name":"Direct Hit","isCoMult":true,"speed":2,"crit_chance":37,"crit_mult":1.9,"status_chance":19,"shot_type":"Projectile","shot_speed":30,"flight":30,"damage":{"Impact":4.5,"Slash":2.7,"Puncture":1.8}},{"name":"Detonation","speed":2,"crit_chance":37,"crit_mult":2,"status_chance":19,"shot_type":"AoE","damage":{"Blast":797},"falloff":{"start":0,"end":9,"reduction":0.7},"no_headshot_mult":true}],"name":"Aegrit","imageName":"aegrit.webp","tags":["Grineer"],"compTags":["PROJECTILE","THROWN","AOE"],"comb":[[0,1]]},
  "Afentis Prime":{"masteryReq":13,"description":"The gilded Speargun of Styanax Prime shines like a beacon across the battlefield, invigorating allies and stunning enemies.","noise":"Alarming","releaseDate":"2026-06-17","ammoCapacity":12,"productCategory":"LongGuns","zoomProps":[[]],"category":"Primary","trigger":"Semi-Auto","type":"Rifle","magazineSize":4,"reloadTime":1.8,"multishot":1,"attacks":[{"name":"Semi","speed":0.833,"crit_chance":26,"crit_mult":2.6,"status_chance":30,"shot_type":"Projectile","shot_speed":90,"unique":{"WITH_COND":{"speed":0.2},"force_procs":["impact"]},"damage":{"Impact":40,"Slash":40,"Puncture":120}},{"name":"Radial Attack","speed":0.833,"crit_chance":26,"crit_mult":2.6,"status_chance":10,"shot_type":"AoE","unique":{"force_procs":["heat"]},"damage":{"Blast":800,"Heat":250},"no_headshot_mult":true},{"name":"Spear Throw","speed":1,"crit_chance":40,"crit_mult":3,"status_chance":30,"shot_type":"Projectile","shot_speed":90,"damage":{"Impact":330,"Slash":55,"Puncture":165}}],"name":"Afentis Prime","imageName":"AfentisPrime.webp","tags":[],"compTags":["PROJECTILE","IMPACTEXPLODE"],"comb":[[0,1]]},
  "Afentis":{"masteryReq":8,"description":"Styanax’s speargun matches his might. Throw Afentis to pin an enemy and nearby enemies will also be stunned. Throw Afentis onto the ground to buff nearby allies with Ballistarii Might. The buff increases reload speed, fire rate, and ammo pools and reduces recoil. Allies who kill enemies with Ballistarii Might maintain the buff temporarily when they move away from Afentis.","noise":"Alarming","releaseDate":"2022-09-07","ammoCapacity":12,"productCategory":"LongGuns","equipTime":1.1,"zoomProps":[[]],"category":"Primary","trigger":"Semi","type":"Rifle","magazineSize":4,"reloadTime":1.8,"multishot":1,"attacks":[{"name":"Semi","speed":0.833,"crit_chance":26,"crit_mult":2.2,"status_chance":24,"shot_type":"Projectile","shot_speed":90,"flight":90,"unique":{"WITH_COND":{"speed":0.2}},"damage":{"Impact":20,"Slash":20,"Puncture":60}},{"name":"Radial Attack","speed":0.833,"crit_chance":26,"crit_mult":2.2,"status_chance":24,"shot_type":"AoE","damage":{"Blast":800},"falloff":{"start":0,"end":3,"reduction":0.4},"no_headshot_mult":true},{"name":"Spear Throw","speed":1,"crit_chance":30,"crit_mult":3,"status_chance":20,"shot_type":"Projectile","shot_speed":90,"flight":90,"damage":{"Impact":240,"Slash":40,"Puncture":120}}],"name":"Afentis","imageName":"afentis.webp","tags":["Tenno"],"compTags":["PROJECTILE","IMPACTEXPLODE"],"comb":[[0,1]]},
  "Afuris Prime":{"masteryReq":12,"description":"Vanquish chaos with dual firepower.","noise":"Alarming","releaseDate":"2022-12-14","ammoCapacity":400,"productCategory":"Pistols","zoomProps":[[]],"category":"Secondary","trigger":"Auto","type":"Pistol","magazineSize":80,"reloadTime":1.2,"multishot":1,"attacks":[{"name":"Normal Attack","speed":12.5,"crit_chance":16,"crit_mult":2,"status_chance":30,"shot_type":"Hit-Scan","damage":{"Impact":3.9,"Slash":3.9,"Puncture":18.2}}],"name":"Afuris Prime","imageName":"afuris-prime.webp","tags":["Prime"],"compTags":[]},
  "Afuris":{"masteryReq":4,"description":"Furis pistols equipped in each hand. Twice the Magazine Capacity and slightly faster Fire Rate, but Accuracy and Reload Speed are lowered.","noise":"Alarming","releaseDate":"2013-01-10","ammoCapacity":240,"productCategory":"Pistols","category":"Secondary","trigger":"Auto","type":"Dual Pistols","magazineSize":70,"reloadTime":2,"multishot":1,"attacks":[{"name":"Normal Attack","speed":12.5,"crit_chance":5,"crit_mult":2,"status_chance":12,"shot_type":"Hit-Scan","damage":{"Impact":3,"Slash":3,"Puncture":14}}],"name":"Afuris","imageName":"afuris.webp","tags":["Tenno"],"compTags":[]},
  "Aeolak":{"masteryReq":10,"description":"This unusual automatic rifle feels strangely familiar and has two fire modes. Primary fire packs radiation damage. Alternate fire charges up to launch an explosive projectile.","noise":"Alarming","releaseDate":"2022-04-27","ammoCapacity":400,"productCategory":"LongGuns","equipTime":1.1,"zoomProps":[[]],"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":40,"reloadTime":2,"multishot":1,"attacks":[{"name":"Normal Attack","isCoMult":true,"punch_through":1,"speed":6,"crit_chance":21,"crit_mult":2.3,"status_chance":33,"shot_type":"Projectile","shot_speed":100,"flight":100,"damage":{"Impact":15,"Slash":17,"Puncture":23,"Radiation":5}},{"name":"Alt-Fire","ammoCost":10,"isCoMult":true,"speed":1.5,"crit_chance":21,"crit_mult":2.3,"status_chance":33,"shot_type":"Projectile","shot_speed":60,"flight":60,"damage":{"Impact":58.2,"Slash":29.1,"Puncture":9.7},"charge_time":0.3},{"name":"Alt-Fire Explosion","ammoCost":10,"speed":1.5,"crit_chance":21,"crit_mult":2.3,"status_chance":33,"shot_type":"AoE","unique":{"force_procs":["impact"]},"damage":{"Blast":789},"falloff":{"start":0,"end":7,"reduction":0.5},"no_headshot_mult":true}],"name":"Aeolak","imageName":"aeolak.webp","tags":["Duviri"],"compTags":["ASSAULT_AMMO","PROJECTILE","AOE"],"comb":[[1,2]]},
  "Ack & Brunt":{"masteryReq":3,"description":"Tyl Regor’s custom axe and shield are how he likes to eliminate ‘frustrations’.","blockingAngle":70,"comboDuration":5,"followThrough":0.6,"range":2.5,"windUp":0.7,"releaseDate":"2015-07-31","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","slide":"149","slam":{"damage":"447.00","radial":{"damage":"149.00","element":"Impact","radius":7}},"speed":0.833,"crit_chance":20,"crit_mult":2,"status_chance":10,"damage":{"Impact":14.9,"Slash":119.2,"Puncture":14.9}},{"name":"Incarnon Form Arial Slam","isInc":1,"speed":0.833,"crit_chance":14,"crit_mult":2,"status_chance":34,"damage":{"Impact":59.6,"Slash":208.6,"Puncture":29.8}},{"name":"Incarnon Form Arial Slam AoE","isInc":1,"speed":0.833,"crit_chance":14,"crit_mult":2,"status_chance":34,"unique":{"force_procs":["impact"]},"damage":{"Heat":606}},{"name":"Incarnon Form Slide Slam","isInc":1,"speed":0.833,"crit_chance":14,"crit_mult":2,"status_chance":34,"damage":{"Impact":29.8,"Slash":104.3,"Puncture":14.9}},{"name":"Incarnon Form Slide Slam AoE","isInc":1,"speed":0.833,"crit_chance":14,"crit_mult":2,"status_chance":34,"unique":{"force_procs":["impact"]},"damage":{"Heat":303}},{"name":"Slam","radius":6,"type":"s","isHeavy":false,"speed":1,"crit_chance":20,"crit_mult":2,"status_chance":10,"unique":{"force_procs":["impact"]},"damage":{"Impact":298}},{"name":"Heavy Slam","radius":7,"type":"hs","isHeavy":true,"speed":1,"crit_chance":20,"crit_mult":2,"status_chance":10,"damage":{"Blast":447}}],"name":"Ack & Brunt","imageName":"ack-&-brunt.webp","tags":["Grineer","Incarnon"],"compTags":["SWORDS_AND_SHIELD_STANCE"]},
  "Akbronco Prime":{"masteryReq":10,"description":"Used together, these Orokin pistols feed off each other, inflicting greater damage with an enhanced status chance for inducing elemental effects on targets.","noise":"Alarming","releaseDate":"2014-03-06","productCategory":"Pistols","category":"Secondary","trigger":"Semi","type":"Dual Pistols","magazineSize":8,"reloadTime":2.25,"multishot":7,"attacks":[{"name":"Normal Attack","speed":4.33,"crit_chance":6,"crit_mult":2,"status_chance":12.86,"shot_type":"Hit-Scan","damage":{"Impact":40,"Slash":5,"Puncture":5},"falloff":{"start":9,"end":18,"reduction":0.75}}],"name":"Akbronco Prime","imageName":"akbronco-prime.webp","tags":["Prime","Never Vaulted"],"compTags":["SECONDARYSHOTGUN","AKBRONCO_PRIME"]},
  "Akjagara Prime":{"masteryReq":12,"description":"Precision machined mirrored pistols. Primed and ready.","noise":"Alarming","releaseDate":"2018-12-12","ammoCapacity":320,"productCategory":"Pistols","zoomProps":[[]],"category":"Secondary","trigger":"Burst","type":"Pistol","magazineSize":40,"reloadTime":1.4,"multishot":1,"attacks":[{"name":"Normal Attack","punch_through":0.2,"speed":5,"crit_chance":18,"crit_mult":2.2,"status_chance":32,"shot_type":"Hit-Scan","damage":{"Impact":3.6,"Slash":28.8,"Puncture":3.6},"burst_count":2,"burst_delay":0}],"name":"Akjagara Prime","imageName":"akjagara-prime.webp","tags":["Prime","Vaulted"],"compTags":["AKJAGARA"]},
  "Akarius":{"masteryReq":8,"description":"Bombard legions of enemies with target seeking rockets. These dual launchers reload faster while sprinting, even more so in Gauss’ hands. Rockets arm after reaching a safe distance.","noise":"Alarming","releaseDate":"2019-08-29","ammoCapacity":20,"productCategory":"Pistols","zoomProps":[[]],"category":"Secondary","trigger":"Burst","type":"Pistol","magazineSize":10,"reloadTime":3.4,"multishot":1,"attacks":[{"name":"Rocket Impact","isCoMult":true,"speed":4.33,"crit_chance":6,"crit_mult":1.8,"status_chance":28,"shot_type":"Projectile","shot_speed":80,"flight":80,"damage":{"Impact":68},"burst_count":2,"burst_delay":0.12},{"name":"Rocket Detonation","speed":4.33,"crit_chance":6,"crit_mult":1.8,"status_chance":28,"shot_type":"AoE","damage":{"Blast":419},"falloff":{"start":0,"end":7.2,"reduction":0.7},"no_headshot_mult":true,"burst_count":2,"burst_delay":0.12}],"name":"Akarius","imageName":"akarius.webp","tags":["Tenno"],"compTags":["AOE"],"comb":[[0,1]]},
  "Akbolto":{"masteryReq":8,"description":"A Bolto equipped in each hand. Twice the Magazine Capacity and slightly faster Fire Rate, but reload time is doubled and accuracy is lowered.","noise":"Alarming","releaseDate":"2013-01-29","productCategory":"Pistols","category":"Secondary","trigger":"Semi","type":"Dual Pistols","magazineSize":30,"reloadTime":2.6,"multishot":1,"attacks":[{"name":"Normal Attack","speed":10,"crit_chance":16,"crit_mult":2.4,"status_chance":2.2,"shot_type":"Projectile","shot_speed":75,"flight":75,"damage":{"Impact":4,"Puncture":36}}],"name":"Akbolto","imageName":"akbolto.webp","tags":["Tenno"],"compTags":["PROJECTILE"]},
  "Akjagara":{"masteryReq":8,"description":"The design of these hard-hitting dual pistols is a mix of organic and bladed elements.","noise":"Alarming","releaseDate":"2015-02-05","productCategory":"Pistols","category":"Secondary","trigger":"Burst","type":"Dual Pistol","magazineSize":36,"reloadTime":2.25,"multishot":1,"attacks":[{"name":"Normal Attack","speed":5,"crit_chance":6,"crit_mult":2,"status_chance":28,"shot_type":"Hit-Scan","damage":{"Impact":4.5,"Slash":21,"Puncture":4.5},"burst_count":2,"burst_delay":0}],"name":"Akjagara","imageName":"akjagara.webp","tags":["Tenno"],"compTags":["AKJAGARA"]},
  "Akbolto Prime":{"masteryReq":13,"description":"Gilded rails adorn these two vicious bolt launching pistols.","noise":"Alarming","releaseDate":"2017-12-12","productCategory":"Pistols","category":"Secondary","trigger":"Semi","type":"Pistol","magazineSize":40,"reloadTime":1.3,"multishot":1,"attacks":[{"name":"Normal Attack","speed":7,"crit_chance":36,"crit_mult":2.8,"status_chance":14,"shot_type":"Projectile","shot_speed":100,"flight":100,"damage":{"Impact":3.2,"Slash":1.28,"Puncture":27.52}}],"name":"Akbolto Prime","imageName":"akbolto-prime.webp","tags":["Prime","Vaulted"],"compTags":["PROJECTILE"]},
  "Akarius Prime":{"masteryReq":14,"description":"Wield a pair of golden rocket launchers. Sprint to reload them faster. They reload fastest when wielded by Gauss.","noise":"Alarming","releaseDate":"2024-01-17","ammoCapacity":24,"productCategory":"Pistols","zoomProps":[[]],"category":"Secondary","trigger":"Burst","type":"Pistol","magazineSize":8,"reloadTime":2.4,"multishot":1,"attacks":[{"name":"Rocket Impact","isCoMult":true,"speed":3.667,"crit_chance":18,"crit_mult":2,"status_chance":34,"shot_type":"Projectile","shot_speed":80,"flight":80,"damage":{"Impact":68},"burst_count":2,"burst_delay":0.12},{"name":"Rocket Detonation","speed":3.667,"crit_chance":18,"crit_mult":2,"status_chance":34,"shot_type":"AoE","damage":{"Blast":509},"no_headshot_mult":true,"burst_count":2,"burst_delay":0.12}],"name":"Akarius Prime","imageName":"AkariusPrime.webp","tags":["Tenno"],"compTags":["AOE"],"comb":[[0,1]]},
  "Akbronco":{"masteryReq":2,"description":"A Bronco equipped in each hand.","noise":"Alarming","releaseDate":"2013-05-23","productCategory":"Pistols","category":"Secondary","trigger":"Semi","type":"Dual Pistols","magazineSize":4,"reloadTime":2.25,"multishot":7,"attacks":[{"name":"Normal Attack","speed":8.33,"crit_chance":6,"crit_mult":2,"status_chance":3.14,"shot_type":"Hit-Scan","damage":{"Impact":32,"Slash":4,"Puncture":4},"falloff":{"start":7,"end":14,"reduction":0.75}}],"name":"Akbronco","imageName":"akbronco.webp","tags":["Tenno"],"compTags":["SECONDARYSHOTGUN","SINGLESHOT"]},
  "Aklato":{"masteryReq":3,"description":"A Lato equipped in each hand. Twice the Magazine Capacity and Fire Rate, but Reload time is doubled and Accuracy is lowered.","noise":"Alarming","releaseDate":"2012-10-25","productCategory":"Pistols","category":"Secondary","trigger":"Semi","type":"Dual Pistols","magazineSize":30,"reloadTime":2.4000001,"multishot":1,"attacks":[{"name":"Normal Attack","speed":7.5,"crit_chance":10,"crit_mult":1.8,"status_chance":6,"shot_type":"Hit-Scan","damage":{"Impact":4.5,"Slash":18,"Puncture":7.5}}],"name":"Aklato","imageName":"aklato.webp","tags":[],"compTags":[]},
  "Aklex Prime":{"masteryReq":15,"description":"Savage the enemy with a Lex Prime in each hand.","noise":"Alarming","releaseDate":"2017-01-27","productCategory":"Pistols","category":"Secondary","trigger":"Semi","type":"Dual Pistols","magazineSize":16,"reloadTime":3,"multishot":1,"attacks":[{"name":"Normal Attack","speed":2.67,"crit_chance":25,"crit_mult":2,"status_chance":25,"shot_type":"Hit-Scan","damage":{"Impact":15,"Slash":15,"Puncture":120}}],"name":"Aklex Prime","imageName":"aklex-prime.webp","tags":["Prime","Baro"],"compTags":[]},
  "Aksomati":{"masteryReq":9,"description":"The devastating power of the Soma rifle compacted into two elegant pistols.","noise":"Alarming","releaseDate":"2015-04-09","ammoCapacity":420,"productCategory":"Pistols","category":"Secondary","trigger":"Auto","type":"Pistol","magazineSize":70,"reloadTime":1.4,"multishot":1,"attacks":[{"name":"Fully Spooled","speed":12.5,"crit_chance":24,"crit_mult":3,"status_chance":8,"shot_type":"Hit-Scan","damage":{"Impact":1.8,"Slash":9,"Puncture":7.2}}],"name":"Aksomati","imageName":"aksomati.webp","tags":["Tenno"],"compTags":[]},
  "Aksomati Prime":{"masteryReq":12,"description":"The elegant Aksomati precisely refined to this, their ultimate manifestation.","noise":"Alarming","releaseDate":"2019-12-17","ammoCapacity":880,"productCategory":"Pistols","zoomProps":[[]],"category":"Secondary","trigger":"Auto","type":"Pistol","magazineSize":80,"reloadTime":1.4,"multishot":1,"attacks":[{"name":"Fully Spooled","speed":13.33,"crit_chance":24,"crit_mult":3,"status_chance":18,"shot_type":"Hit-Scan","damage":{"Impact":2,"Slash":10,"Puncture":8}}],"name":"Aksomati Prime","imageName":"aksomati-prime.webp","tags":["Prime"],"compTags":[]},
  "Akmagnus Prime":{"masteryReq":15,"description":"Fill your fists with golden cannons of fury. The refined design unlocks quicker handling and higher critical chance.","noise":"Alarming","releaseDate":"2024-07-22","ammoCapacity":210,"productCategory":"Pistols","category":"Secondary","trigger":"Semi","type":"Dual Pistols","magazineSize":16,"reloadTime":2.8,"multishot":1,"attacks":[{"name":"Normal Attack","speed":5.67,"crit_chance":28,"crit_mult":2.8,"status_chance":28,"shot_type":"Hit-Scan","unique":{"ammoEff":1},"damage":{"Impact":44.1,"Slash":26.95,"Puncture":26.95}}],"name":"Akmagnus Prime","imageName":"AkmagnusPrime.webp","tags":[],"compTags":[]},
  "Akmagnus":{"masteryReq":12,"description":"Twice the ammo and twice the stopping power of a single Magnus.","noise":"Alarming","releaseDate":"2014-01-29","productCategory":"Pistols","category":"Secondary","trigger":"Semi","type":"Dual Pistols","magazineSize":16,"reloadTime":2.4000001,"multishot":1,"attacks":[{"name":"Normal Attack","speed":6.17,"crit_chance":22,"crit_mult":2,"status_chance":22,"shot_type":"Hit-Scan","damage":{"Impact":34.2,"Slash":20.9,"Puncture":20.9}}],"name":"Akmagnus","imageName":"akmagnus.webp","tags":["Tenno"],"compTags":[]},
  "Akvasto":{"masteryReq":8,"description":"Vasto revolvers equipped in each hand.","noise":"Alarming","releaseDate":"2013-08-30","ammoCapacity":210,"productCategory":"Pistols","category":"Secondary","trigger":"Semi","type":"Dual Pistols","magazineSize":12,"reloadTime":2,"multishot":1,"attacks":[{"name":"Normal Attack","speed":8.67,"crit_chance":16,"crit_mult":1.8,"status_chance":12,"shot_type":"Hit-Scan","damage":{"Impact":14.5,"Slash":29,"Puncture":14.5}}],"name":"Akvasto","imageName":"akvasto.webp","tags":["Tenno"],"compTags":[]},
  "Akstiletto":{"masteryReq":8,"description":"These diminutive rapid-fire Stiletto machine-pistols are just the right size to be akimbo style without sacrificing accuracy.","noise":"Alarming","releaseDate":"2014-02-05","productCategory":"Pistols","category":"Secondary","trigger":"Auto","type":"Pistol","magazineSize":28,"reloadTime":1.1,"multishot":1,"attacks":[{"name":"Normal Attack","speed":10,"crit_chance":18,"crit_mult":1.8,"status_chance":18,"shot_type":"Hit-Scan","damage":{"Impact":16.8,"Slash":8.4,"Puncture":2.8}}],"name":"Akstiletto","imageName":"akstiletto.webp","tags":["Tenno"],"compTags":[]},
  "Aklex":{"masteryReq":4,"description":"Dual Lex pistols double the amount of high caliber lead you can throw at the enemy, but accuracy and reload time suffer.","noise":"Alarming","releaseDate":"2013-11-27","productCategory":"Pistols","category":"Secondary","trigger":"Semi","type":"Dual Pistols","magazineSize":12,"reloadTime":3,"multishot":1,"attacks":[{"name":"Normal Attack","speed":1.58,"crit_chance":20,"crit_mult":2,"status_chance":10,"shot_type":"Hit-Scan","damage":{"Impact":13,"Slash":13,"Puncture":104}}],"name":"Aklex","imageName":"aklex.webp","tags":["Tenno"],"compTags":[]},
  "Akstiletto Prime":{"masteryReq":10,"description":"Stylish, discreet and accurate, perfect for the Tenno of distinction.","noise":"Alarming","releaseDate":"2016-05-17","ammoCapacity":400,"productCategory":"Pistols","category":"Secondary","trigger":"Auto","type":"Pistol","magazineSize":40,"reloadTime":1.1,"multishot":1,"attacks":[{"name":"Normal Attack","speed":7.08,"crit_chance":15,"crit_mult":2,"status_chance":30,"shot_type":"Hit-Scan","damage":{"Impact":21.6,"Slash":10.8,"Puncture":3.6}}],"name":"Akstiletto Prime","imageName":"akstiletto-prime.webp","tags":["Prime"],"compTags":["AKSTILETTO_PRIME"]},
  "Akvasto Prime":{"masteryReq":12,"description":"Orokin craftsmanship married with superior firepower. Dual Vastos, primed and ready to strike.","noise":"Alarming","releaseDate":"2018-11-14","productCategory":"Pistols","zoomProps":[[]],"category":"Secondary","trigger":"Semi","type":"Pistol","magazineSize":12,"reloadTime":1.4,"multishot":1,"attacks":[{"name":"Normal Attack","speed":6.33,"crit_chance":22,"crit_mult":2.4,"status_chance":22,"shot_type":"Hit-Scan","damage":{"Impact":9.9,"Slash":46.2,"Puncture":9.9}}],"name":"Akvasto Prime","imageName":"akvasto-prime.webp","tags":["Prime","Baro"],"compTags":[]},
  "Amanata":{"masteryReq":2,"description":"Roll Koumei's die with every 30 hits from Amanata to empower yourself with 1 of 5 Koumei blessings. Roll a 6 to receive all blessings at once.","blockingAngle":55,"comboDuration":5,"followThrough":0.6,"range":3,"windUp":0.9,"releaseDate":"2024-10-02","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":1,"crit_chance":24,"crit_mult":2,"status_chance":24,"damage":{"Slash":88.2,"Puncture":37.8}},{"name":"Slam","radius":7,"type":"s","isHeavy":false,"speed":1,"crit_chance":24,"crit_mult":2,"status_chance":24,"unique":{"force_procs":["heat"]},"damage":{"Heat":252}},{"name":"Heavy Slam","radius":8,"type":"hs","isHeavy":true,"speed":1,"crit_chance":24,"crit_mult":2,"status_chance":24,"damage":{"Slash":264.6,"Puncture":113.4}}],"name":"Amanata","imageName":"Amanata.webp","tags":[],"compTags":["POLEARMS_STANCE"]},
  "Ambassador":{"masteryReq":10,"description":"Bring negotiations to an instant conclusion with this Corpus assault rifle. Switch effortlessly between charged explosive sniper shots and rapid-fire electrical assault mode.","noise":"Alarming","releaseDate":"2021-07-06","ammoCapacity":960,"productCategory":"LongGuns","equipTime":1.1,"zoomProps":[[]],"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":96,"reloadTime":2.6,"multishot":1,"attacks":[{"name":"Auto","speed":13.33,"crit_chance":14,"crit_mult":2.8,"status_chance":26,"shot_type":"Hit-Scan","damage":{"Electricity":29}},{"name":"Charge","ammoCost":16,"speed":1,"crit_chance":16,"crit_mult":2.8,"status_chance":32,"shot_type":"Hit-Scan","damage":{"Electricity":600},"charge_time":1},{"name":"Charged AoE","ammoCost":16,"speed":1,"crit_chance":16,"crit_mult":2.8,"status_chance":32,"shot_type":"AoE","damage":{"Electricity":800},"falloff":{"start":0,"end":6,"reduction":0.5},"no_headshot_mult":true,"charge_time":0.7}],"name":"Ambassador","imageName":"ambassador.webp","tags":["Corpus"],"compTags":["ASSAULT_AMMO"],"comb":[[1,2]]},
  "Alternox Prime":{"masteryReq":13,"description":"Orokin gold enhances the conductivity of Gyre Prime's signature rifle, enabling it to fire massive electrifying orbs.","noise":"Alarming","releaseDate":"2025-12-10","ammoCapacity":540,"productCategory":"LongGuns","zoomProps":[[]],"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":42,"reloadTime":1.8,"multishot":1,"attacks":[{"name":"Normal Attack","isCoMult":true,"speed":5.33,"crit_chance":20,"crit_mult":2.2,"status_chance":40,"shot_type":"Projectile","shot_speed":60,"flight":60,"damage":{"Electricity":75}},{"name":"Alt-Fire Contact","ammoCost":4,"speed":1.5,"crit_chance":2,"crit_mult":2,"status_chance":50,"shot_type":"Projectile","shot_speed":60,"flight":60,"damage":{"Impact":7,"Slash":10.5,"Puncture":52.5}},{"name":"Alt-Fire Damage over Time","duration":1000,"ammoCost":4,"speed":1,"crit_chance":2,"crit_mult":2,"status_chance":50,"damage":{"Electricity":70},"falloff":{"start":0,"end":6,"reduction":0.6}},{"name":"Alt-Fire Explosion","ammoCost":4,"speed":1,"crit_chance":2,"crit_mult":2,"status_chance":44,"shot_type":"AoE","damage":{"Electricity":140},"falloff":{"start":0,"end":6,"reduction":0.6},"no_headshot_mult":true}],"name":"Alternox Prime","imageName":"AlternoxPrime.webp","tags":["Tenno"],"compTags":["PROJECTILE","ASSAULT_AMMO","AOE"],"comb":[[1,2,3]]},
  "Akzani":{"masteryReq":4,"description":"The choice weapon of Mirage, these fast-firing dual pistols deliver a deadly performance.","noise":"Alarming","releaseDate":"2014-07-18","ammoCapacity":400,"productCategory":"Pistols","category":"Secondary","trigger":"Auto","type":"Pistol","magazineSize":100,"reloadTime":2,"multishot":1,"attacks":[{"name":"Normal Attack","speed":20,"crit_chance":14,"crit_mult":2,"status_chance":14,"shot_type":"Hit-Scan","damage":{"Impact":1.8,"Slash":1.8,"Puncture":8.4}}],"name":"Akzani","imageName":"akzani.webp","tags":["Tenno"],"compTags":[]},
  "Amprex":{"masteryReq":10,"description":"The Amprex rifle fires a continuous beam of high voltage electricity that arcs among nearby enemies. This weapon excels at Crowd Control.","noise":"Alarming","releaseDate":"2014-04-23","ammoCapacity":700,"productCategory":"LongGuns","equipTime":1.1,"zoomProps":[[]],"category":"Primary","trigger":"Held","type":"Rifle","magazineSize":100,"reloadTime":2.6,"multishot":1,"attacks":[{"name":"Normal Attack","isBeam":true,"speed":12,"crit_chance":32,"crit_mult":2.2,"status_chance":22,"shot_type":"Discharge","damage":{"Electricity":22}}],"name":"Amprex","imageName":"amprex.webp","tags":["Corpus"],"compTags":["BEAM","ASSAULT_AMMO","AOE"]},
  "Amphis":{"masteryReq":5,"description":"Fashioned with Grineer materials and balanced for marine infantry use, the Amphis is a traditional staff weapon that has received a monstrous makeover that enables shock damage on jump attacks. Connects with multiple enemies with each strike.","blockingAngle":60,"comboDuration":5,"followThrough":0.5,"range":3,"windUp":0.5,"releaseDate":"2013-02-22","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"130","slam":{"damage":"390.00","radial":{"damage":"130.00","element":"Electricity","radius":6}},"speed":1.25,"crit_chance":13,"crit_mult":1.7,"status_chance":21,"damage":{"Impact":91,"Slash":19.5,"Puncture":19.5}},{"name":"Slam","radius":6,"type":"s","isHeavy":false,"speed":1,"crit_chance":13,"crit_mult":1.7,"status_chance":21,"unique":{"force_procs":["impact"]},"damage":{"Electricity":260}},{"name":"Heavy Slam","radius":7,"type":"hs","isHeavy":true,"speed":1,"crit_chance":13,"crit_mult":1.7,"status_chance":21,"damage":{"Electricity":390}}],"name":"Amphis","imageName":"amphis.webp","tags":["Grineer"],"compTags":["STAVES_STANCE"]},
  "Angstrum":{"masteryReq":4,"description":"Capable of firing multiple rockets at once, the Angstrum is a handheld instrument of destruction.","noise":"Alarming","releaseDate":"2014-05-14","ammoCapacity":18,"productCategory":"Pistols","category":"Secondary","trigger":"Charge","type":"Pistol","magazineSize":1,"reloadTime":2.5,"multishot":1,"attacks":[{"name":"Single Rocket Impact","speed":2,"crit_chance":16,"crit_mult":2,"status_chance":22,"shot_type":"Projectile","shot_speed":150,"flight":150,"damage":{"Blast":200},"charge_time":0.5},{"name":"Single Rocket Explosion","speed":2,"crit_chance":16,"crit_mult":2,"status_chance":22,"shot_type":"AoE","damage":{"Blast":250},"falloff":{"start":0,"end":3.6,"reduction":0.4},"no_headshot_mult":true,"charge_time":0.5},{"name":"Incarnon Form","isCoMult":true,"isInc":1,"speed":6,"crit_chance":18,"crit_mult":1.8,"status_chance":18,"shot_type":"Projectile","damage":{"Heat":30}}],"incMagazineSize":120,"name":"Angstrum","imageName":"angstrum.webp","tags":["Corpus","Incarnon"],"compTags":["PROJECTILE","AOE","SINGLESHOT"],"comb":[[0,1]]},
  "Alternox":{"masteryReq":8,"description":"Gyre’s signature weapon has two fire modes. Primary fire shocks enemies with electrical orbs. Alternate fire is a large ball of electricity that sticks to any surface and pulses Electricity before it explodes. In Gyre's hands, the weapon has a small amount of multishot.","noise":"Alarming","releaseDate":"2022-04-27","ammoCapacity":540,"productCategory":"LongGuns","equipTime":1.1,"zoomProps":[[]],"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":28,"reloadTime":1.8,"multishot":1,"attacks":[{"name":"Normal Attack","isCoMult":true,"speed":4.33,"crit_chance":14,"crit_mult":2.2,"status_chance":30,"shot_type":"Projectile","shot_speed":60,"flight":60,"damage":{"Electricity":62}},{"name":"Alt-Fire Contact","ammoCost":4,"speed":1.5,"crit_chance":2,"crit_mult":2,"status_chance":44,"shot_type":"Projectile","shot_speed":60,"flight":60,"damage":{"Impact":5,"Slash":7.5,"Puncture":37.5}},{"name":"Alt-Fire Damage over Time","duration":1000,"ammoCost":4,"speed":1,"crit_chance":2,"crit_mult":2,"status_chance":44,"damage":{"Electricity":50},"falloff":{"start":0,"end":6,"reduction":0.6}},{"name":"Alt-Fire Explosion","ammoCost":4,"speed":1,"crit_chance":2,"crit_mult":2,"status_chance":44,"shot_type":"AoE","damage":{"Electricity":100},"falloff":{"start":0,"end":6,"reduction":0.6},"no_headshot_mult":true}],"name":"Alternox","imageName":"alternox.webp","tags":["Tenno"],"compTags":["PROJECTILE","ASSAULT_AMMO","AOE"],"comb":[[1,2,3]]},
  "Anku":{"masteryReq":3,"description":"Reap havoc with this full sized Tenno-crafted scythe.","blockingAngle":60,"comboDuration":5,"followThrough":0.6,"range":2.8,"windUp":1,"releaseDate":"2015-06-04","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"340","slam":{"damage":"510.00","radial":{"damage":"170.00","element":"Impact","radius":8}},"speed":1.08,"crit_chance":20,"crit_mult":2,"status_chance":10,"damage":{"Impact":25.5,"Slash":8.5,"Puncture":136}},{"name":"Slam","radius":8,"type":"s","isHeavy":false,"speed":1,"crit_chance":20,"crit_mult":2,"status_chance":10,"unique":{"force_procs":["impact"]},"damage":{"Impact":340}},{"name":"Heavy Slam","radius":9,"type":"hs","isHeavy":true,"speed":1,"crit_chance":20,"crit_mult":2,"status_chance":10,"damage":{"Blast":510}}],"name":"Anku","imageName":"anku.webp","tags":["Tenno","Incarnon"],"compTags":["SCYTHES_STANCE"]},
  "Ankyros":{"masteryReq":2,"description":"A pair of mighty gauntlets, the Ankyros were designed by the Tenno for close quarters combat. What they lack in range they make up for in speed.","blockingAngle":50,"comboDuration":5,"followThrough":0.9,"range":1.25,"windUp":0.6,"releaseDate":"2013-04-19","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"270","slam":{"damage":"270.00","radial":{"damage":"90.00","radius":8}},"speed":1.17,"crit_chance":20,"crit_mult":2,"status_chance":10,"damage":{"Impact":63,"Slash":13.5,"Puncture":13.5}},{"name":"Slam","radius":8,"type":"s","isHeavy":false,"speed":1,"crit_chance":20,"crit_mult":2,"status_chance":10,"unique":{"force_procs":["impact"]},"damage":{"Impact":180}},{"name":"Heavy Slam","radius":9,"type":"hs","isHeavy":true,"speed":1,"crit_chance":20,"crit_mult":2,"status_chance":10,"damage":{"Impact":270}}],"name":"Ankyros","imageName":"ankyros.webp","tags":["Tenno"],"compTags":["FIST_STANCE"]},
  "Arbucep (Atmo-mode)":{"masteryReq":0,"description":"Nokko's signature archgun fires six homing missiles, each bearing a payload of one of the six combined elements which detonate in an area upon impact.","releaseDate":"2025-10-15","ammoCapacity":540,"productCategory":"Archguns","zoomProps":[[]],"category":"Archgun","type":"Archgun","magazineSize":36,"reloadTime":2,"multishot":1,"attacks":[{"name":"1st Attack","isBeam":true,"speed":1.5,"crit_chance":10,"crit_mult":2.9,"status_chance":34.9,"shot_type":"Projectile","damage":{"Blast":32}},{"name":"1st Attack Radial Attack","isBeam":true,"speed":1.5,"crit_chance":10,"crit_mult":2.9,"status_chance":34.9,"shot_type":"AoE","damage":{"Blast":228},"no_headshot_mult":true},{"name":"2nd Attack","isBeam":true,"speed":1.5,"crit_chance":10,"crit_mult":2.9,"status_chance":34.9,"shot_type":"Projectile","damage":{"Corrosive":32}},{"name":"2nd Attack Radial Attack","isBeam":true,"speed":1.5,"crit_chance":10,"crit_mult":2.9,"status_chance":34.9,"shot_type":"AoE","damage":{"Corrosive":228},"no_headshot_mult":true},{"name":"3rd Attack","isBeam":true,"speed":1.5,"crit_chance":10,"crit_mult":2.9,"status_chance":34.9,"shot_type":"Projectile","damage":{"Gas":32}},{"name":"3rd Attack Radial Attack","isBeam":true,"speed":1.5,"crit_chance":10,"crit_mult":2.9,"status_chance":34.9,"shot_type":"AoE","damage":{"Gas":228},"no_headshot_mult":true},{"name":"4th Attack","isBeam":true,"speed":1.5,"crit_chance":10,"crit_mult":2.9,"status_chance":34.9,"shot_type":"Projectile","damage":{"Magnetic":32}},{"name":"4th Attack Radial Attack","isBeam":true,"speed":1.5,"crit_chance":10,"crit_mult":2.9,"status_chance":34.9,"shot_type":"AoE","damage":{"Magnetic":228},"no_headshot_mult":true},{"name":"5th Attack","isBeam":true,"speed":1.5,"crit_chance":10,"crit_mult":2.9,"status_chance":34.9,"shot_type":"Projectile","damage":{"Radiation":32}},{"name":"5th Attack Radial Attack","isBeam":true,"speed":1.5,"crit_chance":10,"crit_mult":2.9,"status_chance":34.9,"shot_type":"AoE","damage":{"Radiation":228},"no_headshot_mult":true},{"name":"6th Attack","isBeam":true,"speed":1.5,"crit_chance":10,"crit_mult":2.9,"status_chance":34.9,"shot_type":"Projectile","damage":{"Viral":32}},{"name":"6th Attack Radial Attack","isBeam":true,"speed":1.5,"crit_chance":10,"crit_mult":2.9,"status_chance":34.9,"shot_type":"AoE","damage":{"Viral":228},"no_headshot_mult":true}],"name":"Arbucep (Atmo-mode)","imageName":"Arbucep.webp","tags":[],"compTags":[],"comb":[[0,1,2,3,4,5,6,7,8,9,10,11]]},
  "Arca Scisco":{"masteryReq":10,"description":"This scoped pistol analyzes strikes, learning how to damage its targets most effectively. Achieve maximum damage output after five successive hits.","noise":"Alarming","releaseDate":"2017-09-09","ammoCapacity":288,"productCategory":"Pistols","zoomProps":[[],[]],"category":"Secondary","trigger":"Semi","type":"Pistol","magazineSize":36,"reloadTime":2.2,"multishot":1,"attacks":[{"name":"Normal Attack","speed":4.667,"crit_chance":18,"crit_mult":1.6,"status_chance":26,"shot_type":"Hit-Scan","damage":{"Slash":24,"Puncture":36}}],"name":"Arca Scisco","imageName":"arca-scisco.webp","tags":["Corpus"],"compTags":[]},
  "Arbucep (Arch-mode)":{"masteryReq":0,"description":"Nokko's signature archgun fires six homing missiles, each bearing a payload of one of the six combined elements which detonate in an area upon impact.","releaseDate":"2025-10-15","ammoCapacity":0,"productCategory":"Archguns","zoomProps":[[]],"category":"Archgun","type":"Archgun","magazineSize":36,"reloadTime":1.8,"multishot":1,"attacks":[{"name":"1st Attack","isBeam":true,"speed":1.5,"crit_chance":10,"crit_mult":2.9,"status_chance":34.9,"shot_type":"Projectile","damage":{"Blast":16}},{"name":"1st Attack Radial Attack","isBeam":true,"speed":1.5,"crit_chance":10,"crit_mult":2.9,"status_chance":34.9,"shot_type":"AoE","damage":{"Blast":114},"no_headshot_mult":true},{"name":"2nd Attack","isBeam":true,"speed":1.5,"crit_chance":10,"crit_mult":2.9,"status_chance":34.9,"shot_type":"Projectile","damage":{"Corrosive":16}},{"name":"2nd Attack Radial Attack","isBeam":true,"speed":1.5,"crit_chance":10,"crit_mult":2.9,"status_chance":34.9,"shot_type":"AoE","damage":{"Corrosive":114},"no_headshot_mult":true},{"name":"3rd Attack","isBeam":true,"speed":1.5,"crit_chance":10,"crit_mult":2.9,"status_chance":34.9,"shot_type":"Projectile","damage":{"Gas":16}},{"name":"3rd Attack Radial Attack","isBeam":true,"speed":1.5,"crit_chance":10,"crit_mult":2.9,"status_chance":34.9,"shot_type":"AoE","damage":{"Gas":114},"no_headshot_mult":true},{"name":"4th Attack","isBeam":true,"speed":1.5,"crit_chance":10,"crit_mult":2.9,"status_chance":34.9,"shot_type":"Projectile","damage":{"Magnetic":16}},{"name":"4th Attack Radial Attack","isBeam":true,"speed":1.5,"crit_chance":10,"crit_mult":2.9,"status_chance":34.9,"shot_type":"AoE","damage":{"Magnetic":114},"no_headshot_mult":true},{"name":"5th Attack","isBeam":true,"speed":1.5,"crit_chance":10,"crit_mult":2.9,"status_chance":34.9,"shot_type":"Projectile","damage":{"Radiation":16}},{"name":"5th Attack Radial Attack","isBeam":true,"speed":1.5,"crit_chance":10,"crit_mult":2.9,"status_chance":34.9,"shot_type":"AoE","damage":{"Radiation":114},"no_headshot_mult":true},{"name":"6th Attack","isBeam":true,"speed":1.5,"crit_chance":10,"crit_mult":2.9,"status_chance":34.9,"shot_type":"Projectile","damage":{"Viral":16}},{"name":"6th Attack Radial Attack","isBeam":true,"speed":1.5,"crit_chance":10,"crit_mult":2.9,"status_chance":34.9,"shot_type":"AoE","damage":{"Viral":114},"no_headshot_mult":true}],"reloadRate":50,"reloadDelay":1,"name":"Arbucep (Arch-mode)","imageName":"Arbucep.webp","tags":[],"compTags":["BATTERY"],"comb":[[0,1,2,3,4,5,6,7,8,9,10,11]]},
  "Ankyros Prime":{"masteryReq":8,"description":"This Orokin variation of the Ankyros is superior to its successor in every way.","blockingAngle":50,"comboDuration":5,"followThrough":0.9,"range":1.25,"windUp":0.6,"releaseDate":"2014-03-06","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"384","slam":{"damage":"384.00","radial":{"damage":"128.00","radius":8}},"speed":1.25,"crit_chance":28,"crit_mult":2.4,"status_chance":16,"damage":{"Impact":89.6,"Slash":19.2,"Puncture":19.2}},{"name":"Slam","radius":8,"type":"s","isHeavy":false,"speed":1,"crit_chance":28,"crit_mult":2.4,"status_chance":16,"unique":{"force_procs":["impact"]},"damage":{"Impact":256}},{"name":"Heavy Slam","radius":9,"type":"hs","isHeavy":true,"speed":1,"crit_chance":28,"crit_mult":2.4,"status_chance":16,"damage":{"Impact":384}}],"name":"Ankyros Prime","imageName":"ankyros-prime.webp","tags":["Prime","Vaulted"],"compTags":["FIST_STANCE"]},
  "Arca Titron":{"masteryReq":10,"description":"Each successive kill from this massive electron hammer builds an electron charge that is unleashed on slam attacks.","blockingAngle":50,"comboDuration":5,"followThrough":0.4,"range":2.6,"windUp":1.2,"releaseDate":"2017-09-09","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"720","slam":{"damage":"1080.00","radial":{"damage":"360.00","element":"Electricity","radius":9}},"speed":0.733,"crit_chance":24,"crit_mult":2,"status_chance":38,"damage":{"Impact":234,"Slash":126}},{"name":"Slam","radius":9,"type":"s","isHeavy":false,"speed":1,"crit_chance":24,"crit_mult":2,"status_chance":38,"unique":{"force_procs":["electricity","impact"]},"damage":{"Electricity":720}},{"name":"Heavy Slam","radius":10,"type":"hs","isHeavy":true,"speed":1,"crit_chance":24,"crit_mult":2,"status_chance":38,"unique":{"force_procs":["electricity"]},"damage":{"Electricity":1080}}],"name":"Arca Titron","imageName":"arca-titron.webp","tags":["Corpus"],"compTags":["HAMMERS_STANCE"]},
  "Artemis Bow (Ivara)":{"masteryReq":0,"description":"The Artemis Bow is Ivara's and Ivara Prime's signature Exalted Weapon","noise":"Silent","releaseDate":"2018-06-15","ammoCapacity":262,"productCategory":"LongGuns","category":"Primary","trigger":"Charge","type":"Exalted Weapon","magazineSize":1,"reloadTime":0.9,"multishot":7,"attacks":[{"name":"Base Uncharged Shot","multishot":7,"punch_through":1,"speed":1,"crit_chance":25,"crit_mult":2,"status_chance":20,"shot_type":"Projectile","shot_speed":100,"damage":{"Impact":33.6,"Slash":192,"Puncture":14.4}},{"name":"Base Charged Shot","multishot":7,"punch_through":1,"speed":1,"crit_chance":25,"crit_mult":2,"status_chance":20,"shot_type":"Projectile","shot_speed":100,"damage":{"Impact":33.6,"Slash":192,"Puncture":14.4},"charge_time":1},{"name":"Concentrated Arrow Uncharged Shot","multishot":1,"speed":1,"crit_chance":25,"crit_mult":2,"status_chance":20,"shot_type":"Projectile","shot_speed":150,"unique":{"force_procs":["impact"],"crit_chance_weakp":0.5},"damage":{"Impact":33.6,"Slash":192,"Puncture":14.4}},{"name":"Concentrated Arrow Uncharged Headshot Explosion","multishot":1,"speed":1,"crit_chance":25,"crit_mult":2,"status_chance":20,"shot_type":"AoE","unique":{"force_procs":["impact"]},"damage":{"Blast":500},"no_headshot_mult":true,"charge_time":1},{"name":"Concentrated Arrow Charged Shot","multishot":1,"speed":1,"crit_chance":50,"crit_mult":2,"status_chance":20,"shot_type":"Projectile","shot_speed":150,"unique":{"force_procs":["impact"],"crit_chance_weakp":0.5},"damage":{"Impact":33.6,"Slash":192,"Puncture":14.4},"charge_time":1},{"name":"Concentrated Arrow Charged Headshot Explosion","multishot":1,"speed":1,"crit_chance":50,"crit_mult":2,"status_chance":20,"shot_type":"AoE","unique":{"force_procs":["impact"]},"damage":{"Blast":500},"no_headshot_mult":true,"charge_time":1}],"name":"Artemis Bow (Ivara)","imageName":"ArtemisBow.webp","tags":[""],"compTags":["POWER_WEAPON","PROJECTILE"],"comb":[[2,3]]},
  "Argo & Vel":{"masteryReq":0,"description":"Argo & Vel bolster the warrior who stands fast. It's Heavy Attack sends forth a glaive that ricochets off enemies.","blockingAngle":70,"comboDuration":5,"followThrough":0.6,"range":2.5,"windUp":1,"releaseDate":"2023-07-27","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","isHeavy":false,"speed":0.8,"crit_chance":32,"crit_mult":2.4,"status_chance":24,"damage":{"Impact":60,"Slash":240}},{"name":"Heavy Attack Glaive","isHeavy":true,"speed":0.8,"crit_chance":32,"crit_mult":2.4,"status_chance":24,"damage":{"Impact":40,"Slash":160}},{"name":"Heavy Attack Glaive AoE","range":3,"isHeavy":true,"speed":0.8,"crit_chance":32,"crit_mult":2.4,"status_chance":24,"shot_type":"AoE","damage":{"Impact":20,"Slash":80},"no_headshot_mult":true},{"name":"Slam","radius":7,"type":"s","isHeavy":false,"speed":1,"crit_chance":32,"crit_mult":2.4,"status_chance":24,"unique":{"force_procs":["impact"]},"damage":{"Slash":600}},{"name":"Heavy Slam","radius":7,"type":"hs","isHeavy":true,"speed":1,"crit_chance":32,"crit_mult":2.4,"status_chance":24,"damage":{"Slash":900}}],"name":"Argo & Vel","imageName":"ArgoAndVel.webp","tags":["Tenno"],"compTags":["SWORDS_AND_SHIELD_STANCE"]},
  "Arca Plasmor":{"masteryReq":10,"description":"Stagger targets with blasts from this Corpus engineered plasma shotgun. Surviving enemies are consumed with radiation.","noise":"Alarming","releaseDate":"2017-09-09","ammoCapacity":50,"productCategory":"LongGuns","zoomProps":[[]],"category":"Primary","trigger":"Semi","type":"Shotgun","magazineSize":10,"reloadTime":2.8,"multishot":1,"attacks":[{"name":"Normal Attack","isCoMult":true,"speed":1.1,"crit_chance":22,"crit_mult":1.6,"status_chance":28,"shot_type":"Projectile","shot_speed":60,"flight":60,"unique":{"force_procs":["impact"]},"damage":{"Radiation":600},"falloff":{"start":10,"end":20,"reduction":0.6667},"no_headshot_mult":true}],"name":"Arca Plasmor","imageName":"arca-plasmor.webp","tags":["Corpus"],"compTags":[]},
  "Argonak":{"masteryReq":7,"description":"Pick off targets by highlighting distant enemies using this Grineer rifle's advanced laser sighting system. Deadly in both single fire and automatic modes.","noise":"Alarming","releaseDate":"2017-10-12","ammoCapacity":473,"productCategory":"LongGuns","equipTime":1.1,"zoomProps":[[]],"category":"Primary","trigger":"Semi","type":"Rifle","magazineSize":43,"reloadTime":2.4000001,"multishot":1,"attacks":[{"name":"Full Auto Mode","speed":6,"crit_chance":9,"crit_mult":1.5,"status_chance":27,"shot_type":"Hit-Scan","damage":{"Impact":24.51,"Slash":26.22,"Puncture":6.27}},{"name":"Semi-Auto Mode","speed":4.33,"crit_chance":27,"crit_mult":2.3,"status_chance":19,"shot_type":"Hit-Scan","damage":{"Impact":24.51,"Slash":26.22,"Puncture":6.27}}],"name":"Argonak","imageName":"argonak.webp","tags":[],"compTags":["ASSAULT_AMMO"]},
  "Arquebex":{"masteryReq":0,"description":"The pinnacle of Entrati weapons design: dual energy mortars that fire with such devastating power that the Necramech must first be locked into a brace, stationary turret mode.","releaseDate":"2020-08-25","ammoCapacity":0,"productCategory":"Archguns","zoomProps":[[]],"category":"Exalted Weapon","type":"Archgun","magazineSize":10,"reloadTime":3,"multishot":1,"attacks":[{"name":"Normal Attack","speed":3.33,"crit_chance":50,"crit_mult":3,"status_chance":50,"shot_type":"Projectile","damage":{"Impact":10}},{"name":"Radial Attack","speed":3.33,"crit_chance":50,"crit_mult":3,"status_chance":50,"shot_type":"AoE","damage":{"Blast":9000,"Heat":3000},"no_headshot_mult":true}],"name":"Arquebex","imageName":"Arquebex.webp","tags":[""],"compTags":[""],"comb":[[0,1]]},
  "Arum Spinosa":{"masteryReq":11,"description":"Slash through enemies with two leaves of the exceedingly rare Arum Spinosa plant. Heavy Attack to whip a flurry of toxic spines at ranged attackers.","blockingAngle":55,"comboDuration":5,"followThrough":0.7,"range":1.7,"windUp":0.5,"releaseDate":"2020-11-19","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"297","slam":{"damage":"594.00","radial":{"damage":"297.00","radius":5}},"isHeavy":false,"speed":1.08,"crit_chance":9,"crit_mult":1.9,"status_chance":37,"damage":{"Impact":35.64,"Slash":201.96,"Puncture":59.4}},{"name":"First Heavy Attack - Toxic Spines","multishot":18,"type":"h","isHeavy":true,"speed":2,"crit_chance":9,"crit_mult":1.7,"status_chance":6.16,"shot_type":"Projectile","shot_speed":49,"flight":49,"damage":{"Impact":17.5,"Slash":57.5,"Puncture":27.5,"Toxin":72.5},"charge_time":0.5},{"name":"Second Heavy Attack - Toxic Spines","multishot":9,"type":"h","isHeavy":true,"speed":2,"crit_chance":9,"crit_mult":1.7,"status_chance":12.3,"shot_type":"Projectile","shot_speed":49,"flight":49,"damage":{"Impact":35,"Slash":115,"Puncture":55,"Toxin":145},"charge_time":0.5},{"name":"Slam","radius":5,"type":"s","isHeavy":false,"speed":1,"crit_chance":9,"crit_mult":1.9,"status_chance":37,"unique":{"force_procs":["impact"]},"damage":{"Impact":594}},{"name":"Heavy Slam","radius":6,"type":"hs","isHeavy":true,"speed":1,"crit_chance":9,"crit_mult":1.9,"status_chance":37,"damage":{"Blast":891}}],"name":"Arum Spinosa","imageName":"arum-spinosa.webp","tags":["Infested"],"compTags":["WARFAN_STANCE"]},
  "Athodai":{"masteryReq":10,"description":"Reverse-engineered from propulsion tech this hand-cannon packs a kick. Headshots kills trigger Overdrive, locking off secondary functions while maximizing your fire rate and ammo efficiency for a short time.","noise":"Alarming","releaseDate":"2020-08-01","ammoCapacity":48,"productCategory":"Pistols","zoomProps":[[]],"category":"Secondary","trigger":"Auto","type":"Pistol","magazineSize":24,"reloadTime":2,"multishot":1,"attacks":[{"name":"Normal Attack","ammoCost":1,"speed":5,"crit_chance":32,"crit_mult":2,"status_chance":8,"shot_type":"Hit-Scan","unique":{"WITH_COND":{"speed":1,"ammoEff":1}},"damage":{"Puncture":22,"Heat":48}},{"name":"Alt-Fire","ammoCost":"all","punch_through":2,"speed":12,"crit_chance":18,"crit_mult":2,"status_chance":24,"shot_type":"Discharge","damage":{"Heat":88}}],"name":"Athodai","imageName":"athodai.webp","tags":["Tenno"],"compTags":["TNJETTURBINEPISTOL"]},
  "Astilla":{"masteryReq":10,"description":"Blast enemies with glass slugs that devastate on impact. In Gara's hands, this signature weapon has a larger Ammo Pool.","noise":"Alarming","releaseDate":"2017-10-12","ammoCapacity":112,"productCategory":"LongGuns","equipTime":1.1,"category":"Primary","trigger":"Auto","type":"Shotgun","magazineSize":16,"reloadTime":2,"multishot":1,"attacks":[{"name":"Slug Impact","speed":4.33,"crit_chance":17,"crit_mult":1.9,"status_chance":33,"shot_type":"Projectile","shot_speed":120,"flight":120,"unique":{"force_procs":["impact"]},"damage":{"Impact":70},"falloff":{"start":30,"end":60,"reduction":0.5}},{"name":"Glass Explosion","speed":4.33,"crit_chance":17,"crit_mult":1.9,"status_chance":33,"shot_type":"AoE","damage":{"Slash":78,"Puncture":42},"falloff":{"start":0,"end":2.4,"reduction":0.3},"no_headshot_mult":true}],"name":"Astilla","imageName":"astilla.webp","tags":["Tenno"],"compTags":["PROJECTILE"],"comb":[[0,1]]},
  "Astilla Prime":{"masteryReq":14,"description":"Loose explosive glass slugs that tear through enemies with Gara’s signature shotgun, presented here in its spectacular Prime form.","noise":"Alarming","releaseDate":"2021-05-26","ammoCapacity":120,"productCategory":"LongGuns","equipTime":1.1,"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":24,"reloadTime":2,"multishot":1,"attacks":[{"name":"Slug Impact","speed":4.33,"crit_chance":21,"crit_mult":1.9,"status_chance":37,"shot_type":"Projectile","shot_speed":120,"flight":120,"unique":{"force_procs":["impact"]},"damage":{"Impact":100},"falloff":{"start":30,"end":60,"reduction":0.5}},{"name":"Glass Explosion","speed":4.33,"crit_chance":21,"crit_mult":1.9,"status_chance":37,"shot_type":"AoE","damage":{"Slash":91,"Puncture":49},"falloff":{"start":0,"end":2.4,"reduction":0.3},"no_headshot_mult":true}],"name":"Astilla Prime","imageName":"astilla-prime.webp","tags":["Prime"],"compTags":["PROJECTILE"],"comb":[[0,1]]},
  "Athodai Prime":{"masteryReq":10,"description":"Unleash the song of the righteous warrior with this gilded pistol that goes into Overdrive on headshot kills, maximizing fire rate and ammo efficiency for a short time.","noise":"Alarming","releaseDate":"2026-06-17","ammoCapacity":48,"productCategory":"Pistols","zoomProps":[[]],"category":"Secondary","trigger":"Auto","type":"Pistol","magazineSize":24,"reloadTime":2,"multishot":1,"attacks":[{"name":"Normal Attack","speed":5,"crit_chance":40,"crit_mult":2,"status_chance":10,"shot_type":"Hit-Scan","unique":{"WITH_COND":{"speed":1,"ammoEff":1}},"damage":{"Puncture":24,"Heat":56}},{"name":"Alt-Fire","ammoCost":"all","punch_through":2,"speed":12,"crit_chance":20,"crit_mult":2.5,"status_chance":24,"shot_type":"Discharge","damage":{"Heat":88}}],"name":"Athodai Prime","imageName":"AthodaiPrime.webp","tags":[],"compTags":["TNJETTURBINEPISTOL"]},
  "Azima":{"masteryReq":6,"description":"This intricate automatic pistol is able to fire its magazine which then spins in the air for a short time, firing lasers at nearby enemies.","noise":"Alarming","releaseDate":"2016-03-04","ammoCapacity":525,"productCategory":"Pistols","category":"Secondary","trigger":"Auto","type":"Pistol","magazineSize":75,"reloadTime":1.4,"multishot":1,"attacks":[{"name":"Normal Attack","speed":10,"crit_chance":16,"crit_mult":2,"status_chance":16,"shot_type":"Hit-Scan","damage":{"Impact":2,"Slash":13,"Puncture":5}},{"name":"Turret Expiry","speed":10,"crit_chance":16,"crit_mult":2,"status_chance":16,"damage":{"Blast":75}}],"name":"Azima","imageName":"azima.webp","tags":["Tenno"],"compTags":[]},
  "Attica":{"masteryReq":7,"description":"Quickly fire off a volley of deadly bolts with the Attica repeating crossbow.","noise":"Silent","releaseDate":"2014-04-09","ammoCapacity":540,"productCategory":"LongGuns","equipTime":1.1,"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":20,"reloadTime":2.8299999,"multishot":1,"attacks":[{"name":"Normal Attack","speed":3.67,"crit_chance":25,"crit_mult":3,"status_chance":10,"shot_type":"Projectile","shot_speed":90,"flight":90,"damage":{"Impact":4,"Slash":16,"Puncture":60}}],"name":"Attica","imageName":"attica.webp","tags":["Tenno"],"compTags":["PROJECTILE","ATTICA","CROSSBOW"]},
  "Atomos":{"masteryReq":5,"description":"This particle cannon generates a condensed beam of super-heated plasma designed to melt rock to ore, and enemies to molten slag.","noise":"Alarming","releaseDate":"2015-05-12","ammoCapacity":350,"productCategory":"Pistols","zoomProps":[[]],"category":"Secondary","trigger":"Held","type":"Pistol","magazineSize":70,"reloadTime":2,"multishot":1,"attacks":[{"name":"Normal Attack","isBeam":true,"speed":8,"crit_chance":15,"crit_mult":1.7,"status_chance":21,"shot_type":"Discharge","damage":{"Heat":29}},{"name":"Incarnon Form","isInc":1,"speed":1.5,"crit_chance":18,"crit_mult":3,"status_chance":41,"shot_type":"Projectile","damage":{"Impact":100}},{"name":"Incarnon Form Radial Attack","isInc":1,"speed":1.5,"crit_chance":18,"crit_mult":3,"status_chance":41,"shot_type":"AoE","damage":{"Blast":450},"no_headshot_mult":true}],"incMagazineSize":21,"name":"Atomos","imageName":"atomos.webp","tags":["Grineer","Incarnon"],"compTags":["BEAM"],"comb":[[1,2]]},
  "Azothane":{"masteryReq":0,"description":"Azothane calls the visionary warrior to turn the tides of battle. Block and melee attack at the same time to plunge Azothane into the ground, damaging nearby enemies with a shockwave and adding to the combo counter.","blockingAngle":55,"comboDuration":5,"followThrough":0.7,"range":3.2,"windUp":0.7,"productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":1.17,"crit_chance":34,"crit_mult":3,"status_chance":22,"damage":{"Impact":51.000004,"Puncture":34,"Slash":85}},{"name":"Slam","radius":7,"type":"s","isHeavy":false,"speed":1,"crit_chance":34,"crit_mult":3,"status_chance":22,"unique":{"force_procs":["impact"]},"damage":{"Impact":340}},{"name":"Heavy Slam","radius":8,"type":"hs","isHeavy":true,"speed":1,"crit_chance":34,"crit_mult":3,"status_chance":22,"damage":{"Blast":510}}],"name":"Azothane","imageName":"azothane.webp","tags":[""],"compTags":["LONG_KATANA_STANCE"]},
  "Atterax":{"masteryReq":5,"description":"A multi-bladed whip that is adept at flaying skin from bone. In extreme cases, disobedient Grineer are sentenced to death by Atterax.","blockingAngle":45,"comboDuration":5,"followThrough":0.5,"range":2.4963856,"windUp":0.4,"releaseDate":"2014-09-17","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","slide":"258","slam":{"damage":"387.00","radial":{"damage":"129.00","element":"Slash","radius":5}},"speed":0.917,"crit_chance":25,"crit_mult":3,"status_chance":20,"damage":{"Impact":6.45,"Slash":116.1,"Puncture":6.45}},{"name":"Slam","radius":5,"type":"s","isHeavy":false,"speed":1,"crit_chance":25,"crit_mult":3,"status_chance":20,"unique":{"force_procs":["impact"]},"damage":{"Slash":258}},{"name":"Heavy Slam","radius":6,"type":"hs","isHeavy":true,"speed":1,"crit_chance":25,"crit_mult":3,"status_chance":20,"damage":{"Blast":387}}],"name":"Atterax","imageName":"atterax.webp","tags":["Grineer"],"compTags":["WHIPS_STANCE"]},
  "Balla (Dagger)":{"masteryReq":0,"description":"","comboDuration":5,"range":1,"windUp":1,"releaseDate":"2017-10-12","productCategory":"Melee","category":"Melee","type":"Zaw Component","multishot":1,"attacks":[{"name":"Balla Strike","speed":1,"crit_chance":18,"crit_mult":2,"status_chance":18,"damage":{"Impact":11.2,"Slash":78.4,"Puncture":134.4}}],"name":"Balla (Dagger)","imageName":"balla.webp","tags":[],"compTags":["DAGGERS_STANCE"]},
  "Balla (Staff)":{"masteryReq":0,"description":"","comboDuration":5,"range":1,"windUp":1,"releaseDate":"2017-10-12","productCategory":"Melee","category":"Melee","type":"Zaw Component","multishot":1,"attacks":[{"name":"Balla Strike","speed":1,"crit_chance":18,"crit_mult":2,"status_chance":18,"damage":{"Impact":11.2,"Slash":78.4,"Puncture":134.4}}],"name":"Balla (Staff)","imageName":"balla.webp","tags":[],"compTags":["STAVES_STANCE"]},
  "Ballistica Prime":{"masteryReq":14,"description":"The beauty of this luxuriously gilded crossbow cannot obscure its lethal purpose.","noise":"Silent","releaseDate":"2017-08-29","ammoCapacity":320,"productCategory":"Pistols","category":"Secondary","trigger":"Charge","type":"Pistol","magazineSize":8,"reloadTime":1.2,"multishot":4,"attacks":[{"name":"Normal Shot","ammoCost":4,"speed":3.33,"crit_chance":20,"crit_mult":2,"status_chance":15,"shot_type":"Projectile","shot_speed":70,"flight":70,"damage":{"Impact":2,"Slash":16,"Puncture":22}},{"name":"Charged Shot","ammoCost":4,"speed":3.33,"crit_chance":20,"crit_mult":2,"status_chance":15,"shot_type":"Projectile","shot_speed":140,"flight":140,"damage":{"Impact":3.8,"Slash":30.4,"Puncture":41.8},"charge_time":0.8},{"name":"Incarnon Form","isInc":1,"speed":3.33,"crit_chance":30,"crit_mult":2.5,"status_chance":30,"shot_type":"Projectile","shot_speed":80,"damage":{"Slash":830},"charge_time":0.4}],"incMagazineSize":18,"name":"Ballistica Prime","imageName":"ballistica-prime.webp","tags":["Prime","Incarnon"],"compTags":["PROJECTILE","CROSSBOW"]},
  "Ballistica":{"masteryReq":2,"description":"The Ballistica crossbow features a unique dual firing mechanism. Choose between a four bolt volley or a deadly accurate charged shot.","noise":"Silent","releaseDate":"2013-10-16","productCategory":"Pistols","category":"Secondary","trigger":"Charge","type":"Pistol","magazineSize":16,"reloadTime":2,"multishot":1,"attacks":[{"name":"Charged Shot","speed":3.33,"crit_chance":15,"crit_mult":1.5,"status_chance":10,"shot_type":"Projectile","shot_speed":100,"flight":100,"damage":{"Impact":10,"Slash":10,"Puncture":80},"charge_time":1},{"name":"Burst Shot","speed":6.67,"crit_chance":3.75,"crit_mult":1.5,"status_chance":7.5,"shot_type":"Projectile","shot_speed":100,"flight":100,"damage":{"Impact":2.5,"Slash":2.5,"Puncture":20},"burst_count":4,"burst_delay":0.05},{"name":"Incarnon Form","isInc":1,"speed":3.33,"crit_chance":20,"crit_mult":2,"status_chance":20,"shot_type":"Projectile","shot_speed":80,"damage":{"Slash":640},"charge_time":0.4}],"incMagazineSize":18,"name":"Ballistica","imageName":"ballistica.webp","tags":["Tenno","Incarnon"],"compTags":["PROJECTILE","CROSSBOW"]},
  "Baza":{"masteryReq":7,"description":"Make easy prey of enemies with this quiet, agile, and pinpoint accurate Tenno submachine gun.","noise":"Silent","releaseDate":"2017-11-23","ammoCapacity":800,"productCategory":"LongGuns","zoomProps":[[]],"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":40,"reloadTime":1.4,"multishot":1,"attacks":[{"name":"Normal Attack","speed":16.67,"crit_chance":26,"crit_mult":3,"status_chance":10,"shot_type":"Hit-Scan","damage":{"Impact":5.76,"Slash":3.52,"Puncture":6.72},"falloff":{"start":22,"end":34,"reduction":0.5}}],"name":"Baza","imageName":"baza.webp","tags":["Tenno"],"compTags":["ASSAULT_AMMO"]},
  "Battacor":{"masteryReq":10,"description":"A weapon that builds charge the more it kills. Hit capacity then release for an obliterating discharge of power.","noise":"Alarming","releaseDate":"2018-11-08","ammoCapacity":720,"productCategory":"LongGuns","equipTime":1.1,"zoomProps":[[]],"category":"Primary","trigger":"Auto Burst","type":"Rifle","magazineSize":60,"reloadTime":2,"multishot":1,"attacks":[{"name":"Normal Attack","isCoMult":true,"punch_through":2,"speed":2.5,"crit_chance":32,"crit_mult":2.4,"status_chance":18,"shot_type":"Projectile","shot_speed":120,"flight":120,"damage":{"Puncture":24,"Magnetic":42},"burst_count":2,"burst_delay":0.08},{"name":"Secondary Fire","punch_through":2,"speed":5,"crit_chance":34,"crit_mult":3,"status_chance":8,"shot_type":"Hit-Scan","damage":{"Radiation":208},"charge_time":0.4},{"name":"Beam AoE","speed":5,"crit_chance":20,"crit_mult":2,"status_chance":50,"shot_type":"AoE","damage":{"Radiation":208},"falloff":{"start":0,"end":3.4,"reduction":0.4},"no_headshot_mult":true,"charge_time":0.4}],"name":"Battacor","imageName":"battacor.webp","tags":["Corpus"],"compTags":["PROJECTILE","ASSAULT_AMMO"],"comb":[[1,2]]},
  "Basmu":{"masteryReq":11,"description":"This Sentient war instrument can either barrage targets with explosive bolts, or, draw on its regenerative battery to create twin plasma beams that chain through targets. When fully drained, Health is leached from nearby foes for a short period.","noise":"Alarming","releaseDate":"2020-03-24","ammoCapacity":"Infinity","productCategory":"LongGuns","equipTime":1.1,"zoomProps":[[]],"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":21,"reloadTime":0.7,"multishot":1,"attacks":[{"name":"Auto","isCoMult":true,"speed":12,"crit_chance":15,"crit_mult":2,"status_chance":29,"shot_type":"Projectile","shot_speed":120,"flight":120,"damage":{"Electricity":39}},{"name":"Radial Attack","speed":12,"crit_chance":15,"crit_mult":2,"status_chance":29,"shot_type":"AoE","damage":{"Heat":19},"falloff":{"start":0,"end":1.7,"reduction":0.2},"no_headshot_mult":true},{"name":"Held","multishot":2,"isBeam":true,"speed":12,"crit_chance":2,"crit_mult":4.8,"status_chance":30,"shot_type":"Discharge","damage":{"Electricity":12}}],"reloadRate":42,"reloadDelay":0.2,"name":"Basmu","imageName":"basmu.webp","tags":["Sentient"],"compTags":["ASSAULT_AMMO","PROJECTILE","AOE","BASMU"],"comb":[[0,1]]},
  "Balefire Charger (Hildryn)":{"masteryReq":0,"description":"The Balefire Charger is Hildryn's and Hildryn Prime's signature Exalted Weapon.","noise":"Alarming","releaseDate":"2019-03-08","ammoCapacity":"Infinity","productCategory":"LongGuns","category":"Secondary","trigger":"Charge","type":"Exalted Weapon","magazineSize":999999,"reloadTime":0,"multishot":1,"attacks":[{"name":"Uncharged Shot","speed":0.83,"crit_chance":5,"crit_mult":1.5,"status_chance":10,"shot_type":"AoE","shot_speed":80,"damage":{"Electricity":500},"no_headshot_mult":true},{"name":"Charged Shot","speed":0.83,"crit_chance":5,"crit_mult":1.5,"status_chance":10,"shot_type":"AoE","shot_speed":80,"damage":{"Electricity":1500},"no_headshot_mult":true,"charge_time":2},{"name":"Alt-Fire Shot (note: need use +base dmg to emulate shield)","range":3,"speed":0.75,"crit_chance":5,"crit_mult":1.5,"status_chance":10,"shot_type":"AoE","damage":{"Electricity":1500},"no_headshot_mult":true,"burst_count":4,"burst_delay":0.4}],"hasInfiniteMagazine":true,"name":"Balefire Charger (Hildryn)","imageName":"BalefireCharger.webp","tags":[""],"compTags":["POWER_WEAPON"]},
  "Baza Prime":{"masteryReq":10,"description":"This rapid-fire classic is the Orokin-engineered definition of silent, pinpoint lethality.","noise":"Silent","releaseDate":"2019-12-17","ammoCapacity":840,"productCategory":"LongGuns","equipTime":1.1,"zoomProps":[[]],"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":60,"reloadTime":1.1,"multishot":1,"attacks":[{"name":"Normal Attack","speed":16.67,"crit_chance":28,"crit_mult":3,"status_chance":14,"shot_type":"Hit-Scan","damage":{"Impact":5.76,"Slash":3.52,"Puncture":6.72},"falloff":{"start":30,"end":60,"reduction":0.5}}],"name":"Baza Prime","imageName":"baza-prime.webp","tags":["Prime"],"compTags":["ASSAULT_AMMO"]},
  "Bo":{"masteryReq":4,"description":"A two-handed, reinforced staff that can send multiple enemies airborne.","blockingAngle":60,"comboDuration":5,"followThrough":0.5,"range":3,"windUp":0.5,"releaseDate":"2012-10-25","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","slide":"140","slam":{"damage":"420.00","radial":{"damage":"140.00","radius":6}},"speed":1,"crit_chance":12.5,"crit_mult":2,"status_chance":20,"damage":{"Impact":126,"Puncture":14}},{"name":"Slam","radius":6,"type":"s","isHeavy":false,"speed":1,"crit_chance":12.5,"crit_mult":2,"status_chance":20,"unique":{"force_procs":["impact"]},"damage":{"Impact":280}},{"name":"Heavy Slam","radius":7,"type":"hs","isHeavy":true,"speed":1,"crit_chance":12.5,"crit_mult":2,"status_chance":20,"damage":{"Blast":420}}],"name":"Bo","imageName":"bo.webp","tags":["Tenno","Incarnon"],"compTags":["STAVES_STANCE"]},
  "Bo Prime":{"masteryReq":5,"description":"A classic Orokin weapon, Bo Prime creates elegant fury on the battlefield.","blockingAngle":60,"comboDuration":5,"followThrough":0.5,"range":3,"windUp":0.5,"releaseDate":"2014-06-11","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"176","slam":{"damage":"528.00","radial":{"damage":"176.00","element":"Impact","radius":6}},"speed":1.08,"crit_chance":24,"crit_mult":2.6,"status_chance":32,"damage":{"Impact":158.4,"Puncture":17.6}},{"name":"Slam","radius":6,"type":"s","isHeavy":false,"speed":1,"crit_chance":24,"crit_mult":2.6,"status_chance":32,"unique":{"force_procs":["impact"]},"damage":{"Impact":352}},{"name":"Heavy Slam","radius":7,"type":"hs","isHeavy":true,"speed":1,"crit_chance":24,"crit_mult":2.6,"status_chance":32,"damage":{"Blast":528}}],"name":"Bo Prime","imageName":"bo-prime.webp","tags":["Prime","Vaulted","Incarnon"],"compTags":["STAVES_STANCE"]},
  "Boar":{"masteryReq":2,"description":"A shotgun with low accuracy and strong recoil, but able to deliver its payload in full-auto. The Boar is best used at close range.","noise":"Alarming","releaseDate":"2012-10-25","ammoCapacity":120,"productCategory":"LongGuns","zoomProps":[[]],"category":"Primary","trigger":"Auto","type":"Shotgun","magazineSize":20,"reloadTime":2.7,"multishot":8,"attacks":[{"name":"Normal Attack","speed":4.17,"crit_chance":10,"crit_mult":1.5,"status_chance":7.5,"shot_type":"Hit-Scan","damage":{"Impact":12.1,"Slash":6.6,"Puncture":3.3},"falloff":{"start":15,"end":25,"reduction":0.5}},{"name":"Incarnon Form","multishot":1,"isBeam":true,"isInc":1,"speed":7.5,"crit_chance":18,"crit_mult":1.8,"status_chance":20,"damage":{"Heat":20}}],"incMagazineSize":150,"name":"Boar","imageName":"boar.webp","tags":["Tenno","Incarnon"],"compTags":[]},
  "Boltor Prime":{"masteryReq":13,"description":"Fires Orokin designed bolts that are faster and sharper.","noise":"Alarming","releaseDate":"2014-03-06","ammoCapacity":540,"productCategory":"LongGuns","equipTime":1.1,"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":60,"reloadTime":2.4000001,"multishot":1,"attacks":[{"name":"Normal Attack","speed":10,"crit_chance":12,"crit_mult":2,"status_chance":34,"shot_type":"Projectile","shot_speed":120,"flight":120,"damage":{"Impact":4.6,"Puncture":41.4}},{"name":"Incarnon Form","multishot":3,"isInc":1,"speed":11.33,"crit_chance":24,"crit_mult":3,"status_chance":20,"shot_type":"Projectile","damage":{"Impact":2.4,"Slash":14.4,"Puncture":7.2}}],"incMagazineSize":160,"name":"Boltor Prime","imageName":"boltor-prime.webp","tags":["Prime","Vaulted","Incarnon"],"compTags":["PROJECTILE","ASSAULT_AMMO"]},
  "Brakk":{"masteryReq":6,"description":"Simple but powerful. The semi-automatic Brakk hand cannon delivers a lot of punch in a small package.","noise":"Alarming","releaseDate":"2013-10-30","productCategory":"Pistols","category":"Secondary","trigger":"Semi","type":"Pistol","magazineSize":5,"reloadTime":1.05,"multishot":10,"attacks":[{"name":"Normal Attack","speed":5,"crit_chance":17,"crit_mult":2,"status_chance":5.1,"shot_type":"Hit-Scan","damage":{"Impact":9,"Slash":6,"Puncture":5},"falloff":{"start":11,"end":22,"reduction":0.6}}],"name":"Brakk","imageName":"brakk.webp","tags":["Grineer"],"compTags":["SECONDARYSHOTGUN","SINGLESHOT"]},
  "Boltor":{"masteryReq":2,"description":"The Boltor fires slow, heavy bolts that are capable of impaling enemies to walls.","noise":"Alarming","releaseDate":"2013-01-29","ammoCapacity":540,"productCategory":"LongGuns","equipTime":1.1,"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":60,"reloadTime":2.6,"multishot":1,"attacks":[{"name":"Normal Attack","speed":8.75,"crit_chance":10,"crit_mult":1.8,"status_chance":14,"shot_type":"Projectile","shot_speed":85,"flight":85,"damage":{"Impact":2.5,"Slash":2.5,"Puncture":20}},{"name":"Incarnon Form","multishot":3,"isInc":1,"punch_through":0.6,"speed":10,"crit_chance":22,"crit_mult":2.8,"status_chance":9.3,"damage":{"Impact":1.6,"Slash":2.4,"Puncture":1.2}}],"incMagazineSize":160,"name":"Boltor","imageName":"boltor.webp","tags":["Tenno","Incarnon"],"compTags":["PROJECTILE","ASSAULT_AMMO"]},
  "Boar Prime":{"masteryReq":11,"description":"One of the finest examples of Tenno craftsmanship, the Boar Prime offers a higher Fire Rate, Magazine Capacity and a much higher per-shot damage.","noise":"Alarming","releaseDate":"2013-09-13","ammoCapacity":120,"productCategory":"LongGuns","zoomProps":[[]],"category":"Primary","trigger":"Auto","type":"Shotgun","magazineSize":20,"reloadTime":2.75,"multishot":8,"attacks":[{"name":"Normal Attack","speed":4.67,"crit_chance":15,"crit_mult":2,"status_chance":11.25,"shot_type":"Hit-Scan","damage":{"Impact":26,"Slash":8,"Puncture":6},"falloff":{"start":18,"end":25,"reduction":0.7}},{"name":"Incarnon Form","multishot":1,"isBeam":true,"isInc":1,"speed":8,"crit_chance":20,"crit_mult":2.2,"status_chance":24,"damage":{"Heat":30}}],"incMagazineSize":150,"name":"Boar Prime","imageName":"boar-prime.webp","tags":["Prime","Vaulted","Incarnon"],"compTags":[]},
  "Boltace":{"masteryReq":4,"description":"An intimidating Tonfa set designed to match the briary design of the Boltor.","blockingAngle":60,"comboDuration":5,"followThrough":0.6,"range":2.5,"windUp":0.7,"releaseDate":"2015-05-12","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"352","slam":{"damage":"352.00","radial":{"damage":"176.00","radius":8}},"speed":0.917,"crit_chance":6,"crit_mult":1.5,"status_chance":28,"damage":{"Impact":17.6,"Slash":17.6,"Puncture":140.8}},{"name":"Slam","radius":8,"type":"s","isHeavy":false,"speed":1,"crit_chance":6,"crit_mult":1.5,"status_chance":28,"unique":{"force_procs":["impact"]},"damage":{"Impact":352}},{"name":"Heavy Slam","radius":9,"type":"hs","isHeavy":true,"speed":1,"crit_chance":6,"crit_mult":1.5,"status_chance":28,"damage":{"Blast":528}}],"name":"Boltace","imageName":"boltace.webp","tags":["Tenno"],"compTags":["TONFA_STANCE"]},
  "Bolto":{"masteryReq":7,"description":"The Bolto fires slow, heavy bolts that are capable of impaling enemies to walls.","noise":"Alarming","releaseDate":"2012-10-25","productCategory":"Pistols","category":"Secondary","trigger":"Semi","type":"Pistol","magazineSize":15,"reloadTime":1.3,"multishot":1,"attacks":[{"name":"Normal Attack","speed":3.33,"crit_chance":16,"crit_mult":2.4,"status_chance":2.2,"shot_type":"Projectile","shot_speed":75,"flight":75,"damage":{"Impact":6.4,"Puncture":57.6}}],"name":"Bolto","imageName":"bolto.webp","tags":["Tenno"],"compTags":["PROJECTILE"]},
  "Braton Prime":{"masteryReq":8,"description":"A classic Orokin weapon, Braton Prime features modified damage levels and a larger magazine over the standard model.","noise":"Alarming","releaseDate":"2013-07-13","ammoCapacity":600,"productCategory":"LongGuns","equipTime":1.1,"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":75,"reloadTime":2.1500001,"multishot":1,"attacks":[{"name":"Normal Attack","speed":9.58,"crit_chance":12,"crit_mult":2,"status_chance":26,"shot_type":"Hit-Scan","damage":{"Impact":1.75,"Slash":21,"Puncture":12.25}},{"name":"Incarnon Form","isInc":1,"speed":5.67,"crit_chance":30,"crit_mult":3,"status_chance":30,"damage":{"Impact":28,"Slash":39.2,"Puncture":2.8}},{"name":"Incarnon Form AoE","isInc":1,"speed":5.67,"crit_chance":30,"crit_mult":3,"status_chance":30,"shot_type":"AoE","damage":{"Heat":70},"no_headshot_mult":true}],"incMagazineSize":200,"name":"Braton Prime","imageName":"braton-prime.webp","tags":["Prime","Never Vaulted","Incarnon"],"compTags":["ASSAULT_AMMO"],"comb":[[1,2]]},
  "Braton":{"masteryReq":0,"description":"The Braton's high rate of fire and accuracy make it a favorite among the Tenno.","noise":"Alarming","releaseDate":"2012-10-25","ammoCapacity":540,"productCategory":"LongGuns","equipTime":1.1,"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":45,"reloadTime":2,"multishot":1,"attacks":[{"name":"Normal Attack","speed":8.75,"crit_chance":12,"crit_mult":1.6,"status_chance":6,"shot_type":"Hit-Scan","damage":{"Impact":7.92,"Slash":8.16,"Puncture":7.92}},{"name":"Incarnon Form","isInc":1,"speed":5,"crit_chance":30,"crit_mult":3,"status_chance":12,"damage":{"Impact":20,"Slash":28,"Puncture":2}},{"name":"Incarnon Form Radial Attack","isInc":1,"speed":5,"crit_chance":30,"crit_mult":3,"status_chance":12,"shot_type":"AoE","damage":{"Heat":50},"no_headshot_mult":true}],"incMagazineSize":200,"name":"Braton","imageName":"braton.webp","tags":["Tenno","Incarnon"],"compTags":["ASSAULT_AMMO"],"comb":[[1,2]]},
  "Broken War":{"masteryReq":10,"description":"A fragment of Stalker's War sword, a symbol of his defeat.","blockingAngle":55,"comboDuration":5,"followThrough":0.6,"range":2.5,"windUp":0.6,"releaseDate":"2015-12-03","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"187","slam":{"damage":"561.00","radial":{"damage":"187.00","element":"Impact","radius":7}},"speed":1,"crit_chance":35,"crit_mult":2.2,"status_chance":20,"damage":{"Impact":18.7,"Slash":149.6,"Puncture":18.7}},{"name":"Slam","radius":7,"type":"s","isHeavy":false,"speed":1,"crit_chance":35,"crit_mult":2.2,"status_chance":20,"unique":{"force_procs":["impact"]},"damage":{"Impact":374}},{"name":"Heavy Slam","radius":8,"type":"hs","isHeavy":true,"speed":1,"crit_chance":35,"crit_mult":2.2,"status_chance":20,"damage":{"Blast":561}}],"name":"Broken War","imageName":"broken-war.webp","tags":["Sentient"],"compTags":["SWORDS_STANCE"]},
  "Bronco":{"masteryReq":0,"description":"The Bronco is a small-scale shotgun that can be wielded with one hand. Only effective at close range, it has a limited Magazine Capacity.","noise":"Alarming","releaseDate":"2012-10-25","productCategory":"Pistols","category":"Secondary","trigger":"Semi","type":"Pistol","magazineSize":2,"reloadTime":1.05,"multishot":7,"attacks":[{"name":"Normal Attack","speed":5,"crit_chance":6,"crit_mult":2,"status_chance":9.43,"shot_type":"Hit-Scan","damage":{"Impact":32,"Slash":4,"Puncture":4},"falloff":{"start":7,"end":14,"reduction":0.75}},{"name":"Incarnon Form","multishot":7,"isInc":1,"speed":2.5,"crit_chance":20,"crit_mult":3,"status_chance":18.9,"damage":{"Impact":13.2,"Slash":6.6,"Puncture":2.2}}],"incMagazineSize":20,"name":"Bronco","imageName":"bronco.webp","tags":["Tenno","Incarnon"],"compTags":["SINGLESHOT","SECONDARYSHOTGUN","BRONCO"]},
  "Cadus":{"masteryReq":4,"description":"A lone Tenno once used this staff to fight back a horde of Infested.","blockingAngle":60,"comboDuration":5,"followThrough":0.5,"range":2.8,"windUp":0.5,"releaseDate":"2021-07-06","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"170","slam":{"damage":"510.00","radial":{"damage":"170.00","radius":6}},"speed":1,"crit_chance":15,"crit_mult":2,"status_chance":25,"damage":{"Impact":70,"Electricity":60}},{"name":"Slam","radius":6,"type":"s","isHeavy":false,"speed":1,"crit_chance":15,"crit_mult":2,"status_chance":25,"unique":{"force_procs":["impact"]},"damage":{"Impact":260}},{"name":"Heavy Slam","radius":7,"type":"hs","isHeavy":true,"speed":1,"crit_chance":15,"crit_mult":2,"status_chance":25,"damage":{"Blast":390}}],"name":"Cadus","imageName":"cadus.webp","tags":["Tenno"],"compTags":["STAVES_STANCE"]},
  "Burston Prime":{"masteryReq":12,"description":"Once thought lost to the ages, attempts to reengineer the Burston Prime never fully replicated this weapon's power and agility.","noise":"Alarming","releaseDate":"2013-12-19","ammoCapacity":540,"productCategory":"LongGuns","equipTime":1.1,"category":"Primary","trigger":"Burst","type":"Rifle","magazineSize":45,"reloadTime":2,"multishot":1,"attacks":[{"name":"Normal Attack","speed":5,"crit_chance":18,"crit_mult":1.8,"status_chance":30,"shot_type":"Hit-Scan","damage":{"Impact":13.8,"Slash":18.4,"Puncture":13.8},"burst_count":3,"burst_delay":0.04},{"name":"Incarnon Form","isInc":1,"speed":20,"crit_chance":28,"crit_mult":3,"status_chance":30,"shot_type":"Hit-Scan","damage":{"Heat":13}},{"name":"Incarnon Form Radial Attack","isInc":1,"speed":20,"crit_chance":28,"crit_mult":3,"status_chance":30,"shot_type":"AoE","damage":{"Heat":13},"no_headshot_mult":true}],"incMagazineSize":600,"name":"Burston Prime","imageName":"burston-prime.webp","tags":["Prime","Never Vaulted","Incarnon"],"compTags":["ASSAULT_AMMO","BURSTON_PRIME"],"comb":[[1,2]]},
  "Buzlok":{"masteryReq":11,"description":"Mark your targets and unleash a barrage of bullets, the Buzlok's homing rounds always find the enemy. Marked targets are more likely to take critical hits.","noise":"Alarming","releaseDate":"2014-09-17","ammoCapacity":540,"productCategory":"LongGuns","zoomProps":[[],[]],"category":"Primary","trigger":"Semi","type":"Rifle","magazineSize":50,"reloadTime":3,"multishot":1,"attacks":[{"name":"Normal Attack","isCoMult":true,"speed":6.25,"crit_chance":23,"crit_mult":2.5,"status_chance":21,"shot_type":"Projectile","shot_speed":80,"flight":80,"unique":{"WITH_COND":{"crit_chance":0.5}},"damage":{"Impact":30,"Slash":6,"Puncture":24}},{"name":"Beacon","isCoMult":true,"speed":1.67,"crit_chance":0,"crit_mult":1,"status_chance":0,"shot_type":"Projectile","shot_speed":200,"flight":200,"damage":{"Puncture":3}}],"name":"Buzlok","imageName":"buzlok.webp","tags":["Grineer"],"compTags":["PROJECTILE","ASSAULT_AMMO"]},
  "Burston":{"masteryReq":0,"description":"The Burston fires 3-round bursts, which provides a balance between the lethality of automatic rifles and the accuracy of semi-automatic rifles.","noise":"Alarming","releaseDate":"2012-10-25","ammoCapacity":540,"productCategory":"LongGuns","equipTime":1.1,"category":"Primary","trigger":"Burst","type":"Rifle","magazineSize":45,"reloadTime":2,"multishot":1,"attacks":[{"name":"Normal Attack","speed":5,"crit_chance":6,"crit_mult":1.6,"status_chance":18,"shot_type":"Hit-Scan","damage":{"Impact":10,"Slash":10,"Puncture":10},"burst_count":3,"burst_delay":0.061},{"name":"Incarnon Form","isInc":1,"speed":20,"crit_chance":30,"crit_mult":3,"status_chance":30,"shot_type":"Hit-Scan","damage":{"Heat":3}},{"name":"Incarnon Form Radial Attack","isInc":1,"speed":20,"crit_chance":30,"crit_mult":3,"status_chance":30,"shot_type":"AoE","damage":{"Heat":3},"no_headshot_mult":true}],"incMagazineSize":600,"name":"Burston","imageName":"burston.webp","tags":["Tenno","Incarnon"],"compTags":["ASSAULT_AMMO"],"comb":[[1,2]]},
  "Broken Scepter":{"masteryReq":7,"description":"A shattered talisman of the Grineer Elder Queen. It pulls health orbs from deceased enemies and energy orbs from destroyed robots.","blockingAngle":60,"comboDuration":5,"followThrough":0.5,"range":2.9,"windUp":0.5,"releaseDate":"2016-11-11","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","slide":"179","slam":{"damage":"537.00","radial":{"damage":"179.00","element":"Impact","radius":6}},"speed":1.25,"crit_chance":10,"crit_mult":2,"status_chance":30,"damage":{"Impact":125.3,"Slash":35.8,"Puncture":17.9}},{"name":"Slam","radius":6,"type":"s","isHeavy":false,"speed":1,"crit_chance":10,"crit_mult":2,"status_chance":30,"unique":{"force_procs":["impact"]},"damage":{"Impact":358}},{"name":"Heavy Slam","radius":7,"type":"hs","isHeavy":true,"speed":1,"crit_chance":10,"crit_mult":2,"status_chance":30,"damage":{"Blast":537}}],"name":"Broken Scepter","imageName":"broken-scepter.webp","tags":[],"compTags":["STAVES_STANCE"]},
  "Bubonico":{"masteryReq":13,"description":"Rain down a triple volley of explosive disease bladders from a distance, then move in for the kill by unloading a multi-shot barrage of toxic barbs with primary fire.","noise":"Alarming","releaseDate":"2020-11-19","ammoCapacity":"Infinity","productCategory":"LongGuns","equipTime":1.6,"zoomProps":[[]],"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":27,"reloadTime":4.5,"multishot":7,"attacks":[{"name":"Auto","isCoMult":true,"punch_through":1.9,"speed":3.83,"crit_chance":25,"crit_mult":2.3,"status_chance":9.29,"shot_type":"Projectile","shot_speed":57,"flight":57,"damage":{"Impact":2,"Slash":19,"Puncture":13,"Toxin":7},"falloff":{"start":19,"end":41,"reduction":0.5}},{"name":"Burst","isCoMult":true,"punch_through":1.9,"speed":5,"crit_chance":3,"crit_mult":3.5,"status_chance":57,"shot_type":"Projectile","shot_speed":25,"flight":25,"damage":{"Impact":9},"burst_count":3,"burst_delay":0.23},{"name":"Radial Attack","speed":5,"crit_chance":3,"crit_mult":3.5,"status_chance":57,"shot_type":"AoE","damage":{"Viral":143},"falloff":{"start":0,"end":7,"reduction":0.5},"no_headshot_mult":true,"burst_count":3,"burst_delay":0.23}],"reloadRate":9,"reloadDelay":1.5,"name":"Bubonico","imageName":"bubonico.webp","tags":["Infested"],"compTags":["PROJECTILE","AOE"],"comb":[[1,2]]},
  "Bronco Prime":{"masteryReq":4,"description":"Infused with rare Orokin alloys, the Bronco Prime is a highly efficient weapon, trading an increased Magazine Capacity and damage for a lower rate of fire.","noise":"Alarming","releaseDate":"2013-07-13","productCategory":"Pistols","category":"Secondary","trigger":"Semi","type":"Pistol","magazineSize":4,"reloadTime":2,"multishot":7,"attacks":[{"name":"Normal Attack","speed":4.17,"crit_chance":6,"crit_mult":2,"status_chance":12.86,"shot_type":"Hit-Scan","damage":{"Impact":40,"Slash":5,"Puncture":5},"falloff":{"start":9,"end":18,"reduction":0.74}},{"name":"Incarnon Form","multishot":7,"isInc":1,"speed":3,"crit_chance":24,"crit_mult":3.2,"status_chance":25.7,"damage":{"Impact":27.2,"Slash":3.4,"Puncture":3.4}}],"incMagazineSize":20,"name":"Bronco Prime","imageName":"bronco-prime.webp","tags":["Prime","Never Vaulted","Incarnon"],"compTags":["SINGLESHOT","SECONDARYSHOTGUN","BRONCO"]},
  "Braton Vandal":{"masteryReq":4,"description":"A special version of the standard Braton rifle with a slower Fire Rate but offering higher accuracy and damage values. The Braton Vandal has been customized by the Tenno with a blue-green metallic finish and Lotus branding on the grips.","noise":"Alarming","releaseDate":"2013-02-15","ammoCapacity":550,"productCategory":"LongGuns","equipTime":1.1,"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":50,"reloadTime":1.75,"multishot":1,"attacks":[{"name":"Normal Attack","speed":7.5,"crit_chance":16,"crit_mult":2,"status_chance":16,"shot_type":"Hit-Scan","damage":{"Impact":12.25,"Slash":21,"Puncture":1.75}},{"name":"Incarnon Form","isInc":1,"speed":4.67,"crit_chance":38,"crit_mult":3.2,"status_chance":22,"damage":{"Impact":26,"Slash":36,"Puncture":2.6}},{"name":"Incarnon Form Radial Attack","isInc":1,"speed":4.67,"crit_chance":38,"crit_mult":3.2,"status_chance":22,"shot_type":"AoE","damage":{"Heat":65},"no_headshot_mult":true}],"incMagazineSize":200,"name":"Braton Vandal","imageName":"braton-vandal.webp","tags":["Tenno","Vandal","Incarnon"],"compTags":["ASSAULT_AMMO"],"comb":[[1,2]]},
  "Carmine Penta":{"masteryReq":6,"description":"Enveloped in deep red composite enamel, this Penta variant features a higher fire-rate and over-sized magazine.","noise":"Alarming","releaseDate":"2021-03-19","ammoCapacity":40,"productCategory":"LongGuns","equipTime":0.4,"category":"Primary","trigger":"Active","type":"Rifle","magazineSize":10,"reloadTime":2.5,"multishot":1,"attacks":[{"name":"Grenade Impact","speed":2.7,"crit_chance":10,"crit_mult":2,"status_chance":10,"shot_type":"Projectile","shot_speed":20,"flight":20,"damage":{"Impact":75}},{"name":"Grenade Detonation","speed":2.7,"crit_chance":10,"crit_mult":2,"status_chance":10,"shot_type":"AoE","damage":{"Blast":350},"falloff":{"start":0,"end":4,"reduction":0.5},"no_headshot_mult":true}],"name":"Carmine Penta","imageName":"carmine-penta.webp","tags":["Corpus"],"compTags":["PROJECTILE","SNIPER_AMMO","AOE","SINGLESHOT","PENTA"],"comb":[[0,1]]},
  "Cantare":{"masteryReq":10,"description":"Used by The Stalker, Despair throwing blades have a mono-filament edge, sharp enough to penetrate a Warframe.","noise":"Silent","releaseDate":"2024-06-18","productCategory":"Pistols","category":"Secondary","trigger":"Auto","type":"Throwing","magazineSize":6,"reloadTime":1.2,"multishot":1,"attacks":[{"name":"Normal Attack","speed":3.33,"crit_chance":18,"crit_mult":2,"status_chance":22,"shot_type":"Projectile","shot_speed":70,"damage":{"Slash":63,"Puncture":27}}],"name":"Cantare","imageName":"Cantare.webp","tags":[],"compTags":["PROJECTILE","THROWN"]},
  "Castanas":{"masteryReq":3,"description":"The remotely triggered Castanas quietly deliver a lethal dose of electricity to unsuspecting enemies.","noise":"Silent","releaseDate":"2014-02-19","ammoCapacity":18,"productCategory":"Pistols","category":"Secondary","trigger":"Active","type":"Throwing","magazineSize":2,"reloadTime":1,"multishot":1,"attacks":[{"name":"Normal Attack","speed":3.33,"crit_chance":8,"crit_mult":1.5,"status_chance":22,"shot_type":"Projectile","shot_speed":60,"flight":60,"damage":{"Electricity":160},"falloff":{"start":0,"end":3.6,"reduction":0.4}}],"name":"Castanas","imageName":"castanas.webp","tags":["Tenno"],"compTags":["PROJECTILE","DEPLOYABLE","AOE","SINGLESHOT"]},
  "Catchmoon (Primary)":{"masteryReq":0,"description":"Automatic trigger, faster fire rate and smaller projectiles.","ammoCapacity":70,"productCategory":"","category":"Primary","type":"Kitgun","magazineSize":0,"reloadTime":3,"multishot":1,"attacks":[{"name":"Normal Attack","speed":1,"crit_chance":0,"crit_mult":0,"status_chance":0,"shot_type":"Projectile","shot_speed":100,"unique":{"force_procs":["impact"]},"damage":{"Impact":89,"fire":167}}],"name":"Catchmoon (Primary)","imageName":"catchmoon.webp","tags":["primary-shotgun"],"compTags":[""]},
  "Cassowar":{"masteryReq":5,"description":"Light and nimble, the twin blades of this polearm will swoop and slice through throngs of hardened foes.","blockingAngle":55,"comboDuration":5,"followThrough":0.6,"range":3,"windUp":0.9,"releaseDate":"2017-11-23","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"376","slam":{"damage":"564.00","radial":{"damage":"188.00","radius":7}},"speed":1.17,"crit_chance":6,"crit_mult":1.4,"status_chance":28,"damage":{"Impact":41.36,"Slash":82.72,"Puncture":63.92}},{"name":"Slam","radius":7,"type":"s","isHeavy":false,"speed":1,"crit_chance":6,"crit_mult":1.4,"status_chance":28,"unique":{"force_procs":["impact"]},"damage":{"Impact":376}},{"name":"Heavy Slam","radius":8,"type":"hs","isHeavy":true,"speed":1,"crit_chance":6,"crit_mult":1.4,"status_chance":28,"damage":{"Blast":564}}],"name":"Cassowar","imageName":"cassowar.webp","tags":["Tenno"],"compTags":["POLEARMS_STANCE"]},
  "Catabolyst":{"masteryReq":11,"description":"Splatter enemies with a short-range stream of corrosive bile and then toss the ammo bladder as a grenade when reloading. The emptier the pistol’s ammo bladder, the more potent its damage. A fully empty bladder packs the biggest punch.","noise":"Alarming","releaseDate":"2020-11-19","ammoCapacity":155,"productCategory":"Pistols","zoomProps":[[]],"category":"Secondary","trigger":"Held","type":"Pistol","magazineSize":31,"reloadTime":1.7,"multishot":1,"attacks":[{"name":"Primary","isBeam":true,"punch_through":0.9,"speed":12,"crit_chance":11,"crit_mult":2.9,"status_chance":43,"shot_type":"Discharge","damage":{"Corrosive":53},"falloff":{"start":9,"end":19,"reduction":0.2}},{"name":"Partial Reload Impact","isCoMult":true,"speed":12,"crit_chance":11,"crit_mult":2.9,"status_chance":43,"shot_type":"Projectile","shot_speed":-1,"flight":-1,"damage":{"Impact":11}},{"name":"Partial Reload Explosion","speed":12,"crit_chance":11,"crit_mult":2.9,"status_chance":43,"shot_type":"AoE","damage":{"Corrosive":203},"falloff":{"start":0,"end":5,"reduction":0.5},"no_headshot_mult":true},{"name":"Reload From Empty Impact","speed":12,"crit_chance":31,"crit_mult":2.9,"status_chance":59,"shot_type":"Projectile","shot_speed":-1,"flight":-1,"damage":{"Impact":11}},{"name":"Reload From Empty Explosion","speed":12,"crit_chance":31,"crit_mult":2.9,"status_chance":59,"shot_type":"AoE","damage":{"Corrosive":1997},"falloff":{"start":0,"end":7,"reduction":0.5},"no_headshot_mult":true}],"name":"Catabolyst","imageName":"catabolyst.webp","tags":["Infested"],"compTags":["PROJECTILE","BEAM","CATABOLYST"],"comb":[[1,2],[3,4]]},
  "Caustacyst":{"masteryReq":7,"description":"Heavy attacks from this scythe unleash a wave of acid that mutilates enemies and leaves a trail of corrosive sludge.","blockingAngle":60,"comboDuration":5,"followThrough":0.6,"range":2.9,"windUp":1,"releaseDate":"2016-10-20","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","isHeavy":false,"speed":1,"crit_chance":9,"crit_mult":2,"status_chance":37,"damage":{"Impact":17,"Slash":69,"Puncture":71,"Corrosive":103}},{"name":"Corrosive Wave","isHeavy":true,"speed":1,"crit_chance":9,"crit_mult":2,"status_chance":10,"shot_type":"Projectile","shot_speed":10,"flight":10,"damage":{"Corrosive":192},"falloff":{"start":0,"end":35,"reduction":1},"charge_time":1},{"name":"Corrosive Pool","isHeavy":true,"speed":1,"crit_chance":0,"crit_mult":1,"status_chance":0,"shot_type":"AoE","damage":{"Corrosive":5},"no_headshot_mult":true,"charge_time":1},{"name":"Slam","radius":8,"type":"s","isHeavy":false,"speed":1,"crit_chance":9,"crit_mult":2,"status_chance":37,"unique":{"force_procs":["impact"]},"damage":{"Impact":520}},{"name":"Heavy Slam","radius":9,"type":"hs","isHeavy":true,"speed":1,"crit_chance":9,"crit_mult":2,"status_chance":37,"damage":{"Blast":780}}],"name":"Caustacyst","imageName":"caustacyst.webp","tags":["Infested"],"compTags":["SCYTHES_STANCE"]},
  "Catchmoon (Secondary)":{"masteryReq":0,"description":"Fires a wide-radius plasma energy projectile with a very short half-life.","ammoCapacity":70,"productCategory":"Pistols","category":"Secondary","trigger":"Semi","type":"Kitgun","magazineSize":0,"reloadTime":3,"multishot":1,"attacks":[{"name":"Normal Attack","speed":1,"crit_chance":0,"crit_mult":0,"status_chance":0,"shot_type":"Projectile","shot_speed":100,"unique":{"force_procs":["impact"]},"damage":{"Impact":89,"fire":167}}],"name":"Catchmoon (Secondary)","imageName":"catchmoon.webp","tags":["secondary-shotgun"],"compTags":[""]},
  "Cedo":{"masteryReq":8,"description":"Launch a glaive that ricochets off surfaces in bursts of elemental damage, then perforate enemies with primary fire’s precision buck-shot. Damage increases with each Status Effect afflicting a target. Lavos will transmute a small portion of any ammo pickup to Shotgun Ammo when wielding his signature Cedo.","noise":"Alarming","releaseDate":"2020-12-18","ammoCapacity":200,"productCategory":"LongGuns","zoomProps":[[]],"category":"Primary","trigger":"Auto","type":"Shotgun","magazineSize":40,"reloadTime":2.2,"multishot":6,"attacks":[{"name":"Normal Attack","punch_through":0.8,"speed":3.83,"crit_chance":20,"crit_mult":2.4,"status_chance":0.3,"shot_type":"Hit-Scan","unique":{"base_per_status":0.6},"damage":{"Puncture":30},"falloff":{"start":26,"end":52,"reduction":0.9667}},{"name":"Alt-Fire Glaive","multishot":1,"isCoMult":true,"speed":1,"crit_chance":2,"crit_mult":1.4,"status_chance":50,"shot_type":"Projectile","shot_speed":60,"flight":60,"damage":{"Slash":20}},{"name":"Glaive Radial Attack","cedoRnd":true,"multishot":1,"speed":1,"crit_chance":2,"crit_mult":1.4,"status_chance":50,"shot_type":"AoE","damage":{"Blast":10},"falloff":{"start":0,"end":6,"reduction":0},"no_headshot_mult":true}],"name":"Cedo","imageName":"cedo.webp","tags":["Tenno"],"compTags":["PROJECTILE"],"comb":[[1,2],[0,1,2]]},
  "Cedo Prime":{"masteryReq":15,"description":"A golden shotgun, forged for those who deliver judgment.","noise":"Alarming","releaseDate":"2025-02-13","ammoCapacity":200,"productCategory":"LongGuns","zoomProps":[[]],"category":"Primary","trigger":"Auto","type":"Shotgun","magazineSize":40,"reloadTime":1.8,"multishot":7,"attacks":[{"name":"Normal Attack","punch_through":0.8,"speed":4.5,"crit_chance":24,"crit_mult":2.4,"status_chance":2,"shot_type":"Hit-Scan","unique":{"base_per_status":0.6},"damage":{"Puncture":32}},{"name":"Alt-Fire Glaive","multishot":1,"isCoMult":true,"speed":1,"crit_chance":10,"crit_mult":2,"status_chance":50,"shot_type":"Projectile","shot_speed":60,"flight":60,"damage":{"Slash":20}},{"name":"Glaive Radial Attack","cedoRnd":true,"multishot":1,"speed":1,"crit_chance":10,"crit_mult":2,"status_chance":50,"shot_type":"AoE","damage":{"Blast":10},"no_headshot_mult":true}],"name":"Cedo Prime","imageName":"CedoPrime.webp","tags":[],"compTags":["PROJECTILE"],"comb":[[1,2],[0,1,2]]},
  "Ceramic Dagger":{"masteryReq":3,"description":"This short blade weapon was built using ceramic. It has limited range but comes out fast.","blockingAngle":45,"comboDuration":5,"followThrough":0.9,"range":1.8,"windUp":0.4,"releaseDate":"2012-12-18","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":1,"crit_chance":10,"crit_mult":1.5,"status_chance":20,"damage":{"Impact":14,"Puncture":126}},{"name":"Incarnon Form","isInc":1,"isHeavy":false,"speed":1,"crit_chance":10,"crit_mult":1.5,"status_chance":20,"damage":{"Impact":38,"Puncture":1342}},{"name":"Incarnon Form Impact (for Heavy Attack)","multishot":2,"isInc":1,"isHeavy":true,"speed":1,"crit_chance":10,"crit_mult":1.5,"status_chance":20,"damage":{"Impact":35,"Puncture":116.66,"Slash":198.345}},{"name":"Incarnon Form Explosion (for Heavy Attack)","multishot":2,"isInc":1,"isHeavy":true,"speed":1,"crit_chance":10,"crit_mult":1.5,"status_chance":20,"shot_type":"AoE","unique":{"force_procs":["impact"]},"damage":{"Heat":350},"no_headshot_mult":true},{"name":"Slam","radius":5,"type":"s","isHeavy":false,"speed":1,"crit_chance":10,"crit_mult":1.5,"status_chance":20,"unique":{"force_procs":["impact"]},"damage":{"Impact":280}},{"name":"Heavy Slam","radius":6,"type":"s","isHeavy":true,"speed":1,"crit_chance":10,"crit_mult":1.5,"status_chance":20,"damage":{"Blast":420}}],"name":"Ceramic Dagger","imageName":"ceramic-dagger.webp","tags":["Tenno","Incarnon"],"compTags":["DAGGERS_STANCE"],"comb":[[1,2]]},
  "Cestra":{"masteryReq":4,"description":"Compact and deadly, the Cestra discharges bolts of energy at an increasingly rapid rate.","noise":"Alarming","releaseDate":"2013-11-20","ammoCapacity":420,"productCategory":"Pistols","category":"Secondary","trigger":"Auto","type":"Pistol","magazineSize":60,"reloadTime":2,"multishot":1,"attacks":[{"name":"Normal Attack","speed":8.33,"crit_chance":6,"crit_mult":1.6,"status_chance":20,"shot_type":"Projectile","shot_speed":100,"flight":100,"damage":{"Impact":5.2,"Puncture":20.8}},{"name":"Incarnon Form","speed":6.67,"crit_chance":50,"crit_mult":3,"status_chance":18,"shot_type":"Projectile","shot_speed":100,"damage":{"Impact":10,"Puncture":40}}],"incMagazineSize":150,"name":"Cestra","imageName":"cestra.webp","tags":["Corpus","Incarnon"],"compTags":["PROJECTILE"]},
  "Cinta":{"masteryReq":6,"description":"The versatile Cinta can fire arrows in quick succession, quickly charge a shock wave, or fully charge a powerful focused shot.","noise":"Silent","ammoCapacity":60,"productCategory":"LongGuns","category":"Primary","trigger":"Charge","type":"Rifle","magazineSize":1,"reloadTime":0.6,"multishot":1,"attacks":[{"name":"Quick Shot","isCoMult":true,"punch_through":2,"speed":0.769,"crit_chance":20,"crit_mult":2,"status_chance":30,"shot_type":"Projectile","shot_speed":100,"damage":{"Puncture":360,"Slash":90}},{"name":"Charged shot","isCoMult":true,"punch_through":2,"speed":0.769,"crit_chance":36,"crit_mult":3,"status_chance":32,"shot_type":"Projectile","shot_speed":100,"damage":{"Puncture":640,"Slash":160},"charge_time":1.5},{"name":"Perfect Shot","isCoMult":true,"punch_through":2,"speed":0.769,"crit_chance":20,"crit_mult":2,"status_chance":34,"shot_type":"Projectile","damage":{"Heat":600},"charge_time":1.5}],"name":"Cinta","imageName":"cinta.webp","tags":[""],"compTags":["PROJECTILE"]},
  "Cobra & Crane Prime":{"masteryReq":14,"description":"Punish those who test your restraint. The first strike in a combo stuns enemies when Cobra & Crane Prime are wielded by Baruuk.","blockingAngle":70,"comboDuration":5,"followThrough":0.6,"range":2.6,"windUp":0.7,"releaseDate":"2022-12-14","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","slide":"300","slam":{"damage":"900.00","radial":{"damage":"300.00","element":"Impact","radius":7}},"speed":1,"crit_chance":18,"crit_mult":2,"status_chance":38,"damage":{"Impact":210,"Puncture":90}},{"name":"Slam","radius":7,"type":"s","isHeavy":false,"speed":1,"crit_chance":18,"crit_mult":2,"status_chance":38,"unique":{"force_procs":["impact"]},"damage":{"Impact":600}},{"name":"Heavy Slam","radius":8,"type":"hs","isHeavy":true,"speed":1,"crit_chance":18,"crit_mult":2,"status_chance":38,"damage":{"Blast":900}}],"name":"Cobra & Crane Prime","imageName":"cobra-&-crane-prime.webp","tags":[],"compTags":["SWORDS_AND_SHIELD_STANCE"]},
  "Cernos":{"masteryReq":6,"description":"Evoking the design of ancient bows, the high impact Cernos is perfect for hunting down highly shielded enemies.","noise":"Silent","releaseDate":"2013-11-27","ammoCapacity":72,"productCategory":"LongGuns","zoomProps":[[]],"category":"Primary","trigger":"Charge","type":"Rifle","magazineSize":1,"reloadTime":0.6,"multishot":1,"attacks":[{"name":"Uncharged Shot","speed":1,"crit_chance":36,"crit_mult":2,"status_chance":18,"shot_type":"Projectile","shot_speed":70,"flight":70,"damage":{"Impact":171,"Slash":9.5,"Puncture":9.5}},{"name":"Charged Shot","punch_through":1,"speed":1,"crit_chance":36,"crit_mult":2,"status_chance":18,"shot_type":"Projectile","shot_speed":90,"flight":90,"damage":{"Impact":342,"Slash":19,"Puncture":19},"charge_time":0.5}],"name":"Cernos","imageName":"cernos.webp","tags":["Tenno"],"compTags":["PROJECTILE"]},
  "Cernos Prime":{"masteryReq":12,"description":"A noble bow to hunt hellish beasts.","noise":"Silent","releaseDate":"2016-11-22","ammoCapacity":72,"productCategory":"LongGuns","zoomProps":[[]],"category":"Primary","trigger":"Charge","type":"Rifle","magazineSize":1,"reloadTime":0.64999998,"multishot":3,"attacks":[{"name":"Uncharged Horizontal/Vertical Shot","speed":1,"crit_chance":35,"crit_mult":2,"status_chance":30,"shot_type":"Projectile","shot_speed":70,"flight":70,"damage":{"Impact":82.8,"Slash":4.6,"Puncture":4.6}},{"name":"Charged Horizontal/Vertical Shot","punch_through":1,"speed":1,"crit_chance":35,"crit_mult":2,"status_chance":30,"shot_type":"Projectile","shot_speed":95,"flight":95,"damage":{"Impact":165.6,"Slash":9.2,"Puncture":9.2},"charge_time":0.5}],"name":"Cernos Prime","imageName":"cernos-prime.webp","tags":["Prime","Never Vaulted"],"compTags":["PROJECTILE"]},
  "Ceti Lacera":{"masteryReq":12,"description":"Forged for veterans of the Scarlet Spear conflict, this Lacera has been modified to enhance nimbleness and lethality.","blockingAngle":60,"comboDuration":5,"followThrough":0.5,"range":2.5,"windUp":0.4,"releaseDate":"2020-03-24","productCategory":"Melee","equipTime":0.93333,"category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"216","slam":{"damage":"648.00","radial":{"damage":"216.00","element":"Electricity","radius":7}},"speed":1.08,"crit_chance":20,"crit_mult":2,"status_chance":40,"damage":{"Impact":12,"Slash":66,"Puncture":38,"Electricity":100}},{"name":"Slam","radius":7,"type":"s","isHeavy":false,"speed":1,"crit_chance":20,"crit_mult":2,"status_chance":40,"unique":{"force_procs":["impact"]},"damage":{"Electricity":432}},{"name":"Heavy Slam","radius":9,"type":"hs","isHeavy":true,"speed":1,"crit_chance":20,"crit_mult":2,"status_chance":40,"damage":{"Electricity":648}}],"name":"Ceti Lacera","imageName":"ceti-lacera.webp","tags":["Tenno"],"compTags":["BLADE_AND_WHIP_STANCE"]},
  "Cobra & Crane":{"masteryReq":10,"description":"Baruuk's signature weapons: a sword for retribution, a shield for restraint. In Baruuk's hands, and his hands only, Cobra's first strike in a combo renders his foe unconscious.","blockingAngle":70,"comboDuration":5,"followThrough":0.6,"range":2.6,"windUp":0.7,"releaseDate":"2018-12-18","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"296","slam":{"damage":"888.00","radial":{"damage":"296.00","element":"Impact","radius":7}},"speed":0.917,"crit_chance":15,"crit_mult":1.5,"status_chance":36,"damage":{"Impact":207.2,"Puncture":88.8}},{"name":"Slam","radius":7,"type":"s","isHeavy":false,"speed":1,"crit_chance":15,"crit_mult":1.5,"status_chance":36,"unique":{"force_procs":["impact"]},"damage":{"Impact":592}},{"name":"Heavy Slam","radius":8,"type":"hs","isHeavy":true,"speed":1,"crit_chance":15,"crit_mult":1.5,"status_chance":36,"damage":{"Impact":888}}],"name":"Cobra & Crane","imageName":"cobra-&-crane.webp","tags":[],"compTags":["SWORDS_AND_SHIELD_STANCE"]},
  "Cerata":{"masteryReq":7,"description":"Twisted and tortured from exposure to the Infestation, this glaive becomes an absolute predator in the hands of the right Tenno.","blockingAngle":55,"comboDuration":5,"followThrough":0.7,"range":1.25,"windUp":1.2,"releaseDate":"2015-10-28","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slam":{"damage":"549.00","radial":{"damage":"183.00","radius":5}},"isHeavy":false,"speed":1,"crit_chance":15,"crit_mult":2,"status_chance":30,"damage":{"Impact":19,"Slash":52,"Puncture":36,"Toxin":76}},{"name":"Throw","isHeavy":false,"speed":1,"crit_chance":19,"crit_mult":2.1,"status_chance":33,"shot_type":"Thrown","shot_speed":35,"flight":35,"damage":{"Impact":33,"Slash":52,"Puncture":39,"Toxin":77}},{"name":"Throw Bounce Explosion","isHeavy":false,"speed":1,"crit_chance":19,"crit_mult":2.1,"status_chance":33,"shot_type":"AoE","damage":{"Toxin":333},"falloff":{"start":0,"end":4.8,"reduction":0.3},"no_headshot_mult":true},{"name":"Throw Recall Explosion","isHeavy":true,"speed":1,"crit_chance":19,"crit_mult":2.1,"status_chance":33,"shot_type":"AoE","unique":{"force_procs":["impact","toxin"]},"damage":{"Toxin":666},"falloff":{"start":0,"end":4.8,"reduction":0},"no_headshot_mult":true},{"name":"Charged Throw","isHeavy":false,"speed":0.833,"crit_chance":21,"crit_mult":2.3,"status_chance":34,"shot_type":"Thrown","shot_speed":45,"flight":45,"unique":{"force_procs":["impact","toxin"]},"damage":{"Impact":46,"Slash":114,"Puncture":80,"Toxin":162},"charge_time":1.2},{"name":"Charged Throw Bounce Explosion","isHeavy":false,"speed":0.833,"crit_chance":21,"crit_mult":2.3,"status_chance":34,"shot_type":"AoE","damage":{"Toxin":666},"falloff":{"start":0,"end":4.8,"reduction":0.3},"no_headshot_mult":true,"charge_time":1.2},{"name":"Charged Throw Recall Explosion","isHeavy":true,"speed":0.833,"crit_chance":21,"crit_mult":2.3,"status_chance":34,"shot_type":"AoE","unique":{"force_procs":["impact","toxin"]},"damage":{"Toxin":1318},"falloff":{"start":0,"end":4.8,"reduction":0},"no_headshot_mult":true,"charge_time":1.2},{"name":"Slam","radius":5,"type":"s","isHeavy":false,"speed":1,"crit_chance":15,"crit_mult":2,"status_chance":30,"unique":{"force_procs":["impact"]},"damage":{"Toxin":366}},{"name":"Heavy Slam","radius":6,"type":"hs","isHeavy":true,"speed":1,"crit_chance":15,"crit_mult":2,"status_chance":30,"damage":{"Toxin":549}}],"name":"Cerata","imageName":"cerata.webp","tags":["Infested"],"compTags":["GLAIVES_STANCE"],"comb":[[1,2],[4,5]]},
  "Coda Bassocyst":{"masteryReq":17,"description":"Amplify shockwaves of devastating sound with this Technocyte virus infested shotgun that hungers for blood, and desires nothing more than to feed upon its enemies. Alternative fire at enemies not vulnerable to Mercy Kills to swarm them with infested mites, while firing at vulnerable ones will perform a ranged execution.","noise":"Alarming","releaseDate":"2025-03-19","ammoCapacity":96,"productCategory":"LongGuns","zoomProps":[[]],"category":"Primary","trigger":"Semi","type":"Shotgun","magazineSize":24,"reloadTime":2.5,"multishot":1,"attacks":[{"name":"Normal Attack","isCoMult":true,"speed":1.17,"crit_chance":18,"crit_mult":2.2,"status_chance":40,"shot_type":"Projectile","shot_speed":62,"damage":{"Blast":789,"Radiation":19}},{"name":"Alt-Fire","multishot":6,"ammoCost":4,"speed":1,"crit_chance":18,"crit_mult":2.2,"status_chance":40,"shot_type":"Projectile","shot_speed":40,"unique":{"force_procs":["impact","magnetic"]},"damage":{"Blast":303}}],"name":"Coda Bassocyst","imageName":"CodaBassocyst.webp","tags":["Coda"],"compTags":[]},
  "Coda Bubonico":{"masteryReq":17,"description":"With increased magazine size, the Coda Bubonico was born of the Technocyte virus' need to spread infection. Primary Fire rate ramps up with continuous fire.","noise":"Alarming","releaseDate":"2026-03-25","ammoCapacity":"Infinity","productCategory":"LongGuns","zoomProps":[[]],"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":36,"reloadTime":5.5,"multishot":7,"attacks":[{"name":"Auto","isCoMult":true,"punch_through":1.9,"speed":5.33,"crit_chance":27,"crit_mult":2.3,"status_chance":10.14,"shot_type":"Projectile","damage":{"Impact":2,"Slash":19,"Puncture":13,"Toxin":7}},{"name":"Burst","ammoCost":3,"isCoMult":true,"punch_through":1.9,"speed":7,"crit_chance":5,"crit_mult":3.5,"status_chance":61,"shot_type":"Projectile","shot_speed":25,"damage":{"Impact":9},"burst_count":3,"burst_delay":0.23},{"name":"Radial Attack","ammoCost":3,"speed":7,"crit_chance":5,"crit_mult":3.5,"status_chance":57,"shot_type":"AoE","damage":{"Viral":143},"no_headshot_mult":true,"burst_count":3,"burst_delay":0.23}],"reloadRate":9,"reloadDelay":1.5,"name":"Coda Bubonico","imageName":"CodaBubonico.webp","tags":["Coda"],"compTags":["PROJECTILE","AOE"],"comb":[[1,2]]},
  "Coda Hema":{"masteryReq":17,"description":"The Technocyte virus did nothing but increase the Hema’s thirst for blood. With increased Fire Rate, Magazine Size, Critical Chance, Critical Multiplier, Status Chance, and Damage.","noise":"Alarming","releaseDate":"2025-03-19","productCategory":"LongGuns","category":"Primary","trigger":"Burst","type":"Rifle","magazineSize":72,"reloadTime":2,"multishot":1,"attacks":[{"name":"Normal Attack","speed":5.33,"crit_chance":20,"crit_mult":2.3,"status_chance":30,"shot_type":"Projectile","shot_speed":150,"damage":{"Viral":52},"burst_count":3,"burst_delay":0.1}],"name":"Coda Hema","imageName":"CodaHema.webp","tags":["Coda"],"compTags":["ASSAULT_AMMO","PROJECTILE","HEMA"]},
  "Coda Catabolyst":{"masteryReq":17,"description":"When the magazine reaches empty and is manually reloaded, the Coda Catabolyst launches not one but three powerful grenades. Also has a higher Status Chance, Damage, and Magazine Size.","noise":"Alarming","releaseDate":"2025-03-19","ammoCapacity":155,"productCategory":"Pistols","zoomProps":[[]],"category":"Secondary","trigger":"Held","type":"Pistol","magazineSize":37,"reloadTime":1.7,"multishot":1,"attacks":[{"name":"Primary","isBeam":true,"speed":12,"crit_chance":11,"crit_mult":2.9,"status_chance":50,"shot_type":"Discharge","damage":{"Corrosive":56},"falloff":{"start":9,"end":19,"reduction":0.2}},{"name":"Partial Reload Impact","speed":12,"crit_chance":11,"crit_mult":2.9,"status_chance":43,"shot_type":"Projectile","damage":{"Impact":11}},{"name":"Partial Reload Explosion","speed":12,"crit_chance":11,"crit_mult":2.9,"status_chance":43,"shot_type":"AoE","damage":{"Corrosive":74},"falloff":{"start":0,"end":3,"reduction":0.5},"no_headshot_mult":true},{"name":"Reload From Empty Impact","speed":12,"crit_chance":31,"crit_mult":2.9,"status_chance":59,"shot_type":"Projectile","damage":{"Impact":11}},{"name":"Reload From Empty Explosion","speed":12,"crit_chance":31,"crit_mult":2.9,"status_chance":59,"shot_type":"AoE","damage":{"Corrosive":658},"falloff":{"start":0,"end":5,"reduction":0.5},"no_headshot_mult":true}],"name":"Coda Catabolyst","imageName":"CodaCatabolyst.webp","tags":["Coda"],"compTags":["PROJECTILE","BEAM","CATABOLYST"],"comb":[[1,2],[3,4]]},
  "Coda Caustacyst":{"masteryReq":17,"description":"The Coda Caustacyst scythe is a force to be reckoned with, the Technocyte virus honing it with improved Damage, Status Chance, and Critical Damage, as well as acid pools with longer duration.","blockingAngle":60,"comboDuration":5,"followThrough":0.6,"range":2.9,"windUp":1,"releaseDate":"2025-03-19","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","isHeavy":false,"speed":1,"crit_chance":19,"crit_mult":2.3,"status_chance":41,"damage":{"Impact":20,"Slash":70,"Puncture":75,"Corrosive":120}},{"name":"Corrosive Wave","isHeavy":true,"speed":1,"crit_chance":19,"crit_mult":2.3,"status_chance":41,"shot_type":"Projectile","damage":{"Corrosive":225},"charge_time":1},{"name":"Corrosive Pool","isHeavy":true,"speed":1,"crit_chance":0,"crit_mult":1,"status_chance":41,"shot_type":"AoE","damage":{"Corrosive":145},"no_headshot_mult":true,"charge_time":1},{"name":"Slam","radius":8,"type":"s","isHeavy":false,"speed":1,"crit_chance":19,"crit_mult":2.3,"status_chance":41,"unique":{"force_procs":["impact"]},"damage":{"Impact":570}},{"name":"Heavy Slam","radius":9,"type":"hs","isHeavy":true,"speed":1,"crit_chance":19,"crit_mult":2.3,"status_chance":41,"damage":{"Blast":855}}],"name":"Coda Caustacyst","imageName":"CodaCaustacyst.webp","tags":["Coda"],"compTags":["SCYTHES_STANCE"]},
  "Coda Pox":{"masteryReq":17,"description":"These festering, writhing, throwable projectiles of pus and gas have been improved with a greater Magazine Size, Critical Chance, Critical Multiplier, Status Chance, and Damage.","noise":"Silent","releaseDate":"2025-03-19","ammoCapacity":20,"productCategory":"Pistols","category":"Secondary","trigger":"Auto","type":"Pistol","magazineSize":8,"reloadTime":1,"multishot":1,"attacks":[{"name":"Spore Impact","speed":2.0833335,"crit_chance":10,"crit_mult":2.2,"status_chance":45,"shot_type":"Projectile","damage":{"Toxin":55}},{"name":"Poison Cloud","speed":2.0833335,"crit_chance":10,"crit_mult":2.2,"status_chance":45,"shot_type":"AoE","damage":{"Toxin":35},"no_headshot_mult":true}],"name":"Coda Pox","imageName":"CodaPox.webp","tags":["Coda"],"compTags":["PROJECTILE","AOE","SINGLESHOT"]},
  "Coda Motovore":{"masteryReq":17,"description":"Drive home the pain with this hammer evolved from a scooter assembly. The wheel shapeshifts and gains a unique buff to match whatever type of physical damage it has been modded for.","blockingAngle":50,"comboDuration":5,"followThrough":0.4,"range":2.5,"windUp":1.2,"releaseDate":"2025-03-19","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":1,"crit_chance":25,"crit_mult":2.3,"status_chance":30,"unique":{"ifMaxStatImpact":{"speed":0.4},"ifMaxStatPuncture":{"range":1.5},"ifMaxStatSlash":{"status_chance":1}},"damage":{"Impact":83.324997,"Slash":83.350006,"Puncture":83.324997}},{"name":"Slam","radius":9,"type":"s","isHeavy":false,"speed":1,"crit_chance":25,"crit_mult":2.3,"status_chance":30,"damage":{"Impact":500}},{"name":"Heavy Slam","radius":10,"type":"hs","isHeavy":true,"speed":1,"crit_chance":25,"crit_mult":2.3,"status_chance":30,"damage":{"Blast":750}}],"name":"Coda Motovore","imageName":"CodaMotovore.webp","tags":["Coda"],"compTags":["HAMMERS_STANCE"]},
  "Coda Synapse":{"masteryReq":17,"description":"Firing a nonstop stream of vile corrosive gastric juice, the Coda Synapse comes with increased Magazine size, Beam Length, Status Chance, Punch Through, and Damage.","noise":"Alarming","releaseDate":"2025-03-19","ammoCapacity":540,"productCategory":"LongGuns","zoomProps":[[]],"category":"Primary","trigger":"Held","type":"Rifle","magazineSize":76,"reloadTime":1.5,"multishot":1,"attacks":[{"name":"Normal Attack","isBeam":true,"punch_through":1.2,"speed":12,"crit_chance":40,"crit_mult":2.7,"status_chance":15,"shot_type":"Discharge","damage":{"Corrosive":26}}],"name":"Coda Synapse","imageName":"CodaSynapse.webp","tags":["Coda"],"compTags":["BEAM","ASSAULT_AMMO"]},
  "Coda Hirudo":{"masteryReq":17,"description":"Rip and shred your enemies to pieces with the Technocyte Coda Hirudo. With improved Damage, Status Chance, and Critical Chance and Critical Multiplier.","blockingAngle":50,"comboDuration":5,"followThrough":0.9,"range":1.25,"windUp":0.5,"releaseDate":"2025-03-19","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":1,"crit_chance":34,"crit_mult":3.1,"status_chance":18,"damage":{"Impact":26.3,"Slash":8.7,"Puncture":140}},{"name":"Slam","radius":7,"type":"s","isHeavy":false,"speed":1,"crit_chance":34,"crit_mult":3.1,"status_chance":18,"unique":{"force_procs":["impact"]},"damage":{"Impact":350}},{"name":"Heavy Slam","radius":8,"type":"hs","isHeavy":true,"speed":1,"crit_chance":34,"crit_mult":3.1,"status_chance":18,"damage":{"Blast":525}}],"name":"Coda Hirudo","imageName":"CodaHirudo.webp","tags":["Coda"],"compTags":["SPARRING_STANCE"]},
  "Coda Mire":{"masteryReq":17,"description":"The Plague Year of 1999 will never be the same. With improved Critical Multipler, Critical Chance, and Status Chance, the Technocyte virus has turned the Coda Mire into a truly horrifying blade.","blockingAngle":55,"comboDuration":5,"followThrough":0.6,"range":2.7,"windUp":0.6,"releaseDate":"2025-03-19","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":1.0833334,"crit_chance":18,"crit_mult":2.4,"status_chance":40,"damage":{"Impact":45,"Slash":66,"Puncture":45,"Toxin":79}},{"name":"Slam","radius":7,"type":"s","isHeavy":false,"speed":1,"crit_chance":18,"crit_mult":2.4,"status_chance":40,"unique":{"force_procs":["impact","toxin"]},"damage":{"Toxin":470}},{"name":"Heavy Slam","radius":8,"type":"hs","isHeavy":true,"speed":1,"crit_chance":18,"crit_mult":2.4,"status_chance":40,"unique":{"force_procs":["toxin"]},"damage":{"Toxin":705}}],"name":"Coda Mire","imageName":"CodaMire.webp","tags":["Coda"],"compTags":["SWORDS_STANCE","MIRE"]},
  "Coda Pathocyst":{"masteryReq":17,"description":"Enhanced by Technocyte mutations, the Coda Pathocyst comes with increased Damage, Critical Chance, Critical Multiplier and Status Chance. While in-flight or on contact with the enemy, it will occasionally spawn enhanced, enemy-seeking miasmites.","blockingAngle":55,"comboDuration":5,"followThrough":0.7,"range":1.3,"windUp":1.2,"releaseDate":"2025-03-19","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","isHeavy":false,"speed":0.667,"crit_chance":20,"crit_mult":2.3,"status_chance":35,"damage":{"Impact":58,"Slash":65,"Puncture":55,"Viral":92}},{"name":"Throw","isHeavy":false,"speed":0.667,"crit_chance":22,"crit_mult":2.4,"status_chance":36,"shot_type":"Thrown","shot_speed":30,"flight":30,"damage":{"Impact":49,"Slash":80,"Puncture":45,"Viral":123}},{"name":"Throw Bounce Explosion","isHeavy":false,"speed":0.667,"crit_chance":22,"crit_mult":2.4,"status_chance":36,"shot_type":"AoE","damage":{"Viral":405},"no_headshot_mult":true},{"name":"Throw Recall Explosion","isHeavy":true,"speed":0.667,"crit_chance":22,"crit_mult":2.4,"status_chance":36,"shot_type":"AoE","unique":{"force_procs":["impact","viral"]},"damage":{"Viral":810},"falloff":{"start":0,"end":4.9,"reduction":0},"no_headshot_mult":true},{"name":"Charged Throw","isHeavy":false,"speed":0.833,"crit_chance":24,"crit_mult":2.5,"status_chance":38,"shot_type":"Thrown","shot_speed":30,"flight":30,"damage":{"Impact":131,"Slash":137,"Puncture":125,"Viral":201},"charge_time":1.2},{"name":"Charged Throw Bounce Explosion","isHeavy":false,"speed":0.833,"crit_chance":24,"crit_mult":2.5,"status_chance":38,"shot_type":"AoE","damage":{"Viral":810},"falloff":{"start":0,"end":4.9,"reduction":0.5},"no_headshot_mult":true,"charge_time":1.2},{"name":"Charged Throw Recall Explosion","isHeavy":true,"speed":0.833,"crit_chance":24,"crit_mult":2.5,"status_chance":38,"shot_type":"AoE","unique":{"force_procs":["impact","viral"]},"damage":{"Viral":1620},"no_headshot_mult":true,"charge_time":1.2},{"name":"Slam","radius":5,"type":"s","isHeavy":false,"speed":1,"crit_chance":20,"crit_mult":2.3,"status_chance":35,"unique":{"force_procs":["impact"]},"damage":{"Viral":540}},{"name":"Heavy Slam","radius":6,"type":"hs","isHeavy":true,"speed":1,"crit_chance":20,"crit_mult":2.3,"status_chance":35,"damage":{"Viral":810}}],"name":"Coda Pathocyst","imageName":"CodaPathocyst.webp","tags":["Coda"],"compTags":["GLAIVES_STANCE"],"comb":[[1,2],[4,5]]},
  "Convectrix":{"masteryReq":7,"description":"When its twin-lasers converge on a target a circuit is created, frying the subject.","noise":"Alarming","releaseDate":"2015-10-01","ammoCapacity":700,"productCategory":"LongGuns","zoomProps":[[]],"category":"Primary","trigger":"Held","type":"Rifle","magazineSize":70,"reloadTime":2,"multishot":2,"attacks":[{"name":"Normal Attack","isBeam":true,"punch_through":0.6,"speed":12,"crit_chance":16,"crit_mult":2.4,"status_chance":45,"shot_type":"Discharge","damage":{"Impact":1.2,"Slash":9.6,"Puncture":1.2}},{"name":"Alt-Fire","isBeam":true,"punch_through":0.6,"speed":16,"crit_chance":16,"crit_mult":2.4,"status_chance":45,"shot_type":"Discharge","damage":{"Impact":0.9,"Slash":7.2,"Puncture":0.9}}],"name":"Convectrix","imageName":"convectrix.webp","tags":["Corpus"],"compTags":["BEAM","CONVECTRIX"]},
  "Coda Sporothrix":{"masteryReq":17,"description":"Delivers a virus-laden barb to its victim that continues to damage it before exploding. With increased Damage, Reload Speed, Magazine Size, Status Chance, and explosion radius.","noise":"Alarming","releaseDate":"2025-03-19","ammoCapacity":45,"productCategory":"LongGuns","category":"Primary","trigger":"Semi","type":"Rifle","magazineSize":11,"reloadTime":2.5,"multishot":1,"attacks":[{"name":"Unzoomed","speed":1.83,"crit_chance":5,"crit_mult":3,"status_chance":55,"shot_type":"Projectile","shot_speed":270,"damage":{"Slash":157.91998,"Impact":101.52,"Puncture":116.56}},{"name":"2.7x Zoom","sniperCombo":true,"speed":1.83,"crit_chance":5,"crit_mult":3,"status_chance":55,"shot_type":"Projectile","shot_speed":270,"damage":{"Slash":157.91998,"Impact":101.52,"Puncture":116.56}},{"name":"AoE","sniperCombo":true,"speed":1.83,"crit_chance":5,"crit_mult":3,"status_chance":55,"shot_type":"AoE","damage":{"Slash":25,"Viral":23},"no_headshot_mult":true}],"name":"Coda Sporothrix","imageName":"CodaSporothrix.webp","tags":["Coda"],"compTags":["SNIPER_AMMO","PROJECTILE","SPOROTHRIX"],"comb":[[0,1]]},
  "Coda Tysis":{"masteryReq":17,"description":"The Technocyte virus has contorted this Tysis into a more lethal weapon. With increased Damage, Critical Chance, Critical Multiplier and Magazine Capacity.","noise":"Alarming","releaseDate":"2025-03-19","ammoCapacity":210,"productCategory":"Pistols","category":"Secondary","trigger":"Semi","type":"Pistol","magazineSize":18,"reloadTime":1.2,"multishot":1,"attacks":[{"name":"Normal Attack","speed":2.5,"crit_chance":13,"crit_mult":2,"status_chance":50,"shot_type":"Projectile","shot_speed":75,"flight":75,"damage":{"Impact":18,"Slash":26,"Puncture":32}},{"name":"Corrosive DoT","speed":2.5,"crit_chance":13,"crit_mult":2,"status_chance":50,"shot_type":"DoT","damage":{"Corrosive":59}}],"name":"Coda Tysis","imageName":"CodaTysis.webp","tags":["Coda"],"compTags":["PROJECTILE"],"comb":[[0,1]]},
  "Corinth":{"masteryReq":8,"description":"Deliver a massive punch with each blast of this shotgun, or launch a round that explodes mid-air knocking down nearby enemies.","noise":"Alarming","releaseDate":"2017-12-21","ammoCapacity":135,"productCategory":"LongGuns","zoomProps":[[]],"category":"Primary","trigger":"Semi","type":"Shotgun","magazineSize":5,"reloadTime":2.3000002,"multishot":6,"attacks":[{"name":"Buckshot","speed":1.17,"crit_chance":30,"crit_mult":2.8,"status_chance":6,"shot_type":"Hit-Scan","damage":{"Impact":25.2,"Slash":27,"Puncture":37.8},"falloff":{"start":18,"end":36,"reduction":0.6667}},{"name":"Air Burst Projectile","speed":1.17,"crit_chance":4,"crit_mult":1.6,"status_chance":28,"shot_type":"Projectile","shot_speed":80,"flight":80,"unique":{"force_procs":["impact"]},"damage":{"Impact":100}},{"name":"Air Burst Explosion","speed":1.17,"crit_chance":4,"crit_mult":1.6,"status_chance":28,"shot_type":"AoE","damage":{"Blast":404},"falloff":{"start":0,"end":9.4,"reduction":0.9},"no_headshot_mult":true}],"name":"Corinth","imageName":"corinth.webp","tags":["Tenno"],"compTags":["PROJECTILE"],"comb":[[1,2]]},
  "Cortege (Arch-mode)":{"masteryReq":14,"description":"An ancient weapon designed by the Entrati for use by their Necramechs. Primary fire siphons life essence from the target to fuel a devastating alt fire. A heavy flamethrower with surprising range. Alt fire launches three projectiles in a fan pattern that explode, leaving a damaging area of effect for a short duration.","releaseDate":"2020-08-25","ammoCapacity":0,"productCategory":"Archguns","zoomProps":[[]],"category":"Archgun","type":"Archgun","magazineSize":100,"reloadTime":3,"multishot":1,"attacks":[{"name":"Held","isBeam":true,"speed":12,"crit_chance":20,"crit_mult":1.9,"status_chance":40,"shot_type":"Hit-Scan","damage":{"Heat":90}},{"name":"Grenade Impact","multishot":3,"speed":0.25,"crit_chance":30,"crit_mult":2.4,"status_chance":16.7,"damage":{"Impact":10}},{"name":"Radial Attack","multishot":3,"speed":0.25,"crit_chance":30,"crit_mult":2.4,"status_chance":16.7,"shot_type":"AoE","damage":{"Blast":1000},"no_headshot_mult":true}],"reloadRate":50,"reloadDelay":1,"name":"Cortege (Arch-mode)","imageName":"Cortege.webp","tags":[],"compTags":["BATTERY"]},
  "Corinth Prime":{"masteryReq":14,"description":"Heavy in the hand with a bone-crunching kickback. This Prime version of this shotgun adds remote detonation of the weapon's airburst round.","noise":"Alarming","releaseDate":"2020-03-31","ammoCapacity":120,"productCategory":"LongGuns","zoomProps":[[]],"category":"Primary","trigger":"Semi","type":"Rifle","magazineSize":20,"reloadTime":3,"multishot":6,"attacks":[{"name":"Buckshot","speed":1.42,"crit_chance":30,"crit_mult":2.8,"status_chance":9,"shot_type":"Hit-Scan","damage":{"Impact":25.2,"Slash":27,"Puncture":37.8},"falloff":{"start":18,"end":36,"reduction":0.6667}},{"name":"Air Burst Projectile","ammoCost":4,"speed":0.667,"crit_chance":4,"crit_mult":1.6,"status_chance":50,"shot_type":"Projectile","shot_speed":50,"flight":50,"unique":{"force_procs":["impact"]},"damage":{"Impact":100}},{"name":"Air Burst Explosion","ammoCost":4,"speed":0.667,"crit_chance":4,"crit_mult":1.6,"status_chance":50,"shot_type":"AoE","damage":{"Blast":2200},"falloff":{"start":0,"end":9.8,"reduction":0.9},"no_headshot_mult":true}],"name":"Corinth Prime","imageName":"corinth-prime.webp","tags":["Prime"],"compTags":["PROJECTILE"],"comb":[[1,2]]},
  "Corvas (Arch-mode)":{"masteryReq":1,"description":"When fully charged, this flak-cannon delivers a devastating shot. Perfect for taking down fast-moving interceptors.","releaseDate":"2014-10-24","ammoCapacity":0,"productCategory":"Archguns","zoomProps":[[]],"category":"Archgun","type":"Archgun","magazineSize":25,"reloadTime":8,"multishot":1,"attacks":[{"name":"Uncharged Shot","speed":2,"crit_chance":40,"crit_mult":2.6,"status_chance":13,"shot_type":"Projectile","shot_speed":400,"unique":{"force_procs":["impact"]},"damage":{"Impact":200,"Heat":240}},{"name":"Charged Shot","speed":2,"crit_chance":40,"crit_mult":3,"status_chance":13,"shot_type":"Projectile","shot_speed":400,"unique":{"force_procs":["impact"]},"damage":{"Impact":400,"Heat":480},"charge_time":0.5}],"reloadRate":5,"reloadDelay":3,"name":"Corvas (Arch-mode)","imageName":"Corvas.webp","tags":[""],"compTags":["BATTERY"]},
  "Corvas Prime (Arch-mode)":{"masteryReq":14,"description":"Flaunting ceremonial beauty, this arch-gun flak-cannon is even more devastating than its standard issue counterpart.","releaseDate":"2022-03-28","ammoCapacity":0,"productCategory":"Archguns","zoomProps":[[]],"category":"Archgun","type":"Archgun","magazineSize":20,"reloadTime":8,"multishot":1,"attacks":[{"name":"Uncharged Shot","speed":2,"crit_chance":44,"crit_mult":3,"status_chance":20,"shot_type":"Projectile","shot_speed":400,"unique":{"force_procs":["impact"]},"damage":{"Impact":230,"Heat":330}},{"name":"Charged Shot","speed":2,"crit_chance":56,"crit_mult":3,"status_chance":20,"shot_type":"Projectile","shot_speed":400,"unique":{"force_procs":["impact"]},"damage":{"Impact":430,"Heat":530},"charge_time":0.5}],"reloadRate":5,"reloadDelay":3,"name":"Corvas Prime (Arch-mode)","imageName":"CorvasPrime.webp","tags":[""],"compTags":["BATTERY"]},
  "Cortege (Atmo-mode)":{"masteryReq":15,"description":"An ancient weapon designed by the Entrati for use by their Necramechs. Primary fire siphons life essence from the target to fuel a devastating alt fire. A heavy flamethrower with surprising range. Alt fire launches three projectiles in a fan pattern that explode, leaving a damaging area of effect for a short duration.","releaseDate":"2020-08-25","ammoCapacity":300,"productCategory":"Archguns","zoomProps":[[]],"category":"Archgun","type":"Archgun","magazineSize":100,"reloadTime":2.5,"multishot":1,"attacks":[{"name":"Held","isBeam":true,"speed":12,"crit_chance":20,"crit_mult":1.9,"status_chance":40,"shot_type":"Hit-Scan","damage":{"Heat":180}},{"name":"Grenade Impact","multishot":3,"speed":0.25,"crit_chance":30,"crit_mult":2.4,"status_chance":16.7,"damage":{"Impact":20}},{"name":"Radial Attack","multishot":3,"speed":0.25,"crit_chance":30,"crit_mult":2.4,"status_chance":16.7,"shot_type":"AoE","damage":{"Blast":2000},"no_headshot_mult":true}],"name":"Cortege (Atmo-mode)","imageName":"Cortege.webp","tags":[],"compTags":[]},
  "Corvas (Atmo-mode)":{"masteryReq":1,"description":"When fully charged, this flak-cannon delivers a devastating shot. Perfect for taking down fast-moving interceptors.","releaseDate":"2018-12-18","ammoCapacity":100,"productCategory":"Archguns","zoomProps":[[]],"category":"Archgun","type":"Archgun","magazineSize":25,"reloadTime":2,"multishot":11,"attacks":[{"name":"Uncharged Shot","multishot":11,"punch_through":2.4,"speed":2,"crit_chance":40,"crit_mult":3,"status_chance":1.3,"shot_type":"Hit-Scan","unique":{"force_procs":["impact"]},"damage":{"Impact":64,"Puncture":8,"Slash":8}},{"name":"Charged Shot","multishot":11,"punch_through":2.4,"speed":2,"crit_chance":40,"crit_mult":3,"status_chance":1.3,"shot_type":"Hit-Scan","unique":{"force_procs":["impact"]},"damage":{"Impact":128,"Puncture":16,"Slash":16},"charge_time":0.5}],"name":"Corvas (Atmo-mode)","imageName":"Corvas.webp","tags":[""],"compTags":["BATTERY"]},
  "Corvas Prime (Atmo-mode)":{"masteryReq":14,"description":"Flaunting ceremonial beauty, this arch-gun flak-cannon is even more devastating than its standard issue counterpart.","releaseDate":"2022-03-28","ammoCapacity":120,"productCategory":"Archguns","zoomProps":[[]],"category":"Archgun","type":"Archgun","magazineSize":20,"reloadTime":2,"multishot":1,"attacks":[{"name":"Uncharged Shot","speed":2,"crit_chance":44,"crit_mult":3,"status_chance":20,"shot_type":"Projectile","shot_speed":400,"unique":{"force_procs":["impact"]},"damage":{"Impact":230,"Heat":330}},{"name":"Charged Shot","speed":2,"crit_chance":56,"crit_mult":3,"status_chance":20,"shot_type":"Projectile","shot_speed":400,"unique":{"force_procs":["impact"]},"damage":{"Impact":430,"Heat":530},"charge_time":0.5}],"name":"Corvas Prime (Atmo-mode)","imageName":"CorvasPrime.webp","tags":[""],"compTags":["BATTERY"]},
  "Cronus":{"masteryReq":0,"description":"A strong blade forged using ceramic.","blockingAngle":55,"comboDuration":5,"followThrough":0.6,"range":2.5,"windUp":0.6,"releaseDate":"2012-10-25","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"106","slam":{"damage":"318.00","radial":{"damage":"106.00","radius":7}},"speed":0.917,"crit_chance":6,"crit_mult":1.5,"status_chance":18,"damage":{"Impact":31.8,"Slash":58.3,"Puncture":15.9}},{"name":"Slam","radius":7,"type":"s","isHeavy":false,"speed":1,"crit_chance":6,"crit_mult":1.5,"status_chance":18,"unique":{"force_procs":["impact"]},"damage":{"Impact":212}},{"name":"Heavy Slam","radius":8,"type":"hs","isHeavy":true,"speed":1,"crit_chance":6,"crit_mult":1.5,"status_chance":18,"damage":{"Impact":318}}],"name":"Cronus","imageName":"cronus.webp","tags":["Tenno","Grineer"],"compTags":["SWORDS_STANCE"]},
  "Cyath (Machete)":{"masteryReq":0,"description":"","comboDuration":5,"range":1,"windUp":1,"releaseDate":"2017-10-12","productCategory":"Melee","category":"Melee","type":"Zaw Component","multishot":1,"attacks":[{"name":"Cyath Strike","speed":0.92,"crit_chance":18,"crit_mult":2,"status_chance":18,"damage":{"Impact":46,"Slash":172.5,"Puncture":11.5}}],"name":"Cyath (Machete)","imageName":"cyath.webp","tags":[],"compTags":["MACHETES_STANCE"]},
  "Corufell":{"masteryReq":8,"description":"Heavy Attacks briefly transform the Corufell to allow for a charged blast to enemies at range. After the blast, the Corufell returns to its Heavy Scythe state. Its transformation is fastest in Citrine's hands.","blockingAngle":65,"comboDuration":5,"followThrough":0.4,"range":2.6,"windUp":1,"releaseDate":"2023-02-15","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","slide":"400","slam":{"damage":"600.00","radial":{"damage":"200.00","radius":8}},"isHeavy":false,"speed":1,"crit_chance":26,"crit_mult":2.4,"status_chance":14,"damage":{"Impact":96,"Slash":36,"Puncture":68}},{"name":"Charged Projectile","isCoMult":true,"type":"h","isHeavy":true,"speed":0.83,"crit_chance":26,"crit_mult":2.4,"status_chance":14,"shot_type":"Projectile","shot_speed":90,"damage":{"Heat":600}},{"name":"Slam","radius":8,"type":"s","isHeavy":false,"speed":1,"crit_chance":26,"crit_mult":2.4,"status_chance":14,"unique":{"force_procs":["impact"]},"damage":{"Blast":400}},{"name":"Heavy Slam","radius":9,"type":"hs","isHeavy":true,"speed":1,"crit_chance":26,"crit_mult":2.4,"status_chance":14,"damage":{"Blast":600}}],"name":"Corufell","imageName":"corufell.webp","tags":[""],"compTags":["HEAVY SCYTHE_STANCE"]},
  "Cyanex":{"masteryReq":8,"description":"Sentient tech merges with Corpus design to deliver this lethal sidearm. Fully automatic, it fires ricocheting, homing projectiles that release small clouds of Gas on impact. Alt-fire to release the entire magazine without homing as a single burst.","noise":"Alarming","releaseDate":"2019-05-22","productCategory":"Pistols","zoomProps":[[]],"category":"Secondary","trigger":"Auto","type":"Pistol","magazineSize":11,"reloadTime":2.2,"multishot":1,"attacks":[{"name":"Projectile Impact","isCoMult":true,"speed":4.67,"crit_chance":8,"crit_mult":1.4,"status_chance":32,"shot_type":"Projectile","shot_speed":24,"flight":24,"damage":{"Impact":50}},{"name":"Projectile Explosion","speed":4.67,"crit_chance":8,"crit_mult":1.4,"status_chance":32,"shot_type":"AoE","damage":{"Gas":41},"falloff":{"start":0,"end":0.7,"reduction":0.2},"no_headshot_mult":true},{"name":"Burst Mode","isCoMult":true,"punch_through":0.5,"speed":10.05,"crit_chance":8,"crit_mult":1.4,"status_chance":32,"shot_type":"Projectile","shot_speed":60,"flight":60,"damage":{"Impact":2.9,"Slash":38.9,"Puncture":30.2}}],"name":"Cyanex","imageName":"cyanex.webp","tags":["Corpus","Sentient"],"compTags":["PROJECTILE"],"comb":[[0,1]]},
  "Daikyu":{"masteryReq":10,"description":"Daikyu takes great strength to draw back, but provides added power and range to every shot.","noise":"Silent","releaseDate":"2015-05-12","ammoCapacity":72,"productCategory":"LongGuns","zoomProps":[[]],"category":"Primary","trigger":"Charge","type":"Rifle","magazineSize":1,"reloadTime":0.6,"multishot":1,"attacks":[{"name":"Charged Shot","punch_through":3,"speed":1,"crit_chance":34,"crit_mult":2,"status_chance":46,"shot_type":"Projectile","shot_speed":140,"flight":140,"unique":{"force_procs":["impact"]},"damage":{"Impact":210,"Slash":210,"Puncture":280},"charge_time":1}],"name":"Daikyu","imageName":"daikyu.webp","tags":["Tenno"],"compTags":["PROJECTILE","DAIKYU"]},
  "Cyngas (Atmo-mode)":{"masteryReq":4,"description":"Unload deadly accurate bursts of mayhem.","releaseDate":"2018-12-18","ammoCapacity":480,"productCategory":"Archguns","zoomProps":[[]],"category":"Archgun","type":"Archgun","magazineSize":30,"reloadTime":1.2,"multishot":1,"attacks":[{"name":"Projectile Impact","punch_through":1.5,"speed":6.67,"crit_chance":20,"crit_mult":2.2,"status_chance":30,"shot_type":"Hit-Scan","damage":{"Impact":80,"Puncture":80,"Slash":80},"burst_count":3,"burst_delay":0.06}],"name":"Cyngas (Atmo-mode)","imageName":"Cyngas.webp","tags":[],"compTags":[""]},
  "Cycron":{"masteryReq":8,"description":"Forgo ammunition with the regenerating energy disc in this plasma throwing pistol.","noise":"Alarming","releaseDate":"2017-04-26","ammoCapacity":320,"productCategory":"Pistols","zoomProps":[[]],"category":"Secondary","trigger":"Held","type":"Pistol","magazineSize":40,"reloadTime":2,"multishot":1,"attacks":[{"name":"Normal Attack","isBeam":true,"punch_through":1,"speed":12,"crit_chance":12,"crit_mult":1.8,"status_chance":30,"shot_type":"Discharge","damage":{"Slash":5,"Puncture":8,"Radiation":10}}],"reloadRate":40,"reloadDelay":1,"name":"Cycron","imageName":"cycron.webp","tags":["Corpus"],"compTags":["BEAM"]},
  "Cyath (Polearm)":{"masteryReq":0,"description":"","comboDuration":5,"range":1,"windUp":1,"releaseDate":"2017-10-12","productCategory":"Melee","category":"Melee","type":"Zaw Component","multishot":1,"attacks":[{"name":"Cyath Strike","speed":0.92,"crit_chance":18,"crit_mult":2,"status_chance":18,"damage":{"Impact":46,"Slash":172.5,"Puncture":11.5}}],"name":"Cyath (Polearm)","imageName":"cyath.webp","tags":[],"compTags":["POLEARMS_STANCE"]},
  "Cyngas (Arch-mode)":{"masteryReq":4,"description":"Unload deadly accurate bursts of mayhem.","releaseDate":"2016-07-08","ammoCapacity":0,"productCategory":"Archguns","zoomProps":[[]],"category":"Archgun","trigger":"Auto Burst","type":"Archgun","magazineSize":30,"reloadTime":1.25,"multishot":1,"attacks":[{"name":"Projectile Impact","speed":6.67,"crit_chance":20,"crit_mult":2.2,"status_chance":30,"shot_type":"Projectile","shot_speed":220,"damage":{"Impact":39.6,"Puncture":39.6,"Slash":40.8},"burst_count":3,"burst_delay":0.06}],"reloadRate":30,"reloadDelay":0.25,"name":"Cyngas (Arch-mode)","imageName":"Cyngas.webp","tags":[],"compTags":["BATTERY"]},
  "Dark Split-Sword (Dual Swords)":{"masteryReq":5,"description":"Use as a devastating heavy sword or apply a Dual Melee stance and split the weapon into two ferocious blades.","blockingAngle":60,"comboDuration":5,"followThrough":0.5,"range":2.4,"windUp":0.7,"productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"232","slam":{"damage":"232.00","radial":{"damage":"116.00","radius":8}},"speed":1.17,"crit_chance":25,"crit_mult":2.5,"status_chance":15,"damage":{"Slash":28,"Puncture":56,"Radiation":32}},{"name":"Slam","radius":8,"type":"s","isHeavy":false,"speed":1,"crit_chance":25,"crit_mult":2.5,"status_chance":15,"unique":{"force_procs":["impact"]},"damage":{"Impact":232}},{"name":"Heavy Slam","radius":9,"type":"hs","isHeavy":true,"speed":1,"crit_chance":25,"crit_mult":2.5,"status_chance":15,"damage":{"Blast":348}}],"name":"Dark Split-Sword (Dual Swords)","imageName":"DarkSplitSwordDualSwords.webp","tags":[""],"compTags":["DUAL_SWORDS_STANCE"]},
  "Dark Sword":{"masteryReq":8,"description":"A blade forged using dark metals, capable of delivering innate <DT_RADIATION>Radiation Damage with attacks.","blockingAngle":55,"comboDuration":5,"followThrough":0.6,"range":2.5,"windUp":0.6,"releaseDate":"2012-12-18","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"260","slam":{"damage":"780.00","radial":{"damage":"260.00","element":"Toxin","radius":7}},"speed":0.833,"crit_chance":5,"crit_mult":1.5,"status_chance":40,"damage":{"Slash":60,"Puncture":120,"Radiation":80}},{"name":"Slam","radius":7,"type":"s","isHeavy":false,"speed":1,"crit_chance":5,"crit_mult":1.5,"status_chance":40,"unique":{"force_procs":["impact"]},"damage":{"Toxin":520}},{"name":"Heavy Slam","radius":8,"type":"hs","isHeavy":true,"speed":1,"crit_chance":5,"crit_mult":1.5,"status_chance":40,"unique":{"force_procs":["toxin"]},"damage":{"Toxin":780}}],"name":"Dark Sword","imageName":"dark-sword.webp","tags":["Tenno"],"compTags":["SWORDS_STANCE"]},
  "Dakra Prime":{"masteryReq":10,"description":"The Dakra Prime is a Tenno forged weapon, crafted during the time of the Orokin. It is renowned for speed, power and the ability to hit multiple targets.","blockingAngle":55,"comboDuration":5,"followThrough":0.6,"range":2.5,"windUp":0.6,"releaseDate":"2013-09-13","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"170","slam":{"damage":"510.00","radial":{"damage":"170.00","element":"Impact","radius":7}},"speed":1,"crit_chance":36,"crit_mult":2.4,"status_chance":18,"damage":{"Impact":17,"Slash":136,"Puncture":17}},{"name":"Slam","radius":7,"type":"s","isHeavy":false,"speed":1,"crit_chance":36,"crit_mult":2.4,"status_chance":18,"unique":{"force_procs":["impact"]},"damage":{"Impact":340}},{"name":"Heavy Slam","radius":8,"type":"hs","isHeavy":true,"speed":1,"crit_chance":36,"crit_mult":2.4,"status_chance":18,"damage":{"Blast":510}}],"name":"Dakra Prime","imageName":"dakra-prime.webp","tags":["Prime","Vaulted"],"compTags":["SWORDS_STANCE"]},
  "Dera":{"masteryReq":4,"description":"The Dera is a repeater that fires super-heated plasma.","noise":"Alarming","releaseDate":"2013-05-23","ammoCapacity":540,"productCategory":"LongGuns","category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":45,"reloadTime":1.8,"multishot":1,"attacks":[{"name":"Normal Attack","speed":11.25,"crit_chance":8,"crit_mult":1.6,"status_chance":22,"shot_type":"Projectile","shot_speed":100,"flight":100,"damage":{"Impact":6,"Slash":1.5,"Puncture":22.5}},{"name":"Incarnon Form","punch_through":3,"speed":2,"crit_chance":22,"crit_mult":3,"status_chance":18,"shot_type":"Hit-Scan","damage":{"Impact":40,"Slash":80,"Puncture":130,"Magnetic":80}}],"incMagazineSize":50,"name":"Dera","imageName":"dera.webp","tags":["Incarnon"],"compTags":["PROJECTILE","ASSAULT_AMMO"]},
  "Dark Split-Sword (Heavy Blade)":{"masteryReq":5,"description":"Use as a devastating heavy sword or apply a Dual Melee stance and split the weapon into two ferocious blades.","blockingAngle":55,"comboDuration":5,"followThrough":0.6,"range":2.8,"windUp":1.1,"productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":0.92,"crit_chance":15,"crit_mult":2,"status_chance":25,"damage":{"Slash":52,"Puncture":78,"Radiation":100}},{"name":"Slam","radius":8,"type":"s","isHeavy":false,"speed":1,"crit_chance":15,"crit_mult":2,"status_chance":25,"unique":{"force_procs":["impact"]},"damage":{"Slash":104,"Puncture":156,"Radiation":200}},{"name":"Heavy Slam","radius":9,"type":"hs","isHeavy":true,"speed":1,"crit_chance":15,"crit_mult":2,"status_chance":25,"damage":{"Blast":690}}],"name":"Dark Split-Sword (Heavy Blade)","imageName":"DarkSplitSwordHeavyBlade.webp","tags":[""],"compTags":["HEAVY_BLADE_STANCE"]},
  "Dehtat (Polearm)":{"masteryReq":0,"description":"","comboDuration":5,"range":1,"windUp":1,"releaseDate":"2017-10-12","productCategory":"Melee","category":"Melee","type":"Zaw Component","multishot":1,"attacks":[{"name":"Dehtat Strike","speed":0.92,"crit_chance":18,"crit_mult":2,"status_chance":18,"damage":{"Impact":22.4,"Slash":89.6,"Puncture":112}}],"name":"Dehtat (Polearm)","imageName":"dehtat.webp","tags":[],"compTags":["POLEARMS_STANCE"]},
  "Daikyu Prime":{"masteryReq":15,"description":"Long believed lost, the mighty Daikyu Prime was the pride of many a Tenno Dojo. The strength demanded to draw it is repaid in added range and power.","noise":"Silent","releaseDate":"2025-05-21","ammoCapacity":72,"productCategory":"LongGuns","zoomProps":[[]],"category":"Primary","trigger":"Charge","type":"Rifle","magazineSize":1,"reloadTime":0.6,"multishot":1,"attacks":[{"name":"Quick Shot","punch_through":3,"speed":1,"crit_chance":40,"crit_mult":2.4,"status_chance":50,"shot_type":"Projectile","unique":{"force_procs":["impact"]},"damage":{"Impact":112.5,"Slash":112.5,"Puncture":150}},{"name":"Charged Shot","punch_through":3,"speed":1,"crit_chance":40,"crit_mult":2.4,"status_chance":50,"shot_type":"Projectile","unique":{"force_procs":["impact"]},"damage":{"Impact":225,"Slash":225,"Puncture":300},"charge_time":1}],"name":"Daikyu Prime","imageName":"DaikyuPrime.webp","tags":["Tenno"],"compTags":["PROJECTILE","DAIKYU"]},
  "Dehtat (Rapier)":{"masteryReq":0,"description":"","comboDuration":5,"range":1,"windUp":1,"releaseDate":"2017-10-12","productCategory":"Melee","category":"Melee","type":"Zaw Component","multishot":1,"attacks":[{"name":"Dehtat Strike","speed":0.92,"crit_chance":18,"crit_mult":2,"status_chance":18,"damage":{"Impact":22.4,"Slash":89.6,"Puncture":112}}],"name":"Dehtat (Rapier)","imageName":"dehtat.webp","tags":[],"compTags":["RAPIER_STANCE"]},
  "Dark Dagger":{"masteryReq":2,"description":"This short blade weapon forged using dark metals has limited range but comes out fast.","blockingAngle":45,"comboDuration":5,"followThrough":0.9,"range":1.75,"windUp":0.4,"releaseDate":"2012-12-18","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"308","slam":{"damage":"308.00","radial":{"damage":"154.00","radius":5}},"speed":0.917,"crit_chance":8,"crit_mult":1.5,"status_chance":22,"damage":{"Slash":36,"Puncture":58,"Radiation":60}},{"name":"Slam","radius":5,"type":"s","isHeavy":false,"speed":1,"crit_chance":8,"crit_mult":1.5,"status_chance":22,"unique":{"force_procs":["impact"]},"damage":{"Impact":308}},{"name":"Heavy Slam","radius":6,"type":"hs","isHeavy":true,"speed":1,"crit_chance":8,"crit_mult":1.5,"status_chance":22,"damage":{"Radiation":462}}],"name":"Dark Dagger","imageName":"dark-dagger.webp","tags":["Tenno"],"compTags":["DAGGERS_STANCE","DARK DAGGER"]},
  "Dera Vandal":{"masteryReq":7,"description":"A customized version of the Dera, featuring a metallic finish and Lotus decal.","noise":"Alarming","releaseDate":"2015-05-12","ammoCapacity":540,"productCategory":"LongGuns","category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":60,"reloadTime":1.8,"multishot":1,"attacks":[{"name":"Normal Attack","speed":11.25,"crit_chance":8,"crit_mult":2,"status_chance":30,"shot_type":"Projectile","shot_speed":150,"flight":150,"damage":{"Impact":6.4,"Slash":1.6,"Puncture":24}},{"name":"Incarnon Form","punch_through":3,"speed":2,"crit_chance":30,"crit_mult":3,"status_chance":22,"shot_type":"Hit-Scan","damage":{"Impact":50,"Slash":90,"Puncture":140,"Magnetic":90}}],"incMagazineSize":50,"name":"Dera Vandal","imageName":"dera-vandal.webp","tags":["Corpus","Vandal","Incarnon"],"compTags":["PROJECTILE","ASSAULT_AMMO"]},
  "Detron":{"masteryReq":6,"description":"The sleek lines of the Detron conceal its ferocious nature. The hand cannon's semi-automatic action takes down enemies with speed and efficiency.","noise":"Alarming","releaseDate":"2013-12-31","productCategory":"Pistols","category":"Secondary","trigger":"Semi","type":"Pistol","magazineSize":5,"reloadTime":1.05,"multishot":7,"attacks":[{"name":"Normal Attack","speed":3.33,"crit_chance":4,"crit_mult":1.5,"status_chance":12.86,"shot_type":"Projectile","shot_speed":150,"flight":150,"damage":{"Radiation":40},"falloff":{"start":13,"end":22,"reduction":0.6231}}],"name":"Detron","imageName":"detron.webp","tags":["Corpus"],"compTags":["PROJECTILE","SECONDARYSHOTGUN","SINGLESHOT"]},
  "Desert Wind (Baruuk)":{"masteryReq":0,"description":"Desert Wind is Baruuk's and Baruuk Prime's signature Exalted Weapon.","blockingAngle":60,"comboDuration":5,"followThrough":1,"range":1.2,"windUp":0.5,"releaseDate":"2018-06-15","productCategory":"Melee","category":"Melee","type":"Exalted Weapon","multishot":1,"attacks":[{"name":"Normal Attack","slide":"750","slam":{"damage":"750.00","radial":{"damage":"250.00","radius":8}},"speed":1,"crit_chance":35,"crit_mult":2,"status_chance":15,"damage":{"Impact":250}},{"name":"Slam","radius":8,"type":"s","isHeavy":false,"speed":1,"crit_chance":35,"crit_mult":2,"status_chance":15,"damage":{"Impact":500}},{"name":"Heavy Slam","radius":9,"type":"hs","isHeavy":true,"speed":1,"crit_chance":35,"crit_mult":2,"status_chance":15,"damage":{"Blast":750}}],"name":"Desert Wind (Baruuk)","imageName":"DesertWind.webp","tags":[],"compTags":["DESERT_WIND_STANCE","POWER_WEAPON","BARUUK"]},
  "Despair":{"masteryReq":4,"description":"Used by The Stalker, Despair throwing blades have a mono-filament edge, sharp enough to penetrate a Warframe.","noise":"Silent","releaseDate":"2013-05-23","productCategory":"Pistols","category":"Secondary","trigger":"Auto","type":"Throwing","magazineSize":10,"reloadTime":0.75,"multishot":1,"attacks":[{"name":"Normal Attack","speed":3.33,"crit_chance":16,"crit_mult":1.6,"status_chance":16,"shot_type":"Projectile","shot_speed":70,"flight":70,"damage":{"Impact":2.9,"Slash":8.7,"Puncture":46.4}},{"name":"Incarnon Form","isInc":1,"speed":3,"crit_chance":30,"crit_mult":3,"status_chance":20,"shot_type":"Projectile","damage":{"Impact":3,"Slash":9,"Puncture":48}},{"name":"Incarnon Form Radial Attack","isInc":1,"speed":3,"crit_chance":30,"crit_mult":3,"status_chance":20,"shot_type":"AoE","damage":{"Heat":160},"no_headshot_mult":true}],"incMagazineSize":20,"name":"Despair","imageName":"despair.webp","tags":["Stalker","Incarnon"],"compTags":["PROJECTILE","THROWN"],"comb":[[1,2]]},
  "Dex Dakra":{"masteryReq":6,"description":"A gift from the Lotus to commemorate the anniversary of the first Tenno waking from Cryo stasis.","blockingAngle":60,"comboDuration":5,"followThrough":0.5,"range":2.5,"windUp":0.7,"releaseDate":"2015-03-25","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"284","slam":{"damage":"284.00","radial":{"damage":"142.00","element":"Blast","radius":8}},"speed":0.883,"crit_chance":16,"crit_mult":2,"status_chance":24,"damage":{"Impact":14.2,"Slash":113.6,"Puncture":14.2}},{"name":"Slam","radius":8,"type":"s","isHeavy":false,"speed":1,"crit_chance":16,"crit_mult":2,"status_chance":24,"unique":{"force_procs":["impact"]},"damage":{"Blast":284}},{"name":"Heavy Slam","radius":9,"type":"hs","isHeavy":true,"speed":1,"crit_chance":16,"crit_mult":2,"status_chance":24,"damage":{"Blast":426}}],"name":"Dex Dakra","imageName":"dex-dakra.webp","tags":["Tenno"],"compTags":["DUAL_SWORDS_STANCE"]},
  "Dex Nikana":{"masteryReq":8,"description":"A gift from the Lotus to commemorate the eleventh anniversary of the first Tenno waking from Cryo stasis.","blockingAngle":55,"comboDuration":5,"followThrough":0.7,"range":2.5,"windUp":0.5,"releaseDate":"2024-03-27","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":1,"crit_chance":24,"crit_mult":2.6,"status_chance":18,"damage":{"Impact":16.8,"Slash":126,"Puncture":25.2}},{"name":"Slam","radius":6,"type":"s","isHeavy":false,"speed":1,"crit_chance":24,"crit_mult":2.6,"status_chance":18,"unique":{"force_procs":["impact"]},"damage":{"Impact":336}},{"name":"Heavy Slam","radius":7,"type":"hs","isHeavy":true,"speed":1,"crit_chance":24,"crit_mult":2.6,"status_chance":18,"damage":{"Blast":504}}],"name":"Dex Nikana","imageName":"dex-nikana.webp","tags":[],"compTags":["NIKANAS_STANCE"]},
  "Destreza Prime":{"masteryReq":10,"description":"Take mastery to the next level with this primed rapier.","blockingAngle":60,"comboDuration":5,"followThrough":0.7,"range":2.5,"windUp":0.5,"releaseDate":"2018-06-19","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"170","slam":{"damage":"510.00","radial":{"damage":"170.00","element":"Impact","radius":6}},"speed":0.917,"crit_chance":32,"crit_mult":3,"status_chance":20,"damage":{"Impact":20.4,"Slash":30.6,"Puncture":119}},{"name":"Slam","radius":6,"type":"s","isHeavy":false,"speed":1,"crit_chance":32,"crit_mult":3,"status_chance":20,"unique":{"force_procs":["impact"]},"damage":{"Impact":340}},{"name":"Heavy Slam","radius":7,"type":"hs","isHeavy":true,"speed":1,"crit_chance":32,"crit_mult":3,"status_chance":20,"damage":{"Blast":510}}],"name":"Destreza Prime","imageName":"destreza-prime.webp","tags":["Prime","Incarnon"],"compTags":["RAPIER_STANCE"]},
  "Destreza":{"masteryReq":7,"description":"Elevate martial combat into an art form with this Tenno rapier.","blockingAngle":60,"comboDuration":5,"followThrough":0.7,"range":2.5,"windUp":0.5,"releaseDate":"2016-01-13","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"158","slam":{"damage":"474.00","radial":{"damage":"158.00","radius":6}},"speed":1,"crit_chance":28,"crit_mult":2,"status_chance":14,"damage":{"Impact":3.95,"Slash":19.75,"Puncture":134.3}},{"name":"Slam","radius":6,"type":"s","isHeavy":false,"speed":1,"crit_chance":28,"crit_mult":2,"status_chance":14,"unique":{"force_procs":["impact"]},"damage":{"Impact":316}},{"name":"Heavy Slam","radius":7,"type":"hs","isHeavy":true,"speed":1,"crit_chance":28,"crit_mult":2,"status_chance":14,"damage":{"Blast":474}}],"name":"Destreza","imageName":"destreza.webp","tags":["Tenno","Incarnon"],"compTags":["RAPIER_STANCE"]},
  "Dex Furis":{"masteryReq":10,"description":"A gift from the Lotus to commemorate the anniversary of the first Tenno waking from Cryo stasis.","noise":"Alarming","releaseDate":"2014-03-26","ammoCapacity":400,"productCategory":"Pistols","category":"Secondary","trigger":"Auto","type":"Pistol","magazineSize":100,"reloadTime":2,"multishot":1,"attacks":[{"name":"Normal Attack","speed":20,"crit_chance":14,"crit_mult":2,"status_chance":28,"shot_type":"Hit-Scan","damage":{"Impact":2.4,"Slash":2.4,"Puncture":11.2}}],"name":"Dex Furis","imageName":"dex-furis.webp","tags":["Tenno"],"compTags":[]},
  "Dex Pixia (Titania)":{"masteryReq":0,"description":"The Dex Pixia are Titania's and Titania Prime's signature dual pistols.","noise":"Alarming","releaseDate":"2019-03-08","ammoCapacity":"Infinity","productCategory":"Dual Pistol","category":"Secondary","trigger":"Charge","type":"Exalted Weapon","magazineSize":60,"reloadTime":0.3,"multishot":1,"attacks":[{"name":"Normal Attack","speed":5.83,"crit_chance":10,"crit_mult":2,"status_chance":25,"shot_type":"Hit-Scan","damage":{"Impact":16,"Slash":128,"Puncture":16}}],"reloadRate":50,"reloadDelay":0.25,"name":"Dex Pixia (Titania)","imageName":"DexPixia.webp","tags":[""],"compTags":["POWER_WEAPON","BATTERY"]},
  "Dex Sybaris":{"masteryReq":7,"description":"A gift from the Lotus to commemorate the third anniversary of the first Tenno waking from Cryo stasis.","noise":"Alarming","releaseDate":"2016-03-22","ammoCapacity":200,"productCategory":"LongGuns","category":"Primary","trigger":"Burst","type":"Rifle","magazineSize":14,"reloadTime":1.5,"multishot":1,"attacks":[{"name":"Normal Attack","speed":3.33,"crit_chance":35,"crit_mult":2,"status_chance":10,"shot_type":"Hit-Scan","damage":{"Impact":22.5,"Slash":33.75,"Puncture":18.75},"burst_count":2,"burst_delay":0.09},{"name":"Incarnon Form","speed":3.33,"crit_chance":30,"crit_mult":3,"status_chance":20,"shot_type":"Hit-Scan","unique":{"force_procs":["blast"]},"damage":{"Impact":28.8,"Slash":43.2,"Puncture":24},"burst_count":4,"burst_delay":0.09}],"name":"Dex Sybaris","imageName":"dex-sybaris.webp","tags":["Tenno","Incarnon"],"compTags":["ASSAULT_AMMO"]},
  "Diwata Prime (Titania)":{"masteryReq":0,"description":"Take flight with Razorwing and summon this formidable heavy blade.","blockingAngle":90,"comboDuration":5,"followThrough":0.7,"range":2.5,"windUp":0.4,"noise":"Silent","releaseDate":"2020-03-31","productCategory":"Melee","category":"Melee","type":"Exalted Weapon","multishot":1,"attacks":[{"name":"Normal Attack","isHeavy":false,"speed":1.08,"crit_chance":20,"crit_mult":2,"status_chance":10,"damage":{"Impact":30,"Puncture":150,"Slash":20}}],"name":"Diwata Prime (Titania)","imageName":"DiwataPrime.webp","tags":[],"compTags":["TITANIA_STANCE","POWER_WEAPON"]},
  "Dread":{"masteryReq":5,"description":"Dread is the calling card of The Stalker. It fires arrows that can decapitate.","noise":"Silent","releaseDate":"2013-05-23","ammoCapacity":72,"productCategory":"LongGuns","category":"Primary","trigger":"Charge","type":"Rifle","magazineSize":1,"reloadTime":0.7,"multishot":1,"attacks":[{"name":"Uncharged Shot","speed":1,"crit_chance":50,"crit_mult":2,"status_chance":20,"shot_type":"Projectile","shot_speed":85,"flight":85,"damage":{"Impact":16.8,"Slash":134.4,"Puncture":16.8}},{"name":"Charged Shot","punch_through":2.5,"speed":1,"crit_chance":50,"crit_mult":2,"status_chance":20,"shot_type":"Projectile","shot_speed":100,"flight":100,"damage":{"Impact":16.8,"Slash":302.4,"Puncture":16.8},"charge_time":0.5},{"name":"Incarnon Form Charged Shot","isCoMult":true,"isInc":1,"punch_through":"Infinity","speed":1.5,"crit_chance":50,"crit_mult":3,"status_chance":30,"shot_type":"Projectile","damage":{"Impact":100,"Slash":100,"Heat":200},"no_headshot_mult":true,"charge_time":0.6}],"incMagazineSize":20,"name":"Dread","imageName":"dread.webp","tags":["Stalker","Incarnon"],"compTags":["PROJECTILE","DREAD"]},
  "Dorrclave":{"masteryReq":8,"description":"After 20 kills or assists, Dorrclave enters a spectral state that doubles weapon Follow Through and guarantees Status Effects for the next 20 attacks. In Dagath's hands, each active Status Effect heals her slightly.","blockingAngle":60,"comboDuration":5,"followThrough":0.5,"range":2.5,"windUp":0.4,"releaseDate":"2023-10-18","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":0.83,"crit_chance":26,"crit_mult":2.2,"status_chance":24,"damage":{"Slash":222}},{"name":"Spectral Attack","speed":0.83,"crit_chance":26,"crit_mult":2.2,"status_chance":24,"unique":{"absolute_status_chance":100},"damage":{"Slash":222}},{"name":"Slam","radius":7,"type":"s","isHeavy":false,"speed":1,"crit_chance":26,"crit_mult":2.2,"status_chance":24,"unique":{"force_procs":["impact"]},"damage":{"Slash":444}},{"name":"Heavy Slam","radius":8,"type":"hs","isHeavy":true,"speed":1,"crit_chance":26,"crit_mult":2.2,"status_chance":24,"damage":{"Slash":666}}],"name":"Dorrclave","imageName":"Dorrclave.webp","tags":["Tenno"],"compTags":["BLADE_AND_WHIP_STANCE"]},
  "Dokrahm (Scythe)":{"masteryReq":0,"description":"","comboDuration":5,"range":1,"windUp":1,"releaseDate":"2018-04-20","productCategory":"Melee","category":"Melee","type":"Zaw Component","multishot":1,"attacks":[{"name":"Dokrahm Strike","speed":1,"crit_chance":18,"crit_mult":2,"status_chance":18,"damage":{"Impact":46.4,"Slash":154.5,"Puncture":108.1}}],"name":"Dokrahm (Scythe)","imageName":"dokrahm.webp","tags":[],"compTags":["SCYTHES_STANCE"]},
  "Drakgoon":{"masteryReq":5,"description":"The Drakgoon flak cannon sends volleys of intensely hot shrapnel ricocheting around the room. Can be fired in wide or concentrated bursts.","noise":"Alarming","releaseDate":"2014-01-08","ammoCapacity":120,"productCategory":"LongGuns","zoomProps":[[]],"category":"Primary","trigger":"Charge","type":"Rifle","magazineSize":7,"reloadTime":2.3,"multishot":10,"attacks":[{"name":"Uncharged Shot","speed":3.33,"crit_chance":5,"crit_mult":2,"status_chance":6.3,"shot_type":"Projectile","shot_speed":100,"flight":100,"damage":{"Impact":8,"Slash":24,"Puncture":8}},{"name":"Charged Shot","punch_through":1.5,"speed":3.33,"crit_chance":7.5,"crit_mult":2,"status_chance":6.9,"shot_type":"Projectile","shot_speed":160,"flight":160,"damage":{"Impact":7,"Slash":56,"Puncture":7},"charge_time":0.5}],"name":"Drakgoon","imageName":"drakgoon.webp","tags":["Grineer"],"compTags":["PROJECTILE"]},
  "Dual Cestra":{"masteryReq":7,"description":"Wield two Cestras to unleash a dual torrent of high energy bolts.","noise":"Alarming","releaseDate":"2014-02-05","ammoCapacity":480,"productCategory":"Pistols","category":"Secondary","trigger":"Auto","type":"Pistol","magazineSize":120,"reloadTime":3.5,"multishot":1,"attacks":[{"name":"Normal Attack","speed":18.75,"crit_chance":6,"crit_mult":1.6,"status_chance":20,"shot_type":"Projectile","shot_speed":100,"flight":100,"damage":{"Impact":5.2,"Puncture":20.8}}],"name":"Dual Cestra","imageName":"dual-cestra.webp","tags":["Corpus"],"compTags":["PROJECTILE"]},
  "Dragon Nikana":{"masteryReq":8,"description":"The Dragon Nikana is forged from ancient Tenno steel. This is a master's weapon, only the most worthy of Tenno may wield it.","blockingAngle":55,"comboDuration":5,"followThrough":0.7,"range":2.5,"windUp":0.5,"releaseDate":"2014-04-09","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"376","slam":{"damage":"564.00","radial":{"damage":"188.00","element":"Impact","radius":6}},"speed":1,"crit_chance":22,"crit_mult":2,"status_chance":22,"damage":{"Impact":9.4,"Slash":159.8,"Puncture":18.8}},{"name":"Slam","radius":6,"type":"s","isHeavy":false,"speed":1,"crit_chance":22,"crit_mult":2,"status_chance":22,"unique":{"force_procs":["impact"]},"damage":{"Impact":376}},{"name":"Heavy Slam","radius":7,"type":"hs","isHeavy":true,"speed":1,"crit_chance":22,"crit_mult":2,"status_chance":22,"damage":{"Blast":569}}],"name":"Dragon Nikana","imageName":"dragon-nikana.webp","tags":["Tenno"],"compTags":["NIKANAS_STANCE"]},
  "Dokrahm (Heavy Blade)":{"masteryReq":0,"description":"","comboDuration":5,"range":1,"windUp":1,"releaseDate":"2018-04-20","productCategory":"Melee","category":"Melee","type":"Zaw Component","multishot":1,"attacks":[{"name":"Dokrahm Strike","speed":1,"crit_chance":18,"crit_mult":2,"status_chance":18,"damage":{"Impact":46.4,"Slash":154.5,"Puncture":108.1}}],"name":"Dokrahm (Heavy Blade)","imageName":"dokrahm.webp","tags":[],"compTags":["HEAVY_BLADE_STANCE"]},
  "Dual Cleavers":{"masteryReq":5,"description":"Butcher your foes with brutal blades in each hand.","blockingAngle":60,"comboDuration":5,"followThrough":0.5,"range":1.7,"windUp":0.7,"releaseDate":"2013-05-23","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","slide":"314","slam":{"damage":"314.00","radial":{"damage":"157.00","radius":8}},"speed":0.833,"crit_chance":25,"crit_mult":3,"status_chance":10,"damage":{"Impact":23.55,"Slash":109.9,"Puncture":23.55}},{"name":"Slam","radius":8,"type":"s","isHeavy":false,"speed":1,"crit_chance":25,"crit_mult":3,"status_chance":10,"unique":{"force_procs":["impact"]},"damage":{"Impact":314}},{"name":"Heavy Slam","radius":9,"type":"hs","isHeavy":true,"speed":1,"crit_chance":25,"crit_mult":3,"status_chance":10,"damage":{"Blast":471}}],"name":"Dual Cleavers","imageName":"dual-cleavers.webp","tags":["Grineer"],"compTags":["DUAL_SWORDS_STANCE","DUAL CLEAVERS"]},
  "Dual Coda Torxica":{"masteryReq":17,"description":"Get the job done right with a pair of spore flinging terror tools. Inflicts a spore that spreads to nearby enemies on death causing Cold Status Effect and increased vulnerability to damage from the Torxica.","noise":"Alarming","releaseDate":"2025-03-19","ammoCapacity":480,"productCategory":"Pistols","category":"Secondary","trigger":"Auto","type":"Pistol","magazineSize":160,"reloadTime":2.33,"multishot":1,"attacks":[{"name":"Normal Attack","speed":6,"crit_chance":25,"crit_mult":2.4,"status_chance":28,"shot_type":"Hit-Scan","unique":{"WITH_COND":{"speed":1.5,"ammoEff":1}},"damage":{"Slash":32.5,"Puncture":17.5}}],"name":"Dual Coda Torxica","imageName":"DualCodaTorxica.webp","tags":["Coda"],"compTags":[]},
  "Dual Decurion (Arch-mode)":{"masteryReq":1,"description":"Delivering twin streams of highly accurate, rapid-fire ordnance, the Decurion are specifically designed for combat in the vacuum of space.","releaseDate":"2014-11-27","ammoCapacity":0,"productCategory":"Archguns","zoomProps":[[]],"category":"Archgun","type":"Archgun","magazineSize":64,"reloadTime":0.89,"multishot":1,"attacks":[{"name":"Normal Attack","punch_through":1.2,"speed":10.42,"crit_chance":28,"crit_mult":2.2,"status_chance":14,"shot_type":"Projectile","shot_speed":220,"damage":{"Impact":49.5,"Puncture":30.3,"Slash":30.2}}],"reloadRate":50,"reloadDelay":0.25,"name":"Dual Decurion (Arch-mode)","imageName":"DualDecurion.webp","tags":[""],"compTags":["BATTERY"]},
  "Dual Decurion (Atmo-mode)":{"masteryReq":1,"description":"Delivering twin streams of highly accurate, rapid-fire ordnance, the Decurion are specifically designed for combat in the vacuum of space.","releaseDate":"2014-11-27","ammoCapacity":512,"productCategory":"Archguns","zoomProps":[[]],"category":"Archgun","type":"Archgun","magazineSize":64,"reloadTime":1.4,"multishot":1,"attacks":[{"name":"Normal Attack","speed":10.42,"crit_chance":28,"crit_mult":2.2,"status_chance":14,"shot_type":"Hit-Scan","damage":{"Impact":85.5,"Puncture":52.2,"Slash":52.2}}],"name":"Dual Decurion (Atmo-mode)","imageName":"DualDecurion.webp","tags":[""],"compTags":[""]},
  "Dual Keres":{"masteryReq":7,"description":"Tear through any target with these vicious, claw-like blades. The signature swords of Khora.","blockingAngle":60,"comboDuration":5,"followThrough":0.5,"range":2.5,"windUp":0.7,"releaseDate":"2018-04-20","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"230","slam":{"damage":"230.00","radial":{"damage":"115.00","radius":8}},"speed":1.25,"crit_chance":28,"crit_mult":2.6,"status_chance":14,"damage":{"Impact":13.8,"Slash":66.7,"Puncture":34.5}},{"name":"Slam","radius":8,"type":"s","isHeavy":false,"speed":1,"crit_chance":28,"crit_mult":2.6,"status_chance":14,"unique":{"force_procs":["impact"]},"damage":{"Impact":230}},{"name":"Heavy Slam","radius":9,"type":"hs","isHeavy":true,"speed":1,"crit_chance":28,"crit_mult":2.6,"status_chance":14,"damage":{"Blast":345}}],"name":"Dual Keres","imageName":"dual-keres.webp","tags":[],"compTags":["DUAL_SWORDS_STANCE"]},
  "Dual Ether":{"masteryReq":8,"description":"Fast and precise. The Dual Ether cuts so cleanly that it was considered by the Tenno to be a more humane weapon for ‘cleansing’ infested allies. Capable of hitting multiple targets.","blockingAngle":60,"comboDuration":5,"followThrough":0.5,"range":2.5,"windUp":0.7,"releaseDate":"2013-04-12","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"360","slam":{"damage":"360.00","radial":{"damage":"180.00","element":"Impact","radius":8}},"speed":1,"crit_chance":20,"crit_mult":2,"status_chance":28,"damage":{"Impact":27,"Slash":126,"Puncture":27}},{"name":"Slam","radius":8,"type":"s","isHeavy":false,"speed":1,"crit_chance":20,"crit_mult":2,"status_chance":28,"unique":{"force_procs":["impact"]},"damage":{"Impact":360}},{"name":"Heavy Slam","radius":9,"type":"hs","isHeavy":true,"speed":1,"crit_chance":20,"crit_mult":2,"status_chance":28,"damage":{"Blast":540}}],"name":"Dual Ether","imageName":"dual-ether.webp","tags":["Tenno"],"compTags":["DUAL_SWORDS_STANCE"]},
  "Dual Heat Swords":{"masteryReq":3,"description":"With a Heat Sword in each hand, enemies reach their fiery demise twice as fast. Can connect with multiple targets at once.","blockingAngle":60,"comboDuration":5,"followThrough":0.5,"range":2.5,"windUp":0.7,"releaseDate":"2013-02-08","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"294","slam":{"damage":"294.00","radial":{"damage":"147.00","element":"Heat","radius":8}},"speed":0.917,"crit_chance":5,"crit_mult":1.5,"status_chance":20,"damage":{"Impact":22.05,"Slash":102.9,"Puncture":22.05}},{"name":"Slam","radius":8,"type":"s","isHeavy":false,"speed":1,"crit_chance":5,"crit_mult":1.5,"status_chance":20,"unique":{"force_procs":["heat"]},"damage":{"Heat":294}},{"name":"Heavy Slam","radius":9,"type":"hs","isHeavy":true,"speed":1,"crit_chance":5,"crit_mult":1.5,"status_chance":20,"damage":{"Heat":441}}],"name":"Dual Heat Swords","imageName":"dual-heat-swords.webp","tags":["Tenno"],"compTags":["DUAL_SWORDS_STANCE"]},
  "Dual Kamas Prime":{"masteryReq":8,"description":"The sensual lines of these golden Kamas have long been celebrated as a masterwork of Tenno weapon smithing.","blockingAngle":60,"comboDuration":5,"followThrough":0.5,"range":2.4000001,"windUp":0.7,"releaseDate":"2015-10-06","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","slide":"320","slam":{"damage":"320.00","radial":{"damage":"160.00","radius":8}},"speed":1.17,"crit_chance":20,"crit_mult":2,"status_chance":25,"damage":{"Impact":8,"Slash":120,"Puncture":32}},{"name":"Slam","radius":8,"type":"s","isHeavy":false,"speed":1,"crit_chance":20,"crit_mult":2,"status_chance":25,"unique":{"force_procs":["impact"]},"damage":{"Impact":320}},{"name":"Heavy Slam","radius":9,"type":"hs","isHeavy":true,"speed":1,"crit_chance":20,"crit_mult":2,"status_chance":25,"damage":{"Blast":480}}],"name":"Dual Kamas Prime","imageName":"dual-kamas-prime.webp","tags":["Prime","Vaulted"],"compTags":["DUAL_SWORDS_STANCE"]},
  "Dual Ichor":{"masteryReq":6,"description":"The fast and brutal Dual Ichor axes will quickly tear through enemies with a high probability of inflicting Critical Damage.","blockingAngle":60,"comboDuration":5,"followThrough":0.5,"range":2.3,"windUp":0.7,"releaseDate":"2013-09-13","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":1.08,"crit_chance":25,"crit_mult":3,"status_chance":15,"damage":{"Impact":19,"Slash":45,"Puncture":11,"Toxin":47}},{"name":"Incarnon Form Toxin Field","noStanceFP":true,"noIncrStatus":true,"isInc":1,"speed":1.08,"crit_chance":0,"crit_mult":1,"status_chance":50,"shot_type":"AoE","damage":{"Toxin":440},"no_headshot_mult":true},{"name":"Slam","radius":8,"type":"s","isHeavy":false,"speed":1,"crit_chance":25,"crit_mult":3,"status_chance":15,"unique":{"force_procs":["impact"]},"damage":{"Impact":244}},{"name":"Heavy Slam","radius":9,"type":"hs","isHeavy":true,"speed":1,"crit_chance":25,"crit_mult":3,"status_chance":15,"damage":{"Blast":366}}],"name":"Dual Ichor","imageName":"dual-ichor.webp","tags":["Infested","Incarnon"],"compTags":["DUAL_SWORDS_STANCE"]},
  "Dual Kamas":{"masteryReq":1,"description":"Wielding a Kama in each hand brings a savage amount of <DT_SLASH>Slash Damage to bear against your enemies.","blockingAngle":60,"comboDuration":5,"followThrough":0.5,"range":2.4000001,"windUp":0.7,"releaseDate":"2013-11-27","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"192","slam":{"damage":"192.00","radial":{"damage":"96.00","radius":8}},"speed":1.17,"crit_chance":10,"crit_mult":1.5,"status_chance":15,"damage":{"Impact":4.8,"Slash":81.6,"Puncture":9.6}},{"name":"Slam","radius":8,"type":"s","isHeavy":false,"speed":1,"crit_chance":10,"crit_mult":1.5,"status_chance":15,"unique":{"force_procs":["impact"]},"damage":{"Impact":192}},{"name":"Heavy Slam","radius":9,"type":"hs","isHeavy":true,"speed":1,"crit_chance":10,"crit_mult":1.5,"status_chance":15,"damage":{"Blast":288}}],"name":"Dual Kamas","imageName":"dual-kamas.webp","tags":["Tenno"],"compTags":["DUAL_SWORDS_STANCE"]},
  "Dual Keres Prime":{"masteryReq":14,"description":"The hunted will meet a quick end when faced with Khora Prime's signature swords. Heavy Attack Efficiency is enhanced when wielded by Khora.","blockingAngle":60,"comboDuration":5,"followThrough":0.5,"range":2.5,"windUp":0.7,"releaseDate":"2022-05-21","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"360","slam":{"damage":"360.00","radial":{"damage":"180.00","radius":8}},"speed":1.25,"crit_chance":32,"crit_mult":2.6,"status_chance":24,"damage":{"Impact":21.6,"Slash":104.4,"Puncture":54}},{"name":"Slam","radius":8,"type":"s","isHeavy":false,"speed":1,"crit_chance":32,"crit_mult":2.6,"status_chance":24,"unique":{"force_procs":["impact"]},"damage":{"Impact":360}},{"name":"Heavy Slam","radius":9,"type":"hs","isHeavy":true,"speed":1,"crit_chance":32,"crit_mult":2.6,"status_chance":24,"damage":{"Blast":540}}],"name":"Dual Keres Prime","imageName":"dual-keres-prime.webp","tags":["Prime"],"compTags":["DUAL_SWORDS_STANCE"]},
  "Dual Raza":{"masteryReq":6,"description":"Razor sharp battle-hatchets, designed to compliment the Soma.","blockingAngle":60,"comboDuration":5,"followThrough":0.5,"range":2.4000001,"windUp":0.7,"releaseDate":"2015-04-09","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"220","slam":{"damage":"220.00","radial":{"damage":"110.00","radius":8}},"speed":0.917,"crit_chance":25,"crit_mult":3,"status_chance":10,"damage":{"Impact":11,"Slash":66,"Puncture":33}},{"name":"Slam","radius":8,"type":"s","isHeavy":false,"speed":1,"crit_chance":25,"crit_mult":3,"status_chance":10,"unique":{"force_procs":["impact"]},"damage":{"Impact":220}},{"name":"Heavy Slam","radius":9,"type":"hs","isHeavy":true,"speed":1,"crit_chance":25,"crit_mult":3,"status_chance":10,"damage":{"Blast":330}}],"name":"Dual Raza","imageName":"dual-raza.webp","tags":["Tenno"],"compTags":["DUAL_SWORDS_STANCE"]},
  "Dual Zoren Prime":{"masteryReq":13,"description":"Axes worthy of an executioner, refined to Orokin perfection.","blockingAngle":60,"comboDuration":5,"followThrough":0.5,"range":2.3,"windUp":0.7,"releaseDate":"2025-02-13","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":1.25,"crit_chance":30,"crit_mult":3.2,"status_chance":22,"damage":{"Impact":7,"Slash":126,"Puncture":7}},{"name":"Slam","radius":8,"type":"s","isHeavy":false,"speed":1,"crit_chance":30,"crit_mult":3.2,"status_chance":22,"unique":{"force_procs":["impact"]},"damage":{"Impact":280}},{"name":"Heavy Slam","radius":9,"type":"hs","isHeavy":true,"speed":1,"crit_chance":30,"crit_mult":3.2,"status_chance":22,"damage":{"Blast":420}}],"name":"Dual Zoren Prime","imageName":"DualZorenPrime.webp","tags":[],"compTags":["DUAL_SWORDS_STANCE"]},
  "Embolist":{"masteryReq":9,"description":"A living weapon, the infested Embolist pistol kills its victims with an acidic venomous gas.","noise":"Alarming","releaseDate":"2013-09-13","productCategory":"Pistols","equipTime":1.1,"zoomProps":[[]],"category":"Secondary","trigger":"Held","type":"Pistol","magazineSize":33,"reloadTime":1.3,"multishot":1,"attacks":[{"name":"Normal Attack","isBeam":true,"speed":8,"crit_chance":3,"crit_mult":1.5,"status_chance":41,"shot_type":"Discharge","damage":{"Toxin":35}}],"name":"Embolist","imageName":"embolist.webp","tags":["Infested"],"compTags":["BEAM","AOE","EMBOLIST"]},
  "Ekhein":{"masteryReq":10,"description":"Wield the timeless power of this mighty hammer. Heavy Attacks performed with Ekhein temporarily increase its Damage and Attack Speed.","blockingAngle":55,"comboDuration":5,"followThrough":0.4,"range":2.8,"windUp":1.2,"releaseDate":"2023-12-14","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","isHeavy":false,"speed":0.767,"crit_chance":30,"crit_mult":2.4,"status_chance":15,"damage":{"Impact":340}},{"name":"Heavy Attack","isHeavy":true,"speed":0.767,"crit_chance":30,"crit_mult":2.4,"status_chance":15,"unique":{"base":0.8,"speed":0.2},"damage":{"Impact":340}},{"name":"Slam","radius":9,"type":"s","isHeavy":false,"speed":1,"crit_chance":30,"crit_mult":2.4,"status_chance":15,"damage":{"Impact":680}},{"name":"Heavy Slam","radius":10,"type":"hs","isHeavy":true,"speed":1,"crit_chance":30,"crit_mult":2.4,"status_chance":15,"damage":{"Blast":1020}}],"name":"Ekhein","imageName":"Ekhein.webp","tags":[],"compTags":["HAMMERS_STANCE"]},
  "EFV-5 Jupiter":{"masteryReq":14,"description":"Perforate Techrot, and anyone else who stands in your way, with this Scaldra machine gun. Alternative fire pummels targets with Efervon laced buckshot.","noise":"Alarming","releaseDate":"2025-03-19","ammoCapacity":540,"productCategory":"LongGuns","category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":65,"reloadTime":2.5,"multishot":1,"attacks":[{"name":"Auto","speed":7.833334,"crit_chance":21,"crit_mult":2.3,"status_chance":25,"damage":{"Slash":23,"Puncture":31,"Corrosive":7}},{"name":"Buckshot","reloadTime":2.1,"multishot":11,"speed":7.833334,"crit_chance":21,"crit_mult":2.3,"status_chance":5.73,"damage":{"Slash":35,"Puncture":57,"Corrosive":35},"charge_time":1}],"name":"EFV-5 Jupiter","imageName":"EFV-5Jupiter.webp","tags":[],"compTags":["ASSAULT_AMMO"]},
  "Dual Toxocyst":{"masteryReq":11,"description":"Brain-strikes excite this bioweapon, causing it to rapidly release toxic munitions.","noise":"Alarming","releaseDate":"2016-03-04","ammoCapacity":60,"productCategory":"Pistols","category":"Secondary","trigger":"Semi","type":"Pistol","magazineSize":12,"reloadTime":2.35,"multishot":1,"attacks":[{"name":"Normal Attack","speed":1,"crit_chance":5,"crit_mult":2,"status_chance":37,"shot_type":"Hit-Scan","unique":{"WITH_COND":{"speed":1.5,"ammoEff":1}},"damage":{"Impact":7.5,"Slash":7.5,"Puncture":60}},{"name":"Incarnon Form","isInc":1,"speed":4.5,"crit_chance":11,"crit_mult":3,"status_chance":43,"shot_type":"Hit-Scan","unique":{"WITH_COND":{"speed_mult":1.5}},"damage":{"Impact":15,"Slash":22.5,"Puncture":37.5}}],"incMagazineSize":270,"name":"Dual Toxocyst","imageName":"dual-toxocyst.webp","tags":["Infested","Incarnon"],"compTags":[]},
  "Dual Viciss":{"masteryReq":14,"description":"Reap what the Techrot have sown with this vicious pair of Scaldra hand-scythes.","blockingAngle":60,"comboDuration":5,"followThrough":0.5,"range":2.4,"windUp":0.7,"productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":1,"crit_chance":23,"crit_mult":2.1,"status_chance":29,"damage":{"Slash":51,"Puncture":51,"Gas":153}},{"name":"Slam","radius":8,"type":"s","isHeavy":false,"speed":1,"crit_chance":23,"crit_mult":2.1,"status_chance":29,"damage":{"Impact":510}},{"name":"Heavy Slam","radius":9,"type":"hs","isHeavy":true,"speed":1,"crit_chance":23,"crit_mult":2.1,"status_chance":29,"damage":{"Blast":765}}],"name":"Dual Viciss","imageName":"DualViciss.webp","tags":[""],"compTags":["DUAL_SWORDS_STANCE"]},
  "Dual Skana":{"masteryReq":0,"description":"A shorter Skana in each hand. Can hit multiple targets.","blockingAngle":60,"comboDuration":5,"followThrough":0.5,"range":2.5,"windUp":0.7,"releaseDate":"2012-10-25","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"240","slam":{"damage":"240.00","radial":{"damage":"120.00","radius":8}},"speed":0.833,"crit_chance":5,"crit_mult":1.5,"status_chance":16,"damage":{"Impact":18,"Slash":84,"Puncture":18}},{"name":"Slam","radius":8,"type":"s","isHeavy":false,"speed":1,"crit_chance":5,"crit_mult":1.5,"status_chance":16,"unique":{"force_procs":["impact"]},"damage":{"Impact":240}},{"name":"Heavy Slam","radius":9,"type":"hs","isHeavy":true,"speed":1,"crit_chance":5,"crit_mult":1.5,"status_chance":16,"damage":{"Blast":360}}],"name":"Dual Skana","imageName":"dual-skana.webp","tags":["Tenno"],"compTags":["DUAL_SWORDS_STANCE"]},
  "Edun":{"masteryReq":0,"description":"Edun befits a dextrous warrior. Heavy Attack to throw Edun. Edun explodes after it is embedded in an enemy.","blockingAngle":55,"comboDuration":5,"followThrough":0.6,"range":3,"windUp":1,"productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","isHeavy":false,"speed":1,"crit_chance":34,"crit_mult":2.6,"status_chance":20,"damage":{"Impact":44,"Puncture":110,"Slash":66}},{"name":"Heavy Attack Throws","radius":5,"isHeavy":true,"speed":1,"crit_chance":34,"crit_mult":2.6,"status_chance":20,"damage":{"Impact":101.3,"Puncture":233.3,"Slash":145.4}},{"name":"Heavy Attack Throws AoE","radius":5,"isHeavy":true,"speed":1,"crit_chance":34,"crit_mult":2.6,"status_chance":20,"shot_type":"AoE","damage":{"Blast":400},"no_headshot_mult":true},{"name":"Slam","radius":7,"type":"s","isHeavy":false,"speed":1,"crit_chance":34,"crit_mult":2.6,"status_chance":20,"unique":{"force_procs":["impact"]},"damage":{"Impact":440}},{"name":"Heavy Slam","radius":9,"type":"hs","isHeavy":true,"speed":1,"crit_chance":34,"crit_mult":2.6,"status_chance":20,"damage":{"Blast":660}}],"name":"Edun","imageName":"edun.webp","tags":[""],"compTags":["POLEARMS_STANCE"]},
  "EFV-8 Mars":{"masteryReq":14,"description":"The standard issue personal Efervon projector, as sported by all ranks of Scaldra.","noise":"Alarming","releaseDate":"2025-03-19","ammoCapacity":210,"productCategory":"Pistols","category":"Secondary","trigger":"Semi-Auto","type":"Pistol","magazineSize":15,"reloadTime":1.667,"multishot":1,"attacks":[{"name":"Normal Attack","speed":6.5,"crit_chance":27,"crit_mult":2.1,"status_chance":17,"damage":{"Impact":20,"Puncture":55}},{"name":"Alt-Fire","ammoCost":3,"speed":6.5,"crit_chance":27,"crit_mult":2.1,"status_chance":33,"damage":{"Corrosive":35}},{"name":"Alt-Fire AoE","ammoCost":3,"speed":6.5,"crit_chance":27,"crit_mult":2.1,"status_chance":33,"shot_type":"AoE","damage":{"Corrosive":313},"no_headshot_mult":true,"charge_time":1}],"name":"EFV-8 Mars","imageName":"EFV-8Mars.webp","tags":[],"compTags":[""]},
  "Dual Zoren":{"masteryReq":2,"description":"Short axes held in each hand. High attack speed and can hit multiple targets. Delivers a high percentage of critical strikes.","blockingAngle":60,"comboDuration":5,"followThrough":0.5,"range":2.3,"windUp":0.7,"releaseDate":"2013-01-29","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"140","slam":{"damage":"140.00","radial":{"damage":"70.00","radius":8}},"speed":1.17,"crit_chance":25,"crit_mult":3,"status_chance":5,"damage":{"Impact":3.5,"Slash":63,"Puncture":3.5}},{"name":"Slam","radius":8,"type":"s","isHeavy":false,"speed":1,"crit_chance":25,"crit_mult":3,"status_chance":5,"unique":{"force_procs":["impact"]},"damage":{"Impact":140}},{"name":"Heavy Slam","radius":9,"type":"hs","isHeavy":true,"speed":1,"crit_chance":25,"crit_mult":3,"status_chance":5,"damage":{"Blast":210}}],"name":"Dual Zoren","imageName":"dual-zoren.webp","tags":["Tenno"],"compTags":["DUAL_SWORDS_STANCE"]},
  "Endura":{"masteryReq":7,"description":"The delicate form of this Tenno rapier conceals its ferocious and resilient force.","blockingAngle":60,"comboDuration":5,"followThrough":0.7,"range":2.5,"windUp":0.5,"releaseDate":"2017-05-24","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"200","slam":{"damage":"600.00","radial":{"damage":"200.00","radius":6}},"speed":0.917,"crit_chance":10,"crit_mult":2,"status_chance":36,"damage":{"Impact":10,"Slash":50,"Puncture":140}},{"name":"Slam","radius":6,"type":"s","isHeavy":false,"speed":1,"crit_chance":10,"crit_mult":2,"status_chance":36,"unique":{"force_procs":["impact"]},"damage":{"Impact":400}},{"name":"Heavy Slam","radius":7,"type":"hs","isHeavy":true,"speed":1,"crit_chance":10,"crit_mult":2,"status_chance":36,"damage":{"Blast":600}}],"name":"Endura","imageName":"endura.webp","tags":["Tenno"],"compTags":["RAPIER_STANCE"]},
  "Ether Reaper":{"masteryReq":4,"description":"With a blade forged from the same material as the Ether Sword, the Ether Reaper delivers quick death to its victims.","blockingAngle":60,"comboDuration":5,"followThrough":0.6,"range":2.7,"windUp":1,"releaseDate":"2013-09-13","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"360","slam":{"damage":"540.00","radial":{"damage":"180.00","radius":8}},"speed":1.08,"crit_chance":20,"crit_mult":2,"status_chance":20,"damage":{"Impact":27,"Slash":126,"Puncture":27}},{"name":"Slam","radius":8,"type":"s","isHeavy":false,"speed":1,"crit_chance":20,"crit_mult":2,"status_chance":20,"unique":{"force_procs":["impact"]},"damage":{"Impact":360}},{"name":"Heavy Slam","radius":9,"type":"hs","isHeavy":true,"speed":1,"crit_chance":20,"crit_mult":2,"status_chance":20,"damage":{"Blast":540}}],"name":"Ether Reaper","imageName":"ether-reaper.webp","tags":["Tenno"],"compTags":["SCYTHES_STANCE"]},
  "Ether Sword":{"masteryReq":7,"description":"A single blade for more precision. The Ether Sword cuts so cleanly that it was considered by the Tenno to be a more humane weapon for ‘cleansing’ infested allies.","blockingAngle":55,"comboDuration":5,"followThrough":0.6,"range":2.5,"windUp":0.6,"releaseDate":"2013-05-23","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"192","slam":{"damage":"576.00","radial":{"damage":"192.00","element":"Radiation","radius":7}},"speed":1,"crit_chance":10,"crit_mult":1.5,"status_chance":34,"damage":{"Impact":28.8,"Slash":134.4,"Puncture":28.8}},{"name":"Slam","radius":7,"type":"s","isHeavy":false,"speed":1,"crit_chance":10,"crit_mult":1.5,"status_chance":34,"unique":{"force_procs":["radiation","impact"]},"damage":{"Radiation":384}},{"name":"Heavy Slam","radius":8,"type":"hs","isHeavy":true,"speed":1,"crit_chance":10,"crit_mult":1.5,"status_chance":34,"damage":{"Radiation":576}}],"name":"Ether Sword","imageName":"ether-sword.webp","tags":[],"compTags":["SWORDS_STANCE"]},
  "Epitaph Prime":{"masteryReq":14,"description":"Send shivers down your enemies' spines with this wrist-mounted sidearm. As the signature weapon of Sevagoth Prime, it deals additional headshot damage when wielded by him.","noise":"Alarming","releaseDate":"2024-08-21","ammoCapacity":40,"productCategory":"Pistols","zoomProps":[[]],"category":"Secondary","trigger":"Charge","type":"Pistol","magazineSize":1,"reloadTime":0.6,"multishot":1,"attacks":[{"name":"Charged Shot","isCoMult":true,"punch_through":2,"speed":1.75,"crit_chance":50,"crit_mult":3,"status_chance":14,"shot_type":"Projectile","shot_speed":200,"flight":200,"unique":{"force_procs":["impact"]},"damage":{"Impact":126,"Slash":141.75,"Puncture":47.25},"charge_time":0.4},{"name":"Uncharged Direct Hit","isCoMult":true,"speed":1.75,"crit_chance":4,"crit_mult":1.8,"status_chance":50,"shot_type":"Projectile","shot_speed":50,"flight":50,"unique":{"force_procs":["impact"]},"damage":{"Impact":40,"Slash":30,"Puncture":30}},{"name":"Uncharged AoE","speed":1.75,"crit_chance":0,"crit_mult":1,"status_chance":50,"shot_type":"AoE","unique":{"force_procs":["cold"]},"damage":{"Blast":30},"no_headshot_mult":true}],"name":"Epitaph Prime","imageName":"EpitaphPrime.webp","tags":[],"compTags":["PROJECTILE","SINGLESHOT","AOE"],"comb":[[1,2]]},
  "Euphona Prime":{"masteryReq":14,"description":"Banshee Prime’s signature shotgun is an instrument of devastation that fires both focused and broad shots.","noise":"Alarming","releaseDate":"2017-02-28","ammoCapacity":40,"productCategory":"Pistols","zoomProps":[[],[]],"category":"Secondary","trigger":"Semi","type":"Pistol","magazineSize":5,"reloadTime":2,"multishot":1,"attacks":[{"name":"Slug","speed":1.5,"crit_chance":30,"crit_mult":2.5,"status_chance":2,"shot_type":"Projectile","shot_speed":500,"flight":500,"damage":{"Impact":292.5,"Slash":16.25,"Puncture":16.25}},{"name":"Buckshot","multishot":10,"speed":1.5,"crit_chance":2,"crit_mult":2,"status_chance":9,"shot_type":"Hit-Scan","damage":{"Impact":4.4,"Slash":66,"Puncture":17.6},"falloff":{"start":6,"end":12,"reduction":0.9886}}],"name":"Euphona Prime","imageName":"euphona-prime.webp","tags":["Prime","Vaulted"],"compTags":["PROJECTILE","SECONDARYSHOTGUN","SINGLESHOT"]},
  "Ether Daggers":{"masteryReq":6,"description":"A shorter version of the Ether blade that allows for a more focused attack on a single target.","blockingAngle":50,"comboDuration":5,"followThrough":0.8,"range":1.75,"windUp":0.5,"releaseDate":"2013-04-12","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"448","slam":{"damage":"448.00","radial":{"damage":"224.00","element":"Impact","radius":6}},"speed":0.833,"crit_chance":10,"crit_mult":1.8,"status_chance":30,"damage":{"Impact":33.6,"Slash":156.8,"Puncture":33.6}},{"name":"Slam","radius":6,"type":"s","isHeavy":false,"speed":1,"crit_chance":10,"crit_mult":1.8,"status_chance":30,"unique":{"force_procs":["impact"]},"damage":{"Impact":448}},{"name":"Heavy Slam","radius":7,"type":"hs","isHeavy":true,"speed":1,"crit_chance":10,"crit_mult":1.8,"status_chance":30,"damage":{"Blast":672}}],"name":"Ether Daggers","imageName":"ether-daggers.webp","tags":["Tenno"],"compTags":["DUAL_DAGGERS_STANCE"]},
  "Evensong":{"masteryReq":10,"description":"Counter the dread of battle with a song of praise. Enemies cannot hurt your allies while wounded by Evensong’s arrows. Kills with Evensong empower ally weapons with Multishot. Experience the true power of Jade's Ensemble when Evensong, Cantare, and Harmony sing together.","noise":"Silent","releaseDate":"2024-06-18","ammoCapacity":72,"productCategory":"LongGuns","category":"Primary","trigger":"Charge","type":"Rifle","magazineSize":1,"reloadTime":0.6,"multishot":1,"attacks":[{"name":"Quick Shot","speed":1,"crit_chance":25,"crit_mult":2.2,"status_chance":38,"shot_type":"Projectile","shot_speed":85,"damage":{"Slash":227.5,"Puncture":97.5}},{"name":"Charged Shot","punch_through":2.5,"speed":1,"crit_chance":25,"crit_mult":2.2,"status_chance":38,"shot_type":"Projectile","shot_speed":100,"damage":{"Slash":350,"Puncture":150},"charge_time":1.2},{"name":"Charged Radial Attack","speed":1,"crit_chance":25,"crit_mult":2.2,"status_chance":38,"shot_type":"Projectile","damage":{"Puncture":45,"Slash":105},"charge_time":1.2}],"name":"Evensong","imageName":"Evensong.webp","tags":[],"compTags":["PROJECTILE"],"comb":[[1,2]]},
  "Enkaus":{"masteryReq":12,"description":"Turn the enemy's worst nightmare into reality with Follie's signature rifle. The Enkaus will instantly kill and dissolve inked enemies that are damaged at low health. Shooting inked enemies siphons ink back into the Enkaus, allowing for a constant flow of creative destruction.","noise":"Alarming","releaseDate":"2026-03-25","ammoCapacity":60,"productCategory":"LongGuns","category":"Primary","trigger":"Held","type":"Rifle","magazineSize":60,"reloadTime":2.2,"multishot":1,"attacks":[{"name":"Primary","isBeam":true,"speed":12,"crit_chance":16,"crit_mult":1.8,"status_chance":32,"shot_type":"Discharge","damage":{"Puncture":8,"Corrosive":20}},{"name":"Alternate Fire","speed":2,"crit_chance":16,"crit_mult":1.8,"status_chance":32,"damage":{"Puncture":4,"Corrosive":12}},{"name":"Radial","speed":2,"crit_chance":16,"crit_mult":1.8,"status_chance":32,"shot_type":"AoE","damage":{"Puncture":4,"Corrosive":10},"no_headshot_mult":true}],"name":"Enkaus","imageName":"Enkaus.webp","tags":[],"compTags":["PROJECTILE","BEAM","ASSAULT_AMMO"]},
  "Exalted Blade (Excalibur)":{"masteryReq":0,"description":"Exalted Blade is Excalibur, Excalibur Prime, and Excalibur Umbra's signature Exalted Weapon.","blockingAngle":60,"comboDuration":5,"followThrough":1,"range":2.8,"windUp":0.6,"releaseDate":"2018-06-15","productCategory":"Melee","category":"Melee","type":"Exalted Weapon","multishot":1,"attacks":[{"name":"Normal Attack","slide":"536","slam":{"damage":"750.00","radial":{"damage":"250.00","radius":7}},"speed":0.83,"crit_chance":15,"crit_mult":2,"status_chance":15,"unique":{"speed":0.1,"base":0.1},"damage":{"Impact":37.5,"Slash":175,"Puncture":37.5}},{"name":"Slam","radius":7,"type":"s","isHeavy":false,"speed":1,"crit_chance":15,"crit_mult":2,"status_chance":15,"damage":{"Impact":500}},{"name":"Heavy Slam","radius":8,"type":"hs","isHeavy":true,"speed":1,"crit_chance":15,"crit_mult":2,"status_chance":15,"damage":{"Blast":750}}],"name":"Exalted Blade (Excalibur)","imageName":"ExaltedBlade.webp","tags":[],"compTags":["EXALTED_BLADE_STANCE","POWER_WEAPON","EXCALIBUR"]},
  "Epitaph":{"masteryReq":8,"description":"Sevagoth's wrist-mounted sidearm fires a chilling slow-moving slab, guaranteed to slow enemies for easier marksmanship. Charge the shot to fire a punishing high-velocity, high critical chance slab that punches through barriers. Deals additional headshot damage in Sevagoth's hands.","noise":"Alarming","releaseDate":"2021-04-13","ammoCapacity":40,"productCategory":"Pistols","zoomProps":[[]],"category":"Secondary","trigger":"Charge","type":"Pistol","magazineSize":1,"reloadTime":0.6,"multishot":1,"attacks":[{"name":"Charged Shot","isCoMult":true,"punch_through":2,"speed":1.5,"crit_chance":48,"crit_mult":2.6,"status_chance":4,"shot_type":"Projectile","shot_speed":200,"flight":200,"unique":{"force_procs":["impact"]},"damage":{"Impact":120,"Slash":135,"Puncture":45},"charge_time":0.4},{"name":"Uncharged Direct Hit","isCoMult":true,"speed":1.5,"crit_chance":2,"crit_mult":1.2,"status_chance":50,"shot_type":"Projectile","shot_speed":50,"flight":50,"unique":{"force_procs":["impact"]},"damage":{"Impact":40,"Slash":30,"Puncture":30}},{"name":"Uncharged AoE","speed":1.5,"crit_chance":0,"crit_mult":1,"status_chance":50,"shot_type":"AoE","unique":{"force_procs":["cold"]},"damage":{"Blast":20},"falloff":{"start":0,"end":8,"reduction":0.8},"no_headshot_mult":true}],"name":"Epitaph","imageName":"epitaph.webp","tags":[],"compTags":["PROJECTILE","SINGLESHOT","AOE"],"comb":[[1,2]]},
  "Falcor":{"masteryReq":8,"description":"Carve through enemies with surgical precision using this Corpus-tech glaive.","blockingAngle":55,"comboDuration":5,"followThrough":0.7,"range":1.3,"windUp":1.2,"releaseDate":"2018-10-12","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"460","slam":{"damage":"690.00","radial":{"damage":"230.00","element":"Electricity","radius":5}},"isHeavy":false,"speed":0.833,"crit_chance":12,"crit_mult":1.6,"status_chance":34,"damage":{"Impact":36,"Slash":92,"Puncture":18,"Electricity":84}},{"name":"Throw","isHeavy":false,"speed":0.833,"crit_chance":14,"crit_mult":1.8,"status_chance":36,"shot_type":"Thrown","shot_speed":25,"flight":25,"unique":{"force_procs":["impact"]},"damage":{"Impact":20,"Slash":80,"Puncture":40,"Electricity":110}},{"name":"Throw Bounce Explosion","isHeavy":false,"speed":0.833,"crit_chance":14,"crit_mult":1.8,"status_chance":36,"shot_type":"AoE","damage":{"Electricity":345},"falloff":{"start":0,"end":6,"reduction":0.4},"no_headshot_mult":true},{"name":"Throw Recall Explosion","isHeavy":true,"speed":0.833,"crit_chance":14,"crit_mult":1.8,"status_chance":36,"shot_type":"AoE","unique":{"force_procs":["electricity"]},"damage":{"Electricity":690},"falloff":{"start":0,"end":6,"reduction":0},"no_headshot_mult":true},{"name":"Charged Throw","isHeavy":false,"speed":0.833,"crit_chance":16,"crit_mult":2,"status_chance":38,"shot_type":"Thrown","shot_speed":35,"flight":35,"unique":{"force_procs":["electricity"]},"damage":{"Impact":56,"Slash":230,"Puncture":20,"Electricity":200},"charge_time":1.2},{"name":"Charged Throw Bounce Explosion","isHeavy":false,"speed":0.833,"crit_chance":16,"crit_mult":2,"status_chance":38,"shot_type":"AoE","damage":{"Electricity":690},"falloff":{"start":0,"end":6,"reduction":0.4},"no_headshot_mult":true,"charge_time":1.2},{"name":"Charged Throw Recall Explosion","isHeavy":true,"speed":0.833,"crit_chance":16,"crit_mult":2,"status_chance":38,"shot_type":"AoE","unique":{"force_procs":["electricity"]},"damage":{"Electricity":1380},"falloff":{"start":0,"end":6,"reduction":0},"no_headshot_mult":true,"charge_time":1.2},{"name":"Slam","radius":5,"type":"s","isHeavy":false,"speed":1,"crit_chance":12,"crit_mult":1.6,"status_chance":34,"unique":{"force_procs":["impact"]},"damage":{"Electricity":460}},{"name":"Heavy Slam","radius":6,"type":"hs","isHeavy":true,"speed":1,"crit_chance":12,"crit_mult":1.6,"status_chance":34,"damage":{"Electricity":690}}],"name":"Falcor","imageName":"falcor.webp","tags":["Corpus"],"compTags":["GLAIVES_STANCE"],"comb":[[1,2],[4,5]]},
  "Fluctus (Arch-mode)":{"masteryReq":0,"description":"An Archwing energy weapon that sends waves of deadly plasma crashing into enemies.","releaseDate":"2014-12-19","ammoCapacity":0,"productCategory":"Archguns","zoomProps":[[]],"category":"Archgun","type":"Archgun","magazineSize":40,"reloadTime":5,"multishot":1,"attacks":[{"name":"Normal Attack","punch_through":"Infinity","speed":5,"crit_chance":22,"crit_mult":2,"status_chance":16,"shot_type":"Projectile","shot_speed":300,"unique":{"force_procs":["impact"]},"damage":{"Impact":50,"Puncture":25,"Slash":175}}],"reloadRate":10,"reloadDelay":1,"name":"Fluctus (Arch-mode)","imageName":"fluctus.webp","tags":[""],"compTags":["BATTERY"]},
  "Fluctus (Atmo-mode)":{"masteryReq":0,"description":"An Archwing energy weapon that sends waves of deadly plasma crashing into enemies.","releaseDate":"2018-12-18","ammoCapacity":160,"productCategory":"Archguns","zoomProps":[[]],"category":"Archgun","type":"Archgun","magazineSize":40,"reloadTime":3,"multishot":1,"attacks":[{"name":"Normal Attack","punch_through":"Infinity","speed":5,"crit_chance":22,"crit_mult":2,"status_chance":16,"shot_type":"Projectile","shot_speed":75,"unique":{"force_procs":["impact"]},"damage":{"Impact":50,"Puncture":25,"Slash":175}}],"name":"Fluctus (Atmo-mode)","imageName":"fluctus.webp","tags":[""],"compTags":[""]},
  "Exergis":{"masteryReq":8,"description":"Feel the kick of this Corpus shotgun as it shatters a high-yield crystal into anyone and anything standing in your way.","noise":"Alarming","releaseDate":"2018-12-18","ammoCapacity":47,"productCategory":"LongGuns","zoomProps":[[]],"category":"Primary","trigger":"Semi","type":"Shotgun","magazineSize":1,"reloadTime":1.6,"multishot":3,"attacks":[{"name":"Normal Attack","isCoMult":true,"punch_through":0.5,"speed":3.33,"crit_chance":8,"crit_mult":1.4,"status_chance":36,"shot_type":"Projectile","shot_speed":100,"flight":100,"damage":{"Impact":20,"Slash":260,"Puncture":120,"Radiation":140},"falloff":{"start":30,"end":60,"reduction":0.508}}],"name":"Exergis","imageName":"exergis.webp","tags":[],"compTags":["PROJECTILE","SINGLESHOT"]},
  "Fang Prime":{"masteryReq":10,"description":"A set of ceremonial daggers from the Orokin era, the Fang Prime's blades resonate violently as they strike. This allows them to pierce hardened materials like armor with ease.","blockingAngle":50,"comboDuration":5,"followThrough":0.8,"range":1.75,"windUp":0.5,"releaseDate":"2013-07-13","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"356","slam":{"damage":"356.00","radial":{"damage":"178.00","element":"Impact","radius":6}},"speed":1,"crit_chance":26,"crit_mult":2.6,"status_chance":26,"damage":{"Impact":26.7,"Slash":26.7,"Puncture":124.6}},{"name":"Slam","radius":6,"type":"s","isHeavy":false,"speed":1,"crit_chance":26,"crit_mult":2.6,"status_chance":26,"unique":{"force_procs":["impact"]},"damage":{"Impact":356}},{"name":"Heavy Slam","radius":7,"type":"hs","isHeavy":true,"speed":1,"crit_chance":26,"crit_mult":2.6,"status_chance":26,"damage":{"Blast":534}}],"name":"Fang Prime","imageName":"fang-prime.webp","tags":["Prime","Never Vaulted"],"compTags":["DUAL_DAGGERS_STANCE"]},
  "Fang":{"masteryReq":0,"description":"These matching stilettos have increased attack speed and can unleash a flurry of multi-hit attacks.","blockingAngle":50,"comboDuration":5,"followThrough":0.8,"range":1.65,"windUp":0.5,"releaseDate":"2013-03-18","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"216","slam":{"damage":"216.00","radial":{"damage":"108.00","radius":6}},"speed":0.917,"crit_chance":8,"crit_mult":1.5,"status_chance":16,"damage":{"Impact":16.2,"Slash":16.2,"Puncture":75.6}},{"name":"Slam","radius":6,"type":"s","isHeavy":false,"speed":1,"crit_chance":8,"crit_mult":1.5,"status_chance":16,"unique":{"force_procs":["impact"]},"damage":{"Impact":216}},{"name":"Heavy Slam","radius":7,"type":"hs","isHeavy":true,"speed":1,"crit_chance":8,"crit_mult":1.5,"status_chance":16,"damage":{"Blast":324}}],"name":"Fang","imageName":"fang.webp","tags":["Tenno"],"compTags":["DUAL_DAGGERS_STANCE"]},
  "Ferrox":{"masteryReq":14,"description":"Discharge a rail of ionized death or throw the Ferrox like a spear and create a localized field of attraction no enemy can escape from.","noise":"Alarming","releaseDate":"2017-03-09","ammoCapacity":100,"productCategory":"LongGuns","category":"Primary","trigger":"Charge","type":"Rifle","magazineSize":10,"reloadTime":1.8,"multishot":1,"attacks":[{"name":"Charged Shot","punch_through":1.5,"speed":1.33,"crit_chance":32,"crit_mult":2.8,"status_chance":10,"shot_type":"Hit-Scan","damage":{"Impact":35,"Slash":70,"Puncture":245},"charge_time":0.5},{"name":"Radial Attack","speed":1.33,"crit_chance":32,"crit_mult":2.8,"status_chance":10,"shot_type":"AoE","damage":{"Impact":100},"falloff":{"start":0,"end":3.6,"reduction":0.4},"no_headshot_mult":true},{"name":"Spear Throw","speed":1,"crit_chance":4,"crit_mult":2,"status_chance":33,"shot_type":"Projectile","shot_speed":90,"flight":90,"damage":{"Impact":35,"Slash":10,"Puncture":5}},{"name":"Attraction Field","speed":0.5,"crit_chance":4,"crit_mult":2,"status_chance":50,"shot_type":"AoE","damage":{"Electricity":150},"no_headshot_mult":true}],"name":"Ferrox","imageName":"ferrox.webp","tags":["Corpus"],"compTags":["PROJECTILE","SNIPER_AMMO"],"comb":[[0,1]]},
  "Felarx":{"masteryReq":14,"description":"The Felarx invokes ancient times when aristocrats hunted game. For ceremonies, Orokin elites bred creatures reminiscent of game birds to reanimate cultural myths. They gave the Zariman crew Felarx and a brace of birds as a sign of acceptance into elite society. The brace of birds becomes a pair of pistols at the hands of the Void.","noise":"Alarming","releaseDate":"2022-06-09","ammoCapacity":60,"productCategory":"LongGuns","zoomProps":[[]],"category":"Primary","trigger":"Auto","type":"Shotgun","magazineSize":6,"reloadTime":3.7,"multishot":4,"attacks":[{"name":"Normal Attack","isCoMult":true,"speed":3,"crit_chance":20,"crit_mult":2,"status_chance":5.5,"shot_type":"Projectile","shot_speed":100,"flight":100,"damage":{"Impact":38,"Slash":83.6,"Puncture":68.4},"falloff":{"start":14,"end":28,"reduction":0.9947}},{"name":"Incarnon Mode","multishot":1,"isCoMult":true,"isInc":1,"speed":1.5,"crit_chance":20,"crit_mult":3,"status_chance":20,"shot_type":"Projectile","shot_speed":160,"flight":160,"unique":{"force_procs":["impact"]},"damage":{"Impact":200,"Radiation":400}}],"incMagazineSize":60,"name":"Felarx","imageName":"felarx.webp","tags":["Zariman","Incarnon"],"compTags":["PROJECTILE"]},
  "Fragor":{"masteryReq":2,"description":"A large two-handed hammer, the Fragor requires great strength to wield, but impacts with enough force to send groups of enemies tumbling.","blockingAngle":50,"comboDuration":5,"followThrough":0.4,"range":2.5,"windUp":1.2,"releaseDate":"2013-01-14","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"400","slam":{"damage":"600.00","radial":{"damage":"200.00","radius":9}},"speed":0.833,"crit_chance":20,"crit_mult":2,"status_chance":10,"damage":{"Impact":140,"Slash":30,"Puncture":30}},{"name":"Slam","radius":9,"type":"s","isHeavy":false,"speed":1,"crit_chance":20,"crit_mult":2,"status_chance":10,"damage":{"Impact":400}},{"name":"Heavy Slam","radius":10,"type":"hs","isHeavy":true,"speed":1,"crit_chance":20,"crit_mult":2,"status_chance":10,"damage":{"Blast":600}}],"name":"Fragor","imageName":"fragor.webp","tags":["Tenno"],"compTags":["HAMMERS_STANCE"]},
  "Flux Rifle":{"masteryReq":6,"description":"Laser Rifle with Corpus safe-guards removed.","noise":"Alarming","releaseDate":"2013-05-23","ammoCapacity":550,"productCategory":"LongGuns","zoomProps":[[]],"category":"Primary","trigger":"Held","type":"Rifle","magazineSize":50,"reloadTime":2.25,"multishot":1,"attacks":[{"name":"Normal Attack","isBeam":true,"punch_through":0.5,"speed":12,"crit_chance":10,"crit_mult":2,"status_chance":24,"shot_type":"Discharge","damage":{"Slash":17.16,"Puncture":4.84}}],"reloadRate":40,"reloadDelay":1,"name":"Flux Rifle","imageName":"flux-rifle.webp","tags":["Corpus"],"compTags":["BEAM","ASSAULT_AMMO","FLUX"]},
  "Fragor Prime":{"masteryReq":12,"description":"A beautifully forged instrument of devastation.","blockingAngle":50,"comboDuration":5,"followThrough":0.4,"range":2.6,"windUp":1.2,"releaseDate":"2016-05-17","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"540","slam":{"damage":"810.00","radial":{"damage":"270.00","element":"Impact","radius":9}},"speed":0.8,"crit_chance":40,"crit_mult":2.5,"status_chance":18,"damage":{"Impact":189,"Slash":40.5,"Puncture":40.5}},{"name":"Slam","radius":9,"type":"s","isHeavy":false,"speed":1,"crit_chance":40,"crit_mult":2.5,"status_chance":18,"damage":{"Impact":540}},{"name":"Heavy Slam","radius":10,"type":"hs","isHeavy":true,"speed":1,"crit_chance":40,"crit_mult":2.5,"status_chance":18,"damage":{"Blast":810}}],"name":"Fragor Prime","imageName":"fragor-prime.webp","tags":["Prime"],"compTags":["HAMMERS_STANCE"]},
  "Furis":{"masteryReq":2,"description":"The Furis delivers a high damage output in a short time frame thanks to its high rate of fire.","noise":"Alarming","releaseDate":"2012-10-25","productCategory":"Pistols","category":"Secondary","trigger":"Auto","type":"Pistol","magazineSize":35,"reloadTime":1.4,"multishot":1,"attacks":[{"name":"Normal Attack","speed":10,"crit_chance":5,"crit_mult":2,"status_chance":12,"shot_type":"Hit-Scan","damage":{"Impact":3,"Slash":3,"Puncture":14}},{"name":"Incarnon Form","isBeam":true,"isInc":1,"speed":12,"crit_chance":26,"crit_mult":3.4,"status_chance":24,"damage":{"Heat":100}}],"incMagazineSize":280,"name":"Furis","imageName":"furis.webp","tags":["Tenno","Incarnon"],"compTags":["FURIS"]},
  "Fusilai":{"masteryReq":7,"description":"Silently lacerate enemies with Gara's signature glass throwing knives. Increased Projectile Speed when wielded by Gara.","noise":"Silent","releaseDate":"2017-10-12","ammoCapacity":72,"productCategory":"Pistols","category":"Secondary","trigger":"Auto","type":"Throwing","magazineSize":6,"reloadTime":0.8,"multishot":1,"attacks":[{"name":"Full Auto Mode","speed":2.83,"crit_chance":23,"crit_mult":1.7,"status_chance":29,"shot_type":"Projectile","shot_speed":50,"flight":50,"damage":{"Slash":46.2,"Puncture":30.8}},{"name":"Semi-Auto Mode","ammoCost":3,"speed":1.5,"crit_chance":3,"crit_mult":1.5,"status_chance":12.3,"shot_type":"Projectile","shot_speed":50,"flight":50,"damage":{"Slash":46.2,"Puncture":30.8}}],"name":"Fusilai","imageName":"fusilai.webp","tags":["Tenno"],"compTags":["PROJECTILE","THROWN"]},
  "Galariak Prime":{"masteryReq":14,"description":"Orokin-era Grineer plated their scythes with gold as a symbol of dedication to their Golden Lords. Gains a percentage of Critical Chance with each Status Type affecting the target.","blockingAngle":60,"comboDuration":5,"followThrough":0.6,"range":2.8,"windUp":1,"releaseDate":"2025-12-10","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":1.08,"crit_chance":19,"crit_mult":2.5,"status_chance":32,"damage":{"Impact":30.3,"Slash":13.2,"Puncture":190.5}},{"name":"Slam","radius":8,"type":"s","isHeavy":false,"speed":1,"crit_chance":19,"crit_mult":2.5,"status_chance":32,"unique":{"force_procs":["impact"]},"damage":{"Impact":702}},{"name":"Heavy Slam","radius":9,"type":"hs","isHeavy":true,"speed":1,"crit_chance":19,"crit_mult":2.5,"status_chance":32,"damage":{"Blast":1170}}],"name":"Galariak Prime","imageName":"GalariakPrime.webp","tags":["Prime"],"compTags":["SCYTHES_STANCE"]},
  "Fulmin":{"masteryReq":8,"description":"Strike with silent lightning or the pummeling drum of thunder. Alternate between stealthy short-range electrical discharge, and automatic lightning gun. Faster mode-switch when used by Wisp.","noise":"Silent","releaseDate":"2019-05-22","ammoCapacity":60,"productCategory":"LongGuns","equipTime":1.1,"zoomProps":[[]],"category":"Primary","trigger":"Semi","type":"Rifle","magazineSize":60,"reloadTime":3,"multishot":1,"attacks":[{"name":"Full Auto Mode","speed":9.33,"crit_chance":28,"crit_mult":2.4,"status_chance":10,"shot_type":"Hit-Scan","damage":{"Puncture":8,"Electricity":25}},{"name":"Semi-Auto Mode","ammoCost":10,"isCoMult":true,"speed":2.17,"crit_chance":30,"crit_mult":2.2,"status_chance":16,"shot_type":"Projectile","shot_speed":100,"flight":100,"unique":{"force_procs":["impact"]},"damage":{"Impact":100,"Electricity":400},"falloff":{"start":10,"end":20,"reduction":0.6666},"no_headshot_mult":true}],"reloadRate":30,"reloadDelay":1,"name":"Fulmin","imageName":"fulmin.webp","tags":[],"compTags":["ASSAULT_AMMO","PROJECTILE"]},
  "Furax":{"masteryReq":5,"description":"These power gauntlets lack the range of most Melee Weapons, but Furax is far more devastating when you strike an enemy in close combat.","blockingAngle":50,"comboDuration":5,"followThrough":0.9,"range":1.25,"windUp":0.6,"releaseDate":"2012-10-25","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"405","slam":{"damage":"405.00","radial":{"damage":"135.00","radius":8}},"speed":1,"crit_chance":25,"crit_mult":2.3,"status_chance":11,"damage":{"Impact":94.5,"Slash":20.2,"Puncture":20.3}},{"name":"Slam","radius":8,"type":"s","isHeavy":false,"speed":1,"crit_chance":25,"crit_mult":2.3,"status_chance":11,"unique":{"force_procs":["impact"]},"damage":{"Impact":270}},{"name":"Heavy Slam","radius":9,"type":"hs","isHeavy":true,"speed":1,"crit_chance":25,"crit_mult":2.3,"status_chance":11,"damage":{"Blast":405}}],"name":"Furax","imageName":"furax.webp","tags":["Grineer","Incarnon"],"compTags":["FIST_STANCE"]},
  "Galatine":{"masteryReq":3,"description":"With massive charged power and the ability to hit up to five foes in a single swing, the Galatine sword is the heavy artillery of Melee Weapons.","blockingAngle":55,"comboDuration":5,"followThrough":0.6,"range":3,"windUp":1.1,"releaseDate":"2013-09-27","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"364","slam":{"damage":"546.00","radial":{"damage":"182.00","radius":8}},"speed":1,"crit_chance":10,"crit_mult":2,"status_chance":20,"damage":{"Impact":4.55,"Slash":172.9,"Puncture":4.55}},{"name":"Slam","radius":8,"type":"s","isHeavy":false,"speed":1,"crit_chance":10,"crit_mult":2,"status_chance":20,"unique":{"force_procs":["impact"]},"damage":{"Impact":364}},{"name":"Heavy Slam","radius":9,"type":"hs","isHeavy":true,"speed":1,"crit_chance":10,"crit_mult":2,"status_chance":20,"damage":{"Blast":546}}],"name":"Galatine","imageName":"galatine.webp","tags":["Tenno"],"compTags":["HEAVY_BLADE_STANCE"]},
  "Fulmin Prime":{"masteryReq":0,"description":"Strike with silent lightning or the pummeling drum of thunder. Alternate between stealthy short-range electrical discharge, and automatic lightning gun. Faster mode-switch when used by Wisp.","noise":"Silent","releaseDate":"2023-07-27","ammoCapacity":60,"productCategory":"LongGuns","zoomProps":[[]],"category":"Primary","trigger":"Semi","type":"Rifle","magazineSize":80,"reloadTime":2.7,"multishot":1,"attacks":[{"name":"Full Auto Mode","speed":9.33,"crit_chance":34,"crit_mult":2.4,"status_chance":10,"shot_type":"Hit-Scan","damage":{"Puncture":8,"Electricity":25}},{"name":"Semi-Auto Mode","ammoCost":10,"isCoMult":true,"speed":2.17,"crit_chance":30,"crit_mult":2.2,"status_chance":22,"shot_type":"Projectile","shot_speed":100,"flight":100,"unique":{"force_procs":["impact"]},"damage":{"Impact":110,"Electricity":440},"no_headshot_mult":true}],"reloadRate":40,"reloadDelay":0.7,"name":"Fulmin Prime","imageName":"FulminPrime.webp","tags":[],"compTags":["ASSAULT_AMMO","PROJECTILE"]},
  "Galatine Prime":{"masteryReq":13,"description":"Only Tenno were strong enough to wield this noble beast of a weapon.","blockingAngle":55,"comboDuration":5,"followThrough":0.6,"range":3,"windUp":1.1,"releaseDate":"2016-08-23","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"560","slam":{"damage":"840.00","radial":{"damage":"280.00","radius":8}},"speed":1,"crit_chance":26,"crit_mult":2,"status_chance":26,"damage":{"Impact":7,"Slash":266,"Puncture":7}},{"name":"Slam","radius":8,"type":"s","isHeavy":false,"speed":1,"crit_chance":26,"crit_mult":2,"status_chance":26,"unique":{"force_procs":["impact"]},"damage":{"Impact":560}},{"name":"Heavy Slam","radius":9,"type":"hs","isHeavy":true,"speed":1,"crit_chance":26,"crit_mult":2,"status_chance":26,"damage":{"Blast":840}}],"name":"Galatine Prime","imageName":"galatine-prime.webp","tags":["Prime","Vaulted"],"compTags":["HEAVY_BLADE_STANCE"]},
  "Furax Wraith":{"masteryReq":9,"description":"These Wraith gauntlets have been augmented for power.","blockingAngle":50,"comboDuration":5,"followThrough":0.9,"range":1.25,"windUp":0.6,"releaseDate":"2016-04-29","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"417","slam":{"damage":"417.00","radial":{"damage":"139.00","element":"Impact","radius":8}},"speed":1.08,"crit_chance":30,"crit_mult":2.7,"status_chance":15,"damage":{"Impact":97.3,"Slash":20.8,"Puncture":20.9}},{"name":"Slam","radius":8,"type":"s","isHeavy":false,"speed":1,"crit_chance":30,"crit_mult":2.7,"status_chance":15,"unique":{"force_procs":["impact"]},"damage":{"Impact":278}},{"name":"Heavy Slam","radius":9,"type":"hs","isHeavy":true,"speed":1,"crit_chance":30,"crit_mult":2.7,"status_chance":15,"damage":{"Blast":417}}],"name":"Furax Wraith","imageName":"furax-wraith.webp","tags":["Incarnon"],"compTags":["FIST_STANCE"]},
  "Gazal Machete":{"masteryReq":5,"description":"Each kill with this swooping blade adds bonus damage to the Djinn Sentinel’s next Fatal Attraction ability. In turn, Fatal Attraction bestows the weapon with a period of <DT_CORROSIVE>Corrosive Damage.","blockingAngle":55,"comboDuration":5,"followThrough":0.7,"range":2.6,"windUp":0.7,"releaseDate":"2016-10-05","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"356","slam":{"damage":"534.00","radial":{"damage":"178.00","radius":8}},"speed":1,"crit_chance":10,"crit_mult":2,"status_chance":30,"damage":{"Impact":17.8,"Slash":133.5,"Puncture":26.7}},{"name":"Slam","radius":8,"type":"s","isHeavy":false,"speed":1,"crit_chance":10,"crit_mult":2,"status_chance":30,"unique":{"force_procs":["impact"]},"damage":{"Impact":356}},{"name":"Heavy Slam","radius":9,"type":"hs","isHeavy":true,"speed":1,"crit_chance":10,"crit_mult":2,"status_chance":30,"damage":{"Blast":534}}],"name":"Gazal Machete","imageName":"gazal-machete.webp","tags":["Tenno"],"compTags":["MACHETES_STANCE"]},
  "Garuda Talons":{"masteryReq":0,"description":"Garuda Talons are Garuda's signature Claws","blockingAngle":60,"comboDuration":5,"followThrough":0.8,"range":2.2,"windUp":0.6,"releaseDate":"2018-11-08","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","slide":"744","slam":{"damage":"744.00","radial":{"damage":"248.00","radius":6}},"speed":1,"crit_chance":20,"crit_mult":2,"status_chance":36,"damage":{"Impact":19.84,"Slash":173.6,"Puncture":54.56}},{"name":"Slam","radius":6,"type":"s","isHeavy":false,"speed":1,"crit_chance":20,"crit_mult":2,"status_chance":36,"damage":{"Impact":496}},{"name":"Heavy Slam","radius":7,"type":"hs","isHeavy":true,"speed":1,"crit_chance":20,"crit_mult":2,"status_chance":36,"damage":{"Blast":744}}],"name":"Garuda Talons","imageName":"GarudaTalons.webp","tags":[],"compTags":["CLAWS_STANCE"]},
  "Gaze (Secondary)":{"masteryReq":0,"description":"Secondary: a persistent cutting beam of pure energy. Primary: same as Secondary, but with explosion on impact.","ammoCapacity":200,"productCategory":"","category":"Secondary","type":"Kitgun","magazineSize":0,"reloadTime":2,"multishot":1,"attacks":[{"name":"Normal Attack","isBeam":true,"punch_through":1,"speed":12,"crit_chance":0,"crit_mult":0,"status_chance":0,"shot_type":"Discharge","damage":{"Puncture":7,"Radiation":11}}],"name":"Gaze (Secondary)","imageName":"gaze.webp","tags":["secondary-beam"],"compTags":["BEAM"]},
  "Garuda Prime Talons":{"masteryReq":0,"description":"Garuda Talons are Garuda's signature Claws","blockingAngle":60,"comboDuration":5,"followThrough":0.8,"range":2.2,"windUp":0.6,"releaseDate":"2022-03-28","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":1,"crit_chance":35,"crit_mult":2,"status_chance":36,"damage":{"Impact":14,"Slash":238,"Puncture":28}},{"name":"Slam","radius":6,"type":"s","isHeavy":false,"speed":1,"crit_chance":35,"crit_mult":2,"status_chance":36,"damage":{"Impact":560}},{"name":"Heavy Slam","radius":7,"type":"hs","isHeavy":true,"speed":1,"crit_chance":35,"crit_mult":2,"status_chance":36,"damage":{"Blast":840}}],"name":"Garuda Prime Talons","imageName":"GarudaPrimeTalons.webp","tags":[],"compTags":["CLAWS_STANCE"]},
  "Ghoulsaw":{"masteryReq":7,"description":"The cruelest of weapons built for the crudest of Grineer soldiers. Rips through metal like flesh, and through flesh like day-old pudding.","blockingAngle":90,"comboDuration":5,"followThrough":1,"range":2.1530571,"windUp":1,"releaseDate":"2021-09-08","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","slide":"394","slam":{"damage":"591.00","radial":{"damage":"197.00","radius":7}},"speed":1,"crit_chance":15,"crit_mult":1.9,"status_chance":27,"damage":{"Impact":37.43,"Slash":114.26,"Puncture":45.31}},{"name":"Slam","radius":7,"type":"s","isHeavy":false,"speed":1,"crit_chance":15,"crit_mult":1.9,"status_chance":27,"unique":{"force_procs":["impact"]},"damage":{"Impact":394}},{"name":"Heavy Slam","radius":9,"type":"hs","isHeavy":true,"speed":1,"crit_chance":15,"crit_mult":1.9,"status_chance":27,"damage":{"Blast":591}}],"name":"Ghoulsaw","imageName":"ghoulsaw.webp","tags":["Grineer"],"compTags":["BLADESAW_STANCE"]},
  "Galvacord":{"masteryReq":6,"description":"Shock and maim with this heavyweight retractable whip.","blockingAngle":45,"comboDuration":5,"followThrough":0.5,"range":2.6963859,"windUp":0.4,"releaseDate":"2018-12-18","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","slide":"420","slam":{"damage":"630.00","radial":{"damage":"210.00","radius":5}},"speed":0.75,"crit_chance":12,"crit_mult":1.8,"status_chance":30,"damage":{"Impact":12,"Slash":64,"Puncture":38,"Electricity":96}},{"name":"Slam","radius":5,"type":"s","isHeavy":false,"speed":1,"crit_chance":12,"crit_mult":1.8,"status_chance":30,"unique":{"force_procs":["impact"]},"damage":{"Electricity":420}},{"name":"Heavy Slam","radius":6,"type":"hs","isHeavy":true,"speed":1,"crit_chance":12,"crit_mult":1.8,"status_chance":30,"damage":{"Electricity":630}}],"name":"Galvacord","imageName":"galvacord.webp","tags":[],"compTags":["WHIPS_STANCE"]},
  "Gaze (Primary)":{"masteryReq":0,"description":"Secondary: a persistent cutting beam of pure energy. Primary: same as Secondary, but with explosion on impact.","ammoCapacity":200,"productCategory":"","category":"Primary","type":"Kitgun","magazineSize":0,"reloadTime":2,"multishot":1,"attacks":[{"name":"Normal Attack","isBeam":true,"speed":12,"crit_chance":0,"crit_mult":0,"status_chance":0,"shot_type":"Discharge","damage":{"Puncture":7,"Radiation":11}}],"name":"Gaze (Primary)","imageName":"gaze.webp","tags":["primary-rifle-beam"],"compTags":["BEAM"]},
  "Gammacor":{"masteryReq":2,"description":"Designed to quickly vaporize minerals for content analysis, users discovered its powerful beam was equally efficient at dispatching hostiles.","noise":"Alarming","releaseDate":"2014-11-27","ammoCapacity":240,"productCategory":"Pistols","zoomProps":[[]],"category":"Secondary","trigger":"Held","type":"Pistol","magazineSize":60,"reloadTime":1.4,"multishot":1,"attacks":[{"name":"Normal Attack","isBeam":true,"speed":12,"crit_chance":8,"crit_mult":1.8,"status_chance":20,"shot_type":"Discharge","damage":{"Magnetic":16}},{"name":"Incarnon Form","isInc":1,"speed":1,"crit_chance":14,"crit_mult":1.8,"status_chance":22,"shot_type":"Projectile","unique":{"force_procs":["impact"]},"damage":{"Impact":80}},{"name":"Incarnon Form Radial Attack","isInc":1,"speed":1,"crit_chance":14,"crit_mult":1.8,"status_chance":22,"shot_type":"AoE","unique":{"force_procs":["cold"]},"damage":{"Cold":660},"no_headshot_mult":true}],"incMagazineSize":15,"name":"Gammacor","imageName":"gammacor.webp","tags":["Cephalon","Incarnon"],"compTags":["BEAM"],"comb":[[1,2]]},
  "Glaive Prime":{"masteryReq":10,"description":"The Glaive Prime is a deadly and beautiful weapon from the Orokin era. The blades are as effective in close quarters as they are when thrown at distant enemies.","blockingAngle":55,"comboDuration":5,"followThrough":0.7,"range":1.25,"windUp":1.2,"releaseDate":"2013-11-20","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"328","slam":{"damage":"492.00","radial":{"damage":"164.00","element":"Impact","radius":5}},"isHeavy":false,"speed":1.25,"crit_chance":22,"crit_mult":2,"status_chance":30,"damage":{"Impact":24.6,"Slash":114.8,"Puncture":24.6}},{"name":"Throw","isHeavy":false,"speed":1.25,"crit_chance":24,"crit_mult":2.2,"status_chance":32,"shot_type":"Thrown","shot_speed":40,"flight":40,"unique":{"force_procs":["impact","slash"]},"damage":{"Impact":27,"Slash":126,"Puncture":27}},{"name":"Throw Bounce Explosion","isHeavy":false,"speed":1.25,"crit_chance":24,"crit_mult":2.2,"status_chance":32,"shot_type":"AoE","unique":{"force_procs":["impact"]},"damage":{"Blast":296},"falloff":{"start":0,"end":4.8,"reduction":0.4},"no_headshot_mult":true},{"name":"Throw Recall Explosion","isHeavy":true,"speed":1.25,"crit_chance":24,"crit_mult":2.2,"status_chance":32,"shot_type":"AoE","unique":{"force_procs":["impact","slash"]},"damage":{"Blast":592},"falloff":{"start":0,"end":4.8,"reduction":0},"no_headshot_mult":true},{"name":"Charged Throw","isHeavy":false,"speed":0.833,"crit_chance":26,"crit_mult":2.4,"status_chance":34,"shot_type":"Thrown","shot_speed":55,"flight":55,"unique":{"force_procs":["impact","slash"]},"damage":{"Impact":54,"Slash":252,"Puncture":54},"charge_time":1.2},{"name":"Charged Throw Bounce Explosion","isHeavy":false,"speed":0.833,"crit_chance":26,"crit_mult":2.4,"status_chance":34,"shot_type":"AoE","damage":{"Blast":592},"falloff":{"start":0,"end":4.8,"reduction":0.4},"no_headshot_mult":true,"charge_time":1.2},{"name":"Charged Throw Recall Explosion","isHeavy":true,"speed":0.833,"crit_chance":26,"crit_mult":2.4,"status_chance":34,"shot_type":"AoE","unique":{"force_procs":["impact","slash"]},"damage":{"Blast":1184},"falloff":{"start":0,"end":4.8,"reduction":0},"no_headshot_mult":true,"charge_time":1.2},{"name":"Slam","radius":5,"type":"s","isHeavy":false,"speed":1,"crit_chance":22,"crit_mult":2,"status_chance":30,"unique":{"force_procs":["impact"]},"damage":{"Impact":328}},{"name":"Heavy Slam","radius":6,"type":"hs","isHeavy":true,"speed":1,"crit_chance":22,"crit_mult":2,"status_chance":30,"damage":{"Blast":492}}],"name":"Glaive Prime","imageName":"glaive-prime.webp","tags":["Prime","Vaulted"],"compTags":["GLAIVES_STANCE"],"comb":[[1,2],[4,5]]},
  "Glaive":{"masteryReq":1,"description":"Dating back to the time of the first Tenno, the Glaive is a uniquely deadly weapon. This multi-bladed disc is not only effective for melee combat; it can also be thrown like a boomerang to cut down enemies at a distance.","blockingAngle":55,"comboDuration":5,"followThrough":0.7,"range":1.25,"windUp":1.2,"releaseDate":"2013-04-26","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"210","slam":{"damage":"315.00","radial":{"damage":"105.00","radius":5}},"isHeavy":false,"speed":1,"crit_chance":12,"crit_mult":2,"status_chance":12,"damage":{"Impact":15.75,"Slash":73.5,"Puncture":15.75}},{"name":"Throw","isHeavy":false,"speed":1,"crit_chance":14,"crit_mult":2.1,"status_chance":14,"shot_type":"Thrown","shot_speed":20,"flight":20,"damage":{"Impact":17.4,"Slash":81.2,"Puncture":17.4}},{"name":"Throw Bounce Explosion","isHeavy":false,"speed":1,"crit_chance":14,"crit_mult":2.1,"status_chance":14,"shot_type":"AoE","damage":{"Blast":190},"falloff":{"start":0,"end":4.8,"reduction":0.4},"no_headshot_mult":true},{"name":"Throw Recall Explosion","isHeavy":true,"speed":1,"crit_chance":14,"crit_mult":2.1,"status_chance":14,"shot_type":"AoE","unique":{"force_procs":["impact"]},"damage":{"Blast":380},"falloff":{"start":0,"end":4.8,"reduction":0},"no_headshot_mult":true},{"name":"Charged Throw","isHeavy":false,"speed":0.833,"crit_chance":16,"crit_mult":2.2,"status_chance":16,"shot_type":"Thrown","shot_speed":35,"flight":35,"unique":{"force_procs":["impact"]},"damage":{"Impact":34.65,"Slash":161.7,"Puncture":34.65},"charge_time":1.2},{"name":"Charged Throw Bounce Explosion","isHeavy":false,"speed":0.833,"crit_chance":16,"crit_mult":2.2,"status_chance":16,"shot_type":"AoE","damage":{"Blast":378},"falloff":{"start":0,"end":4.8,"reduction":0.4},"no_headshot_mult":true,"charge_time":1.2},{"name":"Charged Throw Recall Explosion","isHeavy":true,"speed":0.833,"crit_chance":16,"crit_mult":2.2,"status_chance":16,"shot_type":"AoE","unique":{"force_procs":["impact"]},"damage":{"Blast":756},"falloff":{"start":0,"end":4.8,"reduction":0},"no_headshot_mult":true,"charge_time":1.2},{"name":"Slam","radius":5,"type":"s","isHeavy":false,"speed":1,"crit_chance":12,"crit_mult":2,"status_chance":12,"unique":{"force_procs":["impact"]},"damage":{"Impact":210}},{"name":"Heavy Slam","radius":6,"type":"hs","isHeavy":true,"speed":1,"crit_chance":12,"crit_mult":2,"status_chance":12,"damage":{"Blast":315}}],"name":"Glaive","imageName":"glaive.webp","tags":["Tenno"],"compTags":["GLAIVES_STANCE"],"comb":[[1,2],[4,5]]},
  "Glory (Jade)":{"masteryReq":0,"description":"Unleash the power of the Jade Light.","noise":"Alarming","releaseDate":"2024-06-18","productCategory":"Pistols","category":"Secondary","type":"Pistols","magazineSize":9999999,"reloadTime":0,"multishot":1,"attacks":[{"name":"Normal Attack","speed":1.6666667,"crit_chance":15,"crit_mult":2,"status_chance":20,"shot_type":"AoE","damage":{"Heat":150},"no_headshot_mult":true},{"name":"Alternate Fire","speed":1.6666667,"crit_chance":15,"crit_mult":2,"status_chance":20,"shot_type":"AoE","damage":{"Heat":1500},"no_headshot_mult":true}],"name":"Glory (Jade)","imageName":"Glory.webp","tags":[],"compTags":["POWER_WEAPON","AOE"]},
  "Glaxion":{"masteryReq":8,"description":"Fires a photon beam that halts molecular vibrations, causing instant and painful freezing.","noise":"Alarming","releaseDate":"2014-08-28","ammoCapacity":720,"productCategory":"LongGuns","equipTime":1.1,"zoomProps":[[]],"category":"Primary","trigger":"Held","type":"Rifle","magazineSize":80,"reloadTime":2.2,"multishot":1,"attacks":[{"name":"Normal Attack","isBeam":true,"speed":12,"crit_chance":8,"crit_mult":2,"status_chance":34,"shot_type":"Discharge","damage":{"Cold":26}}],"name":"Glaxion","imageName":"glaxion.webp","tags":["Corpus"],"compTags":["BEAM","ASSAULT_AMMO","GLAXION"]},
  "Glaxion Vandal":{"masteryReq":12,"description":"A cutting-edge, halogen-cooled electron accelerator capable of snap-freezing a target in moments.","noise":"Alarming","releaseDate":"2019-05-22","ammoCapacity":800,"productCategory":"LongGuns","equipTime":1.1,"zoomProps":[[]],"category":"Primary","trigger":"Held","type":"Rifle","magazineSize":100,"reloadTime":1.8,"multishot":1,"attacks":[{"name":"Normal Attack","isBeam":true,"speed":12,"crit_chance":14,"crit_mult":2,"status_chance":38,"shot_type":"Discharge","damage":{"Cold":29}}],"name":"Glaxion Vandal","imageName":"glaxion-vandal.webp","tags":["Corpus","Vandal"],"compTags":["BEAM","ASSAULT_AMMO"]},
  "Gorgon Wraith":{"masteryReq":7,"description":"The Gorgon Wraith is a powerful variant of its precursor that features unique styling.","noise":"Alarming","releaseDate":"2014-03-05","ammoCapacity":900,"productCategory":"LongGuns","equipTime":1.1,"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":90,"reloadTime":3,"multishot":1,"attacks":[{"name":"Fully Spooled","speed":13.33,"crit_chance":15,"crit_mult":1.9,"status_chance":21,"shot_type":"Hit-Scan","damage":{"Impact":22.95,"Slash":1.35,"Puncture":2.7}},{"name":"Incarnon Form","isInc":1,"speed":1,"crit_chance":19,"crit_mult":2.1,"status_chance":27,"shot_type":"Projectile","damage":{"Impact":25,"Slash":25,"Puncture":75}},{"name":"Incarnon Form Radial Attack","isInc":1,"speed":1,"crit_chance":19,"crit_mult":2.1,"status_chance":27,"shot_type":"AoE","unique":{"force_procs":["heat"]},"damage":{"Heat":750},"no_headshot_mult":true}],"incMagazineSize":20,"name":"Gorgon Wraith","imageName":"gorgon-wraith.webp","tags":["Wraith","Grineer","Incarnon"],"compTags":["ASSAULT_AMMO","GORGON"],"comb":[[1,2]]},
  "Gotva Prime":{"masteryReq":14,"description":"In the final days of the Old War, long before clone-rot set in, elite Grineer Commanders carried Gotva Prime rifles. Designed to protect surviving Orokin during the Warframe rebellion.","noise":"Alarming","releaseDate":"2013-12-19","ammoCapacity":840,"productCategory":"LongGuns","equipTime":1.1,"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":84,"reloadTime":2,"multishot":1,"attacks":[{"name":"Normal Attack","punch_through":0.5,"speed":13.3,"crit_chance":23,"crit_mult":2.5,"status_chance":27,"shot_type":"Hit-Scan","damage":{"Puncture":25}}],"name":"Gotva Prime","imageName":"GotvaPrime.webp","tags":[""],"compTags":["ASSAULT_AMMO"]},
  "Gorgon":{"masteryReq":3,"description":"The Gorgon sports a large magazine that allows it to provide suppressing fire and sustain a high damage rate over a long time. Its high Fire Rate is only achieved following a short wind-up cycle.","noise":"Alarming","releaseDate":"2012-10-25","ammoCapacity":540,"productCategory":"LongGuns","equipTime":1.1,"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":90,"reloadTime":4.1999998,"multishot":1,"attacks":[{"name":"Fully Spooled","speed":12.5,"crit_chance":17,"crit_mult":1.5,"status_chance":9,"shot_type":"Hit-Scan","damage":{"Impact":18.75,"Slash":2.5,"Puncture":3.75}},{"name":"Incarnon Form","isInc":1,"speed":1.2,"crit_chance":21,"crit_mult":1.9,"status_chance":19,"shot_type":"Projectile","damage":{"Impact":20,"Slash":20,"Puncture":60}},{"name":"Incarnon Form Radial Attack","isInc":1,"speed":1.2,"crit_chance":21,"crit_mult":1.9,"status_chance":19,"shot_type":"AoE","unique":{"force_procs":["heat"]},"damage":{"Heat":750},"no_headshot_mult":true}],"incMagazineSize":20,"name":"Gorgon","imageName":"gorgon.webp","tags":["Grineer","Incarnon"],"compTags":["ASSAULT_AMMO","GORGON"],"comb":[[1,2]]},
  "Grattler (Atmo-mode)":{"masteryReq":4,"description":"Shatter your targets with explosive shells from this devastating Archwing cannon.","releaseDate":"2018-12-18","ammoCapacity":180,"productCategory":"Archguns","zoomProps":[[]],"category":"Archgun","type":"Archgun","magazineSize":30,"reloadTime":2,"multishot":1,"attacks":[{"name":"Projectile Impact","speed":6.25,"crit_chance":25,"crit_mult":2,"status_chance":25,"shot_type":"Projectile","shot_speed":250,"damage":{"Impact":22.5,"Puncture":180,"Slash":22.5}},{"name":"Explosion","speed":6.25,"crit_chance":25,"crit_mult":2,"status_chance":25,"shot_type":"AoE","damage":{"Blast":310},"no_headshot_mult":true}],"name":"Grattler (Atmo-mode)","imageName":"Grattler.webp","tags":[],"compTags":[""]},
  "Grattler (Arch-mode)":{"masteryReq":4,"description":"Shatter your targets with explosive shells from this devastating Archwing cannon.","releaseDate":"2015-07-31","ammoCapacity":0,"productCategory":"Archguns","zoomProps":[[]],"category":"Archgun","type":"Archgun","magazineSize":30,"reloadTime":4,"multishot":1,"attacks":[{"name":"Projectile Impact","speed":6.25,"crit_chance":25,"crit_mult":2,"status_chance":25,"shot_type":"Projectile","shot_speed":250,"damage":{"Impact":15,"Puncture":120,"Slash":15}},{"name":"Explosion","speed":6.25,"crit_chance":25,"crit_mult":2,"status_chance":25,"shot_type":"AoE","damage":{"Blast":205},"no_headshot_mult":true}],"reloadRate":10,"reloadDelay":1,"name":"Grattler (Arch-mode)","imageName":"Grattler.webp","tags":[],"compTags":["BATTERY"]},
  "Grakata":{"masteryReq":5,"description":"Equipped with a huge Magazine and impressive Fire Rate, the Grakata is the preferred weapon of Grineer Lancers.","noise":"Alarming","releaseDate":"2013-04-19","ammoCapacity":750,"productCategory":"LongGuns","equipTime":1.1,"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":60,"reloadTime":2.4000001,"multishot":1,"attacks":[{"name":"Normal Attack","speed":20,"crit_chance":25,"crit_mult":2,"status_chance":20,"shot_type":"Hit-Scan","damage":{"Impact":4.4,"Slash":2.9,"Puncture":3.7}}],"name":"Grakata","imageName":"grakata.webp","tags":["Grineer"],"compTags":["ASSAULT_AMMO","GRAKATA"]},
  "Gram":{"masteryReq":2,"description":"The heavy two-handed sword known as Gram requires great strength to wield, but it is notorious for its splitting power. Can hit multiple targets with each strike.","blockingAngle":55,"comboDuration":5,"followThrough":0.6,"range":2.8,"windUp":1.1,"releaseDate":"2013-02-08","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"320","slam":{"damage":"480.00","radial":{"damage":"160.00","radius":8}},"speed":0.95,"crit_chance":15,"crit_mult":2,"status_chance":15,"damage":{"Impact":24,"Slash":112,"Puncture":24}},{"name":"Slam","radius":8,"type":"s","isHeavy":false,"speed":1,"crit_chance":15,"crit_mult":2,"status_chance":15,"unique":{"force_procs":["impact"]},"damage":{"Impact":320}},{"name":"Heavy Slam","radius":9,"type":"hs","isHeavy":true,"speed":1,"crit_chance":15,"crit_mult":2,"status_chance":15,"damage":{"Blast":480}}],"name":"Gram","imageName":"gram.webp","tags":["Tenno"],"compTags":["HEAVY_BLADE_STANCE"]},
  "Guandao":{"masteryReq":4,"description":"Harvest the enemy with this towering polearm.","blockingAngle":55,"comboDuration":5,"followThrough":0.6,"range":3,"windUp":0.9,"releaseDate":"2017-07-19","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"404","slam":{"damage":"606.00","radial":{"damage":"202.00","element":"Impact","radius":7}},"speed":0.833,"crit_chance":28,"crit_mult":2.2,"status_chance":4,"damage":{"Impact":50.5,"Slash":141.4,"Puncture":10.1}},{"name":"Slam","radius":7,"type":"s","isHeavy":false,"speed":1,"crit_chance":28,"crit_mult":2.2,"status_chance":4,"unique":{"force_procs":["impact"]},"damage":{"Impact":404}},{"name":"Heavy Slam","radius":8,"type":"hs","isHeavy":true,"speed":1,"crit_chance":28,"crit_mult":2.2,"status_chance":4,"damage":{"Blast":606}}],"name":"Guandao","imageName":"guandao.webp","tags":["Tenno"],"compTags":["POLEARMS_STANCE"]},
  "Haalvu":{"masteryReq":14,"description":"Deliver a ruthless barrage of Sentient artillery from this instrument of death. Alt-fire splits the weapon apart into 8 separate rifles, expanding its devastation by tracking up to 4 targets at once, while consuming more ammo per shot.","noise":"Alarming","releaseDate":"2026-07-11","productCategory":"LongGuns","category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":150,"reloadTime":1,"multishot":1,"attacks":[{"name":"Normal Attack","speed":13,"crit_chance":25,"crit_mult":2.5,"status_chance":19,"shot_type":"Hit-Scan","damage":{"tau":33}},{"name":"Alt-Fire","multishot":8,"ammoCost":1.5,"speed":12,"crit_chance":20,"crit_mult":1.8,"status_chance":26,"shot_type":"Hit-Scan","damage":{"tau":34},"burst_count":2,"burst_delay":0.05}],"reloadRate":300,"reloadDelay":0.5,"name":"Haalvu","imageName":"Haalvu.webp","tags":[],"compTags":["ASSAULT_AMMO"]},
  "Guandao Prime":{"masteryReq":12,"description":"That a god might reap a harvest of lives.","blockingAngle":55,"comboDuration":6,"followThrough":0.6,"range":3,"windUp":0.9,"releaseDate":"2020-10-26","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"480","slam":{"damage":"480.00","radial":{"damage":"240.00","element":"Impact","radius":7}},"speed":1,"crit_chance":32,"crit_mult":2.4,"status_chance":20,"damage":{"Impact":60,"Slash":168,"Puncture":12}},{"name":"Slam","radius":7,"type":"s","isHeavy":false,"speed":1,"crit_chance":32,"crit_mult":2.4,"status_chance":20,"unique":{"force_procs":["impact"]},"damage":{"Impact":480}},{"name":"Heavy Slam","radius":9,"type":"hs","isHeavy":true,"speed":1,"crit_chance":32,"crit_mult":2.4,"status_chance":20,"damage":{"Blast":720}}],"name":"Guandao Prime","imageName":"guandao-prime.webp","tags":["Prime"],"compTags":["POLEARMS_STANCE"]},
  "Grinlok":{"masteryReq":7,"description":"With pinpoint accuracy, the Grinlok lever-action repeating rifle can easily find the soft spot on any target.","noise":"Alarming","releaseDate":"2014-02-13","ammoCapacity":540,"productCategory":"LongGuns","equipTime":1.1,"category":"Primary","trigger":"Semi","type":"Rifle","magazineSize":9,"reloadTime":1.7,"multishot":1,"attacks":[{"name":"Normal Attack","speed":1.67,"crit_chance":15,"crit_mult":2.5,"status_chance":35,"shot_type":"Hit-Scan","damage":{"Impact":93.5,"Slash":74.8,"Puncture":18.7}}],"name":"Grinlok","imageName":"grinlok.webp","tags":["Grineer"],"compTags":["ASSAULT_AMMO","GRINLOK"]},
  "Gram Prime":{"masteryReq":14,"description":"Born anew, the father of swords returns.","blockingAngle":55,"comboDuration":5,"followThrough":0.6,"range":2.9,"windUp":1.1,"releaseDate":"2018-09-25","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"600","slam":{"damage":"900.00","radial":{"damage":"300.00","element":"Impact","radius":8}},"speed":0.8,"crit_chance":32,"crit_mult":2.6,"status_chance":32,"damage":{"Impact":60,"Slash":225,"Puncture":15}},{"name":"Slam","radius":8,"type":"s","isHeavy":false,"speed":1,"crit_chance":32,"crit_mult":2.6,"status_chance":32,"unique":{"force_procs":["impact"]},"damage":{"Impact":600}},{"name":"Heavy Slam","radius":9,"type":"hs","isHeavy":true,"speed":1,"crit_chance":32,"crit_mult":2.6,"status_chance":32,"damage":{"Blast":900}}],"name":"Gram Prime","imageName":"gram-prime.webp","tags":["Prime"],"compTags":["HEAVY_BLADE_STANCE"]},
  "Gunsen Prime":{"masteryReq":12,"description":"Lacerate attackers with two razor sharp warfans.","blockingAngle":55,"comboDuration":5,"followThrough":0.7,"range":1.9,"windUp":0.5,"releaseDate":"2023-07-27","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","slam":{"damage":"225.00","radial":{"damage":"225.00","radius":5}},"speed":1.17,"crit_chance":20,"crit_mult":2,"status_chance":34,"damage":{"Impact":9,"Slash":202.5,"Puncture":13.5}},{"name":"Slam","radius":5,"type":"s","isHeavy":false,"speed":1,"crit_chance":20,"crit_mult":2,"status_chance":34,"unique":{"force_procs":["impact"]},"damage":{"Impact":444}},{"name":"Heavy Slam","radius":6,"type":"hs","isHeavy":true,"speed":1,"crit_chance":20,"crit_mult":2,"status_chance":34,"damage":{"Blast":666}}],"name":"Gunsen Prime","imageName":"GunsenPrime.webp","tags":["Tenno"],"compTags":["WARFAN_STANCE"]},
  "Halikar":{"masteryReq":7,"description":"This jet powered Grineer throwing mace always comes back to its master and is even capable of disarming targets.","blockingAngle":55,"comboDuration":5,"followThrough":0.7,"range":1.2,"windUp":1.2,"releaseDate":"2014-10-24","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","slide":"298","slam":{"damage":"447.00","radial":{"damage":"149.00","radius":5}},"isHeavy":false,"speed":1.17,"crit_chance":17,"crit_mult":2,"status_chance":29,"damage":{"Impact":14.9,"Slash":14.9,"Puncture":119.2}},{"name":"Throw","isHeavy":false,"speed":1.17,"crit_chance":19,"crit_mult":2.1,"status_chance":31,"shot_type":"Thrown","shot_speed":30,"flight":30,"unique":{"force_procs":["impact"]},"damage":{"Impact":16.3,"Slash":16.3,"Puncture":130.4}},{"name":"Throw Bounce Explosion","isHeavy":false,"speed":1.17,"crit_chance":19,"crit_mult":2.1,"status_chance":31,"shot_type":"AoE","damage":{"Blast":450},"falloff":{"start":0,"end":4.9,"reduction":0.4},"no_headshot_mult":true},{"name":"Throw Recall Explosion","isHeavy":true,"speed":1.17,"crit_chance":19,"crit_mult":2.1,"status_chance":31,"shot_type":"AoE","unique":{"force_procs":["impact"]},"damage":{"Blast":450},"falloff":{"start":0,"end":4.9,"reduction":0},"no_headshot_mult":true},{"name":"Charged Throw","isHeavy":false,"speed":0.833,"crit_chance":21,"crit_mult":2.3,"status_chance":33,"shot_type":"Thrown","shot_speed":40,"flight":40,"unique":{"force_procs":["impact"]},"damage":{"Impact":32.7,"Slash":32.7,"Puncture":261.6},"charge_time":1.2},{"name":"Charged Throw Bounce Explosion","isHeavy":false,"speed":0.833,"crit_chance":21,"crit_mult":2.3,"status_chance":33,"shot_type":"AoE","damage":{"Blast":447},"falloff":{"start":0,"end":4.9,"reduction":0.4},"no_headshot_mult":true,"charge_time":1.2},{"name":"Charged Throw Recall Explosion","isHeavy":true,"speed":0.833,"crit_chance":21,"crit_mult":2.3,"status_chance":33,"shot_type":"AoE","unique":{"force_procs":["impact"]},"damage":{"Blast":894},"falloff":{"start":0,"end":4.9,"reduction":0},"no_headshot_mult":true,"charge_time":1.2},{"name":"Slam","radius":5,"type":"s","isHeavy":false,"speed":1,"crit_chance":17,"crit_mult":2,"status_chance":29,"unique":{"force_procs":["impact"]},"damage":{"Magnetic":298}},{"name":"Heavy Slam","radius":6,"type":"hs","isHeavy":true,"speed":1,"crit_chance":17,"crit_mult":2,"status_chance":29,"damage":{"Magnetic":447}}],"name":"Halikar","imageName":"halikar.webp","tags":["Grineer"],"compTags":["GLAIVES_STANCE"],"comb":[[1,2],[4,5]]},
  "Gunsen":{"masteryReq":8,"description":"Lacerate attackers with two razor sharp warfans.","blockingAngle":55,"comboDuration":5,"followThrough":0.7,"range":1.7,"windUp":0.5,"releaseDate":"2017-10-12","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"160","slam":{"damage":"480.00","radial":{"damage":"160.00","element":"Impact","radius":5}},"speed":1.17,"crit_chance":16,"crit_mult":2,"status_chance":28,"damage":{"Impact":12.8,"Slash":128,"Puncture":19.2}},{"name":"Slam","radius":5,"type":"s","isHeavy":false,"speed":1,"crit_chance":16,"crit_mult":2,"status_chance":28,"unique":{"force_procs":["impact"]},"damage":{"Impact":320}},{"name":"Heavy Slam","radius":6,"type":"hs","isHeavy":true,"speed":1,"crit_chance":16,"crit_mult":2,"status_chance":28,"damage":{"Blast":480}}],"name":"Gunsen","imageName":"gunsen.webp","tags":["Tenno"],"compTags":["WARFAN_STANCE"]},
  "Halikar Wraith":{"masteryReq":13,"description":"A different take on the throwing mace, the Halikar Wraith features unique styling.","blockingAngle":55,"comboDuration":5,"followThrough":0.7,"range":1.2,"windUp":1.2,"releaseDate":"2021-04-05","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","slide":"450","slam":{"damage":"675.00","radial":{"damage":"225.00","radius":5}},"isHeavy":false,"speed":1.17,"crit_chance":19,"crit_mult":2.3,"status_chance":35,"damage":{"Impact":22.5,"Slash":22.5,"Puncture":180}},{"name":"Throw","isHeavy":false,"speed":1.17,"crit_chance":21,"crit_mult":2.3,"status_chance":39,"shot_type":"Thrown","shot_speed":30,"flight":30,"unique":{"force_procs":["impact"]},"damage":{"Impact":87.7,"Slash":87.7,"Puncture":87.7}},{"name":"Throw Bounce Explosion","isHeavy":false,"speed":1.17,"crit_chance":21,"crit_mult":2.3,"status_chance":39,"shot_type":"AoE","damage":{"Blast":329},"falloff":{"start":0,"end":5.1,"reduction":0.4},"no_headshot_mult":true},{"name":"Throw Recall Explosion","isHeavy":true,"speed":1.17,"crit_chance":21,"crit_mult":2.3,"status_chance":39,"shot_type":"AoE","unique":{"force_procs":["impact"]},"damage":{"Blast":658},"falloff":{"start":0,"end":5.1,"reduction":0},"no_headshot_mult":true},{"name":"Charged Throw","isHeavy":false,"speed":0.833,"crit_chance":21,"crit_mult":2.5,"status_chance":41,"shot_type":"Thrown","shot_speed":40,"flight":40,"unique":{"force_procs":["impact"]},"damage":{"Impact":52.7,"Slash":22.7,"Puncture":421.6},"charge_time":1.2},{"name":"Charged Throw Bounce Explosion","isHeavy":false,"speed":0.833,"crit_chance":21,"crit_mult":2.5,"status_chance":41,"shot_type":"AoE","damage":{"Blast":657},"falloff":{"start":0,"end":5.1,"reduction":0.4},"no_headshot_mult":true,"charge_time":1.2},{"name":"Charged Throw Recall Explosion","isHeavy":true,"speed":0.833,"crit_chance":21,"crit_mult":2.5,"status_chance":41,"shot_type":"AoE","unique":{"force_procs":["impact"]},"damage":{"Blast":1314},"falloff":{"start":0,"end":5.1,"reduction":0},"no_headshot_mult":true,"charge_time":1.2},{"name":"Slam","radius":5,"type":"s","isHeavy":false,"speed":1,"crit_chance":19,"crit_mult":2.3,"status_chance":35,"unique":{"force_procs":["impact"]},"damage":{"Magnetic":450}},{"name":"Heavy Slam","radius":6,"type":"hs","isHeavy":true,"speed":1,"crit_chance":19,"crit_mult":2.3,"status_chance":35,"damage":{"Magnetic":675}}],"name":"Halikar Wraith","imageName":"halikar-wraith.webp","tags":["Grineer","Wraith","Baro"],"compTags":["GLAIVES_STANCE"],"comb":[[1,2],[4,5]]},
  "Grimoire":{"masteryReq":10,"description":"Claim the power of Albrecht Entrati's knowledge. Customize the Grimoire with Tome Mods that enhance Warframe Abilities and reward strategic combat. Its alternate attack releases a voltaic orb with guaranteed Electricity Status.","noise":"Alarming","releaseDate":"2023-13-12","ammoCapacity":"Infinity","productCategory":"Pistols","category":"Secondary","type":"Pistol","magazineSize":10,"reloadTime":0,"multishot":1,"attacks":[{"name":"Normal Attack","speed":1.5,"crit_chance":20,"crit_mult":2,"status_chance":26,"shot_type":"Projectile","damage":{"Electricity":100}},{"name":"Normal Radial Attack","speed":1.5,"crit_chance":20,"crit_mult":2,"status_chance":26,"shot_type":"AoE","damage":{"Electricity":50},"no_headshot_mult":true},{"name":"Alt-Fire Active Attack","speed":1,"crit_chance":20,"crit_mult":2,"status_chance":26,"shot_type":"Projectile","damage":{"Electricity":350}},{"name":"Alt-Fire Active Radial Attack","speed":1,"crit_chance":20,"crit_mult":2,"status_chance":26,"shot_type":"AoE","damage":{"Electricity":250},"no_headshot_mult":true}],"name":"Grimoire","imageName":"Grimoire.webp","tags":[],"compTags":["GRIMOIRE"],"comb":[[0,1],[2,3]]},
  "Hate":{"masteryReq":8,"description":"Hate is a scythe with a cruel blade, wielded by The Stalker.","blockingAngle":60,"comboDuration":5,"followThrough":0.6,"range":2.8,"windUp":1,"releaseDate":"2013-05-23","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"460","slam":{"damage":"690.00","radial":{"damage":"230.00","radius":8}},"speed":0.917,"crit_chance":30,"crit_mult":2.5,"status_chance":20,"damage":{"Impact":34.5,"Slash":161,"Puncture":34.5}},{"name":"Incarnon Form - Spectral Scythe","isInc":1,"speed":0.917,"crit_chance":30,"crit_mult":2.5,"status_chance":20,"damage":{"Impact":17.25,"Slash":80.5,"Puncture":17.25}},{"name":"Incarnon Form - Spectral Scythe Explode","isInc":1,"speed":0.917,"crit_chance":30,"crit_mult":2.5,"status_chance":20,"shot_type":"AoE","damage":{"Heat":115},"no_headshot_mult":true},{"name":"Slam","radius":8,"type":"s","isHeavy":false,"speed":1,"crit_chance":30,"crit_mult":2.5,"status_chance":20,"unique":{"force_procs":["impact"]},"damage":{"Blast":460}},{"name":"Heavy Slam","radius":9,"type":"hs","isHeavy":true,"speed":1,"crit_chance":30,"crit_mult":2.5,"status_chance":20,"damage":{"Blast":690}}],"name":"Hate","imageName":"hate.webp","tags":["Stalker","Incarnon"],"compTags":["SCYTHES_STANCE","HATE"],"comb":[[1,2]]},
  "Harmony":{"masteryReq":10,"description":"Harmony triumphs over hate. Heavy Attacks condense Status Effect damage into a single instance. Heavy Attack kills empower allies with increased Status Duration. Experience the true power of Jade's Ensemble when Evensong, Cantare, and Harmony sing together.","blockingAngle":60,"comboDuration":5,"followThrough":0.6,"range":2.6,"windUp":1,"releaseDate":"2024-06-18","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":1.08,"crit_chance":20,"crit_mult":2.2,"status_chance":36,"damage":{"Slash":72,"Puncture":168}},{"name":"Slam","radius":8,"type":"s","isHeavy":false,"speed":1,"crit_chance":20,"crit_mult":2.2,"status_chance":36,"unique":{"force_procs":["impact"]},"damage":{"Impact":480}},{"name":"Heavy Slam","radius":9,"type":"hs","isHeavy":true,"speed":1,"crit_chance":20,"crit_mult":2.2,"status_chance":36,"damage":{"Impact":720}}],"name":"Harmony","imageName":"Harmony.webp","tags":[],"compTags":["SCYTHES_STANCE"]},
  "Harpak":{"masteryReq":7,"description":"Spike enemies to the wall or reel them in with this burst harpoon gun.","noise":"Alarming","releaseDate":"2015-07-31","ammoCapacity":540,"productCategory":"LongGuns","equipTime":1.1,"category":"Primary","trigger":"Burst","type":"Rifle","magazineSize":45,"reloadTime":2,"multishot":1,"attacks":[{"name":"Normal Attack","speed":5,"crit_chance":20,"crit_mult":2.3,"status_chance":17,"shot_type":"Projectile","shot_speed":80,"flight":80,"damage":{"Impact":5,"Slash":7.5,"Puncture":37.5},"burst_count":3,"burst_delay":0.1},{"name":"Harpoon","isCoMult":true,"speed":1.5,"crit_chance":25,"crit_mult":2.3,"status_chance":13,"shot_type":"Projectile","shot_speed":60,"flight":60,"unique":{"force_procs":["puncture"]},"damage":{"Impact":40,"Slash":10,"Puncture":50}}],"name":"Harpak","imageName":"harpak.webp","tags":["Grineer"],"compTags":["PROJECTILE","ASSAULT_AMMO","HARPAK"]},
  "Hema":{"masteryReq":7,"description":"A bloodsucker. This symbiotic burst-rifle leeches health to forge its ammo and then restores health with each headshot.","noise":"Alarming","releaseDate":"2016-12-22","ammoCapacity":60,"productCategory":"LongGuns","equipTime":1.1,"category":"Primary","trigger":"Burst","type":"Rifle","magazineSize":60,"reloadTime":2,"multishot":1,"attacks":[{"name":"Normal Attack","isCoMult":true,"speed":5,"crit_chance":11,"crit_mult":2,"status_chance":25,"shot_type":"Projectile","shot_speed":150,"flight":150,"damage":{"Viral":47},"burst_count":3,"burst_delay":0.1}],"name":"Hema","imageName":"hema.webp","tags":["Infested"],"compTags":["ASSAULT_AMMO","PROJECTILE","HEMA"]},
  "Heat Sword":{"masteryReq":3,"description":"A strong blade capable of inflicting <DT_SLASH>Slash Damage to its foes.","blockingAngle":55,"comboDuration":5,"followThrough":0.6,"range":2.5,"windUp":0.6,"releaseDate":"2012-12-18","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","slide":"147","slam":{"damage":"441.00","radial":{"damage":"147.00","element":"Heat","radius":7}},"speed":0.917,"crit_chance":5,"crit_mult":1.5,"status_chance":20,"damage":{"Impact":14.7,"Slash":117.6,"Puncture":14.7}},{"name":"Slam","radius":7,"type":"s","isHeavy":false,"speed":1,"crit_chance":5,"crit_mult":1.5,"status_chance":20,"unique":{"force_procs":["heat","impact"]},"damage":{"Heat":294}},{"name":"Heavy Slam","radius":8,"type":"hs","isHeavy":true,"speed":1,"crit_chance":5,"crit_mult":1.5,"status_chance":20,"damage":{"Heat":441}}],"name":"Heat Sword","imageName":"heat-sword.webp","tags":["Tenno"],"compTags":["SWORDS_STANCE"]},
  "Hek":{"masteryReq":4,"description":"The Hek is a powerful shotgun that fires its shots with a tight spread, making it efficient at medium range as long as its strong recoil is properly managed.","noise":"Alarming","releaseDate":"2013-01-04","ammoCapacity":120,"productCategory":"LongGuns","zoomProps":[[]],"category":"Primary","trigger":"Semi","type":"Shotgun","magazineSize":4,"reloadTime":2,"multishot":7,"attacks":[{"name":"Normal Attack","speed":2.17,"crit_chance":10,"crit_mult":2,"status_chance":10.7,"shot_type":"Hit-Scan","damage":{"Impact":11.25,"Slash":15,"Puncture":48.75},"falloff":{"start":10,"end":20,"reduction":0.8}}],"name":"Hek","imageName":"hek.webp","tags":["Grineer"],"compTags":["SINGLESHOT","HEK"]},
  "Heat Dagger":{"masteryReq":3,"description":"This short blade weapon has limited range but comes out fast and can inflict fire damage.","blockingAngle":45,"comboDuration":5,"followThrough":0.9,"range":1.75,"windUp":0.4,"releaseDate":"2012-12-18","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"416","slam":{"damage":"416.00","radial":{"damage":"208.00","radius":5}},"speed":0.75,"crit_chance":14,"crit_mult":1.6,"status_chance":14,"damage":{"Impact":14,"Slash":56,"Puncture":76,"Heat":62}},{"name":"Slam","radius":5,"type":"s","isHeavy":false,"speed":1,"crit_chance":14,"crit_mult":1.6,"status_chance":14,"unique":{"force_procs":["heat","impact"]},"damage":{"Heat":416}},{"name":"Heavy Slam","radius":6,"type":"hs","isHeavy":true,"speed":1,"crit_chance":14,"crit_mult":1.6,"status_chance":14,"damage":{"Heat":624}}],"name":"Heat Dagger","imageName":"heat-dagger.webp","tags":["Tenno"],"compTags":["DAGGERS_STANCE"]},
  "Heliocor":{"masteryReq":9,"description":"Obtain enlightenment with this massive hammer that performs a Codex scan on each fatal strike. Scans require an equipped Codex Scanner and an available charge.","blockingAngle":50,"comboDuration":5,"followThrough":0.4,"range":2.5,"windUp":1.2,"releaseDate":"2016-07-28","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"560","slam":{"damage":"840.00","radial":{"damage":"280.00","radius":9}},"speed":0.833,"crit_chance":38,"crit_mult":2,"status_chance":12,"damage":{"Impact":238,"Slash":14,"Puncture":28}},{"name":"Slam","radius":9,"type":"s","isHeavy":false,"speed":1,"crit_chance":38,"crit_mult":2,"status_chance":12,"damage":{"Blast":560}},{"name":"Heavy Slam","radius":10,"type":"hs","isHeavy":true,"speed":1,"crit_chance":38,"crit_mult":2,"status_chance":12,"damage":{"Blast":840}}],"name":"Heliocor","imageName":"heliocor.webp","tags":["Cephalon Simaris"],"compTags":["HAMMERS_STANCE"]},
  "Hespar":{"masteryReq":12,"description":"This Heavy Scythe echoes battles of another time. It is far more a weapon of sheer force than one of finesse.","blockingAngle":65,"comboDuration":5,"followThrough":0.4,"range":2.8,"windUp":1,"releaseDate":"2022-04-27","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"560","slam":{"damage":"840.00","radial":{"damage":"280.00","radius":8}},"speed":1,"crit_chance":24,"crit_mult":2.2,"status_chance":28,"damage":{"Impact":112,"Slash":134.4,"Puncture":33.6}},{"name":"Slam","radius":8,"type":"s","isHeavy":false,"speed":1,"crit_chance":24,"crit_mult":2.2,"status_chance":28,"unique":{"force_procs":["impact"]},"damage":{"Blast":560}},{"name":"Heavy Slam","radius":9,"type":"hs","isHeavy":true,"speed":1,"crit_chance":24,"crit_mult":2.2,"status_chance":28,"damage":{"Blast":840}}],"name":"Hespar","imageName":"hespar.webp","tags":["Duviri"],"compTags":["HEAVY SCYTHE_STANCE"]},
  "Higasa":{"masteryReq":2,"description":"Depend on Higasa when it rains bullets. Aiming creates a shield that blocks weapon fire. Kills and blocked shots charge a beam released by Alternate Fire.","noise":"Alarming","releaseDate":"2024-10-02","ammoCapacity":540,"productCategory":"LongGuns","category":"Primary","trigger":"Burst","type":"Rifle","magazineSize":90,"reloadTime":2.5,"multishot":1,"attacks":[{"name":"Auto","speed":2.5,"crit_chance":24,"crit_mult":2,"status_chance":18,"shot_type":"Projectile","shot_speed":100,"damage":{"Slash":10.4,"Puncture":15.6},"burst_count":5,"burst_delay":0.1},{"name":"Charged Shot","punch_through":2,"speed":1.2,"crit_chance":24,"crit_mult":2,"status_chance":18,"shot_type":"Hit-Scan","damage":{"Blast":390},"charge_time":1}],"name":"Higasa","imageName":"Higasa.webp","tags":[],"compTags":["ASSAULT_AMMO","HIGASA"]},
  "Hikou Prime":{"masteryReq":4,"description":"As deadly as any bullet without the associated noise or commotion.","noise":"Silent","releaseDate":"2014-09-23","productCategory":"Pistols","category":"Secondary","trigger":"Auto","type":"Throwing","magazineSize":26,"reloadTime":0.5,"multishot":1,"attacks":[{"name":"Normal Attack","speed":5.83,"crit_chance":6,"crit_mult":1.8,"status_chance":28,"shot_type":"Projectile","shot_speed":70,"flight":70,"damage":{"Impact":3.6,"Slash":1.8,"Puncture":30.6}}],"name":"Hikou Prime","imageName":"hikou-prime.webp","tags":["Prime","Never Vaulted"],"compTags":["PROJECTILE","THROWN"]},
  "Hind":{"masteryReq":0,"description":"A powerful mid-range rifle used by Grineer shock troops, the Hind fires in five round bursts.","noise":"Alarming","releaseDate":"2013-08-16","ammoCapacity":540,"productCategory":"LongGuns","equipTime":1.1,"category":"Primary","trigger":"Burst","type":"Rifle","magazineSize":65,"reloadTime":2,"multishot":1,"attacks":[{"name":"Burst Mode","speed":5,"crit_chance":7,"crit_mult":1.5,"status_chance":15,"shot_type":"Hit-Scan","damage":{"Impact":7.5,"Slash":15,"Puncture":7.5},"burst_count":5,"burst_delay":0.12},{"name":"Semi-Auto Mode","speed":2.5,"crit_chance":15,"crit_mult":2,"status_chance":10,"damage":{"Impact":12,"Slash":36,"Puncture":12}}],"name":"Hind","imageName":"hind.webp","tags":["Grineer"],"compTags":["ASSAULT_AMMO"]},
  "Ignis":{"masteryReq":5,"description":"Ignis produces a stream of intense heat.","noise":"Alarming","releaseDate":"2013-05-23","ammoCapacity":150,"productCategory":"LongGuns","equipTime":1.1,"zoomProps":[[]],"category":"Primary","trigger":"Held","type":"Rifle","magazineSize":150,"reloadTime":2,"multishot":1,"attacks":[{"name":"Normal Attack","isBeam":true,"speed":8,"crit_chance":11,"crit_mult":2,"status_chance":27,"shot_type":"Discharge","damage":{"Heat":33},"no_headshot_mult":true}],"name":"Ignis","imageName":"ignis.webp","tags":["Grineer"],"compTags":["BEAM","ASSAULT_AMMO","AOE"]},
  "Hikou":{"masteryReq":2,"description":"As an alternative to Kunai, these Tenno throwing stars do cause less Damage but they come with expanded Ammo Capacity and a higher Fire Rate.","noise":"Silent","releaseDate":"2013-07-13","productCategory":"Pistols","category":"Secondary","trigger":"Auto","type":"Throwing","magazineSize":20,"reloadTime":0.75,"multishot":1,"attacks":[{"name":"Normal Attack","speed":6.67,"crit_chance":4,"crit_mult":1.6,"status_chance":10,"shot_type":"Projectile","shot_speed":70,"flight":70,"damage":{"Impact":2.6,"Slash":7.8,"Puncture":15.6}}],"name":"Hikou","imageName":"hikou.webp","tags":["Tenno"],"compTags":["PROJECTILE","THROWN"]},
  "Hystrix Prime":{"masteryReq":12,"description":"Versatile weapons complement deadly hunters. Khora Prime’s signature pistol rotates through hot, cold, electric, and toxic quills. When equipped on Khora, Hystrix Prime has a chance to instantly reload after headshots.","noise":"Alarming","releaseDate":"2022-05-21","ammoCapacity":320,"productCategory":"Pistols","zoomProps":[[]],"category":"Secondary","trigger":"Auto","type":"Pistol","magazineSize":16,"reloadTime":1.6,"multishot":1,"attacks":[{"name":"Poison Quill","speed":7,"crit_chance":28,"crit_mult":2.2,"status_chance":20,"shot_type":"Projectile","shot_speed":80,"flight":80,"unique":{"force_procs":["toxin"]},"damage":{"Impact":2.76,"Slash":3.68,"Puncture":39.56}},{"name":"Ice Quill","speed":7,"crit_chance":28,"crit_mult":2.2,"status_chance":20,"shot_type":"Projectile","shot_speed":80,"flight":80,"unique":{"force_procs":["cold"]},"damage":{"Impact":2.76,"Slash":3.68,"Puncture":39.56}},{"name":"Fire Quill","speed":7,"crit_chance":28,"crit_mult":2.2,"status_chance":20,"shot_type":"Projectile","shot_speed":80,"flight":80,"unique":{"force_procs":["heat"]},"damage":{"Impact":2.76,"Slash":3.68,"Puncture":39.56}},{"name":"Electric Quill","speed":7,"crit_chance":28,"crit_mult":2.2,"status_chance":20,"shot_type":"Projectile","shot_speed":80,"flight":80,"unique":{"force_procs":["electricity"]},"damage":{"Impact":2.76,"Slash":3.68,"Puncture":39.56}}],"name":"Hystrix Prime","imageName":"hystrix-prime.webp","tags":["Prime"],"compTags":[]},
  "Ignis Wraith":{"masteryReq":9,"description":"A blood-red variant of this destructive flamethrower.","noise":"Alarming","releaseDate":"2017-03-02","ammoCapacity":200,"productCategory":"LongGuns","equipTime":1.1,"zoomProps":[[]],"category":"Primary","trigger":"Held","type":"Rifle","magazineSize":200,"reloadTime":1.7,"multishot":1,"attacks":[{"name":"Normal Attack","isBeam":true,"speed":8,"crit_chance":17,"crit_mult":2.5,"status_chance":29,"shot_type":"Discharge","damage":{"Heat":35},"no_headshot_mult":true}],"name":"Ignis Wraith","imageName":"ignis-wraith.webp","tags":["Wraith","Grineer"],"compTags":["BEAM","ASSAULT_AMMO","AOE"]},
  "Hystrix":{"masteryReq":7,"description":"Heat, cold, electricity, or toxin: choose an element and launch a flurry of deadly quills. This versatile sidearm is Khora’s signature weapon and has a chance to instantly reload after headshots when she wields it.","noise":"Alarming","releaseDate":"2018-04-20","ammoCapacity":320,"productCategory":"Pistols","zoomProps":[[]],"category":"Secondary","trigger":"Auto","type":"Pistol","magazineSize":16,"reloadTime":1.7,"multishot":1,"attacks":[{"name":"Poison Quill","speed":7,"crit_chance":24,"crit_mult":2.2,"status_chance":10,"shot_type":"Projectile","shot_speed":80,"flight":80,"unique":{"force_procs":["toxin"]},"damage":{"Impact":2.16,"Slash":2.88,"Puncture":30.96}},{"name":"Ice Quill","speed":7,"crit_chance":24,"crit_mult":2.2,"status_chance":10,"shot_type":"Projectile","shot_speed":80,"flight":80,"unique":{"force_procs":["cold"]},"damage":{"Impact":2.16,"Slash":2.88,"Puncture":30.96}},{"name":"Fire Quill","speed":7,"crit_chance":24,"crit_mult":2.2,"status_chance":10,"shot_type":"Projectile","shot_speed":80,"flight":80,"unique":{"force_procs":["heat"]},"damage":{"Impact":2.4,"Slash":3.2,"Puncture":34.4}},{"name":"Electric Quill","speed":7,"crit_chance":24,"crit_mult":2.2,"status_chance":10,"shot_type":"Projectile","shot_speed":80,"flight":80,"unique":{"force_procs":["electricity"]},"damage":{"Impact":2.4,"Slash":3.2,"Puncture":34.4}}],"name":"Hystrix","imageName":"hystrix.webp","tags":["Tenno"],"compTags":[]},
  "Imperator (Arch-mode)":{"masteryReq":0,"description":"A long range rifle capable of firing in space,the Imperator's versatility makes it an ideal weapon for space combat.","releaseDate":"2014-10-24","ammoCapacity":0,"productCategory":"Archguns","zoomProps":[[]],"category":"Archgun","type":"Archgun","magazineSize":200,"reloadTime":5.25,"multishot":1,"attacks":[{"name":"Normal Attack","speed":16.7,"crit_chance":24,"crit_mult":2,"status_chance":12,"shot_type":"Projectile","shot_speed":220,"damage":{"Impact":20,"Puncture":17.5,"Slash":12.5}}],"reloadRate":50,"reloadDelay":0.25,"name":"Imperator (Arch-mode)","imageName":"Imperator.webp","tags":[""],"compTags":["BATTERY"]},
  "Imperator (Atmo-mode)":{"masteryReq":0,"description":"A long range rifle capable of firing in space,the Imperator's versatility makes it an ideal weapon for space combat.","releaseDate":"2018-12-18","ammoCapacity":800,"productCategory":"Archguns","zoomProps":[[]],"category":"Archgun","type":"Archgun","magazineSize":200,"reloadTime":2,"multishot":1,"attacks":[{"name":"Normal Attack","speed":16.7,"crit_chance":24,"crit_mult":2,"status_chance":12,"shot_type":"Hit-Scan","damage":{"Impact":40,"Puncture":35,"Slash":25}}],"name":"Imperator (Atmo-mode)","imageName":"Imperator.webp","tags":[],"compTags":[""]},
  "Hirudo":{"masteryReq":7,"description":"Rip into the enemy with fists of razor sharp cartilage. Steals health with each critical hit.","blockingAngle":50,"comboDuration":5,"followThrough":0.9,"range":1.25,"windUp":0.5,"releaseDate":"2016-12-22","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"260","slam":{"damage":"390.00","radial":{"damage":"130.00","element":"Impact","radius":7}},"speed":1,"crit_chance":30,"crit_mult":3,"status_chance":11,"damage":{"Impact":19.5,"Slash":6.5,"Puncture":104}},{"name":"Slam","radius":7,"type":"s","isHeavy":false,"speed":1,"crit_chance":30,"crit_mult":3,"status_chance":11,"unique":{"force_procs":["impact"]},"damage":{"Impact":260}},{"name":"Heavy Slam","radius":8,"type":"hs","isHeavy":true,"speed":1,"crit_chance":30,"crit_mult":3,"status_chance":11,"damage":{"Blast":390}}],"name":"Hirudo","imageName":"hirudo.webp","tags":["Infested"],"compTags":["SPARRING_STANCE"]},
  "Imperator Vandal (Atmo-mode)":{"masteryReq":5,"description":"The Imperator Vandal has been customized by the Tenno with a blue-green metallic finish and Lotus branding on the barrel.","releaseDate":"2018-12-18","ammoCapacity":1200,"productCategory":"Archguns","zoomProps":[[]],"category":"Archgun","type":"Archgun","magazineSize":300,"reloadTime":2,"multishot":1,"attacks":[{"name":"Normal Attack","speed":25,"crit_chance":28,"crit_mult":2.4,"status_chance":12,"shot_type":"Hit-Scan","damage":{"Impact":40,"Puncture":35,"Slash":25}}],"name":"Imperator Vandal (Atmo-mode)","imageName":"ImperatorVandal.webp","tags":[],"compTags":[""]},
  "Imperator Vandal (Arch-mode)":{"masteryReq":5,"description":"The Imperator Vandal has been customized by the Tenno with a blue-green metallic finish and Lotus branding on the barrel.","releaseDate":"2014-12-19","ammoCapacity":0,"productCategory":"Archguns","zoomProps":[[]],"category":"Archgun","type":"Archgun","magazineSize":300,"reloadTime":4.25,"multishot":1,"attacks":[{"name":"Normal Attack","speed":25,"crit_chance":28,"crit_mult":2.4,"status_chance":12,"shot_type":"Projectile","shot_speed":220,"damage":{"Impact":20,"Puncture":17.5,"Slash":12.5}}],"reloadRate":75,"reloadDelay":0.15,"name":"Imperator Vandal (Arch-mode)","imageName":"ImperatorVandal.webp","tags":[""],"compTags":["BATTERY"]},
  "Iron Staff (Wukong)":{"masteryReq":0,"description":"Iron Staff is Wukong's and Wukong Prime's signature Exalted Weapon","blockingAngle":65,"comboDuration":5,"followThrough":1,"range":3.5,"windUp":0.5,"releaseDate":"2019-07-06","productCategory":"Melee","category":"Melee","type":"Exalted Weapon","multishot":1,"attacks":[{"name":"Normal Attack","slide":"250","slam":{"damage":"750.00","radial":{"damage":"250.00","radius":8}},"speed":1,"crit_chance":25,"crit_mult":2,"status_chance":30,"damage":{"Impact":170,"Slash":80}},{"name":"Slam","radius":7,"type":"s","isHeavy":false,"speed":1,"crit_chance":25,"crit_mult":2,"status_chance":30,"damage":{"Impact":600}},{"name":"Heavy Slam","radius":10,"type":"hs","isHeavy":true,"speed":1,"crit_chance":25,"crit_mult":2,"status_chance":30,"damage":{"Blast":900}}],"name":"Iron Staff (Wukong)","imageName":"IronStaff.webp","tags":[],"compTags":["IRON_STAFF_STANCE","POWER_WEAPON"]},
  "Jat Kittag":{"masteryReq":5,"description":"Deliver crushing blows with this Grineer built, jet powered mace.","blockingAngle":50,"comboDuration":5,"followThrough":0.4,"range":2.8,"windUp":1.2,"releaseDate":"2014-02-05","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","slide":"400","slam":{"damage":"600.00","radial":{"damage":"200.00","element":"Blast","radius":9}},"speed":1,"crit_chance":15,"crit_mult":2,"status_chance":25,"damage":{"Impact":160,"Slash":10,"Puncture":30}},{"name":"Slam","radius":9,"type":"s","isHeavy":false,"speed":1,"crit_chance":15,"crit_mult":2,"status_chance":25,"damage":{"Blast":400}},{"name":"Heavy Slam","radius":10,"type":"hs","isHeavy":true,"speed":1,"crit_chance":15,"crit_mult":2,"status_chance":25,"damage":{"Blast":600}}],"name":"Jat Kittag","imageName":"jat-kittag.webp","tags":["Grineer"],"compTags":["HAMMERS_STANCE"]},
  "Innodem":{"masteryReq":14,"description":"In the early Orokin Empire, elites wore Innodem as a symbolic reminder to defend the defenseless. The tradition fell out of style, but nostalgic elites acknowledged the sentiment in the form of a gift. The Void amplifies that ideal. Void energy strengthens Innodem gliding aerial attacks and the wielder is increasingly resilient as they perform finisher attacks in Incarnon Form.","blockingAngle":50,"comboDuration":5,"followThrough":0.9,"range":1.8,"windUp":0.4,"releaseDate":"2022-06-09","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"720","slam":{"damage":"720.00","radial":{"damage":"360.00","radius":5}},"speed":0.75,"crit_chance":22,"crit_mult":2,"status_chance":22,"damage":{"Impact":36,"Slash":180,"Puncture":144}},{"name":"Incarnon Form","isInc":1,"speed":0.75,"crit_chance":22,"crit_mult":2,"status_chance":22,"unique":{"speed":0.4},"damage":{"Radiation":360}},{"name":"Slam","radius":5,"type":"s","isHeavy":false,"speed":1,"crit_chance":22,"crit_mult":2,"status_chance":22,"unique":{"force_procs":["impact"]},"damage":{"Impact":720}},{"name":"Heavy Slam","radius":7,"type":"hs","isHeavy":true,"speed":1,"crit_chance":22,"crit_mult":2,"status_chance":22,"damage":{"Blast":1080}}],"name":"Innodem","imageName":"innodem.webp","tags":["Zariman","Incarnon"],"compTags":["DAGGERS_STANCE"]},
  "Jaw Sword":{"masteryReq":0,"description":"A blade with a serrated edge that delivers strong quick attacks.","blockingAngle":55,"comboDuration":5,"followThrough":0.6,"range":2.5,"windUp":0.6,"releaseDate":"2012-12-18","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"120","slam":{"damage":"360.00","radial":{"damage":"120.00","element":"Impact","radius":7}},"speed":0.917,"crit_chance":8,"crit_mult":1.5,"status_chance":16,"damage":{"Impact":6,"Slash":90,"Puncture":24}},{"name":"Slam","radius":7,"type":"s","isHeavy":false,"speed":1,"crit_chance":8,"crit_mult":1.5,"status_chance":16,"unique":{"force_procs":["impact"]},"damage":{"Impact":240}},{"name":"Heavy Slam","radius":8,"type":"hs","isHeavy":true,"speed":1,"crit_chance":8,"crit_mult":1.5,"status_chance":16,"damage":{"Blast":360}}],"name":"Jaw Sword","imageName":"jaw-sword.webp","tags":["Tenno"],"compTags":["SWORDS_STANCE","JAW_SWORD"]},
  "Jat Kusar":{"masteryReq":11,"description":"Overwhelm hostiles with this jet-powered sickle and razor-chain weapon. Charged strikes ignite an explosive blast at range.","blockingAngle":60,"comboDuration":5,"followThrough":0.5,"range":2.4000001,"windUp":0.4,"releaseDate":"2017-07-26","productCategory":"Melee","equipTime":0.93333,"category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","slide":"218","slam":{"damage":"654.00","radial":{"damage":"218.00","element":"Heat","radius":7}},"speed":0.833,"crit_chance":35,"crit_mult":2.5,"status_chance":19,"damage":{"Impact":79,"Slash":45,"Puncture":13,"Heat":81}},{"name":"Slam","radius":7,"type":"s","isHeavy":false,"speed":1,"crit_chance":35,"crit_mult":2.5,"status_chance":19,"unique":{"force_procs":["impact"]},"damage":{"Heat":436}},{"name":"Heavy Slam","radius":8,"type":"hs","isHeavy":true,"speed":1,"crit_chance":35,"crit_mult":2.5,"status_chance":19,"damage":{"Heat":654}}],"name":"Jat Kusar","imageName":"jat-kusar.webp","tags":["Grineer"],"compTags":["BLADE_AND_WHIP_STANCE"]},
  "Karak":{"masteryReq":1,"description":"Solid, dependable and deadly. The Karak is a standard issue rifle in many Grineer platoons.","noise":"Alarming","releaseDate":"2013-12-19","ammoCapacity":540,"productCategory":"LongGuns","equipTime":1.1,"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":30,"reloadTime":2,"multishot":1,"attacks":[{"name":"Normal Attack","speed":11.67,"crit_chance":9,"crit_mult":1.5,"status_chance":15,"shot_type":"Hit-Scan","damage":{"Impact":13.05,"Slash":7.25,"Puncture":8.7}}],"name":"Karak","imageName":"karak.webp","tags":["Grineer"],"compTags":["ASSAULT_AMMO"]},
  "Javlok":{"masteryReq":7,"description":"Launch super-heated slugs at individual foes, or hurl the entire weapon and ignite groups of enemies in a flash inferno.","noise":"Alarming","releaseDate":"2016-12-16","ammoCapacity":150,"productCategory":"LongGuns","equipTime":1.1,"zoomProps":[[]],"category":"Primary","trigger":"Charge","type":"Rifle","magazineSize":6,"reloadTime":1.9,"multishot":1,"attacks":[{"name":"Projectile Impact","isCoMult":true,"speed":3.33,"crit_chance":20,"crit_mult":2,"status_chance":25,"shot_type":"Projectile","shot_speed":150,"flight":150,"damage":{"Heat":160},"charge_time":0.3},{"name":"Projectile Explosion","speed":3.33,"crit_chance":20,"crit_mult":2,"status_chance":25,"shot_type":"AoE","damage":{"Heat":120},"falloff":{"start":0,"end":2.4,"reduction":0.3},"no_headshot_mult":true},{"name":"Spear Throw Impact","speed":1,"crit_chance":20,"crit_mult":2,"status_chance":25,"shot_type":"Projectile","shot_speed":90,"flight":90,"unique":{"force_procs":["impact"]},"damage":{"Impact":45,"Slash":30,"Puncture":75}},{"name":"Spear Throw Explosion","speed":1,"crit_chance":20,"crit_mult":2,"status_chance":25,"shot_type":"AoE","unique":{"force_procs":["impact"]},"damage":{"Heat":300},"falloff":{"start":0,"end":6,"reduction":0.6},"no_headshot_mult":true}],"name":"Javlok","imageName":"javlok.webp","tags":["Grineer"],"compTags":["PROJECTILE","AOE","IMPACTEXPLODE","JAVLOK"],"comb":[[0,1],[2,3]]},
  "Kama":{"masteryReq":1,"description":"The Kama is a Tenno style hatchet, capable of making short work of any foe.","blockingAngle":55,"comboDuration":5,"followThrough":0.7,"range":2.4,"windUp":0.7,"releaseDate":"2013-09-13","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","slide":"180","slam":{"damage":"270.00","radial":{"damage":"90.00","element":"Impact","radius":8}},"speed":1.17,"crit_chance":12,"crit_mult":1.8,"status_chance":10,"damage":{"Impact":13.5,"Slash":63,"Puncture":13.5}},{"name":"Slam","radius":8,"type":"s","isHeavy":false,"speed":1,"crit_chance":12,"crit_mult":1.8,"status_chance":10,"unique":{"force_procs":["impact"]},"damage":{"Impact":180}},{"name":"Heavy Slam","radius":9,"type":"hs","isHeavy":true,"speed":1,"crit_chance":12,"crit_mult":1.8,"status_chance":10,"damage":{"Blast":270}}],"name":"Kama","imageName":"kama.webp","tags":["Tenno"],"compTags":["MACHETES_STANCE"]},
  "Kesheg":{"masteryReq":7,"description":"Slice through mobs of unruly enemies with this fierce halberd; the signature weapon of the Kuva Guardians.","blockingAngle":55,"comboDuration":5,"followThrough":0.6,"range":2.9,"windUp":0.9,"releaseDate":"2016-11-11","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","slide":"482","slam":{"damage":"723.00","radial":{"damage":"241.00","radius":7}},"speed":0.833,"crit_chance":19,"crit_mult":2.5,"status_chance":23,"damage":{"Impact":96.4,"Slash":120.5,"Puncture":24.1}},{"name":"Slam","radius":7,"type":"s","isHeavy":false,"speed":1,"crit_chance":19,"crit_mult":2.5,"status_chance":23,"unique":{"force_procs":["impact"]},"damage":{"Blast":482}},{"name":"Heavy Slam","radius":8,"type":"hs","isHeavy":true,"speed":1,"crit_chance":19,"crit_mult":2.5,"status_chance":23,"damage":{"Blast":723}}],"name":"Kesheg","imageName":"kesheg.webp","tags":["Grineer"],"compTags":["POLEARMS_STANCE"]},
  "Kestrel":{"masteryReq":0,"description":"The Kestrel boomerang is a heavy throwing weapon that can knock down enemies at a distance.","blockingAngle":55,"comboDuration":5,"followThrough":0.7,"range":1.2,"windUp":1.2,"releaseDate":"2013-06-07","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"168","slam":{"damage":"252.00","radial":{"damage":"84.00","radius":5}},"isHeavy":false,"speed":1.08,"crit_chance":10,"crit_mult":2,"status_chance":10,"damage":{"Impact":58.8,"Slash":12.6,"Puncture":12.6}},{"name":"Throw","isHeavy":false,"speed":1.08,"crit_chance":12,"crit_mult":2.1,"status_chance":12,"shot_type":"Thrown","shot_speed":30,"flight":30,"damage":{"Impact":73.6,"Slash":9.2,"Puncture":9.2}},{"name":"Throw Bounce Explosion","isHeavy":false,"speed":1.08,"crit_chance":12,"crit_mult":2.1,"status_chance":12,"shot_type":"AoE","damage":{"Blast":126},"falloff":{"start":0,"end":3.6,"reduction":0.4},"no_headshot_mult":true},{"name":"Throw Recall Explosion","isHeavy":true,"speed":1.08,"crit_chance":12,"crit_mult":2.1,"status_chance":12,"shot_type":"AoE","unique":{"force_procs":["impact"]},"damage":{"Blast":252},"falloff":{"start":0,"end":3.6,"reduction":0},"no_headshot_mult":true},{"name":"Charged Throw","isHeavy":false,"speed":0.833,"crit_chance":14,"crit_mult":2.2,"status_chance":14,"shot_type":"Thrown","shot_speed":40,"flight":40,"damage":{"Impact":147.2,"Slash":18.4,"Puncture":18.4},"charge_time":1.2},{"name":"Charged Throw Bounce Explosion","isHeavy":false,"speed":0.833,"crit_chance":14,"crit_mult":2.2,"status_chance":14,"shot_type":"AoE","damage":{"Blast":252},"falloff":{"start":0,"end":4,"reduction":0.4},"no_headshot_mult":true,"charge_time":1.2},{"name":"Charged Throw Recall Explosion","isHeavy":true,"speed":0.833,"crit_chance":14,"crit_mult":2.2,"status_chance":14,"shot_type":"AoE","unique":{"force_procs":["impact"]},"damage":{"Blast":504},"falloff":{"start":0,"end":4,"reduction":0},"no_headshot_mult":true,"charge_time":1.2},{"name":"Slam","radius":5,"type":"s","isHeavy":false,"speed":1,"crit_chance":10,"crit_mult":2,"status_chance":10,"unique":{"force_procs":["impact"]},"damage":{"Magnetic":168}},{"name":"Heavy Slam","radius":6,"type":"hs","isHeavy":true,"speed":1,"crit_chance":10,"crit_mult":2,"status_chance":10,"damage":{"Magnetic":252}}],"name":"Kestrel","imageName":"kestrel.webp","tags":["Tenno"],"compTags":["GLAIVES_STANCE"],"comb":[[1,2],[4,5]]},
  "Karyst":{"masteryReq":6,"description":"Once the blade weapon of choice for an exclusive order of Tenno assassins, the Karyst dagger grew to become a symbol of honor and duty for all Tenno.","blockingAngle":45,"comboDuration":5,"followThrough":0.9,"range":1.75,"windUp":0.4,"releaseDate":"2014-08-13","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"546toxin","slam":{"damage":"546.00","radial":{"damage":"273.00","radius":5}},"speed":0.75,"crit_chance":10,"crit_mult":2,"status_chance":26,"damage":{"Impact":30,"Slash":72,"Puncture":84,"Toxin":87}},{"name":"Slam","radius":5,"type":"s","isHeavy":false,"speed":1,"crit_chance":10,"crit_mult":2,"status_chance":26,"unique":{"force_procs":["impact"]},"damage":{"Impact":546}},{"name":"Heavy Slam","radius":6,"type":"hs","isHeavy":true,"speed":1,"crit_chance":10,"crit_mult":2,"status_chance":26,"damage":{"Toxin":819}}],"name":"Karyst","imageName":"karyst.webp","tags":["Tenno"],"compTags":["DAGGERS_STANCE"]},
  "Karyst Prime":{"masteryReq":12,"description":"This master blade is the heavier, oversized and far more lethal version of the signature weapon of an extinct order of Tenno assassins.","blockingAngle":50,"comboDuration":5,"followThrough":0.9,"range":2.2,"windUp":0.4,"releaseDate":"2020-07-14","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","slam":{"damage":"688.00","radial":{"damage":"344.00","radius":5}},"speed":0.667,"crit_chance":24,"crit_mult":2.2,"status_chance":30,"damage":{"Impact":50,"Slash":102,"Puncture":96,"Toxin":96}},{"name":"Slam","radius":5,"type":"s","isHeavy":false,"speed":1,"crit_chance":24,"crit_mult":2.2,"status_chance":30,"unique":{"force_procs":["impact"]},"damage":{"Impact":688}},{"name":"Heavy Slam","radius":8,"type":"hs","isHeavy":true,"speed":1,"crit_chance":24,"crit_mult":2.2,"status_chance":30,"damage":{"Toxin":1032}}],"name":"Karyst Prime","imageName":"karyst-prime.webp","tags":["Prime"],"compTags":["DAGGERS_STANCE"]},
  "Keratinos":{"masteryReq":9,"description":"Leave your mark with these infected claws with increased heavy attack range. Heavy attack at max combo to keep the extended range and slam radius for 3 minutes.","blockingAngle":55,"comboDuration":5,"followThrough":0.8,"range":1.7,"windUp":0.8,"releaseDate":"2020-08-25","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"732","slam":{"damage":"732.00","radial":{"damage":"244.00","element":"Viral","radius":6}},"speed":0.917,"crit_chance":13,"crit_mult":2.1,"status_chance":29,"damage":{"Impact":79,"Slash":87,"Puncture":45,"Viral":33}},{"name":"Slam","radius":6,"type":"s","isHeavy":false,"speed":1,"crit_chance":13,"crit_mult":2.1,"status_chance":29,"unique":{"force_procs":["impact"]},"damage":{"Impact":488}},{"name":"Heavy Slam","radius":7,"type":"hs","isHeavy":true,"speed":1,"crit_chance":13,"crit_mult":2.1,"status_chance":29,"damage":{"Viral":732}}],"name":"Keratinos","imageName":"keratinos.webp","tags":["Infested"],"compTags":["CLAWS_STANCE"]},
  "Knell":{"masteryReq":10,"description":"Ring the death knell. Headshots briefly turn this scoped pistol into a rapid-fire, Critical Damage fiend that uses no ammo. When used by Harrow, Knell has a 2-round mag.","noise":"Alarming","releaseDate":"2017-06-29","ammoCapacity":10,"productCategory":"Pistols","zoomProps":[[]],"category":"Secondary","trigger":"Auto","type":"Pistol","magazineSize":1,"reloadTime":2,"multishot":1,"attacks":[{"name":"Normal Attack","speed":4,"crit_chance":20,"crit_mult":1.5,"status_chance":5,"shot_type":"Hit-Scan","unique":{"WITH_COND":{"status_chance":0.6,"crit_mult_add":1.5,"ammoEff":1}},"damage":{"Impact":63,"Slash":18,"Puncture":69}}],"name":"Knell","imageName":"knell.webp","tags":["Tenno"],"compTags":["SINGLESHOT"]},
  "Karak Wraith":{"masteryReq":7,"description":"A different take on the Grineer assault rifle, the Karak Wraith features unique styling.","noise":"Alarming","releaseDate":"2015-05-12","ammoCapacity":540,"productCategory":"LongGuns","equipTime":1.1,"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":60,"reloadTime":2,"multishot":1,"attacks":[{"name":"Normal Attack","speed":11.67,"crit_chance":13,"crit_mult":2,"status_chance":25,"shot_type":"Hit-Scan","damage":{"Impact":13.95,"Slash":7.75,"Puncture":9.3}}],"name":"Karak Wraith","imageName":"karak-wraith.webp","tags":["Wraith","Invasion Reward","Grineer"],"compTags":["ASSAULT_AMMO"]},
  "Whipclaw (Khora)":{"masteryReq":0,"description":"Khora deadly exalted whip, unleashed by her Whipclaw ability.","blockingAngle":90,"comboDuration":5,"followThrough":0.5,"range":5,"windUp":0.4,"noise":"Silent","releaseDate":"2025-03-19","productCategory":"Melee","category":"Melee","type":"Exalted Weapon","multishot":1,"attacks":[{"name":"Normal Attack","isHeavy":false,"speed":1,"crit_chance":25,"crit_mult":2,"status_chance":25,"unique":{"set_speed_to_default":1},"damage":{"Impact":49.95,"Puncture":49.95,"Slash":50.1}}],"name":"Whipclaw (Khora)","imageName":"Whipclaw.webp","tags":[],"compTags":["KHORA_STANCE","POWER_WEAPON"]},
  "Kestrel Prime":{"masteryReq":11,"description":"With heightened agility and power the Kestrel Prime's heavy attacks easily knock down foes, ensuring none shall stand before it.","blockingAngle":55,"comboDuration":5,"followThrough":0.7,"range":1.2,"windUp":1.2,"releaseDate":"2025-12-10","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","isHeavy":false,"speed":1.25,"crit_chance":20,"crit_mult":2.2,"status_chance":40,"damage":{"Impact":157.5,"Slash":31.5,"Puncture":21}},{"name":"Throw","isHeavy":false,"speed":1.08,"crit_chance":22,"crit_mult":2.1,"status_chance":40,"shot_type":"Thrown","shot_speed":30,"flight":30,"damage":{"Impact":184,"Slash":23,"Puncture":23}},{"name":"Throw Bounce Explosion","isHeavy":false,"speed":1.08,"crit_chance":22,"crit_mult":2.1,"status_chance":40,"shot_type":"AoE","damage":{"Blast":315},"falloff":{"start":0,"end":3.6,"reduction":0.4},"no_headshot_mult":true},{"name":"Throw Recall Explosion","isHeavy":true,"speed":1.08,"crit_chance":12,"crit_mult":2.1,"status_chance":40,"shot_type":"AoE","unique":{"force_procs":["impact"]},"damage":{"Blast":630},"falloff":{"start":0,"end":3.6,"reduction":0},"no_headshot_mult":true},{"name":"Charged Throw","isHeavy":false,"speed":0.833,"crit_chance":14,"crit_mult":2.2,"status_chance":40,"shot_type":"Thrown","shot_speed":40,"flight":40,"damage":{"Impact":368,"Slash":46,"Puncture":46},"charge_time":1.19},{"name":"Charged Throw Bounce Explosion","isHeavy":false,"speed":0.833,"crit_chance":14,"crit_mult":2.2,"status_chance":40,"shot_type":"AoE","damage":{"Blast":630},"falloff":{"start":0,"end":4,"reduction":0.4},"no_headshot_mult":true,"charge_time":1.19},{"name":"Charged Throw Recall Explosion","isHeavy":true,"speed":0.833,"crit_chance":14,"crit_mult":2.2,"status_chance":14,"shot_type":"AoE","unique":{"force_procs":["impact"]},"damage":{"Blast":1260},"falloff":{"start":0,"end":4,"reduction":0},"no_headshot_mult":true,"charge_time":1.19},{"name":"Slam","radius":5,"type":"s","isHeavy":false,"speed":1,"crit_chance":10,"crit_mult":2,"status_chance":10,"unique":{"force_procs":["impact"]},"damage":{"Magnetic":420}},{"name":"Heavy Slam","radius":6,"type":"hs","isHeavy":true,"speed":1,"crit_chance":10,"crit_mult":2,"status_chance":10,"damage":{"Magnetic":630}}],"name":"Kestrel Prime","imageName":"KestrelPrime.webp","tags":["Tenno"],"compTags":["GLAIVES_STANCE"],"comb":[[1,2],[4,5]]},
  "Knell Prime":{"masteryReq":14,"description":"Ring a funeral toll upon enemy skulls with Harrow Prime's signature pistol.","noise":"Alarming","releaseDate":"2021-12-16","ammoCapacity":20,"productCategory":"Pistols","zoomProps":[[]],"category":"Secondary","trigger":"Auto","type":"Pistol","magazineSize":1,"reloadTime":2,"multishot":1,"attacks":[{"name":"Normal Attack","speed":5,"crit_chance":40,"crit_mult":2,"status_chance":10,"shot_type":"Hit-Scan","unique":{"WITH_COND":{"status_chance":0.6,"crit_mult_add":1.5,"ammoEff":1}},"damage":{"Impact":75.6,"Slash":21.6,"Puncture":82.8}}],"name":"Knell Prime","imageName":"knell-prime.webp","tags":["Tenno","Prime"],"compTags":["SINGLESHOT"]},
  "Kogake":{"masteryReq":2,"description":"These coverings for the hands and feet allow devastating high flying hand-to-hand combat attacks without risking harm to the user.","blockingAngle":50,"comboDuration":5,"followThrough":0.9,"range":1.25,"windUp":0.5,"releaseDate":"2013-06-28","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"240","slam":{"damage":"360.00","radial":{"damage":"120.00","radius":7}},"speed":0.917,"crit_chance":20,"crit_mult":2,"status_chance":10,"damage":{"Impact":84,"Slash":18,"Puncture":18}},{"name":"Slam","radius":7,"type":"s","isHeavy":false,"speed":1,"crit_chance":20,"crit_mult":2,"status_chance":10,"unique":{"force_procs":["impact"]},"damage":{"Impact":240}},{"name":"Heavy Slam","radius":8,"type":"hs","isHeavy":true,"speed":1,"crit_chance":20,"crit_mult":2,"status_chance":10,"damage":{"Blast":360}}],"name":"Kogake","imageName":"kogake.webp","tags":["Tenno"],"compTags":["SPARRING_STANCE"]},
  "Kogake Prime":{"masteryReq":10,"description":"Deliver a golden knockout with these prime Melee Weapons.","blockingAngle":50,"comboDuration":5,"followThrough":0.9,"range":1.25,"windUp":0.5,"releaseDate":"2017-12-12","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"484","slam":{"damage":"726.00","radial":{"damage":"242.00","radius":7}},"speed":0.917,"crit_chance":16,"crit_mult":1.8,"status_chance":38,"damage":{"Impact":169.4,"Slash":36.3,"Puncture":36.3}},{"name":"Slam","radius":7,"type":"s","isHeavy":false,"speed":1,"crit_chance":16,"crit_mult":1.8,"status_chance":38,"unique":{"force_procs":["impact"]},"damage":{"Impact":484}},{"name":"Heavy Slam","radius":8,"type":"hs","isHeavy":true,"speed":1,"crit_chance":16,"crit_mult":1.8,"status_chance":38,"damage":{"Blast":726}}],"name":"Kogake Prime","imageName":"kogake-prime.webp","tags":["Prime","Vaulted"],"compTags":["SPARRING_STANCE"]},
  "Kompressa Prime":{"masteryReq":13,"description":"Glinting like a golden dawn, Yareli Prime’s signature pistol engulfs foes in a cascade of virulent, explosive, water globules. None can escape the sea.","noise":"Alarming","releaseDate":"2025-05-21","ammoCapacity":144,"productCategory":"Pistols","zoomProps":[[]],"category":"Secondary","trigger":"Auto","type":"Pistol","magazineSize":12,"reloadTime":1.8,"multishot":4,"attacks":[{"name":"Normal Attack","speed":3.33,"crit_chance":16,"crit_mult":1.8,"status_chance":36,"shot_type":"Projectile","shot_speed":80,"flight":80,"damage":{"Viral":2}},{"name":"Explosion","speed":3.33,"crit_chance":16,"crit_mult":1.8,"status_chance":36,"shot_type":"AoE","damage":{"Viral":46},"no_headshot_mult":true}],"name":"Kompressa Prime","imageName":"KompressaPrime.webp","tags":["Tenno"],"compTags":["PROJECTILE","AOE"],"comb":[[0,1]]},
  "Kohm":{"masteryReq":5,"description":"For every shot fired in rapid succession the Kohm releases an additional bolt and grows more lethal.","noise":"Alarming","releaseDate":"2014-12-11","ammoCapacity":960,"productCategory":"LongGuns","equipTime":1.1,"zoomProps":[[]],"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":245,"reloadTime":2,"multishot":9,"attacks":[{"name":"Single Pellet","punch_through":1.5,"speed":0.734,"crit_chance":11,"crit_mult":2.3,"status_chance":75,"shot_type":"Hit-Scan","damage":{"Impact":6,"Slash":18,"Puncture":6},"falloff":{"start":15,"end":25,"reduction":0.7333}},{"name":"Fully Spooled","ammoCost":4,"punch_through":1.5,"speed":3.67,"crit_chance":11,"crit_mult":2.3,"status_chance":6.25,"shot_type":"Hit-Scan","damage":{"Impact":6,"Slash":18,"Puncture":6},"falloff":{"start":15,"end":25,"reduction":0.7333}}],"name":"Kohm","imageName":"kohm.webp","tags":["Grineer"],"compTags":[]},
  "Korrudo":{"masteryReq":9,"description":"When they go high, go low. Powerful pneumatic grips and toecaps amplify every blow. Four ways to deal twice the pain.","blockingAngle":50,"comboDuration":5,"followThrough":0.9,"range":1.25,"windUp":0.5,"releaseDate":"2019-04-04","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","slide":"386","slam":{"damage":"579.00","radial":{"damage":"193.00","radius":7}},"speed":0.833,"crit_chance":31,"crit_mult":2.5,"status_chance":9,"damage":{"Impact":110.01,"Slash":77.2,"Puncture":5.79}},{"name":"Slam","radius":7,"type":"s","isHeavy":false,"speed":1,"crit_chance":31,"crit_mult":2.5,"status_chance":9,"unique":{"force_procs":["impact"]},"damage":{"Impact":386}},{"name":"Heavy Slam","radius":8,"type":"hs","isHeavy":true,"speed":1,"crit_chance":31,"crit_mult":2.5,"status_chance":9,"damage":{"Blast":579}}],"name":"Korrudo","imageName":"korrudo.webp","tags":[],"compTags":["SPARRING_STANCE"]},
  "Kohmak":{"masteryReq":5,"description":"Like the larger Kohm, this hand-shotgun doubles its volley with each successive shot.","noise":"Alarming","releaseDate":"2015-03-19","productCategory":"Pistols","equipTime":1.1,"category":"Secondary","trigger":"Auto","type":"Pistol","magazineSize":40,"reloadTime":2,"multishot":5,"attacks":[{"name":"Single Pellet","punch_through":1.5,"speed":1,"crit_chance":11,"crit_mult":2,"status_chance":69,"shot_type":"Hit-Scan","damage":{"Impact":6,"Slash":18,"Puncture":6},"falloff":{"start":12,"end":24,"reduction":0.8333}},{"name":"Fully Spooled","punch_through":1.5,"speed":5,"crit_chance":11,"crit_mult":2,"status_chance":13.8,"shot_type":"Hit-Scan","damage":{"Impact":6,"Slash":18,"Puncture":6},"falloff":{"start":12,"end":24,"reduction":0.8333}}],"name":"Kohmak","imageName":"kohmak.webp","tags":["Grineer"],"compTags":["PROJECTILE","SECONDARYSHOTGUN"]},
  "Kompressa":{"masteryReq":8,"description":"Launch a volley of virulent, hyper-pressurized, water globules that envelope targets and explode with torrential force. Yareli's signature pistol.","noise":"Alarming","releaseDate":"2021-07-06","ammoCapacity":144,"productCategory":"Pistols","zoomProps":[[]],"category":"Secondary","trigger":"Auto","type":"Pistol","magazineSize":12,"reloadTime":1.8,"multishot":4,"attacks":[{"name":"Normal Attack","speed":3.33,"crit_chance":6,"crit_mult":1.8,"status_chance":30,"shot_type":"Projectile","shot_speed":80,"flight":80,"damage":{"Viral":2}},{"name":"Explosion","speed":3.33,"crit_chance":6,"crit_mult":1.8,"status_chance":30,"shot_type":"AoE","damage":{"Viral":42},"falloff":{"start":0,"end":2.4,"reduction":0.2},"no_headshot_mult":true}],"name":"Kompressa","imageName":"kompressa.webp","tags":["Tenno"],"compTags":["PROJECTILE","AOE"],"comb":[[0,1]]},
  "Korumm":{"masteryReq":13,"description":"Archon Boreal’s signature trident. Thrust Korumm into the ground with a Tactical Combo and then rip it out in a shower of electricity.","blockingAngle":55,"comboDuration":5,"followThrough":0.6,"range":2.9,"windUp":0.9,"releaseDate":"2021-12-15","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"520","slam":{"damage":"780.00","radial":{"damage":"260.00","radius":7}},"speed":1,"crit_chance":24,"crit_mult":2.2,"status_chance":30,"damage":{"Impact":52,"Slash":104,"Puncture":104}},{"name":"Slam","radius":7,"type":"s","isHeavy":false,"speed":1,"crit_chance":24,"crit_mult":2.2,"status_chance":30,"unique":{"force_procs":["impact"]},"damage":{"Blast":520}},{"name":"Heavy Slam","radius":8,"type":"hs","isHeavy":true,"speed":1,"crit_chance":24,"crit_mult":2.2,"status_chance":30,"damage":{"Blast":780}}],"name":"Korumm","imageName":"korumm.webp","tags":["Sentient"],"compTags":["POLEARMS_STANCE"]},
  "Komorex":{"masteryReq":8,"description":"Corpus ingenuity leveraging Tau-tech to create a high-capacity bi-modal sniper weapon of terrifying capability. Zoom in to reduce recoil and add punch through. Zoom again to fire a bursting viral round, but with a lower rate of fire. Komorex features built-in ammo conversion.","noise":"Alarming","releaseDate":"2019-05-22","ammoCapacity":40,"productCategory":"LongGuns","equipTime":1.1,"zoomProps":[{"Upgrades":[{"DamageType":"DT_ANY","OperationType":"STACKING_MULTIPLY","UpgradeType":"WEAPON_RECOIL","Value":-0.5},{"DamageType":"DT_ANY","OperationType":"ADD","UpgradeType":"WEAPON_PUNCTURE_DEPTH","Value":2}]},{"Upgrades":[{"DamageType":"DT_ANY","OperationType":"STACKING_MULTIPLY","UpgradeType":"WEAPON_PERCENT_BASE_DAMAGE_ADDED","Value":1},{"DamageType":"DT_ANY","OperationType":"ADD","UpgradeType":"WEAPON_EXPLOSION_RADIUS","Value":3.6},{"DamageType":"DT_ANY","OperationType":"STACKING_MULTIPLY","UpgradeType":"speed","Value":-0.75}]}],"category":"Primary","trigger":"Semi","type":"Rifle","magazineSize":20,"reloadTime":3,"multishot":1,"attacks":[{"name":"Unzoomed","speed":6,"crit_chance":16,"crit_mult":2.1,"status_chance":35,"shot_type":"Projectile","shot_speed":250,"flight":250,"damage":{"Impact":9.7,"Slash":46.6,"Puncture":40.7},"falloff":{"start":400,"end":600,"reduction":0.5}},{"name":"3.5x Zoom Mode","sniperCombo":true,"speed":1.5,"crit_chance":16,"crit_mult":2.1,"status_chance":35,"damage":{"Impact":19.4,"Slash":93.2,"Puncture":81.4}},{"name":"3.5x Zoom Radial Attack","sniperCombo":true,"speed":1.5,"crit_chance":16,"crit_mult":2.1,"status_chance":35,"damage":{"Viral":106},"falloff":{"start":0,"end":3.5,"reduction":0.4}}],"name":"Komorex","imageName":"komorex.webp","tags":["Sentient","Corpus"],"compTags":["PROJECTILE"],"comb":[[1,2]]},
  "Kraken":{"masteryReq":0,"description":"The Kraken is a heavy pistol of Grineer design that fires two quick shots with a single pull of the trigger. Skilled marksmen will appreciate the value in this deadly accurate weapon.","noise":"Alarming","releaseDate":"2013-02-14","productCategory":"Pistols","category":"Secondary","trigger":"Burst","type":"Pistol","magazineSize":14,"reloadTime":2.45,"multishot":1,"attacks":[{"name":"Normal Attack","speed":2.83,"crit_chance":5,"crit_mult":2,"status_chance":13,"shot_type":"Hit-Scan","damage":{"Impact":36.75,"Slash":6.13,"Puncture":6.13},"burst_count":2,"burst_delay":0.05}],"name":"Kraken","imageName":"kraken.webp","tags":["Grineer"],"compTags":[]},
  "Kronen Prime":{"masteryReq":13,"description":"Ancient blades, perfected for today’s combat.","blockingAngle":60,"comboDuration":5,"followThrough":0.6,"range":2.5,"windUp":0.7,"releaseDate":"2018-03-20","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"424","slam":{"damage":"424.00","radial":{"damage":"212.00","element":"Impact","radius":8}},"speed":1.17,"crit_chance":22,"crit_mult":2,"status_chance":34,"damage":{"Impact":21.2,"Slash":169.6,"Puncture":21.2}},{"name":"Slam","radius":8,"type":"s","isHeavy":false,"speed":1,"crit_chance":22,"crit_mult":2,"status_chance":34,"unique":{"force_procs":["impact"]},"damage":{"Impact":424}},{"name":"Heavy Slam","radius":9,"type":"hs","isHeavy":true,"speed":1,"crit_chance":22,"crit_mult":2,"status_chance":34,"damage":{"Blast":636}}],"name":"Kronen Prime","imageName":"kronen-prime.webp","tags":["Prime","Vaulted"],"compTags":["TONFA_STANCE"]},
  "Krohkur":{"masteryReq":9,"description":"This hooked blade rewards critical hits to those skilled enough to strike with finesse.","blockingAngle":55,"comboDuration":5,"followThrough":0.6,"range":2.5,"windUp":0.6,"releaseDate":"2017-10-12","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","slide":"217","slam":{"damage":"651.00","radial":{"damage":"217.00","radius":7}},"speed":0.833,"crit_chance":29,"crit_mult":2.3,"status_chance":19,"damage":{"Impact":26,"Slash":151.9,"Puncture":39.1}},{"name":"Slam","radius":7,"type":"s","isHeavy":false,"speed":1,"crit_chance":29,"crit_mult":2.3,"status_chance":19,"unique":{"force_procs":["impact"]},"damage":{"Impact":434}},{"name":"Heavy Slam","radius":8,"type":"hs","isHeavy":true,"speed":1,"crit_chance":29,"crit_mult":2.3,"status_chance":19,"damage":{"Blast":651}}],"name":"Krohkur","imageName":"krohkur.webp","tags":["Grineer"],"compTags":["SWORDS_STANCE"]},
  "Kronen":{"masteryReq":3,"description":"The Kronen resurrects a lethal fighting style once thought lost to the ages.","blockingAngle":60,"comboDuration":5,"followThrough":0.6,"range":2.5,"windUp":0.7,"releaseDate":"2014-08-28","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"260","slam":{"damage":"260.00","radial":{"damage":"130.00","radius":8}},"speed":1.08,"crit_chance":10,"crit_mult":1.5,"status_chance":20,"damage":{"Impact":13,"Slash":104,"Puncture":13}},{"name":"Slam","radius":8,"type":"s","isHeavy":false,"speed":1,"crit_chance":10,"crit_mult":1.5,"status_chance":20,"unique":{"force_procs":["impact"]},"damage":{"Impact":260}},{"name":"Heavy Slam","radius":9,"type":"hs","isHeavy":true,"speed":1,"crit_chance":10,"crit_mult":1.5,"status_chance":20,"damage":{"Blast":390}}],"name":"Kronen","imageName":"kronen.webp","tags":["Tenno"],"compTags":["TONFA_STANCE"]},
  "Kronsh (Machete)":{"masteryReq":0,"description":"","comboDuration":5,"range":1,"windUp":1,"releaseDate":"2017-10-12","productCategory":"Melee","category":"Melee","type":"Zaw Component","multishot":1,"attacks":[{"name":"Kronsh Strike","speed":0.85,"crit_chance":18,"crit_mult":2,"status_chance":18,"damage":{"Impact":163.8,"Slash":70.2}}],"name":"Kronsh (Machete)","imageName":"kronsh.webp","tags":[],"compTags":["MACHETES_STANCE"]},
  "Kulstar":{"masteryReq":5,"description":"Rain hell on the enemy with this handheld cluster-rocket launcher.","noise":"Alarming","releaseDate":"2015-07-31","ammoCapacity":15,"productCategory":"Pistols","category":"Secondary","trigger":"Active","type":"Pistol","magazineSize":3,"reloadTime":2,"multishot":1,"attacks":[{"name":"Rocket Impact","speed":2,"crit_chance":17,"crit_mult":2.3,"status_chance":19,"shot_type":"Projectile","shot_speed":100,"flight":100,"damage":{"Impact":200}},{"name":"Rocket Explosion","speed":2,"crit_chance":17,"crit_mult":2.3,"status_chance":19,"shot_type":"AoE","damage":{"Blast":300},"falloff":{"start":0,"end":3.9,"reduction":0.4},"no_headshot_mult":true},{"name":"Cluster Bombs","speed":2,"crit_chance":17,"crit_mult":2.3,"status_chance":19,"shot_type":"Projectile","shot_speed":8,"flight":8,"damage":{"Impact":75}},{"name":"Cluster Bomb Explosion","speed":2,"crit_chance":17,"crit_mult":2.3,"status_chance":19,"shot_type":"AoE","damage":{"Blast":90},"falloff":{"start":0,"end":3.9,"reduction":0.4},"no_headshot_mult":true}],"name":"Kulstar","imageName":"kulstar.webp","tags":["Grineer"],"compTags":["PROJECTILE","AOE"],"comb":[[0,1],[2,3]]},
  "Kuva Bramma":{"masteryReq":15,"description":"This Grineer bow delivers vengeance in the form of clusterbomb-tipped arrows that can be detonated mid-air or on impact. Low quiver capacity, arrows are recovered singly.","noise":"Alarming","releaseDate":"2020-02-04","ammoCapacity":5,"productCategory":"LongGuns","equipTime":1.8,"zoomProps":[[]],"category":"Primary","trigger":"Charge","type":"Rifle","magazineSize":1,"reloadTime":0.6,"multishot":1,"attacks":[{"name":"Charged Shot","speed":0.667,"crit_chance":35,"crit_mult":2.1,"status_chance":21,"shot_type":"Projectile","shot_speed":50,"flight":50,"damage":{"Impact":187},"charge_time":0.4},{"name":"Radial Attack","speed":0.667,"crit_chance":35,"crit_mult":2.1,"status_chance":21,"shot_type":"AoE","damage":{"Blast":839},"falloff":{"start":0,"end":8.3,"reduction":0.9},"no_headshot_mult":true,"charge_time":0.4},{"name":"Cluster Bomb Contact","speed":1,"crit_chance":35,"crit_mult":2.1,"status_chance":21,"shot_type":"Projectile","shot_speed":30,"flight":30,"damage":{"Impact":49},"charge_time":0.4},{"name":"Cluster Bomb Explosion","speed":1,"crit_chance":35,"crit_mult":2.1,"status_chance":21,"shot_type":"AoE","damage":{"Blast":57},"falloff":{"start":0,"end":3.5,"reduction":0.5},"no_headshot_mult":true,"charge_time":0.4}],"name":"Kuva Bramma","imageName":"kuva-bramma.webp","tags":["Grineer","Kuva Lich"],"compTags":["PROJECTILE","AOE","SNIPER_AMMO","SINGLESHOT","GRNBOW"],"comb":[[0,1],[2,3]]},
  "Kronsh (Polearm)":{"masteryReq":0,"description":"","comboDuration":5,"range":1,"windUp":1,"releaseDate":"2017-10-12","productCategory":"Melee","category":"Melee","type":"Zaw Component","multishot":1,"attacks":[{"name":"Kronsh Strike","speed":0.85,"crit_chance":18,"crit_mult":2,"status_chance":18,"damage":{"Impact":163.8,"Slash":70.2}}],"name":"Kronsh (Polearm)","imageName":"kronsh.webp","tags":[],"compTags":["POLEARMS_STANCE"]},
  "Kuva Brakk":{"masteryReq":13,"description":"This Lich-variant semi-automatic hand cannon delivers a lot of punch in a small package. Higher fire rate, magazine capacity and reload speed. ","noise":"Alarming","releaseDate":"2019-10-31","productCategory":"Pistols","zoomProps":[[]],"category":"Secondary","trigger":"Semi","type":"Rifle","magazineSize":11,"reloadTime":1.1,"multishot":10,"attacks":[{"name":"Normal Attack","punch_through":0.5,"speed":5.83,"crit_chance":29,"crit_mult":2,"status_chance":11.1,"shot_type":"Hit-Scan","damage":{"Impact":5.85,"Slash":3.9,"Puncture":3.25},"falloff":{"start":10,"end":20,"reduction":0.96}}],"name":"Kuva Brakk","imageName":"kuva-brakk.webp","tags":["Grineer","Kuva Lich"],"compTags":["SECONDARYSHOTGUN","SINGLESHOT"]},
  "Kunai":{"masteryReq":2,"description":"Kunai throwing daggers offer a silent alternative to the traditional side arm. Perfect for assassins.","noise":"Silent","releaseDate":"2013-05-23","productCategory":"Pistols","category":"Secondary","trigger":"Auto","type":"Throwing","magazineSize":10,"reloadTime":0.75,"multishot":1,"attacks":[{"name":"Normal Attack","speed":3.33,"crit_chance":8,"crit_mult":1.6,"status_chance":8,"shot_type":"Projectile","shot_speed":70,"flight":70,"damage":{"Impact":4.6,"Slash":6.9,"Puncture":34.5}},{"name":"Incarnon Form","multishot":2,"isCoMult":true,"isInc":1,"speed":3.33,"crit_chance":18,"crit_mult":2,"status_chance":16,"damage":{"Impact":8,"Slash":18,"Puncture":14}}],"incMagazineSize":20,"name":"Kunai","imageName":"kunai.webp","tags":["Tenno","Incarnon"],"compTags":["PROJECTILE","THROWN","KUNAI"]},
  "Kreska":{"masteryReq":6,"description":"This unsophisticated Corpus survival tool does what it was designed for: hacking and splitting whatever it strikes.","blockingAngle":55,"comboDuration":5,"followThrough":0.7,"range":2.4000001,"windUp":0.7,"releaseDate":"2018-11-08","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"380","slam":{"damage":"570.00","radial":{"damage":"190.00","radius":8}},"speed":0.917,"crit_chance":14,"crit_mult":2,"status_chance":22,"damage":{"Impact":30,"Slash":45,"Puncture":15,"Heat":100}},{"name":"Slam","radius":8,"type":"s","isHeavy":false,"speed":1,"crit_chance":14,"crit_mult":2,"status_chance":22,"unique":{"force_procs":["impact"]},"damage":{"Heat":380}},{"name":"Heavy Slam","radius":9,"type":"hs","isHeavy":true,"speed":1,"crit_chance":14,"crit_mult":2,"status_chance":22,"damage":{"Heat":570}}],"name":"Kreska","imageName":"kreska.webp","tags":["Corpus"],"compTags":["MACHETES_STANCE"]},
  "Kuva Chakkhurr":{"masteryReq":15,"description":"Detonate heads with this slow-firing rifle that rewards precision.","noise":"Alarming","releaseDate":"2019-10-31","ammoCapacity":55,"productCategory":"LongGuns","equipTime":1.1,"zoomProps":[[]],"category":"Primary","trigger":"Semi","type":"Rifle","magazineSize":11,"reloadTime":3.3,"multishot":1,"attacks":[{"name":"Normal Attack","speed":1.17,"crit_chance":50,"crit_mult":2.3,"status_chance":27,"shot_type":"Projectile","shot_speed":200,"flight":200,"unique":{"force_procs":["impact"]},"damage":{"Impact":260}},{"name":"Explosion","speed":1.17,"crit_chance":50,"crit_mult":2.3,"status_chance":27,"shot_type":"AoE","unique":{"force_procs":["impact"]},"damage":{"Slash":29,"Puncture":52,"Blast":25},"falloff":{"start":0,"end":2.9,"reduction":0.3},"no_headshot_mult":true}],"name":"Kuva Chakkhurr","imageName":"kuva-chakkhurr.webp","tags":["Grineer","Kuva Lich"],"compTags":["SNIPER_AMMO","PROJECTILE","AOE"],"comb":[[0,1]]},
  "Kuva Drakgoon":{"masteryReq":13,"description":"The Kuva Drakgoon flak cannon sends volleys of intensely hot shrapnel ricocheting around the room that do not slow down. Larger Magazine Capacity and Reload Speed. Can be fired in wide or concentrated bursts.","noise":"Alarming","releaseDate":"2019-10-31","ammoCapacity":120,"productCategory":"LongGuns","zoomProps":[[]],"category":"Primary","trigger":"Charge","type":"Rifle","magazineSize":11,"reloadTime":2,"multishot":10,"attacks":[{"name":"Uncharged Shot","speed":3.33,"crit_chance":19,"crit_mult":2.1,"status_chance":9,"shot_type":"Projectile","shot_speed":130,"flight":130,"damage":{"Impact":4.6,"Slash":13.8,"Puncture":4.6}},{"name":"Charged Shot","punch_through":1.5,"speed":3.33,"crit_chance":21,"crit_mult":2.5,"status_chance":9,"shot_type":"Projectile","shot_speed":190,"flight":190,"damage":{"Impact":4.6,"Slash":36.8,"Puncture":4.6},"charge_time":0.3}],"name":"Kuva Drakgoon","imageName":"kuva-drakgoon.webp","tags":["Grineer","Kuva Lich"],"compTags":["PROJECTILE"]},
  "Kuva Hek":{"masteryReq":15,"description":"Forged at the behest of the Worm Queen herself, this already powerful shotgun now has the additional ability to fire from all four barrels simultaneously.","noise":"Alarming","releaseDate":"2021-07-06","ammoCapacity":120,"productCategory":"LongGuns","zoomProps":[[]],"category":"Primary","trigger":"Semi","type":"Rifle","magazineSize":4,"reloadTime":1.9,"multishot":7,"attacks":[{"name":"Normal Attack","punch_through":0.3,"speed":2.17,"crit_chance":23,"crit_mult":2.1,"status_chance":13,"shot_type":"Hit-Scan","damage":{"Impact":13.05,"Slash":17.4,"Puncture":56.55},"falloff":{"start":15,"end":30,"reduction":0.828}},{"name":"Alt-Fire","multishot":28,"ammoCost":4,"speed":1.17,"crit_chance":23,"crit_mult":2.1,"status_chance":3.32,"shot_type":"Hit-Scan","damage":{"Impact":13.05,"Slash":17.4,"Puncture":56.55},"falloff":{"start":15,"end":30,"reduction":0.989}}],"name":"Kuva Hek","imageName":"kuva-hek.webp","tags":["Grineer","Kuva Lich"],"compTags":["SINGLESHOT","HEK"]},
  "Kuva Ayanga (Arch-mode)":{"masteryReq":13,"description":"Sweep aside hordes of enemies with the flaming fury of this powerful automatic grenade launcher.","releaseDate":"2019-10-31","ammoCapacity":0,"productCategory":"Archguns","zoomProps":[[]],"category":"Archgun","type":"Archgun","magazineSize":33,"reloadTime":1.2,"multishot":1,"attacks":[{"name":"Grenade Impact","speed":4.58,"crit_chance":35,"crit_mult":2,"status_chance":20,"shot_type":"Projectile","shot_speed":300,"damage":{"Impact":87}},{"name":"Explosion","speed":4.58,"crit_chance":35,"crit_mult":2,"status_chance":20,"shot_type":"AoE","damage":{"Blast":187},"no_headshot_mult":true}],"reloadRate":66,"reloadDelay":0.7,"name":"Kuva Ayanga (Arch-mode)","imageName":"KuvaAyanga.webp","tags":["Kuva Lich"],"compTags":["BATTERY"]},
  "Kuva Hind":{"masteryReq":15,"description":"This powerful Grineer burst rifle has been retrofitted to add semi-automatic and automatic fire modes. ","noise":"Alarming","releaseDate":"2020-02-04","ammoCapacity":900,"productCategory":"LongGuns","equipTime":1.1,"zoomProps":[[]],"category":"Primary","trigger":"Burst","type":"Rifle","magazineSize":90,"reloadTime":2.3,"multishot":1,"attacks":[{"name":"Auto","speed":10,"crit_chance":21,"crit_mult":1.9,"status_chance":33,"shot_type":"Hit-Scan","damage":{"Impact":6,"Slash":18,"Puncture":6}},{"name":"Semi-Auto","ammoCost":3,"speed":2.5,"crit_chance":37,"crit_mult":2.9,"status_chance":21,"shot_type":"Hit-Scan","damage":{"Impact":18,"Slash":54,"Puncture":18}},{"name":"Burst","speed":9.09,"crit_chance":25,"crit_mult":2.1,"status_chance":33,"shot_type":"Hit-Scan","damage":{"Impact":7.5,"Slash":15,"Puncture":7.5},"burst_count":5,"burst_delay":0.07}],"name":"Kuva Hind","imageName":"kuva-hind.webp","tags":["Kuva Lich"],"compTags":["ASSAULT_AMMO"]},
  "Kuva Karak":{"masteryReq":13,"description":"The custom weapon of a fearsome Kuva Lich. It has greater reload speed, lower recoil and greater accuracy than the standard-issue Karak rifle.","noise":"Alarming","releaseDate":"2019-10-31","ammoCapacity":540,"productCategory":"LongGuns","equipTime":1.1,"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":70,"reloadTime":1.7,"multishot":1,"attacks":[{"name":"Normal Attack","punch_through":0.2,"speed":11.67,"crit_chance":23,"crit_mult":2.1,"status_chance":31,"shot_type":"Hit-Scan","damage":{"Impact":7.1,"Slash":9.7,"Puncture":6.2}}],"name":"Kuva Karak","imageName":"kuva-karak.webp","tags":["Grineer","Kuva Lich"],"compTags":["ASSAULT_AMMO"]},
  "Kuva Grattler (Atmo-mode)":{"masteryReq":15,"description":"Reconfigured for maximum lethality, this powerful Arch-gun still shatters targets with explosive shells, but now reaches its peak fire-rate instantaneously.","releaseDate":"2021-07-06","ammoCapacity":320,"productCategory":"Archguns","zoomProps":[[]],"category":"Archgun","type":"Archgun","magazineSize":60,"reloadTime":2.5,"multishot":1,"attacks":[{"name":"Projectile Impact","speed":5.55,"crit_chance":27,"crit_mult":2,"status_chance":27,"shot_type":"Projectile","shot_speed":62.5,"damage":{"Impact":14,"Puncture":112,"Slash":14}},{"name":"Explosion","speed":5.55,"crit_chance":27,"crit_mult":2,"status_chance":27,"shot_type":"AoE","damage":{"Blast":235},"no_headshot_mult":true}],"name":"Kuva Grattler (Atmo-mode)","imageName":"KuvaGrattler.webp","tags":["Kuva Lich"],"compTags":[""]},
  "Kuva Ghoulsaw":{"masteryReq":13,"description":"The addition of Kuva has forged the savage Ghoulsaw into an even more brutal weapon, allowing for faster attacks.","blockingAngle":90,"comboDuration":5,"followThrough":1,"range":2.153,"windUp":1,"releaseDate":"2026-03-25","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":1.2,"crit_chance":25,"crit_mult":2.1,"status_chance":32,"damage":{"Impact":40.09,"Slash":122.38,"Puncture":48.53}},{"name":"Slam","radius":7,"type":"s","isHeavy":false,"speed":1,"crit_chance":25,"crit_mult":2.1,"status_chance":32,"unique":{"force_procs":["impact"]},"damage":{"Impact":422}},{"name":"Heavy Slam","radius":9,"type":"hs","isHeavy":true,"speed":1,"crit_chance":25,"crit_mult":2.1,"status_chance":32,"damage":{"Blast":633}}],"name":"Kuva Ghoulsaw","imageName":"KuvaGhoulsaw.webp","tags":["Grineer","Kuva Lich"],"compTags":["BLADESAW_STANCE"]},
  "Kuva Grattler (Arch-mode)":{"masteryReq":15,"description":"Reconfigured for maximum lethality, this powerful Arch-gun still shatters targets with explosive shells, but now reaches its peak fire-rate instantaneously.","releaseDate":"2021-07-06","ammoCapacity":0,"productCategory":"Archguns","zoomProps":[[]],"category":"Archgun","type":"Archgun","magazineSize":60,"reloadTime":4,"multishot":1,"attacks":[{"name":"Projectile Impact","speed":5.55,"crit_chance":27,"crit_mult":2.1,"status_chance":27,"shot_type":"Projectile","shot_speed":250,"damage":{"Impact":9.4,"Puncture":75.2,"Slash":9.4}},{"name":"Explosion","speed":5.55,"crit_chance":27,"crit_mult":2.1,"status_chance":27,"shot_type":"AoE","damage":{"Blast":155},"no_headshot_mult":true}],"reloadRate":20,"reloadDelay":1,"name":"Kuva Grattler (Arch-mode)","imageName":"KuvaGrattler.webp","tags":["Kuva Lich"],"compTags":["BATTERY"]},
  "Kuva Ayanga (Atmo-mode)":{"masteryReq":13,"description":"Sweep aside hordes of enemies with the flaming fury of this powerful automatic grenade launcher.","releaseDate":"2019-10-31","ammoCapacity":165,"productCategory":"Archguns","zoomProps":[[]],"category":"Archgun","type":"Archgun","magazineSize":33,"reloadTime":3,"multishot":1,"attacks":[{"name":"Grenade Impact","speed":4.58,"crit_chance":35,"crit_mult":2,"status_chance":20,"shot_type":"Projectile","shot_speed":75,"damage":{"Impact":130}},{"name":"Explosion","speed":4.58,"crit_chance":35,"crit_mult":2,"status_chance":20,"shot_type":"AoE","damage":{"Blast":280},"no_headshot_mult":true}],"name":"Kuva Ayanga (Atmo-mode)","imageName":"KuvaAyanga.webp","tags":["Kuva Lich"],"compTags":[""]},
  "Kuva Seer":{"masteryReq":15,"description":"This variant pistol has higher fire rate and magazine capacity. Superior zoom capabilities plus projectiles have a small Corrosive burst.","noise":"Alarming","releaseDate":"2019-10-31","ammoCapacity":27,"productCategory":"Pistols","zoomProps":[[]],"category":"Secondary","trigger":"Semi","type":"Rifle","magazineSize":9,"reloadTime":2.3,"multishot":1,"attacks":[{"name":"Projectile Impact","isCoMult":true,"speed":2.5,"crit_chance":21,"crit_mult":1.9,"status_chance":33,"shot_type":"Projectile","shot_speed":500,"flight":500,"damage":{"Impact":26.2,"Slash":36.7,"Puncture":68.1}},{"name":"Explosion","speed":2.5,"crit_chance":21,"crit_mult":1.9,"status_chance":33,"shot_type":"AoE","damage":{"Corrosive":69},"falloff":{"start":0,"end":2.3,"reduction":0.3},"no_headshot_mult":true}],"name":"Kuva Seer","imageName":"kuva-seer.webp","tags":["Grineer","Kuva Lich"],"compTags":["PROJECTILE"],"comb":[[0,1]]},
  "Kuva Kraken":{"masteryReq":15,"description":"A custom variant that fires three quick shots with a single pull of the trigger, or can alt-fire burst the remainder of its magazine. Higher Fire Rate, Magazine Capacity and Reload Speed.","noise":"Alarming","releaseDate":"2019-10-31","ammoCapacity":210,"productCategory":"Pistols","zoomProps":[[]],"category":"Secondary","trigger":"Burst","type":"Rifle","magazineSize":21,"reloadTime":1.5,"multishot":1,"attacks":[{"name":"Normal Attack","speed":2.83,"crit_chance":21,"crit_mult":2.3,"status_chance":29,"shot_type":"Hit-Scan","damage":{"Impact":32.25,"Slash":5.38,"Puncture":5.38},"burst_count":3,"burst_delay":0.03},{"name":"Alt-Fire","speed":4.17,"crit_chance":21,"crit_mult":2.3,"status_chance":29,"shot_type":"Hit-Scan","damage":{"Impact":32.25,"Slash":5.38,"Puncture":5.38}}],"name":"Kuva Kraken","imageName":"kuva-kraken.webp","tags":["Grineer","Kuva Lich"],"compTags":[]},
  "Kuva Kohm":{"masteryReq":13,"description":"The Kuva Kohm variant has a higher fire rate than the original. For every shot fired in rapid succession the Kuva Kohm releases an additional bolt and grows more lethal.","noise":"Alarming","releaseDate":"2019-10-31","ammoCapacity":836,"productCategory":"LongGuns","equipTime":1.1,"zoomProps":[[]],"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":209,"reloadTime":2,"multishot":9,"attacks":[{"name":"Single Pellet","punch_through":1.5,"speed":0.834,"crit_chance":19,"crit_mult":2.3,"status_chance":90,"shot_type":"Hit-Scan","damage":{"Impact":4,"Slash":12,"Puncture":4},"falloff":{"start":13,"end":26,"reduction":0.9375}},{"name":"Fully Spooled","ammoCost":4,"punch_through":1.5,"speed":4.17,"crit_chance":19,"crit_mult":2.3,"status_chance":7.5,"shot_type":"Hit-Scan","damage":{"Impact":4,"Slash":12,"Puncture":4},"falloff":{"start":13,"end":26,"reduction":0.9375}}],"name":"Kuva Kohm","imageName":"kuva-kohm.webp","tags":["Grineer","Kuva Lich"],"compTags":[]},
  "Kuva Quartakk":{"masteryReq":13,"description":"Unlike a standard Quartakk this Kuva Lich variant fires automatically from the hip while retaining its signature feature when aimed: annihilating targets with four simultaneous shots.","noise":"Alarming","releaseDate":"2019-10-31","ammoCapacity":880,"productCategory":"LongGuns","equipTime":1.1,"zoomProps":[[]],"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":88,"reloadTime":1.7,"multishot":1,"attacks":[{"name":"Full-Auto","speed":4.83,"crit_chance":21,"crit_mult":1.9,"status_chance":33,"shot_type":"Hit-Scan","damage":{"Impact":20,"Slash":18.35,"Puncture":15.65}},{"name":"Burst-Fire While Aiming","punch_through":0.5,"speed":1.58,"crit_chance":31,"crit_mult":2.3,"status_chance":27,"shot_type":"Hit-Scan","damage":{"Impact":19.98,"Slash":18.36,"Puncture":15.66},"burst_count":4,"burst_delay":0}],"name":"Kuva Quartakk","imageName":"kuva-quartakk.webp","tags":["Grineer","Kuva Lich"],"compTags":["ASSAULT_AMMO"]},
  "Kuva Shildeg":{"masteryReq":13,"description":"A crushing, killing, rocket-powered stab-hammer. Grineer, naturally.","blockingAngle":50,"comboDuration":5,"followThrough":0.4,"range":3,"windUp":1.2,"releaseDate":"2019-10-31","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","slide":"410","slam":{"damage":"615.00","radial":{"damage":"205.00","element":"Impact","radius":9}},"speed":0.917,"crit_chance":31,"crit_mult":2.7,"status_chance":27,"damage":{"Impact":75.8,"Slash":28.7,"Puncture":100.5}},{"name":"Slam","radius":9,"type":"s","isHeavy":false,"speed":1,"crit_chance":31,"crit_mult":2.7,"status_chance":27,"unique":{"force_procs":["impact"]},"damage":{"Impact":410}},{"name":"Heavy Slam","radius":9,"type":"hs","isHeavy":true,"speed":1,"crit_chance":31,"crit_mult":2.7,"status_chance":27,"damage":{"Blast":615}}],"name":"Kuva Shildeg","imageName":"kuva-shildeg.webp","tags":["Grineer","Kuva Lich"],"compTags":["HAMMERS_STANCE"]},
  "Kuva Nukor":{"masteryReq":13,"description":"A highly-optimized Nukor that allows for the weapon’s microwave field to hit up to two additional targets.","noise":"Alarming","releaseDate":"2020-02-04","ammoCapacity":210,"productCategory":"Pistols","equipTime":1.1,"zoomProps":[[]],"category":"Secondary","trigger":"Held","type":"Rifle","magazineSize":77,"reloadTime":2,"multishot":1,"attacks":[{"name":"Normal Attack","isBeam":true,"speed":10,"crit_chance":7,"crit_mult":5,"status_chance":50,"shot_type":"Discharge","damage":{"Radiation":21}}],"name":"Kuva Nukor","imageName":"kuva-nukor.webp","tags":["Grineer","Kuva Lich"],"compTags":["BEAM"]},
  "Kuva Sobek":{"masteryReq":15,"description":"The Kuva Sobek's exceptional Reload Speed, Critical Chance, and Status Chance make it a natural fit for the Kuva Lich's dominant spirit.","noise":"Alarming","releaseDate":"2024-03-27","ammoCapacity":240,"productCategory":"LongGuns","zoomProps":[[]],"category":"Primary","trigger":"Auto","type":"Shotgun","magazineSize":20,"reloadTime":2.1,"multishot":5,"attacks":[{"name":"Normal Attack","speed":2.5,"crit_chance":21,"crit_mult":2.3,"status_chance":21,"shot_type":"Hit-Scan","damage":{"Impact":57.75,"Slash":9.625,"Puncture":9.625},"falloff":{"start":25,"end":40,"reduction":0.5}}],"name":"Kuva Sobek","imageName":"KuvaSobek.webp","tags":["Grineer","Kuva Lich"],"compTags":["SOBEK"]},
  "Kuva Ogris":{"masteryReq":15,"description":"The custom weapon of a fearsome Kuva Lich. Unlike the basic version the Kuva Ogris fires detonite-infused casings semi-automatically, from a smaller magazine, while dealing greater damage per shot.","noise":"Alarming","releaseDate":"2019-10-31","ammoCapacity":7,"productCategory":"LongGuns","zoomProps":[[]],"category":"Primary","trigger":"Semi","type":"Rifle","magazineSize":3,"reloadTime":2.1,"multishot":1,"attacks":[{"name":"Rocket Impact","speed":1.5,"crit_chance":9,"crit_mult":2,"status_chance":47,"shot_type":"Projectile","shot_speed":40,"flight":40,"unique":{"force_procs":["impact"]},"damage":{"Impact":18.9,"Puncture":8.1}},{"name":"Rocket Explosion","speed":1.5,"crit_chance":9,"crit_mult":2,"status_chance":47,"shot_type":"AoE","damage":{"Slash":155,"Puncture":183,"Blast":349},"falloff":{"start":0,"end":7.9,"reduction":0.8},"no_headshot_mult":true}],"name":"Kuva Ogris","imageName":"kuva-ogris.webp","tags":["Grineer","Kuva Lich"],"compTags":["PROJECTILE","SNIPER_AMMO","AOE","SINGLESHOT","OGRIS"],"comb":[[0,1]]},
  "Kuva Tonkor":{"masteryReq":13,"description":"This Lich-variant grenade launcher hurls mayhem and destruction with an increased Reload Speed.","noise":"Alarming","releaseDate":"2019-10-31","ammoCapacity":30,"productCategory":"LongGuns","zoomProps":[[]],"category":"Primary","trigger":"Semi","type":"Rifle","magazineSize":1,"reloadTime":1.5,"multishot":1,"attacks":[{"name":"Grenade Impact","speed":3.17,"crit_chance":30,"crit_mult":2.5,"status_chance":17,"shot_type":"Projectile","shot_speed":40,"flight":40,"damage":{"Puncture":59}},{"name":"Grenade Explosion","speed":3.17,"crit_chance":30,"crit_mult":2.5,"status_chance":17,"shot_type":"AoE","damage":{"Slash":204,"Puncture":168,"Blast":302},"falloff":{"start":0,"end":7,"reduction":0.7},"no_headshot_mult":true}],"name":"Kuva Tonkor","imageName":"kuva-tonkor.webp","tags":["Grineer","Kuva Lich"],"compTags":["PROJECTILE","SNIPER_AMMO","AOE","TONKOR"],"comb":[[0,1]]},
  "Kuva Twin Stubbas":{"masteryReq":13,"description":"Double-fist rapid-fire bursts of pain with these dual-wield variants of the Grineer submachine gun. Higher Fire Rate and Magazine Capacity.","noise":"Alarming","releaseDate":"2019-10-31","ammoCapacity":684,"productCategory":"Pistols","zoomProps":[[]],"category":"Secondary","trigger":"Auto","type":"Rifle","magazineSize":114,"reloadTime":2.7,"multishot":1,"attacks":[{"name":"Normal Attack","speed":10,"crit_chance":23,"crit_mult":1.9,"status_chance":31,"shot_type":"Hit-Scan","damage":{"Impact":11.6,"Slash":12.7,"Puncture":2.7}}],"name":"Kuva Twin Stubbas","imageName":"kuva-twin-stubbas.webp","tags":["Grineer","Kuva Lich"],"compTags":[]},
  "Laetum":{"masteryReq":14,"description":"During parades and victory marches, the Laetum fired pigmented airburst rounds that rained onto festive crowds. The Orokin sent Laetum with the Zariman so they could properly celebrate a successful maiden voyage to Tau. There would be no such celebration, but the Void imbued the Laetum with a much more explosive capacity.","noise":"Alarming","releaseDate":"2022-04-27","productCategory":"Pistols","zoomProps":[[]],"category":"Secondary","trigger":"Semi","type":"Pistol","magazineSize":12,"reloadTime":2,"multishot":1,"attacks":[{"name":"Normal Attack","speed":2.5,"crit_chance":22,"crit_mult":2.2,"status_chance":22,"shot_type":"Projectile","shot_speed":100,"flight":100,"damage":{"Impact":64,"Slash":96}},{"name":"Incarnon Form","isInc":1,"speed":6.67,"crit_chance":22,"crit_mult":2.2,"status_chance":22,"shot_type":"Projectile","shot_speed":40,"flight":40,"damage":{"Impact":100}},{"name":"Incarnon Radial Attack","isInc":1,"speed":6.67,"crit_chance":22,"crit_mult":2.2,"status_chance":22,"shot_type":"AoE","damage":{"Radiation":300},"falloff":{"start":0,"end":2,"reduction":0.2},"no_headshot_mult":true}],"incMagazineSize":216,"name":"Laetum","imageName":"laetum.webp","tags":["Zariman","Incarnon"],"compTags":["PROJECTILE","AOE"],"comb":[[1,2]]},
  "Landslide Fists (Atlas)":{"masteryReq":0,"description":"Atlas Prime's deadly fists, as utilized by his Landslide ability.","blockingAngle":90,"comboDuration":5,"followThrough":0.5,"range":4,"windUp":0.4,"noise":"Silent","releaseDate":"2025-03-19","productCategory":"Melee","category":"Melee","type":"Exalted Weapon","multishot":1,"attacks":[{"name":"Normal Attack","isHeavy":false,"speed":1,"crit_chance":35,"crit_mult":2,"status_chance":15,"damage":{"Impact":350}}],"name":"Landslide Fists (Atlas)","imageName":"LandslideFists.webp","tags":[],"compTags":["ATLAS_STANCE","POWER_WEAPON"]},
  "Larkspur (Arch-mode)":{"masteryReq":8,"description":"From death blooms the Larkspur. A unique and menacing Archgun with a wild initial attack that locks onto a target then chains other targets close to the first. It also sports an explosive projectile mode. In Hildryn's grip the Larkspur carries more reserve ammo.","releaseDate":"2019-03-08","ammoCapacity":0,"productCategory":"Archguns","zoomProps":[[]],"category":"Archgun","trigger":"Held","type":"Archgun","magazineSize":100,"reloadTime":4.5,"multishot":1,"attacks":[{"name":"Projectile Impact","isBeam":true,"speed":12,"crit_chance":10,"crit_mult":1.4,"status_chance":50,"shot_type":"Hit-Scan","damage":{"Impact":10,"Radiation":80}},{"name":"Alt-Fire Projectile Impact","ammoCost":10,"speed":1,"crit_chance":26,"crit_mult":2.2,"status_chance":34,"shot_type":"Projectile","shot_speed":100,"damage":{"Impact":140,"Blast":180,"Radiation":100},"charge_time":0.5},{"name":"Explosion","ammoCost":10,"speed":2,"crit_chance":26,"crit_mult":2.2,"status_chance":34,"shot_type":"AoE","damage":{"Blast":400,"Radiation":400},"no_headshot_mult":true}],"reloadRate":50,"reloadDelay":2.5,"name":"Larkspur (Arch-mode)","imageName":"Larkspur.webp","tags":[],"compTags":["BATTERY"]},
  "Kuva Zarr":{"masteryReq":15,"description":"An even stronger Zarr cannon to meet the demands of Kuva Liches. With stronger explosive barrages, and long-range flak shots.","noise":"Alarming","releaseDate":"2021-07-06","ammoCapacity":5,"productCategory":"LongGuns","zoomProps":[[]],"category":"Primary","trigger":"Semi-Auto","type":"Rifle","magazineSize":5,"reloadTime":4.8,"multishot":1,"attacks":[{"name":"Cannon Mode Projectile","speed":2.17,"crit_chance":25,"crit_mult":2.5,"status_chance":31,"shot_type":"Projectile","shot_speed":75,"flight":75,"damage":{"Impact":50}},{"name":"Cannon Mode Explosion","speed":2.17,"crit_chance":25,"crit_mult":2.5,"status_chance":31,"shot_type":"AoE","damage":{"Blast":673},"falloff":{"start":0,"end":7,"reduction":0.7},"no_headshot_mult":true},{"name":"Cannon Mode Cluster Bomb Contact","multishot":3,"speed":2.17,"crit_chance":25,"crit_mult":2.5,"status_chance":31,"shot_type":"Projectile","shot_speed":8,"flight":8,"damage":{"Impact":15}},{"name":"Cannon Mode Cluster Bomb Explosion","multishot":3,"speed":2.17,"crit_chance":25,"crit_mult":2.5,"status_chance":31,"shot_type":"AoE","damage":{"Blast":50},"falloff":{"start":0,"end":3,"reduction":0.3},"no_headshot_mult":true},{"name":"Barrage Mode","multishot":10,"punch_through":1.6,"speed":2.17,"crit_chance":37,"crit_mult":2.5,"status_chance":9.7,"shot_type":"Projectile","shot_speed":120,"flight":120,"damage":{"Impact":15,"Slash":10,"Puncture":25},"falloff":{"start":20,"end":40,"reduction":0.98}}],"name":"Kuva Zarr","imageName":"kuva-zarr.webp","tags":["Grineer","Kuva Lich"],"compTags":["ASSAULT_AMMO","PROJECTILE","AOE","SINGLESHOT"],"comb":[[0,1,2,3]]},
  "Larkspur Prime (Arch-mode)":{"masteryReq":8,"description":"Embrace pandemonium. Chainfire and explosive potential meet in Larkspur Prime. Hildryn packs more ammo when she wields this mighty weapon.","releaseDate":"2023-03-15","ammoCapacity":0,"productCategory":"Archguns","zoomProps":[[]],"category":"Archgun","trigger":"Held","type":"Archgun","magazineSize":100,"reloadTime":4.5,"multishot":1,"attacks":[{"name":"Projectile Impact","isBeam":true,"speed":12,"crit_chance":14,"crit_mult":1.6,"status_chance":50,"shot_type":"Hit-Scan","damage":{"Impact":10,"Radiation":60}},{"name":"Alt-Fire Projectile Impact","ammoCost":10,"speed":2,"crit_chance":28,"crit_mult":2.2,"status_chance":38,"shot_type":"Projectile","shot_speed":100,"damage":{"Impact":140,"Blast":180,"Radiation":100},"charge_time":0.5},{"name":"Explosion","ammoCost":10,"speed":2,"crit_chance":28,"crit_mult":2.2,"status_chance":38,"shot_type":"AoE","damage":{"Blast":400,"Radiation":400},"no_headshot_mult":true}],"reloadRate":50,"reloadDelay":2.5,"name":"Larkspur Prime (Arch-mode)","imageName":"LarkspurPrime.webp","tags":[],"compTags":["BATTERY"]},
  "Lato":{"masteryReq":0,"description":"The Lato is a highly accurate pistol used by the Tenno everywhere.","noise":"Alarming","releaseDate":"2012-10-25","productCategory":"Pistols","category":"Secondary","trigger":"Semi","type":"Pistol","magazineSize":15,"reloadTime":1,"multishot":1,"attacks":[{"name":"Normal Attack","speed":6.67,"crit_chance":10,"crit_mult":1.8,"status_chance":6,"shot_type":"Hit-Scan","damage":{"Impact":7.5,"Slash":15,"Puncture":7.5}},{"name":"Incarnon Form","multishot":2,"isInc":1,"punch_through":0.4,"speed":3.5,"crit_chance":16,"crit_mult":2.6,"status_chance":6,"damage":{"Impact":16,"Slash":32,"Puncture":16}}],"incMagazineSize":24,"name":"Lato","imageName":"lato.webp","tags":["Tenno","Incarnon"],"compTags":[]},
  "Lacera":{"masteryReq":7,"description":"In the practiced hands of a master, this blade and whip becomes exceedingly devastating.","blockingAngle":60,"comboDuration":5,"followThrough":0.5,"range":2.5,"windUp":0.4,"releaseDate":"2015-12-03","productCategory":"Melee","equipTime":0.93333,"category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","slide":"216","slam":{"damage":"648.00","radial":{"damage":"216.00","element":"Electricity","radius":7}},"speed":0.917,"crit_chance":5,"crit_mult":2,"status_chance":45,"damage":{"Impact":12,"Slash":66,"Puncture":38,"Electricity":100}},{"name":"Slam","radius":8,"type":"s","isHeavy":false,"speed":1,"crit_chance":5,"crit_mult":2,"status_chance":45,"unique":{"force_procs":["impact"]},"damage":{"Electricity":432}},{"name":"Heavy Slam","radius":8,"type":"hs","isHeavy":true,"speed":1,"crit_chance":5,"crit_mult":2,"status_chance":45,"damage":{"Electricity":648}}],"name":"Lacera","imageName":"lacera.webp","tags":["Tenno"],"compTags":["BLADE_AND_WHIP_STANCE"]},
  "Lanka":{"masteryReq":10,"description":"The Lanka fires a high velocity projectile through magnetic induction.","noise":"Alarming","releaseDate":"2013-05-23","ammoCapacity":72,"productCategory":"LongGuns","equipTime":1.1,"zoomProps":[{"Upgrades":[{"DamageType":"DT_ANY","OperationType":"ADD","UpgradeType":"crit_chance","Value":0.15}]},{"Upgrades":[{"DamageType":"DT_ANY","OperationType":"ADD","UpgradeType":"crit_chance","Value":0.25}]},{"Upgrades":[{"DamageType":"DT_ANY","OperationType":"ADD","UpgradeType":"crit_chance","Value":0.5}]}],"category":"Primary","trigger":"Charge","type":"Rifle","magazineSize":10,"reloadTime":2,"multishot":1,"attacks":[{"name":"Uncharged Shot","speed":1,"crit_chance":20,"crit_mult":2,"status_chance":25,"shot_type":"Projectile","shot_speed":200,"flight":200,"damage":{"Electricity":200},"falloff":{"start":400,"end":600,"reduction":0.5},"charge_time":0.3},{"name":"Charged Shot","punch_through":5,"sniperCombo":true,"speed":1,"crit_chance":25,"crit_mult":2,"status_chance":25,"shot_type":"Projectile","shot_speed":250,"flight":250,"damage":{"Electricity":525},"charge_time":1}],"name":"Lanka","imageName":"lanka.webp","tags":["Corpus"],"compTags":["PROJECTILE","SNIPER_AMMO"]},
  "Larkspur Prime (Atmo-mode)":{"masteryReq":8,"description":"Embrace pandemonium. Chainfire and explosive potential meet in Larkspur Prime. Hildryn packs more ammo when she wields this mighty weapon.","releaseDate":"2023-03-15","ammoCapacity":400,"productCategory":"Archguns","zoomProps":[[]],"category":"Archgun","trigger":"Held","type":"Archgun","magazineSize":100,"reloadTime":2.5,"multishot":1,"attacks":[{"name":"Projectile Impact","isBeam":true,"speed":12,"crit_chance":14,"crit_mult":1.6,"status_chance":50,"shot_type":"Hit-Scan","damage":{"Impact":20,"Radiation":160}},{"name":"Alt-Fire Projectile Impact","ammoCost":10,"speed":2,"crit_chance":28,"crit_mult":2.2,"status_chance":38,"shot_type":"Projectile","shot_speed":100,"unique":{"force_procs":["impact"]},"damage":{"Impact":280,"Blast":360,"Radiation":200},"charge_time":0.5},{"name":"Explosion","ammoCost":10,"speed":2,"crit_chance":28,"crit_mult":2.2,"status_chance":38,"shot_type":"AoE","damage":{"Blast":800,"Radiation":800},"no_headshot_mult":true}],"name":"Larkspur Prime (Atmo-mode)","imageName":"LarkspurPrime.webp","tags":[],"compTags":[""]},
  "Larkspur (Atmo-mode)":{"masteryReq":8,"description":"From death blooms the Larkspur. A unique and menacing Archgun with a wild initial attack that locks onto a target then chains other targets close to the first. It also sports an explosive projectile mode. In Hildryn's grip the Larkspur carries more reserve ammo.","releaseDate":"2019-03-08","ammoCapacity":400,"productCategory":"Archguns","zoomProps":[[]],"category":"Archgun","trigger":"Held","type":"Archgun","magazineSize":100,"reloadTime":2.5,"multishot":1,"attacks":[{"name":"Projectile Impact","isBeam":true,"speed":12,"crit_chance":10,"crit_mult":1.4,"status_chance":50,"shot_type":"Hit-Scan","damage":{"Impact":20,"Radiation":160}},{"name":"Alt-Fire Projectile Impact","ammoCost":10,"speed":2,"crit_chance":26,"crit_mult":2.2,"status_chance":34,"shot_type":"Projectile","shot_speed":100,"damage":{"Impact":280,"Blast":360,"Radiation":200},"charge_time":0.5},{"name":"Explosion","ammoCost":10,"speed":2,"crit_chance":26,"crit_mult":2.2,"status_chance":34,"shot_type":"AoE","damage":{"Blast":800,"Radiation":800},"no_headshot_mult":true}],"name":"Larkspur (Atmo-mode)","imageName":"Larkspur.webp","tags":[],"compTags":[""]},
  "Latron Prime":{"masteryReq":10,"description":"The ornamental Latron Prime exploits ancient Orokin technology to get a slight damage increase over the standard Latron.","noise":"Alarming","releaseDate":"2013-05-03","ammoCapacity":540,"productCategory":"LongGuns","equipTime":1.1,"zoomProps":[[]],"category":"Primary","trigger":"Semi","type":"Rifle","magazineSize":15,"reloadTime":2.4000001,"multishot":1,"attacks":[{"name":"Normal Attack","speed":4.17,"crit_chance":22,"crit_mult":2.8,"status_chance":26,"shot_type":"Hit-Scan","damage":{"Impact":9,"Slash":9,"Puncture":72}},{"name":"Incarnon Form","isCoMult":true,"isInc":1,"speed":3.33,"crit_chance":44,"crit_mult":3.4,"status_chance":30,"shot_type":"Projectile","damage":{"Impact":50}},{"name":"Auto Radial Attack","isInc":1,"speed":3.33,"crit_chance":44,"crit_mult":3.4,"status_chance":30,"shot_type":"AoE","damage":{"Heat":70,"Puncture":70},"no_headshot_mult":true}],"incMagazineSize":40,"name":"Latron Prime","imageName":"latron-prime.webp","tags":["Prime","Vaulted","Incarnon"],"compTags":["ASSAULT_AMMO","LATRON"],"comb":[[1,2]]},
  "Lesion":{"masteryReq":9,"description":"An instrument of unrelenting harm. If Lesion tastes blood, it becomes invigorated with faster Attack Speed and increased <DT_POISON>Toxin Damage.","blockingAngle":55,"comboDuration":5,"followThrough":0.6,"range":2.7,"windUp":0.9,"releaseDate":"2016-03-04","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"474","slam":{"damage":"711.00","radial":{"damage":"237.00","element":"Impact","radius":7}},"speed":1,"crit_chance":15,"crit_mult":2,"status_chance":37,"damage":{"Impact":47.4,"Slash":177.75,"Puncture":11.85}},{"name":"Slam","radius":7,"type":"s","isHeavy":false,"speed":1,"crit_chance":15,"crit_mult":2,"status_chance":37,"unique":{"force_procs":["impact"]},"damage":{"Impact":474}},{"name":"Heavy Slam","radius":8,"type":"hs","isHeavy":true,"speed":1,"crit_chance":15,"crit_mult":2,"status_chance":37,"damage":{"Blast":711}}],"name":"Lesion","imageName":"lesion.webp","tags":["Infested"],"compTags":["POLEARMS_STANCE"]},
  "Lato Vandal":{"masteryReq":7,"description":"A special version of the standard Lato pistol with a slower Fire Rate but offering higher Accuracy and Damage values. The Lato Vandal has been customized by the Tenno with a blue-green metallic finish and Lotus branding on the grips.","noise":"Alarming","releaseDate":"2013-03-18","productCategory":"Pistols","category":"Secondary","trigger":"Semi","type":"Pistol","magazineSize":15,"reloadTime":1,"multishot":1,"attacks":[{"name":"Normal Attack","speed":5,"crit_chance":26,"crit_mult":2.4,"status_chance":10,"shot_type":"Hit-Scan","damage":{"Impact":6.9,"Slash":27.6,"Puncture":11.5}},{"name":"Incarnon Form","multishot":2,"isInc":1,"punch_through":0.8,"speed":4,"crit_chance":34,"crit_mult":3,"status_chance":10,"damage":{"Impact":19,"Slash":38,"Puncture":19}}],"incMagazineSize":24,"name":"Lato Vandal","imageName":"lato-vandal.webp","tags":["Tenno","Vandal","Incarnon"],"compTags":[]},
  "Latron Wraith":{"masteryReq":7,"description":"The Latron Wraith is a powerful variation of the standard, semi-automatic rifle that features unique styling.","noise":"Alarming","releaseDate":"2014-08-28","ammoCapacity":540,"productCategory":"LongGuns","equipTime":1.1,"zoomProps":[[]],"category":"Primary","trigger":"Semi","type":"Rifle","magazineSize":15,"reloadTime":2.4000001,"multishot":1,"attacks":[{"name":"Normal Attack","speed":5.42,"crit_chance":26,"crit_mult":2.8,"status_chance":14,"shot_type":"Hit-Scan","damage":{"Impact":15.5,"Slash":3.1,"Puncture":43.4}},{"name":"Incarnon Form","isInc":1,"speed":3.67,"crit_chance":48,"crit_mult":3.4,"status_chance":28,"shot_type":"Hit-Scan","damage":{"Impact":50}},{"name":"Auto Radial Attack","isInc":1,"speed":3.67,"crit_chance":48,"crit_mult":3.4,"status_chance":28,"shot_type":"AoE","damage":{"Puncture":50,"Heat":50},"no_headshot_mult":true}],"incMagazineSize":40,"name":"Latron Wraith","imageName":"latron-wraith.webp","tags":["Wraith","Invasion Reward","Tenno","Incarnon"],"compTags":["ASSAULT_AMMO","LATRON"],"comb":[[1,2]]},
  "Lato Prime":{"masteryReq":14,"description":"The Lato is a highly accurate pistol used by the Tenno everywhere. Prime model offers slightly increased damage.","noise":"Alarming","releaseDate":"2012-12-18","productCategory":"Pistols","category":"Secondary","trigger":"Semi","type":"Pistol","magazineSize":20,"reloadTime":1,"multishot":1,"attacks":[{"name":"Normal Attack","speed":6.67,"crit_chance":30,"crit_mult":2,"status_chance":20,"shot_type":"Hit-Scan","damage":{"Impact":4.8,"Slash":33.6,"Puncture":9.6}},{"name":"Incarnon Form","multishot":2,"isInc":1,"punch_through":1,"speed":4,"crit_chance":36,"crit_mult":3.2,"status_chance":15,"damage":{"Impact":19.5,"Slash":39,"Puncture":19.5}}],"incMagazineSize":24,"name":"Lato Prime","imageName":"lato-prime.webp","tags":["Prime","Vaulted","Founder","Incarnon"],"compTags":[]},
  "Lecta":{"masteryReq":0,"description":"Half taser, half whip. The Corpus Lecta delivers a deadly shock to anything it touches.","blockingAngle":45,"comboDuration":5,"followThrough":0.5,"range":2.5,"windUp":0.4,"releaseDate":"2013-11-20","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"202","slam":{"damage":"303.00","radial":{"damage":"101.00","radius":5}},"speed":1,"crit_chance":5,"crit_mult":1.5,"status_chance":25,"damage":{"Slash":25,"Puncture":20,"Electricity":56}},{"name":"Slam","radius":5,"type":"s","isHeavy":false,"speed":1,"crit_chance":5,"crit_mult":1.5,"status_chance":25,"unique":{"force_procs":["impact"]},"damage":{"Electricity":202}},{"name":"Heavy Slam","radius":6,"type":"hs","isHeavy":true,"speed":1,"crit_chance":5,"crit_mult":1.5,"status_chance":25,"damage":{"Electricity":303}}],"name":"Lecta","imageName":"lecta.webp","tags":["Corpus"],"compTags":["WHIPS_STANCE"]},
  "Lex Prime":{"masteryReq":8,"description":"The Lex Prime is a powerful, accurate pistol that has a low Fire Rate and Magazine Capacity. Very efficient at long range.","noise":"Alarming","releaseDate":"2014-06-09","productCategory":"Pistols","category":"Secondary","trigger":"Semi","type":"Pistol","magazineSize":8,"reloadTime":2.35,"multishot":1,"attacks":[{"name":"Normal Attack","speed":2.08,"crit_chance":25,"crit_mult":2,"status_chance":25,"shot_type":"Hit-Scan","damage":{"Impact":15,"Slash":15,"Puncture":120}},{"name":"Incarnon Form","isInc":1,"punch_through":1.4,"speed":0.67,"crit_chance":35,"crit_mult":3,"status_chance":44,"unique":{"force_procs":["impact"]},"damage":{"Impact":400,"Radiation":800}}],"incMagazineSize":20,"name":"Lex Prime","imageName":"lex-prime.webp","tags":["Prime","Never Vaulted","Incarnon"],"compTags":[]},
  "Latron":{"masteryReq":0,"description":"The Latron is a highly efficient rifle that performs well at medium and at long range, its accuracy making it a deadly weapon in the hands of skilled marksmen.","noise":"Alarming","releaseDate":"2012-10-25","ammoCapacity":540,"productCategory":"LongGuns","equipTime":1.1,"zoomProps":[[]],"category":"Primary","trigger":"Semi","type":"Rifle","magazineSize":15,"reloadTime":2.4000001,"multishot":1,"attacks":[{"name":"Normal Attack","speed":4.17,"crit_chance":12,"crit_mult":2,"status_chance":12,"shot_type":"Hit-Scan","damage":{"Impact":8.25,"Slash":8.25,"Puncture":38.5}},{"name":"Incarnon Form","isCoMult":true,"isInc":1,"speed":3.33,"crit_chance":32,"crit_mult":3,"status_chance":24,"shot_type":"Projectile","damage":{"Impact":50}},{"name":"Incarnon Form Radial Attack","isInc":1,"speed":3.33,"crit_chance":32,"crit_mult":3,"status_chance":24,"shot_type":"AoE","damage":{"Heat":40,"Puncture":40},"no_headshot_mult":true}],"incMagazineSize":40,"name":"Latron","imageName":"latron.webp","tags":["Tenno","Incarnon"],"compTags":["ASSAULT_AMMO","LATRON"],"comb":[[1,2]]},
  "Lex":{"masteryReq":3,"description":"The Lex is a powerful, accurate pistol that has a low Fire Rate and Magazine Capacity. Very efficient at long range.","noise":"Alarming","releaseDate":"2012-10-25","productCategory":"Pistols","category":"Secondary","trigger":"Semi","type":"Pistol","magazineSize":6,"reloadTime":2.35,"multishot":1,"attacks":[{"name":"Normal Attack","speed":1.08,"crit_chance":20,"crit_mult":2,"status_chance":10,"shot_type":"Hit-Scan","damage":{"Impact":13,"Slash":13,"Puncture":104}},{"name":"Incarnon Form","isInc":1,"punch_through":1.4,"speed":0.67,"crit_chance":30,"crit_mult":3,"status_chance":40,"unique":{"force_procs":["impact"]},"damage":{"Impact":300,"Radiation":700}}],"incMagazineSize":20,"name":"Lex","imageName":"lex.webp","tags":["Tenno","Incarnon"],"compTags":[]},
  "Machete Wraith":{"masteryReq":11,"description":"A different take on a familiar combat knife, the Machete Wraith features unique styling.","blockingAngle":55,"comboDuration":5,"followThrough":0.7,"range":2.5,"windUp":0.7,"releaseDate":"2013-10-23","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","slide":"422","slam":{"damage":"633.30","radial":{"damage":"211.00","element":"Impact","radius":8}},"speed":1.08,"crit_chance":19,"crit_mult":2.1,"status_chance":33,"damage":{"Impact":31.65,"Slash":147.7,"Puncture":31.65}},{"name":"Slam","radius":8,"type":"s","isHeavy":false,"speed":1,"crit_chance":19,"crit_mult":2.1,"status_chance":33,"unique":{"force_procs":["impact"]},"damage":{"Impact":422}},{"name":"Heavy Slam","radius":9,"type":"hs","isHeavy":true,"speed":1,"crit_chance":19,"crit_mult":2.1,"status_chance":33,"damage":{"Blast":633}}],"name":"Machete Wraith","imageName":"machete-wraith.webp","tags":["Wraith","Grineer"],"compTags":["MACHETES_STANCE"]},
  "Lenz":{"masteryReq":8,"description":"Bolts from this Corpus bow deliver a one-two punch of an icy pulse, followed by a conventional explosion. Excess ammo picked up for other weapons will be converted into charges for the Lenz. Warning: Safety-protocols do not exist on this prototype.","noise":"Alarming","releaseDate":"2017-08-02","ammoCapacity":6,"productCategory":"LongGuns","equipTime":1.8,"zoomProps":[[]],"category":"Primary","trigger":"Charge","type":"Rifle","magazineSize":1,"reloadTime":0.6,"multishot":1,"attacks":[{"name":"Charged Shot","speed":1,"crit_chance":50,"crit_mult":2,"status_chance":5,"shot_type":"Projectile","shot_speed":60,"flight":60,"unique":{"force_procs":["impact"]},"damage":{"Impact":50},"charge_time":1.2},{"name":"Initial Blast","speed":1,"crit_chance":50,"crit_mult":2,"status_chance":5,"shot_type":"AoE","unique":{"force_procs":["cold"]},"damage":{"Cold":10},"falloff":{"start":0,"end":7.2,"reduction":0.7},"no_headshot_mult":true,"charge_time":1.2},{"name":"Bubble Collapse","speed":1,"crit_chance":50,"crit_mult":2,"status_chance":5,"shot_type":"AoE","damage":{"Blast":660},"falloff":{"start":0,"end":7.2,"reduction":0.7},"no_headshot_mult":true,"charge_time":1.2}],"name":"Lenz","imageName":"lenz.webp","tags":["Corpus"],"compTags":["PROJECTILE","SNIPER_AMMO","AOE","SINGLESHOT","CRPBOW"],"comb":[[0,1,2]]},
  "Magnus":{"masteryReq":10,"description":"The versatile Magnus revolver is a lethal sidearm for any Tenno.","noise":"Alarming","releaseDate":"2013-12-04","productCategory":"Pistols","category":"Secondary","trigger":"Semi","type":"Pistol","magazineSize":8,"reloadTime":1.4,"multishot":1,"attacks":[{"name":"Normal Attack","speed":5.83,"crit_chance":22,"crit_mult":2,"status_chance":22,"shot_type":"Hit-Scan","damage":{"Impact":34.2,"Slash":20.9,"Puncture":20.9}}],"name":"Magnus","imageName":"magnus.webp","tags":["Tenno"],"compTags":["MAGNUS"]},
  "Lizzie (Temple)":{"masteryReq":0,"description":"Lizzie was born from Flare's own Techrot-infused blood. More than a mere instrument, she thrums with fire-spitting fury.","noise":"Alarming","releaseDate":"2025-03-19","productCategory":"LongGuns","category":"Primary","trigger":"Held","type":"Exalted Weapon","magazineSize":9999,"reloadTime":0,"multishot":1,"attacks":[{"name":"Normal Attack","isBeam":true,"speed":8,"crit_chance":35,"crit_mult":2.3,"status_chance":35,"shot_type":"Discharge","damage":{"Heat":85},"no_headshot_mult":true},{"name":"Viral Wave","speed":5.33,"crit_chance":15,"crit_mult":2,"status_chance":25,"shot_type":"Projectile","unique":{"force_procs":["impact","viral"]},"damage":{"Viral":100}},{"name":"Magnetic Wave","speed":5.33,"crit_chance":15,"crit_mult":2,"status_chance":25,"shot_type":"Projectile","unique":{"force_procs":["impact","magnetic"]},"damage":{"Magnetic":100}},{"name":"Cold Wave","speed":5.33,"crit_chance":15,"crit_mult":2,"status_chance":25,"shot_type":"Projectile","unique":{"force_procs":["impact","cold"]},"damage":{"Cold":100}},{"name":"Corrosive Wave","speed":5.33,"crit_chance":15,"crit_mult":2,"status_chance":25,"shot_type":"Projectile","unique":{"force_procs":["impact","corrosive"]},"damage":{"Corrosive":100}}],"name":"Lizzie (Temple)","imageName":"Lizzie.webp","tags":[""],"compTags":["POWER_WEAPON","BEAM"],"comb":[[0,1],[0,2],[0,3],[0,4],[0,1,2,3,4]]},
  "Magistar":{"masteryReq":1,"description":"The Magistar mace wields justice and truth in the form of bone-crushing blows.","blockingAngle":50,"comboDuration":5,"followThrough":0.4,"range":2.5,"windUp":1.2,"releaseDate":"2013-12-19","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"420","slam":{"damage":"630.00","radial":{"damage":"210.00","radius":9}},"speed":0.833,"crit_chance":20,"crit_mult":2,"status_chance":10,"damage":{"Impact":168,"Slash":10.5,"Puncture":31.5}},{"name":"Slam","radius":9,"type":"s","isHeavy":false,"speed":1,"crit_chance":20,"crit_mult":2,"status_chance":10,"damage":{"Impact":420}},{"name":"Heavy Slam","radius":10,"type":"hs","isHeavy":true,"speed":1,"crit_chance":20,"crit_mult":2,"status_chance":10,"damage":{"Blast":630}}],"name":"Magistar","imageName":"magistar.webp","tags":["Tenno","Incarnon"],"compTags":["HAMMERS_STANCE"]},
  "Machete":{"masteryReq":1,"description":"A ferocious Melee Weapon crafted by the Grineer and carried by their elite melee forces.","blockingAngle":55,"comboDuration":5,"followThrough":0.7,"range":2.5,"windUp":0.7,"releaseDate":"2013-05-23","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","slide":"240","slam":{"damage":"360.00","radial":{"damage":"120.00","element":"Impact","radius":8}},"speed":0.917,"crit_chance":10,"crit_mult":1.5,"status_chance":15,"damage":{"Impact":18,"Slash":84,"Puncture":18}},{"name":"Slam","radius":8,"type":"s","isHeavy":false,"speed":1,"crit_chance":10,"crit_mult":1.5,"status_chance":15,"unique":{"force_procs":["impact"]},"damage":{"Impact":240}},{"name":"Heavy Slam","radius":9,"type":"hs","isHeavy":true,"speed":1,"crit_chance":10,"crit_mult":1.5,"status_chance":15,"damage":{"Blast":360}}],"name":"Machete","imageName":"machete.webp","tags":["Grineer"],"compTags":["MACHETES_STANCE"]},
  "Mandonel (Arch-mode)":{"masteryReq":10,"description":"Mandonel fires Radiation Damage projectiles. Partially charged shots release a spread and fully charged shots release a beam that dissolves into a radiation field. Projectiles that pass through the field are empowered.","releaseDate":"2023-12-13","ammoCapacity":0,"productCategory":"Archguns","zoomProps":[[]],"category":"Archgun","type":"Archgun","magazineSize":30,"reloadTime":3,"multishot":1,"attacks":[{"name":"Horizontal Spread","multishot":8,"speed":3,"crit_chance":25,"crit_mult":2,"status_chance":15,"shot_type":"Projectile","damage":{"Impact":25,"Puncture":15,"Slash":10,"Radiation":40},"charge_time":1.5},{"name":"Charge","punch_through":2.4,"speed":3,"crit_chance":30,"crit_mult":2.5,"status_chance":20,"shot_type":"Hit-Scan","damage":{"Impact":200,"Heat":300,"Radiation":400}}],"reloadRate":15,"reloadDelay":1,"name":"Mandonel (Arch-mode)","imageName":"Mandonel.webp","tags":[""],"compTags":["BATTERY"]},
  "Magnus Prime":{"masteryReq":14,"description":"Orokin elegance meets formidable stopping power in this exquisite revolver. Hits have a chance to maximize Ammo Efficiency for a few seconds.","noise":"Alarming","releaseDate":"2021-09-08","ammoCapacity":160,"productCategory":"Pistols","category":"Secondary","trigger":"Semi","type":"Pistol","magazineSize":8,"reloadTime":1.2,"multishot":1,"attacks":[{"name":"Normal Attack","speed":5.83,"crit_chance":28,"crit_mult":2.8,"status_chance":28,"shot_type":"Hit-Scan","unique":{"WITH_COND":{"ammoEff":1}},"damage":{"Impact":34.2,"Slash":20.9,"Puncture":20.9}}],"name":"Magnus Prime","imageName":"magnus-prime.webp","tags":["Prime"],"compTags":["MAGNUS"]},
  "Mara Detron":{"masteryReq":9,"description":"For Orokin-era smugglers, this fearsome handheld shotgun was a favored tool for 'dispute resolution'.","noise":"Alarming","releaseDate":"2014-12-12","productCategory":"Pistols","category":"Secondary","trigger":"Semi","type":"Rifle","magazineSize":8,"reloadTime":1.05,"multishot":7,"attacks":[{"name":"Normal Attack","speed":3.33,"crit_chance":8,"crit_mult":1.5,"status_chance":13.71,"shot_type":"Projectile","shot_speed":150,"flight":150,"damage":{"Radiation":40},"falloff":{"start":16,"end":30,"reduction":0.625}}],"name":"Mara Detron","imageName":"mara-detron.webp","tags":["Corpus"],"compTags":["PROJECTILE","SECONDARYSHOTGUN"]},
  "Mandonel (Atmo-mode)":{"masteryReq":10,"description":"Mandonel fires Radiation Damage projectiles. Partially charged shots release a spread and fully charged shots release a beam that dissolves into a radiation field. Projectiles that pass through the field are empowered.","releaseDate":"2023-12-13","ammoCapacity":300,"productCategory":"Archguns","zoomProps":[[]],"category":"Archgun","type":"Archgun","magazineSize":30,"reloadTime":2,"multishot":1,"attacks":[{"name":"Horizontal Spread","multishot":8,"speed":3,"crit_chance":25,"crit_mult":2,"status_chance":15,"shot_type":"Projectile","damage":{"Impact":50,"Puncture":30,"Slash":20,"Radiation":80},"charge_time":1.5},{"name":"Charge","punch_through":2.4,"speed":3,"crit_chance":30,"crit_mult":2.5,"status_chance":20,"shot_type":"Hit-Scan","damage":{"Impact":400,"Heat":600,"Radiation":800}}],"name":"Mandonel (Atmo-mode)","imageName":"Mandonel.webp","tags":[],"compTags":[]},
  "Marelok":{"masteryReq":7,"description":"The Marelok combines the stopping power of a rifle with the portability of a pistol.","noise":"Alarming","releaseDate":"2014-02-27","productCategory":"Pistols","category":"Secondary","trigger":"Semi","type":"Pistol","magazineSize":6,"reloadTime":1.6670001,"multishot":1,"attacks":[{"name":"Normal Attack","speed":2,"crit_chance":15,"crit_mult":1.5,"status_chance":30,"shot_type":"Hit-Scan","damage":{"Impact":80,"Slash":64,"Puncture":16}}],"name":"Marelok","imageName":"marelok.webp","tags":["Grineer"],"compTags":["MARELOK"]},
  "Masseter":{"masteryReq":8,"description":"Tear and chew through enemies with this unusual crankshaft-style greatsword. When wielded by Grendel he is immune to staggers and knockdowns during heavy attacks.","blockingAngle":55,"comboDuration":5,"followThrough":0.6,"range":2.9,"windUp":1.1,"releaseDate":"2019-10-31","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"482","slam":{"damage":"723.00","radial":{"damage":"241.00","element":"Impact","radius":10}},"speed":1,"crit_chance":24,"crit_mult":2,"status_chance":28,"damage":{"Impact":134.96,"Slash":106.04}},{"name":"Slam","radius":10,"type":"s","isHeavy":false,"speed":1,"crit_chance":24,"crit_mult":2,"status_chance":28,"damage":{"Impact":482}},{"name":"Heavy Slam","radius":10,"type":"hs","isHeavy":true,"speed":1,"crit_chance":24,"crit_mult":2,"status_chance":28,"damage":{"Blast":723}}],"name":"Masseter","imageName":"masseter.webp","tags":["Tenno"],"compTags":["HEAVY_BLADE_STANCE"]},
  "Mios":{"masteryReq":8,"description":"This bone-forged sword includes a tendon-whip to distract and maim the enemy.","blockingAngle":60,"comboDuration":5,"followThrough":0.5,"range":2.5,"windUp":0.4,"releaseDate":"2015-11-12","productCategory":"Melee","equipTime":0.93333,"category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"177","slam":{"damage":"531.00","radial":{"damage":"177.00","element":"Toxin","radius":7}},"speed":1.08,"crit_chance":19,"crit_mult":2,"status_chance":25,"damage":{"Impact":53.1,"Slash":79.65,"Puncture":44.25}},{"name":"Slam","radius":7,"type":"s","isHeavy":false,"speed":1,"crit_chance":19,"crit_mult":2,"status_chance":25,"unique":{"force_procs":["impact"]},"damage":{"Toxin":354}},{"name":"Heavy Slam","radius":8,"type":"hs","isHeavy":true,"speed":1,"crit_chance":19,"crit_mult":2,"status_chance":25,"damage":{"Toxin":531}}],"name":"Mios","imageName":"mios.webp","tags":["Infested"],"compTags":["BLADE_AND_WHIP_STANCE"]},
  "Miter":{"masteryReq":6,"description":"The Miter launches high velocity saw blades, tearing apart anyone unfortunate enough to be in their path.","noise":"Alarming","releaseDate":"2013-08-09","ammoCapacity":80,"productCategory":"LongGuns","category":"Primary","trigger":"Charge","type":"Rifle","magazineSize":20,"reloadTime":2,"multishot":1,"attacks":[{"name":"Uncharged Shot","speed":2.5,"crit_chance":5,"crit_mult":2,"status_chance":20,"shot_type":"Projectile","shot_speed":60,"flight":60,"damage":{"Impact":20,"Slash":70,"Puncture":10}},{"name":"Charged Shot","punch_through":2.5,"speed":2.5,"crit_chance":10,"crit_mult":2,"status_chance":50,"shot_type":"Projectile","shot_speed":100,"flight":100,"damage":{"Impact":12.5,"Slash":225,"Puncture":12.5},"charge_time":0.8},{"name":"Incarnon Form","isCoMult":true,"isInc":1,"speed":3.33,"crit_chance":20,"crit_mult":3.3,"status_chance":56,"shot_type":"Projectile","damage":{"Impact":12,"Slash":42,"Puncture":6}},{"name":"Incarnon Form Radial Attack","isInc":1,"speed":3.33,"crit_chance":20,"crit_mult":3.3,"status_chance":56,"shot_type":"AoE","damage":{"Heat":80},"no_headshot_mult":true}],"incMagazineSize":20,"name":"Miter","imageName":"miter.webp","tags":["Grineer","Incarnon"],"compTags":["PROJECTILE","SNIPER_AMMO","AOE","MITER"],"comb":[[2,3]]},
  "Mewan (Polearm)":{"masteryReq":0,"description":"","comboDuration":5,"range":1,"windUp":1,"releaseDate":"2017-10-12","productCategory":"Melee","category":"Melee","type":"Zaw Component","multishot":1,"attacks":[{"name":"Mewan Strike","speed":0.85,"crit_chance":18,"crit_mult":2,"status_chance":18,"damage":{"Impact":56,"Slash":89.6,"Puncture":78.4}}],"name":"Mewan (Polearm)","imageName":"mewan.webp","tags":[],"compTags":["POLEARMS_STANCE"]},
  "Mk1-Furax":{"masteryReq":0,"description":"The MK1-Furax is the standard issue fist weapon for all Tenno.","blockingAngle":50,"comboDuration":5,"followThrough":0.9,"range":1.25,"windUp":0.6,"releaseDate":"2014-07-18","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"270","slam":{"damage":"270.00","radial":{"damage":"90.00","radius":8}},"speed":1,"crit_chance":20,"crit_mult":2,"status_chance":10,"damage":{"Impact":63,"Slash":13.5,"Puncture":13.5}},{"name":"Slam","radius":8,"type":"s","isHeavy":false,"speed":1,"crit_chance":20,"crit_mult":2,"status_chance":10,"unique":{"force_procs":["impact"]},"damage":{"Impact":180}},{"name":"Heavy Slam","radius":9,"type":"hs","isHeavy":true,"speed":1,"crit_chance":20,"crit_mult":2,"status_chance":10,"damage":{"Blast":270}}],"name":"Mk1-Furax","imageName":"mk1-furax.webp","tags":["Grineer","Incarnon"],"compTags":["FIST_STANCE"]},
  "Mk1-Bo":{"masteryReq":0,"description":"The MK1-Bo is the standard issue staff weapon for all Tenno.","blockingAngle":60,"comboDuration":5,"followThrough":0.5,"range":3,"windUp":0.5,"releaseDate":"2014-07-18","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"90","slam":{"damage":"270.00","radial":{"damage":"90.00","radius":6}},"speed":1,"crit_chance":10,"crit_mult":2,"status_chance":10,"damage":{"Impact":81,"Puncture":9}},{"name":"Slam","radius":6,"type":"s","isHeavy":false,"speed":1,"crit_chance":10,"crit_mult":2,"status_chance":10,"unique":{"force_procs":["impact"]},"damage":{"Impact":180}},{"name":"Heavy Slam","radius":7,"type":"hs","isHeavy":true,"speed":1,"crit_chance":10,"crit_mult":2,"status_chance":10,"damage":{"Blast":270}}],"name":"Mk1-Bo","imageName":"mk1-bo.webp","tags":["Tenno"],"compTags":["STAVES_STANCE"]},
  "Mewan (Sword)":{"masteryReq":0,"description":"","comboDuration":5,"range":1,"windUp":1,"releaseDate":"2017-10-12","productCategory":"Melee","category":"Melee","type":"Zaw Component","multishot":1,"attacks":[{"name":"Mewan Strike","speed":0.85,"crit_chance":18,"crit_mult":2,"status_chance":18,"damage":{"Impact":56,"Slash":89.6,"Puncture":78.4}}],"name":"Mewan (Sword)","imageName":"mewan.webp","tags":[],"compTags":["SWORDS_STANCE"]},
  "Masseter Prime":{"masteryReq":8,"description":"A greatsword for those with an insatiable hunger for victory. Grendel is immune to crowd-control when he performs Heavy Attacks with this weapon.","blockingAngle":55,"comboDuration":5,"followThrough":0.6,"range":2.9,"windUp":1.1,"releaseDate":"2023-10-18","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":1.08,"crit_chance":26,"crit_mult":2.2,"status_chance":36,"damage":{"Impact":145.6,"Slash":114.4}},{"name":"Slam","radius":10,"type":"s","isHeavy":false,"speed":1,"crit_chance":26,"crit_mult":2.2,"status_chance":36,"damage":{"Impact":520}},{"name":"Heavy Slam","radius":10,"type":"hs","isHeavy":true,"speed":1,"crit_chance":26,"crit_mult":2.2,"status_chance":36,"damage":{"Blast":780}}],"name":"Masseter Prime","imageName":"MasseterPrime.webp","tags":["Tenno"],"compTags":["HEAVY_BLADE_STANCE"]},
  "Mire":{"masteryReq":5,"description":"A relic from the Great Plague, the Mire Infested Sword is a brutal weapon. It not only cuts into the enemy, it infects the wounds of its victim with a toxic nerve poison. Deals <DT_POISON>Toxin Damage on Ground Slam attacks.","blockingAngle":55,"comboDuration":5,"followThrough":0.6,"range":2.7,"windUp":0.6,"releaseDate":"2013-04-05","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"158","slam":{"damage":"474.00","radial":{"damage":"158.00","element":"Toxin","radius":7}},"speed":1.08,"crit_chance":9,"crit_mult":1.5,"status_chance":31,"damage":{"Impact":23,"Slash":47,"Puncture":23,"Toxin":65}},{"name":"Slam","radius":7,"type":"s","isHeavy":false,"speed":1,"crit_chance":9,"crit_mult":1.5,"status_chance":31,"unique":{"force_procs":["impact"]},"damage":{"Toxin":316}},{"name":"Heavy Slam","radius":8,"type":"hs","isHeavy":true,"speed":1,"crit_chance":9,"crit_mult":1.5,"status_chance":31,"damage":{"Toxin":474}}],"name":"Mire","imageName":"mire.webp","tags":["Infested"],"compTags":["SWORDS_STANCE","MIRE"]},
  "Mk1-Braton":{"masteryReq":0,"description":"The MK1-Braton is the standard issue rifle for all Tenno. A versatile weapon that can be customized to support a wide variety of play styles.","noise":"Alarming","releaseDate":"2012-10-25","ammoCapacity":540,"productCategory":"LongGuns","equipTime":1.1,"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":60,"reloadTime":2,"multishot":1,"attacks":[{"name":"Normal Attack","speed":7.5,"crit_chance":8,"crit_mult":1.5,"status_chance":5,"shot_type":"Hit-Scan","damage":{"Impact":4.5,"Slash":9,"Puncture":4.5}},{"name":"Incarnon Form","isInc":1,"speed":5,"crit_chance":20,"crit_mult":2.4,"status_chance":10,"damage":{"Impact":20,"Slash":28,"Puncture":2}},{"name":"Incarnon Form Radial Attack","isInc":1,"speed":5,"crit_chance":20,"crit_mult":2.4,"status_chance":10,"shot_type":"AoE","damage":{"Heat":50},"no_headshot_mult":true}],"incMagazineSize":200,"name":"Mk1-Braton","imageName":"mk1-braton.webp","tags":["Tenno","Incarnon"],"compTags":["ASSAULT_AMMO"],"comb":[[1,2]]},
  "Mk1-Furis":{"masteryReq":0,"description":"The MK1-Furis are the standard issue automatic pistol for all Tenno.","noise":"Alarming","releaseDate":"2014-07-18","productCategory":"Pistols","category":"Secondary","trigger":"Auto","type":"Rifle","magazineSize":35,"reloadTime":1.4,"multishot":1,"attacks":[{"name":"Normal Attack","speed":8.33,"crit_chance":5,"crit_mult":2,"status_chance":1,"shot_type":"Hit-Scan","damage":{"Impact":1.95,"Slash":1.95,"Puncture":9.1}},{"name":"Incarnon Form","isBeam":true,"isInc":1,"speed":12,"crit_chance":20,"crit_mult":3,"status_chance":8,"damage":{"Heat":60}}],"incMagazineSize":280,"name":"Mk1-Furis","imageName":"mk1-furis.webp","tags":["Tenno"],"compTags":["FURIS"]},
  "Mk1-Kunai":{"masteryReq":0,"description":"The MK1-Kunai is the standard issue throwing knives for all Tenno.","noise":"Silent","releaseDate":"2014-07-18","productCategory":"Pistols","category":"Secondary","trigger":"Auto","type":"Rifle","magazineSize":10,"reloadTime":0.75,"multishot":1,"attacks":[{"name":"Normal Attack","speed":3.33,"crit_chance":5,"crit_mult":2,"status_chance":2.5,"shot_type":"Projectile","shot_speed":70,"flight":70,"damage":{"Impact":4,"Slash":6,"Puncture":30}},{"name":"Incarnon Form","multishot":2,"isInc":1,"speed":3.33,"crit_chance":14,"crit_mult":2,"status_chance":5,"damage":{"Impact":4.8,"Slash":10.8,"Puncture":8.4}}],"incMagazineSize":20,"name":"Mk1-Kunai","imageName":"mk1-kunai.webp","tags":["Tenno","Incarnon"],"compTags":["PROJECTILE","THROWN","KUNAI"]},
  "Mk1-Paris":{"masteryReq":0,"description":"The MK1-Paris is the standard issue bow for all Tenno.","noise":"Silent","releaseDate":"2014-07-18","ammoCapacity":72,"productCategory":"LongGuns","equipTime":1.1,"category":"Primary","trigger":"Charge","type":"Rifle","magazineSize":1,"reloadTime":0.55000001,"multishot":1,"attacks":[{"name":"Uncharged Shot","speed":1,"crit_chance":30,"crit_mult":2,"status_chance":15,"shot_type":"Projectile","shot_speed":70,"flight":70,"damage":{"Impact":5.75,"Slash":23,"Puncture":86.25}},{"name":"Charged Shot","punch_through":2,"speed":1,"crit_chance":30,"crit_mult":2,"status_chance":15,"shot_type":"Projectile","shot_speed":85,"flight":85,"damage":{"Impact":11.5,"Slash":34.5,"Puncture":184},"charge_time":0.5},{"name":"Incarnon Form","isInc":1,"speed":1,"crit_chance":40,"crit_mult":3,"status_chance":20,"damage":{"Impact":50,"Heat":250},"charge_time":0.8}],"incMagazineSize":20,"name":"Mk1-Paris","imageName":"mk1-paris.webp","tags":["Tenno","Incarnon"],"compTags":["PROJECTILE"]},
  "Morgha (Arch-mode)":{"masteryReq":15,"description":"Blast through enemies with a double-barreled shot of energized slugs. This siphons their life essence which is then used to generate the secondary fire’s massive air-burst mortar. The ancient Entrati weapon was built for Necramechs but also functions as an Archgun.","releaseDate":"2020-11-19","ammoCapacity":0,"productCategory":"Archguns","zoomProps":[[]],"category":"Archgun","type":"Archgun","magazineSize":100,"reloadTime":3,"multishot":1,"attacks":[{"name":"Auto-Burst","speed":3,"crit_chance":30,"crit_mult":2.2,"status_chance":28,"shot_type":"Projectile","shot_speed":160,"damage":{"Impact":32},"burst_count":2,"burst_delay":0},{"name":"Auto Burst Explosion","speed":3,"crit_chance":30,"crit_mult":2.2,"status_chance":28,"shot_type":"AoE","damage":{"Blast":164},"no_headshot_mult":true,"burst_count":2,"burst_delay":0},{"name":"Charged Shot","speed":0.83,"crit_chance":40,"crit_mult":3,"status_chance":50,"damage":{"Impact":164}},{"name":"Charged Shot Explosion","speed":0.83,"crit_chance":40,"crit_mult":3,"status_chance":50,"shot_type":"AoE","damage":{"Impact":600,"Puncture":800,"Slash":1000,"Blast":1200},"no_headshot_mult":true}],"reloadRate":50,"reloadDelay":1,"name":"Morgha (Arch-mode)","imageName":"Morgha.webp","tags":[],"compTags":["BATTERY"]},
  "Mk1-Strun":{"masteryReq":0,"description":"The Strun is a standard shotgun. Reliable, versatile and deadly.","noise":"Alarming","releaseDate":"2014-07-18","ammoCapacity":120,"productCategory":"LongGuns","zoomProps":[[]],"category":"Primary","trigger":"Semi","type":"Rifle","magazineSize":6,"reloadTime":3.75,"multishot":10,"attacks":[{"name":"Normal Attack","speed":2.08,"crit_chance":7.5,"crit_mult":2,"status_chance":6,"shot_type":"Hit-Scan","damage":{"Impact":9.9,"Slash":5.4,"Puncture":2.7},"falloff":{"start":15,"end":25,"reduction":0.5}},{"name":"Incarnon Form","multishot":1,"isInc":1,"speed":1.5,"crit_chance":44,"crit_mult":3,"status_chance":40,"damage":{"Impact":100}},{"name":"Incarnon Form Radial Attack","multishot":1,"isInc":1,"speed":1.5,"crit_chance":44,"crit_mult":3,"status_chance":40,"shot_type":"AoE","damage":{"Blast":45,"Slash":60,"Puncture":25},"no_headshot_mult":true}],"incMagazineSize":40,"name":"Mk1-Strun","imageName":"mk1-strun.webp","tags":["Tenno","Incarnon"],"compTags":[],"comb":[[1,2]]},
  "Mausolon (Arch-mode)":{"masteryReq":14,"description":"An ancient weapon designed by the Entrati for use by their Necramechs. Primary fire siphons life essence from the target to fuel a devastating alt fire. Punishing automatic primary fire and an alt mode that charges up to unleash a destructive beam of energy with a large explosion at point of impact.","releaseDate":"2020-08-25","ammoCapacity":0,"productCategory":"Archguns","zoomProps":[[]],"category":"Archgun","type":"Archgun","magazineSize":300,"reloadTime":5.5,"multishot":1,"attacks":[{"name":"Auto","speed":8.33,"crit_chance":30,"crit_mult":2.2,"status_chance":26,"shot_type":"Hit-Scan","unique":{"force_procs":["impact"]},"damage":{"Heat":50,"Puncture":46,"Impact":24}},{"name":"Auto Radial Attack","speed":8.33,"crit_chance":30,"crit_mult":2.2,"status_chance":26,"shot_type":"AoE","damage":{"Heat":48},"no_headshot_mult":true},{"name":"Charged Shot Laser","speed":0.5,"crit_chance":50,"crit_mult":3.5,"status_chance":50,"shot_type":"Hit-Scan","damage":{"Heat":500,"Puncture":400,"Impact":100},"charge_time":0.8},{"name":"Charged Shot Explosion","speed":0.5,"crit_chance":50,"crit_mult":3.5,"status_chance":50,"shot_type":"AoE","damage":{"Heat":3000},"no_headshot_mult":true,"charge_time":0.8}],"reloadRate":200,"reloadDelay":4,"name":"Mausolon (Arch-mode)","imageName":"Mausolon.webp","tags":[""],"compTags":["BATTERY"],"comb":[[0,1],[2,3]]},
  "Morgha (Atmo-mode)":{"masteryReq":15,"description":"Blast through enemies with a double-barreled shot of energized slugs. This siphons their life essence which is then used to generate the secondary fire’s massive air-burst mortar. The ancient Entrati weapon was built for Necramechs but also functions as an Archgun.","releaseDate":"2020-11-19","ammoCapacity":160,"productCategory":"Archguns","zoomProps":[[]],"category":"Archgun","type":"Archgun","magazineSize":100,"reloadTime":3,"multishot":1,"attacks":[{"name":"Auto-Burst","speed":3,"crit_chance":30,"crit_mult":2.2,"status_chance":28,"shot_type":"Projectile","shot_speed":60,"damage":{"Impact":64}},{"name":"Auto Burst Explosion","speed":3,"crit_chance":30,"crit_mult":2.2,"status_chance":28,"shot_type":"AoE","damage":{"Blast":328},"no_headshot_mult":true},{"name":"Charged Shot","speed":0.83,"crit_chance":40,"crit_mult":3,"status_chance":50,"damage":{"Impact":200}},{"name":"Charged Shot Explosion","speed":0.83,"crit_chance":40,"crit_mult":3,"status_chance":50,"shot_type":"AoE","damage":{"Impact":1200,"Puncture":1600,"Slash":2000,"Blast":2400},"no_headshot_mult":true}],"name":"Morgha (Atmo-mode)","imageName":"Morgha.webp","tags":[],"compTags":[]},
  "Mausolon (Atmo-mode)":{"masteryReq":14,"description":"An ancient weapon designed by the Entrati for use by their Necramechs. Primary fire siphons life essence from the target to fuel a devastating alt fire. Punishing automatic primary fire and an alt mode that charges up to unleash a destructive beam of energy with a large explosion at point of impact.","releaseDate":"2020-08-25","ammoCapacity":900,"productCategory":"Archguns","zoomProps":[[]],"category":"Archgun","type":"Archgun","magazineSize":300,"reloadTime":2,"multishot":1,"attacks":[{"name":"Auto","speed":8.33,"crit_chance":30,"crit_mult":2.2,"status_chance":26,"shot_type":"Hit-Scan","unique":{"force_procs":["impact"]},"damage":{"Heat":75,"Puncture":70,"Impact":35}},{"name":"Auto Radial Attack","speed":8.33,"crit_chance":30,"crit_mult":2.2,"status_chance":26,"shot_type":"AoE","damage":{"Heat":72},"no_headshot_mult":true},{"name":"Charged Shot Laser","speed":0.5,"crit_chance":50,"crit_mult":3.5,"status_chance":50,"shot_type":"Hit-Scan","damage":{"Heat":750,"Puncture":600,"Impact":150},"charge_time":0.8},{"name":"Charged Shot Explosion","speed":0.5,"crit_chance":50,"crit_mult":3.5,"status_chance":50,"shot_type":"AoE","damage":{"Heat":4500},"no_headshot_mult":true,"charge_time":0.8}],"name":"Mausolon (Atmo-mode)","imageName":"Mausolon.webp","tags":[""],"compTags":["BATTERY"],"comb":[[0,1],[2,3]]},
  "Mutalist Quanta":{"masteryReq":2,"description":"A bizarre union of Corpus technology and Infested biology, this automatic rifle can also deploy an irradiated airborne infested mass. Further field testing is required to fully understand the potential of this weapon.","noise":"Alarming","releaseDate":"2014-06-19","ammoCapacity":540,"productCategory":"LongGuns","equipTime":1.1,"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":60,"reloadTime":3,"multishot":1,"attacks":[{"name":"Normal Attack","speed":10,"crit_chance":2.5,"crit_mult":1.5,"status_chance":15,"shot_type":"Projectile","shot_speed":100,"flight":100,"damage":{"Impact":2.5,"Slash":7.5,"Puncture":15}},{"name":"Infested Orb","ammoCost":5,"speed":10,"crit_chance":0,"crit_mult":0,"status_chance":100,"shot_type":"Projectile","shot_speed":5,"flight":5,"damage":{"Radiation":20},"falloff":{"start":0,"end":2,"reduction":0}},{"name":"Orb Explosion","ammoCost":5,"speed":10,"crit_chance":5,"crit_mult":1.5,"status_chance":39,"shot_type":"AoE","damage":{"Toxin":100},"falloff":{"start":0,"end":4.4,"reduction":0.5},"no_headshot_mult":true}],"name":"Mutalist Quanta","imageName":"mutalist-quanta.webp","tags":["Infested"],"compTags":["PROJECTILE","ASSAULT_AMMO"],"comb":[[1,2]]},
  "Mutalist Cernos":{"masteryReq":7,"description":"Overcome with Infestation, this bow's arrows now spread poisonous contagion to any surface they hit.","noise":"Silent","releaseDate":"2016-03-04","ammoCapacity":72,"productCategory":"LongGuns","equipTime":1.1,"zoomProps":[[]],"category":"Primary","trigger":"Charge","type":"Rifle","magazineSize":1,"reloadTime":0.6,"multishot":1,"attacks":[{"name":"Uncharged Shot","isCoMult":true,"speed":1,"crit_chance":15,"crit_mult":2,"status_chance":49,"shot_type":"Projectile","shot_speed":70,"flight":70,"damage":{"Impact":184.5,"Slash":10.25,"Puncture":10.25}},{"name":"Charged Shot","punch_through":1,"speed":1,"crit_chance":15,"crit_mult":2,"status_chance":49,"shot_type":"Projectile","shot_speed":85,"flight":85,"damage":{"Impact":369,"Slash":20.5,"Puncture":20.5},"charge_time":0.5},{"name":"Uncharged Toxin Cloud","isCoMult":true,"speed":1,"crit_chance":15,"crit_mult":2,"status_chance":49,"shot_type":"AoE","unique":{"force_procs":["toxin"]},"damage":{"Toxin":5},"no_headshot_mult":true},{"name":"Charged Toxin Cloud","speed":1,"crit_chance":15,"crit_mult":2,"status_chance":49,"shot_type":"AoE","unique":{"force_procs":["toxin"]},"damage":{"Toxin":5},"no_headshot_mult":true,"charge_time":0.5}],"name":"Mutalist Cernos","imageName":"mutalist-cernos.webp","tags":["Infested"],"compTags":["PROJECTILE","INFCERNOS"]},
  "Nagantaka Prime":{"masteryReq":12,"description":"A golden version of Garuda’s versatile crossbow, as fashioned by the Orokin’s finest weaponsmiths. Alt-fire to let loose a barrage of bolts. All bolts have a chance to cause Bleeding, and Headshot kills have a chance to increase Reload Speed. When wielded by Garuda the Nagantaka gains a slight Punch Through.","noise":"Silent","releaseDate":"2022-03-28","ammoCapacity":540,"productCategory":"LongGuns","zoomProps":[[]],"category":"Primary","trigger":"Semi","type":"Rifle","magazineSize":11,"reloadTime":2.3,"multishot":1,"attacks":[{"name":"Semi-Auto","speed":2.5,"crit_chance":25,"crit_mult":2.3,"status_chance":39,"shot_type":"Projectile","shot_speed":100,"flight":100,"unique":{"force_procs":["impact"]},"damage":{"Impact":1.7,"Slash":155.7,"Puncture":15.6}},{"name":"Burst Shot","speed":7.8,"crit_chance":25,"crit_mult":2.3,"status_chance":39,"shot_type":"Projectile","shot_speed":100,"flight":100,"unique":{"force_procs":["impact"]},"damage":{"Impact":1.7,"Slash":155.7,"Puncture":15.6},"burst_count":11,"burst_delay":0.11}],"name":"Nagantaka Prime","imageName":"nagantaka-prime.webp","tags":["Tenno","Prime"],"compTags":["PROJECTILE","ZHUGE","CROSSBOW"]},
  "Nagantaka":{"masteryReq":9,"description":"Slash targets with a single precise bolt from Garuda's signature crossbow. Alt-fire to let loose a barrage of bolts. All bolts have a chance to cause Bleeding and Headshots have a chance to increase Reload Speed. When wielded by Garuda Nagantaka gains a slight Punch Through.","noise":"Silent","releaseDate":"2018-11-08","ammoCapacity":540,"productCategory":"LongGuns","equipTime":1.1,"zoomProps":[[]],"category":"Primary","trigger":"Semi","type":"Rifle","magazineSize":9,"reloadTime":2.3,"multishot":1,"attacks":[{"name":"Semi-Auto","speed":2.5,"crit_chance":15,"crit_mult":2.3,"status_chance":39,"shot_type":"Projectile","shot_speed":100,"flight":100,"unique":{"force_procs":["impact"]},"damage":{"Impact":1.6,"Slash":143.1,"Puncture":14.3}},{"name":"Burst Shot","speed":5,"crit_chance":15,"crit_mult":2.3,"status_chance":39,"shot_type":"Projectile","shot_speed":100,"flight":100,"unique":{"force_procs":["impact"]},"damage":{"Impact":1.6,"Slash":143.1,"Puncture":14.3},"burst_count":9,"burst_delay":0.15}],"name":"Nagantaka","imageName":"nagantaka.webp","tags":["Tenno"],"compTags":["PROJECTILE","ZHUGE","CROSSBOW"]},
  "Nepheri":{"masteryReq":13,"description":"The dual flaming fang-blades of the Archon Amar. Has a unique Neutral Combo that blasts out four short-range fireballs.","blockingAngle":50,"comboDuration":5,"followThrough":0.8,"range":1.9,"windUp":0.5,"releaseDate":"2021-12-15","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"522","slam":{"damage":"522.00","radial":{"damage":"261.00","radius":6}},"speed":1,"crit_chance":21,"crit_mult":2.3,"status_chance":33,"damage":{"Impact":21,"Slash":85,"Puncture":63,"Heat":92}},{"name":"Slam","radius":6,"type":"s","isHeavy":false,"speed":1,"crit_chance":21,"crit_mult":2.3,"status_chance":33,"unique":{"force_procs":["impact"]},"damage":{"Impact":522}},{"name":"Heavy Slam","radius":7,"type":"hs","isHeavy":true,"speed":1,"crit_chance":21,"crit_mult":2.3,"status_chance":33,"damage":{"Blast":783}}],"name":"Nepheri","imageName":"nepheri.webp","tags":["Sentient"],"compTags":["DUAL_DAGGERS_STANCE"]},
  "Nami Skyla Prime":{"masteryReq":11,"description":"Forged by a forgotten master, these exquisite blades are bounty from a golden-age long gone.","blockingAngle":60,"comboDuration":5,"followThrough":0.5,"range":2.5,"windUp":0.7,"releaseDate":"2017-08-29","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"360","slam":{"damage":"360.00","radial":{"damage":"180.00","element":"Impact","radius":8}},"speed":1.33,"crit_chance":22,"crit_mult":2,"status_chance":34,"damage":{"Impact":18,"Slash":126,"Puncture":36}},{"name":"Slam","radius":8,"type":"s","isHeavy":false,"speed":1,"crit_chance":22,"crit_mult":2,"status_chance":34,"unique":{"force_procs":["impact"]},"damage":{"Impact":360}},{"name":"Heavy Slam","radius":9,"type":"hs","isHeavy":true,"speed":1,"crit_chance":22,"crit_mult":2,"status_chance":34,"damage":{"Blast":540}}],"name":"Nami Skyla Prime","imageName":"nami-skyla-prime.webp","tags":["Prime","Vaulted"],"compTags":["DUAL_SWORDS_STANCE"]},
  "Nikana Prime":{"masteryReq":12,"description":"An ancient blade predating the fall of the Orokin Empire. Forged using techniques lost over the centuries, the edge remains sharper than that of any modern Nikana.","blockingAngle":55,"comboDuration":5,"followThrough":0.7,"range":2.5,"windUp":0.5,"releaseDate":"2016-02-16","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"396","slam":{"damage":"594.00","radial":{"damage":"198.00","element":"Impact","radius":6}},"speed":1.08,"crit_chance":28,"crit_mult":2.4,"status_chance":28,"damage":{"Impact":9.9,"Slash":178.2,"Puncture":9.9}},{"name":"Slam","radius":6,"type":"s","isHeavy":false,"speed":1,"crit_chance":28,"crit_mult":2.4,"status_chance":28,"unique":{"force_procs":["impact"]},"damage":{"Impact":396}},{"name":"Heavy Slam","radius":7,"type":"hs","isHeavy":true,"speed":1,"crit_chance":28,"crit_mult":2.4,"status_chance":28,"damage":{"Blast":594}}],"name":"Nikana Prime","imageName":"nikana-prime.webp","tags":["Prime","Vaulted"],"compTags":["NIKANAS_STANCE"]},
  "Nami Skyla":{"masteryReq":2,"description":"Like the surge and crash of storm waves, a master of the Nami cutlass and Skyla dagger turns these two separate weapons into one fluid attack.","blockingAngle":60,"comboDuration":5,"followThrough":0.5,"range":2.5,"windUp":0.7,"releaseDate":"2014-04-09","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"250","slam":{"damage":"250.00","radial":{"damage":"125.00","radius":8}},"speed":0.917,"crit_chance":10,"crit_mult":1.5,"status_chance":15,"damage":{"Impact":18.75,"Slash":87.5,"Puncture":18.75}},{"name":"Slam","radius":8,"type":"s","isHeavy":false,"speed":1,"crit_chance":10,"crit_mult":1.5,"status_chance":15,"unique":{"force_procs":["impact"]},"damage":{"Impact":250}},{"name":"Heavy Slam","radius":9,"type":"hs","isHeavy":true,"speed":1,"crit_chance":10,"crit_mult":1.5,"status_chance":15,"damage":{"Blast":375}}],"name":"Nami Skyla","imageName":"nami-skyla.webp","tags":["Tenno"],"compTags":["DUAL_SWORDS_STANCE"]},
  "Nataruk":{"masteryReq":0,"description":"Hunhow’s gift, carved from the bones of his kin. Shots can be charged and held; release them just before full charge for maximum effect.","noise":"Alarming","releaseDate":"2021-12-15","ammoCapacity":"Infinity","productCategory":"LongGuns","equipTime":1.1,"zoomProps":[[]],"category":"Primary","trigger":"Charge","type":"Rifle","magazineSize":1,"reloadTime":0.6,"multishot":1,"attacks":[{"name":"Quick Shot","speed":0.667,"crit_chance":20,"crit_mult":1.8,"status_chance":30,"shot_type":"Projectile","shot_speed":140,"flight":140,"unique":{"force_procs":["impact"]},"damage":{"Slash":45,"Puncture":405}},{"name":"Charged Shot","isCoMult":true,"speed":0.667,"crit_chance":50,"crit_mult":2.2,"status_chance":50,"shot_type":"Projectile","shot_speed":70,"flight":70,"damage":{"Slash":252,"Puncture":648},"no_headshot_mult":true,"charge_time":1},{"name":"Perfect Shot","isCoMult":true,"speed":0.667,"crit_chance":60,"crit_mult":2.4,"status_chance":50,"shot_type":"Projectile","shot_speed":70,"flight":70,"damage":{"Slash":252,"Puncture":648},"no_headshot_mult":true,"charge_time":1}],"name":"Nataruk","imageName":"nataruk.webp","tags":["Sentient"],"compTags":["PROJECTILE","OMICRUS","BATTERY"]},
  "Nikana":{"masteryReq":4,"description":"The Nikana reintroduces a lost Tenno blade and with it another fragment of the old ways.","blockingAngle":55,"comboDuration":5,"followThrough":0.7,"range":2.5,"windUp":0.5,"releaseDate":"2014-04-09","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","slide":"284","slam":{"damage":"426.00","radial":{"damage":"142.00","radius":6}},"speed":0.917,"crit_chance":16,"crit_mult":2,"status_chance":16,"damage":{"Impact":7.1,"Slash":120.7,"Puncture":14.2}},{"name":"Slam","radius":6,"type":"s","isHeavy":false,"speed":1,"crit_chance":16,"crit_mult":2,"status_chance":16,"unique":{"force_procs":["impact"]},"damage":{"Impact":284}},{"name":"Heavy Slam","radius":7,"type":"hs","isHeavy":true,"speed":1,"crit_chance":16,"crit_mult":2,"status_chance":16,"damage":{"Blast":426}}],"name":"Nikana","imageName":"nikana.webp","tags":["Tenno"],"compTags":["NIKANAS_STANCE"]},
  "Nami Solo":{"masteryReq":6,"description":"Evoking the oceans of earth, this exquisite cutlass is a deadly work of art.","blockingAngle":55,"comboDuration":5,"followThrough":0.7,"range":2.5,"windUp":0.7,"releaseDate":"2014-05-28","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"344","slam":{"damage":"516.00","radial":{"damage":"172.00","radius":8}},"speed":1,"crit_chance":15,"crit_mult":2,"status_chance":25,"damage":{"Impact":25.8,"Slash":120.4,"Puncture":25.8}},{"name":"Slam","radius":8,"type":"s","isHeavy":false,"speed":1,"crit_chance":15,"crit_mult":2,"status_chance":25,"unique":{"force_procs":["impact"]},"damage":{"Impact":344}},{"name":"Heavy Slam","radius":9,"type":"hs","isHeavy":true,"speed":1,"crit_chance":15,"crit_mult":2,"status_chance":25,"damage":{"Blast":516}}],"name":"Nami Solo","imageName":"nami-solo.webp","tags":["Tenno","Incarnon"],"compTags":["MACHETES_STANCE"]},
  "Neutralizer  (Cyte-09)":{"masteryReq":0,"description":"Cyte-09 exalted Sniper Rifle. Bullets ricochet off Weak Points to seek out other nearby Weak Points. Alt fire lobs a grenade that completely freezes enemies with a ❄Cold Status Effect, leaving a freezing zone that continues to apply ❄Cold Status for a duration.","noise":"Alarming","releaseDate":"2024-12-13","productCategory":"LongGuns","category":"Primary","trigger":"Semi","type":"Dual Pistols","magazineSize":12,"reloadTime":2.3,"multishot":1,"attacks":[{"name":"Normal Attack no-zoom","punch_through":2.5,"speed":1,"crit_chance":45,"crit_mult":3,"status_chance":10,"damage":{"Impact":12.75,"Slash":25.5,"Puncture":216.75}},{"name":"Normal Attack 2.5x","punch_through":2.5,"speed":1,"crit_chance":45,"crit_mult":3,"status_chance":10,"unique":{"crit_mult":0.4},"damage":{"Impact":12.75,"Slash":25.5,"Puncture":216.75}},{"name":"Normal Attack 4x","punch_through":2.5,"sniperCombo":true,"speed":1,"crit_chance":45,"crit_mult":3,"status_chance":10,"unique":{"crit_mult":0.6},"damage":{"Impact":12.75,"Slash":25.5,"Puncture":216.75}},{"name":"Normal Attack 8x","punch_through":2.5,"sniperCombo":true,"speed":1,"crit_chance":45,"crit_mult":3,"status_chance":10,"unique":{"crit_mult":0.8},"damage":{"Impact":12.75,"Slash":25.5,"Puncture":216.75}}],"name":"Neutralizer  (Cyte-09)","imageName":"Neutralizer.webp","tags":[],"compTags":["POWER_WEAPON"]},
  "Ninkondi Prime":{"masteryReq":14,"description":"An ancient weapon imbued with a new truth.","blockingAngle":55,"comboDuration":5,"followThrough":0.5,"range":2.307992,"windUp":0.5,"releaseDate":"2019-07-07","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"468","slam":{"damage":"468.00","radial":{"damage":"234.00","element":"Electricity","radius":6}},"speed":1,"crit_chance":22,"crit_mult":2.4,"status_chance":36,"damage":{"Impact":66,"Slash":50,"Puncture":28,"Electricity":90}},{"name":"Slam","radius":6,"type":"s","isHeavy":false,"speed":1,"crit_chance":22,"crit_mult":2.4,"status_chance":36,"unique":{"force_procs":["impact"]},"damage":{"Electricity":468}},{"name":"Heavy Slam","radius":7,"type":"hs","isHeavy":true,"speed":1,"crit_chance":22,"crit_mult":2.4,"status_chance":36,"damage":{"Electricity":702}}],"name":"Ninkondi Prime","imageName":"ninkondi-prime.webp","tags":["Tenno"],"compTags":["NUNCHAKU_STANCE"]},
  "Noctua (Dante)":{"masteryReq":0,"description":"Open Noctua, Dante's Exalted Tome, and unleash a tale of woe upon his enemies.","noise":"Alarming","releaseDate":"2024-03-27","productCategory":"Pistols","category":"Secondary","type":"Secondary","magazineSize":9999999,"reloadTime":0,"multishot":1,"attacks":[{"name":"Normal Attack","speed":1.5,"crit_chance":30,"crit_mult":2,"status_chance":25,"shot_type":"Projectile","damage":{"Slash":250}},{"name":"Alt-Fire","punch_through":1.4,"speed":1,"crit_chance":45,"crit_mult":3,"status_chance":45,"shot_type":"Projectile","damage":{"Impact":1100,"Radiation":1650}}],"name":"Noctua (Dante)","imageName":"noctua.webp","tags":[],"compTags":["POWER_WEAPON"]},
  "Ninkondi":{"masteryReq":8,"description":"With its lightning-fast strikes, the Ninkondi pays respect to the old ways.","blockingAngle":55,"comboDuration":5,"followThrough":0.5,"range":2.307992,"windUp":0.5,"releaseDate":"2015-09-09","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"380","slam":{"damage":"380.00","radial":{"damage":"190.00","radius":6}},"speed":1,"crit_chance":10,"crit_mult":2,"status_chance":35,"damage":{"Impact":90,"Electricity":100}},{"name":"Slam","radius":6,"type":"s","isHeavy":false,"speed":1,"crit_chance":10,"crit_mult":2,"status_chance":35,"unique":{"force_procs":["impact"]},"damage":{"Electricity":380}},{"name":"Heavy Slam","radius":7,"type":"hs","isHeavy":true,"speed":1,"crit_chance":10,"crit_mult":2,"status_chance":35,"damage":{"Electricity":570}}],"name":"Ninkondi","imageName":"ninkondi.webp","tags":["Tenno"],"compTags":["NUNCHAKU_STANCE"]},
  "Nukor":{"masteryReq":4,"description":"Creates and focuses a high-frequency field of microwaves, literally cooking the target from within.","noise":"Alarming","releaseDate":"2014-08-28","ammoCapacity":210,"productCategory":"Pistols","equipTime":1.1,"zoomProps":[[]],"category":"Secondary","trigger":"Held","type":"Pistol","magazineSize":50,"reloadTime":2,"multishot":1,"attacks":[{"name":"Normal Attack","speed":10,"crit_chance":3,"crit_mult":4,"status_chance":29,"shot_type":"Hit-Scan","damage":{"Radiation":22}}],"name":"Nukor","imageName":"nukor.webp","tags":["Grineer"],"compTags":["BEAM"]},
  "Ohma":{"masteryReq":8,"description":"Bring the enemy to its knees with these twin electrified tonfas.","blockingAngle":60,"comboDuration":5,"followThrough":0.6,"range":2.5,"windUp":0.7,"releaseDate":"2017-01-18","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slam":{"damage":"448.00","radial":{"damage":"224.00","radius":8}},"speed":0.917,"crit_chance":15,"crit_mult":2,"status_chance":30,"damage":{"Impact":76,"Slash":38,"Electricity":110}},{"name":"Slam","radius":8,"type":"s","isHeavy":false,"speed":1,"crit_chance":15,"crit_mult":2,"status_chance":30,"unique":{"force_procs":["impact"]},"damage":{"Electricity":448}},{"name":"Heavy Slam","radius":9,"type":"hs","isHeavy":true,"speed":1,"crit_chance":15,"crit_mult":2,"status_chance":30,"damage":{"Electricity":672}}],"name":"Ohma","imageName":"ohma.webp","tags":["Corpus"],"compTags":["TONFA_STANCE"]},
  "Obex":{"masteryReq":4,"description":"The Obex system multiplies the kinetic energy of a Tenno's kicks and punches, delivering devastating blows to any target.","blockingAngle":50,"comboDuration":5,"followThrough":0.9,"range":1.25,"windUp":0.5,"releaseDate":"2013-11-06","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":1,"crit_chance":25,"crit_mult":2,"status_chance":10,"damage":{"Impact":84,"Slash":18,"Puncture":18}},{"name":"Slam","radius":7,"type":"s","isHeavy":false,"speed":1,"crit_chance":25,"crit_mult":2,"status_chance":10,"unique":{"force_procs":["impact"]},"damage":{"Electricity":240}},{"name":"Heavy Slam","radius":8,"type":"hs","isHeavy":true,"speed":1,"crit_chance":25,"crit_mult":2,"status_chance":10,"damage":{"Electricity":360}}],"name":"Obex","imageName":"obex.webp","tags":["Corpus","Incarnon"],"compTags":["SPARRING_STANCE"]},
  "Ocucor":{"masteryReq":8,"description":"A weapon that reaches for its next victim even as it kills. With each takedown, this pistol spawns an energy tendril that reaches for a nearby target.","noise":"Alarming","releaseDate":"2018-11-08","ammoCapacity":300,"productCategory":"Pistols","zoomProps":[[]],"category":"Secondary","trigger":"Held","type":"Pistol","magazineSize":60,"reloadTime":1.6,"multishot":1,"attacks":[{"name":"Normal Attack","isBeam":true,"speed":12,"crit_chance":16,"crit_mult":1.8,"status_chance":24,"shot_type":"Discharge","damage":{"Puncture":1,"Radiation":10}}],"name":"Ocucor","imageName":"ocucor.webp","tags":["Corpus"],"compTags":["PROJECTILE","BEAM","OCUCOR"]},
  "Ogris":{"masteryReq":9,"description":"Ogris fires detonite-infused casings.","noise":"Alarming","releaseDate":"2013-05-23","ammoCapacity":20,"productCategory":"LongGuns","category":"Primary","trigger":"Charge","type":"Rifle","magazineSize":5,"reloadTime":2.5,"multishot":1,"attacks":[{"name":"Rocket Impact","speed":1.5,"crit_chance":5,"crit_mult":2,"status_chance":35,"shot_type":"Projectile","shot_speed":40,"flight":40,"damage":{"Blast":100},"charge_time":0.3},{"name":"Rocket Explosion","speed":1.5,"crit_chance":5,"crit_mult":2,"status_chance":35,"shot_type":"AoE","damage":{"Blast":600},"falloff":{"start":0,"end":7.1,"reduction":0.8},"no_headshot_mult":true}],"name":"Ogris","imageName":"ogris.webp","tags":["Grineer"],"compTags":["PROJECTILE","SNIPER_AMMO","AOE","SINGLESHOT","OGRIS"],"comb":[[0,1]]},
  "Okina":{"masteryReq":5,"description":"Perforate enemies with these two needle-sharp sai.","blockingAngle":50,"comboDuration":5,"followThrough":0.8,"range":1.7,"windUp":0.5,"releaseDate":"2016-07-08","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"280","slam":{"damage":"280.00","radial":{"damage":"140.00","radius":6}},"speed":1.08,"crit_chance":16,"crit_mult":2,"status_chance":20,"damage":{"Impact":7,"Slash":70,"Puncture":63}},{"name":"Slam","radius":6,"type":"s","isHeavy":false,"speed":1,"crit_chance":16,"crit_mult":2,"status_chance":20,"unique":{"force_procs":["impact"]},"damage":{"Impact":280}},{"name":"Heavy Slam","radius":7,"type":"hs","isHeavy":true,"speed":1,"crit_chance":16,"crit_mult":2,"status_chance":20,"damage":{"Blast":420}}],"name":"Okina","imageName":"okina.webp","tags":["Tenno","Incarnon"],"compTags":["DUAL_DAGGERS_STANCE"]},
  "Okina Prime":{"masteryReq":5,"description":"Enforce authority with these fine-edged blades.","blockingAngle":50,"comboDuration":5,"followThrough":0.8,"range":1.7,"windUp":0.5,"releaseDate":"2024-05-01","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":1.17,"crit_chance":30,"crit_mult":2.6,"status_chance":24,"damage":{"Impact":9.2,"Slash":110.4,"Puncture":64.4}},{"name":"Slam","radius":6,"type":"s","isHeavy":false,"speed":1,"crit_chance":30,"crit_mult":2.6,"status_chance":24,"unique":{"force_procs":["impact"]},"damage":{"Impact":368}},{"name":"Heavy Slam","radius":7,"type":"hs","isHeavy":true,"speed":1,"crit_chance":30,"crit_mult":2.6,"status_chance":24,"damage":{"Blast":552}}],"name":"Okina Prime","imageName":"OkinaPrime.webp","tags":["Tenno","Incarnon"],"compTags":["DUAL_DAGGERS_STANCE"]},
  "Orthos Prime":{"masteryReq":12,"description":"Orthos Prime is an ancient Orokin martial weapon, forged from the purest Rubedo making it extremely light-weight.","blockingAngle":55,"comboDuration":5,"followThrough":0.6,"range":3,"windUp":0.9,"releaseDate":"2013-07-13","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"468","slam":{"damage":"702.00","radial":{"damage":"234.00","element":"Blast","radius":7}},"speed":1.17,"crit_chance":24,"crit_mult":2.2,"status_chance":36,"damage":{"Impact":35.1,"Slash":163.8,"Puncture":35.1}},{"name":"Slam","radius":7,"type":"s","isHeavy":false,"speed":1,"crit_chance":24,"crit_mult":2.2,"status_chance":36,"unique":{"force_procs":["impact"]},"damage":{"Blast":468}},{"name":"Heavy Slam","radius":8,"type":"hs","isHeavy":true,"speed":1,"crit_chance":24,"crit_mult":2.2,"status_chance":36,"damage":{"Blast":702}}],"name":"Orthos Prime","imageName":"orthos-prime.webp","tags":["Prime","Never Vaulted"],"compTags":["POLEARMS_STANCE"]},
  "Onos":{"masteryReq":14,"description":"Albrecht's Void experiments revealed the true destructive potential of this wrist-mounted cannon. In Incarnon Form, it emits a beam that gradually focuses as it siphons energy from foes, culminating in a final blast.","noise":"Alarming","releaseDate":"2024-03-27","ammoCapacity":210,"productCategory":"Pistols","zoomProps":[[]],"category":"Secondary","type":"Pistol","magazineSize":20,"reloadTime":2,"multishot":1,"attacks":[{"name":"Normal Attack","isCoMult":true,"speed":1.4,"crit_chance":26,"crit_mult":2.4,"status_chance":22,"shot_type":"Projectile","shot_speed":100,"damage":{"Puncture":220}},{"name":"Incarnon Form","isCoMult":true,"isInc":1,"punch_through":5,"speed":2,"crit_chance":14,"crit_mult":1.6,"status_chance":18,"shot_type":"Projectile","shot_speed":40,"damage":{"Radiation":30}},{"name":"Incarnon Mode Charge Attack","ammoCost":50,"isInc":1,"speed":0.25,"crit_chance":38,"crit_mult":3.2,"status_chance":22,"shot_type":"Hit-Scan","unique":{"force_procs":["heat"]},"damage":{"Heat":2200}},{"name":"Incarnon Mode Charge Radial Attack","isInc":1,"speed":0.25,"crit_chance":38,"crit_mult":3.2,"status_chance":22,"shot_type":"AoE","unique":{"force_procs":["heat"]},"damage":{"Radiation":1100},"no_headshot_mult":true}],"incMagazineSize":350,"name":"Onos","imageName":"onos.webp","tags":["Incarnon"],"compTags":["PROJECTILE","AOE"],"comb":[[2,3]]},
  "Orthos":{"masteryReq":2,"description":"The Tenno forged Orthos is a rare double bladed polearm. Those who take the time to master it speak of its impressive striking distance and ability to hit multiple targets.","blockingAngle":55,"comboDuration":5,"followThrough":0.6,"range":3,"windUp":0.9,"releaseDate":"2013-06-07","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"370","slam":{"damage":"555.00","radial":{"damage":"185.00","radius":7}},"speed":0.917,"crit_chance":6,"crit_mult":1.5,"status_chance":18,"damage":{"Impact":27.75,"Slash":129.5,"Puncture":27.75}},{"name":"Slam","radius":7,"type":"s","isHeavy":false,"speed":1,"crit_chance":6,"crit_mult":1.5,"status_chance":18,"unique":{"force_procs":["impact"]},"damage":{"Blast":370}},{"name":"Heavy Slam","radius":8,"type":"hs","isHeavy":true,"speed":1,"crit_chance":6,"crit_mult":1.5,"status_chance":18,"damage":{"Blast":555}}],"name":"Orthos","imageName":"orthos.webp","tags":["Tenno"],"compTags":["POLEARMS_STANCE"]},
  "Orvius":{"masteryReq":5,"description":"Turn foes into puppets with Teshin’s versatile throwing disc.","blockingAngle":55,"comboDuration":5,"followThrough":0.7,"range":1.3,"windUp":1.2,"releaseDate":"2016-11-11","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"390","slam":{"damage":"585.00","radial":{"damage":"195.00","element":"Impact","radius":5}},"isHeavy":false,"speed":0.75,"crit_chance":18,"crit_mult":2,"status_chance":18,"damage":{"Impact":39,"Slash":146.25,"Puncture":9.75}},{"name":"Throw","isHeavy":false,"speed":0.75,"crit_chance":20,"crit_mult":2.2,"status_chance":20,"shot_type":"Thrown","shot_speed":35,"flight":35,"damage":{"Impact":43,"Slash":161.25,"Puncture":10.75}},{"name":"Throw Bounce Explosion","isHeavy":false,"speed":0.75,"crit_chance":20,"crit_mult":2.2,"status_chance":20,"shot_type":"AoE","damage":{"Blast":293},"falloff":{"start":0,"end":4,"reduction":0.4},"no_headshot_mult":true},{"name":"Throw Recall Explosion","isHeavy":true,"speed":0.75,"crit_chance":20,"crit_mult":2.2,"status_chance":20,"shot_type":"AoE","unique":{"force_procs":["cold"]},"damage":{"Blast":586},"falloff":{"start":0,"end":4,"reduction":0},"no_headshot_mult":true},{"name":"Charged Throw","isHeavy":false,"speed":0.833,"crit_chance":22,"crit_mult":2.4,"status_chance":22,"shot_type":"Thrown","shot_speed":35,"flight":35,"unique":{"force_procs":["impact"]},"damage":{"Impact":85.75,"Slash":321.75,"Puncture":21.5},"charge_time":1.2},{"name":"Charged Throw Bounce Explosion","isHeavy":false,"speed":0.833,"crit_chance":22,"crit_mult":2.4,"status_chance":22,"shot_type":"AoE","damage":{"Cold":585},"falloff":{"start":0,"end":4,"reduction":0.4},"no_headshot_mult":true,"charge_time":1.2},{"name":"Charged Throw Recall Explosion","isHeavy":true,"speed":0.833,"crit_chance":22,"crit_mult":2.4,"status_chance":22,"shot_type":"AoE","unique":{"force_procs":["cold"]},"damage":{"Cold":1170},"falloff":{"start":0,"end":4,"reduction":0},"no_headshot_mult":true,"charge_time":1.2},{"name":"Hover Attack","speed":0.75,"crit_chance":20,"crit_mult":2.2,"status_chance":60,"damage":{"Cold":75}},{"name":"Slam","radius":5,"type":"s","isHeavy":false,"speed":1,"crit_chance":18,"crit_mult":2,"status_chance":18,"unique":{"force_procs":["impact"]},"damage":{"Impact":390}},{"name":"Heavy Slam","radius":6,"type":"hs","isHeavy":true,"speed":1,"crit_chance":18,"crit_mult":2,"status_chance":18,"damage":{"Blast":585}}],"name":"Orvius","imageName":"orvius.webp","tags":[],"compTags":["GLAIVES_STANCE"],"comb":[[1,2],[4,5]]},
  "Opticor Vandal":{"masteryReq":14,"description":"With a precision crafted lens, this customized Opticor achieves a level of performance previously thought impossible.","noise":"Alarming","releaseDate":"2019-03-08","ammoCapacity":200,"productCategory":"LongGuns","category":"Primary","trigger":"Charge","type":"Rifle","magazineSize":8,"reloadTime":1.4,"multishot":1,"attacks":[{"name":"Charged Shot","punch_through":1,"speed":2,"crit_chance":24,"crit_mult":2.6,"status_chance":30,"shot_type":"Hit-Scan","damage":{"Impact":40,"Slash":80,"Puncture":280},"charge_time":0.6},{"name":"Charged Shot AoE","speed":2,"crit_chance":24,"crit_mult":2.6,"status_chance":30,"damage":{"Magnetic":200},"falloff":{"start":0,"end":4.6,"reduction":0.6},"charge_time":0.6},{"name":"Quick Shot","speed":2,"crit_chance":24,"crit_mult":2.6,"status_chance":30,"shot_type":"Hit-Scan","damage":{"Impact":20,"Slash":40,"Puncture":140}},{"name":"Quick Shot AoE","speed":2,"crit_chance":24,"crit_mult":2.6,"status_chance":30,"shot_type":"AoE","damage":{"Magnetic":100},"falloff":{"start":0,"end":4.6,"reduction":0.6},"no_headshot_mult":true}],"name":"Opticor Vandal","imageName":"opticor-vandal.webp","tags":["Corpus","Vandal"],"compTags":["ASSAULT_AMMO","AOE","SINGLESHOT"],"comb":[[0,1],[2,3]]},
  "Ooltha (Staff)":{"masteryReq":0,"description":"","comboDuration":5,"range":1,"windUp":1,"releaseDate":"2017-10-12","productCategory":"Melee","category":"Melee","type":"Zaw Component","multishot":1,"attacks":[{"name":"Ooltha Strike","speed":0.92,"crit_chance":18,"crit_mult":2,"status_chance":18,"damage":{"Impact":22.4,"Slash":112,"Puncture":89.6}}],"name":"Ooltha (Staff)","imageName":"ooltha.webp","tags":[],"compTags":["STAVES_STANCE"]},
  "Ooltha (Sword)":{"masteryReq":0,"description":"","comboDuration":5,"range":1,"windUp":1,"releaseDate":"2017-10-12","productCategory":"Melee","category":"Melee","type":"Zaw Component","multishot":1,"attacks":[{"name":"Ooltha Strike","speed":0.92,"crit_chance":18,"crit_mult":2,"status_chance":18,"damage":{"Impact":22.4,"Slash":112,"Puncture":89.6}}],"name":"Ooltha (Sword)","imageName":"ooltha.webp","tags":[],"compTags":["SWORDS_STANCE"]},
  "Pandero":{"masteryReq":8,"description":"Octavia's pistol hammers foes with single shots or a rapid volley of bullets. When wielded by Octavia, alt-fire Headshot Kills increase Reload Speed.","noise":"Alarming","releaseDate":"2017-03-24","productCategory":"Pistols","category":"Secondary","trigger":"Semi","type":"Pistol","magazineSize":8,"reloadTime":1,"multishot":1,"attacks":[{"name":"Normal Attack","speed":3,"crit_chance":30,"crit_mult":2.8,"status_chance":10,"shot_type":"Hit-Scan","damage":{"Impact":18,"Slash":36,"Puncture":18}},{"name":"Alt-Fire","speed":7.69,"crit_chance":30,"crit_mult":2.8,"status_chance":10,"shot_type":"Hit-Scan","damage":{"Impact":18,"Slash":36,"Puncture":18}}],"name":"Pandero","imageName":"pandero.webp","tags":["Tenno"],"compTags":[]},
  "Opticor":{"masteryReq":14,"description":"Once charged this Corpus laser cannon dispatches a devastating blast of light energy.","noise":"Alarming","releaseDate":"2014-10-24","ammoCapacity":200,"productCategory":"LongGuns","category":"Primary","trigger":"Charge","type":"Rifle","magazineSize":5,"reloadTime":2,"multishot":1,"attacks":[{"name":"Charged Shot","punch_through":1,"speed":1,"crit_chance":20,"crit_mult":2.5,"status_chance":20,"shot_type":"Hit-Scan","damage":{"Impact":100,"Slash":50,"Puncture":850},"charge_time":2},{"name":"Charged Shot AoE","speed":1,"crit_chance":20,"crit_mult":2.5,"status_chance":20,"shot_type":"AoE","damage":{"Magnetic":400},"falloff":{"start":0,"end":6,"reduction":0.6},"no_headshot_mult":true,"charge_time":2},{"name":"Quick Shot","speed":1,"crit_chance":20,"crit_mult":2.5,"status_chance":20,"shot_type":"Hit-Scan","damage":{"Impact":50,"Slash":25,"Puncture":425}},{"name":"Quick Shot AoE","speed":1,"crit_chance":20,"crit_mult":2.5,"status_chance":20,"shot_type":"AoE","damage":{"Magnetic":200},"falloff":{"start":0,"end":6,"reduction":0.6},"no_headshot_mult":true}],"name":"Opticor","imageName":"opticor.webp","tags":["Corpus"],"compTags":["ASSAULT_AMMO","AOE","SINGLESHOT"],"comb":[[0,1],[2,3]]},
  "Pandero Prime":{"masteryReq":14,"description":"Pound the beat for a dance of death with Octavia's signature prime pistol.","noise":"Alarming","releaseDate":"2021-02-23","productCategory":"Pistols","category":"Secondary","trigger":"Semi","type":"Pistol","magazineSize":8,"reloadTime":1,"multishot":1,"attacks":[{"name":"Normal Attack","speed":3,"crit_chance":30,"crit_mult":2.8,"status_chance":24,"shot_type":"Hit-Scan","damage":{"Impact":26,"Slash":52,"Puncture":26}},{"name":"Alt-Fire","speed":7.69,"crit_chance":30,"crit_mult":2.8,"status_chance":24,"damage":{"Impact":26,"Slash":52,"Puncture":26}}],"name":"Pandero Prime","imageName":"pandero-prime.webp","tags":["Prime"],"compTags":[]},
  "Pangolin Prime":{"masteryReq":14,"description":"A classic Tenno blade, beautifully reimagined.","blockingAngle":50,"comboDuration":5,"followThrough":0.6,"range":2.5,"windUp":0.6,"releaseDate":"2020-03-31","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"248","slam":{"damage":"744.00","radial":{"damage":"248.00","element":"Impact","radius":8}},"speed":0.917,"crit_chance":26,"crit_mult":2.2,"status_chance":30,"damage":{"Impact":12.4,"Slash":198.4,"Puncture":37.2}},{"name":"Slam","radius":8,"type":"s","isHeavy":false,"speed":1,"crit_chance":26,"crit_mult":2.2,"status_chance":30,"unique":{"force_procs":["slash","impact"]},"damage":{"Impact":496}},{"name":"Heavy Slam","radius":8,"type":"hs","isHeavy":true,"speed":1,"crit_chance":26,"crit_mult":2.2,"status_chance":30,"damage":{"Blast":744}}],"name":"Pangolin Prime","imageName":"pangolin-prime.webp","tags":["Prime","Tenno"],"compTags":["SWORDS_STANCE"]},
  "Pangolin Sword":{"masteryReq":3,"description":"A unique blade used by an old Tenno clan.","blockingAngle":55,"comboDuration":5,"followThrough":0.6,"range":2.5,"windUp":0.6,"releaseDate":"2012-12-18","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":0.917,"crit_chance":8,"crit_mult":1.5,"status_chance":22,"damage":{"Impact":7.5,"Slash":120,"Puncture":22.5}},{"name":"Slam","radius":7,"type":"s","isHeavy":false,"speed":1,"crit_chance":8,"crit_mult":1.5,"status_chance":22,"unique":{"force_procs":["slash","impact"]},"damage":{"Puncture":300}},{"name":"Heavy Slam","radius":8,"type":"hs","isHeavy":true,"speed":1,"crit_chance":8,"crit_mult":1.5,"status_chance":22,"damage":{"Blast":450}}],"name":"Pangolin Sword","imageName":"pangolin-sword.webp","tags":["Tenno"],"compTags":["SWORDS_STANCE"]},
  "Panthera":{"masteryReq":7,"description":"Firing high-velocity blades, this weapon can also be used as a battle-saw, shredding anything unfortunate enough to get within range.","noise":"Alarming","releaseDate":"2015-01-15","ammoCapacity":540,"productCategory":"LongGuns","category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":30,"reloadTime":2,"multishot":1,"attacks":[{"name":"Normal Attack","ammoCost":2,"speed":3,"crit_chance":12,"crit_mult":2,"status_chance":24,"shot_type":"Projectile","shot_speed":60,"flight":60,"damage":{"Impact":20,"Slash":70,"Puncture":10}},{"name":"Alt-Fire","isBeam":true,"speed":2,"crit_chance":25,"crit_mult":2,"status_chance":35,"shot_type":"Discharge","damage":{"Impact":10,"Slash":80,"Puncture":10}}],"name":"Panthera","imageName":"panthera.webp","tags":["Tenno"],"compTags":["PROJECTILE","ASSAULT_AMMO","BEAM"]},
  "Panthera Prime":{"masteryReq":14,"description":"The max-velocity saw-launcher perfected. Features a larger magazine, faster fire rate, and a radial, slashing ricochet.","noise":"Alarming","releaseDate":"2020-07-14","ammoCapacity":320,"productCategory":"LongGuns","zoomProps":[[]],"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":40,"reloadTime":2.4000001,"multishot":1,"attacks":[{"name":"Normal Attack","ammoCost":2,"speed":3.67,"crit_chance":18,"crit_mult":2,"status_chance":30,"shot_type":"Projectile","shot_speed":80,"flight":80,"damage":{"Impact":20,"Slash":70,"Puncture":10}},{"name":"Radial Attack","speed":3.67,"crit_chance":18,"crit_mult":2,"status_chance":30,"shot_type":"AoE","damage":{"Slash":20},"falloff":{"start":0,"end":1.6,"reduction":0.2},"no_headshot_mult":true},{"name":"Alt-Fire","isBeam":true,"speed":2,"crit_chance":26,"crit_mult":2,"status_chance":38,"shot_type":"Discharge","damage":{"Slash":100}}],"name":"Panthera Prime","imageName":"panthera-prime.webp","tags":["Prime"],"compTags":["PROJECTILE","ASSAULT_AMMO","BEAM"],"comb":[[0,1]]},
  "Paracesis":{"masteryReq":10,"description":"The Sentient slayer. An offering from Ballas.","blockingAngle":55,"comboDuration":5,"followThrough":0.6,"range":2.9,"windUp":1.1,"releaseDate":"2018-10-12","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"444","slam":{"damage":"666.00","radial":{"damage":"222.00","element":"Impact","radius":8}},"speed":0.917,"crit_chance":31,"crit_mult":2.6,"status_chance":22,"damage":{"Impact":48.8,"Slash":155.4,"Puncture":17.8}},{"name":"Slam","radius":8,"type":"s","isHeavy":false,"speed":1,"crit_chance":31,"crit_mult":2.6,"status_chance":22,"unique":{"force_procs":["impact"]},"damage":{"Impact":444}},{"name":"Heavy Slam","radius":9,"type":"hs","isHeavy":true,"speed":1,"crit_chance":31,"crit_mult":2.6,"status_chance":22,"damage":{"Blast":666}}],"name":"Paracesis","imageName":"paracesis.webp","tags":["Orokin"],"compTags":["HEAVY_BLADE_STANCE"]},
  "Paris Prime":{"masteryReq":8,"description":"Discovered deep inside an ancient Orokin derelict, the Paris Prime increases the kinetic energy of any bolt it fires, dealing more damage than its more common counterpart.","noise":"Silent","releaseDate":"2013-07-13","ammoCapacity":72,"productCategory":"LongGuns","equipTime":1.1,"category":"Primary","trigger":"Charge","type":"Rifle","magazineSize":1,"reloadTime":0.7,"multishot":1,"attacks":[{"name":"Uncharged Shot","speed":1,"crit_chance":45,"crit_mult":2,"status_chance":20,"shot_type":"Projectile","shot_speed":70,"flight":70,"damage":{"Impact":9,"Slash":18,"Puncture":153}},{"name":"Charged Shot","punch_through":3,"speed":1,"crit_chance":45,"crit_mult":2,"status_chance":20,"shot_type":"Projectile","shot_speed":95,"flight":95,"damage":{"Impact":9,"Slash":63,"Puncture":288},"charge_time":0.5},{"name":"Incarnon Form","isCoMult":true,"isInc":1,"speed":1,"crit_chance":50,"crit_mult":3.4,"status_chance":20,"damage":{"Impact":100,"Heat":420},"charge_time":0.8}],"incMagazineSize":20,"name":"Paris Prime","imageName":"paris-prime.webp","tags":["Prime","Never Vaulted","Incarnon"],"compTags":["PROJECTILE","PARIS_PRIME"]},
  "Paracyst":{"masteryReq":7,"description":"Completely overwhelmed by Infested biology, this former Quanta now fires organic ordnance and a harpoon like appendage.","noise":"Alarming","releaseDate":"2014-11-27","ammoCapacity":540,"productCategory":"LongGuns","equipTime":1.1,"category":"Primary","trigger":"Burst","type":"Rifle","magazineSize":60,"reloadTime":2,"multishot":1,"attacks":[{"name":"Normal Attack","speed":8.33,"crit_chance":10,"crit_mult":2,"status_chance":30,"shot_type":"Projectile","shot_speed":100,"flight":100,"damage":{"Toxin":33},"burst_count":3,"burst_delay":0.05},{"name":"Infested Harpoon","isCoMult":true,"speed":5,"crit_chance":0,"crit_mult":1,"status_chance":30,"shot_type":"Projectile","shot_speed":80,"flight":80,"damage":{"Toxin":15},"charge_time":0.3},{"name":"Infested Harpoon Contact","speed":1,"crit_chance":0,"crit_mult":1,"status_chance":30,"damage":{"Toxin":15}}],"name":"Paracyst","imageName":"paracyst.webp","tags":["Infested"],"compTags":["PROJECTILE","ASSAULT_AMMO"]},
  "Pennant":{"masteryReq":7,"description":"The steel flag of Old War Railjack crews, the Pennant was invaluable in repelling boarders. With each heavy attack kill the Pennant's speed of attack increases.","blockingAngle":55,"comboDuration":5,"followThrough":0.7,"range":3,"windUp":0.7,"releaseDate":"2019-12-13","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"400","slam":{"damage":"600.00","radial":{"damage":"200.00","element":"Impact","radius":7}},"speed":0.917,"crit_chance":32,"crit_mult":2.4,"status_chance":10,"damage":{"Impact":20,"Slash":40,"Puncture":140}},{"name":"Slam","radius":7,"type":"s","isHeavy":false,"speed":1,"crit_chance":32,"crit_mult":2.4,"status_chance":10,"unique":{"force_procs":["impact"]},"damage":{"Impact":400}},{"name":"Heavy Slam","radius":8,"type":"hs","isHeavy":true,"speed":1,"crit_chance":32,"crit_mult":2.4,"status_chance":10,"damage":{"Blast":600}}],"name":"Pennant","imageName":"pennant.webp","tags":["Tenno"],"compTags":["LONG_KATANA_STANCE"]},
  "Paris":{"masteryReq":3,"description":"Based on one of the world's oldest weapon designs, this Tenno-crafted weapon can be used both in stealth and in open combat. The Paris uses a chargeable magnetic field to launch arrows capable of impaling enemies to walls.","noise":"Silent","releaseDate":"2013-03-18","ammoCapacity":72,"productCategory":"LongGuns","equipTime":1.1,"category":"Primary","trigger":"Charge","type":"Rifle","magazineSize":1,"reloadTime":0.64999998,"multishot":1,"attacks":[{"name":"Uncharged Shot","speed":1,"crit_chance":30,"crit_mult":2,"status_chance":10,"shot_type":"Projectile","shot_speed":70,"flight":70,"damage":{"Impact":8,"Slash":32,"Puncture":120}},{"name":"Charged Shot","punch_through":2,"speed":1,"crit_chance":30,"crit_mult":2,"status_chance":10,"shot_type":"Projectile","shot_speed":85,"flight":85,"damage":{"Impact":16,"Slash":48,"Puncture":256},"charge_time":0.5},{"name":"Incarnon Form","isCoMult":true,"isInc":1,"speed":1,"crit_chance":40,"crit_mult":3,"status_chance":20,"shot_type":"Projectile","damage":{"Impact":95,"Heat":365},"charge_time":0.8}],"incMagazineSize":20,"name":"Paris","imageName":"paris.webp","tags":["Tenno","Incarnon"],"compTags":["PROJECTILE"]},
  "Pathocyst":{"masteryReq":9,"description":"Each strike of this infested glaive infects its target with viral pathogens. Occasionally, it discharges the spores of rabid, enemy-seeking maggots, either in-flight or on contact with the enemy.","blockingAngle":55,"comboDuration":5,"followThrough":0.7,"range":1.3,"windUp":1.2,"releaseDate":"2019-09-26","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"524","slam":{"damage":"786.00","radial":{"damage":"262.00","radius":5}},"isHeavy":false,"speed":0.667,"crit_chance":15,"crit_mult":2.1,"status_chance":30,"damage":{"Impact":57,"Slash":61,"Puncture":55,"Viral":89}},{"name":"Throw","isHeavy":false,"speed":0.667,"crit_chance":17,"crit_mult":2.3,"status_chance":33,"shot_type":"Thrown","shot_speed":30,"flight":30,"damage":{"Impact":49,"Slash":78,"Puncture":43,"Viral":118}},{"name":"Throw Bounce Explosion","isHeavy":false,"speed":0.667,"crit_chance":17,"crit_mult":2.3,"status_chance":33,"shot_type":"AoE","damage":{"Viral":393},"falloff":{"start":0,"end":4.9,"reduction":0.5},"no_headshot_mult":true},{"name":"Throw Recall Explosion","isHeavy":true,"speed":0.667,"crit_chance":17,"crit_mult":2.3,"status_chance":33,"shot_type":"AoE","unique":{"force_procs":["impact","viral"]},"damage":{"Viral":786},"falloff":{"start":0,"end":4.9,"reduction":0},"no_headshot_mult":true},{"name":"Charged Throw","isHeavy":false,"speed":0.833,"crit_chance":21,"crit_mult":2.5,"status_chance":35,"shot_type":"Thrown","shot_speed":30,"flight":30,"damage":{"Impact":127,"Slash":135,"Puncture":121,"Viral":193},"charge_time":1.2},{"name":"Charged Throw Bounce Explosion","isHeavy":false,"speed":0.833,"crit_chance":21,"crit_mult":2.5,"status_chance":35,"shot_type":"AoE","damage":{"Viral":786},"falloff":{"start":0,"end":4.9,"reduction":0.5},"no_headshot_mult":true,"charge_time":1.2},{"name":"Charged Throw Recall Explosion","isHeavy":true,"speed":0.833,"crit_chance":21,"crit_mult":2.5,"status_chance":35,"shot_type":"AoE","unique":{"force_procs":["impact","viral"]},"damage":{"Viral":1572},"falloff":{"start":0,"end":4.9,"reduction":0},"no_headshot_mult":true,"charge_time":1.2},{"name":"Slam","radius":5,"type":"s","isHeavy":false,"speed":1,"crit_chance":15,"crit_mult":2.1,"status_chance":30,"unique":{"force_procs":["impact"]},"damage":{"Viral":524}},{"name":"Heavy Slam","radius":6,"type":"hs","isHeavy":true,"speed":1,"crit_chance":15,"crit_mult":2.1,"status_chance":30,"damage":{"Viral":786}}],"name":"Pathocyst","imageName":"pathocyst.webp","tags":["Infested"],"compTags":["GLAIVES_STANCE"],"comb":[[1,2],[4,5]]},
  "Perigale":{"masteryReq":8,"description":"Like a breath of wind, shots fired by this multi-barrel sniper are felt but never seen by its targets. Headshots in quick succession increase the Perigale’s ammo efficiency. When the Perigale is wielded by Voruna, its ammo pool increases.","noise":"Alarming","releaseDate":"2022-11-30","ammoCapacity":24,"productCategory":"LongGuns","category":"Primary","trigger":"Burst","type":"Rifle","magazineSize":12,"reloadTime":3,"multishot":1,"attacks":[{"name":"Normal Attack","speed":2,"crit_chance":28,"crit_mult":2.6,"status_chance":16,"shot_type":"Hit-Scan","unique":{"WITH_COND":{"ammoEff":1}},"damage":{"Impact":20.64,"Slash":55,"Puncture":96.32},"falloff":{"start":300,"end":600,"reduction":0.2},"burst_count":4,"burst_delay":0.04},{"name":"2.0x Zoom","sniperCombo":true,"speed":2,"crit_chance":28,"crit_mult":2.6,"status_chance":16,"shot_type":"Hit-Scan","unique":{"WITH_COND":{"ammoEff":1},"crit_mult":0.2},"damage":{"Impact":20.64,"Slash":55,"Puncture":96.32},"burst_count":4,"burst_delay":0.04},{"name":"4.0x Zoom","sniperCombo":true,"speed":2,"crit_chance":28,"crit_mult":2.6,"status_chance":16,"shot_type":"Hit-Scan","unique":{"WITH_COND":{"ammoEff":1},"crit_mult":0.4},"damage":{"Impact":20.64,"Slash":55,"Puncture":96.32},"burst_count":4,"burst_delay":0.04}],"name":"Perigale","imageName":"perigale.webp","tags":["Tenno"],"compTags":["SNIPER_AMMO"]},
  "Phantasma":{"masteryReq":9,"description":"Irradiate enemies with a continuous stream of deadly plasma. Charging secondary fire releases a glob of plasma that erupts with homing bomblets on impact. Increased Magazine Capacity when wielded by Revenant.","noise":"Alarming","releaseDate":"2018-08-24","ammoCapacity":275,"productCategory":"LongGuns","zoomProps":[[]],"category":"Primary","trigger":"Held","type":"Shotgun","magazineSize":11,"reloadTime":0.5,"multishot":6,"attacks":[{"name":"Beam","isBeam":true,"speed":12,"crit_chance":3,"crit_mult":1.5,"status_chance":22.2,"shot_type":"Discharge","damage":{"Impact":5,"Radiation":10}},{"name":"Plasma Bomb Impact","ammoCost":2,"speed":2,"crit_chance":3,"crit_mult":1.5,"status_chance":37,"shot_type":"Projectile","shot_speed":25,"flight":25,"unique":{"force_procs":["impact"]},"damage":{"Impact":15},"charge_time":1},{"name":"Plasma Bomb Explosion","ammoCost":2,"speed":2,"crit_chance":3,"crit_mult":1.5,"status_chance":37,"shot_type":"AoE","unique":{"force_procs":["impact"]},"damage":{"Radiation":73},"falloff":{"start":0,"end":4.8,"reduction":0.5},"no_headshot_mult":true},{"name":"Cluster Bombs Impact","ammoCost":2,"isCoMult":true,"speed":2,"crit_chance":3,"crit_mult":1.5,"status_chance":37,"shot_type":"Projectile","shot_speed":6,"flight":6,"damage":{"Impact":3}},{"name":"Cluster Bombs Explosion","ammoCost":2,"speed":2,"crit_chance":3,"crit_mult":1.5,"status_chance":37,"shot_type":"AoE","unique":{"force_procs":["impact"]},"damage":{"Radiation":18},"no_headshot_mult":true}],"name":"Phantasma","imageName":"phantasma.webp","tags":["Sentient"],"compTags":["BEAM"],"comb":[[1,2],[3,4]]},
  "Phaedra (Arch-mode)":{"masteryReq":3,"description":"Devastate free-space enemies with Phaedra, the Soma's big-sister.","releaseDate":"2015-10-01","ammoCapacity":0,"productCategory":"Archguns","zoomProps":[[]],"category":"Archgun","type":"Archgun","magazineSize":240,"reloadTime":5.05,"multishot":1,"attacks":[{"name":"Normal Attack","speed":18.75,"crit_chance":14,"crit_mult":2,"status_chance":30,"shot_type":"Projectile","shot_speed":220,"damage":{"Impact":14,"Puncture":36.4,"Slash":5.6}}],"reloadRate":50,"reloadDelay":0.25,"name":"Phaedra (Arch-mode)","imageName":"Phaedra.webp","tags":[],"compTags":["BATTERY"]},
  "Perigale Prime":{"masteryReq":14,"description":"The one who exalted Voruna to her Prime form imbued her signature sniper rifle with increased magazine size and ammo capacity, as if to arm her for a long hunt..","noise":"Alarming","releaseDate":"2026-04-08","ammoCapacity":32,"productCategory":"LongGuns","category":"Primary","trigger":"Burst","type":"Rifle","magazineSize":16,"reloadTime":3,"multishot":1,"attacks":[{"name":"Normal Attack","punch_through":1,"speed":2,"crit_chance":32,"crit_mult":2.6,"status_chance":20,"shot_type":"Hit-Scan","unique":{"WITH_COND":{"ammoEff":1}},"damage":{"Impact":22.08,"Slash":58.88,"Puncture":103.04},"burst_count":4,"burst_delay":0.04},{"name":"2.0x Zoom","sniperCombo":true,"speed":2,"crit_chance":32,"crit_mult":2.6,"status_chance":20,"shot_type":"Hit-Scan","unique":{"WITH_COND":{"ammoEff":1},"crit_mult":0.2},"damage":{"Impact":22.08,"Slash":58.88,"Puncture":103.04},"burst_count":4,"burst_delay":0.04},{"name":"4.0x Zoom","sniperCombo":true,"speed":2,"crit_chance":32,"crit_mult":2.6,"status_chance":20,"shot_type":"Hit-Scan","unique":{"WITH_COND":{"ammoEff":1},"crit_mult":0.4},"damage":{"Impact":22.08,"Slash":58.88,"Puncture":103.04},"burst_count":4,"burst_delay":0.04}],"name":"Perigale Prime","imageName":"PerigalePrime.webp","tags":["Tenno"],"compTags":["SNIPER_AMMO"]},
  "Phage":{"masteryReq":11,"description":"Fires seven beams of continuous biochemical energy which depletes the life of any surface they contact.","noise":"Alarming","releaseDate":"2014-02-05","ammoCapacity":720,"productCategory":"LongGuns","zoomProps":[[]],"category":"Primary","trigger":"Held","type":"Shotgun","magazineSize":90,"reloadTime":2,"multishot":7,"attacks":[{"name":"Normal Attack","isBeam":true,"speed":12,"crit_chance":19,"crit_mult":2,"status_chance":15.5,"shot_type":"Discharge","damage":{"Viral":5}}],"name":"Phage","imageName":"phage.webp","tags":["Infested"],"compTags":["BEAM"]},
  "Plague Keewar (Scythe)":{"masteryReq":0,"description":"","comboDuration":5,"range":1,"windUp":1,"releaseDate":"2017-11-15","productCategory":"Melee","category":"Melee","type":"Zaw Component","multishot":1,"attacks":[{"name":"Plague Keewar Strike","speed":0.88,"crit_chance":18,"crit_mult":2,"status_chance":22,"damage":{"Impact":88,"Slash":91,"Puncture":57,"Viral":70}}],"name":"Plague Keewar (Scythe)","imageName":"PlagueKeewar.webp","tags":[],"compTags":["SCYTHES_STANCE"]},
  "Penta":{"masteryReq":6,"description":"The Penta Launcher fires up to five grenades that can be remotely triggered at just the right moment.","noise":"Alarming","releaseDate":"2013-12-12","ammoCapacity":20,"productCategory":"LongGuns","equipTime":0.4,"category":"Primary","trigger":"Active","type":"Rifle","magazineSize":5,"reloadTime":2.5,"multishot":1,"attacks":[{"name":"Grenade Impact","speed":1,"crit_chance":10,"crit_mult":2,"status_chance":10,"shot_type":"Projectile","shot_speed":20,"flight":20,"damage":{"Impact":75}},{"name":"Grenade Detonation","speed":1,"crit_chance":10,"crit_mult":2,"status_chance":10,"shot_type":"AoE","damage":{"Blast":350},"falloff":{"start":0,"end":4,"reduction":0.5},"no_headshot_mult":true}],"name":"Penta","imageName":"penta.webp","tags":["Corpus"],"compTags":["PROJECTILE","SNIPER_AMMO","AOE","SINGLESHOT","PENTA"],"comb":[[0,1]]},
  "Phantasma Prime":{"masteryReq":14,"description":"Phantasma Prime is burnished with deadly force. In Revenant’s hands, it has increased magazine capacity. The might of its irradiated plasma is reminiscent of the fearsome Eidolon.","noise":"Alarming","releaseDate":"2022-10-05","ammoCapacity":330,"productCategory":"LongGuns","zoomProps":[[]],"category":"Primary","trigger":"Held","type":"Shotgun","magazineSize":11,"reloadTime":0.5,"multishot":6,"attacks":[{"name":"Beam","isBeam":true,"speed":12,"crit_chance":11,"crit_mult":1.9,"status_chance":22.2,"shot_type":"Discharge","damage":{"Impact":5,"Radiation":10}},{"name":"Plasma Bomb Impact","ammoCost":2,"speed":2,"crit_chance":3,"crit_mult":1.5,"status_chance":37,"shot_type":"Projectile","shot_speed":25,"flight":25,"unique":{"force_procs":["impact"]},"damage":{"Impact":15},"charge_time":1},{"name":"Plasma Bomb Explosion","ammoCost":2,"speed":2,"crit_chance":3,"crit_mult":1.5,"status_chance":37,"shot_type":"AoE","unique":{"force_procs":["impact"]},"damage":{"Radiation":73},"falloff":{"start":0,"end":4.8,"reduction":0.5},"no_headshot_mult":true},{"name":"Cluster Bombs Impact","ammoCost":2,"isCoMult":true,"speed":2,"crit_chance":3,"crit_mult":1.5,"status_chance":37,"shot_type":"Projectile","shot_speed":6,"flight":6,"damage":{"Impact":3}},{"name":"Cluster Bombs Explosion","ammoCost":2,"speed":2,"crit_chance":3,"crit_mult":1.5,"status_chance":37,"shot_type":"AoE","unique":{"force_procs":["impact"]},"damage":{"Radiation":18},"no_headshot_mult":true}],"name":"Phantasma Prime","imageName":"phantasma-prime.webp","tags":["Prime","Sentient"],"compTags":["BEAM"],"comb":[[1,2],[3,4]]},
  "Phenmor":{"masteryReq":14,"description":"Zariman colonists originally intended to use the Phenmor in burial rites. In Orokin society, the higher the rank, the greater number of volleys for the deceased. Its stock is carved from Phenaureus Pine, a tree designed to release seedlings only onto scorched earth. In the hands of the Void, the Phenmor becomes darkly aggressive.","noise":"Alarming","releaseDate":"2022-04-27","ammoCapacity":540,"productCategory":"LongGuns","equipTime":1.1,"zoomProps":[[]],"category":"Primary","trigger":"Semi","type":"Rifle","magazineSize":30,"reloadTime":2.8,"multishot":1,"attacks":[{"name":"Normal Attack","speed":3,"crit_chance":20,"crit_mult":2,"status_chance":20,"shot_type":"Projectile","shot_speed":120,"flight":120,"damage":{"Slash":98,"Puncture":42}},{"name":"Incarnon Form","isInc":1,"punch_through":3,"speed":13.33,"crit_chance":20,"crit_mult":2,"status_chance":20,"shot_type":"Projectile","shot_speed":80,"flight":80,"damage":{"Slash":80,"Radiation":60}}],"incMagazineSize":408,"name":"Phenmor","imageName":"phenmor.webp","tags":["Zariman","Incarnon"],"compTags":["ASSAULT_AMMO","PROJECTILE"]},
  "Phaedra (Atmo-mode)":{"masteryReq":3,"description":"Devastate free-space enemies with Phaedra, the Soma's big-sister.","releaseDate":"2018-12-18","ammoCapacity":960,"productCategory":"Archguns","zoomProps":[[]],"category":"Archgun","type":"Archgun","magazineSize":240,"reloadTime":2,"multishot":1,"attacks":[{"name":"Normal Attack","punch_through":1.2,"speed":18.75,"crit_chance":14,"crit_mult":2,"status_chance":30,"shot_type":"Hit-Scan","damage":{"Impact":29,"Puncture":75.4,"Slash":11.6}}],"name":"Phaedra (Atmo-mode)","imageName":"Phaedra.webp","tags":[],"compTags":[]},
  "Plague Keewar (Staff)":{"masteryReq":0,"description":"","comboDuration":5,"range":1,"windUp":1,"releaseDate":"2017-11-15","productCategory":"Melee","category":"Melee","type":"Zaw Component","multishot":1,"attacks":[{"name":"Plague Keewar Strike","speed":0.88,"crit_chance":18,"crit_mult":2,"status_chance":22,"damage":{"Impact":88,"Slash":91,"Puncture":57,"Viral":70}}],"name":"Plague Keewar (Staff)","imageName":"PlagueKeewar.webp","tags":[],"compTags":["STAVES_STANCE"]},
  "Praedos":{"masteryReq":14,"description":"Orokin elites admired farmers in conquered regions, because they had learned to fight with modified farming tools despite being forbidden to own weapons. For their voyage, the Zariman were presented with Praedos in recognition of Zariman tenacity. The Void reinforces the strength of the spirited individual by fortifying the Praedos.","blockingAngle":60,"comboDuration":5,"followThrough":0.6,"range":2.5,"windUp":0.7,"releaseDate":"2022-04-27","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"400","slam":{"damage":"400.00","radial":{"damage":"200.00","radius":8}},"speed":1.17,"crit_chance":20,"crit_mult":2,"status_chance":20,"damage":{"Impact":20,"Slash":160,"Puncture":20}},{"name":"Slam","radius":8,"type":"s","isHeavy":false,"speed":1,"crit_chance":20,"crit_mult":2,"status_chance":20,"unique":{"force_procs":["impact"]},"damage":{"Impact":400}},{"name":"Heavy Slam","radius":9,"type":"hs","isHeavy":true,"speed":1,"crit_chance":20,"crit_mult":2,"status_chance":20,"damage":{"Blast":600}}],"name":"Praedos","imageName":"praedos.webp","tags":["Zariman","Incarnon"],"compTags":["TONFA_STANCE"]},
  "Prisma Angstrum":{"masteryReq":8,"description":"Imbued with the finest Prisma crystal, this refined Angstrum features boosted charge and reload speeds.","noise":"Alarming","releaseDate":"2017-09-09","ammoCapacity":18,"productCategory":"Pistols","category":"Secondary","trigger":"Charge","type":"Pistol","magazineSize":1,"reloadTime":1.8,"multishot":1,"attacks":[{"name":"Single Rocket Impact","speed":2,"crit_chance":18,"crit_mult":2.2,"status_chance":26,"shot_type":"Projectile","shot_speed":150,"flight":150,"damage":{"Blast":200},"charge_time":0.2},{"name":"Single Rocket Explosion","speed":2,"crit_chance":18,"crit_mult":2.2,"status_chance":26,"shot_type":"AoE","damage":{"Blast":250},"falloff":{"start":0,"end":3.6,"reduction":0.4},"no_headshot_mult":true,"charge_time":0.2},{"name":"Incarnon Form","isCoMult":true,"isInc":1,"speed":6,"crit_chance":26,"crit_mult":2.2,"status_chance":20,"shot_type":"Projectile","damage":{"Heat":50}}],"incMagazineSize":120,"name":"Prisma Angstrum","imageName":"prisma-angstrum.webp","tags":["Prisma","Baro","Incarnon"],"compTags":["PROJECTILE","AOE","SINGLESHOT"],"comb":[[0,1]]},
  "Plague Kripath (Rapier)":{"masteryReq":0,"description":"","comboDuration":5,"range":1,"windUp":1,"releaseDate":"2017-11-15","productCategory":"Melee","category":"Melee","type":"Zaw Component","multishot":1,"attacks":[{"name":"Plague Kripath Strike","speed":0.95,"crit_chance":22,"crit_mult":2.2,"status_chance":18,"damage":{"Impact":30,"Slash":49,"Puncture":70,"Viral":64}}],"name":"Plague Kripath (Rapier)","imageName":"PlagueKripath.webp","tags":[],"compTags":["RAPIER_STANCE"]},
  "Pride":{"masteryReq":14,"description":"The pride of one that knows their worth. Sirius' signature Heavy Scythe.","blockingAngle":65,"comboDuration":5,"followThrough":0.4,"range":2.8,"windUp":1,"releaseDate":"2026-06-17","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":1.2,"crit_chance":15,"crit_mult":2,"status_chance":35,"damage":{"Slash":125,"Puncture":125}},{"name":"Slam","radius":8,"type":"s","isHeavy":false,"speed":1,"crit_chance":15,"crit_mult":2,"status_chance":35,"unique":{"force_procs":["impact"],"WITH_COND":{"status_chance":1.5}},"damage":{"Impact":500}},{"name":"Heavy Slam","radius":9,"type":"hs","isHeavy":true,"speed":1,"crit_chance":15,"crit_mult":2,"status_chance":28,"unique":{"WITH_COND":{"status_chance":1.5}},"damage":{"Blast":750}}],"name":"Pride","imageName":"Pride.webp","tags":[],"compTags":["HEAVY SCYTHE_STANCE"]},
  "Plague Kripath (Polearm)":{"masteryReq":0,"description":"","comboDuration":5,"range":1,"windUp":1,"releaseDate":"2017-11-15","productCategory":"Melee","category":"Melee","type":"Zaw Component","multishot":1,"attacks":[{"name":"Plague Kripath Strike","speed":0.95,"crit_chance":22,"crit_mult":2.2,"status_chance":18,"damage":{"Impact":30,"Slash":49,"Puncture":70,"Viral":64}}],"name":"Plague Kripath (Polearm)","imageName":"PlagueKripath.webp","tags":[],"compTags":["POLEARMS_STANCE"]},
  "Prisma Dual Cleavers":{"masteryReq":9,"description":"Blades of energized prisma crystal make these ornamental cleavers cut as sharply as they look.","blockingAngle":60,"comboDuration":5,"followThrough":0.5,"range":1.7,"windUp":0.7,"releaseDate":"2015-07-10","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","slide":"266","slam":{"damage":"266.00","radial":{"damage":"133.00","element":"Impact","radius":8}},"speed":1,"crit_chance":25,"crit_mult":3,"status_chance":25,"damage":{"Impact":13.3,"Slash":106.4,"Puncture":13.3}},{"name":"Slam","radius":8,"type":"s","isHeavy":false,"speed":1,"crit_chance":25,"crit_mult":3,"status_chance":25,"unique":{"force_procs":["impact"]},"damage":{"Impact":266}},{"name":"Heavy Slam","radius":9,"type":"hs","isHeavy":true,"speed":1,"crit_chance":25,"crit_mult":3,"status_chance":25,"damage":{"Blast":399}}],"name":"Prisma Dual Cleavers","imageName":"prisma-dual-cleavers.webp","tags":["Prisma","Baro"],"compTags":["DUAL_SWORDS_STANCE","DUAL CLEAVERS"]},
  "Plasma Sword":{"masteryReq":4,"description":"An advanced blade that delivers high-damage attacks. Delivers a high percentage of critical strikes.","blockingAngle":55,"comboDuration":5,"followThrough":0.6,"range":2.5,"windUp":0.6,"releaseDate":"2012-12-18","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"200","slam":{"damage":"600.00","radial":{"damage":"200.00","element":"Electricity","radius":7}},"speed":0.667,"crit_chance":18,"crit_mult":2,"status_chance":18,"damage":{"Impact":34,"Slash":88,"Puncture":12,"Electricity":66}},{"name":"Slam","radius":7,"type":"s","isHeavy":false,"speed":1,"crit_chance":18,"crit_mult":2,"status_chance":18,"unique":{"force_procs":["electricity","impact"]},"damage":{"Electricity":400}},{"name":"Heavy Slam","radius":8,"type":"hs","isHeavy":true,"speed":1,"crit_chance":18,"crit_mult":2,"status_chance":18,"damage":{"Electricity":600}}],"name":"Plasma Sword","imageName":"plasma-sword.webp","tags":["Tenno"],"compTags":["SWORDS_STANCE"]},
  "Pox":{"masteryReq":9,"description":"These festering sacs of pus and gas burst violently on impact.","noise":"Silent","releaseDate":"2016-08-19","ammoCapacity":20,"productCategory":"Pistols","category":"Secondary","trigger":"Auto","type":"Pistol","magazineSize":4,"reloadTime":1,"multishot":1,"attacks":[{"name":"Spore Impact","speed":2.08,"crit_chance":1,"crit_mult":2,"status_chance":35,"shot_type":"Projectile","shot_speed":30,"flight":30,"damage":{"Toxin":50}},{"name":"Poison Cloud","speed":1,"crit_chance":1,"crit_mult":2,"status_chance":35,"shot_type":"AoE","damage":{"Toxin":20},"falloff":{"start":0,"end":3.6,"reduction":0},"no_headshot_mult":true}],"name":"Pox","imageName":"pox.webp","tags":["Infested"],"compTags":["PROJECTILE","AOE","SINGLESHOT"]},
  "Plinx":{"masteryReq":6,"description":"Cultivate a meaningful relationship with this deceptively simple battery-powered pistol. The Plinx rewards attention and investment from the wise.","noise":"Alarming","releaseDate":"2018-12-18","ammoCapacity":8,"productCategory":"Pistols","zoomProps":[[]],"category":"Secondary","trigger":"Semi","type":"Pistol","magazineSize":10,"reloadTime":1.3,"multishot":1,"attacks":[{"name":"Normal Attack","speed":3.33,"crit_chance":32,"crit_mult":3,"status_chance":4,"shot_type":"Hit-Scan","damage":{"Puncture":26,"Heat":20}}],"reloadRate":20,"reloadDelay":0.8,"name":"Plinx","imageName":"plinx.webp","tags":["Corpus"],"compTags":["PROJECTILE"]},
  "Prisma Dual Decurions (Arch-mode)":{"masteryReq":1,"description":"Colder than space and less forgiving, Prisma crystals bring elite efficiency to the already sleek Dual Decurion. Requiring the lightest of touches to reload, these twin archguns prove that heavy weaponry can still possess elegance.","releaseDate":"2020-12-11","ammoCapacity":0,"productCategory":"Archguns","zoomProps":[[]],"category":"Archgun","type":"Archgun","magazineSize":64,"reloadTime":0.89,"multishot":1,"attacks":[{"name":"Normal Attack","punch_through":1.2,"speed":12.5,"crit_chance":30,"crit_mult":2.2,"status_chance":24,"shot_type":"Projectile","shot_speed":300,"damage":{"Impact":49.5,"Puncture":30.3,"Slash":30.2}}],"reloadRate":50,"reloadDelay":0.25,"name":"Prisma Dual Decurions (Arch-mode)","imageName":"PrismaDualDecurions.webp","tags":[""],"compTags":["BATTERY"]},
  "Prisma Grinlok":{"masteryReq":11,"description":"Prisma-crystal enhancement creates here a prestige instrument; a weapon capable of taking life at astonishing range with but a single pull of its exquisitely-tooled trigger.","noise":"Alarming","releaseDate":"2019-03-08","productCategory":"LongGuns","equipTime":1.1,"category":"Primary","trigger":"Semi","type":"Rifle","magazineSize":21,"reloadTime":1.7,"multishot":1,"attacks":[{"name":"Normal Attack","speed":1.67,"crit_chance":21,"crit_mult":2.9,"status_chance":37,"shot_type":"Hit-Scan","damage":{"Impact":74.8,"Slash":93.5,"Puncture":18.7}}],"name":"Prisma Grinlok","imageName":"prisma-grinlok.webp","tags":["Prisma","Baro"],"compTags":["ASSAULT_AMMO","GRINLOK"]},
  "Prisma Dual Decurions (Atmo-mode)":{"masteryReq":1,"description":"Colder than space and less forgiving, Prisma crystals bring elite efficiency to the already sleek Dual Decurion. Requiring the lightest of touches to reload, these twin archguns prove that heavy weaponry can still possess elegance.","releaseDate":"2020-12-11","ammoCapacity":512,"productCategory":"Archguns","zoomProps":[[]],"category":"Archgun","type":"Archgun","magazineSize":64,"reloadTime":1.4,"multishot":1,"attacks":[{"name":"Normal Attack","speed":12.5,"crit_chance":30,"crit_mult":2.2,"status_chance":24,"shot_type":"Hit-Scan","damage":{"Impact":99,"Puncture":60.5,"Slash":60.5}}],"name":"Prisma Dual Decurions (Atmo-mode)","imageName":"PrismaDualDecurions.webp","tags":[""],"compTags":["BATTERY"]},
  "Prisma Lenz":{"masteryReq":8,"description":"The explosive power of the Lenz, enhanced with Prisma crystals.","noise":"Alarming","releaseDate":"2023-05-12","ammoCapacity":8,"productCategory":"LongGuns","equipTime":1.8,"zoomProps":[[]],"category":"Primary","trigger":"Charge","type":"Rifle","magazineSize":1,"reloadTime":0.6,"multishot":1,"attacks":[{"name":"Charged Shot","speed":1,"crit_chance":50,"crit_mult":2.8,"status_chance":16,"shot_type":"Projectile","shot_speed":60,"flight":60,"unique":{"force_procs":["impact"]},"damage":{"Impact":56},"charge_time":1.2},{"name":"Initial Blast","speed":1,"crit_chance":50,"crit_mult":2.8,"status_chance":16,"shot_type":"AoE","unique":{"force_procs":["cold"]},"damage":{"Cold":10},"falloff":{"start":0,"end":7.2,"reduction":0.7},"no_headshot_mult":true,"charge_time":1.2},{"name":"Bubble Collapse","speed":1,"crit_chance":50,"crit_mult":2.8,"status_chance":16,"shot_type":"AoE","damage":{"Blast":740},"no_headshot_mult":true,"charge_time":1.2}],"name":"Prisma Lenz","imageName":"PrismaLenz.webp","tags":["Corpus"],"compTags":["PROJECTILE","SNIPER_AMMO","AOE","SINGLESHOT","CRPBOW"],"comb":[[0,1,2]]},
  "Prisma Gorgon":{"masteryReq":11,"description":"Adorned with void hardened prisma crystal, this Gorgon variant is prized for its beauty and enhanced mechanics.","noise":"Alarming","releaseDate":"2015-01-22","ammoCapacity":840,"productCategory":"LongGuns","equipTime":1.1,"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":120,"reloadTime":3,"multishot":1,"attacks":[{"name":"Fully Spooled","speed":14.17,"crit_chance":30,"crit_mult":2.3,"status_chance":15,"shot_type":"Hit-Scan","damage":{"Impact":17.25,"Slash":2.3,"Puncture":3.45}},{"name":"Incarnon Form","isInc":1,"speed":0.8,"crit_chance":33,"crit_mult":2.3,"status_chance":21,"shot_type":"Projectile","damage":{"Impact":15,"Slash":15,"Puncture":45}},{"name":"Incarnon Form Radial Attack","isInc":1,"speed":0.8,"crit_chance":33,"crit_mult":2.3,"status_chance":21,"shot_type":"AoE","unique":{"force_procs":["heat"]},"damage":{"Heat":700},"no_headshot_mult":true}],"incMagazineSize":20,"name":"Prisma Gorgon","imageName":"prisma-gorgon.webp","tags":["Prisma","Baro","Incarnon"],"compTags":["ASSAULT_AMMO","GORGON"],"comb":[[1,2]]},
  "Prisma Obex":{"masteryReq":10,"description":"Dazzle, distract and destroy with these sparring weapons of impossibly hard prisma crystal.","blockingAngle":50,"comboDuration":5,"followThrough":0.9,"range":1.25,"windUp":0.5,"releaseDate":"2017-05-05","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"300","slam":{"damage":"450.00","radial":{"damage":"150.00","element":"Electricity","radius":7}},"speed":1.33,"crit_chance":25,"crit_mult":2,"status_chance":30,"damage":{"Impact":105,"Slash":22.5,"Puncture":22.5}},{"name":"Slam","radius":7,"type":"s","isHeavy":false,"speed":1,"crit_chance":25,"crit_mult":2,"status_chance":30,"unique":{"force_procs":["impact"]},"damage":{"Electricity":300}},{"name":"Heavy Slam","radius":8,"type":"hs","isHeavy":true,"speed":1,"crit_chance":25,"crit_mult":2,"status_chance":30,"damage":{"Electricity":450}}],"name":"Prisma Obex","imageName":"prisma-obex.webp","tags":["Prisma","Baro","Incarnon"],"compTags":["SPARRING_STANCE"]},
  "Prisma Grakata":{"masteryReq":11,"description":"Encased in plates refined from pure prisma crystals, this rare element gives this assault rifle a radiant luster.","noise":"Alarming","releaseDate":"2015-06-12","ammoCapacity":1000,"productCategory":"LongGuns","equipTime":1.1,"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":120,"reloadTime":2,"multishot":1,"attacks":[{"name":"Normal Attack","speed":21.67,"crit_chance":25,"crit_mult":2.5,"status_chance":21,"shot_type":"Hit-Scan","damage":{"Impact":6,"Slash":4,"Puncture":5}}],"name":"Prisma Grakata","imageName":"prisma-grakata.webp","tags":["Prisma","Baro"],"compTags":["ASSAULT_AMMO","GRAKATA"]},
  "Prisma Skana":{"masteryReq":8,"description":"Forged from raw prisma crystals and infused with Void energy, this blade's pristine edge is honed razor-sharp to eviscerate even the most deadly of foes.","blockingAngle":55,"comboDuration":5,"followThrough":0.6,"range":2.5,"windUp":0.6,"releaseDate":"2015-05-28","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":1,"crit_chance":28,"crit_mult":2.2,"status_chance":16,"damage":{"Impact":25.5,"Slash":119,"Puncture":25.5}},{"name":"Slam","radius":7,"type":"s","isHeavy":false,"speed":1,"crit_chance":28,"crit_mult":2.2,"status_chance":16,"unique":{"force_procs":["impact"]},"damage":{"Impact":340}},{"name":"Heavy Slam","radius":8,"type":"hs","isHeavy":true,"speed":1,"crit_chance":28,"crit_mult":2.2,"status_chance":16,"damage":{"Blast":510}}],"name":"Prisma Skana","imageName":"prisma-skana.webp","tags":["Prisma","Baro","Incarnon"],"compTags":["SWORDS_STANCE","SKANA"]},
  "Prisma Ohma":{"masteryReq":8,"description":"Prisma crystals glisten in these electrified tonfas.","blockingAngle":60,"comboDuration":5,"followThrough":0.6,"range":2.5,"windUp":0.7,"releaseDate":"2023-08-03","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slam":{"damage":"500","radial":{"damage":"250","radius":8}},"speed":1,"crit_chance":30,"crit_mult":2.2,"status_chance":20,"damage":{"Impact":82,"Slash":44,"Electricity":124}},{"name":"Slam","radius":8,"type":"s","isHeavy":false,"speed":1,"crit_chance":30,"crit_mult":2.2,"status_chance":20,"unique":{"force_procs":["impact"]},"damage":{"Electricity":500}},{"name":"Heavy Slam","radius":9,"type":"hs","isHeavy":true,"speed":1,"crit_chance":30,"crit_mult":2.2,"status_chance":20,"damage":{"Electricity":750}}],"name":"Prisma Ohma","imageName":"PrismaOhma.webp","tags":["Corpus"],"compTags":["TONFA_STANCE"]},
  "Prisma Machete":{"masteryReq":7,"description":"The addition of Prisma Crystal allows this otherwise barbaric weapon to elegantly hack through any foe.","blockingAngle":55,"comboDuration":5,"followThrough":0.7,"range":2.5,"windUp":0.7,"releaseDate":"2021-06-10","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","slide":"567","slam":{"damage":"567.00","radial":{"damage":"189.00","element":"Impact","radius":8}},"speed":0.917,"crit_chance":15,"crit_mult":1.9,"status_chance":31,"damage":{"Impact":28.95,"Slash":135.1,"Puncture":28.95}},{"name":"Slam","radius":8,"type":"s","isHeavy":false,"speed":1,"crit_chance":15,"crit_mult":1.9,"status_chance":31,"unique":{"force_procs":["impact"]},"damage":{"Impact":386}},{"name":"Heavy Slam","radius":9,"type":"hs","isHeavy":true,"speed":1,"crit_chance":15,"crit_mult":1.9,"status_chance":31,"damage":{"Blast":579}}],"name":"Prisma Machete","imageName":"prisma-machete.webp","tags":[],"compTags":["MACHETES_STANCE"]},
  "Prisma Tetra":{"masteryReq":4,"description":"When bathed in Void energy and prisma crystal, the simple Tetra becomes a beacon of style and intimidation.","noise":"Alarming","releaseDate":"2015-08-07","productCategory":"LongGuns","equipTime":1.1,"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":60,"reloadTime":2,"multishot":1,"attacks":[{"name":"Normal Attack","speed":7.08,"crit_chance":10,"crit_mult":2,"status_chance":24,"shot_type":"Projectile","shot_speed":100,"flight":100,"damage":{"Impact":7.6,"Puncture":30.4}}],"name":"Prisma Tetra","imageName":"prisma-tetra.webp","tags":["Prisma","Baro"],"compTags":["PROJECTILE","ASSAULT_AMMO","TETRA"]},
  "Proboscis Cernos":{"masteryReq":15,"description":"Each arrow spawns a swarm of sticky appendages on impact. These tongue-like probes latch onto nearby unfortunates and drag them close before bursting into a mess of diseased goo.","noise":"Silent","releaseDate":"2020-11-19","ammoCapacity":7,"productCategory":"LongGuns","equipTime":1.1,"zoomProps":[[]],"category":"Primary","trigger":"Charge","type":"Rifle","magazineSize":1,"reloadTime":0.6,"multishot":1,"attacks":[{"name":"Charged Shot","speed":1,"crit_chance":7,"crit_mult":1.9,"status_chance":43,"shot_type":"Projectile","shot_speed":45,"flight":45,"damage":{"Impact":103.2,"Slash":145.1,"Puncture":30.7},"charge_time":0.7},{"name":"Appendages","noIncrStatus":true,"speed":1,"crit_chance":7,"crit_mult":1.9,"status_chance":43,"shot_type":"AoE","damage":{"Slash":50.63,"Viral":39.38},"falloff":{"start":0,"end":9,"reduction":0},"no_headshot_mult":true,"charge_time":0.7},{"name":"Charged Shot Explosion","speed":1,"crit_chance":7,"crit_mult":1.9,"status_chance":43,"shot_type":"AoE","damage":{"Viral":1003},"falloff":{"start":0,"end":7,"reduction":0.5},"no_headshot_mult":true,"charge_time":0.7}],"name":"Proboscis Cernos","imageName":"proboscis-cernos.webp","tags":["Infested"],"compTags":["PROJECTILE","INFBOW"],"comb":[[0,1,2]]},
  "Prisma Twin Gremlins":{"masteryReq":11,"description":"Fused with prisma crystals, these pristine Grineer sidearms are sure to intimidate any foe.","noise":"Alarming","releaseDate":"2018-08-17","ammoCapacity":600,"productCategory":"Pistols","category":"Secondary","trigger":"Auto","type":"Pistol","magazineSize":70,"reloadTime":0.9,"multishot":1,"attacks":[{"name":"Normal Attack","speed":8.83,"crit_chance":23,"crit_mult":1.9,"status_chance":23,"shot_type":"Projectile","shot_speed":90,"flight":90,"damage":{"Impact":2.97,"Slash":11.34,"Puncture":12.69}}],"name":"Prisma Twin Gremlins","imageName":"prisma-twin-gremlins.webp","tags":["Grineer"],"compTags":["PROJECTILE"]},
  "Prova":{"masteryReq":3,"description":"The Prova is a Melee Weapon that delivers a high-intensity shock to its target.","blockingAngle":55,"comboDuration":5,"followThrough":0.7,"range":2.5,"windUp":0.7,"releaseDate":"2013-05-23","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"256","slam":{"damage":"384.00","radial":{"damage":"128.00","radius":8}},"speed":1,"crit_chance":14,"crit_mult":2,"status_chance":16,"damage":{"Impact":52,"Electricity":76}},{"name":"Slam","radius":8,"type":"s","isHeavy":false,"speed":1,"crit_chance":14,"crit_mult":2,"status_chance":16,"unique":{"force_procs":["impact"]},"damage":{"Electricity":256}},{"name":"Heavy Slam","radius":9,"type":"hs","isHeavy":true,"speed":1,"crit_chance":14,"crit_mult":2,"status_chance":16,"damage":{"Blast":384}}],"name":"Prova","imageName":"prova.webp","tags":["Corpus"],"compTags":["MACHETES_STANCE"]},
  "Pulmonars":{"masteryReq":11,"description":"Pummel and infect with these two pulsating hunks of flesh connected by a ligament. Take-hold of the malignant evolution of an ancient martial weapon.","blockingAngle":55,"comboDuration":9,"followThrough":0.5,"range":2.507992,"windUp":0.5,"releaseDate":"2020-11-19","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"580","slam":{"damage":"580.00","radial":{"damage":"290.00","radius":7}},"speed":0.917,"crit_chance":19,"crit_mult":2.3,"status_chance":33,"damage":{"Impact":193,"Viral":97}},{"name":"Slam","radius":7,"type":"s","isHeavy":false,"speed":1,"crit_chance":19,"crit_mult":2.3,"status_chance":33,"unique":{"force_procs":["impact"]},"damage":{"Viral":580}},{"name":"Heavy Slam","radius":9,"type":"hs","isHeavy":true,"speed":1,"crit_chance":19,"crit_mult":2.3,"status_chance":33,"damage":{"Viral":870}}],"name":"Pulmonars","imageName":"pulmonars.webp","tags":["Infested"],"compTags":["NUNCHAKU_STANCE"]},
  "Pupacyst":{"masteryReq":7,"description":"A two-pronged attack; the bone-grafted cocoon at the tip of this polearm rends flesh, while the viral mass living within spreads itself into the wounds of each new victim.","blockingAngle":55,"comboDuration":5,"followThrough":0.6,"range":2.7,"windUp":0.9,"releaseDate":"2018-10-12","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":0.833,"crit_chance":13,"crit_mult":1.5,"status_chance":27,"damage":{"Impact":139,"Viral":145}},{"name":"Slam","radius":7,"type":"s","isHeavy":false,"speed":1,"crit_chance":13,"crit_mult":1.5,"status_chance":27,"unique":{"force_procs":["impact"]},"damage":{"Impact":278,"Viral":290}},{"name":"Heavy Slam","radius":8,"type":"hs","isHeavy":true,"speed":1,"crit_chance":13,"crit_mult":1.5,"status_chance":27,"damage":{"Impact":417,"Viral":435}}],"name":"Pupacyst","imageName":"pupacyst.webp","tags":["Infested"],"compTags":["POLEARMS_STANCE"]},
  "Prova Vandal":{"masteryReq":8,"description":"A customized version of the vicious Prova, with metallic finish and Lotus decal.","blockingAngle":55,"comboDuration":5,"followThrough":0.7,"range":2.5,"windUp":0.7,"releaseDate":"2013-10-23","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"396","slam":{"damage":"594.00","radial":{"damage":"198.00","element":"Electricity","radius":8}},"speed":1,"crit_chance":14,"crit_mult":2,"status_chance":32,"damage":{"Impact":80,"Electricity":118}},{"name":"Slam","radius":8,"type":"s","isHeavy":false,"speed":1,"crit_chance":14,"crit_mult":2,"status_chance":32,"unique":{"force_procs":["electricity","impact"]},"damage":{"Electricity":396}},{"name":"Heavy Slam","radius":9,"type":"hs","isHeavy":true,"speed":1,"crit_chance":14,"crit_mult":2,"status_chance":32,"damage":{"Blast":594}}],"name":"Prova Vandal","imageName":"prova-vandal.webp","tags":["Corpus","Vandal"],"compTags":["MACHETES_STANCE"]},
  "Pyrana":{"masteryReq":12,"description":"Chew through the enemy with this vicious automatic hand shotgun.","noise":"Alarming","releaseDate":"2014-06-04","productCategory":"Pistols","category":"Secondary","trigger":"Auto","type":"Pistol","magazineSize":10,"reloadTime":2,"multishot":12,"attacks":[{"name":"Normal Attack","speed":4.17,"crit_chance":20,"crit_mult":2,"status_chance":2.5,"shot_type":"Hit-Scan","damage":{"Impact":2.2,"Slash":17.6,"Puncture":2.2},"falloff":{"start":15,"end":30,"reduction":0.7273}}],"name":"Pyrana","imageName":"pyrana.webp","tags":["Tenno"],"compTags":["SECONDARYSHOTGUN","SINGLESHOT"]},
  "Pyrana Prime":{"masteryReq":13,"description":"Three kills in rapid succession to summon a second ethereal Pyrana for twice the deadly punch.","noise":"Alarming","releaseDate":"2018-06-19","productCategory":"Pistols","zoomProps":[[]],"category":"Secondary","trigger":"Auto","type":"Pistol","magazineSize":12,"reloadTime":1.6,"multishot":10,"attacks":[{"name":"Normal Attack","speed":4,"crit_chance":24,"crit_mult":2.2,"status_chance":3.6,"shot_type":"Hit-Scan","damage":{"Impact":1.92,"Slash":20.16,"Puncture":1.92},"falloff":{"start":18,"end":36,"reduction":0.75}},{"name":"Ethereal  Attack","speed":4,"crit_chance":24,"crit_mult":2.2,"status_chance":3.6,"shot_type":"Hit-Scan","unique":{"speed_mult":0.4},"damage":{"Impact":1.92,"Slash":20.16,"Puncture":1.92},"falloff":{"start":18,"end":36,"reduction":0.75}}],"name":"Pyrana Prime","imageName":"pyrana-prime.webp","tags":["Prime","Vaulted"],"compTags":["SECONDARYSHOTGUN","SINGLESHOT"]},
  "Purgator 1":{"masteryReq":14,"description":"Put them down so that they stay down, with this Scaldra slug launcher.","noise":"Alarming","releaseDate":"2025-03-19","ammoCapacity":20,"productCategory":"LongGuns","category":"Primary","trigger":"Semi","type":"Rifle","magazineSize":9,"reloadTime":2.7,"multishot":1,"attacks":[{"name":"Normal Attack","speed":1.5,"crit_chance":31,"crit_mult":2.3,"status_chance":19,"shot_type":"Projectile","shot_speed":180,"unique":{"force_procs":["impact"]},"damage":{"Impact":351.44998,"Puncture":429.55002}}],"name":"Purgator 1","imageName":"Purgator1.webp","tags":[],"compTags":["ASSAULT_AMMO","AOE"]},
  "Quartakk":{"masteryReq":10,"description":"Annihilate targets with four simultaneous shots from this high-caliber Grineer rifle.","noise":"Alarming","releaseDate":"2017-10-12","ammoCapacity":840,"productCategory":"LongGuns","equipTime":1.1,"zoomProps":[[]],"category":"Primary","trigger":"Burst","type":"Rifle","magazineSize":84,"reloadTime":1.9,"multishot":1,"attacks":[{"name":"Burst-Fire","punch_through":0.5,"speed":1.58,"crit_chance":19,"crit_mult":2.3,"status_chance":27,"shot_type":"Hit-Scan","damage":{"Impact":18.13,"Slash":16.66,"Puncture":14.21},"burst_count":4,"burst_delay":0}],"name":"Quartakk","imageName":"quartakk.webp","tags":["Grineer"],"compTags":["ASSAULT_AMMO"]},
  "Quanta":{"masteryReq":4,"description":"This weapon was designed to assist with the excavation of mineral deposits from large asteroids, but has been adapted for military purposes.","noise":"Alarming","releaseDate":"2014-07-30","productCategory":"LongGuns","equipTime":1.1,"category":"Primary","trigger":"Held","type":"Rifle","magazineSize":60,"reloadTime":2,"multishot":2,"attacks":[{"name":"Beam","speed":12,"crit_chance":16,"crit_mult":2.2,"status_chance":24,"shot_type":"Hit-Scan","damage":{"Electricity":10}},{"name":"Cube (shot by player)","ammoCost":10,"speed":4,"crit_chance":5,"crit_mult":1.5,"status_chance":26,"damage":{"Blast":600}},{"name":"Cube (direct hit)","ammoCost":10,"speed":4,"crit_chance":5,"crit_mult":1.5,"status_chance":26,"shot_type":"Projectile","shot_speed":25,"flight":25,"damage":{"Electricity":100}},{"name":"Cube Explosion","ammoCost":10,"speed":4,"crit_chance":5,"crit_mult":1.5,"status_chance":26,"shot_type":"AoE","damage":{"Blast":150},"no_headshot_mult":true}],"name":"Quanta","imageName":"quanta.webp","tags":["Corpus"],"compTags":["PROJECTILE","BEAM","ASSAULT_AMMO"],"comb":[[2,3]]},
  "Quatz":{"masteryReq":9,"description":"A compact four-barreled design packing a self-charging capacitor that discharges upon every reload from empty. Features auto hip-fire and aimed fire is semi-auto, four-shot instant burst.","noise":"Alarming","releaseDate":"2019-07-18","ammoCapacity":504,"productCategory":"Pistols","equipTime":1.1,"zoomProps":[[]],"category":"Secondary","trigger":"Auto","type":"Pistol","magazineSize":72,"reloadTime":2.7,"multishot":1,"attacks":[{"name":"Auto","speed":15,"crit_chance":13,"crit_mult":1.5,"status_chance":27,"shot_type":"Hit-Scan","damage":{"Impact":9,"Slash":7,"Puncture":2,"Electricity":11}},{"name":"Burst","speed":2.5,"crit_chance":27,"crit_mult":2.5,"status_chance":19,"shot_type":"Hit-Scan","damage":{"Impact":9,"Slash":7,"Puncture":2,"Electricity":11},"burst_count":4,"burst_delay":0}],"name":"Quatz","imageName":"quatz.webp","tags":[],"compTags":["PROJECTILE","SECONDARYSHOTGUN"]},
  "Rabvee (Machete)":{"masteryReq":0,"description":"","comboDuration":5,"range":1,"windUp":1,"releaseDate":"2018-04-20","productCategory":"Melee","category":"Melee","type":"Zaw Component","multishot":1,"attacks":[{"name":"Rabvee Strike","speed":0.85,"crit_chance":18,"crit_mult":2,"status_chance":18,"damage":{"Impact":140.4,"Slash":81.9,"Puncture":11.7}}],"name":"Rabvee (Machete)","imageName":"Rabvee.webp","tags":[],"compTags":["MACHETES_STANCE"]},
  "Rabvee (Hammer)":{"masteryReq":0,"description":"","comboDuration":5,"range":1,"windUp":1,"releaseDate":"2018-04-20","productCategory":"Melee","category":"Melee","type":"Zaw Component","multishot":1,"attacks":[{"name":"Rabvee Strike","speed":0.85,"crit_chance":18,"crit_mult":2,"status_chance":18,"damage":{"Impact":140.4,"Slash":81.9,"Puncture":11.7}}],"name":"Rabvee (Hammer)","imageName":"Rabvee.webp","tags":[],"compTags":["HAMMERS_STANCE"]},
  "Quassus Prime":{"masteryReq":13,"description":"Wield Xaku Prime’s elegant fan, its gilded edges crafted for both precision and prestige.","blockingAngle":55,"comboDuration":5,"followThrough":0.7,"range":1.7,"windUp":0.5,"releaseDate":"2024-11-13","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","isHeavy":false,"speed":0.833,"crit_chance":35,"crit_mult":2.5,"status_chance":18,"damage":{"Impact":26,"Slash":182,"Puncture":52}},{"name":"First Heavy Attack - Ethereal Daggers","multishot":18,"type":"h","isHeavy":true,"speed":2,"crit_chance":35,"crit_mult":2.5,"status_chance":1,"shot_type":"Projectile","shot_speed":46,"flight":46,"unique":{"force_procs":["slash"]},"damage":{"Slash":114,"Puncture":76},"charge_time":0.5},{"name":"Second Heavy Attack - Ethereal Daggers","multishot":9,"type":"h","isHeavy":true,"speed":2,"crit_chance":35,"crit_mult":2.5,"status_chance":2,"shot_type":"Projectile","shot_speed":46,"flight":46,"unique":{"force_procs":["slash"]},"damage":{"Slash":228,"Puncture":152},"charge_time":0.5},{"name":"Slam","radius":5,"type":"s","isHeavy":false,"speed":1,"crit_chance":35,"crit_mult":2.5,"status_chance":18,"unique":{"force_procs":["impact"]},"damage":{"Impact":520}},{"name":"Heavy Slam","radius":6,"type":"hs","isHeavy":true,"speed":1,"crit_chance":35,"crit_mult":2.5,"status_chance":18,"damage":{"Blast":780}}],"name":"Quassus Prime","imageName":"QuassusPrime.webp","tags":[],"compTags":["WARFAN_STANCE"]},
  "Quellor":{"masteryReq":12,"description":"The Quellor was standard-issue to Dax Railjack crews of the Old War, dating back to the earliest, pre-Sigma craft. A rapid-fire assault rifle with a hefty magazine-size, the Quellor is an all-round workhorse. Also capable of large, short-range cryo-blasts.","noise":"Alarming","releaseDate":"2019-12-13","ammoCapacity":900,"productCategory":"LongGuns","equipTime":1.1,"zoomProps":[[]],"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":300,"reloadTime":4,"multishot":1,"attacks":[{"name":"Auto","punch_through":0.5,"speed":6,"crit_chance":12,"crit_mult":1.6,"status_chance":38,"shot_type":"Hit-Scan","damage":{"Impact":8,"Slash":12,"Puncture":22,"Cold":16}},{"name":"Alt-Fire","ammoCost":50,"isCoMult":true,"speed":1,"crit_chance":40,"crit_mult":2.2,"status_chance":10,"shot_type":"Projectile","shot_speed":210,"flight":210,"unique":{"force_procs":["impact"]},"damage":{"Impact":600,"Cold":800},"falloff":{"start":9,"end":18,"reduction":0.6657},"charge_time":1.2}],"name":"Quellor","imageName":"quellor.webp","tags":["Tenno"],"compTags":["PROJECTILE","ASSAULT_AMMO"]},
  "Quanta Vandal":{"masteryReq":10,"description":"A customized version of the Quanta, with metallic finish and Lotus decal.","noise":"Alarming","releaseDate":"2015-04-23","ammoCapacity":560,"productCategory":"LongGuns","equipTime":1.1,"category":"Primary","trigger":"Held","type":"Rifle","magazineSize":80,"reloadTime":1.8,"multishot":2,"attacks":[{"name":"Beam","isBeam":true,"speed":12,"crit_chance":22,"crit_mult":2.4,"status_chance":45,"shot_type":"Discharge","damage":{"Electricity":13}},{"name":"Cube (shot by player)","speed":4,"crit_chance":5,"crit_mult":1.5,"status_chance":26,"damage":{"Blast":600}},{"name":"Cube (direct hit)","speed":4,"crit_chance":5,"crit_mult":1.5,"status_chance":26,"shot_type":"Projectile","shot_speed":25,"flight":25,"damage":{"Electricity":100}},{"name":"Cube Explosion","speed":4,"crit_chance":5,"crit_mult":1.5,"status_chance":26,"shot_type":"AoE","damage":{"Blast":150},"no_headshot_mult":true}],"name":"Quanta Vandal","imageName":"quanta-vandal.webp","tags":["Corpus","Vandal"],"compTags":["PROJECTILE","BEAM","ASSAULT_AMMO"],"comb":[[2,3]]},
  "Rakta Ballistica":{"masteryReq":6,"description":"This modified ballistica is the weapon of choice used by Red Veil Assassins to take out high-priority marks.","noise":"Silent","releaseDate":"2014-11-27","productCategory":"Pistols","category":"Secondary","trigger":"Charge","type":"Pistol","magazineSize":20,"reloadTime":2,"multishot":1,"attacks":[{"name":"Burst Shot","speed":6.67,"crit_chance":5,"crit_mult":1.5,"status_chance":7.5,"shot_type":"Projectile","shot_speed":100,"flight":100,"damage":{"Impact":18.75,"Slash":18.75,"Puncture":37.5},"burst_count":4,"burst_delay":0.05},{"name":"Charged Shot","speed":3.33,"crit_chance":20,"crit_mult":1.5,"status_chance":10,"shot_type":"Projectile","shot_speed":100,"flight":100,"damage":{"Impact":15,"Slash":15,"Puncture":270},"charge_time":1},{"name":"Incarnon Form","isInc":1,"speed":3.33,"crit_chance":25,"crit_mult":2.2,"status_chance":25,"shot_type":"Projectile","shot_speed":80,"damage":{"Slash":734},"charge_time":0.4}],"incMagazineSize":18,"name":"Rakta Ballistica","imageName":"rakta-ballistica.webp","tags":["Syndicate","Red Veil","Incarnon"],"compTags":["PROJECTILE","CROSSBOW"]},
  "Quassus":{"masteryReq":8,"description":"Flick away the enemy with this heavy warfan. The Quassus scatters ethereal daggers that are even more deadly accurate when wielded by Xaku.","blockingAngle":55,"comboDuration":5,"followThrough":0.7,"range":1.7,"windUp":0.5,"releaseDate":"2020-08-25","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"230","slam":{"damage":"690.00","radial":{"damage":"230.00","radius":5}},"isHeavy":false,"speed":0.833,"crit_chance":30,"crit_mult":2,"status_chance":12,"damage":{"Impact":27.6,"Slash":156.4,"Puncture":46}},{"name":"First Heavy Attack - Ethereal Daggers","multishot":12,"type":"h","isHeavy":true,"speed":2,"crit_chance":30,"crit_mult":2,"status_chance":1,"shot_type":"Projectile","shot_speed":46,"flight":46,"unique":{"force_procs":["slash"]},"damage":{"Slash":114,"Puncture":76},"charge_time":0.5},{"name":"Second Heavy Attack - Ethereal Daggers","multishot":6,"type":"h","isHeavy":true,"speed":2,"crit_chance":30,"crit_mult":2,"status_chance":2,"shot_type":"Projectile","shot_speed":46,"flight":46,"unique":{"force_procs":["slash"]},"damage":{"Slash":228,"Puncture":152},"charge_time":0.5},{"name":"Slam","radius":5,"type":"s","isHeavy":false,"speed":1,"crit_chance":30,"crit_mult":2,"status_chance":12,"unique":{"force_procs":["impact"]},"damage":{"Impact":460}},{"name":"Heavy Slam","radius":6,"type":"hs","isHeavy":true,"speed":1,"crit_chance":30,"crit_mult":2,"status_chance":12,"damage":{"Blast":690}}],"name":"Quassus","imageName":"quassus.webp","tags":["Tenno"],"compTags":["WARFAN_STANCE"]},
  "Rakta Cernos":{"masteryReq":12,"description":"A finely tuned instrument of assassination.","noise":"Silent","releaseDate":"2015-09-02","ammoCapacity":72,"productCategory":"LongGuns","equipTime":1.1,"zoomProps":[[]],"category":"Primary","trigger":"Charge","type":"Rifle","magazineSize":1,"reloadTime":0.6,"multishot":1,"attacks":[{"name":"Uncharged Shot","speed":1,"crit_chance":35,"crit_mult":2,"status_chance":15,"shot_type":"Projectile","shot_speed":70,"flight":70,"damage":{"Impact":211.5,"Slash":11.75,"Puncture":11.75}},{"name":"Charged Shot","punch_through":1,"speed":1,"crit_chance":35,"crit_mult":2,"status_chance":15,"shot_type":"Projectile","shot_speed":100,"flight":100,"damage":{"Impact":423,"Slash":23.5,"Puncture":23.5},"charge_time":0.3}],"name":"Rakta Cernos","imageName":"rakta-cernos.webp","tags":["Syndicate","Red Veil"],"compTags":["PROJECTILE"]},
  "Rattleguts (Primary)":{"masteryReq":0,"description":"Let 'er rip, rapid-fire.","ammoCapacity":700,"productCategory":"","category":"Primary","type":"Kitgun","magazineSize":0,"reloadTime":1.5,"multishot":1,"attacks":[{"name":"Normal Attack","speed":5.67,"crit_chance":0,"crit_mult":0,"status_chance":0,"shot_type":"Hit-Scan","damage":{"Impact":2,"Puncture":10,"Slash":8,"Radiation":13}}],"name":"Rattleguts (Primary)","imageName":"rattleguts.webp","tags":["primary-rifle-hitscan"],"compTags":[""]},
  "Reaper Prime":{"masteryReq":10,"description":"Reaper Prime is an ornamental scythe, with a blade forged from tempered Rubedo.","blockingAngle":60,"comboDuration":5,"followThrough":0.6,"range":2.8,"windUp":1,"releaseDate":"2013-05-03","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"400","slam":{"damage":"600.00","radial":{"damage":"200.00","element":"Impact","radius":8}},"speed":1.08,"crit_chance":35,"crit_mult":2.5,"status_chance":25,"damage":{"Impact":30,"Slash":140,"Puncture":30}},{"name":"Slam","radius":8,"type":"s","isHeavy":false,"speed":1,"crit_chance":35,"crit_mult":2.5,"status_chance":25,"unique":{"force_procs":["impact"]},"damage":{"Impact":400}},{"name":"Heavy Slam","radius":9,"type":"hs","isHeavy":true,"speed":1,"crit_chance":35,"crit_mult":2.5,"status_chance":25,"damage":{"Blast":600}}],"name":"Reaper Prime","imageName":"reaper-prime.webp","tags":["Prime","Vaulted"],"compTags":["SCYTHES_STANCE"]},
  "Reconifex":{"masteryReq":14,"description":"Reconifex is Cyte-09 signature heavy assault rifle. Pressing the reload button between the outlined brackets will speed up the reload and load the gun with DmgFireSmall64 Heat bullets.","noise":"Alarming","releaseDate":"2024-12-13","ammoCapacity":600,"productCategory":"LongGuns","category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":200,"reloadTime":5,"multishot":1,"attacks":[{"name":"Normal Attack","punch_through":1,"speed":8,"crit_chance":28,"crit_mult":2.8,"status_chance":16,"shot_type":"Hit-Scan","damage":{"Impact":16,"Puncture":24}},{"name":"Normal Attack (heat ammo)","punch_through":1,"speed":8,"crit_chance":28,"crit_mult":2.8,"status_chance":16,"shot_type":"Hit-Scan","unique":{"reconifexHeat":0.25},"damage":{"Impact":16,"Puncture":24}}],"name":"Reconifex","imageName":"Reconifex.webp","tags":[],"compTags":["ASSAULT_AMMO"]},
  "Rakta Dark Dagger":{"masteryReq":8,"description":"Infiltrate undetected; reduced visibility when held. Then strike with confidence; hits to irradiated targets restores shields and creates overshields.","blockingAngle":45,"comboDuration":5,"followThrough":0.9,"range":1.75,"windUp":0.4,"releaseDate":"2016-09-15","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"492","slam":{"damage":"492.00","radial":{"damage":"246.00","element":"Impact","radius":5}},"speed":1,"crit_chance":12,"crit_mult":1.8,"status_chance":30,"damage":{"Slash":62,"Puncture":88,"Radiation":96}},{"name":"Slam","radius":5,"type":"s","isHeavy":false,"speed":1,"crit_chance":12,"crit_mult":1.8,"status_chance":30,"unique":{"force_procs":["impact"]},"damage":{"Impact":492}},{"name":"Heavy Slam","radius":6,"type":"hs","isHeavy":true,"speed":1,"crit_chance":12,"crit_mult":1.8,"status_chance":30,"damage":{"Radiation":738}}],"name":"Rakta Dark Dagger","imageName":"rakta-dark-dagger.webp","tags":["Syndicate","Red Veil"],"compTags":["DAGGERS_STANCE","DARK DAGGER"]},
  "Rauta":{"masteryReq":8,"description":"Rauta is Kullervo's signature shotgun. When wielded by Kullervo, it increases his combo duration by 11 seconds.","noise":"Alarming","releaseDate":"2023-06-21","ammoCapacity":120,"productCategory":"LongGuns","zoomProps":[[]],"category":"Primary","trigger":"Semi-Auto","type":"Rifle","magazineSize":4,"reloadTime":1.2,"multishot":8,"attacks":[{"name":"Normal Attack","speed":0.8,"crit_chance":6,"crit_mult":2,"status_chance":12,"shot_type":"Hit-Scan","damage":{"Impact":26,"Slash":78,"Puncture":26}}],"name":"Rauta","imageName":"Rauta.webp","tags":[],"compTags":[]},
  "Redeemer Prime":{"masteryReq":10,"description":"Deal double-bladed, double-barreled death with this primed gunblade.","blockingAngle":45,"comboDuration":5,"followThrough":0.5,"range":2,"windUp":0.4,"releaseDate":"2018-12-12","productCategory":"Melee","zoomProps":[[]],"category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"424","slam":{"damage":"636.00","radial":{"damage":"212.00","element":"Impact","radius":5}},"isHeavy":false,"speed":0.917,"crit_chance":24,"crit_mult":2.2,"status_chance":30,"damage":{"Impact":21.2,"Slash":148.4,"Puncture":42.4}},{"name":"Ranged Attack","multishot":10,"isHeavy":true,"speed":2.5,"crit_chance":24,"crit_mult":2.2,"status_chance":9,"shot_type":"Hit-Scan","unique":{"force_procs":["impact"]},"damage":{"Blast":80},"falloff":{"start":10,"end":30,"reduction":0.9375},"charge_time":0.4},{"name":"Slam","radius":5,"type":"s","isHeavy":false,"speed":1,"crit_chance":24,"crit_mult":2.2,"status_chance":30,"unique":{"force_procs":["impact"]},"damage":{"Impact":424}},{"name":"Heavy Slam","radius":6,"type":"hs","isHeavy":true,"speed":1,"crit_chance":24,"crit_mult":2.2,"status_chance":30,"damage":{"Blast":636}}],"name":"Redeemer Prime","imageName":"redeemer-prime.webp","tags":["Prime","Vaulted"],"compTags":["GUNBLADE_STANCE"]},
  "Regulators (Mesa)":{"masteryReq":0,"description":"The Regulators are Mesa and Mesa Prime","noise":"Alarming","releaseDate":"2014-11-27","productCategory":"Pistols","category":"Secondary","type":"Dual Pistols","magazineSize":999999,"reloadTime":0,"multishot":1,"attacks":[{"name":"Normal Attack","speed":14.8,"crit_chance":25,"crit_mult":3,"status_chance":10,"shot_type":"Hit-Scan","damage":{"Impact":25,"Slash":12.5,"Puncture":12.5}}],"hasInfiniteMagazine":true,"name":"Regulators (Mesa)","imageName":"Regulators.webp","tags":[],"compTags":["POWER_WEAPON"]},
  "Rattleguts (Secondary)":{"masteryReq":0,"description":"Let 'er rip, rapid-fire.","ammoCapacity":700,"productCategory":"","category":"Secondary","type":"Kitgun","magazineSize":0,"reloadTime":1.5,"multishot":1,"attacks":[{"name":"Normal Attack","speed":5.67,"crit_chance":0,"crit_mult":0,"status_chance":0,"shot_type":"Hit-Scan","damage":{"Impact":2,"Puncture":10,"Slash":8,"Radiation":13}}],"name":"Rattleguts (Secondary)","imageName":"rattleguts.webp","tags":["secondary-hitscan"],"compTags":[""]},
  "Redeemer":{"masteryReq":4,"description":"Striking with massive twin blades, the Redeemer fires the killing blow with its built-in shotgun.","blockingAngle":45,"comboDuration":5,"followThrough":0.5,"range":2,"windUp":0.4,"releaseDate":"2014-11-27","productCategory":"Melee","zoomProps":[[]],"category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"360","slam":{"damage":"540.00","radial":{"damage":"180.00","radius":5}},"isHeavy":false,"speed":0.833,"crit_chance":10,"crit_mult":1.8,"status_chance":22,"damage":{"Impact":18,"Slash":126,"Puncture":36}},{"name":"Ranged Attack","multishot":10,"punch_through":1,"isHeavy":true,"speed":2.5,"crit_chance":10,"crit_mult":1.8,"status_chance":6.6,"shot_type":"Hit-Scan","unique":{"force_procs":["impact"]},"damage":{"Blast":30},"falloff":{"start":10,"end":20,"reduction":0.8333},"charge_time":0.4},{"name":"Slam","radius":5,"type":"s","isHeavy":false,"speed":1,"crit_chance":10,"crit_mult":1.8,"status_chance":22,"unique":{"force_procs":["impact"]},"damage":{"Impact":360}},{"name":"Heavy Slam","radius":6,"type":"hs","isHeavy":true,"speed":1,"crit_chance":10,"crit_mult":1.8,"status_chance":22,"damage":{"Blast":540}}],"name":"Redeemer","imageName":"redeemer.webp","tags":["Tenno"],"compTags":["GUNBLADE_STANCE"]},
  "Riot-848":{"masteryReq":14,"description":"Never stop fighting, never run out of ammo. Temple’s signature machine pistol was modified by Albrecht Entrati to warp fired bullets back into the magazine when reloaded.","noise":"Alarming","releaseDate":"2025-03-19","productCategory":"Pistols","category":"Secondary","trigger":"Auto","type":"Pistol","magazineSize":16,"reloadTime":1.24,"multishot":1,"attacks":[{"name":"Normal Attack","speed":8,"crit_chance":26,"crit_mult":2.2,"status_chance":26,"damage":{"Puncture":12}},{"name":"Radial Attack","speed":8,"crit_chance":26,"crit_mult":2.2,"status_chance":26,"shot_type":"AoE","damage":{"Blast":48},"no_headshot_mult":true}],"name":"Riot-848","imageName":"Riot-848.webp","tags":[],"compTags":[""]},
  "Ruvox":{"masteryReq":14,"description":"Albrecht's Void experiments revealed the true destructive potential of this fist weapon. In Incarnon form, perform Heavy Slams to impale nearby enemies with spikes.","blockingAngle":50,"comboDuration":5,"followThrough":0.9,"range":1.25,"windUp":0.6,"releaseDate":"2024-03-27","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":1,"crit_chance":26,"crit_mult":2.2,"status_chance":20,"damage":{"Impact":170}},{"name":"Incarnon Form","speed":0.65,"crit_chance":26,"crit_mult":2.2,"status_chance":20,"damage":{"Impact":170}},{"name":"Slam","radius":8,"type":"s","isHeavy":false,"speed":1,"crit_chance":26,"crit_mult":2.2,"status_chance":20,"unique":{"force_procs":["impact"]},"damage":{"Impact":340}},{"name":"Heavy Slam","radius":9,"type":"hs","isHeavy":true,"speed":1,"crit_chance":26,"crit_mult":2.2,"status_chance":20,"damage":{"Blast":510}}],"name":"Ruvox","imageName":"ruvox.webp","tags":["Incarnon"],"compTags":["FIST_STANCE"]},
  "Rubico":{"masteryReq":6,"description":"Scope out the enemy with this long-range revolver style rifle.","noise":"Alarming","releaseDate":"2015-12-03","ammoCapacity":72,"productCategory":"LongGuns","equipTime":1.1,"category":"Primary","trigger":"Semi","type":"Rifle","magazineSize":5,"reloadTime":2.4,"multishot":1,"attacks":[{"name":"Unzoomed","punch_through":1,"speed":2.67,"crit_chance":30,"crit_mult":3,"status_chance":12,"shot_type":"Hit-Scan","damage":{"Impact":144,"Slash":9,"Puncture":27},"falloff":{"start":400,"end":600,"reduction":0.5}},{"name":"3.5x Zoom Mode","punch_through":1,"sniperCombo":true,"speed":2.67,"crit_chance":30,"crit_mult":3,"status_chance":12,"shot_type":"Hit-Scan","unique":{"crit_mult":0.35},"damage":{"Impact":144,"Slash":9,"Puncture":27}},{"name":"6.0x Zoom","punch_through":1,"sniperCombo":true,"speed":2.67,"crit_chance":30,"crit_mult":3,"status_chance":12,"shot_type":"Hit-Scan","unique":{"crit_mult":0.5},"damage":{"Impact":144,"Slash":9,"Puncture":27}}],"name":"Rubico","imageName":"rubico.webp","tags":["Tenno"],"compTags":["SNIPER_AMMO"]},
  "Rumblejack":{"masteryReq":8,"description":"An electrified jolter for quick melee takedowns, assembled from scavenged scrap. Ideal for use on unsuspecting opponents.","blockingAngle":45,"comboDuration":5,"followThrough":0.9,"range":1.8,"windUp":0.4,"releaseDate":"2021-12-15","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"600","slam":{"damage":"600.00","radial":{"damage":"300.00","radius":4}},"speed":0.67,"crit_chance":13,"crit_mult":1.8,"status_chance":40,"damage":{"Impact":120,"Electricity":180}},{"name":"Slam","radius":4,"type":"s","isHeavy":false,"speed":1,"crit_chance":13,"crit_mult":1.8,"status_chance":40,"unique":{"force_procs":["electricity"]},"damage":{"Electricity":600}},{"name":"Heavy Slam","radius":6,"type":"hs","isHeavy":true,"speed":1,"crit_chance":13,"crit_mult":1.8,"status_chance":40,"damage":{"Electricity":900}}],"name":"Rumblejack","imageName":"rumblejack.webp","tags":["Tenno"],"compTags":["DAGGERS_STANCE"]},
  "Sancti Castanas":{"masteryReq":10,"description":"This remotely detonated electrical trap is used by devotees of New Loka to protect their temples and shrines.","noise":"Silent","releaseDate":"2014-11-27","ammoCapacity":18,"productCategory":"Pistols","category":"Secondary","trigger":"Active","type":"Pistol","magazineSize":2,"reloadTime":1,"multishot":1,"attacks":[{"name":"Mid-Flight Detonation","speed":3.33,"crit_chance":24,"crit_mult":2,"status_chance":34,"shot_type":"Projectile","shot_speed":60,"flight":60,"damage":{"Electricity":300},"falloff":{"start":0,"end":3.6,"reduction":0.4}},{"name":"Embedded Detonation","speed":3.33,"crit_chance":24,"crit_mult":2,"status_chance":10,"shot_type":"Projectile","shot_speed":60,"flight":60,"unique":{"force_procs":["electricity"]},"damage":{"Electricity":300},"falloff":{"start":0,"end":3.6,"reduction":0.4}}],"name":"Sancti Castanas","imageName":"sancti-castanas.webp","tags":["Syndicate","New Loka"],"compTags":["PROJECTILE","DEPLOYABLE","AOE","SINGLESHOT"],"comb":[[0,1]]},
  "Ripkas":{"masteryReq":5,"description":"Motorized saw claw weapon.","blockingAngle":55,"comboDuration":5,"followThrough":0.8,"range":1.75,"windUp":0.6,"releaseDate":"2015-03-19","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","slide":"519","slam":{"damage":"519.00","radial":{"damage":"173.00","element":"Impact","radius":6}},"speed":0.883,"crit_chance":20,"crit_mult":2,"status_chance":15,"damage":{"Impact":8.65,"Slash":147.05,"Puncture":17.3}},{"name":"Slam","radius":6,"type":"s","isHeavy":false,"speed":1,"crit_chance":20,"crit_mult":2,"status_chance":15,"damage":{"Impact":346}},{"name":"Heavy Slam","radius":7,"type":"hs","isHeavy":true,"speed":1,"crit_chance":20,"crit_mult":2,"status_chance":15,"damage":{"Blast":519}}],"name":"Ripkas","imageName":"ripkas.webp","tags":["Grineer"],"compTags":["CLAWS_STANCE","RIPKAS"]},
  "Sancti Magistar":{"masteryReq":8,"description":"Each charged attack turns the enemy’s pain into a healing pulse that washes over allies. Also, creates resistance to Status Effects when held.","blockingAngle":50,"comboDuration":5,"followThrough":0.4,"range":2.6,"windUp":1.2,"releaseDate":"2016-09-15","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"480","slam":{"damage":"720.00","radial":{"damage":"240.00","element":"Impact","radius":9}},"speed":1,"crit_chance":30,"crit_mult":2,"status_chance":20,"damage":{"Impact":192,"Slash":12,"Puncture":36}},{"name":"Slam","radius":9,"type":"s","isHeavy":false,"speed":1,"crit_chance":30,"crit_mult":2,"status_chance":20,"damage":{"Impact":480}},{"name":"Heavy Slam","radius":10,"type":"hs","isHeavy":true,"speed":1,"crit_chance":30,"crit_mult":2,"status_chance":20,"damage":{"Blast":720}}],"name":"Sancti Magistar","imageName":"sancti-magistar.webp","tags":["New Loka","Syndicate","Incarnon"],"compTags":["HAMMERS_STANCE"]},
  "Sagek Prime":{"masteryReq":14,"description":"The sidearm of choice for Prime Grineer warriors, Sagek Prime blends Grineer brutality with Orokin aesthetics. When Sagek Prime inflicts a critical hit, its next shot has a chance to gain significant Status Chance.","noise":"Alarming","releaseDate":"2025-12-10","ammoCapacity":450,"productCategory":"Pistols","zoomProps":[[]],"category":"Secondary","trigger":"Auto","type":"Pistol","magazineSize":75,"reloadTime":1.6,"multishot":1,"attacks":[{"name":"Normal Attack","speed":12.33,"crit_chance":30,"crit_mult":2.2,"status_chance":1,"shot_type":"Hit-Scan","unique":{"ammoEff":0.2},"damage":{"Impact":6.112,"Slash":11.642,"Puncture":8.246}}],"name":"Sagek Prime","imageName":"SagekPrime.webp","tags":[],"compTags":[]},
  "Rubico Prime":{"masteryReq":12,"description":"For the hunter, the apex of the sniper's art. For the hunted, a gateway to the next life.","noise":"Alarming","releaseDate":"2018-09-25","ammoCapacity":72,"productCategory":"LongGuns","equipTime":1.1,"category":"Primary","trigger":"Semi","type":"Rifle","magazineSize":5,"reloadTime":2,"multishot":1,"attacks":[{"name":"Unzoomed","punch_through":1,"speed":3.67,"crit_chance":38,"crit_mult":3,"status_chance":16,"shot_type":"Hit-Scan","damage":{"Impact":149.6,"Slash":9.3,"Puncture":28.1},"falloff":{"start":400,"end":600,"reduction":0.5}},{"name":"2.5x Zoom Mode","punch_through":1,"sniperCombo":true,"speed":3.67,"crit_chance":38,"crit_mult":3,"status_chance":16,"shot_type":"Hit-Scan","unique":{"crit_mult":0.35},"damage":{"Impact":149.6,"Slash":9.3,"Puncture":28.1}},{"name":"5.0x Zoom","punch_through":1,"sniperCombo":true,"speed":3.67,"crit_chance":38,"crit_mult":3,"status_chance":16,"shot_type":"Hit-Scan","unique":{"crit_mult":0.5},"damage":{"Impact":149.6,"Slash":9.3,"Puncture":28.1}}],"name":"Rubico Prime","imageName":"rubico-prime.webp","tags":["Prime"],"compTags":["SNIPER_AMMO"]},
  "Sampotes":{"masteryReq":0,"description":"A warrior who prefers brute force will make the most of Sampotes. Its Slams and Heavy Slams have an extended area of effect.","blockingAngle":50,"comboDuration":5,"followThrough":0.4,"range":2.5,"windUp":1.4,"releaseDate":"2023-04-26","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":0.83,"crit_chance":30,"crit_mult":3,"status_chance":28,"damage":{"Impact":173.6,"Puncture":37.2,"Slash":37.2}},{"name":"Slam","radius":6,"type":"s","isHeavy":false,"speed":1,"crit_chance":30,"crit_mult":3,"status_chance":28,"damage":{"Impact":347.2,"Puncture":74.4,"Slash":74.4}},{"name":"Heavy Slam","radius":8,"type":"hs","isHeavy":true,"speed":1,"crit_chance":30,"crit_mult":3,"status_chance":28,"damage":{"Blast":744}}],"name":"Sampotes","imageName":"sampotes.webp","tags":[""],"compTags":["HAMMERS_STANCE"]},
  "Sancti Tigris":{"masteryReq":12,"description":"Echo nature's violent beauty with this special Tigris.","noise":"Alarming","releaseDate":"2015-09-02","ammoCapacity":120,"productCategory":"LongGuns","zoomProps":[[]],"category":"Primary","trigger":"Duplex","type":"Rifle","magazineSize":2,"reloadTime":1.5,"multishot":6,"attacks":[{"name":"Normal Attack","speed":2,"crit_chance":15,"crit_mult":1.5,"status_chance":14,"shot_type":"Hit-Scan","damage":{"Impact":21,"Slash":168,"Puncture":21},"falloff":{"start":8,"end":20,"reduction":0.5714}}],"name":"Sancti Tigris","imageName":"sancti-tigris.webp","tags":["Syndicate","New Loka"],"compTags":["SINGLESHOT","TIGRIS"]},
  "Scindo Prime":{"masteryReq":8,"description":"An ancient executioners weapon, the honor of decapitation by the Scindo Prime was reserved for the Orokin's most respected enemies.","blockingAngle":55,"comboDuration":5,"followThrough":0.6,"range":2.7,"windUp":1.1,"releaseDate":"2014-09-23","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"500","slam":{"damage":"750.00","radial":{"damage":"250.00","element":"Impact","radius":8}},"speed":0.967,"crit_chance":26,"crit_mult":2.4,"status_chance":24,"damage":{"Impact":25,"Slash":200,"Puncture":25}},{"name":"Slam","radius":8,"type":"s","isHeavy":false,"speed":1,"crit_chance":26,"crit_mult":2.4,"status_chance":24,"unique":{"force_procs":["impact"]},"damage":{"Impact":500}},{"name":"Heavy Slam","radius":9,"type":"hs","isHeavy":true,"speed":1,"crit_chance":26,"crit_mult":2.4,"status_chance":24,"damage":{"Blast":750}}],"name":"Scindo Prime","imageName":"scindo-prime.webp","tags":["Prime","Never Vaulted"],"compTags":["HEAVY_BLADE_STANCE"]},
  "Scourge Prime":{"masteryReq":14,"description":"Smite the unrighteous with Harrow Prime's signature speargun.","noise":"Alarming","releaseDate":"2021-12-16","ammoCapacity":360,"productCategory":"LongGuns","equipTime":1.1,"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":40,"reloadTime":2.2,"multishot":1,"attacks":[{"name":"Projectile Impact","speed":2.67,"crit_chance":10,"crit_mult":2,"status_chance":30,"shot_type":"Projectile","shot_speed":40,"flight":40,"damage":{"Corrosive":80}},{"name":"Explosion","speed":2.67,"crit_chance":10,"crit_mult":2,"status_chance":30,"shot_type":"AoE","damage":{"Corrosive":60},"falloff":{"start":0,"end":1.7,"reduction":0.3},"no_headshot_mult":true},{"name":"Spear Throw","isCoMult":true,"speed":1,"crit_chance":10,"crit_mult":2,"status_chance":30,"shot_type":"Projectile","shot_speed":150,"flight":150,"damage":{"Impact":140,"Slash":30,"Puncture":30}},{"name":"Spear Explosion","speed":1,"crit_chance":10,"crit_mult":2,"status_chance":30,"shot_type":"AoE","unique":{"force_procs":["impact"]},"damage":{"Corrosive":55},"falloff":{"start":0,"end":7,"reduction":0.6},"no_headshot_mult":true}],"name":"Scourge Prime","imageName":"scourge-prime.webp","tags":["Tenno","Prime"],"compTags":["PROJECTILE","IMPACTEXPLODE"],"comb":[[0,1],[2,3]]},
  "Scourge":{"masteryReq":6,"description":"Blast targets with corrosive plasma projectiles, or toss the scepter to inflict an energy field upon nearby enemies that amplifies their brain waves to attract bullets.","noise":"Alarming","releaseDate":"2017-06-29","ammoCapacity":200,"productCategory":"LongGuns","equipTime":1.1,"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":40,"reloadTime":2.5,"multishot":1,"attacks":[{"name":"Projectile Impact","speed":2.67,"crit_chance":2,"crit_mult":1.5,"status_chance":30,"shot_type":"Projectile","shot_speed":40,"flight":40,"damage":{"Corrosive":70}},{"name":"Explosion","speed":2.67,"crit_chance":2,"crit_mult":1.5,"status_chance":30,"shot_type":"AoE","damage":{"Corrosive":55},"falloff":{"start":0,"end":1.7,"reduction":0.3},"no_headshot_mult":true},{"name":"Spear Throw Impact","isCoMult":true,"speed":1,"crit_chance":4,"crit_mult":2,"status_chance":30,"shot_type":"Projectile","shot_speed":150,"flight":150,"damage":{"Impact":105,"Slash":22.5,"Puncture":22.5}},{"name":"Spear Throw Explosion","speed":1,"crit_chance":4,"crit_mult":2,"status_chance":30,"shot_type":"AoE","unique":{"force_procs":["impact"]},"damage":{"Corrosive":55},"falloff":{"start":0,"end":7,"reduction":0.6},"no_headshot_mult":true}],"name":"Scourge","imageName":"scourge.webp","tags":["Tenno"],"compTags":["PROJECTILE","IMPACTEXPLODE"],"comb":[[0,1],[2,3]]},
  "Sarofang":{"masteryReq":8,"description":"Mete out the sharp pain of justice. Heavy Slam attacks create a vortex that pulls in lifted enemies when the Sarofang’s Combo Multiplier builds to 8x. In Voruna’s hands, the Sarofang only requires a 5x Combo Multiplier to summon the vortex.","blockingAngle":55,"comboDuration":5,"followThrough":0.6,"range":2.6,"windUp":1.1,"releaseDate":"2022-11-30","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","slide":"400","slam":{"damage":"600.00","radial":{"damage":"200.00","element":"Impact","radius":8}},"speed":1.17,"crit_chance":20,"crit_mult":2,"status_chance":20,"damage":{"Impact":80,"Slash":112,"Puncture":8}},{"name":"Slam","radius":8,"type":"s","isHeavy":false,"speed":1,"crit_chance":20,"crit_mult":2,"status_chance":20,"unique":{"force_procs":["impact"]},"damage":{"Impact":400}},{"name":"Heavy Slam","radius":9,"type":"hs","isHeavy":true,"speed":1,"crit_chance":20,"crit_mult":2,"status_chance":20,"damage":{"Blast":600}}],"name":"Sarofang","imageName":"sarofang.webp","tags":["Lua","Voruna"],"compTags":["HEAVY_BLADE_STANCE"]},
  "Scoliac":{"masteryReq":6,"description":"The Scoliac Whip is a nasty parasitic growth of sinew and bone that can inflict heart stopping <DT_POISON>Toxin Damage with attacks.","blockingAngle":45,"comboDuration":5,"followThrough":0.5,"range":2.4963856,"windUp":0.4,"releaseDate":"2013-12-19","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"300","slam":{"damage":"450.00","radial":{"damage":"150.00","radius":5}},"speed":1.25,"crit_chance":13,"crit_mult":1.5,"status_chance":29,"damage":{"Impact":22.5,"Slash":105,"Puncture":22.5}},{"name":"Slam","radius":5,"type":"s","isHeavy":false,"speed":1,"crit_chance":13,"crit_mult":1.5,"status_chance":29,"unique":{"force_procs":["impact"]},"damage":{"Toxin":300}},{"name":"Heavy Slam","radius":6,"type":"hs","isHeavy":true,"speed":1,"crit_chance":13,"crit_mult":1.5,"status_chance":29,"damage":{"Toxin":450}}],"name":"Scoliac","imageName":"scoliac.webp","tags":["Infested"],"compTags":["WHIPS_STANCE"]},
  "Sarpa":{"masteryReq":8,"description":"Makes sweeping cuts punctuated by bursts of heavy gunfire.","blockingAngle":45,"comboDuration":5,"followThrough":0.5,"range":2,"windUp":0.30000001,"releaseDate":"2016-08-19","productCategory":"Melee","zoomProps":[[]],"category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"320","slam":{"damage":"480.00","radial":{"damage":"160.00","element":"Impact","radius":5}},"isHeavy":false,"speed":1,"crit_chance":14,"crit_mult":2,"status_chance":28,"damage":{"Impact":16,"Slash":112,"Puncture":32}},{"name":"Ranged Attack","punch_through":1,"isHeavy":true,"speed":3.33,"crit_chance":14,"crit_mult":2,"status_chance":28,"shot_type":"Hit-Scan","damage":{"Impact":3.5,"Slash":21,"Puncture":10.5},"falloff":{"start":20,"end":40,"reduction":0.8571},"charge_time":0.3},{"name":"Slam","radius":5,"type":"s","isHeavy":false,"speed":1,"crit_chance":14,"crit_mult":2,"status_chance":28,"unique":{"force_procs":["impact"]},"damage":{"Impact":320}},{"name":"Heavy Slam","radius":6,"type":"hs","isHeavy":true,"speed":1,"crit_chance":14,"crit_mult":2,"status_chance":28,"damage":{"Blast":480}}],"name":"Sarpa","imageName":"sarpa.webp","tags":["Tenno"],"compTags":["GUNBLADE_STANCE"]},
  "Sarofang Prime":{"masteryReq":16,"description":"Voruna Prime's Signature axe is adorned with Orokin gold. She personally ensured that the former owners would have no further use for it.","blockingAngle":55,"comboDuration":5,"followThrough":0.6,"range":2.6,"windUp":1.1,"releaseDate":"2026-04-08","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":1.17,"crit_chance":30,"crit_mult":3,"status_chance":30,"damage":{"Impact":66,"Slash":145.2,"Puncture":8.8}},{"name":"Slam","radius":8,"type":"s","isHeavy":false,"speed":1,"crit_chance":30,"crit_mult":3,"status_chance":10,"unique":{"force_procs":["impact"]},"damage":{"Impact":440}},{"name":"Heavy Slam","radius":9,"type":"hs","isHeavy":true,"speed":1,"crit_chance":30,"crit_mult":3,"status_chance":10,"damage":{"Blast":660}}],"name":"Sarofang Prime","imageName":"SarofangPrime.webp","tags":["Voruna"],"compTags":["HEAVY_BLADE_STANCE"]},
  "Scindo":{"masteryReq":2,"description":"The Scindo is a heavy war axe crafted by the Tenno. Reduced speed and agility is balanced by heavy, devastating strikes capable of connecting with multiple targets at once.","blockingAngle":55,"comboDuration":5,"followThrough":0.6,"range":2.6,"windUp":1.1,"releaseDate":"2013-01-14","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"400","slam":{"damage":"600.00","radial":{"damage":"200.00","radius":8}},"speed":0.917,"crit_chance":15,"crit_mult":1.5,"status_chance":10,"damage":{"Impact":20,"Slash":160,"Puncture":20}},{"name":"Slam","radius":8,"type":"s","isHeavy":false,"speed":1,"crit_chance":15,"crit_mult":1.5,"status_chance":10,"unique":{"force_procs":["impact"]},"damage":{"Impact":400}},{"name":"Heavy Slam","radius":9,"type":"hs","isHeavy":true,"speed":1,"crit_chance":15,"crit_mult":1.5,"status_chance":10,"damage":{"Blast":600}}],"name":"Scindo","imageName":"scindo.webp","tags":["Tenno"],"compTags":["HEAVY_BLADE_STANCE"]},
  "Scyotid":{"masteryReq":12,"description":"Go on the hunt with Oraxia's signature secondary. Fling a volley of toxin-laced barbs, or drop a cluster snare that scatters on impact, seizing nearby enemies and dragging them together.","noise":"Silent","releaseDate":"2025-06-25","ammoCapacity":320,"productCategory":"Pistols","category":"Secondary","trigger":"Auto","type":"Secondary","magazineSize":40,"reloadTime":1.6,"multishot":1,"attacks":[{"name":"Auto","multishot":4,"punch_through":1.6,"speed":2.4,"crit_chance":24,"crit_mult":2.4,"status_chance":18,"shot_type":"Projectile","shot_speed":60,"damage":{"Puncture":8,"Toxin":32}},{"name":"Semi","speed":1.6,"crit_chance":8,"crit_mult":2.4,"status_chance":32,"shot_type":"AoE","damage":{"Toxin":40},"no_headshot_mult":true}],"name":"Scyotid","imageName":"Scyotid.webp","tags":[],"compTags":[]},
  "Secura Lecta":{"masteryReq":8,"description":"Whip the enemy out of their ill-gotten gains; double credit drops on kills.","blockingAngle":45,"comboDuration":5,"followThrough":0.5,"range":2.4963856,"windUp":0.4,"releaseDate":"2016-09-15","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"352","slam":{"damage":"528.00","radial":{"damage":"176.00","element":"Electricity","radius":5}},"speed":1.25,"crit_chance":15,"crit_mult":1.5,"status_chance":30,"damage":{"Slash":66,"Puncture":30,"Electricity":80}},{"name":"Slam","radius":5,"type":"s","isHeavy":false,"speed":1,"crit_chance":15,"crit_mult":1.5,"status_chance":30,"unique":{"force_procs":["impact"]},"damage":{"Electricity":352}},{"name":"Heavy Slam","radius":6,"type":"hs","isHeavy":true,"speed":1,"crit_chance":15,"crit_mult":1.5,"status_chance":30,"damage":{"Electricity":528}}],"name":"Secura Lecta","imageName":"secura-lecta.webp","tags":["Syndicate","Perrin Sequence"],"compTags":["WHIPS_STANCE"]},
  "Sepfahn (Staff)":{"masteryReq":0,"description":"","comboDuration":5,"range":1,"windUp":1,"releaseDate":"2018-04-20","productCategory":"Melee","category":"Melee","type":"Zaw Component","multishot":1,"attacks":[{"name":"Sepfahn Strike","speed":0.92,"crit_chance":20,"crit_mult":2,"status_chance":20,"damage":{"Impact":22.6,"Slash":146.9,"Puncture":56.5}}],"name":"Sepfahn (Staff)","imageName":"sepfahn.webp","tags":[],"compTags":["STAVES_STANCE"]},
  "Secura Penta":{"masteryReq":12,"description":"Ruthless and efficient, just like the free-market.","noise":"Alarming","releaseDate":"2015-09-02","ammoCapacity":28,"productCategory":"LongGuns","equipTime":0.4,"category":"Primary","trigger":"Active","type":"Rifle","magazineSize":7,"reloadTime":2.5,"multishot":1,"attacks":[{"name":"Grenade Impact","speed":2,"crit_chance":26,"crit_mult":2,"status_chance":26,"shot_type":"Projectile","shot_speed":25,"flight":25,"damage":{"Impact":75}},{"name":"Grenade Detonation","speed":2,"crit_chance":26,"crit_mult":2,"status_chance":26,"shot_type":"AoE","damage":{"Blast":300},"falloff":{"start":0,"end":6,"reduction":0.6},"no_headshot_mult":true}],"name":"Secura Penta","imageName":"secura-penta.webp","tags":["Syndicate","Perrin Sequence"],"compTags":["PROJECTILE","SNIPER_AMMO","AOE","SINGLESHOT","PENTA"],"comb":[[0,1]]},
  "Serro":{"masteryReq":6,"description":"Developed as an energy saw to scrap obsolete ships, this tool was quickly banned when rebels in the Sedna region discovered it also made an excellent weapon.","blockingAngle":55,"comboDuration":5,"followThrough":0.6,"range":3,"windUp":0.9,"releaseDate":"2014-05-21","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"468","slam":{"damage":"702.00","radial":{"damage":"234.00","radius":7}},"speed":0.917,"crit_chance":8,"crit_mult":1.5,"status_chance":26,"damage":{"Slash":96,"Electricity":138}},{"name":"Slam","radius":7,"type":"s","isHeavy":false,"speed":1,"crit_chance":8,"crit_mult":1.5,"status_chance":26,"unique":{"force_procs":["impact"]},"damage":{"Blast":468}},{"name":"Heavy Slam","radius":8,"type":"hs","isHeavy":true,"speed":1,"crit_chance":8,"crit_mult":1.5,"status_chance":26,"damage":{"Blast":702}}],"name":"Serro","imageName":"serro.webp","tags":["Corpus"],"compTags":["POLEARMS_STANCE"]},
  "Sepfahn (Nikana)":{"masteryReq":0,"description":"","comboDuration":5,"range":1,"windUp":1,"releaseDate":"2018-04-20","productCategory":"Melee","category":"Melee","type":"Zaw Component","multishot":1,"attacks":[{"name":"Sepfahn Strike","speed":0.92,"crit_chance":20,"crit_mult":2,"status_chance":20,"damage":{"Impact":22.6,"Slash":146.9,"Puncture":56.5}}],"name":"Sepfahn (Nikana)","imageName":"sepfahn.webp","tags":[],"compTags":["NIKANAS_STANCE"]},
  "Seer":{"masteryReq":0,"description":"Captain Vor's prized Orokin-Grineer hybrid pistol has an average rate of fire, but it has high damage and superior zoom capabilities.","noise":"Alarming","releaseDate":"2013-07-13","productCategory":"Pistols","zoomProps":[[]],"category":"Secondary","trigger":"Semi","type":"Pistol","magazineSize":8,"reloadTime":2.8,"multishot":1,"attacks":[{"name":"Normal Attack","isCoMult":true,"speed":2,"crit_chance":5,"crit_mult":1.5,"status_chance":13,"shot_type":"Projectile","shot_speed":500,"flight":500,"damage":{"Impact":33.67,"Slash":33.67,"Puncture":33.67}}],"name":"Seer","imageName":"seer.webp","tags":["Grineer"],"compTags":["PROJECTILE"]},
  "Secura Dual Cestra":{"masteryReq":10,"description":"The favored side-arms of Perrin Sequence executives, these pistols have been modified to improve efficiency and killing potential.","noise":"Alarming","releaseDate":"2014-11-27","ammoCapacity":480,"productCategory":"Pistols","category":"Secondary","trigger":"Auto","type":"Pistol","magazineSize":120,"reloadTime":3.5,"multishot":1,"attacks":[{"name":"Normal Attack","speed":12.5,"crit_chance":16,"crit_mult":1.6,"status_chance":28,"shot_type":"Projectile","shot_speed":100,"flight":100,"damage":{"Impact":5.6,"Puncture":22.4}}],"name":"Secura Dual Cestra","imageName":"secura-dual-cestra.webp","tags":["Syndicate","Perrin Sequence"],"compTags":["PROJECTILE"]},
  "Sepulcrum":{"masteryReq":14,"description":"An ancient weapon designed by the Entrati. Primary fire siphons life essence from the target to fuel a devastating secondary fire. This large, weighty double-barreled pistol delivers twin projectiles that pack a punch, exploding on impact. Secondary fire puts the weapon in lock-on mode. Aim to lock onto multiple targets, then fire to unleash homing projectiles.","noise":"Alarming","releaseDate":"2020-08-25","ammoCapacity":180,"productCategory":"Pistols","zoomProps":[[]],"category":"Secondary","trigger":"Burst","type":"Pistol","magazineSize":90,"reloadTime":4,"multishot":1,"attacks":[{"name":"Primary-Fire","isCoMult":true,"speed":1.83,"crit_chance":30,"crit_mult":2.2,"status_chance":14,"shot_type":"Projectile","shot_speed":200,"flight":200,"damage":{"Impact":9.6,"Slash":11.5,"Puncture":26.9},"burst_count":2,"burst_delay":0},{"name":"Radial Attack","speed":1.83,"crit_chance":30,"crit_mult":2.2,"status_chance":14,"shot_type":"AoE","damage":{"Heat":46},"falloff":{"start":0,"end":1.6,"reduction":0.2},"no_headshot_mult":true,"burst_count":2,"burst_delay":0},{"name":"Lock-On Mode","isCoMult":true,"speed":1,"crit_chance":38,"crit_mult":3,"status_chance":26,"shot_type":"Projectile","shot_speed":60,"flight":60,"unique":{"force_procs":["impact"]},"damage":{"Impact":19.2,"Slash":23,"Puncture":53.8}},{"name":"Lock-On Radial Attack","speed":1,"crit_chance":38,"crit_mult":3,"status_chance":26,"shot_type":"AoE","damage":{"Heat":480},"falloff":{"start":0,"end":3,"reduction":0.2},"no_headshot_mult":true}],"name":"Sepulcrum","imageName":"sepulcrum.webp","tags":["Entrati"],"compTags":["SINGLESHOT","AOE"],"comb":[[0,1],[2,3]]},
  "Shadow Claws (Sevagoth)":{"masteryReq":0,"description":"Shadow Claws is SevagothIcon272.webp Sevagoth's Shadow's signature Exalted Weapon","blockingAngle":60,"comboDuration":5,"followThrough":1,"range":1.5,"windUp":0.9,"releaseDate":"2021-04-13","productCategory":"Melee","category":"Melee","type":"Exalted Weapon","multishot":1,"attacks":[{"name":"Normal Attack","slide":"500","slam":{"damage":"1000.00","radial":{"damage":"1000.00","radius":9}},"speed":1,"crit_chance":38,"crit_mult":2.6,"status_chance":24,"damage":{"Impact":75,"Slash":125,"Puncture":50}},{"name":"Slam","radius":8,"type":"s","isHeavy":false,"speed":1,"crit_chance":38,"crit_mult":2.6,"status_chance":24,"unique":{"force_procs":["impact"]},"damage":{"Impact":500}},{"name":"Heavy Slam","radius":9,"type":"hs","isHeavy":true,"speed":1,"crit_chance":38,"crit_mult":2.6,"status_chance":24,"damage":{"Blast":750}}],"name":"Shadow Claws (Sevagoth)","imageName":"ShadowClaws.webp","tags":[],"compTags":["SHADOW_CLAWS_STANCE","POWER_WEAPON"]},
  "Shaku":{"masteryReq":10,"description":"With these blazing fast nunchaku, the enemy will never know what hit them.","blockingAngle":55,"comboDuration":5,"followThrough":0.5,"range":2.2079918,"windUp":0.5,"releaseDate":"2015-12-16","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"360","slam":{"damage":"360.00","radial":{"damage":"180.00","radius":6}},"speed":1.17,"crit_chance":18,"crit_mult":2,"status_chance":34,"damage":{"Impact":180}},{"name":"Slam","radius":6,"type":"s","isHeavy":false,"speed":1,"crit_chance":18,"crit_mult":2,"status_chance":34,"unique":{"force_procs":["impact"]},"damage":{"Impact":360}},{"name":"Heavy Slam","radius":7,"type":"hs","isHeavy":true,"speed":1,"crit_chance":18,"crit_mult":2,"status_chance":34,"damage":{"Blast":540}}],"name":"Shaku","imageName":"shaku.webp","tags":["Tenno"],"compTags":["NUNCHAKU_STANCE"]},
  "Sicarus":{"masteryReq":3,"description":"The Sicarus fires 3-round bursts, which provides a balance between the lethality of auto-pistols and the accuracy of semi-automatic pistols.","noise":"Alarming","releaseDate":"2012-10-25","productCategory":"Pistols","category":"Secondary","trigger":"Burst","type":"Pistol","magazineSize":15,"reloadTime":2,"multishot":1,"attacks":[{"name":"Normal Attack","speed":3.5,"crit_chance":16,"crit_mult":2,"status_chance":6,"shot_type":"Hit-Scan","damage":{"Impact":21,"Slash":4.5,"Puncture":4.5},"burst_count":3,"burst_delay":0.04},{"name":"Incarnon Form","speed":3.5,"crit_chance":20,"crit_mult":3,"status_chance":20,"shot_type":"Hit-Scan","damage":{"Impact":28,"Slash":6,"Puncture":6},"burst_count":3,"burst_delay":0.04}],"incMagazineSize":120,"name":"Sicarus","imageName":"sicarus.webp","tags":["Tenno","Incarnon"],"compTags":[]},
  "Sibear":{"masteryReq":6,"description":"Ice in motion can crush mountains, this frozen hammer is no different.","blockingAngle":50,"comboDuration":5,"followThrough":0.4,"range":2.6,"windUp":1.2,"releaseDate":"2016-04-06","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"540","slam":{"damage":"810.00","radial":{"damage":"270.00","radius":9}},"speed":1,"crit_chance":15,"crit_mult":2,"status_chance":30,"damage":{"Impact":70,"Slash":50,"Puncture":20,"Cold":130}},{"name":"Slam","radius":9,"type":"s","isHeavy":false,"speed":1,"crit_chance":15,"crit_mult":2,"status_chance":30,"damage":{"Cold":540}},{"name":"Heavy Slam","radius":10,"type":"hs","isHeavy":true,"speed":1,"crit_chance":15,"crit_mult":2,"status_chance":30,"damage":{"Cold":810}}],"name":"Sibear","imageName":"sibear.webp","tags":["Tenno","Incarnon"],"compTags":["HAMMERS_STANCE"]},
  "Shedu":{"masteryReq":13,"description":"This arm-cannon, ripped from a Sentient, rapid-fires thermal pulses that explode in an electrical blast. Features an ammo-less quick charge capacitor, that emits a knock-back pulse and strips Sentient damage resistances when fully discharged.","noise":"Alarming","releaseDate":"2019-12-13","productCategory":"LongGuns","equipTime":1.6,"zoomProps":[[]],"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":7,"reloadTime":1.25,"multishot":1,"attacks":[{"name":"Normal Attack","isCoMult":true,"speed":2.5,"crit_chance":25,"crit_mult":2.1,"status_chance":23,"shot_type":"Projectile","shot_speed":200,"flight":200,"damage":{"Heat":71}},{"name":"Radial Attack","speed":2.5,"crit_chance":25,"crit_mult":2.1,"status_chance":23,"shot_type":"AoE","damage":{"Electricity":87},"falloff":{"start":0,"end":6.6,"reduction":0.6},"no_headshot_mult":true}],"reloadRate":28,"reloadDelay":0.4,"name":"Shedu","imageName":"shedu.webp","tags":["Sentient"],"compTags":["ASSAULT_AMMO","PROJECTILE","AOE"],"comb":[[0,1]]},
  "Sigma & Octantis":{"masteryReq":10,"description":"Deadly slashes from the Sigma sword are matched only by the force of the Octantis shield when thrown from the air.","blockingAngle":70,"comboDuration":5,"followThrough":0.6,"range":2.5,"windUp":0.7,"releaseDate":"2017-10-30","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"174","slam":{"damage":"522.00","radial":{"damage":"174.00","radius":7}},"speed":1.08,"crit_chance":28,"crit_mult":2.2,"status_chance":16,"damage":{"Impact":38.28,"Slash":107.88,"Puncture":27.84}},{"name":"Slam","radius":7,"type":"s","isHeavy":false,"speed":1,"crit_chance":28,"crit_mult":2.2,"status_chance":16,"unique":{"force_procs":["impact"]},"damage":{"Impact":348}},{"name":"Heavy Slam","radius":8,"type":"hs","isHeavy":true,"speed":1,"crit_chance":28,"crit_mult":2.2,"status_chance":16,"damage":{"Blast":522}}],"name":"Sigma & Octantis","imageName":"sigma-&-octantis.webp","tags":["Tenno"],"compTags":["SWORDS_AND_SHIELD_STANCE"]},
  "Sheev":{"masteryReq":5,"description":"Built for close combat, the Sheev's plasma blade slices through flesh and armor with equal ease.","blockingAngle":45,"comboDuration":5,"followThrough":0.9,"range":1.7,"windUp":0.4,"releaseDate":"2014-09-17","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","slide":"540","slam":{"damage":"540.00","radial":{"damage":"270.00","element":"Heat","radius":5}},"speed":0.667,"crit_chance":13,"crit_mult":2.1,"status_chance":25,"damage":{"Impact":13.5,"Slash":243,"Puncture":13.5}},{"name":"Slam","radius":5,"type":"s","isHeavy":false,"speed":1,"crit_chance":13,"crit_mult":2.1,"status_chance":25,"unique":{"force_procs":["impact"]},"damage":{"Heat":540}},{"name":"Heavy Slam","radius":6,"type":"hs","isHeavy":true,"speed":1,"crit_chance":13,"crit_mult":2.1,"status_chance":25,"damage":{"Heat":810}}],"name":"Sheev","imageName":"sheev.webp","tags":["Grineer"],"compTags":["DAGGERS_STANCE"]},
  "Sicarus Prime":{"masteryReq":14,"description":"The Sicarus Prime is an ornamental firearm that fires rounds in rapid bursts, providing a balance between the lethality of auto-pistols and the accuracy of semi-automatic pistols.","noise":"Alarming","releaseDate":"2013-11-20","productCategory":"Pistols","category":"Secondary","trigger":"Burst","type":"Pistol","magazineSize":24,"reloadTime":2,"multishot":1,"attacks":[{"name":"Normal Attack","speed":5,"crit_chance":25,"crit_mult":2,"status_chance":20,"shot_type":"Hit-Scan","damage":{"Impact":20,"Slash":15,"Puncture":15},"burst_count":3,"burst_delay":0.04},{"name":"Incarnon Form","speed":5,"crit_chance":30,"crit_mult":3,"status_chance":20,"shot_type":"Hit-Scan","damage":{"Impact":24,"Slash":18,"Puncture":18},"burst_count":3,"burst_delay":0.04}],"incMagazineSize":120,"name":"Sicarus Prime","imageName":"sicarus-prime.webp","tags":["Prime","Vaulted","Incarnon"],"compTags":[]},
  "Shadow Clones (Ash)":{"masteryReq":0,"description":"Ash Prime's fearsome Shadow Clones, as projected by his Blade Storm ability.","blockingAngle":90,"comboDuration":5,"followThrough":0.5,"windUp":0.4,"noise":"Silent","releaseDate":"2025-03-19","productCategory":"Melee","category":"Melee","type":"Exalted Weapon","multishot":1,"attacks":[{"name":"Normal Attack","enableFinisherModsWithSlash":true,"isHeavy":false,"speed":1,"crit_chance":5,"crit_mult":1.2,"status_chance":5,"unique":{"force_procs":["slash"]},"damage":{"finisher":1500}}],"name":"Shadow Clones (Ash)","imageName":"bladestorm.webp","tags":[],"compTags":["ASH_STANCE","POWER_WEAPON"]},
  "Silva & Aegis Prime":{"masteryReq":12,"description":"A perfectly crafted pairing, this mace and shield combination is sculpted for exhibition but balanced for the battlefield.","blockingAngle":70,"comboDuration":5,"followThrough":0.6,"range":2.5,"windUp":0.7,"releaseDate":"2017-05-30","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"318heat","slam":{"damage":"954.00","radial":{"damage":"318.00","element":"Heat","radius":7}},"speed":0.75,"crit_chance":25,"crit_mult":2,"status_chance":30,"damage":{"Heat":318}},{"name":"Slam","radius":7,"type":"s","isHeavy":false,"speed":1,"crit_chance":25,"crit_mult":2,"status_chance":30,"unique":{"force_procs":["impact"]},"damage":{"Heat":636}},{"name":"Heavy Slam","radius":8,"type":"hs","isHeavy":true,"speed":1,"crit_chance":25,"crit_mult":2,"status_chance":30,"damage":{"Heat":954}}],"name":"Silva & Aegis Prime","imageName":"silva-&-aegis-prime.webp","tags":["Prime","Vaulted"],"compTags":["SWORDS_AND_SHIELD_STANCE"]},
  "Silva & Aegis":{"masteryReq":0,"description":"This fiery sword and shield combination perfects the balance of Tenno offense and defense prowess. In the hands of a Master, even a defensive tool like a shield can be used as a weapon.","blockingAngle":70,"comboDuration":5,"followThrough":0.6,"range":2.5,"windUp":0.7,"releaseDate":"2014-07-18","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"98heat","slam":{"damage":"294.00","radial":{"damage":"98.00","radius":7}},"speed":1,"crit_chance":5,"crit_mult":1.5,"status_chance":20,"damage":{"Heat":98}},{"name":"Slam","radius":7,"type":"s","isHeavy":false,"speed":1,"crit_chance":5,"crit_mult":1.5,"status_chance":20,"unique":{"force_procs":["impact"]},"damage":{"Impact":196}},{"name":"Heavy Slam","radius":8,"type":"hs","isHeavy":true,"speed":1,"crit_chance":5,"crit_mult":1.5,"status_chance":20,"damage":{"Blast":294}}],"name":"Silva & Aegis","imageName":"silva-&-aegis.webp","tags":["Tenno"],"compTags":["SWORDS_AND_SHIELD_STANCE"]},
  "Simulor":{"masteryReq":5,"description":"Creates miniature gravitational singularities that can be used for scientific study or self-defense.","noise":"Alarming","releaseDate":"2015-06-25","ammoCapacity":72,"productCategory":"LongGuns","equipTime":1.1,"zoomProps":[[]],"category":"Primary","trigger":"Active","type":"Rifle","magazineSize":8,"reloadTime":3,"multishot":1,"attacks":[{"name":"Orb Launch","speed":3,"crit_chance":12,"crit_mult":2,"status_chance":30,"shot_type":"Projectile","shot_speed":80,"flight":80,"damage":{}},{"name":"Orb Merging Damage","speed":3,"crit_chance":12,"crit_mult":2,"status_chance":30,"damage":{"Magnetic":100}},{"name":"Orb Explosion","speed":3,"crit_chance":12,"crit_mult":2,"status_chance":30,"shot_type":"AoE","unique":{"force_procs":["electricity"]},"damage":{"Magnetic":200},"falloff":{"start":0,"end":5,"reduction":0.6},"no_headshot_mult":true}],"name":"Simulor","imageName":"simulor.webp","tags":["Cephalon"],"compTags":["ASSAULT_AMMO","AOE","PROJECTILE"],"comb":[[1,2]]},
  "Snipetron":{"masteryReq":0,"description":"Manufactured by the Corpus, the Snipetron is a powerful and accurate rifle that sports optical zoom capabilities. Perfect for long range engagements.","noise":"Alarming","releaseDate":"2012-10-25","ammoCapacity":72,"productCategory":"LongGuns","equipTime":1.1,"zoomProps":[{"Upgrades":[{"DamageType":"DT_ANY","OperationType":"STACKING_MULTIPLY","UpgradeType":"mult_for_head","Value":0.3}]},{"Upgrades":[{"DamageType":"DT_ANY","OperationType":"STACKING_MULTIPLY","UpgradeType":"mult_for_head","Value":0.5}]}],"category":"Primary","trigger":"Semi","type":"Rifle","magazineSize":4,"reloadTime":3.5,"multishot":1,"attacks":[{"name":"Unzoomed","punch_through":2.5,"speed":2,"crit_chance":30,"crit_mult":1.5,"status_chance":12,"shot_type":"Hit-Scan","damage":{"Impact":18,"Slash":18,"Puncture":144},"falloff":{"start":400,"end":600,"reduction":0.5}},{"name":"6x Zoom","punch_through":2.5,"sniperCombo":true,"speed":2,"crit_chance":30,"crit_mult":1.5,"status_chance":12,"shot_type":"Hit-Scan","damage":{"Impact":18,"Slash":18,"Puncture":144},"falloff":{"start":400,"end":600,"reduction":0.5}}],"name":"Snipetron","imageName":"snipetron.webp","tags":["Corpus"],"compTags":["SNIPER_AMMO"]},
  "Skana Prime":{"masteryReq":12,"description":"A basic blade known as a Skana. It is widely used by the Tenno. Prime model offers slightly increased damage.","blockingAngle":50,"comboDuration":5,"followThrough":0.6,"range":2.5,"windUp":0.6,"releaseDate":"2012-12-18","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"210","slam":{"damage":"630.00","radial":{"damage":"210.00","radius":7}},"speed":1,"crit_chance":26,"crit_mult":2.6,"status_chance":26,"damage":{"Impact":31.5,"Slash":147,"Puncture":31.5}},{"name":"Slam","radius":7,"type":"s","isHeavy":false,"speed":1,"crit_chance":26,"crit_mult":2.6,"status_chance":26,"unique":{"force_procs":["impact"]},"damage":{"Impact":420}},{"name":"Heavy Slam","radius":7,"type":"hs","isHeavy":true,"speed":1,"crit_chance":26,"crit_mult":2.6,"status_chance":26,"damage":{"Blast":630}}],"name":"Skana Prime","imageName":"skana-prime.webp","tags":["Prime","Vaulted","Founder","Incarnon"],"compTags":["SWORDS_STANCE","SKANA"]},
  "Sobek":{"masteryReq":7,"description":"Sobek is a rapid-firing Grineer shotgun that has reduced damage per shot but boasts extra large magazine capacity.","noise":"Alarming","releaseDate":"2013-07-13","ammoCapacity":240,"productCategory":"LongGuns","zoomProps":[[]],"category":"Primary","trigger":"Auto","type":"Shotgun","magazineSize":20,"reloadTime":2.7,"multishot":5,"attacks":[{"name":"Normal Attack","speed":2.5,"crit_chance":11,"crit_mult":2,"status_chance":16.2,"shot_type":"Hit-Scan","damage":{"Impact":52.5,"Slash":8.75,"Puncture":8.75},"falloff":{"start":20,"end":30,"reduction":0.5}}],"name":"Sobek","imageName":"sobek.webp","tags":["Grineer"],"compTags":["SOBEK"]},
  "Skana":{"masteryReq":0,"description":"Before all other weapons, Tenno master the Skana. This simple blade becomes immensely powerful in the hands of a master. For Tenno, it is the foundation of their fighting style and a pillar of their culture.","blockingAngle":55,"comboDuration":5,"followThrough":0.6,"range":2.5,"windUp":0.6,"releaseDate":"2012-10-25","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","slide":"75","slam":{"damage":"360.00","radial":{"damage":"120.00","radius":7}},"speed":0.833,"crit_chance":5,"crit_mult":1.5,"status_chance":16,"damage":{"Impact":18,"Slash":84,"Puncture":18}},{"name":"Slam","radius":7,"type":"s","isHeavy":false,"speed":1,"crit_chance":5,"crit_mult":1.5,"status_chance":16,"unique":{"force_procs":["impact"]},"damage":{"Impact":240}},{"name":"Heavy Slam","radius":8,"type":"hs","isHeavy":true,"speed":1,"crit_chance":5,"crit_mult":1.5,"status_chance":16,"damage":{"Blast":360}}],"name":"Skana","imageName":"skana.webp","tags":["Tenno","Incarnon"],"compTags":["SWORDS_STANCE","SKANA"]},
  "Skiajati":{"masteryReq":11,"description":"Forged of steel grafted from Umbra's flesh, this elegant Nikana unites with its Warframe to form a single being of seething purpose.","blockingAngle":55,"comboDuration":5,"followThrough":0.7,"range":2.7,"windUp":0.5,"releaseDate":"2018-06-15","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"350","slam":{"damage":"525.00","radial":{"damage":"175.00","element":"Impact","radius":6}},"speed":1.17,"crit_chance":19,"crit_mult":2.1,"status_chance":30,"damage":{"Impact":26.25,"Slash":136.5,"Puncture":12.25}},{"name":"Slam","radius":6,"type":"s","isHeavy":false,"speed":1,"crit_chance":19,"crit_mult":2.1,"status_chance":30,"unique":{"force_procs":["impact"]},"damage":{"Impact":350}},{"name":"Heavy Slam","radius":7,"type":"hs","isHeavy":true,"speed":1,"crit_chance":19,"crit_mult":2.1,"status_chance":30,"damage":{"Blast":525}}],"name":"Skiajati","imageName":"skiajati.webp","tags":["Tenno"],"compTags":["NIKANAS_STANCE"]},
  "Snipetron Vandal":{"masteryReq":5,"description":"A customized version of the elusive Snipetron, with metallic finish and Lotus decal.","noise":"Alarming","releaseDate":"2013-07-08","ammoCapacity":72,"productCategory":"LongGuns","equipTime":1.1,"zoomProps":[{"Upgrades":[{"DamageType":"DT_ANY","OperationType":"STACKING_MULTIPLY","UpgradeType":"mult_for_head","Value":0.3}]},{"Upgrades":[{"DamageType":"DT_ANY","OperationType":"STACKING_MULTIPLY","UpgradeType":"mult_for_head","Value":0.5}]}],"category":"Primary","trigger":"Semi","type":"Rifle","magazineSize":6,"reloadTime":2,"multishot":1,"attacks":[{"name":"Unzoomed","punch_through":3,"speed":2,"crit_chance":28,"crit_mult":2,"status_chance":16,"shot_type":"Hit-Scan","damage":{"Impact":10,"Slash":10,"Puncture":180},"falloff":{"start":400,"end":600,"reduction":0.5}},{"name":"6x Zoom","punch_through":3,"sniperCombo":true,"speed":2,"crit_chance":28,"crit_mult":2,"status_chance":16,"shot_type":"Hit-Scan","damage":{"Impact":10,"Slash":10,"Puncture":180},"falloff":{"start":400,"end":600,"reduction":0.5}}],"name":"Snipetron Vandal","imageName":"snipetron-vandal.webp","tags":["Corpus","Vandal"],"compTags":["SNIPER_AMMO"]},
  "Shattered Lash (Gara)":{"masteryReq":0,"description":"Gara devastating Shattered Lash Prime, created by her Shattered lash ability.","blockingAngle":90,"comboDuration":5,"followThrough":0.5,"range":1.8,"windUp":0.4,"noise":"Silent","releaseDate":"2025-03-19","productCategory":"Melee","category":"Melee","type":"Exalted Weapon","multishot":1,"attacks":[{"name":"Normal Attack","isHeavy":false,"speed":1,"crit_chance":20,"crit_mult":2,"status_chance":30,"unique":{"set_speed_to_default":1},"damage":{"Puncture":400}},{"name":"Arcing Damage","isHeavy":false,"speed":1,"crit_chance":20,"crit_mult":2,"status_chance":30,"unique":{"set_speed_to_default":1},"damage":{"Slash":400}}],"name":"Shattered Lash (Gara)","imageName":"ShatteredLash.webp","tags":[],"compTags":["GARA_STANCE","POWER_WEAPON"]},
  "Slaytra":{"masteryReq":13,"description":"The Slaytra is a powerful reiteration of the traditional Grineer Machete that doubles the duration of bleed from slash damage.","blockingAngle":55,"comboDuration":5,"followThrough":0.7,"range":2.5,"windUp":0.7,"releaseDate":"2022-09-07","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","slide":"666","slam":{"damage":"999.00","radial":{"damage":"333.00","radius":8}},"speed":0.833,"crit_chance":21,"crit_mult":1.9,"status_chance":35,"damage":{"Impact":73.26,"Slash":166.5,"Puncture":93.24}},{"name":"Slam","radius":8,"type":"s","isHeavy":false,"speed":1,"crit_chance":21,"crit_mult":1.9,"status_chance":35,"unique":{"force_procs":["impact"]},"damage":{"Impact":666}},{"name":"Heavy Slam","radius":9,"type":"hs","isHeavy":true,"speed":1,"crit_chance":21,"crit_mult":1.9,"status_chance":35,"damage":{"Blast":999}}],"name":"Slaytra","imageName":"slaytra.webp","tags":["Grineer"],"compTags":["MACHETES_STANCE"]},
  "Soma Prime":{"masteryReq":7,"description":"Known for taking down whole squads with its single massive magazine, few weapons were as feared as the Prime Soma.","noise":"Alarming","releaseDate":"2014-12-16","ammoCapacity":800,"productCategory":"LongGuns","equipTime":1.1,"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":200,"reloadTime":3,"multishot":1,"attacks":[{"name":"Fully Spooled","speed":15,"crit_chance":30,"crit_mult":3,"status_chance":10,"shot_type":"Hit-Scan","damage":{"Impact":1.2,"Slash":6,"Puncture":4.8}},{"name":"Incarnon Form","multishot":8,"isInc":1,"speed":7,"crit_chance":10,"crit_mult":3.4,"status_chance":2.8,"damage":{"Impact":1.1,"Slash":10.8,"Puncture":6.1}}],"incMagazineSize":200,"name":"Soma Prime","imageName":"soma-prime.webp","tags":["Prime","Vaulted","Incarnon"],"compTags":["ASSAULT_AMMO","SOMA_PRIME"]},
  "Soma":{"masteryReq":6,"description":"Accuracy coupled with a massive magazine makes the Soma assault rifle a formidable weapon.","noise":"Alarming","releaseDate":"2013-09-13","productCategory":"LongGuns","equipTime":1.1,"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":100,"reloadTime":3,"multishot":1,"attacks":[{"name":"Fully Spooled","speed":15,"crit_chance":30,"crit_mult":3,"status_chance":7,"shot_type":"Hit-Scan","damage":{"Impact":1.2,"Slash":6,"Puncture":4.8}},{"name":"Incarnon Form","multishot":8,"isInc":1,"speed":7,"crit_chance":10,"crit_mult":3,"status_chance":1.8,"damage":{"Impact":0.5,"Slash":4.8,"Puncture":2.7}}],"incMagazineSize":200,"name":"Soma","imageName":"soma.webp","tags":["Tenno","Incarnon"],"compTags":["ASSAULT_AMMO"]},
  "Spectra":{"masteryReq":4,"description":"While its intended design is for deep space construction, the concentrated laser beam of the Spectra is highly effective against organic and synthetic enemies.","noise":"Alarming","releaseDate":"2013-07-13","ammoCapacity":360,"productCategory":"Pistols","equipTime":1.1,"zoomProps":[[]],"category":"Secondary","trigger":"Held","type":"Pistol","magazineSize":60,"reloadTime":1.8,"multishot":1,"attacks":[{"name":"Normal Attack","isBeam":true,"punch_through":0.5,"speed":12,"crit_chance":14,"crit_mult":2,"status_chance":22,"shot_type":"Discharge","damage":{"Slash":10.44,"Puncture":7.56}}],"name":"Spectra","imageName":"spectra.webp","tags":["Corpus"],"compTags":["BEAM"]},
  "Spira":{"masteryReq":8,"description":"A flash of red ribbon is the last thing most victims of these throwing-daggers see.","noise":"Silent","releaseDate":"2015-09-23","productCategory":"Pistols","category":"Secondary","trigger":"Auto","type":"Throwing","magazineSize":10,"reloadTime":1,"multishot":1,"attacks":[{"name":"Normal Attack","speed":2.5,"crit_chance":30,"crit_mult":2,"status_chance":8,"shot_type":"Projectile","shot_speed":70,"flight":70,"damage":{"Impact":8.2,"Slash":24.6,"Puncture":49.2}}],"name":"Spira","imageName":"spira.webp","tags":["Tenno"],"compTags":["PROJECTILE","THROWN"]},
  "Sonicor":{"masteryReq":2,"description":"Blasts targets with a massive wave of sonic energy. Results reported to be: 'Very Satisfying'.","noise":"Alarming","releaseDate":"2015-10-01","ammoCapacity":150,"productCategory":"Pistols","zoomProps":[[]],"category":"Secondary","trigger":"Semi","type":"Pistol","magazineSize":15,"reloadTime":3,"multishot":1,"attacks":[{"name":"Projectile Impact","speed":1.25,"crit_chance":0,"crit_mult":1,"status_chance":0,"shot_type":"Projectile","shot_speed":80,"flight":80,"damage":{"Impact":150},"falloff":{"start":0,"end":20,"reduction":0.8333}},{"name":"Explosion","speed":1.25,"crit_chance":10,"crit_mult":2,"status_chance":25,"shot_type":"AoE","unique":{"force_procs":["impact"]},"damage":{"Impact":50},"no_headshot_mult":true}],"name":"Sonicor","imageName":"sonicor.webp","tags":["Corpus"],"compTags":["PROJECTILE"],"comb":[[0,1]]},
  "Spinnerex":{"masteryReq":12,"description":"Each lash of Oraxia's whip injects its victim with a dose of deadly toxin. Upon death, afflicted enemies have a chance to burst, damaging nearby enemies and spreading the poison.","blockingAngle":45,"comboDuration":5,"followThrough":0.5,"range":3,"windUp":0.4,"releaseDate":"2025-06-25","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":1.36,"crit_chance":16,"crit_mult":2.4,"status_chance":40,"damage":{"Toxin":168}},{"name":"Slam","radius":5,"type":"s","isHeavy":false,"speed":1,"crit_chance":16,"crit_mult":2.4,"status_chance":40,"damage":{"Toxin":336}},{"name":"Heavy Slam","radius":6,"type":"hs","isHeavy":true,"speed":1,"crit_chance":16,"crit_mult":2.4,"status_chance":40,"damage":{"Toxin":504}}],"name":"Spinnerex","imageName":"Spinnerex.webp","tags":[],"compTags":["BLADE_AND_WHIP_STANCE"]},
  "Sporothrix":{"masteryReq":13,"description":"This long-distance rifle fires a razor-sharp, virus-soaked barb that continues to attack its host before violently erupting in a spore-laden mist. Scoped headshots increase lethality.","noise":"Alarming","releaseDate":"2020-11-19","ammoCapacity":45,"productCategory":"LongGuns","category":"Primary","trigger":"Semi","type":"Rifle","magazineSize":9,"reloadTime":2.7,"multishot":1,"attacks":[{"name":"Unzoomed","speed":1.83,"crit_chance":1,"crit_mult":3,"status_chance":53,"shot_type":"Projectile","shot_speed":270,"flight":270,"damage":{"Impact":100.17,"Slash":155.82,"Puncture":115.01},"falloff":{"start":400,"end":600,"reduction":0.5}},{"name":"2.7x Zoom","sniperCombo":true,"speed":1.83,"crit_chance":1,"crit_mult":3,"status_chance":53,"shot_type":"Projectile","shot_speed":270,"flight":270,"damage":{"Impact":100.17,"Slash":155.82,"Puncture":115.01},"falloff":{"start":400,"end":600,"reduction":0.5}},{"name":"AoE","sniperCombo":true,"speed":1.83,"crit_chance":1,"crit_mult":3,"status_chance":53,"shot_type":"AoE","damage":{"Slash":22,"Viral":19},"falloff":{"start":0,"end":1.7,"reduction":0.1},"no_headshot_mult":true}],"name":"Sporothrix","imageName":"sporothrix.webp","tags":["Infested"],"compTags":["SNIPER_AMMO","PROJECTILE","SPOROTHRIX"],"comb":[[0,2]]},
  "Sporelacer (Primary)":{"masteryReq":0,"description":"Launches spore-sacs that explode with toxic mist on each bounce. Automatic trigger.","ammoCapacity":60,"productCategory":"","category":"Primary","type":"Kitgun","magazineSize":0,"reloadTime":3,"multishot":1,"attacks":[{"name":"Normal Attack","speed":1.5,"crit_chance":0,"crit_mult":0,"status_chance":0,"shot_type":"Projectile","shot_speed":50,"damage":{"Impact":57}},{"name":"Explosion","speed":1.5,"crit_chance":0,"crit_mult":0,"status_chance":0,"shot_type":"AoE","shot_speed":50,"damage":{"Toxin":199},"no_headshot_mult":true}],"name":"Sporelacer (Primary)","imageName":"sporelacer.webp","tags":["primary-shotgun"],"compTags":[""],"comb":[[0,1]]},
  "Spira Prime":{"masteryReq":10,"description":"These rare, braided throwing daggers were a favorite tool of high ranking Orokin assassins.","noise":"Silent","releaseDate":"2016-02-16","productCategory":"Pistols","category":"Secondary","trigger":"Auto","type":"Throwing","magazineSize":12,"reloadTime":0.75,"multishot":1,"attacks":[{"name":"Normal Attack","speed":3.33,"crit_chance":30,"crit_mult":3,"status_chance":14,"shot_type":"Projectile","shot_speed":70,"flight":70,"damage":{"Impact":6,"Slash":6,"Puncture":48}}],"name":"Spira Prime","imageName":"spira-prime.webp","tags":["Prime","Vaulted"],"compTags":["PROJECTILE","THROWN"]},
  "Sporelacer (Secondary)":{"masteryReq":0,"description":"Secondary: Fires spore-sacs that rupture into three smaller toxic projectiles on impact. Semi-automatic trigger.","ammoCapacity":130,"productCategory":"Pistols","category":"Secondary","trigger":"Semi","type":"Kitgun","magazineSize":0,"reloadTime":3,"multishot":1,"attacks":[{"name":"Normal Attack","speed":1.5,"crit_chance":0,"crit_mult":0,"status_chance":0,"shot_type":"Projectile","shot_speed":100,"unique":{"force_procs":["impact"]},"damage":{"Impact":89,"fire":167}},{"name":"Explosion","speed":1.5,"crit_chance":0,"crit_mult":0,"status_chance":0,"shot_type":"AoE","shot_speed":50,"damage":{"Toxin":199},"no_headshot_mult":true}],"name":"Sporelacer (Secondary)","imageName":"sporelacer.webp","tags":["secondary-shotgun"],"compTags":[""],"comb":[[0,1]]},
  "Spectra Vandal":{"masteryReq":10,"description":"A special-order Corpus cutting tool for master crafters only. Features distinctive azurite plating and a focusing crystal of precision clarity and cut.","noise":"Alarming","releaseDate":"2019-05-22","ammoCapacity":400,"productCategory":"Pistols","equipTime":1.1,"zoomProps":[[]],"category":"Secondary","trigger":"Held","type":"Pistol","magazineSize":80,"reloadTime":1.2,"multishot":1,"attacks":[{"name":"Normal Attack","isBeam":true,"punch_through":0.5,"speed":12,"crit_chance":20,"crit_mult":2,"status_chance":28,"shot_type":"Discharge","damage":{"Slash":12.76,"Puncture":9.24}}],"name":"Spectra Vandal","imageName":"spectra-vandal.webp","tags":["Corpus","Vandal"],"compTags":["BEAM"]},
  "Stahlta":{"masteryReq":10,"description":"Nail them to the wall! The Stahlta automatic rifle propels hardened steel rods at high speed, while a charged fire mode fuses a number of volatile rods together for a large radioactive explosion.","noise":"Alarming","releaseDate":"2020-06-11","ammoCapacity":300,"productCategory":"LongGuns","equipTime":1.1,"zoomProps":[[]],"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":40,"reloadTime":1.4,"multishot":1,"attacks":[{"name":"Auto","isCoMult":true,"punch_through":1.2,"speed":6,"crit_chance":24,"crit_mult":1.8,"status_chance":22,"shot_type":"Projectile","shot_speed":50,"flight":50,"damage":{"Impact":7.28,"Slash":28.08,"Puncture":16.64}},{"name":"Alt-Fire","ammoCost":20,"isCoMult":true,"speed":0.667,"crit_chance":40,"crit_mult":3,"status_chance":32,"shot_type":"Projectile","shot_speed":50,"flight":50,"unique":{"force_procs":["impact"]},"damage":{"Impact":120,"Slash":300,"Puncture":180},"charge_time":1.6},{"name":"Alt-Fire AoE","ammoCost":20,"speed":0.667,"crit_chance":40,"crit_mult":3,"status_chance":32,"shot_type":"AoE","damage":{"Radiation":1200},"falloff":{"start":0,"end":7.2,"reduction":0.7},"no_headshot_mult":true,"charge_time":1.6}],"name":"Stahlta","imageName":"stahlta.webp","tags":["Corpus"],"compTags":["ASSAULT_AMMO","PROJECTILE","AOE"],"comb":[[1,2]]},
  "Steflos":{"masteryReq":8,"description":"An energy projectile bursts forth from the Steflos as it rushes towards enemies. The projectile's duration increases when it hits an enemy. When Citrine fires the Steflos, its projectile speed increases.","noise":"Alarming","releaseDate":"2023-02-15","ammoCapacity":36,"productCategory":"LongGuns","zoomProps":[[]],"category":"Primary","trigger":"Semi","type":"Shotgun","magazineSize":12,"reloadTime":2.4,"multishot":1,"attacks":[{"name":"Normal Attack","isCoMult":true,"speed":3,"crit_chance":14,"crit_mult":2.2,"status_chance":22,"shot_type":"Projectile","shot_speed":1,"damage":{"Impact":130,"Heat":190}}],"name":"Steflos","imageName":"steflos.webp","tags":[""],"compTags":["PROJECTILE","ASSAULT_AMMO"]},
  "Strun Wraith":{"masteryReq":10,"description":"A different take on a familiar shotgun, the Strun Wraith features unique styling.","noise":"Alarming","releaseDate":"2013-09-03","ammoCapacity":120,"productCategory":"LongGuns","zoomProps":[[]],"category":"Primary","trigger":"Semi","type":"Shotgun","magazineSize":10,"reloadTime":5,"multishot":10,"attacks":[{"name":"Normal Attack","speed":2.5,"crit_chance":18,"crit_mult":2.2,"status_chance":12,"shot_type":"Hit-Scan","damage":{"Impact":26,"Slash":8,"Puncture":6},"falloff":{"start":15,"end":30,"reduction":0.5}},{"name":"Incarnon Form","multishot":1,"isInc":1,"speed":2,"crit_chance":56,"crit_mult":3.4,"status_chance":44,"damage":{"Impact":100}},{"name":"Incarnon Form Radial Attack","multishot":1,"isInc":1,"speed":2,"crit_chance":56,"crit_mult":3.4,"status_chance":44,"shot_type":"AoE","damage":{"Blast":70,"Slash":90,"Puncture":40},"no_headshot_mult":true}],"incMagazineSize":40,"name":"Strun Wraith","imageName":"strun-wraith.webp","tags":["Tenno","Invasion Reward","Wraith","Incarnon"],"compTags":[],"comb":[[1,2]]},
  "Stradavar":{"masteryReq":8,"description":"A high-capacity, high-damage enforcer, this weapon can switch between the high crit semi-automatic and full automatic firing modes.","noise":"Alarming","releaseDate":"2016-05-11","productCategory":"LongGuns","equipTime":1.1,"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":65,"reloadTime":2,"multishot":1,"attacks":[{"name":"Full Auto Mode","speed":10,"crit_chance":24,"crit_mult":2,"status_chance":12,"shot_type":"Hit-Scan","damage":{"Impact":9.8,"Slash":8.4,"Puncture":9.8}},{"name":"Semi-Auto Mode","speed":5,"crit_chance":28,"crit_mult":2,"status_chance":16,"shot_type":"Hit-Scan","damage":{"Impact":7.5,"Slash":12.5,"Puncture":30}}],"name":"Stradavar","imageName":"stradavar.webp","tags":["Tenno"],"compTags":["ASSAULT_AMMO"]},
  "Stropha":{"masteryReq":10,"description":"A short-blade melee weapon with an ace up its sleeve. Send nearby enemies flying with a powerful short-range shockwave.","blockingAngle":45,"comboDuration":5,"followThrough":0.5,"range":2,"windUp":0.4,"releaseDate":"2020-06-11","productCategory":"Melee","zoomProps":[[]],"category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"440","slam":{"damage":"660.00","radial":{"damage":"220.00","element":"Impact","radius":5}},"isHeavy":false,"speed":1,"crit_chance":30,"crit_mult":2.4,"status_chance":14,"damage":{"Impact":61.6,"Slash":83.6,"Puncture":74.8}},{"name":"Ranged Attack","isHeavy":true,"speed":2.5,"crit_chance":30,"crit_mult":2.4,"status_chance":14,"shot_type":"Projectile","shot_speed":120,"flight":120,"damage":{"Impact":700},"falloff":{"start":6,"end":12,"reduction":0.99},"no_headshot_mult":true,"charge_time":0.4},{"name":"Slam","radius":5,"type":"s","isHeavy":false,"speed":1,"crit_chance":30,"crit_mult":2.4,"status_chance":14,"unique":{"force_procs":["impact"]},"damage":{"Impact":440}},{"name":"Heavy Slam","radius":8,"type":"hs","isHeavy":true,"speed":1,"crit_chance":30,"crit_mult":2.4,"status_chance":14,"damage":{"Blast":660}}],"name":"Stropha","imageName":"stropha.webp","tags":["Corpus"],"compTags":["GUNBLADE_STANCE"]},
  "Staticor":{"masteryReq":10,"description":"Send a massive charge of potential energy hurling toward unfortunate targets.","noise":"Alarming","releaseDate":"2016-02-04","ammoCapacity":288,"productCategory":"Pistols","zoomProps":[[]],"category":"Secondary","trigger":"Charge","type":"Pistol","magazineSize":48,"reloadTime":1.5,"multishot":1,"attacks":[{"name":"Uncharged Projectile","speed":3.5,"crit_chance":14,"crit_mult":2.2,"status_chance":28,"shot_type":"Projectile","shot_speed":60,"flight":60,"damage":{"Radiation":44}},{"name":"Uncharged Explosion","speed":3.5,"crit_chance":0,"crit_mult":1,"status_chance":28,"shot_type":"AoE","damage":{"Radiation":88},"falloff":{"start":0,"end":2.4,"reduction":0.3},"no_headshot_mult":true},{"name":"Fully Charged Projectile","ammoCost":5,"speed":3.5,"crit_chance":14,"crit_mult":2.2,"status_chance":28,"shot_type":"Projectile","shot_speed":40,"flight":40,"damage":{"Radiation":44},"charge_time":1},{"name":"Fully Charged Explosion","ammoCost":5,"speed":3.5,"crit_chance":14,"crit_mult":2.2,"status_chance":28,"shot_type":"AoE","damage":{"Radiation":106},"falloff":{"start":0,"end":9.6,"reduction":0.9},"no_headshot_mult":true,"charge_time":1}],"name":"Staticor","imageName":"staticor.webp","tags":["Corpus"],"compTags":["PROJECTILE","AOE"],"comb":[[0,1],[2,3]]},
  "Stubba":{"masteryReq":7,"description":"Inflict rapid-fire bursts of pain with this Grineer submachine gun.","noise":"Alarming","releaseDate":"2017-10-12","ammoCapacity":399,"productCategory":"Pistols","zoomProps":[[]],"category":"Secondary","trigger":"Auto","type":"Pistol","magazineSize":57,"reloadTime":1.3,"multishot":1,"attacks":[{"name":"Normal Attack","speed":6.33,"crit_chance":23,"crit_mult":1.9,"status_chance":13,"shot_type":"Hit-Scan","damage":{"Impact":14.19,"Slash":15.51,"Puncture":3.3}}],"name":"Stubba","imageName":"stubba.webp","tags":["Grineer"],"compTags":[]},
  "Stradavar Prime":{"masteryReq":12,"description":"Between measured staccato and staggering crescendo, Stradavar Prime never fails to call down a devastating finale.","noise":"Alarming","releaseDate":"2019-03-27","ammoCapacity":720,"productCategory":"LongGuns","equipTime":1.1,"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":90,"reloadTime":2,"multishot":1,"attacks":[{"name":"Full Auto Mode","speed":10,"crit_chance":24,"crit_mult":2.6,"status_chance":12,"shot_type":"Hit-Scan","damage":{"Impact":10.5,"Slash":9,"Puncture":10.5}},{"name":"Semi-Auto Mode","punch_through":1,"speed":3.33,"crit_chance":30,"crit_mult":2.8,"status_chance":22,"shot_type":"Hit-Scan","damage":{"Impact":8,"Slash":48,"Puncture":24}}],"name":"Stradavar Prime","imageName":"stradavar-prime.webp","tags":["Prime","Vaulted"],"compTags":["ASSAULT_AMMO"]},
  "Strun":{"masteryReq":1,"description":"The Strun is a standard shotgun. Reliable, versatile and deadly.","noise":"Alarming","releaseDate":"2012-10-25","ammoCapacity":120,"productCategory":"LongGuns","zoomProps":[[]],"category":"Primary","trigger":"Semi","type":"Shotgun","magazineSize":6,"reloadTime":3.75,"multishot":12,"attacks":[{"name":"Normal Attack","speed":2.5,"crit_chance":7.5,"crit_mult":1.5,"status_chance":5,"shot_type":"Hit-Scan","damage":{"Impact":13.75,"Slash":7.5,"Puncture":3.75},"falloff":{"start":12,"end":25,"reduction":0.4}},{"name":"Incarnon Form","multishot":1,"isInc":1,"speed":2,"crit_chance":44,"crit_mult":2.8,"status_chance":40,"damage":{"Impact":100}},{"name":"Incarnon Form Radial Attack","multishot":1,"isInc":1,"speed":2,"crit_chance":44,"crit_mult":2.8,"status_chance":40,"shot_type":"AoE","damage":{"Blast":60,"Slash":80,"Puncture":30},"no_headshot_mult":true}],"incMagazineSize":40,"name":"Strun","imageName":"strun.webp","tags":["Tenno","Incarnon"],"compTags":[],"comb":[[1,2]]},
  "Strun Prime":{"masteryReq":14,"description":"A classic shotgun design, embellished for the elite as only the Orokin could.","noise":"Alarming","releaseDate":"2021-09-08","ammoCapacity":120,"productCategory":"LongGuns","zoomProps":[[]],"category":"Primary","trigger":"Semi","type":"Shotgun","magazineSize":10,"reloadTime":4.6,"multishot":12,"attacks":[{"name":"Normal Attack","punch_through":0.8,"speed":3.33,"crit_chance":24,"crit_mult":2.2,"status_chance":6.67,"shot_type":"Hit-Scan","damage":{"Impact":19.8,"Slash":17.6,"Puncture":6.6},"falloff":{"start":26,"end":52,"reduction":0.5}},{"name":"Incarnon Form","multishot":1,"isInc":1,"speed":2.5,"crit_chance":48,"crit_mult":3.4,"status_chance":46,"damage":{"Impact":100}},{"name":"Incarnon Form Radial Attack","multishot":1,"isInc":1,"speed":2.5,"crit_chance":48,"crit_mult":3.4,"status_chance":46,"shot_type":"AoE","damage":{"Blast":60,"Slash":100,"Puncture":40},"no_headshot_mult":true}],"incMagazineSize":40,"name":"Strun Prime","imageName":"strun-prime.webp","tags":["Prime","Incarnon"],"compTags":[],"comb":[[1,2]]},
  "Stug":{"masteryReq":2,"description":"Firing a sticky, toxic, explosive compound, the Stug Gel Gun offers multiple ejection modes, delivering maximum damage in all situations.","noise":"Alarming","releaseDate":"2013-12-19","productCategory":"Pistols","category":"Secondary","trigger":"Auto","type":"Pistol","magazineSize":20,"reloadTime":2,"multishot":1,"attacks":[{"name":"Blob Impact","speed":4,"crit_chance":5,"crit_mult":1.5,"status_chance":0,"shot_type":"Projectile","shot_speed":35,"flight":35,"damage":{"Corrosive":4}},{"name":"Blob Explosion","speed":4,"crit_chance":5,"crit_mult":1.5,"status_chance":10,"shot_type":"AoE","damage":{"Corrosive":75},"falloff":{"start":0,"end":2.8,"reduction":0.3},"no_headshot_mult":true},{"name":"Incarnon Form Blob Embed","speed":4,"crit_chance":15,"crit_mult":2,"status_chance":20,"shot_type":"AoE","shot_speed":35,"damage":{"Corrosive":50},"no_headshot_mult":true},{"name":"Incarnon Form Blob Explosion","speed":4,"crit_chance":15,"crit_mult":2,"status_chance":20,"shot_type":"AoE","damage":{"Corrosive":200},"no_headshot_mult":true},{"name":"Incarnon Form Bounce Explosion","speed":4,"crit_chance":15,"crit_mult":2,"status_chance":20,"shot_type":"AoE","damage":{"Corrosive":200},"no_headshot_mult":true}],"incMagazineSize":120,"name":"Stug","imageName":"stug.webp","tags":["Grineer","Incarnon"],"compTags":["PROJECTILE","AOE"],"comb":[[0,1]]},
  "Sun & Moon":{"masteryReq":0,"description":"Teshin's twin blades.","blockingAngle":60,"comboDuration":5,"followThrough":0.55,"range":2.6,"windUp":1,"productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":1,"crit_chance":20,"crit_mult":2.4,"status_chance":22,"damage":{"Impact":38,"Puncture":45.599998,"Slash":106.4}},{"name":"Slam","radius":8,"type":"s","isHeavy":false,"speed":1,"crit_chance":20,"crit_mult":2.4,"status_chance":22,"unique":{"force_procs":["impact"]},"damage":{"Impact":380}},{"name":"Heavy Slam","radius":9,"type":"hs","isHeavy":true,"speed":1,"crit_chance":20,"crit_mult":2.4,"status_chance":22,"damage":{"Blast":570}}],"name":"Sun & Moon","imageName":"sun-moon.webp","tags":[""],"compTags":["DUAL_KATANAS_STANCE"]},
  "Supra":{"masteryReq":12,"description":"The SUPRA is a heavy laser gun with a short wind up time.","noise":"Alarming","releaseDate":"2013-05-23","ammoCapacity":1080,"productCategory":"LongGuns","equipTime":1.1,"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":180,"reloadTime":3,"multishot":1,"attacks":[{"name":"Fully Spooled","speed":12.5,"crit_chance":12,"crit_mult":1.8,"status_chance":30,"shot_type":"Projectile","shot_speed":100,"flight":100,"damage":{"Impact":4,"Slash":6,"Puncture":30}}],"name":"Supra","imageName":"supra.webp","tags":["Corpus"],"compTags":["PROJECTILE","ASSAULT_AMMO","SUPRA"]},
  "Sybaris":{"masteryReq":5,"description":"This Tenno crafted, lever action rifle, is equal parts elegance and executioner.","noise":"Alarming","releaseDate":"2014-05-14","productCategory":"LongGuns","equipTime":1.1,"category":"Primary","trigger":"Burst","type":"Rifle","magazineSize":10,"reloadTime":2,"multishot":1,"attacks":[{"name":"Normal Attack","speed":3.33,"crit_chance":25,"crit_mult":2,"status_chance":10,"shot_type":"Hit-Scan","damage":{"Impact":26.4,"Slash":27.2,"Puncture":26.4},"burst_count":2,"burst_delay":0.101},{"name":"Incarnon Form","speed":3.33,"crit_chance":20,"crit_mult":3,"status_chance":20,"shot_type":"Hit-Scan","unique":{"force_procs":["blast"]},"damage":{"Impact":29.7,"Slash":30.6,"Puncture":29.7},"burst_count":4,"burst_delay":0.101}],"incMagazineSize":200,"name":"Sybaris","imageName":"sybaris.webp","tags":["Tenno","Incarnon"],"compTags":["ASSAULT_AMMO"]},
  "Syam":{"masteryReq":0,"description":"Syam is at home in the hands of a focused warrior. Its Heavy Attacks send forth shockwaves.","blockingAngle":55,"comboDuration":5,"followThrough":0.7,"range":2.5,"windUp":0.5,"productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":1,"crit_chance":22,"crit_mult":2,"status_chance":34,"damage":{"Impact":54,"Puncture":108,"Slash":108}},{"name":"Slam","radius":6,"type":"s","isHeavy":false,"speed":1,"crit_chance":22,"crit_mult":2,"status_chance":34,"unique":{"force_procs":["impact"]},"damage":{"Impact":540}},{"name":"Heavy Slam","radius":7,"type":"hs","isHeavy":true,"speed":1,"crit_chance":22,"crit_mult":2,"status_chance":34,"damage":{"Blast":810}}],"name":"Syam","imageName":"syam.webp","tags":[""],"compTags":["NIKANAS_STANCE"]},
  "Synapse":{"masteryReq":11,"description":"Powered by a bio-chemical reaction, the Infested Synapse rifle fries its targets with a steady stream of <DT_CORROSIVE>Corrosive energy.","noise":"Alarming","releaseDate":"2013-09-13","ammoCapacity":560,"productCategory":"LongGuns","equipTime":1.1,"zoomProps":[[]],"category":"Primary","trigger":"Held","type":"Rifle","magazineSize":70,"reloadTime":1.5,"multishot":1,"attacks":[{"name":"Normal Attack","isBeam":true,"speed":12,"crit_chance":39,"crit_mult":2.7,"status_chance":13,"shot_type":"Discharge","damage":{"Corrosive":20}}],"name":"Synapse","imageName":"synapse.webp","tags":["Infested"],"compTags":["BEAM","ASSAULT_AMMO"]},
  "Synoid Gammacor":{"masteryReq":7,"description":"Deployed by the Cephalon Suda, once a data-analyzing instrument the Gammacor main focus is defense.","noise":"Alarming","releaseDate":"2014-11-27","ammoCapacity":400,"productCategory":"Pistols","zoomProps":[[]],"category":"Secondary","trigger":"Held","type":"Pistol","magazineSize":80,"reloadTime":1.8,"multishot":1,"attacks":[{"name":"Normal Attack","isBeam":true,"speed":12,"crit_chance":20,"crit_mult":2,"status_chance":28,"shot_type":"Discharge","damage":{"Magnetic":20}},{"name":"Incarnon Form","isInc":1,"speed":1,"crit_chance":22,"crit_mult":2.2,"status_chance":24,"shot_type":"Projectile","unique":{"force_procs":["impact"]},"damage":{"Impact":100}},{"name":"Incarnon Form Radial Attack","isInc":1,"speed":1,"crit_chance":22,"crit_mult":2.2,"status_chance":24,"shot_type":"AoE","damage":{"Cold":800},"no_headshot_mult":true}],"incMagazineSize":15,"name":"Synoid Gammacor","imageName":"synoid-gammacor.webp","tags":["Syndicate","Cephalon Suda","Incarnon"],"compTags":["BEAM"],"comb":[[1,2]]},
  "Supra Vandal":{"masteryReq":14,"description":"A customized version of the powerful Supra, featuring a metallic finish and Lotus decal.","noise":"Alarming","releaseDate":"2017-05-04","ammoCapacity":1600,"productCategory":"LongGuns","equipTime":1.1,"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":300,"reloadTime":3,"multishot":1,"attacks":[{"name":"Fully Spooled","speed":12.5,"crit_chance":16,"crit_mult":2,"status_chance":30,"shot_type":"Projectile","shot_speed":100,"flight":100,"damage":{"Impact":4,"Slash":6,"Puncture":30}}],"name":"Supra Vandal","imageName":"supra-vandal.webp","tags":["Corpus","Vandal"],"compTags":["PROJECTILE","ASSAULT_AMMO","SUPRA"]},
  "Sydon":{"masteryReq":5,"description":"Inflict maximum devastation with this massive Grineer trident.","blockingAngle":55,"comboDuration":5,"followThrough":0.6,"range":2.9,"windUp":0.9,"releaseDate":"2016-01-05","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","slide":"450","slam":{"damage":"675.00","radial":{"damage":"225.00","radius":7}},"speed":0.917,"crit_chance":10,"crit_mult":2,"status_chance":25,"damage":{"Impact":11.25,"Puncture":213.75}},{"name":"Slam","radius":7,"type":"s","isHeavy":false,"speed":1,"crit_chance":10,"crit_mult":2,"status_chance":25,"unique":{"force_procs":["impact"]},"damage":{"Blast":450}},{"name":"Heavy Slam","radius":8,"type":"hs","isHeavy":true,"speed":1,"crit_chance":10,"crit_mult":2,"status_chance":25,"damage":{"Blast":675}}],"name":"Sydon","imageName":"sydon.webp","tags":["Grineer"],"compTags":["POLEARMS_STANCE"]},
  "Sybaris Prime":{"masteryReq":12,"description":"Sleek and slender, a golden symbol of Tenno perfection.","noise":"Alarming","releaseDate":"2017-05-30","productCategory":"LongGuns","equipTime":1.1,"category":"Primary","trigger":"Burst","type":"Rifle","magazineSize":20,"reloadTime":2,"multishot":1,"attacks":[{"name":"Normal Attack","speed":3.33,"crit_chance":30,"crit_mult":2,"status_chance":25,"shot_type":"Hit-Scan","damage":{"Impact":29.04,"Slash":29.92,"Puncture":29.04},"burst_count":2,"burst_delay":0.062},{"name":"Incarnon Form","speed":3.33,"crit_chance":25,"crit_mult":3,"status_chance":30,"shot_type":"Hit-Scan","unique":{"force_procs":["blast"]},"damage":{"Impact":36.3,"Slash":37.4,"Puncture":36.3},"burst_count":4,"burst_delay":0.062}],"incMagazineSize":200,"name":"Sybaris Prime","imageName":"sybaris-prime.webp","tags":["Prime","Vaulted","Incarnon"],"compTags":["ASSAULT_AMMO"]},
  "Synoid Heliocor":{"masteryReq":11,"description":"This intelligent hammer takes an enemy killed by a Heavy Attack and recomposes them as an ally. Any fatal strike with this weapon also performs a Codex scan.","blockingAngle":50,"comboDuration":5,"followThrough":0.4,"range":2.6,"windUp":1.2,"releaseDate":"2016-09-15","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"560","slam":{"damage":"840.00","radial":{"damage":"280.00","element":"Impact","radius":9}},"speed":1.08,"crit_chance":16,"crit_mult":2,"status_chance":40,"damage":{"Impact":238,"Slash":14,"Puncture":28}},{"name":"Slam","radius":9,"type":"s","isHeavy":false,"speed":1,"crit_chance":16,"crit_mult":2,"status_chance":40,"damage":{"Impact":560}},{"name":"Heavy Slam","radius":10,"type":"hs","isHeavy":true,"speed":1,"crit_chance":16,"crit_mult":2,"status_chance":40,"damage":{"Blast":840}}],"name":"Synoid Heliocor","imageName":"synoid-heliocor.webp","tags":["Syndicate","Cephalon Suda"],"compTags":["HAMMERS_STANCE"]},
  "Synoid Simulor":{"masteryReq":12,"description":"Cephalon Suda’s custom issue Simulor was built to satisfy her curiosity.","noise":"Alarming","releaseDate":"2015-09-02","ammoCapacity":96,"productCategory":"LongGuns","equipTime":1.1,"zoomProps":[[]],"category":"Primary","trigger":"Active","type":"Rifle","magazineSize":16,"reloadTime":2,"multishot":1,"attacks":[{"name":"Orb Launch","speed":3.33,"crit_chance":0,"crit_mult":1,"status_chance":0,"shot_type":"Projectile","damage":{}},{"name":"Orb Merging Damage","speed":3.33,"crit_chance":14,"crit_mult":2,"status_chance":35,"shot_type":"AoE","damage":{"Magnetic":125},"falloff":{"start":0,"end":4,"reduction":0},"no_headshot_mult":true},{"name":"Orb Explosion","speed":3.33,"crit_chance":14,"crit_mult":2,"status_chance":35,"shot_type":"AoE","unique":{"force_procs":["electricity"]},"damage":{"Magnetic":240},"falloff":{"start":0,"end":5,"reduction":1},"no_headshot_mult":true},{"name":"Singularity","speed":4,"crit_chance":0,"crit_mult":0,"status_chance":0,"damage":{"Magnetic":50},"falloff":{"start":0,"end":5,"reduction":0}}],"name":"Synoid Simulor","imageName":"synoid-simulor.webp","tags":["Syndicate","Cephalon Suda","Cephalon"],"compTags":["ASSAULT_AMMO","AOE","PROJECTILE"],"comb":[[1,2]]},
  "Tak & Lug":{"masteryReq":9,"description":"Take active defense to new heights with this deadly flying shield and brutal blade. Throw the shield with a unique Heavy Attack, inflicting Blast Status Effects and dealing damage in a wide area.","blockingAngle":70,"comboDuration":5,"followThrough":0.6,"range":2.5,"windUp":0.7,"releaseDate":"2025-04-17","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":1,"crit_chance":21,"crit_mult":1.9,"status_chance":31,"damage":{"Impact":39.4,"Slash":157.6}},{"name":"Slam","radius":7,"type":"s","isHeavy":false,"speed":1,"crit_chance":21,"crit_mult":1.9,"status_chance":10,"damage":{"Impact":394}},{"name":"Heavy Slam","radius":8,"type":"hs","isHeavy":true,"speed":1,"crit_chance":21,"crit_mult":1.9,"status_chance":10,"damage":{"Blast":522}}],"name":"Tak & Lug","imageName":"TakLug.webp","tags":["Tenno"],"compTags":["SWORDS_AND_SHIELD_STANCE"]},
  "Tekko":{"masteryReq":6,"description":"These iron fists that rip through foes are Atlas' signature weapons. When wielded by Atlas they receive a Status Chance increase.","blockingAngle":50,"comboDuration":5,"followThrough":0.9,"range":1.25,"windUp":0.6,"releaseDate":"2015-10-01","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"480","slam":{"damage":"480.00","radial":{"damage":"160.00","radius":8}},"speed":0.917,"crit_chance":30,"crit_mult":2,"status_chance":10,"damage":{"Impact":32,"Slash":112,"Puncture":16}},{"name":"Slam","radius":8,"type":"s","isHeavy":false,"speed":1,"crit_chance":30,"crit_mult":2,"status_chance":10,"unique":{"force_procs":["impact"]},"damage":{"Impact":320}},{"name":"Heavy Slam","radius":9,"type":"hs","isHeavy":true,"speed":1,"crit_chance":30,"crit_mult":2,"status_chance":10,"damage":{"Blast":480}}],"name":"Tekko","imageName":"tekko.webp","tags":["Tenno"],"compTags":["FIST_STANCE"]},
  "Telos Akbolto":{"masteryReq":11,"description":"For the Arbiters of Hexis these pistols are more than simple weapons, they are symbols of truth and discipline.","noise":"Alarming","releaseDate":"2014-11-27","productCategory":"Pistols","category":"Secondary","trigger":"Semi","type":"Pistol","magazineSize":30,"reloadTime":2.6,"multishot":1,"attacks":[{"name":"Normal Attack","speed":10,"crit_chance":13,"crit_mult":2,"status_chance":29,"shot_type":"Projectile","shot_speed":75,"flight":75,"damage":{"Impact":4.7,"Puncture":42.3}}],"name":"Telos Akbolto","imageName":"telos-akbolto.webp","tags":["Syndicate","Arbiters of Hexis"],"compTags":["PROJECTILE"]},
  "Telos Boltace":{"masteryReq":11,"description":"Spinning attacks unleash the Stormpath, a tempest of mayhem that hurls any foes in its way.","blockingAngle":60,"comboDuration":5,"followThrough":0.6,"range":2.5,"windUp":0.7,"releaseDate":"2016-09-15","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"420","slam":{"damage":"420.00","radial":{"damage":"210.00","radius":8}},"speed":1.08,"crit_chance":20,"crit_mult":2,"status_chance":35,"damage":{"Impact":21,"Slash":10.5,"Puncture":178.5}},{"name":"Stormpath Slide Attack","speed":1.08,"crit_chance":20,"crit_mult":2,"status_chance":35,"damage":{"Impact":42,"Slash":21,"Puncture":357}},{"name":"Slam","radius":8,"type":"s","isHeavy":false,"speed":1,"crit_chance":20,"crit_mult":2,"status_chance":35,"unique":{"force_procs":["impact"]},"damage":{"Impact":420}},{"name":"Heavy Slam","radius":9,"type":"hs","isHeavy":true,"speed":1,"crit_chance":20,"crit_mult":2,"status_chance":35,"damage":{"Blast":630}}],"name":"Telos Boltace","imageName":"telos-boltace.webp","tags":["Syndicate","Arbiters of Hexis"],"compTags":["TONFA_STANCE"]},
  "Tatsu":{"masteryReq":7,"description":"Fearsome and noble, the elegant two-handed Nikana is the pride of any Arsenal. Kills build charges and seeking projectiles are unleashed with a Slide Attack to find and stun unwitting enemies. When Revenant wields this blade, Tatsu’s charge cap is increased.","blockingAngle":55,"comboDuration":5,"followThrough":0.7,"range":3,"windUp":0.7,"releaseDate":"2019-03-08","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slam":{"damage":"642.00","radial":{"damage":"214.00","element":"Impact","radius":7}},"speed":1,"crit_chance":16,"crit_mult":2,"status_chance":28,"damage":{"Impact":20,"Slash":68,"Puncture":54,"Radiation":72}},{"name":"Soul Swarm Projectile","speed":1,"crit_chance":16,"crit_mult":2,"status_chance":28,"shot_type":"Projectile","damage":{"Radiation":96}},{"name":"Slam","radius":7,"type":"s","isHeavy":false,"speed":1,"crit_chance":16,"crit_mult":2,"status_chance":28,"unique":{"force_procs":["impact"]},"damage":{"Impact":428}},{"name":"Heavy Slam","radius":8,"type":"hs","isHeavy":true,"speed":1,"crit_chance":16,"crit_mult":2,"status_chance":28,"damage":{"Blast":642}}],"name":"Tatsu","imageName":"tatsu.webp","tags":["Tenno"],"compTags":["LONG_KATANA_STANCE"]},
  "Talons":{"masteryReq":8,"description":"The claws of these tactical bombs dig into the target and detonate on command.","noise":"Silent","releaseDate":"2015-12-03","ammoCapacity":12,"productCategory":"Pistols","category":"Secondary","trigger":"Active","type":"Throwing","magazineSize":4,"reloadTime":1,"multishot":1,"attacks":[{"name":"Mid-Flight Detonation","speed":3.33,"crit_chance":22,"crit_mult":2,"status_chance":26,"shot_type":"AoE","damage":{"Blast":120},"falloff":{"start":0,"end":4,"reduction":0.5},"no_headshot_mult":true},{"name":"Embedded Detonation","speed":3.33,"crit_chance":22,"crit_mult":2,"status_chance":10,"shot_type":"AoE","unique":{"force_procs":["puncture"]},"damage":{"Blast":250},"falloff":{"start":0,"end":4,"reduction":0.5},"no_headshot_mult":true}],"name":"Talons","imageName":"talons.webp","tags":["Tenno"],"compTags":["PROJECTILE","DEPLOYABLE","AOE","SINGLESHOT"]},
  "Tatsu Prime":{"masteryReq":14,"description":"Tatsu Prime glows with spectral splendor. It grows more powerful with each enemy’s demise, especially when wielded by Revenant.","blockingAngle":55,"comboDuration":5,"followThrough":0.7,"range":3,"windUp":0.7,"releaseDate":"2022-10-05","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"460","slam":{"damage":"690.00","radial":{"damage":"230.00","element":"Impact","radius":7}},"speed":1.17,"crit_chance":22,"crit_mult":2.4,"status_chance":30,"damage":{"Impact":20,"Slash":76,"Puncture":54,"Radiation":80}},{"name":"Soul Swarm Projectile","speed":1.17,"crit_chance":22,"crit_mult":2.4,"status_chance":30,"shot_type":"Projectile","damage":{"Radiation":96}},{"name":"Slam","radius":7,"type":"s","isHeavy":false,"speed":1,"crit_chance":22,"crit_mult":2.4,"status_chance":30,"unique":{"force_procs":["impact"]},"damage":{"Impact":460}},{"name":"Heavy Slam","radius":8,"type":"hs","isHeavy":true,"speed":1,"crit_chance":22,"crit_mult":2.4,"status_chance":30,"damage":{"Blast":690}}],"name":"Tatsu Prime","imageName":"tatsu-prime.webp","tags":["Prime"],"compTags":["LONG_KATANA_STANCE"]},
  "Tekko Prime":{"masteryReq":12,"description":"As merciless and indestructible as Atlas Prime himself, Tekko Prime crush and split with tectonic force.","blockingAngle":50,"comboDuration":5,"followThrough":0.9,"range":1.35,"windUp":0.6,"releaseDate":"2019-10-01","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"540","slam":{"damage":"540.00","radial":{"damage":"180.00","element":"Impact","radius":8}},"speed":1,"crit_chance":30,"crit_mult":2.4,"status_chance":26,"damage":{"Impact":39.6,"Slash":115.2,"Puncture":25.2}},{"name":"Slam","radius":8,"type":"s","isHeavy":false,"speed":1,"crit_chance":30,"crit_mult":2.4,"status_chance":26,"unique":{"force_procs":["impact"]},"damage":{"Impact":360}},{"name":"Heavy Slam","radius":9,"type":"hs","isHeavy":true,"speed":1,"crit_chance":30,"crit_mult":2.4,"status_chance":26,"damage":{"Blast":540}}],"name":"Tekko Prime","imageName":"tekko-prime.webp","tags":["Prime"],"compTags":["FIST_STANCE"]},
  "Thalys":{"masteryReq":12,"description":"The Thalys played a ceremonial role in the Zariman harvest festival, and was intended to reap the first fruits of Tau. Now twisted from this purpose, it plants Void shards in enemy flesh instead. Each new shard planted causes existing shards to inflict damage on their hosts.","blockingAngle":65,"comboDuration":5,"followThrough":0.4,"range":2.8,"windUp":1,"releaseDate":"2025-06-25","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":0.917,"crit_chance":30,"crit_mult":2.2,"status_chance":24,"damage":{"Impact":34.5,"Slash":210,"Puncture":90}},{"name":"Slam","force_procs":["impact"],"radius":8,"type":"s","isHeavy":false,"speed":1,"crit_chance":30,"crit_mult":2.2,"status_chance":24,"damage":{"Impact":600}},{"name":"Heavy Slam","radius":9,"type":"hs","isHeavy":true,"speed":1,"crit_chance":30,"crit_mult":2.2,"status_chance":24,"damage":{"Blast":900}}],"name":"Thalys","imageName":"Thalys.webp","tags":["Incarnon"],"compTags":["HEAVY SCYTHE_STANCE"]},
  "Tenet Agendus":{"masteryReq":14,"description":"Drive the agenda with this massive impact hammer. Heavy attacks launch devastating energy disks.","blockingAngle":90,"comboDuration":5,"followThrough":0.6,"range":2.6,"windUp":1,"releaseDate":"2021-07-06","productCategory":"Melee","zoomProps":[[]],"category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"260","slam":{"damage":"780.00","radial":{"damage":"260.00","element":"Impact","radius":6}},"isHeavy":false,"speed":0.917,"crit_chance":24,"crit_mult":2,"status_chance":28,"damage":{"Impact":120,"Electricity":140}},{"name":"Energy Disk","isHeavy":true,"speed":1,"crit_chance":24,"crit_mult":2,"status_chance":28,"shot_type":"Projectile","shot_speed":80,"flight":80,"damage":{"Electricity":2880},"falloff":{"start":10,"end":20,"reduction":0.9305},"charge_time":1},{"name":"Slam","radius":6,"type":"s","isHeavy":false,"speed":1,"crit_chance":24,"crit_mult":2,"status_chance":28,"damage":{"Electricity":520}},{"name":"Heavy Slam","radius":10,"type":"hs","isHeavy":true,"speed":1,"crit_chance":24,"crit_mult":2,"status_chance":28,"damage":{"Electricity":780}}],"name":"Tenet Agendus","imageName":"tenet-agendus.webp","tags":["Corpus","Tenet"],"compTags":["SWORDS_AND_SHIELD_STANCE"]},
  "Telos Boltor":{"masteryReq":12,"description":"Bring down judgement, with this boltor crafted by the Arbiters of Hexis.","noise":"Alarming","releaseDate":"2015-09-02","productCategory":"LongGuns","equipTime":1.1,"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":90,"reloadTime":2.4000001,"multishot":1,"attacks":[{"name":"Normal Attack","speed":9.33,"crit_chance":30,"crit_mult":2.4,"status_chance":16,"shot_type":"Projectile","shot_speed":90,"flight":90,"damage":{"Impact":3,"Puncture":27}},{"name":"Incarnon Form","multishot":3,"isInc":1,"punch_through":0.6,"speed":10.33,"crit_chance":36,"crit_mult":3.2,"status_chance":10.7,"shot_type":"Projectile","damage":{"Impact":2,"Slash":12,"Puncture":6}}],"incMagazineSize":160,"name":"Telos Boltor","imageName":"telos-boltor.webp","tags":["Syndicate","Arbiters of Hexis","Incarnon"],"compTags":["PROJECTILE","ASSAULT_AMMO"]},
  "Tenet Arca Plasmor":{"masteryReq":16,"description":"Custom variant of a Corpus classic. Staggering blasts now ricochet and have greater range at the cost of a slower fire and reload speed. Surviving enemies are consumed with radiation.","noise":"Alarming","releaseDate":"2021-07-06","ammoCapacity":40,"productCategory":"LongGuns","zoomProps":[[]],"category":"Primary","trigger":"Semi","type":"Rifle","magazineSize":10,"reloadTime":3,"multishot":1,"attacks":[{"name":"Normal Attack","isCoMult":true,"speed":1,"crit_chance":22,"crit_mult":2,"status_chance":34,"shot_type":"Projectile","shot_speed":120,"flight":120,"unique":{"force_procs":["impact"]},"damage":{"Radiation":760},"falloff":{"start":18,"end":36,"reduction":0.5},"no_headshot_mult":true}],"name":"Tenet Arca Plasmor","imageName":"tenet-arca-plasmor.webp","tags":["Corpus","Tenet"],"compTags":[]},
  "Tenet Cycron":{"masteryReq":14,"description":"This reengineered Cycron features a refracting energy disc that can split off the main target, hitting up to 2 additional nearby targets.","noise":"Alarming","releaseDate":"2021-07-06","ammoCapacity":"Infinity","productCategory":"Pistols","zoomProps":[[]],"category":"Secondary","trigger":"Held","type":"Pistol","magazineSize":40,"reloadTime":1.5,"multishot":1,"attacks":[{"name":"Normal Attack","isBeam":true,"punch_through":1,"speed":12,"crit_chance":20,"crit_mult":1.8,"status_chance":40,"shot_type":"Discharge","damage":{"Heat":22}}],"reloadRate":40,"reloadDelay":0.5,"name":"Tenet Cycron","imageName":"tenet-cycron.webp","tags":["Corpus","Tenet"],"compTags":["BEAM"]},
  "Tenet Glaxion":{"masteryReq":16,"description":"Advances on microelectronics have improved a Corpus classic. Tenet Glaxion’s photon beam strikes up to four enemies at once. It also boasts superior Damage, Critical Chance, and Status Chance.","noise":"Alarming","releaseDate":"2024-03-27","ammoCapacity":810,"productCategory":"LongGuns","equipTime":1.1,"zoomProps":[[]],"category":"Primary","trigger":"Held","type":"Rifle","magazineSize":90,"reloadTime":2,"multishot":1,"attacks":[{"name":"Normal Attack","isBeam":true,"speed":12,"crit_chance":20,"crit_mult":2.2,"status_chance":40,"shot_type":"Hit-Scan","damage":{"Cold":34}}],"name":"Tenet Glaxion","imageName":"TenetGlaxion.webp","tags":["Corpus","Tenet"],"compTags":["BEAM","ASSAULT_AMMO","GLAXION"]},
  "Tenet Diplos":{"masteryReq":16,"description":"Itemize and execute with this pair of auto-lock-on, homing-projectile pistols. Shoot from-hip for a more conventional pistol experience. The patented Granum Attaché System reloads the pistols when holstered.","noise":"Alarming","releaseDate":"2021-07-06","ammoCapacity":460,"productCategory":"Pistols","zoomProps":[[]],"category":"Secondary","trigger":"Auto","type":"Pistol","magazineSize":92,"reloadTime":2.8,"multishot":1,"attacks":[{"name":"Normal Attack","isCoMult":true,"punch_through":1,"speed":9.67,"crit_chance":36,"crit_mult":2.2,"status_chance":14,"shot_type":"Projectile","shot_speed":50,"flight":50,"damage":{"Impact":11.2,"Slash":7.8,"Puncture":9}},{"name":"Lock-on Mode","ammoCost":2,"isCoMult":true,"punch_through":1,"speed":9.67,"crit_chance":36,"crit_mult":2.2,"status_chance":14,"shot_type":"Projectile","shot_speed":200,"flight":200,"damage":{"Impact":11.2,"Slash":7.8,"Puncture":9}}],"name":"Tenet Diplos","imageName":"tenet-diplos.webp","tags":["Corpus","Tenet"],"compTags":[]},
  "Tenet Detron":{"masteryReq":16,"description":"Parvos Granum's engineers have made this already ferocious hand cannon even more deadly with the addition of an alternate fire mode that empties an entire clip in one devastating burst.","noise":"Alarming","releaseDate":"2021-07-06","productCategory":"Pistols","zoomProps":[[]],"category":"Secondary","trigger":"Semi","type":"Pistol","magazineSize":6,"reloadTime":1,"multishot":10,"attacks":[{"name":"Normal Attack","speed":3.33,"crit_chance":18,"crit_mult":2,"status_chance":10,"shot_type":"Projectile","shot_speed":150,"flight":150,"damage":{"Radiation":26},"falloff":{"start":26,"end":52,"reduction":0.446}},{"name":"Burst Shot","speed":4.918,"crit_chance":18,"crit_mult":2,"status_chance":10,"shot_type":"Projectile","shot_speed":150,"flight":150,"damage":{"Radiation":26}}],"name":"Tenet Detron","imageName":"tenet-detron.webp","tags":["Corpus","Tenet"],"compTags":["PROJECTILE","SECONDARYSHOTGUN","SINGLESHOT"]},
  "Tenet Exec":{"masteryReq":16,"description":"Leverage bleeding-edge Granum tech with this massive heavy blade. Slam sends forth a cascading set of three shockwaves, while Heavy Slam unleashes a swath of shockwaves.","blockingAngle":55,"comboDuration":5,"followThrough":0.6,"range":2.8,"windUp":1.1,"releaseDate":"2021-07-06","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","isHeavy":false,"speed":1,"crit_chance":38,"crit_mult":2.4,"status_chance":22,"damage":{"Impact":102.6,"Slash":87.4}},{"name":"Normal Shockwave","isHeavy":false,"speed":1,"crit_chance":38,"crit_mult":2.4,"status_chance":22,"damage":{"Impact":380},"falloff":{"start":0,"end":4,"reduction":0.9}},{"name":"Heavy Shockwave","isHeavy":true,"speed":1,"crit_chance":38,"crit_mult":2.4,"status_chance":22,"damage":{"Impact":570},"falloff":{"start":0,"end":4,"reduction":0}},{"name":"Slam","radius":4,"type":"s","isHeavy":false,"speed":1,"crit_chance":38,"crit_mult":2.4,"status_chance":22,"unique":{"force_procs":["impact"]},"damage":{"Impact":380}},{"name":"Heavy Slam","radius":4,"type":"hs","isHeavy":true,"speed":1,"crit_chance":38,"crit_mult":2.4,"status_chance":22,"damage":{"Impact":570}}],"name":"Tenet Exec","imageName":"tenet-exec.webp","tags":["Corpus","Tenet"],"compTags":["HEAVY_BLADE_STANCE"]},
  "Tenet Envoy":{"masteryReq":16,"description":"This discreet rocket launcher is equally at home in a board meeting or on a casual outing. Aimed rockets are wire-guided for greater accuracy, but travel more slowly. The patented Granum Attaché System reloads the weapon when holstered.","noise":"Alarming","releaseDate":"2021-07-06","ammoCapacity":16,"productCategory":"LongGuns","equipTime":1.33,"category":"Primary","trigger":"Semi","type":"Rifle","magazineSize":8,"reloadTime":4,"multishot":1,"attacks":[{"name":"Grenade Impact","isCoMult":true,"speed":0.83,"crit_chance":28,"crit_mult":2.6,"status_chance":24,"shot_type":"Projectile","shot_speed":40,"flight":40,"damage":{"Impact":100}},{"name":"Rocket Explosion","speed":0.83,"crit_chance":28,"crit_mult":2.6,"status_chance":24,"shot_type":"AoE","damage":{"Cold":640},"falloff":{"start":0,"end":8,"reduction":0.8},"no_headshot_mult":true}],"name":"Tenet Envoy","imageName":"tenet-envoy.webp","tags":["Corpus","Tenet"],"compTags":["PROJECTILE","SNIPER_AMMO","AOE"],"comb":[[0,1]]},
  "Tenet Ferrox":{"masteryReq":16,"description":"The expert engineers in Parvos Granum’s division have optimized the Ferrox’s lethal power.","noise":"Alarming","releaseDate":"2022-11-30","ammoCapacity":100,"productCategory":"LongGuns","zoomProps":[[]],"category":"Primary","trigger":"Charge","type":"Rifle","magazineSize":20,"reloadTime":1.8,"multishot":1,"attacks":[{"name":"Charged Shot","speed":2.67,"crit_chance":34,"crit_mult":3,"status_chance":26,"shot_type":"Hit-Scan","damage":{"Impact":20,"Slash":40,"Puncture":140},"charge_time":0.4},{"name":"Radial Attack","speed":2.67,"crit_chance":34,"crit_mult":3,"status_chance":26,"shot_type":"AoE","damage":{"Impact":6,"Slash":12,"Puncture":42},"falloff":{"start":0,"end":4,"reduction":0.3},"no_headshot_mult":true},{"name":"Spear Throw","speed":1,"crit_chance":4,"crit_mult":2,"status_chance":33,"shot_type":"Projectile","shot_speed":90,"flight":90,"damage":{"Impact":35,"Slash":10,"Puncture":5}},{"name":"Attraction Field","speed":0.5,"crit_chance":4,"crit_mult":2,"status_chance":50,"shot_type":"AoE","damage":{"Electricity":150},"no_headshot_mult":true}],"name":"Tenet Ferrox","imageName":"tenet-ferrox.webp","tags":["Corpus","Tenet"],"compTags":["PROJECTILE","SNIPER_AMMO"],"comb":[[0,1]]},
  "Tenet Flux Rifle":{"masteryReq":16,"description":"Sister-modified Flux Rifle with increased fire rate and range. Recharge has been replaced with ammo clips to accommodate greater power needs.","noise":"Alarming","releaseDate":"2021-07-06","ammoCapacity":1200,"productCategory":"LongGuns","equipTime":1.1,"zoomProps":[[]],"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":120,"reloadTime":1.8,"multishot":1,"attacks":[{"name":"Normal Attack","speed":15,"crit_chance":20,"crit_mult":1.8,"status_chance":26,"shot_type":"Hit-Scan","damage":{"Slash":17.2,"Puncture":4.8}}],"name":"Tenet Flux Rifle","imageName":"tenet-flux-rifle.webp","tags":["Corpus","Tenet"],"compTags":["BEAM","ASSAULT_AMMO","FLUX"]},
  "Tenet Grigori":{"masteryReq":14,"description":"On Heavy Slide Attack, this Corpus scythe launches a spinning energy disk that ricochets throughout the battlefield. Its lifetime is derived from the size of the Combo Counter. Note: The Granum Attaché system pauses the combo timer when holstered.","blockingAngle":90,"comboDuration":5,"followThrough":0.6,"range":2.5,"windUp":1,"releaseDate":"2021-07-06","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"465","slam":{"damage":"855.00","radial":{"damage":"285.00","element":"Impact","radius":8}},"isHeavy":false,"speed":1.08,"crit_chance":24,"crit_mult":1.6,"status_chance":38,"damage":{"Impact":9.1,"Slash":136.8,"Puncture":82.1}},{"name":"Energy Disk","isHeavy":true,"speed":1,"crit_chance":24,"crit_mult":1.6,"status_chance":38,"shot_type":"Projectile","shot_speed":1,"flight":1,"damage":{"Impact":1360,"Slash":1360,"Puncture":1360},"charge_time":1},{"name":"Slam","radius":8,"type":"s","isHeavy":false,"speed":1,"crit_chance":24,"crit_mult":1.6,"status_chance":38,"unique":{"force_procs":["impact"]},"damage":{"Impact":456}},{"name":"Heavy Slam","radius":8,"type":"hs","isHeavy":true,"speed":1,"crit_chance":24,"crit_mult":1.6,"status_chance":38,"damage":{"Blast":684}}],"name":"Tenet Grigori","imageName":"tenet-grigori.webp","tags":["Corpus","Tenet"],"compTags":["SCYTHES_STANCE"]},
  "Tetra":{"masteryReq":3,"description":"Drawing from its huge quad-chambered magazine, the Tetra is capable of unleashing a sustained barrage of lethal energy bolts.","noise":"Alarming","releaseDate":"2014-01-22","ammoCapacity":540,"productCategory":"LongGuns","equipTime":1.1,"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":60,"reloadTime":2,"multishot":1,"attacks":[{"name":"Normal Attack","speed":6.67,"crit_chance":4,"crit_mult":1.5,"status_chance":20,"shot_type":"Projectile","shot_speed":100,"flight":100,"damage":{"Impact":6.4,"Puncture":25.6}}],"name":"Tetra","imageName":"tetra.webp","tags":["Corpus"],"compTags":["PROJECTILE","ASSAULT_AMMO","TETRA"]},
  "Tenora Prime":{"masteryReq":14,"description":"Add lethal staccato percussion to Octavia's melodies with this masterpiece assault rifle.","noise":"Alarming","releaseDate":"2021-02-23","ammoCapacity":1000,"productCategory":"LongGuns","equipTime":1.1,"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":200,"reloadTime":2.5,"multishot":1,"attacks":[{"name":"Fully Spooled","speed":12.67,"crit_chance":30,"crit_mult":2.2,"status_chance":24,"shot_type":"Hit-Scan","damage":{"Impact":8.4,"Slash":8.4,"Puncture":11.2}},{"name":"Charged Attack","ammoCost":10,"punch_through":1,"speed":2,"crit_chance":40,"crit_mult":3,"status_chance":20,"shot_type":"Hit-Scan","damage":{"Impact":56,"Slash":56,"Puncture":168},"charge_time":0.8}],"name":"Tenora Prime","imageName":"tenora-prime.webp","tags":["Prime"],"compTags":["ASSAULT_AMMO"]},
  "Tenet Spirex":{"masteryReq":14,"description":"Dominate rivals with this pistol’s lightning fast rail-slugs. Head-shots speed up reload.","noise":"Alarming","releaseDate":"2021-07-06","ammoCapacity":80,"productCategory":"Pistols","zoomProps":[[]],"category":"Secondary","trigger":"Semi","type":"Pistol","magazineSize":8,"reloadTime":2.4000001,"multishot":1,"attacks":[{"name":"Slug Impact","isCoMult":true,"speed":2.33,"crit_chance":26,"crit_mult":2.4,"status_chance":40,"shot_type":"Projectile","shot_speed":260,"flight":260,"unique":{"force_procs":["impact"],"WITH_COND":{"reloadTime":0.5}},"damage":{"Impact":40,"Puncture":20,"Heat":60}},{"name":"Explosion","speed":2.33,"crit_chance":26,"crit_mult":2.4,"status_chance":40,"shot_type":"AoE","unique":{"WITH_COND":{"reloadTime":0.5}},"damage":{"Heat":80},"falloff":{"start":0,"end":2,"reduction":0.2},"no_headshot_mult":true}],"name":"Tenet Spirex","imageName":"tenet-spirex.webp","tags":["Corpus","Tenet"],"compTags":["BEAM"],"comb":[[0,1]]},
  "Tenet Plinx":{"masteryReq":6,"description":"Alternate fire on this reengineered Plinx fires a projectile that pulls enemies close and then explodes. Its cooldown increases after the explosion to accommodate battery power demands.","noise":"Alarming","releaseDate":"2022-11-30","ammoCapacity":8,"productCategory":"Pistols","zoomProps":[[]],"category":"Secondary","trigger":"Charge","type":"Pistol","magazineSize":10,"reloadTime":1.3,"multishot":1,"attacks":[{"name":"Semi-Auto","speed":3.33,"crit_chance":44,"crit_mult":3,"status_chance":12,"shot_type":"Hit-Scan","damage":{"Puncture":40,"Heat":30}},{"name":"Alt-Fire","ammoCost":"all","isCoMult":true,"speed":1,"crit_chance":40,"crit_mult":3,"status_chance":20,"shot_type":"Projectile","shot_speed":100,"flight":100,"unique":{"force_procs":["impact"],"magazineSizeMult":0.1},"damage":{"Impact":1000},"charge_time":0.8},{"name":"Alt-Fire AoE","ammoCost":"all","speed":1,"crit_chance":40,"crit_mult":3,"status_chance":20,"shot_type":"AoE","unique":{"magazineSizeMult":0.1},"damage":{"Radiation":1000},"falloff":{"start":0,"end":6,"reduction":0.4},"no_headshot_mult":true,"charge_time":0.8}],"reloadRate":20,"reloadDelay":0.8,"name":"Tenet Plinx","imageName":"tenet-plinx.webp","tags":["Corpus","Tenet"],"compTags":["PROJECTILE"],"comb":[[1,2]]},
  "Tenet Tetra":{"masteryReq":16,"description":"Parvosian upgrade of the classic Tetra. Slower fire rate but with a larger magazine. Can now alt-fire entire clip as a large burst radius grenade launcher.","noise":"Alarming","releaseDate":"2021-07-06","ammoCapacity":480,"productCategory":"LongGuns","equipTime":1.1,"zoomProps":[[]],"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":80,"reloadTime":2.2,"multishot":1,"attacks":[{"name":"Normal Attack","speed":5,"crit_chance":28,"crit_mult":2.2,"status_chance":30,"shot_type":"Projectile","shot_speed":100,"flight":100,"damage":{"Impact":13.2,"Slash":13.2,"Puncture":33.6}},{"name":"Grenade Impact","ammoCost":"all","speed":1.33,"crit_chance":28,"crit_mult":2.2,"status_chance":30,"shot_type":"Projectile","shot_speed":60,"flight":60,"damage":{"Impact":200}},{"name":"Grenade AoE","ammoCost":"all","speed":1.33,"crit_chance":28,"crit_mult":2.2,"status_chance":30,"shot_type":"AoE","damage":{"Blast":1000},"falloff":{"start":0,"end":8,"reduction":0.6},"no_headshot_mult":true}],"name":"Tenet Tetra","imageName":"tenet-tetra.webp","tags":["Corpus","Tenet"],"compTags":["PROJECTILE","ASSAULT_AMMO","TETRA"],"comb":[[1,2]]},
  "Tenora":{"masteryReq":10,"description":"Unload percussive machine gun fire, or strike a heavy chord with a single charge shot. When Octavia wields her signature rifle alt-fire Headshot Kills have a chance to instantly refill the magazine.","noise":"Alarming","releaseDate":"2017-03-24","ammoCapacity":900,"productCategory":"LongGuns","equipTime":1.1,"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":150,"reloadTime":2.5,"multishot":1,"attacks":[{"name":"Fully Spooled","speed":11.67,"crit_chance":28,"crit_mult":2,"status_chance":16,"shot_type":"Hit-Scan","damage":{"Impact":7.2,"Slash":7.2,"Puncture":9.6}},{"name":"Charged Attack","ammoCost":10,"punch_through":1,"speed":10,"crit_chance":34,"crit_mult":3,"status_chance":11,"shot_type":"Hit-Scan","damage":{"Impact":48,"Slash":48,"Puncture":144},"charge_time":0.8}],"name":"Tenora","imageName":"tenora.webp","tags":["Tenno"],"compTags":["ASSAULT_AMMO"]},
  "Tenet Quanta":{"masteryReq":16,"description":"Once a mining tool adapted for military purposes, Parvosian engineering has enhanced the Quanta's lethality even further.","noise":"Alarming","releaseDate":"2026-03-25","ammoCapacity":540,"productCategory":"LongGuns","category":"Primary","trigger":"Held","type":"Rifle","magazineSize":100,"reloadTime":2,"multishot":1,"attacks":[{"name":"Beam","multishot":2,"isBeam":true,"speed":10,"crit_chance":31,"crit_mult":2.5,"status_chance":26,"shot_type":"Discharge","damage":{"Electricity":18}},{"name":"Cube (direct hit)","ammoCost":10,"speed":4,"crit_chance":5,"crit_mult":1.5,"status_chance":26,"shot_type":"Projectile","shot_speed":25,"damage":{"Electricity":180}},{"name":"Cube Explosion","ammoCost":5,"speed":4,"crit_chance":5,"crit_mult":1.5,"status_chance":26,"shot_type":"AoE","damage":{"Electricity":150},"no_headshot_mult":true},{"name":"Cube (shot by player)","ammoCost":5,"speed":4,"crit_chance":5,"crit_mult":1.5,"status_chance":26,"shot_type":"AoE","damage":{"Blast":600},"no_headshot_mult":true}],"name":"Tenet Quanta","imageName":"TenetQuanta.webp","tags":["Corpus","Tenet"],"compTags":["PROJECTILE","BEAM","ASSAULT_AMMO"],"comb":[[]]},
  "Tenet Livia":{"masteryReq":14,"description":"The sleek lines of the Granum Attaché case conceal an infinitely sharp two-handed blade. Blocked attacks have a chance to increase the blocking angle. Note: The Granum Attaché system pauses the combo timer when holstered.","blockingAngle":55,"comboDuration":5,"followThrough":0.7,"range":2.5,"windUp":0.7,"releaseDate":"2021-07-06","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"396","slam":{"damage":"594.00","radial":{"damage":"198.00","element":"Impact","radius":6}},"speed":1.08,"crit_chance":28,"crit_mult":2.2,"status_chance":28,"damage":{"Impact":9.9,"Slash":178.2,"Puncture":9.9}},{"name":"Slam","radius":7,"type":"s","isHeavy":false,"speed":1,"crit_chance":28,"crit_mult":2.2,"status_chance":28,"unique":{"force_procs":["impact"]},"damage":{"Impact":396}},{"name":"Heavy Slam","radius":8,"type":"hs","isHeavy":true,"speed":1,"crit_chance":28,"crit_mult":2.2,"status_chance":28,"damage":{"Blast":594}}],"name":"Tenet Livia","imageName":"tenet-livia.webp","tags":["Corpus","Tenet"],"compTags":["LONG_KATANA_STANCE"]},
  "Tiberon Prime":{"masteryReq":14,"description":"Art meets ingenuity with this beautifully deadly rifle.","noise":"Alarming","releaseDate":"2018-03-20","ammoCapacity":546,"productCategory":"LongGuns","equipTime":1.1,"zoomProps":[[]],"category":"Primary","trigger":"Burst","type":"Rifle","magazineSize":42,"reloadTime":2,"multishot":1,"attacks":[{"name":"Auto","speed":8.33,"crit_chance":16,"crit_mult":2.8,"status_chance":32,"shot_type":"Hit-Scan","damage":{"Impact":13.8,"Slash":13.8,"Puncture":18.4}},{"name":"Semi-Auto","speed":6,"crit_chance":30,"crit_mult":3.4,"status_chance":18,"shot_type":"Hit-Scan","damage":{"Impact":13.8,"Slash":13.8,"Puncture":18.4}},{"name":"Burst","speed":5,"crit_chance":28,"crit_mult":3,"status_chance":20,"shot_type":"Hit-Scan","damage":{"Impact":13.8,"Slash":13.8,"Puncture":18.4},"burst_count":3,"burst_delay":0.08}],"name":"Tiberon Prime","imageName":"tiberon-prime.webp","tags":["Prime","Vaulted"],"compTags":["ASSAULT_AMMO"]},
  "Thornbak":{"masteryReq":0,"description":"A sturdy burst-rifle of considerable age and unknown origin collected by Teshin during his many years wandering the Origin System.","noise":"Alarming","releaseDate":"2025-10-15","ammoCapacity":540,"productCategory":"LongGuns","category":"Primary","trigger":"Burst","type":"Rifle","magazineSize":52,"reloadTime":1.8,"multishot":1,"attacks":[{"name":"Normal Attack","speed":6,"crit_chance":6,"crit_mult":1.4,"status_chance":36,"shot_type":"Hit-Scan","damage":{"Impact":9.332,"Slash":9.332,"Puncture":9.335},"burst_count":4,"burst_delay":0.066}],"name":"Thornbak","imageName":"thornbak.webp","tags":[],"compTags":["ASSAULT_AMMO"]},
  "Tigris":{"masteryReq":7,"description":"The double-barreled Tigris shotgun fires two bursts in rapid succession, easily taking down the toughest prey.","noise":"Alarming","releaseDate":"2013-11-20","ammoCapacity":120,"productCategory":"LongGuns","zoomProps":[[]],"category":"Primary","trigger":"Duplex","type":"Shotgun","magazineSize":2,"reloadTime":1.8,"multishot":5,"attacks":[{"name":"Normal Attack","speed":2,"crit_chance":10,"crit_mult":2,"status_chance":16.8,"shot_type":"Hit-Scan","damage":{"Impact":21,"Slash":168,"Puncture":21},"falloff":{"start":10,"end":20,"reduction":0.5238}}],"name":"Tigris","imageName":"tigris.webp","tags":["Tenno"],"compTags":["SINGLESHOT","TIGRIS"]},
  "Tipedo Prime":{"masteryReq":10,"description":"With their final breath they look to the moon, and are gone.","blockingAngle":60,"comboDuration":5,"followThrough":0.5,"range":3,"windUp":0.5,"releaseDate":"2019-03-27","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"163","slam":{"damage":"510.00","radial":{"damage":"170.00","element":"Impact","radius":6}},"speed":1.17,"crit_chance":24,"crit_mult":2.4,"status_chance":24,"damage":{"Impact":17,"Slash":136,"Puncture":17}},{"name":"Slam","radius":6,"type":"s","isHeavy":false,"speed":1,"crit_chance":24,"crit_mult":2.4,"status_chance":24,"unique":{"force_procs":["impact"]},"damage":{"Impact":340}},{"name":"Heavy Slam","radius":7,"type":"hs","isHeavy":true,"speed":1,"crit_chance":24,"crit_mult":2.4,"status_chance":24,"damage":{"Blast":510}}],"name":"Tipedo Prime","imageName":"tipedo-prime.webp","tags":["Prime","Vaulted"],"compTags":["STAVES_STANCE"]},
  "Tiberon":{"masteryReq":10,"description":"Forged by a master gunsmith, this Tenno burst rifle will strike down targets with swift precision.","noise":"Alarming","releaseDate":"2014-10-01","productCategory":"LongGuns","equipTime":1.1,"category":"Primary","trigger":"Burst","type":"Rifle","magazineSize":30,"reloadTime":2.26,"multishot":1,"attacks":[{"name":"Normal Attack","speed":6.67,"crit_chance":26,"crit_mult":2.4,"status_chance":16,"shot_type":"Hit-Scan","damage":{"Impact":11,"Slash":11,"Puncture":22},"burst_count":3,"burst_delay":0.06}],"name":"Tiberon","imageName":"tiberon.webp","tags":["Tenno"],"compTags":["ASSAULT_AMMO"]},
  "Tigris Prime":{"masteryReq":13,"description":"An artifact of exquisite beauty. A weapon of deadly purpose.","noise":"Alarming","releaseDate":"2016-08-23","ammoCapacity":120,"productCategory":"LongGuns","zoomProps":[[]],"category":"Primary","trigger":"Duplex","type":"Rifle","magazineSize":2,"reloadTime":1.8,"multishot":8,"attacks":[{"name":"Normal Attack","speed":2,"crit_chance":10,"crit_mult":2,"status_chance":11.25,"shot_type":"Hit-Scan","damage":{"Impact":19.5,"Slash":156,"Puncture":19.5},"falloff":{"start":10,"end":20,"reduction":0.4872}}],"name":"Tigris Prime","imageName":"tigris-prime.webp","tags":["Prime","Vaulted"],"compTags":["SINGLESHOT","TIGRIS"]},
  "Tipedo":{"masteryReq":3,"description":"With its crescent shaped blades flying in sweeping arcs and striking at tremendous speed, the Tipedo demands focus from those wishing to unlock its true power.","blockingAngle":60,"comboDuration":5,"followThrough":0.5,"range":3,"windUp":0.5,"releaseDate":"2015-01-08","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"124","slam":{"damage":"372.00","radial":{"damage":"124.00","radius":6}},"speed":1.33,"crit_chance":20,"crit_mult":2,"status_chance":20,"damage":{"Impact":12.4,"Slash":99.2,"Puncture":12.4}},{"name":"Slam","radius":6,"type":"s","isHeavy":false,"speed":1,"crit_chance":20,"crit_mult":2,"status_chance":20,"unique":{"force_procs":["impact"]},"damage":{"Impact":248}},{"name":"Heavy Slam","radius":7,"type":"hs","isHeavy":true,"speed":1,"crit_chance":20,"crit_mult":2,"status_chance":20,"damage":{"Blast":372}}],"name":"Tipedo","imageName":"tipedo.webp","tags":["Tenno"],"compTags":["STAVES_STANCE"]},
  "Tombfinger (Secondary)":{"masteryReq":0,"description":"Launches spore-sacs that explode with toxic mist on each bounce. Automatic trigger.","ammoCapacity":540,"productCategory":"","category":"Secondary","type":"Kitgun","magazineSize":0,"reloadTime":3,"multishot":1,"attacks":[{"name":"Normal Attack","speed":1,"crit_chance":0,"crit_mult":0,"status_chance":0,"shot_type":"Projectile","shot_speed":180,"unique":{"force_procs":["impact"]},"damage":{"Impact":16,"Puncture":9,"Radiation":18}},{"name":"Explosion","speed":1,"crit_chance":0,"crit_mult":0,"status_chance":0,"shot_type":"AoE","damage":{"Radiation":41},"no_headshot_mult":true}],"name":"Tombfinger (Secondary)","imageName":"tombfinger.webp","tags":["secondary-projectile"],"compTags":["PROJECTILE","AOE"],"comb":[[0,1]]},
  "Tonbo":{"masteryReq":3,"description":"During the darkest days of the Old War many a Tenno relied solely on the Tonbo to keep them alive.","blockingAngle":55,"comboDuration":5,"followThrough":0.6,"range":3,"windUp":0.9,"releaseDate":"2015-02-18","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"368","slam":{"damage":"552.00","radial":{"damage":"184.00","radius":7}},"speed":1,"crit_chance":5,"crit_mult":2,"status_chance":25,"damage":{"Impact":18.4,"Slash":138,"Puncture":27.6}},{"name":"Slam","radius":7,"type":"s","isHeavy":false,"speed":1,"crit_chance":5,"crit_mult":2,"status_chance":25,"unique":{"force_procs":["impact"]},"damage":{"Blast":368}},{"name":"Heavy Slam","radius":8,"type":"hs","isHeavy":true,"speed":1,"crit_chance":5,"crit_mult":2,"status_chance":25,"damage":{"Blast":552}}],"name":"Tonbo","imageName":"tonbo.webp","tags":["Tenno"],"compTags":["POLEARMS_STANCE"]},
  "Tombfinger (Primary)":{"masteryReq":0,"description":"Launches spore-sacs that explode with toxic mist on each bounce. Automatic trigger.","ammoCapacity":540,"productCategory":"","category":"Primary","type":"Kitgun","magazineSize":0,"reloadTime":3,"multishot":1,"attacks":[{"name":"Normal Attack","speed":1,"crit_chance":0,"crit_mult":0,"status_chance":0,"shot_type":"Projectile","shot_speed":90,"unique":{"force_procs":["impact"]},"damage":{"Impact":16,"Puncture":9,"Radiation":18},"charge_time":0},{"name":"Explosion","speed":1,"crit_chance":0,"crit_mult":0,"status_chance":0,"shot_type":"AoE","damage":{"Radiation":41},"no_headshot_mult":true,"charge_time":0}],"name":"Tombfinger (Primary)","imageName":"tombfinger.webp","tags":["primary-rifle-projectile"],"compTags":["PROJECTILE","AOE"],"comb":[[0,1]]},
  "Tonkkatt":{"masteryReq":9,"description":"Rend enemies and up the heat with these mining tools repurposed into machine-tonfa. Building the Combo Multiplier overheats the Tonkkatts, setting enemies ablaze.","blockingAngle":60,"comboDuration":5,"followThrough":0.6,"range":2.5,"windUp":0.7,"releaseDate":"2025-04-17","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":1.084,"crit_chance":23,"crit_mult":2.1,"status_chance":21,"unique":{"status_damage_heat":1.2,"addHeatNotCombined":1.2},"damage":{"Slash":132,"Puncture":33}},{"name":"Slam","radius":8,"type":"s","isHeavy":false,"speed":1,"crit_chance":23,"crit_mult":2.1,"status_chance":10,"unique":{"force_procs":["impact"]},"damage":{"Impact":330}},{"name":"Heavy Slam","radius":9,"type":"hs","isHeavy":true,"speed":1,"crit_chance":23,"crit_mult":2.1,"status_chance":10,"damage":{"Blast":495}}],"name":"Tonkkatt","imageName":"Tonkkatt.webp","tags":[],"compTags":["TONFA_STANCE"]},
  "Twin Krohkur":{"masteryReq":10,"description":"Battlefield butchery becomes all too easy with a Krohkur blade in each hand.","blockingAngle":60,"comboDuration":5,"followThrough":0.5,"range":2.5,"windUp":0.7,"releaseDate":"2017-10-12","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","slide":"500","slam":{"damage":"500.00","radial":{"damage":"250.00","radius":8}},"speed":0.917,"crit_chance":19,"crit_mult":1.7,"status_chance":33,"damage":{"Impact":30,"Slash":175,"Puncture":45}},{"name":"Slam","radius":8,"type":"s","isHeavy":false,"speed":1,"crit_chance":19,"crit_mult":1.7,"status_chance":33,"unique":{"force_procs":["impact"]},"damage":{"Blast":500}},{"name":"Heavy Slam","radius":9,"type":"hs","isHeavy":true,"speed":1,"crit_chance":19,"crit_mult":1.7,"status_chance":33,"damage":{"Blast":750}}],"name":"Twin Krohkur","imageName":"twin-krohkur.webp","tags":["Grineer"],"compTags":["DUAL_SWORDS_STANCE"]},
  "Twin Kohmak":{"masteryReq":10,"description":"Doubling their volley on each successive shot, the Twin Kohmaks decimate foes in seconds.","noise":"Alarming","releaseDate":"2015-03-19","ammoCapacity":240,"productCategory":"Pistols","equipTime":1.1,"category":"Secondary","trigger":"Auto","type":"Pistol","magazineSize":80,"reloadTime":2.2,"multishot":5,"attacks":[{"name":"Single Pellet","punch_through":1.5,"speed":1.334,"crit_chance":11,"crit_mult":2,"status_chance":69,"shot_type":"Hit-Scan","damage":{"Impact":6,"Slash":18,"Puncture":6},"falloff":{"start":12,"end":24,"reduction":0.8333}},{"name":"Fully Spooled","punch_through":1.5,"speed":6.67,"crit_chance":11,"crit_mult":2,"status_chance":13.8,"shot_type":"Hit-Scan","damage":{"Impact":6,"Slash":18,"Puncture":6},"falloff":{"start":12,"end":24,"reduction":0.8333}}],"name":"Twin Kohmak","imageName":"twin-kohmak.webp","tags":["Grineer"],"compTags":["SECONDARYSHOTGUN"]},
  "Twin Grakatas":{"masteryReq":9,"description":"When one Grakata isn't enough, bring another for extra firepower.","noise":"Alarming","releaseDate":"2015-07-31","ammoCapacity":1200,"productCategory":"Pistols","equipTime":1.1,"category":"Secondary","trigger":"Auto","type":"Rifle","magazineSize":60,"reloadTime":3,"multishot":2,"attacks":[{"name":"Normal Attack","ammoCost":2,"speed":20,"crit_chance":25,"crit_mult":2.7,"status_chance":16.5,"shot_type":"Hit-Scan","damage":{"Impact":4,"Slash":2.67,"Puncture":3.33}}],"name":"Twin Grakatas","imageName":"twin-grakatas.webp","tags":["Grineer"],"compTags":[]},
  "Trumna Prime":{"masteryReq":15,"description":"Sleek lines and golden accents define this masterpiece of the illustrious Entrati family.","noise":"Alarming","releaseDate":"2024-11-13","ammoCapacity":500,"productCategory":"LongGuns","zoomProps":[[]],"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":250,"reloadTime":4,"multishot":1,"attacks":[{"name":"Auto","speed":4.67,"crit_chance":24,"crit_mult":2.4,"status_chance":34,"shot_type":"Hit-Scan","damage":{"Impact":32,"Heat":53}},{"name":"Auto AoE","speed":4.67,"crit_chance":24,"crit_mult":2.4,"status_chance":34,"shot_type":"AoE","damage":{"Heat":50},"no_headshot_mult":true},{"name":"Grenade Impact","speed":1.33,"crit_chance":38,"crit_mult":2.4,"status_chance":50,"damage":{"Impact":100}},{"name":"Grenade Bounce AoE","speed":1.33,"crit_chance":38,"crit_mult":2.4,"status_chance":50,"shot_type":"AoE","damage":{"Heat":1150},"no_headshot_mult":true}],"name":"Trumna Prime","imageName":"TrumnaPrime.webp","tags":[],"compTags":["ASSAULT_AMMO","PROJECTILE","AOE"],"comb":[[0,1],[2,3]]},
  "Trumna":{"masteryReq":13,"description":"An ancient weapon designed by the Entrati. Primary fire siphons life essence from the target to fuel a devastating secondary fire. A heavy, oversized automatic rifle with withering fire that delivers rapid heat damage. Secondary fire unleashes an arcing projectile that ricochets off surfaces and enemies, exploding on every impact.","noise":"Alarming","releaseDate":"2020-08-25","ammoCapacity":400,"productCategory":"LongGuns","equipTime":1.1,"zoomProps":[[]],"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":200,"reloadTime":5,"multishot":1,"attacks":[{"name":"Auto","speed":4.67,"crit_chance":24,"crit_mult":2.2,"status_chance":30,"shot_type":"Hit-Scan","damage":{"Impact":29,"Heat":53}},{"name":"Auto AoE","speed":4.67,"crit_chance":24,"crit_mult":2.2,"status_chance":30,"shot_type":"AoE","damage":{"Heat":50},"falloff":{"start":0,"end":1.6,"reduction":0.15},"no_headshot_mult":true},{"name":"Grenade Impact","isCoMult":true,"speed":1.33,"crit_chance":38,"crit_mult":2.4,"status_chance":50,"damage":{"Impact":100}},{"name":"Grenade Bounce AoE","speed":1.33,"crit_chance":38,"crit_mult":2.4,"status_chance":50,"shot_type":"AoE","damage":{"Heat":1000},"falloff":{"start":0,"end":6,"reduction":0.4},"no_headshot_mult":true}],"name":"Trumna","imageName":"trumna.webp","tags":["Entrati"],"compTags":["ASSAULT_AMMO","PROJECTILE","AOE"],"comb":[[0,1],[2,3]]},
  "Twin Gremlins":{"masteryReq":5,"description":"Designed as a pair, these Grineer sidearms fire projectiles at a slower rate but with greater force and accuracy.","noise":"Alarming","releaseDate":"2013-08-09","ammoCapacity":210,"productCategory":"Pistols","category":"Secondary","trigger":"Auto","type":"Dual Pistols","magazineSize":30,"reloadTime":1.1,"multishot":1,"attacks":[{"name":"Normal Attack","speed":5,"crit_chance":15,"crit_mult":1.5,"status_chance":15,"shot_type":"Projectile","shot_speed":90,"flight":90,"damage":{"Impact":12.33,"Slash":12.33,"Puncture":12.33}}],"name":"Twin Gremlins","imageName":"twin-gremlins.webp","tags":["Grineer"],"compTags":["PROJECTILE"]},
  "Torid":{"masteryReq":4,"description":"Torid lobs a toxic payload.","noise":"Alarming","releaseDate":"2013-05-23","ammoCapacity":60,"productCategory":"LongGuns","category":"Primary","trigger":"Semi","type":"Rifle","magazineSize":5,"reloadTime":1.7,"multishot":1,"attacks":[{"name":"Grenade Impact","isCoMult":true,"speed":1.5,"crit_chance":15,"crit_mult":2,"status_chance":23,"shot_type":"Projectile","shot_speed":40,"flight":40,"damage":{"Toxin":100}},{"name":"Poison Cloud","isCoMult":true,"speed":1,"crit_chance":15,"crit_mult":2,"status_chance":23,"shot_type":"AoE","damage":{"Toxin":40},"falloff":{"start":0,"end":3,"reduction":1},"no_headshot_mult":true},{"name":"Incarnon Form","isBeam":true,"isInc":1,"punch_through":3,"speed":8,"crit_chance":29,"crit_mult":3.1,"status_chance":39,"shot_type":"Hit-Scan","damage":{"Toxin":51}}],"incMagazineSize":170,"name":"Torid","imageName":"torid.webp","tags":["Infested","Incarnon"],"compTags":["PROJECTILE","SNIPER_AMMO","SINGLESHOT","AOE"],"comb":[[0,1]]},
  "Twin Basolk":{"masteryReq":7,"description":"These nasty, little hatchets slice through steel as if it were flesh.","blockingAngle":60,"comboDuration":5,"followThrough":0.5,"range":2.4,"windUp":0.7,"releaseDate":"2015-10-21","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","slide":"420","slam":{"damage":"420.00","radial":{"damage":"210.00","element":"Heat","radius":8}},"speed":1,"crit_chance":5,"crit_mult":2,"status_chance":40,"damage":{"Impact":55,"Slash":55,"Puncture":15,"Heat":85}},{"name":"Slam","radius":8,"type":"s","isHeavy":false,"speed":1,"crit_chance":5,"crit_mult":2,"status_chance":40,"unique":{"force_procs":["impact"]},"damage":{"Heat":420}},{"name":"Heavy Slam","radius":9,"type":"hs","isHeavy":true,"speed":1,"crit_chance":5,"crit_mult":2,"status_chance":40,"damage":{"Heat":630}}],"name":"Twin Basolk","imageName":"twin-basolk.webp","tags":["Grineer"],"compTags":["DUAL_SWORDS_STANCE"]},
  "Tonkor":{"masteryReq":5,"description":"Hurl mayhem and destruction with this Grineer grenade launcher.","noise":"Alarming","releaseDate":"2015-04-23","ammoCapacity":30,"productCategory":"LongGuns","category":"Primary","trigger":"Semi","type":"Rifle","magazineSize":1,"reloadTime":1.7,"multishot":1,"attacks":[{"name":"Grenade Impact","speed":3.17,"crit_chance":25,"crit_mult":2.5,"status_chance":10,"shot_type":"Projectile","shot_speed":40,"flight":40,"damage":{"Puncture":75}},{"name":"Grenade Explosion","speed":3.17,"crit_chance":25,"crit_mult":2.5,"status_chance":10,"shot_type":"AoE","damage":{"Blast":650},"falloff":{"start":0,"end":7,"reduction":0.7},"no_headshot_mult":true}],"name":"Tonkor","imageName":"tonkor.webp","tags":["Grineer"],"compTags":["PROJECTILE","SNIPER_AMMO","AOE","TONKOR"],"comb":[[0,1]]},
  "Tysis":{"masteryReq":9,"description":"The Tysis pistol spits out caustic darts that corrode their victims from within.","noise":"Alarming","releaseDate":"2014-01-15","productCategory":"Pistols","category":"Secondary","trigger":"Semi","type":"Pistol","magazineSize":11,"reloadTime":1.2,"multishot":1,"attacks":[{"name":"Normal Attack","speed":2.5,"crit_chance":3,"crit_mult":1.5,"status_chance":50,"shot_type":"Projectile","shot_speed":75,"flight":75,"damage":{"Impact":9,"Slash":17,"Puncture":23}},{"name":"Corrosive DoT","speed":2.5,"crit_chance":3,"crit_mult":1.5,"status_chance":50,"shot_type":"DoT","damage":{"Corrosive":27}}],"name":"Tysis","imageName":"tysis.webp","tags":["Infested"],"compTags":["PROJECTILE"],"comb":[[0,1]]},
  "Wrath":{"masteryReq":14,"description":"The wrath of one who knows revenge is all about timing. Orion's signature Heavy Scythe.","blockingAngle":65,"comboDuration":5,"followThrough":0.4,"range":2.8,"windUp":1,"releaseDate":"2026-06-17","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":1.2,"crit_chance":30,"crit_mult":2,"status_chance":15,"damage":{"Slash":176,"Puncture":44}},{"name":"Slam","radius":8,"type":"s","isHeavy":false,"speed":1,"crit_chance":30,"crit_mult":2,"status_chance":15,"unique":{"force_procs":["impact"],"WITH_COND":{"crit_chance":1.5}},"damage":{"Impact":440}},{"name":"Heavy Slam","radius":9,"type":"hs","isHeavy":true,"speed":1,"crit_chance":30,"crit_mult":2,"status_chance":15,"unique":{"WITH_COND":{"crit_chance":1.5}},"damage":{"Blast":660}}],"name":"Wrath","imageName":"Wrath.webp","tags":[],"compTags":["HEAVY SCYTHE_STANCE"]},
  "Twin Rogga":{"masteryReq":9,"description":"These twin barrels of destruction are the signature pistols of the Kuva Guardians.","noise":"Alarming","releaseDate":"2016-11-11","ammoCapacity":120,"productCategory":"Pistols","category":"Secondary","trigger":"Semi","type":"Pistol","magazineSize":2,"reloadTime":1.5,"multishot":15,"attacks":[{"name":"Normal Attack","speed":2.5,"crit_chance":10,"crit_mult":2,"status_chance":6.6,"shot_type":"Hit-Scan","damage":{"Impact":18.8,"Slash":4.7,"Puncture":23.5},"falloff":{"start":10,"end":20,"reduction":0.7872}}],"name":"Twin Rogga","imageName":"twin-rogga.webp","tags":["Grineer"],"compTags":["SINGLESHOT"]},
  "Twin Vipers Wraith":{"masteryReq":7,"description":"The uniquely styled Twin Vipers Wraith are a powerful variation on the standard akimbo machine-pistols.","noise":"Alarming","releaseDate":"2013-12-19","ammoCapacity":440,"productCategory":"Pistols","category":"Secondary","trigger":"Auto","type":"Pistol","magazineSize":40,"reloadTime":2,"multishot":1,"attacks":[{"name":"Normal Attack","speed":25,"crit_chance":19,"crit_mult":2,"status_chance":9,"shot_type":"Hit-Scan","damage":{"Impact":14.4,"Slash":1.8,"Puncture":1.8}}],"name":"Twin Vipers Wraith","imageName":"twin-vipers-wraith.webp","tags":["Wraith","Invasion Reward","Grineer"],"compTags":[]},
  "Vadarya Prime":{"masteryReq":15,"description":"Caliban Prime's signature sniper rifle is no mere ceremonial weapon. A sign, perhaps, that peace between Orokin and Sentient was destined to be fleeting. Struck enemies become lightning rods, with a chance to attract bolts of chain lightning that can jump to nearby enemies.","noise":"Alarming","releaseDate":"2025-08-26","ammoCapacity":72,"productCategory":"LongGuns","category":"Primary","trigger":"Semi","type":"Rifle","magazineSize":16,"reloadTime":2.6,"multishot":1,"attacks":[{"name":"Unzoomed","speed":2.8,"crit_chance":40,"crit_mult":2.8,"status_chance":18,"shot_type":"Hit-Scan","damage":{"Electricity":400},"charge_time":0.75},{"name":"8x Zoom","speed":2.8,"crit_chance":40,"crit_mult":2.8,"status_chance":18,"shot_type":"Hit-Scan","unique":{"crit_mult":0.5},"damage":{"Electricity":400},"charge_time":0.75}],"name":"Vadarya Prime","imageName":"VadaryaPrime.webp","tags":[],"compTags":["SNIPER_AMMO"]},
  "Twin Vipers":{"masteryReq":5,"description":"A Viper equipped in each hand.","noise":"Alarming","releaseDate":"2013-04-12","ammoCapacity":420,"productCategory":"Pistols","category":"Secondary","trigger":"Auto","type":"Dual Pistols","magazineSize":28,"reloadTime":2,"multishot":1,"attacks":[{"name":"Normal Attack","speed":25,"crit_chance":15,"crit_mult":1.5,"status_chance":11,"shot_type":"Hit-Scan","damage":{"Impact":10.2,"Slash":5.1,"Puncture":1.7}}],"name":"Twin Vipers","imageName":"twin-vipers.webp","tags":["Grineer"],"compTags":[]},
  "Vasto":{"masteryReq":4,"description":"Steady and reliable, the Vasto revolver combines speed and power for a classic gunslinger feel.","noise":"Alarming","releaseDate":"2013-07-26","productCategory":"Pistols","category":"Secondary","trigger":"Semi","type":"Pistol","magazineSize":6,"reloadTime":1,"multishot":1,"attacks":[{"name":"Normal Attack","speed":2.5,"crit_chance":20,"crit_mult":1.8,"status_chance":8,"shot_type":"Hit-Scan","damage":{"Impact":22.5,"Slash":45,"Puncture":22.5}},{"name":"Incarnon Form","multishot":6,"isInc":1,"speed":2.5,"crit_chance":30,"crit_mult":2.8,"status_chance":2.7,"damage":{"Impact":7.5,"Slash":15,"Puncture":7.5},"burst_count":6,"burst_delay":0.1}],"incMagazineSize":24,"name":"Vasto","imageName":"vasto.webp","tags":["Tenno","Incarnon"],"compTags":[]},
  "Valkyr Talons (Valkyr)":{"masteryReq":0,"description":"Valkyr Talons are Valkyr and Valkyr Valkyr Prime's signature Exalted Weapon, summoned by activating the ability Hysteria. 5% lifesteal.","blockingAngle":60,"comboDuration":5,"followThrough":1,"range":1.7,"windUp":0.5,"releaseDate":"2018-06-15","productCategory":"Melee","category":"Melee","type":"Exalted Weapon","multishot":1,"attacks":[{"name":"Normal Attack","speed":1.5,"crit_chance":50,"crit_mult":2,"status_chance":10,"damage":{"Impact":83.5,"Slash":83.5,"Puncture":83.5}},{"name":"Slam","radius":6,"type":"s","isHeavy":false,"speed":1,"crit_chance":50,"crit_mult":2,"status_chance":10,"damage":{"Impact":167,"Slash":167,"Puncture":167}},{"name":"Heavy Slam","radius":7,"type":"hs","isHeavy":true,"speed":1,"crit_chance":50,"crit_mult":2,"status_chance":10,"damage":{"Blast":750}}],"name":"Valkyr Talons (Valkyr)","imageName":"ValkyrTalons.webp","tags":[],"compTags":["HYSTERIA_STANCE","POWER_WEAPON"]},
  "Vastilok":{"masteryReq":9,"description":"Slash and blast with this heavy Gunblade of brutal Grineer design. High slash damage paired with a heavy shotgun attack.","blockingAngle":90,"comboDuration":5,"followThrough":0.5,"range":1,"windUp":0.4,"releaseDate":"2021-07-17","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","slide":"558","slam":{"damage":"837.00","radial":{"damage":"279.00","element":"Impact","radius":5}},"isHeavy":false,"speed":1,"crit_chance":19,"crit_mult":1.7,"status_chance":31,"damage":{"Impact":19.53,"Slash":234.36,"Puncture":25.11}},{"name":"Ranged Attack","multishot":9,"punch_through":1.3,"isHeavy":true,"speed":1,"crit_chance":19,"crit_mult":1.7,"status_chance":10.33,"shot_type":"Hit-Scan","damage":{"Impact":8.97,"Slash":49.68,"Puncture":10.35},"falloff":{"start":24,"end":49,"reduction":0.9565},"charge_time":0.4},{"name":"Slam","radius":5,"type":"s","isHeavy":false,"speed":1,"crit_chance":19,"crit_mult":1.7,"status_chance":31,"damage":{"Blast":558}},{"name":"Heavy Slam","radius":7,"type":"hs","isHeavy":true,"speed":1,"crit_chance":19,"crit_mult":1.7,"status_chance":31,"damage":{"Blast":837}}],"name":"Vastilok","imageName":"vastilok.webp","tags":["Grineer"],"compTags":["GUNBLADE_STANCE"]},
  "Vasto Prime":{"masteryReq":10,"description":"This elegant rapid-fire revolver is the embodiment of superior Orokin craftsmanship.","noise":"Alarming","releaseDate":"2014-12-16","productCategory":"Pistols","category":"Secondary","trigger":"Semi","type":"Pistol","magazineSize":6,"reloadTime":1,"multishot":1,"attacks":[{"name":"Normal Attack","speed":2.5,"crit_chance":22,"crit_mult":2.4,"status_chance":22,"shot_type":"Hit-Scan","damage":{"Impact":16.5,"Slash":77,"Puncture":16.5}},{"name":"Incarnon Form","multishot":6,"isInc":1,"speed":2.5,"crit_chance":30,"crit_mult":3.2,"status_chance":6.7,"damage":{"Impact":10.5,"Slash":49,"Puncture":10.5},"burst_count":6,"burst_delay":0.1}],"incMagazineSize":24,"name":"Vasto Prime","imageName":"vasto-prime.webp","tags":["Prime","Vaulted","Incarnon"],"compTags":[]},
  "Vaykor Marelok":{"masteryReq":10,"description":"Taken from defeated Grineer commanders and rebuilt to improve combat efficiency and reliability.","noise":"Alarming","releaseDate":"2014-11-27","productCategory":"Pistols","category":"Secondary","trigger":"Semi","type":"Pistol","magazineSize":10,"reloadTime":1.6670001,"multishot":1,"attacks":[{"name":"Normal Attack","speed":2,"crit_chance":20,"crit_mult":1.5,"status_chance":35,"shot_type":"Hit-Scan","damage":{"Impact":96,"Slash":48,"Puncture":16}}],"name":"Vaykor Marelok","imageName":"vaykor-marelok.webp","tags":["Syndicate","Steel Meridian"],"compTags":["MARELOK"]},
  "Velox":{"masteryReq":8,"description":"With a high fire rate, ammo efficiency and rapid reload when emptied, this unusual sidearm can hand out carnage all day long. Ammo efficiency is further increased when Protea uses this, her signature weapon.","noise":"Alarming","releaseDate":"2020-06-11","ammoCapacity":434,"productCategory":"Pistols","zoomProps":[[]],"category":"Secondary","trigger":"Auto","type":"Pistol","magazineSize":62,"reloadTime":2.6,"multishot":1,"attacks":[{"name":"Normal Attack","speed":15,"crit_chance":14,"crit_mult":1.8,"status_chance":22,"shot_type":"Hit-Scan","unique":{"ammoEff":0.2},"damage":{"Impact":4.32,"Slash":11.52,"Puncture":8.16}}],"name":"Velox","imageName":"velox.webp","tags":["Tenno"],"compTags":[]},
  "Vaykor Sydon":{"masteryReq":11,"description":"Justice blinds. Block hits to charge a Radial Blind, when fully charged Block+Heavy Attack to unleash it.","blockingAngle":55,"comboDuration":5,"followThrough":0.6,"range":2.9,"windUp":0.9,"releaseDate":"2016-09-15","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"426","slam":{"damage":"639.00","radial":{"damage":"213.00","element":"Blast","radius":7}},"speed":1.08,"crit_chance":21,"crit_mult":2.5,"status_chance":33,"damage":{"Impact":10.65,"Puncture":202.35}},{"name":"Slam","radius":7,"type":"s","isHeavy":false,"speed":1,"crit_chance":21,"crit_mult":2.5,"status_chance":33,"unique":{"force_procs":["impact"]},"damage":{"Blast":426}},{"name":"Heavy Slam","radius":8,"type":"hs","isHeavy":true,"speed":1,"crit_chance":21,"crit_mult":2.5,"status_chance":33,"damage":{"Blast":639}}],"name":"Vaykor Sydon","imageName":"vaykor-sydon.webp","tags":["Syndicate","Steel Meridian"],"compTags":["POLEARMS_STANCE"]},
  "Vaykor Hek":{"masteryReq":12,"description":"Forged in the fires of rebel struggle, this shotgun is a force for liberation.","noise":"Alarming","releaseDate":"2015-09-02","ammoCapacity":120,"productCategory":"LongGuns","zoomProps":[[]],"category":"Primary","trigger":"Semi","type":"Rifle","magazineSize":8,"reloadTime":2.25,"multishot":7,"attacks":[{"name":"Normal Attack","speed":3,"crit_chance":25,"crit_mult":2,"status_chance":10.7,"shot_type":"Hit-Scan","damage":{"Impact":11.25,"Slash":15,"Puncture":48.75},"falloff":{"start":10,"end":25,"reduction":0.7333}}],"name":"Vaykor Hek","imageName":"vaykor-hek.webp","tags":["Syndicate","Steel Meridian"],"compTags":[]},
  "Vectis Prime":{"masteryReq":14,"description":"Once thought destroyed, the newly uncovered Vectis Prime revives Tenno martial traditions.","noise":"Alarming","releaseDate":"2015-07-07","ammoCapacity":72,"productCategory":"LongGuns","equipTime":1.1,"zoomProps":[{"Upgrades":[{"DamageType":"DT_ANY","OperationType":"STACKING_MULTIPLY","UpgradeType":"mult_for_head","Value":0.4}]},{"Upgrades":[{"DamageType":"DT_ANY","OperationType":"STACKING_MULTIPLY","UpgradeType":"mult_for_head","Value":0.6}]}],"category":"Primary","trigger":"Semi","type":"Rifle","magazineSize":2,"reloadTime":0.85000002,"multishot":1,"attacks":[{"name":"Unzoomed","punch_through":1,"speed":2.67,"crit_chance":30,"crit_mult":2,"status_chance":30,"shot_type":"Hit-Scan","damage":{"Impact":140,"Slash":52.5,"Puncture":157.5},"falloff":{"start":400,"end":600,"reduction":0.5}},{"name":"6x Zoom","punch_through":1,"sniperCombo":true,"speed":2.67,"crit_chance":30,"crit_mult":2,"status_chance":30,"shot_type":"Hit-Scan","damage":{"Impact":140,"Slash":52.5,"Puncture":157.5},"falloff":{"start":400,"end":600,"reduction":0.5}},{"name":"Incarnon Form","isInc":1,"speed":1.33,"crit_chance":35,"crit_mult":3,"status_chance":30,"shot_type":"Projectile","shot_speed":300,"unique":{"force_procs":["cold"]},"damage":{"Cold":150}},{"name":"Incarnon Form Headshot AoE","isInc":1,"speed":1.33,"crit_chance":35,"crit_mult":3,"status_chance":30,"shot_type":"AoE","unique":{"force_procs":["cold"]},"damage":{"Cold":150},"no_headshot_mult":true},{"name":"Incarnon Form Embed AoE","isInc":1,"speed":1.33,"crit_chance":35,"crit_mult":3,"status_chance":30,"shot_type":"AoE","unique":{"force_procs":["cold"]},"damage":{"Cold":25},"no_headshot_mult":true}],"incMagazineSize":45,"name":"Vectis Prime","imageName":"vectis-prime.webp","tags":["Prime","Incarnon"],"compTags":["SNIPER_AMMO","SINGLESHOT"],"comb":[[2,3,4]]},
  "Vectis":{"masteryReq":2,"description":"A classic Tenno sniper rifle, the Vectis is ideal for ranged takedowns.","noise":"Alarming","releaseDate":"2013-10-30","ammoCapacity":72,"productCategory":"LongGuns","equipTime":1.1,"zoomProps":[{"Upgrades":[{"DamageType":"DT_ANY","OperationType":"STACKING_MULTIPLY","UpgradeType":"mult_for_head","Value":0.3}]},{"Upgrades":[{"DamageType":"DT_ANY","OperationType":"STACKING_MULTIPLY","UpgradeType":"mult_for_head","Value":0.5}]}],"category":"Primary","trigger":"Semi","type":"Rifle","magazineSize":1,"reloadTime":1,"multishot":1,"attacks":[{"name":"Unzoomed","punch_through":1,"speed":1.5,"crit_chance":25,"crit_mult":2,"status_chance":30,"shot_type":"Hit-Scan","damage":{"Impact":90,"Slash":56.25,"Puncture":78.75},"falloff":{"start":400,"end":600,"reduction":0.5}},{"name":"4.5x Zoom","punch_through":1,"sniperCombo":true,"speed":1.5,"crit_chance":25,"crit_mult":2,"status_chance":30,"shot_type":"Hit-Scan","damage":{"Impact":90,"Slash":56.25,"Puncture":78.75},"falloff":{"start":400,"end":600,"reduction":0.5}},{"name":"Incarnon Form","isInc":1,"speed":1.33,"crit_chance":35,"crit_mult":2.5,"status_chance":30,"shot_type":"Projectile","shot_speed":300,"unique":{"force_procs":["cold"]},"damage":{"Cold":5}},{"name":"Incarnon Form Headshot AoE","isInc":1,"speed":1.33,"crit_chance":35,"crit_mult":2.5,"status_chance":30,"shot_type":"AoE","unique":{"force_procs":["cold"]},"damage":{"Cold":5},"no_headshot_mult":true},{"name":"Incarnon Form Embed AoE","isInc":1,"speed":1.33,"crit_chance":35,"crit_mult":2.5,"status_chance":30,"shot_type":"AoE","unique":{"force_procs":["cold"]},"damage":{"Cold":5},"no_headshot_mult":true}],"name":"Vectis","imageName":"vectis.webp","tags":["Tenno","Incarnon"],"compTags":["SNIPER_AMMO","Vectis","SINGLESHOT"],"comb":[[2,3,4]]},
  "Velocitus (Atmo-mode)":{"masteryReq":0,"description":"When fully charged, the magnetized barrel of the Velocitus accelerates a metal slug to tremendous speeds, piercing hulls and obliterating armor.","releaseDate":"2014-11-13","ammoCapacity":60,"productCategory":"Archguns","zoomProps":[[]],"category":"Archgun","type":"Archgun","magazineSize":10,"reloadTime":2,"multishot":1,"attacks":[{"name":"Quick Shot","speed":5,"crit_chance":30,"crit_mult":2,"status_chance":25,"shot_type":"Projectile","shot_speed":125,"damage":{"Impact":300,"Puncture":300,"Slash":300,"Magnetic":300}},{"name":"Charged Shot","punch_through":5,"speed":5,"crit_chance":60,"crit_mult":3.6,"status_chance":25,"shot_type":"Projectile","shot_speed":125,"unique":{"force_procs":["impact"]},"damage":{"Impact":800,"Puncture":800,"Slash":800,"Magnetic":800},"charge_time":1}],"name":"Velocitus (Atmo-mode)","imageName":"Velocitus.webp","tags":[""],"compTags":[""]},
  "Veldt":{"masteryReq":8,"description":"Precise calibration, rapid trigger-pull and a steady hand all combine to bring down the hardiest prey on two legs or four.","noise":"Alarming","releaseDate":"2018-04-20","ammoCapacity":546,"productCategory":"LongGuns","equipTime":1.1,"zoomProps":[[],[]],"category":"Primary","trigger":"Semi","type":"Rifle","magazineSize":26,"reloadTime":1.8,"multishot":1,"attacks":[{"name":"Normal Attack","speed":3.67,"crit_chance":22,"crit_mult":2.2,"status_chance":22,"shot_type":"Hit-Scan","damage":{"Impact":23.4,"Slash":43.2,"Puncture":23.4}}],"name":"Veldt","imageName":"veldt.webp","tags":[],"compTags":["PROJECTILE","ASSAULT_AMMO"]},
  "Venka":{"masteryReq":4,"description":"Utilizing a new fighting stance, this Tenno weapon turns fists into claws and enemies into messy piles of meat and scrap metal.","blockingAngle":55,"comboDuration":5,"followThrough":0.8,"range":1.75,"windUp":0.6,"releaseDate":"2014-06-25","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"420","slam":{"damage":"420.00","radial":{"damage":"140.00","radius":6}},"speed":1,"crit_chance":15,"crit_mult":2,"status_chance":15,"damage":{"Impact":7,"Slash":98,"Puncture":35}},{"name":"Slam","radius":6,"type":"s","isHeavy":false,"speed":1,"crit_chance":15,"crit_mult":2,"status_chance":15,"unique":{"force_procs":["impact"]},"damage":{"Impact":280}},{"name":"Heavy Slam","radius":7,"type":"hs","isHeavy":true,"speed":1,"crit_chance":15,"crit_mult":2,"status_chance":15,"damage":{"Blast":420}}],"name":"Venka","imageName":"venka.webp","tags":["Tenno"],"compTags":["CLAWS_STANCE"]},
  "Velocitus (Arch-mode)":{"masteryReq":0,"description":"When fully charged, the magnetized barrel of the Velocitus accelerates a metal slug to tremendous speeds, piercing hulls and obliterating armor.","releaseDate":"2014-11-13","ammoCapacity":0,"productCategory":"Archguns","zoomProps":[[]],"category":"Archgun","type":"Archgun","magazineSize":10,"reloadTime":1.4,"multishot":1,"attacks":[{"name":"Normal Attack","speed":5,"crit_chance":30,"crit_mult":2,"status_chance":25,"shot_type":"Projectile","shot_speed":500,"damage":{"Impact":150,"Puncture":150,"Slash":150,"Magnetic":150}},{"name":"Charged Shot","punch_through":5,"speed":5,"crit_chance":60,"crit_mult":3.6,"status_chance":25,"shot_type":"Projectile","shot_speed":500,"damage":{"Impact":400,"Puncture":400,"Slash":400,"Magnetic":400},"charge_time":1}],"reloadRate":25,"reloadDelay":1,"name":"Velocitus (Arch-mode)","imageName":"Velocitus.webp","tags":[""],"compTags":["BATTERY"]},
  "Velox Prime":{"masteryReq":0,"description":"This sidearm’s circular design evokes Protea Prime’s perception of time.","noise":"Alarming","releaseDate":"2024-05-01","ammoCapacity":434,"productCategory":"Pistols","zoomProps":[[]],"category":"Secondary","trigger":"Auto","type":"Pistol","magazineSize":70,"reloadTime":2.6,"multishot":1,"attacks":[{"name":"Normal Attack","speed":17,"crit_chance":14,"crit_mult":2,"status_chance":32,"shot_type":"Hit-Scan","unique":{"ammoEff":0.2},"damage":{"Impact":6.48,"Slash":12.96,"Puncture":7.56}}],"name":"Velox Prime","imageName":"VeloxPrime.webp","tags":["Tenno"],"compTags":[]},
  "Venato Prime":{"masteryReq":14,"description":"Fashioned from the willingly-donated bone of the Sentient Ur-Hatho and embellished by Orokin luxurator Sembik Vol, Venato Prime was to be wielded against “common enemies” of the united peoples – had any ever emerged from the darkness beyond Tau.","blockingAngle":60,"comboDuration":5,"followThrough":0.6,"range":2.8,"windUp":1,"releaseDate":"2025-08-26","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":1.17,"crit_chance":34,"crit_mult":2.3,"status_chance":32,"damage":{"Impact":36.75,"Slash":85.75,"Puncture":122.5}},{"name":"Slam","radius":8,"type":"s","isHeavy":false,"speed":1,"crit_chance":34,"crit_mult":2.3,"status_chance":32,"unique":{"force_procs":["impact"]},"damage":{"Impact":490}},{"name":"Heavy Slam","radius":9,"type":"hs","isHeavy":true,"speed":1,"crit_chance":34,"crit_mult":2.3,"status_chance":32,"damage":{"Blast":735}}],"name":"Venato Prime","imageName":"VenatoPrime.webp","tags":["Sentient"],"compTags":["SCYTHES_STANCE","VENATO"]},
  "Venka Prime":{"masteryReq":14,"description":"Gleaming blades of white draw blood of the deepest red.","blockingAngle":55,"comboDuration":5,"followThrough":0.8,"range":1.8,"windUp":0.6,"releaseDate":"2016-11-22","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"564","slam":{"damage":"564.00","radial":{"damage":"188.00","element":"Impact","radius":6}},"speed":1.05,"crit_chance":32,"crit_mult":2.6,"status_chance":24,"damage":{"Impact":9.4,"Slash":141,"Puncture":37.6}},{"name":"Slam","radius":6,"type":"s","isHeavy":false,"speed":1,"crit_chance":32,"crit_mult":2.6,"status_chance":24,"unique":{"force_procs":["impact"]},"damage":{"Impact":376}},{"name":"Heavy Slam","radius":7,"type":"hs","isHeavy":true,"speed":1,"crit_chance":32,"crit_mult":2.6,"status_chance":24,"damage":{"Blast":564}}],"name":"Venka Prime","imageName":"venka-prime.webp","tags":["Prime","Never Vaulted"],"compTags":["CLAWS_STANCE"]},
  "Verdilac":{"masteryReq":13,"description":"Archon Nira’s spine-shattering whip. Has a unique Tactical Combo that whips out a wide wave of energy with each stroke.","blockingAngle":45,"comboDuration":5,"followThrough":0.5,"range":2.9963856,"windUp":0.4,"releaseDate":"2021-12-15","productCategory":"Melee","zoomProps":[[]],"category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":1,"crit_chance":30,"crit_mult":2.5,"status_chance":21,"damage":{"Impact":21.3,"Slash":106.5,"Puncture":85.2}},{"name":"Energy Wave","speed":1,"crit_chance":30,"crit_mult":2.5,"status_chance":21,"damage":{"Toxin":213}},{"name":"Slam","radius":7,"type":"s","isHeavy":false,"speed":1,"crit_chance":30,"crit_mult":2.5,"status_chance":21,"unique":{"force_procs":["impact"]},"damage":{"Electricity":426}},{"name":"Heavy Slam","radius":9,"type":"hs","isHeavy":true,"speed":1,"crit_chance":30,"crit_mult":2.5,"status_chance":21,"damage":{"Electricity":639}}],"name":"Verdilac","imageName":"verdilac.webp","tags":["Sentient"],"compTags":["WHIPS_STANCE"]},
  "Venato":{"masteryReq":9,"description":"Caliban’s signature scythe, forged from a limb wrenched off a fallen Eidolon centuries ago. 50% increased Melee Combo Counter Chance when wielded by Caliban.","blockingAngle":90,"comboDuration":5,"followThrough":0.6,"range":2.7,"windUp":1,"releaseDate":"2021-12-15","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"440","slam":{"damage":"660.00","radial":{"damage":"220.00","radius":8}},"speed":1.08,"crit_chance":27,"crit_mult":2.1,"status_chance":24,"damage":{"Impact":33,"Slash":77,"Puncture":110}},{"name":"Slam","radius":8,"type":"s","isHeavy":false,"speed":1,"crit_chance":27,"crit_mult":2.1,"status_chance":24,"unique":{"force_procs":["impact"]},"damage":{"Impact":440}},{"name":"Heavy Slam","radius":9,"type":"hs","isHeavy":true,"speed":1,"crit_chance":27,"crit_mult":2.1,"status_chance":24,"damage":{"Blast":660}}],"name":"Venato","imageName":"venato.webp","tags":["Tenno","Sentient"],"compTags":["SCYTHES_STANCE","VENATO"]},
  "Vericres":{"masteryReq":8,"description":"Unfurl this warfan like a rapidly waxing moon.","blockingAngle":55,"comboDuration":5,"followThrough":0.7,"range":1.8,"windUp":0.5,"releaseDate":"2022-07-14","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"180","slam":{"damage":"360.00","radial":{"damage":"180.00","radius":6}},"speed":1,"crit_chance":22,"crit_mult":2,"status_chance":20,"damage":{"Impact":21.6,"Slash":129.6,"Puncture":28.8}},{"name":"Slam","radius":6,"type":"s","isHeavy":false,"speed":1,"crit_chance":22,"crit_mult":2,"status_chance":20,"unique":{"force_procs":["impact"]},"damage":{"Impact":360}},{"name":"Heavy Slam","radius":8,"type":"hs","isHeavy":true,"speed":1,"crit_chance":22,"crit_mult":2,"status_chance":20,"damage":{"Blast":540}}],"name":"Vericres","imageName":"vericres.webp","tags":["Tenno"],"compTags":["WARFAN_STANCE"]},
  "Vermisplicer (Primary)":{"masteryReq":0,"description":"Long-range proboscis attaches to a target and then splits off to attack up to three more enemies.","ammoCapacity":90,"productCategory":"","category":"Primary","type":"Kitgun","magazineSize":0,"reloadTime":2,"multishot":1,"attacks":[{"name":"Normal Attack","isBeam":true,"speed":12,"crit_chance":0,"crit_mult":0,"status_chance":0,"shot_type":"Discharge","damage":{"Impact":2,"Puncture":4,"Slash":5,"Toxin":5}}],"name":"Vermisplicer (Primary)","imageName":"vermisplicer.webp","tags":["primary-rifle-beam"],"compTags":["BEAM"]},
  "Vermisplicer (Secondary)":{"masteryReq":0,"description":"Three short-range proboscises fiercely latch onto targets and maul them.","ammoCapacity":90,"productCategory":"","category":"Secondary","type":"Kitgun","magazineSize":0,"reloadTime":2,"multishot":5,"attacks":[{"name":"Normal Attack","isBeam":true,"speed":12,"crit_chance":0,"crit_mult":0,"status_chance":0,"shot_type":"Discharge","damage":{"Impact":2,"Puncture":4,"Slash":5,"Toxin":5}}],"name":"Vermisplicer (Secondary)","imageName":"vermisplicer.webp","tags":["secondary-beam"],"compTags":["BEAM"]},
  "Viper Wraith":{"masteryReq":4,"description":"The uniquely styled Viper Wraith is a powerful variation on the standard machine-pistol.","noise":"Alarming","releaseDate":"2018-01-11","ammoCapacity":420,"productCategory":"Pistols","category":"Secondary","trigger":"Auto","type":"Pistol","magazineSize":20,"reloadTime":0.8,"multishot":1,"attacks":[{"name":"Normal Attack","speed":14.38,"crit_chance":19,"crit_mult":2,"status_chance":9,"shot_type":"Hit-Scan","damage":{"Impact":14.4,"Slash":1.8,"Puncture":1.8}}],"name":"Viper Wraith","imageName":"viper-wraith.webp","tags":["Grineer","Wraith","Baro"],"compTags":["VIPER"]},
  "Viper":{"masteryReq":4,"description":"A full-auto pistol known as the most compact and lightweight weapon of the Grineer arsenal. Though it has a small Magazine Capacity, the Viper has a very high Fire Rate and ultra-fast reload times thanks to a simplified magazine design.","noise":"Alarming","releaseDate":"2013-03-18","ammoCapacity":420,"productCategory":"Pistols","category":"Secondary","trigger":"Auto","type":"Pistol","magazineSize":14,"reloadTime":0.7,"multishot":1,"attacks":[{"name":"Normal Attack","speed":14.38,"crit_chance":15,"crit_mult":1.5,"status_chance":11,"shot_type":"Hit-Scan","damage":{"Impact":10.2,"Slash":5.1,"Puncture":1.7}}],"name":"Viper","imageName":"viper.webp","tags":["Grineer"],"compTags":["VIPER"]},
  "War":{"masteryReq":10,"description":"The Stalker's sword as bestowed on him by the Sentient Hunhow.","blockingAngle":55,"comboDuration":5,"followThrough":0.6,"range":3.2,"windUp":1.1,"releaseDate":"2015-12-03","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","slide":"500","slam":{"damage":"750.00","radial":{"damage":"250.00","element":"Impact","radius":8}},"speed":0.917,"crit_chance":26,"crit_mult":2.6,"status_chance":26,"damage":{"Impact":120,"Slash":70,"Puncture":60}},{"name":"Slam","radius":8,"type":"s","isHeavy":false,"speed":1,"crit_chance":26,"crit_mult":2.6,"status_chance":26,"unique":{"force_procs":["impact"]},"damage":{"Impact":500}},{"name":"Heavy Slam","radius":9,"type":"hs","isHeavy":true,"speed":1,"crit_chance":26,"crit_mult":2.6,"status_chance":26,"damage":{"Blast":750}}],"name":"War","imageName":"war.webp","tags":["Sentient"],"compTags":["HEAVY_BLADE_STANCE"]},
  "Volnus":{"masteryReq":9,"description":"Tear and maim with this agile, lightweight glass hammer. When Gara's wields her signature melee weapon, it gains additional Slam Radial Damage.","blockingAngle":50,"comboDuration":5,"followThrough":0.6,"range":2.9,"windUp":1.1,"releaseDate":"2017-10-12","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"440","slam":{"damage":"660.00","radial":{"damage":"220.00","radius":9}},"speed":1.2,"crit_chance":18,"crit_mult":1.6,"status_chance":30,"damage":{"Impact":48.4,"Slash":101.2,"Puncture":70.4}},{"name":"Slam","radius":9,"type":"s","isHeavy":false,"speed":1,"crit_chance":18,"crit_mult":1.6,"status_chance":30,"damage":{"Slash":440}},{"name":"Heavy Slam","radius":10,"type":"hs","isHeavy":true,"speed":1,"crit_chance":18,"crit_mult":1.6,"status_chance":30,"damage":{"Slash":660}}],"name":"Volnus","imageName":"volnus.webp","tags":["Tenno"],"compTags":["HAMMERS_STANCE"]},
  "Volnus Prime":{"masteryReq":14,"description":"The glorious original Orokin casting of Gara’s signature glass hammer. Deceptively light and swift, while remaining lethally effective.","blockingAngle":50,"comboDuration":5,"followThrough":0.6,"range":2.9,"windUp":1.1,"releaseDate":"2021-05-26","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"500","slam":{"damage":"750.00","radial":{"damage":"250.00","radius":10}},"speed":1.2,"crit_chance":20,"crit_mult":1.8,"status_chance":34,"damage":{"Impact":55,"Slash":115,"Puncture":80}},{"name":"Slam","radius":10,"type":"s","isHeavy":false,"speed":1,"crit_chance":20,"crit_mult":1.8,"status_chance":34,"damage":{"Slash":500}},{"name":"Heavy Slam","radius":10,"type":"hs","isHeavy":true,"speed":1,"crit_chance":20,"crit_mult":1.8,"status_chance":34,"damage":{"Slash":750}}],"name":"Volnus Prime","imageName":"volnus-prime.webp","tags":["Prime"],"compTags":["HAMMERS_STANCE"]},
  "Vinquibus (Rifle)":{"masteryReq":14,"description":"Bring hell to the battlefield with Uriel's signature rifle and bayonet combination. Occupying both primary and melee slots, this unique weapon blends precision marksmanship and unrelenting melee combat.","noise":"Alarming","releaseDate":"2025-12-10","ammoCapacity":80,"productCategory":"LongGuns","zoomProps":[[]],"category":"Primary","trigger":"Semi","type":"Rifle","magazineSize":8,"reloadTime":3,"multishot":1,"attacks":[{"name":"Normal Attack","speed":1.5,"crit_chance":40,"crit_mult":3.2,"status_chance":20,"shot_type":"Hit-Scan","damage":{"Slash":120,"Puncture":280}}],"name":"Vinquibus (Rifle)","imageName":"Vinquibus.webp","tags":[],"compTags":["ASSAULT_AMMO"]},
  "Vinquibus (Melee)":{"masteryReq":14,"description":"Bring hell to the battlefield with Uriel's signature rifle and bayonet combination. Occupying both primary and melee slots, this unique weapon blends precision marksmanship and unrelenting melee combat.","blockingAngle":60,"comboDuration":5,"followThrough":0.6,"range":3,"windUp":1,"releaseDate":"2025-12-10","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":1,"crit_chance":40,"crit_mult":3.2,"status_chance":20,"damage":{"Slash":78,"Puncture":182}},{"name":"Polearm Throw","speed":1,"crit_chance":40,"crit_mult":3.2,"status_chance":20,"unique":{"force_procs":["impact"]},"damage":{"Slash":78,"Puncture":182}},{"name":"Polearm Explosion","speed":1,"crit_chance":40,"crit_mult":3.2,"status_chance":20,"unique":{"force_procs":["impact"]},"damage":{"Blast":400}},{"name":"Slam","radius":7,"type":"s","isHeavy":false,"speed":1,"crit_chance":40,"crit_mult":3.2,"status_chance":10,"unique":{"force_procs":["impact"]},"damage":{"Impact":440}},{"name":"Heavy Slam","radius":8,"type":"hs","isHeavy":true,"speed":1,"crit_chance":34,"crit_mult":2.6,"status_chance":10,"damage":{"Blast":660}}],"name":"Vinquibus (Melee)","imageName":"Vinquibus.webp","tags":[],"compTags":["BAYONET_STANCE"]},
  "Vulkar":{"masteryReq":3,"description":"Built by the Grineer for their elite troopers, the Vulkar is a devastating distance weapon. In the right hands it is capable of taking down targets long before they get into attack range.","noise":"Alarming","releaseDate":"2013-05-23","ammoCapacity":72,"productCategory":"LongGuns","equipTime":1.1,"zoomProps":[{"Upgrades":[{"DamageType":"DT_ANY","OperationType":"STACKING_MULTIPLY","UpgradeType":"mult_for_head","Value":0.35}]},{"Upgrades":[{"DamageType":"DT_ANY","OperationType":"STACKING_MULTIPLY","UpgradeType":"mult_for_head","Value":0.55}]},{"Upgrades":[{"DamageType":"DT_ANY","OperationType":"STACKING_MULTIPLY","UpgradeType":"mult_for_head","Value":0.7}]}],"category":"Primary","trigger":"Semi","type":"Rifle","magazineSize":6,"reloadTime":3,"multishot":1,"attacks":[{"name":"Unzoomed","punch_through":1,"speed":1.5,"crit_chance":20,"crit_mult":2,"status_chance":25,"shot_type":"Hit-Scan","damage":{"Impact":180,"Slash":11.2,"Puncture":33.8},"falloff":{"start":400,"end":600,"reduction":0.5}},{"name":"8x Zoom","punch_through":1,"sniperCombo":true,"speed":1.5,"crit_chance":20,"crit_mult":2,"status_chance":25,"shot_type":"Hit-Scan","damage":{"Impact":180,"Slash":11.2,"Puncture":33.8},"falloff":{"start":400,"end":600,"reduction":0.5}}],"name":"Vulkar","imageName":"vulkar.webp","tags":["Grineer"],"compTags":["SNIPER_AMMO"]},
  "Vulkar Wraith":{"masteryReq":7,"description":"A blood-red variant of this devastating sniper rifle.","noise":"Alarming","releaseDate":"2016-01-25","ammoCapacity":72,"productCategory":"LongGuns","equipTime":1.1,"zoomProps":[{"Upgrades":[{"DamageType":"DT_ANY","OperationType":"STACKING_MULTIPLY","UpgradeType":"mult_for_head","Value":0.35}]},{"Upgrades":[{"DamageType":"DT_ANY","OperationType":"STACKING_MULTIPLY","UpgradeType":"mult_for_head","Value":0.55}]},{"Upgrades":[{"DamageType":"DT_ANY","OperationType":"STACKING_MULTIPLY","UpgradeType":"mult_for_head","Value":0.7}]}],"category":"Primary","trigger":"Semi","type":"Rifle","magazineSize":8,"reloadTime":3,"multishot":1,"attacks":[{"name":"Unzoomed","punch_through":1,"speed":2,"crit_chance":20,"crit_mult":2,"status_chance":25,"shot_type":"Hit-Scan","damage":{"Impact":245.7,"Puncture":27.3},"falloff":{"start":400,"end":600,"reduction":0.5}},{"name":"8x Zoom","punch_through":1,"sniperCombo":true,"speed":2,"crit_chance":20,"crit_mult":2,"status_chance":25,"shot_type":"Hit-Scan","damage":{"Impact":245.7,"Puncture":27.3},"falloff":{"start":400,"end":600,"reduction":0.5}}],"name":"Vulkar Wraith","imageName":"vulkar-wraith.webp","tags":["Wraith","Baro","Grineer"],"compTags":["SNIPER_AMMO"]},
  "Vitrica":{"masteryReq":13,"description":"The sword the fabled Orokin executioner Nihil used to glass the condemned. Swing while Aim Gliding to glass enemies. A Ground Slam will smash nearby glassed foes, while sending forward a narrow shockwave to shatter distant ones. A Heavy Slam sends forth a wider shockwave with greater force.","blockingAngle":60,"comboDuration":10,"followThrough":0.6,"range":2.9,"windUp":1.1,"releaseDate":"2020-10-27","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":0.833,"crit_chance":23,"crit_mult":2.3,"status_chance":33,"damage":{"Impact":99.9,"Slash":133.2,"Puncture":99.9}},{"name":"Glass Explosion","speed":0.833,"crit_chance":23,"crit_mult":2.3,"status_chance":33,"shot_type":"AoE","damage":{"Impact":299.7,"Slash":399.6,"Puncture":299.7},"falloff":{"start":0,"end":6,"reduction":0.9},"no_headshot_mult":true},{"name":"Slam","radius":4,"type":"s","isHeavy":false,"speed":1,"crit_chance":23,"crit_mult":2.3,"status_chance":33,"unique":{"force_procs":["impact"]},"damage":{"Impact":666}},{"name":"Heavy Slam","radius":4,"type":"hs","isHeavy":true,"speed":1,"crit_chance":23,"crit_mult":2.3,"status_chance":33,"damage":{"Impact":999}}],"name":"Vitrica","imageName":"vitrica.webp","tags":["Orokin"],"compTags":["HEAVY_BLADE_STANCE"]},
  "War Prime":{"masteryReq":15,"description":"The blade of the world-destroyer reaches its apotheosis, severing conflict itself. In forging this weapon, you have brought unrealized dreams to their ultimate conclusion.","blockingAngle":55,"comboDuration":5,"followThrough":0.6,"range":3.2,"windUp":1.1,"releaseDate":"2026-06-17","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":0.917,"crit_chance":26,"crit_mult":3.2,"status_chance":32,"damage":{"Impact":194.4,"Slash":43.2,"Puncture":32.4}},{"name":"Slam","radius":8,"type":"s","isHeavy":false,"speed":1,"crit_chance":26,"crit_mult":3.2,"status_chance":10,"unique":{"force_procs":["impact"]},"damage":{"Impact":500}},{"name":"Heavy Slam","radius":9,"type":"hs","isHeavy":true,"speed":1,"crit_chance":26,"crit_mult":3.2,"status_chance":10,"damage":{"Blast":810}}],"name":"War Prime","imageName":"WarPrime.webp","tags":[],"compTags":["HEAVY_BLADE_STANCE"]},
  "Vesper 77":{"masteryReq":14,"description":"A true masterpiece of Höllvanian engineering. Vesper 77's advanced laser sight highlights enemy Weak Points with precision. Aim to increase its Critical Damage Multiplier.","noise":"Alarming","releaseDate":"2024-12-13","ammoCapacity":210,"productCategory":"Pistols","category":"Secondary","trigger":"Semi","type":"Pistol","magazineSize":8,"reloadTime":2.4,"multishot":1,"attacks":[{"name":"Normal Attack","speed":2.08,"crit_chance":24,"crit_mult":2.6,"status_chance":26,"shot_type":"Hit-Scan","damage":{"Impact":72,"Puncture":108}},{"name":"Alt-Fire (Weak Point)","speed":2.08,"crit_chance":24,"crit_mult":2.6,"status_chance":26,"shot_type":"Hit-Scan","unique":{"crit_mult":0.4},"damage":{"Impact":72,"Puncture":108}}],"name":"Vesper 77","imageName":"Vesper77.webp","tags":["Grineer"],"compTags":["PROJECTILE","VESPER77"]},
  "Zakti Prime":{"masteryReq":14,"description":"A thousand pains, before their end.","noise":"Alarming","releaseDate":"2020-10-26","productCategory":"Pistols","zoomProps":[[]],"category":"Secondary","trigger":"Semi","type":"Pistol","magazineSize":8,"reloadTime":1,"multishot":1,"attacks":[{"name":"Normal Attack","isCoMult":true,"speed":5,"crit_chance":8,"crit_mult":1.8,"status_chance":42,"shot_type":"Projectile","shot_speed":140,"flight":140,"unique":{"force_procs":["impact"]},"damage":{"Impact":12,"Puncture":18}},{"name":"Gas Cloud","speed":5,"crit_chance":8,"crit_mult":1.8,"status_chance":42,"shot_type":"AoE","damage":{"Gas":100},"falloff":{"start":0,"end":3.8,"reduction":0},"no_headshot_mult":true}],"name":"Zakti Prime","imageName":"zakti-prime.webp","tags":["Prime"],"compTags":["PROJECTILE","AOE","SINGLESHOT"],"comb":[[0,1]]},
  "Zakti":{"masteryReq":10,"description":"Fires razor-sharp darts that anchor themselves in their target before erupting in a plume of toxic gas.","noise":"Alarming","releaseDate":"2017-07-19","productCategory":"Pistols","category":"Secondary","trigger":"Semi","type":"Pistol","magazineSize":3,"reloadTime":0.8,"multishot":1,"attacks":[{"name":"Dart Impact","isCoMult":true,"speed":5,"crit_chance":2,"crit_mult":1.5,"status_chance":20,"shot_type":"Projectile","shot_speed":80,"flight":80,"unique":{"force_procs":["impact"]},"damage":{"Impact":12,"Puncture":18}},{"name":"Gas Cloud","speed":5,"crit_chance":2,"crit_mult":1.5,"status_chance":20,"shot_type":"AoE","damage":{"Gas":80},"falloff":{"start":0,"end":3.5,"reduction":0},"no_headshot_mult":true}],"name":"Zakti","imageName":"zakti.webp","tags":["Tenno"],"compTags":["PROJECTILE","AOE","SINGLESHOT"],"comb":[[0,1]]},
  "Wolf Sledge":{"masteryReq":7,"description":"The signature weapon of the only lunatic fearsome enough to bust out of the Saturn Six Max-Pen. Once loosed this formidable throwing hammer always finds its way home.","blockingAngle":50,"comboDuration":5,"followThrough":0.4,"range":3.1,"windUp":1.2,"releaseDate":"2019-02-27","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"518","slam":{"damage":"777.00","radial":{"damage":"259.00","radius":9}},"isHeavy":false,"speed":1,"crit_chance":17,"crit_mult":1.9,"status_chance":33,"damage":{"Impact":132.1,"Slash":119.1,"Puncture":7.8}},{"name":"Throw","isHeavy":false,"speed":1,"crit_chance":17,"crit_mult":1.9,"status_chance":33,"shot_type":"Thrown","damage":{"Impact":396.3,"Slash":357.3,"Puncture":23.4},"charge_time":0.8},{"name":"Heavy Recall Explosion","isHeavy":true,"speed":1,"crit_chance":19,"crit_mult":2.1,"status_chance":50,"shot_type":"AoE","damage":{"Blast":777},"falloff":{"start":0,"end":5,"reduction":0},"no_headshot_mult":true,"charge_time":0.8},{"name":"Slam","radius":9,"type":"s","isHeavy":false,"speed":1,"crit_chance":17,"crit_mult":1.9,"status_chance":33,"damage":{"Impact":518}},{"name":"Heavy Slam","radius":10,"type":"hs","isHeavy":true,"speed":1,"crit_chance":17,"crit_mult":1.9,"status_chance":33,"damage":{"Blast":777}}],"name":"Wolf Sledge","imageName":"wolf-sledge.webp","tags":[],"compTags":["HAMMERS_STANCE"]},
  "Xoris":{"masteryReq":4,"description":"An obscure glaive weapon of Corpus provenance, intrinsically linked to Specter technology. The Xoris strikes rapidly and with great devastation. It is capable of chaining combos infinitely.","blockingAngle":55,"comboDuration":5,"followThrough":0.7,"range":1.3,"windUp":1.2,"releaseDate":"2020-06-11","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slide":"240","slam":{"damage":"360.00","radial":{"damage":"120.00","element":"Electricity","radius":6}},"isHeavy":false,"speed":1.17,"crit_chance":20,"crit_mult":2.4,"status_chance":18,"damage":{"Impact":24,"Slash":55.2,"Puncture":40.8}},{"name":"Throw","isHeavy":false,"speed":1.17,"crit_chance":20,"crit_mult":2.4,"status_chance":18,"shot_type":"Thrown","shot_speed":25,"flight":25,"unique":{"force_procs":["impact"]},"damage":{"Impact":24,"Slash":55.2,"Puncture":40.8}},{"name":"Throw Bounce Explosion","isHeavy":false,"speed":1.17,"crit_chance":20,"crit_mult":2.4,"status_chance":18,"shot_type":"AoE","damage":{"Electricity":250},"falloff":{"start":0,"end":8,"reduction":0.7},"no_headshot_mult":true},{"name":"Throw Recall Explosion","isHeavy":true,"speed":1.17,"crit_chance":20,"crit_mult":2.4,"status_chance":18,"shot_type":"AoE","unique":{"force_procs":["impact","electricity"]},"damage":{"Electricity":500},"falloff":{"start":0,"end":8,"reduction":0},"no_headshot_mult":true},{"name":"Charged Throw","isHeavy":false,"speed":0.833,"crit_chance":22,"crit_mult":2.4,"status_chance":20,"shot_type":"Thrown","shot_speed":25,"flight":25,"unique":{"force_procs":["impact"]},"damage":{"Impact":48,"Slash":110.4,"Puncture":81.6},"charge_time":1.2},{"name":"Charged Throw Bounce Explosion","isHeavy":false,"speed":0.833,"crit_chance":22,"crit_mult":2.4,"status_chance":20,"shot_type":"AoE","damage":{"Electricity":500},"falloff":{"start":0,"end":9,"reduction":0.7},"no_headshot_mult":true,"charge_time":1.2},{"name":"Charged Throw Recall Explosion","isHeavy":true,"speed":0.833,"crit_chance":22,"crit_mult":2.4,"status_chance":20,"shot_type":"AoE","unique":{"force_procs":["impact","electricity"]},"damage":{"Electricity":1000},"falloff":{"start":0,"end":9,"reduction":0},"no_headshot_mult":true,"charge_time":1.2},{"name":"Slam","radius":6,"type":"s","isHeavy":false,"speed":1,"crit_chance":20,"crit_mult":2.4,"status_chance":18,"unique":{"force_procs":["impact"]},"damage":{"Electricity":240}},{"name":"Heavy Slam","radius":8,"type":"hs","isHeavy":true,"speed":1,"crit_chance":20,"crit_mult":2.4,"status_chance":18,"damage":{"Electricity":360}}],"name":"Xoris","imageName":"xoris.webp","tags":["Corpus"],"compTags":["GLAIVES_STANCE"],"comb":[[1,2],[4,5]]},
  "Zarr":{"masteryReq":7,"description":"Unload a barrage of explosives or a huge shot of flak from this cannon’s enormous barrel.","noise":"Alarming","releaseDate":"2016-11-11","ammoCapacity":60,"productCategory":"LongGuns","category":"Primary","trigger":"Semi","type":"Rifle","magazineSize":3,"reloadTime":2.25,"multishot":1,"attacks":[{"name":"Cannon Mode Projectile","speed":1.67,"crit_chance":17,"crit_mult":2.5,"status_chance":29,"shot_type":"Projectile","shot_speed":40,"flight":40,"damage":{"Impact":25}},{"name":"Cannon Mode Explosion","speed":1.67,"crit_chance":17,"crit_mult":2.5,"status_chance":29,"shot_type":"AoE","damage":{"Blast":175},"falloff":{"start":0,"end":4,"reduction":0.5},"no_headshot_mult":true},{"name":"Cannon Mode Cluster Bombs Contact","multishot":6,"speed":1.67,"crit_chance":15,"crit_mult":2,"status_chance":4.8,"shot_type":"Projectile","shot_speed":8,"flight":8,"damage":{"Impact":15}},{"name":"Cannon Mode Cluster Bomb Explosion","multishot":6,"speed":1.67,"crit_chance":15,"crit_mult":2,"status_chance":4.8,"shot_type":"Projectile","shot_speed":8,"flight":8,"damage":{"Blast":50}},{"name":"Barrage Mode","multishot":10,"punch_through":1.6,"speed":3,"crit_chance":17,"crit_mult":2.5,"status_chance":8.7,"shot_type":"Projectile","shot_speed":120,"flight":120,"damage":{"Impact":24,"Slash":16,"Puncture":40}}],"name":"Zarr","imageName":"zarr.webp","tags":["Grineer"],"compTags":["ASSAULT_AMMO","PROJECTILE","AOE","SINGLESHOT"],"comb":[[0,1,2]]},
  "Zenistar":{"masteryReq":6,"description":"Scorch enemies with blistering blows, or set them ablaze with the flying fire disc.","blockingAngle":55,"comboDuration":5,"followThrough":0.6,"range":2.6,"windUp":1.1,"releaseDate":"2016-07-28","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","slam":{"damage":"894.00","radial":{"damage":"298.00","radius":8}},"isHeavy":false,"speed":0.833,"crit_chance":10,"crit_mult":2,"status_chance":30,"damage":{"Impact":80,"Slash":68,"Heat":150}},{"name":"Attacks While Disc Deployed","isHeavy":true,"speed":0.833,"crit_chance":10,"crit_mult":2,"status_chance":15,"damage":{"Impact":13,"Slash":104,"Puncture":13}},{"name":"Disc Impact","isHeavy":true,"speed":0.909,"crit_chance":10,"crit_mult":2,"status_chance":15,"damage":{"Impact":75},"charge_time":1.1},{"name":"Disc Explosion","isHeavy":true,"speed":0.909,"crit_chance":0,"crit_mult":1,"status_chance":15,"shot_type":"AoE","damage":{"Heat":350},"falloff":{"start":0,"end":4,"reduction":0},"no_headshot_mult":true,"charge_time":1.1},{"name":"Disc Aura","isHeavy":true,"speed":1.2,"crit_chance":0,"crit_mult":1,"status_chance":50,"damage":{"Heat":50},"falloff":{"start":0,"end":4,"reduction":0}},{"name":"Slam","radius":8,"type":"s","isHeavy":false,"speed":1,"crit_chance":10,"crit_mult":2,"status_chance":30,"unique":{"force_procs":["impact"]},"damage":{"Impact":596}},{"name":"Heavy Slam","radius":9,"type":"hs","isHeavy":true,"speed":1,"crit_chance":10,"crit_mult":2,"status_chance":30,"damage":{"Blast":894}}],"name":"Zenistar","imageName":"zenistar.webp","tags":["Tenno"],"compTags":["HEAVY_BLADE_STANCE"],"comb":[[2,3]]},
  "Zhuge":{"masteryReq":10,"description":"This devastating automatic crossbow is the perfect marriage of ancient Earth weaponry and Tenno technology.","noise":"Silent","releaseDate":"2016-03-16","productCategory":"LongGuns","equipTime":1.1,"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":20,"reloadTime":2.5,"multishot":1,"attacks":[{"name":"Normal Attack","speed":4.17,"crit_chance":20,"crit_mult":2,"status_chance":35,"shot_type":"Projectile","shot_speed":90,"flight":90,"damage":{"Impact":5,"Slash":20,"Puncture":75}}],"name":"Zhuge","imageName":"zhuge.webp","tags":[],"compTags":["PROJECTILE","ZHUGE","CROSSBOW"]},
  "Zenith":{"masteryReq":10,"description":"Deploy the radar disc to reveal hidden enemies and then strike with precisions shots that punch through all obstacles in the way.","noise":"Alarming","releaseDate":"2017-04-12","ammoCapacity":540,"productCategory":"LongGuns","category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":90,"reloadTime":1.6,"multishot":1,"attacks":[{"name":"Auto Mode","speed":10.83,"crit_chance":10,"crit_mult":2,"status_chance":34,"shot_type":"Hit-Scan","damage":{"Impact":4.5,"Slash":19.5,"Puncture":6}},{"name":"Semi-Auto Mode","ammoCost":3,"punch_through":"Infinity","speed":3,"crit_chance":35,"crit_mult":2.5,"status_chance":8,"shot_type":"Hit-Scan","damage":{"Impact":15,"Slash":15,"Puncture":120}}],"name":"Zenith","imageName":"zenith.webp","tags":["Tenno"],"compTags":["ASSAULT_AMMO"]},
  "Zhuge Prime":{"masteryReq":14,"description":"Tenno artistry. Ancient craft. A weapon of surgical precision and devastating effect. Each bolt fired by Zhuge Prime explodes shortly after embedding.","noise":"Silent","releaseDate":"2019-07-07","ammoCapacity":270,"productCategory":"LongGuns","equipTime":1.1,"zoomProps":[[]],"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":30,"reloadTime":3,"multishot":1,"attacks":[{"name":"Arrow Impact","speed":5.5,"crit_chance":26,"crit_mult":2,"status_chance":30,"shot_type":"Projectile","shot_speed":80,"flight":80,"damage":{"Impact":10,"Slash":17.5,"Puncture":22.5}},{"name":"Arrow Explosion","speed":5.5,"crit_chance":26,"crit_mult":2,"status_chance":30,"shot_type":"AoE","damage":{"Impact":11.2,"Slash":24.8,"Puncture":4},"falloff":{"start":0,"end":2.6,"reduction":0.3},"no_headshot_mult":true}],"name":"Zhuge Prime","imageName":"zhuge-prime.webp","tags":["Prime"],"compTags":["PROJECTILE","ZHUGE","CROSSBOW"],"comb":[[0,1]]},
  "Zylok":{"masteryReq":6,"description":"Hammer the enemy with this light-bodied heavy hitter. Featuring a double-action trigger that fires hard and fast. ","noise":"Alarming","releaseDate":"2018-08-30","productCategory":"Pistols","category":"Secondary","trigger":"Duplex","type":"Pistol","magazineSize":8,"reloadTime":1.2,"multishot":1,"attacks":[{"name":"Normal Attack","speed":1.8,"crit_chance":8,"crit_mult":2,"status_chance":26,"shot_type":"Hit-Scan","damage":{"Impact":44.8,"Slash":78.4,"Puncture":16.8}},{"name":"Incarnon Form","isInc":1,"speed":1,"crit_chance":20,"crit_mult":2,"status_chance":40,"damage":{"Impact":160,"Puncture":240},"charge_time":0.6},{"name":"Incarnon Form Radial Attack","isInc":1,"speed":1,"crit_chance":20,"crit_mult":2,"status_chance":40,"shot_type":"AoE","damage":{"Heat":600},"charge_time":0.6}],"incMagazineSize":12,"name":"Zylok","imageName":"zylok.webp","tags":["Tenno","Incarnon"],"compTags":["ZYLOK"],"comb":[[1,2]]},
  "Zymos":{"masteryReq":11,"description":"Infect your foes with this spore-scattering pistol. Headshots burrow in and explode, releasing spore clouds that seek out nearby enemies.","noise":"Alarming","releaseDate":"2020-08-25","ammoCapacity":51,"productCategory":"Pistols","zoomProps":[[]],"category":"Secondary","trigger":"Semi","type":"Pistol","magazineSize":17,"reloadTime":3.2,"multishot":1,"attacks":[{"name":"Normal Attack","speed":1.33,"crit_chance":5,"crit_mult":2.3,"status_chance":30,"shot_type":"Projectile","shot_speed":79,"flight":79,"unique":{"force_procs":["impact"]},"damage":{"Impact":9.2,"Puncture":13.8}},{"name":"Radial Attack","speed":1.33,"crit_chance":5,"crit_mult":2.3,"status_chance":30,"shot_type":"AoE","damage":{"Toxin":61},"falloff":{"start":0,"end":3.3,"reduction":0.3},"no_headshot_mult":true},{"name":"Headshot Explosion","speed":1.33,"crit_chance":5,"crit_mult":2.3,"status_chance":50,"shot_type":"AoE","damage":{"Toxin":953},"falloff":{"start":0,"end":3.3,"reduction":0.3},"no_headshot_mult":true},{"name":"Homing Spore Contact","isCoMult":true,"speed":1.33,"crit_chance":5,"crit_mult":2.3,"status_chance":30,"shot_type":"Projectile","unique":{"force_procs":["impact"]},"damage":{"Slash":11.5,"Puncture":11.5}},{"name":"Homing Spore Explosion","speed":1.33,"crit_chance":5,"crit_mult":2.3,"status_chance":30,"shot_type":"AoE","damage":{"Toxin":333},"falloff":{"start":0,"end":3.3,"reduction":0.3},"no_headshot_mult":true}],"name":"Zymos","imageName":"zymos.webp","tags":["Infested"],"compTags":[],"comb":[[0,1],[2,3,4]]},
  "Zylok Prime":{"masteryReq":6,"description":"A lightweight weapon that packs a punch worthy of its golden design.","noise":"Alarming","releaseDate":"2023-10-18","ammoCapacity":210,"productCategory":"Pistols","category":"Secondary","trigger":"Duplex","type":"Pistol","magazineSize":12,"reloadTime":1.2,"multishot":1,"attacks":[{"name":"Normal Attack","speed":1.5,"crit_chance":12,"crit_mult":2.4,"status_chance":36,"damage":{"Impact":63,"Slash":126,"Puncture":21}},{"name":"Incarnon Form","isInc":1,"speed":1,"crit_chance":26,"crit_mult":2.4,"status_chance":40,"damage":{"Impact":200,"Puncture":300},"charge_time":0.6},{"name":"Incarnon Form Radial Attack","isInc":1,"speed":1,"crit_chance":26,"crit_mult":2.4,"status_chance":40,"shot_type":"AoE","damage":{"Heat":700},"no_headshot_mult":true,"charge_time":0.6}],"incMagazineSize":12,"name":"Zylok Prime","imageName":"ZylokPrime.webp","tags":["Tenno","Incarnon"],"compTags":["ZYLOK"],"comb":[[1,2]]}},

  // === MOD 数据 (587个) ===
  mods: [{"name":"Serration","img":"Serration.webp","tags":["primary-rifle","primary-bow","primary-sniper"],
    "uncomp":["Amalgam Serration","Higasa Serration","Spectral Serration"],
    "action":{"base":1.65}},{"name":"Amalgam Serration","img":"AmalgamSerration.webp","tags":["primary-rifle","primary-bow","primary-sniper"],
    "uncomp":["Serration","Higasa Serration","Spectral Serration"],
    "action":{"base":1.55}},{"name":"Spectral Serration","img":"SpectralSerration.webp","tags":["primary-rifle","primary-bow","primary-sniper"],
    "uncomp":["Amalgam Serration","Higasa Serration","Serration"],
    "action":{"base":3.3}},{"name":"Higasa Serration","img":"HigasaSerration.webp","tags":["HIGASA"],
    "uncomp":["Serration","Amalgam Serration","Spectral Serration"],
    "action":{"base":4.5}},{"name":"Semi-Rifle Cannonade","img":"Semi-RifleCannonade.webp","tags":["primary-rifle","primary-sniper"],
    "trigger":"Semi","action":{"base":2.4,"punch_through":1.5,"set_speed_to_default":1}},{"name":"Hornet Strike","img":"HornetStrike.webp","tags":["secondary"],
    "action":{"base":2.2}},{"name":"Augur Pact","img":"AugurPact.webp","tags":["secondary"],
    "action":{"base":0.9}},{"name":"Magnum Force","img":"MagnumForce.webp","tags":["secondary"],
    "action":{"base":1.65,"accuracy":5.5}},{"name":"Semi-Pistol Cannonade","img":"Semi-PistolCannonade.webp","tags":["secondary"],
    "trigger":"Semi","action":{"base":3,"punch_through":1.5,"set_speed_to_default":1}},{"name":"Heavy Caliber","img":"HeavyCaliber.webp","tags":["primary-rifle","primary-bow","primary-sniper"],
    "action":{"base":1.65,"accuracy":2.97}},{"name":"Primary Acuity","img":"PrimaryAcuity.webp","tags":["primary-rifle","primary-bow","primary-sniper"],
    "action":{"WITH_COND":{"headshot_mult":5.25,"crit_chance_weakp":3.5,"set_mutishot_to_default":1}}},{"name":"Pistol Acuity","img":"PistolAcuity.webp","tags":["secondary"],
    "action":{"WITH_COND":{"headshot_mult":5.25,"crit_chance_weakp":3.5,"set_mutishot_to_default":1}}},{"name":"Pain Points","img":"PainPoints.webp","tags":["TNJETTURBINEPISTOL"],
    "action":{"WITH_COND":{"crit_chance_weakp":6}}},{"name":"Galvanized Aptitude","img":"GalvanizedAptitude.webp","tags":["primary-rifle","primary-bow","primary-sniper"],
    "uncomp":["Rifle Aptitude"],
    "action":{"status_chance":0.8,"base_per_status":0.8}},{"name":"Galvanized Shot","img":"GalvanizedShot.webp","tags":["secondary"],
    "uncomp":["Sure Shot"],
    "action":{"status_chance":0.8,"base_per_status":1.2}},{"name":"Galvanized Savvy","img":"GalvanizedSavvy.webp","tags":["primary-shotgun"],
    "uncomp":["Shotgun Savvy"],
    "action":{"status_chance":0.8,"base_per_status":0.8}},{"name":"Point Blank","img":"PointBlank.webp","uncomp":["Primed Point Blank"],
    "tags":["primary-shotgun"],
    "action":{"base":0.9}},{"name":"Primed Point Blank","img":"PrimedPointBlank.webp","tags":["primary-shotgun"],
    "uncomp":["Point Blank"],
    "action":{"base":1.65}},{"name":"Semi-Shotgun Cannonade","img":"Semi-ShotgunCannonade.webp","tags":["primary-shotgun"],
    "trigger":"Semi","action":{"base":2.4,"punch_through":1.5,"set_speed_to_default":1}},{"name":"Pressure Point","img":"PressurePoint.webp","tags":["melee"],
    "uncomp":["Sacrificial Pressure","Primed Pressure Point"],
    "action":{"base":1.2}},{"name":"Primed Pressure Point","img":"PrimedPressurePoint.webp","tags":["melee"],
    "uncomp":["Sacrificial Pressure","Pressure Point"],
    "action":{"base":1.65}},{"name":"Sacrificial Pressure","img":"SacrificialPressure.webp","tags":["melee"],
    "uncomp":["Pressure Point","Primed Pressure Point"],
    "set":{"1":1,"2":1.25,"name":"Sacrificial"},"action":{"base":1.1,"SMITE":{"Sentient":0.33}}},{"name":"Condition Overload","img":"ConditionOverload.webp","tags":["melee"],
    "action":{"base_per_status":0.8}},{"name":"Spoiled Strike","img":"SpoiledStrike.webp","tags":["melee"],
    "action":{"base":1,"speed":-0.2}},{"name":"Dreadful Killshot","img":"DreadfulKillshot.webp","tags":["BASMU"],
    "action":{"base":3.6,"status_chance":3.6}},{"name":"Vicious Spread","img":"ViciousSpread.webp","tags":["primary-shotgun"],
    "action":{"base":0.9,"accuracy":0.6}},{"name":"Amar's Contempt","img":"AmarsContempt.webp","tags":["melee-dualdagger"],
    "action":{"base":0.9,"phys":{"Slash":0.3}}},{"name":"Boreal's Contempt","img":"BorealsContempt.webp","tags":["melee-polearm"],
    "action":{"base":0.9,"status_damage":0.6}},{"name":"Burning Hate","img":"BurningHate.webp","tags":["HATE"],
    "action":{"vuln_status_damage":1.2}},{"name":"Hunter's Bonesaw","img":"HuntersBonesaw.webp","tags":["RIPKAS"],
    "action":{"WITH_COND":{"base":0.9,"status_chance":0.6}}},{"name":"Nira's Contempt","img":"NirasContempt.webp","tags":["melee-whip"],
    "action":{"base":0.9,"status_chance":0.6,"slam_mult":1.5}},{"name":"Sentient Surge","img":"SentientSurge.webp","tags":["OCUCOR"],
    "action":{"crit_chance":2.4,"status_chance":2.4}},{"name":"Double Tap","img":"DoubleTap.webp","tags":["LATRON"],
    "uncomp":["Hydraulic Gauge","Loose Hatch","Maximum Capacity"],
    "action":{"WITH_COND":{"multiple":4}}},{"name":"Spring-Loaded Broadhead","img":"Spring-LoadedBroadhead.webp","tags":["DAIKYU"],
    "action":{"WITH_COND":{"multDAIKYUBroadhead":0.4}}},{"name":"Rifle Elementalist","img":"RifleElementalist.webp","tags":["primary-rifle","primary-bow","primary-sniper"],
    "action":{"status_damage":0.9,"punch_through":0.6}},{"name":"Melee Elementalist","img":"MeleeElementalist.webp","tags":["melee"],
    "uncomp":["Galvanized Elementalist"],
    "action":{"status_damage":0.9,"windUp":0.6}},{"name":"Pistol Elementalist","img":"PistolElementalist.webp","tags":["secondary"],
    "action":{"status_damage":0.9,"reloadTime":0.6}},{"name":"Shotgun Elementalist","img":"ShotgunElementalist.webp","tags":["primary-shotgun"],
    "action":{"status_damage":0.9,"magazineSize":0.6}},{"name":"Galvanized Elementalist","img":"GalvanizedElementalist.webp","tags":["melee"],
    "uncomp":["Melee Elementalist"],
    "action":{"status_damage":0.8,"WITH_COND":{"status_chance":1.2}}},{"name":"Stormbringer","img":"Stormbringer.webp","tags":["primary-rifle","primary-bow","primary-sniper"],
    "action":{"element":{"Electricity":0.9}}},{"name":"Cryo Rounds","img":"CryoRounds.webp","uncomp":["Primed Cryo Rounds"],
    "tags":["primary-rifle","primary-bow","primary-sniper"],
    "action":{"element":{"Cold":0.9}}},{"name":"Primed Cryo Rounds","img":"PrimedCryoRounds.webp","uncomp":["Cryo Rounds"],
    "tags":["primary-rifle","primary-bow","primary-sniper"],
    "action":{"element":{"Cold":1.65}}},{"name":"Hellfire","img":"Hellfire.webp","tags":["primary-rifle","primary-bow","primary-sniper"],
    "action":{"element":{"Heat":0.9}}},{"name":"Infected Clip","img":"InfectedClip.webp","tags":["primary-rifle","primary-bow","primary-sniper"],
    "action":{"element":{"Toxin":0.9}}},{"name":"Malignant Force","img":"MalignantForce.webp","tags":["primary-rifle","primary-bow","primary-sniper"],
    "action":{"element":{"Toxin":0.6},"status_chance":0.6}},{"name":"Rime Rounds","img":"RimeRounds.webp","tags":["primary-rifle","primary-bow","primary-sniper"],
    "action":{"element":{"Cold":0.6},"status_chance":0.6}},{"name":"Thermite Rounds","img":"ThermiteRounds.webp","tags":["primary-rifle","primary-bow","primary-sniper"],
    "action":{"element":{"Heat":0.6},"status_chance":0.6}},{"name":"Wildfire","img":"Wildfire.webp","tags":["primary-rifle","primary-bow","primary-sniper"],
    "action":{"element":{"Heat":0.6},"magazineSize":0.2}},{"name":"High Voltage","img":"HighVoltage.webp","tags":["primary-rifle","primary-bow","primary-sniper"],
    "action":{"element":{"Electricity":0.6},"status_chance":0.6}},{"name":"Pathogen Rounds","img":"PathogenRounds.webp","tags":["secondary"],
    "action":{"element":{"Toxin":0.9}}},{"name":"Pistol Pestilence","img":"PistolPestilence.webp","tags":["secondary"],
    "action":{"element":{"Toxin":0.6},"status_chance":0.6}},{"name":"Contagious Spread","img":"ContagiousSpread.webp","tags":["primary-shotgun"],
    "action":{"element":{"Toxin":0.9}}},{"name":"Primed Chilling Grasp","img":"PrimedChillingGrasp.webp","tags":["primary-shotgun"],
    "action":{"element":{"Cold":1.65}}},{"name":"Toxic Blight","img":"ToxicBlight.webp","tags":["MIRE"],
    "action":{"element":{"Toxin":1}}},{"name":"Toxic Barrage","img":"ToxicBarrage.webp","tags":["primary-shotgun"],
    "action":{"element":{"Toxin":0.6},"status_chance":0.6}},{"name":"Fever Strike","uncomp":["Primed Fever Strike"],
    "img":"FeverStrike.webp","tags":["melee"],
    "action":{"element":{"Toxin":0.9}}},{"name":"Primed Fever Strike","uncomp":["Fever Strike"],
    "img":"PrimedFeverStrike.webp","tags":["melee"],
    "action":{"element":{"Toxin":1.65}}},{"name":"Virulent Scourge","img":"VirulentScourge.webp","tags":["melee"],
    "action":{"element":{"Toxin":0.6},"status_chance":0.6}},{"name":"Incendiary Coat","img":"IncendiaryCoat.webp","tags":["primary-shotgun"],
    "action":{"element":{"Heat":0.9}}},{"name":"Blaze","img":"Blaze.webp","tags":["primary-shotgun"],
    "action":{"element":{"Heat":0.6},"base":0.6}},{"name":"Scattering Inferno","img":"ScatteringInferno.webp","tags":["primary-shotgun"],
    "action":{"element":{"Heat":0.6},"status_chance":0.6}},{"name":"Heated Charge","img":"HeatedCharge.webp","uncomp":["Primed Heated Charge"],
    "tags":["secondary"],
    "action":{"element":{"Heat":0.9}}},{"name":"Primed Heated Charge","img":"PrimedHeatedCharge.webp","uncomp":["Heated Charge"],
    "tags":["secondary"],
    "action":{"element":{"Heat":1.65}}},{"name":"Scorch","img":"Scorch.webp","tags":["secondary"],
    "action":{"element":{"Heat":0.6},"status_chance":0.6}},{"name":"Volcanic Edge","img":"VolcanicEdge.webp","tags":["melee"],
    "action":{"element":{"Heat":0.6},"status_chance":0.6}},{"name":"Molten Impact","img":"MoltenImpact.webp","tags":["melee"],
    "action":{"element":{"Heat":0.9}}},{"name":"Chilling Grasp","img":"ChillingGrasp.webp","tags":["primary-shotgun"],
    "action":{"element":{"Cold":0.9}}},{"name":"Chilling Reload","img":"ChillingReload.webp","tags":["primary-shotgun"],
    "action":{"element":{"Cold":0.6},"reloadTime":0.4,"charge_time":0.4}},{"name":"Frigid Blast","img":"FrigidBlast.webp","tags":["primary-shotgun"],
    "action":{"element":{"Cold":0.6},"status_chance":0.6}},{"name":"Deep Freeze","img":"DeepFreeze.webp","tags":["secondary"],
    "action":{"element":{"Cold":0.9}}},{"name":"Frostbite","img":"Frostbite.webp","tags":["secondary"],
    "action":{"element":{"Cold":0.6},"status_chance":0.6}},{"name":"Ice Storm","img":"IceStorm.webp","tags":["secondary"],
    "action":{"element":{"Cold":0.4},"magazineSize":0.4}},{"name":"North Wind","img":"NorthWind.webp","tags":["melee"],
    "action":{"element":{"Cold":0.9}}},{"name":"Vicious Frost","img":"ViciousFrost.webp","tags":["melee"],
    "action":{"element":{"Cold":0.6},"status_chance":0.6}},{"name":"Charged Shell","img":"ChargedShell.webp","tags":["primary-shotgun"],
    "action":{"element":{"Electricity":0.9}}},{"name":"Primed Charged Shell","img":"PrimedChargedShell.webp","tags":["primary-shotgun"],
    "action":{"element":{"Electricity":1.65}}},{"name":"Shell Shock","img":"ShellShock.webp","tags":["primary-shotgun"],
    "action":{"element":{"Electricity":0.6},"status_chance":0.6}},{"name":"Convulsion","img":"Convulsion.webp","tags":["secondary"],
    "uncomp":["Primed Convulsion"],
    "action":{"element":{"Electricity":0.9}}},{"name":"Primed Convulsion","img":"PrimedConvulsion.webp","tags":["secondary"],
    "uncomp":["Convulsion"],
    "action":{"element":{"Electricity":1.65}}},{"name":"Jolt","img":"Jolt.webp","tags":["secondary"],
    "action":{"element":{"Electricity":0.6},"status_chance":0.6}},{"name":"Shocking Touch","img":"ShockingTouch.webp","tags":["melee"],
    "action":{"element":{"Electricity":0.9}}},{"name":"Voltaic Strike","img":"VoltaicStrike.webp","tags":["melee"],
    "action":{"element":{"Electricity":0.6},"status_chance":0.6}},{"name":"Focus Energy","img":"FocusEnergy.webp","tags":["melee"],
    "action":{"element":{"Electricity":0.6},"melee_combo_eff":0.4}},{"name":"Damzav-Vati","img":"Damzav-Vati.webp","tags":["AKBRONCO_PRIME"],
    "action":{"addViral":2.4}},{"name":"Point Strike","img":"PointStrike.webp","tags":["primary-rifle","primary-bow","primary-sniper"],
    "uncomp":["Critical Delay"],
    "action":{"crit_chance":1.5}},{"name":"Pistol Gambit","img":"PistolGambit.webp","tags":["secondary"],
    "uncomp":["Primed Pistol Gambit","Creeping Bullseye"],
    "action":{"crit_chance":1.2}},{"name":"Primed Pistol Gambit","img":"PrimedPistolGambit.webp","uncomp":["Pistol Gambit","Creeping Bullseye"],
    "tags":["secondary"],
    "action":{"crit_chance":1.87}},{"name":"Critical Delay","img":"CriticalDelay.webp","tags":["primary-rifle","primary-bow","primary-sniper"],
    "uncomp":["Point Strike"],
    "action":{"crit_chance":2,"speed":-0.2,"charge_time":-0.2,"FOR_WEAPON":{"primary-bow":{"charge_time":-0.4}}}},{"name":"Galvanized Steel","img":"GalvanizedSteel.webp","tags":["melee"],
    "uncomp":["True Steel","Sacrificial Steel","Amalgam Ripkas True Steel"],
    "action":{"crit_chance":1.1,"WITH_COND":{"crit_mult":1.2}}},{"name":"Proton Jet","img":"ProtonJet.webp","tags":["primary-rifle","primary-bow","primary-sniper"],
    "action":{"WITH_COND":{"crit_chance":1.2,"status_chance":1.2}}},{"name":"Deadly Maneuvers","img":"DeadlyManeuvers.webp","tags":["MAGNUS"],
    "action":{"WITH_COND":{"mult_crit_chance":4}}},{"name":"Blunderbuss","img":"Blunderbuss.webp","tags":["primary-shotgun"],
    "uncomp":["Critical Deceleration"],
    "action":{"crit_chance":0.9}},{"name":"Critical Deceleration","img":"CriticalDeceleration.webp","tags":["primary-shotgun"],
    "uncomp":["Blunderbuss"],
    "action":{"crit_chance":2,"speed":-0.2}},{"name":"Creeping Bullseye","img":"CreepingBullseye.webp","tags":["secondary"],
    "uncomp":["Primed Pistol Gambit","Pistol Gambit"],
    "action":{"crit_chance":2,"speed":-0.2}},{"name":"Argon Scope","img":"ArgonScope.webp","tags":["primary-rifle","primary-bow","primary-sniper"],
    "uncomp":["Galvanized Scope"],
    "action":{"WITH_COND":{"crit_chance":1.35}}},{"name":"Galvanized Scope","img":"GalvanizedScope.webp","tags":["primary-rifle","primary-bow","primary-sniper"],
    "action":{"WITH_COND":{"crit_chance":3.2}}},{"name":"Hydraulic Crosshairs","img":"HydraulicCrosshairs.webp","tags":["secondary"],
    "uncomp":["Galvanized Crosshairs"],
    "action":{"WITH_COND":{"crit_chance":1.35}}},{"name":"Galvanized Crosshairs","img":"GalvanizedCrosshairs.webp","tags":["secondary"],
    "uncomp":["Hydraulic Crosshairs"],
    "action":{"WITH_COND":{"crit_chance":3.2}}},{"name":"Blood Rush","img":"BloodRush.webp","tags":["melee"],
    "action":{"WITH_COND":{"crit_chance_per_combo":0.4}}},{"name":"Deadly Sequence","img":"DeadlySequence.webp","tags":["GRINLOK"],
    "action":{"crit_chance":2}},{"name":"Exposing Harpoon","img":"ExposingHarpoon.webp","tags":["HARPAK"],
    "action":{"WITH_COND":{"crit_chance":3}}},{"name":"Hata-Satya","img":"Hata-Satya.webp","tags":["SOMA_PRIME"],
    "action":{"WITH_COND":{"crit_chance":5}}},{"name":"Motus Setup","img":"MotusSetup.webp","tags":["primary-shotgun"],
    "action":{"WITH_COND":{"crit_chance":1,"status_chance":1}}},{"name":"Proton Snap","img":"ProtonSnap.webp","tags":["melee"],
    "action":{"element":{"Toxin":1},"WITH_COND":{"absolute_status_chance":50,"element":{"Toxin":1}}}},{"name":"Gladiator Might","img":"GladiatorMight.webp","tags":["melee"],
    "action":{"crit_mult":0.6,"WITH_COND":{"crit_chance_per_combo":0.1}}},{"name":"Gladiator Vice","img":"GladiatorVice.webp","tags":["melee"],
    "action":{"speed":0.3,"WITH_COND":{"crit_chance_per_combo":0.1}}},{"name":"Gladiator Rush","img":"GladiatorRush.webp","tags":["melee"],
    "action":{"comboDuration":6,"WITH_COND":{"crit_chance_per_combo":0.1}}},{"name":"True Steel","img":"TrueSteel.webp","tags":["melee"],
    "uncomp":["Sacrificial Steel","Amalgam Ripkas True Steel","Galvanized Steel"],
    "action":{"crit_chance":1.2}},{"name":"Sacrificial Steel","img":"SacrificialSteel.webp","tags":["melee"],
    "uncomp":["True Steel","Amalgam Ripkas True Steel","Galvanized Steel"],
    "set":{"1":1,"2":1.25,"name":"Sacrificial"},"action":{"crit_chance":2.2,"SMITE":{"Sentient":0.33}}},{"name":"Hammer Shot","img":"HammerShot.webp","tags":["primary-rifle","primary-bow","primary-sniper"],
    "action":{"crit_mult":0.6,"status_chance":0.8}},{"name":"Melee Prowess","img":"MeleeProwess.webp","tags":["melee"],
    "action":{"status_chance":0.9}},{"name":"Vital Sense","img":"VitalSense.webp","tags":["primary-rifle","primary-bow","primary-sniper"],
    "action":{"crit_mult":1.2}},{"name":"Primed Target Cracker","img":"PrimedTargetCracker.webp","tags":["secondary"],
    "action":{"crit_mult":1.1}},{"name":"Target Cracker","img":"TargetCracker.webp","tags":["secondary"],
    "action":{"crit_mult":0.6}},{"name":"Hollow Point","img":"HollowPoint.webp","tags":["secondary"],
    "action":{"crit_mult":0.6,"base":-0.15}},{"name":"Merciless Gunfight","img":"MercilessGunfight.webp","tags":["secondary"],
    "action":{"crit_mult":0.45,"punch_through":1.2}},{"name":"Bladed Rounds","img":"BladedRounds.webp","tags":["primary-rifle","primary-bow","primary-sniper"],
    "action":{"WITH_COND":{"crit_mult":1.2}}},{"name":"Unseen Dread","img":"UnseenDread.webp","tags":["DREAD"],
    "action":{"crit_mult":1.75}},{"name":"Laser Sight","img":"LaserSight.webp","tags":["primary-shotgun"],
    "uncomptag":["POWER_WEAPON"],
    "action":{"WITH_COND":{"crit_chance":1.2}}},{"name":"Shrapnel Shot","img":"ShrapnelShot.webp","tags":["primary-shotgun"],
    "uncomptag":["POWER_WEAPON"],
    "action":{"WITH_COND":{"crit_mult":0.99}}},{"name":"Sharpened Bullets","img":"SharpenedBullets.webp","tags":["secondary"],
    "action":{"WITH_COND":{"crit_mult":0.75}}},{"name":"Organ Shatter","img":"OrganShatter.webp","tags":["melee"],
    "uncomp":["Amalgam Organ Shatter"],
    "action":{"crit_mult":0.9}},{"name":"Amalgam Organ Shatter","img":"AmalgamOrganShatter.webp","tags":["melee"],
    "uncomp":["Organ Shatter"],
    "action":{"crit_mult":0.85,"windUp":0.6}},{"name":"Dreamer's Wrath","img":"DreamersWrath.webp","tags":["melee"],
    "type":"exilus","action":{"heavy_crit_mult":0.32}},{"name":"Primed Ravage","img":"PrimedRavage.webp","tags":["primary-shotgun"],
    "uncomp":["Ravage"],
    "action":{"crit_mult":1.1}},{"name":"Ravage","img":"Ravage.webp","tags":["primary-shotgun"],
    "uncomp":["Primed Ravage"],
    "action":{"crit_mult":0.6}},{"name":"Lethal Torrent","img":"LethalTorrent.webp","tags":["secondary"],
    "action":{"speed":0.6,"multishot":0.6}},{"name":"Split Chamber","img":"SplitChamber.webp","tags":["primary-rifle","primary-bow","primary-sniper"],
    "uncomp":["Galvanized Chamber","Split Flights"],
    "action":{"multishot":0.9}},{"name":"Galvanized Chamber","img":"GalvanizedChamber.webp","tags":["primary-rifle","primary-bow","primary-sniper"],
    "uncomp":["Split Chamber","Split Flights"],
    "action":{"multishot":0.8,"WITH_COND":{"multishot":2.3}}},{"name":"Galvanized Diffusion","img":"GalvanizedDiffusion.webp","tags":["secondary"],
    "uncomp":["Barrel Diffusion","Amalgam Barrel Diffusion"],
    "action":{"multishot":1.1,"WITH_COND":{"multishot":2.3}}},{"name":"Galvanized Hell","img":"GalvanizedHell.webp","tags":["primary-shotgun"],
    "uncomp":["Hell's Chamber"],
    "action":{"multishot":1.1,"WITH_COND":{"multishot":2.3}}},{"name":"Hell's Chamber","img":"HellsChamber.webp","tags":["primary-shotgun"],
    "uncomp":["Galvanized Hell"],
    "action":{"multishot":1.2}},{"name":"Barrel Diffusion","img":"BarrelDiffusion.webp","tags":["secondary"],
    "uncomp":["Galvanized Diffusion","Amalgam Barrel Diffusion"],
    "action":{"multishot":1.2}},{"name":"Amalgam Barrel Diffusion","img":"AmalgamBarrelDiffusion.webp","tags":["secondary"],
    "uncomp":["Galvanized Diffusion","Barrel Diffusion"],
    "action":{"multishot":1.1}},{"name":"Split Flights","img":"SplitFlights.webp","tags":["primary-bow"],
    "uncomp":["Split Chamber","Galvanized Chamber"],
    "uncomptag":["CROSSBOW","GRNBOW","CRPBOW","INFBOW","OMICRUS","POWER_WEAPON"],
    "action":{"multishot":1,"spread":1.8,"WITH_COND":{"spread":7.2}}},{"name":"Vigilante Armaments","img":"VigilanteArmaments.webp","tags":["primary"],
    "action":{"multishot":0.6,"double_crit":0.05}},{"name":"Scattered Justice","img":"ScatteredJustice.webp","tags":["HEK"],
    "action":{"multishot":2}},{"name":"Critical Mutation","img":"CriticalMutation.webp","tags":["CATABOLYST"],
    "action":{"crit_mult":3,"crit_chance":3}},{"name":"Shrapnel Rounds","img":"ShrapnelRounds.webp","tags":["MARELOK"],
    "action":{"multishot":2,"base":-0.66}},{"name":"Vile Acceleration","img":"VileAcceleration.webp","tags":["primary-rifle","primary-bow","primary-sniper"],
    "action":{"base":-0.15,"speed":0.9,"charge_time":0.9,"FOR_WEAPON":{"primary-bow":{"charge_time":1.8}}}},{"name":"Frail Momentum","img":"FrailMomentum.webp","tags":["primary-shotgun"],
    "action":{"base":-0.15,"speed":0.9}},{"name":"Gunslinger","img":"Gunslinger.webp","tags":["secondary"],
    "action":{"speed":0.72}},{"name":"Anemic Agility","img":"AnemicAgility.webp","tags":["secondary"],
    "action":{"speed":0.9,"base":-0.15}},{"name":"Speed Trigger","img":"SpeedTrigger.webp","tags":["primary-rifle","primary-bow","primary-sniper"],
    "action":{"speed":0.6,"charge_time":0.6,"FOR_WEAPON":{"primary-bow":{"charge_time":1.2}}}},{"name":"Vile Precision","img":"VilePrecision.webp","tags":["primary-rifle","primary-bow","primary-sniper"],
    "action":{"speed":-0.36,"charge_time":-0.36,"FOR_WEAPON":{"primary-bow":{"charge_time":-0.72}}}},{"name":"Pressurized Magazine","img":"PressurizedMagazine.webp","tags":["secondary"],
    "action":{"WITH_COND":{"speed":0.9}}},{"name":"Vigilante Fervor","img":"VigilanteFervor.webp","tags":["primary"],
    "action":{"speed":0.45,"charge_time":0.45,"FOR_WEAPON":{"primary-bow":{"charge_time":0.9}},"double_crit":0.05}},{"name":"Gilded Truth","img":"GildedTruth.webp","tags":["BURSTON_PRIME"],
    "action":{"speed":0.8}},{"name":"Primed Shred","img":"PrimedShred.webp","uncomp":["Shred"],
    "tags":["primary-rifle","primary-bow","primary-sniper"],
    "action":{"speed":0.55,"charge_time":0.55,"punch_through":2.2,"FOR_WEAPON":{"primary-bow":{"charge_time":1.1}}}},{"name":"Shred","img":"Shred.webp","uncomp":["Primed Shred"],
    "tags":["primary-rifle","primary-bow","primary-sniper"],
    "action":{"speed":0.3,"charge_time":0.3,"punch_through":1.2,"FOR_WEAPON":{"primary-bow":{"charge_time":0.6}}}},{"name":"Accelerated Blast","img":"AcceleratedBlast.webp","tags":["primary-shotgun"],
    "action":{"speed":0.6,"phys":{"Puncture":0.6}}},{"name":"Shotgun Barrage","img":"ShotgunSpazz.webp","tags":["primary-shotgun"],
    "uncomp":["Amalgam Shotgun Barrage"],
    "action":{"speed":0.9}},{"name":"Amalgam Shotgun Barrage","img":"AmalgamShotgunBarrage.webp","tags":["primary-shotgun"],
    "uncomp":["Shotgun Barrage"],
    "uncomptag":["POWER_WEAPON"],
    "action":{"speed":0.85}},{"name":"Repeater Clip","img":"RepeaterClip.webp","tags":["primary-shotgun"],
    "uncomptag":["POWER_WEAPON"],
    "action":{"WITH_COND":{"speed":1.05}}},{"name":"Spring-Loaded Chamber","img":"Spring-LoadedChamber.webp","tags":["primary-rifle"],
    "uncomptag":["POWER_WEAPON"],
    "action":{"WITH_COND":{"speed":0.75}}},{"name":"Berserker Fury","img":"BerserkerFury.webp","tags":["melee"],
    "uncomp":["Fury","Primed Fury"],
    "action":{"speed":0.35,"WITH_COND":{"speed":0.7}}},{"name":"Fury","img":"Fury.webp","tags":["melee"],
    "uncomp":["Berserker Fury","Primed Fury"],
    "action":{"speed":0.3}},{"name":"Primed Fury","img":"PrimedFury.webp","tags":["melee"],
    "uncomp":["Berserker Fury","Fury"],
    "action":{"speed":0.55}},{"name":"Quickening","img":"Quickening.webp","tags":["melee"],
    "action":{"speed":0.4}},{"name":"Rifle Aptitude","img":"RifleAptitude.webp","tags":["primary-rifle","primary-bow","primary-sniper"],
    "uncomp":["Galvanized Aptitude"],
    "action":{"status_chance":0.9}},{"name":"Sure Shot","img":"SureShot.webp","tags":["secondary"],
    "uncomp":["Galvanized Shot"],
    "action":{"status_chance":0.9}},{"name":"Vigilante Supplies","img":"VigilanteSupplies.webp","tags":["primary"],
    "type":"exilus","action":{"double_crit":0.05}},{"name":"Amalgam Daikyu Target Acquired","img":"AmalgamDaikyuTargetAcquired.webp","tags":["DAIKYU"],
    "action":{"mult_for_head":0.75}},{"name":"Efficient Beams","img":"EfficientBeams.webp","tags":["CONVECTRIX"],
    "action":{"status_chance":1.5}},{"name":"Napalm Grenades","img":"NapalmGrenades.webp","tags":["PENTA"],
    "action":{"absolute_status_chance":30}},{"name":"Entropy Burst","img":"EntropyBurst.webp","tags":["SUPRA"],
    "action":{"absolute_status_chance":20}},{"name":"Eroding Blight","img":"ErodingBlight.webp","tags":["EMBOLIST"],
    "action":{"magazineSize":2}},{"name":"Stockpiled Blight","img":"StockpiledBlight.webp","tags":["KUNAI"],
    "action":{"magazineSize":2}},{"name":"Gleaming Blight","img":"GleamingBlight.webp","tags":["DARK DAGGER"],
    "action":{"status_chance":1}},{"name":"Justice Blades","img":"JusticeBlades.webp","tags":["DUAL CLEAVERS"],
    "action":{"base":1}},{"name":"Shattering Justice","img":"ShatteringJustice.webp","tags":["SOBEK"],
    "action":{"status_chance":0.9}},{"name":"Acid Shells","img":"AcidShells.webp","tags":["SOBEK"],
    "action":{"sobekAug":1}},{"name":"Clip Delegation","img":"ClipDelegation.webp","tags":["SOBEK"],
    "action":{"WITH_COND":{"status_chance":2.25,"multishot":2.25}}},{"name":"Bright Purity","img":"BrightPurity.webp","tags":["SKANA"],
    "action":{"base":1}},{"name":"Winds of Purity","img":"WindsofPurity.webp","tags":["FURIS"],
    "action":{"lifesteal":0.2,"purity":1}},{"name":"Blade of Truth","img":"BladeofTruth.webp","tags":["JAW_SWORD"],
    "action":{"base":1}},{"name":"Stinging Truth","img":"StingingTruth.webp","tags":["VIPER"],
    "action":{"magazineSize":0.4}},{"name":"Dizzying Rounds","img":"DizzyingRounds.webp","tags":["BRONCO"],
    "action":{"WITH_COND":{"status_chance":2}}},{"name":"Flux Overdrive","img":"FluxOverdrive.webp","tags":["FLUX"],
    "action":{"WITH_COND":{"status_chance":2.5}}},{"name":"Stunning Speed","img":"StunningSpeed.webp","tags":["secondary"],
    "action":{"reloadTime":0.4,"charge_time":0.4,"status_chance":0.3}},{"name":"Precision Strike","img":"PrecisionStrike.webp","tags":["TONKOR"],
    "action":{"WITH_COND":{"reloadTime":1.5}}},{"name":"Combat Reload","img":"CombatReload.webp","tags":["TIGRIS"],
    "action":{"WITH_COND":{"reloadTime":1.2}}},{"name":"Depleted Reload","img":"DepletedReload.webp","tags":["primary-sniper"],
    "action":{"magazineSize":-0.6,"reloadTime":0.48,"charge_time":0.48}},{"name":"Range Advantage","img":"RangeAdvantage.webp","tags":["AKJAGARA"],
    "action":{"WITH_COND":{"base":3}}},{"name":"Eximus Advantage","img":"EximusAdvantage.webp","tags":["ZYLOK"],
    "action":{"WITH_COND":{"base":6}}},{"name":"Bhisaj-Bal","img":"Bhisaj-Bal.webp","tags":["PARIS_PRIME"],
    "type":"exilus","action":{"status_chance":0.9}},{"name":"Fast Hands","img":"FastHands.webp","tags":["primary-rifle","primary-bow","primary-sniper"],
    "uncomp":["Primed Fast Hands"],
    "action":{"reloadTime":0.3}},{"name":"Primed Fast Hands","img":"PrimedFastHands.webp","tags":["primary-rifle","primary-bow","primary-sniper"],
    "uncomp":["Fast Hands"],
    "action":{"reloadTime":0.55}},{"name":"Primed Quickdraw","img":"PrimedQuickdraw.webp","tags":["secondary"],
    "uncomp":["Quickdraw"],
    "action":{"reloadTime":0.88,"charge_time":0.88}},{"name":"Quickdraw","img":"Quickdraw.webp","tags":["secondary"],
    "uncomp":["Primed Quickdraw"],
    "action":{"reloadTime":0.48,"charge_time":0.48}},{"name":"Aero Agility","img":"AeroAgility.webp","tags":["primary-sniper"],
    "action":{"WITH_COND":{"reloadTime":1,"charge_time":1}}},{"name":"Emergent Aftermath","img":"EmergentAftermath.webp","tags":["primary-sniper"],
    "action":{"WITH_COND":{"reloadTime":0.5,"charge_time":0.5}}},{"name":"Tactical Pump","img":"TacticalPump.webp","tags":["primary-shotgun"],
    "uncomp":["Primed Tactical Pump"],
    "action":{"reloadTime":0.6,"charge_time":0.6}},{"name":"Primed Tactical Pump","img":"PrimedTacticalPump.webp","tags":["primary-shotgun"],
    "uncomp":["Tactical Pump"],
    "action":{"reloadTime":1,"charge_time":1}},{"name":"Trick Mag","img":"TrickMag.webp","tags":["secondary"],
    "type":"exilus","action":{"ammoCapacity":0.9}},{"name":"Eagle Eye","img":"EagleEye.webp","tags":["primary-rifle","primary-bow","primary-sniper"],
    "type":"exilus","action":{"zoom":0.4}},{"name":"Burdened Magazine","img":"BurdenedMagazine.webp","tags":["primary-shotgun"],
    "action":{"magazineSize":0.6,"reloadTime":-0.18}},{"name":"Shell Compression","img":"ShellCompression.webp","tags":["primary-shotgun"],
    "type":"exilus","action":{"ammoCapacity":0.9}},{"name":"Guardian Derision","img":"GuardianDerision.webp","tags":["melee"],
    "type":"exilus","action":{"comboIn":0.3}},{"name":"Metamorphic Magazine","img":"MetamorphicMagazine.webp","tags":["GORGON"],
    "action":{"ammoCapacity":0.9,"magazineSize":0.9}},{"name":"Magazine Warp","img":"MagazineWarp.webp","tags":["primary-rifle","primary-bow","primary-sniper"],
    "uncomp":["Amalgam Javlok Magazine Warp","Primed Magazine Warp"],
    "action":{"magazineSize":0.3}},{"name":"Primed Magazine Warp","img":"PrimedMagazineWarp.webp","uncomp":["Magazine Warp","Amalgam Javlok Magazine Warp"],
    "tags":["primary-rifle","primary-bow","primary-sniper"],
    "action":{"magazineSize":0.55}},{"name":"Target Acquired","img":"TargetAcquired.webp","tags":["primary-sniper"],
    "action":{"mult_for_head":0.6}},{"name":"Ammo Stock","img":"AmmoStock.webp","tags":["primary-shotgun"],
    "uncomp":["Primed Ammo Stock"],
    "action":{"magazineSize":0.6}},{"name":"Primed Ammo Stock","img":"PrimedAmmoStock.webp","tags":["primary-shotgun"],
    "uncomp":["Ammo Stock"],
    "action":{"magazineSize":1.1}},{"name":"Primed Slip Magazine","img":"PrimedSlipMagazine.webp","tags":["secondary"],
    "uncomp":["Slip Magazine"],
    "action":{"magazineSize":0.55}},{"name":"Slip Magazine","img":"SlipMagazine.webp","tags":["secondary"],
    "uncomp":["Primed Slip Magazine"],
    "action":{"magazineSize":0.3}},{"name":"Amalgam Javlok Magazine Warp","img":"AmalgamJavlokMagazineWarp.webp","uncomp":["Primed Magazine Warp","Magazine Warp"],
    "tags":["JAVLOK"],
    "action":{"magazineSize":0.45}},{"name":"Zazvat-Kar","img":"Zazvat-Kar.webp","tags":["AKSTILETTO_PRIME"],
    "action":{"WITH_COND":{"ammoEff":0.75}}},{"name":"Skull Shots","img":"SkullShots.webp","tags":["VIPER"],
    "action":{"WITH_COND":{"ammoEff":1}}},{"name":"Brain Storm","img":"BrainStorm.webp","tags":["GRAKATA"],
    "action":{"WITH_COND":{"ammoEff":1}}},{"name":"Lethal Momentum","img":"LethalMomentum.webp","tags":["secondary"],
    "type":"exilus","action":{"shot_speed":0.4}},{"name":"Terminal Velocity","img":"TerminalVelocity.webp","tags":["primary-rifle","primary-bow","primary-sniper"],
    "type":"exilus","action":{"shot_speed":0.6}},{"name":"Fatal Acceleration","img":"FatalAcceleration.webp","tags":["primary-shotgun"],
    "type":"exilus","action":{"shot_speed":0.4}},{"name":"Focused Acceleration","img":"FocusedAcceleration.webp","tags":["TETRA"],
    "action":{"WITH_COND":{"shot_speed":0.8}}},{"name":"Ammo Drum","img":"AmmoDrum.webp","tags":["primary-rifle","primary-bow","primary-sniper"],
    "type":"exilus","action":{"ammoCapacity":0.9}},{"name":"Smite Grineer","img":"SmiteGrineer.webp","tags":["melee"],
    "uncomp":["Primed Smite Grineer"],
    "action":{"SMITE":{"Grineer":0.3,"Kuva Grineer":0.3}}},{"name":"Primed Smite Grineer","img":"PrimedSmiteGrineer.webp","tags":["melee"],
    "uncomp":["Smite Grineer"],
    "action":{"SMITE":{"Grineer":0.55,"Kuva Grineer":0.55}}},{"name":"Bane of Grineer","img":"BaneOfGrineer.webp","tags":["primary-rifle","primary-bow","primary-sniper"],
    "uncomp":["Primed Bane of Grineer"],
    "action":{"SMITE":{"Grineer":0.3,"Kuva Grineer":0.3}}},{"name":"Primed Bane of Grineer","img":"PrimedBaneofGrineer.webp","uncomp":["Bane of Grineer"],
    "tags":["primary-rifle","primary-bow","primary-sniper"],
    "action":{"SMITE":{"Grineer":0.55,"Kuva Grineer":0.55}}},{"name":"Bane Of The Murmur","img":"BaneOfTheMurmur.webp","tags":["primary-rifle","primary-bow","primary-sniper"],
    "uncomp":["Primed Bane of The Murmur"],
    "action":{"SMITE":{"Murmur":0.3}}},{"name":"Primed Bane of The Murmur","img":"PrimedBaneOfTheMurmur.webp","uncomp":["Bane Of The Murmur"],
    "tags":["primary-rifle","primary-bow","primary-sniper"],
    "action":{"SMITE":{"Murmur":0.55}}},{"name":"Primed Expel Corpus","img":"PrimedExpelCorpus.webp","tags":["secondary"],
    "action":{"SMITE":{"Corpus":0.55}}},{"name":"Primed Bane of Corpus","img":"PrimedBaneofCorpus.webp","tags":["primary-rifle","primary-bow","primary-sniper"],
    "action":{"SMITE":{"Corpus":0.55}}},{"name":"Primed Expel Grineer","img":"PrimedExpelGrineer.webp","tags":["secondary"],
    "uncomp":["Expel Grineer"],
    "action":{"SMITE":{"Grineer":0.55,"Kuva Grineer":0.55}}},{"name":"Expel Grineer","img":"ExpelGrineer.webp","tags":["secondary"],
    "uncomp":["Primed Expel Grineer"],
    "action":{"SMITE":{"Grineer":0.3,"Kuva Grineer":0.3}}},{"name":"Primed Expel Corrupted","img":"PrimedExpelCorrupted.webp","tags":["secondary"],
    "action":{"SMITE":{"Orokin":0.55}}},{"name":"Expel Infested","img":"ExpelInfested.webp","tags":["secondary"],
    "uncomp":["Primed Expel Infested"],
    "action":{"SMITE":{"Infested":0.3,"Infested Deimos":0.3}}},{"name":"Expel The Murmur","img":"ExpelTheMurmur.webp","uncomp":["Primed Expel The Murmur"],
    "tags":["secondary"],
    "action":{"SMITE":{"Murmur":0.3}}},{"name":"Primed Expel The Murmur","img":"PrimedExpelTheMurmur.webp","tags":["secondary"],
    "uncomp":["Expel The Murmur"],
    "action":{"SMITE":{"Murmur":0.55}}},{"name":"Primed Expel Infested","img":"PrimedExpelInfested.webp","tags":["secondary"],
    "uncomp":["Expel Infested"],
    "action":{"SMITE":{"Infested":0.55,"Infested Deimos":0.55}}},{"name":"Primed Bane of Infested","img":"PrimedBaneofInfested.webp","tags":["primary-rifle","primary-bow","primary-sniper"],
    "action":{"SMITE":{"Infested":0.55,"Infested Deimos":0.55}}},{"name":"Primed Bane of Corrupted","img":"PrimedBaneofCorrupted.webp","tags":["primary-rifle","primary-bow","primary-sniper"],
    "uncomp":["Bane of Corrupted"],
    "action":{"SMITE":{"Orokin":0.55}}},{"name":"Bane of Corrupted","img":"BaneOfCorrupted.webp","tags":["primary-rifle","primary-bow","primary-sniper"],
    "uncomp":["Primed Bane of Corrupted"],
    "action":{"SMITE":{"Orokin":0.3}}},{"name":"Primed Smite Corrupted","img":"PrimedSmiteCorrupted.webp","tags":["melee"],
    "action":{"SMITE":{"Orokin":0.55}}},{"name":"Primed Smite Corpus","img":"PrimedSmiteCorpus.webp","tags":["melee"],
    "uncomp":["Smite Corpus"],
    "action":{"SMITE":{"Corpus":0.55}}},{"name":"Smite Corpus","img":"SmiteCorpus.webp","tags":["melee"],
    "uncomp":["Primed Smite Corpus"],
    "action":{"SMITE":{"Corpus":0.3}}},{"name":"Smite The Murmur","img":"SmiteTheMurmur.webp","tags":["melee"],
    "uncomp":["Primed Smite The Murmur"],
    "action":{"SMITE":{"Murmur":0.3}}},{"name":"Primed Smite The Murmur","img":"PrimedSmiteTheMurmur.webp","uncomp":["Smite The Murmur"],
    "tags":["melee"],
    "action":{"SMITE":{"Murmur":0.55}}},{"name":"Primed Smite Infested","img":"PrimedSmiteInfested.webp","tags":["melee"],
    "action":{"SMITE":{"Infested":0.55,"Infested Deimos":0.55}}},{"name":"Primed Cleanse Corrupted","img":"PrimedCleanseCorrupted.webp","tags":["primary-shotgun"],
    "uncomp":["Cleanse Corrupted"],
    "action":{"SMITE":{"Orokin":0.55}}},{"name":"Cleanse Corrupted","img":"CleanseCorrupted.webp","tags":["primary-shotgun"],
    "uncomp":["Primed Cleanse Corrupted"],
    "action":{"SMITE":{"Orokin":0.3}}},{"name":"Primed Cleanse Grineer","img":"PrimedCleanseGrineer.webp","tags":["primary-shotgun"],
    "uncomp":["Cleanse Grineer"],
    "action":{"SMITE":{"Grineer":0.55,"Kuva Grineer":0.55}}},{"name":"Cleanse Grineer","img":"CleanseGrineer.webp","tags":["primary-shotgun"],
    "uncomp":["Primed Cleanse Grineer"],
    "action":{"SMITE":{"Grineer":0.3,"Kuva Grineer":0.3}}},{"name":"Cleanse The Murmur","img":"CleanseTheMurmur.webp","tags":["primary-shotgun"],
    "action":{"SMITE":{"Murmur":0.3}}},{"name":"Primed Cleanse Infested","img":"PrimedCleanseInfested.webp","tags":["primary-shotgun"],
    "uncomp":["Cleanse Infested"],
    "action":{"SMITE":{"Infested":0.55,"Infested Deimos":0.55}}},{"name":"Cleanse Infested","img":"CleanseInfested.webp","tags":["primary-shotgun"],
    "uncomp":["Primed Cleanse Infested"],
    "action":{"SMITE":{"Infested":0.3,"Infested Deimos":0.3}}},{"name":"Primed Cleanse Corpus","img":"PrimedCleanseCorpus.webp","tags":["primary-shotgun"],
    "uncomp":["Cleanse Corpus"],
    "action":{"SMITE":{"Corpus":0.55}}},{"name":"Cleanse Corpus","img":"CleanseCorpus.webp","tags":["primary-shotgun"],
    "uncomp":["Primed Cleanse Corpus"],
    "action":{"SMITE":{"Corpus":0.3}}},{"name":"Killing Blow","img":"KillingBlow.webp","tags":["melee"],
    "action":{"base_heavy":1.2,"windUp":0.6}},{"name":"Corrupt Charge","img":"CorruptCharge.webp","tags":["melee"],
    "action":{"initialCombo":30,"comboDurationP":-0.5}},{"name":"Covert Lethality","img":"CovertLethality.webp","tags":["melee-dagger"],
    "action":{"initialCombo":16,"finisherDmg":1}},{"name":"Finishing Touch","img":"FinishingTouch.webp","tags":["melee"],
    "action":{"finisherDmg":0.6}},{"name":"Galvanized Reflex","img":"GalvanizedReflex.webp","tags":["melee"],
    "uncomp":["Reflex Coil"],
    "action":{"melee_combo_eff":0.5,"WITH_COND":{"initialCombo":80}}},{"name":"Weeping Wounds","img":"WeepingWounds.webp","tags":["melee"],
    "action":{"WITH_COND":{"status_chance_by_combo":0.4}}},{"name":"Catalyzer Link","img":"CatalyzerLink.webp","tags":["primary-rifle","primary-bow","primary-sniper"],
    "action":{"WITH_COND":{"status_chance":0.6}}},{"name":"Nano-Applicator","img":"Nano-Applicator.webp","tags":["primary-shotgun"],
    "uncomptag":["POWER_WEAPON"],
    "action":{"WITH_COND":{"status_chance":0.9}}},{"name":"Shotgun Savvy","img":"ShotgunSavvy.webp","tags":["primary-shotgun"],
    "uncomp":["Galvanized Savvy"],
    "action":{"status_chance":0.9}},{"name":"Embedded Catalyzer","img":"EmbeddedCatalyzer.webp","tags":["secondary"],
    "action":{"WITH_COND":{"status_chance":0.9}}},{"name":"Reflex Coil","img":"ReflexCoil.webp","tags":["melee"],
    "uncomp":["Galvanized Reflex"],
    "action":{"melee_combo_eff":0.6}},{"name":"Hunter Munitions","img":"HunterMunitions.webp","tags":["primary"],
    "action":{"add_slash":0.3}},{"name":"Internal Bleeding","img":"InternalBleeding.webp","tags":["primary-rifle","primary-bow","primary-sniper"],
    "action":{"add_slash_on_impact":0.35}},{"name":"Hemorrhage","img":"Hemorrhage.webp","tags":["secondary"],
    "action":{"add_slash_on_impact":0.35}},{"name":"Magnetic Welt","img":"MagneticWelt.webp","tags":["primary-shotgun"],
    "action":{"add_magnetic_on_impact":0.35}},{"name":"Reach","img":"Reach.webp","tags":["melee"],
    "uncomp":["Primed Reach"],
    "action":{"range":1.5}},{"name":"Primed Reach","img":"PrimedReach.webp","uncomp":["Reach"],
    "tags":["melee"],
    "action":{"range":3}},{"name":"Spring-Loaded Blade","img":"Spring-LoadedBlade.webp","tags":["melee"],
    "action":{"WITH_COND":{"range":2}}},{"name":"Radiated Reload","img":"RadiatedReload.webp","tags":["primary-rifle","primary-bow","primary-sniper"],
    "action":{"addRadiation":0.6,"reloadTime":0.4}},{"name":"Atomic Fallout","img":"AtomicFallout.webp","tags":["primary-shotgun"],
    "action":{"addRadiation":0.6,"magazineSize":0.6}},{"name":"Accelerated Isotope","img":"AcceleratedIsotope.webp","tags":["secondary"],
    "action":{"addRadiation":0.6,"speed":0.4}},{"name":"Focus Radon","img":"FocusRadon.webp","tags":["melee"],
    "action":{"addRadiation":0.6,"melee_combo_eff":0.4}},{"name":"Leaded Gas","img":"LeadedGas.webp","tags":["VESPER77"],
    "action":{"addGas":3,"status_chance":3,"status_damage_gas":3}},{"name":"Biotic Rounds","img":"BioticRounds.webp","tags":["AX52"],
    "action":{"addMagnetic":1.5,"addViral":1.5,"status_chance":1.5}},{"name":"Magnetic Capacity","img":"MagneticCapacity.webp","tags":["primary-rifle","primary-bow","primary-sniper"],
    "action":{"addMagnetic":0.6,"magazineSize":0.4}},{"name":"Magnetic Rush","img":"MagneticRush.webp","tags":["melee"],
    "action":{"addMagnetic":0.6,"speed":0.2}},{"name":"Magnetic Strafe","img":"MagneticStrafe.webp","tags":["primary-shotgun"],
    "action":{"addMagnetic":0.6,"speed":0.4}},{"name":"Magnetic Might","img":"MagneticMight.webp","tags":["secondary"],
    "action":{"addMagnetic":0.6,"crit_mult":0.4}},{"name":"Bore","img":"Bore.webp","tags":["secondary"],
    "action":{"phys":{"Puncture":1.2}}},{"name":"Piercing Hit","img":"PiercingHit.webp","tags":["primary-rifle","primary-bow","primary-sniper"],
    "action":{"phys":{"Puncture":0.9}}},{"name":"Piercing Caliber","img":"PiercingCaliber.webp","tags":["primary-rifle","primary-bow","primary-sniper"],
    "action":{"phys":{"Puncture":1.2}}},{"name":"Flechette","img":"Flechette.webp","tags":["primary-shotgun"],
    "action":{"phys":{"Puncture":0.9}}},{"name":"Breach Loader","img":"BreachLoader.webp","tags":["primary-shotgun"],
    "action":{"phys":{"Puncture":1.2}}},{"name":"No Return","img":"NoReturn.webp","tags":["secondary"],
    "action":{"phys":{"Puncture":0.9}}},{"name":"Seismic Wave","img":"SeismicWave.webp","tags":["melee"],
    "action":{"slam_mult":2}},{"name":"Jugulus Barbs","img":"JugulusBarbs.webp","tags":["melee"],
    "action":{"phys":{"Puncture":0.9},"status_chance":0.6}},{"name":"Enduring Affliction","img":"EnduringAffliction.webp","tags":["melee"],
    "action":{"WITH_COND":{"status_chance":1}}},{"name":"Jugulus Spines","img":"JugulusSpines.webp","tags":["secondary"],
    "action":{"phys":{"Puncture":0.9},"status_chance":0.6}},{"name":"Sundering Strike","img":"SunderingStrike.webp","tags":["melee"],
    "action":{"phys":{"Puncture":0.9}}},{"name":"Auger Strike","img":"AugerStrike.webp","tags":["melee"],
    "action":{"phys":{"Puncture":1.2}}},{"name":"Rending Strike","img":"RendingStrike.webp","tags":["melee"],
    "action":{"phys":{"Puncture":0.8,"Slash":0.6}}},{"name":"Rupture","img":"Rupture.webp","tags":["primary-rifle","primary-bow","primary-sniper"],
    "action":{"phys":{"Impact":0.9}}},{"name":"Disruptor","img":"Disruptor.webp","tags":["primary-shotgun"],
    "action":{"phys":{"Impact":0.9}}},{"name":"Full Contact","img":"FullContact.webp","tags":["primary-shotgun"],
    "action":{"phys":{"Impact":1.2}}},{"name":"Pummel","img":"Pummel.webp","tags":["secondary"],
    "action":{"phys":{"Impact":1.2}}},{"name":"Concussion Rounds","img":"ConcussionRounds.webp","tags":["secondary"],
    "action":{"phys":{"Impact":0.9}}},{"name":"Crash Course","img":"CrashCourse.webp","tags":["primary-rifle","primary-bow","primary-sniper"],
    "action":{"phys":{"Impact":1.2}}},{"name":"Collision Force","img":"CollisionForce.webp","tags":["melee"],
    "action":{"phys":{"Impact":1.2}}},{"name":"Heavy Trauma","img":"HeavyTrauma.webp","tags":["melee"],
    "uncomp":["Primed Heavy Trauma"],
    "action":{"phys":{"Impact":0.9}}},{"name":"Primed Heavy Trauma","img":"PrimedHeavyTrauma.webp","tags":["melee"],
    "uncomp":["Heavy Trauma"],
    "action":{"phys":{"Impact":1.65}}},{"name":"Saxum Thorax","img":"SaxumThorax.webp","tags":["melee"],
    "action":{"phys":{"Impact":0.9},"status_chance":0.6}},{"name":"Saxum Spittle","img":"SaxumSpittle.webp","tags":["secondary"],
    "action":{"phys":{"Impact":0.9},"status_chance":0.6}},{"name":"Fanged Fusillade","img":"FangedFusillade.webp","tags":["primary-rifle","primary-bow","primary-sniper"],
    "action":{"phys":{"Slash":1.2}}},{"name":"Sawtooth Clip","img":"SawtoothClip.webp","tags":["primary-rifle","primary-bow","primary-sniper"],
    "action":{"phys":{"Slash":0.9}}},{"name":"Shredder","img":"Shredder.webp","tags":["primary-shotgun"],
    "action":{"phys":{"Slash":0.9}}},{"name":"Sweeping Serration","img":"SweepingSerration.webp","tags":["primary-shotgun"],
    "action":{"phys":{"Slash":1.2}}},{"name":"Buzz Kill","img":"BuzzKill.webp","tags":["melee"],
    "action":{"phys":{"Slash":1.2}}},{"name":"Jagged Edge","img":"JaggedEdge.webp","tags":["melee"],
    "action":{"phys":{"Slash":0.9}}},{"name":"Tainted Mag","img":"TaintedMag.webp","tags":["primary-rifle"],
    "action":{"reloadTime":-0.33,"magazineSize":0.66}},{"name":"Tainted Clip","img":"TaintedClip.webp","tags":["secondary"],
    "action":{"reloadTime":-0.3,"magazineSize":0.6}},{"name":"Maim","img":"Maim.webp","tags":["secondary"],
    "action":{"phys":{"Slash":1.2}}},{"name":"Razor Shot","img":"RazorShot.webp","tags":["secondary"],
    "action":{"phys":{"Slash":0.9}}},{"name":"Carnis Stinger","img":"CarnisStinger.webp","tags":["secondary"],
    "action":{"phys":{"Slash":0.9},"status_chance":0.6}},{"name":"Metal Auger","img":"MetalAuger.webp","uncomp":["Amalgam Argonak Metal Auger"],
    "tags":["primary-rifle","primary-bow","primary-sniper"],
    "action":{"punch_through":2.1}},{"name":"Seeking Force","img":"SeekingForce.webp","tags":["primary-shotgun"],
    "action":{"punch_through":2.1}},{"name":"Seeker","img":"Seeker.webp","tags":["secondary"],
    "action":{"punch_through":2.1}},{"name":"Rifle Ammo Mutation","img":"RifleAmmoMutation.webp","type":"exilus","uncomp":["Primed Rifle Ammo Mutation"],
    "tags":["primary-rifle"],
    "action":{"mutator":0.5}},{"name":"Primed Rifle Ammo Mutation","img":"PrimedRifleAmmoMutation.webp","type":"exilus","uncomp":["Rifle Ammo Mutation"],
    "tags":["primary-rifle"],
    "action":{"mutator":0.92}},{"name":"Pistol Ammo Mutation","img":"PistolAmmoMutation.webp","type":"exilus","uncomp":["Primed Pistol Ammo Mutation"],
    "tags":["secondary"],
    "action":{"mutator":0.5}},{"name":"Primed Pistol Ammo Mutation","img":"PrimedPistolAmmoMutation.webp","type":"exilus","uncomp":["Pistol Ammo Mutation"],
    "tags":["secondary"],
    "action":{"mutator":0.92}},{"name":"Sniper Ammo Mutation","img":"SniperAmmoMutation.webp","type":"exilus","uncomp":["Primed Sniper Ammo Mutation"],
    "tags":["primary-sniper"],
    "action":{"mutator":0.5}},{"name":"Primed Sniper Ammo Mutation","img":"PrimedSniperAmmoMutation.webp","type":"exilus","uncomp":["Sniper Ammo Mutation"],
    "tags":["primary-sniper"],
    "action":{"mutator":0.92}},{"name":"Sharpshooter","img":"Sharpshooter.webp","tags":["primary-sniper"],
    "action":{"energy":1}},{"name":"Seeking Fury","img":"SeekingFury.webp","tags":["primary-shotgun"],
    "action":{"reloadTime":0.15,"charge_time":0.15,"punch_through":1.2}},{"name":"Power Throw","img":"PowerThrow.webp","tags":["melee-glaive"],
    "action":{"punch_through":2,"WITH_COND":{"multiple":3}}},{"name":"Charged Chamber","img":"ChargedChamber.webp","tags":["primary-sniper"],
    "action":{"f_multiple":0.4}},{"name":"Primed Chamber","img":"PrimedChamber.webp","tags":["primary-sniper"],
    "action":{"f_multiple":1}},{"name":"Synth Charge","img":"SynthCharge.webp","tags":["secondary"],
    "action":{"l_multiple":2}},{"name":"Vigilante Offense","img":"VigilanteOffense.webp","tags":["primary"],
    "action":{"punch_through":1.5,"double_crit":0.05}},{"name":"Carnis Mandible","img":"CarnisMandible.webp","tags":["melee"],
    "action":{"phys":{"Slash":0.9},"status_chance":0.6}},{"name":"Continuous Misery","img":"ContinuousMisery.webp","tags":["primary-rifle","primary-bow","primary-sniper"],
    "action":{"status_duration":1}},{"name":"Lasting Sting","img":"LastingSting.webp","tags":["melee"],
    "action":{"status_duration":1.1}},{"name":"Augur Seeker","img":"AugurSeeker.webp","tags":["secondary"],
    "action":{"status_duration":0.9}},{"name":"Hunter Track","img":"HunterTrack.webp","tags":["primary"],
    "action":{"status_duration":0.9}},{"name":"Perpetual Agony","img":"PerpetualAgony.webp","tags":["secondary"],
    "action":{"status_duration":0.9}},{"name":"Lingering Torment","img":"LingeringTorment.webp","tags":["primary-shotgun"],
    "action":{"status_duration":0.9}},{"name":"Primed Fulmination","img":"PrimedFulmination.webp","tags":["secondary"],
    "action":{"blast_radius":0.44}},{"name":"Primed Firestorm","img":"PrimedFirestorm.webp","tags":["primary-rifle","primary-bow","primary-sniper"],
    "action":{"blast_radius":0.44}},{"name":"Galvanized Acceleration","img":"GalvanizedAcceleration.webp","tags":["primary-shotgun"],
    "uncomp":["Fatal Acceleration"],
    "type":"exilus","action":{"shot_speed":0.3,"WITH_COND":{"shot_speed":0.9}}},{"name":"Sinister Reach","img":"SinisterReach.webp","tags":["primary"],
    "type":"exilus","action":{"beam_length":12}},{"name":"Stabilizer","img":"Stabilizer.webp","tags":["primary-rifle","primary-bow","primary-sniper"],
    "type":"exilus","action":{"recoil":-0.6}},{"name":"Counterbalance","img":"Counterbalance.webp","tags":["primary-shotgun"],
    "type":"exilus","action":{"recoil":-0.6}},{"name":"Steady Hands","img":"SteadyHands.webp","tags":["secondary"],
    "type":"exilus","action":{"recoil":-0.6}},{"name":"Primed Steady Hands","img":"PrimedSteadyHands.webp","tags":["secondary"],
    "type":"exilus","action":{"recoil":-0.85}},{"name":"Ruinous Extension","img":"RuinousExtension.webp","tags":["secondary"],
    "type":"exilus","action":{"beam_length":8}},{"name":"Hush","img":"Hush.webp","tags":["primary-rifle","primary-bow","primary-sniper"],
    "type":"exilus","action":{"d_sound":1}},{"name":"Suppress","img":"Suppress.webp","tags":["secondary"],
    "type":"exilus","action":{"d_sound":1}},{"name":"Silent Battery","img":"SilentBattery.webp","tags":["primary-shotgun"],
    "type":"exilus","action":{"d_sound":1}},{"name":"Volatile Quick Return","img":"VolatileQuickReturn.webp","tags":["melee-glaive"],
    "uncomp":["Volatile Rebound","Quick Return","Rebound"],
    "action":{"WITH_COND":{"glaive_explode":1,"blast_radius":1,"bounce":-4}}},{"name":"Volatile Rebound","img":"VolatileRebound.webp","tags":["melee-glaive"],
    "uncomp":["Volatile Quick Return","Quick Return","Rebound"],
    "action":{"WITH_COND":{"glaive_explode":1}}},{"name":"Quick Return","img":"QuickReturn.webp","tags":["melee-glaive"],
    "uncomp":["Volatile Quick Return","Volatile Rebound","Rebound"],
    "action":{"WITH_COND":{"bounce":-4}}},{"name":"Rebound","img":"Rebound.webp","tags":["melee-glaive"],
    "uncomp":["Volatile Quick Return","Volatile Rebound","Quick Return"],
    "action":{"WITH_COND":{"bounce":4}}},{"name":"Harkonar Scope","img":"HarkonarScope.webp","tags":["primary-sniper"],
    "uncomptag":["POWER_WEAPON"],
    "action":{"sniper_combo_duration":12}},{"name":"Maiming Strike","img":"MaimingStrike.webp","tags":["melee"],
    "action":{"crit_chance_slide":1.2}},{"name":"Body Count","img":"BodyCount.webp","tags":["melee"],
    "action":{"comboDuration":12}},{"name":"Combo Killer","img":"ComboKiller.webp","tags":["melee-glaive"],
    "action":{"comboDuration":5}},{"name":"Drifting Contact","img":"DriftingContact.webp","tags":["melee"],
    "action":{"comboDuration":10,"status_chance":0.4}},{"name":"Life Strike","img":"LifeStrike.webp","tags":["melee"],
    "action":{"lifesteal":0.2}},{"name":"Whirlwind","img":"Whirlwind.webp","tags":["melee-glaive"],
    "action":{"shot_speed":1.8}},{"name":"Hawk Eye","img":"HawkEye.webp","tags":["secondary"],
    "action":{"zoom":0.8}},{"name":"Narrow Barrel","img":"NarrowBarrel.webp","tags":["primary-shotgun"],
    "uncomptag":["POWER_WEAPON"],
    "action":{"WITH_COND":{"accuracy":0.3}}},{"name":"Healing Return","img":"HealingReturn.webp","tags":["melee"],
    "action":{"WITH_COND":{"heal":11}}},{"name":"Relentless Combination","img":"RelentlessCombination.webp","tags":["melee"],
    "action":{"WITH_COND":{"comboIn":1}}},{"name":"Nightwatch Napalm","img":"NightwatchNapalm.webp","tags":["OGRIS"],
    "action":{"nNapalm":1}},{"name":"Rubedo-Lined Barrel","img":"Rubedo-LinedBarrel.webp","tags":["primary-archgun"],
    "uncomp":["Primed Rubedo-Lined Barrel"],
    "action":{"base":1}},{"name":"Primed Rubedo-Lined Barrel","img":"PrimedRubedo-LinedBarrel.webp","tags":["primary-archgun"],
    "uncomp":["Rubedo-Lined Barrel"],
    "action":{"base":1.87}},{"name":"Primed Deadly Efficiency","img":"PrimedDeadlyEfficiency.webp","tags":["primary-archgun"],
    "uncomp":["Deadly Efficiency"],
    "action":{"base":2.2}},{"name":"Parallax Scope","img":"ParallaxScope.webp","tags":["primary-archgun"],
    "action":{"crit_chance":1}},{"name":"Dual Rounds","img":"DualRounds.webp","tags":["primary-archgun"],
    "uncomp":["Primed Dual Rounds"],
    "action":{"multishot":0.6}},{"name":"Primed Dual Rounds","img":"PrimedDualRounds.webp","tags":["primary-archgun"],
    "uncomp":["Dual Rounds"],
    "action":{"multishot":1.1}},{"name":"Critical Focus","img":"CriticalFocus.webp","tags":["primary-archgun"],
    "action":{"WITH_COND":{"crit_chance":0.6,"crit_mult":0.6}}},{"name":"Hollowed Bullets","img":"HollowedBullets.webp","tags":["primary-archgun"],
    "action":{"crit_mult":0.8}},{"name":"Photon Overcharge","img":"PhotonOvercharge.webp","tags":["GLAXION"],
    "action":{"WITH_COND":{"crit_mult":0.9}}},{"name":"Necrophagic Vigor","img":"NecrophagicVigor.webp","tags":["HEMA"],
    "action":{"WITH_COND":{"crit_mult":3.6,"crit_chance":3.6}}},{"name":"Deadly Efficiency","img":"DeadlyEfficiency.webp","tags":["primary-archgun"],
    "action":{"WITH_COND":{"base":1.2}}},{"name":"Venomous Clip","img":"VenomousClip.webp","tags":["primary-archgun"],
    "action":{"element":{"Toxin":1.2}}},{"name":"Primed Venomous Clip","img":"PrimedVenomousClip.webp","tags":["primary-archgun"],
    "action":{"element":{"Toxin":1.87}}},{"name":"Polar Magazine","img":"PolarMagazine.webp","tags":["primary-archgun"],
    "action":{"element":{"Cold":1.2}}},{"name":"Combustion Rounds","img":"CombustionRounds.webp","tags":["primary-archgun"],
    "uncomp":["Primed Combustion Rounds"],
    "action":{"element":{"Heat":1.2}}},{"name":"Primed Combustion Rounds","img":"PrimedCombustionRounds.webp","tags":["primary-archgun"],
    "uncomp":["Combustion Rounds"],
    "action":{"element":{"Heat":1.87}}},{"name":"Electrified Barrel","img":"ElectrifiedBarrel.webp","tags":["primary-archgun"],
    "action":{"element":{"Electricity":1.2}}},{"name":"Magnetized Cycle","img":"MagnetizedCycle.webp","tags":["primary-archgun"],
    "action":{"addMagnetic":0.6,"speed":0.3}},{"name":"Magazine Extension","img":"MagazineExtension.webp","tags":["primary-archgun"],
    "action":{"magazineSize":0.6}},{"name":"Magazine Extension","img":"MagazineExtension.webp","tags":["primary-archgun"],
    "action":{"magazineSize":0.6}},{"name":"Modified Munitions","img":"ModifiedMunitions.webp","tags":["primary-archgun"],
    "action":{"status_chance":0.6}},{"name":"Quick Reload","img":"QuickReload.webp","tags":["primary-archgun"],
    "action":{"reloadTime":1}},{"name":"Ammo Chain","img":"AmmoChain.webp","tags":["primary-archgun"],
    "action":{"ammoCapacity":1}},{"name":"Ballista Measure","img":"BallistaMeasure.webp","tags":["primary-archgun"],
    "action":{"arch_range":0.2}},{"name":"Automatic Trigger","img":"AutomaticTrigger.webp","tags":["primary-archgun"],
    "action":{"speed":0.6,"charge_time":0.6}},{"name":"Shell Rush","img":"ShellRush.webp","tags":["primary-archgun"],
    "action":{"reloadRate":0.5}},{"name":"Archgun Ace","img":"ArchgunAce.webp","tags":["primary-archgun"],
    "action":{"WITH_COND":{"speed":0.5,"charge_time":0.5,"reloadTime":1}}},{"name":"Hypothermic Shell","img":"HypothermicShell.webp","tags":["primary-archgun"],
    "action":{"element":{"Cold":0.6},"status_chance":0.6}},{"name":"Contamination Casing","img":"ContaminationCasing.webp","tags":["primary-archgun"],
    "action":{"element":{"Toxin":0.6},"status_chance":0.6}},{"name":"Charged Bullets","img":"ChargedBullets.webp","tags":["primary-archgun"],
    "action":{"element":{"Electricity":0.6},"status_chance":0.6}},{"name":"Magma Chamber","img":"MagmaChamber.webp","tags":["primary-archgun"],
    "action":{"element":{"Heat":0.6},"status_chance":0.6}},{"name":"Sabot Rounds","img":"SabotRounds.webp","tags":["primary-archgun"],
    "action":{"base":0.6,"punch_through":3}},{"name":"Containment Breach","img":"ContainmentBreach.webp","tags":["primary-archgun"],
    "action":{"addRadiation":0.6,"multishot":0.3}},{"name":"Marked Target","img":"MarkedTarget.webp","tags":["primary-archgun"],
    "action":{"WITH_COND":{"status_chance":1.2}}},{"name":"Zodiac Shred","img":"ZodiacShred.webp","tags":["primary-archgun"],
    "action":{"phys":{"Slash":0.9}}},{"name":"Quasar Drill","img":"QuasarDrill.webp","tags":["primary-archgun"],
    "action":{"phys":{"Puncture":0.9}}},{"name":"Comet Blast","img":"CometBlast.webp","tags":["primary-archgun"],
    "action":{"phys":{"Impact":0.9}}},{"name":"Resolute Focus","img":"ResoluteFocus.webp","tags":["primary-archgun"],
    "action":{"spread":-0.5}},{"name":"Shivering Contagion","img":"ShiveringContagion.webp","tags":["primary"],
    "action":{"aColdSpread":1}},{"name":"Parry","img":"Parry.webp","tags":["melee"],
    "type":"exilus","action":{"na":0}},{"name":"Opportunity's Reach","img":"OpportunitysReach.webp","tags":["melee"],
    "type":"exilus","action":{"na":0}},{"name":"Mentor's Legacy","img":"MentorsLegacy.webp","tags":["melee"],
    "type":"exilus","action":{"na":0}},{"name":"Master's Edge","img":"MastersEdge.webp","tags":["melee"],
    "type":"exilus","action":{"na":0}},{"name":"Focused Defense","img":"FocusedDefense.webp","tags":["melee"],
    "type":"exilus","action":{"na":0}},{"name":"Dispatch Overdrive","img":"DispatchOverdrive.webp","tags":["melee"],
    "type":"exilus","action":{"na":0}},{"name":"Discipline's Merit","img":"DisciplinesMerit.webp","tags":["melee"],
    "type":"exilus","action":{"na":0}},{"name":"Condition's Perfection","img":"ConditionsPerfection.webp","tags":["melee"],
    "type":"exilus","action":{"na":0}},{"name":"Blind Justice","img":"BlindJustice.webp","tags":["NIKANAS_STANCE"],
    "type":"stance","action":{"stances":{"Guiding Light":{"total":2.6,"hits":["3","2","2","2","2","2","2","4"],
    "statuses":["impact","","","","","","slash",""]},"Zatōs Creed":{"total":3,"hits":["1","1","2","1","2","3"],
    "statuses":["","","","","",""]},"Heeding Call":{"total":2.5,"hits":["1","1","1","1","1","3","2","4","1"],
    "statuses":["","","","","","","","",""]},"Destined Path":{"total":1.7,"hits":["1","2","1","2","2","4"],
    "statuses":["","","","","slash",""]},"Parting Knee":{"total":0.9,"hits":["1","1","1","1"],
    "statuses":["","","",""]}}}},{"name":"Tranquil Cleave","img":"TranquilCleave.webp","tags":["NIKANAS_STANCE"],
    "type":"stance","action":{"stances":{"Breathless Lunge":{"total":3.8,"hits":["3","1","1","1","3","4"],
    "statuses":["","","slash","","",""]},"Windless Cut":{"total":1.9,"hits":["1","2","2","2"],
    "statuses":["","","",""]},"Beyond Reproach":{"total":2.6,"hits":["3","2","4"],
    "statuses":["impact","","impact"]},"Hook and Eye":{"total":1.2,"hits":["4","4"],
    "statuses":["",""]},"Setting Sun":{"total":2.6,"hits":["2","2","2"],
    "statuses":["","",""]}}}},{"name":"Decisive Judgement","img":"DecisiveJudgement.webp","tags":["NIKANAS_STANCE"],
    "type":"stance","action":{"stances":{"Swift Retribution":{"total":2.65,"hits":["2","3","2","3","4"],
    "statuses":["","","slash","","",""]},"Windless Cut":{"total":0.9,"hits":["1","2"],
    "statuses":["","impact"]},"Consent Decree":{"total":1.65,"hits":["1","2","3","4"],
    "statuses":["impact","","impact","impact"]},"Silent Acumen":{"total":1.55,"hits":["3","5"],
    "statuses":["impact",""]}}}},{"name":"Defiled Snapdragon","img":"DefiledSnapdragon.webp","tags":["BLADE_AND_WHIP_STANCE"],
    "type":"stance","action":{"stances":{"Claws of the Drake":{"total":4.25,"hits":["3","3","1","2","2","1","1","2","4","4"],
    "statuses":["","","","slash","","","slash","","",""]},"Soul of the Leviathan":{"total":4.1,"hits":["1","1","1","1","1","1","1","1","1","1","2","2","2","1","1","2"],
    "statuses":["","","","","","","","","","","","","","","",""]},"Heart of the Naga":{"total":4.3,"hits":["3","1","1","1","2","2","1","2"],
    "statuses":["","","","","slash","","","slash"]},"Fangs of the Lindwurm":{"total":1.35,"hits":["5"],
    "statuses":[""]},"Weightless Steel":{"total":2.1,"hits":["2","2","3"],
    "statuses":["","",""]}}}},{"name":"Crossing Snakes","img":"CrossingSnakes.webp","tags":["DUAL_SWORDS_STANCE"],
    "type":"stance","action":{"stances":{"East to West":{"total":1.4,"hits":["2","3","3","2","2"],
    "statuses":["","","","impact","impact"]},"Lacerating Leap":{"total":1.9,"hits":["1","1","1","1","2","2","1"],
    "statuses":["","","","","","",""]},"Northern Coil":{"total":2.2,"hits":["1","1","2","2","2","2"],
    "statuses":["","","","impact","",""]},"Twin Fang":{"total":2.4,"hits":["1","1","1","1","2","2"],
    "statuses":["","","","slash","slash",""]}}}},{"name":"Swirling Tiger","img":"SwirlingTiger.webp","tags":["DUAL_SWORDS_STANCE"],
    "type":"stance","action":{"stances":{"Winding Claws":{"total":2,"hits":["1","1","1","1","1","1","3","1","3"],
    "statuses":["","","","","","slash","","",""]},"Raking Flesh":{"total":1.6,"hits":["1","1","1","1","1","1","2","1"],
    "statuses":["","","","","","","",""]},"Dancing Hunter":{"total":2.3,"hits":["1","1","1","1","1","1","1","1","2","2"],
    "statuses":["","","","","","impact","","","",""]}}}},{"name":"Carving Mantis","img":"CarvingMantis.webp","tags":["DUAL_SWORDS_STANCE"],
    "type":"stance","action":{"stances":{"Rapid Incisions":{"total":3.9,"hits":["2","1","3","3","3","3","2","2"],
    "statuses":["","slash","","","","slash","","slash"]},"Ambush Predator":{"total":2.4,"hits":["1","1","1","1","1","1","2","3"],
    "statuses":["","","","","","","",""]},"Dire Courtship":{"total":1.2,"hits":["2","2","2","2"],
    "statuses":["","","impact","impact"]},"Biting Mandibles":{"total":2.5,"hits":["1","1","1","1","2","2","4"],
    "statuses":["","","","","","slash",""]}}}},{"name":"Cyclone Kraken","img":"CycloneKraken.webp","tags":["MACHETES_STANCE"],
    "type":"stance","action":{"stances":{"Gale Triton":{"total":4.1,"hits":["3","2","1","1","2","4","4"],
    "statuses":["impact","","","","","",""]},"Leviathan Rain":{"total":1.9,"hits":["1","1","1","1","1"],
    "statuses":["","","","",""]},"Lightning Siren":{"total":2.3,"hits":["2","2","1","2","4"],
    "statuses":["","impact","","slash",""]},"Thunder Hydra":{"total":2.3,"hits":["1","3","3","4"],
    "statuses":["","","",""]}}}},{"name":"Sundering Weave","img":"SunderingWeave.webp","tags":["MACHETES_STANCE"],
    "type":"stance","action":{"stances":{"Rapid Current":{"total":1.7,"hits":["2","3","4"],
    "statuses":["","",""]},"Cresting Surf":{"total":2,"hits":["1","2","2"],
    "statuses":["","",""]},"Flash Flood":{"total":2.4,"hits":["1","1","2","4","1"],
    "statuses":["","","slash","","impact"]},"Coming Tide":{"total":1.2,"hits":["5"],
    "statuses":[""]}}}},{"name":"Vulpine Mask","img":"VulpineMask.webp","tags":["RAPIER_STANCE"],
    "type":"stance","action":{"stances":{"Assailant Guise":{"total":3,"hits":["1","1","3","3","3","1","4"],
    "statuses":["","","slash","","","slash",""]},"Duel Secrets":{"total":3,"hits":["0.5","0.5","1","1","1","2","2"],
    "statuses":["","","","","","",""]},"Hidden Flourish":{"total":2.5,"hits":["2","1","1","1","2","3","4"],
    "statuses":["impact","","slash","","","","impact"]},"Deceptive Lunge":{"total":1.45,"hits":["2","3","4"],
    "statuses":["","",""]}}}},{"name":"Wise Razor","img":"WiseRazor.webp","tags":["LONG_KATANA_STANCE"],
    "type":"stance","action":{"stances":{"Threshing Grain":{"total":4.4,"hits":["3","3","3","2","2","4"],
    "statuses":["impact","","","","slash",""]},"Cutting Thrice":{"total":2.5,"hits":["2","2","4"],
    "statuses":["","",""]},"Calling Thunder":{"total":3.5,"hits":["2","2","3","1","3","4"],
    "statuses":["","impact","slash","impact","",""]}}}},{"name":"Iron Phoenix","img":"IronPhoenix.webp","tags":["SWORDS_STANCE"],
    "type":"stance","action":{"stances":{"Wings and Beak":{"total":1.4,"hits":["3","2","2"],
    "statuses":["slash","",""]},"Double Slash":{"total":0.65,"hits":["1","2"],
    "statuses":["",""]},"Taking Flight":{"total":1.8,"hits":["1","3","4","1"],
    "statuses":["","impact","","impact"]}}}},{"name":"Crimson Dervish","img":"CrimsonDervish.webp","tags":["SWORDS_STANCE"],
    "type":"stance","action":{"stances":{"Twisting Flurry":{"total":2,"hits":["3","3","2","2","4"],
    "statuses":["","","","impact",""]},"Crimson Orbit":{"total":2,"hits":["1","2","1","2"],
    "statuses":["","","",""]},"Coiling Impale":{"total":1.5,"hits":["2","2","4"],
    "statuses":["","slash",""]}}}},{"name":"Vengeful Revenant","img":"VengefulRevenant.webp","tags":["SWORDS_STANCE"],
    "type":"stance","action":{"stances":{"Impending Dread":{"total":3.15,"hits":["3","2","3","3","3"],
    "statuses":["impact","","","",""]},"Lone Vengeance":{"total":1.55,"hits":["1","2","1","2"],
    "statuses":["","","slash",""]},"Drowning Despair":{"total":2.3,"hits":["1","3","0.5","0.5","3","3"],
    "statuses":["","impact","","","",""]},"Rising Hate":{"total":3,"hits":["4","1","2","3","1"],
    "statuses":["","","slash","","impact"]}}}},{"name":"Swooping Falcon","img":"SwoopingFalcon.webp","tags":["SWORDS_STANCE"],
    "type":"stance","action":{"stances":{"Diving Kestrel":{"total":2,"hits":["3","1","3","3","2"],
    "statuses":["impact","slash","","",""]},"Swift Pursuit":{"total":1.95,"hits":["1","2","1","2"],
    "statuses":["","","",""]},"Slicing Talon":{"total":2.05,"hits":["2","2","2","3"],
    "statuses":["","slash","",""]},"Keen Broadwing":{"total":2.75,"hits":["1","3","3","5"],
    "statuses":["","","impact",""]}}}},{"name":"Eleventh Storm","img":"EleventhStorm.webp","tags":["SWORDS_AND_SHIELD_STANCE"],
    "type":"stance","action":{"stances":{"Striking Thunder":{"total":3.5,"hits":["3","2","4","3","2","4"],
    "statuses":["impact","","","","slash",""]},"Devouring Beast":{"total":1.15,"hits":["1","2","2"],
    "statuses":["","",""]},"Bide and Bleed":{"total":1.8,"hits":["2","1","1","4","1"],
    "statuses":["","","","","impact"]},"Diamond Deus":{"total":2,"hits":["1","1","1","1","1","5"],
    "statuses":["","","","","",""]}}}},{"name":"Final Harbinger","img":"FinalHarbinger.webp","tags":["SWORDS_AND_SHIELD_STANCE"],
    "type":"stance","action":{"stances":{"Null Warning":{"total":3,"hits":["2","2","2","3","3","1","1","1","4","4","4"],
    "statuses":["","slash","","","","","","slash","","",""]},"Impending Battery":{"total":2.65,"hits":["1","2","2","1","2","2","1","2","1","1"],
    "statuses":["","","","","","","","","",""]},"Dark Light":{"total":4.05,"hits":["1","1","1","3","1","2","2","2","2","1","1","1","1","1"],
    "statuses":["","","","impact","impact","","","","","","","","",""]},"Systemic Shred":{"total":1.8,"hits":["2","1","1","1","5"],
    "statuses":["","","","",""]}}}},{"name":"Slicing Feathers","img":"SlicingFeathers.webp","tags":["WARFAN_STANCE"],
    "type":"stance","action":{"stances":{"Scathing Plume":{"total":3.6,"hits":["3","3","1","1","3","1","3","4"],
    "statuses":["impact","impact","","","slash","","",""]},"Razor Fin":{"total":1.65,"hits":["1","1","1","1","2","2","3"],
    "statuses":["","","","","","",""]},"Serrated Crest":{"total":3.55,"hits":["1","1","1","1","1","2","1","1","1","1","1","2","4"],
    "statuses":["","","","","","","","","","slash","slash","impact",""]},"Cutting Fringe":{"total":2.15,"hits":["2","2","4"],
    "statuses":["","",""]}}}},{"name":"Votive Onslaught","img":"VotiveOnslaught.webp","tags":["WARFAN_STANCE"],
    "type":"stance","action":{"stances":{"Purging Drive":{"total":2.57,"hits":["3","3","1","2","1","2","1","1","3","3"],
    "statuses":["","","","","","","","","","slash"]},"Clarion Rush":{"total":1.84,"hits":["1","1","1","1","1","1","1","1","1","1"],
    "statuses":["","","","","","","","","",""]},"Rending Lamentation":{"total":2.78,"hits":["2","1","1","1","2","2","1","3","3","3"],
    "statuses":["","","","","","","","","",""]},"Penitent Offering":{"total":2.67,"hits":["2","2","3","3","1","1","2","2"],
    "statuses":["","","","","","","",""]}}}},{"name":"Homing Fang","img":"HomingFang.webp","tags":["DAGGERS_STANCE"],
    "type":"stance","action":{"stances":{"Cutting Arches":{"total":2.8,"hits":["2","1","3","3","3","1","4"],
    "statuses":["","","impact","","","","slash"]},"Life Eater":{"total":1.4,"hits":["1","1","1","1"],
    "statuses":["","","",""]},"Lashing Forward":{"total":1.7,"hits":["2","1","1","1","3"],
    "statuses":["slash","","","",""]}}}},{"name":"Pointed Wind","img":"PointedWind.webp","tags":["DAGGERS_STANCE"],
    "type":"stance","action":{"stances":{"Parting Edge":{"total":1.55,"hits":["2","1","3","3","3"],
    "statuses":["","slash","","","impact"]},"Viper's Bite":{"total":1.25,"hits":["1","3","2","1"],
    "statuses":["","","",""]}}}},{"name":"Stinging Thorn","img":"StingingThorn.webp","tags":["DAGGERS_STANCE"],
    "type":"stance","action":{"stances":{"Carving Spike":{"total":3.95,"hits":["3","1","1","2","2","3","2","2","2","4"],
    "statuses":["","impact","slash","slash","","","","","slash",""]},"Piercing Horn":{"total":1.8,"hits":["1","2","2","1","2"],
    "statuses":["","","","",""]},"Lacerating Spine":{"total":2.7,"hits":["2","2","2","2","3","1"],
    "statuses":["","","","slash","",""]},"Impaling Quill":{"total":2.35,"hits":["1","2","3","2","4"],
    "statuses":["","","impact","slash",""]}}}},{"name":"Seismic Palm","img":"SeismicPalm.webp","tags":["FIST_STANCE"],
    "type":"stance","action":{"stances":{"Quaking Touch":{"total":1.55,"hits":["3","3","3","3","1"],
    "statuses":["impact","","","",""]},"Erupting Vulcan":{"total":1.35,"hits":["1","1","2","3"],
    "statuses":["","","",""]},"Sudden Rockfall":{"total":1.7,"hits":["3","3","2","2","1"],
    "statuses":["impact","","","",""]},"Echoing Hands":{"total":2.05,"hits":["1","2","3","3","3","1"],
    "statuses":["impact","","","","",""]}}}},{"name":"Fracturing Wind","img":"FracturingWind.webp","tags":["FIST_STANCE"],
    "type":"stance","action":{"stances":{"Rolling Gale":{"total":1.55,"hits":["2","3","4"],
    "statuses":["","",""]},"Gaining Humility":{"total":1.8,"hits":["1","1","3","2"],
    "statuses":["","","",""]},"Trailing Doom":{"total":1.9,"hits":["2","1","1","1","3","4"],
    "statuses":["","","","","impact",""]},"Rising Wind":{"total":1.45,"hits":["3","5","1","1"],
    "statuses":["impact","","impact",""]}}}},{"name":"Gaia's Tragedy","img":"GaiaTragedy.webp","tags":["FIST_STANCE"],
    "type":"stance","action":{"stances":{"River's Grief":{"total":3.65,"hits":["3","2","2","3","4","8"],
    "statuses":["","impact","","","",""]},"Ocean's Contempt":{"total":1.65,"hits":["1","1","1","2","1","1"],
    "statuses":["","","","","",""]},"Mountain's Rage":{"total":2.3,"hits":["2","2","1","2.5","2.5","1","4"],
    "statuses":["impact","impact","","impact","impact","","impact"]},"Forest's Remorse":{"total":3.8,"hits":["2","1","1","1","1","3","5","1"],
    "statuses":["","","","","","","","impact"]}}}},{"name":"Grim Fury","img":"GrimFury.webp","tags":["SPARRING_STANCE"],
    "type":"stance","action":{"stances":{"Fanning Flame":{"total":1.9,"hits":["2","1","3","3","4"],
    "statuses":["impact","","","",""]},"Bright Blaze":{"total":1.75,"hits":["1","1","2","2","2","2"],
    "statuses":["","","","","","impact"]},"Burning Desire":{"total":1.4,"hits":["3","3"],
    "statuses":["impact",""]}}}},{"name":"Brutal Tide","img":"BrutalTide.webp","tags":["SPARRING_STANCE"],
    "type":"stance","action":{"stances":{"Inferno":{"total":2.15,"hits":["1","1","2","1","1","2","3","3"],
    "statuses":["","","","","","","",""]},"Rushing Fire":{"total":3.85,"hits":["2","2","3","1","3","2","3","1"],
    "statuses":["impact","","","impact","","","",""]}}}},{"name":"Shimmering Blight","img":"ShimmeringBlight.webp","tags":["POLEARMS_STANCE"],
    "type":"stance","action":{"stances":{"Slashing Wind":{"total":0.95,"hits":["1","1","1","2"],
    "statuses":["","","",""]},"Howling Gale":{"total":2.55,"hits":["1","1","1","1","1","2","2","2","2"],
    "statuses":["","","","","","","slash","",""]}}}},{"name":"Bleeding Willow","img":"BleedingWillow.webp","tags":["POLEARMS_STANCE"],
    "type":"stance","action":{"stances":{"Lethal Gust":{"total":0.95,"hits":["1","1","1","2"],
    "statuses":["","","",""]},"Drifting Steel":{"total":3.5,"hits":["1","3","2","2","1","1","2","4"],
    "statuses":["impact","impact","","","","","slash",""]}}}},{"name":"Twirling Spire","img":"TwirlingSpire.webp","tags":["POLEARMS_STANCE"],
    "type":"stance","action":{"stances":{"Cresting Peak":{"total":3.3,"hits":["3","2","3","2","4"],
    "statuses":["","slash","","",""]},"Spiraling Pinnacle":{"total":2.5,"hits":["1","2","1","1","1","1","1","1","2"],
    "statuses":["","","","","","","","",""]},"Vaulting Apex":{"total":1.75,"hits":["3","1","4"],
    "statuses":["impact","",""]},"Summit Plunge":{"total":2,"hits":["2","1","1","1","1","4","1","1"],
    "statuses":["","","","","","","",""]}}}},{"name":"Reaping Spiral","img":"ReapingSpiral.webp","tags":["SCYTHES_STANCE"],
    "type":"stance","action":{"stances":{"Eternal Nocturne":{"total":2.9,"hits":["4","2","3","2","5"],
    "statuses":["","","","slash",""]},"Reclamation":{"total":1.85,"hits":["2","1","3"],
    "statuses":["","",""]},"Abyssal Automaton":{"total":2.1,"hits":["3","2","2","2"],
    "statuses":["impact","","","slash"]}}}},{"name":"Stalking Fan","img":"StalkingFan.webp","tags":["SCYTHES_STANCE"],
    "type":"stance","action":{"stances":{"Shadow Wing":{"total":4.9,"hits":["3","2","2","3","5"],
    "statuses":["","","impact","",""]},"Many Tears":{"total":1.25,"hits":["1","3"],
    "statuses":["",""]},"Dying Light":{"total":2.4,"hits":["3","2","2","2","1"],
    "statuses":["impact","","","","slash"]}}}},{"name":"Clashing Forest","img":"ClashingForest.webp","tags":["STAVES_STANCE"],
    "type":"stance","action":{"stances":{"Resolute Flurry":{"total":1.95,"hits":["1","1","1","1","0.5","3","1","4"],
    "statuses":["","","","","","","",""]},"Skyward Limb":{"total":2.05,"hits":["1","1","1","2"],
    "statuses":["","","",""]},"Battering Roots":{"total":2.1,"hits":["2","2","3","3"],
    "statuses":["","","",""]}}}},{"name":"Flailing Branch","img":"FlailingBranch.webp","tags":["STAVES_STANCE"],
    "type":"stance","action":{"stances":{"Rising Falls":{"total":2.35,"hits":["3","2","4"],
    "statuses":["impact","",""]},"Battered Thread":{"total":1.85,"hits":["1","3","2","3"],
    "statuses":["","","",""]},"Autumn Leaf":{"total":2.05,"hits":["2","3","3","1"],
    "statuses":["","","",""]}}}},{"name":"Butcher's Revelry","img":"ButcherRevelry.webp","tags":["BLADESAW_STANCE"],
    "type":"stance","action":{"stances":{"Rictus' Wrath":{"total":4.9,"hits":["3","1","3","4"],
    "statuses":["impact","slash","","slash"]},"Ghoul Rush":{"total":2.8,"hits":["1","1","1","1"],
    "statuses":["","","",""]},"Rip 'N Ride":{"total":2.8,"hits":["1","2","3","1"],
    "statuses":["impact","","","impact"]},"Reciprocator":{"total":5.8,"hits":["1","1","1","2","2","2","1","2","4","1"],
    "statuses":["","","","","","slash","slash","slash","","impact"]}}}},{"name":"Shattering Storm","img":"ShatteringStorm.webp","tags":["HAMMERS_STANCE"],
    "type":"stance","action":{"stances":{"Falling Rock":{"total":4.9,"hits":["4","1","3","3","1","4","1","2","5","1"],
    "statuses":["","","","impact","","","","","",""]},"Pounding Smite":{"total":2.6,"hits":["2","2","2","3"],
    "statuses":["","","",""]},"Smashing Fury":{"total":3.55,"hits":["3","2","4","2","2","5","1"],
    "statuses":["","","","","","",""]},"Rising Thunder":{"total":3.3,"hits":["3","3","5","1"],
    "statuses":["","","",""]}}}},{"name":"Crushing Ruin","img":"CrushingRuin.webp","tags":["HAMMERS_STANCE"],
    "type":"stance","action":{"stances":{"Raging Whirlwind":{"total":3,"hits":["4","2","3","5","1"],
    "statuses":["impact","","","",""]},"Tidal Force":{"total":2.6,"hits":["1","1","1","2","3"],
    "statuses":["","","","",""]},"Shattered Village":{"total":4.25,"hits":["3","0.5","0.5","3","0.5","0.5","4","5","1"],
    "statuses":["","","","","","","impact","",""]},"Winding Temper":{"total":2.25,"hits":["3","2","4","1"],
    "statuses":["","","",""]}}}},{"name":"Cleaving Whirlwind","img":"CleavingWhirlwind.webp","tags":["HEAVY_BLADE_STANCE"],
    "type":"stance","action":{"stances":{"Crowd Fall":{"total":2.25,"hits":["3","4","5","1"],
    "statuses":["impact","","",""]},"Broken Bull":{"total":5.7,"hits":["1","1","1","1","1","2","2","2","2","2"],
    "statuses":["impact","","","","impact","","","","","impact"]},"Sundered Tusk":{"total":2.7,"hits":["5","1","3","1","1","2","1","4","1"],
    "statuses":["impact","","","","","","","","impact"]},"Drifting Stampede":{"total":1.9,"hits":["4","1","5"],
    "statuses":["","",""]}}}},{"name":"Rending Crane","img":"RendingCrane.webp","tags":["HEAVY_BLADE_STANCE"],
    "type":"stance","action":{"stances":{"Skull Splitter":{"total":1.85,"hits":["4","1","5","1"],
    "statuses":["","","",""]},"Lashing Tempest":{"total":2.35,"hits":["1","1","2","3","3"],
    "statuses":["","","","",""]},"Rampaging Boar":{"total":2.3,"hits":["1","3","1","2","4","1"],
    "statuses":["","","","","",""]}}}},{"name":"Tempo Royale","img":"TempoRoyale.webp","tags":["HEAVY_BLADE_STANCE"],
    "type":"stance","action":{"stances":{"August Mesto":{"total":4.65,"hits":["3","2","1","3","1","4","2","1","4"],
    "statuses":["","","","","","","","impact",""]},"Majestic Abandon":{"total":3.4,"hits":["1","1","2","1","2","1"],
    "statuses":["","","","","",""]},"Resplendent Calma":{"total":2.1,"hits":["3","2","5","1"],
    "statuses":["impact","","","impact"]},"Bold Reprise":{"total":1.8,"hits":["6","1"],
    "statuses":["","impact"]}}}},{"name":"Galeforce Dawn","img":"GaleforceDawn.webp","tags":["HEAVY SCYTHE_STANCE"],
    "type":"stance","action":{"stances":{"Stormreaper":{"total":3.1,"hits":["2","2","5"],
    "statuses":["impact","slash",""]},"Bleak Winnowing":{"total":2.7,"hits":["1","1","1","1","1","1"],
    "statuses":["","","","","",""]},"Thundering Peaks":{"total":4.9,"hits":["2","1","2","1","3","1","2","2"],
    "statuses":["impact","impact","impact","slash","","slash","impact",""]}}}},{"name":"Astral Twilight","img":"AstralTwilight.webp","tags":["GLAIVES_STANCE"],
    "type":"stance","action":{"stances":{"Morning Sun":{"total":4.25,"hits":["2","2","5","2","2","5","5","2","2","5"],
    "statuses":["","","","","","","","","",""]},"Midnight Cloud":{"total":3.4,"hits":["1","1","1","1","2"],
    "statuses":["","","","",""]},"Falling Star":{"total":3.2,"hits":["1","1","1","1","2","2","2","2"],
    "statuses":["","","","","","","impact","impact"]},"Rising Moon":{"total":3.5,"hits":["2","2","3","1","2","2","4"],
    "statuses":["","","slash","","","slash",""]}}}},{"name":"Gleaming Talon","img":"GleamingTalon.webp","tags":["GLAIVES_STANCE"],
    "type":"stance","action":{"stances":{"Mercury Vortex":{"total":4.3,"hits":["2","2","2","2","3","3","3","4"],
    "statuses":["","","","","","","",""]},"Ruin":{"total":2,"hits":["2","1","1","1","1"],
    "statuses":["","","","",""]},"Silver Reach":{"total":2.6,"hits":["2","1","1","2","1","2","4"],
    "statuses":["","","","slash","","",""]}}}},{"name":"Bullet Dance","img":"BulletDance.webp","tags":["GUNBLADE_STANCE"],
    "type":"stance","action":{"stances":{"Automatic Rhumba":{"total":4.5,"hits":["1.25","1","1.25","1","1.5","1","2","1","3","3","3"],
    "statuses":["","slash","","","","slash","","","impact","impact","impact"]},"Magnum Mambo":{"total":3,"hits":["1","1","2","3","2","1"],
    "statuses":["","","","","",""]},"Lead Tango":{"total":2.8,"hits":["3","1","2","2","1","1","3"],
    "statuses":["","","","","slash","slash","impact"]},"Samba Slash":{"total":3,"hits":["1","1","2","1","2","1"],
    "statuses":["","slash","","","",""]}}}},{"name":"High Noon","img":"HighNoon.webp","tags":["GUNBLADE_STANCE"],
    "type":"stance","action":{"stances":{"Final Showdown":{"total":3.25,"hits":["1","1","1","1","2","2","2","3"],
    "statuses":["","","slash","slash","impact","","",""]},"Vagabond Blitz":{"total":2.5,"hits":["1","1","1","2","2","1","1","1"],
    "statuses":["","","","","","","",""]},"Desperado Zeal":{"total":1.85,"hits":["1","1","1","1","1","1","1"],
    "statuses":["","","","","slash","slash",""]},"Tomahawk Double-Tap":{"total":1.75,"hits":["3","1","4","4","4"],
    "statuses":["","impact","","",""]}}}},{"name":"Atlantis Vulcan","img":"AtlantisVulcan.webp","tags":["NUNCHAKU_STANCE"],
    "type":"stance","action":{"stances":{"Molten Whirlpool":{"total":3.45,"hits":["0.5","0.5","0.5","0.5","0.5","1","1","1","0.5","0.5","0.5","0.5","0.5","0.5","1","1"],
    "statuses":["","","","","","","","","","","","","","","",""]},"Searing Undertow":{"total":3.25,"hits":["0.5","0.5","0.5","0.5","0.5","1","1","1","1","1"],
    "statuses":["","","","","","","","","",""]},"Blazing Vortex":{"total":4.1,"hits":["0.5","0.5","0.5","0.5","0.5","0.5","0.5","0.5","0.5","1","1","1","1","1","1.5","1.5","1.5","1.5"],
    "statuses":["","","","","","","","","","impact","","","","","impact","","",""]},"Infernal Maelstrom":{"total":3.35,"hits":["0.5","0.5","0.5","0.5","0.5","0.5","0.5","1","1","1","1","1","1","1","1","1","1","2"],
    "statuses":["","","","","","","","","","","impact","","","","impact","","",""]}}}},{"name":"Gemini Cross","img":"GeminiCross.webp","tags":["TONFA_STANCE"],
    "type":"stance","action":{"stances":{"Vagrant Blight":{"total":4.6,"hits":["2","2","1","1","1","1","1","1","1","1","1","1","1","1","2","2","3","2"],
    "statuses":["","","","","","","","","slash","","","","","","impact","slash","",""]},"Cold Vendetta":{"total":1.2,"hits":["1","1","2"],
    "statuses":["","",""]},"Baleful Sin":{"total":2.3,"hits":["3","1","2","1","2","2","2"],
    "statuses":["","","","impact","","",""]},"Blind Tormentor":{"total":2.85,"hits":["1","1","1","1","2","2","1","1","3","3","1"],
    "statuses":["","","impact","impact","","","slash","slash","","","impact"]},"Ascendant Bane":{"total":2.2,"hits":["2","2","2","2","2","2","2","2","2","2"],
    "statuses":["impact","impact","impact","impact","impact","impact","impact","impact","impact","impact"]}}}},{"name":"Sovereign Outcast","img":"SovereignOutcast.webp","tags":["TONFA_STANCE"],
    "type":"stance","action":{"stances":{"Rogue Edict":{"total":2.85,"hits":["2","0.5","0.5","0.5","0.5","0.5","2","1","3","2","2","2","2","3","3"],
    "statuses":["","","","","","","","","impact","slash","slash","slash","slash","",""]},"Vagrant Behest":{"total":1.75,"hits":["1","1","1","1","1","1","1","1","1"],
    "statuses":["","","","","","","","",""]},"Villain Rule":{"total":3,"hits":["0.5","0.5","0.5","0.5","0.5","0.5","3","2","2","3","3","1"],
    "statuses":["","","","","","","","","","","","impact"]},"Scout Command":{"total":1.25,"hits":["4","2","3"],
    "statuses":["impact","",""]},"Ascendant Bane":{"total":2.2,"hits":["2","2","2","2","2","2","2","2","2","2"],
    "statuses":["impact","impact","impact","impact","impact","impact","impact","impact","impact","impact"]}}}},{"name":"Burning Wasp","img":"BurningWasp.webp","tags":["WHIPS_STANCE"],
    "type":"stance","action":{"stances":{"Sparking Torture":{"total":1.9,"hits":["3","3"],
    "statuses":["","impact"]},"Buzzing Sting":{"total":3,"hits":["1","1","1","2"],
    "statuses":["","","",""]},"Guided Claw":{"total":1.8,"hits":["3","3"],
    "statuses":["impact",""]}}}},{"name":"Coiling Viper","img":"CoilingViper.webp","tags":["WHIPS_STANCE"],
    "type":"stance","action":{"stances":{"Whistling Wind":{"total":2.7,"hits":["1","2","2","1","4"],
    "statuses":["","","","impact",""]},"Tumbling King":{"total":2.3,"hits":["2","3"],
    "statuses":["impact",""]}}}},{"name":"Malicious Raptor","img":"MaliciousRaptor.webp","tags":["CLAWS_STANCE"],
    "type":"stance","action":{"stances":{"Jagged Gash":{"total":3.35,"hits":["1","2","2","1","1","1","1","3","1","2","4"],
    "statuses":["","","slash","","","","","slash","","",""]},"Wicked Slash":{"total":1.8,"hits":["1","2","2","1","1","2"],
    "statuses":["","","","","",""]},"Lethal Clash":{"total":3.7,"hits":["2","1","1","3","1"],
    "statuses":["","","slash","","","","",""]},"Venging Thrash":{"total":2.95,"hits":["2","2","3","2","3"],
    "statuses":["","","","slash",""]}}}},{"name":"Four Riders","img":"FourRiders.webp","tags":["CLAWS_STANCE"],
    "type":"stance","action":{"stances":{"Aggravated Swarm":{"total":2.3,"hits":["3","2","2","2","4"],
    "statuses":["","","impact","",""]},"Hungering Encroachment":{"total":1.7,"hits":["1","2","1","1","2"],
    "statuses":["","","","",""]},"Raging Conflict":{"total":3,"hits":["1","1","2","2","2","2","1","4"],
    "statuses":["","","","impact","","slash","",""]},"Eternal Fall":{"total":2.1,"hits":["2","3","3","4","4"],
    "statuses":["","","impact","",""]}}}},{"name":"Vermillion Storm","img":"VermillionStorm.webp","tags":["CLAWS_STANCE"],
    "type":"stance","action":{"stances":{"Flurry Rose":{"total":3.95,"hits":["3","3","1","3","1","1","1","1","2","4","3","3"],
    "statuses":["","","","","","","slash","slash","","","",""]},"Crimson Hurricane":{"total":1.9,"hits":["1","2","1","1","1","2","1"],
    "statuses":["","","","","","",""]},"Cardinal Breeze":{"total":3.4,"hits":["1","1","1","0.5","0.5","0.5","1","1","1","0.5","0.5","0.5","0.5","0.5","0.5","2"],
    "statuses":["","","","","","","","","","","","","","","","impact"]},"Ruby Wind":{"total":2.5,"hits":["3","1","2","1","2","3","1"],
    "statuses":["impact","","","","","",""]}}}},{"name":"Ravenous Wraith","img":"RavenousWraith.webp","tags":["SHADOW_CLAWS_STANCE"],
    "type":"stance","action":{"stances":{"Cleaving Claws":{"total":3.4,"hits":["3","2","2","2","1","2","3"],
    "statuses":["impact","","slash","slash","impact","slash",""]},"Soul Thresher":{"total":2.9,"hits":["1","1","1","1","1"],
    "statuses":["","","impact","impact","impact"]},"Void Torrent":{"total":3.85,"hits":["1","1","1","1"],
    "statuses":["","","","",""]}}}},{"name":"Gnashing Payara","img":"GnashingPayara.webp","tags":["DUAL_DAGGERS_STANCE"],
    "type":"stance","action":{"stances":{"Pincer Strike":{"total":2.5,"hits":["3","3","2","2","4"],
    "statuses":["","","slash","slash",""]},"Cheetah's Guile":{"total":1.15,"hits":["1","1","1","2"],
    "statuses":["","","",""]},"Flash Flurry":{"total":1.55,"hits":["3","3","3","2"],
    "statuses":["impact","impact","",""]}}}},{"name":"Spinning Needle","img":"SpinningNeedle.webp","tags":["DUAL_DAGGERS_STANCE"],
    "type":"stance","action":{"stances":{"True Kiss":{"total":1.85,"hits":["3","2","2","4"],
    "statuses":["","slash","slash",""]},"Accursed Whispers":{"total":2.15,"hits":["1","1","1","2","1","1","1","1","1","3"],
    "statuses":["","","","","","","","","",""]},"Fey Intervention":{"total":2.5,"hits":["2","2","2","2","3","3","3","2"],
    "statuses":["impact","impact","slash","","","","",""]},"Fey Intervention (Block)":{"total":1.1,"hits":["1","2","4"],
    "statuses":["","",""]}}}},{"name":"Sinking Talon","img":"SinkingTalon.webp","tags":["DUAL_DAGGERS_STANCE"],
    "type":"stance","action":{"stances":{"Lashing Panther":{"total":1.15,"hits":["1","1","1","1"],
    "statuses":["","","",""]},"Rising Lion":{"total":3.05,"hits":["2","2","1","1","3","1","1","1"],
    "statuses":["impact","impact","","","slash","","","impact"]},"Fey Intervention":{"total":2.5,"hits":["2","2","2","2","3","3","3","2"],
    "statuses":["impact","impact","slash","","","","",""]},"Fey Intervention (Block)":{"total":1.1,"hits":["1","2","4"],
    "statuses":["","",""]}}}},{"name":"Exalted Blade","img":"ExaltedBladeStance.webp","tags":["EXALTED_BLADE_STANCE"],
    "type":"stance","action":{"stances":{"Cutting Poise":{"total":2.85,"hits":["3","3","3","1","2","1","1","1","3","3"],
    "statuses":["","","","","","","","","",""]},"Lancing Justice":{"total":1.35,"hits":["1","1","1","1","1","1","1","1"],
    "statuses":["","","","","","","",""]},"Virtuous Slash":{"total":2.3,"hits":["2","1","1","1","1","2","2","2"],
    "statuses":["","impact","","impact","","impact","","impact"]},"Equal Laceration":{"total":2.65,"hits":["3","2","2","3","3","2"],
    "statuses":["","","","","",""]}}}},{"name":"Hysteria","img":"Hysteria.webp","tags":["HYSTERIA_STANCE"],
    "type":"stance","action":{"stances":{"Fervor":{"total":4.55,"hits":["1","1","2","2","2","2","3","3","3"],
    "statuses":["","","","","","","slash","",""]},"Rage":{"total":2.7,"hits":["1","2","2","3"],
    "statuses":["","","","slash"]},"Madness":{"total":5.65,"hits":["1","1.5","1.5","1.5","1.5","1.5","2","2","2.5","2.5","2.5","3","3","3"],
    "statuses":["","","","","","","","","","","","","",""]},"Delirium":{"total":3.7,"hits":["3","3","3","2.5","2.5","2.5","3","3","3"],
    "statuses":["","slash","","","","","","impact",""]}}}},{"name":"Serene Storm","img":"SereneStorm.webp","tags":["DESERT_WIND_STANCE"],
    "type":"stance","action":{"stances":{"Trespass Denied":{"total":3.5,"hits":["1","1","1","1","1","1","1","1","1","1"],
    "statuses":["","","","","","","","","",""]},"Father's Lesson":{"total":2.5,"hits":["1","1","1","1","1","1"],
    "statuses":["","","","","",""]},"Final Sunrise":{"total":3.15,"hits":["1","1","1","1","1","1","1","1","1"],
    "statuses":["","","","","","","","",""]},"Patience Shattered":{"total":4.1,"hits":["1","1","1","1","1","1","1","1","1","1","1","1","1"],
    "statuses":["","","","","","","","","","","","",""]}}}},{"name":"Primal Fury","img":"PrimalFury.webp","tags":["IRON_STAFF_STANCE"],
    "type":"stance","action":{"stances":{"Falling Oak Buster":{"total":3.2,"hits":["1","1","1","1","4","1","1","1","3","1","1"],
    "statuses":["","","","","impact","impact","impact","","","",""]},"Spinning Crash Technique":{"total":2.8,"hits":["1","1","1","1","1","1","4","1"],
    "statuses":["","","","","","","",""]},"Cyclone Lightning Strike":{"total":1.9,"hits":["2","3"],
    "statuses":["impact",""]},"Rolling Boulder Rush":{"total":3.95,"hits":["1","1","1","3","1","1","2","1","3","1","1","1","2","1"],
    "statuses":["impact","impact","impact","impact","impact","","","","impact","","","","",""]}}}},{"name":"Mountain's Edge","img":"MountainsEdge.webp","tags":["DUAL_KATANAS_STANCE"],
    "type":"stance","action":{"stances":{"Rise and Fall":{"total":2.8,"hits":["3","3","3","3","3","3","3"],
    "statuses":["","","","","","",""]},"Loyal Blades":{"total":2.7,"hits":["1","1","1","1","1","1","1","1.5","1.5"],
    "statuses":["","","","","","","","",""]},"Steel Eclipse":{"total":3.9,"hits":["2","2","2","2","2","2","2","2","3","3"],
    "statuses":["","","","","","","","","",""]}}}},{"name":"Harrowing Spire","img":"HarrowingSpire.webp","tags":["BAYONET_STANCE"],
    "type":"stance","action":{"stances":{"Rennen":{"total":2,"hits":["2","2","2","1"],
    "statuses":["","","","puncture"]},"Piercing Advance":{"total":2,"hits":["1","1","1","3","2"],
    "statuses":["","puncture","puncture","puncture","puncture"]},"Relentless Onset":{"total":2,"hits":["2","3","2","3","3"],
    "statuses":["puncture","puncture","puncture","puncture",""]}}}},{"name":"Blade Storm","img":"BladeStorm.webp","tags":["ASH_STANCE"],
    "type":"stance","action":{"stances":{"Default":{"total":1,"hits":["1"],
    "statuses":[""]}}}},{"name":"Razorwing","img":"Razorwing.webp","tags":["TITANIA_STANCE"],
    "type":"stance","action":{"stances":{"Default":{"total":1,"hits":["1"],
    "statuses":[""]}}}},{"name":"Cascadia Overcharge","img":"CascadiaOvercharge.webp","tags":["secondary"],
    "type":"weapon_mist","info":"While Overshields Active +300% Critical Chance","action":{"WITH_COND":{"crit_chance":3}}},{"name":"Cascadia Flare","img":"CascadiaFlare.webp","tags":["secondary"],
    "type":"weapon_mist","info":"On Heat Status Effect +12% Damage for 10s. Stacks up to 480%","action":{"WITH_COND":{"base":4.8}}},{"name":"Secondary Merciless","img":"SecondaryMerciless.webp","tags":["secondary"],
    "type":"weapon_mist","info":"On Kill/Passive +30% Damage for 4s. Stacks up to 12x. +30% Reload Speed","action":{"WITH_COND":{"base":3.6,"reloadTime":0.3,"charge_time":0.3}}},{"name":"Secondary Dexterity","img":"SecondaryDexterity.webp","tags":["secondary"],
    "type":"weapon_mist","info":"On Melee Kill/Passive +60% Damage for 20s. Stacks up to 6x. +7.5s Combo Duration","action":{"WITH_COND":{"base":3.6,"comboDuration":7.5}}},{"name":"Secondary Deadhead","img":"SecondaryDeadhead.webp","tags":["secondary"],
    "type":"weapon_mist","info":"On Precision Headshot Kill/Passive +120% Damage for 24s. Stacks up to 3x. +30% to Headshot Multiplier. -50% Weapon Recoil","action":{"WITH_COND":{"base":3.6,"mult_for_head":0.3}}},{"name":"Secondary Encumber","img":"SecondaryEncumber.webp","tags":["secondary"],
    "type":"weapon_mist","info":"On Status Effect +24% chance to trigger a second random Status Effect.","action":{"random_status_after_status":0.24}},{"name":"Secondary Shiver","img":"SecondaryShiver.webp","tags":["secondary"],
    "type":"weapon_mist","info":"Enemies take +45% damage per Cold Status","action":{"WITH_COND":{"base_per_cold":4.5}}},{"name":"Secondary Enervate","img":"SecondaryEnervate.webp","tags":["secondary"],
    "type":"weapon_mist","info":"On Hit: Increase Critical Chance by 10%. Resets after 6 Big Critical Hits.","action":{"incr_CC_by_hit_with_reset6tier2":0.1}},{"name":"Melee Doughty","img":"MeleeDoughty.webp","tags":["melee"],
    "type":"weapon_mist","info":"Gain 1.0x Critical Multiplier for every 10% Puncture Status chance on your Melee Weapon.","action":{"incr_CM_by_punc_status":1}},{"name":"Primary Deadhead","img":"PrimaryDeadhead.webp","tags":["primary"],
    "type":"weapon_mist","info":"On Precision Headshot Kill/Passive +120% Damage for 24s. Stacks up to 3x. +30% to Headshot Multiplier, -50% Weapon Recoil","action":{"WITH_COND":{"base":3.6,"mult_for_head":0.3}}},{"name":"Primary Dexterity","img":"PrimaryDexterity.webp","tags":["primary"],
    "type":"weapon_mist","info":"On Melee Kill/Passive +60% Damage for 20s. Stacks up to 6x. +7.5s Combo Duration","action":{"WITH_COND":{"base":3.6,"comboDuration":7.5}}},{"name":"Primary Merciless","img":"PrimaryMerciless.webp","tags":["primary"],
    "type":"weapon_mist","info":"On Kill/Passive +30% Damage for 4s. Stacks up to 12x. +30% Reload Speed","action":{"WITH_COND":{"base":3.6,"reloadTime":0.3,"charge_time":0.3}}},{"name":"Primary Frostbite","img":"PrimaryFrostbite.webp","tags":["primary"],
    "type":"weapon_mist","info":"On Cold Status Effect +3% Critical Damage and +2.25% Multishot for 12s. Stacks up to 40x","action":{"WITH_COND":{"crit_mult":1.2,"multishot":0.9}}},{"name":"Primary Debilitate","img":"PrimaryDebilitate.webp","tags":["primary"],
    "type":"weapon_mist","info":"If an enemy has 10 stacks of a combined Status Effect, inflicting the same Status Effect again has a 100% chance to inflict one of the base Status Effects it is composed of.","action":{"debilitate":1}},{"name":"Primary Bulwark","img":"PrimaryBulwark.webp","tags":["primary"],
    "type":"weapon_mist","info":"Gain +1% damage for each unit of armor past 1,000, up to a max of +500%.","action":{"WITH_COND":{"base":5}}},{"name":"Primary Overcharge","img":"PrimaryOvercharge.webp","tags":["primary"],
    "type":"weapon_mist","info":"While at or above 90% Energy: Gain 35% of Max Energy as Multishot, capped at 350%.","action":{"WITH_COND":{"multishot":3.5}}},{"name":"Primary Crux","img":"PrimaryCrux.webp","tags":["primary"],
    "type":"weapon_mist","info":"Gain +30% Status Chance and +6% Ammo Efficiency for 10s. Stacks up to 10x.","action":{"WITH_COND":{"status_chance":3,"ammoEff":0.6}}},{"name":"Primary Plated Round","img":"PrimaryPlatedRound.webp","tags":["primary"],
    "type":"weapon_mist","info":"On Reload: Deal increased damage per round loaded based on max magazine size. Lasts for 10s.","action":{"WITH_COND":{"base_per_magasize":1}}},{"name":"Longbow Sharpshot","img":"LongbowSharpshot.webp","tags":["primary-bow"],
    "uncomptag":["CROSSBOW"],
    "type":"weapon_mist","info":"On Headshot Gain +300% damage on your next shot.","action":{"WITH_COND":{"multSharpshot":3}}},{"name":"Fractalized Reset","img":"FractalizedReset.webp","tags":["primary"],
    "type":"weapon_mist","info":"On Ability Cast +240% Reload Speed for 5s.","action":{"WITH_COND":{"reloadTime":2.4,"charge_time":2.4}}},{"name":"Shotgun Vendetta","img":"ShotgunVendetta.webp","tags":["primary-shotgun"],
    "type":"weapon_mist","info":"On shotgun kill within 5 meters +180% Multishot and +75% Reload Speed for 15s.","action":{"WITH_COND":{"multishot":1.8,"reloadTime":0.75,"charge_time":0.75}}},{"name":"Primary Blight","img":"PrimaryBlight.webp","tags":["primary"],
    "type":"weapon_mist","info":"On Toxin Status Effect +3.6% Critical Damage and +1.8% Multishot for 12s. Stacks up to 40x.","action":{"WITH_COND":{"crit_mult":1.44,"multishot":0.72}}},{"name":"Melee Retaliation","img":"MeleeRetaliation.webp","tags":["melee"],
    "type":"weapon_mist","info":"Gain 30% Melee Damage for every 200 current Shields, up to 420% Bonus halved for Overshields.","action":{"WITH_COND":{"base":4.2}}},{"name":"Melee Influence","img":"MeleeInfluence.webp","tags":["melee"],
    "type":"weapon_mist","info":"On Melee Electricity Status 20% chance for elemental Melee Status Effects to apply to enemies within 20m for 18s.","action":{"mInfluence":1}},{"name":"Melee Careen","img":"MeleeCareen.webp","tags":["melee"],
    "type":"weapon_mist","info":"x2.50 Melee Damage against Frozen enemies. On Roll:  Freeze enemies in a 5.5m radius with a 2s Cooldown.","action":{"dmgMultAgainstFrozen":1.5}},{"name":"Melee Vortex","img":"MeleeVortex.webp","tags":["melee"],
    "type":"weapon_mist","info":"Kill an enemy affected by Magnetic Status for a 45% chance to pull in enemies within 18m radius","action":{"na":1}},{"name":"Melee Duplicate","img":"MeleeDuplicate.webp","tags":["melee"],
    "type":"weapon_mist","info":"On Base Critical Hits: 100% chance for your attack to strike a second time","action":{"mDuplicate":1}},{"name":"Akimbo Slip Shot","img":"AkimboSlipShot.webp","tags":["dual-pistols"],
    "type":"weapon_mist","info":"While sliding or aim gliding Gain 65% ammo efficiency with Dual Pistols.","action":{"WITH_COND":{"ammoEff":0.65}}},{"name":"Secondary Outburst","img":"SecondaryOutburst.webp","tags":["secondary"],
    "type":"weapon_mist","info":"On swapping to Secondary Weapon Consume all Combo Multipliers to increase Secondary Weapon Critical Chance and Critical Damage by 20% per Combo consumed for 30s.","action":{"WITH_COND":{"crit_mult":2.4,"crit_chance":2.4}}},{"name":"Secondary Fortifier","img":"SecondaryFortifier.webp","tags":["secondary"],
    "type":"weapon_mist","info":"Deals x8 Extra Damage to Overguard. Gain 1 Overguard for every 100 Damage dealt to an enemy's Overguard.","action":{"WITH_COND":{"mult_overguard":8}}},{"name":"Secondary Irradiate","img":"SecondaryIrradiate.webp","tags":["secondary"],
    "type":"weapon_mist","info":"On hitting enemies afflicted by 10 stacks of Radiation: Deal 180% of the hit damage to enemies within 7m.","action":{"WITH_COND":{"on10RadiationAOEDmg":1.8}}},{"name":"Secondary Surge","img":"SecondarySurge.webp","tags":["secondary"],
    "type":"weapon_mist","info":"On Ability Cast: Next shot gains a Damage Multiplier for every 200 current Energy, up to x8.","action":{"WITH_COND":{"multiple":8}}},{"name":"Secondary Kinship","img":"SecondaryKinship.webp","tags":["secondary"],
    "type":"weapon_mist","info":"While Buffing Ally Warframes: +20% Critical Chance per buff","action":{"WITH_COND":{"crit_chance":4}}},{"name":"Conjunction Voltage","img":"ConjunctionVoltage.webp","tags":["secondary"],
    "type":"weapon_mist","info":"On Electricity Status Effect: Increase +1.5% Reload Speed and +3% Multishot for 12s. Stacks up to 40x.","action":{"WITH_COND":{"reloadTime":0.6,"multishot":1.2}}},{"name":"Melee Crescendo","img":"MeleeCrescendo.webp","tags":["melee"],
    "type":"weapon_mist","info":"On Finisher Kill Gain 6 Initial Combo for the rest of you mission","action":{"WITH_COND":{"initialCombo":220}}},{"name":"Melee Exposure","img":"MeleeExposure.webp","tags":["melee"],
    "type":"weapon_mist","info":"On Ability Cast Gain 60% Corrosive Damage on Melee strikes for 25s. Stacks up to 240%.","action":{"addCorrosive":2.4}},{"name":"Ready Steel","img":"ReadySteel.webp","tags":["melee"],
    "type":"aura_mod","action":{"initialCombo":24}},{"name":"Rifle Amp","img":"RifleAmp.webp","tags":["primary-rifle","primary-bow","primary-sniper","primary-archgun"],
    "type":"aura_mod","action":{"base":0.27}},{"name":"Worthy Comradery","img":"WorthyComradery.webp","tags":["primary","secondary","melee","primary-archgun"],
    "type":"aura_mod","action":{"WITH_COND":{"crit_chance_weakp":0.75}}},{"name":"Pistol Amp","img":"PistolAmp.webp","tags":["secondary","primary-archgun"],
    "type":"aura_mod","action":{"base":0.27}},{"name":"Steel Charge","img":"SteelCharge.webp","tags":["melee"],
    "type":"aura_mod","action":{"base":0.6}},{"name":"Shotgun Amp","img":"ShotgunAmp.webp","tags":["primary-shotgun","primary-archgun"],
    "type":"aura_mod","action":{"base":0.18}},{"name":"Dead Eye","img":"DeadEye.webp","tags":["primary-sniper","primary-archgun"],
    "type":"aura_mod","action":{"base":0.525}},{"name":"Holster Amp","img":"SpeedHolster.webp","tags":["primary","secondary","primary-archgun"],
    "type":"aura_mod","action":{"WITH_COND":{"base":0.6}}},{"name":"Swift Momentum","img":"SwiftMomentum.webp","tags":["melee","primary-archgun"],
    "type":"aura_mod","action":{"windUp":0.3,"comboDuration":6}},{"name":"Corrosive Projection","img":"CorrosiveProjection.webp","tags":["primary","secondary","melee","primary-archgun"],
    "type":"aura_mod","action":{"armor":0.18}},{"name":"Mecha Empowered","img":"MechaEmpowered.webp","tags":["primary","secondary","melee","primary-archgun"],
    "type":"aura_mod","action":{"dbl_mult":1.5}},{"name":"Empowered Blades","img":"EmpoweredBlades.webp","tags":["melee"],
    "type":"aura_mod","action":{"h_status_chance":0.6,"h_status_damage":0.6}},{"name":"Sentient Incision","img":"SentientIncision.webp","tags":["VENATO"],
    "action":{"add_weakness_dmg":1.2}},{"name":"Reactive Storm","img":"ReactiveStorm.webp","tags":["BARUUK"],
    "type":"frame_mod","action":{"unique":"baruuk","status_chance":2.5}},{"name":"Chromatic Blade","img":"ChromaticBlade.webp","tags":["EXCALIBUR"],
    "type":"frame_mod","action":{"unique":"excalibur","status_chance":3}},{"name":"Venom Dose","img":"VenomDose.webp","tags":["primary","secondary","melee","primary-archgun"],
    "type":"frame_mod","action":{"addCorrosiveS":1}},{"name":"Shock Trooper","img":"ShockTrooper.webp","tags":["primary","secondary","melee","primary-archgun"],
    "type":"frame_mod","action":{"addElectricityNotCombinedScaledByStrength":1,"electricity_scaledByStrength":1}},{"name":"Freeze Force","img":"FreezeForce.webp","tags":["primary","secondary","melee","primary-archgun"],
    "type":"frame_mod","action":{"addColdNotCombinedScaledByStrength":1}},{"name":"Fireball Frenzy","img":"FireballFrenzy.webp","tags":["primary","secondary","melee","primary-archgun"],
    "type":"frame_mod","action":{"addHeatNotCombinedScaledByStrength":1,"heat_scaledByStrength":1}},{"name":"Thermal Transfer","img":"ThermalTransfer.webp","tags":["primary","secondary","melee","primary-archgun"],
    "uncomptag":["POWER_WEAPON"],
    "type":"frame_mod","action":{"addBlastS":0.75}},{"name":"Smite Infusion","img":"SmiteInfusion.webp","tags":["primary","secondary","melee","primary-archgun"],
    "type":"frame_mod","action":{"addRadiationS":1}},{"name":"Enraged","img":"Enraged.webp","tags":["primary","secondary","melee","primary-archgun"],
    "type":"frame_mod","action":{"base":2,"crit_chance":2}},{"name":"Merulina Guardian","img":"MerulinaGuardian.webp","tags":["secondary","primary-archgun"],
    "type":"frame_mod","action":{"reloadTime":2,"speed":2}},{"name":"Champion's Blessing","img":"ChampionsBlessing.webp","tags":["primary","secondary","primary-archgun"],
    "type":"frame_mod","action":{"crit_chance":3.5}},{"name":"Gladiator Aegis","img":"GladiatorAegis.webp","tags":["melee"],
    "type":"frame_mod","action":{"WITH_COND":{"crit_chance_per_combo":0.1}}},{"name":"Gladiator Resolve","img":"GladiatorResolve.webp","tags":["melee"],
    "type":"frame_mod","action":{"WITH_COND":{"crit_chance_per_combo":0.1}}},{"name":"Gladiator Finesse","img":"GladiatorFinesse.webp","tags":["melee"],
    "type":"frame_mod","action":{"WITH_COND":{"crit_chance_per_combo":0.1}}},{"name":"Nira's Anguish","img":"NirasAnguish.webp","tags":["melee"],
    "type":"frame_mod","action":{"slam_mult":1.5}},{"name":"Nira's Hatred","img":"NirasHatred.webp","tags":["melee"],
    "type":"frame_mod","action":{"slam_mult":1.5}},{"name":"Tek Collateral","img":"TekCollateral.webp","tags":["primary","secondary","melee","primary-archgun"],
    "type":"frame_mod","action":{"WITH_COND":{"crit_mult":1}}},{"name":"Vigorous Swap","img":"VigorousSwap.webp","tags":["primary","secondary","primary-archgun"],
    "type":"frame_mod","action":{"WITH_COND":{"base":1.65}}},{"name":"Vigilante Pursuit","img":"VigilantePursuit.webp","tags":["primary","primary-archgun"],
    "type":"frame_mod","action":{"double_crit":0.05}},{"name":"Vigilante Vigor","img":"VigilanteVigor.webp","tags":["primary","primary-archgun"],
    "type":"frame_mod","action":{"double_crit":0.05}},{"name":"Smoke Shadow","img":"SmokeShadow.webp","tags":["primary","secondary","melee","primary-archgun"],
    "uncomp":["Biting Frost"],
    "type":"frame_mod","action":{"WITH_COND":{"crit_chance":1.5}}},{"name":"Biting Frost","img":"BitingFrost.webp","tags":["primary","secondary","melee","primary-archgun"],
    "type":"frame_mod","uncomp":["Smoke Shadow"],
    "action":{"WITH_COND":{"crit_chance":2,"crit_mult":2}}},{"name":"Reinforced Bond","img":"ReinforcedBond.webp","tags":["primary","secondary","primary-archgun"],
    "type":"frame_mod","action":{"WITH_COND":{"speed":0.6}}},{"name":"Tenacious Bond","img":"TenaciousBond.webp","tags":["primary","secondary","melee","primary-archgun"],
    "type":"frame_mod","action":{"WITH_COND":{"crit_mult_add":1.2}}},{"name":"Arcane Pistoleer","img":"ArcanePistoleer.webp","tags":["primary","secondary"],
    "type":"frame_mist","info":"On Pistol Headshot Kill 60% chance for +102% Ammo Efficiency for 12s","action":{"WITH_COND":{"ammoEff":1}}},{"name":"Arcane Rise","img":"ArcaneRise.webp","tags":["primary"],
    "type":"frame_mist","info":"On Reload 60% chance for +150% Damage to Primary Weapons for 24s","action":{"WITH_COND":{"base":1.5}}},{"name":"Arcane Rage","img":"ArcaneRage.webp","tags":["primary"],
    "type":"frame_mist","info":"On Headshot 15% chance for +180% Damage to Primary Weapons for 24s","action":{"WITH_COND":{"base":1.8}}},{"name":"Arcane Awakening","img":"ArcaneAwakening.webp","tags":["secondary"],
    "type":"frame_mist","info":"On Reload 60% chance for +150% Damage to Pistols for 24s","action":{"WITH_COND":{"base":1.5}}},{"name":"Arcane Strike","img":"ArcaneStrike.webp","tags":["melee"],
    "type":"frame_mist","info":"On Hit 15% chance for +60% Attack Speed to Melee Weapons for 18s","action":{"WITH_COND":{"speed":0.6}}},{"name":"Arcane Acceleration","img":"ArcaneAcceleration.webp","tags":["primary-rifle","primary-bow","primary-sniper"],
    "type":"frame_mist","info":"On Critical Hit 30% chance for +90% Fire Rate to Primary Weapons for 9s","action":{"WITH_COND":{"speed":0.9}}},{"name":"Arcane Velocity","img":"ArcaneVelocity.webp","tags":["secondary"],
    "type":"frame_mist","info":"On Critical Hit 90% chance for +120% Fire Rate to Pistols for 9s","action":{"WITH_COND":{"speed":1.2}}},{"name":"Arcane Tempo","img":"ArcaneTempo.webp","tags":["primary-shotgun"],
    "type":"frame_mist","info":"On Critical Hit 15% chance for +90% Fire Rate to Shotguns for 12s","action":{"WITH_COND":{"speed":0.9}}},{"name":"Arcane Momentum","img":"ArcaneMomentum.webp","tags":["primary-sniper"],
    "type":"frame_mist","info":"On Critical Hit 60% chance for +150% Reload Speed to Sniper Rifles for 12s","action":{"WITH_COND":{"reloadTime":1.5,"charge_time":1.5}}},{"name":"Arcane Avenger","img":"ArcaneAvenger.webp","tags":["primary","melee","secondary"],
    "type":"frame_mist","info":"On Damaged 21% chance for +45% Critical Chance for 12s","action":{"WITH_COND":{"flat_crit_chance":0.45}}},{"name":"Arcane Precision","img":"ArcanePrecision.webp","tags":["secondary"],
    "type":"frame_mist","info":"On Headshot +300% Damage for 18s on Secondary Weapon","action":{"WITH_COND":{"base":3}}},{"name":"Cascadia Empowered","img":"CascadiaEmpowered.webp","tags":["secondary"],
    "type":"weapon_mist","info":"On Status Effect: Deals an extra +750 damage matching the damage type of the Status Effect.","action":{"dmgOnStatusEff":750}},{"name":"Arcane Arachne","img":"ArcaneArachne.webp","tags":["primary","secondary","melee"],
    "type":"frame_mist","info":"On Wall Latch +150% Damage for 30s","action":{"WITH_COND":{"base":1.5}}},{"name":"Arcane Crepuscular","img":"ArcaneCrepuscular.webp","tags":["primary","secondary","melee"],
    "type":"frame_mist","info":"While invisible, gain +30% Ability Strength and +3x Final Critical Multiplier.","action":{"WITH_COND":{"crit_mult_add":3}}},{"name":"Arcane Hot Shot","img":"ArcaneHotShot.webp","tags":["primary","secondary","melee"],
    "type":"frame_mist","info":"Increases Critical Chance by 6% (max stacks 50) for 10 seconds when using abilities to inflict Heat Status on enemies.","action":{"WITH_COND":{"crit_chance":3}}},{"name":"Arcane Fury","img":"ArcaneFury.webp","tags":["melee"],
    "type":"frame_mist","info":"On Critical Hit 60% chance for +180% Melee Damage to Melee Weapons for 18s","action":{"WITH_COND":{"base":1.8}}},{"name":"Arcane Blade Charger","img":"ArcaneBladeCharger.webp","tags":["melee"],
    "type":"frame_mist","info":"On Primary Weapon Kill 30% chance for +300% Melee Damage for 12s","action":{"WITH_COND":{"base":3}}},{"name":"Arcane Primary Charger","img":"ArcanePrimaryCharger.webp","tags":["primary"],
    "type":"frame_mist","info":"On Melee Kill 30% chance for +300% Primary Weapon Damage for 12s","action":{"WITH_COND":{"base":3}}},{"name":"Primal Rage","img":"PrimalRage.webp","tags":["IRON_STAFF_STANCE"],
    "type":"frame_mod","action":{"WITH_COND":{"crit_chance":1.5}}},{"name":"+25% Critical Damage","img":"shard-red.webp","tags":["melee"],
    "info":"+25% Melee Critical Damage","shardType":"crimson","type":"shard","action":{"crit_mult":0.25}},{"name":"+37.5% Critical Damage","img":"shard-crimson-tauforged.webp","tags":["melee"],
    "shardType":"crimson","info":"+37.5% Melee Critical Damage","type":"shard","action":{"crit_mult":0.375}},{"name":"+25% Status Chance","img":"shard-red.webp","tags":["primary","primary-archgun"],
    "shardType":"crimson","info":"+25% Primary Status Chance","type":"shard","action":{"status_chance":0.25}},{"name":"+37.5% Status Chance","img":"shard-crimson-tauforged.webp","tags":["primary","primary-archgun"],
    "shardType":"crimson","info":"+37.5% Primary Status Chance","type":"shard","action":{"status_chance":0.375}},{"name":"+25% Critical Chance","img":"shard-red.webp","tags":["secondary","primary-archgun"],
    "shardType":"crimson","info":"+25% Secondary Critical Chance","type":"shard","action":{"crit_chance":0.25}},{"name":"+37.5% Critical Chance","img":"shard-crimson-tauforged.webp","tags":["secondary","primary-archgun"],
    "shardType":"crimson","info":"+37.5% Secondary Critical Chance","type":"shard","action":{"crit_chance":0.375}},{"name":"+50% Critical Chance","img":"shard-topaz.webp","tags":["secondary","primary-archgun"],
    "shardType":"topaz","info":"Increase Secondary Critical Chance by 1% every time you kill an enemy affected by Heat Status. Max 50%","type":"shard","action":{"WITH_COND":{"crit_chance":0.5}}},{"name":"+75% Critical Chance","img":"shard-topaz-tauforged.webp","tags":["secondary","primary-archgun"],
    "shardType":"topaz","info":"Increase Secondary Critical Chance by 1.5% every time you kill an enemy affected by Heat Status. Max 75%","type":"shard","action":{"WITH_COND":{"crit_chance":0.75}}},{"name":"+50% Critical Damage","img":"shard-violet.webp","tags":["melee"],
    "shardType":"violet","info":"+50% Melee Critical Damage.","type":"shard","action":{"crit_mult":0.5}},{"name":"+75% Critical Damage","img":"shard-violet-tauforged.webp","tags":["melee"],
    "shardType":"violet","info":"+75% Melee Critical Damage.","type":"shard","action":{"crit_mult":0.75}},{"name":"Incr. max stacks of Corrosion +2","img":"shard-emerald.webp","tags":["primary","secondary","melee","primary-archgun"],
    "shardType":"emerald","info":"Increase max stacks of Corrosion Status by +2","type":"shard","action":{"incMaxStacks_Corrosion":2}},{"name":"Incr. max stacks of Corrosion +3","img":"shard-emerald-tauforged.webp","tags":["primary","secondary","melee","primary-archgun"],
    "shardType":"emerald","info":"Increase max stacks of Corrosion Status by +3","type":"shard","action":{"incMaxStacks_Corrosion":3}},{"name":"Toxin Status +30% more damage","img":"shard-emerald.webp","tags":["primary","secondary","melee","primary-archgun"],
    "shardType":"emerald","type":"shard","info":"Toxin Status Effects deal +30% more damage","action":{"status_damage_toxin":0.3}},{"name":"Toxin Status +45% more damage","img":"shard-emerald-tauforged.webp","tags":["primary","secondary","melee","primary-archgun"],
    "shardType":"emerald","type":"shard","info":"Toxin Status Effects deal +45% more damage","action":{"status_damage_toxin":0.45}},{"name":"+30% Primary Electricity Damage","img":"shard-violet.webp","tags":["primary","primary-archgun"],
    "shardType":"violet","type":"shard","info":"Gain +30% Primary Electricity Damage. Gain an additional +10% per Crimson, Azure, or Violet Archon Shard equipped","action":{"electricityBonus":0.1,"element":{"Electricity":0.3}}},{"name":"+45% Primary Electricity Damage","img":"shard-violet-tauforged.webp","tags":["primary","primary-archgun"],
    "shardType":"violet","type":"shard","info":"Gain +45% Primary Electricity Damage. Gain an additional +15% per Crimson, Azure, or Violet Archon Shard equipped","action":{"electricityBonus":0.15,"element":{"Electricity":0.45}}},{"name":"+10% Ability Damage affected by Electricity","img":"shard-violet.webp","tags":["POWER_WEAPON"],
    "shardType":"violet","type":"shard","info":"Gain +10% Ability Damage on enemies affected by Electricity Status","action":{"electricityShardAbilityDmg":0.1}},{"name":"+15% Ability Damage affected by Electricity","img":"shard-violet-tauforged.webp","tags":["POWER_WEAPON"],
    "shardType":"violet","type":"shard","info":"Gain +15% Ability Damage on enemies affected by Electricity Status","action":{"electricityShardAbilityDmg":0.15}},{"name":"Archon Continuity","img":"ArchonContinuity.webp","tags":["POWER_WEAPON"],
    "type":"frame_mod","action":{"corrosive_by_toxin":1}},{"name":"Archon Vitality","img":"ArchonVitality.webp","tags":["POWER_WEAPON"],
    "type":"frame_mod","action":{"archon_vitality":1}}],

  // === 敌人数据 (495个) ===
  enemies: {"002-ER":{"faction":"Corpus","health":1000,"armor":50,"shield":2500,"localeName":"002-ER","lFactionName":"Corpus"},"Aerial Commander":{"faction":"Grineer","health":800,"armor":250,"shield":0,"localeName":"空中指挥官","lFactionName":"Grineer"},"Acolytes":{"faction":"Stalker","health":5500,"armor":50,"shield":2500,"localeName":"追随者","lFactionName":"Stalker","innateDR":{"health":0.625,"armor":0.625,"shield":0},"eximusOff":true,"unique":"acolytes","maxProcStacks":4},"Amalgam Alkonost":{"faction":"Corpus Amalgam","health":650,"armor":0,"shield":300,"localeName":"并合翠莺","lFactionName":"Corpus Amalgam","immun":{"status":["all"]},"unique":"amalgam"},"Amalgam Cinder Machinist":{"faction":"Sentient","health":1500,"armor":0,"shield":1200,"localeName":"并合熔渣机械师","lFactionName":"Sentient","unique":"sentient"},"Amalgam Arca Kucumatz":{"faction":"Sentient","health":1500,"armor":0,"shield":400,"localeName":"并合弧电羽蛇","lFactionName":"Sentient","unique":"sentient"},"Aerolyst":{"faction":"Sentient","health":2000,"armor":75,"shield":0,"localeName":"空飞使","lFactionName":"Sentient","eximusOff":true,"unique":"sentient"},"Amalgam Arca Heqet":{"faction":"Sentient","health":700,"armor":0,"shield":1100,"localeName":"并合弧电灵蛙","lFactionName":"Sentient","unique":"sentient"},"Amalgam Heqet":{"faction":"Corpus Amalgam","health":500,"armor":0,"shield":400,"localeName":"并合灵蛙","lFactionName":"Corpus Amalgam","unique":"amalgam"},"Alad V":{"faction":"Corpus","health":900,"armor":250,"shield":1500,"localeName":"Alad V","lFactionName":"Corpus","eximusOff":true},"Amalgam Kucumatz":{"faction":"Corpus Amalgam","health":500,"armor":0,"shield":100,"localeName":"并合羽蛇","lFactionName":"Corpus Amalgam","unique":"amalgam"},"Amalgam Osprey":{"faction":"Corpus Amalgam","health":500,"armor":0,"shield":300,"localeName":"并合鱼鹰","lFactionName":"Corpus Amalgam","unique":"amalgam"},"Amalgam Phase MOA":{"faction":"Sentient","health":500,"armor":0,"shield":800,"localeName":"并合相位恐鸟","lFactionName":"Sentient","unique":"sentient"},"Amalgam Satyr":{"faction":"Corpus Amalgam","health":600,"armor":0,"shield":150,"localeName":"并合半羊兽","lFactionName":"Corpus Amalgam","unique":"amalgam"},"Amalgam Swarm Satyr":{"faction":"Sentient","health":1300,"armor":0,"shield":400,"localeName":"并合群集半羊兽","lFactionName":"Sentient","unique":"sentient"},"Ancient Disruptor":{"faction":"Infested","health":400,"armor":0,"shield":0,"localeName":"远古干扰者","lFactionName":"感染"},"Ambulas":{"faction":"Corpus","health":1100,"armor":150,"shield":500,"localeName":"Ambulas","lFactionName":"Corpus"},"Ancient Healer":{"faction":"Infested","health":400,"armor":0,"shield":0,"localeName":"远古治愈者","lFactionName":"感染"},"Deimos Ancient Healer":{"faction":"Infested Deimos","health":400,"armor":0,"shield":0,"localeName":"惊惧远古治愈者","lFactionName":"Infested Deimos"},"Angst":{"faction":"Stalker","health":5500,"armor":50,"shield":2500,"localeName":"焦虑","lFactionName":"Stalker","innateDR":{"health":0.625,"armor":0.625,"shield":0},"eximusOff":true,"unique":"acolytes","maxProcStacks":4},"Anu Mantalyst":{"faction":"Sentient","health":400,"armor":150,"shield":200,"localeName":"安努劫持使","lFactionName":"Sentient"},"Anu Pyrolyst":{"faction":"Sentient","health":1300,"armor":250,"shield":0,"localeName":"安努烈焰使","lFactionName":"Sentient","immun":{"status":["all"]}},"Anti MOA":{"faction":"Corpus","health":50,"armor":0,"shield":500,"localeName":"逆进恐鸟","lFactionName":"Corpus","immun":{"status":["heat"]},"b_lvl":15},"Arcane Machine":{"faction":"Tenno","health":2000,"armor":25,"shield":500,"localeName":"法典仪器","lFactionName":"Tenno"},"Archon Amar":{"faction":"Narmer","health":30000,"armor":25,"shield":0,"localeName":"欺谋狼主","lFactionName":"合一众","innateDR":{"status":0.5,"health":0.2,"armor":0.2},"eximusOff":true,"unique":"archon","maxProcStacks":4},"Archon Boreal":{"faction":"Narmer","health":30000,"armor":25,"shield":0,"localeName":"诡文枭主","lFactionName":"合一众","innateDR":{"status":0.5,"health":0.2,"armor":0.2},"eximusOff":true,"unique":"archon","maxProcStacks":4},"Arbitration Shield Drone":{"faction":"Arbiters of Hexis","health":35,"armor":0,"shield":50,"localeName":"仲裁者神盾无人机","lFactionName":"Arbiters of Hexis","immun":{"status":["all"]},"eximusOff":true},"Armaments Director":{"faction":"Corpus","health":1750,"armor":100,"shield":1200,"localeName":"军备主管","lFactionName":"Corpus"},"Armis Ulta":{"faction":"Corpus","health":1000,"armor":50,"shield":2500,"localeName":"Armis Ulta","lFactionName":"Corpus"},"Ashen Kuaka (Old)":{"faction":"Neutral","health":2,"armor":50,"shield":0,"localeName":"库阿卡","lFactionName":"Neutral"},"Artificer":{"faction":"Grineer","health":1500,"armor":150,"shield":0,"localeName":"技工","lFactionName":"Grineer"},"Attack Drone (Archwing Enemy)":{"faction":"Corpus","health":250,"armor":0,"shield":75,"localeName":"无人机(Corpus空战)","lFactionName":"Corpus"},"Archon Nira":{"faction":"Narmer","health":30000,"armor":25,"shield":0,"localeName":"混沌蛇主","lFactionName":"合一众","innateDR":{"status":0.5,"health":0.2,"armor":0.2},"eximusOff":true,"unique":"archon","maxProcStacks":4},"Auditor":{"faction":"Corpus","health":1000,"armor":50,"shield":2500,"localeName":"Auditor","lFactionName":"Corpus"},"Aurax Actinic":{"faction":"Corpus","health":1500,"armor":0,"shield":750,"localeName":"傲金光化者","lFactionName":"Corpus","unique":"empyrean-corpus"},"Aurax Atloc Raknoid":{"faction":"Corpus","health":300,"armor":250,"shield":150,"localeName":"傲金锁战蛛形机","lFactionName":"Corpus","innateDR":{"health":0.8,"armor":0.8,"shield":0.8},"immun":{"status":["viral","corrosive","magnetic"]},"unique":"raknoid"},"Aurax Baculus":{"faction":"Corpus","health":300,"armor":0,"shield":750,"localeName":"傲金杖兵","lFactionName":"Corpus","unique":"empyrean-corpus"},"Amalgam MOA":{"faction":"Corpus Amalgam","health":500,"armor":0,"shield":300,"localeName":"并合恐鸟","lFactionName":"Corpus Amalgam","unique":"amalgam"},"Aurax Culveri MOA":{"faction":"Corpus","health":55,"armor":0,"shield":30,"localeName":"傲金重火恐鸟","lFactionName":"Corpus"},"Azoth":{"faction":"Corpus","health":1000,"armor":50,"shield":2500,"localeName":"Azoth","lFactionName":"Corpus","eximusOff":true},"Aurax Polaris MOA":{"faction":"Corpus","health":55,"armor":0,"shield":30,"localeName":"傲金极冻恐鸟","lFactionName":"Corpus"},"Aurax Vertec":{"faction":"Corpus","health":1500,"armor":0,"shield":750,"localeName":"傲金终极者","lFactionName":"Corpus","unique":"empyrean-corpus"},"Bailiff Defector":{"faction":"Tenno","health":300,"armor":500,"shield":0,"localeName":"叛徒执法员","lFactionName":"Tenno"},"Amalgam Machinist":{"faction":"Corpus Amalgam","health":600,"armor":0,"shield":300,"localeName":"并合机械师","lFactionName":"Corpus Amalgam","innateDR":{"health":0,"armor":0,"shield":0.5},"unique":"amalgam-machinist"},"Attack Mutalist":{"faction":"Infested","health":65,"armor":0,"shield":0,"localeName":"攻击型异融体","lFactionName":"感染"},"Anu Interference Drone":{"faction":"Sentient","health":400,"armor":150,"shield":200,"localeName":"安努干扰无人机","lFactionName":"Sentient"},"Basilisk":{"faction":"Corpus","health":190,"armor":50,"shield":175,"localeName":"蛇妖战机","lFactionName":"Corpus"},"Bailiff":{"faction":"Grineer","health":700,"armor":500,"shield":0,"localeName":"执法员","lFactionName":"Grineer"},"Blite Captain":{"faction":"Grineer","health":300,"armor":750,"shield":0,"localeName":"Blite舰长","lFactionName":"Grineer"},"Bombard":{"faction":"Grineer","health":300,"armor":500,"shield":0,"localeName":"轰击者","lFactionName":"Grineer","b_lvl":4},"Kuva Bombard":{"faction":"Kuva Grineer","health":300,"armor":500,"shield":0,"localeName":"赤毒轰击者","lFactionName":"Kuva Grineer","b_lvl":4},"Attack Drone":{"faction":"Corpus","health":250,"armor":0,"shield":75,"localeName":"无人机","lFactionName":"Corpus"},"Brood Mother":{"faction":"Infested","health":700,"armor":0,"shield":0,"localeName":"病变虫母","lFactionName":"感染"},"Butcher":{"faction":"Grineer","health":50,"armor":5,"shield":0,"localeName":"屠夫","lFactionName":"Grineer"},"Kuva Butcher":{"faction":"Kuva Grineer","health":50,"armor":5,"shield":0,"localeName":"Kuva Butcher","lFactionName":"Kuva Grineer"},"Captain Vor & Lieutenant Lech Kril":{"faction":"Grineer","health":900,"armor":250,"shield":900,"localeName":"Vor上尉 & Lech Kril中尉","lFactionName":"Grineer","eximusOff":true},"Carrier (Enemy)":{"faction":"Corpus","health":100,"armor":75,"shield":100,"localeName":"母舰","lFactionName":"Corpus"},"Captain Vor":{"faction":"Grineer","health":900,"armor":250,"shield":900,"localeName":"Vor上尉","lFactionName":"Grineer","eximusOff":true},"Charger":{"faction":"Infested","health":80,"armor":0,"shield":0,"localeName":"疾冲者","lFactionName":"感染"},"Carabus":{"faction":"Grineer","health":750,"armor":0,"shield":150,"localeName":"自爆虫","lFactionName":"Grineer"},"Cinderthresh Hyena":{"faction":"Corpus","health":800,"armor":50,"shield":500,"localeName":"炉渣翻打鬣狗","lFactionName":"Corpus"},"Choralyst":{"faction":"Sentient","health":300,"armor":75,"shield":0,"localeName":"唱鸣使","lFactionName":"Sentient","eximusOff":true,"unique":"sentient"},"Condor Dropship":{"faction":"Corpus","health":1000,"armor":100,"shield":0,"localeName":"秃鹫空投艇","lFactionName":"Corpus"},"Basal Diploid":{"faction":"Infested","health":250,"armor":125,"shield":0,"localeName":"基底二倍体","lFactionName":"感染"},"Conculyst":{"faction":"Sentient","health":1150,"armor":150,"shield":0,"localeName":"震荡使","lFactionName":"Sentient","eximusOff":true,"unique":"sentient"},"Coolant Raknoid":{"faction":"Corpus","health":100,"armor":250,"shield":2000,"localeName":"冷却蛛形机","lFactionName":"Corpus"},"Corpus Cestra Target":{"faction":"Corpus","health":800,"armor":50,"shield":1200,"localeName":"Corpus 锡斯特目标","lFactionName":"Corpus","unique":"crewmans-rangers","elemRes":{"cold":0.75,"blast":0.75,"magnetic":0.75,"viral":0.75}},"Corpus Sniper Target":{"faction":"Corpus","health":1000,"armor":50,"shield":1200,"localeName":"Corpus 狙击手目标","lFactionName":"Corpus","unique":"crewmans-rangers","elemRes":{"cold":0.75,"blast":0.75,"magnetic":0.75,"viral":0.75}},"Corpus Supra Target":{"faction":"Corpus","health":800,"armor":50,"shield":1200,"localeName":"Corpus 苏普拉目标","lFactionName":"Corpus","unique":"crewmans-rangers","elemRes":{"cold":0.75,"blast":0.75,"magnetic":0.75,"viral":0.75}},"Corpus Ramsled":{"faction":"Corpus","health":250,"armor":175,"shield":200,"localeName":"Corpus 冲锋艇","lFactionName":"Corpus"},"Brachiolyst":{"faction":"Sentient","health":300,"armor":0,"shield":450,"localeName":"狂战使","lFactionName":"Sentient","eximusOff":true,"unique":"sentient","b_lvl":10},"Bursa":{"faction":"Corpus","health":1200,"armor":200,"shield":700,"localeName":"金流恐鸟","lFactionName":"Corpus"},"Boiler":{"faction":"Infested","health":1200,"armor":0,"shield":0,"localeName":"痈裂者","lFactionName":"感染"},"Corrupted Bombard":{"faction":"Orokin","health":300,"armor":500,"shield":0,"localeName":"堕落轰击者","lFactionName":"Orokin","b_lvl":4},"Corrupted Butcher":{"faction":"Orokin","health":100,"armor":5,"shield":0,"localeName":"堕落屠夫","lFactionName":"Orokin"},"Commander":{"faction":"Grineer","health":500,"armor":95,"shield":0,"localeName":"指挥官（敌人）","lFactionName":"Grineer","b_lvl":3},"Corrupted Drone":{"faction":"Orokin","health":250,"armor":0,"shield":75,"localeName":"堕落无人机","lFactionName":"Orokin","immun":{"status":["slash","impact","electricity","heat","toxin","blast"]}},"Corrupted MOA":{"faction":"Orokin","health":250,"armor":0,"shield":250,"localeName":"堕落恐鸟","lFactionName":"Orokin"},"Corrupted Heavy Gunner":{"faction":"Orokin","health":700,"armor":500,"shield":0,"localeName":"堕落重型机枪手","lFactionName":"Orokin","b_lvl":8},"Corrupted Vor":{"faction":"Orokin","health":1500,"armor":250,"shield":1500,"localeName":"堕落的Vor","lFactionName":"Orokin"},"Battalyst":{"faction":"Sentient","health":1150,"armor":150,"shield":0,"localeName":"武装使","lFactionName":"Sentient","eximusOff":true,"unique":"sentient"},"Corrupted Lancer":{"faction":"Orokin","health":60,"armor":200,"shield":0,"localeName":"堕落枪兵","lFactionName":"Orokin"},"Ballista":{"faction":"Grineer","health":100,"armor":100,"shield":0,"localeName":"弩炮","lFactionName":"Grineer"},"Kuva Ballista":{"faction":"Kuva Grineer","health":100,"armor":100,"shield":0,"localeName":"Kuva Ballista","lFactionName":"Kuva Grineer"},"Corvette":{"faction":"Corpus","health":100,"armor":75,"shield":100,"localeName":"护卫舰","lFactionName":"Corpus"},"Councilor Vay Hek":{"faction":"Grineer","health":2000,"armor":200,"shield":0,"localeName":"Vay Hek议员","lFactionName":"Grineer"},"Corrupted Nullifier":{"faction":"Orokin","health":60,"armor":0,"shield":150,"localeName":"堕落虚能者","lFactionName":"Orokin","b_lvl":15},"Crewman":{"faction":"Corpus","health":60,"armor":0,"shield":150,"localeName":"船员","lFactionName":"Corpus"},"Crewship":{"faction":"Corpus","health":1500,"armor":205,"shield":2000,"localeName":"战舰","lFactionName":"Corpus"},"Crawler":{"faction":"Infested","health":50,"armor":0,"shield":0,"localeName":"爬行者","lFactionName":"感染"},"Comet Shard":{"faction":"Corpus","health":300,"armor":175,"shield":200,"localeName":"冰陨碎弹","lFactionName":"Corpus"},"Cutter":{"faction":"Grineer","health":150,"armor":125,"shield":0,"localeName":"切割战机","lFactionName":"Grineer"},"Darek Draga":{"faction":"Grineer","health":130,"armor":10,"shield":0,"localeName":"疏浚兵长","lFactionName":"Grineer"},"Datalyst":{"faction":"Corpus","health":1300,"armor":0,"shield":600,"localeName":"资料师","lFactionName":"Corpus"},"Deimos Therid":{"faction":"Infested Deimos","health":1200,"armor":0,"shield":0,"localeName":"惊惧古壳蛛","lFactionName":"Infested Deimos","immun":{"status":["viral"]},"eximusOff":true,"unique":"saxum"},"Deimos Jugulus":{"faction":"Infested Deimos","health":1600,"armor":300,"shield":0,"localeName":"惊惧喉骨刃者","lFactionName":"Infested Deimos","eximusOff":true,"unique":"jugulus"},"Deimos Tendril Drone":{"faction":"Infested Deimos","health":100,"armor":150,"shield":0,"localeName":"惊惧卷须无人机","lFactionName":"Infested Deimos"},"Deimos Genetrix":{"faction":"Infested Deimos","health":8000,"armor":600,"shield":0,"localeName":"惊惧母艇","lFactionName":"Infested Deimos"},"Deimos Juggernaut":{"faction":"Infested Deimos","health":900,"armor":200,"shield":0,"localeName":"惊惧巨兽","lFactionName":"Infested Deimos"},"Demolisher Anti MOA":{"faction":"Corpus","health":2000,"armor":100,"shield":800,"localeName":"爆破型逆进恐鸟","lFactionName":"Corpus","innateDR":{"health":0.2,"armor":0.2,"shield":0.5},"immun":{"status":["radiation"]},"eximusOff":true,"unique":"demolisher","showPartyCount":true},"Demolisher Bailiff":{"faction":"Grineer","health":2000,"armor":200,"shield":0,"localeName":"爆破型执法员","lFactionName":"Grineer","innateDR":{"health":0.2,"armor":0.2,"shield":0},"immun":{"status":["radiation"]},"eximusOff":true,"unique":"demolisher","showPartyCount":true},"Demolisher Boiler":{"faction":"Infested","health":3000,"armor":0,"shield":0,"localeName":"爆破型痈裂者","lFactionName":"感染","immun":{"status":["viral","radiation"]},"eximusOff":true,"unique":"demolisher","showPartyCount":true},"Demolisher Bursa":{"faction":"Corpus","health":2000,"armor":100,"shield":800,"localeName":"爆破型金流恐鸟","lFactionName":"Corpus","innateDR":{"health":0.2,"armor":0.2,"shield":0.5},"immun":{"status":["radiation"]},"eximusOff":true,"unique":"demolisher","showPartyCount":true},"Demolisher Devourer":{"faction":"Grineer","health":2500,"armor":250,"shield":0,"localeName":"爆破型吞噬者","lFactionName":"Grineer","innateDR":{"health":0.2,"armor":0.2,"shield":0},"immun":{"status":["radiation"]},"eximusOff":true,"unique":"demolisher","showPartyCount":true},"Demolisher Expired":{"faction":"Grineer","health":1500,"armor":100,"shield":0,"localeName":"爆破型除役尸鬼","lFactionName":"Grineer","innateDR":{"health":0.2,"armor":0.2,"shield":0},"immun":{"status":["radiation"]},"eximusOff":true,"unique":"demolisher","showPartyCount":true},"Demolisher Charger":{"faction":"Infested","health":2500,"armor":0,"shield":0,"localeName":"爆破型疾冲者","lFactionName":"感染","immun":{"status":["viral","radiation"]},"eximusOff":true,"unique":"demolisher","showPartyCount":true},"Demolisher Heavy Gunner":{"faction":"Grineer","health":2000,"armor":200,"shield":0,"localeName":"爆破型重型机枪手","lFactionName":"Grineer","innateDR":{"health":0.2,"armor":0.2,"shield":0},"immun":{"status":["radiation"]},"eximusOff":true,"unique":"demolisher","showPartyCount":true},"Demolyst Heqet":{"faction":"Corpus","health":2000,"armor":0,"shield":800,"localeName":"爆破使灵蛙","lFactionName":"Corpus","innateDR":{"health":0.2,"armor":0,"shield":0.5},"immun":{"status":["radiation"]},"eximusOff":true,"unique":"demolisher","showPartyCount":true},"Demolisher Hyena":{"faction":"Corpus","health":1500,"armor":50,"shield":700,"localeName":"爆破型鬣狗","lFactionName":"Corpus","innateDR":{"health":0.2,"armor":0.2,"shield":0.5},"immun":{"status":["radiation"]},"eximusOff":true,"unique":"demolisher","showPartyCount":true},"Demolisher Juggernaut":{"faction":"Infested","health":3000,"armor":50,"shield":0,"localeName":"爆破型巨兽","lFactionName":"感染","innateDR":{"health":0.2,"armor":0.2,"shield":0},"immun":{"status":["viral","radiation"]},"eximusOff":true,"unique":"demolisher","showPartyCount":true},"Demolisher Kuva Guardian":{"faction":"Kuva Grineer","health":2500,"armor":150,"shield":0,"localeName":"爆破型赤毒守卫者","lFactionName":"Kuva Grineer","innateDR":{"health":0.2,"armor":0.2,"shield":0},"immun":{"status":["radiation"]},"eximusOff":true,"unique":"demolisher","showPartyCount":true},"Demolyst Machinist":{"faction":"Corpus","health":2000,"armor":0,"shield":800,"localeName":"爆破使机械师","lFactionName":"Corpus","innateDR":{"health":0.2,"armor":0,"shield":0.5},"immun":{"status":["radiation"]},"eximusOff":true,"unique":"demolisher","showPartyCount":true},"Demolyst MOA":{"faction":"Corpus","health":2000,"armor":0,"shield":800,"localeName":"爆破使恐鸟","lFactionName":"Corpus","innateDR":{"health":0.2,"armor":0,"shield":0.5},"immun":{"status":["radiation"]},"eximusOff":true,"unique":"demolisher","showPartyCount":true},"Demolisher Nox":{"faction":"Grineer","health":2500,"armor":250,"shield":0,"localeName":"爆破型毒化者","lFactionName":"Grineer","innateDR":{"health":0.2,"armor":0.2,"shield":0},"immun":{"status":["radiation"]},"eximusOff":true,"unique":"demolisher","showPartyCount":true},"Demolyst Satyr":{"faction":"Corpus","health":2000,"armor":0,"shield":800,"localeName":"爆破使半羊兽","lFactionName":"Corpus","innateDR":{"health":0.2,"armor":0,"shield":0.5},"immun":{"status":["radiation"]},"eximusOff":true,"unique":"demolisher","showPartyCount":true},"Demolisher Thrasher":{"faction":"Infested","health":3250,"armor":0,"shield":0,"localeName":"爆破型奔跳者","lFactionName":"感染","immun":{"status":["viral","radiation"]},"eximusOff":true,"unique":"demolisher","showPartyCount":true},"Denial Bursa":{"faction":"Corpus","health":1200,"armor":200,"shield":700,"localeName":"守护金流恐鸟","lFactionName":"Corpus","eximusOff":true},"Condrix":{"faction":"Sentient","health":12000,"armor":25,"shield":0,"localeName":"谍影登陆舰","lFactionName":"Sentient","eximusOff":true,"unique":"condrix"},"Dru Pesfor":{"faction":"Corpus","health":1000,"armor":50,"shield":2500,"localeName":"Dru Pesfor","lFactionName":"Corpus"},"Dreg":{"faction":"Grineer","health":100,"armor":150,"shield":0,"localeName":"无人机(Grineer空战)","lFactionName":"Grineer"},"Devotee":{"faction":"Tenno","health":100,"armor":100,"shield":100,"localeName":"拥护者","lFactionName":"Tenno"},"Drahk Master":{"faction":"Grineer","health":500,"armor":200,"shield":0,"localeName":"爪喀驯兽师","lFactionName":"Grineer","b_lvl":12},"Kuva Drahk Master":{"faction":"Kuva Grineer","health":500,"armor":200,"shield":0,"localeName":"Kuva Drahk Master","lFactionName":"Kuva Grineer","b_lvl":12},"Eidolon Gantulyst":{"faction":"Sentient","health":55000,"armor":130,"shield":60000,"localeName":"夜灵巨力使","lFactionName":"Sentient","immun":{"status":["all"]},"eximusOff":true,"unique":"eidolon"},"Corpus Trencher Target":{"faction":"Corpus","health":800,"armor":50,"shield":1200,"localeName":"Corpus掘沟者目标","lFactionName":"Corpus","unique":"crewmans-rangers","elemRes":{"cold":0.75,"blast":0.75,"magnetic":0.75,"viral":0.75}},"Draga":{"faction":"Grineer","health":120,"armor":10,"shield":0,"localeName":"疏浚兵","lFactionName":"Grineer"},"Eidolon Hydrolyst":{"faction":"Sentient","health":65000,"armor":150,"shield":70000,"localeName":"夜灵水力使","lFactionName":"Sentient","immun":{"status":["all"]},"eximusOff":true,"unique":"eidolon"},"Corpus Target":{"faction":"Corpus","health":500,"armor":20,"shield":500,"localeName":"Corpus目标","lFactionName":"Corpus"},"Elite Basilisk":{"faction":"Corpus","health":380,"armor":75,"shield":350,"localeName":"精英蛇妖战机","lFactionName":"Corpus"},"Drover Bursa":{"faction":"Corpus","health":1200,"armor":200,"shield":700,"localeName":"驱引金流恐鸟","lFactionName":"Corpus"},"Electric Crawler":{"faction":"Infested","health":50,"armor":0,"shield":0,"localeName":"电击爬行者","lFactionName":"感染"},"Elite Cutter":{"faction":"Grineer","health":300,"armor":150,"shield":0,"localeName":"精英切割战机","lFactionName":"Grineer"},"Eidolon Teralyst":{"faction":"Sentient","health":50000,"armor":125,"shield":50000,"localeName":"夜灵兆力使","lFactionName":"Sentient","immun":{"status":["all"]},"eximusOff":true,"unique":"eidolon"},"Elite Crewman":{"faction":"Corpus","health":60,"armor":0,"shield":200,"localeName":"精英船员","lFactionName":"Corpus","b_lvl":16},"Eidolon Vomvalyst":{"faction":"Sentient","health":700,"armor":0,"shield":0,"localeName":"夜灵轰击使","lFactionName":"Sentient","eximusOff":true,"unique":"vomvalyst"},"Elite Ramsled":{"faction":"Grineer","health":-1,"armor":-1,"shield":0,"localeName":"精英冲锋艇","lFactionName":"Grineer"},"Elite Weaver":{"faction":"Corpus","health":450,"armor":175,"shield":300,"localeName":"精英旋织战机","lFactionName":"Corpus"},"Elite Taktis":{"faction":"Grineer","health":300,"armor":175,"shield":0,"localeName":"精英战术战机","lFactionName":"Grineer"},"Derivator Crewman":{"faction":"Corpus","health":350,"armor":0,"shield":100,"localeName":"引能船员","lFactionName":"Corpus"},"Errant Specter":{"faction":"Corpus","health":200,"armor":50,"shield":0,"localeName":"游荡魅影","lFactionName":"Corpus"},"Executioner/Garesh":{"faction":"Grineer","health":350,"armor":150,"shield":600,"localeName":"行刑者/Garesh","lFactionName":"Grineer","eximusOff":true},"Engineer":{"faction":"Corpus","health":2000,"armor":0,"shield":250,"localeName":"工程师","lFactionName":"Corpus","unique":"crewmans-rangers","elemRes":{"cold":0.75,"blast":0.75,"magnetic":0.75,"viral":0.75}},"Eviscerator":{"faction":"Grineer","health":150,"armor":200,"shield":0,"localeName":"开膛者","lFactionName":"Grineer"},"Kuva Eviscerator":{"faction":"Kuva Grineer","health":150,"armor":200,"shield":0,"localeName":"Kuva Eviscerator","lFactionName":"Kuva Grineer"},"Elite Gokstad Crewship":{"faction":"Grineer","health":3000,"armor":600,"shield":0,"localeName":"精英高克斯塔战舰","lFactionName":"Grineer"},"Executioner/Nok":{"faction":"Grineer","health":250,"armor":150,"shield":500,"localeName":"行刑者/Nok","lFactionName":"Grineer","eximusOff":true},"Executioner/Gorth":{"faction":"Grineer","health":500,"armor":325,"shield":800,"localeName":"行刑者/Gorth","lFactionName":"Grineer","eximusOff":true},"Executioner/Harkonar":{"faction":"Grineer","health":200,"armor":75,"shield":500,"localeName":"行刑者/Harkonar","lFactionName":"Grineer","eximusOff":true},"Executioner/Reth":{"faction":"Grineer","health":250,"armor":75,"shield":350,"localeName":"行刑者/Reth","lFactionName":"Grineer","eximusOff":true},"Dargyn Pilot":{"faction":"Grineer","health":120,"armor":100,"shield":0,"localeName":"轻型艇飞行员","lFactionName":"Grineer"},"Executioner/Dhurnam":{"faction":"Grineer","health":600,"armor":300,"shield":600,"localeName":"行刑者/Dhurnam","lFactionName":"Grineer","eximusOff":true},"Elite Flak":{"faction":"Grineer","health":400,"armor":175,"shield":0,"localeName":"精英高炮战机","lFactionName":"Grineer"},"Drudge":{"faction":"Grineer","health":350,"armor":75,"shield":0,"localeName":"苦工","lFactionName":"Grineer"},"Corrupted Crewman":{"faction":"Orokin","health":60,"armor":0,"shield":150,"localeName":"堕落船员","lFactionName":"Orokin"},"Drone Guardian":{"faction":"Orokin","health":250,"armor":0,"shield":75,"localeName":"无人机保护性的","lFactionName":"Orokin"},"Deimos Carnis":{"faction":"Infested Deimos","health":800,"armor":50,"shield":0,"localeName":"惊惧肉碾虫","lFactionName":"Infested Deimos","immun":{"status":["viral"]},"eximusOff":true},"Executioner/Dok Thul":{"faction":"Grineer","health":600,"armor":300,"shield":600,"localeName":"行刑者/Dok Thul","lFactionName":"Grineer","eximusOff":true},"Executioner/Vay Molta":{"faction":"Grineer","health":350,"armor":225,"shield":750,"localeName":"行刑者/Vay Molta","lFactionName":"Grineer","eximusOff":true},"Corrupted Ancient":{"faction":"Orokin","health":400,"armor":0,"shield":0,"localeName":"远古堕落者","lFactionName":"Orokin"},"Desert Skate":{"faction":"Neutral","health":250,"armor":200,"shield":0,"localeName":"沙漠鳐鱼","lFactionName":"Neutral"},"Detron Crewman":{"faction":"Corpus","health":60,"armor":0,"shield":150,"localeName":"德特昂船员","lFactionName":"Corpus"},"Disc MOA":{"faction":"Corpus","health":60,"armor":0,"shield":200,"localeName":"圆盘恐鸟","lFactionName":"Corpus"},"Deimos Saxum":{"faction":"Infested Deimos","health":750,"armor":70,"shield":0,"localeName":"惊惧重岩者","lFactionName":"Infested Deimos","eximusOff":true,"unique":"saxum"},"Comba":{"faction":"Corpus","health":1100,"armor":0,"shield":400,"localeName":"驱逐员","lFactionName":"Corpus"},"Eidolon Lure":{"faction":"Grineer","health":1000,"armor":100,"shield":600,"localeName":"夜灵诱饵","lFactionName":"Grineer"},"Derim Zahn":{"faction":"Corpus","health":1000,"armor":50,"shield":2500,"localeName":"Derim Zahn","lFactionName":"Corpus"},"Drahk":{"faction":"Grineer","health":200,"armor":100,"shield":0,"localeName":"爪喀","lFactionName":"Grineer"},"Executioner/Zura":{"faction":"Grineer","health":250,"armor":75,"shield":500,"localeName":"行刑者/Zura","lFactionName":"Grineer","eximusOff":true},"Corpus Tech":{"faction":"Corpus","health":700,"armor":0,"shield":250,"localeName":"Corpus技师","lFactionName":"Corpus"},"Dargyn (Enemy)":{"faction":"Grineer","health":200,"armor":200,"shield":0,"localeName":"轻型艇(敌人)","lFactionName":"Grineer"},"Kuva Dargyn":{"faction":"Kuva Grineer","health":450,"armor":125,"shield":0,"localeName":"Kuva Dargyn","lFactionName":"Kuva Grineer"},"Elite Outrider":{"faction":"Grineer","health":1500,"armor":400,"shield":0,"localeName":"精英先驱战机","lFactionName":"Grineer"},"Elite Harpi":{"faction":"Corpus","health":400,"armor":85,"shield":200,"localeName":"精英鹰掠战机","lFactionName":"Corpus"},"Exploiter Orb":{"faction":"Corpus","health":12000,"armor":200,"shield":0,"localeName":"剥削者圆蛛","lFactionName":"Corpus","immun":{"status":["all"]},"eximusOff":true},"Elite Shield Lancer":{"faction":"Grineer","health":600,"armor":5,"shield":0,"localeName":"精英盾枪兵","lFactionName":"Grineer","b_lvl":5},"Elite Lancer":{"faction":"Grineer","health":150,"armor":200,"shield":0,"localeName":"精英枪兵","lFactionName":"Grineer"},"Kuva Elite Lancer":{"faction":"Kuva Grineer","health":150,"armor":200,"shield":0,"localeName":"Kuva Elite Lancer","lFactionName":"Kuva Grineer","b_lvl":1},"Flak":{"faction":"Grineer","health":200,"armor":150,"shield":0,"localeName":"高炮战机","lFactionName":"Grineer"},"Feral Kavat":{"faction":"Neutral","health":300,"armor":175,"shield":0,"localeName":"野生库娃","lFactionName":"Neutral"},"Feral Diploid":{"faction":"Infested","health":250,"armor":125,"shield":0,"localeName":"凶猛二倍体","lFactionName":"感染"},"Feral Kubrow":{"faction":"Neutral","health":300,"armor":200,"shield":0,"localeName":"野生库狛","lFactionName":"Neutral"},"Frigate":{"faction":"Corpus","health":100,"armor":75,"shield":100,"localeName":"驱逐舰","lFactionName":"Corpus"},"Feyarch Specter":{"faction":"Orokin","health":2250,"armor":200,"shield":1000,"localeName":"精灵之王魅影","lFactionName":"Orokin"},"Flameblade":{"faction":"Grineer","health":50,"armor":5,"shield":0,"localeName":"烈焰刀客","lFactionName":"Grineer"},"Kuva Flameblade":{"faction":"Kuva Grineer","health":50,"armor":5,"shield":0,"localeName":"Kuva Flameblade","lFactionName":"Kuva Grineer"},"Fusion MOA":{"faction":"Corpus","health":250,"armor":0,"shield":250,"localeName":"熔岩恐鸟","lFactionName":"Corpus","immun":{"status":["heat"]},"b_lvl":15},"Vapos Fusion MOA":{"faction":"Corpus","health":100,"armor":0,"shield":250,"localeName":"气雾融合恐鸟","lFactionName":"Corpus","immun":{"status":["heat"]}},"Fusion MOA Guardian":{"faction":"Orokin","health":250,"armor":0,"shield":250,"localeName":"熔岩恐鸟守护者","lFactionName":"Orokin"},"Frozen Infested Hive":{"faction":"Infested","health":4500,"armor":25,"shield":0,"localeName":"感染巢囊 冰冻","lFactionName":"感染"},"Garv":{"faction":"Grineer","health":800,"armor":1400,"shield":0,"localeName":"加弗","lFactionName":"Grineer"},"Gas Infested Hive":{"faction":"Infested","health":4500,"armor":25,"shield":0,"localeName":"感染巢囊 毒气","lFactionName":"感染"},"General Sargas Ruk":{"faction":"Grineer","health":2000,"armor":250,"shield":0,"localeName":"Sargas Ruk将军","lFactionName":"Grineer"},"Ghoul Devourer":{"faction":"Grineer","health":600,"armor":250,"shield":0,"localeName":"吞噬尸鬼","lFactionName":"Grineer"},"Ghoul Auger":{"faction":"Grineer","health":400,"armor":200,"shield":0,"localeName":"钻孔尸鬼","lFactionName":"Grineer"},"Glacik Commander":{"faction":"Grineer","health":300,"armor":750,"shield":0,"localeName":"Glacik指挥官","lFactionName":"Grineer"},"Ghoul Expired Deserter":{"faction":"Grineer","health":150,"armor":20,"shield":80,"localeName":"除役尸鬼逃兵","lFactionName":"Grineer"},"Gokstad Officer":{"faction":"Grineer","health":1000,"armor":1000,"shield":0,"localeName":"高克斯塔军官","lFactionName":"Grineer"},"Gokstad Pilot":{"faction":"Grineer","health":300,"armor":200,"shield":0,"localeName":"高克斯塔飞行员","lFactionName":"Grineer"},"Gox":{"faction":"Corpus","health":350,"armor":500,"shield":250,"localeName":"神锋战机","lFactionName":"Corpus"},"Ghoul Expired":{"faction":"Grineer","health":300,"armor":150,"shield":0,"localeName":"除役尸鬼","lFactionName":"Grineer"},"Grineer Target":{"faction":"Grineer","health":800,"armor":60,"shield":0,"localeName":"Grineer捕获目标","lFactionName":"Grineer"},"Ghoul Rictus":{"faction":"Grineer","health":400,"armor":200,"shield":0,"localeName":"裂嘴尸鬼","lFactionName":"Grineer"},"Gyre Hyena":{"faction":"Corpus","health":800,"armor":25,"shield":500,"localeName":"回旋鬣狗","lFactionName":"Corpus"},"Guardsman":{"faction":"Grineer","health":150,"armor":5,"shield":0,"localeName":"禁卫军","lFactionName":"Grineer"},"Gyrix":{"faction":"Sentient","health":300,"armor":125,"shield":200,"localeName":"螺旋战机","lFactionName":"Sentient","unique":"sentient"},"Harpi":{"faction":"Corpus","health":200,"armor":50,"shield":100,"localeName":"鹰掠战机","lFactionName":"Corpus"},"Frontier Lancer":{"faction":"Grineer","health":100,"armor":100,"shield":0,"localeName":"前线枪兵","lFactionName":"Grineer"},"Hellion Dargyn":{"faction":"Grineer","health":200,"armor":200,"shield":0,"localeName":"恶徒轻型艇","lFactionName":"Grineer"},"Hellion":{"faction":"Grineer","health":100,"armor":100,"shield":0,"localeName":"恶徒","lFactionName":"Grineer"},"Kuva Hellion":{"faction":"Kuva Grineer","health":100,"armor":100,"shield":0,"localeName":"Kuva Hellion","lFactionName":"Kuva Grineer"},"Heavy Gunner":{"faction":"Grineer","health":300,"armor":500,"shield":0,"localeName":"重型机枪手","lFactionName":"Grineer","b_lvl":8},"Kuva Heavy Gunner":{"faction":"Kuva Grineer","health":300,"armor":500,"shield":0,"localeName":"Kuva Heavy Gunner","lFactionName":"Kuva Grineer","b_lvl":8},"Hound":{"faction":"Corpus","health":1,"armor":1,"shield":1,"localeName":"猎犬","lFactionName":"Corpus"},"Hyekka":{"faction":"Grineer","health":200,"armor":175,"shield":0,"localeName":"鬣猫","lFactionName":"Grineer","unique":"hyekka","elemRes":{"heat":0.8}},"Ionyx":{"faction":"Sentient","health":400,"armor":150,"shield":200,"localeName":"离子战机","lFactionName":"Sentient","unique":"sentient"},"Icemire Hyena":{"faction":"Corpus","health":800,"armor":25,"shield":500,"localeName":"冰沼鬣狗","lFactionName":"Corpus"},"Hyena Pack":{"faction":"Corpus","health":800,"armor":25,"shield":1000,"localeName":"鬣狗群","lFactionName":"Corpus"},"Hemocyte":{"faction":"Infested","health":5000,"armor":175,"shield":0,"localeName":"免疫血胞体","lFactionName":"感染","innateDR":{"health":0.7,"armor":0.7,"shield":0.7},"immun":{"status":["all"]},"eximusOff":true,"unique":"hemocyte","b_lvl":10},"Hukin":{"faction":"Corpus","health":12000,"armor":200,"shield":0,"localeName":"Hukin","lFactionName":"Corpus"},"Gokstad Crewship":{"faction":"Grineer","health":3000,"armor":300,"shield":0,"localeName":"高克斯塔战舰","lFactionName":"Grineer"},"Jackal":{"faction":"Corpus","health":1200,"armor":100,"shield":2000,"localeName":"豺狼","lFactionName":"Corpus","eximusOff":true},"Juggernaut":{"faction":"Infested","health":900,"armor":200,"shield":0,"localeName":"巨兽","lFactionName":"感染","eximusOff":true,"unique":"juggernaut","b_lvl":15},"Isolator Bursa":{"faction":"Corpus","health":1200,"armor":200,"shield":700,"localeName":"隔离金流恐鸟","lFactionName":"Corpus","eximusOff":true},"Jordas Golem":{"faction":"Infested","health":20000,"armor":250,"shield":0,"localeName":"Jordas魔像","lFactionName":"感染","eximusOff":true},"Juggernaut Behemoth":{"faction":"Infested","health":1500,"armor":300,"shield":0,"localeName":"重装巨兽","lFactionName":"感染","eximusOff":true,"unique":"juggernaut","b_lvl":15},"Kuva Guardian":{"faction":"Kuva Grineer","health":400,"armor":100,"shield":0,"localeName":"赤毒守卫者","lFactionName":"Kuva Grineer"},"Knave Specter":{"faction":"Orokin","health":1250,"armor":200,"shield":1000,"localeName":"无赖魅影","lFactionName":"Orokin"},"Juno Jactus Osprey":{"faction":"Corpus","health":100,"armor":0,"shield":50,"localeName":"朱诺延爆鱼鹰","lFactionName":"Corpus"},"Infested Mesa":{"faction":"Infested","health":1700,"armor":200,"shield":1000,"localeName":"Infested Mesa","lFactionName":"感染","eximusOff":true},"Juno Geminex MOA":{"faction":"Corpus","health":60,"armor":0,"shield":200,"localeName":"朱诺双子炮恐鸟","lFactionName":"Corpus"},"Kuva Lich":{"faction":"Kuva Grineer","health":1,"armor":1,"shield":1,"localeName":"赤毒玄骸","lFactionName":"Kuva Grineer","eximusOff":true,"unique":"lich"},"Juno Dera MOA":{"faction":"Corpus","health":60,"armor":0,"shield":150,"localeName":"朱诺德拉恐鸟","lFactionName":"Corpus"},"Hyekka Master":{"faction":"Grineer","health":650,"armor":200,"shield":0,"localeName":"鬣猫驯兽师","lFactionName":"Grineer","unique":"hyekka","elemRes":{"heat":0.8}},"Kuva Hyekka Master":{"faction":"Kuva Grineer","health":650,"armor":200,"shield":0,"localeName":"Kuva Hyekka Master","lFactionName":"Kuva Grineer","unique":"hyekka","elemRes":{"heat":0.8}},"Infested Hive":{"faction":"Infested","health":4500,"armor":25,"shield":0,"localeName":"感染巢囊","lFactionName":"感染","eximusOff":true},"Kyta Raknoid":{"faction":"Corpus","health":4000,"armor":150,"shield":10000,"localeName":"凯塔蛛形机","lFactionName":"Corpus","innateDR":{"health":0,"armor":0,"shield":0.25},"immun":{"status":["viral","impact","magnetic"]},"eximusOff":true,"unique":"raknoid"},"Latrox Une":{"faction":"Corpus","health":450,"armor":0,"shield":250,"localeName":"拉托罗恩","lFactionName":"Corpus"},"Infested Chroma":{"faction":"Infested","health":2000,"armor":200,"shield":1000,"localeName":"Infested Chroma","lFactionName":"感染","eximusOff":true},"Leaper":{"faction":"Infested","health":100,"armor":0,"shield":0,"localeName":"奔跳者","lFactionName":"感染"},"Kuva Trokarian":{"faction":"Kuva Grineer","health":500,"armor":300,"shield":0,"localeName":"赤毒锐兵","lFactionName":"Kuva Grineer","b_lvl":15,"overguard":{"val":"2"}},"Lancing Infested Hive":{"faction":"Infested","health":4500,"armor":25,"shield":0,"localeName":"感染巢囊 重力","lFactionName":"感染"},"Kela De Thaym":{"faction":"Grineer","health":7250,"armor":250,"shield":1400,"localeName":"Kela De Thaym","lFactionName":"Grineer","eximusOff":true},"Manic":{"faction":"Grineer","health":350,"armor":25,"shield":0,"localeName":"狂躁Grineer","lFactionName":"Grineer"},"Leech Osprey":{"faction":"Corpus","health":100,"armor":0,"shield":50,"localeName":"吸血鱼鹰","lFactionName":"Corpus"},"Leaping Thrasher":{"faction":"Infested","health":600,"armor":0,"shield":0,"localeName":"鞭击奔跳者","lFactionName":"感染","immun":{"status":["viral"]},"eximusOff":true,"unique":"saxum"},"Mania":{"faction":"Stalker","health":5500,"armor":50,"shield":2500,"localeName":"躁狂","lFactionName":"Stalker","innateDR":{"health":0.625,"armor":0.625,"shield":0},"eximusOff":true,"unique":"acolytes","maxProcStacks":4},"Lobber Crawler":{"faction":"Infested","health":50,"armor":0,"shield":0,"localeName":"喷吐爬行者","lFactionName":"感染"},"Malice":{"faction":"Stalker","health":5500,"armor":50,"shield":2500,"localeName":"怨恨","lFactionName":"Stalker","innateDR":{"health":0.625,"armor":0.625,"shield":0},"eximusOff":true,"unique":"acolytes","maxProcStacks":4},"Lancer Dreg":{"faction":"Grineer","health":100,"armor":150,"shield":0,"localeName":"枪兵无人机","lFactionName":"Grineer"},"Juno Glaxion MOA":{"faction":"Corpus","health":60,"armor":0,"shield":300,"localeName":"朱诺冷冻光束步枪恐鸟","lFactionName":"Corpus"},"Lockjaw & Sol":{"faction":"Corpus","health":1000,"armor":50,"shield":2500,"localeName":"Lockjaw & Sol","lFactionName":"Corpus"},"M-W.A.M.":{"faction":"Corpus","health":1000,"armor":50,"shield":2500,"localeName":"M-W.A.M.","lFactionName":"Corpus"},"Lephantis":{"faction":"Infested","health":3000,"armor":0,"shield":0,"localeName":"Lephantis","lFactionName":"感染","innateDR":{"health":0.6,"armor":0.6,"shield":0},"immun":{"status":["all"]},"eximusOff":true,"unique":"lephantis"},"Misery":{"faction":"Stalker","health":5500,"armor":50,"shield":2500,"localeName":"苦难","lFactionName":"Stalker","innateDR":{"health":0.625,"armor":0.625,"shield":0},"eximusOff":true,"unique":"acolytes","maxProcStacks":4},"Jad Teran":{"faction":"Corpus","health":1000,"armor":50,"shield":2500,"localeName":"Jad Teran","lFactionName":"Corpus"},"Mitosid":{"faction":"Infested","health":500,"armor":125,"shield":0,"localeName":"分裂体","lFactionName":"感染"},"Lynx":{"faction":"Corpus","health":1000,"armor":150,"shield":0,"localeName":"山猫","lFactionName":"Corpus"},"Mine Osprey":{"faction":"Corpus","health":100,"armor":0,"shield":50,"localeName":"地雷鱼鹰","lFactionName":"Corpus"},"Mimic":{"faction":"Sentient","health":800,"armor":125,"shield":0,"localeName":"拟态者","lFactionName":"Sentient","unique":"sentient"},"MOA":{"faction":"Corpus","health":60,"armor":0,"shield":150,"localeName":"恐鸟","lFactionName":"Corpus"},"Minima MOA":{"faction":"Corpus","health":60,"armor":0,"shield":150,"localeName":"微型恐鸟","lFactionName":"Corpus"},"Mutalist Alad V":{"faction":"Infested","health":2500,"armor":500,"shield":1200,"localeName":"Mutalist Alad V","lFactionName":"感染","eximusOff":true},"Mutalist Osprey":{"faction":"Infested","health":200,"armor":0,"shield":0,"localeName":"剧毒无人机","lFactionName":"感染"},"Jen Dro":{"faction":"Corpus","health":1000,"armor":50,"shield":2500,"localeName":"Jen Dro","lFactionName":"Corpus"},"Napalm":{"faction":"Grineer","health":600,"armor":500,"shield":0,"localeName":"火焰轰击者","lFactionName":"Grineer","b_lvl":6},"Kuva Napalm":{"faction":"Kuva Grineer","health":600,"armor":500,"shield":0,"localeName":"Kuva Napalm","lFactionName":"Kuva Grineer"},"Locust Drone":{"faction":"Corpus","health":10,"armor":50,"shield":0,"localeName":"蝗虫无人机","lFactionName":"Corpus"},"Lektro Commander":{"faction":"Grineer","health":300,"armor":750,"shield":0,"localeName":"Lektro指挥官","lFactionName":"Grineer"},"Mutalist Toxic Carrier":{"faction":"Infested","health":65,"armor":0,"shield":0,"localeName":"异融剧毒运送者","lFactionName":"感染"},"Narmer Bombard":{"faction":"Narmer","health":300,"armor":500,"shield":0,"localeName":"合一众轰击者","lFactionName":"合一众"},"Nako Xol":{"faction":"Corpus","health":1000,"armor":50,"shield":2500,"localeName":"Nako Xol","lFactionName":"Corpus"},"Manic Bombard":{"faction":"Grineer","health":1500,"armor":500,"shield":0,"localeName":"狂躁轰击者","lFactionName":"Grineer","b_lvl":4},"Narmer Heavy Gunner":{"faction":"Narmer","health":300,"armor":500,"shield":0,"localeName":"合一众重型机枪手","lFactionName":"合一众"},"Kuva Jester":{"faction":"Kuva Grineer","health":350,"armor":200,"shield":0,"localeName":"赤毒小丑","lFactionName":"Kuva Grineer","b_lvl":10},"Narmer Ballista":{"faction":"Narmer","health":100,"armor":100,"shield":0,"localeName":"合一众弩炮","lFactionName":"合一众"},"Narmer Dera MOA":{"faction":"Narmer","health":60,"armor":0,"shield":150,"localeName":"合一众德拉恐鸟","lFactionName":"合一众"},"Narmer Lancer":{"faction":"Narmer","health":100,"armor":100,"shield":0,"localeName":"合一众枪兵","lFactionName":"合一众"},"Maggot":{"faction":"Infested","health":20,"armor":0,"shield":0,"localeName":"蛆虫","lFactionName":"感染"},"Lynx Osprey":{"faction":"Corpus","health":35,"armor":0,"shield":50,"localeName":"山猫鱼鹰","lFactionName":"Corpus"},"Narmer Leech Osprey":{"faction":"Narmer","health":100,"armor":0,"shield":50,"localeName":"合一众吸血鱼鹰","lFactionName":"合一众"},"Narmer Napalm":{"faction":"Narmer","health":600,"armor":500,"shield":0,"localeName":"合一众火焰轰击者","lFactionName":"合一众"},"Narmer Powerfist":{"faction":"Narmer","health":100,"armor":5,"shield":0,"localeName":"合一众重击手","lFactionName":"合一众"},"Narmer Raknoid":{"faction":"Narmer","health":2000,"armor":200,"shield":5000,"localeName":"合一众蛛形机","lFactionName":"合一众"},"Necramech":{"faction":"Orokin","health":3000,"armor":400,"shield":1000,"localeName":"殁世机甲","lFactionName":"Orokin","eximusOff":true,"unique":"necramech","b_lvl":40},"Maroo":{"faction":"Neutral","health":50,"armor":20,"shield":500,"localeName":"Maroo","lFactionName":"Neutral"},"Narmer Jailer":{"faction":"Narmer","health":600,"armor":0,"shield":500,"localeName":"合一众典狱长","lFactionName":"合一众"},"Narmer Trooper":{"faction":"Narmer","health":120,"armor":150,"shield":0,"localeName":"合一众骑兵","lFactionName":"合一众"},"Nauseous Crawler":{"faction":"Infested","health":50,"armor":0,"shield":0,"localeName":"呕心爬行者","lFactionName":"感染"},"Nox":{"faction":"Grineer","health":350,"armor":500,"shield":0,"localeName":"毒化者","lFactionName":"Grineer"},"Nullifier Crewman":{"faction":"Corpus","health":60,"armor":0,"shield":150,"localeName":"虚能船员","lFactionName":"Corpus","b_lvl":15},"Narmer Sniper Crewman":{"faction":"Narmer","health":60,"armor":0,"shield":150,"localeName":"合一众狙击手船员","lFactionName":"合一众"},"Narmer Detron Crewman":{"faction":"Narmer","health":60,"armor":0,"shield":150,"localeName":"合一众德特昂船员","lFactionName":"合一众"},"Optio":{"faction":"Corpus","health":250,"armor":0,"shield":100,"localeName":"永冻副官","lFactionName":"Corpus"},"Phorid":{"faction":" Infested","health":5000,"armor":25,"shield":0,"localeName":"Phorid","lFactionName":" Infested","eximusOff":true},"Lancer":{"faction":"Grineer","health":100,"armor":100,"shield":0,"localeName":"枪兵","lFactionName":"Grineer"},"Kuva Lancer":{"faction":"Kuva Grineer","health":100,"armor":100,"shield":0,"localeName":"赤毒枪兵","lFactionName":"Kuva Grineer"},"Narmer Nullifier Crewman":{"faction":"Narmer","health":60,"armor":0,"shield":150,"localeName":"合一众虚能船员","lFactionName":"合一众"},"Narmer Hellion":{"faction":"Narmer","health":100,"armor":100,"shield":0,"localeName":"合一众恶徒","lFactionName":"合一众"},"Narmer Corpus Tech":{"faction":"Narmer","health":700,"armor":0,"shield":250,"localeName":"合一众Corpus技师","lFactionName":"合一众"},"Oxium Osprey":{"faction":"Corpus","health":750,"armor":40,"shield":150,"localeName":"奥席金属鱼鹰","lFactionName":"Corpus","b_lvl":5},"Orphix":{"faction":"Sentient","health":8000,"armor":25,"shield":0,"localeName":"奥影母艇","lFactionName":"Sentient","immun":{"status":["all"]},"eximusOff":true,"unique":"orphix"},"Orokin Drone":{"faction":"Orokin","health":35,"armor":0,"shield":50,"localeName":"Orokin无人机","lFactionName":"Orokin"},"Narmer Mine Osprey":{"faction":"Narmer","health":100,"armor":0,"shield":50,"localeName":"合一众地雷鱼鹰","lFactionName":"合一众"},"Oculyst":{"faction":"Sentient","health":300,"armor":150,"shield":0,"localeName":"全视使","lFactionName":"Sentient","eximusOff":true,"unique":"sentient"},"Ortholyst":{"faction":"Sentient","health":600,"armor":125,"shield":0,"localeName":"直垂使","lFactionName":"Sentient","eximusOff":true,"unique":"sentient"},"Lieutenant Lech Kril":{"faction":"Grineer","health":4000,"armor":250,"shield":400,"localeName":"Lech Kril中尉","lFactionName":"Grineer","eximusOff":true},"Narmer Scorpion":{"faction":"Narmer","health":150,"armor":150,"shield":0,"localeName":"合一众天蝎","lFactionName":"合一众"},"Narmer Glaxion MOA":{"faction":"Narmer","health":60,"armor":0,"shield":300,"localeName":"合一众恐鸟冷冻光束步枪","lFactionName":"合一众"},"Pelna Cade":{"faction":"Corpus","health":1000,"armor":50,"shield":2500,"localeName":"Pelna Cade","lFactionName":"Corpus"},"Mutalist Lightning Carrier":{"faction":"Infested","health":65,"armor":0,"shield":0,"localeName":"异融电击运送者","lFactionName":"感染"},"Orbital Strike Drone":{"faction":"Grineer","health":300,"armor":25,"shield":0,"localeName":"卫星冲击无人机","lFactionName":"Grineer","immun":{"status":["impact","cold","electricity","heat","toxin","blast"]}},"Pilot":{"faction":"Corpus","health":1000,"armor":0,"shield":400,"localeName":"飞行员（敌人）","lFactionName":"Corpus"},"Outrider":{"faction":"Grineer","health":1000,"armor":300,"shield":0,"localeName":"先驱战机","lFactionName":"Grineer"},"Narmer Geminex MOA":{"faction":"Narmer","health":60,"armor":0,"shield":200,"localeName":"合一众恐鸟Geminex公司","lFactionName":"合一众"},"Narmer Disc MOA":{"faction":"Narmer","health":60,"armor":0,"shield":200,"localeName":"合一众圆盘恐鸟","lFactionName":"合一众"},"Narmer Thumper Doma":{"faction":"Narmer","health":15000,"armor":100,"shield":0,"localeName":"Narmer Thumper Doma","lFactionName":"合一众","eximusOff":true},"Narmer Crewman":{"faction":"Narmer","health":100,"armor":0,"shield":150,"localeName":"合一众船员","lFactionName":"合一众"},"Narmer Shield Osprey":{"faction":"Narmer","health":35,"armor":0,"shield":50,"localeName":"合一众护盾鱼鹰","lFactionName":"合一众"},"Plains Commander":{"faction":"Grineer","health":1200,"armor":250,"shield":0,"localeName":"平野指挥官","lFactionName":"Grineer","b_lvl":3},"Narmer Prod Crewman":{"faction":"Narmer","health":100,"armor":0,"shield":50,"localeName":"合一众监工船员","lFactionName":"合一众"},"Machinist":{"faction":"Corpus","health":100,"armor":0,"shield":230,"localeName":"机械师","lFactionName":"Corpus"},"Narmer Scorch":{"faction":"Narmer","health":120,"armor":100,"shield":0,"localeName":"合一众怒焚者","lFactionName":"合一众"},"Numon":{"faction":"Corpus","health":750,"armor":0,"shield":450,"localeName":"撕裂者","lFactionName":"Corpus","unique":"empyrean-corpus"},"Latcher":{"faction":"Grineer","health":10,"armor":100,"shield":0,"localeName":"粘子","lFactionName":"Grineer"},"Narmer Deacon":{"faction":"","health":-1,"armor":-1,"shield":0,"localeName":"合一众执事","lFactionName":""},"Narmer Commander":{"faction":"Narmer","health":3500,"armor":250,"shield":0,"localeName":"合一众指挥官","lFactionName":"合一众"},"Penta Ranger":{"faction":"Corpus","health":100,"armor":0,"shield":100,"localeName":"潘塔突击队员","lFactionName":"Corpus"},"Orokin Spectator":{"faction":"Orokin","health":300,"armor":0,"shield":50,"localeName":"Orokin Spectator","lFactionName":"Orokin"},"Narmer Sapping Osprey":{"faction":"Narmer","health":200,"armor":0,"shield":50,"localeName":"合一众基蚀鱼鹰","lFactionName":"合一众"},"Ogma":{"faction":"Grineer","health":600,"armor":500,"shield":0,"localeName":"欧格玛","lFactionName":"Grineer"},"Narmer Shield Lancer":{"faction":"Narmer","health":100,"armor":5,"shield":0,"localeName":"合一众盾枪兵","lFactionName":"合一众"},"Orphid Specter":{"faction":"Orokin","health":1500,"armor":200,"shield":1000,"localeName":"兰花魅影","lFactionName":"Orokin"},"Narmer Flameblade":{"faction":"Narmer","health":50,"armor":5,"shield":0,"localeName":"合一众烈焰刀客","lFactionName":"合一众"},"Nemes":{"faction":"Corpus","health":750,"armor":0,"shield":150,"localeName":"自爆机","lFactionName":"Corpus"},"Nullifier Target":{"faction":"Corpus","health":800,"armor":0,"shield":250,"localeName":"Corpus虚能捕捉目标","lFactionName":"Corpus"},"Profit-Taker Orb":{"faction":"Corpus","health":7000,"armor":150,"shield":30000,"localeName":"利润收割者圆蛛","lFactionName":"Corpus","innateDR":{"health":0,"armor":0,"shield":0.5},"immun":{"status":["all"]},"eximusOff":true},"Pulsing Infested Hive":{"faction":"Infested","health":4500,"armor":25,"shield":0,"localeName":"感染巢囊 脉冲","lFactionName":"感染"},"Prod Crewman":{"faction":"Corpus","health":100,"armor":0,"shield":50,"localeName":"Prod Crewman","lFactionName":"Corpus"},"Protea Specter":{"faction":"Corpus","health":125,"armor":200,"shield":1000,"localeName":"Protea魅影","lFactionName":"Corpus","eximusOff":true},"Propaganda Drone":{"faction":"Grineer","health":200,"armor":25,"shield":0,"localeName":"宣传无人机","lFactionName":"Grineer"},"Pyr Captain":{"faction":"Grineer","health":300,"armor":750,"shield":0,"localeName":"Pyr舰长","lFactionName":"Grineer"},"Powerfist":{"faction":"Grineer","health":100,"armor":5,"shield":0,"localeName":"重击手","lFactionName":"Grineer"},"Kuva Powerfist":{"faction":"Kuva Grineer","health":100,"armor":5,"shield":0,"localeName":"Kuva Powerfist","lFactionName":"Kuva Grineer"},"ProdCrewman2":{"faction":"Corpus","health":100,"armor":0,"shield":50,"localeName":"监工船员2","lFactionName":"Corpus"},"Railgun MOA":{"faction":"Corpus","health":60,"armor":0,"shield":150,"localeName":"磁轨炮恐鸟","lFactionName":"Corpus","immun":{"status":["heat"]}},"Vapos Railgun MOA":{"faction":"Corpus","health":60,"armor":0,"shield":150,"localeName":"气雾磁轨炮恐鸟","lFactionName":"Corpus","immun":{"status":["heat"]}},"Taro Railgun MOA":{"faction":"Corpus","health":60,"armor":0,"shield":150,"localeName":"泰洛磁轨炮恐鸟","lFactionName":"Corpus","immun":{"status":["heat"]}},"Rabbleback Hyena":{"faction":"Corpus","health":800,"armor":25,"shield":500,"localeName":"烈背鬣狗","lFactionName":"Corpus"},"Ramsled":{"faction":"Grineer","health":250,"armor":175,"shield":0,"localeName":"冲锋艇","lFactionName":"Grineer"},"Raider Carver":{"faction":"Grineer","health":500,"armor":200,"shield":0,"localeName":"强袭切割者","lFactionName":"Grineer"},"Rana Del":{"faction":"Corpus","health":1000,"armor":50,"shield":2500,"localeName":"Rana Del","lFactionName":"Corpus"},"Ranger":{"faction":"Corpus","health":100,"armor":0,"shield":100,"localeName":"突击队员","lFactionName":"Corpus"},"Raider Eviscerator":{"faction":"Grineer","health":500,"armor":200,"shield":0,"localeName":"强袭开膛者","lFactionName":"Grineer"},"Raider":{"faction":"Grineer","health":500,"armor":200,"shield":0,"localeName":"强袭者","lFactionName":"Grineer"},"Ranger Crewman":{"faction":"Corpus","health":1000,"armor":0,"shield":800,"localeName":"突击船员","lFactionName":"Corpus","unique":"crewmans-rangers","elemRes":{"cold":0.75,"blast":0.75,"magnetic":0.75,"viral":0.75}},"Raptors":{"faction":"Corpus","health":2000,"armor":25,"shield":600,"localeName":"猛禽","lFactionName":"Corpus"},"Razorback":{"faction":"Corpus","health":6000,"armor":100,"shield":2000,"localeName":"利刃豺狼","lFactionName":"Corpus"},"Ratel":{"faction":"Corpus","health":10,"armor":0,"shield":30,"localeName":"蜜獾","lFactionName":"Corpus"},"Quanta Ranger":{"faction":"Corpus","health":100,"armor":0,"shield":100,"localeName":"量子切割器突击队员","lFactionName":"Corpus"},"Raptor RX":{"faction":"Corpus","health":1000,"armor":50,"shield":2500,"localeName":"猛禽RX","lFactionName":"Corpus","eximusOff":true},"Regulator":{"faction":"Grineer","health":120,"armor":200,"shield":0,"localeName":"调整者","lFactionName":"Grineer"},"Recon Commander":{"faction":"Grineer","health":1200,"armor":250,"shield":0,"localeName":"侦察指挥官","lFactionName":"Grineer"},"Remech Osprey":{"faction":"Corpus","health":250,"armor":50,"shield":200,"localeName":"再启动鱼鹰","lFactionName":"Corpus","immun":{"status":["impact"]}},"Ropalolyst":{"faction":" Sentient","health":5000,"armor":200,"shield":2000,"localeName":"蝠力使","lFactionName":" Sentient","eximusOff":true,"unique":"sentient","b_lvl":17},"Roller":{"faction":"Grineer","health":40,"armor":100,"shield":0,"localeName":"滚子","lFactionName":"Grineer","b_lvl":12},"Kuva Roller":{"faction":"Kuva Grineer","health":40,"armor":100,"shield":0,"localeName":"Kuva Roller","lFactionName":"Kuva Grineer","b_lvl":10},"Saturn Six Fugitive":{"faction":"Unaffiliated","health":800,"armor":300,"shield":0,"localeName":"土星六号逃犯","lFactionName":"Unaffiliated"},"Sapping Osprey":{"faction":"Corpus","health":200,"armor":0,"shield":50,"localeName":"基蚀鱼鹰","lFactionName":"Corpus"},"Scavenger Drone":{"faction":"Corpus","health":100,"armor":0,"shield":50,"localeName":"清道夫无人机","lFactionName":"Corpus"},"Scorpion":{"faction":"Grineer","health":150,"armor":150,"shield":0,"localeName":"天蝎","lFactionName":"Grineer","b_lvl":10},"Kuva Scorpion":{"faction":"Kuva Grineer","health":150,"armor":150,"shield":0,"localeName":"Kuva Scorpion","lFactionName":"Kuva Grineer"},"Scrambus":{"faction":"Corpus","health":1100,"armor":0,"shield":400,"localeName":"扰敌员","lFactionName":"Corpus"},"Scyto Raknoid":{"faction":"Corpus","health":5000,"armor":200,"shield":0,"localeName":"赛托蛛形机","lFactionName":"Corpus","innateDR":{"health":0.5,"armor":0.5,"shield":0.5},"immun":{"status":["impact"]},"eximusOff":true,"unique":"raknoid"},"Roller Sentry":{"faction":"Grineer","health":200,"armor":100,"shield":0,"localeName":"滚子哨兵","lFactionName":"Grineer"},"Security Infested Hive":{"faction":"Infested","health":4500,"armor":25,"shield":0,"localeName":"感染巢囊 安保","lFactionName":"感染"},"Runner":{"faction":"Infested","health":100,"armor":0,"shield":0,"localeName":"狂奔者","lFactionName":"感染"},"Sentient Research Director":{"faction":"Corpus","health":1750,"armor":100,"shield":1200,"localeName":"Sentient 研究主管","lFactionName":"Corpus"},"Shadow Stalker":{"faction":"Stalker","health":950,"armor":300,"shield":200,"localeName":"Shadow Stalker","lFactionName":"Stalker","eximusOff":true,"unique":"stalker"},"Scorch":{"faction":"Grineer","health":120,"armor":100,"shield":0,"localeName":"灼痕焦点","lFactionName":"Grineer"},"Kuva Scorch":{"faction":"Kuva Grineer","health":120,"armor":100,"shield":0,"localeName":"Kuva Scorch","lFactionName":"Kuva Grineer"},"Shield Lancer":{"faction":"Grineer","health":40,"armor":5,"shield":0,"localeName":"盾枪兵","lFactionName":"Grineer"},"Kuva Shield Lancer":{"faction":"Kuva Grineer","health":40,"armor":5,"shield":0,"localeName":"Kuva Shield Lancer","lFactionName":"Kuva Grineer","b_lvl":1},"Seeker":{"faction":"Grineer","health":100,"armor":200,"shield":0,"localeName":"弹头导引","lFactionName":"Grineer"},"Kuva Seeker":{"faction":"Kuva Grineer","health":100,"armor":200,"shield":0,"localeName":"Kuva Seeker","lFactionName":"Kuva Grineer"},"Shield Osprey":{"faction":"Corpus","health":35,"armor":0,"shield":50,"localeName":"护盾鱼鹰","lFactionName":"Corpus"},"Shield Dargyn":{"faction":"Grineer","health":100,"armor":200,"shield":0,"localeName":"护盾轻型艇","lFactionName":"Grineer"},"Shockwave MOA":{"faction":"Corpus","health":60,"armor":0,"shield":150,"localeName":"震荡恐鸟","lFactionName":"Corpus","immun":{"status":["heat"]}},"Sikula":{"faction":"Grineer","health":100,"armor":50,"shield":50,"localeName":"水雷无人机","lFactionName":"Grineer"},"Sisters of Parvos":{"faction":"Corpus","health":1,"armor":1,"shield":1,"localeName":"帕尔沃斯的姐妹们","lFactionName":"Corpus","eximusOff":true,"unique":"sister"},"Shock Draga":{"faction":"Grineer","health":150,"armor":10,"shield":0,"localeName":"电击疏浚兵","lFactionName":"Grineer"},"Spark":{"faction":"Grineer","health":300,"armor":500,"shield":0,"localeName":"火花","lFactionName":"Grineer"},"Specter (Enemy)":{"faction":"Tenno","health":200,"armor":20,"shield":80,"localeName":"魅影（敌方）","lFactionName":"Tenno"},"Stalker":{"faction":"Stalker","health":750,"armor":300,"shield":200,"localeName":"Stalker","lFactionName":"Stalker","eximusOff":true},"Shield-Hellion Dargyn":{"faction":"Grineer","health":300,"armor":200,"shield":0,"localeName":"护盾恶徒轻型艇","lFactionName":"Grineer"},"Ven'kra Tel":{"faction":"Grineer","health":400,"armor":150,"shield":0,"localeName":"Ven'kra Tel","lFactionName":"Grineer","eximusOff":true},"Stropha Crewman":{"faction":"Corpus","health":600,"armor":0,"shield":50,"localeName":"诡计之刃船员","lFactionName":"Corpus"},"Symbilyst":{"faction":"Sentient","health":1000,"armor":300,"shield":0,"localeName":"共生使","lFactionName":"Sentient","eximusOff":true,"unique":"sentient","b_lvl":10},"Stabilization Infested Hive":{"faction":"Infested","health":4500,"armor":25,"shield":0,"localeName":"感染巢囊 重力","lFactionName":"感染"},"Supressor":{"faction":"Grineer","health":300,"armor":200,"shield":0,"localeName":"怒焚镇压者","lFactionName":"Grineer"},"Summulyst":{"faction":"Sentient","health":3000,"armor":200,"shield":5000,"localeName":"召唤使","lFactionName":"Sentient","eximusOff":true,"unique":"sentient"},"Taktis":{"faction":"Grineer","health":150,"armor":125,"shield":0,"localeName":"战术战机","lFactionName":"Grineer"},"Taro Secura Osprey":{"faction":"Corpus","health":250,"armor":0,"shield":75,"localeName":"保障鱼鹰","lFactionName":"Corpus","unique":"crewmans-rangers","elemRes":{"cold":0.75,"blast":0.75,"magnetic":0.75,"viral":0.75}},"Tarask Bursa":{"faction":"Corpus","health":1200,"armor":0,"shield":800,"localeName":"穷凶金流恐鸟","lFactionName":"Corpus","eximusOff":true,"unique":"bursa"},"Swarm Mutalist MOA":{"faction":"Infested","health":350,"armor":0,"shield":0,"localeName":"异融胞群恐鸟","lFactionName":"感染","b_lvl":12},"Tusk Heavy Gunner":{"faction":"Grineer","health":300,"armor":500,"shield":0,"localeName":"巨牙重型机枪手","lFactionName":"Grineer"},"Tech":{"faction":"Corpus","health":700,"armor":0,"shield":250,"localeName":"Corpus技师","lFactionName":"Corpus"},"Temporal Dreg":{"faction":"Grineer","health":100,"armor":150,"shield":0,"localeName":"滞缓无人机","lFactionName":"Grineer"},"Terra Crewman":{"faction":"Corpus","health":100,"armor":0,"shield":200,"localeName":"大地船员","lFactionName":"Corpus","unique":"crewmans-rangers","elemRes":{"cold":0.75,"blast":0.75,"magnetic":0.75,"viral":0.75}},"Terra Manker":{"faction":"Corpus","health":900,"armor":25,"shield":800,"localeName":"大地残害者","lFactionName":"Corpus","unique":"crewmans-rangers","elemRes":{"cold":0.75,"blast":0.75,"magnetic":0.75,"viral":0.75}},"Terra Raptor SX":{"faction":"Corpus","health":750,"armor":50,"shield":1000,"localeName":"大地猛禽Sx","lFactionName":"Corpus"},"The Grustrag Three":{"faction":"Grineer","health":1700,"armor":200,"shield":0,"localeName":"Grustrag三霸","lFactionName":"Grineer","eximusOff":true},"Terra Overtaker":{"faction":"Corpus","health":400,"armor":0,"shield":250,"localeName":"大地掷弹者","lFactionName":"Corpus","unique":"crewmans-rangers","elemRes":{"cold":0.75,"blast":0.75,"magnetic":0.75,"viral":0.75}},"Terra Jailer":{"faction":"Corpus","health":600,"armor":0,"shield":500,"localeName":"大地狱吏","lFactionName":"Corpus","unique":"crewmans-rangers","elemRes":{"cold":0.75,"blast":0.75,"magnetic":0.75,"viral":0.75}},"Sniper Crewman":{"faction":"Corpus","health":60,"armor":0,"shield":150,"localeName":"狙击手船员","lFactionName":"Corpus","b_lvl":15},"The Grustrag Three/Leekter":{"faction":"","health":1700,"armor":200,"shield":0,"localeName":"Leekter","lFactionName":"","eximusOff":true},"The Grustrag Three/Shik Tal":{"faction":"","health":1700,"armor":200,"shield":0,"localeName":"Shik Tal","lFactionName":"","eximusOff":true},"Terra Trencher":{"faction":"Corpus","health":450,"armor":0,"shield":300,"localeName":"大地掘沟者","lFactionName":"Corpus","unique":"crewmans-rangers","elemRes":{"cold":0.75,"blast":0.75,"magnetic":0.75,"viral":0.75}},"The Sergeant":{"faction":"Corpus","health":500,"armor":150,"shield":1000,"localeName":"海军陆战队中士","lFactionName":"Corpus","eximusOff":true},"Thrax Legatus":{"faction":"UNKNOWN","health":3200,"armor":200,"shield":0,"localeName":"凶魂副将","lFactionName":"野生","eximusOff":true,"overguard":{"val":"10"}},"Toxic Crawler":{"faction":"Infested","health":50,"armor":0,"shield":0,"localeName":"剧毒爬行者","lFactionName":"感染"},"Tia Mayn":{"faction":"Corpus","health":1000,"armor":50,"shield":2500,"localeName":"Tia Mayn","lFactionName":"Corpus"},"Tomb Protector Effigy":{"faction":"Neutral","health":5500,"armor":250,"shield":0,"localeName":"古墓捍卫者雕像","lFactionName":"Neutral"},"Terra Plasmor Crewman":{"faction":"Corpus","health":60,"armor":0,"shield":200,"localeName":"大地离子枪船员","lFactionName":"Corpus","unique":"crewmans-rangers","elemRes":{"cold":0.75,"blast":0.75,"magnetic":0.75,"viral":0.75}},"The Grustrag Three/Vem Tabook":{"faction":"","health":1700,"armor":200,"shield":0,"localeName":"Vem Tabook","lFactionName":"","eximusOff":true},"Toxic Ancient":{"faction":"Infested","health":400,"armor":0,"shield":0,"localeName":"远古剧毒者","lFactionName":"感染"},"Tomb Guardian":{"faction":"Neutral","health":1700,"armor":150,"shield":0,"localeName":"古墓保卫者","lFactionName":"Neutral","immun":{"status":["slash"]}},"Tusk Thumper Doma":{"faction":"Grineer","health":15000,"armor":100,"shield":0,"localeName":"巨牙重击者朵玛","lFactionName":"Grineer","immun":{"status":["all"]},"eximusOff":true,"unique":"tusk-thumper"},"Undying Flyer":{"faction":"Infested","health":400,"armor":0,"shield":0,"localeName":"不死飞行者","lFactionName":"感染"},"Tusk Seeker Drone":{"faction":"Grineer","health":250,"armor":100,"shield":0,"localeName":"巨牙追踪者无人机","lFactionName":"Grineer"},"Tusk Firbolg":{"faction":"Grineer","health":8000,"armor":600,"shield":0,"localeName":"巨牙博格","lFactionName":"Grineer"},"Tusk Bolkor":{"faction":"Grineer","health":10000,"armor":600,"shield":0,"localeName":"巨牙博寇","lFactionName":"Grineer"},"Tomb Protector":{"faction":"Neutral","health":8000,"armor":250,"shield":0,"localeName":"古墓捍卫者","lFactionName":"Neutral"},"Tusk Thumper":{"faction":"Grineer","health":9000,"armor":100,"shield":0,"localeName":"巨牙重击者","lFactionName":"Grineer","immun":{"status":["all"]},"eximusOff":true,"unique":"tusk-thumper"},"Terra Provisor":{"faction":"Corpus","health":300,"armor":0,"shield":450,"localeName":"大地采办者","lFactionName":"Corpus","unique":"crewmans-rangers","elemRes":{"cold":0.75,"blast":0.75,"magnetic":0.75,"viral":0.75}},"Vapos Detron Crewman":{"faction":"Corpus","health":60,"armor":0,"shield":150,"localeName":"气雾德特昂船员","lFactionName":"Corpus"},"Terra Embattor MOA":{"faction":"Corpus","health":600,"armor":0,"shield":600,"localeName":"大地布阵恐鸟","lFactionName":"Corpus"},"Ved Xol":{"faction":"Corpus","health":1000,"armor":50,"shield":2500,"localeName":"Ved Xol","lFactionName":"Corpus"},"Vapos Sniper Ranger":{"faction":"Corpus","health":60,"armor":0,"shield":450,"localeName":"气雾狙击手突击队员","lFactionName":"Corpus","unique":"crewmans-rangers","elemRes":{"cold":0.75,"blast":0.75,"magnetic":0.75,"viral":0.75}},"Weaver":{"faction":"Corpus","health":100,"armor":75,"shield":150,"localeName":"旋织战机","lFactionName":"Corpus"},"Vapos Detron Ranger":{"faction":"Corpus","health":60,"armor":0,"shield":450,"localeName":"气雾德特昂突击队员","lFactionName":"Corpus","unique":"crewmans-rangers","elemRes":{"cold":0.75,"blast":0.75,"magnetic":0.75,"viral":0.75}},"Vapos Tech Ranger":{"faction":"Corpus","health":80,"armor":0,"shield":450,"localeName":"气雾技师突击队员","lFactionName":"Corpus","unique":"crewmans-rangers","elemRes":{"cold":0.75,"blast":0.75,"magnetic":0.75,"viral":0.75}},"Volatile Runner":{"faction":"Infested","health":80,"armor":0,"shield":0,"localeName":"爆炸奔跑者","lFactionName":"感染"},"Ven":{"faction":"Grineer","health":400,"armor":150,"shield":0,"localeName":"Ven","lFactionName":"Grineer"},"Zealot Proselytizer":{"faction":"Infestation","health":1200,"armor":200,"shield":0,"localeName":"狂热劝导者","lFactionName":"Infestation"},"Venin Mutalist":{"faction":"Infested","health":200,"armor":0,"shield":0,"localeName":"蛇毒异融体","lFactionName":"感染"},"Zanuka":{"faction":"Corpus","health":1000,"armor":25,"shield":15000,"localeName":"Zanuka","lFactionName":"Corpus","eximusOff":true},"Zealot Herald":{"faction":"Infestation","health":1000,"armor":200,"shield":0,"localeName":"狂热传令者","lFactionName":"Infestation"},"Zealot Baptizer":{"faction":"Infested","health":1200,"armor":100,"shield":0,"localeName":"狂热施洗者","lFactionName":"感染"},"Zerca":{"faction":"Corpus","health":750,"armor":0,"shield":450,"localeName":"狂暴者","lFactionName":"Corpus","unique":"empyrean-corpus"},"Vambac":{"faction":"Corpus","health":750,"armor":0,"shield":450,"localeName":"威击者","lFactionName":"Corpus","unique":"empyrean-corpus"},"Tar Mutalist MOA":{"faction":"Infested","health":350,"armor":0,"shield":0,"localeName":"异融焦油恐鸟","lFactionName":"感染"},"Vivisect Director":{"faction":"Corpus","health":1750,"armor":100,"shield":1200,"localeName":"活体解剖主管","lFactionName":"Corpus"},"Vapos Elite Ranger":{"faction":"Corpus","health":80,"armor":0,"shield":450,"localeName":"气雾精英突击队员","lFactionName":"Corpus","unique":"crewmans-rangers","elemRes":{"cold":0.75,"blast":0.75,"magnetic":0.75,"viral":0.75}},"Fire Prosecutor":{"faction":"Grineer","health":1500,"armor":5,"shield":0,"localeName":"火焰判官","lFactionName":"Grineer","immun":{"status":["heat"]},"unique":"prosecutor"},"Zealoid Prelate":{"faction":"Infested","health":9000,"armor":0,"shield":0,"localeName":"狂热主教","lFactionName":"感染","eximusOff":true,"unique":"prelate","maxProcStacks":10},"Zeplen":{"faction":"Grineer","health":400,"armor":2750,"shield":0,"localeName":"齐柏伦飞船","lFactionName":"Grineer"},"Void Angel":{"faction":"UNKNOWN","health":25000,"armor":350,"shield":100,"localeName":"虚空天使","lFactionName":"野生","eximusOff":true,"maxProcStacks":4},"Torment":{"faction":"Stalker","health":5500,"armor":50,"shield":2500,"localeName":"折磨","lFactionName":"Stalker","innateDR":{"health":0.625,"armor":0.625,"shield":0},"eximusOff":true,"unique":"acolytes","maxProcStacks":4},"Treasurer":{"faction":"Corpus","health":2500,"armor":0,"shield":150,"localeName":"司库","lFactionName":"Corpus","innateDR":{"health":0.98,"armor":0,"shield":0.99},"eximusOff":true,"unique":"treasurer"},"Vapos Nullifier Ranger":{"faction":"Corpus","health":80,"armor":0,"shield":450,"localeName":"气雾虚能突击队员","lFactionName":"Corpus","unique":"crewmans-rangers","elemRes":{"cold":0.75,"blast":0.75,"magnetic":0.75,"viral":0.75}},"Tusk Command Dargyn":{"faction":"Grineer","health":800,"armor":125,"shield":0,"localeName":"巨牙指挥轻型艇","lFactionName":"Grineer"},"Tusk Thumper Bull":{"faction":"Grineer","health":12000,"armor":100,"shield":0,"localeName":"巨牙重击者","lFactionName":"Grineer","immun":{"status":["all"]},"eximusOff":true,"unique":"tusk-thumper"},"Vapos Aquila":{"faction":"Corpus","health":1000,"armor":50,"shield":100,"localeName":"气雾天鹰","lFactionName":"Corpus"},"Thrax Centurion":{"faction":"UNKNOWN","health":3600,"armor":200,"shield":0,"localeName":"凶魂百夫长","lFactionName":"野生","eximusOff":true,"overguard":{"val":"15"}},"Tyl Regor":{"faction":"Grineer","health":3000,"armor":250,"shield":800,"localeName":"Tyl Regor","lFactionName":"Grineer","eximusOff":true},"Zealoid Bastion":{"faction":"Infested","health":950,"armor":0,"shield":0,"localeName":"狂热护卫","lFactionName":"感染"},"Trooper":{"faction":"Grineer","health":120,"armor":150,"shield":0,"localeName":"骑兵","lFactionName":"Grineer"},"Kuva Trooper":{"faction":"Kuva Grineer","health":120,"armor":150,"shield":0,"localeName":"Kuva Trooper","lFactionName":"Kuva Grineer"},"Violence":{"faction":"Stalker","health":5500,"armor":50,"shield":2500,"localeName":"暴力","lFactionName":"Stalker","innateDR":{"health":0.625,"armor":0.625,"shield":0},"eximusOff":true,"unique":"acolytes","maxProcStacks":4},"Wolf of Saturn Six":{"faction":"Unaffiliated","health":1500,"armor":200,"shield":0,"localeName":"土星六号之狼","lFactionName":"Unaffiliated","immun":{"status":["all"]},"eximusOff":true},"Zanuka Hunter":{"faction":"Corpus","health":600,"armor":25,"shield":1000,"localeName":"Zanuka猎犬","lFactionName":"Corpus"},"The Fragmented Suzerain":{"faction":"Murmur","health":50000,"armor":0,"shield":0,"localeName":"接肢宗主","lFactionName":"低语者","immun":{"status":["viral","cold"]},"eximusOff":true,"unique":"suzerain"},"The Anatomizer":{"faction":"Murmur","health":6000,"armor":0,"shield":0,"localeName":"断肢解构者","lFactionName":"低语者","b_lvl":10},"The Hollow Vein":{"faction":"Murmur","health":7500,"armor":0,"shield":0,"localeName":"断肢空脉","lFactionName":"低语者"},"Rogue Culverin":{"faction":"Murmur","health":500,"armor":175,"shield":0,"localeName":"暴戾重型炮兵","lFactionName":"低语者"},"Demolisher Voidrig":{"faction":"Murmur","health":4500,"armor":100,"shield":0,"localeName":"爆破虚空锐将","lFactionName":"低语者","eximusOff":true,"unique":"demolisherNecramech","maxProcStacks":4,"showPartyCount":true},"H-09 Efervon Tank":{"faction":"Scaldra","health":18000,"armor":100,"shield":0,"localeName":"H-09 Efervon Tank","lFactionName":"炽蛇军","eximusOff":true,"unique":"efervonTank","maxProcStacks":4},"Scaldra Jaeger":{"faction":"Scaldra","health":125,"armor":100,"shield":0,"localeName":"Scaldra Jaeger","lFactionName":"炽蛇军"},"Scaldra Flayer":{"faction":"Scaldra","health":50,"armor":10,"shield":0,"localeName":"Scaldra Flayer","lFactionName":"炽蛇军"},"Scaldra Barbican":{"faction":"Scaldra","health":125,"armor":100,"shield":0,"localeName":"Scaldra Barbican","lFactionName":"炽蛇军"},"Scaldra Eradicator":{"faction":"Scaldra","health":325,"armor":500,"shield":0,"localeName":"Scaldra Eradicator","lFactionName":"炽蛇军"},"Scaldra Dedicant":{"faction":"Scaldra","health":2000,"armor":500,"shield":0,"localeName":"Scaldra Dedicant","lFactionName":"炽蛇军","unique":"dedicant","overguard":{"val":"22"}},"Techrot Galliflex":{"faction":"Techrot","health":100,"armor":0,"shield":100,"localeName":"Techrot Galliflex","lFactionName":"科腐者"},"Techrot Volatile Galliflex":{"faction":"Techrot","health":80,"armor":0,"shield":50,"localeName":"Techrot Volatile Galliflex","lFactionName":"科腐者"},"Techrot Matmas":{"faction":"Techrot","health":300,"armor":0,"shield":150,"localeName":"Techrot Matmas","lFactionName":"科腐者"},"Techrot Skuzzi":{"faction":"Techrot","health":225,"armor":0,"shield":125,"localeName":"Techrot Skuzzi","lFactionName":"科腐者"},"Techrot Obsolyte":{"faction":"Techrot","health":400,"armor":0,"shield":200,"localeName":"Techrot Obsolyte","lFactionName":"科腐者","unique":"obsolyte"},"Techrot Babau":{"faction":"Techrot","health":10000,"armor":0,"shield":500,"localeName":"Techrot Babau","lFactionName":"科腐者","immun":{"status":["toxin","viral"]},"unique":"babau"},"Anarch Arcus":{"faction":"Anarchs","health":100,"armor":200,"shield":0,"localeName":"Anarch Arcus","lFactionName":"自由派"},"Anarch Gladius":{"faction":"Anarchs","health":175,"armor":200,"shield":0,"localeName":"Anarch Gladius","lFactionName":"自由派"},"Anarch Grineer Lancer":{"faction":"Anarchs","health":125,"armor":200,"shield":0,"localeName":"Anarch Grineer Lancer","lFactionName":"自由派"},"Anarch Grineer Trapper":{"faction":"Anarchs","health":100,"armor":200,"shield":0,"localeName":"Anarch Grineer Trapper","lFactionName":"自由派"},"Anarch Libritor":{"faction":"Anarchs","health":325,"armor":200,"shield":0,"localeName":"Anarch Libritor","lFactionName":"自由派"},"Anarch Capsarii":{"faction":"Anarchs","health":75,"armor":200,"shield":0,"localeName":"Anarch Capsarii","lFactionName":"自由派"},"Anarch Tenebra":{"faction":"Anarchs","health":100,"armor":200,"shield":0,"localeName":"Anarch Tenebra","lFactionName":"自由派"}},

  // === MOD 中文名映射 ===
  MOD_NAMES_ZH: {"Serration":"膛线","Amalgam Serration":"并合膛线","Spectral Serration":"幽灵 膛线","Higasa Serration":"晴日伞 膛线","Semi-Rifle Cannonade":"半自动步枪炮轰","Hornet Strike":"黄蜂螫刺","Augur Pact":"预言契约","Magnum Force":"重装火力","Semi-Pistol Cannonade":"半自动手枪炮轰","Heavy Caliber":"重口径","Primary Acuity":"敏锐主武","Pistol Acuity":"敏锐手枪","Galvanized Aptitude":"镀层步枪才能","Galvanized Shot":"镀层准确射手","Galvanized Savvy":"镀层通晓霰弹枪","Point Blank":"抵近射击","Primed Point Blank":"抵近射击Prime","Semi-Shotgun Cannonade":"半自动霰弹枪炮轰","Pressure Point":"压迫点","Primed Pressure Point":"压迫点Prime","Sacrificial Pressure":"牺牲压迫点","Condition Overload":"异况超量","Spoiled Strike":"腐坏打击","Vicious Spread":"恶性扩散","Galvanized Elementalist":"镀层 元素师","Melee Elementalist":"近战元素师","Rifle Elementalist":"步枪元素师","Pistol Elementalist":"手枪元素师","Shotgun Elementalist":"霰弹枪元素师","Stormbringer":"暴风使者","Cryo Rounds":"低温弹头","Primed Cryo Rounds":"低温弹头Prime","Hellfire":"地狱火","Infected Clip":"污染弹匣","Malignant Force":"致命火力","Rime Rounds":"白霜弹头","Thermite Rounds":"铝热焊弹","Wildfire":"野火","High Voltage":"高压电流","Pathogen Rounds":"病原弹头","Heated Charge":"火焰装填","Primed Heated Charge":"火焰装填Prime","Deep Freeze":"深层冷冻","Convulsion":"痉挛","Primed Convulsion":"痉挛 Prime","Fever Strike":"热病打击","Primed Fever Strike":"热病打击Prime","Virulent Scourge":"剧毒灾害","North Wind":"北风","Vicious Frost":"蚀骨寒霜","Molten Impact":"熔岩冲击","Volcanic Edge":"爆裂刀刃","Shocking Touch":"电击触点","Voltaic Strike":"伏打电能","Focus Energy":"聚焦能量","Point Strike":"致命一击","Vital Sense":"弱点感应","Critical Delay":"关键延迟","Pistol Gambit":"手枪精通","Primed Pistol Gambit":"手枪精通Prime","Target Cracker":"弱点专精","Primed Target Cracker":"弱点专精Prime","Hollow Point":"空尖弹","Galvanized Steel":"镀层 斩铁","Proton Jet":"质子喷射","Blunderbuss":"雷筒","Critical Deceleration":"降速暴击","Creeping Bullseye":"匍匐靶心","Argon Scope":"氩晶瞄具","Galvanized Scope":"镀层氩晶瞄具","Hydraulic Crosshairs":"液压准心","Galvanized Crosshairs":"镀层液压准心","Blood Rush":"急进猛突","Maiming Strike":"致残突击","Hammer Shot":"重锤射击","Melee Prowess":"非凡技巧","Weeping Wounds":"创口溃烂","Organ Shatter":"肢解","Amalgam Organ Shatter":"并合肢解","Gladiator Might":"角斗士威猛","Gladiator Vice":"角斗士钳制","Gladiator Rush":"角斗士猛突","True Steel":"斩铁","Sacrificial Steel":"牺牲斩铁","Split Chamber":"分裂膛室","Galvanized Chamber":"镀层分裂膛室","Galvanized Diffusion":"镀层弹头扩散","Galvanized Hell":"镀层地狱弹膛","Hell's Chamber":"地狱弹膛","Barrel Diffusion":"弹头扩散","Amalgam Barrel Diffusion":"并合弹头扩散","Split Flights":"分裂飞行","Vigilante Armaments":"私法军备","Speed Trigger":"灵敏扳机","Vile Acceleration":"卑劣加速","Frail Momentum":"虚弱动能","Gunslinger":"神枪手","Anemic Agility":"乏能迅敏","Vile Precision":"极恶精准","Pressurized Magazine":"增压弹匣","Vigilante Fervor":"私法热诚","Primed Shred":"撕裂Prime","Shred":"撕裂","Berserker Fury":"嗜血狂暴","Fury":"狂暴","Primed Fury":"狂暴Prime","Quickening":"加速","Rifle Aptitude":"步枪才能","Sure Shot":"准确射手","Bladed Rounds":"尖刃弹头","Primed Reach":"剑风Prime","Reach":"剑风","Hunter Munitions":"猎人战备","Internal Bleeding":"内部出血","Hemorrhage":"失血","Lethal Torrent":"致命洪流","Body Count":"杀伤计数","Drifting Contact":"漂移接触","Corrupt Charge":"邪恶蓄力","Life Strike":"生命打击","Killing Blow":"一击必杀","Seismic Wave":"震波","Primed Fast Hands":"爆发装填Prime","Fast Hands":"爆发装填","Quickdraw":"持续火力","Primed Quickdraw":"持续火力Prime","Magazine Warp":"弹匣增幅","Primed Magazine Warp":"弹匣增幅Prime","Ammo Stock":"霰弹扩充","Primed Ammo Stock":"霰弹扩充Prime","Metal Auger":"合金钻头","Seeking Force":"穿透力","Seeker":"弹头导引","Rifle Ammo Mutation":"步枪弹药转换","Primed Rifle Ammo Mutation":"步枪弹药转换Prime","Pistol Ammo Mutation":"手枪弹药转换","Primed Pistol Ammo Mutation":"手枪弹药转换Prime","Sniper Ammo Mutation":"狙击枪弹药转换","Primed Sniper Ammo Mutation":"狙击枪弹药转换Prime","Rupture":"破裂","Piercing Hit":"穿甲伤害","Piercing Caliber":"穿甲口径","Sawtooth Clip":"锯齿弹链","Fanged Fusillade":"尖牙连射","Crash Course":"连续冲击","Bore":"枪膛","Maim":"致残枪弹","Buzz Kill":"败兴虐杀","Jagged Edge":"锯刃","Heavy Trauma":"重创","Primed Heavy Trauma":"重创Prime","Bane of Grineer":"灭亡Grineer","Primed Bane of Grineer":"灭亡GrineerPrime","Bane of Corpus":"灭亡Corpus","Primed Bane of Corpus":"灭亡CorpusPrime","Bane of Infested":"灭亡Infested","Primed Bane of Infested":"灭亡InfestedPrime","Smite Grineer":"毁灭Grineer","Primed Smite Grineer":"毁灭GrineerPrime","Smite Corpus":"毁灭Corpus","Primed Smite Corpus":"毁灭CorpusPrime","Smite Infested":"毁灭 Infested","Primed Smite Infested":"毁灭InfestedPrime","Primary Merciless":"主要无情是","Primary Deadhead":"主要死首","Primary Dexterity":"主要熟练","Secondary Merciless":"次要无情","Secondary Deadhead":"次要死首","Secondary Dexterity":"次要熟练","Arcane Rage":"愤怒赋能","Arcane Precision":"精确赋能","Arcane Fury":"狂怒赋能","Arcane Avenger":"复仇者赋能","Arcane Velocity":"迅速赋能","Arcane Acceleration":"加速赋能","Arcane Strike":"速攻赋能","Arcane Tempo":"节奏赋能","Arcane Momentum":"动量赋能","Arcane Awakening":"觉醒赋能","Arcane Rise":"崛起赋能","Arcane Blade Charger":"刀刃充能赋能","Arcane Primary Charger":"主武充能赋能","Arcane Pistoleer":"枪炮赋能","Arcane Arachne":"蜘蛛赋能","Arcane Crepuscular":"赋能·影袭","Melee Retaliation":"近战报复","Melee Influence":"近战·侵染","Melee Duplicate":"近战刃影","Melee Crescendo":"近战渐强","Melee Exposure":"近战暴露","Ready Steel":"磨砺锋刃","Champion's Blessing":"强者祝福","Biting Frost":"刺骨寒霜","Reinforced Bond":"强固连结","Tenacious Bond":"坚韧连结","Vigorous Swap":"强力切换","Galvanized Reflex":"镀层 增幅线圈","Reflex Coil":"增幅线圈","Blind Justice":"无明制裁","Tranquil Cleave":"秋风落叶","Decisive Judgement":"果断裁决","Iron Phoenix":"钢铁凤凰","Crimson Dervish":"赤红狂舞","Tempo Royale":"皇家节奏","Cleaving Whirlwind":"弧刃回天","Bullet Dance":"刀锋弹舞","High Noon":"正午","Exalted Blade":"显赫刀剑","Rifle Amp":"步枪增幅","Pistol Amp":"手枪增幅","Shotgun Amp":"霰弹枪增幅","Dead Eye":"死亡之眼","Steel Charge":"钢铁充能","Corrosive Projection":"腐蚀投射","Magnetic Capacity":"磁性弹容","Magnetic Rush":"励磁加速","Magnetic Strafe":"磁暴洗礼","Magnetic Might":"磁吸巨力","Magnetic Welt":"磁化冲击","Enduring Affliction":"长时苦难","Covert Lethality":"致命匿杀","Finishing Touch":"画龙点睛","Archon Continuity":"执刑官 持久力","Archon Vitality":"执刑官生命力","Pain Points":"痛点","Dreadful Killshot":"恐怖杀戮","Amar's Contempt":"欺谋狼主之鄙","Boreal's Contempt":"诡文枭主之鄙","Burning Hate":"炽烈憎恨","Hunter's Bonesaw":"猎人骨锯","Nira's Contempt":"混沌蛇主之鄙","Sentient Surge":"Sentient涌现","Double Tap":"双重连击","Spring-Loaded Broadhead":"簧压猎箭","Pistol Pestilence":"瘟疫手枪","Contagious Spread":"传染蔓延","Primed Chilling Grasp":"急冻控场Prime","Toxic Blight":"毁坏毒素","Toxic Barrage":"毒素弹幕","Incendiary Coat":"燃烧外壳","Blaze":"烈焰","Scattering Inferno":"炼狱轰击","Scorch":"灼痕焦点","Chilling Grasp":"急冻控场","Chilling Reload":"激冷装填","Frigid Blast":"冰冷疾风","Frostbite":"结霜侵蚀","Ice Storm":"冰风暴","Charged Shell":"充电弹头","Primed Charged Shell":"充电弹头Prime","Shell Shock":"电冲弹药","Jolt":"电流震击","Damzav-Vati":"剧毒射击","Deadly Maneuvers":"致命机动","Deadly Sequence":"致命数列","Exposing Harpoon":"暴露鱼叉","Hata-Satya":"真实击杀","Motus Setup":"跃动设局","Proton Snap":"质子猛扑","Merciless Gunfight":"无情枪斗","Unseen Dread":"潜隐恐惧","Laser Sight":"雷射瞄具","Shrapnel Shot":"破片射击","Sharpened Bullets":"尖锐子弹","Dreamer's Wrath":"梦者之怒","Primed Ravage":"破灭Prime","Ravage":"破灭","Scattered Justice":"散射正义","Critical Mutation":"关键突变","Shrapnel Rounds":"破片弹头","Gilded Truth":"镀金真相","Accelerated Blast":"加速冲击","Shotgun Barrage":"霰弹弹幕","Amalgam Shotgun Barrage":"并合霰弹弹幕","Repeater Clip":"转轮弹匣","Spring-Loaded Chamber":"簧压膛室","Vigilante Supplies":"私法补给","Amalgam Daikyu Target Acquired":"并合大久和弓锁定目标","Efficient Beams":"高效光束","Napalm Grenades":"凝固汽油榴弹","Entropy Burst":"熵数爆发","Eroding Blight":"侵蚀毁坏","Stockpiled Blight":"积存毁坏","Gleaming Blight":"毁坏微光","Justice Blades":"正义刀锋","Shattering Justice":"破碎正义","Acid Shells":"酸性弹药","Clip Delegation":"弹能过继","Bright Purity":"光明纯净","Winds of Purity":"纯净之风","Blade of Truth":"真相之刃","Stinging Truth":"过激真相","Dizzying Rounds":"晕眩弹药","Flux Overdrive":"通量步枪超载","Stunning Speed":"慑人神速","Precision Strike":"精准打击","Combat Reload":"战斗装填","Depleted Reload":"耗竭装填","Range Advantage":"优势距离","Eximus Advantage":"卓越者优势","Bhisaj-Bal":"治愈羽箭","Aero Agility":"空飞灵巧","Emergent Aftermath":"紧急后果","Tactical Pump":"战术上膛","Primed Tactical Pump":"战术上膛Prime","Trick Mag":"戏法增幅","Eagle Eye":"鹰眼","Burdened Magazine":"过载弹匣","Shell Compression":"压缩弹药","Guardian Derision":"奚落守护","Metamorphic Magazine":"异变弹匣","Target Acquired":"锁定目标","Primed Slip Magazine":"串联弹匣Prime","Slip Magazine":"串联弹匣","Amalgam Javlok Magazine Warp":"并合燃焰标枪弹匣增幅","Zazvat-Kar":"无尽弹雨","Skull Shots":"头颅射击","Brain Storm":"头脑风暴","Lethal Momentum":"致命动量","Terminal Velocity":"极限速度","Fatal Acceleration":"致死加速","Focused Acceleration":"聚焦加速","Ammo Drum":"弹鼓","Bane Of The Murmur":"灭亡低语者","Primed Bane of The Murmur":"灭亡低语者 Prime","Primed Expel Corpus":"驱逐CorpusPrime","Primed Expel Grineer":"驱逐GrineerPrime","Expel Grineer":"驱逐Grineer","Primed Expel Corrupted":"驱逐堕落者Prime","Expel Infested":"驱逐Infested","Expel The Murmur":"驱逐低语者","Primed Expel The Murmur":"驱逐低语者 Prime","Primed Expel Infested":"驱逐InfestedPrime","Primed Bane of Corrupted":"灭亡堕落者Prime","Bane of Corrupted":"灭亡Orokin","Primed Smite Corrupted":"毁灭堕落者Prime","Smite The Murmur":"毁灭低语者","Primed Smite The Murmur":"毁灭低语者 Prime","Primed Cleanse Corrupted":"净化堕落者Prime","Cleanse Corrupted":"净化堕落者","Primed Cleanse Grineer":"净化GrineerPrime","Cleanse Grineer":"净化Grineer","Cleanse The Murmur":"净化低语者","Primed Cleanse Infested":"净化InfestedPrime","Cleanse Infested":"净化Infested","Primed Cleanse Corpus":"净化CorpusPrime","Cleanse Corpus":"净化Corpus","Catalyzer Link":"触媒连动","Nano-Applicator":"纳米涂覆","Shotgun Savvy":"通晓霰弹枪","Embedded Catalyzer":"内置触媒","Spring-Loaded Blade":"簧压刀刃","Radiated Reload":"辐能装填","Atomic Fallout":"原子烟尘","Accelerated Isotope":"迅发核素","Focus Radon":"聚焦氡气","Leaded Gas":"毒气铅弹","Biotic Rounds":"生化弹药","Flechette":"箭型弹头","Breach Loader":"破裂填装","No Return":"有去无回","Jugulus Barbs":"喉骨刃者倒刺","Jugulus Spines":"喉骨刃者脊刺","Sundering Strike":"破甲","Auger Strike":"螺钻打击","Rending Strike":"撕裂打击","Disruptor":"冲击干扰","Full Contact":"全面接触","Pummel":"强力猛击","Concussion Rounds":"震荡弹头","Collision Force":"冲击巨力","Saxum Thorax":"重岩者胸腔","Saxum Spittle":"重岩者唾液","Shredder":"粉碎器","Sweeping Serration":"扫荡锯齿","Tainted Mag":"腐败弹匣","Tainted Clip":"感染弹匣","Razor Shot":"剃刀射击","Carnis Stinger":"肉碾虫针刺","Sharpshooter":"神射手","Seeking Fury":"狂暴追猎","Power Throw":"奋力一掷","Charged Chamber":"蓄力装填","Primed Chamber":"膛室Prime","Synth Charge":"合成充能","Vigilante Offense":"私法进攻","Carnis Mandible":"肉碾虫巨颚","Continuous Misery":"无尽苦难","Lasting Sting":"未完之刺","Augur Seeker":"预言探求","Hunter Track":"猎人追踪","Perpetual Agony":"永恒苦痛","Lingering Torment":"恒久折磨","Primed Fulmination":"猛烈爆发Prime","Primed Firestorm":"烈焰风暴Prime","Galvanized Acceleration":"镀层致死加速","Sinister Reach":"凶恶延伸","Stabilizer":"稳定","Counterbalance":"制衡","Steady Hands":"稳定枪手","Primed Steady Hands":"稳定枪手Prime","Ruinous Extension":"毁灭扩展","Hush":"消音器","Suppress":"消音","Silent Battery":"寂静炮组","Volatile Quick Return":"易爆速返","Volatile Rebound":"易爆反弹","Quick Return":"快速收回","Rebound":"弹跳","Harkonar Scope":"哈库那瞄准镜","Combo Killer":"连击杀手","Whirlwind":"旋风","Hawk Eye":"隼目","Narrow Barrel":"狭窄枪膛","Healing Return":"治愈归复","Relentless Combination":"残酷组合","Nightwatch Napalm":"夜巡燃烧弹","Rubedo-Lined Barrel":"红晶枪管","Primed Rubedo-Lined Barrel":"红晶枪管 Prime","Primed Deadly Efficiency":"致命效率 Prime","Parallax Scope":"视差瞄具","Dual Rounds":"双重弹头","Primed Dual Rounds":"双重弹头 Prime","Critical Focus":"关键焦点","Hollowed Bullets":"中空子弹","Photon Overcharge":"光子过载","Necrophagic Vigor":"噬尸活力","Deadly Efficiency":"致命效率","Venomous Clip":"恶毒弹匣","Primed Venomous Clip":"恶毒弹匣 Prime","Polar Magazine":"极地弹仓","Combustion Rounds":"燃烧弹头","Primed Combustion Rounds":"燃烧弹头 Prime","Electrified Barrel":"带电枪管","Magnetized Cycle":"磁场循环","Magazine Extension":"扩充弹匣","Modified Munitions":"弹药改良","Quick Reload":"快速装填","Ammo Chain":"弹链","Ballista Measure":"弩炮测距","Automatic Trigger":"自动扳机","Shell Rush":"填弹加速","Archgun Ace":"Archwing 枪械行家","Hypothermic Shell":"低温外壳","Contamination Casing":"毒染套管","Charged Bullets":"带电子弹","Magma Chamber":"熔岩弹膛","Sabot Rounds":"覆壳弹药","Containment Breach":"核控突破","Marked Target":"标记目标","Zodiac Shred":"黄道碎裂","Quasar Drill":"类星钻体","Comet Blast":"彗星爆发","Resolute Focus":"坚决专注","Shivering Contagion":"冷颤触染","Parry":"招架","Opportunity's Reach":"机遇所至","Mentor's Legacy":"师传秘技","Master's Edge":"宗师锐势","Focused Defense":"重点防御","Dispatch Overdrive":"超速击杀","Discipline's Merit":"纪律之功","Condition's Perfection":"极致境地","Defiled Snapdragon":"积秽骁龙","Crossing Snakes":"双蛇牙突","Swirling Tiger":"旋风虎击","Carving Mantis":"雕斩螳螂","Cyclone Kraken":"飓风海怪","Sundering Weave":"分裂编织","Vulpine Mask":"狡狐诈面","Wise Razor":"慧黠斩剃","Vengeful Revenant":"复仇亡灵","Swooping Falcon":"猎鹰俯击","Eleventh Storm":"终焉风暴","Final Harbinger":"最终先驱","Slicing Feathers":"割裂羽翼","Votive Onslaught":"埋首猛击","Homing Fang":"连牙追袭","Pointed Wind":"尖锐之风","Stinging Thorn":"螫刺狂棘","Seismic Palm":"震撼冲拳","Fracturing Wind":"破碎之风","Gaia's Tragedy":"母神悲歌","Grim Fury":"冷面狂怒","Brutal Tide":"残暴浪潮","Shimmering Blight":"飞光荒疫","Bleeding Willow":"血色万柳","Twirling Spire":"回转尖峰","Reaping Spiral":"收割螺旋","Stalking Fan":"缠旋风切","Clashing Forest":"巨林冲击","Flailing Branch":"多流抽击","Butcher's Revelry":"屠戮盛宴","Shattering Storm":"云暴山碎","Crushing Ruin":"月落乌啼","Rending Crane":"撕裂鹤击","Galeforce Dawn":"狂风压境","Astral Twilight":"星界微光","Gleaming Talon":"微光利爪","Atlantis Vulcan":"深渊之火","Gemini Cross":"纵横双子","Sovereign Outcast":"至尊浪人","Burning Wasp":"炙热黄蜂","Coiling Viper":"毒蛇螺旋","Malicious Raptor":"恶毒猛禽","Four Riders":"天启异象","Vermillion Storm":"朱红暴风","Ravenous Wraith":"贪婪怨灵","Gnashing Payara":"狼鱼咬咬","Spinning Needle":"旋压刺针","Sinking Talon":"沉没之爪","Hysteria":"狂化爆发","Serene Storm":"宁静风暴","Primal Fury":"原始狂怒","Mountain's Edge":"山之锋芒","Harrowing Spire":"胆寒尖刺","Blade Storm":"Blade Storm","Razorwing":"剃刀之翼","Cascadia Overcharge":"瀑流溢能","Cascadia Flare":"瀑流耀炎","Secondary Encumber":"次要妨害","Secondary Shiver":"次要·冷颤","Secondary Enervate":"次要·失活","Melee Doughty":"近战·无畏","Primary Frostbite":"主要·霜冻","Primary Debilitate":"主要·衰弱","Primary Bulwark":"主要·堡垒","Primary Overcharge":"主要·过载","Primary Crux":"主要·准星","Primary Plated Round":"主要·镀金弹头","Longbow Sharpshot":"弓箭·利矢","Fractalized Reset":"分形重置","Shotgun Vendetta":"霰弹·仇杀","Primary Blight":"主要·毁灭","Melee Careen":"近战·疾驰","Melee Vortex":"近战漩涡","Akimbo Slip Shot":"双枪·滑射","Secondary Outburst":"次要·爆发","Secondary Fortifier":"次要·筑垒","Secondary Irradiate":"次要·照射","Secondary Surge":"次要·激涌","Secondary Kinship":"次要·手足","Conjunction Voltage":"联结·电压","Worthy Comradery":"可靠战友","Holster Amp":"切换增幅","Swift Momentum":"迅敏动量","Mecha Empowered":"机甲 强化","Empowered Blades":"强化刀锋","Sentient Incision":"Sentient 切口","Reactive Storm":"响应风暴","Chromatic Blade":"华彩刀剑","Venom Dose":"猛毒附加","Shock Trooper":"电击奇兵","Freeze Force":"寒冰之力","Fireball Frenzy":"狂热火球","Thermal Transfer":"热能传递","Smite Infusion":"惩击洗礼","Enraged":"狂化震怒","Merulina Guardian":"涌浪之护","Gladiator Aegis":"角斗士圣盾","Gladiator Resolve":"角斗士决心","Gladiator Finesse":"角斗士灵巧","Nira's Anguish":"混沌蛇主之苦","Nira's Hatred":"混沌蛇主之恨","Tek Collateral":"技法连带","Vigilante Pursuit":"私法追踪","Vigilante Vigor":"私法活力","Smoke Shadow":"庇护烟幕","Cascadia Empowered":"瀑流·强化","Arcane Hot Shot":"赋能·热火","Primal Rage":"原始暴怒","+25% Critical Damage":"+25% 暴击伤害","+37.5% Critical Damage":"+37.5% 暴击伤害","+25% Status Chance":"+25% 异常状态触发几率","+37.5% Status Chance":"+37.5% 异常状态触发几率","+25% Critical Chance":"+25% 暴击几率的","+37.5% Critical Chance":"+37.5% 暴击几率的","+50% Critical Chance":"+50% Critical Chance","+75% Critical Chance":"+75% Critical Chance","+50% Critical Damage":"+50% Critical Damage","+75% Critical Damage":"+75% Critical Damage","Incr. max stacks of Corrosion +2":"Incr. max stacks of Corrosion +2","Incr. max stacks of Corrosion +3":"Incr. max stacks of Corrosion +3","Toxin Status +30% more damage":"Toxin Status +30% more damage","Toxin Status +45% more damage":"Toxin Status +45% more damage","+30% Primary Electricity Damage":"+30% Primary Electricity Damage","+45% Primary Electricity Damage":"+45% Primary Electricity Damage","+10% Ability Damage affected by Electricity":"+10% Ability Damage affected by Electricity","+15% Ability Damage affected by Electricity":"+15% Ability Damage affected by Electricity"},

  // === 工具方法 ===
  getAllWeapons() { return this.weaponList; },
  getWeaponData(name) { return this.weapons[name] || null; },
  getAllMods() { return this.mods; },
  getModsForWeapon(category) {
    const tagMap = {
      Primary: ['primary-rifle','primary-bow','primary-sniper','primary','primary-shotgun','primary-archgun'],
      Secondary: ['secondary'],
      Melee: ['melee'],
      Shotgun: ['primary-shotgun']
    };
    const tags = tagMap[category] || [];
    return this.mods.filter(mod => mod.tags.some(t => tags.includes(t)));
  },
  getAllEnemies() { return this.enemies; },
  getEnemyByName(name) { return this.enemies[name] || null; },

  scaleEnemy(enemy, level, steelPath = false, eximus = false) {
    const bLvl = enemy.b_lvl || 1;
    const delta = Math.max(0, level - bLvl);
    const trans = (a, b, c, d) => {
      if (c - d < a) return 0;
      if (c - d > b) return 1;
      const t = (c - d - a) / (b - a);
      return 3 * Math.pow(t, 2) - 2 * Math.pow(t, 3);
    };
    
    const faction = enemy.faction || 'Unknown';
    
    let k, r, v, u, x, w;
    
    switch (faction) {
      case 'Infested Deimos':
      case 'Infested':
        r = 1 + 0.0225 * Math.pow(delta, 2.12);
        x = 1 + 36 * Math.pow(delta, 0.72) * Math.sqrt(5) / 5;
        k = 1 + 0.02 * Math.pow(delta, 1.75);
        u = 1 + 1.6 * Math.pow(delta, 0.75);
        v = 1 + 0.005 * Math.pow(delta, 1.75);
        w = 1 + 0.4 * Math.pow(delta, 0.75);
        break;
      case 'Corpus':
        r = 1 + 0.015 * Math.pow(delta, 2.12);
        x = 1 + 30 * Math.pow(delta, 0.55) * Math.sqrt(5) / 5;
        k = 1 + 0.02 * Math.pow(delta, 1.76);
        u = 1 + 2 * Math.pow(delta, 0.76);
        v = 1 + 0.005 * Math.pow(delta, 1.75);
        w = 1 + 0.4 * Math.pow(delta, 0.75);
        break;
      case 'Kuva Grineer':
      case 'Grineer':
        r = 1 + 0.015 * Math.pow(delta, 2.12);
        x = 1 + 24 * Math.pow(delta, 0.72) * Math.sqrt(5) / 5;
        k = 1 + 0.02 * Math.pow(delta, 1.75);
        u = 1 + 1.6 * Math.pow(delta, 0.75);
        v = 1 + 0.005 * Math.pow(delta, 1.75);
        w = 1 + 0.4 * Math.pow(delta, 0.75);
        break;
      case 'Orokin':
        r = 1 + 0.015 * Math.pow(delta, 2.1);
        x = 1 + 24 * Math.pow(delta, 0.685) * Math.sqrt(5) / 5;
        k = 1 + 0.02 * Math.pow(delta, 1.75);
        u = 1 + 2 * Math.pow(delta, 0.75);
        v = 1 + 0.005 * Math.pow(delta, 1.75);
        w = 1 + 0.4 * Math.pow(delta, 0.75);
        break;
      case 'Techrot':
        r = 1 + 0.015 * Math.pow(delta, 2.1);
        x = 1 + 30.5 * Math.pow(delta, 0.72) * Math.sqrt(5) / 5;
        k = 1 + 0.02 * Math.pow(delta, 1.76);
        u = 1 + 3.4106 * Math.pow(delta, 0.76);
        v = 1 + 0.005 * Math.pow(delta, 1.75);
        w = 1 + 0.4 * Math.pow(delta, 0.75);
        break;
      case 'Sentient':
      case 'Neutral':
      case 'Murmur':
        r = 1 + 0.015 * Math.pow(delta, 2);
        x = 1 + 24 * Math.pow(delta, 0.5) * Math.sqrt(5) / 5;
        k = 1 + 0.02 * Math.pow(delta, 1.75);
        u = 1 + 2 * Math.pow(delta, 0.75);
        v = 1 + 0.005 * Math.pow(delta, 1.75);
        w = 1 + 0.4 * Math.pow(delta, 0.75);
        break;
      default:
        k = 1 + 0.02 * Math.pow(delta, 1.75);
        r = 1 + 0.015 * Math.pow(delta, 2);
        v = 1 + 0.005 * Math.pow(delta, 1.75);
        u = 1 + 1.6 * Math.pow(delta, 0.75);
        x = 1 + 24 * Math.sqrt(delta) * Math.sqrt(5) / 5;
        w = 1 + 0.4 * Math.pow(delta, 0.75);
    }
    
    const shieldScale = k * (1 - trans(70, 80, level, bLvl)) + u * trans(70, 80, level, bLvl);
    const healthScale = r * (1 - trans(70, 80, level, bLvl)) + x * trans(70, 80, level, bLvl);
    const armorScale = v * (1 - trans(70, 80, level, bLvl)) + w * trans(70, 80, level, bLvl);

    let finalArmor = enemy.armor > 0
      ? Math.min(this.ARMOR_CAP, Math.floor(enemy.armor * armorScale))
      : 0;
    let finalHealth = Math.floor(enemy.health * healthScale);
    let finalShield = Math.floor(enemy.shield * shieldScale);

    if (steelPath) {
      finalHealth = Math.floor(finalHealth * 2.5);
      finalShield = Math.floor(finalShield * 2.5);
      finalArmor = Math.floor(finalArmor * 2.5);
    }

    if (eximus) {
      const eximusArmorScale = this.enemyEximusArmor(level);
      finalArmor = Math.floor(enemy.armor * eximusArmorScale);
      
      const eximusHealthScale = this.enemyEximusHealth(level);
      finalHealth = Math.floor(enemy.health * eximusHealthScale);
      
      const eximusShieldScale = this.enemyEximusShields(level);
      finalShield = Math.floor(enemy.shield * eximusShieldScale);
      
      if (steelPath) {
        finalHealth = Math.floor(finalHealth * 2.5);
        finalShield = Math.floor(finalShield * 2.5);
        finalArmor = Math.floor(finalArmor * 2.5);
      }
    }

    return { ...enemy, health: finalHealth, armor: finalArmor, shield: finalShield, currentLevel: level };
  },

  scaleCurve(d, c1, e1, c2, e2, lo, hi) {
    const smoothstep = t => t * t * (3 - 2 * t);
    const f1 = 1 + c1 * Math.pow(d, e1);
    const f2 = 1 + c2 * Math.pow(d, e2);
    const t = Math.min(1, Math.max(0, (d - lo) / (hi - lo)));
    return f1 * (1 - smoothstep(t)) + f2 * smoothstep(t);
  },

  enemyEximusArmor(level) {
    const baseLevel = 1;
    const delta = Math.max(0, level - baseLevel);
    
    if (level >= 100) {
      return 1.625 * (1 + 0.02 * Math.pow(delta, 1.75));
    }
    
    if (level < 45) {
      return 1 + 0.02 * Math.pow(delta, 1.75);
    }
    
    if (level >= 45 && level <= 50) {
      return 1 + 0.02 * Math.pow(delta, 1.75);
    }
    
    // 45-100级平滑过渡
    const t = Math.min(1, Math.max(0, (delta - 45) / 55));
    const low = 1 + 0.02 * Math.pow(delta, 1.75);
    const high = 1.625 * (1 + 0.02 * Math.pow(delta, 1.75));
    const smoothstep = t => t * t * (3 - 2 * t);
    return low * (1 - smoothstep(t)) + high * smoothstep(t);
  },

  enemyEximusHealth(level) {
    const baseLevel = 1;
    const delta = Math.max(0, level - baseLevel);
    
    if (level >= 100) {
      return 6 * (1 + 0.015 * Math.pow(delta, 2.12));
    }
    
    if (level < 45) {
      return 1 + 0.015 * Math.pow(delta, 2.12);
    }
    
    if (level >= 45 && level <= 50) {
      return 1 + 0.015 * Math.pow(delta, 2.12);
    }
    
    // 45-100级平滑过渡
    const t = Math.min(1, Math.max(0, (delta - 45) / 55));
    const low = 1 + 0.015 * Math.pow(delta, 2.12);
    const high = 6 * (1 + 0.015 * Math.pow(delta, 2.12));
    const smoothstep = t => t * t * (3 - 2 * t);
    return low * (1 - smoothstep(t)) + high * smoothstep(t);
  },

  enemyEximusShields(level) {
    const baseLevel = 1;
    const delta = Math.max(0, level - baseLevel);
    
    if (level >= 100) {
      return 4 * (1 + 0.02 * Math.pow(delta, 1.76));
    }
    
    if (level < 45) {
      return 1 + 0.02 * Math.pow(delta, 1.76);
    }
    
    if (level >= 45 && level <= 50) {
      return 1 + 0.02 * Math.pow(delta, 1.76);
    }
    
    // 45-100级平滑过渡
    const t = Math.min(1, Math.max(0, (delta - 45) / 55));
    const low = 1 + 0.02 * Math.pow(delta, 1.76);
    const high = 4 * (1 + 0.02 * Math.pow(delta, 1.76));
    const smoothstep = t => t * t * (3 - 2 * t);
    return low * (1 - smoothstep(t)) + high * smoothstep(t);
  },

  // === Zaw 组件数据 ===
  ZAW_STRIKES: {
    "Balla":           { speed: 0.083 },
    "Cyath":           { speed: 0 },
    "Dehtat":          { speed: 0.083 },
    "Dokrahm":         { speed: 0.083 },
    "Kronsh":          { speed: -0.067 },
    "Mewan":           { speed: -0.067 },
    "Ooltha":          { speed: 0 },
    "Rabvee":          { speed: -0.067 },
    "Sepfahn":         { speed: 0 },
    "Plague Keewar":   { speed: -0.033 },
    "Plague Kripath":  { speed: 0.033 }
  },

  ZAW_GRIPS: {
    "Jayap":         { damage: 0,   speed: 0.917, type: ["melee-staff","melee-polearm"] },
    "Korb":          { damage: 28,  speed: 0.783, type: ["melee-dagger","melee-machete","melee-nikana","melee-rapier","melee-scythes","melee-sword"] },
    "Kroostra":      { damage: 14,  speed: 0.85,  type: ["melee-staff","melee-polearm"] },
    "Kwath":         { damage: 14,  speed: 0.85,  type: ["melee-sword","melee-machete","melee-rapier","melee-dagger","melee-nikana","melee-scythes"] },
    "Laka":          { damage: 0,   speed: 0.917, type: ["melee-sword","melee-machete","melee-rapier","melee-dagger","melee-nikana","melee-scythes"] },
    "Peye":          { damage: -4,  speed: 1,     type: ["melee-sword","melee-machete","melee-rapier","melee-dagger","melee-nikana","melee-scythes"] },
    "Seekalla":      { damage: -4,  speed: 1,     type: ["melee-staff","melee-polearm","melee-heavyblade"] },
    "Shtung":        { damage: 28,  speed: 0.783, type: ["melee-hammer","melee-heavyblade","melee-polearm","melee-staff"] },
    "Plague Akwin":  { damage: -2,  speed: 0.95,  type: ["melee-sword","melee-machete","melee-rapier","melee-dagger","melee-nikana","melee-scythes"] },
    "Plague Bokwin": { damage: 7,   speed: 0.883, type: ["melee-hammer","melee-heavyblade","melee-polearm","melee-staff"] }
  },

  ZAW_LINKS: {
    "Ruhang":            { damage: 14,  speed: -0.067, crit_chance: 0,   status_chance: 0 },
    "Ruhang II":         { damage: 28,  speed: -0.133, crit_chance: 0,   status_chance: 0 },
    "Vargeet Ruhang":    { damage: 14,  speed: -0.067, crit_chance: 7,   status_chance: -4 },
    "Ekwana Ruhang":     { damage: 14,  speed: -0.067, crit_chance: -4,  status_chance: 7 },
    "Vargeet II Ruhang": { damage: 14,  speed: -0.067, crit_chance: 14,  status_chance: -8 },
    "Ekwana II Ruhang":  { damage: 14,  speed: -0.067, crit_chance: -8,  status_chance: 14 },
    "Vargeet Ruhang II": { damage: 28,  speed: -0.133, crit_chance: 7,   status_chance: -4 },
    "Ekwana Ruhang II":  { damage: 28,  speed: -0.133, crit_chance: -4,  status_chance: 7 },
    "Jai":               { damage: -4,  speed: 0.083,  crit_chance: 0,   status_chance: 0 },
    "Jai II":            { damage: -8,  speed: 0.167,  crit_chance: 0,   status_chance: 0 },
    "Vargeet Jai":       { damage: -4,  speed: 0.083,  crit_chance: 7,   status_chance: -4 },
    "Ekwana Jai":        { damage: -4,  speed: 0.083,  crit_chance: -4,  status_chance: 7 },
    "Vargeet II Jai":    { damage: -4,  speed: 0.083,  crit_chance: 14,  status_chance: -8 },
    "Ekwana II Jai":     { damage: -4,  speed: 0.083,  crit_chance: -8,  status_chance: 14 },
    "Vargeet Jai II":    { damage: -8,  speed: 0.167,  crit_chance: 7,   status_chance: -4 },
    "Ekwana Jai II":     { damage: -8,  speed: 0.167,  crit_chance: -4,  status_chance: 7 }
  },

  // === Kitgun 组件数据 ===
  KITGUN_GRIPS: {
    "primary-shotgun": {
      "Brash":      { speed: 5.6667, charge: 0.59 },
      "Shrewd":     { speed: 4.6667, charge: 0 },
      "Steadyslam": { speed: 3.3333, charge: -0.27 },
      "Tremor":     { speed: 3, charge: -0.43 },
      "Palmaris":   { speed: 5.1667, charge: 0.59 }
    },
    "primary-rifle-projectile": {
      "Brash":      { speed: 3.7667, charge: 0.59 },
      "Shrewd":     { speed: 3.1333, charge: 0 },
      "Steadyslam": { speed: 2.3167, charge: -0.27 },
      "Tremor":     { speed: 2.1333, charge: -0.43 },
      "Palmaris":   { speed: 3.45, charge: 0.59 }
    },
    "primary-rifle-hitscan": {
      "Brash":      { speed: 17, charge: 0.59 },
      "Shrewd":     { speed: 14, charge: 0 },
      "Steadyslam": { speed: 10, charge: -0.27 },
      "Tremor":     { speed: 9, charge: -0.43 },
      "Palmaris":   { speed: 15.5, charge: 0.59 }
    },
    "primary-rifle-beam": {
      "Brash":      { speed: 8, range: 30, charge: 0.59 },
      "Shrewd":     { speed: 8, range: 26, charge: 0 },
      "Steadyslam": { speed: 8, range: 20, charge: -0.27 },
      "Tremor":     { speed: 8, range: 16, charge: -0.43 },
      "Palmaris":   { speed: 8, range: 28, charge: 0.59 }
    },
    "secondary-shotgun": {
      "Ramble":   { speed: 2.5, charge: 0 },
      "Lovetap":  { speed: 1.5, charge: 0 },
      "Haymaker": { speed: 1.1667, charge: 0 },
      "Gibber":   { speed: 3.1667, charge: 0 },
      "Ulnaris":  { speed: 1.8333, charge: 0 }
    },
    "secondary-projectile": {
      "Ramble":   { speed: 3.6667, charge: 0 },
      "Lovetap":  { speed: 2.5, charge: 0 },
      "Haymaker": { speed: 2.1667, charge: 0 },
      "Gibber":   { speed: 4.5, charge: 0 },
      "Ulnaris":  { speed: 2.8333, charge: 0 }
    },
    "secondary-hitscan": {
      "Ramble":   { speed: 8.8333, charge: 0 },
      "Lovetap":  { speed: 5.1667, charge: 0 },
      "Haymaker": { speed: 3.6667, charge: 0 },
      "Gibber":   { speed: 12, charge: 0 },
      "Ulnaris":  { speed: 6.6667, charge: 0 }
    },
    "secondary-beam": {
      "Ramble":   { speed: 12, range: 37, charge: 0 },
      "Lovetap":  { speed: 12, range: 24, charge: 0 },
      "Haymaker": { speed: 12, range: 21, charge: 0 },
      "Gibber":   { speed: 12, range: 40, charge: 0 },
      "Ulnaris":  { speed: 12, range: 30, charge: 0 }
    }
  },

  KITGUN_LOADERS: {
    "shotgun": {
      "Splat":       { crit_chance: 35, status_chance: 13, magazineSize: 11 },
      "Killstream":  { crit_chance: 35, status_chance: 13, magazineSize: 7 },
      "Bashrack":    { crit_chance: 28, status_chance: 17, magazineSize: 11 },
      "Stitch":      { crit_chance: 28, status_chance: 17, magazineSize: 13 },
      "Slap":        { crit_chance: 21, status_chance: 21, magazineSize: 7 },
      "Zip":         { crit_chance: 21, status_chance: 21, magazineSize: 5 },
      "Sparkfire":   { crit_chance: 17, status_chance: 28, magazineSize: 11 },
      "Thunderdrum": { crit_chance: 17, status_chance: 28, magazineSize: 13 },
      "Ramflare":    { crit_chance: 13, status_chance: 35, magazineSize: 11 },
      "Flutterfire": { crit_chance: 13, status_chance: 35, magazineSize: 7 },
      "Swiftfire":   { crit_chance: 17, status_chance: 28, magazineSize: 7 },
      "Zipfire":     { crit_chance: 17, status_chance: 28, magazineSize: 5 }
    },
    "projectile": {
      "Splat":       { crit_chance: 38, status_chance: 16, magazineSize: 23 },
      "Killstream":  { crit_chance: 38, status_chance: 16, magazineSize: 23 },
      "Bashrack":    { crit_chance: 31, status_chance: 20, magazineSize: 23 },
      "Stitch":      { crit_chance: 31, status_chance: 20, magazineSize: 29 },
      "Slap":        { crit_chance: 24, status_chance: 24, magazineSize: 15 },
      "Zip":         { crit_chance: 24, status_chance: 24, magazineSize: 9 },
      "Sparkfire":   { crit_chance: 20, status_chance: 31, magazineSize: 23 },
      "Thunderdrum": { crit_chance: 20, status_chance: 31, magazineSize: 29 },
      "Ramflare":    { crit_chance: 16, status_chance: 38, magazineSize: 23 },
      "Flutterfire": { crit_chance: 16, status_chance: 38, magazineSize: 15 },
      "Swiftfire":   { crit_chance: 20, status_chance: 31, magazineSize: 15 },
      "Zipfire":     { crit_chance: 20, status_chance: 31, magazineSize: 9 }
    },
    "hitscan": {
      "Splat":       { crit_chance: 33, status_chance: 11, magazineSize: 67 },
      "Killstream":  { crit_chance: 33, status_chance: 11, magazineSize: 45 },
      "Bashrack":    { crit_chance: 26, status_chance: 15, magazineSize: 67 },
      "Stitch":      { crit_chance: 26, status_chance: 15, magazineSize: 83 },
      "Slap":        { crit_chance: 19, status_chance: 19, magazineSize: 45 },
      "Zip":         { crit_chance: 19, status_chance: 19, magazineSize: 29 },
      "Sparkfire":   { crit_chance: 15, status_chance: 26, magazineSize: 67 },
      "Thunderdrum": { crit_chance: 15, status_chance: 26, magazineSize: 83 },
      "Ramflare":    { crit_chance: 11, status_chance: 33, magazineSize: 67 },
      "Flutterfire": { crit_chance: 11, status_chance: 33, magazineSize: 45 },
      "Swiftfire":   { crit_chance: 15, status_chance: 26, magazineSize: 45 },
      "Zipfire":     { crit_chance: 15, status_chance: 26, magazineSize: 29 }
    },
    "beam": {
      "Splat":       { crit_chance: 39, status_chance: 17, magazineSize: 43 },
      "Killstream":  { crit_chance: 39, status_chance: 17, magazineSize: 31 },
      "Bashrack":    { crit_chance: 32, status_chance: 21, magazineSize: 43 },
      "Stitch":      { crit_chance: 32, status_chance: 21, magazineSize: 51 },
      "Slap":        { crit_chance: 25, status_chance: 25, magazineSize: 31 },
      "Zip":         { crit_chance: 25, status_chance: 25, magazineSize: 23 },
      "Sparkfire":   { crit_chance: 21, status_chance: 32, magazineSize: 43 },
      "Thunderdrum": { crit_chance: 21, status_chance: 32, magazineSize: 51 },
      "Ramflare":    { crit_chance: 17, status_chance: 39, magazineSize: 43 },
      "Flutterfire": { crit_chance: 17, status_chance: 39, magazineSize: 31 },
      "Swiftfire":   { crit_chance: 21, status_chance: 32, magazineSize: 31 },
      "Zipfire":     { crit_chance: 21, status_chance: 32, magazineSize: 23 }
    }
  },

  KITGUN_LOADERS_MAIN: {
    "Splat":       { crit_mult: 2.3, reloadTime: 1.7 },
    "Killstream":  { crit_mult: 2.3, reloadTime: 1.3 },
    "Bashrack":    { crit_mult: 2.1, reloadTime: 1.7 },
    "Stitch":      { crit_mult: 2.1, reloadTime: 2.1 },
    "Slap":        { crit_mult: 2,   reloadTime: 1.3 },
    "Zip":         { crit_mult: 2,   reloadTime: 0.9 },
    "Sparkfire":   { crit_mult: 1.9, reloadTime: 1.7 },
    "Thunderdrum": { crit_mult: 1.9, reloadTime: 2.1 },
    "Ramflare":    { crit_mult: 1.7, reloadTime: 1.7 },
    "Flutterfire": { crit_mult: 1.7, reloadTime: 1.3 },
    "Swiftfire":   { crit_mult: 1.9, reloadTime: 1.3 },
    "Zipfire":     { crit_mult: 1.9, reloadTime: 0.9 }
  },

  // ═══════════════ Incarnon 进化系统 ═══════════════
  // 每把Incarnon武器有4个进化槽, 每个槽2-3个选项
  // 选中后提供永久属性加成
  INCARNON_EVOLUTIONS: {
    'Braton': {
      slot1: [
        { id: 'e1_a', name: '灵巧', desc: '+15% 暴击几率', effects: { crit_chance: 0.15 } },
        { id: 'e1_b', name: '强韧', desc: '+20% 状态几率', effects: { status_chance: 0.20 } }
      ],
      slot2: [
        { id: 'e2_a', name: '充能', desc: '+10% 射速', effects: { speed: 0.10 } },
        { id: 'e2_b', name: '弹幕', desc: '+20 多重射击', effects: { multishot: 0.20 } }
      ],
      slot3: [
        { id: 'e3_a', name: '爆发', desc: '+25% 爆击伤害', effects: { crit_mult: 0.25 } },
        { id: 'e3_b', name: '侵蚀', desc: '+100% 状态伤害', effects: { status_damage: 1.0 } }
      ],
      slot4: [
        { id: 'e4_a', name: '狂暴', desc: '+50% 基础伤害', effects: { base: 0.50 } },
        { id: 'e4_b', name: '弹幕风暴', desc: '+30% 射速, +15% 多重射击', effects: { speed: 0.30, multishot: 0.15 } }
      ]
    },
    'Braton Prime': {
      slot1: [
        { id: 'e1_a', name: '灵巧', desc: '+15% 暴击几率', effects: { crit_chance: 0.15 } },
        { id: 'e1_b', name: '强韧', desc: '+20% 状态几率', effects: { status_chance: 0.20 } }
      ],
      slot2: [
        { id: 'e2_a', name: '充能', desc: '+10% 射速', effects: { speed: 0.10 } },
        { id: 'e2_b', name: '弹幕', desc: '+20 多重射击', effects: { multishot: 0.20 } }
      ],
      slot3: [
        { id: 'e3_a', name: '爆发', desc: '+25% 爆击伤害', effects: { crit_mult: 0.25 } },
        { id: 'e3_b', name: '侵蚀', desc: '+100% 状态伤害', effects: { status_damage: 1.0 } }
      ],
      slot4: [
        { id: 'e4_a', name: '狂暴', desc: '+50% 基础伤害', effects: { base: 0.50 } },
        { id: 'e4_b', name: '弹幕风暴', desc: '+30% 射速, +15% 多重射击', effects: { speed: 0.30, multishot: 0.15 } }
      ]
    },
    'Braton Vandal': {
      slot1: [
        { id: 'e1_a', name: '灵巧', desc: '+15% 暴击几率', effects: { crit_chance: 0.15 } },
        { id: 'e1_b', name: '强韧', desc: '+20% 状态几率', effects: { status_chance: 0.20 } }
      ],
      slot2: [
        { id: 'e2_a', name: '充能', desc: '+10% 射速', effects: { speed: 0.10 } },
        { id: 'e2_b', name: '弹幕', desc: '+20 多重射击', effects: { multishot: 0.20 } }
      ],
      slot3: [
        { id: 'e3_a', name: '爆发', desc: '+25% 爆击伤害', effects: { crit_mult: 0.25 } },
        { id: 'e3_b', name: '侵蚀', desc: '+100% 状态伤害', effects: { status_damage: 1.0 } }
      ],
      slot4: [
        { id: 'e4_a', name: '狂暴', desc: '+50% 基础伤害', effects: { base: 0.50 } },
        { id: 'e4_b', name: '弹幕风暴', desc: '+30% 射速, +15% 多重射击', effects: { speed: 0.30, multishot: 0.15 } }
      ]
    },
    'Burston': {
      slot1: [
        { id: 'e1_a', name: '灵巧', desc: '+20% 暴击几率', effects: { crit_chance: 0.20 } },
        { id: 'e1_b', name: '强韧', desc: '+25% 状态几率', effects: { status_chance: 0.25 } }
      ],
      slot2: [
        { id: 'e2_a', name: '充能', desc: '+15% 射速', effects: { speed: 0.15 } },
        { id: 'e2_b', name: '弹幕', desc: '+25 多重射击', effects: { multishot: 0.25 } }
      ],
      slot3: [
        { id: 'e3_a', name: '爆发', desc: '+30% 爆击伤害', effects: { crit_mult: 0.30 } },
        { id: 'e3_b', name: '侵蚀', desc: '+120% 状态伤害', effects: { status_damage: 1.2 } }
      ],
      slot4: [
        { id: 'e4_a', name: '狂暴', desc: '+60% 基础伤害', effects: { base: 0.60 } },
        { id: 'e4_b', name: '弹幕风暴', desc: '+35% 射速, +20% 多重射击', effects: { speed: 0.35, multishot: 0.20 } }
      ]
    },
    'Burston Prime': {
      slot1: [
        { id: 'e1_a', name: '灵巧', desc: '+20% 暴击几率', effects: { crit_chance: 0.20 } },
        { id: 'e1_b', name: '强韧', desc: '+25% 状态几率', effects: { status_chance: 0.25 } }
      ],
      slot2: [
        { id: 'e2_a', name: '充能', desc: '+15% 射速', effects: { speed: 0.15 } },
        { id: 'e2_b', name: '弹幕', desc: '+25 多重射击', effects: { multishot: 0.25 } }
      ],
      slot3: [
        { id: 'e3_a', name: '爆发', desc: '+30% 爆击伤害', effects: { crit_mult: 0.30 } },
        { id: 'e3_b', name: '侵蚀', desc: '+120% 状态伤害', effects: { status_damage: 1.2 } }
      ],
      slot4: [
        { id: 'e4_a', name: '狂暴', desc: '+60% 基础伤害', effects: { base: 0.60 } },
        { id: 'e4_b', name: '弹幕风暴', desc: '+35% 射速, +20% 多重射击', effects: { speed: 0.35, multishot: 0.20 } }
      ]
    },
    'Lex': {
      slot1: [
        { id: 'e1_a', name: '灵巧', desc: '+25% 暴击几率', effects: { crit_chance: 0.25 } },
        { id: 'e1_b', name: '强韧', desc: '+30% 状态几率', effects: { status_chance: 0.30 } }
      ],
      slot2: [
        { id: 'e2_a', name: '充能', desc: '+15% 射速', effects: { speed: 0.15 } },
        { id: 'e2_b', name: '弹幕', desc: '+30 多重射击', effects: { multishot: 0.30 } }
      ],
      slot3: [
        { id: 'e3_a', name: '爆发', desc: '+35% 爆击伤害', effects: { crit_mult: 0.35 } },
        { id: 'e3_b', name: '侵蚀', desc: '+150% 状态伤害', effects: { status_damage: 1.5 } }
      ],
      slot4: [
        { id: 'e4_a', name: '狂暴', desc: '+70% 基础伤害', effects: { base: 0.70 } },
        { id: 'e4_b', name: '弹幕风暴', desc: '+40% 射速, +25% 多重射击', effects: { speed: 0.40, multishot: 0.25 } }
      ]
    },
    'Lex Prime': {
      slot1: [
        { id: 'e1_a', name: '灵巧', desc: '+25% 暴击几率', effects: { crit_chance: 0.25 } },
        { id: 'e1_b', name: '强韧', desc: '+30% 状态几率', effects: { status_chance: 0.30 } }
      ],
      slot2: [
        { id: 'e2_a', name: '充能', desc: '+15% 射速', effects: { speed: 0.15 } },
        { id: 'e2_b', name: '弹幕', desc: '+30 多重射击', effects: { multishot: 0.30 } }
      ],
      slot3: [
        { id: 'e3_a', name: '爆发', desc: '+35% 爆击伤害', effects: { crit_mult: 0.35 } },
        { id: 'e3_b', name: '侵蚀', desc: '+150% 状态伤害', effects: { status_damage: 1.5 } }
      ],
      slot4: [
        { id: 'e4_a', name: '狂暴', desc: '+70% 基础伤害', effects: { base: 0.70 } },
        { id: 'e4_b', name: '弹幕风暴', desc: '+40% 射速, +25% 多重射击', effects: { speed: 0.40, multishot: 0.25 } }
      ]
    },
    'Lato': {
      slot1: [
        { id: 'e1_a', name: '灵巧', desc: '+20% 暴击几率', effects: { crit_chance: 0.20 } },
        { id: 'e1_b', name: '强韧', desc: '+25% 状态几率', effects: { status_chance: 0.25 } }
      ],
      slot2: [
        { id: 'e2_a', name: '充能', desc: '+12% 射速', effects: { speed: 0.12 } },
        { id: 'e2_b', name: '弹幕', desc: '+25 多重射击', effects: { multishot: 0.25 } }
      ],
      slot3: [
        { id: 'e3_a', name: '爆发', desc: '+30% 爆击伤害', effects: { crit_mult: 0.30 } },
        { id: 'e3_b', name: '侵蚀', desc: '+120% 状态伤害', effects: { status_damage: 1.2 } }
      ],
      slot4: [
        { id: 'e4_a', name: '狂暴', desc: '+55% 基础伤害', effects: { base: 0.55 } },
        { id: 'e4_b', name: '弹幕风暴', desc: '+35% 射速, +18% 多重射击', effects: { speed: 0.35, multishot: 0.18 } }
      ]
    },
    'Lato Vandal': {
      slot1: [
        { id: 'e1_a', name: '灵巧', desc: '+22% 暴击几率', effects: { crit_chance: 0.22 } },
        { id: 'e1_b', name: '强韧', desc: '+28% 状态几率', effects: { status_chance: 0.28 } }
      ],
      slot2: [
        { id: 'e2_a', name: '充能', desc: '+14% 射速', effects: { speed: 0.14 } },
        { id: 'e2_b', name: '弹幕', desc: '+28 多重射击', effects: { multishot: 0.28 } }
      ],
      slot3: [
        { id: 'e3_a', name: '爆发', desc: '+32% 爆击伤害', effects: { crit_mult: 0.32 } },
        { id: 'e3_b', name: '侵蚀', desc: '+130% 状态伤害', effects: { status_damage: 1.3 } }
      ],
      slot4: [
        { id: 'e4_a', name: '狂暴', desc: '+60% 基础伤害', effects: { base: 0.60 } },
        { id: 'e4_b', name: '弹幕风暴', desc: '+38% 射速, +22% 多重射击', effects: { speed: 0.38, multishot: 0.22 } }
      ]
    },
    'Latron': {
      slot1: [
        { id: 'e1_a', name: '灵巧', desc: '+18% 暴击几率', effects: { crit_chance: 0.18 } },
        { id: 'e1_b', name: '强韧', desc: '+22% 状态几率', effects: { status_chance: 0.22 } }
      ],
      slot2: [
        { id: 'e2_a', name: '充能', desc: '+12% 射速', effects: { speed: 0.12 } },
        { id: 'e2_b', name: '弹幕', desc: '+22 多重射击', effects: { multishot: 0.22 } }
      ],
      slot3: [
        { id: 'e3_a', name: '爆发', desc: '+28% 爆击伤害', effects: { crit_mult: 0.28 } },
        { id: 'e3_b', name: '侵蚀', desc: '+110% 状态伤害', effects: { status_damage: 1.1 } }
      ],
      slot4: [
        { id: 'e4_a', name: '狂暴', desc: '+55% 基础伤害', effects: { base: 0.55 } },
        { id: 'e4_b', name: '弹幕风暴', desc: '+32% 射速, +18% 多重射击', effects: { speed: 0.32, multishot: 0.18 } }
      ]
    },
    'Latron Prime': {
      slot1: [
        { id: 'e1_a', name: '灵巧', desc: '+22% 暴击几率', effects: { crit_chance: 0.22 } },
        { id: 'e1_b', name: '强韧', desc: '+28% 状态几率', effects: { status_chance: 0.28 } }
      ],
      slot2: [
        { id: 'e2_a', name: '充能', desc: '+15% 射速', effects: { speed: 0.15 } },
        { id: 'e2_b', name: '弹幕', desc: '+25 多重射击', effects: { multishot: 0.25 } }
      ],
      slot3: [
        { id: 'e3_a', name: '爆发', desc: '+32% 爆击伤害', effects: { crit_mult: 0.32 } },
        { id: 'e3_b', name: '侵蚀', desc: '+140% 状态伤害', effects: { status_damage: 1.4 } }
      ],
      slot4: [
        { id: 'e4_a', name: '狂暴', desc: '+65% 基础伤害', effects: { base: 0.65 } },
        { id: 'e4_b', name: '弹幕风暴', desc: '+38% 射速, +22% 多重射击', effects: { speed: 0.38, multishot: 0.22 } }
      ]
    },
    'Latron Wraith': {
      slot1: [
        { id: 'e1_a', name: '灵巧', desc: '+22% 暴击几率', effects: { crit_chance: 0.22 } },
        { id: 'e1_b', name: '强韧', desc: '+28% 状态几率', effects: { status_chance: 0.28 } }
      ],
      slot2: [
        { id: 'e2_a', name: '充能', desc: '+15% 射速', effects: { speed: 0.15 } },
        { id: 'e2_b', name: '弹幕', desc: '+25 多重射击', effects: { multishot: 0.25 } }
      ],
      slot3: [
        { id: 'e3_a', name: '爆发', desc: '+32% 爆击伤害', effects: { crit_mult: 0.32 } },
        { id: 'e3_b', name: '侵蚀', desc: '+140% 状态伤害', effects: { status_damage: 1.4 } }
      ],
      slot4: [
        { id: 'e4_a', name: '狂暴', desc: '+65% 基础伤害', effects: { base: 0.65 } },
        { id: 'e4_b', name: '弹幕风暴', desc: '+38% 射速, +22% 多重射击', effects: { speed: 0.38, multishot: 0.22 } }
      ]
    },
    'Dread': {
      slot1: [
        { id: 'e1_a', name: '灵巧', desc: '+15% 暴击几率', effects: { crit_chance: 0.15 } },
        { id: 'e1_b', name: '强韧', desc: '+20% 状态几率', effects: { status_chance: 0.20 } }
      ],
      slot2: [
        { id: 'e2_a', name: '充能', desc: '+10% 蓄力速度', effects: { speed: 0.10 } },
        { id: 'e2_b', name: '弹幕', desc: '+20 多重射击', effects: { multishot: 0.20 } }
      ],
      slot3: [
        { id: 'e3_a', name: '爆发', desc: '+30% 爆击伤害', effects: { crit_mult: 0.30 } },
        { id: 'e3_b', name: '侵蚀', desc: '+100% 状态伤害', effects: { status_damage: 1.0 } }
      ],
      slot4: [
        { id: 'e4_a', name: '狂暴', desc: '+50% 基础伤害', effects: { base: 0.50 } },
        { id: 'e4_b', name: '致命一击', desc: '+40% 暴击伤害, +10% 暴击几率', effects: { crit_mult: 0.40, crit_chance: 0.10 } }
      ]
    },
    'Furis': {
      slot1: [
        { id: 'e1_a', name: '灵巧', desc: '+18% 暴击几率', effects: { crit_chance: 0.18 } },
        { id: 'e1_b', name: '强韧', desc: '+22% 状态几率', effects: { status_chance: 0.22 } }
      ],
      slot2: [
        { id: 'e2_a', name: '充能', desc: '+15% 射速', effects: { speed: 0.15 } },
        { id: 'e2_b', name: '弹幕', desc: '+20 多重射击', effects: { multishot: 0.20 } }
      ],
      slot3: [
        { id: 'e3_a', name: '爆发', desc: '+25% 爆击伤害', effects: { crit_mult: 0.25 } },
        { id: 'e3_b', name: '侵蚀', desc: '+80% 状态伤害', effects: { status_damage: 0.8 } }
      ],
      slot4: [
        { id: 'e4_a', name: '狂暴', desc: '+45% 基础伤害', effects: { base: 0.45 } },
        { id: 'e4_b', name: '弹幕风暴', desc: '+30% 射速, +15% 多重射击', effects: { speed: 0.30, multishot: 0.15 } }
      ]
    },
    'Boar': {
      slot1: [
        { id: 'e1_a', name: '灵巧', desc: '+12% 暴击几率', effects: { crit_chance: 0.12 } },
        { id: 'e1_b', name: '强韧', desc: '+18% 状态几率', effects: { status_chance: 0.18 } }
      ],
      slot2: [
        { id: 'e2_a', name: '充能', desc: '+12% 射速', effects: { speed: 0.12 } },
        { id: 'e2_b', name: '弹幕', desc: '+2 多重射击', effects: { multishot: 2 } }
      ],
      slot3: [
        { id: 'e3_a', name: '爆发', desc: '+20% 爆击伤害', effects: { crit_mult: 0.20 } },
        { id: 'e3_b', name: '侵蚀', desc: '+80% 状态伤害', effects: { status_damage: 0.8 } }
      ],
      slot4: [
        { id: 'e4_a', name: '狂暴', desc: '+40% 基础伤害', effects: { base: 0.40 } },
        { id: 'e4_b', name: '弹幕风暴', desc: '+25% 射速, +2 多重射击', effects: { speed: 0.25, multishot: 2 } }
      ]
    },
    'Boar Prime': {
      slot1: [
        { id: 'e1_a', name: '灵巧', desc: '+15% 暴击几率', effects: { crit_chance: 0.15 } },
        { id: 'e1_b', name: '强韧', desc: '+22% 状态几率', effects: { status_chance: 0.22 } }
      ],
      slot2: [
        { id: 'e2_a', name: '充能', desc: '+15% 射速', effects: { speed: 0.15 } },
        { id: 'e2_b', name: '弹幕', desc: '+3 多重射击', effects: { multishot: 3 } }
      ],
      slot3: [
        { id: 'e3_a', name: '爆发', desc: '+25% 爆击伤害', effects: { crit_mult: 0.25 } },
        { id: 'e3_b', name: '侵蚀', desc: '+100% 状态伤害', effects: { status_damage: 1.0 } }
      ],
      slot4: [
        { id: 'e4_a', name: '狂暴', desc: '+50% 基础伤害', effects: { base: 0.50 } },
        { id: 'e4_b', name: '弹幕风暴', desc: '+30% 射速, +3 多重射击', effects: { speed: 0.30, multishot: 3 } }
      ]
    },
    'Boltor': {
      slot1: [
        { id: 'e1_a', name: '灵巧', desc: '+15% 暴击几率', effects: { crit_chance: 0.15 } },
        { id: 'e1_b', name: '强韧', desc: '+20% 状态几率', effects: { status_chance: 0.20 } }
      ],
      slot2: [
        { id: 'e2_a', name: '充能', desc: '+10% 射速', effects: { speed: 0.10 } },
        { id: 'e2_b', name: '弹幕', desc: '+20 多重射击', effects: { multishot: 0.20 } }
      ],
      slot3: [
        { id: 'e3_a', name: '爆发', desc: '+25% 爆击伤害', effects: { crit_mult: 0.25 } },
        { id: 'e3_b', name: '侵蚀', desc: '+80% 状态伤害', effects: { status_damage: 0.8 } }
      ],
      slot4: [
        { id: 'e4_a', name: '狂暴', desc: '+50% 基础伤害', effects: { base: 0.50 } },
        { id: 'e4_b', name: '弹幕风暴', desc: '+30% 射速, +15% 多重射击', effects: { speed: 0.30, multishot: 0.15 } }
      ]
    },
    'Boltor Prime': {
      slot1: [
        { id: 'e1_a', name: '灵巧', desc: '+18% 暴击几率', effects: { crit_chance: 0.18 } },
        { id: 'e1_b', name: '强韧', desc: '+25% 状态几率', effects: { status_chance: 0.25 } }
      ],
      slot2: [
        { id: 'e2_a', name: '充能', desc: '+12% 射速', effects: { speed: 0.12 } },
        { id: 'e2_b', name: '弹幕', desc: '+25 多重射击', effects: { multishot: 0.25 } }
      ],
      slot3: [
        { id: 'e3_a', name: '爆发', desc: '+30% 爆击伤害', effects: { crit_mult: 0.30 } },
        { id: 'e3_b', name: '侵蚀', desc: '+100% 状态伤害', effects: { status_damage: 1.0 } }
      ],
      slot4: [
        { id: 'e4_a', name: '狂暴', desc: '+60% 基础伤害', effects: { base: 0.60 } },
        { id: 'e4_b', name: '弹幕风暴', desc: '+35% 射速, +20% 多重射击', effects: { speed: 0.35, multishot: 0.20 } }
      ]
    },
    'Bronco': {
      slot1: [
        { id: 'e1_a', name: '灵巧', desc: '+15% 暴击几率', effects: { crit_chance: 0.15 } },
        { id: 'e1_b', name: '强韧', desc: '+20% 状态几率', effects: { status_chance: 0.20 } }
      ],
      slot2: [
        { id: 'e2_a', name: '充能', desc: '+12% 射速', effects: { speed: 0.12 } },
        { id: 'e2_b', name: '弹幕', desc: '+2 多重射击', effects: { multishot: 2 } }
      ],
      slot3: [
        { id: 'e3_a', name: '爆发', desc: '+25% 爆击伤害', effects: { crit_mult: 0.25 } },
        { id: 'e3_b', name: '侵蚀', desc: '+80% 状态伤害', effects: { status_damage: 0.8 } }
      ],
      slot4: [
        { id: 'e4_a', name: '狂暴', desc: '+45% 基础伤害', effects: { base: 0.45 } },
        { id: 'e4_b', name: '弹幕风暴', desc: '+28% 射速, +2 多重射击', effects: { speed: 0.28, multishot: 2 } }
      ]
    },
    'Bronco Prime': {
      slot1: [
        { id: 'e1_a', name: '灵巧', desc: '+18% 暴击几率', effects: { crit_chance: 0.18 } },
        { id: 'e1_b', name: '强韧', desc: '+25% 状态几率', effects: { status_chance: 0.25 } }
      ],
      slot2: [
        { id: 'e2_a', name: '充能', desc: '+15% 射速', effects: { speed: 0.15 } },
        { id: 'e2_b', name: '弹幕', desc: '+3 多重射击', effects: { multishot: 3 } }
      ],
      slot3: [
        { id: 'e3_a', name: '爆发', desc: '+30% 爆击伤害', effects: { crit_mult: 0.30 } },
        { id: 'e3_b', name: '侵蚀', desc: '+100% 状态伤害', effects: { status_damage: 1.0 } }
      ],
      slot4: [
        { id: 'e4_a', name: '狂暴', desc: '+55% 基础伤害', effects: { base: 0.55 } },
        { id: 'e4_b', name: '弹幕风暴', desc: '+32% 射速, +3 多重射击', effects: { speed: 0.32, multishot: 3 } }
      ]
    },
    'Mk1-Braton': {
      slot1: [
        { id: 'e1_a', name: '灵巧', desc: '+12% 暴击几率', effects: { crit_chance: 0.12 } },
        { id: 'e1_b', name: '强韧', desc: '+18% 状态几率', effects: { status_chance: 0.18 } }
      ],
      slot2: [
        { id: 'e2_a', name: '充能', desc: '+10% 射速', effects: { speed: 0.10 } },
        { id: 'e2_b', name: '弹幕', desc: '+18 多重射击', effects: { multishot: 0.18 } }
      ],
      slot3: [
        { id: 'e3_a', name: '爆发', desc: '+20% 爆击伤害', effects: { crit_mult: 0.20 } },
        { id: 'e3_b', name: '侵蚀', desc: '+80% 状态伤害', effects: { status_damage: 0.8 } }
      ],
      slot4: [
        { id: 'e4_a', name: '狂暴', desc: '+40% 基础伤害', effects: { base: 0.40 } },
        { id: 'e4_b', name: '弹幕风暴', desc: '+28% 射速, +12% 多重射击', effects: { speed: 0.28, multishot: 0.12 } }
      ]
    },
    'Gorgon': {
      slot1: [
        { id: 'e1_a', name: '灵巧', desc: '+12% 暴击几率', effects: { crit_chance: 0.12 } },
        { id: 'e1_b', name: '强韧', desc: '+18% 状态几率', effects: { status_chance: 0.18 } }
      ],
      slot2: [
        { id: 'e2_a', name: '充能', desc: '+12% 射速', effects: { speed: 0.12 } },
        { id: 'e2_b', name: '弹幕', desc: '+20 多重射击', effects: { multishot: 0.20 } }
      ],
      slot3: [
        { id: 'e3_a', name: '爆发', desc: '+22% 爆击伤害', effects: { crit_mult: 0.22 } },
        { id: 'e3_b', name: '侵蚀', desc: '+80% 状态伤害', effects: { status_damage: 0.8 } }
      ],
      slot4: [
        { id: 'e4_a', name: '狂暴', desc: '+45% 基础伤害', effects: { base: 0.45 } },
        { id: 'e4_b', name: '弹幕风暴', desc: '+28% 射速, +15% 多重射击', effects: { speed: 0.28, multishot: 0.15 } }
      ]
    },
    'Gorgon Wraith': {
      slot1: [
        { id: 'e1_a', name: '灵巧', desc: '+15% 暴击几率', effects: { crit_chance: 0.15 } },
        { id: 'e1_b', name: '强韧', desc: '+22% 状态几率', effects: { status_chance: 0.22 } }
      ],
      slot2: [
        { id: 'e2_a', name: '充能', desc: '+15% 射速', effects: { speed: 0.15 } },
        { id: 'e2_b', name: '弹幕', desc: '+25 多重射击', effects: { multishot: 0.25 } }
      ],
      slot3: [
        { id: 'e3_a', name: '爆发', desc: '+25% 爆击伤害', effects: { crit_mult: 0.25 } },
        { id: 'e3_b', name: '侵蚀', desc: '+100% 状态伤害', effects: { status_damage: 1.0 } }
      ],
      slot4: [
        { id: 'e4_a', name: '狂暴', desc: '+55% 基础伤害', effects: { base: 0.55 } },
        { id: 'e4_b', name: '弹幕风暴', desc: '+32% 射速, +20% 多重射击', effects: { speed: 0.32, multishot: 0.20 } }
      ]
    },
    'Dera': {
      slot1: [
        { id: 'e1_a', name: '灵巧', desc: '+18% 暴击几率', effects: { crit_chance: 0.18 } },
        { id: 'e1_b', name: '强韧', desc: '+22% 状态几率', effects: { status_chance: 0.22 } }
      ],
      slot2: [
        { id: 'e2_a', name: '充能', desc: '+12% 射速', effects: { speed: 0.12 } },
        { id: 'e2_b', name: '弹幕', desc: '+22 多重射击', effects: { multishot: 0.22 } }
      ],
      slot3: [
        { id: 'e3_a', name: '爆发', desc: '+28% 爆击伤害', effects: { crit_mult: 0.28 } },
        { id: 'e3_b', name: '侵蚀', desc: '+100% 状态伤害', effects: { status_damage: 1.0 } }
      ],
      slot4: [
        { id: 'e4_a', name: '狂暴', desc: '+50% 基础伤害', effects: { base: 0.50 } },
        { id: 'e4_b', name: '弹幕风暴', desc: '+30% 射速, +18% 多重射击', effects: { speed: 0.30, multishot: 0.18 } }
      ]
    },
    'Dera Vandal': {
      slot1: [
        { id: 'e1_a', name: '灵巧', desc: '+20% 暴击几率', effects: { crit_chance: 0.20 } },
        { id: 'e1_b', name: '强韧', desc: '+25% 状态几率', effects: { status_chance: 0.25 } }
      ],
      slot2: [
        { id: 'e2_a', name: '充能', desc: '+14% 射速', effects: { speed: 0.14 } },
        { id: 'e2_b', name: '弹幕', desc: '+25 多重射击', effects: { multishot: 0.25 } }
      ],
      slot3: [
        { id: 'e3_a', name: '爆发', desc: '+30% 爆击伤害', effects: { crit_mult: 0.30 } },
        { id: 'e3_b', name: '侵蚀', desc: '+120% 状态伤害', effects: { status_damage: 1.2 } }
      ],
      slot4: [
        { id: 'e4_a', name: '狂暴', desc: '+55% 基础伤害', effects: { base: 0.55 } },
        { id: 'e4_b', name: '弹幕风暴', desc: '+32% 射速, +20% 多重射击', effects: { speed: 0.32, multishot: 0.20 } }
      ]
    },
    'Miter': {
      slot1: [
        { id: 'e1_a', name: '灵巧', desc: '+15% 暴击几率', effects: { crit_chance: 0.15 } },
        { id: 'e1_b', name: '强韧', desc: '+20% 状态几率', effects: { status_chance: 0.20 } }
      ],
      slot2: [
        { id: 'e2_a', name: '充能', desc: '+10% 蓄力速度', effects: { speed: 0.10 } },
        { id: 'e2_b', name: '弹幕', desc: '+20 多重射击', effects: { multishot: 0.20 } }
      ],
      slot3: [
        { id: 'e3_a', name: '爆发', desc: '+28% 爆击伤害', effects: { crit_mult: 0.28 } },
        { id: 'e3_b', name: '侵蚀', desc: '+100% 状态伤害', effects: { status_damage: 1.0 } }
      ],
      slot4: [
        { id: 'e4_a', name: '狂暴', desc: '+50% 基础伤害', effects: { base: 0.50 } },
        { id: 'e4_b', name: '致命一击', desc: '+35% 暴击伤害, +12% 暴击几率', effects: { crit_mult: 0.35, crit_chance: 0.12 } }
      ]
    },
    'Cestra': {
      slot1: [
        { id: 'e1_a', name: '灵巧', desc: '+20% 暴击几率', effects: { crit_chance: 0.20 } },
        { id: 'e1_b', name: '强韧', desc: '+25% 状态几率', effects: { status_chance: 0.25 } }
      ],
      slot2: [
        { id: 'e2_a', name: '充能', desc: '+15% 射速', effects: { speed: 0.15 } },
        { id: 'e2_b', name: '弹幕', desc: '+25 多重射击', effects: { multishot: 0.25 } }
      ],
      slot3: [
        { id: 'e3_a', name: '爆发', desc: '+30% 爆击伤害', effects: { crit_mult: 0.30 } },
        { id: 'e3_b', name: '侵蚀', desc: '+100% 状态伤害', effects: { status_damage: 1.0 } }
      ],
      slot4: [
        { id: 'e4_a', name: '狂暴', desc: '+55% 基础伤害', effects: { base: 0.55 } },
        { id: 'e4_b', name: '弹幕风暴', desc: '+32% 射速, +20% 多重射击', effects: { speed: 0.32, multishot: 0.20 } }
      ]
    },
    'Kunai': {
      slot1: [
        { id: 'e1_a', name: '灵巧', desc: '+15% 暴击几率', effects: { crit_chance: 0.15 } },
        { id: 'e1_b', name: '强韧', desc: '+20% 状态几率', effects: { status_chance: 0.20 } }
      ],
      slot2: [
        { id: 'e2_a', name: '充能', desc: '+12% 射速', effects: { speed: 0.12 } },
        { id: 'e2_b', name: '弹幕', desc: '+20 多重射击', effects: { multishot: 0.20 } }
      ],
      slot3: [
        { id: 'e3_a', name: '爆发', desc: '+22% 爆击伤害', effects: { crit_mult: 0.22 } },
        { id: 'e3_b', name: '侵蚀', desc: '+80% 状态伤害', effects: { status_damage: 0.8 } }
      ],
      slot4: [
        { id: 'e4_a', name: '狂暴', desc: '+40% 基础伤害', effects: { base: 0.40 } },
        { id: 'e4_b', name: '弹幕风暴', desc: '+28% 射速, +15% 多重射击', effects: { speed: 0.28, multishot: 0.15 } }
      ]
    },
    'Ballistica': {
      slot1: [
        { id: 'e1_a', name: '灵巧', desc: '+15% 暴击几率', effects: { crit_chance: 0.15 } },
        { id: 'e1_b', name: '强韧', desc: '+20% 状态几率', effects: { status_chance: 0.20 } }
      ],
      slot2: [
        { id: 'e2_a', name: '充能', desc: '+10% 蓄力速度', effects: { speed: 0.10 } },
        { id: 'e2_b', name: '弹幕', desc: '+20 多重射击', effects: { multishot: 0.20 } }
      ],
      slot3: [
        { id: 'e3_a', name: '爆发', desc: '+25% 爆击伤害', effects: { crit_mult: 0.25 } },
        { id: 'e3_b', name: '侵蚀', desc: '+80% 状态伤害', effects: { status_damage: 0.8 } }
      ],
      slot4: [
        { id: 'e4_a', name: '狂暴', desc: '+45% 基础伤害', effects: { base: 0.45 } },
        { id: 'e4_b', name: '致命一击', desc: '+30% 暴击伤害, +10% 暴击几率', effects: { crit_mult: 0.30, crit_chance: 0.10 } }
      ]
    },
    'Ballistica Prime': {
      slot1: [
        { id: 'e1_a', name: '灵巧', desc: '+18% 暴击几率', effects: { crit_chance: 0.18 } },
        { id: 'e1_b', name: '强韧', desc: '+22% 状态几率', effects: { status_chance: 0.22 } }
      ],
      slot2: [
        { id: 'e2_a', name: '充能', desc: '+12% 蓄力速度', effects: { speed: 0.12 } },
        { id: 'e2_b', name: '弹幕', desc: '+25 多重射击', effects: { multishot: 0.25 } }
      ],
      slot3: [
        { id: 'e3_a', name: '爆发', desc: '+30% 爆击伤害', effects: { crit_mult: 0.30 } },
        { id: 'e3_b', name: '侵蚀', desc: '+100% 状态伤害', effects: { status_damage: 1.0 } }
      ],
      slot4: [
        { id: 'e4_a', name: '狂暴', desc: '+55% 基础伤害', effects: { base: 0.55 } },
        { id: 'e4_b', name: '致命一击', desc: '+35% 暴击伤害, +15% 暴击几率', effects: { crit_mult: 0.35, crit_chance: 0.15 } }
      ]
    },
    'Atomos': {
      slot1: [
        { id: 'e1_a', name: '灵巧', desc: '+18% 暴击几率', effects: { crit_chance: 0.18 } },
        { id: 'e1_b', name: '强韧', desc: '+25% 状态几率', effects: { status_chance: 0.25 } }
      ],
      slot2: [
        { id: 'e2_a', name: '充能', desc: '+12% 射速', effects: { speed: 0.12 } },
        { id: 'e2_b', name: '弹幕', desc: '+22 多重射击', effects: { multishot: 0.22 } }
      ],
      slot3: [
        { id: 'e3_a', name: '爆发', desc: '+28% 爆击伤害', effects: { crit_mult: 0.28 } },
        { id: 'e3_b', name: '侵蚀', desc: '+100% 状态伤害', effects: { status_damage: 1.0 } }
      ],
      slot4: [
        { id: 'e4_a', name: '狂暴', desc: '+50% 基础伤害', effects: { base: 0.50 } },
        { id: 'e4_b', name: '弹幕风暴', desc: '+30% 射速, +18% 多重射击', effects: { speed: 0.30, multishot: 0.18 } }
      ]
    },
    'Gammacor': {
      slot1: [
        { id: 'e1_a', name: '灵巧', desc: '+15% 暴击几率', effects: { crit_chance: 0.15 } },
        { id: 'e1_b', name: '强韧', desc: '+22% 状态几率', effects: { status_chance: 0.22 } }
      ],
      slot2: [
        { id: 'e2_a', name: '充能', desc: '+10% 射速', effects: { speed: 0.10 } },
        { id: 'e2_b', name: '弹幕', desc: '+18 多重射击', effects: { multishot: 0.18 } }
      ],
      slot3: [
        { id: 'e3_a', name: '爆发', desc: '+22% 爆击伤害', effects: { crit_mult: 0.22 } },
        { id: 'e3_b', name: '侵蚀', desc: '+80% 状态伤害', effects: { status_damage: 0.8 } }
      ],
      slot4: [
        { id: 'e4_a', name: '狂暴', desc: '+42% 基础伤害', effects: { base: 0.42 } },
        { id: 'e4_b', name: '弹幕风暴', desc: '+25% 射速, +12% 多重射击', effects: { speed: 0.25, multishot: 0.12 } }
      ]
    },
    'Despair': {
      slot1: [
        { id: 'e1_a', name: '灵巧', desc: '+15% 暴击几率', effects: { crit_chance: 0.15 } },
        { id: 'e1_b', name: '强韧', desc: '+20% 状态几率', effects: { status_chance: 0.20 } }
      ],
      slot2: [
        { id: 'e2_a', name: '充能', desc: '+10% 射速', effects: { speed: 0.10 } },
        { id: 'e2_b', name: '弹幕', desc: '+20 多重射击', effects: { multishot: 0.20 } }
      ],
      slot3: [
        { id: 'e3_a', name: '爆发', desc: '+25% 爆击伤害', effects: { crit_mult: 0.25 } },
        { id: 'e3_b', name: '侵蚀', desc: '+100% 状态伤害', effects: { status_damage: 1.0 } }
      ],
      slot4: [
        { id: 'e4_a', name: '狂暴', desc: '+50% 基础伤害', effects: { base: 0.50 } },
        { id: 'e4_b', name: '致命一击', desc: '+35% 暴击伤害, +12% 暴击几率', effects: { crit_mult: 0.35, crit_chance: 0.12 } }
      ]
    },
    'Angstrum': {
      slot1: [
        { id: 'e1_a', name: '灵巧', desc: '+15% 暴击几率', effects: { crit_chance: 0.15 } },
        { id: 'e1_b', name: '强韧', desc: '+20% 状态几率', effects: { status_chance: 0.20 } }
      ],
      slot2: [
        { id: 'e2_a', name: '充能', desc: '+12% 射速', effects: { speed: 0.12 } },
        { id: 'e2_b', name: '弹幕', desc: '+22 多重射击', effects: { multishot: 0.22 } }
      ],
      slot3: [
        { id: 'e3_a', name: '爆发', desc: '+25% 爆击伤害', effects: { crit_mult: 0.25 } },
        { id: 'e3_b', name: '侵蚀', desc: '+100% 状态伤害', effects: { status_damage: 1.0 } }
      ],
      slot4: [
        { id: 'e4_a', name: '狂暴', desc: '+55% 基础伤害', effects: { base: 0.55 } },
        { id: 'e4_b', name: '弹幕风暴', desc: '+30% 射速, +18% 多重射击', effects: { speed: 0.30, multishot: 0.18 } }
      ]
    },
    'Ack & Brunt': {
      slot1: [
        { id: 'e1_a', name: '灵巧', desc: '+15% 暴击几率', effects: { crit_chance: 0.15 } },
        { id: 'e1_b', name: '强韧', desc: '+20% 状态几率', effects: { status_chance: 0.20 } }
      ],
      slot2: [
        { id: 'e2_a', name: '充能', desc: '+12% 攻击速度', effects: { speed: 0.12 } },
        { id: 'e2_b', name: '范围', desc: '+0.5 范围', effects: { range: 0.5 } }
      ],
      slot3: [
        { id: 'e3_a', name: '爆发', desc: '+25% 爆击伤害', effects: { crit_mult: 0.25 } },
        { id: 'e3_b', name: '侵蚀', desc: '+100% 状态伤害', effects: { status_damage: 1.0 } }
      ],
      slot4: [
        { id: 'e4_a', name: '狂暴', desc: '+50% 基础伤害', effects: { base: 0.50 } },
        { id: 'e4_b', name: '致命一击', desc: '+35% 暴击伤害, +15% 暴击几率', effects: { crit_mult: 0.35, crit_chance: 0.15 } }
      ]
    },
    'Anku': {
      slot1: [
        { id: 'e1_a', name: '灵巧', desc: '+15% 暴击几率', effects: { crit_chance: 0.15 } },
        { id: 'e1_b', name: '强韧', desc: '+20% 状态几率', effects: { status_chance: 0.20 } }
      ],
      slot2: [
        { id: 'e2_a', name: '充能', desc: '+12% 攻击速度', effects: { speed: 0.12 } },
        { id: 'e2_b', name: '范围', desc: '+0.5 范围', effects: { range: 0.5 } }
      ],
      slot3: [
        { id: 'e3_a', name: '爆发', desc: '+25% 爆击伤害', effects: { crit_mult: 0.25 } },
        { id: 'e3_b', name: '侵蚀', desc: '+100% 状态伤害', effects: { status_damage: 1.0 } }
      ],
      slot4: [
        { id: 'e4_a', name: '狂暴', desc: '+50% 基础伤害', effects: { base: 0.50 } },
        { id: 'e4_b', name: '致命一击', desc: '+35% 暴击伤害, +15% 暴击几率', effects: { crit_mult: 0.35, crit_chance: 0.15 } }
      ]
    },
    'Bo': {
      slot1: [
        { id: 'e1_a', name: '灵巧', desc: '+15% 暴击几率', effects: { crit_chance: 0.15 } },
        { id: 'e1_b', name: '强韧', desc: '+20% 状态几率', effects: { status_chance: 0.20 } }
      ],
      slot2: [
        { id: 'e2_a', name: '充能', desc: '+12% 攻击速度', effects: { speed: 0.12 } },
        { id: 'e2_b', name: '范围', desc: '+0.5 范围', effects: { range: 0.5 } }
      ],
      slot3: [
        { id: 'e3_a', name: '爆发', desc: '+25% 爆击伤害', effects: { crit_mult: 0.25 } },
        { id: 'e3_b', name: '侵蚀', desc: '+100% 状态伤害', effects: { status_damage: 1.0 } }
      ],
      slot4: [
        { id: 'e4_a', name: '狂暴', desc: '+50% 基础伤害', effects: { base: 0.50 } },
        { id: 'e4_b', name: '致命一击', desc: '+35% 暴击伤害, +15% 暴击几率', effects: { crit_mult: 0.35, crit_chance: 0.15 } }
      ]
    },
    'Bo Prime': {
      slot1: [
        { id: 'e1_a', name: '灵巧', desc: '+18% 暴击几率', effects: { crit_chance: 0.18 } },
        { id: 'e1_b', name: '强韧', desc: '+22% 状态几率', effects: { status_chance: 0.22 } }
      ],
      slot2: [
        { id: 'e2_a', name: '充能', desc: '+15% 攻击速度', effects: { speed: 0.15 } },
        { id: 'e2_b', name: '范围', desc: '+0.8 范围', effects: { range: 0.8 } }
      ],
      slot3: [
        { id: 'e3_a', name: '爆发', desc: '+30% 爆击伤害', effects: { crit_mult: 0.30 } },
        { id: 'e3_b', name: '侵蚀', desc: '+120% 状态伤害', effects: { status_damage: 1.2 } }
      ],
      slot4: [
        { id: 'e4_a', name: '狂暴', desc: '+60% 基础伤害', effects: { base: 0.60 } },
        { id: 'e4_b', name: '致命一击', desc: '+40% 暴击伤害, +18% 暴击几率', effects: { crit_mult: 0.40, crit_chance: 0.18 } }
      ]
    },
    'Ceramic Dagger': {
      slot1: [
        { id: 'e1_a', name: '灵巧', desc: '+15% 暴击几率', effects: { crit_chance: 0.15 } },
        { id: 'e1_b', name: '强韧', desc: '+20% 状态几率', effects: { status_chance: 0.20 } }
      ],
      slot2: [
        { id: 'e2_a', name: '充能', desc: '+15% 攻击速度', effects: { speed: 0.15 } },
        { id: 'e2_b', name: '范围', desc: '+0.3 范围', effects: { range: 0.3 } }
      ],
      slot3: [
        { id: 'e3_a', name: '爆发', desc: '+25% 爆击伤害', effects: { crit_mult: 0.25 } },
        { id: 'e3_b', name: '侵蚀', desc: '+100% 状态伤害', effects: { status_damage: 1.0 } }
      ],
      slot4: [
        { id: 'e4_a', name: '狂暴', desc: '+50% 基础伤害', effects: { base: 0.50 } },
        { id: 'e4_b', name: '致命一击', desc: '+35% 暴击伤害, +15% 暴击几率', effects: { crit_mult: 0.35, crit_chance: 0.15 } }
      ]
    },
    'Destreza': {
      slot1: [
        { id: 'e1_a', name: '灵巧', desc: '+15% 暴击几率', effects: { crit_chance: 0.15 } },
        { id: 'e1_b', name: '强韧', desc: '+20% 状态几率', effects: { status_chance: 0.20 } }
      ],
      slot2: [
        { id: 'e2_a', name: '充能', desc: '+12% 攻击速度', effects: { speed: 0.12 } },
        { id: 'e2_b', name: '范围', desc: '+0.3 范围', effects: { range: 0.3 } }
      ],
      slot3: [
        { id: 'e3_a', name: '爆发', desc: '+28% 爆击伤害', effects: { crit_mult: 0.28 } },
        { id: 'e3_b', name: '侵蚀', desc: '+110% 状态伤害', effects: { status_damage: 1.1 } }
      ],
      slot4: [
        { id: 'e4_a', name: '狂暴', desc: '+55% 基础伤害', effects: { base: 0.55 } },
        { id: 'e4_b', name: '致命一击', desc: '+38% 暴击伤害, +18% 暴击几率', effects: { crit_mult: 0.38, crit_chance: 0.18 } }
      ]
    },
    'Destreza Prime': {
      slot1: [
        { id: 'e1_a', name: '灵巧', desc: '+18% 暴击几率', effects: { crit_chance: 0.18 } },
        { id: 'e1_b', name: '强韧', desc: '+25% 状态几率', effects: { status_chance: 0.25 } }
      ],
      slot2: [
        { id: 'e2_a', name: '充能', desc: '+15% 攻击速度', effects: { speed: 0.15 } },
        { id: 'e2_b', name: '范围', desc: '+0.5 范围', effects: { range: 0.5 } }
      ],
      slot3: [
        { id: 'e3_a', name: '爆发', desc: '+32% 爆击伤害', effects: { crit_mult: 0.32 } },
        { id: 'e3_b', name: '侵蚀', desc: '+130% 状态伤害', effects: { status_damage: 1.3 } }
      ],
      slot4: [
        { id: 'e4_a', name: '狂暴', desc: '+65% 基础伤害', effects: { base: 0.65 } },
        { id: 'e4_b', name: '致命一击', desc: '+42% 暴击伤害, +20% 暴击几率', effects: { crit_mult: 0.42, crit_chance: 0.20 } }
      ]
    },
    'Dual Ichor': {
      slot1: [
        { id: 'e1_a', name: '灵巧', desc: '+15% 暴击几率', effects: { crit_chance: 0.15 } },
        { id: 'e1_b', name: '强韧', desc: '+20% 状态几率', effects: { status_chance: 0.20 } }
      ],
      slot2: [
        { id: 'e2_a', name: '充能', desc: '+12% 攻击速度', effects: { speed: 0.12 } },
        { id: 'e2_b', name: '范围', desc: '+0.3 范围', effects: { range: 0.3 } }
      ],
      slot3: [
        { id: 'e3_a', name: '爆发', desc: '+30% 爆击伤害', effects: { crit_mult: 0.30 } },
        { id: 'e3_b', name: '侵蚀', desc: '+120% 状态伤害', effects: { status_damage: 1.2 } }
      ],
      slot4: [
        { id: 'e4_a', name: '狂暴', desc: '+60% 基础伤害', effects: { base: 0.60 } },
        { id: 'e4_b', name: '致命一击', desc: '+40% 暴击伤害, +18% 暴击几率', effects: { crit_mult: 0.40, crit_chance: 0.18 } }
      ]
    },
    'Furax': {
      slot1: [
        { id: 'e1_a', name: '灵巧', desc: '+12% 暴击几率', effects: { crit_chance: 0.12 } },
        { id: 'e1_b', name: '强韧', desc: '+18% 状态几率', effects: { status_chance: 0.18 } }
      ],
      slot2: [
        { id: 'e2_a', name: '充能', desc: '+10% 攻击速度', effects: { speed: 0.10 } },
        { id: 'e2_b', name: '范围', desc: '+0.3 范围', effects: { range: 0.3 } }
      ],
      slot3: [
        { id: 'e3_a', name: '爆发', desc: '+22% 爆击伤害', effects: { crit_mult: 0.22 } },
        { id: 'e3_b', name: '侵蚀', desc: '+80% 状态伤害', effects: { status_damage: 0.8 } }
      ],
      slot4: [
        { id: 'e4_a', name: '狂暴', desc: '+42% 基础伤害', effects: { base: 0.42 } },
        { id: 'e4_b', name: '致命一击', desc: '+30% 暴击伤害, +12% 暴击几率', effects: { crit_mult: 0.30, crit_chance: 0.12 } }
      ]
    },
    'Furax Wraith': {
      slot1: [
        { id: 'e1_a', name: '灵巧', desc: '+15% 暴击几率', effects: { crit_chance: 0.15 } },
        { id: 'e1_b', name: '强韧', desc: '+20% 状态几率', effects: { status_chance: 0.20 } }
      ],
      slot2: [
        { id: 'e2_a', name: '充能', desc: '+12% 攻击速度', effects: { speed: 0.12 } },
        { id: 'e2_b', name: '范围', desc: '+0.5 范围', effects: { range: 0.5 } }
      ],
      slot3: [
        { id: 'e3_a', name: '爆发', desc: '+25% 爆击伤害', effects: { crit_mult: 0.25 } },
        { id: 'e3_b', name: '侵蚀', desc: '+100% 状态伤害', effects: { status_damage: 1.0 } }
      ],
      slot4: [
        { id: 'e4_a', name: '狂暴', desc: '+50% 基础伤害', effects: { base: 0.50 } },
        { id: 'e4_b', name: '致命一击', desc: '+35% 暴击伤害, +15% 暴击几率', effects: { crit_mult: 0.35, crit_chance: 0.15 } }
      ]
    },
    'Hate': {
      slot1: [
        { id: 'e1_a', name: '灵巧', desc: '+18% 暴击几率', effects: { crit_chance: 0.18 } },
        { id: 'e1_b', name: '强韧', desc: '+22% 状态几率', effects: { status_chance: 0.22 } }
      ],
      slot2: [
        { id: 'e2_a', name: '充能', desc: '+12% 攻击速度', effects: { speed: 0.12 } },
        { id: 'e2_b', name: '范围', desc: '+0.3 范围', effects: { range: 0.3 } }
      ],
      slot3: [
        { id: 'e3_a', name: '爆发', desc: '+30% 爆击伤害', effects: { crit_mult: 0.30 } },
        { id: 'e3_b', name: '侵蚀', desc: '+120% 状态伤害', effects: { status_damage: 1.2 } }
      ],
      slot4: [
        { id: 'e4_a', name: '狂暴', desc: '+60% 基础伤害', effects: { base: 0.60 } },
        { id: 'e4_b', name: '致命一击', desc: '+40% 暴击伤害, +18% 暴击几率', effects: { crit_mult: 0.40, crit_chance: 0.18 } }
      ]
    },
    'Innodem': {
      slot1: [
        { id: 'e1_a', name: '灵巧', desc: '+15% 暴击几率', effects: { crit_chance: 0.15 } },
        { id: 'e1_b', name: '强韧', desc: '+20% 状态几率', effects: { status_chance: 0.20 } }
      ],
      slot2: [
        { id: 'e2_a', name: '充能', desc: '+12% 攻击速度', effects: { speed: 0.12 } },
        { id: 'e2_b', name: '范围', desc: '+0.5 范围', effects: { range: 0.5 } }
      ],
      slot3: [
        { id: 'e3_a', name: '爆发', desc: '+25% 爆击伤害', effects: { crit_mult: 0.25 } },
        { id: 'e3_b', name: '侵蚀', desc: '+100% 状态伤害', effects: { status_damage: 1.0 } }
      ],
      slot4: [
        { id: 'e4_a', name: '狂暴', desc: '+50% 基础伤害', effects: { base: 0.50 } },
        { id: 'e4_b', name: '致命一击', desc: '+35% 暴击伤害, +15% 暴击几率', effects: { crit_mult: 0.35, crit_chance: 0.15 } }
      ]
    },
    'Magistar': {
      slot1: [
        { id: 'e1_a', name: '灵巧', desc: '+12% 暴击几率', effects: { crit_chance: 0.12 } },
        { id: 'e1_b', name: '强韧', desc: '+18% 状态几率', effects: { status_chance: 0.18 } }
      ],
      slot2: [
        { id: 'e2_a', name: '充能', desc: '+10% 攻击速度', effects: { speed: 0.10 } },
        { id: 'e2_b', name: '范围', desc: '+0.5 范围', effects: { range: 0.5 } }
      ],
      slot3: [
        { id: 'e3_a', name: '爆发', desc: '+22% 爆击伤害', effects: { crit_mult: 0.22 } },
        { id: 'e3_b', name: '侵蚀', desc: '+80% 状态伤害', effects: { status_damage: 0.8 } }
      ],
      slot4: [
        { id: 'e4_a', name: '狂暴', desc: '+42% 基础伤害', effects: { base: 0.42 } },
        { id: 'e4_b', name: '致命一击', desc: '+30% 暴击伤害, +12% 暴击几率', effects: { crit_mult: 0.30, crit_chance: 0.12 } }
      ]
    },
    'Mk1-Furax': {
      slot1: [
        { id: 'e1_a', name: '灵巧', desc: '+10% 暴击几率', effects: { crit_chance: 0.10 } },
        { id: 'e1_b', name: '强韧', desc: '+15% 状态几率', effects: { status_chance: 0.15 } }
      ],
      slot2: [
        { id: 'e2_a', name: '充能', desc: '+8% 攻击速度', effects: { speed: 0.08 } },
        { id: 'e2_b', name: '范围', desc: '+0.3 范围', effects: { range: 0.3 } }
      ],
      slot3: [
        { id: 'e3_a', name: '爆发', desc: '+18% 爆击伤害', effects: { crit_mult: 0.18 } },
        { id: 'e3_b', name: '侵蚀', desc: '+60% 状态伤害', effects: { status_damage: 0.6 } }
      ],
      slot4: [
        { id: 'e4_a', name: '狂暴', desc: '+35% 基础伤害', effects: { base: 0.35 } },
        { id: 'e4_b', name: '致命一击', desc: '+25% 暴击伤害, +10% 暴击几率', effects: { crit_mult: 0.25, crit_chance: 0.10 } }
      ]
    },
    'Dual Toxocyst': {
      slot1: [
        { id: 'e1_a', name: '灵巧', desc: '+18% 暴击几率', effects: { crit_chance: 0.18 } },
        { id: 'e1_b', name: '强韧', desc: '+22% 状态几率', effects: { status_chance: 0.22 } }
      ],
      slot2: [
        { id: 'e2_a', name: '充能', desc: '+15% 射速', effects: { speed: 0.15 } },
        { id: 'e2_b', name: '弹幕', desc: '+22 多重射击', effects: { multishot: 0.22 } }
      ],
      slot3: [
        { id: 'e3_a', name: '爆发', desc: '+28% 爆击伤害', effects: { crit_mult: 0.28 } },
        { id: 'e3_b', name: '侵蚀', desc: '+100% 状态伤害', effects: { status_damage: 1.0 } }
      ],
      slot4: [
        { id: 'e4_a', name: '狂暴', desc: '+50% 基础伤害', effects: { base: 0.50 } },
        { id: 'e4_b', name: '弹幕风暴', desc: '+32% 射速, +18% 多重射击', effects: { speed: 0.32, multishot: 0.18 } }
      ]
    },
    'Dex Sybaris': {
      slot1: [
        { id: 'e1_a', name: '灵巧', desc: '+18% 暴击几率', effects: { crit_chance: 0.18 } },
        { id: 'e1_b', name: '强韧', desc: '+22% 状态几率', effects: { status_chance: 0.22 } }
      ],
      slot2: [
        { id: 'e2_a', name: '充能', desc: '+12% 射速', effects: { speed: 0.12 } },
        { id: 'e2_b', name: '弹幕', desc: '+22 多重射击', effects: { multishot: 0.22 } }
      ],
      slot3: [
        { id: 'e3_a', name: '爆发', desc: '+28% 爆击伤害', effects: { crit_mult: 0.28 } },
        { id: 'e3_b', name: '侵蚀', desc: '+100% 状态伤害', effects: { status_damage: 1.0 } }
      ],
      slot4: [
        { id: 'e4_a', name: '狂暴', desc: '+55% 基础伤害', effects: { base: 0.55 } },
        { id: 'e4_b', name: '致命一击', desc: '+38% 暴击伤害, +15% 暴击几率', effects: { crit_mult: 0.38, crit_chance: 0.15 } }
      ]
    },
    'Felarx': {
      slot1: [
        { id: 'e1_a', name: '灵巧', desc: '+15% 暴击几率', effects: { crit_chance: 0.15 } },
        { id: 'e1_b', name: '强韧', desc: '+20% 状态几率', effects: { status_chance: 0.20 } }
      ],
      slot2: [
        { id: 'e2_a', name: '充能', desc: '+10% 射速', effects: { speed: 0.10 } },
        { id: 'e2_b', name: '弹幕', desc: '+1 多重射击', effects: { multishot: 1 } }
      ],
      slot3: [
        { id: 'e3_a', name: '爆发', desc: '+25% 爆击伤害', effects: { crit_mult: 0.25 } },
        { id: 'e3_b', name: '侵蚀', desc: '+100% 状态伤害', effects: { status_damage: 1.0 } }
      ],
      slot4: [
        { id: 'e4_a', name: '狂暴', desc: '+50% 基础伤害', effects: { base: 0.50 } },
        { id: 'e4_b', name: '致命一击', desc: '+35% 暴击伤害, +12% 暴击几率', effects: { crit_mult: 0.35, crit_chance: 0.12 } }
      ]
    },
    'Laetum': {
      slot1: [
        { id: 'e1_a', name: '灵巧', desc: '+15% 暴击几率', effects: { crit_chance: 0.15 } },
        { id: 'e1_b', name: '强韧', desc: '+20% 状态几率', effects: { status_chance: 0.20 } }
      ],
      slot2: [
        { id: 'e2_a', name: '充能', desc: '+15% 射速', effects: { speed: 0.15 } },
        { id: 'e2_b', name: '弹幕', desc: '+25 多重射击', effects: { multishot: 0.25 } }
      ],
      slot3: [
        { id: 'e3_a', name: '爆发', desc: '+25% 爆击伤害', effects: { crit_mult: 0.25 } },
        { id: 'e3_b', name: '侵蚀', desc: '+100% 状态伤害', effects: { status_damage: 1.0 } }
      ],
      slot4: [
        { id: 'e4_a', name: '狂暴', desc: '+55% 基础伤害', effects: { base: 0.55 } },
        { id: 'e4_b', name: '弹幕风暴', desc: '+30% 射速, +20% 多重射击', effects: { speed: 0.30, multishot: 0.20 } }
      ]
    }
  },

  // ═══════════════ 武器→Incarnon进化 映射 ═══════════════
  // 检查武器是否有Incarnon进化数据
  hasIncarnonEvo(weaponName) {
    return !!this.INCARNON_EVOLUTIONS[weaponName];
  },

  getIncarnonEvo(weaponName) {
    return this.INCARNON_EVOLUTIONS[weaponName] || null;
  }
};

if (typeof module !== 'undefined' && module.exports) module.exports = GameData;
