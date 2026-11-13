"use client";

import * as React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export interface CadetRankTierProps {
  level: number;
  xp: number;
  levelTitle: string;
  className?: string;
}

interface TierInfo {
  name: string;
  badge: string;
  minLevel: number;
  maxLevel: number;
  color: string;
  gradient: string;
  border: string;
}

const TIERS: TierInfo[] = [
  {
    name: "Novice Cadet",
    badge: "🚀",
    minLevel: 1,
    maxLevel: 5,
    color: "text-emerald-400",
    gradient: "from-emerald-500/20 to-teal-500/10",
    border: "border-emerald-500/30",
  },
  {
    name: "Orbital Engineer",
    badge: "🛰️",
    minLevel: 6,
    maxLevel: 12,
    color: "text-cyan-400",
    gradient: "from-cyan-500/20 to-sky-500/10",
    border: "border-cyan-500/30",
  },
  {
    name: "Deep Space Architect",
    badge: "🌌",
    minLevel: 13,
    maxLevel: 20,
    color: "text-purple-400",
    gradient: "from-purple-500/20 to-indigo-500/10",
    border: "border-purple-500/30",
  },
  {
    name: "Cosmic Grandmaster",
    badge: "👑",
    minLevel: 21,
    maxLevel: 999,
    color: "text-amber-400",
    gradient: "from-amber-500/20 to-yellow-500/10",
    border: "border-amber-500/30",
  },
];

export function CadetRankTier({
  level,
  xp,
  levelTitle,
  className,
}: CadetRankTierProps) {
  const currentTier =
    TIERS.find((t) => level >= t.minLevel && level <= t.maxLevel) ?? TIERS[0];

  const nextTier =
    TIERS.find((t) => t.minLevel > level) ?? null;

  // Calculate tier level progress
  const tierProgress = nextTier
    ? Math.min(
        100,
        Math.round(
          ((level - currentTier.minLevel) /
            (currentTier.maxLevel - currentTier.minLevel + 1)) *
            100,
        ),
      )
    : 100;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border bg-[#0d1527]/90 p-5 backdrop-blur-xl shadow-xl select-none",
        currentTier.border,
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "grid size-11 place-items-center rounded-2xl border bg-gradient-to-br shadow-lg text-2xl select-none",
              currentTier.border,
              currentTier.gradient,
            )}
          >
            <span>{currentTier.badge}</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                Cadet Standing
              </span>
              <span className="text-slate-600">•</span>
              <span className={cn("text-[11px] font-black uppercase", currentTier.color)}>
                Tier {TIERS.indexOf(currentTier) + 1}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-1.5">
              <span>{currentTier.name}</span>
              <span className="text-xs font-semibold text-slate-400">({levelTitle})</span>
            </h3>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs font-black text-emerald-400 font-mono">
            {xp.toLocaleString()} XP
          </span>
          <p className="text-[10px] font-bold text-slate-400">Total Stardust</p>
        </div>
      </div>

      {/* Progress towards next tier */}
      <div className="mt-3">
        <div className="flex items-center justify-between text-[11px] font-bold mb-1.5">
          <span className="text-slate-400">
            {nextTier ? `Path to ${nextTier.name}` : "Maximum Cosmic Rank Reached"}
          </span>
          <span className="text-cyan-300 font-mono">{tierProgress}%</span>
        </div>

        <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-800/80 border border-white/5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${tierProgress}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
          />
        </div>
      </div>
    </div>
  );
}
