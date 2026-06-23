/* ════════════════════════════════════════════════════════════
 *  自动生成，请勿手动编辑本文件。
 *  本文件由 .github/scripts/bundle_data.py 把同目录下所有数据源文件
 *  拼接而成，用于减少 HTTP 请求数。要修改成绩数据，请编辑同目录下
 *  对应的单个 <分类>-<节点>.js 源文件，push 后会自动重建本文件。
 * ════════════════════════════════════════════════════════════ */

/* ===== data/arbitration/arbitration-hourly-vitus-alchemy.js ===== */
/* ════════════════════════════════════════════════════════════
 *  仲裁任务 竞速排行榜  /  Arbitration Speedrun Leaderboard
 *  子分类：单小时生息精华数量 · 元素转换 / Vitus Essence Per Hour · Alchemy
 *  数据文件：arbitration-hourly-vitus-alchemy.js
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
 *  在下方 arbitration_hourly_vitus_alchemyRecords 数组中新增一个对象；
 *  在 arbitration_hourly_vitus_alchemyNotice 中填写提醒信息（可留空）。
 * ════════════════════════════════════════════════════════════ */

var arbitration_hourly_vitus_alchemyRecords = [
  /* 暂无记录 */
];

/* 榜单提醒框信息（留空则不显示，用户可自行填写） */

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var arbitration_hourly_vitus_alchemyNotice_cn = "  换算生息精华速率时，将把当次任务结算时显示的生息精华数量，按任务的实际时长进行换算。此处的“任务实际时长”按“首尾帧”的方式计算，具体计算方式请参考“提交规则”内的“通用规则”文档。此外，参与本榜单的任务记录的“任务实际时长”需要大于等于一小时。其他上传成绩要求，请查看“提交规则”内的“通用规则”文档。";
var arbitration_hourly_vitus_alchemyNotice_en = "  When converting the Vitus Essence rate, the Vitus Essence amount shown on the mission's end-of-mission screen is converted according to the mission's actual duration. Here, the \"actual mission duration\" is measured using the first-and-last-frame method; for the exact calculation, please refer to the \"General Rules\" document under \"Submission Rules\". In addition, the \"actual mission duration\" of any run submitted to this leaderboard must be at least one hour. For other submission requirements, please refer to the \"General Rules\" document under \"Submission Rules\".";
;

/* ===== data/arbitration/arbitration-hourly-vitus-defection.js ===== */
/* ════════════════════════════════════════════════════════════
 *  仲裁任务 竞速排行榜  /  Arbitration Speedrun Leaderboard
 *  子分类：单小时生息精华数量 · 叛逃 / Vitus Essence Per Hour · Defection
 *  数据文件：arbitration-hourly-vitus-defection.js
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
 *  在下方 arbitration_hourly_vitus_defectionRecords 数组中新增一个对象；
 *  在 arbitration_hourly_vitus_defectionNotice 中填写提醒信息（可留空）。
 * ════════════════════════════════════════════════════════════ */

var arbitration_hourly_vitus_defectionRecords = [
  /* 暂无记录 */
];

/* 榜单提醒框信息（留空则不显示，用户可自行填写） */

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var arbitration_hourly_vitus_defectionNotice_cn = "  换算生息精华速率时，将把当次任务结算时显示的生息精华数量，按任务的实际时长进行换算。此处的“任务实际时长”按“首尾帧”的方式计算，具体计算方式请参考“提交规则”内的“通用规则”文档。此外，参与本榜单的任务记录的“任务实际时长”需要大于等于一小时。其他上传成绩要求，请查看“提交规则”内的“通用规则”文档。";
var arbitration_hourly_vitus_defectionNotice_en = "  When converting the Vitus Essence rate, the Vitus Essence amount shown on the mission's end-of-mission screen is converted according to the mission's actual duration. Here, the \"actual mission duration\" is measured using the first-and-last-frame method; for the exact calculation, please refer to the \"General Rules\" document under \"Submission Rules\". In addition, the \"actual mission duration\" of any run submitted to this leaderboard must be at least one hour. For other submission requirements, please refer to the \"General Rules\" document under \"Submission Rules\".";
;

/* ===== data/arbitration/arbitration-hourly-vitus-defense.js ===== */
/* ════════════════════════════════════════════════════════════
 *  仲裁任务 竞速排行榜  /  Arbitration Speedrun Leaderboard
 *  子分类：单小时生息精华数量 · 防御 / Vitus Essence Per Hour · Defense
 *  数据文件：arbitration-hourly-vitus-defense.js
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
 *  在下方 arbitration_hourly_vitus_defenseRecords 数组中新增一个对象；
 *  在 arbitration_hourly_vitus_defenseNotice 中填写提醒信息（可留空）。
 * ════════════════════════════════════════════════════════════ */

var arbitration_hourly_vitus_defenseRecords = [
  /* 暂无记录 */
];

/* 榜单提醒框信息（留空则不显示，用户可自行填写） */

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var arbitration_hourly_vitus_defenseNotice_cn = "  换算生息精华速率时，将把当次任务结算时显示的生息精华数量，按任务的实际时长进行换算。此处的“任务实际时长”按“首尾帧”的方式计算，具体计算方式请参考“提交规则”内的“通用规则”文档。此外，参与本榜单的任务记录的“任务实际时长”需要大于等于一小时。其他上传成绩要求，请查看“提交规则”内的“通用规则”文档。";
var arbitration_hourly_vitus_defenseNotice_en = "  When converting the Vitus Essence rate, the Vitus Essence amount shown on the mission's end-of-mission screen is converted according to the mission's actual duration. Here, the \"actual mission duration\" is measured using the first-and-last-frame method; for the exact calculation, please refer to the \"General Rules\" document under \"Submission Rules\". In addition, the \"actual mission duration\" of any run submitted to this leaderboard must be at least one hour. For other submission requirements, please refer to the \"General Rules\" document under \"Submission Rules\".";
;

/* ===== data/arbitration/arbitration-hourly-vitus-disruption.js ===== */
/* ════════════════════════════════════════════════════════════
 *  仲裁任务 竞速排行榜  /  Arbitration Speedrun Leaderboard
 *  子分类：单小时生息精华数量 · 中断 / Vitus Essence Per Hour · Disruption
 *  数据文件：arbitration-hourly-vitus-disruption.js
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
 *  在下方 arbitration_hourly_vitus_disruptionRecords 数组中新增一个对象；
 *  在 arbitration_hourly_vitus_disruptionNotice 中填写提醒信息（可留空）。
 * ════════════════════════════════════════════════════════════ */

var arbitration_hourly_vitus_disruptionRecords = [
  /* 暂无记录 */
];

/* 榜单提醒框信息（留空则不显示，用户可自行填写） */

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var arbitration_hourly_vitus_disruptionNotice_cn = "  换算生息精华速率时，将把当次任务结算时显示的生息精华数量，按任务的实际时长进行换算。此处的“任务实际时长”按“首尾帧”的方式计算，具体计算方式请参考“提交规则”内的“通用规则”文档。此外，参与本榜单的任务记录的“任务实际时长”需要大于等于一小时。其他上传成绩要求，请查看“提交规则”内的“通用规则”文档。";
var arbitration_hourly_vitus_disruptionNotice_en = "  When converting the Vitus Essence rate, the Vitus Essence amount shown on the mission's end-of-mission screen is converted according to the mission's actual duration. Here, the \"actual mission duration\" is measured using the first-and-last-frame method; for the exact calculation, please refer to the \"General Rules\" document under \"Submission Rules\". In addition, the \"actual mission duration\" of any run submitted to this leaderboard must be at least one hour. For other submission requirements, please refer to the \"General Rules\" document under \"Submission Rules\".";
;

/* ===== data/arbitration/arbitration-hourly-vitus-excavation.js ===== */
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
var arbitration_hourly_vitus_excavationNotice_cn = "  换算生息精华速率时，将把当次任务结算时显示的生息精华数量，按任务的实际时长进行换算。此处的“任务实际时长”按“首尾帧”的方式计算，具体计算方式请参考“提交规则”内的“通用规则”文档。此外，参与本榜单的任务记录的“任务实际时长”需要大于等于一小时。其他上传成绩要求，请查看“提交规则”内的“通用规则”文档。";
var arbitration_hourly_vitus_excavationNotice_en = "  When converting the Vitus Essence rate, the Vitus Essence amount shown on the mission's end-of-mission screen is converted according to the mission's actual duration. Here, the \"actual mission duration\" is measured using the first-and-last-frame method; for the exact calculation, please refer to the \"General Rules\" document under \"Submission Rules\". In addition, the \"actual mission duration\" of any run submitted to this leaderboard must be at least one hour. For other submission requirements, please refer to the \"General Rules\" document under \"Submission Rules\".";
;

/* ===== data/arbitration/arbitration-hourly-vitus-interception.js ===== */
/* ════════════════════════════════════════════════════════════
 *  仲裁任务 竞速排行榜  /  Arbitration Speedrun Leaderboard
 *  子分类：单小时生息精华数量 · 拦截 / Vitus Essence Per Hour · Interception
 *  数据文件：arbitration-hourly-vitus-interception.js
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
 *  在下方 arbitration_hourly_vitus_interceptionRecords 数组中新增一个对象；
 *  在 arbitration_hourly_vitus_interceptionNotice 中填写提醒信息（可留空）。
 * ════════════════════════════════════════════════════════════ */

var arbitration_hourly_vitus_interceptionRecords = [
  /* 暂无记录 */
];

/* 榜单提醒框信息（留空则不显示，用户可自行填写） */

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var arbitration_hourly_vitus_interceptionNotice_cn = "  换算生息精华速率时，将把当次任务结算时显示的生息精华数量，按任务的实际时长进行换算。此处的“任务实际时长”按“首尾帧”的方式计算，具体计算方式请参考“提交规则”内的“通用规则”文档。此外，参与本榜单的任务记录的“任务实际时长”需要大于等于一小时。其他上传成绩要求，请查看“提交规则”内的“通用规则”文档。";
var arbitration_hourly_vitus_interceptionNotice_en = "  When converting the Vitus Essence rate, the Vitus Essence amount shown on the mission's end-of-mission screen is converted according to the mission's actual duration. Here, the \"actual mission duration\" is measured using the first-and-last-frame method; for the exact calculation, please refer to the \"General Rules\" document under \"Submission Rules\". In addition, the \"actual mission duration\" of any run submitted to this leaderboard must be at least one hour. For other submission requirements, please refer to the \"General Rules\" document under \"Submission Rules\".";
;

/* ===== data/arbitration/arbitration-hourly-vitus-mirror-defense.js ===== */
/* ════════════════════════════════════════════════════════════
 *  仲裁任务 竞速排行榜  /  Arbitration Speedrun Leaderboard
 *  子分类：单小时生息精华数量 · 镜像防御 / Vitus Essence Per Hour · Mirror Defense
 *  数据文件：arbitration-hourly-vitus-mirror-defense.js
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
 *  在下方 arbitration_hourly_vitus_mirror_defenseRecords 数组中新增一个对象；
 *  在 arbitration_hourly_vitus_mirror_defenseNotice 中填写提醒信息（可留空）。
 * ════════════════════════════════════════════════════════════ */

var arbitration_hourly_vitus_mirror_defenseRecords = [
  /* 暂无记录 */
];

/* 榜单提醒框信息（留空则不显示，用户可自行填写） */

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var arbitration_hourly_vitus_mirror_defenseNotice_cn = "  换算生息精华速率时，将把当次任务结算时显示的生息精华数量，按任务的实际时长进行换算。此处的“任务实际时长”按“首尾帧”的方式计算，具体计算方式请参考“提交规则”内的“通用规则”文档。此外，参与本榜单的任务记录的“任务实际时长”需要大于等于一小时。其他上传成绩要求，请查看“提交规则”内的“通用规则”文档。";
var arbitration_hourly_vitus_mirror_defenseNotice_en = "  When converting the Vitus Essence rate, the Vitus Essence amount shown on the mission's end-of-mission screen is converted according to the mission's actual duration. Here, the \"actual mission duration\" is measured using the first-and-last-frame method; for the exact calculation, please refer to the \"General Rules\" document under \"Submission Rules\". In addition, the \"actual mission duration\" of any run submitted to this leaderboard must be at least one hour. For other submission requirements, please refer to the \"General Rules\" document under \"Submission Rules\".";
;

/* ===== data/arbitration/arbitration-hourly-vitus-salvage.js ===== */
/* ════════════════════════════════════════════════════════════
 *  仲裁任务 竞速排行榜  /  Arbitration Speedrun Leaderboard
 *  子分类：单小时生息精华数量 · 资源回收 / Vitus Essence Per Hour · Salvage
 *  数据文件：arbitration-hourly-vitus-salvage.js
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
 *  在下方 arbitration_hourly_vitus_salvageRecords 数组中新增一个对象；
 *  在 arbitration_hourly_vitus_salvageNotice 中填写提醒信息（可留空）。
 * ════════════════════════════════════════════════════════════ */

var arbitration_hourly_vitus_salvageRecords = [
  /* 暂无记录 */
];

/* 榜单提醒框信息（留空则不显示，用户可自行填写） */

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var arbitration_hourly_vitus_salvageNotice_cn = "  换算生息精华速率时，将把当次任务结算时显示的生息精华数量，按任务的实际时长进行换算。此处的“任务实际时长”按“首尾帧”的方式计算，具体计算方式请参考“提交规则”内的“通用规则”文档。此外，参与本榜单的任务记录的“任务实际时长”需要大于等于一小时。其他上传成绩要求，请查看“提交规则”内的“通用规则”文档。";
var arbitration_hourly_vitus_salvageNotice_en = "  When converting the Vitus Essence rate, the Vitus Essence amount shown on the mission's end-of-mission screen is converted according to the mission's actual duration. Here, the \"actual mission duration\" is measured using the first-and-last-frame method; for the exact calculation, please refer to the \"General Rules\" document under \"Submission Rules\". In addition, the \"actual mission duration\" of any run submitted to this leaderboard must be at least one hour. For other submission requirements, please refer to the \"General Rules\" document under \"Submission Rules\".";
;

/* ===== data/arbitration/arbitration-hourly-vitus-survival.js ===== */
/* ════════════════════════════════════════════════════════════
 *  仲裁任务 竞速排行榜  /  Arbitration Speedrun Leaderboard
 *  子分类：单小时生息精华数量 · 生存 / Vitus Essence Per Hour · Survival
 *  数据文件：arbitration-hourly-vitus-survival.js
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
 *  在下方 arbitration_hourly_vitus_survivalRecords 数组中新增一个对象；
 *  在 arbitration_hourly_vitus_survivalNotice 中填写提醒信息（可留空）。
 * ════════════════════════════════════════════════════════════ */

var arbitration_hourly_vitus_survivalRecords = [
  /* 暂无记录 */
];

/* 榜单提醒框信息（留空则不显示，用户可自行填写） */

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var arbitration_hourly_vitus_survivalNotice_cn = "  换算生息精华速率时，将把当次任务结算时显示的生息精华数量，按任务的实际时长进行换算。此处的“任务实际时长”按“首尾帧”的方式计算，具体计算方式请参考“提交规则”内的“通用规则”文档。此外，参与本榜单的任务记录的“任务实际时长”需要大于等于一小时。其他上传成绩要求，请查看“提交规则”内的“通用规则”文档。";
var arbitration_hourly_vitus_survivalNotice_en = "  When converting the Vitus Essence rate, the Vitus Essence amount shown on the mission's end-of-mission screen is converted according to the mission's actual duration. Here, the \"actual mission duration\" is measured using the first-and-last-frame method; for the exact calculation, please refer to the \"General Rules\" document under \"Submission Rules\". In addition, the \"actual mission duration\" of any run submitted to this leaderboard must be at least one hour. For other submission requirements, please refer to the \"General Rules\" document under \"Submission Rules\".";
;

/* ===== data/arbitration/arbitration-hourly-vitus-void-armageddon.js ===== */
/* ════════════════════════════════════════════════════════════
 *  仲裁任务 竞速排行榜  /  Arbitration Speedrun Leaderboard
 *  子分类：单小时生息精华数量 · 虚空决战 / Vitus Essence Per Hour · Void Armageddon
 *  数据文件：arbitration-hourly-vitus-void-armageddon.js
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
 *  在下方 arbitration_hourly_vitus_void_armageddonRecords 数组中新增一个对象；
 *  在 arbitration_hourly_vitus_void_armageddonNotice 中填写提醒信息（可留空）。
 * ════════════════════════════════════════════════════════════ */

var arbitration_hourly_vitus_void_armageddonRecords = [
  /* 暂无记录 */
];

/* 榜单提醒框信息（留空则不显示，用户可自行填写） */

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var arbitration_hourly_vitus_void_armageddonNotice_cn = "  换算生息精华速率时，将把当次任务结算时显示的生息精华数量，按任务的实际时长进行换算。此处的“任务实际时长”按“首尾帧”的方式计算，具体计算方式请参考“提交规则”内的“通用规则”文档。此外，参与本榜单的任务记录的“任务实际时长”需要大于等于一小时。其他上传成绩要求，请查看“提交规则”内的“通用规则”文档。";
var arbitration_hourly_vitus_void_armageddonNotice_en = "  When converting the Vitus Essence rate, the Vitus Essence amount shown on the mission's end-of-mission screen is converted according to the mission's actual duration. Here, the \"actual mission duration\" is measured using the first-and-last-frame method; for the exact calculation, please refer to the \"General Rules\" document under \"Submission Rules\". In addition, the \"actual mission duration\" of any run submitted to this leaderboard must be at least one hour. For other submission requirements, please refer to the \"General Rules\" document under \"Submission Rules\".";
;

/* ===== data/arbitration/arbitration-hourly-vitus-void-cascade.js ===== */
/* ════════════════════════════════════════════════════════════
 *  仲裁任务 竞速排行榜  /  Arbitration Speedrun Leaderboard
 *  子分类：单小时生息精华数量 · 虚空覆涌 / Vitus Essence Per Hour · Void Cascade
 *  数据文件：arbitration-hourly-vitus-void-cascade.js
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
 *  在下方 arbitration_hourly_vitus_void_cascadeRecords 数组中新增一个对象；
 *  在 arbitration_hourly_vitus_void_cascadeNotice 中填写提醒信息（可留空）。
 * ════════════════════════════════════════════════════════════ */

var arbitration_hourly_vitus_void_cascadeRecords = [
  /* 暂无记录 */
];

/* 榜单提醒框信息（留空则不显示，用户可自行填写） */

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var arbitration_hourly_vitus_void_cascadeNotice_cn = "  换算生息精华速率时，将把当次任务结算时显示的生息精华数量，按任务的实际时长进行换算。此处的“任务实际时长”按“首尾帧”的方式计算，具体计算方式请参考“提交规则”内的“通用规则”文档。此外，参与本榜单的任务记录的“任务实际时长”需要大于等于一小时。其他上传成绩要求，请查看“提交规则”内的“通用规则”文档。";
var arbitration_hourly_vitus_void_cascadeNotice_en = "  When converting the Vitus Essence rate, the Vitus Essence amount shown on the mission's end-of-mission screen is converted according to the mission's actual duration. Here, the \"actual mission duration\" is measured using the first-and-last-frame method; for the exact calculation, please refer to the \"General Rules\" document under \"Submission Rules\". In addition, the \"actual mission duration\" of any run submitted to this leaderboard must be at least one hour. For other submission requirements, please refer to the \"General Rules\" document under \"Submission Rules\".";
;

/* ===== data/arbitration/arbitration-hourly-vitus-void-flood.js ===== */
/* ════════════════════════════════════════════════════════════
 *  仲裁任务 竞速排行榜  /  Arbitration Speedrun Leaderboard
 *  子分类：单小时生息精华数量 · 虚空洪流 / Vitus Essence Per Hour · Void Flood
 *  数据文件：arbitration-hourly-vitus-void-flood.js
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
 *  在下方 arbitration_hourly_vitus_void_floodRecords 数组中新增一个对象；
 *  在 arbitration_hourly_vitus_void_floodNotice 中填写提醒信息（可留空）。
 * ════════════════════════════════════════════════════════════ */

var arbitration_hourly_vitus_void_floodRecords = [
  /* 暂无记录 */
];

/* 榜单提醒框信息（留空则不显示，用户可自行填写） */

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var arbitration_hourly_vitus_void_floodNotice_cn = "  换算生息精华速率时，将把当次任务结算时显示的生息精华数量，按任务的实际时长进行换算。此处的“任务实际时长”按“首尾帧”的方式计算，具体计算方式请参考“提交规则”内的“通用规则”文档。此外，参与本榜单的任务记录的“任务实际时长”需要大于等于一小时。其他上传成绩要求，请查看“提交规则”内的“通用规则”文档。";
var arbitration_hourly_vitus_void_floodNotice_en = "  When converting the Vitus Essence rate, the Vitus Essence amount shown on the mission's end-of-mission screen is converted according to the mission's actual duration. Here, the \"actual mission duration\" is measured using the first-and-last-frame method; for the exact calculation, please refer to the \"General Rules\" document under \"Submission Rules\". In addition, the \"actual mission duration\" of any run submitted to this leaderboard must be at least one hour. For other submission requirements, please refer to the \"General Rules\" document under \"Submission Rules\".";
;

/* ===== data/arbitration/arbitration-rounds-alchemy.js ===== */
/* ════════════════════════════════════════════════════════════
 *  仲裁任务 竞速排行榜  /  Arbitration Speedrun Leaderboard
 *  子分类：标准轮次竞速 · 元素转换 / Confirmed Rounds Racing · Alchemy
 *  数据文件：arbitration-rounds-alchemy.js
 *  ┌──────────────────────────────────────────────────────┐
 *  │  字段说明：                                          │
 *  │    playerId  —— 玩家 ID（昵称）                      │
 *  │    clearTime —— 时间（格式：mm:ss.ms）            │
 *  │    uploadTime—— 成绩提交时间（格式：YYYY-MM-DD）      │
 *  │    videoUrls —— 视频链接数组；最多4个视角             │
 *  │  notice      —— 榜单标题下方的提醒框文字             │
 *  │                 留空字符串则不显示提醒框              │
 *  └──────────────────────────────────────────────────────┘
 *
 *  添加/修改记录方法：
 *  在下方 arbitration_rounds_alchemyRecords 数组中新增一个对象；
 *  在 arbitration_rounds_alchemyNotice 中填写提醒信息（可留空）。
 * ════════════════════════════════════════════════════════════ */

var arbitration_rounds_alchemyRecords = [
  /* 暂无记录 */
];

/* 榜单提醒框信息（留空则不显示，用户可自行填写） */

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var arbitration_rounds_alchemyNotice_cn = "  【暂定的标准轮次为：30轮】（在任务全程期间，主动放弃拾取生息精华的次数不得超过3次）";
var arbitration_rounds_alchemyNotice_en = "  [Tentative standard rounds: 30] (Throughout the entire mission, deliberately forgoing Vitus Essence pickups is allowed no more than 3 times)";
;

/* ===== data/arbitration/arbitration-rounds-defection.js ===== */
/* ════════════════════════════════════════════════════════════
 *  仲裁任务 竞速排行榜  /  Arbitration Speedrun Leaderboard
 *  子分类：标准轮次竞速 · 叛逃 / Confirmed Rounds Racing · Defection
 *  数据文件：arbitration-rounds-defection.js
 *  ┌──────────────────────────────────────────────────────┐
 *  │  字段说明：                                          │
 *  │    playerId  —— 玩家 ID（昵称）                      │
 *  │    clearTime —— 时间（格式：mm:ss.ms）            │
 *  │    uploadTime—— 成绩提交时间（格式：YYYY-MM-DD）      │
 *  │    videoUrls —— 视频链接数组；最多4个视角             │
 *  │  notice      —— 榜单标题下方的提醒框文字             │
 *  │                 留空字符串则不显示提醒框              │
 *  └──────────────────────────────────────────────────────┘
 *
 *  添加/修改记录方法：
 *  在下方 arbitration_rounds_defectionRecords 数组中新增一个对象；
 *  在 arbitration_rounds_defectionNotice 中填写提醒信息（可留空）。
 * ════════════════════════════════════════════════════════════ */

var arbitration_rounds_defectionRecords = [
  /* 暂无记录 */
];

/* 榜单提醒框信息（留空则不显示，用户可自行填写） */

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var arbitration_rounds_defectionNotice_cn = "  【暂定的标准轮次为：15轮】（在任务全程期间，主动放弃拾取生息精华的次数不得超过3次）";
var arbitration_rounds_defectionNotice_en = "  [Tentative standard rounds: 15] (Throughout the entire mission, deliberately forgoing Vitus Essence pickups is allowed no more than 3 times)";
;

/* ===== data/arbitration/arbitration-rounds-defense.js ===== */
/* ════════════════════════════════════════════════════════════
 *  仲裁任务 竞速排行榜  /  Arbitration Speedrun Leaderboard
 *  子分类：标准轮次竞速 · 防御 / Confirmed Rounds Racing · Defense
 *  数据文件：arbitration-rounds-defense.js
 *  ┌──────────────────────────────────────────────────────┐
 *  │  字段说明：                                          │
 *  │    playerId  —— 玩家 ID（昵称）                      │
 *  │    clearTime —— 时间（格式：mm:ss.ms）            │
 *  │    uploadTime—— 成绩提交时间（格式：YYYY-MM-DD）      │
 *  │    videoUrls —— 视频链接数组；最多4个视角             │
 *  │  notice      —— 榜单标题下方的提醒框文字             │
 *  │                 留空字符串则不显示提醒框              │
 *  └──────────────────────────────────────────────────────┘
 *
 *  添加/修改记录方法：
 *  在下方 arbitration_rounds_defenseRecords 数组中新增一个对象；
 *  在 arbitration_rounds_defenseNotice 中填写提醒信息（可留空）。
 * ════════════════════════════════════════════════════════════ */

var arbitration_rounds_defenseRecords = [
  /* 暂无记录 */
];

/* 榜单提醒框信息（留空则不显示，用户可自行填写） */

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var arbitration_rounds_defenseNotice_cn = "  【暂定的标准轮次为：81轮】（在任务全程期间，主动放弃拾取生息精华的次数不得超过3次）";
var arbitration_rounds_defenseNotice_en = "  [Tentative standard waves: 81] (Throughout the entire mission, deliberately forgoing Vitus Essence pickups is allowed no more than 3 times)";
;

/* ===== data/arbitration/arbitration-rounds-disruption.js ===== */
/* ════════════════════════════════════════════════════════════
 *  仲裁任务 竞速排行榜  /  Arbitration Speedrun Leaderboard
 *  子分类：标准轮次竞速 · 中断 / Confirmed Rounds Racing · Disruption
 *  数据文件：arbitration-rounds-disruption.js
 *  ┌──────────────────────────────────────────────────────┐
 *  │  字段说明：                                          │
 *  │    playerId  —— 玩家 ID（昵称）                      │
 *  │    clearTime —— 时间（格式：mm:ss.ms）            │
 *  │    uploadTime—— 成绩提交时间（格式：YYYY-MM-DD）      │
 *  │    videoUrls —— 视频链接数组；最多4个视角             │
 *  │  notice      —— 榜单标题下方的提醒框文字             │
 *  │                 留空字符串则不显示提醒框              │
 *  └──────────────────────────────────────────────────────┘
 *
 *  添加/修改记录方法：
 *  在下方 arbitration_rounds_disruptionRecords 数组中新增一个对象；
 *  在 arbitration_rounds_disruptionNotice 中填写提醒信息（可留空）。
 * ════════════════════════════════════════════════════════════ */

var arbitration_rounds_disruptionRecords = [
  /* 暂无记录 */
];

/* 榜单提醒框信息（留空则不显示，用户可自行填写） */

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var arbitration_rounds_disruptionNotice_cn = "  【暂定的标准轮次为：45轮】（在任务全程期间，主动放弃拾取生息精华的次数不得超过3次）";
var arbitration_rounds_disruptionNotice_en = "  [Tentative standard rounds: 45] (Throughout the entire mission, deliberately forgoing Vitus Essence pickups is allowed no more than 3 times)";
;

/* ===== data/arbitration/arbitration-rounds-excavation.js ===== */
/* ════════════════════════════════════════════════════════════
 *  仲裁任务 竞速排行榜  /  Arbitration Speedrun Leaderboard
 *  子分类：标准轮次竞速 · 挖掘 / Confirmed Rounds Racing · Excavation
 *  数据文件：arbitration-rounds-excavation.js
 *  ┌──────────────────────────────────────────────────────┐
 *  │  字段说明：                                          │
 *  │    playerId  —— 玩家 ID（昵称）                      │
 *  │    clearTime —— 时间（格式：mm:ss.ms）            │
 *  │    uploadTime—— 成绩提交时间（格式：YYYY-MM-DD）      │
 *  │    videoUrls —— 视频链接数组；最多4个视角             │
 *  │  notice      —— 榜单标题下方的提醒框文字             │
 *  │                 留空字符串则不显示提醒框              │
 *  └──────────────────────────────────────────────────────┘
 *
 *  添加/修改记录方法：
 *  在下方 arbitration_rounds_excavationRecords 数组中新增一个对象；
 *  在 arbitration_rounds_excavationNotice 中填写提醒信息（可留空）。
 * ════════════════════════════════════════════════════════════ */

var arbitration_rounds_excavationRecords = [
  /* 暂无记录 */
];

/* 榜单提醒框信息（留空则不显示，用户可自行填写） */

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var arbitration_rounds_excavationNotice_cn = "  【暂定的标准轮次为：20轮】（在任务全程期间，主动放弃拾取生息精华的次数不得超过3次）";
var arbitration_rounds_excavationNotice_en = "  [Tentative standard rounds: 20] (Throughout the entire mission, deliberately forgoing Vitus Essence pickups is allowed no more than 3 times)";
;

/* ===== data/arbitration/arbitration-rounds-interception.js ===== */
/* ════════════════════════════════════════════════════════════
 *  仲裁任务 竞速排行榜  /  Arbitration Speedrun Leaderboard
 *  子分类：标准轮次竞速 · 拦截 / Confirmed Rounds Racing · Interception
 *  数据文件：arbitration-rounds-interception.js
 *  ┌──────────────────────────────────────────────────────┐
 *  │  字段说明：                                          │
 *  │    playerId  —— 玩家 ID（昵称）                      │
 *  │    clearTime —— 时间（格式：mm:ss.ms）            │
 *  │    uploadTime—— 成绩提交时间（格式：YYYY-MM-DD）      │
 *  │    videoUrls —— 视频链接数组；最多4个视角             │
 *  │  notice      —— 榜单标题下方的提醒框文字             │
 *  │                 留空字符串则不显示提醒框              │
 *  └──────────────────────────────────────────────────────┘
 *
 *  添加/修改记录方法：
 *  在下方 arbitration_rounds_interceptionRecords 数组中新增一个对象；
 *  在 arbitration_rounds_interceptionNotice 中填写提醒信息（可留空）。
 * ════════════════════════════════════════════════════════════ */

var arbitration_rounds_interceptionRecords = [
  /* 暂无记录 */
];

/* 榜单提醒框信息（留空则不显示，用户可自行填写） */

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var arbitration_rounds_interceptionNotice_cn = "  【暂定的标准轮次为：8轮】（在任务全程期间，主动放弃拾取生息精华的次数不得超过3次）";
var arbitration_rounds_interceptionNotice_en = "  [Tentative standard rounds: 8] (Throughout the entire mission, deliberately forgoing Vitus Essence pickups is allowed no more than 3 times)";
;

/* ===== data/arbitration/arbitration-rounds-mirror-defense.js ===== */
/* ════════════════════════════════════════════════════════════
 *  仲裁任务 竞速排行榜  /  Arbitration Speedrun Leaderboard
 *  子分类：标准轮次竞速 · 镜像防御 / Confirmed Rounds Racing · Mirror Defense
 *  数据文件：arbitration-rounds-mirror-defense.js
 *  ┌──────────────────────────────────────────────────────┐
 *  │  字段说明：                                          │
 *  │    playerId  —— 玩家 ID（昵称）                      │
 *  │    clearTime —— 时间（格式：mm:ss.ms）            │
 *  │    uploadTime—— 成绩提交时间（格式：YYYY-MM-DD）      │
 *  │    videoUrls —— 视频链接数组；最多4个视角             │
 *  │  notice      —— 榜单标题下方的提醒框文字             │
 *  │                 留空字符串则不显示提醒框              │
 *  └──────────────────────────────────────────────────────┘
 *
 *  添加/修改记录方法：
 *  在下方 arbitration_rounds_mirror_defenseRecords 数组中新增一个对象；
 *  在 arbitration_rounds_mirror_defenseNotice 中填写提醒信息（可留空）。
 * ════════════════════════════════════════════════════════════ */

var arbitration_rounds_mirror_defenseRecords = [
  /* 暂无记录 */
];

/* 榜单提醒框信息（留空则不显示，用户可自行填写） */

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var arbitration_rounds_mirror_defenseNotice_cn = "  【镜像防御这一游戏模式，几乎无法干预完成的总时间，故暂时不接收标准轮次竞速的成绩提交】";
var arbitration_rounds_mirror_defenseNotice_en = "  [Mirror Defense offers almost no way to influence the total completion time, so Confirmed Rounds Racing submissions are temporarily not accepted for this mode]";
;

/* ===== data/arbitration/arbitration-rounds-salvage.js ===== */
/* ════════════════════════════════════════════════════════════
 *  仲裁任务 竞速排行榜  /  Arbitration Speedrun Leaderboard
 *  子分类：标准轮次竞速 · 资源回收 / Confirmed Rounds Racing · Salvage
 *  数据文件：arbitration-rounds-salvage.js
 *  ┌──────────────────────────────────────────────────────┐
 *  │  字段说明：                                          │
 *  │    playerId  —— 玩家 ID（昵称）                      │
 *  │    clearTime —— 时间（格式：mm:ss.ms）            │
 *  │    uploadTime—— 成绩提交时间（格式：YYYY-MM-DD）      │
 *  │    videoUrls —— 视频链接数组；最多4个视角             │
 *  │  notice      —— 榜单标题下方的提醒框文字             │
 *  │                 留空字符串则不显示提醒框              │
 *  └──────────────────────────────────────────────────────┘
 *
 *  添加/修改记录方法：
 *  在下方 arbitration_rounds_salvageRecords 数组中新增一个对象；
 *  在 arbitration_rounds_salvageNotice 中填写提醒信息（可留空）。
 * ════════════════════════════════════════════════════════════ */

var arbitration_rounds_salvageRecords = [
  /* 暂无记录 */
];

/* 榜单提醒框信息（留空则不显示，用户可自行填写） */

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var arbitration_rounds_salvageNotice_cn = "  【暂定的标准轮次为：8轮】（在任务全程期间，主动放弃拾取生息精华的次数不得超过3次）";
var arbitration_rounds_salvageNotice_en = "  [Tentative standard rounds: 8] (Throughout the entire mission, deliberately forgoing Vitus Essence pickups is allowed no more than 3 times)";
;

/* ===== data/arbitration/arbitration-rounds-survival.js ===== */
/* ════════════════════════════════════════════════════════════
 *  仲裁任务 竞速排行榜  /  Arbitration Speedrun Leaderboard
 *  子分类：标准轮次竞速 · 生存 / Confirmed Rounds Racing · Survival
 *  数据文件：arbitration-rounds-survival.js
 *  ┌──────────────────────────────────────────────────────┐
 *  │  字段说明：                                          │
 *  │    playerId  —— 玩家 ID（昵称）                      │
 *  │    clearTime —— 时间（格式：mm:ss.ms）            │
 *  │    uploadTime—— 成绩提交时间（格式：YYYY-MM-DD）      │
 *  │    videoUrls —— 视频链接数组；最多4个视角             │
 *  │  notice      —— 榜单标题下方的提醒框文字             │
 *  │                 留空字符串则不显示提醒框              │
 *  └──────────────────────────────────────────────────────┘
 *
 *  添加/修改记录方法：
 *  在下方 arbitration_rounds_survivalRecords 数组中新增一个对象；
 *  在 arbitration_rounds_survivalNotice 中填写提醒信息（可留空）。
 * ════════════════════════════════════════════════════════════ */

var arbitration_rounds_survivalRecords = [
  /* 暂无记录 */
];

/* 榜单提醒框信息（留空则不显示，用户可自行填写） */

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var arbitration_rounds_survivalNotice_cn = "  【暂定的标准轮次时间为：60分钟】（在任务全程期间，主动放弃拾取生息精华的次数不得超过3次）";
var arbitration_rounds_survivalNotice_en = "  [Tentative standard duration: 60 minutes] (Throughout the entire mission, deliberately forgoing Vitus Essence pickups is allowed no more than 3 times)";
;

/* ===== data/arbitration/arbitration-rounds-void-armageddon.js ===== */
/* ════════════════════════════════════════════════════════════
 *  仲裁任务 竞速排行榜  /  Arbitration Speedrun Leaderboard
 *  子分类：标准轮次竞速 · 虚空决战 / Confirmed Rounds Racing · Void Armageddon
 *  数据文件：arbitration-rounds-void-armageddon.js
 *  ┌──────────────────────────────────────────────────────┐
 *  │  字段说明：                                          │
 *  │    playerId  —— 玩家 ID（昵称）                      │
 *  │    clearTime —— 时间（格式：mm:ss.ms）            │
 *  │    uploadTime—— 成绩提交时间（格式：YYYY-MM-DD）      │
 *  │    videoUrls —— 视频链接数组；最多4个视角             │
 *  │  notice      —— 榜单标题下方的提醒框文字             │
 *  │                 留空字符串则不显示提醒框              │
 *  └──────────────────────────────────────────────────────┘
 *
 *  添加/修改记录方法：
 *  在下方 arbitration_rounds_void_armageddonRecords 数组中新增一个对象；
 *  在 arbitration_rounds_void_armageddonNotice 中填写提醒信息（可留空）。
 * ════════════════════════════════════════════════════════════ */

var arbitration_rounds_void_armageddonRecords = [
  /* 暂无记录 */
];

/* 榜单提醒框信息（留空则不显示，用户可自行填写） */

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var arbitration_rounds_void_armageddonNotice_cn = "  【暂定的标准轮次为：60分钟】（在任务全程期间，主动放弃拾取生息精华的次数不得超过3次）";
var arbitration_rounds_void_armageddonNotice_en = "  [Tentative standard duration: 60 minutes] (Throughout the entire mission, deliberately forgoing Vitus Essence pickups is allowed no more than 3 times)";
;

/* ===== data/arbitration/arbitration-rounds-void-cascade.js ===== */
/* ════════════════════════════════════════════════════════════
 *  仲裁任务 竞速排行榜  /  Arbitration Speedrun Leaderboard
 *  子分类：标准轮次竞速 · 虚空覆涌 / Confirmed Rounds Racing · Void Cascade
 *  数据文件：arbitration-rounds-void-cascade.js
 *  ┌──────────────────────────────────────────────────────┐
 *  │  字段说明：                                          │
 *  │    playerId  —— 玩家 ID（昵称）                      │
 *  │    clearTime —— 时间（格式：mm:ss.ms）            │
 *  │    uploadTime—— 成绩提交时间（格式：YYYY-MM-DD）      │
 *  │    videoUrls —— 视频链接数组；最多4个视角             │
 *  │  notice      —— 榜单标题下方的提醒框文字             │
 *  │                 留空字符串则不显示提醒框              │
 *  └──────────────────────────────────────────────────────┘
 *
 *  添加/修改记录方法：
 *  在下方 arbitration_rounds_void_cascadeRecords 数组中新增一个对象；
 *  在 arbitration_rounds_void_cascadeNotice 中填写提醒信息（可留空）。
 * ════════════════════════════════════════════════════════════ */

var arbitration_rounds_void_cascadeRecords = [
  /* 暂无记录 */
];

/* 榜单提醒框信息（留空则不显示，用户可自行填写） */

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var arbitration_rounds_void_cascadeNotice_cn = "  【暂定的标准轮次为：8轮】（在任务全程期间，主动放弃拾取生息精华的次数不得超过3次）";
var arbitration_rounds_void_cascadeNotice_en = "  [Tentative standard rounds: 8] (Throughout the entire mission, deliberately forgoing Vitus Essence pickups is allowed no more than 3 times)";
;

/* ===== data/arbitration/arbitration-rounds-void-flood.js ===== */
/* ════════════════════════════════════════════════════════════
 *  仲裁任务 竞速排行榜  /  Arbitration Speedrun Leaderboard
 *  子分类：标准轮次竞速 · 虚空洪流 / Confirmed Rounds Racing · Void Flood
 *  数据文件：arbitration-rounds-void-flood.js
 *  ┌──────────────────────────────────────────────────────┐
 *  │  字段说明：                                          │
 *  │    playerId  —— 玩家 ID（昵称）                      │
 *  │    clearTime —— 时间（格式：mm:ss.ms）            │
 *  │    uploadTime—— 成绩提交时间（格式：YYYY-MM-DD）      │
 *  │    videoUrls —— 视频链接数组；最多4个视角             │
 *  │  notice      —— 榜单标题下方的提醒框文字             │
 *  │                 留空字符串则不显示提醒框              │
 *  └──────────────────────────────────────────────────────┘
 *
 *  添加/修改记录方法：
 *  在下方 arbitration_rounds_void_floodRecords 数组中新增一个对象；
 *  在 arbitration_rounds_void_floodNotice 中填写提醒信息（可留空）。
 * ════════════════════════════════════════════════════════════ */

var arbitration_rounds_void_floodRecords = [
  /* 暂无记录 */
];

/* 榜单提醒框信息（留空则不显示，用户可自行填写） */

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var arbitration_rounds_void_floodNotice_cn = "  【暂定的标准轮次为：8轮】（在任务全程期间，主动放弃拾取生息精华的次数不得超过3次）";
var arbitration_rounds_void_floodNotice_en = "  [Tentative standard rounds: 8] (Throughout the entire mission, deliberately forgoing Vitus Essence pickups is allowed no more than 3 times)";
;
