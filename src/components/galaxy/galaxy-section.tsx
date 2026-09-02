"use client";

import { cn } from "@/lib/utils";
import { StarsCanvas } from "@/components/ui/stars-canvas";

type GalaxySectionProps = {
  children: React.ReactNode;
  className?: string;
  starCount?: number;
  nebulas?: { color: string; className?: string }[];
};

export function GalaxySection({
  children,
  className,
  starCount = 100,
  nebulas = [
    { color: "78 100% 60% / 6%", className: "left-1/4 top-1/4 size-96" },
    { color: "260 90% 60% / 8%", className: "right-1/4 top-1/3 size-80" },
    { color: "200 80% 60% / 5%", className: "left-1/2 top-2/3 size-64" },
  ],
}: GalaxySectionProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden",
        className,
      )}
    >
      {/* Deep space gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-50/60 via-indigo-50/30 to-background dark:from-[#060914] dark:via-[#0a0f1f] dark:to-[oklch(0.14_0.015_260)]" />

      {/* Stars */}
      {starCount > 0 && (
        <StarsCanvas
          density={starCount}
          shootingStars
          nebula
          speed={0.15}
          className="opacity-60"
        />
      )}

      {/* Nebula glows */}
      {nebulas.map((n, i) => (
        <div
          key={i}
          aria-hidden
          className={cn(
            "pointer-events-none absolute rounded-full blur-[110px]",
            n.className,
          )}
          style={{
            background: `radial-gradient(ellipse at center, oklch(${n.color}) 0%, transparent 70%)`,
          }}
        />
      ))}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
