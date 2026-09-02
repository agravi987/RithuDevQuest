"use client";

import { Loader2 } from "lucide-react";
import { useActionState, useState } from "react";

import { signupAction, type SignupState } from "@/lib/auth-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { PasswordStrengthMeter } from "@/components/ui/password-strength";

const initialState: SignupState = { status: "idle" };

const inputClass =
  "h-10 rounded-xl bg-background text-foreground placeholder:text-muted-foreground/60";
const labelClass = "text-muted-foreground";

export function SignupForm() {
  const [state, formAction, pending] = useActionState(
    signupAction,
    initialState,
  );
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [password, setPassword] = useState("");

  const error = fieldError ?? (state.status === "error" ? state.message : null);
  const clearError = () => setFieldError(null);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name" className={labelClass}>
          Name
        </Label>
        <Input
          id="name"
          name="name"
          placeholder="Ada Lovelace"
          autoComplete="name"
          minLength={2}
          aria-invalid={error ? true : undefined}
          onChange={clearError}
          required
          className={inputClass}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="email" className={labelClass}>
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          aria-invalid={error ? true : undefined}
          onChange={clearError}
          required
          className={inputClass}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="password" className={labelClass}>
          Password
        </Label>
        <PasswordInput
          id="password"
          name="password"
          placeholder="At least 8 characters"
          autoComplete="new-password"
          minLength={8}
          maxLength={72}
          aria-invalid={error ? true : undefined}
          onChange={(e) => {
            setPassword(e.target.value);
            clearError();
          }}
          required
          className={inputClass}
        />
        <PasswordStrengthMeter value={password} />
      </div>
      {error && (
        <p
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
            Creating account…
          </>
        ) : (
          "Create account"
        )}
      </Button>
    </form>
  );
}
