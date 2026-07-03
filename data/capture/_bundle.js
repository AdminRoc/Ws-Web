/* ════════════════════════════════════════════════════════════
 *  自动生成，请勿手动编辑本文件。
 *  本文件由 .github/scripts/bundle_data.py 把同目录下所有数据源文件
 *  拼接而成，用于减少 HTTP 请求数。要修改成绩数据，请编辑同目录下
 *  对应的单个 <分类>-<节点>.js 源文件，push 后会自动重建本文件。
 * ════════════════════════════════════════════════════════════ */

/* ===== data/capture/capture-abaddon.js ===== */
/* ════════════════════════════════════════════════════════════
 *  捕获 竞速排行榜  /  Capture Speedrun Leaderboard
 *  数据文件：capture-abaddon.js
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
 *  在下方 capture_abaddonRecords 数组中新增一个对象，如：
 *    {
 *      playerId:   "玩家名",
 *      clearTime:  "1:23.456",
 *      uploadTime: "2025-01-01",
 *      videoUrls:  ["https://..."],
 *    },
 * ════════════════════════════════════════════════════════════ */

var capture_abaddonRecords = [

  {
    playerId:   "Salat",
    clearTime:  "0:18.667",
    uploadTime: "2025-03-04",
    videoUrls:  ["https://www.youtube.com/watch?v=Rki7F6QXba4"],
  },
  {
    playerId:   "Mortar",
    clearTime:  "0:21.933",
    uploadTime: "2021-01-25",
    videoUrls:  ["https://www.youtube.com/watch?v=ctl3ew4dUaw"],
  },
  {
    playerId:   "L1ndell",
    clearTime:  "0:22.183",
    uploadTime: "2022-03-08",
    videoUrls:  ["https://www.youtube.com/watch?v=HwTsH8l07T8"],
  },


];

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var capture_abaddonNotice_cn = "";
var capture_abaddonNotice_en = "";
;

/* ===== data/capture/capture-ananke.js ===== */
/* ════════════════════════════════════════════════════════════
 *  捕获 竞速排行榜  /  Capture Speedrun Leaderboard
 *  数据文件：capture-ananke.js
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
 *  在下方 capture_anankeRecords 数组中新增一个对象，如：
 *    {
 *      playerId:   "玩家名",
 *      clearTime:  "1:23.456",
 *      uploadTime: "2025-01-01",
 *      videoUrls:  ["https://..."],
 *    },
 * ════════════════════════════════════════════════════════════ */

var capture_anankeRecords = [
  {
    playerId:   "Mortar",
    clearTime:  "0:17.733",
    uploadTime: "2024-03-17",
    videoUrls:  ["https://www.youtube.com/watch?v=D2y8ZhYY5So"],
  },
  {
    playerId:   "L1ndell",
    clearTime:  "0:19.583",
    uploadTime: "2022-03-05",
    videoUrls:  ["https://www.youtube.com/watch?v=Y7h3Kq9r3iM"],
  },
  {
    playerId:   "Txdo",
    clearTime:  "0:20.300",
    uploadTime: "2024-03-05",
    videoUrls:  ["https://www.youtube.com/watch?v=QUnusKryTy0"],
  },
  {
    playerId:   "Salat",
    clearTime:  "0:17.617",
    uploadTime: "2026-06-10",
    videoUrls:  ["https://www.youtube.com/watch?v=mEN2xiMisHc"],
  },
];

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var capture_anankeNotice_cn = "";
var capture_anankeNotice_en = "";
;

/* ===== data/capture/capture-ara.js ===== */
/* ════════════════════════════════════════════════════════════
 *  捕获 竞速排行榜  /  Capture Speedrun Leaderboard
 *  数据文件：capture-ara.js
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
 *  在下方 capture_araRecords 数组中新增一个对象，如：
 *    {
 *      playerId:   "玩家名",
 *      clearTime:  "1:23.456",
 *      uploadTime: "2025-01-01",
 *      videoUrls:  ["https://..."],
 *    },
 * ════════════════════════════════════════════════════════════ */

var capture_araRecords = [
  {
    playerId:   "Salat",
    clearTime:  "0:15.067",
    uploadTime: "2025-09-29",
    videoUrls:  ["https://www.youtube.com/watch?v=cWNspYpqbuE"],
  },
  {
    playerId:   "L1ndell",
    clearTime:  "0:15.767",
    uploadTime: "2022-05-30",
    videoUrls:  ["https://www.youtube.com/watch?v=dBwkgrxeeAE"],
  },
  {
    playerId:   "Mortar",
    clearTime:  "0:16.967",
    uploadTime: "2021-02-28",
    videoUrls:  ["https://www.youtube.com/watch?v=Gj5wy66O6uo"],
  },
];

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var capture_araNotice_cn = "";
var capture_araNotice_en = "";
;

/* ===== data/capture/capture-ariel.js ===== */
/* ════════════════════════════════════════════════════════════
 *  捕获 竞速排行榜  /  Capture Speedrun Leaderboard
 *  数据文件：capture-ariel.js
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
 *  在下方 capture_arielRecords 数组中新增一个对象，如：
 *    {
 *      playerId:   "玩家名",
 *      clearTime:  "1:23.456",
 *      uploadTime: "2025-01-01",
 *      videoUrls:  ["https://..."],
 *    },
 * ════════════════════════════════════════════════════════════ */

var capture_arielRecords = [

  {
    playerId:   "Salat",
    clearTime:  "0:23.400",
    uploadTime: "2025-12-29",
    videoUrls:  ["https://www.youtube.com/watch?v=gCtM0lbzaWk"],
  },
  {
    playerId:   "Mortar",
    clearTime:  "0:24.100",
    uploadTime: "2024-01-25",
    videoUrls:  ["https://www.youtube.com/watch?v=4MRBb6P5SKQ"],
  },
  {
    playerId:   "L1ndell",
    clearTime:  "0:25.850",
    uploadTime: "2022-04-03",
    videoUrls:  ["https://www.youtube.com/watch?v=XqP7mi_R2VI"],
  },
];

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var capture_arielNotice_cn = "";
var capture_arielNotice_en = "";
;

/* ===== data/capture/capture-cassini.js ===== */
/* ════════════════════════════════════════════════════════════
 *  捕获 竞速排行榜  /  Capture Speedrun Leaderboard
 *  数据文件：capture-cassini.js
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
 *  在下方 capture_cassiniRecords 数组中新增一个对象，如：
 *    {
 *      playerId:   "玩家名",
 *      clearTime:  "1:23.456",
 *      uploadTime: "2025-01-01",
 *      videoUrls:  ["https://..."],
 *    },
 * ════════════════════════════════════════════════════════════ */

var capture_cassiniRecords = [

  {
    playerId:   "Salat",
    clearTime:  "0:18.433",
    uploadTime: "2025-11-26",
    videoUrls:  ["https://www.youtube.com/watch?v=cATuVBHQd84"],
  },
  {
    playerId:   "L1ndell",
    clearTime:  "0:19.267",
    uploadTime: "2021-11-18",
    videoUrls:  ["https://www.youtube.com/watch?v=n_TK1ViSP2w"],
  },
  {
    playerId:   "Mortar",
    clearTime:  "0:20.933",
    uploadTime: "2021-01-20",
    videoUrls:  ["https://www.youtube.com/watch?v=69DdM6vhXQs"],
  },
  {
    playerId:   "FrostMainer",
    clearTime:  "0:25.000",
    uploadTime: "2026-06-10",
    videoUrls:  ["https://www.youtube.com/watch?v=cBht9QzIUrw"],
  },

];

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var capture_cassiniNotice_cn = "";
var capture_cassiniNotice_en = "";
;

/* ===== data/capture/capture-copernicus.js ===== */
/* ════════════════════════════════════════════════════════════
 *  捕获 竞速排行榜  /  Capture Speedrun Leaderboard
 *  数据文件：capture-copernicus.js
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
 *  在下方 capture_copernicusRecords 数组中新增一个对象，如：
 *    {
 *      playerId:   "玩家名",
 *      clearTime:  "1:23.456",
 *      uploadTime: "2025-01-01",
 *      videoUrls:  ["https://..."],
 *    },
 * ════════════════════════════════════════════════════════════ */

var capture_copernicusRecords = [

  {
    playerId:   "Salat",
    clearTime:  "0:15.850",
    uploadTime: "2026-03-11",
    videoUrls:  ["https://www.youtube.com/watch?v=wJOgoRMloZ8"],
  },
  {
    playerId:   "Mortar",
    clearTime:  "0:16.683",
    uploadTime: "2024-01-31",
    videoUrls:  ["https://www.youtube.com/watch?v=H5X23drfecE"],
  },
  {
    playerId:   "FXCloud",
    clearTime:  "0:16.856",
    uploadTime: "2025-11-26",
    videoUrls:  ["https://wfspeed.run/unavailable.html"],
  },
];

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var capture_copernicusNotice_cn = "";
var capture_copernicusNotice_en = "";
;

/* ===== data/capture/capture-elion.js ===== */
/* ════════════════════════════════════════════════════════════
 *  捕获 竞速排行榜  /  Capture Speedrun Leaderboard
 *  数据文件：capture-elion.js
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
 *  在下方 capture_elionRecords 数组中新增一个对象，如：
 *    {
 *      playerId:   "玩家名",
 *      clearTime:  "1:23.456",
 *      uploadTime: "2025-01-01",
 *      videoUrls:  ["https://..."],
 *    },
 * ════════════════════════════════════════════════════════════ */

var capture_elionRecords = [

  {
    playerId:   "Salat",
    clearTime:  "0:16.633",
    uploadTime: "2026-06-13",
    videoUrls:  ["https://www.youtube.com/watch?v=RF5Jtfa_DYs"],
  },
  {
    playerId:   "L1ndell",
    clearTime:  "0:19.467",
    uploadTime: "2023-01-08",
    videoUrls:  ["https://www.youtube.com/watch?v=k4P4Ud3jBUM"],
  },
  {
    playerId:   "Mortar",
    clearTime:  "0:20.833",
    uploadTime: "2020-09-28",
    videoUrls:  ["https://www.youtube.com/watch?v=WzNMzSCiYMU"],
  },
];

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var capture_elionNotice_cn = "";
var capture_elionNotice_en = "";
;

/* ===== data/capture/capture-galatea.js ===== */
/* ════════════════════════════════════════════════════════════
 *  捕获 竞速排行榜  /  Capture Speedrun Leaderboard
 *  数据文件：capture-galatea.js
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
 *  在下方 capture_galateaRecords 数组中新增一个对象，如：
 *    {
 *      playerId:   "玩家名",
 *      clearTime:  "1:23.456",
 *      uploadTime: "2025-01-01",
 *      videoUrls:  ["https://..."],
 *    },
 * ════════════════════════════════════════════════════════════ */

var capture_galateaRecords = [

  {
    playerId:   "Salat",
    clearTime:  "0:16.866",
    uploadTime: "2025-12-24",
    videoUrls:  ["https://www.youtube.com/watch?v=pvPF-OLcwXo"],
  },
  {
    playerId:   "L1ndell",
    clearTime:  "0:19.917",
    uploadTime: "2022-03-09",
    videoUrls:  ["https://www.youtube.com/watch?v=h0H8RF9O-Qw"],
  },
  {
    playerId:   "Mortar",
    clearTime:  "0:19.933",
    uploadTime: "2021-01-25",
    videoUrls:  ["https://www.youtube.com/watch?v=R_2L-eWMPeE"],
  },
];

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var capture_galateaNotice_cn = "";
var capture_galateaNotice_en = "";
;

/* ===== data/capture/capture-hepit.js ===== */
/* ════════════════════════════════════════════════════════════
 *  捕获 竞速排行榜  /  Capture Speedrun Leaderboard
 *  数据文件：capture-hepit.js
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
 *  在下方 capture_hepitRecords 数组中新增一个对象，如：
 *    {
 *      playerId:   "玩家名",
 *      clearTime:  "1:23.456",
 *      uploadTime: "2025-01-01",
 *      videoUrls:  ["https://..."],
 *    },
 * ════════════════════════════════════════════════════════════ */

var capture_hepitRecords = [
  /* 暂无记录 */
];

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var capture_hepitNotice_cn = "";
var capture_hepitNotice_en = "";
;

/* ===== data/capture/capture-horend.js ===== */
/* ════════════════════════════════════════════════════════════
 *  捕获 竞速排行榜  /  Capture Speedrun Leaderboard
 *  数据文件：capture-horend.js
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
 *  在下方 capture_horendRecords 数组中新增一个对象，如：
 *    {
 *      playerId:   "玩家名",
 *      clearTime:  "1:23.456",
 *      uploadTime: "2025-01-01",
 *      videoUrls:  ["https://..."],
 *    },
 * ════════════════════════════════════════════════════════════ */

var capture_horendRecords = [

  {
    playerId:   "Salat",
    clearTime:  "0:12.800",
    uploadTime: "2025-06-09",
    videoUrls:  ["https://www.youtube.com/watch?v=crHFAYH4PeY"],
  },
  {
    playerId:   "Mortar",
    clearTime:  "0:13.733",
    uploadTime: "2021-03-04",
    videoUrls:  ["https://www.youtube.com/watch?v=BVBnOdcvaXk"],
  },
  {
    playerId:   "L1ndell",
    clearTime:  "0:16.050",
    uploadTime: "2022-01-18",
    videoUrls:  ["https://www.youtube.com/watch?v=iQ0otnZgdC4"],
  },
];

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var capture_horendNotice_cn = "";
var capture_horendNotice_en = "";
;

/* ===== data/capture/capture-hydra.js ===== */
/* ════════════════════════════════════════════════════════════
 *  捕获 竞速排行榜  /  Capture Speedrun Leaderboard
 *  数据文件：capture-hydra.js
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
 *  在下方 capture_hydraRecords 数组中新增一个对象，如：
 *    {
 *      playerId:   "玩家名",
 *      clearTime:  "1:23.456",
 *      uploadTime: "2025-01-01",
 *      videoUrls:  ["https://..."],
 *    },
 * ════════════════════════════════════════════════════════════ */

var capture_hydraRecords = [

  {
    playerId:   "Salat",
    clearTime:  "0:17.883",
    uploadTime: "2025-10-28",
    videoUrls:  ["https://www.youtube.com/watch?v=Y9waylBru3M"],
  },
  {
    playerId:   "L1ndell",
    clearTime:  "0:17.967",
    uploadTime: "2023-01-23",
    videoUrls:  ["https://www.youtube.com/watch?v=AZ0iIG8kQ5s"],
  },
  {
    playerId:   "PrimedDarkeN",
    clearTime:  "0:19.167",
    uploadTime: "2021-07-06",
    videoUrls:  ["https://www.youtube.com/watch?v=Mm8qwI_VDpI"],
  },
];

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var capture_hydraNotice_cn = "";
var capture_hydraNotice_en = "";
;

/* ===== data/capture/capture-isos.js ===== */
/* ════════════════════════════════════════════════════════════
 *  捕获 竞速排行榜  /  Capture Speedrun Leaderboard
 *  数据文件：capture-isos.js
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
 *  在下方 capture_isosRecords 数组中新增一个对象，如：
 *    {
 *      playerId:   "玩家名",
 *      clearTime:  "1:23.456",
 *      uploadTime: "2025-01-01",
 *      videoUrls:  ["https://..."],
 *    },
 * ════════════════════════════════════════════════════════════ */

var capture_isosRecords = [

  {
    playerId:   "Salat",
    clearTime:  "0:20.517",
    uploadTime: "2026-06-09",
    videoUrls:  ["https://www.youtube.com/watch?v=_c9DC9nPnig"],
  },
  {
    playerId:   "Mortar",
    clearTime:  "0:21.733",
    uploadTime: "2021-03-07",
    videoUrls:  ["https://www.youtube.com/watch?v=MjdROzRLVfA"],
  },
  {
    playerId:   "L1ndell",
    clearTime:  "0:25.033",
    uploadTime: "2021-11-07",
    videoUrls:  ["https://www.youtube.com/watch?v=3jX2ZH2EL44"],
  },
  {
    playerId:   "Hera4v",
    clearTime:  "0:20.517",
    uploadTime: "2026-07-03",
    videoUrls:  ["https://www.youtube.com/watch?v=g7FnYl3mhmo"],
  },
];

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var capture_isosNotice_cn = "";
var capture_isosNotice_en = "";
;

/* ===== data/capture/capture-kobinn-west.js ===== */
/* ════════════════════════════════════════════════════════════
 *  捕获 竞速排行榜  /  Capture Speedrun Leaderboard
 *  数据文件：capture-kobinn-west.js
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
 *  在下方 capture_kobinn_westRecords 数组中新增一个对象，如：
 *    {
 *      playerId:   "玩家名",
 *      clearTime:  "1:23.456",
 *      uploadTime: "2025-01-01",
 *      videoUrls:  ["https://..."],
 *    },
 * ════════════════════════════════════════════════════════════ */

var capture_kobinn_westRecords = [
  /* 暂无记录 */
];

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var capture_kobinn_westNotice_cn = "";
var capture_kobinn_westNotice_en = "";
;

/* ===== data/capture/capture-lex.js ===== */
/* ════════════════════════════════════════════════════════════
 *  捕获 竞速排行榜  /  Capture Speedrun Leaderboard
 *  数据文件：capture-lex.js
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
 *  在下方 capture_lexRecords 数组中新增一个对象，如：
 *    {
 *      playerId:   "玩家名",
 *      clearTime:  "1:23.456",
 *      uploadTime: "2025-01-01",
 *      videoUrls:  ["https://..."],
 *    },
 * ════════════════════════════════════════════════════════════ */

var capture_lexRecords = [

  {
    playerId:   "Salat",
    clearTime:  "0:11.467",
    uploadTime: "2026-02-16",
    videoUrls:  ["https://www.youtube.com/watch?v=Hsj9pY5h_UY"],
  },
  {
    playerId:   "Mortar",
    clearTime:  "0:12.367",
    uploadTime: "2024-04-04",
    videoUrls:  ["https://www.youtube.com/watch?v=5TpqORNKBDs"],
  },
];

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var capture_lexNotice_cn = "";
var capture_lexNotice_en = "";
;

/* ===== data/capture/capture-mantle.js ===== */
/* ════════════════════════════════════════════════════════════
 *  捕获 竞速排行榜  /  Capture Speedrun Leaderboard
 *  数据文件：capture-mantle.js
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
 *  在下方 capture_mantleRecords 数组中新增一个对象，如：
 *    {
 *      playerId:   "玩家名",
 *      clearTime:  "1:23.456",
 *      uploadTime: "2025-01-01",
 *      videoUrls:  ["https://..."],
 *    },
 * ════════════════════════════════════════════════════════════ */

var capture_mantleRecords = [

  {
  playerId:   "Salat",
  clearTime:  "0:12.966",
  uploadTime: "2025-10-27",
  videoUrls:  ["https://www.youtube.com/watch?v=ebYdIqf7iTg"],
},
{
  playerId:   "Mortar",
  clearTime:  "0:13.933",
  uploadTime: "2022-05-30",
  videoUrls:  ["https://www.youtube.com/watch?v=aXJW0KLRqK0"],
},
{
  playerId:   "OgvDams",
  clearTime:  "0:14.707",
  uploadTime: "2024-01-07",
  videoUrls:  ["https://www.youtube.com/watch?v=5zjxGEhNJmQ"],
},
];

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var capture_mantleNotice_cn = "";
var capture_mantleNotice_en = "";
;

/* ===== data/capture/capture-skyresh.js ===== */
/* ════════════════════════════════════════════════════════════
 *  捕获 竞速排行榜  /  Capture Speedrun Leaderboard
 *  数据文件：capture-skyresh.js
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
 *  在下方 capture_skyreshRecords 数组中新增一个对象，如：
 *    {
 *      playerId:   "玩家名",
 *      clearTime:  "1:23.456",
 *      uploadTime: "2025-01-01",
 *      videoUrls:  ["https://..."],
 *    },
 * ════════════════════════════════════════════════════════════ */

var capture_skyreshRecords = [
  /* 暂无记录 */
];

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var capture_skyreshNotice_cn = "";
var capture_skyreshNotice_en = "";
;

/* ===== data/capture/capture-ukko.js ===== */
/* ════════════════════════════════════════════════════════════
 *  捕获 竞速排行榜  /  Capture Speedrun Leaderboard
 *  数据文件：capture-ukko.js
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
 *  在下方 capture_ukkoRecords 数组中新增一个对象，如：
 *    {
 *      playerId:   "玩家名",
 *      clearTime:  "1:23.456",
 *      uploadTime: "2025-01-01",
 *      videoUrls:  ["https://..."],
 *    },
 * ════════════════════════════════════════════════════════════ */

var capture_ukkoRecords = [

  {
    playerId:   "PrimedDarkeN",
    clearTime:  "0:15.033",
    uploadTime: "2023-10-12",
    videoUrls:  ["https://www.youtube.com/watch?v=8R0e3DngN4s"],
  },
  {
    playerId:   "AresWrath562",
    clearTime:  "0:15.067",
    uploadTime: "2025-04-28",
    videoUrls:  ["https://www.youtube.com/watch?v=aEBBgbnQMYs"],
  },
  {
    playerId:   "OgvDams",
    clearTime:  "0:15.467",
    uploadTime: "2024-03-17",
    videoUrls:  ["https://www.youtube.com/watch?v=IYZVNXvWbNI"],
  },
  {
    playerId:   "Endryx_Ow",
    clearTime:  "0:14.483",
    uploadTime: "2026-05-05",
    videoUrls:  ["https://www.youtube.com/watch?v=bUbV3RATLC8"],
  },
];

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var capture_ukkoNotice_cn = "";
var capture_ukkoNotice_en = "";
;

/* ===== data/capture/capture-venera.js ===== */
/* ════════════════════════════════════════════════════════════
 *  捕获 竞速排行榜  /  Capture Speedrun Leaderboard
 *  数据文件：capture-venera.js
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
 *  在下方 capture_veneraRecords 数组中新增一个对象，如：
 *    {
 *      playerId:   "玩家名",
 *      clearTime:  "1:23.456",
 *      uploadTime: "2025-01-01",
 *      videoUrls:  ["https://..."],
 *    },
 * ════════════════════════════════════════════════════════════ */

var capture_veneraRecords = [
  /* 暂无记录 */
];

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var capture_veneraNotice_cn = "";
var capture_veneraNotice_en = "";
;
