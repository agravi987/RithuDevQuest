import "server-only";

import { prisma } from "@/lib/db";

/**
 * Ids of every lesson the user has completed.
 */
export async function getCompletedLessonIds(userId: string): Promise<string[]> {
  const rows = await prisma.userProgress.findMany({
    where: { userId, completed: true },
    select: { lessonId: true },
  });
  return rows.map((row) => row.lessonId);
}

/**
 * Recently answered question ids for a lesson, most recent first, to let
 * the question selection algorithm avoid repeating them.
 */
export async function getRecentQuestionIds(
  userId: string,
  lessonId: string,
  limit = 25,
): Promise<string[]> {
  const rows = await prisma.questionAttempt.findMany({
    where: { userId, question: { lessonId } },
    select: { questionId: true },
    orderBy: { answeredAt: "desc" },
    distinct: ["questionId"],
    take: limit,
  });
  return rows.map((row) => row.questionId);
}

/**
 * Number of completed lessons per module for a user.
 */
export async function getModuleCompletionCounts(
  userId: string,
  moduleIds: string[],
): Promise<Map<string, number>> {
  if (moduleIds.length === 0) return new Map();

  const lessons = await prisma.lesson.findMany({
    where: { unit: { moduleId: { in: moduleIds } } },
    select: { id: true, unit: { select: { moduleId: true } } },
  });

  if (lessons.length === 0) return new Map();

  const moduleByLessonId = new Map(
    lessons.map((lesson) => [lesson.id, lesson.unit.moduleId]),
  );

  const rows = await prisma.userProgress.findMany({
    where: {
      userId,
      completed: true,
      lessonId: { in: lessons.map((lesson) => lesson.id) },
    },
    select: { lessonId: true },
  });

  const counts = new Map<string, number>();
  for (const row of rows) {
    const moduleId = moduleByLessonId.get(row.lessonId);
    if (!moduleId) continue;
    counts.set(moduleId, (counts.get(moduleId) ?? 0) + 1);
  }
  return counts;
}