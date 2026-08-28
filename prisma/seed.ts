import "dotenv/config";
import { PrismaClient, Prisma } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

import { devopsCareer } from "../content/curriculum/devops/index";
import { activityTypeOf } from "../src/lib/curriculum/seed";
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

function assertQuestion(lesson: SeedLesson, question: SeedQuestion): void {
  if (!question.question || !question.explanation) {
    throw new Error(
      `Question in lesson ${lesson.slug} requires question and explanation`,
    );
  }
  if (question.type !== "scenario" && !question.correctAnswer) {
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

  await prisma.skill.deleteMany({ where: { lessonId: lessonRecord.id } });
  await prisma.skill.createMany({
    data: lesson.skills.map((skill) => ({
      name: skill.name,
      description: skill.description,
      lessonId: lessonRecord.id,
    })),
  });

  const skills = await prisma.skill.findMany({
    where: { lessonId: lessonRecord.id },
  });

  await prisma.question.deleteMany({ where: { lessonId: lessonRecord.id } });
  if (lesson.questions && lesson.questions.length > 0) {
    await prisma.question.createMany({
      data: lesson.questions.map((question) => ({
        type: question.type,
        difficulty: question.difficulty ?? "beginner",
        question: question.question,
        options:
          (question.options as unknown as Prisma.InputJsonValue) ?? Prisma.JsonNull,
        parts:
          (question.parts as unknown as Prisma.InputJsonValue) ?? Prisma.JsonNull,
        correctAnswer:
          question.correctAnswer ??
          (question.parts?.map((part) => part.correctAnswer).join("|") ??
            "true"),
        explanation: question.explanation,
        hint: question.hint,
        lessonId: lessonRecord.id,
        skillId: skills[0]?.id ?? null,
        source: "curriculum",
      })),
    });
  }

  await prisma.activity.deleteMany({ where: { lessonId: lessonRecord.id } });
  await prisma.activity.createMany({
    data: lesson.activities.map((activity, index) => ({
      type: activityTypeOf(activity),
      content: activity as unknown as Prisma.InputJsonValue,
      order: index,
      lessonId: lessonRecord.id,
    })),
  });

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

async function main() {
  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
  });

  try {
    await prisma.$transaction(async (tx) => {
      await seedCareer(tx as unknown as PrismaClient, devopsCareer);
      await seedAchievements(tx as unknown as PrismaClient);
    });

    console.log("Seeded curriculum:");
    console.log(`- Career: ${devopsCareer.title}`);

    for (const path of devopsCareer.paths) {
      const lessonCount = path.modules.reduce(
        (sum, m) => sum + m.units.reduce((s, u) => s + u.lessons.length, 0),
        0,
      );
      console.log(`  - ${path.title}: ${lessonCount} lessons`);
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});