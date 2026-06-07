/* ════════════════════════════════════════════════════════════
 *  防御裂缝78轮 竞速排行榜  /  Defense Relic 78 Rounds Speedrun Leaderboard
 *  数据文件：defense-relic-normal-hyf.js
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
 *  在下方 defense_relic_normal_hyfRecords 数组中新增一个对象，如：
 *    {
 *      playerId:   "玩家名",
 *      clearTime:  "1:23.456",
 *      uploadTime: "2025-01-01",
 *      videoUrls:  ["https://..."],
 *    },
 * ════════════════════════════════════════════════════════════ */

var defense_relic_normal_hyfRecords = [
  /* 暂无记录 */
];

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var defense_relic_normal_hyfNotice_cn = "请注意，每一轮必须确保所有队伍成员达到 10/10 反应物的状态，且必须全部选择核桃。";
var defense_relic_normal_hyfNotice_en = "All squad members must collect 10/10 Reactants in each round. All players must select a Void Relic.";
