import type { Metadata } from "next";
import { FormSkeleton } from "@/components/ui/skeleton";
import { AuthCard } from "@/features/auth/components/auth-card";
import { GuestOnly } from "@/features/auth/components/guest-only";
import { RegisterForm } from "@/features/auth/components/register-form";

export const metadata: Metadata = { title: "Create account" };

export default function RegisterPage() {
  return (
    <AuthCard
      title="Create account"
      description="Start keeping private notes and sharing posts."
      footer={{ text: "Already have an account?", linkLabel: "Sign in", href: "/login" }}
    >
      <GuestOnly fallback={<FormSkeleton fields={4} fullWidthButton />}>
        <RegisterForm />
      </GuestOnly>
    </AuthCard>
  );
}
