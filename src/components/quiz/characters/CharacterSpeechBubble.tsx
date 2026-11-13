"use client";

import * as React from "react";
import { motion } from "motion/react";
import { CosmicCharacter } from "./CosmicCharacter";
import type { CharacterId, CharacterMood } from "../types";
import { playCharacterVoice } from "@/lib/sounds";
import { cn } from "@/lib/utils";

export interface CharacterSpeechBubbleProps {
  characterId: CharacterId;
  mood?: CharacterMood;
  message: string;
  className?: string;
  disableVoice?: boolean;
}

const CHARACTER_META: Record<
  CharacterId,
  { name: string; title: string; color: string; badgeBg: string }
> = {
  rithu: {
    name: "Commander Rithu",
    title: "Mission Guide",
    color: "text-emerald-400",
    badgeBg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
  },
  orion: {
    name: "Dr. Orion",
    title: "Quantum Scientist",
    color: "text-sky-400",
    badgeBg: "bg-sky-500/10 border-sky-500/30 text-sky-300",
  },
  astra: {
    name: "Astra",
    title: "Cyber-Engineer",
    color: "text-cyan-400",
    badgeBg: "bg-cyan-500/10 border-cyan-500/30 text-cyan-300",
  },
  nova: {
    name: "Cadet Nova",
    title: "Star Pilot",
    color: "text-amber-400",
    badgeBg: "bg-amber-500/10 border-amber-500/30 text-amber-300",
  },
  vance: {
    name: "Captain Vance",
    title: "EVA Veteran",
    color: "text-slate-300",
    badgeBg: "bg-slate-500/10 border-slate-500/30 text-slate-300",
  },
  cosmo: {
    name: "Cosmo",
    title: "Recon Bot",
    color: "text-teal-400",
    badgeBg: "bg-teal-500/10 border-teal-500/30 text-teal-300",
  },
};

export function CharacterSpeechBubble({
  characterId,
  mood = "speaking",
  message,
  className,
  disableVoice = false,
}: CharacterSpeechBubbleProps) {
  const meta = CHARACTER_META[characterId] ?? CHARACTER_META.rithu;

  // Trigger vocal chirp on message change
  React.useEffect(() => {
    if (!disableVoice) {
      playCharacterVoice(characterId);
    }
  }, [message, characterId, disableVoice]);

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-5 w-full select-none",
        className,
      )}
    >
      {/* Animated Vector Character */}
      <CosmicCharacter
        characterId={characterId}
        mood={mood}
        size="md"
        className="shrink-0"
      />

      {/* Speech Bubble Container with Pointer */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 6 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 350, damping: 28 }}
        className="relative flex-1 w-full"
      >
        {/* Responsive Speech Bubble Arrow */}
        {/* Desktop Left-pointing Arrow */}
        <div className="hidden sm:block absolute -left-2.5 top-5 w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-r-[10px] border-r-white/10" />
        <div className="hidden sm:block absolute -left-2 top-5 w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-r-[10px] border-r-[#0c1022]" />

        {/* Mobile Top-pointing Arrow */}
        <div className="sm:hidden absolute left-1/2 -translate-x-1/2 -top-2.5 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[10px] border-b-white/10" />
        <div className="sm:hidden absolute left-1/2 -translate-x-1/2 -top-2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[10px] border-b-[#0c1022]" />

        {/* Bubble Box */}
        <div className="rounded-3xl border-2 border-white/15 bg-[#0b1022]/95 backdrop-blur-md p-5 sm:p-6 shadow-2xl shadow-cyan-950/20 ring-1 ring-white/5">
          {/* Character Name + Role Badge */}
          <div className="flex items-center gap-2 mb-2">
            <span
              className={cn(
                "text-[11px] uppercase font-black px-2.5 py-0.5 rounded-full border tracking-wider",
                meta.badgeBg,
              )}
            >
              {meta.name}
            </span>
            <span className="text-xs text-white/50 font-semibold">
              {meta.title}
            </span>
          </div>

          {/* Prompt Message */}
          <p className="text-lg sm:text-xl md:text-2xl font-black text-white tracking-tight leading-relaxed">
            {message}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
