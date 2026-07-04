/**
 * ════════════════════════════════════════════════════════════
 *  data/disruption-olympus-solo.js  —  中断竞速（Olympus·单人）数据文件
 *
 *  字段说明：
 *    clearTime  —— 时间，格式 "MM:SS.mmm"  例："01:23.456"
 *    playerId   —— 玩家 ID
 *    uploadTime —— 上传日期，格式 "YYYY-MM-DD"
 *    videoUrls  —— 视频链接数组；最多4个视角 ["url1","url2",...]
 *
 *  排名规则：脚本按 clearTime 从小到大自动排序，无需手动填写排名
 *  新增条目：在数组末尾复制模板并填写字段，保存后刷新页面生效
 * ════════════════════════════════════════════════════════════
 */
var disruptionOlympusSoloRecords = [
];

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var disruptionOlympusSoloNotice_cn = "";
var disruptionOlympusSoloNotice_en = "";
