import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Mail, HardDrive } from "lucide-react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/db";
import { AddEmailForm } from "./add-email-form";
import { EmailListItem } from "./email-list-item";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { permanentRedirect } from "next/navigation";
import { cn } from "@/lib/utils";

// Separate async component for storage display
async function StorageDisplay() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return null;
  }

  const userLimits = await prisma.userLimits.findUnique({
    where: {
      userId: session.user.id,
    },
  });

  // Convert bytes to MB
  const currentStorageMB = userLimits
    ? Number(userLimits.currentStorageInBytes) / (1024 * 1024)
    : 0;
  const maxStorageMB = userLimits
    ? Number(userLimits.maxStorageInBytes) / (1024 * 1024)
    : 100;
  const usagePercentage = (currentStorageMB / maxStorageMB) * 100;

  return (
    <Card className="border-2">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <HardDrive className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Storage Usage</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Current Usage</p>
              <p className="text-2xl font-bold">
                {currentStorageMB.toFixed(2)} MB
              </p>
            </div>
            <div className="text-right space-y-1">
              <p className="text-sm text-muted-foreground">Limit</p>
              <p className="text-2xl font-bold">{maxStorageMB.toFixed(0)} MB</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="space-y-2">
            <Progress
              value={usagePercentage}
              className={cn(
                "h-3",
                usagePercentage > 90
                  ? "[&>*]:bg-destructive"
                  : usagePercentage > 75
                    ? "[&>*]:bg-orange-500"
                    : "",
              )}
            />
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {usagePercentage.toFixed(1)}% used
              </span>
              <Badge
                variant={
                  usagePercentage > 90
                    ? "destructive"
                    : usagePercentage > 75
                      ? "outline"
                      : "secondary"
                }
              >
                {(maxStorageMB - currentStorageMB).toFixed(2)} MB remaining
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

// Loading skeleton for storage display
function StorageDisplaySkeleton() {
  return (
    <Card className="border-2">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-6 w-32" />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-28" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-8 w-20" />
            </div>
          </div>

          <div className="space-y-2">
            <Skeleton className="h-3 w-full rounded-full" />
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-28" />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

// Separate async component for email list
async function EmailList() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return null;
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
  );
}

// Loading skeleton for email list
function EmailListSkeleton() {
  return (
    <Card className="border-2">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-5 w-8 ml-auto" />
        </div>

        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="space-y-2 flex-1">
                <Skeleton className="h-5 w-64" />
                <Skeleton className="h-4 w-40" />
              </div>
              <Skeleton className="h-9 w-20" />
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

async function SettingsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    permanentRedirect("/auth/login");
  }

  return (
    <div className="container mx-auto max-w-4xl py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your email addresses and preferences
        </p>
      </div>

      {/* Storage Usage */}
      <Suspense fallback={<StorageDisplaySkeleton />}>
        <StorageDisplay />
      </Suspense>

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
