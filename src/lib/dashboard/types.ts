export type DashboardStreak = {
  currentStreak: number;
  isActiveToday: boolean;
};

export type DashboardUser = {
  xp: number;
  level: number;
  levelTitle: string;
};

export type DashboardStats = {
  completedLessonsCount: number;
  unlockedAchievementsCount: number;
  totalAchievementsCount: number;
};

export type DashboardProfile = {
  streak: DashboardStreak;
  user: DashboardUser;
  stats: DashboardStats;
};

export type DashboardModule = {
  id: string;
  title: string;
  slug: string;
  icon: string;
};

export type DashboardPath = {
  title: string;
  slug: string;
  moduleCount: number;
  totalLessons: number;
  completedLessons: number;
  courseProgress: number;
  completedModules: number;
  modules: DashboardModule[];
};

export type DashboardCareer = {
  slug: string;
  title: string;
  paths: DashboardPath[];
};

export type DashboardSkill = {
  skillId: string;
  skillName: string;
  score: number;
};

export type DashboardQuest = {
  id: string;
  type: string;
  title: string;
  description: string;
  target: number;
  current: number;
  completed: boolean;
  xpReward: number;
  icon: string;
};

export type DailyChallengeStatus = "pending" | "in_progress" | "completed";