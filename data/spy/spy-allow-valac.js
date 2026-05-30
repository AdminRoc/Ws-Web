/* ════════════════════════════════════════════════════════════
 *  间谍 竞速排行榜  /  Spy Speedrun Leaderboard
 *  数据文件：spy-allow-valac.js
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
 *  在下方 spy_allow_valacRecords 数组中新增一个对象，如：
 *    {
 *      playerId:   "玩家名",
 *      clearTime:  "1:23.456",
 *      uploadTime: "2025-01-01",
 *      videoUrls:  ["https://..."],
 *    },
 * ════════════════════════════════════════════════════════════ */

var spy_allow_valacRecords = [

  {
    playerId:   "Salat",
    clearTime:  "0:51.483",
    uploadTime: "2019-11-19",
    videoUrls:  ["https://www.youtube.com/watch?v=b8_IuxnyDZE"],
  },
  {
    playerId:   "-Rekken-",
    clearTime:  "1:02.633",
    uploadTime: "2018-08-07",
    videoUrls:  ["https://www.youtube.com/watch?v=qE7l-DXQ2Yg"],
  },
  {
    playerId:   "NightWorrer",
    clearTime:  "1:06.197",
    uploadTime: "2018-07-25",
    videoUrls:  ["https://www.youtube.com/watch?v=X96Oap6w7A4"],
  },
];
