"use server";

import "server-only";

import { prisma } from "@/lib/db";
import { calculateLevel, type CalculatedLevel } from "@/lib/gamification/levels";
import { evaluateStreakUpdate, type StreakTransition } from "@/lib/gamification/streaks";
import { evaluateNewAchievements } from "@/lib/gamification/achievements";
import { updateLeagueXp } from "@/lib/league/queries";

export type GamificationResult = {
  earnedXp: number;
  totalXp: number;
  previousLevel: number;
  currentLevel: CalculatedLevel;
  didLevelUp: boolean;
  streak: StreakTransition;
  newAchievements: {
    id: string;
    title: string;
    description: string;
    icon: string;
    xpReward: number;
  }[];
};

export async function processLessonGamification(
  userId: string,
  lessonScore: number,
  baseEarnedXp: number,
): Promise<GamificationResult> {
  const now = new Date();

  const [user, existingStreak, existingUserAchievements, allAchievements, completedLessonsCount] =
    await Promise.all([
      prisma.user.findUniqueOrThrow({
        where: { id: userId },
        select: { id: true, xp: true, level: true },
      }),
      prisma.streak.findUnique({
        where: { userId },
      }),
      prisma.userAchievement.findMany({
        where: { userId },
        include: { achievement: { select: { condition: true } } },
      }),
      prisma.achievement.findMany(),
      prisma.userProgress.count({
        where: { userId, completed: true },
      }),
    ]);

  const previousLevel = user.level;
  const previousXp = user.xp;

  // 1. Evaluate Streak
  const streakTransition = evaluateStreakUpdate(
    existingStreak?.lastActiveDate ?? null,
    existingStreak?.currentStreak ?? 0,
    existingStreak?.longestStreak ?? 0,
    now,
  );

  // 2. Base XP update and level
  let totalXp = previousXp + baseEarnedXp;
  let levelInfo = calculateLevel(totalXp);

  // 3. Evaluate Achievements
  const unlockedConditions = new Set(
    existingUserAchievements.map((ua) => ua.achievement.condition),
  );

  const newConditionKeys = evaluateNewAchievements({
    totalCompletedLessons: completedLessonsCount + 1, // count includes this current completion
    currentStreak: streakTransition.newStreak,
    currentLevel: levelInfo.level,
    totalXp,
    lessonScore,
    alreadyUnlockedConditions: unlockedConditions,
  });

  const newlyUnlockedAchievements: {
    id: string;
    title: string;
    description: string;
    icon: string;
    xpReward: number;
  }[] = [];

  let bonusAchievementXp = 0;

  for (const condition of newConditionKeys) {
    const ach = allAchievements.find((a) => a.condition === condition);
    if (ach) {
      newlyUnlockedAchievements.push({
        id: ach.id,
        title: ach.title,
        description: ach.description,
        icon: ach.icon,
        xpReward: ach.xpReward,
      });
      bonusAchievementXp += ach.xpReward;
    }
  }

  if (bonusAchievementXp > 0) {
    totalXp += bonusAchievementXp;
    levelInfo = calculateLevel(totalXp);
  }

  // 4. Persist in database
  await prisma.$transaction([
    // Update streak
    prisma.streak.upsert({
      where: { userId },
      create: {
        userId,
        currentStreak: streakTransition.newStreak,
        longestStreak: streakTransition.longestStreak,
        lastActiveDate: now,
      },
      update: {
        currentStreak: streakTransition.newStreak,
        longestStreak: streakTransition.longestStreak,
        lastActiveDate: now,
      },
    }),
    // Update user total XP and Level
    prisma.user.update({
      where: { id: userId },
      data: {
        xp: totalXp,
        level: levelInfo.level,
      },
    }),
    // Insert any new achievements
    ...newlyUnlockedAchievements.map((ach) =>
      prisma.userAchievement.create({
        data: {
          userId,
          achievementId: ach.id,
          unlockedAt: now,
        },
      }),
    ),
  ]);

  // Update league XP
  await updateLeagueXp(userId, baseEarnedXp + bonusAchievementXp);

  return {
    earnedXp: baseEarnedXp + bonusAchievementXp,
    totalXp,
    previousLevel,
    currentLevel: levelInfo,
    didLevelUp: levelInfo.level > previousLevel,
    streak: streakTransition,
    newAchievements: newlyUnlockedAchievements,
  };
}
