import "server-only";

import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

export type AdminSession = {
  userId: string;
  role: string;
};

/**
 * Guards an admin-only server component / server action.
 * Redirects non-authenticated users to login and non-admin users to the dashboard.
 * Returns the session when the caller is allowed to proceed.
 */
export async function requireAdmin(): Promise<AdminSession> {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/admin");
  }

  if (session.user.role !== "admin") {
    redirect("/dashboard");
  }

  return { userId: session.user.id, role: session.user.role };
}

/**
 * Returns true when the current session belongs to an authenticated admin.
 * Safe for use inside layouts where a redirect is not desired.
 */
export async function isAdmin(): Promise<boolean> {
  const session = await auth();
  return session?.user?.role === "admin";
}
