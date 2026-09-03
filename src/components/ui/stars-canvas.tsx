"use client";

import { useRef, useEffect, useState } from "react";

type Star = {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  twinkleSpeed: number;
  twinkleOffset: number;
};

type ShootingStar = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  length: number;
};

type StarsCanvasProps = {
  className?: string;
  density?: number;
  shootingStars?: boolean;
  speed?: number;
  nebula?: boolean;
  enabled?: boolean;
};

export function StarsCanvas({
  className,
  density = 80,
  shootingStars = true,
  speed = 0.3,
  nebula = false,
  enabled = true,
}: StarsCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const shootingRef = useRef<ShootingStar[]>([]);
  const frameRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const maxDpr = 1.5;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    const initStars = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      starsRef.current = Array.from({ length: density }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        size: Math.random() * 2 + 0.3,
        speed: (Math.random() * 0.5 + 0.1) * speed,
        opacity: Math.random() * 0.8 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinkleOffset: Math.random() * Math.PI * 2,
      }));
    };
    initStars();

    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      };
    };
    window.addEventListener("mousemove", handleMouse);

    let lastShot = Date.now();
    let time = 0;
    const isPaused = !enabled || prefersReducedMotion || !isVisible;

    const animate = () => {
      if (isPaused) {
        frameRef.current = requestAnimationFrame(animate);
        return;
      }

      time++;
      const cw = canvas.clientWidth;
      const ch = canvas.clientHeight;
      ctx.clearRect(0, 0, cw, ch);

      if (nebula) {
        const mx = (mouseRef.current.x - 0.5) * 20;
        const my = (mouseRef.current.y - 0.5) * 20;

        const nebulae = [
          { x: cw * 0.2 + mx, y: ch * 0.3 + my, r: 200, color: "120, 80%, 50%" },
          { x: cw * 0.8 + mx * 0.5, y: ch * 0.6 + my * 0.5, r: 180, color: "280, 60%, 50%" },
          { x: cw * 0.5 + mx * 0.3, y: ch * 0.15 + my * 0.3, r: 150, color: "210, 70%, 60%" },
        ];

        for (const n of nebulae) {
          const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r);
          grad.addColorStop(0, `hsla(${n.color}, 0.06)`);
          grad.addColorStop(1, "transparent");
          ctx.fillStyle = grad;
          ctx.fillRect(n.x - n.r, n.y - n.r, n.r * 2, n.r * 2);
        }
      }

      for (const star of starsRef.current) {
        const twinkle =
          Math.sin(time * star.twinkleSpeed + star.twinkleOffset) * 0.3 + 0.7;
        const alpha = star.opacity * twinkle;

        const px = (mouseRef.current.x - 0.5) * star.size * 8;
        const py = (mouseRef.current.y - 0.5) * star.size * 8;

        ctx.beginPath();
        ctx.arc(star.x + px, star.y + py, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fill();

        if (star.size > 1.2) {
          ctx.beginPath();
          ctx.arc(star.x + px, star.y + py, star.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(200, 220, 255, ${alpha * 0.1})`;
          ctx.fill();
        }

        star.y += star.speed;
        if (star.y > ch + 5) {
          star.y = -5;
          star.x = Math.random() * cw;
        }
      }

      if (shootingStars) {
        const now = Date.now();
        if (now - lastShot > 3000 + Math.random() * 5000) {
          lastShot = now;
          shootingRef.current.push({
            x: Math.random() * cw * 0.8,
            y: Math.random() * ch * 0.4,
            vx: 3 + Math.random() * 4,
            vy: 1.5 + Math.random() * 2,
            life: 0,
            maxLife: 40 + Math.random() * 30,
            length: 60 + Math.random() * 80,
          });
        }

        shootingRef.current = shootingRef.current.filter((s) => {
          s.life++;
          s.x += s.vx;
          s.y += s.vy;
          const progress = s.life / s.maxLife;
          const alpha = progress < 0.2 ? progress * 5 : 1 - (progress - 0.2) / 0.8;

          if (alpha <= 0) return false;

          const tailX = s.x - (s.vx / Math.sqrt(s.vx ** 2 + s.vy ** 2)) * s.length;
          const tailY = s.y - (s.vy / Math.sqrt(s.vx ** 2 + s.vy ** 2)) * s.length;

          const grad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
          grad.addColorStop(0, `rgba(255, 255, 255, 0)`);
          grad.addColorStop(0.7, `rgba(200, 220, 255, ${alpha * 0.5})`);
          grad.addColorStop(1, `rgba(255, 255, 255, ${alpha})`);

          ctx.beginPath();
          ctx.moveTo(tailX, tailY);
          ctx.lineTo(s.x, s.y);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.5;
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(s.x, s.y, 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.fill();

          return s.life < s.maxLife;
        });
      }

      frameRef.current = requestAnimationFrame(animate);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { rootMargin: "100px" }
    );
    observer.observe(canvas);
    observerRef.current = observer;

    if (!isPaused) {
      frameRef.current = requestAnimationFrame(animate);
    }

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouse);
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [density, shootingStars, speed, nebula, enabled, prefersReducedMotion, isVisible]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 w-full h-full ${className ?? ""}`}
      aria-hidden="true"
    />
  );
}