/* ════════════════════════════════════════════════════════════
 *  间谍 竞速排行榜  /  Spy Speedrun Leaderboard
 *  数据文件：spy-allow-pago.js
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
 *  在下方 spy_allow_pagoRecords 数组中新增一个对象，如：
 *    {
 *      playerId:   "玩家名",
 *      clearTime:  "1:23.456",
 *      uploadTime: "2025-01-01",
 *      videoUrls:  ["https://..."],
 *    },
 * ════════════════════════════════════════════════════════════ */

var spy_allow_pagoRecords = [

  {
    playerId:   "L1ndell",
    clearTime:  "0:46.533",
    uploadTime: "2026-06-02",
    videoUrls:  ["https://www.youtube.com/watch?v=BDDeN9A2Uco"],
  },
  
  {
    playerId:   "Salat",
    clearTime:  "0:47.533",
    uploadTime: "2026-05-12",
    videoUrls:  ["https://www.youtube.com/watch?v=IyjwNdvyEWA"],
  },

  {
    playerId:   "Txdo",
    clearTime:  "0:50.750",
    uploadTime: "2025-04-30",
    videoUrls:  ["https://www.youtube.com/watch?v=q0r6N3Kdi0U"],
  },

  {
    playerId:   "PrimedDarkeN",
    clearTime:  "0:50.933",
    uploadTime: "2024-10-07",
    videoUrls:  ["https://www.youtube.com/watch?v=FAwYm2izNaQ"],
  },

  {
    playerId:   "Endryx_Ow",
    clearTime:  "0:57.000",
    uploadTime: "2024-11-07",
    videoUrls:  ["https://www.youtube.com/watch?v=f8o03xAonnA"],
  },
  
];

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var spy_allow_pagoNotice_cn = "";
var spy_allow_pagoNotice_en = "";
