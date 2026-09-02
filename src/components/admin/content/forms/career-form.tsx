"use client";

import { createCareerAction } from "@/lib/admin/content-actions";
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

export function CreateCareerForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Create Career</CardTitle>
        <CardDescription>
          A career groups learning paths (e.g. DevOps Engineer).
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FormShell action={createCareerAction} submitLabel="Create career">
          <Field
            label="Title"
            name="title"
            placeholder="DevOps Engineer"
            required
          />
          <TextAreaField
            label="Description"
            name="description"
            placeholder="What this career covers..."
          />
          <Field
            label="Slug"
            name="slug"
            placeholder="devops-engineer"
            required
            hint="Lowercase letters, numbers, dashes."
          />
          <Field
            label="Order"
            name="order"
            type="number"
            defaultValue="0"
          />
        </FormShell>
      </CardContent>
    </Card>
  );
}
