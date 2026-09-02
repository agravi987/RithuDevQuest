"use client";

import Link from "next/link";
import {
  Rocket,
  ChevronRight,
  ArrowRight,
  Star,
  Terminal,
  Zap,
  Trophy,
  Code2,
  Brain,
  Cloud,
  Bot,
  Globe,
  Building2,
  Sparkles,
  BookOpen,
  Target,
  TrendingUp,
  Shield,
  Cpu,
  CheckCircle2,
  Quote,
} from "lucide-react";
import { motion } from "motion/react";

import { StarsCanvas } from "@/components/ui/stars-canvas";
import { CosmicBackground } from "@/components/ui/cosmic-background";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { Reveal } from "@/components/ui/reveal";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { PlanetVisual } from "@/components/galaxy/planet-visual";
import { GALAXY } from "@/lib/galaxy-assets";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden" style={{ maxWidth: "100vw" }}>
      {/* ═══════════ NAVBAR ═══════════ */}
      <nav className="relative z-30 w-full border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group" aria-label="RithuDevQuest Home">
            <div className="grid size-8 place-items-center rounded-xl bg-gradient-to-br from-primary via-emerald-400 to-cyan-400 text-primary-foreground shadow-lg shadow-primary/30 transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-primary/40">
              <span className="text-sm font-black">R</span>
            </div>
            <span className="text-lg font-black tracking-tight text-white">
              RithuDevQuest
            </span>
          </Link>

          {/* Nav Links */}
          <div className="hidden items-center gap-6 md:flex">
            <a href="#careers" className="text-sm font-medium text-white/70 transition-colors hover:text-white">Paths</a>
            <a href="#features" className="text-sm font-medium text-white/70 transition-colors hover:text-white">Features</a>
            <a href="#how-it-works" className="text-sm font-medium text-white/70 transition-colors hover:text-white">How It Works</a>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-xl px-4 py-2 text-sm font-bold text-white/80 transition-colors hover:text-white"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="rounded-xl bg-gradient-to-r from-primary to-emerald-400 px-5 py-2 text-sm font-black text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/40 hover:brightness-110"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ═══════════ HERO ═══════════ */}
      <div className="relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden px-4 py-20 sm:py-28 text-center">
        <CosmicBackground variant="deep" className="z-0" />
        <StarsCanvas density={150} shootingStars nebula speed={0.2} className="z-0" />

        {/* Radial glow behind logo */}
        <div className="pointer-events-none absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 size-[600px] rounded-full bg-primary/8 blur-[150px] z-0" />

        {/* Content (must be z-10 to sit above absolute backgrounds) */}
        <div className="relative z-10 flex flex-col items-center text-white">

          {/* Logo */}
          <Reveal delay={0}>
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
              className="relative mb-8"
            >
              <div className="grid size-24 place-items-center rounded-3xl bg-gradient-to-br from-primary to-emerald-400 text-primary-foreground shadow-2xl shadow-primary/30">
                <span className="text-5xl font-black">R</span>
              </div>
              {/* Orbiting star */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute -right-2 -top-2"
              >
                <Star className="size-6 text-amber-400 fill-amber-400" />
              </motion.div>
            </motion.div>
          </Reveal>

          {/* Title */}
          <Reveal delay={0.15}>
            <h1 className="mb-5 max-w-4xl text-5xl sm:text-7xl font-black leading-[1.05] tracking-tight lg:text-9xl">
              <span className="text-white">Rithu</span>
              <span className="bg-gradient-to-r from-primary via-emerald-400 to-xp bg-clip-text text-transparent">
                Dev
              </span>
              <span className="text-white">Quest</span>
            </h1>
          </Reveal>

          {/* Subtitle */}
          <Reveal delay={0.25}>
            <p className="mb-12 max-w-xl text-lg sm:text-xl text-white/70 leading-relaxed">
              Level up your DevOps, Cloud &amp; AI skills through interactive quests.
              Earn XP, build streaks, unlock achievements.
            </p>
          </Reveal>

          {/* CTA Buttons */}
          <Reveal delay={0.4}>
            <div className="flex flex-col gap-4 sm:flex-row">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Link
                  href="/signup"
                  className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-emerald-400 px-10 py-4 text-lg font-black text-primary-foreground shadow-xl shadow-primary/25 transition-all hover:shadow-2xl hover:shadow-primary/40 hover:brightness-110 btn-glow"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-primary opacity-0 transition-opacity group-hover:opacity-100" />
                  <Rocket className="relative size-5 transition-transform group-hover:-rotate-12 group-hover:scale-110" />
                  <span className="relative">Launch Your Quest</span>
                  <ArrowRight className="relative size-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 rounded-2xl border-2 border-white/20 bg-white/10 px-10 py-4 text-lg font-bold text-white backdrop-blur-sm transition-all hover:border-white/40 hover:bg-white/20 hover:shadow-lg"
                >
                  Sign In
                  <ChevronRight className="size-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>
            </div>
          </Reveal>

          {/* Animated ship */}
          <motion.div
            aria-hidden
            initial={{ x: "110vw", y: 0, opacity: 0 }}
            animate={{ x: "-110vw", y: [0, -15, 5, -10, 0], opacity: [0, 1, 1, 1, 0] }}
            transition={{
              x: { duration: 24, repeat: Infinity, ease: "linear", repeatDelay: 6 },
              y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
              opacity: { duration: 3, repeat: Infinity, times: [0, 0.12, 0.85, 1], repeatDelay: 6 },
            }}
            className="pointer-events-none absolute top-[30%] z-20"
          >
            <div className="text-4xl drop-shadow-[0_0_12px_rgba(251,191,36,0.5)]">🚀</div>
          </motion.div>

          {/* Stats */}
          <Reveal delay={0.6}>
            <div className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-4">
              {[
                { icon: <Terminal className="size-5" />, value: 167, suffix: "+", label: "Lessons", color: "text-primary" },
                { icon: <Zap className="size-5" />, value: 739, label: "Questions", color: "text-xp" },
                { icon: <Trophy className="size-5" />, value: 10, label: "Achievements", color: "text-achievement" },
                { icon: <Brain className="size-5" />, value: 19, label: "Skill Paths", color: "text-level" },
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  whileHover={{ scale: 1.08, y: -4 }}
                  className="flex flex-col items-center gap-2"
                >
                  <div className={`size-12 grid place-items-center rounded-2xl bg-white/10 backdrop-blur-sm ${stat.color}`}>
                    {stat.icon}
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-black tabular-nums text-white">
                      <AnimatedNumber value={stat.value} suffix={stat.suffix ?? ""} duration={1500} />
                    </p>
                    <p className="text-xs font-semibold text-white/60">{stat.label}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Reveal>

        </div>
      </div>

      {/* ═══════════ HOW IT WORKS ═══════════ */}
      <div id="how-it-works" className="relative overflow-hidden bg-gradient-to-b from-background via-muted/20 to-background px-4 py-20 sm:py-28">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <div className="mb-14 text-center">
              <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                🚀 Simple & Fun
              </span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
                How It Works
              </h2>
              <p className="mt-3 text-muted-foreground">
                Four steps to level up your skills.
              </p>
            </div>
          </Reveal>

          <div className="relative grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Connector line (desktop only) */}
            <div className="pointer-events-none absolute left-0 right-0 top-8 hidden h-0.5 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 lg:block" />

            {[
              { step: "01", icon: <Target className="size-6" />, title: "Pick a Path", desc: "Choose from 5 career paths: DevOps, Cloud, AI, Web Dev, or System Design." },
              { step: "02", icon: <BookOpen className="size-6" />, title: "Learn & Quest", desc: "Dive into interactive lessons with hands-on labs and real scenarios." },
              { step: "03", icon: <Zap className="size-6" />, title: "Earn Rewards", desc: "Score points, build daily streaks, and unlock achievement badges." },
              { step: "04", icon: <TrendingUp className="size-6" />, title: "Level Up", desc: "Track your progress, master skills, and climb the leaderboard." },
            ].map((item, i) => (
              <Reveal key={item.step} delay={i * 0.1}>
                <motion.div whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 300 }}>
                  <div className="relative rounded-3xl border-2 border-border/50 bg-card/70 p-6 text-center backdrop-blur-sm transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                    {/* Step number */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-xs font-black text-primary-foreground shadow-lg shadow-primary/20">
                      {item.step}
                    </div>
                    <div className="mx-auto mb-4 mt-3 grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary">
                      {item.icon}
                    </div>
                    <h3 className="mb-2 text-lg font-black text-foreground">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════ CAREERS ═══════════ */}
      <div id="careers" className="relative overflow-hidden bg-gradient-to-b from-background via-muted/30 to-background px-4 py-20 sm:py-28">
        <CosmicBackground variant="minimal" className="z-0" />
        <div className="relative z-10 mx-auto max-w-6xl">
          <Reveal>
            <div className="mb-14 text-center">
              <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                🌌 5 Worlds to Explore
              </span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
                Choose Your Career Path
              </h2>
              <p className="mt-3 text-muted-foreground">
                Pick a path and start your journey through the galaxy of knowledge.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { slug: "devops", icon: <Terminal className="size-6" />, planet: GALAXY.planets.devops, title: "DevOps", lessons: 60, desc: "CI/CD, Docker, Kubernetes & more" },
              { slug: "cloud", icon: <Cloud className="size-6" />, planet: GALAXY.planets.cloud, title: "Cloud Computing", lessons: 29, desc: "AWS, Azure, GCP infrastructure" },
              { slug: "ai-agents", icon: <Bot className="size-6" />, planet: GALAXY.planets["ai-agents"], title: "AI Agents", lessons: 26, desc: "LLMs, RAG, autonomous agents" },
              { slug: "web-dev", icon: <Globe className="size-6" />, planet: GALAXY.planets["web-dev"], title: "Web Development", lessons: 27, desc: "React, Node.js, full-stack apps" },
              { slug: "system-design", icon: <Building2 className="size-6" />, planet: GALAXY.planets["system-design"], title: "System Design", lessons: 25, desc: "Architecture, scaling, patterns" },
            ].map((career, i) => (
              <Reveal key={career.slug} delay={i * 0.08}>
                <motion.div whileHover={{ scale: 1.03, y: -6 }} transition={{ type: "spring", stiffness: 300 }}>
                  <Link href="/signup" className="group block">
                    <div className="relative overflow-hidden rounded-3xl border-2 border-border/50 bg-card/70 p-6 text-center transition-all hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10 backdrop-blur-sm">
                      {/* Planet */}
                      <div className="mb-4 flex justify-center">
                        <PlanetVisual
                          src={career.planet}
                          alt={career.title}
                          size={100}
                          orbit
                          orbitDouble
                          glow
                          float
                        />
                      </div>
                      <h3 className="mb-1 text-lg font-black text-foreground">{career.title}</h3>
                      <p className="mb-2 text-xs text-muted-foreground">{career.desc}</p>
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold text-primary">
                        {career.lessons} lessons
                      </span>
                      {/* Hover glow */}
                      <div className="absolute -right-8 -top-8 size-24 rounded-full bg-primary/5 blur-2xl opacity-0 transition-opacity group-hover:opacity-100" />
                    </div>
                  </Link>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════ GAMIFICATION ═══════════ */}
      <div className="relative overflow-hidden bg-gradient-to-b from-background via-background to-background px-4 py-20 sm:py-28">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <div className="mb-14 text-center">
              <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-xp/10 px-3 py-1 text-xs font-bold text-xp">
                🎮 Game Mechanics
              </span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
                Learn Like a Game
              </h2>
              <p className="mt-3 text-muted-foreground">
                Every lesson is a quest, every correct answer earns rewards.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {/* XP Card */}
            <Reveal delay={0}>
              <motion.div whileHover={{ scale: 1.04, y: -6 }} transition={{ type: "spring", stiffness: 300 }}>
                <div className="rounded-3xl border-2 border-amber-400/20 bg-card p-8 text-center transition-all hover:border-amber-400/40 hover:shadow-lg hover:shadow-amber-400/10">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="mx-auto mb-4 grid size-16 place-items-center rounded-2xl bg-amber-400/10 text-3xl"
                  >
                    ⚡
                  </motion.div>
                  <h3 className="text-xl font-black text-foreground">Earn XP</h3>
                  <p className="mt-1 text-sm text-muted-foreground">+20 XP per lesson completed</p>
                </div>
              </motion.div>
            </Reveal>

            {/* Streak Card */}
            <Reveal delay={0.1}>
              <motion.div whileHover={{ scale: 1.04, y: -6 }} transition={{ type: "spring", stiffness: 300 }}>
                <div className="rounded-3xl border-2 border-orange-400/20 bg-card p-8 text-center transition-all hover:border-orange-400/40 hover:shadow-lg hover:shadow-orange-400/10">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="mx-auto mb-4 grid size-16 place-items-center rounded-2xl bg-orange-400/10 text-3xl"
                  >
                    🔥
                  </motion.div>
                  <h3 className="text-xl font-black text-foreground">Build Streaks</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Daily streaks keep you motivated</p>
                </div>
              </motion.div>
            </Reveal>

            {/* Achievement Card */}
            <Reveal delay={0.2}>
              <motion.div whileHover={{ scale: 1.04, y: -6 }} transition={{ type: "spring", stiffness: 300 }}>
                <div className="rounded-3xl border-2 border-purple-400/20 bg-card p-8 text-center transition-all hover:border-purple-400/40 hover:shadow-lg hover:shadow-purple-400/10">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="mx-auto mb-4 grid size-16 place-items-center rounded-2xl bg-purple-400/10 text-3xl"
                  >
                    🏆
                  </motion.div>
                  <h3 className="text-xl font-black text-foreground">Unlock Badges</h3>
                  <p className="mt-1 text-sm text-muted-foreground">10 achievements to collect</p>
                </div>
              </motion.div>
            </Reveal>
          </div>
        </div>
      </div>

      {/* ═══════════ FEATURES ═══════════ */}
      <div id="features" className="relative overflow-hidden bg-gradient-to-b from-background via-muted/20 to-background px-4 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="mb-14 text-center">
              <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-level/10 px-3 py-1 text-xs font-bold text-level">
                ✨ Why RithuDevQuest
              </span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
                Built for Real Learning
              </h2>
              <p className="mt-3 text-muted-foreground">
                Not just another course platform — a complete learning experience.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: <Cpu className="size-5" />, title: "AI-Powered Mentor", desc: "Get instant help from Rithu, your AI guide, whenever you're stuck.", color: "text-primary" },
              { icon: <Target className="size-5" />, title: "Interactive Quizzes", desc: "739+ questions with instant feedback to test your understanding.", color: "text-xp" },
              { icon: <TrendingUp className="size-5" />, title: "Progress Tracking", desc: "Visual dashboards show your growth across every skill path.", color: "text-level" },
              { icon: <Shield className="size-5" />, title: "Hands-On Labs", desc: "Real-world scenarios, not just theory — build actual skills.", color: "text-achievement" },
              { icon: <Trophy className="size-5" />, title: "Leaderboards", desc: "Compete with other learners and climb the rankings.", color: "text-amber-500" },
              { icon: <CheckCircle2 className="size-5" />, title: "Spaced Repetition", desc: "Smart review system that helps you retain what you learn.", color: "text-emerald-500" },
            ].map((feature, i) => (
              <Reveal key={feature.title} delay={i * 0.06}>
                <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300 }}>
                  <div className="flex items-start gap-4 rounded-2xl border border-border/40 bg-card/50 p-5 transition-all hover:border-primary/20 hover:shadow-md hover:shadow-primary/5 backdrop-blur-sm">
                    <div className={`grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 ${feature.color}`}>
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="mb-1 text-sm font-black text-foreground">{feature.title}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">{feature.desc}</p>
                    </div>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════ SOCIAL PROOF ═══════════ */}
      <div className="relative overflow-hidden bg-gradient-to-b from-background via-background to-background px-4 py-20 sm:py-28">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <div className="mb-14 text-center">
              <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1 text-xs font-bold text-success">
                💬 Learner Voices
              </span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
                Loved by Developers
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { name: "Alex K.", role: "DevOps Engineer", text: "The gamification keeps me coming back daily. I've learned more Docker in 2 weeks than in months of YouTube tutorials." },
              { name: "Priya S.", role: "Cloud Architect", text: "Rithu is like having a senior engineer mentor you 24/7. The AI explanations are spot-on and the labs are real." },
              { name: "Marcus J.", role: "Full-Stack Dev", text: "The streak system is addictive! I'm on a 30-day streak and my Kubernetes skills have leveled up dramatically." },
            ].map((testimonial, i) => (
              <Reveal key={testimonial.name} delay={i * 0.1}>
                <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300 }}>
                  <div className="relative rounded-3xl border border-border/40 bg-card/60 p-6 backdrop-blur-sm transition-all hover:border-primary/20 hover:shadow-md hover:shadow-primary/5">
                    <Quote className="mb-3 size-6 text-primary/30" />
                    <p className="mb-4 text-sm text-foreground/80 leading-relaxed">
                      &ldquo;{testimonial.text}&rdquo;
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-primary to-emerald-400 text-xs font-black text-primary-foreground">
                        {testimonial.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">{testimonial.name}</p>
                        <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>

          {/* Trust badges */}
          <Reveal delay={0.3}>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-muted-foreground/60">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-success" />
                <span>100% Free</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-success" />
                <span>No Credit Card</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-success" />
                <span>167+ Lessons</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-success" />
                <span>AI-Powered</span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* ═══════════ CTA ═══════════ */}
      <div className="relative overflow-hidden px-4 py-20 sm:py-28">
        <CosmicBackground variant="deep" className="z-0" />
        <StarsCanvas density={80} shootingStars={false} speed={0.1} nebula={false} className="z-0" />
        <div className="relative z-10 mx-auto max-w-2xl text-center text-white">
          <Reveal>
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="mb-6 text-6xl"
            >
              🚀
            </motion.div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
              Ready to Launch?
            </h2>
            <p className="mt-4 text-lg text-white/70">
              Join the quest. No credit card needed.
            </p>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} className="inline-block mt-8">
              <Link
                href="/signup"
                className="group inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-primary to-emerald-400 px-10 py-4 text-lg font-black text-primary-foreground shadow-xl shadow-primary/25 transition-all hover:shadow-2xl hover:shadow-primary/40 hover:brightness-110 btn-glow"
              >
                <Sparkles className="size-5 transition-transform group-hover:rotate-12 group-hover:scale-110" />
                Begin Your Adventure
                <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </Reveal>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative border-t border-border/40 bg-card/50 backdrop-blur-sm py-10 text-center text-sm text-muted-foreground">
        <div className="mx-auto max-w-4xl px-4">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="grid size-6 place-items-center rounded-lg bg-gradient-to-br from-primary to-emerald-400 text-primary-foreground shadow-lg shadow-primary/20">
              <span className="text-[10px] font-black">R</span>
            </div>
            <span className="font-bold text-foreground">RithuDevQuest</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span>Built with</span>
            <Code2 className="size-4 text-primary" />
            <span>Next.js, Prisma, Groq AI &amp;</span>
            <span className="inline-block animate-wave">❤️</span>
          </div>
          <p className="mt-3 text-xs text-muted-foreground/60">
            &copy; {new Date().getFullYear()} RithuDevQuest. Learn. Code. Conquer.
          </p>
        </div>
      </footer>

      <ScrollToTop />
    </div>
  );
}
