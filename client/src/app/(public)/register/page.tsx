import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { GuestOnly } from "@/features/auth/components/guest-only";
import { RegisterForm } from "@/features/auth/components/register-form";

export const metadata: Metadata = { title: "Create account" };

export default function RegisterPage() {
  return (
    <section className="max-w-md">
      <PageHeader title="Create account" />
      <GuestOnly>
        <RegisterForm />
      </GuestOnly>
    </section>
  );
}
