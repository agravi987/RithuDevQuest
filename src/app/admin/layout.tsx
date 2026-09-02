import type { Metadata } from "next";

import { requireAdmin } from "@/lib/admin/auth";

import { AdminSidebar } from "@/components/admin/admin-sidebar";

export const metadata: Metadata = {
  title: {
    default: "Admin",
    template: "%s | Admin",
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <AdminSidebar />
      <main className="flex-1 overflow-x-hidden px-4 py-6 md:px-8">
        <div className="mx-auto w-full max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
