"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Heart, Flame, Volume2, VolumeX, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DuolingoHeaderProps {
  progressPercentage: number; // 0 to 100
  hearts: number; // 0 to 5
  streak?: number;
  combo?: number;
  isMuted?: boolean;
  onToggleMute?: () => void;
  onQuit: () => void;
  className?: string;
}

export function DuolingoHeader({
  progressPercentage,
  hearts,
  streak = 0,
  combo = 0,
  isMuted = false,
  onToggleMute,
  onQuit,
  className,
}: DuolingoHeaderProps) {
  // Track previous hearts to trigger heart crack pulse
  const prevHeartsRef = React.useRef(hearts);
  const [lostHeart, setLostHeart] = React.useState(false);

  React.useEffect(() => {
    if (hearts < prevHeartsRef.current) {
      setLostHeart(true);
      const timer = setTimeout(() => setLostHeart(false), 800);
      return () => clearTimeout(timer);
    }
    prevHeartsRef.current = hearts;
  }, [hearts]);

  return (
    <header
      className={cn(
        "relative z-30 w-full select-none shrink-0",
        "bg-[#070913]/95 backdrop-blur-md border-b border-white/10",
        "px-4 sm:px-8 py-2.5 sm:py-3.5",
        className,
      )}
      style={{ paddingTop: "max(env(safe-area-inset-top), 8px)" }}
    >
      <div className="max-w-3xl mx-auto flex items-center justify-between gap-3 sm:gap-6">
        {/* Quit Button (✕) */}
        <button
          type="button"
          onClick={onQuit}
          aria-label="Quit Quiz"
          className="grid size-9 sm:size-10 shrink-0 place-items-center rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 active:translate-y-0.5 transition-all cursor-pointer"
        >
          <X className="size-5" />
        </button>

        {/* Fluid Capsule Progress Bar */}
        <div className="relative flex-1 h-3.5 sm:h-4 bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/15">
          <motion.div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full relative shadow-[0_0_12px_rgba(16,185,129,0.5)]"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, Math.max(0, progressPercentage))}%` }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
          >
            {/* Glossy Bar Highlight */}
            <div className="absolute inset-x-1 top-0.5 h-1 bg-white/35 rounded-full" />
          </motion.div>
        </div>

        {/* Stats HUD (Hearts, Streak, Combo, Mute) */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          {/* Consecutive Correct Combo Indicator */}
          {combo >= 2 && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-orange-400/40 text-amber-300 shadow-md shadow-orange-500/20"
            >
              <Zap className="size-3.5 sm:size-4 fill-amber-400 text-amber-400 animate-bounce" />
              <span className="text-xs sm:text-sm font-black tracking-tight">{combo}x COMBO</span>
            </motion.div>
          )}

          {/* Daily Streak Flame */}
          {streak > 0 && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Flame className="size-4 sm:size-5 fill-amber-400 animate-pulse" />
              <span className="text-xs sm:text-sm font-black tracking-tight">{streak}</span>
            </div>
          )}

          {/* Cosmic Hearts Indicator */}
          <div
            className={cn(
              "relative flex items-center gap-1.5 px-2.5 py-1 rounded-xl transition-colors",
              hearts <= 1
                ? "bg-rose-500/20 border border-rose-500/40 text-rose-400 animate-pulse"
                : "bg-rose-500/10 border border-rose-500/30 text-rose-400",
              lostHeart && "heart-crack",
            )}
          >
            <Heart className="size-4 sm:size-5 fill-rose-500 text-rose-500" />
            <span className="text-xs sm:text-sm font-black tracking-tight">{hearts}</span>

            {/* Floating -1 Animation on Heart Loss */}
            <AnimatePresence>
              {lostHeart && (
                <motion.span
                  initial={{ opacity: 1, y: 0, scale: 1 }}
                  animate={{ opacity: 0, y: -20, scale: 1.4 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="absolute -top-3 right-0 text-xs font-black text-rose-400 pointer-events-none"
                >
                  -1
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {/* Sound Toggle */}
          {onToggleMute && (
            <button
              type="button"
              onClick={onToggleMute}
              aria-label={isMuted ? "Unmute sounds" : "Mute sounds"}
              className="grid size-8 sm:size-9 place-items-center rounded-lg bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              {isMuted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
