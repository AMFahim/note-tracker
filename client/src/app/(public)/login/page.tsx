import type { Metadata } from "next";
import { FormSkeleton } from "@/components/ui/skeleton";
import { AuthCard } from "@/features/auth/components/auth-card";
import { GuestOnly } from "@/features/auth/components/guest-only";
import { LoginForm } from "@/features/auth/components/login-form";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <AuthCard
      title="Sign in"
      description="Welcome back. Sign in to your notes."
      footer={{ text: "New here?", linkLabel: "Create an account", href: "/register" }}
    >
      <GuestOnly fallback={<FormSkeleton fields={2} fullWidthButton />}>
        <LoginForm />
      </GuestOnly>
    </AuthCard>
  );
}
