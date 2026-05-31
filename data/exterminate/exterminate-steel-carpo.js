/* ════════════════════════════════════════════════════════════
 *  歼灭 竞速排行榜  /  Exterminate Speedrun Leaderboard
 *  数据文件：exterminate-steel-carpo.js
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
 *  在下方 exterminate_steel_carpoRecords 数组中新增一个对象，如：
 *    {
 *      playerId:   "玩家名",
 *      clearTime:  "1:23.456",
 *      uploadTime: "2025-01-01",
 *      videoUrls:  ["https://..."],
 *    },
 * ════════════════════════════════════════════════════════════ */

var exterminate_steel_carpoRecords = [

  {
    playerId:   "kkV357",
    clearTime:  "0:40.000",
    uploadTime: "2026-05-20",
    videoUrls:  ["https://www.youtube.com/watch?v=ml6OHHkBRsY"],
  },
  {
    playerId:   "oTonJleHue",
    clearTime:  "0:50.000",
    uploadTime: "2026-02-13",
    videoUrls:  ["https://www.youtube.com/watch?v=C0lxFaDO3fE"],
  },
  {
    playerId:   "NamelessDeity",
    clearTime:  "0:54.000",
    uploadTime: "2026-02-10",
    videoUrls:  ["https://www.youtube.com/watch?v=l3aW41nsVh0"],
  },
  {
    playerId:   "Salat",
    clearTime:  "1:03.000",
    uploadTime: "2026-01-07",
    videoUrls:  ["https://www.youtube.com/watch?v=ws3wMH24tVo"],
  },
  {
    playerId:   "RoniPrime",
    clearTime:  "1:17.000",
    uploadTime: "2026-01-07",
    videoUrls:  ["https://www.youtube.com/watch?v=1cDxpQDgWX4"],
  },
];
