import { z } from "zod";

export const interviewQuestionSchema = z.object({
  question: z
    .string()
    .min(10, "Interview question must be at least 10 characters long"),
});

export const interviewGradeSchema = z.object({
  score: z
    .number()
    .int()
    .min(0, "Score must be between 0 and 100")
    .max(100, "Score must be between 0 and 100"),
  feedback: z
    .string()
    .min(10, "Feedback must be at least 10 characters long"),
  tips: z
    .string()
    .min(5, "Tips must be at least 5 characters long")
    .optional()
    .nullable(),
  idealAnswer: z
    .string()
    .min(10, "Ideal answer must be at least 10 characters long")
    .optional()
    .nullable(),
  followUpQuestion: z
    .string()
    .min(10, "Follow-up question must be at least 10 characters long")
    .optional()
    .nullable(),
});

export const interviewSummarySchema = z.object({
  overall: z
    .number()
    .int()
    .min(0, "Overall score must be between 0 and 100")
    .max(100, "Overall score must be between 0 and 100"),
  summary: z
    .string()
    .min(10, "Summary must be at least 10 characters long"),
  strengths: z
    .array(z.string().min(2))
    .max(10, "Maximum 10 strengths allowed"),
  improvements: z
    .array(z.string().min(2))
    .max(10, "Maximum 10 improvements allowed"),
});

export type InterviewQuestion = z.infer<typeof interviewQuestionSchema>;
export type InterviewGrade = z.infer<typeof interviewGradeSchema>;
export type InterviewSummary = z.infer<typeof interviewSummarySchema>;