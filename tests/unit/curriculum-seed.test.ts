import { describe, expect, it } from "vitest";

import { devopsCareer } from "@content/curriculum/devops";
import { activityTypeOf } from "@/lib/curriculum/seed";

const RICH_TYPES = new Set([
  "fill_blank",
  "multi_select",
  "match",
  "sequence",
  "code_completion",
  "word_scramble",
  "flip_cards",
]);

describe("Curriculum seed content", () => {
  it("assembles a devops career with four paths", () => {
    expect(devopsCareer.title).toBe("DevOps Engineering");
    expect(devopsCareer.slug).toBe("devops");
    expect(devopsCareer.paths.map((p) => p.slug)).toEqual([
      "linux",
      "git",
      "docker",
      "kubernetes",
    ]);
  });

  it("has modules, units, and lessons in every path", () => {
    for (const path of devopsCareer.paths) {
      expect(path.modules.length, `${path.slug} modules`).toBeGreaterThan(0);
      for (const mod of path.modules) {
        expect(mod.units.length, `${mod.slug} units`).toBeGreaterThan(0);
        for (const unit of mod.units) {
          expect(unit.lessons.length, `${unit.slug} lessons`).toBeGreaterThan(
            0,
          );
        }
      }
    }
  });

  it("gives every lesson objectives, skills, and activities", () => {
    for (const path of devopsCareer.paths) {
      for (const mod of path.modules) {
        for (const unit of mod.units) {
          for (const lesson of unit.lessons) {
            expect(
              lesson.learningObjectives.length,
              `${lesson.slug} objectives`,
            ).toBeGreaterThan(0);
            expect(lesson.skills.length, `${lesson.slug} skills`).toBeGreaterThan(
              0,
            );
            expect(
              lesson.activities.length,
              `${lesson.slug} activities`,
            ).toBeGreaterThan(0);
          }
        }
      }
    }
  });

  it("uses unique slugs within each scope", () => {
    for (const path of devopsCareer.paths) {
      expect(
        new Set(path.modules.map((m) => m.slug)).size,
        `${path.slug} module slugs`,
      ).toBe(path.modules.length);
      for (const mod of path.modules) {
        expect(
          new Set(mod.units.map((u) => u.slug)).size,
          `${mod.slug} unit slugs`,
        ).toBe(mod.units.length);
        for (const unit of mod.units) {
          expect(
            new Set(unit.lessons.map((l) => l.slug)).size,
            `${unit.slug} lesson slugs`,
          ).toBe(unit.lessons.length);
        }
      }
    }
  });

  it("derives a DB activity type from content", () => {
    expect(activityTypeOf({ body: "text" })).toBe("learn");
    expect(activityTypeOf({ body: "text", code: "ls" })).toBe("example");
  });

  it("gives every lesson questions a valid shape when present", () => {
    const questions = devopsCareer.paths.flatMap((path) =>
      path.modules.flatMap((mod) =>
        mod.units.flatMap((unit) =>
          unit.lessons.flatMap((lesson) =>
            (lesson.questions ?? []).map((question) => ({
              lesson: lesson.slug,
              ...question,
            })),
          ),
        ),
      ),
    );

    expect(questions.length).toBeGreaterThan(0);

    for (const question of questions) {
      expect(question.question, question.lesson).toBeTruthy();
      expect(question.explanation, question.lesson).toBeTruthy();
      if (question.type === "scenario") {
        expect(question.parts?.length ?? 0, question.lesson).toBeGreaterThanOrEqual(2);
        for (const part of question.parts ?? []) {
          expect(part.prompt, question.lesson).toBeTruthy();
          expect(part.correctAnswer, question.lesson).toBeTruthy();
        }
      } else if (!RICH_TYPES.has(question.type)) {
        expect(question.correctAnswer, question.lesson).toBeTruthy();
      }
      if (question.type === "mcq") {
        expect(question.options?.length ?? 0, question.lesson).toBeGreaterThanOrEqual(2);
        expect(question.options, question.lesson).toContain(
          question.correctAnswer,
        );
      }
      if (question.type === "fill_blank") {
        expect(question.fillBlanks?.length ?? 0, question.lesson).toBeGreaterThanOrEqual(1);
      }
      if (question.type === "multi_select") {
        expect(question.multiSelectOptions?.length ?? 0, question.lesson).toBeGreaterThanOrEqual(2);
        expect(
          question.multiSelectOptions?.some((option) => option.isCorrect) ?? false,
          question.lesson,
        ).toBe(true);
      }
      if (question.type === "match") {
        expect(question.matchPairs?.length ?? 0, question.lesson).toBeGreaterThanOrEqual(2);
      }
      if (question.type === "sequence") {
        expect(question.sequenceItems?.length ?? 0, question.lesson).toBeGreaterThanOrEqual(2);
        const ids = new Set(question.sequenceItems?.map((item) => item.id) ?? []);
        expect(
          (question.sequenceCorrectOrder ?? []).every((id) => ids.has(id)),
          question.lesson,
        ).toBe(true);
      }
      if (question.type === "code_completion") {
        expect(question.codeBlanks?.length ?? 0, question.lesson).toBeGreaterThanOrEqual(1);
      }
      if (question.type === "word_scramble") {
        expect(question.scrambledWord, question.lesson).toBeTruthy();
      }
    }
  });

  it("has a question bank of six or more per Linux shell-basics lesson", () => {
    const linux = devopsCareer.paths.find((path) => path.slug === "linux");
    const shellBasics = linux?.modules.find(
      (mod) => mod.slug === "shell-basics",
    );

    expect(shellBasics).toBeDefined();
    for (const unit of shellBasics!.units) {
      for (const lesson of unit.lessons) {
        expect(lesson.questions?.length ?? 0, lesson.slug).toBeGreaterThanOrEqual(6);
        const types = new Set(lesson.questions?.map((question) => question.type));
        expect(types.has("scenario"), `${lesson.slug} scenario`).toBe(true);
        expect(types.has("command"), `${lesson.slug} command`).toBe(true);
      }
    }
  });
});