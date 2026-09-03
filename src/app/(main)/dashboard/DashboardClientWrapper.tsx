"use client";

import dynamic from "next/dynamic";

const DashboardClient = dynamic(
  () => import("@/components/dashboard/dashboard-client").then((mod) => mod.DashboardClient),
  { ssr: false, loading: () => <div className="animate-pulse h-96 w-full" /> }
);

interface DashboardClientProps {
  firstName: string;
  profile: {
    streak: { currentStreak: number; isActiveToday: boolean };
    user: { xp: number; level: number; levelTitle: string };
    stats: { completedLessonsCount: number; unlockedAchievementsCount: number; totalAchievementsCount: number };
  };
  careers: Array<{
    slug: string;
    title: string;
    paths: Array<{
      title: string;
      slug: string;
      moduleCount: number;
      totalLessons: number;
      completedLessons: number;
      courseProgress: number;
      completedModules: number;
      modules: Array<{ id: string; title: string; slug: string; icon: string }>;
    }>;
  }>;
  skills: Array<{ skillId: string; skillName: string; score: number }>;
  dailyQuests: Array<{
    id: string;
    type: string;
    title: string;
    description: string;
    target: number;
    current: number;
    completed: boolean;
    xpReward: number;
    icon: string;
  }>;
  dailyChallengeStatus: "pending" | "in_progress" | "completed";
}

export function DashboardClientWrapper(props: DashboardClientProps) {
  return <DashboardClient {...props} />;
}