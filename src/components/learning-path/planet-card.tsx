"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Sparkles, Crown, ArrowRight, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getPathVisual } from "@/lib/career-metadata";

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

  return (
    <Link
      href={href}
      className="block group select-none"
      aria-label={`${title}: ${moduleCount} modules, ${lessonCount} lessons`}
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-3xl border-2 border-b-[6px] p-5 sm:p-7 transition-all duration-150",
          "duo-card-3d bg-[#0d1424]/95 backdrop-blur-md",
          isRecommended
            ? "border-emerald-500/70 shadow-[0_12px_32px_rgba(16,185,129,0.22)] ring-1 ring-emerald-500/30"
            : isComplete
              ? "border-emerald-500/30 hover:border-emerald-500/60 shadow-lg shadow-emerald-950/20"
              : "border-white/10 hover:border-white/20 hover:bg-[#111a30] shadow-lg shadow-black/40",
        )}
      >
        {/* Subtle Ambient Background Flare */}
        <div
          className={cn(
            "pointer-events-none absolute -right-16 -top-16 size-44 rounded-full blur-3xl opacity-20 transition-opacity duration-300 group-hover:opacity-40",
            style.glow,
          )}
        />

        {/* Top Header Row */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            {isRecommended && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/40 bg-emerald-500/20 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-300 shadow-sm animate-pulse">
                <span className="size-1.5 rounded-full bg-emerald-400" />
                Active Mission 🚀
              </span>
            )}
            {isComplete && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-500/20 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-amber-300 shadow-sm">
                <Crown className="size-3 text-amber-400" />
                Mastered
              </span>
            )}
            {!isComplete && isStarted && !isRecommended && (
              <span className="inline-flex items-center gap-1 rounded-full border border-cyan-400/30 bg-cyan-500/15 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-cyan-300">
                <Sparkles className="size-3 text-cyan-400" />
                In Progress
              </span>
            )}
            <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-bold text-slate-300">
              {lessonCount} lessons
            </span>
          </div>

          <span className="text-xs font-black tracking-wider text-slate-400">
            {moduleCount} {moduleCount === 1 ? "Module" : "Modules"}
          </span>
        </div>

        {/* Center: Sector Visual & Info */}
        <div className="flex items-start gap-4 sm:gap-5 mb-5">
          {/* Planet Sphere Icon */}
          <div className="relative shrink-0 mt-0.5">
            <div
              className={cn(
                "relative grid size-16 sm:size-18 place-items-center rounded-2xl border-2 border-b-4 bg-gradient-to-br shadow-xl transition-transform duration-200 group-hover:scale-105",
                style.planet,
                isRecommended ? "border-emerald-400/50" : "border-white/20",
              )}
            >
              <span className="text-3xl drop-shadow-md select-none">{style.emoji}</span>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/40 via-transparent to-white/20 pointer-events-none" />
            </div>

            {isComplete && (
              <div className="absolute -bottom-1 -right-1 grid size-6 place-items-center rounded-full bg-emerald-500 text-white shadow-md border-2 border-slate-900">
                <CheckCircle2 className="size-3.5" />
              </div>
            )}
          </div>

          {/* Sector Details */}
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-black uppercase tracking-wider text-emerald-400/90 mb-1">
              {style.subtitle}
            </p>
            <h3 className="text-lg sm:text-xl font-black text-white tracking-tight leading-snug group-hover:text-emerald-300 transition-colors">
              {title}
            </h3>
            {description && (
              <p className="text-xs text-slate-300/80 mt-1.5 line-clamp-2 leading-relaxed">
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Duolingo 3D Progress Bar */}
        <div className="mb-5 rounded-2xl border border-white/10 bg-black/40 p-3.5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
              Sector Mastery
            </span>
            <span className="text-xs font-black text-emerald-400">
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
                  ? "bg-gradient-to-r from-emerald-500 to-emerald-400"
                  : "bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400",
              )}
            >
              {/* Glossy top shine highlight strip */}
              <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/40 to-transparent" />
            </motion.div>
          </div>
        </div>

        {/* Duolingo 3D Bottom Action Button */}
        <div className="pt-1">
          <div
            className={cn(
              "flex items-center justify-center gap-2 w-full py-3 px-4 rounded-2xl font-black text-xs uppercase tracking-wider",
              "border-2 border-b-4 transition-all duration-75 select-none",
              isComplete
                ? "border-emerald-700 bg-emerald-600 text-white shadow-[0_4px_0_0_#047857] group-hover:bg-emerald-500"
                : isRecommended || isStarted
                  ? "border-cyan-600 bg-cyan-500 text-slate-950 shadow-[0_4px_0_0_#0891b2] group-hover:bg-cyan-400"
                  : "border-emerald-700 bg-emerald-600 text-white shadow-[0_4px_0_0_#047857] group-hover:bg-emerald-500",
            )}
          >
            <span>
              {isComplete
                ? "Review Sector"
                : isRecommended
                  ? "Continue Mission (+10 XP)"
                  : isStarted
                    ? "Resume Journey"
                    : "Enter World"}
            </span>
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  );
}

