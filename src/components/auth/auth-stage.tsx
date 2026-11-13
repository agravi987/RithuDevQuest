"use client";

import * as React from "react";
import { motion } from "motion/react";
import { Sparkles } from "lucide-react";
import { CosmicCharacter } from "@/components/quiz/characters/CosmicCharacter";

type AuthStageProps = {
  title: string;
  description: string;
  mascotMessage: string;
  children: React.ReactNode;
};

export function AuthStage({
  title,
  description,
  mascotMessage,
  children,
}: AuthStageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="relative flex flex-col items-center w-full"
    >
      {/* Dynamic ambient cosmic backlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-6 rounded-[2.5rem] bg-gradient-to-tr from-emerald-500/20 via-cyan-500/15 to-purple-600/20 blur-3xl opacity-75"
      />

      {/* Commander Rithu Interactive Mascot Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="relative z-10 mb-4 flex items-center justify-center gap-3.5 px-4"
      >
        <div className="relative">
          <CosmicCharacter
            characterId="rithu"
            mood="speaking"
            size="sm"
            className="drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]"
          />
          <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] text-white shadow-md">
            ✨
          </span>
        </div>

        {/* Speech dialogue bubble */}
        <div className="relative rounded-2xl border-2 border-emerald-500/30 bg-[#0d152b]/95 px-4 py-2.5 shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
              Commander Rithu
            </span>
            <span className="text-[10px] text-emerald-300/60 font-semibold">
              · Mission Control
            </span>
          </div>
          <p className="text-xs sm:text-sm font-bold text-white tracking-tight">
            {mascotMessage}
          </p>
        </div>
      </motion.div>

      {/* Main Glass Command Panel */}
      <div className="relative w-full rounded-3xl border border-emerald-500/30 bg-[#090d20]/90 p-6 sm:p-9 shadow-2xl shadow-black/60 backdrop-blur-2xl ring-1 ring-white/10">
        <div className="mb-6 flex flex-col">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {title}
            </h1>
            <Sparkles className="size-5 text-emerald-400 animate-pulse" />
          </div>
          <p className="mt-1 text-sm sm:text-base text-slate-300/80 font-medium leading-relaxed">
            {description}
          </p>
        </div>

        <div>{children}</div>
      </div>
    </motion.div>
  );
}
