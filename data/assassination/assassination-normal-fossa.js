/* ════════════════════════════════════════════════════════════
 *  刺杀 竞速排行榜  /  Assassination Speedrun Leaderboard
 *  数据文件：assassination-normal-fossa.js
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
 *  在下方 assassination_normal_fossaRecords 数组中新增一个对象，如：
 *    {
 *      playerId:   "玩家名",
 *      clearTime:  "1:23.456",
 *      uploadTime: "2025-01-01",
 *      videoUrls:  ["https://..."],
 *    },
 * ════════════════════════════════════════════════════════════ */

var assassination_normal_fossaRecords = [

  {
    playerId:   "Salat",
    clearTime:  "2:04.000",
    uploadTime: "2026-01-20",
    videoUrls:  ["https://www.youtube.com/watch?v=q0xoFixEGEo"],
  },
  {
    playerId:   "_Gabriel",
    clearTime:  "2:12.000",
    uploadTime: "2023-01-09",
    videoUrls:  ["https://www.youtube.com/watch?v=Hj7O0bIKmR0"],
  },
  {
    playerId:   "sakivali",
    clearTime:  "2:13.300",
    uploadTime: "2024-11-05",
    videoUrls:  ["https://www.youtube.com/watch?v=-ovGwPVDYCQ"],
  },
];
