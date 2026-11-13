"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/lib/sidebar-context";
import { SidebarTooltip } from "@/components/ui/sidebar-tooltip";
import { MAIN_NAV_ITEMS, type NavItem } from "@/lib/navigation";
import { NavLink } from "@/components/shared/nav-link";
import { CosmicCharacter } from "@/components/quiz/characters/CosmicCharacter";

export function Sidebar() {
  const { collapsed, toggleCollapsed } = useSidebar();
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col fixed inset-y-0 left-0 border-r-2 border-white/10 bg-[#070b14] shadow-2xl transition-all duration-300 z-40",
        collapsed ? "w-[80px]" : "w-[256px]"
      )}
    >
      {/* Duolingo Mascot Logo */}
      <div
        className={cn(
          "flex items-center border-b-2 border-white/10 h-20 shrink-0",
          collapsed ? "justify-center px-2" : "gap-3 px-6"
        )}
      >
        <NavLink
          href="/learn"
          className="flex items-center gap-3 group shrink-0 min-w-0"
          aria-label="RithuDevQuest Home"
        >
          <div className="relative size-9 shrink-0 flex items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-0.5 transition-transform duration-300 group-hover:scale-110">
            <CosmicCharacter characterId="rithu" mood="idle" size="custom" className="size-8" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="text-lg font-black tracking-tight text-white uppercase overflow-hidden whitespace-nowrap"
              >
                Rithu<span className="text-emerald-400">Quest</span>
              </motion.span>
            )}
          </AnimatePresence>
        </NavLink>
      </div>

      {/* Nav Links — Duolingo 3D Pills */}
      <nav
        className="flex-1 flex flex-col gap-2 px-3 py-6 overflow-y-auto scrollbar-hide"
        aria-label="Main navigation"
      >
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
      <div className="border-t-2 border-white/10 p-3 shrink-0">
        <button
          onClick={toggleCollapsed}
          className="w-full flex items-center justify-center gap-2 rounded-2xl py-2.5 text-xs font-black uppercase tracking-wider text-slate-400 hover:text-white hover:bg-white/5 transition-all"
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
    pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href + "/"));

  return (
    <NavLink
      href={item.href}
      className={cn(
        "group relative flex items-center gap-3.5 rounded-2xl px-4 py-3 text-xs font-black uppercase tracking-wider transition-all duration-150 active:translate-y-0.5",
        collapsed && "justify-center px-2.5",
        isActive
          ? "border-2 border-emerald-500 bg-emerald-500/15 text-emerald-400 shadow-[0_3px_0_0_#059669]"
          : "border-2 border-transparent text-slate-400 hover:bg-white/5 hover:text-white hover:border-white/10"
      )}
      aria-current={isActive ? "page" : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {collapsed && <SidebarTooltip label={item.label} visible={hovered} />}
      <Icon
        className={cn(
          "size-5 shrink-0 transition-transform group-hover:scale-110",
          isActive ? "text-emerald-400" : "text-slate-400 group-hover:text-white"
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
    </NavLink>
  );
}
