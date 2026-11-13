import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { AuthStage } from "@/components/auth/auth-stage";
import { SignupForm } from "@/components/auth/signup-form";

export default async function SignupPage() {
  return (
    <AuthStage
      title="Begin Your Quest"
      description="Join 1,000+ developers leveling up their craft through gamified daily missions."
      mascotMessage="Welcome, hero! Ready to level up your code? 🌌"
    >
      <SignupForm />
      <div className="mt-6 pt-5 border-t border-white/10 text-center text-sm text-slate-300">
        Already in orbit?{" "}
        <Link
          href="/login"
          className="inline-flex items-center gap-1 font-bold text-emerald-400 transition-colors hover:text-emerald-300 hover:underline"
        >
          <span>Log into mission control</span>
          <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </AuthStage>
  );
}
