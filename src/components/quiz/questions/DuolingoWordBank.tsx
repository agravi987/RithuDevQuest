"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import type { DuolingoWordBankPayload } from "../types";
import { playTapPopSound } from "@/lib/sounds";

export interface DuolingoWordBankProps {
  payload: DuolingoWordBankPayload;
  value: string; // space-separated placed tokens
  onChange: (value: string) => void;
  disabled?: boolean;
}

interface BankToken {
  id: string;
  text: string;
}

export function DuolingoWordBank({
  payload,
  value,
  onChange,
  disabled = false,
}: DuolingoWordBankProps) {
  // Combine tokens + distractors and shuffle once per payload change
  const allTokens = React.useMemo<BankToken[]>(() => {
    const list = [...payload.tokens, ...(payload.distractors ?? [])];
    // Deterministic or pseudorandom shuffle based on token IDs
    return [...list].sort((a, b) => a.id.localeCompare(b.id) * -1);
  }, [payload]);

  // Placed token IDs from the value string
  const [placedIds, setPlacedIds] = React.useState<string[]>([]);

  // Sync internal state when value is cleared externally
  React.useEffect(() => {
    if (!value || value.trim() === "") {
      setPlacedIds([]);
    }
  }, [value]);

  const emitValue = React.useCallback(
    (currentIds: string[]) => {
      const textList = currentIds
        .map((id) => allTokens.find((t) => t.id === id)?.text)
        .filter(Boolean) as string[];
      onChange(textList.join(" "));
    },
    [allTokens, onChange],
  );

  const handlePlaceToken = (token: BankToken) => {
    if (disabled || placedIds.includes(token.id)) return;
    playTapPopSound();
    const next = [...placedIds, token.id];
    setPlacedIds(next);
    emitValue(next);
  };

  const handleRecallToken = React.useCallback(
    (tokenId: string) => {
      if (disabled) return;
      playTapPopSound();
      const next = placedIds.filter((id) => id !== tokenId);
      setPlacedIds(next);
      emitValue(next);
    },
    [disabled, placedIds, emitValue],
  );

  // Keyboard support: Backspace recalls last token
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

      if (e.key === "Backspace" && placedIds.length > 0) {
        e.preventDefault();
        const lastId = placedIds[placedIds.length - 1];
        if (lastId) {
          handleRecallToken(lastId);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [placedIds, disabled, handleRecallToken]);


  return (
    <div className="flex flex-col gap-3 sm:gap-4 w-full select-none">
      {/* ── 1. Upper Target Drop Area ── */}
      <div className="min-h-[72px] sm:min-h-[82px] w-full p-2.5 sm:p-3 rounded-xl border-2 border-dashed border-white/20 bg-white/[0.02] flex flex-wrap items-center gap-2 content-start">
        {placedIds.length === 0 ? (
          <div className="w-full text-center py-3 text-xs sm:text-sm text-white/40 font-medium">
            Tap the command tokens below to assemble in order
          </div>
        ) : (
          <AnimatePresence>
            {placedIds.map((id) => {
              const token = allTokens.find((t) => t.id === id);
              if (!token) return null;

              return (
                <motion.button
                  key={id}
                  layout
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 450, damping: 30 }}
                  type="button"
                  disabled={disabled}
                  onClick={() => handleRecallToken(id)}
                  className={cn(
                    "px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl font-mono text-sm sm:text-base font-black",
                    "bg-cyan-500/25 border-2 border-b-[3px] border-cyan-400 border-b-cyan-500 text-cyan-100 shadow-md shadow-cyan-500/25",
                    "cursor-pointer hover:bg-cyan-500/35 active:translate-y-[1px] active:border-b-[2px] transition-all duration-75 select-none",
                    disabled && "cursor-not-allowed opacity-60",
                  )}
                  title="Click to remove"
                >
                  <span className="inline-flex items-center gap-1.5">
                    <span>{token.text}</span>
                    <span className="text-cyan-400/60 text-xs font-sans">✕</span>
                  </span>
                </motion.button>
              );
            })}
          </AnimatePresence>
        )}
      </div>

      {/* Subtle Divider */}
      <div className="h-px w-full bg-white/10" />

      {/* ── 2. Lower Word Bank Area with Zero-CLS Silhouettes ── */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
        {allTokens.map((token) => {
          const isPlaced = placedIds.includes(token.id);

          if (isPlaced) {
            return (
              <button
                key={token.id}
                type="button"
                disabled={disabled}
                onClick={() => handleRecallToken(token.id)}
                title="Click to remove from sequence"
                className={cn(
                  "min-h-[42px] sm:min-h-[46px] px-3.5 sm:px-4 py-2 rounded-xl font-mono text-sm sm:text-base font-black",
                  "border-2 border-dashed border-cyan-500/30 bg-cyan-950/20 text-cyan-400/50 hover:text-cyan-300 hover:border-cyan-400/50 select-none flex items-center justify-center cursor-pointer transition-colors",
                  disabled && "cursor-not-allowed opacity-50",
                )}
              >
                <span className="inline-flex items-center gap-1.5">
                  <span className="line-through decoration-cyan-400/30">{token.text}</span>
                  <span className="text-xs">↩</span>
                </span>
              </button>
            );
          }

          return (
            <button
              key={token.id}
              type="button"
              disabled={disabled}
              onClick={() => handlePlaceToken(token)}
              className={cn(
                "min-h-[42px] sm:min-h-[46px] px-3.5 sm:px-4 py-2 rounded-xl font-mono text-sm sm:text-base font-black",
                "bg-[#0d1527] border-2 border-b-[4px] border-slate-700/80 border-b-slate-900 text-white/95 shadow-md",
                "hover:border-cyan-400 hover:border-b-cyan-500 hover:bg-[#111c35] hover:text-white cursor-pointer select-none",
                "active:translate-y-[2px] active:border-b-[2px] transition-all duration-75 touch-manipulation",
                disabled && "cursor-not-allowed opacity-60",
              )}
            >
              {token.text}
            </button>
          );
        })}
      </div>
    </div>
  );
}
