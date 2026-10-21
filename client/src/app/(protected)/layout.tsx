import { SessionGate } from "@/features/auth/components/session-gate";

export default function ProtectedLayout({ children }: LayoutProps<"/">) {
  return <SessionGate>{children}</SessionGate>;
}
