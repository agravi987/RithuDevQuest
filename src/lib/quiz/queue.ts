import type { DuolingoQuestion, DuolingoQueueItem } from "@/components/quiz/types";

export interface QueueEvaluationResult {
  nextQueue: DuolingoQueueItem[];
  evaluatedItem: DuolingoQueueItem;
  isSessionComplete: boolean;
  xpEarned: number;
}

/**
 * Initialize a new dynamic mistake-recycling queue from a list of questions.
 */
export function createQuizQueue(questions: DuolingoQuestion[]): DuolingoQueueItem[] {
  return questions.map((q) => ({
    question: q,
    attemptCount: 0,
    firstTryCorrect: null,
    userAnswer: undefined,
  }));
}

/**
 * Calculate XP awarded for a question based on attempts.
 * 1st attempt = 10 XP (100%)
 * 2nd attempt = 5 XP (50%)
 * 3rd+ attempt = 3 XP (25%)
 */
export function calculateQuestionXp(attemptNumber: number): number {
  if (attemptNumber <= 1) return 10;
  if (attemptNumber === 2) return 5;
  return 3;
}

/**
 * Calculate streak combo bonus: +2 XP for every consecutive correct answer above 3.
 */
export function calculateComboBonus(currentCombo: number): number {
  return currentCombo >= 3 ? 2 : 0;
}

/**
 * Process an answer submission against the active queue item.
 * - If correct: Question is removed from queue.
 * - If incorrect: Question attempt is incremented and re-inserted at the end of the queue!
 */
export function processQueueAnswer(
  queue: DuolingoQueueItem[],
  isCorrect: boolean,
  userAnswer?: string,
): QueueEvaluationResult {
  if (queue.length === 0) {
    throw new Error("Cannot process answer on an empty queue.");
  }

  const [head, ...rest] = queue;
  if (!head) {
    throw new Error("No active question in queue.");
  }

  const nextAttempt = head.attemptCount + 1;
  const isFirstTry = head.attemptCount === 0;

  const updatedItem: DuolingoQueueItem = {
    ...head,
    attemptCount: nextAttempt,
    firstTryCorrect: isFirstTry ? isCorrect : head.firstTryCorrect,
    userAnswer,
  };

  let nextQueue: DuolingoQueueItem[];
  let xpEarned = 0;

  if (isCorrect) {
    // Correct! Item is mastered and cleared from the queue.
    nextQueue = rest;
    xpEarned = calculateQuestionXp(nextAttempt);
  } else {
    // Incorrect! Spaced mistake recycling: re-insert at the end of the queue.
    nextQueue = [...rest, updatedItem];
    xpEarned = 0;
  }

  return {
    nextQueue,
    evaluatedItem: updatedItem,
    isSessionComplete: nextQueue.length === 0,
    xpEarned,
  };
}

/**
 * Calculate overall session accuracy (percentage of questions answered correctly on the 1st try).
 */
export function calculateSessionAccuracy(
  history: Array<{ firstTryCorrect: boolean | null }>,
): number {
  if (history.length === 0) return 100;
  const firstTryCount = history.filter((h) => h.firstTryCorrect === true).length;
  return Math.round((firstTryCount / history.length) * 100);
}
