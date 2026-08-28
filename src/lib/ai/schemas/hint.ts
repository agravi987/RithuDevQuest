import { z } from "zod";

export const hintRequestSchema = z.object({
  topic: z.string().min(2, "Topic is required"),
  question: z.string().min(5, "Question prompt is required"),
  attemptNumber: z.number().int().min(1).default(1),
  context: z.string().optional(),
});

export const hintResponseSchema = z.object({
  hint: z.string().min(5, "Hint is required"),
  subtleClue: z.string().min(5, "Subtle clue is required"),
});

export type HintRequest = z.infer<typeof hintRequestSchema>;
export type HintResponse = z.infer<typeof hintResponseSchema>;
