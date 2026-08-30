export type NavigableLesson = {
  id: string;
  order: number;
  title?: string;
  slug?: string;
  estimatedMinutes?: number;
};

export type NavigableUnit = {
  id: string;
  order: number;
  lessons: NavigableLesson[];
};

export type LessonState = "locked" | "available" | "completed";

export type LessonStatus = {
  lesson: NavigableLesson;
  state: LessonState;
};

/**
 * Flatten all lessons of a module's units into presentation order.
 */
export function flattenLessons(units: NavigableUnit[]): NavigableLesson[] {
  return [...units]
    .sort((a, b) => a.order - b.order)
    .flatMap((unit) => [...unit.lessons].sort((a, b) => a.order - b.order));
}

/**
 * A lesson is accessible when the previous lesson in the module is completed,
 * or when there is no previous lesson (first lesson is always unlocked).
 */
export function canAccessLesson(
  units: NavigableUnit[],
  completedLessonIds: Set<string> | string[],
  lessonId: string,
): boolean {
  const lessons = flattenLessons(units);
  const index = lessons.findIndex((lesson) => lesson.id === lessonId);
  if (index === -1) return false;

  const completed = toSet(completedLessonIds);
  if (index === 0) return true;

  return completed.has(lessons[index - 1]!.id);
}

/**
 * Get the current status of every lesson in a module.
 */
export function getLessonStatuses(
  units: NavigableUnit[],
  completedLessonIds: Set<string> | string[],
): LessonStatus[] {
  const lessons = flattenLessons(units);
  const completed = toSet(completedLessonIds);

  return lessons.map((lesson, index) => {
    if (completed.has(lesson.id)) {
      return { lesson, state: "completed" as const };
    }
    if (index === 0 || completed.has(lessons[index - 1]!.id)) {
      return { lesson, state: "available" as const };
    }
    return { lesson, state: "locked" as const };
  });
}

/**
 * The first accessible lesson that is not yet completed, or null when
 * every lesson is complete.
 */
export function getNextLesson(
  units: NavigableUnit[],
  completedLessonIds: Set<string> | string[],
): NavigableLesson | null {
  const statuses = getLessonStatuses(units, completedLessonIds);
  const open = statuses.find((status) => status.state === "available");
  return open?.lesson ?? null;
}

/**
 * Completion summary for a module.
 */
export function getLessonProgress(
  units: NavigableUnit[],
  completedLessonIds: Set<string> | string[],
): { completed: number; total: number } {
  const lessons = flattenLessons(units);
  const completed = toSet(completedLessonIds);
  return {
    completed: lessons.filter((lesson) => completed.has(lesson.id)).length,
    total: lessons.length,
  };
}

function toSet(ids: Set<string> | string[]): Set<string> {
  return ids instanceof Set ? ids : new Set(ids);
}
