"use client";

import { Loader2, Mail, Lock, Sparkles, KeyRound } from "lucide-react";
import { useActionState, useState } from "react";

import { loginAction, type LoginState } from "@/lib/auth-actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { DuoButton } from "@/components/quiz/duo-button";

const initialState: LoginState = { status: "idle" };

export function LoginForm({ callbackUrl }: { callbackUrl?: string }) {
  const [state, formAction, pending] = useActionState(
    loginAction,
    initialState,
  );
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const error = fieldError ?? (state.status === "error" ? state.message : null);

  const handleFillDemo = () => {
    setEmail("pilot@example.com");
    setPassword("SecurePass123!");
    setFieldError(null);
  };

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <input type="hidden" name="callbackUrl" value={callbackUrl ?? ""} />

      {/* Email Field */}
      <div className="flex flex-col gap-2">
        <Label
          htmlFor="email"
          className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-300"
        >
          <Mail className="size-3.5 text-cyan-400" />
          <span>Cadet Email</span>
        </Label>
        <div className="relative">
          <Input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setFieldError(null);
            }}
            placeholder="cadet@galaxy.dev"
            autoComplete="email"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? "login-error" : undefined}
            required
            className="h-12 rounded-2xl border-2 border-slate-700/80 bg-[#0d1428] px-4 text-base font-medium text-white placeholder:text-slate-500 transition-all focus:border-cyan-400 focus:bg-[#0f1730] focus:ring-4 focus:ring-cyan-500/20"
          />
        </div>
      </div>

      {/* Password Field */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <Label
            htmlFor="password"
            className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-300"
          >
            <Lock className="size-3.5 text-purple-400" />
            <span>Security Passkey</span>
          </Label>
        </div>
        <div className="relative">
          <PasswordInput
            id="password"
            name="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setFieldError(null);
            }}
            placeholder="••••••••••••"
            autoComplete="current-password"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? "login-error" : undefined}
            required
            className="h-12 rounded-2xl border-2 border-slate-700/80 bg-[#0d1428] px-4 text-base font-medium text-white placeholder:text-slate-500 transition-all focus:border-cyan-400 focus:bg-[#0f1730] focus:ring-4 focus:ring-cyan-500/20"
          />
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div
          id="login-error"
          role="alert"
          aria-live="polite"
          className="animate-shake rounded-2xl border-2 border-rose-500/40 bg-rose-500/15 px-4 py-3 text-sm font-bold text-rose-300 shadow-lg shadow-rose-950/30"
        >
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="mt-2 flex flex-col gap-3">
        <DuoButton
          type="submit"
          variant="primary"
          size="lg"
          disabled={pending}
          className="w-full text-base font-black tracking-wider shadow-lg shadow-emerald-500/25"
        >
          {pending ? (
            <>
              <Loader2 className="mr-2 size-5 animate-spin" />
              AUTHENTICATING MISSION...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 size-5" />
              ENTER ORBIT
            </>
          )}
        </DuoButton>

        {/* Quick Demo Credentials Assistant */}
        <button
          type="button"
          onClick={handleFillDemo}
          className="flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold text-slate-400 hover:text-cyan-300 transition-colors"
        >
          <KeyRound className="size-3.5" />
          <span>Need a test account? Click to fill pilot credentials</span>
        </button>
      </div>
    </form>
  );
}
