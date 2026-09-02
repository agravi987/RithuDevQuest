import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-5 pb-12 animate-page-fade py-6">
      {/* Hero skeleton */}
      <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-card p-6 shadow-lg shadow-black/5">
        <div className="absolute -left-16 -top-16 size-40 rounded-full bg-primary/5 blur-3xl" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-2.5 w-24 bg-muted" />
            <Skeleton className="h-7 w-56 bg-muted" />
            <Skeleton className="h-3.5 w-72 bg-muted/60" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-8 w-20 rounded-xl bg-muted" />
            <Skeleton className="h-8 w-16 rounded-xl bg-muted" />
            <Skeleton className="h-8 w-14 rounded-xl bg-muted hidden sm:block" />
          </div>
        </div>
      </div>

      {/* Grid skeletons */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* Mission card skeleton */}
          <div className="rounded-3xl border border-border/50 bg-card p-6 shadow-lg shadow-black/5">
            <div className="flex items-center gap-3 mb-4">
              <Skeleton className="size-14 rounded-2xl bg-muted" />
              <div className="space-y-2">
                <Skeleton className="h-2.5 w-32 bg-muted" />
                <Skeleton className="h-5 w-40 bg-muted" />
                <Skeleton className="h-3 w-48 bg-muted/60" />
              </div>
            </div>
            <Skeleton className="h-2 w-full rounded-full bg-muted mb-2" />
            <div className="flex justify-between">
              <Skeleton className="h-3 w-40 bg-muted/60" />
              <Skeleton className="h-3 w-28 bg-muted/60" />
            </div>
            <div className="mt-4">
              <Skeleton className="h-2.5 w-16 bg-muted/60 mb-2" />
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-8 w-24 rounded-full bg-muted" />
                ))}
              </div>
            </div>
            <Skeleton className="mt-4 h-10 w-40 rounded-xl bg-primary/10" />
          </div>

          {/* Action tiles skeleton */}
          <div>
            <Skeleton className="h-2.5 w-24 bg-muted mb-2 ml-1" />
            <div className="grid grid-cols-1 min-[400px]:grid-cols-2 sm:grid-cols-3 gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-2xl border border-border/50 bg-card p-5 flex flex-col items-center gap-3">
                  <Skeleton className="size-11 rounded-xl bg-muted" />
                  <div className="space-y-1.5 text-center">
                    <Skeleton className="h-4 w-20 mx-auto bg-muted" />
                    <Skeleton className="h-2.5 w-28 mx-auto bg-muted/60" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {/* Daily quests skeleton */}
          <div className="rounded-2xl border border-border/50 bg-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-28 bg-muted" />
              <Skeleton className="h-4 w-12 bg-muted rounded-full" />
            </div>
            <Skeleton className="h-1.5 w-full rounded-full bg-muted" />
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 rounded-xl bg-muted/30 p-3">
                <Skeleton className="size-8 rounded-lg bg-muted shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3 w-24 bg-muted" />
                  <Skeleton className="h-2 w-full rounded-full bg-muted" />
                </div>
              </div>
            ))}
          </div>

          {/* Constellation map skeleton */}
          <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-muted/20 to-muted/10 p-6 space-y-4" style={{ minHeight: 260 }}>
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 bg-muted" />
              <Skeleton className="h-4 w-36 bg-muted" />
            </div>
            <div className="flex items-center justify-center gap-4 py-8">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="size-10 rounded-full bg-muted" />
              ))}
            </div>
          </div>

          {/* Skills skeleton */}
          <div className="rounded-2xl border border-border/50 bg-card p-4 space-y-3">
            <Skeleton className="h-4 w-20 bg-muted" />
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-1.5">
                <Skeleton className="h-3 w-24 bg-muted" />
                <Skeleton className="h-1.5 w-full rounded-full bg-muted" />
              </div>
            ))}
          </div>

          {/* Mentor skeleton */}
          <div className="rounded-2xl border border-border/50 bg-card p-4">
            <div className="flex items-center gap-3 mb-3">
              <Skeleton className="size-10 rounded-xl bg-muted" />
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-28 bg-muted" />
                <Skeleton className="h-2.5 w-32 bg-muted/60" />
              </div>
            </div>
            <Skeleton className="h-3 w-full bg-muted/60 mb-1" />
            <Skeleton className="h-3 w-3/4 bg-muted/60 mb-3" />
            <div className="flex justify-between">
              <Skeleton className="h-2.5 w-24 bg-muted/40" />
              <Skeleton className="h-2.5 w-16 bg-primary/10" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
