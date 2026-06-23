/* ════════════════════════════════════════════════════════════
 *  自动生成，请勿手动编辑本文件。
 *  本文件由 .github/scripts/bundle_data.py 把同目录下所有数据源文件
 *  拼接而成，用于减少 HTTP 请求数。要修改成绩数据，请编辑同目录下
 *  对应的单个 <分类>-<节点>.js 源文件，push 后会自动重建本文件。
 * ════════════════════════════════════════════════════════════ */

/* ===== data/hollvania/hollvania-1999-exterminate.js ===== */
/* ════════════════════════════════════════════════════════════
 *  1999 歼灭 竞速排行榜  /  1999 Exterminate Speedrun Leaderboard
 *  数据文件：hollvania-1999-exterminate.js
 *  ┌──────────────────────────────────────────────────────┐
 *  │  字段说明：                                          │
 *  │    playerId  —— 玩家 ID（昵称）                      │
 *  │    clearTime —— 时间（格式：mm:ss.ms）            │
 *  │    uploadTime—— 成绩提交时间（格式：YYYY-MM-DD）      │
 *  │    videoUrls —— 视频链接数组；最多4个视角             │
 *  │                 ["url1","url2",...]                   │
 *  │  排名规则：脚本按 clearTime 从小到大自动排序          │
 *  └──────────────────────────────────────────────────────┘
 *
 *  添加/修改记录方法：
 *  在下方 hollvania_1999_exterminateRecords 数组中新增一个对象，如：
 *    {
 *      playerId:   "玩家名",
 *      clearTime:  "1:23.456",
 *      uploadTime: "2025-01-01",
 *      videoUrls:  ["https://..."],
 *    },
 * ════════════════════════════════════════════════════════════ */

var hollvania_1999_exterminateRecords = [
  {
    playerId:   "FrostMainer",
    clearTime:  "0:52.000",
    uploadTime: "2026-05-19",
    videoUrls:  ["https://www.youtube.com/watch?v=Gqnyvtrijho"],
  },
  {
    playerId:   "RoniPrime",
    clearTime:  "2:52.000",
    uploadTime: "2026-01-08",
    videoUrls:  ["https://www.youtube.com/watch?v=X5_Z7q5ZqxQ"],
  },
  {
    playerId:   "NamelessDeity",
    clearTime:  "1:04.000",
    uploadTime: "2026-02-04",
    videoUrls:  ["https://www.youtube.com/watch?v=nAtBtFu6qHw"],
  },
  {
    playerId:   "Salat",
    clearTime:  "1:20.000",
    uploadTime: "2026-01-07",
    videoUrls:  ["https://www.youtube.com/watch?v=ws3wMH24tVo"],
  },
];

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var hollvania_1999_exterminateNotice_cn = "";
var hollvania_1999_exterminateNotice_en = "";
;

/* ===== data/hollvania/hollvania-legacyte-harvest.js ===== */
/* ════════════════════════════════════════════════════════════
 *  传承种收割 竞速排行榜  /  Legacyte Harvest Speedrun Leaderboard
 *  数据文件：hollvania-legacyte-harvest.js
 *  ┌──────────────────────────────────────────────────────┐
 *  │  字段说明：                                          │
 *  │    playerId  —— 玩家 ID（昵称）                      │
 *  │    clearTime —— 时间（格式：mm:ss.ms）            │
 *  │    uploadTime—— 成绩提交时间（格式：YYYY-MM-DD）      │
 *  │    videoUrls —— 视频链接数组；最多4个视角             │
 *  │                 ["url1","url2",...]                   │
 *  │  排名规则：脚本按 clearTime 从小到大自动排序          │
 *  └──────────────────────────────────────────────────────┘
 *
 *  添加/修改记录方法：
 *  在下方 hollvania_legacyte_harvestRecords 数组中新增一个对象，如：
 *    {
 *      playerId:   "玩家名",
 *      clearTime:  "1:23.456",
 *      uploadTime: "2025-01-01",
 *      videoUrls:  ["https://..."],
 *    },
 * ════════════════════════════════════════════════════════════ */

var hollvania_legacyte_harvestRecords = [
  /* 暂无记录 */
];

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var hollvania_legacyte_harvestNotice_cn = "";
var hollvania_legacyte_harvestNotice_en = "";
;

/* ===== data/hollvania/hollvania-stage-defense.js ===== */
/* ════════════════════════════════════════════════════════════
 *  舞台防御 竞速排行榜  /  Stage Defense Speedrun Leaderboard
 *  数据文件：hollvania-stage-defense.js
 *  ┌──────────────────────────────────────────────────────┐
 *  │  字段说明：                                          │
 *  │    playerId  —— 玩家 ID（昵称）                      │
 *  │    clearTime —— 时间（格式：mm:ss.ms）            │
 *  │    uploadTime—— 成绩提交时间（格式：YYYY-MM-DD）      │
 *  │    videoUrls —— 视频链接数组；最多4个视角             │
 *  │                 ["url1","url2",...]                   │
 *  │  排名规则：脚本按 clearTime 从小到大自动排序          │
 *  └──────────────────────────────────────────────────────┘
 *
 *  添加/修改记录方法：
 *  在下方 hollvania_stage_defenseRecords 数组中新增一个对象，如：
 *    {
 *      playerId:   "玩家名",
 *      clearTime:  "1:23.456",
 *      uploadTime: "2025-01-01",
 *      videoUrls:  ["https://..."],
 *    },
 * ════════════════════════════════════════════════════════════ */

var hollvania_stage_defenseRecords = [
  /* 暂无记录 */
];

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var hollvania_stage_defenseNotice_cn = "";
var hollvania_stage_defenseNotice_en = "";
;

/* ===== data/hollvania/hollvania-victory-plaza-apex.js ===== */
/* ════════════════════════════════════════════════════════════
 *  1999 坦克 竞速排行榜  /  Victory Plaza Speedrun Leaderboard
 *  数据文件：hollvania-victory-plaza-apex.js
 *  ┌──────────────────────────────────────────────────────┐
 *  │  字段说明：                                          │
 *  │    playerId  —— 玩家 ID（昵称）                      │
 *  │    clearTime —— 时间（格式：mm:ss.ms）            │
 *  │    uploadTime—— 成绩提交时间（格式：YYYY-MM-DD）      │
 *  │    videoUrls —— 视频链接数组；最多4个视角             │
 *  │                 ["url1","url2",...]                   │
 *  │  排名规则：脚本按 clearTime 从小到大自动排序          │
 *  └──────────────────────────────────────────────────────┘
 *
 *  添加/修改记录方法：
 *  在下方 victory_plaza_apexRecords 数组中新增一个对象，如：
 *    {
 *      playerId:   "玩家名",
 *      clearTime:  "1:23.456",
 *      uploadTime: "2025-01-01",
 *      videoUrls:  ["https://..."],
 *    },
 * ════════════════════════════════════════════════════════════ */

var victory_plaza_apexRecords = [

  {
    playerId:   "RoniPrime",
    clearTime:  "00:04:52.000",
    uploadTime: "2025-10-18",
    videoUrls:  ["https://www.youtube.com/watch?v=FRiJLg3DEEM"],
  },
  {
    playerId:   "PWNZ",
    clearTime:  "00:07:31.017",
    uploadTime: "2025-09-19",
    videoUrls:  ["https://wfspeed.run/unavailable.html"],
  },
  {
    playerId:   "NamelessDeity / RoniPrime",
    clearTime:  "00:03:42.000",
    uploadTime: "2025-10-07",
    videoUrls:  ["https://www.youtube.com/watch?v=cqCJqK0yVMc"],
  },

];

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var victory_plaza_apexNotice_cn = "";
var victory_plaza_apexNotice_en = "";
;

/* ===== data/hollvania/hollvania-victory-plaza-normal.js ===== */
/* ════════════════════════════════════════════════════════════
 *  1999 坦克 竞速排行榜  /  Victory Plaza Speedrun Leaderboard
 *  数据文件：hollvania-victory-plaza-normal.js
 *  ┌──────────────────────────────────────────────────────┐
 *  │  字段说明：                                          │
 *  │    playerId  —— 玩家 ID（昵称）                      │
 *  │    clearTime —— 时间（格式：mm:ss.ms）            │
 *  │    uploadTime—— 成绩提交时间（格式：YYYY-MM-DD）      │
 *  │    videoUrls —— 视频链接数组；最多4个视角             │
 *  │                 ["url1","url2",...]                   │
 *  │  排名规则：脚本按 clearTime 从小到大自动排序          │
 *  └──────────────────────────────────────────────────────┘
 *
 *  添加/修改记录方法：
 *  在下方 victory_plaza_normalRecords 数组中新增一个对象，如：
 *    {
 *      playerId:   "玩家名",
 *      clearTime:  "1:23.456",
 *      uploadTime: "2025-01-01",
 *      videoUrls:  ["https://..."],
 *    },
 * ════════════════════════════════════════════════════════════ */

var victory_plaza_normalRecords = [

  {
    playerId:   "Salat",
    clearTime:  "0:02:34",
    uploadTime: "2025-04-05",
    videoUrls:  ["https://www.youtube.com/watch?v=WSYT_BaUanA"],
  },

  {
    playerId:   "SABBA_HOSTUMEX",
    clearTime:  "0:05:42",
    uploadTime: "2026-01-11",
    videoUrls:  ["https://www.youtube.com/watch?v=WMEpIEMRbVE"],
  },

  {
    playerId:   "Dusan_UA",
    clearTime:  "0:06:52",
    uploadTime: "2026-05-07",
    videoUrls:  ["https://www.youtube.com/watch?v=ycGey8BMWOo"],
  },

  {
    playerId:   "Salat / L1ndell",
    clearTime:  "0:04:32",
    uploadTime: "2025-12-27",
    videoUrls:  ["https://www.youtube.com/watch?v=9SjKJ6MZdR4"],
  },

  {
    playerId:   "sadkdawu / Fr0z3nTempest",
    clearTime:  "0:07:39",
    uploadTime: "2025-11-29",
    videoUrls:  ["https://www.youtube.com/watch?v=qCYCM4IujR4"],
  },

];

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var victory_plaza_normalNotice_cn = "";
var victory_plaza_normalNotice_en = "";
;
