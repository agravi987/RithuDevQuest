"use client";

import type { ContentActionResult } from "@/lib/admin/content-actions";
import {
  createModuleAction,
  createUnitAction,
  createLessonAction,
} from "@/lib/admin/content-actions";
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

type EntityKind = "module" | "unit" | "lesson";

const TITLES: Record<EntityKind, { create: string; desc: string }> = {
  module: {
    create: "Create Module",
    desc: "A module groups units within a path.",
  },
  unit: {
    create: "Create Unit",
    desc: "A unit groups lessons within a module.",
  },
  lesson: {
    create: "Create Lesson",
    desc: "A lesson contains activities and questions.",
  },
};

export function CreateEntityForm({
  kind,
  parentFieldName,
  parentId,
}: {
  kind: EntityKind;
  parentFieldName: string;
  parentId: string;
}) {
  const action =
    kind === "module"
      ? (createModuleAction as (
          prev: ContentActionResult,
          formData: FormData,
        ) => Promise<ContentActionResult>)
      : kind === "unit"
        ? (createUnitAction as (
            prev: ContentActionResult,
            formData: FormData,
          ) => Promise<ContentActionResult>)
        : (createLessonAction as (
            prev: ContentActionResult,
            formData: FormData,
          ) => Promise<ContentActionResult>);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{TITLES[kind].create}</CardTitle>
        <CardDescription>{TITLES[kind].desc}</CardDescription>
      </CardHeader>
      <CardContent>
        <FormShell action={action} submitLabel={"Create"}
          initialState={{ error: undefined }}
        >
          <input type="hidden" name={parentFieldName} value={parentId} />
          <Field
            label="Title"
            name="title"
            placeholder={TITLES[kind].create.replace("Create ", "").toLowerCase()}
            required
          />
          <TextAreaField
            label="Description"
            name="description"
            placeholder="Optional description..."
          />
          <Field
            label="Slug"
            name="slug"
            placeholder="my-slug"
            required
            hint="Lowercase letters, numbers, dashes."
          />
          {kind === "module" && (
            <Field label="Icon" name="icon" placeholder="BookOpen" />
          )}
          {kind === "lesson" && (
            <Field
              label="Estimated minutes"
              name="estimatedMinutes"
              type="number"
              defaultValue="5"
            />
          )}
        </FormShell>
      </CardContent>
    </Card>
  );
}
