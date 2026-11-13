import { z } from "zod";

export const generatedQuestionSchema = z
  .object({
    type: z.enum(["mcq", "true_false", "scenario"]),
    difficulty: z.enum(["beginner", "intermediate", "advanced"]),
    question: z.string().min(5, "Question prompt must be at least 5 characters"),
    options: z.array(z.string().min(1)).optional().nullable(),
    parts: z
      .array(
        z.object({
          prompt: z.string().min(3),
          correctAnswer: z.string().min(1),
        }),
      )
      .optional()
      .nullable(),
    correctAnswer: z.string().min(1, "Correct answer is required"),
    explanation: z.string().min(10, "Explanation must be at least 10 characters"),
    hint: z.string().optional().nullable(),
  })
  .superRefine((data, ctx) => {
    if (data.type === "mcq") {
      if (!data.options || data.options.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "MCQ questions must provide at least 2 options",
          path: ["options"],
        });
      } else if (!data.options.includes(data.correctAnswer)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Correct answer for MCQ must be one of the provided options",
          path: ["correctAnswer"],
        });
      }
    }

    if (data.type === "true_false") {
      const normalized = data.correctAnswer.toLowerCase().trim();
      if (normalized !== "true" && normalized !== "false") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'True/False questions must have "true" or "false" as the correctAnswer',
          path: ["correctAnswer"],
        });
      }
    }

    if (data.type === "scenario") {
      if (!data.parts || data.parts.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Scenario questions must have at least 2 parts",
          path: ["parts"],
        });
      }
    }
  });

export const generatedQuestionsBatchSchema = z.object({
  questions: z.array(generatedQuestionSchema).min(1, "At least 1 question must be generated"),
});

export type GeneratedQuestion = z.infer<typeof generatedQuestionSchema>;
export type GeneratedQuestionsBatch = z.infer<typeof generatedQuestionsBatchSchema>;
