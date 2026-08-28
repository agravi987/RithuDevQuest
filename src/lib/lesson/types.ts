export type LessonActivityData = {
  id: string;
  type: "learn" | "example";
  title: string;
  body: string;
  code?: string;
};

export type LessonQuestionData = {
  id: string;
  type: "mcq" | "true_false" | "command" | "scenario";
  difficulty: "beginner" | "intermediate" | "advanced";
  question: string;
  options: string[] | null;
  parts: { prompt: string }[] | null;
  hint: string | null;
};

export type LessonPlayerData = {
  lesson: {
    id: string;
    title: string;
    description: string | null;
    estimatedMinutes: number;
    learningObjectives: string[];
  };
  path: { slug: string; title: string };
  module: { slug: string; title: string };
  activities: LessonActivityData[];
  questions: LessonQuestionData[];
  moduleHref: string;
  nextLessonHref: string | null;
  userXp: number;
  completedBefore: boolean;
};

export type SubmitAnswerResult = {
  questionId: string;
  lessonId: string;
  isCorrect: boolean;
  attemptNumber: number;
  xpEarned: number;
  correctAnswer: string;
  explanation: string;
  hint: string | null;
  partIndex: number | null;
  scenarioComplete: boolean | null;
  totalParts: number | null;
};

export type CompleteLessonResult = {
  lessonId: string;
  score: number;
  xpEarned: number;
  correctFirstTry: number;
  totalQuestions: number;
  completed: boolean;
  gamification?: {
    totalXp: number;
    level: number;
    levelTitle: string;
    progressPercentage: number;
    xpToNextLevel: number;
    didLevelUp: boolean;
    streak: {
      currentStreak: number;
      longestStreak: number;
      status: "maintained" | "incremented" | "reset" | "started";
    };
    newAchievements: {
      id: string;
      title: string;
      description: string;
      icon: string;
      xpReward: number;
    }[];
  };
};