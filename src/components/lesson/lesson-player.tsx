"use client";

import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "motion/react";

import { LearnSection } from "@/components/lesson/learn-section";
import { ExampleSection } from "@/components/lesson/example-section";
import { QuestionSection } from "@/components/lesson/question-section";
import { FeedbackSection } from "@/components/lesson/feedback-section";
import { LessonComplete } from "@/components/lesson/lesson-complete";
import { LessonHeader } from "@/components/lesson/lesson-header";
import { SpaceshipPlayer } from "@/components/galaxy/spaceship-player";
import { completeLesson, submitAnswer } from "@/lib/lesson/actions";
import { correctAnswerConfetti, lessonCompleteConfetti } from "@/lib/confetti";
import {
  playCorrectSound,
  playWrongSound,
  playLessonCompleteSound,
  playXpGainSound,
  resumeAudio,
} from "@/lib/sounds";
import { useSound } from "@/lib/sound-context";
import { XpFly } from "@/components/gamification/xp-fly";
import { HeartsDisplay } from "@/components/gamification/hearts-display";
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

export type LessonPlayerHearts = {
  hearts: number;
  maxHearts: number;
  nextRegen: Date | null;
};

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

const TYPED_TYPES = new Set(["command", "scenario"]);

function isTypedQuestion(step: Step): boolean {
  return step.kind === "question" && TYPED_TYPES.has(step.type);
}

export function LessonPlayer({
  data,
  heartsInfo,
  onLoseHeart,
}: {
  data: LessonPlayerData;
  heartsInfo?: LessonPlayerHearts;
  onLoseHeart?: () => void;
}) {
  const { soundEnabled } = useSound();
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
  const [xpTrigger, setXpTrigger] = useState(0);

  const step = steps[index];
  const isLastStep = index === steps.length - 1;

  function canSubmitValue(): boolean {
    if (!step || step.kind !== "question") return false;
    const isTyped = step.type === "command" || step.type === "scenario";
    return isTyped ? (value ?? "").trim().length > 0 : value !== null;
  }

  // Keyboard shortcuts: Enter to submit/continue, R to retry, number keys for MCQ
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (submitting) return;

      // Don't intercept if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        if (e.key === "Enter" && !submitting && canSubmitValue()) {
          e.preventDefault();
          handleSubmit();
        }
        return;
      }

      // Let native activation handle Space/Enter on interactive controls
      if (
        e.target instanceof HTMLButtonElement ||
        e.target instanceof HTMLAnchorElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (feedback) {
          if (!feedback.isCorrect) {
            handleRetry();
          } else {
            handleContinue();
          }
        } else if (step?.kind === "activity") {
          handleContinue();
        } else if (canSubmitValue()) {
          handleSubmit();
        }
      }

      if (e.key === "r" || e.key === "R") {
        if (feedback && !feedback.isCorrect) {
          handleRetry();
        }
      }

      // Number keys 1-6 for MCQ options
      if (!feedback && step?.kind === "question" && !isTypedQuestion(step)) {
        const num = parseInt(e.key, 10);
        if (num >= 1 && num <= 6 && step.options) {
          const optionIndex = num - 1;
          if (optionIndex < (step.options?.length ?? 0)) {
            setValue(String(step.options[optionIndex]));
          }
        }
      }
    },
    [feedback, submitting, step, handleSubmit, handleContinue, handleRetry, setValue],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  function resetQuestionState() {
    setValue(null);
    setFeedback(null);
    setPartIndex(0);
  }

  async function handleSubmit(answerOverride?: string) {
    if (!step || step.kind !== "question") return;
    const answer = answerOverride ?? value;
    if (!answer) return;
    if (soundEnabled) resumeAudio();

    setSubmitting(true);
    setError(null);
    try {
      const response = await submitAnswer({
        lessonId: data.lesson.id,
        questionId: step.id,
        answer,
        partIndex: step.type === "scenario" ? partIndex : undefined,
      });
      setFeedback(response);
      if (response.xpEarned > 0) {
        setXpEarned((previous) => previous + response.xpEarned);
        setXpTrigger((previous) => previous + 1);
        if (soundEnabled) playXpGainSound();
      }
      if (response.isCorrect) {
        correctAnswerConfetti();
        if (soundEnabled) playCorrectSound();
      } else {
        if (soundEnabled) playWrongSound();
        onLoseHeart?.();
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
        lessonCompleteConfetti();
        if (soundEnabled) playLessonCompleteSound();
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
      <XpFly amount={xpEarned} triggerKey={xpTrigger} />

      {/* Hearts display */}
      {heartsInfo && (
        <div className="flex items-center justify-center">
          <HeartsDisplay
            hearts={heartsInfo.hearts}
            maxHearts={heartsInfo.maxHearts}
            nextRegen={heartsInfo.nextRegen}
            size="md"
          />
        </div>
      )}

      <LessonHeader
        title={data.lesson.title}
        completedSteps={index}
        totalSteps={steps.length}
        xpEarned={xpEarned}
        stepType={step?.kind === "activity" ? (step.type === "learn" ? "📖 Learning" : "💻 Example") : step?.kind === "question" ? "❓ Question" : undefined}
        estimatedMinutes={data.lesson.estimatedMinutes}
      />

      {error && (
        <div role="alert" aria-live="assertive">
          <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        </div>
      )}

      {/* Live mission step — warp between destinations */}
      <AnimatePresence mode="wait">
        <motion.div
          key={
            completing
              ? "finishing"
              : step
                ? `${step.kind}-${step.id}-${step.type}-${partIndex}`
                : "idle"
          }
          initial={{ opacity: 0, x: 64, scale: 0.96 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -64, scale: 0.96 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="relative"
        >
          {/* Warp trail behind the incoming step */}
          <motion.div
            aria-hidden
            initial={{ opacity: 0, x: 90 }}
            animate={{ opacity: [0, 0.35, 0], x: [90, 0, -90] }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="pointer-events-none absolute -inset-x-4 top-1/2 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, oklch(0.8 0.15 200 / 0.6), transparent)",
            }}
          />

          {completing && (
            <div className="flex flex-col items-center justify-center gap-4 py-10">
              <SpaceshipPlayer size={48} state="current" />
              <div className="flex flex-col items-center gap-2">
                <p className="text-sm font-bold text-foreground">
                  Engaging warp drive...
                </p>
                <p className="text-xs text-muted-foreground">
                  Finishing lesson and calculating rewards
                </p>
              </div>
              <div className="w-48 h-1.5 rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-primary to-emerald-400 animate-shimmer" style={{ width: "60%" }} />
              </div>
            </div>
          )}

          {!completing &&
            step?.kind === "activity" &&
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

          {!completing && step?.kind === "question" && !feedback && (
            <QuestionSection
              question={step}
              value={value}
              onValueChange={setValue}
              onSubmit={handleSubmit}
              submitting={submitting}
              partIndex={partIndex}
              error={error ?? undefined}
            />
          )}

          {!completing && step?.kind === "question" && feedback && (
            <FeedbackSection
              feedback={feedback}
              onContinue={handleContinue}
              onRetry={handleRetry}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Keyboard shortcuts reference */}
      <div className="hidden md:flex items-center justify-center gap-4 text-[10px] text-muted-foreground/50 pt-2">
        <span className="flex items-center gap-1"><kbd className="kbd">1</kbd>-<kbd className="kbd">6</kbd> Select</span>
        <span className="flex items-center gap-1"><kbd className="kbd">Enter</kbd> Submit</span>
        <span className="flex items-center gap-1"><kbd className="kbd">R</kbd> Retry</span>
      </div>
    </div>
  );
}
