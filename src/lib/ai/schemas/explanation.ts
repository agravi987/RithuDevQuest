import { z } from "zod";

export const explanationRequestSchema = z.object({
  topic: z.string().min(2, "Topic is required"),
  question: z.string().min(5, "Question prompt is required"),
  userAnswer: z.string().min(1, "User answer is required"),
  correctAnswer: z.string().min(1, "Correct answer is required"),
  context: z.string().optional(),
});

export const explanationResponseSchema = z.object({
  concept: z.string().min(2, "Concept name is required"),
  summary: z.string().min(10, "Summary explanation is required"),
  whyIncorrect: z.string().min(10, "Why the user's answer was incorrect"),
  whyCorrect: z.string().min(10, "Why the correct answer is right"),
  commonMistakes: z.array(z.string()).default([]),
  keyTakeaway: z.string().min(5, "Key takeaway is required"),
});

export type ExplanationRequest = z.infer<typeof explanationRequestSchema>;
export type ExplanationResponse = z.infer<typeof explanationResponseSchema>;
