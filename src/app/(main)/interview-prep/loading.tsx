export default function InterviewPrepLoading() {
  return (
    <div className="mx-auto max-w-4xl space-y-10 px-4 py-8">
      <div className="space-y-4 text-center">
        <div className="mx-auto h-9 w-64 animate-pulse rounded-lg bg-muted" />
        <div className="mx-auto h-4 w-80 animate-pulse rounded-lg bg-muted" />
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-32 animate-pulse rounded-2xl border border-border/40 bg-card/50 p-4">
            <div className="mb-3 size-10 animate-pulse rounded-xl bg-muted" />
            <div className="mb-1 h-3 w-24 animate-pulse rounded bg-muted" />
            <div className="h-2 w-16 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="h-48 animate-pulse rounded-3xl border border-border/40 bg-card/50 p-6" />
        <div className="h-48 animate-pulse rounded-3xl border border-border/40 bg-card/50 p-6" />
      </div>
    </div>
  );
}