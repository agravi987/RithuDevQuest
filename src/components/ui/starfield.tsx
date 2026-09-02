"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type StarfieldProps = {
  className?: string;
  starCount?: number;
  speed?: number;
  depth?: number;
};

type Star = {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  twinklePhase: number;
  twinkleSpeed: number;
};

export function Starfield({
  className,
  starCount = 120,
  speed = 0.3,
  depth = 3,
}: StarfieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(canvas.offsetWidth * dpr);
      canvas.height = Math.round(canvas.offsetHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    // Initialize stars
    starsRef.current = Array.from({ length: starCount }, () => ({
      x: Math.random() * canvas.offsetWidth,
      y: Math.random() * canvas.offsetHeight,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.8 + 0.2,
      speed: (Math.random() * 0.5 + 0.5) * speed * depth,
      twinklePhase: Math.random() * Math.PI * 2,
      twinkleSpeed: Math.random() * 0.02 + 0.01,
    }));

    const drawFrame = (timeSec: number) => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;

      ctx.clearRect(0, 0, w, h);

      for (const star of starsRef.current) {
        star.y -= star.speed * 0.5;
        star.x += Math.sin(timeSec + star.twinklePhase) * 0.1;

        if (star.y < -10) {
          star.y = h + 10;
          star.x = Math.random() * w;
        }

        const twinkle = Math.sin(
          timeSec * star.twinkleSpeed * 60 + star.twinklePhase,
        );
        const alpha = star.opacity * (0.6 + twinkle * 0.4);

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fill();

        if (star.size > 1.2) {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2);
          const gradient = ctx.createRadialGradient(
            star.x, star.y, 0,
            star.x, star.y, star.size * 3,
          );
          gradient.addColorStop(0, `rgba(200, 220, 255, ${alpha * 0.3})`);
          gradient.addColorStop(1, "transparent");
          ctx.fillStyle = gradient;
          ctx.fill();
        }
      }

      if (Math.random() < 0.002) {
        drawShootingStar(ctx, w, h);
      }
    };

    const animate = (timeSec: number) => {
      const elapsed = timeSec / 1000;
      drawFrame(elapsed);
      if (!reduceMotion && !document.hidden) {
        animRef.current = requestAnimationFrame(animate);
      }
    };

    if (reduceMotion) {
      drawFrame(0);
    } else {
      animRef.current = requestAnimationFrame(animate);
    }

    const onVisibility = () => {
      cancelAnimationFrame(animRef.current);
      if (!document.hidden && !reduceMotion) {
        animRef.current = requestAnimationFrame(animate);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [starCount, speed, depth]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("absolute inset-0 pointer-events-none", className)}
      style={{ width: "100%", height: "100%" }}
    />
  );
}

function drawShootingStar(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const x = Math.random() * w;
  const y = Math.random() * h * 0.5;
  const length = 80 + Math.random() * 60;
  const angle = Math.PI / 4 + Math.random() * 0.5;

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length);

  const gradient = ctx.createLinearGradient(
    x, y,
    x + Math.cos(angle) * length,
    y + Math.sin(angle) * length
  );
  gradient.addColorStop(0, "rgba(255, 255, 255, 0.8)");
  gradient.addColorStop(0.3, "rgba(180, 200, 255, 0.4)");
  gradient.addColorStop(1, "transparent");

  ctx.strokeStyle = gradient;
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.restore();
}
