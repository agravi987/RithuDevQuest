import { describe, expect, it } from "vitest";

import {
  calculateScore,
  questionXp,
  summarizeLessonAttempts,
} from "@/lib/lesson/scoring";
import type { AttemptRecord } from "@/lib/lesson/scoring";

function record(
  overrides: Partial<AttemptRecord> = {},
): AttemptRecord {
  return {
    questionId: "q1",
    isCorrect: true,
    attemptNumber: 1,
    partIndex: null,
    difficulty: "beginner",
    ...overrides,
  };
}

describe("questionXp", () => {
  it("awards full beginner XP on a first-try correct answer", () => {
    expect(
      questionXp({ isCorrect: true, attemptNumber: 1, difficulty: "beginner" }),
    ).toBe(10);
  });

  it("awards half XP on a second-try correct answer", () => {
    expect(
      questionXp({ isCorrect: true, attemptNumber: 2, difficulty: "beginner" }),
    ).toBe(5);
  });

  it("awards a quarter XP on third or later correct attempts", () => {
    expect(
      questionXp({ isCorrect: true, attemptNumber: 3, difficulty: "beginner" }),
    ).toBe(3);
  });

  it("awards nothing for incorrect answers", () => {
    expect(
      questionXp({ isCorrect: false, attemptNumber: 1, difficulty: "beginner" }),
    ).toBe(0);
  });

  it("scales XP by difficulty", () => {
    expect(
      questionXp({ isCorrect: true, attemptNumber: 1, difficulty: "intermediate" }),
    ).toBe(15);
    expect(
      questionXp({ isCorrect: true, attemptNumber: 2, difficulty: "intermediate" }),
    ).toBe(8);
    expect(
      questionXp({ isCorrect: true, attemptNumber: 1, difficulty: "advanced" }),
    ).toBe(20);
    expect(
      questionXp({ isCorrect: true, attemptNumber: 3, difficulty: "advanced" }),
    ).toBe(5);
  });

  it("never grants negative XP", () => {
    expect(
      questionXp({ isCorrect: true, attemptNumber: 5, difficulty: "beginner" }),
    ).toBeGreaterThanOrEqual(3);
  });
});

describe("calculateScore", () => {
  it("computes a percentage of first-try correct answers", () => {
    expect(calculateScore(1, 2)).toBe(50);
    expect(calculateScore(2, 2)).toBe(100);
    expect(calculateScore(0, 2)).toBe(0);
  });

  it("rounds to the nearest integer", () => {
    expect(calculateScore(1, 3)).toBe(33);
  });

  it("treats a lesson with no questions as fully correct", () => {
    expect(calculateScore(0, 0)).toBe(100);
  });
});

describe("summarizeLessonAttempts", () => {
  it("scores first-try success and rewards question + completion XP", () => {
    const summary = summarizeLessonAttempts(
      [
        record({ questionId: "q1" }),
        record({ questionId: "q2" }),
      ],
      2,
    );
    expect(summary).toEqual({
      score: 100,
      xpEarned: 20 + 10 + 10,
      correctFirstTry: 2,
    });
  });

  it("counts a retry-correct question toward score only after first try", () => {
    const summary = summarizeLessonAttempts(
      [
        record({ questionId: "q1" }),
        record({ questionId: "q2", isCorrect: false }),
        record({ questionId: "q2", isCorrect: true, attemptNumber: 2 }),
      ],
      2,
    );
    expect(summary.score).toBe(50);
    expect(summary.correctFirstTry).toBe(1);
    expect(summary.xpEarned).toBe(20 + 10 + 5);
  });

  it("never counts a question more than once", () => {
    const summary = summarizeLessonAttempts(
      [
        record({ questionId: "q1", isCorrect: false }),
        record({ questionId: "q1", isCorrect: false, attemptNumber: 2 }),
        record({ questionId: "q1", isCorrect: true, attemptNumber: 3 }),
      ],
      1,
    );
    expect(summary.correctFirstTry).toBe(0);
    expect(summary.xpEarned).toBe(20 + 3);
  });

  it("rewards only the completion bonus for a question-free lesson", () => {
    const summary = summarizeLessonAttempts([], 0);
    expect(summary).toEqual({
      score: 100,
      xpEarned: 20,
      correctFirstTry: 0,
    });
  });

  describe("scenario questions", () => {
    it("treats a scenario as solved only when every part is correct", () => {
      const summary = summarizeLessonAttempts(
        [
          record({ questionId: "q1", partIndex: 0 }),
          record({ questionId: "q1", partIndex: 1 }),
        ],
        1,
      );
      expect(summary.correctFirstTry).toBe(1);
      expect(summary.xpEarned).toBe(20 + 10);
    });

    it("fails a scenario when a part was never solved", () => {
      const summary = summarizeLessonAttempts(
        [
          record({ questionId: "q1", partIndex: 0 }),
          record({ questionId: "q1", partIndex: 1, isCorrect: false }),
        ],
        1,
      );
      expect(summary.correctFirstTry).toBe(0);
      expect(summary.xpEarned).toBe(20);
    });

    it("keys scenario XP to the worst part attempt", () => {
      const summary = summarizeLessonAttempts(
        [
          record({ questionId: "q1", partIndex: 0 }),
          record({
            questionId: "q1",
            partIndex: 1,
            isCorrect: false,
            attemptNumber: 1,
          }),
          record({
            questionId: "q1",
            partIndex: 1,
            isCorrect: true,
            attemptNumber: 2,
          }),
        ],
        1,
      );
      expect(summary.correctFirstTry).toBe(0);
      expect(summary.xpEarned).toBe(20 + 5);
    });
  });
});