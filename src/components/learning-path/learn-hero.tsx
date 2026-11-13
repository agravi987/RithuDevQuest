"use client";

import { motion } from "motion/react";
import { Sparkles } from "lucide-react";
import { CosmicCharacter } from "@/components/quiz/characters/CosmicCharacter";
import { CareerPicker } from "@/components/learning-path/career-picker";

type CareerOption = {
  slug: string;
  title: string;
  progress?: number;
  pathCount?: number;
};

type LearnHeroProps = {
  careerTitle: string;
  careers: CareerOption[];
  activeSlug: string;
};

export function LearnHero({ careerTitle, careers, activeSlug }: LearnHeroProps) {
  return (
    <div className="flex flex-col items-center text-center mb-10 select-none">
      {/* Active Sector Pill */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-black uppercase tracking-wider text-emerald-300 mb-6 backdrop-blur-md shadow-sm"
      >
        <Sparkles className="size-3 text-emerald-400" />
        <span>Sector Track: {careerTitle}</span>
      </motion.div>

      {/* Mascot Greeting Stage */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-5 sm:gap-6 mb-8 max-w-2xl">
        {/* Commander Rithu Rig */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="shrink-0 flex flex-col items-center"
        >
          <div className="relative p-2 rounded-3xl border-2 border-b-4 border-emerald-500/30 bg-slate-900/60 shadow-[0_8px_24px_rgba(16,185,129,0.15)]">
            <CosmicCharacter
              characterId="rithu"
              mood="speaking"
              size="custom"
              className="size-20 sm:size-24"
            />
          </div>
          <span className="mt-2 text-[10px] font-black uppercase tracking-widest text-emerald-400">
            Commander Rithu
          </span>
        </motion.div>

        {/* Mascot Speech Bubble */}
        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="relative max-w-md rounded-2xl border-2 border-b-4 border-emerald-500/30 bg-[#0d1527]/95 p-4 text-left shadow-xl"
        >
          {/* Bubble Pointer Arrow (Left on desktop, Top on mobile) */}
          <div className="hidden sm:block absolute -left-2.5 top-1/2 -translate-y-1/2 size-0 border-y-8 border-y-transparent border-r-8 border-r-[#0d1527]" />
          <div className="sm:hidden absolute -top-2.5 left-1/2 -translate-x-1/2 size-0 border-x-8 border-x-transparent border-b-8 border-b-[#0d1527]" />

          <p className="text-xs sm:text-sm font-bold text-slate-200 leading-relaxed">
            Welcome to the <span className="text-emerald-400">Learning Galaxy</span>! Select your career track below and conquer each world one interactive mission at a time.
          </p>
        </motion.div>
      </div>

      {/* Main Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-2"
      >
        Explore Learning Worlds
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-sm sm:text-base text-slate-400 max-w-lg mb-8"
      >
        Bite-sized, gamified interactive paths designed for real-world engineering mastery.
      </motion.p>

      {/* 3D Career Selector Tabs */}
      <div className="w-full max-w-4xl">
        <CareerPicker careers={careers} activeSlug={activeSlug} />
      </div>
    </div>
  );
}

