"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { QuestionSection } from "@/components/lesson/question-section";
import { Button } from "@/components/ui/button";
import { QuizHeader } from "./QuizHeader";
import type { QuizProgressState } from "./QuizProgress";
import type { QuizTimerConfig } from "./QuizTimer";
import { QuizNavigation } from "./QuizNavigation";
import { QuizFeedback } from "./QuizFeedback";
import { QuizResults, type QuizResult } from "./QuizResults";
import { XpFly } from "@/components/gamification/xp-fly";
import { HeartsDisplay } from "@/components/gamification/hearts-display";
import { StreakIndicator } from "./QuizFeedback";
import type { SubmitAnswerResult } from "@/lib/lesson/types";
import { validateQuestionAnswer } from "@/lib/quiz/validation";
import {
  QuizModeConfig,
  QuizQuestion,
  QuizSession,
  QuizState,
  QuizExperienceProps,
  QuizMode,
  QUIZ_MODE_PRESETS,
  deepMerge,
} from "./types";

/* ════════════════════════════════════════════════════════════════════
   QUIZ EXPERIENCE - Main orchestrator component
   ════════════════════════════════════════════════════════════════════ */

const TYPED_TYPES = new Set(["command", "scenario"]);

function isTypedQuestion(question: QuizQuestion): boolean {
  return TYPED_TYPES.has(question.type);
}

function canSubmitValue(question: QuizQuestion | null, value: string | null): boolean {
  if (!question) return false;
  return isTypedQuestion(question) ? (value ?? "").trim().length > 0 : value !== null;
}

export function QuizExperience({
  mode,
  config: userConfig,
  questions: initialQuestions = [],
  onComplete,
  onExit,
  onSubmitAnswer,
  initialState,
  sessionId,
  userXp = 0,
  userLevel = 1,
  userStreak = 0,
  hearts,
}: QuizExperienceProps) {
  // Merge user config with preset
  const preset = QUIZ_MODE_PRESETS[mode];
  const config = useMemo(() => deepMerge(preset, userConfig ?? {}), [preset, userConfig]);

  // State
  const [state, setState] = useState<QuizState>("loading");
  const [questions, setQuestions] = useState<QuizQuestion[]>(initialQuestions);
  const [currentIndex, setCurrentIndex] = useState(initialState?.currentIndex ?? 0);
  const [value, setValue] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<SubmitAnswerResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [xpEarned, setXpEarned] = useState(0);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [answerHistory, setAnswerHistory] = useState<Array<{
    questionId: string;
    question: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    xpEarned: number;
    answeredAt: Date;
    timeSpentMs: number;
  }>>([]);
  const [showHint, setShowHint] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [xpTrigger, setXpTrigger] = useState(0);

  // Refs for timer and async guards
  const submittingRef = useRef(false);
  const completingRef = useRef(false);
  const valueRef = useRef<string | null>(null);
  const questionStartTimeRef = useRef<number>(Date.now());

  // Update refs
  useEffect(() => { valueRef.current = value; }, [value]);
  useEffect(() => { questionStartTimeRef.current = questionStartTime; }, [questionStartTime]);

  // Timer config
  const timerConfig: QuizTimerConfig = {
    enabled: config.timer.enabled,
    durationMs: config.timer.durationMs,
    warningThreshold: config.timer.warningThreshold,
    criticalThreshold: config.timer.criticalThreshold,
    autoSubmit: config.timer.autoSubmit,
    showMilliseconds: config.timer.showMilliseconds,
    countUp: config.timer.countUp,
  };

  // Progress state
  const progress: QuizProgressState = useMemo(() => {
    const answered = questions.filter((q) => q.isCorrect !== null || q.answeredAt).length;
    const correct = questions.filter((q) => q.isCorrect === true).length;
    const incorrect = questions.filter((q) => q.isCorrect === false).length;
    return {
      current: currentIndex,
      total: questions.length,
      percentage: questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0,
      answered,
      correct,
      incorrect,
      unanswered: questions.length - answered,
    };
  }, [questions, currentIndex]);

  // Current question
  const currentQuestion = questions[currentIndex];

  // Complete quiz and finalize result
  const handleComplete = useCallback(async () => {
    if (completingRef.current) return;
    completingRef.current = true;

    try {
      const correctCount = questions.filter((q) => q.isCorrect === true).length;
      const accuracy = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
      const totalTimeSpent = answerHistory.reduce((sum, a) => sum + a.timeSpentMs, 0);

      const finalResult: QuizResult = {
        sessionId: sessionId ?? "local",
        mode,
        topic: config.theme.variant === "challenge" ? "Daily Challenge" : "Quiz",
        totalQuestions: questions.length,
        correctCount,
        accuracy,
        totalXpEarned: xpEarned,
        maxCombo,
        timeSpentMs: totalTimeSpent,
        completedAt: new Date(),
        didLevelUp: false, // Would be set by server
        streak: undefined, // Would be set by server
      };

      setResult(finalResult);
      setState("results");
      onComplete?.(finalResult);
    } finally {
      completingRef.current = false;
    }
  }, [questions, xpEarned, maxCombo, sessionId, mode, answerHistory, onComplete, config.theme.variant]);

  // Timer callbacks
  const handleTimerExpire = useCallback(() => {
    if (state === "active" && config.completion.autoComplete) {
      handleComplete();
    }
  }, [state, config.completion.autoComplete, handleComplete]);

  // Load questions if provided async
  useEffect(() => {
    if (initialQuestions.length > 0 && state === "loading") {
      setQuestions(initialQuestions);
      setCurrentIndex(initialState?.currentIndex ?? 0);
      setQuestionStartTime(Date.now());
      const resumedIndex = initialState?.currentIndex ?? 0;
      const wasAnswered = initialState?.questions?.[resumedIndex]?.answeredAt;
      setState(wasAnswered ? "review" : "active");
    } else if (state === "loading" && initialQuestions.length === 0) {
      setState("landing");
    }
  }, [initialQuestions, state, initialState]);

  // Handle answer submission
  const handleSubmit = useCallback(async (answerOverride?: string) => {
    if (!currentQuestion || submittingRef.current) return;
    const answer = answerOverride ?? valueRef.current;
    if (!canSubmitValue(currentQuestion, answer)) return;
    const submittedAnswer = answer ?? "";

    submittingRef.current = true;
    setSubmitting(true);
    setError(null);

    try {
      // Parents provide an async handler for server-side grading/persistence.
      // Without one, fall back to local grading when the question carries its answer.
      let nextFeedback: SubmitAnswerResult;
      if (onSubmitAnswer) {
        nextFeedback = await onSubmitAnswer(currentQuestion, submittedAnswer);
      } else if (currentQuestion.correctAnswer) {
        const isCorrect = validateQuestionAnswer(
          { type: currentQuestion.type, correctAnswer: currentQuestion.correctAnswer },
          submittedAnswer,
        );
        nextFeedback = {
          questionId: currentQuestion.id,
          lessonId: "",
          isCorrect,
          attemptNumber: 1,
          xpEarned: isCorrect ? config.scoring.xpPerCorrect : 0,
          correctAnswer: currentQuestion.correctAnswer,
          explanation: "",
          hint: currentQuestion.hint,
          partIndex: null,
          scenarioComplete: null,
          totalParts: null,
        };
      } else {
        throw new Error(
          "This quiz cannot be graded. Provide onSubmitAnswer or include correctAnswer on each question.",
        );
      }

      const timeSpentMs = Math.max(0, Date.now() - questionStartTimeRef.current);

      setQuestions((prev) =>
        prev.map((q, i) =>
          i === currentIndex
            ? {
                ...q,
                userAnswer: submittedAnswer,
                isCorrect: nextFeedback.isCorrect,
                answeredAt: new Date().toISOString(),
                xpEarned: nextFeedback.xpEarned,
              }
            : q,
        ),
      );

      setAnswerHistory((prev) => [
        ...prev,
        {
          questionId: currentQuestion.id,
          question: currentQuestion.question,
          userAnswer: submittedAnswer,
          correctAnswer: nextFeedback.correctAnswer,
          isCorrect: nextFeedback.isCorrect,
          xpEarned: nextFeedback.xpEarned,
          answeredAt: new Date(),
          timeSpentMs,
        },
      ]);

      setCombo((prev) => {
        const next = nextFeedback.isCorrect ? prev + 1 : 0;
        setMaxCombo((m) => Math.max(m, next));
        return next;
      });

      setXpEarned((prev) => prev + nextFeedback.xpEarned);
      if (nextFeedback.xpEarned > 0) {
        setXpTrigger((t) => t + 1);
      }
      setFeedback(nextFeedback);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit answer");
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  }, [currentQuestion, onSubmitAnswer, config.scoring.xpPerCorrect, currentIndex]);

  // Navigation
  const handleContinue = useCallback(() => {
    if (!feedback?.isCorrect) return;

    const nextIndex = questions.findIndex(
      (q, i) => i > currentIndex && (q.isCorrect === null && q.answeredAt === null)
    );

    if (nextIndex !== -1) {
      setCurrentIndex(nextIndex);
      setValue(null);
      setFeedback(null);
      setCombo(0);
      setQuestionStartTime(Date.now());
      setState("active");
    } else {
      handleComplete();
    }
  }, [feedback, questions, currentIndex, handleComplete]);

  const handleRetry = useCallback(() => {
    setFeedback(null);
    setValue(null);
    setCombo(0);
    setError(null);
    setQuestionStartTime(Date.now());
    setState("active");
  }, []);

  const handleSkip = useCallback(() => {
    if (submittingRef.current) return;

    const nextIndex = questions.findIndex(
      (q, i) => i > currentIndex && (q.isCorrect === null && q.answeredAt === null)
    );

    setFeedback(null);
    setValue(null);
    setCombo(0);

    if (nextIndex !== -1) {
      setCurrentIndex(nextIndex);
      setQuestionStartTime(Date.now());
      setState("active");
    } else {
      handleComplete();
    }
  }, [questions, currentIndex, handleComplete]);

  const handleExit = useCallback(() => {
    onExit?.();
  }, [onExit]);

  const handlePause = useCallback(() => setIsPaused(true), []);
  const handleResume = useCallback(() => setIsPaused(false), []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat || submitting) return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        if (e.key === "Enter" && !submitting && canSubmitValue(currentQuestion, valueRef.current)) {
          e.preventDefault();
          handleSubmit();
        }
        return;
      }
      if (e.target instanceof HTMLButtonElement || e.target instanceof HTMLAnchorElement || e.target instanceof HTMLSelectElement) {
        return;
      }

      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (feedback) {
          if (!feedback.isCorrect) handleRetry();
          else handleContinue();
        } else if (canSubmitValue(currentQuestion, valueRef.current)) {
          handleSubmit();
        }
      }

      if ((e.key === "r" || e.key === "R") && feedback && !feedback.isCorrect) {
        e.preventDefault();
        handleRetry();
      }

      if (!feedback && currentQuestion && !isTypedQuestion(currentQuestion)) {
        const num = parseInt(e.key, 10);
        if (num >= 1 && num <= 6 && currentQuestion.options) {
          const optionIndex = num - 1;
          if (optionIndex < (currentQuestion.options?.length ?? 0)) {
            setValue(String(currentQuestion.options[optionIndex]));
          }
        }
      }

      if (e.key === "ArrowLeft" && config.navigation.allowBack && currentIndex > 0) {
        e.preventDefault();
        // Handle previous - would need to be implemented
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [feedback, submitting, currentQuestion, currentIndex, handleSubmit, handleRetry, handleContinue, config.navigation.allowBack]);

  // Show landing if no questions yet
  if (state === "loading" && questions.length === 0) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="text-center">
          <motion.div className="size-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
            <svg className="size-6 animate-spin" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" strokeDasharray="31.4 31.4"/></svg>
          </motion.div>
          <p className="text-sm font-medium text-muted-foreground">Preparing your quiz...</p>
        </div>
      </div>
    );
  }

  // Show landing page
  if (state === "landing") {
    return (
      <div className={cn("rounded-3xl border p-5 sm:p-8 shadow-2xl", config.theme.cardClass)}>
        <div className="text-center">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="mb-6 flex justify-center"
          >
            <div className={cn(
              "grid size-16 place-items-center rounded-2xl shadow-lg",
              config.theme.variant === "challenge"
                ? "bg-gradient-to-br from-emerald-400 via-green-500 to-teal-500"
                : config.theme.variant === "practice"
                ? "bg-gradient-to-br from-primary via-emerald-400 to-cyan-400"
                : "bg-gradient-to-br from-primary via-emerald-400 to-cyan-400",
            )}>
              <svg className="size-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
          </motion.div>
          <h2 className="text-2xl font-black text-foreground mb-2">
            {config.theme.variant === "challenge" ? "Daily Challenge" : "Quiz"}
          </h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            {config.theme.variant === "challenge"
              ? "15 questions · 30 minutes · Beat the clock!"
              : "Test your knowledge and earn XP"}
          </p>
          <Button
            onClick={() => setState("active")}
            className="w-full font-bold py-4 rounded-xl gap-2"
          >
            Start Quiz
          </Button>
        </div>
      </div>
    );
  }

  // Show results
  if (state === "results" && result) {
    return (
      <QuizResults
        result={result}
        config={config}
        theme={config.theme}
        userXp={userXp}
        onRetry={() => {
          setResult(null);
          setCurrentIndex(0);
          setQuestions(questions.map(q => ({ ...q, isCorrect: null, userAnswer: null, answeredAt: null, xpEarned: undefined })));
          setValue(null);
          setFeedback(null);
          setCombo(0);
          setMaxCombo(0);
          setAnswerHistory([]);
          setXpEarned(0);
          setXpTrigger(0);
          setQuestionStartTime(Date.now());
          setState("active");
        }}
        onExit={handleExit}
        onReview={() => setShowReview(true)}
        showReview={showReview}
      />
    );
  }

  // Show completed
  if (state === "completed") {
    return (
      <div className={cn("rounded-3xl border p-5 sm:p-8 shadow-2xl text-center", config.theme.cardClass)}>
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="mb-5 flex justify-center"
        >
          <div className="relative grid size-20 place-items-center rounded-full bg-gradient-to-br from-emerald-400 via-green-500 to-teal-500 shadow-2xl shadow-emerald-400/30">
            <svg className="size-10 text-white drop-shadow-lg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" strokeLinecap="round" strokeLinejoin="round" />
              <polyline points="22 4 12 14.01 9 11.01" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </motion.div>
        <h2 className="text-2xl font-black text-foreground">Quiz Complete</h2>
        <p className="text-sm text-muted-foreground mt-2 mb-6">Great job! You&apos;ve finished the quiz.</p>
        <Button onClick={handleExit} className="w-full font-bold py-3 rounded-xl gap-2">
          <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  // Active / Submitting / Review states
  if (state === "active" || state === "submitting" || state === "review") {
    if (!currentQuestion) return null;

    return (
      <div className={cn("flex flex-col gap-6", config.theme.backgroundClass)}>
        {/* XP Fly animation */}
        <XpFly amount={xpEarned} triggerKey={xpTrigger} />

        {/* Hearts display */}
        {hearts && (
          <div className="flex items-center justify-center">
            <HeartsDisplay
              hearts={hearts.current}
              maxHearts={hearts.max}
              nextRegen={hearts.nextRegen}
              size="md"
            />
          </div>
        )}

        {/* Quiz Header */}
        <QuizHeader
          mode={mode}
          config={config}
          topic={config.theme.variant === "challenge" ? "Daily Challenge" : "Quiz"}
          subtitle={initialQuestions.length > 0 ? `${questions.length} questions` : undefined}
          progress={progress}
          timerConfig={timerConfig}
          isTimerActive={state === "active" && !isPaused}
          onTimerExpire={handleTimerExpire}
          onExit={handleExit}
          onPause={handlePause}
          onResume={handleResume}
          isPaused={isPaused}
          userStats={{ xp: userXp, level: userLevel, streak: userStreak, hearts }}
        />

        {/* Streak/Combo indicator */}
        <StreakIndicator combo={combo} streak={userStreak} maxCombo={maxCombo} />

        {/* Question Area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="relative"
          >
            {!feedback && (
              <QuestionSection
                question={currentQuestion}
                value={value}
                onValueChange={setValue}
                onSubmit={handleSubmit}
                submitting={submitting}
                partIndex={null}
                error={error ?? undefined}
              />
            )}

            {feedback && (
              <QuizFeedback
                config={config.feedback}
                feedback={feedback}
                onContinue={handleContinue}
                onRetry={handleRetry}
                onHintToggle={() => setShowHint(!showHint)}
                showHint={showHint}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <QuizNavigation
          config={config.navigation}
          progress={progress}
          currentIndex={currentIndex}
          hasFeedback={!!feedback}
          isSubmitting={submitting}
          isLastQuestion={currentIndex === questions.length - 1}
          canSubmit={canSubmitValue(currentQuestion, value)}
          onNext={handleContinue}
          onSkip={handleSkip}
          onSubmit={handleSubmit}
        />
      </div>
    );
  }

  return null;
}

/* ════════════════════════════════════════════════════════════════════
   QUIZ PROVIDER - Context for sharing quiz state across components
   ═════════════════════════════════════════════════════════════════════ */

import { createContext, useContext, ReactNode } from "react";

interface QuizContextValue {
  session: QuizSession | null;
  setSession: (session: QuizSession | null) => void;
  submitAnswer: (questionId: string, answer: string) => Promise<void>;
  nextQuestion: () => void;
  previousQuestion: () => void;
  skipQuestion: () => void;
}

const QuizContext = createContext<QuizContextValue | null>(null);

interface QuizProviderProps {
  children: ReactNode;
  mode: QuizMode;
  config?: Partial<QuizModeConfig>;
}

export function QuizProvider({ children }: QuizProviderProps) {
  const [session, setSession] = useState<QuizSession | null>(null);

  // Implementation would go here for context-based state management
  // For now, the QuizExperience component handles its own state

  return (
    <QuizContext.Provider value={{ session, setSession, submitAnswer: async () => {}, nextQuestion: () => {}, previousQuestion: () => {}, skipQuestion: () => {} }}>
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error("useQuiz must be used within a QuizProvider");
  }
  return context;
}