import { z } from "zod";

export const mentorContextSchema = z.object({
  situation: z.enum([
    "greeting",
    "lesson_started",
    "wrong_answer",
    "streak_milestone",
    "level_up",
    "weak_skill",
    "lesson_completed",
  ]),
  userName: z.string().optional(),
  topic: z.string().optional(),
  currentStreak: z.number().int().nonnegative().optional(),
  userXp: z.number().int().nonnegative().optional(),
  level: z.number().int().positive().optional(),
  mistakeDetails: z.string().optional(),
  weakSkillName: z.string().optional(),
});

export const mentorResponseSchema = z.object({
  greeting: z.string().optional(),
  message: z.string().min(10, "Mentor message must be at least 10 characters"),
  tone: z.enum(["encouraging", "celebratory", "instructive", "supportive"]),
  actionableTip: z.string().optional().nullable(),
  suggestedAction: z
    .object({
      label: z.string(),
      href: z.string(),
    })
    .optional()
    .nullable(),
});

export type MentorContext = z.infer<typeof mentorContextSchema>;
export type MentorResponse = z.infer<typeof mentorResponseSchema>;
