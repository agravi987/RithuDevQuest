export const XP_LESSON_COMPLETION = 20;
export const XP_FIRST_TRY_BONUS = 10;
export const XP_SECOND_TRY_BONUS = 5;
export const XP_PERFECT_LESSON_BONUS = 15;
export const XP_MAX_STREAK_BONUS = 20;
export const XP_STREAK_RATE_PER_DAY = 2;

export type LessonXpCalculationInput = {
  correctFirstTryCount: number;
  correctSecondTryCount?: number;
  isPerfect?: boolean;
  currentStreak?: number;
  isCompleted?: boolean;
};

export type LessonXpBreakdown = {
  base: number;
  firstTryBonus: number;
  secondTryBonus: number;
  perfectBonus: number;
  streakBonus: number;
  totalXp: number;
};

export function calculateLessonXpBreakdown(
  input: LessonXpCalculationInput,
): LessonXpBreakdown {
  const base = input.isCompleted !== false ? XP_LESSON_COMPLETION : 0;
  const firstTryBonus = Math.max(0, input.correctFirstTryCount) * XP_FIRST_TRY_BONUS;
  const secondTryBonus = Math.max(0, input.correctSecondTryCount ?? 0) * XP_SECOND_TRY_BONUS;
  const perfectBonus = input.isPerfect ? XP_PERFECT_LESSON_BONUS : 0;

  const rawStreakBonus = Math.max(0, input.currentStreak ?? 0) * XP_STREAK_RATE_PER_DAY;
  const streakBonus = Math.min(XP_MAX_STREAK_BONUS, rawStreakBonus);

  const totalXp = base + firstTryBonus + secondTryBonus + perfectBonus + streakBonus;

  return {
    base,
    firstTryBonus,
    secondTryBonus,
    perfectBonus,
    streakBonus,
    totalXp,
  };
}
