import "server-only";

import { prisma } from "@/lib/db";
import {
  calculateMasteryScore,
  type CalculatedMastery,
} from "@/lib/mastery/score";
import { parseQuestionDifficulty } from "@/lib/quiz/validation";

export type SkillMasteryOverview = {
  skillId: string;
  skillName: string;
  description: string | null;
  lessonId: string;
  lessonTitle: string;
  lessonSlug: string;
  moduleSlug: string;
  moduleTitle: string;
  pathSlug: string;
  pathTitle: string;
  mastery: CalculatedMastery;
};

export async function getUserSkillsMastery(
  userId: string,
): Promise<SkillMasteryOverview[]> {
  const skills = await prisma.skill.findMany({
    include: {
      lesson: {
        include: {
          unit: {
            include: {
              module: {
                include: {
                  path: true,
                },
              },
            },
          },
        },
      },
      questions: {
        select: {
          id: true,
          difficulty: true,
        },
      },
    },
    orderBy: { name: "asc" },
  });

  const questionIds = skills.flatMap((s) => s.questions.map((q) => q.id));

  const attempts = await prisma.questionAttempt.findMany({
    where: {
      userId,
      questionId: { in: questionIds },
    },
    select: {
      questionId: true,
      isCorrect: true,
      attemptNumber: true,
      answeredAt: true,
      question: { select: { difficulty: true } },
    },
  });

  // Group attempts by skill
  const skillAttemptsMap = new Map<string, typeof attempts>();
  for (const skill of skills) {
    const sQIds = new Set(skill.questions.map((q) => q.id));
    const sAttempts = attempts.filter((a) => sQIds.has(a.questionId));
    skillAttemptsMap.set(skill.id, sAttempts);
  }

  const result: SkillMasteryOverview[] = skills.map((skill) => {
    const sAttempts = skillAttemptsMap.get(skill.id) ?? [];
    const formattedAttempts = sAttempts.map((a) => ({
      isCorrect: a.isCorrect,
      attemptNumber: a.attemptNumber,
      difficulty: parseQuestionDifficulty(a.question.difficulty),
      answeredAt: a.answeredAt,
    }));

    const mastery = calculateMasteryScore(formattedAttempts);

    return {
      skillId: skill.id,
      skillName: skill.name,
      description: skill.description,
      lessonId: skill.lesson.id,
      lessonTitle: skill.lesson.title,
      lessonSlug: skill.lesson.slug,
      moduleSlug: skill.lesson.unit.module.slug,
      moduleTitle: skill.lesson.unit.module.title,
      pathSlug: skill.lesson.unit.module.path.slug,
      pathTitle: skill.lesson.unit.module.path.title,
      mastery,
    };
  });

  return result;
}

export async function getWeakSkills(
  userId: string,
  threshold: number = 80,
): Promise<SkillMasteryOverview[]> {
  const all = await getUserSkillsMastery(userId);
  return all
    .filter((s) => s.mastery.totalAttempts > 0 && s.mastery.score < threshold)
    .sort((a, b) => a.mastery.score - b.mastery.score);
}

export type TopUserSkill = {
  skillId: string;
  skillName: string;
  mastery: CalculatedMastery;
};

/**
 * Top-N skills by mastery for a user. Unlike getUserSkillsMastery this only
 * reads the user's own attempts (indexed by userId) plus the small set of
 * skills those attempts map to — it never drags the whole curriculum in.
 */
export async function getTopUserSkills(
  userId: string,
  limit = 4,
): Promise<TopUserSkill[]> {
  const attempts = await prisma.questionAttempt.findMany({
    where: { userId },
    select: {
      questionId: true,
      isCorrect: true,
      attemptNumber: true,
      answeredAt: true,
      question: { select: { difficulty: true, skillId: true } },
    },
  });

  if (attempts.length === 0) return [];

  const attemptsBySkill = new Map<
    string,
    Array<{
      isCorrect: boolean;
      attemptNumber: number;
      difficulty: "beginner" | "intermediate" | "advanced";
      answeredAt: Date;
    }>
  >();

  const skillIds = new Set<string>();
  for (const attempt of attempts) {
    const skillId = attempt.question.skillId;
    if (!skillId) continue;
    skillIds.add(skillId);

    const list = attemptsBySkill.get(skillId) ?? [];
    list.push({
      isCorrect: attempt.isCorrect,
      attemptNumber: attempt.attemptNumber,
      difficulty: parseQuestionDifficulty(attempt.question.difficulty),
      answeredAt: attempt.answeredAt,
    });
    attemptsBySkill.set(skillId, list);
  }

  if (skillIds.size === 0) return [];

  const skills = await prisma.skill.findMany({
    where: { id: { in: [...skillIds] } },
    select: { id: true, name: true },
  });
  const nameById = new Map(skills.map((skill) => [skill.id, skill.name]));

  return [...attemptsBySkill.entries()]
    .map(([skillId, records]) => ({
      skillId,
      skillName: nameById.get(skillId) ?? "Unknown skill",
      mastery: calculateMasteryScore(records),
    }))
    .sort((a, b) => b.mastery.score - a.mastery.score)
    .slice(0, limit);
}
