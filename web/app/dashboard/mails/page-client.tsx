"use client";
import { useState } from "react";
import EmailAddressSelector from "./email-address-selector";
import AllMails from "./all-mails";
import ShowMailDetail from "./show-mail-details";
import { cn } from "@/lib/utils";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
      <ResizablePanelGroup direction="horizontal" className="flex-1 w-full">
        <ResizablePanel
          defaultSize={selectedEmailId ? 50 : 100}
          minSize={30}
          className={cn("w-full", selectedEmailId && "hidden md:block")}
        >
          <AllMails
            emailAddressId={emailsToShow}
            onEmailSelect={setSelectedEmailId}
            selectedEmailId={selectedEmailId}
          >
            <div className="md:p-2 flex justify-center gap-2">
              <EmailAddressSelector
                emailAddresses={emailAddresses}
                selectedEmailId={emailsToShow}
              />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="rounded-full cursor-pointer animate-pulse shadow-[0_0_15px_rgba(0,255,255,0.6)] hover:shadow-[0_0_20px_rgba(0,255,255,0.8)] transition-shadow"
                    size="sm"
                  >
                    <Info />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Manage Multiple Inboxes</AlertDialogTitle>
                    <AlertDialogDescription>
                      You can add more email addresses in Settings to manage
                      multiple inboxes. Each email address will have its own
                      inbox and you can switch between them easily.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Close</AlertDialogCancel>
                    <AlertDialogAction asChild>
                      <Link href="/dashboard/settings">Go to Settings</Link>
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </AllMails>
        </ResizablePanel>
        {selectedEmailId && (
          <>
            <ResizableHandle withHandle className="hidden md:flex" />
            <ResizablePanel defaultSize={50} minSize={30} className="w-full">
              <ShowMailDetail
                emailId={selectedEmailId}
                onClose={() => setSelectedEmailId(null)}
              />
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </div>
  );
}

export default MailsPageClient;
