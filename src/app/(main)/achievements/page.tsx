import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Star, Flame, BookOpen, Zap, Shield, Sparkles } from "lucide-react";

import { auth } from "@/lib/auth";
import { getGamificationProfile } from "@/lib/gamification/queries";
import { AchievementCard } from "@/components/gamification/achievement-card";
import { CosmicCharacter } from "@/components/quiz/characters/CosmicCharacter";

export const metadata: Metadata = {
  title: "Achievements",
};

const categoryConfig: Record<string, { label: string; icon: React.ReactNode; color: string; emoji: string; badgeBg: string }> = {
  streak: { label: "Streaks", icon: <Flame className="size-4" />, color: "text-amber-400", emoji: "🔥", badgeBg: "bg-amber-500/15 border-amber-500/30 text-amber-400" },
  learning: { label: "Learning Missions", icon: <BookOpen className="size-4" />, color: "text-emerald-400", emoji: "📚", badgeBg: "bg-emerald-500/15 border-emerald-500/30 text-emerald-400" },
  mastery: { label: "Skill Mastery", icon: <Zap className="size-4" />, color: "text-cyan-400", emoji: "⚡", badgeBg: "bg-cyan-500/15 border-cyan-500/30 text-cyan-400" },
  special: { label: "Galactic Milestones", icon: <Star className="size-4" />, color: "text-purple-400", emoji: "✨", badgeBg: "bg-purple-500/15 border-purple-500/30 text-purple-400" },
  general: { label: "Officer Badges", icon: <Shield className="size-4" />, color: "text-blue-400", emoji: "🛡️", badgeBg: "bg-blue-500/15 border-blue-500/30 text-blue-400" },
};

export default async function AchievementsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const profile = await getGamificationProfile(session.user.id);
  if (!profile) {
    redirect("/login");
  }

  const unlockedCount = profile.stats.unlockedAchievementsCount;
  const totalCount = profile.stats.totalAchievementsCount;
  const completionPercentage = totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0;

  const categories = new Map<string, typeof profile.achievements>();
  for (const ach of profile.achievements) {
    const cat = ach.category || "general";
    if (!categories.has(cat)) categories.set(cat, []);
    categories.get(cat)!.push(ach);
  }

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto pb-16">
      {/* ═══ DUOLINGO 3D HERO: HALL OF BADGES ═══ */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-amber-400/30 border-b-[8px] border-b-amber-500/40 bg-card p-6 sm:p-8 shadow-2xl shadow-amber-500/5">
        <div className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-amber-500/10 blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 size-48 rounded-full bg-yellow-500/10 blur-[80px]" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left: Mascot & Headline */}
          <div className="flex items-center gap-5">
            <div className="relative shrink-0">
              <div className="relative size-20 sm:size-24 flex items-center justify-center rounded-3xl bg-amber-500/15 border-2 border-b-4 border-amber-500/40 shadow-lg shadow-amber-500/10">
                <CosmicCharacter
                  characterId="cosmo"
                  mood="celebrating"
                  size="custom"
                  className="size-16 sm:size-20"
                />
              </div>
              <span className="absolute -bottom-2 -right-2 flex size-7 items-center justify-center rounded-full bg-amber-400 text-slate-950 font-black text-xs shadow-md">
                🏆
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full border border-b-2 border-amber-400/40 bg-amber-400/15 text-amber-300 text-[10px] font-black uppercase tracking-wider">
                  <Sparkles className="size-3" />
                  Cosmic Hall of Fame
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                Trophies & Badges
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-md font-medium">
                Master programming concepts, maintain daily streaks, and unlock cosmic medals!
              </p>
            </div>
          </div>

          {/* Right: 3D Duolingo Stats Cards */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-center">
            {/* Unlocked Pill */}
            <div className="flex flex-col items-center rounded-2xl border-2 border-emerald-500/30 border-b-4 border-b-emerald-600 bg-emerald-500/10 px-5 py-3 min-w-[90px] shadow-sm">
              <span className="text-2xl font-black text-emerald-400">{unlockedCount}</span>
              <span className="text-[10px] font-black text-emerald-400/80 uppercase tracking-wider">Unlocked</span>
            </div>

            {/* Total Remaining Pill */}
            <div className="flex flex-col items-center rounded-2xl border-2 border-slate-700 border-b-4 border-b-slate-800 bg-slate-800/40 px-5 py-3 min-w-[90px] shadow-sm">
              <span className="text-2xl font-black text-foreground">{totalCount - unlockedCount}</span>
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">Locked</span>
            </div>

            {/* Completion Percentage */}
            <div className="flex flex-col items-center rounded-2xl border-2 border-amber-500/30 border-b-4 border-b-amber-600 bg-amber-500/10 px-5 py-3 min-w-[90px] shadow-sm">
              <span className="text-2xl font-black text-amber-400">{completionPercentage}%</span>
              <span className="text-[10px] font-black text-amber-400/80 uppercase tracking-wider">Mastery</span>
            </div>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="relative mt-6 pt-4 border-t border-border/50">
          <div className="flex items-center justify-between text-xs font-black mb-2">
            <span className="text-muted-foreground uppercase tracking-wider text-[11px]">Badge Collection Progress</span>
            <span className="text-amber-400">{unlockedCount} of {totalCount} Badges Acquired</span>
          </div>
          <div className="h-4 w-full overflow-hidden rounded-full bg-slate-800/80 p-0.5 border border-slate-700">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 shadow-sm transition-all duration-700"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* ═══ DUOLINGO BADGE SHELVES (BY CATEGORY) ═══ */}
      {Array.from(categories.entries()).map(([category, achievements]) => {
        const config = categoryConfig[category] ?? categoryConfig.general;
        const catUnlocked = achievements.filter((a) => a.unlocked).length;
        const catPercent = achievements.length > 0 ? Math.round((catUnlocked / achievements.length) * 100) : 0;

        return (
          <section key={category} className="flex flex-col gap-4">
            {/* Shelf Banner */}
            <div className="flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border-2 border-border/70 border-b-4 border-b-border bg-card/60">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{config.emoji}</span>
                <div>
                  <h2 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
                    {config.label}
                    <span className={`text-[11px] font-black px-2 py-0.5 rounded-full border border-b-2 ${config.badgeBg}`}>
                      {catUnlocked}/{achievements.length}
                    </span>
                  </h2>
                </div>
              </div>

              {/* Shelf Progress Pill */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-black text-muted-foreground hidden sm:inline">
                  {catPercent}%
                </span>
                <div className="h-2.5 w-24 sm:w-32 overflow-hidden rounded-full bg-slate-800 border border-slate-700/80">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-400 to-emerald-400 transition-all duration-500"
                    style={{ width: `${catPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* 3D Badges Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((achievement) => (
                <AchievementCard key={achievement.id} achievement={achievement} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
