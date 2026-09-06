"use client";

import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, SkipForward, ChevronLeft, Flag, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { QuizNavigationConfig, QuizProgressState, QuizModeConfig } from "./types";

/* ════════════════════════════════════════════════════════════════════
   QUIZ NAVIGATION - Previous/Next, Skip, Question Jump
   ════════════════════════════════════════════════════════════════════ */

interface QuizNavigationProps {
  config: QuizNavigationConfig;
  progress: QuizProgressState;
  currentIndex: number;
  hasFeedback: boolean;
  isSubmitting: boolean;
  isLastQuestion: boolean;
  canSubmit: boolean;
  onPrevious?: () => void;
  onNext?: () => void;
  onSkip?: () => void;
  onSubmit?: () => void;
  onJumpToQuestion?: (index: number) => void;
  questionStates?: Array<{ answered: boolean; correct: boolean | null }>;
  className?: string;
}

export function QuizNavigation({
  config,
  progress,
  currentIndex,
  hasFeedback,
  isSubmitting,
  isLastQuestion,
  canSubmit,
  onPrevious,
  onNext,
  onSkip,
  onSubmit,
  className,
}: QuizNavigationProps) {
  const { allowBack, allowSkip, showQuestionNumbers } = config;
  const isFirstQuestion = currentIndex === 0;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft" && allowBack && !isFirstQuestion) {
      e.preventDefault();
      onPrevious?.();
    } else if (e.key === "ArrowRight" && hasFeedback) {
      e.preventDefault();
      onNext?.();
    }
  };

  return (
    <motion.div
      className={cn("flex flex-col sm:flex-row items-center justify-between gap-3 p-3 border-t border-white/10", className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      onKeyDown={handleKeyDown}
    >
      {/* Left: Previous / Skip Back */}
      <div className="flex items-center gap-2">
        {allowBack && !isFirstQuestion && (
          <Button
            variant="outline"
            size="sm"
            onClick={onPrevious}
            disabled={isSubmitting}
            className="gap-1.5"
            aria-label="Previous question"
          >
            <ChevronLeft className="size-3.5" />
            <span className="hidden sm:inline">Previous</span>
          </Button>
        )}

        {allowSkip && !hasFeedback && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onSkip}
            disabled={isSubmitting || isLastQuestion}
            className="gap-1.5 text-white/50 hover:text-white/70"
            aria-label="Skip question"
          >
            <SkipForward className="size-3.5" />
            <span className="hidden sm:inline text-[11px]">Skip</span>
          </Button>
        )}
      </div>

      {/* Center: Question indicator / Submit or Continue */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
        {showQuestionNumbers && (
          <span className="text-[10px] font-bold text-white/50 tabular-nums hidden sm:inline">
            Question {currentIndex + 1} of {progress.total}
          </span>
        )}

        <AnimatePresence mode="wait">
          {!hasFeedback && canSubmit && (
            <motion.button
              key="submit"
              type="button"
              onClick={onSubmit}
              disabled={isSubmitting}
              className={cn(
                "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200",
                "bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30",
                "hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed",
              )}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <motion.span
                initial={{ rotate: -90 }}
                animate={{ rotate: 0 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
              >
                <ArrowRight className="size-4" />
              </motion.span>
              {isSubmitting ? "Checking..." : "Submit Answer"}
            </motion.button>
          )}

          {hasFeedback && (
            <motion.button
              key="continue"
              type="button"
              onClick={onNext}
              disabled={isSubmitting}
              className={cn(
                "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200",
                "bg-emerald-500 text-white shadow-md shadow-emerald-500/25 hover:shadow-lg hover:shadow-emerald-500/35",
                "hover:scale-[1.02] active:scale-[0.98]",
              )}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <motion.span
                initial={{ rotate: -90 }}
                animate={{ rotate: 0 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
              >
                <ArrowRight className="size-4" />
              </motion.span>
              {isLastQuestion ? "View Results" : "Continue"}
            </motion.button>
          )}

          {isLastQuestion && !hasFeedback && canSubmit && (
            <motion.button
              key="finish"
              type="button"
              onClick={onSubmit}
              disabled={isSubmitting}
              className={cn(
                "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200",
                "bg-gradient-to-r from-emerald-500 to-teal-500 text-white",
                "shadow-md shadow-emerald-500/25 hover:shadow-lg hover:shadow-emerald-500/35",
                "hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed",
              )}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <motion.span
                initial={{ rotate: -90 }}
                animate={{ rotate: 0 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
              >
                <Flag className="size-4" />
              </motion.span>
              {isSubmitting ? "Finishing..." : "Complete Quiz"}
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Right: Next / Skip Forward */}
      <div className="flex items-center gap-2 justify-end">
        {allowSkip && !hasFeedback && !isLastQuestion && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onSkip}
            disabled={isSubmitting}
            className="gap-1.5 text-white/50 hover:text-white/70"
            aria-label="Skip question"
          >
            <span className="hidden sm:inline text-[11px]">Skip</span>
            <SkipForward className="size-3.5" />
          </Button>
        )}

        {/* Question jump dropdown would go here in a full implementation */}
      </div>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   QUIZ CONTROLS - Answer submission, retry, hint, etc.
   ════════════════════════════════════════════════════════════════════ */

interface QuizControlsProps {
  config: QuizModeConfig;
  hasFeedback: boolean;
  feedback?: {
    isCorrect: boolean;
    explanation: string;
    correctAnswer: string;
    hint?: string | null;
    xpEarned: number;
  };
  isSubmitting: boolean;
  canSubmit: boolean;
  showHint: boolean;
  onSubmit: () => void;
  onRetry: () => void;
  onContinue: () => void;
  onHintToggle: () => void;
  className?: string;
}

export function QuizControls({
  config,
  hasFeedback,
  feedback,
  isSubmitting,
  canSubmit,
  showHint,
  onSubmit,
  onRetry,
  onContinue,
  onHintToggle,
  className,
}: QuizControlsProps) {
  const { feedback: feedbackConfig } = config;

  if (!hasFeedback) {
    return (
      <motion.div
        className={cn("flex items-center justify-end gap-2", className)}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Button
          onClick={onSubmit}
          disabled={!canSubmit || isSubmitting}
          className={cn(
            "px-6 py-3 rounded-xl font-bold transition-all duration-200",
            canSubmit
              ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98]"
              : "bg-muted text-muted-foreground cursor-not-allowed",
          )}
        >
          {isSubmitting ? (
            <>
              <svg className="size-4 animate-spin" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" strokeDasharray="31.4 31.4" />
              </svg>
              Checking...
            </>
          ) : (
            "Check Answer"
          )}
        </Button>
      </motion.div>
    );
  }

  if (!feedback) return null;

  return (
    <motion.div
      className={cn("flex flex-col sm:flex-row items-center justify-end gap-3", className)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {feedbackConfig.allowRetry && !feedback.isCorrect && (
        <Button
          variant="secondary"
          onClick={onRetry}
          className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl font-bold"
        >
          Try Again
        </Button>
      )}

      {feedback.isCorrect && (
        <Button
          onClick={onContinue}
          className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl font-bold bg-emerald-500 text-white shadow-md shadow-emerald-500/25 hover:shadow-lg hover:shadow-emerald-500/35 hover:scale-[1.02] active:scale-[0.98]"
        >
          Continue
          <ArrowRight className="size-4 ml-2" />
        </Button>
      )}

      {!feedback.isCorrect && !feedbackConfig.allowRetry && (
        <Button
          onClick={onContinue}
          className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl font-bold bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98]"
        >
          Continue
          <ArrowRight className="size-4 ml-2" />
        </Button>
      )}

      {/* Hint button */}
      {feedbackConfig.showHint && feedback?.hint && (
        <Button
          variant="outline"
          size="sm"
          onClick={onHintToggle}
          className="gap-1.5"
        >
          <HelpCircle className="size-3.5" />
          {showHint ? "Hide Hint" : "Show Hint"}
        </Button>
      )}
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   KEYBOARD SHORTCUTS HELPER
   ════════════════════════════════════════════════════════════════════ */

interface KeyboardShortcutsProps {
  config: QuizModeConfig;
  hasFeedback: boolean;
  canSubmit: boolean;
  onSubmit?: () => void;
  onRetry?: () => void;
  onContinue?: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  className?: string;
}

export function KeyboardShortcuts({
  config,
  hasFeedback,
  className,
}: KeyboardShortcutsProps) {
  const shortcuts = [
    { key: "Enter", action: hasFeedback ? (config.feedback.allowRetry ? "Retry" : "Continue") : "Submit", show: true },
    { key: "←/→", action: "Navigate", show: config.navigation.allowBack },
    { key: "1-6", action: "Select Option", show: !hasFeedback },
    { key: "R", action: "Retry", show: hasFeedback && config.feedback.allowRetry },
    { key: "H", action: "Hint", show: config.feedback.showHint && !hasFeedback },
  ].filter(s => s.show);

  return (
    <motion.div
      className={cn("hidden md:flex flex-wrap items-center justify-center gap-3 text-[10px] text-muted-foreground/60 pt-2", className)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      {shortcuts.map((shortcut, i) => (
        <motion.span
          key={shortcut.key}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 + i * 0.05, type: "spring", stiffness: 300 }}
          className="flex items-center gap-1.5"
        >
          <kbd className={cn(
            "px-1.5 py-0.5 rounded bg-white/5 border border-white/10 font-mono text-[9px]",
            "shadow-sm"
          )}>
            {shortcut.key}
          </kbd>
          <span>{shortcut.action}</span>
        </motion.span>
      ))}
    </motion.div>
  );
}