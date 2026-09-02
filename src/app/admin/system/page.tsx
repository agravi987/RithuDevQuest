import type { Metadata } from "next";

import { requireAdmin } from "@/lib/admin/auth";
import { getSystemStats } from "@/lib/admin/system";
import { GROQ_DEFAULT_MODEL, GROQ_FAST_MODEL } from "@/lib/ai/groq";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "System",
};

function StatRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between border-b border-border/40 py-2 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold">{value}</span>
    </div>
  );
}

function HealthRow({ label, ok }: { label: string; ok: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-border/40 py-2 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <Badge variant={ok ? "default" : "destructive"}>
        {ok ? "Configured" : "Missing"}
      </Badge>
    </div>
  );
}

export default async function AdminSystemPage() {
  await requireAdmin();
  const stats = await getSystemStats();

  const services = {
    database: Boolean(process.env.DATABASE_URL),
    auth: Boolean(process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET),
    groq: Boolean(process.env.GROQ_API_KEY),
  };
  const isProduction = process.env.NODE_ENV === "production";

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight">System</h1>
        <p className="text-sm text-muted-foreground">
          Health and configuration overview.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Services</CardTitle>
            <CardDescription>Integration status</CardDescription>
          </CardHeader>
          <CardContent>
            <HealthRow label="Database (PostgreSQL)" ok={services.database} />
            <HealthRow label="Auth secret" ok={services.auth} />
            <HealthRow label="Groq API key" ok={services.groq} />
            <div className="flex items-center justify-between gap-3 border-b border-border/40 py-2 last:border-0">
              <span className="text-sm text-muted-foreground shrink-0">
                Default model
              </span>
              <span className="text-sm font-mono font-semibold min-w-0 truncate text-right">
                {GROQ_DEFAULT_MODEL}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3 py-2">
              <span className="text-sm text-muted-foreground shrink-0">Fast model</span>
              <span className="text-sm font-mono font-semibold min-w-0 truncate text-right">
                {GROQ_FAST_MODEL}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Environment</CardTitle>
            <CardDescription>Runtime settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between border-b border-border/40 py-2 last:border-0">
              <span className="text-sm text-muted-foreground">Mode</span>
              <Badge variant="secondary">{isProduction ? "production" : "development"}</Badge>
            </div>
            <HealthRow
              label="AI rate limiting"
              ok={process.env.RATE_LIMIT_ENABLED !== "false"}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Content</CardTitle>
            <CardDescription>Learning content inventory</CardDescription>
          </CardHeader>
          <CardContent>
            <StatRow label="Careers" value={stats.careers} />
            <StatRow label="Paths" value={stats.paths} />
            <StatRow label="Modules" value={stats.modules} />
            <StatRow label="Units" value={stats.units} />
            <StatRow label="Lessons" value={stats.lessons} />
            <StatRow label="Activities" value={stats.activities} />
            <StatRow label="Questions" value={stats.questions} />
            <StatRow label="Achievements" value={stats.achievements} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Activity</CardTitle>
            <CardDescription>Engagement volume</CardDescription>
          </CardHeader>
          <CardContent>
            <StatRow label="Registered users" value={stats.users} />
            <StatRow label="Lesson attempts" value={stats.lessonAttempts} />
            <StatRow label="Question attempts" value={stats.questionAttempts} />
            <StatRow label="Practice sessions" value={stats.practiceSessions} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
