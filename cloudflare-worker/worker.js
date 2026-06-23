/* Cloudflare Worker — 定时触发 GitHub Actions 的工作流
 * 部署方式：Cloudflare Dashboard → Workers & Pages → 创建 Worker → 粘贴本文件内容
 * 需要的 Secret：GH_TOKEN（在 Worker 设置里加密变量，值为 GitHub Fine-grained Token，
 *                权限范围：仅 AdminRoc/Ws-Web 仓库，Actions: Read and write）
 *
 * 需要添加两条 Cron Trigger（Settings → Triggers → Cron Triggers）：
 *   1,6,11,16,21,26,31,36,41,46,51,56 * * * *   → 每5分钟，触发 worldstate-cycles.yml
 *   7 * * * *                                    → 每小时第7分钟，触发 tenet-coda-rotation.yml
 * 用 event.cron 区分是哪条触发的，分别 dispatch 对应的工作流。
 */
const CRON_WORKFLOW_MAP = {
  '1,6,11,16,21,26,31,36,41,46,51,56 * * * *': 'worldstate-cycles.yml',
  '7 * * * *': 'tenet-coda-rotation.yml',
};

export default {
  async scheduled(event, env, ctx) {
    const workflow = CRON_WORKFLOW_MAP[event.cron];
    if (!workflow) {
      console.log('未识别的 cron 表达式，跳过：', event.cron);
      return;
    }
    const resp = await fetch(
      `https://api.github.com/repos/AdminRoc/Ws-Web/actions/workflows/${workflow}/dispatches`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.GH_TOKEN}`,
          'Accept': 'application/vnd.github+json',
          'User-Agent': 'wfspeed-cron-trigger',
        },
        body: JSON.stringify({ ref: 'main' }),
      }
    );
    if (!resp.ok) {
      console.log(`trigger failed (${workflow}):`, resp.status, await resp.text());
    }
  },
};
