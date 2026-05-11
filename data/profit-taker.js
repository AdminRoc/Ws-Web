/**
 * ════════════════════════════════════════════════════════════
 *  data/profit-taker.js  —  大蜘蛛竞速排行榜（无宏）数据文件
 *
 *  ┌─────────────────────────────────────────────────────┐
 *  │  维护说明（仅需修改此文件，无需碰 HTML）              │
 *  │                                                     │
 *  │  字段说明：                                          │
 *  │    clearTime  —— 结算时间，格式 "MM:SS.mmm"          │
 *  │                  例："02:15.333"                    │
 *  │    playerId   —— 玩家 ID                            │
 *  │    uploadTime —— 上传日期，格式 "YYYY-MM-DD"         │
 *  │    videoUrl   —— 成绩视频链接；留空则不可点击跳转     │
 *  │                                                     │
 *  │  排名规则：脚本按 clearTime 从小到大自动排序          │
 *  │  新增条目：在 records 数组末尾添加对象                │
 *  │  修改生效：保存文件后刷新 profit-taker.html          │
 *  └─────────────────────────────────────────────────────┘
 * ════════════════════════════════════════════════════════════
 */
const profitTakerRecords = [
{
    clearTime:  "00:46.450",
    playerId:   "Endryx_Ow",
    uploadTime: "2026-04-27",
    videoUrl:   "https://youtu.be/2Z6GE9r4agk?si=45s0sOTpscbtztmh"
  },
  {
    clearTime:  "00:49.450",
    playerId:   "zwoop",
    uploadTime: "2026-04-01",
    videoUrl:   "https://youtu.be/i46R8k61-os?si=Db1MsuPIahvrlwMV"
  },
  {
    clearTime:  "00:49.733",
    playerId:   "UnOriginalGN",
    uploadTime: "2025-02-03",
    videoUrl:   "https://youtu.be/gsic74WAKzs?si=t2RSx6ExwjcvK8fJ"
  },
  {
    clearTime:  "00:49.816",
    playerId:   "Kalaay",
    uploadTime: "2025-02-02",
    videoUrl:   "https://youtu.be/qQGcF21-SSY?si=FZpZ-06ap0ydPiLd"
  },
  {
    clearTime:  "00:49.850",
    playerId:   "Rouxka",
    uploadTime: "2025-03-10",
    videoUrl:   "https://youtu.be/Lak_YiV0B_M?si=Sxm1FGrK0yO8_sqL"
  },
  {
    clearTime:  "00:50.567",
    playerId:   "lighthighs",
    uploadTime: "2026-03-17",
    videoUrl:   "https://youtu.be/YyIlLbghdk0?si=Mf__Yf2paR-U7WTo"
  },
  {
    clearTime:  "00:51.917",
    playerId:   "wtzkk121",
    uploadTime: "2025-08-05",
    videoUrl:   ""
  },
  {
    clearTime:  "00:51.983",
    playerId:   "Kungfuszifu",
    uploadTime: "2025-05-11",
    videoUrl:   ""
  },
  {
    clearTime:  "00:52.550",
    playerId:   "ScamCat",
    uploadTime: "2026-03-11",
    videoUrl:   ""
  },
  {
    clearTime:  "00:52.567",
    playerId:   "HL_BAN",
    uploadTime: "2025-05-11",
    videoUrl:   ""
  },
  {
    clearTime:  "00:52.633",
    playerId:   "not21dropper",
    uploadTime: "2025-05-11",
    videoUrl:   ""
  },
  {
    clearTime:  "00:54.800",
    playerId:   "Insomnia_fs",
    uploadTime: "2026-04-18",
    videoUrl:   ""
  },
  {
    clearTime:  "00:55.288",
    playerId:   "Eoh_",
    uploadTime: "2025-05-11",
    videoUrl:   ""
  },
  {
    clearTime:  "00:55.483",
    playerId:   "ADHDino",
    uploadTime: "2025-05-11",
    videoUrl:   ""
  },
  {
    clearTime:  "00:55.695",
    playerId:   "jaedyn2001",
    uploadTime: "2025-05-11",
    videoUrl:   ""
  },
  {
    clearTime:  "00:55.717",
    playerId:   "CFSimpleH",
    uploadTime: "2025-05-11",
    videoUrl:   ""
  },
  {
    clearTime:  "00:56.150",
    playerId:   "hampter42_",
    uploadTime: "2026-04-30",
    videoUrl:   ""
  },
  {
    clearTime:  "00:56.433",
    playerId:   "acsi",
    uploadTime: "2025-05-11",
    videoUrl:   ""
  },
  {
    clearTime:  "00:56.817",
    playerId:   "HOPDanh",
    uploadTime: "2025-06-11",
    videoUrl:   ""
  },
  {
    clearTime:  "00:57.933",
    playerId:   "ilyRogue",
    uploadTime: "2025-05-11",
    videoUrl:   ""
  },
  {
    clearTime:  "00:58.067",
    playerId:   "HL_Unknown",
    uploadTime: "2025-05-11",
    videoUrl:   ""
  },
  {
    clearTime:  "00:58.600",
    playerId:   "4MIR",
    uploadTime: "2026-02-11",
    videoUrl:   ""
  },
  {
    clearTime:  "00:58.967",
    playerId:   "Curser",
    uploadTime: "2026-02-11",
    videoUrl:   ""
  },
  {
    clearTime:  "01:02.458",
    playerId:   "LukerPower",
    uploadTime: "2025-08-11",
    videoUrl:   ""
  },
  {
    clearTime:  "01:03.283",
    playerId:   "ZombieEPx",
    uploadTime: "2025-05-11",
    videoUrl:   ""
  },
  {
    clearTime:  "01:05.900",
    playerId:   "zozdnvil",
    uploadTime: "2025-05-11",
    videoUrl:   ""
  },
  {
    clearTime:  "01:06.000",
    playerId:   "UnOriginalGN",
    uploadTime: "2025-05-11",
    videoUrl:   ""
  },
  {
    clearTime:  "01:06.350",
    playerId:   "44bananas",
    uploadTime: "2025-05-11",
    videoUrl:   ""
  },
  {
    clearTime:  "01:10.333",
    playerId:   "Fremyrac",
    uploadTime: "2025-05-11",
    videoUrl:   ""
  },
  {
    clearTime:  "01:13.633",
    playerId:   "Endryx_Ow",
    uploadTime: "2025-05-11",
    videoUrl:   ""
  },
  {
    clearTime:  "01:20.033",
    playerId:   "FINISHEROWNED",
    uploadTime: "2025-05-11",
    videoUrl:   ""
  },
  {
    clearTime:  "01:23.233",
    playerId:   "real_spinner",
    uploadTime: "2025-05-11",
    videoUrl:   ""
  },
  {
    clearTime:  "01:27.433",
    playerId:   "PuppiesPlushie",
    uploadTime: "2025-12-11",
    videoUrl:   ""
  },
  {
    clearTime:  "01:30.467",
    playerId:   "Prot0w0gen",
    uploadTime: "2025-05-11",
    videoUrl:   ""
  },
  {
    clearTime:  "01:34.367",
    playerId:   "Aeshen",
    uploadTime: "2025-12-11",
    videoUrl:   ""
  },
  {
    clearTime:  "01:37.017",
    playerId:   "RestInPizza",
    uploadTime: "2025-05-11",
    videoUrl:   ""
  },
  {
    clearTime:  "01:39.133",
    playerId:   "CoochieCrusader",
    uploadTime: "2025-12-11",
    videoUrl:   ""
  },
  {
    clearTime:  "02:43.017",
    playerId:   "TanderXaylor",
    uploadTime: "2025-08-11",
    videoUrl:   ""
  },
  {
    clearTime:  "06:04.666",
    playerId:   "NightmarePlays",
    uploadTime: "2025-05-11",
    videoUrl:   ""
  },
  {
    clearTime:  "09:33.533",
    playerId:   "ManInTheWall",
    uploadTime: "2025-05-11",
    videoUrl:   ""
  },
  // ─── 在此处继续添加新条目 ───
  // {
  //   clearTime:  "MM:SS.mmm",
  //   playerId:   "玩家ID",
  //   uploadTime: "YYYY-MM-DD",
  //   videoUrl:   "https://..."
  // },
];
