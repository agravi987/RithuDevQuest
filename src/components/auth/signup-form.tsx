"use client";

import { Loader2, User, Mail, Lock, Rocket, CheckCircle2 } from "lucide-react";
import { useActionState, useState } from "react";

import { signupAction, type SignupState } from "@/lib/auth-actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { PasswordStrengthMeter } from "@/components/ui/password-strength";
import { DuoButton } from "@/components/quiz/duo-button";

const initialState: SignupState = { status: "idle" };

const inputClass =
  "h-12 rounded-2xl border-2 border-slate-700/80 bg-[#0d1428] px-4 text-base font-medium text-white placeholder:text-slate-500 transition-all focus:border-emerald-400 focus:bg-[#0f1730] focus:ring-4 focus:ring-emerald-500/20";
const labelClass =
  "flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-300";

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
      {/* Cadet Name */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name" className={labelClass}>
          <User className="size-3.5 text-emerald-400" />
          <span>Cadet Name</span>
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

      {/* Email */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email" className={labelClass}>
          <Mail className="size-3.5 text-cyan-400" />
          <span>Cadet Email</span>
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="ada@galaxy.dev"
          autoComplete="email"
          aria-invalid={error ? true : undefined}
          onChange={clearError}
          required
          className={inputClass}
        />
      </div>

      {/* Password & Strength */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="password" className={labelClass}>
          <Lock className="size-3.5 text-purple-400" />
          <span>Create Security Passkey</span>
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

      {/* Error Banner */}
      {error && (
        <div
          role="alert"
          aria-live="polite"
          className="animate-shake rounded-2xl border-2 border-rose-500/40 bg-rose-500/15 px-4 py-3 text-sm font-bold text-rose-300 shadow-lg shadow-rose-950/30"
        >
          {error}
        </div>
      )}

      {/* Cadet Perks Checkpoints */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3.5 my-1 flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
          <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
          <span>Instant 100 Welcome XP automatically credited</span>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
          <CheckCircle2 className="size-4 text-cyan-400 shrink-0" />
          <span>Daily streak tracking & AI Mentor unlocked</span>
        </div>
      </div>

      {/* Submit Button */}
      <div className="mt-1">
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
              REGISTERING CADET...
            </>
          ) : (
            <>
              <Rocket className="mr-2 size-5" />
              CREATE SPACE CADET ACCOUNT
            </>
          )}
        </DuoButton>
      </div>
    </form>
  );
}
