"use client";

import { motion, AnimatePresence } from "motion/react";
import { Check, X, Sparkles, Lightbulb, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MarkdownText } from "@/components/lesson/markdown";
import { AnimatedIcon } from "@/components/ui/animated-icon";
import { RithuMascot, getRithuMood } from "@/components/mentor/rithu-mascot";
import type { SubmitAnswerResult } from "@/lib/lesson/types";
import type { QuizFeedbackConfig } from "./types";

/* ════════════════════════════════════════════════════════════════════
   QUIZ FEEDBACK - Reusable feedback section with animations
   ════════════════════════════════════════════════════════════════════ */

const correctMessages = [
  "Nailed it! 🎯",
  "Perfect answer! ⚡",
  "You got it! 🌟",
  "Brilliant! Keep going! 💪",
  "Spot on! 🎉",
  "Excellent work! 🏆",
  "Crushed it! 💥",
];

const wrongMessages = [
  "Almost! Let me explain...",
  "Good try! Here's the key insight:",
  "Not quite — check this out:",
  "Close! Here's what happened:",
  "Good effort! Let's review:",
];

function pickRandom(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

interface QuizFeedbackProps {
  config: QuizFeedbackConfig;
  feedback: SubmitAnswerResult;
  onContinue: () => void;
  onRetry: () => void;
  onHintToggle?: () => void;
  showHint?: boolean;
  className?: string;
}

export function QuizFeedback({
  config,
  feedback,
  onContinue,
  onRetry,
  onHintToggle,
  showHint = false,
  className,
}: QuizFeedbackProps) {
  const correct = feedback.isCorrect;
  const isScenario = feedback.partIndex !== null && feedback.totalParts !== null;
  const scenarioComplete = feedback.scenarioComplete === true;

  const headline = !correct
    ? pickRandom(wrongMessages)
    : isScenario && scenarioComplete
      ? "Scenario complete! 🎉"
      : isScenario
        ? `Part ${feedback.partIndex! + 1} correct ✅`
        : pickRandom(correctMessages);

  const mood = getRithuMood({
    isCorrect: correct,
    isWrong: !correct,
  });

  return (
    <AnimatePresence mode="wait">
      <motion.section
        key={correct ? "correct" : "wrong"}
        initial={{ opacity: 0, y: 10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.98 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        role="status"
        aria-live="polite"
        className={cn(
          "rounded-2xl border p-5 transition-all shadow-lg shadow-black/5",
          correct
            ? "border-primary/30 bg-primary/5 animate-correct-flash"
            : "border-destructive/30 bg-destructive/5 animate-shake",
          className,
        )}
      >
        <div className="flex items-start gap-4">
          {/* Rithu mascot with animation */}
          {config.showRithuMascot && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
            >
              <RithuMascot mood={mood} size="sm" showSpeech={false} />
            </motion.div>
          )}

          <div className={cn("flex-1 min-w-0", config.showRithuMascot ? "" : "ml-0")}>
            {/* Status icon + headline */}
            <div className="flex items-center gap-2 mb-2">
              {correct ? (
                <AnimatedIcon animation="pop" size="sm" color="primary">
                  <Check className="size-4" />
                </AnimatedIcon>
              ) : (
                <AnimatedIcon animation="shake" size="sm" color="muted">
                  <X className="size-4 text-destructive" />
                </AnimatedIcon>
              )}
              <motion.p
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
                className={cn(
                  "font-bold text-sm",
                  correct ? "text-primary" : "text-destructive",
                )}
              >
                {headline}
              </motion.p>
            </div>

            {/* Explanation */}
            {config.showExplanation && (!isScenario || scenarioComplete) && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className={cn(
                  "text-sm text-muted-foreground leading-relaxed",
                  config.showRithuMascot ? "ml-9" : "",
                )}
              >
                <MarkdownText text={feedback.explanation} />
              </motion.div>
            )}

            {/* Correct answer display */}
            {config.showCorrectAnswer && !correct && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
                className={cn(
                  "mt-2 text-sm font-semibold text-foreground",
                  config.showRithuMascot ? "ml-9" : "",
                )}
              >
                Correct answer:{" "}
                <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
                  {feedback.correctAnswer}
                </code>
              </motion.p>
            )}

            {/* Hint */}
            {config.showHint && !correct && feedback.hint && !showHint && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className={cn(
                  "mt-1 text-xs italic text-muted-foreground flex items-center gap-1",
                  config.showRithuMascot ? "ml-9" : "",
                )}
                onClick={onHintToggle}
              >
                <Lightbulb className="size-3.5" />
                Show hint
              </motion.button>
            )}

            {config.showHint && !correct && feedback.hint && showHint && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className={cn(
                  "mt-1 text-xs italic text-muted-foreground",
                  config.showRithuMascot ? "ml-9" : "",
                )}
              >
                💡 Hint: {feedback.hint}
              </motion.p>
            )}

            {/* XP earned badge with sparkle */}
            {config.showXpEarned && correct && feedback.xpEarned > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 300, delay: 0.3 }}
                className={cn(
                  "mt-3 inline-flex items-center gap-1.5 rounded-full bg-xp/10 px-3 py-1 text-xs font-bold text-xp border border-xp/20 shadow-sm shadow-xp/10",
                  config.showRithuMascot ? "ml-9" : "",
                )}
              >
                <Sparkles className="size-3 text-amber-400 fill-amber-400/50" />
                +{feedback.xpEarned} XP
              </motion.div>
            )}

            {/* Part indicator for scenarios */}
            {isScenario && !scenarioComplete && feedback.partIndex !== null && feedback.totalParts !== null && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className={cn(
                  "mt-2 inline-flex items-center gap-1.5 rounded-full bg-level/10 px-3 py-1 text-xs font-bold text-level border border-level/20",
                  config.showRithuMascot ? "ml-9" : "",
                )}
              >
                <Target className="size-3" />
                <span>Part {feedback.partIndex + 1} of {feedback.totalParts}</span>
              </motion.div>
            )}
          </div>
        </div>

        {/* Keyboard shortcut hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className={cn(
            "mt-2 flex items-center justify-end gap-1.5 text-[10px] text-muted-foreground/60",
            config.showRithuMascot ? "ml-9" : "",
          )}
        >
          {correct ? (
            <>
              <kbd className="kbd">Enter</kbd>
              <span>to continue</span>
            </>
          ) : (
            <>
              <kbd className="kbd">Enter</kbd>
              <span>to retry</span>
              <span className="mx-1">·</span>
              <kbd className="kbd">R</kbd>
              <span>to retry</span>
            </>
          )}
        </motion.div>

        {/* Action buttons with spring entrance */}
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className={cn(
            "mt-4 flex justify-end gap-2",
            config.showRithuMascot ? "ml-11" : "",
          )}
        >
          {correct ? (
            <Button
              onClick={onContinue}
              className="rounded-xl font-bold shadow-sm shadow-primary/15 btn-glow"
            >
              Continue →
            </Button>
          ) : config.allowRetry ? (
            <Button
              variant="secondary"
              onClick={onRetry}
              className="rounded-xl font-bold"
            >
              Try again
            </Button>
          ) : (
            <Button
              onClick={onContinue}
              className="rounded-xl font-bold"
            >
              Continue
            </Button>
          )}
        </motion.div>
      </motion.section>
    </AnimatePresence>
  );
}

/* ════════════════════════════════════════════════════════════════════
   INLINE FEEDBACK - For immediate inline feedback (e.g., after each part)
   ════════════════════════════════════════════════════════════════════ */

interface InlineFeedbackProps {
  isCorrect: boolean;
  message: string;
  onDismiss?: () => void;
  className?: string;
}

export function InlineFeedback({ isCorrect, message, onDismiss, className }: InlineFeedbackProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.98 }}
      className={cn(
        "fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-xl border px-4 py-3 shadow-2xl max-w-md",
        isCorrect
          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
          : "border-red-500/30 bg-red-500/10 text-red-400",
        className,
      )}
      role="alert"
      aria-live="polite"
    >
      {isCorrect ? (
        <Check className="size-5 shrink-0" />
      ) : (
        <X className="size-5 shrink-0" />
      )}
      <p className="text-sm font-medium">{message}</p>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="ml-2 shrink-0 text-white/50 hover:text-white transition-colors"
        >
          <X className="size-4" />
        </button>
      )}
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   STREAK / COMBO INDICATOR
   ════════════════════════════════════════════════════════════════════ */

interface StreakIndicatorProps {
  combo: number;
  streak: number;
  maxCombo: number;
  className?: string;
}

export function StreakIndicator({ combo, streak, maxCombo, className }: StreakIndicatorProps) {
  if (combo < 2 && streak < 3) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn("flex flex-wrap items-center justify-center gap-2", className)}
    >
      {combo >= 2 && (
        <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 px-3 py-1 text-xs font-bold text-amber-300 animate-pulse">
          <Sparkles className="size-3" />
          <span>{combo}x Combo</span>
          {maxCombo > combo && (
            <span className="text-amber-400/50 ml-1">(max: {maxCombo}x)</span>
          )}
        </div>
      )}
      {streak >= 3 && (
        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-400">
          <span className="animate-bounce">🔥</span>
          <span>{streak} day streak</span>
        </div>
      )}
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   XP FLY ANIMATION - For showing XP gains
   ════════════════════════════════════════════════════════════════════ */

interface XpFlyProps {
  amount: number;
  trigger: number;
  position?: { x: number; y: number };
  className?: string;
}

export function XpFly({ amount, trigger, position, className }: XpFlyProps) {
  if (amount <= 0) return null;

  return (
    <motion.div
      key={trigger}
      className={cn("fixed pointer-events-none z-50", className)}
      style={position ? { left: position.x, top: position.y } : { left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}
      initial={{ opacity: 0, scale: 0.5, y: 0 }}
      animate={{ opacity: 1, scale: 1, y: -80 }}
      exit={{ opacity: 0, scale: 0.5, y: -120 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
    >
      <div className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 px-4 py-2 text-xs font-black text-white shadow-lg shadow-amber-500/30">
        <Sparkles className="size-3.5" />
        <span>+{amount} XP</span>
      </div>
    </motion.div>
  );
}