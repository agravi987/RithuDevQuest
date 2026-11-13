import Link from "next/link";
import { GitMerge, ArrowRight } from "lucide-react";

import type { PathCrossReference } from "@/lib/curriculum/cross-references";

export function PrerequisiteTracks({
  references,
}: {
  references: PathCrossReference[];
}) {
  if (references.length === 0) return null;

  return (
    <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-sm">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
        <GitMerge className="size-4 text-primary" />
        Recommended prerequisite tracks
      </div>
      <ul className="mt-3 flex flex-col gap-2">
        {references.map((ref) => (
          <li
            key={`${ref.careerSlug}/${ref.pathSlug}`}
            className="rounded-xl border border-border/60 bg-background/40 px-3 py-2"
          >
            <Link
              href={`/learn/${ref.pathSlug}`}
              className="group flex items-center justify-between gap-2"
            >
              <span className="min-w-0">
                <span className="block truncate text-sm font-bold text-foreground">
                  {ref.pathTitle}
                </span>
                <span className="block text-xs text-muted-foreground">
                  {ref.careerTitle}
                </span>
              </span>
              <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </Link>
            {ref.note && (
              <p className="mt-1 text-xs text-muted-foreground">{ref.note}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}