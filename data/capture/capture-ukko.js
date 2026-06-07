/* ════════════════════════════════════════════════════════════
 *  捕获 竞速排行榜  /  Capture Speedrun Leaderboard
 *  数据文件：capture-ukko.js
 *  ┌──────────────────────────────────────────────────────┐
 *  │  字段说明：                                          │
 *  │    playerId  —— 玩家 ID（昵称）                      │
 *  │    clearTime —— 时间（格式：mm:ss.ms）            │
 *  │    uploadTime—— 成绩提交时间（格式：YYYY-MM-DD）      │
 *  │    videoUrls —— 视频链接数组；最多4个视角             │
 *  │                 ["url1","url2",...]                   │
 *  │  排名规则：脚本按 clearTime 从小到大自动排序          │
 *  └──────────────────────────────────────────────────────┘
 *
 *  添加/修改记录方法：
 *  在下方 capture_ukkoRecords 数组中新增一个对象，如：
 *    {
 *      playerId:   "玩家名",
 *      clearTime:  "1:23.456",
 *      uploadTime: "2025-01-01",
 *      videoUrls:  ["https://..."],
 *    },
 * ════════════════════════════════════════════════════════════ */

var capture_ukkoRecords = [

  {
  playerId:   "PrimedDarkeN",
  clearTime:  "0:15.033",
  uploadTime: "2023-10-12",
  videoUrls:  ["https://www.youtube.com/watch?v=8R0e3DngN4s"],
},
{
  playerId:   "AresWrath562",
  clearTime:  "0:15.067",
  uploadTime: "2025-04-28",
  videoUrls:  ["https://www.youtube.com/watch?v=aEBBgbnQMYs"],
},
{
  playerId:   "OgvDams",
  clearTime:  "0:15.467",
  uploadTime: "2024-03-17",
  videoUrls:  ["https://www.youtube.com/watch?v=IYZVNXvWbNI"],
},

];

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var capture_ukkoNotice_cn = "";
var capture_ukkoNotice_en = "";
