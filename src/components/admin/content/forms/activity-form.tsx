"use client";

import { addActivityAction } from "@/lib/admin/content-actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FormShell,
  TextAreaField,
} from "@/components/admin/content/forms/shared";

export function AddActivityForm({ lessonId }: { lessonId: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Add Activity</CardTitle>
        <CardDescription>
          Add learning content (learn, example, practice, review).
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FormShell action={addActivityAction} submitLabel="Add activity">
          <input type="hidden" name="lessonId" value={lessonId} />
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="type"
              className="text-sm font-medium"
            >
              Type <span className="text-destructive">*</span>
            </label>
            <select
              id="type"
              name="type"
              className="h-8 w-full rounded-lg border border-input bg-transparent px-2 text-sm"
              defaultValue="learn"
            >
              <option value="learn">Learn</option>
              <option value="example">Example</option>
              <option value="question">Question</option>
              <option value="practice">Practice</option>
              <option value="review">Review</option>
            </select>
          </div>
          <Field label="Title" name="title" placeholder="Optional heading" />
          <TextAreaField
            label="Body"
            name="body"
            placeholder="The learning content / explanation..."
            rows={4}
            required
          />
          <TextAreaField
            label="Code (optional)"
            name="code"
            placeholder="Code block, shown as an example"
            rows={4}
          />
        </FormShell>
      </CardContent>
    </Card>
  );
}
