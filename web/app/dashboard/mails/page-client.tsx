"use client";
import { useState } from "react";
import SelectEmailsToShow from "./select-email-to-show";
import AllMails from "./all-mails";
import ShowMail from "./show-mail";
import { cn } from "@/lib/utils";

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
    <div className="flex flex-col h-screen w-full">
      <div className="p-2">
        <SelectEmailsToShow
          emailAddresses={emailAddresses}
          selectedEmailId={emailsToShow}
        />
      </div>
      <div className="flex-1 w-full flex overflow-hidden">
        {/* On mobile, hide list when email is selected, on desktop show split view */}
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
          />
        </div>
        {selectedEmailId && (
          <div className="w-full md:w-1/2">
            <ShowMail
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
