"use client";

import * as React from "react";
import { motion } from "motion/react";
import { Sparkles, Flame, Target, Clock, BookOpen } from "lucide-react";
import { DuoButton } from "./duo-button";
import { CosmicCharacter } from "./characters/CosmicCharacter";
import { DuolingoMistakesModal, type DuolingoMistakeItem } from "./modals/DuolingoMistakesModal";
import { lessonCompleteConfetti } from "@/lib/confetti";
import { playVictoryFanfareSound } from "@/lib/sounds";

export interface DuolingoResultsProps {
  xpEarned: number;
  accuracy: number; // 0 to 100
  maxCombo: number;
  timeSpentMs: number;
  streak?: number;
  mistakes?: DuolingoMistakeItem[];
  onContinue: () => void;
}

export function DuolingoResults({
  xpEarned,
  accuracy,
  maxCombo,
  timeSpentMs,
  streak = 0,
  mistakes = [],
  onContinue,
}: DuolingoResultsProps) {
  const [showMistakes, setShowMistakes] = React.useState(false);
  const [odometerXp, setOdometerXp] = React.useState(0);

  // Trigger fanfare and confetti on mount
  React.useEffect(() => {
    playVictoryFanfareSound();
    lessonCompleteConfetti();

    // Odometer counter animation for XP
    if (xpEarned > 0) {
      const duration = 1200;
      const startTime = performance.now();

      const updateCount = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(1, elapsed / duration);
        // Ease-out expo
        const currentCount = Math.round(progress * xpEarned);
        setOdometerXp(currentCount);

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        }
      };

      requestAnimationFrame(updateCount);
    }
  }, [xpEarned]);

  const formattedTime = React.useMemo(() => {
    const totalSeconds = Math.floor(timeSpentMs / 1000);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }, [timeSpentMs]);

  return (
    <div className="relative min-h-[85dvh] flex flex-col items-center justify-between py-6 px-4 max-w-lg mx-auto w-full select-none text-center">
      {/* ── 1. Header & Celebrating Mascot ── */}
      <div className="flex flex-col items-center gap-3 mt-4">
        <CosmicCharacter
          characterId="rithu"
          mood="celebrating"
          size="lg"
          className="mb-1"
        />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <span className="text-xs uppercase font-black tracking-widest text-emerald-400">
            Quest Completed
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            Superb Velocity, Cadet!
          </h1>
          <p className="text-xs sm:text-sm text-white/50 mt-1">
            All orbital concepts mastered with 100% completion.
          </p>
        </motion.div>
      </div>

      {/* ── 2. Stat Cards Grid ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.35, type: "spring", stiffness: 350, damping: 28 }}
        className="grid grid-cols-2 gap-3 w-full my-6"
      >
        {/* Total XP Card with Odometer */}
        <div className="flex flex-col items-center justify-center p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 shadow-lg shadow-emerald-500/10">
          <div className="flex items-center gap-1 text-emerald-400 text-xs font-black uppercase tracking-wider mb-1">
            <Sparkles className="size-3.5" /> Total XP
          </div>
          <span className="text-2xl sm:text-3xl font-black text-white">
            +{odometerXp}
          </span>
        </div>

        {/* Accuracy Card */}
        <div className="flex flex-col items-center justify-center p-4 rounded-2xl border border-cyan-500/30 bg-cyan-500/10 shadow-lg shadow-cyan-500/10">
          <div className="flex items-center gap-1 text-cyan-400 text-xs font-black uppercase tracking-wider mb-1">
            <Target className="size-3.5" /> Accuracy
          </div>
          <span className="text-2xl sm:text-3xl font-black text-white">
            {accuracy}%
          </span>
        </div>

        {/* Streak Combo Card */}
        <div className="flex flex-col items-center justify-center p-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 shadow-lg shadow-amber-500/10">
          <div className="flex items-center gap-1 text-amber-400 text-xs font-black uppercase tracking-wider mb-1">
            <Flame className="size-3.5 fill-amber-400" /> {streak > 0 ? "Daily Streak" : "Max Combo"}
          </div>
          <span className="text-2xl sm:text-3xl font-black text-white">
            {streak > 0 ? `${streak} days` : `${maxCombo} in a row`}
          </span>
        </div>


        {/* Time Spent Card */}
        <div className="flex flex-col items-center justify-center p-4 rounded-2xl border border-white/10 bg-white/5">
          <div className="flex items-center gap-1 text-white/50 text-xs font-black uppercase tracking-wider mb-1">
            <Clock className="size-3.5" /> Time
          </div>
          <span className="text-2xl sm:text-3xl font-black text-white">
            {formattedTime}
          </span>
        </div>
      </motion.div>

      {/* ── 3. Review Mistakes Button & Continue Action ── */}
      <div className="flex flex-col gap-3 w-full pb-2">
        {mistakes.length > 0 && (
          <button
            type="button"
            onClick={() => setShowMistakes(true)}
            className="inline-flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border border-white/15 bg-white/5 text-white/80 hover:text-white hover:bg-white/10 active:translate-y-0.5 text-xs sm:text-sm font-bold tracking-wide uppercase transition-all cursor-pointer"
          >
            <BookOpen className="size-4 text-cyan-400" />
            Review Recycled Mistakes ({mistakes.length})
          </button>
        )}

        <DuoButton
          variant="primary"
          size="lg"
          fullWidth
          autoFocus
          onClick={onContinue}
        >
          Continue
        </DuoButton>
      </div>

      {/* Interactive Review Mistakes Slide-Over Modal */}
      <DuolingoMistakesModal
        isOpen={showMistakes}
        onClose={() => setShowMistakes(false)}
        mistakes={mistakes}
      />
    </div>
  );
}
