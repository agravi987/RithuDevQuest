export default function Loading() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-gradient-to-br from-[oklch(0.12_0.015_260)] via-[#0f1629] to-[oklch(0.17_0.05_155)]">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="relative grid size-12 place-items-center rounded-full bg-gradient-to-br from-primary via-emerald-400 to-cyan-400 animate-pulse-ring">
          <div className="size-16 rounded-full border-2 border-primary/30 animate-spin border-t-transparent" />
        </div>
        <p className="text-sm font-medium text-white/60">Preparing launch sequence...</p>
      </div>
    </div>
  );
}