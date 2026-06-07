/* ════════════════════════════════════════════════════════════
 *  刺杀 竞速排行榜  /  Assassination Speedrun Leaderboard
 *  数据文件：assassination-normal-exequias.js
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
 *  在下方 assassination_normal_exequiasRecords 数组中新增一个对象，如：
 *    {
 *      playerId:   "玩家名",
 *      clearTime:  "1:23.456",
 *      uploadTime: "2025-01-01",
 *      videoUrls:  ["https://..."],
 *    },
 * ════════════════════════════════════════════════════════════ */

var assassination_normal_exequiasRecords = [

  {
    playerId:   "Salat",
    clearTime:  "1:26.333",
    uploadTime: "2025-06-24",
    videoUrls:  ["https://www.youtube.com/watch?v=BfkCmo2FBgM"],
  },
  {
    playerId:   "sealmp4",
    clearTime:  "1:34.000",
    uploadTime: "2025-03-07",
    videoUrls:  ["https://www.youtube.com/watch?v=rrHJ5G60uJE"],
  },
  {
    playerId:   "Txdo",
    clearTime:  "1:37.065",
    uploadTime: "2025-01-12",
    videoUrls:  ["https://www.youtube.com/watch?v=w2medEICYvs"],
  },
  {
    playerId:   "Titoxx",
    clearTime:  "1:43.000",
    uploadTime: "2024-07-14",
    videoUrls:  ["https://www.youtube.com/watch?v=Q5cZU3CKqiA"],
  },
  {
    playerId:   "L1ndell",
    clearTime:  "1:54.000",
    uploadTime: "2022-01-05",
    videoUrls:  ["https://www.youtube.com/watch?v=k6f4FovCEUk"],
  },
];

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var assassination_normal_exequiasNotice_cn = "";
var assassination_normal_exequiasNotice_en = "";
