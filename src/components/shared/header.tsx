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
  const { level, progressPercentage } = calculateLevel(userXp);
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
          <div className="hidden sm:flex items-center gap-1.5 shrink-0">
            <div
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                currentStreak > 7
                  ? "bg-streak/15 text-streak border border-streak/20"
                  : "bg-streak/10 text-streak"
              }`}
              title={`${currentStreak} day streak`}
            >
              <span className={currentStreak > 7 ? "animate-bounce" : ""}>🔥</span>
              <span>{currentStreak}</span>
            </div>

            <div
              className="flex items-center gap-1 rounded-lg bg-xp/10 px-2.5 py-1 text-xs font-bold text-xp"
              title={`${userXp.toLocaleString()} XP`}
            >
              <span>⚡</span>
              <span>{userXp.toLocaleString()}</span>
            </div>

            <div
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold text-red-500 ${
                userHearts <= 2 ? "bg-red-500/15 animate-pulse" : "bg-red-500/10"
              }`}
              title={`${userHearts} hearts`}
            >
              <Heart className="size-3.5 fill-current" aria-hidden="true" />
              <span>{userHearts}</span>
            </div>

            <div
              className="flex flex-col items-center gap-0.5 rounded-lg bg-level/10 px-2.5 py-1 text-xs font-bold text-level"
              title={`Level ${level} — ${userXp} XP`}
            >
              <div className="flex items-center gap-1">
                <span>⭐</span>
                <span>Lv.{level}</span>
              </div>
              <div className="w-full h-1 rounded-full bg-level/20 overflow-hidden">
                <div
                  className="h-full bg-level rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
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
