export default async function fetch(request) {
  const url = new URL(request.url);
  const path = url.pathname;

  const browserHeaders = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
  };

  let upstreamUrl;
  let cacheControl;

  if (path === '/dict-zh') {
    upstreamUrl = 'https://raw.githubusercontent.com/calamity-inc/warframe-public-export-plus/refs/heads/senpai/dict.zh.json';
    cacheControl = 'public, max-age=86400';  // 24 小时：字典几乎不变
  } else if (path === '/bounty-cycle') {
    upstreamUrl = 'https://oracle.browse.wf/bounty-cycle';
    cacheControl = 'public, max-age=60';     // 60 秒：轮次有 expiry，短期缓存即可
  } else if (path === '/export-regions') {
    upstreamUrl = 'https://browse.wf/warframe-public-export-plus/ExportRegions.json';
    cacheControl = 'public, max-age=604800'; // 7 天：节点数据几乎不变
  } else if (path.startsWith('/warframestat/')) {
    const rest = path.slice('/warframestat/'.length);
    upstreamUrl = 'https://api.warframestat.us/pc/' + rest + url.search;
    cacheControl = 'public, max-age=60';     // 60 秒：世界状态每几分钟更新
  } else {
    return new Response('Not Found', { status: 404 });
  }

  const response = await fetch(upstreamUrl, { headers: browserHeaders });

  const newResponse = new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers
  });

  newResponse.headers.set('Cache-Control', cacheControl);

  return newResponse;
}
