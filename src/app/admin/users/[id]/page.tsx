import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { requireAdmin } from "@/lib/admin/auth";
import { getUserDetail } from "@/lib/admin/users";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserDetailActions } from "@/components/admin/user-detail-actions";

export const metadata: Metadata = {
  title: "User Detail",
};

type Props = {
  params: Promise<{ id: string }>;
};

export default async function AdminUserDetailPage({ params }: Props) {
  await requireAdmin();
  const { id } = await params;

  const user = await getUserDetail(id);
  if (!user) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <div>
          <div className="mb-1">
            <Button asChild variant="ghost" size="sm" className="gap-1.5 -ml-1.5 text-muted-foreground">
              <Link href="/admin/users">
                <ArrowLeft className="size-4" />
                Users
              </Link>
            </Button>
          </div>
          <h1 className="text-2xl font-black tracking-tight">
            {user.name ?? user.email ?? "User"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {user.email ?? "No email"} · joined{" "}
            {user.createdAt.toLocaleDateString()}
          </p>
        </div>
        <div className="ml-auto flex gap-2">
          <Badge variant={user.role === "admin" ? "default" : "secondary"}>
            {user.role}
          </Badge>
          {user.bannedAt && <Badge variant="destructive">Banned</Badge>}
        </div>
      </div>

      <UserDetailActions user={user} />

      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Gamification</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <div className="text-xs text-muted-foreground">Level</div>
              <div className="text-lg font-black">⭐ {user.level}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">XP</div>
              <div className="text-lg font-black">⚡ {user.xp.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Hearts</div>
              <div className="text-lg font-black">❤️ {user.hearts}/5</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Streak</div>
              <div className="text-lg font-black">🔥 {user.streak}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Learning</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <div className="text-xs text-muted-foreground">Lessons completed</div>
              <div className="text-lg font-black">{user.lessonsCompleted}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Best streak</div>
              <div className="text-lg font-black">{user.bestStreak} days</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Questions answered</div>
              <div className="text-lg font-black">{user.questionsAnswered}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Question accuracy</div>
              <div className="text-lg font-black">{user.questionAccuracy}%</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top Skills</CardTitle>
          </CardHeader>
          <CardContent>
            {user.topSkills.length ? (
              <div className="space-y-2">
                {user.topSkills.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="truncate pr-2">{s.name}</span>
                    <span className="font-bold">{Math.round(s.mastery)}%</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No skill data yet.</p>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Lessons</CardTitle>
            <CardDescription>Last 10 attempts</CardDescription>
          </CardHeader>
          <CardContent>
            {user.recentLessons.length ? (
              <div className="divide-y divide-border/40">
                {user.recentLessons.map((l) => (
                  <div
                    key={l.id}
                    className="flex items-center justify-between gap-3 py-2 text-sm"
                  >
                    <span className="truncate">{l.lessonTitle}</span>
                    <span className="flex shrink-0 items-center gap-2">
                      <Badge variant={l.completed ? "default" : "outline"}>
                        {l.completed ? `${l.score}%` : "Incomplete"}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        +{l.xpEarned} XP
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No lessons yet.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Achievements</CardTitle>
            <CardDescription>Last 10 unlocked</CardDescription>
          </CardHeader>
          <CardContent>
            {user.recentAchievements.length ? (
              <div className="divide-y divide-border/40">
                {user.recentAchievements.map((a) => (
                  <div
                    key={`${a.id}-${a.unlockedAt.getTime()}`}
                    className="flex items-center justify-between gap-3 py-2 text-sm"
                  >
                    <span className="flex items-center gap-2">
                      <span aria-hidden="true">{iconFor(a.icon)}</span>
                      <span className="truncate">{a.title}</span>
                    </span>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {a.unlockedAt.toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No achievements yet.</p>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

const ACHIEVEMENT_EMOJI: Record<string, string> = {
  Flame: "🔥",
  Zap: "⚡",
  Target: "🎯",
  Award: "🏅",
  Terminal: "💻",
  Shield: "🛡️",
  Crown: "👑",
  Star: "⭐",
  BookOpen: "📖",
};

function iconFor(icon: string): string {
  return ACHIEVEMENT_EMOJI[icon] ?? "🏅";
}
