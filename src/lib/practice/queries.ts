import { prisma } from "@/lib/db";

/* ════════════════════════════════════════════════════════════════════
   QUICK PRACTICE - Topic listing and random question sampling.
   Pure read helpers; nothing is persisted or gamified here.
   ════════════════════════════════════════════════════════════════════ */

export type PracticeTopic = {
  id: string; // "all" | skill id (or "general" for questions without a skill)
  name: string;
  count: number;
};

export type QuickPracticeQuestion = {
  id: string;
  question: string;
  type: string;
  difficulty: string;
  options: unknown[] | null;
  parts: { prompt: string }[] | null;
  correctAnswer: string;
  explanation: string;
  hint: string | null;
};

/**
 * Available practice topics, grouped by the skill attached to each
 * curriculum question. Unskilled questions pool under "General".
 */
export async function getPracticeTopics(): Promise<PracticeTopic[]> {
  const grouped = await prisma.question.groupBy({
    by: ["skillId"],
    where: { source: "curriculum", type: { not: "scenario" } },
    _count: { _all: true },
  });

  const skillIds = grouped
    .map((g) => g.skillId)
    .filter((id): id is string => id !== null);

  const skills = await existingSkills(skillIds);

  const topics = grouped
    .map((group) => {
      const name = group.skillId
        ? skills.get(group.skillId) ?? "General"
        : "General";
      return {
        id: group.skillId ?? "general",
        name,
        count: group._count._all,
      };
    })
    .filter((topic) => topic.count > 0)
    .sort((a, b) => b.count - a.count);

  const total = topics.reduce((sum, topic) => sum + topic.count, 0);
  return [{ id: "all", name: "All Topics", count: total }, ...topics];
}

async function existingSkills(ids: string[]): Promise<Map<string, string>> {
  if (ids.length === 0) return new Map();
  const skills = await prisma.skill.findMany({
    where: { id: { in: ids } },
    select: { id: true, name: true },
  });
  return new Map(skills.map((skill) => [skill.id, skill.name]));
}

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j]!, result[i]!];
  }
  return result;
}

/**
 * Randomly sample curriculum questions, optionally restricted to a single
 * topic. Scenarios are excluded because they require multi-part grading.
 */
export async function getQuickPracticeQuestions(
  topic: string,
  count: number,
): Promise<QuickPracticeQuestion[]> {
  const topicFilter =
    topic === "all"
      ? {}
      : topic === "general"
        ? { skillId: null }
        : { skillId: topic };

  const ids = await prisma.question.findMany({
    where: { source: "curriculum", type: { not: "scenario" }, ...topicFilter },
    select: { id: true },
  });

  const picked = shuffle(ids).slice(0, count).map((q) => q.id);
  if (picked.length === 0) return [];

  const rows = await prisma.question.findMany({
    where: { id: { in: picked } },
    select: {
      id: true,
      question: true,
      type: true,
      difficulty: true,
      options: true,
      parts: true,
      correctAnswer: true,
      explanation: true,
      hint: true,
    },
  });

  const byId = new Map(rows.map((row) => [row.id, row]));
  const ordered = picked
    .map((id) => byId.get(id))
    .filter((row): row is NonNullable<typeof row> => row !== undefined);

  return ordered.map((row) => ({
    id: row.id,
    question: row.question,
    type: row.type,
    difficulty: row.difficulty,
    options: row.options as unknown[] | null,
    parts: row.parts as { prompt: string }[] | null,
    correctAnswer: row.correctAnswer,
    explanation: row.explanation,
    hint: row.hint,
  }));
}