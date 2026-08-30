import type {
  SeedCodeBlank,
  SeedFillBlank,
  SeedFlipCard,
  SeedMatchPair,
  SeedMultiSelectOption,
  SeedQuestion,
  SeedSequenceItem,
} from "@/lib/curriculum/seed";
import type { QuestionType } from "@/lib/quiz/validation";
import { ANSWER_ALT_SEPARATOR } from "@/lib/quiz/validation";

export type QuestionTypeLabel = {
  label: string;
  color: string;
};

export const QUESTION_TYPE_META: Record<QuestionType, QuestionTypeLabel> = {
  mcq: { label: "Multiple Choice", color: "bg-primary/10 text-primary" },
  true_false: { label: "True or False", color: "bg-level/10 text-level" },
  command: { label: "Type a Command", color: "bg-xp/10 text-xp" },
  scenario: { label: "Scenario", color: "bg-achievement/10 text-achievement" },
  fill_blank: { label: "Fill in the Blank", color: "bg-level/10 text-level" },
  multi_select: { label: "Select All", color: "bg-primary/10 text-primary" },
  match: { label: "Match the Following", color: "bg-xp/10 text-xp" },
  sequence: { label: "Order the Steps", color: "bg-achievement/10 text-achievement" },
  code_completion: { label: "Complete the Code", color: "bg-xp/10 text-xp" },
  word_scramble: { label: "Unscramble", color: "bg-primary/10 text-primary" },
  flip_cards: { label: "Flip Cards", color: "bg-level/10 text-level" },
};

/**
 * Encode a rich question's structured payload into the Prisma `options`
 * and `parts` JSON columns, plus a JSON-encodable `correctAnswer`.
 *
 * Returns a normalized seed question with:
 * - `options`: JSON for rich types, `undefined` for classic types
 * - `parts`: JSON for rich types, `undefined` for classic types
 * - `correctAnswer`: a pipe-joined stable key string for validation
 */
export function encodeRichQuestion(
  question: SeedQuestion,
): {
  options?: unknown;
  parts?: unknown;
  correctAnswer: string;
} {
  switch (question.type) {
    case "fill_blank": {
      const blanks = question.fillBlanks ?? [];
      return {
        options: blanks,
        correctAnswer: blanks
          .map((blank) => blank.answer)
          .join(ANSWER_ALT_SEPARATOR),
      };
    }
    case "multi_select": {
      const opts = question.multiSelectOptions ?? [];
      return {
        options: opts,
        correctAnswer: opts
          .filter((option) => option.isCorrect)
          .map((option) => option.text)
          .join(ANSWER_ALT_SEPARATOR),
      };
    }
    case "match": {
      const pairs = question.matchPairs ?? [];
      return {
        options: pairs.map((pair) => ({ left: pair.left, right: pair.right })),
        correctAnswer: pairs
          .map((pair) => pair.right)
          .join(ANSWER_ALT_SEPARATOR),
      };
    }
    case "sequence": {
      const items = question.sequenceItems ?? [];
      return {
        options: items,
        parts: (question.sequenceCorrectOrder ?? items.map((item) => item.id)),
        correctAnswer: (question.sequenceCorrectOrder ?? items.map((item) => item.id)).join(
          ANSWER_ALT_SEPARATOR,
        ),
      };
    }
    case "code_completion": {
      const blanks = question.codeBlanks ?? [];
      const blankOptions = blanks.map((blank, index) =>
        index === 0 && question.codeLanguage
          ? { ...blank, language: question.codeLanguage }
          : blank,
      );
      return {
        options: blankOptions,
        correctAnswer: blanks
          .map((blank) => blank.answer)
          .join(ANSWER_ALT_SEPARATOR),
      };
    }
    case "word_scramble": {
      // Letters are rendered lowercase, so normalize the stored answer.
      const word = question.scrambledWord?.toLowerCase() ?? "";
      return {
        options: [{ word: question.scrambledWord ?? "" }],
        correctAnswer: word,
      };
    }
    case "flip_cards": {
      const cards = question.flipCards ?? [];
      return {
        options: cards,
        correctAnswer: cards.map((card) => card.back).join(ANSWER_ALT_SEPARATOR),
      };
    }
    default:
      return {
        options: question.options,
        parts: question.parts,
        correctAnswer:
          question.correctAnswer ??
          (question.parts?.map((part) => part.correctAnswer).join(ANSWER_ALT_SEPARATOR) ??
            "true"),
      };
  }
}

// Re-export commonly used rich payload types so consumers import from one spot.
export type {
  SeedCodeBlank,
  SeedFillBlank,
  SeedFlipCard,
  SeedMatchPair,
  SeedMultiSelectOption,
  SeedSequenceItem,
};

type QuestionLike = {
  type: string;
  options: unknown;
  parts: unknown;
};

type RichPayload = NonNullable<
  import("@/lib/lesson/types").LessonQuestionData["payload"]
>;

type FillBlankOption = { answer: string; hint?: string | null };
type MultiSelectOption = { text: string; isCorrect: boolean };
type MatchOption = { left: string; right: string };
type SequenceOption = { id: string; text: string };
type CodeBlankOption = {
  id: string;
  answer: string;
  hint?: string | null;
  placeholder?: string | null;
  language?: string | null;
};
type ScrambleOption = { word?: string };
type FlipCardOption = { front: string; back: string; category?: string | null };

function toJsonArray(value: unknown): unknown[] | null {
  return Array.isArray(value) ? value : null;
}

/**
 * Extract the renderer payload for a rich question from the raw Prisma
 * JSON columns (`options` / `parts`). Returns `null` for classic types.
 */
export function buildRichPayload(question: QuestionLike): {
  options?: unknown;
  payload?: RichPayload;
} | null {
  switch (question.type) {
    case "fill_blank":
      return {
        options: question.options,
        payload: {
          fillBlanks: (toJsonArray(question.options) ?? []) as FillBlankOption[],
        },
      };
    case "multi_select":
      return {
        options: question.options,
        payload: {
          multiSelect: (toJsonArray(question.options) ?? []) as MultiSelectOption[],
        },
      };
    case "match":
      return {
        options: question.options,
        payload: {
          match: (toJsonArray(question.options) ?? []) as MatchOption[],
        },
      };
    case "sequence":
      return {
        options: question.options,
        payload: {
          sequenceItems: (toJsonArray(question.options) ?? []) as SequenceOption[],
          sequenceCorrectOrder: toJsonArray(question.parts) as string[] | undefined,
        },
      };
    case "code_completion": {
      const blanks = (toJsonArray(question.options) ?? []) as CodeBlankOption[];
      const language = (toJsonArray(question.options)?.[0] as CodeBlankOption | undefined)?.language ?? null;
      return {
        options: question.options,
        payload: {
          codeBlanks: blanks.map((blank) => ({
            id: blank.id,
            answer: blank.answer,
            hint: blank.hint,
            placeholder: blank.placeholder,
          })),
          codeLanguage: language,
        },
      };
    }
    case "word_scramble": {
      const opts = (toJsonArray(question.options) ?? []) as ScrambleOption[];
      return {
        options: question.options,
        payload: { scrambledWord: opts[0]?.word },
      };
    }
    case "flip_cards":
      return {
        options: question.options,
        payload: {
          flipCards: (toJsonArray(question.options) ?? []) as FlipCardOption[],
        },
      };
    default:
      return null;
  }
}