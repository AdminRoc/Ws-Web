/* ════════════════════════════════════════════════════════════
 *  捕获 竞速排行榜  /  Capture Speedrun Leaderboard
 *  数据文件：capture-copernicus.js
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
 *  在下方 capture_copernicusRecords 数组中新增一个对象，如：
 *    {
 *      playerId:   "玩家名",
 *      clearTime:  "1:23.456",
 *      uploadTime: "2025-01-01",
 *      videoUrls:  ["https://..."],
 *    },
 * ════════════════════════════════════════════════════════════ */

var capture_copernicusRecords = [

  {
    playerId:   "Salat",
    clearTime:  "0:15.850",
    uploadTime: "2026-03-11",
    videoUrls:  ["https://www.youtube.com/watch?v=wJOgoRMloZ8"],
  },
  {
    playerId:   "Mortar",
    clearTime:  "0:16.683",
    uploadTime: "2024-01-31",
    videoUrls:  ["https://www.youtube.com/watch?v=H5X23drfecE"],
  },
  {
    playerId:   "FXCloud",
    clearTime:  "0:16.856",
    uploadTime: "2025-11-26",
    videoUrls:  ["https://wfspeed.run/unavailable.html"],
  },
];
