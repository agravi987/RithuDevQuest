import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { generateHint } from "@/lib/ai/generator";
import { checkRateLimit } from "@/lib/ai/rate-limiter";
import { hintRequestSchema } from "@/lib/ai/schemas/hint";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rateLimit = checkRateLimit(`ai:hint:${session.user.id}`);
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

    const body = await request.json();
    const parsed = hintRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request data", details: parsed.error.format() },
        { status: 400 },
      );
    }

    const hint = await generateHint(parsed.data);

    return NextResponse.json(
      { hint },
      {
        headers: {
          "X-RateLimit-Limit": String(rateLimit.limit),
          "X-RateLimit-Remaining": String(rateLimit.remaining),
        },
      },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    console.error("[API hint Error]", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
