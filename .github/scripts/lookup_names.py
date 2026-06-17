"""
生成物品中文名称字典 data/item-names-zh.json。
翻译优先级：
  1. MANUAL 手动词条
  2. warframe-public-export-plus 双语 dict（en→zh，无需爬虫）
  3. 百度搜索 → 汇集 Wiki 结果标题（仅在前两步均失败时触发，频率很低）
"""
import gzip, html, json, re, time, urllib.parse, urllib.request

# ─── 常量 ────────────────────────────────────────────────────────────────────
BASE = 'https://cdn.jsdelivr.net/gh/calamity-inc/warframe-public-export-plus@senpai/'

# API 已知拼写错误 → 正确拼写
TYPO_FIX = {
    'Trio Orbit Ephermera': 'Trio Orbit Ephemera',
}

# dict 中不存在或命名不一致的物品，手动维护
MANUAL = {
    # 钢铁之路护甲套件（dict 里是 Drifter 版本，与此不同）
    'Bishamo Pauldrons Blueprint': 'Bishamo 护肩蓝图',
    'Bishamo Cuirass Blueprint':   'Bishamo 胸甲蓝图',
    'Bishamo Helmet Blueprint':    'Bishamo 头盔蓝图',
    'Bishamo Greaves Blueprint':   'Bishamo 护腿蓝图',
    # 突击修正条件（固定集合，warframestat.us 组合字符串，dict 里找不到）
    'Eximus Stronghold':           '精英战士要塞',
    'Shielded Enemies':            '护盾敌方',
    'Armored Enemies':             '护甲敌方',
    'Augmented Enemy Armor':       '增强敌方护甲',
    'Sniper Only':                 '仅限狙击枪',
    'Shotgun Only':                '仅限霰弹枪',
    'Rifle Only':                  '仅限步枪',
    'Pistol Only':                 '仅限手枪',
    'Bow Only':                    '仅限弓',
    'Melee Only':                  '仅限近战',
    'Energy Reduction':            '能量削减',
    'Low Gravity':                 '低重力',
    'Radiation Hazard':            '辐射危害',
    'Fire Hazard':                 '火焰危害',
    'Enemy Reinforcements':        '敌方增援',
    'Tainted Mag':                 '污染弹匣',
}

# 突击伤害类型名称（用于解析 "Enemy X Enhancement: Y" 模式）
DAMAGE_ZH = {
    'impact':       '冲击',   'puncture':   '穿刺',   'slash':   '切割',
    'heat':         '高温',   'cold':       '低温',   'electricity': '电击',
    'toxin':        '毒素',   'blast':      '爆炸',   'radiation':   '辐射',
    'gas':          '毒气',   'magnetic':   '磁力',   'viral':       '病毒',
    'corrosive':    '腐蚀',
}

# ─── 工具函数 ─────────────────────────────────────────────────────────────────
def has_chinese(s):
    return bool(re.search(r'[一-鿿]', s or ''))

def fetch_json(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'WsWeb-bot/1.0'})
    with urllib.request.urlopen(req, timeout=20) as r:
        return json.loads(r.read().decode('utf-8'))

# ─── 加载双语字典 ─────────────────────────────────────────────────────────────
print('下载 dict.en.json …')
en_dict = fetch_json(BASE + 'dict.en.json')
print('下载 dict.zh.json …')
zh_dict = fetch_json(BASE + 'dict.zh.json')

# 反转 en_dict：英文显示名 → 内部路径（同名时取更短的 key）
en_rev       = {}   # 精确大小写
en_rev_lower = {}   # 小写版，用于大小写不敏感回退
for k, v in en_dict.items():
    if v not in en_rev or len(k) < len(en_rev[v]):
        en_rev[v] = k
    vl = v.lower()
    if vl not in en_rev_lower or len(k) < len(en_rev_lower[vl]):
        en_rev_lower[vl] = k

# ─── 翻译函数（dict 路径） ────────────────────────────────────────────────────
def dict_lookup(name):
    name = TYPO_FIX.get(name, name)
    if name in MANUAL:
        return MANUAL[name]
    # "Enemy Elemental/Physical Enhancement: DamageType" 模式
    m = re.match(r'^Enemy (Elemental|Physical) Enhancement:\s*(.+)$', name)
    if m:
        kind = '元素' if m.group(1) == 'Elemental' else '物理'
        dtype_zh = DAMAGE_ZH.get(m.group(2).strip().lower())
        if dtype_zh:
            return f'敌方{kind}强化：{dtype_zh}'
    # 精确匹配
    key = en_rev.get(name)
    if key:
        return zh_dict.get(key)
    # 大小写不敏感（处理 "PRIMARY ARCANE ADAPTER" 等全大写条目）
    key = en_rev_lower.get(name.lower())
    if key:
        return zh_dict.get(key)
    # 带数量前缀："3x Forma"、"10k Kuva"
    m = re.match(r'^(\d+[xk]?\s+)(.+)$', name, re.IGNORECASE)
    if m:
        base_zh = dict_lookup(m.group(2))
        if base_zh:
            return m.group(1).strip() + ' ' + base_zh
    # Blueprint 后缀
    if name.endswith(' Blueprint'):
        base_zh = dict_lookup(name[:-len(' Blueprint')])
        if base_zh:
            return base_zh + ' 蓝图'
    return None

# ─── 百度搜索兜底 ─────────────────────────────────────────────────────────────
def baidu_lookup(name):
    """当 dict 查不到时，搜索百度并从汇集 Wiki 结果标题提取中文名。"""
    query = urllib.parse.quote(f'Warframe {name}')
    url   = f'https://www.baidu.com/s?wd={query}&rn=5'
    headers = {
        'User-Agent':      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0 Safari/537.36',
        'Accept-Language': 'zh-CN,zh;q=0.9',
        'Accept-Encoding': 'gzip, deflate',
        'Accept':          'text/html,application/xhtml+xml',
    }
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=15) as r:
            raw = r.read()
            enc = r.info().get('Content-Encoding', '')
            if 'gzip' in enc:
                raw = gzip.decompress(raw)
            page = raw.decode('utf-8', errors='ignore')

        # 从 <h3> 标签中找包含"非官方WARFRAME中文维基"的结果标题
        for h3 in re.findall(r'<h3[^>]*>(.*?)</h3>', page, re.DOTALL):
            text = html.unescape(re.sub(r'<[^>]+>', '', h3)).strip()
            if '非官方WARFRAME中文维基' in text:
                # 取第一个 " - " 之前的内容
                part = re.split(r'\s*[-－]\s*', text)[0].strip()
                if part and has_chinese(part) and part.lower() != name.lower():
                    return part
    except Exception as e:
        print(f'  百度查询失败 ({name}): {e}')
    return None

# ─── 从 worldstate-all.json 收集需要翻译的名称 ────────────────────────────────
try:
    with open('data/worldstate-all.json', encoding='utf-8') as f:
        ws = json.load(f)
except Exception:
    print('worldstate-all.json 不存在，跳过')
    exit(0)

names = set()

# 钢铁之路
sp = ws.get('steelPath') or {}
if sp.get('currentReward', {}).get('name'):
    names.add(sp['currentReward']['name'])
for item in (sp.get('evergreens') or []):
    if item.get('name'):
        names.add(item['name'])

# Darvo 特惠
for deal in (ws.get('dailyDeals') or []):
    if deal.get('item'):
        names.add(deal['item'])

# 入侵奖励
for inv in (ws.get('invasions') or []):
    for side in ('attacker', 'defender'):
        reward = inv.get(side, {}).get('reward') or {}
        for it in (reward.get('items') or []):
            if it:
                names.add(it)
        for ci in (reward.get('countedItems') or []):
            if ci.get('type'):
                names.add(ci['type'])

# 突击条件修正
for v in (ws.get('sortie', {}).get('variants') or []):
    if v.get('modifier'):
        names.add(v['modifier'])

# ─── 加载已有翻译（只追加，不覆盖） ──────────────────────────────────────────
try:
    with open('data/item-names-zh.json', encoding='utf-8') as f:
        translations = json.load(f)
except Exception:
    translations = {}

# ─── 逐条翻译 ─────────────────────────────────────────────────────────────────
dict_new   = 0
baidu_new  = 0
failed     = []

for name in sorted(names):
    # MANUAL / 模式匹配 词条始终强制覆盖（防止错误 Baidu 缓存留存）
    fixed = TYPO_FIX.get(name, name)
    if fixed in MANUAL or re.match(r'^Enemy (Elemental|Physical) Enhancement:', fixed):
        result = dict_lookup(name)
        if result and translations.get(name) != result:
            translations[name] = result
            print(f'  [fix]   {name!r} -> {result!r}')
        continue

    if name in translations:
        continue

    # 优先 dict
    result = dict_lookup(name)
    if result:
        translations[name] = result
        print(f'  [dict]  {name!r} -> {result!r}')
        dict_new += 1
        continue

    # 百度兜底：仅对真实物品名称使用，跳过明显的非物品描述句
    # 规则：含冒号（"X: Y" 修正条件）、以 Only/Hazard/Stronghold 结尾、
    #        以 Enemy/Low/Energy 开头的均视为非物品，不送百度
    if ((':' in name) or
        re.search(r'(Only|Hazard|Stronghold|Reinforcements)$', name) or
        re.match(r'^(Enemy|Low Gravity|Energy Reduction)', name)):
        print(f'  [skip]  {name!r}（非物品格式，跳过百度）')
        continue

    time.sleep(1.5)
    result = baidu_lookup(name)
    if result:
        translations[name] = result
        print(f'  [baidu] {name!r} -> {result!r}')
        baidu_new += 1
    else:
        print(f'  [miss]  {name!r}')
        failed.append(name)

# ─── 保存 ─────────────────────────────────────────────────────────────────────
with open('data/item-names-zh.json', 'w', encoding='utf-8') as f:
    json.dump(translations, f, ensure_ascii=False, indent=2)

print(f'\n完成：dict +{dict_new}，baidu +{baidu_new}，未找到 {len(failed)} 条，共 {len(translations)} 条')
if failed:
    print('  未找到：', failed)
