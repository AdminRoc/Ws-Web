/* ═══════════════════════════════════════════════════════════
   GSAP Analyzer v2 — 分析器页面动效
   只负责外层 UI 动画，不触碰解析逻辑/图表渲染
   背景交互：数字电路（区别于主页的星网粒子）
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  if (typeof gsap === 'undefined') { console.warn('[gsapAnalyzer] GSAP missing'); return; }

  var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) {
    console.log('[gsapAnalyzer] reduced-motion: animations disabled');
  }

  var T = '#5fd0e8', G = '#41ff8e', P = '#a86bff', K = '#ff5fd5', D = '#ffb648';
  var pick = function (a) { return a[Math.floor(Math.random() * a.length)]; };
  var vw = function () { return window.innerWidth; };
  var vh = function () { return window.innerHeight; };

  /* ═══════════════════════════════════════════════════════════
     1. 导航栏增强动效
  ═══════════════════════════════════════════════════════════ */
  function initNavAnimation() {
    var nav = document.querySelector('.site-nav');
    if (!nav) return;

    var backBtn = nav.querySelector('.ws-back-btn');
    var logo = nav.querySelector('.logo-main');
    var tabs = nav.querySelectorAll('.tab-btn');
    var links = nav.querySelectorAll('.nav-link');
    var glow = nav.querySelector('.nav-glow');

    /* 入场 */
    gsap.fromTo(nav, { y: -80, opacity: 0 }, { y: 0, opacity: 1, duration: .8, ease: 'power3.out' });
    if (backBtn) gsap.fromTo(backBtn, { x: -20, opacity: 0 }, { x: 0, opacity: 1, duration: .6, ease: 'power2.out', delay: .3 });
    if (logo) gsap.fromTo(logo, { y: -15, opacity: 0, filter: 'blur(8px)' }, { y: 0, opacity: 1, filter: 'blur(0px)', duration: .7, ease: 'power3.out', delay: .35 });
    if (tabs.length) gsap.fromTo(tabs, { y: -10, opacity: 0, scale: .9 }, { y: 0, opacity: 1, scale: 1, duration: .5, ease: 'back.out(1.4)', stagger: .06, delay: .5 });
    if (links.length) gsap.fromTo(links, { x: 15, opacity: 0 }, { x: 0, opacity: 1, duration: .5, ease: 'power2.out', stagger: .1, delay: .6 });

    /* Logo — 全 GSAP 控制：入场解密 → 呼吸脉冲 → hover 闪光 */
    if (!reducedMotion && logo && typeof ScrambleTextPlugin !== 'undefined') {
      var origText = logo.textContent;
      var glowNormal = 'drop-shadow(0 0 6px rgba(95,208,232,.45)) drop-shadow(0 0 14px rgba(95,208,232,.25)) drop-shadow(0 0 28px rgba(168,107,255,.22))';
      var glowBright = 'drop-shadow(0 0 12px rgba(95,208,232,.75)) drop-shadow(0 0 24px rgba(95,208,232,.45)) drop-shadow(0 0 44px rgba(168,107,255,.38))';

      /* 入场 ScrambleText 解密 */
      gsap.set(logo, { opacity: 0, filter: glowNormal });
      gsap.to(logo, { opacity: 1, duration: .01, delay: .35, onComplete: function () {
        gsap.to(logo, { duration: 1.4, scrambleText: { text: origText, chars: '0123456789ABCDEF#@$!%&*', revealDelay: .12, speed: .5 } });
      }});

      /* 呼吸脉冲：持续 yoyo 循环，不与 hover 冲突 */
      var breathTl = gsap.timeline({ repeat: -1, yoyo: true, delay: 2.2 });
      breathTl.to(logo, { filter: glowBright, duration: 1.6, ease: 'sine.inOut' })
        .to(logo, { filter: glowNormal, duration: 1.6, ease: 'sine.inOut' });

      /* hover：暂停呼吸 → scramble → 闪光 → 恢复呼吸 */
      logo.addEventListener('mouseenter', function () {
        breathTl.pause();
        gsap.to(logo, { duration: .45, scrambleText: { text: origText, chars: '0123456789ABCDEF#@$!', revealDelay: .03, speed: 1.2 } });
        gsap.to(logo, { scale: 1.06, duration: .2, ease: 'power2.out' });
        gsap.timeline().to(logo, { filter: glowBright, duration: .08 })
          .to(logo, { filter: glowNormal, duration: .5, ease: 'power2.out' });
      });
      logo.addEventListener('mouseleave', function () {
        gsap.to(logo, { scale: 1, duration: .35, ease: 'elastic.out(1,.5)' });
        breathTl.resume();
      });
    }

    /* Tab hover — 颜色脉冲 + 描边增强 */
    tabs.forEach(function (tab) {
      tab.addEventListener('mouseenter', function () {
        tab.style.animation = 'none';
        gsap.to(tab, { scale: 1.05, duration: .2, ease: 'power2.out' });
        /* 增强描边亮度 */
        var glow = tab.querySelector('.tab-glow');
        if (glow) gsap.to(glow, { opacity: 1, duration: .3 });
      });
      tab.addEventListener('mouseleave', function () {
        gsap.to(tab, { scale: 1, duration: .3, ease: 'elastic.out(1,.5)' });
        var glow = tab.querySelector('.tab-glow');
        if (glow) gsap.to(glow, { opacity: '', duration: .3 });
      });
    });

    /* Back button hover — SVG 箭头左移 + 颜色脉冲 */
    if (backBtn) {
      var svg = backBtn.querySelector('svg');
      backBtn.addEventListener('mouseenter', function () {
        gsap.to(backBtn, { scale: 1.04, duration: .2, ease: 'power2.out' });
        if (svg) gsap.to(svg, { x: -3, duration: .25, ease: 'power2.out' });
      });
      backBtn.addEventListener('mouseleave', function () {
        gsap.to(backBtn, { scale: 1, duration: .3, ease: 'elastic.out(1,.5)' });
        if (svg) gsap.to(svg, { x: 0, duration: .3, ease: 'power2.out' });
      });
    }

    /* Nav glow 脉冲 */
    if (glow) {
      gsap.to(glow, { opacity: .8, duration: 2, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    }
  }

  /* ═══════════════════════════════════════════════════════════
     2. Dropzone 入场动画
  ═══════════════════════════════════════════════════════════ */
  function initDropzoneAnimation() {
    var dz = document.getElementById('dropzone');
    if (!dz) return;

    var icon = dz.querySelector('.dz-icon');
    var title = dz.querySelector('.dz-title');
    var hint = dz.querySelector('.dz-hint');
    var notice = dz.querySelector('.dz-notice');
    var btnPick = dz.querySelector('.dz-btn-pick');
    var btnReset = dz.querySelector('.dz-btn-reset');

    var tl = gsap.timeline({ delay: .8 });
    tl.fromTo(dz, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: .8, ease: 'power3.out' });
    if (icon) tl.fromTo(icon, { scale: .7, opacity: 0, rotation: -15 }, { scale: 1, opacity: 1, rotation: 0, duration: .6, ease: 'back.out(1.7)' }, '-=0.5');
    if (title) tl.fromTo(title, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: .5, ease: 'power2.out' }, '-=0.3');
    if (hint) tl.fromTo(hint, { y: 8, opacity: 0 }, { y: 0, opacity: 1, duration: .4, ease: 'power2.out' }, '-=0.2');
    if (notice) tl.fromTo(notice, { y: 8, opacity: 0 }, { y: 0, opacity: 1, duration: .4, ease: 'power2.out' }, '-=0.15');
    if (btnPick) tl.fromTo(btnPick, { y: 10, opacity: 0, scale: .95 }, { y: 0, opacity: 1, scale: 1, duration: .5, ease: 'back.out(1.4)' }, '-=0.2');
  }

  /* ═══════════════════════════════════════════════════════════
     3. 面板标签入场
  ═══════════════════════════════════════════════════════════ */
  function initPanelLabels() {
    var labels = document.querySelectorAll('.panel-label');
    if (!labels.length) return;
    gsap.fromTo(labels, { x: -15, opacity: 0, filter: 'blur(4px)' }, { x: 0, opacity: 1, filter: 'blur(0px)', duration: .6, ease: 'power2.out', stagger: .15, delay: 1.2 });
  }

  /* ═══════════════════════════════════════════════════════════
     4. Footer 入场
  ═══════════════════════════════════════════════════════════ */
  function initFooterAnimation() {
    var footer = document.querySelector('.site-footer');
    if (!footer) return;
    var items = footer.querySelectorAll('.footer-brand, .footer-notice-wrap, .footer-links, .footer-beian, .footer-copy, .footer-thanks');
    gsap.fromTo(items, { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: .5, ease: 'power2.out', stagger: .08, delay: 1.5 });
  }

  /* ═══════════════════════════════════════════════════════════
     5. 按钮效果
  ═══════════════════════════════════════════════════════════ */
  function initButtonEffects() {
    var buttons = document.querySelectorAll('.dz-btn');
    buttons.forEach(function (btn) {
      btn.addEventListener('mouseenter', function () {
        gsap.to(btn, { scale: 1.03, duration: .2, ease: 'power2.out' });
        var glow = btn.querySelector('.dz-btn-glow');
        if (glow) gsap.to(glow, { opacity: 1, duration: .3 });
      });
      btn.addEventListener('mouseleave', function () {
        gsap.to(btn, { scale: 1, duration: .3, ease: 'elastic.out(1,.5)' });
        var glow = btn.querySelector('.dz-btn-glow');
        if (glow) gsap.to(glow, { opacity: .5, duration: .3 });
      });
      btn.addEventListener('mousedown', function () { gsap.to(btn, { scale: .97, duration: .1 }); });
      btn.addEventListener('mouseup', function () { gsap.to(btn, { scale: 1.03, duration: .15, ease: 'back.out(2)' }); });
    });

    var copyBtn = document.getElementById('dz-copy-path');
    if (copyBtn) {
      copyBtn.addEventListener('mouseenter', function () { gsap.to(copyBtn, { scale: 1.05, duration: .2 }); });
      copyBtn.addEventListener('mouseleave', function () { gsap.to(copyBtn, { scale: 1, duration: .25, ease: 'power2.out' }); });
    }
  }

  /* ═══════════════════════════════════════════════════════════
     6. 数字电路背景 — 鼠标交互（区别于主页星网）
     垂直+水平线条网格，鼠标附近线条亮起+脉冲
  ═══════════════════════════════════════════════════════════ */
  var mouseX = -9999, mouseY = -9999;
  function initCircuitBackground() {
    var cv = document.createElement('canvas');
    cv.style.cssText = 'position:fixed;inset:0;z-index:0;pointer-events:none;opacity:.6';
    document.body.prepend(cv);
    var ctx = cv.getContext('2d'), W, H;
    function resize() { W = cv.width = vw(); H = cv.height = vh(); }
    resize(); window.addEventListener('resize', resize);

    document.addEventListener('mousemove', function (e) { mouseX = e.clientX; mouseY = e.clientY; });

    /* 电路节点 */
    var GRID = 60;
    var cols = Math.ceil(W / GRID) + 1;
    var rows = Math.ceil(H / GRID) + 1;
    var nodes = [];
    function rebuildNodes() {
      cols = Math.ceil(vw() / GRID) + 1;
      rows = Math.ceil(vh() / GRID) + 1;
      nodes = [];
      for (var r = 0; r < rows; r++) {
        for (var c = 0; c < cols; c++) {
          nodes.push({
            x: c * GRID, y: r * GRID,
            col: c, row: r,
            brightness: 0,
            pulse: Math.random() * Math.PI * 2,
            color: pick([[95,208,232],[65,255,142],[168,107,255],[255,95,232],[255,182,72]])
          });
        }
      }
    }
    rebuildNodes();
    window.addEventListener('resize', rebuildNodes);

    function draw() {
      ctx.clearRect(0, 0, W, H);
      var REACT_R = 180;

      for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        n.pulse += .015;

        /* 鼠标距离 */
        var dx = mouseX - n.x, dy = mouseY - n.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        var target = dist < REACT_R ? (1 - dist / REACT_R) * .9 : 0;
        n.brightness += (target - n.brightness) * .08;

        if (n.brightness < .01) continue;

        var a = n.brightness * (.5 + .5 * Math.sin(n.pulse));
        var c = n.color;

        /* 节点发光 */
        ctx.globalAlpha = a * .5;
        ctx.fillStyle = 'rgb(' + c[0] + ',' + c[1] + ',' + c[2] + ')';
        ctx.beginPath(); ctx.arc(n.x, n.y, 2 + n.brightness * 3, 0, Math.PI * 2); ctx.fill();

        /* 外光晕 */
        ctx.globalAlpha = a * .12;
        var grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, 20 + n.brightness * 15);
        grad.addColorStop(0, 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + (a * .4) + ')');
        grad.addColorStop(1, 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',0)');
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.arc(n.x, n.y, 20 + n.brightness * 15, 0, Math.PI * 2); ctx.fill();

        /* 连接到相邻亮节点的线 */
        if (n.brightness > .15) {
          /* 右 neighbor */
          if (n.col < cols - 1) {
            var right = nodes[i + 1];
            if (right && right.brightness > .05) {
              var la = Math.min(n.brightness, right.brightness) * .3;
              ctx.globalAlpha = la;
              ctx.strokeStyle = 'rgb(' + c[0] + ',' + c[1] + ',' + c[2] + ')';
              ctx.lineWidth = .8;
              ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(right.x, right.y); ctx.stroke();
            }
          }
          /* 下 neighbor */
          if (n.row < rows - 1) {
            var below = nodes[i + cols];
            if (below && below.brightness > .05) {
              var la = Math.min(n.brightness, below.brightness) * .3;
              ctx.globalAlpha = la;
              ctx.strokeStyle = 'rgb(' + c[0] + ',' + c[1] + ',' + c[2] + ')';
              ctx.lineWidth = .8;
              ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(below.x, below.y); ctx.stroke();
            }
          }
        }
      }

      /* 鼠标能量环 */
      if (mouseX > 0) {
        ctx.globalAlpha = .04;
        ctx.strokeStyle = T;
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(mouseX, mouseY, REACT_R, 0, Math.PI * 2); ctx.stroke();
      }

      ctx.globalAlpha = 1;
      requestAnimationFrame(draw);
    }
    draw();
  }

  /* ═══════════════════════════════════════════════════════════
     7. 扫描线（页面级）
  ═══════════════════════════════════════════════════════════ */
  function initScanLine() {
    var l = document.createElement('div');
    l.style.cssText = 'position:fixed;top:-2px;left:0;right:0;height:1px;z-index:9998;pointer-events:none;opacity:0;background:linear-gradient(90deg,transparent 10%,' + T + ' 40%,' + G + ' 50%,' + T + ' 60%,transparent 90%);box-shadow:0 0 15px 3px rgba(95,208,232,.3)';
    document.body.appendChild(l);
    gsap.to(l, { top: '100%', opacity: .6, duration: 3.5, ease: 'none', repeat: -1, repeatDelay: 6, onRepeat: function () { gsap.set(l, { top: '-2px' }); } });
  }

  /* ═══════════════════════════════════════════════════════════
     启动
  ═══════════════════════════════════════════════════════════ */
  function init() {
    if (!reducedMotion) {
      initNavAnimation();
      initDropzoneAnimation();
      initPanelLabels();
      initFooterAnimation();
      initButtonEffects();
      initCircuitBackground();
      initScanLine();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  console.log('[gsapAnalyzer] v2 数字电路版已就绪');
})();
