import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { generateMentorResponse } from "@/lib/ai/generator";
import { checkRateLimit } from "@/lib/ai/rate-limiter";
import { mentorContextSchema } from "@/lib/ai/schemas/mentor";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rateLimit = checkRateLimit(`ai:mentor:${session.user.id}`);
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
    const parsed = mentorContextSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request data", details: parsed.error.format() },
        { status: 400 },
      );
    }

    const mentorResponse = await generateMentorResponse(parsed.data);

    return NextResponse.json(
      { response: mentorResponse },
      {
        headers: {
          "X-RateLimit-Limit": String(rateLimit.limit),
          "X-RateLimit-Remaining": String(rateLimit.remaining),
        },
      },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    console.error("[API mentor Error]", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
