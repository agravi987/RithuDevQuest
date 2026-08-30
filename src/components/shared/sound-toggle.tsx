"use client";

import { Volume2, VolumeX } from "lucide-react";
import { useSound } from "@/lib/sound-context";
import { Button } from "@/components/ui/button";

export function SoundToggle() {
  const { soundEnabled, toggleSound } = useSound();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleSound}
      aria-label={soundEnabled ? "Mute sounds" : "Enable sounds"}
      className="size-9 transition-all duration-200 hover:bg-primary/5 hover:scale-110"
    >
      {soundEnabled ? (
        <div className="relative">
          <Volume2 className="size-4" />
          {/* Animated sound waves */}
          <span className="absolute -right-0.5 top-0 h-2 w-px rounded-full bg-primary animate-pulse" />
          <span className="absolute -right-1 top-0.5 h-1.5 w-px rounded-full bg-primary/60 animate-pulse" style={{ animationDelay: "0.2s" }} />
        </div>
      ) : (
        <VolumeX className="size-4 text-muted-foreground transition-transform duration-200 hover:rotate-12" />
      )}
    </Button>
  );
}
