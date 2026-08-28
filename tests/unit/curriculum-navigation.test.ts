import { describe, expect, it } from "vitest";

import type { NavigableUnit } from "@/lib/curriculum/navigation";
import {
  canAccessLesson,
  flattenLessons,
  getLessonProgress,
  getLessonStatuses,
  getNextLesson,
} from "@/lib/curriculum/navigation";

function makeUnits(): NavigableUnit[] {
  return [
    {
      id: "unit-a",
      order: 1,
      lessons: [
        { id: "lesson-1", order: 1 },
        { id: "lesson-2", order: 2 },
      ],
    },
    {
      id: "unit-b",
      order: 2,
      lessons: [
        { id: "lesson-3", order: 1 },
        { id: "lesson-4", order: 2 },
      ],
    },
  ];
}

describe("flattenLessons", () => {
  it("returns lessons across units in order", () => {
    const lessons = flattenLessons(makeUnits());
    expect(lessons.map((l) => l.id)).toEqual([
      "lesson-1",
      "lesson-2",
      "lesson-3",
      "lesson-4",
    ]);
  });

  it("sorts units by order before flattening", () => {
    const units = [
      { id: "later", order: 2, lessons: [{ id: "x", order: 1 }] },
      { id: "earlier", order: 1, lessons: [{ id: "y", order: 1 }] },
    ];
    expect(flattenLessons(units).map((l) => l.id)).toEqual(["y", "x"]);
  });
});

describe("canAccessLesson", () => {
  it("unlocks the first lesson", () => {
    expect(canAccessLesson(makeUnits(), [], "lesson-1")).toBe(true);
  });

  it("locks a lesson until its predecessor is completed", () => {
    expect(canAccessLesson(makeUnits(), [], "lesson-2")).toBe(false);
    expect(canAccessLesson(makeUnits(), ["lesson-1"], "lesson-2")).toBe(true);
  });

  it("locks across unit boundaries", () => {
    expect(canAccessLesson(makeUnits(), ["lesson-1"], "lesson-3")).toBe(false);
    expect(
      canAccessLesson(makeUnits(), ["lesson-1", "lesson-2"], "lesson-3"),
    ).toBe(true);
  });

  it("accepts a Set of completed ids", () => {
    expect(
      canAccessLesson(makeUnits(), new Set(["lesson-1"]), "lesson-2"),
    ).toBe(true);
  });

  it("returns false for unknown lessons", () => {
    expect(canAccessLesson(makeUnits(), [], "nope")).toBe(false);
  });
});

describe("getLessonStatuses", () => {
  it("marks the first lesson available and the rest locked", () => {
    const statuses = getLessonStatuses(makeUnits(), []);
    expect(statuses.map((s) => s.state)).toEqual([
      "available",
      "locked",
      "locked",
      "locked",
    ]);
  });

  it("marks completed lessons and advances the frontier", () => {
    const statuses = getLessonStatuses(makeUnits(), ["lesson-1"]);
    expect(statuses.map((s) => s.state)).toEqual([
      "completed",
      "available",
      "locked",
      "locked",
    ]);
  });
});

describe("getNextLesson", () => {
  it("returns the first lesson when nothing is completed", () => {
    expect(getNextLesson(makeUnits(), [])?.id).toBe("lesson-1");
  });

  it("returns the next available lesson", () => {
    expect(getNextLesson(makeUnits(), ["lesson-1"])?.id).toBe("lesson-2");
  });

  it("returns null when all lessons are completed", () => {
    expect(
      getNextLesson(makeUnits(), ["lesson-1", "lesson-2", "lesson-3", "lesson-4"]),
    ).toBeNull();
  });
});

describe("getLessonProgress", () => {
  it("counts completed lessons against the total", () => {
    expect(getLessonProgress(makeUnits(), ["lesson-1", "lesson-3"])).toEqual({
      completed: 2,
      total: 4,
    });
  });

  it("ignores ids that do not belong to the module", () => {
    expect(getLessonProgress(makeUnits(), ["lesson-1", "other"])).toEqual({
      completed: 1,
      total: 4,
    });
  });
});