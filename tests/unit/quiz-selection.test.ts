import { describe, expect, it } from "vitest";

import {
  LESSON_QUESTION_SELECTION_COUNT,
  pickFromPool,
  selectQuestionRun,
} from "@/lib/quiz/selection";
import type { SelectableQuestion } from "@/lib/quiz/selection";

// A random generator that keeps the Fisher–Yates shuffle in source order.
const identityRandom = () => 0.999;

function pool(entries: Array<[string, SelectableQuestion["type"], SelectableQuestion["difficulty"]]>): SelectableQuestion[] {
  return entries.map(([id, type, difficulty]) => ({ id, type, difficulty }));
}

describe("selectQuestionRun", () => {
  const bank = pool([
    ["b1", "mcq", "beginner"],
    ["b2", "scenario", "beginner"],
    ["i1", "command", "intermediate"],
    ["i2", "scenario", "intermediate"],
    ["a1", "command", "advanced"],
    ["a2", "mcq", "advanced"],
  ]);

  it("selects the default count from the bank", () => {
    const selected = selectQuestionRun(bank, { random: identityRandom });
    expect(selected).toHaveLength(LESSON_QUESTION_SELECTION_COUNT);
  });

  it("never repeats a question or picks outside the bank", () => {
    const selected = selectQuestionRun(bank, { random: identityRandom });
    const ids = selected.map((question) => question.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(bank.some((question) => question.id === id)).toBe(true);
    }
  });

  it("ramps difficulty from easy to hard", () => {
    const selected = selectQuestionRun(bank, { random: identityRandom });
    expect(selected.map((question) => question.difficulty)).toEqual([
      "beginner",
      "beginner",
      "intermediate",
      "intermediate",
      "advanced",
    ]);
  });

  it("prefers questions that have not been asked recently", () => {
    const rich = pool([
      ["b1", "mcq", "beginner"],
      ["b2", "scenario", "beginner"],
      ["b3", "command", "beginner"],
      ["i1", "mcq", "intermediate"],
      ["i2", "scenario", "intermediate"],
      ["i3", "command", "intermediate"],
      ["a1", "scenario", "advanced"],
      ["a2", "command", "advanced"],
      ["a3", "mcq", "advanced"],
    ]);
    const selected = selectQuestionRun(rich, {
      avoidIds: ["b1", "i1"],
      random: identityRandom,
    });
    expect(selected.some((question) => question.id === "b1")).toBe(false);
    expect(selected.some((question) => question.id === "i1")).toBe(false);
  });

  it("covers every type present in the bank", () => {
    const selected = selectQuestionRun(bank, { random: identityRandom });
    const types = new Set(selected.map((question) => question.type));
    expect(types).toEqual(new Set(["mcq", "scenario", "command"]));
  });

  it("clamps the count to the pool size", () => {
    const selected = selectQuestionRun(bank, {
      count: 10,
      random: identityRandom,
    });
    expect(selected).toHaveLength(bank.length);
    expect(new Set(selected.map((question) => question.id)).size).toBe(
      bank.length,
    );
  });

  it("returns an empty run for an empty pool", () => {
    expect(selectQuestionRun([], { random: identityRandom })).toEqual([]);
  });
});

describe("pickFromPool", () => {
  const items = ["a", "b", "c", "d"].map((id) => ({ id }));

  it("returns up to count items", () => {
    expect(pickFromPool(items, new Set(), 2, identityRandom)).toHaveLength(2);
    expect(pickFromPool(items, new Set(), 10, identityRandom)).toHaveLength(4);
  });

  it("prefers non-avoided items", () => {
    const picked = pickFromPool(items, new Set(["a"]), 3, identityRandom);
    expect(picked.some((item) => item.id === "a")).toBe(false);
  });

  it("falls back to avoided items when needed", () => {
    const picked = pickFromPool(items, new Set(["a", "b", "c"]), 4, identityRandom);
    expect(picked).toHaveLength(4);
  });
});