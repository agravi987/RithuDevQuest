"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface CosmicBackgroundProps {
  className?: string;
  variant?: "orbit" | "dashboard" | "arena" | "minimal";
  streakActive?: boolean;
  lowHearts?: boolean;
  children?: React.ReactNode;
}

/**
 * Microscopic noise texture generated via inline SVG data URI.
 * Zero external asset dependencies, zero layout shifts, zero render blocking.
 */
const NOISE_SVG = `data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.04'/%3E%3C/svg%3E`;

export function CosmicBackground({
  className,
  variant = "orbit",
  streakActive = false,
  lowHearts = false,
  children,
}: CosmicBackgroundProps) {
  const isMinimal = variant === "minimal";
  const isArena = variant === "arena";

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none fixed inset-0 -z-10 overflow-hidden select-none bg-[#04060f]",
        className
      )}
    >
      {/* ── Layer 0: Film-Grain / Noise Overlay ── */}
      <div
        className={cn(
          "absolute inset-0 mix-blend-overlay",
          isMinimal ? "opacity-20" : "opacity-35"
        )}
        style={{
          backgroundImage: `url("${NOISE_SVG}")`,
          backgroundRepeat: "repeat",
        }}
      />

      {/* ── Layer 1: Celestial Starfield (Crisp distant stars) ── */}
      <div
        className="absolute inset-0 opacity-40 sm:opacity-50"
        style={{
          backgroundImage: `
            radial-gradient(1px 1px at 25px 35px, rgba(255, 255, 255, 0.9), transparent),
            radial-gradient(1.5px 1.5px at 120px 80px, rgba(147, 197, 253, 0.85), transparent),
            radial-gradient(1px 1px at 220px 180px, rgba(255, 255, 255, 0.7), transparent),
            radial-gradient(2px 2px at 340px 140px, rgba(167, 139, 250, 0.8), transparent),
            radial-gradient(1px 1px at 450px 290px, rgba(255, 255, 255, 0.65), transparent),
            radial-gradient(1.5px 1.5px at 580px 120px, rgba(56, 189, 248, 0.75), transparent),
            radial-gradient(1px 1px at 700px 380px, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(2px 2px at 850px 220px, rgba(110, 231, 183, 0.7), transparent),
            radial-gradient(1px 1px at 980px 320px, rgba(255, 255, 255, 0.75), transparent)
          `,
          backgroundSize: "800px 600px",
        }}
      />

      {/* ── Layer 2: Luminous Ambient Cosmic Aurora Nebulas ── */}
      {/* Top-Left Electric Cyan & Sky Blue Hub */}
      <div
        className={cn(
          "absolute -top-[12%] -left-[8%] size-[600px] sm:size-[850px] rounded-full blur-[130px]",
          isMinimal ? "opacity-20" : "opacity-35 sm:opacity-45",
          "bg-[radial-gradient(circle,rgba(6,182,212,0.55)_0%,rgba(14,165,233,0.2)_45%,transparent_70%)]"
        )}
      />

      {/* Bottom-Right Deep Cosmic Violet / Indigo Hub */}
      <div
        className={cn(
          "absolute -bottom-[15%] -right-[12%] size-[650px] sm:size-[900px] rounded-full blur-[140px]",
          isMinimal ? "opacity-20" : "opacity-35 sm:opacity-45",
          "bg-[radial-gradient(circle,rgba(124,58,237,0.5)_0%,rgba(147,51,234,0.18)_50%,transparent_70%)]"
        )}
      />

      {/* Center Emerald Core Glow */}
      {!isMinimal && (
        <div
          className={cn(
            "absolute top-[30%] left-[25%] size-[500px] sm:size-[700px] rounded-full blur-[150px]",
            isArena ? "opacity-20" : "opacity-25 sm:opacity-30",
            "bg-[radial-gradient(circle,rgba(16,185,129,0.4)_0%,rgba(5,150,105,0.12)_50%,transparent_70%)]"
          )}
        />
      )}

      {/* ── Layer 3: Reactive Gamification Aura ── */}
      {/* Streak Fire Glow: Activates warm flame embers when combo/streak is active */}
      <div
        className={cn(
          "absolute -bottom-[10%] left-[15%] right-[15%] h-[350px] rounded-full blur-[120px] transition-opacity duration-1000",
          streakActive
            ? "opacity-60 bg-[radial-gradient(ellipse,rgba(245,158,11,0.6)_0%,rgba(239,68,68,0.3)_40%,transparent_75%)]"
            : "opacity-0"
        )}
      />

      {/* Low Hearts Pulse: Emergency shield perimeter glow when down to 1 heart */}
      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-500",
          lowHearts
            ? "opacity-45 bg-[radial-gradient(circle_at_top,rgba(239,68,68,0.45)_0%,transparent_60%)] animate-pulse"
            : "opacity-0"
        )}
      />

      {/* ── Layer 4: Vignetted Cyber-Coordinate Mesh ── */}
      {/* Faint coordinate grid lines masked with a radial falloff to keep content clear */}
      <div
        className="absolute inset-0 opacity-15 sm:opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.06) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.06) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          maskImage:
            "radial-gradient(ellipse at 50% 50%, transparent 25%, rgba(0, 0, 0, 0.5) 65%, black 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at 50% 50%, transparent 25%, rgba(0, 0, 0, 0.5) 65%, black 100%)",
        }}
      />

      {/* ── Layer 5: Deep Vignette Shadow Rim ── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, transparent 45%, rgba(4, 6, 15, 0.8) 100%)",
        }}
      />

      {children}
    </div>
  );
}
