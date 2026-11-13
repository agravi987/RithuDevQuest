import { describe, expect, it } from "vitest";
import { allCareers } from "@content/curriculum/index";
import type { SeedQuestion } from "@/lib/curriculum/seed";
import { encodeRichQuestion } from "@/lib/quiz/types";
import { validateQuestionAnswer } from "@/lib/quiz/validation";

type AuditedQuestion = SeedQuestion & { id: string; location: string };

const allQuestions: AuditedQuestion[] = allCareers.flatMap((career) =>
  career.paths.flatMap((path) =>
    path.modules.flatMap((module) =>
      module.units.flatMap((unit) =>
        unit.lessons.flatMap((lesson) =>
          (lesson.questions ?? []).map((question, index) => ({
            ...question,
            id: `${career.slug}/${path.slug}/${lesson.slug}#${index}`,
            location: `${career.slug} → ${lesson.slug}`,
          })),
        ),
      ),
    ),
  ),
);

function grade(question: AuditedQuestion, answer: string): boolean {
  const encoded = encodeRichQuestion(question);
  return validateQuestionAnswer(
    {
      type: question.type,
      correctAnswer: encoded.correctAnswer,
      options: encoded.options,
    },
    answer,
  );
}

/** First accepted token of a pipe-joined answer (what the engine submits). */
function primary(answer: string): string {
  return answer.split("|")[0]?.trim() ?? answer.trim();
}

describe("content grading audit", () => {
  it("has a non-trivial question bank to audit", () => {
    expect(allQuestions.length).toBeGreaterThan(800);
  });

  it("every MCQ's stored correct answer is one of its options and grades correct", () => {
    const violations: string[] = [];
    for (const q of allQuestions.filter((q) => q.type === "mcq")) {
      const options = q.options ?? [];
      if (options.length < 2) violations.push(`${q.id}: fewer than 2 options`);
      const correct = q.correctAnswer ?? "";
      if (!options.includes(correct)) {
        violations.push(`${q.id}: correctAnswer "${correct}" not among options`);
      }
      if (!grade(q, correct)) {
        violations.push(`${q.id}: correct answer "${correct}" grades as WRONG`);
      }
      const wrong = options.find((o) => o !== correct);
      if (wrong !== undefined && grade(q, wrong)) {
        violations.push(`${q.id}: wrong option "${wrong}" grades as CORRECT`);
      }
    }
    expect(violations).toEqual([]);
  });

  it("every true/false question grades its stored answer and rejects the inverse", () => {
    const violations: string[] = [];
    for (const q of allQuestions.filter((q) => q.type === "true_false")) {
      const correct = (q.correctAnswer ?? "").toLowerCase();
      if (correct !== "true" && correct !== "false") {
        violations.push(`${q.id}: correctAnswer "${correct}" is not true/false`);
        continue;
      }
      if (!grade(q, correct)) violations.push(`${q.id}: "${correct}" grades WRONG`);
      const inverse = correct === "true" ? "false" : "true";
      if (grade(q, inverse)) {
        violations.push(`${q.id}: inverse "${inverse}" grades CORRECT`);
      }
    }
    expect(violations).toEqual([]);
  });

  it("every fill_blank/code_completion accepts its first accepted answer and rejects junk", () => {
    const violations: string[] = [];
    for (const q of allQuestions.filter(
      (q) => q.type === "fill_blank" || q.type === "code_completion",
    )) {
      const raw = q.fillBlanks ?? q.codeBlanks ?? [];
      if (raw.length === 0) violations.push(`${q.id}: no blanks defined`);
      for (const blank of raw) {
        // The Galaxy engine stages one blank; the server must accept each
        // accepted synonym variant (pipe alternatives) as a single part.
        for (const variant of blank.answer.split("|")) {
          if (!grade(q, variant.trim())) {
            violations.push(`${q.id}: accepted blank "${variant.trim()}" grades WRONG`);
          }
        }
      }
      if (grade(q, "totally-wrong-answer-42")) {
        violations.push(`${q.id}: junk answer grades CORRECT`);
      }
    }
    expect(violations).toEqual([]);
  });

  it("every multi_select has correct options and they grade correct singly", () => {
    const violations: string[] = [];
    for (const q of allQuestions.filter((q) => q.type === "multi_select")) {
      const opts = q.multiSelectOptions ?? [];
      const correctOpts = opts.filter((o) => o.isCorrect);
      if (opts.length < 3) violations.push(`${q.id}: fewer than 3 options`);
      if (correctOpts.length === 0) violations.push(`${q.id}: no correct option`);
      if (correctOpts.length === opts.length) {
        violations.push(`${q.id}: every option is correct`);
      }
      for (const opt of correctOpts) {
        if (!grade(q, opt.text)) {
          violations.push(`${q.id}: correct option "${opt.text}" grades WRONG`);
        }
      }
      for (const opt of opts.filter((o) => !o.isCorrect)) {
        if (grade(q, opt.text)) {
          violations.push(`${q.id}: wrong option "${opt.text}" grades CORRECT`);
        }
      }
    }
    expect(violations).toEqual([]);
  });

  it("every match question has valid pairs and every right value grades correct", () => {
    const violations: string[] = [];
    for (const q of allQuestions.filter((q) => q.type === "match")) {
      const pairs = q.matchPairs ?? [];
      if (pairs.length < 2) violations.push(`${q.id}: fewer than 2 pairs`);
      const lefts = new Set(pairs.map((p) => p.left));
      const rights = new Set(pairs.map((p) => p.right));
      if (lefts.size !== pairs.length) violations.push(`${q.id}: duplicate left values`);
      if (rights.size !== pairs.length) violations.push(`${q.id}: duplicate right values`);
      for (const pair of pairs) {
        if (!grade(q, pair.right)) {
          violations.push(`${q.id}: pair right "${pair.right}" grades WRONG`);
        }
      }
    }
    expect(violations).toEqual([]);
  });

  it("every sequence grades its canonical order (as texts) and rejects wrong orders", () => {
    const violations: string[] = [];
    for (const q of allQuestions.filter((q) => q.type === "sequence")) {
      const items = q.sequenceItems ?? [];
      const order = q.sequenceCorrectOrder ?? items.map((i) => i.id);
      if (items.length < 2) violations.push(`${q.id}: fewer than 2 items`);
      if (new Set(items.map((i) => i.id)).size !== items.length) {
        violations.push(`${q.id}: duplicate item ids`);
      }
      const orderSet = new Set(order);
      if (orderSet.size !== items.length || items.some((i) => !orderSet.has(i.id))) {
        violations.push(`${q.id}: sequenceCorrectOrder is not a permutation of item ids`);
      }
      const textById = new Map(items.map((i) => [i.id, i.text]));
      const canonical = order.map((id) => textById.get(id) ?? "").join(" ");
      if (!grade(q, canonical)) {
        violations.push(`${q.id}: canonical order "${canonical}" grades WRONG`);
      }
      // Reverse order must be rejected (unless trivially 1 item).
      if (items.length > 1) {
        const reversed = [...order].reverse().map((id) => textById.get(id) ?? "").join(" ");
        if (grade(q, reversed)) {
          violations.push(`${q.id}: reversed order grades CORRECT`);
        }
      }
    }
    expect(violations).toEqual([]);
  });

  it("every word_scramble grades its unscrambled word", () => {
    const violations: string[] = [];
    for (const q of allQuestions.filter((q) => q.type === "word_scramble")) {
      const word = q.scrambledWord ?? "";
      if (!word) violations.push(`${q.id}: no scrambledWord`);
      if (!grade(q, word.toLowerCase())) {
        violations.push(`${q.id}: word "${word}" grades WRONG`);
      }
    }
    expect(violations).toEqual([]);
  });

  it("every scenario has at least 2 parts with non-empty answers", () => {
    const violations: string[] = [];
    for (const q of allQuestions.filter((q) => q.type === "scenario")) {
      const parts = q.parts ?? [];
      if (parts.length < 2) violations.push(`${q.id}: fewer than 2 parts`);
      for (const [i, part] of parts.entries()) {
        if (!part.correctAnswer.trim()) violations.push(`${q.id}: part ${i} empty answer`);
      }
    }
    expect(violations).toEqual([]);
  });

  it("every question ships a real explanation (no placeholders)", () => {
    const violations: string[] = [];
    for (const q of allQuestions) {
      const explanation = (q.explanation ?? "").trim();
      if (explanation.length < 10) {
        violations.push(`${q.id}: explanation too short`);
      }
    }
    expect(violations).toEqual([]);
  });

  it("fill_blank questions with a single blank provide chip options or synonyms", () => {
    // Single-blank questions are rendered as chips in the Galaxy engine; if
    // no options are encoded the adapter synthesizes decoys, so this is a
    // soft hygiene check on the primary answer's presence only.
    const violations: string[] = [];
    for (const q of allQuestions.filter((q) => q.type === "fill_blank")) {
      const raw = q.fillBlanks ?? [];
      if (raw.length === 1 && !raw[0]?.answer.trim()) {
        violations.push(`${q.id}: single blank with empty answer`);
      }
      if (raw.length > 1) {
        const first = primary(raw[0]?.answer ?? "");
        if (!grade(q, first)) {
          violations.push(`${q.id}: first blank of multi-blank grades WRONG`);
        }
      }
    }
    expect(violations).toEqual([]);
  });
});
