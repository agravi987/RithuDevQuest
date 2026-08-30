import { describe, it, expect } from "vitest";
import {
  getWrongAnswerMessage,
  getMilestoneMessage,
  getRandomMentorTip,
} from "@/lib/mentor/responses";

describe("getWrongAnswerMessage", () => {
  it("returns a message and explanation", () => {
    const result = getWrongAnswerMessage({
      question: "What is pwd?",
      userAnswer: "ls",
      correctAnswer: "pwd",
      explanation: "pwd prints the working directory.",
    });
    expect(result.message).toBeTruthy();
    expect(result.explanation).toBe("pwd prints the working directory.");
  });

  it("always includes the explanation from context", () => {
    const explanation = "The correct answer is 42.";
    const result = getWrongAnswerMessage({
      question: "What is the answer?",
      userAnswer: "0",
      correctAnswer: "42",
      explanation,
    });
    expect(result.explanation).toBe(explanation);
  });
});

describe("getMilestoneMessage", () => {
  it("returns celebration for achievement", () => {
    const result = getMilestoneMessage({
      type: "achievement",
      title: "First Quest",
      description: "Complete your first lesson",
    });
    expect(result.title).toBe("First Quest");
    expect(result.message).toBeTruthy();
  });

  it("returns celebration for level up", () => {
    const result = getMilestoneMessage({
      type: "level_up",
      title: "Level 3",
    });
    expect(result.title).toBe("Level 3");
    expect(result.message).toBeTruthy();
  });

  it("returns celebration for first lesson", () => {
    const result = getMilestoneMessage({
      type: "first_lesson",
      title: "First Quest",
    });
    expect(result.message).toBeTruthy();
  });

  it("returns celebration for streak", () => {
    const result = getMilestoneMessage({
      type: "streak",
      title: "3-Day Streak",
    });
    expect(result.message).toBeTruthy();
  });
});

describe("getRandomMentorTip", () => {
  it("returns a tip with message and topic", () => {
    const tip = getRandomMentorTip();
    expect(tip.message).toBeTruthy();
    expect(tip.topic).toBeTruthy();
  });

  it("returns tips from the defined pool", () => {
    const tip = getRandomMentorTip();
    const topics = ["Linux", "Docker", "Git", "Kubernetes"];
    expect(topics).toContain(tip.topic);
  });
});
