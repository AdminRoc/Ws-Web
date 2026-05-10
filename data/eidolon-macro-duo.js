/**
 * ════════════════════════════════════════════════════════════
 *  data/eidolon-macro-duo.js  —  夜灵竞速排行榜（有宏 / 双人）数据文件
 *
 *  ┌─────────────────────────────────────────────────────┐
 *  │  维护说明（仅需修改此文件，无需碰 HTML）              │
 *  │                                                     │
 *  │  字段说明：                                          │
 *  │    avgRealTime   —— 平均真实时间，格式 "MM:SS.mmm"   │
 *  │    captureStatus —— 捕获情况，如 "3T" / "2T1K" 等   │
 *  │    playerId      —— 玩家 ID，双人用 / 分隔            │
 *  │    uploadTime    —— 上传日期，格式 "YYYY-MM-DD"      │
 *  │    videoUrl      —— 成绩视频链接；留空则该行不跳转    │
 *  │                                                     │
 *  │  排名规则：脚本按 avgRealTime 从小到大自动排序        │
 *  │  新增条目：在数组末尾添加对象                         │
 *  │  修改生效：保存后刷新 eidolon-macro.html → 双人 Tab  │
 *  └─────────────────────────────────────────────────────┘
 * ════════════════════════════════════════════════════════════
 */
const eidolonMacroDuoRecords = [
  // ─── 示例条目，上线前请替换为真实数据 ───
  {
    avgRealTime:   "04:20.100",
    captureStatus: "3T",
    playerId:      "Player1 / Player2",
    uploadTime:    "2026-05-10",
    videoUrl:      ""
  },
  // ─── 在此处继续添加新条目 ───
  // {
  //   avgRealTime:   "MM:SS.mmm",
  //   captureStatus: "3T",
  //   playerId:      "玩家A / 玩家B",
  //   uploadTime:    "YYYY-MM-DD",
  //   videoUrl:      "https://..."
  // },
];
