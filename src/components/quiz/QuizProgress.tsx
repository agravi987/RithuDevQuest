"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { type QuizProgressState, type QuizNavigationConfig } from "./types";

/* ════════════════════════════════════════════════════════════════════
   QUIZ PROGRESS - Progress dots, bar, and counter
   ═══════════════════════════════════════════════════════════════════ */

export type { QuizProgressState, QuizNavigationConfig } from "./types";

interface QuizProgressProps {
  progress: QuizProgressState;
  config: QuizNavigationConfig;
  currentQuestion?: {
    type: string;
    difficulty: string;
  };
  className?: string;
  onQuestionClick?: (index: number) => void;
}

export function QuizProgress({
  progress,
  config,
  currentQuestion,
  className,
  onQuestionClick,
}: QuizProgressProps) {
  const { current, total, percentage, correct, incorrect, unanswered } = progress;

  if (!config.showProgress) return null;

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {/* Progress Bar */}
      {config.showProgressBar && (
        <div className="w-full">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Progress
            </span>
            <span className="text-[10px] font-bold tabular-nums text-muted-foreground">
              {current + 1} / {total}
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-primary via-emerald-400 to-cyan-400"
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>
      )}

      {/* Progress Dots */}
      {config.showProgressDots && (
        <div className="flex flex-wrap items-center justify-center gap-1.5" role="group" aria-label="Question progress">
          {Array.from({ length: total }, (_, i) => (
            <motion.button
              key={i}
              type="button"
              onClick={() => onQuestionClick?.(i)}
              disabled={!config.allowBack && i > current}
              className={cn(
                "relative flex h-8 w-8 min-w-[32px] items-center justify-center rounded-full transition-all duration-300",
                "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                i < current
                  ? "bg-emerald-400/60 text-white hover:bg-emerald-400"
                  : i === current
                  ? "bg-emerald-400 text-white shadow-lg shadow-emerald-400/40 scale-110 ring-2 ring-emerald-400/50"
                  : "bg-white/10 text-white/40 hover:bg-white/20 hover:text-white",
              )}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20, delay: i * 0.03 }}
            >
              {i < current ? (
                <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <span className="font-bold text-[11px] tabular-nums">{i + 1}</span>
              )}
              {/* Status indicator */}
              {i < current && (
                <motion.div
                  className="absolute -top-1 -right-1 size-4"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  <svg className="size-4 text-emerald-300" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>
      )}

      {/* Question Type & Difficulty Badge */}
      {currentQuestion && (
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold",
              currentQuestion.type === "scenario"
                ? "bg-achievement/10 text-achievement border border-achievement/20"
                : currentQuestion.type === "true_false"
                ? "bg-level/10 text-level border border-level/20"
                : "bg-primary/10 text-primary border border-primary/20",
            )}
          >
            {currentQuestion.type.replace("_", " ")}
          </span>
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold",
              currentQuestion.difficulty === "advanced"
                ? "bg-red-500/10 text-red-500 border border-red-500/20"
                : currentQuestion.difficulty === "intermediate"
                ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20",
            )}
          >
            {currentQuestion.difficulty}
          </span>
        </div>
      )}

      {/* Stats Summary */}
      {config.showProgress && (
        <div className="flex flex-wrap items-center justify-center gap-3 text-[10px] font-semibold">
          <div className="flex items-center gap-1 text-emerald-400">
            <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>{correct}</span>
          </div>
          <div className="flex items-center gap-1 text-red-400">
            <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>{incorrect}</span>
          </div>
          {unanswered > 0 && (
            <div className="flex items-center gap-1 text-white/40">
              <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" strokeLinecap="round" />
                <path d="M12 8v4M12 16h.01" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>{unanswered}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   COMPACT PROGRESS - For header area
   ════════════════════════════════════════════════════════════════════ */

interface CompactProgressProps {
  current: number;
  total: number;
  className?: string;
}

export function CompactProgress({ current, total, className }: CompactProgressProps) {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="text-[10px] font-bold text-white/50 tabular-nums">
        {current + 1}/{total}
      </span>
      <div className="hidden sm:block w-24 h-1.5 rounded-full bg-white/10 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-primary to-emerald-400"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   QUESTION NAVIGATOR - Dropdown/popover for jumping between questions
   ════════════════════════════════════════════════════════════════════ */

interface QuestionNavigatorProps {
  progress: QuizProgressState;
  currentIndex: number;
  onSelect: (index: number) => void;
  questions: Array<{ type: string; difficulty: string; answered: boolean; correct: boolean | null }>;
  className?: string;
}

export function QuestionNavigator({
  progress,
  currentIndex,
  className,
}: QuestionNavigatorProps) {
  const { total } = progress;

  return (
    <div className={cn("relative inline-block", className)}>
      <button
        type="button"
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
        aria-label="Question navigator"
        aria-haspopup="listbox"
      >
        <span className="text-[10px] font-bold tabular-nums">{currentIndex + 1}/{total}</span>
        <svg className="size-4 text-white/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {/* Popover would go here - simplified for now */}
    </div>
  );
}