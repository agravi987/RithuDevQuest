"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Sparkles, Crown, ArrowRight, CheckCircle2, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { getPathVisual } from "@/lib/career-metadata";
import { playTapPopSound } from "@/lib/sounds";

export type PlanetCardProps = {
  slug: string;
  title: string;
  description: string | null;
  moduleCount: number;
  lessonCount: number;
  progress?: number;
  href: string;
  isRecommended?: boolean;
};

export function PlanetCard({
  slug,
  title,
  description,
  moduleCount,
  lessonCount,
  progress = 0,
  href,
  isRecommended = false,
}: PlanetCardProps) {
  const style = getPathVisual(slug);
  const isStarted = progress > 0;
  const isComplete = progress === 100;
  const xpReward = lessonCount * 10;

  return (
    <Link
      href={href}
      onClick={() => playTapPopSound()}
      className="block group select-none"
      aria-label={`${title}: ${moduleCount} modules, ${lessonCount} lessons, ${progress}% mastered`}
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-3xl border-2 border-b-[6px] p-6 sm:p-7",
          "transition-all duration-200 ease-out touch-manipulation",
          "bg-gradient-to-br from-[#0c1326]/95 via-[#090e1d]/90 to-[#0e162b]/95 backdrop-blur-xl",
          "group-hover:-translate-y-1.5",
          isRecommended
            ? "border-emerald-500/80 shadow-[0_16px_36px_rgba(16,185,129,0.22)] ring-1 ring-emerald-400/40"
            : isComplete
              ? "border-amber-500/50 hover:border-amber-400/80 shadow-xl shadow-amber-950/20"
              : "border-white/10 hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-950/30 shadow-lg shadow-black/50"
        )}
      >
        {/* Dynamic Themed Ambient Radial Flare */}
        <div
          className="pointer-events-none absolute -right-20 -top-20 size-56 rounded-full blur-3xl opacity-25 transition-opacity duration-300 group-hover:opacity-50"
          style={{ backgroundColor: style.color || "#06b6d4" }}
        />

        {/* Top Header Badges */}
        <div className="flex items-start justify-between gap-3 mb-5 relative z-10">
          <div className="flex items-center gap-2 flex-wrap">
            {isRecommended && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/50 bg-emerald-500/20 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-300 shadow-sm animate-pulse">
                <span className="size-1.5 rounded-full bg-emerald-400" />
                Active Mission 🚀
              </span>
            )}
            {isComplete && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/50 bg-amber-500/20 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-amber-300 shadow-sm">
                <Crown className="size-3 text-amber-400" />
                Mastered
              </span>
            )}
            {!isComplete && isStarted && !isRecommended && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/40 bg-cyan-500/15 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-cyan-300">
                <Sparkles className="size-3 text-cyan-400" />
                In Progress
              </span>
            )}
            <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-bold text-slate-300">
              <Zap className="size-3 text-amber-400" />
              +{xpReward} XP
            </span>
          </div>

          <span className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-black tracking-wider text-slate-300 uppercase">
            {moduleCount} {moduleCount === 1 ? "Module" : "Modules"}
          </span>
        </div>

        {/* Center: Planet Visual & Sector Info */}
        <div className="flex items-start gap-4 sm:gap-5 mb-5 relative z-10">
          {/* Planet Visual Rig */}
          <div className="relative shrink-0 mt-0.5">
            <div
              className={cn(
                "relative grid size-16 sm:size-20 place-items-center rounded-2xl border-2 border-b-4 bg-gradient-to-br shadow-xl",
                "transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3",
                style.planet,
                isRecommended ? "border-emerald-400/60" : "border-white/20"
              )}
            >
              <span className="text-3xl sm:text-4xl drop-shadow-lg select-none">{style.emoji}</span>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/40 via-transparent to-white/20 pointer-events-none" />
            </div>

            {isComplete && (
              <div className="absolute -bottom-1 -right-1 grid size-6 place-items-center rounded-full bg-emerald-500 text-slate-950 shadow-md border-2 border-slate-900 font-black">
                <CheckCircle2 className="size-3.5" />
              </div>
            )}
          </div>

          {/* Sector Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span
                className="text-[10px] font-black uppercase tracking-widest"
                style={{ color: style.color || "#34d399" }}
              >
                {style.subtitle || "Sector World"}
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-[10px] font-bold text-slate-400">
                {lessonCount} interactive missions
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug group-hover:text-emerald-300 transition-colors">
              {title}
            </h3>
            {description && (
              <p className="text-xs sm:text-sm text-slate-300/80 mt-1.5 line-clamp-2 leading-relaxed font-medium">
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Duolingo 3D Progress Bar */}
        <div className="mb-5 rounded-2xl border border-white/10 bg-black/50 p-3.5 relative z-10 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Sector Mastery
            </span>
            <span className="text-xs font-black text-emerald-400 tabular-nums">
              {progress}%
            </span>
          </div>

          {/* 3D Capsule Pill */}
          <div className="relative h-3.5 w-full overflow-hidden rounded-full border border-emerald-600/30 bg-slate-950 shadow-inner">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className={cn(
                "relative h-full rounded-full transition-all",
                isComplete
                  ? "bg-gradient-to-r from-emerald-500 to-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.5)]"
                  : "bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.5)]"
              )}
            >
              {/* Glossy top shine highlight strip */}
              <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/40 to-transparent" />
            </motion.div>
          </div>
        </div>

        {/* Duolingo 3D Bottom Action Button */}
        <div className="pt-1 relative z-10">
          <div
            className={cn(
              "flex items-center justify-center gap-2 w-full py-3.5 px-5 rounded-2xl font-black text-xs uppercase tracking-wider",
              "border-2 border-b-4 transition-all duration-75 select-none shadow-lg",
              isComplete
                ? "border-emerald-700 bg-emerald-600 text-white shadow-[0_4px_0_0_#047857] group-hover:bg-emerald-500"
                : isRecommended || isStarted
                  ? "border-cyan-600 bg-cyan-500 text-slate-950 shadow-[0_4px_0_0_#0891b2] group-hover:bg-cyan-400"
                  : "border-emerald-700 bg-emerald-600 text-white shadow-[0_4px_0_0_#047857] group-hover:bg-emerald-500"
            )}
          >
            <span>
              {isComplete
                ? "Review Sector 👑"
                : isRecommended
                  ? "Continue Mission (+10 XP)"
                  : isStarted
                    ? "Resume Journey 🚀"
                    : "Enter World 🪐"}
            </span>
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  );
}
