import Link from "next/link";
import { StarsCanvas } from "@/components/ui/stars-canvas";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center gap-10 overflow-hidden bg-gradient-to-b from-sky-50 via-indigo-50/60 to-background px-4 py-12 dark:bg-background">
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
            Rithu<span className="text-primary">Dev</span>Quest
          </span>
        </Link>
        <p className="-mt-2 text-center text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
          Learn · Level Up · Master
        </p>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-sm">
        <div className="rounded-3xl border border-white/20 dark:border-white/5 bg-white/60 dark:bg-card/60 backdrop-blur-xl p-6 sm:p-8 shadow-xl shadow-black/5">
          {children}
        </div>
      </div>
    </div>
  );
}
