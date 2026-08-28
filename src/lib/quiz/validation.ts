export type QuestionType = "mcq" | "true_false" | "command" | "scenario";

export type QuestionDifficulty = "beginner" | "intermediate" | "advanced";

export function parseQuestionDifficulty(value: string): QuestionDifficulty {
  if (value === "beginner" || value === "intermediate" || value === "advanced") {
    return value;
  }
  return "beginner";
}

/**
 * Separator used to list multiple acceptable answers for a question,
 * e.g. `"ls -la|ls -al"`.
 */
export const ANSWER_ALT_SEPARATOR = "|";

/**
 * Collapse surrounding whitespace and internal runs of whitespace so
 * `"  pwd "` and `"pwd"` are treated as the same command.
 */
export function normalizeAnswer(answer: string): string {
  return answer.trim().replace(/\s+/g, " ");
}

/**
 * Split a `correctAnswer` field into the list of accepted answers.
 * Falls back to the raw value when the separator yields nothing.
 */
export function splitAcceptedAnswers(correctAnswer: string): string[] {
  const parts = correctAnswer
    .split(ANSWER_ALT_SEPARATOR)
    .map(normalizeAnswer)
    .filter((part) => part.length > 0);
  return parts.length > 0 ? parts : [normalizeAnswer(correctAnswer)];
}

/**
 * Validate an answer against an accepted-answer string, ignoring
 * differences in surrounding or repeated whitespace.
 */
export function validateAcceptedAnswer(
  correctAnswer: string,
  answer: string,
): boolean {
  const normalized = normalizeAnswer(answer);
  return splitAcceptedAnswers(correctAnswer).includes(normalized);
}

/**
 * Validate an answer for any single-part question type. Scenario
 * questions validate per part instead (see `validateAcceptedAnswer`).
 */
export function validateQuestionAnswer(
  question: { type: QuestionType; correctAnswer: string },
  answer: string,
): boolean {
  return validateAcceptedAnswer(question.correctAnswer, answer);
}