import "server-only";

import { getWeakSkills } from "@/lib/mastery/queries";

export type PracticeRecommendation = {
  skillId: string;
  skillName: string;
  topic: string;
  lessonTitle: string;
  currentMastery: number;
  tierLabel: string;
  urgency: "high" | "medium" | "low";
  reason: string;
  actionHref: string;
};

export async function getSkillRecommendations(
  userId: string,
): Promise<PracticeRecommendation[]> {
  const weakSkills = await getWeakSkills(userId, 80);

  return weakSkills.slice(0, 4).map((item) => {
    let urgency: PracticeRecommendation["urgency"] = "low";
    let reason = "Good progress — brush up to reach full mastery ⭐";

    if (item.mastery.score < 40) {
      urgency = "high";
      reason = "Needs attention: mastery is low based on recent attempts 🔴";
    } else if (item.mastery.score < 60) {
      urgency = "medium";
      reason = "Developing skill: practice recommended to build confidence 🟡";
    }

    return {
      skillId: item.skillId,
      skillName: item.skillName,
      topic: `${item.pathTitle} / ${item.moduleTitle}`,
      lessonTitle: item.lessonTitle,
      currentMastery: item.mastery.score,
      tierLabel: item.mastery.label,
      urgency,
      reason,
      actionHref: `/learn/${item.pathSlug}/${item.moduleSlug}/${item.lessonSlug}`,
    };
  });
}
