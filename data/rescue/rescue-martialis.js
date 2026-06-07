/* ════════════════════════════════════════════════════════════
 *  救援 竞速排行榜  /  Rescue Speedrun Leaderboard
 *  数据文件：rescue-martialis.js
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
 *  在下方 rescue_martialisRecords 数组中新增一个对象，如：
 *    {
 *      playerId:   "玩家名",
 *      clearTime:  "1:23.456",
 *      uploadTime: "2025-01-01",
 *      videoUrls:  ["https://..."],
 *    },
 * ════════════════════════════════════════════════════════════ */

var rescue_martialisRecords = [
  {
    playerId:   "Salat",
    clearTime:  "0:19.266",
    uploadTime: "2026-01-11",
    videoUrls:  ["https://www.youtube.com/watch?v=mmjNEEn2tjs"],
  },
  {
    playerId:   "PrimedDarkeN",
    clearTime:  "0:25.200",
    uploadTime: "2022-06-26",
    videoUrls:  ["https://www.youtube.com/watch?v=IZdrpT-F2fY"],
  },
  {
    playerId:   "L1ndell",
    clearTime:  "0:25.267",
    uploadTime: "2022-11-11",
    videoUrls:  ["https://www.youtube.com/watch?v=HMRo1zOrO3w"],
  },
  {
    playerId:   "RoniPrime",
    clearTime:  "0:25.900",
    uploadTime: "2025-12-21",
    videoUrls:  ["https://www.youtube.com/watch?v=-D8EbquA9tY"],
  },
  {
    playerId:   "Febi",
    clearTime:  "0:30.000",
    uploadTime: "2022-01-08",
    videoUrls:  ["https://www.youtube.com/watch?v=wz56OH2c1a8"],
  },
];

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var rescue_martialisNotice_cn = "";
var rescue_martialisNotice_en = "";
