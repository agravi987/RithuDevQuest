import { describe, expect, it } from "vitest";

import { encodeRichQuestion } from "@/lib/quiz/types";
import {
  activitySchema,
  achievementInputSchema,
  careerInputSchema,
  lessonInputSchema,
  questionInputSchema,
  unitInputSchema,
} from "@/lib/admin/content-validation";

describe("careerInputSchema", () => {
  it("accepts a valid career", () => {
    const result = careerInputSchema.safeParse({
      title: "DevOps Engineer",
      description: "All about DevOps",
      slug: "devops-engineer",
      order: "0",
    });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid slug", () => {
    const result = careerInputSchema.safeParse({
      title: "DevOps",
      slug: "DevOps Engineer!",
      order: "0",
    });
    expect(result.success).toBe(false);
  });
});

describe("lessonInputSchema", () => {
  it("accepts a valid lesson", () => {
    const result = lessonInputSchema.safeParse({
      title: "Intro to Docker",
      slug: "intro-to-docker",
      estimatedMinutes: "10",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.estimatedMinutes).toBe(10);
    }
  });

  it("rejects an empty title", () => {
    const result = lessonInputSchema.safeParse({
      title: "",
      slug: "intro",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a slug with spaces", () => {
    const result = lessonInputSchema.safeParse({
      title: "Intro",
      slug: "intro to docker",
    });
    expect(result.success).toBe(false);
  });
});

describe("unitInputSchema", () => {
  it("accepts a valid unit", () => {
    expect(
      unitInputSchema.safeParse({ title: "Basics", slug: "basics" }).success,
    ).toBe(true);
  });
});

describe("activitySchema", () => {
  it("accepts a learn activity", () => {
    const result = activitySchema.safeParse({
      type: "learn",
      body: "Here is the content",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a missing body", () => {
    const result = activitySchema.safeParse({ type: "learn", body: "" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe(
        "Activity body is required",
      );
    }
  });
});

describe("questionInputSchema", () => {
  it("accepts a valid mcq question", () => {
    const result = questionInputSchema.safeParse({
      type: "mcq",
      difficulty: "beginner",
      question: "What is Docker?",
      correctAnswer: "A container runtime",
      explanation: "Because",
      options: ["A container runtime", "A database"],
    });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid type", () => {
    const result = questionInputSchema.safeParse({
      type: "essay",
      difficulty: "beginner",
      question: "q",
      correctAnswer: "a",
      explanation: "e",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an mcq with fewer than two options", () => {
    const result = questionInputSchema.safeParse({
      type: "mcq",
      difficulty: "beginner",
      question: "q",
      correctAnswer: "a",
      explanation: "e",
      options: ["a"],
    });
    expect(result.success).toBe(false);
  });

  it("accepts all rich question types", () => {
    const cases = [
      {
        type: "scenario",
        parts: [{ prompt: "Step 1", correctAnswer: "ls" }, { prompt: "Step 2", correctAnswer: "pwd" }],
      },
      {
        type: "fill_blank",
        fillBlanks: [{ answer: "cold" }],
      },
      {
        type: "multi_select",
        multiSelectOptions: [
          { text: "A", isCorrect: true },
          { text: "B", isCorrect: false },
          { text: "C", isCorrect: true },
        ],
      },
      {
        type: "match",
        matchPairs: [
          { left: "HPA", right: "Scales pods" },
          { left: "Autoscaler", right: "Scales nodes" },
        ],
      },
      {
        type: "sequence",
        sequenceItems: [
          { id: "a", text: "Start" },
          { id: "b", text: "End" },
        ],
        sequenceCorrectOrder: ["a", "b"],
      },
      {
        type: "code_completion",
        codeBlanks: [{ id: "a", answer: "console.log" }],
        codeLanguage: "typescript",
      },
      { type: "word_scramble", scrambledWord: "google" },
      {
        type: "flip_cards",
        flipCards: [{ front: "VM", back: "Virtual machine" }],
      },
    ];

    for (const payload of cases) {
      const result = questionInputSchema.safeParse({
        difficulty: "intermediate",
        question: "q",
        explanation: "e",
        ...payload,
      });
      expect(result.success, `expected ${payload.type} to succeed`).toBe(true);
    }
  });

  it("rejects a rejected sequence id in correct order", () => {
    const result = questionInputSchema.safeParse({
      type: "sequence",
      difficulty: "intermediate",
      question: "q",
      explanation: "e",
      sequenceItems: [
        { id: "a", text: "Start" },
        { id: "b", text: "End" },
      ],
      sequenceCorrectOrder: ["a", "c"],
    });
    expect(result.success).toBe(false);
  });

  it("rejects a multi-select with no correct option", () => {
    const result = questionInputSchema.safeParse({
      type: "multi_select",
      difficulty: "intermediate",
      question: "q",
      explanation: "e",
      multiSelectOptions: [
        { text: "A", isCorrect: false },
        { text: "B", isCorrect: false },
      ],
    });
    expect(result.success).toBe(false);
  });
});

describe("rich question encoding", () => {
  it("encodes a match question into options", () => {
    const encoded = encodeRichQuestion({
      type: "match",
      question: "q",
      explanation: "e",
      matchPairs: [
        { left: "A", right: "1" },
        { left: "B", right: "2" },
      ],
    });
    expect(encoded.options).toEqual([
      { left: "A", right: "1" },
      { left: "B", right: "2" },
    ]);
    expect(encoded.correctAnswer).toBe("1|2");
  });

  it("encodes a multi-select answer from correct options", () => {
    const encoded = encodeRichQuestion({
      type: "multi_select",
      question: "q",
      explanation: "e",
      multiSelectOptions: [
        { text: "A", isCorrect: true },
        { text: "B", isCorrect: false },
        { text: "C", isCorrect: true },
      ],
    });
    expect(encoded.correctAnswer).toBe("A|C");
  });
});

describe("achievementInputSchema", () => {
  it("accepts a valid achievement", () => {
    const result = achievementInputSchema.safeParse({
      title: "First Steps",
      description: "Complete your first lesson",
      icon: "Star",
      category: "learning",
      condition: "first_lesson",
      threshold: "1",
      xpReward: "50",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.threshold).toBe(1);
    }
  });

  it("rejects an invalid condition", () => {
    const result = achievementInputSchema.safeParse({
      title: "First Steps",
      description: "Complete a lesson",
      icon: "Star",
      category: "learning",
      condition: "first lesson",
      xpReward: "50",
    });
    expect(result.success).toBe(false);
  });
});
