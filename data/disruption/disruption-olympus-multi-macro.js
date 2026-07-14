/**
 * ════════════════════════════════════════════════════════════
 *  data/disruption-olympus-multi-macro.js  —  中断竞速（Olympus·多人·无限制）数据文件
 *
 *  字段说明：
 *    clearTime  —— 时间，格式 "MM:SS.mmm"  例："01:23.456"
 *    playerId   —— 玩家 ID（多人/双人用 / 分隔）
 *    uploadTime —— 上传日期，格式 "YYYY-MM-DD"
 *    videoUrls  —— 视频链接数组；最多4个视角 ["url1","url2",...]
 *
 *  排名规则：脚本按 clearTime 从小到大自动排序
 *  新增条目：在数组末尾复制模板并填写字段，保存后刷新页面生效
 * ════════════════════════════════════════════════════════════
 */
var disruptionOlympusMultiMacroRecords = [
  // ─── 在此处添加条目 ───
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
var disruptionOlympusMultiMacroNotice_cn = "本站注意到，部分竞速的配置是以〔利用BUG〕为核心而建立的，不再利用BUG，或BUG被修复后，就完全不具备可行性了。所以，这种成绩与正常的成绩应当有所区分，否则对其他玩家将是极为不公平的。\n \n 在此基础上，本站同样认为，每一份辛苦取得的成绩，都值得被保留与展示，所以本站将这些〔利用了BUG 或 有其他超常收益行为〕的竞速成绩，单独进行了展示。\n \n 此举是为了所有人的竞技公平性，绝无任何贬低之意。本站深知，每一份成绩都意义重大，代表着大家长期以来的坚持与付出。";
var disruptionOlympusMultiMacroNotice_en = "We have noticed an issue. Some speedrun builds rely completely on game bugs. These builds become useless if developers fix the bugs. They also fail if players stop using the bugs. Therefore, we must separate these runs from normal runs. This situation is highly unfair to other players otherwise.\n \n We also value your hard work. Every hard-earned record deserves preservation and display. Therefore, we have created a separate category. We will put runs that use bugs or unintended mechanics in this new section.\n \n We make this change to ensure fair competition for everyone. We do not mean to disrespect anyone. We know that every record is important. Every record represents your long-term dedication and effort.";
