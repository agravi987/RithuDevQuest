"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface NavLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  isNavigating?: boolean;
}

export function NavLink({
  href,
  children,
  className,
  "aria-current": ariaCurrent,
  onMouseEnter,
  onMouseLeave,
  onClick,
  onKeyDown,
  ...rest
}: NavLinkProps) {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (onClick) onClick(e);
    if (e.defaultPrevented) return;
    e.preventDefault();
    setIsNavigating(true);
    router.push(href);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLAnchorElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (onKeyDown) onKeyDown(e);
      setIsNavigating(true);
      router.push(href);
    } else if (onKeyDown) {
      onKeyDown(e);
    }
  };

  return (
    <Link
      href={href}
      className={className}
      aria-current={ariaCurrent}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      {...rest}
    >
      {isNavigating && <span className="sr-only">Navigating...</span>}
      {children}
    </Link>
  );
}