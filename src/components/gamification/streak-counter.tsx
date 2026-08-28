"use client";

import { Flame } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

type StreakCounterProps = {
  streak: number;
  isActiveToday?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  showText?: boolean;
};

export function StreakCounter({
  streak,
  isActiveToday = false,
  size = "md",
  className,
  showText = true,
}: StreakCounterProps) {
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

  const isLit = streak > 0;

  return (
    <div
      title={
        isActiveToday
          ? `${streak} day streak! You practiced today!`
          : isLit
            ? `${streak} day streak! Complete a lesson today to keep your flame burning!`
            : "Start your learning streak today!"
      }
      className={cn(
        "inline-flex items-center font-bold tracking-tight rounded-full transition-all duration-200 shadow-sm",
        isLit
          ? isActiveToday
            ? "bg-orange-500/15 text-orange-600 dark:text-orange-400 border border-orange-500/30 hover:scale-105"
            : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 hover:scale-105"
          : "bg-muted text-muted-foreground border border-border opacity-70",
        sizeClasses[size],
        className,
      )}
    >
      <motion.div
        animate={
          isLit && isActiveToday
            ? { scale: [1, 1.15, 1], rotate: [0, -4, 4, 0] }
            : {}
        }
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      >
        <Flame
          className={cn(
            isLit
              ? isActiveToday
                ? "fill-orange-500 text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.6)]"
                : "fill-amber-500 text-amber-500"
              : "text-muted-foreground",
            iconSizes[size],
          )}
        />
      </motion.div>

      <span>{streak}</span>
      {showText && <span className="font-medium opacity-90">days</span>}
    </div>
  );
}
