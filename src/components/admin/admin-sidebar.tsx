"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  LayoutDashboard,
  LogOut,
  Server,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { handleAdminSignOut } from "@/app/admin/logout-action";

const adminNavItems = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  {
    href: "/admin/content",
    label: "Content",
    icon: BookOpen,
  },
  { href: "/admin/ai", label: "AI Review", icon: Sparkles },
  { href: "/admin/system", label: "System", icon: Server },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex shrink-0 flex-row md:h-screen md:w-64 md:flex-col border-b md:border-b-0 md:border-r border-border/40 bg-background/80 backdrop-blur-xl md:sticky md:top-0">
      <div className="flex items-center gap-2 px-4 py-3 md:py-5">
        <div className="grid size-8 place-items-center rounded-xl bg-gradient-to-br from-primary to-emerald-400 text-primary-foreground shadow-md shadow-primary/20">
          <ShieldCheck className="size-4" />
        </div>
        <div className="hidden md:block">
          <div className="text-sm font-black tracking-tight leading-none">
            Admin
          </div>
          <div className="text-[11px] font-medium text-muted-foreground">
            RithuDevQuest
          </div>
        </div>
        <Badge
          variant="secondary"
          className="ml-auto md:hidden text-[10px] font-bold"
        >
          Admin
        </Badge>
      </div>

      <nav className="flex items-center gap-1 overflow-x-auto px-2 py-2 md:flex-col md:items-stretch md:overflow-visible md:px-3 md:py-2 md:gap-1.5">
        {adminNavItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Button
              key={item.href}
              asChild
              variant="ghost"
              size="sm"
              className={cn(
                "justify-start gap-2 rounded-lg px-3 whitespace-nowrap font-semibold",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-primary/5",
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Link href={item.href}>
                <Icon className="size-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            </Button>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-border/40 p-3">
        <form action={handleAdminSignOut}>
          <Button
            type="submit"
            variant="outline"
            size="sm"
            className="w-full gap-2 text-muted-foreground hover:text-destructive hover:border-destructive/30 hover:bg-destructive/5"
          >
            <LogOut className="size-4" />
            Logout
          </Button>
        </form>
      </div>
    </aside>
  );
}
