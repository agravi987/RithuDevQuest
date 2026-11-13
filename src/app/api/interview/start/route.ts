import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { checkRateLimit } from "@/lib/ai/rate-limiter";
import { startInterviewQuestion } from "@/lib/ai/generator";
import { getInterviewCareer } from "@/lib/curriculum/interview";

const bodySchema = z.object({
  careerId: z.string().min(1, "careerId is required"),
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const parsed = bodySchema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request body", details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const rateLimit = checkRateLimit(`interview:${session.user.id}`, 15, 60_000);
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: "Too many requests. Please slow down.", reset: rateLimit.reset },
        { status: 429 },
      );
    }

    const career = await prisma.career.findUnique({
      where: { id: parsed.data.careerId },
      select: { id: true, title: true, slug: true },
    });

    if (!career) {
      return NextResponse.json({ error: "Unknown career" }, { status: 404 });
    }

    const context = await getInterviewCareer(career.slug);
    const aiQuestion = await startInterviewQuestion({
      careerTitle: career.title,
      skillNames: context?.skillNames ?? [],
    });

    const interview = await prisma.interviewSession.create({
      data: {
        userId: session.user.id,
        careerId: career.id,
        totalRounds: 5,
        currentQuestion: aiQuestion.question,
      },
      select: { id: true, totalRounds: true },
    });

    return NextResponse.json({
      sessionId: interview.id,
      round: 1,
      totalRounds: interview.totalRounds,
      question: aiQuestion.question,
    });
  } catch (error) {
    console.error("[Interview Start API Error]", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to start interview" },
      { status: 500 },
    );
  }
}