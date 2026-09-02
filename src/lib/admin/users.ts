import "server-only";

import { prisma } from "@/lib/db";

export type AdminUserListItem = {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  xp: number;
  level: number;
  bannedAt: Date | null;
  createdAt: Date;
  lessonsCompleted: number;
  streak: number;
};

export type UserDetail = AdminUserListItem & {
  hearts: number;
  heartsResetAt: Date | null;
  bestStreak: number;
  lastActiveAt: Date | null;
  questionsAnswered: number;
  questionAccuracy: number;
  recentLessons: {
    id: string;
    lessonTitle: string;
    score: number;
    completed: boolean;
    xpEarned: number;
    completedAt: Date | null;
  }[];
  recentAchievements: {
    id: string;
    title: string;
    icon: string;
    unlockedAt: Date;
  }[];
  topSkills: {
    id: string;
    name: string;
    mastery: number;
  }[];
};

export async function listUsers(params: {
  query?: string;
  role?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}): Promise<{ users: AdminUserListItem[]; total: number }> {
  const page = Math.max(params.page ?? 1, 1);
  const pageSize = Math.min(Math.max(params.pageSize ?? 25, 1), 100);

  const where: Record<string, unknown> = {};

  if (params.query) {
    where.OR = [
      { name: { contains: params.query, mode: "insensitive" } },
      { email: { contains: params.query, mode: "insensitive" } },
    ];
  }
  if (params.role) {
    where.role = params.role;
  }
  if (params.status === "banned") {
    where.NOT = { bannedAt: null };
  } else if (params.status === "active") {
    where.bannedAt = null;
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        xp: true,
        level: true,
        bannedAt: true,
        createdAt: true,
        _count: { select: { lessonAttempts: true } },
        streak: { select: { currentStreak: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.user.count({ where }),
  ]);

  return {
    users: users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      xp: u.xp,
      level: u.level,
      bannedAt: u.bannedAt,
      createdAt: u.createdAt,
      lessonsCompleted: u._count.lessonAttempts,
      streak: u.streak?.currentStreak ?? 0,
    })),
    total,
  };
}

export async function getUserDetail(userId: string): Promise<UserDetail | null> {
  const [user, attemptsAgg, practiceAgg, recentLessons, recentAchievements, topSkills] =
    await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          xp: true,
          level: true,
          hearts: true,
          heartsResetAt: true,
          bannedAt: true,
          createdAt: true,
          streak: { select: { currentStreak: true, longestStreak: true, lastActiveDate: true } },
        },
      }),
      prisma.lessonAttempt.aggregate({
        where: { userId },
        _count: { id: true },
        _avg: { score: true },
      }),
      prisma.questionAttempt.aggregate({
        where: { userId, isCorrect: true },
        _count: { id: true },
      }),
      prisma.lessonAttempt.findMany({
        where: { userId },
        orderBy: { completedAt: "desc" },
        take: 10,
        select: {
          id: true,
          score: true,
          completed: true,
          xpEarned: true,
          completedAt: true,
          lesson: { select: { title: true } },
        },
      }),
      prisma.userAchievement.findMany({
        where: { userId },
        orderBy: { unlockedAt: "desc" },
        take: 10,
        select: {
          unlockedAt: true,
          achievement: { select: { id: true, title: true, icon: true } },
        },
      }),
      prisma.userSkill.findMany({
        where: { userId },
        orderBy: { mastery: "desc" },
        take: 5,
        select: {
          mastery: true,
          skill: { select: { id: true, name: true } },
        },
      }),
    ]);

  if (!user) return null;

  const totalQuestions = await prisma.questionAttempt.count({
    where: { userId },
  });
  const correctQuestions = practiceAgg._count.id;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    xp: user.xp,
    level: user.level,
    hearts: user.hearts,
    heartsResetAt: user.heartsResetAt,
    bannedAt: user.bannedAt,
    createdAt: user.createdAt,
    lessonsCompleted: attemptsAgg._count.id,
    questionAccuracy: totalQuestions > 0 ? Math.round((correctQuestions / totalQuestions) * 100) : 0,
    questionsAnswered: totalQuestions,
    streak: user.streak?.currentStreak ?? 0,
    bestStreak: user.streak?.longestStreak ?? 0,
    lastActiveAt: user.streak?.lastActiveDate ?? null,
    recentLessons: recentLessons.map((l) => ({
      id: l.id,
      lessonTitle: l.lesson.title,
      score: l.score,
      completed: l.completed,
      xpEarned: l.xpEarned,
      completedAt: l.completedAt,
    })),
    recentAchievements: recentAchievements.map((a) => ({
      id: a.achievement.id,
      title: a.achievement.title,
      icon: a.achievement.icon,
      unlockedAt: a.unlockedAt,
    })),
    topSkills: topSkills.map((s) => ({
      id: s.skill.id,
      name: s.skill.name,
      mastery: s.mastery,
    })),
  };
}
