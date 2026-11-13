"use client";

import * as React from "react";
import { motion } from "motion/react";
import { Check, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LessonState } from "@/lib/curriculum/navigation";

export type PlanetArchetype =
  | "terrestrial" // Emerald Biosphere with continents & oceans
  | "ringed_gas"  // Saturnian amber banded giant with tilted 3D rings
  | "magma"       // Volcanic obsidian world with molten fissures
  | "cryo_ice"    // Glacial crystalline cyan planet with polar aurora
  | "quantum"     // Amethyst purple gas exoplanet with lightning arcs
  | "solar";      // Golden technosphere with coronal flares

export interface CosmicPlanetProps {
  archetype?: PlanetArchetype;
  archetypeIndex?: number;
  state: LessonState;
  isCurrent?: boolean;
  size?: number; // Planet sphere diameter (default: 68)
  className?: string;
  children?: React.ReactNode;
}

const ARCHETYPES: PlanetArchetype[] = [
  "terrestrial",
  "ringed_gas",
  "magma",
  "cryo_ice",
  "quantum",
  "solar",
];

export function CosmicPlanet({
  archetype,
  archetypeIndex = 0,
  state,
  isCurrent = false,
  size = 68,
  className,
}: CosmicPlanetProps) {
  const chosenArchetype: PlanetArchetype =
    archetype ?? ARCHETYPES[Math.abs(archetypeIndex) % ARCHETYPES.length] ?? "terrestrial";

  const isDone = state === "completed";
  const isLocked = state === "locked";

  // Unique SVG gradient IDs per archetype and instance
  const uid = React.useId().replace(/:/g, "_");

  return (
    <motion.div
      whileHover={!isLocked ? { scale: 1.08 } : undefined}
      whileTap={!isLocked ? { scale: 0.95 } : undefined}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      className={cn("relative group select-none flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      {/* ── 1. Current Mission Radiant Beacon Halo ── */}
      {isCurrent && (
        <>
          <div className="absolute -inset-4 rounded-full border-2 border-emerald-400/30 animate-ping pointer-events-none" />
          <div className="absolute -inset-2.5 rounded-full border border-amber-400/50 blur-[2px] animate-pulse pointer-events-none" />
        </>
      )}

      {/* ── 2. Atmospheric Outer Corona Glow ── */}
      <div
        className={cn(
          "absolute -inset-2 rounded-full pointer-events-none transition-all duration-300 blur-md",
          isDone && "bg-emerald-500/25 group-hover:bg-emerald-500/40",
          isCurrent && "bg-amber-400/30 group-hover:bg-amber-400/50",
          !isDone && !isCurrent && !isLocked && "bg-cyan-500/20 group-hover:bg-cyan-500/35",
          isLocked && "bg-slate-800/10 opacity-40"
        )}
      />

      {/* ── 3. The Planetary Sphere (SVG Vector Rig) ── */}
      <div
        className={cn(
          "relative size-full rounded-full transition-all duration-200 overflow-visible",
          isLocked && "opacity-50 grayscale-[0.6] contrast-[0.85]"
        )}
      >
        <svg
          viewBox="0 0 100 100"
          className="size-full overflow-visible drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Terrestrial Emerald Biosphere Gradients */}
            <radialGradient id={`sphere_terr_${uid}`} cx="35%" cy="30%" r="65%">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="35%" stopColor="#059669" />
              <stop offset="70%" stopColor="#065f46" />
              <stop offset="100%" stopColor="#022c22" />
            </radialGradient>

            {/* Ringed Gas Giant Gradients */}
            <radialGradient id={`sphere_gas_${uid}`} cx="35%" cy="30%" r="65%">
              <stop offset="0%" stopColor="#fde047" />
              <stop offset="30%" stopColor="#f59e0b" />
              <stop offset="65%" stopColor="#b45309" />
              <stop offset="100%" stopColor="#451a03" />
            </radialGradient>
            <linearGradient id={`ring_${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(253, 224, 71, 0.85)" />
              <stop offset="45%" stopColor="rgba(245, 158, 11, 0.4)" />
              <stop offset="60%" stopColor="rgba(217, 119, 6, 0.15)" />
              <stop offset="85%" stopColor="rgba(251, 191, 36, 0.7)" />
              <stop offset="100%" stopColor="rgba(180, 83, 9, 0.9)" />
            </linearGradient>

            {/* Magma Planet Gradients */}
            <radialGradient id={`sphere_magma_${uid}`} cx="35%" cy="30%" r="65%">
              <stop offset="0%" stopColor="#fb923c" />
              <stop offset="25%" stopColor="#ea580c" />
              <stop offset="65%" stopColor="#991b1b" />
              <stop offset="100%" stopColor="#260808" />
            </radialGradient>

            {/* Cryo Ice Planet Gradients */}
            <radialGradient id={`sphere_cryo_${uid}`} cx="35%" cy="30%" r="65%">
              <stop offset="0%" stopColor="#a5f3fc" />
              <stop offset="35%" stopColor="#06b6d4" />
              <stop offset="70%" stopColor="#0e7490" />
              <stop offset="100%" stopColor="#082f49" />
            </radialGradient>

            {/* Quantum Amethyst Planet Gradients */}
            <radialGradient id={`sphere_quantum_${uid}`} cx="35%" cy="30%" r="65%">
              <stop offset="0%" stopColor="#e879f9" />
              <stop offset="35%" stopColor="#a855f7" />
              <stop offset="70%" stopColor="#6b21a8" />
              <stop offset="100%" stopColor="#2e0854" />
            </radialGradient>

            {/* Solar Technosphere Gradients */}
            <radialGradient id={`sphere_solar_${uid}`} cx="35%" cy="30%" r="65%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="35%" stopColor="#eab308" />
              <stop offset="70%" stopColor="#ca8a04" />
              <stop offset="100%" stopColor="#543003" />
            </radialGradient>

            {/* Specular Limb Crescent Shadow & Highlight */}
            <radialGradient id={`specular_${uid}`} cx="30%" cy="25%" r="55%">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.55)" />
              <stop offset="35%" stopColor="rgba(255, 255, 255, 0.15)" />
              <stop offset="75%" stopColor="rgba(0, 0, 0, 0.1)" />
              <stop offset="100%" stopColor="rgba(0, 0, 0, 0.75)" />
            </radialGradient>

            {/* Planet sphere clip mask */}
            <clipPath id={`planet_clip_${uid}`}>
              <circle cx="50" cy="50" r="46" />
            </clipPath>
          </defs>

          {/* Back half of the Saturnian ring (behind the planet) */}
          {chosenArchetype === "ringed_gas" && (
            <g transform="rotate(-24 50 50)">
              <path
                d="M -18,50 A 68,18 0 0,1 118,50"
                fill="none"
                stroke={`url(#ring_${uid})`}
                strokeWidth="10"
                opacity="0.75"
              />
            </g>
          )}

          {/* The Base Planet Body */}
          <circle
            cx="50"
            cy="50"
            r="46"
            fill={
              chosenArchetype === "terrestrial"
                ? `url(#sphere_terr_${uid})`
                : chosenArchetype === "ringed_gas"
                  ? `url(#sphere_gas_${uid})`
                  : chosenArchetype === "magma"
                    ? `url(#sphere_magma_${uid})`
                    : chosenArchetype === "cryo_ice"
                      ? `url(#sphere_cryo_${uid})`
                      : chosenArchetype === "quantum"
                        ? `url(#sphere_quantum_${uid})`
                        : `url(#sphere_solar_${uid})`
            }
          />

          {/* Internal Planetary Textures (masked to circle) */}
          <g clipPath={`url(#planet_clip_${uid})`}>
            {/* Terrestrial Continents & Swirling Ocean Cloud Belts */}
            {chosenArchetype === "terrestrial" && (
              <>
                <path
                  d="M 22,35 Q 38,20 54,32 Q 70,44 65,60 Q 45,68 30,55 Z"
                  fill="#10b981"
                  opacity="0.5"
                />
                <path
                  d="M 45,60 Q 60,52 75,65 Q 82,78 68,85 Q 50,82 45,60 Z"
                  fill="#047857"
                  opacity="0.45"
                />
                <path
                  d="M 12,50 Q 28,42 35,58 Q 20,70 12,50 Z"
                  fill="#34d399"
                  opacity="0.35"
                />
                {/* Translucent Cloud Swirls */}
                <path
                  d="M 10,38 Q 40,48 85,30"
                  fill="none"
                  stroke="rgba(255,255,255,0.4)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                <path
                  d="M 20,66 Q 60,60 92,72"
                  fill="none"
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </>
            )}

            {/* Ringed Gas Giant Atmospheric Cloud Stripes */}
            {chosenArchetype === "ringed_gas" && (
              <>
                <ellipse cx="50" cy="30" rx="46" ry="6" fill="#fde047" opacity="0.3" />
                <ellipse cx="50" cy="42" rx="48" ry="8" fill="#d97706" opacity="0.35" />
                <ellipse cx="50" cy="56" rx="48" ry="7" fill="#b45309" opacity="0.4" />
                <ellipse cx="50" cy="70" rx="46" ry="6" fill="#78350f" opacity="0.3" />
                {/* Great Red/Amber Storm Spot */}
                <ellipse cx="68" cy="48" rx="8" ry="5" fill="#f59e0b" opacity="0.7" />
              </>
            )}

            {/* Volcanic Magma Cracks */}
            {chosenArchetype === "magma" && (
              <>
                <path
                  d="M 25,25 L 38,42 L 52,38 L 68,55 L 80,50"
                  fill="none"
                  stroke="#fdba74"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  opacity="0.85"
                />
                <path
                  d="M 38,42 L 32,68 L 48,78"
                  fill="none"
                  stroke="#f97316"
                  strokeWidth="2"
                  strokeLinecap="round"
                  opacity="0.75"
                />
                <path
                  d="M 52,38 L 62,24"
                  fill="none"
                  stroke="#fde047"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  opacity="0.8"
                />
                {/* Magma Caldera */}
                <circle cx="68" cy="55" r="5" fill="#fef08a" opacity="0.85" />
              </>
            )}

            {/* Cryo Ice Glacial Swirls */}
            {chosenArchetype === "cryo_ice" && (
              <>
                <path
                  d="M 15,28 Q 50,38 88,24"
                  fill="none"
                  stroke="#e0f2fe"
                  strokeWidth="4"
                  strokeLinecap="round"
                  opacity="0.5"
                />
                <path
                  d="M 20,52 Q 60,62 82,48"
                  fill="none"
                  stroke="#bae6fd"
                  strokeWidth="3"
                  strokeLinecap="round"
                  opacity="0.45"
                />
                <ellipse cx="50" cy="18" rx="22" ry="7" fill="#ffffff" opacity="0.6" />
                <ellipse cx="50" cy="85" rx="26" ry="6" fill="#ffffff" opacity="0.4" />
              </>
            )}

            {/* Quantum Exoplanet Lightning Arcs */}
            {chosenArchetype === "quantum" && (
              <>
                <path
                  d="M 18,45 Q 45,30 78,42 Q 60,65 35,58 Z"
                  fill="#c084fc"
                  opacity="0.4"
                />
                <path
                  d="M 32,25 L 42,45 L 36,52 L 58,78"
                  fill="none"
                  stroke="#f0abfc"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  opacity="0.85"
                />
                <circle cx="42" cy="45" r="4" fill="#fae8ff" opacity="0.9" />
              </>
            )}

            {/* Solar Technosphere Magnetic Shield Lines */}
            {chosenArchetype === "solar" && (
              <>
                <ellipse cx="50" cy="50" rx="35" ry="14" fill="none" stroke="#fef08a" strokeWidth="1.5" opacity="0.4" />
                <ellipse cx="50" cy="50" rx="14" ry="35" fill="none" stroke="#fef08a" strokeWidth="1.5" opacity="0.3" />
                <circle cx="50" cy="50" r="18" fill="#fef9c3" opacity="0.35" />
              </>
            )}

            {/* Universal 3D Specular Limb Shading */}
            <circle cx="50" cy="50" r="46" fill={`url(#specular_${uid})`} />
          </g>

          {/* Front half of the Saturnian ring (in front of the planet) */}
          {chosenArchetype === "ringed_gas" && (
            <g transform="rotate(-24 50 50)">
              <path
                d="M 118,50 A 68,18 0 0,1 -18,50"
                fill="none"
                stroke={`url(#ring_${uid})`}
                strokeWidth="10"
                opacity="0.95"
              />
              {/* Ring Cassini Gap Shadow Line */}
              <path
                d="M 116,50 A 66,17.5 0 0,1 -16,50"
                fill="none"
                stroke="rgba(0,0,0,0.45)"
                strokeWidth="1.2"
              />
            </g>
          )}

          {/* Specular Rim Light Reflection */}
          <path
            d="M 16,32 A 44,44 0 0,1 55,8"
            fill="none"
            stroke="rgba(255,255,255,0.65)"
            strokeWidth="3.5"
            strokeLinecap="round"
            filter="blur(0.5px)"
          />
        </svg>

        {/* ── 4. Status Medallions & Overlays ── */}

        {/* COMPLETED WORLD: Emerald Orbital Shield Ring + Golden Checkmark */}
        {isDone && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {/* Emerald Orbital Shield */}
            <div className="absolute -inset-1 rounded-full border-2 border-emerald-400 bg-emerald-500/20 shadow-[0_0_16px_rgba(16,185,129,0.5)] backdrop-blur-[0.5px]" />
            <div className="relative z-10 grid size-8 place-items-center rounded-full bg-emerald-500 text-white shadow-lg border-2 border-slate-950">
              <Check className="size-5 stroke-[3.5]" />
            </div>
            {/* Explorer Crown Badge */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-md bg-amber-400 border border-amber-300 px-1.5 py-0.2 text-[9px] font-black uppercase tracking-wider text-slate-950 shadow-md">
              👑 Done
            </div>
          </div>
        )}

        {/* ACTIVE / CURRENT WORLD: Orbiting Drone + START Badge */}
        {isCurrent && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {/* Active Orbiting Satellite Probe */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "linear" }}
              className="absolute size-[128%] rounded-full pointer-events-none"
            >
              <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 size-3.5 rounded-full bg-cyan-400 border-2 border-white shadow-[0_0_10px_#06b6d4] flex items-center justify-center">
                <div className="size-1 rounded-full bg-white" />
              </div>
            </motion.div>
          </div>
        )}

        {/* LOCKED WORLD: Orbital Defense Grid & Lock Rune */}
        {isLocked && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="grid size-7 place-items-center rounded-full bg-slate-900/90 border border-slate-700/80 text-slate-400 shadow-inner">
              <Lock className="size-3.5" />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
