import { DashboardHero } from "@/components/dashboard/dashboard-hero";
import { DashboardCareers } from "@/components/dashboard/dashboard-careers";
import { DashboardRail } from "@/components/dashboard/dashboard-rail";
import { CadetHeatmap } from "@/components/dashboard/cadet-heatmap";
import { CadetRankTier } from "@/components/dashboard/cadet-rank-tier";
import { getCachedDashboardData } from "@/lib/dashboard/queries";

export async function DashboardHeroSection({ userId }: { userId: string }) {
  const data = await getCachedDashboardData(userId);
  return <DashboardHero firstName={data.firstName} profile={data.profile} />;
}

export async function DashboardCareersSection({ userId }: { userId: string }) {
  const data = await getCachedDashboardData(userId);
  return <DashboardCareers careers={data.careers} />;
}

export async function DashboardRailSection({ userId }: { userId: string }) {
  const data = await getCachedDashboardData(userId);
  return (
    <div className="flex flex-col gap-4 w-full min-w-0">
      <CadetRankTier
        level={data.profile.user.level}
        xp={data.profile.user.xp}
        levelTitle={data.profile.user.levelTitle}
      />
      <DashboardRail
        dailyQuests={data.dailyQuests}
        dailyChallengeStatus={data.dailyChallengeStatus}
      />
    </div>
  );
}

export async function DashboardHeatmapSection({ userId }: { userId: string }) {
  const data = await getCachedDashboardData(userId);
  return (
    <CadetHeatmap
      currentStreak={data.profile.streak.currentStreak}
    />
  );
}