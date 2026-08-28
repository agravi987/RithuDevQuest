import { Sparkles } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4 text-center p-8">
      <div className="relative">
        <div className="size-16 rounded-3xl bg-primary/15 border-2 border-primary/30 flex items-center justify-center text-primary animate-pulse">
          <Sparkles className="size-8 animate-spin" />
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="font-bold text-base tracking-tight">Loading quest...</h3>
        <p className="text-xs text-muted-foreground">Preparing your challenges and stats</p>
      </div>
    </div>
  );
}
