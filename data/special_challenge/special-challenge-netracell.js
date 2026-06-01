/* ════════════════════════════════════════════════════════════
 *  衰退室 竞速排行榜  /  Netracell Speedrun Leaderboard
 *  数据文件：netracell.js
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
 *  在下方 netracellRecords 数组中新增一个对象，如：
 *    {
 *      playerId:   "玩家名",
 *      clearTime:  "1:23.456",
 *      uploadTime: "2025-01-01",
 *      videoUrls:  ["https://..."],
 *    },
 * ════════════════════════════════════════════════════════════ */

var netracellRecords = [
  {
    playerId:   "NamelessDeity",
    clearTime:  "1:38.000",
    uploadTime: "2026-04-30",
    videoUrls:  ["https://www.youtube.com/watch?v=rHZ2ZpYGJFE"],
  },
  {
    playerId:   "sakvayumika",
    clearTime:  "1:44.000",
    uploadTime: "2025-09-15",
    videoUrls:  ["https://www.youtube.com/watch?v=zmoB6OkYRzo"],
  },
  {
    playerId:   "Salat",
    clearTime:  "1:55.000",
    uploadTime: "2025-09-12",
    videoUrls:  ["https://www.youtube.com/watch?v=z_wYm507NAg"],
  },
  {
    playerId:   "Clarn",
    clearTime:  "2:04.000",
    uploadTime: "2026-05-01",
    videoUrls:  ["https://www.youtube.com/watch?v=TPbeklFkNbs"],
  },
  {
    playerId:   "Simaris",
    clearTime:  "2:12.000",
    uploadTime: "2026-04-29",
    videoUrls:  ["https://www.youtube.com/watch?v=z4331IVDtJo"],
  },
];

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var netracellNotice_cn = "";
var netracellNotice_en = "";
