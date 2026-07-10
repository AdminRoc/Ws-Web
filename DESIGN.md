---
name: Ws-Web / wfspeed.run
description: CSC Alliance 公开竞速榜单站，Orokin 暗金 FUI 骨架 + 赛博霓虹双皮肤
colors:
  bg-void:       "#07080f"
  bg-deep:       "#0d101e"
  card:          "rgba(8,14,30,0.72)"
  gold-primary:  "#d4a84a"
  gold-bright:   "#f0d878"
  gold-glow:     "rgba(212,168,74,0.55)"
  cyan:          "#00d4ff"
  cyan-dim:      "rgba(0,212,255,0.35)"
  purple:        "#8b5cf6"
  teal:          "#00ffcc"
  text-primary:  "#b0cae8"
  text-muted:    "#607898"
  text-faint:    "#324560"
  white:         "#e8f4ff"
  rank-gold:     "#ffd700"
  rank-silver:   "#c0d0e8"
  rank-bronze:   "#cd8c46"
  cyber-primary: "#05d9e8"
  cyber-hot:     "#ff2a6d"
  cyber-purple:  "#7700ff"
  cyber-blue:    "#2e7dff"
typography:
  display:
    fontFamily: Orbitron
    fontSize: 2rem
    fontWeight: 700
    letterSpacing: 0.18em
  heading:
    fontFamily: Orbitron
    fontSize: 1.25rem
    fontWeight: 700
    letterSpacing: 0.1em
  ui-label:
    fontFamily: Rajdhani
    fontSize: 0.82rem
    fontWeight: 600
    letterSpacing: 0.18em
  ui-mono:
    fontFamily: Rajdhani
    fontSize: 0.72rem
    letterSpacing: 0.1em
  zh-body:
    fontFamily: XSZT, Microsoft YaHei, sans-serif
    fontSize: 0.9rem
rounded:
  sm: 4px
  md: 8px
  lg: 14px
  pill: 999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 32px
  xl: 64px
motion:
  fast:   0.16s
  normal: 0.3s
  slow:   0.6s
  ease-out:    "cubic-bezier(0.16, 1, 0.3, 1)"
  ease-spring: "cubic-bezier(0.22, 0.68, 0, 1.2)"
---

## Overview

一个 Warframe 游戏竞速榜单站，对应的情感参照是「Orokin 塔楼内壁」——纯黑深宇宙中镶嵌的古代金色精密机械界面，隔着屏幕能感受到金属质感和遥远文明的庄重感。

站点的核心视觉语言叫 **FUI（Fantasy UI）**：扫描线、六边形旋转环、战术角标、进度条光晕。这一套语言贯穿全站，从开机动画到榜单表格，到计时器 HUD，形成统一的「战术接入界面」氛围。

页面永远是暗底（近黑的深蓝-黑），没有白底、没有浅色模式、没有圆润气泡。所有内容漂浮在黑暗中，靠发光边框和辉光阴影定义层次。

**双主题**：榜单/主页等公开页面走 **Orokin 金**（`#d4a84a`）；EElog 分析器、搜索页、玩家页走**赛博霓虹**（青 `#05d9e8` + 品红 `#ff2a6d` + 紫 `#7700ff`）。主题通过 `<html data-fui-theme="cyber">` 硬编码切换，没有运行时切换按钮。

## Colors

配色分两套体系，均以深黑为底。

**Orokin 金体系**（榜单、主页、世界状态等页面）
- **bg-void** (`#07080f`)：页面底色，比纯黑稍带深蓝调，是虚空的颜色，不是幕布。
- **bg-deep** (`#0d101e`)：次层背景，用于卡片/面板。
- **gold-primary** (`#d4a84a`)：主金，Orokin 文明的标准色。边框、图标激活态、高亮文字都用它。
- **gold-bright** (`#f0d878`)：亮金，进度条末端、标题渐变高光，克制使用。
- **gold-glow** (`rgba(212,168,74,0.55)`)：辉光，永远是模糊阴影而非实色，用于 box-shadow / drop-shadow。
- **cyan / purple / teal**：榜单次要辉光色，用于排名牌、标签、悬停态，不竞争金色的主导地位。
- **rank-gold/silver/bronze**：专属于前三名排名徽章，比主金更饱和、更亮。

**赛博霓虹体系**（EElog / 搜索 / 玩家页）
- **cyber-primary** (`#05d9e8`)：电弧青，替代主金承担所有主要强调角色。
- **cyber-hot** (`#ff2a6d`)：品红热色，用于次要强调和渐变终点。
- **cyber-purple** (`#7700ff`)：深紫，开机动画旋转环渐变中间色。
- **cyber-blue** (`#2e7dff`)：科技蓝，多色渐变补充。

两套体系共享同一套 CSS 变量通道（`--g-primary` / `--g-mid` / `--g-deep` / `--g-hi`），金皮时填金色值，赛博皮时填青/紫/蓝/品红。

## Typography

四种字体，分工明确，不互换：

- **Orbitron**：所有英文标题、排名数字、计时 HUD、logo 文字。宽展、几何感强，是「未来技术显示器」的字面。
- **Rajdhani**：所有英文 UI 标签、元数据、开机动画侧边栏数据流。窄 Humanist 感，字距拉宽后模拟战术终端文字。
- **Futurak**：特殊装饰用英文，不作为正文字体。
- **XSZT（星朱体）**：全站中文字体，横细竖粗，工整中带古意，与 Orokin 风格气质吻合。英文槽找不到中文字形会自然落到 XSZT，无需手动分流。

文字大小遵循「只有两档」的克制原则：大号用于标题和数字（`1.25rem` 以上），小号用于所有元数据和标签（`0.7rem`–`0.85rem`）。正文内容的字号在 `0.88rem`–`0.95rem` 区间，没有中间档。字距普遍偏宽（`0.05em`–`0.32em`），配合全大写标签营造战术 HUD 感。

## Layout

- 导航栏固定顶部，暗金/赛博青色细边下边框，内嵌辉光。
- 内容区最大宽 `1440px`，左右有视觉边距，内容永远居中。
- 榜单表格全宽，无圆角，表头背景用主色透明渐变。
- 卡片层次靠阴影体系而非边距/圆角区分：`shadow-bg` < `shadow-card` < `shadow-panel` < `shadow-hover`，越悬浮越亮。
- 响应式断点 `640px`：导航侧边隐藏，开机动画缩小，榜单表格水平滚动。

## Elevation & Depth

深度完全靠**发光**而非**阴影颜色差**表达。底层元素几乎没有 box-shadow；每往上一层就增加一圈主色半透明辉光（`rgba(var(--g-primary), 0.06~0.18)`）。悬停状态不是 lift，而是发光增强：`box-shadow` 的扩散半径从 `0` 扩大到 `20px`。

层次规则：
1. 页面底色（bg-void）
2. 面板/表格区（`shadow-panel`：里层内嵌辉光 + 外层暗阴影）
3. 卡片（`shadow-card`）
4. 悬停激活态（`shadow-hover`：加一圈主色辉光）
5. 开机动画 splash（fixed + z-index 99999，永远在最顶）

## Shapes

- 几乎没有圆角：卡片 `border-radius: 4px`（`r-sm`），按钮胶囊 `999px`，表格行无圆角。
- 边框永远是主色半透明细线（`0.5px`–`1.5px`），不用实色粗边框。
- 开机动画的六边形环是唯一的「有机形」元素，其他都是矩形。
- 扫描线、角标（L 形 corner bracket）、虚线分隔是标准装饰语言。

## Components

```yaml
components:
  nav-bar:
    backgroundColor: "rgba(7,8,15,0.94)"
    textColor: "{colors.text-primary}"
    borderBottom: "1px solid rgba(212,168,74,0.18)"
    boxShadow: "0 2px 40px rgba(0,0,0,.72), 0 1px 0 rgba(212,168,74,.08) inset"

  tab-button:
    textColor: "rgba(176,202,232,0.72)"
    borderColor: "rgba(212,168,74,0.15)"
    backgroundColor: "rgba(212,168,74,0.03)"
    rounded: "{rounded.sm}"
  tab-button-active:
    textColor: "{colors.gold-primary}"
    borderColor: "{colors.gold-primary}"
    backgroundColor: "rgba(212,168,74,0.12)"
    boxShadow: "0 0 8px rgba(212,168,74,.5), 0 0 16px rgba(212,168,74,.28)"

  leaderboard-row:
    backgroundColor: "transparent"
    borderBottom: "1px solid rgba(212,168,74,0.06)"
  leaderboard-row-hover:
    backgroundColor: "rgba(212,168,74,0.055)"

  rank-badge-1st:
    textColor: "{colors.rank-gold}"
    borderColor: "rgba(255,215,0,0.5)"
    boxShadow: "0 0 10px rgba(255,215,0,.4)"

  boot-splash:
    backgroundColor: "#070503"
    accentColor: "{colors.gold-primary}"
    gridOpacity: "0.038"
```

## Do's and Don'ts

- **Do** 保持黑暗底色。任何新页面的背景都必须是 `bg-void` 或 `bg-deep`，绝不使用浅色背景。
- **Do** 让辉光来区分层次，而不是加深背景色。悬停 = 发光增强，不是颜色变深。
- **Do** 在需要强调时使用主金色（Orokin 金）或赛博青（取决于页面主题），不同时使用两种强调色。
- **Do** 将中英双语标题排成「大号中文 + 小号宽间距全大写英文」对组，这是本站特有的标题语言。
- **Do** 在所有计时数字和榜单时间上使用 Orbitron 字体。
- **Don't** 引入任何浅色组件、白底卡片、Material Design 风格的 elevation（白底+阴影）。
- **Don't** 用圆角大于 `14px` 的任何元素；本站的视觉语言是棱角而非圆润。
- **Don't** 在赛博主题页面里混入金色元素，或在金色主题页面里混入赛博霓虹。两套皮肤严格隔离。
- **Don't** 添加任何白天/亮色模式支持。这是一个永远在黑暗中运行的战术界面。
- **Don't** 省略开机动画（FUI splash）。这是全站页面进入的仪式感来源，所有页面都须引入 `fui-core.css` 并在 `<body>` 开头注入 `#fui-splash`。
- **Don't** 在任何动画中使用 `ease-in-out` 或线性缓动——本站只用 `ease-out` 快收和 `spring` 弹性两种曲线。
