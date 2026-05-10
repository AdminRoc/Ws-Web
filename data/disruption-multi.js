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
    clearTime:  "00:58.100",
    playerId:   "Player1 / Player2 / Player3 / Player4",
    uploadTime: "2026-05-10",
    videoUrl:   ""
  },
  // ─── 在此处继续添加新条目 ───
  // {
  //   clearTime:  "MM:SS.mmm",
  //   playerId:   "玩家A / 玩家B / 玩家C / 玩家D",
  //   uploadTime: "YYYY-MM-DD",
  //   videoUrl:   "https://..."
  // },
];
