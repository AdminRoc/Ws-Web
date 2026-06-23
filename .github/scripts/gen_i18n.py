#!/usr/bin/env python3
"""组装统一中英映射库 data/i18n/wf-i18n.json（详见记忆 unified-i18n-plan）。

把现在分散在多处、各自独立的翻译源，按 key 空间拼成一份同源规范字典：
  byPath   ← log/js/wf-i18n-zh.js 的 WF.I18N_ZH（对象路径 → 中文，eelog 用）
  byName   ← data/item-names-zh.json（英文显示名 → 中文，worldstate 入侵奖励等用）
  byLang   ← 远程 dict.zh.json 中"本站经 ExportRegions 实际会查到的键"的子集
             （/Lotus/Language/... → 中文，worldstate resolveNode 用；只取子集，
              不整包 35826 条）
  override / planet / mission / misc ← data/wf-translations.json（两模块共用）

设计原则见记忆 optimize-without-weakening / two-core-dev-principles：
  - 不改变任何现有翻译的取值（byPath/byName/各表都原样搬运）。
  - 远程拉取失败时，byLang 退化为空但脚本不报错失败，其余子表照常生成
    （byLang 仅为 worldstate 节点名提供同源兜底，缺了也只是退回它原有的远程实时查询）。
"""
import json
import os
import re
import sys
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT_DIR = os.path.join(ROOT, 'data', 'i18n')
OUT_PATH = os.path.join(OUT_DIR, 'wf-i18n.json')

EXPORT_REGIONS_URLS = [
    'https://browse.wf/warframe-public-export-plus/ExportRegions.json',
    'https://cdn.jsdelivr.net/gh/calamity-inc/warframe-public-export-plus@master/ExportRegions.json',
]
DICT_ZH_URLS = [
    'https://raw.githubusercontent.com/calamity-inc/warframe-public-export-plus/refs/heads/senpai/dict.zh.json',
    'https://cdn.jsdelivr.net/gh/calamity-inc/warframe-public-export-plus@senpai/dict.zh.json',
]


def fetch_json(urls):
    for u in urls:
        try:
            req = urllib.request.Request(u, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req, timeout=25) as r:
                return json.loads(r.read().decode('utf-8'))
        except Exception as e:
            print(f'  拉取失败 {u}: {e}', file=sys.stderr)
    return None


def parse_i18n_zh():
    """从 log/js/wf-i18n-zh.js 提取 WF.I18N_ZH 对象（path -> 中文）。
    该对象是扁平的 字符串:字符串 字面量，等价于合法 JSON，按大括号配对截取后 json.loads。"""
    path = os.path.join(ROOT, 'log', 'js', 'wf-i18n-zh.js')
    txt = open(path, encoding='utf-8-sig').read()
    i = txt.index('WF.I18N_ZH')
    j = txt.index('{', i)
    depth = 0
    for k in range(j, len(txt)):
        c = txt[k]
        if c == '{':
            depth += 1
        elif c == '}':
            depth -= 1
            if depth == 0:
                return json.loads(txt[j:k + 1])
    raise ValueError('无法在 wf-i18n-zh.js 中定位 WF.I18N_ZH 对象')


def build_by_lang():
    """byLang = ExportRegions 各节点引用的 Language 键（name/missionName/systemName）
    在远程 dict.zh.json 中能查到的那部分。远程失败则返回空表。"""
    regions = fetch_json(EXPORT_REGIONS_URLS)
    dict_zh = fetch_json(DICT_ZH_URLS)
    if not regions or not dict_zh:
        print('  ⚠ ExportRegions 或 dict.zh.json 拉取失败，byLang 本次留空（不影响其它子表）')
        return {}
    wanted = set()
    for node in regions.values():
        for f in ('name', 'missionName', 'systemName'):
            v = node.get(f)
            if isinstance(v, str) and v:
                wanted.add(v)
    by_lang = {k: dict_zh[k] for k in wanted if k in dict_zh}
    print(f'  ExportRegions 引用 {len(wanted)} 个 Language 键，dict.zh.json 命中 {len(by_lang)} 条')
    return by_lang


def _strip_meta(d):
    """剔除以 _ 开头的元数据键（如 _comment），让源文件可安全携带注释而不污染字典。"""
    return {k: v for k, v in d.items() if not str(k).startswith('_')}


def main():
    by_path = _strip_meta(parse_i18n_zh())
    by_name = _strip_meta(json.load(open(os.path.join(ROOT, 'data', 'item-names-zh.json'), encoding='utf-8')))
    wft = json.load(open(os.path.join(ROOT, 'data', 'wf-translations.json'), encoding='utf-8'))
    by_lang = build_by_lang()

    out = {
        '_comment': ('自动生成，请勿手动编辑。由 .github/scripts/gen_i18n.py 组装。'
                     '要改翻译请改对应源：byPath→log/js/wf-i18n-zh.js，byName→data/item-names-zh.json，'
                     'override/planet/mission/misc→data/wf-translations.json，byLang 为远程 dict.zh.json 子集。'),
        'byPath':   by_path,
        'byName':   by_name,
        'byLang':   by_lang,
        'override': wft.get('ITEM_OVERRIDE', {}),
        'planet':   wft.get('PLANET', {}),
        'mission':  wft.get('MISSION_TYPE', {}),
        'misc':     wft.get('MISC', {}),
    }

    os.makedirs(OUT_DIR, exist_ok=True)
    with open(OUT_PATH, 'w', encoding='utf-8', newline='\n') as f:
        # sort_keys 保证输出确定性：byLang 由 set 推导，键序本不稳定，排序后每次结果一致，
        # 避免自动构建工作流每跑一次就因键序变动产生无意义 diff/提交。派生文件键序无所谓。
        json.dump(out, f, ensure_ascii=False, indent=0, separators=(',', ':'), sort_keys=True)
        f.write('\n')

    print('已生成', os.path.relpath(OUT_PATH, ROOT))
    print(f'  byPath={len(by_path)} byName={len(by_name)} byLang={len(by_lang)} '
          f'override={len(out["override"])} planet={len(out["planet"])} '
          f'mission={len(out["mission"])} misc={len(out["misc"])}')
    return 0


if __name__ == '__main__':
    sys.exit(main())
