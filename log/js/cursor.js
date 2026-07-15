(function () {
  var PAIRS = [
    ['#41ff8e','#3affd5'], ['#45c8ff','#6f8bff'], ['#a86bff','#e05fff'],
    ['#ff5f9e','#ff7a5f'], ['#ffff60','#ffd060'], ['#ff80c0','#ff5f9e'],
  ];
  var WORDS = ['FUCK', 'FUCK', 'FUCK', 'FUCK', 'FUCK', 'FUCK', 'FUCK', 'OHHHHH', 'OHHHHH', 'OHHHHH'];
  var lastX = 0, lastY = 0, lastTime = 0;

  function spawn(cx, cy) {
    var n = 1 + Math.floor(Math.random() * 2);
    for (var i = 0; i < n; i++) {
      var el = document.createElement('span');
      var angle = Math.random() * Math.PI * 2;
      var dist = 28 + Math.random() * 68;
      var tx = Math.cos(angle) * dist;
      var ty = Math.sin(angle) * dist;
      var pair = PAIRS[Math.floor(Math.random() * PAIRS.length)];
      // 字号用 rem 而非 px：rem 基于根字号，浏览器"文字大小"缩放与整页缩放都能正确放大粒子
      var sz = (9 + Math.floor(Math.random() * 11)) / 16;
      var deg = Math.floor(Math.random() * 360);
      // 随机朝向：整个文字块的旋转角度，与渐变角度分开控制
      var rot = Math.floor(Math.random() * 360);
      var word = WORDS[Math.floor(Math.random() * WORDS.length)];
      el.textContent = word;
      var delay = i * 55;
      el.style.cssText = [
        'position:fixed',
        'left:' + cx + 'px',
        'top:' + cy + 'px',
        'pointer-events:none',
        'z-index:999999',
        'font-family:var(--f-px,monospace)',
        'font-size:' + sz + 'rem',
        'letter-spacing:2px',
        'font-weight:bold',
        'background:linear-gradient(' + deg + 'deg,' + pair[0] + ',' + pair[1] + ')',
        '-webkit-background-clip:text',
        'background-clip:text',
        'color:transparent',
        'white-space:nowrap',
        'transform:translate(-50%,-50%) rotate(' + rot + 'deg)',
        '--tx:' + tx + 'px',
        '--ty:' + ty + 'px',
        '--rot:' + rot + 'deg',
        'animation:wordFly 1.7s ease-out forwards',
        'animation-delay:' + delay + 'ms',
      ].join(';');
      document.body.appendChild(el);
      // animationend 保证动画一结束就立刻移除（不依赖 setTimeout，不受浏览器节流影响）
      el.addEventListener('animationend', function () { el.remove(); }, { once: true });
      // 备用：若 animationend 未触发（极少见），1.7s + delay + 500ms 缓冲后强制清除
      (function (node, d) {
        setTimeout(function () { if (node.parentNode) node.remove(); }, 2200 + d);
      })(el, delay);
    }
  }

  document.addEventListener('mousemove', function (e) {
    var dx = e.clientX - lastX;
    var dy = e.clientY - lastY;
    var dist = Math.sqrt(dx * dx + dy * dy);
    var now = Date.now();
    if (dist >= 8 && now - lastTime >= 120) {
      spawn(e.clientX, e.clientY);
      lastTime = now;
    }
    lastX = e.clientX;
    lastY = e.clientY;
  });
})();
