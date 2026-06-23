#!/usr/bin/env python3
"""把每个 data/<分类>/ 目录下的所有数据文件拼接成单个 _bundle.js。

目的：榜单页面原本要逐个 <script src> 加载几十个小数据文件（每页 15~62 个请求，
search.html 多达 317 个），大陆访问 GitHub Pages 时每个请求都要一次高延迟往返，
导致页面很慢甚至 ERR_CONNECTION_TIMED_OUT。拼成一个 bundle 后，每页只剩 1 个请求。

设计要点（保证零逻辑风险）：
  - 纯文本拼接：每个源文件声明的都是独立全局变量（var xxxRecords=[...] 等），
    拼接后这些全局变量原样都在，页面按变量名查表的逻辑一字不用改。
  - 不动源文件：你照旧逐个编辑 data/<分类>/ 下的小文件；本脚本只是把它们的
    当前内容拼成 _bundle.js。源文件是唯一事实来源，bundle 是派生产物。
  - 确定性输出：源文件按文件名排序拼接，内容不变则 bundle 不变，不产生无谓 diff。
  - 文件之间补一个换行 + 分号保护，避免某源文件结尾缺分号时与下一文件粘连。

用法：
  python3 .github/scripts/bundle_data.py            # 重建全部 bundle
  自动化：见 .github/workflows/bundle-data.yml（push 到 data/** 时触发）
"""
import glob
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DATA_DIR = os.path.join(ROOT, 'data')
BUNDLE_NAME = '_bundle.js'


def bundle_one_dir(d):
    """拼接单个分类目录，返回 (是否有变化, 源文件数)。"""
    srcs = sorted(
        f for f in glob.glob(os.path.join(d, '*.js'))
        if not os.path.basename(f).startswith('_')
    )
    if not srcs:
        return (False, 0)

    parts = [
        '/* ════════════════════════════════════════════════════════════\n'
        ' *  自动生成，请勿手动编辑本文件。\n'
        ' *  本文件由 .github/scripts/bundle_data.py 把同目录下所有数据源文件\n'
        ' *  拼接而成，用于减少 HTTP 请求数。要修改成绩数据，请编辑同目录下\n'
        ' *  对应的单个 <分类>-<节点>.js 源文件，push 后会自动重建本文件。\n'
        ' * ════════════════════════════════════════════════════════════ */\n'
    ]
    for src in srcs:
        rel = os.path.relpath(src, ROOT).replace('\\', '/')
        content = open(src, encoding='utf-8').read()
        parts.append('\n/* ===== ' + rel + ' ===== */\n')
        parts.append(content)
        if not content.endswith('\n'):
            parts.append('\n')
        parts.append(';\n')  # 分号保护，防止源文件漏写分号导致与下一文件粘连

    new_text = ''.join(parts)
    out_path = os.path.join(d, BUNDLE_NAME)
    old_text = open(out_path, encoding='utf-8').read() if os.path.exists(out_path) else None
    if old_text == new_text:
        return (False, len(srcs))
    with open(out_path, 'w', encoding='utf-8', newline='\n') as f:
        f.write(new_text)
    return (True, len(srcs))


def main():
    dirs = sorted(d for d in glob.glob(os.path.join(DATA_DIR, '*', '')))
    changed = 0
    total_src = 0
    for d in dirs:
        did_change, n = bundle_one_dir(d)
        if n == 0:
            continue
        total_src += n
        rel = os.path.relpath(d, ROOT).replace('\\', '/')
        status = 'UPDATED' if did_change else 'unchanged'
        print(f'{status:9} {rel}{BUNDLE_NAME}  ({n} 个源文件)')
        if did_change:
            changed += 1
    print(f'\n完成：{len(dirs)} 个分类目录，{total_src} 个源文件，{changed} 个 bundle 有更新')
    return 0


if __name__ == '__main__':
    sys.exit(main())
