"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

import type { AdminUserListItem } from "@/lib/admin/users";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Props = {
  users: AdminUserListItem[];
  total: number;
  page: number;
  pageSize: number;
  initialQuery?: string;
  initialRole?: string;
  initialStatus?: string;
};

export function UsersTable({
  users,
  total,
  page,
  pageSize,
  initialQuery,
  initialRole,
  initialStatus,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  function navigate(params: Record<string, string | undefined>) {
    const sp = new URLSearchParams();
    const merged = {
      query: initialQuery,
      role: initialRole,
      status: initialStatus,
      page: String(page),
      ...params,
    };
    for (const [k, v] of Object.entries(merged)) {
      if (v && v !== "all") sp.set(k, v);
    }
    startTransition(() => {
      router.push(`${pathname}?${sp.toString()}`);
    });
  }

  const roleFilter = initialRole ?? "all";
  const statusFilter = initialStatus ?? "all";

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filters</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 md:flex-row md:items-center">
          <form
            className="relative flex-1"
            onSubmit={(e) => {
              e.preventDefault();
              const q = new FormData(e.currentTarget).get("q") as string;
              navigate({ query: q || undefined, page: "1" });
            }}
          >
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              name="q"
              defaultValue={initialQuery}
              placeholder="Search by name or email..."
              aria-label="Search users by name or email"
              className="pl-8 pr-16"
            />
            <Button
              type="submit"
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2"
            >
              Search
            </Button>
          </form>

          <div className="flex flex-wrap gap-2">
            <select
              value={roleFilter}
              onChange={(e) => navigate({ role: e.target.value, page: "1" })}
              className="h-8 rounded-lg border border-input bg-transparent px-2 text-sm"
              aria-label="Filter by role"
            >
              <option value="all">All roles</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => navigate({ status: e.target.value, page: "1" })}
              className="h-8 rounded-lg border border-input bg-transparent px-2 text-sm"
              aria-label="Filter by status"
            >
              <option value="all">All statuses</option>
              <option value="active">Active</option>
              <option value="banned">Banned</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-0">
          {users.length === 0 ? (
            <div className="flex min-h-[160px] flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-6 text-center">
              <p className="text-sm text-muted-foreground">
                No users match the current filters.
              </p>
            </div>
          ) : (
            <div
              className={isPending ? "opacity-60 transition-opacity" : ""}
              aria-busy={isPending}
            >
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <caption className="sr-only">
                    Users matching the current search and filters
                  </caption>
                  <thead>
                    <tr className="border-b border-border/40 text-xs uppercase tracking-wide text-muted-foreground">
                      <th scope="col" className="px-3 py-2 font-semibold">User</th>
                      <th scope="col" className="px-3 py-2 font-semibold">Role</th>
                      <th scope="col" className="px-3 py-2 font-semibold">Status</th>
                      <th scope="col" className="px-3 py-2 font-semibold text-right">Level</th>
                      <th scope="col" className="px-3 py-2 font-semibold text-right">XP</th>
                      <th scope="col" className="px-3 py-2 font-semibold text-right">Streak</th>
                      <th scope="col" className="px-3 py-2 font-semibold text-right">Lessons</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr
                        key={u.id}
                        className="border-b border-border/20 last:border-0"
                      >
                        <td className="px-3 py-2.5">
                          <Link
                            href={`/admin/users/${u.id}`}
                            className="group flex items-center gap-2"
                          >
                            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                              {(u.name ?? u.email ?? "?")
                                .split(" ")
                                .map((p) => p[0])
                                .slice(0, 2)
                                .join("")
                                .toUpperCase()}
                            </span>
                            <div className="min-w-0">
                              <div className="truncate font-semibold group-hover:text-primary">
                                {u.name ?? "Unnamed"}
                              </div>
                              <div className="truncate text-xs text-muted-foreground">
                                {u.email ?? "—"}
                              </div>
                            </div>
                          </Link>
                        </td>
                        <td className="px-3 py-2.5">
                          <Badge
                            variant={u.role === "admin" ? "default" : "secondary"}
                          >
                            {u.role}
                          </Badge>
                        </td>
                        <td className="px-3 py-2.5">
                          {u.bannedAt ? (
                            <Badge variant="destructive">Banned</Badge>
                          ) : (
                            <Badge variant="outline">Active</Badge>
                          )}
                        </td>
                        <td className="px-3 py-2.5 text-right font-bold">
                          {u.level}
                        </td>
                        <td className="px-3 py-2.5 text-right">
                          {u.xp.toLocaleString()}
                        </td>
                        <td className="px-3 py-2.5 text-right">🔥 {u.streak}</td>
                        <td className="px-3 py-2.5 text-right">
                          {u.lessonsCompleted}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/40 px-3 py-3 text-sm">
                <span className="text-xs text-muted-foreground">
                  Page {page} of {totalPages} ({total} users)
                </span>
                <div className="flex gap-2" aria-label="Pagination">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    aria-label="Previous page"
                    disabled={page <= 1}
                    onClick={() =>
                      navigate({ page: String(Math.max(1, page - 1)) })
                    }
                  >
                    <ChevronLeft className="size-4" /> Prev
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    aria-label="Next page"
                    disabled={page >= totalPages}
                    onClick={() =>
                      navigate({
                        page: String(Math.min(totalPages, page + 1)),
                      })
                    }
                  >
                    Next <ChevronRight className="size-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
