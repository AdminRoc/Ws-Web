/* ════════════════════════════════════════════════════════════
 *  刺杀 竞速排行榜  /  Assassination Speedrun Leaderboard
 *  数据文件：assassination-normal-war.js
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
 *  在下方 assassination_normal_warRecords 数组中新增一个对象，如：
 *    {
 *      playerId:   "玩家名",
 *      clearTime:  "1:23.456",
 *      uploadTime: "2025-01-01",
 *      videoUrls:  ["https://..."],
 *    },
 * Lieutenant Lech Kril
 * ════════════════════════════════════════════════════════════ */

var assassination_normal_warRecords = [

  {
    playerId:   "Salat",
    clearTime:  "0:40.733",
    uploadTime: "2024-04-24",
    videoUrls:  ["https://www.youtube.com/watch?v=-lnLPYaITXI"],
  },
  {
    playerId:   "namenBARS",
    clearTime:  "0:46.000",
    uploadTime: "2022-07-27",
    videoUrls:  ["https://www.youtube.com/watch?v=msUhe8JyCwM"],
  },
  {
    playerId:   "L1ndell",
    clearTime:  "0:47.000",
    uploadTime: "2022-07-28",
    videoUrls:  ["https://www.youtube.com/watch?v=Eer1uIpk_I8"],
  },
];

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var assassination_normal_warNotice_cn = "";
var assassination_normal_warNotice_en = "";
