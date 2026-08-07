addEventListener('fetch', event => event.respondWith(handleRequest(event.request)));

// CORS 白名单：仅允许自有域名
const ALLOWED_ORIGINS = ['wfspeed.run', 'war-frame.com'];
function getAllowedOrigin(origin) {
  if (!origin || origin === 'null') return ALLOWED_ORIGINS[0];
  try {
    const host = new URL(origin).hostname;
    if (ALLOWED_ORIGINS.some(d => host === d || host.endsWith('.' + d))) return origin;
  } catch (e) {}
  return ALLOWED_ORIGINS[0];
}

// ── 路由表 ──
// /warframestat/ 已移除：上游 api.warframestat.us 的 Cloudflare 对 EdgeOne 回源 IP
// 按 IP 段封禁（即便携带完整浏览器 UA 仍返回 403，2026-08-07 实测 100% 失败），
// 该分支不可能成功，前端 worldstate.html 已同步禁用（apiP = no-op）。
// 世界状态实时数据改由 /raw-ws 透传官方 api.warframe.com（无 Cloudflare 防护，回源正常）。
const ROUTES = {
  '/bounty-cycle':   { base: 'https://oracle.browse.wf/bounty-cycle' },
  '/export-regions': { base: 'https://browse.wf/warframe-public-export-plus/ExportRegions.json' },
  '/dict-zh':        { base: 'https://cdn.jsdelivr.net/gh/calamity-inc/warframe-public-export-plus@senpai/dict.zh.json' },
  '/null00':         { base: 'https://api.null00.com/world/ZHCN' },
  '/raw-ws':         { base: 'https://api.warframe.com/cdn/worldState.php' },
  // 国服 aux 主数据源：worldstate.wf.wiki（Next.js 页面内嵌 RSC 数据，openresty 无 Bot 防护，
  // 服务器透传可行）。前端从透传的 HTML 中提取 self.__next_f 内嵌 JSON（见 worldstate 独立库）。
  '/wf-wiki':        { base: 'https://worldstate.wf.wiki/', accept: 'text/html,application/xhtml+xml' },
};

// ── User-Agent 白名单 ──
const ALLOWED_USER_AGENTS = [
  'Mozilla/5.0',      // Chrome/Firefox/Safari/Edge
  'Opera/',
  'Safari/',
  'Mozilla/5.0 (compatible; wfspeed-data-sync/1.0)',
];

function isAllowedUserAgent(ua) {
  if (!ua) return false;
  return ALLOWED_USER_AGENTS.some(prefix => ua.startsWith(prefix));
}

// ── 内存限流器 ──
const RATE_LIMIT = {
  windowMs: 60000,     // 1 分钟窗口
  maxRequests: 100,    // 每个 IP 每分钟最多 100 次请求
};
const requestCounts = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const record = requestCounts.get(ip);

  if (!record || now > record.resetTime) {
    requestCounts.set(ip, { count: 1, resetTime: now + RATE_LIMIT.windowMs });
    return false;
  }

  record.count++;
  return record.count > RATE_LIMIT.maxRequests;
}

let lastCleanup = Date.now();
function cleanupRateLimit() {
  const now = Date.now();
  if (now - lastCleanup > 600000) {
    for (const [ip, record] of requestCounts) {
      if (now > record.resetTime) requestCounts.delete(ip);
    }
    lastCleanup = now;
  }
}

async function handleRequest(request) {
  cleanupRateLimit();

  const url = new URL(request.url);
  let match = null;
  let targetPath = '';

  for (const [prefix, conf] of Object.entries(ROUTES)) {
    if (url.pathname.startsWith(prefix)) {
      match = conf;
      targetPath = url.pathname.slice(prefix.length) + url.search;
      break;
    }
  }

  if (!match) return new Response('Not Found', { status: 404, headers: { 'Content-Type': 'text/plain' } });

  // ── 来源检查 + User-Agent 检查 ──
  const referer = request.headers.get('Referer') || '';
  const origin = request.headers.get('Origin') || '';
  const userAgent = request.headers.get('User-Agent') || '';

  // 情况1：有 Referer 或 Origin → 检查域名
  if (referer || origin) {
    const allowed = ALLOWED_ORIGINS.some(d =>
      referer.includes(d) || origin.includes(d)
    );
    if (!allowed) {
      return new Response('Forbidden', { status: 403, headers: { 'Content-Type': 'text/plain' } });
    }
  }
  // 情况2：无 Referer 且无 Origin → 检查 User-Agent
  else {
    // 允许空 User-Agent（浏览器 fetch 请求）
    // 但拦截明确的非浏览器 User-Agent（如 curl、Postman）
    if (userAgent && !isAllowedUserAgent(userAgent)) {
      return new Response('Forbidden', { status: 403, headers: { 'Content-Type': 'text/plain' } });
    }
  }

  // ── IP 限流检查 ──
  const clientIP = request.headers.get('CF-Connecting-IP') || request.headers.get('X-Forwarded-For') || 'unknown';
  if (isRateLimited(clientIP)) {
    return new Response('Rate Limited', {
      status: 429,
      headers: {
        'Content-Type': 'text/plain',
        'Retry-After': '60'
      }
    });
  }

  const target = new URL(match.base + targetPath);
  const headers = new Headers();
  headers.set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36');
  // /wf-wiki 需要完整 HTML（内嵌 RSC 数据），其余路由要 JSON
  headers.set('Accept', match.accept || 'application/json');

  const resp = await fetch(target.href, { method: 'GET', headers });

  const out = new Response(resp.body, {
    status: resp.status,
    headers: {
      'Content-Type': resp.headers.get('Content-Type') || 'application/json',
      'Access-Control-Allow-Origin': getAllowedOrigin(origin),
      'Cache-Control': getCacheControl(url.pathname),
    },
  });
  return out;
}

// ── 缓存策略 ──
// 实时透传端点（世界状态/赏金轮次/国服世界状态）：no-store，保证每次请求都拿到
// 上游最新数据——前端 worldstate.html 自己用 localStorage 做客户端去重（CACHE_TTL），
// 边缘层不需要也不应该再缓存，避免出现"最多 30 秒旧"的延迟。
// 静态字典端点（7 天不变的数据）：长期缓存。
function getCacheControl(path) {
  if (path.includes('/raw-ws') || path.includes('/bounty-cycle') || path.includes('/null00'))
    return 'no-store';
  if (path.includes('/export-regions') || path.includes('/dict-zh'))
    return 'public, max-age=604800, immutable';
  return 'no-store';
}
