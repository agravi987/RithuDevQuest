import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { validateAcceptedAnswer } from "@/lib/quiz/validation";

const CHALLENGE_DURATION_MS = 30 * 60 * 1000;
const BASE_XP_PER_CORRECT = 10;
const STREAK_BONUS_XP = 2;
const COMBO_THRESHOLD = 3;
const COMBO_BONUS_XP = 5;
const ANSWER_COOLDOWN_MS = 1500;

export async function POST(request: NextRequest) {
  try {
    const { challengeId, questionId, userAnswer } = await request.json();

    if (!challengeId || !questionId || !userAnswer?.trim()) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const challenge = await prisma.dailyChallenge.findUnique({
      where: { id: challengeId },
      select: { userId: true, startedAt: true, completedAt: true },
    });

    if (!challenge || challenge.userId !== userId) {
      return NextResponse.json({ error: "Challenge not found" }, { status: 404 });
    }

    if (challenge.completedAt) {
      return NextResponse.json({ error: "Challenge already completed" }, { status: 400 });
    }

    // Check timer
    const expiresAt = new Date(challenge.startedAt.getTime() + CHALLENGE_DURATION_MS);
    if (new Date() > expiresAt) {
      await prisma.dailyChallenge.update({
        where: { id: challengeId },
        data: { completedAt: new Date() },
      });
      return NextResponse.json({ error: "Time's up!" }, { status: 400 });
    }

    // Check cooldown
    const lastAttempt = await prisma.dailyChallengeQuestion.findFirst({
      where: { dailyChallengeId: challengeId, answeredAt: { not: null } },
      orderBy: { answeredAt: "desc" },
      select: { answeredAt: true },
    });

    if (lastAttempt?.answeredAt) {
      const elapsed = Date.now() - lastAttempt.answeredAt.getTime();
      if (elapsed < ANSWER_COOLDOWN_MS) {
        return NextResponse.json({ error: "Please wait a moment" }, { status: 429 });
      }
    }

    const dq = await prisma.dailyChallengeQuestion.findFirst({
      where: { dailyChallengeId: challengeId, questionId },
      include: { question: true },
    });

    if (!dq) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    if (dq.userAnswer !== null) {
      return NextResponse.json({ error: "Already answered" }, { status: 400 });
    }

    const isCorrect = validateAcceptedAnswer(
      dq.question.correctAnswer.toLowerCase(),
      userAnswer.trim().toLowerCase(),
    );

    // Calculate combo
    const recentAnswers = await prisma.dailyChallengeQuestion.findMany({
      where: { dailyChallengeId: challengeId, answeredAt: { not: null } },
      orderBy: { order: "desc" },
      select: { isCorrect: true },
    });

    let combo = 0;
    for (const a of recentAnswers) {
      if (a.isCorrect) combo++;
      else break;
    }
    if (isCorrect) combo++;

    // Calculate XP
    let xpEarned = 0;
    if (isCorrect) {
      xpEarned = BASE_XP_PER_CORRECT;
      const streak = await prisma.streak.findUnique({
        where: { userId },
        select: { currentStreak: true },
      });
      if (streak && streak.currentStreak >= 3) xpEarned += STREAK_BONUS_XP;
      if (combo >= COMBO_THRESHOLD) xpEarned += COMBO_BONUS_XP;
    }

    await prisma.dailyChallengeQuestion.update({
      where: { id: dq.id },
      data: { userAnswer, isCorrect, answeredAt: new Date() },
    });

    await prisma.dailyChallenge.update({
      where: { id: challengeId },
      data: {
        ...(isCorrect ? { correctCount: { increment: 1 } } : {}),
        xpEarned: { increment: xpEarned },
      },
    });

    return NextResponse.json({
      success: true,
      isCorrect,
      correctAnswer: dq.question.correctAnswer,
      explanation: dq.question.explanation,
      xpEarned,
      combo: isCorrect ? combo : 0,
    });
  } catch (err) {
    console.error("[API daily-challenge answer]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal Server Error" },
      { status: 500 },
    );
  }
}
