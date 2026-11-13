import {
  Home,
  BookOpen,
  Target,
  MessageSquare,
  Award,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  shortLabel?: string;
  icon: LucideIcon;
  /** Active color applied to the icon/label when the route is current. */
  activeColor: string;
  /** Optional colored glow for the active tab, used by the mobile nav. */
  glowColor?: string;
};

/**
 * Single source of truth for the main navigation. Used by the desktop
 * sidebar and the mobile bottom nav so labels/icons stay consistent.
 */
export const MAIN_NAV_ITEMS: NavItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    shortLabel: "Home",
    icon: Home,
    activeColor: "text-primary",
    glowColor: "shadow-primary/30",
  },
  {
    href: "/learn",
    label: "Learn",
    shortLabel: "Learn",
    icon: BookOpen,
    activeColor: "text-primary",
    glowColor: "shadow-primary/30",
  },
  {
    href: "/practice",
    label: "Practice",
    shortLabel: "Practice",
    icon: Target,
    activeColor: "text-xp",
    glowColor: "shadow-xp/30",
  },
  {
    href: "/interview-prep",
    label: "Interview Prep",
    shortLabel: "Interview",
    icon: MessageSquare,
    activeColor: "text-primary",
    glowColor: "shadow-primary/30",
  },
  {
    href: "/achievements",
    label: "Achievements",
    shortLabel: "Badges",
    icon: Award,
    activeColor: "text-achievement",
    glowColor: "shadow-achievement/30",
  },
];
