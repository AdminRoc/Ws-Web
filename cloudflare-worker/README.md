# 世界状态校准定时触发器

用 Cloudflare Workers 的 Cron Triggers 每小时调用一次 GitHub Actions 的
`worldstate-cycles.yml`（`workflow_dispatch`），弥补 GitHub 自带 `schedule`
触发延迟不可控的问题。与本站域名解析（DNS）完全无关，不需要把域名挂在
Cloudflare 上。

## 纯网页部署步骤（不需要本地装任何东西）

1. 打开 https://dash.cloudflare.com ，登录后进入 **Workers & Pages**
2. 点击 **创建（Create）** → **创建 Worker（Create Worker）**
3. 起个名字（例如 `wfspeed-worldstate-trigger`），点击 **部署（Deploy）**
   （这会先生成一个默认的 Hello World Worker）
4. 进入这个 Worker，点击 **编辑代码（Edit code）**
5. 把编辑器里的默认代码全部删掉，粘贴本目录 `worker.js` 的内容，点击 **部署（Deploy）**
6. 回到 Worker 详情页，进入 **设置（Settings）** → **变量（Variables）**
7. 找到 **加密的环境变量（Encrypted environment variables）** → 点击添加
   - 变量名：`GH_TOKEN`
   - 值：粘贴你在 GitHub 生成的 Fine-grained Token
   - 保存
8. 仍在 **设置（Settings）** 里，进入 **触发器（Triggers）** → **Cron 触发器（Cron Triggers）**
9. 点击 **添加 Cron 触发器** ，输入：
   ```
   1 * * * *
   ```
10. 保存即可，完全不需要 wrangler / npm / 命令行。

## GitHub Token 要求

- Fine-grained personal access token
- Repository access：仅选择 `AdminRoc/Ws-Web`
- Permissions：`Actions` → `Read and write`（`Metadata: Read-only` 是必需项，会自动带上）

## 文件说明

- `worker.js` —— Worker 实际运行的代码，网页编辑器里粘贴这个文件的内容即可
- `wrangler.toml` —— 仅供以后想用命令行（`wrangler deploy`）部署时使用，网页操作不需要这个文件
