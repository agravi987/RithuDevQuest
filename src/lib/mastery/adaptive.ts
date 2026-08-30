import type { QuestionDifficulty } from "@/lib/quiz/validation";

const DIFFICULTY_ORDER: QuestionDifficulty[] = [
  "beginner",
  "intermediate",
  "advanced",
];

export type AdaptiveState = {
  consecutiveCorrect: number;
  consecutiveWrong: number;
  currentDifficulty: QuestionDifficulty;
};

/**
 * Determines whether to adjust difficulty based on recent answer patterns.
 *
 * Rules:
 * - 3+ correct in a row → increase difficulty
 * - 2+ wrong in a row → decrease difficulty
 * - Otherwise keep current difficulty
 */
export function shouldAdjustDifficulty(state: AdaptiveState): {
  newDifficulty: QuestionDifficulty;
  adjusted: boolean;
  reason: string;
} {
  const { consecutiveCorrect, consecutiveWrong, currentDifficulty } = state;

  // Increase difficulty after 3 correct in a row
  if (consecutiveCorrect >= 3) {
    const currentIndex = DIFFICULTY_ORDER.indexOf(currentDifficulty);
    if (currentIndex < DIFFICULTY_ORDER.length - 1) {
      const newDifficulty = DIFFICULTY_ORDER[currentIndex + 1]!;
      return {
        newDifficulty,
        adjusted: true,
        reason: `You've answered ${consecutiveCorrect} correctly in a row — increasing difficulty`,
      };
    }
    return {
      newDifficulty: currentDifficulty,
      adjusted: false,
      reason: "Already at maximum difficulty",
    };
  }

  // Decrease difficulty after 2 wrong in a row
  if (consecutiveWrong >= 2) {
    const currentIndex = DIFFICULTY_ORDER.indexOf(currentDifficulty);
    if (currentIndex > 0) {
      const newDifficulty = DIFFICULTY_ORDER[currentIndex - 1]!;
      return {
        newDifficulty,
        adjusted: true,
        reason: `You've struggled with the last ${consecutiveWrong} — decreasing difficulty`,
      };
    }
    return {
      newDifficulty: currentDifficulty,
      adjusted: false,
      reason: "Already at minimum difficulty",
    };
  }

  return {
    newDifficulty: currentDifficulty,
    adjusted: false,
    reason: "",
  };
}

/**
 * Creates an initial adaptive state for a lesson.
 */
export function createAdaptiveState(
  initialDifficulty: QuestionDifficulty = "beginner",
): AdaptiveState {
  return {
    consecutiveCorrect: 0,
    consecutiveWrong: 0,
    currentDifficulty: initialDifficulty,
  };
}

/**
 * Updates adaptive state after an answer.
 */
export function updateAdaptiveState(
  state: AdaptiveState,
  isCorrect: boolean,
): AdaptiveState {
  if (isCorrect) {
    return {
      ...state,
      consecutiveCorrect: state.consecutiveCorrect + 1,
      consecutiveWrong: 0,
    };
  }
  return {
    ...state,
    consecutiveCorrect: 0,
    consecutiveWrong: state.consecutiveWrong + 1,
  };
}
