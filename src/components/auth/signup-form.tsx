"use client";

import { Loader2 } from "lucide-react";
import { useActionState, useState } from "react";

import { signupAction, type SignupState } from "@/lib/auth-actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { PasswordStrengthMeter } from "@/components/ui/password-strength";

import { DuoButton } from "@/components/quiz/duo-button";

const initialState: SignupState = { status: "idle" };

const inputClass =
  "input-focus-glow h-11 rounded-2xl bg-background border-2 border-border/80 text-foreground placeholder:text-muted-foreground/60 focus:border-emerald-500/60";
const labelClass = "text-muted-foreground font-bold text-xs uppercase tracking-wider";

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
              CREATING ACCOUNT...
            </>
          ) : (
            "CREATE ACCOUNT"
          )}
        </DuoButton>
      </div>
    </form>
  );
}
