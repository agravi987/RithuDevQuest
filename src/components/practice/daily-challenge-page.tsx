"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  Timer,
  Zap,
  Trophy,
  Play,
  ChevronLeft,
  Target,
  AlertTriangle,
  RotateCcw,
  Clock,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuestionSection } from "@/components/lesson/question-section";
import { FeedbackSection } from "@/components/lesson/feedback-section";
import { buildRichPayload } from "@/lib/quiz/types";
import type { LessonQuestionData, SubmitAnswerResult } from "@/lib/lesson/types";

/* ─── Types ─── */

type ChallengeState =
  | "loading"
  | "landing"
  | "active"
  | "submitting"
  | "review"
  | "results"
  | "completed"
  | "expired";

type ChallengeQuestion = {
  id: string;
  question: string;
  type: string;
  difficulty: string;
  options: string[] | null;
  hint: string | null;
  order: number;
  userAnswer?: string | null;
  isCorrect?: boolean | null;
  answeredAt?: string | null;
};

type ChallengeStatus = {
  hasChallengeToday: boolean;
  isCompleted: boolean;
  isActive: boolean;
  expiresAt?: string;
  previousBest?: {
    correctCount: number;
    totalQuestions: number;
    accuracy: number;
    date: string;
  };
};

/* ─── Timer Hook ─── */

function useChallengeTimer(expiresAt: Date | null, durationMs: number) {
  const [remaining, setRemaining] = useState(0);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!expiresAt) return;
    const tick = () => {
      const diff = Math.max(0, expiresAt.getTime() - Date.now());
      setRemaining(diff);
      if (diff <= 0) setIsExpired(true);
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  const minutes = Math.floor(remaining / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);
  const totalSeconds = Math.floor(remaining / 1000);
  const total = durationMs > 0 ? durationMs : remaining;
  const progress = expiresAt
    ? Math.max(0, Math.min(1, total > 0 ? remaining / total : 1))
    : 1;

  return { minutes, seconds, totalSeconds, isExpired, progress };
}

/* ─── Helpers ─── */

function toLessonQuestion(q: ChallengeQuestion): LessonQuestionData {
  const rich = buildRichPayload({
    type: q.type,
    options: q.options,
    parts: null,
  });

  return {
    id: q.id,
    type: q.type as LessonQuestionData["type"],
    difficulty: q.difficulty as LessonQuestionData["difficulty"],
    question: q.question,
    options: q.options,
    parts: null,
    hint: q.hint,
    ...(rich?.payload ? { payload: rich.payload } : {}),
  };
}

function getTimerGradient(progress: number): string {
  if (progress > 0.3) return "linear-gradient(90deg, #10b981, #22c55e)";
  if (progress > 0.1) return "linear-gradient(90deg, #22c55e, #f59e0b)";
  return "linear-gradient(90deg, #ef4444, #dc2626)";
}

function getTimerTextClass(totalSeconds: number): string {
  if (totalSeconds < 60) return "text-red-400";
  if (totalSeconds < 300) return "text-amber-400";
  return "text-white/50";
}

function getTimerIconClass(totalSeconds: number): string {
  if (totalSeconds < 60) return "text-red-400 animate-pulse";
  return "text-emerald-400/70";
}

/* ─── Main Component ─── */

export function DailyChallengePage() {
  const router = useRouter();
  const [state, setState] = useState<ChallengeState>("loading");
  const [status, setStatus] = useState<ChallengeStatus | null>(null);
  const [challengeId, setChallengeId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<ChallengeQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);
  const [durationMs, setDurationMs] = useState(30 * 60 * 1000);
  const [resultData, setResultData] = useState<{
    totalQuestions: number;
    correctCount: number;
    accuracy: number;
    xpEarned: number;
    didLevelUp: boolean;
    level: number;
    levelTitle: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // QuestionSection state
  const [value, setValue] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<SubmitAnswerResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [combo, setCombo] = useState(0);
  const [answerHistory, setAnswerHistory] = useState<
    { question: string; isCorrect: boolean; correctAnswer: string }[]
  >([]);
  const [showReview, setShowReview] = useState(false);

  const timer = useChallengeTimer(
    state === "active" ? expiresAt : null,
    durationMs,
  );
  const currentValueRef = useRef<string | null>(null);
  const submittingRef = useRef(false);
  const completingRef = useRef(false);
  const questionTopRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    questionTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [currentIndex]);

  useEffect(() => {
    currentValueRef.current = value;
  }, [value]);

  const goBackToPractice = () => router.push("/practice");

  // Shared hydration for a start/resume response. Restores answered state on
  // resume, derives the first unanswered index, and flags an expired resume.
  const hydrateChallenge = (res: {
    challengeId: string;
    questions: ChallengeQuestion[];
    expiresAt: string;
    durationMs?: number;
    isExpired?: boolean;
  }) => {
    setChallengeId(res.challengeId);
    setQuestions(res.questions);
    setExpiresAt(new Date(res.expiresAt));
    setDurationMs(res.durationMs ?? 30 * 60 * 1000);

    const answered = res.questions
      .filter((q) => q.answeredAt != null || q.isCorrect != null)
      .map((q) => ({
        question: q.question,
        isCorrect: q.isCorrect === true,
        correctAnswer: "",
      }));
    setAnswerHistory(answered);

    // If the challenge already expired while away, present the time's-up
    // screen instead of silently auto-completing in the middle of a session.
    if (res.isExpired) {
      setState("expired");
      return;
    }

    const firstUnanswered = res.questions.findIndex(
      (q) => q.answeredAt == null && q.isCorrect == null,
    );
    setCurrentIndex(firstUnanswered === -1 ? 0 : firstUnanswered);
    setValue(null);
    setFeedback(null);
    setCombo(0);
    setState("active");
  };

  // Load status on mount
  useEffect(() => {
    let cancelled = false;

    fetch("/api/daily-challenge")
      .then((r) => r.json())
      .then((s: ChallengeStatus) => {
        if (cancelled) return;
        setStatus(s);
        if (s.hasChallengeToday && s.isCompleted) {
          setState("completed");
          return;
        }
        if (s.isActive) {
          // Resume active challenge
          return fetch("/api/daily-challenge", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "start" }),
          })
            .then((r) => r.json())
            .then((res) => {
              if (cancelled) return;
              if (res.success && res.challengeId && res.questions && res.expiresAt) {
                hydrateChallenge(res);
              } else {
                setState("landing");
              }
            })
            .catch(() => {
              if (cancelled) return;
              setError("Failed to resume your challenge. Please try again.");
              setState("landing");
            });
        }
        setState("landing");
        return undefined;
      })
      .catch(() => {
        if (cancelled) return;
        setError("Failed to load your daily challenge. Please try again.");
        setState("landing");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Auto-complete when timer expires
  useEffect(() => {
    if (timer.isExpired && state === "active" && challengeId && !completingRef.current) {
      handleComplete();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timer.isExpired]);

  // Keyboard shortcuts: number keys select MCQ, Enter checks/continues, R retries
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat || submitting || submittingRef.current) return;

      // Don't intercept while typing
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // Let native activation handle interactive controls
      if (
        e.target instanceof HTMLButtonElement ||
        e.target instanceof HTMLAnchorElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      const isActiveState = state === "active" || state === "review";
      if (!isActiveState) return;

      const q = questions[currentIndex];
      if (!feedback && q) {
        // Number keys 1-6 for MCQ options
        const num = parseInt(e.key, 10);
        if (num >= 1 && num <= 6 && q.options && q.options.length > 0) {
          const optionIndex = num - 1;
          if (optionIndex < q.options.length) {
            e.preventDefault();
            setValue(String(q.options[optionIndex]));
            return;
          }
        }
      }

      if (e.key === "Enter") {
        e.preventDefault();
        if (feedback) {
          if (feedback.isCorrect) {
            handleContinue();
          } else {
            handleRetry();
          }
        } else if ((currentValueRef.current ?? "").trim()) {
          handleSubmit();
        }
      }

      if ((e.key === "r" || e.key === "R") && feedback && !feedback.isCorrect) {
        e.preventDefault();
        handleRetry();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, currentIndex, questions, feedback, value, submitting, challengeId]);

  const handleStart = async () => {
    setState("loading");
    setError(null);
    const res = await fetch("/api/daily-challenge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "start" }),
    }).then((r) => r.json());

    if (res.success && res.challengeId && res.questions && res.expiresAt) {
      hydrateChallenge(res);
    } else if (res.alreadyCompleted) {
      setState("completed");
    } else {
      setError(res.error ?? "Failed to start");
      setState("landing");
    }
  };

  const handleSubmit = async () => {
    const q = questions[currentIndex];
    const answer = currentValueRef.current;
    if (!answer?.trim() || !challengeId || !q) return;
    if (submittingRef.current || completingRef.current) return;

    submittingRef.current = true;
    setSubmitting(true);
    setState("submitting");

    const response = await fetch("/api/daily-challenge/answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ challengeId, questionId: q.id, userAnswer: answer }),
    });
    const res = await response.json();

    if (res.success && res.isCorrect !== undefined) {
      setFeedback({
        questionId: q.id,
        lessonId: "daily-challenge",
        isCorrect: res.isCorrect,
        attemptNumber: 1,
        xpEarned: res.xpEarned ?? 0,
        correctAnswer: res.correctAnswer ?? "",
        explanation: res.explanation ?? "",
        hint: null,
        partIndex: null,
        scenarioComplete: null,
        totalParts: null,
      });
      setCombo(res.isCorrect ? (res.combo ?? 0) : 0);
      setAnswerHistory((prev) => [
        ...prev,
        {
          question: q.question,
          isCorrect: res.isCorrect,
          correctAnswer: res.correctAnswer ?? "",
        },
      ]);
      setState("review");
    } else if (res.error === "Time's up!") {
      setError("Time's up! Auto-completing your challenge...");
      setState("active");
      handleComplete();
    } else if (res.error === "Already answered") {
      // Defensive: advance to the next unanswered question.
      const nextIndex = nextUnansweredIndex(currentIndex);
      setFeedback(null);
      setValue(null);
      setCombo(0);
      if (nextIndex !== -1) {
        setCurrentIndex(nextIndex);
        setState("active");
      } else {
        handleComplete();
      }
    } else if (res.error === "Question not found") {
      setError("That question is no longer available.");
      setState("active");
    } else if (response.status === 429 || res.error === "Please wait a moment") {
      setError("Please wait a moment before checking again.");
      setState("active");
    } else {
      setError(res.error ?? "Failed to submit");
      setState("active");
    }

    submittingRef.current = false;
    setSubmitting(false);
  };

  // Finds the next question index (after `from`) that still needs answering.
  const nextUnansweredIndex = (from: number) =>
    questions.findIndex((item, i) => i > from && item.answeredAt == null);

  const handleContinue = () => {
    if (!feedback?.isCorrect) return;

    const nextIndex = nextUnansweredIndex(currentIndex);
    if (nextIndex !== -1) {
      setCurrentIndex(nextIndex);
      setValue(null);
      setFeedback(null);
      setCombo(0);
      setState("active");
    } else {
      handleComplete();
    }
  };

  const handleRetry = () => {
    setFeedback(null);
    setValue(null);
    setCombo(0);
    setState("active");
  };

  const handleSkip = () => {
    if (submittingRef.current || completingRef.current) return;
    setFeedback(null);
    setValue(null);
    setCombo(0);
    const nextIndex = nextUnansweredIndex(currentIndex);
    if (nextIndex !== -1) {
      setCurrentIndex(nextIndex);
      setState("active");
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    if (!challengeId) return;
    if (completingRef.current) return;
    completingRef.current = true;

    try {
      const res = await fetch("/api/daily-challenge/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ challengeId }),
      }).then((r) => r.json());

      if (res.success) {
        setResultData({
          totalQuestions: res.totalQuestions ?? 0,
          correctCount: res.correctCount ?? 0,
          accuracy: res.accuracy ?? 0,
          xpEarned: res.xpEarned ?? 0,
          didLevelUp: res.didLevelUp ?? false,
          level: res.level ?? 1,
          levelTitle: res.levelTitle ?? "Newcomer",
        });
        setState("results");
      } else {
        setError(res.error ?? "Failed to complete challenge");
      }
    } finally {
      completingRef.current = false;
    }
  };

  const handlePlayBack = () => {
    router.push("/practice");
  };

  /* ─── Render: Loading ─── */
  if (state === "loading" && !status) {
    return (
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#081710] to-[#0a0f1f] p-8">
        <div className="flex items-center justify-center gap-3 text-white/40">
          <div className="size-5 animate-spin rounded-full border-2 border-white/20 border-t-emerald-400" />
          <span className="text-sm font-medium">Loading daily challenge...</span>
        </div>
      </div>
    );
  }

  /* ─── Render: Landing ─── */
  if (state === "landing" || (state === "loading" && status)) {
    return (
      <div className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-[#0a1f14] via-[#0f1629] to-[#0a0f1f] p-5 sm:p-8 shadow-2xl shadow-emerald-500/5">
        <div className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-emerald-500/10 blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 size-48 rounded-full bg-teal-500/5 blur-[80px]" />

        <button
          type="button"
          onClick={goBackToPractice}
          className="relative z-10 mb-5 inline-flex items-center gap-1 text-sm text-white/50 hover:text-white transition-colors"
        >
          <ChevronLeft className="size-4" />
          Practice Arena
        </button>

        <div className="relative z-10">
          <div className="flex items-start gap-4 mb-6">
            <div className="grid size-14 sm:size-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-emerald-400 via-green-500 to-teal-500 shadow-lg shadow-emerald-500/20">
              <Target className="size-7 sm:size-8 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400/70">
                  Daily Challenge
                </span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">
                  30 min
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                Today&apos;s Challenge
              </h2>
              <p className="text-xs sm:text-sm text-white/40 mt-1">
                Random questions from all your courses. Beat the clock!
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-3 py-1.5">
              <Timer className="size-3.5 text-emerald-400/70" />
              <span className="text-[11px] font-bold text-white/50">15 questions · 30 min</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-3 py-1.5">
              <Zap className="size-3.5 text-emerald-400/70" />
              <span className="text-[11px] font-bold text-white/50">10 XP per correct</span>
            </div>
            {status?.previousBest && (
              <div className="flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-3 py-1.5">
                <Trophy className="size-3.5 text-emerald-400/70" />
                <span className="text-[11px] font-bold text-white/50">
                  Best: {status.previousBest.correctCount}/{status.previousBest.totalQuestions}
                </span>
              </div>
            )}
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold flex items-center gap-2">
              <AlertTriangle className="size-4 shrink-0" />
              {error}
            </div>
          )}

          <Button
            onClick={handleStart}
            disabled={state === "loading"}
            className="w-full font-bold py-5 sm:py-6 rounded-xl text-base shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/30 bg-gradient-to-r from-emerald-400 to-green-600 hover:from-emerald-300 hover:to-green-500 text-white border-0 gap-2 transition-all duration-200"
          >
            {state === "loading" ? (
              <>
                <div className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Preparing questions...
              </>
            ) : (
              <>
                <Play className="size-5 fill-white" />
                Start Daily Challenge
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }

  /* ─── Render: Active / Submitting / Review ─── */
  if (state === "active" || state === "submitting" || state === "review") {
    const q = questions[currentIndex];
    if (!q) return null;

    const questionData = toLessonQuestion(q);

    return (
      <div
        ref={questionTopRef}
        className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#081710] to-[#0a0f1f] shadow-2xl shadow-black/20"
      >
        {/* Timer bar */}
        <div className="relative h-1.5 bg-white/5">
          <motion.div
            className="h-full rounded-full"
            style={{
              width: `${timer.progress * 100}%`,
              background: getTimerGradient(timer.progress),
            }}
            transition={{ duration: 0.5 }}
          />
        </div>

        <div className="p-5 sm:p-6">
          {/* Top bar: timer + progress */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Timer className={`size-4 ${getTimerIconClass(timer.totalSeconds)}`} />
              <span className={`text-sm font-bold tabular-nums ${getTimerTextClass(timer.totalSeconds)}`}>
                {String(timer.minutes).padStart(2, "0")}:
                {String(timer.seconds).padStart(2, "0")}
              </span>
            </div>

            <span className="text-[11px] font-bold text-white/30">
              {currentIndex + 1}/{questions.length}
            </span>
          </div>

          {/* Progress dots */}
          <div className="flex flex-wrap items-center gap-1 mb-5">
            {questions.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  i < currentIndex
                    ? "bg-emerald-400/60"
                    : i === currentIndex
                      ? "bg-emerald-400"
                      : "bg-white/10"
                }`}
              />
            ))}
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold flex items-center gap-2">
              <AlertTriangle className="size-4 shrink-0" />
              {error}
            </div>
          )}

          {/* Combo indicator */}
          {combo >= 2 && feedback?.isCorrect && (
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-amber-400/10 border border-amber-400/20 px-3 py-1 text-xs font-bold text-amber-300 animate-pulse">
              🔥 {combo}x Combo
            </div>
          )}

          {/* Question — reuse existing QuestionSection */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {!feedback && (
                <QuestionSection
                  question={questionData}
                  value={value}
                  onValueChange={setValue}
                  onSubmit={() => handleSubmit()}
                  submitting={submitting}
                  partIndex={null}
                  error={error ?? undefined}
                />
              )}

              {/* Feedback — reuse existing FeedbackSection */}
              {feedback ? (
                <FeedbackSection
                  feedback={feedback}
                  onContinue={handleContinue}
                  onRetry={handleRetry}
                />
              ) : (
                <div className="mt-3 flex justify-end">
                  <button
                    type="button"
                    onClick={handleSkip}
                    disabled={submitting}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-white/40 hover:text-white/70 transition-colors disabled:opacity-50"
                  >
                    Skip question
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    );
  }

  /* ─── Render: Results ─── */
  if (state === "results" && resultData) {
    return (
      <div className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-[#0a1f14] via-[#0f1629] to-[#0a0f1f] p-5 sm:p-8 shadow-2xl shadow-emerald-500/5">
        <div className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-emerald-500/10 blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 size-48 rounded-full bg-teal-500/5 blur-[80px]" />

        <div className="relative z-10">
          <div className="flex justify-center mb-6">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="relative"
            >
              <div className="absolute -inset-6 rounded-full bg-emerald-400/15 blur-2xl animate-pulse" />
              <div className="relative grid size-20 place-items-center rounded-full bg-gradient-to-br from-emerald-400 via-green-500 to-teal-500 shadow-2xl shadow-emerald-400/30">
                <Trophy className="size-10 text-white drop-shadow-lg" />
              </div>
            </motion.div>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-2xl font-black text-white">
              {resultData.accuracy >= 80
                ? "Outstanding! 🎉"
                : resultData.accuracy >= 60
                  ? "Great Job! 💪"
                  : resultData.accuracy >= 40
                    ? "Good Effort! 👍"
                    : "Keep Practicing! 📚"}
            </h2>
            <p className="text-sm text-white/40 mt-1">Daily challenge complete</p>
          </div>

          <div className="flex justify-center mb-6">
            <div className="relative">
              <svg width="120" height="120" viewBox="0 0 120 120" className="-rotate-90">
                <circle cx="60" cy="60" r="52" fill="none" stroke="currentColor" strokeWidth="6" className="text-white/5" />
                <circle
                  cx="60" cy="60" r="52" fill="none" stroke="url(#resultGradient)" strokeWidth="6" strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 52}
                  strokeDashoffset={2 * Math.PI * 52 * (1 - resultData.accuracy / 100)}
                  className="transition-all duration-1000"
                />
                <defs>
                  <linearGradient id="resultGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#14b8a6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-white">{resultData.accuracy}%</span>
                <span className="text-[10px] font-bold text-white/30">accuracy</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3 text-center">
              <p className="text-2xl font-black text-white">
                {resultData.correctCount}/{resultData.totalQuestions}
              </p>
              <p className="text-[10px] font-bold text-white/30 mt-0.5">correct</p>
            </div>
            <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3 text-center">
              <p className="text-2xl font-black text-emerald-400">+{resultData.xpEarned}</p>
              <p className="text-[10px] font-bold text-white/30 mt-0.5">XP earned</p>
            </div>
          </div>

          {resultData.didLevelUp && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 p-4 text-center mb-6"
            >
              <span className="text-sm font-bold text-emerald-300">
                ⭐ Level Up! Level {resultData.level} — {resultData.levelTitle}
              </span>
            </motion.div>
          )}

          {answerHistory.length > 0 && (
            <div className="mb-6">
              <button
                type="button"
                onClick={() => setShowReview((prev) => !prev)}
                className="w-full flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-bold text-white/70 hover:text-white hover:bg-white/[0.06] transition-colors"
              >
                <span>Review your answers</span>
                <span className="ml-2 text-sm text-white/40">
                  {answerHistory.filter((a) => a.isCorrect).length} correct
                </span>
              </button>

              {showReview && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-3 flex flex-col gap-2 overflow-hidden"
                >
                  {answerHistory.map((a, i) => (
                    <div
                      key={i}
                      className={`rounded-xl border p-3 ${
                        a.isCorrect
                          ? "border-emerald-500/20 bg-emerald-500/[0.06]"
                          : "border-red-500/20 bg-red-500/[0.06]"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`text-[10px] font-extrabold uppercase tracking-wider ${
                            a.isCorrect ? "text-emerald-400" : "text-red-400"
                          }`}
                        >
                          Q{i + 1} · {a.isCorrect ? "Correct" : "Incorrect"}
                        </span>
                      </div>
                      <p className="text-sm text-white/80 leading-snug">{a.question}</p>
                      {!a.isCorrect && (
                        <p className="mt-1 text-xs text-white/40">
                          Correct answer:{" "}
                          <code className="rounded bg-white/10 px-1 py-0.5 font-mono">
                            {a.correctAnswer}
                          </code>
                        </p>
                      )}
                    </div>
                  ))}
                </motion.div>
              )}
            </div>
          )}

          <Button
            onClick={handlePlayBack}
            className="w-full font-bold py-3 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white gap-2"
          >
            <RotateCcw className="size-4" />
            Back to Practice
          </Button>
        </div>
      </div>
    );
  }

  /* ─── Render: Time's up (challenge expired while away) ─── */
  if (state === "expired") {
    return (
      <div className="relative overflow-hidden rounded-3xl border border-amber-500/20 bg-gradient-to-br from-[#1a1509] via-[#0f1629] to-[#0a0f1f] p-5 sm:p-8 shadow-2xl shadow-amber-500/5">
        <div className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-amber-500/10 blur-[100px]" />
        <div className="relative z-10 text-center">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="mb-5 flex justify-center"
          >
            <div className="relative grid size-20 place-items-center rounded-full bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 shadow-2xl shadow-amber-400/30">
              <Clock className="size-10 text-white drop-shadow-lg" />
            </div>
          </motion.div>
          <h2 className="text-2xl font-black text-white">Time&apos;s up!</h2>
          <p className="text-sm text-white/40 mt-2 mb-6">
            Your challenge timer ran out while you were away. View your results
            to see how you did.
          </p>
          <div className="flex flex-col gap-2">
            <Button
              onClick={handleComplete}
              className="w-full font-bold py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:opacity-90 gap-2"
            >
              <CheckCircle className="size-4" />
              View Results
            </Button>
            <Button
              onClick={goBackToPractice}
              className="w-full font-bold py-3 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white gap-2"
            >
              <RotateCcw className="size-4" />
              Back to Practice
            </Button>
          </div>
        </div>
      </div>
    );
  }

  /* ─── Render: Already completed today ─── */
  if (state === "completed") {
    return (
      <div className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-[#0a1f14] via-[#0f1629] to-[#0a0f1f] p-5 sm:p-8 shadow-2xl shadow-emerald-500/5">
        <div className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-emerald-500/10 blur-[100px]" />
        <div className="relative z-10 text-center">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="mb-5 flex justify-center"
          >
            <div className="relative grid size-20 place-items-center rounded-full bg-gradient-to-br from-emerald-400 via-green-500 to-teal-500 shadow-2xl shadow-emerald-400/30">
              <Trophy className="size-10 text-white drop-shadow-lg" />
            </div>
          </motion.div>
          <h2 className="text-2xl font-black text-white">Today&apos;s challenge complete</h2>
          <p className="text-sm text-white/40 mt-2 mb-6">
            You already finished today&apos;s challenge. Come back tomorrow!
          </p>
          <Button
            onClick={goBackToPractice}
            className="w-full font-bold py-3 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white gap-2"
          >
            <RotateCcw className="size-4" />
            Back to Practice
          </Button>
        </div>
      </div>
    );
  }

  return null;
}