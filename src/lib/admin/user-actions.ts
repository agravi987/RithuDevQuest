"use server";

import "server-only";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/admin/auth";
import { prisma } from "@/lib/db";
import {
  resetHeartsInputSchema,
  setUserBanSchema,
  setUserRoleSchema,
} from "@/lib/admin/validation";

export type UserActionResult = { error?: string };

export async function setUserRoleAction(
  _prev: UserActionResult,
  formData: FormData,
): Promise<UserActionResult> {
  try {
    const admin = await requireAdmin();
    const parsed = setUserRoleSchema.safeParse({
      userId: formData.get("userId"),
      role: formData.get("role"),
    });

    if (!parsed.success) {
      return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
    }

    const target = await prisma.user.findUnique({
      where: { id: parsed.data.userId },
      select: { id: true },
    });
    if (!target) return { error: "User not found." };
    if (target.id === admin.userId && parsed.data.role !== "admin") {
      return { error: "You cannot remove your own admin role." };
    }

    await prisma.user.update({
      where: { id: parsed.data.userId },
      data: { role: parsed.data.role },
    });

    revalidatePath(`/admin/users/${parsed.data.userId}`);
    revalidatePath("/admin/users");
    return {};
  } catch (err) {
    if (err instanceof Error) {
      return { error: err.message };
    }
    throw err;
  }
}

export async function setUserBanAction(
  _prev: UserActionResult,
  formData: FormData,
): Promise<UserActionResult> {
  try {
    const admin = await requireAdmin();
    const parsed = setUserBanSchema.safeParse({
      userId: formData.get("userId"),
      bannedAt: formData.get("bannedAt") === "true",
    });

    if (!parsed.success) {
      return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
    }

    if (parsed.data.userId === admin.userId) {
      return { error: "You cannot ban your own account." };
    }

    await prisma.user.update({
      where: { id: parsed.data.userId },
      data: {
        bannedAt: parsed.data.bannedAt ? new Date() : null,
      },
    });

    revalidatePath(`/admin/users/${parsed.data.userId}`);
    revalidatePath("/admin/users");
    return {};
  } catch (err) {
    if (err instanceof Error) {
      return { error: err.message };
    }
    throw err;
  }
}

export async function resetHeartsAction(
  _prev: UserActionResult,
  formData: FormData,
): Promise<UserActionResult> {
  try {
    await requireAdmin();
    const parsed = resetHeartsInputSchema.safeParse({
      userId: formData.get("userId"),
    });

    if (!parsed.success) {
      return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
    }

    await prisma.user.update({
      where: { id: parsed.data.userId },
      data: { hearts: 5, heartsResetAt: null },
    });

    revalidatePath(`/admin/users/${parsed.data.userId}`);
    revalidatePath("/admin/users");
    return {};
  } catch (err) {
    if (err instanceof Error) {
      return { error: err.message };
    }
    throw err;
  }
}
