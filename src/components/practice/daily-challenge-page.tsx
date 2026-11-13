"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  Timer,
  Zap,
  Trophy,
  Play,
  ChevronLeft,
  AlertTriangle,
  RotateCcw,
  Clock,
  CheckCircle,
} from "lucide-react";
import { DuoButton } from "@/components/quiz/duo-button";
import { CosmicCharacter } from "@/components/quiz/characters/CosmicCharacter";
import { QuizExperience, type QuizQuestion, type DeepPartial, type QuizModeConfig } from "@/components/quiz";
import { buildRichPayload } from "@/lib/quiz/types";
import type { LessonQuestionData, SubmitAnswerResult } from "@/lib/lesson/types";
import { cn } from "@/lib/utils";
import { DEEP_SPACE_CARD, DEEP_SPACE_SUBTLE } from "@/lib/theme";

/* ─── Types ─── */

type ChallengeState =
  | "loading"
  | "landing"
  | "active"
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

/* ─── Helpers ─── */

function toQuizQuestion(q: ChallengeQuestion): QuizQuestion {
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
    order: q.order,
    userAnswer: q.userAnswer ?? null,
    isCorrect: q.isCorrect ?? null,
    answeredAt: q.answeredAt ?? null,
    ...(rich?.payload ? { payload: rich.payload } : {}),
  };
}

/* ─── Main Component ─── */

export function DailyChallengePage() {
  const router = useRouter();
  const [state, setState] = useState<ChallengeState>("loading");
  const [status, setStatus] = useState<ChallengeStatus | null>(null);
  const [challengeId, setChallengeId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<ChallengeQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [remainingMs, setRemainingMs] = useState(30 * 60 * 1000);
  const [resultData, setResultData] = useState<{
    totalQuestions: number;
    correctCount: number;
    accuracy: number;
    xpEarned: number;
    didLevelUp: boolean;
    level: number;
    levelTitle: string;
  } | null>(null);
  const [answerHistory, setAnswerHistory] = useState<
    { question: string; isCorrect: boolean; correctAnswer: string }[]
  >([]);
  const [showReview, setShowReview] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const completingRef = useRef(false);

  // Restrict the quiz countdown to the true server deadline on a resumed
  // challenge; a fresh start simply uses the full window.
  const quizConfig = useMemo<DeepPartial<QuizModeConfig>>(
    () => ({ timer: { durationMs: remainingMs } }),
    [remainingMs],
  );

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
    setRemainingMs(Math.max(0, new Date(res.expiresAt).getTime() - Date.now()));

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
    setError(null);
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

  // Server-side grading + persistence for each submitted answer.
  const submitToServer = async (
    q: QuizQuestion,
    answer: string,
  ): Promise<SubmitAnswerResult> => {
    if (!challengeId) throw new Error("Challenge not started");

    const response = await fetch("/api/daily-challenge/answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ challengeId, questionId: q.id, userAnswer: answer }),
    });
    const res = await response.json();

    if (res.success && res.isCorrect !== undefined) {
      setAnswerHistory((prev) => [
        ...prev,
        {
          question: q.question,
          isCorrect: res.isCorrect,
          correctAnswer: res.correctAnswer ?? "",
        },
      ]);
      return {
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
      };
    }

    if (res.error === "Time's up!") {
      setError("Time's up! Auto-completing your challenge...");
      void handleComplete();
      throw new Error("Time's up");
    }

    throw new Error(res.error ?? "Failed to submit answer");
  };

  // Server-side completion: applies bonuses/gamification and drives results.
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
        setError(null);
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
      <div className={cn("relative overflow-hidden rounded-3xl border border-white/10 p-8", DEEP_SPACE_SUBTLE)}>
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
      <div className="relative overflow-hidden rounded-3xl border-2 border-emerald-500/30 border-b-[8px] border-b-emerald-600/40 bg-card p-6 sm:p-8 shadow-2xl shadow-emerald-500/5">
        <div className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-emerald-500/10 blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 size-48 rounded-full bg-teal-500/10 blur-[80px]" />

        <button
          type="button"
          onClick={goBackToPractice}
          className="relative z-10 mb-5 inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="size-4" />
          Back to Practice Arena
        </button>

        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 mb-6 text-center sm:text-left">
            <div className="relative shrink-0">
              <div className="relative size-20 sm:size-24 flex items-center justify-center rounded-3xl bg-emerald-500/15 border-2 border-b-4 border-emerald-500/40 shadow-lg shadow-emerald-500/10">
                <CosmicCharacter
                  characterId="nova"
                  mood="happy_jump"
                  size="custom"
                  className="size-16 sm:size-20"
                />
              </div>
              <span className="absolute -bottom-2 -right-2 flex size-7 items-center justify-center rounded-full bg-emerald-400 text-slate-950 font-black text-xs shadow-md">
                ⚡
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1.5">
                <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full border border-b-2 border-emerald-500/30 bg-emerald-500/15 text-emerald-400">
                  Timed Blitz Challenge
                </span>
                <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full border border-b-2 border-amber-500/30 bg-amber-500/15 text-amber-400">
                  +30 Bonus XP
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                Today&apos;s Speed Run
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 font-medium">
                15 rapid-fire questions sampled across all your active learning paths. Beat the countdown!
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-6">
            <div className="flex items-center gap-1.5 rounded-2xl bg-card border-2 border-b-3 border-border/80 px-3.5 py-2">
              <Timer className="size-4 text-emerald-400" />
              <span className="text-xs font-black text-foreground">15 Questions · 30 Min</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-2xl bg-card border-2 border-b-3 border-border/80 px-3.5 py-2">
              <Zap className="size-4 text-amber-400" />
              <span className="text-xs font-black text-amber-400">10 XP + Combo Bonus</span>
            </div>
            {status?.previousBest && (
              <div className="flex items-center gap-1.5 rounded-2xl bg-card border-2 border-b-3 border-border/80 px-3.5 py-2">
                <Trophy className="size-4 text-yellow-400" />
                <span className="text-xs font-black text-foreground">
                  Personal Best: {status.previousBest.correctCount}/{status.previousBest.totalQuestions}
                </span>
              </div>
            )}
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-2xl bg-red-500/10 border-2 border-b-3 border-red-500/20 text-red-400 text-xs font-black flex items-center gap-2">
              <AlertTriangle className="size-4 shrink-0" />
              {error}
            </div>
          )}

          <DuoButton
            variant="primary"
            size="lg"
            onClick={handleStart}
            disabled={state === "loading"}
            className="w-full"
          >
            {state === "loading" ? (
              <>
                <div className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white mr-2" />
                PREPARING SPEED RUN...
              </>
            ) : (
              <>
                <Play className="size-5 fill-white mr-2" />
                START DAILY CHALLENGE
              </>
            )}
          </DuoButton>
        </div>
      </div>
    );
  }

  /* ─── Render: Active (QuizExperience) ─── */
  if (state === "active") {
    return (
      <QuizExperience
        mode="daily"
        config={quizConfig}
        questions={questions.map(toQuizQuestion)}
        initialState={{ currentIndex }}
        onSubmitAnswer={submitToServer}
        onComplete={handleComplete}
        onExit={handlePlayBack}
        externalCompletion
      />
    );
  }

  /* ─── Render: Results ─── */
  if (state === "results" && resultData) {
    return (
      <div className={cn("relative overflow-hidden rounded-3xl border border-emerald-500/20 p-5 sm:p-8 shadow-2xl shadow-emerald-500/5", DEEP_SPACE_CARD)}>
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

          <div className="mt-4">
            <DuoButton
              variant="primary"
              size="lg"
              onClick={handlePlayBack}
              className="w-full"
            >
              <RotateCcw className="size-4 mr-2" />
              RETURN TO PRACTICE ARENA
            </DuoButton>
          </div>
        </div>
      </div>
    );
  }

  /* ─── Render: Time's up (challenge expired while away) ─── */
  if (state === "expired") {
    return (
      <div className="relative overflow-hidden rounded-3xl border-2 border-amber-500/30 border-b-[8px] border-b-amber-600/40 bg-card p-6 sm:p-8 shadow-2xl shadow-amber-500/5">
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
          <h2 className="text-2xl font-black text-foreground">Time&apos;s Up!</h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-2 mb-6 font-medium">
            Your challenge countdown reached zero while away. Review your results to see your performance.
          </p>
          <div className="flex flex-col gap-3">
            <DuoButton
              variant="primary"
              size="lg"
              onClick={handleComplete}
              className="w-full"
            >
              <CheckCircle className="size-4 mr-2" />
              VIEW RESULTS
            </DuoButton>
            <DuoButton
              variant="neutral"
              size="md"
              onClick={goBackToPractice}
              className="w-full"
            >
              <RotateCcw className="size-4 mr-2" />
              BACK TO PRACTICE
            </DuoButton>
          </div>
        </div>
      </div>
    );
  }

  /* ─── Render: Already completed today ─── */
  if (state === "completed") {
    return (
      <div className="relative overflow-hidden rounded-3xl border-2 border-emerald-500/30 border-b-[8px] border-b-emerald-600/40 bg-card p-6 sm:p-8 shadow-2xl shadow-emerald-500/5">
        <div className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-emerald-500/10 blur-[100px]" />
        <div className="relative z-10 text-center">
          <div className="mb-5 flex justify-center">
            <div className="relative size-20 flex items-center justify-center rounded-3xl bg-emerald-500/15 border-2 border-b-4 border-emerald-500/40 shadow-lg shadow-emerald-500/10">
              <CosmicCharacter
                characterId="rithu"
                mood="celebrating"
                size="custom"
                className="size-16"
              />
            </div>
          </div>
          <h2 className="text-2xl font-black text-foreground">Today&apos;s Challenge Complete! 🎉</h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-2 mb-6 font-medium">
            You&apos;ve conquered today&apos;s speed run. New challenges unlock tomorrow at midnight!
          </p>
          <DuoButton
            variant="primary"
            size="lg"
            onClick={goBackToPractice}
            className="w-full"
          >
            <RotateCcw className="size-4 mr-2" />
            RETURN TO PRACTICE ARENA
          </DuoButton>
        </div>
      </div>
    );
  }

  return null;
}