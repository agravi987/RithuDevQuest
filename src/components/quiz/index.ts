/* ════════════════════════════════════════════════════════════════════
   DUOLINGO GALAXY QUIZ ENGINE — Main exports
   ════════════════════════════════════════════════════════════════════ */

// Types
export * from "./types";

// Core Experience Orchestrator
export { QuizExperience, QuizProvider, useQuiz } from "./QuizExperience";

// Duolingo 3D Tactile Primitives
export { DuoButton } from "./duo-button";
export type { DuoButtonProps, DuoButtonVariant, DuoButtonSize } from "./duo-button";

// Header HUD & Bottom Sliding Drawer
export { DuolingoHeader } from "./DuolingoHeader";
export type { DuolingoHeaderProps } from "./DuolingoHeader";
export { DuolingoBottomDrawer } from "./DuolingoBottomDrawer";
export type { DuolingoBottomDrawerProps, BottomDrawerState } from "./DuolingoBottomDrawer";

// The Starship Crew Characters
export { CosmicCharacter } from "./characters/CosmicCharacter";
export { CharacterSpeechBubble } from "./characters/CharacterSpeechBubble";
export type { CharacterSpeechBubbleProps } from "./characters/CharacterSpeechBubble";

// 5 Signature Duolingo Question Mechanics
export { DuolingoMCQ } from "./questions/DuolingoMCQ";
export { DuolingoWordBank } from "./questions/DuolingoWordBank";
export { DuolingoMatchPairs } from "./questions/DuolingoMatchPairs";
export { DuolingoTrueFalse } from "./questions/DuolingoTrueFalse";
export { DuolingoFillBlank } from "./questions/DuolingoFillBlank";

// Modals & Results
export { DuolingoExitModal } from "./modals/DuolingoExitModal";
export { DuolingoOutOfHeartsModal } from "./modals/DuolingoOutOfHeartsModal";
export { DuolingoMistakesModal } from "./modals/DuolingoMistakesModal";
export { DuolingoResults } from "./DuolingoResults";
export type { DuolingoResultsProps } from "./DuolingoResults";

// Legacy Compatibility Exports
export { QuizTimer, QuizTimerBar, CountdownTimer } from "./QuizTimer";
export { QuizProgress, CompactProgress, QuestionNavigator } from "./QuizProgress";
export { QuizHeader, SimpleQuizHeader } from "./QuizHeader";
export { QuizNavigation, QuizControls, KeyboardShortcuts } from "./QuizNavigation";
export { QuizFeedback, InlineFeedback, StreakIndicator, XpFly } from "./QuizFeedback";
export { QuizResults, CompactResults } from "./QuizResults";