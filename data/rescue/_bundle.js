/* ════════════════════════════════════════════════════════════
 *  自动生成，请勿手动编辑本文件。
 *  本文件由 .github/scripts/bundle_data.py 把同目录下所有数据源文件
 *  拼接而成，用于减少 HTTP 请求数。要修改成绩数据，请编辑同目录下
 *  对应的单个 <分类>-<节点>.js 源文件，push 后会自动重建本文件。
 * ════════════════════════════════════════════════════════════ */

/* ===== data/rescue/rescue-anthe.js ===== */
/* ════════════════════════════════════════════════════════════
 *  救援 竞速排行榜  /  Rescue Speedrun Leaderboard
 *  数据文件：rescue-anthe.js
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
 *  在下方 rescue_antheRecords 数组中新增一个对象，如：
 *    {
 *      playerId:   "玩家名",
 *      clearTime:  "1:23.456",
 *      uploadTime: "2025-01-01",
 *      videoUrls:  ["https://..."],
 *    },
 * ════════════════════════════════════════════════════════════ */

var rescue_antheRecords = [
  /* 暂无记录 */
];

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var rescue_antheNotice_cn = "";
var rescue_antheNotice_en = "";
;

/* ===== data/rescue/rescue-brugia.js ===== */
/* ════════════════════════════════════════════════════════════
 *  救援 竞速排行榜  /  Rescue Speedrun Leaderboard
 *  数据文件：rescue-brugia.js
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
 *  在下方 rescue_brugiaRecords 数组中新增一个对象，如：
 *    {
 *      playerId:   "玩家名",
 *      clearTime:  "1:23.456",
 *      uploadTime: "2025-01-01",
 *      videoUrls:  ["https://..."],
 *    },
 * ════════════════════════════════════════════════════════════ */

var rescue_brugiaRecords = [
  {
    playerId:   "L1ndell",
    clearTime:  "0:22.917",
    uploadTime: "2026-05-05",
    videoUrls:  ["https://www.youtube.com/watch?v=EAkWuaDiKIU"],
  },
  {
    playerId:   "Salat",
    clearTime:  "0:22.100",
    uploadTime: "2026-06-07",
    videoUrls:  ["https://www.youtube.com/watch?v=UAGi9kinVg0"],
  },
  {
    playerId:   "PrimedDarkeN",
    clearTime:  "0:26.000",
    uploadTime: "2022-06-23",
    videoUrls:  ["https://www.youtube.com/watch?v=E5e5pUexKEg"],
  },
  {
    playerId:   "Wasamii",
    clearTime:  "0:32.000",
    uploadTime: "2025-05-17",
    videoUrls:  ["https://www.youtube.com/watch?v=tjhvE56TbqM"],
  },
  {
    playerId:   "Febi",
    clearTime:  "0:33.000",
    uploadTime: "2021-04-16",
    videoUrls:  ["https://www.youtube.com/watch?v=WU9MWmv8HO0"],
  },
];

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var rescue_brugiaNotice_cn = "";
var rescue_brugiaNotice_en = "";
;

/* ===== data/rescue/rescue-caliban.js ===== */
/* ════════════════════════════════════════════════════════════
 *  救援 竞速排行榜  /  Rescue Speedrun Leaderboard
 *  数据文件：rescue-caliban.js
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
 *  在下方 rescue_calibanRecords 数组中新增一个对象，如：
 *    {
 *      playerId:   "玩家名",
 *      clearTime:  "1:23.456",
 *      uploadTime: "2025-01-01",
 *      videoUrls:  ["https://..."],
 *    },
 * ════════════════════════════════════════════════════════════ */

var rescue_calibanRecords = [
  {
    playerId:   "L1ndell",
    clearTime:  "0:23.083",
    uploadTime: "2025-12-23",
    videoUrls:  ["https://www.youtube.com/watch?v=DFgl5zcvVZ8"],
  },
  {
    playerId:   "Salat",
    clearTime:  "0:20.333",
    uploadTime: "2026-06-25",
    videoUrls:  ["https://www.youtube.com/watch?v=Oeynh5Y3rjc"],
  },
  {
    playerId:   "PrimedDarkeN",
    clearTime:  "0:26.000",
    uploadTime: "2022-06-23",
    videoUrls:  ["https://www.youtube.com/watch?v=QfHQtdHGUIs"],
  },
];

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var rescue_calibanNotice_cn = "";
var rescue_calibanNotice_en = "";
;

/* ===== data/rescue/rescue-caloris.js ===== */
/* ════════════════════════════════════════════════════════════
 *  救援 竞速排行榜  /  Rescue Speedrun Leaderboard
 *  数据文件：rescue-caloris.js
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
 *  在下方 rescue_calorisRecords 数组中新增一个对象，如：
 *    {
 *      playerId:   "玩家名",
 *      clearTime:  "1:23.456",
 *      uploadTime: "2025-01-01",
 *      videoUrls:  ["https://..."],
 *    },
 * ════════════════════════════════════════════════════════════ */

var rescue_calorisRecords = [
  /* 暂无记录 */
];

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var rescue_calorisNotice_cn = "";
var rescue_calorisNotice_en = "";
;

/* ===== data/rescue/rescue-garus.js ===== */
/* ════════════════════════════════════════════════════════════
 *  救援 竞速排行榜  /  Rescue Speedrun Leaderboard
 *  数据文件：rescue-garus.js
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
 *  在下方 rescue_garusRecords 数组中新增一个对象，如：
 *    {
 *      playerId:   "玩家名",
 *      clearTime:  "1:23.456",
 *      uploadTime: "2025-01-01",
 *      videoUrls:  ["https://..."],
 *    },
 * ════════════════════════════════════════════════════════════ */

var rescue_garusRecords = [
  {
    playerId:   "L1ndell",
    clearTime:  "0:21.067",
    uploadTime: "2026-05-26",
    videoUrls:  ["https://www.youtube.com/watch?v=B_49gG68ER4"],
  },
  {
    playerId:   "Salat",
    clearTime:  "0:21.983",
    uploadTime: "2026-05-21",
    videoUrls:  ["https://www.youtube.com/watch?v=xlwjJRZTNTs"],
  },
  {
    playerId:   "PrimedDarkeN",
    clearTime:  "0:28.000",
    uploadTime: "2022-06-23",
    videoUrls:  ["https://www.youtube.com/watch?v=q8jO5iVe8uI"],
  },
];

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var rescue_garusNotice_cn = "";
var rescue_garusNotice_en = "";
;

/* ===== data/rescue/rescue-linea.js ===== */
/* ════════════════════════════════════════════════════════════
 *  救援 竞速排行榜  /  Rescue Speedrun Leaderboard
 *  数据文件：rescue-linea.js
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
 *  在下方 rescue_lineaRecords 数组中新增一个对象，如：
 *    {
 *      playerId:   "玩家名",
 *      clearTime:  "1:23.456",
 *      uploadTime: "2025-01-01",
 *      videoUrls:  ["https://..."],
 *    },
 * ════════════════════════════════════════════════════════════ */

var rescue_lineaRecords = [
  /* 暂无记录 */
];

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var rescue_lineaNotice_cn = "";
var rescue_lineaNotice_en = "";
;

/* ===== data/rescue/rescue-martialis.js ===== */
/* ════════════════════════════════════════════════════════════
 *  救援 竞速排行榜  /  Rescue Speedrun Leaderboard
 *  数据文件：rescue-martialis.js
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
 *  在下方 rescue_martialisRecords 数组中新增一个对象，如：
 *    {
 *      playerId:   "玩家名",
 *      clearTime:  "1:23.456",
 *      uploadTime: "2025-01-01",
 *      videoUrls:  ["https://..."],
 *    },
 * ════════════════════════════════════════════════════════════ */

var rescue_martialisRecords = [
  {
    playerId:   "Salat",
    clearTime:  "0:18.933",
    uploadTime: "2026-06-07",
    videoUrls:  ["https://www.youtube.com/watch?v=dSkEJmqUvJs"],
  },
  {
    playerId:   "PrimedDarkeN",
    clearTime:  "0:25.200",
    uploadTime: "2022-06-26",
    videoUrls:  ["https://www.youtube.com/watch?v=IZdrpT-F2fY"],
  },
  {
    playerId:   "L1ndell",
    clearTime:  "0:25.267",
    uploadTime: "2022-11-11",
    videoUrls:  ["https://www.youtube.com/watch?v=HMRo1zOrO3w"],
  },
  {
    playerId:   "RoniPrime",
    clearTime:  "0:25.900",
    uploadTime: "2025-12-21",
    videoUrls:  ["https://www.youtube.com/watch?v=-D8EbquA9tY"],
  },
  {
    playerId:   "Febi",
    clearTime:  "0:30.000",
    uploadTime: "2022-01-08",
    videoUrls:  ["https://www.youtube.com/watch?v=wz56OH2c1a8"],
  },
];

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var rescue_martialisNotice_cn = "";
var rescue_martialisNotice_en = "";
;

/* ===== data/rescue/rescue-metis.js ===== */
/* ════════════════════════════════════════════════════════════
 *  救援 竞速排行榜  /  Rescue Speedrun Leaderboard
 *  数据文件：rescue-metis.js
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
 *  在下方 rescue_metisRecords 数组中新增一个对象，如：
 *    {
 *      playerId:   "玩家名",
 *      clearTime:  "1:23.456",
 *      uploadTime: "2025-01-01",
 *      videoUrls:  ["https://..."],
 *    },
 * ════════════════════════════════════════════════════════════ */

var rescue_metisRecords = [
  {
    playerId:   "Salat",
    clearTime:  "0:32.317",
    uploadTime: "2026-06-27",
    videoUrls:  ["https://www.youtube.com/watch?v=KVlpZpbt8To"],
  },
  {
    playerId:   "L1ndell",
    clearTime:  "0:36.000",
    uploadTime: "2022-03-26",
    videoUrls:  ["https://www.youtube.com/watch?v=KuEDD7EeQXM"],
  },
  {
    playerId:   "Mortar",
    clearTime:  "0:37.000",
    uploadTime: "2021-02-10",
    videoUrls:  ["https://www.youtube.com/watch?v=z_4suc1WHPM"],
  },
];

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var rescue_metisNotice_cn = "";
var rescue_metisNotice_en = "";
;

/* ===== data/rescue/rescue-monolith.js ===== */
/* ════════════════════════════════════════════════════════════
 *  救援 竞速排行榜  /  Rescue Speedrun Leaderboard
 *  数据文件：rescue-monolith.js
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
 *  在下方 rescue_monolithRecords 数组中新增一个对象，如：
 *    {
 *      playerId:   "玩家名",
 *      clearTime:  "1:23.456",
 *      uploadTime: "2025-01-01",
 *      videoUrls:  ["https://..."],
 *    },
 * ════════════════════════════════════════════════════════════ */

var rescue_monolithRecords = [
  /* 暂无记录 */
];

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var rescue_monolithNotice_cn = "";
var rescue_monolithNotice_en = "";
;

/* ===== data/rescue/rescue-naga.js ===== */
/* ════════════════════════════════════════════════════════════
 *  救援 竞速排行榜  /  Rescue Speedrun Leaderboard
 *  数据文件：rescue-naga.js
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
 *  在下方 rescue_nagaRecords 数组中新增一个对象，如：
 *    {
 *      playerId:   "玩家名",
 *      clearTime:  "1:23.456",
 *      uploadTime: "2025-01-01",
 *      videoUrls:  ["https://..."],
 *    },
 * ════════════════════════════════════════════════════════════ */

var rescue_nagaRecords = [
  {
    playerId:   "Salat",
    clearTime:  "0:23.933",
    uploadTime: "2025-11-24",
    videoUrls:  ["https://www.youtube.com/watch?v=k5OTeGtxQIs"],
  },
  {
    playerId:   "L1ndell",
    clearTime:  "0:24.400",
    uploadTime: "2025-11-22",
    videoUrls:  ["https://www.youtube.com/watch?v=u9zAuFtyehY"],
  },
  {
    playerId:   "PrimedDarkeN",
    clearTime:  "0:29.000",
    uploadTime: "2022-06-28",
    videoUrls:  ["https://www.youtube.com/watch?v=oVYm0aSmB4o"],
  },
];

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var rescue_nagaNotice_cn = "";
var rescue_nagaNotice_en = "";
;

/* ===== data/rescue/rescue-numa.js ===== */
/* ════════════════════════════════════════════════════════════
 *  救援 竞速排行榜  /  Rescue Speedrun Leaderboard
 *  数据文件：rescue-numa.js
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
 *  在下方 rescue_numaRecords 数组中新增一个对象，如：
 *    {
 *      playerId:   "玩家名",
 *      clearTime:  "1:23.456",
 *      uploadTime: "2025-01-01",
 *      videoUrls:  ["https://..."],
 *    },
 * ════════════════════════════════════════════════════════════ */

var rescue_numaRecords = [
  {
    playerId:   "Salat",
    clearTime:  "0:24.683",
    uploadTime: "2026-06-15",
    videoUrls:  ["https://www.youtube.com/watch?v=b0zBPXF7Lro"],
  },
  {
    playerId:   "L1ndell",
    clearTime:  "0:30.000",
    uploadTime: "2022-08-02",
    videoUrls:  ["https://www.youtube.com/watch?v=GotjjGk7iQw"],
  },
  {
    playerId:   "Salat / L1ndell",
    clearTime:  "0:30.000",
    uploadTime: "2025-12-21",
    videoUrls:  [
      "https://www.youtube.com/watch?v=uw5f_yHnNPQ",
      "https://www.youtube.com/watch?v=35HM0fEqFIg"
    ],
  },
];

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var rescue_numaNotice_cn = "";
var rescue_numaNotice_en = "";
;

/* ===== data/rescue/rescue-nuovo.js ===== */
/* ════════════════════════════════════════════════════════════
 *  救援 竞速排行榜  /  Rescue Speedrun Leaderboard
 *  数据文件：rescue-nuovo.js
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
 *  在下方 rescue_nuovoRecords 数组中新增一个对象，如：
 *    {
 *      playerId:   "玩家名",
 *      clearTime:  "1:23.456",
 *      uploadTime: "2025-01-01",
 *      videoUrls:  ["https://..."],
 *    },
 * ════════════════════════════════════════════════════════════ */

var rescue_nuovoRecords = [
  {
    playerId:   "Salat",
    clearTime:  "0:19.550",
    uploadTime: "2025-10-09",
    videoUrls:  ["https://www.youtube.com/watch?v=ts7LwIkbWf8"],
  },
  {
    playerId:   "L1ndell",
    clearTime:  "0:24.000",
    uploadTime: "2022-08-02",
    videoUrls:  ["https://www.youtube.com/watch?v=1RXGFJlA7-k"],
  },
  {
    playerId:   "PrimedDarkeN",
    clearTime:  "0:26.000",
    uploadTime: "2022-06-28",
    videoUrls:  ["https://www.youtube.com/watch?v=vms0P7IK3RE"],
  },
];

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var rescue_nuovoNotice_cn = "";
var rescue_nuovoNotice_en = "";
;

/* ===== data/rescue/rescue-orias.js ===== */
/* ════════════════════════════════════════════════════════════
 *  救援 竞速排行榜  /  Rescue Speedrun Leaderboard
 *  数据文件：rescue-orias.js
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
 *  在下方 rescue_oriasRecords 数组中新增一个对象，如：
 *    {
 *      playerId:   "玩家名",
 *      clearTime:  "1:23.456",
 *      uploadTime: "2025-01-01",
 *      videoUrls:  ["https://..."],
 *    },
 * ════════════════════════════════════════════════════════════ */

var rescue_oriasRecords = [
  {
    playerId:   "Salat",
    clearTime:  "0:11.700",
    uploadTime: "2026-06-24",
    videoUrls:  ["https://www.youtube.com/watch?v=aFtNjyklIEI"],
  },
  {
    playerId:   "L1ndell",
    clearTime:  "0:15.000",
    uploadTime: "2022-03-27",
    videoUrls:  ["https://www.youtube.com/watch?v=XRuYPBroCsY"],
  },
  {
    playerId:   "PrimedDarkeN",
    clearTime:  "0:16.000",
    uploadTime: "2021-06-16",
    videoUrls:  ["https://www.youtube.com/watch?v=2xtAbbAZikc"],
  },
];

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var rescue_oriasNotice_cn = "";
var rescue_oriasNotice_en = "";
;

/* ===== data/rescue/rescue-pacific.js ===== */
/* ════════════════════════════════════════════════════════════
 *  救援 竞速排行榜  /  Rescue Speedrun Leaderboard
 *  数据文件：rescue-pacific.js
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
 *  在下方 rescue_pacificRecords 数组中新增一个对象，如：
 *    {
 *      playerId:   "玩家名",
 *      clearTime:  "1:23.456",
 *      uploadTime: "2025-01-01",
 *      videoUrls:  ["https://..."],
 *    },
 * ════════════════════════════════════════════════════════════ */

var rescue_pacificRecords = [

];

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var rescue_pacificNotice_cn = "";
var rescue_pacificNotice_en = "";
;

/* ===== data/rescue/rescue-regna.js ===== */
/* ════════════════════════════════════════════════════════════
 *  救援 竞速排行榜  /  Rescue Speedrun Leaderboard
 *  数据文件：rescue-regna.js
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
 *  在下方 rescue_regnaRecords 数组中新增一个对象，如：
 *    {
 *      playerId:   "玩家名",
 *      clearTime:  "1:23.456",
 *      uploadTime: "2025-01-01",
 *      videoUrls:  ["https://..."],
 *    },
 * ════════════════════════════════════════════════════════════ */

var rescue_regnaRecords = [

  {
    playerId:   "Salat",
    clearTime:  "0:21.250",
    uploadTime: "2025-11-14",
    videoUrls:  ["https://www.youtube.com/watch?v=jQGGFXZcFW0"],
  },
  {
    playerId:   "L1ndell",
    clearTime:  "0:25.000",
    uploadTime: "2022-08-01",
    videoUrls:  ["https://www.youtube.com/watch?v=BICQQ99J8Bk"],
  },
  {
    playerId:   "Salat",
    clearTime:  "0:19.733",
    uploadTime: "2026-06-06",
    videoUrls:  ["https://www.youtube.com/watch?v=EeOFKCebZss"],
  },
];

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var rescue_regnaNotice_cn = "";
var rescue_regnaNotice_en = "";
;

/* ===== data/rescue/rescue-triton.js ===== */
/* ════════════════════════════════════════════════════════════
 *  救援 竞速排行榜  /  Rescue Speedrun Leaderboard
 *  数据文件：rescue-triton.js
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
 *  在下方 rescue_tritonRecords 数组中新增一个对象，如：
 *    {
 *      playerId:   "玩家名",
 *      clearTime:  "1:23.456",
 *      uploadTime: "2025-01-01",
 *      videoUrls:  ["https://..."],
 *    },
 * ════════════════════════════════════════════════════════════ */

var rescue_tritonRecords = [
  {
    playerId:   "L1ndell",
    clearTime:  "0:16.383",
    uploadTime: "2026-05-30",
    videoUrls:  ["https://www.youtube.com/watch?v=NFLXoqv1Wys"],
  },
  {
    playerId:   "Salat",
    clearTime:  "0:18.116",
    uploadTime: "2025-11-25",
    videoUrls:  ["https://www.youtube.com/watch?v=1YoTcCrD-U4"],
  },
];

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var rescue_tritonNotice_cn = "";
var rescue_tritonNotice_en = "";
;

/* ===== data/rescue/rescue-zeipel.js ===== */
/* ════════════════════════════════════════════════════════════
 *  救援 竞速排行榜  /  Rescue Speedrun Leaderboard
 *  数据文件：rescue-zeipel.js
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
 *  在下方 rescue_zeipelRecords 数组中新增一个对象，如：
 *    {
 *      playerId:   "玩家名",
 *      clearTime:  "1:23.456",
 *      uploadTime: "2025-01-01",
 *      videoUrls:  ["https://..."],
 *    },
 * ════════════════════════════════════════════════════════════ */

var rescue_zeipelRecords = [
  {
    playerId:   "L1ndell",
    clearTime:  "0:26.000",
    uploadTime: "2026-05-13",
    videoUrls:  ["https://www.youtube.com/watch?v=JvxJaNjzeqQ"],
  },
  {
    playerId:   "Salat",
    clearTime:  "0:29.000",
    uploadTime: "2026-05-07",
    videoUrls:  ["https://www.youtube.com/watch?v=Zzn4BzFQBOU"],
  },
];

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var rescue_zeipelNotice_cn = "";
var rescue_zeipelNotice_en = "";
;
