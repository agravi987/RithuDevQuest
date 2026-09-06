"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion } from "motion/react";
import { Timer, AlertTriangle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { type QuizTimerConfig, type QuizTimerState } from "./types";

interface QuizTimerProps {
  config: QuizTimerConfig;
  isActive: boolean;
  onExpire?: () => void;
  onWarning?: (isWarning: boolean) => void;
  onCritical?: (isCritical: boolean) => void;
  className?: string;
}

export function QuizTimer({
  config,
  isActive,
  onExpire,
  onWarning,
  onCritical,
  className,
}: QuizTimerProps) {
  const [state, setState] = useState<QuizTimerState>({
    minutes: 0,
    seconds: 0,
    totalSeconds: 0,
    progress: 1,
    isExpired: false,
    isWarning: false,
    isCritical: false,
    formatted: "00:00",
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const expiresAtRef = useRef<Date | null>(null);
  const durationMsRef = useRef(config.durationMs ?? 0);
  const warningTriggeredRef = useRef(false);
  const criticalTriggeredRef = useRef(false);

  const updateTimer = useCallback(() => {
    if (!config.enabled || !expiresAtRef.current) {
      setState((prev) => ({ ...prev, formatted: "00:00" }));
      return;
    }

    const now = Date.now();
    const remaining = Math.max(0, expiresAtRef.current.getTime() - now);
    const total = durationMsRef.current > 0 ? durationMsRef.current : remaining;
    const progress = total > 0 ? Math.max(0, Math.min(1, remaining / total)) : 1;
    const isExpired = remaining <= 0;

    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    const totalSeconds = Math.floor(remaining / 1000);

    const isWarning = progress <= config.warningThreshold && progress > config.criticalThreshold;
    const isCritical = progress <= config.criticalThreshold;

    if (isWarning && !warningTriggeredRef.current) {
      warningTriggeredRef.current = true;
      onWarning?.(true);
    } else if (!isWarning && warningTriggeredRef.current) {
      warningTriggeredRef.current = false;
      onWarning?.(false);
    }

    if (isCritical && !criticalTriggeredRef.current) {
      criticalTriggeredRef.current = true;
      onCritical?.(true);
    } else if (!isCritical && criticalTriggeredRef.current) {
      criticalTriggeredRef.current = false;
      onCritical?.(false);
    }

    if (isExpired && !state.isExpired) {
      onExpire?.();
    }

    setState({
      minutes,
      seconds,
      totalSeconds,
      progress,
      isExpired,
      isWarning,
      isCritical,
      formatted: `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`,
    });
  }, [config.enabled, config.warningThreshold, config.criticalThreshold, onExpire, onWarning, onCritical, state.isExpired]);

  useEffect(() => {
    if (!config.enabled) {
      setState((prev) => ({ ...prev, progress: 1, formatted: "∞" }));
      return;
    }

    if (config.durationMs) {
      expiresAtRef.current = new Date(Date.now() + config.durationMs);
      durationMsRef.current = config.durationMs;
      warningTriggeredRef.current = false;
      criticalTriggeredRef.current = false;
    }

    if (isActive && expiresAtRef.current) {
      updateTimer();
      timerRef.current = setInterval(updateTimer, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [config.enabled, config.durationMs, isActive, updateTimer]);

  useEffect(() => {
    if (config.durationMs) {
      durationMsRef.current = config.durationMs;
    }
  }, [config.durationMs]);

  if (!config.enabled) return null;

  const { progress, isWarning, isCritical, formatted } = state;

  const getTimerColor = () => {
    if (isCritical) return "text-red-400";
    if (isWarning) return "text-amber-400";
    return "text-white/80";
  };

  const getProgressColor = () => {
    if (isCritical) return "bg-gradient-to-r from-red-500 to-red-400";
    if (isWarning) return "bg-gradient-to-r from-amber-500 to-amber-400";
    return "bg-gradient-to-r from-emerald-400 to-emerald-500";
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <motion.div
        className={cn(
          "relative flex items-center gap-2 px-3 py-1.5 rounded-xl font-mono text-sm font-bold transition-all duration-300",
          getTimerColor(),
          isCritical && "animate-pulse",
        )}
        animate={{ scale: isCritical ? 1.05 : 1 }}
        transition={{ duration: 500, repeat: Infinity, repeatType: "reverse" }}
      >
        <motion.div
          className="size-4 flex items-center justify-center"
          animate={{ rotate: isActive && config.durationMs ? 360 : 0 }}
          transition={{ duration: 20000, ease: "linear", repeat: Infinity }}
        >
          <Timer className="size-4" />
        </motion.div>
        <span className="tabular-nums min-w-[5ch] text-right">{formatted}</span>
        {config.showMilliseconds && (
          <span className="text-[10px] opacity-60">.00</span>
        )}
      </motion.div>

      <motion.div
        className="hidden sm:block w-32 h-1.5 rounded-full bg-white/10 overflow-hidden"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: progress }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <motion.div
          className="h-full rounded-full transition-all duration-1000"
          style={{ background: getProgressColor() }}
          initial={{ width: "100%" }}
          animate={{ width: `${progress * 100}%` }}
        />
      </motion.div>

      {(isWarning || isCritical) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
          style={{
            background: isCritical ? "rgba(239, 68, 68, 0.15)" : "rgba(245, 158, 11, 0.15)",
            color: isCritical ? "#f87171" : "#fbbf24",
            borderColor: isCritical ? "rgba(239, 68, 68, 0.3)" : "rgba(245, 158, 11, 0.3)",
          }}
        >
          {isCritical ? (
            <>
              <AlertTriangle className="size-3" />
              <span>CRITICAL</span>
            </>
          ) : (
            <>
              <Clock className="size-3" />
              <span>HURRY</span>
            </>
          )}
        </motion.div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   TIMER BAR - Full width progress bar for top of quiz
   ════════════════════════════════════════════════════════════════════ */

interface QuizTimerBarProps {
  config: QuizTimerConfig;
  isActive: boolean;
  onExpire?: () => void;
  className?: string;
}

export function QuizTimerBar({
  config,
  isActive,
  onExpire,
  className,
}: QuizTimerBarProps) {
  const [progress, setProgress] = useState(1);
  const [isExpired, setIsExpired] = useState(false);
  const [isWarning, setIsWarning] = useState(false);
  const [isCritical, setIsCritical] = useState(false);

  const expiresAtRef = useRef<Date | null>(null);
  const durationMsRef = useRef(config.durationMs ?? 0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const warningTriggeredRef = useRef(false);
  const criticalTriggeredRef = useRef(false);

  const tick = useCallback(() => {
    if (!config.enabled || !expiresAtRef.current) {
      setProgress(1);
      return;
    }

    const remaining = Math.max(0, expiresAtRef.current.getTime() - Date.now());
    const total = durationMsRef.current > 0 ? durationMsRef.current : remaining;
    const newProgress = total > 0 ? Math.max(0, Math.min(1, remaining / total)) : 1;
    const expired = remaining <= 0;

    const newIsWarning = newProgress <= config.warningThreshold && newProgress > config.criticalThreshold;
    const newIsCritical = newProgress <= config.criticalThreshold;

    if (newIsWarning && !warningTriggeredRef.current) {
      warningTriggeredRef.current = true;
    } else if (!newIsWarning && warningTriggeredRef.current) {
      warningTriggeredRef.current = false;
    }

    if (newIsCritical && !criticalTriggeredRef.current) {
      criticalTriggeredRef.current = true;
    } else if (!newIsCritical && criticalTriggeredRef.current) {
      criticalTriggeredRef.current = false;
    }

    if (expired && !isExpired) {
      setIsExpired(true);
      onExpire?.();
    }

    setProgress(newProgress);
    setIsWarning(newIsWarning);
    setIsCritical(newIsCritical);
  }, [config.enabled, config.warningThreshold, config.criticalThreshold, onExpire, isExpired]);

  useEffect(() => {
    if (!config.enabled) {
      setProgress(1);
      setIsWarning(false);
      setIsCritical(false);
      setIsExpired(false);
      return;
    }

    if (config.durationMs) {
      expiresAtRef.current = new Date(Date.now() + config.durationMs);
      durationMsRef.current = config.durationMs;
      warningTriggeredRef.current = false;
      criticalTriggeredRef.current = false;
      setIsExpired(false);
      setIsWarning(false);
      setIsCritical(false);
    }

    if (isActive && expiresAtRef.current) {
      tick();
      timerRef.current = setInterval(tick, 100);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [config.enabled, config.durationMs, isActive, tick]);

  useEffect(() => {
    if (config.durationMs) {
      durationMsRef.current = config.durationMs;
    }
  }, [config.durationMs]);

  if (!config.enabled) return null;

  const getBarColor = () => {
    if (isCritical) return "from-red-500 to-red-400";
    if (isWarning) return "from-amber-500 to-amber-400";
    return "from-emerald-400 to-emerald-500";
  };

  return (
    <motion.div
      className={cn("relative h-1.5 bg-white/5 overflow-hidden", className)}
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      exit={{ scaleX: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={{ transformOrigin: "left center" }}
      role="progressbar"
      aria-valuenow={Math.round(progress * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Quiz timer"
    >
      <motion.div
        className="h-full rounded-full"
        style={{ background: `linear-gradient(90deg, ${getBarColor().replace("from-", "").replace("to-", "")})` }}
        initial={{ width: "100%" }}
        animate={{ width: `${progress * 100}%` }}
        transition={{ duration: 0.1, ease: "linear" }}
      />
      {(isWarning || isCritical) && (
        <motion.div
          className="absolute top-0 right-0 h-full w-2"
          style={{
            background: isCritical
              ? "linear-gradient(90deg, transparent, rgba(239, 68, 68, 0.5))"
              : "linear-gradient(90deg, transparent, rgba(245, 158, 11, 0.5))",
          }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 500, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   COUNTDOWN TIMER - For pre-quiz countdown
   ════════════════════════════════════════════════════════════════════ */

interface CountdownTimerProps {
  seconds: number;
  onComplete: () => void;
  className?: string;
}

export function CountdownTimer({ seconds: initialSeconds, onComplete, className }: CountdownTimerProps) {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (seconds <= 0) {
      onComplete();
      return;
    }
    const interval = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(interval);
          onComplete();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [seconds, onComplete]);

  return (
    <motion.div
      className={cn(
        "flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-primary/20 to-emerald-500/20 border border-primary/30 text-primary font-mono font-bold",
        className,
      )}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <span className="text-3xl sm:text-4xl tabular-nums">{seconds}</span>
      <span className="text-sm sm:text-base opacity-70">seconds</span>
    </motion.div>
  );
}

interface CompactProgressProps {
  current: number;
  total: number;
  className?: string;
}

export function CompactProgress({ current, total, className }: CompactProgressProps) {
  const percentage = total > 0 ? Math.round((Math.min(current, total) / total) * 100) : 0;
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-white/40 transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="font-mono text-[10px] text-white/60 tabular-nums">
        {Math.min(current, total)}/{total}
      </span>
    </div>
  );
}

export type { QuizTimerConfig, QuizTimerState } from "./types";