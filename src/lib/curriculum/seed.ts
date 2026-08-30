export type ActivityType =
  | "learn"
  | "example"
  | "question"
  | "practice"
  | "review";

export type ActivityContent = {
  title?: string;
  body: string;
  code?: string;
};

export type SeedActivity = {
  type: ActivityType;
  content: ActivityContent;
};

export function activityTypeOf(content: ActivityContent): ActivityType {
  return content.code ? "example" : "learn";
}

export type SeedSkill = {
  name: string;
  description?: string;
};

export type SeedQuestionType =
  | "mcq"
  | "true_false"
  | "command"
  | "scenario"
  | "fill_blank"
  | "multi_select"
  | "match"
  | "sequence"
  | "code_completion"
  | "word_scramble"
  | "flip_cards";

export type SeedQuestionDifficulty =
  | "beginner"
  | "intermediate"
  | "advanced";

export type SeedQuestionPart = {
  prompt: string;
  correctAnswer: string;
};

export type SeedFillBlank = {
  answer: string;
  hint?: string;
};

export type SeedMultiSelectOption = {
  text: string;
  isCorrect: boolean;
};

export type SeedMatchPair = {
  left: string;
  right: string;
};

export type SeedSequenceItem = {
  id: string;
  text: string;
};

export type SeedCodeBlank = {
  id: string;
  answer: string;
  hint?: string;
  placeholder?: string;
};

export type SeedFlipCard = {
  front: string;
  back: string;
  category?: string;
};

export type SeedQuestion = {
  question: string;
  correctAnswer?: string;
  explanation: string;
  type: SeedQuestionType;
  difficulty?: SeedQuestionDifficulty;
  options?: string[];
  parts?: SeedQuestionPart[];
  hint?: string;
  fillBlanks?: SeedFillBlank[];
  multiSelectOptions?: SeedMultiSelectOption[];
  matchPairs?: SeedMatchPair[];
  sequenceItems?: SeedSequenceItem[];
  sequenceCorrectOrder?: string[];
  codeBlanks?: SeedCodeBlank[];
  codeLanguage?: string;
  scrambledWord?: string;
  flipCards?: SeedFlipCard[];
};

export type SeedLesson = {
  title: string;
  description?: string;
  slug: string;
  estimatedMinutes?: number;
  learningObjectives: string[];
  skills: SeedSkill[];
  activities: ActivityContent[];
  questions?: SeedQuestion[];
};

export type SeedUnit = {
  title: string;
  description?: string;
  slug: string;
  lessons: SeedLesson[];
};

export type SeedModule = {
  title: string;
  description?: string;
  slug: string;
  icon?: string;
  units: SeedUnit[];
};

export type SeedPath = {
  title: string;
  description?: string;
  slug: string;
  modules: SeedModule[];
};

export type SeedCareer = {
  title: string;
  description?: string;
  slug: string;
  paths: SeedPath[];
};