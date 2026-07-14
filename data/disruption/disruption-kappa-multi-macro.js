/**
 * ════════════════════════════════════════════════════════════
 *  data/disruption-kappa-multi-macro.js  —  中断竞速（Kappa·多人·无限制）数据文件
 *
 *  字段说明：
 *    clearTime  —— 时间，格式 "MM:SS.mmm"  例："01:23.456"
 *    playerId   —— 玩家 ID（多人/双人用 / 分隔）
 *    uploadTime —— 上传日期，格式 "YYYY-MM-DD"
 *    videoUrls  —— 视频链接数组；最多4个视角 ["url1","url2",...]
 *
 *  排名规则：脚本按 clearTime 从小到大自动排序
 *  新增条目：在数组末尾复制模板并填写字段，保存后刷新页面生效
 * ════════════════════════════════════════════════════════════
 */
var disruptionKappaMultiMacroRecords = [
  {
    clearTime:  "38:06.000",
    playerId:   "sealmp4 / Rouxka / Endryx_Ow / Gamer123169",
    playerId2:  "无主机视角，且客机的敌人频繁瞬移，故视为利用Tab功能进行违规操作",
    uploadTime: "2025-03-16",
    videoUrls:     ["https://youtu.be/oRxoJHWJ6v8?si=oUDggf0L8E44ISVz"]
  },
  {
    clearTime:  "35:38.000 [违规]",
    playerId:   "Endryx_Ow / sealmp4 / Gamer123169 / joanardo",
    playerId2:  "无主机视角，且客机的敌人频繁瞬移，故视为利用Tab功能进行违规操作",
    uploadTime: "2026-01-17",
    videoUrls:     ["https://youtu.be/21h4oSgmDtE?si=y-FrDCMSNiDWyPU7"]
  },
  {
    clearTime:  "35:06.000",
    playerId:   "NamelessDeity / yfoxyfan / -Yamarashi / Empress",
    playerId2:   "利用Vauban的增伤Bug",
    uploadTime: "2026-05-10",
    videoUrls:     ["https://youtu.be/t3Mlmqae_Ow?si=_3-ChD4C-SxjwGv_"]
  },
];

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var disruptionKappaMultiMacroNotice_cn = "";
var disruptionKappaMultiMacroNotice_en = "";
