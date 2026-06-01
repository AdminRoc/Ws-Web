/* ════════════════════════════════════════════════════════════
 *  间谍 竞速排行榜  /  Spy Speedrun Leaderboard
 *  数据文件：spy-allow-arval.js
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
 *  在下方 spy_allow_arvalRecords 数组中新增一个对象，如：
 *    {
 *      playerId:   "玩家名",
 *      clearTime:  "1:23.456",
 *      uploadTime: "2025-01-01",
 *      videoUrls:  ["https://..."],
 *    },
 * ════════════════════════════════════════════════════════════ */

var spy_allow_arvalRecords = [
  /* 暂无记录 */

  /* 示例记录 */
  {
    playerId:   "Salat",
    clearTime:  "0:33.183",
    uploadTime: "2026-01-16",
    videoUrls:  ["https://www.youtube.com/watch?v=4AFQSX5u9U0"],
  },
  {
    playerId:   "L1ndell",
    clearTime:  "0:39.000",
    uploadTime: "2026-01-07",
    videoUrls:  ["https://www.youtube.com/watch?v=M13ymDAfIbA"],
  },
  {
    playerId:   "_Gabriel",
    clearTime:  "0:43.000",
    uploadTime: "2023-09-08",
    videoUrls:  ["https://www.youtube.com/watch?v=FrZqz4OYtFg"],
  },

];

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var spy_allow_arvalNotice_cn = "";
var spy_allow_arvalNotice_en = "";
