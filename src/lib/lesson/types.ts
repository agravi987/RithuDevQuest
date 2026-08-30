export type LessonActivityData = {
  id: string;
  type: "learn" | "example";
  title: string;
  body: string;
  code?: string;
};

export type LessonQuestionData = {
  id: string;
  type: "mcq" | "true_false" | "command" | "scenario" | "fill_blank" | "multi_select" | "match" | "sequence" | "code_completion" | "word_scramble" | "flip_cards";
  difficulty: "beginner" | "intermediate" | "advanced";
  question: string;
  options: unknown[] | null;
  parts: { prompt: string }[] | null;
  hint: string | null;
  /**
   * The encoded rich payload the renderer needs, carried verbatim from the
   * Prisma `options`/`parts` JSON columns.
   */
  payload?: {
    fillBlanks?: { answer: string; hint?: string | null }[];
    multiSelect?: { text: string; isCorrect: boolean }[];
    match?: { left: string; right: string }[];
    sequenceItems?: { id: string; text: string }[];
    sequenceCorrectOrder?: string[];
    codeBlanks?: { id: string; answer: string; hint?: string | null; placeholder?: string | null }[];
    codeLanguage?: string | null;
    scrambledWord?: string;
    flipCards?: { front: string; back: string; category?: string | null }[];
  };
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