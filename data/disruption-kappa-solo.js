/**
 * ════════════════════════════════════════════════════════════
 *  data/disruption-kappa-solo.js  —  中断竞速（Kappa·单人）数据文件
 *
 *  字段说明：
 *    clearTime  —— 结算时间，格式 "MM:SS.mmm"  例："01:23.456"
 *    playerId   —— 玩家 ID
 *    uploadTime —— 上传日期，格式 "YYYY-MM-DD"
 *    videoUrl   —— 成绩视频链接；留空 "" 则不可点击跳转
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
    videoUrl:   "https://youtu.be/1Bc6lQefhEY?si=iTlCdUIuOGaVT4US"
  },
  {
    clearTime:  "55:30.000",
    playerId:   "MikuPrime",
    uploadTime: "2026-05-01",
    videoUrl:   "https://www.bilibili.com/video/BV1fW9vBwEzT"
  },
  {
    clearTime:  "55:49.000",
    playerId:   "sakvayumika",
    uploadTime: "2025-09-29",
    videoUrl:   "https://youtu.be/5NQzaqJrC5c?si=wUjGMxoYngtfmbe_"
  },
  {
    clearTime:  "59:14.000",
    playerId:   "Endryx_Ow",
    uploadTime: "2026-04-23",
    videoUrl:   "https://youtu.be/21h4oSgmDtE?si=x5RjJxUlG4Ox-ZUp"
  },
  {
    clearTime:  "59:15.000",
    playerId:   "Takagi1218",
    uploadTime: "2025-09-03",
    videoUrl:   "https://youtu.be/wVKCTb2Ca6c?si=WgQc1LBN5akU1wy2"
  },
  {
    clearTime:  "59:23.000",
    playerId:   "Kuva_Prime",
    uploadTime: "2025-07-01",
    videoUrl:   "https://www.bilibili.com/video/BV1u1gSzwENr?share_source=copy_web"
  },
  {
    clearTime:  "59:27.000",
    playerId:   "MikuPrime",
    uploadTime: "2025-10-05",
    videoUrl:   "https://www.bilibili.com/video/BV1aaxgzaEUu?share_source=copy_web"
  },
  {
    clearTime:  "67:15.000",
    playerId:   "LastShao",
    uploadTime: "2024-12-02",
    videoUrl:   "https://www.bilibili.com/video/BV16L6KYtEao?share_source=copy_web"
  },
  {
    clearTime:  "68:57.000",
    playerId:   "Elenjeager",
    uploadTime: "2025-10-06",
    videoUrl:   "https://b23.tv/KzUJGji"
  },
  {
    clearTime:  "71:17.000",
    playerId:   "Clarn",
    uploadTime: "2026-04-20",
    videoUrl:   "https://youtu.be/d8HcTw0YjqU?si=2_T59uUz5g3zdjeB"
  },
  // ─── 在此处继续添加新条目 ───
  // {
  //   clearTime:  "MM:SS.mmm",
  //   playerId:   "玩家ID",
  //   uploadTime: "YYYY-MM-DD",
  //   videoUrl:   "https://..."
  // },
];
