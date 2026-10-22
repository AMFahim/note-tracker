"use client";

import { useEffect, useId, useRef } from "react";
import { Alert } from "./alert";
import { Button, type ButtonStyleProps } from "./button";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  pendingLabel: string;
  pending?: boolean;
  error?: string;
  confirmVariant?: ButtonStyleProps["variant"];
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  pendingLabel,
  pending = false,
  error,
  confirmVariant = "primary",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }
    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  const cancel = () => {
    if (!pending) {
      onCancel();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onCancel={(event) => {
        event.preventDefault();
        cancel();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          cancel();
        }
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-sm rounded-card border border-border bg-canvas p-0 text-ink shadow-[0_8px_32px_rgb(0_0_0/0.24)] backdrop:bg-[rgb(0_0_0/0.5)]"
    >
      <div className="flex flex-col gap-4 p-6">
        <div className="flex flex-col gap-1">
          <h2 id={titleId} className="text-lg font-semibold">
            {title}
          </h2>
          <p id={descriptionId} className="text-sm text-ink-muted">
            {description}
          </p>
        </div>
        {error && <Alert>{error}</Alert>}
        <div className="flex justify-end gap-2">
          <Button
            variant="secondary"
            disabled={pending}
            onClick={cancel}
            autoFocus
          >
            Cancel
          </Button>
          <Button
            variant={confirmVariant}
            pending={pending}
            pendingLabel={pendingLabel}
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </dialog>
  );
}
