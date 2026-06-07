/* ════════════════════════════════════════════════════════════
 *  刺杀 竞速排行榜  /  Assassination Speedrun Leaderboard
 *  数据文件：assassination-normal-effervo.js
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
 *  在下方 assassination_normal_effervoRecords 数组中新增一个对象，如：
 *    {
 *      playerId:   "玩家名",
 *      clearTime:  "1:23.456",
 *      uploadTime: "2025-01-01",
 *      videoUrls:  ["https://..."],
 *    },
 * ════════════════════════════════════════════════════════════ */

var assassination_normal_effervoRecords = [

  {
    playerId:   "Endryx_Ow",
    clearTime:  "3:32.967",
    uploadTime: "2025-12-31",
    videoUrls:  ["https://www.youtube.com/watch?v=N3k5yqeEHpo"],
  },
  {
    playerId:   "Akemi",
    clearTime:  "4:43.667",
    uploadTime: "2025-12-31",
    videoUrls:  ["https://www.youtube.com/watch?v=C-E0ixIiKwI"],
  },
  {
    playerId:   "SilentDarkKnight",
    clearTime:  "8:05.733",
    uploadTime: "2025-12-30",
    videoUrls:  ["https://www.youtube.com/watch?v=SKTgRdb316c"],
  },
];

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var assassination_normal_effervoNotice_cn = "";
var assassination_normal_effervoNotice_en = "";
