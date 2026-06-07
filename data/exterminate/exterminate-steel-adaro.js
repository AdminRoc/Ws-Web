/* ════════════════════════════════════════════════════════════
 *  歼灭 竞速排行榜  /  Exterminate Speedrun Leaderboard
 *  数据文件：exterminate-steel-adaro.js
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
 *  在下方 exterminate_steel_adaroRecords 数组中新增一个对象，如：
 *    {
 *      playerId:   "玩家名",
 *      clearTime:  "1:23.456",
 *      uploadTime: "2025-01-01",
 *      videoUrls:  ["https://..."],
 *    },
 * ════════════════════════════════════════════════════════════ */

var exterminate_steel_adaroRecords = [

  {
    playerId:   "NamelessDeity",
    clearTime:  "0:41.000",
    uploadTime: "2026-04-30",
    videoUrls:  ["https://www.youtube.com/watch?v=0mhKjSUwPZk"],
  },
  {
    playerId:   "oTonJleHue",
    clearTime:  "0:46.000",
    uploadTime: "2026-02-13",
    videoUrls:  ["https://www.youtube.com/watch?v=EZcRF2DNHF4"],
  },
  {
    playerId:   "Salat",
    clearTime:  "0:48.000",
    uploadTime: "2026-01-09",
    videoUrls:  ["https://www.youtube.com/watch?v=wI6LTQLvWtU"],
  },
  {
    playerId:   "RoniPrime",
    clearTime:  "1:10.000",
    uploadTime: "2026-01-07",
    videoUrls:  ["https://www.youtube.com/watch?v=B5XHqdMt7oQ"],
  },
];

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var exterminate_steel_adaroNotice_cn = "";
var exterminate_steel_adaroNotice_en = "";
