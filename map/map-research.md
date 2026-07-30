# map.wfhub.top 完整功能调研报告

> 调研时间：2026-07-30  
> 目标：为 wfspeed.run/map.html 提供功能参考  
> 状态：数据提取完成，待实现

## 1. 网站概览

- **URL**: https://map.wfhub.top
- **技术栈**: React 19 + Mapbox GL JS (无token，仅用交互能力)
- **数据来源**: 所有标记数据内嵌在 JS bundle 中，无 API 调用
- **语言**: 中文 / English 切换
- **地图背景**: 静态 4K PNG 图片（来自 Warframe Wiki）

## 2. 核心技术架构

### 2.1 地图渲染
- **库**: Mapbox GL JS（但 `accessToken = ""`，不使用矢量瓦片）
- **背景图**: 静态 4K PNG，从 `/assets/` 加载
- **坐标系**: 像素坐标 `[0, 4000] x [0, 4000]`，转换为 Mapbox Mercator: `position / 4000 * 0.04`
- **标记锚点**: 夜灵/魔胎/双衍 = `bottom`，奥布山谷 = `center`

### 2.2 数据结构

**标记对象**:
```json
{
  "categoryId": "ueymag",
  "popup": {
    "title": "Ueymag",
    "description": "",
    "link": { "label": "", "url": "" }
  },
  "id": "427",
  "position": [1717.56, 668.92]
}
```

**分类对象**:
```json
{
  "listId": 1,
  "name": "Ueymag Farming Spots",
  "id": "ueymag",
  "color": "#862549",
  "icon": "File:UeymagMarker.png",
  "symbol": "",
  "symbolColor": ""
}
```

### 2.3 周期计算（客户端）

**夜灵平野 & 魔胎之境**（共享周期）:
```javascript
epoch = 1548924027;  // Unix 秒
fullCycle = 8998.8748;  // ≈2h30m
dayPhase = 2999.6249;   // ≈50min
nightPhase = fullCycle - dayPhase;  // ≈100min
state = (elapsed < nightPhase) ? "day" : "night";
```

**奥布山谷**:
```javascript
epoch = new Date("2026-02-04T19:46:48Z").getTime();
fullCycle = 1,600,000ms;  // ≈26.7min
warmPhase = 400,000ms;    // ≈6.7min
coldPhase = 1,200,000ms;  // ≈20min
state = (remaining > coldPhase) ? "warm" : "cold";
```

**双衍王境**:
```javascript
fullCycle = 36,000s;  // 10小时
emotionPhase = 7,200s;  // 1.4小时/情绪
emotions = ["sorrow", "fear", "joy", "anger", "envy"];
state = emotions[floor(elapsed / emotionPhase) % 5];
```

### 2.4 状态本地化
```json
{
  "day": { "en": "Day", "zh": "白昼" },
  "night": { "en": "Night", "zh": "夜晚" },
  "warm": { "en": "Warm", "zh": "温暖" },
  "cold": { "en": "Cold", "zh": "寒冷" },
  "fass": { "en": "Fass", "zh": "Fass" },
  "vome": { "en": "Vome", "zh": "Vome" },
  "sorrow": { "en": "Sorrow", "zh": "悲伤" },
  "fear": { "en": "Fear", "zh": "恐惧" },
  "joy": { "en": "Joy", "zh": "喜悦" },
  "anger": { "en": "Anger", "zh": "愤怒" },
  "envy": { "en": "Envy", "zh": "嫉妒" }
}
```

## 3. 地图配置

| 地图 | 路径 | 图片文件 | 标记数 | 分类数 | 标记锚点 |
|------|------|----------|--------|--------|----------|
| 双衍王境 | /duviri | Duviri-map-with-caves.png | 470 | 34 | bottom |
| 奥布山谷 | /orb-vallis | OrbVallis4kMap-min.png | 140 | 22 | center |
| 夜灵平野 | /plains-of-eidolon | PlainsofEidolon-4k-Map.png | 111 | 13 | bottom |
| 魔胎之境 | /cambion-drift | CambianDrift4kMap.png | 38 | 7 | bottom |
| **总计** | | | **759** | **76** | |

## 4. 各地图分类详情

### 4.1 双衍王境 (Duviri) — 470 标记, 34 分类

| 分类 | ID | 标记数 | 颜色 |
|------|-----|--------|------|
| 谜题 | puzzle | 68 | #b2bec3 |
| 洞穴入口 | cave | 34 | #663b17 |
| 肉麦采集点 | ueymag | 34 | #862549 |
| 扎里曼平板电脑 | 1 | 30 | #00e2fa |
| 塔苏摩萃取物采集点 | tasoma | 26 | #fa005a |
| 瑶丛采集点 | yao_shrub | 22 | #5100a9 |
| 龙旋根采集点 | dracroot | 21 | #d20000 |
| 母石雕像 | blinkpad | 19 | #0984e3 |
| 双人谜题 | puzzle_coop | 18 | #0d0e0e |
| 捕鱼点 | fishing | 15 | #81ecec |
| 围棋 | game | 13 | #dfe6e9 |
| 三线琴演奏点 | shawzin | 12 | #2d3436 |
| 延凡草采集点 | eevani | 12 | #a97000 |
| 言录使 | somachord | 10 | #fa005a |
| 学院的洞穴碎片 | caves_of_academe | 9 | #ccff00 |
| 维鲁拉湖碎片 | lake_veruna | 9 | #ff0066 |
| 儒临地碎片 | scholars_landing | 9 | #990033 |
| 「我们今非昔比」碎片 | we_are_not | 9 | #ffff00 |
| 守望者之岛碎片 | watchers_island | 9 | #00ccff |
| 艺术回廊碎片 | galleria | 9 | #ccff00 |
| 人偶陵墓碎片 | doll_mausoleum | 9 | #6600ff |
| 宝石之岛碎片 | manipura_island | 9 | #cccccc |
| 孤魂岛碎片 | island_of_lorn | 9 | #ffffff |
| 大地泣血碎片 | bleeding_earth | 9 | #ff0000 |
| 地穴传送门 | undercroft | 9 | #00c10f |
| 慧泉嫩芽采集点 | silphsela | 8 | #ecfa00 |
| Acrithis 商店 | shop | 7 | #fa005a |
| 福烁草采集点 | kovnik | 6 | #02ab00 |
| 人物 | npc | 6 | #ffffff |
| 塔塔羊放牧 | herding | 4 | #e17055 |
| 慧珠采集点 | connla_sprout | 3 | #009efa |
| 墓碑 | 2 | 0 | #000000 |

### 4.2 奥布山谷 (Orb Vallis) — 140 标记, 22 分类

| 分类 | ID | 标记数 | 颜色 |
|------|-----|--------|------|
| K式悬浮板竞速 | k-drive_race | 22 | #fa005a |
| 无捕鱼点洞穴 | cave_no_fishing | 18 | #9410e2 |
| 传送台 | blinkpad | 18 | #00faec |
| 池塘捕鱼点 | pond | 15 | #d800fa |
| 有捕鱼点洞穴 | cave_with_fishing | 12 | #880ee6 |
| Corpus 基地 | corpus_base | 8 | #393939 |
| Eudico 记忆碎片 | eudico_fragment | 5 | #fa005a |
| Legs 记忆碎片 | legs_fragment | 5 | #e400ff |
| Little Duck 记忆碎片 | little_duck_fragment | 5 | #0010fa |
| 粗鲁的Zuud记忆碎片 | rude_zuud_fragment | 5 | #00e9fa |
| Smokefinger 记忆碎片 | smokefinger_fragment | 5 | #00fa5e |
| Business 记忆碎片 | the_business_fragment | 5 | #ddfa00 |
| Ticker 记忆碎片 | ticker_fragment | 5 | #fa9700 |
| 湖泊捕鱼点 | lake | 4 | #00fa31 |
| 利润收割者圆蛛 | profit-taker_orb | 3 | #fc3333 |
| 通用地点 | 1 | 1 | #121111 |
| 索拉环形装置 | sola_toroid | 1 | #000000 |
| 告达环形装置 | calda_toroid | 1 | #fa8100 |
| 维加环形装置 | vega_toroid | 1 | #25e000 |
| 剥削者圆蛛 | exploiter_orb | 1 | #006afa |

### 4.3 夜灵平野 (Plains of Eidolon) — 111 标记, 13 分类

| 分类 | ID | 标记数 | 颜色 |
|------|-----|--------|------|
| 希图斯幽魂 | cetus_wisp | 27 | #fa005a |
| 夜灵诱饵 | eidolon_lure | 21 | #00faec |
| 千年灵鱼 | thousand_year_fish | 20 | #0060fa |
| 传送台 | blinkpad | 12 | #fa005a |
| 洞穴入口 | cave | 9 | #fa005a |
| 无线电控制台 | konzu | 8 | #fdb029 |
| Grineer 基地 | grineer_base | 6 | #009d28 |
| 池塘捕鱼点 | pond | 3 | #fa005a |
| 海岸捕鱼水域 | ocean | 2 | #fa005a |
| 湖泊捕鱼点 | lake | 1 | #fa005a |
| 夜灵神殿 | eidolon_shrine | 1 | #fa005a |
| 瘟疫之星感染瘤 | plague_star | 1 | #ff5d98 |

### 4.4 魔胎之境 (Cambion Drift) — 38 标记, 7 分类

| 分类 | ID | 标记数 | 颜色 |
|------|-----|--------|------|
| 安魂方尖碑 | requiem_obelisk | 13 | #000000 |
| 传送台 | blinkpad | 11 | #fa005a |
| K式悬浮板竞速 | k-drive_race | 8 | #ffffff |
| 母亲（赏金面板） | mother | 3 | #00c4fa |
| 母亲（隔离库） | mother_isolation_vault | 3 | #ffaa00 |

## 5. 功能特性

### 5.1 交互功能
- 地图拖拽平移
- 滚轮/双指缩放
- 标记点击弹窗（标题+描述+链接）
- 收藏功能（localStorage: `tenno-hub-map-favorites`）
- 语言切换（localStorage: `warframe-map-language`）
- 分类筛选（显示/隐藏整个分类）
- 搜索框（地点名/分类名）
- 仅显示收藏地点
- 排序：Wiki顺序/名称/分类/距离
- 缩放级别控制标记显示/隐藏（declutter）

### 5.2 Declutter 机制
```javascript
declutter: {
  maxVisible: 80,
  overview: new Set(["1","blinkpad","corpus_base",...]),
  midZoom: new Set(["1","blinkpad","corpus_base",...,"cave_with_fishing","pond","lake","k-drive_race"])
}
```
- 缩放级别低时只显示重要标记
- 缩放级别高时显示所有标记

### 5.3 分组系统
每个地图的分类被分成多个组（group），用于侧边栏显示：
```javascript
groups: [
  { name: "交通与据点", categoryIds: ["blinkpad","cave",...] },
  { name: "资源", categoryIds: ["ueymag","tasoma",...] },
  { name: "活动与首领", categoryIds: ["game","herding",...] },
  ...
]
```

## 6. 图标资源

所有图标从 Warframe Wiki 下载，存放在 `/assets/` 目录：
- 命名格式：`{MapName}{CategoryName}Marker.png`
- 例如：`DuviriCaveEntranceMarker.png`, `PoEWispMarker.png`
- 部分使用 emoji symbol 作为备用

## 6.1 地图背景图片（需下载）

地图背景图片需要从 Wiki 下载并存放在 `Ws-Web/map/assets/` 目录：

| 文件名 | 来源 | Wiki 页面 |
|--------|------|-----------|
| `duviri-map.png` | Duviri Map | https://wiki.warframe.com/w/Duviri/Map |
| `plains-of-eidolon-map.png` | Plains of Eidolon Map | https://wiki.warframe.com/w/Plains_of_Eidolon/Map |
| `orb-vallis-map.png` | Orb Vallis Map | https://wiki.warframe.com/w/Orb_Vallis/Map |
| `cambion-drift-map.png` | Cambion Drift Map | https://wiki.warframe.com/w/Cambion_Drift/Map |

**注意**：所有图片应为 4000x4000 像素，PNG 格式。

## 7. localStorage 键

| 键名 | 用途 |
|------|------|
| `warframe-map-language` | 语言偏好 (`"en"` / `"zh"`) |
| `tenno-hub-map-favorites` | 收藏的标记 ID 列表 |

## 8. 路由配置

```javascript
v_ = {
  plainsOfEidolon: "/plains-of-eidolon",
  orbVallis: "/orb-vallis",
  cambionDrift: "/cambion-drift",
  duviri: "/duviri"
};
defaultMap = "plainsOfEidolon";
```

## 9. 数据文件位置

提取的完整标记数据已保存在 `Ws-Web/map/data/`：
- `duviri.json` (166KB, 470 markers)
- `orb-vallis.json` (50KB, 140 markers)
- `plains-eidolon.json` (36KB, 111 markers)
- `cambion-drift.json` (14KB, 38 markers)

## 10. 差异化实现方案

### 10.1 UI 风格差异
| 原版 | 我们的差异化方案 |
|------|------------------|
| 暗色侧边栏 + 白色文字 | 赛博朋克FUI风格，半透明毛玻璃 + 辉光边框 |
| Mapbox GL (无token) | Leaflet (完全免费，无需token) |
| 静态PNG背景 | 同样使用静态PNG（数据来源相同） |
| 圆形纯色标记 | 六边形辉光标记 + 分类颜色 |
| 简单弹窗 | 动画弹窗 + 详情卡片 |
| 顶部标签切换 | 左侧垂直标签 + 地图状态指示器 |
| 无动画 | GSAP入场动画 + 标记脉冲效果 |

### 10.2 功能增强
- 实时周期状态从 worldstate API 获取（而非本地计算）
- 标记数量统计显示
- 距离计算器（点击两个标记显示距离）
- 标记导出功能（导出当前地图所有标记为图片）
- 暗色/亮色主题切换
- 键盘快捷键（数字键切换分类）

### 10.3 文件结构
```
Ws-Web/
├── map.html                    # 地图页面
├── map/
│   ├── map.js                  # 地图核心逻辑
│   ├── map.css                 # 地图样式
│   ├── data/
│   │   ├── duviri.json         # 双衍王境标记数据
│   │   ├── orb-vallis.json     # 奥布山谷标记数据
│   │   ├── plains-eidolon.json # 夜灵平野标记数据
│   │   └── cambion-drift.json  # 魔胎之境标记数据
│   └── icons/                  # 自定义标记图标
│       ├── resource.svg
│       ├── cave.svg
│       ├── fishing.svg
│       └── ...
```
