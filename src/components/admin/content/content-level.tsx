import Link from "next/link";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreateEntityForm } from "@/components/admin/content/forms/create-entity-form";

type LevelConfig<T> = {
  title: string;
  backHref: string;
  backLabel?: string;
  nodes: T[];
  childHref: string;
  countLabel: (n: T) => string;
  entityKind: "module" | "unit" | "lesson";
  parentFieldName: string;
  parentId: string;
  emptyMessage: string;
};

export function ContentLevel<T extends { id: string; title: string }>({
  title,
  backHref,
  backLabel = "← Back",
  nodes,
  childHref,
  countLabel,
  entityKind,
  parentFieldName,
  parentId,
  emptyMessage,
}: LevelConfig<T>) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <Button asChild variant="outline" size="sm">
          <Link href={backHref}>{backLabel}</Link>
        </Button>
        <h1 className="mt-3 text-2xl font-black tracking-tight">{title}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          {nodes.length === 0 ? (
            <p className="text-sm text-muted-foreground">{emptyMessage}</p>
          ) : (
            <div className="divide-y divide-border/40">
              {nodes.map((n) => (
                <div
                  key={n.id}
                  className="flex items-center justify-between gap-3 py-3"
                >
                  <Link
                    href={`${childHref}/${n.id}`}
                    className="min-w-0 group"
                  >
                    <div className="font-semibold group-hover:text-primary">
                      {n.title}
                    </div>
                    <div className="truncate text-xs text-muted-foreground">
                      {countLabel(n)}
                    </div>
                  </Link>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`${childHref}/${n.id}`}>Manage</Link>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <CreateEntityForm
        kind={entityKind}
        parentFieldName={parentFieldName}
        parentId={parentId}
      />
    </div>
  );
}
