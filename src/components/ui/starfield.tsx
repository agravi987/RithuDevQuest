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

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    // Initialize stars
    starsRef.current = Array.from({ length: starCount }, () => ({
      x: Math.random() * canvas.offsetWidth,
      y: Math.random() * canvas.offsetHeight,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.8 + 0.2,
      speed: (Math.random() * 0.5 + 0.5) * speed,
      twinklePhase: Math.random() * Math.PI * 2,
      twinkleSpeed: Math.random() * 0.02 + 0.01,
    }));

    let time = 0;

    const animate = () => {
      time += 0.016;
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;

      ctx.clearRect(0, 0, w, h);

      // Draw stars
      for (const star of starsRef.current) {
        // Move star
        star.y -= star.speed * 0.5;
        star.x += Math.sin(time + star.twinklePhase) * 0.1;

        // Wrap around
        if (star.y < -10) {
          star.y = h + 10;
          star.x = Math.random() * w;
        }

        // Twinkle
        const twinkle = Math.sin(time * star.twinkleSpeed * 60 + star.twinklePhase);
        const alpha = star.opacity * (0.6 + twinkle * 0.4);

        // Draw star
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fill();

        // Glow for bigger stars
        if (star.size > 1.2) {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2);
          const gradient = ctx.createRadialGradient(
            star.x, star.y, 0,
            star.x, star.y, star.size * 3
          );
          gradient.addColorStop(0, `rgba(200, 220, 255, ${alpha * 0.3})`);
          gradient.addColorStop(1, "transparent");
          ctx.fillStyle = gradient;
          ctx.fill();
        }
      }

      // Occasional shooting star
      if (Math.random() < 0.002) {
        drawShootingStar(ctx, w, h);
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
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
