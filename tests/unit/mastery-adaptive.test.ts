import { describe, it, expect } from "vitest";
import {
  shouldAdjustDifficulty,
  createAdaptiveState,
  updateAdaptiveState,
} from "@/lib/mastery/adaptive";

describe("createAdaptiveState", () => {
  it("creates state with default beginner difficulty", () => {
    const state = createAdaptiveState();
    expect(state.consecutiveCorrect).toBe(0);
    expect(state.consecutiveWrong).toBe(0);
    expect(state.currentDifficulty).toBe("beginner");
  });

  it("creates state with custom difficulty", () => {
    const state = createAdaptiveState("intermediate");
    expect(state.currentDifficulty).toBe("intermediate");
  });
});

describe("updateAdaptiveState", () => {
  it("increments consecutiveCorrect on correct answer", () => {
    const state = createAdaptiveState();
    const updated = updateAdaptiveState(state, true);
    expect(updated.consecutiveCorrect).toBe(1);
    expect(updated.consecutiveWrong).toBe(0);
  });

  it("resets consecutiveCorrect on wrong answer", () => {
    const state = { consecutiveCorrect: 3, consecutiveWrong: 0, currentDifficulty: "beginner" as const };
    const updated = updateAdaptiveState(state, false);
    expect(updated.consecutiveCorrect).toBe(0);
    expect(updated.consecutiveWrong).toBe(1);
  });

  it("resets consecutiveWrong on correct answer", () => {
    const state = { consecutiveCorrect: 0, consecutiveWrong: 2, currentDifficulty: "beginner" as const };
    const updated = updateAdaptiveState(state, true);
    expect(updated.consecutiveWrong).toBe(0);
    expect(updated.consecutiveCorrect).toBe(1);
  });
});

describe("shouldAdjustDifficulty", () => {
  it("increases difficulty after 3 correct in a row", () => {
    const state = { consecutiveCorrect: 3, consecutiveWrong: 0, currentDifficulty: "beginner" as const };
    const result = shouldAdjustDifficulty(state);
    expect(result.adjusted).toBe(true);
    expect(result.newDifficulty).toBe("intermediate");
  });

  it("decreases difficulty after 2 wrong in a row", () => {
    const state = { consecutiveCorrect: 0, consecutiveWrong: 2, currentDifficulty: "intermediate" as const };
    const result = shouldAdjustDifficulty(state);
    expect(result.adjusted).toBe(true);
    expect(result.newDifficulty).toBe("beginner");
  });

  it("does not adjust when fewer than threshold", () => {
    const state = { consecutiveCorrect: 2, consecutiveWrong: 0, currentDifficulty: "beginner" as const };
    const result = shouldAdjustDifficulty(state);
    expect(result.adjusted).toBe(false);
  });

  it("does not increase beyond advanced", () => {
    const state = { consecutiveCorrect: 5, consecutiveWrong: 0, currentDifficulty: "advanced" as const };
    const result = shouldAdjustDifficulty(state);
    expect(result.adjusted).toBe(false);
    expect(result.newDifficulty).toBe("advanced");
  });

  it("does not decrease below beginner", () => {
    const state = { consecutiveCorrect: 0, consecutiveWrong: 5, currentDifficulty: "beginner" as const };
    const result = shouldAdjustDifficulty(state);
    expect(result.adjusted).toBe(false);
    expect(result.newDifficulty).toBe("beginner");
  });
});
