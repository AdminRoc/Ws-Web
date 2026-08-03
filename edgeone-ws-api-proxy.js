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

const ROUTES = {
  '/warframestat/': { base: 'https://api.warframestat.us/pc/', extraHeaders: true },
  '/bounty-cycle':   { base: 'https://oracle.browse.wf/bounty-cycle' },
  '/export-regions': { base: 'https://browse.wf/warframe-public-export-plus/ExportRegions.json' },
  '/dict-zh':        { base: 'https://cdn.jsdelivr.net/gh/calamity-inc/warframe-public-export-plus@senpai/dict.zh.json' },
  '/null00':         { base: 'https://api.null00.com/world/ZHCN' },
  '/raw-ws':         { base: 'https://oracle.browse.wf/worldState.json' },
};

// ── 新增：User-Agent 白名单 ──
// 只允许浏览器和已知客户端，拦截恶意代理
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

// ── 新增：简单的内存限流器 ──
// 每个 Worker 实例独立，重启后重置
const RATE_LIMIT = {
  windowMs: 60000,     // 1 分钟窗口
  maxRequests: 100,    // 每个 IP 每分钟最多 100 次请求
};
const requestCounts = new Map(); // ip -> { count, resetTime }

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

// 清理过期记录（每 10 分钟执行一次）
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

  // ── 新增：1. User-Agent 检查 ──
  // 拦截非浏览器请求（如 privatemw-public-proxy）
  const userAgent = request.headers.get('User-Agent') || '';
  if (!isAllowedUserAgent(userAgent)) {
    return new Response('Forbidden', { status: 403, headers: { 'Content-Type': 'text/plain' } });
  }

  // ── 修正：2. 来源检查 ──
  // 允许浏览器预加载（空 Referer/Origin），但检查 User-Agent
  // 拦截非浏览器请求（如 curl、Postman、恶意爬虫）
  const referer = request.headers.get('Referer') || '';
  const origin = request.headers.get('Origin') || '';
  
  if (!referer && !origin) {
    // 空 Referer/Origin：可能是浏览器预加载或直接访问
    // 检查 User-Agent 是否为浏览器
    if (!isAllowedUserAgent(userAgent)) {
      return new Response('Forbidden', { status: 403, headers: { 'Content-Type': 'text/plain' } });
    }
  } else {
    // 有 Referer 或 Origin：检查是否包含允许的域名
    const allowed = ALLOWED_ORIGINS.some(d =>
      referer.includes(d) || origin.includes(d)
    );
    if (!allowed) {
      return new Response('Forbidden', { status: 403, headers: { 'Content-Type': 'text/plain' } });
    }
  }

  // ── 新增：3. IP 限流检查 ──
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

  if (match.extraHeaders) {
    headers.set('Accept', 'application/json');
    headers.set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36');
  } else {
    headers.set('User-Agent', 'Mozilla/5.0 (compatible; wfspeed-data-sync/1.0; +https://wfspeed.run)');
    headers.set('Accept', 'application/json');
  }

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

function getCacheControl(path) {
  if (path.includes('/warframestat/') || path.includes('/raw-ws') || path.includes('/bounty-cycle'))
    return 'public, max-age=30, stale-while-revalidate=60';
  if (path.includes('/null00'))
    return 'public, max-age=60, stale-while-revalidate=120';
  if (path.includes('/export-regions') || path.includes('/dict-zh'))
    return 'public, max-age=604800, immutable';
  return 'public, max-age=60';
}
