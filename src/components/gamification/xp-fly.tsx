"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Zap } from "lucide-react";

type XpFlyProps = {
  amount: number;
  triggerKey: number;
};

export function XpFly({ amount, triggerKey }: XpFlyProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (amount > 0 && triggerKey > 0) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 1200);
      return () => clearTimeout(timer);
    }
  }, [amount, triggerKey]);

  return (
    <AnimatePresence>
      {visible && amount > 0 && (
        <motion.div
          key={triggerKey}
          initial={{ opacity: 1, y: 0, scale: 0.8 }}
          animate={{ opacity: 0, y: -50, scale: 1.3 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="pointer-events-none fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2"
        >
          <div className="flex items-center gap-1.5 rounded-full bg-xp/20 px-4 py-2 text-lg font-black text-xp shadow-lg shadow-xp/20 backdrop-blur-sm border border-xp/30">
            <Zap className="size-5 fill-xp text-xp animate-bounce" />
            <span>+{amount} XP</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
