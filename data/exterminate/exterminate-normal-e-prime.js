/* ════════════════════════════════════════════════════════════
 *  歼灭 竞速排行榜  /  Exterminate Speedrun Leaderboard
 *  数据文件：exterminate-normal-e-prime.js
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
 *  在下方 exterminate_normal_e_primeRecords 数组中新增一个对象，如：
 *    {
 *      playerId:   "玩家名",
 *      clearTime:  "1:23.456",
 *      uploadTime: "2025-01-01",
 *      videoUrls:  ["https://..."],
 *    },
 * ════════════════════════════════════════════════════════════ */

var exterminate_normal_e_primeRecords = [

  {
    playerId:   "Salat",
    clearTime:  "0:07.967",
    uploadTime: "2026-06-25",
    videoUrls:  ["https://www.youtube.com/watch?v=og4ee2mO3-s"],
  },
  {
    playerId:   "Jagdtor",
    clearTime:  "0:09.217",
    uploadTime: "2026-05-13",
    videoUrls:  ["https://www.youtube.com/watch?v=ZdgtDtYJ5K0"],
  },
  {
    playerId:   "Mortar",
    clearTime:  "0:12.000",
    uploadTime: "2022-12-03",
    videoUrls:  ["https://www.youtube.com/watch?v=WUa_Sddtu_w"],
  },
  {
    playerId:   "Wasamii",
    clearTime:  "0:13.000",
    uploadTime: "2026-01-17",
    videoUrls:  ["https://www.youtube.com/watch?v=Jegk4bwH-fg"],
  },
  {
    playerId:   "Jagdtor / Txdo",
    clearTime:  "0:37.000",
    uploadTime: "2026-06-11",
    videoUrls:  ["https://www.youtube.com/watch?v=dPKnAniDfRI"],
  },
  {
    playerId:   "wergoud",
    clearTime:  "0:14.000",
    uploadTime: "2026-06-22",
    videoUrls:  ["https://www.youtube.com/watch?v=6px97n3HxAE"],
  },
];

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var exterminate_normal_e_primeNotice_cn = "";
var exterminate_normal_e_primeNotice_en = "";
