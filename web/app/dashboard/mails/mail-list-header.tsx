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
    <div className="">
      <div className="md:flex md:px-3 md:py-1 items-center justify-between ">
        <h2 className="flex items-center text-lg md:text-xl font-medium">
          <div className="md:flex items-center">
            <div>Inbox of</div>
            <div className="md:p-2 flex justify-center gap-2">
              <EmailAddressSelector
                emailAddresses={emailAddresses}
                selectedEmailAddressId={selectedEmailAddressId}
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
          </div>
        </h2>
        <Separator className="md:hidden mt-2" />
        <span className="text-xs pl-2 md:text-sm text-muted-foreground">
          {emailCount} {emailCount === 1 ? "message" : "messages"}
        </span>
      </div>
    </div>
  );
}

export default MailListHeader;
