"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { AlertTriangle, ChevronLeft, Play, Sparkles, Target, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  QuizExperience,
  type DeepPartial,
  type QuizModeConfig,
  type QuizQuestion,
} from "@/components/quiz";
import { buildRichPayload } from "@/lib/quiz/types";
import { cn } from "@/lib/utils";
import { DEEP_SPACE_CARD, DEEP_SPACE_SUBTLE } from "@/lib/theme";
import { PlanetVisual } from "@/components/galaxy/planet-visual";

/* ─── Types ─── */

export type PracticeTopic = {
  id: string;
  name: string;
  count: number;
};

export type QuickPracticeQuestion = {
  id: string;
  question: string;
  type: string;
  difficulty: string;
  options: unknown[] | null;
  parts: { prompt: string }[] | null;
  correctAnswer: string;
  explanation: string;
  hint: string | null;
};

type PageState = "landing" | "loading" | "active";

const QUICK_QUESTION_COUNT = 12;

/* ─── Helpers ─── */

function toQuizQuestion(q: QuickPracticeQuestion): QuizQuestion {
  const rich = buildRichPayload({ type: q.type, options: q.options, parts: q.parts });

  return {
    id: q.id,
    type: q.type as QuizQuestion["type"],
    difficulty: q.difficulty as QuizQuestion["difficulty"],
    question: q.question,
    options: q.options,
    parts: q.parts,
    hint: q.hint,
    order: 0,
    userAnswer: null,
    isCorrect: null,
    answeredAt: null,
    correctAnswer: q.correctAnswer,
    ...(rich?.payload ? { payload: rich.payload } : {}),
  };
}

/* ─── Main Component ─── */

export function QuickPracticePage({ topics }: { topics: PracticeTopic[] }) {
  const router = useRouter();
  const [state, setState] = useState<PageState>("landing");
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [questions, setQuestions] = useState<QuizQuestion[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Casual, no-XP mode: grading is local and nothing is persisted.
  const quizConfig = useMemo<DeepPartial<QuizModeConfig>>(
    () => ({
      mode: "custom",
      scoring: {
        xpPerCorrect: 0,
        xpPerIncorrect: 0,
        comboBonus: { enabled: false },
        streakBonus: { enabled: false },
      },
      feedback: { showXpEarned: false, allowRetry: false },
      theme: {
        variant: "practice",
        accentColor: "primary",
        backgroundClass: "bg-gradient-to-br from-primary/5 via-background to-emerald-500/5",
        cardClass: "bg-primary/5 border-primary/20",
      },
    }),
    [],
  );

  const goBackToPractice = () => router.push("/practice");

  const handleStart = async () => {
    setState("loading");
    setError(null);

    const params = new URLSearchParams({
      topic: selectedTopic,
      count: String(QUICK_QUESTION_COUNT),
    });

    try {
      const res = await fetch(`/api/practice/quick?${params.toString()}`);
      const data = await res.json();

      if (res.ok && data.success && Array.isArray(data.questions) && data.questions.length > 0) {
        setQuestions(data.questions.map(toQuizQuestion));
        setState("active");
      } else {
        setError(data.error ?? "Failed to load questions. Please try again.");
        setState("landing");
      }
    } catch {
      setError("Failed to load questions. Please try again.");
      setState("landing");
    }
  };

  const handleDone = () => {
    setQuestions(null);
    setError(null);
    setState("landing");
  };

  /* ─── Render: Active (QuizExperience, internal results) ─── */
  if (state === "active" && questions && questions.length > 0) {
    return (
      <QuizExperience
        mode="custom"
        config={quizConfig}
        questions={questions}
        onExit={handleDone}
      />
    );
  }

  /* ─── Render: Loading ─── */
  if (state === "loading") {
    return (
      <div className={cn("relative overflow-hidden rounded-3xl border border-white/10 p-8", DEEP_SPACE_SUBTLE)}>
        <div className="flex items-center justify-center gap-3 text-white/40">
          <div className="size-5 animate-spin rounded-full border-2 border-white/20 border-t-emerald-400" />
          <span className="text-sm font-medium">Preparing your questions...</span>
        </div>
      </div>
    );
  }

  /* ─── Render: Landing ─── */
  return (
    <div className={cn("relative overflow-hidden rounded-3xl border border-primary/20 p-5 sm:p-8 shadow-2xl shadow-primary/5", DEEP_SPACE_CARD)}>
      <div className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-primary/10 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 size-48 rounded-full bg-emerald-500/5 blur-[80px]" />

      <div className="pointer-events-none absolute -right-10 -top-6 hidden sm:block opacity-25">
        <PlanetVisual src="/png_images/planets/devops.png" alt="" size={160} orbit float />
      </div>

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
          <div className="grid size-14 sm:size-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-violet-400 via-primary to-emerald-500 shadow-lg shadow-primary/20">
            <Target className="size-7 sm:size-8 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary/70">
                Quick Practice
              </span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                Casual
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Sharpen Your Skills
            </h2>
            <p className="text-xs sm:text-sm text-white/40 mt-1">
              Pick a topic and answer a quick batch. Instant feedback, no pressure.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-3 py-1.5">
            <Sparkles className="size-3.5 text-primary/70" />
            <span className="text-[11px] font-bold text-white/50">{QUICK_QUESTION_COUNT} questions</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-3 py-1.5">
            <Zap className="size-3.5 text-primary/70" />
            <span className="text-[11px] font-bold text-white/50">No XP · casual</span>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-[11px] font-bold uppercase tracking-widest text-white/30 mb-3">
            Choose a topic
          </p>
          <div className="flex flex-wrap gap-2" role="listbox" aria-label="Practice topic">
            {topics.map((topic) => {
              const selected = selectedTopic === topic.id;
              return (
                <button
                  key={topic.id}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => setSelectedTopic(topic.id)}
                  className={cn(
                    "flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-bold transition-all duration-200",
                    selected
                      ? "border-primary/50 bg-primary/15 text-white shadow-md shadow-primary/10"
                      : "border-white/10 bg-white/[0.03] text-white/50 hover:border-white/20 hover:text-white/80",
                  )}
                >
                  <span className="truncate max-w-[180px]">{topic.name}</span>
                  <span className="text-[10px] font-extrabold text-white/30">{topic.count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold flex items-center gap-2">
            <AlertTriangle className="size-4 shrink-0" />
            {error}
          </div>
        )}

        <motion.div whileTap={{ scale: 0.98 }}>
          <Button
            onClick={() => void handleStart()}
            disabled={topics.length === 0}
            className="w-full font-bold py-5 sm:py-6 rounded-xl text-base shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 bg-gradient-to-r from-violet-500 via-primary to-emerald-500 hover:from-violet-400 hover:via-primary hover:to-emerald-400 text-white border-0 gap-2 transition-all duration-200 disabled:opacity-60"
          >
            <Play className="size-5 fill-white" />
            Start Quick Practice
          </Button>
        </motion.div>
      </div>
    </div>
  );
}