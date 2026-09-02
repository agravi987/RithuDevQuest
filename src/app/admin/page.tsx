import type { Metadata } from "next";
import {
  Activity,
  Award,
  BookCheck,
  Flame,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

import { requireAdmin } from "@/lib/admin/auth";
import {
  getAdminKpis,
  getDifficultyStats,
  getHardestQuestions,
  getPracticeStats,
  getTopLessons,
  getUserGrowth,
} from "@/lib/admin/queries";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  EmptyState,
  KpiCard,
  ProgressBars,
  StatBar,
} from "@/components/admin/stat-blocks";

export const metadata: Metadata = {
  title: "Overview",
};

export default async function AdminOverviewPage() {
  await requireAdmin();

  const [
    kpis,
    growth,
    topLessons,
    hardestQuestions,
    difficultyStats,
    practiceStats,
  ] = await Promise.all([
    getAdminKpis(),
    getUserGrowth(30),
    getTopLessons(10),
    getHardestQuestions(10),
    getDifficultyStats(),
    getPracticeStats(),
  ]);

  const growthChart = growth.slice(-14).map((g) => ({
    label: g.date.slice(5),
    value: g.activeUsers,
  }));
  const userTotalChart = growth.map((g) => ({
    label: g.date.slice(5),
    value: g.users,
  }));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight">Overview</h1>
        <p className="text-sm text-muted-foreground">
          Real-time platform analytics.
        </p>
      </div>

      <section className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
        <KpiCard
          label="Total Users"
          value={kpis.totalUsers.toLocaleString()}
          sub={`+${kpis.newUsers7d} in last 7 days`}
          icon={<Users className="size-4" />}
        />
        <KpiCard
          label="Active (7d)"
          value={kpis.activeUsers7d.toLocaleString()}
          sub="Users active this week"
          icon={<Activity className="size-4" />}
          accent="bg-emerald-500/10 text-emerald-600"
        />
        <KpiCard
          label="Lessons Completed"
          value={kpis.totalLessonsCompleted.toLocaleString()}
          icon={<BookCheck className="size-4" />}
          accent="bg-blue-500/10 text-blue-600"
        />
        <KpiCard
          label="Total XP"
          value={kpis.totalXpEarned.toLocaleString()}
          icon={<Zap className="size-4" />}
          accent="bg-amber-500/10 text-amber-600"
        />
        <KpiCard
          label="Questions Answered"
          value={kpis.totalQuestionsAnswered.toLocaleString()}
          icon={<Target className="size-4" />}
          accent="bg-violet-500/10 text-violet-600"
        />
        <KpiCard
          label="Avg Score"
          value={`${Math.round(kpis.avgCompletionRate)}%`}
          sub="Mean lesson score"
          icon={<TrendingUp className="size-4" />}
          accent="bg-rose-500/10 text-rose-600"
        />
        <KpiCard
          label="Avg Streak"
          value={kpis.averageStreak.toFixed(1)}
          sub="days per learner"
          icon={<Flame className="size-4" />}
          accent="bg-orange-500/10 text-orange-600"
        />
        <KpiCard
          label="Practice Sessions"
          value={practiceStats.totalSessions.toLocaleString()}
          sub={`${practiceStats.accuracy}% accuracy`}
          icon={<Award className="size-4" />}
          accent="bg-cyan-500/10 text-cyan-600"
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Daily Active Users</CardTitle>
            <CardDescription>Last 14 days</CardDescription>
          </CardHeader>
          <CardContent className="h-44">
            {growthChart.some((d) => d.value > 0) ? (
              <BarChart data={growthChart} accent="bg-emerald-500" />
            ) : (
              <EmptyState message="No active-user data yet." />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Total Users Over Time</CardTitle>
            <CardDescription>Last 30 days</CardDescription>
          </CardHeader>
          <CardContent className="h-44">
            {userTotalChart.some((d) => d.value > 0) ? (
              <BarChart data={userTotalChart} accent="bg-primary" />
            ) : (
              <EmptyState message="No user data yet." />
            )}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Top Lessons</CardTitle>
            <CardDescription>By number of attempts</CardDescription>
          </CardHeader>
          <CardContent>
            {topLessons.length ? (
              <ProgressBars
                rows={topLessons.map((l) => ({
                  label: `${l.title} · ${l.pathTitle}`,
                  value: `${l.completionRate}%`,
                  bar: l.completionRate,
                }))}
              />
            ) : (
              <EmptyState message="No lesson attempts yet." />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Difficulty Breakdown</CardTitle>
            <CardDescription>Accuracy by difficulty</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {difficultyStats.length ? (
              difficultyStats.map((d) => (
                <StatBar
                  key={d.difficulty}
                  label={d.difficulty}
                  value={`${d.accuracy}%`}
                  percent={d.accuracy}
                />
              ))
            ) : (
              <EmptyState message="No question attempts yet." />
            )}
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Hardest Questions</CardTitle>
          <CardDescription>
            Lowest accuracy — useful for tuning content
          </CardDescription>
        </CardHeader>
        <CardContent>
          {hardestQuestions.length ? (
            <div className="divide-y divide-border/40">
              {hardestQuestions.map((q) => (
                <div
                  key={q.id}
                  className="flex items-center justify-between gap-4 py-2.5"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{q.question}</p>
                    <p className="text-xs text-muted-foreground">
                      {q.difficulty} · {q.type}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3 text-xs">
                    <span className="text-muted-foreground">
                      {q.attempts} attempts
                    </span>
                    <span
                      className={`font-bold ${
                        q.accuracy < 40 ? "text-destructive" : "text-amber-600"
                      }`}
                    >
                      {Math.round(q.accuracy)}% correct
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState message="No question attempts yet." />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
