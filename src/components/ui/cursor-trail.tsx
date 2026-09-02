"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  size: number;
  opacity: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
};

const COLORS = [
  "rgba(255, 215, 0, ",    // gold
  "rgba(168, 85, 247, ",   // purple
  "rgba(88, 204, 2, ",     // green
  "rgba(59, 130, 246, ",   // blue
  "rgba(255, 255, 255, ",  // white
];

export function CursorTrail({ enabled = true }: { enabled?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animRef = useRef<number>(0);
  const lastSpawnRef = useRef(0);

  useEffect(() => {
    if (!enabled) return;

    // Skip on touch devices and when reduced motion is requested
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const hasFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (prefersReducedMotion || !hasFinePointer) {
      if (canvasRef.current) canvasRef.current.style.display = "none";
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };

      // Spawn particles with throttle
      const now = Date.now();
      if (now - lastSpawnRef.current > 16) {
        lastSpawnRef.current = now;
        for (let i = 0; i < 3; i++) {
          particlesRef.current.push({
            x: e.clientX + (Math.random() - 0.5) * 10,
            y: e.clientY + (Math.random() - 0.5) * 10,
            size: Math.random() * 3.5 + 0.5,
            opacity: 1,
            vx: (Math.random() - 0.5) * 2.5,
            vy: (Math.random() - 0.5) * 2.5 - 1.5,
            life: 0,
            maxLife: 35 + Math.random() * 25,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
          });
        }
      }
      if (particlesRef.current.length > 0 && !animRef.current) {
        animRef.current = requestAnimationFrame(animate);
      }
    };

    window.addEventListener("mousemove", onMouseMove);

    const animate = () => {
      animRef.current = 0;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particlesRef.current = particlesRef.current.filter((p) => {
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.02; // slight gravity
        p.opacity = 1 - p.life / p.maxLife;
        p.size *= 0.98;

        if (p.life >= p.maxLife || p.size < 0.1) return false;

        // Draw particle (star or circle)
        if (Math.random() > 0.7 && p.size > 1.5) {
          // Star shape
          ctx.beginPath();
          for (let j = 0; j < 5; j++) {
            const angle = (j * 4 * Math.PI) / 5 - Math.PI / 2;
            const radius = p.size * 1.2;
            const x = p.x + Math.cos(angle) * radius;
            const y = p.y + Math.sin(angle) * radius;
            if (j === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.closePath();
          ctx.fillStyle = p.color + p.opacity + ")";
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color + p.opacity + ")";
          ctx.fill();
        }

        // Draw glow
        if (p.size > 1) {
          const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
          gradient.addColorStop(0, p.color + (p.opacity * 0.3) + ")");
          gradient.addColorStop(1, "transparent");
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();
        }

        return true;
      });

      if (particlesRef.current.length > 0) {
        animRef.current = requestAnimationFrame(animate);
      }
    };

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[150] pointer-events-none"
      style={{ width: "100vw", height: "100vh" }}
    />
  );
}
