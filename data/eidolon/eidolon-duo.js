/**
 * ════════════════════════════════════════════════════════════
 *  data/eidolon-duo.js  —  夜灵竞速排行榜（有限制 / 双人）数据文件
 *
 *  ┌─────────────────────────────────────────────────────┐
 *  │  维护说明（仅需修改此文件，无需碰 HTML）              │
 *  │                                                     │
 *  │  字段说明：                                          │
 *  │    avgRealTime   —— 平均真实时间，格式 "MM:SS.mmm"   │
 *  │    captureStatus —— 捕获情况，如 "3T" / "2T1K" 等   │
 *  │    playerId      —— 玩家 ID，双人用 / 分隔            │
 *  │    uploadTime    —— 上传日期，格式 "YYYY-MM-DD"      │
 *  │    videoUrls     —— 视频链接数组；最多4个视角 ["url1","url2",...]    │
 *  │                                                     │
 *  │  排名规则：脚本按 avgRealTime 从小到大自动排序        │
 *  │  新增条目：在数组末尾添加对象                         │
 *  │  修改生效：保存文件后刷新 eidolon.html → 双人 Tab    │
 *  └─────────────────────────────────────────────────────┘
 * ════════════════════════════════════════════════════════════
 */
var eidolonDuoRecords = [
  // ─── 示例条目，上线前请替换为真实数据 ───
  {
    avgRealTime:   "07:47.231",
    captureStatus: "6×3",
    playerId:      "aimuduwi / Loongx.",
    uploadTime:    "2025-07-10",
    videoUrls:     ["https://youtu.be/2ycWErzBljQ?si=8Vaz6dkRUF-t_dvX"]
  },
  {
    avgRealTime:   "07:47.269",
    captureStatus: "6×3",
    playerId:      "-T14Nt / Loongx.",
    uploadTime:    "2025-05-02",
    videoUrls:     ["https://youtu.be/xfojq9bYxiE"]
  },
  {
    avgRealTime:   "07:48.766",
    captureStatus: "6×3 - novaless%",
    playerId:      "Fenomeral / vMooose.",
    uploadTime:    "2026-02-06",
    videoUrls:     ["https://youtu.be/fvztvEBneh4"]
  },
  {
    avgRealTime:   "07:48.911",
    captureStatus: "6×3",
    playerId:      "Fenomeral / vMooose.",
    uploadTime:    "2026-02-13",
    videoUrls:     ["https://www.youtube.com/watch?v=G3kIfkXds2Q"]
  },
  {
    avgRealTime:   "07:50.984",
    captureStatus: "6×3 - novaless%",
    playerId:      "aimuduwi / Loongx.",
    uploadTime:    "2025-06-03",
    videoUrls:     ["https://youtu.be/TGYUL6jfb9E?si=ahuvCrLNGkWOZ7HT"]
  },
  {
    avgRealTime:   "07:56.177",
    captureStatus: "6×3 - novaless%",
    playerId:      "itzNicc / ForsakenIdol",
    uploadTime:    "2025-05-21",
    videoUrls:     ["https://youtu.be/0PxKjTw6bvY"]
  },
  // ─── 在此处继续添加新条目 ───
  // {
  //   avgRealTime:   "MM:SS.mmm",
  //   captureStatus: "3T",
  //   playerId:      "玩家A / 玩家B",
  //   uploadTime:    "YYYY-MM-DD",
  //   videoUrls:     ["https://..."]
  // },
];

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var eidolonDuoNotice_cn = "";
var eidolonDuoNotice_en = "";
