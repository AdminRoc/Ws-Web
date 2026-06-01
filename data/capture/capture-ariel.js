/* ════════════════════════════════════════════════════════════
 *  捕获 竞速排行榜  /  Capture Speedrun Leaderboard
 *  数据文件：capture-ariel.js
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
 *  在下方 capture_arielRecords 数组中新增一个对象，如：
 *    {
 *      playerId:   "玩家名",
 *      clearTime:  "1:23.456",
 *      uploadTime: "2025-01-01",
 *      videoUrls:  ["https://..."],
 *    },
 * ════════════════════════════════════════════════════════════ */

var capture_arielRecords = [

  {
    playerId:   "Salat",
    clearTime:  "0:23.400",
    uploadTime: "2025-12-29",
    videoUrls:  ["https://www.youtube.com/watch?v=gCtM0lbzaWk"],
  },
  {
    playerId:   "Mortar",
    clearTime:  "0:24.100",
    uploadTime: "2024-01-25",
    videoUrls:  ["https://www.youtube.com/watch?v=4MRBb6P5SKQ"],
  },
  {
    playerId:   "L1ndell",
    clearTime:  "0:25.850",
    uploadTime: "2022-04-03",
    videoUrls:  ["https://www.youtube.com/watch?v=XqP7mi_R2VI"],
  },
];

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var capture_arielNotice_cn = "";
var capture_arielNotice_en = "";
