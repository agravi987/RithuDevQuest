import "server-only";

import { groq, GROQ_FAST_MODEL, GROQ_REASONING_MODEL } from "@/lib/ai/groq";
import { prisma } from "@/lib/db";
import {
  generatedQuestionsBatchSchema,
  generatedQuestionSchema,
  type GeneratedQuestion,
} from "@/lib/ai/schemas/question";
import {
  explanationResponseSchema,
  type ExplanationRequest,
  type ExplanationResponse,
} from "@/lib/ai/schemas/explanation";
import {
  hintResponseSchema,
  type HintRequest,
  type HintResponse,
} from "@/lib/ai/schemas/hint";
import {
  mentorResponseSchema,
  type MentorContext,
  type MentorResponse,
} from "@/lib/ai/schemas/mentor";
import { buildQuestionGenerationPrompt } from "@/lib/ai/prompts/question";
import { buildExplanationPrompt } from "@/lib/ai/prompts/explanation";
import { buildHintPrompt } from "@/lib/ai/prompts/hint";
import { buildMentorPrompt } from "@/lib/ai/prompts/mentor";
import type { QuestionDifficulty, QuestionType } from "@/lib/quiz/validation";
import {
  interviewQuestionSchema,
  interviewGradeSchema,
  interviewSummarySchema,
  type InterviewQuestion,
  type InterviewGrade,
  type InterviewSummary,
} from "@/lib/ai/schemas/interview";
import {
  buildInterviewStartPrompt,
  buildInterviewGradePrompt,
  buildInterviewSummaryPrompt,
  type InterviewStartContext,
  type InterviewGradeContext,
  type InterviewSummaryContext,
} from "@/lib/ai/prompts/interview";

const MAX_RETRIES = 3;

/**
 * Strip potential Markdown code blocks from LLM JSON responses.
 */
export function cleanJsonString(raw: string): string {
  let cleaned = raw.trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.replace(/^```json\s*/, "").replace(/\s*```$/, "");
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```\s*/, "").replace(/\s*```$/, "");
  }
  return cleaned.trim();
}

/**
 * Call Groq API with JSON mode and return raw string.
 */
async function callGroqChat(
  systemPrompt: string,
  userPrompt: string,
  model: string = GROQ_FAST_MODEL,
): Promise<string> {
  const response = await groq.chat.completions.create({
    model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    response_format: { type: "json_object" },
    temperature: 0.3,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("Empty response received from Groq API");
  }
  return content;
}

export type GenerateQuestionsOptions = {
  topic: string;
  subtopic?: string;
  learningObjectives?: string[];
  difficulty?: QuestionDifficulty;
  questionType?: QuestionType;
  count?: number;
  lessonId?: string;
  skillId?: string;
  useCache?: boolean;
};

/**
 * Generate validated questions using Groq AI with automatic retry on validation failure.
 * If `lessonId` is provided, cached questions can be reused or newly generated questions stored.
 */
export async function generateQuestions(
  options: GenerateQuestionsOptions,
): Promise<GeneratedQuestion[]> {
  const difficulty = options.difficulty ?? "beginner";
  const count = options.count ?? 1;

  // Check database cache if lessonId is provided and cache is enabled
  if (options.lessonId && options.useCache !== false) {
    const cached = await prisma.question.findMany({
      where: {
        lessonId: options.lessonId,
        source: "ai_generated",
        difficulty,
        ...(options.questionType ? { type: options.questionType } : {}),
      },
      take: count,
    });

    if (cached.length >= count) {
      return cached.map((q) => ({
        type: q.type as GeneratedQuestion["type"],
        difficulty: q.difficulty as GeneratedQuestion["difficulty"],
        question: q.question,
        options: (q.options as string[]) ?? null,
        parts: (q.parts as GeneratedQuestion["parts"]) ?? null,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        hint: q.hint ?? null,
      }));
    }
  }

  const { system, user } = buildQuestionGenerationPrompt({
    topic: options.topic,
    subtopic: options.subtopic,
    learningObjectives: options.learningObjectives,
    difficulty,
    questionType: options.questionType,
    count,
  });

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const raw = await callGroqChat(system, user, GROQ_FAST_MODEL);
      const parsedJson = JSON.parse(cleanJsonString(raw));

      let questions: GeneratedQuestion[] = [];
      if (Array.isArray(parsedJson.questions)) {
        const batch = generatedQuestionsBatchSchema.parse(parsedJson);
        questions = batch.questions;
      } else {
        // In case model returns a single question object
        const single = generatedQuestionSchema.parse(parsedJson);
        questions = [single];
      }

      // Store in database if lessonId is provided
      if (options.lessonId && questions.length > 0) {
        for (const q of questions) {
          await prisma.question.create({
            data: {
              type: q.type,
              difficulty: q.difficulty,
              question: q.question,
              options: q.options ? (q.options as object) : undefined,
              parts: q.parts ? (q.parts as object) : undefined,
              correctAnswer: q.correctAnswer,
              explanation: q.explanation,
              hint: q.hint ?? null,
              lessonId: options.lessonId,
              skillId: options.skillId ?? null,
              source: "ai_generated",
            },
          });
        }
      }

      return questions;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      console.warn(`[AI Generator] Attempt ${attempt}/${MAX_RETRIES} failed: ${lastError.message}`);
    }
  }

  throw new Error(`Failed to generate valid questions after ${MAX_RETRIES} attempts: ${lastError?.message}`);
}

/**
 * Generate a validated explanation for a user's question / answer attempt.
 */
export async function generateExplanation(
  request: ExplanationRequest,
): Promise<ExplanationResponse> {
  const { system, user } = buildExplanationPrompt(request);
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const raw = await callGroqChat(system, user, GROQ_FAST_MODEL);
      const parsedJson = JSON.parse(cleanJsonString(raw));
      return explanationResponseSchema.parse(parsedJson);
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      console.warn(`[AI Explanation] Attempt ${attempt}/${MAX_RETRIES} failed: ${lastError.message}`);
    }
  }

  throw new Error(`Failed to generate explanation: ${lastError?.message}`);
}

/**
 * Generate a validated progressive hint.
 */
export async function generateHint(
  request: HintRequest,
): Promise<HintResponse> {
  const { system, user } = buildHintPrompt(request);
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const raw = await callGroqChat(system, user, GROQ_FAST_MODEL);
      const parsedJson = JSON.parse(cleanJsonString(raw));
      return hintResponseSchema.parse(parsedJson);
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      console.warn(`[AI Hint] Attempt ${attempt}/${MAX_RETRIES} failed: ${lastError.message}`);
    }
  }

  throw new Error(`Failed to generate hint: ${lastError?.message}`);
}

/**
 * Generate a validated contextual mentor message from Rithu.
 */
export async function generateMentorResponse(
  context: MentorContext,
): Promise<MentorResponse> {
  const { system, user } = buildMentorPrompt(context);
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const raw = await callGroqChat(system, user, GROQ_REASONING_MODEL);
      const parsedJson = JSON.parse(cleanJsonString(raw));
      return mentorResponseSchema.parse(parsedJson);
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      console.warn(`[AI Mentor] Attempt ${attempt}/${MAX_RETRIES} failed: ${lastError.message}`);
    }
  }

  throw new Error(`Failed to generate mentor response: ${lastError?.message}`);
}

/**
 * Generate the opening (or next) interview question for the selected role.
 */
export async function startInterviewQuestion(
  context: InterviewStartContext,
): Promise<InterviewQuestion> {
  const { system, user } = buildInterviewStartPrompt(context);
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const raw = await callGroqChat(system, user, GROQ_FAST_MODEL);
      const parsedJson = JSON.parse(cleanJsonString(raw));
      return interviewQuestionSchema.parse(parsedJson);
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      console.warn(`[AI Interview] Attempt ${attempt}/${MAX_RETRIES} failed: ${lastError.message}`);
    }
  }

  throw new Error(`Failed to generate interview question: ${lastError?.message}`);
}

/**
 * Grade a candidate's answer during an AI mock interview.
 */
export async function gradeInterviewAnswer(
  context: InterviewGradeContext,
): Promise<InterviewGrade> {
  const { system, user } = buildInterviewGradePrompt(context);
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const raw = await callGroqChat(system, user, GROQ_FAST_MODEL);
      const parsedJson = JSON.parse(cleanJsonString(raw));
      return interviewGradeSchema.parse(parsedJson);
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      console.warn(`[AI Interview Grade] Attempt ${attempt}/${MAX_RETRIES} failed: ${lastError.message}`);
    }
  }

  throw new Error(`Failed to grade interview answer: ${lastError?.message}`);
}

/**
 * Generate the final interview summary after all rounds are complete.
 */
export async function summarizeInterview(
  context: InterviewSummaryContext,
): Promise<InterviewSummary> {
  const { system, user } = buildInterviewSummaryPrompt(context);
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const raw = await callGroqChat(system, user, GROQ_FAST_MODEL);
      const parsedJson = JSON.parse(cleanJsonString(raw));
      return interviewSummarySchema.parse(parsedJson);
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      console.warn(`[AI Interview Summary] Attempt ${attempt}/${MAX_RETRIES} failed: ${lastError.message}`);
    }
  }

  throw new Error(`Failed to summarize interview: ${lastError?.message}`);
}
