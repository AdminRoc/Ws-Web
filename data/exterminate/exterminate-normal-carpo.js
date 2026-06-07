/* ════════════════════════════════════════════════════════════
 *  歼灭 竞速排行榜  /  Exterminate Speedrun Leaderboard
 *  数据文件：exterminate-normal-carpo.js
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
 *  在下方 exterminate_normal_carpoRecords 数组中新增一个对象，如：
 *    {
 *      playerId:   "玩家名",
 *      clearTime:  "1:23.456",
 *      uploadTime: "2025-01-01",
 *      videoUrls:  ["https://..."],
 *    },
 * ════════════════════════════════════════════════════════════ */

var exterminate_normal_carpoRecords = [
  {
    playerId:   "Jagdtor",
    clearTime:  "0:19.483",
    uploadTime: "2026-04-28",
    videoUrls:  ["https://www.youtube.com/watch?v=-E0pAZHzHns"],
  },
  {
    playerId:   "Hvna",
    clearTime:  "0:20.533",
    uploadTime: "2026-02-20",
    videoUrls:  ["https://www.youtube.com/watch?v=NtjVlU2EOR8"],
  },
  {
    playerId:   "Salat",
    clearTime:  "0:22.566",
    uploadTime: "2026-02-12",
    videoUrls:  ["https://www.youtube.com/watch?v=jaFmRfDNCvE"],
  },
];

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var exterminate_normal_carpoNotice_cn = "";
var exterminate_normal_carpoNotice_en = "";
