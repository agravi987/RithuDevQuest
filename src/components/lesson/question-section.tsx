import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MarkdownText } from "@/components/lesson/markdown";
import { RichQuestion } from "@/components/lesson/rich-question";
import { QUESTION_TYPE_META } from "@/lib/quiz/types";
import type { LessonQuestionData } from "@/lib/lesson/types";
import { cn } from "@/lib/utils";

type QuestionSectionProps = {
  question: LessonQuestionData;
  value: string | null;
  onValueChange: (value: string) => void;
  onSubmit: (answer?: string) => void;
  submitting: boolean;
  /** Current part index for scenario questions; null otherwise. */
  partIndex: number | null;
  /** Optional server-side error to associate with the answer input. */
  error?: string;
};

const LETTERS = ["A", "B", "C", "D", "E", "F"];

const RICH_TYPES = new Set([
  "fill_blank",
  "multi_select",
  "match",
  "sequence",
  "code_completion",
  "word_scramble",
  "flip_cards",
]);

export function QuestionSection({
  question,
  value,
  onValueChange,
  onSubmit,
  submitting,
  partIndex,
  error,
}: QuestionSectionProps) {
  const [showHint, setShowHint] = useState(false);

  const isScenario = question.type === "scenario";
  const isTyped = question.type === "command" || isScenario;
  const isRich = RICH_TYPES.has(question.type);
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
          value: String(option),
          label: String(option),
        }));

  const canSubmit = isTyped
    ? (value ?? "").trim().length > 0
    : value !== null;

  // Determine question type badge
  const typeBadge =
    QUESTION_TYPE_META[question.type as keyof typeof QUESTION_TYPE_META] ?? {
      label: "Question",
      color: "bg-muted text-muted-foreground",
    };

  if (isRich) {
    return (
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold ${typeBadge.color}`}
            >
              {typeBadge.label}
            </span>
          </div>

          <h2 className="text-xl font-bold tracking-tight leading-snug">
            {question.question}
          </h2>

          <RichQuestion
            type={question.type}
            question={question.question}
            hint={question.hint}
            payload={question.payload}
            onSubmit={(answer: string) => onSubmit(answer)}
            submitting={submitting}
          />
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-6">
      {/* Scenario context */}
      {isScenario && (          <div className="rounded-2xl border border-achievement/15 bg-achievement/5 p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-achievement">
              Scenario Context
            </span>
          </div>
          <div className="text-sm text-muted-foreground leading-relaxed">
            <MarkdownText text={question.question} />
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {/* Question type badge */}
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold ${typeBadge.color}`}>
            {typeBadge.label}
          </span>
          {isScenario && partIndex !== null && totalParts > 0 && (
            <span className="text-xs font-bold text-muted-foreground">
              Part {partIndex + 1}/{totalParts}
            </span>
          )}
        </div>

        {/* Question prompt */}
        <h2 className="text-xl font-bold tracking-tight leading-snug">{prompt}</h2>

        {/* Answer input */}
        {isTyped ? (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              onSubmit();
            }}
            className="flex flex-col gap-3"
          >
            <div className="relative">
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
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? "question-error" : undefined}
                placeholder={
                  question.type === "command"
                    ? "Type a command…"
                    : "Type your answer…"
                }
                disabled={submitting}
                className="h-12 text-base font-mono rounded-xl border-2 focus:border-primary focus:ring-2 focus:ring-primary/20 input-focus-glow"
              />
              {value && (
                <button
                  type="button"
                  onClick={() => onValueChange("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs font-bold"
                >
                  Clear
                </button>
              )}
            </div>
            {error && (
              <p
                id="question-error"
                role="alert"
                className="text-sm font-medium text-destructive"
              >
                {error}
              </p>
            )}
            <Button
              type="submit"
              disabled={!canSubmit || submitting}
              className="self-end h-11 px-6 rounded-xl font-bold shadow-md shadow-primary/15 hover:shadow-lg hover:shadow-primary/20 transition-all"
            >
              {submitting ? "Checking…" : "Check Answer"}
            </Button>
          </form>
        ) : (
          <>
            {/* MCQ Options - Duolingo style */}
            <div className="grid gap-2.5" role="radiogroup" aria-label="Answer options">
              {options.map((option, index) => {
                const isSelected = value === option.value;
                const letter = LETTERS[index] ?? "?";

                return (
                  <button
                    key={option.value}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => onValueChange(option.value)}
                    disabled={submitting}
                    className={cn(
                      "group flex items-center gap-2 sm:gap-3 rounded-2xl border px-3 sm:px-4 py-3 sm:py-3.5 text-left transition-all duration-200",
                      isSelected
                        ? "border-primary bg-primary/5 shadow-md shadow-primary/10 scale-[1.01] animate-correct-flash"
                        : "border-border bg-card hover:border-primary/30 hover:bg-primary/[0.02] hover:shadow-sm hover:scale-[1.005] active:scale-[0.98]"
                    )}
                  >
                    {/* Letter badge */}
                    <div
                      className={cn(
                        "grid size-8 sm:size-9 shrink-0 place-items-center rounded-xl text-xs sm:text-sm font-black transition-all",
                        isSelected
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                      )}
                    >
                      {letter}
                    </div>

                    {/* Option text */}
                    <span
                      className={cn(
                        "text-sm font-semibold flex-1",
                        isSelected ? "text-primary" : "text-foreground"
                      )}
                    >
                      {option.label}
                    </span>

                    {/* Selection indicator */}
                    <div
                      className={cn(
                        "size-5 shrink-0 rounded-full border transition-all",
                        isSelected
                          ? "border-primary bg-primary scale-110"
                          : "border-border group-hover:border-primary/40"
                      )}
                    >
                      {isSelected && (
                        <div className="size-full grid place-items-center">
                          <div className="size-2 rounded-full bg-white" />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <span className="sr-only" role="status" aria-live="polite">
              {value ? `Selected option ${value}` : ""}
            </span>

            {error && (
              <p
                id="question-error"
                role="alert"
                className="text-sm font-medium text-destructive"
              >
                {error}
              </p>
            )}

            {/* Check button */}
            <Button
              onClick={() => onSubmit()}
              disabled={!canSubmit || submitting}
              className={cn(
                "self-end h-11 px-6 rounded-xl font-bold transition-all duration-200",
                canSubmit
                  ? "bg-primary shadow-md shadow-primary/15 hover:shadow-lg hover:shadow-primary/25 hover:brightness-110 hover:scale-[1.02] active:scale-[0.97] btn-glow"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {submitting ? "Checking…" : "Check Answer"}
            </Button>
          </>
        )}

        {/* Keyboard shortcut hint */}
        {!isTyped && !isRich && (
          <div className="flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground/60 pt-1">
            <span>Press</span>
            <kbd className="kbd">1</kbd>-<kbd className="kbd">{options.length}</kbd>
            <span>to select</span>
            <span className="mx-1">·</span>
            <kbd className="kbd">Enter</kbd>
            <span>to check</span>
          </div>
        )}

        {/* Hint */}
        {question.hint && (
          <div className="rounded-xl bg-muted/50 border border-border/50">
            {showHint ? (
              <div className="px-4 py-3 flex items-start gap-2">
                <span className="text-sm">💡</span>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {question.hint}
                </p>
              </div>
            ) : (
              <button
                type="button"
                className="w-full px-4 py-3 flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setShowHint(true)}
              >
                <span>💡</span>
                <span>Show hint</span>
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
