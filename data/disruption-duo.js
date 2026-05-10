/**
 * ════════════════════════════════════════════════════════════
 *  data/disruption-duo.js  —  中断竞速排行榜（双人）数据文件
 *
 *  ┌─────────────────────────────────────────────────────┐
 *  │  维护说明（仅需修改此文件，无需碰 HTML）              │
 *  │                                                     │
 *  │  字段说明：                                          │
 *  │    clearTime  —— 结算时间，格式 "MM:SS.mmm"          │
 *  │                  例："01:10.234"                    │
 *  │    playerId   —— 玩家 ID（可填写两位玩家，用 / 分隔） │
 *  │    uploadTime —— 上传日期，格式 "YYYY-MM-DD"         │
 *  │    videoUrl   —— 成绩视频链接；留空 "" 则不可点击跳转 │
 *  │                                                     │
 *  │  排名规则：脚本按 clearTime 从小到大自动排序生成      │
 *  │  新增条目：在 records 数组末尾复制一条模板并填写字段  │
 *  │  修改生效：保存文件后刷新 disruption-duo.html        │
 *  └─────────────────────────────────────────────────────┘
 * ════════════════════════════════════════════════════════════
 */
const disruptionDuoRecords = [
  // ─── 示例条目，上线前请替换为真实数据 ───
    {
    clearTime:  "38:56",
    playerId:   "邵真龙 / Kuva",
    uploadTime: "2026-05-10",
    videoUrl:   "https://www.bilibili.com/video/BV1HdA4z6ErV"
  },
  // ─── 在此处继续添加新条目 ───
  // {
  //   clearTime:  "MM:SS.mmm",
  //   playerId:   "玩家A / 玩家B",
  //   uploadTime: "YYYY-MM-DD",
  //   videoUrl:   "https://..."
  // },
];
