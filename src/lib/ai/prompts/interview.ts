export type InterviewStartContext = {
  careerTitle: string;
  skillNames: string[];
};

export type InterviewGradeContext = {
  careerTitle: string;
  round: number;
  totalRounds: number;
  questionText: string;
  userAnswer: string;
};

export type InterviewSummaryContext = {
  careerTitle: string;
  answers: {
    questionText: string;
    userAnswer: string;
    score: number;
  }[];
};

export function buildInterviewStartPrompt({
  careerTitle,
  skillNames,
}: InterviewStartContext) {
  return {
    system: [
      "You are a senior technical interviewer conducting a realistic interview",
      `for a "${careerTitle}" role at a top tech company.`,
      "",
      "Generate a single scenario-based interview question. Frame it as a realistic",
      "production engineering situation, architecture challenge, incident response,",
      "or performance bottleneck (e.g. 'Your production service is experiencing sudden",
      "504 timeouts after a canary deployment...', 'How would you architect a distributed rate limiter?').",
      "Make the question specific, practical, and test real understanding rather than simple trivia.",
      "",
      "Respond ONLY with a valid JSON object matching this structure:",
      "{\"question\": \"...\"}",
      "",
      `Skills to focus on: ${skillNames.join(", ")}`,
    ].join("\n"),
    user: `Generate a realistic scenario-based interview question for a ${careerTitle} role as a valid JSON object.`,
  };
}

export function buildInterviewGradePrompt({
  careerTitle,
  round,
  totalRounds,
  questionText,
  userAnswer,
}: InterviewGradeContext) {
  return {
    system: [
      `You are grading an answer from a ${careerTitle} technical interview.`,
      "",
      "Evaluate the candidate's answer on technical correctness, depth, structured communication, and practical engineering trade-offs.",
      "",
      "Output rules:",
      "- score: 0–100 (0–49 = flawed/insufficient, 50–74 = junior/partial, 75–89 = strong senior, 90–100 = exceptional staff-level).",
      "- feedback: 2–3 sentences highlighting what the candidate diagnosed correctly and their key omissions.",
      "- tips: 1–2 actionable coaching points on how to elevate the response (e.g. mention rollback triggers, observability metrics, failure isolation).",
      "- idealAnswer: A comprehensive, structured model answer demonstrating how a Principal/Staff Engineer would answer this exact scenario in a real FAANG/top-tier interview (covering root-cause triage, mitigation, telemetry, and preventative architecture).",
      `- followUpQuestion: A probing follow-up question ONLY if the answer was close and worth expanding on, otherwise null.`,
      "",
      "Respond ONLY with a valid JSON object matching this structure:",
      "{\"score\": number, \"feedback\": \"...\", \"tips\": \"...\" or null, \"idealAnswer\": \"...\", \"followUpQuestion\": \"...\" or null}",
    ].join("\n"),
    user: [
      `## Interview context`,
      `Role: ${careerTitle}`,
      `Round: ${round}/${totalRounds}`,
      "",
      `## Question asked`,
      questionText,
      "",
      `## Candidate's answer`,
      userAnswer,
      "",
      "Evaluate the answer and return your evaluation as a valid JSON object.",
    ].join("\n"),
  };
}

export function buildInterviewSummaryPrompt({
  careerTitle,
  answers,
}: InterviewSummaryContext) {
  const transcript = answers
    .map(
      (a, i) =>
        [
          `### Round ${i + 1}`,
          `Q: ${a.questionText}`,
          `A: ${a.userAnswer}`,
          `Score: ${a.score}/100`,
        ].join("\n"),
    )
    .join("\n\n");

  return {
    system: [
      "You are a senior interviewer summarizing an interview session.",
      "",
      "Provide:",
      "- overall: weighted average score reflecting the full session (not just",
      "  a simple arithmetic mean — weight later rounds more heavily if the",
      "  candidate improved, or less if they peaked early).",
      "- summary: 2–4 sentence overall assessment.",
      "- strengths: 2–5 specific strengths observed.",
      "- improvements: 2–5 concrete areas to improve.",
      "",
      "Respond ONLY with a valid JSON object matching this structure:",
      "{\"overall\": number, \"summary\": \"...\", \"strengths\": [\"...\"], \"improvements\": [\"...\"]}",
    ].join("\n"),
    user: [
      `## Full interview transcript for ${careerTitle} role`,
      "",
      transcript,
      "",
      "Summarize the candidate's performance across all rounds as a valid JSON object.",
    ].join("\n"),
  };
}