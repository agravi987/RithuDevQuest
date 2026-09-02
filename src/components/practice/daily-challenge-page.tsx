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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuestionSection } from "@/components/lesson/question-section";
import { FeedbackSection } from "@/components/lesson/feedback-section";
import type { LessonQuestionData, SubmitAnswerResult } from "@/lib/lesson/types";

/* ─── Types ─── */

type ChallengeState =
  | "loading"
  | "landing"
  | "active"
  | "submitting"
  | "review"
  | "results"
  | "completed";

type ChallengeQuestion = {
  id: string;
  question: string;
  type: string;
  difficulty: string;
  options: string[] | null;
  hint: string | null;
  order: number;
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

function useChallengeTimer(expiresAt: Date | null) {
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
  const progress = expiresAt
    ? Math.max(0, Math.min(1, remaining / (30 * 60 * 1000)))
    : 1;

  return { minutes, seconds, totalSeconds, isExpired, progress };
}

/* ─── Helpers ─── */

function toLessonQuestion(q: ChallengeQuestion): LessonQuestionData {
  return {
    id: q.id,
    type: q.type as LessonQuestionData["type"],
    difficulty: q.difficulty as LessonQuestionData["difficulty"],
    question: q.question,
    options: q.options,
    parts: null,
    hint: q.hint,
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

  const timer = useChallengeTimer(state === "active" ? expiresAt : null);
  const currentValueRef = useRef<string | null>(null);

  useEffect(() => {
    currentValueRef.current = value;
  }, [value]);

  const goBackToPractice = () => router.push("/practice");

  // Load status on mount
  useEffect(() => {
    fetch("/api/daily-challenge")
      .then((r) => r.json())
      .then((s: ChallengeStatus) => {
        setStatus(s);
        if (s.hasChallengeToday && s.isCompleted) {
          setState("completed");
          return;
        }
        if (s.isActive) {
          // Resume active challenge
          fetch("/api/daily-challenge", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "start" }),
          })
            .then((r) => r.json())
            .then((res) => {
              if (res.success && res.challengeId && res.questions && res.expiresAt) {
                setChallengeId(res.challengeId);
                setQuestions(res.questions);
                setExpiresAt(new Date(res.expiresAt));
                setState("active");
              } else {
                setState("landing");
              }
            });
        } else {
          setState("landing");
        }
      });
  }, []);

  // Auto-complete when timer expires
  useEffect(() => {
    if (timer.isExpired && state === "active" && challengeId) {
      handleComplete();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timer.isExpired]);

  const handleStart = async () => {
    setState("loading");
    setError(null);
    const res = await fetch("/api/daily-challenge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "start" }),
    }).then((r) => r.json());

    if (res.success && res.challengeId && res.questions && res.expiresAt) {
      setChallengeId(res.challengeId);
      setQuestions(res.questions);
      setExpiresAt(new Date(res.expiresAt));
      setCurrentIndex(0);
      setValue(null);
      setFeedback(null);
      setState("active");
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

    setSubmitting(true);
    setState("submitting");

    const res = await fetch("/api/daily-challenge/answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ challengeId, questionId: q.id, userAnswer: answer }),
    }).then((r) => r.json());

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
      setState("review");
    } else {
      setError(res.error ?? "Failed to submit");
      setState("active");
    }

    setSubmitting(false);
  };

  const handleContinue = () => {
    if (!feedback?.isCorrect) return;

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setValue(null);
      setFeedback(null);
      setState("active");
    } else {
      handleComplete();
    }
  };

  const handleRetry = () => {
    setFeedback(null);
    setValue(null);
    setState("active");
  };

  const handleComplete = async () => {
    if (!challengeId) return;
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
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#081710] to-[#0a0f1f] shadow-2xl shadow-black/20">
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
          <div className="flex items-center justify-between mb-5">
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
              {feedback && (
                <FeedbackSection
                  feedback={feedback}
                  onContinue={handleContinue}
                  onRetry={handleRetry}
                />
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