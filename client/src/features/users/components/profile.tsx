"use client";

import { SettingsSection } from "@/components/layout/settings-section";
import { useSession } from "@/features/auth/hooks";
import { PasswordForm } from "./password-form";
import { ProfileForm } from "./profile-form";
import { UserSummary } from "./user-summary";

export function Profile() {
  const { data: user } = useSession();

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col gap-10">
      <UserSummary user={user} />
      <SettingsSection
        title="Details"
        description="Your name and the interests other people can see."
      >
        <ProfileForm user={user} />
      </SettingsSection>
      <SettingsSection
        title="Password"
        description="Use your current password to set a new one."
      >
        <PasswordForm />
      </SettingsSection>
    </div>
  );
}
