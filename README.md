# Warframe Speed 竞速榜单

# 本站网址：WFSpeed.run

（本站简称：WS）

这是一个公益性质的、专门记录 Warframe 竞速成绩的榜单网站。

**本站与其他审核不严密的站点不同，每一条新成绩都需要经过两轮人工复核；仅凭 EE.log 等可被随意篡改的信息，是不能直接上榜的。**

站内所有成绩榜单一目了然，所有人都可以自由查询已提交的纪录内容、或是作弊公示表单。

---

本站转为静态结构的原因：

- 在 2026/5/20 之前，本站一直是建立在位于香港的云服务器上的，而后考虑到下列因素，决定转为开源，将代码库建立在GitHub端，并顺势使用Public库可以无限使用Action的特性，对世界状态等信息进行自动化循环校准。

- Warframe的竞速玩家群体的数量极少，即便加上Speedrun的数据，需要审核的数据条目也不超过 "3条/天"，而我们却有超过十位的审核员，且审核后的结果还会进行二次的复核，从日志到视频，都会进行仔细检查。

- 综上所述，受众小、数据总数量少、新增条目的频率低，是我们决定不再使用后端服务器，转为GitHub全开源状态的主要原因。

---

## 网站结构

**首页（index.html）** — 入口，直达中断、夜灵、蜘蛛三个最热门项目；进入榜单后，可从顶部导航前往其他项目页面。

榜单页面（按地图/任务类型分组排名，多数区分普通与钢铁之路或"有无限制"）：

| 页面 | 内容 |
|---|---|
| `disruption.html` / `-duo` / `-multi` | 中断竞速，单人 / 双人 / 多人 |
| `eidolon.html` / `eidolon-macro.html` | 夜灵竞速，有限制 / 无限制 |
| `profit-taker.html` / `profit-taker-macro.html` | 大蜘蛛竞速，有限制 / 无限制 |
| `arbitration.html` | 仲裁任务竞技/竞速，双赛道：生息精华效率 / 指定轮次耗时 |
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
| `spy.html` | 间谍竞速（允许 / 禁止破解器） |
| `hollvania.html` | 1999 任务竞速（歼灭、传承种收割、舞台防御、坦克等） |
| `special_challenge.html` | 特殊挑战（执刑官猎杀、阿耶檀识、二蜘蛛、衰退室等） |
| `special-events.html` | 站内临时竞速活动，仅活动期间生效 |

工具与信息页面：

| 页面 | 内容 |
|---|---|
| `search.html` | 全站搜索，跨所有榜单按玩家/地图/分类检索 |
| `worldstate.html` | 实时世界状态：周期、裂缝、仲裁、电波、特卖、武器轮换等 |
| `eelog.html`（及 `log/analyzer.html`） | EE.log 全能分析器（任何已结算的任务日志都可分析、且可以查看个人资料+可生成分享图） |
| `player.html` | 玩家主页，汇总该玩家在各榜单的提交记录，且可以一键生成分享图（动态图片） |
| `viewer.html` | 过渡加载页 |
| `about.html` | 讨贼檄文 |

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

**特别提醒**：出于对‘受众数量、以及数据总量较少’这一现状的考虑，本站刻意删除/改动了一些兄弟们大概率永远用不到的内容，包含:
- 中英文映射表中的大量条目（仅保留了当前翻译所需的）
- 榜单数据的自动化更新逻辑
- 物品掉落信息查询页面
- 需要路由我方境外服务器的自建API源（当前本站已经改为纯静态站点 + 借用其他网络上公开呈现的数据源）。

---

## 特别鸣谢

本站世界状态（worldstate.html）模块的部分数据，主要依赖以下第三方公开数据源与社区项目，特此致谢：

- [warframestat.us](https://warframestat.us) —— WFCD 维护的 Warframe 世界状态 API
- [browse.wf](https://browse.wf) —— calamity-inc 维护的世界状态镜像与中文字典（dict.zh.json）
- CloudFlare —— 作为自动化执行Action的触发器，持续校准世界状态的时间戳
- Digital Extremes 官方 掉落表 (www.warframe.com/zh-hans/droptables#missionRewards)
- Digital Extremes 官方 API（api.warframe.com）

本站仅做读取与展示，不修改、不转售其内容。如所利用数据源的维护者认为引用方式有不妥之处，欢迎联系我们调整或移除。

---

*© 2026 [CSC 联盟] · 由 Roc 于 2026 年 5 月 21 日开始创建代码。*

---

# English Version

# Warframe Speed Leaderboard

# Site: WFSpeed.run

(Short name: WS)

This is a non-profit, community-run leaderboard site dedicated to tracking Warframe speedrun records.

**Unlike some loosely-moderated sites, every new record here goes through two rounds of manual human review — information that can be freely edited, such as an EE.log file, is never enough on its own to get a submission listed.**

All records are clearly listed and freely searchable by everyone — including the public disclosure forms for confirmed cheating cases.

---

Why this site is now a static site:

- Before 2026/5/20, this site ran on a cloud server based in Hong Kong. We then decided to open-source it and move the codebase to GitHub, taking advantage of the fact that public repositories get unlimited GitHub Actions usage — letting us continuously auto-calibrate things like world state on a recurring schedule.

- Warframe's speedrunning community is tiny. Even counting every category, we rarely see more than "3 submissions per day" needing review, yet we have more than ten reviewers, and every approved result still goes through a second round of review — logs and videos are both checked carefully.

- Given the small audience, the low total data volume, and the low rate of new submissions, we no longer need a backend server at all — that's the main reason we moved to a fully open-source, GitHub-only setup.

---

## Pages

**Home (index.html)** — Entry point, quick access to the three most popular categories (Disruption, Eidolon, Profit Taker). From any leaderboard page, the top navigation leads to all other pages.

Leaderboard pages (grouped by map/mission type, most split into Normal vs. Steel Path, or "with/without restrictions"):

| Page | Content |
|---|---|
| `disruption.html` / `-duo` / `-multi` | Disruption, Solo / Duo / Multiplayer |
| `eidolon.html` / `eidolon-macro.html` | Eidolon hunts, with / without restrictions |
| `profit-taker.html` / `profit-taker-macro.html` | Profit Taker kills, with / without restrictions |
| `arbitration.html` | Arbitration races, two tracks: Vitus Essence efficiency / time to a set round |
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
| `eelog.html` (and `log/analyzer.html`) | EE.log all-in-one analyzer (analyzes any completed mission log, includes a personal profile view, and can generate shareable images) |
| `player.html` | Player profile aggregating one player's submissions across all leaderboards, with one-click shareable image (animated) generation |
| `viewer.html` | Loading/transition screen |
| `about.html` | Manifesto |

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

**Special Note**: To guard against "prompt engineers" who copy this project and then call it their own "original" work — and also in light of how small the speedrunning community actually is — this repository intentionally removes or alters some content that fellow community members would almost never need anyway, including:
- The bulk of entries in the Chinese/English mapping tables (only the entries actually needed for current translations are kept)
- The automated leaderboard data-update pipeline
- The item drop-table lookup page
- Our self-hosted API source that required routing through an overseas server (this public version has been changed to a pure static site that borrows other public APIs instead)

---

## Acknowledgments

Some of the data used by this site's world state (`worldstate.html`) module relies on the following third-party public data sources and community projects — our thanks to:

- [warframestat.us](https://warframestat.us) — the Warframe world state API maintained by WFCD
- [browse.wf](https://browse.wf) — world state mirror and Chinese dictionary (dict.zh.json) maintained by calamity-inc
- [wfhub.top](https://wfhub.top) — reference source for Tenet/Coda weapon rotation data
- Cloudflare — used as the trigger for our automated Actions that keep world state continuously calibrated
- Digital Extremes' official drop tables (warframe.com/droptables#missionRewards)
- Digital Extremes' official API (api.warframe.com)

This site only reads and displays the above data — it does not modify or resell it. If any data source maintainer feels our use of their data is inappropriate, please reach out and we'll adjust or remove it.

---

*© 2026 [CSC Alliance] · Code originally created by Roc on May 21, 2026.*
