"use client";

import * as React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import type { DuolingoMatchPairsPayload } from "../types";
import { playTapPopSound, playCorrectSound, playWrongSound } from "@/lib/sounds";

export interface DuolingoMatchPairsProps {
  payload: DuolingoMatchPairsPayload;
  onMatchComplete: (isAllMatched: boolean) => void;
  disabled?: boolean;
}

export function DuolingoMatchPairs({
  payload,
  onMatchComplete,
  disabled = false,
}: DuolingoMatchPairsProps) {
  const { pairs } = payload;

  // Left terms
  const leftItems = React.useMemo(() => {
    return pairs.map((p) => ({ id: p.id, text: p.left }));
  }, [pairs]);

  // Shuffled right items
  const rightItems = React.useMemo(() => {
    return [...pairs]
      .sort((a, b) => a.right.localeCompare(b.right))
      .map((p) => ({ id: p.id, text: p.right }));
  }, [pairs]);

  const [selectedLeft, setSelectedLeft] = React.useState<string | null>(null);
  const [selectedRight, setSelectedRight] = React.useState<string | null>(null);
  const [matchedIds, setMatchedIds] = React.useState<string[]>([]);
  const [mismatchPair, setMismatchPair] = React.useState<{ left: string; right: string } | null>(null);

  const handleSelectLeft = (id: string) => {
    if (disabled || matchedIds.includes(id)) return;
    playTapPopSound();
    setSelectedLeft(id);

    // If right was already selected, check match
    if (selectedRight) {
      evaluateMatch(id, selectedRight);
    }
  };

  const handleSelectRight = (id: string) => {
    if (disabled || matchedIds.includes(id)) return;
    playTapPopSound();
    setSelectedRight(id);

    // If left was already selected, check match
    if (selectedLeft) {
      evaluateMatch(selectedLeft, id);
    }
  };

  const evaluateMatch = (leftId: string, rightId: string) => {
    if (leftId === rightId) {
      // Match!
      playCorrectSound();
      const nextMatched = [...matchedIds, leftId];
      setMatchedIds(nextMatched);
      setSelectedLeft(null);
      setSelectedRight(null);

      if (nextMatched.length === pairs.length) {
        onMatchComplete(true);
      }
    } else {
      // Mismatch!
      playWrongSound();
      setMismatchPair({ left: leftId, right: rightId });
      setTimeout(() => {
        setMismatchPair(null);
        setSelectedLeft(null);
        setSelectedRight(null);
      }, 500);
    }
  };

  return (
    <div className="flex flex-col gap-2.5 sm:gap-3.5 w-full select-none">
      {/* Step Counter */}
      <div className="flex items-center justify-between px-2 font-display text-xs font-bold text-white/60 tracking-wider">
        <span className="uppercase text-[11px] font-black text-cyan-400/90">Connect Pairs</span>
        <span className="font-mono text-cyan-300 font-black">
          {matchedIds.length} / {pairs.length} matched
        </span>
      </div>

      {/* Two Column Grid */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5 w-full">
        {/* Left Column (Code / Technical Terms) */}
        <div className="flex flex-col gap-2 sm:gap-2.5">
          {leftItems.map((item) => {
            const isMatched = matchedIds.includes(item.id);
            const isSelected = selectedLeft === item.id;
            const isMismatch = mismatchPair?.left === item.id;

            return (
              <motion.button
                key={item.id}
                type="button"
                disabled={disabled || isMatched}
                animate={isMismatch ? { x: [-4, 4, -4, 4, 0] } : {}}
                transition={{ duration: 0.3 }}
                onClick={() => handleSelectLeft(item.id)}
                className={cn(
                  "w-full min-h-[46px] sm:min-h-[52px] px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl border-2 border-b-[4px] text-left font-mono font-black text-xs sm:text-sm",
                  "transition-all duration-150 cursor-pointer touch-manipulation select-none active:translate-y-[2px] active:border-b-[2px] hover:scale-[1.02]",
                  isMatched &&
                    "opacity-45 bg-emerald-500/10 border-emerald-500/30 border-b-emerald-600/40 text-emerald-300 shadow-none cursor-default active:translate-y-0 active:border-b-[4px] hover:scale-100",
                  isSelected && !isMatched &&
                    "bg-gradient-to-r from-cyan-500/30 to-teal-500/20 border-cyan-400 border-b-cyan-500 text-white shadow-[0_0_22px_rgba(6,182,212,0.4)] ring-2 ring-cyan-400/50 scale-[1.02]",
                  isMismatch &&
                    "bg-rose-500/20 border-rose-400 border-b-rose-500 text-rose-200 shadow-[0_0_20px_rgba(244,63,94,0.3)] ring-2 ring-rose-400/40",
                  !isSelected && !isMatched && !isMismatch &&
                    "bg-[#0d1527] border-slate-700/80 border-b-slate-900 text-cyan-200 hover:border-cyan-400 hover:bg-[#111c35] hover:text-white shadow-md",
                )}
              >
                {item.text}
              </motion.button>
            );
          })}
        </div>

        {/* Right Column (Explanations & Definitions) */}
        <div className="flex flex-col gap-2 sm:gap-2.5">
          {rightItems.map((item) => {
            const isMatched = matchedIds.includes(item.id);
            const isSelected = selectedRight === item.id;
            const isMismatch = mismatchPair?.right === item.id;

            return (
              <motion.button
                key={item.id}
                type="button"
                disabled={disabled || isMatched}
                animate={isMismatch ? { x: [-4, 4, -4, 4, 0] } : {}}
                transition={{ duration: 0.3 }}
                onClick={() => handleSelectRight(item.id)}
                className={cn(
                  "w-full min-h-[46px] sm:min-h-[52px] px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl border-2 border-b-[4px] text-left font-display font-bold text-xs sm:text-sm leading-snug",
                  "transition-all duration-150 cursor-pointer touch-manipulation select-none active:translate-y-[2px] active:border-b-[2px] hover:scale-[1.02]",
                  isMatched &&
                    "opacity-45 bg-emerald-500/10 border-emerald-500/30 border-b-emerald-600/40 text-emerald-300 shadow-none cursor-default active:translate-y-0 active:border-b-[4px] hover:scale-100",
                  isSelected && !isMatched &&
                    "bg-gradient-to-r from-purple-500/30 to-pink-500/20 border-purple-400 border-b-purple-500 text-white shadow-[0_0_22px_rgba(168,85,247,0.4)] ring-2 ring-purple-400/50 scale-[1.02]",
                  isMismatch &&
                    "bg-rose-500/20 border-rose-400 border-b-rose-500 text-rose-200 shadow-[0_0_20px_rgba(244,63,94,0.3)] ring-2 ring-rose-400/40",
                  !isSelected && !isMatched && !isMismatch &&
                    "bg-[#0d1527] border-slate-700/80 border-b-slate-900 text-white/95 hover:border-purple-400 hover:bg-[#111c35] hover:text-white shadow-md",
                )}
              >
                {item.text}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
