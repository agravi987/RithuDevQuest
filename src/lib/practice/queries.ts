import { prisma } from "@/lib/db";

/* ════════════════════════════════════════════════════════════════════
   QUICK PRACTICE - Topic listing and random question sampling.
   Pure read helpers; nothing is persisted or gamified here.
   ════════════════════════════════════════════════════════════════════ */

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

/* ─── Topic tree (Career → Path → Module → Skill) ─── */

export type PracticeTopicSkill = {
  id: string; // skill id, or "general" for questions without a skill
  name: string;
  count: number;
};

export type PracticeTopicModule = {
  id: string;
  name: string;
  skills: PracticeTopicSkill[];
};

export type PracticeTopicPath = {
  id: string;
  name: string;
  modules: PracticeTopicModule[];
  questionCount: number;
};

export type PracticeTopicCareer = {
  id: string;
  name: string;
  slug: string;
  paths: PracticeTopicPath[];
  questionCount: number;
};

export type PracticeTopicTree = {
  careers: PracticeTopicCareer[];
  /** Questions with no attached skill, pooled under a single "General" topic. */
  general: PracticeTopicSkill | null;
  totalCount: number;
};

/**
 * Practice topics organized by the curriculum hierarchy
 * (Career → Path → Module → Skill) so the picker can render navigable,
 * collapsible sections instead of one flat pill cloud. Skills are grouped
 * under the module of the lesson that declares them; questions without a
 * skill pool under "General".
 */
export async function getPracticeTopicTree(): Promise<PracticeTopicTree> {
  const [generalCount, skills] = await Promise.all([
    prisma.question.count({
      where: { source: "curriculum", type: { not: "scenario" }, skillId: null },
    }),
    prisma.skill.findMany({
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            questions: { where: { source: "curriculum", type: { not: "scenario" } } },
          },
        },
        lesson: {
          select: {
            unit: {
              select: {
                module: {
                  select: {
                    id: true,
                    title: true,
                    order: true,
                    path: {
                      select: {
                        id: true,
                        title: true,
                        order: true,
                        career: {
                          select: { id: true, title: true, slug: true, order: true },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    }),
  ]);

  return buildPracticeTopicTree(skills, generalCount);
}

/* ─── Pure tree assembly (unit-tested without a database) ─── */

export type SkillTreeRow = {
  id: string;
  name: string;
  _count: { questions: number };
  lesson: {
    unit: {
      module: {
        id: string;
        title: string;
        order: number;
        path: {
          id: string;
          title: string;
          order: number;
          career: { id: string; title: string; slug: string; order: number };
        };
      };
    };
  } | null;
};

/**
 * Assemble the Career → Path → Module → Skill tree from raw skill rows.
 * Pure function so the grouping/sorting rules can be unit-tested directly.
 */
export function buildPracticeTopicTree(
  skills: SkillTreeRow[],
  generalCount: number,
): PracticeTopicTree {
  type ModuleAcc = {
    id: string;
    title: string;
    order: number;
    skills: Map<string, PracticeTopicSkill>;
  };
  type PathAcc = {
    title: string;
    order: number;
    modules: Map<string, ModuleAcc>;
  };
  type CareerAcc = {
    title: string;
    slug: string;
    order: number;
    paths: Map<string, PathAcc>;
  };

  const careers = new Map<string, CareerAcc>();

  for (const skill of skills) {
    const count = skill._count.questions;
    if (count === 0) continue;

    const skillModule = skill.lesson?.unit?.module;
    if (!skillModule) continue;

    const path = skillModule.path;
    const career = path.career;

    let careerAcc = careers.get(career.id);
    if (!careerAcc) {
      careerAcc = { title: career.title, slug: career.slug, order: career.order, paths: new Map() };
      careers.set(career.id, careerAcc);
    }

    let pathAcc = careerAcc.paths.get(path.id);
    if (!pathAcc) {
      pathAcc = { title: path.title, order: path.order, modules: new Map() };
      careerAcc.paths.set(path.id, pathAcc);
    }

    let moduleAcc = pathAcc.modules.get(skillModule.id);
    if (!moduleAcc) {
      moduleAcc = {
        id: skillModule.id,
        title: skillModule.title,
        order: skillModule.order,
        skills: new Map(),
      };
      pathAcc.modules.set(skillModule.id, moduleAcc);
    }

    moduleAcc.skills.set(skill.id, { id: skill.id, name: skill.name, count });
  }

  const careerList: PracticeTopicCareer[] = [...careers.entries()]
    .sort((a, b) => a[1].order - b[1].order)
    .map(([careerId, careerAcc]) => {
      const pathList: PracticeTopicPath[] = [...careerAcc.paths.entries()]
        .sort((a, b) => a[1].order - b[1].order)
        .map(([pathId, pathAcc]) => {
          const moduleList = [...pathAcc.modules.values()].sort(
            (a, b) => a.order - b.order,
          );
          const modules: PracticeTopicModule[] = moduleList.map((m) => ({
            id: m.id,
            name: m.title,
            skills: [...m.skills.values()].sort((a, b) => b.count - a.count),
          }));
          const questionCount = modules.reduce(
            (sum, m) => sum + m.skills.reduce((s, skill) => s + skill.count, 0),
            0,
          );
          return { id: pathId, name: pathAcc.title, modules, questionCount };
        });

      return {
        id: careerId,
        name: careerAcc.title,
        slug: careerAcc.slug,
        paths: pathList,
        questionCount: pathList.reduce((sum, p) => sum + p.questionCount, 0),
      };
    });

  const totalCount = careerList.reduce((sum, c) => sum + c.questionCount, 0);

  return {
    careers: careerList,
    general:
      generalCount > 0
        ? { id: "general", name: "General", count: generalCount }
        : null,
    totalCount,
  };
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
