/* ════════════════════════════════════════════════════════════
 *  刺杀 竞速排行榜  /  Assassination Speedrun Leaderboard
 *  数据文件：assassination-normal-oro.js
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
 *  在下方 assassination_normal_oroRecords 数组中新增一个对象，如：
 *    {
 *      playerId:   "玩家名",
 *      clearTime:  "1:23.456",
 *      uploadTime: "2025-01-01",
 *      videoUrls:  ["https://..."],
 *    },
 * ════════════════════════════════════════════════════════════ */

var assassination_normal_oroRecords = [

  {
    playerId:   "Salat",
    clearTime:  "0:46.366",
    uploadTime: "2025-10-28",
    videoUrls:  ["https://www.youtube.com/watch?v=VdLyldma8Iw"],
  },
  {
    playerId:   "Txdo",
    clearTime:  "0:52.967",
    uploadTime: "2025-01-09",
    videoUrls:  ["https://www.youtube.com/watch?v=EoKqSC8JrG8"],
  },
  {
    playerId:   "Mortar",
    clearTime:  "0:56.983",
    uploadTime: "2024-02-14",
    videoUrls:  ["https://www.youtube.com/watch?v=fT2TFi-rKU0"],
  },
];

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var assassination_normal_oroNotice_cn = "";
var assassination_normal_oroNotice_en = "";
