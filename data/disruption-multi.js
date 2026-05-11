/**
 * ════════════════════════════════════════════════════════════
 *  data/disruption-multi.js  —  中断竞速排行榜（多人）数据文件
 *
 *  ┌─────────────────────────────────────────────────────┐
 *  │  维护说明（仅需修改此文件，无需碰 HTML）              │
 *  │                                                     │
 *  │  字段说明：                                          │
 *  │    clearTime  —— 结算时间，格式 "MM:SS.mmm"          │
 *  │                  例："00:58.100"                    │
 *  │    playerId   —— 玩家 ID（多人用 / 分隔，如 A/B/C/D）│
 *  │    uploadTime —— 上传日期，格式 "YYYY-MM-DD"         │
 *  │    videoUrl   —— 成绩视频链接；留空 "" 则不可点击跳转 │
 *  │                                                     │
 *  │  排名规则：脚本按 clearTime 从小到大自动排序生成      │
 *  │  新增条目：在 records 数组末尾复制一条模板并填写字段  │
 *  │  修改生效：保存文件后刷新 disruption-multi.html      │
 *  └─────────────────────────────────────────────────────┘
 * ════════════════════════════════════════════════════════════
 */
const disruptionMultiRecords = [
  // ─── 示例条目，上线前请替换为真实数据 ───
  {
    clearTime:  "35:38.000",
    playerId:   "Endryx_Ow / sealmp4 / Gamer123169 / joanardo",
    uploadTime: "2026-01-17",
    videoUrl:   "https://youtu.be/21h4oSgmDtE?si=y-FrDCMSNiDWyPU7"
  },
  {
    clearTime:  "37:11.000",
    playerId:   "Cantarella / ohmo / AnqiTuT / Gaiseric",
    uploadTime: "2026-02-10",
    videoUrl:   "https://www.bilibili.com/video/BV1zWF9ziEDf"
  },
  {
    clearTime:  "37:37.000",
    playerId:   "LastShao / Kuva_Prime / Takagi1218 / qlll123",
    uploadTime: "2025-07-21",
    videoUrl:   "https://youtu.be/6Feq9lDbIcw?si=wSeMMY2srMK7i8Dq"
  },
  {
    clearTime:  "38:06.000",
    playerId:   "sealmp4 / Rouxka / Endryx_Ow / Gamer123169",
    uploadTime: "2025-03-16",
    videoUrl:   "https://youtu.be/oRxoJHWJ6v8?si=oUDggf0L8E44ISVz"
  },
  {
    clearTime:  "38:27.000",
    playerId:   "sealmp4 / Rouxka / FlashSucks / max_1248",
    uploadTime: "2025-01-16",
    videoUrl:   "https://youtu.be/jveW9pzhn38?si=z2o7WVUrT_eV0Cyy"
  },
  {
    clearTime:  "38:45.000",
    playerId:   "LastShao / Y_7BAB / Kuva_Prime / Takagi1218",
    uploadTime: "2025-02-04",
    videoUrl:   "https://youtu.be/ueZ1zdcC6h0?si=cgTwhNPEvBB7d-OU"
  },
  {
    clearTime:  "38:51.000",
    playerId:   "NamelessDeity / Yamarashi / Quhuvi / Renemeded_Fufa",
    uploadTime: "2024-12-06",
    videoUrl:   "https://youtu.be/ET1dkwammdQ?si=jjsoAaa1dEE9OPgA"
  },
  {
    clearTime:  "39:56.000",
    playerId:   "NamelessDeity / namenBARS / Quhuvi / Sappi_Bear",
    uploadTime: "2025-05-15",
    videoUrl:   "https://youtu.be/m0wrupTQvR4?si=wbVAUx_EQMnUN1df"
  },
  {
    clearTime:  "40:54.000",
    playerId:   "Endryx_Ow / Txdo / _Dopa / HL_BAN",
    uploadTime: "2025-02-10",
    videoUrl:   "https://youtu.be/jK8y-bKdNsc?si=QYvgsgq2dZDTpLGi"
  },
  {
    clearTime:  "40:57.000",
    playerId:   "LastShao / Kuva_Prime / Y_7BAB / Leaf_Riya",
    uploadTime: "2024-08-09",
    videoUrl:   "https://www.bilibili.com/video/BV1FcYteXETj"
  },
  {
    clearTime:  "44:18.000",
    playerId:   "222zzz / qlll123 / YareliPrime11 / LHH030312",
    uploadTime: "2025-02-01",
    videoUrl:   "https://www.bilibili.com/video/BV1T3FeeeEP6"
  },
  {
    clearTime:  "35:06.000",
    playerId:   "NamelessDeity / yfoxyfan / -Yamarashi / Empress",
    uploadTime: "2026-05-10",
    videoUrl:   "https://youtu.be/t3Mlmqae_Ow?si=_3-ChD4C-SxjwGv_"
  },
  // ─── 在此处继续添加新条目 ───
  // {
  //   clearTime:  "MM:SS.mmm",
  //   playerId:   "玩家A / 玩家B / 玩家C / 玩家D",
  //   uploadTime: "YYYY-MM-DD",
  //   videoUrl:   "https://..."
  // },
];
