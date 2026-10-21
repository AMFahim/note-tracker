"use client";

import { useSession } from "@/features/auth/hooks";
import { PasswordForm } from "./password-form";
import { ProfileForm } from "./profile-form";

export function Profile() {
  const { data: user } = useSession();

  if (!user) {
    return null;
  }

  return (
    <div className="grid max-w-md gap-10">
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Details</h2>
        <ProfileForm user={user} />
      </section>
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Password</h2>
        <PasswordForm />
      </section>
    </div>
  );
}
