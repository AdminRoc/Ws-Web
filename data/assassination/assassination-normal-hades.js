/* ════════════════════════════════════════════════════════════
 *  刺杀 竞速排行榜  /  Assassination Speedrun Leaderboard
 *  数据文件：assassination-normal-hades.js
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
 *  在下方 assassination_normal_hadesRecords 数组中新增一个对象，如：
 *    {
 *      playerId:   "玩家名",
 *      clearTime:  "1:23.456",
 *      uploadTime: "2025-01-01",
 *      videoUrls:  ["https://..."],
 *    },
 * ════════════════════════════════════════════════════════════ */

var assassination_normal_hadesRecords = [

  {
    playerId:   "Salat",
    clearTime:  "7:18.516",
    uploadTime: "2025-11-12",
    videoUrls:  ["https://www.youtube.com/watch?v=52kCbgL2etQ"],
  },
  {
    playerId:   "Txdo",
    clearTime:  "7:19.933",
    uploadTime: "2025-01-29",
    videoUrls:  ["https://www.youtube.com/watch?v=Z-vFfK2q5YE"],
  },
  {
    playerId:   "PrimedDarkeN",
    clearTime:  "7:23.000",
    uploadTime: "2024-01-03",
    videoUrls:  ["https://www.youtube.com/watch?v=VUSPYCfrc-U"],
  },
];
