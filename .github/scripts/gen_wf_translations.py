#!/usr/bin/env python3
"""把 data/wf-translations.json 转成可被浏览器 <script> 直接加载的 js/wf-translations.js。
EELOG 模块（log/js/solNodes.js 的生成脚本）和世界状态模块（worldstate.html）共用同一份
data/wf-translations.json 作为唯一可信源，避免两边各自维护一份翻译表导致不同步。
修改翻译时只改 data/wf-translations.json，然后重新运行本脚本即可同步到 js/wf-translations.js。
"""
import json
import os

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SRC = os.path.join(ROOT, 'data', 'wf-translations.json')
DST = os.path.join(ROOT, 'js', 'wf-translations.js')


def main():
    with open(SRC, encoding='utf-8') as f:
        data = json.load(f)
    data.pop('_comment', None)

    lines = [
        'window.WF_TR = ' + json.dumps(data, ensure_ascii=False, indent=2) + ';',
        '',
    ]
    header = (
        '/* 通用汉化主数据 —— 由 data/wf-translations.json 生成，请勿手动编辑本文件。\n'
        '   要修改翻译，请改 data/wf-translations.json 后重新运行\n'
        '   .github/scripts/gen_wf_translations.py */\n'
    )
    with open(DST, 'w', encoding='utf-8', newline='\n') as f:
        f.write(header)
        f.write('\n'.join(lines))
        f.write('\n')
    print('wrote', DST)


if __name__ == '__main__':
    main()
