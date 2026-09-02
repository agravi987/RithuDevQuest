"use client";

import { Loader2 } from "lucide-react";
import { useActionState, useState } from "react";

import { loginAction, type LoginState } from "@/lib/auth-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";

const initialState: LoginState = { status: "idle" };

const inputClass =
  "h-10 rounded-xl bg-background text-foreground placeholder:text-muted-foreground/60";

export function LoginForm({ callbackUrl }: { callbackUrl?: string }) {
  const [state, formAction, pending] = useActionState(
    loginAction,
    initialState,
  );
  const [fieldError, setFieldError] = useState<string | null>(null);

  const error = fieldError ?? (state.status === "error" ? state.message : null);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="callbackUrl" value={callbackUrl ?? ""} />
      <div className="flex flex-col gap-2">
        <Label htmlFor="email" className="text-muted-foreground">
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "login-error" : undefined}
          onChange={() => setFieldError(null)}
          required
          className={inputClass}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="password" className="text-muted-foreground">
          Password
        </Label>
        <PasswordInput
          id="password"
          name="password"
          placeholder="Your password"
          autoComplete="current-password"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "login-error" : undefined}
          onChange={() => setFieldError(null)}
          required
          className={inputClass}
        />
      </div>
      {error && (
        <p
          id="login-error"
          role="alert"
          aria-live="polite"
          className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {error}
        </p>
      )}
      <Button
        type="submit"
        size="lg"
        disabled={pending}
        className="mt-1 h-11 w-full rounded-xl bg-gradient-to-r from-primary to-emerald-400 text-sm font-black text-primary-foreground shadow-lg shadow-primary/25 btn-glow hover:brightness-110 transition-all"
      >
        {pending ? (
          <>
            <Loader2 className="animate-spin" />
            Logging in…
          </>
        ) : (
          "Log in"
        )}
      </Button>
    </form>
  );
}
