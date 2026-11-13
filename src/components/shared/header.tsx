"use client";

import { LogOut, Heart } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { SoundToggle } from "@/components/shared/sound-toggle";
import { handleSignOut } from "@/app/(main)/logout-action";
import { calculateLevel } from "@/lib/gamification/levels";

type HeaderProps = {
  userName: string;
  userXp: number;
  userLevel: number;
  currentStreak: number;
  userHearts: number;
};

export function Header({ userName, userXp, currentStreak, userHearts }: HeaderProps) {
  const { level } = calculateLevel(userXp);
  const initials = userName
    .split(" ")
    .map((part: string) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header
      className="fixed top-0 right-0 z-30 border-b border-border/50 bg-background/80 backdrop-blur-xl no-print transition-[left] duration-300"
      style={{ left: "var(--sidebar-width, 0px)" }}
    >
      <div className="flex h-14 items-center justify-between gap-4 px-4 lg:px-6">
        {/* Right: Stats + Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 ml-auto min-w-0">
          {/* Stats badges */}
          {/* Duolingo Signature Stats Pills */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Streak Pill */}
            <div
              className={`flex items-center gap-1.5 rounded-2xl px-3 py-1.5 text-xs font-black transition-all ${
                currentStreak > 0
                  ? "bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-[0_2px_0_0_#d97706]"
                  : "bg-white/5 text-slate-400 border border-white/10"
              }`}
              title={`${currentStreak} day streak`}
            >
              <span className={`text-sm ${currentStreak > 0 ? "animate-bounce" : ""}`}>🔥</span>
              <span>{currentStreak}</span>
            </div>

            {/* XP / Stardust Gem Pill */}
            <div
              className="flex items-center gap-1.5 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 px-3 py-1.5 text-xs font-black text-cyan-400 shadow-[0_2px_0_0_#0284c7]"
              title={`${userXp.toLocaleString()} Stardust XP`}
            >
              <span className="text-sm">💎</span>
              <span>{userXp.toLocaleString()}</span>
            </div>

            {/* Hearts Pill */}
            <div
              className={`flex items-center gap-1.5 rounded-2xl border px-3 py-1.5 text-xs font-black transition-all ${
                userHearts <= 1
                  ? "bg-red-500/20 text-red-400 border-red-500/40 shadow-[0_2px_0_0_#dc2626] animate-pulse"
                  : "bg-red-500/15 text-red-400 border-red-500/30 shadow-[0_2px_0_0_#dc2626]"
              }`}
              title={`${userHearts} Cosmic Hearts remaining`}
            >
              <Heart className="size-4 fill-current text-red-400" aria-hidden="true" />
              <span>{userHearts}</span>
            </div>

            {/* Level Star Pill */}
            <div
              className="hidden sm:flex items-center gap-1.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 px-3 py-1.5 text-xs font-black text-emerald-400 shadow-[0_2px_0_0_#059669]"
              title={`Level ${level} — ${userXp} XP`}
            >
              <span className="text-sm">⭐</span>
              <span>LVL {level}</span>
            </div>
          </div>

          <div className="hidden sm:block h-6 w-px bg-border/50" />

          <div className="flex items-center gap-1">
            <SoundToggle />
          </div>

          <div className="h-6 w-px bg-border/50" />

          <div className="flex items-center gap-2">
            <Avatar className="size-8 border-2 border-primary/30 shadow-md shadow-primary/10 transition-all duration-300 hover:border-primary/60 hover:shadow-lg hover:shadow-primary/20 hover:scale-110">
              <AvatarFallback className="bg-primary/10 text-[10px] font-bold text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="hidden xl:block max-w-[9rem] truncate text-sm font-semibold text-foreground">
              {userName}
            </span>
            <form action={handleSignOut}>
              <button
                type="submit"
                className="grid size-8 place-items-center rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                title="Sign out"
              >
                <LogOut className="size-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </header>
  );
}
