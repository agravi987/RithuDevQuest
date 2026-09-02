import { describe, expect, it } from "vitest";

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

  it("accepts a scenario with parts", () => {
    const result = questionInputSchema.safeParse({
      type: "scenario",
      difficulty: "advanced",
      question: "Run the command",
      correctAnswer: "ls",
      explanation: "e",
      parts: [{ prompt: "Step 1", correctAnswer: "ls" }],
    });
    expect(result.success).toBe(true);
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
