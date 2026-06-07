/**
 * ════════════════════════════════════════════════════════════
 *  data/disruption-kappa-solo.js  —  中断竞速（Kappa·单人）数据文件
 *
 *  字段说明：
 *    clearTime  —— 结算时间，格式 "MM:SS.mmm"  例："01:23.456"
 *    playerId   —— 玩家 ID
 *    uploadTime —— 上传日期，格式 "YYYY-MM-DD"
 *    videoUrls  —— 视频链接数组；最多4个视角 ["url1","url2",...]
 *
 *  排名规则：脚本按 clearTime 从小到大自动排序，无需手动填写排名
 *  新增条目：在数组末尾复制模板并填写字段，保存后刷新页面生效
 * ════════════════════════════════════════════════════════════
 */
const disruptionKappaSoloRecords = [
  {
    clearTime:  "53:43.000",
    playerId:   "NamelessDeity",
    uploadTime: "2025-11-24",
    videoUrls:     ["https://youtu.be/1Bc6lQefhEY?si=iTlCdUIuOGaVT4US"]
  },
  {
    clearTime:  "55:30.000",
    playerId:   "MikuPrime",
    uploadTime: "2026-05-01",
    videoUrls:     ["https://www.bilibili.com/video/BV1fW9vBwEzT"]
  },
  {
    clearTime:  "55:49.000",
    playerId:   "sakvayumika",
    uploadTime: "2025-09-29",
    videoUrls:     ["https://youtu.be/5NQzaqJrC5c?si=wUjGMxoYngtfmbe_"]
  },
  {
    clearTime:  "59:14.000",
    playerId:   "Endryx_Ow",
    uploadTime: "2026-04-23",
    videoUrls:     ["https://youtu.be/21h4oSgmDtE?si=x5RjJxUlG4Ox-ZUp"]
  },
  {
    clearTime:  "59:15.000",
    playerId:   "Takagi1218",
    uploadTime: "2025-09-03",
    videoUrls:     ["https://youtu.be/wVKCTb2Ca6c?si=WgQc1LBN5akU1wy2"]
  },
  {
    clearTime:  "59:23.000",
    playerId:   "Kuva_Prime",
    uploadTime: "2025-07-01",
    videoUrls:     ["https://www.bilibili.com/video/BV1u1gSzwENr?share_source=copy_web"]
  },
  {
    clearTime:  "67:15.000",
    playerId:   "LastShao",
    uploadTime: "2024-12-02",
    videoUrls:     ["https://www.bilibili.com/video/BV16L6KYtEao?share_source=copy_web"]
  },
  {
    clearTime:  "68:57.000",
    playerId:   "Elenjeager",
    uploadTime: "2025-10-06",
    videoUrls:     ["https://b23.tv/KzUJGji"]
  },
  {
    clearTime:  "71:17.000",
    playerId:   "Clarn",
    uploadTime: "2026-04-20",
    videoUrls:     ["https://youtu.be/d8HcTw0YjqU?si=2_T59uUz5g3zdjeB"]
  },
  {
    clearTime:  "68:34.000",
    playerId:   "Zhevia",
    uploadTime: "2026-05-11",
    videoUrls:     ["https://www.bilibili.com/video/BV1qvZFBrEvg"]
  },
  {
    clearTime:  "64:42.000",
    playerId:   "[SO]戰爭惡魔Liberalio",
    uploadTime: "2026-05-12",
    videoUrls:     ["https://www.bilibili.com/video/BV1FS536zEYp?t=23.4"]
  },
  {
    clearTime:  "60:01.000",
    playerId:   "Gaiseric",
    uploadTime: "2026-05-13",
    videoUrls:     ["https://www.bilibili.com/video/BV1mV5y6GEEt/?spm_id_from=333.1387.homepage.video_card.click"]
  },
  {
    clearTime:  "58:58.000",
    playerId:   "oTonJleHue",
    uploadTime: "2026-06-07",
    videoUrls:     ["https://www.youtube.com/watch?v=kReZI7DHIwE"]
  },

];

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var disruptionKappaSoloNotice_cn = "";
var disruptionKappaSoloNotice_en = "";
