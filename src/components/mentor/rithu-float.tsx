"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type RithuFloatProps = {
  className?: string;
};

type RithuMood = "happy" | "thinking" | "excited" | "sad" | "strong" | "idle";

const moodEmojis: Record<RithuMood, string> = {
  happy: "😊",
  thinking: "🤔",
  excited: "🎉",
  sad: "😢",
  strong: "💪",
  idle: "👋",
};

const moodColors: Record<RithuMood, string> = {
  happy: "from-emerald-400 to-primary",
  thinking: "from-blue-400 to-cyan-400",
  excited: "from-amber-400 to-orange-500",
  sad: "from-slate-400 to-slate-500",
  strong: "from-red-400 to-pink-500",
  idle: "from-primary to-emerald-400",
};

const moodAnimations: Record<RithuMood, { y?: number[]; scale?: number[]; rotate?: number[]; transition?: Record<string, unknown> }> = {
  happy: { rotate: [0, -5, 5, -5, 0], transition: { duration: 0.5, repeat: Infinity, repeatDelay: 4 } },
  thinking: { y: [0, -3, 0], transition: { duration: 1.5, repeat: Infinity } },
  excited: { scale: [1, 1.1, 1], rotate: [0, -10, 10, -10, 0], transition: { duration: 0.6, repeat: Infinity, repeatDelay: 2 } },
  sad: { y: [0, 2, 0], transition: { duration: 2, repeat: Infinity } },
  strong: { scale: [1, 1.15, 1], transition: { duration: 0.4, repeat: Infinity, repeatDelay: 1.5 } },
  idle: { y: [0, -6, 0], transition: { duration: 3, repeat: Infinity, ease: "easeInOut" } },
};

const timeBasedMessages = [
  { hour: [6, 12], messages: ["Good morning! ☀️ Ready to learn?", "Rise and shine! Time for some DevOps! 🌅", "Morning! Let's start with a lesson! ☕"] },
  { hour: [12, 17], messages: ["Afternoon! Keep the momentum going! 💪", "Mid-day study session? Great idea! 📚", "Afternoon coding time! Let's go! ⚡"] },
  { hour: [17, 21], messages: ["Evening! Perfect time for a quest! 🌙", "Night owl study session? I'm here! 🦉", "Evening practice makes perfect! 🎯"] },
  { hour: [21, 6], messages: ["Late night learning? dedication! 🌟", "Burning the midnight oil? Let's go! 🔥", "Night time is coding time! 💻"] },
];

function getTimeMessage(): string {
  const hour = new Date().getHours();
  for (const group of timeBasedMessages) {
    if (hour >= group.hour[0] && hour < group.hour[1]) {
      return group.messages[Math.floor(Math.random() * group.messages.length)]!;
    }
  }
  return "Hey there! Ready to learn? 👋";
}

export function RithuFloat({ className }: RithuFloatProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [mood, setMood] = useState<RithuMood>("idle");
  const [message, setMessage] = useState("");
  const [dismissed, setDismissed] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  // Show idle greeting on mount
  useEffect(() => {
    if (!hasShown) {
      setMessage(getTimeMessage());
      setMood("idle");
      setHasShown(true);

      // Auto-dismiss after 8 seconds
      const timer = setTimeout(() => {
        setDismissed(true);
      }, 8000);

      return () => clearTimeout(timer);
    }
  }, [hasShown]);

  // Listen for URL changes to update mood
  useEffect(() => {
    const handleRouteChange = () => {
      const path = window.location.pathname;
      if (path.includes("/practice")) {
        setMood("thinking");
        setMessage("Practice mode! You got this! 🎯");
      } else if (path.includes("/achievements")) {
        setMood("excited");
        setMessage("Look at all your badges! 🏆");
      } else if (path.includes("/leaderboard")) {
        setMood("strong");
        setMessage("Climb the leaderboard! 💪");
      } else if (path.includes("/learn")) {
        setMood("happy");
        setMessage("Learning time! Let's go! 📚");
      } else {
        setMood("idle");
        setMessage(getTimeMessage());
      }
      setDismissed(false);

      // Auto-dismiss after 5 seconds
      setTimeout(() => setDismissed(true), 5000);
    };

    // Initial mood
    handleRouteChange();

    window.addEventListener("popstate", handleRouteChange);
    return () => window.removeEventListener("popstate", handleRouteChange);
  }, []);

  function handleClick() {
    if (isExpanded) {
      setIsExpanded(false);
      return;
    }
    setIsExpanded(true);
    setDismissed(false);

    // Cycle through moods on click
    const moods: RithuMood[] = ["happy", "excited", "strong", "thinking"];
    const currentIdx = moods.indexOf(mood);
    const nextMood = moods[(currentIdx + 1) % moods.length] ?? "idle";
    setMood(nextMood);

    const messages = [
      "Need help? I'm always here! 🤖",
      "You're doing great! Keep it up! ⭐",
      "Try the Practice Arena for extra XP! 🎯",
      "Don't forget to maintain your streak! 🔥",
      "Every lesson brings you closer to mastery! 🧠",
    ];
    setMessage(messages[Math.floor(Math.random() * messages.length)]!);
  }

  return (
    <div className={cn("fixed bottom-20 right-4 z-50 md:bottom-6", className)}>
      <AnimatePresence>
        {/* Speech bubble */}
        {isExpanded && message && !dismissed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            className="absolute bottom-full right-0 mb-3 w-64"
          >
            <div className="relative rounded-2xl rounded-br-sm border border-border bg-card p-3 shadow-xl">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDismissed(true);
                }}
                className="absolute -right-2 -top-2 size-5 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="size-3" />
              </button>
              <p className="text-sm text-foreground leading-relaxed pr-4">{message}</p>
              {/* Arrow */}
              <div className="absolute -bottom-1.5 right-4 size-3 rotate-45 border-r border-b border-border bg-card" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rithu button */}
      <motion.button
        animate={moodAnimations[mood]}
        onClick={handleClick}
        className="relative group"
        aria-label="Rithu AI Mentor"
      >
        {/* Glow ring */}
        <div className={cn(
          "absolute -inset-2 rounded-full bg-gradient-to-br opacity-20 blur-lg transition-opacity group-hover:opacity-40",
          moodColors[mood]
        )} />

        {/* Main circle */}
        <div className={cn(
          "relative grid size-14 place-items-center rounded-full bg-gradient-to-br shadow-xl border-2 border-white/30 transition-all group-hover:scale-110",
          moodColors[mood]
        )}>
          <span className="text-2xl drop-shadow-sm">{moodEmojis[mood]}</span>

          {/* Sparkle */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute -right-1 -top-1"
          >
            <span className="text-xs">✨</span>
          </motion.div>

          {/* Notification dot */}
          {!dismissed && (
            <div className="absolute -left-1 -top-1 size-3 rounded-full bg-red-500 border-2 border-card animate-pulse" />
          )}
        </div>
      </motion.button>
    </div>
  );
}
