/* ════════════════════════════════════════════════════════════
 *  1999 歼灭 竞速排行榜  /  1999 Exterminate Speedrun Leaderboard
 *  数据文件：hollvania-1999-exterminate.js
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
 *  在下方 hollvania_1999_exterminateRecords 数组中新增一个对象，如：
 *    {
 *      playerId:   "玩家名",
 *      clearTime:  "1:23.456",
 *      uploadTime: "2025-01-01",
 *      videoUrls:  ["https://..."],
 *    },
 * ════════════════════════════════════════════════════════════ */

var hollvania_1999_exterminateRecords = [
  {
    playerId:   "kkV357",
    clearTime:  "0:52.000",
    uploadTime: "2026-05-19",
    videoUrls:  ["https://www.youtube.com/watch?v=Gqnyvtrijho"],
  },
  {
    playerId:   "RoniPrime",
    clearTime:  "2:52.000",
    uploadTime: "2026-01-08",
    videoUrls:  ["https://www.youtube.com/watch?v=X5_Z7q5ZqxQ"],
  },
  {
    playerId:   "NamelessDeity",
    clearTime:  "1:04.000",
    uploadTime: "2026-02-04",
    videoUrls:  ["https://www.youtube.com/watch?v=nAtBtFu6qHw"],
  },
  {
    playerId:   "Salat",
    clearTime:  "1:20.000",
    uploadTime: "2026-01-07",
    videoUrls:  ["https://www.youtube.com/watch?v=ws3wMH24tVo"],
  },
];

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var hollvania_1999_exterminateNotice_cn = "";
var hollvania_1999_exterminateNotice_en = "";
