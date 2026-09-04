/**
 * Shared daily-challenge XP / combo calculations.
 *
 * Extracted from the API routes so the reward rules are unit-testable and
 * do not drift between the answer and complete handlers.
 */

export const DAILY_BASE_XP_PER_CORRECT = 10;
export const STREAK_BONUS_XP = 2;
export const COMBO_THRESHOLD = 3;
export const COMBO_BONUS_XP = 5;

/**
 * The live combo for a just-submitted answer: the number of consecutive
 * correct answers ending at the most recent attempt (given in reverse
 * chronological order), plus the current answer if it is correct.
 */
export function currentComboFrom(
  recentCorrectInReverseOrder: boolean[],
  currentIsCorrect: boolean,
): number {
  let combo = 0;
  for (const ok of recentCorrectInReverseOrder) {
    if (ok) combo++;
    else break;
  }
  if (currentIsCorrect) combo++;
  return combo;
}

/**
 * Total combo bonus for a challenge given its answers in chronological
 * order. Each run of >= COMBO_THRESHOLD consecutive correct answers earns
 * a single COMBO_BONUS_XP; runs reset on a wrong answer.
 */
export function comboBonusFrom(correctFlagsInOrder: boolean[]): number {
  let bonus = 0;
  let run = 0;
  for (const ok of correctFlagsInOrder) {
    if (ok) {
      run++;
      if (run >= COMBO_THRESHOLD) bonus += COMBO_BONUS_XP;
    } else {
      run = 0;
    }
  }
  return bonus;
}
