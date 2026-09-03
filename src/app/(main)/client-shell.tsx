"use client";

import { SplashScreen } from "@/components/shared/splash-screen";
import { SoundProvider } from "@/lib/sound-context";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { GalaxyToastProvider } from "@/components/ui/galaxy-toast";

export function ClientShell({ children }: { children: React.ReactNode }) {
  return (
    <SoundProvider>
      <GalaxyToastProvider>
        <SplashScreen />
        <ScrollProgress />
        <div className="flex min-h-svh flex-col">
          {children}
        </div>
        <ScrollToTop />
      </GalaxyToastProvider>
    </SoundProvider>
  );
}