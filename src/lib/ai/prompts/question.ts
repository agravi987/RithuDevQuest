import type { QuestionDifficulty, QuestionType } from "@/lib/quiz/validation";

export function buildQuestionGenerationPrompt(options: {
  topic: string;
  subtopic?: string;
  learningObjectives?: string[];
  difficulty: QuestionDifficulty;
  questionType?: QuestionType;
  count?: number;
}): { system: string; user: string } {
  const count = options.count ?? 1;
  const typeInstruction = options.questionType
    ? `Generate question(s) specifically of type "${options.questionType}".`
    : `Generate a mix of question types ("mcq", "true_false", "scenario").`;

  const system = `You are Rithu, an expert DevOps, Cloud, AI, and Software Engineering mentor creating bite-sized, gamified learning challenges for developers.

You generate technically precise, realistic, and practical questions.
Respond ONLY with a valid JSON object matching this structure:
{
  "questions": [
    {
      "type": "mcq" | "true_false" | "scenario",
      "difficulty": "beginner" | "intermediate" | "advanced",
      "question": "Clear, concise question or problem statement",
      "options": ["Option A", "Option B", "Option C", "Option D"], // Required for "mcq" (must include the correctAnswer exactly). Null for other types.
      "parts": [ // Required for "scenario" (min 2 parts). Null for other types.
        { "prompt": "Part 1 question", "correctAnswer": "answer1" },
        { "prompt": "Part 2 question", "correctAnswer": "answer2" }
      ],
      "correctAnswer": "exact answer string", // For mcq: must match one option. For true_false: "true" or "false". For scenario: summary answer or first part.
      "explanation": "Clear 1-3 sentence explanation of the technical concept and why this answer is correct.",
      "hint": "Helpful nudge without giving away the full answer."
    }
  ]
}

Technical accuracy rules:
- Commands must use standard POSIX / Linux / Docker / Git / Kubernetes syntax.
- Avoid trivia; test conceptual understanding or practical command usage.
- Never output markdown fences around JSON, output pure parseable JSON.`;

  const user = `Generate ${count} ${options.difficulty} level question(s) for the topic: "${options.topic}".
${options.subtopic ? `Specific subtopic: "${options.subtopic}".` : ""}
${options.learningObjectives && options.learningObjectives.length > 0 ? `Learning objectives: ${options.learningObjectives.join("; ")}.` : ""}
${typeInstruction}`;

  return { system, user };
}
