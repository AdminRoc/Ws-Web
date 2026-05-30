/* ════════════════════════════════════════════════════════════
 *  间谍 竞速排行榜  /  Spy Speedrun Leaderboard
 *  数据文件：spy-allow-cambria.js
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
 *  在下方 spy_allow_cambriaRecords 数组中新增一个对象，如：
 *    {
 *      playerId:   "玩家名",
 *      clearTime:  "1:23.456",
 *      uploadTime: "2025-01-01",
 *      videoUrls:  ["https://..."],
 *    },
 * ════════════════════════════════════════════════════════════ */

var spy_allow_cambriaRecords = [

  {
    playerId:   "Salat",
    clearTime:  "0:47.433",
    uploadTime: "2026-05-03",
    videoUrls:  ["https://www.youtube.com/watch?v=mHErshqhclU"],
  },

  {
    playerId:   "PrimedDarkeN",
    clearTime:  "0:59.000",
    uploadTime: "2021-04-04",
    videoUrls:  ["https://www.youtube.com/watch?v=1_xejd8ncsM"],
  },
];
