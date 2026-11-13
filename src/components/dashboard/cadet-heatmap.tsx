"use client";

import * as React from "react";
import { Sparkles, Calendar, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CadetHeatmapProps {
  currentStreak?: number;
  totalXp?: number;
  className?: string;
}

export function CadetHeatmap({
  currentStreak = 0,
  className,
}: CadetHeatmapProps) {
  // Generate the last 126 days (18 weeks) of activity slots
  const days = React.useMemo(() => {
    const slots: Array<{
      date: Date;
      dateStr: string;
      level: number;
      count: number;
    }> = [];
    const today = new Date();

    for (let i = 125; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);

      // Seed pseudo-activity based on streak & date for visual immersion
      let level = 0;
      let count = 0;

      if (i < currentStreak) {
        level = (i % 3) + 2; // Level 2, 3, or 4 for active streak days
        count = level * 2;
      } else if (i === 0 && currentStreak > 0) {
        level = 3;
        count = 5;
      } else if ((d.getDay() === 1 || d.getDay() === 3 || d.getDay() === 5) && (i % 7 < 4)) {
        level = 1;
        count = 1;
      }

      slots.push({
        date: d,
        dateStr: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        level,
        count,
      });
    }
    return slots;
  }, [currentStreak]);

  const activeDaysCount = days.filter((d) => d.level > 0).length;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border border-white/10 bg-[#0d1527]/90 p-5 sm:p-6 backdrop-blur-xl shadow-xl select-none",
        className,
      )}
    >
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="grid size-8 place-items-center rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
            <Calendar className="size-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-white">
              Cadet Orbit Activity Calendar
            </h3>
            <p className="text-[11px] font-semibold text-slate-400">
              {activeDaysCount} active mission days recorded in the last 18 weeks
            </p>
          </div>
        </div>

        {currentStreak > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-black text-amber-300">
            <Flame className="size-3.5 text-amber-400 fill-amber-400" />
            <span>{currentStreak} Day Streak Active 🔥</span>
          </div>
        )}
      </div>

      {/* Grid: 18 columns (weeks) x 7 rows (days of week) with weekday labels */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-hide">
        {/* Weekday indicator labels */}
        <div className="grid grid-rows-7 gap-1.5 text-[9px] font-mono font-bold text-slate-500 select-none pr-1 shrink-0">
          <span className="h-3.5 flex items-center">Mon</span>
          <span className="h-3.5 flex items-center opacity-0">Tue</span>
          <span className="h-3.5 flex items-center">Wed</span>
          <span className="h-3.5 flex items-center opacity-0">Thu</span>
          <span className="h-3.5 flex items-center">Fri</span>
          <span className="h-3.5 flex items-center opacity-0">Sat</span>
          <span className="h-3.5 flex items-center opacity-0">Sun</span>
        </div>

        {/* Heatmap Nodes */}
        <div className="grid grid-flow-col grid-rows-7 gap-1.5 w-max">
          {days.map((slot, idx) => {
            const isToday = idx === days.length - 1;
            return (
              <div
                key={slot.dateStr}
                title={`${slot.dateStr}: ${slot.count} quests completed`}
                className={cn(
                  "size-3.5 sm:size-4 rounded-[4px] transition-all cursor-pointer",
                  slot.level === 0 && "bg-slate-800/60 border border-slate-700/40 hover:border-slate-500",
                  slot.level === 1 && "bg-emerald-950 border border-emerald-800/60 hover:border-emerald-500",
                  slot.level === 2 && "bg-emerald-700/80 border border-emerald-600 hover:border-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.3)]",
                  slot.level === 3 && "bg-emerald-500 border border-emerald-400 hover:border-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.5)]",
                  slot.level >= 4 && "bg-emerald-400 border border-cyan-300 hover:border-white shadow-[0_0_14px_rgba(52,211,153,0.7)] scale-105",
                  isToday && "ring-2 ring-cyan-400 ring-offset-1 ring-offset-slate-950",
                )}
              />
            );
          })}
        </div>
      </div>

      {/* Bottom Legend */}
      <div className="flex items-center justify-between pt-3 mt-2 border-t border-white/5 text-[10px] font-mono text-slate-400">
        <span className="flex items-center gap-1">
          <Sparkles className="size-3 text-emerald-400" />
          <span>Keep your cosmic streak fueled</span>
        </span>
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500">Less</span>
          <span className="size-2.5 rounded-[2px] bg-slate-800/60 border border-slate-700/40" />
          <span className="size-2.5 rounded-[2px] bg-emerald-950 border border-emerald-800" />
          <span className="size-2.5 rounded-[2px] bg-emerald-700 border border-emerald-600" />
          <span className="size-2.5 rounded-[2px] bg-emerald-500 border border-emerald-400" />
          <span className="size-2.5 rounded-[2px] bg-emerald-400 border border-cyan-300" />
          <span className="text-slate-500">More</span>
        </div>
      </div>
    </div>
  );
}
