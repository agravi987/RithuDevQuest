"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { processLessonGamification } from "@/lib/gamification/actions";
import { getGamificationProfile } from "@/lib/gamification/queries";
import { updateQuestProgress } from "@/lib/quests/daily";
import { validateAcceptedAnswer } from "@/lib/quiz/validation";

export type PracticeResult = {
  success: boolean;
  isCorrect: boolean;
  xpEarned: number;
  totalXp: number;
  level: number;
  levelTitle: string;
  progressPercentage: number;
  xpToNextLevel: number;
  didLevelUp: boolean;
  newAchievements: {
    id: string;
    title: string;
    description: string;
    icon: string;
    xpReward: number;
  }[];
  streak: {
    currentStreak: number;
    longestStreak: number;
    status: "maintained" | "incremented" | "reset" | "started";
  };
  error?: string;
};

/**
 * Validate a practice answer server-side. The client only sends the raw
 * answer — correctness is computed here so users cannot claim XP for answers
 * they didn't actually give. Comparison is case-insensitive to match the
 * previous client-side behavior.
 */
function isPracticeAnswerCorrect(
  correctAnswer: string,
  userAnswer: string,
): boolean {
  return validateAcceptedAnswer(
    correctAnswer.toLowerCase(),
    (userAnswer ?? "").trim().toLowerCase(),
  );
}

const unauthedResult = (error: string): PracticeResult => ({
  success: false,
  isCorrect: false,
  xpEarned: 0,
  totalXp: 0,
  level: 1,
  levelTitle: "Newcomer",
  progressPercentage: 0,
  xpToNextLevel: 100,
  didLevelUp: false,
  newAchievements: [],
  streak: { currentStreak: 0, longestStreak: 0, status: "reset" },
  error,
});

async function buildCurrentProfileResult(
  userId: string,
  isCorrect: boolean,
): Promise<PracticeResult> {
  const profile = await getGamificationProfile(userId);
  if (!profile) {
    return unauthedResult("Could not load your profile");
  }

  const streakStatus =
    profile.streak.isActiveToday && profile.streak.currentStreak > 0
      ? "maintained"
      : "reset";

  return {
    success: true,
    isCorrect,
    xpEarned: 0,
    totalXp: profile.user.xp,
    level: profile.levelInfo.level,
    levelTitle: profile.levelInfo.title,
    progressPercentage: profile.levelInfo.progressPercentage,
    xpToNextLevel: profile.levelInfo.xpToNextLevel,
    didLevelUp: false,
    newAchievements: [],
    streak: {
      currentStreak: profile.streak.currentStreak,
      longestStreak: profile.streak.longestStreak,
      status: streakStatus,
    },
  };
}

export async function submitPracticeAnswer(
  topic: string,
  difficulty: "beginner" | "intermediate" | "advanced",
  questionType: "mcq" | "true_false" | "command",
  question: string,
  correctAnswer: string,
  userAnswer: string,
): Promise<PracticeResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return unauthedResult("Unauthorized");
    }

    if (!(userAnswer ?? "").trim()) {
      return unauthedResult("Please enter an answer");
    }

    const isCorrect = isPracticeAnswerCorrect(correctAnswer, userAnswer);
    const xpEarned = isCorrect ? 15 : 0;

    await prisma.practiceSession.create({
      data: {
        userId: session.user.id,
        topic,
        difficulty,
        questionType,
        question,
        correctAnswer,
        userAnswer,
        isCorrect,
        xpEarned,
      },
    });

    if (xpEarned > 0) {
      // A single practice answer must not count as a "perfect lesson" for the
      // achievement system — only an actual lesson completed with a 100% score
      // should unlock `perfect_lesson`. Pass a score of 0 (never 100).
      const gamification = await processLessonGamification(
        session.user.id,
        0,
        xpEarned,
      );

      await updateQuestProgress(session.user.id, "practice", 1);
      await updateQuestProgress(session.user.id, "earn_xp", xpEarned);
      // League XP is already credited inside processLessonGamification; do not
      // call updateLeagueXp again here or weekly XP gets double counted.

      return {
        success: true,
        isCorrect: true,
        xpEarned: gamification.earnedXp,
        totalXp: gamification.totalXp,
        level: gamification.currentLevel.level,
        levelTitle: gamification.currentLevel.title,
        progressPercentage: gamification.currentLevel.progressPercentage,
        xpToNextLevel: gamification.currentLevel.xpToNextLevel,
        didLevelUp: gamification.didLevelUp,
        newAchievements: gamification.newAchievements,
        streak: {
          currentStreak: gamification.streak.newStreak,
          longestStreak: gamification.streak.longestStreak,
          status: gamification.streak.status,
        },
      };
    }

    await updateQuestProgress(session.user.id, "practice", 1);

    return buildCurrentProfileResult(session.user.id, false);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to submit practice answer";
    console.error("[Practice Action Error]", err);
    return unauthedResult(message);
  }
}

export async function getPracticeHistory(userId: string, limit = 20) {
  return prisma.practiceSession.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}
