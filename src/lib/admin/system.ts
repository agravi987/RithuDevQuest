import "server-only";

import { prisma } from "@/lib/db";

export type SystemStats = {
  users: number;
  lessons: number;
  questions: number;
  careers: number;
  paths: number;
  modules: number;
  units: number;
  activities: number;
  achievements: number;
  questionAttempts: number;
  lessonAttempts: number;
  practiceSessions: number;
};

export async function getSystemStats(): Promise<SystemStats> {
  const [
    users,
    lessons,
    questions,
    careers,
    paths,
    modules,
    units,
    activities,
    achievements,
    questionAttempts,
    lessonAttempts,
    practiceSessions,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.lesson.count(),
    prisma.question.count(),
    prisma.career.count(),
    prisma.learningPath.count(),
    prisma.module.count(),
    prisma.unit.count(),
    prisma.activity.count(),
    prisma.achievement.count(),
    prisma.questionAttempt.count(),
    prisma.lessonAttempt.count(),
    prisma.practiceSession.count(),
  ]);

  return {
    users,
    lessons,
    questions,
    careers,
    paths,
    modules,
    units,
    activities,
    achievements,
    questionAttempts,
    lessonAttempts,
    practiceSessions,
  };
}
