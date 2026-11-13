import type { SeedQuestion } from "@/lib/curriculum/seed";

/**
 * Stable key identifying a question inside one lesson. Used to match seed
 * questions against existing rows so that unchanged questions keep their
 * database ID (and therefore their learner attempt history).
 */
export function questionMatchKey(type: string, question: string): string {
  return `${type}|${question}`;
}

export type ReseedExistingQuestion = {
  id: string;
  type: string;
  question: string;
};

export type QuestionReseedPlan = {
  /** Seed questions that already exist — update in place, preserving the id. */
  updates: { id: string; question: SeedQuestion }[];
  /** Seed questions with no matching row — insert as new. */
  creates: SeedQuestion[];
};

/**
 * Classify a lesson's seed questions into rows to update (matched by type +
 * question text, keeping the existing id) and rows to create. Questions that
 * exist in the database but not in the seed are intentionally left untouched,
 * so admin-added and AI-generated questions survive a reseed.
 */
export function planQuestionReseed(
  seedQuestions: SeedQuestion[],
  existingQuestions: ReseedExistingQuestion[],
): QuestionReseedPlan {
  const existingByKey = new Map(
    existingQuestions.map((q) => [questionMatchKey(q.type, q.question), q]),
  );

  const updates: QuestionReseedPlan["updates"] = [];
  const creates: QuestionReseedPlan["creates"] = [];
  const seen = new Set<string>();

  for (const seed of seedQuestions) {
    const key = questionMatchKey(seed.type, seed.question);
    if (seen.has(key)) {
      // Duplicate content in the seed is authored in, not matched — create it.
      creates.push(seed);
      continue;
    }
    seen.add(key);

    const existing = existingByKey.get(key);
    if (existing) {
      updates.push({ id: existing.id, question: seed });
    } else {
      creates.push(seed);
    }
  }

  return { updates, creates };
}