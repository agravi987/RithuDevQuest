"use client";

import { Award } from "lucide-react";
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
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-[#0c1329]/90 via-[#0a1024]/80 to-[#0c1329]/90 p-5 sm:p-6 backdrop-blur-xl shadow-2xl">
      {/* Decorative ambient corner glow */}
      <div className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-emerald-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -left-16 -bottom-16 size-48 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
        {/* Left: Mascot Greeting */}
        <div className="flex items-center gap-4">
          <div className="relative size-14 sm:size-16 shrink-0 flex items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-1 shadow-lg shadow-emerald-500/10">
            <CosmicCharacter characterId="rithu" mood="happy_jump" size="custom" className="size-11 sm:size-12" />
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

        {/* Right: Sleek Rank & Mission Level Pill */}
        <div className="flex items-center gap-3 shrink-0 self-start md:self-center">
          <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 backdrop-blur-md shadow-lg shadow-emerald-500/5">
            <div className="grid size-9 place-items-center rounded-xl bg-emerald-500 text-slate-950 font-black text-sm">
              <Award className="size-5" />
            </div>
            <div className="leading-tight">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-emerald-300">Level {profile.user.level}</span>
                <span className="text-[10px] font-bold text-slate-400">•</span>
                <span className="text-[11px] font-bold text-emerald-400/90 whitespace-nowrap">
                  {profile.user.levelTitle}
                </span>
              </div>
              <p className="text-[10px] font-semibold text-slate-400 mt-0.5">
                {profile.user.xp.toLocaleString()} Stardust XP
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}