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
  {
    playerId:   "Hera4v",
    clearTime:  "0:21.050",
    uploadTime: "2026-07-04",
    videoUrls:  ["https://www.youtube.com/watch?v=gYopFbIKMx4"],
  },

];

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var capture_abaddonNotice_cn = "";
var capture_abaddonNotice_en = "";
