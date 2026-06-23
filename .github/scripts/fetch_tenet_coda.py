#!/usr/bin/env python3
"""抓取信条(Tenet)/终幕(Coda)武器轮换的元素+加成百分比，写入 data/tenet-coda-rotation.json。

背景：这两项数据（每次轮换的元素类型 + 加成百分比）是游戏内随机生成的，没有任何
官方/社区 API 能直接查询（api.warframestat.us 没有这两个端点），只能靠玩家实测后
记录下来。社区维护着一份公开的 Google Sheets 表格持续记录这些实测结果：
  https://docs.google.com/spreadsheets/d/1hyWSyPqw1072vJR2eacYVcpBiL_cdL0E3MCs5Vb6s40
Google 服务在中国大陆访问不稳定，不能让用户浏览器直连这个表格，所以改为本脚本在
GitHub Actions 的服务器上（不受大陆网络限制）定时抓取，转成简单 JSON 提交进仓库，
worldstate.html 再读取这份同源文件——跟 worldstate-all.json 快照是同一个思路。
"""
import datetime
import json
import os
import re
import sys
import urllib.request

SHEET_ID = '1hyWSyPqw1072vJR2eacYVcpBiL_cdL0E3MCs5Vb6s40'
TENET_URL = f'https://docs.google.com/spreadsheets/d/{SHEET_ID}/gviz/tq?tqx=out:json&sheet=Tenet_Weapons_Auto&headers=1'
CODA_URL = f'https://docs.google.com/spreadsheets/d/{SHEET_ID}/gviz/tq?tqx=out:json'

OUT_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
                        'data', 'tenet-coda-rotation.json')


def fetch_gviz(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=20) as r:
        raw = r.read().decode('utf-8')
    # gviz 响应包了一层 google.visualization.Query.setResponse({...});，剥掉外壳取纯 JSON
    m = re.search(r'setResponse\((.*)\);?\s*$', raw, re.S)
    if not m:
        raise ValueError('gviz 响应格式不符合预期，可能表格结构变了')
    return json.loads(m.group(1))


def parse_rows(gviz_data):
    """把 gviz 的 table.rows 转成 [{name, element, bonusPct}]，跳过空行/表头行。"""
    rows = (gviz_data.get('table') or {}).get('rows') or []
    out = []
    for row in rows:
        cells = row.get('c') or []
        name = (cells[0] or {}).get('v') if len(cells) > 0 and cells[0] else None
        elem = (cells[1] or {}).get('v') if len(cells) > 1 and cells[1] else None
        if not name or not elem:
            continue
        name = str(name).strip()
        if name.lower() in ('last updated', 'last data change'):
            continue
        elem = str(elem).strip()
        pct = None
        if len(cells) > 2 and cells[2]:
            c2 = cells[2]
            # 数值列(number,带 pattern 0%)优先用 v(0~1的小数)，文本列用 f(已格式化的"25.4%"字符串)
            if isinstance(c2.get('v'), (int, float)):
                pct = round(c2['v'] * 100, 2)
            elif c2.get('f'):
                pct = float(str(c2['f']).replace('%', '').strip())
            elif c2.get('v'):
                pct = float(str(c2['v']).replace('%', '').strip())
        out.append({'name': name, 'element': elem, 'bonusPct': pct})
    return out


def detect_batch_label(gviz_data):
    """Coda 表头形如 "Weapon (Batch B)"，从里面抠出批次字母。"""
    cols = (gviz_data.get('table') or {}).get('cols') or []
    if cols:
        label = cols[0].get('label') or ''
        m = re.search(r'Batch\s+([A-Za-z])', label)
        if m:
            return m.group(1)
    return None


def main():
    tenet_raw = fetch_gviz(TENET_URL)
    coda_raw = fetch_gviz(CODA_URL)

    tenet_weapons = parse_rows(tenet_raw)
    coda_weapons = parse_rows(coda_raw)
    coda_batch = detect_batch_label(coda_raw)

    if not tenet_weapons and not coda_weapons:
        print('两份数据都解析为空，可能源表格挂了/改版了，本次不写文件，保留上次的结果')
        return 1

    out = {
        'tenet': {'weapons': tenet_weapons},
        'coda': {'batch': coda_batch, 'weapons': coda_weapons},
        'source': 'https://docs.google.com/spreadsheets/d/' + SHEET_ID,
        'fetchedAt': datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ'),
    }

    old = None
    if os.path.exists(OUT_PATH):
        try:
            old = json.load(open(OUT_PATH, encoding='utf-8'))
        except Exception:
            old = None
    # fetchedAt 必然每次都变，单独比较内容是否真的变化，避免无意义的 commit
    changed = (old is None or
               old.get('tenet') != out['tenet'] or
               old.get('coda') != out['coda'])

    with open(OUT_PATH, 'w', encoding='utf-8', newline='\n') as f:
        json.dump(out, f, ensure_ascii=False, indent=2)
        f.write('\n')

    print(('内容有更新' if changed else '内容无变化（仅时间戳）') +
          f' tenet={len(tenet_weapons)} coda(batch {coda_batch})={len(coda_weapons)}')
    return 0


if __name__ == '__main__':
    sys.exit(main())
