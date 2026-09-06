"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, RefreshCcw, Sparkles } from "lucide-react";
import type { InterviewFlashcard } from "@/lib/curriculum/interview";

type Props = {
  careerTitle: string;
  cards: InterviewFlashcard[];
};

export function FlashcardDeck({ careerTitle, cards }: Props) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [knownIds, setKnownIds] = useState<Set<string>>(new Set());

  const current = cards[index];
  const progress = ((index + 1) / cards.length) * 100;
  const isFinished = index >= cards.length;

  function flip() {
    setFlipped((prev) => !prev);
  }

  function mark(known: boolean) {
    if (known) {
      setKnownIds((prev) => new Set([...prev, current.id]));
    }
    setFlipped(false);
    setIndex((prev) => prev + 1);
  }

  function restart() {
    setIndex(0);
    setFlipped(false);
    setKnownIds(new Set());
  }

  if (isFinished) {
    const knownCount = knownIds.size;
    const unknownCount = cards.length - knownCount;
    return (
      <div className="mx-auto max-w-md space-y-8 text-center">
        <div className="grid size-20 mx-auto place-items-center rounded-full bg-xp/10">
          <Sparkles className="size-10 text-xp" />
        </div>
        <h2 className="text-2xl font-black tracking-tight">Review Complete!</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
            <p className="text-3xl font-black text-emerald-500">{knownCount}</p>
            <p className="mt-1 text-xs font-bold uppercase tracking-wide text-emerald-500/80">Known</p>
          </div>
          <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-5">
            <p className="text-3xl font-black text-destructive">{unknownCount}</p>
            <p className="mt-1 text-xs font-bold uppercase tracking-wide text-destructive/80">Needs Review</p>
          </div>
        </div>
        <button
          onClick={restart}
          className="inline-flex items-center gap-2 rounded-xl bg-xp/10 px-6 py-2.5 text-sm font-bold text-xp transition-colors hover:bg-xp/20"
        >
          <RefreshCcw className="size-4" />
          Restart Deck
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Card {index + 1} / {cards.length}
          </span>
          <span>{careerTitle}</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-xp to-emerald-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        </div>
      </div>

      {/* Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.25 }}
          className="relative cursor-pointer"
          style={{ perspective: 1200 }}
          onClick={flip}
        >
          <div
            className={`relative h-[400px] w-full transition-transform duration-500 [transform-style:preserve-3d] ${flipped ? "[transform:rotateY(180deg)]" : ""}`}
          >
            {/* Front */}
            <div className="absolute inset-0 flex flex-col rounded-3xl border border-border/50 bg-card p-8 shadow-xl [backface-visibility:hidden]">
              <div className="mb-4 flex items-center gap-2">
                {current.skillName && (
                  <span className="rounded-full bg-xp/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-xp/80">
                    {current.skillName}
                  </span>
                )}
                <span className="rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                  {current.type}
                </span>
              </div>
              <div className="flex-1 overflow-y-auto">
                <p className="text-lg font-bold leading-relaxed text-foreground whitespace-pre-wrap">
                  {current.front}
                </p>
              </div>
              <p className="mt-4 text-center text-xs text-muted-foreground">
                Tap to reveal answer
              </p>
            </div>

            {/* Back */}
            <div className="absolute inset-0 flex flex-col rounded-3xl border border-xp/30 bg-gradient-to-br from-xp/5 to-emerald-500/5 p-8 shadow-xl [backface-visibility:hidden] [transform:rotateY(180deg)]">
              <p className="mb-1 text-xs font-bold uppercase tracking-wide text-xp/60">
                Answer
              </p>
              <div className="flex-1 overflow-y-auto">
                <p className="text-base font-semibold leading-relaxed text-foreground whitespace-pre-wrap">
                  {current.back}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Actions */}
      <div className="flex justify-center gap-4">
        <button
          onClick={() => mark(false)}
          className="flex-1 rounded-xl border border-destructive/30 bg-destructive/10 px-5 py-3 text-sm font-bold text-destructive transition-colors hover:bg-destructive/20"
        >
          Needs Review
        </button>
        <button
          onClick={() => mark(true)}
          className="flex-1 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-3 text-sm font-bold text-emerald-500 transition-colors hover:bg-emerald-500/20"
        >
          <CheckCircle2 className="mr-1 inline size-4 align-text-bottom" />
          Got It
        </button>
      </div>
    </div>
  );
}