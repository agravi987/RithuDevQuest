import "server-only";

import { prisma } from "@/lib/db";

export type AiQuestionRow = {
  id: string;
  type: string;
  difficulty: string;
  question: string;
  correctAnswer: string;
  explanation: string;
  hint: string | null;
  createdAt: Date;
  lessonId: string;
  lessonTitle: string;
  unitTitle: string;
  moduleTitle: string;
};

export async function getAiReviewStats() {
  const [total, pending, curriculum, withAttempts, averagePerQuestion] =
    await Promise.all([
      prisma.question.count(),
      prisma.question.count({ where: { source: "ai_generated" } }),
      prisma.question.count({ where: { source: "curriculum" } }),
      prisma.questionAttempt.groupBy({
        by: ["questionId"],
        _count: { _all: true },
      }),
      prisma.question.groupBy({
        by: ["lessonId"],
        _count: { _all: true },
      }),
    ]);

  const withAttemptsCount = withAttempts.length;
  const lessonsWithQuestions = averagePerQuestion.length;

  return {
    total,
    pending,
    curriculum,
    withAttemptsCount,
    lessonsWithQuestions,
  };
}

export async function listAiQuestions(): Promise<AiQuestionRow[]> {
  const rows = await prisma.question.findMany({
    where: { source: "ai_generated" },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      type: true,
      difficulty: true,
      question: true,
      correctAnswer: true,
      explanation: true,
      hint: true,
      createdAt: true,
      lessonId: true,
      lesson: {
        select: {
          title: true,
          unit: {
            select: {
              title: true,
              module: { select: { title: true } },
            },
          },
        },
      },
    },
  });

  return rows.map((q) => ({
    id: q.id,
    type: q.type,
    difficulty: q.difficulty,
    question: q.question,
    correctAnswer: q.correctAnswer,
    explanation: q.explanation,
    hint: q.hint,
    createdAt: q.createdAt,
    lessonId: q.lessonId,
    lessonTitle: q.lesson.title,
    unitTitle: q.lesson.unit?.title ?? "",
    moduleTitle: q.lesson.unit?.module?.title ?? "",
  }));
}
