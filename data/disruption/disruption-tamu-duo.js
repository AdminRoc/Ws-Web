/**
 * ════════════════════════════════════════════════════════════
 *  data/disruption-tamu-duo.js  —  中断竞速（Tamu·双人）数据文件
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
const disruptionTamuDuoRecords = [
  // ─── 在此处添加双人条目 ───
  // {
  //   clearTime:  "MM:SS.mmm",
  //   playerId:   "玩家ID",
  //   uploadTime: "YYYY-MM-DD",
  //   videoUrls:     ["https://..."]
  // },
  {
    clearTime:  "46:00.000",
    playerId:   "NamelessDeity / Yamarashi",
    uploadTime: "2025-08-03",
    videoUrls:     ["https://www.youtube.com/watch?v=3YTDdzzbvcA"]
  },
];
