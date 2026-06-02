/* ════════════════════════════════════════════════════════════
 *  刺杀 竞速排行榜  /  Assassination Speedrun Leaderboard
 *  数据文件：assassination-normal-tethys.js
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
 *  在下方 assassination_normal_tethysRecords 数组中新增一个对象，如：
 *    {
 *      playerId:   "玩家名",
 *      clearTime:  "1:23.456",
 *      uploadTime: "2025-01-01",
 *      videoUrls:  ["https://..."],
 *    },
 * ════════════════════════════════════════════════════════════ */

var assassination_normal_tethysRecords = [
  /* General Sargas Ruk */
  {
    playerId:   "Salat",
    clearTime:  "0:24.566",
    uploadTime: "2025-04-15",
    videoUrls:  ["https://www.youtube.com/watch?v=Wq3yw-p93RY"],
  },
  {
    playerId:   "Mortar",
    clearTime:  "0:26.200",
    uploadTime: "2024-03-22",
    videoUrls:  ["https://www.youtube.com/watch?v=qhFyIBOCap4"],
  },
  {
    playerId:   "SarcasticPengwuin",
    clearTime:  "0:27.750",
    uploadTime: "2023-11-12",
    videoUrls:  ["https://www.youtube.com/watch?v=ECgXY3zYGKw"],
  },
  {
    playerId:   "Plyonate",
    clearTime:  "0:41.000",
    uploadTime: "2026-06-02",
    videoUrls:  ["https://www.youtube.com/watch?v=znCFlwTDtlk"],
  },
];

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var assassination_normal_tethysNotice_cn = "";
var assassination_normal_tethysNotice_en = "";
