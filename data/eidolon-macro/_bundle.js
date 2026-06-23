/* ════════════════════════════════════════════════════════════
 *  自动生成，请勿手动编辑本文件。
 *  本文件由 .github/scripts/bundle_data.py 把同目录下所有数据源文件
 *  拼接而成，用于减少 HTTP 请求数。要修改成绩数据，请编辑同目录下
 *  对应的单个 <分类>-<节点>.js 源文件，push 后会自动重建本文件。
 * ════════════════════════════════════════════════════════════ */

/* ===== data/eidolon-macro/eidolon-macro-duo.js ===== */
/**
 * ════════════════════════════════════════════════════════════
 *  data/eidolon-macro-duo.js  —  夜灵竞速排行榜（无限制 / 双人）数据文件
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
 *  │  修改生效：保存后刷新 eidolon-macro.html → 双人 Tab  │
 *  └─────────────────────────────────────────────────────┘
 * ════════════════════════════════════════════════════════════
 */
var eidolonMacroDuoRecords = [
  
  {
  avgRealTime:   "07:44.938 [作弊]",
  captureStatus: "6×3",
  playerId:      "吖吖酱 / V-PHOENIX",
  uploadTime:    "2026-06-12",
  videoUrls:     ["https://www.bilibili.com/video/BV1NsGp6BEtN"]
  },
];

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var eidolonMacroDuoNotice_cn = "玩家ID ‘吖吖酱 / Sara- (V-PHOENIX)’ 所提交的纪录，涉嫌使用AHK工具进行作弊，且该玩家在提交记录时故意欺瞒自身情况，根据本站的作弊处理原则，现将该记录标记为 [作弊]，并将该玩家提交的全部信息永久公示，点击榜单底部按钮即可查看。若该内容属于他人冒用号主身份进行上传的，号主本人可以提供相关证据，本站将对侵权内容进行及时处理。（纪录的上传、审核都是基于玩家主观善意的基础上的，部分玩家利用这一点，意图故意提交违规内容以示本站审核不严，希望他人不要效仿此人的无耻行为。请各位互相监督，及时对作弊者进行举报）";
var eidolonMacroDuoNotice_en = "The record submitted by player ‘吖吖酱 / V-PHOENIX’ is suspected of cheating using AHK tools. Furthermore, the player intentionally concealed their circumstances when submitting the record. In accordance with our site’s anti-cheat policy, this record has been marked as [Cheating], and all information submitted by this player is now permanently public. Click the button at the bottom of the leaderboard to view.";
;

/* ===== data/eidolon-macro/eidolon-macro-quad.js ===== */
/**
 * ════════════════════════════════════════════════════════════
 *  data/eidolon-macro-quad.js  —  夜灵竞速排行榜（无限制 / 四人）数据文件
 *
 *  ┌─────────────────────────────────────────────────────┐
 *  │  维护说明（仅需修改此文件，无需碰 HTML）              │
 *  │                                                     │
 *  │  字段说明：                                          │
 *  │    avgRealTime   —— 平均真实时间，格式 "MM:SS.mmm"   │
 *  │    captureStatus —— 捕获情况，如 "3T" / "2T1K" 等   │
 *  │    playerId      —— 玩家 ID，四人用 / 分隔            │
 *  │    uploadTime    —— 上传日期，格式 "YYYY-MM-DD"      │
 *  │    videoUrls     —— 视频链接数组；最多4个视角 ["url1","url2",...]    │
 *  │                                                     │
 *  │  排名规则：脚本按 avgRealTime 从小到大自动排序        │
 *  │  新增条目：在数组末尾添加对象                         │
 *  │  修改生效：保存后刷新 eidolon-macro.html → 四人 Tab  │
 *  └─────────────────────────────────────────────────────┘
 * ════════════════════════════════════════════════════════════
 */
var eidolonMacroQuadRecords = [
  // ─── 在此处继续添加新条目 ───
  // {
  //   avgRealTime:   "MM:SS.mmm",
  //   captureStatus: "3T",
  //   playerId:      "玩家A / 玩家B / 玩家C / 玩家D",
  //   uploadTime:    "YYYY-MM-DD",
  //   videoUrls:     ["https://..."]
  // },
];

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var eidolonMacroQuadNotice_cn = "";
var eidolonMacroQuadNotice_en = "";
;

/* ===== data/eidolon-macro/eidolon-macro-solo.js ===== */
/**
 * ════════════════════════════════════════════════════════════
 *  data/eidolon-macro-solo.js  —  夜灵竞速排行榜（无限制 / 单人）数据文件
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
 *  │  修改生效：保存后刷新 eidolon-macro.html → 单人 Tab  │
 *  └─────────────────────────────────────────────────────┘
 * ════════════════════════════════════════════════════════════
 */
var eidolonMacroSoloRecords = [
  // ─── 在此处继续添加新条目 ───
  // {
  //   avgRealTime:   "MM:SS.mmm",
  //   captureStatus: "3T",
  //   playerId:      "玩家ID",
  //   uploadTime:    "YYYY-MM-DD",
  //   videoUrls:     ["https://..."]
  // },
];

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var eidolonMacroSoloNotice_cn = "";
var eidolonMacroSoloNotice_en = "";
;

/* ===== data/eidolon-macro/eidolon-macro-trio.js ===== */
/**
 * ════════════════════════════════════════════════════════════
 *  data/eidolon-macro-trio.js  —  夜灵竞速排行榜（无限制 / 三人）数据文件
 *
 *  ┌─────────────────────────────────────────────────────┐
 *  │  维护说明（仅需修改此文件，无需碰 HTML）              │
 *  │                                                     │
 *  │  字段说明：                                          │
 *  │    avgRealTime   —— 平均真实时间，格式 "MM:SS.mmm"   │
 *  │    captureStatus —— 捕获情况，如 "3T" / "2T1K" 等   │
 *  │    playerId      —— 玩家 ID，三人用 / 分隔            │
 *  │    uploadTime    —— 上传日期，格式 "YYYY-MM-DD"      │
 *  │    videoUrls     —— 视频链接数组；最多4个视角 ["url1","url2",...]    │
 *  │                                                     │
 *  │  排名规则：脚本按 avgRealTime 从小到大自动排序        │
 *  │  新增条目：在数组末尾添加对象                         │
 *  │  修改生效：保存后刷新 eidolon-macro.html → 三人 Tab  │
 *  └─────────────────────────────────────────────────────┘
 * ════════════════════════════════════════════════════════════
 */
var eidolonMacroTrioRecords = [
  // ─── 在此处继续添加新条目 ───
  // {
  //   avgRealTime:   "MM:SS.mmm",
  //   captureStatus: "3T",
  //   playerId:      "玩家A / 玩家B / 玩家C",
  //   uploadTime:    "YYYY-MM-DD",
  //   videoUrls:     ["https://..."]
  // },
];

/* ── 横幅提醒信息 ────────────────────────────────────────────
 * Notice_cn : 默认显示的中文提醒（留空则不显示横幅）
 * Notice_en : 鼠标停留时显示的英文提醒（可留空）
 * ──────────────────────────────────────────────────────── */
var eidolonMacroTrioNotice_cn = "";
var eidolonMacroTrioNotice_en = "";
;
