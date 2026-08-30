import { cn } from "@/lib/utils";

type SkeletonProps = {
  className?: string;
  variant?: "default" | "card" | "circle" | "text" | "button" | "avatar";
  width?: string;
  height?: string;
};

export function Skeleton({
  className,
  variant = "default",
  width,
  height,
}: SkeletonProps) {
  const base = "animate-shimmer rounded-lg bg-muted";

  const variants: Record<string, string> = {
    default: "h-4 w-full",
    card: "h-32 w-full rounded-2xl",
    circle: "size-10 rounded-full",
    text: "h-3 w-3/4",
    button: "h-10 w-24 rounded-xl",
    avatar: "size-12 rounded-2xl",
  };

  return (
    <div
      className={cn(base, variants[variant], className)}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-2xl border-2 border-border bg-card p-5", className)}>
      <div className="flex items-center gap-3 mb-4">
        <Skeleton variant="avatar" />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" className="h-4 w-1/2" />
          <Skeleton variant="text" className="h-3 w-1/3" />
        </div>
      </div>
      <Skeleton variant="text" className="h-3 w-full mb-2" />
      <Skeleton variant="text" className="h-3 w-4/5 mb-4" />
      <Skeleton className="h-2 w-full rounded-full" />
    </div>
  );
}

export function SkeletonDashboard() {
  return (
    <div className="flex flex-col gap-5 py-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-64" />
          <Skeleton variant="text" className="h-4 w-48" />
        </div>
        <div className="flex gap-2">
          <Skeleton variant="button" />
          <Skeleton variant="button" />
          <Skeleton variant="button" />
        </div>
      </div>

      {/* Hero card skeleton */}
      <div className="rounded-3xl border-2 border-border bg-card p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Skeleton variant="avatar" className="size-12" />
            <div className="space-y-2">
              <Skeleton variant="text" className="h-3 w-20" />
              <Skeleton className="h-5 w-32" />
            </div>
          </div>
          <Skeleton variant="button" className="w-12 h-6 rounded-full" />
        </div>
        <Skeleton className="h-3 w-full rounded-full mb-4" />
        <div className="flex gap-2">
          <Skeleton variant="button" className="h-7 w-20 rounded-full" />
          <Skeleton variant="button" className="h-7 w-20 rounded-full" />
          <Skeleton variant="button" className="h-7 w-20 rounded-full" />
        </div>
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-2xl border-2 border-border bg-card p-5">
            <Skeleton variant="avatar" className="size-12 mb-3" />
            <Skeleton variant="text" className="h-4 w-16 mb-1" />
            <Skeleton variant="text" className="h-3 w-12" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonLesson() {
  return (
    <div className="flex flex-col gap-6 py-6">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-2.5 w-full rounded-full" />
      </div>

      {/* Hearts */}
      <div className="flex justify-center gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} variant="circle" className="size-5" />
        ))}
      </div>

      {/* Content */}
      <div className="space-y-4">
        <Skeleton variant="text" className="h-3 w-24" />
        <Skeleton className="h-6 w-3/4" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 rounded-2xl border-2 border-border p-4">
              <Skeleton variant="circle" className="size-9" />
              <Skeleton variant="text" className="h-4 flex-1" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
