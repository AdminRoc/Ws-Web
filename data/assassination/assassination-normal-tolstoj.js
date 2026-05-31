/* ════════════════════════════════════════════════════════════
 *  刺杀 竞速排行榜  /  Assassination Speedrun Leaderboard
 *  数据文件：assassination-normal-tolstoj.js
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
 *  在下方 assassination_normal_tolstojRecords 数组中新增一个对象，如：
 *    {
 *      playerId:   "玩家名",
 *      clearTime:  "1:23.456",
 *      uploadTime: "2025-01-01",
 *      videoUrls:  ["https://..."],
 *    },
 * Captain Vor
 * ════════════════════════════════════════════════════════════ */

var assassination_normal_tolstojRecords = [

  {
    playerId:   "Salat",
    clearTime:  "0:37.000",
    uploadTime: "2025-06-27",
    videoUrls:  ["https://www.youtube.com/watch?v=zCKTTEOUz-w"],
  },
  {
    playerId:   "_BaJIMaTbE_",
    clearTime:  "0:59.000",
    uploadTime: "2026-04-27",
    videoUrls:  ["https://www.youtube.com/watch?v=uFUOiAuF3pQ"],
  },
  {
    playerId:   "SABBA_HOSTUMEX",
    clearTime:  "1:27.000",
    uploadTime: "2026-01-09",
    videoUrls:  ["https://www.youtube.com/watch?v=AZ_rx3Ps_YA"],
  },
];
