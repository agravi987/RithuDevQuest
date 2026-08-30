export type QuestionType =
  | "mcq"
  | "true_false"
  | "command"
  | "scenario"
  | "fill_blank"
  | "multi_select"
  | "match"
  | "sequence"
  | "code_completion"
  | "word_scramble"
  | "flip_cards";

export type DefinedQuestionType = Exclude<QuestionType, "flip_cards">;

export const QUESTION_TYPES: readonly QuestionType[] = [
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
] as const;

export function isQuestionType(value: unknown): value is QuestionType {
  return (
    typeof value === "string" && (QUESTION_TYPES as readonly string[]).includes(value)
  );
}

export function parseQuestionType(value: unknown): QuestionType {
  return isQuestionType(value) ? value : "mcq";
}

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
 * Validate a *set* answer where multiple selections are acceptable in any
 * order (multi-select, match, fill-blank multi). The stored correct answer
 * is a pipe-joined string. The submitted answer may be pipe-joined too.
 */
export function validateSetAnswer(
  correctAnswer: string,
  answer: string,
): boolean {
  const expected = new Set(splitAcceptedAnswers(correctAnswer));
  const provided = answer
    .split(ANSWER_ALT_SEPARATOR)
    .map(normalizeAnswer)
    .filter((part) => part.length > 0);
  if (expected.size === 0) return false;
  if (provided.length !== expected.size) return false;
  return provided.every((part) => expected.has(part));
}

/**
 * Validate an ordered answer (sequence/ordering). Both the correct and
 * submitted answers are pipe-joined ordered tokens; order must match.
 */
export function validateOrderedAnswer(
  correctAnswer: string,
  answer: string,
): boolean {
  const expected = splitAcceptedAnswers(correctAnswer);
  const provided = answer
    .split(ANSWER_ALT_SEPARATOR)
    .map(normalizeAnswer)
    .filter((part) => part.length > 0);
  if (expected.length === 0 || provided.length !== expected.length) {
    return false;
  }
  return expected.every((part, index) => part === provided[index]);
}

/**
 * Validate an answer for any single-part question type. Scenario
 * questions validate per part instead (see `validateAcceptedAnswer`).
 */
export function validateQuestionAnswer(
  question: { type: QuestionType; correctAnswer: string },
  answer: string,
): boolean {
  switch (question.type) {
    case "multi_select":
    case "match":
    case "fill_blank":
    case "code_completion":
    case "flip_cards":
      return validateSetAnswer(question.correctAnswer, answer);
    case "sequence":
      return validateOrderedAnswer(question.correctAnswer, answer);
    default:
      return validateAcceptedAnswer(question.correctAnswer, answer);
  }
}