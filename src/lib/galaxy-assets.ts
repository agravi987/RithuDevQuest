// Central registry for the Learning Galaxy visual assets.
// Transparent PNGs live under /public/png_images and are served statically.

export const GALAXY = {
  spacecraft: {
    spaceship: "/png_images/spacecraft/spaceship.png",
  },
  planets: {
    // NASA public-domain transparent renders (sourced from Wikimedia Commons)
    devops: "/png_images/planets/devops.png",
    cloud: "/png_images/planets/cloud.png",
    "ai-agents": "/png_images/planets/ai-agents.png",
    "web-dev": "/png_images/planets/web-dev.png",
    "system-design": "/png_images/planets/system-design.png",
  },
} as const;

export type CareerSlug = keyof typeof GALAXY.planets;

type PlanetConfig = {
  src: string;
  alt: string;
  hue: string;
  accent: string;
  glow: string;
};

/**
 * Map a career slug to its planet visual config.
 * Fallback guarantees every career still gets a themed planet even if
 * the direct asset is missing.
 */
export function getPlanetForCareer(slug: string): PlanetConfig {
  const fallback: Record<string, PlanetConfig> = {
    devops: {
      src: GALAXY.planets.devops,
      alt: "DevOps Command Planet",
      hue: "from-emerald-400 to-teal-600",
      accent: "text-emerald-400",
      glow: "shadow-emerald-500/30",
    },
    cloud: {
      src: GALAXY.planets.cloud,
      alt: "Cloud Dominion",
      hue: "from-sky-400 to-blue-700",
      accent: "text-sky-400",
      glow: "shadow-sky-500/30",
    },
    "ai-agents": {
      src: GALAXY.planets["ai-agents"],
      alt: "AI Agents Sector",
      hue: "from-fuchsia-400 to-purple-700",
      accent: "text-fuchsia-400",
      glow: "shadow-fuchsia-500/30",
    },
    "web-dev": {
      src: GALAXY.planets["web-dev"],
      alt: "Web Development Star System",
      hue: "from-amber-400 to-orange-600",
      accent: "text-amber-400",
      glow: "shadow-amber-500/30",
    },
    "system-design": {
      src: GALAXY.planets["system-design"],
      alt: "System Design Architect",
      hue: "from-teal-400 to-cyan-700",
      accent: "text-teal-400",
      glow: "shadow-teal-500/30",
    },
    fallback: {
      src: GALAXY.planets.devops,
      alt: "Mystery Planet",
      hue: "from-slate-400 to-slate-700",
      accent: "text-slate-400",
      glow: "shadow-slate-500/30",
    },
  };

  return fallback[slug] ?? fallback.fallback;
}
