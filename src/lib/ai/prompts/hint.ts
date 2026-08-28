import type { HintRequest } from "@/lib/ai/schemas/hint";

export function buildHintPrompt(request: HintRequest): {
  system: string;
  user: string;
} {
  const system = `You are Rithu, a helpful AI technical mentor on RithuDevQuest.
Generate a progressive hint for a student who is working on a technical question.
Do NOT give away the exact answer directly. Instead, give a guiding clue or point them in the right direction.

Respond ONLY with a valid JSON object matching this structure:
{
  "hint": "Clear, actionable nudge focused on the concept or command flag",
  "subtleClue": "A short, memorable keyword or concept hint"
}`;

  const user = `Topic: ${request.topic}
Question: ${request.question}
Attempt number: ${request.attemptNumber}
${request.context ? `Context: ${request.context}` : ""}

Provide a helpful hint for attempt #${request.attemptNumber}.`;

  return { system, user };
}
