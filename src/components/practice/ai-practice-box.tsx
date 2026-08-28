"use client";

import { useState } from "react";
import { Sparkles, Play, CheckCircle2, XCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { GeneratedQuestion } from "@/lib/ai/schemas/question";
import { normalizeAnswer } from "@/lib/quiz/validation";

export function AIPracticeBox() {
  const [topic, setTopic] = useState("Docker Containers");
  const [difficulty, setDifficulty] = useState<"beginner" | "intermediate" | "advanced">("intermediate");
  const [questionType, setQuestionType] = useState<"mcq" | "command" | "true_false">("mcq");

  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState<GeneratedQuestion | null>(null);
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setQuestion(null);
    setUserAnswer("");
    setSubmitted(false);

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
        setQuestion(data.questions[0]);
      } else {
        throw new Error("No question returned");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to connect to AI");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckAnswer = () => {
    if (!question) return;

    let correct = false;
    if (question.type === "command") {
      const accepted = question.correctAnswer.split("|").map(normalizeAnswer);
      correct = accepted.includes(normalizeAnswer(userAnswer));
    } else {
      correct =
        userAnswer.trim().toLowerCase() ===
        question.correctAnswer.trim().toLowerCase();
    }

    setIsCorrect(correct);
    setSubmitted(true);
  };

  return (
    <Card className="border-2 border-primary/40 shadow-lg bg-gradient-to-br from-card via-card to-primary/5 overflow-hidden">
      <CardHeader className="p-6 pb-4 border-b border-border/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="size-10 rounded-xl bg-primary/15 flex items-center justify-center text-primary border border-primary/30">
              <Sparkles className="size-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold">
                Dynamic AI Skill Generator
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Generate custom questions powered by Groq AI
              </p>
            </div>
          </div>

          <span className="text-[11px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
            Groq Llama 3.3
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-6 flex flex-col gap-5">
        {/* Controls Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-bold text-muted-foreground block mb-1">
              Topic
            </label>
            <Input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Kubernetes Services"
              className="text-sm font-medium"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-muted-foreground block mb-1">
              Difficulty
            </label>
            <select
              value={difficulty}
              onChange={(e) =>
                setDifficulty(
                  e.target.value as "beginner" | "intermediate" | "advanced",
                )
              }
              className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm font-medium focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-muted-foreground block mb-1">
              Format
            </label>
            <select
              value={questionType}
              onChange={(e) =>
                setQuestionType(
                  e.target.value as "mcq" | "command" | "true_false",
                )
              }
              className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm font-medium focus:outline-none focus:ring-1 focus:ring-ring"
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
          className="w-full font-bold py-5 rounded-xl shadow-md gap-2"
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

        {/* Render Generated Question */}
        {question && (
          <div className="mt-2 p-5 rounded-2xl border-2 border-border bg-card/80 flex flex-col gap-4 shadow-sm animate-in fade-in slide-in-from-bottom-2">
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

            {/* Answer inputs */}
            {question.type === "mcq" && question.options && (
              <div className="grid gap-2">
                {question.options.map((opt) => (
                  <Button
                    key={opt}
                    type="button"
                    variant={userAnswer === opt ? "default" : "outline"}
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
              <div className="flex gap-3">
                {["true", "false"].map((opt) => (
                  <Button
                    key={opt}
                    type="button"
                    variant={userAnswer === opt ? "default" : "outline"}
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
                className="font-mono text-sm"
              />
            )}

            {!submitted ? (
              <Button
                onClick={handleCheckAnswer}
                disabled={!userAnswer.trim()}
                className="self-end font-bold px-6"
              >
                Submit Answer
              </Button>
            ) : (
              <div
                className={`p-4 rounded-xl border flex flex-col gap-2 ${
                  isCorrect
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300"
                    : "bg-destructive/10 border-destructive/30 text-destructive"
                }`}
              >
                <div className="flex items-center gap-2 font-extrabold text-sm">
                  {isCorrect ? (
                    <>
                      <CheckCircle2 className="size-5 text-emerald-500" />
                      Correct! +15 Practice XP
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
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
