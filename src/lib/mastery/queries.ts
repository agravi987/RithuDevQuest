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
