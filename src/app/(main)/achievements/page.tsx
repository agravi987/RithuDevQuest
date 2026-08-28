import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Trophy, Award } from "lucide-react";

import { auth } from "@/lib/auth";
import { getGamificationProfile } from "@/lib/gamification/queries";
import { AchievementCard } from "@/components/gamification/achievement-card";
import { LevelBadge } from "@/components/gamification/level-badge";
import { StreakCounter } from "@/components/gamification/streak-counter";
import { XPDisplay } from "@/components/gamification/xp-display";

export const metadata: Metadata = {
  title: "Achievements & Quests",
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
  const completionPercentage =
    totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0;

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/15 via-background to-amber-500/10 border-2 border-border/80 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="size-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-lg border-2 border-white/40">
              <Trophy className="size-8 fill-white/20 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Hall of Badges
                </span>
                <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  {completionPercentage}% Complete
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Achievements & Quests
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Unlock badges, earn XP bonuses, and celebrate your technical mastery.
              </p>
            </div>
          </div>

          {/* Quick Stats Pill Group */}
          <div className="flex flex-wrap items-center gap-2.5">
            <StreakCounter
              streak={profile.streak.currentStreak}
              isActiveToday={profile.streak.isActiveToday}
            />
            <XPDisplay xp={profile.user.xp} />
            <LevelBadge level={profile.levelInfo.level} title={profile.levelInfo.title} showTitle />
          </div>
        </div>
      </div>

      {/* Progress Counter Summary */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Award className="size-5 text-primary" />
          <h2 className="text-lg font-bold tracking-tight">
            All Quests ({unlockedCount}/{totalCount})
          </h2>
        </div>
        <span className="text-xs font-semibold text-muted-foreground">
          {totalCount - unlockedCount} quests remaining
        </span>
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {profile.achievements.map((achievement) => (
          <AchievementCard key={achievement.id} achievement={achievement} />
        ))}
      </div>
    </div>
  );
}
