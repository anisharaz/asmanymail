"use client";
import { type Emails } from "@/lib/generated/prisma/client";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Inbox } from "lucide-react";
import {
  cn,
  isEmailNew,
  getInitials,
  formatDate,
  getEmailPreview,
  getAvatarColor,
} from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
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
import Link from "next/link";
import EmailAddressSelector from "./mail-address-selector";
import { Info } from "lucide-react";

function MailList({
  emailAddressIdToShowMailsFor,
  onEmailSelect,
  selectedEmailId,
  emailAddresses,
  emails,
}: {
  emailAddressIdToShowMailsFor: string;
  onEmailSelect: (emailId: string) => void;
  selectedEmailId: string | null;
  emailAddresses: { id: string; email: string }[];
  emails: Emails[];
}) {
  return (
    <div className="flex flex-col h-full w-full">
      <div className="p-3 md:p-4 space-y-2 md:space-y-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-4">
          <h2 className="flex flex-col md:flex-row items-start md:items-center gap-2 text-base md:text-lg font-semibold">
            <div className="flex items-center gap-2">
              <span>Inbox of</span>
              <div className="flex items-center gap-2">
                <EmailAddressSelector
                  emailAddresses={emailAddresses}
                  selectedEmailAddressId={emailAddressIdToShowMailsFor}
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
                      <AlertDialogTitle>
                        Manage Multiple Inboxes
                      </AlertDialogTitle>
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
            {emails.length} {emails.length === 1 ? "message" : "messages"}
          </span>
        </div>
      </div>
      <Separator />
      <ScrollArea className="flex-1 h-[calc(100vh-12rem)]">
        <div className="divide-y divide-border">
          {emails.length === 0 && (
            <div className="flex flex-col items-center justify-center h-[400px] text-muted-foreground">
              <Inbox className="h-16 w-16 mb-4" />
              <p className="text-lg font-semibold">No emails yet</p>
              <p className="text-sm">
                Emails sent to this address will appear here
              </p>
            </div>
          )}
          {emails.map((email, index) => (
            <div
              key={email.id}
              onClick={() => onEmailSelect(email.id)}
              className={cn(
                "flex items-start gap-3 md:gap-4 px-4 md:px-6 py-3 md:py-4 cursor-pointer transition-all duration-150 hover:shadow-sm",
                selectedEmailId === email.id
                  ? "bg-accent"
                  : index % 2 === 0
                    ? "bg-muted/20 "
                    : "bg-background ",
                isEmailNew(email.date) &&
                  selectedEmailId !== email.id &&
                  "bg-blue-50 dark:bg-blue-950/20 border-l-4 border-l-blue-500",
              )}
            >
              <Avatar className="h-10 w-10 md:h-12 md:w-12 flex-shrink-0">
                <AvatarFallback
                  className={cn(
                    "text-xs md:text-sm font-semibold",
                    getAvatarColor(email.from),
                  )}
                >
                  {getInitials(email.from)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center justify-between gap-2 md:gap-4">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span
                      className={cn(
                        "text-sm md:text-base truncate",
                        isEmailNew(email.date) ? "font-bold" : "font-semibold",
                      )}
                    >
                      {email.from.split("<")[0].trim() || email.from}
                    </span>
                    {isEmailNew(email.date) && (
                      <Badge
                        variant="default"
                        className="h-5 px-1.5 md:px-2 text-[10px] md:text-xs font-semibold flex-shrink-0"
                      >
                        NEW
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs md:text-sm text-muted-foreground whitespace-nowrap font-medium flex-shrink-0">
                    {formatDate(email.date)}
                  </span>
                </div>

                <div className="space-y-1">
                  <p
                    className={cn(
                      "text-sm md:text-base truncate",
                      isEmailNew(email.date) ? "font-semibold" : "font-medium",
                    )}
                  >
                    {email.subject || "(No Subject)"}
                  </p>
                  <p className="text-xs md:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {getEmailPreview(email)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

export default MailList;
