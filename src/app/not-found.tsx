"use client";

import Link from "next/link";
import { Home, ArrowLeft, MapPin } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      {/* Floating decorations */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[10%] top-[20%] text-4xl opacity-10 animate-float" style={{ animationDelay: "0s" }}>🚀</div>
        <div className="absolute right-[15%] top-[30%] text-3xl opacity-10 animate-float" style={{ animationDelay: "0.5s" }}>⭐</div>
        <div className="absolute left-[20%] bottom-[25%] text-3xl opacity-10 animate-float" style={{ animationDelay: "1s" }}>🎯</div>
        <div className="absolute right-[10%] bottom-[30%] text-4xl opacity-10 animate-float" style={{ animationDelay: "1.5s" }}>🏆</div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Large 404 with gradient */}
        <div className="relative">
          <span className="text-[120px] font-black leading-none tracking-tighter bg-gradient-to-br from-primary via-emerald-400 to-xp bg-clip-text text-transparent opacity-20">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="grid size-20 place-items-center rounded-3xl bg-gradient-to-br from-primary to-emerald-400 text-primary-foreground shadow-xl shadow-primary/20 animate-bounce">
              <MapPin className="size-10" />
            </div>
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-black tracking-tight">Lost in the Matrix!</h1>
          <p className="mt-2 text-muted-foreground max-w-md">
            This quest node doesn&apos;t exist yet. Looks like you ventured beyond the map boundaries.
          </p>
        </div>

        {/* Navigation buttons */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-2xl bg-primary px-8 py-3.5 text-sm font-bold text-primary-foreground shadow-md shadow-primary/15 hover:shadow-lg hover:shadow-primary/20 hover:brightness-110 transition-all active:scale-[0.98]"
          >
            <Home className="size-4" />
            Back to Dashboard
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 rounded-2xl border-2 border-border bg-card px-8 py-3.5 text-sm font-bold hover:border-primary/30 hover:bg-primary/5 transition-all"
          >
            <ArrowLeft className="size-4" />
            Go Back
          </button>
        </div>

        {/* Helpful links */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
          <span>Quick links:</span>
          {[
            { href: "/learn", label: "🗺️ Learn" },
            { href: "/practice", label: "🎯 Practice" },
            { href: "/achievements", label: "🏆 Achievements" },
            { href: "/leaderboard", label: "📊 Leaderboard" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full border border-border px-3 py-1 font-semibold hover:border-primary/30 hover:text-primary hover:bg-primary/5 transition-all"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
