addEventListener('fetch', event => event.respondWith(handleRequest(event.request)));
const ROUTES = {
  '/warframestat/': { base: 'https://api.warframestat.us/pc/', extraHeaders: true },
  '/bounty-cycle':   { base: 'https://oracle.browse.wf/bounty-cycle' },
  '/export-regions': { base: 'https://browse.wf/warframe-public-export-plus/ExportRegions.json' },
  '/dict-zh':        { base: 'https://cdn.jsdelivr.net/gh/calamity-inc/warframe-public-export-plus@senpai/dict.zh.json' },
  '/null00':         { base: 'https://api.null00.com/world/ZHCN' },
  '/raw-ws':         { base: 'https://oracle.browse.wf/worldState.json' },
};

async function handleRequest(request) {
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

  if (!match) return new Response('Not Found', { status: 404 });

  // 来源检查：只允许 wfspeed.run 域名的请求
  const referer = request.headers.get('Referer') || '';
  const origin = request.headers.get('Origin') || '';
  const allowed = referer.includes('wfspeed.run') || origin.includes('wfspeed.run');
  if (!allowed) {
    return new Response('Forbidden', { status: 403 });
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
      'Access-Control-Allow-Origin': '*',
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