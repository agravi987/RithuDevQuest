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
    <div className="flex flex-col gap-6 w-full select-none">
      {/* ── 1. Code / Sentence Block with Interactive Blank ── */}
      <div className="p-5 sm:p-7 rounded-2xl border border-white/10 bg-[#0c1022]/90 backdrop-blur-md">
        <div className="font-mono text-lg sm:text-xl flex flex-wrap items-center gap-2.5 leading-relaxed text-white">
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
                "inline-flex items-center gap-2 px-4 py-2 rounded-2xl font-mono text-base sm:text-lg font-black",
                "bg-cyan-500/25 border-2 border-b-[4px] border-cyan-400 border-b-cyan-500 text-cyan-100 shadow-md shadow-cyan-500/25",
                "cursor-pointer hover:bg-cyan-500/35 active:translate-y-[1px] active:border-b-[2px] transition-all duration-75",
                disabled && "cursor-not-allowed",
              )}
              title="Click to remove"
            >
              <span>{selectedOption}</span>
              <span className="text-cyan-400/80 hover:text-cyan-200 text-xs ml-1 font-sans font-bold">✕</span>
            </motion.button>
          ) : (
            <span className="inline-block min-w-[90px] sm:min-w-[120px] h-9 rounded-2xl border-2 border-dashed border-cyan-400/80 bg-cyan-500/15 animate-pulse" />
          )}

          <span>{parts.suffix}</span>
        </div>
      </div>

      {/* ── 2. Option Chips Below ── */}
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
        {options.map((option) => {
          const isSelected = selectedOption === option;

          return (
            <button
              key={option}
              type="button"
              disabled={disabled}
              onClick={() => (isSelected ? handleClearBlank() : handlePickOption(option))}
              className={cn(
                "min-h-[52px] px-6 py-3 rounded-2xl font-mono text-base sm:text-lg font-black",
                "border-2 border-b-[5px] transition-all duration-75 touch-manipulation cursor-pointer select-none",
                isSelected
                  ? "bg-cyan-500/25 border-cyan-400 border-b-cyan-500 text-cyan-100 shadow-[0_0_20px_rgba(6,182,212,0.35)] ring-2 ring-cyan-400/40"
                  : "bg-[#0d1527] border-slate-700/80 border-b-slate-900 text-white/95 hover:border-slate-500 hover:bg-[#111c35] hover:text-white shadow-lg",
                "active:translate-y-[2px] active:border-b-[2px]",
                disabled && "cursor-not-allowed opacity-60",
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
