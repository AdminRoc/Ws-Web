/* ════════════════════════════════════════════════════════════
 *  歼灭 竞速排行榜  /  Exterminate Speedrun Leaderboard
 *  数据文件：exterminate-normal-oxomoco.js
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
 *  在下方 exterminate_normal_oxomocoRecords 数组中新增一个对象，如：
 *    {
 *      playerId:   "玩家名",
 *      clearTime:  "1:23.456",
 *      uploadTime: "2025-01-01",
 *      videoUrls:  ["https://..."],
 *    },
 * ════════════════════════════════════════════════════════════ */

var exterminate_normal_oxomocoRecords = [

  {
     playerId:   "Jagdtor",
     clearTime:  "0:11.467",
     uploadTime: "2026-05-29",
     videoUrls:  ["https://www.youtube.com/watch?v=uuwuOflqXXo"],
  },
  {
       playerId:   "yukkpo",
       clearTime:  "0:13.600",
       uploadTime: "2026-06-26",
       videoUrls:  ["https://www.youtube.com/watch?v=WVMP9hl3CqI"],
  },
  {
       playerId:   "nykroze",
       clearTime:  "0:17.767",
       uploadTime: "2026-05-01",
       videoUrls:  ["hhttps://www.youtube.com/watch?v=UGk9O04zalU"],
  },
  {
       playerId:   "Salat",
       clearTime:  "0:18.383",
       uploadTime: "2026-04-09",
       videoUrls:  ["https://www.youtube.com/watch?v=7NbovDEZSo8"],
  },
  {
       playerId:   "_Phobos",
       clearTime:  "0:19.667",
       uploadTime: "2026-03-29",
       videoUrls:  ["https://www.youtube.com/watch?v=zZzelKHmdKM"],
  },

];

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var exterminate_normal_oxomocoNotice_cn = "";
var exterminate_normal_oxomocoNotice_en = "";
