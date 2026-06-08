/* ════════════════════════════════════════════════════════════
 *  歼灭 竞速排行榜  /  Exterminate Speedrun Leaderboard
 *  数据文件：exterminate-steel-saxis.js
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
 *  在下方 exterminate_steel_saxisRecords 数组中新增一个对象，如：
 *    {
 *      playerId:   "玩家名",
 *      clearTime:  "1:23.456",
 *      uploadTime: "2025-01-01",
 *      videoUrls:  ["https://..."],
 *    },
 * ════════════════════════════════════════════════════════════ */

var exterminate_steel_saxisRecords = [
  {
    playerId:   "FrostMainer",
    clearTime:  "0:17.000",
    uploadTime: "2026-05-22",
    videoUrls:  ["https://www.youtube.com/watch?v=_OV-wMY9mVQ"],
  },
  {
    playerId:   "Salat",
    clearTime:  "0:21.000",
    uploadTime: "2026-01-09",
    videoUrls:  ["https://www.youtube.com/watch?v=6zBZfzh8L1U"],
  },
  {
    playerId:   "NamelessDeity",
    clearTime:  "0:35.000",
    uploadTime: "2026-02-10",
    videoUrls:  ["https://www.youtube.com/watch?v=l3aW41nsVh0"],
  },
];

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var exterminate_steel_saxisNotice_cn = "";
var exterminate_steel_saxisNotice_en = "";
