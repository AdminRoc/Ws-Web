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
