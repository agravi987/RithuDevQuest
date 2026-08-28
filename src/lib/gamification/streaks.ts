export function getUtcDayKey(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function isSameUtcDay(date1: Date, date2: Date): boolean {
  return getUtcDayKey(date1) === getUtcDayKey(date2);
}

export function isYesterdayUtc(dateToCheck: Date, relativeTo: Date): boolean {
  const oneDayMs = 24 * 60 * 60 * 1000;
  const yesterday = new Date(relativeTo.getTime() - oneDayMs);
  return getUtcDayKey(dateToCheck) === getUtcDayKey(yesterday);
}

export type StreakTransition = {
  previousStreak: number;
  newStreak: number;
  longestStreak: number;
  status: "maintained" | "incremented" | "reset" | "started";
  isStreakActiveToday: boolean;
};

export function evaluateStreakUpdate(
  lastActiveDate: Date | null,
  currentStreak: number,
  longestStreak: number,
  now: Date = new Date(),
): StreakTransition {
  if (!lastActiveDate) {
    const newStreak = 1;
    return {
      previousStreak: currentStreak,
      newStreak,
      longestStreak: Math.max(longestStreak, newStreak),
      status: "started",
      isStreakActiveToday: true,
    };
  }

  if (isSameUtcDay(lastActiveDate, now)) {
    return {
      previousStreak: currentStreak,
      newStreak: Math.max(1, currentStreak),
      longestStreak: Math.max(longestStreak, currentStreak),
      status: "maintained",
      isStreakActiveToday: true,
    };
  }

  if (isYesterdayUtc(lastActiveDate, now)) {
    const newStreak = currentStreak + 1;
    return {
      previousStreak: currentStreak,
      newStreak,
      longestStreak: Math.max(longestStreak, newStreak),
      status: "incremented",
      isStreakActiveToday: true,
    };
  }

  // Gap is 2 or more days: streak resets to 1
  const newStreak = 1;
  return {
    previousStreak: currentStreak,
    newStreak,
    longestStreak: Math.max(longestStreak, newStreak),
    status: "reset",
    isStreakActiveToday: true,
  };
}
