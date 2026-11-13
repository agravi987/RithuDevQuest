"use client";

import { Loader2 } from "lucide-react";
import { useActionState, useState } from "react";

import { loginAction, type LoginState } from "@/lib/auth-actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";

import { DuoButton } from "@/components/quiz/duo-button";

const initialState: LoginState = { status: "idle" };

const inputClass =
  "input-focus-glow h-11 rounded-2xl bg-background border-2 border-border/80 text-foreground placeholder:text-muted-foreground/60 focus:border-emerald-500/60";

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
        <Label htmlFor="email" className="text-muted-foreground font-bold text-xs uppercase tracking-wider">
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
        <Label htmlFor="password" className="text-muted-foreground font-bold text-xs uppercase tracking-wider">
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
          className="animate-shake rounded-2xl border-2 border-destructive/30 bg-destructive/10 px-4 py-2.5 text-sm font-bold text-destructive"
        >
          {error}
        </p>
      )}
      <div className="mt-2">
        <DuoButton
          type="submit"
          variant="primary"
          size="lg"
          disabled={pending}
          className="w-full uppercase tracking-wider"
        >
          {pending ? (
            <>
              <Loader2 className="animate-spin mr-2" />
              AUTHENTICATING...
            </>
          ) : (
            "LOG IN"
          )}
        </DuoButton>
      </div>
    </form>
  );
}
