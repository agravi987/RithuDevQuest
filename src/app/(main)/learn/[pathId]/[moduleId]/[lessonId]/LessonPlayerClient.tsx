"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Sparkles, ArrowRight } from "lucide-react";
import type { LessonPlayerData, SubmitAnswerResult } from "@/lib/lesson/types";
import { submitAnswer, completeLesson } from "@/lib/lesson/actions";
import { QuizExperience } from "@/components/quiz/QuizExperience";
import type { QuizQuestion } from "@/components/quiz/types";
import { CosmicCharacter } from "@/components/quiz/characters/CosmicCharacter";
import { DuoButton } from "@/components/quiz/duo-button";
import { MarkdownText } from "@/components/lesson/markdown";

interface LessonPlayerClientProps {
  data: LessonPlayerData;
  heartsInfo: { hearts: number; maxHearts: number; nextRegen: Date | null };
}

export function LessonPlayerClient({ data, heartsInfo }: LessonPlayerClientProps) {
  const router = useRouter();
  const [activityIndex, setActivityIndex] = React.useState<number>(0);
  const [inQuiz, setInQuiz] = React.useState<boolean>(
    !data.activities || data.activities.length === 0
  );

  // Convert lesson questions into QuizQuestion array
  const quizQuestions = React.useMemo<QuizQuestion[]>(() => {
    return data.questions.map((q, idx) => ({
      ...q,
      order: idx,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
    }));
  }, [data.questions]);

  // Handler for server answer submission
  const handleSubmitAnswer = React.useCallback(
    async (question: QuizQuestion, answer: string): Promise<SubmitAnswerResult> => {
      try {
        const res = await submitAnswer({
          lessonId: data.lesson.id,
          questionId: question.id,
          answer,
        });
        return res;
      } catch {
        // Fallback for offline or local preview. Mirror the server's
        // per-type grading contract (pipe alternatives, case tolerance) so
        // a network failure never marks a correct answer as wrong.
        const { validateQuestionAnswer } = await import("@/lib/quiz/validation");
        const isCorrect = validateQuestionAnswer(
          {
            type: question.type,
            correctAnswer: question.correctAnswer ?? "",
            options: question.options,
          },
          answer,
        );
        return {
          questionId: question.id,
          lessonId: data.lesson.id,
          isCorrect,
          attemptNumber: 1,
          xpEarned: isCorrect ? 10 : 0,
          correctAnswer: question.correctAnswer ?? answer,
          explanation: question.explanation ?? "Great effort! Review the concept.",
          hint: question.hint,
          partIndex: null,
          scenarioComplete: null,
          totalParts: null,
        };
      }
    },
    [data.lesson.id]
  );

  // Handler for completing the lesson - saves progress in DB without redirecting yet
  const handleComplete = React.useCallback(
    async () => {
      try {
        await completeLesson({
          lessonId: data.lesson.id,
          questionIds: data.questions.map((q) => q.id),
        });
      } catch (err) {
        console.error("Failed to mark lesson complete:", err);
      }
    },
    [data.lesson.id, data.questions]
  );

  // Handler for when user clicks CONTINUE on the results screen
  const handleContinueAfterResults = React.useCallback(() => {
    const targetPath = data.moduleHref;
    const params = new URLSearchParams();
    params.set("justCompleted", data.lesson.id);
    if (data.nextLessonHref) {
      params.set("nextHref", data.nextLessonHref);
    }
    router.push(`${targetPath}?${params.toString()}`);
  }, [data.moduleHref, data.lesson.id, data.nextLessonHref, router]);

  const handleExit = React.useCallback(() => {
    router.push(data.moduleHref);
  }, [data.moduleHref, router]);

  // If there are activities, show Duolingo Concept Walkthrough first
  if (!inQuiz && data.activities && data.activities.length > 0) {
    const currentActivity = data.activities[activityIndex];
    const isLastActivity = activityIndex === data.activities.length - 1;

    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-[#070b14] text-white">
        {/* Top Header */}
        <header className="mx-auto flex h-16 w-full max-w-4xl items-center justify-between px-4 sm:px-6">
          <button
            onClick={handleExit}
            className="flex size-10 items-center justify-center rounded-xl text-white/50 hover:bg-white/10 hover:text-white transition-colors"
            aria-label="Exit lesson"
          >
            ✕
          </button>
          <div className="flex items-center gap-2">
            <BookOpen className="size-4 text-emerald-400" />
            <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
              Concept Briefing ({activityIndex + 1}/{data.activities.length})
            </span>
          </div>
          <div className="w-10" />
        </header>

        {/* Concept Card with Crew Mascot */}
        <section
          aria-label="Concept Briefing"
          className="mx-auto flex flex-1 w-full max-w-3xl flex-col items-center justify-center px-4 py-6"
        >
          <div className="flex w-full flex-col md:flex-row items-center gap-6">
            <div className="shrink-0 flex flex-col items-center">
              <CosmicCharacter characterId="rithu" mood="speaking" size="custom" className="size-24 sm:size-28" />
              <span className="mt-2 text-xs font-black text-emerald-400 uppercase tracking-wider">
                Commander Rithu
              </span>
            </div>

            <div className="w-full flex-1">
              <div className="duo-card-3d relative rounded-3xl border-2 border-white/10 bg-[#0d1527] p-6 sm:p-8 shadow-2xl">
                <h2 className="text-2xl font-black tracking-tight text-white mb-4">
                  {currentActivity.title || data.lesson.title}
                </h2>
                <div className="prose-sm max-w-none text-slate-300 leading-relaxed font-medium">
                  <MarkdownText text={currentActivity.body} />
                </div>
                {currentActivity.code && (
                  <pre className="mt-4 overflow-x-auto rounded-2xl bg-black/40 p-4 font-mono text-xs text-emerald-300 border border-emerald-500/20">
                    <code>{currentActivity.code}</code>
                  </pre>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Bottom Drawer with 3D Button */}
        <footer className="border-t-2 border-white/10 bg-[#0b1120] px-4 py-4 sm:py-6">
          <div className="mx-auto flex max-w-3xl justify-end">
            <DuoButton
              variant="primary"
              size="lg"
              onClick={() => {
                if (isLastActivity) {
                  setInQuiz(true);
                } else {
                  setActivityIndex((i) => i + 1);
                }
              }}
              className="w-full sm:w-auto min-w-[200px]"
            >
              {isLastActivity ? (
                <>
                  Start Challenge
                  <Sparkles className="size-4 ml-1.5" />
                </>
              ) : (
                <>
                  Next Concept
                  <ArrowRight className="size-4 ml-1.5" />
                </>
              )}
            </DuoButton>
          </div>
        </footer>
      </div>
    );
  }

  // Duolingo Quiz Engine
  return (
    <QuizExperience
      mode="lesson"
      questions={quizQuestions}
      onSubmitAnswer={handleSubmitAnswer}
      onComplete={handleComplete}
      onExit={handleExit}
      onContinueResults={handleContinueAfterResults}
      userXp={data.userXp}
      hearts={{
        current: heartsInfo.hearts,
        max: heartsInfo.maxHearts,
        nextRegen: heartsInfo.nextRegen,
      }}
    />
  );
}