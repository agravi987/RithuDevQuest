"use client";

import { motion } from "motion/react";
import { Trophy, RotateCcw, ArrowRight, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { type QuizResult, type QuizModeConfig, type QuizThemeConfig } from "./types";

/* ════════════════════════════════════════════════════════════════════
   QUIZ RESULTS - Reusable results component with mode variants
   ════════════════════════════════════════════════════════════════════ */

interface QuizResultsProps {
  result: QuizResult;
  config: QuizModeConfig;
  theme: QuizThemeConfig;
  userXp?: number;
  onRetry?: () => void;
  onExit?: () => void;
  onReview?: () => void;
  showReview?: boolean;
  className?: string;
}

export function QuizResults({
  result,
  config,
  theme,
  onRetry,
  onExit,
  onReview,
  className,
}: QuizResultsProps) {
  const { totalQuestions, correctCount, accuracy, totalXpEarned, maxCombo, timeSpentMs, didLevelUp, newLevel, newLevelTitle, newAchievements, streak } = result;

  const getPerformanceMessage = () => {
    if (accuracy >= 90) return { message: "Outstanding! 🎉", emoji: "🏆", color: "text-amber-400" };
    if (accuracy >= 80) return { message: "Excellent! 🌟", emoji: "⭐", color: "text-emerald-400" };
    if (accuracy >= 70) return { message: "Great Job! 💪", emoji: "💪", color: "text-blue-400" };
    if (accuracy >= 60) return { message: "Good Effort! 👍", emoji: "👍", color: "text-sky-400" };
    if (accuracy >= 50) return { message: "Not Bad! 📚", emoji: "📚", color: "text-amber-400" };
    if (accuracy >= 40) return { message: "Keep Practicing! 📖", emoji: "📖", color: "text-orange-400" };
    return { message: "Don't Give Up! 🌱", emoji: "🌱", color: "text-red-400" };
  };

  const performance = getPerformanceMessage();

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${String(seconds).padStart(2, "0")}`;
  };

  const getModeSpecificContent = () => {
    switch (config.mode) {
      case "daily":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-center">
                <p className="text-2xl font-black text-emerald-400">{result.totalQuestions}</p>
                <p className="text-[10px] font-bold text-emerald-400/70 mt-0.5">questions</p>
              </div>
              <div className="rounded-xl bg-primary/10 border border-primary/20 p-4 text-center">
                <p className="text-2xl font-black text-primary">{formatTime(timeSpentMs)}</p>
                <p className="text-[10px] font-bold text-primary/70 mt-0.5">time</p>
              </div>
            </div>
            {streak && (
              <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="animate-bounce">🔥</span>
                    <span className="font-bold text-amber-400">Streak: {streak.currentStreak} days</span>
                  </div>
                  <span className="text-xs font-bold text-amber-400/70 uppercase tracking-wider">
                    {streak.status === "incremented" ? "Extended!" : "Maintained"}
                  </span>
                </div>
              </div>
            )}
          </div>
        );

      case "lesson":
        return (
          <div className="space-y-4">
            <div className="rounded-xl bg-primary/10 border border-primary/20 p-4">
              <h4 className="font-bold text-primary mb-2">What you learned</h4>
              <p className="text-sm text-muted-foreground">
                You completed the lesson quiz. Review the concepts you missed below.
              </p>
            </div>
            {didLevelUp && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="rounded-xl bg-gradient-to-r from-primary/10 to-emerald-500/10 border border-primary/20 p-4 text-center"
              >
                <span className="text-sm font-bold text-primary">
                  ⭐ Level Up! Level {newLevel} — {newLevelTitle}
                </span>
              </motion.div>
            )}
          </div>
        );

      case "ai-practice":
        return (
          <div className="space-y-4">
            <div className="rounded-xl bg-primary/10 border border-primary/20 p-4">
              <h4 className="font-bold text-primary mb-2">AI Analysis</h4>
              <p className="text-sm text-muted-foreground">
                Based on your performance, here are recommended focus areas.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {["Kubernetes", "Docker", "Linux"].slice(0, Math.max(1, Math.ceil(correctCount / 3))).map((topic) => (
                <span key={topic} className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
                  {topic}
                </span>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div className="rounded-xl bg-primary/10 border border-primary/20 p-4 text-center">
            <p className="text-sm text-muted-foreground">Quiz completed successfully!</p>
          </div>
        );
    }
  };

  return (
    <motion.div
      className={cn(
        "relative overflow-hidden rounded-3xl border p-5 sm:p-8 shadow-2xl shadow-black/20",
        theme.variant === "challenge"
          ? "border-emerald-500/20 bg-emerald-500/5"
          : theme.variant === "practice"
          ? "border-primary/20 bg-primary/5"
          : "border-border/50 bg-card",
        className,
      )}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full blur-[100px]" style={{
        background: theme.variant === "challenge"
          ? "rgba(16, 185, 129, 0.1)"
          : theme.variant === "practice"
          ? "rgba(99, 102, 241, 0.1)"
          : "rgba(99, 102, 241, 0.1)",
      }} />
      <div className="pointer-events-none absolute -bottom-16 -left-16 size-48 rounded-full blur-[80px]" style={{
        background: theme.variant === "challenge"
          ? "rgba(20, 184, 166, 0.05)"
          : "rgba(99, 102, 241, 0.05)",
      }} />

      <div className="relative z-10">
        {/* Header with celebration */}
        <div className="flex justify-center mb-6">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="relative"
          >
            <div className="absolute -inset-6 rounded-full blur-2xl animate-pulse" style={{
              background: theme.variant === "challenge"
                ? "rgba(16, 185, 129, 0.15)"
                : theme.variant === "practice"
                ? "rgba(99, 102, 241, 0.15)"
                : "rgba(99, 102, 241, 0.15)",
            }} />
            <div className="relative grid size-20 place-items-center rounded-full shadow-2xl" style={{
              background: theme.variant === "challenge"
                ? "linear-gradient(135deg, #10b981, #14b8a6)"
                : theme.variant === "practice"
                ? "linear-gradient(135deg, #6366f1, #10b981)"
                : "linear-gradient(135deg, #6366f1, #10b981)",
            }}>
              <Trophy className="size-10 text-white drop-shadow-lg" />
            </div>
          </motion.div>
        </div>

        {/* Performance message */}
        <div className="text-center mb-6">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl sm:text-3xl font-black text-white"
            style={{ color: performance.color }}
          >
            {performance.message}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-sm text-white/40 mt-1"
          >
            {config.mode === "daily" ? "Daily challenge complete" : "Quiz complete"}
          </motion.p>
        </div>

        {/* Accuracy circle */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <svg width="120" height="120" viewBox="0 0 120 120" className="-rotate-90">
              <circle cx="60" cy="60" r="52" fill="none" stroke="currentColor" strokeWidth="6" className="text-white/5" />
              <circle
                cx="60" cy="60" r="52" fill="none" stroke="url(#resultGradient)" strokeWidth="6" strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 52}
                strokeDashoffset={2 * Math.PI * 52 * (1 - accuracy / 100)}
                className="transition-all duration-1000"
              />
              <defs>
                <linearGradient id="resultGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  {theme.variant === "challenge" && (
                    <>
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#14b8a6" />
                    </>
                  )}
                  {theme.variant === "practice" && (
                    <>
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#10b981" />
                    </>
                  )}
                  {theme.variant === "lesson" && (
                    <>
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#10b981" />
                    </>
                  )}
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                className="text-3xl sm:text-4xl font-black text-white"
              >
                {accuracy}%
              </motion.span>
              <span className="text-[10px] font-bold text-white/30 mt-1">accuracy</span>
            </div>
          </div>
        </div>

        {/* Key stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-2 gap-3 mb-6"
        >
          <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3 text-center">
            <p className="text-2xl font-black text-white">{correctCount}/{totalQuestions}</p>
            <p className="text-[10px] font-bold text-white/30 mt-0.5">correct</p>
          </div>
          <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3 text-center">
            <p className="text-2xl font-black text-emerald-400">+{totalXpEarned}</p>
            <p className="text-[10px] font-bold text-white/30 mt-0.5">XP earned</p>
          </div>
        </motion.div>

        {/* Additional stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-2 gap-3 mb-6"
        >
          <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3 text-center">
            <p className="text-xl font-black text-white">{maxCombo}x</p>
            <p className="text-[10px] font-bold text-white/30 mt-0.5">max combo</p>
          </div>
          <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3 text-center">
            <p className="text-xl font-black text-white">{formatTime(timeSpentMs)}</p>
            <p className="text-[10px] font-bold text-white/30 mt-0.5">time</p>
          </div>
        </motion.div>

        {/* Level up celebration */}
        {didLevelUp && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.7, type: "spring", stiffness: 200, damping: 15 }}
            className={cn(
              "rounded-xl p-4 text-center mb-6",
              theme.variant === "challenge"
                ? "bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20"
                : "bg-gradient-to-r from-primary/10 to-emerald-500/10 border border-primary/20",
            )}
          >
            <span className={cn(
              "text-sm font-bold",
              theme.variant === "challenge" ? "text-emerald-300" : "text-primary",
            )}>
              ⭐ Level Up! Level {newLevel} — {newLevelTitle}
            </span>
          </motion.div>
        )}

        {/* New achievements */}
        {newAchievements && newAchievements.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mb-6"
          >
            <h4 className="font-bold text-white/70 mb-3 flex items-center gap-2">
              <Award className="size-4 text-amber-400" />
              New Achievements
            </h4>
            <div className="flex flex-wrap gap-2">
              {newAchievements.map((achievement) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + 0.1, type: "spring" }}
                  className="flex items-center gap-2 rounded-xl bg-amber-500/10 border border-amber-500/20 px-3 py-2"
                >
                  <span className="text-lg">{achievement.icon}</span>
                  <div>
                    <p className="font-bold text-amber-400">{achievement.title}</p>
                    <p className="text-xs text-white/50">+{achievement.xpReward} XP</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Mode-specific content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          {getModeSpecificContent()}
        </motion.div>

        {/* Review answers toggle */}
        {config.completion.showReview && onReview && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mb-6"
          >
            <button
              type="button"
              onClick={onReview}
              className="w-full flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-bold text-white/70 hover:text-white hover:bg-white/[0.06] transition-colors"
            >
              <span>Review your answers</span>
              <span className="ml-2 text-sm text-white/40">
                {correctCount} correct
              </span>
            </button>
          </motion.div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          {onRetry && (
            <Button
              onClick={onRetry}
              variant="secondary"
              className="flex-1 font-bold py-3 rounded-xl gap-2"
            >
              <RotateCcw className="size-4" />
              Try Again
            </Button>
          )}

          {onExit && (
            <Button
              onClick={onExit}
              className={cn(
                "flex-1 font-bold py-3 rounded-xl gap-2",
                theme.variant === "challenge"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:opacity-90"
                  : theme.variant === "practice"
                  ? "bg-gradient-to-r from-primary to-emerald-500 text-white hover:opacity-90"
                  : "bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white",
              )}
            >
              <ArrowRight className="size-4" />
              {config.mode === "daily" ? "Back to Practice" : "Continue Learning"}
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   COMPACT RESULTS - For inline/sidebar display
   ════════════════════════════════════════════════════════════════════ */

interface CompactResultsProps {
  result: QuizResult;
  config: QuizModeConfig;
  className?: string;
}

export function CompactResults({ result, config, className }: CompactResultsProps) {
  const { totalQuestions, correctCount, accuracy, totalXpEarned, maxCombo } = result;

  return (
    <div className={cn("rounded-2xl border border-white/10 bg-white/[0.03] p-4", className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="grid size-12 place-items-center rounded-xl bg-gradient-to-r from-primary to-emerald-400">
            <Trophy className="size-6 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-white/50">Quiz Complete</p>
            <p className="text-xl font-black text-white">{correctCount}/{totalQuestions}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-3xl font-black text-emerald-400">{accuracy}%</p>
          <p className="text-[10px] font-bold text-white/30">accuracy</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3 text-center">
          <p className="text-xl font-black text-white">+{totalXpEarned}</p>
          <p className="text-[10px] font-bold text-white/30">XP earned</p>
        </div>
        <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3 text-center">
          <p className="text-xl font-black text-white">{maxCombo}x</p>
          <p className="text-[10px] font-bold text-white/30">max combo</p>
        </div>
        <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3 text-center">
          <p className="text-xl font-black text-primary">
            {config.mode === "daily" && result.streak ? `${result.streak.currentStreak}🔥` : "—"}
          </p>
          <p className="text-[10px] font-bold text-white/30">streak</p>
        </div>
      </div>
    </div>
  );
}

export type { QuizResult, QuizModeConfig, QuizThemeConfig } from "./types";