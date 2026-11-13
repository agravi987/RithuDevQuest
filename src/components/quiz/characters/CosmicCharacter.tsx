"use client";

import * as React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import type { CharacterId, CharacterMood, CosmicCharacterProps } from "../types";

export function CosmicCharacter({
  characterId,
  mood = "idle",
  size,
  className,
}: CosmicCharacterProps) {
  const sizeClass = size
    ? {
        xs: "w-8 h-8",
        sm: "w-12 h-12",
        md: "w-20 h-20",
        lg: "w-28 h-28 sm:w-32 sm:h-32",
        custom: "",
      }[size]
    : (!className?.includes("w-") && !className?.includes("size-") ? "w-20 h-20" : "");

  const animationVariants = {
    idle: {
      y: [0, -4, 0],
      transition: { duration: 3, repeat: Infinity, ease: "easeInOut" as const },
    },
    thinking: {
      rotate: [-3, 3, -3],
      transition: { duration: 2, repeat: Infinity, ease: "easeInOut" as const },
    },
    speaking: {
      scale: [1, 1.03, 1],
      y: [0, -2, 0],
      transition: { duration: 0.4, repeat: Infinity, ease: "easeInOut" as const },
    },
    happy_jump: {
      y: [0, -14, 0],
      scale: [1, 1.08, 1],
      transition: { duration: 0.5, repeat: 2, ease: "easeOut" as const },
    },
    sad_droop: {
      y: 6,
      rotate: -4,
      transition: { duration: 0.4, ease: "easeOut" as const },
    },
    celebrating: {
      y: [0, -16, 0],
      rotate: [-8, 8, -8],
      scale: [1, 1.1, 1],
      transition: { duration: 0.6, repeat: Infinity, ease: "easeInOut" as const },
    },
  };

  return (
    <motion.div
      animate={animationVariants[mood]}
      className={cn("relative shrink-0 select-none", sizeClass, className)}
    >
      {renderCharacterSvg(characterId, mood)}
    </motion.div>
  );
}

function renderCharacterSvg(id: CharacterId, mood: CharacterMood) {
  switch (id) {
    case "rithu":
      return <RithuCommanderSvg mood={mood} />;
    case "orion":
      return <OrionScientistSvg mood={mood} />;
    case "astra":
      return <AstraCyberSvg mood={mood} />;
    case "nova":
      return <NovaCadetSvg mood={mood} />;
    case "vance":
      return <VanceVeteranSvg mood={mood} />;
    case "cosmo":
      return <CosmoBotSvg mood={mood} />;
    default:
      return <RithuCommanderSvg mood={mood} />;
  }
}

/* ── 1. Commander Rithu (The AI Mission Commander & Guide) ── */
function RithuCommanderSvg({ mood }: { mood: CharacterMood }) {
  const isHappy = mood === "happy_jump" || mood === "celebrating";
  const isSad = mood === "sad_droop";

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
      <defs>
        <linearGradient id="rithuHelmet" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#e2e8f0" />
        </linearGradient>
        <linearGradient id="rithuVisor" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#064e3b" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
      </defs>
      {/* Antenna */}
      <line x1="50" y1="20" x2="50" y2="8" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
      <circle cx="50" cy="7" r="4" fill="#34d399" className="animate-pulse" />

      {/* Body / Suit */}
      <path d="M 28 85 Q 50 78 72 85 L 75 98 L 25 98 Z" fill="url(#rithuHelmet)" stroke="#cbd5e1" strokeWidth="2" />
      <circle cx="50" cy="90" r="4" fill="#10b981" />

      {/* Helmet Shell */}
      <circle cx="50" cy="50" r="32" fill="url(#rithuHelmet)" stroke="#cbd5e1" strokeWidth="2.5" />

      {/* Visor */}
      <ellipse cx="50" cy="50" rx="24" ry="17" fill="url(#rithuVisor)" stroke="#047857" strokeWidth="2" />

      {/* Visor Glint */}
      <path d="M 32 40 Q 42 36 54 38" stroke="#6ee7b7" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.7" />

      {/* Animated LED Eyes / Visor Expression */}
      {isHappy ? (
        <g stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" fill="none">
          <path d="M 39 52 Q 44 46 49 52" />
          <path d="M 51 52 Q 56 46 61 52" />
        </g>
      ) : isSad ? (
        <g stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" fill="none">
          <path d="M 39 48 Q 44 54 49 48" />
          <path d="M 51 48 Q 56 54 61 48" />
        </g>
      ) : (
        <g fill="#ffffff">
          <circle cx="43" cy="50" r="3.5" />
          <circle cx="57" cy="50" r="3.5" />
          <circle cx="44.5" cy="48.5" r="1.2" fill="#a7f3d0" />
          <circle cx="58.5" cy="48.5" r="1.2" fill="#a7f3d0" />
        </g>
      )}
    </svg>
  );
}

/* ── 2. Dr. Orion (The Eccentric Quantum Scientist) ── */
function OrionScientistSvg({ mood }: { mood: CharacterMood }) {
  const isHappy = mood === "happy_jump" || mood === "celebrating";

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
      <defs>
        <linearGradient id="orionCoat" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#1e3a8a" />
        </linearGradient>
      </defs>
      {/* Floating Holographic Symbols */}
      <text x="12" y="32" fill="#38bdf8" fontSize="11" fontWeight="bold" opacity="0.8">λ</text>
      <text x="80" y="35" fill="#a855f7" fontSize="10" fontWeight="bold" opacity="0.8">∑</text>

      {/* Wild Silver Quantum Hair */}
      <path d="M 22 42 Q 15 20 38 18 Q 50 10 62 18 Q 85 20 78 42 Z" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2" />

      {/* Head */}
      <circle cx="50" cy="52" r="26" fill="#fde047" opacity="0.9" />

      {/* Floating Quantum Goggles */}
      <circle cx="41" cy="50" r="11" fill="#0284c7" stroke="#38bdf8" strokeWidth="2.5" />
      <circle cx="59" cy="50" r="11" fill="#0284c7" stroke="#38bdf8" strokeWidth="2.5" />
      <line x1="51" y1="50" x2="49" y2="50" stroke="#38bdf8" strokeWidth="3" />

      {/* Goggle Reticles */}
      <circle cx="41" cy="50" r="4" fill="#ffffff" />
      <circle cx="59" cy="50" r="4" fill="#ffffff" />

      {/* Lab Coat Collar */}
      <path d="M 28 80 L 50 68 L 72 80 L 76 98 L 24 98 Z" fill="url(#orionCoat)" stroke="#0284c7" strokeWidth="2" />

      {/* Smile / Expression */}
      <path
        d={isHappy ? "M 44 64 Q 50 72 56 64" : "M 45 66 Q 50 68 55 66"}
        stroke="#1e293b"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

/* ── 3. Astra (The Cyber-Engineer & Terminal Specialist) ── */
function AstraCyberSvg({ mood }: { mood: CharacterMood }) {
  const isHappy = mood === "happy_jump" || mood === "celebrating";

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
      <defs>
        <linearGradient id="astraSuit" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4c1d95" />
          <stop offset="100%" stopColor="#1e1b4b" />
        </linearGradient>
      </defs>
      {/* Cyber Neon Conduits (Left & Right) */}
      <path d="M 18 65 Q 26 50 32 60" stroke="#06b6d4" strokeWidth="2.5" fill="none" />
      <path d="M 82 65 Q 74 50 68 60" stroke="#06b6d4" strokeWidth="2.5" fill="none" />

      {/* Midnight Flight Suit */}
      <path d="M 26 84 Q 50 75 74 84 L 78 98 L 22 98 Z" fill="url(#astraSuit)" stroke="#6d28d9" strokeWidth="2" />

      {/* Head / Face */}
      <circle cx="50" cy="50" r="26" fill="#fcd34d" />

      {/* Cyber Hair (Midnight Purple Bangs) */}
      <path d="M 24 45 Q 50 22 76 45 Q 70 32 50 30 Q 30 32 24 45 Z" fill="#581c87" />

      {/* Oversized Neon Headphones */}
      <rect x="18" y="38" width="10" height="24" rx="5" fill="#06b6d4" stroke="#0891b2" strokeWidth="2" />
      <rect x="72" y="38" width="10" height="24" rx="5" fill="#06b6d4" stroke="#0891b2" strokeWidth="2" />
      <path d="M 23 40 Q 50 16 77 40" stroke="#06b6d4" strokeWidth="3.5" fill="none" strokeLinecap="round" />

      {/* Cool Deadpan / Confident Eyes */}
      {isHappy ? (
        <g stroke="#1e1b4b" strokeWidth="2.5" strokeLinecap="round" fill="none">
          <path d="M 39 52 Q 44 48 49 52" />
          <path d="M 51 52 Q 56 48 61 52" />
        </g>
      ) : (
        <g fill="#1e1b4b">
          <rect x="38" y="49" width="10" height="4" rx="2" fill="#06b6d4" />
          <rect x="52" y="49" width="10" height="4" rx="2" fill="#06b6d4" />
        </g>
      )}

      {/* Smirk */}
      <path d="M 46 64 Q 52 66 56 62" stroke="#1e1b4b" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  );
}

/* ── 4. Cadet Nova (The Hyper-Energetic Starship Pilot) ── */
function NovaCadetSvg({ mood }: { mood: CharacterMood }) {
  const isHappy = mood === "happy_jump" || mood === "celebrating";

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
      <defs>
        <linearGradient id="novaSuit" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#c2410c" />
        </linearGradient>
      </defs>
      {/* Thruster Spark Particles */}
      <circle cx="16" cy="78" r="3" fill="#facc15" className="animate-ping" />
      <circle cx="84" cy="78" r="3" fill="#facc15" className="animate-ping" />

      {/* Bright Solar Flight Suit */}
      <path d="M 26 84 Q 50 76 74 84 L 78 98 L 22 98 Z" fill="url(#novaSuit)" stroke="#ea580c" strokeWidth="2" />
      {/* Star Cadet Badge */}
      <polygon points="50,83 52,87 56,87 53,89 54,93 50,90 46,93 47,89 44,87 48,87" fill="#facc15" />

      {/* Pilot Helmet Base */}
      <circle cx="50" cy="50" r="28" fill="#ffedd5" stroke="#fdba74" strokeWidth="2" />

      {/* Orange Pilot Cap */}
      <path d="M 24 45 Q 50 18 76 45 Z" fill="#ea580c" />
      {/* Goggles on Forehead */}
      <rect x="34" y="32" width="14" height="9" rx="3" fill="#38bdf8" stroke="#0284c7" strokeWidth="1.5" />
      <rect x="52" y="32" width="14" height="9" rx="3" fill="#38bdf8" stroke="#0284c7" strokeWidth="1.5" />
      <line x1="47" y1="36" x2="53" y2="36" stroke="#0284c7" strokeWidth="2" />

      {/* Energetic Big Eyes */}
      <circle cx="42" cy="54" r="4.5" fill="#1e293b" />
      <circle cx="58" cy="54" r="4.5" fill="#1e293b" />
      <circle cx="43.5" cy="52.5" r="1.5" fill="#ffffff" />
      <circle cx="59.5" cy="52.5" r="1.5" fill="#ffffff" />

      {/* Big Cheerful Mouth */}
      <path
        d={isHappy ? "M 42 63 Q 50 74 58 63 Z" : "M 44 65 Q 50 70 56 65"}
        fill={isHappy ? "#dc2626" : "none"}
        stroke="#1e293b"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ── 5. Captain Vance (The Grizzled Deep-Space Veteran) ── */
function VanceVeteranSvg({ mood }: { mood: CharacterMood }) {
  const isHappy = mood === "happy_jump" || mood === "celebrating";

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
      <defs>
        <linearGradient id="vanceArmor" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#475569" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
      </defs>
      {/* Heavy EVA Dreadnought Armor */}
      <path d="M 20 82 L 35 72 L 65 72 L 80 82 L 84 98 L 16 98 Z" fill="url(#vanceArmor)" stroke="#64748b" strokeWidth="3" />
      {/* Bionic Arm Conduits */}
      <line x1="22" y1="84" x2="22" y2="98" stroke="#38bdf8" strokeWidth="3" />

      {/* Grizzled Square Helmet */}
      <rect x="25" y="24" width="50" height="50" rx="14" fill="#334155" stroke="#64748b" strokeWidth="3" />

      {/* Scarred Visor */}
      <rect x="31" y="38" width="38" height="20" rx="6" fill="#0f172a" stroke="#f59e0b" strokeWidth="2" />

      {/* Constellation Visor Scar */}
      <line x1="36" y1="42" x2="48" y2="54" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3,2" />

      {/* Stoic Glowing Visor Slit */}
      {isHappy ? (
        <ellipse cx="50" cy="48" rx="12" ry="5" fill="#f59e0b" />
      ) : (
        <rect x="36" y="47" width="28" height="3" rx="1.5" fill="#f59e0b" />
      )}
    </svg>
  );
}

/* ── 6. Cosmo (The Adorable Recon Space-Bot) ── */
function CosmoBotSvg({ mood }: { mood: CharacterMood }) {
  const isHappy = mood === "happy_jump" || mood === "celebrating";
  const isSad = mood === "sad_droop";

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
      {/* Levitating Thruster Ring */}
      <ellipse cx="50" cy="85" rx="18" ry="4" fill="#06b6d4" opacity="0.6" className="animate-pulse" />

      {/* Satellite Ear Flaps */}
      <path d="M 18 42 Q 10 32 18 26" stroke="#0284c7" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M 82 42 Q 90 32 82 26" stroke="#0284c7" strokeWidth="3" strokeLinecap="round" fill="none" />

      {/* Spherical Bot Body */}
      <circle cx="50" cy="48" r="28" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2.5" />

      {/* Emotive Sapphire Lens Screen */}
      <circle cx="50" cy="48" r="18" fill="#0f172a" stroke="#0284c7" strokeWidth="2" />

      {/* Giant Emotive Lens Eye */}
      {isHappy ? (
        <path d="M 40 48 Q 50 38 60 48" stroke="#38bdf8" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      ) : isSad ? (
        <path d="M 40 50 Q 50 58 60 50" stroke="#38bdf8" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      ) : (
        <g fill="#38bdf8">
          <circle cx="50" cy="48" r="9" />
          <circle cx="47" cy="45" r="3" fill="#ffffff" />
        </g>
      )}

      {/* Tiny Magnetic Claw Hands */}
      <circle cx="20" cy="62" r="4" fill="#64748b" />
      <circle cx="80" cy="62" r="4" fill="#64748b" />
    </svg>
  );
}
