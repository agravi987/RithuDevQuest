export type MentorTip = {
  message: string;
  topic: string;
  actionHref?: string;
  actionLabel?: string;
};

export const MENTOR_PRO_TIPS: MentorTip[] = [
  {
    topic: "Linux",
    message: "Use `grep -rn 'pattern' .` to recursively search for text with line numbers across all files in your current directory.",
    actionHref: "/learn/linux/shell-basics/navigating-directories",
    actionLabel: "Practice Navigation",
  },
  {
    topic: "Docker",
    message: "Multi-stage builds in Dockerfiles keep your production images lean and secure by excluding build tools from final runtime images.",
    actionHref: "/practice",
    actionLabel: "Generate Docker Quiz",
  },
  {
    topic: "Git",
    message: "Remember that `git switch -c <branch>` is the modern, unambiguous alternative to `git checkout -b <branch>`.",
    actionHref: "/learn/git",
    actionLabel: "Review Git Roadmap",
  },
  {
    topic: "Kubernetes",
    message: "Always define resource requests and limits in Pod specs so the Kubernetes scheduler can allocate compute efficiently.",
    actionHref: "/practice",
    actionLabel: "Practice K8s Questions",
  },
];

export function getRandomMentorTip(): MentorTip {
  const index = Math.floor(Math.random() * MENTOR_PRO_TIPS.length);
  return MENTOR_PRO_TIPS[index]!;
}

export type WrongAnswerContext = {
  question: string;
  userAnswer: string;
  correctAnswer: string;
  explanation: string;
};

export type MilestoneContext = {
  type: "achievement" | "level_up" | "streak" | "first_lesson";
  title: string;
  description?: string;
};

/**
 * Generate a contextual response for a wrong answer.
 */
export function getWrongAnswerMessage(
  context: WrongAnswerContext,
): {
  message: string;
  explanation: string;
} {
  const encouragement = [
    "Don't worry — this one trips up everyone at first.",
    "Good attempt! Let me explain what happened.",
    "Almost! Here's the key insight you need.",
    "That's a common mistake. Let's clear it up.",
  ];
  const idx = Math.floor(Math.random() * encouragement.length);

  return {
    message: encouragement[idx]!,
    explanation: context.explanation,
  };
}

/**
 * Generate a celebration message for a milestone.
 */
export function getMilestoneMessage(
  context: MilestoneContext,
): {
  title: string;
  message: string;
} {
  const messages: Record<MilestoneContext["type"], string[]> = {
    achievement: [
      `Congratulations on unlocking "${context.title}"!`,
      `You earned "${context.title}" — amazing progress!`,
      `Achievement unlocked: "${context.title}"! Keep going!`,
    ],
    level_up: [
      `Level up! You reached Level ${context.title}!`,
      `You've leveled up to ${context.title}! Your skills are growing.`,
    ],
    streak: [
      "Your dedication is paying off — the streak lives on!",
      "Another day, another step toward mastery. Keep that streak alive!",
    ],
    first_lesson: [
      "Welcome aboard! Your first lesson is complete — the journey begins!",
      "You just completed your first quest! There's so much more to explore.",
    ],
  };

  const options = messages[context.type] ?? messages.achievement!;
  const idx = Math.floor(Math.random() * options.length);

  return {
    title: context.title,
    message: options[idx]!,
  };
}
