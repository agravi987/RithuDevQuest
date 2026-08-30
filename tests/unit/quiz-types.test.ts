import { describe, expect, it } from "vitest";

import type { SeedQuestion } from "@/lib/curriculum/seed";
import { buildRichPayload, encodeRichQuestion, QUESTION_TYPE_META } from "@/lib/quiz/types";

const base = {
  difficulty: "beginner" as const,
  explanation: "",
};

describe("encodeRichQuestion", () => {
  it("keeps classic questions passing through untouched", () => {
    const mcq: SeedQuestion = {
      ...base,
      type: "mcq",
      question: "Which shell?",
      options: ["bash", "zsh"],
      correctAnswer: "bash",
    };
    const encoded = encodeRichQuestion(mcq);
    expect(encoded.options).toEqual(["bash", "zsh"]);
    expect(encoded.correctAnswer).toBe("bash");
  });

  it("encodes fill_blank options and pipe-joined answers", () => {
    const question: SeedQuestion = {
      ...base,
      type: "fill_blank",
      question: "___ starts a container.",
      fillBlanks: [{ answer: "docker" }, { answer: "run" }],
    };
    const encoded = encodeRichQuestion(question);
    expect(encoded).toEqual({
      options: [{ answer: "docker" }, { answer: "run" }],
      correctAnswer: "docker|run",
    });
  });

  it("encodes multi_select keeping only correct texts in the answer", () => {
    const question: SeedQuestion = {
      ...base,
      type: "multi_select",
      question: "Pick the containers?",
      multiSelectOptions: [
        { text: "Docker", isCorrect: true },
        { text: "Kubernetes", isCorrect: true },
        { text: "Linux", isCorrect: false },
      ],
    };
    const encoded = encodeRichQuestion(question);
    expect(encoded.correctAnswer).toBe("Docker|Kubernetes");
  });

  it("encodes match pairs and joins the right column", () => {
    const question: SeedQuestion = {
      ...base,
      type: "match",
      question: "Match ports.",
      matchPairs: [
        { left: "HTTP", right: "80" },
        { left: "HTTPS", right: "443" },
      ],
    };
    const encoded = encodeRichQuestion(question);
    expect(encoded.options).toEqual([
      { left: "HTTP", right: "80" },
      { left: "HTTPS", right: "443" },
    ]);
    expect(encoded.correctAnswer).toBe("80|443");
  });

  it("encodes sequence parts and an ordered answer", () => {
    const question: SeedQuestion = {
      ...base,
      type: "sequence",
      question: "Order the steps.",
      sequenceItems: [
        { id: "install", text: "install tools" },
        { id: "configure", text: "configure" },
        { id: "build", text: "build" },
      ],
      sequenceCorrectOrder: ["install", "configure", "build"],
    };
    const encoded = encodeRichQuestion(question);
    expect(encoded.parts).toEqual(["install", "configure", "build"]);
    expect(encoded.correctAnswer).toBe("install|configure|build");
  });

  it("stores code language on the first blank", () => {
    const question: SeedQuestion = {
      ...base,
      type: "code_completion",
      question: "git {{a}} -m \"msg\"",
      codeLanguage: "bash",
      codeBlanks: [
        { id: "a", answer: "commit" },
        { id: "b", answer: "add" },
      ],
    };
    const encoded = encodeRichQuestion(question);
    expect((encoded.options as { language?: string }[])[0]?.language).toBe("bash");
    expect(encoded.correctAnswer).toBe("commit|add");
  });

  it("normalizes word_scramble answers to lowercase", () => {
    const question: SeedQuestion = {
      ...base,
      type: "word_scramble",
      question: "Unscramble: CKE",
      scrambledWord: "ECK",
    };
    const encoded = encodeRichQuestion(question);
    expect(encoded.correctAnswer).toBe("eck");
  });

  it("joins flip_card backs as the answer", () => {
    const question: SeedQuestion = {
      ...base,
      type: "flip_cards",
      question: "Review these terms.",
      flipCards: [
        { front: "K8s", back: "Kubernetes" },
        { front: "Terraform", back: "IaC" },
      ],
    };
    const encoded = encodeRichQuestion(question);
    expect(encoded.correctAnswer).toBe("Kubernetes|IaC");
  });
});

describe("buildRichPayload", () => {
  it("returns null for classic question types", () => {
    expect(buildRichPayload({ type: "mcq", options: null, parts: null })).toBeNull();
    expect(buildRichPayload({ type: "scenario", options: null, parts: null })).toBeNull();
  });

  it("rebuilds a fill_blank payload from encoded options", () => {
    const encoded = encodeRichQuestion({
      ...base,
      type: "fill_blank",
      question: "___ it.",
      fillBlanks: [{ answer: "ls" }],
    });
    const rich = buildRichPayload({ type: "fill_blank", options: encoded.options, parts: null });
    expect(rich?.payload?.fillBlanks).toEqual([{ answer: "ls" }]);
  });

  it("recovers code_blanks stripped of the language marker and exposes codeLanguage", () => {
    const encoded = encodeRichQuestion({
      ...base,
      type: "code_completion",
      question: "kubectl {{a}} pods",
      codeLanguage: "bash",
      codeBlanks: [{ id: "a", answer: "get" }],
    });
    const rich = buildRichPayload({ type: "code_completion", options: encoded.options, parts: null });
    expect(rich?.payload?.codeLanguage).toBe("bash");
    expect(rich?.payload?.codeBlanks).toEqual([{ id: "a", answer: "get" }]);
  });

  it("recovers sequence order from parts", () => {
    const encoded = encodeRichQuestion({
      ...base,
      type: "sequence",
      question: "Order.",
      sequenceItems: [{ id: "a", text: "A" }, { id: "b", text: "B" }],
      sequenceCorrectOrder: ["b", "a"],
    });
    const rich = buildRichPayload({ type: "sequence", options: encoded.options, parts: encoded.parts });
    expect(rich?.payload?.sequenceCorrectOrder).toEqual(["b", "a"]);
  });
});

describe("QUESTION_TYPE_META", () => {
  it("has a badge label and color for every rich question type", () => {
    for (const type of [
      "mcq",
      "true_false",
      "command",
      "scenario",
      "fill_blank",
      "multi_select",
      "match",
      "sequence",
      "code_completion",
      "word_scramble",
      "flip_cards",
    ]) {
      const meta = QUESTION_TYPE_META[type as keyof typeof QUESTION_TYPE_META];
      expect(meta?.label).toBeTruthy();
      expect(meta?.color).toMatch(/^bg-/);
    }
  });
});