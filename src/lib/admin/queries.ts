import "server-only";

import { prisma } from "@/lib/db";

export type AdminKpis = {
  totalUsers: number;
  newUsers7d: number;
  activeUsers7d: number;
  totalLessonsCompleted: number;
  totalXpEarned: number;
  totalQuestionsAnswered: number;
  avgCompletionRate: number;
  averageStreak: number;
};

export type GrowthPoint = {
  date: string;
  users: number;
  newUsers: number;
  activeUsers: number;
};

export type TopLesson = {
  id: string;
  title: string;
  pathTitle: string;
  attempts: number;
  completions: number;
  completionRate: number;
};

export type HardestQuestion = {
  id: string;
  question: string;
  type: string;
  difficulty: string;
  attempts: number;
  correct: number;
  accuracy: number;
};

export type DifficultyStats = {
  difficulty: string;
  attempts: number;
  accuracy: number;
};

export type PracticeStats = {
  totalSessions: number;
  correctSessions: number;
  accuracy: number;
  aiPracticeAnswers: number;
};

export async function getAdminKpis(): Promise<AdminKpis> {
  const since7d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [
    totalUsers,
    newUsers7d,
    activeUsers7d,
    totalLessonsCompleted,
    xpAggregate,
    questionAttemptCount,
    lessonAttemptAggregate,
    streakAggregate,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: since7d } } }),
    prisma.user.count({
      where: {
        updatedAt: { gte: since7d },
      },
    }),
    prisma.lessonAttempt.count({ where: { completed: true } }),
    prisma.user.aggregate({ _sum: { xp: true } }),
    prisma.questionAttempt.count(),
    prisma.lessonAttempt.aggregate({ _avg: { score: true } }),
    prisma.streak.aggregate({ _avg: { currentStreak: true } }),
  ]);

  return {
    totalUsers,
    newUsers7d,
    activeUsers7d,
    totalLessonsCompleted,
    totalXpEarned: xpAggregate._sum.xp ?? 0,
    totalQuestionsAnswered: questionAttemptCount,
    avgCompletionRate: lessonAttemptAggregate._avg.score ?? 0,
    averageStreak: streakAggregate._avg.currentStreak ?? 0,
  };
}

export async function getUserGrowth(
  days = 30,
): Promise<GrowthPoint[]> {
  const start = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  start.setUTCHours(0, 0, 0, 0);

  const users = await prisma.user.findMany({
    where: { createdAt: { gte: start } },
    select: { id: true, createdAt: true, updatedAt: true },
  });

  const activeMap = new Map<string, number>();
  for (const u of users) {
    if (u.updatedAt >= start) {
      const day = u.updatedAt.toISOString().slice(0, 10);
      activeMap.set(day, (activeMap.get(day) ?? 0) + 1);
    }
  }

  const points: GrowthPoint[] = [];
  let runningTotal =
    await prisma.user.count({ where: { createdAt: { lt: start } } });

  for (let i = 0; i < days; i++) {
    const d = new Date(start.getTime() + i * 24 * 60 * 60 * 1000);
    const key = d.toISOString().slice(0, 10);
    const newToday = users.filter(
      (u) => u.createdAt.toISOString().slice(0, 10) === key,
    ).length;
    runningTotal += newToday;
    points.push({
      date: key,
      users: runningTotal,
      newUsers: newToday,
      activeUsers: activeMap.get(key) ?? 0,
    });
  }

  return points;
}

export async function getTopLessons(limit = 10): Promise<TopLesson[]> {
  const attempts = await prisma.lessonAttempt.groupBy({
    by: ["lessonId"],
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
    take: limit,
  });

  if (attempts.length === 0) return [];

  const completions = await prisma.lessonAttempt.groupBy({
    by: ["lessonId"],
    where: { completed: true },
    _count: { id: true },
  });
  const completedMap = new Map(
    completions.map((c) => [c.lessonId, c._count.id]),
  );

  const lessons = await prisma.lesson.findMany({
    where: { id: { in: attempts.map((a) => a.lessonId) } },
    select: {
      id: true,
      title: true,
      unit: {
        select: { module: { select: { path: { select: { title: true } } } } },
      },
    },
  });
  const lessonMap = new Map(lessons.map((l) => [l.id, l]));

  return attempts.map((a) => {
    const lesson = lessonMap.get(a.lessonId);
    const completionsCount = completedMap.get(a.lessonId) ?? 0;
    const attemptsCount = a._count.id;
    return {
      id: a.lessonId,
      title: lesson?.title ?? "Unknown lesson",
      pathTitle:
        lesson?.unit.module.path.title ?? "Unknown path",
      attempts: attemptsCount,
      completions: completionsCount,
      completionRate:
        attemptsCount > 0
          ? Math.round((completionsCount / attemptsCount) * 100)
          : 0,
    };
  });
}

export async function getHardestQuestions(limit = 10): Promise<HardestQuestion[]> {
  const attempts = await prisma.questionAttempt.groupBy({
    by: ["questionId"],
    _count: { id: true },
    where: { isCorrect: true },
  });

  const totals = await prisma.questionAttempt.groupBy({
    by: ["questionId"],
    _count: { id: true },
  });

  const totalMap = new Map(totals.map((t) => [t.questionId, t._count.id]));
  const correctMap = new Map(
    attempts.map((a) => [a.questionId, a._count.id]),
  );

  const qIds = totalMap.size
    ? Array.from(totalMap.keys()).slice(0, 300)
    : [];
  const questions = qIds.length
    ? await prisma.question.findMany({
        where: { id: { in: qIds } },
        select: { id: true, question: true, type: true, difficulty: true },
      })
    : [];
  const qMap = new Map(questions.map((q) => [q.id, q]));

  const stats = Array.from(totalMap.entries())
    .map(([id, attemptsCount]) => {
      const correct = correctMap.get(id) ?? 0;
      const accuracy = attemptsCount > 0 ? correct / attemptsCount : 0;
      const q = qMap.get(id);
      return {
        id,
        question: q?.question ?? "Unknown question",
        type: q?.type ?? "unknown",
        difficulty: q?.difficulty ?? "unknown",
        attempts: attemptsCount,
        correct,
        accuracy,
      };
    })
    .filter((s) => s.attempts >= 1)
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, limit);

  return stats;
}

export async function getDifficultyStats(): Promise<DifficultyStats[]> {
  const byDifficulty = new Map<
    string,
    { attempts: number; correct: number }
  >();

  const questionRows = await prisma.question.findMany({
    select: { id: true, difficulty: true },
  });
  const difficultyByQuestion = new Map(
    questionRows.map((q) => [q.id, q.difficulty]),
  );

  const groupByQuestion = await prisma.questionAttempt.groupBy({
    by: ["questionId", "isCorrect"],
    _count: { id: true },
  });

  for (const g of groupByQuestion) {
    const difficulty = difficultyByQuestion.get(g.questionId) ?? "unknown";
    const bucket = byDifficulty.get(difficulty) ?? {
      attempts: 0,
      correct: 0,
    };
    bucket.attempts += g._count.id;
    if (g.isCorrect) bucket.correct += g._count.id;
    byDifficulty.set(difficulty, bucket);
  }

  return Array.from(byDifficulty.entries())
    .map(([difficulty, v]) => ({
      difficulty,
      attempts: v.attempts,
      accuracy: v.attempts > 0 ? Math.round((v.correct / v.attempts) * 100) : 0,
    }))
    .sort((a, b) => b.attempts - a.attempts);
}

export async function getPracticeStats(): Promise<PracticeStats> {
  const [totalSessions, correctSessions, aiPracticeAnswers] = await Promise.all([
    prisma.practiceSession.count(),
    prisma.practiceSession.count({ where: { isCorrect: true } }),
    prisma.practiceSession.count(),
  ]);

  return {
    totalSessions,
    correctSessions,
    accuracy:
      totalSessions > 0
        ? Math.round((correctSessions / totalSessions) * 100)
        : 0,
    aiPracticeAnswers,
  };
}
