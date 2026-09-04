"use client";

import { useState, useActionState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Sparkles,
  Play,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { GeneratedQuestion } from "@/lib/ai/schemas/question";
import {
  submitPracticeAnswer,
  type PracticeResult,
} from "@/lib/practice/actions";

export function AIPracticeBox() {
  const [topic, setTopic] = useState("Docker Containers");
  const [difficulty, setDifficulty] = useState<
    "beginner" | "intermediate" | "advanced"
  >("intermediate");
  const [questionType, setQuestionType] = useState<
    "mcq" | "command" | "true_false"
  >("mcq");

  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState<GeneratedQuestion | null>(null);
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [xpResult, setXpResult] = useState<{
    xpEarned: number;
    totalXp: number;
    level: number;
    levelTitle: string;
  } | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setQuestion(null);
    setUserAnswer("");
    setSubmitted(false);
    setXpResult(null);

    try {
      const res = await fetch("/api/ai/generate-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          difficulty,
          questionType,
          count: 1,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to generate question");
      }

      if (data.questions && data.questions.length > 0) {
        const q = data.questions[0];
        // The renderer only supports these types; bail gracefully otherwise.
        if (!["mcq", "command", "true_false"].includes(q.type)) {
          throw new Error("Unsupported question format returned. Please try again.");
        }
        setQuestion(q);
      } else {
        throw new Error("No question returned");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to connect to AI");
    } finally {
      setLoading(false);
    }
  };

  const initialState: PracticeResult = {
    success: false,
    isCorrect: false,
    xpEarned: 0,
    totalXp: 0,
    level: 1,
    levelTitle: "Newcomer",
    progressPercentage: 0,
    xpToNextLevel: 100,
    didLevelUp: false,
    newAchievements: [],
    streak: { currentStreak: 0, longestStreak: 0, status: "reset" },
    error: undefined,
  };

  const [submitState, submitAction, submitPending] = useActionState(
    async (
      _prev: PracticeResult,
      formData: FormData,
    ): Promise<PracticeResult> => {
      if (!question)
        return {
          success: false,
          isCorrect: false,
          xpEarned: 0,
          totalXp: 0,
          level: 1,
          levelTitle: "Newcomer",
          progressPercentage: 0,
          xpToNextLevel: 100,
          didLevelUp: false,
          newAchievements: [],
          streak: { currentStreak: 0, longestStreak: 0, status: "reset" },
          error: "No question",
        };
      return submitPracticeAnswer(
        topic,
        difficulty,
        questionType,
        question.question,
        question.correctAnswer,
        formData.get("userAnswer") as string,
      );
    },
    initialState,
  );

  useEffect(() => {
    if (submitted && submitState.success) {
      // The server is the source of truth for correctness.
      if (submitState.xpEarned > 0 && !xpResult) {
        setXpResult({
          xpEarned: submitState.xpEarned,
          totalXp: submitState.totalXp,
          level: submitState.level,
          levelTitle: submitState.levelTitle,
        });
      }
    }
  }, [submitState, submitted, xpResult]);

  const handleCheckAnswer = () => {
    if (!question) return;

    setSubmitted(true);

    const formData = new FormData();
    formData.append("userAnswer", userAnswer);
    submitAction(formData);
  };

  return (
    <Card className="border border-primary/40 shadow-lg bg-gradient-to-br from-card via-card to-primary/5 overflow-hidden">
      <CardHeader className="p-4 sm:p-6 pb-4 border-b border-border/60">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="size-10 shrink-0 rounded-xl bg-primary/15 flex items-center justify-center text-primary border border-primary/30">
              <Sparkles className="size-5" />
            </div>
            <div className="min-w-0">
              <CardTitle className="text-base sm:text-lg font-bold truncate">
                Dynamic AI Skill Generator
              </CardTitle>
              <p className="text-xs text-muted-foreground truncate">
                Generate custom questions powered by Groq AI
              </p>
            </div>
          </div>

          <span className="hidden sm:inline-block text-[11px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 shrink-0">
            Groq Llama 3.3
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6 flex flex-col gap-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-1">
            <label
              htmlFor="ai-topic"
              className="text-xs font-bold text-muted-foreground block mb-1"
            >
              Topic
            </label>
            <Input
              id="ai-topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Kubernetes Services"
              disabled={question != null}
              className="text-sm font-medium"
            />
            <div className="flex flex-wrap gap-1 mt-2">
              {["Linux Commands", "Docker Containers", "Git Branching", "Kubernetes Pods", "AWS EC2", "React Hooks", "Node.js APIs"].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setTopic(preset)}
                  disabled={question != null}
                  className="text-[11px] font-semibold px-2.5 py-1 rounded-full border border-border/60 bg-background/60 text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-primary/5 transition-all disabled:opacity-50 disabled:pointer-events-none"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label
              htmlFor="ai-difficulty"
              className="text-xs font-bold text-muted-foreground block mb-1"
            >
              Difficulty
            </label>
            <select
              id="ai-difficulty"
              value={difficulty}
              onChange={(e) =>
                setDifficulty(
                  e.target.value as "beginner" | "intermediate" | "advanced",
                )
              }
              disabled={question != null}
              className="w-full h-9 rounded-md border border-border/70 bg-card px-3 py-1 text-sm shadow-sm font-medium cursor-pointer focus:outline-none focus:ring-1 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="ai-format"
              className="text-xs font-bold text-muted-foreground block mb-1"
            >
              Format
            </label>
            <select
              id="ai-format"
              value={questionType}
              onChange={(e) =>
                setQuestionType(
                  e.target.value as "mcq" | "command" | "true_false",
                )
              }
              disabled={question != null}
              className="w-full h-9 rounded-md border border-border/70 bg-card px-3 py-1 text-sm shadow-sm font-medium cursor-pointer focus:outline-none focus:ring-1 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="mcq">Multiple Choice</option>
              <option value="command">Terminal Command</option>
              <option value="true_false">True / False</option>
            </select>
          </div>
        </div>

        <Button
          onClick={handleGenerate}
          disabled={loading || !topic.trim()}
          className="w-full font-bold py-4 sm:py-5 rounded-xl shadow-md shadow-primary/15 hover:shadow-lg hover:shadow-primary/25 gap-2 hover:brightness-110 transition-all duration-200 btn-glow"
        >
          {loading ? (
            <>
              <RefreshCw className="size-4 animate-spin" />
              Generating Challenge with Groq...
            </>
          ) : (
            <>
              <Play className="size-4 fill-current" />
              Generate AI Challenge
            </>
          )}
        </Button>

        {error && (
          <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-xs font-semibold">
            {error}
          </div>
        )}

        {question && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="mt-2 p-5 rounded-2xl border border-border bg-card/80 flex flex-col gap-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-primary">
                {question.difficulty} · {question.type.replace("_", " ")}
              </span>
              {question.hint && (
                <span className="text-xs italic text-muted-foreground">
                  Hint: {question.hint}
                </span>
              )}
            </div>

            <h4 className="text-base font-bold tracking-tight text-foreground leading-snug">
              {question.question}
            </h4>

            {question.type === "mcq" && question.options && (
              <div className="grid gap-2">
                {question.options.map((opt) => (
                  <Button
                    key={opt}
                    type="button"
                    variant={userAnswer === opt ? "default" : "outline"}
                    aria-pressed={userAnswer === opt}
                    disabled={submitted}
                    onClick={() => setUserAnswer(opt)}
                    className="justify-start text-left h-auto py-2.5 px-4 font-medium"
                  >
                    {opt}
                  </Button>
                ))}
              </div>
            )}

            {question.type === "true_false" && (
              <div className="flex flex-col sm:flex-row gap-3">
                {["true", "false"].map((opt) => (
                  <Button
                    key={opt}
                    type="button"
                    variant={userAnswer === opt ? "default" : "outline"}
                    aria-pressed={userAnswer === opt}
                    disabled={submitted}
                    onClick={() => setUserAnswer(opt)}
                    className="flex-1 py-3 font-bold capitalize"
                  >
                    {opt}
                  </Button>
                ))}
              </div>
            )}

            {question.type === "command" && (
              <Input
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                disabled={submitted}
                placeholder="Type command..."
                aria-label="Command answer"
                className="font-mono text-sm input-focus-glow"
              />
            )}

            {!submitted ? (
              <Button
                onClick={handleCheckAnswer}
                disabled={!userAnswer.trim() || submitPending}
                className="self-end font-bold px-6 hover:scale-[1.02] active:scale-[0.98] btn-glow transition-all duration-200"
              >
                {submitPending ? (
                  <>
                    <RefreshCw className="size-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Answer"
                )}
              </Button>
            ) : submitPending ? (
              <div
                role="status"
                aria-live="polite"
                className="p-4 rounded-xl border bg-muted/40 border-border text-muted-foreground flex items-center gap-2 font-bold text-sm"
              >
                <RefreshCw className="size-4 animate-spin" />
                Checking your answer...
              </div>
            ) : submitState.error ? (
              <div
                role="alert"
                aria-live="assertive"
                className="p-4 rounded-xl border bg-destructive/10 border-destructive/30 text-destructive flex flex-col gap-3 font-bold text-sm"
              >
                <div className="flex items-start gap-2">
                  <XCircle className="size-5 shrink-0" />
                  <span>{submitState.error}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="self-end rounded-lg bg-destructive px-4 py-1.5 text-xs font-bold text-destructive-foreground hover:brightness-110 transition-all"
                >
                  Try again
                </button>
              </div>
            ) : (
              <div
                role="status"
                aria-live="polite"
                className={`p-4 rounded-xl border flex flex-col gap-2 ${
                  submitState.isCorrect
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300"
                    : "bg-destructive/10 border-destructive/30 text-destructive"
                }`}
              >
                <div className="flex items-center gap-2 font-extrabold text-sm">
                  {submitState.isCorrect ? (
                    <>
                      <CheckCircle2 className="size-5 text-emerald-500" />
                      Correct!{" "}
                      {xpResult
                        ? `+${xpResult.xpEarned} XP`
                        : "+15 Practice XP"}
                    </>
                  ) : (
                    <>
                      <XCircle className="size-5 text-destructive" />
                      Incorrect. Correct Answer: {question.correctAnswer}
                    </>
                  )}
                </div>
                <p className="text-xs leading-relaxed text-foreground/80">
                  {question.explanation}
                </p>
                {xpResult && (
                  <div className="mt-2 p-3 rounded-lg bg-primary/5 border border-primary/20 flex items-center gap-2">
                    <Award className="size-4 text-primary" />
                    <span className="text-xs font-bold text-primary">
                      Total XP: {xpResult.totalXp} · Level {xpResult.level} (
                      {xpResult.levelTitle})
                    </span>
                  </div>
                )}
              </div>
            )}

            {submitted && !submitPending && (
              <button
                type="button"
                onClick={handleGenerate}
                disabled={loading}
                className="self-end inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary/80 transition-colors disabled:opacity-50"
              >
                <RefreshCw className="size-3.5" />
                Try another question
              </button>
            )}
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
