export type LoadingMessage =
  | { kind: "quote"; text: string; author?: string }
  | { kind: "tip"; text: string };

const QUOTES: Array<{ text: string; author?: string }> = [
  { text: "Every expert was once a beginner.", author: "Unknown" },
  { text: "The more you learn, the more you realize how much is left to explore." },
  { text: "Small steps every day build galaxies of skill." },
  { text: "Your future is created by what you do today, not tomorrow." },
  { text: "Consistency beats intensity. Show up and ship.", author: "Unknown" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
  { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { text: "An expert is someone who has failed in all the ways one can fail.", author: "Neil Gaiman" },
  { text: "The only way to learn a new technology is by using it, breaking it, and fixing it." },
  { text: "Practice isn't the thing you do once you're good. It's the thing you do that makes you good." },
];

const TIPS: string[] = [
  "Spaced repetition beats cramming. Revisit yesterday's lesson for a quick review.",
  "Typing commands beats watching them — practice every command you see.",
  "Explain a concept out loud — teaching is the best test of understanding.",
  "10 focused minutes a day beats a two-hour session once a week.",
  "Check error messages bottom-up — the real culprit is usually the first line of the trace.",
  "Draw the architecture before writing code — diagrams save hours of rework.",
  "Keyboard shortcuts are a force multiplier. Learn one new one each day.",
  "Finished is better than perfect. Ship, then iterate.",
  "Keep a one-line learn log — what you built or learned today.",
  "Try today's Daily Challenge for a memory boost and bonus XP.",
  "Streaks build habits. Protect yours with a quick daily mission.",
  "Spot a term you don't know? Look it up now, not later — context makes it stick.",
  "Re-read your strongest lesson this week to lock in the win.",
  "Write down the tradeoffs you can think of — then go verify them hands-on.",
];

function interleave(): LoadingMessage[] {
  const messages: LoadingMessage[] = [];
  const max = Math.max(QUOTES.length, TIPS.length);
  for (let i = 0; i < max; i++) {
    if (i < QUOTES.length) messages.push({ kind: "quote", ...QUOTES[i]! });
    if (i < TIPS.length) messages.push({ kind: "tip", text: TIPS[i]! });
  }
  return messages;
}

/** Stable order so server fallback and client hydration agree on the first frame. */
export function getLoadingMessages(): LoadingMessage[] {
  return interleave();
}