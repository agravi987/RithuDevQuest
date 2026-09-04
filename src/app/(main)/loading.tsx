export default function Loading() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="relative grid size-12 place-items-center rounded-full bg-gradient-to-br from-primary via-emerald-400 to-cyan-400 animate-pulse-ring">
          <div className="size-16 rounded-full border-2 border-primary/30 animate-spin border-t-transparent" />
        </div>
        <p className="text-sm font-medium text-muted-foreground">Loading your galaxy...</p>
      </div>
    </div>
  );
}