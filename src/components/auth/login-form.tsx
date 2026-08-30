"use client";

import { Loader2 } from "lucide-react";
import { useActionState } from "react";

import { loginAction, type LoginState } from "@/lib/auth-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: LoginState = { status: "idle" };

export function LoginForm({ callbackUrl }: { callbackUrl?: string }) {
  const [state, formAction, pending] = useActionState(
    loginAction,
    initialState,
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="callbackUrl" value={callbackUrl ?? ""} />
      <div className="flex flex-col gap-2">
        <Label
          htmlFor="email"
          className="text-muted-foreground"
        >
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
          className="h-10 rounded-xl border-border bg-background text-foreground placeholder:text-muted-foreground/60 transition-colors focus-visible:border-emerald-400/60 focus-visible:ring-emerald-400/20"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label
          htmlFor="password"
          className="text-muted-foreground"
        >
          Password
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Your password"
          autoComplete="current-password"
          required
          className="h-10 rounded-xl border-border bg-background text-foreground placeholder:text-muted-foreground/60 transition-colors focus-visible:border-emerald-400/60 focus-visible:ring-emerald-400/20"
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
        Log in
      </Button>
    </form>
  );
}
