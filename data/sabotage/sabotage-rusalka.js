/* ════════════════════════════════════════════════════════════
 *  破坏 竞速排行榜  /  Sabotage Speedrun Leaderboard
 *  数据文件：sabotage-rusalka.js
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
 *  在下方 sabotage_rusalkaRecords 数组中新增一个对象，如：
 *    {
 *      playerId:   "玩家名",
 *      clearTime:  "1:23.456",
 *      uploadTime: "2025-01-01",
 *      videoUrls:  ["https://..."],
 *    },
 * ════════════════════════════════════════════════════════════ */

var sabotage_rusalkaRecords = [

  {
    playerId:   "Salat",
    clearTime:  "0:33.083",
    uploadTime: "2025-08-06",
    videoUrls:  ["https://www.youtube.com/watch?v=mSinOowbbq8"],
  },
  {
    playerId:   "L1ndell",
    clearTime:  "0:35.000",
    uploadTime: "2023-01-18",
    videoUrls:  ["https://www.youtube.com/watch?v=tgC5Zchmz-o"],
  },
];

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var sabotage_rusalkaNotice_cn = "";
var sabotage_rusalkaNotice_en = "";
