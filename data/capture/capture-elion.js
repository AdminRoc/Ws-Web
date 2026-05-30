/* ════════════════════════════════════════════════════════════
 *  捕获 竞速排行榜  /  Capture Speedrun Leaderboard
 *  数据文件：capture-elion.js
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
 *  在下方 capture_elionRecords 数组中新增一个对象，如：
 *    {
 *      playerId:   "玩家名",
 *      clearTime:  "1:23.456",
 *      uploadTime: "2025-01-01",
 *      videoUrls:  ["https://..."],
 *    },
 * ════════════════════════════════════════════════════════════ */

var capture_elionRecords = [

  {
    playerId:   "Salat",
    clearTime:  "0:17.400",
    uploadTime: "2025-05-29",
    videoUrls:  ["https://www.youtube.com/watch?v=6pzTV-qjR_o"],
  },
  {
    playerId:   "L1ndell",
    clearTime:  "0:19.467",
    uploadTime: "2023-01-08",
    videoUrls:  ["https://www.youtube.com/watch?v=k4P4Ud3jBUM"],
  },
  {
    playerId:   "Mortar",
    clearTime:  "0:20.833",
    uploadTime: "2020-09-28",
    videoUrls:  ["https://www.youtube.com/watch?v=WzNMzSCiYMU"],
  },
];
