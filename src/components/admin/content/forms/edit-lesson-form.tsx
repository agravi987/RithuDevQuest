"use client";

import { updateLessonAction } from "@/lib/admin/content-actions";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FormShell,
  TextAreaField,
} from "@/components/admin/content/forms/shared";

type LessonMeta = {
  id: string;
  title: string;
  description: string | null;
  slug: string;
  estimatedMinutes: number;
};

export function EditLessonForm({ lesson }: { lesson: LessonMeta }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Edit Lesson</CardTitle>
      </CardHeader>
      <CardContent>
        <FormShell action={updateLessonAction} submitLabel="Save lesson">
          <input type="hidden" name="id" value={lesson.id} />
          <Field
            label="Title"
            name="title"
            defaultValue={lesson.title}
            required
          />
          <TextAreaField
            label="Description"
            name="description"
            defaultValue={lesson.description ?? undefined}
          />
          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label="Slug"
              name="slug"
              defaultValue={lesson.slug}
              required
              hint="Lowercase letters, numbers, dashes."
            />
            <Field
              label="Estimated minutes"
              name="estimatedMinutes"
              type="number"
              defaultValue={String(lesson.estimatedMinutes)}
            />
          </div>
        </FormShell>
      </CardContent>
    </Card>
  );
}
