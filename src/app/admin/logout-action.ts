"use server";

import { signOut } from "@/lib/auth";

export async function handleAdminSignOut() {
  await signOut({ redirectTo: "/login" });
}
