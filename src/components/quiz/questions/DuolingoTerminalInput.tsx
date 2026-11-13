"use client";

import * as React from "react";
import { Terminal, CornerDownLeft, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DuolingoCommandPayload } from "../types";
import { playTapPopSound } from "@/lib/sounds";

export interface DuolingoTerminalInputProps {
  payload: DuolingoCommandPayload;
  value: string;
  onChange: (val: string) => void;
  onSubmit?: () => void;
  disabled?: boolean;
}

export function DuolingoTerminalInput({
  payload,
  value,
  onChange,
  onSubmit,
  disabled = false,
}: DuolingoTerminalInputProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Auto-focus the terminal on mount
  React.useEffect(() => {
    if (!disabled) {
      inputRef.current?.focus();
    }
  }, [disabled]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && value.trim().length > 0 && onSubmit) {
      e.preventDefault();
      onSubmit();
    }
  };

  const handleAddToken = (token: string) => {
    if (disabled) return;
    playTapPopSound();
    const trimmed = value.trim();
    const nextVal = trimmed ? `${trimmed} ${token}` : token;
    onChange(nextVal);
    inputRef.current?.focus();
  };

  const handleClear = () => {
    if (disabled) return;
    playTapPopSound();
    onChange("");
    inputRef.current?.focus();
  };

  return (
    <div className="flex flex-col gap-3.5 w-full select-none">
      {/* ── 1. Cosmic Terminal Window ── */}
      <div
        onClick={() => inputRef.current?.focus()}
        className={cn(
          "w-full rounded-2xl border-2 transition-all duration-200 overflow-hidden shadow-2xl cursor-text",
          "bg-[#070b1c]/95 border-cyan-500/30 shadow-cyan-950/30 backdrop-blur-md",
          "focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-400/40 focus-within:shadow-[0_0_30px_rgba(6,182,212,0.25)]",
        )}
      >
        {/* Terminal Header Bar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#0b122c] border-b border-white/10 select-none">
          <div className="flex items-center gap-2">
            <span className="size-3 rounded-full bg-rose-500/80 shadow-sm" />
            <span className="size-3 rounded-full bg-amber-500/80 shadow-sm" />
            <span className="size-3 rounded-full bg-emerald-500/80 shadow-sm" />
            <div className="flex items-center gap-1.5 ml-2 text-xs font-mono font-bold text-slate-300">
              <Terminal className="size-3.5 text-cyan-400" />
              <span>station-terminal ~ zsh</span>
            </div>
          </div>

          {value && !disabled && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              title="Clear command"
              className="flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-rose-400 transition-colors"
            >
              <X className="size-3" />
              <span>clear</span>
            </button>
          )}
        </div>

        {/* Command Line Input Area */}
        <div className="p-4 sm:p-5 flex items-center gap-2 font-mono text-base sm:text-lg">
          {/* Prompt prefix */}
          <span className="shrink-0 font-bold text-emerald-400 select-none">
            cadet@galaxy:<span className="text-cyan-400">~</span>$
          </span>

          {/* Interactive typing field */}
          <input
            ref={inputRef}
            type="text"
            value={value}
            disabled={disabled}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={payload.placeholder ?? "type command here..."}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            className={cn(
              "flex-1 bg-transparent border-none outline-none font-mono font-bold text-cyan-200 placeholder:text-slate-600 caret-cyan-400 tracking-tight",
              disabled && "cursor-not-allowed opacity-60",
            )}
          />

          {/* Hint icon */}
          <CornerDownLeft className="size-4 text-slate-600 shrink-0 select-none" />
        </div>
      </div>

      {/* ── 2. Quick Command Tokens (Optional tap assistants) ── */}
      {payload.quickTokens && payload.quickTokens.length > 0 && (
        <div className="flex flex-col gap-1.5 px-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400/80 flex items-center gap-1">
            <Sparkles className="size-3 text-cyan-400" />
            <span>Tap tokens to insert or type directly above:</span>
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {payload.quickTokens.map((token, i) => (
              <button
                key={i}
                type="button"
                disabled={disabled}
                onClick={() => handleAddToken(token)}
                className={cn(
                  "px-3 py-1.5 rounded-xl font-mono text-xs sm:text-sm font-bold",
                  "bg-[#0d1630] border-2 border-b-[3px] border-slate-700/80 text-cyan-300 shadow-sm",
                  "hover:border-cyan-400 hover:bg-[#121f45] hover:text-white active:translate-y-[1px] active:border-b-[2px] transition-all",
                  disabled && "cursor-not-allowed opacity-50",
                )}
              >
                {token}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
