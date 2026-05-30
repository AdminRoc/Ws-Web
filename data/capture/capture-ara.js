/* ════════════════════════════════════════════════════════════
 *  捕获 竞速排行榜  /  Capture Speedrun Leaderboard
 *  数据文件：capture-ara.js
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
 *  在下方 capture_araRecords 数组中新增一个对象，如：
 *    {
 *      playerId:   "玩家名",
 *      clearTime:  "1:23.456",
 *      uploadTime: "2025-01-01",
 *      videoUrls:  ["https://..."],
 *    },
 * ════════════════════════════════════════════════════════════ */

var capture_araRecords = [
  {
    playerId:   "Salat",
    clearTime:  "0:15.067",
    uploadTime: "2025-09-29",
    videoUrls:  ["https://www.youtube.com/watch?v=cWNspYpqbuE"],
  },
  {
    playerId:   "L1ndell",
    clearTime:  "0:15.767",
    uploadTime: "2022-05-30",
    videoUrls:  ["https://www.youtube.com/watch?v=dBwkgrxeeAE"],
  },
  {
    playerId:   "Mortar",
    clearTime:  "0:16.967",
    uploadTime: "2021-02-28",
    videoUrls:  ["https://www.youtube.com/watch?v=Gj5wy66O6uo"],
  },
];
