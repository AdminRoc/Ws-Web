#!/usr/bin/env python3
"""生成 log/js/solNodes.js —— EELOG 模块的 SolNode ID -> 中文描述映射表。

数据来源：
  1. 节点 ID/英文原名/任务类型/阵营：WFCD/warframe-worldstate-data 的 solNodes.json
     https://github.com/WFCD/warframe-worldstate-data/blob/master/data/solNodes.json
  2. 行星/任务类型中文译名：data/wf-translations.json（与世界状态模块共用同一份，
     避免两边各维护一份导致校正不同步）

原则：行星名、任务类型仅在 data/wf-translations.json 里有收录时才翻译为中文，
否则保留英文原名，不做猜测式硬翻译。

用法：
  python3 .github/scripts/gen_solnodes.py
  （需要网络访问 WFCD 的 solNodes.json；离线环境可用 --source 指定本地 JSON 文件路径）
"""
import argparse
import json
import os
import re
import sys
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
TRANSLATIONS_PATH = os.path.join(ROOT, 'data', 'wf-translations.json')
OUT_PATH = os.path.join(ROOT, 'log', 'js', 'solNodes.js')
DEFAULT_SOURCE_URL = (
    'https://raw.githubusercontent.com/WFCD/warframe-worldstate-data/'
    'master/data/solNodes.json'
)


def load_translations():
    with open(TRANSLATIONS_PATH, encoding='utf-8') as f:
        data = json.load(f)
    return data.get('PLANET', {}), data.get('MISSION_TYPE', {})


def load_source(source):
    if source.startswith('http://') or source.startswith('https://'):
        with urllib.request.urlopen(source, timeout=30) as resp:
            return json.loads(resp.read().decode('utf-8'))
    with open(source, encoding='utf-8') as f:
        return json.load(f)


def fmt(key, v, planet_cn, type_cn):
    val = v.get('value', '') or key
    typ = v.get('type', '')
    enemy = v.get('enemy', '')
    typ_zh = type_cn.get(typ, typ) if typ else '未知任务'
    m = re.match(r'^(.*)\(([^()]+)\)\s*$', val)
    if m:
        name = m.group(1).strip()
        planet_raw = m.group(2).strip()
        planet_zh = planet_cn.get(planet_raw, planet_raw)
        return (f"{name}, {planet_zh} ({typ_zh} - {enemy})" if enemy
                else f"{name}, {planet_zh} ({typ_zh})")
    return (f"{val} ({typ_zh} - {enemy})" if enemy
            else f"{val} ({typ_zh})")


def node_sort_key(k):
    m = re.search(r'(\d+)', k)
    return int(m.group(1)) if m else 0


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--source', default=DEFAULT_SOURCE_URL,
                     help='WFCD solNodes.json 的 URL 或本地路径')
    args = ap.parse_args()

    planet_cn, type_cn = load_translations()
    data = load_source(args.source)

    lines = [
        "window.WF = window.WF || {};\n",
        "/* SolNode 节点中文映射 — 完全由 WFCD/warframe-worldstate-data 的 solNodes.json 权威数据生成\n",
        "   行星名/任务类型译名来自 data/wf-translations.json（与世界状态模块共用），\n",
        "   仅在该文件收录时才翻译为中文，否则保留英文原名，不做猜测式硬翻译。\n",
        "   节点ID来源：https://github.com/WFCD/warframe-worldstate-data/blob/master/data/solNodes.json\n",
        "   生成脚本：.github/scripts/gen_solnodes.py */\n",
        "WF.SOL_NODES = {\n",
    ]
    for k in sorted(data.keys(), key=node_sort_key):
        line = fmt(k, data[k], planet_cn, type_cn)
        lines.append(f"  {json.dumps(k)}: {json.dumps(line, ensure_ascii=False)},\n")
    lines.append("};\n")

    with open(OUT_PATH, 'w', encoding='utf-8', newline='\n') as f:
        f.writelines(lines)
    print(f"wrote {OUT_PATH} ({len(data)} entries)")


if __name__ == '__main__':
    sys.exit(main())
