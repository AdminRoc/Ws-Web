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
    clearTime:  "38:28.000",
    playerId:   "NamelessDeity / Yamarashi",
    uploadTime: "2026-04-19",
    videoUrl:   "https://youtu.be/sut_zO3QhKI?si=D2XffqXWx6QZ6SPb"
  },
  {
    clearTime:  "38:39.000",
    playerId:   "LastShao / Kuva_Prime",
    uploadTime: "2026-03-22",
    videoUrl:   "https://youtu.be/MwQoMn1TJwo?si=YmumiCHTFKTpCS6V"
  },
  {
    clearTime:  "39:03.000",
    playerId:   "Endryx_Ow / Gamer123169",
    uploadTime: "2026-01-23",
    videoUrl:   "https://youtu.be/5S4gQwVw5aE?si=nCYw-Ta6n-gevNus"
  },
  {
    clearTime:  "39:46.000",
    playerId:   "Cantarella / Gaiseric",
    uploadTime: "2026-03-28",
    videoUrl:   "https://www.bilibili.com/video/BV1W7XgBKEdv"
  },
  {
    clearTime:  "41:18.000",
    playerId:   "NamelessDeity / Yamarashi",
    uploadTime: "2025-08-02",
    videoUrl:   "https://youtu.be/vaChoHOAjIg?si=hbEupx89kuGrFdjB"
  },
  {
    clearTime:  "43:08.000",
    playerId:   "222zzz / MikuPrime",
    uploadTime: "2025-10-12",
    videoUrl:   "https://b23.tv/BQsfARU"
  },
  {
    clearTime:  "43:53.000",
    playerId:   "sakvayumika / RoniPrime",
    uploadTime: "2025-10-20",
    videoUrl:   "https://youtu.be/rAuDuRBZ7oM?si=WpMn0SE6yo9UbNxJ"
  },
  {
    clearTime:  "61:06.000",
    playerId:   "QianYuan / ranrangongzhu",
    uploadTime: "2024-12-07",
    videoUrl:   "https://www.bilibili.com/video/BV1r2qLY7EeB"
  }

  // ─── 在此处继续添加新条目 ───
  // {
  //   clearTime:  "MM:SS.mmm",
  //   playerId:   "玩家A / 玩家B",
  //   uploadTime: "YYYY-MM-DD",
  //   videoUrl:   "https://..."
  // },
];
