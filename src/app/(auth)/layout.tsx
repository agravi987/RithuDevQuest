import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-8 bg-background px-4 py-10">
      <Link
        href="/"
        className="flex items-center gap-2 text-xl font-bold tracking-tight"
      >
        <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
          R
        </span>
        RithuDevQuest
      </Link>
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}