import { Skeleton } from "@/components/ui/skeleton";

export default function PracticeLoading() {
  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto pb-12">
      {/* Header skeleton */}
      <div className="rounded-3xl border bg-card p-6 sm:p-8">
        <div className="flex items-center gap-4">
          <Skeleton className="size-16 rounded-2xl" />
          <div className="space-y-2">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-7 w-56" />
            <Skeleton className="h-4 w-72" />
          </div>
        </div>
      </div>

      {/* Recommendations skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-5 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="rounded-xl border bg-card p-5 space-y-3">
              <div className="flex justify-between">
                <div className="space-y-1">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-4 w-28" />
                </div>
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
              <Skeleton className="h-3 w-full" />
              <div className="flex justify-between pt-2 border-t">
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-8 w-20 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Practice Box skeleton */}
      <div className="rounded-xl border bg-card p-6 space-y-4">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-72" />
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-32 ml-auto" />
        </div>
      </div>
    </div>
  );
}
