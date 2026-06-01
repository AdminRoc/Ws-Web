/* ════════════════════════════════════════════════════════════
 *  捕获 竞速排行榜  /  Capture Speedrun Leaderboard
 *  数据文件：capture-cassini.js
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
 *  在下方 capture_cassiniRecords 数组中新增一个对象，如：
 *    {
 *      playerId:   "玩家名",
 *      clearTime:  "1:23.456",
 *      uploadTime: "2025-01-01",
 *      videoUrls:  ["https://..."],
 *    },
 * ════════════════════════════════════════════════════════════ */

var capture_cassiniRecords = [

  {
    playerId:   "Salat",
    clearTime:  "0:18.433",
    uploadTime: "2025-11-26",
    videoUrls:  ["https://www.youtube.com/watch?v=cATuVBHQd84"],
  },
  {
    playerId:   "L1ndell",
    clearTime:  "0:19.267",
    uploadTime: "2021-11-18",
    videoUrls:  ["https://www.youtube.com/watch?v=n_TK1ViSP2w"],
  },
  {
    playerId:   "Mortar",
    clearTime:  "0:20.933",
    uploadTime: "2021-01-20",
    videoUrls:  ["https://www.youtube.com/watch?v=69DdM6vhXQs"],
  },
];

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var capture_cassiniNotice_cn = "";
var capture_cassiniNotice_en = "";
