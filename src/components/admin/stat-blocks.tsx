import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type KpiCardProps = {
  label: string;
  value: string;
  sub?: string;
  icon: React.ReactNode;
  accent?: string;
};

export function KpiCard({ label, value, sub, icon, accent }: KpiCardProps) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-2">
        <CardTitle className="text-sm font-semibold text-muted-foreground">
          {label}
        </CardTitle>
        <div
          className={cn(
            "grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary",
            accent,
          )}
        >
          {icon}
        </div>
      </CardHeader>
      <CardContent className="pt-1">
        <div className="text-2xl font-black tracking-tight tabular-nums">
          {value}
        </div>
        {sub && (
          <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
        )}
      </CardContent>
    </Card>
  );
}

type StatCardProps = {
  label: string;
  value: string;
  percent?: number;
  hint?: string;
};

export function StatBar({
  label,
  value,
  percent,
  hint,
}: StatCardProps & { percent?: number }) {
  return (
    <Card size="sm">
      <CardContent>
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">{label}</span>
          <span className="text-base font-black">{value}</span>
        </div>
        {typeof percent === "number" && (
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${Math.min(percent, 100)}%` }}
            />
          </div>
        )}
        {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      </CardContent>
    </Card>
  );
}

type ChartData = { label: string; value: number }[];

export function BarChart({
  data,
  height = 160,
  accent = "bg-primary",
}: {
  data: ChartData;
  height?: number;
  accent?: string;
}) {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <div className="flex h-full items-end gap-2" style={{ minHeight: height }}>
      {data.map((d) => (
        <div key={d.label} className="group flex flex-1 flex-col items-center gap-1">
          <div className="relative flex w-full flex-1 items-end">
            <div
              className={cn(
                "w-full rounded-t-md transition-all group-hover:opacity-90",
                accent,
              )}
              style={{
                height: `${Math.max((d.value / max) * 100, 2)}%`,
                minHeight: 4,
              }}
              title={`${d.label}: ${d.value}`}
            />
          </div>
          <span className="text-[9px] font-medium text-muted-foreground truncate w-full text-center">
            {d.label}
          </span>
        </div>
      ))}
    </div>
  );
}

export function ProgressBars({
  rows,
}: {
  rows: { label: string; value: string; bar: number; color?: string }[];
}) {
  return (
    <div className="space-y-3">
      {rows.map((r) => (
        <div key={r.label}>
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium truncate pr-2">{r.label}</span>
            <span className="font-bold whitespace-nowrap">{r.value}</span>
          </div>
          <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={cn("h-full rounded-full", r.color ?? "bg-primary")}
              style={{ width: `${Math.min(Math.max(r.bar, 0), 100)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex min-h-[120px] flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-6 text-center">
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
