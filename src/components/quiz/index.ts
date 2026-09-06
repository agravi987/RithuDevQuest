/* ════════════════════════════════════════════════════════════════════
   UNIFIED QUIZ SYSTEM - Main exports
   ════════════════════════════════════════════════════════════════════ */

// Types
export * from "./types";
export type { QuizTimerConfig, QuizTimerState, QuizProgressState, QuizNavigationConfig, QuizFeedbackConfig, QuizModeConfig, QuizThemeConfig, QuizQuestion, QuizSession, QuizResult, QuizState, QuizExperienceProps } from "./types";

// Components
export { QuizTimer, QuizTimerBar, CountdownTimer } from "./QuizTimer";
export { QuizProgress, CompactProgress, QuestionNavigator } from "./QuizProgress";
export { QuizHeader, SimpleQuizHeader } from "./QuizHeader";
export { QuizNavigation, QuizControls, KeyboardShortcuts } from "./QuizNavigation";
export { QuizFeedback, InlineFeedback, StreakIndicator, XpFly } from "./QuizFeedback";
export { QuizResults, CompactResults } from "./QuizResults";
export { QuizExperience, QuizProvider, useQuiz } from "./QuizExperience";
export { deepMerge, QUIZ_MODE_PRESETS } from "./types";