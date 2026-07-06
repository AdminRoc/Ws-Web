/* 通用的"查看详细"折叠表格——按轮/波逐条列出每段的用时、产出计数与敌人生成数。
 * 仲裁与通用两个子模块共用同一套交互与视觉：默认折叠，点击"查看详细"展开表格。 */
window.WF = window.WF || {};

WF.roundDetail = (function () {
  const U = WF.utils;

  function fmtSec(s) {
    if (s == null || isNaN(s)) return '—';
    if (s < 60) return s.toFixed(1) + 's';
    const m = Math.floor(s / 60), r = Math.round(s % 60);
    return `${m}m${String(r).padStart(2, '0')}s`;
  }

  /**
   * renderToggle(container, rows, opts)
   * rows: [{ label, durSec, countA, countB, sparsity, essence, incomplete }]
   * opts: { countALabel, countBLabel, showEssence, showSparsity }
   */
  function renderToggle(container, rows, opts) {
    if (!rows || !rows.length) return;
    opts = opts || {};
    const wrap = U.el('div', 'rd-wrap');
    const btn = U.el('button', 'rd-toggle-btn', '▾ 查看详细');
    btn.type = 'button';
    const box = U.el('div', 'rd-table-box');
    box.style.display = 'none';

    const table = U.el('table', 'rd-table');
    const cols = ['轮次 / 波次', '用时', opts.countALabel || '数量'];
    if (opts.countBLabel) cols.push(opts.countBLabel);
    if (opts.showSparsity) cols.push('稀疏度');
    if (opts.showEssence) cols.push('期望生息');
    const thead = U.el('thead');
    const trh = U.el('tr');
    cols.forEach((c) => trh.appendChild(U.el('th', '', c)));
    thead.appendChild(trh);
    table.appendChild(thead);

    const tbody = U.el('tbody');
    rows.forEach((r) => {
      const tr = U.el('tr', r.incomplete ? 'rd-row-incomplete' : '');
      tr.appendChild(U.el('td', 'rd-td-label', r.label));
      tr.appendChild(U.el('td', 'rd-td-num', fmtSec(r.durSec)));
      tr.appendChild(U.el('td', 'rd-td-num', String(r.countA != null ? r.countA : '—')));
      if (opts.countBLabel) tr.appendChild(U.el('td', 'rd-td-num', String(r.countB != null ? r.countB : '—')));
      if (opts.showSparsity) tr.appendChild(U.el('td', 'rd-td-num', r.sparsity != null ? r.sparsity.toFixed(2) : '—'));
      if (opts.showEssence) tr.appendChild(U.el('td', 'rd-td-num', r.essence != null ? r.essence.toFixed(2) : '—'));
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    box.appendChild(table);

    btn.addEventListener('click', () => {
      const open = box.style.display !== 'none';
      box.style.display = open ? 'none' : '';
      btn.textContent = open ? '▾ 查看详细' : '▴ 收起详细';
    });

    wrap.appendChild(btn);
    wrap.appendChild(box);
    container.appendChild(wrap);
  }

  return { renderToggle };
})();
