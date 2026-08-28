import type { QuestionDifficulty } from "@/lib/quiz/validation";

export const LESSON_COMPLETION_XP = 20;

/** First-try XP by difficulty. Retries earn 50% then 25% of the base. */
export const QUESTION_XP_BY_DIFFICULTY: Record<QuestionDifficulty, number> = {
  beginner: 10,
  intermediate: 15,
  advanced: 20,
};

export const SECOND_TRY_MULTIPLIER = 0.5;
export const LATER_TRY_MULTIPLIER = 0.25;

export type AnswerOutcome = {
  isCorrect: boolean;
  attemptNumber: number;
  difficulty: QuestionDifficulty;
};

export type AttemptRecord = {
  questionId: string;
  isCorrect: boolean;
  attemptNumber: number;
  /** 0-based part index for scenario questions; null for single-part types. */
  partIndex: number | null;
  difficulty: QuestionDifficulty;
};

export type LessonSummary = {
  score: number;
  xpEarned: number;
  correctFirstTry: number;
};

/**
 * XP awarded for a question once it is solved. First-try correct answers
 * earn the full base for the difficulty, second-try answers earn 50%, and
 * third or later attempts earn 25%.
 */
export function questionXp({
  isCorrect,
  attemptNumber,
  difficulty,
}: AnswerOutcome): number {
  if (!isCorrect) return 0;
  const base = QUESTION_XP_BY_DIFFICULTY[difficulty];
  const multiplier =
    attemptNumber === 1
      ? 1
      : attemptNumber === 2
        ? SECOND_TRY_MULTIPLIER
        : LATER_TRY_MULTIPLIER;
  return Math.round(base * multiplier);
}

/**
 * Lesson score as a percentage. Only first-try correct answers count
 * toward the score; a lesson with no questions is treated as 100%.
 */
export function calculateScore(
  correctFirstTry: number,
  totalQuestions: number,
): number {
  if (totalQuestions <= 0) return 100;
  return Math.round((correctFirstTry / totalQuestions) * 100);
}

type Completion = {
  attemptNumber: number;
  difficulty: QuestionDifficulty;
};

/**
 * The attempt on which a single-part question was first solved, or null
 * when it was never solved.
 */
function singlePartCompletion(attempts: AttemptRecord[]): Completion | null {
  let best: Completion | null = null;
  for (const attempt of attempts) {
    if (!attempt.isCorrect) continue;
    if (best === null || attempt.attemptNumber < best.attemptNumber) {
      best = {
        attemptNumber: attempt.attemptNumber,
        difficulty: attempt.difficulty,
      };
    }
  }
  return best;
}

/**
 * Scenario completion: every part (indices 0..max) must have a correct
 * answer. The effective attempt number is the worst part's best attempt,
 * and difficulty comes from the question's own difficulty.
 */
function scenarioCompletion(attempts: AttemptRecord[]): Completion | null {
  const bestAttemptForPart = new Map<number, number>();
  let maxPartIndex = -1;
  for (const attempt of attempts) {
    if (attempt.partIndex === null) return null;
    if (attempt.partIndex > maxPartIndex) maxPartIndex = attempt.partIndex;
    if (!attempt.isCorrect) continue;
    const current = bestAttemptForPart.get(attempt.partIndex);
    if (current === undefined || attempt.attemptNumber < current) {
      bestAttemptForPart.set(attempt.partIndex, attempt.attemptNumber);
    }
  }

  for (let partIndex = 0; partIndex <= maxPartIndex; partIndex++) {
    if (!bestAttemptForPart.has(partIndex)) return null;
  }

  return {
    attemptNumber: Math.max(...bestAttemptForPart.values()),
    difficulty: attempts[0]!.difficulty,
  };
}

/**
 * Summarize a lesson's attempt records into a final score and XP total.
 * XP = lesson completion bonus + per-question XP for each solved question.
 */
export function summarizeLessonAttempts(
  records: AttemptRecord[],
  totalQuestions: number,
): LessonSummary {
  const byQuestion = new Map<string, AttemptRecord[]>();
  for (const record of records) {
    const group = byQuestion.get(record.questionId) ?? [];
    group.push(record);
    byQuestion.set(record.questionId, group);
  }

  let correctFirstTry = 0;
  let bonusXp = 0;
  for (const attempts of byQuestion.values()) {
    const isScenario = attempts.some((attempt) => attempt.partIndex !== null);
    const completion = isScenario
      ? scenarioCompletion(attempts)
      : singlePartCompletion(attempts);
    if (!completion) continue;

    if (completion.attemptNumber === 1) correctFirstTry += 1;
    bonusXp += questionXp({
      isCorrect: true,
      attemptNumber: completion.attemptNumber,
      difficulty: completion.difficulty,
    });
  }

  return {
    score: calculateScore(correctFirstTry, totalQuestions),
    xpEarned: LESSON_COMPLETION_XP + bonusXp,
    correctFirstTry,
  };
}