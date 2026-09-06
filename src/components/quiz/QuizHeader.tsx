"use client";

import { motion } from "motion/react";
import { X, Settings, Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { QuizTimer, QuizTimerBar, CompactProgress, type QuizTimerConfig } from "./QuizTimer";
import { QuizProgress, type QuizProgressState } from "./QuizProgress";
import type { QuizModeConfig } from "./types";

/* ════════════════════════════════════════════════════════════════════
   QUIZ HEADER - Topic, mode, progress, timer, actions
   ════════════════════════════════════════════════════════════════════ */

interface QuizHeaderProps {
  mode: QuizModeConfig["mode"];
  config: QuizModeConfig;
  topic: string;
  subtitle?: string;
  progress: QuizProgressState;
  timerConfig: QuizTimerConfig;
  isTimerActive: boolean;
  onTimerExpire?: () => void;
  onExit?: () => void;
  onPause?: () => void;
  onResume?: () => void;
  onSettings?: () => void;
  isPaused?: boolean;
  showExitButton?: boolean;
  userStats?: {
    xp: number;
    level: number;
    streak: number;
    hearts?: { current: number; max: number };
  };
  className?: string;
}

export function QuizHeader({
  mode,
  config,
  topic,
  subtitle,
  progress,
  timerConfig,
  isTimerActive,
  onTimerExpire,
  onExit,
  onPause,
  onResume,
  onSettings,
  isPaused,
  showExitButton = true,
  userStats,
  className,
}: QuizHeaderProps) {
  const theme = config.theme;

  const modeLabels: Record<QuizModeConfig["mode"], string> = {
    lesson: "Lesson Practice",
    daily: "Daily Challenge",
    "ai-practice": "AI Practice",
    custom: "Custom Quiz",
  };

  const modeIcons: Record<QuizModeConfig["mode"], React.ReactNode> = {
    lesson: (
      <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2L2 7l10 5 10-5-10-5z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2 17l10 5 10-5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    daily: (
      <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="16" y1="2" x2="16" y2="6" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="8" y1="2" x2="8" y2="6" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="3" y1="10" x2="21" y2="10" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    "ai-practice": (
      <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    custom: (
      <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="12" y1="8" x2="12" y2="12" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="12" y1="16" x2="12.01" y2="16" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  };

  return (
    <motion.header
      className={cn(
        "relative border-b border-white/10 backdrop-blur-xl sticky top-0 z-20",
        theme.backgroundClass,
        className,
      )}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Timer Bar at very top */}
      {timerConfig.enabled && (
        <QuizTimerBar
          config={timerConfig}
          isActive={isTimerActive && !isPaused}
          onExpire={onTimerExpire}
        />
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-4">
        {/* Left: Topic & Mode */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 min-w-0">
          <div className="flex items-center gap-2">
            <motion.div
              className={cn(
                "grid size-8 place-items-center rounded-xl",
                theme.variant === "challenge"
                  ? "bg-gradient-to-br from-emerald-400 via-green-500 to-teal-500"
                  : theme.variant === "practice"
                  ? "bg-gradient-to-br from-primary via-emerald-400 to-cyan-400"
                  : "bg-gradient-to-br from-primary via-emerald-400 to-cyan-400",
              )}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {modeIcons[mode]}
            </motion.div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">
                {modeLabels[mode]}
              </p>
              <h1 className="text-lg sm:text-xl font-black truncate text-foreground leading-tight">
                {topic}
              </h1>
              {subtitle && (
                <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
              )}
            </div>
          </div>
        </div>

        {/* Center: Progress & Timer */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
          <QuizProgress
            progress={progress}
            config={config.navigation}
            currentQuestion={{
              type: "",
              difficulty: "",
            }}
          />

          {timerConfig.enabled && (
            <QuizTimer
              config={timerConfig}
              isActive={isTimerActive && !isPaused}
              onExpire={onTimerExpire}
            />
          )}
        </div>

        {/* Right: User Stats & Actions */}
        <div className="flex items-center justify-end gap-2">
          {/* User Stats - compact */}
          {userStats && (
            <div className="hidden lg:flex items-center gap-2">
              {/* Streak */}
              <div className="flex items-center gap-1 rounded-lg bg-amber-500/10 px-2 py-1 border border-amber-500/20">
                <span className="size-3.5">🔥</span>
                <span className="text-[10px] font-bold text-amber-500">{userStats.streak}</span>
              </div>
              {/* XP */}
              <div className="flex items-center gap-1 rounded-lg bg-primary/10 px-2 py-1 border border-primary/20">
                <span className="size-3.5">⚡</span>
                <span className="text-[10px] font-bold text-primary tabular-nums">
                  {userStats.xp.toLocaleString()}
                </span>
              </div>
              {/* Level */}
              <div className="flex items-center gap-1 rounded-lg bg-emerald-500/10 px-2 py-1 border border-emerald-500/20">
                <span className="size-3.5">⭐</span>
                <span className="text-[10px] font-bold text-emerald-500">Lv.{userStats.level}</span>
              </div>
              {/* Hearts */}
              {userStats.hearts && (
                <div
                  className={cn(
                    "flex items-center gap-1 rounded-lg px-2 py-1 border",
                    userStats.hearts.current <= 2
                      ? "bg-red-500/15 border-red-500/20"
                      : "bg-red-500/10 border-red-500/20",
                  )}
                >
                  <svg className="size-3.5 fill-current text-red-500" viewBox="0 0 24 24">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                  <span className="text-[10px] font-bold text-red-500">{userStats.hearts.current}</span>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-1">
            {onPause && onResume && (
              <button
                type="button"
                onClick={isPaused ? onResume : onPause}
                className="grid size-9 place-items-center rounded-xl bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                aria-label={isPaused ? "Resume quiz" : "Pause quiz"}
                title={isPaused ? "Resume" : "Pause"}
              >
                {isPaused ? (
                  <Play className="size-4" />
                ) : (
                  <Pause className="size-4" />
                )}
              </button>
            )}

            {onSettings && (
              <button
                type="button"
                onClick={onSettings}
                className="grid size-9 place-items-center rounded-xl bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                aria-label="Quiz settings"
                title="Settings"
              >
                <Settings className="size-4" />
              </button>
            )}

            {showExitButton && onExit && (
              <button
                type="button"
                onClick={onExit}
                className="grid size-9 place-items-center rounded-xl bg-white/5 border border-white/10 text-white/70 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-colors"
                aria-label="Exit quiz"
                title="Exit"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
}

/* ════════════════════════════════════════════════════════════════════
   SIMPLE HEADER - For embedded quiz scenarios
   ════════════════════════════════════════════════════════════════════ */

interface SimpleQuizHeaderProps {
  topic: string;
  mode: QuizModeConfig["mode"];
  current: number;
  total: number;
  timerConfig?: QuizTimerConfig;
  isTimerActive?: boolean;
  onTimerExpire?: () => void;
  onExit?: () => void;
  className?: string;
}

export function SimpleQuizHeader({
  topic,
  mode,
  current,
  total,
  timerConfig,
  isTimerActive = true,
  onTimerExpire,
  onExit,
  className,
}: SimpleQuizHeaderProps) {

  return (
    <header className={cn("flex flex-col sm:flex-row items-center justify-between gap-3 p-3 border-b border-white/10 bg-background/95 backdrop-blur-xl", className)}>
      <div className="flex items-center gap-3 min-w-0">
        <div className="grid size-8 place-items-center rounded-xl bg-gradient-to-br from-primary via-emerald-400 to-cyan-400">
          <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 capitalize">
            {mode.replace("-", " ")}
          </p>
          <h2 className="text-lg font-black truncate text-foreground">{topic}</h2>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
        <CompactProgress current={current} total={total} />
        {timerConfig?.enabled && (
          <QuizTimer
            config={timerConfig}
            isActive={isTimerActive}
            onExpire={onTimerExpire}
          />
        )}
      </div>

      {onExit && (
        <button
          type="button"
          onClick={onExit}
          className="grid size-9 place-items-center rounded-xl bg-white/5 border border-white/10 text-white/70 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-colors"
          aria-label="Exit quiz"
        >
          <X className="size-4" />
        </button>
      )}
    </header>
  );
}