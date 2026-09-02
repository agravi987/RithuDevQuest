"use client";

import { useRef, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  RITHU_MOOD_EMOJIS,
  RITHU_MOOD_COLORS,
  RITHU_MOOD_ANIMATIONS,
  type RithuMood,
} from "@/components/mentor/rithu-moods";

type RithuFloatProps = {
  className?: string;
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
  const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();

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

  // React to client-side route changes (usePathname fires on every navigation).
  // Previously this listened to the window `popstate` event, which Next.js
  // client navigation does not emit — so the mentor kept a stale mood.
  useEffect(() => {
    const path = pathname;

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
    if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
    dismissTimerRef.current = setTimeout(() => setDismissed(true), 5000);
  }, [pathname]);

  useEffect(() => {
    return () => {
      if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
    };
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
    <div className={cn("fixed bottom-28 right-4 z-50 md:bottom-6", className)}>
      <AnimatePresence>
        {/* Speech bubble */}
        {isExpanded && message && !dismissed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            className="absolute bottom-full right-0 mb-3 w-64"
          >
            <div
              role="dialog"
              aria-label="Rithu's message"
              className="relative rounded-2xl rounded-br-sm border border-border bg-card p-3 shadow-xl"
            >
              <button
                type="button"
                aria-label="Dismiss message"
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
        animate={RITHU_MOOD_ANIMATIONS[mood]}
        onClick={handleClick}
        className="relative group"
        aria-label="Rithu AI Mentor"
      >
        {/* Glow ring */}
        <div className={cn(
          "absolute -inset-2 rounded-full bg-gradient-to-br opacity-20 blur-lg transition-opacity group-hover:opacity-40",
          RITHU_MOOD_COLORS[mood]
        )} />

        {/* Main circle */}
        <div className={cn(
          "relative grid size-14 place-items-center rounded-full bg-gradient-to-br shadow-xl border border-white/30 transition-all group-hover:scale-110",
          RITHU_MOOD_COLORS[mood]
        )}>
          <span className="text-2xl drop-shadow-sm">{RITHU_MOOD_EMOJIS[mood]}</span>

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
