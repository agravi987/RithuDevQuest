"use client";

import { useState } from "react";

import { addQuestionAction } from "@/lib/admin/content-actions";
import { adminQuestionTypeOptions } from "@/lib/admin/content-validation";
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
                {adminQuestionTypeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
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

          {/* Common fields: mcq, true_false */}
          <Field
            label="Correct answer"
            name="correctAnswer"
            placeholder={
              type === "mcq"
                ? "Exact text of the correct option"
                : "true or false"
            }
            required
            hidden={type !== "mcq" && type !== "true_false"}
          />
          <TextAreaField
            label="Options (one per line)"
            name="options"
            placeholder="First option\nSecond option\nThird option\nFourth option"
            hint="List all options, one per line. For MCQ: include the correct answer as one of the lines."
            rows={4}
            hidden={type !== "mcq"}
          />

          {/* Scenario parts */}
          <TextAreaField
            label="Parts (JSON array)"
            name="parts"
            placeholder='[{"prompt":"Step 1","correctAnswer":"ls"}]'
            hint="JSON array of { prompt, correctAnswer } objects."
            rows={4}
            hidden={type !== "scenario"}
          />

          {/* Fill blank */}
          <TextAreaField
            label="Blanks (JSON array)"
            name="fillBlanks"
            placeholder='[{"answer":"correct","hint":"optional hint"}]'
            hint="JSON array of { answer, hint? } objects."
            rows={3}
            hidden={type !== "fill_blank"}
          />

          {/* Multi-select */}
          <TextAreaField
            label="Options (JSON array)"
            name="multiSelectOptions"
            placeholder='[{"text":"Option A","isCorrect":true},{"text":"Option B","isCorrect":false}]'
            hint="JSON array of { text, isCorrect } objects. At least one must be correct."
            rows={5}
            hidden={type !== "multi_select"}
          />

          {/* Match */}
          <TextAreaField
            label="Pairs (JSON array)"
            name="matchPairs"
            placeholder='[{"left":"Term","right":"Definition"}]'
            hint="JSON array of { left, right } objects."
            rows={4}
            hidden={type !== "match"}
          />

          {/* Sequence */}
          <TextAreaField
            label="Items (JSON array)"
            name="sequenceItems"
            placeholder='[{"id":"a","text":"First step"},{"id":"b","text":"Second step"}]'
            hint="JSON array of { id, text } objects."
            rows={4}
            hidden={type !== "sequence"}
          />
          <TextAreaField
            label="Correct order (JSON array of ids, optional)"
            name="sequenceCorrectOrder"
            placeholder='["b","a"]'
            hint="JSON array of item ids in the correct order. Leave empty to use the order above."
            rows={2}
            hidden={type !== "sequence"}
          />

          {/* Code completion */}
          <TextAreaField
            label="Code blanks (JSON array)"
            name="codeBlanks"
            placeholder='[{"id":"a","answer":"console.log","placeholder":"// your code here"}]'
            hint="JSON array of { id, answer, hint?, placeholder? } objects."
            rows={4}
            hidden={type !== "code_completion"}
          />
          <Field
            label="Language (optional)"
            name="codeLanguage"
            placeholder="e.g. typescript"
            hidden={type !== "code_completion"}
          />

          {/* Word scramble */}
          <Field
            label="Scrambled word"
            name="scrambledWord"
            placeholder="The word the user must unscramble"
            required
            hidden={type !== "word_scramble"}
          />

          {/* Flip cards */}
          <TextAreaField
            label="Cards (JSON array)"
            name="flipCards"
            placeholder='[{"front":"Term","back":"Definition","category":"optional"}]'
            hint="JSON array of { front, back, category? } objects."
            rows={4}
            hidden={type !== "flip_cards"}
          />
        </FormShell>
      </CardContent>
    </Card>
  );
}
