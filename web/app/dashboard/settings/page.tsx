import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail } from "lucide-react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/db";
import { AddEmailForm } from "./add-email-form";
import { EmailListItem } from "./email-list-item";

async function SettingsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return <div>Unauthorized</div>;
  }

  const emails = await prisma.emailAddresses.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const emailDomain = process.env.NEXT_PUBLIC_EMAIL_DOMAIN!;

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

      {/* Email List */}
      <Card className="border-2">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Mail className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Your Email Addresses</h2>
            <Badge variant="secondary" className="ml-auto">
              {emails.length}
            </Badge>
          </div>

          {emails.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No email addresses yet. Add one above to get started.
            </p>
          ) : (
            <div className="space-y-2">
              {emails.map((email) => (
                <EmailListItem
                  key={email.id}
                  id={email.id}
                  email={email.email}
                  createdAt={email.createdAt}
                  emailDomain={emailDomain}
                />
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

export default SettingsPage;
