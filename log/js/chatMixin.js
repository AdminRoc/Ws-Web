/* IRC 对话收集模块
 * 每个解析器 create() 内调用 WF.chatMixin.create() 获取独立实例。
 * EE.log 仅记录本账号发出的 IRC 消息（IRC out: PRIVMSG），
 * 其他玩家的消息不出现在日志中。 */
window.WF = window.WF || {};

WF.chatMixin = (function () {

  // 频道前缀 → 中文 tag
  var CHANNEL_TAG = [
    [/^#S/, '小队'],
    [/^#C/, '氏族'],
    [/^#A/, '联盟'],
    [/^#J/, '道场'],
    [/^#R_/, '区域'],
    [/^#Q_/, '区域'],
    [/^#G_/, '全体'],
    [/^#T_/, '交易'],
    [/^#H_/, '枢纽'],
  ];

  var TAG_CLS = {
    '小队': 'squad', '氏族': 'clan', '联盟': 'alliance', '道场': 'dojo',
    '区域': 'region', '全体': 'global', '交易': 'trade', '枢纽': 'hub',
    '私聊': 'whisper',
  };

  function _tag(target) {
    if (!target.startsWith('#')) return { tag: '私聊', to: target };
    for (var i = 0; i < CHANNEL_TAG.length; i++) {
      if (CHANNEL_TAG[i][0].test(target)) return { tag: CHANNEL_TAG[i][1] };
    }
    return { tag: '频道' };
  }

  function create() {
    var all = [];  // [{t, target, tag, to, msg}]

    function feed(t, line) {
      if (line.indexOf('IRC out: PRIVMSG ') === -1) return;
      var rx = /IRC out: PRIVMSG (\S+) :(.*)$/.exec(line);
      if (!rx) return;
      var ch = _tag(rx[1]);
      all.push({ t: t, target: rx[1], tag: ch.tag, to: ch.to || null, msg: rx[2] });
    }

    function getChatLog(loadT, startT, endT) {
      var from = loadT != null ? loadT : startT;
      return all.filter(function (c) { return c.t >= from && c.t <= endT; });
    }

    return { feed: feed, getChatLog: getChatLog };
  }

  /* 通用渲染函数 — 被所有视图调用 */
  function renderChatLog(container, rec) {
    var log = rec && rec.chatLog;
    if (!log || log.length === 0) return;

    var sep = document.createElement('div');
    sep.className = 'section-sep';
    container.appendChild(sep);

    var section = document.createElement('div');
    section.className = 'gen-section';

    var title = document.createElement('div');
    title.className = 'gen-section-title';
    title.textContent = '对话记录（共 ' + log.length + ' 条）';
    section.appendChild(title);

    var list = document.createElement('div');
    list.className = 'chat-log-list';

    log.forEach(function (c) {
      var row = document.createElement('div');
      row.className = 'chat-log-row';

      var tagEl = document.createElement('span');
      tagEl.className = 'chat-log-tag chat-tag-' + (TAG_CLS[c.tag] || 'other');
      tagEl.textContent = c.tag;
      row.appendChild(tagEl);

      if (c.to) {
        var toEl = document.createElement('span');
        toEl.className = 'chat-log-to';
        toEl.textContent = '→ ' + c.to;
        row.appendChild(toEl);
      }

      var msgEl = document.createElement('span');
      msgEl.className = 'chat-log-msg';
      msgEl.textContent = c.msg;
      row.appendChild(msgEl);

      list.appendChild(row);
    });

    section.appendChild(list);

    var note = document.createElement('div');
    note.className = 'note';
    note.textContent = 'EE.log 仅记录本账号发出的消息，队友发言不出现在日志中。';
    section.appendChild(note);

    container.appendChild(section);
  }

  return { create: create, renderChatLog: renderChatLog };
})();
