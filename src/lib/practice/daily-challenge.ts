"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { validateAcceptedAnswer } from "@/lib/quiz/validation";
import { processLessonGamification } from "@/lib/gamification/actions";
import { updateQuestProgress } from "@/lib/quests/daily";

/* ─── Constants ─── */

const CHALLENGE_DURATION_MS = 30 * 60 * 1000; // 30 minutes
const QUESTIONS_PER_CHALLENGE = 15;
const BASE_XP_PER_CORRECT = 10;
const STREAK_BONUS_XP = 2; // extra XP per correct when streak >= 3
const COMBO_THRESHOLD = 3; // combo kicks in at 3 consecutive correct
const COMBO_BONUS_XP = 5; // bonus per correct when in combo
const PERFECT_BONUS_XP = 50;
const COMPLETION_BONUS_XP = 25;
const ANSWER_COOLDOWN_MS = 1500; // min ms between answer submissions

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

/* ─── Types ─── */

export type ChallengeQuestion = {
  id: string;
  question: string;
  type: string;
  difficulty: string;
  options: string[] | null;
  hint: string | null;
  order: number;
};

export type StartChallengeResult = {
  success: boolean;
  challengeId?: string;
  questions?: ChallengeQuestion[];
  expiresAt?: Date;
  alreadyCompleted?: boolean;
  previousResult?: {
    correctCount: number;
    totalQuestions: number;
    xpEarned: number;
  };
  error?: string;
};

export type AnswerResult = {
  success: boolean;
  isCorrect?: boolean;
  correctAnswer?: string;
  explanation?: string;
  xpEarned?: number;
  combo?: number;
  error?: string;
};

export type CompleteResult = {
  success: boolean;
  totalQuestions?: number;
  correctCount?: number;
  accuracy?: number;
  xpEarned?: number;
  streakBonus?: number;
  comboBonus?: number;
  completionBonus?: number;
  perfectBonus?: number;
  didLevelUp?: boolean;
  level?: number;
  levelTitle?: string;
  error?: string;
};

export type ChallengeStatus = {
  hasChallengeToday: boolean;
  isCompleted: boolean;
  isActive: boolean;
  expiresAt?: Date;
  previousBest?: {
    correctCount: number;
    totalQuestions: number;
    accuracy: number;
    date: Date;
  };
};

/* ─── Actions ─── */

/**
 * Get the status of today's daily challenge for the current user.
 */
export async function getDailyChallengeStatus(): Promise<ChallengeStatus> {
  const session = await auth();
  if (!session?.user?.id) {
    return { hasChallengeToday: false, isCompleted: false, isActive: false };
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

    return {
      hasChallengeToday: true,
      isCompleted,
      isActive,
      expiresAt: isCompleted ? undefined : expiresAt,
    };
  }

  // No challenge today — get previous best
  const best = await prisma.dailyChallenge.findFirst({
    where: { userId, completedAt: { not: null } },
    orderBy: { correctCount: "desc" },
    select: {
      correctCount: true,
      totalQuestions: true,
      xpEarned: true,
      date: true,
    },
  });

  return {
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
          date: best.date,
        }
      : undefined,
  };
}

/**
 * Start a new daily challenge. Picks random questions from curriculum.
 * Same user gets the same set on the same day (seeded shuffle).
 */
export async function startDailyChallenge(): Promise<StartChallengeResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
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
        return {
          success: false,
          alreadyCompleted: true,
          previousResult: {
            correctCount: existing.correctCount,
            totalQuestions: existing.totalQuestions,
            xpEarned: existing.xpEarned,
          },
          error: "You've already completed today's challenge. Come back tomorrow!",
        };
      }

      // Challenge is active (not completed yet) — return existing questions
      const existingQuestions = await prisma.dailyChallengeQuestion.findMany({
        where: { dailyChallengeId: existing.id },
        include: { question: true },
        orderBy: { order: "asc" },
      });

      return {
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
        })),
        expiresAt: new Date(existing.startedAt.getTime() + CHALLENGE_DURATION_MS),
      };
    }

    // Get questions from curriculum, excluding recently answered correctly
    const recentCorrect = await prisma.questionAttempt.findMany({
      where: {
        userId,
        isCorrect: true,
        answeredAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // last 7 days
        },
      },
      select: { questionId: true },
      distinct: ["questionId"],
    });

    const excludeIds = recentCorrect.map((r) => r.questionId);

    const pool = await prisma.question.findMany({
      where: {
        source: "curriculum",
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

    // If pool is too small (new user), just use all curriculum questions
    const effectivePool =
      pool.length < QUESTIONS_PER_CHALLENGE
        ? await prisma.question.findMany({
            where: { source: "curriculum" },
            select: {
              id: true,
              question: true,
              type: true,
              difficulty: true,
              options: true,
              hint: true,
            },
          })
        : pool;

    if (effectivePool.length === 0) {
      return {
        success: false,
        error: "No questions available yet. Complete some lessons first!",
      };
    }

    // Seeded shuffle: same user + same day = same question set
    const dayKey =
      today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    const seed = dayKey + hashString(userId);
    const shuffled = shuffleWithSeed(effectivePool, seed);
    const picked = shuffled.slice(0, QUESTIONS_PER_CHALLENGE);

    // Create the challenge + questions in a transaction
    const challenge = await prisma.$transaction(async (tx) => {
      const ch = await tx.dailyChallenge.create({
        data: {
          userId,
          date: today,
          totalQuestions: picked.length,
        },
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

    const expiresAt = new Date(
      challenge.startedAt.getTime() + CHALLENGE_DURATION_MS,
    );

    return {
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
      expiresAt,
    };
  } catch (err) {
    console.error("[DailyChallenge start]", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to start challenge",
    };
  }
}

/**
 * Submit an answer for a single question in the daily challenge.
 */
export async function submitChallengeAnswer(
  challengeId: string,
  questionId: string,
  userAnswer: string,
): Promise<AnswerResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const userId = session.user.id;

    // Validate the challenge exists and belongs to user
    const challenge = await prisma.dailyChallenge.findUnique({
      where: { id: challengeId },
      select: {
        userId: true,
        startedAt: true,
        completedAt: true,
      },
    });

    if (!challenge || challenge.userId !== userId) {
      return { success: false, error: "Challenge not found" };
    }

    if (challenge.completedAt) {
      return { success: false, error: "Challenge already completed" };
    }

    // Check timer
    const expiresAt = new Date(
      challenge.startedAt.getTime() + CHALLENGE_DURATION_MS,
    );
    if (new Date() > expiresAt) {
      // Auto-complete the challenge as timed out
      await prisma.dailyChallenge.update({
        where: { id: challengeId },
        data: { completedAt: new Date() },
      });
      return { success: false, error: "Time's up! Challenge has ended." };
    }

    // Check cooldown
    const lastAttempt = await prisma.dailyChallengeQuestion.findFirst({
      where: {
        dailyChallengeId: challengeId,
        answeredAt: { not: null },
      },
      orderBy: { answeredAt: "desc" },
      select: { answeredAt: true },
    });

    if (lastAttempt?.answeredAt) {
      const elapsed = Date.now() - lastAttempt.answeredAt.getTime();
      if (elapsed < ANSWER_COOLDOWN_MS) {
        return { success: false, error: "Please wait a moment before answering" };
      }
    }

    // Get the challenge question record
    const dq = await prisma.dailyChallengeQuestion.findFirst({
      where: { dailyChallengeId: challengeId, questionId },
      include: { question: true },
    });

    if (!dq) {
      return { success: false, error: "Question not found in this challenge" };
    }

    if (dq.userAnswer !== null) {
      return { success: false, error: "Already answered" };
    }

    // Validate answer
    const isCorrect = validateAcceptedAnswer(
      dq.question.correctAnswer.toLowerCase(),
      (userAnswer ?? "").trim().toLowerCase(),
    );

    // Get current combo (count consecutive correct from most recent answered)
    const recentAnswers = await prisma.dailyChallengeQuestion.findMany({
      where: {
        dailyChallengeId: challengeId,
        answeredAt: { not: null },
      },
      orderBy: { order: "desc" },
      select: { isCorrect: true },
    });

    let combo = 0;
    for (const a of recentAnswers) {
      if (a.isCorrect) combo++;
      else break;
    }
    if (isCorrect) combo++; // include current answer

    // Calculate XP
    let xpEarned = 0;
    if (isCorrect) {
      xpEarned = BASE_XP_PER_CORRECT;
      // Streak bonus
      const streak = await prisma.streak.findUnique({
        where: { userId },
        select: { currentStreak: true },
      });
      if (streak && streak.currentStreak >= 3) {
        xpEarned += STREAK_BONUS_XP;
      }
      // Combo bonus
      if (combo >= COMBO_THRESHOLD) {
        xpEarned += COMBO_BONUS_XP;
      }
    }

    // Update the question record
    await prisma.dailyChallengeQuestion.update({
      where: { id: dq.id },
      data: {
        userAnswer,
        isCorrect,
        answeredAt: new Date(),
      },
    });

    // Update running totals on the challenge
    const newCorrectCount = isCorrect
      ? { increment: 1 }
      : undefined;

    await prisma.dailyChallenge.update({
      where: { id: challengeId },
      data: {
        ...(newCorrectCount ? { correctCount: newCorrectCount } : {}),
        xpEarned: { increment: xpEarned },
      },
    });

    return {
      success: true,
      isCorrect,
      correctAnswer: dq.question.correctAnswer,
      explanation: dq.question.explanation,
      xpEarned,
      combo: isCorrect ? combo : 0,
    };
  } catch (err) {
    console.error("[DailyChallenge answer]", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to submit answer",
    };
  }
}

/**
 * Complete the daily challenge. Called when timer ends or all questions answered.
 * Awards final bonuses and processes gamification.
 */
export async function completeDailyChallenge(
  challengeId: string,
): Promise<CompleteResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
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
      return { success: false, error: "Challenge not found" };
    }

    if (challenge.completedAt) {
      // Already completed — return cached result
      const accuracy =
        challenge.totalQuestions > 0
          ? Math.round((challenge.correctCount / challenge.totalQuestions) * 100)
          : 0;
      return {
        success: true,
        totalQuestions: challenge.totalQuestions,
        correctCount: challenge.correctCount,
        accuracy,
        xpEarned: challenge.xpEarned,
      };
    }

    // Mark as completed
    await prisma.dailyChallenge.update({
      where: { id: challengeId },
      data: { completedAt: new Date() },
    });

    const { totalQuestions, correctCount } = challenge;
    const accuracy =
      totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

    // Calculate bonuses
    const isPerfect = correctCount === totalQuestions && totalQuestions > 0;
    const completionBonus = correctCount > 0 ? COMPLETION_BONUS_XP : 0;
    const perfectBonus = isPerfect ? PERFECT_BONUS_XP : 0;

    // Streak bonus (total across the challenge)
    const streak = await prisma.streak.findUnique({
      where: { userId },
      select: { currentStreak: true },
    });
    const streakMultiplier = (streak?.currentStreak ?? 0) >= 3 ? 1 : 0;
    const streakBonusTotal =
      streakMultiplier * correctCount * STREAK_BONUS_XP;

    // Combo bonus (recalculate from answers)
    const answers = await prisma.dailyChallengeQuestion.findMany({
      where: { dailyChallengeId: challengeId },
      orderBy: { order: "asc" },
      select: { isCorrect: true },
    });

    let comboBonus = 0;
    let currentCombo = 0;
    for (const a of answers) {
      if (a.isCorrect) {
        currentCombo++;
        if (currentCombo >= COMBO_THRESHOLD) {
          comboBonus += COMBO_BONUS_XP;
        }
      } else {
        currentCombo = 0;
      }
    }

    const totalXpFromAnswers = challenge.xpEarned; // already includes per-question XP
    const totalXp = totalXpFromAnswers + completionBonus + perfectBonus;

    // Process gamification (streak, level, achievements)
    const gamification = await processLessonGamification(
      userId,
      accuracy,
      totalXp,
    );

    // Update quest progress
    await updateQuestProgress(userId, "practice", 1);
    await updateQuestProgress(userId, "answer_questions", correctCount);
    await updateQuestProgress(userId, "earn_xp", totalXp);

    // Update the challenge record with final totals
    await prisma.dailyChallenge.update({
      where: { id: challengeId },
      data: {
        xpEarned: gamification.earnedXp,
        streakBonus: streakBonusTotal,
      },
    });

    return {
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
    };
  } catch (err) {
    console.error("[DailyChallenge complete]", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to complete challenge",
    };
  }
}
