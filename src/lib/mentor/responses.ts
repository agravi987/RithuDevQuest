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
