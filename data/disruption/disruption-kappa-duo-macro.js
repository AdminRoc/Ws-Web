/**
 * ════════════════════════════════════════════════════════════
 *  data/disruption-kappa-duo-macro.js  —  中断竞速（Kappa·双人·无限制）数据文件
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
var disruptionKappaDuoMacroRecords = [
  {
    clearTime:  "35:48.000",
    playerId:   "NamelessDeity / Biggy Smallz",
    playerId2:   "利用Cyte-09的增伤Bug",
    uploadTime: "2026-07-14",
    videoUrls:     ["https://www.youtube.com/watch?v=sswOjk5cHTk"]
  },
  {
    clearTime:  "37:21.000",
    playerId:   "Endryx_Ow / Gamer123169",
    playerId2:   "利用Vauban的增伤Bug",
    uploadTime: "2026-07-04",
    videoUrls:     ["https://www.youtube.com/watch?v=Tg13HYpuNBg","https://www.youtube.com/watch?v=cWl9P4dsuD4"]
  },
  {
    clearTime:  "36:42.000",
    playerId:   "NamelessDeity / Gamer123169",
    playerId2:   "利用Cyte-09的增伤Bug",
    uploadTime: "2026-07-08",
    videoUrls:     ["https://www.youtube.com/watch?v=c0KEpwW_Ngc"]
  },
  {
    clearTime:  "39:03.000 [违规]",
    playerId:   "Endryx_Ow / Gamer123169",
    playerId2:  "无主机视角，且客机的敌人频繁瞬移，故视为利用Tab功能进行违规操作",
    uploadTime: "2026-01-23",
    videoUrls:     ["https://youtu.be/5S4gQwVw5aE?si=nCYw-Ta6n-gevNus"]
  },
];

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var disruptionKappaDuoMacroNotice_cn = "";
var disruptionKappaDuoMacroNotice_en = "";
