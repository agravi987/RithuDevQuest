export type LevelInfo = {
  level: number;
  title: string;
  minXp: number;
  maxXp: number | null;
  badgeIcon: string;
};

export const LEVEL_TIERS: LevelInfo[] = [
  { level: 1, title: "Code Initiate", minXp: 0, maxXp: 100, badgeIcon: "Sparkles" },
  { level: 2, title: "Terminal Explorer", minXp: 100, maxXp: 300, badgeIcon: "Terminal" },
  { level: 3, title: "Container Cadet", minXp: 300, maxXp: 600, badgeIcon: "Box" },
  { level: 4, title: "Cluster Pilot", minXp: 600, maxXp: 1000, badgeIcon: "Compass" },
  { level: 5, title: "DevOps Apprentice", minXp: 1000, maxXp: 1500, badgeIcon: "Shield" },
  { level: 6, title: "Cloud Architect", minXp: 1500, maxXp: 2100, badgeIcon: "Cloud" },
  { level: 7, title: "Pipeline Master", minXp: 2100, maxXp: 2800, badgeIcon: "Zap" },
  { level: 8, title: "Kubernetes Knight", minXp: 2800, maxXp: 3600, badgeIcon: "Sword" },
  { level: 9, title: "Infrastructure Hero", minXp: 3600, maxXp: 4500, badgeIcon: "Crown" },
  { level: 10, title: "DevOps Legend", minXp: 4500, maxXp: null, badgeIcon: "Trophy" },
];

export type CalculatedLevel = {
  level: number;
  title: string;
  currentXp: number;
  currentLevelMinXp: number;
  nextLevelMinXp: number | null;
  progressPercentage: number;
  xpToNextLevel: number;
  isMaxLevel: boolean;
  badgeIcon: string;
};

export function calculateLevel(xp: number): CalculatedLevel {
  const safeXp = Math.max(0, Math.floor(xp));

  let currentTier = LEVEL_TIERS[0]!;
  for (const tier of LEVEL_TIERS) {
    if (safeXp >= tier.minXp) {
      currentTier = tier;
    } else {
      break;
    }
  }

  const isMaxLevel = currentTier.maxXp === null;
  const currentLevelMinXp = currentTier.minXp;
  const nextLevelMinXp = currentTier.maxXp;

  let progressPercentage = 100;
  let xpToNextLevel = 0;

  if (nextLevelMinXp !== null) {
    const tierRange = nextLevelMinXp - currentLevelMinXp;
    const earnedInTier = safeXp - currentLevelMinXp;
    progressPercentage = Math.min(100, Math.max(0, Math.round((earnedInTier / tierRange) * 100)));
    xpToNextLevel = Math.max(0, nextLevelMinXp - safeXp);
  }

  return {
    level: currentTier.level,
    title: currentTier.title,
    currentXp: safeXp,
    currentLevelMinXp,
    nextLevelMinXp,
    progressPercentage,
    xpToNextLevel,
    isMaxLevel,
    badgeIcon: currentTier.badgeIcon,
  };
}
