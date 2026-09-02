"use client";

import { motion } from "motion/react";
import { Sparkles } from "lucide-react";
import { SpaceshipPlayer } from "@/components/galaxy/spaceship-player";
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
    <div className="text-center mb-10">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-2 rounded-full bg-foreground/5 border border-foreground/10 px-3 py-1.5 text-xs font-bold text-muted-foreground mb-4 backdrop-blur-sm"
      >
        <Sparkles className="size-3 text-amber-400" />
        {careerTitle}
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-3xl sm:text-4xl font-black tracking-tight mb-2 gradient-text-animated"
      >
        Explore Your Galaxy
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-sm text-muted-foreground mb-5"
      >
        Choose a sector and start your learning adventure
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, type: "spring" }}
        className="relative mb-5 inline-flex"
      >
        <SpaceshipPlayer size={48} state="current" label />
      </motion.div>

      <CareerPicker careers={careers} activeSlug={activeSlug} />
    </div>
  );
}
