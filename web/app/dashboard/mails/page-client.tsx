"use client";
import { useState } from "react";
import Link from "next/link";
import { Info, AlertCircle } from "lucide-react";
import EmailAddressSelector from "./email-address-selector";
import AllMails from "./all-mails";
import ShowMailDetail from "./show-mail-details";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface MailsPageClientProps {
  emailAddresses: { id: string; email: string }[];
  emailsToShow: string;
}

function MailsPageClient({
  emailAddresses,
  emailsToShow,
}: MailsPageClientProps) {
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);

  return (
    <div className="flex flex-col w-full">
      {/* Feature Status Info Banner */}
      <div className="p-2">
        <Alert variant="default" className="box-border">
          <AlertCircle className="h-5 w-5" />
          <AlertDescription>
            <strong>Receive-only mode</strong>
          </AlertDescription>
        </Alert>
      </div>
      <div className="p-2">
        {emailAddresses.length === 1 && (
          <Alert className=" border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950">
            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <AlertDescription className="text-blue-900 dark:text-blue-100">
              Why to settle with one email address when you can create more
              email addresses to manage multiple inboxes.{" "}
              <Link
                href="/dashboard/settings"
                className="font-medium underline hover:no-underline"
              >
                Go to Settings
              </Link>
            </AlertDescription>
          </Alert>
        )}
      </div>
      <div className="flex-1 w-full flex">
        <div
          className={cn(
            "w-full transition-all",
            selectedEmailId ? "hidden md:block md:w-1/2 border-r" : "w-full",
          )}
        >
          <AllMails
            emailAddressId={emailsToShow}
            onEmailSelect={setSelectedEmailId}
            selectedEmailId={selectedEmailId}
          >
            <div className="p-2">
              <EmailAddressSelector
                emailAddresses={emailAddresses}
                selectedEmailId={emailsToShow}
              />
            </div>
          </AllMails>
        </div>
        {selectedEmailId && (
          <div className="w-full md:w-1/2">
            <ShowMailDetail
              emailId={selectedEmailId}
              onClose={() => setSelectedEmailId(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default MailsPageClient;
