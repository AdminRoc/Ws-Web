/**
 * ════════════════════════════════════════════════════════════
 *  data/profit-taker.js  —  大蜘蛛竞速排行榜（有限制）数据文件
 *
 *  ┌─────────────────────────────────────────────────────┐
 *  │  维护说明（仅需修改此文件，无需碰 HTML）              │
 *  │                                                     │
 *  │  字段说明：                                          │
 *  │    clearTime  —— 结算时间，格式 "MM:SS.mmm"          │
 *  │                  例："02:15.333"                    │
 *  │    playerId   —— 玩家 ID                            │
 *  │    uploadTime —— 上传日期，格式 "YYYY-MM-DD"         │
 *  │    videoUrls  —— 视频链接数组；最多4个视角 ["url1","url2",...]     │
 *  │                                                     │
 *  │  排名规则：脚本按 clearTime 从小到大自动排序          │
 *  │  新增条目：在 records 数组末尾添加对象                │
 *  │  修改生效：保存文件后刷新 profit-taker.html          │
 *  └─────────────────────────────────────────────────────┘
 * ════════════════════════════════════════════════════════════
 */
var profitTakerRecords = [
{
    clearTime:  "00:46.450",
    playerId:   "Endryx_Ow",
    uploadTime: "2026-04-27",
    videoUrls:     ["https://youtu.be/2Z6GE9r4agk?si=45s0sOTpscbtztmh"]
  },
  {
    clearTime:  "00:49.450",
    playerId:   "zwoop",
    uploadTime: "2026-04-01",
    videoUrls:     ["https://youtu.be/i46R8k61-os?si=Db1MsuPIahvrlwMV"]
  },
  {
    clearTime:  "00:49.733",
    playerId:   "UnOriginalGN",
    uploadTime: "2025-02-03",
    videoUrls:     ["https://youtu.be/gsic74WAKzs?si=t2RSx6ExwjcvK8fJ"]
  },
  {
    clearTime:  "00:49.816",
    playerId:   "Kalaay",
    uploadTime: "2025-02-02",
    videoUrls:     ["https://youtu.be/qQGcF21-SSY?si=FZpZ-06ap0ydPiLd"]
  },
  {
    clearTime:  "00:49.850",
    playerId:   "Rouxka",
    uploadTime: "2025-03-10",
    videoUrls:     ["https://youtu.be/Lak_YiV0B_M?si=Sxm1FGrK0yO8_sqL"]
  },
  {
    clearTime:  "00:50.567",
    playerId:   "lighthighs",
    uploadTime: "2026-03-17",
    videoUrls:     ["https://youtu.be/YyIlLbghdk0?si=Mf__Yf2paR-U7WTo"]
  },
  {
    clearTime:  "00:51.917",
    playerId:   "wtzkk121",
    uploadTime: "2025-08-05",
    videoUrls:     ["https://youtu.be/rtZ69xmj9OU?si=dBty86IM9Rd5DELz"]
  },
  {
    clearTime:  "00:51.983",
    playerId:   "Kungfuszifu",
    uploadTime: "2025-03-23",
    videoUrls:     ["https://youtu.be/FiNe3kVHYOQ?si=EUMxcwb-go8on0zd"]
  },
  {
    clearTime:  "00:52.550",
    playerId:   "ScamCat",
    uploadTime: "2026-03-07",
    videoUrls:     ["https://youtu.be/xF5KUIUAQMU?si=GoCx2Su6pSpMBn43"]
  },
  {
    clearTime:  "00:52.567",
    playerId:   "HL_BAN",
    uploadTime: "2024-12-07",
    videoUrls:     ["https://youtu.be/7OetOOg0WlY?si=7oX6H8LoVXM3wyTk"]
  },
  {
    clearTime:  "00:52.633",
    playerId:   "not21dropper",
    uploadTime: "2025-01-21",
    videoUrls:     ["https://youtu.be/h6r_L9IDXIw?si=zSxLh91qIjadKodC"]
  },
  {
    clearTime:  "00:54.800",
    playerId:   "Insomnia_fs",
    uploadTime: "2026-04-18",
    videoUrls:     ["https://youtu.be/GREhY2bTVg4?si=spsOJMvEJpPkKt3p"]
  },
  {
    clearTime:  "00:55.288",
    playerId:   "Eoh_",
    uploadTime: "2025-04-13",
    videoUrls:     ["https://youtu.be/WJqOSqfxrLQ?si=FRed4151byTNwi4R"]
  },
  {
    clearTime:  "00:55.483",
    playerId:   "ADHDino",
    uploadTime: "2025-03-28",
    videoUrls:     ["https://youtu.be/1o4vOcDQ6rA?si=_trUUnC6K8RSRbRx"]
  },
  {
    clearTime:  "00:55.695",
    playerId:   "jaedyn2001",
    uploadTime: "2025-03-12",
    videoUrls:     ["https://youtu.be/KMEPNOqU4mY?si=wUpp-Mm2cJo-2-yA"]
  },
  {
    clearTime:  "00:55.717",
    playerId:   "CFSimpleH",
    uploadTime: "2025-01-11",
    videoUrls:     ["https://youtu.be/uI44Ay4nJzE?si=1Lvf4YaUZaKiJLUQ"]
  },
  {
    clearTime:  "00:56.150",
    playerId:   "hampter42_",
    uploadTime: "2026-04-30",
    videoUrls:     ["https://youtu.be/WKeMkSXh0uY?si=Wf5mXsXWsHdeFRO8"]
  },
  {
    clearTime:  "00:56.433",
    playerId:   "acsi",
    uploadTime: "2024-11-23",
    videoUrls:     ["https://youtu.be/iymGcho4jvc?si=Gy-ASBkGkBDAHxjU"]
  },
  {
    clearTime:  "00:56.817",
    playerId:   "HOPDanh",
    uploadTime: "2025-05-13",
    videoUrls:     ["https://youtu.be"]
  },
  {
    clearTime:  "00:57.933",
    playerId:   "ilyRogue",
    uploadTime: "2025-02-28",
    videoUrls:     ["https://youtu.be/0pREiQqmpp4?si=vuggBEAtiV3M4Tnd"]
  },
  {
    clearTime:  "00:58.067",
    playerId:   "HL_Unknown",
    uploadTime: "2025-02-03",
    videoUrls:     ["https://youtu.be/8xn9matdATo?si=4jsZ4y-eSTrIgrMf"]
  },
  {
    clearTime:  "00:58.600",
    playerId:   "4MIR",
    uploadTime: "2026-01-26",
    videoUrls:     ["https://youtu.be/r7F_Ow-7rA0?si=M_MhGy7MyBgLIGuv"]
  },
  {
    clearTime:  "00:58.967",
    playerId:   "Curser",
    uploadTime: "2026-01-13",
    videoUrls:     ["https://youtu.be/H5HJsrbs8Sc?si=W9LcSeo-_Ds6XEAL"]
  },
  {
    clearTime:  "01:02.458",
    playerId:   "LukerPower",
    uploadTime: "2025-08-06",
    videoUrls:     ["https://youtu.be/OZPxE_cAliA?si=U0WExQmT6QBNxWsB"]
  },
  {
    clearTime:  "01:03.283",
    playerId:   "ZombieEPx",
    uploadTime: "2024-12-01",
    videoUrls:     ["https://youtu.be/C13pMOTkUKE?si=MkHZz3nYPToQa51I"]
  },
  {
    clearTime:  "01:05.900",
    playerId:   "zozdnvil",
    uploadTime: "2025-03-09",
    videoUrls:     ["https://youtu.be/IzNyDqCr3Zw?si=FsSA06ZP8mCNpy2Y"]
  },
  {
    clearTime:  "01:06.000",
    playerId:   "UnOriginalGN",
    uploadTime: "2025-04-20",
    videoUrls:     ["https://youtu.be/B8IvQ595qls?si=u-aglbcJ92UdSyIT"]
  },
  {
    clearTime:  "01:06.350",
    playerId:   "44bananas",
    uploadTime: "2025-01-11",
    videoUrls:     ["https://youtu.be/R7d19Uh0jP4?si=gNLa-2m6fBxsFfnw"]
  },
  {
    clearTime:  "01:10.333",
    playerId:   "Fremyrac",
    uploadTime: "2025-02-03",
    videoUrls:     ["https://youtu.be/pTavYCBK7eM?si=P6h0VNVKXDye5qA3"]
  },
  {
    clearTime:  "01:13.633",
    playerId:   "Endryx_Ow",
    uploadTime: "2024-12-14",
    videoUrls:     ["https://youtu.be/ZZTOZs8NWFI?si=RFK1RKS33-MI0-cn"]
  },
  {
    clearTime:  "01:20.033",
    playerId:   "FINISHEROWNED",
    uploadTime: "2025-05-06",
    videoUrls:     ["https://youtu.be/gsnLPL3WJ38?si=xsLQNmLgPgETIINu"]
  },
  {
    clearTime:  "01:23.233",
    playerId:   "real_spinner",
    uploadTime: "2024-11-18",
    videoUrls:     ["https://youtu.be/EGhrqDQc52M?si=7KZFpUVNiwqYZcIU"]
  },
  {
    clearTime:  "01:27.433",
    playerId:   "PuppiesPlushie",
    uploadTime: "2025-11-28",
    videoUrls:     ["https://youtu.be/MF86-_hmmdY?si=xPAd6ccmBChlX2kb"]
  },
  {
    clearTime:  "01:30.467",
    playerId:   "Prot0w0gen",
    uploadTime: "2025-01-04",
    videoUrls:     ["https://youtu.be/59k7kDcdtCg?si=2kFgwivA8T4ux8tX"]
  },
  {
    clearTime:  "01:34.367",
    playerId:   "Aeshen",
    uploadTime: "2025-12-01",
    videoUrls:     ["https://youtu.be/uC5_iVJEuLY?si=vNakeUpy95_PCLGT"]
  },
  {
    clearTime:  "01:37.017",
    playerId:   "RestInPizza",
    uploadTime: "2024-10-27",
    videoUrls:     ["https://youtu.be/C4iWJvehdUc?si=EY1r9-ZoO1sPO69K"]
  },
  {
    clearTime:  "01:39.133",
    playerId:   "CoochieCrusader",
    uploadTime: "2025-11-30",
    videoUrls:     ["https://youtu.be/33k_TnIrTH0?si=MlYkOdUweBw7i93i"]
  },
  {
    clearTime:  "02:43.017",
    playerId:   "TanderXaylor",
    uploadTime: "2025-07-25",
    videoUrls:     ["https://youtu.be/RsnvSYyoJr4?si=Xit_xP377ZO5VuZs"]
  },
  {
    clearTime:  "06:04.666",
    playerId:   "NightmarePlays",
    uploadTime: "2024-09-14",
    videoUrls:     ["https://youtu.be/KkHAZMCdRsQ?si=Lo7Pj7OZBFvFMYsM"]
  },
  {
    clearTime:  "09:33.533",
    playerId:   "ManInTheWall",
    uploadTime: "2024-06-24",
    videoUrls:     ["https://youtu.be/GtkTw7tb8cI?si=5SIafs_A17zBSdhc"]
  },
  {
    clearTime:  "00:53.133",
    playerId:   "Insomnia_fs",
    uploadTime: "2026-06-03",
    videoUrls:     ["https://www.youtube.com/watch?v=clTmtE3HKpk"]
  },
  // ─── 在此处继续添加新条目 ───
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
var profitTakerNotice_cn = "计时从进入奥布山谷开始，到击杀大蜘蛛时结束。";
var profitTakerNotice_en = "    The timer starts when players enter the Orb Vallis. The timer ends when you kill the Profit-Taker Orb.";
