import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { validateQuestionAnswer } from "@/lib/quiz/validation";
import {
  COMBO_BONUS_XP,
  COMBO_THRESHOLD,
  DAILY_BASE_XP_PER_CORRECT,
  STREAK_BONUS_XP,
  currentComboFrom,
} from "@/lib/practice/xp";

const CHALLENGE_DURATION_MS = 30 * 60 * 1000;
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

    let isCorrect = validateQuestionAnswer(
      {
        type: dq.question.type as Parameters<typeof validateQuestionAnswer>[0]["type"],
        correctAnswer: dq.question.correctAnswer,
        options: dq.question.options,
      },
      userAnswer,
    );

    // Fallback: If not matched directly, check if userAnswer was an option ID or index (e.g. "opt-0" or "0")
    if (!isCorrect && dq.question.options && Array.isArray(dq.question.options)) {
      const opts = dq.question.options as Array<string | { text: string; isCorrect?: boolean }>;
      const optIdx = userAnswer.startsWith("opt-")
        ? parseInt(userAnswer.replace("opt-", ""), 10)
        : parseInt(userAnswer, 10);

      if (!isNaN(optIdx) && optIdx >= 0 && optIdx < opts.length) {
        const opt = opts[optIdx];
        const optText = typeof opt === "string" ? opt : opt?.text ?? "";
        if (optText) {
          isCorrect = validateQuestionAnswer(
            {
              type: dq.question.type as Parameters<typeof validateQuestionAnswer>[0]["type"],
              correctAnswer: dq.question.correctAnswer,
              options: dq.question.options,
            },
            optText,
          );
        }
        if (!isCorrect && typeof opt === "object" && opt?.isCorrect) {
          isCorrect = true;
        }
      }
    }

    // Calculate combo
    const recentAnswers = await prisma.dailyChallengeQuestion.findMany({
      where: { dailyChallengeId: challengeId, answeredAt: { not: null } },
      orderBy: { order: "desc" },
      select: { isCorrect: true },
    });

    const combo = currentComboFrom(
      recentAnswers.map((a) => a.isCorrect),
      isCorrect,
    );

    // Calculate XP
    let xpEarned = 0;
    if (isCorrect) {
      xpEarned = DAILY_BASE_XP_PER_CORRECT;
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
