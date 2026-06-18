/* ════════════════════════════════════════════════════════════
 *  霍瓦尼亚摩托车比赛 竞速排行榜  /  Ollie's Crash Course Speedrun Leaderboard
 *  数据文件：special-challenge-ollies-crash-course.js
 *  ┌──────────────────────────────────────────────────────┐
 *  │  字段说明：                                          │
 *  │    playerId  —— 玩家 ID（昵称）                      │
 *  │    clearTime —— 时间（格式：mm:ss.ms）               │
 *  │    uploadTime—— 成绩提交时间（格式：YYYY-MM-DD）      │
 *  │    videoUrls —— 视频链接数组；最多4个视角             │
 *  │                 ["url1","url2",...]                   │
 *  │  排名规则：脚本按 clearTime 从小到大自动排序          │
 *  └──────────────────────────────────────────────────────┘
 *
 *  添加/修改记录方法：
 *  在下方 ollies_crash_courseRecords 数组中新增一个对象，如：
 *    {
 *      playerId:   "玩家名",
 *      clearTime:  "1:23.456",
 *      uploadTime: "2025-01-01",
 *      videoUrls:  ["https://..."],
 *    },
 * ════════════════════════════════════════════════════════════ */

var ollies_crash_courseRecords = [
  {
    playerId:   "brownswagoverlord",
    clearTime:  "0:14.490",
    uploadTime: "2026-06-17",
    videoUrls:  ["https://www.youtube.com/watch?v=Xof55kGBcVU"],
  },
  {
    playerId:   "r00t_b33r",
    clearTime:  "0:42.470",
    uploadTime: "2026-04-29",
    videoUrls:  ["https://www.youtube.com/watch?v=FESuqUvXTms"],
  },
  {
    playerId:   "Dolfy45",
    clearTime:  "0:58.060",
    uploadTime: "2026-01-11",
    videoUrls:  ["https://www.youtube.com/watch?v=taew0JU0aaU"],
  },
  {
    playerId:   "RoniPrime",
    clearTime:  "1:40.630",
    uploadTime: "2025-10-07",
    videoUrls:  ["https://www.youtube.com/watch?v=Ghs4eejAOjU"],
  },
];

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var ollies_crash_courseNotice_cn = "";
var ollies_crash_courseNotice_en = "";
