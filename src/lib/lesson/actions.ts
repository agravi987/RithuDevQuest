"use server";

import "server-only";

import type { Session } from "next-auth";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { canAccessLesson } from "@/lib/curriculum/navigation";
import {
  completeLessonSchema,
  submitAnswerSchema,
  type CompleteLessonInput,
  type SubmitAnswerInput,
} from "@/lib/lesson/schemas";
import { questionXp, summarizeLessonAttempts } from "@/lib/lesson/scoring";
import type {
  CompleteLessonResult,
  SubmitAnswerResult,
} from "@/lib/lesson/types";
import { getCompletedLessonIds } from "@/lib/progress/queries";
import {
  parseQuestionDifficulty,
  validateQuestionAnswer,
} from "@/lib/quiz/validation";
import { processLessonGamification } from "@/lib/gamification/actions";
import { updateQuestProgress } from "@/lib/quests/daily";
import { loseHeart } from "@/lib/hearts";

type ScenarioPart = { prompt: string; correctAnswer: string };

function requireUserId(session: Session | null): string {
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error("You must be signed in to continue");
  }
  return userId;
}

function parseParts(value: unknown): ScenarioPart[] | null {
  if (!Array.isArray(value)) return null;
  const parts: ScenarioPart[] = [];
  for (const item of value) {
    if (
      typeof item !== "object" ||
      item === null ||
      !("prompt" in item) ||
      !("correctAnswer" in item) ||
      typeof (item as Record<string, unknown>).prompt !== "string" ||
      typeof (item as Record<string, unknown>).correctAnswer !== "string"
    ) {
      return null;
    }
    parts.push({
      prompt: (item as Record<string, unknown>).prompt as string,
      correctAnswer: (item as Record<string, unknown>).correctAnswer as string,
    });
  }
  return parts;
}

async function getOpenAttempt(
  userId: string,
  lessonId: string,
): Promise<{ id: string }> {
  const open =
    (await prisma.lessonAttempt.findFirst({
      where: { userId, lessonId, completed: false },
      orderBy: { startedAt: "desc" },
      select: { id: true },
    })) ??
    (await prisma.lessonAttempt.create({
      data: { userId, lessonId, score: 0, xpEarned: 0 },
      select: { id: true },
    }));
  return open;
}

/**
 * The number of previous attempts for a submission: per part for scenario
 * questions, per question for single-part types. Callers add 1 to derive
 * the stored 1-based attempt number.
 */
async function countAttempts(
  attemptId: string,
  questionId: string,
  partIndex: number | null,
): Promise<number> {
  if (partIndex === null) {
    return prisma.questionAttempt.count({
      where: { lessonAttemptId: attemptId, questionId },
    });
  }
  return prisma.questionAttempt.count({
    where: { lessonAttemptId: attemptId, questionId, partIndex },
  });
}

/**
 * Effective attempt for a solved scenario: the worst part's best attempt.
 * Returns null while any part still lacks a correct answer.
 */
async function scenarioEffectiveAttempt(
  attemptId: string,
  questionId: string,
  totalParts: number,
): Promise<number | null> {
  const correctRows = await prisma.questionAttempt.findMany({
    where: {
      lessonAttemptId: attemptId,
      questionId,
      isCorrect: true,
      partIndex: { not: null },
    },
    orderBy: { attemptNumber: "asc" },
    select: { partIndex: true, attemptNumber: true },
  });

  const best = new Map<number, number>();
  for (const row of correctRows) {
    if (row.partIndex === null) continue;
    if (!best.has(row.partIndex)) best.set(row.partIndex, row.attemptNumber);
  }
  for (let partIndex = 0; partIndex < totalParts; partIndex++) {
    if (!best.has(partIndex)) return null;
  }
  return Math.max(...best.values());
}

export async function submitAnswer(
  input: SubmitAnswerInput,
): Promise<SubmitAnswerResult> {
  const userId = requireUserId(await auth());

  const parsed = submitAnswerSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error("That answer could not be accepted");
  }

  const { lessonId, questionId, answer, partIndex } = parsed.data;

  const question = await prisma.question.findUnique({
    where: { id: questionId },
    include: {
      lesson: {
        include: {
          unit: {
            include: {
              module: {
                include: {
                  units: { include: { lessons: true } },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!question || question.lessonId !== lessonId) {
    throw new Error("Question not found");
  }

  const completedLessonIds = await getCompletedLessonIds(userId);
  const units = question.lesson.unit.module.units;
  if (!canAccessLesson(units, completedLessonIds, lessonId)) {
    throw new Error("This lesson is locked");
  }

  const isScenario = question.type === "scenario";
  const parts = isScenario ? parseParts(question.parts) : null;
  if (isScenario && (!parts || parts.length < 2)) {
    throw new Error("This scenario question is not configured");
  }

  let resolvedPartIndex: number | null = null;
  if (isScenario) {
    if (partIndex === undefined || partIndex >= (parts?.length ?? 0)) {
      throw new Error("That part does not exist");
    }
    resolvedPartIndex = partIndex;
  }

  const correctAnswerTarget =
    isScenario && resolvedPartIndex !== null
      ? parts![resolvedPartIndex]!.correctAnswer
      : question.correctAnswer;

  const openAttempt = await getOpenAttempt(userId, lessonId);
  const attemptNumber = (await countAttempts(
    openAttempt.id,
    questionId,
    resolvedPartIndex,
  )) + 1;
  const isCorrect = validateQuestionAnswer(
    { type: question.type as Parameters<typeof validateQuestionAnswer>[0]["type"], correctAnswer: correctAnswerTarget },
    answer,
  );
  const difficulty = parseQuestionDifficulty(question.difficulty);

  const createdAttempt = await prisma.questionAttempt.create({
    data: {
      userId,
      questionId,
      lessonAttemptId: openAttempt.id,
      isCorrect,
      userAnswer: answer,
      attemptNumber,
      partIndex: resolvedPartIndex,
      xpEarned: 0,
    },
  });

  let earnedXp = 0;
  if (isCorrect) {
    if (isScenario && resolvedPartIndex !== null) {
      const totalParts = parts!.length;
      const effectiveAttempt = await scenarioEffectiveAttempt(
        openAttempt.id,
        questionId,
        totalParts,
      );
      if (effectiveAttempt !== null) {
        earnedXp = questionXp({ isCorrect: true, attemptNumber: effectiveAttempt, difficulty });
      }
    } else if (!isScenario) {
      earnedXp = questionXp({ isCorrect: true, attemptNumber, difficulty });
    }
  }

  if (earnedXp > 0) {
    await prisma.$transaction([
      prisma.questionAttempt.update({
        where: { id: createdAttempt.id },
        data: { xpEarned: earnedXp },
      }),
      prisma.lessonAttempt.update({
        where: { id: openAttempt.id },
        data: { xpEarned: { increment: earnedXp } },
      }),
    ]);
  }

  // For scenario questions: `false` means this part was answered correctly but
  // the whole scenario isn't solved yet (the client advances to the next part);
  // `true` means every part is now correct; `null` means not applicable.
  const scenarioComplete =
    isScenario && isCorrect ? earnedXp > 0 : null;

  // Lose heart on wrong answer
  if (!isCorrect) {
    await loseHeart(userId);
  }

  // Update daily quest progress. Note: XP is only granted to the user (and to
  // the "earn XP" quest) when the lesson is completed in completeLesson(), so
  // we must not credit the earn_xp quest here — that would double count it.
  if (isCorrect) {
    await updateQuestProgress(userId, "answer_questions", 1);
  }

  return {
    questionId,
    lessonId,
    isCorrect,
    attemptNumber,
    xpEarned: earnedXp,
    correctAnswer: correctAnswerTarget,
    explanation: question.explanation,
    hint: question.hint,
    partIndex: resolvedPartIndex,
    scenarioComplete,
    totalParts: isScenario ? (parts?.length ?? null) : null,
  };
}

export async function completeLesson(
  input: CompleteLessonInput,
): Promise<CompleteLessonResult> {
  const userId = requireUserId(await auth());

  const parsed = completeLessonSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error("Invalid lesson");
  }

  const { lessonId, questionIds } = parsed.data;

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      unit: {
        include: {
          module: {
            include: {
              units: { include: { lessons: true } },
            },
          },
        },
      },
    },
  });

  if (!lesson) {
    throw new Error("Lesson not found");
  }

  const completedLessonIds = await getCompletedLessonIds(userId);
  if (!canAccessLesson(lesson.unit.module.units, completedLessonIds, lessonId)) {
    throw new Error("This lesson is locked");
  }

  const bank = await prisma.question.findMany({
    where: { lessonId },
    select: { id: true },
  });
  const bankIds = new Set(bank.map((item) => item.id));
  const askedQuestionIds = [...new Set(questionIds)].filter((id) =>
    bankIds.has(id),
  );
  if (askedQuestionIds.length !== questionIds.length) {
    throw new Error("This lesson contains foreign questions");
  }

  const openAttempt = await getOpenAttempt(userId, lessonId);

  const records = await prisma.questionAttempt.findMany({
    where: { lessonAttemptId: openAttempt.id },
    select: {
      questionId: true,
      isCorrect: true,
      attemptNumber: true,
      partIndex: true,
      question: { select: { difficulty: true } },
    },
  });

  const askedSet = new Set(askedQuestionIds);
  const summary = summarizeLessonAttempts(
    records
      .filter((record) => askedSet.has(record.questionId))
      .map((record) => ({
        questionId: record.questionId,
        isCorrect: record.isCorrect,
        attemptNumber: record.attemptNumber,
        partIndex: record.partIndex,
        difficulty: parseQuestionDifficulty(record.question.difficulty),
      })),
    askedQuestionIds.length,
  );

  await prisma.$transaction([
    prisma.lessonAttempt.update({
      where: { id: openAttempt.id },
      data: {
        completed: true,
        score: summary.score,
        xpEarned: summary.xpEarned,
        completedAt: new Date(),
      },
    }),
    prisma.userProgress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      create: {
        userId,
        lessonId,
        completed: true,
        score: summary.score,
      },
      update: {
        completed: true,
        score: summary.score,
        lastAccessed: new Date(),
      },
    }),
  ]);

  const gamification = await processLessonGamification(
    userId,
    summary.score,
    summary.xpEarned,
  );

  // Update daily quest progress for lesson completion
  await updateQuestProgress(userId, "complete_lessons", 1);
  await updateQuestProgress(userId, "earn_xp", summary.xpEarned);

  return {
    lessonId,
    score: summary.score,
    xpEarned: gamification.earnedXp,
    correctFirstTry: summary.correctFirstTry,
    totalQuestions: askedQuestionIds.length,
    completed: true,
    gamification: {
      totalXp: gamification.totalXp,
      level: gamification.currentLevel.level,
      levelTitle: gamification.currentLevel.title,
      progressPercentage: gamification.currentLevel.progressPercentage,
      xpToNextLevel: gamification.currentLevel.xpToNextLevel,
      didLevelUp: gamification.didLevelUp,
      streak: {
        currentStreak: gamification.streak.newStreak,
        longestStreak: gamification.streak.longestStreak,
        status: gamification.streak.status,
      },
      newAchievements: gamification.newAchievements,
    },
  };
}