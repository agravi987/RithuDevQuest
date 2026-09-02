import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { requireAdmin } from "@/lib/admin/auth";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { deleteActivityAction, deleteQuestionAction } from "@/lib/admin/content-actions";
import { AddActivityForm } from "@/components/admin/content/forms/activity-form";
import { AddQuestionForm } from "@/components/admin/content/forms/question-form";
import { EditLessonForm } from "@/components/admin/content/forms/edit-lesson-form";
import { DeleteButton } from "@/components/admin/content/delete-button";

export const metadata: Metadata = {
  title: "Lesson",
};

type Props = {
  params: Promise<{ id: string }>;
};

export default async function AdminLessonDetailPage({ params }: Props) {
  await requireAdmin();
  const { id } = await params;

  const lesson = await prisma.lesson.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      description: true,
      slug: true,
      estimatedMinutes: true,
      unitId: true,
      activities: {
        orderBy: { order: "asc" },
        select: {
          id: true,
          type: true,
          order: true,
          content: true,
        },
      },
      questions: {
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          type: true,
          difficulty: true,
          question: true,
          source: true,
          createdAt: true,
        },
      },
    },
  });
  if (!lesson) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Button asChild variant="outline" size="sm">
          <Link href={`/admin/content/unit/${lesson.unitId}`}>← Unit</Link>
        </Button>
        <h1 className="mt-3 text-2xl font-black tracking-tight">
          {lesson.title}
        </h1>
        <p className="text-sm text-muted-foreground">
          {lesson.slug} · ~{lesson.estimatedMinutes} min
        </p>
      </div>

      <EditLessonForm lesson={lesson} />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Activities ({lesson.activities.length})
          </CardTitle>
          <CardDescription>Learning content steps</CardDescription>
        </CardHeader>
        <CardContent>
          {lesson.activities.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No activities yet — add one below.
            </p>
          ) : (
            <div className="divide-y divide-border/40">
              {lesson.activities.map((a) => (
                <div
                  key={a.id}
                  className="flex items-start justify-between gap-3 py-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{a.type}</Badge>
                      <span className="text-xs text-muted-foreground">
                        #{a.order + 1}
                      </span>
                    </div>
                    <p className="mt-1 text-sm line-clamp-2">
                      {String((a.content as { title?: string })?.title ?? "") || (
                        <span className="text-muted-foreground">
                          {(a.content as { body?: string })?.body?.slice(0, 120)}
                        </span>
                      )}
                    </p>
                  </div>
                  <DeleteButton action={deleteActivityAction} id={a.id} />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AddActivityForm lessonId={id} />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Questions ({lesson.questions.length})
          </CardTitle>
          <CardDescription>Quiz questions for this lesson</CardDescription>
        </CardHeader>
        <CardContent>
          {lesson.questions.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No questions yet — add one below.
            </p>
          ) : (
            <div className="divide-y divide-border/40">
              {lesson.questions.map((q) => (
                <div
                  key={q.id}
                  className="flex items-start justify-between gap-3 py-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{q.type}</Badge>
                      <Badge variant="outline">{q.difficulty}</Badge>
                      {q.source === "ai_generated" && (
                        <Badge variant="default">AI</Badge>
                      )}
                    </div>
                    <p className="mt-1 text-sm line-clamp-2">{q.question}</p>
                  </div>
                  <DeleteButton action={deleteQuestionAction} id={q.id} />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AddQuestionForm lessonId={id} />
    </div>
  );
}

