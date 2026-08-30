import Link from "next/link";
import { ChevronRight, Home, Sparkles } from "lucide-react";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm">
      <Link
        href="/dashboard"
        className="grid size-6 place-items-center rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all duration-200 hover:scale-110"
      >
        <Home className="size-3.5" />
      </Link>

      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-1">
          <ChevronRight className="size-3 text-muted-foreground/40" />
          {item.href ? (
            <Link
              href={item.href}
              className="text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium hover:scale-[1.02]"
            >
              {item.label}
            </Link>
          ) : (
            <span className="flex items-center gap-1 font-semibold text-foreground">
              {item.label}
              {index === items.length - 1 && (
                <Sparkles className="size-3 text-primary/50 animate-float-sparkle" />
              )}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}
