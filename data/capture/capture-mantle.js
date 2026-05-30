/* ════════════════════════════════════════════════════════════
 *  捕获 竞速排行榜  /  Capture Speedrun Leaderboard
 *  数据文件：capture-mantle.js
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
 *  在下方 capture_mantleRecords 数组中新增一个对象，如：
 *    {
 *      playerId:   "玩家名",
 *      clearTime:  "1:23.456",
 *      uploadTime: "2025-01-01",
 *      videoUrls:  ["https://..."],
 *    },
 * ════════════════════════════════════════════════════════════ */

var capture_mantleRecords = [

  {
  playerId:   "Salat",
  clearTime:  "0:12.966",
  uploadTime: "2025-10-27",
  videoUrls:  ["https://www.youtube.com/watch?v=ebYdIqf7iTg"],
},
{
  playerId:   "Mortar",
  clearTime:  "0:13.933",
  uploadTime: "2022-05-30",
  videoUrls:  ["https://www.youtube.com/watch?v=aXJW0KLRqK0"],
},
{
  playerId:   "OgvDams",
  clearTime:  "0:14.707",
  uploadTime: "2024-01-07",
  videoUrls:  ["https://www.youtube.com/watch?v=5zjxGEhNJmQ"],
},
];
