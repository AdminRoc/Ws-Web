/* ════════════════════════════════════════════════════════════
 *  蝠力使 竞速排行榜  /  The Ropalolyst Speedrun Leaderboard
 *  数据文件：ropalolyst-normal.js
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
 *  在下方 ropalolyst_normalRecords 数组中新增一个对象，如：
 *    {
 *      playerId:   "玩家名",
 *      clearTime:  "1:23.456",
 *      uploadTime: "2025-01-01",
 *      videoUrls:  ["https://..."],
 *    },
 * ════════════════════════════════════════════════════════════ */

var ropalolyst_normalRecords = [

  {
    playerId:   "Txdo",
    clearTime:  "2:30.000",
    uploadTime: "2025-01-27",
    videoUrls:  ["https://www.youtube.com/watch?v=gfw8RNE40GI"],
  },
  {
    playerId:   "SarcasticPengwuin",
    clearTime:  "2:32.200",
    uploadTime: "2023-11-10",
    videoUrls:  ["https://www.youtube.com/watch?v=H49wVBjB-pQ"],
  },
  {
    playerId:   "_Gabriel",
    clearTime:  "2:36.000",
    uploadTime: "2023-01-22",
    videoUrls:  ["https://www.youtube.com/watch?v=kd_UfxjUZFQ"],
  },
  {
    playerId:   "Txdo / DishonoredFNG / _Dopa",
    clearTime:  "2:40.000",
    uploadTime: "2025-02-26",
    videoUrls:  ["https://www.youtube.com/watch?v=JqB7XM3WXqQ"],
  },
  {
    playerId:   "SAVentox / luuca1612",
    clearTime:  "2:41.000",
    uploadTime: "2025-02-18",
    videoUrls:  ["https://www.youtube.com/watch?v=mx-6E1j_rEo"],
  },
  {
    playerId:   "_BaJIMaTbE_",
    clearTime:  "2:43.000",
    uploadTime: "2026-06-02",
    videoUrls:  ["https://www.youtube.com/watch?v=oAFp4jCmd6E"],
  },
];

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var ropalolyst_normalNotice_cn = "";
var ropalolyst_normalNotice_en = "";
