"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  AlertTriangle,
  ChevronDown,
  ChevronLeft,
  Play,
  Search,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";

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
import type {
  PracticeTopicSkill,
  PracticeTopicTree,
} from "@/lib/practice/queries";
import { getPlanetForCareer } from "@/lib/galaxy-assets";

/* ─── Types ─── */

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

function skillMatches(skill: PracticeTopicSkill, query: string): boolean {
  return skill.name.toLowerCase().includes(query);
}

/* ─── Main Component ─── */

export function QuickPracticePage({ topicTree }: { topicTree: PracticeTopicTree }) {
  const router = useRouter();
  const [state, setState] = useState<PageState>("landing");
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [query, setQuery] = useState("");
  const [openCareers, setOpenCareers] = useState<Set<string>>(
    () => new Set(topicTree.careers.slice(0, 1).map((c) => c.id)),
  );
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

  const toggleCareer = (careerId: string) => {
    setOpenCareers((prev) => {
      const next = new Set(prev);
      if (next.has(careerId)) {
        next.delete(careerId);
      } else {
        next.add(careerId);
      }
      return next;
    });
  };

  /* Search narrows skills within the tree; matching sections auto-expand. */
  const trimmedQuery = query.trim().toLowerCase();
  const isSearching = trimmedQuery.length > 0;

  const visibleCareers = useMemo(() => {
    if (!isSearching) return topicTree.careers;
    return topicTree.careers
      .map((career) => ({
        ...career,
        paths: career.paths
          .map((path) => {
            const pathMatches = path.name.toLowerCase().includes(trimmedQuery);
            return {
              ...path,
              modules: path.modules
                .map((mod) => {
                  const moduleMatches =
                    pathMatches || mod.name.toLowerCase().includes(trimmedQuery);
                  return {
                    ...mod,
                    skills: moduleMatches
                      ? mod.skills
                      : mod.skills.filter((s) => skillMatches(s, trimmedQuery)),
                  };
                })
                .filter((m) => m.skills.length > 0),
            };
          })
          .filter((p) => p.modules.length > 0),
      }))
      .filter((c) => c.paths.length > 0);
  }, [isSearching, trimmedQuery, topicTree.careers]);

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
  const selectedLabel = getSelectedLabel(selectedTopic, topicTree);

  return (
    <div className={cn("relative overflow-hidden rounded-3xl border border-primary/20 p-5 sm:p-8 shadow-2xl shadow-primary/5", DEEP_SPACE_CARD)}>
      <div className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-primary/10 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 size-48 rounded-full bg-emerald-500/5 blur-[80px]" />

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
          {selectedTopic !== "all" && selectedLabel && (
            <div className="flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/30 px-3 py-1.5">
              <Target className="size-3.5 text-primary" />
              <span className="text-[11px] font-bold text-primary truncate max-w-[200px]">{selectedLabel}</span>
            </div>
          )}
        </div>

        {/* ═══════════ STRUCTURED TOPIC PICKER ═══════════ */}
        <div className="mb-6">
          <div className="flex items-center justify-between gap-3 mb-3">
            <p className="text-[11px] font-bold uppercase tracking-widest text-white/30">
              Choose a topic
            </p>
            <span className="text-[10px] font-bold text-white/30">
              {topicTree.totalCount} questions available
            </span>
          </div>

          {/* Search + shortcut chips */}
          <div className="flex flex-col sm:flex-row gap-2.5 mb-4">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/30" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search skills..."
                aria-label="Search practice topics"
                className="input-focus-glow w-full rounded-xl border border-white/10 bg-black/30 py-2.5 pl-9 pr-3 text-sm font-semibold text-white placeholder:text-white/25 outline-none"
              />
            </div>
            <div className="flex gap-2">
              <TopicChip
                label="All Topics"
                count={topicTree.totalCount}
                selected={selectedTopic === "all"}
                onSelect={() => setSelectedTopic("all")}
              />
              {topicTree.general && (
                <TopicChip
                  label="General"
                  count={topicTree.general.count}
                  selected={selectedTopic === "general"}
                  onSelect={() => setSelectedTopic("general")}
                />
              )}
            </div>
          </div>

          {/* Career sections */}
          <div className="flex flex-col gap-2.5">
            {visibleCareers.length === 0 && (
              <div className="rounded-xl border border-white/10 bg-black/20 px-4 py-6 text-center text-xs font-semibold text-white/40">
                No skills match &ldquo;{query}&rdquo;. Try a different search.
              </div>
            )}

            {visibleCareers.map((career) => {
              const planet = getPlanetForCareer(career.slug);
              const expanded = isSearching || openCareers.has(career.id);
              return (
                <div
                  key={career.id}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-black/20"
                >
                  <button
                    type="button"
                    onClick={() => toggleCareer(career.id)}
                    aria-expanded={expanded}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-white/5"
                  >
                    <span className="relative size-8 shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={planet.src}
                        alt=""
                        className="size-full object-contain"
                        draggable={false}
                      />
                    </span>
                    <span className="flex-1 min-w-0 text-sm font-black text-white truncate">
                      {career.name}
                    </span>
                    <span className="shrink-0 rounded-md bg-white/5 border border-white/10 px-2 py-0.5 text-[10px] font-extrabold text-white/40">
                      {career.questionCount}
                    </span>
                    <ChevronDown
                      className={cn(
                        "size-4 shrink-0 text-white/40 transition-transform duration-200",
                        expanded && "rotate-180",
                      )}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {expanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="overflow-hidden"
                      >
                        <div className="flex flex-col gap-4 border-t border-white/5 px-4 pb-4 pt-4">
                          {career.paths.map((path) => (
                            <div key={path.id} className="flex flex-col gap-3">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black uppercase tracking-widest text-white/40">
                                  {path.name}
                                </span>
                                <span className="h-px flex-1 bg-white/5" />
                              </div>

                              {path.modules.map((mod) => (
                                <div key={mod.id} className="flex flex-col gap-1.5">
                                  <p className="text-[11px] font-bold text-white/30">
                                    {mod.name}
                                  </p>
                                  <div className="flex flex-wrap gap-1.5" role="listbox" aria-label={`${career.name} topics`}>
                                    {mod.skills.map((skill) => (
                                      <TopicChip
                                        key={`${career.id}-${skill.id}`}
                                        label={formatSkillName(skill.name)}
                                        count={skill.count}
                                        selected={selectedTopic === skill.id}
                                        onSelect={() => setSelectedTopic(skill.id)}
                                      />
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
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
            disabled={topicTree.totalCount === 0}
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

/* ─── Small UI pieces ─── */

function TopicChip({
  label,
  count,
  selected,
  onSelect,
}: {
  label: string;
  count: number;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      role="option"
      aria-selected={selected}
      onClick={onSelect}
      className={cn(
        "flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-bold transition-all duration-200",
        selected
          ? "border-primary/50 bg-primary/15 text-white shadow-md shadow-primary/10"
          : "border-white/10 bg-white/[0.03] text-white/50 hover:border-white/20 hover:text-white/80",
      )}
    >
      <span className="truncate max-w-[180px]">{label}</span>
      <span className="text-[10px] font-extrabold text-white/30">{count}</span>
    </button>
  );
}

function formatSkillName(name: string): string {
  return name.replace(/-/g, " ");
}

function getSelectedLabel(selectedTopic: string, tree: PracticeTopicTree): string | null {
  if (selectedTopic === "all") return null;
  if (selectedTopic === "general") return tree.general?.name ?? "General";
  for (const career of tree.careers) {
    for (const path of career.paths) {
      for (const mod of path.modules) {
        const skill = mod.skills.find((s) => s.id === selectedTopic);
        if (skill) return formatSkillName(skill.name);
      }
    }
  }
  return null;
}
