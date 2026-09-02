"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Lock, X } from "lucide-react";
import { cn } from "@/lib/utils";

type LockedTooltipProps = {
  /** The title of the prerequisite lesson that must be completed first. */
  prerequisiteTitle: string;
  className?: string;
};

/**
 * Shows a small floating explanation when a locked lesson node is tapped/clicked.
 * On desktop it appears on hover; on mobile it appears on tap.
 */
export function LockedTooltip({
  prerequisiteTitle,
  className,
}: LockedTooltipProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="group/tip flex items-center gap-1.5 rounded-full bg-foreground/5 border border-foreground/10 px-2.5 py-1 text-[10px] font-medium text-muted-foreground/60 transition-colors hover:bg-foreground/10 hover:text-muted-foreground/80"
        aria-label={`Locked: complete "${prerequisiteTitle}" first`}
        aria-expanded={open}
        aria-haspopup="true"
      >
        <Lock className="size-3" />
        <span className="hidden sm:inline">Locked</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={cn(
              "absolute z-50 mt-2 w-52 rounded-xl border border-border/60 bg-background/95 backdrop-blur-md p-3 shadow-xl",
              "left-1/2 -translate-x-1/2",
              "sm:left-auto sm:right-0 sm:translate-x-0",
            )}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-2 top-2 text-muted-foreground/50 hover:text-foreground"
              aria-label="Close"
            >
              <X className="size-3" />
            </button>
            <div className="flex items-start gap-2">
              <div className="grid size-6 shrink-0 place-items-center rounded-lg bg-muted/50">
                <Lock className="size-3 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">
                  Mission Locked
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">
                  Complete{" "}
                  <span className="font-semibold text-foreground/80">
                    {prerequisiteTitle}
                  </span>{" "}
                  to unlock this mission.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
