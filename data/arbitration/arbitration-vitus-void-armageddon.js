/* ════════════════════════════════════════════════════════════
 *  仲裁任务 竞速排行榜  /  Arbitration Speedrun Leaderboard
 *  子分类：1000生息精华 · 虚空决战 / 1000 Vitus Essence · Void Armageddon
 *  数据文件：arbitration-vitus-void-armageddon.js
 *  ┌──────────────────────────────────────────────────────┐
 *  │  字段说明：                                          │
 *  │    playerId  —— 玩家 ID（昵称）                      │
 *  │    clearTime —— 结算时间（格式：mm:ss.ms）            │
 *  │    uploadTime—— 成绩提交时间（格式：YYYY-MM-DD）      │
 *  │    videoUrls —— 视频链接数组；最多4个视角             │
 *  │  notice      —— 榜单标题下方的提醒框文字             │
 *  │                 留空字符串则不显示提醒框              │
 *  └──────────────────────────────────────────────────────┘
 *
 *  添加/修改记录方法：
 *  在下方 arbitration_vitus_void_armageddonRecords 数组中新增一个对象；
 *  在 arbitration_vitus_void_armageddonNotice 中填写提醒信息（可留空）。
 * ════════════════════════════════════════════════════════════ */

var arbitration_vitus_void_armageddonRecords = [
  /* 暂无记录 */
];

/* 榜单提醒框信息（留空则不显示，用户可自行填写） */

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var arbitration_vitus_void_armageddonNotice_cn = "";
var arbitration_vitus_void_armageddonNotice_en = "";
