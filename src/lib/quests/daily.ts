import "server-only";

import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/db";
import { calculateLevel } from "@/lib/gamification/levels";
import { updateLeagueXp } from "@/lib/league/queries";

type QuestTemplate = {
  type: string;
  title: string;
  description: string;
  target: number;
  xpReward: number;
  icon: string;
};

const QUEST_TEMPLATES: QuestTemplate[] = [
  {
    type: "complete_lessons",
    title: "Lesson Explorer",
    description: "Complete 1 lesson",
    target: 1,
    xpReward: 30,
    icon: "📚",
  },
  {
    type: "complete_lessons",
    title: "Knowledge Seeker",
    description: "Complete 2 lessons",
    target: 2,
    xpReward: 60,
    icon: "🎓",
  },
  {
    type: "answer_questions",
    title: "Quiz Master",
    description: "Answer 5 questions correctly",
    target: 5,
    xpReward: 40,
    icon: "🎯",
  },
  {
    type: "answer_questions",
    title: "Sharp Shooter",
    description: "Answer 10 questions correctly",
    target: 10,
    xpReward: 80,
    icon: "⚡",
  },
  {
    type: "earn_xp",
    title: "XP Hunter",
    description: "Earn 50 XP today",
    target: 50,
    xpReward: 25,
    icon: "💰",
  },
  {
    type: "earn_xp",
    title: "XP Grinder",
    description: "Earn 100 XP today",
    target: 100,
    xpReward: 50,
    icon: "🔥",
  },
  {
    type: "practice",
    title: "Practice Makes Perfect",
    description: "Complete 1 practice session",
    target: 1,
    xpReward: 35,
    icon: "🏋️",
  },
];

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

function generateQuestsForDay(userId: string, date: Date): QuestTemplate[] {
  const dayKey =
    date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
  const seed = dayKey + hashString(userId);
  const rng = seededRandom(seed);

  // Fisher-Yates shuffle for a uniform distribution.
  const shuffled = [...QUEST_TEMPLATES];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
  }
  return shuffled.slice(0, 3);
}

/**
 * Get or create today's daily quests for a user.
 */
export async function getDailyQuests(userId: string) {
  const today = getTodayDate();

  // Check if quests exist for today
  const existing = await prisma.dailyQuest.findMany({
    where: { userId, questDate: today },
    orderBy: { createdAt: "asc" },
  });

  if (existing.length > 0) {
    return existing;
  }

  // Generate new quests for today
  const templates = generateQuestsForDay(userId, today);

  await prisma.dailyQuest.createMany({
    data: templates.map((template) => ({
      userId,
      questDate: today,
      type: template.type,
      title: template.title,
      description: template.description,
      target: template.target,
      xpReward: template.xpReward,
      icon: template.icon,
    })),
    skipDuplicates: true,
  });

  // Fetch and return the quests (handles race condition gracefully)
  return await prisma.dailyQuest.findMany({
    where: { userId, questDate: today },
    orderBy: { createdAt: "asc" },
  });
}

/**
 * Update quest progress when a user completes an action.
 * Returns the total XP awarded from newly completed quests (0 when none).
 *
 * Runs inside a transaction to prevent the lost-update / double-award race
 * across concurrent requests. Any quest XP is applied to the user through the
 * level-aware gamification path (level and league XP are updated too), rather
 * than bare increments that would leave the stored level stale.
 */
export async function updateQuestProgress(
  userId: string,
  type: string,
  amount: number = 1
): Promise<number> {
  const today = getTodayDate();
  const safeAmount = Math.max(0, amount);

  // Progress changed for this user — next dashboard/layout visit must be fresh.
  revalidateTag(`dashboard:${userId}`);
  revalidateTag(`layout:${userId}`);

  const quests = await prisma.dailyQuest.findMany({
    where: { userId, questDate: today, type, completed: false },
  });

  if (quests.length === 0) return 0;

  let totalBonusXp = 0;

  await prisma.$transaction(async (tx) => {
    for (const quest of quests) {
      // Re-read inside the transaction to guard against concurrent updates.
      const fresh = await tx.dailyQuest.findUnique({
        where: { id: quest.id },
      });
      if (!fresh || fresh.completed) continue;

      const newCurrent = Math.min(fresh.current + safeAmount, fresh.target);
      const isCompleted = newCurrent >= fresh.target;

      await tx.dailyQuest.update({
        where: { id: fresh.id },
        data: { current: newCurrent, completed: isCompleted },
      });

      if (isCompleted) {
        totalBonusXp += fresh.xpReward;
      }
    }

    if (totalBonusXp > 0) {
      // Recompute the user's level from their total XP so the stored level
      // stays in sync (quest XP used to bypass the gamification layer).
      const user = await tx.user.findUniqueOrThrow({
        where: { id: userId },
        select: { xp: true },
      });
      const newLevel = calculateLevel(user.xp + totalBonusXp).level;

      await tx.user.update({
        where: { id: userId },
        data: {
          xp: { increment: totalBonusXp },
          level: newLevel,
        },
      });
    }
  });

  // Credit the quest XP to the league (outside the transaction; it is a
  // separate membership increment and safe to apply once per completion).
  if (totalBonusXp > 0) {
    await updateLeagueXp(userId, totalBonusXp);
  }

  return totalBonusXp;
}

/**
 * Get today's quest summary stats.
 */
export async function getDailyQuestSummary(userId: string) {
  const today = getTodayDate();

  const quests = await prisma.dailyQuest.findMany({
    where: { userId, questDate: today },
  });

  const completed = quests.filter((q) => q.completed).length;
  const total = quests.length;
  const totalXpEarned = quests
    .filter((q) => q.completed)
    .reduce((sum, q) => sum + q.xpReward, 0);

  return { quests, completed, total, totalXpEarned };
}
