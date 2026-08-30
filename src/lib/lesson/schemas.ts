import { z } from "zod";

export const submitAnswerSchema = z.object({
  lessonId: z.string().min(1).max(100),
  questionId: z.string().min(1).max(100),
  answer: z.string().trim().min(1).max(2000),
  partIndex: z.number().int().min(0).max(9).optional(),
});

export const completeLessonSchema = z.object({
  lessonId: z.string().min(1).max(100),
  /** The question ids selected for this run, used as the score denominator. */
  questionIds: z.array(z.string().min(1).max(100)).max(50).default([]),
});

export type SubmitAnswerInput = z.infer<typeof submitAnswerSchema>;
export type CompleteLessonInput = z.infer<typeof completeLessonSchema>;