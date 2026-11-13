import Link from "next/link";
import { StarsCanvas } from "@/components/ui/stars-canvas";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center gap-10 overflow-hidden bg-background px-4 py-12">
      {/* Deep-space gradient backdrop */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_120%_65%_at_50%_-10%,oklch(0.20_0.04_255_/_0.55),transparent_60%),radial-gradient(ellipse_90%_50%_at_85%_110%,oklch(0.17_0.03_142_/_0.22),transparent_55%)]" />
      {/* Stars backdrop */}
      <StarsCanvas
        density={80}
        shootingStars={true}
        nebula={false}
        speed={0.15}
        className="opacity-40 dark:opacity-60"
      />

      {/* Nebula glows */}
      <div className="pointer-events-none absolute left-1/4 top-1/4 size-96 rounded-full bg-emerald-500/10 blur-[130px]" />
      <div className="pointer-events-none absolute bottom-1/4 right-1/4 size-80 rounded-full bg-purple-500/10 blur-[120px]" />

      {/* Brand header */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        <Link
          href="/"
          className="group flex items-center gap-3"
          aria-label="RithuDevQuest Home"
        >
          <div className="relative grid size-11 place-items-center rounded-2xl bg-gradient-to-br from-primary to-emerald-400 text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-primary/40">
            <span className="text-lg font-black">R</span>
            <span
              className="absolute -right-1 -top-1 animate-orbit text-xs"
              aria-hidden="true"
            >
              ✨
            </span>
          </div>
          <span className="text-2xl font-black tracking-tight text-foreground">
            Rithu<span className="bg-gradient-to-r from-primary via-emerald-400 to-achievement bg-clip-text text-transparent">Dev</span>Quest
          </span>
        </Link>
        <p className="-mt-2 text-center text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
          Learn · Level Up · Master
        </p>
      </div>

      {/* Content Container (Spacious, non-nested) */}
      <div className="relative z-10 w-full max-w-md sm:max-w-xl">
        {children}

        {/* Social proof & perks */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
          {[
            { label: "171+ Cosmic Lessons", emoji: "📚" },
            { label: "900+ Interactive Quizzes", emoji: "⚡" },
            { label: "AI Galactic Mentor", emoji: "🤖" },
            { label: "Free Space Cadet Access", emoji: "🚀" },
          ].map((item) => (
            <span
              key={item.label}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-[#0c1228]/80 px-3.5 py-1.5 text-xs font-bold text-slate-300 backdrop-blur-sm transition-colors hover:border-emerald-500/40 hover:text-white shadow-sm"
            >
              <span aria-hidden="true">{item.emoji}</span>
              {item.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
