import Link from "next/link";

import { AuthStage } from "@/components/auth/auth-stage";
import { SignupForm } from "@/components/auth/signup-form";

export default async function SignupPage() {
  return (
    <AuthStage
      title="Create your account"
      description="Start earning XP and mastering your craft with Rithu."
      mascotMessage="Welcome, hero! Ready to level up? 🚀"
    >
      <SignupForm />
      <p className="mt-5 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-primary transition-colors hover:text-primary/80 hover:underline"
        >
          Log in
        </Link>
      </p>
    </AuthStage>
  );
}
