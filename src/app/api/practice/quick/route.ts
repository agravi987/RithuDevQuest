import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { getQuickPracticeQuestions } from "@/lib/practice/queries";

const quickParams = z.object({
  topic: z.string().min(1).max(64).default("all"),
  count: z.coerce.number().int().min(5).max(20).default(12),
});

/* ─── GET: Sample question batch for quick practice ─── */

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = quickParams.safeParse(
    Object.fromEntries(request.nextUrl.searchParams),
  );
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
  }

  const { topic, count } = parsed.data;
  const questions = await getQuickPracticeQuestions(topic, count);

  if (questions.length === 0) {
    return NextResponse.json({
      success: false,
      error: "No questions available for this topic yet. Try another topic!",
    });
  }

  return NextResponse.json({ success: true, questions });
}