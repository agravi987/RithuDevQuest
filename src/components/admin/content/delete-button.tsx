"use client";

import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

export function DeleteButton({
  action,
  id,
  message = "Delete this item? This cannot be undone.",
  label = "Delete",
}: {
  action: (formData: FormData) => Promise<void>;
  id: string;
  message?: string;
  label?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(message)) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <Button
        type="submit"
        variant="ghost"
        size="sm"
        className="shrink-0 text-destructive"
        aria-label={label}
      >
        <Trash2 className="size-4" />
      </Button>
    </form>
  );
}
