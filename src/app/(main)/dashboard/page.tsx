import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getAllCareers, getCareerBySlug } from "@/lib/curriculum/queries";
import { getGamificationProfile } from "@/lib/gamification/queries";
import { getUserSkillsMastery } from "@/lib/mastery/queries";
import { getDailyQuests } from "@/lib/quests/daily";
import { getModuleCompletionCounts } from "@/lib/progress/queries";
import { getCompletedLessonIds } from "@/lib/progress/queries";
import { getNextLesson } from "@/lib/curriculum/navigation";

import { ContinueQuest } from "@/components/galaxy/continue-quest";
import { DashboardClientWrapper } from "./DashboardClientWrapper";

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

  const today = new Date();
  const todayStart = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const dailyChallenge = await prisma.dailyChallenge.findUnique({
    where: {
      userId_date: { userId: session.user.id, date: todayStart },
    },
    select: { completedAt: true },
  });
  const dailyChallengeStatus: "pending" | "in_progress" | "completed" =
    !dailyChallenge
      ? "pending"
      : dailyChallenge.completedAt
        ? "completed"
        : "in_progress";

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

  // Compute next quest inline using already-fetched careers data to avoid duplicate DB queries
  const completedLessonIds = await getCompletedLessonIds(session.user.id);
  const completedSet = new Set(completedLessonIds);

  let nextQuest: {
    careerSlug: string;
    careerTitle: string;
    pathSlug: string;
    pathTitle: string;
    moduleSlug: string;
    moduleTitle: string;
    lessonId: string;
    lessonSlug: string;
    lessonTitle: string;
    href: string;
    completedCount: number;
    totalCount: number;
  } | null = null;

  for (const career of careers) {
    if (!career) continue;

    for (const path of career.paths) {
      const allLessons = path.modules.flatMap((mod) =>
        mod.units.flatMap((unit) => unit.lessons),
      );
      const totalCount = allLessons.length;
      const completedCount = allLessons.filter((lesson) =>
        completedSet.has(lesson.id),
      ).length;

      for (const mod of path.modules) {
        const next = getNextLesson(
          mod.units.map((unit) => ({
            id: unit.id,
            order: unit.order,
            lessons: unit.lessons.map((lesson) => ({
              id: lesson.id,
              order: lesson.order,
              title: lesson.title,
              slug: lesson.slug,
              estimatedMinutes: lesson.estimatedMinutes,
            })),
          })),
          completedSet,
        );
        if (!next) continue;

        const lesson = mod.units
          .flatMap((unit) => unit.lessons)
          .find((l) => l.id === next.id);
        if (!lesson) continue;

        nextQuest = {
          careerSlug: career.slug,
          careerTitle: career.title,
          pathSlug: path.slug,
          pathTitle: path.title,
          moduleSlug: mod.slug,
          moduleTitle: mod.title,
          lessonId: lesson.id,
          lessonSlug: lesson.slug,
          lessonTitle: lesson.title,
          href: `/learn/${path.slug}/${mod.slug}/${lesson.slug}`,
          completedCount,
          totalCount,
        };
        break;
      }
      if (nextQuest) break;
    }
    if (nextQuest) break;
  }

  const topSkills = skills
    .filter((s) => s.mastery.totalAttempts > 0)
    .sort((a, b) => b.mastery.score - a.mastery.score)
    .slice(0, 4);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 min-h-0">
      {/* Continue Your Quest — next mission across the galaxy */}
      {nextQuest && <ContinueQuest quest={nextQuest} />}

      <DashboardClientWrapper
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
        dailyChallengeStatus={dailyChallengeStatus}
      />
    </div>
  );
}
