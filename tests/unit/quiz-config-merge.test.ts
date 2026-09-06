import { describe, expect, it } from "vitest";

import { deepMerge, QUIZ_MODE_PRESETS } from "@/components/quiz/types";

describe("deepMerge", () => {
  it("returns an equal but independent object when only an empty override is given", () => {
    const merged = deepMerge(QUIZ_MODE_PRESETS.daily, {});
    expect(merged).toEqual(QUIZ_MODE_PRESETS.daily);
    expect(merged).not.toBe(QUIZ_MODE_PRESETS.daily);
  });

  it("recursively merges a nested partial while preserving sibling fields", () => {
    const merged = deepMerge(QUIZ_MODE_PRESETS.daily, {
      timer: { durationMs: 5 * 60 * 1000 },
    });
    expect(merged.timer.durationMs).toBe(5 * 60 * 1000);
    expect(merged.timer.enabled).toBe(true);
    expect(merged.timer.autoSubmit).toBe(true);
    expect(merged.timer.warningThreshold).toBe(0.3);
    expect(merged.timer.showMilliseconds).toBe(false);
  });

  it("keeps untouched top-level sections identical to the preset", () => {
    const merged = deepMerge(QUIZ_MODE_PRESETS.daily, {
      feedback: { allowRetry: false },
    });
    expect(merged.feedback.allowRetry).toBe(false);
    expect(merged.feedback.showHint).toBe(true);
    expect(merged.feedback.showExplanation).toBe(true);
    expect(merged.navigation).toEqual(QUIZ_MODE_PRESETS.daily.navigation);
    expect(merged.completion).toEqual(QUIZ_MODE_PRESETS.daily.completion);
  });

  it("overrides scalars at any depth", () => {
    const merged = deepMerge(QUIZ_MODE_PRESETS.daily, {
      theme: { variant: "practice" },
      scoring: { xpPerCorrect: 25 },
    });
    expect(merged.theme.variant).toBe("practice");
    expect(merged.theme.backgroundClass).toBe(QUIZ_MODE_PRESETS.daily.theme.backgroundClass);
    expect(merged.scoring.xpPerCorrect).toBe(25);
    expect(merged.scoring.xpPerIncorrect).toBe(0);
  });

  it("does not clobber a target value with an explicit undefined override", () => {
    const merged = deepMerge({ mode: "lesson", title: "A" }, { mode: undefined, title: "B" });
    expect(merged.mode).toBe("lesson");
    expect(merged.title).toBe("B");
  });

  it("treats arrays as opaque values and replaces them wholesale", () => {
    const merged = deepMerge({ list: [{ n: 1 }], other: "keep" }, { list: [{ n: 2 }, { n: 3 }] });
    expect(merged.list).toEqual([{ n: 2 }, { n: 3 }]);
    expect(merged.other).toBe("keep");
  });

  it("does not mutate the source preset", () => {
    const before = JSON.stringify(QUIZ_MODE_PRESETS.daily.timer);
    deepMerge(QUIZ_MODE_PRESETS.daily, { timer: { durationMs: 1 } });
    expect(JSON.stringify(QUIZ_MODE_PRESETS.daily.timer)).toBe(before);
  });
});