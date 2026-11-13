"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { resumeAudio, playCorrectSound, playWrongSound, playHeartLossSound, playComboFlameSound } from "@/lib/sounds";
import {
  createQuizQueue,
  processQueueAnswer,
  calculateSessionAccuracy,
  type QueueEvaluationResult,
} from "@/lib/quiz/queue";
import type {
  CharacterId,
  CharacterMood,
  DuolingoQuestion,
  DuolingoQueueItem,
  QuizExperienceProps,
  QuizQuestion,
  QuizResult,
} from "./types";
import { DuolingoHeader } from "./DuolingoHeader";
import { CharacterSpeechBubble } from "./characters/CharacterSpeechBubble";
import { DuolingoMCQ } from "./questions/DuolingoMCQ";
import { DuolingoWordBank } from "./questions/DuolingoWordBank";
import { DuolingoMatchPairs } from "./questions/DuolingoMatchPairs";
import { DuolingoTrueFalse } from "./questions/DuolingoTrueFalse";
import { DuolingoFillBlank } from "./questions/DuolingoFillBlank";
import { DuolingoBottomDrawer, type BottomDrawerState } from "./DuolingoBottomDrawer";
import { DuolingoExitModal } from "./modals/DuolingoExitModal";
import { DuolingoOutOfHeartsModal } from "./modals/DuolingoOutOfHeartsModal";
import { DuolingoResults } from "./DuolingoResults";
import type { DuolingoMistakeItem } from "./modals/DuolingoMistakesModal";

/* ─── Question Conversion Adapter ─── */

import { cleanForComparison } from "@/lib/quiz/validation";

const CREW_ROTATION: CharacterId[] = ["rithu", "astra", "orion", "nova", "vance", "cosmo"];

function adaptToDuolingoQuestion(q: QuizQuestion, index: number): DuolingoQuestion {
  const characterId = (CREW_ROTATION[index % CREW_ROTATION.length] ?? "rithu") as CharacterId;

  // 1. True / False
  if (
    q.type === "true_false" ||
    (Array.isArray(q.options) &&
      q.options.length === 2 &&
      q.options.some((o) => cleanForComparison(typeof o === "string" ? o : (o as { text?: string }).text ?? "") === "true") &&
      q.options.some((o) => cleanForComparison(typeof o === "string" ? o : (o as { text?: string }).text ?? "") === "false"))
  ) {
    const cleanCorrect = cleanForComparison(q.correctAnswer ?? "");
    const isTrue = cleanCorrect === "true" || cleanCorrect === "1" || cleanCorrect === "yes" || cleanCorrect === "t";
    return {
      id: q.id,
      type: "true_false",
      prompt: "Cadet, evaluate this statement. Is it True or False?",
      characterId,
      hint: q.hint ?? undefined,
      difficulty: q.difficulty ?? "beginner",
      payload: {
        statement: q.question,
        correctAnswer: isTrue,
        explanation: (q.payload as { explanation?: string })?.explanation ?? "Review the fundamentals of this concept.",
      },
    };
  }

  // 2. Word Bank / Scramble / Sequence
  const scrambleTokens = (q.payload as { scrambleTokens?: string[] })?.scrambleTokens;
  const sequenceItems =
    (q.payload as { sequenceItems?: Array<{ id?: string; text?: string }> })?.sequenceItems ||
    (q.type === "sequence" && Array.isArray(q.options) ? (q.options as Array<{ id?: string; text?: string }>) : null);

  if (q.type === "word_scramble" || (q.type as string) === "code_scramble" || scrambleTokens || (q.type === "sequence" && sequenceItems)) {
    const isWordScramble = q.type === "word_scramble" || (q.type as string) === "code_scramble";
    const cleanWord = (q.correctAnswer ?? "").trim().toLowerCase();

    // Word scrambles split into individual character tokens
    const rawTokens: string[] = sequenceItems
      ? sequenceItems.map((item) => (typeof item === "string" ? item : item.text || item.id || ""))
      : (isWordScramble && cleanWord && !cleanWord.includes(" "))
        ? cleanWord.split("")
        : (scrambleTokens ?? (q.correctAnswer ? q.correctAnswer.split(" ") : []));

    // For sequence questions the correct order is stored as item IDs in
    // `sequenceCorrectOrder` — map them back to display texts. When the
    // stored order differs from the natural item order, reassign token IDs
    // so the client's id-based targetSentence matches what the user builds.
    const sequenceOrderIds = (q.payload as { sequenceCorrectOrder?: string[] })?.sequenceCorrectOrder;
    const correctTexts: string[] =
      q.type === "sequence" && sequenceItems && Array.isArray(sequenceOrderIds)
        ? sequenceOrderIds
            .map((id) => {
              const found = sequenceItems.find(
                (item) => (typeof item === "object" && item !== null ? item.id : item) === id,
              );
              return typeof found === "object" && found !== null
                ? found.text || found.id || ""
                : String(found ?? "");
            })
            .filter(Boolean)
        : rawTokens;

    const canonicalTexts = correctTexts.length > 0 ? correctTexts : rawTokens;
    const tokens = canonicalTexts.map((t: string, i: number) => ({
      id: `tok-${i}`,
      text: t,
    }));

    // Decoy tokens
    const tokenTextSet = new Set(canonicalTexts.map(cleanForComparison));
    const decoyPool = isWordScramble
      ? ["a", "e", "i", "o", "u", "s", "r", "t", "l", "n"]
      : ["--help", "verbose", "rollback", "undefined", "force"];
    const decoy = decoyPool.find(
      (candidate) => !tokenTextSet.has(cleanForComparison(candidate)),
    );
    const distractors = decoy ? [{ id: "dist-1", text: decoy }] : [];

    return {
      id: q.id,
      type: "word_bank",
      prompt: q.question || (isWordScramble ? "Unscramble the word to solve the challenge:" : "Assemble the command or sequence in the correct order:"),
      characterId,
      hint: q.hint ?? undefined,
      difficulty: q.difficulty ?? "intermediate",
      payload: {
        targetSentence: canonicalTexts.join(" "),
        tokens,
        distractors,
        explanation:
          q.explanation ??
          (isWordScramble
            ? `The correct word is "${canonicalTexts.join("")}".`
            : `The correct order is: ${canonicalTexts.join(" → ")}.`),
      },
    };
  }

  // 3. Match Pairs
  const matchPairs =
    (q.payload as { matchPairs?: Array<{ left: string; right: string }> })?.matchPairs ||
    (q.type === "match" && Array.isArray(q.options) ? (q.options as Array<{ left: string; right: string }>) : null);

  if (q.type === "match" || (q.type as string) === "match_pair" || matchPairs) {
    const pairs = (matchPairs ?? []).map((p, i) => ({
      id: `pair-${i}`,
      left: p.left,
      right: p.right,
    }));
    return {
      id: q.id,
      type: "match_pairs",
      prompt: q.question || "Match each item to its corresponding definition:",
      characterId,
      hint: q.hint ?? undefined,
      difficulty: q.difficulty ?? "intermediate",
      payload: {
        pairs,
        explanation: "Connect the matching concepts.",
      },
    };
  }

  // 4. Fill in the Blank / Code Completion
  const fillBlanks =
    (q.payload as { fillBlanks?: Array<{ answer: string; options?: string[] }> })?.fillBlanks ||
    (q.type === "fill_blank" && Array.isArray(q.options) ? (q.options as Array<{ answer: string; options?: string[] }>) : null);

  const codeBlanks =
    (q.payload as { codeBlanks?: Array<{ answer: string; options?: string[] }> })?.codeBlanks ||
    (q.type === "code_completion" && Array.isArray(q.options) ? (q.options as Array<{ answer: string; options?: string[] }>) : null);

  if (q.type === "fill_blank" || q.type === "code_completion" || fillBlanks || codeBlanks) {
    const blanks = fillBlanks || codeBlanks;
    const firstBlank = blanks?.[0];
    const answer =
      typeof firstBlank === "object" && firstBlank !== null
        ? firstBlank?.answer || q.correctAnswer || ""
        : String(firstBlank || q.correctAnswer || "");

    const promptWithBlank = q.question.includes("___")
      ? q.question
      : q.question.includes("{{")
        ? q.question.replace(/\{\{[^}]+\}\}/g, "___")
        : `${q.question} ______`;

    const rawOptions =
      firstBlank?.options ??
      (Array.isArray(q.options) &&
      (q.options as Array<{ options?: string[] }>)[0]?.options
        ? (q.options as Array<{ options?: string[] }>)[0].options!
        : null) ??
      (() => {
        const correct = (answer.split("|")[0] ?? answer).trim();
        const candidates = ["Nginx", "Kubernetes", "Docker", "Terraform", "S3", "kubectl", "80", "443"];
        const picked: string[] = [];
        for (const candidate of candidates) {
          if (picked.length >= 3) break;
          if (
            cleanForComparison(candidate) !== cleanForComparison(correct) &&
            !picked.some((p) => cleanForComparison(p) === cleanForComparison(candidate))
          ) {
            picked.push(candidate);
          }
        }
        const full = [correct, ...picked];
        // Stable pseudo-random sort based on question id
        const seed = q.id.charCodeAt(q.id.length - 1) || 1;
        return full.sort((a, b) => ((a.charCodeAt(0) * seed) % 5) - ((b.charCodeAt(0) * seed) % 5));
      })();

    return {
      id: q.id,
      type: "fill_blank",
      prompt: q.question || "Fill in the missing parameter:",
      characterId,
      hint: q.hint ?? undefined,
      difficulty: q.difficulty ?? "beginner",
      payload: {
        promptWithBlank,
        blankIndex: 0,
        options: rawOptions,
        correctAnswer: answer,
        explanation: q.explanation ?? `The correct answer is "${answer.split("|")[0] ?? answer}".`,
      },
    };
  }

  // 5. Scenario: multi-part typed terminal questions adapted into command sequence Word Bank
  if (q.type === "scenario") {
    const rawParts =
      Array.isArray(q.parts) && q.parts.length > 0
        ? (q.parts as Array<{ prompt?: string; correctAnswer?: string }>)
        : ((q.payload as { scenarioParts?: Array<{ prompt?: string; correctAnswer?: string }> })?.scenarioParts ?? []);

    const partAnswers = rawParts
      .map((p) => (p.correctAnswer ?? "").split("|")[0].trim())
      .filter(Boolean);

    if (partAnswers.length > 0) {
      const tokens = partAnswers.map((cmd, i) => ({
        id: `scen-tok-${i}`,
        text: cmd,
      }));

      const candidateDistractors = [
        "cd ~",
        "echo $USER",
        "hostname",
        "ls -la",
        "cat /etc/os-release",
        "whoami",
        "pwd",
        "df -h",
        "grep error",
      ];
      const answerSet = new Set(partAnswers.map(cleanForComparison));
      const distractors = candidateDistractors
        .filter((d) => !answerSet.has(cleanForComparison(d)))
        .slice(0, 2)
        .map((d, i) => ({ id: `scen-dist-${i}`, text: d }));

      const workedSteps = rawParts
        .map((p, i) => `${i + 1}. ${p.prompt ?? ""} → \`${p.correctAnswer?.split("|")[0] ?? ""}\``)
        .join("\n");

      return {
        id: q.id,
        type: "word_bank",
        prompt: q.question,
        characterId,
        hint: q.hint ?? "Assemble each required command in order.",
        difficulty: q.difficulty ?? "intermediate",
        payload: {
          targetSentence: partAnswers.join(" "),
          tokens,
          distractors,
          explanation:
            q.explanation ??
            `Scenario solution steps:\n${workedSteps}`,
        },
      };
    }
  }

  // 6. Default: Multiple Choice (MCQ) & Multi-Select & Flip Cards
  const rawOptions =
    (q.payload as { mcqOptions?: Array<unknown> })?.mcqOptions ??
    (q.payload as { multiSelect?: Array<unknown> })?.multiSelect ??
    (q.payload as { flipCards?: Array<unknown> })?.flipCards ??
    (Array.isArray(q.options) ? q.options : []);

  const mcqOptions = rawOptions.map((opt: unknown, i: number) => {
    const text =
      typeof opt === "string"
        ? opt
        : (opt as { text?: string; answer?: string; front?: string; back?: string })?.text ??
          (opt as { text?: string; answer?: string; front?: string; back?: string })?.answer ??
          (opt as { text?: string; answer?: string; front?: string; back?: string })?.front ??
          (opt as { text?: string; answer?: string; front?: string; back?: string })?.back ??
          String(opt);

    const isCode = text.includes(" ") || text.startsWith("-") || text.includes("/") || text.includes("$");
    const isExplicitCorrect =
      typeof opt === "object" && opt !== null ? (opt as { isCorrect?: boolean }).isCorrect : undefined;

    return {
      id: `opt-${i}`,
      text,
      code: isCode,
      isCorrect: isExplicitCorrect,
    };
  });

  // Identify correct option id
  let correctId = "opt-0";
  let matched = false;

  // 1) Explicit isCorrect property on option object
  const explicitCorrectIdx = mcqOptions.findIndex((opt) => opt.isCorrect === true);
  if (explicitCorrectIdx !== -1) {
    correctId = `opt-${explicitCorrectIdx}`;
    matched = true;
  }

  // 2) Match against q.correctAnswer (clean text & pipe alternatives)
  if (!matched && q.correctAnswer) {
    const acceptedAnswers = q.correctAnswer
      .split("|")
      .map(cleanForComparison)
      .filter(Boolean);

    const matchIdx = mcqOptions.findIndex((o) =>
      acceptedAnswers.includes(cleanForComparison(o.text))
    );
    if (matchIdx !== -1) {
      correctId = `opt-${matchIdx}`;
      matched = true;
    }
  }

  // 3) Match if correctAnswer is an option ID or numeric/letter index
  if (!matched && q.correctAnswer) {
    const rawTrim = q.correctAnswer.trim();
    if (rawTrim.startsWith("opt-")) {
      const idx = parseInt(rawTrim.replace("opt-", ""), 10);
      if (!isNaN(idx) && idx >= 0 && idx < mcqOptions.length) {
        correctId = `opt-${idx}`;
        matched = true;
      }
    } else {
      const parsedNum = parseInt(rawTrim, 10);
      if (!isNaN(parsedNum) && parsedNum >= 0 && parsedNum < mcqOptions.length) {
        correctId = `opt-${parsedNum}`;
        matched = true;
      } else if (rawTrim.length === 1 && "ABCD".includes(rawTrim.toUpperCase())) {
        const letterIdx = "ABCD".indexOf(rawTrim.toUpperCase());
        if (letterIdx !== -1 && letterIdx < mcqOptions.length) {
          correctId = `opt-${letterIdx}`;
          matched = true;
        }
      }
    }
  }

  // 4) Substring match fallback
  if (!matched && q.correctAnswer) {
    const cleanedTarget = cleanForComparison(q.correctAnswer);
    const subIdx = mcqOptions.findIndex((o) => {
      const c = cleanForComparison(o.text);
      return c.includes(cleanedTarget) || cleanedTarget.includes(c);
    });
    if (subIdx !== -1) {
      correctId = `opt-${subIdx}`;
      matched = true;
    }
  }

  return {
    id: q.id,
    type: "mcq",
    prompt: q.question,
    characterId,
    hint: q.hint ?? undefined,
    difficulty: q.difficulty ?? "beginner",
    payload: {
      options: mcqOptions,
      correctOptionId: correctId,
      explanation: (q.payload as { explanation?: string })?.explanation ?? "Select the most accurate option.",
    },
  };
}

/* ════════════════════════════════════════════════════════════════════
   MAIN DUOLINGO GALAXY QUIZ ORCHESTRATOR
   ════════════════════════════════════════════════════════════════════ */

export function QuizExperience({
  mode,
  questions: rawQuestions = [],
  onComplete,
  onExit,
  onContinueResults,
  onSubmitAnswer,
  externalCompletion,
  sessionId,
  userXp = 0,
  userStreak = 0,
  hearts: initialHearts,
}: QuizExperienceProps) {
  // Convert questions to Duolingo schema
  const duolingoQuestions = React.useMemo(() => {
    return rawQuestions.map((q, idx) => adaptToDuolingoQuestion(q, idx));
  }, [rawQuestions]);

  const initialTotalQuestions = React.useRef(duolingoQuestions.length || 1);

  // FSM State
  const [queue, setQueue] = React.useState<DuolingoQueueItem[]>(() =>
    createQuizQueue(duolingoQuestions)
  );
  const [drawerState, setDrawerState] = React.useState<BottomDrawerState>("neutral");
  const [stagedAnswer, setStagedAnswer] = React.useState<string | null>(null);
  const [hearts, setHearts] = React.useState(initialHearts?.current ?? 5);
  const streak = userStreak;
  const [combo, setCombo] = React.useState(0);
  const [maxCombo, setMaxCombo] = React.useState(0);

  const [totalXpEarned, setTotalXpEarned] = React.useState(0);
  const [isEvaluating, setIsEvaluating] = React.useState(false);
  const [isMuted, setIsMuted] = React.useState(false);

  // Modals & Screen states
  const [isExitModalOpen, setIsExitModalOpen] = React.useState(false);
  const [isOutOfHeartsOpen, setIsOutOfHeartsOpen] = React.useState(false);
  const [isResultsOpen, setIsResultsOpen] = React.useState(false);

  // History & Mistakes tracking
  const [mistakesHistory, setMistakesHistory] = React.useState<DuolingoMistakeItem[]>([]);
  const [sessionAnswerHistory, setSessionAnswerHistory] = React.useState<
    Array<{ firstTryCorrect: boolean | null }>
  >([]);

  // Time tracking
  const sessionStartTime = React.useRef(Date.now());
  const activeQuestion = queue[0]?.question;

  // Unlock AudioContext on first user interaction
  React.useEffect(() => {
    const handleFirstPointer = () => {
      resumeAudio();
      window.removeEventListener("pointerdown", handleFirstPointer);
    };
    window.addEventListener("pointerdown", handleFirstPointer);
    return () => window.removeEventListener("pointerdown", handleFirstPointer);
  }, []);

  // Update queue when duolingoQuestions load asynchronously
  React.useEffect(() => {
    if (duolingoQuestions.length > 0 && queue.length === 0) {
      initialTotalQuestions.current = duolingoQuestions.length;
      setQueue(createQuizQueue(duolingoQuestions));
    }
  }, [duolingoQuestions, queue.length]);

  // Escape key opens Exit Modal
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isResultsOpen) {
        setIsExitModalOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isResultsOpen]);

  // Calculate dynamic progress percentage based on remaining items
  const progressPercentage = React.useMemo(() => {
    const total = initialTotalQuestions.current || 1;
    const completed = Math.max(0, total - queue.length);
    return Math.min(100, Math.round((completed / total) * 100));
  }, [queue.length]);

  // Current Character & Mood
  const currentCharacterId = activeQuestion?.characterId ?? "rithu";
  const currentMood: CharacterMood =
    drawerState === "correct"
      ? "happy_jump"
      : drawerState === "incorrect"
        ? "sad_droop"
        : isEvaluating
          ? "thinking"
          : "speaking";

  // Check if current question has a staged answer ready to check
  const canCheck = React.useMemo(() => {
    if (!activeQuestion || stagedAnswer === null) return false;
    return stagedAnswer.trim().length > 0;
  }, [activeQuestion, stagedAnswer]);

  /* ─── Handlers ─── */

  const handleCheckAnswer = async () => {
    if (!activeQuestion || !canCheck || isEvaluating) return;
    setIsEvaluating(true);

    try {
      let isCorrect = false;
      let explanation = "";
      let correctAnswerStr = "";
      let answerToSendToServer = stagedAnswer ?? "";

      // 1. Grade based on question type
      if (activeQuestion.type === "mcq") {
        const payload = activeQuestion.payload as import("./types").DuolingoMCQPayload;
        const selectedOpt = payload.options.find((o) => o.id === stagedAnswer);
        const correctOpt = payload.options.find((o) => o.id === payload.correctOptionId);
        correctAnswerStr = correctOpt?.text ?? "";
        explanation = payload.explanation;

        // Check against raw accepted answers or option text
        const originalQ = rawQuestions.find((q) => q.id === activeQuestion.id);
        const rawAnswers = (originalQ?.correctAnswer ?? correctAnswerStr)
          .split("|")
          .map(cleanForComparison)
          .filter(Boolean);

        const selectedClean = selectedOpt ? cleanForComparison(selectedOpt.text) : "";
        const isExplicitCorrect =
          (selectedOpt as unknown as { isCorrect?: boolean })?.isCorrect === true;

        isCorrect =
          stagedAnswer === payload.correctOptionId ||
          isExplicitCorrect ||
          (selectedClean.length > 0 && rawAnswers.includes(selectedClean));

        // When submitting to server, ALWAYS send the selected option's text (e.g. "Bash")
        answerToSendToServer = selectedOpt ? selectedOpt.text : (stagedAnswer ?? "");
      } else if (activeQuestion.type === "true_false") {
        const payload = activeQuestion.payload as import("./types").DuolingoTrueFalsePayload;
        const stagedBool = stagedAnswer === "true";
        isCorrect = stagedBool === payload.correctAnswer;
        correctAnswerStr = payload.correctAnswer ? "True" : "False";
        explanation = payload.explanation;
        answerToSendToServer = stagedBool ? "true" : "false";
      } else if (activeQuestion.type === "word_bank") {
        const payload = activeQuestion.payload as import("./types").DuolingoWordBankPayload;
        const normStaged = cleanForComparison(stagedAnswer ?? "");
        const normTarget = cleanForComparison(payload.targetSentence);
        const splitTargets = payload.targetSentence
          .split("|")
          .map(cleanForComparison)
          .filter(Boolean);

        // Local grading: staged answer is the space-joined token texts in the
        // order the user placed them — compare against the ordered target.
        const localCorrect =
          normStaged === normTarget ||
          splitTargets.includes(normStaged);
        correctAnswerStr = payload.targetSentence;
        explanation = payload.explanation;
        answerToSendToServer = localCorrect ? "all_matched" : (stagedAnswer ?? "");

        // For sequence questions the server holds the authoritative order
        // (item IDs). Submit the assembled answer; when the server confirms
        // it correct, defer to the server (prevents false negatives from any
        // token-text normalization drift).
        const originalWordBankQ = rawQuestions.find((q) => q.id === activeQuestion.id);
        if (localCorrect) {
          isCorrect = true;
        } else if (onSubmitAnswer && originalWordBankQ?.type === "sequence") {
          isCorrect = false; // provisional — server confirmation below may flip it
        }
      } else if (activeQuestion.type === "fill_blank") {
        const payload = activeQuestion.payload as import("./types").DuolingoFillBlankPayload;
        const acceptedFill = payload.correctAnswer
          .split("|")
          .map(cleanForComparison)
          .filter(Boolean);
        isCorrect = acceptedFill.includes(cleanForComparison(stagedAnswer ?? ""));
        correctAnswerStr = payload.correctAnswer.split("|")[0] ?? payload.correctAnswer;
        explanation = payload.explanation;
        answerToSendToServer = stagedAnswer ?? "";
      } else if (activeQuestion.type === "match_pairs") {
        isCorrect = stagedAnswer === "all_matched" || stagedAnswer === "matched";
        answerToSendToServer = "all_matched";
      }

      // If parent provided an async grading hook, sync with it
      if (onSubmitAnswer) {
        const originalQ = rawQuestions.find((q) => q.id === activeQuestion.id);
        if (originalQ) {
          const res = await onSubmitAnswer(originalQ, answerToSendToServer);
          // If either client or server confirmed it is correct, award as correct!
          isCorrect = isCorrect || res.isCorrect;
          if (res.explanation) explanation = res.explanation;
          if (res.correctAnswer) correctAnswerStr = res.correctAnswer;
        }
      }

      // Process answer in Queue
      const queueResult: QueueEvaluationResult = processQueueAnswer(
        queue,
        isCorrect,
        stagedAnswer ?? undefined
      );

      // Audio & Vibration Feedback
      if (isCorrect) {
        if (!isMuted) playCorrectSound();
        if (typeof navigator !== "undefined" && "vibrate" in navigator) {
          navigator.vibrate([30, 40]);
        }

        const nextCombo = combo + 1;
        setCombo(nextCombo);
        setMaxCombo((m) => Math.max(m, nextCombo));
        if (nextCombo === 3 || nextCombo === 5 || nextCombo === 10) {
          if (!isMuted) playComboFlameSound();
        }

        setTotalXpEarned((prev) => prev + queueResult.xpEarned);
        setDrawerState("correct");
      } else {
        if (!isMuted) playWrongSound();
        if (typeof navigator !== "undefined" && "vibrate" in navigator) {
          navigator.vibrate(60);
        }

        setCombo(0);
        const nextHearts = Math.max(0, hearts - 1);
        setHearts(nextHearts);
        if (!isMuted) playHeartLossSound();

        // Record mistake for review modal
        setMistakesHistory((prev) => [
          ...prev,
          {
            question: activeQuestion.prompt,
            userAnswer: stagedAnswer ?? undefined,
            correctAnswer: correctAnswerStr,
            explanation,
          },
        ]);

        if (nextHearts === 0) {
          setIsOutOfHeartsOpen(true);
        }

        setDrawerState("incorrect");
      }

      // Track first-try history for session accuracy
      setSessionAnswerHistory((prev) => [
        ...prev,
        { firstTryCorrect: queueResult.evaluatedItem.firstTryCorrect },
      ]);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleContinueAfterFeedback = () => {
    // If we just got correct, pop head and check if session finished
    const isCorrect = drawerState === "correct";
    const queueResult = processQueueAnswer(queue, isCorrect, stagedAnswer ?? undefined);

    setQueue(queueResult.nextQueue);
    setStagedAnswer(null);
    setDrawerState("neutral");

    if (queueResult.isSessionComplete) {
      finalizeSession();
    }
  };

  const finalizeSession = () => {
    const accuracy = calculateSessionAccuracy(sessionAnswerHistory);
    const timeSpentMs = Date.now() - sessionStartTime.current;

    const result: QuizResult = {
      sessionId: sessionId ?? "local",
      mode,
      topic: "Duolingo Galaxy",
      totalQuestions: initialTotalQuestions.current,
      correctCount: sessionAnswerHistory.filter((h) => h.firstTryCorrect).length,
      accuracy,
      totalXpEarned,
      maxCombo,
      timeSpentMs,
      completedAt: new Date(),
      didLevelUp: false,
    };


    onComplete?.(result);

    if (!externalCompletion) {
      setIsResultsOpen(true);
    }
  };

  const handleQuitConfirm = () => {
    setIsExitModalOpen(false);
    onExit?.();
  };

  const handleRefillHearts = () => {
    setHearts(5);
    setIsOutOfHeartsOpen(false);
  };

  /* ─── Render Results Screen ─── */
  if (isResultsOpen) {
    return (
      <div className="fixed inset-0 z-50 bg-[#070913] overflow-y-auto">
        <DuolingoResults
          xpEarned={totalXpEarned}
          accuracy={calculateSessionAccuracy(sessionAnswerHistory)}
          maxCombo={maxCombo}
          timeSpentMs={Date.now() - sessionStartTime.current}
          streak={streak}
          mistakes={mistakesHistory}
          onContinue={() => {
            if (onContinueResults) {
              onContinueResults();
            } else {
              onExit?.();
            }
          }}
        />
      </div>
    );
  }

  /* ─── Render Main Arena ─── */
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 h-[100dvh] max-h-[100dvh] w-full overflow-hidden select-none bg-[#070913]",
        "flex flex-col items-center justify-between",
      )}
    >
      {/* ── 1. FIXED TOP HEADER HUD ── */}
      <DuolingoHeader
        progressPercentage={progressPercentage}
        hearts={hearts}
        streak={streak}
        combo={combo}
        isMuted={isMuted}
        onToggleMute={() => setIsMuted(!isMuted)}
        onQuit={() => setIsExitModalOpen(true)}
      />

      {/* ── 2. CENTER "DUOLINGO ZEN" QUESTION ARENA ── */}
      <section
        aria-label="Quiz Challenge"
        className="w-full max-w-2xl mx-auto flex-1 flex flex-col justify-center px-4 sm:px-6 py-2 sm:py-3.5 overflow-y-auto min-h-0"
      >
        <AnimatePresence mode="wait">
          {activeQuestion ? (
            <motion.div
              key={activeQuestion.id}
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -40, opacity: 0 }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
              className="flex flex-col gap-3 sm:gap-4 w-full my-auto"
            >
              {/* Character + Speech Bubble */}
              <CharacterSpeechBubble
                characterId={currentCharacterId}
                mood={currentMood}
                message={activeQuestion.prompt}
                disableVoice={isMuted}
              />

              {/* The Active Duolingo Question Mechanic */}
              <div className="w-full">
                {activeQuestion.type === "mcq" && (
                  <DuolingoMCQ
                    key={activeQuestion.id}
                    payload={activeQuestion.payload as import("./types").DuolingoMCQPayload}
                    selectedOptionId={stagedAnswer}
                    onSelectOption={(id) => setStagedAnswer(id)}
                    disabled={drawerState !== "neutral"}
                  />
                )}

                {activeQuestion.type === "word_bank" && (
                  <DuolingoWordBank
                    key={activeQuestion.id}
                    payload={activeQuestion.payload as import("./types").DuolingoWordBankPayload}
                    value={stagedAnswer ?? ""}
                    onChange={(val) => setStagedAnswer(val)}
                    disabled={drawerState !== "neutral"}
                  />
                )}

                {activeQuestion.type === "match_pairs" && (
                  <DuolingoMatchPairs
                    key={activeQuestion.id}
                    payload={activeQuestion.payload as import("./types").DuolingoMatchPairsPayload}
                    onMatchComplete={() => {
                      setStagedAnswer("all_matched");
                    }}
                    disabled={drawerState !== "neutral"}
                  />
                )}

                {activeQuestion.type === "true_false" && (
                  <DuolingoTrueFalse
                    key={activeQuestion.id}
                    payload={activeQuestion.payload as import("./types").DuolingoTrueFalsePayload}
                    selectedValue={stagedAnswer === null ? null : stagedAnswer === "true"}
                    onSelect={(val) => setStagedAnswer(val ? "true" : "false")}
                    disabled={drawerState !== "neutral"}
                  />
                )}

                {activeQuestion.type === "fill_blank" && (
                  <DuolingoFillBlank
                    key={activeQuestion.id}
                    payload={activeQuestion.payload as import("./types").DuolingoFillBlankPayload}
                    selectedOption={stagedAnswer}
                    onSelect={(opt) => setStagedAnswer(opt)}
                    disabled={drawerState !== "neutral"}
                  />
                )}
              </div>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-white/50">
              <div className="size-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent mb-3" />
              <p className="text-sm font-medium">Entering orbit...</p>
            </div>
          )}
        </AnimatePresence>
      </section>

      {/* ── 3. SLIDING BOTTOM ACTION SHEET DRAWER ── */}
      <DuolingoBottomDrawer
        state={drawerState}
        canCheck={canCheck}
        onCheck={handleCheckAnswer}
        onContinue={handleContinueAfterFeedback}
        correctAnswer={
          activeQuestion?.type === "mcq"
            ? (activeQuestion.payload as import("./types").DuolingoMCQPayload).options.find(
                (o) => o.id === (activeQuestion.payload as import("./types").DuolingoMCQPayload).correctOptionId
              )?.text
            : activeQuestion?.type === "true_false"
              ? (activeQuestion.payload as import("./types").DuolingoTrueFalsePayload).correctAnswer
                ? "TRUE"
                : "FALSE"
              : activeQuestion?.type === "word_bank"
                ? (activeQuestion.payload as import("./types").DuolingoWordBankPayload).targetSentence
                : activeQuestion?.type === "fill_blank"
                  ? (activeQuestion.payload as import("./types").DuolingoFillBlankPayload).correctAnswer
                  : undefined
        }
        explanation={
          activeQuestion ? (activeQuestion.payload as { explanation?: string })?.explanation : undefined
        }
        xpEarned={10}
        combo={combo}
        isEvaluating={isEvaluating}
      />

      {/* ── 4. EXIT CONFIRMATION MODAL ── */}
      <DuolingoExitModal
        isOpen={isExitModalOpen}
        onKeepPlaying={() => setIsExitModalOpen(false)}
        onConfirmQuit={handleQuitConfirm}
      />

      {/* ── 5. OUT OF HEARTS RECOVERY MODAL ── */}
      <DuolingoOutOfHeartsModal
        isOpen={isOutOfHeartsOpen}
        userXp={userXp}
        onPracticeForHearts={handleRefillHearts}
        onRefillWithXp={handleRefillHearts}
        onQuit={handleQuitConfirm}
      />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   QUIZ CONTEXT & PROVIDER
   ════════════════════════════════════════════════════════════════════ */

interface QuizContextValue {
  session: unknown;
  setSession: (s: unknown) => void;
}

const QuizContext = React.createContext<QuizContextValue | null>(null);

export function QuizProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = React.useState<unknown>(null);
  return (
    <QuizContext.Provider value={{ session, setSession }}>
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const context = React.useContext(QuizContext);
  return context ?? { session: null, setSession: () => {} };
}