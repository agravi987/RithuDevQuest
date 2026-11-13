import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import {
  DashboardHeroSection,
  DashboardCareersSection,
  DashboardRailSection,
  DashboardHeatmapSection,
} from "./dashboard-sections";
import {
  HeroSkeleton,
  CareersSkeleton,
  RailSkeleton,
} from "@/components/dashboard/dashboard-skeletons";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 min-h-0">
      {/* Greeting + key stats — streams in first */}
      <Suspense fallback={<HeroSkeleton />}>
        <DashboardHeroSection userId={session.user.id} />
      </Suspense>

      {/* Main grid: current mission (left) + daily quests (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 w-full min-w-0 items-start">
        <Suspense fallback={<CareersSkeleton />}>
          <DashboardCareersSection userId={session.user.id} />
        </Suspense>
        <Suspense fallback={<RailSkeleton />}>
          <DashboardRailSection userId={session.user.id} />
        </Suspense>
      </div>

      {/* Full-width Cadet Orbit Activity Heatmap */}
      <Suspense fallback={<div className="h-36 rounded-3xl bg-white/5 animate-pulse" />}>
        <DashboardHeatmapSection userId={session.user.id} />
      </Suspense>
    </div>
  );
}