import "dotenv/config";
import { PrismaClient, Prisma } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaNeon } from "@prisma/adapter-neon";

import { allCareers } from "../content/curriculum/index";
import { activityTypeOf } from "../src/lib/curriculum/seed";
import { encodeRichQuestion } from "../src/lib/quiz/types";
import { planQuestionReseed } from "../src/lib/curriculum/reseed";
import type {
  SeedCareer,
  SeedPath,
  SeedModule,
  SeedQuestion,
  SeedUnit,
  SeedLesson,
} from "../src/lib/curriculum/seed";

function assertSeedShape(career: SeedCareer): void {
  if (!career.title || !career.slug) {
    throw new Error("Career requires title and slug");
  }
  for (const path of career.paths) {
    if (!path.title || !path.slug || path.modules.length === 0) {
      throw new Error(`Invalid path: ${path.slug ?? path.title}`);
    }
    for (const mod of path.modules) {
      assertModule(mod);
    }
  }
}

function assertModule(mod: SeedModule): void {
  if (!mod.title || !mod.slug || mod.units.length === 0) {
    throw new Error(`Invalid module: ${mod.slug ?? mod.title}`);
  }
  for (const unit of mod.units) {
    assertUnit(unit);
  }
}

function assertUnit(unit: SeedUnit): void {
  if (!unit.title || !unit.slug || unit.lessons.length === 0) {
    throw new Error(`Invalid unit: ${unit.slug ?? unit.title}`);
  }
  for (const lesson of unit.lessons) {
    assertLesson(lesson);
  }
}

function assertLesson(lesson: SeedLesson): void {
  if (!lesson.title || !lesson.slug) {
    throw new Error(`Invalid lesson: ${lesson.slug ?? lesson.title}`);
  }
  if (lesson.learningObjectives.length === 0) {
    throw new Error(`Lesson ${lesson.slug} requires learning objectives`);
  }
  if (lesson.activities.length === 0) {
    throw new Error(`Lesson ${lesson.slug} requires at least one activity`);
  }
  for (const question of lesson.questions ?? []) {
    assertQuestion(lesson, question);
  }
}

const RICH_TYPES = new Set([
  "fill_blank",
  "multi_select",
  "match",
  "sequence",
  "code_completion",
  "word_scramble",
  "flip_cards",
]);

function assertQuestion(lesson: SeedLesson, question: SeedQuestion): void {
  if (!question.question || !question.explanation) {
    throw new Error(
      `Question in lesson ${lesson.slug} requires question and explanation`,
    );
  }
  if (
    question.type !== "scenario" &&
    !RICH_TYPES.has(question.type) &&
    !question.correctAnswer
  ) {
    throw new Error(
      `Question in lesson ${lesson.slug} requires a correctAnswer`,
    );
  }
  if (
    question.type === "mcq" &&
    (!question.options || question.options.length < 2)
  ) {
    throw new Error(
      `MCQ in lesson ${lesson.slug} requires at least two options`,
    );
  }
  if (question.type === "mcq" && question.parts) {
    throw new Error(`MCQ in lesson ${lesson.slug} must not define parts`);
  }
  if (question.type === "scenario") {
    if (!question.parts || question.parts.length < 2) {
      throw new Error(
        `Scenario in lesson ${lesson.slug} requires at least two parts`,
      );
    }
    for (const part of question.parts) {
      if (!part.prompt || !part.correctAnswer) {
        throw new Error(
          `Scenario part in lesson ${lesson.slug} requires prompt and correctAnswer`,
        );
      }
    }
  }
  if (question.type === "fill_blank") {
    if (!question.fillBlanks || question.fillBlanks.length < 1) {
      throw new Error(
        `Fill-blank in lesson ${lesson.slug} requires fillBlanks`,
      );
    }
  }
  if (question.type === "multi_select") {
    if (!question.multiSelectOptions || question.multiSelectOptions.length < 2) {
      throw new Error(
        `Multi-select in lesson ${lesson.slug} requires at least two options`,
      );
    }
    if (!question.multiSelectOptions.some((option) => option.isCorrect)) {
      throw new Error(
        `Multi-select in lesson ${lesson.slug} requires at least one correct option`,
      );
    }
  }
  if (question.type === "match") {
    if (!question.matchPairs || question.matchPairs.length < 2) {
      throw new Error(
        `Match in lesson ${lesson.slug} requires at least two pairs`,
      );
    }
  }
  if (question.type === "sequence") {
    if (!question.sequenceItems || question.sequenceItems.length < 2) {
      throw new Error(
        `Sequence in lesson ${lesson.slug} requires at least two items`,
      );
    }
    const ids = new Set(question.sequenceItems.map((item) => item.id));
    if (
      question.sequenceCorrectOrder &&
      !question.sequenceCorrectOrder.every((id) => ids.has(id))
    ) {
      throw new Error(
        `Sequence in lesson ${lesson.slug} has unknown ids in the correct order`,
      );
    }
  }
  if (question.type === "code_completion") {
    if (!question.codeBlanks || question.codeBlanks.length < 1) {
      throw new Error(
        `Code-completion in lesson ${lesson.slug} requires codeBlanks`,
      );
    }
  }
  if (question.type === "word_scramble") {
    if (!question.scrambledWord) {
      throw new Error(
        `Word-scramble in lesson ${lesson.slug} requires scrambledWord`,
      );
    }
  }
  if (question.type === "flip_cards") {
    if (!question.flipCards || question.flipCards.length < 1) {
      throw new Error(
        `Flip-cards in lesson ${lesson.slug} requires flipCards`,
      );
    }
  }
}

async function upsertCareer(prisma: PrismaClient, career: SeedCareer) {
  return prisma.career.upsert({
    where: { slug: career.slug },
    create: {
      title: career.title,
      description: career.description,
      slug: career.slug,
      order: 0,
    },
    update: {
      title: career.title,
      description: career.description,
    },
  });
}

async function upsertPath(
  prisma: PrismaClient,
  careerId: string,
  path: SeedPath,
  pathOrder: number,
) {
  return prisma.learningPath.upsert({
    where: { careerId_slug: { careerId, slug: path.slug } },
    create: {
      title: path.title,
      description: path.description,
      slug: path.slug,
      order: pathOrder,
      careerId,
    },
    update: {
      title: path.title,
      description: path.description,
      order: pathOrder,
    },
  });
}

async function upsertModule(
  prisma: PrismaClient,
  pathId: string,
  mod: SeedModule,
  moduleOrder: number,
) {
  return prisma.module.upsert({
    where: { pathId_slug: { pathId, slug: mod.slug } },
    create: {
      title: mod.title,
      description: mod.description,
      slug: mod.slug,
      icon: mod.icon,
      order: moduleOrder,
      pathId,
    },
    update: {
      title: mod.title,
      description: mod.description,
      icon: mod.icon,
      order: moduleOrder,
    },
  });
}

async function upsertUnit(
  prisma: PrismaClient,
  moduleId: string,
  unit: SeedUnit,
  unitOrder: number,
) {
  return prisma.unit.upsert({
    where: { moduleId_slug: { moduleId, slug: unit.slug } },
    create: {
      title: unit.title,
      description: unit.description,
      slug: unit.slug,
      order: unitOrder,
      moduleId,
    },
    update: {
      title: unit.title,
      description: unit.description,
      order: unitOrder,
    },
  });
}

async function upsertLesson(
  prisma: PrismaClient,
  unitId: string,
  lesson: SeedLesson,
  lessonOrder: number,
) {
  const lessonRecord = await prisma.lesson.upsert({
    where: { unitId_slug: { unitId, slug: lesson.slug } },
    create: {
      title: lesson.title,
      description: lesson.description,
      slug: lesson.slug,
      order: lessonOrder,
      estimatedMinutes: lesson.estimatedMinutes ?? 5,
      learningObjectives: lesson.learningObjectives,
      unitId,
    },
    update: {
      title: lesson.title,
      description: lesson.description,
      order: lessonOrder,
      estimatedMinutes: lesson.estimatedMinutes ?? 5,
      learningObjectives: lesson.learningObjectives,
    },
  });

  // --- Skills: upsert by lessonId+name, delete only stale unused skills ---
  const upsertedSkills = await Promise.all(
    lesson.skills.map((skill) =>
      prisma.skill.upsert({
        where: {
          lessonId_name: { lessonId: lessonRecord.id, name: skill.name },
        },
        create: {
          name: skill.name,
          description: skill.description,
          lessonId: lessonRecord.id,
        },
        update: { description: skill.description },
      }),
    ),
  );

  const seedSkillNames = new Set(lesson.skills.map((s) => s.name));
  const allLessonSkills = await prisma.skill.findMany({
    where: { lessonId: lessonRecord.id },
    include: { _count: { select: { userSkills: true } } },
  });
  const staleSkillIds = allLessonSkills
    .filter((s) => !seedSkillNames.has(s.name) && s._count.userSkills === 0)
    .map((s) => s.id);
  if (staleSkillIds.length > 0) {
    await prisma.skill.deleteMany({ where: { id: { in: staleSkillIds } } });
  }

  // --- Questions: match by type+text, preserve IDs and attempt history ---
  const primarySkillId = upsertedSkills[0]?.id ?? null;

  const existingQuestions = await prisma.question.findMany({
    where: { lessonId: lessonRecord.id },
    select: { id: true, type: true, question: true },
  });
  const plan = planQuestionReseed(lesson.questions ?? [], existingQuestions);

  const questionData = (seed: SeedQuestion) => {
    const encoded = encodeRichQuestion(seed);
    return {
      type: seed.type,
      difficulty: seed.difficulty ?? "beginner",
      question: seed.question,
      options:
        (encoded.options as unknown as Prisma.InputJsonValue) ??
        Prisma.JsonNull,
      parts:
        (encoded.parts as unknown as Prisma.InputJsonValue) ?? Prisma.JsonNull,
      correctAnswer: encoded.correctAnswer,
      explanation: seed.explanation,
      hint: seed.hint,
      skillId: primarySkillId,
      source: "curriculum",
    };
  };

  for (const { id, question } of plan.updates) {
    await prisma.question.update({
      where: { id },
      data: questionData(question),
    });
  }

  for (const question of plan.creates) {
    await prisma.question.create({
      data: { ...questionData(question), lessonId: lessonRecord.id },
    });
  }

  // --- Activities: reconcile by order, preserve extras ---
  const existingActivities = await prisma.activity.findMany({
    where: { lessonId: lessonRecord.id },
    orderBy: { order: "asc" },
  });
  const existingByOrder = new Map(existingActivities.map((a) => [a.order, a]));

  for (let i = 0; i < lesson.activities.length; i++) {
    const seedActivity = lesson.activities[i];
    const activityType = activityTypeOf(seedActivity);
    const content = seedActivity as unknown as Prisma.InputJsonValue;
    const existing = existingByOrder.get(i);

    if (existing) {
      await prisma.activity.update({
        where: { id: existing.id },
        data: { type: activityType, content },
      });
    } else {
      await prisma.activity.create({
        data: {
          type: activityType,
          content,
          order: i,
          lessonId: lessonRecord.id,
        },
      });
    }
  }

  return lessonRecord;
}

async function seedCareer(prisma: PrismaClient, career: SeedCareer) {
  assertSeedShape(career);

  const careerRecord = await upsertCareer(prisma, career);

  for (const [pathIndex, path] of career.paths.entries()) {
    const pathRecord = await upsertPath(prisma, careerRecord.id, path, pathIndex);

    for (const [moduleIndex, mod] of path.modules.entries()) {
      const moduleRecord = await upsertModule(
        prisma,
        pathRecord.id,
        mod,
        moduleIndex,
      );

      for (const [unitIndex, unit] of mod.units.entries()) {
        const unitRecord = await upsertUnit(prisma, moduleRecord.id, unit, unitIndex);

        for (const [lessonIndex, lesson] of unit.lessons.entries()) {
          await upsertLesson(prisma, unitRecord.id, lesson, lessonIndex);
        }
      }
    }
  }

  return careerRecord;
}

export const defaultAchievements = [
  {
    condition: "first_lesson",
    title: "First Quest",
    description: "Complete your very first DevOps lesson.",
    icon: "Award",
    category: "learning",
    threshold: 1,
    xpReward: 50,
  },
  {
    condition: "streak_3",
    title: "On Fire",
    description: "Maintain a 3-day learning streak.",
    icon: "Flame",
    category: "streak",
    threshold: 3,
    xpReward: 75,
  },
  {
    condition: "streak_7",
    title: "Unstoppable",
    description: "Maintain a 7-day learning streak.",
    icon: "Flame",
    category: "streak",
    threshold: 7,
    xpReward: 150,
  },
  {
    condition: "perfect_lesson",
    title: "Flawless Execution",
    description: "Complete a lesson with 100% first-try accuracy.",
    icon: "Star",
    category: "mastery",
    threshold: 100,
    xpReward: 50,
  },
  {
    condition: "lessons_5",
    title: "Knowledge Seeker",
    description: "Complete 5 lessons across any learning path.",
    icon: "BookOpen",
    category: "learning",
    threshold: 5,
    xpReward: 100,
  },
  {
    condition: "lessons_10",
    title: "DevOps Explorer",
    description: "Complete 10 lessons across any learning path.",
    icon: "Terminal",
    category: "learning",
    threshold: 10,
    xpReward: 200,
  },
  {
    condition: "level_3",
    title: "Terminal Explorer",
    description: "Reach Player Level 3.",
    icon: "Shield",
    category: "special",
    threshold: 3,
    xpReward: 100,
  },
  {
    condition: "level_5",
    title: "Container Cadet",
    description: "Reach Player Level 5.",
    icon: "Crown",
    category: "special",
    threshold: 5,
    xpReward: 250,
  },
  {
    condition: "xp_500",
    title: "XP Hunter",
    description: "Accumulate 500 total XP.",
    icon: "Zap",
    category: "special",
    threshold: 500,
    xpReward: 100,
  },
  {
    condition: "xp_1000",
    title: "Centurion",
    description: "Accumulate 1,000 total XP.",
    icon: "Target",
    category: "special",
    threshold: 1000,
    xpReward: 200,
  },
];

async function seedAchievements(prisma: PrismaClient) {
  for (const ach of defaultAchievements) {
    await prisma.achievement.upsert({
      where: { condition: ach.condition },
      create: ach,
      update: ach,
    });
  }
}

async function seedAdminUser(prisma: PrismaClient) {
  const adminEmail = process.env.ADMIN_EMAIL ?? "test@rithudevquest.dev";

  const existing = await prisma.user.findUnique({
    where: { email: adminEmail },
    select: { id: true },
  });

  if (!existing) {
    console.log(
      `Admin user "${adminEmail}" not found — register an account with this email first, or set ADMIN_EMAIL in .env.`,
    );
    return;
  }

  await prisma.user.update({
    where: { id: existing.id },
    data: { role: "admin" },
  });

  console.log(`Promoted "${adminEmail}" to admin role.`);
}

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not defined");
  }

  const isNeon =
    process.env.DATABASE_ADAPTER === "neon" ||
    connectionString.includes("neon.tech") ||
    connectionString.includes("neon.database");

  const adapter = isNeon
    ? new PrismaNeon({ connectionString })
    : new PrismaPg({ connectionString });

  const prisma = new PrismaClient({ adapter });

  try {
    for (const career of allCareers) {
      await seedCareer(prisma, career);
    }
    await seedAchievements(prisma);
    await seedAdminUser(prisma);

    console.log("Seeded curriculum:");

    for (const career of allCareers) {
      console.log(`- Career: ${career.title}`);

      for (const path of career.paths) {
        const lessonCount = path.modules.reduce(
          (sum, m) => sum + m.units.reduce((s, u) => s + u.lessons.length, 0),
          0,
        );
        console.log(`  - ${path.title}: ${lessonCount} lessons`);
      }
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});