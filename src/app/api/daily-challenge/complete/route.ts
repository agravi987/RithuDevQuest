import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { processLessonGamification } from "@/lib/gamification/actions";
import { updateQuestProgress } from "@/lib/quests/daily";
import { STREAK_BONUS_XP, comboBonusFrom } from "@/lib/practice/xp";

const PERFECT_BONUS_XP = 50;
const COMPLETION_BONUS_XP = 25;

export async function POST(request: NextRequest) {
  try {
    const { challengeId } = await request.json();

    if (!challengeId) {
      return NextResponse.json({ error: "Missing challengeId" }, { status: 400 });
    }

    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const challenge = await prisma.dailyChallenge.findUnique({
      where: { id: challengeId },
      select: {
        userId: true,
        completedAt: true,
        totalQuestions: true,
        correctCount: true,
        xpEarned: true,
        startedAt: true,
      },
    });

    if (!challenge || challenge.userId !== userId) {
      return NextResponse.json({ error: "Challenge not found" }, { status: 404 });
    }

    if (challenge.completedAt) {
      const accuracy = challenge.totalQuestions > 0
        ? Math.round((challenge.correctCount / challenge.totalQuestions) * 100)
        : 0;
      return NextResponse.json({
        success: true,
        totalQuestions: challenge.totalQuestions,
        correctCount: challenge.correctCount,
        accuracy,
        xpEarned: challenge.xpEarned,
      });
    }

    await prisma.dailyChallenge.update({
      where: { id: challengeId },
      data: { completedAt: new Date() },
    });

    const { totalQuestions, correctCount } = challenge;
    const accuracy = totalQuestions > 0
      ? Math.round((correctCount / totalQuestions) * 100)
      : 0;

    const isPerfect = correctCount === totalQuestions && totalQuestions > 0;
    const completionBonus = correctCount > 0 ? COMPLETION_BONUS_XP : 0;
    const perfectBonus = isPerfect ? PERFECT_BONUS_XP : 0;

    const streak = await prisma.streak.findUnique({
      where: { userId },
      select: { currentStreak: true },
    });
    const streakMultiplier = (streak?.currentStreak ?? 0) >= 3 ? 1 : 0;
    const streakBonusTotal = streakMultiplier * correctCount * STREAK_BONUS_XP;

    const answers = await prisma.dailyChallengeQuestion.findMany({
      where: { dailyChallengeId: challengeId },
      orderBy: { order: "asc" },
      select: { isCorrect: true },
    });

    const comboBonus = comboBonusFrom(answers.map((a) => a.isCorrect));

    const totalXp = challenge.xpEarned + completionBonus + perfectBonus;

    const gamification = await processLessonGamification(userId, accuracy, totalXp);

    await updateQuestProgress(userId, "practice", 1);
    await updateQuestProgress(userId, "answer_questions", correctCount);
    await updateQuestProgress(userId, "earn_xp", totalXp);

    await prisma.dailyChallenge.update({
      where: { id: challengeId },
      data: { xpEarned: gamification.earnedXp, streakBonus: streakBonusTotal },
    });

    return NextResponse.json({
      success: true,
      totalQuestions,
      correctCount,
      accuracy,
      xpEarned: gamification.earnedXp,
      streakBonus: streakBonusTotal,
      comboBonus,
      completionBonus,
      perfectBonus,
      didLevelUp: gamification.didLevelUp,
      level: gamification.currentLevel.level,
      levelTitle: gamification.currentLevel.title,
    });
  } catch (err) {
    console.error("[API daily-challenge complete]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal Server Error" },
      { status: 500 },
    );
  }
}
