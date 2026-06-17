"""
用 warframe-public-export-plus 的双语 dict 生成物品中文名称字典。
流程：dict.en.json（内部路径→英文） 反转后查 dict.zh.json（内部路径→中文），
得到 英文显示名 → 中文名 的映射，供前端 tr() 使用。
"""
import json, re, urllib.request

BASE = 'https://cdn.jsdelivr.net/gh/calamity-inc/warframe-public-export-plus@senpai/'

def fetch(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'WsWeb-bot/1.0'})
    with urllib.request.urlopen(req, timeout=20) as r:
        return json.loads(r.read().decode('utf-8'))

print('下载 dict.en.json ...')
en = fetch(BASE + 'dict.en.json')
print('下载 dict.zh.json ...')
zh = fetch(BASE + 'dict.zh.json')

# 反转 en_dict: 英文显示名 -> 内部路径
# 遇到重复时，取更短的 key（更可能是名称而非描述）
# 正向索引：英文显示名 -> 内部路径（同名取更短的 key）
en_rev = {}
en_rev_lower = {}   # 小写版用于不区分大小写回退
for k, v in en.items():
    if v not in en_rev or len(k) < len(en_rev[v]):
        en_rev[v] = k
    vl = v.lower()
    if vl not in en_rev_lower or len(k) < len(en_rev_lower[vl]):
        en_rev_lower[vl] = k

# API 中已知的拼写错误 -> 正确拼写
TYPO_FIX = {
    'Trio Orbit Ephermera': 'Trio Orbit Ephemera',
}

# dict 中不存在或命名不一致的物品，手动维护
MANUAL = {
    'Bishamo Pauldrons Blueprint': 'Bishamo 护肩蓝图',
    'Bishamo Cuirass Blueprint':   'Bishamo 胸甲蓝图',
    'Bishamo Helmet Blueprint':    'Bishamo 头盔蓝图',
    'Bishamo Greaves Blueprint':   'Bishamo 护腿蓝图',
}

def lookup(name):
    """英文显示名 -> 中文名，找不到返回 None"""
    name = TYPO_FIX.get(name, name)

    # 手动词条优先
    if name in MANUAL:
        return MANUAL[name]

    # 精确匹配
    key = en_rev.get(name)
    if key:
        return zh.get(key)

    # 大小写不敏感匹配（处理 "PRIMARY ARCANE ADAPTER" 等全大写条目）
    key = en_rev_lower.get(name.lower())
    if key:
        return zh.get(key)

    # 处理 "Nx Forma" / "Xk Kuva" 等带前缀数量的格式
    m = re.match(r'^(\d+[xk]?\s+)(.+)$', name, re.IGNORECASE)
    if m:
        base_zh = lookup(m.group(2))
        if base_zh:
            return m.group(1).strip() + ' ' + base_zh

    # 处理 "... Blueprint" 后缀：翻译主体名称后拼接"蓝图"
    if name.endswith(' Blueprint'):
        base_zh = lookup(name[:-len(' Blueprint')])
        if base_zh:
            return base_zh + ' 蓝图'

    return None

# 从 worldstate-all.json 提取所有需要翻译的英文名
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

# 加载已有翻译（只追加，不覆盖已有词条）
try:
    with open('data/item-names-zh.json', encoding='utf-8') as f:
        translations = json.load(f)
except Exception:
    translations = {}

new_count = 0
for name in sorted(names):
    if name in translations:
        continue
    result = lookup(name)
    if result:
        translations[name] = result
        print(f'  {name!r} -> {result!r}')
        new_count += 1
    else:
        print(f'  {name!r} -> 未找到')

with open('data/item-names-zh.json', 'w', encoding='utf-8') as f:
    json.dump(translations, f, ensure_ascii=False, indent=2)

print(f'\n完成：本次新增 {new_count} 条，共 {len(translations)} 条')
