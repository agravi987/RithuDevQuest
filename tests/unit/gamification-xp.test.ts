import { describe, expect, it } from "vitest";
import {
  calculateLessonXpBreakdown,
  XP_LESSON_COMPLETION,
  XP_FIRST_TRY_BONUS,
  XP_SECOND_TRY_BONUS,
  XP_PERFECT_LESSON_BONUS,
} from "@/lib/gamification/xp";

describe("Gamification - XP Calculation", () => {
  it("calculates base XP with first-try bonus", () => {
    const breakdown = calculateLessonXpBreakdown({
      correctFirstTryCount: 2,
      correctSecondTryCount: 1,
      isPerfect: false,
    });

    expect(breakdown.base).toBe(XP_LESSON_COMPLETION);
    expect(breakdown.firstTryBonus).toBe(2 * XP_FIRST_TRY_BONUS);
    expect(breakdown.secondTryBonus).toBe(1 * XP_SECOND_TRY_BONUS);
    expect(breakdown.perfectBonus).toBe(0);
    expect(breakdown.totalXp).toBe(
      XP_LESSON_COMPLETION + 2 * XP_FIRST_TRY_BONUS + 1 * XP_SECOND_TRY_BONUS,
    );
  });

  it("adds perfect score bonus when isPerfect is true", () => {
    const breakdown = calculateLessonXpBreakdown({
      correctFirstTryCount: 3,
      isPerfect: true,
    });

    expect(breakdown.perfectBonus).toBe(XP_PERFECT_LESSON_BONUS);
    expect(breakdown.totalXp).toBe(
      XP_LESSON_COMPLETION + 3 * XP_FIRST_TRY_BONUS + XP_PERFECT_LESSON_BONUS,
    );
  });

  it("calculates streak bonus capped at max streak bonus", () => {
    const breakdown = calculateLessonXpBreakdown({
      correctFirstTryCount: 0,
      currentStreak: 20, // 20 * 2 = 40, should cap at 20
    });

    expect(breakdown.streakBonus).toBe(20);
  });
});
