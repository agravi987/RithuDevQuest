"use client";

import { cn } from "@/lib/utils";
import { Starfield } from "@/components/ui/starfield";

type GalaxySectionProps = {
  children: React.ReactNode;
  className?: string;
  /** Density of ambient stars (0 disables the canvas entirely for perf). */
  starCount?: number;
  /** Extra radial nebula glows. Hex-ish tokens are passed as background colors. */
  nebulas?: { color: string; className?: string }[];
};

/**
 * Shared "enter the galaxy" section shell: a deep-space gradient,
 * optional starfield, and subtle nebula glows. Reuses the existing
 * Starfield rather than adding a second particle system.
 */
export function GalaxySection({
  children,
  className,
  starCount = 60,
  nebulas = [
    { color: "78 100% 60% / 6%", className: "left-1/4 top-1/4 size-96" },
    { color: "260 90% 60% / 7%", className: "right-1/4 top-1/2 size-72" },
  ],
}: GalaxySectionProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-gradient-to-b from-sky-50/40 via-indigo-50/20 to-background dark:from-[#060914] dark:via-[#0a0f1f] dark:to-[oklch(0.14_0.015_260)]",
        className,
      )}
    >
      {starCount > 0 && (
        <Starfield starCount={starCount} speed={0.15} className="opacity-50" />
      )}
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
