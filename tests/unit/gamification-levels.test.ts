import { describe, expect, it } from "vitest";
import { calculateLevel } from "@/lib/gamification/levels";

describe("Gamification - Levels", () => {
  it("calculates Level 1 for 0 XP", () => {
    const result = calculateLevel(0);
    expect(result.level).toBe(1);
    expect(result.title).toBe("Code Initiate");
    expect(result.progressPercentage).toBe(0);
    expect(result.xpToNextLevel).toBe(100);
    expect(result.isMaxLevel).toBe(false);
  });

  it("calculates Level 2 for 100 XP", () => {
    const result = calculateLevel(100);
    expect(result.level).toBe(2);
    expect(result.title).toBe("Terminal Explorer");
    expect(result.progressPercentage).toBe(0);
    expect(result.xpToNextLevel).toBe(200);
  });

  it("calculates partial tier progress percentage accurately", () => {
    // Level 2 range is 100 to 300 (range = 200). 200 XP is 100 into tier -> 50%
    const result = calculateLevel(200);
    expect(result.level).toBe(2);
    expect(result.progressPercentage).toBe(50);
    expect(result.xpToNextLevel).toBe(100);
  });

  it("handles high XP / max level gracefully", () => {
    const result = calculateLevel(6000);
    expect(result.level).toBe(10);
    expect(result.title).toBe("DevOps Legend");
    expect(result.isMaxLevel).toBe(true);
    expect(result.progressPercentage).toBe(100);
    expect(result.xpToNextLevel).toBe(0);
  });

  it("handles negative XP safely by clamping to 0", () => {
    const result = calculateLevel(-50);
    expect(result.level).toBe(1);
    expect(result.currentXp).toBe(0);
  });
});
