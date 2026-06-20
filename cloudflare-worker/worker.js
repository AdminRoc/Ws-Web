/* Cloudflare Worker — 定时触发 GitHub Actions 的 worldstate-cycles 工作流
 * 部署方式：Cloudflare Dashboard → Workers & Pages → 创建 Worker → 粘贴本文件内容
 * 需要的 Secret：GH_TOKEN（在 Worker 设置里加密变量，值为 GitHub Fine-grained Token，
 *                权限范围：仅 AdminRoc/Ws-Web 仓库，Actions: Read and write）
 * Cron Trigger：1,6,11,16,21,26,31,36,41,46,51,56 * * * *（每5分钟一次，
 *               自然包含 00:01 UTC = 北京时间 08:01）
 */
export default {
  async scheduled(event, env, ctx) {
    const resp = await fetch(
      'https://api.github.com/repos/AdminRoc/Ws-Web/actions/workflows/worldstate-cycles.yml/dispatches',
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
      console.log('trigger failed:', resp.status, await resp.text());
    }
  },
};
