"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

type LessonHeaderProps = {
  title: string;
  completedSteps: number;
  totalSteps: number;
  xpEarned: number;
  onBack?: () => void;
};

export function LessonHeader({
  title,
  completedSteps,
  totalSteps,
  xpEarned,
}: LessonHeaderProps) {
  const progress =
    totalSteps === 0 ? 100 : Math.round((completedSteps / totalSteps) * 100);

  return (
    <div className="space-y-3">
      {/* Top row: title + XP */}
      <div className="flex items-center justify-between gap-3">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 min-w-0"
        >
          <h1 className="min-w-0 truncate text-lg font-bold tracking-tight">
            {title}
          </h1>
        </motion.div>
        {xpEarned > 0 && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-xp/10 border border-xp/20 px-3 py-1 text-sm font-bold text-xp shadow-sm shadow-xp/10"
          >
            <Star className="size-3.5 fill-xp/30 animate-float-sparkle" />
            +{xpEarned} XP
          </motion.div>
        )}
      </div>

      {/* Step dots with animation */}
      <div className="flex items-center gap-1.5">
        {Array.from({ length: totalSteps }).map((_, i) => {
          const isCompleted = i < completedSteps;
          const isCurrent = i === completedSteps;

          return (
            <motion.div
              key={i}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className={cn(
                "h-2 flex-1 rounded-full transition-all duration-500 origin-left",
                isCompleted
                  ? "bg-gradient-to-r from-primary to-emerald-400 shadow-sm shadow-primary/20"
                  : isCurrent
                    ? "bg-primary/30 ring-2 ring-primary/20 animate-pulse-border"
                    : "bg-muted"
              )}
            />
          );
        })}
      </div>

      {/* Bottom row: step count */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-muted-foreground">
          Step {Math.min(completedSteps + 1, totalSteps)} of {totalSteps}
        </p>
        <p className="text-xs font-semibold text-muted-foreground">
          {progress}% complete
        </p>
      </div>
    </div>
  );
}
