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
  weapons: {"Acceltra":{"noise":"Alarming","releaseDate":"2019-08-29","ammoCapacity":96,"productCategory":"LongGuns","equipTime":1.1,"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":48,"reloadTime":2,"multishot":1,"attacks":[{"name":"Rocket Impact","speed":12,"crit_chance":32,"crit_mult":2.8,"status_chance":6,"shot_type":"Projectile","shot_speed":70,"flight":70,"unique":{"force_procs":["impact"]},"damage":{"Impact":35}},{"name":"Rocket Explosion","speed":12,"crit_chance":32,"crit_mult":2.8,"status_chance":6,"shot_type":"AoE","damage":{"Slash":8.8,"Puncture":35.2},"falloff":{"start":0,"end":4,"reduction":0.5},"no_headshot_mult":true}],
    "imageName":"acceltra.webp","tags":["Tenno"],
    "compTags":["PROJECTILE","AOE","ASSAULT_AMMO"],
    "comb":[[0,1]]},"Acceltra Prime":{"noise":"Alarming","releaseDate":"2024-01-17","ammoCapacity":96,"productCategory":"LongGuns","category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":48,"reloadTime":1.6,"multishot":1,"attacks":[{"name":"Rocket Impact","speed":10,"crit_chance":34,"crit_mult":3,"status_chance":18,"shot_type":"Projectile","shot_speed":70,"flight":70,"unique":{"force_procs":["impact"]},"damage":{"Impact":44}},{"name":"Rocket Explosion","speed":10,"crit_chance":34,"crit_mult":3,"status_chance":18,"shot_type":"AoE","damage":{"Slash":10.6,"Puncture":42.4},"falloff":{"start":0,"end":4,"reduction":0.5},"no_headshot_mult":true}],
    "imageName":"AcceltraPrime.webp","tags":["Tenno"],
    "compTags":["PROJECTILE","AOE","ASSAULT_AMMO"],
    "comb":[[0,1]]},"Acrid":{"noise":"Alarming","releaseDate":"2013-05-23","productCategory":"Pistols","category":"Secondary","trigger":"Semi","type":"Pistol","magazineSize":15,"reloadTime":1.2,"multishot":1,"attacks":[{"name":"Normal Attack","speed":6.67,"crit_chance":5,"crit_mult":2,"status_chance":10,"shot_type":"Projectile","shot_speed":65,"flight":65,"unique":{"force_procs":["toxin"]},"damage":{"Toxin":35}}],
    "imageName":"acrid.webp","tags":["Grineer"],
    "compTags":["PROJECTILE"]},"AX-52":{"noise":"Alarming","releaseDate":"2024-07-20","ammoCapacity":540,"productCategory":"LongGuns","category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":40,"reloadTime":2,"multishot":1,"attacks":[{"name":"Normal Attack","speed":10,"crit_chance":26,"crit_mult":2.4,"status_chance":18,"shot_type":"Hit-Scan","damage":{"Puncture":40}}],
    "imageName":"AX-52.webp","tags":[""],
    "compTags":["ASSAULT_AMMO","AX52"]},"Aegrit":{"noise":"Silent","releaseDate":"2022-09-07","ammoCapacity":4,"productCategory":"Pistols","zoomProps":[[]],"category":"Secondary","trigger":"Active","type":"Throwing","magazineSize":2,"reloadTime":1.3,"multishot":1,"attacks":[{"name":"Direct Hit","speed":2,"crit_chance":37,"crit_mult":1.9,"status_chance":19,"shot_type":"Projectile","shot_speed":30,"flight":30,"damage":{"Impact":4.5,"Slash":2.7,"Puncture":1.8}},{"name":"Detonation","speed":2,"crit_chance":37,"crit_mult":2,"status_chance":19,"shot_type":"AoE","damage":{"Blast":797},"falloff":{"start":0,"end":9,"reduction":0.7},"no_headshot_mult":true}],
    "imageName":"aegrit.webp","tags":["Grineer"],
    "compTags":["PROJECTILE","THROWN","AOE"],
    "comb":[[0,1]]},"Afentis Prime":{"noise":"Alarming","releaseDate":"2026-06-17","ammoCapacity":12,"productCategory":"LongGuns","zoomProps":[[]],"category":"Primary","trigger":"Semi-Auto","type":"Rifle","magazineSize":4,"reloadTime":1.8,"multishot":1,"attacks":[{"name":"Semi","speed":0.833,"crit_chance":26,"crit_mult":2.6,"status_chance":30,"shot_type":"Projectile","shot_speed":90,"unique":{"WITH_COND":{"speed":0.2},"force_procs":["impact"]},"damage":{"Impact":40,"Slash":40,"Puncture":120}},{"name":"Radial Attack","speed":0.833,"crit_chance":26,"crit_mult":2.6,"status_chance":10,"shot_type":"AoE","unique":{"force_procs":["heat"]},"damage":{"Blast":800,"Heat":250},"no_headshot_mult":true},{"name":"Spear Throw","speed":1,"crit_chance":40,"crit_mult":3,"status_chance":30,"shot_type":"Projectile","shot_speed":90,"damage":{"Impact":330,"Slash":55,"Puncture":165}}],
    "imageName":"AfentisPrime.webp","tags":[],
    "compTags":["PROJECTILE","IMPACTEXPLODE"],
    "comb":[[0,1]]},"Afentis":{"noise":"Alarming","releaseDate":"2022-09-07","ammoCapacity":12,"productCategory":"LongGuns","equipTime":1.1,"zoomProps":[[]],"category":"Primary","trigger":"Semi","type":"Rifle","magazineSize":4,"reloadTime":1.8,"multishot":1,"attacks":[{"name":"Semi","speed":0.833,"crit_chance":26,"crit_mult":2.2,"status_chance":24,"shot_type":"Projectile","shot_speed":90,"flight":90,"unique":{"WITH_COND":{"speed":0.2}},"damage":{"Impact":20,"Slash":20,"Puncture":60}},{"name":"Radial Attack","speed":0.833,"crit_chance":26,"crit_mult":2.2,"status_chance":24,"shot_type":"AoE","damage":{"Blast":800},"falloff":{"start":0,"end":3,"reduction":0.4},"no_headshot_mult":true},{"name":"Spear Throw","speed":1,"crit_chance":30,"crit_mult":3,"status_chance":20,"shot_type":"Projectile","shot_speed":90,"flight":90,"damage":{"Impact":240,"Slash":40,"Puncture":120}}],
    "imageName":"afentis.webp","tags":["Tenno"],
    "compTags":["PROJECTILE","IMPACTEXPLODE"],
    "comb":[[0,1]]},"Afuris Prime":{"noise":"Alarming","releaseDate":"2022-12-14","ammoCapacity":400,"productCategory":"Pistols","zoomProps":[[]],"category":"Secondary","trigger":"Auto","type":"Pistol","magazineSize":80,"reloadTime":1.2,"multishot":1,"attacks":[{"name":"Normal Attack","speed":12.5,"crit_chance":16,"crit_mult":2,"status_chance":30,"shot_type":"Hit-Scan","damage":{"Impact":3.9,"Slash":3.9,"Puncture":18.2}}],
    "imageName":"afuris-prime.webp","tags":["Prime"],
    "compTags":[]},"Afuris":{"noise":"Alarming","releaseDate":"2013-01-10","ammoCapacity":240,"productCategory":"Pistols","category":"Secondary","trigger":"Auto","type":"Dual Pistols","magazineSize":70,"reloadTime":2,"multishot":1,"attacks":[{"name":"Normal Attack","speed":12.5,"crit_chance":5,"crit_mult":2,"status_chance":12,"shot_type":"Hit-Scan","damage":{"Impact":3,"Slash":3,"Puncture":14}}],
    "imageName":"afuris.webp","tags":["Tenno"],
    "compTags":[]},"Aeolak":{"noise":"Alarming","releaseDate":"2022-04-27","ammoCapacity":400,"productCategory":"LongGuns","equipTime":1.1,"zoomProps":[[]],"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":40,"reloadTime":2,"multishot":1,"attacks":[{"name":"Normal Attack","speed":6,"crit_chance":21,"crit_mult":2.3,"status_chance":33,"shot_type":"Projectile","shot_speed":100,"flight":100,"damage":{"Impact":15,"Slash":17,"Puncture":23,"Radiation":5}},{"name":"Alt-Fire","speed":1.5,"crit_chance":21,"crit_mult":2.3,"status_chance":33,"shot_type":"Projectile","shot_speed":60,"flight":60,"damage":{"Impact":58.2,"Slash":29.1,"Puncture":9.7}},{"name":"Alt-Fire Explosion","speed":1.5,"crit_chance":21,"crit_mult":2.3,"status_chance":33,"shot_type":"AoE","unique":{"force_procs":["impact"]},"damage":{"Blast":789},"falloff":{"start":0,"end":7,"reduction":0.5},"no_headshot_mult":true}],
    "imageName":"aeolak.webp","tags":["Duviri"],
    "compTags":["ASSAULT_AMMO","PROJECTILE","AOE"],
    "comb":[[1,2]]},"Ack & Brunt":{"blockingAngle":70,"comboDuration":5,"followThrough":0.6,"range":2.5,"windUp":0.7,"releaseDate":"2015-07-31","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":0.833,"crit_chance":20,"crit_mult":2,"status_chance":10,"damage":{"Impact":14.9,"Slash":119.2,"Puncture":14.9}},{"name":"Incarnon Form Arial Slam","speed":0.833,"crit_chance":14,"crit_mult":2,"status_chance":34,"damage":{"Impact":59.6,"Slash":208.6,"Puncture":29.8}},{"name":"Incarnon Form Arial Slam AoE","speed":0.833,"crit_chance":14,"crit_mult":2,"status_chance":34,"unique":{"force_procs":["impact"]},"damage":{"Heat":606}},{"name":"Incarnon Form Slide Slam","speed":0.833,"crit_chance":14,"crit_mult":2,"status_chance":34,"damage":{"Impact":29.8,"Slash":104.3,"Puncture":14.9}},{"name":"Incarnon Form Slide Slam AoE","speed":0.833,"crit_chance":14,"crit_mult":2,"status_chance":34,"unique":{"force_procs":["impact"]},"damage":{"Heat":303}},{"name":"Slam","speed":1,"crit_chance":20,"crit_mult":2,"status_chance":10,"unique":{"force_procs":["impact"]},"damage":{"Impact":298}},{"name":"Heavy Slam","speed":1,"crit_chance":20,"crit_mult":2,"status_chance":10,"damage":{"Blast":447}}],
    "imageName":"ack-&-brunt.webp","tags":["Grineer","Incarnon"],
    "compTags":["SWORDS_AND_SHIELD_STANCE"]},"Akbronco Prime":{"noise":"Alarming","releaseDate":"2014-03-06","productCategory":"Pistols","category":"Secondary","trigger":"Semi","type":"Dual Pistols","magazineSize":8,"reloadTime":2.25,"multishot":7,"attacks":[{"name":"Normal Attack","speed":4.33,"crit_chance":6,"crit_mult":2,"status_chance":12.86,"shot_type":"Hit-Scan","damage":{"Impact":40,"Slash":5,"Puncture":5},"falloff":{"start":9,"end":18,"reduction":0.75}}],
    "imageName":"akbronco-prime.webp","tags":["Prime","Never Vaulted"],
    "compTags":["SECONDARYSHOTGUN","AKBRONCO_PRIME"]},"Akjagara Prime":{"noise":"Alarming","releaseDate":"2018-12-12","ammoCapacity":320,"productCategory":"Pistols","zoomProps":[[]],"category":"Secondary","trigger":"Burst","type":"Pistol","magazineSize":40,"reloadTime":1.4,"multishot":1,"attacks":[{"name":"Normal Attack","speed":5,"crit_chance":18,"crit_mult":2.2,"status_chance":32,"shot_type":"Hit-Scan","damage":{"Impact":3.6,"Slash":28.8,"Puncture":3.6}}],
    "imageName":"akjagara-prime.webp","tags":["Prime","Vaulted"],
    "compTags":["AKJAGARA"]},"Akarius":{"noise":"Alarming","releaseDate":"2019-08-29","ammoCapacity":20,"productCategory":"Pistols","zoomProps":[[]],"category":"Secondary","trigger":"Burst","type":"Pistol","magazineSize":10,"reloadTime":3.4,"multishot":1,"attacks":[{"name":"Rocket Impact","speed":4.33,"crit_chance":6,"crit_mult":1.8,"status_chance":28,"shot_type":"Projectile","shot_speed":80,"flight":80,"damage":{"Impact":68}},{"name":"Rocket Detonation","speed":4.33,"crit_chance":6,"crit_mult":1.8,"status_chance":28,"shot_type":"AoE","damage":{"Blast":419},"falloff":{"start":0,"end":7.2,"reduction":0.7},"no_headshot_mult":true}],
    "imageName":"akarius.webp","tags":["Tenno"],
    "compTags":["AOE"],
    "comb":[[0,1]]},"Akbolto":{"noise":"Alarming","releaseDate":"2013-01-29","productCategory":"Pistols","category":"Secondary","trigger":"Semi","type":"Dual Pistols","magazineSize":30,"reloadTime":2.6,"multishot":1,"attacks":[{"name":"Normal Attack","speed":10,"crit_chance":16,"crit_mult":2.4,"status_chance":2.2,"shot_type":"Projectile","shot_speed":75,"flight":75,"damage":{"Impact":4,"Puncture":36}}],
    "imageName":"akbolto.webp","tags":["Tenno"],
    "compTags":["PROJECTILE"]},"Akjagara":{"noise":"Alarming","releaseDate":"2015-02-05","productCategory":"Pistols","category":"Secondary","trigger":"Burst","type":"Dual Pistol","magazineSize":36,"reloadTime":2.25,"multishot":1,"attacks":[{"name":"Normal Attack","speed":5,"crit_chance":6,"crit_mult":2,"status_chance":28,"shot_type":"Hit-Scan","damage":{"Impact":4.5,"Slash":21,"Puncture":4.5}}],
    "imageName":"akjagara.webp","tags":["Tenno"],
    "compTags":["AKJAGARA"]},"Akbolto Prime":{"noise":"Alarming","releaseDate":"2017-12-12","productCategory":"Pistols","category":"Secondary","trigger":"Semi","type":"Pistol","magazineSize":40,"reloadTime":1.3,"multishot":1,"attacks":[{"name":"Normal Attack","speed":7,"crit_chance":36,"crit_mult":2.8,"status_chance":14,"shot_type":"Projectile","shot_speed":100,"flight":100,"damage":{"Impact":3.2,"Slash":1.28,"Puncture":27.52}}],
    "imageName":"akbolto-prime.webp","tags":["Prime","Vaulted"],
    "compTags":["PROJECTILE"]},"Akarius Prime":{"noise":"Alarming","releaseDate":"2024-01-17","ammoCapacity":24,"productCategory":"Pistols","zoomProps":[[]],"category":"Secondary","trigger":"Burst","type":"Pistol","magazineSize":8,"reloadTime":2.4,"multishot":1,"attacks":[{"name":"Rocket Impact","speed":3.667,"crit_chance":18,"crit_mult":2,"status_chance":34,"shot_type":"Projectile","shot_speed":80,"flight":80,"damage":{"Impact":68}},{"name":"Rocket Detonation","speed":3.667,"crit_chance":18,"crit_mult":2,"status_chance":34,"shot_type":"AoE","damage":{"Blast":509},"no_headshot_mult":true}],
    "imageName":"AkariusPrime.webp","tags":["Tenno"],
    "compTags":["AOE"],
    "comb":[[0,1]]},"Akbronco":{"noise":"Alarming","releaseDate":"2013-05-23","productCategory":"Pistols","category":"Secondary","trigger":"Semi","type":"Dual Pistols","magazineSize":4,"reloadTime":2.25,"multishot":7,"attacks":[{"name":"Normal Attack","speed":8.33,"crit_chance":6,"crit_mult":2,"status_chance":3.14,"shot_type":"Hit-Scan","damage":{"Impact":32,"Slash":4,"Puncture":4},"falloff":{"start":7,"end":14,"reduction":0.75}}],
    "imageName":"akbronco.webp","tags":["Tenno"],
    "compTags":["SECONDARYSHOTGUN","SINGLESHOT"]},"Aklato":{"noise":"Alarming","releaseDate":"2012-10-25","productCategory":"Pistols","category":"Secondary","trigger":"Semi","type":"Dual Pistols","magazineSize":30,"reloadTime":2.4000001,"multishot":1,"attacks":[{"name":"Normal Attack","speed":7.5,"crit_chance":10,"crit_mult":1.8,"status_chance":6,"shot_type":"Hit-Scan","damage":{"Impact":4.5,"Slash":18,"Puncture":7.5}}],
    "imageName":"aklato.webp","tags":[],
    "compTags":[]},"Aklex Prime":{"noise":"Alarming","releaseDate":"2017-01-27","productCategory":"Pistols","category":"Secondary","trigger":"Semi","type":"Dual Pistols","magazineSize":16,"reloadTime":3,"multishot":1,"attacks":[{"name":"Normal Attack","speed":2.67,"crit_chance":25,"crit_mult":2,"status_chance":25,"shot_type":"Hit-Scan","damage":{"Impact":15,"Slash":15,"Puncture":120}}],
    "imageName":"aklex-prime.webp","tags":["Prime","Baro"],
    "compTags":[]},"Aksomati":{"noise":"Alarming","releaseDate":"2015-04-09","ammoCapacity":420,"productCategory":"Pistols","category":"Secondary","trigger":"Auto","type":"Pistol","magazineSize":70,"reloadTime":1.4,"multishot":1,"attacks":[{"name":"Fully Spooled","speed":12.5,"crit_chance":24,"crit_mult":3,"status_chance":8,"shot_type":"Hit-Scan","damage":{"Impact":1.8,"Slash":9,"Puncture":7.2}}],
    "imageName":"aksomati.webp","tags":["Tenno"],
    "compTags":[]},"Aksomati Prime":{"noise":"Alarming","releaseDate":"2019-12-17","ammoCapacity":880,"productCategory":"Pistols","zoomProps":[[]],"category":"Secondary","trigger":"Auto","type":"Pistol","magazineSize":80,"reloadTime":1.4,"multishot":1,"attacks":[{"name":"Fully Spooled","speed":13.33,"crit_chance":24,"crit_mult":3,"status_chance":18,"shot_type":"Hit-Scan","damage":{"Impact":2,"Slash":10,"Puncture":8}}],
    "imageName":"aksomati-prime.webp","tags":["Prime"],
    "compTags":[]},"Akmagnus Prime":{"noise":"Alarming","releaseDate":"2024-07-22","ammoCapacity":210,"productCategory":"Pistols","category":"Secondary","trigger":"Semi","type":"Dual Pistols","magazineSize":16,"reloadTime":2.8,"multishot":1,"attacks":[{"name":"Normal Attack","speed":5.67,"crit_chance":28,"crit_mult":2.8,"status_chance":28,"shot_type":"Hit-Scan","unique":{"ammoEff":1},"damage":{"Impact":44.1,"Slash":26.95,"Puncture":26.95}}],
    "imageName":"AkmagnusPrime.webp","tags":[],
    "compTags":[]},"Akmagnus":{"noise":"Alarming","releaseDate":"2014-01-29","productCategory":"Pistols","category":"Secondary","trigger":"Semi","type":"Dual Pistols","magazineSize":16,"reloadTime":2.4000001,"multishot":1,"attacks":[{"name":"Normal Attack","speed":6.17,"crit_chance":22,"crit_mult":2,"status_chance":22,"shot_type":"Hit-Scan","damage":{"Impact":34.2,"Slash":20.9,"Puncture":20.9}}],
    "imageName":"akmagnus.webp","tags":["Tenno"],
    "compTags":[]},"Akvasto":{"noise":"Alarming","releaseDate":"2013-08-30","ammoCapacity":210,"productCategory":"Pistols","category":"Secondary","trigger":"Semi","type":"Dual Pistols","magazineSize":12,"reloadTime":2,"multishot":1,"attacks":[{"name":"Normal Attack","speed":8.67,"crit_chance":16,"crit_mult":1.8,"status_chance":12,"shot_type":"Hit-Scan","damage":{"Impact":14.5,"Slash":29,"Puncture":14.5}}],
    "imageName":"akvasto.webp","tags":["Tenno"],
    "compTags":[]},"Akstiletto":{"noise":"Alarming","releaseDate":"2014-02-05","productCategory":"Pistols","category":"Secondary","trigger":"Auto","type":"Pistol","magazineSize":28,"reloadTime":1.1,"multishot":1,"attacks":[{"name":"Normal Attack","speed":10,"crit_chance":18,"crit_mult":1.8,"status_chance":18,"shot_type":"Hit-Scan","damage":{"Impact":16.8,"Slash":8.4,"Puncture":2.8}}],
    "imageName":"akstiletto.webp","tags":["Tenno"],
    "compTags":[]},"Aklex":{"noise":"Alarming","releaseDate":"2013-11-27","productCategory":"Pistols","category":"Secondary","trigger":"Semi","type":"Dual Pistols","magazineSize":12,"reloadTime":3,"multishot":1,"attacks":[{"name":"Normal Attack","speed":1.58,"crit_chance":20,"crit_mult":2,"status_chance":10,"shot_type":"Hit-Scan","damage":{"Impact":13,"Slash":13,"Puncture":104}}],
    "imageName":"aklex.webp","tags":["Tenno"],
    "compTags":[]},"Akstiletto Prime":{"noise":"Alarming","releaseDate":"2016-05-17","ammoCapacity":400,"productCategory":"Pistols","category":"Secondary","trigger":"Auto","type":"Pistol","magazineSize":40,"reloadTime":1.1,"multishot":1,"attacks":[{"name":"Normal Attack","speed":7.08,"crit_chance":15,"crit_mult":2,"status_chance":30,"shot_type":"Hit-Scan","damage":{"Impact":21.6,"Slash":10.8,"Puncture":3.6}}],
    "imageName":"akstiletto-prime.webp","tags":["Prime"],
    "compTags":["AKSTILETTO_PRIME"]},"Akvasto Prime":{"noise":"Alarming","releaseDate":"2018-11-14","productCategory":"Pistols","zoomProps":[[]],"category":"Secondary","trigger":"Semi","type":"Pistol","magazineSize":12,"reloadTime":1.4,"multishot":1,"attacks":[{"name":"Normal Attack","speed":6.33,"crit_chance":22,"crit_mult":2.4,"status_chance":22,"shot_type":"Hit-Scan","damage":{"Impact":9.9,"Slash":46.2,"Puncture":9.9}}],
    "imageName":"akvasto-prime.webp","tags":["Prime","Baro"],
    "compTags":[]},"Amanata":{"blockingAngle":55,"comboDuration":5,"followThrough":0.6,"range":3,"windUp":0.9,"releaseDate":"2024-10-02","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":1,"crit_chance":24,"crit_mult":2,"status_chance":24,"damage":{"Slash":88.2,"Puncture":37.8}},{"name":"Slam","speed":1,"crit_chance":24,"crit_mult":2,"status_chance":24,"unique":{"force_procs":["heat"]},"damage":{"Heat":252}},{"name":"Heavy Slam","speed":1,"crit_chance":24,"crit_mult":2,"status_chance":24,"damage":{"Slash":264.6,"Puncture":113.4}}],
    "imageName":"Amanata.webp","tags":[],
    "compTags":["POLEARMS_STANCE"]},"Ambassador":{"noise":"Alarming","releaseDate":"2021-07-06","ammoCapacity":960,"productCategory":"LongGuns","equipTime":1.1,"zoomProps":[[]],"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":96,"reloadTime":2.6,"multishot":1,"attacks":[{"name":"Auto","speed":13.33,"crit_chance":14,"crit_mult":2.8,"status_chance":26,"shot_type":"Hit-Scan","damage":{"Electricity":29}},{"name":"Charge","speed":1,"crit_chance":16,"crit_mult":2.8,"status_chance":32,"shot_type":"Hit-Scan","damage":{"Electricity":600}},{"name":"Charged AoE","speed":1,"crit_chance":16,"crit_mult":2.8,"status_chance":32,"shot_type":"AoE","damage":{"Electricity":800},"falloff":{"start":0,"end":6,"reduction":0.5},"no_headshot_mult":true}],
    "imageName":"ambassador.webp","tags":["Corpus"],
    "compTags":["ASSAULT_AMMO"],
    "comb":[[1,2]]},"Alternox Prime":{"noise":"Alarming","releaseDate":"2025-12-10","ammoCapacity":540,"productCategory":"LongGuns","zoomProps":[[]],"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":42,"reloadTime":1.8,"multishot":1,"attacks":[{"name":"Normal Attack","speed":5.33,"crit_chance":20,"crit_mult":2.2,"status_chance":40,"shot_type":"Projectile","shot_speed":60,"flight":60,"damage":{"Electricity":75}},{"name":"Alt-Fire Contact","speed":1.5,"crit_chance":2,"crit_mult":2,"status_chance":50,"shot_type":"Projectile","shot_speed":60,"flight":60,"damage":{"Impact":7,"Slash":10.5,"Puncture":52.5}},{"name":"Alt-Fire Damage over Time","speed":1,"crit_chance":2,"crit_mult":2,"status_chance":50,"damage":{"Electricity":70},"falloff":{"start":0,"end":6,"reduction":0.6}},{"name":"Alt-Fire Explosion","speed":1,"crit_chance":2,"crit_mult":2,"status_chance":44,"shot_type":"AoE","damage":{"Electricity":140},"falloff":{"start":0,"end":6,"reduction":0.6},"no_headshot_mult":true}],
    "imageName":"AlternoxPrime.webp","tags":["Tenno"],
    "compTags":["PROJECTILE","ASSAULT_AMMO","AOE"],
    "comb":[[1,2,3]]},"Akzani":{"noise":"Alarming","releaseDate":"2014-07-18","ammoCapacity":400,"productCategory":"Pistols","category":"Secondary","trigger":"Auto","type":"Pistol","magazineSize":100,"reloadTime":2,"multishot":1,"attacks":[{"name":"Normal Attack","speed":20,"crit_chance":14,"crit_mult":2,"status_chance":14,"shot_type":"Hit-Scan","damage":{"Impact":1.8,"Slash":1.8,"Puncture":8.4}}],
    "imageName":"akzani.webp","tags":["Tenno"],
    "compTags":[]},"Amprex":{"noise":"Alarming","releaseDate":"2014-04-23","ammoCapacity":700,"productCategory":"LongGuns","equipTime":1.1,"zoomProps":[[]],"category":"Primary","trigger":"Held","type":"Rifle","magazineSize":100,"reloadTime":2.6,"multishot":1,"attacks":[{"name":"Normal Attack","speed":12,"crit_chance":32,"crit_mult":2.2,"status_chance":22,"shot_type":"Discharge","damage":{"Electricity":22}}],
    "imageName":"amprex.webp","tags":["Corpus"],
    "compTags":["BEAM","ASSAULT_AMMO","AOE"]},"Amphis":{"blockingAngle":60,"comboDuration":5,"followThrough":0.5,"range":3,"windUp":0.5,"releaseDate":"2013-02-22","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":1.25,"crit_chance":13,"crit_mult":1.7,"status_chance":21,"damage":{"Impact":91,"Slash":19.5,"Puncture":19.5}},{"name":"Slam","speed":1,"crit_chance":13,"crit_mult":1.7,"status_chance":21,"unique":{"force_procs":["impact"]},"damage":{"Electricity":260}},{"name":"Heavy Slam","speed":1,"crit_chance":13,"crit_mult":1.7,"status_chance":21,"damage":{"Electricity":390}}],
    "imageName":"amphis.webp","tags":["Grineer"],
    "compTags":["STAVES_STANCE"]},"Angstrum":{"noise":"Alarming","releaseDate":"2014-05-14","ammoCapacity":18,"productCategory":"Pistols","category":"Secondary","trigger":"Charge","type":"Pistol","magazineSize":1,"reloadTime":2.5,"multishot":1,"attacks":[{"name":"Single Rocket Impact","speed":2,"crit_chance":16,"crit_mult":2,"status_chance":22,"shot_type":"Projectile","shot_speed":150,"flight":150,"damage":{"Blast":200}},{"name":"Single Rocket Explosion","speed":2,"crit_chance":16,"crit_mult":2,"status_chance":22,"shot_type":"AoE","damage":{"Blast":250},"falloff":{"start":0,"end":3.6,"reduction":0.4},"no_headshot_mult":true},{"name":"Incarnon Form","speed":6,"crit_chance":18,"crit_mult":1.8,"status_chance":18,"shot_type":"Projectile","damage":{"Heat":30}}],
    "imageName":"angstrum.webp","tags":["Corpus","Incarnon"],
    "compTags":["PROJECTILE","AOE","SINGLESHOT"],
    "comb":[[0,1]]},"Alternox":{"noise":"Alarming","releaseDate":"2022-04-27","ammoCapacity":540,"productCategory":"LongGuns","equipTime":1.1,"zoomProps":[[]],"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":28,"reloadTime":1.8,"multishot":1,"attacks":[{"name":"Normal Attack","speed":4.33,"crit_chance":14,"crit_mult":2.2,"status_chance":30,"shot_type":"Projectile","shot_speed":60,"flight":60,"damage":{"Electricity":62}},{"name":"Alt-Fire Contact","speed":1.5,"crit_chance":2,"crit_mult":2,"status_chance":44,"shot_type":"Projectile","shot_speed":60,"flight":60,"damage":{"Impact":5,"Slash":7.5,"Puncture":37.5}},{"name":"Alt-Fire Damage over Time","speed":1,"crit_chance":2,"crit_mult":2,"status_chance":44,"damage":{"Electricity":50},"falloff":{"start":0,"end":6,"reduction":0.6}},{"name":"Alt-Fire Explosion","speed":1,"crit_chance":2,"crit_mult":2,"status_chance":44,"shot_type":"AoE","damage":{"Electricity":100},"falloff":{"start":0,"end":6,"reduction":0.6},"no_headshot_mult":true}],
    "imageName":"alternox.webp","tags":["Tenno"],
    "compTags":["PROJECTILE","ASSAULT_AMMO","AOE"],
    "comb":[[1,2,3]]},"Anku":{"blockingAngle":60,"comboDuration":5,"followThrough":0.6,"range":2.8,"windUp":1,"releaseDate":"2015-06-04","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":1.08,"crit_chance":20,"crit_mult":2,"status_chance":10,"damage":{"Impact":25.5,"Slash":8.5,"Puncture":136}},{"name":"Slam","speed":1,"crit_chance":20,"crit_mult":2,"status_chance":10,"unique":{"force_procs":["impact"]},"damage":{"Impact":340}},{"name":"Heavy Slam","speed":1,"crit_chance":20,"crit_mult":2,"status_chance":10,"damage":{"Blast":510}}],
    "imageName":"anku.webp","tags":["Tenno","Incarnon"],
    "compTags":["SCYTHES_STANCE"]},"Ankyros":{"blockingAngle":50,"comboDuration":5,"followThrough":0.9,"range":1.25,"windUp":0.6,"releaseDate":"2013-04-19","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":1.17,"crit_chance":20,"crit_mult":2,"status_chance":10,"damage":{"Impact":63,"Slash":13.5,"Puncture":13.5}},{"name":"Slam","speed":1,"crit_chance":20,"crit_mult":2,"status_chance":10,"unique":{"force_procs":["impact"]},"damage":{"Impact":180}},{"name":"Heavy Slam","speed":1,"crit_chance":20,"crit_mult":2,"status_chance":10,"damage":{"Impact":270}}],
    "imageName":"ankyros.webp","tags":["Tenno"],
    "compTags":["FIST_STANCE"]},"Arbucep (Atmo-mode)":{"releaseDate":"2025-10-15","ammoCapacity":540,"productCategory":"Archguns","zoomProps":[[]],"category":"Archgun","type":"Archgun","magazineSize":36,"reloadTime":2,"multishot":1,"attacks":[{"name":"1st Attack","speed":1.5,"crit_chance":10,"crit_mult":2.9,"status_chance":34.9,"shot_type":"Projectile","damage":{"Blast":32}},{"name":"1st Attack Radial Attack","speed":1.5,"crit_chance":10,"crit_mult":2.9,"status_chance":34.9,"shot_type":"AoE","damage":{"Blast":228},"no_headshot_mult":true},{"name":"2nd Attack","speed":1.5,"crit_chance":10,"crit_mult":2.9,"status_chance":34.9,"shot_type":"Projectile","damage":{"Corrosive":32}},{"name":"2nd Attack Radial Attack","speed":1.5,"crit_chance":10,"crit_mult":2.9,"status_chance":34.9,"shot_type":"AoE","damage":{"Corrosive":228},"no_headshot_mult":true},{"name":"3rd Attack","speed":1.5,"crit_chance":10,"crit_mult":2.9,"status_chance":34.9,"shot_type":"Projectile","damage":{"Gas":32}},{"name":"3rd Attack Radial Attack","speed":1.5,"crit_chance":10,"crit_mult":2.9,"status_chance":34.9,"shot_type":"AoE","damage":{"Gas":228},"no_headshot_mult":true},{"name":"4th Attack","speed":1.5,"crit_chance":10,"crit_mult":2.9,"status_chance":34.9,"shot_type":"Projectile","damage":{"Magnetic":32}},{"name":"4th Attack Radial Attack","speed":1.5,"crit_chance":10,"crit_mult":2.9,"status_chance":34.9,"shot_type":"AoE","damage":{"Magnetic":228},"no_headshot_mult":true},{"name":"5th Attack","speed":1.5,"crit_chance":10,"crit_mult":2.9,"status_chance":34.9,"shot_type":"Projectile","damage":{"Radiation":32}},{"name":"5th Attack Radial Attack","speed":1.5,"crit_chance":10,"crit_mult":2.9,"status_chance":34.9,"shot_type":"AoE","damage":{"Radiation":228},"no_headshot_mult":true},{"name":"6th Attack","speed":1.5,"crit_chance":10,"crit_mult":2.9,"status_chance":34.9,"shot_type":"Projectile","damage":{"Viral":32}},{"name":"6th Attack Radial Attack","speed":1.5,"crit_chance":10,"crit_mult":2.9,"status_chance":34.9,"shot_type":"AoE","damage":{"Viral":228},"no_headshot_mult":true}],
    "imageName":"Arbucep.webp","tags":[],
    "compTags":[],
    "comb":[[0,1,2,3,4,5,6,7,8,9,10,11]]},"Arca Scisco":{"noise":"Alarming","releaseDate":"2017-09-09","ammoCapacity":288,"productCategory":"Pistols","zoomProps":[[], []],"category":"Secondary","trigger":"Semi","type":"Pistol","magazineSize":36,"reloadTime":2.2,"multishot":1,"attacks":[{"name":"Normal Attack","speed":4.667,"crit_chance":18,"crit_mult":1.6,"status_chance":26,"shot_type":"Hit-Scan","damage":{"Slash":24,"Puncture":36}}],
    "imageName":"arca-scisco.webp","tags":["Corpus"],
    "compTags":[]},"Arbucep (Arch-mode)":{"releaseDate":"2025-10-15","ammoCapacity":0,"productCategory":"Archguns","zoomProps":[[]],"category":"Archgun","type":"Archgun","magazineSize":36,"reloadTime":1.8,"multishot":1,"attacks":[{"name":"1st Attack","speed":1.5,"crit_chance":10,"crit_mult":2.9,"status_chance":34.9,"shot_type":"Projectile","damage":{"Blast":16}},{"name":"1st Attack Radial Attack","speed":1.5,"crit_chance":10,"crit_mult":2.9,"status_chance":34.9,"shot_type":"AoE","damage":{"Blast":114},"no_headshot_mult":true},{"name":"2nd Attack","speed":1.5,"crit_chance":10,"crit_mult":2.9,"status_chance":34.9,"shot_type":"Projectile","damage":{"Corrosive":16}},{"name":"2nd Attack Radial Attack","speed":1.5,"crit_chance":10,"crit_mult":2.9,"status_chance":34.9,"shot_type":"AoE","damage":{"Corrosive":114},"no_headshot_mult":true},{"name":"3rd Attack","speed":1.5,"crit_chance":10,"crit_mult":2.9,"status_chance":34.9,"shot_type":"Projectile","damage":{"Gas":16}},{"name":"3rd Attack Radial Attack","speed":1.5,"crit_chance":10,"crit_mult":2.9,"status_chance":34.9,"shot_type":"AoE","damage":{"Gas":114},"no_headshot_mult":true},{"name":"4th Attack","speed":1.5,"crit_chance":10,"crit_mult":2.9,"status_chance":34.9,"shot_type":"Projectile","damage":{"Magnetic":16}},{"name":"4th Attack Radial Attack","speed":1.5,"crit_chance":10,"crit_mult":2.9,"status_chance":34.9,"shot_type":"AoE","damage":{"Magnetic":114},"no_headshot_mult":true},{"name":"5th Attack","speed":1.5,"crit_chance":10,"crit_mult":2.9,"status_chance":34.9,"shot_type":"Projectile","damage":{"Radiation":16}},{"name":"5th Attack Radial Attack","speed":1.5,"crit_chance":10,"crit_mult":2.9,"status_chance":34.9,"shot_type":"AoE","damage":{"Radiation":114},"no_headshot_mult":true},{"name":"6th Attack","speed":1.5,"crit_chance":10,"crit_mult":2.9,"status_chance":34.9,"shot_type":"Projectile","damage":{"Viral":16}},{"name":"6th Attack Radial Attack","speed":1.5,"crit_chance":10,"crit_mult":2.9,"status_chance":34.9,"shot_type":"AoE","damage":{"Viral":114},"no_headshot_mult":true}],
    "imageName":"Arbucep.webp","tags":[],
    "compTags":["BATTERY"],
    "comb":[[0,1,2,3,4,5,6,7,8,9,10,11]]},"Ankyros Prime":{"blockingAngle":50,"comboDuration":5,"followThrough":0.9,"range":1.25,"windUp":0.6,"releaseDate":"2014-03-06","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":1.25,"crit_chance":28,"crit_mult":2.4,"status_chance":16,"damage":{"Impact":89.6,"Slash":19.2,"Puncture":19.2}},{"name":"Slam","speed":1,"crit_chance":28,"crit_mult":2.4,"status_chance":16,"unique":{"force_procs":["impact"]},"damage":{"Impact":256}},{"name":"Heavy Slam","speed":1,"crit_chance":28,"crit_mult":2.4,"status_chance":16,"damage":{"Impact":384}}],
    "imageName":"ankyros-prime.webp","tags":["Prime","Vaulted"],
    "compTags":["FIST_STANCE"]},"Arca Titron":{"blockingAngle":50,"comboDuration":5,"followThrough":0.4,"range":2.6,"windUp":1.2,"releaseDate":"2017-09-09","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":0.733,"crit_chance":24,"crit_mult":2,"status_chance":38,"damage":{"Impact":234,"Slash":126}},{"name":"Slam","speed":1,"crit_chance":24,"crit_mult":2,"status_chance":38,"unique":{"force_procs":["electricity","impact"]},"damage":{"Electricity":720}},{"name":"Heavy Slam","speed":1,"crit_chance":24,"crit_mult":2,"status_chance":38,"unique":{"force_procs":["electricity"]},"damage":{"Electricity":1080}}],
    "imageName":"arca-titron.webp","tags":["Corpus"],
    "compTags":["HAMMERS_STANCE"]},"Artemis Bow (Ivara)":{"noise":"Silent","releaseDate":"2018-06-15","ammoCapacity":262,"productCategory":"LongGuns","category":"Primary","trigger":"Charge","type":"Exalted Weapon","magazineSize":1,"reloadTime":0.9,"multishot":7,"attacks":[{"name":"Base Uncharged Shot","speed":1,"crit_chance":25,"crit_mult":2,"status_chance":20,"shot_type":"Projectile","shot_speed":100,"damage":{"Impact":33.6,"Slash":192,"Puncture":14.4}},{"name":"Base Charged Shot","speed":1,"crit_chance":25,"crit_mult":2,"status_chance":20,"shot_type":"Projectile","shot_speed":100,"damage":{"Impact":33.6,"Slash":192,"Puncture":14.4}},{"name":"Concentrated Arrow Uncharged Shot","speed":1,"crit_chance":25,"crit_mult":2,"status_chance":20,"shot_type":"Projectile","shot_speed":150,"unique":{"force_procs":["impact"],
    "crit_chance_weakp":0.5},"damage":{"Impact":33.6,"Slash":192,"Puncture":14.4}},{"name":"Concentrated Arrow Uncharged Headshot Explosion","speed":1,"crit_chance":25,"crit_mult":2,"status_chance":20,"shot_type":"AoE","unique":{"force_procs":["impact"]},"damage":{"Blast":500},"no_headshot_mult":true},{"name":"Concentrated Arrow Charged Shot","speed":1,"crit_chance":50,"crit_mult":2,"status_chance":20,"shot_type":"Projectile","shot_speed":150,"unique":{"force_procs":["impact"],
    "crit_chance_weakp":0.5},"damage":{"Impact":33.6,"Slash":192,"Puncture":14.4}},{"name":"Concentrated Arrow Charged Headshot Explosion","speed":1,"crit_chance":50,"crit_mult":2,"status_chance":20,"shot_type":"AoE","unique":{"force_procs":["impact"]},"damage":{"Blast":500},"no_headshot_mult":true}],
    "imageName":"ArtemisBow.webp","tags":[""],
    "compTags":["POWER_WEAPON","PROJECTILE"],
    "comb":[[2,3]]},"Argo & Vel":{"blockingAngle":70,"comboDuration":5,"followThrough":0.6,"range":2.5,"windUp":1,"releaseDate":"2023-07-27","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":0.8,"crit_chance":32,"crit_mult":2.4,"status_chance":24,"damage":{"Impact":60,"Slash":240}},{"name":"Heavy Attack Glaive","speed":0.8,"crit_chance":32,"crit_mult":2.4,"status_chance":24,"damage":{"Impact":40,"Slash":160}},{"name":"Heavy Attack Glaive AoE","speed":0.8,"crit_chance":32,"crit_mult":2.4,"status_chance":24,"shot_type":"AoE","damage":{"Impact":20,"Slash":80},"no_headshot_mult":true},{"name":"Slam","speed":1,"crit_chance":32,"crit_mult":2.4,"status_chance":24,"unique":{"force_procs":["impact"]},"damage":{"Slash":600}},{"name":"Heavy Slam","speed":1,"crit_chance":32,"crit_mult":2.4,"status_chance":24,"damage":{"Slash":900}}],
    "imageName":"ArgoAndVel.webp","tags":["Tenno"],
    "compTags":["SWORDS_AND_SHIELD_STANCE"]},"Arca Plasmor":{"noise":"Alarming","releaseDate":"2017-09-09","ammoCapacity":50,"productCategory":"LongGuns","zoomProps":[[]],"category":"Primary","trigger":"Semi","type":"Shotgun","magazineSize":10,"reloadTime":2.8,"multishot":1,"attacks":[{"name":"Normal Attack","speed":1.1,"crit_chance":22,"crit_mult":1.6,"status_chance":28,"shot_type":"Projectile","shot_speed":60,"flight":60,"unique":{"force_procs":["impact"]},"damage":{"Radiation":600},"falloff":{"start":10,"end":20,"reduction":0.6667},"no_headshot_mult":true}],
    "imageName":"arca-plasmor.webp","tags":["Corpus"],
    "compTags":[]},"Argonak":{"noise":"Alarming","releaseDate":"2017-10-12","ammoCapacity":473,"productCategory":"LongGuns","equipTime":1.1,"zoomProps":[[]],"category":"Primary","trigger":"Semi","type":"Rifle","magazineSize":43,"reloadTime":2.4000001,"multishot":1,"attacks":[{"name":"Full Auto Mode","speed":6,"crit_chance":9,"crit_mult":1.5,"status_chance":27,"shot_type":"Hit-Scan","damage":{"Impact":24.51,"Slash":26.22,"Puncture":6.27}},{"name":"Semi-Auto Mode","speed":4.33,"crit_chance":27,"crit_mult":2.3,"status_chance":19,"shot_type":"Hit-Scan","damage":{"Impact":24.51,"Slash":26.22,"Puncture":6.27}}],
    "imageName":"argonak.webp","tags":[],
    "compTags":["ASSAULT_AMMO"]},"Arquebex":{"releaseDate":"2020-08-25","ammoCapacity":0,"productCategory":"Archguns","zoomProps":[[]],"category":"Exalted Weapon","type":"Archgun","magazineSize":10,"reloadTime":3,"multishot":1,"attacks":[{"name":"Normal Attack","speed":3.33,"crit_chance":50,"crit_mult":3,"status_chance":50,"shot_type":"Projectile","damage":{"Impact":10}},{"name":"Radial Attack","speed":3.33,"crit_chance":50,"crit_mult":3,"status_chance":50,"shot_type":"AoE","damage":{"Blast":9000,"Heat":3000},"no_headshot_mult":true}],
    "imageName":"Arquebex.webp","tags":[""],
    "compTags":[""],
    "comb":[[0,1]]},"Arum Spinosa":{"blockingAngle":55,"comboDuration":5,"followThrough":0.7,"range":1.7,"windUp":0.5,"releaseDate":"2020-11-19","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":1.08,"crit_chance":9,"crit_mult":1.9,"status_chance":37,"damage":{"Impact":35.64,"Slash":201.96,"Puncture":59.4}},{"name":"First Heavy Attack - Toxic Spines","speed":2,"crit_chance":9,"crit_mult":1.7,"status_chance":6.16,"shot_type":"Projectile","shot_speed":49,"flight":49,"damage":{"Impact":17.5,"Slash":57.5,"Puncture":27.5,"Toxin":72.5}},{"name":"Second Heavy Attack - Toxic Spines","speed":2,"crit_chance":9,"crit_mult":1.7,"status_chance":12.3,"shot_type":"Projectile","shot_speed":49,"flight":49,"damage":{"Impact":35,"Slash":115,"Puncture":55,"Toxin":145}},{"name":"Slam","speed":1,"crit_chance":9,"crit_mult":1.9,"status_chance":37,"unique":{"force_procs":["impact"]},"damage":{"Impact":594}},{"name":"Heavy Slam","speed":1,"crit_chance":9,"crit_mult":1.9,"status_chance":37,"damage":{"Blast":891}}],
    "imageName":"arum-spinosa.webp","tags":["Infested"],
    "compTags":["WARFAN_STANCE"]},"Athodai":{"noise":"Alarming","releaseDate":"2020-08-01","ammoCapacity":48,"productCategory":"Pistols","zoomProps":[[]],"category":"Secondary","trigger":"Auto","type":"Pistol","magazineSize":24,"reloadTime":2,"multishot":1,"attacks":[{"name":"Normal Attack","speed":5,"crit_chance":32,"crit_mult":2,"status_chance":8,"shot_type":"Hit-Scan","unique":{"WITH_COND":{"speed":1,"ammoEff":1}},"damage":{"Puncture":22,"Heat":48}},{"name":"Alt-Fire","speed":12,"crit_chance":18,"crit_mult":2,"status_chance":24,"shot_type":"Discharge","damage":{"Heat":88}}],
    "imageName":"athodai.webp","tags":["Tenno"],
    "compTags":["TNJETTURBINEPISTOL"]},"Astilla":{"noise":"Alarming","releaseDate":"2017-10-12","ammoCapacity":112,"productCategory":"LongGuns","equipTime":1.1,"category":"Primary","trigger":"Auto","type":"Shotgun","magazineSize":16,"reloadTime":2,"multishot":1,"attacks":[{"name":"Slug Impact","speed":4.33,"crit_chance":17,"crit_mult":1.9,"status_chance":33,"shot_type":"Projectile","shot_speed":120,"flight":120,"unique":{"force_procs":["impact"]},"damage":{"Impact":70},"falloff":{"start":30,"end":60,"reduction":0.5}},{"name":"Glass Explosion","speed":4.33,"crit_chance":17,"crit_mult":1.9,"status_chance":33,"shot_type":"AoE","damage":{"Slash":78,"Puncture":42},"falloff":{"start":0,"end":2.4,"reduction":0.3},"no_headshot_mult":true}],
    "imageName":"astilla.webp","tags":["Tenno"],
    "compTags":["PROJECTILE"],
    "comb":[[0,1]]},"Astilla Prime":{"noise":"Alarming","releaseDate":"2021-05-26","ammoCapacity":120,"productCategory":"LongGuns","equipTime":1.1,"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":24,"reloadTime":2,"multishot":1,"attacks":[{"name":"Slug Impact","speed":4.33,"crit_chance":21,"crit_mult":1.9,"status_chance":37,"shot_type":"Projectile","shot_speed":120,"flight":120,"unique":{"force_procs":["impact"]},"damage":{"Impact":100},"falloff":{"start":30,"end":60,"reduction":0.5}},{"name":"Glass Explosion","speed":4.33,"crit_chance":21,"crit_mult":1.9,"status_chance":37,"shot_type":"AoE","damage":{"Slash":91,"Puncture":49},"falloff":{"start":0,"end":2.4,"reduction":0.3},"no_headshot_mult":true}],
    "imageName":"astilla-prime.webp","tags":["Prime"],
    "compTags":["PROJECTILE"],
    "comb":[[0,1]]},"Athodai Prime":{"noise":"Alarming","releaseDate":"2026-06-17","ammoCapacity":48,"productCategory":"Pistols","zoomProps":[[]],"category":"Secondary","trigger":"Auto","type":"Pistol","magazineSize":24,"reloadTime":2,"multishot":1,"attacks":[{"name":"Normal Attack","speed":5,"crit_chance":40,"crit_mult":2,"status_chance":10,"shot_type":"Hit-Scan","unique":{"WITH_COND":{"speed":1,"ammoEff":1}},"damage":{"Puncture":24,"Heat":56}},{"name":"Alt-Fire","speed":12,"crit_chance":20,"crit_mult":2.5,"status_chance":24,"shot_type":"Discharge","damage":{"Heat":88}}],
    "imageName":"AthodaiPrime.webp","tags":[],
    "compTags":["TNJETTURBINEPISTOL"]},"Azima":{"noise":"Alarming","releaseDate":"2016-03-04","ammoCapacity":525,"productCategory":"Pistols","category":"Secondary","trigger":"Auto","type":"Pistol","magazineSize":75,"reloadTime":1.4,"multishot":1,"attacks":[{"name":"Normal Attack","speed":10,"crit_chance":16,"crit_mult":2,"status_chance":16,"shot_type":"Hit-Scan","damage":{"Impact":2,"Slash":13,"Puncture":5}},{"name":"Turret Expiry","speed":10,"crit_chance":16,"crit_mult":2,"status_chance":16,"damage":{"Blast":75}}],
    "imageName":"azima.webp","tags":["Tenno"],
    "compTags":[]},"Attica":{"noise":"Silent","releaseDate":"2014-04-09","ammoCapacity":540,"productCategory":"LongGuns","equipTime":1.1,"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":20,"reloadTime":2.8299999,"multishot":1,"attacks":[{"name":"Normal Attack","speed":3.67,"crit_chance":25,"crit_mult":3,"status_chance":10,"shot_type":"Projectile","shot_speed":90,"flight":90,"damage":{"Impact":4,"Slash":16,"Puncture":60}}],
    "imageName":"attica.webp","tags":["Tenno"],
    "compTags":["PROJECTILE","ATTICA","CROSSBOW"]},"Atomos":{"noise":"Alarming","releaseDate":"2015-05-12","ammoCapacity":350,"productCategory":"Pistols","zoomProps":[[]],"category":"Secondary","trigger":"Held","type":"Pistol","magazineSize":70,"reloadTime":2,"multishot":1,"attacks":[{"name":"Normal Attack","speed":8,"crit_chance":15,"crit_mult":1.7,"status_chance":21,"shot_type":"Discharge","damage":{"Heat":29}},{"name":"Incarnon Form","speed":1.5,"crit_chance":18,"crit_mult":3,"status_chance":41,"shot_type":"Projectile","damage":{"Impact":100}},{"name":"Incarnon Form Radial Attack","speed":1.5,"crit_chance":18,"crit_mult":3,"status_chance":41,"shot_type":"AoE","damage":{"Blast":450},"no_headshot_mult":true}],
    "imageName":"atomos.webp","tags":["Grineer","Incarnon"],
    "compTags":["BEAM"],
    "comb":[[1,2]]},"Azothane":{"blockingAngle":55,"comboDuration":5,"followThrough":0.7,"range":3.2,"windUp":0.7,"productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":1.17,"crit_chance":34,"crit_mult":3,"status_chance":22,"damage":{"Impact":51.000004,"Puncture":34,"Slash":85}},{"name":"Slam","speed":1,"crit_chance":34,"crit_mult":3,"status_chance":22,"unique":{"force_procs":["impact"]},"damage":{"Impact":340}},{"name":"Heavy Slam","speed":1,"crit_chance":34,"crit_mult":3,"status_chance":22,"damage":{"Blast":510}}],
    "imageName":"azothane.webp","tags":[""],
    "compTags":["LONG_KATANA_STANCE"]},"Atterax":{"blockingAngle":45,"comboDuration":5,"followThrough":0.5,"range":2.4963856,"windUp":0.4,"releaseDate":"2014-09-17","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":0.917,"crit_chance":25,"crit_mult":3,"status_chance":20,"damage":{"Impact":6.45,"Slash":116.1,"Puncture":6.45}},{"name":"Slam","speed":1,"crit_chance":25,"crit_mult":3,"status_chance":20,"unique":{"force_procs":["impact"]},"damage":{"Slash":258}},{"name":"Heavy Slam","speed":1,"crit_chance":25,"crit_mult":3,"status_chance":20,"damage":{"Blast":387}}],
    "imageName":"atterax.webp","tags":["Grineer"],
    "compTags":["WHIPS_STANCE"]},"Balla (Dagger)":{"comboDuration":5,"range":1,"windUp":1,"releaseDate":"2017-10-12","productCategory":"Melee","category":"Melee","type":"Zaw Component","multishot":1,"attacks":[{"name":"Balla Strike","speed":1,"crit_chance":18,"crit_mult":2,"status_chance":18,"damage":{"Impact":11.2,"Slash":78.4,"Puncture":134.4}}],
    "imageName":"balla.webp","tags":[],
    "compTags":["DAGGERS_STANCE"]},"Balla (Staff)":{"comboDuration":5,"range":1,"windUp":1,"releaseDate":"2017-10-12","productCategory":"Melee","category":"Melee","type":"Zaw Component","multishot":1,"attacks":[{"name":"Balla Strike","speed":1,"crit_chance":18,"crit_mult":2,"status_chance":18,"damage":{"Impact":11.2,"Slash":78.4,"Puncture":134.4}}],
    "imageName":"balla.webp","tags":[],
    "compTags":["STAVES_STANCE"]},"Ballistica Prime":{"noise":"Silent","releaseDate":"2017-08-29","ammoCapacity":320,"productCategory":"Pistols","category":"Secondary","trigger":"Charge","type":"Pistol","magazineSize":8,"reloadTime":1.2,"multishot":4,"attacks":[{"name":"Normal Shot","speed":3.33,"crit_chance":20,"crit_mult":2,"status_chance":15,"shot_type":"Projectile","shot_speed":70,"flight":70,"damage":{"Impact":2,"Slash":16,"Puncture":22}},{"name":"Charged Shot","speed":3.33,"crit_chance":20,"crit_mult":2,"status_chance":15,"shot_type":"Projectile","shot_speed":140,"flight":140,"damage":{"Impact":3.8,"Slash":30.4,"Puncture":41.8}},{"name":"Incarnon Form","speed":3.33,"crit_chance":30,"crit_mult":2.5,"status_chance":30,"shot_type":"Projectile","shot_speed":80,"damage":{"Slash":830}}],
    "imageName":"ballistica-prime.webp","tags":["Prime","Incarnon"],
    "compTags":["PROJECTILE","CROSSBOW"]},"Ballistica":{"noise":"Silent","releaseDate":"2013-10-16","productCategory":"Pistols","category":"Secondary","trigger":"Charge","type":"Pistol","magazineSize":16,"reloadTime":2,"multishot":1,"attacks":[{"name":"Charged Shot","speed":3.33,"crit_chance":15,"crit_mult":1.5,"status_chance":10,"shot_type":"Projectile","shot_speed":100,"flight":100,"damage":{"Impact":10,"Slash":10,"Puncture":80}},{"name":"Burst Shot","speed":6.67,"crit_chance":3.75,"crit_mult":1.5,"status_chance":7.5,"shot_type":"Projectile","shot_speed":100,"flight":100,"damage":{"Impact":2.5,"Slash":2.5,"Puncture":20}},{"name":"Incarnon Form","speed":3.33,"crit_chance":20,"crit_mult":2,"status_chance":20,"shot_type":"Projectile","shot_speed":80,"damage":{"Slash":640}}],
    "imageName":"ballistica.webp","tags":["Tenno","Incarnon"],
    "compTags":["PROJECTILE","CROSSBOW"]},"Baza":{"noise":"Silent","releaseDate":"2017-11-23","ammoCapacity":800,"productCategory":"LongGuns","zoomProps":[[]],"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":40,"reloadTime":1.4,"multishot":1,"attacks":[{"name":"Normal Attack","speed":16.67,"crit_chance":26,"crit_mult":3,"status_chance":10,"shot_type":"Hit-Scan","damage":{"Impact":5.76,"Slash":3.52,"Puncture":6.72},"falloff":{"start":22,"end":34,"reduction":0.5}}],
    "imageName":"baza.webp","tags":["Tenno"],
    "compTags":["ASSAULT_AMMO"]},"Battacor":{"noise":"Alarming","releaseDate":"2018-11-08","ammoCapacity":720,"productCategory":"LongGuns","equipTime":1.1,"zoomProps":[[]],"category":"Primary","trigger":"Auto Burst","type":"Rifle","magazineSize":60,"reloadTime":2,"multishot":1,"attacks":[{"name":"Normal Attack","speed":2.5,"crit_chance":32,"crit_mult":2.4,"status_chance":18,"shot_type":"Projectile","shot_speed":120,"flight":120,"damage":{"Puncture":24,"Magnetic":42}},{"name":"Secondary Fire","speed":5,"crit_chance":34,"crit_mult":3,"status_chance":8,"shot_type":"Hit-Scan","damage":{"Radiation":208}},{"name":"Beam AoE","speed":5,"crit_chance":20,"crit_mult":2,"status_chance":50,"shot_type":"AoE","damage":{"Radiation":208},"falloff":{"start":0,"end":3.4,"reduction":0.4},"no_headshot_mult":true}],
    "imageName":"battacor.webp","tags":["Corpus"],
    "compTags":["PROJECTILE","ASSAULT_AMMO"],
    "comb":[[1,2]]},"Basmu":{"noise":"Alarming","releaseDate":"2020-03-24","ammoCapacity":"Infinity","productCategory":"LongGuns","equipTime":1.1,"zoomProps":[[]],"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":21,"reloadTime":0.7,"multishot":1,"attacks":[{"name":"Auto","speed":12,"crit_chance":15,"crit_mult":2,"status_chance":29,"shot_type":"Projectile","shot_speed":120,"flight":120,"damage":{"Electricity":39}},{"name":"Radial Attack","speed":12,"crit_chance":15,"crit_mult":2,"status_chance":29,"shot_type":"AoE","damage":{"Heat":19},"falloff":{"start":0,"end":1.7,"reduction":0.2},"no_headshot_mult":true},{"name":"Held","speed":12,"crit_chance":2,"crit_mult":4.8,"status_chance":30,"shot_type":"Discharge","damage":{"Electricity":12}}],
    "imageName":"basmu.webp","tags":["Sentient"],
    "compTags":["ASSAULT_AMMO","PROJECTILE","AOE","BASMU"],
    "comb":[[0,1]]},"Balefire Charger (Hildryn)":{"noise":"Alarming","releaseDate":"2019-03-08","ammoCapacity":"Infinity","productCategory":"LongGuns","category":"Secondary","trigger":"Charge","type":"Exalted Weapon","magazineSize":999999,"reloadTime":0,"multishot":1,"attacks":[{"name":"Uncharged Shot","speed":0.83,"crit_chance":5,"crit_mult":1.5,"status_chance":10,"shot_type":"AoE","shot_speed":80,"damage":{"Electricity":500},"no_headshot_mult":true},{"name":"Charged Shot","speed":0.83,"crit_chance":5,"crit_mult":1.5,"status_chance":10,"shot_type":"AoE","shot_speed":80,"damage":{"Electricity":1500},"no_headshot_mult":true},{"name":"Alt-Fire Shot (note: need use +base dmg to emulate shield)","speed":0.75,"crit_chance":5,"crit_mult":1.5,"status_chance":10,"shot_type":"AoE","damage":{"Electricity":1500},"no_headshot_mult":true}],
    "imageName":"BalefireCharger.webp","tags":[""],
    "compTags":["POWER_WEAPON"]},"Baza Prime":{"noise":"Silent","releaseDate":"2019-12-17","ammoCapacity":840,"productCategory":"LongGuns","equipTime":1.1,"zoomProps":[[]],"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":60,"reloadTime":1.1,"multishot":1,"attacks":[{"name":"Normal Attack","speed":16.67,"crit_chance":28,"crit_mult":3,"status_chance":14,"shot_type":"Hit-Scan","damage":{"Impact":5.76,"Slash":3.52,"Puncture":6.72},"falloff":{"start":30,"end":60,"reduction":0.5}}],
    "imageName":"baza-prime.webp","tags":["Prime"],
    "compTags":["ASSAULT_AMMO"]},"Bo":{"blockingAngle":60,"comboDuration":5,"followThrough":0.5,"range":3,"windUp":0.5,"releaseDate":"2012-10-25","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":1,"crit_chance":12.5,"crit_mult":2,"status_chance":20,"damage":{"Impact":126,"Puncture":14}},{"name":"Slam","speed":1,"crit_chance":12.5,"crit_mult":2,"status_chance":20,"unique":{"force_procs":["impact"]},"damage":{"Impact":280}},{"name":"Heavy Slam","speed":1,"crit_chance":12.5,"crit_mult":2,"status_chance":20,"damage":{"Blast":420}}],
    "imageName":"bo.webp","tags":["Tenno","Incarnon"],
    "compTags":["STAVES_STANCE"]},"Bo Prime":{"blockingAngle":60,"comboDuration":5,"followThrough":0.5,"range":3,"windUp":0.5,"releaseDate":"2014-06-11","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":1.08,"crit_chance":24,"crit_mult":2.6,"status_chance":32,"damage":{"Impact":158.4,"Puncture":17.6}},{"name":"Slam","speed":1,"crit_chance":24,"crit_mult":2.6,"status_chance":32,"unique":{"force_procs":["impact"]},"damage":{"Impact":352}},{"name":"Heavy Slam","speed":1,"crit_chance":24,"crit_mult":2.6,"status_chance":32,"damage":{"Blast":528}}],
    "imageName":"bo-prime.webp","tags":["Prime","Vaulted","Incarnon"],
    "compTags":["STAVES_STANCE"]},"Boar":{"noise":"Alarming","releaseDate":"2012-10-25","ammoCapacity":120,"productCategory":"LongGuns","zoomProps":[[]],"category":"Primary","trigger":"Auto","type":"Shotgun","magazineSize":20,"reloadTime":2.7,"multishot":8,"attacks":[{"name":"Normal Attack","speed":4.17,"crit_chance":10,"crit_mult":1.5,"status_chance":7.5,"shot_type":"Hit-Scan","damage":{"Impact":12.1,"Slash":6.6,"Puncture":3.3},"falloff":{"start":15,"end":25,"reduction":0.5}},{"name":"Incarnon Form","speed":7.5,"crit_chance":18,"crit_mult":1.8,"status_chance":20,"damage":{"Heat":20}}],
    "imageName":"boar.webp","tags":["Tenno","Incarnon"],
    "compTags":[]},"Boltor Prime":{"noise":"Alarming","releaseDate":"2014-03-06","ammoCapacity":540,"productCategory":"LongGuns","equipTime":1.1,"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":60,"reloadTime":2.4000001,"multishot":1,"attacks":[{"name":"Normal Attack","speed":10,"crit_chance":12,"crit_mult":2,"status_chance":34,"shot_type":"Projectile","shot_speed":120,"flight":120,"damage":{"Impact":4.6,"Puncture":41.4}},{"name":"Incarnon Form","speed":11.33,"crit_chance":24,"crit_mult":3,"status_chance":20,"shot_type":"Projectile","damage":{"Impact":2.4,"Slash":14.4,"Puncture":7.2}}],
    "imageName":"boltor-prime.webp","tags":["Prime","Vaulted","Incarnon"],
    "compTags":["PROJECTILE","ASSAULT_AMMO"]},"Brakk":{"noise":"Alarming","releaseDate":"2013-10-30","productCategory":"Pistols","category":"Secondary","trigger":"Semi","type":"Pistol","magazineSize":5,"reloadTime":1.05,"multishot":10,"attacks":[{"name":"Normal Attack","speed":5,"crit_chance":17,"crit_mult":2,"status_chance":5.1,"shot_type":"Hit-Scan","damage":{"Impact":9,"Slash":6,"Puncture":5},"falloff":{"start":11,"end":22,"reduction":0.6}}],
    "imageName":"brakk.webp","tags":["Grineer"],
    "compTags":["SECONDARYSHOTGUN","SINGLESHOT"]},"Boltor":{"noise":"Alarming","releaseDate":"2013-01-29","ammoCapacity":540,"productCategory":"LongGuns","equipTime":1.1,"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":60,"reloadTime":2.6,"multishot":1,"attacks":[{"name":"Normal Attack","speed":8.75,"crit_chance":10,"crit_mult":1.8,"status_chance":14,"shot_type":"Projectile","shot_speed":85,"flight":85,"damage":{"Impact":2.5,"Slash":2.5,"Puncture":20}},{"name":"Incarnon Form","speed":10,"crit_chance":22,"crit_mult":2.8,"status_chance":9.3,"damage":{"Impact":1.6,"Slash":2.4,"Puncture":1.2}}],
    "imageName":"boltor.webp","tags":["Tenno","Incarnon"],
    "compTags":["PROJECTILE","ASSAULT_AMMO"]},"Boar Prime":{"noise":"Alarming","releaseDate":"2013-09-13","ammoCapacity":120,"productCategory":"LongGuns","zoomProps":[[]],"category":"Primary","trigger":"Auto","type":"Shotgun","magazineSize":20,"reloadTime":2.75,"multishot":8,"attacks":[{"name":"Normal Attack","speed":4.67,"crit_chance":15,"crit_mult":2,"status_chance":11.25,"shot_type":"Hit-Scan","damage":{"Impact":26,"Slash":8,"Puncture":6},"falloff":{"start":18,"end":25,"reduction":0.7}},{"name":"Incarnon Form","speed":8,"crit_chance":20,"crit_mult":2.2,"status_chance":24,"damage":{"Heat":30}}],
    "imageName":"boar-prime.webp","tags":["Prime","Vaulted","Incarnon"],
    "compTags":[]},"Boltace":{"blockingAngle":60,"comboDuration":5,"followThrough":0.6,"range":2.5,"windUp":0.7,"releaseDate":"2015-05-12","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":0.917,"crit_chance":6,"crit_mult":1.5,"status_chance":28,"damage":{"Impact":17.6,"Slash":17.6,"Puncture":140.8}},{"name":"Slam","speed":1,"crit_chance":6,"crit_mult":1.5,"status_chance":28,"unique":{"force_procs":["impact"]},"damage":{"Impact":352}},{"name":"Heavy Slam","speed":1,"crit_chance":6,"crit_mult":1.5,"status_chance":28,"damage":{"Blast":528}}],
    "imageName":"boltace.webp","tags":["Tenno"],
    "compTags":["TONFA_STANCE"]},"Bolto":{"noise":"Alarming","releaseDate":"2012-10-25","productCategory":"Pistols","category":"Secondary","trigger":"Semi","type":"Pistol","magazineSize":15,"reloadTime":1.3,"multishot":1,"attacks":[{"name":"Normal Attack","speed":3.33,"crit_chance":16,"crit_mult":2.4,"status_chance":2.2,"shot_type":"Projectile","shot_speed":75,"flight":75,"damage":{"Impact":6.4,"Puncture":57.6}}],
    "imageName":"bolto.webp","tags":["Tenno"],
    "compTags":["PROJECTILE"]},"Braton Prime":{"noise":"Alarming","releaseDate":"2013-07-13","ammoCapacity":600,"productCategory":"LongGuns","equipTime":1.1,"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":75,"reloadTime":2.1500001,"multishot":1,"attacks":[{"name":"Normal Attack","speed":9.58,"crit_chance":12,"crit_mult":2,"status_chance":26,"shot_type":"Hit-Scan","damage":{"Impact":1.75,"Slash":21,"Puncture":12.25}},{"name":"Incarnon Form","speed":5.67,"crit_chance":30,"crit_mult":3,"status_chance":30,"damage":{"Impact":28,"Slash":39.2,"Puncture":2.8}},{"name":"Incarnon Form AoE","speed":5.67,"crit_chance":30,"crit_mult":3,"status_chance":30,"shot_type":"AoE","damage":{"Heat":70},"no_headshot_mult":true}],
    "imageName":"braton-prime.webp","tags":["Prime","Never Vaulted","Incarnon"],
    "compTags":["ASSAULT_AMMO"],
    "comb":[[1,2]]},"Braton":{"noise":"Alarming","releaseDate":"2012-10-25","ammoCapacity":540,"productCategory":"LongGuns","equipTime":1.1,"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":45,"reloadTime":2,"multishot":1,"attacks":[{"name":"Normal Attack","speed":8.75,"crit_chance":12,"crit_mult":1.6,"status_chance":6,"shot_type":"Hit-Scan","damage":{"Impact":7.92,"Slash":8.16,"Puncture":7.92}},{"name":"Incarnon Form","speed":5,"crit_chance":30,"crit_mult":3,"status_chance":12,"damage":{"Impact":20,"Slash":28,"Puncture":2}},{"name":"Incarnon Form Radial Attack","speed":5,"crit_chance":30,"crit_mult":3,"status_chance":12,"shot_type":"AoE","damage":{"Heat":50},"no_headshot_mult":true}],
    "imageName":"braton.webp","tags":["Tenno","Incarnon"],
    "compTags":["ASSAULT_AMMO"],
    "comb":[[1,2]]},"Broken War":{"blockingAngle":55,"comboDuration":5,"followThrough":0.6,"range":2.5,"windUp":0.6,"releaseDate":"2015-12-03","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":1,"crit_chance":35,"crit_mult":2.2,"status_chance":20,"damage":{"Impact":18.7,"Slash":149.6,"Puncture":18.7}},{"name":"Slam","speed":1,"crit_chance":35,"crit_mult":2.2,"status_chance":20,"unique":{"force_procs":["impact"]},"damage":{"Impact":374}},{"name":"Heavy Slam","speed":1,"crit_chance":35,"crit_mult":2.2,"status_chance":20,"damage":{"Blast":561}}],
    "imageName":"broken-war.webp","tags":["Sentient"],
    "compTags":["SWORDS_STANCE"]},"Bronco":{"noise":"Alarming","releaseDate":"2012-10-25","productCategory":"Pistols","category":"Secondary","trigger":"Semi","type":"Pistol","magazineSize":2,"reloadTime":1.05,"multishot":7,"attacks":[{"name":"Normal Attack","speed":5,"crit_chance":6,"crit_mult":2,"status_chance":9.43,"shot_type":"Hit-Scan","damage":{"Impact":32,"Slash":4,"Puncture":4},"falloff":{"start":7,"end":14,"reduction":0.75}},{"name":"Incarnon Form","speed":2.5,"crit_chance":20,"crit_mult":3,"status_chance":18.9,"damage":{"Impact":13.2,"Slash":6.6,"Puncture":2.2}}],
    "imageName":"bronco.webp","tags":["Tenno","Incarnon"],
    "compTags":["SINGLESHOT","SECONDARYSHOTGUN","BRONCO"]},"Cadus":{"blockingAngle":60,"comboDuration":5,"followThrough":0.5,"range":2.8,"windUp":0.5,"releaseDate":"2021-07-06","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":1,"crit_chance":15,"crit_mult":2,"status_chance":25,"damage":{"Impact":70,"Electricity":60}},{"name":"Slam","speed":1,"crit_chance":15,"crit_mult":2,"status_chance":25,"unique":{"force_procs":["impact"]},"damage":{"Impact":260}},{"name":"Heavy Slam","speed":1,"crit_chance":15,"crit_mult":2,"status_chance":25,"damage":{"Blast":390}}],
    "imageName":"cadus.webp","tags":["Tenno"],
    "compTags":["STAVES_STANCE"]},"Burston Prime":{"noise":"Alarming","releaseDate":"2013-12-19","ammoCapacity":540,"productCategory":"LongGuns","equipTime":1.1,"category":"Primary","trigger":"Burst","type":"Rifle","magazineSize":45,"reloadTime":2,"multishot":1,"attacks":[{"name":"Normal Attack","speed":5,"crit_chance":18,"crit_mult":1.8,"status_chance":30,"shot_type":"Hit-Scan","damage":{"Impact":13.8,"Slash":18.4,"Puncture":13.8}},{"name":"Incarnon Form","speed":20,"crit_chance":28,"crit_mult":3,"status_chance":30,"shot_type":"Hit-Scan","damage":{"Heat":13}},{"name":"Incarnon Form Radial Attack","speed":20,"crit_chance":28,"crit_mult":3,"status_chance":30,"shot_type":"AoE","damage":{"Heat":13},"no_headshot_mult":true}],
    "imageName":"burston-prime.webp","tags":["Prime","Never Vaulted","Incarnon"],
    "compTags":["ASSAULT_AMMO","BURSTON_PRIME"],
    "comb":[[1,2]]},"Buzlok":{"noise":"Alarming","releaseDate":"2014-09-17","ammoCapacity":540,"productCategory":"LongGuns","zoomProps":[[], []],"category":"Primary","trigger":"Semi","type":"Rifle","magazineSize":50,"reloadTime":3,"multishot":1,"attacks":[{"name":"Normal Attack","speed":6.25,"crit_chance":23,"crit_mult":2.5,"status_chance":21,"shot_type":"Projectile","shot_speed":80,"flight":80,"unique":{"WITH_COND":{"crit_chance":0.5}},"damage":{"Impact":30,"Slash":6,"Puncture":24}},{"name":"Beacon","speed":1.67,"crit_chance":0,"crit_mult":1,"status_chance":0,"shot_type":"Projectile","shot_speed":200,"flight":200,"damage":{"Puncture":3}}],
    "imageName":"buzlok.webp","tags":["Grineer"],
    "compTags":["PROJECTILE","ASSAULT_AMMO"]},"Burston":{"noise":"Alarming","releaseDate":"2012-10-25","ammoCapacity":540,"productCategory":"LongGuns","equipTime":1.1,"category":"Primary","trigger":"Burst","type":"Rifle","magazineSize":45,"reloadTime":2,"multishot":1,"attacks":[{"name":"Normal Attack","speed":5,"crit_chance":6,"crit_mult":1.6,"status_chance":18,"shot_type":"Hit-Scan","damage":{"Impact":10,"Slash":10,"Puncture":10}},{"name":"Incarnon Form","speed":20,"crit_chance":30,"crit_mult":3,"status_chance":30,"shot_type":"Hit-Scan","damage":{"Heat":3}},{"name":"Incarnon Form Radial Attack","speed":20,"crit_chance":30,"crit_mult":3,"status_chance":30,"shot_type":"AoE","damage":{"Heat":3},"no_headshot_mult":true}],
    "imageName":"burston.webp","tags":["Tenno","Incarnon"],
    "compTags":["ASSAULT_AMMO"],
    "comb":[[1,2]]},"Broken Scepter":{"blockingAngle":60,"comboDuration":5,"followThrough":0.5,"range":2.9,"windUp":0.5,"releaseDate":"2016-11-11","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":1.25,"crit_chance":10,"crit_mult":2,"status_chance":30,"damage":{"Impact":125.3,"Slash":35.8,"Puncture":17.9}},{"name":"Slam","speed":1,"crit_chance":10,"crit_mult":2,"status_chance":30,"unique":{"force_procs":["impact"]},"damage":{"Impact":358}},{"name":"Heavy Slam","speed":1,"crit_chance":10,"crit_mult":2,"status_chance":30,"damage":{"Blast":537}}],
    "imageName":"broken-scepter.webp","tags":[],
    "compTags":["STAVES_STANCE"]},"Bubonico":{"noise":"Alarming","releaseDate":"2020-11-19","ammoCapacity":"Infinity","productCategory":"LongGuns","equipTime":1.6,"zoomProps":[[]],"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":27,"reloadTime":4.5,"multishot":7,"attacks":[{"name":"Auto","speed":3.83,"crit_chance":25,"crit_mult":2.3,"status_chance":9.29,"shot_type":"Projectile","shot_speed":57,"flight":57,"damage":{"Impact":2,"Slash":19,"Puncture":13,"Toxin":7},"falloff":{"start":19,"end":41,"reduction":0.5}},{"name":"Burst","speed":5,"crit_chance":3,"crit_mult":3.5,"status_chance":57,"shot_type":"Projectile","shot_speed":25,"flight":25,"damage":{"Impact":9}},{"name":"Radial Attack","speed":5,"crit_chance":3,"crit_mult":3.5,"status_chance":57,"shot_type":"AoE","damage":{"Viral":143},"falloff":{"start":0,"end":7,"reduction":0.5},"no_headshot_mult":true}],
    "imageName":"bubonico.webp","tags":["Infested"],
    "compTags":["PROJECTILE","AOE"],
    "comb":[[1,2]]},"Bronco Prime":{"noise":"Alarming","releaseDate":"2013-07-13","productCategory":"Pistols","category":"Secondary","trigger":"Semi","type":"Pistol","magazineSize":4,"reloadTime":2,"multishot":7,"attacks":[{"name":"Normal Attack","speed":4.17,"crit_chance":6,"crit_mult":2,"status_chance":12.86,"shot_type":"Hit-Scan","damage":{"Impact":40,"Slash":5,"Puncture":5},"falloff":{"start":9,"end":18,"reduction":0.74}},{"name":"Incarnon Form","speed":3,"crit_chance":24,"crit_mult":3.2,"status_chance":25.7,"damage":{"Impact":27.2,"Slash":3.4,"Puncture":3.4}}],
    "imageName":"bronco-prime.webp","tags":["Prime","Never Vaulted","Incarnon"],
    "compTags":["SINGLESHOT","SECONDARYSHOTGUN","BRONCO"]},"Braton Vandal":{"noise":"Alarming","releaseDate":"2013-02-15","ammoCapacity":550,"productCategory":"LongGuns","equipTime":1.1,"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":50,"reloadTime":1.75,"multishot":1,"attacks":[{"name":"Normal Attack","speed":7.5,"crit_chance":16,"crit_mult":2,"status_chance":16,"shot_type":"Hit-Scan","damage":{"Impact":12.25,"Slash":21,"Puncture":1.75}},{"name":"Incarnon Form","speed":4.67,"crit_chance":38,"crit_mult":3.2,"status_chance":22,"damage":{"Impact":26,"Slash":36,"Puncture":2.6}},{"name":"Incarnon Form Radial Attack","speed":4.67,"crit_chance":38,"crit_mult":3.2,"status_chance":22,"shot_type":"AoE","damage":{"Heat":65},"no_headshot_mult":true}],
    "imageName":"braton-vandal.webp","tags":["Tenno","Vandal","Incarnon"],
    "compTags":["ASSAULT_AMMO"],
    "comb":[[1,2]]},"Carmine Penta":{"noise":"Alarming","releaseDate":"2021-03-19","ammoCapacity":40,"productCategory":"LongGuns","equipTime":0.4,"category":"Primary","trigger":"Active","type":"Rifle","magazineSize":10,"reloadTime":2.5,"multishot":1,"attacks":[{"name":"Grenade Impact","speed":2.7,"crit_chance":10,"crit_mult":2,"status_chance":10,"shot_type":"Projectile","shot_speed":20,"flight":20,"damage":{"Impact":75}},{"name":"Grenade Detonation","speed":2.7,"crit_chance":10,"crit_mult":2,"status_chance":10,"shot_type":"AoE","damage":{"Blast":350},"falloff":{"start":0,"end":4,"reduction":0.5},"no_headshot_mult":true}],
    "imageName":"carmine-penta.webp","tags":["Corpus"],
    "compTags":["PROJECTILE","SNIPER_AMMO","AOE","SINGLESHOT","PENTA"],
    "comb":[[0,1]]},"Cantare":{"noise":"Silent","releaseDate":"2024-06-18","productCategory":"Pistols","category":"Secondary","trigger":"Auto","type":"Throwing","magazineSize":6,"reloadTime":1.2,"multishot":1,"attacks":[{"name":"Normal Attack","speed":3.33,"crit_chance":18,"crit_mult":2,"status_chance":22,"shot_type":"Projectile","shot_speed":70,"damage":{"Slash":63,"Puncture":27}}],
    "imageName":"Cantare.webp","tags":[],
    "compTags":["PROJECTILE","THROWN"]},"Castanas":{"noise":"Silent","releaseDate":"2014-02-19","ammoCapacity":18,"productCategory":"Pistols","category":"Secondary","trigger":"Active","type":"Throwing","magazineSize":2,"reloadTime":1,"multishot":1,"attacks":[{"name":"Normal Attack","speed":3.33,"crit_chance":8,"crit_mult":1.5,"status_chance":22,"shot_type":"Projectile","shot_speed":60,"flight":60,"damage":{"Electricity":160},"falloff":{"start":0,"end":3.6,"reduction":0.4}}],
    "imageName":"castanas.webp","tags":["Tenno"],
    "compTags":["PROJECTILE","DEPLOYABLE","AOE","SINGLESHOT"]},"Catchmoon (Primary)":{"ammoCapacity":70,"productCategory":"","category":"Primary","type":"Kitgun","magazineSize":0,"reloadTime":3,"multishot":1,"attacks":[{"name":"Normal Attack","speed":1,"crit_chance":0,"crit_mult":0,"status_chance":0,"shot_type":"Projectile","shot_speed":100,"unique":{"force_procs":["impact"]},"damage":{"Impact":89,"fire":167}}],
    "imageName":"catchmoon.webp","tags":["primary-shotgun"],
    "compTags":[""]},"Cassowar":{"blockingAngle":55,"comboDuration":5,"followThrough":0.6,"range":3,"windUp":0.9,"releaseDate":"2017-11-23","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":1.17,"crit_chance":6,"crit_mult":1.4,"status_chance":28,"damage":{"Impact":41.36,"Slash":82.72,"Puncture":63.92}},{"name":"Slam","speed":1,"crit_chance":6,"crit_mult":1.4,"status_chance":28,"unique":{"force_procs":["impact"]},"damage":{"Impact":376}},{"name":"Heavy Slam","speed":1,"crit_chance":6,"crit_mult":1.4,"status_chance":28,"damage":{"Blast":564}}],
    "imageName":"cassowar.webp","tags":["Tenno"],
    "compTags":["POLEARMS_STANCE"]},"Catabolyst":{"noise":"Alarming","releaseDate":"2020-11-19","ammoCapacity":155,"productCategory":"Pistols","zoomProps":[[]],"category":"Secondary","trigger":"Held","type":"Pistol","magazineSize":31,"reloadTime":1.7,"multishot":1,"attacks":[{"name":"Primary","speed":12,"crit_chance":11,"crit_mult":2.9,"status_chance":43,"shot_type":"Discharge","damage":{"Corrosive":53},"falloff":{"start":9,"end":19,"reduction":0.2}},{"name":"Partial Reload Impact","speed":12,"crit_chance":11,"crit_mult":2.9,"status_chance":43,"shot_type":"Projectile","shot_speed":-1,"flight":-1,"damage":{"Impact":11}},{"name":"Partial Reload Explosion","speed":12,"crit_chance":11,"crit_mult":2.9,"status_chance":43,"shot_type":"AoE","damage":{"Corrosive":203},"falloff":{"start":0,"end":5,"reduction":0.5},"no_headshot_mult":true},{"name":"Reload From Empty Impact","speed":12,"crit_chance":31,"crit_mult":2.9,"status_chance":59,"shot_type":"Projectile","shot_speed":-1,"flight":-1,"damage":{"Impact":11}},{"name":"Reload From Empty Explosion","speed":12,"crit_chance":31,"crit_mult":2.9,"status_chance":59,"shot_type":"AoE","damage":{"Corrosive":1997},"falloff":{"start":0,"end":7,"reduction":0.5},"no_headshot_mult":true}],
    "imageName":"catabolyst.webp","tags":["Infested"],
    "compTags":["PROJECTILE","BEAM","CATABOLYST"],
    "comb":[[1,2],
    [3,4]]},"Caustacyst":{"blockingAngle":60,"comboDuration":5,"followThrough":0.6,"range":2.9,"windUp":1,"releaseDate":"2016-10-20","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":1,"crit_chance":9,"crit_mult":2,"status_chance":37,"damage":{"Impact":17,"Slash":69,"Puncture":71,"Corrosive":103}},{"name":"Corrosive Wave","speed":1,"crit_chance":9,"crit_mult":2,"status_chance":10,"shot_type":"Projectile","shot_speed":10,"flight":10,"damage":{"Corrosive":192},"falloff":{"start":0,"end":35,"reduction":1}},{"name":"Corrosive Pool","speed":1,"crit_chance":0,"crit_mult":1,"status_chance":0,"shot_type":"AoE","damage":{"Corrosive":5},"no_headshot_mult":true},{"name":"Slam","speed":1,"crit_chance":9,"crit_mult":2,"status_chance":37,"unique":{"force_procs":["impact"]},"damage":{"Impact":520}},{"name":"Heavy Slam","speed":1,"crit_chance":9,"crit_mult":2,"status_chance":37,"damage":{"Blast":780}}],
    "imageName":"caustacyst.webp","tags":["Infested"],
    "compTags":["SCYTHES_STANCE"]},"Catchmoon (Secondary)":{"ammoCapacity":70,"productCategory":"Pistols","category":"Secondary","trigger":"Semi","type":"Kitgun","magazineSize":0,"reloadTime":3,"multishot":1,"attacks":[{"name":"Normal Attack","speed":1,"crit_chance":0,"crit_mult":0,"status_chance":0,"shot_type":"Projectile","shot_speed":100,"unique":{"force_procs":["impact"]},"damage":{"Impact":89,"fire":167}}],
    "imageName":"catchmoon.webp","tags":["secondary-shotgun"],
    "compTags":[""]},"Cedo":{"noise":"Alarming","releaseDate":"2020-12-18","ammoCapacity":200,"productCategory":"LongGuns","zoomProps":[[]],"category":"Primary","trigger":"Auto","type":"Shotgun","magazineSize":40,"reloadTime":2.2,"multishot":6,"attacks":[{"name":"Normal Attack","speed":3.83,"crit_chance":20,"crit_mult":2.4,"status_chance":0.3,"shot_type":"Hit-Scan","unique":{"base_per_status":0.6},"damage":{"Puncture":30},"falloff":{"start":26,"end":52,"reduction":0.9667}},{"name":"Alt-Fire Glaive","speed":1,"crit_chance":2,"crit_mult":1.4,"status_chance":50,"shot_type":"Projectile","shot_speed":60,"flight":60,"damage":{"Slash":20}},{"name":"Glaive Radial Attack","speed":1,"crit_chance":2,"crit_mult":1.4,"status_chance":50,"shot_type":"AoE","damage":{"Blast":10},"falloff":{"start":0,"end":6,"reduction":0},"no_headshot_mult":true}],
    "imageName":"cedo.webp","tags":["Tenno"],
    "compTags":["PROJECTILE"],
    "comb":[[1,2],
    [0,1,2]]},"Cedo Prime":{"noise":"Alarming","releaseDate":"2025-02-13","ammoCapacity":200,"productCategory":"LongGuns","zoomProps":[[]],"category":"Primary","trigger":"Auto","type":"Shotgun","magazineSize":40,"reloadTime":1.8,"multishot":7,"attacks":[{"name":"Normal Attack","speed":4.5,"crit_chance":24,"crit_mult":2.4,"status_chance":2,"shot_type":"Hit-Scan","unique":{"base_per_status":0.6},"damage":{"Puncture":32}},{"name":"Alt-Fire Glaive","speed":1,"crit_chance":10,"crit_mult":2,"status_chance":50,"shot_type":"Projectile","shot_speed":60,"flight":60,"damage":{"Slash":20}},{"name":"Glaive Radial Attack","speed":1,"crit_chance":10,"crit_mult":2,"status_chance":50,"shot_type":"AoE","damage":{"Blast":10},"no_headshot_mult":true}],
    "imageName":"CedoPrime.webp","tags":[],
    "compTags":["PROJECTILE"],
    "comb":[[1,2],
    [0,1,2]]},"Ceramic Dagger":{"blockingAngle":45,"comboDuration":5,"followThrough":0.9,"range":1.8,"windUp":0.4,"releaseDate":"2012-12-18","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":1,"crit_chance":10,"crit_mult":1.5,"status_chance":20,"damage":{"Impact":14,"Puncture":126}},{"name":"Incarnon Form","speed":1,"crit_chance":10,"crit_mult":1.5,"status_chance":20,"damage":{"Impact":38,"Puncture":1342}},{"name":"Incarnon Form Impact (for Heavy Attack)","speed":1,"crit_chance":10,"crit_mult":1.5,"status_chance":20,"damage":{"Impact":35,"Puncture":116.66,"Slash":198.345}},{"name":"Incarnon Form Explosion (for Heavy Attack)","speed":1,"crit_chance":10,"crit_mult":1.5,"status_chance":20,"shot_type":"AoE","unique":{"force_procs":["impact"]},"damage":{"Heat":350},"no_headshot_mult":true},{"name":"Slam","speed":1,"crit_chance":10,"crit_mult":1.5,"status_chance":20,"unique":{"force_procs":["impact"]},"damage":{"Impact":280}},{"name":"Heavy Slam","speed":1,"crit_chance":10,"crit_mult":1.5,"status_chance":20,"damage":{"Blast":420}}],
    "imageName":"ceramic-dagger.webp","tags":["Tenno","Incarnon"],
    "compTags":["DAGGERS_STANCE"],
    "comb":[[1,2]]},"Cestra":{"noise":"Alarming","releaseDate":"2013-11-20","ammoCapacity":420,"productCategory":"Pistols","category":"Secondary","trigger":"Auto","type":"Pistol","magazineSize":60,"reloadTime":2,"multishot":1,"attacks":[{"name":"Normal Attack","speed":8.33,"crit_chance":6,"crit_mult":1.6,"status_chance":20,"shot_type":"Projectile","shot_speed":100,"flight":100,"damage":{"Impact":5.2,"Puncture":20.8}},{"name":"Incarnon Form","speed":6.67,"crit_chance":50,"crit_mult":3,"status_chance":18,"shot_type":"Projectile","shot_speed":100,"damage":{"Impact":10,"Puncture":40}}],
    "imageName":"cestra.webp","tags":["Corpus","Incarnon"],
    "compTags":["PROJECTILE"]},"Cinta":{"noise":"Silent","ammoCapacity":60,"productCategory":"LongGuns","category":"Primary","trigger":"Charge","type":"Rifle","magazineSize":1,"reloadTime":0.6,"multishot":1,"attacks":[{"name":"Quick Shot","speed":0.769,"crit_chance":20,"crit_mult":2,"status_chance":30,"shot_type":"Projectile","shot_speed":100,"damage":{"Puncture":360,"Slash":90}},{"name":"Charged shot","speed":0.769,"crit_chance":36,"crit_mult":3,"status_chance":32,"shot_type":"Projectile","shot_speed":100,"damage":{"Puncture":640,"Slash":160}},{"name":"Perfect Shot","speed":0.769,"crit_chance":20,"crit_mult":2,"status_chance":34,"shot_type":"Projectile","damage":{"Heat":600}}],
    "imageName":"cinta.webp","tags":[""],
    "compTags":["PROJECTILE"]},"Cobra & Crane Prime":{"blockingAngle":70,"comboDuration":5,"followThrough":0.6,"range":2.6,"windUp":0.7,"releaseDate":"2022-12-14","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":1,"crit_chance":18,"crit_mult":2,"status_chance":38,"damage":{"Impact":210,"Puncture":90}},{"name":"Slam","speed":1,"crit_chance":18,"crit_mult":2,"status_chance":38,"unique":{"force_procs":["impact"]},"damage":{"Impact":600}},{"name":"Heavy Slam","speed":1,"crit_chance":18,"crit_mult":2,"status_chance":38,"damage":{"Blast":900}}],
    "imageName":"cobra-&-crane-prime.webp","tags":[],
    "compTags":["SWORDS_AND_SHIELD_STANCE"]},"Cernos":{"noise":"Silent","releaseDate":"2013-11-27","ammoCapacity":72,"productCategory":"LongGuns","zoomProps":[[]],"category":"Primary","trigger":"Charge","type":"Rifle","magazineSize":1,"reloadTime":0.6,"multishot":1,"attacks":[{"name":"Uncharged Shot","speed":1,"crit_chance":36,"crit_mult":2,"status_chance":18,"shot_type":"Projectile","shot_speed":70,"flight":70,"damage":{"Impact":171,"Slash":9.5,"Puncture":9.5}},{"name":"Charged Shot","speed":1,"crit_chance":36,"crit_mult":2,"status_chance":18,"shot_type":"Projectile","shot_speed":90,"flight":90,"damage":{"Impact":342,"Slash":19,"Puncture":19}}],
    "imageName":"cernos.webp","tags":["Tenno"],
    "compTags":["PROJECTILE"]},"Cernos Prime":{"noise":"Silent","releaseDate":"2016-11-22","ammoCapacity":72,"productCategory":"LongGuns","zoomProps":[[]],"category":"Primary","trigger":"Charge","type":"Rifle","magazineSize":1,"reloadTime":0.64999998,"multishot":3,"attacks":[{"name":"Uncharged Horizontal/Vertical Shot","speed":1,"crit_chance":35,"crit_mult":2,"status_chance":30,"shot_type":"Projectile","shot_speed":70,"flight":70,"damage":{"Impact":82.8,"Slash":4.6,"Puncture":4.6}},{"name":"Charged Horizontal/Vertical Shot","speed":1,"crit_chance":35,"crit_mult":2,"status_chance":30,"shot_type":"Projectile","shot_speed":95,"flight":95,"damage":{"Impact":165.6,"Slash":9.2,"Puncture":9.2}}],
    "imageName":"cernos-prime.webp","tags":["Prime","Never Vaulted"],
    "compTags":["PROJECTILE"]},"Ceti Lacera":{"blockingAngle":60,"comboDuration":5,"followThrough":0.5,"range":2.5,"windUp":0.4,"releaseDate":"2020-03-24","productCategory":"Melee","equipTime":0.93333,"category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":1.08,"crit_chance":20,"crit_mult":2,"status_chance":40,"damage":{"Impact":12,"Slash":66,"Puncture":38,"Electricity":100}},{"name":"Slam","speed":1,"crit_chance":20,"crit_mult":2,"status_chance":40,"unique":{"force_procs":["impact"]},"damage":{"Electricity":432}},{"name":"Heavy Slam","speed":1,"crit_chance":20,"crit_mult":2,"status_chance":40,"damage":{"Electricity":648}}],
    "imageName":"ceti-lacera.webp","tags":["Tenno"],
    "compTags":["BLADE_AND_WHIP_STANCE"]},"Cobra & Crane":{"blockingAngle":70,"comboDuration":5,"followThrough":0.6,"range":2.6,"windUp":0.7,"releaseDate":"2018-12-18","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":0.917,"crit_chance":15,"crit_mult":1.5,"status_chance":36,"damage":{"Impact":207.2,"Puncture":88.8}},{"name":"Slam","speed":1,"crit_chance":15,"crit_mult":1.5,"status_chance":36,"unique":{"force_procs":["impact"]},"damage":{"Impact":592}},{"name":"Heavy Slam","speed":1,"crit_chance":15,"crit_mult":1.5,"status_chance":36,"damage":{"Impact":888}}],
    "imageName":"cobra-&-crane.webp","tags":[],
    "compTags":["SWORDS_AND_SHIELD_STANCE"]},"Cerata":{"blockingAngle":55,"comboDuration":5,"followThrough":0.7,"range":1.25,"windUp":1.2,"releaseDate":"2015-10-28","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":1,"crit_chance":15,"crit_mult":2,"status_chance":30,"damage":{"Impact":19,"Slash":52,"Puncture":36,"Toxin":76}},{"name":"Throw","speed":1,"crit_chance":19,"crit_mult":2.1,"status_chance":33,"shot_type":"Thrown","shot_speed":35,"flight":35,"damage":{"Impact":33,"Slash":52,"Puncture":39,"Toxin":77}},{"name":"Throw Bounce Explosion","speed":1,"crit_chance":19,"crit_mult":2.1,"status_chance":33,"shot_type":"AoE","damage":{"Toxin":333},"falloff":{"start":0,"end":4.8,"reduction":0.3},"no_headshot_mult":true},{"name":"Throw Recall Explosion","speed":1,"crit_chance":19,"crit_mult":2.1,"status_chance":33,"shot_type":"AoE","unique":{"force_procs":["impact","toxin"]},"damage":{"Toxin":666},"falloff":{"start":0,"end":4.8,"reduction":0},"no_headshot_mult":true},{"name":"Charged Throw","speed":0.833,"crit_chance":21,"crit_mult":2.3,"status_chance":34,"shot_type":"Thrown","shot_speed":45,"flight":45,"unique":{"force_procs":["impact","toxin"]},"damage":{"Impact":46,"Slash":114,"Puncture":80,"Toxin":162}},{"name":"Charged Throw Bounce Explosion","speed":0.833,"crit_chance":21,"crit_mult":2.3,"status_chance":34,"shot_type":"AoE","damage":{"Toxin":666},"falloff":{"start":0,"end":4.8,"reduction":0.3},"no_headshot_mult":true},{"name":"Charged Throw Recall Explosion","speed":0.833,"crit_chance":21,"crit_mult":2.3,"status_chance":34,"shot_type":"AoE","unique":{"force_procs":["impact","toxin"]},"damage":{"Toxin":1318},"falloff":{"start":0,"end":4.8,"reduction":0},"no_headshot_mult":true},{"name":"Slam","speed":1,"crit_chance":15,"crit_mult":2,"status_chance":30,"unique":{"force_procs":["impact"]},"damage":{"Toxin":366}},{"name":"Heavy Slam","speed":1,"crit_chance":15,"crit_mult":2,"status_chance":30,"damage":{"Toxin":549}}],
    "imageName":"cerata.webp","tags":["Infested"],
    "compTags":["GLAIVES_STANCE"],
    "comb":[[1,2],
    [4,5]]},"Coda Bassocyst":{"noise":"Alarming","releaseDate":"2025-03-19","ammoCapacity":96,"productCategory":"LongGuns","zoomProps":[[]],"category":"Primary","trigger":"Semi","type":"Shotgun","magazineSize":24,"reloadTime":2.5,"multishot":1,"attacks":[{"name":"Normal Attack","speed":1.17,"crit_chance":18,"crit_mult":2.2,"status_chance":40,"shot_type":"Projectile","shot_speed":62,"damage":{"Blast":789,"Radiation":19}},{"name":"Alt-Fire","speed":1,"crit_chance":18,"crit_mult":2.2,"status_chance":40,"shot_type":"Projectile","shot_speed":40,"unique":{"force_procs":["impact","magnetic"]},"damage":{"Blast":303}}],
    "imageName":"CodaBassocyst.webp","tags":["Coda"],
    "compTags":[]},"Coda Bubonico":{"noise":"Alarming","releaseDate":"2026-03-25","ammoCapacity":"Infinity","productCategory":"LongGuns","zoomProps":[[]],"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":36,"reloadTime":5.5,"multishot":7,"attacks":[{"name":"Auto","speed":5.33,"crit_chance":27,"crit_mult":2.3,"status_chance":10.14,"shot_type":"Projectile","damage":{"Impact":2,"Slash":19,"Puncture":13,"Toxin":7}},{"name":"Burst","speed":7,"crit_chance":5,"crit_mult":3.5,"status_chance":61,"shot_type":"Projectile","shot_speed":25,"damage":{"Impact":9}},{"name":"Radial Attack","speed":7,"crit_chance":5,"crit_mult":3.5,"status_chance":57,"shot_type":"AoE","damage":{"Viral":143},"no_headshot_mult":true}],
    "imageName":"CodaBubonico.webp","tags":["Coda"],
    "compTags":["PROJECTILE","AOE"],
    "comb":[[1,2]]},"Coda Hema":{"noise":"Alarming","releaseDate":"2025-03-19","productCategory":"LongGuns","category":"Primary","trigger":"Burst","type":"Rifle","magazineSize":72,"reloadTime":2,"multishot":1,"attacks":[{"name":"Normal Attack","speed":5.33,"crit_chance":20,"crit_mult":2.3,"status_chance":30,"shot_type":"Projectile","shot_speed":150,"damage":{"Viral":52}}],
    "imageName":"CodaHema.webp","tags":["Coda"],
    "compTags":["ASSAULT_AMMO","PROJECTILE","HEMA"]},"Coda Catabolyst":{"noise":"Alarming","releaseDate":"2025-03-19","ammoCapacity":155,"productCategory":"Pistols","zoomProps":[[]],"category":"Secondary","trigger":"Held","type":"Pistol","magazineSize":37,"reloadTime":1.7,"multishot":1,"attacks":[{"name":"Primary","speed":12,"crit_chance":11,"crit_mult":2.9,"status_chance":50,"shot_type":"Discharge","damage":{"Corrosive":56},"falloff":{"start":9,"end":19,"reduction":0.2}},{"name":"Partial Reload Impact","speed":12,"crit_chance":11,"crit_mult":2.9,"status_chance":43,"shot_type":"Projectile","damage":{"Impact":11}},{"name":"Partial Reload Explosion","speed":12,"crit_chance":11,"crit_mult":2.9,"status_chance":43,"shot_type":"AoE","damage":{"Corrosive":74},"falloff":{"start":0,"end":3,"reduction":0.5},"no_headshot_mult":true},{"name":"Reload From Empty Impact","speed":12,"crit_chance":31,"crit_mult":2.9,"status_chance":59,"shot_type":"Projectile","damage":{"Impact":11}},{"name":"Reload From Empty Explosion","speed":12,"crit_chance":31,"crit_mult":2.9,"status_chance":59,"shot_type":"AoE","damage":{"Corrosive":658},"falloff":{"start":0,"end":5,"reduction":0.5},"no_headshot_mult":true}],
    "imageName":"CodaCatabolyst.webp","tags":["Coda"],
    "compTags":["PROJECTILE","BEAM","CATABOLYST"],
    "comb":[[1,2],
    [3,4]]},"Coda Caustacyst":{"blockingAngle":60,"comboDuration":5,"followThrough":0.6,"range":2.9,"windUp":1,"releaseDate":"2025-03-19","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":1,"crit_chance":19,"crit_mult":2.3,"status_chance":41,"damage":{"Impact":20,"Slash":70,"Puncture":75,"Corrosive":120}},{"name":"Corrosive Wave","speed":1,"crit_chance":19,"crit_mult":2.3,"status_chance":41,"shot_type":"Projectile","damage":{"Corrosive":225}},{"name":"Corrosive Pool","speed":1,"crit_chance":0,"crit_mult":1,"status_chance":41,"shot_type":"AoE","damage":{"Corrosive":145},"no_headshot_mult":true},{"name":"Slam","speed":1,"crit_chance":19,"crit_mult":2.3,"status_chance":41,"unique":{"force_procs":["impact"]},"damage":{"Impact":570}},{"name":"Heavy Slam","speed":1,"crit_chance":19,"crit_mult":2.3,"status_chance":41,"damage":{"Blast":855}}],
    "imageName":"CodaCaustacyst.webp","tags":["Coda"],
    "compTags":["SCYTHES_STANCE"]},"Coda Pox":{"noise":"Silent","releaseDate":"2025-03-19","ammoCapacity":20,"productCategory":"Pistols","category":"Secondary","trigger":"Auto","type":"Pistol","magazineSize":8,"reloadTime":1,"multishot":1,"attacks":[{"name":"Spore Impact","speed":2.0833335,"crit_chance":10,"crit_mult":2.2,"status_chance":45,"shot_type":"Projectile","damage":{"Toxin":55}},{"name":"Poison Cloud","speed":2.0833335,"crit_chance":10,"crit_mult":2.2,"status_chance":45,"shot_type":"AoE","damage":{"Toxin":35},"no_headshot_mult":true}],
    "imageName":"CodaPox.webp","tags":["Coda"],
    "compTags":["PROJECTILE","AOE","SINGLESHOT"]},"Coda Motovore":{"blockingAngle":50,"comboDuration":5,"followThrough":0.4,"range":2.5,"windUp":1.2,"releaseDate":"2025-03-19","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":1,"crit_chance":25,"crit_mult":2.3,"status_chance":30,"unique":{"ifMaxStatImpact":{"speed":0.4},"ifMaxStatPuncture":{"range":1.5},"ifMaxStatSlash":{"status_chance":1}},"damage":{"Impact":83.324997,"Slash":83.350006,"Puncture":83.324997}},{"name":"Slam","speed":1,"crit_chance":25,"crit_mult":2.3,"status_chance":30,"damage":{"Impact":500}},{"name":"Heavy Slam","speed":1,"crit_chance":25,"crit_mult":2.3,"status_chance":30,"damage":{"Blast":750}}],
    "imageName":"CodaMotovore.webp","tags":["Coda"],
    "compTags":["HAMMERS_STANCE"]},"Coda Synapse":{"noise":"Alarming","releaseDate":"2025-03-19","ammoCapacity":540,"productCategory":"LongGuns","zoomProps":[[]],"category":"Primary","trigger":"Held","type":"Rifle","magazineSize":76,"reloadTime":1.5,"multishot":1,"attacks":[{"name":"Normal Attack","speed":12,"crit_chance":40,"crit_mult":2.7,"status_chance":15,"shot_type":"Discharge","damage":{"Corrosive":26}}],
    "imageName":"CodaSynapse.webp","tags":["Coda"],
    "compTags":["BEAM","ASSAULT_AMMO"]},"Coda Hirudo":{"blockingAngle":50,"comboDuration":5,"followThrough":0.9,"range":1.25,"windUp":0.5,"releaseDate":"2025-03-19","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":1,"crit_chance":34,"crit_mult":3.1,"status_chance":18,"damage":{"Impact":26.3,"Slash":8.7,"Puncture":140}},{"name":"Slam","speed":1,"crit_chance":34,"crit_mult":3.1,"status_chance":18,"unique":{"force_procs":["impact"]},"damage":{"Impact":350}},{"name":"Heavy Slam","speed":1,"crit_chance":34,"crit_mult":3.1,"status_chance":18,"damage":{"Blast":525}}],
    "imageName":"CodaHirudo.webp","tags":["Coda"],
    "compTags":["SPARRING_STANCE"]},"Coda Mire":{"blockingAngle":55,"comboDuration":5,"followThrough":0.6,"range":2.7,"windUp":0.6,"releaseDate":"2025-03-19","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":1.0833334,"crit_chance":18,"crit_mult":2.4,"status_chance":40,"damage":{"Impact":45,"Slash":66,"Puncture":45,"Toxin":79}},{"name":"Slam","speed":1,"crit_chance":18,"crit_mult":2.4,"status_chance":40,"unique":{"force_procs":["impact","toxin"]},"damage":{"Toxin":470}},{"name":"Heavy Slam","speed":1,"crit_chance":18,"crit_mult":2.4,"status_chance":40,"unique":{"force_procs":["toxin"]},"damage":{"Toxin":705}}],
    "imageName":"CodaMire.webp","tags":["Coda"],
    "compTags":["SWORDS_STANCE","MIRE"]},"Coda Pathocyst":{"blockingAngle":55,"comboDuration":5,"followThrough":0.7,"range":1.3,"windUp":1.2,"releaseDate":"2025-03-19","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":0.667,"crit_chance":20,"crit_mult":2.3,"status_chance":35,"damage":{"Impact":58,"Slash":65,"Puncture":55,"Viral":92}},{"name":"Throw","speed":0.667,"crit_chance":22,"crit_mult":2.4,"status_chance":36,"shot_type":"Thrown","shot_speed":30,"flight":30,"damage":{"Impact":49,"Slash":80,"Puncture":45,"Viral":123}},{"name":"Throw Bounce Explosion","speed":0.667,"crit_chance":22,"crit_mult":2.4,"status_chance":36,"shot_type":"AoE","damage":{"Viral":405},"no_headshot_mult":true},{"name":"Throw Recall Explosion","speed":0.667,"crit_chance":22,"crit_mult":2.4,"status_chance":36,"shot_type":"AoE","unique":{"force_procs":["impact","viral"]},"damage":{"Viral":810},"falloff":{"start":0,"end":4.9,"reduction":0},"no_headshot_mult":true},{"name":"Charged Throw","speed":0.833,"crit_chance":24,"crit_mult":2.5,"status_chance":38,"shot_type":"Thrown","shot_speed":30,"flight":30,"damage":{"Impact":131,"Slash":137,"Puncture":125,"Viral":201}},{"name":"Charged Throw Bounce Explosion","speed":0.833,"crit_chance":24,"crit_mult":2.5,"status_chance":38,"shot_type":"AoE","damage":{"Viral":810},"falloff":{"start":0,"end":4.9,"reduction":0.5},"no_headshot_mult":true},{"name":"Charged Throw Recall Explosion","speed":0.833,"crit_chance":24,"crit_mult":2.5,"status_chance":38,"shot_type":"AoE","unique":{"force_procs":["impact","viral"]},"damage":{"Viral":1620},"no_headshot_mult":true},{"name":"Slam","speed":1,"crit_chance":20,"crit_mult":2.3,"status_chance":35,"unique":{"force_procs":["impact"]},"damage":{"Viral":540}},{"name":"Heavy Slam","speed":1,"crit_chance":20,"crit_mult":2.3,"status_chance":35,"damage":{"Viral":810}}],
    "imageName":"CodaPathocyst.webp","tags":["Coda"],
    "compTags":["GLAIVES_STANCE"],
    "comb":[[1,2],
    [4,5]]},"Convectrix":{"noise":"Alarming","releaseDate":"2015-10-01","ammoCapacity":700,"productCategory":"LongGuns","zoomProps":[[]],"category":"Primary","trigger":"Held","type":"Rifle","magazineSize":70,"reloadTime":2,"multishot":2,"attacks":[{"name":"Normal Attack","speed":12,"crit_chance":16,"crit_mult":2.4,"status_chance":45,"shot_type":"Discharge","damage":{"Impact":1.2,"Slash":9.6,"Puncture":1.2}},{"name":"Alt-Fire","speed":16,"crit_chance":16,"crit_mult":2.4,"status_chance":45,"shot_type":"Discharge","damage":{"Impact":0.9,"Slash":7.2,"Puncture":0.9}}],
    "imageName":"convectrix.webp","tags":["Corpus"],
    "compTags":["BEAM","CONVECTRIX"]},"Coda Sporothrix":{"noise":"Alarming","releaseDate":"2025-03-19","ammoCapacity":45,"productCategory":"LongGuns","category":"Primary","trigger":"Semi","type":"Rifle","magazineSize":11,"reloadTime":2.5,"multishot":1,"attacks":[{"name":"Unzoomed","speed":1.83,"crit_chance":5,"crit_mult":3,"status_chance":55,"shot_type":"Projectile","shot_speed":270,"damage":{"Slash":157.91998,"Impact":101.52,"Puncture":116.56}},{"name":"2.7x Zoom","speed":1.83,"crit_chance":5,"crit_mult":3,"status_chance":55,"shot_type":"Projectile","shot_speed":270,"damage":{"Slash":157.91998,"Impact":101.52,"Puncture":116.56}},{"name":"AoE","speed":1.83,"crit_chance":5,"crit_mult":3,"status_chance":55,"shot_type":"AoE","damage":{"Slash":25,"Viral":23},"no_headshot_mult":true}],
    "imageName":"CodaSporothrix.webp","tags":["Coda"],
    "compTags":["SNIPER_AMMO","PROJECTILE","SPOROTHRIX"],
    "comb":[[0,1]]},"Coda Tysis":{"noise":"Alarming","releaseDate":"2025-03-19","ammoCapacity":210,"productCategory":"Pistols","category":"Secondary","trigger":"Semi","type":"Pistol","magazineSize":18,"reloadTime":1.2,"multishot":1,"attacks":[{"name":"Normal Attack","speed":2.5,"crit_chance":13,"crit_mult":2,"status_chance":50,"shot_type":"Projectile","shot_speed":75,"flight":75,"damage":{"Impact":18,"Slash":26,"Puncture":32}},{"name":"Corrosive DoT","speed":2.5,"crit_chance":13,"crit_mult":2,"status_chance":50,"shot_type":"DoT","damage":{"Corrosive":59}}],
    "imageName":"CodaTysis.webp","tags":["Coda"],
    "compTags":["PROJECTILE"],
    "comb":[[0,1]]},"Corinth":{"noise":"Alarming","releaseDate":"2017-12-21","ammoCapacity":135,"productCategory":"LongGuns","zoomProps":[[]],"category":"Primary","trigger":"Semi","type":"Shotgun","magazineSize":5,"reloadTime":2.3000002,"multishot":6,"attacks":[{"name":"Buckshot","speed":1.17,"crit_chance":30,"crit_mult":2.8,"status_chance":6,"shot_type":"Hit-Scan","damage":{"Impact":25.2,"Slash":27,"Puncture":37.8},"falloff":{"start":18,"end":36,"reduction":0.6667}},{"name":"Air Burst Projectile","speed":1.17,"crit_chance":4,"crit_mult":1.6,"status_chance":28,"shot_type":"Projectile","shot_speed":80,"flight":80,"unique":{"force_procs":["impact"]},"damage":{"Impact":100}},{"name":"Air Burst Explosion","speed":1.17,"crit_chance":4,"crit_mult":1.6,"status_chance":28,"shot_type":"AoE","damage":{"Blast":404},"falloff":{"start":0,"end":9.4,"reduction":0.9},"no_headshot_mult":true}],
    "imageName":"corinth.webp","tags":["Tenno"],
    "compTags":["PROJECTILE"],
    "comb":[[1,2]]},"Cortege (Arch-mode)":{"releaseDate":"2020-08-25","ammoCapacity":0,"productCategory":"Archguns","zoomProps":[[]],"category":"Archgun","type":"Archgun","magazineSize":100,"reloadTime":3,"multishot":1,"attacks":[{"name":"Held","speed":12,"crit_chance":20,"crit_mult":1.9,"status_chance":40,"shot_type":"Hit-Scan","damage":{"Heat":90}},{"name":"Grenade Impact","speed":0.25,"crit_chance":30,"crit_mult":2.4,"status_chance":16.7,"damage":{"Impact":10}},{"name":"Radial Attack","speed":0.25,"crit_chance":30,"crit_mult":2.4,"status_chance":16.7,"shot_type":"AoE","damage":{"Blast":1000},"no_headshot_mult":true}],
    "imageName":"Cortege.webp","tags":[],
    "compTags":["BATTERY"]},"Corinth Prime":{"noise":"Alarming","releaseDate":"2020-03-31","ammoCapacity":120,"productCategory":"LongGuns","zoomProps":[[]],"category":"Primary","trigger":"Semi","type":"Rifle","magazineSize":20,"reloadTime":3,"multishot":6,"attacks":[{"name":"Buckshot","speed":1.42,"crit_chance":30,"crit_mult":2.8,"status_chance":9,"shot_type":"Hit-Scan","damage":{"Impact":25.2,"Slash":27,"Puncture":37.8},"falloff":{"start":18,"end":36,"reduction":0.6667}},{"name":"Air Burst Projectile","speed":0.667,"crit_chance":4,"crit_mult":1.6,"status_chance":50,"shot_type":"Projectile","shot_speed":50,"flight":50,"unique":{"force_procs":["impact"]},"damage":{"Impact":100}},{"name":"Air Burst Explosion","speed":0.667,"crit_chance":4,"crit_mult":1.6,"status_chance":50,"shot_type":"AoE","damage":{"Blast":2200},"falloff":{"start":0,"end":9.8,"reduction":0.9},"no_headshot_mult":true}],
    "imageName":"corinth-prime.webp","tags":["Prime"],
    "compTags":["PROJECTILE"],
    "comb":[[1,2]]},"Corvas (Arch-mode)":{"releaseDate":"2014-10-24","ammoCapacity":0,"productCategory":"Archguns","zoomProps":[[]],"category":"Archgun","type":"Archgun","magazineSize":25,"reloadTime":8,"multishot":1,"attacks":[{"name":"Uncharged Shot","speed":2,"crit_chance":40,"crit_mult":2.6,"status_chance":13,"shot_type":"Projectile","shot_speed":400,"unique":{"force_procs":["impact"]},"damage":{"Impact":200,"Heat":240}},{"name":"Charged Shot","speed":2,"crit_chance":40,"crit_mult":3,"status_chance":13,"shot_type":"Projectile","shot_speed":400,"unique":{"force_procs":["impact"]},"damage":{"Impact":400,"Heat":480}}],
    "imageName":"Corvas.webp","tags":[""],
    "compTags":["BATTERY"]},"Corvas Prime (Arch-mode)":{"releaseDate":"2022-03-28","ammoCapacity":0,"productCategory":"Archguns","zoomProps":[[]],"category":"Archgun","type":"Archgun","magazineSize":20,"reloadTime":8,"multishot":1,"attacks":[{"name":"Uncharged Shot","speed":2,"crit_chance":44,"crit_mult":3,"status_chance":20,"shot_type":"Projectile","shot_speed":400,"unique":{"force_procs":["impact"]},"damage":{"Impact":230,"Heat":330}},{"name":"Charged Shot","speed":2,"crit_chance":56,"crit_mult":3,"status_chance":20,"shot_type":"Projectile","shot_speed":400,"unique":{"force_procs":["impact"]},"damage":{"Impact":430,"Heat":530}}],
    "imageName":"CorvasPrime.webp","tags":[""],
    "compTags":["BATTERY"]},"Cortege (Atmo-mode)":{"releaseDate":"2020-08-25","ammoCapacity":300,"productCategory":"Archguns","zoomProps":[[]],"category":"Archgun","type":"Archgun","magazineSize":100,"reloadTime":2.5,"multishot":1,"attacks":[{"name":"Held","speed":12,"crit_chance":20,"crit_mult":1.9,"status_chance":40,"shot_type":"Hit-Scan","damage":{"Heat":180}},{"name":"Grenade Impact","speed":0.25,"crit_chance":30,"crit_mult":2.4,"status_chance":16.7,"damage":{"Impact":20}},{"name":"Radial Attack","speed":0.25,"crit_chance":30,"crit_mult":2.4,"status_chance":16.7,"shot_type":"AoE","damage":{"Blast":2000},"no_headshot_mult":true}],
    "imageName":"Cortege.webp","tags":[],
    "compTags":[]},"Corvas (Atmo-mode)":{"releaseDate":"2018-12-18","ammoCapacity":100,"productCategory":"Archguns","zoomProps":[[]],"category":"Archgun","type":"Archgun","magazineSize":25,"reloadTime":2,"multishot":11,"attacks":[{"name":"Uncharged Shot","speed":2,"crit_chance":40,"crit_mult":3,"status_chance":1.3,"shot_type":"Hit-Scan","unique":{"force_procs":["impact"]},"damage":{"Impact":64,"Puncture":8,"Slash":8}},{"name":"Charged Shot","speed":2,"crit_chance":40,"crit_mult":3,"status_chance":1.3,"shot_type":"Hit-Scan","unique":{"force_procs":["impact"]},"damage":{"Impact":128,"Puncture":16,"Slash":16}}],
    "imageName":"Corvas.webp","tags":[""],
    "compTags":["BATTERY"]},"Corvas Prime (Atmo-mode)":{"releaseDate":"2022-03-28","ammoCapacity":120,"productCategory":"Archguns","zoomProps":[[]],"category":"Archgun","type":"Archgun","magazineSize":20,"reloadTime":2,"multishot":1,"attacks":[{"name":"Uncharged Shot","speed":2,"crit_chance":44,"crit_mult":3,"status_chance":20,"shot_type":"Projectile","shot_speed":400,"unique":{"force_procs":["impact"]},"damage":{"Impact":230,"Heat":330}},{"name":"Charged Shot","speed":2,"crit_chance":56,"crit_mult":3,"status_chance":20,"shot_type":"Projectile","shot_speed":400,"unique":{"force_procs":["impact"]},"damage":{"Impact":430,"Heat":530}}],
    "imageName":"CorvasPrime.webp","tags":[""],
    "compTags":["BATTERY"]},"Cronus":{"blockingAngle":55,"comboDuration":5,"followThrough":0.6,"range":2.5,"windUp":0.6,"releaseDate":"2012-10-25","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":0.917,"crit_chance":6,"crit_mult":1.5,"status_chance":18,"damage":{"Impact":31.8,"Slash":58.3,"Puncture":15.9}},{"name":"Slam","speed":1,"crit_chance":6,"crit_mult":1.5,"status_chance":18,"unique":{"force_procs":["impact"]},"damage":{"Impact":212}},{"name":"Heavy Slam","speed":1,"crit_chance":6,"crit_mult":1.5,"status_chance":18,"damage":{"Impact":318}}],
    "imageName":"cronus.webp","tags":["Tenno","Grineer"],
    "compTags":["SWORDS_STANCE"]},"Cyath (Machete)":{"comboDuration":5,"range":1,"windUp":1,"releaseDate":"2017-10-12","productCategory":"Melee","category":"Melee","type":"Zaw Component","multishot":1,"attacks":[{"name":"Cyath Strike","speed":0.92,"crit_chance":18,"crit_mult":2,"status_chance":18,"damage":{"Impact":46,"Slash":172.5,"Puncture":11.5}}],
    "imageName":"cyath.webp","tags":[],
    "compTags":["MACHETES_STANCE"]},"Corufell":{"blockingAngle":65,"comboDuration":5,"followThrough":0.4,"range":2.6,"windUp":1,"releaseDate":"2023-02-15","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":1,"crit_chance":26,"crit_mult":2.4,"status_chance":14,"damage":{"Impact":96,"Slash":36,"Puncture":68}},{"name":"Charged Projectile","speed":0.83,"crit_chance":26,"crit_mult":2.4,"status_chance":14,"shot_type":"Projectile","shot_speed":90,"damage":{"Heat":600}},{"name":"Slam","speed":1,"crit_chance":26,"crit_mult":2.4,"status_chance":14,"unique":{"force_procs":["impact"]},"damage":{"Blast":400}},{"name":"Heavy Slam","speed":1,"crit_chance":26,"crit_mult":2.4,"status_chance":14,"damage":{"Blast":600}}],
    "imageName":"corufell.webp","tags":[""],
    "compTags":["HEAVY SCYTHE_STANCE"]},"Cyanex":{"noise":"Alarming","releaseDate":"2019-05-22","productCategory":"Pistols","zoomProps":[[]],"category":"Secondary","trigger":"Auto","type":"Pistol","magazineSize":11,"reloadTime":2.2,"multishot":1,"attacks":[{"name":"Projectile Impact","speed":4.67,"crit_chance":8,"crit_mult":1.4,"status_chance":32,"shot_type":"Projectile","shot_speed":24,"flight":24,"damage":{"Impact":50}},{"name":"Projectile Explosion","speed":4.67,"crit_chance":8,"crit_mult":1.4,"status_chance":32,"shot_type":"AoE","damage":{"Gas":41},"falloff":{"start":0,"end":0.7,"reduction":0.2},"no_headshot_mult":true},{"name":"Burst Mode","speed":10.05,"crit_chance":8,"crit_mult":1.4,"status_chance":32,"shot_type":"Projectile","shot_speed":60,"flight":60,"damage":{"Impact":2.9,"Slash":38.9,"Puncture":30.2}}],
    "imageName":"cyanex.webp","tags":["Corpus","Sentient"],
    "compTags":["PROJECTILE"],
    "comb":[[0,1]]},"Daikyu":{"noise":"Silent","releaseDate":"2015-05-12","ammoCapacity":72,"productCategory":"LongGuns","zoomProps":[[]],"category":"Primary","trigger":"Charge","type":"Rifle","magazineSize":1,"reloadTime":0.6,"multishot":1,"attacks":[{"name":"Charged Shot","speed":1,"crit_chance":34,"crit_mult":2,"status_chance":46,"shot_type":"Projectile","shot_speed":140,"flight":140,"unique":{"force_procs":["impact"]},"damage":{"Impact":210,"Slash":210,"Puncture":280}}],
    "imageName":"daikyu.webp","tags":["Tenno"],
    "compTags":["PROJECTILE","DAIKYU"]},"Cyngas (Atmo-mode)":{"releaseDate":"2018-12-18","ammoCapacity":480,"productCategory":"Archguns","zoomProps":[[]],"category":"Archgun","type":"Archgun","magazineSize":30,"reloadTime":1.2,"multishot":1,"attacks":[{"name":"Projectile Impact","speed":6.67,"crit_chance":20,"crit_mult":2.2,"status_chance":30,"shot_type":"Hit-Scan","damage":{"Impact":80,"Puncture":80,"Slash":80}}],
    "imageName":"Cyngas.webp","tags":[],
    "compTags":[""]},"Cycron":{"noise":"Alarming","releaseDate":"2017-04-26","ammoCapacity":320,"productCategory":"Pistols","zoomProps":[[]],"category":"Secondary","trigger":"Held","type":"Pistol","magazineSize":40,"reloadTime":2,"multishot":1,"attacks":[{"name":"Normal Attack","speed":12,"crit_chance":12,"crit_mult":1.8,"status_chance":30,"shot_type":"Discharge","damage":{"Slash":5,"Puncture":8,"Radiation":10}}],
    "imageName":"cycron.webp","tags":["Corpus"],
    "compTags":["BEAM"]},"Cyath (Polearm)":{"comboDuration":5,"range":1,"windUp":1,"releaseDate":"2017-10-12","productCategory":"Melee","category":"Melee","type":"Zaw Component","multishot":1,"attacks":[{"name":"Cyath Strike","speed":0.92,"crit_chance":18,"crit_mult":2,"status_chance":18,"damage":{"Impact":46,"Slash":172.5,"Puncture":11.5}}],
    "imageName":"cyath.webp","tags":[],
    "compTags":["POLEARMS_STANCE"]},"Cyngas (Arch-mode)":{"releaseDate":"2016-07-08","ammoCapacity":0,"productCategory":"Archguns","zoomProps":[[]],"category":"Archgun","trigger":"Auto Burst","type":"Archgun","magazineSize":30,"reloadTime":1.25,"multishot":1,"attacks":[{"name":"Projectile Impact","speed":6.67,"crit_chance":20,"crit_mult":2.2,"status_chance":30,"shot_type":"Projectile","shot_speed":220,"damage":{"Impact":39.6,"Puncture":39.6,"Slash":40.8}}],
    "imageName":"Cyngas.webp","tags":[],
    "compTags":["BATTERY"]},"Dark Split-Sword (Dual Swords)":{"blockingAngle":60,"comboDuration":5,"followThrough":0.5,"range":2.4,"windUp":0.7,"productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":1.17,"crit_chance":25,"crit_mult":2.5,"status_chance":15,"damage":{"Slash":28,"Puncture":56,"Radiation":32}},{"name":"Slam","speed":1,"crit_chance":25,"crit_mult":2.5,"status_chance":15,"unique":{"force_procs":["impact"]},"damage":{"Impact":232}},{"name":"Heavy Slam","speed":1,"crit_chance":25,"crit_mult":2.5,"status_chance":15,"damage":{"Blast":348}}],
    "imageName":"DarkSplitSwordDualSwords.webp","tags":[""],
    "compTags":["DUAL_SWORDS_STANCE"]},"Dark Sword":{"blockingAngle":55,"comboDuration":5,"followThrough":0.6,"range":2.5,"windUp":0.6,"releaseDate":"2012-12-18","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":0.833,"crit_chance":5,"crit_mult":1.5,"status_chance":40,"damage":{"Slash":60,"Puncture":120,"Radiation":80}},{"name":"Slam","speed":1,"crit_chance":5,"crit_mult":1.5,"status_chance":40,"unique":{"force_procs":["impact"]},"damage":{"Toxin":520}},{"name":"Heavy Slam","speed":1,"crit_chance":5,"crit_mult":1.5,"status_chance":40,"unique":{"force_procs":["toxin"]},"damage":{"Toxin":780}}],
    "imageName":"dark-sword.webp","tags":["Tenno"],
    "compTags":["SWORDS_STANCE"]},"Dakra Prime":{"blockingAngle":55,"comboDuration":5,"followThrough":0.6,"range":2.5,"windUp":0.6,"releaseDate":"2013-09-13","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":1,"crit_chance":36,"crit_mult":2.4,"status_chance":18,"damage":{"Impact":17,"Slash":136,"Puncture":17}},{"name":"Slam","speed":1,"crit_chance":36,"crit_mult":2.4,"status_chance":18,"unique":{"force_procs":["impact"]},"damage":{"Impact":340}},{"name":"Heavy Slam","speed":1,"crit_chance":36,"crit_mult":2.4,"status_chance":18,"damage":{"Blast":510}}],
    "imageName":"dakra-prime.webp","tags":["Prime","Vaulted"],
    "compTags":["SWORDS_STANCE"]},"Dera":{"noise":"Alarming","releaseDate":"2013-05-23","ammoCapacity":540,"productCategory":"LongGuns","category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":45,"reloadTime":1.8,"multishot":1,"attacks":[{"name":"Normal Attack","speed":11.25,"crit_chance":8,"crit_mult":1.6,"status_chance":22,"shot_type":"Projectile","shot_speed":100,"flight":100,"damage":{"Impact":6,"Slash":1.5,"Puncture":22.5}},{"name":"Incarnon Form","speed":2,"crit_chance":22,"crit_mult":3,"status_chance":18,"shot_type":"Hit-Scan","damage":{"Impact":40,"Slash":80,"Puncture":130,"Magnetic":80}}],
    "imageName":"dera.webp","tags":["Incarnon"],
    "compTags":["PROJECTILE","ASSAULT_AMMO"]},"Dark Split-Sword (Heavy Blade)":{"blockingAngle":55,"comboDuration":5,"followThrough":0.6,"range":2.8,"windUp":1.1,"productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":0.92,"crit_chance":15,"crit_mult":2,"status_chance":25,"damage":{"Slash":52,"Puncture":78,"Radiation":100}},{"name":"Slam","speed":1,"crit_chance":15,"crit_mult":2,"status_chance":25,"unique":{"force_procs":["impact"]},"damage":{"Slash":104,"Puncture":156,"Radiation":200}},{"name":"Heavy Slam","speed":1,"crit_chance":15,"crit_mult":2,"status_chance":25,"damage":{"Blast":690}}],
    "imageName":"DarkSplitSwordHeavyBlade.webp","tags":[""],
    "compTags":["HEAVY_BLADE_STANCE"]},"Dehtat (Polearm)":{"comboDuration":5,"range":1,"windUp":1,"releaseDate":"2017-10-12","productCategory":"Melee","category":"Melee","type":"Zaw Component","multishot":1,"attacks":[{"name":"Dehtat Strike","speed":0.92,"crit_chance":18,"crit_mult":2,"status_chance":18,"damage":{"Impact":22.4,"Slash":89.6,"Puncture":112}}],
    "imageName":"dehtat.webp","tags":[],
    "compTags":["POLEARMS_STANCE"]},"Daikyu Prime":{"noise":"Silent","releaseDate":"2025-05-21","ammoCapacity":72,"productCategory":"LongGuns","zoomProps":[[]],"category":"Primary","trigger":"Charge","type":"Rifle","magazineSize":1,"reloadTime":0.6,"multishot":1,"attacks":[{"name":"Quick Shot","speed":1,"crit_chance":40,"crit_mult":2.4,"status_chance":50,"shot_type":"Projectile","unique":{"force_procs":["impact"]},"damage":{"Impact":112.5,"Slash":112.5,"Puncture":150}},{"name":"Charged Shot","speed":1,"crit_chance":40,"crit_mult":2.4,"status_chance":50,"shot_type":"Projectile","unique":{"force_procs":["impact"]},"damage":{"Impact":225,"Slash":225,"Puncture":300}}],
    "imageName":"DaikyuPrime.webp","tags":["Tenno"],
    "compTags":["PROJECTILE","DAIKYU"]},"Dehtat (Rapier)":{"comboDuration":5,"range":1,"windUp":1,"releaseDate":"2017-10-12","productCategory":"Melee","category":"Melee","type":"Zaw Component","multishot":1,"attacks":[{"name":"Dehtat Strike","speed":0.92,"crit_chance":18,"crit_mult":2,"status_chance":18,"damage":{"Impact":22.4,"Slash":89.6,"Puncture":112}}],
    "imageName":"dehtat.webp","tags":[],
    "compTags":["RAPIER_STANCE"]},"Dark Dagger":{"blockingAngle":45,"comboDuration":5,"followThrough":0.9,"range":1.75,"windUp":0.4,"releaseDate":"2012-12-18","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":0.917,"crit_chance":8,"crit_mult":1.5,"status_chance":22,"damage":{"Slash":36,"Puncture":58,"Radiation":60}},{"name":"Slam","speed":1,"crit_chance":8,"crit_mult":1.5,"status_chance":22,"unique":{"force_procs":["impact"]},"damage":{"Impact":308}},{"name":"Heavy Slam","speed":1,"crit_chance":8,"crit_mult":1.5,"status_chance":22,"damage":{"Radiation":462}}],
    "imageName":"dark-dagger.webp","tags":["Tenno"],
    "compTags":["DAGGERS_STANCE","DARK DAGGER"]},"Dera Vandal":{"noise":"Alarming","releaseDate":"2015-05-12","ammoCapacity":540,"productCategory":"LongGuns","category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":60,"reloadTime":1.8,"multishot":1,"attacks":[{"name":"Normal Attack","speed":11.25,"crit_chance":8,"crit_mult":2,"status_chance":30,"shot_type":"Projectile","shot_speed":150,"flight":150,"damage":{"Impact":6.4,"Slash":1.6,"Puncture":24}},{"name":"Incarnon Form","speed":2,"crit_chance":30,"crit_mult":3,"status_chance":22,"shot_type":"Hit-Scan","damage":{"Impact":50,"Slash":90,"Puncture":140,"Magnetic":90}}],
    "imageName":"dera-vandal.webp","tags":["Corpus","Vandal","Incarnon"],
    "compTags":["PROJECTILE","ASSAULT_AMMO"]},"Detron":{"noise":"Alarming","releaseDate":"2013-12-31","productCategory":"Pistols","category":"Secondary","trigger":"Semi","type":"Pistol","magazineSize":5,"reloadTime":1.05,"multishot":7,"attacks":[{"name":"Normal Attack","speed":3.33,"crit_chance":4,"crit_mult":1.5,"status_chance":12.86,"shot_type":"Projectile","shot_speed":150,"flight":150,"damage":{"Radiation":40},"falloff":{"start":13,"end":22,"reduction":0.6231}}],
    "imageName":"detron.webp","tags":["Corpus"],
    "compTags":["PROJECTILE","SECONDARYSHOTGUN","SINGLESHOT"]},"Desert Wind (Baruuk)":{"blockingAngle":60,"comboDuration":5,"followThrough":1,"range":1.2,"windUp":0.5,"releaseDate":"2018-06-15","productCategory":"Melee","category":"Melee","type":"Exalted Weapon","multishot":1,"attacks":[{"name":"Normal Attack","speed":1,"crit_chance":35,"crit_mult":2,"status_chance":15,"damage":{"Impact":250}},{"name":"Slam","speed":1,"crit_chance":35,"crit_mult":2,"status_chance":15,"damage":{"Impact":500}},{"name":"Heavy Slam","speed":1,"crit_chance":35,"crit_mult":2,"status_chance":15,"damage":{"Blast":750}}],
    "imageName":"DesertWind.webp","tags":[],
    "compTags":["DESERT_WIND_STANCE","POWER_WEAPON","BARUUK"]},"Despair":{"noise":"Silent","releaseDate":"2013-05-23","productCategory":"Pistols","category":"Secondary","trigger":"Auto","type":"Throwing","magazineSize":10,"reloadTime":0.75,"multishot":1,"attacks":[{"name":"Normal Attack","speed":3.33,"crit_chance":16,"crit_mult":1.6,"status_chance":16,"shot_type":"Projectile","shot_speed":70,"flight":70,"damage":{"Impact":2.9,"Slash":8.7,"Puncture":46.4}},{"name":"Incarnon Form","speed":3,"crit_chance":30,"crit_mult":3,"status_chance":20,"shot_type":"Projectile","damage":{"Impact":3,"Slash":9,"Puncture":48}},{"name":"Incarnon Form Radial Attack","speed":3,"crit_chance":30,"crit_mult":3,"status_chance":20,"shot_type":"AoE","damage":{"Heat":160},"no_headshot_mult":true}],
    "imageName":"despair.webp","tags":["Stalker","Incarnon"],
    "compTags":["PROJECTILE","THROWN"],
    "comb":[[1,2]]},"Dex Dakra":{"blockingAngle":60,"comboDuration":5,"followThrough":0.5,"range":2.5,"windUp":0.7,"releaseDate":"2015-03-25","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":0.883,"crit_chance":16,"crit_mult":2,"status_chance":24,"damage":{"Impact":14.2,"Slash":113.6,"Puncture":14.2}},{"name":"Slam","speed":1,"crit_chance":16,"crit_mult":2,"status_chance":24,"unique":{"force_procs":["impact"]},"damage":{"Blast":284}},{"name":"Heavy Slam","speed":1,"crit_chance":16,"crit_mult":2,"status_chance":24,"damage":{"Blast":426}}],
    "imageName":"dex-dakra.webp","tags":["Tenno"],
    "compTags":["DUAL_SWORDS_STANCE"]},"Dex Nikana":{"blockingAngle":55,"comboDuration":5,"followThrough":0.7,"range":2.5,"windUp":0.5,"releaseDate":"2024-03-27","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":1,"crit_chance":24,"crit_mult":2.6,"status_chance":18,"damage":{"Impact":16.8,"Slash":126,"Puncture":25.2}},{"name":"Slam","speed":1,"crit_chance":24,"crit_mult":2.6,"status_chance":18,"unique":{"force_procs":["impact"]},"damage":{"Impact":336}},{"name":"Heavy Slam","speed":1,"crit_chance":24,"crit_mult":2.6,"status_chance":18,"damage":{"Blast":504}}],
    "imageName":"dex-nikana.webp","tags":[],
    "compTags":["NIKANAS_STANCE"]},"Destreza Prime":{"blockingAngle":60,"comboDuration":5,"followThrough":0.7,"range":2.5,"windUp":0.5,"releaseDate":"2018-06-19","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":0.917,"crit_chance":32,"crit_mult":3,"status_chance":20,"damage":{"Impact":20.4,"Slash":30.6,"Puncture":119}},{"name":"Slam","speed":1,"crit_chance":32,"crit_mult":3,"status_chance":20,"unique":{"force_procs":["impact"]},"damage":{"Impact":340}},{"name":"Heavy Slam","speed":1,"crit_chance":32,"crit_mult":3,"status_chance":20,"damage":{"Blast":510}}],
    "imageName":"destreza-prime.webp","tags":["Prime","Incarnon"],
    "compTags":["RAPIER_STANCE"]},"Destreza":{"blockingAngle":60,"comboDuration":5,"followThrough":0.7,"range":2.5,"windUp":0.5,"releaseDate":"2016-01-13","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":1,"crit_chance":28,"crit_mult":2,"status_chance":14,"damage":{"Impact":3.95,"Slash":19.75,"Puncture":134.3}},{"name":"Slam","speed":1,"crit_chance":28,"crit_mult":2,"status_chance":14,"unique":{"force_procs":["impact"]},"damage":{"Impact":316}},{"name":"Heavy Slam","speed":1,"crit_chance":28,"crit_mult":2,"status_chance":14,"damage":{"Blast":474}}],
    "imageName":"destreza.webp","tags":["Tenno","Incarnon"],
    "compTags":["RAPIER_STANCE"]},"Dex Furis":{"noise":"Alarming","releaseDate":"2014-03-26","ammoCapacity":400,"productCategory":"Pistols","category":"Secondary","trigger":"Auto","type":"Pistol","magazineSize":100,"reloadTime":2,"multishot":1,"attacks":[{"name":"Normal Attack","speed":20,"crit_chance":14,"crit_mult":2,"status_chance":28,"shot_type":"Hit-Scan","damage":{"Impact":2.4,"Slash":2.4,"Puncture":11.2}}],
    "imageName":"dex-furis.webp","tags":["Tenno"],
    "compTags":[]},"Dex Pixia (Titania)":{"noise":"Alarming","releaseDate":"2019-03-08","ammoCapacity":"Infinity","productCategory":"Dual Pistol","category":"Secondary","trigger":"Charge","type":"Exalted Weapon","magazineSize":60,"reloadTime":0.3,"multishot":1,"attacks":[{"name":"Normal Attack","speed":5.83,"crit_chance":10,"crit_mult":2,"status_chance":25,"shot_type":"Hit-Scan","damage":{"Impact":16,"Slash":128,"Puncture":16}}],
    "imageName":"DexPixia.webp","tags":[""],
    "compTags":["POWER_WEAPON","BATTERY"]},"Dex Sybaris":{"noise":"Alarming","releaseDate":"2016-03-22","ammoCapacity":200,"productCategory":"LongGuns","category":"Primary","trigger":"Burst","type":"Rifle","magazineSize":14,"reloadTime":1.5,"multishot":1,"attacks":[{"name":"Normal Attack","speed":3.33,"crit_chance":35,"crit_mult":2,"status_chance":10,"shot_type":"Hit-Scan","damage":{"Impact":22.5,"Slash":33.75,"Puncture":18.75}},{"name":"Incarnon Form","speed":3.33,"crit_chance":30,"crit_mult":3,"status_chance":20,"shot_type":"Hit-Scan","unique":{"force_procs":["blast"]},"damage":{"Impact":28.8,"Slash":43.2,"Puncture":24}}],
    "imageName":"dex-sybaris.webp","tags":["Tenno","Incarnon"],
    "compTags":["ASSAULT_AMMO"]},"Diwata Prime (Titania)":{"blockingAngle":90,"comboDuration":5,"followThrough":0.7,"range":2.5,"windUp":0.4,"noise":"Silent","releaseDate":"2020-03-31","productCategory":"Melee","category":"Melee","type":"Exalted Weapon","multishot":1,"attacks":[{"name":"Normal Attack","speed":1.08,"crit_chance":20,"crit_mult":2,"status_chance":10,"damage":{"Impact":30,"Puncture":150,"Slash":20}}],
    "imageName":"DiwataPrime.webp","tags":[],
    "compTags":["TITANIA_STANCE","POWER_WEAPON"]},"Dread":{"noise":"Silent","releaseDate":"2013-05-23","ammoCapacity":72,"productCategory":"LongGuns","category":"Primary","trigger":"Charge","type":"Rifle","magazineSize":1,"reloadTime":0.7,"multishot":1,"attacks":[{"name":"Uncharged Shot","speed":1,"crit_chance":50,"crit_mult":2,"status_chance":20,"shot_type":"Projectile","shot_speed":85,"flight":85,"damage":{"Impact":16.8,"Slash":134.4,"Puncture":16.8}},{"name":"Charged Shot","speed":1,"crit_chance":50,"crit_mult":2,"status_chance":20,"shot_type":"Projectile","shot_speed":100,"flight":100,"damage":{"Impact":16.8,"Slash":302.4,"Puncture":16.8}},{"name":"Incarnon Form Charged Shot","speed":1.5,"crit_chance":50,"crit_mult":3,"status_chance":30,"shot_type":"Projectile","damage":{"Impact":100,"Slash":100,"Heat":200},"no_headshot_mult":true}],
    "imageName":"dread.webp","tags":["Stalker","Incarnon"],
    "compTags":["PROJECTILE","DREAD"]},"Dorrclave":{"blockingAngle":60,"comboDuration":5,"followThrough":0.5,"range":2.5,"windUp":0.4,"releaseDate":"2023-10-18","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":0.83,"crit_chance":26,"crit_mult":2.2,"status_chance":24,"damage":{"Slash":222}},{"name":"Spectral Attack","speed":0.83,"crit_chance":26,"crit_mult":2.2,"status_chance":24,"unique":{"absolute_status_chance":100},"damage":{"Slash":222}},{"name":"Slam","speed":1,"crit_chance":26,"crit_mult":2.2,"status_chance":24,"unique":{"force_procs":["impact"]},"damage":{"Slash":444}},{"name":"Heavy Slam","speed":1,"crit_chance":26,"crit_mult":2.2,"status_chance":24,"damage":{"Slash":666}}],
    "imageName":"Dorrclave.webp","tags":["Tenno"],
    "compTags":["BLADE_AND_WHIP_STANCE"]},"Dokrahm (Scythe)":{"comboDuration":5,"range":1,"windUp":1,"releaseDate":"2018-04-20","productCategory":"Melee","category":"Melee","type":"Zaw Component","multishot":1,"attacks":[{"name":"Dokrahm Strike","speed":1,"crit_chance":18,"crit_mult":2,"status_chance":18,"damage":{"Impact":46.4,"Slash":154.5,"Puncture":108.1}}],
    "imageName":"dokrahm.webp","tags":[],
    "compTags":["SCYTHES_STANCE"]},"Drakgoon":{"noise":"Alarming","releaseDate":"2014-01-08","ammoCapacity":120,"productCategory":"LongGuns","zoomProps":[[]],"category":"Primary","trigger":"Charge","type":"Rifle","magazineSize":7,"reloadTime":2.3,"multishot":10,"attacks":[{"name":"Uncharged Shot","speed":3.33,"crit_chance":5,"crit_mult":2,"status_chance":6.3,"shot_type":"Projectile","shot_speed":100,"flight":100,"damage":{"Impact":8,"Slash":24,"Puncture":8}},{"name":"Charged Shot","speed":3.33,"crit_chance":7.5,"crit_mult":2,"status_chance":6.9,"shot_type":"Projectile","shot_speed":160,"flight":160,"damage":{"Impact":7,"Slash":56,"Puncture":7}}],
    "imageName":"drakgoon.webp","tags":["Grineer"],
    "compTags":["PROJECTILE"]},"Dual Cestra":{"noise":"Alarming","releaseDate":"2014-02-05","ammoCapacity":480,"productCategory":"Pistols","category":"Secondary","trigger":"Auto","type":"Pistol","magazineSize":120,"reloadTime":3.5,"multishot":1,"attacks":[{"name":"Normal Attack","speed":18.75,"crit_chance":6,"crit_mult":1.6,"status_chance":20,"shot_type":"Projectile","shot_speed":100,"flight":100,"damage":{"Impact":5.2,"Puncture":20.8}}],
    "imageName":"dual-cestra.webp","tags":["Corpus"],
    "compTags":["PROJECTILE"]},"Dragon Nikana":{"blockingAngle":55,"comboDuration":5,"followThrough":0.7,"range":2.5,"windUp":0.5,"releaseDate":"2014-04-09","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":1,"crit_chance":22,"crit_mult":2,"status_chance":22,"damage":{"Impact":9.4,"Slash":159.8,"Puncture":18.8}},{"name":"Slam","speed":1,"crit_chance":22,"crit_mult":2,"status_chance":22,"unique":{"force_procs":["impact"]},"damage":{"Impact":376}},{"name":"Heavy Slam","speed":1,"crit_chance":22,"crit_mult":2,"status_chance":22,"damage":{"Blast":569}}],
    "imageName":"dragon-nikana.webp","tags":["Tenno"],
    "compTags":["NIKANAS_STANCE"]},"Dokrahm (Heavy Blade)":{"comboDuration":5,"range":1,"windUp":1,"releaseDate":"2018-04-20","productCategory":"Melee","category":"Melee","type":"Zaw Component","multishot":1,"attacks":[{"name":"Dokrahm Strike","speed":1,"crit_chance":18,"crit_mult":2,"status_chance":18,"damage":{"Impact":46.4,"Slash":154.5,"Puncture":108.1}}],
    "imageName":"dokrahm.webp","tags":[],
    "compTags":["HEAVY_BLADE_STANCE"]},"Dual Cleavers":{"blockingAngle":60,"comboDuration":5,"followThrough":0.5,"range":1.7,"windUp":0.7,"releaseDate":"2013-05-23","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":0.833,"crit_chance":25,"crit_mult":3,"status_chance":10,"damage":{"Impact":23.55,"Slash":109.9,"Puncture":23.55}},{"name":"Slam","speed":1,"crit_chance":25,"crit_mult":3,"status_chance":10,"unique":{"force_procs":["impact"]},"damage":{"Impact":314}},{"name":"Heavy Slam","speed":1,"crit_chance":25,"crit_mult":3,"status_chance":10,"damage":{"Blast":471}}],
    "imageName":"dual-cleavers.webp","tags":["Grineer"],
    "compTags":["DUAL_SWORDS_STANCE","DUAL CLEAVERS"]},"Dual Coda Torxica":{"noise":"Alarming","releaseDate":"2025-03-19","ammoCapacity":480,"productCategory":"Pistols","category":"Secondary","trigger":"Auto","type":"Pistol","magazineSize":160,"reloadTime":2.33,"multishot":1,"attacks":[{"name":"Normal Attack","speed":6,"crit_chance":25,"crit_mult":2.4,"status_chance":28,"shot_type":"Hit-Scan","unique":{"WITH_COND":{"speed":1.5,"ammoEff":1}},"damage":{"Slash":32.5,"Puncture":17.5}}],
    "imageName":"DualCodaTorxica.webp","tags":["Coda"],
    "compTags":[]},"Dual Decurion (Arch-mode)":{"releaseDate":"2014-11-27","ammoCapacity":0,"productCategory":"Archguns","zoomProps":[[]],"category":"Archgun","type":"Archgun","magazineSize":64,"reloadTime":0.89,"multishot":1,"attacks":[{"name":"Normal Attack","speed":10.42,"crit_chance":28,"crit_mult":2.2,"status_chance":14,"shot_type":"Projectile","shot_speed":220,"damage":{"Impact":49.5,"Puncture":30.3,"Slash":30.2}}],
    "imageName":"DualDecurion.webp","tags":[""],
    "compTags":["BATTERY"]},"Dual Decurion (Atmo-mode)":{"releaseDate":"2014-11-27","ammoCapacity":512,"productCategory":"Archguns","zoomProps":[[]],"category":"Archgun","type":"Archgun","magazineSize":64,"reloadTime":1.4,"multishot":1,"attacks":[{"name":"Normal Attack","speed":10.42,"crit_chance":28,"crit_mult":2.2,"status_chance":14,"shot_type":"Hit-Scan","damage":{"Impact":85.5,"Puncture":52.2,"Slash":52.2}}],
    "imageName":"DualDecurion.webp","tags":[""],
    "compTags":[""]},"Dual Keres":{"blockingAngle":60,"comboDuration":5,"followThrough":0.5,"range":2.5,"windUp":0.7,"releaseDate":"2018-04-20","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":1.25,"crit_chance":28,"crit_mult":2.6,"status_chance":14,"damage":{"Impact":13.8,"Slash":66.7,"Puncture":34.5}},{"name":"Slam","speed":1,"crit_chance":28,"crit_mult":2.6,"status_chance":14,"unique":{"force_procs":["impact"]},"damage":{"Impact":230}},{"name":"Heavy Slam","speed":1,"crit_chance":28,"crit_mult":2.6,"status_chance":14,"damage":{"Blast":345}}],
    "imageName":"dual-keres.webp","tags":[],
    "compTags":["DUAL_SWORDS_STANCE"]},"Dual Ether":{"blockingAngle":60,"comboDuration":5,"followThrough":0.5,"range":2.5,"windUp":0.7,"releaseDate":"2013-04-12","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":1,"crit_chance":20,"crit_mult":2,"status_chance":28,"damage":{"Impact":27,"Slash":126,"Puncture":27}},{"name":"Slam","speed":1,"crit_chance":20,"crit_mult":2,"status_chance":28,"unique":{"force_procs":["impact"]},"damage":{"Impact":360}},{"name":"Heavy Slam","speed":1,"crit_chance":20,"crit_mult":2,"status_chance":28,"damage":{"Blast":540}}],
    "imageName":"dual-ether.webp","tags":["Tenno"],
    "compTags":["DUAL_SWORDS_STANCE"]},"Dual Heat Swords":{"blockingAngle":60,"comboDuration":5,"followThrough":0.5,"range":2.5,"windUp":0.7,"releaseDate":"2013-02-08","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":0.917,"crit_chance":5,"crit_mult":1.5,"status_chance":20,"damage":{"Impact":22.05,"Slash":102.9,"Puncture":22.05}},{"name":"Slam","speed":1,"crit_chance":5,"crit_mult":1.5,"status_chance":20,"unique":{"force_procs":["heat"]},"damage":{"Heat":294}},{"name":"Heavy Slam","speed":1,"crit_chance":5,"crit_mult":1.5,"status_chance":20,"damage":{"Heat":441}}],
    "imageName":"dual-heat-swords.webp","tags":["Tenno"],
    "compTags":["DUAL_SWORDS_STANCE"]},"Dual Kamas Prime":{"blockingAngle":60,"comboDuration":5,"followThrough":0.5,"range":2.4000001,"windUp":0.7,"releaseDate":"2015-10-06","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":1.17,"crit_chance":20,"crit_mult":2,"status_chance":25,"damage":{"Impact":8,"Slash":120,"Puncture":32}},{"name":"Slam","speed":1,"crit_chance":20,"crit_mult":2,"status_chance":25,"unique":{"force_procs":["impact"]},"damage":{"Impact":320}},{"name":"Heavy Slam","speed":1,"crit_chance":20,"crit_mult":2,"status_chance":25,"damage":{"Blast":480}}],
    "imageName":"dual-kamas-prime.webp","tags":["Prime","Vaulted"],
    "compTags":["DUAL_SWORDS_STANCE"]},"Dual Ichor":{"blockingAngle":60,"comboDuration":5,"followThrough":0.5,"range":2.3,"windUp":0.7,"releaseDate":"2013-09-13","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":1.08,"crit_chance":25,"crit_mult":3,"status_chance":15,"damage":{"Impact":19,"Slash":45,"Puncture":11,"Toxin":47}},{"name":"Incarnon Form Toxin Field","speed":1.08,"crit_chance":0,"crit_mult":1,"status_chance":50,"shot_type":"AoE","damage":{"Toxin":440},"no_headshot_mult":true},{"name":"Slam","speed":1,"crit_chance":25,"crit_mult":3,"status_chance":15,"unique":{"force_procs":["impact"]},"damage":{"Impact":244}},{"name":"Heavy Slam","speed":1,"crit_chance":25,"crit_mult":3,"status_chance":15,"damage":{"Blast":366}}],
    "imageName":"dual-ichor.webp","tags":["Infested","Incarnon"],
    "compTags":["DUAL_SWORDS_STANCE"]},"Dual Kamas":{"blockingAngle":60,"comboDuration":5,"followThrough":0.5,"range":2.4000001,"windUp":0.7,"releaseDate":"2013-11-27","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":1.17,"crit_chance":10,"crit_mult":1.5,"status_chance":15,"damage":{"Impact":4.8,"Slash":81.6,"Puncture":9.6}},{"name":"Slam","speed":1,"crit_chance":10,"crit_mult":1.5,"status_chance":15,"unique":{"force_procs":["impact"]},"damage":{"Impact":192}},{"name":"Heavy Slam","speed":1,"crit_chance":10,"crit_mult":1.5,"status_chance":15,"damage":{"Blast":288}}],
    "imageName":"dual-kamas.webp","tags":["Tenno"],
    "compTags":["DUAL_SWORDS_STANCE"]},"Dual Keres Prime":{"blockingAngle":60,"comboDuration":5,"followThrough":0.5,"range":2.5,"windUp":0.7,"releaseDate":"2022-05-21","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":1.25,"crit_chance":32,"crit_mult":2.6,"status_chance":24,"damage":{"Impact":21.6,"Slash":104.4,"Puncture":54}},{"name":"Slam","speed":1,"crit_chance":32,"crit_mult":2.6,"status_chance":24,"unique":{"force_procs":["impact"]},"damage":{"Impact":360}},{"name":"Heavy Slam","speed":1,"crit_chance":32,"crit_mult":2.6,"status_chance":24,"damage":{"Blast":540}}],
    "imageName":"dual-keres-prime.webp","tags":["Prime"],
    "compTags":["DUAL_SWORDS_STANCE"]},"Dual Raza":{"blockingAngle":60,"comboDuration":5,"followThrough":0.5,"range":2.4000001,"windUp":0.7,"releaseDate":"2015-04-09","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":0.917,"crit_chance":25,"crit_mult":3,"status_chance":10,"damage":{"Impact":11,"Slash":66,"Puncture":33}},{"name":"Slam","speed":1,"crit_chance":25,"crit_mult":3,"status_chance":10,"unique":{"force_procs":["impact"]},"damage":{"Impact":220}},{"name":"Heavy Slam","speed":1,"crit_chance":25,"crit_mult":3,"status_chance":10,"damage":{"Blast":330}}],
    "imageName":"dual-raza.webp","tags":["Tenno"],
    "compTags":["DUAL_SWORDS_STANCE"]},"Dual Zoren Prime":{"blockingAngle":60,"comboDuration":5,"followThrough":0.5,"range":2.3,"windUp":0.7,"releaseDate":"2025-02-13","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":1.25,"crit_chance":30,"crit_mult":3.2,"status_chance":22,"damage":{"Impact":7,"Slash":126,"Puncture":7}},{"name":"Slam","speed":1,"crit_chance":30,"crit_mult":3.2,"status_chance":22,"unique":{"force_procs":["impact"]},"damage":{"Impact":280}},{"name":"Heavy Slam","speed":1,"crit_chance":30,"crit_mult":3.2,"status_chance":22,"damage":{"Blast":420}}],
    "imageName":"DualZorenPrime.webp","tags":[],
    "compTags":["DUAL_SWORDS_STANCE"]},"Embolist":{"noise":"Alarming","releaseDate":"2013-09-13","productCategory":"Pistols","equipTime":1.1,"zoomProps":[[]],"category":"Secondary","trigger":"Held","type":"Pistol","magazineSize":33,"reloadTime":1.3,"multishot":1,"attacks":[{"name":"Normal Attack","speed":8,"crit_chance":3,"crit_mult":1.5,"status_chance":41,"shot_type":"Discharge","damage":{"Toxin":35}}],
    "imageName":"embolist.webp","tags":["Infested"],
    "compTags":["BEAM","AOE","EMBOLIST"]},"Ekhein":{"blockingAngle":55,"comboDuration":5,"followThrough":0.4,"range":2.8,"windUp":1.2,"releaseDate":"2023-12-14","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":0.767,"crit_chance":30,"crit_mult":2.4,"status_chance":15,"damage":{"Impact":340}},{"name":"Heavy Attack","speed":0.767,"crit_chance":30,"crit_mult":2.4,"status_chance":15,"unique":{"base":0.8,"speed":0.2},"damage":{"Impact":340}},{"name":"Slam","speed":1,"crit_chance":30,"crit_mult":2.4,"status_chance":15,"damage":{"Impact":680}},{"name":"Heavy Slam","speed":1,"crit_chance":30,"crit_mult":2.4,"status_chance":15,"damage":{"Blast":1020}}],
    "imageName":"Ekhein.webp","tags":[],
    "compTags":["HAMMERS_STANCE"]},"EFV-5 Jupiter":{"noise":"Alarming","releaseDate":"2025-03-19","ammoCapacity":540,"productCategory":"LongGuns","category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":65,"reloadTime":2.5,"multishot":1,"attacks":[{"name":"Auto","speed":7.833334,"crit_chance":21,"crit_mult":2.3,"status_chance":25,"damage":{"Slash":23,"Puncture":31,"Corrosive":7}},{"name":"Buckshot","speed":7.833334,"crit_chance":21,"crit_mult":2.3,"status_chance":5.73,"damage":{"Slash":35,"Puncture":57,"Corrosive":35}}],
    "imageName":"EFV-5Jupiter.webp","tags":[],
    "compTags":["ASSAULT_AMMO"]},"Dual Toxocyst":{"noise":"Alarming","releaseDate":"2016-03-04","ammoCapacity":60,"productCategory":"Pistols","category":"Secondary","trigger":"Semi","type":"Pistol","magazineSize":12,"reloadTime":2.35,"multishot":1,"attacks":[{"name":"Normal Attack","speed":1,"crit_chance":5,"crit_mult":2,"status_chance":37,"shot_type":"Hit-Scan","unique":{"WITH_COND":{"speed":1.5,"ammoEff":1}},"damage":{"Impact":7.5,"Slash":7.5,"Puncture":60}},{"name":"Incarnon Form","speed":4.5,"crit_chance":11,"crit_mult":3,"status_chance":43,"shot_type":"Hit-Scan","unique":{"WITH_COND":{"speed_mult":1.5}},"damage":{"Impact":15,"Slash":22.5,"Puncture":37.5}}],
    "imageName":"dual-toxocyst.webp","tags":["Infested","Incarnon"],
    "compTags":[]},"Dual Viciss":{"blockingAngle":60,"comboDuration":5,"followThrough":0.5,"range":2.4,"windUp":0.7,"productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":1,"crit_chance":23,"crit_mult":2.1,"status_chance":29,"damage":{"Slash":51,"Puncture":51,"Gas":153}},{"name":"Slam","speed":1,"crit_chance":23,"crit_mult":2.1,"status_chance":29,"damage":{"Impact":510}},{"name":"Heavy Slam","speed":1,"crit_chance":23,"crit_mult":2.1,"status_chance":29,"damage":{"Blast":765}}],
    "imageName":"DualViciss.webp","tags":[""],
    "compTags":["DUAL_SWORDS_STANCE"]},"Dual Skana":{"blockingAngle":60,"comboDuration":5,"followThrough":0.5,"range":2.5,"windUp":0.7,"releaseDate":"2012-10-25","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":0.833,"crit_chance":5,"crit_mult":1.5,"status_chance":16,"damage":{"Impact":18,"Slash":84,"Puncture":18}},{"name":"Slam","speed":1,"crit_chance":5,"crit_mult":1.5,"status_chance":16,"unique":{"force_procs":["impact"]},"damage":{"Impact":240}},{"name":"Heavy Slam","speed":1,"crit_chance":5,"crit_mult":1.5,"status_chance":16,"damage":{"Blast":360}}],
    "imageName":"dual-skana.webp","tags":["Tenno"],
    "compTags":["DUAL_SWORDS_STANCE"]},"Edun":{"blockingAngle":55,"comboDuration":5,"followThrough":0.6,"range":3,"windUp":1,"productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":1,"crit_chance":34,"crit_mult":2.6,"status_chance":20,"damage":{"Impact":44,"Puncture":110,"Slash":66}},{"name":"Heavy Attack Throws","speed":1,"crit_chance":34,"crit_mult":2.6,"status_chance":20,"damage":{"Impact":101.3,"Puncture":233.3,"Slash":145.4}},{"name":"Heavy Attack Throws AoE","speed":1,"crit_chance":34,"crit_mult":2.6,"status_chance":20,"shot_type":"AoE","damage":{"Blast":400},"no_headshot_mult":true},{"name":"Slam","speed":1,"crit_chance":34,"crit_mult":2.6,"status_chance":20,"unique":{"force_procs":["impact"]},"damage":{"Impact":440}},{"name":"Heavy Slam","speed":1,"crit_chance":34,"crit_mult":2.6,"status_chance":20,"damage":{"Blast":660}}],
    "imageName":"edun.webp","tags":[""],
    "compTags":["POLEARMS_STANCE"]},"EFV-8 Mars":{"noise":"Alarming","releaseDate":"2025-03-19","ammoCapacity":210,"productCategory":"Pistols","category":"Secondary","trigger":"Semi-Auto","type":"Pistol","magazineSize":15,"reloadTime":1.667,"multishot":1,"attacks":[{"name":"Normal Attack","speed":6.5,"crit_chance":27,"crit_mult":2.1,"status_chance":17,"damage":{"Impact":20,"Puncture":55}},{"name":"Alt-Fire","speed":6.5,"crit_chance":27,"crit_mult":2.1,"status_chance":33,"damage":{"Corrosive":35}},{"name":"Alt-Fire AoE","speed":6.5,"crit_chance":27,"crit_mult":2.1,"status_chance":33,"shot_type":"AoE","damage":{"Corrosive":313},"no_headshot_mult":true}],
    "imageName":"EFV-8Mars.webp","tags":[],
    "compTags":[""]},"Dual Zoren":{"blockingAngle":60,"comboDuration":5,"followThrough":0.5,"range":2.3,"windUp":0.7,"releaseDate":"2013-01-29","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":1.17,"crit_chance":25,"crit_mult":3,"status_chance":5,"damage":{"Impact":3.5,"Slash":63,"Puncture":3.5}},{"name":"Slam","speed":1,"crit_chance":25,"crit_mult":3,"status_chance":5,"unique":{"force_procs":["impact"]},"damage":{"Impact":140}},{"name":"Heavy Slam","speed":1,"crit_chance":25,"crit_mult":3,"status_chance":5,"damage":{"Blast":210}}],
    "imageName":"dual-zoren.webp","tags":["Tenno"],
    "compTags":["DUAL_SWORDS_STANCE"]},"Endura":{"blockingAngle":60,"comboDuration":5,"followThrough":0.7,"range":2.5,"windUp":0.5,"releaseDate":"2017-05-24","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":0.917,"crit_chance":10,"crit_mult":2,"status_chance":36,"damage":{"Impact":10,"Slash":50,"Puncture":140}},{"name":"Slam","speed":1,"crit_chance":10,"crit_mult":2,"status_chance":36,"unique":{"force_procs":["impact"]},"damage":{"Impact":400}},{"name":"Heavy Slam","speed":1,"crit_chance":10,"crit_mult":2,"status_chance":36,"damage":{"Blast":600}}],
    "imageName":"endura.webp","tags":["Tenno"],
    "compTags":["RAPIER_STANCE"]},"Ether Reaper":{"blockingAngle":60,"comboDuration":5,"followThrough":0.6,"range":2.7,"windUp":1,"releaseDate":"2013-09-13","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":1.08,"crit_chance":20,"crit_mult":2,"status_chance":20,"damage":{"Impact":27,"Slash":126,"Puncture":27}},{"name":"Slam","speed":1,"crit_chance":20,"crit_mult":2,"status_chance":20,"unique":{"force_procs":["impact"]},"damage":{"Impact":360}},{"name":"Heavy Slam","speed":1,"crit_chance":20,"crit_mult":2,"status_chance":20,"damage":{"Blast":540}}],
    "imageName":"ether-reaper.webp","tags":["Tenno"],
    "compTags":["SCYTHES_STANCE"]},"Ether Sword":{"blockingAngle":55,"comboDuration":5,"followThrough":0.6,"range":2.5,"windUp":0.6,"releaseDate":"2013-05-23","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":1,"crit_chance":10,"crit_mult":1.5,"status_chance":34,"damage":{"Impact":28.8,"Slash":134.4,"Puncture":28.8}},{"name":"Slam","speed":1,"crit_chance":10,"crit_mult":1.5,"status_chance":34,"unique":{"force_procs":["radiation","impact"]},"damage":{"Radiation":384}},{"name":"Heavy Slam","speed":1,"crit_chance":10,"crit_mult":1.5,"status_chance":34,"damage":{"Radiation":576}}],
    "imageName":"ether-sword.webp","tags":[],
    "compTags":["SWORDS_STANCE"]},"Epitaph Prime":{"noise":"Alarming","releaseDate":"2024-08-21","ammoCapacity":40,"productCategory":"Pistols","zoomProps":[[]],"category":"Secondary","trigger":"Charge","type":"Pistol","magazineSize":1,"reloadTime":0.6,"multishot":1,"attacks":[{"name":"Charged Shot","speed":1.75,"crit_chance":50,"crit_mult":3,"status_chance":14,"shot_type":"Projectile","shot_speed":200,"flight":200,"unique":{"force_procs":["impact"]},"damage":{"Impact":126,"Slash":141.75,"Puncture":47.25}},{"name":"Uncharged Direct Hit","speed":1.75,"crit_chance":4,"crit_mult":1.8,"status_chance":50,"shot_type":"Projectile","shot_speed":50,"flight":50,"unique":{"force_procs":["impact"]},"damage":{"Impact":40,"Slash":30,"Puncture":30}},{"name":"Uncharged AoE","speed":1.75,"crit_chance":0,"crit_mult":1,"status_chance":50,"shot_type":"AoE","unique":{"force_procs":["cold"]},"damage":{"Blast":30},"no_headshot_mult":true}],
    "imageName":"EpitaphPrime.webp","tags":[],
    "compTags":["PROJECTILE","SINGLESHOT","AOE"],
    "comb":[[1,2]]},"Euphona Prime":{"noise":"Alarming","releaseDate":"2017-02-28","ammoCapacity":40,"productCategory":"Pistols","zoomProps":[[], []],"category":"Secondary","trigger":"Semi","type":"Pistol","magazineSize":5,"reloadTime":2,"multishot":1,"attacks":[{"name":"Slug","speed":1.5,"crit_chance":30,"crit_mult":2.5,"status_chance":2,"shot_type":"Projectile","shot_speed":500,"flight":500,"damage":{"Impact":292.5,"Slash":16.25,"Puncture":16.25}},{"name":"Buckshot","speed":1.5,"crit_chance":2,"crit_mult":2,"status_chance":9,"shot_type":"Hit-Scan","damage":{"Impact":4.4,"Slash":66,"Puncture":17.6},"falloff":{"start":6,"end":12,"reduction":0.9886}}],
    "imageName":"euphona-prime.webp","tags":["Prime","Vaulted"],
    "compTags":["PROJECTILE","SECONDARYSHOTGUN","SINGLESHOT"]},"Ether Daggers":{"blockingAngle":50,"comboDuration":5,"followThrough":0.8,"range":1.75,"windUp":0.5,"releaseDate":"2013-04-12","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":0.833,"crit_chance":10,"crit_mult":1.8,"status_chance":30,"damage":{"Impact":33.6,"Slash":156.8,"Puncture":33.6}},{"name":"Slam","speed":1,"crit_chance":10,"crit_mult":1.8,"status_chance":30,"unique":{"force_procs":["impact"]},"damage":{"Impact":448}},{"name":"Heavy Slam","speed":1,"crit_chance":10,"crit_mult":1.8,"status_chance":30,"damage":{"Blast":672}}],
    "imageName":"ether-daggers.webp","tags":["Tenno"],
    "compTags":["DUAL_DAGGERS_STANCE"]},"Evensong":{"noise":"Silent","releaseDate":"2024-06-18","ammoCapacity":72,"productCategory":"LongGuns","category":"Primary","trigger":"Charge","type":"Rifle","magazineSize":1,"reloadTime":0.6,"multishot":1,"attacks":[{"name":"Quick Shot","speed":1,"crit_chance":25,"crit_mult":2.2,"status_chance":38,"shot_type":"Projectile","shot_speed":85,"damage":{"Slash":227.5,"Puncture":97.5}},{"name":"Charged Shot","speed":1,"crit_chance":25,"crit_mult":2.2,"status_chance":38,"shot_type":"Projectile","shot_speed":100,"damage":{"Slash":350,"Puncture":150}},{"name":"Charged Radial Attack","speed":1,"crit_chance":25,"crit_mult":2.2,"status_chance":38,"shot_type":"Projectile","damage":{"Puncture":45,"Slash":105}}],
    "imageName":"Evensong.webp","tags":[],
    "compTags":["PROJECTILE"],
    "comb":[[1,2]]},"Enkaus":{"noise":"Alarming","releaseDate":"2026-03-25","ammoCapacity":60,"productCategory":"LongGuns","category":"Primary","trigger":"Held","type":"Rifle","magazineSize":60,"reloadTime":2.2,"multishot":1,"attacks":[{"name":"Primary","speed":12,"crit_chance":16,"crit_mult":1.8,"status_chance":32,"shot_type":"Discharge","damage":{"Puncture":8,"Corrosive":20}},{"name":"Alternate Fire","speed":2,"crit_chance":16,"crit_mult":1.8,"status_chance":32,"damage":{"Puncture":4,"Corrosive":12}},{"name":"Radial","speed":2,"crit_chance":16,"crit_mult":1.8,"status_chance":32,"shot_type":"AoE","damage":{"Puncture":4,"Corrosive":10},"no_headshot_mult":true}],
    "imageName":"Enkaus.webp","tags":[],
    "compTags":["PROJECTILE","BEAM","ASSAULT_AMMO"]},"Exalted Blade (Excalibur)":{"blockingAngle":60,"comboDuration":5,"followThrough":1,"range":2.8,"windUp":0.6,"releaseDate":"2018-06-15","productCategory":"Melee","category":"Melee","type":"Exalted Weapon","multishot":1,"attacks":[{"name":"Normal Attack","speed":0.83,"crit_chance":15,"crit_mult":2,"status_chance":15,"unique":{"speed":0.1,"base":0.1},"damage":{"Impact":37.5,"Slash":175,"Puncture":37.5}},{"name":"Slam","speed":1,"crit_chance":15,"crit_mult":2,"status_chance":15,"damage":{"Impact":500}},{"name":"Heavy Slam","speed":1,"crit_chance":15,"crit_mult":2,"status_chance":15,"damage":{"Blast":750}}],
    "imageName":"ExaltedBlade.webp","tags":[],
    "compTags":["EXALTED_BLADE_STANCE","POWER_WEAPON","EXCALIBUR"]},"Epitaph":{"noise":"Alarming","releaseDate":"2021-04-13","ammoCapacity":40,"productCategory":"Pistols","zoomProps":[[]],"category":"Secondary","trigger":"Charge","type":"Pistol","magazineSize":1,"reloadTime":0.6,"multishot":1,"attacks":[{"name":"Charged Shot","speed":1.5,"crit_chance":48,"crit_mult":2.6,"status_chance":4,"shot_type":"Projectile","shot_speed":200,"flight":200,"unique":{"force_procs":["impact"]},"damage":{"Impact":120,"Slash":135,"Puncture":45}},{"name":"Uncharged Direct Hit","speed":1.5,"crit_chance":2,"crit_mult":1.2,"status_chance":50,"shot_type":"Projectile","shot_speed":50,"flight":50,"unique":{"force_procs":["impact"]},"damage":{"Impact":40,"Slash":30,"Puncture":30}},{"name":"Uncharged AoE","speed":1.5,"crit_chance":0,"crit_mult":1,"status_chance":50,"shot_type":"AoE","unique":{"force_procs":["cold"]},"damage":{"Blast":20},"falloff":{"start":0,"end":8,"reduction":0.8},"no_headshot_mult":true}],
    "imageName":"epitaph.webp","tags":[],
    "compTags":["PROJECTILE","SINGLESHOT","AOE"],
    "comb":[[1,2]]},"Falcor":{"blockingAngle":55,"comboDuration":5,"followThrough":0.7,"range":1.3,"windUp":1.2,"releaseDate":"2018-10-12","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":0.833,"crit_chance":12,"crit_mult":1.6,"status_chance":34,"damage":{"Impact":36,"Slash":92,"Puncture":18,"Electricity":84}},{"name":"Throw","speed":0.833,"crit_chance":14,"crit_mult":1.8,"status_chance":36,"shot_type":"Thrown","shot_speed":25,"flight":25,"unique":{"force_procs":["impact"]},"damage":{"Impact":20,"Slash":80,"Puncture":40,"Electricity":110}},{"name":"Throw Bounce Explosion","speed":0.833,"crit_chance":14,"crit_mult":1.8,"status_chance":36,"shot_type":"AoE","damage":{"Electricity":345},"falloff":{"start":0,"end":6,"reduction":0.4},"no_headshot_mult":true},{"name":"Throw Recall Explosion","speed":0.833,"crit_chance":14,"crit_mult":1.8,"status_chance":36,"shot_type":"AoE","unique":{"force_procs":["electricity"]},"damage":{"Electricity":690},"falloff":{"start":0,"end":6,"reduction":0},"no_headshot_mult":true},{"name":"Charged Throw","speed":0.833,"crit_chance":16,"crit_mult":2,"status_chance":38,"shot_type":"Thrown","shot_speed":35,"flight":35,"unique":{"force_procs":["electricity"]},"damage":{"Impact":56,"Slash":230,"Puncture":20,"Electricity":200}},{"name":"Charged Throw Bounce Explosion","speed":0.833,"crit_chance":16,"crit_mult":2,"status_chance":38,"shot_type":"AoE","damage":{"Electricity":690},"falloff":{"start":0,"end":6,"reduction":0.4},"no_headshot_mult":true},{"name":"Charged Throw Recall Explosion","speed":0.833,"crit_chance":16,"crit_mult":2,"status_chance":38,"shot_type":"AoE","unique":{"force_procs":["electricity"]},"damage":{"Electricity":1380},"falloff":{"start":0,"end":6,"reduction":0},"no_headshot_mult":true},{"name":"Slam","speed":1,"crit_chance":12,"crit_mult":1.6,"status_chance":34,"unique":{"force_procs":["impact"]},"damage":{"Electricity":460}},{"name":"Heavy Slam","speed":1,"crit_chance":12,"crit_mult":1.6,"status_chance":34,"damage":{"Electricity":690}}],
    "imageName":"falcor.webp","tags":["Corpus"],
    "compTags":["GLAIVES_STANCE"],
    "comb":[[1,2],
    [4,5]]},"Fluctus (Arch-mode)":{"releaseDate":"2014-12-19","ammoCapacity":0,"productCategory":"Archguns","zoomProps":[[]],"category":"Archgun","type":"Archgun","magazineSize":40,"reloadTime":5,"multishot":1,"attacks":[{"name":"Normal Attack","speed":5,"crit_chance":22,"crit_mult":2,"status_chance":16,"shot_type":"Projectile","shot_speed":300,"unique":{"force_procs":["impact"]},"damage":{"Impact":50,"Puncture":25,"Slash":175}}],
    "imageName":"fluctus.webp","tags":[""],
    "compTags":["BATTERY"]},"Fluctus (Atmo-mode)":{"releaseDate":"2018-12-18","ammoCapacity":160,"productCategory":"Archguns","zoomProps":[[]],"category":"Archgun","type":"Archgun","magazineSize":40,"reloadTime":3,"multishot":1,"attacks":[{"name":"Normal Attack","speed":5,"crit_chance":22,"crit_mult":2,"status_chance":16,"shot_type":"Projectile","shot_speed":75,"unique":{"force_procs":["impact"]},"damage":{"Impact":50,"Puncture":25,"Slash":175}}],
    "imageName":"fluctus.webp","tags":[""],
    "compTags":[""]},"Exergis":{"noise":"Alarming","releaseDate":"2018-12-18","ammoCapacity":47,"productCategory":"LongGuns","zoomProps":[[]],"category":"Primary","trigger":"Semi","type":"Shotgun","magazineSize":1,"reloadTime":1.6,"multishot":3,"attacks":[{"name":"Normal Attack","speed":3.33,"crit_chance":8,"crit_mult":1.4,"status_chance":36,"shot_type":"Projectile","shot_speed":100,"flight":100,"damage":{"Impact":20,"Slash":260,"Puncture":120,"Radiation":140},"falloff":{"start":30,"end":60,"reduction":0.508}}],
    "imageName":"exergis.webp","tags":[],
    "compTags":["PROJECTILE","SINGLESHOT"]},"Fang Prime":{"blockingAngle":50,"comboDuration":5,"followThrough":0.8,"range":1.75,"windUp":0.5,"releaseDate":"2013-07-13","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":1,"crit_chance":26,"crit_mult":2.6,"status_chance":26,"damage":{"Impact":26.7,"Slash":26.7,"Puncture":124.6}},{"name":"Slam","speed":1,"crit_chance":26,"crit_mult":2.6,"status_chance":26,"unique":{"force_procs":["impact"]},"damage":{"Impact":356}},{"name":"Heavy Slam","speed":1,"crit_chance":26,"crit_mult":2.6,"status_chance":26,"damage":{"Blast":534}}],
    "imageName":"fang-prime.webp","tags":["Prime","Never Vaulted"],
    "compTags":["DUAL_DAGGERS_STANCE"]},"Fang":{"blockingAngle":50,"comboDuration":5,"followThrough":0.8,"range":1.65,"windUp":0.5,"releaseDate":"2013-03-18","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":0.917,"crit_chance":8,"crit_mult":1.5,"status_chance":16,"damage":{"Impact":16.2,"Slash":16.2,"Puncture":75.6}},{"name":"Slam","speed":1,"crit_chance":8,"crit_mult":1.5,"status_chance":16,"unique":{"force_procs":["impact"]},"damage":{"Impact":216}},{"name":"Heavy Slam","speed":1,"crit_chance":8,"crit_mult":1.5,"status_chance":16,"damage":{"Blast":324}}],
    "imageName":"fang.webp","tags":["Tenno"],
    "compTags":["DUAL_DAGGERS_STANCE"]},"Ferrox":{"noise":"Alarming","releaseDate":"2017-03-09","ammoCapacity":100,"productCategory":"LongGuns","category":"Primary","trigger":"Charge","type":"Rifle","magazineSize":10,"reloadTime":1.8,"multishot":1,"attacks":[{"name":"Charged Shot","speed":1.33,"crit_chance":32,"crit_mult":2.8,"status_chance":10,"shot_type":"Hit-Scan","damage":{"Impact":35,"Slash":70,"Puncture":245}},{"name":"Radial Attack","speed":1.33,"crit_chance":32,"crit_mult":2.8,"status_chance":10,"shot_type":"AoE","damage":{"Impact":100},"falloff":{"start":0,"end":3.6,"reduction":0.4},"no_headshot_mult":true},{"name":"Spear Throw","speed":1,"crit_chance":4,"crit_mult":2,"status_chance":33,"shot_type":"Projectile","shot_speed":90,"flight":90,"damage":{"Impact":35,"Slash":10,"Puncture":5}},{"name":"Attraction Field","speed":0.5,"crit_chance":4,"crit_mult":2,"status_chance":50,"shot_type":"AoE","damage":{"Electricity":150},"no_headshot_mult":true}],
    "imageName":"ferrox.webp","tags":["Corpus"],
    "compTags":["PROJECTILE","SNIPER_AMMO"],
    "comb":[[0,1]]},"Felarx":{"noise":"Alarming","releaseDate":"2022-06-09","ammoCapacity":60,"productCategory":"LongGuns","zoomProps":[[]],"category":"Primary","trigger":"Auto","type":"Shotgun","magazineSize":6,"reloadTime":3.7,"multishot":4,"attacks":[{"name":"Normal Attack","speed":3,"crit_chance":20,"crit_mult":2,"status_chance":5.5,"shot_type":"Projectile","shot_speed":100,"flight":100,"damage":{"Impact":38,"Slash":83.6,"Puncture":68.4},"falloff":{"start":14,"end":28,"reduction":0.9947}},{"name":"Incarnon Mode","speed":1.5,"crit_chance":20,"crit_mult":3,"status_chance":20,"shot_type":"Projectile","shot_speed":160,"flight":160,"unique":{"force_procs":["impact"]},"damage":{"Impact":200,"Radiation":400}}],
    "imageName":"felarx.webp","tags":["Zariman","Incarnon"],
    "compTags":["PROJECTILE"]},"Fragor":{"blockingAngle":50,"comboDuration":5,"followThrough":0.4,"range":2.5,"windUp":1.2,"releaseDate":"2013-01-14","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":0.833,"crit_chance":20,"crit_mult":2,"status_chance":10,"damage":{"Impact":140,"Slash":30,"Puncture":30}},{"name":"Slam","speed":1,"crit_chance":20,"crit_mult":2,"status_chance":10,"damage":{"Impact":400}},{"name":"Heavy Slam","speed":1,"crit_chance":20,"crit_mult":2,"status_chance":10,"damage":{"Blast":600}}],
    "imageName":"fragor.webp","tags":["Tenno"],
    "compTags":["HAMMERS_STANCE"]},"Flux Rifle":{"noise":"Alarming","releaseDate":"2013-05-23","ammoCapacity":550,"productCategory":"LongGuns","zoomProps":[[]],"category":"Primary","trigger":"Held","type":"Rifle","magazineSize":50,"reloadTime":2.25,"multishot":1,"attacks":[{"name":"Normal Attack","speed":12,"crit_chance":10,"crit_mult":2,"status_chance":24,"shot_type":"Discharge","damage":{"Slash":17.16,"Puncture":4.84}}],
    "imageName":"flux-rifle.webp","tags":["Corpus"],
    "compTags":["BEAM","ASSAULT_AMMO","FLUX"]},"Fragor Prime":{"blockingAngle":50,"comboDuration":5,"followThrough":0.4,"range":2.6,"windUp":1.2,"releaseDate":"2016-05-17","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":0.8,"crit_chance":40,"crit_mult":2.5,"status_chance":18,"damage":{"Impact":189,"Slash":40.5,"Puncture":40.5}},{"name":"Slam","speed":1,"crit_chance":40,"crit_mult":2.5,"status_chance":18,"damage":{"Impact":540}},{"name":"Heavy Slam","speed":1,"crit_chance":40,"crit_mult":2.5,"status_chance":18,"damage":{"Blast":810}}],
    "imageName":"fragor-prime.webp","tags":["Prime"],
    "compTags":["HAMMERS_STANCE"]},"Furis":{"noise":"Alarming","releaseDate":"2012-10-25","productCategory":"Pistols","category":"Secondary","trigger":"Auto","type":"Pistol","magazineSize":35,"reloadTime":1.4,"multishot":1,"attacks":[{"name":"Normal Attack","speed":10,"crit_chance":5,"crit_mult":2,"status_chance":12,"shot_type":"Hit-Scan","damage":{"Impact":3,"Slash":3,"Puncture":14}},{"name":"Incarnon Form","speed":12,"crit_chance":26,"crit_mult":3.4,"status_chance":24,"damage":{"Heat":100}}],
    "imageName":"furis.webp","tags":["Tenno","Incarnon"],
    "compTags":["FURIS"]},"Fusilai":{"noise":"Silent","releaseDate":"2017-10-12","ammoCapacity":72,"productCategory":"Pistols","category":"Secondary","trigger":"Auto","type":"Throwing","magazineSize":6,"reloadTime":0.8,"multishot":1,"attacks":[{"name":"Full Auto Mode","speed":2.83,"crit_chance":23,"crit_mult":1.7,"status_chance":29,"shot_type":"Projectile","shot_speed":50,"flight":50,"damage":{"Slash":46.2,"Puncture":30.8}},{"name":"Semi-Auto Mode","speed":1.5,"crit_chance":3,"crit_mult":1.5,"status_chance":12.3,"shot_type":"Projectile","shot_speed":50,"flight":50,"damage":{"Slash":46.2,"Puncture":30.8}}],
    "imageName":"fusilai.webp","tags":["Tenno"],
    "compTags":["PROJECTILE","THROWN"]},"Galariak Prime":{"blockingAngle":60,"comboDuration":5,"followThrough":0.6,"range":2.8,"windUp":1,"releaseDate":"2025-12-10","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":1.08,"crit_chance":19,"crit_mult":2.5,"status_chance":32,"damage":{"Impact":30.3,"Slash":13.2,"Puncture":190.5}},{"name":"Slam","speed":1,"crit_chance":19,"crit_mult":2.5,"status_chance":32,"unique":{"force_procs":["impact"]},"damage":{"Impact":702}},{"name":"Heavy Slam","speed":1,"crit_chance":19,"crit_mult":2.5,"status_chance":32,"damage":{"Blast":1170}}],
    "imageName":"GalariakPrime.webp","tags":["Prime"],
    "compTags":["SCYTHES_STANCE"]},"Fulmin":{"noise":"Silent","releaseDate":"2019-05-22","ammoCapacity":60,"productCategory":"LongGuns","equipTime":1.1,"zoomProps":[[]],"category":"Primary","trigger":"Semi","type":"Rifle","magazineSize":60,"reloadTime":3,"multishot":1,"attacks":[{"name":"Full Auto Mode","speed":9.33,"crit_chance":28,"crit_mult":2.4,"status_chance":10,"shot_type":"Hit-Scan","damage":{"Puncture":8,"Electricity":25}},{"name":"Semi-Auto Mode","speed":2.17,"crit_chance":30,"crit_mult":2.2,"status_chance":16,"shot_type":"Projectile","shot_speed":100,"flight":100,"unique":{"force_procs":["impact"]},"damage":{"Impact":100,"Electricity":400},"falloff":{"start":10,"end":20,"reduction":0.6666},"no_headshot_mult":true}],
    "imageName":"fulmin.webp","tags":[],
    "compTags":["ASSAULT_AMMO","PROJECTILE"]},"Furax":{"blockingAngle":50,"comboDuration":5,"followThrough":0.9,"range":1.25,"windUp":0.6,"releaseDate":"2012-10-25","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":1,"crit_chance":25,"crit_mult":2.3,"status_chance":11,"damage":{"Impact":94.5,"Slash":20.2,"Puncture":20.3}},{"name":"Slam","speed":1,"crit_chance":25,"crit_mult":2.3,"status_chance":11,"unique":{"force_procs":["impact"]},"damage":{"Impact":270}},{"name":"Heavy Slam","speed":1,"crit_chance":25,"crit_mult":2.3,"status_chance":11,"damage":{"Blast":405}}],
    "imageName":"furax.webp","tags":["Grineer","Incarnon"],
    "compTags":["FIST_STANCE"]},"Galatine":{"blockingAngle":55,"comboDuration":5,"followThrough":0.6,"range":3,"windUp":1.1,"releaseDate":"2013-09-27","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":1,"crit_chance":10,"crit_mult":2,"status_chance":20,"damage":{"Impact":4.55,"Slash":172.9,"Puncture":4.55}},{"name":"Slam","speed":1,"crit_chance":10,"crit_mult":2,"status_chance":20,"unique":{"force_procs":["impact"]},"damage":{"Impact":364}},{"name":"Heavy Slam","speed":1,"crit_chance":10,"crit_mult":2,"status_chance":20,"damage":{"Blast":546}}],
    "imageName":"galatine.webp","tags":["Tenno"],
    "compTags":["HEAVY_BLADE_STANCE"]},"Fulmin Prime":{"noise":"Silent","releaseDate":"2023-07-27","ammoCapacity":60,"productCategory":"LongGuns","zoomProps":[[]],"category":"Primary","trigger":"Semi","type":"Rifle","magazineSize":80,"reloadTime":2.7,"multishot":1,"attacks":[{"name":"Full Auto Mode","speed":9.33,"crit_chance":34,"crit_mult":2.4,"status_chance":10,"shot_type":"Hit-Scan","damage":{"Puncture":8,"Electricity":25}},{"name":"Semi-Auto Mode","speed":2.17,"crit_chance":30,"crit_mult":2.2,"status_chance":22,"shot_type":"Projectile","shot_speed":100,"flight":100,"unique":{"force_procs":["impact"]},"damage":{"Impact":110,"Electricity":440},"no_headshot_mult":true}],
    "imageName":"FulminPrime.webp","tags":[],
    "compTags":["ASSAULT_AMMO","PROJECTILE"]},"Galatine Prime":{"blockingAngle":55,"comboDuration":5,"followThrough":0.6,"range":3,"windUp":1.1,"releaseDate":"2016-08-23","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":1,"crit_chance":26,"crit_mult":2,"status_chance":26,"damage":{"Impact":7,"Slash":266,"Puncture":7}},{"name":"Slam","speed":1,"crit_chance":26,"crit_mult":2,"status_chance":26,"unique":{"force_procs":["impact"]},"damage":{"Impact":560}},{"name":"Heavy Slam","speed":1,"crit_chance":26,"crit_mult":2,"status_chance":26,"damage":{"Blast":840}}],
    "imageName":"galatine-prime.webp","tags":["Prime","Vaulted"],
    "compTags":["HEAVY_BLADE_STANCE"]},"Furax Wraith":{"blockingAngle":50,"comboDuration":5,"followThrough":0.9,"range":1.25,"windUp":0.6,"releaseDate":"2016-04-29","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":1.08,"crit_chance":30,"crit_mult":2.7,"status_chance":15,"damage":{"Impact":97.3,"Slash":20.8,"Puncture":20.9}},{"name":"Slam","speed":1,"crit_chance":30,"crit_mult":2.7,"status_chance":15,"unique":{"force_procs":["impact"]},"damage":{"Impact":278}},{"name":"Heavy Slam","speed":1,"crit_chance":30,"crit_mult":2.7,"status_chance":15,"damage":{"Blast":417}}],
    "imageName":"furax-wraith.webp","tags":["Incarnon"],
    "compTags":["FIST_STANCE"]},"Gazal Machete":{"blockingAngle":55,"comboDuration":5,"followThrough":0.7,"range":2.6,"windUp":0.7,"releaseDate":"2016-10-05","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":1,"crit_chance":10,"crit_mult":2,"status_chance":30,"damage":{"Impact":17.8,"Slash":133.5,"Puncture":26.7}},{"name":"Slam","speed":1,"crit_chance":10,"crit_mult":2,"status_chance":30,"unique":{"force_procs":["impact"]},"damage":{"Impact":356}},{"name":"Heavy Slam","speed":1,"crit_chance":10,"crit_mult":2,"status_chance":30,"damage":{"Blast":534}}],
    "imageName":"gazal-machete.webp","tags":["Tenno"],
    "compTags":["MACHETES_STANCE"]},"Garuda Talons":{"blockingAngle":60,"comboDuration":5,"followThrough":0.8,"range":2.2,"windUp":0.6,"releaseDate":"2018-11-08","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":1,"crit_chance":20,"crit_mult":2,"status_chance":36,"damage":{"Impact":19.84,"Slash":173.6,"Puncture":54.56}},{"name":"Slam","speed":1,"crit_chance":20,"crit_mult":2,"status_chance":36,"damage":{"Impact":496}},{"name":"Heavy Slam","speed":1,"crit_chance":20,"crit_mult":2,"status_chance":36,"damage":{"Blast":744}}],
    "imageName":"GarudaTalons.webp","tags":[],
    "compTags":["CLAWS_STANCE"]},"Gaze (Secondary)":{"ammoCapacity":200,"productCategory":"","category":"Secondary","type":"Kitgun","magazineSize":0,"reloadTime":2,"multishot":1,"attacks":[{"name":"Normal Attack","speed":12,"crit_chance":0,"crit_mult":0,"status_chance":0,"shot_type":"Discharge","damage":{"Puncture":7,"Radiation":11}}],
    "imageName":"gaze.webp","tags":["secondary-beam"],
    "compTags":["BEAM"]},"Garuda Prime Talons":{"blockingAngle":60,"comboDuration":5,"followThrough":0.8,"range":2.2,"windUp":0.6,"releaseDate":"2022-03-28","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":1,"crit_chance":35,"crit_mult":2,"status_chance":36,"damage":{"Impact":14,"Slash":238,"Puncture":28}},{"name":"Slam","speed":1,"crit_chance":35,"crit_mult":2,"status_chance":36,"damage":{"Impact":560}},{"name":"Heavy Slam","speed":1,"crit_chance":35,"crit_mult":2,"status_chance":36,"damage":{"Blast":840}}],
    "imageName":"GarudaPrimeTalons.webp","tags":[],
    "compTags":["CLAWS_STANCE"]},"Ghoulsaw":{"blockingAngle":90,"comboDuration":5,"followThrough":1,"range":2.1530571,"windUp":1,"releaseDate":"2021-09-08","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":1,"crit_chance":15,"crit_mult":1.9,"status_chance":27,"damage":{"Impact":37.43,"Slash":114.26,"Puncture":45.31}},{"name":"Slam","speed":1,"crit_chance":15,"crit_mult":1.9,"status_chance":27,"unique":{"force_procs":["impact"]},"damage":{"Impact":394}},{"name":"Heavy Slam","speed":1,"crit_chance":15,"crit_mult":1.9,"status_chance":27,"damage":{"Blast":591}}],
    "imageName":"ghoulsaw.webp","tags":["Grineer"],
    "compTags":["BLADESAW_STANCE"]},"Galvacord":{"blockingAngle":45,"comboDuration":5,"followThrough":0.5,"range":2.6963859,"windUp":0.4,"releaseDate":"2018-12-18","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":0.75,"crit_chance":12,"crit_mult":1.8,"status_chance":30,"damage":{"Impact":12,"Slash":64,"Puncture":38,"Electricity":96}},{"name":"Slam","speed":1,"crit_chance":12,"crit_mult":1.8,"status_chance":30,"unique":{"force_procs":["impact"]},"damage":{"Electricity":420}},{"name":"Heavy Slam","speed":1,"crit_chance":12,"crit_mult":1.8,"status_chance":30,"damage":{"Electricity":630}}],
    "imageName":"galvacord.webp","tags":[],
    "compTags":["WHIPS_STANCE"]},"Gaze (Primary)":{"ammoCapacity":200,"productCategory":"","category":"Primary","type":"Kitgun","magazineSize":0,"reloadTime":2,"multishot":1,"attacks":[{"name":"Normal Attack","speed":12,"crit_chance":0,"crit_mult":0,"status_chance":0,"shot_type":"Discharge","damage":{"Puncture":7,"Radiation":11}}],
    "imageName":"gaze.webp","tags":["primary-rifle-beam"],
    "compTags":["BEAM"]},"Gammacor":{"noise":"Alarming","releaseDate":"2014-11-27","ammoCapacity":240,"productCategory":"Pistols","zoomProps":[[]],"category":"Secondary","trigger":"Held","type":"Pistol","magazineSize":60,"reloadTime":1.4,"multishot":1,"attacks":[{"name":"Normal Attack","speed":12,"crit_chance":8,"crit_mult":1.8,"status_chance":20,"shot_type":"Discharge","damage":{"Magnetic":16}},{"name":"Incarnon Form","speed":1,"crit_chance":14,"crit_mult":1.8,"status_chance":22,"shot_type":"Projectile","unique":{"force_procs":["impact"]},"damage":{"Impact":80}},{"name":"Incarnon Form Radial Attack","speed":1,"crit_chance":14,"crit_mult":1.8,"status_chance":22,"shot_type":"AoE","unique":{"force_procs":["cold"]},"damage":{"Cold":660},"no_headshot_mult":true}],
    "imageName":"gammacor.webp","tags":["Cephalon","Incarnon"],
    "compTags":["BEAM"],
    "comb":[[1,2]]},"Glaive Prime":{"blockingAngle":55,"comboDuration":5,"followThrough":0.7,"range":1.25,"windUp":1.2,"releaseDate":"2013-11-20","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":1.25,"crit_chance":22,"crit_mult":2,"status_chance":30,"damage":{"Impact":24.6,"Slash":114.8,"Puncture":24.6}},{"name":"Throw","speed":1.25,"crit_chance":24,"crit_mult":2.2,"status_chance":32,"shot_type":"Thrown","shot_speed":40,"flight":40,"unique":{"force_procs":["impact","slash"]},"damage":{"Impact":27,"Slash":126,"Puncture":27}},{"name":"Throw Bounce Explosion","speed":1.25,"crit_chance":24,"crit_mult":2.2,"status_chance":32,"shot_type":"AoE","unique":{"force_procs":["impact"]},"damage":{"Blast":296},"falloff":{"start":0,"end":4.8,"reduction":0.4},"no_headshot_mult":true},{"name":"Throw Recall Explosion","speed":1.25,"crit_chance":24,"crit_mult":2.2,"status_chance":32,"shot_type":"AoE","unique":{"force_procs":["impact","slash"]},"damage":{"Blast":592},"falloff":{"start":0,"end":4.8,"reduction":0},"no_headshot_mult":true},{"name":"Charged Throw","speed":0.833,"crit_chance":26,"crit_mult":2.4,"status_chance":34,"shot_type":"Thrown","shot_speed":55,"flight":55,"unique":{"force_procs":["impact","slash"]},"damage":{"Impact":54,"Slash":252,"Puncture":54}},{"name":"Charged Throw Bounce Explosion","speed":0.833,"crit_chance":26,"crit_mult":2.4,"status_chance":34,"shot_type":"AoE","damage":{"Blast":592},"falloff":{"start":0,"end":4.8,"reduction":0.4},"no_headshot_mult":true},{"name":"Charged Throw Recall Explosion","speed":0.833,"crit_chance":26,"crit_mult":2.4,"status_chance":34,"shot_type":"AoE","unique":{"force_procs":["impact","slash"]},"damage":{"Blast":1184},"falloff":{"start":0,"end":4.8,"reduction":0},"no_headshot_mult":true},{"name":"Slam","speed":1,"crit_chance":22,"crit_mult":2,"status_chance":30,"unique":{"force_procs":["impact"]},"damage":{"Impact":328}},{"name":"Heavy Slam","speed":1,"crit_chance":22,"crit_mult":2,"status_chance":30,"damage":{"Blast":492}}],
    "imageName":"glaive-prime.webp","tags":["Prime","Vaulted"],
    "compTags":["GLAIVES_STANCE"],
    "comb":[[1,2],
    [4,5]]},"Glaive":{"blockingAngle":55,"comboDuration":5,"followThrough":0.7,"range":1.25,"windUp":1.2,"releaseDate":"2013-04-26","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":1,"crit_chance":12,"crit_mult":2,"status_chance":12,"damage":{"Impact":15.75,"Slash":73.5,"Puncture":15.75}},{"name":"Throw","speed":1,"crit_chance":14,"crit_mult":2.1,"status_chance":14,"shot_type":"Thrown","shot_speed":20,"flight":20,"damage":{"Impact":17.4,"Slash":81.2,"Puncture":17.4}},{"name":"Throw Bounce Explosion","speed":1,"crit_chance":14,"crit_mult":2.1,"status_chance":14,"shot_type":"AoE","damage":{"Blast":190},"falloff":{"start":0,"end":4.8,"reduction":0.4},"no_headshot_mult":true},{"name":"Throw Recall Explosion","speed":1,"crit_chance":14,"crit_mult":2.1,"status_chance":14,"shot_type":"AoE","unique":{"force_procs":["impact"]},"damage":{"Blast":380},"falloff":{"start":0,"end":4.8,"reduction":0},"no_headshot_mult":true},{"name":"Charged Throw","speed":0.833,"crit_chance":16,"crit_mult":2.2,"status_chance":16,"shot_type":"Thrown","shot_speed":35,"flight":35,"unique":{"force_procs":["impact"]},"damage":{"Impact":34.65,"Slash":161.7,"Puncture":34.65}},{"name":"Charged Throw Bounce Explosion","speed":0.833,"crit_chance":16,"crit_mult":2.2,"status_chance":16,"shot_type":"AoE","damage":{"Blast":378},"falloff":{"start":0,"end":4.8,"reduction":0.4},"no_headshot_mult":true},{"name":"Charged Throw Recall Explosion","speed":0.833,"crit_chance":16,"crit_mult":2.2,"status_chance":16,"shot_type":"AoE","unique":{"force_procs":["impact"]},"damage":{"Blast":756},"falloff":{"start":0,"end":4.8,"reduction":0},"no_headshot_mult":true},{"name":"Slam","speed":1,"crit_chance":12,"crit_mult":2,"status_chance":12,"unique":{"force_procs":["impact"]},"damage":{"Impact":210}},{"name":"Heavy Slam","speed":1,"crit_chance":12,"crit_mult":2,"status_chance":12,"damage":{"Blast":315}}],
    "imageName":"glaive.webp","tags":["Tenno"],
    "compTags":["GLAIVES_STANCE"],
    "comb":[[1,2],
    [4,5]]},"Glory (Jade)":{"noise":"Alarming","releaseDate":"2024-06-18","productCategory":"Pistols","category":"Secondary","type":"Pistols","magazineSize":9999999,"reloadTime":0,"multishot":1,"attacks":[{"name":"Normal Attack","speed":1.6666667,"crit_chance":15,"crit_mult":2,"status_chance":20,"shot_type":"AoE","damage":{"Heat":150},"no_headshot_mult":true},{"name":"Alternate Fire","speed":1.6666667,"crit_chance":15,"crit_mult":2,"status_chance":20,"shot_type":"AoE","damage":{"Heat":1500},"no_headshot_mult":true}],
    "imageName":"Glory.webp","tags":[],
    "compTags":["POWER_WEAPON","AOE"]},"Glaxion":{"noise":"Alarming","releaseDate":"2014-08-28","ammoCapacity":720,"productCategory":"LongGuns","equipTime":1.1,"zoomProps":[[]],"category":"Primary","trigger":"Held","type":"Rifle","magazineSize":80,"reloadTime":2.2,"multishot":1,"attacks":[{"name":"Normal Attack","speed":12,"crit_chance":8,"crit_mult":2,"status_chance":34,"shot_type":"Discharge","damage":{"Cold":26}}],
    "imageName":"glaxion.webp","tags":["Corpus"],
    "compTags":["BEAM","ASSAULT_AMMO","GLAXION"]},"Glaxion Vandal":{"noise":"Alarming","releaseDate":"2019-05-22","ammoCapacity":800,"productCategory":"LongGuns","equipTime":1.1,"zoomProps":[[]],"category":"Primary","trigger":"Held","type":"Rifle","magazineSize":100,"reloadTime":1.8,"multishot":1,"attacks":[{"name":"Normal Attack","speed":12,"crit_chance":14,"crit_mult":2,"status_chance":38,"shot_type":"Discharge","damage":{"Cold":29}}],
    "imageName":"glaxion-vandal.webp","tags":["Corpus","Vandal"],
    "compTags":["BEAM","ASSAULT_AMMO"]},"Gorgon Wraith":{"noise":"Alarming","releaseDate":"2014-03-05","ammoCapacity":900,"productCategory":"LongGuns","equipTime":1.1,"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":90,"reloadTime":3,"multishot":1,"attacks":[{"name":"Fully Spooled","speed":13.33,"crit_chance":15,"crit_mult":1.9,"status_chance":21,"shot_type":"Hit-Scan","damage":{"Impact":22.95,"Slash":1.35,"Puncture":2.7}},{"name":"Incarnon Form","speed":1,"crit_chance":19,"crit_mult":2.1,"status_chance":27,"shot_type":"Projectile","damage":{"Impact":25,"Slash":25,"Puncture":75}},{"name":"Incarnon Form Radial Attack","speed":1,"crit_chance":19,"crit_mult":2.1,"status_chance":27,"shot_type":"AoE","unique":{"force_procs":["heat"]},"damage":{"Heat":750},"no_headshot_mult":true}],
    "imageName":"gorgon-wraith.webp","tags":["Wraith","Grineer","Incarnon"],
    "compTags":["ASSAULT_AMMO","GORGON"],
    "comb":[[1,2]]},"Gotva Prime":{"noise":"Alarming","releaseDate":"2013-12-19","ammoCapacity":840,"productCategory":"LongGuns","equipTime":1.1,"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":84,"reloadTime":2,"multishot":1,"attacks":[{"name":"Normal Attack","speed":13.3,"crit_chance":23,"crit_mult":2.5,"status_chance":27,"shot_type":"Hit-Scan","damage":{"Puncture":25}}],
    "imageName":"GotvaPrime.webp","tags":[""],
    "compTags":["ASSAULT_AMMO"]},"Gorgon":{"noise":"Alarming","releaseDate":"2012-10-25","ammoCapacity":540,"productCategory":"LongGuns","equipTime":1.1,"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":90,"reloadTime":4.1999998,"multishot":1,"attacks":[{"name":"Fully Spooled","speed":12.5,"crit_chance":17,"crit_mult":1.5,"status_chance":9,"shot_type":"Hit-Scan","damage":{"Impact":18.75,"Slash":2.5,"Puncture":3.75}},{"name":"Incarnon Form","speed":1.2,"crit_chance":21,"crit_mult":1.9,"status_chance":19,"shot_type":"Projectile","damage":{"Impact":20,"Slash":20,"Puncture":60}},{"name":"Incarnon Form Radial Attack","speed":1.2,"crit_chance":21,"crit_mult":1.9,"status_chance":19,"shot_type":"AoE","unique":{"force_procs":["heat"]},"damage":{"Heat":750},"no_headshot_mult":true}],
    "imageName":"gorgon.webp","tags":["Grineer","Incarnon"],
    "compTags":["ASSAULT_AMMO","GORGON"],
    "comb":[[1,2]]},"Grattler (Atmo-mode)":{"releaseDate":"2018-12-18","ammoCapacity":180,"productCategory":"Archguns","zoomProps":[[]],"category":"Archgun","type":"Archgun","magazineSize":30,"reloadTime":2,"multishot":1,"attacks":[{"name":"Projectile Impact","speed":6.25,"crit_chance":25,"crit_mult":2,"status_chance":25,"shot_type":"Projectile","shot_speed":250,"damage":{"Impact":22.5,"Puncture":180,"Slash":22.5}},{"name":"Explosion","speed":6.25,"crit_chance":25,"crit_mult":2,"status_chance":25,"shot_type":"AoE","damage":{"Blast":310},"no_headshot_mult":true}],
    "imageName":"Grattler.webp","tags":[],
    "compTags":[""]},"Grattler (Arch-mode)":{"releaseDate":"2015-07-31","ammoCapacity":0,"productCategory":"Archguns","zoomProps":[[]],"category":"Archgun","type":"Archgun","magazineSize":30,"reloadTime":4,"multishot":1,"attacks":[{"name":"Projectile Impact","speed":6.25,"crit_chance":25,"crit_mult":2,"status_chance":25,"shot_type":"Projectile","shot_speed":250,"damage":{"Impact":15,"Puncture":120,"Slash":15}},{"name":"Explosion","speed":6.25,"crit_chance":25,"crit_mult":2,"status_chance":25,"shot_type":"AoE","damage":{"Blast":205},"no_headshot_mult":true}],
    "imageName":"Grattler.webp","tags":[],
    "compTags":["BATTERY"]},"Grakata":{"noise":"Alarming","releaseDate":"2013-04-19","ammoCapacity":750,"productCategory":"LongGuns","equipTime":1.1,"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":60,"reloadTime":2.4000001,"multishot":1,"attacks":[{"name":"Normal Attack","speed":20,"crit_chance":25,"crit_mult":2,"status_chance":20,"shot_type":"Hit-Scan","damage":{"Impact":4.4,"Slash":2.9,"Puncture":3.7}}],
    "imageName":"grakata.webp","tags":["Grineer"],
    "compTags":["ASSAULT_AMMO","GRAKATA"]},"Gram":{"blockingAngle":55,"comboDuration":5,"followThrough":0.6,"range":2.8,"windUp":1.1,"releaseDate":"2013-02-08","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":0.95,"crit_chance":15,"crit_mult":2,"status_chance":15,"damage":{"Impact":24,"Slash":112,"Puncture":24}},{"name":"Slam","speed":1,"crit_chance":15,"crit_mult":2,"status_chance":15,"unique":{"force_procs":["impact"]},"damage":{"Impact":320}},{"name":"Heavy Slam","speed":1,"crit_chance":15,"crit_mult":2,"status_chance":15,"damage":{"Blast":480}}],
    "imageName":"gram.webp","tags":["Tenno"],
    "compTags":["HEAVY_BLADE_STANCE"]},"Guandao":{"blockingAngle":55,"comboDuration":5,"followThrough":0.6,"range":3,"windUp":0.9,"releaseDate":"2017-07-19","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":0.833,"crit_chance":28,"crit_mult":2.2,"status_chance":4,"damage":{"Impact":50.5,"Slash":141.4,"Puncture":10.1}},{"name":"Slam","speed":1,"crit_chance":28,"crit_mult":2.2,"status_chance":4,"unique":{"force_procs":["impact"]},"damage":{"Impact":404}},{"name":"Heavy Slam","speed":1,"crit_chance":28,"crit_mult":2.2,"status_chance":4,"damage":{"Blast":606}}],
    "imageName":"guandao.webp","tags":["Tenno"],
    "compTags":["POLEARMS_STANCE"]},"Haalvu":{"noise":"Alarming","releaseDate":"2026-07-11","productCategory":"LongGuns","category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":150,"reloadTime":1,"multishot":1,"attacks":[{"name":"Normal Attack","speed":13,"crit_chance":25,"crit_mult":2.5,"status_chance":19,"shot_type":"Hit-Scan","damage":{"tau":33}},{"name":"Alt-Fire","speed":12,"crit_chance":20,"crit_mult":1.8,"status_chance":26,"shot_type":"Hit-Scan","damage":{"tau":34}}],
    "imageName":"Haalvu.webp","tags":[],
    "compTags":["ASSAULT_AMMO"]},"Guandao Prime":{"blockingAngle":55,"comboDuration":6,"followThrough":0.6,"range":3,"windUp":0.9,"releaseDate":"2020-10-26","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":1,"crit_chance":32,"crit_mult":2.4,"status_chance":20,"damage":{"Impact":60,"Slash":168,"Puncture":12}},{"name":"Slam","speed":1,"crit_chance":32,"crit_mult":2.4,"status_chance":20,"unique":{"force_procs":["impact"]},"damage":{"Impact":480}},{"name":"Heavy Slam","speed":1,"crit_chance":32,"crit_mult":2.4,"status_chance":20,"damage":{"Blast":720}}],
    "imageName":"guandao-prime.webp","tags":["Prime"],
    "compTags":["POLEARMS_STANCE"]},"Grinlok":{"noise":"Alarming","releaseDate":"2014-02-13","ammoCapacity":540,"productCategory":"LongGuns","equipTime":1.1,"category":"Primary","trigger":"Semi","type":"Rifle","magazineSize":9,"reloadTime":1.7,"multishot":1,"attacks":[{"name":"Normal Attack","speed":1.67,"crit_chance":15,"crit_mult":2.5,"status_chance":35,"shot_type":"Hit-Scan","damage":{"Impact":93.5,"Slash":74.8,"Puncture":18.7}}],
    "imageName":"grinlok.webp","tags":["Grineer"],
    "compTags":["ASSAULT_AMMO","GRINLOK"]},"Gram Prime":{"blockingAngle":55,"comboDuration":5,"followThrough":0.6,"range":2.9,"windUp":1.1,"releaseDate":"2018-09-25","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":0.8,"crit_chance":32,"crit_mult":2.6,"status_chance":32,"damage":{"Impact":60,"Slash":225,"Puncture":15}},{"name":"Slam","speed":1,"crit_chance":32,"crit_mult":2.6,"status_chance":32,"unique":{"force_procs":["impact"]},"damage":{"Impact":600}},{"name":"Heavy Slam","speed":1,"crit_chance":32,"crit_mult":2.6,"status_chance":32,"damage":{"Blast":900}}],
    "imageName":"gram-prime.webp","tags":["Prime"],
    "compTags":["HEAVY_BLADE_STANCE"]},"Gunsen Prime":{"blockingAngle":55,"comboDuration":5,"followThrough":0.7,"range":1.9,"windUp":0.5,"releaseDate":"2023-07-27","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":1.17,"crit_chance":20,"crit_mult":2,"status_chance":34,"damage":{"Impact":9,"Slash":202.5,"Puncture":13.5}},{"name":"Slam","speed":1,"crit_chance":20,"crit_mult":2,"status_chance":34,"unique":{"force_procs":["impact"]},"damage":{"Impact":444}},{"name":"Heavy Slam","speed":1,"crit_chance":20,"crit_mult":2,"status_chance":34,"damage":{"Blast":666}}],
    "imageName":"GunsenPrime.webp","tags":["Tenno"],
    "compTags":["WARFAN_STANCE"]},"Halikar":{"blockingAngle":55,"comboDuration":5,"followThrough":0.7,"range":1.2,"windUp":1.2,"releaseDate":"2014-10-24","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":1.17,"crit_chance":17,"crit_mult":2,"status_chance":29,"damage":{"Impact":14.9,"Slash":14.9,"Puncture":119.2}},{"name":"Throw","speed":1.17,"crit_chance":19,"crit_mult":2.1,"status_chance":31,"shot_type":"Thrown","shot_speed":30,"flight":30,"unique":{"force_procs":["impact"]},"damage":{"Impact":16.3,"Slash":16.3,"Puncture":130.4}},{"name":"Throw Bounce Explosion","speed":1.17,"crit_chance":19,"crit_mult":2.1,"status_chance":31,"shot_type":"AoE","damage":{"Blast":450},"falloff":{"start":0,"end":4.9,"reduction":0.4},"no_headshot_mult":true},{"name":"Throw Recall Explosion","speed":1.17,"crit_chance":19,"crit_mult":2.1,"status_chance":31,"shot_type":"AoE","unique":{"force_procs":["impact"]},"damage":{"Blast":450},"falloff":{"start":0,"end":4.9,"reduction":0},"no_headshot_mult":true},{"name":"Charged Throw","speed":0.833,"crit_chance":21,"crit_mult":2.3,"status_chance":33,"shot_type":"Thrown","shot_speed":40,"flight":40,"unique":{"force_procs":["impact"]},"damage":{"Impact":32.7,"Slash":32.7,"Puncture":261.6}},{"name":"Charged Throw Bounce Explosion","speed":0.833,"crit_chance":21,"crit_mult":2.3,"status_chance":33,"shot_type":"AoE","damage":{"Blast":447},"falloff":{"start":0,"end":4.9,"reduction":0.4},"no_headshot_mult":true},{"name":"Charged Throw Recall Explosion","speed":0.833,"crit_chance":21,"crit_mult":2.3,"status_chance":33,"shot_type":"AoE","unique":{"force_procs":["impact"]},"damage":{"Blast":894},"falloff":{"start":0,"end":4.9,"reduction":0},"no_headshot_mult":true},{"name":"Slam","speed":1,"crit_chance":17,"crit_mult":2,"status_chance":29,"unique":{"force_procs":["impact"]},"damage":{"Magnetic":298}},{"name":"Heavy Slam","speed":1,"crit_chance":17,"crit_mult":2,"status_chance":29,"damage":{"Magnetic":447}}],
    "imageName":"halikar.webp","tags":["Grineer"],
    "compTags":["GLAIVES_STANCE"],
    "comb":[[1,2],
    [4,5]]},"Gunsen":{"blockingAngle":55,"comboDuration":5,"followThrough":0.7,"range":1.7,"windUp":0.5,"releaseDate":"2017-10-12","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":1.17,"crit_chance":16,"crit_mult":2,"status_chance":28,"damage":{"Impact":12.8,"Slash":128,"Puncture":19.2}},{"name":"Slam","speed":1,"crit_chance":16,"crit_mult":2,"status_chance":28,"unique":{"force_procs":["impact"]},"damage":{"Impact":320}},{"name":"Heavy Slam","speed":1,"crit_chance":16,"crit_mult":2,"status_chance":28,"damage":{"Blast":480}}],
    "imageName":"gunsen.webp","tags":["Tenno"],
    "compTags":["WARFAN_STANCE"]},"Halikar Wraith":{"blockingAngle":55,"comboDuration":5,"followThrough":0.7,"range":1.2,"windUp":1.2,"releaseDate":"2021-04-05","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":1.17,"crit_chance":19,"crit_mult":2.3,"status_chance":35,"damage":{"Impact":22.5,"Slash":22.5,"Puncture":180}},{"name":"Throw","speed":1.17,"crit_chance":21,"crit_mult":2.3,"status_chance":39,"shot_type":"Thrown","shot_speed":30,"flight":30,"unique":{"force_procs":["impact"]},"damage":{"Impact":87.7,"Slash":87.7,"Puncture":87.7}},{"name":"Throw Bounce Explosion","speed":1.17,"crit_chance":21,"crit_mult":2.3,"status_chance":39,"shot_type":"AoE","damage":{"Blast":329},"falloff":{"start":0,"end":5.1,"reduction":0.4},"no_headshot_mult":true},{"name":"Throw Recall Explosion","speed":1.17,"crit_chance":21,"crit_mult":2.3,"status_chance":39,"shot_type":"AoE","unique":{"force_procs":["impact"]},"damage":{"Blast":658},"falloff":{"start":0,"end":5.1,"reduction":0},"no_headshot_mult":true},{"name":"Charged Throw","speed":0.833,"crit_chance":21,"crit_mult":2.5,"status_chance":41,"shot_type":"Thrown","shot_speed":40,"flight":40,"unique":{"force_procs":["impact"]},"damage":{"Impact":52.7,"Slash":22.7,"Puncture":421.6}},{"name":"Charged Throw Bounce Explosion","speed":0.833,"crit_chance":21,"crit_mult":2.5,"status_chance":41,"shot_type":"AoE","damage":{"Blast":657},"falloff":{"start":0,"end":5.1,"reduction":0.4},"no_headshot_mult":true},{"name":"Charged Throw Recall Explosion","speed":0.833,"crit_chance":21,"crit_mult":2.5,"status_chance":41,"shot_type":"AoE","unique":{"force_procs":["impact"]},"damage":{"Blast":1314},"falloff":{"start":0,"end":5.1,"reduction":0},"no_headshot_mult":true},{"name":"Slam","speed":1,"crit_chance":19,"crit_mult":2.3,"status_chance":35,"unique":{"force_procs":["impact"]},"damage":{"Magnetic":450}},{"name":"Heavy Slam","speed":1,"crit_chance":19,"crit_mult":2.3,"status_chance":35,"damage":{"Magnetic":675}}],
    "imageName":"halikar-wraith.webp","tags":["Grineer","Wraith","Baro"],
    "compTags":["GLAIVES_STANCE"],
    "comb":[[1,2],
    [4,5]]},"Grimoire":{"noise":"Alarming","releaseDate":"2023-13-12","ammoCapacity":"Infinity","productCategory":"Pistols","category":"Secondary","type":"Pistol","magazineSize":10,"reloadTime":0,"multishot":1,"attacks":[{"name":"Normal Attack","speed":1.5,"crit_chance":20,"crit_mult":2,"status_chance":26,"shot_type":"Projectile","damage":{"Electricity":100}},{"name":"Normal Radial Attack","speed":1.5,"crit_chance":20,"crit_mult":2,"status_chance":26,"shot_type":"AoE","damage":{"Electricity":50},"no_headshot_mult":true},{"name":"Alt-Fire Active Attack","speed":1,"crit_chance":20,"crit_mult":2,"status_chance":26,"shot_type":"Projectile","damage":{"Electricity":350}},{"name":"Alt-Fire Active Radial Attack","speed":1,"crit_chance":20,"crit_mult":2,"status_chance":26,"shot_type":"AoE","damage":{"Electricity":250},"no_headshot_mult":true}],
    "imageName":"Grimoire.webp","tags":[],
    "compTags":["GRIMOIRE"],
    "comb":[[0,1],
    [2,3]]},"Hate":{"blockingAngle":60,"comboDuration":5,"followThrough":0.6,"range":2.8,"windUp":1,"releaseDate":"2013-05-23","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":0.917,"crit_chance":30,"crit_mult":2.5,"status_chance":20,"damage":{"Impact":34.5,"Slash":161,"Puncture":34.5}},{"name":"Incarnon Form - Spectral Scythe","speed":0.917,"crit_chance":30,"crit_mult":2.5,"status_chance":20,"damage":{"Impact":17.25,"Slash":80.5,"Puncture":17.25}},{"name":"Incarnon Form - Spectral Scythe Explode","speed":0.917,"crit_chance":30,"crit_mult":2.5,"status_chance":20,"shot_type":"AoE","damage":{"Heat":115},"no_headshot_mult":true},{"name":"Slam","speed":1,"crit_chance":30,"crit_mult":2.5,"status_chance":20,"unique":{"force_procs":["impact"]},"damage":{"Blast":460}},{"name":"Heavy Slam","speed":1,"crit_chance":30,"crit_mult":2.5,"status_chance":20,"damage":{"Blast":690}}],
    "imageName":"hate.webp","tags":["Stalker","Incarnon"],
    "compTags":["SCYTHES_STANCE","HATE"],
    "comb":[[1,2]]},"Harmony":{"blockingAngle":60,"comboDuration":5,"followThrough":0.6,"range":2.6,"windUp":1,"releaseDate":"2024-06-18","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":1.08,"crit_chance":20,"crit_mult":2.2,"status_chance":36,"damage":{"Slash":72,"Puncture":168}},{"name":"Slam","speed":1,"crit_chance":20,"crit_mult":2.2,"status_chance":36,"unique":{"force_procs":["impact"]},"damage":{"Impact":480}},{"name":"Heavy Slam","speed":1,"crit_chance":20,"crit_mult":2.2,"status_chance":36,"damage":{"Impact":720}}],
    "imageName":"Harmony.webp","tags":[],
    "compTags":["SCYTHES_STANCE"]},"Harpak":{"noise":"Alarming","releaseDate":"2015-07-31","ammoCapacity":540,"productCategory":"LongGuns","equipTime":1.1,"category":"Primary","trigger":"Burst","type":"Rifle","magazineSize":45,"reloadTime":2,"multishot":1,"attacks":[{"name":"Normal Attack","speed":5,"crit_chance":20,"crit_mult":2.3,"status_chance":17,"shot_type":"Projectile","shot_speed":80,"flight":80,"damage":{"Impact":5,"Slash":7.5,"Puncture":37.5}},{"name":"Harpoon","speed":1.5,"crit_chance":25,"crit_mult":2.3,"status_chance":13,"shot_type":"Projectile","shot_speed":60,"flight":60,"unique":{"force_procs":["puncture"]},"damage":{"Impact":40,"Slash":10,"Puncture":50}}],
    "imageName":"harpak.webp","tags":["Grineer"],
    "compTags":["PROJECTILE","ASSAULT_AMMO","HARPAK"]},"Hema":{"noise":"Alarming","releaseDate":"2016-12-22","ammoCapacity":60,"productCategory":"LongGuns","equipTime":1.1,"category":"Primary","trigger":"Burst","type":"Rifle","magazineSize":60,"reloadTime":2,"multishot":1,"attacks":[{"name":"Normal Attack","speed":5,"crit_chance":11,"crit_mult":2,"status_chance":25,"shot_type":"Projectile","shot_speed":150,"flight":150,"damage":{"Viral":47}}],
    "imageName":"hema.webp","tags":["Infested"],
    "compTags":["ASSAULT_AMMO","PROJECTILE","HEMA"]},"Heat Sword":{"blockingAngle":55,"comboDuration":5,"followThrough":0.6,"range":2.5,"windUp":0.6,"releaseDate":"2012-12-18","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":0.917,"crit_chance":5,"crit_mult":1.5,"status_chance":20,"damage":{"Impact":14.7,"Slash":117.6,"Puncture":14.7}},{"name":"Slam","speed":1,"crit_chance":5,"crit_mult":1.5,"status_chance":20,"unique":{"force_procs":["heat","impact"]},"damage":{"Heat":294}},{"name":"Heavy Slam","speed":1,"crit_chance":5,"crit_mult":1.5,"status_chance":20,"damage":{"Heat":441}}],
    "imageName":"heat-sword.webp","tags":["Tenno"],
    "compTags":["SWORDS_STANCE"]},"Hek":{"noise":"Alarming","releaseDate":"2013-01-04","ammoCapacity":120,"productCategory":"LongGuns","zoomProps":[[]],"category":"Primary","trigger":"Semi","type":"Shotgun","magazineSize":4,"reloadTime":2,"multishot":7,"attacks":[{"name":"Normal Attack","speed":2.17,"crit_chance":10,"crit_mult":2,"status_chance":10.7,"shot_type":"Hit-Scan","damage":{"Impact":11.25,"Slash":15,"Puncture":48.75},"falloff":{"start":10,"end":20,"reduction":0.8}}],
    "imageName":"hek.webp","tags":["Grineer"],
    "compTags":["SINGLESHOT","HEK"]},"Heat Dagger":{"blockingAngle":45,"comboDuration":5,"followThrough":0.9,"range":1.75,"windUp":0.4,"releaseDate":"2012-12-18","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":0.75,"crit_chance":14,"crit_mult":1.6,"status_chance":14,"damage":{"Impact":14,"Slash":56,"Puncture":76,"Heat":62}},{"name":"Slam","speed":1,"crit_chance":14,"crit_mult":1.6,"status_chance":14,"unique":{"force_procs":["heat","impact"]},"damage":{"Heat":416}},{"name":"Heavy Slam","speed":1,"crit_chance":14,"crit_mult":1.6,"status_chance":14,"damage":{"Heat":624}}],
    "imageName":"heat-dagger.webp","tags":["Tenno"],
    "compTags":["DAGGERS_STANCE"]},"Heliocor":{"blockingAngle":50,"comboDuration":5,"followThrough":0.4,"range":2.5,"windUp":1.2,"releaseDate":"2016-07-28","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":0.833,"crit_chance":38,"crit_mult":2,"status_chance":12,"damage":{"Impact":238,"Slash":14,"Puncture":28}},{"name":"Slam","speed":1,"crit_chance":38,"crit_mult":2,"status_chance":12,"damage":{"Blast":560}},{"name":"Heavy Slam","speed":1,"crit_chance":38,"crit_mult":2,"status_chance":12,"damage":{"Blast":840}}],
    "imageName":"heliocor.webp","tags":["Cephalon Simaris"],
    "compTags":["HAMMERS_STANCE"]},"Hespar":{"blockingAngle":65,"comboDuration":5,"followThrough":0.4,"range":2.8,"windUp":1,"releaseDate":"2022-04-27","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":1,"crit_chance":24,"crit_mult":2.2,"status_chance":28,"damage":{"Impact":112,"Slash":134.4,"Puncture":33.6}},{"name":"Slam","speed":1,"crit_chance":24,"crit_mult":2.2,"status_chance":28,"unique":{"force_procs":["impact"]},"damage":{"Blast":560}},{"name":"Heavy Slam","speed":1,"crit_chance":24,"crit_mult":2.2,"status_chance":28,"damage":{"Blast":840}}],
    "imageName":"hespar.webp","tags":["Duviri"],
    "compTags":["HEAVY SCYTHE_STANCE"]},"Higasa":{"noise":"Alarming","releaseDate":"2024-10-02","ammoCapacity":540,"productCategory":"LongGuns","category":"Primary","trigger":"Burst","type":"Rifle","magazineSize":90,"reloadTime":2.5,"multishot":1,"attacks":[{"name":"Auto","speed":2.5,"crit_chance":24,"crit_mult":2,"status_chance":18,"shot_type":"Projectile","shot_speed":100,"damage":{"Slash":10.4,"Puncture":15.6}},{"name":"Charged Shot","speed":1.2,"crit_chance":24,"crit_mult":2,"status_chance":18,"shot_type":"Hit-Scan","damage":{"Blast":390}}],
    "imageName":"Higasa.webp","tags":[],
    "compTags":["ASSAULT_AMMO","HIGASA"]},"Hikou Prime":{"noise":"Silent","releaseDate":"2014-09-23","productCategory":"Pistols","category":"Secondary","trigger":"Auto","type":"Throwing","magazineSize":26,"reloadTime":0.5,"multishot":1,"attacks":[{"name":"Normal Attack","speed":5.83,"crit_chance":6,"crit_mult":1.8,"status_chance":28,"shot_type":"Projectile","shot_speed":70,"flight":70,"damage":{"Impact":3.6,"Slash":1.8,"Puncture":30.6}}],
    "imageName":"hikou-prime.webp","tags":["Prime","Never Vaulted"],
    "compTags":["PROJECTILE","THROWN"]},"Hind":{"noise":"Alarming","releaseDate":"2013-08-16","ammoCapacity":540,"productCategory":"LongGuns","equipTime":1.1,"category":"Primary","trigger":"Burst","type":"Rifle","magazineSize":65,"reloadTime":2,"multishot":1,"attacks":[{"name":"Burst Mode","speed":5,"crit_chance":7,"crit_mult":1.5,"status_chance":15,"shot_type":"Hit-Scan","damage":{"Impact":7.5,"Slash":15,"Puncture":7.5}},{"name":"Semi-Auto Mode","speed":2.5,"crit_chance":15,"crit_mult":2,"status_chance":10,"damage":{"Impact":12,"Slash":36,"Puncture":12}}],
    "imageName":"hind.webp","tags":["Grineer"],
    "compTags":["ASSAULT_AMMO"]},"Ignis":{"noise":"Alarming","releaseDate":"2013-05-23","ammoCapacity":150,"productCategory":"LongGuns","equipTime":1.1,"zoomProps":[[]],"category":"Primary","trigger":"Held","type":"Rifle","magazineSize":150,"reloadTime":2,"multishot":1,"attacks":[{"name":"Normal Attack","speed":8,"crit_chance":11,"crit_mult":2,"status_chance":27,"shot_type":"Discharge","damage":{"Heat":33},"no_headshot_mult":true}],
    "imageName":"ignis.webp","tags":["Grineer"],
    "compTags":["BEAM","ASSAULT_AMMO","AOE"]},"Hikou":{"noise":"Silent","releaseDate":"2013-07-13","productCategory":"Pistols","category":"Secondary","trigger":"Auto","type":"Throwing","magazineSize":20,"reloadTime":0.75,"multishot":1,"attacks":[{"name":"Normal Attack","speed":6.67,"crit_chance":4,"crit_mult":1.6,"status_chance":10,"shot_type":"Projectile","shot_speed":70,"flight":70,"damage":{"Impact":2.6,"Slash":7.8,"Puncture":15.6}}],
    "imageName":"hikou.webp","tags":["Tenno"],
    "compTags":["PROJECTILE","THROWN"]},"Hystrix Prime":{"noise":"Alarming","releaseDate":"2022-05-21","ammoCapacity":320,"productCategory":"Pistols","zoomProps":[[]],"category":"Secondary","trigger":"Auto","type":"Pistol","magazineSize":16,"reloadTime":1.6,"multishot":1,"attacks":[{"name":"Poison Quill","speed":7,"crit_chance":28,"crit_mult":2.2,"status_chance":20,"shot_type":"Projectile","shot_speed":80,"flight":80,"unique":{"force_procs":["toxin"]},"damage":{"Impact":2.76,"Slash":3.68,"Puncture":39.56}},{"name":"Ice Quill","speed":7,"crit_chance":28,"crit_mult":2.2,"status_chance":20,"shot_type":"Projectile","shot_speed":80,"flight":80,"unique":{"force_procs":["cold"]},"damage":{"Impact":2.76,"Slash":3.68,"Puncture":39.56}},{"name":"Fire Quill","speed":7,"crit_chance":28,"crit_mult":2.2,"status_chance":20,"shot_type":"Projectile","shot_speed":80,"flight":80,"unique":{"force_procs":["heat"]},"damage":{"Impact":2.76,"Slash":3.68,"Puncture":39.56}},{"name":"Electric Quill","speed":7,"crit_chance":28,"crit_mult":2.2,"status_chance":20,"shot_type":"Projectile","shot_speed":80,"flight":80,"unique":{"force_procs":["electricity"]},"damage":{"Impact":2.76,"Slash":3.68,"Puncture":39.56}}],
    "imageName":"hystrix-prime.webp","tags":["Prime"],
    "compTags":[]},"Ignis Wraith":{"noise":"Alarming","releaseDate":"2017-03-02","ammoCapacity":200,"productCategory":"LongGuns","equipTime":1.1,"zoomProps":[[]],"category":"Primary","trigger":"Held","type":"Rifle","magazineSize":200,"reloadTime":1.7,"multishot":1,"attacks":[{"name":"Normal Attack","speed":8,"crit_chance":17,"crit_mult":2.5,"status_chance":29,"shot_type":"Discharge","damage":{"Heat":35},"no_headshot_mult":true}],
    "imageName":"ignis-wraith.webp","tags":["Wraith","Grineer"],
    "compTags":["BEAM","ASSAULT_AMMO","AOE"]},"Hystrix":{"noise":"Alarming","releaseDate":"2018-04-20","ammoCapacity":320,"productCategory":"Pistols","zoomProps":[[]],"category":"Secondary","trigger":"Auto","type":"Pistol","magazineSize":16,"reloadTime":1.7,"multishot":1,"attacks":[{"name":"Poison Quill","speed":7,"crit_chance":24,"crit_mult":2.2,"status_chance":10,"shot_type":"Projectile","shot_speed":80,"flight":80,"unique":{"force_procs":["toxin"]},"damage":{"Impact":2.16,"Slash":2.88,"Puncture":30.96}},{"name":"Ice Quill","speed":7,"crit_chance":24,"crit_mult":2.2,"status_chance":10,"shot_type":"Projectile","shot_speed":80,"flight":80,"unique":{"force_procs":["cold"]},"damage":{"Impact":2.16,"Slash":2.88,"Puncture":30.96}},{"name":"Fire Quill","speed":7,"crit_chance":24,"crit_mult":2.2,"status_chance":10,"shot_type":"Projectile","shot_speed":80,"flight":80,"unique":{"force_procs":["heat"]},"damage":{"Impact":2.4,"Slash":3.2,"Puncture":34.4}},{"name":"Electric Quill","speed":7,"crit_chance":24,"crit_mult":2.2,"status_chance":10,"shot_type":"Projectile","shot_speed":80,"flight":80,"unique":{"force_procs":["electricity"]},"damage":{"Impact":2.4,"Slash":3.2,"Puncture":34.4}}],
    "imageName":"hystrix.webp","tags":["Tenno"],
    "compTags":[]},"Imperator (Arch-mode)":{"releaseDate":"2014-10-24","ammoCapacity":0,"productCategory":"Archguns","zoomProps":[[]],"category":"Archgun","type":"Archgun","magazineSize":200,"reloadTime":5.25,"multishot":1,"attacks":[{"name":"Normal Attack","speed":16.7,"crit_chance":24,"crit_mult":2,"status_chance":12,"shot_type":"Projectile","shot_speed":220,"damage":{"Impact":20,"Puncture":17.5,"Slash":12.5}}],
    "imageName":"Imperator.webp","tags":[""],
    "compTags":["BATTERY"]},"Imperator (Atmo-mode)":{"releaseDate":"2018-12-18","ammoCapacity":800,"productCategory":"Archguns","zoomProps":[[]],"category":"Archgun","type":"Archgun","magazineSize":200,"reloadTime":2,"multishot":1,"attacks":[{"name":"Normal Attack","speed":16.7,"crit_chance":24,"crit_mult":2,"status_chance":12,"shot_type":"Hit-Scan","damage":{"Impact":40,"Puncture":35,"Slash":25}}],
    "imageName":"Imperator.webp","tags":[],
    "compTags":[""]},"Hirudo":{"blockingAngle":50,"comboDuration":5,"followThrough":0.9,"range":1.25,"windUp":0.5,"releaseDate":"2016-12-22","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":1,"crit_chance":30,"crit_mult":3,"status_chance":11,"damage":{"Impact":19.5,"Slash":6.5,"Puncture":104}},{"name":"Slam","speed":1,"crit_chance":30,"crit_mult":3,"status_chance":11,"unique":{"force_procs":["impact"]},"damage":{"Impact":260}},{"name":"Heavy Slam","speed":1,"crit_chance":30,"crit_mult":3,"status_chance":11,"damage":{"Blast":390}}],
    "imageName":"hirudo.webp","tags":["Infested"],
    "compTags":["SPARRING_STANCE"]},"Imperator Vandal (Atmo-mode)":{"releaseDate":"2018-12-18","ammoCapacity":1200,"productCategory":"Archguns","zoomProps":[[]],"category":"Archgun","type":"Archgun","magazineSize":300,"reloadTime":2,"multishot":1,"attacks":[{"name":"Normal Attack","speed":25,"crit_chance":28,"crit_mult":2.4,"status_chance":12,"shot_type":"Hit-Scan","damage":{"Impact":40,"Puncture":35,"Slash":25}}],
    "imageName":"ImperatorVandal.webp","tags":[],
    "compTags":[""]},"Imperator Vandal (Arch-mode)":{"releaseDate":"2014-12-19","ammoCapacity":0,"productCategory":"Archguns","zoomProps":[[]],"category":"Archgun","type":"Archgun","magazineSize":300,"reloadTime":4.25,"multishot":1,"attacks":[{"name":"Normal Attack","speed":25,"crit_chance":28,"crit_mult":2.4,"status_chance":12,"shot_type":"Projectile","shot_speed":220,"damage":{"Impact":20,"Puncture":17.5,"Slash":12.5}}],
    "imageName":"ImperatorVandal.webp","tags":[""],
    "compTags":["BATTERY"]},"Iron Staff (Wukong)":{"blockingAngle":65,"comboDuration":5,"followThrough":1,"range":3.5,"windUp":0.5,"releaseDate":"2019-07-06","productCategory":"Melee","category":"Melee","type":"Exalted Weapon","multishot":1,"attacks":[{"name":"Normal Attack","speed":1,"crit_chance":25,"crit_mult":2,"status_chance":30,"damage":{"Impact":170,"Slash":80}},{"name":"Slam","speed":1,"crit_chance":25,"crit_mult":2,"status_chance":30,"damage":{"Impact":600}},{"name":"Heavy Slam","speed":1,"crit_chance":25,"crit_mult":2,"status_chance":30,"damage":{"Blast":900}}],
    "imageName":"IronStaff.webp","tags":[],
    "compTags":["IRON_STAFF_STANCE","POWER_WEAPON"]},"Jat Kittag":{"blockingAngle":50,"comboDuration":5,"followThrough":0.4,"range":2.8,"windUp":1.2,"releaseDate":"2014-02-05","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":1,"crit_chance":15,"crit_mult":2,"status_chance":25,"damage":{"Impact":160,"Slash":10,"Puncture":30}},{"name":"Slam","speed":1,"crit_chance":15,"crit_mult":2,"status_chance":25,"damage":{"Blast":400}},{"name":"Heavy Slam","speed":1,"crit_chance":15,"crit_mult":2,"status_chance":25,"damage":{"Blast":600}}],
    "imageName":"jat-kittag.webp","tags":["Grineer"],
    "compTags":["HAMMERS_STANCE"]},"Innodem":{"blockingAngle":50,"comboDuration":5,"followThrough":0.9,"range":1.8,"windUp":0.4,"releaseDate":"2022-06-09","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":0.75,"crit_chance":22,"crit_mult":2,"status_chance":22,"damage":{"Impact":36,"Slash":180,"Puncture":144}},{"name":"Incarnon Form","speed":0.75,"crit_chance":22,"crit_mult":2,"status_chance":22,"unique":{"speed":0.4},"damage":{"Radiation":360}},{"name":"Slam","speed":1,"crit_chance":22,"crit_mult":2,"status_chance":22,"unique":{"force_procs":["impact"]},"damage":{"Impact":720}},{"name":"Heavy Slam","speed":1,"crit_chance":22,"crit_mult":2,"status_chance":22,"damage":{"Blast":1080}}],
    "imageName":"innodem.webp","tags":["Zariman","Incarnon"],
    "compTags":["DAGGERS_STANCE"]},"Jaw Sword":{"blockingAngle":55,"comboDuration":5,"followThrough":0.6,"range":2.5,"windUp":0.6,"releaseDate":"2012-12-18","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":0.917,"crit_chance":8,"crit_mult":1.5,"status_chance":16,"damage":{"Impact":6,"Slash":90,"Puncture":24}},{"name":"Slam","speed":1,"crit_chance":8,"crit_mult":1.5,"status_chance":16,"unique":{"force_procs":["impact"]},"damage":{"Impact":240}},{"name":"Heavy Slam","speed":1,"crit_chance":8,"crit_mult":1.5,"status_chance":16,"damage":{"Blast":360}}],
    "imageName":"jaw-sword.webp","tags":["Tenno"],
    "compTags":["SWORDS_STANCE","JAW_SWORD"]},"Jat Kusar":{"blockingAngle":60,"comboDuration":5,"followThrough":0.5,"range":2.4000001,"windUp":0.4,"releaseDate":"2017-07-26","productCategory":"Melee","equipTime":0.93333,"category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":0.833,"crit_chance":35,"crit_mult":2.5,"status_chance":19,"damage":{"Impact":79,"Slash":45,"Puncture":13,"Heat":81}},{"name":"Slam","speed":1,"crit_chance":35,"crit_mult":2.5,"status_chance":19,"unique":{"force_procs":["impact"]},"damage":{"Heat":436}},{"name":"Heavy Slam","speed":1,"crit_chance":35,"crit_mult":2.5,"status_chance":19,"damage":{"Heat":654}}],
    "imageName":"jat-kusar.webp","tags":["Grineer"],
    "compTags":["BLADE_AND_WHIP_STANCE"]},"Karak":{"noise":"Alarming","releaseDate":"2013-12-19","ammoCapacity":540,"productCategory":"LongGuns","equipTime":1.1,"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":30,"reloadTime":2,"multishot":1,"attacks":[{"name":"Normal Attack","speed":11.67,"crit_chance":9,"crit_mult":1.5,"status_chance":15,"shot_type":"Hit-Scan","damage":{"Impact":13.05,"Slash":7.25,"Puncture":8.7}}],
    "imageName":"karak.webp","tags":["Grineer"],
    "compTags":["ASSAULT_AMMO"]},"Javlok":{"noise":"Alarming","releaseDate":"2016-12-16","ammoCapacity":150,"productCategory":"LongGuns","equipTime":1.1,"zoomProps":[[]],"category":"Primary","trigger":"Charge","type":"Rifle","magazineSize":6,"reloadTime":1.9,"multishot":1,"attacks":[{"name":"Projectile Impact","speed":3.33,"crit_chance":20,"crit_mult":2,"status_chance":25,"shot_type":"Projectile","shot_speed":150,"flight":150,"damage":{"Heat":160}},{"name":"Projectile Explosion","speed":3.33,"crit_chance":20,"crit_mult":2,"status_chance":25,"shot_type":"AoE","damage":{"Heat":120},"falloff":{"start":0,"end":2.4,"reduction":0.3},"no_headshot_mult":true},{"name":"Spear Throw Impact","speed":1,"crit_chance":20,"crit_mult":2,"status_chance":25,"shot_type":"Projectile","shot_speed":90,"flight":90,"unique":{"force_procs":["impact"]},"damage":{"Impact":45,"Slash":30,"Puncture":75}},{"name":"Spear Throw Explosion","speed":1,"crit_chance":20,"crit_mult":2,"status_chance":25,"shot_type":"AoE","unique":{"force_procs":["impact"]},"damage":{"Heat":300},"falloff":{"start":0,"end":6,"reduction":0.6},"no_headshot_mult":true}],
    "imageName":"javlok.webp","tags":["Grineer"],
    "compTags":["PROJECTILE","AOE","IMPACTEXPLODE","JAVLOK"],
    "comb":[[0,1],
    [2,3]]},"Kama":{"blockingAngle":55,"comboDuration":5,"followThrough":0.7,"range":2.4,"windUp":0.7,"releaseDate":"2013-09-13","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":1.17,"crit_chance":12,"crit_mult":1.8,"status_chance":10,"damage":{"Impact":13.5,"Slash":63,"Puncture":13.5}},{"name":"Slam","speed":1,"crit_chance":12,"crit_mult":1.8,"status_chance":10,"unique":{"force_procs":["impact"]},"damage":{"Impact":180}},{"name":"Heavy Slam","speed":1,"crit_chance":12,"crit_mult":1.8,"status_chance":10,"damage":{"Blast":270}}],
    "imageName":"kama.webp","tags":["Tenno"],
    "compTags":["MACHETES_STANCE"]},"Kesheg":{"blockingAngle":55,"comboDuration":5,"followThrough":0.6,"range":2.9,"windUp":0.9,"releaseDate":"2016-11-11","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":0.833,"crit_chance":19,"crit_mult":2.5,"status_chance":23,"damage":{"Impact":96.4,"Slash":120.5,"Puncture":24.1}},{"name":"Slam","speed":1,"crit_chance":19,"crit_mult":2.5,"status_chance":23,"unique":{"force_procs":["impact"]},"damage":{"Blast":482}},{"name":"Heavy Slam","speed":1,"crit_chance":19,"crit_mult":2.5,"status_chance":23,"damage":{"Blast":723}}],
    "imageName":"kesheg.webp","tags":["Grineer"],
    "compTags":["POLEARMS_STANCE"]},"Kestrel":{"blockingAngle":55,"comboDuration":5,"followThrough":0.7,"range":1.2,"windUp":1.2,"releaseDate":"2013-06-07","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":1.08,"crit_chance":10,"crit_mult":2,"status_chance":10,"damage":{"Impact":58.8,"Slash":12.6,"Puncture":12.6}},{"name":"Throw","speed":1.08,"crit_chance":12,"crit_mult":2.1,"status_chance":12,"shot_type":"Thrown","shot_speed":30,"flight":30,"damage":{"Impact":73.6,"Slash":9.2,"Puncture":9.2}},{"name":"Throw Bounce Explosion","speed":1.08,"crit_chance":12,"crit_mult":2.1,"status_chance":12,"shot_type":"AoE","damage":{"Blast":126},"falloff":{"start":0,"end":3.6,"reduction":0.4},"no_headshot_mult":true},{"name":"Throw Recall Explosion","speed":1.08,"crit_chance":12,"crit_mult":2.1,"status_chance":12,"shot_type":"AoE","unique":{"force_procs":["impact"]},"damage":{"Blast":252},"falloff":{"start":0,"end":3.6,"reduction":0},"no_headshot_mult":true},{"name":"Charged Throw","speed":0.833,"crit_chance":14,"crit_mult":2.2,"status_chance":14,"shot_type":"Thrown","shot_speed":40,"flight":40,"damage":{"Impact":147.2,"Slash":18.4,"Puncture":18.4}},{"name":"Charged Throw Bounce Explosion","speed":0.833,"crit_chance":14,"crit_mult":2.2,"status_chance":14,"shot_type":"AoE","damage":{"Blast":252},"falloff":{"start":0,"end":4,"reduction":0.4},"no_headshot_mult":true},{"name":"Charged Throw Recall Explosion","speed":0.833,"crit_chance":14,"crit_mult":2.2,"status_chance":14,"shot_type":"AoE","unique":{"force_procs":["impact"]},"damage":{"Blast":504},"falloff":{"start":0,"end":4,"reduction":0},"no_headshot_mult":true},{"name":"Slam","speed":1,"crit_chance":10,"crit_mult":2,"status_chance":10,"unique":{"force_procs":["impact"]},"damage":{"Magnetic":168}},{"name":"Heavy Slam","speed":1,"crit_chance":10,"crit_mult":2,"status_chance":10,"damage":{"Magnetic":252}}],
    "imageName":"kestrel.webp","tags":["Tenno"],
    "compTags":["GLAIVES_STANCE"],
    "comb":[[1,2],
    [4,5]]},"Karyst":{"blockingAngle":45,"comboDuration":5,"followThrough":0.9,"range":1.75,"windUp":0.4,"releaseDate":"2014-08-13","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":0.75,"crit_chance":10,"crit_mult":2,"status_chance":26,"damage":{"Impact":30,"Slash":72,"Puncture":84,"Toxin":87}},{"name":"Slam","speed":1,"crit_chance":10,"crit_mult":2,"status_chance":26,"unique":{"force_procs":["impact"]},"damage":{"Impact":546}},{"name":"Heavy Slam","speed":1,"crit_chance":10,"crit_mult":2,"status_chance":26,"damage":{"Toxin":819}}],
    "imageName":"karyst.webp","tags":["Tenno"],
    "compTags":["DAGGERS_STANCE"]},"Karyst Prime":{"blockingAngle":50,"comboDuration":5,"followThrough":0.9,"range":2.2,"windUp":0.4,"releaseDate":"2020-07-14","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":0.667,"crit_chance":24,"crit_mult":2.2,"status_chance":30,"damage":{"Impact":50,"Slash":102,"Puncture":96,"Toxin":96}},{"name":"Slam","speed":1,"crit_chance":24,"crit_mult":2.2,"status_chance":30,"unique":{"force_procs":["impact"]},"damage":{"Impact":688}},{"name":"Heavy Slam","speed":1,"crit_chance":24,"crit_mult":2.2,"status_chance":30,"damage":{"Toxin":1032}}],
    "imageName":"karyst-prime.webp","tags":["Prime"],
    "compTags":["DAGGERS_STANCE"]},"Keratinos":{"blockingAngle":55,"comboDuration":5,"followThrough":0.8,"range":1.7,"windUp":0.8,"releaseDate":"2020-08-25","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":0.917,"crit_chance":13,"crit_mult":2.1,"status_chance":29,"damage":{"Impact":79,"Slash":87,"Puncture":45,"Viral":33}},{"name":"Slam","speed":1,"crit_chance":13,"crit_mult":2.1,"status_chance":29,"unique":{"force_procs":["impact"]},"damage":{"Impact":488}},{"name":"Heavy Slam","speed":1,"crit_chance":13,"crit_mult":2.1,"status_chance":29,"damage":{"Viral":732}}],
    "imageName":"keratinos.webp","tags":["Infested"],
    "compTags":["CLAWS_STANCE"]},"Knell":{"noise":"Alarming","releaseDate":"2017-06-29","ammoCapacity":10,"productCategory":"Pistols","zoomProps":[[]],"category":"Secondary","trigger":"Auto","type":"Pistol","magazineSize":1,"reloadTime":2,"multishot":1,"attacks":[{"name":"Normal Attack","speed":4,"crit_chance":20,"crit_mult":1.5,"status_chance":5,"shot_type":"Hit-Scan","unique":{"WITH_COND":{"status_chance":0.6,"crit_mult_add":1.5,"ammoEff":1}},"damage":{"Impact":63,"Slash":18,"Puncture":69}}],
    "imageName":"knell.webp","tags":["Tenno"],
    "compTags":["SINGLESHOT"]},"Karak Wraith":{"noise":"Alarming","releaseDate":"2015-05-12","ammoCapacity":540,"productCategory":"LongGuns","equipTime":1.1,"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":60,"reloadTime":2,"multishot":1,"attacks":[{"name":"Normal Attack","speed":11.67,"crit_chance":13,"crit_mult":2,"status_chance":25,"shot_type":"Hit-Scan","damage":{"Impact":13.95,"Slash":7.75,"Puncture":9.3}}],
    "imageName":"karak-wraith.webp","tags":["Wraith","Invasion Reward","Grineer"],
    "compTags":["ASSAULT_AMMO"]},"Whipclaw (Khora)":{"blockingAngle":90,"comboDuration":5,"followThrough":0.5,"range":5,"windUp":0.4,"noise":"Silent","releaseDate":"2025-03-19","productCategory":"Melee","category":"Melee","type":"Exalted Weapon","multishot":1,"attacks":[{"name":"Normal Attack","speed":1,"crit_chance":25,"crit_mult":2,"status_chance":25,"unique":{"set_speed_to_default":1},"damage":{"Impact":49.95,"Puncture":49.95,"Slash":50.1}}],
    "imageName":"Whipclaw.webp","tags":[],
    "compTags":["KHORA_STANCE","POWER_WEAPON"]},"Kestrel Prime":{"blockingAngle":55,"comboDuration":5,"followThrough":0.7,"range":1.2,"windUp":1.2,"releaseDate":"2025-12-10","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":1.25,"crit_chance":20,"crit_mult":2.2,"status_chance":40,"damage":{"Impact":157.5,"Slash":31.5,"Puncture":21}},{"name":"Throw","speed":1.08,"crit_chance":22,"crit_mult":2.1,"status_chance":40,"shot_type":"Thrown","shot_speed":30,"flight":30,"damage":{"Impact":184,"Slash":23,"Puncture":23}},{"name":"Throw Bounce Explosion","speed":1.08,"crit_chance":22,"crit_mult":2.1,"status_chance":40,"shot_type":"AoE","damage":{"Blast":315},"falloff":{"start":0,"end":3.6,"reduction":0.4},"no_headshot_mult":true},{"name":"Throw Recall Explosion","speed":1.08,"crit_chance":12,"crit_mult":2.1,"status_chance":40,"shot_type":"AoE","unique":{"force_procs":["impact"]},"damage":{"Blast":630},"falloff":{"start":0,"end":3.6,"reduction":0},"no_headshot_mult":true},{"name":"Charged Throw","speed":0.833,"crit_chance":14,"crit_mult":2.2,"status_chance":40,"shot_type":"Thrown","shot_speed":40,"flight":40,"damage":{"Impact":368,"Slash":46,"Puncture":46}},{"name":"Charged Throw Bounce Explosion","speed":0.833,"crit_chance":14,"crit_mult":2.2,"status_chance":40,"shot_type":"AoE","damage":{"Blast":630},"falloff":{"start":0,"end":4,"reduction":0.4},"no_headshot_mult":true},{"name":"Charged Throw Recall Explosion","speed":0.833,"crit_chance":14,"crit_mult":2.2,"status_chance":14,"shot_type":"AoE","unique":{"force_procs":["impact"]},"damage":{"Blast":1260},"falloff":{"start":0,"end":4,"reduction":0},"no_headshot_mult":true},{"name":"Slam","speed":1,"crit_chance":10,"crit_mult":2,"status_chance":10,"unique":{"force_procs":["impact"]},"damage":{"Magnetic":420}},{"name":"Heavy Slam","speed":1,"crit_chance":10,"crit_mult":2,"status_chance":10,"damage":{"Magnetic":630}}],
    "imageName":"KestrelPrime.webp","tags":["Tenno"],
    "compTags":["GLAIVES_STANCE"],
    "comb":[[1,2],
    [4,5]]},"Knell Prime":{"noise":"Alarming","releaseDate":"2021-12-16","ammoCapacity":20,"productCategory":"Pistols","zoomProps":[[]],"category":"Secondary","trigger":"Auto","type":"Pistol","magazineSize":1,"reloadTime":2,"multishot":1,"attacks":[{"name":"Normal Attack","speed":5,"crit_chance":40,"crit_mult":2,"status_chance":10,"shot_type":"Hit-Scan","unique":{"WITH_COND":{"status_chance":0.6,"crit_mult_add":1.5,"ammoEff":1}},"damage":{"Impact":75.6,"Slash":21.6,"Puncture":82.8}}],
    "imageName":"knell-prime.webp","tags":["Tenno","Prime"],
    "compTags":["SINGLESHOT"]},"Kogake":{"blockingAngle":50,"comboDuration":5,"followThrough":0.9,"range":1.25,"windUp":0.5,"releaseDate":"2013-06-28","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":0.917,"crit_chance":20,"crit_mult":2,"status_chance":10,"damage":{"Impact":84,"Slash":18,"Puncture":18}},{"name":"Slam","speed":1,"crit_chance":20,"crit_mult":2,"status_chance":10,"unique":{"force_procs":["impact"]},"damage":{"Impact":240}},{"name":"Heavy Slam","speed":1,"crit_chance":20,"crit_mult":2,"status_chance":10,"damage":{"Blast":360}}],
    "imageName":"kogake.webp","tags":["Tenno"],
    "compTags":["SPARRING_STANCE"]},"Kogake Prime":{"blockingAngle":50,"comboDuration":5,"followThrough":0.9,"range":1.25,"windUp":0.5,"releaseDate":"2017-12-12","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":0.917,"crit_chance":16,"crit_mult":1.8,"status_chance":38,"damage":{"Impact":169.4,"Slash":36.3,"Puncture":36.3}},{"name":"Slam","speed":1,"crit_chance":16,"crit_mult":1.8,"status_chance":38,"unique":{"force_procs":["impact"]},"damage":{"Impact":484}},{"name":"Heavy Slam","speed":1,"crit_chance":16,"crit_mult":1.8,"status_chance":38,"damage":{"Blast":726}}],
    "imageName":"kogake-prime.webp","tags":["Prime","Vaulted"],
    "compTags":["SPARRING_STANCE"]},"Kompressa Prime":{"noise":"Alarming","releaseDate":"2025-05-21","ammoCapacity":144,"productCategory":"Pistols","zoomProps":[[]],"category":"Secondary","trigger":"Auto","type":"Pistol","magazineSize":12,"reloadTime":1.8,"multishot":4,"attacks":[{"name":"Normal Attack","speed":3.33,"crit_chance":16,"crit_mult":1.8,"status_chance":36,"shot_type":"Projectile","shot_speed":80,"flight":80,"damage":{"Viral":2}},{"name":"Explosion","speed":3.33,"crit_chance":16,"crit_mult":1.8,"status_chance":36,"shot_type":"AoE","damage":{"Viral":46},"no_headshot_mult":true}],
    "imageName":"KompressaPrime.webp","tags":["Tenno"],
    "compTags":["PROJECTILE","AOE"],
    "comb":[[0,1]]},"Kohm":{"noise":"Alarming","releaseDate":"2014-12-11","ammoCapacity":960,"productCategory":"LongGuns","equipTime":1.1,"zoomProps":[[]],"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":245,"reloadTime":2,"multishot":9,"attacks":[{"name":"Single Pellet","speed":0.734,"crit_chance":11,"crit_mult":2.3,"status_chance":75,"shot_type":"Hit-Scan","damage":{"Impact":6,"Slash":18,"Puncture":6},"falloff":{"start":15,"end":25,"reduction":0.7333}},{"name":"Fully Spooled","speed":3.67,"crit_chance":11,"crit_mult":2.3,"status_chance":6.25,"shot_type":"Hit-Scan","damage":{"Impact":6,"Slash":18,"Puncture":6},"falloff":{"start":15,"end":25,"reduction":0.7333}}],
    "imageName":"kohm.webp","tags":["Grineer"],
    "compTags":[]},"Korrudo":{"blockingAngle":50,"comboDuration":5,"followThrough":0.9,"range":1.25,"windUp":0.5,"releaseDate":"2019-04-04","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":0.833,"crit_chance":31,"crit_mult":2.5,"status_chance":9,"damage":{"Impact":110.01,"Slash":77.2,"Puncture":5.79}},{"name":"Slam","speed":1,"crit_chance":31,"crit_mult":2.5,"status_chance":9,"unique":{"force_procs":["impact"]},"damage":{"Impact":386}},{"name":"Heavy Slam","speed":1,"crit_chance":31,"crit_mult":2.5,"status_chance":9,"damage":{"Blast":579}}],
    "imageName":"korrudo.webp","tags":[],
    "compTags":["SPARRING_STANCE"]},"Kohmak":{"noise":"Alarming","releaseDate":"2015-03-19","productCategory":"Pistols","equipTime":1.1,"category":"Secondary","trigger":"Auto","type":"Pistol","magazineSize":40,"reloadTime":2,"multishot":5,"attacks":[{"name":"Single Pellet","speed":1,"crit_chance":11,"crit_mult":2,"status_chance":69,"shot_type":"Hit-Scan","damage":{"Impact":6,"Slash":18,"Puncture":6},"falloff":{"start":12,"end":24,"reduction":0.8333}},{"name":"Fully Spooled","speed":5,"crit_chance":11,"crit_mult":2,"status_chance":13.8,"shot_type":"Hit-Scan","damage":{"Impact":6,"Slash":18,"Puncture":6},"falloff":{"start":12,"end":24,"reduction":0.8333}}],
    "imageName":"kohmak.webp","tags":["Grineer"],
    "compTags":["PROJECTILE","SECONDARYSHOTGUN"]},"Kompressa":{"noise":"Alarming","releaseDate":"2021-07-06","ammoCapacity":144,"productCategory":"Pistols","zoomProps":[[]],"category":"Secondary","trigger":"Auto","type":"Pistol","magazineSize":12,"reloadTime":1.8,"multishot":4,"attacks":[{"name":"Normal Attack","speed":3.33,"crit_chance":6,"crit_mult":1.8,"status_chance":30,"shot_type":"Projectile","shot_speed":80,"flight":80,"damage":{"Viral":2}},{"name":"Explosion","speed":3.33,"crit_chance":6,"crit_mult":1.8,"status_chance":30,"shot_type":"AoE","damage":{"Viral":42},"falloff":{"start":0,"end":2.4,"reduction":0.2},"no_headshot_mult":true}],
    "imageName":"kompressa.webp","tags":["Tenno"],
    "compTags":["PROJECTILE","AOE"],
    "comb":[[0,1]]},"Korumm":{"blockingAngle":55,"comboDuration":5,"followThrough":0.6,"range":2.9,"windUp":0.9,"releaseDate":"2021-12-15","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":1,"crit_chance":24,"crit_mult":2.2,"status_chance":30,"damage":{"Impact":52,"Slash":104,"Puncture":104}},{"name":"Slam","speed":1,"crit_chance":24,"crit_mult":2.2,"status_chance":30,"unique":{"force_procs":["impact"]},"damage":{"Blast":520}},{"name":"Heavy Slam","speed":1,"crit_chance":24,"crit_mult":2.2,"status_chance":30,"damage":{"Blast":780}}],
    "imageName":"korumm.webp","tags":["Sentient"],
    "compTags":["POLEARMS_STANCE"]},"Komorex":{"noise":"Alarming","releaseDate":"2019-05-22","ammoCapacity":40,"productCategory":"LongGuns","equipTime":1.1,"zoomProps":[{"Upgrades": [{"DamageType": "DT_ANY", "OperationType": "STACKING_MULTIPLY", "UpgradeType": "WEAPON_RECOIL", "Value": -0.5}, {"DamageType": "DT_ANY", "OperationType": "ADD", "UpgradeType": "WEAPON_PUNCTURE_DEPTH", "Value": 2}]}, {"Upgrades": [{"DamageType": "DT_ANY", "OperationType": "STACKING_MULTIPLY", "UpgradeType": "WEAPON_PERCENT_BASE_DAMAGE_ADDED", "Value": 1}, {"DamageType": "DT_ANY", "OperationType": "ADD", "UpgradeType": "WEAPON_EXPLOSION_RADIUS", "Value": 3.6}, {"DamageType": "DT_ANY", "OperationType": "STACKING_MULTIPLY", "UpgradeType": "speed", "Value": -0.75}]}],"category":"Primary","trigger":"Semi","type":"Rifle","magazineSize":20,"reloadTime":3,"multishot":1,"attacks":[{"name":"Unzoomed","speed":6,"crit_chance":16,"crit_mult":2.1,"status_chance":35,"shot_type":"Projectile","shot_speed":250,"flight":250,"damage":{"Impact":9.7,"Slash":46.6,"Puncture":40.7},"falloff":{"start":400,"end":600,"reduction":0.5}},{"name":"3.5x Zoom Mode","speed":1.5,"crit_chance":16,"crit_mult":2.1,"status_chance":35,"damage":{"Impact":19.4,"Slash":93.2,"Puncture":81.4}},{"name":"3.5x Zoom Radial Attack","speed":1.5,"crit_chance":16,"crit_mult":2.1,"status_chance":35,"damage":{"Viral":106},"falloff":{"start":0,"end":3.5,"reduction":0.4}}],
    "imageName":"komorex.webp","tags":["Sentient","Corpus"],
    "compTags":["PROJECTILE"],
    "comb":[[1,2]]},"Kraken":{"noise":"Alarming","releaseDate":"2013-02-14","productCategory":"Pistols","category":"Secondary","trigger":"Burst","type":"Pistol","magazineSize":14,"reloadTime":2.45,"multishot":1,"attacks":[{"name":"Normal Attack","speed":2.83,"crit_chance":5,"crit_mult":2,"status_chance":13,"shot_type":"Hit-Scan","damage":{"Impact":36.75,"Slash":6.13,"Puncture":6.13}}],
    "imageName":"kraken.webp","tags":["Grineer"],
    "compTags":[]},"Kronen Prime":{"blockingAngle":60,"comboDuration":5,"followThrough":0.6,"range":2.5,"windUp":0.7,"releaseDate":"2018-03-20","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":1.17,"crit_chance":22,"crit_mult":2,"status_chance":34,"damage":{"Impact":21.2,"Slash":169.6,"Puncture":21.2}},{"name":"Slam","speed":1,"crit_chance":22,"crit_mult":2,"status_chance":34,"unique":{"force_procs":["impact"]},"damage":{"Impact":424}},{"name":"Heavy Slam","speed":1,"crit_chance":22,"crit_mult":2,"status_chance":34,"damage":{"Blast":636}}],
    "imageName":"kronen-prime.webp","tags":["Prime","Vaulted"],
    "compTags":["TONFA_STANCE"]},"Krohkur":{"blockingAngle":55,"comboDuration":5,"followThrough":0.6,"range":2.5,"windUp":0.6,"releaseDate":"2017-10-12","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":0.833,"crit_chance":29,"crit_mult":2.3,"status_chance":19,"damage":{"Impact":26,"Slash":151.9,"Puncture":39.1}},{"name":"Slam","speed":1,"crit_chance":29,"crit_mult":2.3,"status_chance":19,"unique":{"force_procs":["impact"]},"damage":{"Impact":434}},{"name":"Heavy Slam","speed":1,"crit_chance":29,"crit_mult":2.3,"status_chance":19,"damage":{"Blast":651}}],
    "imageName":"krohkur.webp","tags":["Grineer"],
    "compTags":["SWORDS_STANCE"]},"Kronen":{"blockingAngle":60,"comboDuration":5,"followThrough":0.6,"range":2.5,"windUp":0.7,"releaseDate":"2014-08-28","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":1.08,"crit_chance":10,"crit_mult":1.5,"status_chance":20,"damage":{"Impact":13,"Slash":104,"Puncture":13}},{"name":"Slam","speed":1,"crit_chance":10,"crit_mult":1.5,"status_chance":20,"unique":{"force_procs":["impact"]},"damage":{"Impact":260}},{"name":"Heavy Slam","speed":1,"crit_chance":10,"crit_mult":1.5,"status_chance":20,"damage":{"Blast":390}}],
    "imageName":"kronen.webp","tags":["Tenno"],
    "compTags":["TONFA_STANCE"]},"Kronsh (Machete)":{"comboDuration":5,"range":1,"windUp":1,"releaseDate":"2017-10-12","productCategory":"Melee","category":"Melee","type":"Zaw Component","multishot":1,"attacks":[{"name":"Kronsh Strike","speed":0.85,"crit_chance":18,"crit_mult":2,"status_chance":18,"damage":{"Impact":163.8,"Slash":70.2}}],
    "imageName":"kronsh.webp","tags":[],
    "compTags":["MACHETES_STANCE"]},"Kulstar":{"noise":"Alarming","releaseDate":"2015-07-31","ammoCapacity":15,"productCategory":"Pistols","category":"Secondary","trigger":"Active","type":"Pistol","magazineSize":3,"reloadTime":2,"multishot":1,"attacks":[{"name":"Rocket Impact","speed":2,"crit_chance":17,"crit_mult":2.3,"status_chance":19,"shot_type":"Projectile","shot_speed":100,"flight":100,"damage":{"Impact":200}},{"name":"Rocket Explosion","speed":2,"crit_chance":17,"crit_mult":2.3,"status_chance":19,"shot_type":"AoE","damage":{"Blast":300},"falloff":{"start":0,"end":3.9,"reduction":0.4},"no_headshot_mult":true},{"name":"Cluster Bombs","speed":2,"crit_chance":17,"crit_mult":2.3,"status_chance":19,"shot_type":"Projectile","shot_speed":8,"flight":8,"damage":{"Impact":75}},{"name":"Cluster Bomb Explosion","speed":2,"crit_chance":17,"crit_mult":2.3,"status_chance":19,"shot_type":"AoE","damage":{"Blast":90},"falloff":{"start":0,"end":3.9,"reduction":0.4},"no_headshot_mult":true}],
    "imageName":"kulstar.webp","tags":["Grineer"],
    "compTags":["PROJECTILE","AOE"],
    "comb":[[0,1],
    [2,3]]},"Kuva Bramma":{"noise":"Alarming","releaseDate":"2020-02-04","ammoCapacity":5,"productCategory":"LongGuns","equipTime":1.8,"zoomProps":[[]],"category":"Primary","trigger":"Charge","type":"Rifle","magazineSize":1,"reloadTime":0.6,"multishot":1,"attacks":[{"name":"Charged Shot","speed":0.667,"crit_chance":35,"crit_mult":2.1,"status_chance":21,"shot_type":"Projectile","shot_speed":50,"flight":50,"damage":{"Impact":187}},{"name":"Radial Attack","speed":0.667,"crit_chance":35,"crit_mult":2.1,"status_chance":21,"shot_type":"AoE","damage":{"Blast":839},"falloff":{"start":0,"end":8.3,"reduction":0.9},"no_headshot_mult":true},{"name":"Cluster Bomb Contact","speed":1,"crit_chance":35,"crit_mult":2.1,"status_chance":21,"shot_type":"Projectile","shot_speed":30,"flight":30,"damage":{"Impact":49}},{"name":"Cluster Bomb Explosion","speed":1,"crit_chance":35,"crit_mult":2.1,"status_chance":21,"shot_type":"AoE","damage":{"Blast":57},"falloff":{"start":0,"end":3.5,"reduction":0.5},"no_headshot_mult":true}],
    "imageName":"kuva-bramma.webp","tags":["Grineer","Kuva Lich"],
    "compTags":["PROJECTILE","AOE","SNIPER_AMMO","SINGLESHOT","GRNBOW"],
    "comb":[[0,1],
    [2,3]]},"Kronsh (Polearm)":{"comboDuration":5,"range":1,"windUp":1,"releaseDate":"2017-10-12","productCategory":"Melee","category":"Melee","type":"Zaw Component","multishot":1,"attacks":[{"name":"Kronsh Strike","speed":0.85,"crit_chance":18,"crit_mult":2,"status_chance":18,"damage":{"Impact":163.8,"Slash":70.2}}],
    "imageName":"kronsh.webp","tags":[],
    "compTags":["POLEARMS_STANCE"]},"Kuva Brakk":{"noise":"Alarming","releaseDate":"2019-10-31","productCategory":"Pistols","zoomProps":[[]],"category":"Secondary","trigger":"Semi","type":"Rifle","magazineSize":11,"reloadTime":1.1,"multishot":10,"attacks":[{"name":"Normal Attack","speed":5.83,"crit_chance":29,"crit_mult":2,"status_chance":11.1,"shot_type":"Hit-Scan","damage":{"Impact":5.85,"Slash":3.9,"Puncture":3.25},"falloff":{"start":10,"end":20,"reduction":0.96}}],
    "imageName":"kuva-brakk.webp","tags":["Grineer","Kuva Lich"],
    "compTags":["SECONDARYSHOTGUN","SINGLESHOT"]},"Kunai":{"noise":"Silent","releaseDate":"2013-05-23","productCategory":"Pistols","category":"Secondary","trigger":"Auto","type":"Throwing","magazineSize":10,"reloadTime":0.75,"multishot":1,"attacks":[{"name":"Normal Attack","speed":3.33,"crit_chance":8,"crit_mult":1.6,"status_chance":8,"shot_type":"Projectile","shot_speed":70,"flight":70,"damage":{"Impact":4.6,"Slash":6.9,"Puncture":34.5}},{"name":"Incarnon Form","speed":3.33,"crit_chance":18,"crit_mult":2,"status_chance":16,"damage":{"Impact":8,"Slash":18,"Puncture":14}}],
    "imageName":"kunai.webp","tags":["Tenno","Incarnon"],
    "compTags":["PROJECTILE","THROWN","KUNAI"]},"Kreska":{"blockingAngle":55,"comboDuration":5,"followThrough":0.7,"range":2.4000001,"windUp":0.7,"releaseDate":"2018-11-08","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":0.917,"crit_chance":14,"crit_mult":2,"status_chance":22,"damage":{"Impact":30,"Slash":45,"Puncture":15,"Heat":100}},{"name":"Slam","speed":1,"crit_chance":14,"crit_mult":2,"status_chance":22,"unique":{"force_procs":["impact"]},"damage":{"Heat":380}},{"name":"Heavy Slam","speed":1,"crit_chance":14,"crit_mult":2,"status_chance":22,"damage":{"Heat":570}}],
    "imageName":"kreska.webp","tags":["Corpus"],
    "compTags":["MACHETES_STANCE"]},"Kuva Chakkhurr":{"noise":"Alarming","releaseDate":"2019-10-31","ammoCapacity":55,"productCategory":"LongGuns","equipTime":1.1,"zoomProps":[[]],"category":"Primary","trigger":"Semi","type":"Rifle","magazineSize":11,"reloadTime":3.3,"multishot":1,"attacks":[{"name":"Normal Attack","speed":1.17,"crit_chance":50,"crit_mult":2.3,"status_chance":27,"shot_type":"Projectile","shot_speed":200,"flight":200,"unique":{"force_procs":["impact"]},"damage":{"Impact":260}},{"name":"Explosion","speed":1.17,"crit_chance":50,"crit_mult":2.3,"status_chance":27,"shot_type":"AoE","unique":{"force_procs":["impact"]},"damage":{"Slash":29,"Puncture":52,"Blast":25},"falloff":{"start":0,"end":2.9,"reduction":0.3},"no_headshot_mult":true}],
    "imageName":"kuva-chakkhurr.webp","tags":["Grineer","Kuva Lich"],
    "compTags":["SNIPER_AMMO","PROJECTILE","AOE"],
    "comb":[[0,1]]},"Kuva Drakgoon":{"noise":"Alarming","releaseDate":"2019-10-31","ammoCapacity":120,"productCategory":"LongGuns","zoomProps":[[]],"category":"Primary","trigger":"Charge","type":"Rifle","magazineSize":11,"reloadTime":2,"multishot":10,"attacks":[{"name":"Uncharged Shot","speed":3.33,"crit_chance":19,"crit_mult":2.1,"status_chance":9,"shot_type":"Projectile","shot_speed":130,"flight":130,"damage":{"Impact":4.6,"Slash":13.8,"Puncture":4.6}},{"name":"Charged Shot","speed":3.33,"crit_chance":21,"crit_mult":2.5,"status_chance":9,"shot_type":"Projectile","shot_speed":190,"flight":190,"damage":{"Impact":4.6,"Slash":36.8,"Puncture":4.6}}],
    "imageName":"kuva-drakgoon.webp","tags":["Grineer","Kuva Lich"],
    "compTags":["PROJECTILE"]},"Kuva Hek":{"noise":"Alarming","releaseDate":"2021-07-06","ammoCapacity":120,"productCategory":"LongGuns","zoomProps":[[]],"category":"Primary","trigger":"Semi","type":"Rifle","magazineSize":4,"reloadTime":1.9,"multishot":7,"attacks":[{"name":"Normal Attack","speed":2.17,"crit_chance":23,"crit_mult":2.1,"status_chance":13,"shot_type":"Hit-Scan","damage":{"Impact":13.05,"Slash":17.4,"Puncture":56.55},"falloff":{"start":15,"end":30,"reduction":0.828}},{"name":"Alt-Fire","speed":1.17,"crit_chance":23,"crit_mult":2.1,"status_chance":3.32,"shot_type":"Hit-Scan","damage":{"Impact":13.05,"Slash":17.4,"Puncture":56.55},"falloff":{"start":15,"end":30,"reduction":0.989}}],
    "imageName":"kuva-hek.webp","tags":["Grineer","Kuva Lich"],
    "compTags":["SINGLESHOT","HEK"]},"Kuva Ayanga (Arch-mode)":{"releaseDate":"2019-10-31","ammoCapacity":0,"productCategory":"Archguns","zoomProps":[[]],"category":"Archgun","type":"Archgun","magazineSize":33,"reloadTime":1.2,"multishot":1,"attacks":[{"name":"Grenade Impact","speed":4.58,"crit_chance":35,"crit_mult":2,"status_chance":20,"shot_type":"Projectile","shot_speed":300,"damage":{"Impact":87}},{"name":"Explosion","speed":4.58,"crit_chance":35,"crit_mult":2,"status_chance":20,"shot_type":"AoE","damage":{"Blast":187},"no_headshot_mult":true}],
    "imageName":"KuvaAyanga.webp","tags":["Kuva Lich"],
    "compTags":["BATTERY"]},"Kuva Hind":{"noise":"Alarming","releaseDate":"2020-02-04","ammoCapacity":900,"productCategory":"LongGuns","equipTime":1.1,"zoomProps":[[]],"category":"Primary","trigger":"Burst","type":"Rifle","magazineSize":90,"reloadTime":2.3,"multishot":1,"attacks":[{"name":"Auto","speed":10,"crit_chance":21,"crit_mult":1.9,"status_chance":33,"shot_type":"Hit-Scan","damage":{"Impact":6,"Slash":18,"Puncture":6}},{"name":"Semi-Auto","speed":2.5,"crit_chance":37,"crit_mult":2.9,"status_chance":21,"shot_type":"Hit-Scan","damage":{"Impact":18,"Slash":54,"Puncture":18}},{"name":"Burst","speed":9.09,"crit_chance":25,"crit_mult":2.1,"status_chance":33,"shot_type":"Hit-Scan","damage":{"Impact":7.5,"Slash":15,"Puncture":7.5}}],
    "imageName":"kuva-hind.webp","tags":["Kuva Lich"],
    "compTags":["ASSAULT_AMMO"]},"Kuva Karak":{"noise":"Alarming","releaseDate":"2019-10-31","ammoCapacity":540,"productCategory":"LongGuns","equipTime":1.1,"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":70,"reloadTime":1.7,"multishot":1,"attacks":[{"name":"Normal Attack","speed":11.67,"crit_chance":23,"crit_mult":2.1,"status_chance":31,"shot_type":"Hit-Scan","damage":{"Impact":7.1,"Slash":9.7,"Puncture":6.2}}],
    "imageName":"kuva-karak.webp","tags":["Grineer","Kuva Lich"],
    "compTags":["ASSAULT_AMMO"]},"Kuva Grattler (Atmo-mode)":{"releaseDate":"2021-07-06","ammoCapacity":320,"productCategory":"Archguns","zoomProps":[[]],"category":"Archgun","type":"Archgun","magazineSize":60,"reloadTime":2.5,"multishot":1,"attacks":[{"name":"Projectile Impact","speed":5.55,"crit_chance":27,"crit_mult":2,"status_chance":27,"shot_type":"Projectile","shot_speed":62.5,"damage":{"Impact":14,"Puncture":112,"Slash":14}},{"name":"Explosion","speed":5.55,"crit_chance":27,"crit_mult":2,"status_chance":27,"shot_type":"AoE","damage":{"Blast":235},"no_headshot_mult":true}],
    "imageName":"KuvaGrattler.webp","tags":["Kuva Lich"],
    "compTags":[""]},"Kuva Ghoulsaw":{"blockingAngle":90,"comboDuration":5,"followThrough":1,"range":2.153,"windUp":1,"releaseDate":"2026-03-25","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":1.2,"crit_chance":25,"crit_mult":2.1,"status_chance":32,"damage":{"Impact":40.09,"Slash":122.38,"Puncture":48.53}},{"name":"Slam","speed":1,"crit_chance":25,"crit_mult":2.1,"status_chance":32,"unique":{"force_procs":["impact"]},"damage":{"Impact":422}},{"name":"Heavy Slam","speed":1,"crit_chance":25,"crit_mult":2.1,"status_chance":32,"damage":{"Blast":633}}],
    "imageName":"KuvaGhoulsaw.webp","tags":["Grineer","Kuva Lich"],
    "compTags":["BLADESAW_STANCE"]},"Kuva Grattler (Arch-mode)":{"releaseDate":"2021-07-06","ammoCapacity":0,"productCategory":"Archguns","zoomProps":[[]],"category":"Archgun","type":"Archgun","magazineSize":60,"reloadTime":4,"multishot":1,"attacks":[{"name":"Projectile Impact","speed":5.55,"crit_chance":27,"crit_mult":2.1,"status_chance":27,"shot_type":"Projectile","shot_speed":250,"damage":{"Impact":9.4,"Puncture":75.2,"Slash":9.4}},{"name":"Explosion","speed":5.55,"crit_chance":27,"crit_mult":2.1,"status_chance":27,"shot_type":"AoE","damage":{"Blast":155},"no_headshot_mult":true}],
    "imageName":"KuvaGrattler.webp","tags":["Kuva Lich"],
    "compTags":["BATTERY"]},"Kuva Ayanga (Atmo-mode)":{"releaseDate":"2019-10-31","ammoCapacity":165,"productCategory":"Archguns","zoomProps":[[]],"category":"Archgun","type":"Archgun","magazineSize":33,"reloadTime":3,"multishot":1,"attacks":[{"name":"Grenade Impact","speed":4.58,"crit_chance":35,"crit_mult":2,"status_chance":20,"shot_type":"Projectile","shot_speed":75,"damage":{"Impact":130}},{"name":"Explosion","speed":4.58,"crit_chance":35,"crit_mult":2,"status_chance":20,"shot_type":"AoE","damage":{"Blast":280},"no_headshot_mult":true}],
    "imageName":"KuvaAyanga.webp","tags":["Kuva Lich"],
    "compTags":[""]},"Kuva Seer":{"noise":"Alarming","releaseDate":"2019-10-31","ammoCapacity":27,"productCategory":"Pistols","zoomProps":[[]],"category":"Secondary","trigger":"Semi","type":"Rifle","magazineSize":9,"reloadTime":2.3,"multishot":1,"attacks":[{"name":"Projectile Impact","speed":2.5,"crit_chance":21,"crit_mult":1.9,"status_chance":33,"shot_type":"Projectile","shot_speed":500,"flight":500,"damage":{"Impact":26.2,"Slash":36.7,"Puncture":68.1}},{"name":"Explosion","speed":2.5,"crit_chance":21,"crit_mult":1.9,"status_chance":33,"shot_type":"AoE","damage":{"Corrosive":69},"falloff":{"start":0,"end":2.3,"reduction":0.3},"no_headshot_mult":true}],
    "imageName":"kuva-seer.webp","tags":["Grineer","Kuva Lich"],
    "compTags":["PROJECTILE"],
    "comb":[[0,1]]},"Kuva Kraken":{"noise":"Alarming","releaseDate":"2019-10-31","ammoCapacity":210,"productCategory":"Pistols","zoomProps":[[]],"category":"Secondary","trigger":"Burst","type":"Rifle","magazineSize":21,"reloadTime":1.5,"multishot":1,"attacks":[{"name":"Normal Attack","speed":2.83,"crit_chance":21,"crit_mult":2.3,"status_chance":29,"shot_type":"Hit-Scan","damage":{"Impact":32.25,"Slash":5.38,"Puncture":5.38}},{"name":"Alt-Fire","speed":4.17,"crit_chance":21,"crit_mult":2.3,"status_chance":29,"shot_type":"Hit-Scan","damage":{"Impact":32.25,"Slash":5.38,"Puncture":5.38}}],
    "imageName":"kuva-kraken.webp","tags":["Grineer","Kuva Lich"],
    "compTags":[]},"Kuva Kohm":{"noise":"Alarming","releaseDate":"2019-10-31","ammoCapacity":836,"productCategory":"LongGuns","equipTime":1.1,"zoomProps":[[]],"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":209,"reloadTime":2,"multishot":9,"attacks":[{"name":"Single Pellet","speed":0.834,"crit_chance":19,"crit_mult":2.3,"status_chance":90,"shot_type":"Hit-Scan","damage":{"Impact":4,"Slash":12,"Puncture":4},"falloff":{"start":13,"end":26,"reduction":0.9375}},{"name":"Fully Spooled","speed":4.17,"crit_chance":19,"crit_mult":2.3,"status_chance":7.5,"shot_type":"Hit-Scan","damage":{"Impact":4,"Slash":12,"Puncture":4},"falloff":{"start":13,"end":26,"reduction":0.9375}}],
    "imageName":"kuva-kohm.webp","tags":["Grineer","Kuva Lich"],
    "compTags":[]},"Kuva Quartakk":{"noise":"Alarming","releaseDate":"2019-10-31","ammoCapacity":880,"productCategory":"LongGuns","equipTime":1.1,"zoomProps":[[]],"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":88,"reloadTime":1.7,"multishot":1,"attacks":[{"name":"Full-Auto","speed":4.83,"crit_chance":21,"crit_mult":1.9,"status_chance":33,"shot_type":"Hit-Scan","damage":{"Impact":20,"Slash":18.35,"Puncture":15.65}},{"name":"Burst-Fire While Aiming","speed":1.58,"crit_chance":31,"crit_mult":2.3,"status_chance":27,"shot_type":"Hit-Scan","damage":{"Impact":19.98,"Slash":18.36,"Puncture":15.66}}],
    "imageName":"kuva-quartakk.webp","tags":["Grineer","Kuva Lich"],
    "compTags":["ASSAULT_AMMO"]},"Kuva Shildeg":{"blockingAngle":50,"comboDuration":5,"followThrough":0.4,"range":3,"windUp":1.2,"releaseDate":"2019-10-31","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":0.917,"crit_chance":31,"crit_mult":2.7,"status_chance":27,"damage":{"Impact":75.8,"Slash":28.7,"Puncture":100.5}},{"name":"Slam","speed":1,"crit_chance":31,"crit_mult":2.7,"status_chance":27,"unique":{"force_procs":["impact"]},"damage":{"Impact":410}},{"name":"Heavy Slam","speed":1,"crit_chance":31,"crit_mult":2.7,"status_chance":27,"damage":{"Blast":615}}],
    "imageName":"kuva-shildeg.webp","tags":["Grineer","Kuva Lich"],
    "compTags":["HAMMERS_STANCE"]},"Kuva Nukor":{"noise":"Alarming","releaseDate":"2020-02-04","ammoCapacity":210,"productCategory":"Pistols","equipTime":1.1,"zoomProps":[[]],"category":"Secondary","trigger":"Held","type":"Rifle","magazineSize":77,"reloadTime":2,"multishot":1,"attacks":[{"name":"Normal Attack","speed":10,"crit_chance":7,"crit_mult":5,"status_chance":50,"shot_type":"Discharge","damage":{"Radiation":21}}],
    "imageName":"kuva-nukor.webp","tags":["Grineer","Kuva Lich"],
    "compTags":["BEAM"]},"Kuva Sobek":{"noise":"Alarming","releaseDate":"2024-03-27","ammoCapacity":240,"productCategory":"LongGuns","zoomProps":[[]],"category":"Primary","trigger":"Auto","type":"Shotgun","magazineSize":20,"reloadTime":2.1,"multishot":5,"attacks":[{"name":"Normal Attack","speed":2.5,"crit_chance":21,"crit_mult":2.3,"status_chance":21,"shot_type":"Hit-Scan","damage":{"Impact":57.75,"Slash":9.625,"Puncture":9.625},"falloff":{"start":25,"end":40,"reduction":0.5}}],
    "imageName":"KuvaSobek.webp","tags":["Grineer","Kuva Lich"],
    "compTags":["SOBEK"]},"Kuva Ogris":{"noise":"Alarming","releaseDate":"2019-10-31","ammoCapacity":7,"productCategory":"LongGuns","zoomProps":[[]],"category":"Primary","trigger":"Semi","type":"Rifle","magazineSize":3,"reloadTime":2.1,"multishot":1,"attacks":[{"name":"Rocket Impact","speed":1.5,"crit_chance":9,"crit_mult":2,"status_chance":47,"shot_type":"Projectile","shot_speed":40,"flight":40,"unique":{"force_procs":["impact"]},"damage":{"Impact":18.9,"Puncture":8.1}},{"name":"Rocket Explosion","speed":1.5,"crit_chance":9,"crit_mult":2,"status_chance":47,"shot_type":"AoE","damage":{"Slash":155,"Puncture":183,"Blast":349},"falloff":{"start":0,"end":7.9,"reduction":0.8},"no_headshot_mult":true}],
    "imageName":"kuva-ogris.webp","tags":["Grineer","Kuva Lich"],
    "compTags":["PROJECTILE","SNIPER_AMMO","AOE","SINGLESHOT","OGRIS"],
    "comb":[[0,1]]},"Kuva Tonkor":{"noise":"Alarming","releaseDate":"2019-10-31","ammoCapacity":30,"productCategory":"LongGuns","zoomProps":[[]],"category":"Primary","trigger":"Semi","type":"Rifle","magazineSize":1,"reloadTime":1.5,"multishot":1,"attacks":[{"name":"Grenade Impact","speed":3.17,"crit_chance":30,"crit_mult":2.5,"status_chance":17,"shot_type":"Projectile","shot_speed":40,"flight":40,"damage":{"Puncture":59}},{"name":"Grenade Explosion","speed":3.17,"crit_chance":30,"crit_mult":2.5,"status_chance":17,"shot_type":"AoE","damage":{"Slash":204,"Puncture":168,"Blast":302},"falloff":{"start":0,"end":7,"reduction":0.7},"no_headshot_mult":true}],
    "imageName":"kuva-tonkor.webp","tags":["Grineer","Kuva Lich"],
    "compTags":["PROJECTILE","SNIPER_AMMO","AOE","TONKOR"],
    "comb":[[0,1]]},"Kuva Twin Stubbas":{"noise":"Alarming","releaseDate":"2019-10-31","ammoCapacity":684,"productCategory":"Pistols","zoomProps":[[]],"category":"Secondary","trigger":"Auto","type":"Rifle","magazineSize":114,"reloadTime":2.7,"multishot":1,"attacks":[{"name":"Normal Attack","speed":10,"crit_chance":23,"crit_mult":1.9,"status_chance":31,"shot_type":"Hit-Scan","damage":{"Impact":11.6,"Slash":12.7,"Puncture":2.7}}],
    "imageName":"kuva-twin-stubbas.webp","tags":["Grineer","Kuva Lich"],
    "compTags":[]},"Laetum":{"noise":"Alarming","releaseDate":"2022-04-27","productCategory":"Pistols","zoomProps":[[]],"category":"Secondary","trigger":"Semi","type":"Pistol","magazineSize":12,"reloadTime":2,"multishot":1,"attacks":[{"name":"Normal Attack","speed":2.5,"crit_chance":22,"crit_mult":2.2,"status_chance":22,"shot_type":"Projectile","shot_speed":100,"flight":100,"damage":{"Impact":64,"Slash":96}},{"name":"Incarnon Form","speed":6.67,"crit_chance":22,"crit_mult":2.2,"status_chance":22,"shot_type":"Projectile","shot_speed":40,"flight":40,"damage":{"Impact":100}},{"name":"Incarnon Radial Attack","speed":6.67,"crit_chance":22,"crit_mult":2.2,"status_chance":22,"shot_type":"AoE","damage":{"Radiation":300},"falloff":{"start":0,"end":2,"reduction":0.2},"no_headshot_mult":true}],
    "imageName":"laetum.webp","tags":["Zariman","Incarnon"],
    "compTags":["PROJECTILE","AOE"],
    "comb":[[1,2]]},"Landslide Fists (Atlas)":{"blockingAngle":90,"comboDuration":5,"followThrough":0.5,"range":4,"windUp":0.4,"noise":"Silent","releaseDate":"2025-03-19","productCategory":"Melee","category":"Melee","type":"Exalted Weapon","multishot":1,"attacks":[{"name":"Normal Attack","speed":1,"crit_chance":35,"crit_mult":2,"status_chance":15,"damage":{"Impact":350}}],
    "imageName":"LandslideFists.webp","tags":[],
    "compTags":["ATLAS_STANCE","POWER_WEAPON"]},"Larkspur (Arch-mode)":{"releaseDate":"2019-03-08","ammoCapacity":0,"productCategory":"Archguns","zoomProps":[[]],"category":"Archgun","trigger":"Held","type":"Archgun","magazineSize":100,"reloadTime":4.5,"multishot":1,"attacks":[{"name":"Projectile Impact","speed":12,"crit_chance":10,"crit_mult":1.4,"status_chance":50,"shot_type":"Hit-Scan","damage":{"Impact":10,"Radiation":80}},{"name":"Alt-Fire Projectile Impact","speed":1,"crit_chance":26,"crit_mult":2.2,"status_chance":34,"shot_type":"Projectile","shot_speed":100,"damage":{"Impact":140,"Blast":180,"Radiation":100}},{"name":"Explosion","speed":2,"crit_chance":26,"crit_mult":2.2,"status_chance":34,"shot_type":"AoE","damage":{"Blast":400,"Radiation":400},"no_headshot_mult":true}],
    "imageName":"Larkspur.webp","tags":[],
    "compTags":["BATTERY"]},"Kuva Zarr":{"noise":"Alarming","releaseDate":"2021-07-06","ammoCapacity":5,"productCategory":"LongGuns","zoomProps":[[]],"category":"Primary","trigger":"Semi-Auto","type":"Rifle","magazineSize":5,"reloadTime":4.8,"multishot":1,"attacks":[{"name":"Cannon Mode Projectile","speed":2.17,"crit_chance":25,"crit_mult":2.5,"status_chance":31,"shot_type":"Projectile","shot_speed":75,"flight":75,"damage":{"Impact":50}},{"name":"Cannon Mode Explosion","speed":2.17,"crit_chance":25,"crit_mult":2.5,"status_chance":31,"shot_type":"AoE","damage":{"Blast":673},"falloff":{"start":0,"end":7,"reduction":0.7},"no_headshot_mult":true},{"name":"Cannon Mode Cluster Bomb Contact","speed":2.17,"crit_chance":25,"crit_mult":2.5,"status_chance":31,"shot_type":"Projectile","shot_speed":8,"flight":8,"damage":{"Impact":15}},{"name":"Cannon Mode Cluster Bomb Explosion","speed":2.17,"crit_chance":25,"crit_mult":2.5,"status_chance":31,"shot_type":"AoE","damage":{"Blast":50},"falloff":{"start":0,"end":3,"reduction":0.3},"no_headshot_mult":true},{"name":"Barrage Mode","speed":2.17,"crit_chance":37,"crit_mult":2.5,"status_chance":9.7,"shot_type":"Projectile","shot_speed":120,"flight":120,"damage":{"Impact":15,"Slash":10,"Puncture":25},"falloff":{"start":20,"end":40,"reduction":0.98}}],
    "imageName":"kuva-zarr.webp","tags":["Grineer","Kuva Lich"],
    "compTags":["ASSAULT_AMMO","PROJECTILE","AOE","SINGLESHOT"],
    "comb":[[0,1,2,3]]},"Larkspur Prime (Arch-mode)":{"releaseDate":"2023-03-15","ammoCapacity":0,"productCategory":"Archguns","zoomProps":[[]],"category":"Archgun","trigger":"Held","type":"Archgun","magazineSize":100,"reloadTime":4.5,"multishot":1,"attacks":[{"name":"Projectile Impact","speed":12,"crit_chance":14,"crit_mult":1.6,"status_chance":50,"shot_type":"Hit-Scan","damage":{"Impact":10,"Radiation":60}},{"name":"Alt-Fire Projectile Impact","speed":2,"crit_chance":28,"crit_mult":2.2,"status_chance":38,"shot_type":"Projectile","shot_speed":100,"damage":{"Impact":140,"Blast":180,"Radiation":100}},{"name":"Explosion","speed":2,"crit_chance":28,"crit_mult":2.2,"status_chance":38,"shot_type":"AoE","damage":{"Blast":400,"Radiation":400},"no_headshot_mult":true}],
    "imageName":"LarkspurPrime.webp","tags":[],
    "compTags":["BATTERY"]},"Lato":{"noise":"Alarming","releaseDate":"2012-10-25","productCategory":"Pistols","category":"Secondary","trigger":"Semi","type":"Pistol","magazineSize":15,"reloadTime":1,"multishot":1,"attacks":[{"name":"Normal Attack","speed":6.67,"crit_chance":10,"crit_mult":1.8,"status_chance":6,"shot_type":"Hit-Scan","damage":{"Impact":7.5,"Slash":15,"Puncture":7.5}},{"name":"Incarnon Form","speed":3.5,"crit_chance":16,"crit_mult":2.6,"status_chance":6,"damage":{"Impact":16,"Slash":32,"Puncture":16}}],
    "imageName":"lato.webp","tags":["Tenno","Incarnon"],
    "compTags":[]},"Lacera":{"blockingAngle":60,"comboDuration":5,"followThrough":0.5,"range":2.5,"windUp":0.4,"releaseDate":"2015-12-03","productCategory":"Melee","equipTime":0.93333,"category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":0.917,"crit_chance":5,"crit_mult":2,"status_chance":45,"damage":{"Impact":12,"Slash":66,"Puncture":38,"Electricity":100}},{"name":"Slam","speed":1,"crit_chance":5,"crit_mult":2,"status_chance":45,"unique":{"force_procs":["impact"]},"damage":{"Electricity":432}},{"name":"Heavy Slam","speed":1,"crit_chance":5,"crit_mult":2,"status_chance":45,"damage":{"Electricity":648}}],
    "imageName":"lacera.webp","tags":["Tenno"],
    "compTags":["BLADE_AND_WHIP_STANCE"]},"Lanka":{"noise":"Alarming","releaseDate":"2013-05-23","ammoCapacity":72,"productCategory":"LongGuns","equipTime":1.1,"zoomProps":[{"Upgrades": [{"DamageType": "DT_ANY", "OperationType": "ADD", "UpgradeType": "crit_chance", "Value": 0.15}]}, {"Upgrades": [{"DamageType": "DT_ANY", "OperationType": "ADD", "UpgradeType": "crit_chance", "Value": 0.25}]}, {"Upgrades": [{"DamageType": "DT_ANY", "OperationType": "ADD", "UpgradeType": "crit_chance", "Value": 0.5}]}],"category":"Primary","trigger":"Charge","type":"Rifle","magazineSize":10,"reloadTime":2,"multishot":1,"attacks":[{"name":"Uncharged Shot","speed":1,"crit_chance":20,"crit_mult":2,"status_chance":25,"shot_type":"Projectile","shot_speed":200,"flight":200,"damage":{"Electricity":200},"falloff":{"start":400,"end":600,"reduction":0.5}},{"name":"Charged Shot","speed":1,"crit_chance":25,"crit_mult":2,"status_chance":25,"shot_type":"Projectile","shot_speed":250,"flight":250,"damage":{"Electricity":525}}],
    "imageName":"lanka.webp","tags":["Corpus"],
    "compTags":["PROJECTILE","SNIPER_AMMO"]},"Larkspur Prime (Atmo-mode)":{"releaseDate":"2023-03-15","ammoCapacity":400,"productCategory":"Archguns","zoomProps":[[]],"category":"Archgun","trigger":"Held","type":"Archgun","magazineSize":100,"reloadTime":2.5,"multishot":1,"attacks":[{"name":"Projectile Impact","speed":12,"crit_chance":14,"crit_mult":1.6,"status_chance":50,"shot_type":"Hit-Scan","damage":{"Impact":20,"Radiation":160}},{"name":"Alt-Fire Projectile Impact","speed":2,"crit_chance":28,"crit_mult":2.2,"status_chance":38,"shot_type":"Projectile","shot_speed":100,"unique":{"force_procs":["impact"]},"damage":{"Impact":280,"Blast":360,"Radiation":200}},{"name":"Explosion","speed":2,"crit_chance":28,"crit_mult":2.2,"status_chance":38,"shot_type":"AoE","damage":{"Blast":800,"Radiation":800},"no_headshot_mult":true}],
    "imageName":"LarkspurPrime.webp","tags":[],
    "compTags":[""]},"Larkspur (Atmo-mode)":{"releaseDate":"2019-03-08","ammoCapacity":400,"productCategory":"Archguns","zoomProps":[[]],"category":"Archgun","trigger":"Held","type":"Archgun","magazineSize":100,"reloadTime":2.5,"multishot":1,"attacks":[{"name":"Projectile Impact","speed":12,"crit_chance":10,"crit_mult":1.4,"status_chance":50,"shot_type":"Hit-Scan","damage":{"Impact":20,"Radiation":160}},{"name":"Alt-Fire Projectile Impact","speed":2,"crit_chance":26,"crit_mult":2.2,"status_chance":34,"shot_type":"Projectile","shot_speed":100,"damage":{"Impact":280,"Blast":360,"Radiation":200}},{"name":"Explosion","speed":2,"crit_chance":26,"crit_mult":2.2,"status_chance":34,"shot_type":"AoE","damage":{"Blast":800,"Radiation":800},"no_headshot_mult":true}],
    "imageName":"Larkspur.webp","tags":[],
    "compTags":[""]},"Latron Prime":{"noise":"Alarming","releaseDate":"2013-05-03","ammoCapacity":540,"productCategory":"LongGuns","equipTime":1.1,"zoomProps":[[]],"category":"Primary","trigger":"Semi","type":"Rifle","magazineSize":15,"reloadTime":2.4000001,"multishot":1,"attacks":[{"name":"Normal Attack","speed":4.17,"crit_chance":22,"crit_mult":2.8,"status_chance":26,"shot_type":"Hit-Scan","damage":{"Impact":9,"Slash":9,"Puncture":72}},{"name":"Incarnon Form","speed":3.33,"crit_chance":44,"crit_mult":3.4,"status_chance":30,"shot_type":"Projectile","damage":{"Impact":50}},{"name":"Auto Radial Attack","speed":3.33,"crit_chance":44,"crit_mult":3.4,"status_chance":30,"shot_type":"AoE","damage":{"Heat":70,"Puncture":70},"no_headshot_mult":true}],
    "imageName":"latron-prime.webp","tags":["Prime","Vaulted","Incarnon"],
    "compTags":["ASSAULT_AMMO","LATRON"],
    "comb":[[1,2]]},"Lesion":{"blockingAngle":55,"comboDuration":5,"followThrough":0.6,"range":2.7,"windUp":0.9,"releaseDate":"2016-03-04","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":1,"crit_chance":15,"crit_mult":2,"status_chance":37,"damage":{"Impact":47.4,"Slash":177.75,"Puncture":11.85}},{"name":"Slam","speed":1,"crit_chance":15,"crit_mult":2,"status_chance":37,"unique":{"force_procs":["impact"]},"damage":{"Impact":474}},{"name":"Heavy Slam","speed":1,"crit_chance":15,"crit_mult":2,"status_chance":37,"damage":{"Blast":711}}],
    "imageName":"lesion.webp","tags":["Infested"],
    "compTags":["POLEARMS_STANCE"]},"Lato Vandal":{"noise":"Alarming","releaseDate":"2013-03-18","productCategory":"Pistols","category":"Secondary","trigger":"Semi","type":"Pistol","magazineSize":15,"reloadTime":1,"multishot":1,"attacks":[{"name":"Normal Attack","speed":5,"crit_chance":26,"crit_mult":2.4,"status_chance":10,"shot_type":"Hit-Scan","damage":{"Impact":6.9,"Slash":27.6,"Puncture":11.5}},{"name":"Incarnon Form","speed":4,"crit_chance":34,"crit_mult":3,"status_chance":10,"damage":{"Impact":19,"Slash":38,"Puncture":19}}],
    "imageName":"lato-vandal.webp","tags":["Tenno","Vandal","Incarnon"],
    "compTags":[]},"Latron Wraith":{"noise":"Alarming","releaseDate":"2014-08-28","ammoCapacity":540,"productCategory":"LongGuns","equipTime":1.1,"zoomProps":[[]],"category":"Primary","trigger":"Semi","type":"Rifle","magazineSize":15,"reloadTime":2.4000001,"multishot":1,"attacks":[{"name":"Normal Attack","speed":5.42,"crit_chance":26,"crit_mult":2.8,"status_chance":14,"shot_type":"Hit-Scan","damage":{"Impact":15.5,"Slash":3.1,"Puncture":43.4}},{"name":"Incarnon Form","speed":3.67,"crit_chance":48,"crit_mult":3.4,"status_chance":28,"shot_type":"Hit-Scan","damage":{"Impact":50}},{"name":"Auto Radial Attack","speed":3.67,"crit_chance":48,"crit_mult":3.4,"status_chance":28,"shot_type":"AoE","damage":{"Puncture":50,"Heat":50},"no_headshot_mult":true}],
    "imageName":"latron-wraith.webp","tags":["Wraith","Invasion Reward","Tenno","Incarnon"],
    "compTags":["ASSAULT_AMMO","LATRON"],
    "comb":[[1,2]]},"Lato Prime":{"noise":"Alarming","releaseDate":"2012-12-18","productCategory":"Pistols","category":"Secondary","trigger":"Semi","type":"Pistol","magazineSize":20,"reloadTime":1,"multishot":1,"attacks":[{"name":"Normal Attack","speed":6.67,"crit_chance":30,"crit_mult":2,"status_chance":20,"shot_type":"Hit-Scan","damage":{"Impact":4.8,"Slash":33.6,"Puncture":9.6}},{"name":"Incarnon Form","speed":4,"crit_chance":36,"crit_mult":3.2,"status_chance":15,"damage":{"Impact":19.5,"Slash":39,"Puncture":19.5}}],
    "imageName":"lato-prime.webp","tags":["Prime","Vaulted","Founder","Incarnon"],
    "compTags":[]},"Lecta":{"blockingAngle":45,"comboDuration":5,"followThrough":0.5,"range":2.5,"windUp":0.4,"releaseDate":"2013-11-20","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":1,"crit_chance":5,"crit_mult":1.5,"status_chance":25,"damage":{"Slash":25,"Puncture":20,"Electricity":56}},{"name":"Slam","speed":1,"crit_chance":5,"crit_mult":1.5,"status_chance":25,"unique":{"force_procs":["impact"]},"damage":{"Electricity":202}},{"name":"Heavy Slam","speed":1,"crit_chance":5,"crit_mult":1.5,"status_chance":25,"damage":{"Electricity":303}}],
    "imageName":"lecta.webp","tags":["Corpus"],
    "compTags":["WHIPS_STANCE"]},"Lex Prime":{"noise":"Alarming","releaseDate":"2014-06-09","productCategory":"Pistols","category":"Secondary","trigger":"Semi","type":"Pistol","magazineSize":8,"reloadTime":2.35,"multishot":1,"attacks":[{"name":"Normal Attack","speed":2.08,"crit_chance":25,"crit_mult":2,"status_chance":25,"shot_type":"Hit-Scan","damage":{"Impact":15,"Slash":15,"Puncture":120}},{"name":"Incarnon Form","speed":0.67,"crit_chance":35,"crit_mult":3,"status_chance":44,"unique":{"force_procs":["impact"]},"damage":{"Impact":400,"Radiation":800}}],
    "imageName":"lex-prime.webp","tags":["Prime","Never Vaulted","Incarnon"],
    "compTags":[]},"Latron":{"noise":"Alarming","releaseDate":"2012-10-25","ammoCapacity":540,"productCategory":"LongGuns","equipTime":1.1,"zoomProps":[[]],"category":"Primary","trigger":"Semi","type":"Rifle","magazineSize":15,"reloadTime":2.4000001,"multishot":1,"attacks":[{"name":"Normal Attack","speed":4.17,"crit_chance":12,"crit_mult":2,"status_chance":12,"shot_type":"Hit-Scan","damage":{"Impact":8.25,"Slash":8.25,"Puncture":38.5}},{"name":"Incarnon Form","speed":3.33,"crit_chance":32,"crit_mult":3,"status_chance":24,"shot_type":"Projectile","damage":{"Impact":50}},{"name":"Incarnon Form Radial Attack","speed":3.33,"crit_chance":32,"crit_mult":3,"status_chance":24,"shot_type":"AoE","damage":{"Heat":40,"Puncture":40},"no_headshot_mult":true}],
    "imageName":"latron.webp","tags":["Tenno","Incarnon"],
    "compTags":["ASSAULT_AMMO","LATRON"],
    "comb":[[1,2]]},"Lex":{"noise":"Alarming","releaseDate":"2012-10-25","productCategory":"Pistols","category":"Secondary","trigger":"Semi","type":"Pistol","magazineSize":6,"reloadTime":2.35,"multishot":1,"attacks":[{"name":"Normal Attack","speed":1.08,"crit_chance":20,"crit_mult":2,"status_chance":10,"shot_type":"Hit-Scan","damage":{"Impact":13,"Slash":13,"Puncture":104}},{"name":"Incarnon Form","speed":0.67,"crit_chance":30,"crit_mult":3,"status_chance":40,"unique":{"force_procs":["impact"]},"damage":{"Impact":300,"Radiation":700}}],
    "imageName":"lex.webp","tags":["Tenno","Incarnon"],
    "compTags":[]},"Machete Wraith":{"blockingAngle":55,"comboDuration":5,"followThrough":0.7,"range":2.5,"windUp":0.7,"releaseDate":"2013-10-23","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":1.08,"crit_chance":19,"crit_mult":2.1,"status_chance":33,"damage":{"Impact":31.65,"Slash":147.7,"Puncture":31.65}},{"name":"Slam","speed":1,"crit_chance":19,"crit_mult":2.1,"status_chance":33,"unique":{"force_procs":["impact"]},"damage":{"Impact":422}},{"name":"Heavy Slam","speed":1,"crit_chance":19,"crit_mult":2.1,"status_chance":33,"damage":{"Blast":633}}],
    "imageName":"machete-wraith.webp","tags":["Wraith","Grineer"],
    "compTags":["MACHETES_STANCE"]},"Lenz":{"noise":"Alarming","releaseDate":"2017-08-02","ammoCapacity":6,"productCategory":"LongGuns","equipTime":1.8,"zoomProps":[[]],"category":"Primary","trigger":"Charge","type":"Rifle","magazineSize":1,"reloadTime":0.6,"multishot":1,"attacks":[{"name":"Charged Shot","speed":1,"crit_chance":50,"crit_mult":2,"status_chance":5,"shot_type":"Projectile","shot_speed":60,"flight":60,"unique":{"force_procs":["impact"]},"damage":{"Impact":50}},{"name":"Initial Blast","speed":1,"crit_chance":50,"crit_mult":2,"status_chance":5,"shot_type":"AoE","unique":{"force_procs":["cold"]},"damage":{"Cold":10},"falloff":{"start":0,"end":7.2,"reduction":0.7},"no_headshot_mult":true},{"name":"Bubble Collapse","speed":1,"crit_chance":50,"crit_mult":2,"status_chance":5,"shot_type":"AoE","damage":{"Blast":660},"falloff":{"start":0,"end":7.2,"reduction":0.7},"no_headshot_mult":true}],
    "imageName":"lenz.webp","tags":["Corpus"],
    "compTags":["PROJECTILE","SNIPER_AMMO","AOE","SINGLESHOT","CRPBOW"],
    "comb":[[0,1,2]]},"Magnus":{"noise":"Alarming","releaseDate":"2013-12-04","productCategory":"Pistols","category":"Secondary","trigger":"Semi","type":"Pistol","magazineSize":8,"reloadTime":1.4,"multishot":1,"attacks":[{"name":"Normal Attack","speed":5.83,"crit_chance":22,"crit_mult":2,"status_chance":22,"shot_type":"Hit-Scan","damage":{"Impact":34.2,"Slash":20.9,"Puncture":20.9}}],
    "imageName":"magnus.webp","tags":["Tenno"],
    "compTags":["MAGNUS"]},"Lizzie (Temple)":{"noise":"Alarming","releaseDate":"2025-03-19","productCategory":"LongGuns","category":"Primary","trigger":"Held","type":"Exalted Weapon","magazineSize":9999,"reloadTime":0,"multishot":1,"attacks":[{"name":"Normal Attack","speed":8,"crit_chance":35,"crit_mult":2.3,"status_chance":35,"shot_type":"Discharge","damage":{"Heat":85},"no_headshot_mult":true},{"name":"Viral Wave","speed":5.33,"crit_chance":15,"crit_mult":2,"status_chance":25,"shot_type":"Projectile","unique":{"force_procs":["impact","viral"]},"damage":{"Viral":100}},{"name":"Magnetic Wave","speed":5.33,"crit_chance":15,"crit_mult":2,"status_chance":25,"shot_type":"Projectile","unique":{"force_procs":["impact","magnetic"]},"damage":{"Magnetic":100}},{"name":"Cold Wave","speed":5.33,"crit_chance":15,"crit_mult":2,"status_chance":25,"shot_type":"Projectile","unique":{"force_procs":["impact","cold"]},"damage":{"Cold":100}},{"name":"Corrosive Wave","speed":5.33,"crit_chance":15,"crit_mult":2,"status_chance":25,"shot_type":"Projectile","unique":{"force_procs":["impact","corrosive"]},"damage":{"Corrosive":100}}],
    "imageName":"Lizzie.webp","tags":[""],
    "compTags":["POWER_WEAPON","BEAM"],
    "comb":[[0,1],
    [0,2],
    [0,3],
    [0,4],
    [0,1,2,3,4]]},"Magistar":{"blockingAngle":50,"comboDuration":5,"followThrough":0.4,"range":2.5,"windUp":1.2,"releaseDate":"2013-12-19","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":0.833,"crit_chance":20,"crit_mult":2,"status_chance":10,"damage":{"Impact":168,"Slash":10.5,"Puncture":31.5}},{"name":"Slam","speed":1,"crit_chance":20,"crit_mult":2,"status_chance":10,"damage":{"Impact":420}},{"name":"Heavy Slam","speed":1,"crit_chance":20,"crit_mult":2,"status_chance":10,"damage":{"Blast":630}}],
    "imageName":"magistar.webp","tags":["Tenno","Incarnon"],
    "compTags":["HAMMERS_STANCE"]},"Machete":{"blockingAngle":55,"comboDuration":5,"followThrough":0.7,"range":2.5,"windUp":0.7,"releaseDate":"2013-05-23","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":0.917,"crit_chance":10,"crit_mult":1.5,"status_chance":15,"damage":{"Impact":18,"Slash":84,"Puncture":18}},{"name":"Slam","speed":1,"crit_chance":10,"crit_mult":1.5,"status_chance":15,"unique":{"force_procs":["impact"]},"damage":{"Impact":240}},{"name":"Heavy Slam","speed":1,"crit_chance":10,"crit_mult":1.5,"status_chance":15,"damage":{"Blast":360}}],
    "imageName":"machete.webp","tags":["Grineer"],
    "compTags":["MACHETES_STANCE"]},"Mandonel (Arch-mode)":{"releaseDate":"2023-12-13","ammoCapacity":0,"productCategory":"Archguns","zoomProps":[[]],"category":"Archgun","type":"Archgun","magazineSize":30,"reloadTime":3,"multishot":1,"attacks":[{"name":"Horizontal Spread","speed":3,"crit_chance":25,"crit_mult":2,"status_chance":15,"shot_type":"Projectile","damage":{"Impact":25,"Puncture":15,"Slash":10,"Radiation":40}},{"name":"Charge","speed":3,"crit_chance":30,"crit_mult":2.5,"status_chance":20,"shot_type":"Hit-Scan","damage":{"Impact":200,"Heat":300,"Radiation":400}}],
    "imageName":"Mandonel.webp","tags":[""],
    "compTags":["BATTERY"]},"Magnus Prime":{"noise":"Alarming","releaseDate":"2021-09-08","ammoCapacity":160,"productCategory":"Pistols","category":"Secondary","trigger":"Semi","type":"Pistol","magazineSize":8,"reloadTime":1.2,"multishot":1,"attacks":[{"name":"Normal Attack","speed":5.83,"crit_chance":28,"crit_mult":2.8,"status_chance":28,"shot_type":"Hit-Scan","unique":{"WITH_COND":{"ammoEff":1}},"damage":{"Impact":34.2,"Slash":20.9,"Puncture":20.9}}],
    "imageName":"magnus-prime.webp","tags":["Prime"],
    "compTags":["MAGNUS"]},"Mara Detron":{"noise":"Alarming","releaseDate":"2014-12-12","productCategory":"Pistols","category":"Secondary","trigger":"Semi","type":"Rifle","magazineSize":8,"reloadTime":1.05,"multishot":7,"attacks":[{"name":"Normal Attack","speed":3.33,"crit_chance":8,"crit_mult":1.5,"status_chance":13.71,"shot_type":"Projectile","shot_speed":150,"flight":150,"damage":{"Radiation":40},"falloff":{"start":16,"end":30,"reduction":0.625}}],
    "imageName":"mara-detron.webp","tags":["Corpus"],
    "compTags":["PROJECTILE","SECONDARYSHOTGUN"]},"Mandonel (Atmo-mode)":{"releaseDate":"2023-12-13","ammoCapacity":300,"productCategory":"Archguns","zoomProps":[[]],"category":"Archgun","type":"Archgun","magazineSize":30,"reloadTime":2,"multishot":1,"attacks":[{"name":"Horizontal Spread","speed":3,"crit_chance":25,"crit_mult":2,"status_chance":15,"shot_type":"Projectile","damage":{"Impact":50,"Puncture":30,"Slash":20,"Radiation":80}},{"name":"Charge","speed":3,"crit_chance":30,"crit_mult":2.5,"status_chance":20,"shot_type":"Hit-Scan","damage":{"Impact":400,"Heat":600,"Radiation":800}}],
    "imageName":"Mandonel.webp","tags":[],
    "compTags":[]},"Marelok":{"noise":"Alarming","releaseDate":"2014-02-27","productCategory":"Pistols","category":"Secondary","trigger":"Semi","type":"Pistol","magazineSize":6,"reloadTime":1.6670001,"multishot":1,"attacks":[{"name":"Normal Attack","speed":2,"crit_chance":15,"crit_mult":1.5,"status_chance":30,"shot_type":"Hit-Scan","damage":{"Impact":80,"Slash":64,"Puncture":16}}],
    "imageName":"marelok.webp","tags":["Grineer"],
    "compTags":["MARELOK"]},"Masseter":{"blockingAngle":55,"comboDuration":5,"followThrough":0.6,"range":2.9,"windUp":1.1,"releaseDate":"2019-10-31","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":1,"crit_chance":24,"crit_mult":2,"status_chance":28,"damage":{"Impact":134.96,"Slash":106.04}},{"name":"Slam","speed":1,"crit_chance":24,"crit_mult":2,"status_chance":28,"damage":{"Impact":482}},{"name":"Heavy Slam","speed":1,"crit_chance":24,"crit_mult":2,"status_chance":28,"damage":{"Blast":723}}],
    "imageName":"masseter.webp","tags":["Tenno"],
    "compTags":["HEAVY_BLADE_STANCE"]},"Mios":{"blockingAngle":60,"comboDuration":5,"followThrough":0.5,"range":2.5,"windUp":0.4,"releaseDate":"2015-11-12","productCategory":"Melee","equipTime":0.93333,"category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":1.08,"crit_chance":19,"crit_mult":2,"status_chance":25,"damage":{"Impact":53.1,"Slash":79.65,"Puncture":44.25}},{"name":"Slam","speed":1,"crit_chance":19,"crit_mult":2,"status_chance":25,"unique":{"force_procs":["impact"]},"damage":{"Toxin":354}},{"name":"Heavy Slam","speed":1,"crit_chance":19,"crit_mult":2,"status_chance":25,"damage":{"Toxin":531}}],
    "imageName":"mios.webp","tags":["Infested"],
    "compTags":["BLADE_AND_WHIP_STANCE"]},"Miter":{"noise":"Alarming","releaseDate":"2013-08-09","ammoCapacity":80,"productCategory":"LongGuns","category":"Primary","trigger":"Charge","type":"Rifle","magazineSize":20,"reloadTime":2,"multishot":1,"attacks":[{"name":"Uncharged Shot","speed":2.5,"crit_chance":5,"crit_mult":2,"status_chance":20,"shot_type":"Projectile","shot_speed":60,"flight":60,"damage":{"Impact":20,"Slash":70,"Puncture":10}},{"name":"Charged Shot","speed":2.5,"crit_chance":10,"crit_mult":2,"status_chance":50,"shot_type":"Projectile","shot_speed":100,"flight":100,"damage":{"Impact":12.5,"Slash":225,"Puncture":12.5}},{"name":"Incarnon Form","speed":3.33,"crit_chance":20,"crit_mult":3.3,"status_chance":56,"shot_type":"Projectile","damage":{"Impact":12,"Slash":42,"Puncture":6}},{"name":"Incarnon Form Radial Attack","speed":3.33,"crit_chance":20,"crit_mult":3.3,"status_chance":56,"shot_type":"AoE","damage":{"Heat":80},"no_headshot_mult":true}],
    "imageName":"miter.webp","tags":["Grineer","Incarnon"],
    "compTags":["PROJECTILE","SNIPER_AMMO","AOE","MITER"],
    "comb":[[2,3]]},"Mewan (Polearm)":{"comboDuration":5,"range":1,"windUp":1,"releaseDate":"2017-10-12","productCategory":"Melee","category":"Melee","type":"Zaw Component","multishot":1,"attacks":[{"name":"Mewan Strike","speed":0.85,"crit_chance":18,"crit_mult":2,"status_chance":18,"damage":{"Impact":56,"Slash":89.6,"Puncture":78.4}}],
    "imageName":"mewan.webp","tags":[],
    "compTags":["POLEARMS_STANCE"]},"Mk1-Furax":{"blockingAngle":50,"comboDuration":5,"followThrough":0.9,"range":1.25,"windUp":0.6,"releaseDate":"2014-07-18","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":1,"crit_chance":20,"crit_mult":2,"status_chance":10,"damage":{"Impact":63,"Slash":13.5,"Puncture":13.5}},{"name":"Slam","speed":1,"crit_chance":20,"crit_mult":2,"status_chance":10,"unique":{"force_procs":["impact"]},"damage":{"Impact":180}},{"name":"Heavy Slam","speed":1,"crit_chance":20,"crit_mult":2,"status_chance":10,"damage":{"Blast":270}}],
    "imageName":"mk1-furax.webp","tags":["Grineer","Incarnon"],
    "compTags":["FIST_STANCE"]},"Mk1-Bo":{"blockingAngle":60,"comboDuration":5,"followThrough":0.5,"range":3,"windUp":0.5,"releaseDate":"2014-07-18","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":1,"crit_chance":10,"crit_mult":2,"status_chance":10,"damage":{"Impact":81,"Puncture":9}},{"name":"Slam","speed":1,"crit_chance":10,"crit_mult":2,"status_chance":10,"unique":{"force_procs":["impact"]},"damage":{"Impact":180}},{"name":"Heavy Slam","speed":1,"crit_chance":10,"crit_mult":2,"status_chance":10,"damage":{"Blast":270}}],
    "imageName":"mk1-bo.webp","tags":["Tenno"],
    "compTags":["STAVES_STANCE"]},"Mewan (Sword)":{"comboDuration":5,"range":1,"windUp":1,"releaseDate":"2017-10-12","productCategory":"Melee","category":"Melee","type":"Zaw Component","multishot":1,"attacks":[{"name":"Mewan Strike","speed":0.85,"crit_chance":18,"crit_mult":2,"status_chance":18,"damage":{"Impact":56,"Slash":89.6,"Puncture":78.4}}],
    "imageName":"mewan.webp","tags":[],
    "compTags":["SWORDS_STANCE"]},"Masseter Prime":{"blockingAngle":55,"comboDuration":5,"followThrough":0.6,"range":2.9,"windUp":1.1,"releaseDate":"2023-10-18","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":1.08,"crit_chance":26,"crit_mult":2.2,"status_chance":36,"damage":{"Impact":145.6,"Slash":114.4}},{"name":"Slam","speed":1,"crit_chance":26,"crit_mult":2.2,"status_chance":36,"damage":{"Impact":520}},{"name":"Heavy Slam","speed":1,"crit_chance":26,"crit_mult":2.2,"status_chance":36,"damage":{"Blast":780}}],
    "imageName":"MasseterPrime.webp","tags":["Tenno"],
    "compTags":["HEAVY_BLADE_STANCE"]},"Mire":{"blockingAngle":55,"comboDuration":5,"followThrough":0.6,"range":2.7,"windUp":0.6,"releaseDate":"2013-04-05","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":1.08,"crit_chance":9,"crit_mult":1.5,"status_chance":31,"damage":{"Impact":23,"Slash":47,"Puncture":23,"Toxin":65}},{"name":"Slam","speed":1,"crit_chance":9,"crit_mult":1.5,"status_chance":31,"unique":{"force_procs":["impact"]},"damage":{"Toxin":316}},{"name":"Heavy Slam","speed":1,"crit_chance":9,"crit_mult":1.5,"status_chance":31,"damage":{"Toxin":474}}],
    "imageName":"mire.webp","tags":["Infested"],
    "compTags":["SWORDS_STANCE","MIRE"]},"Mk1-Braton":{"noise":"Alarming","releaseDate":"2012-10-25","ammoCapacity":540,"productCategory":"LongGuns","equipTime":1.1,"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":60,"reloadTime":2,"multishot":1,"attacks":[{"name":"Normal Attack","speed":7.5,"crit_chance":8,"crit_mult":1.5,"status_chance":5,"shot_type":"Hit-Scan","damage":{"Impact":4.5,"Slash":9,"Puncture":4.5}},{"name":"Incarnon Form","speed":5,"crit_chance":20,"crit_mult":2.4,"status_chance":10,"damage":{"Impact":20,"Slash":28,"Puncture":2}},{"name":"Incarnon Form Radial Attack","speed":5,"crit_chance":20,"crit_mult":2.4,"status_chance":10,"shot_type":"AoE","damage":{"Heat":50},"no_headshot_mult":true}],
    "imageName":"mk1-braton.webp","tags":["Tenno","Incarnon"],
    "compTags":["ASSAULT_AMMO"],
    "comb":[[1,2]]},"Mk1-Furis":{"noise":"Alarming","releaseDate":"2014-07-18","productCategory":"Pistols","category":"Secondary","trigger":"Auto","type":"Rifle","magazineSize":35,"reloadTime":1.4,"multishot":1,"attacks":[{"name":"Normal Attack","speed":8.33,"crit_chance":5,"crit_mult":2,"status_chance":1,"shot_type":"Hit-Scan","damage":{"Impact":1.95,"Slash":1.95,"Puncture":9.1}},{"name":"Incarnon Form","speed":12,"crit_chance":20,"crit_mult":3,"status_chance":8,"damage":{"Heat":60}}],
    "imageName":"mk1-furis.webp","tags":["Tenno"],
    "compTags":["FURIS"]},"Mk1-Kunai":{"noise":"Silent","releaseDate":"2014-07-18","productCategory":"Pistols","category":"Secondary","trigger":"Auto","type":"Rifle","magazineSize":10,"reloadTime":0.75,"multishot":1,"attacks":[{"name":"Normal Attack","speed":3.33,"crit_chance":5,"crit_mult":2,"status_chance":2.5,"shot_type":"Projectile","shot_speed":70,"flight":70,"damage":{"Impact":4,"Slash":6,"Puncture":30}},{"name":"Incarnon Form","speed":3.33,"crit_chance":14,"crit_mult":2,"status_chance":5,"damage":{"Impact":4.8,"Slash":10.8,"Puncture":8.4}}],
    "imageName":"mk1-kunai.webp","tags":["Tenno","Incarnon"],
    "compTags":["PROJECTILE","THROWN","KUNAI"]},"Mk1-Paris":{"noise":"Silent","releaseDate":"2014-07-18","ammoCapacity":72,"productCategory":"LongGuns","equipTime":1.1,"category":"Primary","trigger":"Charge","type":"Rifle","magazineSize":1,"reloadTime":0.55000001,"multishot":1,"attacks":[{"name":"Uncharged Shot","speed":1,"crit_chance":30,"crit_mult":2,"status_chance":15,"shot_type":"Projectile","shot_speed":70,"flight":70,"damage":{"Impact":5.75,"Slash":23,"Puncture":86.25}},{"name":"Charged Shot","speed":1,"crit_chance":30,"crit_mult":2,"status_chance":15,"shot_type":"Projectile","shot_speed":85,"flight":85,"damage":{"Impact":11.5,"Slash":34.5,"Puncture":184}},{"name":"Incarnon Form","speed":1,"crit_chance":40,"crit_mult":3,"status_chance":20,"damage":{"Impact":50,"Heat":250}}],
    "imageName":"mk1-paris.webp","tags":["Tenno","Incarnon"],
    "compTags":["PROJECTILE"]},"Morgha (Arch-mode)":{"releaseDate":"2020-11-19","ammoCapacity":0,"productCategory":"Archguns","zoomProps":[[]],"category":"Archgun","type":"Archgun","magazineSize":100,"reloadTime":3,"multishot":1,"attacks":[{"name":"Auto-Burst","speed":3,"crit_chance":30,"crit_mult":2.2,"status_chance":28,"shot_type":"Projectile","shot_speed":160,"damage":{"Impact":32}},{"name":"Auto Burst Explosion","speed":3,"crit_chance":30,"crit_mult":2.2,"status_chance":28,"shot_type":"AoE","damage":{"Blast":164},"no_headshot_mult":true},{"name":"Charged Shot","speed":0.83,"crit_chance":40,"crit_mult":3,"status_chance":50,"damage":{"Impact":164}},{"name":"Charged Shot Explosion","speed":0.83,"crit_chance":40,"crit_mult":3,"status_chance":50,"shot_type":"AoE","damage":{"Impact":600,"Puncture":800,"Slash":1000,"Blast":1200},"no_headshot_mult":true}],
    "imageName":"Morgha.webp","tags":[],
    "compTags":["BATTERY"]},"Mk1-Strun":{"noise":"Alarming","releaseDate":"2014-07-18","ammoCapacity":120,"productCategory":"LongGuns","zoomProps":[[]],"category":"Primary","trigger":"Semi","type":"Rifle","magazineSize":6,"reloadTime":3.75,"multishot":10,"attacks":[{"name":"Normal Attack","speed":2.08,"crit_chance":7.5,"crit_mult":2,"status_chance":6,"shot_type":"Hit-Scan","damage":{"Impact":9.9,"Slash":5.4,"Puncture":2.7},"falloff":{"start":15,"end":25,"reduction":0.5}},{"name":"Incarnon Form","speed":1.5,"crit_chance":44,"crit_mult":3,"status_chance":40,"damage":{"Impact":100}},{"name":"Incarnon Form Radial Attack","speed":1.5,"crit_chance":44,"crit_mult":3,"status_chance":40,"shot_type":"AoE","damage":{"Blast":45,"Slash":60,"Puncture":25},"no_headshot_mult":true}],
    "imageName":"mk1-strun.webp","tags":["Tenno","Incarnon"],
    "compTags":[],
    "comb":[[1,2]]},"Mausolon (Arch-mode)":{"releaseDate":"2020-08-25","ammoCapacity":0,"productCategory":"Archguns","zoomProps":[[]],"category":"Archgun","type":"Archgun","magazineSize":300,"reloadTime":5.5,"multishot":1,"attacks":[{"name":"Auto","speed":8.33,"crit_chance":30,"crit_mult":2.2,"status_chance":26,"shot_type":"Hit-Scan","unique":{"force_procs":["impact"]},"damage":{"Heat":50,"Puncture":46,"Impact":24}},{"name":"Auto Radial Attack","speed":8.33,"crit_chance":30,"crit_mult":2.2,"status_chance":26,"shot_type":"AoE","damage":{"Heat":48},"no_headshot_mult":true},{"name":"Charged Shot Laser","speed":0.5,"crit_chance":50,"crit_mult":3.5,"status_chance":50,"shot_type":"Hit-Scan","damage":{"Heat":500,"Puncture":400,"Impact":100}},{"name":"Charged Shot Explosion","speed":0.5,"crit_chance":50,"crit_mult":3.5,"status_chance":50,"shot_type":"AoE","damage":{"Heat":3000},"no_headshot_mult":true}],
    "imageName":"Mausolon.webp","tags":[""],
    "compTags":["BATTERY"],
    "comb":[[0,1],
    [2,3]]},"Morgha (Atmo-mode)":{"releaseDate":"2020-11-19","ammoCapacity":160,"productCategory":"Archguns","zoomProps":[[]],"category":"Archgun","type":"Archgun","magazineSize":100,"reloadTime":3,"multishot":1,"attacks":[{"name":"Auto-Burst","speed":3,"crit_chance":30,"crit_mult":2.2,"status_chance":28,"shot_type":"Projectile","shot_speed":60,"damage":{"Impact":64}},{"name":"Auto Burst Explosion","speed":3,"crit_chance":30,"crit_mult":2.2,"status_chance":28,"shot_type":"AoE","damage":{"Blast":328},"no_headshot_mult":true},{"name":"Charged Shot","speed":0.83,"crit_chance":40,"crit_mult":3,"status_chance":50,"damage":{"Impact":200}},{"name":"Charged Shot Explosion","speed":0.83,"crit_chance":40,"crit_mult":3,"status_chance":50,"shot_type":"AoE","damage":{"Impact":1200,"Puncture":1600,"Slash":2000,"Blast":2400},"no_headshot_mult":true}],
    "imageName":"Morgha.webp","tags":[],
    "compTags":[]},"Mausolon (Atmo-mode)":{"releaseDate":"2020-08-25","ammoCapacity":900,"productCategory":"Archguns","zoomProps":[[]],"category":"Archgun","type":"Archgun","magazineSize":300,"reloadTime":2,"multishot":1,"attacks":[{"name":"Auto","speed":8.33,"crit_chance":30,"crit_mult":2.2,"status_chance":26,"shot_type":"Hit-Scan","unique":{"force_procs":["impact"]},"damage":{"Heat":75,"Puncture":70,"Impact":35}},{"name":"Auto Radial Attack","speed":8.33,"crit_chance":30,"crit_mult":2.2,"status_chance":26,"shot_type":"AoE","damage":{"Heat":72},"no_headshot_mult":true},{"name":"Charged Shot Laser","speed":0.5,"crit_chance":50,"crit_mult":3.5,"status_chance":50,"shot_type":"Hit-Scan","damage":{"Heat":750,"Puncture":600,"Impact":150}},{"name":"Charged Shot Explosion","speed":0.5,"crit_chance":50,"crit_mult":3.5,"status_chance":50,"shot_type":"AoE","damage":{"Heat":4500},"no_headshot_mult":true}],
    "imageName":"Mausolon.webp","tags":[""],
    "compTags":["BATTERY"],
    "comb":[[0,1],
    [2,3]]},"Mutalist Quanta":{"noise":"Alarming","releaseDate":"2014-06-19","ammoCapacity":540,"productCategory":"LongGuns","equipTime":1.1,"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":60,"reloadTime":3,"multishot":1,"attacks":[{"name":"Normal Attack","speed":10,"crit_chance":2.5,"crit_mult":1.5,"status_chance":15,"shot_type":"Projectile","shot_speed":100,"flight":100,"damage":{"Impact":2.5,"Slash":7.5,"Puncture":15}},{"name":"Infested Orb","speed":10,"crit_chance":0,"crit_mult":0,"status_chance":100,"shot_type":"Projectile","shot_speed":5,"flight":5,"damage":{"Radiation":20},"falloff":{"start":0,"end":2,"reduction":0}},{"name":"Orb Explosion","speed":10,"crit_chance":5,"crit_mult":1.5,"status_chance":39,"shot_type":"AoE","damage":{"Toxin":100},"falloff":{"start":0,"end":4.4,"reduction":0.5},"no_headshot_mult":true}],
    "imageName":"mutalist-quanta.webp","tags":["Infested"],
    "compTags":["PROJECTILE","ASSAULT_AMMO"],
    "comb":[[1,2]]},"Mutalist Cernos":{"noise":"Silent","releaseDate":"2016-03-04","ammoCapacity":72,"productCategory":"LongGuns","equipTime":1.1,"zoomProps":[[]],"category":"Primary","trigger":"Charge","type":"Rifle","magazineSize":1,"reloadTime":0.6,"multishot":1,"attacks":[{"name":"Uncharged Shot","speed":1,"crit_chance":15,"crit_mult":2,"status_chance":49,"shot_type":"Projectile","shot_speed":70,"flight":70,"damage":{"Impact":184.5,"Slash":10.25,"Puncture":10.25}},{"name":"Charged Shot","speed":1,"crit_chance":15,"crit_mult":2,"status_chance":49,"shot_type":"Projectile","shot_speed":85,"flight":85,"damage":{"Impact":369,"Slash":20.5,"Puncture":20.5}},{"name":"Uncharged Toxin Cloud","speed":1,"crit_chance":15,"crit_mult":2,"status_chance":49,"shot_type":"AoE","unique":{"force_procs":["toxin"]},"damage":{"Toxin":5},"no_headshot_mult":true},{"name":"Charged Toxin Cloud","speed":1,"crit_chance":15,"crit_mult":2,"status_chance":49,"shot_type":"AoE","unique":{"force_procs":["toxin"]},"damage":{"Toxin":5},"no_headshot_mult":true}],
    "imageName":"mutalist-cernos.webp","tags":["Infested"],
    "compTags":["PROJECTILE","INFCERNOS"]},"Nagantaka Prime":{"noise":"Silent","releaseDate":"2022-03-28","ammoCapacity":540,"productCategory":"LongGuns","zoomProps":[[]],"category":"Primary","trigger":"Semi","type":"Rifle","magazineSize":11,"reloadTime":2.3,"multishot":1,"attacks":[{"name":"Semi-Auto","speed":2.5,"crit_chance":25,"crit_mult":2.3,"status_chance":39,"shot_type":"Projectile","shot_speed":100,"flight":100,"unique":{"force_procs":["impact"]},"damage":{"Impact":1.7,"Slash":155.7,"Puncture":15.6}},{"name":"Burst Shot","speed":7.8,"crit_chance":25,"crit_mult":2.3,"status_chance":39,"shot_type":"Projectile","shot_speed":100,"flight":100,"unique":{"force_procs":["impact"]},"damage":{"Impact":1.7,"Slash":155.7,"Puncture":15.6}}],
    "imageName":"nagantaka-prime.webp","tags":["Tenno","Prime"],
    "compTags":["PROJECTILE","ZHUGE","CROSSBOW"]},"Nagantaka":{"noise":"Silent","releaseDate":"2018-11-08","ammoCapacity":540,"productCategory":"LongGuns","equipTime":1.1,"zoomProps":[[]],"category":"Primary","trigger":"Semi","type":"Rifle","magazineSize":9,"reloadTime":2.3,"multishot":1,"attacks":[{"name":"Semi-Auto","speed":2.5,"crit_chance":15,"crit_mult":2.3,"status_chance":39,"shot_type":"Projectile","shot_speed":100,"flight":100,"unique":{"force_procs":["impact"]},"damage":{"Impact":1.6,"Slash":143.1,"Puncture":14.3}},{"name":"Burst Shot","speed":5,"crit_chance":15,"crit_mult":2.3,"status_chance":39,"shot_type":"Projectile","shot_speed":100,"flight":100,"unique":{"force_procs":["impact"]},"damage":{"Impact":1.6,"Slash":143.1,"Puncture":14.3}}],
    "imageName":"nagantaka.webp","tags":["Tenno"],
    "compTags":["PROJECTILE","ZHUGE","CROSSBOW"]},"Nepheri":{"blockingAngle":50,"comboDuration":5,"followThrough":0.8,"range":1.9,"windUp":0.5,"releaseDate":"2021-12-15","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":1,"crit_chance":21,"crit_mult":2.3,"status_chance":33,"damage":{"Impact":21,"Slash":85,"Puncture":63,"Heat":92}},{"name":"Slam","speed":1,"crit_chance":21,"crit_mult":2.3,"status_chance":33,"unique":{"force_procs":["impact"]},"damage":{"Impact":522}},{"name":"Heavy Slam","speed":1,"crit_chance":21,"crit_mult":2.3,"status_chance":33,"damage":{"Blast":783}}],
    "imageName":"nepheri.webp","tags":["Sentient"],
    "compTags":["DUAL_DAGGERS_STANCE"]},"Nami Skyla Prime":{"blockingAngle":60,"comboDuration":5,"followThrough":0.5,"range":2.5,"windUp":0.7,"releaseDate":"2017-08-29","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":1.33,"crit_chance":22,"crit_mult":2,"status_chance":34,"damage":{"Impact":18,"Slash":126,"Puncture":36}},{"name":"Slam","speed":1,"crit_chance":22,"crit_mult":2,"status_chance":34,"unique":{"force_procs":["impact"]},"damage":{"Impact":360}},{"name":"Heavy Slam","speed":1,"crit_chance":22,"crit_mult":2,"status_chance":34,"damage":{"Blast":540}}],
    "imageName":"nami-skyla-prime.webp","tags":["Prime","Vaulted"],
    "compTags":["DUAL_SWORDS_STANCE"]},"Nikana Prime":{"blockingAngle":55,"comboDuration":5,"followThrough":0.7,"range":2.5,"windUp":0.5,"releaseDate":"2016-02-16","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":1.08,"crit_chance":28,"crit_mult":2.4,"status_chance":28,"damage":{"Impact":9.9,"Slash":178.2,"Puncture":9.9}},{"name":"Slam","speed":1,"crit_chance":28,"crit_mult":2.4,"status_chance":28,"unique":{"force_procs":["impact"]},"damage":{"Impact":396}},{"name":"Heavy Slam","speed":1,"crit_chance":28,"crit_mult":2.4,"status_chance":28,"damage":{"Blast":594}}],
    "imageName":"nikana-prime.webp","tags":["Prime","Vaulted"],
    "compTags":["NIKANAS_STANCE"]},"Nami Skyla":{"blockingAngle":60,"comboDuration":5,"followThrough":0.5,"range":2.5,"windUp":0.7,"releaseDate":"2014-04-09","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":0.917,"crit_chance":10,"crit_mult":1.5,"status_chance":15,"damage":{"Impact":18.75,"Slash":87.5,"Puncture":18.75}},{"name":"Slam","speed":1,"crit_chance":10,"crit_mult":1.5,"status_chance":15,"unique":{"force_procs":["impact"]},"damage":{"Impact":250}},{"name":"Heavy Slam","speed":1,"crit_chance":10,"crit_mult":1.5,"status_chance":15,"damage":{"Blast":375}}],
    "imageName":"nami-skyla.webp","tags":["Tenno"],
    "compTags":["DUAL_SWORDS_STANCE"]},"Nataruk":{"noise":"Alarming","releaseDate":"2021-12-15","ammoCapacity":"Infinity","productCategory":"LongGuns","equipTime":1.1,"zoomProps":[[]],"category":"Primary","trigger":"Charge","type":"Rifle","magazineSize":1,"reloadTime":0.6,"multishot":1,"attacks":[{"name":"Quick Shot","speed":0.667,"crit_chance":20,"crit_mult":1.8,"status_chance":30,"shot_type":"Projectile","shot_speed":140,"flight":140,"unique":{"force_procs":["impact"]},"damage":{"Slash":45,"Puncture":405}},{"name":"Charged Shot","speed":0.667,"crit_chance":50,"crit_mult":2.2,"status_chance":50,"shot_type":"Projectile","shot_speed":70,"flight":70,"damage":{"Slash":252,"Puncture":648},"no_headshot_mult":true},{"name":"Perfect Shot","speed":0.667,"crit_chance":60,"crit_mult":2.4,"status_chance":50,"shot_type":"Projectile","shot_speed":70,"flight":70,"damage":{"Slash":252,"Puncture":648},"no_headshot_mult":true}],
    "imageName":"nataruk.webp","tags":["Sentient"],
    "compTags":["PROJECTILE","OMICRUS","BATTERY"]},"Nikana":{"blockingAngle":55,"comboDuration":5,"followThrough":0.7,"range":2.5,"windUp":0.5,"releaseDate":"2014-04-09","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":0.917,"crit_chance":16,"crit_mult":2,"status_chance":16,"damage":{"Impact":7.1,"Slash":120.7,"Puncture":14.2}},{"name":"Slam","speed":1,"crit_chance":16,"crit_mult":2,"status_chance":16,"unique":{"force_procs":["impact"]},"damage":{"Impact":284}},{"name":"Heavy Slam","speed":1,"crit_chance":16,"crit_mult":2,"status_chance":16,"damage":{"Blast":426}}],
    "imageName":"nikana.webp","tags":["Tenno"],
    "compTags":["NIKANAS_STANCE"]},"Nami Solo":{"blockingAngle":55,"comboDuration":5,"followThrough":0.7,"range":2.5,"windUp":0.7,"releaseDate":"2014-05-28","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":1,"crit_chance":15,"crit_mult":2,"status_chance":25,"damage":{"Impact":25.8,"Slash":120.4,"Puncture":25.8}},{"name":"Slam","speed":1,"crit_chance":15,"crit_mult":2,"status_chance":25,"unique":{"force_procs":["impact"]},"damage":{"Impact":344}},{"name":"Heavy Slam","speed":1,"crit_chance":15,"crit_mult":2,"status_chance":25,"damage":{"Blast":516}}],
    "imageName":"nami-solo.webp","tags":["Tenno","Incarnon"],
    "compTags":["MACHETES_STANCE"]},"Neutralizer  (Cyte-09)":{"noise":"Alarming","releaseDate":"2024-12-13","productCategory":"LongGuns","category":"Primary","trigger":"Semi","type":"Dual Pistols","magazineSize":12,"reloadTime":2.3,"multishot":1,"attacks":[{"name":"Normal Attack no-zoom","speed":1,"crit_chance":45,"crit_mult":3,"status_chance":10,"damage":{"Impact":12.75,"Slash":25.5,"Puncture":216.75}},{"name":"Normal Attack 2.5x","speed":1,"crit_chance":45,"crit_mult":3,"status_chance":10,"unique":{"crit_mult":0.4},"damage":{"Impact":12.75,"Slash":25.5,"Puncture":216.75}},{"name":"Normal Attack 4x","speed":1,"crit_chance":45,"crit_mult":3,"status_chance":10,"unique":{"crit_mult":0.6},"damage":{"Impact":12.75,"Slash":25.5,"Puncture":216.75}},{"name":"Normal Attack 8x","speed":1,"crit_chance":45,"crit_mult":3,"status_chance":10,"unique":{"crit_mult":0.8},"damage":{"Impact":12.75,"Slash":25.5,"Puncture":216.75}}],
    "imageName":"Neutralizer.webp","tags":[],
    "compTags":["POWER_WEAPON"]},"Ninkondi Prime":{"blockingAngle":55,"comboDuration":5,"followThrough":0.5,"range":2.307992,"windUp":0.5,"releaseDate":"2019-07-07","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":1,"crit_chance":22,"crit_mult":2.4,"status_chance":36,"damage":{"Impact":66,"Slash":50,"Puncture":28,"Electricity":90}},{"name":"Slam","speed":1,"crit_chance":22,"crit_mult":2.4,"status_chance":36,"unique":{"force_procs":["impact"]},"damage":{"Electricity":468}},{"name":"Heavy Slam","speed":1,"crit_chance":22,"crit_mult":2.4,"status_chance":36,"damage":{"Electricity":702}}],
    "imageName":"ninkondi-prime.webp","tags":["Tenno"],
    "compTags":["NUNCHAKU_STANCE"]},"Noctua (Dante)":{"noise":"Alarming","releaseDate":"2024-03-27","productCategory":"Pistols","category":"Secondary","type":"Secondary","magazineSize":9999999,"reloadTime":0,"multishot":1,"attacks":[{"name":"Normal Attack","speed":1.5,"crit_chance":30,"crit_mult":2,"status_chance":25,"shot_type":"Projectile","damage":{"Slash":250}},{"name":"Alt-Fire","speed":1,"crit_chance":45,"crit_mult":3,"status_chance":45,"shot_type":"Projectile","damage":{"Impact":1100,"Radiation":1650}}],
    "imageName":"noctua.webp","tags":[],
    "compTags":["POWER_WEAPON"]},"Ninkondi":{"blockingAngle":55,"comboDuration":5,"followThrough":0.5,"range":2.307992,"windUp":0.5,"releaseDate":"2015-09-09","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":1,"crit_chance":10,"crit_mult":2,"status_chance":35,"damage":{"Impact":90,"Electricity":100}},{"name":"Slam","speed":1,"crit_chance":10,"crit_mult":2,"status_chance":35,"unique":{"force_procs":["impact"]},"damage":{"Electricity":380}},{"name":"Heavy Slam","speed":1,"crit_chance":10,"crit_mult":2,"status_chance":35,"damage":{"Electricity":570}}],
    "imageName":"ninkondi.webp","tags":["Tenno"],
    "compTags":["NUNCHAKU_STANCE"]},"Nukor":{"noise":"Alarming","releaseDate":"2014-08-28","ammoCapacity":210,"productCategory":"Pistols","equipTime":1.1,"zoomProps":[[]],"category":"Secondary","trigger":"Held","type":"Pistol","magazineSize":50,"reloadTime":2,"multishot":1,"attacks":[{"name":"Normal Attack","speed":10,"crit_chance":3,"crit_mult":4,"status_chance":29,"shot_type":"Hit-Scan","damage":{"Radiation":22}}],
    "imageName":"nukor.webp","tags":["Grineer"],
    "compTags":["BEAM"]},"Ohma":{"blockingAngle":60,"comboDuration":5,"followThrough":0.6,"range":2.5,"windUp":0.7,"releaseDate":"2017-01-18","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":0.917,"crit_chance":15,"crit_mult":2,"status_chance":30,"damage":{"Impact":76,"Slash":38,"Electricity":110}},{"name":"Slam","speed":1,"crit_chance":15,"crit_mult":2,"status_chance":30,"unique":{"force_procs":["impact"]},"damage":{"Electricity":448}},{"name":"Heavy Slam","speed":1,"crit_chance":15,"crit_mult":2,"status_chance":30,"damage":{"Electricity":672}}],
    "imageName":"ohma.webp","tags":["Corpus"],
    "compTags":["TONFA_STANCE"]},"Obex":{"blockingAngle":50,"comboDuration":5,"followThrough":0.9,"range":1.25,"windUp":0.5,"releaseDate":"2013-11-06","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":1,"crit_chance":25,"crit_mult":2,"status_chance":10,"damage":{"Impact":84,"Slash":18,"Puncture":18}},{"name":"Slam","speed":1,"crit_chance":25,"crit_mult":2,"status_chance":10,"unique":{"force_procs":["impact"]},"damage":{"Electricity":240}},{"name":"Heavy Slam","speed":1,"crit_chance":25,"crit_mult":2,"status_chance":10,"damage":{"Electricity":360}}],
    "imageName":"obex.webp","tags":["Corpus","Incarnon"],
    "compTags":["SPARRING_STANCE"]},"Ocucor":{"noise":"Alarming","releaseDate":"2018-11-08","ammoCapacity":300,"productCategory":"Pistols","zoomProps":[[]],"category":"Secondary","trigger":"Held","type":"Pistol","magazineSize":60,"reloadTime":1.6,"multishot":1,"attacks":[{"name":"Normal Attack","speed":12,"crit_chance":16,"crit_mult":1.8,"status_chance":24,"shot_type":"Discharge","damage":{"Puncture":1,"Radiation":10}}],
    "imageName":"ocucor.webp","tags":["Corpus"],
    "compTags":["PROJECTILE","BEAM","OCUCOR"]},"Ogris":{"noise":"Alarming","releaseDate":"2013-05-23","ammoCapacity":20,"productCategory":"LongGuns","category":"Primary","trigger":"Charge","type":"Rifle","magazineSize":5,"reloadTime":2.5,"multishot":1,"attacks":[{"name":"Rocket Impact","speed":1.5,"crit_chance":5,"crit_mult":2,"status_chance":35,"shot_type":"Projectile","shot_speed":40,"flight":40,"damage":{"Blast":100}},{"name":"Rocket Explosion","speed":1.5,"crit_chance":5,"crit_mult":2,"status_chance":35,"shot_type":"AoE","damage":{"Blast":600},"falloff":{"start":0,"end":7.1,"reduction":0.8},"no_headshot_mult":true}],
    "imageName":"ogris.webp","tags":["Grineer"],
    "compTags":["PROJECTILE","SNIPER_AMMO","AOE","SINGLESHOT","OGRIS"],
    "comb":[[0,1]]},"Okina":{"blockingAngle":50,"comboDuration":5,"followThrough":0.8,"range":1.7,"windUp":0.5,"releaseDate":"2016-07-08","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":1.08,"crit_chance":16,"crit_mult":2,"status_chance":20,"damage":{"Impact":7,"Slash":70,"Puncture":63}},{"name":"Slam","speed":1,"crit_chance":16,"crit_mult":2,"status_chance":20,"unique":{"force_procs":["impact"]},"damage":{"Impact":280}},{"name":"Heavy Slam","speed":1,"crit_chance":16,"crit_mult":2,"status_chance":20,"damage":{"Blast":420}}],
    "imageName":"okina.webp","tags":["Tenno","Incarnon"],
    "compTags":["DUAL_DAGGERS_STANCE"]},"Okina Prime":{"blockingAngle":50,"comboDuration":5,"followThrough":0.8,"range":1.7,"windUp":0.5,"releaseDate":"2024-05-01","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":1.17,"crit_chance":30,"crit_mult":2.6,"status_chance":24,"damage":{"Impact":9.2,"Slash":110.4,"Puncture":64.4}},{"name":"Slam","speed":1,"crit_chance":30,"crit_mult":2.6,"status_chance":24,"unique":{"force_procs":["impact"]},"damage":{"Impact":368}},{"name":"Heavy Slam","speed":1,"crit_chance":30,"crit_mult":2.6,"status_chance":24,"damage":{"Blast":552}}],
    "imageName":"OkinaPrime.webp","tags":["Tenno","Incarnon"],
    "compTags":["DUAL_DAGGERS_STANCE"]},"Orthos Prime":{"blockingAngle":55,"comboDuration":5,"followThrough":0.6,"range":3,"windUp":0.9,"releaseDate":"2013-07-13","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":1.17,"crit_chance":24,"crit_mult":2.2,"status_chance":36,"damage":{"Impact":35.1,"Slash":163.8,"Puncture":35.1}},{"name":"Slam","speed":1,"crit_chance":24,"crit_mult":2.2,"status_chance":36,"unique":{"force_procs":["impact"]},"damage":{"Blast":468}},{"name":"Heavy Slam","speed":1,"crit_chance":24,"crit_mult":2.2,"status_chance":36,"damage":{"Blast":702}}],
    "imageName":"orthos-prime.webp","tags":["Prime","Never Vaulted"],
    "compTags":["POLEARMS_STANCE"]},"Onos":{"noise":"Alarming","releaseDate":"2024-03-27","ammoCapacity":210,"productCategory":"Pistols","zoomProps":[[]],"category":"Secondary","type":"Pistol","magazineSize":20,"reloadTime":2,"multishot":1,"attacks":[{"name":"Normal Attack","speed":1.4,"crit_chance":26,"crit_mult":2.4,"status_chance":22,"shot_type":"Projectile","shot_speed":100,"damage":{"Puncture":220}},{"name":"Incarnon Form","speed":2,"crit_chance":14,"crit_mult":1.6,"status_chance":18,"shot_type":"Projectile","shot_speed":40,"damage":{"Radiation":30}},{"name":"Incarnon Mode Charge Attack","speed":0.25,"crit_chance":38,"crit_mult":3.2,"status_chance":22,"shot_type":"Hit-Scan","unique":{"force_procs":["heat"]},"damage":{"Heat":2200}},{"name":"Incarnon Mode Charge Radial Attack","speed":0.25,"crit_chance":38,"crit_mult":3.2,"status_chance":22,"shot_type":"AoE","unique":{"force_procs":["heat"]},"damage":{"Radiation":1100},"no_headshot_mult":true}],
    "imageName":"onos.webp","tags":["Incarnon"],
    "compTags":["PROJECTILE","AOE"],
    "comb":[[2,3]]},"Orthos":{"blockingAngle":55,"comboDuration":5,"followThrough":0.6,"range":3,"windUp":0.9,"releaseDate":"2013-06-07","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":0.917,"crit_chance":6,"crit_mult":1.5,"status_chance":18,"damage":{"Impact":27.75,"Slash":129.5,"Puncture":27.75}},{"name":"Slam","speed":1,"crit_chance":6,"crit_mult":1.5,"status_chance":18,"unique":{"force_procs":["impact"]},"damage":{"Blast":370}},{"name":"Heavy Slam","speed":1,"crit_chance":6,"crit_mult":1.5,"status_chance":18,"damage":{"Blast":555}}],
    "imageName":"orthos.webp","tags":["Tenno"],
    "compTags":["POLEARMS_STANCE"]},"Orvius":{"blockingAngle":55,"comboDuration":5,"followThrough":0.7,"range":1.3,"windUp":1.2,"releaseDate":"2016-11-11","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":0.75,"crit_chance":18,"crit_mult":2,"status_chance":18,"damage":{"Impact":39,"Slash":146.25,"Puncture":9.75}},{"name":"Throw","speed":0.75,"crit_chance":20,"crit_mult":2.2,"status_chance":20,"shot_type":"Thrown","shot_speed":35,"flight":35,"damage":{"Impact":43,"Slash":161.25,"Puncture":10.75}},{"name":"Throw Bounce Explosion","speed":0.75,"crit_chance":20,"crit_mult":2.2,"status_chance":20,"shot_type":"AoE","damage":{"Blast":293},"falloff":{"start":0,"end":4,"reduction":0.4},"no_headshot_mult":true},{"name":"Throw Recall Explosion","speed":0.75,"crit_chance":20,"crit_mult":2.2,"status_chance":20,"shot_type":"AoE","unique":{"force_procs":["cold"]},"damage":{"Blast":586},"falloff":{"start":0,"end":4,"reduction":0},"no_headshot_mult":true},{"name":"Charged Throw","speed":0.833,"crit_chance":22,"crit_mult":2.4,"status_chance":22,"shot_type":"Thrown","shot_speed":35,"flight":35,"unique":{"force_procs":["impact"]},"damage":{"Impact":85.75,"Slash":321.75,"Puncture":21.5}},{"name":"Charged Throw Bounce Explosion","speed":0.833,"crit_chance":22,"crit_mult":2.4,"status_chance":22,"shot_type":"AoE","damage":{"Cold":585},"falloff":{"start":0,"end":4,"reduction":0.4},"no_headshot_mult":true},{"name":"Charged Throw Recall Explosion","speed":0.833,"crit_chance":22,"crit_mult":2.4,"status_chance":22,"shot_type":"AoE","unique":{"force_procs":["cold"]},"damage":{"Cold":1170},"falloff":{"start":0,"end":4,"reduction":0},"no_headshot_mult":true},{"name":"Hover Attack","speed":0.75,"crit_chance":20,"crit_mult":2.2,"status_chance":60,"damage":{"Cold":75}},{"name":"Slam","speed":1,"crit_chance":18,"crit_mult":2,"status_chance":18,"unique":{"force_procs":["impact"]},"damage":{"Impact":390}},{"name":"Heavy Slam","speed":1,"crit_chance":18,"crit_mult":2,"status_chance":18,"damage":{"Blast":585}}],
    "imageName":"orvius.webp","tags":[],
    "compTags":["GLAIVES_STANCE"],
    "comb":[[1,2],
    [4,5]]},"Opticor Vandal":{"noise":"Alarming","releaseDate":"2019-03-08","ammoCapacity":200,"productCategory":"LongGuns","category":"Primary","trigger":"Charge","type":"Rifle","magazineSize":8,"reloadTime":1.4,"multishot":1,"attacks":[{"name":"Charged Shot","speed":2,"crit_chance":24,"crit_mult":2.6,"status_chance":30,"shot_type":"Hit-Scan","damage":{"Impact":40,"Slash":80,"Puncture":280}},{"name":"Charged Shot AoE","speed":2,"crit_chance":24,"crit_mult":2.6,"status_chance":30,"damage":{"Magnetic":200},"falloff":{"start":0,"end":4.6,"reduction":0.6}},{"name":"Quick Shot","speed":2,"crit_chance":24,"crit_mult":2.6,"status_chance":30,"shot_type":"Hit-Scan","damage":{"Impact":20,"Slash":40,"Puncture":140}},{"name":"Quick Shot AoE","speed":2,"crit_chance":24,"crit_mult":2.6,"status_chance":30,"shot_type":"AoE","damage":{"Magnetic":100},"falloff":{"start":0,"end":4.6,"reduction":0.6},"no_headshot_mult":true}],
    "imageName":"opticor-vandal.webp","tags":["Corpus","Vandal"],
    "compTags":["ASSAULT_AMMO","AOE","SINGLESHOT"],
    "comb":[[0,1],
    [2,3]]},"Ooltha (Staff)":{"comboDuration":5,"range":1,"windUp":1,"releaseDate":"2017-10-12","productCategory":"Melee","category":"Melee","type":"Zaw Component","multishot":1,"attacks":[{"name":"Ooltha Strike","speed":0.92,"crit_chance":18,"crit_mult":2,"status_chance":18,"damage":{"Impact":22.4,"Slash":112,"Puncture":89.6}}],
    "imageName":"ooltha.webp","tags":[],
    "compTags":["STAVES_STANCE"]},"Ooltha (Sword)":{"comboDuration":5,"range":1,"windUp":1,"releaseDate":"2017-10-12","productCategory":"Melee","category":"Melee","type":"Zaw Component","multishot":1,"attacks":[{"name":"Ooltha Strike","speed":0.92,"crit_chance":18,"crit_mult":2,"status_chance":18,"damage":{"Impact":22.4,"Slash":112,"Puncture":89.6}}],
    "imageName":"ooltha.webp","tags":[],
    "compTags":["SWORDS_STANCE"]},"Pandero":{"noise":"Alarming","releaseDate":"2017-03-24","productCategory":"Pistols","category":"Secondary","trigger":"Semi","type":"Pistol","magazineSize":8,"reloadTime":1,"multishot":1,"attacks":[{"name":"Normal Attack","speed":3,"crit_chance":30,"crit_mult":2.8,"status_chance":10,"shot_type":"Hit-Scan","damage":{"Impact":18,"Slash":36,"Puncture":18}},{"name":"Alt-Fire","speed":7.69,"crit_chance":30,"crit_mult":2.8,"status_chance":10,"shot_type":"Hit-Scan","damage":{"Impact":18,"Slash":36,"Puncture":18}}],
    "imageName":"pandero.webp","tags":["Tenno"],
    "compTags":[]},"Opticor":{"noise":"Alarming","releaseDate":"2014-10-24","ammoCapacity":200,"productCategory":"LongGuns","category":"Primary","trigger":"Charge","type":"Rifle","magazineSize":5,"reloadTime":2,"multishot":1,"attacks":[{"name":"Charged Shot","speed":1,"crit_chance":20,"crit_mult":2.5,"status_chance":20,"shot_type":"Hit-Scan","damage":{"Impact":100,"Slash":50,"Puncture":850}},{"name":"Charged Shot AoE","speed":1,"crit_chance":20,"crit_mult":2.5,"status_chance":20,"shot_type":"AoE","damage":{"Magnetic":400},"falloff":{"start":0,"end":6,"reduction":0.6},"no_headshot_mult":true},{"name":"Quick Shot","speed":1,"crit_chance":20,"crit_mult":2.5,"status_chance":20,"shot_type":"Hit-Scan","damage":{"Impact":50,"Slash":25,"Puncture":425}},{"name":"Quick Shot AoE","speed":1,"crit_chance":20,"crit_mult":2.5,"status_chance":20,"shot_type":"AoE","damage":{"Magnetic":200},"falloff":{"start":0,"end":6,"reduction":0.6},"no_headshot_mult":true}],
    "imageName":"opticor.webp","tags":["Corpus"],
    "compTags":["ASSAULT_AMMO","AOE","SINGLESHOT"],
    "comb":[[0,1],
    [2,3]]},"Pandero Prime":{"noise":"Alarming","releaseDate":"2021-02-23","productCategory":"Pistols","category":"Secondary","trigger":"Semi","type":"Pistol","magazineSize":8,"reloadTime":1,"multishot":1,"attacks":[{"name":"Normal Attack","speed":3,"crit_chance":30,"crit_mult":2.8,"status_chance":24,"shot_type":"Hit-Scan","damage":{"Impact":26,"Slash":52,"Puncture":26}},{"name":"Alt-Fire","speed":7.69,"crit_chance":30,"crit_mult":2.8,"status_chance":24,"damage":{"Impact":26,"Slash":52,"Puncture":26}}],
    "imageName":"pandero-prime.webp","tags":["Prime"],
    "compTags":[]},"Pangolin Prime":{"blockingAngle":50,"comboDuration":5,"followThrough":0.6,"range":2.5,"windUp":0.6,"releaseDate":"2020-03-31","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":0.917,"crit_chance":26,"crit_mult":2.2,"status_chance":30,"damage":{"Impact":12.4,"Slash":198.4,"Puncture":37.2}},{"name":"Slam","speed":1,"crit_chance":26,"crit_mult":2.2,"status_chance":30,"unique":{"force_procs":["slash","impact"]},"damage":{"Impact":496}},{"name":"Heavy Slam","speed":1,"crit_chance":26,"crit_mult":2.2,"status_chance":30,"damage":{"Blast":744}}],
    "imageName":"pangolin-prime.webp","tags":["Prime","Tenno"],
    "compTags":["SWORDS_STANCE"]},"Pangolin Sword":{"blockingAngle":55,"comboDuration":5,"followThrough":0.6,"range":2.5,"windUp":0.6,"releaseDate":"2012-12-18","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":0.917,"crit_chance":8,"crit_mult":1.5,"status_chance":22,"damage":{"Impact":7.5,"Slash":120,"Puncture":22.5}},{"name":"Slam","speed":1,"crit_chance":8,"crit_mult":1.5,"status_chance":22,"unique":{"force_procs":["slash","impact"]},"damage":{"Puncture":300}},{"name":"Heavy Slam","speed":1,"crit_chance":8,"crit_mult":1.5,"status_chance":22,"damage":{"Blast":450}}],
    "imageName":"pangolin-sword.webp","tags":["Tenno"],
    "compTags":["SWORDS_STANCE"]},"Panthera":{"noise":"Alarming","releaseDate":"2015-01-15","ammoCapacity":540,"productCategory":"LongGuns","category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":30,"reloadTime":2,"multishot":1,"attacks":[{"name":"Normal Attack","speed":3,"crit_chance":12,"crit_mult":2,"status_chance":24,"shot_type":"Projectile","shot_speed":60,"flight":60,"damage":{"Impact":20,"Slash":70,"Puncture":10}},{"name":"Alt-Fire","speed":2,"crit_chance":25,"crit_mult":2,"status_chance":35,"shot_type":"Discharge","damage":{"Impact":10,"Slash":80,"Puncture":10}}],
    "imageName":"panthera.webp","tags":["Tenno"],
    "compTags":["PROJECTILE","ASSAULT_AMMO","BEAM"]},"Panthera Prime":{"noise":"Alarming","releaseDate":"2020-07-14","ammoCapacity":320,"productCategory":"LongGuns","zoomProps":[[]],"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":40,"reloadTime":2.4000001,"multishot":1,"attacks":[{"name":"Normal Attack","speed":3.67,"crit_chance":18,"crit_mult":2,"status_chance":30,"shot_type":"Projectile","shot_speed":80,"flight":80,"damage":{"Impact":20,"Slash":70,"Puncture":10}},{"name":"Radial Attack","speed":3.67,"crit_chance":18,"crit_mult":2,"status_chance":30,"shot_type":"AoE","damage":{"Slash":20},"falloff":{"start":0,"end":1.6,"reduction":0.2},"no_headshot_mult":true},{"name":"Alt-Fire","speed":2,"crit_chance":26,"crit_mult":2,"status_chance":38,"shot_type":"Discharge","damage":{"Slash":100}}],
    "imageName":"panthera-prime.webp","tags":["Prime"],
    "compTags":["PROJECTILE","ASSAULT_AMMO","BEAM"],
    "comb":[[0,1]]},"Paracesis":{"blockingAngle":55,"comboDuration":5,"followThrough":0.6,"range":2.9,"windUp":1.1,"releaseDate":"2018-10-12","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":0.917,"crit_chance":31,"crit_mult":2.6,"status_chance":22,"damage":{"Impact":48.8,"Slash":155.4,"Puncture":17.8}},{"name":"Slam","speed":1,"crit_chance":31,"crit_mult":2.6,"status_chance":22,"unique":{"force_procs":["impact"]},"damage":{"Impact":444}},{"name":"Heavy Slam","speed":1,"crit_chance":31,"crit_mult":2.6,"status_chance":22,"damage":{"Blast":666}}],
    "imageName":"paracesis.webp","tags":["Orokin"],
    "compTags":["HEAVY_BLADE_STANCE"]},"Paris Prime":{"noise":"Silent","releaseDate":"2013-07-13","ammoCapacity":72,"productCategory":"LongGuns","equipTime":1.1,"category":"Primary","trigger":"Charge","type":"Rifle","magazineSize":1,"reloadTime":0.7,"multishot":1,"attacks":[{"name":"Uncharged Shot","speed":1,"crit_chance":45,"crit_mult":2,"status_chance":20,"shot_type":"Projectile","shot_speed":70,"flight":70,"damage":{"Impact":9,"Slash":18,"Puncture":153}},{"name":"Charged Shot","speed":1,"crit_chance":45,"crit_mult":2,"status_chance":20,"shot_type":"Projectile","shot_speed":95,"flight":95,"damage":{"Impact":9,"Slash":63,"Puncture":288}},{"name":"Incarnon Form","speed":1,"crit_chance":50,"crit_mult":3.4,"status_chance":20,"damage":{"Impact":100,"Heat":420}}],
    "imageName":"paris-prime.webp","tags":["Prime","Never Vaulted","Incarnon"],
    "compTags":["PROJECTILE","PARIS_PRIME"]},"Paracyst":{"noise":"Alarming","releaseDate":"2014-11-27","ammoCapacity":540,"productCategory":"LongGuns","equipTime":1.1,"category":"Primary","trigger":"Burst","type":"Rifle","magazineSize":60,"reloadTime":2,"multishot":1,"attacks":[{"name":"Normal Attack","speed":8.33,"crit_chance":10,"crit_mult":2,"status_chance":30,"shot_type":"Projectile","shot_speed":100,"flight":100,"damage":{"Toxin":33}},{"name":"Infested Harpoon","speed":5,"crit_chance":0,"crit_mult":1,"status_chance":30,"shot_type":"Projectile","shot_speed":80,"flight":80,"damage":{"Toxin":15}},{"name":"Infested Harpoon Contact","speed":1,"crit_chance":0,"crit_mult":1,"status_chance":30,"damage":{"Toxin":15}}],
    "imageName":"paracyst.webp","tags":["Infested"],
    "compTags":["PROJECTILE","ASSAULT_AMMO"]},"Pennant":{"blockingAngle":55,"comboDuration":5,"followThrough":0.7,"range":3,"windUp":0.7,"releaseDate":"2019-12-13","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":0.917,"crit_chance":32,"crit_mult":2.4,"status_chance":10,"damage":{"Impact":20,"Slash":40,"Puncture":140}},{"name":"Slam","speed":1,"crit_chance":32,"crit_mult":2.4,"status_chance":10,"unique":{"force_procs":["impact"]},"damage":{"Impact":400}},{"name":"Heavy Slam","speed":1,"crit_chance":32,"crit_mult":2.4,"status_chance":10,"damage":{"Blast":600}}],
    "imageName":"pennant.webp","tags":["Tenno"],
    "compTags":["LONG_KATANA_STANCE"]},"Paris":{"noise":"Silent","releaseDate":"2013-03-18","ammoCapacity":72,"productCategory":"LongGuns","equipTime":1.1,"category":"Primary","trigger":"Charge","type":"Rifle","magazineSize":1,"reloadTime":0.64999998,"multishot":1,"attacks":[{"name":"Uncharged Shot","speed":1,"crit_chance":30,"crit_mult":2,"status_chance":10,"shot_type":"Projectile","shot_speed":70,"flight":70,"damage":{"Impact":8,"Slash":32,"Puncture":120}},{"name":"Charged Shot","speed":1,"crit_chance":30,"crit_mult":2,"status_chance":10,"shot_type":"Projectile","shot_speed":85,"flight":85,"damage":{"Impact":16,"Slash":48,"Puncture":256}},{"name":"Incarnon Form","speed":1,"crit_chance":40,"crit_mult":3,"status_chance":20,"shot_type":"Projectile","damage":{"Impact":95,"Heat":365}}],
    "imageName":"paris.webp","tags":["Tenno","Incarnon"],
    "compTags":["PROJECTILE"]},"Pathocyst":{"blockingAngle":55,"comboDuration":5,"followThrough":0.7,"range":1.3,"windUp":1.2,"releaseDate":"2019-09-26","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":0.667,"crit_chance":15,"crit_mult":2.1,"status_chance":30,"damage":{"Impact":57,"Slash":61,"Puncture":55,"Viral":89}},{"name":"Throw","speed":0.667,"crit_chance":17,"crit_mult":2.3,"status_chance":33,"shot_type":"Thrown","shot_speed":30,"flight":30,"damage":{"Impact":49,"Slash":78,"Puncture":43,"Viral":118}},{"name":"Throw Bounce Explosion","speed":0.667,"crit_chance":17,"crit_mult":2.3,"status_chance":33,"shot_type":"AoE","damage":{"Viral":393},"falloff":{"start":0,"end":4.9,"reduction":0.5},"no_headshot_mult":true},{"name":"Throw Recall Explosion","speed":0.667,"crit_chance":17,"crit_mult":2.3,"status_chance":33,"shot_type":"AoE","unique":{"force_procs":["impact","viral"]},"damage":{"Viral":786},"falloff":{"start":0,"end":4.9,"reduction":0},"no_headshot_mult":true},{"name":"Charged Throw","speed":0.833,"crit_chance":21,"crit_mult":2.5,"status_chance":35,"shot_type":"Thrown","shot_speed":30,"flight":30,"damage":{"Impact":127,"Slash":135,"Puncture":121,"Viral":193}},{"name":"Charged Throw Bounce Explosion","speed":0.833,"crit_chance":21,"crit_mult":2.5,"status_chance":35,"shot_type":"AoE","damage":{"Viral":786},"falloff":{"start":0,"end":4.9,"reduction":0.5},"no_headshot_mult":true},{"name":"Charged Throw Recall Explosion","speed":0.833,"crit_chance":21,"crit_mult":2.5,"status_chance":35,"shot_type":"AoE","unique":{"force_procs":["impact","viral"]},"damage":{"Viral":1572},"falloff":{"start":0,"end":4.9,"reduction":0},"no_headshot_mult":true},{"name":"Slam","speed":1,"crit_chance":15,"crit_mult":2.1,"status_chance":30,"unique":{"force_procs":["impact"]},"damage":{"Viral":524}},{"name":"Heavy Slam","speed":1,"crit_chance":15,"crit_mult":2.1,"status_chance":30,"damage":{"Viral":786}}],
    "imageName":"pathocyst.webp","tags":["Infested"],
    "compTags":["GLAIVES_STANCE"],
    "comb":[[1,2],
    [4,5]]},"Perigale":{"noise":"Alarming","releaseDate":"2022-11-30","ammoCapacity":24,"productCategory":"LongGuns","category":"Primary","trigger":"Burst","type":"Rifle","magazineSize":12,"reloadTime":3,"multishot":1,"attacks":[{"name":"Normal Attack","speed":2,"crit_chance":28,"crit_mult":2.6,"status_chance":16,"shot_type":"Hit-Scan","unique":{"WITH_COND":{"ammoEff":1}},"damage":{"Impact":20.64,"Slash":55,"Puncture":96.32},"falloff":{"start":300,"end":600,"reduction":0.2}},{"name":"2.0x Zoom","speed":2,"crit_chance":28,"crit_mult":2.6,"status_chance":16,"shot_type":"Hit-Scan","unique":{"WITH_COND":{"ammoEff":1},"crit_mult":0.2},"damage":{"Impact":20.64,"Slash":55,"Puncture":96.32}},{"name":"4.0x Zoom","speed":2,"crit_chance":28,"crit_mult":2.6,"status_chance":16,"shot_type":"Hit-Scan","unique":{"WITH_COND":{"ammoEff":1},"crit_mult":0.4},"damage":{"Impact":20.64,"Slash":55,"Puncture":96.32}}],
    "imageName":"perigale.webp","tags":["Tenno"],
    "compTags":["SNIPER_AMMO"]},"Phantasma":{"noise":"Alarming","releaseDate":"2018-08-24","ammoCapacity":275,"productCategory":"LongGuns","zoomProps":[[]],"category":"Primary","trigger":"Held","type":"Shotgun","magazineSize":11,"reloadTime":0.5,"multishot":6,"attacks":[{"name":"Beam","speed":12,"crit_chance":3,"crit_mult":1.5,"status_chance":22.2,"shot_type":"Discharge","damage":{"Impact":5,"Radiation":10}},{"name":"Plasma Bomb Impact","speed":2,"crit_chance":3,"crit_mult":1.5,"status_chance":37,"shot_type":"Projectile","shot_speed":25,"flight":25,"unique":{"force_procs":["impact"]},"damage":{"Impact":15}},{"name":"Plasma Bomb Explosion","speed":2,"crit_chance":3,"crit_mult":1.5,"status_chance":37,"shot_type":"AoE","unique":{"force_procs":["impact"]},"damage":{"Radiation":73},"falloff":{"start":0,"end":4.8,"reduction":0.5},"no_headshot_mult":true},{"name":"Cluster Bombs Impact","speed":2,"crit_chance":3,"crit_mult":1.5,"status_chance":37,"shot_type":"Projectile","shot_speed":6,"flight":6,"damage":{"Impact":3}},{"name":"Cluster Bombs Explosion","speed":2,"crit_chance":3,"crit_mult":1.5,"status_chance":37,"shot_type":"AoE","unique":{"force_procs":["impact"]},"damage":{"Radiation":18},"no_headshot_mult":true}],
    "imageName":"phantasma.webp","tags":["Sentient"],
    "compTags":["BEAM"],
    "comb":[[1,2],
    [3,4]]},"Phaedra (Arch-mode)":{"releaseDate":"2015-10-01","ammoCapacity":0,"productCategory":"Archguns","zoomProps":[[]],"category":"Archgun","type":"Archgun","magazineSize":240,"reloadTime":5.05,"multishot":1,"attacks":[{"name":"Normal Attack","speed":18.75,"crit_chance":14,"crit_mult":2,"status_chance":30,"shot_type":"Projectile","shot_speed":220,"damage":{"Impact":14,"Puncture":36.4,"Slash":5.6}}],
    "imageName":"Phaedra.webp","tags":[],
    "compTags":["BATTERY"]},"Perigale Prime":{"noise":"Alarming","releaseDate":"2026-04-08","ammoCapacity":32,"productCategory":"LongGuns","category":"Primary","trigger":"Burst","type":"Rifle","magazineSize":16,"reloadTime":3,"multishot":1,"attacks":[{"name":"Normal Attack","speed":2,"crit_chance":32,"crit_mult":2.6,"status_chance":20,"shot_type":"Hit-Scan","unique":{"WITH_COND":{"ammoEff":1}},"damage":{"Impact":22.08,"Slash":58.88,"Puncture":103.04}},{"name":"2.0x Zoom","speed":2,"crit_chance":32,"crit_mult":2.6,"status_chance":20,"shot_type":"Hit-Scan","unique":{"WITH_COND":{"ammoEff":1},"crit_mult":0.2},"damage":{"Impact":22.08,"Slash":58.88,"Puncture":103.04}},{"name":"4.0x Zoom","speed":2,"crit_chance":32,"crit_mult":2.6,"status_chance":20,"shot_type":"Hit-Scan","unique":{"WITH_COND":{"ammoEff":1},"crit_mult":0.4},"damage":{"Impact":22.08,"Slash":58.88,"Puncture":103.04}}],
    "imageName":"PerigalePrime.webp","tags":["Tenno"],
    "compTags":["SNIPER_AMMO"]},"Phage":{"noise":"Alarming","releaseDate":"2014-02-05","ammoCapacity":720,"productCategory":"LongGuns","zoomProps":[[]],"category":"Primary","trigger":"Held","type":"Shotgun","magazineSize":90,"reloadTime":2,"multishot":7,"attacks":[{"name":"Normal Attack","speed":12,"crit_chance":19,"crit_mult":2,"status_chance":15.5,"shot_type":"Discharge","damage":{"Viral":5}}],
    "imageName":"phage.webp","tags":["Infested"],
    "compTags":["BEAM"]},"Plague Keewar (Scythe)":{"comboDuration":5,"range":1,"windUp":1,"releaseDate":"2017-11-15","productCategory":"Melee","category":"Melee","type":"Zaw Component","multishot":1,"attacks":[{"name":"Plague Keewar Strike","speed":0.88,"crit_chance":18,"crit_mult":2,"status_chance":22,"damage":{"Impact":88,"Slash":91,"Puncture":57,"Viral":70}}],
    "imageName":"PlagueKeewar.webp","tags":[],
    "compTags":["SCYTHES_STANCE"]},"Penta":{"noise":"Alarming","releaseDate":"2013-12-12","ammoCapacity":20,"productCategory":"LongGuns","equipTime":0.4,"category":"Primary","trigger":"Active","type":"Rifle","magazineSize":5,"reloadTime":2.5,"multishot":1,"attacks":[{"name":"Grenade Impact","speed":1,"crit_chance":10,"crit_mult":2,"status_chance":10,"shot_type":"Projectile","shot_speed":20,"flight":20,"damage":{"Impact":75}},{"name":"Grenade Detonation","speed":1,"crit_chance":10,"crit_mult":2,"status_chance":10,"shot_type":"AoE","damage":{"Blast":350},"falloff":{"start":0,"end":4,"reduction":0.5},"no_headshot_mult":true}],
    "imageName":"penta.webp","tags":["Corpus"],
    "compTags":["PROJECTILE","SNIPER_AMMO","AOE","SINGLESHOT","PENTA"],
    "comb":[[0,1]]},"Phantasma Prime":{"noise":"Alarming","releaseDate":"2022-10-05","ammoCapacity":330,"productCategory":"LongGuns","zoomProps":[[]],"category":"Primary","trigger":"Held","type":"Shotgun","magazineSize":11,"reloadTime":0.5,"multishot":6,"attacks":[{"name":"Beam","speed":12,"crit_chance":11,"crit_mult":1.9,"status_chance":22.2,"shot_type":"Discharge","damage":{"Impact":5,"Radiation":10}},{"name":"Plasma Bomb Impact","speed":2,"crit_chance":3,"crit_mult":1.5,"status_chance":37,"shot_type":"Projectile","shot_speed":25,"flight":25,"unique":{"force_procs":["impact"]},"damage":{"Impact":15}},{"name":"Plasma Bomb Explosion","speed":2,"crit_chance":3,"crit_mult":1.5,"status_chance":37,"shot_type":"AoE","unique":{"force_procs":["impact"]},"damage":{"Radiation":73},"falloff":{"start":0,"end":4.8,"reduction":0.5},"no_headshot_mult":true},{"name":"Cluster Bombs Impact","speed":2,"crit_chance":3,"crit_mult":1.5,"status_chance":37,"shot_type":"Projectile","shot_speed":6,"flight":6,"damage":{"Impact":3}},{"name":"Cluster Bombs Explosion","speed":2,"crit_chance":3,"crit_mult":1.5,"status_chance":37,"shot_type":"AoE","unique":{"force_procs":["impact"]},"damage":{"Radiation":18},"no_headshot_mult":true}],
    "imageName":"phantasma-prime.webp","tags":["Prime","Sentient"],
    "compTags":["BEAM"],
    "comb":[[1,2],
    [3,4]]},"Phenmor":{"noise":"Alarming","releaseDate":"2022-04-27","ammoCapacity":540,"productCategory":"LongGuns","equipTime":1.1,"zoomProps":[[]],"category":"Primary","trigger":"Semi","type":"Rifle","magazineSize":30,"reloadTime":2.8,"multishot":1,"attacks":[{"name":"Normal Attack","speed":3,"crit_chance":20,"crit_mult":2,"status_chance":20,"shot_type":"Projectile","shot_speed":120,"flight":120,"damage":{"Slash":98,"Puncture":42}},{"name":"Incarnon Form","speed":13.33,"crit_chance":20,"crit_mult":2,"status_chance":20,"shot_type":"Projectile","shot_speed":80,"flight":80,"damage":{"Slash":80,"Radiation":60}}],
    "imageName":"phenmor.webp","tags":["Zariman","Incarnon"],
    "compTags":["ASSAULT_AMMO","PROJECTILE"]},"Phaedra (Atmo-mode)":{"releaseDate":"2018-12-18","ammoCapacity":960,"productCategory":"Archguns","zoomProps":[[]],"category":"Archgun","type":"Archgun","magazineSize":240,"reloadTime":2,"multishot":1,"attacks":[{"name":"Normal Attack","speed":18.75,"crit_chance":14,"crit_mult":2,"status_chance":30,"shot_type":"Hit-Scan","damage":{"Impact":29,"Puncture":75.4,"Slash":11.6}}],
    "imageName":"Phaedra.webp","tags":[],
    "compTags":[]},"Plague Keewar (Staff)":{"comboDuration":5,"range":1,"windUp":1,"releaseDate":"2017-11-15","productCategory":"Melee","category":"Melee","type":"Zaw Component","multishot":1,"attacks":[{"name":"Plague Keewar Strike","speed":0.88,"crit_chance":18,"crit_mult":2,"status_chance":22,"damage":{"Impact":88,"Slash":91,"Puncture":57,"Viral":70}}],
    "imageName":"PlagueKeewar.webp","tags":[],
    "compTags":["STAVES_STANCE"]},"Praedos":{"blockingAngle":60,"comboDuration":5,"followThrough":0.6,"range":2.5,"windUp":0.7,"releaseDate":"2022-04-27","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":1.17,"crit_chance":20,"crit_mult":2,"status_chance":20,"damage":{"Impact":20,"Slash":160,"Puncture":20}},{"name":"Slam","speed":1,"crit_chance":20,"crit_mult":2,"status_chance":20,"unique":{"force_procs":["impact"]},"damage":{"Impact":400}},{"name":"Heavy Slam","speed":1,"crit_chance":20,"crit_mult":2,"status_chance":20,"damage":{"Blast":600}}],
    "imageName":"praedos.webp","tags":["Zariman","Incarnon"],
    "compTags":["TONFA_STANCE"]},"Prisma Angstrum":{"noise":"Alarming","releaseDate":"2017-09-09","ammoCapacity":18,"productCategory":"Pistols","category":"Secondary","trigger":"Charge","type":"Pistol","magazineSize":1,"reloadTime":1.8,"multishot":1,"attacks":[{"name":"Single Rocket Impact","speed":2,"crit_chance":18,"crit_mult":2.2,"status_chance":26,"shot_type":"Projectile","shot_speed":150,"flight":150,"damage":{"Blast":200}},{"name":"Single Rocket Explosion","speed":2,"crit_chance":18,"crit_mult":2.2,"status_chance":26,"shot_type":"AoE","damage":{"Blast":250},"falloff":{"start":0,"end":3.6,"reduction":0.4},"no_headshot_mult":true},{"name":"Incarnon Form","speed":6,"crit_chance":26,"crit_mult":2.2,"status_chance":20,"shot_type":"Projectile","damage":{"Heat":50}}],
    "imageName":"prisma-angstrum.webp","tags":["Prisma","Baro","Incarnon"],
    "compTags":["PROJECTILE","AOE","SINGLESHOT"],
    "comb":[[0,1]]},"Plague Kripath (Rapier)":{"comboDuration":5,"range":1,"windUp":1,"releaseDate":"2017-11-15","productCategory":"Melee","category":"Melee","type":"Zaw Component","multishot":1,"attacks":[{"name":"Plague Kripath Strike","speed":0.95,"crit_chance":22,"crit_mult":2.2,"status_chance":18,"damage":{"Impact":30,"Slash":49,"Puncture":70,"Viral":64}}],
    "imageName":"PlagueKripath.webp","tags":[],
    "compTags":["RAPIER_STANCE"]},"Pride":{"blockingAngle":65,"comboDuration":5,"followThrough":0.4,"range":2.8,"windUp":1,"releaseDate":"2026-06-17","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":1.2,"crit_chance":15,"crit_mult":2,"status_chance":35,"damage":{"Slash":125,"Puncture":125}},{"name":"Slam","speed":1,"crit_chance":15,"crit_mult":2,"status_chance":35,"unique":{"force_procs":["impact"],
    "WITH_COND":{"status_chance":1.5}},"damage":{"Impact":500}},{"name":"Heavy Slam","speed":1,"crit_chance":15,"crit_mult":2,"status_chance":28,"unique":{"WITH_COND":{"status_chance":1.5}},"damage":{"Blast":750}}],
    "imageName":"Pride.webp","tags":[],
    "compTags":["HEAVY SCYTHE_STANCE"]},"Plague Kripath (Polearm)":{"comboDuration":5,"range":1,"windUp":1,"releaseDate":"2017-11-15","productCategory":"Melee","category":"Melee","type":"Zaw Component","multishot":1,"attacks":[{"name":"Plague Kripath Strike","speed":0.95,"crit_chance":22,"crit_mult":2.2,"status_chance":18,"damage":{"Impact":30,"Slash":49,"Puncture":70,"Viral":64}}],
    "imageName":"PlagueKripath.webp","tags":[],
    "compTags":["POLEARMS_STANCE"]},"Prisma Dual Cleavers":{"blockingAngle":60,"comboDuration":5,"followThrough":0.5,"range":1.7,"windUp":0.7,"releaseDate":"2015-07-10","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":1,"crit_chance":25,"crit_mult":3,"status_chance":25,"damage":{"Impact":13.3,"Slash":106.4,"Puncture":13.3}},{"name":"Slam","speed":1,"crit_chance":25,"crit_mult":3,"status_chance":25,"unique":{"force_procs":["impact"]},"damage":{"Impact":266}},{"name":"Heavy Slam","speed":1,"crit_chance":25,"crit_mult":3,"status_chance":25,"damage":{"Blast":399}}],
    "imageName":"prisma-dual-cleavers.webp","tags":["Prisma","Baro"],
    "compTags":["DUAL_SWORDS_STANCE","DUAL CLEAVERS"]},"Plasma Sword":{"blockingAngle":55,"comboDuration":5,"followThrough":0.6,"range":2.5,"windUp":0.6,"releaseDate":"2012-12-18","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":0.667,"crit_chance":18,"crit_mult":2,"status_chance":18,"damage":{"Impact":34,"Slash":88,"Puncture":12,"Electricity":66}},{"name":"Slam","speed":1,"crit_chance":18,"crit_mult":2,"status_chance":18,"unique":{"force_procs":["electricity","impact"]},"damage":{"Electricity":400}},{"name":"Heavy Slam","speed":1,"crit_chance":18,"crit_mult":2,"status_chance":18,"damage":{"Electricity":600}}],
    "imageName":"plasma-sword.webp","tags":["Tenno"],
    "compTags":["SWORDS_STANCE"]},"Pox":{"noise":"Silent","releaseDate":"2016-08-19","ammoCapacity":20,"productCategory":"Pistols","category":"Secondary","trigger":"Auto","type":"Pistol","magazineSize":4,"reloadTime":1,"multishot":1,"attacks":[{"name":"Spore Impact","speed":2.08,"crit_chance":1,"crit_mult":2,"status_chance":35,"shot_type":"Projectile","shot_speed":30,"flight":30,"damage":{"Toxin":50}},{"name":"Poison Cloud","speed":1,"crit_chance":1,"crit_mult":2,"status_chance":35,"shot_type":"AoE","damage":{"Toxin":20},"falloff":{"start":0,"end":3.6,"reduction":0},"no_headshot_mult":true}],
    "imageName":"pox.webp","tags":["Infested"],
    "compTags":["PROJECTILE","AOE","SINGLESHOT"]},"Plinx":{"noise":"Alarming","releaseDate":"2018-12-18","ammoCapacity":8,"productCategory":"Pistols","zoomProps":[[]],"category":"Secondary","trigger":"Semi","type":"Pistol","magazineSize":10,"reloadTime":1.3,"multishot":1,"attacks":[{"name":"Normal Attack","speed":3.33,"crit_chance":32,"crit_mult":3,"status_chance":4,"shot_type":"Hit-Scan","damage":{"Puncture":26,"Heat":20}}],
    "imageName":"plinx.webp","tags":["Corpus"],
    "compTags":["PROJECTILE"]},"Prisma Dual Decurions (Arch-mode)":{"releaseDate":"2020-12-11","ammoCapacity":0,"productCategory":"Archguns","zoomProps":[[]],"category":"Archgun","type":"Archgun","magazineSize":64,"reloadTime":0.89,"multishot":1,"attacks":[{"name":"Normal Attack","speed":12.5,"crit_chance":30,"crit_mult":2.2,"status_chance":24,"shot_type":"Projectile","shot_speed":300,"damage":{"Impact":49.5,"Puncture":30.3,"Slash":30.2}}],
    "imageName":"PrismaDualDecurions.webp","tags":[""],
    "compTags":["BATTERY"]},"Prisma Grinlok":{"noise":"Alarming","releaseDate":"2019-03-08","productCategory":"LongGuns","equipTime":1.1,"category":"Primary","trigger":"Semi","type":"Rifle","magazineSize":21,"reloadTime":1.7,"multishot":1,"attacks":[{"name":"Normal Attack","speed":1.67,"crit_chance":21,"crit_mult":2.9,"status_chance":37,"shot_type":"Hit-Scan","damage":{"Impact":74.8,"Slash":93.5,"Puncture":18.7}}],
    "imageName":"prisma-grinlok.webp","tags":["Prisma","Baro"],
    "compTags":["ASSAULT_AMMO","GRINLOK"]},"Prisma Dual Decurions (Atmo-mode)":{"releaseDate":"2020-12-11","ammoCapacity":512,"productCategory":"Archguns","zoomProps":[[]],"category":"Archgun","type":"Archgun","magazineSize":64,"reloadTime":1.4,"multishot":1,"attacks":[{"name":"Normal Attack","speed":12.5,"crit_chance":30,"crit_mult":2.2,"status_chance":24,"shot_type":"Hit-Scan","damage":{"Impact":99,"Puncture":60.5,"Slash":60.5}}],
    "imageName":"PrismaDualDecurions.webp","tags":[""],
    "compTags":["BATTERY"]},"Prisma Lenz":{"noise":"Alarming","releaseDate":"2023-05-12","ammoCapacity":8,"productCategory":"LongGuns","equipTime":1.8,"zoomProps":[[]],"category":"Primary","trigger":"Charge","type":"Rifle","magazineSize":1,"reloadTime":0.6,"multishot":1,"attacks":[{"name":"Charged Shot","speed":1,"crit_chance":50,"crit_mult":2.8,"status_chance":16,"shot_type":"Projectile","shot_speed":60,"flight":60,"unique":{"force_procs":["impact"]},"damage":{"Impact":56}},{"name":"Initial Blast","speed":1,"crit_chance":50,"crit_mult":2.8,"status_chance":16,"shot_type":"AoE","unique":{"force_procs":["cold"]},"damage":{"Cold":10},"falloff":{"start":0,"end":7.2,"reduction":0.7},"no_headshot_mult":true},{"name":"Bubble Collapse","speed":1,"crit_chance":50,"crit_mult":2.8,"status_chance":16,"shot_type":"AoE","damage":{"Blast":740},"no_headshot_mult":true}],
    "imageName":"PrismaLenz.webp","tags":["Corpus"],
    "compTags":["PROJECTILE","SNIPER_AMMO","AOE","SINGLESHOT","CRPBOW"],
    "comb":[[0,1,2]]},"Prisma Gorgon":{"noise":"Alarming","releaseDate":"2015-01-22","ammoCapacity":840,"productCategory":"LongGuns","equipTime":1.1,"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":120,"reloadTime":3,"multishot":1,"attacks":[{"name":"Fully Spooled","speed":14.17,"crit_chance":30,"crit_mult":2.3,"status_chance":15,"shot_type":"Hit-Scan","damage":{"Impact":17.25,"Slash":2.3,"Puncture":3.45}},{"name":"Incarnon Form","speed":0.8,"crit_chance":33,"crit_mult":2.3,"status_chance":21,"shot_type":"Projectile","damage":{"Impact":15,"Slash":15,"Puncture":45}},{"name":"Incarnon Form Radial Attack","speed":0.8,"crit_chance":33,"crit_mult":2.3,"status_chance":21,"shot_type":"AoE","unique":{"force_procs":["heat"]},"damage":{"Heat":700},"no_headshot_mult":true}],
    "imageName":"prisma-gorgon.webp","tags":["Prisma","Baro","Incarnon"],
    "compTags":["ASSAULT_AMMO","GORGON"],
    "comb":[[1,2]]},"Prisma Obex":{"blockingAngle":50,"comboDuration":5,"followThrough":0.9,"range":1.25,"windUp":0.5,"releaseDate":"2017-05-05","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":1.33,"crit_chance":25,"crit_mult":2,"status_chance":30,"damage":{"Impact":105,"Slash":22.5,"Puncture":22.5}},{"name":"Slam","speed":1,"crit_chance":25,"crit_mult":2,"status_chance":30,"unique":{"force_procs":["impact"]},"damage":{"Electricity":300}},{"name":"Heavy Slam","speed":1,"crit_chance":25,"crit_mult":2,"status_chance":30,"damage":{"Electricity":450}}],
    "imageName":"prisma-obex.webp","tags":["Prisma","Baro","Incarnon"],
    "compTags":["SPARRING_STANCE"]},"Prisma Grakata":{"noise":"Alarming","releaseDate":"2015-06-12","ammoCapacity":1000,"productCategory":"LongGuns","equipTime":1.1,"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":120,"reloadTime":2,"multishot":1,"attacks":[{"name":"Normal Attack","speed":21.67,"crit_chance":25,"crit_mult":2.5,"status_chance":21,"shot_type":"Hit-Scan","damage":{"Impact":6,"Slash":4,"Puncture":5}}],
    "imageName":"prisma-grakata.webp","tags":["Prisma","Baro"],
    "compTags":["ASSAULT_AMMO","GRAKATA"]},"Prisma Skana":{"blockingAngle":55,"comboDuration":5,"followThrough":0.6,"range":2.5,"windUp":0.6,"releaseDate":"2015-05-28","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":1,"crit_chance":28,"crit_mult":2.2,"status_chance":16,"damage":{"Impact":25.5,"Slash":119,"Puncture":25.5}},{"name":"Slam","speed":1,"crit_chance":28,"crit_mult":2.2,"status_chance":16,"unique":{"force_procs":["impact"]},"damage":{"Impact":340}},{"name":"Heavy Slam","speed":1,"crit_chance":28,"crit_mult":2.2,"status_chance":16,"damage":{"Blast":510}}],
    "imageName":"prisma-skana.webp","tags":["Prisma","Baro","Incarnon"],
    "compTags":["SWORDS_STANCE","SKANA"]},"Prisma Ohma":{"blockingAngle":60,"comboDuration":5,"followThrough":0.6,"range":2.5,"windUp":0.7,"releaseDate":"2023-08-03","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":1,"crit_chance":30,"crit_mult":2.2,"status_chance":20,"damage":{"Impact":82,"Slash":44,"Electricity":124}},{"name":"Slam","speed":1,"crit_chance":30,"crit_mult":2.2,"status_chance":20,"unique":{"force_procs":["impact"]},"damage":{"Electricity":500}},{"name":"Heavy Slam","speed":1,"crit_chance":30,"crit_mult":2.2,"status_chance":20,"damage":{"Electricity":750}}],
    "imageName":"PrismaOhma.webp","tags":["Corpus"],
    "compTags":["TONFA_STANCE"]},"Prisma Machete":{"blockingAngle":55,"comboDuration":5,"followThrough":0.7,"range":2.5,"windUp":0.7,"releaseDate":"2021-06-10","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":0.917,"crit_chance":15,"crit_mult":1.9,"status_chance":31,"damage":{"Impact":28.95,"Slash":135.1,"Puncture":28.95}},{"name":"Slam","speed":1,"crit_chance":15,"crit_mult":1.9,"status_chance":31,"unique":{"force_procs":["impact"]},"damage":{"Impact":386}},{"name":"Heavy Slam","speed":1,"crit_chance":15,"crit_mult":1.9,"status_chance":31,"damage":{"Blast":579}}],
    "imageName":"prisma-machete.webp","tags":[],
    "compTags":["MACHETES_STANCE"]},"Prisma Tetra":{"noise":"Alarming","releaseDate":"2015-08-07","productCategory":"LongGuns","equipTime":1.1,"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":60,"reloadTime":2,"multishot":1,"attacks":[{"name":"Normal Attack","speed":7.08,"crit_chance":10,"crit_mult":2,"status_chance":24,"shot_type":"Projectile","shot_speed":100,"flight":100,"damage":{"Impact":7.6,"Puncture":30.4}}],
    "imageName":"prisma-tetra.webp","tags":["Prisma","Baro"],
    "compTags":["PROJECTILE","ASSAULT_AMMO","TETRA"]},"Proboscis Cernos":{"noise":"Silent","releaseDate":"2020-11-19","ammoCapacity":7,"productCategory":"LongGuns","equipTime":1.1,"zoomProps":[[]],"category":"Primary","trigger":"Charge","type":"Rifle","magazineSize":1,"reloadTime":0.6,"multishot":1,"attacks":[{"name":"Charged Shot","speed":1,"crit_chance":7,"crit_mult":1.9,"status_chance":43,"shot_type":"Projectile","shot_speed":45,"flight":45,"damage":{"Impact":103.2,"Slash":145.1,"Puncture":30.7}},{"name":"Appendages","speed":1,"crit_chance":7,"crit_mult":1.9,"status_chance":43,"shot_type":"AoE","damage":{"Slash":50.63,"Viral":39.38},"falloff":{"start":0,"end":9,"reduction":0},"no_headshot_mult":true},{"name":"Charged Shot Explosion","speed":1,"crit_chance":7,"crit_mult":1.9,"status_chance":43,"shot_type":"AoE","damage":{"Viral":1003},"falloff":{"start":0,"end":7,"reduction":0.5},"no_headshot_mult":true}],
    "imageName":"proboscis-cernos.webp","tags":["Infested"],
    "compTags":["PROJECTILE","INFBOW"],
    "comb":[[0,1,2]]},"Prisma Twin Gremlins":{"noise":"Alarming","releaseDate":"2018-08-17","ammoCapacity":600,"productCategory":"Pistols","category":"Secondary","trigger":"Auto","type":"Pistol","magazineSize":70,"reloadTime":0.9,"multishot":1,"attacks":[{"name":"Normal Attack","speed":8.83,"crit_chance":23,"crit_mult":1.9,"status_chance":23,"shot_type":"Projectile","shot_speed":90,"flight":90,"damage":{"Impact":2.97,"Slash":11.34,"Puncture":12.69}}],
    "imageName":"prisma-twin-gremlins.webp","tags":["Grineer"],
    "compTags":["PROJECTILE"]},"Prova":{"blockingAngle":55,"comboDuration":5,"followThrough":0.7,"range":2.5,"windUp":0.7,"releaseDate":"2013-05-23","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":1,"crit_chance":14,"crit_mult":2,"status_chance":16,"damage":{"Impact":52,"Electricity":76}},{"name":"Slam","speed":1,"crit_chance":14,"crit_mult":2,"status_chance":16,"unique":{"force_procs":["impact"]},"damage":{"Electricity":256}},{"name":"Heavy Slam","speed":1,"crit_chance":14,"crit_mult":2,"status_chance":16,"damage":{"Blast":384}}],
    "imageName":"prova.webp","tags":["Corpus"],
    "compTags":["MACHETES_STANCE"]},"Pulmonars":{"blockingAngle":55,"comboDuration":9,"followThrough":0.5,"range":2.507992,"windUp":0.5,"releaseDate":"2020-11-19","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":0.917,"crit_chance":19,"crit_mult":2.3,"status_chance":33,"damage":{"Impact":193,"Viral":97}},{"name":"Slam","speed":1,"crit_chance":19,"crit_mult":2.3,"status_chance":33,"unique":{"force_procs":["impact"]},"damage":{"Viral":580}},{"name":"Heavy Slam","speed":1,"crit_chance":19,"crit_mult":2.3,"status_chance":33,"damage":{"Viral":870}}],
    "imageName":"pulmonars.webp","tags":["Infested"],
    "compTags":["NUNCHAKU_STANCE"]},"Pupacyst":{"blockingAngle":55,"comboDuration":5,"followThrough":0.6,"range":2.7,"windUp":0.9,"releaseDate":"2018-10-12","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":0.833,"crit_chance":13,"crit_mult":1.5,"status_chance":27,"damage":{"Impact":139,"Viral":145}},{"name":"Slam","speed":1,"crit_chance":13,"crit_mult":1.5,"status_chance":27,"unique":{"force_procs":["impact"]},"damage":{"Impact":278,"Viral":290}},{"name":"Heavy Slam","speed":1,"crit_chance":13,"crit_mult":1.5,"status_chance":27,"damage":{"Impact":417,"Viral":435}}],
    "imageName":"pupacyst.webp","tags":["Infested"],
    "compTags":["POLEARMS_STANCE"]},"Prova Vandal":{"blockingAngle":55,"comboDuration":5,"followThrough":0.7,"range":2.5,"windUp":0.7,"releaseDate":"2013-10-23","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":1,"crit_chance":14,"crit_mult":2,"status_chance":32,"damage":{"Impact":80,"Electricity":118}},{"name":"Slam","speed":1,"crit_chance":14,"crit_mult":2,"status_chance":32,"unique":{"force_procs":["electricity","impact"]},"damage":{"Electricity":396}},{"name":"Heavy Slam","speed":1,"crit_chance":14,"crit_mult":2,"status_chance":32,"damage":{"Blast":594}}],
    "imageName":"prova-vandal.webp","tags":["Corpus","Vandal"],
    "compTags":["MACHETES_STANCE"]},"Pyrana":{"noise":"Alarming","releaseDate":"2014-06-04","productCategory":"Pistols","category":"Secondary","trigger":"Auto","type":"Pistol","magazineSize":10,"reloadTime":2,"multishot":12,"attacks":[{"name":"Normal Attack","speed":4.17,"crit_chance":20,"crit_mult":2,"status_chance":2.5,"shot_type":"Hit-Scan","damage":{"Impact":2.2,"Slash":17.6,"Puncture":2.2},"falloff":{"start":15,"end":30,"reduction":0.7273}}],
    "imageName":"pyrana.webp","tags":["Tenno"],
    "compTags":["SECONDARYSHOTGUN","SINGLESHOT"]},"Pyrana Prime":{"noise":"Alarming","releaseDate":"2018-06-19","productCategory":"Pistols","zoomProps":[[]],"category":"Secondary","trigger":"Auto","type":"Pistol","magazineSize":12,"reloadTime":1.6,"multishot":10,"attacks":[{"name":"Normal Attack","speed":4,"crit_chance":24,"crit_mult":2.2,"status_chance":3.6,"shot_type":"Hit-Scan","damage":{"Impact":1.92,"Slash":20.16,"Puncture":1.92},"falloff":{"start":18,"end":36,"reduction":0.75}},{"name":"Ethereal  Attack","speed":4,"crit_chance":24,"crit_mult":2.2,"status_chance":3.6,"shot_type":"Hit-Scan","unique":{"speed_mult":0.4},"damage":{"Impact":1.92,"Slash":20.16,"Puncture":1.92},"falloff":{"start":18,"end":36,"reduction":0.75}}],
    "imageName":"pyrana-prime.webp","tags":["Prime","Vaulted"],
    "compTags":["SECONDARYSHOTGUN","SINGLESHOT"]},"Purgator 1":{"noise":"Alarming","releaseDate":"2025-03-19","ammoCapacity":20,"productCategory":"LongGuns","category":"Primary","trigger":"Semi","type":"Rifle","magazineSize":9,"reloadTime":2.7,"multishot":1,"attacks":[{"name":"Normal Attack","speed":1.5,"crit_chance":31,"crit_mult":2.3,"status_chance":19,"shot_type":"Projectile","shot_speed":180,"unique":{"force_procs":["impact"]},"damage":{"Impact":351.44998,"Puncture":429.55002}}],
    "imageName":"Purgator1.webp","tags":[],
    "compTags":["ASSAULT_AMMO","AOE"]},"Quartakk":{"noise":"Alarming","releaseDate":"2017-10-12","ammoCapacity":840,"productCategory":"LongGuns","equipTime":1.1,"zoomProps":[[]],"category":"Primary","trigger":"Burst","type":"Rifle","magazineSize":84,"reloadTime":1.9,"multishot":1,"attacks":[{"name":"Burst-Fire","speed":1.58,"crit_chance":19,"crit_mult":2.3,"status_chance":27,"shot_type":"Hit-Scan","damage":{"Impact":18.13,"Slash":16.66,"Puncture":14.21}}],
    "imageName":"quartakk.webp","tags":["Grineer"],
    "compTags":["ASSAULT_AMMO"]},"Quanta":{"noise":"Alarming","releaseDate":"2014-07-30","productCategory":"LongGuns","equipTime":1.1,"category":"Primary","trigger":"Held","type":"Rifle","magazineSize":60,"reloadTime":2,"multishot":2,"attacks":[{"name":"Beam","speed":12,"crit_chance":16,"crit_mult":2.2,"status_chance":24,"shot_type":"Hit-Scan","damage":{"Electricity":10}},{"name":"Cube (shot by player)","speed":4,"crit_chance":5,"crit_mult":1.5,"status_chance":26,"damage":{"Blast":600}},{"name":"Cube (direct hit)","speed":4,"crit_chance":5,"crit_mult":1.5,"status_chance":26,"shot_type":"Projectile","shot_speed":25,"flight":25,"damage":{"Electricity":100}},{"name":"Cube Explosion","speed":4,"crit_chance":5,"crit_mult":1.5,"status_chance":26,"shot_type":"AoE","damage":{"Blast":150},"no_headshot_mult":true}],
    "imageName":"quanta.webp","tags":["Corpus"],
    "compTags":["PROJECTILE","BEAM","ASSAULT_AMMO"],
    "comb":[[2,3]]},"Quatz":{"noise":"Alarming","releaseDate":"2019-07-18","ammoCapacity":504,"productCategory":"Pistols","equipTime":1.1,"zoomProps":[[]],"category":"Secondary","trigger":"Auto","type":"Pistol","magazineSize":72,"reloadTime":2.7,"multishot":1,"attacks":[{"name":"Auto","speed":15,"crit_chance":13,"crit_mult":1.5,"status_chance":27,"shot_type":"Hit-Scan","damage":{"Impact":9,"Slash":7,"Puncture":2,"Electricity":11}},{"name":"Burst","speed":2.5,"crit_chance":27,"crit_mult":2.5,"status_chance":19,"shot_type":"Hit-Scan","damage":{"Impact":9,"Slash":7,"Puncture":2,"Electricity":11}}],
    "imageName":"quatz.webp","tags":[],
    "compTags":["PROJECTILE","SECONDARYSHOTGUN"]},"Rabvee (Machete)":{"comboDuration":5,"range":1,"windUp":1,"releaseDate":"2018-04-20","productCategory":"Melee","category":"Melee","type":"Zaw Component","multishot":1,"attacks":[{"name":"Rabvee Strike","speed":0.85,"crit_chance":18,"crit_mult":2,"status_chance":18,"damage":{"Impact":140.4,"Slash":81.9,"Puncture":11.7}}],
    "imageName":"Rabvee.webp","tags":[],
    "compTags":["MACHETES_STANCE"]},"Rabvee (Hammer)":{"comboDuration":5,"range":1,"windUp":1,"releaseDate":"2018-04-20","productCategory":"Melee","category":"Melee","type":"Zaw Component","multishot":1,"attacks":[{"name":"Rabvee Strike","speed":0.85,"crit_chance":18,"crit_mult":2,"status_chance":18,"damage":{"Impact":140.4,"Slash":81.9,"Puncture":11.7}}],
    "imageName":"Rabvee.webp","tags":[],
    "compTags":["HAMMERS_STANCE"]},"Quassus Prime":{"blockingAngle":55,"comboDuration":5,"followThrough":0.7,"range":1.7,"windUp":0.5,"releaseDate":"2024-11-13","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":0.833,"crit_chance":35,"crit_mult":2.5,"status_chance":18,"damage":{"Impact":26,"Slash":182,"Puncture":52}},{"name":"First Heavy Attack - Ethereal Daggers","speed":2,"crit_chance":35,"crit_mult":2.5,"status_chance":1,"shot_type":"Projectile","shot_speed":46,"flight":46,"unique":{"force_procs":["slash"]},"damage":{"Slash":114,"Puncture":76}},{"name":"Second Heavy Attack - Ethereal Daggers","speed":2,"crit_chance":35,"crit_mult":2.5,"status_chance":2,"shot_type":"Projectile","shot_speed":46,"flight":46,"unique":{"force_procs":["slash"]},"damage":{"Slash":228,"Puncture":152}},{"name":"Slam","speed":1,"crit_chance":35,"crit_mult":2.5,"status_chance":18,"unique":{"force_procs":["impact"]},"damage":{"Impact":520}},{"name":"Heavy Slam","speed":1,"crit_chance":35,"crit_mult":2.5,"status_chance":18,"damage":{"Blast":780}}],
    "imageName":"QuassusPrime.webp","tags":[],
    "compTags":["WARFAN_STANCE"]},"Quellor":{"noise":"Alarming","releaseDate":"2019-12-13","ammoCapacity":900,"productCategory":"LongGuns","equipTime":1.1,"zoomProps":[[]],"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":300,"reloadTime":4,"multishot":1,"attacks":[{"name":"Auto","speed":6,"crit_chance":12,"crit_mult":1.6,"status_chance":38,"shot_type":"Hit-Scan","damage":{"Impact":8,"Slash":12,"Puncture":22,"Cold":16}},{"name":"Alt-Fire","speed":1,"crit_chance":40,"crit_mult":2.2,"status_chance":10,"shot_type":"Projectile","shot_speed":210,"flight":210,"unique":{"force_procs":["impact"]},"damage":{"Impact":600,"Cold":800},"falloff":{"start":9,"end":18,"reduction":0.6657}}],
    "imageName":"quellor.webp","tags":["Tenno"],
    "compTags":["PROJECTILE","ASSAULT_AMMO"]},"Quanta Vandal":{"noise":"Alarming","releaseDate":"2015-04-23","ammoCapacity":560,"productCategory":"LongGuns","equipTime":1.1,"category":"Primary","trigger":"Held","type":"Rifle","magazineSize":80,"reloadTime":1.8,"multishot":2,"attacks":[{"name":"Beam","speed":12,"crit_chance":22,"crit_mult":2.4,"status_chance":45,"shot_type":"Discharge","damage":{"Electricity":13}},{"name":"Cube (shot by player)","speed":4,"crit_chance":5,"crit_mult":1.5,"status_chance":26,"damage":{"Blast":600}},{"name":"Cube (direct hit)","speed":4,"crit_chance":5,"crit_mult":1.5,"status_chance":26,"shot_type":"Projectile","shot_speed":25,"flight":25,"damage":{"Electricity":100}},{"name":"Cube Explosion","speed":4,"crit_chance":5,"crit_mult":1.5,"status_chance":26,"shot_type":"AoE","damage":{"Blast":150},"no_headshot_mult":true}],
    "imageName":"quanta-vandal.webp","tags":["Corpus","Vandal"],
    "compTags":["PROJECTILE","BEAM","ASSAULT_AMMO"],
    "comb":[[2,3]]},"Rakta Ballistica":{"noise":"Silent","releaseDate":"2014-11-27","productCategory":"Pistols","category":"Secondary","trigger":"Charge","type":"Pistol","magazineSize":20,"reloadTime":2,"multishot":1,"attacks":[{"name":"Burst Shot","speed":6.67,"crit_chance":5,"crit_mult":1.5,"status_chance":7.5,"shot_type":"Projectile","shot_speed":100,"flight":100,"damage":{"Impact":18.75,"Slash":18.75,"Puncture":37.5}},{"name":"Charged Shot","speed":3.33,"crit_chance":20,"crit_mult":1.5,"status_chance":10,"shot_type":"Projectile","shot_speed":100,"flight":100,"damage":{"Impact":15,"Slash":15,"Puncture":270}},{"name":"Incarnon Form","speed":3.33,"crit_chance":25,"crit_mult":2.2,"status_chance":25,"shot_type":"Projectile","shot_speed":80,"damage":{"Slash":734}}],
    "imageName":"rakta-ballistica.webp","tags":["Syndicate","Red Veil","Incarnon"],
    "compTags":["PROJECTILE","CROSSBOW"]},"Quassus":{"blockingAngle":55,"comboDuration":5,"followThrough":0.7,"range":1.7,"windUp":0.5,"releaseDate":"2020-08-25","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":0.833,"crit_chance":30,"crit_mult":2,"status_chance":12,"damage":{"Impact":27.6,"Slash":156.4,"Puncture":46}},{"name":"First Heavy Attack - Ethereal Daggers","speed":2,"crit_chance":30,"crit_mult":2,"status_chance":1,"shot_type":"Projectile","shot_speed":46,"flight":46,"unique":{"force_procs":["slash"]},"damage":{"Slash":114,"Puncture":76}},{"name":"Second Heavy Attack - Ethereal Daggers","speed":2,"crit_chance":30,"crit_mult":2,"status_chance":2,"shot_type":"Projectile","shot_speed":46,"flight":46,"unique":{"force_procs":["slash"]},"damage":{"Slash":228,"Puncture":152}},{"name":"Slam","speed":1,"crit_chance":30,"crit_mult":2,"status_chance":12,"unique":{"force_procs":["impact"]},"damage":{"Impact":460}},{"name":"Heavy Slam","speed":1,"crit_chance":30,"crit_mult":2,"status_chance":12,"damage":{"Blast":690}}],
    "imageName":"quassus.webp","tags":["Tenno"],
    "compTags":["WARFAN_STANCE"]},"Rakta Cernos":{"noise":"Silent","releaseDate":"2015-09-02","ammoCapacity":72,"productCategory":"LongGuns","equipTime":1.1,"zoomProps":[[]],"category":"Primary","trigger":"Charge","type":"Rifle","magazineSize":1,"reloadTime":0.6,"multishot":1,"attacks":[{"name":"Uncharged Shot","speed":1,"crit_chance":35,"crit_mult":2,"status_chance":15,"shot_type":"Projectile","shot_speed":70,"flight":70,"damage":{"Impact":211.5,"Slash":11.75,"Puncture":11.75}},{"name":"Charged Shot","speed":1,"crit_chance":35,"crit_mult":2,"status_chance":15,"shot_type":"Projectile","shot_speed":100,"flight":100,"damage":{"Impact":423,"Slash":23.5,"Puncture":23.5}}],
    "imageName":"rakta-cernos.webp","tags":["Syndicate","Red Veil"],
    "compTags":["PROJECTILE"]},"Rattleguts (Primary)":{"ammoCapacity":700,"productCategory":"","category":"Primary","type":"Kitgun","magazineSize":0,"reloadTime":1.5,"multishot":1,"attacks":[{"name":"Normal Attack","speed":5.67,"crit_chance":0,"crit_mult":0,"status_chance":0,"shot_type":"Hit-Scan","damage":{"Impact":2,"Puncture":10,"Slash":8,"Radiation":13}}],
    "imageName":"rattleguts.webp","tags":["primary-rifle-hitscan"],
    "compTags":[""]},"Reaper Prime":{"blockingAngle":60,"comboDuration":5,"followThrough":0.6,"range":2.8,"windUp":1,"releaseDate":"2013-05-03","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":1.08,"crit_chance":35,"crit_mult":2.5,"status_chance":25,"damage":{"Impact":30,"Slash":140,"Puncture":30}},{"name":"Slam","speed":1,"crit_chance":35,"crit_mult":2.5,"status_chance":25,"unique":{"force_procs":["impact"]},"damage":{"Impact":400}},{"name":"Heavy Slam","speed":1,"crit_chance":35,"crit_mult":2.5,"status_chance":25,"damage":{"Blast":600}}],
    "imageName":"reaper-prime.webp","tags":["Prime","Vaulted"],
    "compTags":["SCYTHES_STANCE"]},"Reconifex":{"noise":"Alarming","releaseDate":"2024-12-13","ammoCapacity":600,"productCategory":"LongGuns","category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":200,"reloadTime":5,"multishot":1,"attacks":[{"name":"Normal Attack","speed":8,"crit_chance":28,"crit_mult":2.8,"status_chance":16,"shot_type":"Hit-Scan","damage":{"Impact":16,"Puncture":24}},{"name":"Normal Attack (heat ammo)","speed":8,"crit_chance":28,"crit_mult":2.8,"status_chance":16,"shot_type":"Hit-Scan","unique":{"reconifexHeat":0.25},"damage":{"Impact":16,"Puncture":24}}],
    "imageName":"Reconifex.webp","tags":[],
    "compTags":["ASSAULT_AMMO"]},"Rakta Dark Dagger":{"blockingAngle":45,"comboDuration":5,"followThrough":0.9,"range":1.75,"windUp":0.4,"releaseDate":"2016-09-15","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":1,"crit_chance":12,"crit_mult":1.8,"status_chance":30,"damage":{"Slash":62,"Puncture":88,"Radiation":96}},{"name":"Slam","speed":1,"crit_chance":12,"crit_mult":1.8,"status_chance":30,"unique":{"force_procs":["impact"]},"damage":{"Impact":492}},{"name":"Heavy Slam","speed":1,"crit_chance":12,"crit_mult":1.8,"status_chance":30,"damage":{"Radiation":738}}],
    "imageName":"rakta-dark-dagger.webp","tags":["Syndicate","Red Veil"],
    "compTags":["DAGGERS_STANCE","DARK DAGGER"]},"Rauta":{"noise":"Alarming","releaseDate":"2023-06-21","ammoCapacity":120,"productCategory":"LongGuns","zoomProps":[[]],"category":"Primary","trigger":"Semi-Auto","type":"Rifle","magazineSize":4,"reloadTime":1.2,"multishot":8,"attacks":[{"name":"Normal Attack","speed":0.8,"crit_chance":6,"crit_mult":2,"status_chance":12,"shot_type":"Hit-Scan","damage":{"Impact":26,"Slash":78,"Puncture":26}}],
    "imageName":"Rauta.webp","tags":[],
    "compTags":[]},"Redeemer Prime":{"blockingAngle":45,"comboDuration":5,"followThrough":0.5,"range":2,"windUp":0.4,"releaseDate":"2018-12-12","productCategory":"Melee","zoomProps":[[]],"category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":0.917,"crit_chance":24,"crit_mult":2.2,"status_chance":30,"damage":{"Impact":21.2,"Slash":148.4,"Puncture":42.4}},{"name":"Ranged Attack","speed":2.5,"crit_chance":24,"crit_mult":2.2,"status_chance":9,"shot_type":"Hit-Scan","unique":{"force_procs":["impact"]},"damage":{"Blast":80},"falloff":{"start":10,"end":30,"reduction":0.9375}},{"name":"Slam","speed":1,"crit_chance":24,"crit_mult":2.2,"status_chance":30,"unique":{"force_procs":["impact"]},"damage":{"Impact":424}},{"name":"Heavy Slam","speed":1,"crit_chance":24,"crit_mult":2.2,"status_chance":30,"damage":{"Blast":636}}],
    "imageName":"redeemer-prime.webp","tags":["Prime","Vaulted"],
    "compTags":["GUNBLADE_STANCE"]},"Regulators (Mesa)":{"noise":"Alarming","releaseDate":"2014-11-27","productCategory":"Pistols","category":"Secondary","type":"Dual Pistols","magazineSize":999999,"reloadTime":0,"multishot":1,"attacks":[{"name":"Normal Attack","speed":14.8,"crit_chance":25,"crit_mult":3,"status_chance":10,"shot_type":"Hit-Scan","damage":{"Impact":25,"Slash":12.5,"Puncture":12.5}}],
    "imageName":"Regulators.webp","tags":[],
    "compTags":["POWER_WEAPON"]},"Rattleguts (Secondary)":{"ammoCapacity":700,"productCategory":"","category":"Secondary","type":"Kitgun","magazineSize":0,"reloadTime":1.5,"multishot":1,"attacks":[{"name":"Normal Attack","speed":5.67,"crit_chance":0,"crit_mult":0,"status_chance":0,"shot_type":"Hit-Scan","damage":{"Impact":2,"Puncture":10,"Slash":8,"Radiation":13}}],
    "imageName":"rattleguts.webp","tags":["secondary-hitscan"],
    "compTags":[""]},"Redeemer":{"blockingAngle":45,"comboDuration":5,"followThrough":0.5,"range":2,"windUp":0.4,"releaseDate":"2014-11-27","productCategory":"Melee","zoomProps":[[]],"category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":0.833,"crit_chance":10,"crit_mult":1.8,"status_chance":22,"damage":{"Impact":18,"Slash":126,"Puncture":36}},{"name":"Ranged Attack","speed":2.5,"crit_chance":10,"crit_mult":1.8,"status_chance":6.6,"shot_type":"Hit-Scan","unique":{"force_procs":["impact"]},"damage":{"Blast":30},"falloff":{"start":10,"end":20,"reduction":0.8333}},{"name":"Slam","speed":1,"crit_chance":10,"crit_mult":1.8,"status_chance":22,"unique":{"force_procs":["impact"]},"damage":{"Impact":360}},{"name":"Heavy Slam","speed":1,"crit_chance":10,"crit_mult":1.8,"status_chance":22,"damage":{"Blast":540}}],
    "imageName":"redeemer.webp","tags":["Tenno"],
    "compTags":["GUNBLADE_STANCE"]},"Riot-848":{"noise":"Alarming","releaseDate":"2025-03-19","productCategory":"Pistols","category":"Secondary","trigger":"Auto","type":"Pistol","magazineSize":16,"reloadTime":1.24,"multishot":1,"attacks":[{"name":"Normal Attack","speed":8,"crit_chance":26,"crit_mult":2.2,"status_chance":26,"damage":{"Puncture":12}},{"name":"Radial Attack","speed":8,"crit_chance":26,"crit_mult":2.2,"status_chance":26,"shot_type":"AoE","damage":{"Blast":48},"no_headshot_mult":true}],
    "imageName":"Riot-848.webp","tags":[],
    "compTags":[""]},"Ruvox":{"blockingAngle":50,"comboDuration":5,"followThrough":0.9,"range":1.25,"windUp":0.6,"releaseDate":"2024-03-27","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":1,"crit_chance":26,"crit_mult":2.2,"status_chance":20,"damage":{"Impact":170}},{"name":"Incarnon Form","speed":0.65,"crit_chance":26,"crit_mult":2.2,"status_chance":20,"damage":{"Impact":170}},{"name":"Slam","speed":1,"crit_chance":26,"crit_mult":2.2,"status_chance":20,"unique":{"force_procs":["impact"]},"damage":{"Impact":340}},{"name":"Heavy Slam","speed":1,"crit_chance":26,"crit_mult":2.2,"status_chance":20,"damage":{"Blast":510}}],
    "imageName":"ruvox.webp","tags":["Incarnon"],
    "compTags":["FIST_STANCE"]},"Rubico":{"noise":"Alarming","releaseDate":"2015-12-03","ammoCapacity":72,"productCategory":"LongGuns","equipTime":1.1,"category":"Primary","trigger":"Semi","type":"Rifle","magazineSize":5,"reloadTime":2.4,"multishot":1,"attacks":[{"name":"Unzoomed","speed":2.67,"crit_chance":30,"crit_mult":3,"status_chance":12,"shot_type":"Hit-Scan","damage":{"Impact":144,"Slash":9,"Puncture":27},"falloff":{"start":400,"end":600,"reduction":0.5}},{"name":"3.5x Zoom Mode","speed":2.67,"crit_chance":30,"crit_mult":3,"status_chance":12,"shot_type":"Hit-Scan","unique":{"crit_mult":0.35},"damage":{"Impact":144,"Slash":9,"Puncture":27}},{"name":"6.0x Zoom","speed":2.67,"crit_chance":30,"crit_mult":3,"status_chance":12,"shot_type":"Hit-Scan","unique":{"crit_mult":0.5},"damage":{"Impact":144,"Slash":9,"Puncture":27}}],
    "imageName":"rubico.webp","tags":["Tenno"],
    "compTags":["SNIPER_AMMO"]},"Rumblejack":{"blockingAngle":45,"comboDuration":5,"followThrough":0.9,"range":1.8,"windUp":0.4,"releaseDate":"2021-12-15","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":0.67,"crit_chance":13,"crit_mult":1.8,"status_chance":40,"damage":{"Impact":120,"Electricity":180}},{"name":"Slam","speed":1,"crit_chance":13,"crit_mult":1.8,"status_chance":40,"unique":{"force_procs":["electricity"]},"damage":{"Electricity":600}},{"name":"Heavy Slam","speed":1,"crit_chance":13,"crit_mult":1.8,"status_chance":40,"damage":{"Electricity":900}}],
    "imageName":"rumblejack.webp","tags":["Tenno"],
    "compTags":["DAGGERS_STANCE"]},"Sancti Castanas":{"noise":"Silent","releaseDate":"2014-11-27","ammoCapacity":18,"productCategory":"Pistols","category":"Secondary","trigger":"Active","type":"Pistol","magazineSize":2,"reloadTime":1,"multishot":1,"attacks":[{"name":"Mid-Flight Detonation","speed":3.33,"crit_chance":24,"crit_mult":2,"status_chance":34,"shot_type":"Projectile","shot_speed":60,"flight":60,"damage":{"Electricity":300},"falloff":{"start":0,"end":3.6,"reduction":0.4}},{"name":"Embedded Detonation","speed":3.33,"crit_chance":24,"crit_mult":2,"status_chance":10,"shot_type":"Projectile","shot_speed":60,"flight":60,"unique":{"force_procs":["electricity"]},"damage":{"Electricity":300},"falloff":{"start":0,"end":3.6,"reduction":0.4}}],
    "imageName":"sancti-castanas.webp","tags":["Syndicate","New Loka"],
    "compTags":["PROJECTILE","DEPLOYABLE","AOE","SINGLESHOT"],
    "comb":[[0,1]]},"Ripkas":{"blockingAngle":55,"comboDuration":5,"followThrough":0.8,"range":1.75,"windUp":0.6,"releaseDate":"2015-03-19","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":0.883,"crit_chance":20,"crit_mult":2,"status_chance":15,"damage":{"Impact":8.65,"Slash":147.05,"Puncture":17.3}},{"name":"Slam","speed":1,"crit_chance":20,"crit_mult":2,"status_chance":15,"damage":{"Impact":346}},{"name":"Heavy Slam","speed":1,"crit_chance":20,"crit_mult":2,"status_chance":15,"damage":{"Blast":519}}],
    "imageName":"ripkas.webp","tags":["Grineer"],
    "compTags":["CLAWS_STANCE","RIPKAS"]},"Sancti Magistar":{"blockingAngle":50,"comboDuration":5,"followThrough":0.4,"range":2.6,"windUp":1.2,"releaseDate":"2016-09-15","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":1,"crit_chance":30,"crit_mult":2,"status_chance":20,"damage":{"Impact":192,"Slash":12,"Puncture":36}},{"name":"Slam","speed":1,"crit_chance":30,"crit_mult":2,"status_chance":20,"damage":{"Impact":480}},{"name":"Heavy Slam","speed":1,"crit_chance":30,"crit_mult":2,"status_chance":20,"damage":{"Blast":720}}],
    "imageName":"sancti-magistar.webp","tags":["New Loka","Syndicate","Incarnon"],
    "compTags":["HAMMERS_STANCE"]},"Sagek Prime":{"noise":"Alarming","releaseDate":"2025-12-10","ammoCapacity":450,"productCategory":"Pistols","zoomProps":[[]],"category":"Secondary","trigger":"Auto","type":"Pistol","magazineSize":75,"reloadTime":1.6,"multishot":1,"attacks":[{"name":"Normal Attack","speed":12.33,"crit_chance":30,"crit_mult":2.2,"status_chance":1,"shot_type":"Hit-Scan","unique":{"ammoEff":0.2},"damage":{"Impact":6.112,"Slash":11.642,"Puncture":8.246}}],
    "imageName":"SagekPrime.webp","tags":[],
    "compTags":[]},"Rubico Prime":{"noise":"Alarming","releaseDate":"2018-09-25","ammoCapacity":72,"productCategory":"LongGuns","equipTime":1.1,"category":"Primary","trigger":"Semi","type":"Rifle","magazineSize":5,"reloadTime":2,"multishot":1,"attacks":[{"name":"Unzoomed","speed":3.67,"crit_chance":38,"crit_mult":3,"status_chance":16,"shot_type":"Hit-Scan","damage":{"Impact":149.6,"Slash":9.3,"Puncture":28.1},"falloff":{"start":400,"end":600,"reduction":0.5}},{"name":"2.5x Zoom Mode","speed":3.67,"crit_chance":38,"crit_mult":3,"status_chance":16,"shot_type":"Hit-Scan","unique":{"crit_mult":0.35},"damage":{"Impact":149.6,"Slash":9.3,"Puncture":28.1}},{"name":"5.0x Zoom","speed":3.67,"crit_chance":38,"crit_mult":3,"status_chance":16,"shot_type":"Hit-Scan","unique":{"crit_mult":0.5},"damage":{"Impact":149.6,"Slash":9.3,"Puncture":28.1}}],
    "imageName":"rubico-prime.webp","tags":["Prime"],
    "compTags":["SNIPER_AMMO"]},"Sampotes":{"blockingAngle":50,"comboDuration":5,"followThrough":0.4,"range":2.5,"windUp":1.4,"releaseDate":"2023-04-26","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":0.83,"crit_chance":30,"crit_mult":3,"status_chance":28,"damage":{"Impact":173.6,"Puncture":37.2,"Slash":37.2}},{"name":"Slam","speed":1,"crit_chance":30,"crit_mult":3,"status_chance":28,"damage":{"Impact":347.2,"Puncture":74.4,"Slash":74.4}},{"name":"Heavy Slam","speed":1,"crit_chance":30,"crit_mult":3,"status_chance":28,"damage":{"Blast":744}}],
    "imageName":"sampotes.webp","tags":[""],
    "compTags":["HAMMERS_STANCE"]},"Sancti Tigris":{"noise":"Alarming","releaseDate":"2015-09-02","ammoCapacity":120,"productCategory":"LongGuns","zoomProps":[[]],"category":"Primary","trigger":"Duplex","type":"Rifle","magazineSize":2,"reloadTime":1.5,"multishot":6,"attacks":[{"name":"Normal Attack","speed":2,"crit_chance":15,"crit_mult":1.5,"status_chance":14,"shot_type":"Hit-Scan","damage":{"Impact":21,"Slash":168,"Puncture":21},"falloff":{"start":8,"end":20,"reduction":0.5714}}],
    "imageName":"sancti-tigris.webp","tags":["Syndicate","New Loka"],
    "compTags":["SINGLESHOT","TIGRIS"]},"Scindo Prime":{"blockingAngle":55,"comboDuration":5,"followThrough":0.6,"range":2.7,"windUp":1.1,"releaseDate":"2014-09-23","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":0.967,"crit_chance":26,"crit_mult":2.4,"status_chance":24,"damage":{"Impact":25,"Slash":200,"Puncture":25}},{"name":"Slam","speed":1,"crit_chance":26,"crit_mult":2.4,"status_chance":24,"unique":{"force_procs":["impact"]},"damage":{"Impact":500}},{"name":"Heavy Slam","speed":1,"crit_chance":26,"crit_mult":2.4,"status_chance":24,"damage":{"Blast":750}}],
    "imageName":"scindo-prime.webp","tags":["Prime","Never Vaulted"],
    "compTags":["HEAVY_BLADE_STANCE"]},"Scourge Prime":{"noise":"Alarming","releaseDate":"2021-12-16","ammoCapacity":360,"productCategory":"LongGuns","equipTime":1.1,"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":40,"reloadTime":2.2,"multishot":1,"attacks":[{"name":"Projectile Impact","speed":2.67,"crit_chance":10,"crit_mult":2,"status_chance":30,"shot_type":"Projectile","shot_speed":40,"flight":40,"damage":{"Corrosive":80}},{"name":"Explosion","speed":2.67,"crit_chance":10,"crit_mult":2,"status_chance":30,"shot_type":"AoE","damage":{"Corrosive":60},"falloff":{"start":0,"end":1.7,"reduction":0.3},"no_headshot_mult":true},{"name":"Spear Throw","speed":1,"crit_chance":10,"crit_mult":2,"status_chance":30,"shot_type":"Projectile","shot_speed":150,"flight":150,"damage":{"Impact":140,"Slash":30,"Puncture":30}},{"name":"Spear Explosion","speed":1,"crit_chance":10,"crit_mult":2,"status_chance":30,"shot_type":"AoE","unique":{"force_procs":["impact"]},"damage":{"Corrosive":55},"falloff":{"start":0,"end":7,"reduction":0.6},"no_headshot_mult":true}],
    "imageName":"scourge-prime.webp","tags":["Tenno","Prime"],
    "compTags":["PROJECTILE","IMPACTEXPLODE"],
    "comb":[[0,1],
    [2,3]]},"Scourge":{"noise":"Alarming","releaseDate":"2017-06-29","ammoCapacity":200,"productCategory":"LongGuns","equipTime":1.1,"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":40,"reloadTime":2.5,"multishot":1,"attacks":[{"name":"Projectile Impact","speed":2.67,"crit_chance":2,"crit_mult":1.5,"status_chance":30,"shot_type":"Projectile","shot_speed":40,"flight":40,"damage":{"Corrosive":70}},{"name":"Explosion","speed":2.67,"crit_chance":2,"crit_mult":1.5,"status_chance":30,"shot_type":"AoE","damage":{"Corrosive":55},"falloff":{"start":0,"end":1.7,"reduction":0.3},"no_headshot_mult":true},{"name":"Spear Throw Impact","speed":1,"crit_chance":4,"crit_mult":2,"status_chance":30,"shot_type":"Projectile","shot_speed":150,"flight":150,"damage":{"Impact":105,"Slash":22.5,"Puncture":22.5}},{"name":"Spear Throw Explosion","speed":1,"crit_chance":4,"crit_mult":2,"status_chance":30,"shot_type":"AoE","unique":{"force_procs":["impact"]},"damage":{"Corrosive":55},"falloff":{"start":0,"end":7,"reduction":0.6},"no_headshot_mult":true}],
    "imageName":"scourge.webp","tags":["Tenno"],
    "compTags":["PROJECTILE","IMPACTEXPLODE"],
    "comb":[[0,1],
    [2,3]]},"Sarofang":{"blockingAngle":55,"comboDuration":5,"followThrough":0.6,"range":2.6,"windUp":1.1,"releaseDate":"2022-11-30","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":1.17,"crit_chance":20,"crit_mult":2,"status_chance":20,"damage":{"Impact":80,"Slash":112,"Puncture":8}},{"name":"Slam","speed":1,"crit_chance":20,"crit_mult":2,"status_chance":20,"unique":{"force_procs":["impact"]},"damage":{"Impact":400}},{"name":"Heavy Slam","speed":1,"crit_chance":20,"crit_mult":2,"status_chance":20,"damage":{"Blast":600}}],
    "imageName":"sarofang.webp","tags":["Lua","Voruna"],
    "compTags":["HEAVY_BLADE_STANCE"]},"Scoliac":{"blockingAngle":45,"comboDuration":5,"followThrough":0.5,"range":2.4963856,"windUp":0.4,"releaseDate":"2013-12-19","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":1.25,"crit_chance":13,"crit_mult":1.5,"status_chance":29,"damage":{"Impact":22.5,"Slash":105,"Puncture":22.5}},{"name":"Slam","speed":1,"crit_chance":13,"crit_mult":1.5,"status_chance":29,"unique":{"force_procs":["impact"]},"damage":{"Toxin":300}},{"name":"Heavy Slam","speed":1,"crit_chance":13,"crit_mult":1.5,"status_chance":29,"damage":{"Toxin":450}}],
    "imageName":"scoliac.webp","tags":["Infested"],
    "compTags":["WHIPS_STANCE"]},"Sarpa":{"blockingAngle":45,"comboDuration":5,"followThrough":0.5,"range":2,"windUp":0.30000001,"releaseDate":"2016-08-19","productCategory":"Melee","zoomProps":[[]],"category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":1,"crit_chance":14,"crit_mult":2,"status_chance":28,"damage":{"Impact":16,"Slash":112,"Puncture":32}},{"name":"Ranged Attack","speed":3.33,"crit_chance":14,"crit_mult":2,"status_chance":28,"shot_type":"Hit-Scan","damage":{"Impact":3.5,"Slash":21,"Puncture":10.5},"falloff":{"start":20,"end":40,"reduction":0.8571}},{"name":"Slam","speed":1,"crit_chance":14,"crit_mult":2,"status_chance":28,"unique":{"force_procs":["impact"]},"damage":{"Impact":320}},{"name":"Heavy Slam","speed":1,"crit_chance":14,"crit_mult":2,"status_chance":28,"damage":{"Blast":480}}],
    "imageName":"sarpa.webp","tags":["Tenno"],
    "compTags":["GUNBLADE_STANCE"]},"Sarofang Prime":{"blockingAngle":55,"comboDuration":5,"followThrough":0.6,"range":2.6,"windUp":1.1,"releaseDate":"2026-04-08","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":1.17,"crit_chance":30,"crit_mult":3,"status_chance":30,"damage":{"Impact":66,"Slash":145.2,"Puncture":8.8}},{"name":"Slam","speed":1,"crit_chance":30,"crit_mult":3,"status_chance":10,"unique":{"force_procs":["impact"]},"damage":{"Impact":440}},{"name":"Heavy Slam","speed":1,"crit_chance":30,"crit_mult":3,"status_chance":10,"damage":{"Blast":660}}],
    "imageName":"SarofangPrime.webp","tags":["Voruna"],
    "compTags":["HEAVY_BLADE_STANCE"]},"Scindo":{"blockingAngle":55,"comboDuration":5,"followThrough":0.6,"range":2.6,"windUp":1.1,"releaseDate":"2013-01-14","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":0.917,"crit_chance":15,"crit_mult":1.5,"status_chance":10,"damage":{"Impact":20,"Slash":160,"Puncture":20}},{"name":"Slam","speed":1,"crit_chance":15,"crit_mult":1.5,"status_chance":10,"unique":{"force_procs":["impact"]},"damage":{"Impact":400}},{"name":"Heavy Slam","speed":1,"crit_chance":15,"crit_mult":1.5,"status_chance":10,"damage":{"Blast":600}}],
    "imageName":"scindo.webp","tags":["Tenno"],
    "compTags":["HEAVY_BLADE_STANCE"]},"Scyotid":{"noise":"Silent","releaseDate":"2025-06-25","ammoCapacity":320,"productCategory":"Pistols","category":"Secondary","trigger":"Auto","type":"Secondary","magazineSize":40,"reloadTime":1.6,"multishot":1,"attacks":[{"name":"Auto","speed":2.4,"crit_chance":24,"crit_mult":2.4,"status_chance":18,"shot_type":"Projectile","shot_speed":60,"damage":{"Puncture":8,"Toxin":32}},{"name":"Semi","speed":1.6,"crit_chance":8,"crit_mult":2.4,"status_chance":32,"shot_type":"AoE","damage":{"Toxin":40},"no_headshot_mult":true}],
    "imageName":"Scyotid.webp","tags":[],
    "compTags":[]},"Secura Lecta":{"blockingAngle":45,"comboDuration":5,"followThrough":0.5,"range":2.4963856,"windUp":0.4,"releaseDate":"2016-09-15","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":1.25,"crit_chance":15,"crit_mult":1.5,"status_chance":30,"damage":{"Slash":66,"Puncture":30,"Electricity":80}},{"name":"Slam","speed":1,"crit_chance":15,"crit_mult":1.5,"status_chance":30,"unique":{"force_procs":["impact"]},"damage":{"Electricity":352}},{"name":"Heavy Slam","speed":1,"crit_chance":15,"crit_mult":1.5,"status_chance":30,"damage":{"Electricity":528}}],
    "imageName":"secura-lecta.webp","tags":["Syndicate","Perrin Sequence"],
    "compTags":["WHIPS_STANCE"]},"Sepfahn (Staff)":{"comboDuration":5,"range":1,"windUp":1,"releaseDate":"2018-04-20","productCategory":"Melee","category":"Melee","type":"Zaw Component","multishot":1,"attacks":[{"name":"Sepfahn Strike","speed":0.92,"crit_chance":20,"crit_mult":2,"status_chance":20,"damage":{"Impact":22.6,"Slash":146.9,"Puncture":56.5}}],
    "imageName":"sepfahn.webp","tags":[],
    "compTags":["STAVES_STANCE"]},"Secura Penta":{"noise":"Alarming","releaseDate":"2015-09-02","ammoCapacity":28,"productCategory":"LongGuns","equipTime":0.4,"category":"Primary","trigger":"Active","type":"Rifle","magazineSize":7,"reloadTime":2.5,"multishot":1,"attacks":[{"name":"Grenade Impact","speed":2,"crit_chance":26,"crit_mult":2,"status_chance":26,"shot_type":"Projectile","shot_speed":25,"flight":25,"damage":{"Impact":75}},{"name":"Grenade Detonation","speed":2,"crit_chance":26,"crit_mult":2,"status_chance":26,"shot_type":"AoE","damage":{"Blast":300},"falloff":{"start":0,"end":6,"reduction":0.6},"no_headshot_mult":true}],
    "imageName":"secura-penta.webp","tags":["Syndicate","Perrin Sequence"],
    "compTags":["PROJECTILE","SNIPER_AMMO","AOE","SINGLESHOT","PENTA"],
    "comb":[[0,1]]},"Serro":{"blockingAngle":55,"comboDuration":5,"followThrough":0.6,"range":3,"windUp":0.9,"releaseDate":"2014-05-21","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":0.917,"crit_chance":8,"crit_mult":1.5,"status_chance":26,"damage":{"Slash":96,"Electricity":138}},{"name":"Slam","speed":1,"crit_chance":8,"crit_mult":1.5,"status_chance":26,"unique":{"force_procs":["impact"]},"damage":{"Blast":468}},{"name":"Heavy Slam","speed":1,"crit_chance":8,"crit_mult":1.5,"status_chance":26,"damage":{"Blast":702}}],
    "imageName":"serro.webp","tags":["Corpus"],
    "compTags":["POLEARMS_STANCE"]},"Sepfahn (Nikana)":{"comboDuration":5,"range":1,"windUp":1,"releaseDate":"2018-04-20","productCategory":"Melee","category":"Melee","type":"Zaw Component","multishot":1,"attacks":[{"name":"Sepfahn Strike","speed":0.92,"crit_chance":20,"crit_mult":2,"status_chance":20,"damage":{"Impact":22.6,"Slash":146.9,"Puncture":56.5}}],
    "imageName":"sepfahn.webp","tags":[],
    "compTags":["NIKANAS_STANCE"]},"Seer":{"noise":"Alarming","releaseDate":"2013-07-13","productCategory":"Pistols","zoomProps":[[]],"category":"Secondary","trigger":"Semi","type":"Pistol","magazineSize":8,"reloadTime":2.8,"multishot":1,"attacks":[{"name":"Normal Attack","speed":2,"crit_chance":5,"crit_mult":1.5,"status_chance":13,"shot_type":"Projectile","shot_speed":500,"flight":500,"damage":{"Impact":33.67,"Slash":33.67,"Puncture":33.67}}],
    "imageName":"seer.webp","tags":["Grineer"],
    "compTags":["PROJECTILE"]},"Secura Dual Cestra":{"noise":"Alarming","releaseDate":"2014-11-27","ammoCapacity":480,"productCategory":"Pistols","category":"Secondary","trigger":"Auto","type":"Pistol","magazineSize":120,"reloadTime":3.5,"multishot":1,"attacks":[{"name":"Normal Attack","speed":12.5,"crit_chance":16,"crit_mult":1.6,"status_chance":28,"shot_type":"Projectile","shot_speed":100,"flight":100,"damage":{"Impact":5.6,"Puncture":22.4}}],
    "imageName":"secura-dual-cestra.webp","tags":["Syndicate","Perrin Sequence"],
    "compTags":["PROJECTILE"]},"Sepulcrum":{"noise":"Alarming","releaseDate":"2020-08-25","ammoCapacity":180,"productCategory":"Pistols","zoomProps":[[]],"category":"Secondary","trigger":"Burst","type":"Pistol","magazineSize":90,"reloadTime":4,"multishot":1,"attacks":[{"name":"Primary-Fire","speed":1.83,"crit_chance":30,"crit_mult":2.2,"status_chance":14,"shot_type":"Projectile","shot_speed":200,"flight":200,"damage":{"Impact":9.6,"Slash":11.5,"Puncture":26.9}},{"name":"Radial Attack","speed":1.83,"crit_chance":30,"crit_mult":2.2,"status_chance":14,"shot_type":"AoE","damage":{"Heat":46},"falloff":{"start":0,"end":1.6,"reduction":0.2},"no_headshot_mult":true},{"name":"Lock-On Mode","speed":1,"crit_chance":38,"crit_mult":3,"status_chance":26,"shot_type":"Projectile","shot_speed":60,"flight":60,"unique":{"force_procs":["impact"]},"damage":{"Impact":19.2,"Slash":23,"Puncture":53.8}},{"name":"Lock-On Radial Attack","speed":1,"crit_chance":38,"crit_mult":3,"status_chance":26,"shot_type":"AoE","damage":{"Heat":480},"falloff":{"start":0,"end":3,"reduction":0.2},"no_headshot_mult":true}],
    "imageName":"sepulcrum.webp","tags":["Entrati"],
    "compTags":["SINGLESHOT","AOE"],
    "comb":[[0,1],
    [2,3]]},"Shadow Claws (Sevagoth)":{"blockingAngle":60,"comboDuration":5,"followThrough":1,"range":1.5,"windUp":0.9,"releaseDate":"2021-04-13","productCategory":"Melee","category":"Melee","type":"Exalted Weapon","multishot":1,"attacks":[{"name":"Normal Attack","speed":1,"crit_chance":38,"crit_mult":2.6,"status_chance":24,"damage":{"Impact":75,"Slash":125,"Puncture":50}},{"name":"Slam","speed":1,"crit_chance":38,"crit_mult":2.6,"status_chance":24,"unique":{"force_procs":["impact"]},"damage":{"Impact":500}},{"name":"Heavy Slam","speed":1,"crit_chance":38,"crit_mult":2.6,"status_chance":24,"damage":{"Blast":750}}],
    "imageName":"ShadowClaws.webp","tags":[],
    "compTags":["SHADOW_CLAWS_STANCE","POWER_WEAPON"]},"Shaku":{"blockingAngle":55,"comboDuration":5,"followThrough":0.5,"range":2.2079918,"windUp":0.5,"releaseDate":"2015-12-16","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":1.17,"crit_chance":18,"crit_mult":2,"status_chance":34,"damage":{"Impact":180}},{"name":"Slam","speed":1,"crit_chance":18,"crit_mult":2,"status_chance":34,"unique":{"force_procs":["impact"]},"damage":{"Impact":360}},{"name":"Heavy Slam","speed":1,"crit_chance":18,"crit_mult":2,"status_chance":34,"damage":{"Blast":540}}],
    "imageName":"shaku.webp","tags":["Tenno"],
    "compTags":["NUNCHAKU_STANCE"]},"Sicarus":{"noise":"Alarming","releaseDate":"2012-10-25","productCategory":"Pistols","category":"Secondary","trigger":"Burst","type":"Pistol","magazineSize":15,"reloadTime":2,"multishot":1,"attacks":[{"name":"Normal Attack","speed":3.5,"crit_chance":16,"crit_mult":2,"status_chance":6,"shot_type":"Hit-Scan","damage":{"Impact":21,"Slash":4.5,"Puncture":4.5}},{"name":"Incarnon Form","speed":3.5,"crit_chance":20,"crit_mult":3,"status_chance":20,"shot_type":"Hit-Scan","damage":{"Impact":28,"Slash":6,"Puncture":6}}],
    "imageName":"sicarus.webp","tags":["Tenno","Incarnon"],
    "compTags":[]},"Sibear":{"blockingAngle":50,"comboDuration":5,"followThrough":0.4,"range":2.6,"windUp":1.2,"releaseDate":"2016-04-06","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":1,"crit_chance":15,"crit_mult":2,"status_chance":30,"damage":{"Impact":70,"Slash":50,"Puncture":20,"Cold":130}},{"name":"Slam","speed":1,"crit_chance":15,"crit_mult":2,"status_chance":30,"damage":{"Cold":540}},{"name":"Heavy Slam","speed":1,"crit_chance":15,"crit_mult":2,"status_chance":30,"damage":{"Cold":810}}],
    "imageName":"sibear.webp","tags":["Tenno","Incarnon"],
    "compTags":["HAMMERS_STANCE"]},"Shedu":{"noise":"Alarming","releaseDate":"2019-12-13","productCategory":"LongGuns","equipTime":1.6,"zoomProps":[[]],"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":7,"reloadTime":1.25,"multishot":1,"attacks":[{"name":"Normal Attack","speed":2.5,"crit_chance":25,"crit_mult":2.1,"status_chance":23,"shot_type":"Projectile","shot_speed":200,"flight":200,"damage":{"Heat":71}},{"name":"Radial Attack","speed":2.5,"crit_chance":25,"crit_mult":2.1,"status_chance":23,"shot_type":"AoE","damage":{"Electricity":87},"falloff":{"start":0,"end":6.6,"reduction":0.6},"no_headshot_mult":true}],
    "imageName":"shedu.webp","tags":["Sentient"],
    "compTags":["ASSAULT_AMMO","PROJECTILE","AOE"],
    "comb":[[0,1]]},"Sigma & Octantis":{"blockingAngle":70,"comboDuration":5,"followThrough":0.6,"range":2.5,"windUp":0.7,"releaseDate":"2017-10-30","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":1.08,"crit_chance":28,"crit_mult":2.2,"status_chance":16,"damage":{"Impact":38.28,"Slash":107.88,"Puncture":27.84}},{"name":"Slam","speed":1,"crit_chance":28,"crit_mult":2.2,"status_chance":16,"unique":{"force_procs":["impact"]},"damage":{"Impact":348}},{"name":"Heavy Slam","speed":1,"crit_chance":28,"crit_mult":2.2,"status_chance":16,"damage":{"Blast":522}}],
    "imageName":"sigma-&-octantis.webp","tags":["Tenno"],
    "compTags":["SWORDS_AND_SHIELD_STANCE"]},"Sheev":{"blockingAngle":45,"comboDuration":5,"followThrough":0.9,"range":1.7,"windUp":0.4,"releaseDate":"2014-09-17","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":0.667,"crit_chance":13,"crit_mult":2.1,"status_chance":25,"damage":{"Impact":13.5,"Slash":243,"Puncture":13.5}},{"name":"Slam","speed":1,"crit_chance":13,"crit_mult":2.1,"status_chance":25,"unique":{"force_procs":["impact"]},"damage":{"Heat":540}},{"name":"Heavy Slam","speed":1,"crit_chance":13,"crit_mult":2.1,"status_chance":25,"damage":{"Heat":810}}],
    "imageName":"sheev.webp","tags":["Grineer"],
    "compTags":["DAGGERS_STANCE"]},"Sicarus Prime":{"noise":"Alarming","releaseDate":"2013-11-20","productCategory":"Pistols","category":"Secondary","trigger":"Burst","type":"Pistol","magazineSize":24,"reloadTime":2,"multishot":1,"attacks":[{"name":"Normal Attack","speed":5,"crit_chance":25,"crit_mult":2,"status_chance":20,"shot_type":"Hit-Scan","damage":{"Impact":20,"Slash":15,"Puncture":15}},{"name":"Incarnon Form","speed":5,"crit_chance":30,"crit_mult":3,"status_chance":20,"shot_type":"Hit-Scan","damage":{"Impact":24,"Slash":18,"Puncture":18}}],
    "imageName":"sicarus-prime.webp","tags":["Prime","Vaulted","Incarnon"],
    "compTags":[]},"Shadow Clones (Ash)":{"blockingAngle":90,"comboDuration":5,"followThrough":0.5,"windUp":0.4,"noise":"Silent","releaseDate":"2025-03-19","productCategory":"Melee","category":"Melee","type":"Exalted Weapon","multishot":1,"attacks":[{"name":"Normal Attack","speed":1,"crit_chance":5,"crit_mult":1.2,"status_chance":5,"unique":{"force_procs":["slash"]},"damage":{"finisher":1500}}],
    "imageName":"bladestorm.webp","tags":[],
    "compTags":["ASH_STANCE","POWER_WEAPON"]},"Silva & Aegis Prime":{"blockingAngle":70,"comboDuration":5,"followThrough":0.6,"range":2.5,"windUp":0.7,"releaseDate":"2017-05-30","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":0.75,"crit_chance":25,"crit_mult":2,"status_chance":30,"damage":{"Heat":318}},{"name":"Slam","speed":1,"crit_chance":25,"crit_mult":2,"status_chance":30,"unique":{"force_procs":["impact"]},"damage":{"Heat":636}},{"name":"Heavy Slam","speed":1,"crit_chance":25,"crit_mult":2,"status_chance":30,"damage":{"Heat":954}}],
    "imageName":"silva-&-aegis-prime.webp","tags":["Prime","Vaulted"],
    "compTags":["SWORDS_AND_SHIELD_STANCE"]},"Silva & Aegis":{"blockingAngle":70,"comboDuration":5,"followThrough":0.6,"range":2.5,"windUp":0.7,"releaseDate":"2014-07-18","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":1,"crit_chance":5,"crit_mult":1.5,"status_chance":20,"damage":{"Heat":98}},{"name":"Slam","speed":1,"crit_chance":5,"crit_mult":1.5,"status_chance":20,"unique":{"force_procs":["impact"]},"damage":{"Impact":196}},{"name":"Heavy Slam","speed":1,"crit_chance":5,"crit_mult":1.5,"status_chance":20,"damage":{"Blast":294}}],
    "imageName":"silva-&-aegis.webp","tags":["Tenno"],
    "compTags":["SWORDS_AND_SHIELD_STANCE"]},"Simulor":{"noise":"Alarming","releaseDate":"2015-06-25","ammoCapacity":72,"productCategory":"LongGuns","equipTime":1.1,"zoomProps":[[]],"category":"Primary","trigger":"Active","type":"Rifle","magazineSize":8,"reloadTime":3,"multishot":1,"attacks":[{"name":"Orb Launch","speed":3,"crit_chance":12,"crit_mult":2,"status_chance":30,"shot_type":"Projectile","shot_speed":80,"flight":80,"damage":{}},{"name":"Orb Merging Damage","speed":3,"crit_chance":12,"crit_mult":2,"status_chance":30,"damage":{"Magnetic":100}},{"name":"Orb Explosion","speed":3,"crit_chance":12,"crit_mult":2,"status_chance":30,"shot_type":"AoE","unique":{"force_procs":["electricity"]},"damage":{"Magnetic":200},"falloff":{"start":0,"end":5,"reduction":0.6},"no_headshot_mult":true}],
    "imageName":"simulor.webp","tags":["Cephalon"],
    "compTags":["ASSAULT_AMMO","AOE","PROJECTILE"],
    "comb":[[1,2]]},"Snipetron":{"noise":"Alarming","releaseDate":"2012-10-25","ammoCapacity":72,"productCategory":"LongGuns","equipTime":1.1,"zoomProps":[{"Upgrades": [{"DamageType": "DT_ANY", "OperationType": "STACKING_MULTIPLY", "UpgradeType": "mult_for_head", "Value": 0.3}]}, {"Upgrades": [{"DamageType": "DT_ANY", "OperationType": "STACKING_MULTIPLY", "UpgradeType": "mult_for_head", "Value": 0.5}]}],"category":"Primary","trigger":"Semi","type":"Rifle","magazineSize":4,"reloadTime":3.5,"multishot":1,"attacks":[{"name":"Unzoomed","speed":2,"crit_chance":30,"crit_mult":1.5,"status_chance":12,"shot_type":"Hit-Scan","damage":{"Impact":18,"Slash":18,"Puncture":144},"falloff":{"start":400,"end":600,"reduction":0.5}},{"name":"6x Zoom","speed":2,"crit_chance":30,"crit_mult":1.5,"status_chance":12,"shot_type":"Hit-Scan","damage":{"Impact":18,"Slash":18,"Puncture":144},"falloff":{"start":400,"end":600,"reduction":0.5}}],
    "imageName":"snipetron.webp","tags":["Corpus"],
    "compTags":["SNIPER_AMMO"]},"Skana Prime":{"blockingAngle":50,"comboDuration":5,"followThrough":0.6,"range":2.5,"windUp":0.6,"releaseDate":"2012-12-18","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":1,"crit_chance":26,"crit_mult":2.6,"status_chance":26,"damage":{"Impact":31.5,"Slash":147,"Puncture":31.5}},{"name":"Slam","speed":1,"crit_chance":26,"crit_mult":2.6,"status_chance":26,"unique":{"force_procs":["impact"]},"damage":{"Impact":420}},{"name":"Heavy Slam","speed":1,"crit_chance":26,"crit_mult":2.6,"status_chance":26,"damage":{"Blast":630}}],
    "imageName":"skana-prime.webp","tags":["Prime","Vaulted","Founder","Incarnon"],
    "compTags":["SWORDS_STANCE","SKANA"]},"Sobek":{"noise":"Alarming","releaseDate":"2013-07-13","ammoCapacity":240,"productCategory":"LongGuns","zoomProps":[[]],"category":"Primary","trigger":"Auto","type":"Shotgun","magazineSize":20,"reloadTime":2.7,"multishot":5,"attacks":[{"name":"Normal Attack","speed":2.5,"crit_chance":11,"crit_mult":2,"status_chance":16.2,"shot_type":"Hit-Scan","damage":{"Impact":52.5,"Slash":8.75,"Puncture":8.75},"falloff":{"start":20,"end":30,"reduction":0.5}}],
    "imageName":"sobek.webp","tags":["Grineer"],
    "compTags":["SOBEK"]},"Skana":{"blockingAngle":55,"comboDuration":5,"followThrough":0.6,"range":2.5,"windUp":0.6,"releaseDate":"2012-10-25","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":0.833,"crit_chance":5,"crit_mult":1.5,"status_chance":16,"damage":{"Impact":18,"Slash":84,"Puncture":18}},{"name":"Slam","speed":1,"crit_chance":5,"crit_mult":1.5,"status_chance":16,"unique":{"force_procs":["impact"]},"damage":{"Impact":240}},{"name":"Heavy Slam","speed":1,"crit_chance":5,"crit_mult":1.5,"status_chance":16,"damage":{"Blast":360}}],
    "imageName":"skana.webp","tags":["Tenno","Incarnon"],
    "compTags":["SWORDS_STANCE","SKANA"]},"Skiajati":{"blockingAngle":55,"comboDuration":5,"followThrough":0.7,"range":2.7,"windUp":0.5,"releaseDate":"2018-06-15","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":1.17,"crit_chance":19,"crit_mult":2.1,"status_chance":30,"damage":{"Impact":26.25,"Slash":136.5,"Puncture":12.25}},{"name":"Slam","speed":1,"crit_chance":19,"crit_mult":2.1,"status_chance":30,"unique":{"force_procs":["impact"]},"damage":{"Impact":350}},{"name":"Heavy Slam","speed":1,"crit_chance":19,"crit_mult":2.1,"status_chance":30,"damage":{"Blast":525}}],
    "imageName":"skiajati.webp","tags":["Tenno"],
    "compTags":["NIKANAS_STANCE"]},"Snipetron Vandal":{"noise":"Alarming","releaseDate":"2013-07-08","ammoCapacity":72,"productCategory":"LongGuns","equipTime":1.1,"zoomProps":[{"Upgrades": [{"DamageType": "DT_ANY", "OperationType": "STACKING_MULTIPLY", "UpgradeType": "mult_for_head", "Value": 0.3}]}, {"Upgrades": [{"DamageType": "DT_ANY", "OperationType": "STACKING_MULTIPLY", "UpgradeType": "mult_for_head", "Value": 0.5}]}],"category":"Primary","trigger":"Semi","type":"Rifle","magazineSize":6,"reloadTime":2,"multishot":1,"attacks":[{"name":"Unzoomed","speed":2,"crit_chance":28,"crit_mult":2,"status_chance":16,"shot_type":"Hit-Scan","damage":{"Impact":10,"Slash":10,"Puncture":180},"falloff":{"start":400,"end":600,"reduction":0.5}},{"name":"6x Zoom","speed":2,"crit_chance":28,"crit_mult":2,"status_chance":16,"shot_type":"Hit-Scan","damage":{"Impact":10,"Slash":10,"Puncture":180},"falloff":{"start":400,"end":600,"reduction":0.5}}],
    "imageName":"snipetron-vandal.webp","tags":["Corpus","Vandal"],
    "compTags":["SNIPER_AMMO"]},"Shattered Lash (Gara)":{"blockingAngle":90,"comboDuration":5,"followThrough":0.5,"range":1.8,"windUp":0.4,"noise":"Silent","releaseDate":"2025-03-19","productCategory":"Melee","category":"Melee","type":"Exalted Weapon","multishot":1,"attacks":[{"name":"Normal Attack","speed":1,"crit_chance":20,"crit_mult":2,"status_chance":30,"unique":{"set_speed_to_default":1},"damage":{"Puncture":400}},{"name":"Arcing Damage","speed":1,"crit_chance":20,"crit_mult":2,"status_chance":30,"unique":{"set_speed_to_default":1},"damage":{"Slash":400}}],
    "imageName":"ShatteredLash.webp","tags":[],
    "compTags":["GARA_STANCE","POWER_WEAPON"]},"Slaytra":{"blockingAngle":55,"comboDuration":5,"followThrough":0.7,"range":2.5,"windUp":0.7,"releaseDate":"2022-09-07","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":0.833,"crit_chance":21,"crit_mult":1.9,"status_chance":35,"damage":{"Impact":73.26,"Slash":166.5,"Puncture":93.24}},{"name":"Slam","speed":1,"crit_chance":21,"crit_mult":1.9,"status_chance":35,"unique":{"force_procs":["impact"]},"damage":{"Impact":666}},{"name":"Heavy Slam","speed":1,"crit_chance":21,"crit_mult":1.9,"status_chance":35,"damage":{"Blast":999}}],
    "imageName":"slaytra.webp","tags":["Grineer"],
    "compTags":["MACHETES_STANCE"]},"Soma Prime":{"noise":"Alarming","releaseDate":"2014-12-16","ammoCapacity":800,"productCategory":"LongGuns","equipTime":1.1,"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":200,"reloadTime":3,"multishot":1,"attacks":[{"name":"Fully Spooled","speed":15,"crit_chance":30,"crit_mult":3,"status_chance":10,"shot_type":"Hit-Scan","damage":{"Impact":1.2,"Slash":6,"Puncture":4.8}},{"name":"Incarnon Form","speed":7,"crit_chance":10,"crit_mult":3.4,"status_chance":2.8,"damage":{"Impact":1.1,"Slash":10.8,"Puncture":6.1}}],
    "imageName":"soma-prime.webp","tags":["Prime","Vaulted","Incarnon"],
    "compTags":["ASSAULT_AMMO","SOMA_PRIME"]},"Soma":{"noise":"Alarming","releaseDate":"2013-09-13","productCategory":"LongGuns","equipTime":1.1,"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":100,"reloadTime":3,"multishot":1,"attacks":[{"name":"Fully Spooled","speed":15,"crit_chance":30,"crit_mult":3,"status_chance":7,"shot_type":"Hit-Scan","damage":{"Impact":1.2,"Slash":6,"Puncture":4.8}},{"name":"Incarnon Form","speed":7,"crit_chance":10,"crit_mult":3,"status_chance":1.8,"damage":{"Impact":0.5,"Slash":4.8,"Puncture":2.7}}],
    "imageName":"soma.webp","tags":["Tenno","Incarnon"],
    "compTags":["ASSAULT_AMMO"]},"Spectra":{"noise":"Alarming","releaseDate":"2013-07-13","ammoCapacity":360,"productCategory":"Pistols","equipTime":1.1,"zoomProps":[[]],"category":"Secondary","trigger":"Held","type":"Pistol","magazineSize":60,"reloadTime":1.8,"multishot":1,"attacks":[{"name":"Normal Attack","speed":12,"crit_chance":14,"crit_mult":2,"status_chance":22,"shot_type":"Discharge","damage":{"Slash":10.44,"Puncture":7.56}}],
    "imageName":"spectra.webp","tags":["Corpus"],
    "compTags":["BEAM"]},"Spira":{"noise":"Silent","releaseDate":"2015-09-23","productCategory":"Pistols","category":"Secondary","trigger":"Auto","type":"Throwing","magazineSize":10,"reloadTime":1,"multishot":1,"attacks":[{"name":"Normal Attack","speed":2.5,"crit_chance":30,"crit_mult":2,"status_chance":8,"shot_type":"Projectile","shot_speed":70,"flight":70,"damage":{"Impact":8.2,"Slash":24.6,"Puncture":49.2}}],
    "imageName":"spira.webp","tags":["Tenno"],
    "compTags":["PROJECTILE","THROWN"]},"Sonicor":{"noise":"Alarming","releaseDate":"2015-10-01","ammoCapacity":150,"productCategory":"Pistols","zoomProps":[[]],"category":"Secondary","trigger":"Semi","type":"Pistol","magazineSize":15,"reloadTime":3,"multishot":1,"attacks":[{"name":"Projectile Impact","speed":1.25,"crit_chance":0,"crit_mult":1,"status_chance":0,"shot_type":"Projectile","shot_speed":80,"flight":80,"damage":{"Impact":150},"falloff":{"start":0,"end":20,"reduction":0.8333}},{"name":"Explosion","speed":1.25,"crit_chance":10,"crit_mult":2,"status_chance":25,"shot_type":"AoE","unique":{"force_procs":["impact"]},"damage":{"Impact":50},"no_headshot_mult":true}],
    "imageName":"sonicor.webp","tags":["Corpus"],
    "compTags":["PROJECTILE"],
    "comb":[[0,1]]},"Spinnerex":{"blockingAngle":45,"comboDuration":5,"followThrough":0.5,"range":3,"windUp":0.4,"releaseDate":"2025-06-25","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":1.36,"crit_chance":16,"crit_mult":2.4,"status_chance":40,"damage":{"Toxin":168}},{"name":"Slam","speed":1,"crit_chance":16,"crit_mult":2.4,"status_chance":40,"damage":{"Toxin":336}},{"name":"Heavy Slam","speed":1,"crit_chance":16,"crit_mult":2.4,"status_chance":40,"damage":{"Toxin":504}}],
    "imageName":"Spinnerex.webp","tags":[],
    "compTags":["BLADE_AND_WHIP_STANCE"]},"Sporothrix":{"noise":"Alarming","releaseDate":"2020-11-19","ammoCapacity":45,"productCategory":"LongGuns","category":"Primary","trigger":"Semi","type":"Rifle","magazineSize":9,"reloadTime":2.7,"multishot":1,"attacks":[{"name":"Unzoomed","speed":1.83,"crit_chance":1,"crit_mult":3,"status_chance":53,"shot_type":"Projectile","shot_speed":270,"flight":270,"damage":{"Impact":100.17,"Slash":155.82,"Puncture":115.01},"falloff":{"start":400,"end":600,"reduction":0.5}},{"name":"2.7x Zoom","speed":1.83,"crit_chance":1,"crit_mult":3,"status_chance":53,"shot_type":"Projectile","shot_speed":270,"flight":270,"damage":{"Impact":100.17,"Slash":155.82,"Puncture":115.01},"falloff":{"start":400,"end":600,"reduction":0.5}},{"name":"AoE","speed":1.83,"crit_chance":1,"crit_mult":3,"status_chance":53,"shot_type":"AoE","damage":{"Slash":22,"Viral":19},"falloff":{"start":0,"end":1.7,"reduction":0.1},"no_headshot_mult":true}],
    "imageName":"sporothrix.webp","tags":["Infested"],
    "compTags":["SNIPER_AMMO","PROJECTILE","SPOROTHRIX"],
    "comb":[[0,2]]},"Sporelacer (Primary)":{"ammoCapacity":60,"productCategory":"","category":"Primary","type":"Kitgun","magazineSize":0,"reloadTime":3,"multishot":1,"attacks":[{"name":"Normal Attack","speed":1.5,"crit_chance":0,"crit_mult":0,"status_chance":0,"shot_type":"Projectile","shot_speed":50,"damage":{"Impact":57}},{"name":"Explosion","speed":1.5,"crit_chance":0,"crit_mult":0,"status_chance":0,"shot_type":"AoE","shot_speed":50,"damage":{"Toxin":199},"no_headshot_mult":true}],
    "imageName":"sporelacer.webp","tags":["primary-shotgun"],
    "compTags":[""],
    "comb":[[0,1]]},"Spira Prime":{"noise":"Silent","releaseDate":"2016-02-16","productCategory":"Pistols","category":"Secondary","trigger":"Auto","type":"Throwing","magazineSize":12,"reloadTime":0.75,"multishot":1,"attacks":[{"name":"Normal Attack","speed":3.33,"crit_chance":30,"crit_mult":3,"status_chance":14,"shot_type":"Projectile","shot_speed":70,"flight":70,"damage":{"Impact":6,"Slash":6,"Puncture":48}}],
    "imageName":"spira-prime.webp","tags":["Prime","Vaulted"],
    "compTags":["PROJECTILE","THROWN"]},"Sporelacer (Secondary)":{"ammoCapacity":130,"productCategory":"Pistols","category":"Secondary","trigger":"Semi","type":"Kitgun","magazineSize":0,"reloadTime":3,"multishot":1,"attacks":[{"name":"Normal Attack","speed":1.5,"crit_chance":0,"crit_mult":0,"status_chance":0,"shot_type":"Projectile","shot_speed":100,"unique":{"force_procs":["impact"]},"damage":{"Impact":89,"fire":167}},{"name":"Explosion","speed":1.5,"crit_chance":0,"crit_mult":0,"status_chance":0,"shot_type":"AoE","shot_speed":50,"damage":{"Toxin":199},"no_headshot_mult":true}],
    "imageName":"sporelacer.webp","tags":["secondary-shotgun"],
    "compTags":[""],
    "comb":[[0,1]]},"Spectra Vandal":{"noise":"Alarming","releaseDate":"2019-05-22","ammoCapacity":400,"productCategory":"Pistols","equipTime":1.1,"zoomProps":[[]],"category":"Secondary","trigger":"Held","type":"Pistol","magazineSize":80,"reloadTime":1.2,"multishot":1,"attacks":[{"name":"Normal Attack","speed":12,"crit_chance":20,"crit_mult":2,"status_chance":28,"shot_type":"Discharge","damage":{"Slash":12.76,"Puncture":9.24}}],
    "imageName":"spectra-vandal.webp","tags":["Corpus","Vandal"],
    "compTags":["BEAM"]},"Stahlta":{"noise":"Alarming","releaseDate":"2020-06-11","ammoCapacity":300,"productCategory":"LongGuns","equipTime":1.1,"zoomProps":[[]],"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":40,"reloadTime":1.4,"multishot":1,"attacks":[{"name":"Auto","speed":6,"crit_chance":24,"crit_mult":1.8,"status_chance":22,"shot_type":"Projectile","shot_speed":50,"flight":50,"damage":{"Impact":7.28,"Slash":28.08,"Puncture":16.64}},{"name":"Alt-Fire","speed":0.667,"crit_chance":40,"crit_mult":3,"status_chance":32,"shot_type":"Projectile","shot_speed":50,"flight":50,"unique":{"force_procs":["impact"]},"damage":{"Impact":120,"Slash":300,"Puncture":180}},{"name":"Alt-Fire AoE","speed":0.667,"crit_chance":40,"crit_mult":3,"status_chance":32,"shot_type":"AoE","damage":{"Radiation":1200},"falloff":{"start":0,"end":7.2,"reduction":0.7},"no_headshot_mult":true}],
    "imageName":"stahlta.webp","tags":["Corpus"],
    "compTags":["ASSAULT_AMMO","PROJECTILE","AOE"],
    "comb":[[1,2]]},"Steflos":{"noise":"Alarming","releaseDate":"2023-02-15","ammoCapacity":36,"productCategory":"LongGuns","zoomProps":[[]],"category":"Primary","trigger":"Semi","type":"Shotgun","magazineSize":12,"reloadTime":2.4,"multishot":1,"attacks":[{"name":"Normal Attack","speed":3,"crit_chance":14,"crit_mult":2.2,"status_chance":22,"shot_type":"Projectile","shot_speed":1,"damage":{"Impact":130,"Heat":190}}],
    "imageName":"steflos.webp","tags":[""],
    "compTags":["PROJECTILE","ASSAULT_AMMO"]},"Strun Wraith":{"noise":"Alarming","releaseDate":"2013-09-03","ammoCapacity":120,"productCategory":"LongGuns","zoomProps":[[]],"category":"Primary","trigger":"Semi","type":"Shotgun","magazineSize":10,"reloadTime":5,"multishot":10,"attacks":[{"name":"Normal Attack","speed":2.5,"crit_chance":18,"crit_mult":2.2,"status_chance":12,"shot_type":"Hit-Scan","damage":{"Impact":26,"Slash":8,"Puncture":6},"falloff":{"start":15,"end":30,"reduction":0.5}},{"name":"Incarnon Form","speed":2,"crit_chance":56,"crit_mult":3.4,"status_chance":44,"damage":{"Impact":100}},{"name":"Incarnon Form Radial Attack","speed":2,"crit_chance":56,"crit_mult":3.4,"status_chance":44,"shot_type":"AoE","damage":{"Blast":70,"Slash":90,"Puncture":40},"no_headshot_mult":true}],
    "imageName":"strun-wraith.webp","tags":["Tenno","Invasion Reward","Wraith","Incarnon"],
    "compTags":[],
    "comb":[[1,2]]},"Stradavar":{"noise":"Alarming","releaseDate":"2016-05-11","productCategory":"LongGuns","equipTime":1.1,"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":65,"reloadTime":2,"multishot":1,"attacks":[{"name":"Full Auto Mode","speed":10,"crit_chance":24,"crit_mult":2,"status_chance":12,"shot_type":"Hit-Scan","damage":{"Impact":9.8,"Slash":8.4,"Puncture":9.8}},{"name":"Semi-Auto Mode","speed":5,"crit_chance":28,"crit_mult":2,"status_chance":16,"shot_type":"Hit-Scan","damage":{"Impact":7.5,"Slash":12.5,"Puncture":30}}],
    "imageName":"stradavar.webp","tags":["Tenno"],
    "compTags":["ASSAULT_AMMO"]},"Stropha":{"blockingAngle":45,"comboDuration":5,"followThrough":0.5,"range":2,"windUp":0.4,"releaseDate":"2020-06-11","productCategory":"Melee","zoomProps":[[]],"category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":1,"crit_chance":30,"crit_mult":2.4,"status_chance":14,"damage":{"Impact":61.6,"Slash":83.6,"Puncture":74.8}},{"name":"Ranged Attack","speed":2.5,"crit_chance":30,"crit_mult":2.4,"status_chance":14,"shot_type":"Projectile","shot_speed":120,"flight":120,"damage":{"Impact":700},"falloff":{"start":6,"end":12,"reduction":0.99},"no_headshot_mult":true},{"name":"Slam","speed":1,"crit_chance":30,"crit_mult":2.4,"status_chance":14,"unique":{"force_procs":["impact"]},"damage":{"Impact":440}},{"name":"Heavy Slam","speed":1,"crit_chance":30,"crit_mult":2.4,"status_chance":14,"damage":{"Blast":660}}],
    "imageName":"stropha.webp","tags":["Corpus"],
    "compTags":["GUNBLADE_STANCE"]},"Staticor":{"noise":"Alarming","releaseDate":"2016-02-04","ammoCapacity":288,"productCategory":"Pistols","zoomProps":[[]],"category":"Secondary","trigger":"Charge","type":"Pistol","magazineSize":48,"reloadTime":1.5,"multishot":1,"attacks":[{"name":"Uncharged Projectile","speed":3.5,"crit_chance":14,"crit_mult":2.2,"status_chance":28,"shot_type":"Projectile","shot_speed":60,"flight":60,"damage":{"Radiation":44}},{"name":"Uncharged Explosion","speed":3.5,"crit_chance":0,"crit_mult":1,"status_chance":28,"shot_type":"AoE","damage":{"Radiation":88},"falloff":{"start":0,"end":2.4,"reduction":0.3},"no_headshot_mult":true},{"name":"Fully Charged Projectile","speed":3.5,"crit_chance":14,"crit_mult":2.2,"status_chance":28,"shot_type":"Projectile","shot_speed":40,"flight":40,"damage":{"Radiation":44}},{"name":"Fully Charged Explosion","speed":3.5,"crit_chance":14,"crit_mult":2.2,"status_chance":28,"shot_type":"AoE","damage":{"Radiation":106},"falloff":{"start":0,"end":9.6,"reduction":0.9},"no_headshot_mult":true}],
    "imageName":"staticor.webp","tags":["Corpus"],
    "compTags":["PROJECTILE","AOE"],
    "comb":[[0,1],
    [2,3]]},"Stubba":{"noise":"Alarming","releaseDate":"2017-10-12","ammoCapacity":399,"productCategory":"Pistols","zoomProps":[[]],"category":"Secondary","trigger":"Auto","type":"Pistol","magazineSize":57,"reloadTime":1.3,"multishot":1,"attacks":[{"name":"Normal Attack","speed":6.33,"crit_chance":23,"crit_mult":1.9,"status_chance":13,"shot_type":"Hit-Scan","damage":{"Impact":14.19,"Slash":15.51,"Puncture":3.3}}],
    "imageName":"stubba.webp","tags":["Grineer"],
    "compTags":[]},"Stradavar Prime":{"noise":"Alarming","releaseDate":"2019-03-27","ammoCapacity":720,"productCategory":"LongGuns","equipTime":1.1,"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":90,"reloadTime":2,"multishot":1,"attacks":[{"name":"Full Auto Mode","speed":10,"crit_chance":24,"crit_mult":2.6,"status_chance":12,"shot_type":"Hit-Scan","damage":{"Impact":10.5,"Slash":9,"Puncture":10.5}},{"name":"Semi-Auto Mode","speed":3.33,"crit_chance":30,"crit_mult":2.8,"status_chance":22,"shot_type":"Hit-Scan","damage":{"Impact":8,"Slash":48,"Puncture":24}}],
    "imageName":"stradavar-prime.webp","tags":["Prime","Vaulted"],
    "compTags":["ASSAULT_AMMO"]},"Strun":{"noise":"Alarming","releaseDate":"2012-10-25","ammoCapacity":120,"productCategory":"LongGuns","zoomProps":[[]],"category":"Primary","trigger":"Semi","type":"Shotgun","magazineSize":6,"reloadTime":3.75,"multishot":12,"attacks":[{"name":"Normal Attack","speed":2.5,"crit_chance":7.5,"crit_mult":1.5,"status_chance":5,"shot_type":"Hit-Scan","damage":{"Impact":13.75,"Slash":7.5,"Puncture":3.75},"falloff":{"start":12,"end":25,"reduction":0.4}},{"name":"Incarnon Form","speed":2,"crit_chance":44,"crit_mult":2.8,"status_chance":40,"damage":{"Impact":100}},{"name":"Incarnon Form Radial Attack","speed":2,"crit_chance":44,"crit_mult":2.8,"status_chance":40,"shot_type":"AoE","damage":{"Blast":60,"Slash":80,"Puncture":30},"no_headshot_mult":true}],
    "imageName":"strun.webp","tags":["Tenno","Incarnon"],
    "compTags":[],
    "comb":[[1,2]]},"Strun Prime":{"noise":"Alarming","releaseDate":"2021-09-08","ammoCapacity":120,"productCategory":"LongGuns","zoomProps":[[]],"category":"Primary","trigger":"Semi","type":"Shotgun","magazineSize":10,"reloadTime":4.6,"multishot":12,"attacks":[{"name":"Normal Attack","speed":3.33,"crit_chance":24,"crit_mult":2.2,"status_chance":6.67,"shot_type":"Hit-Scan","damage":{"Impact":19.8,"Slash":17.6,"Puncture":6.6},"falloff":{"start":26,"end":52,"reduction":0.5}},{"name":"Incarnon Form","speed":2.5,"crit_chance":48,"crit_mult":3.4,"status_chance":46,"damage":{"Impact":100}},{"name":"Incarnon Form Radial Attack","speed":2.5,"crit_chance":48,"crit_mult":3.4,"status_chance":46,"shot_type":"AoE","damage":{"Blast":60,"Slash":100,"Puncture":40},"no_headshot_mult":true}],
    "imageName":"strun-prime.webp","tags":["Prime","Incarnon"],
    "compTags":[],
    "comb":[[1,2]]},"Stug":{"noise":"Alarming","releaseDate":"2013-12-19","productCategory":"Pistols","category":"Secondary","trigger":"Auto","type":"Pistol","magazineSize":20,"reloadTime":2,"multishot":1,"attacks":[{"name":"Blob Impact","speed":4,"crit_chance":5,"crit_mult":1.5,"status_chance":0,"shot_type":"Projectile","shot_speed":35,"flight":35,"damage":{"Corrosive":4}},{"name":"Blob Explosion","speed":4,"crit_chance":5,"crit_mult":1.5,"status_chance":10,"shot_type":"AoE","damage":{"Corrosive":75},"falloff":{"start":0,"end":2.8,"reduction":0.3},"no_headshot_mult":true},{"name":"Incarnon Form Blob Embed","speed":4,"crit_chance":15,"crit_mult":2,"status_chance":20,"shot_type":"AoE","shot_speed":35,"damage":{"Corrosive":50},"no_headshot_mult":true},{"name":"Incarnon Form Blob Explosion","speed":4,"crit_chance":15,"crit_mult":2,"status_chance":20,"shot_type":"AoE","damage":{"Corrosive":200},"no_headshot_mult":true},{"name":"Incarnon Form Bounce Explosion","speed":4,"crit_chance":15,"crit_mult":2,"status_chance":20,"shot_type":"AoE","damage":{"Corrosive":200},"no_headshot_mult":true}],
    "imageName":"stug.webp","tags":["Grineer","Incarnon"],
    "compTags":["PROJECTILE","AOE"],
    "comb":[[0,1]]},"Sun & Moon":{"blockingAngle":60,"comboDuration":5,"followThrough":0.55,"range":2.6,"windUp":1,"productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":1,"crit_chance":20,"crit_mult":2.4,"status_chance":22,"damage":{"Impact":38,"Puncture":45.599998,"Slash":106.4}},{"name":"Slam","speed":1,"crit_chance":20,"crit_mult":2.4,"status_chance":22,"unique":{"force_procs":["impact"]},"damage":{"Impact":380}},{"name":"Heavy Slam","speed":1,"crit_chance":20,"crit_mult":2.4,"status_chance":22,"damage":{"Blast":570}}],
    "imageName":"sun-moon.webp","tags":[""],
    "compTags":["DUAL_KATANAS_STANCE"]},"Supra":{"noise":"Alarming","releaseDate":"2013-05-23","ammoCapacity":1080,"productCategory":"LongGuns","equipTime":1.1,"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":180,"reloadTime":3,"multishot":1,"attacks":[{"name":"Fully Spooled","speed":12.5,"crit_chance":12,"crit_mult":1.8,"status_chance":30,"shot_type":"Projectile","shot_speed":100,"flight":100,"damage":{"Impact":4,"Slash":6,"Puncture":30}}],
    "imageName":"supra.webp","tags":["Corpus"],
    "compTags":["PROJECTILE","ASSAULT_AMMO","SUPRA"]},"Sybaris":{"noise":"Alarming","releaseDate":"2014-05-14","productCategory":"LongGuns","equipTime":1.1,"category":"Primary","trigger":"Burst","type":"Rifle","magazineSize":10,"reloadTime":2,"multishot":1,"attacks":[{"name":"Normal Attack","speed":3.33,"crit_chance":25,"crit_mult":2,"status_chance":10,"shot_type":"Hit-Scan","damage":{"Impact":26.4,"Slash":27.2,"Puncture":26.4}},{"name":"Incarnon Form","speed":3.33,"crit_chance":20,"crit_mult":3,"status_chance":20,"shot_type":"Hit-Scan","unique":{"force_procs":["blast"]},"damage":{"Impact":29.7,"Slash":30.6,"Puncture":29.7}}],
    "imageName":"sybaris.webp","tags":["Tenno","Incarnon"],
    "compTags":["ASSAULT_AMMO"]},"Syam":{"blockingAngle":55,"comboDuration":5,"followThrough":0.7,"range":2.5,"windUp":0.5,"productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":1,"crit_chance":22,"crit_mult":2,"status_chance":34,"damage":{"Impact":54,"Puncture":108,"Slash":108}},{"name":"Slam","speed":1,"crit_chance":22,"crit_mult":2,"status_chance":34,"unique":{"force_procs":["impact"]},"damage":{"Impact":540}},{"name":"Heavy Slam","speed":1,"crit_chance":22,"crit_mult":2,"status_chance":34,"damage":{"Blast":810}}],
    "imageName":"syam.webp","tags":[""],
    "compTags":["NIKANAS_STANCE"]},"Synapse":{"noise":"Alarming","releaseDate":"2013-09-13","ammoCapacity":560,"productCategory":"LongGuns","equipTime":1.1,"zoomProps":[[]],"category":"Primary","trigger":"Held","type":"Rifle","magazineSize":70,"reloadTime":1.5,"multishot":1,"attacks":[{"name":"Normal Attack","speed":12,"crit_chance":39,"crit_mult":2.7,"status_chance":13,"shot_type":"Discharge","damage":{"Corrosive":20}}],
    "imageName":"synapse.webp","tags":["Infested"],
    "compTags":["BEAM","ASSAULT_AMMO"]},"Synoid Gammacor":{"noise":"Alarming","releaseDate":"2014-11-27","ammoCapacity":400,"productCategory":"Pistols","zoomProps":[[]],"category":"Secondary","trigger":"Held","type":"Pistol","magazineSize":80,"reloadTime":1.8,"multishot":1,"attacks":[{"name":"Normal Attack","speed":12,"crit_chance":20,"crit_mult":2,"status_chance":28,"shot_type":"Discharge","damage":{"Magnetic":20}},{"name":"Incarnon Form","speed":1,"crit_chance":22,"crit_mult":2.2,"status_chance":24,"shot_type":"Projectile","unique":{"force_procs":["impact"]},"damage":{"Impact":100}},{"name":"Incarnon Form Radial Attack","speed":1,"crit_chance":22,"crit_mult":2.2,"status_chance":24,"shot_type":"AoE","damage":{"Cold":800},"no_headshot_mult":true}],
    "imageName":"synoid-gammacor.webp","tags":["Syndicate","Cephalon Suda","Incarnon"],
    "compTags":["BEAM"],
    "comb":[[1,2]]},"Supra Vandal":{"noise":"Alarming","releaseDate":"2017-05-04","ammoCapacity":1600,"productCategory":"LongGuns","equipTime":1.1,"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":300,"reloadTime":3,"multishot":1,"attacks":[{"name":"Fully Spooled","speed":12.5,"crit_chance":16,"crit_mult":2,"status_chance":30,"shot_type":"Projectile","shot_speed":100,"flight":100,"damage":{"Impact":4,"Slash":6,"Puncture":30}}],
    "imageName":"supra-vandal.webp","tags":["Corpus","Vandal"],
    "compTags":["PROJECTILE","ASSAULT_AMMO","SUPRA"]},"Sydon":{"blockingAngle":55,"comboDuration":5,"followThrough":0.6,"range":2.9,"windUp":0.9,"releaseDate":"2016-01-05","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":0.917,"crit_chance":10,"crit_mult":2,"status_chance":25,"damage":{"Impact":11.25,"Puncture":213.75}},{"name":"Slam","speed":1,"crit_chance":10,"crit_mult":2,"status_chance":25,"unique":{"force_procs":["impact"]},"damage":{"Blast":450}},{"name":"Heavy Slam","speed":1,"crit_chance":10,"crit_mult":2,"status_chance":25,"damage":{"Blast":675}}],
    "imageName":"sydon.webp","tags":["Grineer"],
    "compTags":["POLEARMS_STANCE"]},"Sybaris Prime":{"noise":"Alarming","releaseDate":"2017-05-30","productCategory":"LongGuns","equipTime":1.1,"category":"Primary","trigger":"Burst","type":"Rifle","magazineSize":20,"reloadTime":2,"multishot":1,"attacks":[{"name":"Normal Attack","speed":3.33,"crit_chance":30,"crit_mult":2,"status_chance":25,"shot_type":"Hit-Scan","damage":{"Impact":29.04,"Slash":29.92,"Puncture":29.04}},{"name":"Incarnon Form","speed":3.33,"crit_chance":25,"crit_mult":3,"status_chance":30,"shot_type":"Hit-Scan","unique":{"force_procs":["blast"]},"damage":{"Impact":36.3,"Slash":37.4,"Puncture":36.3}}],
    "imageName":"sybaris-prime.webp","tags":["Prime","Vaulted","Incarnon"],
    "compTags":["ASSAULT_AMMO"]},"Synoid Heliocor":{"blockingAngle":50,"comboDuration":5,"followThrough":0.4,"range":2.6,"windUp":1.2,"releaseDate":"2016-09-15","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":1.08,"crit_chance":16,"crit_mult":2,"status_chance":40,"damage":{"Impact":238,"Slash":14,"Puncture":28}},{"name":"Slam","speed":1,"crit_chance":16,"crit_mult":2,"status_chance":40,"damage":{"Impact":560}},{"name":"Heavy Slam","speed":1,"crit_chance":16,"crit_mult":2,"status_chance":40,"damage":{"Blast":840}}],
    "imageName":"synoid-heliocor.webp","tags":["Syndicate","Cephalon Suda"],
    "compTags":["HAMMERS_STANCE"]},"Synoid Simulor":{"noise":"Alarming","releaseDate":"2015-09-02","ammoCapacity":96,"productCategory":"LongGuns","equipTime":1.1,"zoomProps":[[]],"category":"Primary","trigger":"Active","type":"Rifle","magazineSize":16,"reloadTime":2,"multishot":1,"attacks":[{"name":"Orb Launch","speed":3.33,"crit_chance":0,"crit_mult":1,"status_chance":0,"shot_type":"Projectile","damage":{}},{"name":"Orb Merging Damage","speed":3.33,"crit_chance":14,"crit_mult":2,"status_chance":35,"shot_type":"AoE","damage":{"Magnetic":125},"falloff":{"start":0,"end":4,"reduction":0},"no_headshot_mult":true},{"name":"Orb Explosion","speed":3.33,"crit_chance":14,"crit_mult":2,"status_chance":35,"shot_type":"AoE","unique":{"force_procs":["electricity"]},"damage":{"Magnetic":240},"falloff":{"start":0,"end":5,"reduction":1},"no_headshot_mult":true},{"name":"Singularity","speed":4,"crit_chance":0,"crit_mult":0,"status_chance":0,"damage":{"Magnetic":50},"falloff":{"start":0,"end":5,"reduction":0}}],
    "imageName":"synoid-simulor.webp","tags":["Syndicate","Cephalon Suda","Cephalon"],
    "compTags":["ASSAULT_AMMO","AOE","PROJECTILE"],
    "comb":[[1,2]]},"Tak & Lug":{"blockingAngle":70,"comboDuration":5,"followThrough":0.6,"range":2.5,"windUp":0.7,"releaseDate":"2025-04-17","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":1,"crit_chance":21,"crit_mult":1.9,"status_chance":31,"damage":{"Impact":39.4,"Slash":157.6}},{"name":"Slam","speed":1,"crit_chance":21,"crit_mult":1.9,"status_chance":10,"damage":{"Impact":394}},{"name":"Heavy Slam","speed":1,"crit_chance":21,"crit_mult":1.9,"status_chance":10,"damage":{"Blast":522}}],
    "imageName":"TakLug.webp","tags":["Tenno"],
    "compTags":["SWORDS_AND_SHIELD_STANCE"]},"Tekko":{"blockingAngle":50,"comboDuration":5,"followThrough":0.9,"range":1.25,"windUp":0.6,"releaseDate":"2015-10-01","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":0.917,"crit_chance":30,"crit_mult":2,"status_chance":10,"damage":{"Impact":32,"Slash":112,"Puncture":16}},{"name":"Slam","speed":1,"crit_chance":30,"crit_mult":2,"status_chance":10,"unique":{"force_procs":["impact"]},"damage":{"Impact":320}},{"name":"Heavy Slam","speed":1,"crit_chance":30,"crit_mult":2,"status_chance":10,"damage":{"Blast":480}}],
    "imageName":"tekko.webp","tags":["Tenno"],
    "compTags":["FIST_STANCE"]},"Telos Akbolto":{"noise":"Alarming","releaseDate":"2014-11-27","productCategory":"Pistols","category":"Secondary","trigger":"Semi","type":"Pistol","magazineSize":30,"reloadTime":2.6,"multishot":1,"attacks":[{"name":"Normal Attack","speed":10,"crit_chance":13,"crit_mult":2,"status_chance":29,"shot_type":"Projectile","shot_speed":75,"flight":75,"damage":{"Impact":4.7,"Puncture":42.3}}],
    "imageName":"telos-akbolto.webp","tags":["Syndicate","Arbiters of Hexis"],
    "compTags":["PROJECTILE"]},"Telos Boltace":{"blockingAngle":60,"comboDuration":5,"followThrough":0.6,"range":2.5,"windUp":0.7,"releaseDate":"2016-09-15","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":1.08,"crit_chance":20,"crit_mult":2,"status_chance":35,"damage":{"Impact":21,"Slash":10.5,"Puncture":178.5}},{"name":"Stormpath Slide Attack","speed":1.08,"crit_chance":20,"crit_mult":2,"status_chance":35,"damage":{"Impact":42,"Slash":21,"Puncture":357}},{"name":"Slam","speed":1,"crit_chance":20,"crit_mult":2,"status_chance":35,"unique":{"force_procs":["impact"]},"damage":{"Impact":420}},{"name":"Heavy Slam","speed":1,"crit_chance":20,"crit_mult":2,"status_chance":35,"damage":{"Blast":630}}],
    "imageName":"telos-boltace.webp","tags":["Syndicate","Arbiters of Hexis"],
    "compTags":["TONFA_STANCE"]},"Tatsu":{"blockingAngle":55,"comboDuration":5,"followThrough":0.7,"range":3,"windUp":0.7,"releaseDate":"2019-03-08","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":1,"crit_chance":16,"crit_mult":2,"status_chance":28,"damage":{"Impact":20,"Slash":68,"Puncture":54,"Radiation":72}},{"name":"Soul Swarm Projectile","speed":1,"crit_chance":16,"crit_mult":2,"status_chance":28,"shot_type":"Projectile","damage":{"Radiation":96}},{"name":"Slam","speed":1,"crit_chance":16,"crit_mult":2,"status_chance":28,"unique":{"force_procs":["impact"]},"damage":{"Impact":428}},{"name":"Heavy Slam","speed":1,"crit_chance":16,"crit_mult":2,"status_chance":28,"damage":{"Blast":642}}],
    "imageName":"tatsu.webp","tags":["Tenno"],
    "compTags":["LONG_KATANA_STANCE"]},"Talons":{"noise":"Silent","releaseDate":"2015-12-03","ammoCapacity":12,"productCategory":"Pistols","category":"Secondary","trigger":"Active","type":"Throwing","magazineSize":4,"reloadTime":1,"multishot":1,"attacks":[{"name":"Mid-Flight Detonation","speed":3.33,"crit_chance":22,"crit_mult":2,"status_chance":26,"shot_type":"AoE","damage":{"Blast":120},"falloff":{"start":0,"end":4,"reduction":0.5},"no_headshot_mult":true},{"name":"Embedded Detonation","speed":3.33,"crit_chance":22,"crit_mult":2,"status_chance":10,"shot_type":"AoE","unique":{"force_procs":["puncture"]},"damage":{"Blast":250},"falloff":{"start":0,"end":4,"reduction":0.5},"no_headshot_mult":true}],
    "imageName":"talons.webp","tags":["Tenno"],
    "compTags":["PROJECTILE","DEPLOYABLE","AOE","SINGLESHOT"]},"Tatsu Prime":{"blockingAngle":55,"comboDuration":5,"followThrough":0.7,"range":3,"windUp":0.7,"releaseDate":"2022-10-05","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":1.17,"crit_chance":22,"crit_mult":2.4,"status_chance":30,"damage":{"Impact":20,"Slash":76,"Puncture":54,"Radiation":80}},{"name":"Soul Swarm Projectile","speed":1.17,"crit_chance":22,"crit_mult":2.4,"status_chance":30,"shot_type":"Projectile","damage":{"Radiation":96}},{"name":"Slam","speed":1,"crit_chance":22,"crit_mult":2.4,"status_chance":30,"unique":{"force_procs":["impact"]},"damage":{"Impact":460}},{"name":"Heavy Slam","speed":1,"crit_chance":22,"crit_mult":2.4,"status_chance":30,"damage":{"Blast":690}}],
    "imageName":"tatsu-prime.webp","tags":["Prime"],
    "compTags":["LONG_KATANA_STANCE"]},"Tekko Prime":{"blockingAngle":50,"comboDuration":5,"followThrough":0.9,"range":1.35,"windUp":0.6,"releaseDate":"2019-10-01","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":1,"crit_chance":30,"crit_mult":2.4,"status_chance":26,"damage":{"Impact":39.6,"Slash":115.2,"Puncture":25.2}},{"name":"Slam","speed":1,"crit_chance":30,"crit_mult":2.4,"status_chance":26,"unique":{"force_procs":["impact"]},"damage":{"Impact":360}},{"name":"Heavy Slam","speed":1,"crit_chance":30,"crit_mult":2.4,"status_chance":26,"damage":{"Blast":540}}],
    "imageName":"tekko-prime.webp","tags":["Prime"],
    "compTags":["FIST_STANCE"]},"Thalys":{"blockingAngle":65,"comboDuration":5,"followThrough":0.4,"range":2.8,"windUp":1,"releaseDate":"2025-06-25","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":0.917,"crit_chance":30,"crit_mult":2.2,"status_chance":24,"damage":{"Impact":34.5,"Slash":210,"Puncture":90}},{"name":"Slam","speed":1,"crit_chance":30,"crit_mult":2.2,"status_chance":24,"damage":{"Impact":600}},{"name":"Heavy Slam","speed":1,"crit_chance":30,"crit_mult":2.2,"status_chance":24,"damage":{"Blast":900}}],
    "imageName":"Thalys.webp","tags":["Incarnon"],
    "compTags":["HEAVY SCYTHE_STANCE"]},"Tenet Agendus":{"blockingAngle":90,"comboDuration":5,"followThrough":0.6,"range":2.6,"windUp":1,"releaseDate":"2021-07-06","productCategory":"Melee","zoomProps":[[]],"category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":0.917,"crit_chance":24,"crit_mult":2,"status_chance":28,"damage":{"Impact":120,"Electricity":140}},{"name":"Energy Disk","speed":1,"crit_chance":24,"crit_mult":2,"status_chance":28,"shot_type":"Projectile","shot_speed":80,"flight":80,"damage":{"Electricity":2880},"falloff":{"start":10,"end":20,"reduction":0.9305}},{"name":"Slam","speed":1,"crit_chance":24,"crit_mult":2,"status_chance":28,"damage":{"Electricity":520}},{"name":"Heavy Slam","speed":1,"crit_chance":24,"crit_mult":2,"status_chance":28,"damage":{"Electricity":780}}],
    "imageName":"tenet-agendus.webp","tags":["Corpus","Tenet"],
    "compTags":["SWORDS_AND_SHIELD_STANCE"]},"Telos Boltor":{"noise":"Alarming","releaseDate":"2015-09-02","productCategory":"LongGuns","equipTime":1.1,"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":90,"reloadTime":2.4000001,"multishot":1,"attacks":[{"name":"Normal Attack","speed":9.33,"crit_chance":30,"crit_mult":2.4,"status_chance":16,"shot_type":"Projectile","shot_speed":90,"flight":90,"damage":{"Impact":3,"Puncture":27}},{"name":"Incarnon Form","speed":10.33,"crit_chance":36,"crit_mult":3.2,"status_chance":10.7,"shot_type":"Projectile","damage":{"Impact":2,"Slash":12,"Puncture":6}}],
    "imageName":"telos-boltor.webp","tags":["Syndicate","Arbiters of Hexis","Incarnon"],
    "compTags":["PROJECTILE","ASSAULT_AMMO"]},"Tenet Arca Plasmor":{"noise":"Alarming","releaseDate":"2021-07-06","ammoCapacity":40,"productCategory":"LongGuns","zoomProps":[[]],"category":"Primary","trigger":"Semi","type":"Rifle","magazineSize":10,"reloadTime":3,"multishot":1,"attacks":[{"name":"Normal Attack","speed":1,"crit_chance":22,"crit_mult":2,"status_chance":34,"shot_type":"Projectile","shot_speed":120,"flight":120,"unique":{"force_procs":["impact"]},"damage":{"Radiation":760},"falloff":{"start":18,"end":36,"reduction":0.5},"no_headshot_mult":true}],
    "imageName":"tenet-arca-plasmor.webp","tags":["Corpus","Tenet"],
    "compTags":[]},"Tenet Cycron":{"noise":"Alarming","releaseDate":"2021-07-06","ammoCapacity":"Infinity","productCategory":"Pistols","zoomProps":[[]],"category":"Secondary","trigger":"Held","type":"Pistol","magazineSize":40,"reloadTime":1.5,"multishot":1,"attacks":[{"name":"Normal Attack","speed":12,"crit_chance":20,"crit_mult":1.8,"status_chance":40,"shot_type":"Discharge","damage":{"Heat":22}}],
    "imageName":"tenet-cycron.webp","tags":["Corpus","Tenet"],
    "compTags":["BEAM"]},"Tenet Glaxion":{"noise":"Alarming","releaseDate":"2024-03-27","ammoCapacity":810,"productCategory":"LongGuns","equipTime":1.1,"zoomProps":[[]],"category":"Primary","trigger":"Held","type":"Rifle","magazineSize":90,"reloadTime":2,"multishot":1,"attacks":[{"name":"Normal Attack","speed":12,"crit_chance":20,"crit_mult":2.2,"status_chance":40,"shot_type":"Hit-Scan","damage":{"Cold":34}}],
    "imageName":"TenetGlaxion.webp","tags":["Corpus","Tenet"],
    "compTags":["BEAM","ASSAULT_AMMO","GLAXION"]},"Tenet Diplos":{"noise":"Alarming","releaseDate":"2021-07-06","ammoCapacity":460,"productCategory":"Pistols","zoomProps":[[]],"category":"Secondary","trigger":"Auto","type":"Pistol","magazineSize":92,"reloadTime":2.8,"multishot":1,"attacks":[{"name":"Normal Attack","speed":9.67,"crit_chance":36,"crit_mult":2.2,"status_chance":14,"shot_type":"Projectile","shot_speed":50,"flight":50,"damage":{"Impact":11.2,"Slash":7.8,"Puncture":9}},{"name":"Lock-on Mode","speed":9.67,"crit_chance":36,"crit_mult":2.2,"status_chance":14,"shot_type":"Projectile","shot_speed":200,"flight":200,"damage":{"Impact":11.2,"Slash":7.8,"Puncture":9}}],
    "imageName":"tenet-diplos.webp","tags":["Corpus","Tenet"],
    "compTags":[]},"Tenet Detron":{"noise":"Alarming","releaseDate":"2021-07-06","productCategory":"Pistols","zoomProps":[[]],"category":"Secondary","trigger":"Semi","type":"Pistol","magazineSize":6,"reloadTime":1,"multishot":10,"attacks":[{"name":"Normal Attack","speed":3.33,"crit_chance":18,"crit_mult":2,"status_chance":10,"shot_type":"Projectile","shot_speed":150,"flight":150,"damage":{"Radiation":26},"falloff":{"start":26,"end":52,"reduction":0.446}},{"name":"Burst Shot","speed":4.918,"crit_chance":18,"crit_mult":2,"status_chance":10,"shot_type":"Projectile","shot_speed":150,"flight":150,"damage":{"Radiation":26}}],
    "imageName":"tenet-detron.webp","tags":["Corpus","Tenet"],
    "compTags":["PROJECTILE","SECONDARYSHOTGUN","SINGLESHOT"]},"Tenet Exec":{"blockingAngle":55,"comboDuration":5,"followThrough":0.6,"range":2.8,"windUp":1.1,"releaseDate":"2021-07-06","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":1,"crit_chance":38,"crit_mult":2.4,"status_chance":22,"damage":{"Impact":102.6,"Slash":87.4}},{"name":"Normal Shockwave","speed":1,"crit_chance":38,"crit_mult":2.4,"status_chance":22,"damage":{"Impact":380},"falloff":{"start":0,"end":4,"reduction":0.9}},{"name":"Heavy Shockwave","speed":1,"crit_chance":38,"crit_mult":2.4,"status_chance":22,"damage":{"Impact":570},"falloff":{"start":0,"end":4,"reduction":0}},{"name":"Slam","speed":1,"crit_chance":38,"crit_mult":2.4,"status_chance":22,"unique":{"force_procs":["impact"]},"damage":{"Impact":380}},{"name":"Heavy Slam","speed":1,"crit_chance":38,"crit_mult":2.4,"status_chance":22,"damage":{"Impact":570}}],
    "imageName":"tenet-exec.webp","tags":["Corpus","Tenet"],
    "compTags":["HEAVY_BLADE_STANCE"]},"Tenet Envoy":{"noise":"Alarming","releaseDate":"2021-07-06","ammoCapacity":16,"productCategory":"LongGuns","equipTime":1.33,"category":"Primary","trigger":"Semi","type":"Rifle","magazineSize":8,"reloadTime":4,"multishot":1,"attacks":[{"name":"Grenade Impact","speed":0.83,"crit_chance":28,"crit_mult":2.6,"status_chance":24,"shot_type":"Projectile","shot_speed":40,"flight":40,"damage":{"Impact":100}},{"name":"Rocket Explosion","speed":0.83,"crit_chance":28,"crit_mult":2.6,"status_chance":24,"shot_type":"AoE","damage":{"Cold":640},"falloff":{"start":0,"end":8,"reduction":0.8},"no_headshot_mult":true}],
    "imageName":"tenet-envoy.webp","tags":["Corpus","Tenet"],
    "compTags":["PROJECTILE","SNIPER_AMMO","AOE"],
    "comb":[[0,1]]},"Tenet Ferrox":{"noise":"Alarming","releaseDate":"2022-11-30","ammoCapacity":100,"productCategory":"LongGuns","zoomProps":[[]],"category":"Primary","trigger":"Charge","type":"Rifle","magazineSize":20,"reloadTime":1.8,"multishot":1,"attacks":[{"name":"Charged Shot","speed":2.67,"crit_chance":34,"crit_mult":3,"status_chance":26,"shot_type":"Hit-Scan","damage":{"Impact":20,"Slash":40,"Puncture":140}},{"name":"Radial Attack","speed":2.67,"crit_chance":34,"crit_mult":3,"status_chance":26,"shot_type":"AoE","damage":{"Impact":6,"Slash":12,"Puncture":42},"falloff":{"start":0,"end":4,"reduction":0.3},"no_headshot_mult":true},{"name":"Spear Throw","speed":1,"crit_chance":4,"crit_mult":2,"status_chance":33,"shot_type":"Projectile","shot_speed":90,"flight":90,"damage":{"Impact":35,"Slash":10,"Puncture":5}},{"name":"Attraction Field","speed":0.5,"crit_chance":4,"crit_mult":2,"status_chance":50,"shot_type":"AoE","damage":{"Electricity":150},"no_headshot_mult":true}],
    "imageName":"tenet-ferrox.webp","tags":["Corpus","Tenet"],
    "compTags":["PROJECTILE","SNIPER_AMMO"],
    "comb":[[0,1]]},"Tenet Flux Rifle":{"noise":"Alarming","releaseDate":"2021-07-06","ammoCapacity":1200,"productCategory":"LongGuns","equipTime":1.1,"zoomProps":[[]],"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":120,"reloadTime":1.8,"multishot":1,"attacks":[{"name":"Normal Attack","speed":15,"crit_chance":20,"crit_mult":1.8,"status_chance":26,"shot_type":"Hit-Scan","damage":{"Slash":17.2,"Puncture":4.8}}],
    "imageName":"tenet-flux-rifle.webp","tags":["Corpus","Tenet"],
    "compTags":["BEAM","ASSAULT_AMMO","FLUX"]},"Tenet Grigori":{"blockingAngle":90,"comboDuration":5,"followThrough":0.6,"range":2.5,"windUp":1,"releaseDate":"2021-07-06","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":1.08,"crit_chance":24,"crit_mult":1.6,"status_chance":38,"damage":{"Impact":9.1,"Slash":136.8,"Puncture":82.1}},{"name":"Energy Disk","speed":1,"crit_chance":24,"crit_mult":1.6,"status_chance":38,"shot_type":"Projectile","shot_speed":1,"flight":1,"damage":{"Impact":1360,"Slash":1360,"Puncture":1360}},{"name":"Slam","speed":1,"crit_chance":24,"crit_mult":1.6,"status_chance":38,"unique":{"force_procs":["impact"]},"damage":{"Impact":456}},{"name":"Heavy Slam","speed":1,"crit_chance":24,"crit_mult":1.6,"status_chance":38,"damage":{"Blast":684}}],
    "imageName":"tenet-grigori.webp","tags":["Corpus","Tenet"],
    "compTags":["SCYTHES_STANCE"]},"Tetra":{"noise":"Alarming","releaseDate":"2014-01-22","ammoCapacity":540,"productCategory":"LongGuns","equipTime":1.1,"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":60,"reloadTime":2,"multishot":1,"attacks":[{"name":"Normal Attack","speed":6.67,"crit_chance":4,"crit_mult":1.5,"status_chance":20,"shot_type":"Projectile","shot_speed":100,"flight":100,"damage":{"Impact":6.4,"Puncture":25.6}}],
    "imageName":"tetra.webp","tags":["Corpus"],
    "compTags":["PROJECTILE","ASSAULT_AMMO","TETRA"]},"Tenora Prime":{"noise":"Alarming","releaseDate":"2021-02-23","ammoCapacity":1000,"productCategory":"LongGuns","equipTime":1.1,"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":200,"reloadTime":2.5,"multishot":1,"attacks":[{"name":"Fully Spooled","speed":12.67,"crit_chance":30,"crit_mult":2.2,"status_chance":24,"shot_type":"Hit-Scan","damage":{"Impact":8.4,"Slash":8.4,"Puncture":11.2}},{"name":"Charged Attack","speed":2,"crit_chance":40,"crit_mult":3,"status_chance":20,"shot_type":"Hit-Scan","damage":{"Impact":56,"Slash":56,"Puncture":168}}],
    "imageName":"tenora-prime.webp","tags":["Prime"],
    "compTags":["ASSAULT_AMMO"]},"Tenet Spirex":{"noise":"Alarming","releaseDate":"2021-07-06","ammoCapacity":80,"productCategory":"Pistols","zoomProps":[[]],"category":"Secondary","trigger":"Semi","type":"Pistol","magazineSize":8,"reloadTime":2.4000001,"multishot":1,"attacks":[{"name":"Slug Impact","speed":2.33,"crit_chance":26,"crit_mult":2.4,"status_chance":40,"shot_type":"Projectile","shot_speed":260,"flight":260,"unique":{"force_procs":["impact"],
    "WITH_COND":{"reloadTime":0.5}},"damage":{"Impact":40,"Puncture":20,"Heat":60}},{"name":"Explosion","speed":2.33,"crit_chance":26,"crit_mult":2.4,"status_chance":40,"shot_type":"AoE","unique":{"WITH_COND":{"reloadTime":0.5}},"damage":{"Heat":80},"falloff":{"start":0,"end":2,"reduction":0.2},"no_headshot_mult":true}],
    "imageName":"tenet-spirex.webp","tags":["Corpus","Tenet"],
    "compTags":["BEAM"],
    "comb":[[0,1]]},"Tenet Plinx":{"noise":"Alarming","releaseDate":"2022-11-30","ammoCapacity":8,"productCategory":"Pistols","zoomProps":[[]],"category":"Secondary","trigger":"Charge","type":"Pistol","magazineSize":10,"reloadTime":1.3,"multishot":1,"attacks":[{"name":"Semi-Auto","speed":3.33,"crit_chance":44,"crit_mult":3,"status_chance":12,"shot_type":"Hit-Scan","damage":{"Puncture":40,"Heat":30}},{"name":"Alt-Fire","speed":1,"crit_chance":40,"crit_mult":3,"status_chance":20,"shot_type":"Projectile","shot_speed":100,"flight":100,"unique":{"force_procs":["impact"],
    "magazineSizeMult":0.1},"damage":{"Impact":1000}},{"name":"Alt-Fire AoE","speed":1,"crit_chance":40,"crit_mult":3,"status_chance":20,"shot_type":"AoE","unique":{"magazineSizeMult":0.1},"damage":{"Radiation":1000},"falloff":{"start":0,"end":6,"reduction":0.4},"no_headshot_mult":true}],
    "imageName":"tenet-plinx.webp","tags":["Corpus","Tenet"],
    "compTags":["PROJECTILE"],
    "comb":[[1,2]]},"Tenet Tetra":{"noise":"Alarming","releaseDate":"2021-07-06","ammoCapacity":480,"productCategory":"LongGuns","equipTime":1.1,"zoomProps":[[]],"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":80,"reloadTime":2.2,"multishot":1,"attacks":[{"name":"Normal Attack","speed":5,"crit_chance":28,"crit_mult":2.2,"status_chance":30,"shot_type":"Projectile","shot_speed":100,"flight":100,"damage":{"Impact":13.2,"Slash":13.2,"Puncture":33.6}},{"name":"Grenade Impact","speed":1.33,"crit_chance":28,"crit_mult":2.2,"status_chance":30,"shot_type":"Projectile","shot_speed":60,"flight":60,"damage":{"Impact":200}},{"name":"Grenade AoE","speed":1.33,"crit_chance":28,"crit_mult":2.2,"status_chance":30,"shot_type":"AoE","damage":{"Blast":1000},"falloff":{"start":0,"end":8,"reduction":0.6},"no_headshot_mult":true}],
    "imageName":"tenet-tetra.webp","tags":["Corpus","Tenet"],
    "compTags":["PROJECTILE","ASSAULT_AMMO","TETRA"],
    "comb":[[1,2]]},"Tenora":{"noise":"Alarming","releaseDate":"2017-03-24","ammoCapacity":900,"productCategory":"LongGuns","equipTime":1.1,"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":150,"reloadTime":2.5,"multishot":1,"attacks":[{"name":"Fully Spooled","speed":11.67,"crit_chance":28,"crit_mult":2,"status_chance":16,"shot_type":"Hit-Scan","damage":{"Impact":7.2,"Slash":7.2,"Puncture":9.6}},{"name":"Charged Attack","speed":10,"crit_chance":34,"crit_mult":3,"status_chance":11,"shot_type":"Hit-Scan","damage":{"Impact":48,"Slash":48,"Puncture":144}}],
    "imageName":"tenora.webp","tags":["Tenno"],
    "compTags":["ASSAULT_AMMO"]},"Tenet Quanta":{"noise":"Alarming","releaseDate":"2026-03-25","ammoCapacity":540,"productCategory":"LongGuns","category":"Primary","trigger":"Held","type":"Rifle","magazineSize":100,"reloadTime":2,"multishot":1,"attacks":[{"name":"Beam","speed":10,"crit_chance":31,"crit_mult":2.5,"status_chance":26,"shot_type":"Discharge","damage":{"Electricity":18}},{"name":"Cube (direct hit)","speed":4,"crit_chance":5,"crit_mult":1.5,"status_chance":26,"shot_type":"Projectile","shot_speed":25,"damage":{"Electricity":180}},{"name":"Cube Explosion","speed":4,"crit_chance":5,"crit_mult":1.5,"status_chance":26,"shot_type":"AoE","damage":{"Electricity":150},"no_headshot_mult":true},{"name":"Cube (shot by player)","speed":4,"crit_chance":5,"crit_mult":1.5,"status_chance":26,"shot_type":"AoE","damage":{"Blast":600},"no_headshot_mult":true}],
    "imageName":"TenetQuanta.webp","tags":["Corpus","Tenet"],
    "compTags":["PROJECTILE","BEAM","ASSAULT_AMMO"],
    "comb":[[]]},"Tenet Livia":{"blockingAngle":55,"comboDuration":5,"followThrough":0.7,"range":2.5,"windUp":0.7,"releaseDate":"2021-07-06","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":1.08,"crit_chance":28,"crit_mult":2.2,"status_chance":28,"damage":{"Impact":9.9,"Slash":178.2,"Puncture":9.9}},{"name":"Slam","speed":1,"crit_chance":28,"crit_mult":2.2,"status_chance":28,"unique":{"force_procs":["impact"]},"damage":{"Impact":396}},{"name":"Heavy Slam","speed":1,"crit_chance":28,"crit_mult":2.2,"status_chance":28,"damage":{"Blast":594}}],
    "imageName":"tenet-livia.webp","tags":["Corpus","Tenet"],
    "compTags":["LONG_KATANA_STANCE"]},"Tiberon Prime":{"noise":"Alarming","releaseDate":"2018-03-20","ammoCapacity":546,"productCategory":"LongGuns","equipTime":1.1,"zoomProps":[[]],"category":"Primary","trigger":"Burst","type":"Rifle","magazineSize":42,"reloadTime":2,"multishot":1,"attacks":[{"name":"Auto","speed":8.33,"crit_chance":16,"crit_mult":2.8,"status_chance":32,"shot_type":"Hit-Scan","damage":{"Impact":13.8,"Slash":13.8,"Puncture":18.4}},{"name":"Semi-Auto","speed":6,"crit_chance":30,"crit_mult":3.4,"status_chance":18,"shot_type":"Hit-Scan","damage":{"Impact":13.8,"Slash":13.8,"Puncture":18.4}},{"name":"Burst","speed":5,"crit_chance":28,"crit_mult":3,"status_chance":20,"shot_type":"Hit-Scan","damage":{"Impact":13.8,"Slash":13.8,"Puncture":18.4}}],
    "imageName":"tiberon-prime.webp","tags":["Prime","Vaulted"],
    "compTags":["ASSAULT_AMMO"]},"Thornbak":{"noise":"Alarming","releaseDate":"2025-10-15","ammoCapacity":540,"productCategory":"LongGuns","category":"Primary","trigger":"Burst","type":"Rifle","magazineSize":52,"reloadTime":1.8,"multishot":1,"attacks":[{"name":"Normal Attack","speed":6,"crit_chance":6,"crit_mult":1.4,"status_chance":36,"shot_type":"Hit-Scan","damage":{"Impact":9.332,"Slash":9.332,"Puncture":9.335}}],
    "imageName":"thornbak.webp","tags":[],
    "compTags":["ASSAULT_AMMO"]},"Tigris":{"noise":"Alarming","releaseDate":"2013-11-20","ammoCapacity":120,"productCategory":"LongGuns","zoomProps":[[]],"category":"Primary","trigger":"Duplex","type":"Shotgun","magazineSize":2,"reloadTime":1.8,"multishot":5,"attacks":[{"name":"Normal Attack","speed":2,"crit_chance":10,"crit_mult":2,"status_chance":16.8,"shot_type":"Hit-Scan","damage":{"Impact":21,"Slash":168,"Puncture":21},"falloff":{"start":10,"end":20,"reduction":0.5238}}],
    "imageName":"tigris.webp","tags":["Tenno"],
    "compTags":["SINGLESHOT","TIGRIS"]},"Tipedo Prime":{"blockingAngle":60,"comboDuration":5,"followThrough":0.5,"range":3,"windUp":0.5,"releaseDate":"2019-03-27","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":1.17,"crit_chance":24,"crit_mult":2.4,"status_chance":24,"damage":{"Impact":17,"Slash":136,"Puncture":17}},{"name":"Slam","speed":1,"crit_chance":24,"crit_mult":2.4,"status_chance":24,"unique":{"force_procs":["impact"]},"damage":{"Impact":340}},{"name":"Heavy Slam","speed":1,"crit_chance":24,"crit_mult":2.4,"status_chance":24,"damage":{"Blast":510}}],
    "imageName":"tipedo-prime.webp","tags":["Prime","Vaulted"],
    "compTags":["STAVES_STANCE"]},"Tiberon":{"noise":"Alarming","releaseDate":"2014-10-01","productCategory":"LongGuns","equipTime":1.1,"category":"Primary","trigger":"Burst","type":"Rifle","magazineSize":30,"reloadTime":2.26,"multishot":1,"attacks":[{"name":"Normal Attack","speed":6.67,"crit_chance":26,"crit_mult":2.4,"status_chance":16,"shot_type":"Hit-Scan","damage":{"Impact":11,"Slash":11,"Puncture":22}}],
    "imageName":"tiberon.webp","tags":["Tenno"],
    "compTags":["ASSAULT_AMMO"]},"Tigris Prime":{"noise":"Alarming","releaseDate":"2016-08-23","ammoCapacity":120,"productCategory":"LongGuns","zoomProps":[[]],"category":"Primary","trigger":"Duplex","type":"Rifle","magazineSize":2,"reloadTime":1.8,"multishot":8,"attacks":[{"name":"Normal Attack","speed":2,"crit_chance":10,"crit_mult":2,"status_chance":11.25,"shot_type":"Hit-Scan","damage":{"Impact":19.5,"Slash":156,"Puncture":19.5},"falloff":{"start":10,"end":20,"reduction":0.4872}}],
    "imageName":"tigris-prime.webp","tags":["Prime","Vaulted"],
    "compTags":["SINGLESHOT","TIGRIS"]},"Tipedo":{"blockingAngle":60,"comboDuration":5,"followThrough":0.5,"range":3,"windUp":0.5,"releaseDate":"2015-01-08","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":1.33,"crit_chance":20,"crit_mult":2,"status_chance":20,"damage":{"Impact":12.4,"Slash":99.2,"Puncture":12.4}},{"name":"Slam","speed":1,"crit_chance":20,"crit_mult":2,"status_chance":20,"unique":{"force_procs":["impact"]},"damage":{"Impact":248}},{"name":"Heavy Slam","speed":1,"crit_chance":20,"crit_mult":2,"status_chance":20,"damage":{"Blast":372}}],
    "imageName":"tipedo.webp","tags":["Tenno"],
    "compTags":["STAVES_STANCE"]},"Tombfinger (Secondary)":{"ammoCapacity":540,"productCategory":"","category":"Secondary","type":"Kitgun","magazineSize":0,"reloadTime":3,"multishot":1,"attacks":[{"name":"Normal Attack","speed":1,"crit_chance":0,"crit_mult":0,"status_chance":0,"shot_type":"Projectile","shot_speed":180,"unique":{"force_procs":["impact"]},"damage":{"Impact":16,"Puncture":9,"Radiation":18}},{"name":"Explosion","speed":1,"crit_chance":0,"crit_mult":0,"status_chance":0,"shot_type":"AoE","damage":{"Radiation":41},"no_headshot_mult":true}],
    "imageName":"tombfinger.webp","tags":["secondary-projectile"],
    "compTags":["PROJECTILE","AOE"],
    "comb":[[0,1]]},"Tonbo":{"blockingAngle":55,"comboDuration":5,"followThrough":0.6,"range":3,"windUp":0.9,"releaseDate":"2015-02-18","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":1,"crit_chance":5,"crit_mult":2,"status_chance":25,"damage":{"Impact":18.4,"Slash":138,"Puncture":27.6}},{"name":"Slam","speed":1,"crit_chance":5,"crit_mult":2,"status_chance":25,"unique":{"force_procs":["impact"]},"damage":{"Blast":368}},{"name":"Heavy Slam","speed":1,"crit_chance":5,"crit_mult":2,"status_chance":25,"damage":{"Blast":552}}],
    "imageName":"tonbo.webp","tags":["Tenno"],
    "compTags":["POLEARMS_STANCE"]},"Tombfinger (Primary)":{"ammoCapacity":540,"productCategory":"","category":"Primary","type":"Kitgun","magazineSize":0,"reloadTime":3,"multishot":1,"attacks":[{"name":"Normal Attack","speed":1,"crit_chance":0,"crit_mult":0,"status_chance":0,"shot_type":"Projectile","shot_speed":90,"unique":{"force_procs":["impact"]},"damage":{"Impact":16,"Puncture":9,"Radiation":18}},{"name":"Explosion","speed":1,"crit_chance":0,"crit_mult":0,"status_chance":0,"shot_type":"AoE","damage":{"Radiation":41},"no_headshot_mult":true}],
    "imageName":"tombfinger.webp","tags":["primary-rifle-projectile"],
    "compTags":["PROJECTILE","AOE"],
    "comb":[[0,1]]},"Tonkkatt":{"blockingAngle":60,"comboDuration":5,"followThrough":0.6,"range":2.5,"windUp":0.7,"releaseDate":"2025-04-17","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":1.084,"crit_chance":23,"crit_mult":2.1,"status_chance":21,"unique":{"status_damage_heat":1.2,"addHeatNotCombined":1.2},"damage":{"Slash":132,"Puncture":33}},{"name":"Slam","speed":1,"crit_chance":23,"crit_mult":2.1,"status_chance":10,"unique":{"force_procs":["impact"]},"damage":{"Impact":330}},{"name":"Heavy Slam","speed":1,"crit_chance":23,"crit_mult":2.1,"status_chance":10,"damage":{"Blast":495}}],
    "imageName":"Tonkkatt.webp","tags":[],
    "compTags":["TONFA_STANCE"]},"Twin Krohkur":{"blockingAngle":60,"comboDuration":5,"followThrough":0.5,"range":2.5,"windUp":0.7,"releaseDate":"2017-10-12","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":0.917,"crit_chance":19,"crit_mult":1.7,"status_chance":33,"damage":{"Impact":30,"Slash":175,"Puncture":45}},{"name":"Slam","speed":1,"crit_chance":19,"crit_mult":1.7,"status_chance":33,"unique":{"force_procs":["impact"]},"damage":{"Blast":500}},{"name":"Heavy Slam","speed":1,"crit_chance":19,"crit_mult":1.7,"status_chance":33,"damage":{"Blast":750}}],
    "imageName":"twin-krohkur.webp","tags":["Grineer"],
    "compTags":["DUAL_SWORDS_STANCE"]},"Twin Kohmak":{"noise":"Alarming","releaseDate":"2015-03-19","ammoCapacity":240,"productCategory":"Pistols","equipTime":1.1,"category":"Secondary","trigger":"Auto","type":"Pistol","magazineSize":80,"reloadTime":2.2,"multishot":5,"attacks":[{"name":"Single Pellet","speed":1.334,"crit_chance":11,"crit_mult":2,"status_chance":69,"shot_type":"Hit-Scan","damage":{"Impact":6,"Slash":18,"Puncture":6},"falloff":{"start":12,"end":24,"reduction":0.8333}},{"name":"Fully Spooled","speed":6.67,"crit_chance":11,"crit_mult":2,"status_chance":13.8,"shot_type":"Hit-Scan","damage":{"Impact":6,"Slash":18,"Puncture":6},"falloff":{"start":12,"end":24,"reduction":0.8333}}],
    "imageName":"twin-kohmak.webp","tags":["Grineer"],
    "compTags":["SECONDARYSHOTGUN"]},"Twin Grakatas":{"noise":"Alarming","releaseDate":"2015-07-31","ammoCapacity":1200,"productCategory":"Pistols","equipTime":1.1,"category":"Secondary","trigger":"Auto","type":"Rifle","magazineSize":60,"reloadTime":3,"multishot":2,"attacks":[{"name":"Normal Attack","speed":20,"crit_chance":25,"crit_mult":2.7,"status_chance":16.5,"shot_type":"Hit-Scan","damage":{"Impact":4,"Slash":2.67,"Puncture":3.33}}],
    "imageName":"twin-grakatas.webp","tags":["Grineer"],
    "compTags":[]},"Trumna Prime":{"noise":"Alarming","releaseDate":"2024-11-13","ammoCapacity":500,"productCategory":"LongGuns","zoomProps":[[]],"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":250,"reloadTime":4,"multishot":1,"attacks":[{"name":"Auto","speed":4.67,"crit_chance":24,"crit_mult":2.4,"status_chance":34,"shot_type":"Hit-Scan","damage":{"Impact":32,"Heat":53}},{"name":"Auto AoE","speed":4.67,"crit_chance":24,"crit_mult":2.4,"status_chance":34,"shot_type":"AoE","damage":{"Heat":50},"no_headshot_mult":true},{"name":"Grenade Impact","speed":1.33,"crit_chance":38,"crit_mult":2.4,"status_chance":50,"damage":{"Impact":100}},{"name":"Grenade Bounce AoE","speed":1.33,"crit_chance":38,"crit_mult":2.4,"status_chance":50,"shot_type":"AoE","damage":{"Heat":1150},"no_headshot_mult":true}],
    "imageName":"TrumnaPrime.webp","tags":[],
    "compTags":["ASSAULT_AMMO","PROJECTILE","AOE"],
    "comb":[[0,1],
    [2,3]]},"Trumna":{"noise":"Alarming","releaseDate":"2020-08-25","ammoCapacity":400,"productCategory":"LongGuns","equipTime":1.1,"zoomProps":[[]],"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":200,"reloadTime":5,"multishot":1,"attacks":[{"name":"Auto","speed":4.67,"crit_chance":24,"crit_mult":2.2,"status_chance":30,"shot_type":"Hit-Scan","damage":{"Impact":29,"Heat":53}},{"name":"Auto AoE","speed":4.67,"crit_chance":24,"crit_mult":2.2,"status_chance":30,"shot_type":"AoE","damage":{"Heat":50},"falloff":{"start":0,"end":1.6,"reduction":0.15},"no_headshot_mult":true},{"name":"Grenade Impact","speed":1.33,"crit_chance":38,"crit_mult":2.4,"status_chance":50,"damage":{"Impact":100}},{"name":"Grenade Bounce AoE","speed":1.33,"crit_chance":38,"crit_mult":2.4,"status_chance":50,"shot_type":"AoE","damage":{"Heat":1000},"falloff":{"start":0,"end":6,"reduction":0.4},"no_headshot_mult":true}],
    "imageName":"trumna.webp","tags":["Entrati"],
    "compTags":["ASSAULT_AMMO","PROJECTILE","AOE"],
    "comb":[[0,1],
    [2,3]]},"Twin Gremlins":{"noise":"Alarming","releaseDate":"2013-08-09","ammoCapacity":210,"productCategory":"Pistols","category":"Secondary","trigger":"Auto","type":"Dual Pistols","magazineSize":30,"reloadTime":1.1,"multishot":1,"attacks":[{"name":"Normal Attack","speed":5,"crit_chance":15,"crit_mult":1.5,"status_chance":15,"shot_type":"Projectile","shot_speed":90,"flight":90,"damage":{"Impact":12.33,"Slash":12.33,"Puncture":12.33}}],
    "imageName":"twin-gremlins.webp","tags":["Grineer"],
    "compTags":["PROJECTILE"]},"Torid":{"noise":"Alarming","releaseDate":"2013-05-23","ammoCapacity":60,"productCategory":"LongGuns","category":"Primary","trigger":"Semi","type":"Rifle","magazineSize":5,"reloadTime":1.7,"multishot":1,"attacks":[{"name":"Grenade Impact","speed":1.5,"crit_chance":15,"crit_mult":2,"status_chance":23,"shot_type":"Projectile","shot_speed":40,"flight":40,"damage":{"Toxin":100}},{"name":"Poison Cloud","speed":1,"crit_chance":15,"crit_mult":2,"status_chance":23,"shot_type":"AoE","damage":{"Toxin":40},"falloff":{"start":0,"end":3,"reduction":1},"no_headshot_mult":true},{"name":"Incarnon Form","speed":8,"crit_chance":29,"crit_mult":3.1,"status_chance":39,"shot_type":"Hit-Scan","damage":{"Toxin":51}}],
    "imageName":"torid.webp","tags":["Infested","Incarnon"],
    "compTags":["PROJECTILE","SNIPER_AMMO","SINGLESHOT","AOE"],
    "comb":[[0,1]]},"Twin Basolk":{"blockingAngle":60,"comboDuration":5,"followThrough":0.5,"range":2.4,"windUp":0.7,"releaseDate":"2015-10-21","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":1,"crit_chance":5,"crit_mult":2,"status_chance":40,"damage":{"Impact":55,"Slash":55,"Puncture":15,"Heat":85}},{"name":"Slam","speed":1,"crit_chance":5,"crit_mult":2,"status_chance":40,"unique":{"force_procs":["impact"]},"damage":{"Heat":420}},{"name":"Heavy Slam","speed":1,"crit_chance":5,"crit_mult":2,"status_chance":40,"damage":{"Heat":630}}],
    "imageName":"twin-basolk.webp","tags":["Grineer"],
    "compTags":["DUAL_SWORDS_STANCE"]},"Tonkor":{"noise":"Alarming","releaseDate":"2015-04-23","ammoCapacity":30,"productCategory":"LongGuns","category":"Primary","trigger":"Semi","type":"Rifle","magazineSize":1,"reloadTime":1.7,"multishot":1,"attacks":[{"name":"Grenade Impact","speed":3.17,"crit_chance":25,"crit_mult":2.5,"status_chance":10,"shot_type":"Projectile","shot_speed":40,"flight":40,"damage":{"Puncture":75}},{"name":"Grenade Explosion","speed":3.17,"crit_chance":25,"crit_mult":2.5,"status_chance":10,"shot_type":"AoE","damage":{"Blast":650},"falloff":{"start":0,"end":7,"reduction":0.7},"no_headshot_mult":true}],
    "imageName":"tonkor.webp","tags":["Grineer"],
    "compTags":["PROJECTILE","SNIPER_AMMO","AOE","TONKOR"],
    "comb":[[0,1]]},"Tysis":{"noise":"Alarming","releaseDate":"2014-01-15","productCategory":"Pistols","category":"Secondary","trigger":"Semi","type":"Pistol","magazineSize":11,"reloadTime":1.2,"multishot":1,"attacks":[{"name":"Normal Attack","speed":2.5,"crit_chance":3,"crit_mult":1.5,"status_chance":50,"shot_type":"Projectile","shot_speed":75,"flight":75,"damage":{"Impact":9,"Slash":17,"Puncture":23}},{"name":"Corrosive DoT","speed":2.5,"crit_chance":3,"crit_mult":1.5,"status_chance":50,"shot_type":"DoT","damage":{"Corrosive":27}}],
    "imageName":"tysis.webp","tags":["Infested"],
    "compTags":["PROJECTILE"],
    "comb":[[0,1]]},"Wrath":{"blockingAngle":65,"comboDuration":5,"followThrough":0.4,"range":2.8,"windUp":1,"releaseDate":"2026-06-17","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":1.2,"crit_chance":30,"crit_mult":2,"status_chance":15,"damage":{"Slash":176,"Puncture":44}},{"name":"Slam","speed":1,"crit_chance":30,"crit_mult":2,"status_chance":15,"unique":{"force_procs":["impact"],
    "WITH_COND":{"crit_chance":1.5}},"damage":{"Impact":440}},{"name":"Heavy Slam","speed":1,"crit_chance":30,"crit_mult":2,"status_chance":15,"unique":{"WITH_COND":{"crit_chance":1.5}},"damage":{"Blast":660}}],
    "imageName":"Wrath.webp","tags":[],
    "compTags":["HEAVY SCYTHE_STANCE"]},"Twin Rogga":{"noise":"Alarming","releaseDate":"2016-11-11","ammoCapacity":120,"productCategory":"Pistols","category":"Secondary","trigger":"Semi","type":"Pistol","magazineSize":2,"reloadTime":1.5,"multishot":15,"attacks":[{"name":"Normal Attack","speed":2.5,"crit_chance":10,"crit_mult":2,"status_chance":6.6,"shot_type":"Hit-Scan","damage":{"Impact":18.8,"Slash":4.7,"Puncture":23.5},"falloff":{"start":10,"end":20,"reduction":0.7872}}],
    "imageName":"twin-rogga.webp","tags":["Grineer"],
    "compTags":["SINGLESHOT"]},"Twin Vipers Wraith":{"noise":"Alarming","releaseDate":"2013-12-19","ammoCapacity":440,"productCategory":"Pistols","category":"Secondary","trigger":"Auto","type":"Pistol","magazineSize":40,"reloadTime":2,"multishot":1,"attacks":[{"name":"Normal Attack","speed":25,"crit_chance":19,"crit_mult":2,"status_chance":9,"shot_type":"Hit-Scan","damage":{"Impact":14.4,"Slash":1.8,"Puncture":1.8}}],
    "imageName":"twin-vipers-wraith.webp","tags":["Wraith","Invasion Reward","Grineer"],
    "compTags":[]},"Vadarya Prime":{"noise":"Alarming","releaseDate":"2025-08-26","ammoCapacity":72,"productCategory":"LongGuns","category":"Primary","trigger":"Semi","type":"Rifle","magazineSize":16,"reloadTime":2.6,"multishot":1,"attacks":[{"name":"Unzoomed","speed":2.8,"crit_chance":40,"crit_mult":2.8,"status_chance":18,"shot_type":"Hit-Scan","damage":{"Electricity":400}},{"name":"8x Zoom","speed":2.8,"crit_chance":40,"crit_mult":2.8,"status_chance":18,"shot_type":"Hit-Scan","unique":{"crit_mult":0.5},"damage":{"Electricity":400}}],
    "imageName":"VadaryaPrime.webp","tags":[],
    "compTags":["SNIPER_AMMO"]},"Twin Vipers":{"noise":"Alarming","releaseDate":"2013-04-12","ammoCapacity":420,"productCategory":"Pistols","category":"Secondary","trigger":"Auto","type":"Dual Pistols","magazineSize":28,"reloadTime":2,"multishot":1,"attacks":[{"name":"Normal Attack","speed":25,"crit_chance":15,"crit_mult":1.5,"status_chance":11,"shot_type":"Hit-Scan","damage":{"Impact":10.2,"Slash":5.1,"Puncture":1.7}}],
    "imageName":"twin-vipers.webp","tags":["Grineer"],
    "compTags":[]},"Vasto":{"noise":"Alarming","releaseDate":"2013-07-26","productCategory":"Pistols","category":"Secondary","trigger":"Semi","type":"Pistol","magazineSize":6,"reloadTime":1,"multishot":1,"attacks":[{"name":"Normal Attack","speed":2.5,"crit_chance":20,"crit_mult":1.8,"status_chance":8,"shot_type":"Hit-Scan","damage":{"Impact":22.5,"Slash":45,"Puncture":22.5}},{"name":"Incarnon Form","speed":2.5,"crit_chance":30,"crit_mult":2.8,"status_chance":2.7,"damage":{"Impact":7.5,"Slash":15,"Puncture":7.5}}],
    "imageName":"vasto.webp","tags":["Tenno","Incarnon"],
    "compTags":[]},"Valkyr Talons (Valkyr)":{"blockingAngle":60,"comboDuration":5,"followThrough":1,"range":1.7,"windUp":0.5,"releaseDate":"2018-06-15","productCategory":"Melee","category":"Melee","type":"Exalted Weapon","multishot":1,"attacks":[{"name":"Normal Attack","speed":1.5,"crit_chance":50,"crit_mult":2,"status_chance":10,"damage":{"Impact":83.5,"Slash":83.5,"Puncture":83.5}},{"name":"Slam","speed":1,"crit_chance":50,"crit_mult":2,"status_chance":10,"damage":{"Impact":167,"Slash":167,"Puncture":167}},{"name":"Heavy Slam","speed":1,"crit_chance":50,"crit_mult":2,"status_chance":10,"damage":{"Blast":750}}],
    "imageName":"ValkyrTalons.webp","tags":[],
    "compTags":["HYSTERIA_STANCE","POWER_WEAPON"]},"Vastilok":{"blockingAngle":90,"comboDuration":5,"followThrough":0.5,"range":1,"windUp":0.4,"releaseDate":"2021-07-17","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":1,"crit_chance":19,"crit_mult":1.7,"status_chance":31,"damage":{"Impact":19.53,"Slash":234.36,"Puncture":25.11}},{"name":"Ranged Attack","speed":1,"crit_chance":19,"crit_mult":1.7,"status_chance":10.33,"shot_type":"Hit-Scan","damage":{"Impact":8.97,"Slash":49.68,"Puncture":10.35},"falloff":{"start":24,"end":49,"reduction":0.9565}},{"name":"Slam","speed":1,"crit_chance":19,"crit_mult":1.7,"status_chance":31,"damage":{"Blast":558}},{"name":"Heavy Slam","speed":1,"crit_chance":19,"crit_mult":1.7,"status_chance":31,"damage":{"Blast":837}}],
    "imageName":"vastilok.webp","tags":["Grineer"],
    "compTags":["GUNBLADE_STANCE"]},"Vasto Prime":{"noise":"Alarming","releaseDate":"2014-12-16","productCategory":"Pistols","category":"Secondary","trigger":"Semi","type":"Pistol","magazineSize":6,"reloadTime":1,"multishot":1,"attacks":[{"name":"Normal Attack","speed":2.5,"crit_chance":22,"crit_mult":2.4,"status_chance":22,"shot_type":"Hit-Scan","damage":{"Impact":16.5,"Slash":77,"Puncture":16.5}},{"name":"Incarnon Form","speed":2.5,"crit_chance":30,"crit_mult":3.2,"status_chance":6.7,"damage":{"Impact":10.5,"Slash":49,"Puncture":10.5}}],
    "imageName":"vasto-prime.webp","tags":["Prime","Vaulted","Incarnon"],
    "compTags":[]},"Vaykor Marelok":{"noise":"Alarming","releaseDate":"2014-11-27","productCategory":"Pistols","category":"Secondary","trigger":"Semi","type":"Pistol","magazineSize":10,"reloadTime":1.6670001,"multishot":1,"attacks":[{"name":"Normal Attack","speed":2,"crit_chance":20,"crit_mult":1.5,"status_chance":35,"shot_type":"Hit-Scan","damage":{"Impact":96,"Slash":48,"Puncture":16}}],
    "imageName":"vaykor-marelok.webp","tags":["Syndicate","Steel Meridian"],
    "compTags":["MARELOK"]},"Velox":{"noise":"Alarming","releaseDate":"2020-06-11","ammoCapacity":434,"productCategory":"Pistols","zoomProps":[[]],"category":"Secondary","trigger":"Auto","type":"Pistol","magazineSize":62,"reloadTime":2.6,"multishot":1,"attacks":[{"name":"Normal Attack","speed":15,"crit_chance":14,"crit_mult":1.8,"status_chance":22,"shot_type":"Hit-Scan","unique":{"ammoEff":0.2},"damage":{"Impact":4.32,"Slash":11.52,"Puncture":8.16}}],
    "imageName":"velox.webp","tags":["Tenno"],
    "compTags":[]},"Vaykor Sydon":{"blockingAngle":55,"comboDuration":5,"followThrough":0.6,"range":2.9,"windUp":0.9,"releaseDate":"2016-09-15","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":1.08,"crit_chance":21,"crit_mult":2.5,"status_chance":33,"damage":{"Impact":10.65,"Puncture":202.35}},{"name":"Slam","speed":1,"crit_chance":21,"crit_mult":2.5,"status_chance":33,"unique":{"force_procs":["impact"]},"damage":{"Blast":426}},{"name":"Heavy Slam","speed":1,"crit_chance":21,"crit_mult":2.5,"status_chance":33,"damage":{"Blast":639}}],
    "imageName":"vaykor-sydon.webp","tags":["Syndicate","Steel Meridian"],
    "compTags":["POLEARMS_STANCE"]},"Vaykor Hek":{"noise":"Alarming","releaseDate":"2015-09-02","ammoCapacity":120,"productCategory":"LongGuns","zoomProps":[[]],"category":"Primary","trigger":"Semi","type":"Rifle","magazineSize":8,"reloadTime":2.25,"multishot":7,"attacks":[{"name":"Normal Attack","speed":3,"crit_chance":25,"crit_mult":2,"status_chance":10.7,"shot_type":"Hit-Scan","damage":{"Impact":11.25,"Slash":15,"Puncture":48.75},"falloff":{"start":10,"end":25,"reduction":0.7333}}],
    "imageName":"vaykor-hek.webp","tags":["Syndicate","Steel Meridian"],
    "compTags":[]},"Vectis Prime":{"noise":"Alarming","releaseDate":"2015-07-07","ammoCapacity":72,"productCategory":"LongGuns","equipTime":1.1,"zoomProps":[{"Upgrades": [{"DamageType": "DT_ANY", "OperationType": "STACKING_MULTIPLY", "UpgradeType": "mult_for_head", "Value": 0.4}]}, {"Upgrades": [{"DamageType": "DT_ANY", "OperationType": "STACKING_MULTIPLY", "UpgradeType": "mult_for_head", "Value": 0.6}]}],"category":"Primary","trigger":"Semi","type":"Rifle","magazineSize":2,"reloadTime":0.85000002,"multishot":1,"attacks":[{"name":"Unzoomed","speed":2.67,"crit_chance":30,"crit_mult":2,"status_chance":30,"shot_type":"Hit-Scan","damage":{"Impact":140,"Slash":52.5,"Puncture":157.5},"falloff":{"start":400,"end":600,"reduction":0.5}},{"name":"6x Zoom","speed":2.67,"crit_chance":30,"crit_mult":2,"status_chance":30,"shot_type":"Hit-Scan","damage":{"Impact":140,"Slash":52.5,"Puncture":157.5},"falloff":{"start":400,"end":600,"reduction":0.5}},{"name":"Incarnon Form","speed":1.33,"crit_chance":35,"crit_mult":3,"status_chance":30,"shot_type":"Projectile","shot_speed":300,"unique":{"force_procs":["cold"]},"damage":{"Cold":150}},{"name":"Incarnon Form Headshot AoE","speed":1.33,"crit_chance":35,"crit_mult":3,"status_chance":30,"shot_type":"AoE","unique":{"force_procs":["cold"]},"damage":{"Cold":150},"no_headshot_mult":true},{"name":"Incarnon Form Embed AoE","speed":1.33,"crit_chance":35,"crit_mult":3,"status_chance":30,"shot_type":"AoE","unique":{"force_procs":["cold"]},"damage":{"Cold":25},"no_headshot_mult":true}],
    "imageName":"vectis-prime.webp","tags":["Prime","Incarnon"],
    "compTags":["SNIPER_AMMO","SINGLESHOT"],
    "comb":[[2,3,4]]},"Vectis":{"noise":"Alarming","releaseDate":"2013-10-30","ammoCapacity":72,"productCategory":"LongGuns","equipTime":1.1,"zoomProps":[{"Upgrades": [{"DamageType": "DT_ANY", "OperationType": "STACKING_MULTIPLY", "UpgradeType": "mult_for_head", "Value": 0.3}]}, {"Upgrades": [{"DamageType": "DT_ANY", "OperationType": "STACKING_MULTIPLY", "UpgradeType": "mult_for_head", "Value": 0.5}]}],"category":"Primary","trigger":"Semi","type":"Rifle","magazineSize":1,"reloadTime":1,"multishot":1,"attacks":[{"name":"Unzoomed","speed":1.5,"crit_chance":25,"crit_mult":2,"status_chance":30,"shot_type":"Hit-Scan","damage":{"Impact":90,"Slash":56.25,"Puncture":78.75},"falloff":{"start":400,"end":600,"reduction":0.5}},{"name":"4.5x Zoom","speed":1.5,"crit_chance":25,"crit_mult":2,"status_chance":30,"shot_type":"Hit-Scan","damage":{"Impact":90,"Slash":56.25,"Puncture":78.75},"falloff":{"start":400,"end":600,"reduction":0.5}},{"name":"Incarnon Form","speed":1.33,"crit_chance":35,"crit_mult":2.5,"status_chance":30,"shot_type":"Projectile","shot_speed":300,"unique":{"force_procs":["cold"]},"damage":{"Cold":5}},{"name":"Incarnon Form Headshot AoE","speed":1.33,"crit_chance":35,"crit_mult":2.5,"status_chance":30,"shot_type":"AoE","unique":{"force_procs":["cold"]},"damage":{"Cold":5},"no_headshot_mult":true},{"name":"Incarnon Form Embed AoE","speed":1.33,"crit_chance":35,"crit_mult":2.5,"status_chance":30,"shot_type":"AoE","unique":{"force_procs":["cold"]},"damage":{"Cold":5},"no_headshot_mult":true}],
    "imageName":"vectis.webp","tags":["Tenno","Incarnon"],
    "compTags":["SNIPER_AMMO","Vectis","SINGLESHOT"],
    "comb":[[2,3,4]]},"Velocitus (Atmo-mode)":{"releaseDate":"2014-11-13","ammoCapacity":60,"productCategory":"Archguns","zoomProps":[[]],"category":"Archgun","type":"Archgun","magazineSize":10,"reloadTime":2,"multishot":1,"attacks":[{"name":"Quick Shot","speed":5,"crit_chance":30,"crit_mult":2,"status_chance":25,"shot_type":"Projectile","shot_speed":125,"damage":{"Impact":300,"Puncture":300,"Slash":300,"Magnetic":300}},{"name":"Charged Shot","speed":5,"crit_chance":60,"crit_mult":3.6,"status_chance":25,"shot_type":"Projectile","shot_speed":125,"unique":{"force_procs":["impact"]},"damage":{"Impact":800,"Puncture":800,"Slash":800,"Magnetic":800}}],
    "imageName":"Velocitus.webp","tags":[""],
    "compTags":[""]},"Veldt":{"noise":"Alarming","releaseDate":"2018-04-20","ammoCapacity":546,"productCategory":"LongGuns","equipTime":1.1,"zoomProps":[[], []],"category":"Primary","trigger":"Semi","type":"Rifle","magazineSize":26,"reloadTime":1.8,"multishot":1,"attacks":[{"name":"Normal Attack","speed":3.67,"crit_chance":22,"crit_mult":2.2,"status_chance":22,"shot_type":"Hit-Scan","damage":{"Impact":23.4,"Slash":43.2,"Puncture":23.4}}],
    "imageName":"veldt.webp","tags":[],
    "compTags":["PROJECTILE","ASSAULT_AMMO"]},"Venka":{"blockingAngle":55,"comboDuration":5,"followThrough":0.8,"range":1.75,"windUp":0.6,"releaseDate":"2014-06-25","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":1,"crit_chance":15,"crit_mult":2,"status_chance":15,"damage":{"Impact":7,"Slash":98,"Puncture":35}},{"name":"Slam","speed":1,"crit_chance":15,"crit_mult":2,"status_chance":15,"unique":{"force_procs":["impact"]},"damage":{"Impact":280}},{"name":"Heavy Slam","speed":1,"crit_chance":15,"crit_mult":2,"status_chance":15,"damage":{"Blast":420}}],
    "imageName":"venka.webp","tags":["Tenno"],
    "compTags":["CLAWS_STANCE"]},"Velocitus (Arch-mode)":{"releaseDate":"2014-11-13","ammoCapacity":0,"productCategory":"Archguns","zoomProps":[[]],"category":"Archgun","type":"Archgun","magazineSize":10,"reloadTime":1.4,"multishot":1,"attacks":[{"name":"Normal Attack","speed":5,"crit_chance":30,"crit_mult":2,"status_chance":25,"shot_type":"Projectile","shot_speed":500,"damage":{"Impact":150,"Puncture":150,"Slash":150,"Magnetic":150}},{"name":"Charged Shot","speed":5,"crit_chance":60,"crit_mult":3.6,"status_chance":25,"shot_type":"Projectile","shot_speed":500,"damage":{"Impact":400,"Puncture":400,"Slash":400,"Magnetic":400}}],
    "imageName":"Velocitus.webp","tags":[""],
    "compTags":["BATTERY"]},"Velox Prime":{"noise":"Alarming","releaseDate":"2024-05-01","ammoCapacity":434,"productCategory":"Pistols","zoomProps":[[]],"category":"Secondary","trigger":"Auto","type":"Pistol","magazineSize":70,"reloadTime":2.6,"multishot":1,"attacks":[{"name":"Normal Attack","speed":17,"crit_chance":14,"crit_mult":2,"status_chance":32,"shot_type":"Hit-Scan","unique":{"ammoEff":0.2},"damage":{"Impact":6.48,"Slash":12.96,"Puncture":7.56}}],
    "imageName":"VeloxPrime.webp","tags":["Tenno"],
    "compTags":[]},"Venato Prime":{"blockingAngle":60,"comboDuration":5,"followThrough":0.6,"range":2.8,"windUp":1,"releaseDate":"2025-08-26","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":1.17,"crit_chance":34,"crit_mult":2.3,"status_chance":32,"damage":{"Impact":36.75,"Slash":85.75,"Puncture":122.5}},{"name":"Slam","speed":1,"crit_chance":34,"crit_mult":2.3,"status_chance":32,"unique":{"force_procs":["impact"]},"damage":{"Impact":490}},{"name":"Heavy Slam","speed":1,"crit_chance":34,"crit_mult":2.3,"status_chance":32,"damage":{"Blast":735}}],
    "imageName":"VenatoPrime.webp","tags":["Sentient"],
    "compTags":["SCYTHES_STANCE","VENATO"]},"Venka Prime":{"blockingAngle":55,"comboDuration":5,"followThrough":0.8,"range":1.8,"windUp":0.6,"releaseDate":"2016-11-22","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":1.05,"crit_chance":32,"crit_mult":2.6,"status_chance":24,"damage":{"Impact":9.4,"Slash":141,"Puncture":37.6}},{"name":"Slam","speed":1,"crit_chance":32,"crit_mult":2.6,"status_chance":24,"unique":{"force_procs":["impact"]},"damage":{"Impact":376}},{"name":"Heavy Slam","speed":1,"crit_chance":32,"crit_mult":2.6,"status_chance":24,"damage":{"Blast":564}}],
    "imageName":"venka-prime.webp","tags":["Prime","Never Vaulted"],
    "compTags":["CLAWS_STANCE"]},"Verdilac":{"blockingAngle":45,"comboDuration":5,"followThrough":0.5,"range":2.9963856,"windUp":0.4,"releaseDate":"2021-12-15","productCategory":"Melee","zoomProps":[[]],"category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":1,"crit_chance":30,"crit_mult":2.5,"status_chance":21,"damage":{"Impact":21.3,"Slash":106.5,"Puncture":85.2}},{"name":"Energy Wave","speed":1,"crit_chance":30,"crit_mult":2.5,"status_chance":21,"damage":{"Toxin":213}},{"name":"Slam","speed":1,"crit_chance":30,"crit_mult":2.5,"status_chance":21,"unique":{"force_procs":["impact"]},"damage":{"Electricity":426}},{"name":"Heavy Slam","speed":1,"crit_chance":30,"crit_mult":2.5,"status_chance":21,"damage":{"Electricity":639}}],
    "imageName":"verdilac.webp","tags":["Sentient"],
    "compTags":["WHIPS_STANCE"]},"Venato":{"blockingAngle":90,"comboDuration":5,"followThrough":0.6,"range":2.7,"windUp":1,"releaseDate":"2021-12-15","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":1.08,"crit_chance":27,"crit_mult":2.1,"status_chance":24,"damage":{"Impact":33,"Slash":77,"Puncture":110}},{"name":"Slam","speed":1,"crit_chance":27,"crit_mult":2.1,"status_chance":24,"unique":{"force_procs":["impact"]},"damage":{"Impact":440}},{"name":"Heavy Slam","speed":1,"crit_chance":27,"crit_mult":2.1,"status_chance":24,"damage":{"Blast":660}}],
    "imageName":"venato.webp","tags":["Tenno","Sentient"],
    "compTags":["SCYTHES_STANCE","VENATO"]},"Vericres":{"blockingAngle":55,"comboDuration":5,"followThrough":0.7,"range":1.8,"windUp":0.5,"releaseDate":"2022-07-14","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":1,"crit_chance":22,"crit_mult":2,"status_chance":20,"damage":{"Impact":21.6,"Slash":129.6,"Puncture":28.8}},{"name":"Slam","speed":1,"crit_chance":22,"crit_mult":2,"status_chance":20,"unique":{"force_procs":["impact"]},"damage":{"Impact":360}},{"name":"Heavy Slam","speed":1,"crit_chance":22,"crit_mult":2,"status_chance":20,"damage":{"Blast":540}}],
    "imageName":"vericres.webp","tags":["Tenno"],
    "compTags":["WARFAN_STANCE"]},"Vermisplicer (Primary)":{"ammoCapacity":90,"productCategory":"","category":"Primary","type":"Kitgun","magazineSize":0,"reloadTime":2,"multishot":1,"attacks":[{"name":"Normal Attack","speed":12,"crit_chance":0,"crit_mult":0,"status_chance":0,"shot_type":"Discharge","damage":{"Impact":2,"Puncture":4,"Slash":5,"Toxin":5}}],
    "imageName":"vermisplicer.webp","tags":["primary-rifle-beam"],
    "compTags":["BEAM"]},"Vermisplicer (Secondary)":{"ammoCapacity":90,"productCategory":"","category":"Secondary","type":"Kitgun","magazineSize":0,"reloadTime":2,"multishot":5,"attacks":[{"name":"Normal Attack","speed":12,"crit_chance":0,"crit_mult":0,"status_chance":0,"shot_type":"Discharge","damage":{"Impact":2,"Puncture":4,"Slash":5,"Toxin":5}}],
    "imageName":"vermisplicer.webp","tags":["secondary-beam"],
    "compTags":["BEAM"]},"Viper Wraith":{"noise":"Alarming","releaseDate":"2018-01-11","ammoCapacity":420,"productCategory":"Pistols","category":"Secondary","trigger":"Auto","type":"Pistol","magazineSize":20,"reloadTime":0.8,"multishot":1,"attacks":[{"name":"Normal Attack","speed":14.38,"crit_chance":19,"crit_mult":2,"status_chance":9,"shot_type":"Hit-Scan","damage":{"Impact":14.4,"Slash":1.8,"Puncture":1.8}}],
    "imageName":"viper-wraith.webp","tags":["Grineer","Wraith","Baro"],
    "compTags":["VIPER"]},"Viper":{"noise":"Alarming","releaseDate":"2013-03-18","ammoCapacity":420,"productCategory":"Pistols","category":"Secondary","trigger":"Auto","type":"Pistol","magazineSize":14,"reloadTime":0.7,"multishot":1,"attacks":[{"name":"Normal Attack","speed":14.38,"crit_chance":15,"crit_mult":1.5,"status_chance":11,"shot_type":"Hit-Scan","damage":{"Impact":10.2,"Slash":5.1,"Puncture":1.7}}],
    "imageName":"viper.webp","tags":["Grineer"],
    "compTags":["VIPER"]},"War":{"blockingAngle":55,"comboDuration":5,"followThrough":0.6,"range":3.2,"windUp":1.1,"releaseDate":"2015-12-03","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":0.917,"crit_chance":26,"crit_mult":2.6,"status_chance":26,"damage":{"Impact":120,"Slash":70,"Puncture":60}},{"name":"Slam","speed":1,"crit_chance":26,"crit_mult":2.6,"status_chance":26,"unique":{"force_procs":["impact"]},"damage":{"Impact":500}},{"name":"Heavy Slam","speed":1,"crit_chance":26,"crit_mult":2.6,"status_chance":26,"damage":{"Blast":750}}],
    "imageName":"war.webp","tags":["Sentient"],
    "compTags":["HEAVY_BLADE_STANCE"]},"Volnus":{"blockingAngle":50,"comboDuration":5,"followThrough":0.6,"range":2.9,"windUp":1.1,"releaseDate":"2017-10-12","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":1.2,"crit_chance":18,"crit_mult":1.6,"status_chance":30,"damage":{"Impact":48.4,"Slash":101.2,"Puncture":70.4}},{"name":"Slam","speed":1,"crit_chance":18,"crit_mult":1.6,"status_chance":30,"damage":{"Slash":440}},{"name":"Heavy Slam","speed":1,"crit_chance":18,"crit_mult":1.6,"status_chance":30,"damage":{"Slash":660}}],
    "imageName":"volnus.webp","tags":["Tenno"],
    "compTags":["HAMMERS_STANCE"]},"Volnus Prime":{"blockingAngle":50,"comboDuration":5,"followThrough":0.6,"range":2.9,"windUp":1.1,"releaseDate":"2021-05-26","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":1.2,"crit_chance":20,"crit_mult":1.8,"status_chance":34,"damage":{"Impact":55,"Slash":115,"Puncture":80}},{"name":"Slam","speed":1,"crit_chance":20,"crit_mult":1.8,"status_chance":34,"damage":{"Slash":500}},{"name":"Heavy Slam","speed":1,"crit_chance":20,"crit_mult":1.8,"status_chance":34,"damage":{"Slash":750}}],
    "imageName":"volnus-prime.webp","tags":["Prime"],
    "compTags":["HAMMERS_STANCE"]},"Vinquibus (Rifle)":{"noise":"Alarming","releaseDate":"2025-12-10","ammoCapacity":80,"productCategory":"LongGuns","zoomProps":[[]],"category":"Primary","trigger":"Semi","type":"Rifle","magazineSize":8,"reloadTime":3,"multishot":1,"attacks":[{"name":"Normal Attack","speed":1.5,"crit_chance":40,"crit_mult":3.2,"status_chance":20,"shot_type":"Hit-Scan","damage":{"Slash":120,"Puncture":280}}],
    "imageName":"Vinquibus.webp","tags":[],
    "compTags":["ASSAULT_AMMO"]},"Vinquibus (Melee)":{"blockingAngle":60,"comboDuration":5,"followThrough":0.6,"range":3,"windUp":1,"releaseDate":"2025-12-10","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":1,"crit_chance":40,"crit_mult":3.2,"status_chance":20,"damage":{"Slash":78,"Puncture":182}},{"name":"Polearm Throw","speed":1,"crit_chance":40,"crit_mult":3.2,"status_chance":20,"unique":{"force_procs":["impact"]},"damage":{"Slash":78,"Puncture":182}},{"name":"Polearm Explosion","speed":1,"crit_chance":40,"crit_mult":3.2,"status_chance":20,"unique":{"force_procs":["impact"]},"damage":{"Blast":400}},{"name":"Slam","speed":1,"crit_chance":40,"crit_mult":3.2,"status_chance":10,"unique":{"force_procs":["impact"]},"damage":{"Impact":440}},{"name":"Heavy Slam","speed":1,"crit_chance":34,"crit_mult":2.6,"status_chance":10,"damage":{"Blast":660}}],
    "imageName":"Vinquibus.webp","tags":[],
    "compTags":["BAYONET_STANCE"]},"Vulkar":{"noise":"Alarming","releaseDate":"2013-05-23","ammoCapacity":72,"productCategory":"LongGuns","equipTime":1.1,"zoomProps":[{"Upgrades": [{"DamageType": "DT_ANY", "OperationType": "STACKING_MULTIPLY", "UpgradeType": "mult_for_head", "Value": 0.35}]}, {"Upgrades": [{"DamageType": "DT_ANY", "OperationType": "STACKING_MULTIPLY", "UpgradeType": "mult_for_head", "Value": 0.55}]}, {"Upgrades": [{"DamageType": "DT_ANY", "OperationType": "STACKING_MULTIPLY", "UpgradeType": "mult_for_head", "Value": 0.7}]}],"category":"Primary","trigger":"Semi","type":"Rifle","magazineSize":6,"reloadTime":3,"multishot":1,"attacks":[{"name":"Unzoomed","speed":1.5,"crit_chance":20,"crit_mult":2,"status_chance":25,"shot_type":"Hit-Scan","damage":{"Impact":180,"Slash":11.2,"Puncture":33.8},"falloff":{"start":400,"end":600,"reduction":0.5}},{"name":"8x Zoom","speed":1.5,"crit_chance":20,"crit_mult":2,"status_chance":25,"shot_type":"Hit-Scan","damage":{"Impact":180,"Slash":11.2,"Puncture":33.8},"falloff":{"start":400,"end":600,"reduction":0.5}}],
    "imageName":"vulkar.webp","tags":["Grineer"],
    "compTags":["SNIPER_AMMO"]},"Vulkar Wraith":{"noise":"Alarming","releaseDate":"2016-01-25","ammoCapacity":72,"productCategory":"LongGuns","equipTime":1.1,"zoomProps":[{"Upgrades": [{"DamageType": "DT_ANY", "OperationType": "STACKING_MULTIPLY", "UpgradeType": "mult_for_head", "Value": 0.35}]}, {"Upgrades": [{"DamageType": "DT_ANY", "OperationType": "STACKING_MULTIPLY", "UpgradeType": "mult_for_head", "Value": 0.55}]}, {"Upgrades": [{"DamageType": "DT_ANY", "OperationType": "STACKING_MULTIPLY", "UpgradeType": "mult_for_head", "Value": 0.7}]}],"category":"Primary","trigger":"Semi","type":"Rifle","magazineSize":8,"reloadTime":3,"multishot":1,"attacks":[{"name":"Unzoomed","speed":2,"crit_chance":20,"crit_mult":2,"status_chance":25,"shot_type":"Hit-Scan","damage":{"Impact":245.7,"Puncture":27.3},"falloff":{"start":400,"end":600,"reduction":0.5}},{"name":"8x Zoom","speed":2,"crit_chance":20,"crit_mult":2,"status_chance":25,"shot_type":"Hit-Scan","damage":{"Impact":245.7,"Puncture":27.3},"falloff":{"start":400,"end":600,"reduction":0.5}}],
    "imageName":"vulkar-wraith.webp","tags":["Wraith","Baro","Grineer"],
    "compTags":["SNIPER_AMMO"]},"Vitrica":{"blockingAngle":60,"comboDuration":10,"followThrough":0.6,"range":2.9,"windUp":1.1,"releaseDate":"2020-10-27","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":0.833,"crit_chance":23,"crit_mult":2.3,"status_chance":33,"damage":{"Impact":99.9,"Slash":133.2,"Puncture":99.9}},{"name":"Glass Explosion","speed":0.833,"crit_chance":23,"crit_mult":2.3,"status_chance":33,"shot_type":"AoE","damage":{"Impact":299.7,"Slash":399.6,"Puncture":299.7},"falloff":{"start":0,"end":6,"reduction":0.9},"no_headshot_mult":true},{"name":"Slam","speed":1,"crit_chance":23,"crit_mult":2.3,"status_chance":33,"unique":{"force_procs":["impact"]},"damage":{"Impact":666}},{"name":"Heavy Slam","speed":1,"crit_chance":23,"crit_mult":2.3,"status_chance":33,"damage":{"Impact":999}}],
    "imageName":"vitrica.webp","tags":["Orokin"],
    "compTags":["HEAVY_BLADE_STANCE"]},"War Prime":{"blockingAngle":55,"comboDuration":5,"followThrough":0.6,"range":3.2,"windUp":1.1,"releaseDate":"2026-06-17","productCategory":"Melee","category":"Melee","type":"Melee","multishot":1,"attacks":[{"name":"Normal Attack","speed":0.917,"crit_chance":26,"crit_mult":3.2,"status_chance":32,"damage":{"Impact":194.4,"Slash":43.2,"Puncture":32.4}},{"name":"Slam","speed":1,"crit_chance":26,"crit_mult":3.2,"status_chance":10,"unique":{"force_procs":["impact"]},"damage":{"Impact":500}},{"name":"Heavy Slam","speed":1,"crit_chance":26,"crit_mult":3.2,"status_chance":10,"damage":{"Blast":810}}],
    "imageName":"WarPrime.webp","tags":[],
    "compTags":["HEAVY_BLADE_STANCE"]},"Vesper 77":{"noise":"Alarming","releaseDate":"2024-12-13","ammoCapacity":210,"productCategory":"Pistols","category":"Secondary","trigger":"Semi","type":"Pistol","magazineSize":8,"reloadTime":2.4,"multishot":1,"attacks":[{"name":"Normal Attack","speed":2.08,"crit_chance":24,"crit_mult":2.6,"status_chance":26,"shot_type":"Hit-Scan","damage":{"Impact":72,"Puncture":108}},{"name":"Alt-Fire (Weak Point)","speed":2.08,"crit_chance":24,"crit_mult":2.6,"status_chance":26,"shot_type":"Hit-Scan","unique":{"crit_mult":0.4},"damage":{"Impact":72,"Puncture":108}}],
    "imageName":"Vesper77.webp","tags":["Grineer"],
    "compTags":["PROJECTILE","VESPER77"]},"Zakti Prime":{"noise":"Alarming","releaseDate":"2020-10-26","productCategory":"Pistols","zoomProps":[[]],"category":"Secondary","trigger":"Semi","type":"Pistol","magazineSize":8,"reloadTime":1,"multishot":1,"attacks":[{"name":"Normal Attack","speed":5,"crit_chance":8,"crit_mult":1.8,"status_chance":42,"shot_type":"Projectile","shot_speed":140,"flight":140,"unique":{"force_procs":["impact"]},"damage":{"Impact":12,"Puncture":18}},{"name":"Gas Cloud","speed":5,"crit_chance":8,"crit_mult":1.8,"status_chance":42,"shot_type":"AoE","damage":{"Gas":100},"falloff":{"start":0,"end":3.8,"reduction":0},"no_headshot_mult":true}],
    "imageName":"zakti-prime.webp","tags":["Prime"],
    "compTags":["PROJECTILE","AOE","SINGLESHOT"],
    "comb":[[0,1]]},"Zakti":{"noise":"Alarming","releaseDate":"2017-07-19","productCategory":"Pistols","category":"Secondary","trigger":"Semi","type":"Pistol","magazineSize":3,"reloadTime":0.8,"multishot":1,"attacks":[{"name":"Dart Impact","speed":5,"crit_chance":2,"crit_mult":1.5,"status_chance":20,"shot_type":"Projectile","shot_speed":80,"flight":80,"unique":{"force_procs":["impact"]},"damage":{"Impact":12,"Puncture":18}},{"name":"Gas Cloud","speed":5,"crit_chance":2,"crit_mult":1.5,"status_chance":20,"shot_type":"AoE","damage":{"Gas":80},"falloff":{"start":0,"end":3.5,"reduction":0},"no_headshot_mult":true}],
    "imageName":"zakti.webp","tags":["Tenno"],
    "compTags":["PROJECTILE","AOE","SINGLESHOT"],
    "comb":[[0,1]]},"Wolf Sledge":{"blockingAngle":50,"comboDuration":5,"followThrough":0.4,"range":3.1,"windUp":1.2,"releaseDate":"2019-02-27","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":1,"crit_chance":17,"crit_mult":1.9,"status_chance":33,"damage":{"Impact":132.1,"Slash":119.1,"Puncture":7.8}},{"name":"Throw","speed":1,"crit_chance":17,"crit_mult":1.9,"status_chance":33,"shot_type":"Thrown","damage":{"Impact":396.3,"Slash":357.3,"Puncture":23.4}},{"name":"Heavy Recall Explosion","speed":1,"crit_chance":19,"crit_mult":2.1,"status_chance":50,"shot_type":"AoE","damage":{"Blast":777},"falloff":{"start":0,"end":5,"reduction":0},"no_headshot_mult":true},{"name":"Slam","speed":1,"crit_chance":17,"crit_mult":1.9,"status_chance":33,"damage":{"Impact":518}},{"name":"Heavy Slam","speed":1,"crit_chance":17,"crit_mult":1.9,"status_chance":33,"damage":{"Blast":777}}],
    "imageName":"wolf-sledge.webp","tags":[],
    "compTags":["HAMMERS_STANCE"]},"Xoris":{"blockingAngle":55,"comboDuration":5,"followThrough":0.7,"range":1.3,"windUp":1.2,"releaseDate":"2020-06-11","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":1.17,"crit_chance":20,"crit_mult":2.4,"status_chance":18,"damage":{"Impact":24,"Slash":55.2,"Puncture":40.8}},{"name":"Throw","speed":1.17,"crit_chance":20,"crit_mult":2.4,"status_chance":18,"shot_type":"Thrown","shot_speed":25,"flight":25,"unique":{"force_procs":["impact"]},"damage":{"Impact":24,"Slash":55.2,"Puncture":40.8}},{"name":"Throw Bounce Explosion","speed":1.17,"crit_chance":20,"crit_mult":2.4,"status_chance":18,"shot_type":"AoE","damage":{"Electricity":250},"falloff":{"start":0,"end":8,"reduction":0.7},"no_headshot_mult":true},{"name":"Throw Recall Explosion","speed":1.17,"crit_chance":20,"crit_mult":2.4,"status_chance":18,"shot_type":"AoE","unique":{"force_procs":["impact","electricity"]},"damage":{"Electricity":500},"falloff":{"start":0,"end":8,"reduction":0},"no_headshot_mult":true},{"name":"Charged Throw","speed":0.833,"crit_chance":22,"crit_mult":2.4,"status_chance":20,"shot_type":"Thrown","shot_speed":25,"flight":25,"unique":{"force_procs":["impact"]},"damage":{"Impact":48,"Slash":110.4,"Puncture":81.6}},{"name":"Charged Throw Bounce Explosion","speed":0.833,"crit_chance":22,"crit_mult":2.4,"status_chance":20,"shot_type":"AoE","damage":{"Electricity":500},"falloff":{"start":0,"end":9,"reduction":0.7},"no_headshot_mult":true},{"name":"Charged Throw Recall Explosion","speed":0.833,"crit_chance":22,"crit_mult":2.4,"status_chance":20,"shot_type":"AoE","unique":{"force_procs":["impact","electricity"]},"damage":{"Electricity":1000},"falloff":{"start":0,"end":9,"reduction":0},"no_headshot_mult":true},{"name":"Slam","speed":1,"crit_chance":20,"crit_mult":2.4,"status_chance":18,"unique":{"force_procs":["impact"]},"damage":{"Electricity":240}},{"name":"Heavy Slam","speed":1,"crit_chance":20,"crit_mult":2.4,"status_chance":18,"damage":{"Electricity":360}}],
    "imageName":"xoris.webp","tags":["Corpus"],
    "compTags":["GLAIVES_STANCE"],
    "comb":[[1,2],
    [4,5]]},"Zarr":{"noise":"Alarming","releaseDate":"2016-11-11","ammoCapacity":60,"productCategory":"LongGuns","category":"Primary","trigger":"Semi","type":"Rifle","magazineSize":3,"reloadTime":2.25,"multishot":1,"attacks":[{"name":"Cannon Mode Projectile","speed":1.67,"crit_chance":17,"crit_mult":2.5,"status_chance":29,"shot_type":"Projectile","shot_speed":40,"flight":40,"damage":{"Impact":25}},{"name":"Cannon Mode Explosion","speed":1.67,"crit_chance":17,"crit_mult":2.5,"status_chance":29,"shot_type":"AoE","damage":{"Blast":175},"falloff":{"start":0,"end":4,"reduction":0.5},"no_headshot_mult":true},{"name":"Cannon Mode Cluster Bombs Contact","speed":1.67,"crit_chance":15,"crit_mult":2,"status_chance":4.8,"shot_type":"Projectile","shot_speed":8,"flight":8,"damage":{"Impact":15}},{"name":"Cannon Mode Cluster Bomb Explosion","speed":1.67,"crit_chance":15,"crit_mult":2,"status_chance":4.8,"shot_type":"Projectile","shot_speed":8,"flight":8,"damage":{"Blast":50}},{"name":"Barrage Mode","speed":3,"crit_chance":17,"crit_mult":2.5,"status_chance":8.7,"shot_type":"Projectile","shot_speed":120,"flight":120,"damage":{"Impact":24,"Slash":16,"Puncture":40}}],
    "imageName":"zarr.webp","tags":["Grineer"],
    "compTags":["ASSAULT_AMMO","PROJECTILE","AOE","SINGLESHOT"],
    "comb":[[0,1,2]]},"Zenistar":{"blockingAngle":55,"comboDuration":5,"followThrough":0.6,"range":2.6,"windUp":1.1,"releaseDate":"2016-07-28","productCategory":"Melee","category":"Melee","type":"Rifle","multishot":1,"attacks":[{"name":"Normal Attack","speed":0.833,"crit_chance":10,"crit_mult":2,"status_chance":30,"damage":{"Impact":80,"Slash":68,"Heat":150}},{"name":"Attacks While Disc Deployed","speed":0.833,"crit_chance":10,"crit_mult":2,"status_chance":15,"damage":{"Impact":13,"Slash":104,"Puncture":13}},{"name":"Disc Impact","speed":0.909,"crit_chance":10,"crit_mult":2,"status_chance":15,"damage":{"Impact":75}},{"name":"Disc Explosion","speed":0.909,"crit_chance":0,"crit_mult":1,"status_chance":15,"shot_type":"AoE","damage":{"Heat":350},"falloff":{"start":0,"end":4,"reduction":0},"no_headshot_mult":true},{"name":"Disc Aura","speed":1.2,"crit_chance":0,"crit_mult":1,"status_chance":50,"damage":{"Heat":50},"falloff":{"start":0,"end":4,"reduction":0}},{"name":"Slam","speed":1,"crit_chance":10,"crit_mult":2,"status_chance":30,"unique":{"force_procs":["impact"]},"damage":{"Impact":596}},{"name":"Heavy Slam","speed":1,"crit_chance":10,"crit_mult":2,"status_chance":30,"damage":{"Blast":894}}],
    "imageName":"zenistar.webp","tags":["Tenno"],
    "compTags":["HEAVY_BLADE_STANCE"],
    "comb":[[2,3]]},"Zhuge":{"noise":"Silent","releaseDate":"2016-03-16","productCategory":"LongGuns","equipTime":1.1,"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":20,"reloadTime":2.5,"multishot":1,"attacks":[{"name":"Normal Attack","speed":4.17,"crit_chance":20,"crit_mult":2,"status_chance":35,"shot_type":"Projectile","shot_speed":90,"flight":90,"damage":{"Impact":5,"Slash":20,"Puncture":75}}],
    "imageName":"zhuge.webp","tags":[],
    "compTags":["PROJECTILE","ZHUGE","CROSSBOW"]},"Zenith":{"noise":"Alarming","releaseDate":"2017-04-12","ammoCapacity":540,"productCategory":"LongGuns","category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":90,"reloadTime":1.6,"multishot":1,"attacks":[{"name":"Auto Mode","speed":10.83,"crit_chance":10,"crit_mult":2,"status_chance":34,"shot_type":"Hit-Scan","damage":{"Impact":4.5,"Slash":19.5,"Puncture":6}},{"name":"Semi-Auto Mode","speed":3,"crit_chance":35,"crit_mult":2.5,"status_chance":8,"shot_type":"Hit-Scan","damage":{"Impact":15,"Slash":15,"Puncture":120}}],
    "imageName":"zenith.webp","tags":["Tenno"],
    "compTags":["ASSAULT_AMMO"]},"Zhuge Prime":{"noise":"Silent","releaseDate":"2019-07-07","ammoCapacity":270,"productCategory":"LongGuns","equipTime":1.1,"zoomProps":[[]],"category":"Primary","trigger":"Auto","type":"Rifle","magazineSize":30,"reloadTime":3,"multishot":1,"attacks":[{"name":"Arrow Impact","speed":5.5,"crit_chance":26,"crit_mult":2,"status_chance":30,"shot_type":"Projectile","shot_speed":80,"flight":80,"damage":{"Impact":10,"Slash":17.5,"Puncture":22.5}},{"name":"Arrow Explosion","speed":5.5,"crit_chance":26,"crit_mult":2,"status_chance":30,"shot_type":"AoE","damage":{"Impact":11.2,"Slash":24.8,"Puncture":4},"falloff":{"start":0,"end":2.6,"reduction":0.3},"no_headshot_mult":true}],
    "imageName":"zhuge-prime.webp","tags":["Prime"],
    "compTags":["PROJECTILE","ZHUGE","CROSSBOW"],
    "comb":[[0,1]]},"Zylok":{"noise":"Alarming","releaseDate":"2018-08-30","productCategory":"Pistols","category":"Secondary","trigger":"Duplex","type":"Pistol","magazineSize":8,"reloadTime":1.2,"multishot":1,"attacks":[{"name":"Normal Attack","speed":1.8,"crit_chance":8,"crit_mult":2,"status_chance":26,"shot_type":"Hit-Scan","damage":{"Impact":44.8,"Slash":78.4,"Puncture":16.8}},{"name":"Incarnon Form","speed":1,"crit_chance":20,"crit_mult":2,"status_chance":40,"damage":{"Impact":160,"Puncture":240}},{"name":"Incarnon Form Radial Attack","speed":1,"crit_chance":20,"crit_mult":2,"status_chance":40,"shot_type":"AoE","damage":{"Heat":600}}],
    "imageName":"zylok.webp","tags":["Tenno","Incarnon"],
    "compTags":["ZYLOK"],
    "comb":[[1,2]]},"Zymos":{"noise":"Alarming","releaseDate":"2020-08-25","ammoCapacity":51,"productCategory":"Pistols","zoomProps":[[]],"category":"Secondary","trigger":"Semi","type":"Pistol","magazineSize":17,"reloadTime":3.2,"multishot":1,"attacks":[{"name":"Normal Attack","speed":1.33,"crit_chance":5,"crit_mult":2.3,"status_chance":30,"shot_type":"Projectile","shot_speed":79,"flight":79,"unique":{"force_procs":["impact"]},"damage":{"Impact":9.2,"Puncture":13.8}},{"name":"Radial Attack","speed":1.33,"crit_chance":5,"crit_mult":2.3,"status_chance":30,"shot_type":"AoE","damage":{"Toxin":61},"falloff":{"start":0,"end":3.3,"reduction":0.3},"no_headshot_mult":true},{"name":"Headshot Explosion","speed":1.33,"crit_chance":5,"crit_mult":2.3,"status_chance":50,"shot_type":"AoE","damage":{"Toxin":953},"falloff":{"start":0,"end":3.3,"reduction":0.3},"no_headshot_mult":true},{"name":"Homing Spore Contact","speed":1.33,"crit_chance":5,"crit_mult":2.3,"status_chance":30,"shot_type":"Projectile","unique":{"force_procs":["impact"]},"damage":{"Slash":11.5,"Puncture":11.5}},{"name":"Homing Spore Explosion","speed":1.33,"crit_chance":5,"crit_mult":2.3,"status_chance":30,"shot_type":"AoE","damage":{"Toxin":333},"falloff":{"start":0,"end":3.3,"reduction":0.3},"no_headshot_mult":true}],
    "imageName":"zymos.webp","tags":["Infested"],
    "compTags":[],
    "comb":[[0,1],
    [2,3,4]]},"Zylok Prime":{"noise":"Alarming","releaseDate":"2023-10-18","ammoCapacity":210,"productCategory":"Pistols","category":"Secondary","trigger":"Duplex","type":"Pistol","magazineSize":12,"reloadTime":1.2,"multishot":1,"attacks":[{"name":"Normal Attack","speed":1.5,"crit_chance":12,"crit_mult":2.4,"status_chance":36,"damage":{"Impact":63,"Slash":126,"Puncture":21}},{"name":"Incarnon Form","speed":1,"crit_chance":26,"crit_mult":2.4,"status_chance":40,"damage":{"Impact":200,"Puncture":300}},{"name":"Incarnon Form Radial Attack","speed":1,"crit_chance":26,"crit_mult":2.4,"status_chance":40,"shot_type":"AoE","damage":{"Heat":700},"no_headshot_mult":true}],
    "imageName":"ZylokPrime.webp","tags":["Tenno","Incarnon"],
    "compTags":["ZYLOK"],
    "comb":[[1,2]]}},

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
