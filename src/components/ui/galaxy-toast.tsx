"use client";

import { motion, AnimatePresence } from "motion/react";
import { X, Trophy, Star, Flame, Zap, CheckCircle } from "lucide-react";
import { useEffect, useCallback, createContext, useContext, useState, useRef } from "react";
import { createPortal } from "react-dom";

type ToastType = "xp" | "achievement" | "streak" | "levelup" | "success" | "error";

type Toast = {
  id: string;
  type: ToastType;
  title: string;
  message: string;
  duration?: number;
};

type ToastContextType = {
  addToast: (toast: Omit<Toast, "id">) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be inside ToastProvider");
  return ctx;
}

export function GalaxyToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    setToasts((prev) => [...prev.slice(-4), { ...toast, id }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

function ToastContainer({
  toasts,
  onRemove,
}: {
  toasts: Toast[];
  onRemove: (id: string) => void;
}) {
  const mountedRef = useRef(false);
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    mountedRef.current = true;
    forceUpdate((n) => n + 1);
  }, []);

  if (!mountedRef.current) return null;

  return createPortal(
    <div className="fixed bottom-24 right-4 z-[200] flex flex-col gap-3 pointer-events-none sm:bottom-8 sm:right-6">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
        ))}
      </AnimatePresence>
    </div>,
    document.body
  );
}

const TOAST_STYLES: Record<ToastType, { bg: string; border: string; icon: typeof Trophy; color: string }> = {
  xp: {
    bg: "from-amber-950/90 to-yellow-950/90",
    border: "border-amber-500/30",
    icon: Star,
    color: "text-amber-400",
  },
  achievement: {
    bg: "from-purple-950/90 to-fuchsia-950/90",
    border: "border-purple-500/30",
    icon: Trophy,
    color: "text-purple-400",
  },
  streak: {
    bg: "from-orange-950/90 to-red-950/90",
    border: "border-orange-500/30",
    icon: Flame,
    color: "text-orange-400",
  },
  levelup: {
    bg: "from-cyan-950/90 to-blue-950/90",
    border: "border-cyan-500/30",
    icon: Zap,
    color: "text-cyan-400",
  },
  success: {
    bg: "from-emerald-950/90 to-green-950/90",
    border: "border-emerald-500/30",
    icon: CheckCircle,
    color: "text-emerald-400",
  },
  error: {
    bg: "from-red-950/90 to-rose-950/90",
    border: "border-red-500/30",
    icon: X,
    color: "text-red-400",
  },
};

function ToastItem({
  toast,
  onRemove,
}: {
  toast: Toast;
  onRemove: (id: string) => void;
}) {
  const style = TOAST_STYLES[toast.type];
  const Icon = style.icon;

  useEffect(() => {
    const timeout = setTimeout(() => onRemove(toast.id), toast.duration || 4000);
    return () => clearTimeout(timeout);
  }, [toast.id, toast.duration, onRemove]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 100, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.8, transition: { duration: 0.2 } }}
      className={`pointer-events-auto relative overflow-hidden rounded-xl border ${style.border} bg-gradient-to-r ${style.bg} backdrop-blur-xl shadow-2xl shadow-black/30`}
    >
      {/* Cosmic glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/5" />

      <div className="relative flex items-center gap-3 p-4 pr-10">
        {/* Icon with pulse */}
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 0.6, repeat: 1 }}
          className={`flex-shrink-0 ${style.color}`}
        >
          <Icon className="size-5" />
        </motion.div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-white">{toast.title}</p>
          <p className="text-xs text-white/60">{toast.message}</p>
        </div>

        <button
          onClick={() => onRemove(toast.id)}
          className="absolute right-3 top-3 text-white/40 hover:text-white/80 transition-colors"
        >
          <X className="size-3.5" />
        </button>
      </div>

      {/* Progress bar */}
      <motion.div
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{ duration: (toast.duration || 4000) / 1000, ease: "linear" }}
        className="absolute bottom-0 left-0 right-0 h-0.5 origin-left bg-white/20"
      />

      {/* Star particles */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 0.6, 0], scale: [0, 1, 0.5] }}
          transition={{ duration: 1.5, delay: i * 0.3, repeat: Infinity, repeatDelay: 2 }}
          className="absolute right-2 top-2 size-1 rounded-full bg-white/30"
          style={{ left: `${20 + i * 25}%` }}
        />
      ))}
    </motion.div>
  );
}
