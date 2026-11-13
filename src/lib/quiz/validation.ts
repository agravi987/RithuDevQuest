export type QuestionType =
  | "mcq"
  | "true_false"
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
 * Clean a string for resilient, human-tolerant answer comparison.
 * Strips code backticks, markdown markers, quotes, and collapses whitespace.
 */
export function cleanForComparison(str: string): string {
  return (str || "")
    .trim()
    .replace(/^[`"']+|[`"']+$/g, "")
    .replace(/[`]/g, "")
    .replace(/\s+/g, " ")
    .toLowerCase();
}

/**
 * Validate an answer for any single-part question type. Scenario
 * questions validate per part instead (see `validateAcceptedAnswer`).
 */
export function validateQuestionAnswer(
  question: { type: QuestionType; correctAnswer: string; options?: unknown },
  answer: string,
): boolean {
  const normAns = cleanForComparison(answer);
  if (!normAns) return false;

  // Universal bypass tokens from rich interactive components
  if (question.type === "match" && (normAns === "all_matched" || normAns === "matched")) {
    return true;
  }
  if (
    question.type === "sequence" &&
    (normAns === "all_matched" || normAns === "sequence_correct")
  ) {
    return true;
  }
  if (
    question.type === "scenario" &&
    (normAns === "all_matched" || normAns === "scenario_correct" || normAns === "scenario_complete")
  ) {
    return true;
  }

  switch (question.type) {
    case "true_false": {
      const normCorrect = cleanForComparison(question.correctAnswer);
      const isCorrectTrue =
        normCorrect === "true" || normCorrect === "yes" || normCorrect === "1" || normCorrect === "t";
      const isCorrectFalse =
        normCorrect === "false" || normCorrect === "no" || normCorrect === "0" || normCorrect === "f";

      if (isCorrectTrue || isCorrectFalse) {
        const isAnsTrue =
          normAns === "true" || normAns === "yes" || normAns === "1" || normAns === "t";
        const isAnsFalse =
          normAns === "false" || normAns === "no" || normAns === "0" || normAns === "f";
        if (isCorrectTrue) return isAnsTrue;
        if (isCorrectFalse) return isAnsFalse;
      }
      return validateAcceptedAnswer(question.correctAnswer, answer);
    }
    case "mcq": {
      if (validateAcceptedAnswer(question.correctAnswer, answer)) {
        return true;
      }
      const accepted = splitAcceptedAnswers(question.correctAnswer).map(cleanForComparison);
      return accepted.includes(normAns);
    }
    case "multi_select": {
      // 1. Full set match (all required)
      if (validateSetAnswer(question.correctAnswer, answer)) {
        return true;
      }
      // 2. Option tolerance when single choice is selected from an adapted question
      if (Array.isArray(question.options)) {
        const matchingOpt = (question.options as Array<unknown>).find(
          (o) =>
            typeof o === "object" &&
            o !== null &&
            cleanForComparison((o as { text?: string }).text ?? "") === normAns,
        );
        if (matchingOpt && (matchingOpt as { isCorrect?: boolean }).isCorrect === true) {
          return true;
        }
      }
      return false;
    }
    case "fill_blank":
    case "code_completion": {
      // 1. Full set match (all blanks required)
      if (validateSetAnswer(question.correctAnswer, answer)) {
        return true;
      }
      // 2. Single-blank question with pipe-separated synonyms (e.g. "-L|--location")
      if (Array.isArray(question.options) && question.options.length <= 1) {
        const accepted = splitAcceptedAnswers(question.correctAnswer).map(cleanForComparison);
        if (accepted.includes(normAns)) {
          return true;
        }
      }
      // 3. Single-part submission for a multi-blank question: the compact
      // quiz renderer stages only the first blank, so accept an answer that
      // matches the first accepted blank (case/format tolerant).
      if (answer.split(ANSWER_ALT_SEPARATOR).filter((part) => part.trim()).length === 1) {
        const firstBlank = splitAcceptedAnswers(question.correctAnswer)[0];
        if (firstBlank !== undefined && cleanForComparison(firstBlank) === normAns) {
          return true;
        }
      }
      return false;
    }
    case "match": {
      if (validateSetAnswer(question.correctAnswer, answer)) {
        return true;
      }
      const accepted = splitAcceptedAnswers(question.correctAnswer).map(cleanForComparison);
      return accepted.includes(normAns);
    }
    case "sequence": {
      if (cleanForComparison(question.correctAnswer) === normAns) {
        return true;
      }
      if (validateOrderedAnswer(question.correctAnswer, answer)) {
        return true;
      }
      // Text-based ordered comparison: the client submits space- or
      // pipe-joined item texts; the server knows each item's text from
      // `options`. Compare the ordered texts against the ordered ids.
      if (Array.isArray(question.options)) {
        const items = question.options as Array<{ id?: string; text?: string }>;
        const textById = new Map(
          items.map((item) => [item.id, cleanForComparison(item.text ?? item.id ?? "")]),
        );
        const orderedIds = splitAcceptedAnswers(question.correctAnswer);
        const expectedTexts = orderedIds
          .map((id) => textById.get(cleanForComparison(id)))
          .filter((text): text is string => Boolean(text));
        if (expectedTexts.length > 0) {
          const expectedJoined = expectedTexts.join(" ");
          const providedBySpace = cleanForComparison(answer.replace(/\|/g, " "));
          const providedByPipe = cleanForComparison(answer)
            .split("|")
            .map(cleanForComparison)
            .join(" ");
          if (expectedJoined === providedBySpace || expectedJoined === providedByPipe) {
            return true;
          }
        }
      }
      const accepted = splitAcceptedAnswers(question.correctAnswer).map(cleanForComparison);
      return accepted.includes(normAns);
    }
    case "flip_cards": {
      if (validateSetAnswer(question.correctAnswer, answer)) {
        return true;
      }
      const accepted = splitAcceptedAnswers(question.correctAnswer).map(cleanForComparison);
      if (accepted.includes(normAns)) {
        return true;
      }
      if (Array.isArray(question.options)) {
        const matchingCard = (question.options as Array<unknown>).find(
          (c) =>
            typeof c === "object" &&
            c !== null &&
            (cleanForComparison((c as { front?: string }).front ?? "") === normAns ||
              cleanForComparison((c as { back?: string }).back ?? "") === normAns),
        );
        if (matchingCard) return true;
      }
      return false;
    }
    case "word_scramble": {
      const strippedAns = cleanForComparison(answer.replace(/\s+/g, ""));
      const strippedTarget = cleanForComparison(question.correctAnswer.replace(/\s+/g, ""));
      if (strippedAns === strippedTarget) {
        return true;
      }
      return validateAcceptedAnswer(question.correctAnswer, answer);
    }
    case "scenario": {
      // Whole-scenario evaluation: check if answer matches sequence or contains all part commands
      const acceptedParts = splitAcceptedAnswers(question.correctAnswer).map(cleanForComparison);
      const cleanedAnswer = cleanForComparison(answer);
      const joinedSequence = acceptedParts.join(" ");
      const joinedAnd = cleanForComparison(acceptedParts.join(" && "));
      const joinedSemi = cleanForComparison(acceptedParts.join("; "));

      if (
        cleanedAnswer === joinedSequence ||
        cleanedAnswer === joinedAnd ||
        cleanedAnswer === joinedSemi ||
        acceptedParts.includes(cleanedAnswer) ||
        (acceptedParts.length > 0 && acceptedParts.every((p) => cleanedAnswer.includes(p)))
      ) {
        return true;
      }
      return validateAcceptedAnswer(question.correctAnswer, answer);
    }
    default: {
      // Scenario parts and typed answers: exact normalized match first,
      // then a resilient cleaned comparison (case, quotes, backticks,
      // whitespace) so "Cloud Storage" and "cloud storage" both pass.
      if (validateAcceptedAnswer(question.correctAnswer, answer)) {
        return true;
      }      const accepted = splitAcceptedAnswers(question.correctAnswer).map(cleanForComparison);
      return accepted.includes(normAns);
    }
  }
}
