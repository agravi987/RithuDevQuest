"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSidebar } from "@/lib/sidebar-context";

const shortcuts: { key: string; ctrl?: boolean; action: string; href?: string }[] = [
  { key: "1", action: "Go to Dashboard", href: "/dashboard" },
  { key: "2", action: "Go to Learn", href: "/learn" },
  { key: "3", action: "Go to Practice", href: "/practice" },
  { key: "4", action: "Go to Achievements", href: "/achievements" },
  { key: "[", ctrl: true, action: "Toggle sidebar" },
];

export function KeyboardShortcuts() {
  const router = useRouter();
  const { toggleCollapsed } = useSidebar();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Don't trigger in input/textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      for (const shortcut of shortcuts) {
        const ctrlMatch = shortcut.ctrl ? e.ctrlKey || e.metaKey : true;
        const keyMatch = e.key === shortcut.key;

        if (ctrlMatch && keyMatch) {
          e.preventDefault();
          if (shortcut.ctrl && shortcut.key === "[") {
            toggleCollapsed();
          } else if (shortcut.href) {
            router.push(shortcut.href);
          }
          break;
        }
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [router, toggleCollapsed]);

  return null;
}
