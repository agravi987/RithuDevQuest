import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MarkdownText } from "@/components/lesson/markdown";
import type { LessonQuestionData } from "@/lib/lesson/types";

type QuestionSectionProps = {
  question: LessonQuestionData;
  value: string | null;
  onValueChange: (value: string) => void;
  onSubmit: () => void;
  submitting: boolean;
  /** Current part index for scenario questions; null otherwise. */
  partIndex: number | null;
};

export function QuestionSection({
  question,
  value,
  onValueChange,
  onSubmit,
  submitting,
  partIndex,
}: QuestionSectionProps) {
  const [showHint, setShowHint] = useState(false);

  const isScenario = question.type === "scenario";
  const isTyped = question.type === "command" || isScenario;
  const totalParts = question.parts?.length ?? 0;

  const prompt =
    isScenario && partIndex !== null && totalParts > 0
      ? (question.parts?.[partIndex]?.prompt ?? question.question)
      : question.question;

  const options =
    question.type === "true_false"
      ? [
          { value: "true", label: "True" },
          { value: "false", label: "False" },
        ]
      : (question.options ?? []).map((option) => ({
          value: option,
          label: option,
        }));

  const canSubmit = isTyped
    ? (value ?? "").trim().length > 0
    : value !== null;

  return (
    <section className="flex flex-col gap-6">
      {isScenario && (
        <div className="rounded-lg border border-border bg-muted/50 px-4 py-3 text-sm">
          <MarkdownText text={question.question} />
        </div>
      )}

      <div className="flex flex-col gap-3">
        {isScenario && partIndex !== null && totalParts > 0 && (
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Part {partIndex + 1} of {totalParts}
          </p>
        )}

        <h2 className="text-xl font-semibold tracking-tight">{prompt}</h2>

        {isTyped ? (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              onSubmit();
            }}
            className="flex flex-col gap-3"
          >
            <Input
              value={value ?? ""}
              onChange={(event) => onValueChange(event.target.value)}
              aria-label={
                isScenario
                  ? `Answer for part ${partIndex! + 1}`
                  : question.type === "command"
                    ? "Command answer"
                    : "Your answer"
              }
              placeholder={
                question.type === "command"
                  ? "Type a command…"
                  : "Type your answer…"
              }
              disabled={submitting}
              className="font-mono"
            />
            <Button
              type="submit"
              disabled={!canSubmit || submitting}
              className="self-end"
            >
              {submitting ? "Checking…" : "Check answer"}
            </Button>
          </form>
        ) : (
          <>
            <div className="grid gap-2">
              {options.map((option) => {
                const isSelected = value === option.value;
                return (
                  <Button
                    key={option.value}
                    type="button"
                    variant={isSelected ? "default" : "outline"}
                    onClick={() => onValueChange(option.value)}
                    className="h-auto justify-start py-3 text-left"
                  >
                    {option.label}
                  </Button>
                );
              })}
            </div>
            <Button
              onClick={onSubmit}
              disabled={!canSubmit || submitting}
              className="self-end"
            >
              {submitting ? "Checking…" : "Check answer"}
            </Button>
          </>
        )}

        {question.hint &&
          (showHint ? (
            <p className="text-sm italic text-muted-foreground">
              Hint: {question.hint}
            </p>
          ) : (
            <Button
              type="button"
              variant="ghost"
              className="self-start px-1 text-xs text-muted-foreground"
              onClick={() => setShowHint(true)}
            >
              Show hint
            </Button>
          ))}
      </div>
    </section>
  );
}