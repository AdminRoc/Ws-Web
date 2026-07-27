/* ═══════════════════════════════════════════════════════════
   WTF EELOG v11 — 赛博星网版
   1. "What the Frame?" 固定大字号居中，不再缩放
   2. 粒子系统 → 赛博星网：互联线 + 几何形态 + 鼠标能量场
   3. HUD 侧边栏 + 数据条 + 描述区
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  if (typeof gsap === 'undefined') { console.warn('[gsapEelog] GSAP missing'); return; }

  var animCtx = gsap.context(function () {

  var T = '#5fd0e8', G = '#41ff8e', P = '#a86bff', K = '#ff5fd5', D = '#ffb648';
  var vw = function () { return window.innerWidth; };
  var vh = function () { return window.innerHeight; };
  var pick = function (a) { return a[Math.floor(Math.random() * a.length)]; };

  /* ═══════════════════════════════════════════════════════════
     1. 多彩极光 — 更浓更大
  ═══════════════════════════════════════════════════════════ */
  function initAuroras() {
    [
      { w: 90, t: '-25%', l: '-18%', c: [95,208,232], a: .25, d: 22 },
      { w: 85, b: '-28%', r: '-15%', c: [168,107,255], a: .22, d: 28 },
      { w: 70, t: '8%', l: '48%', c: [0,255,200], a: .18, d: 18 },
      { w: 60, t: '-12%', r: '8%', c: [255,95,232], a: .18, d: 14 },
      { w: 75, b: '-18%', l: '18%', c: [255,182,72], a: .16, d: 20 },
      { w: 55, t: '28%', r: '32%', c: [95,208,232], a: .12, d: 16 },
    ].forEach(function (cfg, i) {
      var el = document.createElement('div');
      var css = 'position:fixed;border-radius:50%;pointer-events:none;z-index:0;mix-blend-mode:screen;opacity:0;width:' + cfg.w + 'vmax;height:' + cfg.w + 'vmax;';
      if (cfg.t) css += 'top:' + cfg.t + ';'; if (cfg.b) css += 'bottom:' + cfg.b + ';';
      if (cfg.l) css += 'left:' + cfg.l + ';'; if (cfg.r) css += 'right:' + cfg.r + ';';
      var c = cfg.c;
      css += 'background:radial-gradient(closest-side,rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + cfg.a + ') 0%,rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + (cfg.a * .35) + ') 35%,rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + (cfg.a * .1) + ') 60%,transparent 80%)';
      el.style.cssText = css; document.body.appendChild(el);
      gsap.to(el, { opacity: 1, duration: 2, delay: .5 + i * .2, ease: 'power2.out' });
      gsap.to(el, { x: 'random(-20,20)%', y: 'random(-20,20)%', scale: 'random(.8,1.2)', duration: cfg.d, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    });
  }

  /* ═══════════════════════════════════════════════════════════
     2. 赛博星网 — 互联粒子 + 几何形态 + 鼠标能量场
  ═══════════════════════════════════════════════════════════ */
  var mouseX = -9999, mouseY = -9999;
  var mouseVX = 0, mouseVY = 0, lastMX = 0, lastMY = 0;

  function initConstellation() {
    var cv = document.createElement('canvas');
    cv.style.cssText = 'position:fixed;inset:0;z-index:0;pointer-events:none';
    document.body.prepend(cv);
    var ctx = cv.getContext('2d'), W, H;
    var pts = [], N = 160, LINK_DIST = 140, MOUSE_FORCE = 180;

    function resize() { W = cv.width = vw(); H = cv.height = vh(); }
    resize(); window.addEventListener('resize', resize);

    /* 粒子形状：circle=0, square=1, diamond=2, triangle=3 */
    var SHAPES = [0, 0, 0, 1, 1, 2, 3];
    var COLORS = [
      [95,208,232], [65,255,142], [168,107,255],
      [255,95,232], [255,182,72], [0,255,200]
    ];

    for (var i = 0; i < N; i++) {
      var x = Math.random() * W, y = Math.random() * H;
      var c = pick(COLORS);
      pts.push({
        x: x, y: y, homeX: x, homeY: y,
        vx: 0, vy: 0,
        r: 1 + Math.random() * 2.5,
        cr: c[0], cg: c[1], cb: c[2],
        alpha: 0, maxA: .3 + Math.random() * .5,
        shape: pick(SHAPES),
        pulse: Math.random() * Math.PI * 2,
        pSpeed: .008 + Math.random() * .025,
        trail: [],
      });
    }

    /* 渐入 */
    pts.forEach(function (p, i) {
      gsap.to(p, { alpha: p.maxA, duration: 1.5 + Math.random() * 2, delay: i * .005, ease: 'power2.out' });
    });

    document.addEventListener('mousemove', function (e) {
      mouseVX = e.clientX - lastMX; mouseVY = e.clientY - lastMY;
      lastMX = e.clientX; lastMY = e.clientY;
      mouseX = e.clientX; mouseY = e.clientY;
    });

    function drawShape(p, size) {
      ctx.beginPath();
      switch (p.shape) {
        case 0: /* circle */
          ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
          break;
        case 1: /* square */
          ctx.rect(p.x - size, p.y - size, size * 2, size * 2);
          break;
        case 2: /* diamond */
          ctx.moveTo(p.x, p.y - size * 1.3);
          ctx.lineTo(p.x + size, p.y);
          ctx.lineTo(p.x, p.y + size * 1.3);
          ctx.lineTo(p.x - size, p.y);
          ctx.closePath();
          break;
        case 3: /* triangle */
          ctx.moveTo(p.x, p.y - size * 1.2);
          ctx.lineTo(p.x + size * 1.1, p.y + size * .7);
          ctx.lineTo(p.x - size * 1.1, p.y + size * .7);
          ctx.closePath();
          break;
      }
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);

      /* 更新粒子 */
      for (var i = 0; i < N; i++) {
        var p = pts[i];
        p.pulse += p.pSpeed;

        /* 鼠标能量场 */
        var dx = mouseX - p.x, dy = mouseY - p.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_FORCE && dist > 0) {
          var force = (1 - dist / MOUSE_FORCE);
          /* 速度越大推力越强 */
          var speed = Math.sqrt(mouseVX * mouseVX + mouseVY * mouseVY);
          var pushF = force * .04 * Math.min(speed * .15, 3);
          p.vx += dx * pushF;
          p.vy += dy * pushF;
        }

        /* 回弹 */
        p.vx += (p.homeX - p.x) * .0015;
        p.vy += (p.homeY - p.y) * .0015;
        p.vx *= .94; p.vy *= .94;
        p.x += p.vx; p.y += p.vy;

        /* 尾迹 */
        if (Math.abs(p.vx) + Math.abs(p.vy) > .3) {
          p.trail.push({ x: p.x, y: p.y, a: p.alpha * .3 });
          if (p.trail.length > 6) p.trail.shift();
        } else if (p.trail.length > 0) {
          p.trail.shift();
        }

        /* 绘制尾迹 */
        for (var t = 0; t < p.trail.length; t++) {
          var tr = p.trail[t];
          tr.a *= .7;
          if (tr.a < .01) continue;
          ctx.globalAlpha = tr.a;
          ctx.fillStyle = 'rgb(' + p.cr + ',' + p.cg + ',' + p.cb + ')';
          ctx.beginPath(); ctx.arc(tr.x, tr.y, p.r * .5, 0, Math.PI * 2); ctx.fill();
        }

        /* 绘制粒子 */
        var a = p.alpha * (.4 + .6 * Math.sin(p.pulse));
        if (dist < MOUSE_FORCE) a *= (1 + (1 - dist / MOUSE_FORCE) * .6);
        ctx.globalAlpha = a;

        /* 外发光 */
        var grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 5);
        grad.addColorStop(0, 'rgba(' + p.cr + ',' + p.cg + ',' + p.cb + ',' + (a * .3) + ')');
        grad.addColorStop(1, 'rgba(' + p.cr + ',' + p.cg + ',' + p.cb + ',0)');
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 5, 0, Math.PI * 2); ctx.fill();

        /* 实体形状 */
        ctx.globalAlpha = a;
        ctx.fillStyle = 'rgb(' + p.cr + ',' + p.cg + ',' + p.cb + ')';
        drawShape(p, p.r);
        ctx.fill();
      }

      /* 绘制连线 */
      ctx.lineWidth = .6;
      for (var i = 0; i < N; i++) {
        for (var j = i + 1; j < N; j++) {
          var a = pts[i], b = pts[j];
          var dx = a.x - b.x, dy = a.y - b.y;
          var d = Math.sqrt(dx * dx + dy * dy);
          if (d < LINK_DIST) {
            var la = (1 - d / LINK_DIST) * .18;
            /* 鼠标附近连线更亮 */
            var md1 = Math.sqrt((a.x - mouseX) * (a.x - mouseX) + (a.y - mouseY) * (a.y - mouseY));
            var md2 = Math.sqrt((b.x - mouseX) * (b.x - mouseX) + (b.y - mouseY) * (b.y - mouseY));
            if (md1 < MOUSE_FORCE || md2 < MOUSE_FORCE) la *= 2.5;

            ctx.globalAlpha = la;
            /* 渐变连线 */
            var lg = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
            lg.addColorStop(0, 'rgb(' + a.cr + ',' + a.cg + ',' + a.cb + ')');
            lg.addColorStop(1, 'rgb(' + b.cr + ',' + b.cg + ',' + b.cb + ')');
            ctx.strokeStyle = lg;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }

      /* 鼠标能量环 */
      if (mouseX > 0) {
        ctx.globalAlpha = .06;
        ctx.strokeStyle = T;
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(mouseX, mouseY, MOUSE_FORCE, 0, Math.PI * 2); ctx.stroke();
        ctx.globalAlpha = .02;
        ctx.beginPath(); ctx.arc(mouseX, mouseY, MOUSE_FORCE * 1.5, 0, Math.PI * 2); ctx.stroke();
      }

      ctx.globalAlpha = 1;
      requestAnimationFrame(draw);
    }
    draw();
  }

  /* ═══ 3. 扫描线 ═══ */
  function initScanLine() {
    var l = document.createElement('div');
    l.style.cssText = 'position:fixed;top:-3px;left:0;right:0;height:2px;z-index:9998;pointer-events:none;opacity:0;background:linear-gradient(90deg,transparent 5%,' + T + ' 35%,' + G + ' 50%,' + T + ' 65%,transparent 95%);box-shadow:0 0 25px 5px rgba(95,208,232,.4),0 0 70px 15px rgba(95,208,232,.1)';
    document.body.appendChild(l);
    gsap.to(l, { top: '100%', opacity: 1, duration: 2.8, ease: 'none', repeat: -1, repeatDelay: 4, onRepeat: function () { gsap.set(l, { top: '-3px' }); } });
  }

  /* ═══ 4. 能量线 ═══ */
  function initEnergyLines() {
    var c = document.createElement('div');
    c.style.cssText = 'position:fixed;inset:0;z-index:1;pointer-events:none;overflow:hidden';
    document.body.appendChild(c);
    function spawn() {
      var l = document.createElement('div');
      var y = Math.random() * 100, w = 120 + Math.random() * 400, col = pick([T, G, P, K, D]);
      l.style.cssText = 'position:absolute;top:' + y + '%;left:-' + w + 'px;width:' + w + 'px;height:1px;background:linear-gradient(90deg,transparent,' + col + ',transparent);box-shadow:0 0 12px ' + col + ';opacity:0';
      c.appendChild(l);
      gsap.to(l, { x: vw() + w * 2, opacity: .35 + Math.random() * .35, duration: 1 + Math.random() * 1.8, ease: 'power2.inOut', onComplete: function () { l.remove(); } });
      gsap.to(l, { opacity: 0, duration: .35, delay: .6 + Math.random() * .5 });
    }
    setInterval(spawn, 350 + Math.random() * 400);
  }

  /* ═══ 5. 数字雨 ═══ */
  function initDigitalRain() {
    var c = document.createElement('div');
    c.style.cssText = 'position:fixed;inset:0;z-index:1;pointer-events:none;overflow:hidden';
    document.body.appendChild(c);
    var chars = '0123456789ABCDEF{}[]<>/\\|-=+*#@!~^';
    var cols = Math.floor(vw() / 18);
    for (var i = 0; i < cols; i++) {
      if (Math.random() > .1) continue;
      var col = document.createElement('div');
      col.style.cssText = 'position:absolute;left:' + (i * 18) + 'px;top:-200px;font-family:monospace;font-size:11px;line-height:1.2;color:' + pick([T, G, P]) + ';opacity:0;writing-mode:vertical-rl';
      var t = '', len = 6 + Math.floor(Math.random() * 22);
      for (var j = 0; j < len; j++) t += chars[Math.floor(Math.random() * chars.length)];
      col.textContent = t; c.appendChild(col);
      gsap.to(col, { y: vh() + 400, opacity: .18 + Math.random() * .22, duration: 3.5 + Math.random() * 5, ease: 'none', delay: Math.random() * 10, repeat: -1, repeatDelay: Math.random() * 5, onRepeat: function () { gsap.set(col, { y: -300, opacity: 0 }); } });
    }
  }

  /* ═══ 6. 网格 ═══ */
  function initGrid() {
    var g = document.createElement('div');
    g.style.cssText = 'position:fixed;inset:0;z-index:0;pointer-events:none;background:linear-gradient(rgba(95,208,232,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(95,208,232,.04) 1px,transparent 1px);background-size:70px 70px;mask-image:radial-gradient(ellipse 85% 65% at 50% 50%,black 15%,transparent 85%);-webkit-mask-image:radial-gradient(ellipse 85% 65% at 50% 50%,black 15%,transparent 85%)';
    document.body.appendChild(g);
    gsap.to(g, { backgroundPosition: '70px 70px', duration: 28, ease: 'none', repeat: -1 });
  }

  /* ═══ 7. 角标 — 更大更醒目 ═══ */
  function initCorners() {
    var corners = [
      { pos: 'top:14px;left:14px', border: 'border-top:2px solid ' + T + ';border-left:2px solid ' + T },
      { pos: 'top:14px;right:14px', border: 'border-top:2px solid ' + T + ';border-right:2px solid ' + T },
      { pos: 'bottom:14px;left:14px', border: 'border-bottom:2px solid ' + T + ';border-left:2px solid ' + T },
      { pos: 'bottom:14px;right:14px', border: 'border-bottom:2px solid ' + T + ';border-right:2px solid ' + T },
    ];
    corners.forEach(function (c, i) {
      var el = document.createElement('div');
      el.style.cssText = 'position:fixed;width:70px;height:70px;z-index:2;pointer-events:none;opacity:0;' + c.border + ';' + c.pos;
      document.body.appendChild(el);
      gsap.to(el, { opacity: .45, duration: .7, delay: .2 + i * .1, ease: 'power2.out' });
      gsap.to(el, { opacity: .15, duration: 2.5, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1 + i * .2 });
    });
  }

  /* ═══ 8. 鼠标交互场 — 涟漪 + 点击爆发 ═══ */
  function initMouseInteraction() {
    /* 跟随光晕 */
    var g = document.createElement('div');
    g.style.cssText = 'position:fixed;width:600px;height:600px;border-radius:50%;background:radial-gradient(circle,rgba(95,208,232,.06),transparent 70%);pointer-events:none;z-index:1;transform:translate(-50%,-50%);mix-blend-mode:screen';
    document.body.appendChild(g);
    document.addEventListener('mousemove', function (e) { gsap.to(g, { x: e.clientX, y: e.clientY, duration: .5, ease: 'power2.out' }); });

    /* 点击涟漪 */
    document.addEventListener('click', function (e) {
      for (var i = 0; i < 4; i++) {
        var r = document.createElement('div');
        var col = pick([T, G, P, K, D]);
        r.style.cssText = 'position:fixed;left:' + e.clientX + 'px;top:' + e.clientY + 'px;width:8px;height:8px;border:2px solid ' + col + ';border-radius:50%;pointer-events:none;z-index:99999;transform:translate(-50%,-50%)';
        document.body.appendChild(r);
        gsap.to(r, { width: 100 + i * 50, height: 100 + i * 50, opacity: 0, borderWidth: 1, duration: .5 + i * .12, ease: 'power2.out', delay: i * .05, onComplete: function () { r.remove(); } });
      }
    });
  }

  /* ═══ 9. 全屏闪光 ═══ */
  function initFlash() {
    var f = document.createElement('div');
    f.style.cssText = 'position:fixed;inset:0;z-index:9997;pointer-events:none;opacity:0';
    document.body.appendChild(f);
    (function burst() {
      var col = pick([T, G, P, K, D]);
      f.style.background = 'radial-gradient(circle at 50% 50%,' + col + '15,transparent 70%)';
      gsap.timeline().to(f, { opacity: 1, duration: .04 }).to(f, { opacity: 0, duration: .12 });
      setTimeout(burst, 3000 + Math.random() * 6000);
    })();
  }

  /* ═══ 10. 暗角 ═══ */
  function initVignette() {
    var v = document.createElement('div');
    v.style.cssText = 'position:fixed;inset:0;z-index:9996;pointer-events:none;background:radial-gradient(ellipse 70% 60% at 50% 50%,transparent 35%,rgba(0,0,0,.65) 100%)';
    document.body.appendChild(v);
    gsap.to(v, { opacity: .55, duration: 3.5, ease: 'sine.inOut', yoyo: true, repeat: -1 });
  }

  /* ═══════════════════════════════════════════════════════════
     11. HUD 侧边栏数据动画
  ═══════════════════════════════════════════════════════════ */
  function initHUD() {
    var hexChars = '0123456789ABCDEF';
    function rndHex(len) {
      var s = '0x';
      for (var i = 0; i < len; i++) s += hexChars[Math.floor(Math.random() * 16)];
      return s;
    }

    /* 固定文本 HUD — 不用乱码替换 */
    ['hudL1', 'hudR1'].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      gsap.fromTo(el, { opacity: 0 }, { opacity: .2, duration: 1.5, delay: 1 + Math.random() * 2, ease: 'power2.out' });
    });

    /* hudL2 / hudR2 用 ScrambleText 做数据流效果 */
    ['hudL2', 'hudR2'].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      var original = el.textContent;
      gsap.delayedCall(1.5 + Math.random() * 2, function () {
        gsap.timeline({ repeat: -1, repeatDelay: 1 })
          .to(el, { duration: .4, scrambleText: { text: original, chars: hexChars, revealDelay: .08, speed: 1.2 } })
          .to({}, { duration: 3 + Math.random() * 3 })
          .to(el, { duration: .4, scrambleText: { text: rndHex(4), chars: hexChars, revealDelay: .05, speed: 1.5 } })
          .to({}, { duration: 2 + Math.random() * 2 })
          .to(el, { duration: .3, scrambleText: { text: original, chars: hexChars, revealDelay: .08, speed: 1.2 } })
          .to({}, { duration: 3 + Math.random() * 3 });
      });
    });
  }

  /* ═══════════════════════════════════════════════════════════
     12. 加载屏（标准 Logo）
  ═══════════════════════════════════════════════════════════ */
  function initLoadingScreen() {
    var ov = document.getElementById('el-overlay');
    if (!ov) return null;
    var ring1 = ov.querySelector('.el-ring1'), ring2 = ov.querySelector('.el-ring2'), ring3 = ov.querySelector('.el-ring3');
    var logo = ov.querySelector('.el-logo');
    var title = ov.querySelector('.el-title'), sub = ov.querySelector('.el-sub');
    var bar = ov.querySelector('.el-bar span'), status = ov.querySelector('.el-status'), matrix = ov.querySelector('.el-matrix');
    [ring1, ring2, ring3].forEach(function (r, i) {
      if (!r) return;
      gsap.to(r, { rotation: '+=' + (360 * (i === 1 ? -1 : 1)), duration: [3.2, 1.9, 7][i], ease: 'none', repeat: -1 });
      gsap.to(r, { boxShadow: '0 0 ' + (40 + i * 15) + 'px rgba(95,208,232,' + (.35 + i * .12) + ')', duration: 1.5 + i * .3, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    });
    if (logo) gsap.fromTo(logo, { scale: .9 }, { scale: 1.08, filter: 'drop-shadow(0 0 35px rgba(95,208,232,1)) brightness(1.2)', duration: 1.2, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    if (title && typeof SplitText !== 'undefined') {
      var sp = new SplitText(title, { type: 'chars' });
      gsap.set(sp.chars, { opacity: 0, filter: 'blur(14px)', rotationX: -90, transformOrigin: 'top center' });
      gsap.to(sp.chars, { opacity: 1, filter: 'blur(0px)', rotationX: 0, duration: .2, ease: 'power4.out', stagger: { each: .03, from: 'random' }, delay: .3, onComplete: function () { sp.revert(); } });
    }
    if (sub) {
      var st = sub.childNodes[0];
      if (st && typeof SplitText !== 'undefined') { var ss = new SplitText(st, { type: 'chars' }); gsap.set(ss.chars, { opacity: 0, y: 15 }); gsap.to(ss.chars, { opacity: 1, y: 0, duration: .4, ease: 'power3.out', stagger: .025, delay: 1.2, onComplete: function () { ss.revert(); } }); }
      var dots = sub.querySelectorAll('.el-d');
      if (dots.length) { gsap.set(dots, { opacity: 0, scale: 0 }); gsap.to(dots, { opacity: 1, scale: 1, duration: .5, ease: 'elastic.out(1,.3)', stagger: .1, delay: 1.8 }); }
    }
    if (bar) gsap.fromTo(bar, { x: '-120%', width: '35%' }, { x: '320%', duration: 1.8, ease: 'power2.inOut', repeat: -1 });
    if (status && typeof ScrambleTextPlugin !== 'undefined') {
      var msgs = ['INITIALIZING PARSER', 'LOADING DICTIONARY', 'CALIBRATING ENGINE', 'SYNCING DATA', 'READY'];
      var stl = gsap.timeline({ repeat: -1, repeatDelay: .3 });
      msgs.forEach(function (m, i) { stl.to(status, { duration: .7, scrambleText: { text: m, chars: '0123456789ABCDEF#@$!', revealDelay: .1, speed: .8 } }, i * 1.4); stl.to({}, { duration: .9 }, i * 1.4 + .7); });
    }
    var mLines = [];
    if (matrix) {
      var cnt = Math.floor(vw() / 38);
      for (var i = 0; i < cnt; i++) { var l = document.createElement('div'); l.style.cssText = 'position:absolute;left:' + (i * 38) + 'px;top:0;width:1px;height:100%;background:linear-gradient(180deg,transparent,rgba(95,208,232,.35),rgba(0,255,200,.18),rgba(95,208,232,.35),transparent);opacity:0;transform:scaleY(0);transform-origin:top'; matrix.appendChild(l); mLines.push(l); }
      mLines.forEach(function (l) { gsap.to(l, { opacity: function () { return .12 + Math.random() * .38; }, scaleY: function () { return .2 + Math.random() * .8; }, duration: function () { return .2 + Math.random() * .5; }, ease: 'power2.out', delay: Math.random() * 1.5, repeat: -1, yoyo: true, repeatDelay: Math.random() * 2 }); });
    }
    return { overlay: ov, mLines: mLines };
  }

  function dismissOverlay(s) {
    if (!s) return Promise.resolve();
    var ov = s.overlay, mLines = s.mLines;
    var els = ['el-ring1', 'el-ring2', 'el-ring3'].map(function (x) { return ov.querySelector('.' + x); }).filter(Boolean);
    var logo = ov.querySelector('.el-logo'), title = ov.querySelector('.el-title');
    var sub = ov.querySelector('.el-sub'), bar = ov.querySelector('.el-bar'), status = ov.querySelector('.el-status');
    return new Promise(function (resolve) {
      gsap.timeline({ onComplete: function () { ov.remove(); resolve(); } })
        .to(els, { scale: 1.8, opacity: 0, rotation: '+=360', duration: .55, ease: 'power3.in', stagger: .05 })
        .to(logo, { scale: 5, opacity: 0, filter: 'blur(24px) hue-rotate(140deg) brightness(3)', duration: .4, ease: 'power3.in' }, '-=0.35')
        .to(title, { opacity: 0, filter: 'blur(30px) hue-rotate(200deg)', y: -80, scale: 1.4, duration: .3, ease: 'power2.in' }, '-=0.3')
        .to([sub, bar, status].filter(Boolean), { opacity: 0, y: -40, duration: .25, ease: 'power2.in', stagger: .04 }, '-=0.2')
        .to(mLines || [], { opacity: 0, scaleY: 0, duration: .2, ease: 'power2.in', stagger: .002 }, '-=0.2')
        .to(ov, { opacity: 0, filter: 'blur(18px) hue-rotate(100deg)', duration: .35, ease: 'power2.in' }, '-=0.15');
    });
  }

  /* ═══════════════════════════════════════════════════════════
     13. 主页动画
  ═══════════════════════════════════════════════════════════ */
  function animateMain() {
    var titleArea = document.getElementById('elTitleArea');
    var wtfLine = document.getElementById('elWtfLine');
    var wtfEl = document.getElementById('elWtf');
    var fullEl = document.getElementById('elWtfFull');
    var eelogEl = document.getElementById('elEelog');
    var sub = document.getElementById('elSub');
    var cta = document.getElementById('elCta');

    if (titleArea) gsap.fromTo(titleArea, { opacity: 0 }, { opacity: 1, duration: .01, delay: .2 });

    /* ── WTF 入场 ── */
    if (wtfEl && typeof SplitText !== 'undefined') {
      var wtfSplit = new SplitText(wtfEl, { type: 'chars' });
      gsap.set(wtfSplit.chars, { opacity: 0, filter: 'blur(20px)', rotationX: -100, y: 80, transformOrigin: 'center bottom' });
      gsap.to(wtfSplit.chars, { opacity: 1, filter: 'blur(0px)', rotationX: 0, y: 0, duration: 1.2, ease: 'power4.out', stagger: { each: .08, from: 'center' }, delay: .3,
        onComplete: function () {
          wtfSplit.revert();
          wtfEl.style.opacity = '1';
          gsap.to(wtfEl, { textShadow: '0 0 50px rgba(95,208,232,1),0 0 100px rgba(95,208,232,.6),0 0 200px rgba(95,208,232,.3)', duration: 2.5, ease: 'sine.inOut', yoyo: true, repeat: -1 });
          gsap.delayedCall(5, function () {
            var g = gsap.timeline({ repeat: -1, repeatDelay: 7 });
            g.to(wtfEl, { x: 'random(-15,15)', skewX: 'random(-10,10)', filter: 'brightness(1.8) hue-rotate(30deg)', duration: .04 })
              .to(wtfEl, { x: 0, skewX: 0, filter: 'none', duration: .08 });
          });
        }
      });
    }

    /* ── EELOG 入场 — 逐字母多彩辉光 ── */
    if (eelogEl) {
      var eeLetters = eelogEl.querySelectorAll('.ee');
      if (eeLetters.length) {
        gsap.set(eeLetters, { opacity: 0, filter: 'blur(20px)', rotationX: -100, y: 80, transformOrigin: 'center bottom' });
        gsap.to(eeLetters, { opacity: 1, filter: 'blur(0px)', rotationX: 0, y: 0, duration: 1.2, ease: 'power4.out', stagger: { each: .08, from: 'center' }, delay: .5,
          onComplete: function () {
            /* 逐字母脉动 */
            eeLetters.forEach(function (el, i) {
              gsap.to(el, {
                textShadow: getComputedStyle(el).textShadow.replace(/[\d.]+\)/, '1)'),
                scale: 1.05,
                duration: 1.8 + i * .2,
                ease: 'sine.inOut',
                yoyo: true,
                repeat: -1,
                delay: i * .15
              });
              gsap.to(el, { duration: .8, ease: 'elastic.out(1,.4)', delay: .5 + i * .08 });
            });
          }
        });
      }
    }

    /* ── 标语创意入场 ── */
    if (sub) {
      var line1 = sub.querySelector('.line1');
      var line2 = sub.querySelector('.line2');
      if (line1) gsap.fromTo(line1, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: .8, ease: 'power3.out', delay: 1 });
      if (line2) gsap.fromTo(line2, { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: .8, ease: 'power3.out', delay: 1.2 });
    }

    /* ── hover: WTF → What the Frame? ── */
    if (wtfLine && fullEl) {
      var hoverActive = false;

      wtfLine.addEventListener('mouseenter', function () {
        if (hoverActive) return;
        hoverActive = true;

        var tl = gsap.timeline();
        tl.to(wtfEl, { opacity: 0, y: -30, filter: 'blur(10px)', duration: .45, ease: 'power3.in' });
        tl.call(function () { wtfEl.style.visibility = 'hidden'; fullEl.style.opacity = '1'; });

        var fullChars = fullEl.children;
        gsap.set(fullChars, { opacity: 0, y: 15, filter: 'blur(6px)' });
        tl.set(fullEl, { opacity: 1 });
        tl.to(fullChars, { opacity: 1, y: 0, filter: 'blur(0px)', duration: .4, ease: 'power3.out', stagger: { each: .05, from: 'start' } });

        if (typeof ScrambleTextPlugin !== 'undefined') {
          tl.to(fullEl, { duration: .7, scrambleText: { text: 'What the Frame?', chars: '!@#$%^&*()_+-=[]{}|;:<>?0123456789', revealDelay: .08, speed: .7 }, ease: 'none' }, '-=0.5');
        }
        tl.to(fullEl, { textShadow: '0 0 35px rgba(95,208,232,.9),0 0 70px rgba(95,208,232,.5),0 0 140px rgba(95,208,232,.25)', duration: .8, ease: 'power2.out' }, '-=0.3');
      });

      wtfLine.addEventListener('mouseleave', function () {
        if (!hoverActive) return;
        hoverActive = false;

        var leaveTl = gsap.timeline({
          onComplete: function () {
            fullEl.style.opacity = '0';
            wtfEl.style.visibility = 'visible';
            gsap.set(wtfEl, { opacity: 1, y: 0, filter: 'none' });
            gsap.to(wtfEl, { textShadow: '0 0 50px rgba(95,208,232,1),0 0 100px rgba(95,208,232,.6),0 0 200px rgba(95,208,232,.3)', duration: 2.5, ease: 'sine.inOut', yoyo: true, repeat: -1 });
          }
        });
        var fullChars = fullEl.children;
        leaveTl.to(fullChars, { opacity: 0, y: 15, filter: 'blur(6px)', duration: .25, ease: 'power2.in', stagger: { each: .025, from: 'end' } });
        leaveTl.to(fullEl, { opacity: 0, duration: .15 }, '-=0.1');
      });
    }

    /* ── 赛博命令按钮 ── */
    if (cta) {
      var brackets = cta.querySelectorAll('.el-cta-bracket');
      var ctaText = cta.querySelector('.el-cta-text');
      var ctaCursor = cta.querySelector('.el-cta-cursor');
      var scanLine = cta.querySelector('.el-cta-scan-line');

      /* 入场 */
      gsap.fromTo(cta, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: .8, ease: 'power3.out', delay: 1.4 });

      /* 角标呼吸 */
      gsap.to(brackets, { opacity: .9, duration: 2, ease: 'sine.inOut', yoyo: true, repeat: -1, stagger: .15 });

      /* hover */
      cta.addEventListener('mouseenter', function () {
        gsap.to(brackets, { borderColor: '#41ff8e', opacity: 1, duration: .25, stagger: .03 });
        gsap.to(ctaText, { color: '#41ff8e', duration: .25 });
        gsap.to(ctaCursor, { background: '#41ff8e', duration: .25 });
        /* 扫描线穿过 */
        if (scanLine) {
          gsap.fromTo(scanLine, { top: '-100%', opacity: .7 }, { top: '200%', opacity: 0, duration: .8, ease: 'power2.inOut' });
        }
        /* ScrambleText */
        if (typeof ScrambleTextPlugin !== 'undefined') {
          gsap.to(ctaText, { duration: .6, scrambleText: { text: 'INITIATE ANALYSIS', chars: '0123456789.>:?=', revealDelay: .08, speed: .9 } });
        }
      });

      cta.addEventListener('mouseleave', function () {
        gsap.to(brackets, { borderColor: '#5fd0e8', opacity: .6, duration: .3, stagger: .03 });
        gsap.to(ctaText, { color: '#5fd0e8', duration: .3 });
        gsap.to(ctaCursor, { background: '#5fd0e8', duration: .3 });
      });

      /* 点击 — 页面转场 */
      cta.addEventListener('click', function (e) {
        e.preventDefault();
        var url = cta.getAttribute('href');
        var rect = cta.getBoundingClientRect(), cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;

        /* 创建转场遮罩 */
        var wipe = document.createElement('div');
        wipe.style.cssText = 'position:fixed;z-index:99999;pointer-events:none;border-radius:50%;background:radial-gradient(circle,#03040a 60%,rgba(95,208,232,.15) 80%,transparent 100%);left:' + cx + 'px;top:' + cy + 'px;width:0;height:0;transform:translate(-50%,-50%)';
        document.body.appendChild(wipe);

        /* 粒子爆发 */
        for (var p = 0; p < 24; p++) {
          var dot = document.createElement('div');
          var size = 1.5 + Math.random() * 4, col = pick([T, G, P, K, D]);
          dot.style.cssText = 'position:fixed;left:' + cx + 'px;top:' + cy + 'px;width:' + size + 'px;height:' + size + 'px;background:' + col + ';border-radius:50%;pointer-events:none;z-index:100000;box-shadow:0 0 ' + (size * 3) + 'px ' + col;
          document.body.appendChild(dot);
          var angle = (Math.PI * 2 * p) / 24, speed = 60 + Math.random() * 160;
          gsap.to(dot, { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed, opacity: 0, duration: .4 + Math.random() * .25, ease: 'power2.out', onComplete: function () { dot.remove(); } });
        }

        /* 主内容淡出 */
        gsap.to('#eelog-main', { opacity: 0, filter: 'blur(6px)', duration: .4, ease: 'power2.in' });
        gsap.to('#el-svg', { opacity: 0, duration: .3 });

        /* 遮罩扩展覆盖全屏 */
        var maxSize = Math.max(vw(), vh()) * 2.5;
        gsap.to(wipe, {
          width: maxSize, height: maxSize,
          duration: .7,
          ease: 'power3.inOut',
          onComplete: function () {
            window.location.href = url;
          }
        });
      });
    }
  }

  /* ═══════════════════════════════════════════════════════════
     14. SVG 能量环 — 更大更丰富
  ═══════════════════════════════════════════════════════════ */
  function initSVG() {
    var svg = document.getElementById('el-svg');
    if (!svg) return;
    svg.setAttribute('width', vw()); svg.setAttribute('height', vh());
    svg.style.width = '100%'; svg.style.height = '100%';
    var cx = vw() / 2, cy = vh() / 2, maxR = Math.min(vw(), vh()) * .45;
    [{ r: maxR, s: 'rgba(95,208,232,.15)', w: 1.2, d: '6 14', dur: 5 },
     { r: maxR * .82, s: 'rgba(168,107,255,.12)', w: 1, d: '4 10', dur: 7 },
     { r: maxR * .64, s: 'rgba(0,255,200,.1)', w: .8, d: '3 8', dur: 9 },
     { r: maxR * .48, s: 'rgba(255,95,232,.08)', w: .6, d: '2 6', dur: 11 },
     { r: maxR * .35, s: 'rgba(255,182,72,.06)', w: .5, d: '2 4', dur: 13 }
    ].forEach(function (cfg) {
      var c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      c.setAttribute('cx', cx); c.setAttribute('cy', cy); c.setAttribute('r', cfg.r);
      c.setAttribute('fill', 'none'); c.setAttribute('stroke', cfg.s);
      c.setAttribute('stroke-width', cfg.w); c.setAttribute('stroke-dasharray', cfg.d);
      svg.appendChild(c);
      gsap.to(c, { attr: { 'stroke-dashoffset': -50 }, duration: cfg.dur, ease: 'none', repeat: -1 });
      gsap.to(c, { scale: 1.03, transformOrigin: cx + 'px ' + cy + 'px', duration: cfg.dur * .5, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    });
    for (var i = 0; i < 8; i++) {
      var r = maxR * (.35 + Math.random() * .6);
      var dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      dot.setAttribute('r', 1.5 + Math.random() * 3); dot.setAttribute('fill', pick([T, G, P, K, D])); dot.setAttribute('opacity', '.5');
      svg.appendChild(dot);
      var dur = 6 + Math.random() * 5, startA = (Math.PI * 2 * i) / 8;
      gsap.to({ a: startA }, { a: startA + Math.PI * 2, duration: dur, ease: 'none', repeat: -1,
        onUpdate: function () { var a = this.targets()[0].a; dot.setAttribute('cx', cx + Math.cos(a) * r); dot.setAttribute('cy', cy + Math.sin(a) * r); }
      });
    }
  }

  /* ═══════════════════════════════════════════════════════════
     启动
  ═══════════════════════════════════════════════════════════ */
  var screen = initLoadingScreen();
  window.__dismissOverlay = function () {
    window.__gsapHandled = true;
    dismissOverlay(screen).then(function () {
      document.documentElement.classList.remove('fonts-loading');
      document.documentElement.classList.add('fonts-loaded');
      initAuroras(); initConstellation(); initScanLine(); initEnergyLines();
      initDigitalRain(); initGrid(); initCorners(); initMouseInteraction();
      initFlash(); initVignette(); initSVG(); initHUD(); animateMain();
    });
  };
  var MIN_MS = 900, t0 = Date.now();
  function boot() { setTimeout(function () { window.__dismissOverlay(); }, Math.max(0, MIN_MS - (Date.now() - t0))); }
  if (document.fonts && document.fonts.load) {
    Promise.race([document.fonts.load('1em XSZT'), new Promise(function (r) { setTimeout(r, 5000); })]).then(boot).catch(boot);
  } else { setTimeout(boot, MIN_MS); }
  console.log('[gsapEelog] v11 赛博星网版已就绪');

  }); /* animCtx */
})();
