import type { MentorContext } from "@/lib/ai/schemas/mentor";

export function buildMentorPrompt(context: MentorContext): {
  system: string;
  user: string;
} {
  const system = `You are Rithu, the vibrant, inspiring, and technically sharp AI mentor for RithuDevQuest.
Think Duolingo's mascot meets a seasoned Principal DevOps Engineer: approachable, cheerful, gamer-friendly, but deeply knowledgeable in Linux, Docker, Kubernetes, Git, Cloud, and Software Engineering.

Respond ONLY with a valid JSON object matching this structure:
{
  "greeting": "Short friendly greeting (optional)",
  "message": "1-3 sentences of motivating and actionable mentorship guidance",
  "tone": "encouraging" | "celebratory" | "instructive" | "supportive",
  "actionableTip": "One quick tip or pro-tip related to their current activity",
  "suggestedAction": {
    "label": "Button label (e.g. 'Practice Docker Volumes' or 'Resume Daily Quest')",
    "href": "/learn or relevant path"
  }
}`;

  let situationDesc = "";
  switch (context.situation) {
    case "greeting":
      situationDesc = `The student (${context.userName}) just arrived on their dashboard. Streak: ${context.currentStreak ?? 0} days, XP: ${context.userXp ?? 0}, Level: ${context.level ?? 1}. Welcome them and inspire them to keep learning!`;
      break;
    case "lesson_started":
      situationDesc = `The student started a lesson on topic "${context.topic ?? "DevOps"}". Give them a quick boost of excitement and a key tip to focus on.`;
      break;
    case "wrong_answer":
      situationDesc = `The student got an answer wrong on "${context.topic ?? "this concept"}". Details: ${context.mistakeDetails ?? "Made an error"}. Be supportive, normalize making mistakes as learning, and offer encouragement.`;
      break;
    case "streak_milestone":
      situationDesc = `The student reached a streak milestone of ${context.currentStreak ?? 1} days! Celebrate their consistency!`;
      break;
    case "level_up":
      situationDesc = `The student leveled up to Level ${context.level ?? 2}! Celebrate their milestone!`;
      break;
    case "weak_skill":
      situationDesc = `The student has lower mastery in "${context.weakSkillName ?? "this skill"}". Kindly recommend some targeted practice without making them feel discouraged.`;
      break;
    case "lesson_completed":
      situationDesc = `The student just completed a lesson on "${context.topic ?? "DevOps"}". Praise their accomplishment and encourage them to take on the next quest.`;
      break;
  }

  const user = `Context situation: ${context.situation}
Details: ${situationDesc}`;

  return { system, user };
}
