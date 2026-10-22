"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useLogout } from "../hooks";

export function SignOutButton() {
  const logout = useLogout();
  const [confirming, setConfirming] = useState(false);

  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => setConfirming(true)}>
        Sign out
      </Button>
      <ConfirmDialog
        open={confirming}
        title="Sign out?"
        description="You will need to sign in again to see your notes."
        confirmLabel="Sign out"
        pendingLabel="Signing out…"
        pending={logout.isPending}
        onConfirm={() =>
          logout.mutate(undefined, { onSettled: () => setConfirming(false) })
        }
        onCancel={() => setConfirming(false)}
      />
    </>
  );
}
