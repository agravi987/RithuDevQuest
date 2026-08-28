import "server-only";

import { prisma } from "@/lib/db";
import { calculateLevel, type CalculatedLevel } from "@/lib/gamification/levels";
import { isSameUtcDay } from "@/lib/gamification/streaks";

export type UserAchievementItem = {
  id: string;
  condition: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  xpReward: number;
  unlocked: boolean;
  unlockedAt: Date | null;
};

export type GamificationProfile = {
  user: {
    id: string;
    name: string | null;
    email: string | null;
    xp: number;
    level: number;
  };
  levelInfo: CalculatedLevel;
  streak: {
    currentStreak: number;
    longestStreak: number;
    lastActiveDate: Date | null;
    isActiveToday: boolean;
  };
  stats: {
    completedLessonsCount: number;
    totalAchievementsCount: number;
    unlockedAchievementsCount: number;
  };
  achievements: UserAchievementItem[];
};

export async function getGamificationProfile(
  userId: string,
): Promise<GamificationProfile | null> {
  const [user, streak, userAchievements, allAchievements, completedLessonsCount] =
    await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true, email: true, xp: true, level: true },
      }),
      prisma.streak.findUnique({
        where: { userId },
      }),
      prisma.userAchievement.findMany({
        where: { userId },
        select: { achievementId: true, unlockedAt: true },
      }),
      prisma.achievement.findMany({
        orderBy: [{ category: "asc" }, { xpReward: "asc" }],
      }),
      prisma.userProgress.count({
        where: { userId, completed: true },
      }),
    ]);

  if (!user) return null;

  const levelInfo = calculateLevel(user.xp);
  const now = new Date();
  const isActiveToday = streak?.lastActiveDate
    ? isSameUtcDay(streak.lastActiveDate, now)
    : false;

  const unlockedMap = new Map(
    userAchievements.map((ua) => [ua.achievementId, ua.unlockedAt]),
  );

  const achievementsList: UserAchievementItem[] = allAchievements.map((ach) => ({
    id: ach.id,
    condition: ach.condition,
    title: ach.title,
    description: ach.description,
    icon: ach.icon,
    category: ach.category,
    xpReward: ach.xpReward,
    unlocked: unlockedMap.has(ach.id),
    unlockedAt: unlockedMap.get(ach.id) ?? null,
  }));

  return {
    user,
    levelInfo,
    streak: {
      currentStreak: streak?.currentStreak ?? 0,
      longestStreak: streak?.longestStreak ?? 0,
      lastActiveDate: streak?.lastActiveDate ?? null,
      isActiveToday,
    },
    stats: {
      completedLessonsCount,
      totalAchievementsCount: allAchievements.length,
      unlockedAchievementsCount: userAchievements.length,
    },
    achievements: achievementsList,
  };
}
