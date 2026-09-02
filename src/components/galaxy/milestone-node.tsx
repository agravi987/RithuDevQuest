"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Star, Trophy, Zap } from "lucide-react";

type MilestoneNodeProps = {
  type: "xp_reward" | "module_complete" | "achievement";
  title: string;
  description?: string;
  xp?: number;
  className?: string;
};

const milestoneConfig = {
  xp_reward: {
    icon: Zap,
    gradient: "from-amber-400 via-yellow-500 to-orange-500",
    glow: "shadow-amber-400/30",
    ring: "border-amber-400/30",
    label: "XP Reward",
  },
  module_complete: {
    icon: Trophy,
    gradient: "from-purple-400 via-violet-500 to-fuchsia-500",
    glow: "shadow-purple-400/30",
    ring: "border-purple-400/30",
    label: "Sector Complete",
  },
  achievement: {
    icon: Star,
    gradient: "from-emerald-400 via-teal-500 to-cyan-500",
    glow: "shadow-emerald-400/30",
    ring: "border-emerald-400/30",
    label: "Achievement Unlocked",
  },
};

export function MilestoneNode({
  type,
  title,
  description,
  xp,
  className,
}: MilestoneNodeProps) {
  const config = milestoneConfig[type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className={cn("relative flex flex-col items-center gap-2 py-4", className)}
    >
      {/* Connector lines */}
      <div className="absolute left-1/2 top-0 h-4 w-px -translate-x-1/2 bg-gradient-to-b from-foreground/20 to-foreground/10" />

      {/* Milestone ring */}
      <div className="relative">
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.15, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -inset-3 rounded-full blur-xl"
          style={{
            background: `radial-gradient(circle, ${type === "xp_reward" ? "rgba(251,191,36,0.5)" : type === "module_complete" ? "rgba(168,85,247,0.5)" : "rgba(52,211,153,0.5)"} 0%, transparent 70%)`,
          }}
        />

        <div
          className={cn(
            "relative grid size-12 place-items-center rounded-full border-2 bg-gradient-to-br shadow-lg",
            config.gradient,
            config.glow,
            config.ring,
          )}
          style={{
            boxShadow: `inset -6px -8px 14px rgba(0,0,0,0.4), inset 4px 6px 12px rgba(255,255,255,0.3), 0 8px 20px -6px rgba(0,0,0,0.5)`,
          }}
        >
          <Icon className="size-5 text-white drop-shadow" />
          {/* Inner highlight */}
          <div className="pointer-events-none absolute left-[18%] top-[12%] size-2.5 rounded-full bg-white/50 blur-[1px]" />
        </div>
      </div>

      {/* Label */}
      <div className="text-center max-w-[140px]">
        <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60">
          {config.label}
        </p>
        <p className="text-xs font-bold text-foreground/90 mt-0.5">{title}</p>
        {description && (
          <p className="text-[10px] text-muted-foreground/70 mt-0.5">
            {description}
          </p>
        )}
        {xp !== undefined && xp > 0 && (
          <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-amber-400/10 px-2 py-0.5 text-[9px] font-bold text-amber-400">
            <Zap className="size-2.5" />
            +{xp} XP
          </span>
        )}
      </div>

      {/* Connector line below */}
      <div className="absolute left-1/2 bottom-0 h-4 w-px -translate-x-1/2 bg-gradient-to-b from-foreground/10 to-foreground/20" />
    </motion.div>
  );
}
