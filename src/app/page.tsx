"use client";

import Link from "next/link";
import {
  Rocket,
  Flame,
  Heart,
  Award,
  BookOpen,
  ArrowRight,
  Code2,
  Sparkles,
  Terminal,
  Cpu,
  Cloud,
  CheckCircle2,
} from "lucide-react";
import { motion } from "motion/react";

import { StarsCanvas } from "@/components/ui/stars-canvas";
import { CosmicBackground } from "@/components/ui/cosmic-background";
import { CosmicCharacter } from "@/components/quiz/characters/CosmicCharacter";
import { DuoButton } from "@/components/quiz/duo-button";
import type { CharacterId } from "@/components/quiz/types";

const CREW_SHOWCASE: Array<{
  id: CharacterId;
  name: string;
  role: string;
  quote: string;
  badgeColor: string;
}> = [
  {
    id: "rithu",
    name: "Commander Rithu",
    role: "Lead Mission Guide",
    quote: "Ready for launch? One lesson a day keeps your coding streak alive!",
    badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  },
  {
    id: "astra",
    name: "Astra",
    role: "Cyber-Engineer",
    quote: "Clean syntax and modular components make robust space systems.",
    badgeColor: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  },
  {
    id: "orion",
    name: "Dr. Orion",
    role: "Quantum Scientist",
    quote: "Every algorithmic problem has an elegant solution waiting to be discovered.",
    badgeColor: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  },
  {
    id: "nova",
    name: "Cadet Nova",
    role: "Starship Pilot",
    quote: "Let's speedrun this module! Fast feedback is the best teacher.",
    badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  },
  {
    id: "vance",
    name: "Captain Vance",
    role: "EVA Veteran",
    quote: "Slow is smooth, smooth is fast. Master the foundations first.",
    badgeColor: "bg-rose-500/20 text-rose-400 border-rose-500/30",
  },
  {
    id: "cosmo",
    name: "Cosmo",
    role: "Recon Bot",
    quote: "Beep boop! 0 bugs detected in your code attempt!",
    badgeColor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  },
];

const CAREER_TRACKS = [
  {
    slug: "frontend-developer",
    title: "Frontend Explorer",
    icon: Code2,
    desc: "React, Next.js, TypeScript & modern web architecture.",
    color: "from-emerald-400 to-teal-500",
  },
  {
    slug: "backend-engineer",
    title: "Backend Engineer",
    icon: Terminal,
    desc: "Node.js, PostgreSQL, REST APIs & Distributed Systems.",
    color: "from-blue-400 to-indigo-500",
  },
  {
    slug: "ai-engineer",
    title: "AI Engineer",
    icon: Cpu,
    desc: "Python, LLM Agents, PyTorch & Prompt Engineering.",
    color: "from-purple-400 to-pink-500",
  },
  {
    slug: "devops-engineer",
    title: "DevOps & Cloud",
    icon: Cloud,
    desc: "Docker, Kubernetes, CI/CD pipelines & AWS.",
    color: "from-amber-400 to-orange-500",
  },
];

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-[#070b14] text-white">
      <CosmicBackground variant="deep" className="z-0" />
      <StarsCanvas density={70} shootingStars speed={0.15} className="z-0" />

      {/* ═══════════ TOP NAVIGATION ═══════════ */}
      <nav className="relative z-30 w-full border-b-2 border-white/10 bg-[#070b14]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4 sm:px-6">
          {/* Logo with Mascot */}
          <Link href="/" className="flex items-center gap-2.5 group" aria-label="RithuDevQuest Home">
            <div className="relative size-9 shrink-0 flex items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-0.5 transition-transform duration-300 group-hover:scale-110">
              <CosmicCharacter characterId="rithu" mood="idle" size="xs" className="size-full" />
            </div>
            <span className="text-lg font-black tracking-tight text-white uppercase">
              Rithu<span className="text-emerald-400">Quest</span>
            </span>
          </Link>

          {/* Right Header: Site Theme & Auth */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-black uppercase tracking-wider text-slate-300">
              <span>🚀</span>
              <span>Galaxy Edition</span>
            </div>

            <Link href="/login">
              <DuoButton variant="ghost" size="sm" className="font-black uppercase tracking-wider text-xs">
                Log In
              </DuoButton>
            </Link>

            <Link href="/signup">
              <DuoButton variant="primary" size="sm" className="font-black uppercase tracking-wider text-xs">
                Get Started
              </DuoButton>
            </Link>
          </div>
        </div>
      </nav>

      {/* ═══════════ DUOLINGO HERO STAGE ═══════════ */}
      <header className="relative z-10 mx-auto flex min-h-[70vh] w-full max-w-5xl flex-col items-center justify-center px-4 py-10 sm:py-16 md:flex-row md:gap-10 lg:gap-14">
        {/* Left: Animated Mascot with Speech Bubble */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 18 }}
          className="relative flex flex-col items-center shrink-0 mb-6 md:mb-0"
        >
          {/* Speech Bubble */}
          <div className="duo-card-3d relative mb-3 rounded-2xl border-2 border-emerald-500/40 bg-[#0d1527] px-4 py-2.5 shadow-xl max-w-[260px] text-center">
            <p className="text-xs sm:text-sm font-black text-emerald-400">
              Ready for takeoff? Let&apos;s master code together! 🚀
            </p>
            {/* Pointer arrow */}
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 size-3 rotate-45 border-b-2 border-r-2 border-emerald-500/40 bg-[#0d1527]" />
          </div>

          {/* Commander Rithu Rig - Proportionally Sized */}
          <div className="relative size-40 sm:size-48 animate-float flex items-center justify-center">
            <CosmicCharacter characterId="rithu" mood="happy_jump" size="custom" className="size-full" />
          </div>
        </motion.div>

        {/* Right: Duolingo Bold Pitch & Massive 3D Buttons */}
        <div className="flex max-w-xl flex-col items-center text-center md:items-start md:text-left">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
            The free, fun, and effective way to learn code!
          </h1>
          <p className="mt-4 text-base sm:text-lg font-medium text-slate-300 leading-relaxed">
            Gamified coding lessons designed like Duolingo. Earn XP, maintain streaks, solve interactive challenges, and journey through cosmic tech careers with your starship crew.
          </p>

          {/* Duolingo Signature Action Stack */}
          <div className="mt-8 flex w-full flex-col gap-3.5 sm:max-w-md">
            <Link href="/signup" className="w-full">
              <DuoButton variant="primary" size="lg" className="w-full text-base font-black tracking-wider uppercase py-4">
                Get Started
                <Sparkles className="size-5 ml-2" />
              </DuoButton>
            </Link>

            <Link href="/login" className="w-full">
              <DuoButton variant="neutral" size="lg" className="w-full text-base font-black tracking-wider uppercase py-4">
                I Already Have An Account
              </DuoButton>
            </Link>
          </div>

          {/* Social Proof Badges */}
          <div className="mt-8 flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-bold text-slate-400">
            <div className="flex items-center gap-1.5">
              <Flame className="size-4 text-amber-400" />
              <span>Streak Engine</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Heart className="size-4 text-rose-400" />
              <span>Cosmic Hearts</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Award className="size-4 text-emerald-400" />
              <span>Real Portfolio Mastery</span>
            </div>
          </div>
        </div>
      </header>

      {/* ═══════════ DUOLINGO 4 PILLARS (3D CARDS) ═══════════ */}
      <section className="relative z-10 border-t-2 border-white/10 bg-[#0a0f1d] py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-400">
              Why Learn With RithuQuest?
            </span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-black text-white">
              Built on proven gamification science
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Card 1 */}
            <div className="duo-card-3d rounded-3xl border-2 border-emerald-500/30 bg-[#0d1527] p-6 shadow-xl">
              <div className="grid size-12 place-items-center rounded-2xl bg-emerald-500/20 text-emerald-400 mb-4">
                <Rocket className="size-6" />
              </div>
              <h3 className="text-lg font-black text-white">Bite-Sized & Addictive</h3>
              <p className="mt-2 text-sm text-slate-300 leading-relaxed font-medium">
                Short 5-minute interactive quizzes with sound effects, combo multipliers, and instant satisfaction.
              </p>
            </div>

            {/* Card 2 */}
            <div className="duo-card-3d rounded-3xl border-2 border-cyan-500/30 bg-[#0d1527] p-6 shadow-xl">
              <div className="grid size-12 place-items-center rounded-2xl bg-cyan-500/20 text-cyan-400 mb-4">
                <Sparkles className="size-6" />
              </div>
              <h3 className="text-lg font-black text-white">Cosmic Crew Mentors</h3>
              <p className="mt-2 text-sm text-slate-300 leading-relaxed font-medium">
                6 unique vector characters with distinct voice blips cheer you on, explain hints, and celebrate wins.
              </p>
            </div>

            {/* Card 3 */}
            <div className="duo-card-3d rounded-3xl border-2 border-purple-500/30 bg-[#0d1527] p-6 shadow-xl">
              <div className="grid size-12 place-items-center rounded-2xl bg-purple-500/20 text-purple-400 mb-4">
                <BookOpen className="size-6" />
              </div>
              <h3 className="text-lg font-black text-white">Spaced Mistake Queue</h3>
              <p className="mt-2 text-sm text-slate-300 leading-relaxed font-medium">
                Duolingo&apos;s secret sauce: missed questions are recycled back into the session until you achieve 100% mastery.
              </p>
            </div>

            {/* Card 4 */}
            <div className="duo-card-3d rounded-3xl border-2 border-amber-500/30 bg-[#0d1527] p-6 shadow-xl">
              <div className="grid size-12 place-items-center rounded-2xl bg-amber-500/20 text-amber-400 mb-4">
                <Award className="size-6" />
              </div>
              <h3 className="text-lg font-black text-white">Real Career Ready</h3>
              <p className="mt-2 text-sm text-slate-300 leading-relaxed font-medium">
                Progress through verified skill paths from basic syntax all the way to production system architecture.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ STARSHIP CREW SHOWCASE ═══════════ */}
      <section className="relative z-10 border-t-2 border-white/10 bg-[#070b14] py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-black uppercase tracking-widest text-cyan-400">
              Meet Your Mentors
            </span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-black text-white">
              The RithuQuest Starship Crew
            </h2>
            <p className="mt-2 text-sm text-slate-400 max-w-lg mx-auto">
              Just like Duolingo&apos;s beloved cast, our cosmic characters guide you through every coding mission.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {CREW_SHOWCASE.map((crew) => (
              <div
                key={crew.id}
                className="duo-card-3d flex items-center gap-4 rounded-3xl border-2 border-white/10 bg-[#0d1527] p-5 shadow-lg"
              >
                <div className="size-20 shrink-0">
                  <CosmicCharacter characterId={crew.id} mood="happy_jump" className="size-full" />
                </div>
                <div>
                  <span className={`inline-block rounded-lg border px-2 py-0.5 text-[10px] font-black uppercase ${crew.badgeColor}`}>
                    {crew.role}
                  </span>
                  <h4 className="text-base font-black text-white mt-1">{crew.name}</h4>
                  <p className="text-xs text-slate-300 italic mt-1 leading-snug">
                    &ldquo;{crew.quote}&rdquo;
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ CAREER PATH SELECTION ═══════════ */}
      <section className="relative z-10 border-t-2 border-white/10 bg-[#0a0f1d] py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-400">
              Cosmic Career Planets
            </span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-black text-white">
              Choose your destination planet
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {CAREER_TRACKS.map((track) => {
              const Icon = track.icon;
              return (
                <Link
                  key={track.slug}
                  href={`/learn?career=${track.slug}`}
                  className="duo-card-3d group flex flex-col justify-between rounded-3xl border-2 border-white/10 bg-[#0d1527] p-6 shadow-xl hover:border-emerald-500/50 transition-all"
                >
                  <div>
                    <div className="grid size-12 place-items-center rounded-2xl bg-white/5 text-white mb-4 group-hover:scale-110 transition-transform">
                      <Icon className="size-6 text-emerald-400" />
                    </div>
                    <h3 className="text-lg font-black text-white group-hover:text-emerald-400 transition-colors">
                      {track.title}
                    </h3>
                    <p className="mt-2 text-xs text-slate-300 leading-relaxed font-medium">
                      {track.desc}
                    </p>
                  </div>
                  <div className="mt-6 flex items-center gap-1 text-xs font-black text-emerald-400 uppercase tracking-wider">
                    <span>Explore Path</span>
                    <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════ FINAL CALL TO ACTION ═══════════ */}
      <section className="relative z-10 border-t-2 border-white/10 bg-[#070b14] py-20 text-center">
        <div className="mx-auto max-w-2xl px-4">
          <div className="inline-flex size-20 items-center justify-center rounded-3xl bg-emerald-500/20 text-emerald-400 mb-6">
            <CheckCircle2 className="size-10" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            Start your coding journey now
          </h2>
          <p className="mt-4 text-base text-slate-300 font-medium">
            Join thousands of developers leveling up their careers with Duolingo-style bite-sized quests. Free forever.
          </p>
          <div className="mt-8 flex justify-center">
            <Link href="/signup">
              <DuoButton variant="primary" size="lg" className="min-w-[240px] text-base font-black uppercase tracking-wider py-4">
                Launch Mission Free
                <Rocket className="size-5 ml-2" />
              </DuoButton>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer className="relative z-10 border-t-2 border-white/10 bg-[#050810] py-8 text-center text-xs text-slate-500">
        <div className="mx-auto flex max-w-6xl flex-col sm:flex-row items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="font-black text-white uppercase tracking-wider">RithuDevQuest</span>
            <span>—</span>
            <span>The Galaxy Coding Quest</span>
          </div>
          <p>© {new Date().getFullYear()} RithuDevQuest. Built for learners worldwide.</p>
        </div>
      </footer>
    </div>
  );
}
