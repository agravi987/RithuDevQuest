import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Trophy, Star, Flame, BookOpen, Zap, Shield } from "lucide-react";

import { auth } from "@/lib/auth";
import { getGamificationProfile } from "@/lib/gamification/queries";
import { AchievementCard } from "@/components/gamification/achievement-card";


export const metadata: Metadata = {
  title: "Achievements & Quests",
};

const categoryConfig: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  streak: { label: "Streaks", icon: <Flame className="size-4" />, color: "text-streak" },
  learning: { label: "Learning", icon: <BookOpen className="size-4" />, color: "text-primary" },
  mastery: { label: "Mastery", icon: <Zap className="size-4" />, color: "text-xp" },
  special: { label: "Special", icon: <Star className="size-4" />, color: "text-achievement" },
  general: { label: "General", icon: <Shield className="size-4" />, color: "text-level" },
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

  // Group achievements by category
  const categories = new Map<string, typeof profile.achievements>();
  for (const ach of profile.achievements) {
    const cat = ach.category || "general";
    if (!categories.has(cat)) categories.set(cat, []);
    categories.get(cat)!.push(ach);
  }

  // Progress ring calculation
  const circumference = 2 * Math.PI * 44;
  const strokeDashoffset = circumference - (completionPercentage / 100) * circumference;

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto pb-12">
      {/* Hero Header with Progress Ring */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-achievement/10 via-card to-xp/5 border-2 border-achievement/15 p-6 sm:p-8 noise-overlay">
        <div className="absolute -right-16 -top-16 size-48 rounded-full bg-achievement/5 blur-3xl" />
        <div className="absolute -bottom-12 -left-12 size-36 rounded-full bg-xp/5 blur-3xl" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
          {/* Progress Ring */}
          <div className="relative shrink-0">
            <svg width="100" height="100" viewBox="0 0 100 100" className="transform -rotate-90">
              {/* Background circle */}
              <circle
                cx="50" cy="50" r="44"
                fill="none"
                stroke="oklch(0.90 0.01 260 / 0.3)"
                strokeWidth="8"
              />
              {/* Progress circle */}
              <circle
                cx="50" cy="50" r="44"
                fill="none"
                stroke="url(#achievementGradient)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-1000"
              />
              <defs>
                <linearGradient id="achievementGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="oklch(0.78 0.15 300)" />
                  <stop offset="100%" stopColor="oklch(0.82 0.17 85)" />
                </linearGradient>
              </defs>
            </svg>
            {/* Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-black">{completionPercentage}%</span>
              <span className="text-[9px] font-bold text-muted-foreground">Complete</span>
            </div>
          </div>

          {/* Text content */}
          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center gap-2 justify-center sm:justify-start mb-1">
              <Trophy className="size-5 text-achievement" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-achievement">
                Hall of Badges
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Achievements & Quests
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Unlock badges, earn XP bonuses, and celebrate your technical mastery.
            </p>
          </div>

          {/* Stats */}
          <div className="flex gap-2 sm:gap-3">
            <div className="flex flex-col items-center rounded-2xl bg-primary/5 border border-primary/10 px-3 sm:px-4 py-2.5 sm:py-3">
              <span className="text-lg sm:text-xl font-black text-primary">{unlockedCount}</span>
              <span className="text-[8px] sm:text-[9px] font-bold text-muted-foreground">Unlocked</span>
            </div>
            <div className="flex flex-col items-center rounded-2xl bg-muted/50 border border-border px-3 sm:px-4 py-2.5 sm:py-3">
              <span className="text-lg sm:text-xl font-black">{totalCount - unlockedCount}</span>
              <span className="text-[8px] sm:text-[9px] font-bold text-muted-foreground">Remaining</span>
            </div>
          </div>
        </div>
      </div>

      {/* Categorized Achievement Sections */}
      {Array.from(categories.entries()).map(([category, achievements]) => {
        const config = categoryConfig[category] ?? categoryConfig.general;
        const catUnlocked = achievements.filter((a) => a.unlocked).length;

        return (
          <section key={category} className="flex flex-col gap-4">
            {/* Category header with glow */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 category-pill-glow rounded-full px-2 py-1">
                <span className={config.color}>{config.icon}</span>
                <h2 className="text-lg font-bold tracking-tight">{config.label}</h2>
                <span className="text-xs font-bold text-muted-foreground">
                  ({catUnlocked}/{achievements.length})
                </span>
              </div>
              {/* Mini progress bar with glow */}
              <div className="relative h-1.5 w-24 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-achievement to-xp transition-all duration-700 progress-animated"
                  style={{ width: `${achievements.length > 0 ? (catUnlocked / achievements.length) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Achievement cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
