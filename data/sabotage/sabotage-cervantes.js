/* ════════════════════════════════════════════════════════════
 *  破坏 竞速排行榜  /  Sabotage Speedrun Leaderboard
 *  数据文件：sabotage-cervantes.js
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
 *  在下方 sabotage_cervantesRecords 数组中新增一个对象，如：
 *    {
 *      playerId:   "玩家名",
 *      clearTime:  "1:23.456",
 *      uploadTime: "2025-01-01",
 *      videoUrls:  ["https://..."],
 *    },
 * ════════════════════════════════════════════════════════════ */

var sabotage_cervantesRecords = [
  {
    playerId:   "Salat",
    clearTime:  "1:30.667",
    uploadTime: "2026-06-11",
    videoUrls:  ["https://www.youtube.com/watch?v=u6l1wBAb9O8"],
  },
  {
    playerId:   "Endryx_Ow",
    clearTime:  "1:32.417",
    uploadTime: "2024-11-17",
    videoUrls:  ["https://www.youtube.com/watch?v=d1udXSzmMOk"],
  },
  {
    playerId:   "Mortar",
    clearTime:  "1:34.100",
    uploadTime: "2021-04-24",
    videoUrls:  ["https://www.youtube.com/watch?v=dVye1XEkt-U"],
  },
];

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var sabotage_cervantesNotice_cn = "";
var sabotage_cervantesNotice_en = "";
