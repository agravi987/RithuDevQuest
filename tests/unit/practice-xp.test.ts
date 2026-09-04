import { describe, expect, it } from "vitest";

import {
  COMBO_BONUS_XP,
  COMBO_THRESHOLD,
  currentComboFrom,
  comboBonusFrom,
} from "@/lib/practice/xp";

describe("currentComboFrom", () => {
  it("returns 1 for the first correct answer with no history", () => {
    expect(currentComboFrom([], true)).toBe(1);
    expect(currentComboFrom([], false)).toBe(0);
  });

  it("counts only the trailing run of correct answers plus the current one", () => {
    // recentCorrect is in reverse (most recent first): [wrong, correct, correct]
    expect(currentComboFrom([false, true, true], true)).toBe(1);
  });

  it("adds the current correct answer to an all-correct run", () => {
    expect(currentComboFrom([true, true, true], true)).toBe(4);
  });

  it("counts a fresh run after a break in the history", () => {
    // reverse order: [correct, correct, wrong, correct]
    expect(currentComboFrom([true, true, false, true], true)).toBe(3);
  });

  it("reports the trailing correct count even when the current answer is wrong", () => {
    // The caller gates this away (`isCorrect ? combo : 0`); the raw trailing
    // run before a wrong answer is still the previous streak length.
    expect(currentComboFrom([true, true, true], false)).toBe(3);
  });
});

describe("comboBonusFrom", () => {
  it("earns no bonus for runs below the threshold", () => {
    expect(comboBonusFrom([true, false, true, true, false])).toBe(0);
  });

  it("earns a bonus when a run reaches the threshold", () => {
    const run = Array.from({ length: COMBO_THRESHOLD }, () => true);
    expect(comboBonusFrom(run)).toBe(COMBO_BONUS_XP);
  });

  it("awards a bonus for each answer at or beyond the threshold within a run", () => {
    // 5 consecutive correct: bonus at the 3rd, 4th and 5th answers.
    const run = Array.from({ length: COMBO_THRESHOLD + 2 }, () => true);
    expect(comboBonusFrom(run)).toBe(COMBO_BONUS_XP * 3);
  });

  it("resets the run on a wrong answer and counts each qualifying run separately", () => {
    const runLength = COMBO_THRESHOLD;
    const answers = [
      ...Array.from({ length: runLength }, () => true),
      false,
      ...Array.from({ length: runLength }, () => true),
    ];
    expect(comboBonusFrom(answers)).toBe(COMBO_BONUS_XP * 2);
  });

  it("handles an empty list", () => {
    expect(comboBonusFrom([])).toBe(0);
  });
});
