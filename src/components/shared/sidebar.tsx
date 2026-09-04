"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/lib/sidebar-context";
import { SidebarTooltip } from "@/components/ui/sidebar-tooltip";
import { MAIN_NAV_ITEMS, type NavItem } from "@/lib/navigation";

export function Sidebar() {
  const { collapsed, toggleCollapsed } = useSidebar();
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col fixed inset-y-0 left-0 border-r border-border/50 bg-background/95 backdrop-blur-xl shadow-xl shadow-black/5 transition-all duration-300 z-40",
        collapsed ? "w-[68px]" : "w-[220px]"
      )}
    >
      {/* Logo */}
      <div className={cn(
        "flex items-center border-b border-border/50 h-14 shrink-0",
        collapsed ? "justify-center px-2" : "gap-2.5 px-5"
      )}>
        <Link href="/dashboard" className="flex items-center gap-2.5 group shrink-0" aria-label="RithuDevQuest Home">
          <div className="relative grid size-7 place-items-center rounded-lg bg-gradient-to-br from-primary via-emerald-400 to-cyan-400 text-primary-foreground shadow-md shadow-primary/30 transition-all duration-300 group-hover:scale-110">
            <span className="text-xs font-black">R</span>
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="text-base font-black tracking-tight text-foreground overflow-hidden whitespace-nowrap"
              >
                RithuDevQuest
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 flex flex-col gap-1 px-3 py-4 overflow-y-auto scrollbar-hide" aria-label="Main navigation">
        {MAIN_NAV_ITEMS.map((item) => (
          <SidebarNavItem
            key={item.href}
            item={item}
            pathname={pathname}
            collapsed={collapsed}
          />
        ))}
      </nav>

      {/* Collapse toggle */}
      <div className="border-t border-border/50 p-2 shrink-0">
        <button
          onClick={toggleCollapsed}
          className="w-full flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="size-4" />
          ) : (
            <>
              <ChevronLeft className="size-4" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}

function SidebarNavItem({
  item,
  pathname,
  collapsed,
}: {
  item: NavItem;
  pathname: string;
  collapsed: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const Icon = item.icon;
  const isActive =
    pathname === item.href || pathname.startsWith(item.href + "/");

  return (
    <Link
      href={item.href}
      className={cn(
        "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200",
        collapsed && "justify-center px-2",
        isActive
          ? "bg-primary/10 text-primary shadow-sm shadow-primary/10"
          : "text-muted-foreground hover:text-foreground hover:bg-muted/50 hover:shadow-sm hover:shadow-primary/5"
      )}
      aria-current={isActive ? "page" : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {isActive && (
        <motion.div
          layoutId="sidebar-active"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-full bg-primary"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
      {collapsed && <SidebarTooltip label={item.label} visible={hovered} />}
      <Icon
        className={cn(
          "size-5 shrink-0 transition-colors",
          isActive ? "text-primary" : "group-hover:text-foreground"
        )}
        aria-hidden="true"
      />
      <AnimatePresence>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            className="overflow-hidden whitespace-nowrap"
          >
            {item.label}
          </motion.span>
        )}
      </AnimatePresence>
      {isActive && !collapsed && (
        <div className="ml-auto size-1.5 rounded-full bg-primary animate-pulse" />
      )}
    </Link>
  );
}
