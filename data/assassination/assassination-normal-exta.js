/* ════════════════════════════════════════════════════════════
 *  刺杀 竞速排行榜  /  Assassination Speedrun Leaderboard
 *  数据文件：assassination-normal-exta.js
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
 *  在下方 assassination_normal_extaRecords 数组中新增一个对象，如：
 *    {
 *      playerId:   "玩家名",
 *      clearTime:  "1:23.456",
 *      uploadTime: "2025-01-01",
 *      videoUrls:  ["https://..."],
 *    },
 * ════════════════════════════════════════════════════════════ */

var assassination_normal_extaRecords = [

  {
    playerId:   "Salat",
    clearTime:  "0:35.883",
    uploadTime: "2024-04-19",
    videoUrls:  ["https://www.youtube.com/watch?v=V_oZK86X1P0"],
  },
  {
    playerId:   ".cat",
    clearTime:  "0:45.500",
    uploadTime: "2020-05-04",
    videoUrls:  ["https://www.youtube.com/watch?v=nPFHPLVRXEY"],
  },
  {
    playerId:   "zukerben",
    clearTime:  "0:47.500",
    uploadTime: "2020-05-10",
    videoUrls:  ["https://www.youtube.com/watch?v=gluK6ZHokKQ"],
  },
];

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var assassination_normal_extaNotice_cn = "";
var assassination_normal_extaNotice_en = "";
