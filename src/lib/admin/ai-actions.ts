"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin/auth";

const idSchema = z.string().cuid();

export async function approveQuestionAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = idSchema.parse(formData.get("id"));
  await prisma.question.update({
    where: { id },
    data: { source: "curriculum" },
  });
  revalidatePath("/admin/ai");
  revalidatePath("/admin/content");
}

export async function deleteQuestionAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = idSchema.parse(formData.get("id"));
  await prisma.question.delete({ where: { id } });
  revalidatePath("/admin/ai");
  revalidatePath("/admin/content");
}
