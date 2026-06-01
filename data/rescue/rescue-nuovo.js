/* ════════════════════════════════════════════════════════════
 *  救援 竞速排行榜  /  Rescue Speedrun Leaderboard
 *  数据文件：rescue-nuovo.js
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
 *  在下方 rescue_nuovoRecords 数组中新增一个对象，如：
 *    {
 *      playerId:   "玩家名",
 *      clearTime:  "1:23.456",
 *      uploadTime: "2025-01-01",
 *      videoUrls:  ["https://..."],
 *    },
 * ════════════════════════════════════════════════════════════ */

var rescue_nuovoRecords = [
  {
    playerId:   "Salat",
    clearTime:  "0:19.550",
    uploadTime: "2025-10-09",
    videoUrls:  ["https://www.youtube.com/watch?v=ts7LwIkbWf8"],
  },
  {
    playerId:   "L1ndell",
    clearTime:  "0:24.000",
    uploadTime: "2022-08-02",
    videoUrls:  ["https://www.youtube.com/watch?v=1RXGFJlA7-k"],
  },
  {
    playerId:   "PrimedDarkeN",
    clearTime:  "0:26.000",
    uploadTime: "2022-06-28",
    videoUrls:  ["https://www.youtube.com/watch?v=vms0P7IK3RE"],
  },
];

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var rescue_nuovoNotice_cn = "";
var rescue_nuovoNotice_en = "";
