import { Skeleton } from "@/components/ui/skeleton";

export default function DailyChallengeLoading() {
  return (
    <div className="mx-auto max-w-3xl pb-12">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#081710] to-[#0a0f1f] p-5 sm:p-8">
        <div className="flex items-start gap-4 mb-6">
          <Skeleton className="size-14 sm:size-16 shrink-0 rounded-2xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-7 w-56" />
            <Skeleton className="h-4 w-72" />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-6">
          <Skeleton className="h-7 w-40 rounded-full" />
          <Skeleton className="h-7 w-40 rounded-full" />
          <Skeleton className="h-7 w-44 rounded-full" />
        </div>

        <Skeleton className="h-14 w-full rounded-xl" />
      </div>
    </div>
  );
}
