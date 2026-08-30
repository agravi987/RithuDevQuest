"use client";

import Link from "next/link";
import {
  Sparkles,
  Zap,
  Trophy,
  ArrowRight,
  Terminal,
  Flame,
  ChevronRight,
  Star,
  Rocket,
  Code2,
  Brain,
  Cloud,
  Bot,
  Globe,
  Building2,
} from "lucide-react";
import { motion } from "motion/react";

import { ParticleBackground } from "@/components/ui/particle-background";
import { FloatingElements } from "@/components/ui/floating-elements";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { Reveal } from "@/components/ui/reveal";
import { GlowCard } from "@/components/ui/glow-card";
import { PlanetVisual } from "@/components/galaxy/planet-visual";
import { SpaceshipPlayer } from "@/components/galaxy/spaceship-player";
import { GALAXY } from "@/lib/galaxy-assets";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col overflow-hidden">
      {/* ═══════════ HERO SECTION ═══════════ */}
      <div className="relative flex flex-1 flex-col items-center justify-center px-4 py-16 sm:py-24 text-center">
        {/* Particle background */}
        <ParticleBackground count={60} className="absolute inset-0" />

        {/* Floating decorative elements */}
        <FloatingElements />

        {/* Gradient orbs */}
        <div className="pointer-events-none absolute -left-32 -top-32 size-96 rounded-full bg-primary/10 blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-32 -right-32 size-96 rounded-full bg-achievement/10 blur-[100px]" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 size-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-xp/5 blur-[80px]" />

        {/* Logo with spring animation */}
        <Reveal delay={0}>
          <div className="mb-8 flex items-center gap-3">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 15,
                delay: 0.2,
              }}
              className="relative"
            >
              <div className="grid size-16 place-items-center rounded-2xl bg-gradient-to-br from-primary to-emerald-400 text-primary-foreground shadow-xl shadow-primary/30">
                <span className="text-3xl font-black">R</span>
              </div>
              {/* Orbiting sparkle */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute -right-1 -top-1"
              >
                <Sparkles className="size-4 text-amber-400 fill-amber-400" />
              </motion.div>
            </motion.div>
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="text-4xl font-black tracking-tight"
            >
              Rithu<span className="text-primary">Dev</span>Quest
            </motion.span>
          </div>
        </Reveal>

        {/* Main Heading */}
        <Reveal delay={0.15}>
          <h1 className="mb-6 max-w-4xl text-3xl sm:text-5xl font-black leading-[1.1] tracking-tight lg:text-7xl">
            Master Modern Tech
            <br />
            <span className="bg-gradient-to-r from-primary via-emerald-400 to-xp bg-clip-text text-transparent">
              Level Up Your Career
            </span>
          </h1>
        </Reveal>

        <Reveal delay={0.3}>
          <p className="mb-10 max-w-xl text-base sm:text-lg text-muted-foreground">
            Learn DevOps, Cloud, AI Agents, Web Dev &amp; System Design through
            interactive quests. Earn XP, build streaks, and unlock achievements
            with AI mentor Rithu.
          </p>
        </Reveal>

        {/* CTA Buttons */}
        <Reveal delay={0.45}>
          <div className="flex flex-col gap-4 sm:flex-row">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/signup"
                className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-emerald-400 px-7 sm:px-10 py-3 sm:py-4 text-base sm:text-lg font-black text-primary-foreground shadow-xl shadow-primary/25 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/40 hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] btn-glow"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <span className="relative">Start Learning Free</span>
                <Rocket className="relative size-5 transition-all duration-300 group-hover:translate-x-1 group-hover:-rotate-12 group-hover:scale-110" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-border bg-card/50 px-7 sm:px-10 py-3 sm:py-4 text-base sm:text-lg font-bold text-foreground backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:bg-card hover:shadow-lg hover:shadow-primary/5 hover:scale-[1.02] active:scale-[0.98]"
              >
                I Have an Account
                <ChevronRight className="size-5 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>
        </Reveal>

        {/* Flying ship across the hero */}
        <motion.div
          aria-hidden
          initial={{ x: "110vw", y: 0, opacity: 0 }}
          animate={{
            x: "-110vw",
            y: [0, -18, 6, -10, 0],
            opacity: [0, 1, 1, 1, 0],
          }}
          transition={{
            x: {
              duration: 26,
              repeat: Infinity,
              ease: "linear",
              repeatDelay: 8,
            },
            y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
            opacity: {
              duration: 4,
              repeat: Infinity,
              times: [0, 0.12, 0.85, 1],
              repeatDelay: 8,
            },
          }}
          className="pointer-events-none absolute top-1/4 z-20"
        >
          <SpaceshipPlayer size={46} direction="right" />
          <motion.div
            animate={{ opacity: [0.2, 0.7, 0.2] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="absolute left-full top-1/2 h-px w-40 -translate-y-1/2 bg-gradient-to-r from-amber-300/60 to-transparent"
          />
        </motion.div>

        {/* Animated Stats Row */}
        <Reveal delay={0.6}>
          <div className="mt-12 sm:mt-16 grid grid-cols-2 gap-4 sm:gap-6 sm:grid-cols-4">
            <AnimatedStat
              icon={<Terminal className="size-5" />}
              value={167}
              suffix="+"
              label="Lessons"
              color="primary"
            />
            <AnimatedStat
              icon={<Zap className="size-5" />}
              value={739}
              label="Questions"
              color="xp"
            />
            <AnimatedStat
              icon={<Trophy className="size-5" />}
              value={10}
              label="Achievements"
              color="achievement"
            />
            <AnimatedStat
              icon={<Brain className="size-5" />}
              value={19}
              label="Skill Paths"
              color="level"
            />
          </div>
        </Reveal>
      </div>

      {/* ═══════════ CAREER SHOWCASE SECTION ═══════════ */}
      <div className="relative bg-game-gradient px-4 py-14 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <h2 className="mb-4 text-center text-3xl font-black tracking-tight">
              Five Worlds to Explore
            </h2>
            <p className="mb-12 text-center text-sm sm:text-base text-muted-foreground">
              Each career is packed with interactive lessons and challenges —
              pick your path
            </p>
          </Reveal>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <Reveal delay={0.05}>
              <FeatureCard
                icon={<Terminal className="size-7" />}
                planetSrc={GALAXY.planets.devops}
                planetAlt="DevOps Command Planet"
                title="DevOps Engineering"
                description="Linux, Git, Docker & Kubernetes — automate and ship with confidence"
                color="primary"
                lessons={60}
                paths={4}
              />
            </Reveal>
            <Reveal delay={0.1}>
              <FeatureCard
                icon={<Cloud className="size-7" />}
                planetSrc={GALAXY.planets.cloud}
                planetAlt="Cloud Dominion"
                title="Cloud Computing"
                description="Networking, AWS & GCP — design and run infrastructure at scale"
                color="sky"
                lessons={29}
                paths={3}
              />
            </Reveal>
            <Reveal delay={0.15}>
              <FeatureCard
                icon={<Bot className="size-7" />}
                planetSrc={GALAXY.planets["ai-agents"]}
                planetAlt="AI Agents Sector"
                title="AI Agents"
                description="Fundamentals, prompt engineering, RAG & agent frameworks"
                color="fuchsia"
                lessons={26}
                paths={4}
              />
            </Reveal>
            <Reveal delay={0.2}>
              <FeatureCard
                icon={<Globe className="size-7" />}
                planetSrc={GALAXY.planets["web-dev"]}
                planetAlt="Web Development Star System"
                title="Web Development"
                description="HTML/CSS/JS to Node, React & Next.js — the full modern stack"
                color="amber"
                lessons={27}
                paths={4}
              />
            </Reveal>
            <Reveal delay={0.25}>
              <FeatureCard
                icon={<Building2 className="size-7" />}
                planetSrc={GALAXY.planets["system-design"]}
                planetAlt="System Design Architect"
                title="System Design"
                description="Foundations to scalability — architect reliable systems that scale"
                color="teal"
                lessons={25}
                paths={4}
              />
            </Reveal>
          </div>
        </div>
      </div>

      {/* ═══════════ GAMIFICATION SECTION ═══════════ */}
      <div className="px-4 py-14 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <h2 className="mb-4 text-center text-3xl font-black tracking-tight">
              Gamified Learning
            </h2>
            <p className="mb-12 text-center text-muted-foreground">
              Every answer earns rewards. Track your progress like a real game.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <Reveal delay={0.1}>
              <GamificationCard
                icon={<Zap className="size-6 sm:size-7" />}
                title="Earn XP"
                description={
                  <>
                    Get <span className="font-bold text-xp">+20 XP</span> for
                    every lesson, bonus for first-try answers
                  </>
                }
                color="xp"
              />
            </Reveal>
            <Reveal delay={0.2}>
              <GamificationCard
                icon={<Flame className="size-6 sm:size-7" />}
                title="Build Streaks"
                description={
                  <>
                    Learn every day to keep your{" "}
                    <span className="font-bold text-streak">🔥 streak</span>{" "}
                    alive
                  </>
                }
                color="streak"
              />
            </Reveal>
            <Reveal delay={0.3}>
              <GamificationCard
                icon={<Trophy className="size-6 sm:size-7" />}
                title="Unlock Badges"
                description={
                  <>
                    <span className="font-bold text-achievement">
                      10 achievements
                    </span>{" "}
                    to earn as you progress
                  </>
                }
                color="achievement"
              />
            </Reveal>
          </div>
        </div>
      </div>

      {/* ═══════════ CTA SECTION ═══════════ */}
      <div className="relative overflow-hidden bg-game-gradient px-4 py-14 sm:py-20">
        <FloatingElements
          elements={[
            {
              emoji: "🎯",
              x: "10%",
              y: "20%",
              size: "text-4xl",
              delay: 0,
              duration: 4,
            },
            {
              emoji: "⚡",
              x: "85%",
              y: "30%",
              size: "text-3xl",
              delay: 0.5,
              duration: 5,
            },
            {
              emoji: "🏆",
              x: "75%",
              y: "70%",
              size: "text-4xl",
              delay: 1,
              duration: 4.5,
            },
            {
              emoji: "🚀",
              x: "20%",
              y: "75%",
              size: "text-3xl",
              delay: 1.5,
              duration: 5.5,
            },
          ]}
        />

        <Reveal>
          <div className="relative mx-auto max-w-2xl text-center">
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight lg:text-5xl">
              Ready to Start Your Quest?
            </h2>
            <p className="mt-4 text-sm sm:text-lg text-muted-foreground">
              Join the learning adventure. No credit card required.
            </p>
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-block mt-8"
            >
              <Link
                href="/signup"
                className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-emerald-400 px-7 sm:px-10 py-3 sm:py-4 text-base sm:text-lg font-black text-primary-foreground shadow-xl shadow-primary/25 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/40 hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] btn-glow"
              >
                <Star className="size-5 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
                Begin Your Adventure
                <ArrowRight className="size-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>
        </Reveal>
      </div>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer className="border-t bg-card/50 py-8 text-center text-sm text-muted-foreground backdrop-blur-sm">
        <div className="flex items-center justify-center gap-2">
          <span>Built with</span>
          <Code2 className="size-4 text-primary" />
          <span>
            Next.js, Prisma, Groq AI &{" "}
            <span className="inline-block animate-wave">❤️</span>
          </span>
        </div>
      </footer>
    </div>
  );
}

// ═══════════ SUB COMPONENTS ═══════════

function AnimatedStat({
  icon,
  value,
  suffix = "",
  label,
  color,
}: {
  icon: React.ReactNode;
  value: number;
  suffix?: string;
  label: string;
  color: string;
}) {
  const colorMap: Record<string, string> = {
    primary: "bg-primary/10 text-primary",
    xp: "bg-xp/10 text-xp",
    achievement: "bg-achievement/10 text-achievement",
    level: "bg-level/10 text-level",
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -4 }}
      className="flex flex-col items-center gap-2"
    >
      <div
        className={`grid size-12 place-items-center rounded-2xl ${colorMap[color]}`}
      >
        {icon}
      </div>
      <div className="text-center">
        <p className="text-3xl font-black">
          <AnimatedNumber value={value} suffix={suffix} duration={1500} />
        </p>
        <p className="text-xs font-semibold text-muted-foreground">{label}</p>
      </div>
    </motion.div>
  );
}

function FeatureCard({
  icon,
  planetSrc,
  planetAlt,
  title,
  description,
  color,
  lessons,
  paths,
}: {
  icon: React.ReactNode;
  planetSrc?: string;
  planetAlt?: string;
  title: string;
  description: string;
  color: string;
  lessons: number;
  paths: number;
}) {
  const colorMap: Record<
    string,
    { bg: string; border: string; text: string; badge: string }
  > = {
    primary: {
      bg: "from-primary/10 to-primary/5",
      border: "border-primary/20 hover:border-primary/40",
      text: "text-primary",
      badge: "bg-primary/10 text-primary",
    },
    level: {
      bg: "from-level/10 to-level/5",
      border: "border-level/20 hover:border-level/40",
      text: "text-level",
      badge: "bg-level/10 text-level",
    },
    xp: {
      bg: "from-xp/10 to-xp/5",
      border: "border-xp/20 hover:border-xp/40",
      text: "text-xp",
      badge: "bg-xp/10 text-xp",
    },
    achievement: {
      bg: "from-achievement/10 to-achievement/5",
      border: "border-achievement/20 hover:border-achievement/40",
      text: "text-achievement",
      badge: "bg-achievement/10 text-achievement",
    },
    sky: {
      bg: "from-sky-500/10 to-sky-500/5",
      border: "border-sky-500/20 hover:border-sky-400/40",
      text: "text-sky-500",
      badge: "bg-sky-500/10 text-sky-500",
    },
    fuchsia: {
      bg: "from-fuchsia-500/10 to-fuchsia-500/5",
      border: "border-fuchsia-500/20 hover:border-fuchsia-400/40",
      text: "text-fuchsia-500",
      badge: "bg-fuchsia-500/10 text-fuchsia-500",
    },
    amber: {
      bg: "from-amber-500/10 to-amber-500/5",
      border: "border-amber-500/20 hover:border-amber-400/40",
      text: "text-amber-500",
      badge: "bg-amber-500/10 text-amber-500",
    },
    teal: {
      bg: "from-teal-500/10 to-teal-500/5",
      border: "border-teal-500/20 hover:border-teal-400/40",
      text: "text-teal-500",
      badge: "bg-teal-500/10 text-teal-500",
    },
  };
  const c = colorMap[color];

  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -4 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <GlowCard
        className={`bg-gradient-to-br ${c.bg} ${c.border} transition-all`}
      >
        <div className="p-5">
          <div className="mb-3 flex items-center justify-between">
            <div className={`${c.text}`}>{icon}</div>
            {planetSrc ? (
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold ${c.badge}`}
              >
                {paths} Paths
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold bg-muted/50 text-muted-foreground">
                {paths} Paths
              </span>
            )}
          </div>

          {/* Planet visual anchor */}
          {planetSrc && (
            <div className="mb-4 flex justify-center">
              <PlanetVisual
                src={planetSrc}
                alt={planetAlt ?? title}
                size={104}
                orbit
                orbitDouble
                glow
                float
              />
            </div>
          )}

          <h3 className="mb-1 text-base font-bold text-center">{title}</h3>
          <p className="mb-3 text-center text-xs leading-relaxed text-muted-foreground">
            {description}
          </p>
          <div className="flex items-center justify-center gap-1.5">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold ${c.badge}`}
            >
              {lessons} Lessons
            </span>
            {!planetSrc && (
              <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold bg-muted/50 text-muted-foreground">
                {paths} Paths
              </span>
            )}
          </div>
        </div>
      </GlowCard>
    </motion.div>
  );
}

function GamificationCard({
  icon,
  title,
  description,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
  color: string;
}) {
  const colorMap: Record<
    string,
    { border: string; iconBg: string; text: string }
  > = {
    xp: {
      border: "border-xp/20 hover:border-xp/40",
      iconBg: "bg-xp/10 text-xp",
      text: "text-xp",
    },
    streak: {
      border: "border-streak/20 hover:border-streak/40",
      iconBg: "bg-streak/10 text-streak",
      text: "text-streak",
    },
    achievement: {
      border: "border-achievement/20 hover:border-achievement/40",
      iconBg: "bg-achievement/10 text-achievement",
      text: "text-achievement",
    },
  };
  const c = colorMap[color] ?? colorMap.xp;

  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -4 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div
        className={`rounded-2xl border-2 bg-card p-6 text-center transition-all duration-300 ${c.border} card-lift-glow`}
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className={`mx-auto mb-3 grid size-14 place-items-center rounded-2xl ${c.iconBg} shadow-sm transition-shadow duration-300 hover:shadow-lg`}
        >
          {icon}
        </motion.div>
        <h3 className="text-lg font-black">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
    </motion.div>
  );
}
