"use client";

import { Loader2 } from "lucide-react";
import { useActionState } from "react";

import { signupAction, type SignupState } from "@/lib/auth-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: SignupState = { status: "idle" };

const inputClass =
  "h-10 rounded-xl border-border bg-background text-foreground placeholder:text-muted-foreground/60 transition-colors focus-visible:border-emerald-400/60 focus-visible:ring-emerald-400/20";
const labelClass = "text-muted-foreground";

export function SignupForm() {
  const [state, formAction, pending] = useActionState(
    signupAction,
    initialState,
  );

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
          required
          minLength={2}
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
          required
          className={inputClass}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="password" className={labelClass}>
          Password
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="At least 8 characters"
          autoComplete="new-password"
          required
          minLength={8}
          maxLength={72}
          className={inputClass}
        />
      </div>
      {state.status === "error" && (
        <p
          aria-live="polite"
          className="rounded-xl border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-300"
        >
          {state.message}
        </p>
      )}
      <Button
        type="submit"
        size="lg"
        disabled={pending}
        className="mt-1 h-11 w-full rounded-xl bg-gradient-to-r from-primary to-emerald-400 text-sm font-black text-primary-foreground shadow-lg shadow-primary/25 btn-glow hover:brightness-110 transition-all"
      >
        {pending && <Loader2 className="animate-spin" />}
        Create account
      </Button>
    </form>
  );
}
