"use client";

import { Award, Flame, Zap } from "lucide-react";
import type { DashboardProfile } from "@/lib/dashboard/types";
import { CosmicCharacter } from "@/components/quiz/characters/CosmicCharacter";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function getGreetingEmoji(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "☀️";
  if (hour < 17) return "🌤️";
  return "🌙";
}

export function DashboardHero({
  firstName,
  profile,
}: {
  firstName: string;
  profile: DashboardProfile;
}) {
  const streakActive = profile.streak.isActiveToday;
  const streak = profile.streak.currentStreak;

  return (
    <div className="duo-card-3d relative overflow-hidden rounded-3xl border-2 border-white/10 bg-[#0d1527] p-5 sm:p-6 shadow-xl">
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left: Mascot Greeting */}
        <div className="flex items-center gap-4">
          <div className="relative size-14 sm:size-16 shrink-0 flex items-center justify-center rounded-2xl bg-emerald-500/10 border-2 border-emerald-500/30 p-1 shadow-inner">
            <CosmicCharacter characterId="rithu" mood="happy_jump" size="xs" className="size-full" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="rounded-lg bg-emerald-500/20 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-emerald-400">
                Mission Command
              </span>
              <span className="text-xs">{getGreetingEmoji()}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1">
              {getGreeting()}, {firstName}!
            </h1>
            <p className="text-xs sm:text-sm font-medium text-slate-300 mt-0.5 max-w-md">
              {streakActive
                ? `You're on a ${streak}-day streak! Keep up the momentum with today's quests.`
                : "Complete a lesson today to ignite your daily coding streak! 🔥"}
            </p>
          </div>
        </div>

        {/* Right: Duolingo 3D Stat Badges */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Streak */}
          <div className="flex items-center gap-2 rounded-2xl border-2 border-amber-500/30 bg-amber-500/10 px-3.5 py-2 shadow-[0_2px_0_0_#d97706]">
            <Flame className={`size-4 text-amber-400 ${streak > 0 ? "animate-bounce" : ""}`} />
            <div className="leading-tight">
              <p className="text-xs font-black text-amber-300">{streak} Days</p>
              <p className="text-[9px] font-black uppercase tracking-wider text-amber-400/80">Streak</p>
            </div>
          </div>

          {/* XP */}
          <div className="flex items-center gap-2 rounded-2xl border-2 border-cyan-500/30 bg-cyan-500/10 px-3.5 py-2 shadow-[0_2px_0_0_#0284c7]">
            <Zap className="size-4 text-cyan-400" />
            <div className="leading-tight">
              <p className="text-xs font-black text-cyan-300">{profile.user.xp.toLocaleString()}</p>
              <p className="text-[9px] font-black uppercase tracking-wider text-cyan-400/80">Stardust XP</p>
            </div>
          </div>

          {/* Level */}
          <div className="flex items-center gap-2 rounded-2xl border-2 border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2 shadow-[0_2px_0_0_#059669]">
            <Award className="size-4 text-emerald-400" />
            <div className="leading-tight">
              <p className="text-xs font-black text-emerald-300">Level {profile.user.level}</p>
              <p className="text-[9px] font-black uppercase tracking-wider text-emerald-400/80">{profile.user.levelTitle}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}