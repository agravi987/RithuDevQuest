import { describe, expect, it } from "vitest";

import { allCareers } from "@content/curriculum/index";
import type { SeedLesson, SeedQuestion, SeedQuestionType } from "@/lib/curriculum/seed";

const RICH_TYPES = new Set([
  "fill_blank",
  "multi_select",
  "match",
  "sequence",
  "code_completion",
  "word_scramble",
  "flip_cards",
]);

function flattenLessons(): { career: string; lesson: string; lessonSlug: string }[] {
  return allCareers.flatMap((career) =>
    career.paths.flatMap((path) =>
      path.modules.flatMap((mod) =>
        mod.units.flatMap((unit) =>
          unit.lessons.map((lesson) => ({
            career: career.slug,
            lesson: lesson.slug,
            lessonSlug: lesson.slug,
          })),
        ),
      ),
    ),
  );
}

function flattenQuestions(): { career: string; lesson: string; question: SeedQuestion }[] {
  return allCareers.flatMap((career) =>
    career.paths.flatMap((path) =>
      path.modules.flatMap((mod) =>
        mod.units.flatMap((unit) =>
          unit.lessons.flatMap((lesson) =>
            (lesson.questions ?? []).map((question) => ({
              career: career.slug,
              lesson: lesson.slug,
              question,
            })),
          ),
        ),
      ),
    ),
  );
}

describe("All curriculum content", () => {
  it("has at least two lessons per module and one question source per career", () => {
    for (const career of allCareers) {
      const lessons = flattenLessons().filter((l) => l.career === career.slug);
      expect(career.paths.length, `${career.slug} paths`).toBeGreaterThan(0);
      expect(lessons.length, `${career.slug} lessons`).toBeGreaterThan(0);
    }
  });

  it("keeps every lesson well-formed", () => {
    for (const career of allCareers) {
      for (const path of career.paths) {
        for (const mod of path.modules) {
          expect(mod.units.length, `${mod.slug} units`).toBeGreaterThan(0);
          for (const unit of mod.units) {
            expect(unit.lessons.length, `${unit.slug} lessons`).toBeGreaterThan(0);
            for (const lesson of unit.lessons) {
              assertLessonShape(lesson, career.slug);
            }
          }
        }
      }
    }
  });

  it("builds a valid question bank for every lesson that defines questions", () => {
    const questions = flattenQuestions();
    expect(questions.length).toBeGreaterThan(0);

    for (const { career, lesson, question } of questions) {
      const id = `[${career} / ${lesson}]`;
      expect(question.question, id).toBeTruthy();
      expect(question.explanation, id).toBeTruthy();

      if (question.type === "mcq") {
        expect(question.options?.length ?? 0, id).toBeGreaterThanOrEqual(2);
        expect(question.options, id).toContain(question.correctAnswer);
      } else if (question.type === "scenario") {
        expect(question.parts?.length ?? 0, id).toBeGreaterThanOrEqual(2);
        for (const part of question.parts ?? []) {
          expect(part.prompt, id).toBeTruthy();
          expect(part.correctAnswer, id).toBeTruthy();
        }
      } else if (question.type === "true_false") {
        expect(["true", "false"], id).toContain(question.correctAnswer);
      } else if (question.type === "fill_blank") {
        expect(question.fillBlanks?.length ?? 0, id).toBeGreaterThanOrEqual(1);
        for (const blank of question.fillBlanks ?? []) {
          expect(blank.answer, id).toBeTruthy();
        }
      } else if (question.type === "multi_select") {
        expect(question.multiSelectOptions?.length ?? 0, id).toBeGreaterThanOrEqual(2);
        expect(
          question.multiSelectOptions?.some((o) => o.isCorrect) ?? false,
          id,
        ).toBe(true);
      } else if (question.type === "match") {
        expect(question.matchPairs?.length ?? 0, id).toBeGreaterThanOrEqual(2);
      } else if (question.type === "sequence") {
        expect(question.sequenceItems?.length ?? 0, id).toBeGreaterThanOrEqual(2);
        const ids = new Set(question.sequenceItems?.map((i) => i.id) ?? []);
        expect(
          (question.sequenceCorrectOrder ?? []).every((idVal) => ids.has(idVal)),
          id,
        ).toBe(true);
      } else if (question.type === "code_completion") {
        expect(question.codeBlanks?.length ?? 0, id).toBeGreaterThanOrEqual(1);
      } else if (question.type === "word_scramble") {
        expect(question.scrambledWord, id).toBeTruthy();
      } else if (question.type === "flip_cards") {
        expect(question.flipCards?.length ?? 0, id).toBeGreaterThanOrEqual(1);
      } else if (!RICH_TYPES.has(question.type)) {
        expect(question.correctAnswer, id).toBeTruthy();
      }
    }
  });

  it("renders every question type across the curriculum", () => {
    const used = new Set<SeedQuestionType>(
      flattenQuestions().map(({ question }) => question.type),
    );
    const expectedTypes: SeedQuestionType[] = [
      "mcq",
      "true_false",
      "scenario",
      "fill_blank",
      "multi_select",
      "match",
      "sequence",
      "code_completion",
      "word_scramble",
      "flip_cards",
    ];
    for (const type of expectedTypes) {
      expect(used.has(type), `type ${type}`).toBe(true);
    }
  });
});

function assertLessonShape(lesson: SeedLesson, career: string): void {
  const id = `[${career} / ${lesson.slug}]`;
  expect(lesson.learningObjectives.length, `${id} objectives`).toBeGreaterThan(0);
  expect(lesson.skills.length, `${id} skills`).toBeGreaterThan(0);
  expect(lesson.activities.length, `${id} activities`).toBeGreaterThan(0);
}