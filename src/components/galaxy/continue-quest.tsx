"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Rocket, Sparkles } from "lucide-react";

import type { NextQuest } from "@/lib/progress/getNextQuest";
import { getPlanetForCareer } from "@/lib/galaxy-assets";
import { PlanetVisual } from "@/components/galaxy/planet-visual";
import { SpaceshipPlayer } from "@/components/galaxy/spaceship-player";

type ContinueQuestProps = {
  quest: NextQuest;
};

/**
 * The learner's single next mission across the galaxy. Deep-links straight
 * into the next available lesson so users can jump back in immediately.
 */
export function ContinueQuest({ quest }: ContinueQuestProps) {
  const planet = getPlanetForCareer(quest.careerSlug);
  const progress =
    quest.totalCount > 0
      ? Math.round((quest.completedCount / quest.totalCount) * 100)
      : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 220, damping: 20 }}
      className="relative overflow-hidden rounded-3xl border-2 border-primary/20 bg-gradient-to-br from-primary/10 via-card to-emerald-500/10 p-4 sm:p-6"
    >
      {/* Nebula glow */}
      <div className="pointer-events-none absolute -right-12 -top-12 size-40 rounded-full bg-primary/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-10 size-40 rounded-full bg-emerald-500/10 blur-3xl" />

      <div className="relative z-10 flex items-center gap-4 sm:gap-6">
        {/* Destination planet */}
        <div className="relative shrink-0">
          <PlanetVisual
            src={planet.src}
            alt={planet.alt}
            size={88}
            orbit
            orbitDouble
            glow
            float
          />
          <div className="absolute -bottom-2 -left-5">
            <SpaceshipPlayer size={30} state="current" direction="right" />
          </div>
        </div>

        {/* Details */}
        <div className="min-w-0 flex-1">
          <p
            className={`mb-1 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest ${planet.accent}`}
          >
            <Sparkles className="size-3 text-amber-400" />
            Next Mission · {quest.pathTitle}
          </p>
          <h2 className="truncate text-lg sm:text-xl font-black tracking-tight">
            {quest.lessonTitle}
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground truncate">
            {quest.careerTitle} · {quest.moduleTitle}
          </p>

          {/* Progress */}
          <div className="mt-3 flex items-center gap-2">
            <div className="h-1.5 flex-1 max-w-[220px] overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-amber-400 transition-all duration-1000"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="shrink-0 text-[10px] font-bold text-muted-foreground">
              {quest.completedCount}/{quest.totalCount} stars · {progress}%
            </span>
          </div>
        </div>

        {/* CTA */}
        <Link
          href={quest.href}
          className="group inline-flex shrink-0 flex-col items-center gap-1 rounded-2xl bg-primary px-4 py-3 text-primary-foreground shadow-xl shadow-primary/25 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/40 hover:brightness-110 hover:scale-[1.03] active:scale-[0.97] btn-glow"
        >
          <span className="inline-flex items-center gap-1.5 text-sm font-black">
            <Rocket className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:-rotate-12" />
            Continue Quest
          </span>
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </motion.div>
  );
}
