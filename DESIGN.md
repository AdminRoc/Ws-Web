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
  shimmer:     8s
  sweep:       4.5s
  badge-pop:   0.55s
  radar:       4s
  wave:        4s
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

**榜单专用 CSS 变量通道**（`global.css` 中定义，`leaderboard.css` 消费）

| 变量名 | 值 | 用途 |
|--------|-----|------|
| `--c-lb-card` | `rgba(12,8,2,.82)` | 卡片/面板背景 |
| `--c-lb-border` | `rgba(185,142,52,.18)` | 主边框 |
| `--c-lb-border-light` | `rgba(185,142,52,.06)` | 行分隔线 |
| `--c-lb-hover` | `rgba(185,142,52,.12)` | 悬停背景 |
| `--c-lb-hover-glow` | `rgba(185,142,52,.08)` | 悬停辉光底色 |
| `--c-lb-header-bg` | `linear-gradient(90deg, rgba(185,142,52,.10) 0%, rgba(140,95,20,.06) 100%)` | 表头背景 |
| `--c-lb-header-border` | `rgba(185,142,52,.22)` | 表头下边框 |

**排名徽章色阶**

| 排名 | 边框色 | 背景色 | 辉光色 | 脉冲 |
|------|--------|--------|--------|------|
| #1 | `rgba(255,215,0,.5)` | `rgba(255,215,0,.1)` | 3层 `rgba(255,215,0,.5→.95→.7)` | 2.6s 周期 |
| #2 | `rgba(192,208,232,.45)` | `rgba(192,208,232,.08)` | 3层 `rgba(192,208,232,.35→.75→.45)` | 3.2s 周期 |
| #3 | `rgba(205,140,70,.45)` | `rgba(205,140,70,.08)` | 3层 `rgba(205,140,70,.3→.65→.35)` | 3.8s 周期 |
| #4-#6 | `rgba(255,255,255,.18)` | `rgba(255,255,255,.06)` | 无脉冲 | — |
| #7+ | `rgba(255,255,255,.1)` | `rgba(255,255,255,.03)` | 无脉冲 | — |

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

## Motion & Animation

所有动效均以高帧率（60fps）、高质量、高级感为目标。性能不是约束条件。

### 动画时间常量

| 名称 | 时长 | 缓动 | 用途 |
|------|------|------|------|
| `shimmer` | 8s | `linear` | 标题渐变光带循环 |
| `sweep` | 4.5s | `ease-in-out` | WR 扫光（#1 行金色光束横扫） |
| `badge-pop` | 0.55s | `spring(.22,.68,0,1.7)` | 排名徽章弹射入场 |
| `time-reveal` | 0.55s | `spring(.22,.68,0,1.3)` | 时间数字滚入（clip-path 揭开） |
| `player-in` | 0.45s | `spring(.22,.68,0,1.15)` | 玩家 ID 从右侧渐显 |
| `rank-pulse-1` | 2.6s | `ease-in-out` | #1 金色徽章脉冲 |
| `rank-pulse-2` | 3.2s | `ease-in-out` | #2 银色徽章脉冲 |
| `rank-pulse-3` | 3.8s | `ease-in-out` | #3 古铜徽章脉冲 |
| `rank-time-pulse` | 3s | `ease-in-out` | #1 时间列辉光脉冲 |
| `radar` | 4s | `linear` | 空状态雷达扫描线旋转 |
| `wave` | 4s | `ease-out` | 空状态信号波纹扩散（3层交错 1.33s） |
| `ring-rotate` | 8s / 5s / 12s | `linear` | 空状态旋转环（外/内/第二层） |
| `entry-stagger` | 30ms | — | 行入场交错延迟（每行递增 30ms） |

### prefers-reduced-motion 降级策略

用户启用「减少动效」时，**仅禁用 motion（位移/旋转/缩放/脉冲）**，保留所有颜色、辉光和静态视觉效果：

- 标题渐变 → 保留 200% 背景尺寸，禁用位移
- Tab 激活 → 保留辉光，禁用脉冲
- 排名徽章 → 保留颜色/辉光，禁用脉冲
- WR 扫光 → 禁用位移
- 入场动画 → 立即显示最终状态
- 空状态 → 保留颜色，禁用旋转/缩放/波纹（波纹直接隐藏）

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
- 空状态四角角标（L 形 corner bracket）是榜单页特有的战术装饰，18px 尺寸，金色半透明。

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

  rank-badge-4to6:
    textColor: "{colors.text-primary}"
    borderColor: "rgba(255,255,255,0.18)"
    backgroundColor: "rgba(255,255,255,0.06)"
    note: "无脉冲，比前三名更克制"

  empty-state:
    container: ".lb-empty-state"
    layout: "flex-column, centered, gap .85rem"
    elements:
      - ring: "双层虚线旋转环（金色 8s + 紫色 5s reverse）"
      - ring2: "第二层实线旋转环（金色 12s）"
      - radar: "雷达扫描线（金色渐变，4s 旋转）"
      - corner: "四角 L 形战术角标（18px，金色半透明）"
      - wave: "信号波纹 x3（金色边框，扩散消失，交错 1.33s）"
      - icon: "SVG 十字准星（青色，脉冲缩放）"
      - text: "NO SIGNAL（Orbitron，金色半透明，0.38em 字距）"
      - sub: "暂无记录（XSZT，灰色）"
      - submit: "提交成绩按钮（金色主题，箭头）"

  tab-scroll-hint:
    selector: ".map-tabs::after"
    position: "absolute, right:0, top:0, bottom:0"
    width: "48px"
    gradient: "linear-gradient(to right, transparent, var(--c-bg))"
    behavior: "滚动到末端时 .scroll-end 类隐藏"

  table-scroll-hint:
    selector: ".lb-table-wrap::after"
    position: "absolute, right:0, top:0, bottom:0"
    width: "40px"
    gradient: "linear-gradient(to right, transparent, var(--c-lb-card))"
    behavior: "滚动到末端时 .scroll-end 类隐藏"
    breakpoint: "max-width: 480px only"

  submit-button:
    selector: ".lb-empty-submit"
    style: "inline-flex, padding .45rem 1.1rem, 金色主题"
    hover: "亮金 + 辉光 + 箭头右移 3px"
    target: "viewer.html (飞书表单)"

  focus-visible:
    selectors: ".map-tab-btn:focus-visible, .lb-tab-btn:focus-visible, .lb-back:focus-visible, .nav-item > a:focus-visible, .report-btn:focus-visible, .shame-btn:focus-visible"
    style: "2px solid var(--c-gold), box-shadow 0 0 0 4px rgba(212,168,74,0.3)"
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
- **Do** 在空状态使用雷达扫描 + 角标 + 波纹组合，保持 FUI 战术界面感。这些元素是「信号搜索」语义的视觉化，不是纯装饰。
- **Do** 移动端 Tab 或表格超出视口宽度时，在右侧显示 48px/40px 渐变遮罩提示可滚动，滚动到末端时渐隐。
- **Do** 排名徽章 #4-#6 使用 `var(--c-text1)` 文字色 + `rgba(255,255,255,.18)` 边框 + `rgba(255,255,255,.06)` 背景，比 #7+ 稍亮但不竞争前三名视觉权重。
- **Don't** 在 `prefers-reduced-motion` 模式下完全移除视觉效果——只禁用 motion，保留颜色和辉光。用户可能仍有低视力需求。
- **Don't** 修改空状态 SVG 图标的内容（十字准星 + 虚线圆环），它们是 FUI 标准符号；可以增强周围的装饰层，不要动图标本身。

## Accessibility

本站不追求完整 WCAG AAA 合规，但满足以下基础无障碍要求：

### ARIA 语义

- 所有 Tab 组件（`.map-tab-btn` / `.lb-tab-btn`）必须含 `role="tab"`，父容器含 `role="tablist"`。
- 活跃 Tab 必须含 `aria-selected="true"`，非活跃含 `aria-selected="false"`。
- 所有 Tab 必须含 `aria-controls="lb-tbody"` 指向数据表格。
- 排名徽章必须含 `aria-label="第N名"`（由 `main.js` 动态生成）。
- 标题（`.lb-title`）必须含 `aria-label` 属性。
- 徽章中英文 span 必须含 `aria-hidden`（父容器含 `aria-live="polite"`）。

### 键盘交互

- 所有交互元素必须支持 `:focus-visible` 样式：2px solid 金色边框 + 4px 半透明辉光。
- 焦点样式仅在键盘导航时显示，鼠标点击不触发。

### 触控目标

- 移动端（≤480px）所有可点击元素最小尺寸 44px × 44px（WCAG 2.5.5）。
- 受影响元素：`.map-tab-btn`、`.lb-back`、`.report-btn`、`.shame-btn`。

### 减少动效

- 站点完整支持 `prefers-reduced-motion: reduce` 媒体查询。
- 降级策略：保留颜色和辉光，仅禁用位移/旋转/缩放/脉冲（详见 Motion & Animation 章节）。

## Responsive

### 断点 768px（平板）

- Tab 容器（`.map-tabs`）切换为 `overflow-x: auto`，隐藏滚动条，右侧显示 48px 渐变遮罩。
- 导航栏侧边隐藏部分菜单项。

### 断点 480px（手机）

- 表格容器（`.lb-table-wrap`）切换为 `overflow-x: auto`，右侧显示 40px 渐变遮罩（背景色取 `--c-lb-card`）。
- 表格固定布局 `table-layout: fixed`，列宽压缩。
- 标题字号缩放 `clamp(1rem, 6vw, 1.4rem)`。
- 排名徽章缩小至 30px × 30px。
- 触控目标最小 44px × 44px。
- 徽章换行保护：`.lb-title` 间距压缩至 `.5rem`。
- iOS 安全区留白：`padding-bottom: env(safe-area-inset-bottom)`。

### 竖屏安全区

- `@media (max-width: 480px) and (orientation: portrait)` 为 `.lb-table-wrap` 添加 `padding-bottom: env(safe-area-inset-bottom, 0px)`。
