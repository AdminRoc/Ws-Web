/* ════════════════════════════════════════════════════════════
 *  刺杀 竞速排行榜  /  Assassination Speedrun Leaderboard
 *  数据文件：assassination-normal-mutalist-alad-v.js
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
 *  在下方 assassination_normal_mutalist_alad_vRecords 数组中新增一个对象，如：
 *    {
 *      playerId:   "玩家名",
 *      clearTime:  "1:23.456",
 *      uploadTime: "2025-01-01",
 *      videoUrls:  ["https://..."],
 *    },
 * ════════════════════════════════════════════════════════════ */

var assassination_normal_mutalist_alad_vRecords = [

  {
    playerId:   "Salat",
    clearTime:  "0:29.000",
    uploadTime: "2025-04-12",
    videoUrls:  ["https://www.youtube.com/watch?v=Na6bgUYTSCg"],
  },
  {
    playerId:   "Mortar",
    clearTime:  "0:30.000",
    uploadTime: "2024-03-21",
    videoUrls:  ["https://www.youtube.com/watch?v=j--OZMsCUiU"],
  },
  {
    playerId:   "mashor2004",
    clearTime:  "0:35.000",
    uploadTime: "2019-08-23",
    videoUrls:  ["https://www.youtube.com/watch?v=p5lDZaa59O8"],
  },
];

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var assassination_normal_mutalist_alad_vNotice_cn = "";
var assassination_normal_mutalist_alad_vNotice_en = "";
