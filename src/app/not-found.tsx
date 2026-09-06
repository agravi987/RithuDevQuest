"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Home, ArrowLeft, MapPin, Rocket } from "lucide-react";

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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex flex-col items-center gap-6"
      >
        {/* Large 404 with gradient */}
        <div className="relative">
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.15, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-[120px] font-black leading-none tracking-tighter bg-gradient-to-br from-primary via-emerald-400 to-xp bg-clip-text text-transparent select-none"
          >
            404
          </motion.span>
          <motion.div
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="relative grid size-20 place-items-center rounded-3xl bg-gradient-to-br from-primary to-emerald-400 text-primary-foreground shadow-xl shadow-primary/20">
              <MapPin className="size-10" />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-3 rounded-full border border-dashed border-primary/20"
              />
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-3xl font-black tracking-tight">Lost in the Matrix!</h1>
          <p className="mt-2 text-muted-foreground max-w-md text-sm">
            This quest node doesn&apos;t exist yet. Looks like you ventured beyond the map boundaries.
          </p>
        </motion.div>

        {/* Navigation buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col gap-3 sm:flex-row"
        >
          <Link
            href="/dashboard"
            className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-emerald-500 px-8 py-3.5 text-sm font-bold text-primary-foreground shadow-md shadow-primary/15 hover:shadow-lg hover:shadow-primary/25 hover:brightness-110 transition-all active:scale-[0.98] btn-glow"
          >
            <Home className="size-4 transition-transform group-hover:-translate-y-0.5" />
            Back to Dashboard
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 rounded-2xl border border-border bg-card px-8 py-3.5 text-sm font-bold hover:border-primary/30 hover:bg-primary/5 transition-all"
          >
            <ArrowLeft className="size-4" />
            Go Back
          </button>
        </motion.div>

        {/* Helpful links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground"
        >
          <span>Quick links:</span>
          {[
            { href: "/learn", label: "🗺️ Learn" },
            { href: "/practice", label: "🎯 Practice" },
            { href: "/achievements", label: "🏆 Achievements" },
            { href: "/practice", label: "📚 Practice Arena" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full border border-border px-3 py-1 font-semibold hover:border-primary/30 hover:text-primary hover:bg-primary/5 transition-all"
            >
              {link.label}
            </Link>
          ))}
        </motion.div>

        {/* Fun太空 fact */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-4 flex items-center gap-2 rounded-full bg-muted/50 px-4 py-2 text-[10px] font-medium text-muted-foreground"
        >
          <Rocket className="size-3" />
          Fun fact: This page was lost in a black hole somewhere in sector 7G
        </motion.div>
      </motion.div>
    </div>
  );
}
