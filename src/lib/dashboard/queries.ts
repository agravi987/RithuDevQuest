import "server-only";

import { unstable_cache } from "next/cache";

import { prisma } from "@/lib/db";
import {
  getCurriculumOverview,
  type CurriculumOverview,
} from "@/lib/curriculum/queries";
import { getCompletedLessonIds } from "@/lib/progress/queries";
import { getDailyQuests } from "@/lib/quests/daily";
import { getTopUserSkills } from "@/lib/mastery/queries";
import { calculateLevel } from "@/lib/gamification/levels";
import { isSameUtcDay } from "@/lib/gamification/streaks";
import { getNextLesson } from "@/lib/curriculum/navigation";
import type { NextQuest } from "@/lib/progress/getNextQuest";
import type {
  DashboardCareer,
  DashboardProfile,
  DashboardQuest,
  DashboardSkill,
  DailyChallengeStatus,
} from "./types";

export type DashboardData = {
  firstName: string;
  profile: DashboardProfile;
  careers: DashboardCareer[];
  skills: DashboardSkill[];
  dailyQuests: DashboardQuest[];
  dailyChallengeStatus: DailyChallengeStatus;
  nextQuest: NextQuest | null;
};

/**
 * Resolve the first available lesson across the whole learning galaxy while
 * iterating careers → paths → modules in order. Pure computation over the
 * already-fetched curriculum overview, no extra database calls.
 */
export function findNextQuest(
  overview: CurriculumOverview[],
  completed: Set<string>,
): NextQuest | null {
  for (const career of overview) {
    for (const path of career.paths) {
      const allLessons = path.modules.flatMap((mod) =>
        mod.units.flatMap((unit) => unit.lessons),
      );
      const totalCount = allLessons.length;
      const completedCount = allLessons.filter((lesson) =>
        completed.has(lesson.id),
      ).length;

      for (const mod of path.modules) {
        const next = getNextLesson(mod.units, completed);
        if (!next) continue;

        const lesson = mod.units
          .flatMap((unit) => unit.lessons)
          .find((l) => l.id === next.id);
        if (!lesson) continue;

        return {
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
      }
    }
  }

  return null;
}

function computeCareersData(
  overview: CurriculumOverview[],
  completed: Set<string>,
): DashboardCareer[] {
  return overview.map((career) => ({
    slug: career.slug,
    title: career.title,
    paths: career.paths.map((path) => {
      const modules = path.modules.map((mod) => {
        const moduleLessons = mod.units.flatMap((unit) => unit.lessons);
        const completedCount = moduleLessons.filter((lesson) =>
          completed.has(lesson.id),
        ).length;
        return {
          id: mod.id,
          title: mod.title,
          slug: mod.slug,
          icon: mod.icon ?? "BookOpen",
          completedCount,
          totalCount: moduleLessons.length,
        };
      });

      const totalLessons = modules.reduce((sum, m) => sum + m.totalCount, 0);
      const completedLessons = modules.reduce(
        (sum, m) => sum + m.completedCount,
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
        title: path.title,
        slug: path.slug,
        moduleCount: path.modules.length,
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
  }));
}

/** Static count of all achievement definitions — changes rarely, cache long. */
const getAllAchievementsCount = unstable_cache(
  async (): Promise<number> => prisma.achievement.count(),
  ["achievements-count"],
  { tags: ["achievements"], revalidate: 3600 },
);

/**
 * Everything the dashboard renders, gathered in a single parallel wave.
 * Completed lesson ids are the single source of truth for all progress math;
 * the curriculum snapshot and achievement count are cached, and the mastery
 * query only touches the user's own attempts.
 */
export async function getDashboardData(userId: string): Promise<DashboardData> {
  const today = new Date();
  const todayStart = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );

  const [
    user,
    streak,
    totalAchievementsCount,
    unlockedAchievementsCount,
    dailyQuests,
    dailyChallenge,
    overview,
    completedLessonIds,
    topSkills,
  ] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, xp: true, level: true },
    }),
    prisma.streak.findUnique({ where: { userId } }),
    getAllAchievementsCount(),
    prisma.userAchievement.count({ where: { userId } }),
    getDailyQuests(userId),
    prisma.dailyChallenge.findUnique({
      where: { userId_date: { userId, date: todayStart } },
      select: { completedAt: true },
    }),
    getCurriculumOverview(),
    getCompletedLessonIds(userId),
    getTopUserSkills(userId, 4),
  ]);

  const completed = new Set(completedLessonIds);
  const levelInfo = user ? calculateLevel(user.xp) : calculateLevel(0);
  const isActiveToday = streak?.lastActiveDate
    ? isSameUtcDay(streak.lastActiveDate, new Date())
    : false;

  const dailyChallengeStatus: DailyChallengeStatus = !dailyChallenge
    ? "pending"
    : dailyChallenge.completedAt
      ? "completed"
      : "in_progress";

  return {
    firstName: user?.name?.split(" ")[0] ?? "Adventurer",
    profile: {
      streak: {
        currentStreak: streak?.currentStreak ?? 0,
        isActiveToday,
      },
      user: {
        xp: user?.xp ?? 0,
        level: levelInfo.level,
        levelTitle: levelInfo.title,
      },
      stats: {
        completedLessonsCount: completedLessonIds.length,
        unlockedAchievementsCount,
        totalAchievementsCount,
      },
    },
    careers: computeCareersData(overview, completed),
    skills: topSkills.map((skill) => ({
      skillId: skill.skillId,
      skillName: skill.skillName,
      score: skill.mastery.score,
    })),
    dailyQuests: dailyQuests.map((quest) => ({
      id: quest.id,
      type: quest.type,
      title: quest.title,
      description: quest.description,
      target: quest.target,
      current: quest.current,
      completed: quest.completed,
      xpReward: quest.xpReward,
      icon: quest.icon,
    })),
    dailyChallengeStatus,
    nextQuest: findNextQuest(overview, completed),
  };
}

/**
 * Cached per-user dashboard payload. The 60s TTL keeps navigation snappy;
 * `updateQuestProgress` / `completeLesson` revalidate the tag so the next
 * visit after any mutation is fresh.
 */
export function getCachedDashboardData(userId: string): Promise<DashboardData> {
  return unstable_cache(
    async (id: string) => getDashboardData(id),
    ["dashboard", userId],
    { tags: [`dashboard:${userId}`], revalidate: 60 },
  )(userId);
}