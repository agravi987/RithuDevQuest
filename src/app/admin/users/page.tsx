import type { Metadata } from "next";

import { requireAdmin } from "@/lib/admin/auth";
import { listUsers } from "@/lib/admin/users";
import { UsersTable } from "@/components/admin/users-table";

export const metadata: Metadata = {
  title: "Users",
};

type Props = {
  searchParams: Promise<{
    query?: string;
    role?: string;
    status?: string;
    page?: string;
  }>;
};

export default async function AdminUsersPage({ searchParams }: Props) {
  await requireAdmin();
  const sp = await searchParams;

  const page = Math.max(1, Number(sp.page) || 1);
  const result = await listUsers({
    query: sp.query,
    role: sp.role,
    status: sp.status,
    page,
    pageSize: 25,
  });

  const totalPages = Math.max(1, Math.ceil(result.total / 25));
  const clampedPage = Math.min(page, totalPages);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight">Users</h1>
        <p className="text-sm text-muted-foreground">
          {result.total} user{result.total === 1 ? "" : "s"} — search, filter, and
          manage accounts.
        </p>
      </div>

      <UsersTable
        users={result.users}
        total={result.total}
        page={clampedPage}
        pageSize={25}
        initialQuery={sp.query}
        initialRole={sp.role}
        initialStatus={sp.status}
      />
    </div>
  );
}
