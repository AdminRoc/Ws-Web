/**
 * ════════════════════════════════════════════════════════════
 *  data/eidolon.js  —  夜灵竞速排行榜（无宏）数据文件
 *
 *  ┌─────────────────────────────────────────────────────┐
 *  │  维护说明（仅需修改此文件，无需碰 HTML）              │
 *  │                                                     │
 *  │  字段说明：                                          │
 *  │    avgRealTime   —— 平均真实时间，格式 "MM:SS.mmm"   │
 *  │                     例："05:42.100"                 │
 *  │    captureStatus —— 捕获情况，如 "3T" / "2T1K" 等   │
 *  │    playerId      —— 玩家 ID                         │
 *  │    uploadTime    —— 上传日期，格式 "YYYY-MM-DD"      │
 *  │    videoUrl      —— 成绩视频链接；留空则不可点击      │
 *  │                                                     │
 *  │  排名规则：脚本按 avgRealTime 从小到大自动排序        │
 *  │  新增条目：在 records 数组末尾添加对象                │
 *  │  修改生效：保存文件后刷新 eidolon.html               │
 *  └─────────────────────────────────────────────────────┘
 * ════════════════════════════════════════════════════════════
 */
const eidolonRecords = [
  {
    avgRealTime:   "05:42.100",
    captureStatus: "3T",
    playerId:      "ExamplePlayer1",
    uploadTime:    "2026-05-10",
    videoUrl:      "https://example.com/eidolon1"
  },
  {
    avgRealTime:   "06:01.350",
    captureStatus: "3T",
    playerId:      "ExamplePlayer2",
    uploadTime:    "2026-05-08",
    videoUrl:      "https://example.com/eidolon2"
  },
  {
    avgRealTime:   "06:28.900",
    captureStatus: "2T1K",
    playerId:      "ExamplePlayer3",
    uploadTime:    "2026-05-07",
    videoUrl:      ""
  },
  // ─── 在此处继续添加新条目 ───
  // {
  //   avgRealTime:   "MM:SS.mmm",
  //   captureStatus: "3T",
  //   playerId:      "玩家ID",
  //   uploadTime:    "YYYY-MM-DD",
  //   videoUrl:      "https://..."
  // },
];
