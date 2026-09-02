"use client";

import { motion, AnimatePresence } from "motion/react";

type SidebarTooltipProps = {
  label: string;
  visible: boolean;
};

export function SidebarTooltip({ label, visible }: SidebarTooltipProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: -4 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -4 }}
          transition={{ duration: 0.15 }}
          className="absolute left-full top-1/2 -translate-y-1/2 ml-2 z-50 px-2.5 py-1 rounded-lg bg-foreground text-background text-xs font-semibold whitespace-nowrap shadow-lg pointer-events-none"
        >
          {label}
          {/* Arrow */}
          <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-foreground" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
