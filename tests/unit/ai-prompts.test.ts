import { describe, expect, it } from "vitest";
import { buildQuestionGenerationPrompt } from "@/lib/ai/prompts/question";
import { buildExplanationPrompt } from "@/lib/ai/prompts/explanation";
import { buildHintPrompt } from "@/lib/ai/prompts/hint";
import { buildMentorPrompt } from "@/lib/ai/prompts/mentor";
import { cleanJsonString } from "@/lib/ai/generator";

describe("AI Prompts and Utilities", () => {
  it("builds question generation prompt with topic and difficulty", () => {
    const { system, user } = buildQuestionGenerationPrompt({
      topic: "Docker Volumes",
      difficulty: "intermediate",
      questionType: "command",
      count: 2,
    });

    expect(system).toContain("Rithu");
    expect(system).toContain("questions");
    expect(user).toContain("Docker Volumes");
    expect(user).toContain("intermediate");
    expect(user).toContain('"command"');
    expect(user).toContain("2");
  });

  it("builds explanation prompt with student context", () => {
    const { system, user } = buildExplanationPrompt({
      topic: "Kubernetes Pods",
      question: "Which field in a Pod spec specifies containers?",
      userAnswer: "images",
      correctAnswer: "containers",
    });

    expect(system).toContain("concept");
    expect(system).toContain("whyIncorrect");
    expect(user).toContain("Kubernetes Pods");
    expect(user).toContain("images");
    expect(user).toContain("containers");
  });

  it("builds hint prompt for specific attempt", () => {
    const { system, user } = buildHintPrompt({
      topic: "Git Rebase",
      question: "Interactive rebase command",
      attemptNumber: 2,
    });

    expect(system).toContain("hint");
    expect(user).toContain("attempt #2");
  });

  it("builds mentor prompt for diverse scenarios", () => {
    const { user: greetingUser } = buildMentorPrompt({
      situation: "greeting",
      userName: "RithuDev",
      currentStreak: 5,
    });
    expect(greetingUser).toContain("5 days");

    const { user: levelUpUser } = buildMentorPrompt({
      situation: "level_up",
      level: 4,
    });
    expect(levelUpUser).toContain("Level 4");
  });

  it("cleans markdown fences from json string", () => {
    const raw = "```json\n{\"questions\": []}\n```";
    expect(cleanJsonString(raw)).toBe('{"questions": []}');

    const plain = '{"hello": "world"}';
    expect(cleanJsonString(plain)).toBe('{"hello": "world"}');
  });
});
