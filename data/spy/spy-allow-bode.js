/* ════════════════════════════════════════════════════════════
 *  间谍 竞速排行榜  /  Spy Speedrun Leaderboard
 *  数据文件：spy-allow-bode.js
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
 *  在下方 spy_allow_bodeRecords 数组中新增一个对象，如：
 *    {
 *      playerId:   "玩家名",
 *      clearTime:  "1:23.456",
 *      uploadTime: "2025-01-01",
 *      videoUrls:  ["https://..."],
 *    },
 * ════════════════════════════════════════════════════════════ */

var spy_allow_bodeRecords = [
  /* 暂无记录 */

  /* 示例记录 */
  {
    playerId:   "Salat",
    clearTime:  "0:32.850",
    uploadTime: "2026-01-22",
    videoUrls:  ["https://www.youtube.com/watch?v=Rorx4ZFNejA"],
  },
  {
    playerId:   "L1ndell",
    clearTime:  "0:33.167",
    uploadTime: "2026-01-10",
    videoUrls:  ["https://www.youtube.com/watch?v=BHHA_3yNIFk"],
  },  
  {
    playerId:   "Mortar",
    clearTime:  "0:37.000",
    uploadTime: "2024-03-17",
    videoUrls:  ["https://www.youtube.com/watch?v=86KTQS_3Htg"],
  },

];
