"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-8 text-center">
      <div className="grid size-16 place-items-center rounded-2xl bg-destructive/10 text-destructive">
        <AlertTriangle className="size-8" />
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="font-bold text-base tracking-tight">
          Something went wrong
        </h3>
        <p className="text-sm text-muted-foreground max-w-md">
          {error.message || "An unexpected error occurred while loading this admin page."}
        </p>
        {error.digest && (
          <p className="text-xs text-muted-foreground font-mono">
            Error ID: {error.digest}
          </p>
        )}
      </div>
      <Button onClick={reset} variant="outline" size="sm">
        Try again
      </Button>
    </div>
  );
}
