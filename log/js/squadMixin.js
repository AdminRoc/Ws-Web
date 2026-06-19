/* 队伍成员追踪模块
 * 每个解析器 create() 内调用 WF.squadMixin.create() 获取独立实例。
 * 追踪来源：
 *   AddSquadMember         → 游戏大厅中的队伍名单（squadCount=1 代表队伍重置）
 *   Player name changed to → 日志所有者自己的游戏 ID
 *   HostSquadSession       → 日志所有者是否为主机 */
window.WF = window.WF || {};

WF.squadMixin = (function () {

  /* 白名单方式清洗玩家名：只保留 Warframe 名字中合法的字符
   * 合法范围：ASCII 字母/数字/常用符号 + 拉丁扩展 + CJK/日文/韩文 */
  var _NAME_KEEP = /[^\w\-. #|À-ɏ一-鿿぀-ヿ가-힯]/g;

  function _cleanName(s) {
    return s.replace(_NAME_KEEP, '').replace(/\.$/, '').trim();
  }

  function create() {
    var localPlayer = null;
    var squad = [];   // 来自 AddSquadMember 的成员列表
    var isHost = false;

    function feed(line) {
      // 本地玩家 ID
      if (line.indexOf('Player name changed to') !== -1 && line.indexOf(' Clan:') !== -1) {
        var m = /Player name changed to (.+?) Clan:/.exec(line);
        if (m) localPlayer = _cleanName(m[1]);
        return;
      }
      // 队伍名单
      if (line.indexOf('AddSquadMember: ') !== -1) {
        var m2 = /AddSquadMember: ([^,]+),.*squadCount=(\d+)/.exec(line);
        if (m2) {
          var name = _cleanName(m2[1]);
          var count = parseInt(m2[2], 10);
          if (count === 1) {
            squad = [name]; // squadCount=1 → 新队伍，重置列表
          } else if (squad.indexOf(name) === -1) {
            squad.push(name);
          }
        }
        return;
      }
      // 主机判定
      if (line.indexOf('HostSquadSession') !== -1) {
        isHost = true;
      }
    }

    function getSquadInfo() {
      // 合并 AddSquadMember 名单与 localPlayer，localPlayer 置首
      var seen = {};
      var members = [];
      if (localPlayer) {
        members.push(localPlayer);
        seen[localPlayer] = true;
      }
      for (var i = 0; i < squad.length; i++) {
        var n = squad[i];
        if (n && !seen[n]) {
          members.push(n);
          seen[n] = true;
        }
      }
      return { members: members, localPlayer: localPlayer, isHost: isHost };
    }

    return { feed: feed, getSquadInfo: getSquadInfo };
  }

  /* 通用渲染函数 — 被所有视图调用 */
  function renderSquad(container, rec) {
    var info = rec && rec.squadInfo;
    if (!info || !info.members || info.members.length === 0) return;

    var section = document.createElement('div');
    section.className = 'squad-section';

    var title = document.createElement('div');
    title.className = 'squad-title';
    title.textContent = '队伍成员';
    section.appendChild(title);
    var note = document.createElement('div');
    note.className = 'squad-note';
    note.textContent = '队伍成员名单，可能包含中途进出过队伍的所有人员。';
    section.appendChild(note);

    var list = document.createElement('div');
    list.className = 'squad-members';

    var isMulti = info.members.length > 1;

    info.members.forEach(function (name) {
      if (!name) return;
      var isLocal = info.localPlayer && name === info.localPlayer;
      var pill = document.createElement('div');
      pill.className = 'squad-member' + (isLocal ? ' is-local' : '');

      // 多人时，本地玩家且为主机 → 显示皇冠
      if (isMulti && isLocal && info.isHost) {
        var crown = document.createElement('span');
        crown.className = 'squad-crown';
        crown.textContent = '👑';
        pill.appendChild(crown);
      }

      pill.appendChild(document.createTextNode(name));
      list.appendChild(pill);
    });

    section.appendChild(list);
    container.appendChild(section);
  }

  return { create: create, renderSquad: renderSquad };
})();