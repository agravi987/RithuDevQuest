"use client";

import { useEffect } from "react";
import { MobileNav } from "@/components/shared/mobile-nav";
import { SidebarWrapper } from "@/components/shared/sidebar-wrapper";
import { Header } from "@/components/shared/header";
import { ClientShell } from "@/app/(main)/client-shell";
import { useSidebar } from "@/lib/sidebar-context";
import { KeyboardShortcuts } from "@/components/shared/keyboard-shortcuts";
import { RouteLoadingIndicator } from "@/components/shared/route-loading-indicator";

type LayoutContentProps = {
  userName: string;
  userXp: number;
  userLevel: number;
  currentStreak: number;
  userHearts: number;
  children: React.ReactNode;
};

export function LayoutContent({
  userName,
  userXp,
  userLevel,
  currentStreak,
  userHearts,
  children,
}: LayoutContentProps) {
  const { collapsed } = useSidebar();

  useEffect(() => {
    const width = collapsed ? 68 : 220;
    document.documentElement.style.setProperty("--sidebar-width", `${width}px`);
  }, [collapsed]);

  return (
    <ClientShell>
      <KeyboardShortcuts />
      <RouteLoadingIndicator />
      {/* Skip to content for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-primary-foreground focus:shadow-lg"
      >
        Skip to content
      </a>
      <div className="flex min-h-svh">
        {/* Desktop Sidebar - fixed */}
        <SidebarWrapper />

        {/* Mobile Header - fixed, hidden on lg+ */}
        <Header
          userName={userName}
          userXp={userXp}
          userLevel={userLevel}
          currentStreak={currentStreak}
          userHearts={userHearts}
        />

        {/* Main content */}
        <main
          id="main-content"
          className="flex-1 min-h-screen pt-14 animate-page-fade"
          style={{ marginLeft: "var(--sidebar-width, 0px)" }}
        >
          <div className="px-4 py-4 lg:px-6 lg:py-6">
            <div className="mx-auto max-w-6xl">
              {children}
            </div>
          </div>
          {/* Footer */}
          <footer className="border-t border-border/50 px-4 py-6 lg:px-6">
            <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="size-5 rounded-md bg-gradient-to-br from-primary via-emerald-400 to-cyan-400 grid place-items-center">
                  <span className="text-[8px] font-black text-primary-foreground">R</span>
                </div>
                <span className="text-xs font-bold text-muted-foreground">RithuDevQuest</span>
              </div>
              <p className="text-[10px] text-muted-foreground/60">
                © {new Date().getFullYear()} RithuDevQuest · Built for learners, by learners
              </p>
            </div>
          </footer>
        </main>

        {/* Mobile bottom nav */}
        <MobileNav />
      </div>
    </ClientShell>
  );
}
