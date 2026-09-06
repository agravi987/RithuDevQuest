import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { getInterviewHistory } from "@/lib/curriculum/interview";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const history = await getInterviewHistory(session.user.id, 5);

  return NextResponse.json({ sessions: history });
}