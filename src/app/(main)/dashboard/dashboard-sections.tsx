import { ContinueQuest } from "@/components/galaxy/continue-quest";
import { DashboardHero } from "@/components/dashboard/dashboard-hero";
import { DashboardCareers } from "@/components/dashboard/dashboard-careers";
import { DashboardRail } from "@/components/dashboard/dashboard-rail";
import { getCachedDashboardData } from "@/lib/dashboard/queries";

export async function ContinueQuestSection({ userId }: { userId: string }) {
  const data = await getCachedDashboardData(userId);
  if (!data.nextQuest) return null;
  return <ContinueQuest quest={data.nextQuest} />;
}

export async function DashboardHeroSection({ userId }: { userId: string }) {
  const data = await getCachedDashboardData(userId);
  return <DashboardHero firstName={data.firstName} profile={data.profile} />;
}

export async function DashboardCareersSection({ userId }: { userId: string }) {
  const data = await getCachedDashboardData(userId);
  return <DashboardCareers careers={data.careers} profile={data.profile} />;
}

export async function DashboardRailSection({ userId }: { userId: string }) {
  const data = await getCachedDashboardData(userId);
  return (
    <DashboardRail
      profile={data.profile}
      careers={data.careers}
      skills={data.skills}
      dailyQuests={data.dailyQuests}
      dailyChallengeStatus={data.dailyChallengeStatus}
    />
  );
}