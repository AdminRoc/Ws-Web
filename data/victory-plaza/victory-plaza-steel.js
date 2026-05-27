/* ════════════════════════════════════════════════════════════
 *  1999 坦克 竞速排行榜  /  Victory Plaza Speedrun Leaderboard
 *  数据文件：victory-plaza-steel.js
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
 *  在下方 victory_plaza_steelRecords 数组中新增一个对象，如：
 *    {
 *      playerId:   "玩家名",
 *      clearTime:  "1:23.456",
 *      uploadTime: "2025-01-01",
 *      videoUrls:  ["https://..."],
 *    },
 * ════════════════════════════════════════════════════════════ */

var victory_plaza_steelRecords = [
  /* 暂无记录 */
  {
    playerId:   "RoniPrime",
    clearTime:  "00:04:52.000",
    uploadTime: "2025-10-18",
    videoUrls:  ["https://www.youtube.com/watch?v=FRiJLg3DEEM"],
  }, 
  {
    playerId:   "PWNZ",
    clearTime:  "00:07:31.017",
    uploadTime: "2025-09-19",
    videoUrls:  ["null"],
  }, 
  {
    playerId:   "NamelessDeity / RoniPrime",
    clearTime:  "00:03:42.000",
    uploadTime: "2025-10-07",
    videoUrls:  ["https://www.youtube.com/watch?v=cqCJqK0yVMc"],
  },
];
