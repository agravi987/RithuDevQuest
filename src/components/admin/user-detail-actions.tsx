"use client";

import { useActionState } from "react";
import { Ban, Heart, ShieldCheck, UserCheck } from "lucide-react";

import type { UserDetail } from "@/lib/admin/users";
import {
  resetHeartsAction,
  setUserBanAction,
  setUserRoleAction,
  type UserActionResult,
} from "@/lib/admin/user-actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Props = {
  user: UserDetail;
};

export function UserDetailActions({ user }: Props) {
  const isAdmin = user.role === "admin";
  const isBanned = !!user.bannedAt;

  const [roleState, roleAction, rolePending] = useActionState<
    UserActionResult,
    FormData
  >(setUserRoleAction, {});

  const [banState, banAction, banPending] = useActionState<
    UserActionResult,
    FormData
  >(setUserBanAction, {});

  const [heartsState, heartsAction, heartsPending] = useActionState<
    UserActionResult,
    FormData
  >(resetHeartsAction, {});

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Admin Actions</CardTitle>
        <CardDescription>
          Manage this account&apos;s permissions and status.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap items-center gap-3">
        <form action={roleAction}>
          <input type="hidden" name="userId" value={user.id} />
          <input
            type="hidden"
            name="role"
            value={isAdmin ? "user" : "admin"}
          />
          <Button
            type="submit"
            variant={isAdmin ? "outline" : "default"}
            disabled={rolePending}
          >
            {rolePending ? (
              "Saving..."
            ) : isAdmin ? (
              <>
                <UserCheck className="size-4" /> Demote to User
              </>
            ) : (
              <>
                <ShieldCheck className="size-4" /> Promote to Admin
              </>
            )}
          </Button>
        </form>

        <form action={banAction}>
          <input type="hidden" name="userId" value={user.id} />
          <input type="hidden" name="bannedAt" value={isBanned ? "false" : "true"} />
          <Button
            type="submit"
            variant={isBanned ? "outline" : "destructive"}
            disabled={banPending}
            className={isBanned ? "text-emerald-600" : undefined}
          >
            {banPending ? (
              "Saving..."
            ) : isBanned ? (
              <>
                <UserCheck className="size-4" /> Unban
              </>
            ) : (
              <>
                <Ban className="size-4" /> Ban Account
              </>
            )}
          </Button>
        </form>

        <form action={heartsAction}>
          <input type="hidden" name="userId" value={user.id} />
          <Button
            type="submit"
            variant="outline"
            disabled={heartsPending}
          >
            {heartsPending ? "Resetting..." : (
              <>
                <Heart className="size-4" /> Reset Hearts
              </>
            )}
          </Button>
        </form>

        {(roleState.error || banState.error || heartsState.error) && (
          <p className="w-full text-sm text-destructive">
            {roleState.error ?? banState.error ?? heartsState.error}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
