"use client";

import * as React from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DuolingoTrueFalsePayload } from "../types";
import { playTapPopSound } from "@/lib/sounds";

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
    <div className="flex flex-col gap-5 sm:gap-6 w-full select-none">
      {/* Statement Box */}
      <div className="p-6 sm:p-7 rounded-3xl border-2 border-cyan-500/20 bg-[#090e1f]/90 backdrop-blur-md text-center shadow-xl shadow-cyan-950/20">
        <span className="inline-block text-[10px] font-black uppercase tracking-wider text-cyan-400/80 mb-2">
          Statement Under Review
        </span>
        <p className="text-lg sm:text-2xl font-black text-white leading-relaxed">
          &ldquo;{payload.statement}&rdquo;
        </p>
      </div>

      {/* 2 Oversized 3D Cards */}
      <div className="grid grid-cols-2 gap-4 w-full">
        {/* TRUE CARD */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => handleChoose(true)}
          className={cn(
            "relative flex flex-col items-center justify-center gap-3 p-6 sm:p-8 rounded-3xl border-2 border-b-[6px] text-center",
            "cursor-pointer touch-manipulation transition-all duration-75 select-none",
            selectedValue === true
              ? "bg-emerald-500/20 border-emerald-400 border-b-emerald-500 text-white shadow-[0_0_28px_rgba(16,185,129,0.35)] ring-2 ring-emerald-400/40"
              : "bg-[#0d1527] border-slate-700/80 border-b-slate-900 text-white/90 hover:border-emerald-500/60 hover:bg-[#111c35] shadow-md",
            "active:translate-y-[2px] active:border-b-[3px]",
            disabled && "cursor-not-allowed opacity-60",
          )}
        >
          <div className="absolute top-3 left-3 px-2 py-0.5 rounded-lg border border-white/15 bg-white/5 text-[11px] font-black text-white/50">
            [1]
          </div>
          <div
            className={cn(
              "grid size-14 sm:size-16 place-items-center rounded-2xl transition-all shadow-inner",
              selectedValue === true
                ? "bg-emerald-500 text-emerald-950 shadow-lg shadow-emerald-500/40 scale-105"
                : "bg-emerald-500/15 text-emerald-400",
            )}
          >
            <Check className="size-8 sm:size-9 stroke-[3.5]" />
          </div>
          <span className="text-xl sm:text-2xl font-black tracking-wide">TRUE</span>
        </button>

        {/* FALSE CARD */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => handleChoose(false)}
          className={cn(
            "relative flex flex-col items-center justify-center gap-3 p-6 sm:p-8 rounded-3xl border-2 border-b-[6px] text-center",
            "cursor-pointer touch-manipulation transition-all duration-75 select-none",
            selectedValue === false
              ? "bg-rose-500/20 border-rose-400 border-b-rose-500 text-white shadow-[0_0_28px_rgba(244,63,94,0.35)] ring-2 ring-rose-400/40"
              : "bg-[#0d1527] border-slate-700/80 border-b-slate-900 text-white/90 hover:border-rose-500/60 hover:bg-[#111c35] shadow-md",
            "active:translate-y-[2px] active:border-b-[3px]",
            disabled && "cursor-not-allowed opacity-60",
          )}
        >
          <div className="absolute top-3 left-3 px-2 py-0.5 rounded-lg border border-white/15 bg-white/5 text-[11px] font-black text-white/50">
            [2]
          </div>
          <div
            className={cn(
              "grid size-14 sm:size-16 place-items-center rounded-2xl transition-all shadow-inner",
              selectedValue === false
                ? "bg-rose-500 text-white shadow-lg shadow-rose-500/40 scale-105"
                : "bg-rose-500/15 text-rose-400",
            )}
          >
            <X className="size-8 sm:size-9 stroke-[3.5]" />
          </div>
          <span className="text-xl sm:text-2xl font-black tracking-wide">FALSE</span>
        </button>
      </div>
    </div>
  );
}
