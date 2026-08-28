"use client";

import { Zap } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

type XPDisplayProps = {
  xp: number;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  animateOnChange?: boolean;
};

export function XPDisplay({
  xp,
  showIcon = true,
  size = "md",
  className,
}: XPDisplayProps) {
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
        "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shadow-sm",
        "transition-all duration-200 hover:scale-105 hover:bg-amber-500/15 hover:border-amber-500/30",
        sizeClasses[size],
        className,
      )}
    >
      {showIcon && (
        <Zap
          className={cn(
            "fill-amber-500 text-amber-500 animate-pulse",
            iconSizes[size],
          )}
        />
      )}
      <AnimatePresence mode="wait">
        <motion.span
          key={xp}
          initial={{ y: -6, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 6, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {xp.toLocaleString()} XP
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
