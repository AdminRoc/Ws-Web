/* ════════════════════════════════════════════════════════════
 *  救援 竞速排行榜  /  Rescue Speedrun Leaderboard
 *  数据文件：rescue-metis.js
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
 *  在下方 rescue_metisRecords 数组中新增一个对象，如：
 *    {
 *      playerId:   "玩家名",
 *      clearTime:  "1:23.456",
 *      uploadTime: "2025-01-01",
 *      videoUrls:  ["https://..."],
 *    },
 * ════════════════════════════════════════════════════════════ */

var rescue_metisRecords = [
  {
    playerId:   "Salat",
    clearTime:  "0:32.933",
    uploadTime: "2025-12-27",
    videoUrls:  ["https://www.youtube.com/watch?v=xT4O1JZ1uVc"],
  },
  {
    playerId:   "L1ndell",
    clearTime:  "0:36.000",
    uploadTime: "2022-03-26",
    videoUrls:  ["https://www.youtube.com/watch?v=KuEDD7EeQXM"],
  },
  {
    playerId:   "Mortar",
    clearTime:  "0:37.000",
    uploadTime: "2021-02-10",
    videoUrls:  ["https://www.youtube.com/watch?v=z_4suc1WHPM"],
  },
];

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var rescue_metisNotice_cn = "";
var rescue_metisNotice_en = "";
