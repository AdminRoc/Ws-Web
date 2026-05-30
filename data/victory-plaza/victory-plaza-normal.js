/* ════════════════════════════════════════════════════════════
 *  1999 坦克 竞速排行榜  /  Victory Plaza Speedrun Leaderboard
 *  数据文件：victory-plaza-normal.js
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
 *  在下方 victory_plaza_normalRecords 数组中新增一个对象，如：
 *    {
 *      playerId:   "玩家名",
 *      clearTime:  "1:23.456",
 *      uploadTime: "2025-01-01",
 *      videoUrls:  ["https://..."],
 *    },
 * ════════════════════════════════════════════════════════════ */

var victory_plaza_normalRecords = [

  {
    playerId:   "Salat",
    clearTime:  "0:02:34",
    uploadTime: "2025-04-05",
    videoUrls:  ["https://www.youtube.com/watch?v=WSYT_BaUanA"],
  },

  {
    playerId:   "SABBA_HOSTUMEX",
    clearTime:  "0:05:42",
    uploadTime: "2026-01-11",
    videoUrls:  ["https://www.youtube.com/watch?v=WMEpIEMRbVE"],
  },

  {
    playerId:   "Dusan_UA",
    clearTime:  "0:06:52",
    uploadTime: "2026-05-07",
    videoUrls:  ["https://www.youtube.com/watch?v=ycGey8BMWOo"],
  },
  
  {
    playerId:   "Salat / L1ndell",
    clearTime:  "0:04:32",
    uploadTime: "2025-12-27",
    videoUrls:  ["https://www.youtube.com/watch?v=9SjKJ6MZdR4"],
  },

  {
    playerId:   "sadkdawu / Fr0z3nTempest",
    clearTime:  "0:07:39",
    uploadTime: "2025-11-29",
    videoUrls:  ["https://www.youtube.com/watch?v=qCYCM4IujR4"],
  },
];
