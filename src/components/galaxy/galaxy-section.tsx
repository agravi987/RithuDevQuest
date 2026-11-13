"use client";

import { cn } from "@/lib/utils";

type GalaxySectionProps = {
  children: React.ReactNode;
  className?: string;
  starCount?: number;
};

/**
 * GalaxySection wraps curriculum/learning views.
 * The celestial background, nebulae, and starfield are now handled globally
 * by the root CosmicBackground to prevent duplicate nested layers or boundary seams.
 */
export function GalaxySection({
  children,
  className,
}: GalaxySectionProps) {
  return (
    <div className={cn("relative w-full", className)}>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
