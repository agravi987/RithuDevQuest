"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, Sparkles, Target, Clock } from "lucide-react";
import { DuoButton } from "../duo-button";
import { CosmicCharacter } from "../characters/CosmicCharacter";

export interface DuolingoOutOfHeartsModalProps {
  isOpen: boolean;
  userXp?: number;
  onPracticeForHearts: () => void;
  onRefillWithXp?: () => void;
  onQuit: () => void;
}

export function DuolingoOutOfHeartsModal({
  isOpen,
  userXp = 0,
  onPracticeForHearts,
  onRefillWithXp,
  onQuit,
}: DuolingoOutOfHeartsModalProps) {
  if (!isOpen) return null;

  const canAffordRefill = userXp >= 50;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 350, damping: 28 }}
          className="relative w-full max-w-md rounded-3xl border border-rose-500/30 bg-[#0c1022] p-6 sm:p-8 shadow-2xl text-center"
        >
          {/* Heart Crack Mascot Display */}
          <div className="flex justify-center mb-3">
            <CosmicCharacter characterId="cosmo" mood="sad_droop" size="md" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-black uppercase mb-3">
            <Heart className="size-3.5 fill-rose-500 text-rose-500" /> Out of Hearts
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-2">
            Need More Cosmic Fuel?
          </h2>
          <p className="text-xs sm:text-sm text-white/60 mb-6 leading-relaxed">
            You made 5 missteps. Practice to earn hearts back or refill with Stardust!
          </p>

          {/* 3-Way Recovery Options */}
          <div className="flex flex-col gap-3 mb-4 text-left">
            {/* 1. Practice for Hearts */}
            <button
              type="button"
              onClick={onPracticeForHearts}
              className="flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border-2 border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 active:translate-y-0.5 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-xl bg-emerald-500 text-emerald-950">
                  <Target className="size-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-white">Practice for Hearts</h4>
                  <p className="text-xs text-emerald-300/70">Casual review questions restore +1 heart each</p>
                </div>
              </div>
              <span className="text-xs font-black uppercase text-emerald-400">Free</span>
            </button>

            {/* 2. Refill with XP / Stardust */}
            {onRefillWithXp && (
              <button
                type="button"
                disabled={!canAffordRefill}
                onClick={onRefillWithXp}
                className="flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border-2 border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 active:translate-y-0.5 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center gap-3">
                  <div className="grid size-10 place-items-center rounded-xl bg-cyan-500 text-cyan-950">
                    <Sparkles className="size-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white">Refill Full Hearts</h4>
                    <p className="text-xs text-cyan-300/70">Instant 5 hearts (You have {userXp} XP)</p>
                  </div>
                </div>
                <span className="text-xs font-black uppercase text-cyan-400">50 XP</span>
              </button>
            )}

            {/* 3. Auto-Regen Timer */}
            <div className="flex items-center gap-3 p-3.5 rounded-2xl border border-white/10 bg-white/5 text-white/50 text-xs">
              <Clock className="size-4 shrink-0 text-white/40" />
              <span>Hearts automatically regenerate +1 every 30 minutes.</span>
            </div>
          </div>

          <DuoButton
            variant="ghost"
            size="md"
            fullWidth
            onClick={onQuit}
            className="text-white/60 hover:text-white"
          >
            Quit to Orbit
          </DuoButton>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
