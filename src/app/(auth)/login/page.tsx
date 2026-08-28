import { Suspense } from "react";
import Link from "next/link";

import { LoginForm } from "@/components/auth/login-form";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Welcome back</CardTitle>
        <CardDescription>
          Log in to continue your quest with Rithu.
        </CardDescription>
      </CardHeader>
      <Suspense
        fallback={
          <p className="px-(--card-spacing) pb-4 text-sm text-muted-foreground">
            Loading…
          </p>
        }
      >
        <LoginForm callbackUrl={callbackUrl} />
      </Suspense>
      <p className="px-(--card-spacing) pb-(--card-spacing) text-sm text-muted-foreground">
        New to RithuDevQuest?{" "}
        <Link href="/signup" className="font-medium text-primary hover:underline">
          Create an account
        </Link>
      </p>
    </Card>
  );
}