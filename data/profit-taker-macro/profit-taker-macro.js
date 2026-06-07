/**
 * ════════════════════════════════════════════════════════════
 *  data/profit-taker-macro.js  —  大蜘蛛竞速排行榜（无限制）数据文件
 *
 *  ┌─────────────────────────────────────────────────────┐
 *  │  维护说明（仅需修改此文件，无需碰 HTML）              │
 *  │                                                     │
 *  │  字段说明：                                          │
 *  │    clearTime  —— 结算时间，格式 "MM:SS.mmm"          │
 *  │    playerId   —— 玩家 ID                            │
 *  │    uploadTime —— 上传日期，格式 "YYYY-MM-DD"         │
 *  │    videoUrls  —— 视频链接数组；最多4个视角 ["url1","url2",...]     │
 *  │                                                     │
 *  │  排名规则：脚本按 clearTime 从小到大自动排序          │
 *  │  新增条目：在 records 数组末尾添加对象                │
 *  │  修改生效：保存文件后刷新 profit-taker-macro.html    │
 *  └─────────────────────────────────────────────────────┘
 * ════════════════════════════════════════════════════════════
 */
var profitTakerMacroRecords = [
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
var profitTakerMacroNotice_cn = "计时从进入奥布山谷开始，到击杀大蜘蛛时结束。";
var profitTakerMacroNotice_en = "    The timer starts when players enter the Orb Vallis. The timer ends when you kill the Profit-Taker Orb.";
