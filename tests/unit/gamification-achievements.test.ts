import { describe, expect, it } from "vitest";
import { evaluateNewAchievements } from "@/lib/gamification/achievements";

describe("Gamification - Achievements", () => {
  it("unlocks first_lesson on first completion", () => {
    const unlocks = evaluateNewAchievements({
      totalCompletedLessons: 1,
      currentStreak: 1,
      currentLevel: 1,
      totalXp: 35,
      lessonScore: 80,
      alreadyUnlockedConditions: new Set(),
    });

    expect(unlocks).toContain("first_lesson");
  });

  it("unlocks streak_3 when streak reaches 3", () => {
    const unlocks = evaluateNewAchievements({
      totalCompletedLessons: 3,
      currentStreak: 3,
      currentLevel: 1,
      totalXp: 120,
      lessonScore: 80,
      alreadyUnlockedConditions: new Set(["first_lesson"]),
    });

    expect(unlocks).toContain("streak_3");
    expect(unlocks).not.toContain("first_lesson"); // not duplicated
  });

  it("unlocks perfect_lesson on 100% score", () => {
    const unlocks = evaluateNewAchievements({
      totalCompletedLessons: 2,
      currentStreak: 2,
      currentLevel: 1,
      totalXp: 90,
      lessonScore: 100,
      alreadyUnlockedConditions: new Set(["first_lesson"]),
    });

    expect(unlocks).toContain("perfect_lesson");
  });

  it("does not unlock achievements already awarded", () => {
    const unlocks = evaluateNewAchievements({
      totalCompletedLessons: 5,
      currentStreak: 3,
      currentLevel: 3,
      totalXp: 500,
      alreadyUnlockedConditions: new Set([
        "first_lesson",
        "lessons_5",
        "streak_3",
        "level_3",
        "xp_500",
      ]),
    });

    expect(unlocks.length).toBe(0);
  });
});
