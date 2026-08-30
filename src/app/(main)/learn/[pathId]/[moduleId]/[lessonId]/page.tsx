import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ChevronLeft } from "lucide-react";

import { LessonPlayer } from "@/components/lesson/lesson-player";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  getLessonQuestions,
  getLessonWithActivities,
  getModuleBySlug,
} from "@/lib/curriculum/queries";
import { canAccessLesson, getNextLesson } from "@/lib/curriculum/navigation";
import type { LessonPlayerData } from "@/lib/lesson/types";
import { getCompletedLessonIds, getRecentQuestionIds } from "@/lib/progress/queries";
import { parseQuestionDifficulty } from "@/lib/quiz/validation";
import { buildRichPayload } from "@/lib/quiz/types";
import { selectQuestionRun } from "@/lib/quiz/selection";
import { getHeartsInfo } from "@/lib/hearts";

type LessonPageProps = {
  params: Promise<{ pathId: string; moduleId: string; lessonId: string }>;
};

export async function generateMetadata({
  params,
}: LessonPageProps): Promise<Metadata> {
  const { pathId, moduleId, lessonId } = await params;
  const lesson = await getLessonWithActivities(pathId, moduleId, lessonId);
  return { title: lesson?.title ?? "Lesson" };
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { pathId, moduleId, lessonId } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const [mod, lesson] = await Promise.all([
    getModuleBySlug(pathId, moduleId),
    getLessonWithActivities(pathId, moduleId, lessonId),
  ]);

  if (!mod || mod.path.slug !== pathId) {
    notFound();
  }
  if (!lesson) {
    notFound();
  }

  const completedLessonIds = await getCompletedLessonIds(session.user.id);
  if (!canAccessLesson(mod.units, completedLessonIds, lesson.id)) {
    redirect(`/learn/${pathId}/${moduleId}`);
  }

  const [questions, user, recentQuestionIds, heartsInfo] = await Promise.all([
    getLessonQuestions(lesson.id),
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { xp: true },
    }),
    getRecentQuestionIds(session.user.id, lesson.id),
    getHeartsInfo(session.user.id),
  ]);

  const selected = selectQuestionRun(
    questions.map((question) => ({
      id: question.id,
      type: question.type as Parameters<typeof selectQuestionRun>[0][number]["type"],
      difficulty: parseQuestionDifficulty(question.difficulty),
      question: question.question,
      options: question.options,
      parts: question.parts,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
      hint: question.hint,
    })),
    { avoidIds: recentQuestionIds },
  );

  const allLessons = mod.units.flatMap((unit) => unit.lessons);
  const completedAfter = new Set([...completedLessonIds, lesson.id]);
  const nextLessonId = getNextLesson(mod.units, completedAfter)?.id ?? null;
  const nextLesson = nextLessonId
    ? (allLessons.find((item) => item.id === nextLessonId) ?? null)
    : null;

  const data: LessonPlayerData = {
    lesson: {
      id: lesson.id,
      title: lesson.title,
      description: lesson.description,
      estimatedMinutes: lesson.estimatedMinutes,
      learningObjectives: lesson.learningObjectives,
    },
    path: { slug: mod.path.slug, title: mod.path.title },
    module: { slug: mod.slug, title: mod.title },
    activities: lesson.activities.map((activity) => {
      const content = activity.content as {
        title?: string;
        body?: string;
        code?: string;
      };
      return {
        id: activity.id,
        type: activity.type === "example" ? "example" : "learn",
        title: content.title ?? "",
        body: content.body ?? "",
        code: content.code,
      };
    }),
    questions: selected.map((question) => {
      const rich = buildRichPayload(question);
      const scenarioParts = Array.isArray(question.parts)
        ? (question.parts as { prompt: string; correctAnswer: string }[])
        : [];
      return {
        id: question.id,
        type: question.type as LessonPlayerData["questions"][number]["type"],
        difficulty: parseQuestionDifficulty(question.difficulty),
        question: question.question,
        options:
          question.type === "scenario" || question.type === "true_false"
            ? null
            : Array.isArray(question.options)
              ? (question.options as string[])
              : null,
        parts:
          question.type === "scenario"
            ? scenarioParts.map((part) => ({ prompt: part.prompt }))
            : null,
        hint: question.hint,
        payload: rich?.payload,
      };
    }),
    moduleHref: `/learn/${pathId}/${moduleId}`,
    nextLessonHref: nextLesson
      ? `/learn/${pathId}/${moduleId}/${nextLesson.slug}`
      : null,
    userXp: user?.xp ?? 0,
    completedBefore: completedLessonIds.includes(lesson.id),
  };

  return (
    <div className="flex flex-col gap-8">
      <Link
        href={data.moduleHref}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="size-4" />
        {mod.title}
      </Link>
      <LessonPlayer
        data={data}
        heartsInfo={heartsInfo}
      />
    </div>
  );
}