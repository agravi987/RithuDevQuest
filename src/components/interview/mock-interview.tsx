"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Bot,
  Play,
  AlertTriangle,
  Trophy,
  Zap,
} from "lucide-react";

type TranscriptEntry = {
  role: "interviewer" | "user";
  text: string;
  score?: number;
};

type Summary = {
  overall: number;
  summary: string;
  strengths: string[];
  improvements: string[];
};

type Props = {
  career: { id: string; slug: string; title: string };
};

export function MockInterview({ career }: Props) {
  const [phase, setPhase] = useState<"intro" | "active" | "summary">("intro");
  const [busy, setBusy] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [round, setRound] = useState(0);
  const [totalRounds, setTotalRounds] = useState(5);
  const [answer, setAnswer] = useState("");
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [transcript, busy, phase]);

  async function start() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/interview/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ careerId: career.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to start interview");

      setSessionId(data.sessionId);
      setRound(1);
      setTotalRounds(data.totalRounds);
      setTranscript([{ role: "interviewer", text: data.question }]);
      setPhase("active");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setBusy(false);
    }
  }

  async function submit() {
    if (!answer.trim() || !sessionId || busy) return;
    const userAnswer = answer.trim();
    setBusy(true);
    setError(null);
    setAnswer("");

    setTranscript((prev) => [...prev, { role: "user", text: userAnswer }]);

    try {
      const res = await fetch("/api/interview/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, userAnswer }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to submit answer");

      // Feedback bubble
      const tipsLine = data.answered.tips
        ? `\n\nTip: ${data.answered.tips}`
        : "";
      setTranscript((prev) => [
        ...prev,
        {
          role: "interviewer",
          text: `Score: ${data.answered.score}/100\n${data.answered.feedback}${tipsLine}`,
          score: data.answered.score,
        },
      ]);

      if (data.isComplete) {
        setSummary(data.summary);
        setPhase("summary");
      } else {
        setRound((prev) => prev + 1);
        setTranscript((prev) => [
          ...prev,
          { role: "interviewer", text: data.nextQuestion },
        ]);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setBusy(false);
    }
  }

  // ─── Intro ──────────────────────────────────────────────
  if (phase === "intro") {
    return (
      <div className="mx-auto max-w-lg space-y-8 py-12 text-center">
        <div className="mx-auto grid size-20 place-items-center rounded-full bg-primary/10">
          <Bot className="size-10 text-primary" />
        </div>
        <div className="space-y-3">
          <h1 className="text-2xl font-black tracking-tight">
            {career.title} Mock Interview
          </h1>
          <p className="mx-auto max-w-md text-sm leading-relaxed text-muted-foreground">
            5 rounds of live technical questions with instant AI feedback.
            Answer honestly — the AI adapts to what you say.
          </p>
        </div>
        <button
          disabled={busy}
          onClick={start}
          className="rounded-xl bg-primary px-8 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          {busy ? (
            "Preparing..."
          ) : (
            <>
              <Play className="mr-1 inline size-4 align-text-bottom" />
              Start Interview
            </>
          )}
        </button>
      </div>
    );
  }

  // ─── Summary ─────────────────────────────────────────────
  if (phase === "summary" && summary) {
    return (
      <div className="mx-auto max-w-2xl space-y-10 py-8">
        <div className="space-y-3 text-center">
          <div className="mx-auto grid size-20 place-items-center rounded-full bg-primary/10">
            <Trophy className="size-10 text-primary" />
          </div>
          <h2 className="text-2xl font-black tracking-tight">
            Interview Complete!
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-primary/20 bg-card p-6 text-center">
            <p className="text-4xl font-black text-primary">{summary.overall}</p>
            <p className="mt-1 text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Overall Score
            </p>
          </div>
          <div className="rounded-2xl border border-primary/20 bg-card p-6">
            <p className="mb-2 text-sm font-bold">Summary</p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {summary.summary}
            </p>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-3">
            <h3 className="text-sm font-black text-emerald-500">Strengths</h3>
            <ul className="space-y-2">
              {summary.strengths.map((s, i) => (
                <li
                  key={i}
                  className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-sm text-muted-foreground"
                >
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-black text-amber-500">
              Areas to Improve
            </h3>
            <ul className="space-y-2">
              {summary.improvements.map((s, i) => (
                <li
                  key={i}
                  className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-sm text-muted-foreground"
                >
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // ─── Active chat ────────────────────────────────────────
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4 py-4">
      {/* Header */}
      <div className="flex items-center gap-3 rounded-2xl border border-border/50 bg-card/50 p-4">
        <div className="grid size-10 place-items-center rounded-xl bg-primary/20 text-primary">
          <Bot className="size-5" />
        </div>
        <div>
          <h2 className="text-sm font-black">{career.title} Interview</h2>
          <p className="text-[10px] text-muted-foreground">
            Round {round} / {totalRounds}
          </p>
        </div>
        <div className="ml-auto flex gap-2">
          {Array.from({ length: totalRounds }, (_, i) => (
            <div
              key={i}
              className={`size-2.5 rounded-full transition-colors ${
                i < round ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Transcript */}
      <div
        ref={scrollRef}
        className="min-h-[400px] max-h-[600px] flex-1 space-y-4 overflow-y-auto rounded-3xl border border-border/40 bg-card/30 p-4"
      >
        <AnimatePresence initial={false}>
          {transcript.map((entry, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${
                entry.role === "user" ? "justify-end" : ""
              }`}
            >
              {entry.role === "interviewer" && (
                <div className="grid size-8 shrink-0 place-items-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                  R
                </div>
              )}
              <div
                className={`max-w-[80%] whitespace-pre-wrap rounded-2xl p-4 text-sm leading-relaxed ${
                  entry.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                {entry.text}
                {entry.score !== undefined && (
                  <div className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-background/50 px-2 py-1 text-[10px] font-bold text-primary">
                    <Zap className="size-3 fill-current" /> {entry.score} pts
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {busy && (
          <div className="flex gap-3">
            <div className="grid size-8 shrink-0 place-items-center rounded-full bg-primary/20 text-xs font-bold text-primary">
              R
            </div>
            <div className="flex items-center gap-1.5 rounded-2xl bg-muted px-4 py-3">
              <span
                className="size-1.5 animate-bounce rounded-full bg-muted-foreground"
                style={{ animationDelay: "0ms" }}
              />
              <span
                className="size-1.5 animate-bounce rounded-full bg-muted-foreground"
                style={{ animationDelay: "150ms" }}
              />
              <span
                className="size-1.5 animate-bounce rounded-full bg-muted-foreground"
                style={{ animationDelay: "300ms" }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
          <AlertTriangle className="size-4 shrink-0" /> {error}
        </div>
      )}

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className="flex gap-3"
      >
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          placeholder={busy ? "Waiting for interviewer..." : "Type your answer..."}
          disabled={busy}
          rows={3}
          className="flex-1 resize-none rounded-2xl border border-border/50 bg-card p-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={busy || !answer.trim()}
          className="self-end rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:shadow-none"
        >
          {busy ? "..." : "Submit"}
        </button>
      </form>
    </div>
  );
}