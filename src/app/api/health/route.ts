import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const startTime = Date.now();
  const dbUrl = process.env.DATABASE_URL;

  let host = "not-configured";
  let pathname = "";
  const searchParams: Record<string, string> = {};

  if (dbUrl) {
    try {
      const parsed = new URL(dbUrl);
      host = parsed.host;
      pathname = parsed.pathname;
      parsed.searchParams.forEach((value, key) => {
        searchParams[key] = value;
      });
    } catch {
      host = "invalid-url-format";
    }
  }

  const isNeon =
    Boolean(dbUrl?.includes("neon.tech")) ||
    Boolean(dbUrl?.includes("neon.database")) ||
    process.env.DATABASE_ADAPTER === "neon";

  const diagnostics: {
    timestamp: string;
    environment: string | undefined;
    isVercel: boolean;
    vercelEnv: string;
    configChecks: {
      hasDatabaseUrl: boolean;
      hasAuthSecret: boolean;
      hasGroqApiKey: boolean;
      detectedAdapter: string;
      databaseHost: string;
      databaseName: string;
      urlParams: Record<string, string>;
    };
    database: {
      status: "connected" | "disconnected";
      latencyMs: number;
      ping: boolean;
      publicTables: string[];
      userCount: number;
      careerCount: number;
      questionCount: number;
      error: string | null;
      errorCode: string | null;
      recommendation: string | null;
    };
  } = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    isVercel: Boolean(process.env.VERCEL),
    vercelEnv: process.env.VERCEL_ENV || "local",
    configChecks: {
      hasDatabaseUrl: Boolean(dbUrl),
      hasAuthSecret: Boolean(process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET),
      hasGroqApiKey: Boolean(process.env.GROQ_API_KEY),
      detectedAdapter: isNeon ? "neon (@prisma/adapter-neon)" : "pg (@prisma/adapter-pg)",
      databaseHost: host,
      databaseName: pathname.replace(/^\//, ""),
      urlParams: searchParams,
    },
    database: {
      status: "disconnected",
      latencyMs: 0,
      ping: false,
      publicTables: [],
      userCount: 0,
      careerCount: 0,
      questionCount: 0,
      error: null,
      errorCode: null,
      recommendation: null,
    },
  };

  if (!dbUrl) {
    diagnostics.database.error = "DATABASE_URL is not set in environment variables.";
    diagnostics.database.recommendation = "Add DATABASE_URL to your Vercel Project Settings -> Environment Variables.";
    return NextResponse.json({ ok: false, diagnostics }, { status: 500 });
  }

  try {
    // 1. Raw ping query
    await prisma.$queryRaw`SELECT 1 as ping`;
    diagnostics.database.ping = true;

    // 2. Discover public tables (cast table_name to text for Prisma driver adapter compatibility)
    const tableRows = await prisma.$queryRaw<Array<{ table_name: string }>>`
      SELECT table_name::text as table_name FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `;
    const tables = tableRows.map((r) => r.table_name);
    diagnostics.database.publicTables = tables;

    // Check if tables are missing
    if (!tables.includes("User") && !tables.includes("user")) {
      diagnostics.database.status = "connected";
      diagnostics.database.latencyMs = Date.now() - startTime;
      diagnostics.database.recommendation =
        "Database is reachable, but tables have not been created yet. Run `npx prisma db push` to generate all tables in your Neon database.";
      return NextResponse.json({ ok: false, diagnostics }, { status: 200 });
    }

    // 3. Count records
    const [userCount, careerCount, questionCount] = await Promise.all([
      prisma.user.count().catch(() => -1),
      prisma.career.count().catch(() => -1),
      prisma.question.count().catch(() => -1),
    ]);

    diagnostics.database.status = "connected";
    diagnostics.database.latencyMs = Date.now() - startTime;
    diagnostics.database.userCount = userCount;
    diagnostics.database.careerCount = careerCount;
    diagnostics.database.questionCount = questionCount;

    if (careerCount === 0 || questionCount === 0) {
      diagnostics.database.recommendation =
        "Database tables exist, but no curriculum is seeded yet. Run `npx tsx prisma/seed.ts` to populate all learning paths, quests, and questions.";
    } else {
      diagnostics.database.recommendation = "All systems healthy!";
    }

    return NextResponse.json({ ok: true, diagnostics }, { status: 200 });
  } catch (err: unknown) {
    const errorObj = err as { message?: string; code?: string; name?: string };
    diagnostics.database.status = "disconnected";
    diagnostics.database.latencyMs = Date.now() - startTime;
    diagnostics.database.error = errorObj?.message || String(err);
    diagnostics.database.errorCode = errorObj?.code || errorObj?.name || "UNKNOWN_ERROR";

    if (diagnostics.database.errorCode === "ETIMEDOUT") {
      diagnostics.database.recommendation =
        "Connection timed out. Check that DATABASE_URL has `sslmode=require` and that your Neon project is not paused. If using a connection pooler URL, ensure @prisma/adapter-neon is active.";
    } else if (diagnostics.database.error?.includes("password authentication failed")) {
      diagnostics.database.recommendation =
        "Authentication failed. Check your database username and password in DATABASE_URL.";
    }

    return NextResponse.json({ ok: false, diagnostics }, { status: 500 });
  }
}
