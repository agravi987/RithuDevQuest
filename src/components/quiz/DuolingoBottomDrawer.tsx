"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, XCircle, Sparkles } from "lucide-react";
import { DuoButton } from "./duo-button";
import { cn } from "@/lib/utils";

export type BottomDrawerState = "neutral" | "correct" | "incorrect";

export interface DuolingoBottomDrawerProps {
  state: BottomDrawerState;
  canCheck: boolean;
  onCheck: () => void;
  onSkip?: () => void;
  onContinue: () => void;
  correctAnswer?: string;
  explanation?: string;
  xpEarned?: number;
  combo?: number;
  isEvaluating?: boolean;
}

const PRAISE_LIST = ["Nicely done!", "Spot on!", "Brilliant!", "Superb!", "Cosmic Genius!"];

export function DuolingoBottomDrawer({
  state,
  canCheck,
  onCheck,
  onSkip,
  onContinue,
  correctAnswer,
  explanation,
  xpEarned = 10,
  combo = 0,
  isEvaluating = false,
}: DuolingoBottomDrawerProps) {
  // Pick random praise on correct state
  const praise = React.useMemo(() => {
    if (state === "correct") {
      return PRAISE_LIST[Math.floor(Math.random() * PRAISE_LIST.length)];
    }
    return PRAISE_LIST[0];
  }, [state]);


  // Global Enter key listener
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.key === "Enter") {
        e.preventDefault();
        if (state === "neutral" && canCheck && !isEvaluating) {
          onCheck();
        } else if (state === "correct" || state === "incorrect") {
          onContinue();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [state, canCheck, isEvaluating, onCheck, onContinue]);

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40 w-full select-none transition-colors duration-200",
        state === "neutral" && "bg-[#070913]/95 backdrop-blur-md border-t border-white/10",
        state === "correct" &&
          "bg-[#064e3b]/95 backdrop-blur-xl border-t border-emerald-500/40 shadow-[0_-12px_36px_rgba(16,185,129,0.25)]",
        state === "incorrect" &&
          "bg-[#4c0519]/95 backdrop-blur-xl border-t border-rose-500/40 shadow-[0_-12px_36px_rgba(244,63,94,0.25)]",
      )}
      style={{
        paddingBottom: "max(env(safe-area-inset-bottom), 16px)",
      }}
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3.5 sm:py-5">
        <AnimatePresence mode="wait">
          {/* ── 1. NEUTRAL STATE ── */}
          {state === "neutral" && (
            <motion.div
              key="drawer-neutral"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-between gap-4 w-full"
            >
              {onSkip ? (
                <button
                  type="button"
                  onClick={onSkip}
                  className="px-4 py-2 text-sm font-bold uppercase tracking-wider text-white/40 hover:text-white/80 active:translate-y-0.5 transition-all cursor-pointer"
                >
                  Skip
                </button>
              ) : (
                <div />
              )}

              <DuoButton
                variant="primary"
                size="lg"
                disabled={!canCheck || isEvaluating}
                onClick={onCheck}
                className="w-full sm:w-auto sm:min-w-[160px]"
              >
                {isEvaluating ? "Checking..." : "Check"}
              </DuoButton>
            </motion.div>
          )}

          {/* ── 2. CORRECT STATE (Emerald Banner) ── */}
          {state === "correct" && (
            <motion.div
              key="drawer-correct"
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 24, opacity: 0 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full"
            >
              {/* Left Content */}
              <div className="flex items-center gap-3.5">
                <div className="grid size-11 sm:size-12 shrink-0 place-items-center rounded-2xl bg-emerald-500 text-emerald-950 shadow-lg shadow-emerald-500/30">
                  <CheckCircle2 className="size-7 stroke-[2.5]" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
                      {praise}
                    </h3>
                    {xpEarned > 0 && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-400/20 border border-emerald-400/30 text-xs font-black text-emerald-300">
                        <Sparkles className="size-3" /> +{xpEarned} XP
                      </span>
                    )}
                    {combo >= 2 && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-xs font-black text-amber-300 animate-pulse">
                        🔥 {combo} in a row!
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-emerald-200/70 font-medium">
                    Excellent work, Cadet!
                  </p>
                </div>
              </div>

              {/* Right Continue Button */}
              <DuoButton
                variant="primary"
                size="lg"
                autoFocus
                onClick={onContinue}
                className="w-full sm:w-auto sm:min-w-[170px]"
              >
                Continue
              </DuoButton>
            </motion.div>
          )}

          {/* ── 3. INCORRECT STATE (Supernova Crimson Banner) ── */}
          {state === "incorrect" && (
            <motion.div
              key="drawer-incorrect"
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 24, opacity: 0 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 w-full"
            >
              {/* Left Content */}
              <div className="flex items-start gap-3.5 flex-1 min-w-0">
                <div className="grid size-11 sm:size-12 shrink-0 place-items-center rounded-2xl bg-rose-500 text-white shadow-lg shadow-rose-500/30 mt-0.5">
                  <XCircle className="size-7 stroke-[2.5]" />
                </div>
                <div className="flex-1 min-w-0 pr-2">
                  <h3 className="text-base sm:text-lg font-black text-rose-200 tracking-tight mb-1">
                    Correct solution:
                  </h3>
                  {correctAnswer && (
                    <div className="font-mono text-sm sm:text-base font-bold text-white bg-black/40 px-3 py-1.5 rounded-xl border border-rose-500/30 inline-block mb-1.5 break-all">
                      {correctAnswer}
                    </div>
                  )}
                  {explanation && (
                    <p className="text-xs sm:text-sm text-rose-200/70 leading-snug">
                      {explanation}
                    </p>
                  )}
                </div>
              </div>

              {/* Right Got It Button */}
              <DuoButton
                variant="danger"
                size="lg"
                autoFocus
                onClick={onContinue}
                className="w-full sm:w-auto sm:min-w-[160px] self-end sm:self-center"
              >
                Got It
              </DuoButton>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
