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