"use client";

import { useTransition } from "react";
import { motion } from "motion/react";

export function NavigationProgress() {
  const [isPending] = useTransition();

  return (
    <>
      {isPending && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          exit={{ scaleX: 0 }}
          className="fixed top-0 left-0 right-0 z-50 h-1 bg-gradient-to-r from-primary via-emerald-400 to-cyan-400 origin-left transition-transform duration-200"
          style={{ transformOrigin: "left center" }}
          role="progressbar"
          aria-label="Page loading"
        />
      )}
    </>
  );
}

export function withTransition<T extends (...args: unknown[]) => void>(
  callback: T,
  startTransition: (cb: () => void) => void,
): T {
  return ((...args: unknown[]) => {
    startTransition(() => callback(...args));
  }) as T;
}