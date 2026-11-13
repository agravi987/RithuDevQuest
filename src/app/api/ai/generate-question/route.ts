import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { generateQuestions } from "@/lib/ai/generator";
import { checkRateLimit } from "@/lib/ai/rate-limiter";

const generateQuestionInputSchema = z.object({
  topic: z.string().min(2, "Topic is required"),
  subtopic: z.string().optional(),
  learningObjectives: z.array(z.string()).optional(),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]).optional(),
  questionType: z.enum(["mcq", "true_false", "scenario"]).optional(),
  count: z.number().int().min(1).max(5).default(1),
  lessonId: z.string().optional(),
  skillId: z.string().optional(),
  useCache: z.boolean().optional().default(true),
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 },
      );
    }

    const parsed = generateQuestionInputSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request data", details: parsed.error.format() },
        { status: 400 },
      );
    }

    const rateLimit = checkRateLimit(`ai:generate:${session.user.id}`);
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: "Too many AI requests. Please slow down." },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.reset),
            "X-RateLimit-Limit": String(rateLimit.limit),
            "X-RateLimit-Remaining": String(rateLimit.remaining),
          },
        },
      );
    }

    const questions = await generateQuestions(parsed.data);

    return NextResponse.json(
      { questions },
      {
        headers: {
          "X-RateLimit-Limit": String(rateLimit.limit),
          "X-RateLimit-Remaining": String(rateLimit.remaining),
        },
      },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    console.error("[API generate-question Error]", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
