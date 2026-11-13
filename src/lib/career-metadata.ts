import {
  Terminal,
  Cloud,
  Bot,
  Globe,
  Building2,
  type LucideIcon,
} from "lucide-react";

/* ─────────────────────────────────────────────────────────────
   CAREER TIER  (the 5 top-level "worlds")
   ───────────────────────────────────────────────────────────── */

export type CareerVisual = {
  slug: string;
  title: string;
  emoji: string;
  pngPath: string;
  /** Tailwind 3-stop gradient for the planet sphere. */
  planet: string;
  /** Text accent color class. */
  accent: string;
  /** Shadow/glow class. */
  glow: string;
  /** Tailwind class string for the active career tab pill. */
  tabClass: string;
  icon: LucideIcon;
};

export const CAREERS: CareerVisual[] = [
  {
    slug: "devops",
    title: "DevOps",
    emoji: "🐧",
    pngPath: "/png_images/planets/devops.png",
    planet: "from-emerald-400 to-teal-600",
    accent: "text-emerald-400",
    glow: "shadow-emerald-500/30",
    tabClass:
      "text-emerald-600 border-emerald-600/30 bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30",
    icon: Terminal,
  },
  {
    slug: "cloud",
    title: "Cloud",
    emoji: "☁️",
    pngPath: "/png_images/planets/cloud.png",
    planet: "from-sky-400 to-blue-700",
    accent: "text-sky-400",
    glow: "shadow-sky-500/30",
    tabClass:
      "text-sky-600 border-sky-600/30 bg-sky-500/10 dark:text-sky-400 dark:border-sky-500/30",
    icon: Cloud,
  },
  {
    slug: "ai-agents",
    title: "AI Agents",
    emoji: "🤖",
    pngPath: "/png_images/planets/ai-agents.png",
    planet: "from-fuchsia-400 to-purple-700",
    accent: "text-fuchsia-400",
    glow: "shadow-fuchsia-500/30",
    tabClass:
      "text-fuchsia-600 border-fuchsia-600/30 bg-fuchsia-500/10 dark:text-fuchsia-400 dark:border-fuchsia-500/30",
    icon: Bot,
  },
  {
    slug: "web-dev",
    title: "Web Development",
    emoji: "🌐",
    pngPath: "/png_images/planets/web-dev.png",
    planet: "from-amber-400 to-orange-600",
    accent: "text-amber-400",
    glow: "shadow-amber-500/30",
    tabClass:
      "text-amber-600 border-amber-600/30 bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/30",
    icon: Globe,
  },
  {
    slug: "system-design",
    title: "System Design",
    emoji: "🏗️",
    pngPath: "/png_images/planets/system-design.png",
    planet: "from-teal-400 to-cyan-700",
    accent: "text-teal-400",
    glow: "shadow-teal-500/30",
    tabClass:
      "text-teal-600 border-teal-600/30 bg-teal-500/10 dark:text-teal-400 dark:border-teal-500/30",
    icon: Building2,
  },
];

const CAREER_BY_SLUG = new Map(CAREERS.map((c) => [c.slug, c]));

export function getCareer(slug: string | null | undefined): CareerVisual | undefined {
  if (!slug) return undefined;
  return CAREER_BY_SLUG.get(slug);
}

export function getCareerFallback(): CareerVisual {
  return {
    slug: "fallback",
    title: "Mystery Planet",
    emoji: "🪐",
    pngPath: "/png_images/planets/devops.png",
    planet: "from-slate-400 to-slate-700",
    accent: "text-slate-400",
    glow: "shadow-slate-500/30",
    tabClass:
      "text-slate-600 border-slate-600/30 bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/30",
    icon: Terminal,
  };
}

/* ─────────────────────────────────────────────────────────────
   PATH TIER  (the learning tracks inside every career)
   ───────────────────────────────────────────────────────────── */

export type PathVisual = {
  slug: string;
  emoji: string;
  /** Flavor subtitle shown on the planet card. */
  subtitle: string;
  /** Tailwind 3-stop gradient for the planet sphere. */
  planet: string;
  /** Tailwind border class for the planet ring. */
  ring: string;
  /** Tailwind border class for the orbit ring. */
  orbit: string;
  /** Tailwind gradient for the card background (incl. dark variants). */
  bg: string;
  /** Shadow/glow class. */
  glow: string;
  /** Primary hex color. */
  color: string;
  /** Accent text class (derived). */
  accent: string;
};

const PATHS: Record<string, Omit<PathVisual, "slug" | "accent">> = {
  linux: {
    emoji: "🐧",
    subtitle: "Command Planet",
    planet: "from-emerald-400 via-green-500 to-teal-600",
    ring: "border-emerald-400/30",
    orbit: "border-emerald-400/10",
    bg: "from-emerald-950/30 via-green-950/15 to-teal-950/25 dark:from-emerald-950/40 dark:via-green-950/20 dark:to-teal-950/30",
    glow: "shadow-emerald-500/20",
    color: "#10b981",
  },
  git: {
    emoji: "🔀",
    subtitle: "Branch Moon",
    planet: "from-blue-400 via-indigo-500 to-blue-600",
    ring: "border-blue-400/30",
    orbit: "border-blue-400/10",
    bg: "from-blue-950/30 via-indigo-950/15 to-blue-950/25 dark:from-blue-950/40 dark:via-indigo-950/20 dark:to-blue-950/30",
    glow: "shadow-blue-500/20",
    color: "#3b82f6",
  },
  docker: {
    emoji: "🐳",
    subtitle: "Container World",
    planet: "from-cyan-400 via-sky-500 to-cyan-600",
    ring: "border-cyan-400/30",
    orbit: "border-cyan-400/10",
    bg: "from-cyan-950/30 via-sky-950/15 to-cyan-950/25 dark:from-cyan-950/40 dark:via-sky-950/20 dark:to-cyan-950/30",
    glow: "shadow-cyan-500/20",
    color: "#06b6d4",
  },
  kubernetes: {
    emoji: "☸️",
    subtitle: "Deep Space Station",
    planet: "from-purple-400 via-violet-500 to-purple-600",
    ring: "border-purple-400/30",
    orbit: "border-purple-400/10",
    bg: "from-purple-950/30 via-violet-950/15 to-purple-950/25 dark:from-purple-950/40 dark:via-violet-950/20 dark:to-purple-950/30",
    glow: "shadow-purple-500/20",
    color: "#8b5cf6",
  },
  networking: {
    emoji: "🌐",
    subtitle: "Network Nebula",
    planet: "from-sky-400 via-cyan-500 to-sky-600",
    ring: "border-sky-400/30",
    orbit: "border-sky-400/10",
    bg: "from-sky-950/30 via-cyan-950/15 to-sky-950/25 dark:from-sky-950/40 dark:via-cyan-950/20 dark:to-sky-950/30",
    glow: "shadow-sky-500/20",
    color: "#38bdf8",
  },
  aws: {
    emoji: "☁️",
    subtitle: "Amazon Dominion",
    planet: "from-orange-400 via-amber-500 to-orange-600",
    ring: "border-orange-400/30",
    orbit: "border-orange-400/10",
    bg: "from-orange-950/30 via-amber-950/15 to-orange-950/25 dark:from-orange-950/40 dark:via-amber-950/20 dark:to-orange-950/30",
    glow: "shadow-orange-500/20",
    color: "#f59e0b",
  },
  gcp: {
    emoji: "💎",
    subtitle: "Google Orbit",
    planet: "from-blue-400 via-sky-500 to-indigo-600",
    ring: "border-blue-400/30",
    orbit: "border-blue-400/10",
    bg: "from-blue-950/30 via-sky-950/15 to-indigo-950/25 dark:from-blue-950/40 dark:via-sky-950/20 dark:to-indigo-950/30",
    glow: "shadow-blue-500/20",
    color: "#60a5fa",
  },
  "ai-agent-fundamentals": {
    emoji: "🤖",
    subtitle: "Agent Core",
    planet: "from-fuchsia-400 via-purple-500 to-fuchsia-600",
    ring: "border-fuchsia-400/30",
    orbit: "border-fuchsia-400/10",
    bg: "from-fuchsia-950/30 via-purple-950/15 to-fuchsia-950/25 dark:from-fuchsia-950/40 dark:via-purple-950/20 dark:to-fuchsia-950/30",
    glow: "shadow-fuchsia-500/20",
    color: "#d946ef",
  },
  "prompt-engineering": {
    emoji: "✍️",
    subtitle: "Prompt Forge",
    planet: "from-pink-400 via-rose-500 to-pink-600",
    ring: "border-pink-400/30",
    orbit: "border-pink-400/10",
    bg: "from-pink-950/30 via-rose-950/15 to-pink-950/25 dark:from-pink-950/40 dark:via-rose-950/20 dark:to-pink-950/30",
    glow: "shadow-pink-500/20",
    color: "#ec4899",
  },
  "rag-memory": {
    emoji: "🧠",
    subtitle: "Memory Archive",
    planet: "from-indigo-400 via-blue-500 to-indigo-600",
    ring: "border-indigo-400/30",
    orbit: "border-indigo-400/10",
    bg: "from-indigo-950/30 via-blue-950/15 to-indigo-950/25 dark:from-indigo-950/40 dark:via-blue-950/20 dark:to-indigo-950/30",
    glow: "shadow-indigo-500/20",
    color: "#6366f1",
  },
  "agent-frameworks-tools": {
    emoji: "🧰",
    subtitle: "Toolkit Cluster",
    planet: "from-amber-400 via-orange-500 to-amber-600",
    ring: "border-amber-400/30",
    orbit: "border-amber-400/10",
    bg: "from-amber-950/30 via-orange-950/15 to-amber-950/25 dark:from-amber-950/40 dark:via-orange-950/20 dark:to-amber-950/30",
    glow: "shadow-amber-500/20",
    color: "#f97316",
  },
  "html-css-js": {
    emoji: "🎨",
    subtitle: "Web Seed",
    planet: "from-orange-300 via-pink-400 to-rose-500",
    ring: "border-orange-300/30",
    orbit: "border-orange-300/10",
    bg: "from-orange-950/30 via-pink-950/15 to-rose-950/25 dark:from-orange-950/40 dark:via-pink-950/20 dark:to-rose-950/30",
    glow: "shadow-orange-400/20",
    color: "#fb7185",
  },
  "node-backend": {
    emoji: "⚙️",
    subtitle: "Server Core",
    planet: "from-green-400 via-emerald-500 to-green-600",
    ring: "border-green-400/30",
    orbit: "border-green-400/10",
    bg: "from-green-950/30 via-emerald-950/15 to-green-950/25 dark:from-green-950/40 dark:via-emerald-950/20 dark:to-green-950/30",
    glow: "shadow-green-500/20",
    color: "#10b981",
  },
  react: {
    emoji: "⚛️",
    subtitle: "Component Storm",
    planet: "from-cyan-300 via-sky-400 to-blue-500",
    ring: "border-cyan-300/30",
    orbit: "border-cyan-300/10",
    bg: "from-cyan-950/30 via-sky-950/15 to-blue-950/25 dark:from-cyan-950/40 dark:via-sky-950/20 dark:to-blue-950/30",
    glow: "shadow-cyan-400/20",
    color: "#22d3ee",
  },
  nextjs: {
    emoji: "🔷",
    subtitle: "App Router",
    planet: "from-indigo-300 via-violet-500 to-indigo-600",
    ring: "border-indigo-300/30",
    orbit: "border-indigo-300/10",
    bg: "from-indigo-950/30 via-violet-950/15 to-indigo-950/25 dark:from-indigo-950/40 dark:via-violet-950/20 dark:to-indigo-950/30",
    glow: "shadow-indigo-400/20",
    color: "#818cf8",
  },
  "system-design-foundations": {
    emoji: "🏗️",
    subtitle: "Blueprint Planet",
    planet: "from-stone-300 via-neutral-400 to-stone-500",
    ring: "border-stone-300/30",
    orbit: "border-stone-300/10",
    bg: "from-stone-950/30 via-neutral-950/15 to-stone-950/25 dark:from-stone-950/40 dark:via-neutral-950/20 dark:to-stone-950/30",
    glow: "shadow-stone-400/20",
    color: "#a8a29e",
  },
  "system-design-hld": {
    emoji: "🧭",
    subtitle: "Architect Compass",
    planet: "from-teal-300 via-emerald-400 to-teal-500",
    ring: "border-teal-300/30",
    orbit: "border-teal-300/10",
    bg: "from-teal-950/30 via-emerald-950/15 to-teal-950/25 dark:from-teal-950/40 dark:via-emerald-950/20 dark:to-teal-950/30",
    glow: "shadow-teal-400/20",
    color: "#2dd4bf",
  },
  "system-design-lld": {
    emoji: "🔬",
    subtitle: "Precision Lab",
    planet: "from-sky-300 via-cyan-400 to-sky-500",
    ring: "border-sky-300/30",
    orbit: "border-sky-300/10",
    bg: "from-sky-950/30 via-cyan-950/15 to-sky-950/25 dark:from-sky-950/40 dark:via-cyan-950/20 dark:to-sky-950/30",
    glow: "shadow-sky-400/20",
    color: "#7dd3fc",
  },
  "system-design-scalability": {
    emoji: "📈",
    subtitle: "Exponential Moon",
    planet: "from-red-300 via-rose-400 to-red-500",
    ring: "border-red-300/30",
    orbit: "border-red-300/10",
    bg: "from-red-950/30 via-rose-950/15 to-red-950/25 dark:from-red-950/40 dark:via-rose-950/20 dark:to-red-950/30",
    glow: "shadow-red-400/20",
    color: "#fb7185",
  },
};

export const PATH_VISUALS: Record<string, PathVisual> = Object.fromEntries(
  Object.entries(PATHS).map(([slug, p]) => [
    slug,
    { ...p, slug, accent: `[color:${p.color}]` },
  ]),
);

export function getPathVisual(slug: string): PathVisual {
  return (
    PATH_VISUALS[slug] ?? {
      slug,
      emoji: "🪐",
      subtitle: "Mystery Planet",
      planet: "from-slate-400 to-slate-700",
      ring: "border-slate-400/30",
      orbit: "border-slate-400/10",
      bg: "from-slate-950/30 to-slate-950/40",
      glow: "shadow-slate-500/20",
      color: "#94a3b8",
      accent: "[color:#94a3b8]",
    }
  );
}

export const FALLBACK_PATH_VISUAL = getPathVisual("__fallback__");

/* ─────────────────────────────────────────────────────────────
   MODULE / LESSON ICONS  (Lucide icon name -> emoji)
   ───────────────────────────────────────────────────────────── */

export const MODULE_ICONS: Record<string, string> = {
  Terminal: "🐚",
  FolderTree: "📁",
  Shield: "🔐",
  Activity: "⚙️",
  Network: "🌐",
  Brain: "🧠",
  Code: "💻",
  Database: "🗄️",
  Cloud: "☁️",
  Container: "🐳",
  GitBranch: "🔀",
  Server: "🖥️",
};

const FALLBACK_MODULE_EMOJIS = ["🪐", "⭐", "🚀", "🌙", "☄️", "🔭"];

export function getModuleIcon(icon: string, index = 0): string {
  if (icon && MODULE_ICONS[icon]) return MODULE_ICONS[icon]!;
  return FALLBACK_MODULE_EMOJIS[index % FALLBACK_MODULE_EMOJIS.length]!;
}

/* ─────────────────────────────────────────────────────────────
   GALAXY-PATH THEMES  (identity theming for every learning path)
   ───────────────────────────────────────────────────────────── */

export type PathTheme = {
  primary: string;
  glow: string;
  sphere: string;
  label: string;
};

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const full =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h;
  const num = parseInt(full, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function withAlpha(hex: string, alpha: number): string {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r},${g},${b},${alpha})`;
}

function shade(hex: string, amount: number): string {
  const [r, g, b] = hexToRgb(hex);
  const f = (c: number) =>
    Math.max(0, Math.min(255, Math.round(amount < 0 ? c * (1 + amount) : c + (255 - c) * amount)));
  return `#${[f(r), f(g), f(b)]
    .map((n) => n.toString(16).padStart(2, "0"))
    .join("")}`;
}

export function getPathTheme(slug: string): PathTheme {
  const visual = getPathVisual(slug);
  const primary = visual.color;
  return {
    primary,
    glow: withAlpha(primary, 0.3),
    sphere: `radial-gradient(circle at 30% 25%, ${shade(primary, 0.45)}, ${shade(primary, 0.1)} 40%, ${shade(primary, -0.35)} 78%, ${shade(primary, -0.6)})`,
    label: visual.subtitle,
  };
}

/* Re-export the four hand-tuned core themes for backward compatibility. */
export const CORE_PATH_THEMES: Record<string, PathTheme> = {
  linux: {
    primary: "#34d399",
    glow: "rgba(52,211,153,0.3)",
    sphere: "radial-gradient(circle at 30% 25%, #6ee7b7, #10b981 40%, #047857 78%, #064e3b)",
    label: "Command Nebula",
  },
  git: {
    primary: "#60a5fa",
    glow: "rgba(96,165,250,0.3)",
    sphere: "radial-gradient(circle at 30% 25%, #93c5fd, #3b82f6 40%, #1d4ed8 78%, #1e3a8a)",
    label: "Branch Galaxy",
  },
  docker: {
    primary: "#22d3ee",
    glow: "rgba(34,211,238,0.3)",
    sphere: "radial-gradient(circle at 30% 25%, #67e8f9, #06b6d4 40%, #0e7490 78%, #164e63)",
    label: "Container Cluster",
  },
  kubernetes: {
    primary: "#a78bfa",
    glow: "rgba(167,139,250,0.3)",
    sphere: "radial-gradient(circle at 30% 25%, #c4b5fd, #8b5cf6 40%, #6d28d9 78%, #4c1d95)",
    label: "Orbit Station",
  },
};
