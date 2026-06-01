/**
 * ════════════════════════════════════════════════════════════
 *  data/disruption-apollo-multi.js  —  中断竞速（Apollo·多人）数据文件
 *
 *  字段说明：
 *    clearTime  —— 结算时间，格式 "MM:SS.mmm"  例："01:23.456"
 *    playerId   —— 玩家 ID（多人/双人用 / 分隔）
 *    uploadTime —— 上传日期，格式 "YYYY-MM-DD"
 *    videoUrls  —— 视频链接数组；最多4个视角 ["url1","url2",...]
 *
 *  排名规则：脚本按 clearTime 从小到大自动排序
 *  新增条目：在数组末尾复制模板并填写字段，保存后刷新页面生效
 * ════════════════════════════════════════════════════════════
 */
const disruptionApolloMultiRecords = [
  // ─── 在此处添加多人条目 ───
  // {
  //   clearTime:  "MM:SS.mmm",
  //   playerId:   "玩家ID",
  //   uploadTime: "YYYY-MM-DD",
  //   videoUrls:     ["https://..."]
  // },
];

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var disruptionApolloMultiNotice_cn = "";
var disruptionApolloMultiNotice_en = "";
