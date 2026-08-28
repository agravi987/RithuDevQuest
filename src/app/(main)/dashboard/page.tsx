import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  Flame,
  Award,
  BookOpen,
  Terminal,
  Sparkles,
  Compass,
} from "lucide-react";

import { auth } from "@/lib/auth";
import { getCareerBySlug } from "@/lib/curriculum/queries";
import { getGamificationProfile } from "@/lib/gamification/queries";
import { LevelProgressCard } from "@/components/gamification/level-progress-card";
import { StreakCounter } from "@/components/gamification/streak-counter";
import { XPDisplay } from "@/components/gamification/xp-display";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const [career, profile] = await Promise.all([
    getCareerBySlug("devops"),
    getGamificationProfile(session.user.id),
  ]);

  const firstName = session.user.name?.split(" ")[0] ?? "Adventurer";
  const path = career?.paths[0];

  const totalLessons =
    path?.modules.reduce(
      (sum, m) =>
        sum + m.units.reduce((s, u) => s + u.lessons.length, 0),
      0,
    ) ?? 0;

  const completedCount = profile?.stats.completedLessonsCount ?? 0;
  const courseProgress =
    totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto pb-12">
      {/* Hero Welcome Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/15 via-background to-emerald-500/10 border-2 border-border/80 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-widest text-primary flex items-center gap-1">
                <Sparkles className="size-3.5" /> Daily Quest Mission
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              Ready to learn, {firstName}? 🚀
            </h1>
            <p className="text-sm text-muted-foreground max-w-xl">
              Keep your flame lit! Complete a 5-minute DevOps challenge to earn XP and level up your skills.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {profile && (
              <>
                <StreakCounter
                  streak={profile.streak.currentStreak}
                  isActiveToday={profile.streak.isActiveToday}
                />
                <XPDisplay xp={profile.user.xp} />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Level Progress & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Learning Roadmap Card + Quick Stats */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Continue Learning Roadmap Card */}
          {path && (
            <Card className="border-2 border-border/80 shadow-md overflow-hidden group hover:border-primary/50 transition-all">
              <CardContent className="p-6 flex flex-col gap-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="size-12 rounded-2xl bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-primary shadow-sm">
                      <Terminal className="size-6" />
                    </div>
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Current Roadmap
                      </span>
                      <h2 className="text-xl font-extrabold tracking-tight">
                        {path.title}
                      </h2>
                    </div>
                  </div>

                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                    {courseProgress}% Complete
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex justify-between text-xs font-semibold text-muted-foreground">
                    <span>{completedCount} of {totalLessons} lessons mastered</span>
                    <span>{path.modules.length} modules</span>
                  </div>
                  <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden border border-border/60">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${courseProgress}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <p className="text-xs text-muted-foreground">
                    Next up: Shell navigation, Docker containers & Kubernetes
                  </p>
                  <Button asChild className="rounded-xl font-bold gap-1.5 shadow-sm group-hover:bg-primary/90">
                    <Link href={`/learn/${path.slug}`}>
                      Continue Quest <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 3 Quick Action Tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link href="/learn" className="group">
              <Card className="h-full border-2 border-border hover:border-primary/40 hover:shadow-md transition-all">
                <CardContent className="p-4 flex flex-col gap-2">
                  <BookOpen className="size-5 text-primary" />
                  <h3 className="font-bold text-sm">Skill Tree</h3>
                  <p className="text-xs text-muted-foreground">Explore modules & topics roadmap</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/achievements" className="group">
              <Card className="h-full border-2 border-border hover:border-amber-500/40 hover:shadow-md transition-all">
                <CardContent className="p-4 flex flex-col gap-2">
                  <Award className="size-5 text-amber-500" />
                  <h3 className="font-bold text-sm">Badges & Quests</h3>
                  <p className="text-xs text-muted-foreground">
                    {profile?.stats.unlockedAchievementsCount ?? 0} unlocked
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/learn" className="group">
              <Card className="h-full border-2 border-border hover:border-emerald-500/40 hover:shadow-md transition-all">
                <CardContent className="p-4 flex flex-col gap-2">
                  <Compass className="size-5 text-emerald-500" />
                  <h3 className="font-bold text-sm">Practice Arena</h3>
                  <p className="text-xs text-muted-foreground">Reinforce weak skills with AI</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* Right Col: Level Progress Card & Streak Widget */}
        <div className="flex flex-col gap-6">
          {profile && <LevelProgressCard levelInfo={profile.levelInfo} />}

          {/* Daily Streak Card */}
          <Card className="border-2 border-border/80 shadow-md">
            <CardContent className="p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flame className="size-5 text-orange-500 fill-orange-500/20" />
                  <h3 className="font-bold text-sm">Daily Learning Streak</h3>
                </div>
                <span className="text-xs font-bold text-orange-600 dark:text-orange-400">
                  {profile?.streak.currentStreak ?? 0} Days
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {profile?.streak.isActiveToday
                  ? "🔥 Great job! You completed today's quest and kept your streak alive."
                  : "⚡ You haven't completed a lesson yet today. Practice now to keep your streak!"}
              </p>
              <div className="text-[11px] text-muted-foreground border-t border-border/40 pt-2 flex justify-between">
                <span>Longest Streak</span>
                <span className="font-bold text-foreground">
                  {profile?.streak.longestStreak ?? 0} days
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}