import { Suspense } from "react";
import { AddEmailForm } from "./add-email-form";
import { EmailList } from "./email-list";
import { EmailListSkeleton } from "@/components/loading/settings-loading-skeletons";

function SettingsPage() {
  return (
    <div className="container mx-auto max-w-4xl py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your email addresses and preferences
        </p>
      </div>

      {/* Add New Email Form */}
      <AddEmailForm />

      {/* Email List with Suspense */}
      <Suspense fallback={<EmailListSkeleton />}>
        <EmailList />
      </Suspense>
    </div>
  );
}

export default SettingsPage;
