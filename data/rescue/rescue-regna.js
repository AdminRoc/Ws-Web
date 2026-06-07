/* ════════════════════════════════════════════════════════════
 *  救援 竞速排行榜  /  Rescue Speedrun Leaderboard
 *  数据文件：rescue-regna.js
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
 *  在下方 rescue_regnaRecords 数组中新增一个对象，如：
 *    {
 *      playerId:   "玩家名",
 *      clearTime:  "1:23.456",
 *      uploadTime: "2025-01-01",
 *      videoUrls:  ["https://..."],
 *    },
 * ════════════════════════════════════════════════════════════ */

var rescue_regnaRecords = [

  {
    playerId:   "Salat",
    clearTime:  "0:21.250",
    uploadTime: "2025-11-14",
    videoUrls:  ["https://www.youtube.com/watch?v=jQGGFXZcFW0"],
  },
  {
    playerId:   "L1ndell",
    clearTime:  "0:25.000",
    uploadTime: "2022-08-01",
    videoUrls:  ["https://www.youtube.com/watch?v=BICQQ99J8Bk"],
  },
  {
    playerId:   "Salat",
    clearTime:  "0:19.733",
    uploadTime: "2026-06-06",
    videoUrls:  ["https://www.youtube.com/watch?v=EeOFKCebZss"],
  },
];

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var rescue_regnaNotice_cn = "";
var rescue_regnaNotice_en = "";
