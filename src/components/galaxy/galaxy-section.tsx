"use client";

import { cn } from "@/lib/utils";
import { StarsCanvas } from "@/components/ui/stars-canvas";
import { GALAXY_BG } from "@/lib/theme";

type GalaxySectionProps = {
  children: React.ReactNode;
  className?: string;
  starCount?: number;
};

export function GalaxySection({
  children,
  className,
  starCount = 60,
}: GalaxySectionProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden",
        className,
      )}
    >
      {/* Deep space gradient */}
      <div className={cn("absolute inset-0 bg-gradient-to-b", GALAXY_BG)} />

      {/* Stars */}
      {starCount > 0 && (
        <StarsCanvas
          density={starCount}
          speed={0.15}
          className="opacity-60"
        />
      )}

      <div className="relative z-10">{children}</div>
    </div>
  );
}
