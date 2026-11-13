"use client";

import { useActionState, useId } from "react";
import { Loader2 } from "lucide-react";

import type { ContentActionResult } from "@/lib/admin/content-actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function Field({
  label,
  name,
  defaultValue,
  placeholder,
  required,
  type = "text",
  hint,
  hidden = false,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
  type?: string;
  hint?: string;
  hidden?: boolean;
}) {
  const uid = useId();
  const id = `${uid}-${name}`;
  return (
    <div className="flex flex-col gap-1.5" hidden={hidden}>
      <Label htmlFor={id}>
        {label}
        {required && <span className="text-destructive"> *</span>}
      </Label>
      <Input
        id={id}
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        aria-hidden={hidden}
      />
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function TextAreaField({
  label,
  name,
  defaultValue,
  placeholder,
  required,
  rows = 3,
  hint,
  hidden = false,
  disabled = false,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  hint?: string;
  hidden?: boolean;
  disabled?: boolean;
}) {
  const uid = useId();
  const id = `${uid}-${name}`;
  return (
    <div className="flex flex-col gap-1.5" hidden={hidden}>
      <Label htmlFor={id}>
        {label}
        {required && <span className="text-destructive"> *</span>}
      </Label>
      <textarea
        id={id}
        name={name}
        rows={rows}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        aria-hidden={hidden}
        className="w-full rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
      />
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function SubmitButton({ children }: { children: React.ReactNode }) {
  return (
    <Button type="submit" size="sm">
      {children}
    </Button>
  );
}

export function FormError({ error }: { error?: string }) {
  if (!error) return null;
  return (
    <p role="alert" className="text-sm font-medium text-destructive">
      {error}
    </p>
  );
}

export function FormSuccess({ success }: { success?: string }) {
  if (!success) return null;
  return (
    <p role="status" className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
      {success}
    </p>
  );
}

export function FormShell({
  action,
  children,
  submitLabel,
  initialState = {},
}: {
  action: (
    prev: ContentActionResult,
    formData: FormData,
  ) => Promise<ContentActionResult>;
  children: React.ReactNode;
  submitLabel: string;
  initialState?: ContentActionResult;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {children}
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending && <Loader2 className="size-4 animate-spin" />}
          {submitLabel}
        </Button>
        <FormError error={state.error} />
        <FormSuccess success={state.success} />
      </div>
    </form>
  );
}
