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
      "Generate a single concise interview question. The question should be",
      "specific, test real understanding, and feel like a genuine interview",
      "question (not a generic trivia query).",
      "",
      "Make the question challenging but fair — ideally at an intermediate level",
      "to start, leaving room to ask harder follow-ups as the interview progresses.",
      "",
      "Return exactly: {\"question\": \"...\"}",
      "",
      `Skills to focus on: ${skillNames.join(", ")}`,
    ].join("\n"),
    user: `Generate the first interview question for a ${careerTitle} role.`,
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
      "Evaluate the answer on correctness, clarity, and depth. Be strict but",
      "fair. Consider whether the answer would satisfy a real interviewer.",
      "",
      "Output rules:",
      "- score: 0–100 (0 = completely wrong, 50 = partially correct, 75 = solid, 90+ = exceptional).",
      "- feedback: 2–4 sentences. State what was right, what was wrong, and why.",
      "- tips: concrete next-steps / key points the candidate missed. Null if the answer was already excellent.",
      `- followUpQuestion: a direct follow-up or deeper probing question ONLY if the answer`,
      `  was "close but incomplete" or "partially correct" and you want to hear more`,
      `  detail. Set to null if the answer was clearly complete/wrong — don't waste a round`,
      `  asking "can you elaborate".`,
      "",
      "Return: {\"score\": number, \"feedback\": \"...\", \"tips\": \"...\" or null,",
      "\"followUpQuestion\": \"...\" or null}",
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
      "Return: {\"overall\": number, \"summary\": \"...\",",
      "\"strengths\": [...], \"improvements\": [...]}",
    ].join("\n"),
    user: [
      `## Full interview transcript for ${careerTitle} role`,
      "",
      transcript,
    ].join("\n"),
  };
}