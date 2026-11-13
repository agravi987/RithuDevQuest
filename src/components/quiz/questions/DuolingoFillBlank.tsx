"use client";

import * as React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import type { DuolingoFillBlankPayload } from "../types";
import { playTapPopSound } from "@/lib/sounds";

export interface DuolingoFillBlankProps {
  payload: DuolingoFillBlankPayload;
  selectedOption: string | null;
  onSelect: (option: string | null) => void;
  disabled?: boolean;
}

export function DuolingoFillBlank({
  payload,
  selectedOption,
  onSelect,
  disabled = false,
}: DuolingoFillBlankProps) {
  const { promptWithBlank, options } = payload;

  // Split prompt by blank placeholder (e.g. "___" or "{{code}}")
  const parts = React.useMemo(() => {
    const splitRegex = /(?:_{2,}|\{\{[^}]+\}\})/g;
    const pieces = promptWithBlank.split(splitRegex);
    return {
      prefix: pieces[0] ?? "",
      suffix: pieces[1] ?? "",
    };
  }, [promptWithBlank]);

  const handlePickOption = (opt: string) => {
    if (disabled) return;
    playTapPopSound();
    onSelect(opt);
  };

  const handleClearBlank = () => {
    if (disabled) return;
    playTapPopSound();
    onSelect(null);
  };

  return (
    <div className="flex flex-col gap-3 sm:gap-4 w-full select-none">
      {/* ── 1. Code / Sentence Block with Interactive Blank ── */}
      <div className="p-4 sm:p-5 rounded-2xl border-2 border-cyan-500/25 bg-[#090e22]/95 backdrop-blur-md shadow-xl shadow-cyan-950/20">
        <div className="font-display font-bold text-base sm:text-lg flex flex-wrap items-center gap-2 leading-relaxed text-white">
          <span>{parts.prefix}</span>

          {/* Interactive Blank Slot */}
          {selectedOption ? (
            <motion.button
              type="button"
              layout
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={handleClearBlank}
              disabled={disabled}
              className={cn(
                "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-display font-black text-sm sm:text-base",
                "bg-gradient-to-r from-cyan-500/30 to-teal-500/25 border-2 border-b-[3px] border-cyan-400 border-b-cyan-500 text-cyan-100 shadow-[0_0_16px_rgba(6,182,212,0.35)]",
                "cursor-pointer hover:bg-cyan-500/40 active:translate-y-[1px] active:border-b-[2px] transition-all duration-75",
                disabled && "cursor-not-allowed",
              )}
              title="Click to remove"
            >
              <span>{selectedOption}</span>
              <span className="text-cyan-400 hover:text-cyan-200 text-xs ml-1 font-sans font-bold">✕</span>
            </motion.button>
          ) : (
            <span className="inline-block min-w-[75px] sm:min-w-[95px] h-8 rounded-xl border-2 border-dashed border-cyan-400/90 bg-cyan-500/20 animate-pulse shadow-[0_0_12px_rgba(6,182,212,0.3)]" />
          )}

          <span>{parts.suffix}</span>
        </div>
      </div>

      {/* ── 2. Option Chips Below ── */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
        {options.map((option) => {
          const isSelected = selectedOption === option;

          return (
            <button
              key={option}
              type="button"
              disabled={disabled}
              onClick={() => (isSelected ? handleClearBlank() : handlePickOption(option))}
              className={cn(
                "min-h-[44px] sm:min-h-[48px] px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl font-display font-bold text-sm sm:text-base",
                "border-2 border-b-[4px] transition-all duration-150 touch-manipulation cursor-pointer select-none hover:scale-105 active:scale-95",
                isSelected
                  ? "bg-cyan-500/25 border-cyan-400 border-b-cyan-500 text-cyan-100 shadow-[0_0_18px_rgba(6,182,212,0.35)] ring-2 ring-cyan-400/40 scale-105"
                  : "bg-[#0d1527] border-slate-700/80 border-b-slate-900 text-white/95 hover:border-cyan-400 hover:bg-[#111c35] hover:text-white shadow-md",
                "active:translate-y-[2px] active:border-b-[2px]",
                disabled && "cursor-not-allowed opacity-60 hover:scale-100",
              )}
            >
              <span className="inline-flex items-center gap-2">
                <span>{option}</span>
                {isSelected && (
                  <span className="grid size-4 place-items-center rounded-full bg-cyan-400 text-slate-950 text-[10px] font-black">
                    ✓
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
