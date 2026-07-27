/* ════════════════════════════════════════════════════════════
   gsapMouseEffects.js — 暗金能量场鼠标交互
   依赖：gsap.min.js（必须先加载）
   作用：GSAP quickTo 平滑鼠标坐标 → 驱动 StarField 能量场
   ════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  if (typeof gsap === 'undefined') {
    console.warn('[gsapMouseEffects] GSAP not loaded, mouse effects disabled');
    return;
  }

  /* ── 无障碍：prefers-reduced-motion ── */
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── GSAP 作用域管理 ── */
  const ctx = gsap.context(() => {

    if (isReducedMotion) {
      /* 降级：禁用能量场，鼠标坐标直接赋值（无动画） */
      const raw = { x: -9999, y: -9999 };
      document.addEventListener('mousemove', (e) => {
        raw.x = e.clientX; raw.y = e.clientY;
        window._gsapMouse = raw;
      });
      return;
    }

    /* ── GSAP quickTo：平滑插值鼠标坐标 ── */
    const mouse = { x: -9999, y: -9999 };
    window._gsapMouse = mouse;

    const xTo = gsap.quickTo(mouse, 'x', {
      duration: 0.15,
      ease: 'power2.out',
      overwrite: 'auto',
    });
    const yTo = gsap.quickTo(mouse, 'y', {
      duration: 0.15,
      ease: 'power2.out',
      overwrite: 'auto',
    });

    document.addEventListener('mousemove', (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
    });
    document.addEventListener('pointermove', (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
    });

    /* ── 能量场激活：鼠标进入视口时启用 ── */
    const canvas = document.getElementById('star-canvas');
    if (canvas && canvas._starField) {
      canvas._starField._energyEnabled = true;
    }

    document.addEventListener('mouseenter', () => {
      if (canvas && canvas._starField) canvas._starField._energyEnabled = true;
    });
    document.addEventListener('mouseleave', () => {
      if (canvas && canvas._starField) {
        canvas._starField._energyEnabled = false;
        canvas._starField._mx = -9999;
        canvas._starField._my = -9999;
      }
    });

  }); /* end gsap.context */

  /* ── 清理：页面卸载时 ── */
  window.addEventListener('beforeunload', () => ctx.revert());
})();
