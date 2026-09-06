import type { LessonQuestionData, SubmitAnswerResult } from "@/lib/lesson/types";

/* ════════════════════════════════════════════════════════════════════
   QUIZ MODE CONFIGURATION
   ════════════════════════════════════════════════════════════════════ */

export type QuizMode = "lesson" | "daily" | "ai-practice" | "custom";

export interface QuizTimerConfig {
  enabled: boolean;
  durationMs?: number;
  warningThreshold: number;
  criticalThreshold: number;
  autoSubmit: boolean;
  showMilliseconds: boolean;
  countUp: boolean;
}

export interface QuizNavigationConfig {
  showProgress: boolean;
  allowSkip: boolean;
  allowBack: boolean;
  showQuestionNumbers: boolean;
  showProgressDots: boolean;
  showProgressBar: boolean;
}

export interface QuizScoringConfig {
  xpPerCorrect: number;
  xpPerIncorrect: number;
  comboBonus: { enabled: boolean; threshold: number; bonusXp: number };
  streakBonus: { enabled: boolean; minStreak: number; bonusXp: number };
  dailyBaseXp?: number;
}

export interface QuizFeedbackConfig {
  showExplanation: boolean;
  showCorrectAnswer: boolean;
  allowRetry: boolean;
  showHint: boolean;
  showXpEarned: boolean;
  showRithuMascot: boolean;
}

export interface QuizCompletionConfig {
  autoComplete: boolean;
  showResults: boolean;
  redirectOnComplete?: string;
  celebrateCompletion: boolean;
  showReview: boolean;
}

export interface QuizThemeConfig {
  variant: "lesson" | "challenge" | "practice";
  accentColor: string;
  backgroundClass: string;
  cardClass: string;
}

export interface QuizModeConfig {
  mode: QuizMode;
  timer: QuizTimerConfig;
  navigation: QuizNavigationConfig;
  scoring: QuizScoringConfig;
  feedback: QuizFeedbackConfig;
  completion: QuizCompletionConfig;
  theme: QuizThemeConfig;
}

/* ════════════════════════════════════════════════════════════════════
   PRESET CONFIGURATIONS
   ════════════════════════════════════════════════════════════════════ */

export const QUIZ_MODE_PRESETS: Record<QuizMode, QuizModeConfig> = {
  lesson: {
    mode: "lesson",
    timer: {
      enabled: false,
      warningThreshold: 0.3,
      criticalThreshold: 0.1,
      autoSubmit: false,
      showMilliseconds: false,
      countUp: false,
    },
    navigation: {
      showProgress: true,
      allowSkip: false,
      allowBack: true,
      showQuestionNumbers: true,
      showProgressDots: true,
      showProgressBar: true,
    },
    scoring: {
      xpPerCorrect: 10,
      xpPerIncorrect: 0,
      comboBonus: { enabled: false, threshold: 0, bonusXp: 0 },
      streakBonus: { enabled: false, minStreak: 0, bonusXp: 0 },
    },
    feedback: {
      showExplanation: true,
      showCorrectAnswer: true,
      allowRetry: true,
      showHint: true,
      showXpEarned: true,
      showRithuMascot: true,
    },
    completion: {
      autoComplete: false,
      showResults: true,
      redirectOnComplete: undefined,
      celebrateCompletion: true,
      showReview: true,
    },
    theme: {
      variant: "lesson",
      accentColor: "primary",
      backgroundClass: "bg-background",
      cardClass: "bg-card border-border/50",
    },
  },

  daily: {
    mode: "daily",
    timer: {
      enabled: true,
      durationMs: 30 * 60 * 1000,
      warningThreshold: 0.3,
      criticalThreshold: 0.1,
      autoSubmit: true,
      showMilliseconds: false,
      countUp: false,
    },
    navigation: {
      showProgress: true,
      allowSkip: true,
      allowBack: false,
      showQuestionNumbers: true,
      showProgressDots: true,
      showProgressBar: true,
    },
    scoring: {
      xpPerCorrect: 10,
      xpPerIncorrect: 0,
      comboBonus: { enabled: true, threshold: 3, bonusXp: 5 },
      streakBonus: { enabled: true, minStreak: 3, bonusXp: 5 },
      dailyBaseXp: 10,
    },
    feedback: {
      showExplanation: true,
      showCorrectAnswer: true,
      allowRetry: false,
      showHint: true,
      showXpEarned: true,
      showRithuMascot: true,
    },
    completion: {
      autoComplete: true,
      showResults: true,
      redirectOnComplete: "/practice",
      celebrateCompletion: true,
      showReview: true,
    },
    theme: {
      variant: "challenge",
      accentColor: "emerald",
      backgroundClass: "bg-gradient-to-br from-emerald-500/5 via-background to-teal-500/5",
      cardClass: "bg-emerald-500/5 border-emerald-500/20",
    },
  },

  "ai-practice": {
    mode: "ai-practice",
    timer: {
      enabled: false,
      warningThreshold: 0.3,
      criticalThreshold: 0.1,
      autoSubmit: false,
      showMilliseconds: false,
      countUp: false,
    },
    navigation: {
      showProgress: true,
      allowSkip: true,
      allowBack: false,
      showQuestionNumbers: true,
      showProgressDots: true,
      showProgressBar: true,
    },
    scoring: {
      xpPerCorrect: 15,
      xpPerIncorrect: 0,
      comboBonus: { enabled: false, threshold: 0, bonusXp: 0 },
      streakBonus: { enabled: false, minStreak: 0, bonusXp: 0 },
    },
    feedback: {
      showExplanation: true,
      showCorrectAnswer: true,
      allowRetry: true,
      showHint: false,
      showXpEarned: true,
      showRithuMascot: true,
    },
    completion: {
      autoComplete: false,
      showResults: true,
      redirectOnComplete: "/practice",
      celebrateCompletion: false,
      showReview: false,
    },
    theme: {
      variant: "practice",
      accentColor: "primary",
      backgroundClass: "bg-gradient-to-br from-primary/5 via-background to-emerald-500/5",
      cardClass: "bg-primary/5 border-primary/20",
    },
  },

  custom: {
    mode: "custom",
    timer: {
      enabled: false,
      warningThreshold: 0.3,
      criticalThreshold: 0.1,
      autoSubmit: false,
      showMilliseconds: false,
      countUp: false,
    },
    navigation: {
      showProgress: true,
      allowSkip: true,
      allowBack: true,
      showQuestionNumbers: true,
      showProgressDots: true,
      showProgressBar: true,
    },
    scoring: {
      xpPerCorrect: 10,
      xpPerIncorrect: 0,
      comboBonus: { enabled: false, threshold: 0, bonusXp: 0 },
      streakBonus: { enabled: false, minStreak: 0, bonusXp: 0 },
    },
    feedback: {
      showExplanation: true,
      showCorrectAnswer: true,
      allowRetry: true,
      showHint: true,
      showXpEarned: true,
      showRithuMascot: true,
    },
    completion: {
      autoComplete: false,
      showResults: true,
      redirectOnComplete: undefined,
      celebrateCompletion: true,
      showReview: true,
    },
    theme: {
      variant: "lesson",
      accentColor: "primary",
      backgroundClass: "bg-background",
      cardClass: "bg-card border-border/50",
    },
  },
};

/* ════════════════════════════════════════════════════════════════════
   QUIZ QUESTION & STATE TYPES
   ════════════════════════════════════════════════════════════════════ */

export interface QuizQuestion extends LessonQuestionData {
  order: number;
  userAnswer?: string | null;
  isCorrect?: boolean | null;
  answeredAt?: string | null;
  xpEarned?: number;
  /** Optional correct answer for local grading when no server handler is provided. */
  correctAnswer?: string;
}

export interface QuizSession {
  id: string;
  mode: QuizMode;
  topic: string;
  title: string;
  questions: QuizQuestion[];
  currentIndex: number;
  startedAt: Date;
  expiresAt?: Date;
  completedAt?: Date;
  totalXpEarned: number;
  correctCount: number;
  combo: number;
  maxCombo: number;
  answerHistory: QuizAnswerRecord[];
}

export interface QuizAnswerRecord {
  questionId: string;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  xpEarned: number;
  answeredAt: Date;
  timeSpentMs: number;
}

export interface QuizResult {
  sessionId: string;
  mode: QuizMode;
  topic: string;
  totalQuestions: number;
  correctCount: number;
  accuracy: number;
  totalXpEarned: number;
  maxCombo: number;
  timeSpentMs: number;
  completedAt: Date;
  didLevelUp: boolean;
  newLevel?: number;
  newLevelTitle?: string;
  newAchievements?: Array<{
    id: string;
    title: string;
    description: string;
    icon: string;
    xpReward: number;
  }>;
  streak?: {
    currentStreak: number;
    longestStreak: number;
    status: "maintained" | "incremented" | "reset" | "started";
  };
}

export type QuizState =
  | "loading"
  | "setup"
  | "landing"
  | "active"
  | "submitting"
  | "review"
  | "results"
  | "completed"
  | "expired"
  | "error";

/* ════════════════════════════════════════════════════════════════════
   QUIZ EXPERIENCE PROPS
   ════════════════════════════════════════════════════════════════════ */

export interface QuizExperienceProps {
  mode: QuizMode;
  config?: DeepPartial<QuizModeConfig>;
  questions?: QuizQuestion[];
  onComplete?: (result: QuizResult) => void;
  onExit?: () => void;
  onSubmitAnswer?: (
    question: QuizQuestion,
    answer: string,
  ) => Promise<SubmitAnswerResult> | SubmitAnswerResult;
  /** When true, the parent owns the results screen; QuizExperience skips its internal one. */
  externalCompletion?: boolean;
  initialState?: Partial<QuizSession>;
  sessionId?: string;
  userXp?: number;
  userLevel?: number;
  userStreak?: number;
  hearts?: { current: number; max: number; nextRegen: Date | null };
}

export interface QuizTimerState {
  minutes: number;
  seconds: number;
  totalSeconds: number;
  progress: number;
  isExpired: boolean;
  isWarning: boolean;
  isCritical: boolean;
  formatted: string;
}

export interface QuizProgressState {
  current: number;
  total: number;
  percentage: number;
  answered: number;
  correct: number;
  incorrect: number;
  unanswered: number;
}

/* ════════════════════════════════════════════════════════════════════
   UTILITIES
   ════════════════════════════════════════════════════════════════════ */

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends (...args: never[]) => unknown
    ? T[K]
    : T[K] extends object
      ? DeepPartial<T[K]>
      : T[K];
};

export function deepMerge<T extends object>(target: T, source: DeepPartial<T>): T {
  const result = { ...target } as T;
  for (const key of Object.keys(source) as Array<keyof T>) {
    const sourceValue = source[key];
    const targetValue = result[key];
    if (
      sourceValue &&
      typeof sourceValue === "object" &&
      !Array.isArray(sourceValue) &&
      targetValue &&
      typeof targetValue === "object" &&
      !Array.isArray(targetValue)
    ) {
      (result as Record<string, unknown>)[key as string] = deepMerge(
        targetValue as Record<string, unknown>,
        sourceValue as Record<string, unknown>
      ) as T[keyof T];
    } else if (sourceValue !== undefined) {
      (result as Record<string, unknown>)[key as string] = sourceValue;
    }
  }
  return result;
}