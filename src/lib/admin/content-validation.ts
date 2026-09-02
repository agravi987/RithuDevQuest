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

export const questionTypeSchema = z.enum([
  "mcq",
  "true_false",
  "command",
  "scenario",
]);

export const questionDifficultySchema = z.enum([
  "beginner",
  "intermediate",
  "advanced",
]);

export const scenarioPartSchema = z.object({
  prompt: z.string().trim().min(1),
  correctAnswer: z.string().trim().min(1),
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

export const questionInputSchema = z.object({
  type: questionTypeSchema,
  difficulty: questionDifficultySchema,
  question: z.string().trim().min(1, "Question is required"),
  correctAnswer: z.string().trim().min(1, "Correct answer is required"),
  explanation: z.string().trim().min(1, "Explanation is required"),
  hint: z.string().trim().optional(),
  options: z.array(z.string()).optional(),
  parts: z.array(scenarioPartSchema).optional(),
  source: z.string().trim().default("curriculum"),
});

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
