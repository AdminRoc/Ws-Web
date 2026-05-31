/* ════════════════════════════════════════════════════════════
 *  破坏 竞速排行榜  /  Sabotage Speedrun Leaderboard
 *  数据文件：sabotage-desdemona.js
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
 *  在下方 sabotage_desdemonaRecords 数组中新增一个对象，如：
 *    {
 *      playerId:   "玩家名",
 *      clearTime:  "1:23.456",
 *      uploadTime: "2025-01-01",
 *      videoUrls:  ["https://..."],
 *    },
 * ════════════════════════════════════════════════════════════ */

var sabotage_desdemonaRecords = [
  {
    playerId:   "Salat",
    clearTime:  "1:39.533",
    uploadTime: "2026-01-30",
    videoUrls:  ["https://www.youtube.com/watch?v=mvKgfrXD0"],
  },
  {
    playerId:   "PrimedDarkeN",
    clearTime:  "1:44.000",
    uploadTime: "2021-11-17",
    videoUrls:  ["https://www.youtube.com/watch?v=FyGpu9Q2rW4"],
  },
];
