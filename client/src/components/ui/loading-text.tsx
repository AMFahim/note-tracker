export function LoadingText({ label = "Loading…" }: { label?: string }) {
  return (
    <p role="status" className="text-sm text-ink-muted">
      {label}
    </p>
  );
}
