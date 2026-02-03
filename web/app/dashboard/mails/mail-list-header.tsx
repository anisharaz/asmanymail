"use client";

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
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Info } from "lucide-react";
import Link from "next/link";
import EmailAddressSelector from "./email-address-selector";

interface MailListHeaderProps {
  emailAddresses: { id: string; email: string }[];
  selectedEmailAddressId: string;
  emailCount: number;
}

function MailListHeader({
  emailAddresses,
  selectedEmailAddressId,
  emailCount,
}: MailListHeaderProps) {
  return (
    <div className="p-3 md:p-4 space-y-2 md:space-y-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-4">
        <h2 className="flex flex-col md:flex-row items-start md:items-center gap-2 text-base md:text-lg font-semibold">
          <div className="flex items-center gap-2">
            <span>Inbox of</span>
            <div className="flex items-center gap-2">
              <EmailAddressSelector
                emailAddresses={emailAddresses}
                selectedEmailAddressId={selectedEmailAddressId}
              />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="rounded-full cursor-pointer animate-pulse shadow-[0_0_15px_rgba(0,255,255,0.6)] hover:shadow-[0_0_20px_rgba(0,255,255,0.8)] transition-shadow h-8 w-8 p-0"
                    size="icon"
                  >
                    <Info className="h-4 w-4" />
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
          </div>
        </h2>
        <span className="text-xs md:text-sm text-muted-foreground font-medium">
          {emailCount} {emailCount === 1 ? "message" : "messages"}
        </span>
      </div>
    </div>
  );
}

export default MailListHeader;
