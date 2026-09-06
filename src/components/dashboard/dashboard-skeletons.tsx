import { Skeleton } from "@/components/ui/skeleton";

export function HeroSkeleton() {
  return (
    <div className="rounded-2xl border border-border/40 bg-card/40 p-4">
      <Skeleton className="h-5 w-64" />
      <Skeleton className="mt-2 h-3 w-full max-w-xl" />
    </div>
  );
}

export function CareersSkeleton() {
  return (
    <div className="flex flex-1 flex-col gap-4 min-w-0">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-9 w-28 shrink-0 rounded-full" />
        ))}
      </div>

      <div className="rounded-3xl border border-border/40 bg-card/40 p-4 sm:p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Skeleton variant="circle" className="size-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-2.5 w-24" />
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
          <Skeleton className="h-6 w-14 rounded-full" />
        </div>
        <Skeleton className="h-2 w-full rounded-full mb-1.5" />
        <div className="flex justify-between mb-4">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
        <div className="flex gap-2 mb-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-8 w-24 rounded-full" />
          ))}
        </div>
        <Skeleton variant="button" className="h-11 w-44 rounded-xl" />
      </div>

      <Skeleton className="h-3 w-24" />
      <div className="grid grid-cols-1 min-[400px]:grid-cols-2 sm:grid-cols-3 gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-2xl border border-border/40 bg-card/40 p-5 flex flex-col items-center gap-3">
            <Skeleton variant="circle" className="size-11" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-2.5 w-32" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function RailSkeleton() {
  return (
    <div className="flex w-full flex-col gap-4 lg:w-80">
      <div className="rounded-2xl border border-border/40 bg-card/40 p-4 flex items-center gap-3">
        <Skeleton variant="circle" className="size-10 shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-2.5 w-full" />
        </div>
      </div>

      <div className="rounded-2xl border border-border/40 bg-card/40 p-4 space-y-3">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-1.5 w-full rounded-full" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3 rounded-xl bg-muted/30 p-3">
            <Skeleton variant="circle" className="size-8 shrink-0" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-2 w-full rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}