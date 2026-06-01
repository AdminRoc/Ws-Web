/* ════════════════════════════════════════════════════════════
 *  救援 竞速排行榜  /  Rescue Speedrun Leaderboard
 *  数据文件：rescue-naga.js
 *  ┌──────────────────────────────────────────────────────┐
 *  │  字段说明：                                          │
 *  │    playerId  —— 玩家 ID（昵称）                      │
 *  │    clearTime —— 结算时间（格式：mm:ss.ms）            │
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
