import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Space_Grotesk, Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "RithuDevQuest",
    template: "%s | RithuDevQuest",
  },
  description:
    "Gamified technical learning for DevOps, Cloud, AI, and Web Development. Learn with Rithu, your AI mentor.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${spaceGrotesk.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col overflow-x-hidden bg-background">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          themes={["dark"]}
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}