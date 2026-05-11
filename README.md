# WS 网站

竞速成绩排行榜网站，纯静态，便于维护、数据透明。

无需额外权限，可随时查询过往被提交的成绩纪录。

点击举报按钮，即可对成绩发起举报。

敬告那些臭鱼烂虾，以后自己玩去吧，别来恶心正常人。

---

## 页面结构

| 文件 | 说明 |
|------|------|
| `index.html` | 首页（三项入口） |
| `disruption.html` | 中断竞速榜单（单人、双人、多人） |
| `eidolon.html` | 夜灵竞速榜单（无宏） |
| `eidolon-macro.html` | 夜灵竞速榜单（有宏） |
| `profit-taker.html` | 大蜘蛛竞速榜单（无宏） |
| `profit-taker-macro.html` | 大蜘蛛竞速榜单（有宏） |
| `about.html` | 关于本站 |

## 维护榜单数据

**只需修改 `data/` 目录下对应的 `.js` 文件**。

```js
// 示例：data/disruption.js
const disruptionRecords = [
  {
    clearTime:  "01:23.456",   // 结算时间
    playerId:   "PlayerName",  // 玩家 ID
    uploadTime: "2026-05-10",  // 上传日期
    videoUrl:   "https://..."  // 录像链接（留空则行不可点击）
  },
];
```

排名由脚本按时间从小到大**自动排序**，无需手动填写。

## 全局调色

修改 `css/global.css` 顶部 `:root` 变量即可统一调整配色与辉光强度。

## 提交成绩表单

飞书表单：<*****>

## 部署

纯静态站点。

---

*© 2026 CSC Alliance*
