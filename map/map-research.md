# Warframe Interactive Map — 技术文档

> 最后更新：2026-07-30  
> 版本：v2.0  
> 状态：已实现并部署

## 1. 网站概览

- **URL**: https://wfspeed.run/map.html
- **技术栈**: Leaflet + 静态PNG背景 + Wiki图标 + 中文标签 + GSAP动画
- **数据来源**: 标记数据内嵌在JSON文件中，无外部API调用
- **语言**: 中文为主
- **地图背景**: 静态 4K PNG 图片（来自 Warframe Wiki）

## 2. 核心技术架构

### 2.1 地图渲染
- **库**: Leaflet (CRS.Simple)
- **背景图**: 静态 4K PNG，从 `/map/assets/` 加载
- **坐标系**: 像素坐标 `[0, 4000] x [0, 4000]`
- **标记锚点**: 夜灵/魔胎/双衍 = `bottom`，奥布山谷 = `center`

### 2.2 数据结构

**标记对象** (`map/data/*.json`):
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
epoch = 1548924027;
fullCycle = 8998.8748;
dayPhase = 2999.6249;
nightPhase = fullCycle - dayPhase;
state = (elapsed < nightPhase) ? "day" : "night";
```

**奥布山谷**:
```javascript
epoch = new Date("2026-02-04T19:46:48Z").getTime();
fullCycle = 1,600,000ms;
warmPhase = 400,000ms;
coldPhase = 1,200,000ms;
state = (remaining > coldPhase) ? "warm" : "cold";
```

**双衍王境**:
```javascript
fullCycle = 36,000s;
emotionPhase = 7,200s;
emotions = ["sorrow", "fear", "joy", "anger", "envy"];
state = emotions[floor(elapsed / emotionPhase) % 5];
```

### 2.4 状态本地化
```javascript
STATE_NAMES = {
  day:    { zh: '白昼', icon: '☀️', color: '#ffd700' },
  night:  { zh: '夜晚', icon: '🌙', color: '#4a6fa5' },
  warm:   { zh: '温暖', icon: '🌡️', color: '#ff6b4a' },
  cold:   { zh: '寒冷', icon: '❄️', color: '#4ac1ff' },
  fass:   { zh: 'Fass',  icon: '🔴', color: '#ff4a4a' },
  vome:   { zh: 'Vome',  icon: '🔵', color: '#4a8fff' },
  sorrow: { zh: '悲伤', icon: '💧', color: '#6a4aff' },
  fear:   { zh: '恐惧', icon: '👁️', color: '#4a4a4a' },
  joy:    { zh: '喜悦', icon: '✨', color: '#ffdd4a' },
  anger:  { zh: '愤怒', icon: '🔥', color: '#ff4a4a' },
  envy:   { zh: '嫉妒', icon: '💀', color: '#4aff4a' }
};
```

## 3. 地图配置

| 地图 | 路径 | 图片文件 | 标记数 | 分类数 | 标记锚点 |
|------|------|----------|--------|--------|----------|
| 双衍王境 | /duviri | duviri-map.png | 470 | 34 | bottom |
| 奥布山谷 | /orb-vallis | orb-vallis-map.png | 140 | 22 | center |
| 夜灵平野 | /plains-of-eidolon | plains-of-eidolon-map.png | 111 | 13 | bottom |
| 魔胎之境 | /cambion-drift | cambion-drift-map.png | 38 | 7 | bottom |
| **总计** | | | **759** | **76** | |

## 4. 翻译系统 (`map/translations.js`)

### 4.1 UI翻译词典 (`MAP_TRANSLATIONS.zh`)
包含所有界面文本的中文翻译：
- 搜索、筛选、排序、收藏、状态等UI文本
- 分组名称：交通与据点、洞穴与捕鱼、活动与首领、资源、记忆碎片、夜灵狩猎、收集品、方尖碑、母亲、谜题

### 4.2 分类名称映射 (`CATEGORY_NAMES`)
所有分类ID到中文名的映射（60+条）：
```javascript
blinkpad: '传送台',
puzzle: '单人幽幽鹰奥理',
ueymag: '肉麦采集点',
cetus_wisp: '希图斯幽魂',
// ... 完整列表见 translations.js
```

### 4.3 Wiki名称映射 (`WIKI_NAME_MAP`)
英文Wiki名到中文名的映射（50+条）：
```javascript
Cave: '洞穴',
'Sola Toroid Farming Spot': '索拉环形装置刷取点',
'The Hard Way': '天堂路',
// ... 完整列表见 translations.js
```

### 4.4 分组定义 (`MAP_GROUPS`)
每个地图的分类分组：
```javascript
duviri: [
  { id: 'travel', categories: ['blinkpad', 'cave', 'shop', 'npc', 'undercroft'] },
  { id: 'resources', categories: ['ueymag', 'tasoma', 'eevani', ...] },
  { id: 'activities', categories: ['fishing', 'game', 'herding', 'shawzin'] },
  { id: 'puzzles', categories: ['puzzle', 'puzzle_coop'] },
  { id: 'fragments', categories: ['scholars_landing', 'we_are_not', ...] },
  { id: 'collectibles', categories: ['somachord', '1', '2'] }
]
```

## 5. 图标系统 (`map/assets/icons/`)

### 5.1 图标映射 (`ICON_MAP`)
每个分类ID到图标文件路径的映射：
```javascript
blinkpad: 'shared/blinkpad.png',
puzzle: 'duviri/DuviriOwlPuzzleSolo.png',
ueymag: 'duviri/UeymagMarker.png',
// ... 完整列表见 translations.js
```

### 5.2 图标来源
所有图标从社区贡献获取，存放在 `map/assets/icons/` 目录：
- `duviri/` — 30个双衍王境图标
- `orb-vallis/` — 3个奥布山谷图标
- `plains/` — 5个夜灵平野图标
- `shared/` — 共用图标（传送台等）

## 6. 标记系统 (`wiki-marker`)

### 6.1 标记结构
```html
<div class="wiki-marker">
  <div class="wiki-marker-pin" style="--marker-color: #color">
    <div class="wiki-marker-glow"></div>
    <img class="wiki-marker-icon" src="/map/assets/icons/xxx.png">
  </div>
  <span class="wiki-marker-label">中文分类名</span>
</div>
```

### 6.2 标记样式
- 尺寸：32x32px 圆形标记
- 边框：2px 分类颜色边框
- 图标：22x22px Wiki图标
- 标签：10px 白色中文标签，深色半透明背景
- 悬停：放大1.2倍 + 发光效果

## 7. GSAP动画

### 7.1 页面加载动画
```javascript
tl.from('.map-topbar', { y: -80, opacity: 0, duration: 0.7 })
  .from('.map-nav', { x: -80, opacity: 0, duration: 0.7 }, '-=0.5')
  .from('.map-sidebar', { x: -320, opacity: 0, duration: 0.7 }, '-=0.5')
  .from('.map-container', { opacity: 0, scale: 0.95, duration: 0.6 }, '-=0.4');
```

### 7.2 地图切换动画
- 旧地图淡出 + 缩放 → 新地图淡入 + 缩放
- 侧边栏内容stagger动画

### 7.3 标记出现动画
- 新增标记stagger淡入（从中心向外扩散）
- 使用 `back.out(1.7)` 弹性缓动

### 7.4 交互反馈
- 收藏按钮点击时弹性缩放
- 分组展开/收起时高度动画
- 悬停标记时放大+发光
- 周期图标脉冲动画

## 8. 文件结构

```
Ws-Web/
├── map.html                    # 地图页面入口
├── map/
│   ├── map.js                  # 地图核心逻辑（650行）
│   ├── map.css                 # 地图样式（500+行）
│   ├── translations.js         # 中文翻译数据（200+行）
│   ├── map-research.md         # 本文档
│   ├── data/
│   │   ├── duviri.json         # 双衍王境标记数据（170KB）
│   │   ├── orb-vallis.json     # 奥布山谷标记数据（51KB）
│   │   ├── plains-eidolon.json # 夜灵平野标记数据（37KB）
│   │   └── cambion-drift.json  # 魔胎之境标记数据（15KB）
│   └── assets/
│       ├── duviri-map.png      # 双衍王境背景（7.4MB）
│       ├── orb-vallis-map.png  # 奥布山谷背景（5.8MB）
│       ├── plains-of-eidolon-map.png # 夜灵平野背景（4.7MB）
│       ├── cambion-drift-map.png     # 魔胎之境背景（6.2MB）
│       └── icons/              # Wiki图标（39个PNG）
│           ├── duviri/         # 30个双衍王境图标
│           ├── orb-vallis/     # 3个奥布山谷图标
│           ├── plains/         # 5个夜灵平野图标
│           └── shared/         # 共用图标
```

## 9. localStorage 键

| 键名 | 用途 |
|------|------|
| `wfspeed-map-favorites` | 收藏的标记 ID 列表 |

## 10. 差异化实现

### 10.1 与参考站点的差异
| 参考站点 | 我们的实现 |
|----------|------------|
| Mapbox GL JS (需token) | Leaflet (完全免费) |
| 圆形纯色标记 | 圆形Wiki图标标记 + 中文标签 |
| 简单弹窗 | 动画弹窗 + 详情卡片 + 图标 |
| 顶部标签切换 | 左侧垂直标签 + 地图状态指示器 |
| 无动画 | GSAP入场动画 + 标记stagger + 交互反馈 |
| 英文UI | 中文UI + 中文分类名 |
| 无分组系统 | 6组分类系统 + 侧边栏筛选 |

### 10.2 功能增强
- 实时周期状态本地计算
- 标记数量统计显示
- 收藏功能（localStorage持久化）
- 键盘快捷键（`/` 搜索，`Esc` 清除）
- GSAP动画系统
- 响应式设计（移动端适配）
