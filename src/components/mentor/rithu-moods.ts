export type RithuMood = "happy" | "thinking" | "excited" | "sad" | "strong" | "idle";

export const RITHU_MOOD_EMOJIS: Record<RithuMood, string> = {
  happy: "😊",
  thinking: "🤔",
  excited: "🎉",
  sad: "😢",
  strong: "💪",
  idle: "👋",
};

export const RITHU_MOOD_COLORS: Record<RithuMood, string> = {
  happy: "from-emerald-400 to-primary",
  thinking: "from-blue-400 to-cyan-400",
  excited: "from-amber-400 to-orange-500",
  sad: "from-slate-400 to-slate-500",
  strong: "from-red-400 to-pink-500",
  idle: "from-primary to-emerald-400",
};

export const RITHU_MOOD_ANIMATIONS: Record<
  RithuMood,
  { y?: number[]; scale?: number[]; rotate?: number[]; transition?: Record<string, unknown> }
> = {
  happy: { rotate: [0, -5, 5, -5, 0], transition: { duration: 0.5, repeat: Infinity, repeatDelay: 4 } },
  thinking: { y: [0, -3, 0], transition: { duration: 1.5, repeat: Infinity } },
  excited: { scale: [1, 1.1, 1], rotate: [0, -10, 10, -10, 0], transition: { duration: 0.6, repeat: Infinity, repeatDelay: 2 } },
  sad: { y: [0, 2, 0], transition: { duration: 2, repeat: Infinity } },
  strong: { scale: [1, 1.15, 1], transition: { duration: 0.4, repeat: Infinity, repeatDelay: 1.5 } },
  idle: { y: [0, -6, 0], transition: { duration: 3, repeat: Infinity, ease: "easeInOut" } },
};
