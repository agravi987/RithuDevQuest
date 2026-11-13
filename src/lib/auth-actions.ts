"use server";

import bcrypt from "bcryptjs";
import { isRedirectError } from "next/dist/client/components/redirect-error";

import {
  loginCredentialsSchema,
  signupSchema,
} from "@/lib/auth-validation";
import { signIn } from "@/lib/auth";
import { prisma } from "@/lib/db";

export type SignupState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "success" };

export async function signupAction(
  _prevState: SignupState,
  formData: FormData,
): Promise<SignupState> {
  const parsed = signupSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }

  let passwordHash: string;
  try {
    const existing = await prisma.user.findUnique({
      where: { email: parsed.data.email },
      select: { id: true },
    });

    if (existing) {
      return { status: "error", message: "An account with this email already exists." };
    }

    passwordHash = await bcrypt.hash(parsed.data.password, 10);

    await prisma.user.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        passwordHash,
      },
    });
  } catch (err) {
    console.error("Signup database error:", err);
    return { status: "error", message: "Could not create your account. Please check your connection and try again." };
  }

  try {
    // signIn with redirectTo throws NEXT_REDIRECT — re-throw it so Next.js handles navigation
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: "/dashboard",
    });
  } catch (err) {
    // Re-throw redirect errors — they must propagate to Next.js
    if (isRedirectError(err)) {
      throw err;
    }
    // Any other error (bad credentials race condition, etc.) — still redirect to login
    return { status: "error", message: "Account created! Please log in." };
  }

  return { status: "success" };
}

const loginSchema = loginCredentialsSchema;

export type LoginState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "success" };

export async function loginAction(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }

  const callbackUrl =
    typeof formData.get("callbackUrl") === "string" &&
    (formData.get("callbackUrl") as string).startsWith("/")
      ? (formData.get("callbackUrl") as string)
      : null;

  // Determine redirect destination based on user role
  let redirectTo = "/dashboard";
  if (callbackUrl) {
    redirectTo = callbackUrl;
  } else {
    try {
      const user = await prisma.user.findUnique({
        where: { email: parsed.data.email },
        select: { role: true },
      });
      if (user?.role === "admin") {
        redirectTo = "/admin";
      }
    } catch {
      // Default to /dashboard on DB error
    }
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo,
    });
  } catch (err) {
    // Re-throw redirect so Next.js can handle navigation
    if (isRedirectError(err)) {
      throw err;
    }
    return { status: "error", message: "Invalid email or password." };
  }

  return { status: "success" };
}