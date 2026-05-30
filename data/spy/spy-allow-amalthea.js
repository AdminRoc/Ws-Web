/* ════════════════════════════════════════════════════════════
 *  间谍 竞速排行榜  /  Spy Speedrun Leaderboard
 *  数据文件：spy-allow-amalthea.js
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
 *  在下方 spy_allow_amaltheaRecords 数组中新增一个对象，如：
 *    {
 *      playerId:   "玩家名",
 *      clearTime:  "1:23.456",
 *      uploadTime: "2025-01-01",
 *      videoUrls:  ["https://..."],
 *    },
 * ════════════════════════════════════════════════════════════ */

var spy_allow_amaltheaRecords = [

{
  playerId:   "Salat",
  clearTime:  "0:57.000",
  uploadTime: "2026-03-11",
  videoUrls:  ["https://www.youtube.com/watch?v=7vAsUCcXBIg"],
},
{
  playerId:   "_Gabriel",
  clearTime:  "1:02.000",
  uploadTime: "2023-08-25",
  videoUrls:  ["https://www.youtube.com/watch?v=JQcelU0pqUM"],
},
{
  playerId:   "L1ndell",
  clearTime:  "1:03.000",
  uploadTime: "2022-01-18",
  videoUrls:  ["https://www.youtube.com/watch?v=5wYo2D0vv34"],
},
];
