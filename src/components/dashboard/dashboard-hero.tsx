"use client";

import { motion } from "motion/react";
import { Award, BookOpen, Flame, Zap } from "lucide-react";
import type { DashboardProfile } from "@/lib/dashboard/types";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function getGreetingEmoji(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "☀️";
  if (hour < 17) return "🌤️";
  return "🌙";
}

export function DashboardHero({
  firstName,
  profile,
}: {
  firstName: string;
  profile: DashboardProfile;
}) {
  const streakActive = profile.streak.isActiveToday;
  const streak = profile.streak.currentStreak;

  const stats = [
    {
      icon: <Zap className="size-3.5" />,
      label: "XP",
      value: profile.user.xp.toLocaleString(),
      highlight: "text-primary",
    },
    {
      icon: <Award className="size-3.5" />,
      label: `Level ${profile.user.level}`,
      value: profile.user.levelTitle,
      highlight: "text-achievement",
    },
    {
      icon: <Flame className="size-3.5" />,
      label: streakActive ? `${streak} day streak` : "streak",
      value: streakActive ? `${streak} 🔥` : "—",
      highlight: "text-orange-500",
    },
    {
      icon: <BookOpen className="size-3.5" />,
      label: "lessons",
      value: String(profile.stats.completedLessonsCount),
      highlight: "text-emerald-500",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 p-4"
    >
      <div className="relative z-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-black tracking-tight text-foreground">
              {getGreeting()}, {firstName}{" "}
              <span className="inline-block animate-wave">{getGreetingEmoji()}</span>
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 max-w-md">
              {streakActive
                ? `Day ${streak} streak active — keep it going! ${profile.stats.completedLessonsCount} lessons completed.`
                : `${profile.stats.completedLessonsCount} lessons completed so far. Time for your next adventure! ⚡`}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-1.5 rounded-full border border-border/60 bg-background/60 px-3 py-1.5"
              >
                <span className={`${stat.highlight}`}>{stat.icon}</span>
                <div className="leading-none">
                  <p className={`text-xs font-black ${stat.highlight}`}>
                    {stat.value}
                  </p>
                  <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground mt-0.5">
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}