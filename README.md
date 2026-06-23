# WFS 竞速排行榜

这是一个专门记录 Warframe 竞速成绩的排行榜网站（纯静态）。

**本站与其他审核不严密的站点不同，每一条新成绩都需要经过人工复核；仅凭 EE.log 等可被随意篡改的信息，是不能直接上榜的。**

站内所有成绩榜单一目了然，所有人都可以自由查询已提交的纪录内容。

---

## 网站结构

**首页（index.html）** — 入口，直达中断、夜灵、蜘蛛三个最热门项目；进入榜单后，可从顶部导航前往其他项目页面。

榜单页面（按地图/任务类型分组排名，多数区分普通与钢铁之路或"有无限制"）：

| 页面 | 内容 |
|---|---|
| `disruption.html` / `-duo` / `-multi` | 中断竞速，单人 / 双人 / 多人 |
| `eidolon.html` / `eidolon-macro.html` | 夜灵竞速，有限制 / 无限制 |
| `profit-taker.html` / `profit-taker-macro.html` | 大蜘蛛竞速，有限制 / 无限制 |
| `arbitration.html` | 仲裁任务，12 张地图 × 千生息精华 / 指定轮次耗时 |
| `assassination.html` | 刺杀竞速 |
| `capture.html` | 捕获竞速 |
| `cambire.html` | 元素转换竞速 |
| `defection.html` | 叛逃任务竞速 |
| `defense-relic.html` | 防御裂缝 60 轮竞速 |
| `exterminate.html` | 歼灭竞速 |
| `rescue.html` | 救援竞速 |
| `sabotage.html` | 破坏竞速 |
| `ropalolyst.html` | 蝠力使竞速 |
| `skirmish.html` | 面纱前哨战竞速 |
| `spy.html` | 间谍竞速（区分允许 / 禁止破解器） |
| `hollvania.html` | 1999 任务竞速（歼灭、传承种收割、舞台防御、坦克等） |
| `special_challenge.html` | 特殊挑战（执刑官猎杀、阿耶檀识、二蜘蛛、衰退室等） |
| `special-events.html` | 站内临时竞速活动，仅活动期间生效 |

工具与信息页面：

| 页面 | 内容 |
|---|---|
| `search.html` | 全站搜索，跨所有榜单按玩家/地图/分类检索 |
| `worldstate.html` | 实时世界状态：周期、裂缝、仲裁、夜波、特卖、武器轮换等 |
| `eelog.html`（及 `log/analyzer.html`） | EE.log 战斗日志分析器（独立设计风格） |
| `player.html` | 玩家主页，汇总该玩家在各榜单的提交记录 |
| `viewer.html` | 站内规则文档查看器 |
| `about.html` | 站点说明、各项目规则汇总、成绩提交入口 |

（规则链接、举报按钮、成绩提交入口在其他页面同样可用。）

---

## 提交成绩

进入「提交成绩」按钮，填写表单即可。成绩提交后由管理员人工复核，审核通过后，通过自动化工作流自动出现在对应榜单。

---

## 举报与违规公示

本站支持对任何已上榜成绩进行举报。一经查实违规/作弊，该成绩将被单独公开展示，其在提交成绩时所同意公布的表单内容，也会一并完全公开展示。

---

## 数据格式说明

成绩数据统一存储在 `data/` 目录下，按项目分文件夹存放，后缀为 `.js` 的文件即为数据文件。每条记录包含四个字段：

| 字段 | 说明 |
|------|------|
| `clearTime` | 结算时间，格式 `分:秒.毫秒`（如 `01:23.456`），时间越短排名越靠前 |
| `playerId` | 玩家游戏 ID |
| `uploadTime` | 成绩提交日期，格式 `年-月-日` |
| `videoUrl` | 录像链接，可留空；留空则该行不显示录像按钮 |

**排名由脚本自动按时间排序，无需手动填写名次。**

---

## 如何更新数据

只需修改 `data/` 目录下对应的 `.js` 文件即可，无需触碰页面代码。修改后刷新页面，数据自动加载。

---

## 样式调整

全站配色统一在 `css/global.css` 顶部 `:root` 变量中修改，调整颜色代码后全站即时生效。

---

## 公告功能

每张榜单均可独立设置顶部公告横幅，内容在对应的数据文件底部填写（`Notice_cn` 为中文公告，`Notice_en` 为英文公告），无需修改页面代码。

---

**特别提醒**：为了防范有些照抄之后说"原创"的提示词"开发者"，本站刻意删除了部分与榜单内容无关的内容，包含中英文映射表中的大量条目（仅保留了当前翻译所需的）、榜单数据的自动化更新逻辑、物品掉落信息查询页面、以及需要路由我方境外服务器的世界状态 API（当前改为纯静态站点 + 借用其他 API）。

---

*© 2026 CSC Alliance · All rights reserved. 由 Roc 于 2026 年 5 月 21 日开始创建代码。*

---

# English Version

# WFS Speedrun Leaderboard

A pure static leaderboard website for Warframe speedrun records.

**Unlike some loosely-moderated sites, every new record here goes through manual human review — information that can be freely edited, such as an EE.log file, is never enough on its own to get a submission listed.**

All records are clearly listed and easily searchable by everyone.

---

## Pages

**Home (index.html)** — Entry point, quick access to the three most popular categories (Disruption, Eidolon, Profit Taker). From any leaderboard page, the top navigation leads to all other pages.

Leaderboard pages (grouped by map/mission type, most split into Normal vs. Steel Path, or "with/without restrictions"):

| Page | Content |
|---|---|
| `disruption.html` / `-duo` / `-multi` | Disruption, Solo / Duo / Multiplayer |
| `eidolon.html` / `eidolon-macro.html` | Eidolon hunts, with / without restrictions |
| `profit-taker.html` / `profit-taker-macro.html` | Profit Taker kills, with / without restrictions |
| `arbitration.html` | Arbitration, 12 maps × (1000 Vitus Essence / time to a set round) |
| `assassination.html` | Boss assassinations |
| `capture.html` | Capture missions |
| `cambire.html` | Cambire (element conversion) missions |
| `defection.html` | Defection missions |
| `defense-relic.html` | Relic Defense, 60 rounds |
| `exterminate.html` | Exterminate missions |
| `rescue.html` | Rescue missions |
| `sabotage.html` | Sabotage missions |
| `ropalolyst.html` | Ropalolyst fight |
| `skirmish.html` | Veil Proxima Skirmish |
| `spy.html` | Spy missions (vault hack allowed / banned) |
| `hollvania.html` | 1999-themed missions (Exterminate, Legacyte Harvest, Stage Defense, Tanks, etc.) |
| `special_challenge.html` | Special challenges (Archon Hunt, Ayatan Capture, Exploiter Orb, Netracell, etc.) |
| `special-events.html` | Temporary community events; active only during event periods |

Tools and info pages:

| Page | Content |
|---|---|
| `search.html` | Site-wide search across every leaderboard by player / map / category |
| `worldstate.html` | Live world state: cycles, fissures, arbitration, Nightwave, sales, weapon rotations, etc. |
| `eelog.html` (and `log/analyzer.html`) | EE.log combat-log analyzer (intentionally distinct visual style) |
| `player.html` | Player profile aggregating one player's submissions across all leaderboards |
| `viewer.html` | In-site viewer for rules documents |
| `about.html` | Site overview, rules for each category, and the record submission form |

(Rules links, report buttons, and the submission form are also available on other pages.)

---

## Submitting Records

Click "Submit Record" on any page and fill out the form. Submissions go through manual admin review, and once approved, an automated workflow publishes them to the correct leaderboard.

---

## Reporting & Disclosure of Violations

Any listed record can be reported. If a report is confirmed as a violation/cheating, that record is publicly flagged and displayed separately — and the form details the submitter agreed to disclose at submission time are also published in full.

---

## Data Format

All record data lives in `data/` as `.js` files, organized by category. Each entry uses four fields:

| Field | Description |
|-------|-------------|
| `clearTime` | Clear time in `MM:SS.mmm` format; shorter is better |
| `playerId` | In-game player name |
| `uploadTime` | Submission date in `YYYY-MM-DD` |
| `videoUrl` | Video link (optional; leave blank to hide the video button) |

Rankings are auto-sorted by time — no need to manually assign positions.

---

## Updating Data

Just edit the relevant `.js` file in `data/`. No need to touch any HTML. Refresh the page and the new data loads instantly.

---

## Styling

All global colors are in `css/global.css` under `:root`. Change a color code there and it applies site-wide immediately.

---

## Notice Banners

Each leaderboard can display its own top-of-page notice banner. Edit the `Notice_cn` (Chinese) and `Notice_en` (English) fields at the bottom of the corresponding data file — no HTML changes needed.

---

**Special Note**: To guard against "prompt engineers" who copy this project and then claim it as their own "original" work, this repository intentionally omits certain content that is unrelated to the leaderboards themselves — including the bulk of entries in the Chinese/English mapping tables (only the entries actually needed for current translations are kept), the automated leaderboard data-update pipeline, the item drop-lookup page, and the worldstate API logic that required routing through our overseas server (this public version has been changed to a pure static site that borrows other public APIs instead).

---

## 特别鸣谢

本站世界状态（worldstate.html）模块的部分数据，依赖以下第三方公开数据源与社区项目，特此致谢：

- [warframestat.us](https://warframestat.us) —— WFCD 维护的 Warframe 世界状态 API
- [browse.wf](https://browse.wf) —— calamity-inc 维护的世界状态镜像与中文字典（dict.zh.json）
- [wfhub.top](https://wfhub.top) —— 信条 / 终幕武器轮换（元素与加成百分比）数据参考来源
- Digital Extremes 官方 API（api.warframe.com）

以上数据源均为公开接口，本站仅做读取与展示，不修改、不转售其内容。如数据源维护者认为引用方式有不妥之处，欢迎联系我们调整或移除。

---

*© 2026 CSC Alliance · All rights reserved. Code originally created by Roc on May 21, 2026.*
