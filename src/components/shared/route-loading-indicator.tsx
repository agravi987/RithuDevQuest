"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";

/**
 * Thin animated bar at the top of the page that appears during route transitions.
 * Gives visual feedback when navigating between pages.
 */
export function RouteLoadingIndicator() {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ scaleX: 0, opacity: 1 }}
          animate={{ scaleX: 1, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="fixed top-0 left-0 right-0 h-[2px] z-[100] origin-left bg-gradient-to-r from-primary via-emerald-400 to-cyan-400"
          style={{ marginLeft: "var(--sidebar-width, 0px)" }}
        />
      )}
    </AnimatePresence>
  );
}
