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
        "flex flex-row items-start gap-3 sm:gap-4 w-full select-none",
        className,
      )}
    >
      {/* Animated Vector Character */}
      <CosmicCharacter
        characterId={characterId}
        mood={mood}
        size="sm"
        className="shrink-0 mt-1"
      />

      {/* Speech Bubble Container with Pointer */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 6 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 350, damping: 28 }}
        className="relative flex-1 w-full min-w-0"
      >
        {/* Left-pointing Speech Arrow */}
        <div className="absolute -left-2 top-4 w-0 h-0 border-t-[7px] border-t-transparent border-b-[7px] border-b-transparent border-r-[8px] border-r-white/15" />
        <div className="absolute -left-1.5 top-4 w-0 h-0 border-t-[7px] border-t-transparent border-b-[7px] border-b-transparent border-r-[8px] border-r-[#0b1022]" />

        {/* Bubble Box */}
        <div className="rounded-2xl border-2 border-white/15 bg-[#0b1022]/95 backdrop-blur-md p-3.5 sm:p-4 shadow-xl shadow-cyan-950/20 ring-1 ring-white/5">
          {/* Character Name + Role Badge */}
          <div className="flex items-center gap-2 mb-1">
            <span
              className={cn(
                "text-[10px] uppercase font-black px-2 py-0.5 rounded-full border tracking-wider",
                meta.badgeBg,
              )}
            >
              {meta.name}
            </span>
            <span className="text-[11px] text-white/50 font-semibold truncate">
              {meta.title}
            </span>
          </div>

          {/* Prompt Message */}
          <p className="text-sm sm:text-base md:text-lg font-black text-white tracking-tight leading-snug">
            {message}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
