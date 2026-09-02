import { z } from "zod";

export const userRoleSchema = z.enum(["user", "admin"]);

export const setUserRoleSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  role: userRoleSchema,
});

export const setUserBanSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  bannedAt: z.boolean(),
});

export const resetHeartsInputSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
});
