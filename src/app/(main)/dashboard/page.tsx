import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { getAllCareers, getCareerBySlug } from "@/lib/curriculum/queries";
import { getGamificationProfile } from "@/lib/gamification/queries";
import { getUserSkillsMastery } from "@/lib/mastery/queries";
import { getDailyQuests } from "@/lib/quests/daily";
import { getModuleCompletionCounts } from "@/lib/progress/queries";
import { getNextQuest } from "@/lib/progress/getNextQuest";

import { DashboardClient } from "@/components/dashboard/dashboard-client";
import { ContinueQuest } from "@/components/galaxy/continue-quest";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const [careerList, profile, skills, dailyQuests] = await Promise.all([
    getAllCareers(),
    getGamificationProfile(session.user.id),
    getUserSkillsMastery(session.user.id),
    getDailyQuests(session.user.id),
  ]);

  const careers = await Promise.all(
    careerList.map(async (c) => {
      const deep = await getCareerBySlug(c.slug);
      return deep;
    }),
  );

  const allModuleIds = careers.flatMap((c) =>
    c ? c.paths.flatMap((p) => p.modules.map((m) => m.id)) : [],
  );
  const completionCounts = await getModuleCompletionCounts(
    session.user.id,
    allModuleIds,
  );

  const careersData = careers.flatMap((career) => {
    if (!career) return [];
    return [
      {
        slug: career.slug,
        title: career.title,
        paths: career.paths.map((p) => {
          const modules = p.modules.map((m) => ({
            id: m.id,
            title: m.title,
            slug: m.slug,
            icon: m.icon ?? "BookOpen",
            completedCount: completionCounts.get(m.id) ?? 0,
            totalCount: m.units.reduce((s, u) => s + u.lessons.length, 0),
          }));

          const totalLessons = modules.reduce((s, m) => s + m.totalCount, 0);
          const completedLessons = modules.reduce(
            (s, m) => s + m.completedCount,
            0,
          );
          const completedModules = modules.filter(
            (m) => m.totalCount > 0 && m.completedCount === m.totalCount,
          ).length;
          const courseProgress =
            totalLessons > 0
              ? Math.round((completedLessons / totalLessons) * 100)
              : 0;

          return {
            title: p.title,
            slug: p.slug,
            moduleCount: p.modules.length,
            totalLessons,
            completedLessons,
            courseProgress,
            completedModules,
            modules: modules.map((m) => ({
              id: m.id,
              title: m.title,
              slug: m.slug,
              icon: m.icon,
            })),
          };
        }),
      },
    ];
  });

  const firstName = session.user.name?.split(" ")[0] ?? "Adventurer";

  const nextQuest = await getNextQuest(session.user.id);

  const topSkills = skills
    .filter((s) => s.mastery.totalAttempts > 0)
    .sort((a, b) => b.mastery.score - a.mastery.score)
    .slice(0, 4);

  return (
    <div className="flex flex-col gap-5 min-h-0">
      {/* Continue Your Quest — next mission across the galaxy */}
      {nextQuest && <ContinueQuest quest={nextQuest} />}

      <DashboardClient
        firstName={firstName}
        profile={{
          streak: {
            currentStreak: profile?.streak.currentStreak ?? 0,
            isActiveToday: profile?.streak.isActiveToday ?? false,
          },
          user: {
            xp: profile?.user.xp ?? 0,
            level: profile?.levelInfo.level ?? 1,
            levelTitle: profile?.levelInfo.title ?? "Newcomer",
          },
          stats: {
            completedLessonsCount: profile?.stats.completedLessonsCount ?? 0,
            unlockedAchievementsCount:
              profile?.stats.unlockedAchievementsCount ?? 0,
            totalAchievementsCount: profile?.stats.totalAchievementsCount ?? 0,
          },
        }}
        careers={careersData}
        skills={topSkills.map((s) => ({
          skillId: s.skillId,
          skillName: s.skillName,
          score: s.mastery.score,
        }))}
        dailyQuests={dailyQuests.map((q) => ({
          id: q.id,
          type: q.type,
          title: q.title,
          description: q.description,
          target: q.target,
          current: q.current,
          completed: q.completed,
          xpReward: q.xpReward,
          icon: q.icon,
        }))}
      />
    </div>
  );
}
