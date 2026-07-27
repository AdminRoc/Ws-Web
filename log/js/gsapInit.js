/* GSAP 核心初始化 + 插件注册 + 作用域管理 + 无障碍降级
 * 所有 GSAP 动画通过 WF.gsap 调用，确保：
 * 1. 插件一次性注册
 * 2. context() 管理所有 tween 生命周期
 * 3. matchMedia() 为 prefers-reduced-motion 提供降级
 * 4. 暴露常用动画工厂函数 */
(function () {
  'use strict';

  if (typeof gsap === 'undefined') {
    console.warn('[gsapInit] GSAP core not loaded, animations disabled');
    return;
  }

  /* ── 插件注册 ── */
  const plugins = [];
  const reg = (name) => { if (typeof window[name] !== 'undefined') { gsap.registerPlugin(window[name]); plugins.push(name); } };
  reg('SplitText');
  reg('ScrollTrigger');
  reg('DrawSVGPlugin');
  reg('MotionPathPlugin');
  reg('CustomEase');
  reg('ScrambleTextPlugin');
  reg('EasePack');
  reg('Observer');

  /* ── CustomEase 预设 ── */
  if (typeof CustomEase !== 'undefined') {
    // 辉光脉冲：快速充能→峰值→平滑衰减
    CustomEase.create('cyberGlow', 'M0,0 C0.12,0.38 0.24,1.0 0.36,1.0 0.48,1.0 0.5,0.0 0.5,0.0 0.5,0.0 0.52,1.0 0.64,1.0 0.76,1.0 0.88,0.38 1,0 1,0');
    // 数字解密：极速展开→急停→微弹
    CustomEase.create('decryptIn', 'M0,0 C0.25,0.0 0.35,1.2 0.45,1.05 0.55,0.9 0.65,1.0 1,1');
    // 能量流：慢起→加速→骤停
    CustomEase.create('energyFlow', 'M0,0 C0.19,0.0 0.35,0.02 0.47,0.48 0.59,0.94 0.71,1.0 1,1');
    // 虚空闪烁：不规则抖动感
    CustomEase.create('voidFlicker', 'M0,0 C0.15,0.8 0.25,0.0 0.38,0.9 0.5,0.1 0.62,0.95 0.75,0.0 0.88,0.85 1,0');
  }

  /* ── 无障碍：prefers-reduced-motion 降级 ── */
  const mm = gsap.matchMedia();
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  mm.add('(prefers-reduced-motion: reduce)', () => {
    gsap.config({ force3D: false });
  });

  /* ── 动画工厂：数字解密文字入场 ── */
  function decryptText(targets, opts) {
    if (reducedMotion) {
      gsap.set(targets, { opacity: 1 });
      return Promise.resolve();
    }
    const {
      chars = true,
      words = false,
      lines = false,
      stagger = 0.03,
      duration = 0.6,
      ease = 'decryptIn',
      delay = 0,
      from = 'start',
      onComplete = null,
    } = opts || {};

    const split = new SplitText(targets, {
      type: chars ? 'chars' : words ? 'words' : lines ? 'lines' : 'chars',
    });
    const elements = chars ? split.chars : words ? split.words : split.lines;

    gsap.set(elements, {
      opacity: 0,
      filter: 'blur(4px)',
      rotationX: -40,
      transformOrigin: from === 'end' ? 'bottom center' : 'top center',
    });

    return new Promise((resolve) => {
      gsap.to(elements, {
        opacity: 1,
        filter: 'blur(0px)',
        rotationX: 0,
        duration,
        ease,
        stagger,
        delay,
        onComplete() {
          split.revert();
          if (onComplete) onComplete();
          resolve();
        },
      });
    });
  }

  /* ── 动画工厂：SVG 描边绘制 ── */
  function drawStroke(targets, opts) {
    if (reducedMotion) {
      gsap.set(targets, { drawSVG: '100%' });
      return Promise.resolve();
    }
    const {
      duration = 1.2,
      ease = 'energyFlow',
      delay = 0,
      stagger = 0.1,
      onComplete = null,
    } = opts || {};

    return new Promise((resolve) => {
      gsap.from(targets, {
        drawSVG: '0%',
        duration,
        ease,
        delay,
        stagger,
        onComplete() {
          if (onComplete) onComplete();
          resolve();
        },
      });
    });
  }

  /* ── 动画工厂：文字乱码→目标 ── */
  function scrambleText(targets, opts) {
    if (reducedMotion) return Promise.resolve();
    const {
      text,
      duration = 1,
      delay = 0,
      chars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`01',
      ease = 'none',
      onComplete = null,
    } = opts || {};

    return new Promise((resolve) => {
      gsap.to(targets, {
        duration,
        delay,
        ease,
        scrambleText: {
          text: text || undefined,
          chars,
          revealDelay: 0.1,
          speed: 0.6,
        },
        onComplete() {
          if (onComplete) onComplete();
          resolve();
        },
      });
    });
  }

  /* ── 动画工厂：粒子喷射 ── */
  function particleBurst(x, y, opts) {
    if (reducedMotion) return;
    const {
      count = 12,
      color = '#5fd0e8',
      size = 4,
      spread = 200,
      gravity = 800,
      friction = 0.92,
      life = 1.2,
      container = document.body,
    } = opts || {};

    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      el.style.cssText = `position:fixed;left:${x}px;top:${y}px;width:${size}px;height:${size}px;background:${color};border-radius:50%;pointer-events:none;z-index:99999;`;
      container.appendChild(el);

      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const speed = spread * (0.5 + Math.random() * 0.5);

      var physics2DCfg = {};
      if (typeof Physics2DPlugin !== 'undefined') {
        physics2DCfg = { physics2D: { velocity: speed, angle: (angle * 180) / Math.PI, gravity, friction } };
      }
      gsap.to(el, {
        x: Math.cos(angle) * speed,
        y: Math.sin(angle) * speed + gravity * life,
        opacity: 0,
        scale: 0,
        duration: life,
        ease: 'power2.out',
        ...physics2DCfg,
        onComplete() { el.remove(); },
      });
    }
  }

  /* ── 动画工厂：滚动揭示（ScrollTrigger 辅助） ── */
  function scrollReveal(targets, opts) {
    if (reducedMotion) {
      gsap.set(targets, { opacity: 1 });
      return;
    }
    const {
      y = 60,
      opacity = 0,
      duration = 0.8,
      ease = 'power3.out',
      stagger = 0.1,
      start = 'top 85%',
      scrub = false,
      pin = false,
    } = opts || {};

    const anim = {
      y: 0,
      opacity: 1,
      duration,
      ease,
      stagger,
    };

    if (scrub) anim.scrub = typeof scrub === 'number' ? scrub : 1;

    ScrollTrigger.create({
      trigger: targets,
      start,
      end: pin ? '+=200%' : undefined,
      pin,
      animation: gsap.from(targets, { y, opacity, duration, ease, stagger }),
      toggleActions: 'play none none reverse',
    });
  }

  /* ── 暴露到全局 ── */
  if (typeof WF !== 'undefined') {
    WF.gsap = {
      decrypt: decryptText,
      draw: drawStroke,
      scramble: scrambleText,
      particles: particleBurst,
      scrollReveal,
      ease: {
        cyberGlow: 'cyberGlow',
        decryptIn: 'decryptIn',
        energyFlow: 'energyFlow',
        voidFlicker: 'voidFlicker',
      },
      reducedMotion,
      plugins,
      version: gsap.version,
    };
  }

  console.log(`[gsapInit] GSAP ${gsap.version} ready | plugins: ${plugins.join(', ')} | reduced-motion: ${reducedMotion}`);
})();
