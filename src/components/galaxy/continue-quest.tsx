"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Rocket, Sparkles, Clock, Zap, Flame } from "lucide-react";

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

  const remaining = quest.totalCount - quest.completedCount;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 220, damping: 20 }}
      className="relative overflow-hidden rounded-3xl border border-primary/25 bg-gradient-to-br from-[oklch(0.18_0.06_260)] via-[oklch(0.14_0.05_200)] to-[oklch(0.16_0.04_142)] p-5 sm:p-7 shadow-2xl shadow-primary/15 backdrop-blur-md"
    >
      {/* Deep space nebula glows */}
      <div className="pointer-events-none absolute -right-12 -top-12 size-48 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-10 size-48 rounded-full bg-emerald-500/15 blur-3xl" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-60 rounded-full bg-purple-500/8 blur-3xl" />
      {/* Star field dots */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ opacity: [0.2, 0.8, 0.2] }}
          transition={{ duration: 2 + i * 0.5, repeat: Infinity, delay: i * 0.3 }}
          className="absolute size-0.5 rounded-full bg-white/40"
          style={{ left: `${10 + (i * 12)}%`, top: `${15 + (i * 9) % 70}%` }}
        />
      ))}

      {/* Animated conic border — the active mission card */}
      <motion.div
        aria-hidden
        animate={{ rotate: 360 }}
        transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
        className="pointer-events-none absolute -inset-[1.5px] rounded-3xl"
        style={{
          background:
            "conic-gradient(from 0deg, rgba(52,211,153,0.6), rgba(34,211,238,0.6), rgba(251,191,36,0.6), rgba(52,211,153,0.6))",
          WebkitMask:
            "radial-gradient(farthest-side, transparent calc(100% - 1.5px), #000 calc(100% - 1px))",
          mask: "radial-gradient(farthest-side, transparent calc(100% - 1.5px), #000 calc(100% - 1px))",
        }}
      />

      {/* Top-right gamified chip */}
      <div className="pointer-events-none absolute right-4 top-4 z-20 flex items-center gap-2">
        <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-1 text-[10px] font-bold text-amber-400 backdrop-blur-sm">
          <Zap className="size-3" /> +25 XP
        </span>
        <span className="hidden sm:inline-flex items-center gap-1 rounded-full border border-orange-400/30 bg-orange-400/10 px-2.5 py-1 text-[10px] font-bold text-orange-400 backdrop-blur-sm">
          <Flame className="size-3" /> Streak
        </span>
      </div>

      <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
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
        <div className="min-w-0 flex-1 pt-10 sm:pt-0">
          <p
            className={`mb-1 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest ${planet.accent}`}
          >
            <Sparkles className="size-3 text-amber-400" />
            Next Mission · {quest.pathTitle}
          </p>
          <h2 className="truncate text-lg sm:text-xl font-black tracking-tight">
            {quest.lessonTitle}
          </h2>
          <p className="mt-0.5 text-xs text-white/40 truncate">
            {quest.careerTitle} · {quest.moduleTitle}
          </p>

          {/* Progress */}
          <div className="mt-3 flex items-center gap-2">
            <div className="h-1.5 flex-1 max-w-[220px] overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-amber-400 transition-all duration-1000"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="shrink-0 text-[10px] font-bold text-white/50">
              {quest.completedCount}/{quest.totalCount} lessons · {progress}%
            </span>
          </div>

          {/* Extra context */}
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-white/30">
            <span>{remaining > 0 ? `${remaining} lessons remaining` : "All lessons completed!"}</span>
            {progress > 0 && progress < 100 && (
              <span className="flex items-center gap-1">
                <Clock className="size-2.5" />
                ~{Math.ceil(remaining * 5)} min left
              </span>
            )}
          </div>
        </div>

        {/* CTA */}
        <Link
          href={quest.href}
          className="group inline-flex shrink-0 flex-col items-center gap-1.5 rounded-2xl bg-gradient-to-b from-primary via-primary to-emerald-600 px-5 py-3.5 text-primary-foreground shadow-xl shadow-primary/30 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/50 hover:brightness-110 hover:scale-[1.05] active:scale-[0.97] btn-glow sm:self-center"
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
