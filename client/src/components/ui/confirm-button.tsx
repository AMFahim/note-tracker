"use client";

import { useState } from "react";
import { Button } from "./button";

interface ConfirmButtonProps {
  label: string;
  confirmLabel: string;
  pendingLabel: string;
  pending?: boolean;
  onConfirm: () => void;
}

export function ConfirmButton({
  label,
  confirmLabel,
  pendingLabel,
  pending = false,
  onConfirm,
}: ConfirmButtonProps) {
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <Button variant="secondary" size="sm" onClick={() => setConfirming(true)}>
        {label}
      </Button>
    );
  }

  return (
    <span className="inline-flex items-center gap-2">
      <Button
        variant="danger"
        size="sm"
        pending={pending}
        pendingLabel={pendingLabel}
        onClick={onConfirm}
      >
        {confirmLabel}
      </Button>
      <Button variant="ghost" size="sm" disabled={pending} onClick={() => setConfirming(false)}>
        Cancel
      </Button>
    </span>
  );
}
