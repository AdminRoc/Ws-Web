/* ════════════════════════════════════════════════════════════
 *  仲裁任务 竞速排行榜  /  Arbitration Speedrun Leaderboard
 *  子分类：单小时生息精华数量 · 挖掘 / Vitus Essence Per Hour · Excavation
 *  数据文件：arbitration-hourly-vitus-excavation.js
 *  ┌──────────────────────────────────────────────────────┐
 *  │  字段说明：                                          │
 *  │    playerId  —— 玩家 ID（昵称）                      │
 *  │    essenceCount —— 生息精华数量（整数）            │
 *  │    uploadTime—— 成绩提交时间（格式：YYYY-MM-DD）      │
 *  │    videoUrls —— 视频链接数组；最多4个视角             │
 *  │  notice      —— 榜单标题下方的提醒框文字             │
 *  │                 留空字符串则不显示提醒框              │
 *  └──────────────────────────────────────────────────────┘
 *
 *  添加/修改记录方法：
 *  在下方 arbitration_hourly_vitus_excavationRecords 数组中新增一个对象；
 *  在 arbitration_hourly_vitus_excavationNotice 中填写提醒信息（可留空）。
 * ════════════════════════════════════════════════════════════ */

var arbitration_hourly_vitus_excavationRecords = [
  /* 暂无记录 */
];

/* 榜单提醒框信息（留空则不显示，用户可自行填写） */

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var arbitration_hourly_vitus_excavationNotice_cn = "  单小时的生息精华数量，将把当次任务结算时显示的生息精华数量，按任务的实际时长进行换算。此处的“任务实际时长”按“首尾帧”的方式计算，具体计算方式请参考“提交规则”内的“通用规则”文档。";
var arbitration_hourly_vitus_excavationNotice_en = "  Vitus Essence per hour converts the Vitus Essence amount shown on the mission's end-of-mission screen according to the mission's actual duration. Here, the \"actual mission duration\" is measured using the first-and-last-frame method; for the exact calculation, please refer to the \"General Rules\" document under \"Submission Rules\".";
