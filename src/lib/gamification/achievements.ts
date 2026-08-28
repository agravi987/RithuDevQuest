export type AchievementEvaluationInput = {
  totalCompletedLessons: number;
  currentStreak: number;
  currentLevel: number;
  totalXp: number;
  lessonScore?: number;
  alreadyUnlockedConditions: Set<string>;
};

export function evaluateNewAchievements(
  input: AchievementEvaluationInput,
): string[] {
  const newUnlocks: string[] = [];
  const { alreadyUnlockedConditions } = input;

  const check = (condition: string, isMet: boolean) => {
    if (isMet && !alreadyUnlockedConditions.has(condition)) {
      newUnlocks.push(condition);
    }
  };

  check("first_lesson", input.totalCompletedLessons >= 1);
  check("lessons_5", input.totalCompletedLessons >= 5);
  check("lessons_10", input.totalCompletedLessons >= 10);
  check("streak_3", input.currentStreak >= 3);
  check("streak_7", input.currentStreak >= 7);
  check("level_3", input.currentLevel >= 3);
  check("level_5", input.currentLevel >= 5);
  check("xp_500", input.totalXp >= 500);
  check("xp_1000", input.totalXp >= 1000);
  if (input.lessonScore !== undefined) {
    check("perfect_lesson", input.lessonScore === 100);
  }

  return newUnlocks;
}
