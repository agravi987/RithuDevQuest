import { describe, expect, it } from "vitest";
import {
  calculateMasteryScore,
  getMasteryTier,
  type SkillAttemptRecord,
} from "@/lib/mastery/score";

describe("Mastery Engine", () => {
  it("returns default zero score for empty attempts", () => {
    const result = calculateMasteryScore([]);
    expect(result.score).toBe(0);
    expect(result.tier).toBe("weak");
    expect(result.totalAttempts).toBe(0);
    expect(result.accuracyPercentage).toBe(0);
  });

  it("calculates 100% mastery for flawless first-try answers", () => {
    const now = new Date("2026-08-28T12:00:00Z");
    const attempts: SkillAttemptRecord[] = [
      {
        isCorrect: true,
        attemptNumber: 1,
        difficulty: "intermediate",
        answeredAt: new Date("2026-08-28T11:50:00Z"),
      },
      {
        isCorrect: true,
        attemptNumber: 1,
        difficulty: "advanced",
        answeredAt: new Date("2026-08-28T11:55:00Z"),
      },
    ];

    const result = calculateMasteryScore(attempts, now);
    expect(result.score).toBe(100);
    expect(result.tier).toBe("mastered");
    expect(result.accuracyPercentage).toBe(100);
  });

  it("calculates partial mastery for mixed attempts", () => {
    const now = new Date("2026-08-28T12:00:00Z");
    const attempts: SkillAttemptRecord[] = [
      {
        isCorrect: true,
        attemptNumber: 1,
        difficulty: "beginner",
        answeredAt: new Date("2026-08-28T11:00:00Z"),
      },
      {
        isCorrect: false,
        attemptNumber: 1,
        difficulty: "intermediate",
        answeredAt: new Date("2026-08-28T11:10:00Z"),
      },
      {
        isCorrect: true,
        attemptNumber: 2,
        difficulty: "intermediate",
        answeredAt: new Date("2026-08-28T11:15:00Z"),
      },
    ];

    const result = calculateMasteryScore(attempts, now);
    expect(result.score).toBeGreaterThan(30);
    expect(result.score).toBeLessThan(90);
    expect(result.totalAttempts).toBe(3);
  });

  it("maps mastery tiers accurately", () => {
    expect(getMasteryTier(90).tier).toBe("mastered");
    expect(getMasteryTier(75).tier).toBe("good");
    expect(getMasteryTier(50).tier).toBe("developing");
    expect(getMasteryTier(30).tier).toBe("weak");
  });
});
