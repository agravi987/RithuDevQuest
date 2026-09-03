"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

type LessonHeaderProps = {
  title: string;
  completedSteps: number;
  totalSteps: number;
  xpEarned: number;
  stepType?: string;
  estimatedMinutes?: number;
  onBack?: () => void;
};

export function LessonHeader({
  title,
  completedSteps,
  totalSteps,
  xpEarned,
  stepType,
  estimatedMinutes,
}: LessonHeaderProps) {
  const progress =
    totalSteps === 0 ? 100 : Math.round((completedSteps / totalSteps) * 100);

  return (
    <div className="space-y-3 rounded-2xl border border-border/50 bg-card/50 p-4 shadow-sm">
      {/* Top row: title + XP */}
      <div className="flex items-center justify-between gap-3">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 min-w-0"
        >
          <h1 className="min-w-0 truncate text-base sm:text-lg font-bold tracking-tight">
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

      {/* Bottom row: step count + type + time */}
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5">
        <div className="flex items-center gap-2">
          <p className="text-xs font-semibold text-muted-foreground">
            Step {Math.min(completedSteps + 1, totalSteps)} of {totalSteps}
          </p>
          {stepType && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
              {stepType}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {estimatedMinutes && (
            <span className="text-[10px] text-muted-foreground">
              ~{Math.max(1, Math.ceil(estimatedMinutes * (1 - progress / 100)))} min left
            </span>
          )}
          <p className="text-xs font-semibold text-muted-foreground">
            {progress}% complete
          </p>
        </div>
      </div>
    </div>
  );
}
