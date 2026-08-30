import { describe, expect, it } from "vitest";

import {
  ANSWER_ALT_SEPARATOR,
  normalizeAnswer,
  parseQuestionDifficulty,
  splitAcceptedAnswers,
  validateAcceptedAnswer,
  validateQuestionAnswer,
} from "@/lib/quiz/validation";

describe("normalizeAnswer", () => {
  it("trims surrounding whitespace", () => {
    expect(normalizeAnswer("  pwd ")).toBe("pwd");
  });

  it("collapses repeated internal whitespace", () => {
    expect(normalizeAnswer("ls   -l")).toBe("ls -l");
    expect(normalizeAnswer("tar  -czf  out.tgz")).toBe("tar -czf out.tgz");
  });
});

describe("splitAcceptedAnswers", () => {
  it("splits on the alternative separator", () => {
    expect(splitAcceptedAnswers("ls -la|ls -al")).toEqual(["ls -la", "ls -al"]);
  });

  it("keeps a single value with no separator", () => {
    expect(splitAcceptedAnswers("pwd")).toEqual(["pwd"]);
  });

  it("ignores empty alternatives", () => {
    expect(splitAcceptedAnswers("true|false|")).toEqual(["true", "false"]);
  });

  it("is exported as a inspectable constant", () => {
    expect(ANSWER_ALT_SEPARATOR).toBe("|");
  });
});

describe("validateAcceptedAnswer", () => {
  it("accepts an exact match", () => {
    expect(validateAcceptedAnswer("mkdir notes", "mkdir notes")).toBe(true);
  });

  it("accepts any alternative variant", () => {
    expect(validateAcceptedAnswer("ls -la|ls -al", "ls -al")).toBe(true);
  });

  it("is insensitive to differing whitespace", () => {
    expect(validateAcceptedAnswer("mkdir   notes", "mkdir  notes")).toBe(true);
  });

  it("rejects a wrong answer", () => {
    expect(validateAcceptedAnswer("mkdir notes", "rmdir notes")).toBe(false);
  });

  it("is case-sensitive for shell commands", () => {
    expect(validateAcceptedAnswer("pwd", "PWD")).toBe(false);
  });

  it("does not accept a partial alternative", () => {
    expect(validateAcceptedAnswer("echo a|echo b", "echo")).toBe(false);
  });
});

describe("validateQuestionAnswer", () => {
  it("validates single-part questions", () => {
    expect(
      validateQuestionAnswer({ type: "true_false", correctAnswer: "true" }, "true"),
    ).toBe(true);
    expect(
      validateQuestionAnswer(
        { type: "true_false", correctAnswer: "true" },
        "false",
      ),
    ).toBe(false);
    expect(
      validateQuestionAnswer(
        { type: "mcq", correctAnswer: "Shell" },
        "Shell",
      ),
    ).toBe(true);
  });

  it("validates fill_blank as a set of answers (all required, order free)", () => {
    const correct = "useradd|chmod";
    expect(validateQuestionAnswer({ type: "fill_blank", correctAnswer: correct }, "chmod|useradd")).toBe(true);
    expect(validateQuestionAnswer({ type: "fill_blank", correctAnswer: correct }, "useradd")).toBe(false);
    expect(validateQuestionAnswer({ type: "fill_blank", correctAnswer: correct }, "chmod|rm")).toBe(false);
  });

  it("validates multi_select as an exact set (no partial credit)", () => {
    const correct = "tf|docker";
    expect(validateQuestionAnswer({ type: "multi_select", correctAnswer: correct }, "docker|tf")).toBe(true);
    expect(validateQuestionAnswer({ type: "multi_select", correctAnswer: correct }, "tf|docker|k8s")).toBe(false);
    expect(validateQuestionAnswer({ type: "multi_select", correctAnswer: correct }, "tf")).toBe(false);
  });

  it("validates match as a set of the correct right-hand values", () => {
    const correct = "3000|3001|3306";
    expect(validateQuestionAnswer({ type: "match", correctAnswer: correct }, "3306|3000|3001")).toBe(true);
    expect(validateQuestionAnswer({ type: "match", correctAnswer: correct }, "3000|3001")).toBe(false);
    expect(validateQuestionAnswer({ type: "match", correctAnswer: correct }, "3000|3001|8080")).toBe(false);
  });

  it("validates sequence in the exact correct order", () => {
    const correct = "install|configure|build";
    expect(validateQuestionAnswer({ type: "sequence", correctAnswer: correct }, "install|configure|build")).toBe(true);
    expect(validateQuestionAnswer({ type: "sequence", correctAnswer: correct }, "install|build|configure")).toBe(false);
  });

  it("validates code_completion as a set of answers (all required)", () => {
    const correct = "git add .|git commit";
    expect(validateQuestionAnswer({ type: "code_completion", correctAnswer: correct }, "git commit|git add .")).toBe(true);
    expect(validateQuestionAnswer({ type: "code_completion", correctAnswer: correct }, "git add .")).toBe(false);
  });

  it("validates word_scramble by exact match", () => {
    expect(validateQuestionAnswer({ type: "word_scramble", correctAnswer: "eks" }, "eks")).toBe(true);
    expect(validateQuestionAnswer({ type: "word_scramble", correctAnswer: "eks" }, "kse")).toBe(false);
  });

  it("validates flip_cards by the pipe-joined answer set", () => {
    const backs = "front|back";
    expect(validateQuestionAnswer({ type: "flip_cards", correctAnswer: backs }, "front|back")).toBe(true);
    expect(validateQuestionAnswer({ type: "flip_cards", correctAnswer: backs }, "front|side")).toBe(false);
  });
});

describe("parseQuestionDifficulty", () => {
  it("accepts known difficulties", () => {
    expect(parseQuestionDifficulty("beginner")).toBe("beginner");
    expect(parseQuestionDifficulty("intermediate")).toBe("intermediate");
    expect(parseQuestionDifficulty("advanced")).toBe("advanced");
  });

  it("defaults unknown difficulties to beginner", () => {
    expect(parseQuestionDifficulty("expert")).toBe("beginner");
    expect(parseQuestionDifficulty("")).toBe("beginner");
  });
});