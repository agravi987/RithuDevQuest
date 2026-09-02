import type { Metadata } from "next";
import Link from "next/link";

import { requireAdmin } from "@/lib/admin/auth";
import { getAiReviewStats, listAiQuestions } from "@/lib/admin/ai";
import { approveQuestionAction, deleteQuestionAction } from "@/lib/admin/ai-actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DeleteButton } from "@/components/admin/content/delete-button";

export const metadata: Metadata = {
  title: "AI Review",
};

function Stat({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-2xl font-black">{value}</CardTitle>
      </CardHeader>
    </Card>
  );
}

export default async function AdminAiReviewPage() {
  await requireAdmin();
  const [stats, questions] = await Promise.all([
    getAiReviewStats(),
    listAiQuestions(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight">AI Review</h1>
        <p className="text-sm text-muted-foreground">
          Review AI-generated questions before they ship into the curriculum.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        <Stat label="Pending review" value={stats.pending} />
        <Stat label="Total questions" value={stats.total} />
        <Stat label="In curriculum" value={stats.curriculum} />
        <Stat label="With attempts" value={stats.withAttemptsCount} />
        <Stat label="Lessons w/ questions" value={stats.lessonsWithQuestions} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Pending AI questions</CardTitle>
          <CardDescription>
            Approve to promote a question into the curriculum, or delete it.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {questions.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No AI-generated questions awaiting review.
            </p>
          ) : (
            <div className="divide-y divide-border/40">
              {questions.map((q) => (
                <div
                  key={q.id}
                  className="flex flex-col gap-3 py-4 sm:flex-row sm:items-start sm:justify-between"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="secondary">{q.type}</Badge>
                      <Badge variant="outline">{q.difficulty}</Badge>
                      <Badge variant="default">AI</Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(q.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="mt-1.5 font-medium">{q.question}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Answer: <span className="text-foreground">{q.correctAnswer}</span>
                    </p>
                    <Link
                      href={`/admin/content/lesson/${q.lessonId}`}
                      className="mt-1 inline-block text-xs font-medium text-primary hover:underline"
                    >
                      {q.moduleTitle ? `${q.moduleTitle} / ` : ""}
                      {q.unitTitle ? `${q.unitTitle} / ` : ""}
                      {q.lessonTitle}
                    </Link>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <form action={approveQuestionAction}>
                      <input type="hidden" name="id" value={q.id} />
                      <Button type="submit" variant="outline" size="sm">
                        Approve
                      </Button>
                    </form>
                    <DeleteButton
                      action={deleteQuestionAction}
                      id={q.id}
                      message="Delete this AI-generated question?"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
