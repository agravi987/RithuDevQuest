import "server-only";

import { prisma } from "@/lib/db";

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

function generateQuestsForDay(userId: string, date: Date): QuestTemplate[] {
  const seed = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate() + userId.charCodeAt(0);
  const rng = seededRandom(seed);

  // Pick 3 unique quests
  const shuffled = [...QUEST_TEMPLATES].sort(() => rng() - 0.5);
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
 */
export async function updateQuestProgress(
  userId: string,
  type: string,
  amount: number = 1
) {
  const today = getTodayDate();

  const quests = await prisma.dailyQuest.findMany({
    where: { userId, questDate: today, type, completed: false },
  });

  for (const quest of quests) {
    const newCurrent = Math.min(quest.current + amount, quest.target);
    const isCompleted = newCurrent >= quest.target;

    await prisma.dailyQuest.update({
      where: { id: quest.id },
      data: { current: newCurrent, completed: isCompleted },
    });

    // Award XP bonus when quest is completed
    if (isCompleted && !quest.completed) {
      await prisma.user.update({
        where: { id: userId },
        data: { xp: { increment: quest.xpReward } },
      });
    }
  }
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
