import { describe, expect, it } from "vitest";

import {
  planQuestionReseed,
  questionMatchKey,
} from "@/lib/curriculum/reseed";

import type { SeedQuestion } from "@/lib/curriculum/seed";

const seed = (overrides: Partial<SeedQuestion> & { question: string; type: SeedQuestion["type"] }): SeedQuestion => ({
  difficulty: "beginner",
  explanation: "e",
  ...overrides,
});

describe("questionMatchKey", () => {
  it("combines type and question text", () => {
    expect(questionMatchKey("mcq", "What is a shell?")).toBe(
      "mcq|What is a shell?",
    );
  });
});

describe("planQuestionReseed", () => {
  it("updates matching questions in place, preserving ids", () => {
    const existing = [
      { id: "q1", type: "mcq", question: "What is a shell?" },
      { id: "q2", type: "true_false", question: "Bash is the default shell." },
    ];
    const seeds = [
      seed({ type: "mcq", question: "What is a shell?" }),
      seed({ type: "true_false", question: "Bash is the default shell." }),
      seed({ type: "mcq", question: "Print ready" }),
    ];

    const plan = planQuestionReseed(seeds, existing);

    expect(plan.updates.map((u) => u.id)).toEqual(["q1", "q2"]);
    expect(plan.creates.map((c) => c.question)).toEqual(["Print ready"]);
  });

  it("never schedules questions that exist in the DB but not in the seed", () => {
    const existing = [
      { id: "admin-q", type: "mcq", question: "Admin added question" },
      { id: "ai-q", type: "command", question: "AI generated question" },
    ];
    const seeds = [
      seed({ type: "mcq", question: "Seeded question" }),
    ];

    const plan = planQuestionReseed(seeds, existing);

    expect(plan.updates).toHaveLength(0);
    expect(plan.creates.map((c) => c.question)).toEqual(["Seeded question"]);
  });

  it("matches on type AND question text together", () => {
    const existing = [
      { id: "q", type: "mcq", question: "Same text" },
    ];
    const seeds = [seed({ type: "true_false", question: "Same text" })];

    const plan = planQuestionReseed(seeds, existing);

    expect(plan.updates).toHaveLength(0);
    expect(plan.creates.map((c) => c.question)).toEqual(["Same text"]);
  });

  it("creates duplicate seed questions instead of matching them", () => {
    const dup = seed({ type: "mcq", question: "Duplicated content" });
    const plan = planQuestionReseed([dup, dup], []);

    expect(plan.creates).toHaveLength(2);
  });
});