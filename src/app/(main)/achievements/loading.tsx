import { Skeleton } from "@/components/ui/skeleton";

export default function AchievementsLoading() {
  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto pb-12">
      {/* Hero header skeleton */}
      <div className="rounded-3xl border bg-card p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <Skeleton className="size-24 rounded-full shrink-0" />
          <div className="flex-1 space-y-3 text-center sm:text-left">
            <Skeleton className="h-3 w-28 mx-auto sm:mx-0" />
            <Skeleton className="h-7 w-48 mx-auto sm:mx-0" />
            <Skeleton className="h-3 w-64 mx-auto sm:mx-0" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-8 w-20 rounded-full" />
            <Skeleton className="h-8 w-16 rounded-full" />
            <Skeleton className="h-8 w-18 rounded-full" />
          </div>
        </div>
      </div>

      {/* Category skeletons */}
      {[1, 2, 3].map((cat) => (
        <div key={cat} className="space-y-4">
          <div className="flex items-center gap-2">
            <Skeleton className="size-8 rounded-xl" />
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-8 rounded-full" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-2xl border bg-card p-4 space-y-3"
              >
                <div className="flex items-center gap-3">
                  <Skeleton className="size-12 rounded-xl" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3.5 w-28" />
                    <Skeleton className="h-2.5 w-20" />
                  </div>
                </div>
                <Skeleton className="h-2 w-full rounded-full" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
