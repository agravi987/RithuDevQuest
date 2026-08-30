"use client";


import { Check, X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { Button } from "@/components/ui/button";
import { MarkdownText } from "@/components/lesson/markdown";
import { AnimatedIcon } from "@/components/ui/animated-icon";
import type { SubmitAnswerResult } from "@/lib/lesson/types";
import { cn } from "@/lib/utils";
import { RithuMascot, getRithuMood } from "@/components/mentor/rithu-mascot";

type FeedbackSectionProps = {
  feedback: SubmitAnswerResult;
  onContinue: () => void;
  onRetry: () => void;
};

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

export function FeedbackSection({
  feedback,
  onContinue,
  onRetry,
}: FeedbackSectionProps) {
  const correct = feedback.isCorrect;
  const isScenario =
    feedback.partIndex !== null && feedback.totalParts !== null;
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
        exit={{ opacity: 0, y: -10 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className={cn(
          "rounded-2xl border-2 p-5 transition-all",
          correct
            ? "border-primary/30 bg-primary/5 animate-correct-flash"
            : "border-destructive/30 bg-destructive/5 animate-shake",
        )}
      >
        <div className="flex items-start gap-4">
          {/* Rithu mascot with animation */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
          >
            <RithuMascot mood={mood} size="sm" showSpeech={false} />
          </motion.div>

          <div className="flex-1 min-w-0">
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
            {(!isScenario || scenarioComplete) && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-sm text-muted-foreground leading-relaxed ml-9"
              >
                <MarkdownText text={feedback.explanation} />
              </motion.div>
            )}

            {/* Correct answer display */}
            {!correct && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="mt-2 text-sm font-semibold text-foreground ml-9"
              >
                Correct answer:{" "}
                <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
                  {feedback.correctAnswer}
                </code>
              </motion.p>
            )}
            {!correct && feedback.hint && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-1 text-xs italic text-muted-foreground ml-9"
              >
                💡 Hint: {feedback.hint}
              </motion.p>
            )}

            {/* XP earned badge with sparkle */}
            {correct && feedback.xpEarned > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 300, delay: 0.3 }}
                className="mt-3 ml-9 inline-flex items-center gap-1.5 rounded-full bg-xp/10 px-3 py-1 text-xs font-bold text-xp border border-xp/20 shadow-sm shadow-xp/10"
              >
                <Sparkles className="size-3 text-amber-400 fill-amber-400/50" />
                +{feedback.xpEarned} XP
              </motion.div>
            )}
          </div>
        </div>

        {/* Keyboard shortcut hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="ml-9 mt-2 flex items-center gap-1.5 text-[10px] text-muted-foreground/60"
        >
          {correct ? (
            <>
              <kbd className="kbd">Enter</kbd>
              <span>to continue</span>
            </>
          ) : (
            <>
              <kbd className="kbd">R</kbd>
              <span>to retry</span>
              <span className="mx-1">·</span>
              <kbd className="kbd">Enter</kbd>
              <span>to continue</span>
            </>
          )}
        </motion.div>

        {/* Action buttons with spring entrance */}
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mt-4 flex justify-end gap-2 ml-11"
        >
          {correct ? (
            <Button
              onClick={onContinue}
              className="rounded-xl font-bold shadow-sm shadow-primary/15 btn-glow"
            >
              Continue →
            </Button>
          ) : (
            <Button
              variant="secondary"
              onClick={onRetry}
              className="rounded-xl font-bold"
            >
              Try again
            </Button>
          )}
        </motion.div>
      </motion.section>
    </AnimatePresence>
  );
}
