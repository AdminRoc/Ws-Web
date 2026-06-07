/* ════════════════════════════════════════════════════════════
 *  刺杀 竞速排行榜  /  Assassination Speedrun Leaderboard
 *  数据文件：assassination-normal-titania.js
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
 *  在下方 assassination_normal_titaniaRecords 数组中新增一个对象，如：
 *    {
 *      playerId:   "玩家名",
 *      clearTime:  "1:23.456",
 *      uploadTime: "2025-01-01",
 *      videoUrls:  ["https://..."],
 *    },
 * Tyl Regor
 * ════════════════════════════════════════════════════════════ */

var assassination_normal_titaniaRecords = [
  {
    playerId:   "Salat",
    clearTime:  "1:16.066",
    uploadTime: "2025-05-30",
    videoUrls:  ["https://www.youtube.com/watch?v=5f79Zt17UN4"],
  },
  {
    playerId:   "Txdo",
    clearTime:  "1:16.783",
    uploadTime: "2025-01-30",
    videoUrls:  ["https://www.youtube.com/watch?v=6Xgn9SEre1A"],
  },
  {
    playerId:   "Lithiu",
    clearTime:  "1:18.067",
    uploadTime: "2025-04-13",
    videoUrls:  ["https://www.youtube.com/watch?v=1KQ-nbTVDNc"],
  },
];

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var assassination_normal_titaniaNotice_cn = "";
var assassination_normal_titaniaNotice_en = "";
