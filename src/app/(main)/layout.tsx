import { Header } from "@/components/shared/header";
import { MobileNav } from "@/components/shared/mobile-nav";
import { ClientShell } from "@/app/(main)/client-shell";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClientShell>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-primary-foreground focus:shadow-lg"
      >
        Skip to main content
      </a>
      <Header />
      <main
        id="main-content"
        className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 pb-24 md:pb-10 pt-2 md:pt-0"
      >
        {children}
      </main>
      <MobileNav />
    </ClientShell>
  );
}
