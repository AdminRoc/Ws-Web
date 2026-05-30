/* ════════════════════════════════════════════════════════════
 *  氏族跑酷 竞速排行榜  /  Obstacle Course Speedrun Leaderboard
 *  数据文件：obstacle-course.js
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
 *  在下方 obstacle_courseRecords 数组中新增一个对象，如：
 *    {
 *      playerId:   "玩家名",
 *      clearTime:  "1:23.456",
 *      uploadTime: "2025-01-01",
 *      videoUrls:  ["https://..."],
 *    },
 * ════════════════════════════════════════════════════════════ */

var obstacle_courseRecords = [

  {
    playerId:   "Mebius",
    clearTime:  "0:03.760",
    uploadTime: "2024-01-31",
    videoUrls:  ["https://www.youtube.com/watch?v=6H0LmCoZ2b8&t=37s"],
  },
  {
    playerId:   "nik9094",
    clearTime:  "0:03.980",
    uploadTime: "2024-01-31",
    videoUrls:  ["https://www.youtube.com/watch?v=0C9JHRYyO_M"],
  },  
  {
    playerId:   "forze33",
    clearTime:  "0:04.170",
    uploadTime: "2023-06-06",
    videoUrls:  ["https://www.youtube.com/watch?v=PbXZKUeno7k"],
  },
  {
    playerId:   "_choso",
    clearTime:  "0:04.960",
    uploadTime: "2024-08-12",
    videoUrls:  ["https://www.youtube.com/watch?v=ppMrPc5gUF4"],
  },
  {
    playerId:   "itsConcept",
    clearTime:  "0:06.360",
    uploadTime: "2026-03-30",
    videoUrls:  ["https://www.youtube.com/watch?v=h6SXoPX1_dA"],
  },
  {
    playerId:   "Fuego999",
    clearTime:  "0:24.020",
    uploadTime: "2026-03-22",
    videoUrls:  ["https://www.youtube.com/watch?v=uavCxWMVS7U"],
  },

];
