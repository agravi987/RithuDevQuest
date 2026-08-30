"use client";

import { SplashScreen } from "@/components/shared/splash-screen";
import { SoundProvider } from "@/lib/sound-context";
import { RithuFloat } from "@/components/mentor/rithu-float";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { CursorTrail } from "@/components/ui/cursor-trail";
import { ShootingStarEffect } from "@/components/ui/shooting-star-effect";
import { WarpSpeedOverlay } from "@/components/ui/warp-speed";
import { GalaxyToastProvider } from "@/components/ui/galaxy-toast";

export function ClientShell({ children }: { children: React.ReactNode }) {
  return (
    <SoundProvider>
      <GalaxyToastProvider>
        <SplashScreen />
        <ScrollProgress />
        <CursorTrail />
        <ShootingStarEffect />
        <WarpSpeedOverlay />
        <div className="flex min-h-svh flex-col">
          {children}
        </div>
        <RithuFloat />
        <ScrollToTop />
      </GalaxyToastProvider>
    </SoundProvider>
  );
}
