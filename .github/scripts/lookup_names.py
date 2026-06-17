import json, re, time, urllib.parse, urllib.request

def has_chinese(s):
    return bool(re.search(r'[一-鿿]', s))

def wiki_lookup(name):
    url = ('https://warframe.huijiwiki.com/api.php?action=query'
           '&list=search&srsearch=' + urllib.parse.quote(name) +
           '&srnamespace=0&srlimit=1&format=json')
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'WsWeb-bot/1.0'})
        with urllib.request.urlopen(req, timeout=10) as r:
            data = json.loads(r.read())
        results = data.get('query', {}).get('search', [])
        if results:
            title = results[0]['title']
            if title != name and has_chinese(title):
                return title
    except Exception as e:
        print(f'  查询失败: {e}')
    return None

try:
    with open('data/item-names-zh.json', encoding='utf-8') as f:
        translations = json.load(f)
except Exception:
    translations = {}

try:
    with open('data/worldstate-all.json', encoding='utf-8') as f:
        ws = json.load(f)
except Exception:
    print('worldstate-all.json 不存在，跳过')
    exit(0)

names = set()
for deal in (ws.get('dailyDeals') or []):
    if deal.get('item'):
        names.add(deal['item'])
sp = ws.get('steelPath') or {}
if sp.get('currentReward', {}).get('name'):
    names.add(sp['currentReward']['name'])
for item in (sp.get('evergreens') or []):
    if item.get('name'):
        names.add(item['name'])

new_count = 0
for name in sorted(names):
    if name in translations:
        continue
    zh = wiki_lookup(name)
    if zh:
        translations[name] = zh
        print(f'  {name} -> {zh}')
        new_count += 1
    time.sleep(0.5)

with open('data/item-names-zh.json', 'w', encoding='utf-8') as f:
    json.dump(translations, f, ensure_ascii=False, indent=2)

print(f'完成，本次新增 {new_count} 条翻译，共 {len(translations)} 条')
