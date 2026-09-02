"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
};

type ParticleBackgroundProps = {
  count?: number;
  colors?: string[];
  className?: string;
};

export function ParticleBackground({
  count = 50,
  colors = [
    "oklch(0.72 0.19 142 / 0.4)",  // green
    "oklch(0.82 0.17 85 / 0.3)",   // gold
    "oklch(0.78 0.15 300 / 0.3)",  // purple
    "oklch(0.65 0.20 260 / 0.3)",  // blue
  ],
  className = "",
}: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let particles: Particle[] = [];
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    function resize() {
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(canvas.offsetWidth * dpr);
      canvas.height = Math.round(canvas.offsetHeight * dpr);
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function createParticles() {
      if (!canvas) return [];
      return Array.from({ length: count }, () => ({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.5 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
      }));
    }

    function drawParticle(p: Particle) {
      if (!ctx) return;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.opacity;
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    function drawConnections(items: Particle[]) {
      if (!ctx) return;
      for (let i = 0; i < items.length; i++) {
        for (let j = i + 1; j < items.length; j++) {
          const dx = items[i].x - items[j].x;
          const dy = items[i].y - items[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(items[i].x, items[i].y);
            ctx.lineTo(items[j].x, items[j].y);
            ctx.strokeStyle = `oklch(0.72 0.19 142 / ${0.08 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    }

    function drawFrame() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.offsetWidth) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.offsetHeight) p.vy *= -1;

        drawParticle(p);
      }

      drawConnections(particles);
    }

    function animate() {
      drawFrame();
      animationId = requestAnimationFrame(animate);
    }

    function onResize() {
      resize();
      particles = createParticles();
      drawFrame();
    }

    function onVisibility() {
      if (reduceMotion) return;
      cancelAnimationFrame(animationId);
      if (!document.hidden) {
        drawFrame();
        animate();
      }
    }

    resize();
    particles = createParticles();

    if (reduceMotion) {
      drawFrame();
    } else {
      animate();
    }

    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [count, colors]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ width: "100%", height: "100%" }}
    />
  );
}
