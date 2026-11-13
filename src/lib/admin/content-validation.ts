import { z } from "zod";

export const activityTypeSchema = z.enum([
  "learn",
  "example",
  "question",
  "practice",
  "review",
]);

export const activitySchema = z.object({
  type: activityTypeSchema,
  title: z.string().trim().max(200).optional(),
  body: z.string().trim().min(1, "Activity body is required"),
  code: z.string().optional(),
});

export const questionDifficultySchema = z.enum([
  "beginner",
  "intermediate",
  "advanced",
]);

export const questionTypeSchema = z.enum([
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
]);

export const scenarioPartSchema = z.object({
  prompt: z.string().trim().min(1),
  correctAnswer: z.string().trim().min(1),
});

const fillBlankSchema = z.object({
  answer: z.string().trim().min(1),
  hint: z.string().trim().optional(),
});

const multiSelectOptionSchema = z.object({
  text: z.string().trim().min(1),
  isCorrect: z.boolean(),
});

const matchPairSchema = z.object({
  left: z.string().trim().min(1),
  right: z.string().trim().min(1),
});

const sequenceItemSchema = z.object({
  id: z.string().trim().min(1),
  text: z.string().trim().min(1),
});

const codeBlankSchema = z.object({
  id: z.string().trim().min(1),
  answer: z.string().trim().min(1),
  hint: z.string().trim().optional(),
  placeholder: z.string().trim().optional(),
});

const flipCardSchema = z.object({
  front: z.string().trim().min(1),
  back: z.string().trim().min(1),
  category: z.string().trim().optional(),
});

export const lessonInputSchema = z.object({
  title: z.string().trim().min(1, "Lesson title is required"),
  description: z.string().trim().optional(),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and dashes"),
  estimatedMinutes: z.coerce.number().int().min(1).max(600).default(5),
});

export const unitInputSchema = z.object({
  title: z.string().trim().min(1, "Unit title is required"),
  description: z.string().trim().optional(),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and dashes"),
});

export const moduleInputSchema = z.object({
  title: z.string().trim().min(1, "Module title is required"),
  description: z.string().trim().optional(),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and dashes"),
  icon: z.string().trim().optional(),
});

export const pathInputSchema = z.object({
  title: z.string().trim().min(1, "Path title is required"),
  description: z.string().trim().optional(),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and dashes"),
});

export const careerInputSchema = z.object({
  title: z.string().trim().min(1, "Career title is required"),
  description: z.string().trim().optional(),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and dashes"),
  order: z.coerce.number().int().default(0),
});

const questionCommonFields = {
  difficulty: questionDifficultySchema,
  question: z.string().trim().min(1, "Question is required"),
  explanation: z.string().trim().min(1, "Explanation is required"),
  hint: z.string().trim().optional(),
  source: z.string().trim().default("curriculum"),
};

export const questionInputSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("mcq"),
    ...questionCommonFields,
    options: z
      .array(z.string().trim().min(1))
      .min(2, "MCQ requires at least two options"),
    correctAnswer: z.string().trim().min(1, "Correct answer is required"),
  }),
  z.object({
    type: z.literal("true_false"),
    ...questionCommonFields,
    correctAnswer: z.enum(["true", "false"]),
  }),
  z.object({
    type: z.literal("scenario"),
    ...questionCommonFields,
    parts: z
      .array(scenarioPartSchema)
      .min(2, "Scenario requires at least two parts"),
  }),
  z.object({
    type: z.literal("fill_blank"),
    ...questionCommonFields,
    fillBlanks: z.array(fillBlankSchema).min(1, "Requires at least one blank"),
  }),
  z.object({
    type: z.literal("multi_select"),
    ...questionCommonFields,
    multiSelectOptions: z
      .array(multiSelectOptionSchema)
      .min(2, "Requires at least two options")
      .refine(
        (options) => options.some((option) => option.isCorrect),
        "At least one option must be correct",
      ),
  }),
  z.object({
    type: z.literal("match"),
    ...questionCommonFields,
    matchPairs: z
      .array(matchPairSchema)
      .min(2, "Requires at least two pairs"),
  }),
  z
    .object({
      type: z.literal("sequence"),
      ...questionCommonFields,
      sequenceItems: z
        .array(sequenceItemSchema)
        .min(2, "Requires at least two items"),
      sequenceCorrectOrder: z.array(z.string().trim().min(1)).optional(),
    })
    .superRefine((value, ctx) => {
      if (!value.sequenceCorrectOrder) return;
      const knownIds = new Set(value.sequenceItems.map((item) => item.id));
      for (const id of value.sequenceCorrectOrder) {
        if (!knownIds.has(id)) {
          ctx.addIssue({
            code: "custom",
            message: `Unknown sequence id: ${id}`,
          });
        }
      }
    }),
  z.object({
    type: z.literal("code_completion"),
    ...questionCommonFields,
    codeBlanks: z.array(codeBlankSchema).min(1, "Requires at least one blank"),
    codeLanguage: z.string().trim().optional(),
  }),
  z.object({
    type: z.literal("word_scramble"),
    ...questionCommonFields,
    scrambledWord: z.string().trim().min(1, "Scrambled word is required"),
  }),
  z.object({
    type: z.literal("flip_cards"),
    ...questionCommonFields,
    flipCards: z.array(flipCardSchema).min(1, "Requires at least one card"),
  }),
]);

export const adminQuestionTypeOptions: { value: string; label: string }[] = [
  { value: "mcq", label: "Multiple choice" },
  { value: "true_false", label: "True / False" },
  { value: "scenario", label: "Scenario" },
  { value: "fill_blank", label: "Fill in the blank" },
  { value: "multi_select", label: "Select all" },
  { value: "match", label: "Match the following" },
  { value: "sequence", label: "Order the steps" },
  { value: "code_completion", label: "Complete the code" },
  { value: "word_scramble", label: "Unscramble" },
  { value: "flip_cards", label: "Flip cards" },
];

export const achievementInputSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().min(1, "Description is required"),
  icon: z.string().trim().min(1, "Icon is required"),
  category: z.string().trim().min(1, "Category is required"),
  condition: z
    .string()
    .trim()
    .min(1, "Condition is required")
    .regex(/^[a-z0-9_]+$/, "Condition must be lowercase with underscores"),
  threshold: z.coerce.number().int().optional(),
  xpReward: z.coerce.number().int().min(0).default(50),
});
