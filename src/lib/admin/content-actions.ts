"use server";

import "server-only";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { requireAdmin } from "@/lib/admin/auth";
import { prisma } from "@/lib/db";
import {
  activitySchema,
  achievementInputSchema,
  careerInputSchema,
  lessonInputSchema,
  moduleInputSchema,
  pathInputSchema,
  questionInputSchema,
  unitInputSchema,
} from "@/lib/admin/content-validation";

export type ContentActionResult = { error?: string; success?: string };

const idSchema = z.string().min(1);

function revalidateContent() {
  revalidatePath("/admin/content");
  revalidatePath("/dashboard");
  revalidatePath("/");
}

// ---------- Career ----------

export async function createCareerAction(
  _prev: ContentActionResult,
  formData: FormData,
): Promise<ContentActionResult> {
  try {
    await requireAdmin();
    const parsed = careerInputSchema.safeParse({
      title: formData.get("title"),
      description: formData.get("description"),
      slug: formData.get("slug"),
      order: formData.get("order") ?? "0",
    });
    if (!parsed.success) {
      return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
    }

    const existing = await prisma.career.findUnique({
      where: { slug: parsed.data.slug },
      select: { id: true },
    });
    if (existing) return { error: "A career with this slug already exists." };

    await prisma.career.create({ data: parsed.data });
    revalidateContent();
    return { success: "Career created." };
  } catch (err) {
    if (err instanceof Error) return { error: err.message };
    throw err;
  }
}

export async function updateCareerAction(
  _prev: ContentActionResult,
  formData: FormData,
): Promise<ContentActionResult> {
  try {
    await requireAdmin();
    const id = idSchema.parse(formData.get("id"));
    const parsed = careerInputSchema.safeParse({
      title: formData.get("title"),
      description: formData.get("description"),
      slug: formData.get("slug"),
      order: formData.get("order") ?? "0",
    });
    if (!parsed.success) {
      return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
    }

    await prisma.career.update({ where: { id }, data: parsed.data });
    revalidateContent();
    return { success: "Career updated." };
  } catch (err) {
    if (err instanceof Error && err.name === "ZodError") {
      return { error: "Invalid input" };
    }
    if (err instanceof Error) return { error: err.message };
    throw err;
  }
}

export async function deleteCareerAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = idSchema.parse(formData.get("id"));
  await prisma.career.delete({ where: { id } });
  revalidateContent();
  redirect("/admin/content");
}

// ---------- Learning Path ----------

export async function createPathAction(
  _prev: ContentActionResult,
  formData: FormData,
): Promise<ContentActionResult> {
  try {
    await requireAdmin();
    const careerId = idSchema.parse(formData.get("careerId"));
    const parsed = pathInputSchema.safeParse({
      title: formData.get("title"),
      description: formData.get("description"),
      slug: formData.get("slug"),
    });
    if (!parsed.success) {
      return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
    }

    const order = await prisma.learningPath.count({ where: { careerId } });

    try {
      await prisma.learningPath.create({
        data: { ...parsed.data, careerId, order },
      });
    } catch {
      return { error: "A path with this slug already exists in the career." };
    }

    revalidateContent();
    return { success: "Learning path created." };
  } catch (err) {
    if (err instanceof Error) return { error: err.message };
    throw err;
  }
}

export async function deletePathAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = idSchema.parse(formData.get("id"));
  const path = await prisma.learningPath.findUnique({
    where: { id },
    select: { careerId: true },
  });
  await prisma.learningPath.delete({ where: { id } });
  revalidateContent();
  if (path) redirect(`/admin/content/career/${path.careerId}`);
  redirect("/admin/content");
}

// ---------- Module ----------

export async function createModuleAction(
  _prev: ContentActionResult,
  formData: FormData,
): Promise<ContentActionResult> {
  try {
    await requireAdmin();
    const pathId = idSchema.parse(formData.get("pathId"));
    const parsed = moduleInputSchema.safeParse({
      title: formData.get("title"),
      description: formData.get("description"),
      slug: formData.get("slug"),
      icon: formData.get("icon"),
    });
    if (!parsed.success) {
      return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
    }

    const order = await prisma.module.count({ where: { pathId } });

    try {
      await prisma.module.create({
        data: { ...parsed.data, pathId, order },
      });
    } catch {
      return { error: "A module with this slug already exists in the path." };
    }

    revalidateContent();
    return { success: "Module created." };
  } catch (err) {
    if (err instanceof Error) return { error: err.message };
    throw err;
  }
}

export async function deleteModuleAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = idSchema.parse(formData.get("id"));
  const mod = await prisma.module.findUnique({
    where: { id },
    select: { pathId: true },
  });
  await prisma.module.delete({ where: { id } });
  revalidateContent();
  if (mod) redirect(`/admin/content/path/${mod.pathId}`);
  redirect("/admin/content");
}

// ---------- Unit ----------

export async function createUnitAction(
  _prev: ContentActionResult,
  formData: FormData,
): Promise<ContentActionResult> {
  try {
    await requireAdmin();
    const moduleId = idSchema.parse(formData.get("moduleId"));
    const parsed = unitInputSchema.safeParse({
      title: formData.get("title"),
      description: formData.get("description"),
      slug: formData.get("slug"),
    });
    if (!parsed.success) {
      return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
    }

    const order = await prisma.unit.count({ where: { moduleId } });

    try {
      await prisma.unit.create({
        data: { ...parsed.data, moduleId, order },
      });
    } catch {
      return { error: "A unit with this slug already exists in the module." };
    }

    revalidateContent();
    return { success: "Unit created." };
  } catch (err) {
    if (err instanceof Error) return { error: err.message };
    throw err;
  }
}

export async function deleteUnitAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = idSchema.parse(formData.get("id"));
  const unit = await prisma.unit.findUnique({
    where: { id },
    select: { moduleId: true },
  });
  await prisma.unit.delete({ where: { id } });
  revalidateContent();
  if (unit) redirect(`/admin/content/module/${unit.moduleId}`);
  redirect("/admin/content");
}

// ---------- Lesson ----------

export async function createLessonAction(
  _prev: ContentActionResult,
  formData: FormData,
): Promise<ContentActionResult> {
  try {
    await requireAdmin();
    const unitId = idSchema.parse(formData.get("unitId"));
    const parsed = lessonInputSchema.safeParse({
      title: formData.get("title"),
      description: formData.get("description"),
      slug: formData.get("slug"),
      estimatedMinutes: formData.get("estimatedMinutes") ?? "5",
    });
    if (!parsed.success) {
      return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
    }

    const order = await prisma.lesson.count({ where: { unitId } });

    try {
      await prisma.lesson.create({
        data: {
          title: parsed.data.title,
          description: parsed.data.description,
          slug: parsed.data.slug,
          estimatedMinutes: parsed.data.estimatedMinutes,
          unitId,
          order,
          learningObjectives: [],
        },
      });
    } catch {
      return { error: "A lesson with this slug already exists in the unit." };
    }

    revalidateContent();
    return { success: "Lesson created." };
  } catch (err) {
    if (err instanceof Error) return { error: err.message };
    throw err;
  }
}

export async function updateLessonAction(
  _prev: ContentActionResult,
  formData: FormData,
): Promise<ContentActionResult> {
  try {
    await requireAdmin();
    const id = idSchema.parse(formData.get("id"));
    const parsed = lessonInputSchema.safeParse({
      title: formData.get("title"),
      description: formData.get("description"),
      slug: formData.get("slug"),
      estimatedMinutes: formData.get("estimatedMinutes") ?? "5",
    });
    if (!parsed.success) {
      return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
    }

    await prisma.lesson.update({ where: { id }, data: parsed.data });
    revalidateContent();
    return { success: "Lesson updated." };
  } catch (err) {
    if (err instanceof Error) return { error: err.message };
    throw err;
  }
}

export async function deleteLessonAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = idSchema.parse(formData.get("id"));
  const lesson = await prisma.lesson.findUnique({
    where: { id },
    select: { unitId: true },
  });
  await prisma.lesson.delete({ where: { id } });
  revalidateContent();
  if (lesson) redirect(`/admin/content/unit/${lesson.unitId}`);
  redirect("/admin/content");
}

// ---------- Activity ----------

export async function addActivityAction(
  _prev: ContentActionResult,
  formData: FormData,
): Promise<ContentActionResult> {
  try {
    await requireAdmin();
    const lessonId = idSchema.parse(formData.get("lessonId"));
    const parsed = activitySchema.safeParse({
      type: formData.get("type"),
      title: formData.get("title") || undefined,
      body: formData.get("body"),
      code: formData.get("code") || undefined,
    });
    if (!parsed.success) {
      return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
    }

    const order = await prisma.activity.count({ where: { lessonId } });

    await prisma.activity.create({
      data: {
        lessonId,
        type: parsed.data.type,
        order,
        content: {
          title: parsed.data.title,
          body: parsed.data.body,
          code: parsed.data.code,
        },
      },
    });

    revalidateContent();
    return { success: "Activity added." };
  } catch (err) {
    if (err instanceof Error) return { error: err.message };
    throw err;
  }
}

export async function deleteActivityAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = idSchema.parse(formData.get("id"));
  const activity = await prisma.activity.findUnique({
    where: { id },
    select: { lessonId: true },
  });
  await prisma.activity.delete({ where: { id } });
  revalidateContent();
  if (activity) redirect(`/admin/content/lesson/${activity.lessonId}`);
  redirect("/admin/content");
}

// ---------- Question ----------

export async function addQuestionAction(
  _prev: ContentActionResult,
  formData: FormData,
): Promise<ContentActionResult> {
  try {
    await requireAdmin();
    const lessonId = idSchema.parse(formData.get("lessonId"));

    const rawOptions = formData.get("options");
    const options = rawOptions
      ? rawOptions
          .toString()
          .split("\n")
          .map((o) => o.trim())
          .filter(Boolean)
      : undefined;
    const rawParts = formData.get("parts");
    const parts = rawParts ? JSON.parse(rawParts.toString()) : undefined;

    const parsed = questionInputSchema.safeParse({
      type: formData.get("type"),
      difficulty: formData.get("difficulty"),
      question: formData.get("question"),
      correctAnswer: formData.get("correctAnswer"),
      explanation: formData.get("explanation"),
      hint: formData.get("hint") || undefined,
      options,
      parts,
      source: formData.get("source") || "curriculum",
    });

    if (!parsed.success) {
      return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
    }

    await prisma.question.create({
      data: {
        lessonId,
        type: parsed.data.type,
        difficulty: parsed.data.difficulty,
        question: parsed.data.question,
        correctAnswer: parsed.data.correctAnswer,
        explanation: parsed.data.explanation,
        hint: parsed.data.hint,
        options: parsed.data.options,
        parts: parsed.data.parts,
        source: parsed.data.source,
      },
    });

    revalidateContent();
    return { success: "Question added." };
  } catch (err) {
    if (err instanceof Error) return { error: err.message };
    throw err;
  }
}

export async function deleteQuestionAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = idSchema.parse(formData.get("id"));
  const question = await prisma.question.findUnique({
    where: { id },
    select: { lessonId: true },
  });
  await prisma.question.delete({ where: { id } });
  revalidateContent();
  if (question) redirect(`/admin/content/lesson/${question.lessonId}`);
  redirect("/admin/content");
}

// ---------- Achievement ----------

export async function createAchievementAction(
  _prev: ContentActionResult,
  formData: FormData,
): Promise<ContentActionResult> {
  try {
    await requireAdmin();
    const parsed = achievementInputSchema.safeParse({
      title: formData.get("title"),
      description: formData.get("description"),
      icon: formData.get("icon"),
      category: formData.get("category"),
      condition: formData.get("condition"),
      threshold: formData.get("threshold") || undefined,
      xpReward: formData.get("xpReward") ?? "50",
    });
    if (!parsed.success) {
      return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
    }

    const existing = await prisma.achievement.findUnique({
      where: { condition: parsed.data.condition },
      select: { id: true },
    });
    if (existing) {
      return { error: "An achievement with this condition already exists." };
    }

    await prisma.achievement.create({ data: parsed.data });
    revalidatePath("/admin/content/achievements");
    return { success: "Achievement created." };
  } catch (err) {
    if (err instanceof Error) return { error: err.message };
    throw err;
  }
}

export async function updateAchievementAction(
  _prev: ContentActionResult,
  formData: FormData,
): Promise<ContentActionResult> {
  try {
    await requireAdmin();
    const id = idSchema.parse(formData.get("id"));
    const parsed = achievementInputSchema.safeParse({
      title: formData.get("title"),
      description: formData.get("description"),
      icon: formData.get("icon"),
      category: formData.get("category"),
      condition: formData.get("condition"),
      threshold: formData.get("threshold") || undefined,
      xpReward: formData.get("xpReward") ?? "50",
    });
    if (!parsed.success) {
      return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
    }

    await prisma.achievement.update({ where: { id }, data: parsed.data });
    revalidatePath("/admin/content/achievements");
    return { success: "Achievement updated." };
  } catch (err) {
    if (err instanceof Error) return { error: err.message };
    throw err;
  }
}

export async function deleteAchievementAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = idSchema.parse(formData.get("id"));
  await prisma.achievement.delete({ where: { id } });
  revalidatePath("/admin/content/achievements");
  redirect("/admin/content/achievements");
}
