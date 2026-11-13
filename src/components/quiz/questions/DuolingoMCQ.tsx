"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { DuolingoMCQPayload } from "../types";
import { playTapPopSound } from "@/lib/sounds";

export interface DuolingoMCQProps {
  payload: DuolingoMCQPayload;
  selectedOptionId: string | null;
  onSelectOption: (optionId: string) => void;
  disabled?: boolean;
}

export function DuolingoMCQ({
  payload,
  selectedOptionId,
  onSelectOption,
  disabled = false,
}: DuolingoMCQProps) {
  const { options } = payload;

  // Keyboard shortcut listener: [1], [2], [3], [4]
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

      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= options.length) {
        e.preventDefault();
        const selected = options[num - 1];
        if (selected) {
          playTapPopSound();
          onSelectOption(selected.id);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [options, disabled, onSelectOption]);

  const handleSelect = (id: string) => {
    if (disabled) return;
    playTapPopSound();
    onSelectOption(id);
  };

  // Determine if options fit comfortably in a 2-column grid
  const isShortOptions = options.every((o) => (o.text?.length ?? 0) <= 65);
  const useGrid = isShortOptions && options.length >= 4;

  return (
    <div
      className={cn(
        "w-full select-none",
        useGrid
          ? "grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3"
          : "flex flex-col gap-2.5 sm:gap-3",
      )}
    >
      {options.map((option, index) => {
        const isSelected = selectedOptionId === option.id;
        const hotkey = index + 1;

        return (
          <button
            key={option.id}
            type="button"
            disabled={disabled}
            onClick={() => handleSelect(option.id)}
            className={cn(
              "group relative flex items-center justify-between w-full min-h-[52px] sm:min-h-[58px] px-4 sm:px-5 py-2.5 sm:py-3",
              "rounded-xl sm:rounded-2xl border-2 border-b-[4px] text-left cursor-pointer select-none",
              "transition-all duration-75 touch-manipulation",
              isSelected
                ? "bg-cyan-500/20 border-cyan-400 border-b-cyan-500 text-white shadow-[0_0_24px_rgba(6,182,212,0.3)] ring-2 ring-cyan-400/40"
                : "bg-[#0d1527] border-slate-700/80 border-b-slate-900 text-white/90 hover:border-slate-500 hover:bg-[#111c35] hover:text-white shadow-md",
              "active:translate-y-[2px] active:border-b-[2px]",
              disabled && "cursor-not-allowed opacity-60",
            )}
          >
            {/* Left Content: Option Text / Code */}
            <div className="flex items-center gap-2.5 sm:gap-3 flex-1 pr-2 min-w-0">
              {option.code ? (
                <code className="font-mono text-xs sm:text-sm font-bold text-cyan-200 bg-black/50 px-2.5 py-1 rounded-lg border border-cyan-500/30 tracking-tight break-all shadow-inner">
                  {option.text}
                </code>
              ) : (
                <span className="font-bold text-sm sm:text-base leading-snug line-clamp-2">
                  {option.text}
                </span>
              )}
            </div>

            {/* Right Badge: Keyboard Hotkey / Selected State */}
            <div
              className={cn(
                "grid size-7 sm:size-8 shrink-0 place-items-center rounded-xl border-2 text-xs font-black transition-all",
                isSelected
                  ? "border-cyan-400 bg-cyan-400 text-slate-950 shadow-md shadow-cyan-400/30 scale-105"
                  : "border-slate-700/80 bg-slate-800/80 text-slate-400 group-hover:border-slate-500 group-hover:text-white",
              )}
            >
              {isSelected ? "✓" : hotkey}
            </div>
          </button>
        );
      })}
    </div>
  );
}
