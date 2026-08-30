import { Suspense } from "react";
import Link from "next/link";

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
      title="Welcome back"
      description="Log in to continue your quest with Rithu."
      mascotMessage="Your streak is waiting! 🔥"
    >
      <Suspense
        fallback={
          <p className="text-center text-sm text-muted-foreground">
            Loading…
          </p>
        }
      >
        <LoginForm callbackUrl={callbackUrl} />
      </Suspense>
      <p className="mt-5 text-center text-sm text-muted-foreground">
        New to RithuDevQuest?{" "}
        <Link
          href="/signup"
          className="font-semibold text-primary transition-colors hover:text-primary/80 hover:underline"
        >
          Create an account
        </Link>
      </p>
    </AuthStage>
  );
}
