/**
 * ════════════════════════════════════════════════════════════
 *  data/disruption.js  —  中断竞速排行榜 数据文件
 *
 *  ┌─────────────────────────────────────────────────────┐
 *  │  维护说明（仅需修改此文件，无需碰 HTML）              │
 *  │                                                     │
 *  │  字段说明：                                          │
 *  │    clearTime  —— 结算时间，格式 "MM:SS.mmm"          │
 *  │                  例："01:23.456"                    │
 *  │    playerId   —— 玩家 ID（游戏内名称或自定义昵称）    │
 *  │    uploadTime —— 上传日期，格式 "YYYY-MM-DD"         │
 *  │    videoUrl   —— 成绩视频或证据链接；                 │
 *  │                  留空 "" 则该行不可点击跳转           │
 *  │                                                     │
 *  │  排名规则：脚本按 clearTime 从小到大自动排序，         │
 *  │           无需手动填写排名字段                        │
 *  │                                                     │
 *  │  新增条目：在 records 数组末尾复制一条模板并填写字段   │
 *  │  修改生效：保存文件后刷新对应页面即可                  │
 *  └─────────────────────────────────────────────────────┘
 * ════════════════════════════════════════════════════════════
 */
const disruptionRecords = [
  {
    clearTime:  "01:23.456",
    playerId:   "ExamplePlayer1",
    uploadTime: "2026-05-10",
    videoUrl:   "https://example.com/video1"
  },
  {
    clearTime:  "01:31.020",
    playerId:   "ExamplePlayer2",
    uploadTime: "2026-05-09",
    videoUrl:   "https://example.com/video2"
  },
  {
    clearTime:  "01:45.888",
    playerId:   "ExamplePlayer3",
    uploadTime: "2026-05-08",
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
