import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

const CHALLENGE_DURATION_MS = 30 * 60 * 1000;
const QUESTIONS_PER_CHALLENGE = 15;

/* ─── Helpers ─── */

function getTodayDate(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function shuffleWithSeed<T>(arr: T[], seed: number): T[] {
  const rng = seededRandom(seed);
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j]!, result[i]!];
  }
  return result;
}

/* ─── GET: Status ─── */

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = getTodayDate();
  const userId = session.user.id;

  const challenge = await prisma.dailyChallenge.findUnique({
    where: { userId_date: { userId, date: today } },
    select: {
      completedAt: true,
      startedAt: true,
      totalQuestions: true,
      correctCount: true,
      xpEarned: true,
    },
  });

  if (challenge) {
    const isCompleted = challenge.completedAt !== null;
    const expiresAt = new Date(challenge.startedAt.getTime() + CHALLENGE_DURATION_MS);
    const isActive = !isCompleted && new Date() < expiresAt;

    return NextResponse.json({
      hasChallengeToday: true,
      isCompleted,
      isActive,
      expiresAt: isCompleted ? undefined : expiresAt.toISOString(),
    });
  }

  const best = await prisma.dailyChallenge.findFirst({
    where: { userId, completedAt: { not: null } },
    orderBy: { correctCount: "desc" },
    select: {
      correctCount: true,
      totalQuestions: true,
      date: true,
    },
  });

  return NextResponse.json({
    hasChallengeToday: false,
    isCompleted: false,
    isActive: false,
    previousBest: best
      ? {
          correctCount: best.correctCount,
          totalQuestions: best.totalQuestions,
          accuracy:
            best.totalQuestions > 0
              ? Math.round((best.correctCount / best.totalQuestions) * 100)
              : 0,
          date: best.date.toISOString(),
        }
      : undefined,
  });
}

/* ─── POST: Start ─── */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    if (body.action !== "start") {
      return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }

    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const today = getTodayDate();

    // Check if already started/completed today
    const existing = await prisma.dailyChallenge.findUnique({
      where: { userId_date: { userId, date: today } },
      select: {
        id: true,
        completedAt: true,
        startedAt: true,
        totalQuestions: true,
        correctCount: true,
        xpEarned: true,
      },
    });

    if (existing) {
      if (existing.completedAt) {
        return NextResponse.json({
          success: false,
          alreadyCompleted: true,
          previousResult: {
            correctCount: existing.correctCount,
            totalQuestions: existing.totalQuestions,
            xpEarned: existing.xpEarned,
          },
          error: "Already completed today. Come back tomorrow!",
        });
      }

      // Resume active challenge
      const existingQuestions = await prisma.dailyChallengeQuestion.findMany({
        where: { dailyChallengeId: existing.id },
        include: { question: true },
        orderBy: { order: "asc" },
      });

      return NextResponse.json({
        success: true,
        challengeId: existing.id,
        questions: existingQuestions.map((dq) => ({
          id: dq.question.id,
          question: dq.question.question,
          type: dq.question.type,
          difficulty: dq.question.difficulty,
          options: (dq.question.options as string[]) ?? null,
          hint: dq.question.hint ?? null,
          order: dq.order,
          userAnswer: dq.userAnswer ?? null,
          isCorrect: dq.isCorrect ?? null,
          answeredAt: dq.answeredAt?.toISOString() ?? null,
        })),
        expiresAt: new Date(existing.startedAt.getTime() + CHALLENGE_DURATION_MS).toISOString(),
        durationMs: CHALLENGE_DURATION_MS,
        isExpired: new Date() > new Date(existing.startedAt.getTime() + CHALLENGE_DURATION_MS),
      });
    }

    // Get questions from curriculum, excluding recently answered correctly
    const recentCorrect = await prisma.questionAttempt.findMany({
      where: {
        userId,
        isCorrect: true,
        answeredAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
      select: { questionId: true },
      distinct: ["questionId"],
    });

    const excludeIds = recentCorrect.map((r) => r.questionId);

    const SIMPLE_QUESTION_TYPES = ["mcq", "true_false", "command"];

    let pool = await prisma.question.findMany({
      where: {
        source: "curriculum",
        type: { in: SIMPLE_QUESTION_TYPES },
        ...(excludeIds.length > 0 ? { id: { notIn: excludeIds } } : {}),
      },
      select: {
        id: true,
        question: true,
        type: true,
        difficulty: true,
        options: true,
        hint: true,
      },
    });

    if (pool.length < QUESTIONS_PER_CHALLENGE) {
      pool = await prisma.question.findMany({
        where: { source: "curriculum", type: { in: SIMPLE_QUESTION_TYPES } },
        select: {
          id: true,
          question: true,
          type: true,
          difficulty: true,
          options: true,
          hint: true,
        },
      });
    }

    if (pool.length === 0) {
      return NextResponse.json({
        success: false,
        error: "No questions available yet. Complete some lessons first!",
      });
    }

    const dayKey =
      today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    const seed = dayKey + hashString(userId);
    const shuffled = shuffleWithSeed(pool, seed);
    const picked = shuffled.slice(0, QUESTIONS_PER_CHALLENGE);

    const challenge = await prisma.$transaction(async (tx) => {
      const ch = await tx.dailyChallenge.create({
        data: { userId, date: today, totalQuestions: picked.length },
      });
      await tx.dailyChallengeQuestion.createMany({
        data: picked.map((q, i) => ({
          dailyChallengeId: ch.id,
          questionId: q.id,
          order: i,
        })),
      });
      return ch;
    });

    return NextResponse.json({
      success: true,
      challengeId: challenge.id,
      questions: picked.map((q, i) => ({
        id: q.id,
        question: q.question,
        type: q.type,
        difficulty: q.difficulty,
        options: (q.options as string[]) ?? null,
        hint: q.hint ?? null,
        order: i,
      })),
      expiresAt: new Date(challenge.startedAt.getTime() + CHALLENGE_DURATION_MS).toISOString(),
      durationMs: CHALLENGE_DURATION_MS,
    });
  } catch (err) {
    console.error("[API daily-challenge]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal Server Error" },
      { status: 500 },
    );
  }
}
