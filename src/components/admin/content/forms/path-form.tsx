"use client";

import { createPathAction } from "@/lib/admin/content-actions";
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

export function CreatePathForm({ careerId }: { careerId: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Create Learning Path</CardTitle>
        <CardDescription>
          A path is a sequence of modules within a career.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FormShell action={createPathAction} submitLabel="Create path">
          <input type="hidden" name="careerId" value={careerId} />
          <Field
            label="Title"
            name="title"
            placeholder="Linux Fundamentals"
            required
          />
          <TextAreaField
            label="Description"
            name="description"
            placeholder="What this path covers..."
          />
          <Field
            label="Slug"
            name="slug"
            placeholder="linux-fundamentals"
            required
            hint="Lowercase letters, numbers, dashes."
          />
        </FormShell>
      </CardContent>
    </Card>
  );
}
