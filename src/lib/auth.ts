import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";

import { loginCredentialsSchema } from "@/lib/auth-validation";
import { authConfig } from "@/lib/auth.config";
import { prisma } from "@/lib/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const parsed = loginCredentialsSchema.safeParse(credentials);

        if (!parsed.success) {
          return null;
        }

        const { email, password } = parsed.data;

        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (adminEmail && adminPassword) {
          const isEnvAdmin =
            email.toLowerCase() === adminEmail.toLowerCase() &&
            password === adminPassword;

          if (isEnvAdmin) {
            const passwordHash = await bcrypt.hash(adminPassword, 10);
            const admin = await prisma.user.upsert({
              where: { email: adminEmail },
              update: { role: "admin", passwordHash },
              create: {
                name: "Administrator",
                email: adminEmail,
                role: "admin",
                passwordHash,
              },
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
                role: true,
                xp: true,
                level: true,
              },
            });
            return {
              id: admin.id,
              name: admin.name,
              email: admin.email,
              image: admin.image,
              role: admin.role,
              xp: admin.xp,
              level: admin.level,
            };
          }
        }

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user?.passwordHash) {
          return null;
        }

        const valid = await bcrypt.compare(
          password,
          user.passwordHash,
        );

        if (!valid) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
          xp: user.xp,
          level: user.level,
        };
      },
    }),
  ],
});