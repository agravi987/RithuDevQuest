"use client";

import * as React from "react";
import { Check, X, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DuolingoTrueFalsePayload } from "../types";
import { playTapPopSound } from "@/lib/sounds";
import { FormattedText } from "../FormattedText";

export interface DuolingoTrueFalseProps {
  payload: DuolingoTrueFalsePayload;
  selectedValue: boolean | null;
  onSelect: (val: boolean) => void;
  disabled?: boolean;
}

export function DuolingoTrueFalse({
  payload,
  selectedValue,
  onSelect,
  disabled = false,
}: DuolingoTrueFalseProps) {
  // Keyboard listeners: [1] for True, [2] for False
  React.useEffect(() => {
    if (disabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.key === "1") {
        e.preventDefault();
        playTapPopSound();
        onSelect(true);
      } else if (e.key === "2") {
        e.preventDefault();
        playTapPopSound();
        onSelect(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [disabled, onSelect]);

  const handleChoose = (val: boolean) => {
    if (disabled) return;
    playTapPopSound();
    onSelect(val);
  };

  return (
    <div className="flex flex-col gap-3 sm:gap-4 w-full select-none">
      {/* Statement Box with Terminal Vibe */}
      <div className="p-4 sm:p-5 rounded-2xl border-2 border-cyan-500/30 bg-[#090e22]/95 backdrop-blur-md text-center shadow-xl shadow-cyan-950/30 ring-1 ring-cyan-500/10">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[10px] font-black uppercase tracking-wider text-cyan-300 mb-2">
          <Terminal className="size-3 text-cyan-400" />
          <span>Statement Under Review</span>
        </div>
        <p className="font-display text-base sm:text-lg md:text-xl font-extrabold text-white leading-relaxed drop-shadow-[0_2px_12px_rgba(6,182,212,0.25)]">
          &ldquo;<FormattedText text={payload.statement} />&rdquo;
        </p>
      </div>

      {/* 2 Balanced 3D Cards */}
      <div className="grid grid-cols-2 gap-3 w-full">
        {/* TRUE CARD */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => handleChoose(true)}
          className={cn(
            "relative flex flex-col items-center justify-center gap-2 p-3.5 sm:p-5 rounded-2xl border-2 border-b-[4px] text-center",
            "cursor-pointer touch-manipulation transition-all duration-150 select-none hover:scale-[1.02]",
            selectedValue === true
              ? "bg-gradient-to-b from-emerald-500/25 to-teal-500/20 border-emerald-400 border-b-emerald-500 text-white shadow-[0_0_28px_rgba(16,185,129,0.4)] ring-2 ring-emerald-400/40"
              : "bg-[#0d1527] border-slate-700/80 border-b-slate-900 text-white/90 hover:border-emerald-500/60 hover:bg-[#111c35] shadow-md",
            "active:translate-y-[2px] active:border-b-[2px]",
            disabled && "cursor-not-allowed opacity-60 hover:scale-100",
          )}
        >
          <div className="absolute top-2.5 left-2.5 px-1.5 py-0.5 rounded border border-white/15 bg-white/5 font-mono text-[10px] font-black text-white/50">
            [1]
          </div>
          <div
            className={cn(
              "grid size-10 sm:size-12 place-items-center rounded-xl transition-all shadow-inner",
              selectedValue === true
                ? "bg-emerald-500 text-emerald-950 shadow-md shadow-emerald-500/40 scale-105"
                : "bg-emerald-500/15 text-emerald-400",
            )}
          >
            <Check className="size-6 sm:size-7 stroke-[3.5]" />
          </div>
          <span className="font-display text-base sm:text-lg font-black tracking-wider text-emerald-300">TRUE</span>
        </button>

        {/* FALSE CARD */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => handleChoose(false)}
          className={cn(
            "relative flex flex-col items-center justify-center gap-2 p-3.5 sm:p-5 rounded-2xl border-2 border-b-[4px] text-center",
            "cursor-pointer touch-manipulation transition-all duration-150 select-none hover:scale-[1.02]",
            selectedValue === false
              ? "bg-gradient-to-b from-rose-500/25 to-pink-500/20 border-rose-400 border-b-rose-500 text-white shadow-[0_0_28px_rgba(244,63,94,0.4)] ring-2 ring-rose-400/40"
              : "bg-[#0d1527] border-slate-700/80 border-b-slate-900 text-white/90 hover:border-rose-500/60 hover:bg-[#111c35] shadow-md",
            "active:translate-y-[2px] active:border-b-[2px]",
            disabled && "cursor-not-allowed opacity-60 hover:scale-100",
          )}
        >
          <div className="absolute top-2.5 left-2.5 px-1.5 py-0.5 rounded border border-white/15 bg-white/5 font-mono text-[10px] font-black text-white/50">
            [2]
          </div>
          <div
            className={cn(
              "grid size-10 sm:size-12 place-items-center rounded-xl transition-all shadow-inner",
              selectedValue === false
                ? "bg-rose-500 text-rose-950 shadow-md shadow-rose-500/40 scale-105"
                : "bg-rose-500/15 text-rose-400",
            )}
          >
            <X className="size-6 sm:size-7 stroke-[3.5]" />
          </div>
          <span className="font-display text-base sm:text-lg font-black tracking-wider text-rose-300">FALSE</span>
        </button>
      </div>
    </div>
  );
}
