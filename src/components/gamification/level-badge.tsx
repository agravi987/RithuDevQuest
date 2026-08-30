"use client";

import {
  Sparkles,
  Terminal,
  Box,
  Compass,
  Shield,
  Cloud,
  Zap,
  Sword,
  Crown,
  Trophy,
} from "lucide-react";
import { cn } from "@/lib/utils";

type LevelBadgeProps = {
  level: number;
  title?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  showTitle?: boolean;
};

const BADGE_ICONS: Record<number, React.ComponentType<{ className?: string }>> = {
  1: Sparkles,
  2: Terminal,
  3: Box,
  4: Compass,
  5: Shield,
  6: Cloud,
  7: Zap,
  8: Sword,
  9: Crown,
  10: Trophy,
};

export function LevelBadge({
  level,
  title,
  size = "md",
  className,
  showTitle = false,
}: LevelBadgeProps) {
  const IconComponent = BADGE_ICONS[Math.min(10, Math.max(1, level))] ?? Shield;

  const sizeClasses = {
    sm: "text-xs px-2.5 py-1 gap-1.5",
    md: "text-sm px-3 py-1.5 gap-2",
    lg: "text-base px-4 py-2 gap-2.5",
  };

  const iconSizes = {
    sm: "size-3.5",
    md: "size-4",
    lg: "size-5",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center font-bold tracking-tight rounded-full",
        "bg-level/10 text-level border border-level/20 shadow-sm",
        "transition-all duration-200 hover:scale-105 hover:bg-level/15",
        sizeClasses[size],
        className,
      )}
    >
      <IconComponent className={cn("text-level", iconSizes[size])} />
      <span>Lvl {level}</span>
      {showTitle && title && (
        <span className="text-muted-foreground font-normal">· {title}</span>
      )}
    </div>
  );
}
