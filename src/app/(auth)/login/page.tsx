import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { AuthStage } from "@/components/auth/auth-stage";
import { LoginForm } from "@/components/auth/login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;

  return (
    <AuthStage
      title="Welcome back, Cadet!"
      description="Resume your cosmic coding voyage and keep your streak blazing."
      mascotMessage="Cadet, your coding streak is counting on you! 🚀"
    >
      <Suspense
        fallback={
          <div className="flex justify-center py-6 text-sm text-slate-400">
            Connecting to Mission Control…
          </div>
        }
      >
        <LoginForm callbackUrl={callbackUrl} />
      </Suspense>
      <div className="mt-6 pt-5 border-t border-white/10 text-center text-sm text-slate-300">
        New explorer?{" "}
        <Link
          href="/signup"
          className="inline-flex items-center gap-1 font-bold text-emerald-400 transition-colors hover:text-emerald-300 hover:underline"
        >
          <span>Create your free cadet account</span>
          <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </AuthStage>
  );
}
