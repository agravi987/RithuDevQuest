import { describe, expect, it } from "vitest";
import {
  evaluateStreakUpdate,
  isSameUtcDay,
  isYesterdayUtc,
} from "@/lib/gamification/streaks";

describe("Gamification - Streaks", () => {
  it("starts streak at 1 for a new user", () => {
    const result = evaluateStreakUpdate(null, 0, 0, new Date("2026-08-28T12:00:00Z"));
    expect(result.status).toBe("started");
    expect(result.newStreak).toBe(1);
    expect(result.longestStreak).toBe(1);
    expect(result.isStreakActiveToday).toBe(true);
  });

  it("maintains streak when user practices again on the same UTC day", () => {
    const today = new Date("2026-08-28T10:00:00Z");
    const now = new Date("2026-08-28T16:00:00Z");

    const result = evaluateStreakUpdate(today, 3, 5, now);
    expect(result.status).toBe("maintained");
    expect(result.newStreak).toBe(3);
    expect(result.longestStreak).toBe(5);
  });

  it("increments streak when user practices on consecutive days", () => {
    const yesterday = new Date("2026-08-27T18:00:00Z");
    const today = new Date("2026-08-28T09:00:00Z");

    const result = evaluateStreakUpdate(yesterday, 3, 4, today);
    expect(result.status).toBe("incremented");
    expect(result.newStreak).toBe(4);
    expect(result.longestStreak).toBe(4);
  });

  it("resets streak to 1 when a day is missed", () => {
    const threeDaysAgo = new Date("2026-08-25T12:00:00Z");
    const today = new Date("2026-08-28T12:00:00Z");

    const result = evaluateStreakUpdate(threeDaysAgo, 7, 7, today);
    expect(result.status).toBe("reset");
    expect(result.newStreak).toBe(1);
    expect(result.longestStreak).toBe(7); // longest streak is preserved!
  });

  it("correctly identifies UTC days", () => {
    const d1 = new Date("2026-08-28T01:00:00Z");
    const d2 = new Date("2026-08-28T23:59:59Z");
    expect(isSameUtcDay(d1, d2)).toBe(true);

    const dYesterday = new Date("2026-08-27T15:00:00Z");
    expect(isYesterdayUtc(dYesterday, d1)).toBe(true);
  });
});
