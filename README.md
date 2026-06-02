# WFS 竞速排行榜

这是一个专门记录 Warframe 竞速成绩的排行榜网站（静态）。

站内所有成绩榜单一目了然。成绩由玩家自主提交并经过公平审核、所有人都可以自由查询已提交的纪录内容。玩家可以自由举报有作弊嫌疑的成绩，被确认为作弊的成绩，也会公开展示。

---

## 网站结构

**首页（index.html）**  
从这里进入三个最热门项目：中断、夜灵、蜘蛛。

进入榜单后，可以从顶部导航进入其他项目页面。

**中断竞速（disruption.html）**  
按游戏内中断任务地图分组，支持单人、双人、多人三个模式分别排名。

**夜灵竞速（eidolon.html / eidolon-macro.html）**  
夜灵竞速，区分有无"限制"。两类单独排名。

**蜘蛛竞速（profit-taker.html / profit-taker-macro.html）**  
大蜘蛛竞速，同样区分有无"限制"。两类单独排名。

**仲裁任务（arbitration.html）**  
按任务类型（防御、生存、中断、拦截、挖掘等）分类，共 12 张地图 × 两种竞速赛道（获得1000个生息精华、以及到达指定轮次的时间）。

**刺杀（assassination.html）**  
刺杀竞速，按普通难度和钢铁之路分别排名。

**捕获（capture.html）**  
所有捕获任务竞速，按地图逐一排名。

**叛逃（defection.html）**  
叛逃任务竞速，按地图分组排名。

**裂隙防御60轮（defense-relic.html）**  
裂隙防御60轮的竞速，按普通难度和钢铁之路分别排名。

**歼灭（exterminate.html）**  
全地图歼灭任务竞速，按普通难度和钢铁之路分别排名。

**救援（rescue.html）**  
全地图救援任务竞速，按地图逐一排名。

**破坏（sabotage.html）**  
全地图破坏任务竞速，按地图逐一排名。

**面纱前哨战（skirmish.html）**  
面纱前哨战任务竞速，按普通难度和钢铁之路分别排名。

**间谍（spy.html）**  
间谍任务竞速，同时列出"允许使用破解器"和"不允许使用破解器"两种情况。按地图分组排名。

**1999 任务（hollvania.html）**  
霍瓦尼亚任务竞速，包含 1999 歼灭、传承种收割、舞台防御、王者坦克、普通坦克五个分类。

**特殊挑战（special_challenge.html）**  
包含执刑官猎杀、获取阿耶檀识塑像、二蜘蛛、衰退室、氏族跑酷、有罪之人六个挑战项目。

**站内活动（special-events.html）**  
作为本站预留的临时竞速活动成绩，仅供活动期间采用。

**关于（about.html）**  
站点说明、规则汇总、各项目详细规则链接、成绩提交入口。

（规则链接、举报按钮、成绩提交入口等按钮，在其他页面也都存在。）

---

## 提交成绩

进入「提交成绩」按钮，填写表单即可。成绩提交后由管理员详细审核，审核通过后，通过自动化工作流，将自动出现在对应榜单。

---

## 数据格式说明

成绩数据统一存储在 `data/` 目录下，按项目分文件夹存放，后缀为 `.js` 的文件即为数据文件。每个文件包含三条信息：

| 字段 | 说明 |
|------|------|
| `clearTime` | 结算时间，格式 `分:秒.毫秒`（如 `01:23.456`），时间越短排名越靠前 |
| `playerId` | 玩家游戏 ID |
| `uploadTime` | 成绩提交日期，格式 `年-月-日` |
| `videoUrl` | 录像链接，可留空；留空则该行不显示录像按钮 |

**排名由脚本自动按时间排序，无需手动填写名次。**

---

## 如何更新数据

只需修改 `data/` 目录下对应的 `.js` 文件即可，无需触碰页面代码。

修改后刷新页面，数据自动加载，无需任何额外操作。

---

## 样式调整

全站配色统一在 `css/global.css` 顶部 `:root` 变量中修改，调整颜色代码后全站即时生效。

---

## 公告功能

每张榜单均可独立设置顶部公告横幅，内容在对应的数据文件底部填写（`Notice_cn` 为中文公告，`Notice_en` 为英文公告），无需修改页面代码。

---

*© 2026 CSC Alliance · All rights reserved. 由 Roc 于 2026 年 5 月 21 日开始创建代码。*

---

# WFS Speedrun Leaderboard

A pure static leaderboard website for Warframe speedrun records.

All records are clearly listed and easily searchable. Players submit their own times, which go through a fair review process before going live — everyone can freely browse submitted records. Any suspicious submissions can be reported, and confirmed cheating records are publicly displayed.

---

## Pages

**Home（index.html）**  
Quick access to the three most popular categories: Disruption, Eidolon, and Profit Taker.

From any leaderboard page, the top navigation leads to all other project pages.

**Disruption（disruption.html）**  
Disruption speedruns grouped by mission map, with separate leaderboards for Solo, Duo, and Multiplayer.

**Eidolon（eidolon.html / eidolon-macro.html）**  
Eidolon hunt speedruns. With and without "restrictions" are listed on separate pages.

**Profit Taker（profit-taker.html / profit-taker-macro.html）**  
Profit Taker kill speedruns. With and without "restrictions" are listed on separate pages.

**Arbitration（arbitration.html）**  
Arbitration speedruns categorized by mission type (Defense, Survival, Disruption, Interception, Excavation, etc.), across 12 maps × two race formats (reaching 1000 Vitus Essence, or reaching a specified round count).

**Assassination（assassination.html）**  
Boss assassination speedruns, listed separately for Normal and Steel Path.

**Capture（capture.html）**  
All capture mission speedruns, by individual map.

**Cambire（cambire.html）**  
Cambire mission speedruns, Normal and Steel Path.

**Defection（defection.html）**  
Defection speedruns, grouped by map.

**Defense · Relic 60 rounds（defense-relic.html）**  
Relic Defense 60-round speedruns, Normal and Steel Path.

**Exterminate（exterminate.html）**  
All Exterminate mission speedruns, Normal and Steel Path.

**Rescue（rescue.html）**  
All Rescue mission speedruns, by individual map.

**Sabotage（sabotage.html）**  
All Sabotage mission speedruns, by individual map.

**Ropalolyst（ropalolyst.html）**  
Ropalolyst fight speedruns, Normal and Steel Path.

**Skirmish（skirmish.html）**  
Veil Proxima Skirmish speedruns, Normal and Steel Path.

**Spy（spy.html）**  
Spy mission speedruns, listing both "vault hack allowed" and "vault hack banned" results, grouped by map.

**Hollvania（hollvania.html）**  
1999-themed speedruns: 1999 Exterminate, Legacyte Harvest, Stage Defense, Apex Tanks, Normal Tanks.

**Special Challenge（special_challenge.html）**  
Includes Archon Hunt, Ayatan Capture, Exploiter Orb, Netracell, Obstacle Course, and The Guilty.

**Special Events（special-events.html）**  
Reserved for temporary community speedrun events; active only during event periods.

**About（about.html）**  
Site overview, rules for each category, links to detailed rules, and the record submission form.

(Rules links, report buttons, and submission form buttons are also available on all other pages.)

---

## Submitting Records

Click "Submit Record" on any page, fill out the form, and submit. The record goes through a detailed admin review, and once approved, an automated workflow publishes it to the correct leaderboard.

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

*© 2026 CSC Alliance · All rights reserved. Code originally created by Roc on May 21, 2026.*
