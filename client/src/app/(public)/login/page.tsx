import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { GuestOnly } from "@/features/auth/components/guest-only";
import { LoginForm } from "@/features/auth/components/login-form";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <section className="max-w-sm">
      <PageHeader title="Sign in" />
      <GuestOnly>
        <LoginForm />
      </GuestOnly>
    </section>
  );
}
