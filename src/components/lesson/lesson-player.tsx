"use client";

import { useState } from "react";

import { LearnSection } from "@/components/lesson/learn-section";
import { ExampleSection } from "@/components/lesson/example-section";
import { QuestionSection } from "@/components/lesson/question-section";
import { FeedbackSection } from "@/components/lesson/feedback-section";
import { LessonComplete } from "@/components/lesson/lesson-complete";
import { LessonHeader } from "@/components/lesson/lesson-header";
import { completeLesson, submitAnswer } from "@/lib/lesson/actions";
import type {
  CompleteLessonResult,
  LessonActivityData,
  LessonPlayerData,
  LessonQuestionData,
  SubmitAnswerResult,
} from "@/lib/lesson/types";

type ActivityStep = LessonActivityData & { kind: "activity" };
type QuestionStep = LessonQuestionData & { kind: "question" };
type Step = ActivityStep | QuestionStep;

function buildSteps(data: LessonPlayerData): Step[] {
  return [
    ...data.activities.map((activity) => ({
      kind: "activity" as const,
      ...activity,
    })),
    ...data.questions.map((question) => ({
      kind: "question" as const,
      ...question,
    })),
  ];
}

export function LessonPlayer({ data }: { data: LessonPlayerData }) {
  const steps = buildSteps(data);

  const [index, setIndex] = useState(0);
  const [partIndex, setPartIndex] = useState(0);
  const [value, setValue] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<SubmitAnswerResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [xpEarned, setXpEarned] = useState(0);
  const [result, setResult] = useState<CompleteLessonResult | null>(null);
  const [completing, setCompleting] = useState(false);

  const step = steps[index];
  const isLastStep = index === steps.length - 1;

  function resetQuestionState() {
    setValue(null);
    setFeedback(null);
    setPartIndex(0);
  }

  async function handleSubmit() {
    if (!step || step.kind !== "question" || !value) return;

    setSubmitting(true);
    setError(null);
    try {
      const response = await submitAnswer({
        lessonId: data.lesson.id,
        questionId: step.id,
        answer: value,
        partIndex: step.type === "scenario" ? partIndex : undefined,
      });
      setFeedback(response);
      if (response.xpEarned > 0) {
        setXpEarned((previous) => previous + response.xpEarned);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleContinue() {
    if (step?.kind === "question" && !feedback?.isCorrect) return;

    if (isLastStep) {
      setCompleting(true);
      setError(null);
      try {
        const response = await completeLesson({
          lessonId: data.lesson.id,
          questionIds: data.questions.map((question) => question.id),
        });
        setResult(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
        setCompleting(false);
      }
      return;
    }

    if (
      step?.kind === "question" &&
      step.type === "scenario" &&
      feedback?.scenarioComplete === false &&
      partIndex < (step.parts?.length ?? 1) - 1
    ) {
      setPartIndex((previous) => previous + 1);
      setValue(null);
      setFeedback(null);
      return;
    }

    setIndex((previous) => previous + 1);
    resetQuestionState();
  }

  function handleRetry() {
    setFeedback(null);
    setValue(null);
    setError(null);
  }

  if (result) {
    return (
      <LessonComplete
        result={result}
        userXp={data.userXp}
        moduleHref={data.moduleHref}
        nextLessonHref={data.nextLessonHref}
        completedBefore={data.completedBefore}
      />
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <LessonHeader
        title={data.lesson.title}
        completedSteps={index}
        totalSteps={steps.length}
        xpEarned={xpEarned}
      />

      {error && (
        <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      {step?.kind === "activity" &&
        (step.type === "learn" ? (
          <LearnSection
            title={step.title}
            body={step.body}
            onContinue={handleContinue}
          />
        ) : (
          <ExampleSection
            title={step.title}
            body={step.body}
            code={step.code}
            onContinue={handleContinue}
          />
        ))}

      {step?.kind === "question" && !feedback && (
        <QuestionSection
          question={step}
          value={value}
          onValueChange={setValue}
          onSubmit={handleSubmit}
          submitting={submitting}
          partIndex={partIndex}
        />
      )}

      {step?.kind === "question" && feedback && (
        <FeedbackSection
          feedback={feedback}
          onContinue={handleContinue}
          onRetry={handleRetry}
        />
      )}

      {completing && (
        <p className="text-sm text-muted-foreground">Finishing lesson…</p>
      )}
    </div>
  );
}