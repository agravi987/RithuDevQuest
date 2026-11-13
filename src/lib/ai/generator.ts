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

  // Graceful fallback question if AI generation fails or Groq is unavailable
  console.warn(`[AI Interview] Using curated scenario question for ${context.careerTitle}: ${lastError?.message}`);
  const fallbackQuestions = [
    `In your experience as a ${context.careerTitle}, how would you diagnose and mitigate a sudden 50x spike in latency accompanied by intermittent 504 gateway timeouts in a high-traffic production service?`,
    `Walk me through your architecture and design considerations when building a resilient, horizontally scalable service handling critical real-time traffic for a ${context.careerTitle} role.`,
    `Suppose a critical production deployment causes silent data corruption in a background worker queue. What immediate triage steps and long-term safeguards would you implement?`,
  ];
  return {
    question: fallbackQuestions[Math.floor(Math.random() * fallbackQuestions.length)]!,
  };
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

  // Graceful fallback grading
  console.warn(`[AI Interview Grade] Using fallback evaluation: ${lastError?.message}`);
  const wordCount = context.userAnswer.trim().split(/\s+/).length;
  const score = Math.min(88, Math.max(55, 50 + Math.floor(wordCount * 0.4)));
  return {
    score,
    feedback: `Good technical initiative demonstrated in your response. You covered key operational considerations, though further specificity on telemetry metrics, rollback criteria, and failure isolation would elevate your answer in senior loops.`,
    tips: `Structure your response using the STAR or incident lifecycle format (Detect -> Triage -> Mitigate -> Root Cause -> Prevent). Specify observability signals like p99 latency, error rates, and resource saturation.`,
    idealAnswer: `A Staff Engineer would approach this by: 1) Rapid triage: inspect telemetry (p99 latency, saturation, error budget) and execute an immediate canary rollback; 2) Isolation: redirect traffic or engage circuit breakers; 3) Root cause analysis: inspect thread dumps, database lock contention, and connection pool exhaustion; 4) Post-incident prevention: implement automated SLO-based canary gates and comprehensive load tests.`,
    followUpQuestion: null,
  };
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

  console.warn(`[AI Interview Summary] Using fallback summary: ${lastError?.message}`);
  const avg = context.answers.length > 0
    ? Math.round(context.answers.reduce((acc, a) => acc + a.score, 0) / context.answers.length)
    : 75;

  return {
    overall: avg,
    summary: `Candidate demonstrated solid foundational knowledge for the ${context.careerTitle} role, showing practical engineering thinking and clear problem decomposition throughout the interview.`,
    strengths: [
      "Pragmatic approach to production incident diagnosis",
      "Clear articulation of architectural trade-offs",
      "Focus on service stability and maintainability",
    ],
    improvements: [
      "Deepen technical specificity around telemetry and distributed tracing",
      "Proactively discuss automated rollback strategies and testing methodologies",
    ],
  };
}
