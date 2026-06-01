/**
 * ════════════════════════════════════════════════════════════
 *  data/eidolon-solo.js  —  夜灵竞速排行榜（有限制 / 单人）数据文件
 *
 *  ┌─────────────────────────────────────────────────────┐
 *  │  维护说明（仅需修改此文件，无需碰 HTML）              │
 *  │                                                     │
 *  │  字段说明：                                          │
 *  │    avgRealTime   —— 平均真实时间，格式 "MM:SS.mmm"   │
 *  │    captureStatus —— 捕获情况，如 "3T" / "2T1K" 等   │
 *  │    playerId      —— 玩家 ID                         │
 *  │    uploadTime    —— 上传日期，格式 "YYYY-MM-DD"      │
 *  │    videoUrls     —— 视频链接数组；最多4个视角 ["url1","url2",...]    │
 *  │                                                     │
 *  │  排名规则：脚本按 avgRealTime 从小到大自动排序        │
 *  │  新增条目：在数组末尾添加对象                         │
 *  │  修改生效：保存文件后刷新 eidolon.html → 单人 Tab    │
 *  └─────────────────────────────────────────────────────┘
 * ════════════════════════════════════════════════════════════
 */
const eidolonSoloRecords = [
  // ─── 示例条目，上线前请替换为真实数据 ───
  {
    avgRealTime:   "07:48.533",
    captureStatus: "6×3",
    playerId:      "Loongx.",
    uploadTime:    "2026-04-12",
    videoUrls:     ["https://youtu.be/bLSXgWxWX30"]
  },
  {
    avgRealTime:   "07:48.796",
    captureStatus: "6×3",
    playerId:      "Fenomeral",
    uploadTime:    "2026-02-15",
    videoUrls:     ["https://youtu.be/TmwfctxpJsE"]
  },
  {
    avgRealTime:   "07:48.943",
    captureStatus: "6×3",
    playerId:      "aggro",
    uploadTime:    "2026-04-23",
    videoUrls:     ["https://youtu.be/ybNSwChvTfs"]
  },
  {
    avgRealTime:   "07:49.829",
    captureStatus: "6×3",
    playerId:      "Jigy5000",
    uploadTime:    "2025-05-30",
    videoUrls:     ["https://youtu.be/lKjveIM0Js4"]
  },
  {
    avgRealTime:   "07:49.854",
    captureStatus: "6×3",
    playerId:      "elaine",
    uploadTime:    "2026-02-25",
    videoUrls:     ["https://www.youtube.com/watch?v=zq9-npjbWdI"]
  },
  {
    avgRealTime:   "07:53.827",
    captureStatus: "6×3",
    playerId:      "itzNicc",
    uploadTime:    "2025-06-01",
    videoUrls:     ["https://www.youtube.com/watch?v=KGt1Dzk1h8Y&feature=youtu.be"]
  },
  {
    avgRealTime:   "07:57.170",
    captureStatus: "6×3",
    playerId:      "Meliodas_MH",
    uploadTime:    "2026-02-11",
    videoUrls:     ["https://youtu.be/Wfwm4TFGLQs"]
  },
  // ─── 在此处继续添加新条目 ───
  // {
  //   avgRealTime:   "MM:SS.mmm",
  //   captureStatus: "6×",
  //   playerId:      "玩家ID",
  //   uploadTime:    "YYYY-MM-DD",
  //   videoUrls:     ["https://..."]
  // },
];

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var eidolonSoloNotice_cn = "";
var eidolonSoloNotice_en = "";
