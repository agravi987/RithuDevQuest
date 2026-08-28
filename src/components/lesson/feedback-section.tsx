import { Check, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { MarkdownText } from "@/components/lesson/markdown";
import type { SubmitAnswerResult } from "@/lib/lesson/types";
import { cn } from "@/lib/utils";

type FeedbackSectionProps = {
  feedback: SubmitAnswerResult;
  onContinue: () => void;
  onRetry: () => void;
};

export function FeedbackSection({
  feedback,
  onContinue,
  onRetry,
}: FeedbackSectionProps) {
  const correct = feedback.isCorrect;
  const isScenario =
    feedback.partIndex !== null && feedback.totalParts !== null;
  const scenarioComplete = feedback.scenarioComplete === true;

  const headline = !correct
    ? "Not quite"
    : isScenario && scenarioComplete
      ? "Scenario complete!"
      : isScenario
        ? `Part ${feedback.partIndex! + 1} correct`
        : "Correct!";

  return (
    <section
      className={cn(
        "rounded-xl border p-4",
        correct
          ? "border-primary/40 bg-primary/10"
          : "border-destructive/40 bg-destructive/10",
      )}
    >
      <div className="flex items-center gap-2">
        {correct ? (
          <Check className="size-5 text-primary" />
        ) : (
          <X className="size-5 text-destructive" />
        )}
        <p
          className={cn(
            "font-semibold",
            correct ? "text-primary" : "text-destructive",
          )}
        >
          {headline}
        </p>
      </div>

      {(!isScenario || scenarioComplete) && (
        <div className="mt-2 text-sm text-muted-foreground">
          <MarkdownText text={feedback.explanation} />
        </div>
      )}

      {!correct && (
        <p className="mt-2 text-sm font-medium text-foreground">
          Correct answer: {feedback.correctAnswer}
        </p>
      )}
      {!correct && feedback.hint && (
        <p className="mt-2 text-sm italic text-muted-foreground">
          Hint: {feedback.hint}
        </p>
      )}

      <div className="mt-4 flex justify-end gap-2">
        {correct ? (
          <Button onClick={onContinue}>Continue</Button>
        ) : (
          <Button variant="secondary" onClick={onRetry}>
            Try again
          </Button>
        )}
      </div>
    </section>
  );
}