"use server";

import bcrypt from "bcryptjs";

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

  const existing = await prisma.user.findUnique({
    where: { email: parsed.data.email },
    select: { id: true },
  });

  if (existing) {
    return { status: "error", message: "An account with this email already exists." };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);

  try {
    await prisma.user.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        passwordHash,
      },
    });
  } catch {
    return { status: "error", message: "Could not create your account. Please try again." };
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: "/dashboard",
    });
  } catch {
    return { status: "success" };
  }

  return { status: "success" };
}

const loginSchema = loginCredentialsSchema;

export type LoginState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "success"; callbackUrl?: string };

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

  const callbackUrl = formData.get("callbackUrl");

  try {
    const signInResult = await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false,
    });

    if (signInResult?.error) {
      return { status: "error", message: "Invalid email or password." };
    }
  } catch {
    return { status: "error", message: "Invalid email or password." };
  }

  return {
    status: "success",
    ...(typeof callbackUrl === "string" && callbackUrl.startsWith("/")
      ? { callbackUrl }
      : {}),
  };
}