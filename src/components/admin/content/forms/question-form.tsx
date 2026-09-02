"use client";

import { useState } from "react";

import { addQuestionAction } from "@/lib/admin/content-actions";
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

export function AddQuestionForm({ lessonId }: { lessonId: string }) {
  const [type, setType] = useState("mcq");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Add Question</CardTitle>
        <CardDescription>
          Add a quiz question to this lesson.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FormShell action={addQuestionAction} submitLabel="Add question">
          <input type="hidden" name="lessonId" value={lessonId} />
          <input type="hidden" name="source" value="curriculum" />

          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="type" className="text-sm font-medium">
                Type <span className="text-destructive">*</span>
              </label>
              <select
                id="type"
                name="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="h-8 w-full rounded-lg border border-input bg-transparent px-2 text-sm"
              >
                <option value="mcq">Multiple choice</option>
                <option value="true_false">True / False</option>
                <option value="command">Command</option>
                <option value="scenario">Scenario</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="difficulty" className="text-sm font-medium">
                Difficulty <span className="text-destructive">*</span>
              </label>
              <select
                id="difficulty"
                name="difficulty"
                defaultValue="beginner"
                className="h-8 w-full rounded-lg border border-input bg-transparent px-2 text-sm"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          <TextAreaField
            label="Question"
            name="question"
            placeholder="The question prompt..."
            required
            rows={2}
          />
          <Field
            label="Correct answer"
            name="correctAnswer"
            placeholder="The correct answer"
            required
          />
          <TextAreaField
            label="Explanation"
            name="explanation"
            placeholder="Why this is correct..."
            required
            rows={3}
          />
          <Field
            label="Hint (optional)"
            name="hint"
            placeholder="Optional hint shown to learner"
          />

          <TextAreaField
            label="Options (one per line)"
            name="options"
            placeholder={
              type === "true_false"
                ? "True\nFalse"
                : "First option\nSecond option\nThird option\nFourth option"
            }
            hint="For MCQ: first option should be the correct answer; for True/False: use True / False."
            rows={4}
            hidden={type !== "mcq" && type !== "true_false"}
            disabled={type !== "mcq" && type !== "true_false"}
          />

          <TextAreaField
            label="Parts (JSON array)"
            name="parts"
            placeholder='[{"prompt":"Step 1","correctAnswer":"ls"}]'
            hint="JSON array of { prompt, correctAnswer } objects."
            rows={4}
            hidden={type !== "scenario"}
            disabled={type !== "scenario"}
          />
        </FormShell>
      </CardContent>
    </Card>
  );
}
