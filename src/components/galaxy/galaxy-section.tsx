"use client";

import { cn } from "@/lib/utils";
import { StarsCanvas } from "@/components/ui/stars-canvas";

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
      <div className="absolute inset-0 bg-gradient-to-b from-sky-50/60 via-indigo-50/30 to-background dark:from-[#060914] dark:via-[#0a0f1f] dark:to-[oklch(0.14_0.015_260)]" />

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
