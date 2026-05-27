/* ════════════════════════════════════════════════════════════
 *  歼灭 竞速排行榜  /  Exterminate Speedrun Leaderboard
 *  数据文件：exterminate-normal-oxomoco.js
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
 *  在下方 exterminate_normal_oxomocoRecords 数组中新增一个对象，如：
 *    {
 *      playerId:   "玩家名",
 *      clearTime:  "1:23.456",
 *      uploadTime: "2025-01-01",
 *      videoUrls:  ["https://..."],
 *    },
 * ════════════════════════════════════════════════════════════ */

var exterminate_normal_oxomocoRecords = [
  /* 暂无记录 */
  {
       playerId:   "Jagdtor",
       clearTime:  "0:12.550",
       uploadTime: "2026-04-27",
       videoUrls:  ["https://www.youtube.com/watch?v=AeFZigvQNS8&t=30s"],
  },
  {
       playerId:   "yukkpo",
       clearTime:  "0:14.933",
       uploadTime: "2026-05-23",
       videoUrls:  ["https://www.bilibili.com/video/BV1d4G56PEFM"],
  },
  {
       playerId:   "nykroze",
       clearTime:  "0:17.767",
       uploadTime: "2026-05-01",
       videoUrls:  ["hhttps://www.youtube.com/watch?v=UGk9O04zalU"],
  },
  {
       playerId:   "Salat",
       clearTime:  "0:18.383",
       uploadTime: "2026-04-09",
       videoUrls:  ["https://www.youtube.com/watch?v=7NbovDEZSo8"],
  },
  {
       playerId:   "_Phobos",
       clearTime:  "0:19.667",
       uploadTime: "2026-03-29",
       videoUrls:  ["https://www.youtube.com/watch?v=zZzelKHmdKM"],
  },
];
