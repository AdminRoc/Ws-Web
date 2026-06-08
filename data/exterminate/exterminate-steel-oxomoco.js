/* ════════════════════════════════════════════════════════════
 *  歼灭 竞速排行榜  /  Exterminate Speedrun Leaderboard
 *  数据文件：exterminate-steel-oxomoco.js
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
 *  在下方 exterminate_steel_oxomocoRecords 数组中新增一个对象，如：
 *    {
 *      playerId:   "玩家名",
 *      clearTime:  "1:23.456",
 *      uploadTime: "2025-01-01",
 *      videoUrls:  ["https://..."],
 *    },
 * ════════════════════════════════════════════════════════════ */

var exterminate_steel_oxomocoRecords = [
  {
    playerId:   "NamelessDeity",
    clearTime:  "0:32.000",
    uploadTime: "2026-02-07",
    videoUrls:  ["https://www.youtube.com/watch?v=NY-Gj0VOH9M"],
  },
  {
    playerId:   "RoniPrime",
    clearTime:  "0:38.000",
    uploadTime: "2026-02-05",
    videoUrls:  ["https://www.youtube.com/watch?v=379RqeLDsbY"],
  },
  {
    playerId:   "Salat",
    clearTime:  "0:47.000",
    uploadTime: "2026-01-07",
    videoUrls:  ["https://www.youtube.com/watch?v=ws3wMH24tVo"],
  },
  {
    playerId:   "Clarn",
    clearTime:  "4:58.000",
    uploadTime: "2026-02-21",
    videoUrls:  ["https://www.youtube.com/watch?v=xc3o0kprJjc"],
  },
  {
    playerId:   "FrostMainer",
    clearTime:  "0:28.000",
    uploadTime: "2026-06-08",
    videoUrls:  ["https://www.youtube.com/watch?v=MhfHN7pNQxk"],
  },
];

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var exterminate_steel_oxomocoNotice_cn = "";
var exterminate_steel_oxomocoNotice_en = "";
