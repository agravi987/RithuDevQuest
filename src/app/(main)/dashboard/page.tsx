import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import {
  DashboardHeroSection,
  DashboardCareersSection,
  DashboardRailSection,
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
      <div className="flex flex-1 gap-5 min-h-0 flex-col lg:flex-row">
        <Suspense fallback={<CareersSkeleton />}>
          <DashboardCareersSection userId={session.user.id} />
        </Suspense>
        <Suspense fallback={<RailSkeleton />}>
          <DashboardRailSection userId={session.user.id} />
        </Suspense>
      </div>
    </div>
  );
}