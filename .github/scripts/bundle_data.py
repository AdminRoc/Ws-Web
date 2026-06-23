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
  - 打包前检测同目录内变量名冲突（同名变量后者会静默覆盖前者），一旦发现直接
    抛异常让 Action 失败，绝不生成一个内容悄悄错误的 bundle。

⚠️ 输出文件名 _bundle.js 故意不能再改成别的下划线开头命名——GitHub Pages 默认跑
Jekyll 构建，会把任何下划线开头的文件/目录从部署产物里剔除，曾导致全站榜单数据
404（表现为页面空白）。仓库根目录的 .nojekyll 文件就是为了关掉这个行为，必须
始终保留，不要删除。

用法：
  python3 .github/scripts/bundle_data.py            # 重建全部 bundle
  自动化：见 .github/workflows/bundle-data.yml（push 到 data/** 时触发）
"""
import glob
import os
import re
import sys
from collections import defaultdict

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DATA_DIR = os.path.join(ROOT, 'data')
BUNDLE_NAME = '_bundle.js'

_VAR_RE = re.compile(r'var\s+([a-zA-Z_$][\w$]*)\s*=')


def check_var_collisions(srcs):
    """同一目录内若有两个文件声明了同名全局变量，拼接后后者会静默覆盖前者，
    导致某个节点的成绩"消失"且没有任何报错——这种 bug 极难发现，必须在打包前
    就拦截。新增榜单/新增节点数据文件时，最容易踩这个坑（比如复制旧文件改数据
    但忘了改变量名）。发现冲突直接抛异常，让 Action 失败，而不是生成一个悄悄
    错误的 bundle。"""
    seen = defaultdict(list)
    for src in srcs:
        content = open(src, encoding='utf-8').read()
        for m in _VAR_RE.finditer(content):
            seen[m.group(1)].append(os.path.basename(src))
    conflicts = {v: files for v, files in seen.items() if len(files) > 1}
    return conflicts


def bundle_one_dir(d):
    """拼接单个分类目录，返回 (是否有变化, 源文件数)。"""
    srcs = sorted(
        f for f in glob.glob(os.path.join(d, '*.js'))
        if not os.path.basename(f).startswith('_')
    )
    if not srcs:
        return (False, 0)

    conflicts = check_var_collisions(srcs)
    if conflicts:
        lines = [f'  变量 "{v}" 同时在这些文件里声明: {", ".join(files)}' for v, files in conflicts.items()]
        raise SystemExit(
            f'变量名冲突，拒绝打包 {os.path.relpath(d, ROOT)}！\n' + '\n'.join(lines) +
            '\n请给其中一个文件改用不同的变量名（通常是复制旧文件新增节点时忘了改名）。'
        )

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
