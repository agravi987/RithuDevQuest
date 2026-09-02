"use client";

import { createAchievementAction } from "@/lib/admin/content-actions";
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

const ICON_OPTIONS = [
  "Flame",
  "Zap",
  "Target",
  "Award",
  "Terminal",
  "Shield",
  "Crown",
  "Star",
  "BookOpen",
];

export function CreateAchievementForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Create Achievement</CardTitle>
        <CardDescription>
          Define a badge learners can unlock.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FormShell action={createAchievementAction} submitLabel="Create achievement">
          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label="Title"
              name="title"
              placeholder="First Steps"
              required
            />
            <div className="flex flex-col gap-1.5">
              <label htmlFor="icon" className="text-sm font-medium">
                Icon <span className="text-destructive">*</span>
              </label>
              <select
                id="icon"
                name="icon"
                defaultValue="Award"
                className="h-8 w-full rounded-lg border border-input bg-transparent px-2 text-sm"
              >
                {ICON_OPTIONS.map((i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <TextAreaField
            label="Description"
            name="description"
            placeholder="What this badge rewards..."
            required
            rows={2}
          />
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="category" className="text-sm font-medium">
                Category <span className="text-destructive">*</span>
              </label>
              <select
                id="category"
                name="category"
                defaultValue="general"
                className="h-8 w-full rounded-lg border border-input bg-transparent px-2 text-sm"
              >
                <option value="streak">Streak</option>
                <option value="learning">Learning</option>
                <option value="mastery">Mastery</option>
                <option value="special">Special</option>
                <option value="general">General</option>
              </select>
            </div>
            <Field
              label="Condition"
              name="condition"
              placeholder="first_lesson"
              required
              hint="Lowercase with underscores, unique."
            />
            <Field
              label="XP reward"
              name="xpReward"
              type="number"
              defaultValue="50"
            />
          </div>
          <Field
            label="Threshold (optional)"
            name="threshold"
            type="number"
            placeholder="e.g. 3"
          />
        </FormShell>
      </CardContent>
    </Card>
  );
}
