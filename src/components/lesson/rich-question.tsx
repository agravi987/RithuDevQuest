"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Check,
  X,
  ArrowRight,
  GripVertical,
  Lightbulb,
  RotateCcw,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type RichQuestionPayload = NonNullable<
  import("@/lib/lesson/types").LessonQuestionData["payload"]
>;

type RichQuestionProps = {
  type: string;
  question: string;
  hint: string | null;
  payload: RichQuestionPayload | undefined;
  /** Submits immediately with the provided answer string. */
  onSubmit: (answer: string) => void;
  submitting: boolean;
};

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]!];
  }
  return copy;
}

function pipeJoin(parts: Array<string | null | undefined>): string {
  return parts
    .filter((part) => part !== null && part !== undefined && part.length > 0)
    .join("|");
}

const LETTERS = ["A", "B", "C", "D", "E", "F"];

export function RichQuestion({
  type,
  question,
  hint,
  payload,
  onSubmit,
  submitting,
}: RichQuestionProps) {
  const [showHint, setShowHint] = useState(false);

  // Fill-blank state
  const blurbs = payload?.fillBlanks ?? [];
  const [fillInputs, setFillInputs] = useState<Record<number, string>>({});
  const [fillResults, setFillResults] = useState<Record<number, boolean | null>>({});
  const [fillCurrent, setFillCurrent] = useState(0);
  const fillDone = blurbs.length > 0 && blurbs.every((_, i) => fillResults[i] != null);

  function checkFillBlank() {
    const input = (fillInputs[fillCurrent] ?? "").trim().toLowerCase();
    const answer = (blurbs[fillCurrent]?.answer ?? "").toLowerCase();
    const isCorrect = input !== "" && input === answer;
    setFillResults((prev) => ({ ...prev, [fillCurrent]: isCorrect }));
    if (fillCurrent < blurbs.length - 1) {
      setTimeout(() => setFillCurrent((prev) => prev + 1), 700);
    } else {
      setTimeout(() => {
        const next: Record<number, boolean | null> = {
          ...fillResults,
          [fillCurrent]: isCorrect,
        };
        onSubmit(
          pipeJoin(blurbs.map((b, i) => (next[i] === true ? b.answer : null))),
        );
      }, 700);
    }
  }

  function submitFillBlankAll() {
    onSubmit(
      pipeJoin(blurbs.map((b, i) => (fillResults[i] === true ? b.answer : null))),
    );
  }

  // Multi-select state
  const multiOpts = payload?.multiSelect ?? [];
  const [multiSelected, setMultiSelected] = useState<Set<number>>(new Set());
  const [multiSubmitted, setMultiSubmitted] = useState(false);

  function toggleMulti(index: number) {
    if (multiSubmitted) return;
    setMultiSelected((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  function checkMulti() {
    if (multiSelected.size === 0) return;
    setMultiSubmitted(true);
    onSubmit([...multiSelected].map((i) => multiOpts[i]?.text ?? "").join("|"));
  }

  // Match state
  const matchPairs = payload?.match ?? [];
  const [matchSelectedLeft, setMatchSelectedLeft] = useState<number | null>(null);
  const [matchMatches, setMatchMatches] = useState<Map<number, number>>(new Map());
  const [matchShuffledRight, setMatchShuffledRight] = useState<number[]>(() =>
    shuffle(matchPairs.map((_, i) => i)),
  );
  const [matchWrong, setMatchWrong] = useState<{ left: number; right: number } | null>(null);

  function clickMatchLeft(left: number) {
    if (matchMatches.has(left)) return;
    setMatchSelectedLeft(left);
  }

  function clickMatchRight(shuffledIndex: number) {
    if (matchSelectedLeft === null) return;
    const rightValue = matchShuffledRight[shuffledIndex];
    if (rightValue === undefined) return;
    if (Array.from(matchMatches.values()).includes(rightValue)) return;

    const leftPair = matchPairs[matchSelectedLeft];
    const rightPair = matchPairs[rightValue];
    if (!leftPair || !rightPair) return;

    if (leftPair.right === rightPair.right) {
      const next = new Map(matchMatches);
      next.set(matchSelectedLeft, rightValue);
      setMatchMatches(next);
      setMatchSelectedLeft(null);
      if (next.size === matchPairs.length) {
        const answer = pipeJoin(
          matchPairs.map((_, i) =>
            next.get(i) !== undefined ? matchPairs[next.get(i)!]?.right : null,
          ),
        );
        setTimeout(() => onSubmit(answer), 450);
      }
    } else {
      setMatchWrong({ left: matchSelectedLeft, right: rightValue });
      setTimeout(() => {
        setMatchWrong(null);
        setMatchSelectedLeft(null);
      }, 600);
    }
  }

  // Sequence state
  const seqItems = payload?.sequenceItems ?? [];
  const seqCorrectOrder = payload?.sequenceCorrectOrder ?? seqItems.map((item) => item.id);
  const [seqOrder, setSeqOrder] = useState<number[]>(() => shuffle(seqItems.map((_, i) => i)));
  const [seqChecked, setSeqChecked] = useState(false);
  const [seqWasCorrect, setSeqWasCorrect] = useState(false);
  const [seqAnswer, setSeqAnswer] = useState("");
  const seqIsCorrect =
    seqOrder.every((itemIndex, position) => seqItems[itemIndex]?.id === seqCorrectOrder[position]);

  function moveSeq(from: number, to: number) {
    if (from === to || seqChecked) return;
    const next = [...seqOrder];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved!);
    setSeqOrder(next);
  }

  function checkSequence() {
    const ordered = pipeJoin(seqOrder.map((i) => seqItems[i]?.id ?? null));
    setSeqAnswer(ordered);
    setSeqWasCorrect(seqIsCorrect);
    setSeqChecked(true);
  }

  function seqSubmit() {
    onSubmit(seqAnswer || pipeJoin(seqOrder.map((i) => seqItems[i]?.id ?? null)));
  }

  function seqRetry() {
    setSeqOrder(shuffle(seqItems.map((_, i) => i)));
    setSeqChecked(false);
    setSeqWasCorrect(false);
  }

  // Code-completion state
  const codeBlanks = payload?.codeBlanks ?? [];
  const [codeInputs, setCodeInputs] = useState<Record<string, string>>({});
  const [codeResults, setCodeResults] = useState<Record<string, boolean | null>>({});
  const [codeCurrent, setCodeCurrent] = useState(0);
  const [codeAnswer, setCodeAnswer] = useState("");
  const codeParts = typeof question === "string" ? question.split(/\{\{(\w+)\}\}/) : [];
  const codeAllDone = codeBlanks.length > 0 && codeBlanks.every((b) => codeResults[b.id] != null);

  function checkCodeBlank() {
    const blank = codeBlanks[codeCurrent];
    if (!blank) return;
    const input = (codeInputs[blank.id] ?? "").trim().toLowerCase();
    const isCorrect = input !== "" && input === blank.answer.toLowerCase();
    const nextResults = { ...codeResults, [blank.id]: isCorrect };
    setCodeResults(nextResults);
    if (codeCurrent < codeBlanks.length - 1) {
      setTimeout(() => setCodeCurrent((prev) => prev + 1), 700);
    } else {
      setTimeout(() => {
        setCodeAnswer(
          pipeJoin(codeBlanks.map((b) => (nextResults[b.id] === true ? b.answer : null))),
        );
      }, 700);
    }
  }

  function codeSubmit() {
    onSubmit(
      codeAnswer ||
        pipeJoin(codeBlanks.map((b) => (codeResults[b.id] === true ? b.answer : null))),
    );
  }

  // Word-scramble state
  const scrambledWord = payload?.scrambledWord ?? "";
  const scrambleLetters = useMemo(() => {
    if (!scrambledWord) return [];
    const lettersArr = scrambledWord.toLowerCase().split("");
    const shuffled = shuffle(lettersArr);
    if (shuffled.join("") === lettersArr.join("") && lettersArr.length > 1) {
      [shuffled[0], shuffled[1]] = [shuffled[1]!, shuffled[0]!];
    }
    return shuffled;
  }, [scrambledWord]);
  const [selectedScramble, setSelectedScramble] = useState<number[]>([]);
  const [scrambleResult, setScrambleResult] = useState<boolean | null>(null);
  const [scrambleAnswer, setScrambleAnswer] = useState("");

  function clickScrambleLetter(index: number) {
    if (scrambleResult !== null) return;
    if (selectedScramble.includes(index)) {
      setSelectedScramble((prev) => prev.filter((i) => i !== index));
      return;
    }
    const next = [...selectedScramble, index];
    setSelectedScramble(next);
    if (next.length === scrambleLetters.length) {
      const guess = next.map((i) => scrambleLetters[i]).join("");
      const correct = guess.toLowerCase() === scrambledWord.toLowerCase();
      setScrambleResult(correct);
      setScrambleAnswer(correct ? scrambledWord.toLowerCase() : guess);
    }
  }

  function scrambleReset() {
    setSelectedScramble([]);
  }

  function scrambleSubmit() {
    onSubmit(scrambleAnswer || scrambledWord);
  }

  // Flip-cards state
  const flipCards = payload?.flipCards ?? [];
  const [flipIndex, setFlipIndex] = useState(0);
  const [flipFlipped, setFlipFlipped] = useState(false);
  const [flipResults, setFlipResults] = useState<(boolean | null)[]>(() =>
    flipCards.map(() => null),
  );
  const [flipFinished, setFlipFinished] = useState(false);
  const [flipAnswer, setFlipAnswer] = useState("");

  function markFlip(markedCorrect: boolean) {
    const next = [...flipResults];
    next[flipIndex] = markedCorrect;
    setFlipResults(next);
    setFlipFlipped(false);
    if (flipIndex < flipCards.length - 1) {
      setTimeout(() => setFlipIndex((prev) => prev + 1), 200);
    } else {
      setTimeout(() => {
        setFlipFinished(true);
        const allCorrect = next.every((r) => r === true);
        setFlipAnswer(
          allCorrect
            ? pipeJoin(flipCards.map((c) => c.back))
            : pipeJoin(flipCards.map((c) => c.front)),
        );
      }, 200);
    }
  }

  function flipSubmit() {
    onSubmit(
      flipAnswer ||
        (flipResults.every((r) => r === true)
          ? pipeJoin(flipCards.map((c) => c.back))
          : pipeJoin(flipCards.map((c) => c.front))),
    );
  }

  const stepLabel = ({ i, total }: { i: number; total: number }) => `${i + 1}/${total}`;

  return (
    <div className="flex flex-col gap-6">
      {/* ---------- FILL BLANK ---------- */}
      {type === "fill_blank" && (
        <div className="flex flex-col gap-5">
          {blurbs.length > 1 && (
            <div className="flex items-center justify-between">
              <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary to-emerald-400 rounded-full"
                  animate={{ width: `${((fillCurrent + 1) / blurbs.length) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <span className="ml-3 text-xs font-bold text-muted-foreground">
                {stepLabel({ i: fillCurrent, total: blurbs.length })}
              </span>
            </div>
          )}

          <div className="rounded-2xl border-2 border-border bg-card p-4 sm:p-6">
            <div className="text-base sm:text-lg leading-relaxed flex flex-wrap items-center gap-1">
              {question.split("___").map((part, i) => (
                <span key={i} className="flex items-center gap-1">
                  <span>{part}</span>
                  {i < blurbs.length &&
                    (fillResults[i] != null ? (
                      <motion.span
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className={cn(
                          "inline-flex items-center gap-1 rounded-lg px-3 py-1 text-base font-bold border-2",
                          fillResults[i] === true
                            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                            : "border-red-500/30 bg-red-500/10 text-red-600",
                        )}
                      >
                        {fillResults[i] === true ? <Check className="size-4" /> : <X className="size-4" />}
                        {blurbs[i]!.answer}
                      </motion.span>
                    ) : i === fillCurrent ? (
                      <span className="inline-flex items-center rounded-lg border-2 border-dashed border-primary/40 bg-primary/5 px-3 py-1">
                        <input
                          type="text"
                          autoFocus
                          value={fillInputs[i] ?? ""}
                          onChange={(e) =>
                            setFillInputs((prev) => ({ ...prev, [i]: e.target.value }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && (fillInputs[i] ?? "").trim()) {
                              checkFillBlank();
                            }
                          }}
                          placeholder="?"
                          className="w-24 bg-transparent text-base font-bold text-center outline-none placeholder:text-primary/30"
                        />
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-lg border-2 border-border bg-muted px-3 py-1 text-base font-bold text-muted-foreground">
                        ___
                      </span>
                    ))}
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            {fillDone ? (
              <Button onClick={submitFillBlankAll} disabled={submitting} className="rounded-xl font-bold">
                Continue
                <ArrowRight className="size-4" />
              </Button>
            ) : (
              <Button
                onClick={checkFillBlank}
                disabled={!(fillInputs[fillCurrent] ?? "").trim() || submitting}
                className="rounded-xl font-bold"
              >
                Check
                <ArrowRight className="size-4" />
              </Button>
            )}
          </div>
        </div>
      )}

      {/* ---------- MULTI-SELECT ---------- */}
      {type === "multi_select" && (
        <div className="flex flex-col gap-3">
          {multiOpts.map((option, index) => {
            const isSelected = multiSelected.has(index);
            const showCorrect = multiSubmitted && option.isCorrect;
            const showWrong = multiSubmitted && isSelected && !option.isCorrect;
            return (
              <button
                key={`opt-${index}`}
                type="button"
                onClick={() => toggleMulti(index)}
                disabled={multiSubmitted}
                className={cn(
                  "group flex items-center gap-2 sm:gap-3 rounded-2xl border-2 px-3 sm:px-4 py-3 sm:py-3.5 text-left transition-all duration-200",
                  showCorrect
                    ? "border-emerald-500/40 bg-emerald-500/10"
                    : showWrong
                      ? "border-red-500/40 bg-red-500/10"
                      : isSelected
                        ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                        : "border-border bg-card hover:border-primary/30 hover:bg-primary/[0.02]",
                )}
              >
                <div
                  className={cn(
                    "grid size-8 sm:size-9 shrink-0 place-items-center rounded-xl text-xs sm:text-sm font-black",
                    showCorrect
                      ? "bg-emerald-500 text-white"
                      : showWrong
                        ? "bg-red-500 text-white"
                        : isSelected
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary",
                  )}
                >
                  <AnimatePresence mode="wait">
                    {isSelected || showCorrect ? (
                      <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                        <Check className="size-4" />
                      </motion.div>
                    ) : (
                      <motion.span key="letter">{LETTERS[index] ?? "?"}</motion.span>
                    )}
                  </AnimatePresence>
                </div>
                <span className="text-sm font-semibold flex-1">{option.text}</span>
                <div
                  className={cn(
                    "size-5 shrink-0 rounded-lg border-2 transition-all",
                    showCorrect
                      ? "border-emerald-500 bg-emerald-500"
                      : showWrong
                        ? "border-red-500 bg-red-500"
                        : isSelected
                          ? "border-primary bg-primary"
                          : "border-border group-hover:border-primary/40",
                  )}
                />
              </button>
            );
          })}
          <div className="flex justify-end">
            {multiSubmitted ? (
              <Button onClick={checkMulti} disabled={submitting} className="rounded-xl font-bold">
                Continue
                <ArrowRight className="size-4" />
              </Button>
            ) : (
              <Button
                onClick={checkMulti}
                disabled={multiSelected.size === 0}
                className="rounded-xl font-bold"
              >
                Check ({multiSelected.size} selected)
                <ArrowRight className="size-4" />
              </Button>
            )}
          </div>
        </div>
      )}

      {/* ---------- MATCH ---------- */}
      {type === "match" && (
        <div className="flex flex-col gap-5">
          {/* Instruction banner */}
          <div className={cn(
            "rounded-xl border px-4 py-2.5 text-center text-sm font-semibold transition-all",
            matchSelectedLeft !== null
              ? "border-primary/30 bg-primary/5 text-primary"
              : "border-border bg-muted/50 text-muted-foreground",
          )}>
            {matchSelectedLeft !== null
              ? `Now tap the matching answer for \"${matchPairs[matchSelectedLeft]?.left}\"`
              : "Tap a term on the left, then tap its match on the right"}
          </div>

          {/* Match grid */}
          <div className="flex flex-col gap-3">
            {matchPairs.map((pair, i) => {
              const isLeftMatched = matchMatches.has(i);
              const isLeftSelected = matchSelectedLeft === i;
              const isLeftWrong = matchWrong?.left === i;
              const matchedRightIndex = matchMatches.get(i);
              const matchedRightValue = matchedRightIndex !== undefined ? matchShuffledRight[matchedRightIndex] : undefined;
              const matchedRightText = matchedRightValue !== undefined ? matchPairs[matchedRightValue]?.right : undefined;

              return (
                <div key={`pair-${i}`} className="flex flex-col gap-2 sm:grid sm:grid-cols-[1fr,auto,1fr] sm:items-center sm:gap-3">
                  {/* Left item */}
                  <motion.button
                    type="button"
                    onClick={() => clickMatchLeft(i)}
                    disabled={isLeftMatched}
                    animate={isLeftWrong ? { x: [-4, 4, -4, 4, 0] } : {}}
                    transition={{ duration: 0.3 }}
                    className={cn(
                      "relative flex items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left text-sm font-semibold transition-all duration-200",
                      isLeftMatched
                        ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                        : isLeftSelected
                          ? "border-primary bg-primary/10 shadow-md shadow-primary/10 ring-2 ring-primary/20 scale-[1.02]"
                          : isLeftWrong
                            ? "border-red-500/50 bg-red-500/10"
                            : "border-border bg-card hover:border-primary/30 hover:shadow-sm",
                    )}
                  >
                    <span className={cn(
                      "grid size-7 shrink-0 place-items-center rounded-lg text-xs font-black",
                      isLeftMatched
                        ? "bg-emerald-500 text-white"
                        : isLeftSelected
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground",
                    )}>
                      {isLeftMatched ? <Check className="size-3.5" /> : LETTERS[i]}
                    </span>
                    <span className="flex-1">{pair.left}</span>
                  </motion.button>

                  {/* Connector: on mobile it's a thin line, on desktop an arrow */}
                  <div className="hidden sm:flex items-center justify-center">
                    <div className={cn(
                      "w-8 h-0.5 rounded-full transition-all duration-300",
                      isLeftMatched ? "bg-emerald-500/50" : "bg-border",
                    )} />
                  </div>
                  <div className={cn(
                    "flex items-center justify-center h-1 rounded-full sm:hidden transition-all duration-300",
                    isLeftMatched ? "bg-emerald-500/30" : "bg-border/50",
                  )} />

                  {/* Right item */}
                  {isLeftMatched && matchedRightText ? (
                    <div className="flex items-center gap-3 rounded-2xl border-2 border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                      <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-emerald-500 text-white text-xs font-black">
                        <Check className="size-3.5" />
                      </span>
                      <span className="flex-1">{matchedRightText}</span>
                    </div>
                  ) : (
                    <motion.button
                      type="button"
                      onClick={() => clickMatchRight(matchShuffledRight.findIndex((_, ri) => {
                        // Find the shuffled index for the right item at position i's row
                        // We need to find which shuffled index corresponds to the unmatched right item we want to highlight
                        return false; // placeholder - will be handled by the grid approach below
                      }))}
                      disabled
                      className="rounded-2xl border-2 border-dashed border-border/50 bg-muted/30 px-4 py-3 text-sm font-semibold text-muted-foreground/40 sm:text-center"
                    >
                      ?
                    </motion.button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right items pool - selectable only when a left item is selected */}
          {matchSelectedLeft !== null && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border-2 border-primary/20 bg-primary/5 p-3"
            >
              <p className="text-[10px] font-bold uppercase tracking-wider text-primary mb-2 text-center">
                Tap the correct match below
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {matchShuffledRight.map((rightValue, shuffledIndex) => {
                  const isRightMatched = Array.from(matchMatches.values()).includes(rightValue);
                  const isRightWrong = matchWrong?.right === rightValue;
                  if (isRightMatched) return null;
                  return (
                    <motion.button
                      key={`mr-${shuffledIndex}`}
                      type="button"
                      onClick={() => clickMatchRight(shuffledIndex)}
                      whileTap={{ scale: 0.95 }}
                      animate={isRightWrong ? { x: [-3, 3, -3, 3, 0] } : {}}
                      transition={{ duration: 0.3 }}
                      className={cn(
                        "rounded-xl border-2 px-4 py-2.5 text-sm font-semibold transition-all duration-200",
                        isRightWrong
                          ? "border-red-500/50 bg-red-500/10 text-red-600"
                          : "border-border bg-card hover:border-primary/40 hover:bg-primary/5 hover:shadow-sm cursor-pointer",
                      )}
                    >
                      {matchPairs[rightValue]?.right}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Progress dots */}
          <div className="flex items-center justify-center gap-2">
            {matchPairs.map((_, i) => (
              <div
                key={`dot-${i}`}
                className={cn(
                  "size-2.5 rounded-full transition-all duration-300",
                  matchMatches.has(i) ? "bg-emerald-500 scale-110" : "bg-border",
                )}
              />
            ))}
            <span className="ml-2 text-xs font-bold text-muted-foreground">
              {matchMatches.size}/{matchPairs.length}
            </span>
          </div>
        </div>
      )}

      {/* ---------- SEQUENCE ---------- */}
      {type === "sequence" && (
        <div className="flex flex-col gap-4">
          <p className="text-xs text-muted-foreground">
            {seqChecked
              ? seqWasCorrect
                ? "Perfect order!"
                : "Not quite — try again"
              : "Use the arrows to put these in the correct order"}
          </p>
          <div className="flex flex-col gap-2">
            <AnimatePresence mode="popLayout">
              {seqOrder.map((itemIndex, position) => {
                const item = seqItems[itemIndex];
                if (!item) return null;
                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={cn(
                      "flex items-center gap-2 sm:gap-3 rounded-2xl border-2 px-3 sm:px-4 py-2.5 sm:py-3 transition-all",
                      seqChecked
                        ? item.id === seqCorrectOrder[position]
                          ? "border-emerald-500/30 bg-emerald-500/10"
                          : "border-red-500/30 bg-red-500/10"
                        : "border-border bg-card hover:border-primary/20",
                    )}
                  >
                    <div
                      className={cn(
                        "grid size-7 sm:size-8 shrink-0 place-items-center rounded-xl text-xs sm:text-sm font-black",
                        seqChecked && item.id === seqCorrectOrder[position]
                          ? "bg-emerald-500 text-white"
                          : "bg-muted text-muted-foreground",
                      )}
                    >
                      {position + 1}
                    </div>
                    <span className="flex-1 text-sm font-semibold">{item.text}</span>
                    {!seqChecked && (
                      <>
                        <div className="flex flex-col gap-0.5">
                          <button
                            onClick={() => moveSeq(position, Math.max(0, position - 1))}
                            disabled={position === 0}
                            className="size-6 rounded-lg bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground hover:bg-primary/10 disabled:opacity-30"
                          >
                            ↑
                          </button>
                          <button
                            onClick={() => moveSeq(position, Math.min(seqOrder.length - 1, position + 1))}
                            disabled={position === seqOrder.length - 1}
                            className="size-6 rounded-lg bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground hover:bg-primary/10 disabled:opacity-30"
                          >
                            ↓
                          </button>
                        </div>
                        <GripVertical className="size-4 text-muted-foreground/40 shrink-0" />
                      </>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
          <div className="flex justify-end gap-3">
            {seqChecked && !seqWasCorrect && (
              <Button variant="secondary" onClick={seqRetry} className="rounded-xl font-bold">
                <RotateCcw className="size-4" />
                Try Again
              </Button>
            )}
            {seqChecked && seqWasCorrect ? (
              <Button onClick={seqSubmit} className="rounded-xl font-bold">
                Continue
                <ArrowRight className="size-4" />
              </Button>
            ) : (
              !seqChecked && (
                <Button onClick={checkSequence} className="rounded-xl font-bold">
                  Check Order
                  <ArrowRight className="size-4" />
                </Button>
              )
            )}
          </div>
        </div>
      )}

      {/* ---------- CODE COMPLETION ---------- */}
      {type === "code_completion" && (
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border-2 border-border overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 border-b border-border">
              <div className="flex gap-1.5">
                <div className="size-2.5 rounded-full bg-red-400" />
                <div className="size-2.5 rounded-full bg-amber-400" />
                <div className="size-2.5 rounded-full bg-emerald-400" />
              </div>
              <span className="text-[10px] font-bold text-muted-foreground ml-2">
                code-snippet.{payload?.codeLanguage || "sh"}
              </span>
            </div>
            <div className="p-3 sm:p-5 bg-muted font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto">
              {Array.isArray(codeParts) &&
                codeParts.map((part, i) => {
                  const blank = codeBlanks.find((b) => b.id === part);
                  if (blank) {
                    const isActive = codeCurrent === codeBlanks.indexOf(blank);
                    const result = codeResults[blank.id];
                    return (
                      <span key={blank.id} className="inline-flex items-center mx-0.5">
                        {result != null ? (
                          <motion.span
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            className={cn(
                              "inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-sm font-bold border",
                              result === true
                                ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-400"
                                : "border-red-500/40 bg-red-500/15 text-red-400",
                            )}
                          >
                            {result === true ? <Check className="size-3" /> : <X className="size-3" />}
                            {blank.answer}
                          </motion.span>
                        ) : isActive ? (
                          <span className="inline-flex items-center rounded-lg border-2 border-dashed border-primary/50 bg-primary/10">
                            <input
                              type="text"
                              value={codeInputs[blank.id] ?? ""}
                              onChange={(e) =>
                                setCodeInputs((prev) => ({ ...prev, [blank.id]: e.target.value }))
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter" && (codeInputs[blank.id] ?? "").trim()) {
                                  checkCodeBlank();
                                }
                              }}
                              placeholder={blank.placeholder ?? "?"}
                              autoFocus
                              className="w-28 bg-transparent text-emerald-400 outline-none placeholder:text-primary/40 px-1"
                            />
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-lg border border-white/10 bg-white/5 px-2 py-0.5 text-sm text-muted-foreground/40">
                            ___
                          </span>
                        )}
                      </span>
                    );
                  }
                  return (
                    <span key={`t-${i}`} className="text-emerald-300/80">
                      {part}
                    </span>
                  );
                })}
            </div>
          </div>
          <p className="text-xs font-bold text-muted-foreground text-right">
            {Object.values(codeResults).filter((r) => r === true).length}/{codeBlanks.length} filled
          </p>
          <div className="flex justify-end">
            {codeAllDone ? (
              <Button onClick={codeSubmit} className="rounded-xl font-bold">
                Continue
                <ArrowRight className="size-4" />
              </Button>
            ) : (
              <Button
                onClick={checkCodeBlank}
                disabled={!(codeInputs[codeBlanks[codeCurrent]?.id ?? ""] ?? "").trim() || submitting}
                className="rounded-xl font-bold"
              >
                Check
                <ArrowRight className="size-4" />
              </Button>
            )}
          </div>
        </div>
      )}

      {/* ---------- WORD SCRAMBLE ---------- */}
      {type === "word_scramble" && (
        <div className="flex flex-col items-center gap-6">
          <p className="text-sm text-muted-foreground text-center">
            Unscramble to reveal the answer:
          </p>
          {scrambleResult !== null && (
            <p className={cn("text-sm font-bold", scrambleResult ? "text-emerald-600" : "text-red-500")}>
              {scrambleResult ? "Correct!" : `Not quite — the answer was ${scrambledWord}`}
            </p>
          )}
          <div className="flex items-center gap-1 min-h-[60px] flex-wrap justify-center px-2">
            {scrambledWord.split("").map((_, i) => {
              const isSelected = i < selectedScramble.length;
              const letter = isSelected ? scrambleLetters[selectedScramble[i]] : null;
              return (
                <motion.div
                  key={i}
                  initial={isSelected ? { scale: 0.8, y: -10 } : {}}
                  animate={{ scale: 1, y: 0 }}
                  className={cn(
                    "grid size-12 place-items-center rounded-xl border-2 text-lg font-black transition-all",
                    isSelected
                      ? scrambleResult === true
                        ? "border-emerald-500 bg-emerald-500/15 text-emerald-600"
                        : scrambleResult === false
                          ? "border-red-500 bg-red-500/15 text-red-600"
                          : "border-primary bg-primary/10 text-primary"
                      : "border-dashed border-border bg-muted/30 text-transparent",
                  )}
                >
                  {letter}
                </motion.div>
              );
            })}
          </div>
          <div className="flex items-center gap-1.5 flex-wrap justify-center px-2">
            {scrambleLetters.map((letter, i) => {
              const isUsed = selectedScramble.includes(i);
              return (
                <motion.button
                  key={`${i}-${letter}`}
                  type="button"
                  onClick={() => clickScrambleLetter(i)}
                  disabled={isUsed || scrambleResult !== null}
                  whileTap={!isUsed ? { scale: 0.9 } : {}}
                  className={cn(
                    "grid size-10 sm:size-12 place-items-center rounded-xl border-2 text-base sm:text-lg font-black transition-all",
                    isUsed
                      ? "border-transparent bg-muted/20 text-transparent opacity-30 scale-90"
                      : "border-border bg-card hover:border-primary/30 hover:bg-primary/5 hover:scale-110 hover:shadow-sm",
                  )}
                >
                  {letter}
                </motion.button>
              );
            })}
          </div>
          <div className="flex justify-center gap-2">
            {scrambleResult === null && selectedScramble.length > 0 && (
              <Button variant="secondary" onClick={scrambleReset} className="rounded-xl font-bold">
                <RotateCcw className="size-4" />
                Reset
              </Button>
            )}
            {scrambleResult !== null && (
              <Button onClick={scrambleSubmit} className="rounded-xl font-bold">
                Continue
                <ArrowRight className="size-4" />
              </Button>
            )}
          </div>
        </div>
      )}

      {/* ---------- FLIP CARDS ---------- */}
      {type === "flip_cards" && flipFinished && (
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="grid place-items-center gap-1 text-center">
            <span className="text-4xl font-black">
              {flipResults.filter((r) => r === true).length}/{flipCards.length}
            </span>
            <span className="text-xs text-muted-foreground">known</span>
          </div>
          <Button onClick={flipSubmit} className="rounded-xl font-bold">
            Continue
            <ArrowRight className="size-4" />
          </Button>
        </div>
      )}
      {type === "flip_cards" && !flipFinished && (
        <div className="flex flex-col items-center gap-6">
          <p className="text-sm text-muted-foreground text-center">
            Flip each card and mark whether you knew the concept.
          </p>
          <div className="perspective-1000 w-full max-w-md cursor-pointer">
            <div
              className={cn("flip-card-inner", flipFlipped && "flipped")}
              onClick={() => setFlipFlipped(!flipFlipped)}
            >
              <div className="flip-card-front w-full">
                <div className="h-full min-h-[180px] rounded-3xl border-2 border-primary/20 bg-gradient-to-br from-card via-card to-primary/5 p-5 sm:p-8 flex flex-col items-center justify-center text-center shadow-lg">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary/60 mb-4">
                    {flipIndex + 1}/{flipCards.length} · Tap to reveal
                  </span>
                  <p className="text-base sm:text-xl font-bold leading-relaxed">
                    {flipCards[flipIndex]?.front}
                  </p>
                </div>
              </div>
              <div className="flip-card-back w-full">
                <div className="h-full min-h-[180px] rounded-3xl border-2 border-emerald-500/30 bg-gradient-to-br from-emerald-500/5 via-card to-primary/5 p-8 flex flex-col items-center justify-center text-center shadow-lg">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500 mb-4">
                    Answer
                  </span>
                  <p className="text-base sm:text-xl font-bold leading-relaxed text-emerald-700 dark:text-emerald-300">
                    {flipCards[flipIndex]?.back}
                  </p>
                </div>
              </div>
            </div>
          </div>
          {flipFlipped && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-4"
            >
              <button
                onClick={() => markFlip(false)}
                className="flex items-center gap-2 rounded-xl border-2 border-red-500/30 bg-red-500/10 px-6 py-3 text-sm font-bold text-red-600 hover:bg-red-500/20 transition-all"
              >
                <X className="size-4" />
                Still Learning
              </button>
              <button
                onClick={() => markFlip(true)}
                className="flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-bold text-white shadow-md shadow-emerald-500/20 transition-all"
              >
                <Check className="size-4" />
                Got It!
              </button>
            </motion.div>
          )}
          {!flipFlipped && (
            <p className="text-xs text-muted-foreground animate-pulse">Tap the card to flip it</p>
          )}
        </div>
      )}

      {/* Shared hint */}
      {hint && (
        <div className="rounded-xl bg-muted/50 border border-border/50">
          {showHint ? (
            <div className="px-4 py-3 flex items-start gap-2">
              <span className="text-sm">💡</span>
              <p className="text-sm text-muted-foreground leading-relaxed">{hint}</p>
            </div>
          ) : (
            <button
              type="button"
              className="w-full px-4 py-3 flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground"
              onClick={() => setShowHint(true)}
            >
              <Lightbulb className="size-4" />
              Show hint
            </button>
          )}
        </div>
      )}
    </div>
  );
}