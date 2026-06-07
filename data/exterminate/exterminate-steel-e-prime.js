/* ════════════════════════════════════════════════════════════
 *  歼灭 竞速排行榜  /  Exterminate Speedrun Leaderboard
 *  数据文件：exterminate-steel-e-prime.js
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
 *  在下方 exterminate_steel_e_primeRecords 数组中新增一个对象，如：
 *    {
 *      playerId:   "玩家名",
 *      clearTime:  "1:23.456",
 *      uploadTime: "2025-01-01",
 *      videoUrls:  ["https://..."],
 *    },
 * ════════════════════════════════════════════════════════════ */

var exterminate_steel_e_primeRecords = [

  {
    playerId:   "kkV357",
    clearTime:  "0:23.000",
    uploadTime: "2026-05-24",
    videoUrls:  ["https://www.youtube.com/watch?v=pcm1OH4gEEw"],
  },
  {
    playerId:   "NamelessDeity",
    clearTime:  "0:25.900",
    uploadTime: "2026-04-26",
    videoUrls:  ["https://www.youtube.com/watch?v=sbSMICy0rkc"],
  },
  {
    playerId:   "Soloframes",
    clearTime:  "0:26.333",
    uploadTime: "2026-05-03",
    videoUrls:  ["https://www.youtube.com/watch?v=fO4utdmbF8c"],
  },
  {
    playerId:   "Clarn",
    clearTime:  "0:27.467",
    uploadTime: "2026-05-23",
    videoUrls:  ["https://www.youtube.com/watch?v=VYRU5UAcHJ4"],
  },
  {
    playerId:   "_BaJlMaTbE_",
    clearTime:  "0:35.000",
    uploadTime: "2026-04-25",
    videoUrls:  ["https://www.youtube.com/watch?v=vJn1BpBLD88"],
  },
  {
    playerId:   "Salat",
    clearTime:  "0:44.000",
    uploadTime: "2026-01-07",
    videoUrls:  ["https://www.youtube.com/watch?v=ws3wMH24tVo"],
  },
  {
    playerId:   "RoniPrime",
    clearTime:  "0:58.000",
    uploadTime: "2026-01-07",
    videoUrls:  ["https://www.youtube.com/watch?v=Stkde6DjoRE"],
  },
];

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var exterminate_steel_e_primeNotice_cn = "";
var exterminate_steel_e_primeNotice_en = "";
