"use client";
import { useEffect, useState, useRef, useTransition } from "react";
import { type Emails } from "@/lib/generated/prisma/client";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Inbox, AlertCircle } from "lucide-react";
import {
  cn,
  isEmailNew,
  getInitials,
  formatDate,
  getEmailPreview,
} from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import MailListHeader from "./mail-list-header";
import { InlineMailListSkeleton } from "@/components/loading/inline-mail-loading";

function MailList({
  emailAddressIdToShowMailsFor,
  onEmailSelect,
  selectedEmailId,
  emailAddresses,
}: {
  emailAddressIdToShowMailsFor: string;
  onEmailSelect: (emailId: string) => void;
  selectedEmailId: string | null;
  emailAddresses: { id: string; email: string }[];
}) {
  const [emails, setEmails] = useState<Emails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const isInitialLoad = useRef(true);

  useEffect(() => {
    if (!emailAddressIdToShowMailsFor) {
      setLoading(false);
      return;
    }

    const fetchEmails = async (silent = false) => {
      try {
        if (!silent) {
          setLoading(true);
        }
        setError(null);
        const response = await fetch(
          `/api/mails?emailAddressId=${emailAddressIdToShowMailsFor}`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch emails");
        }

        const data = await response.json();

        // Use transition for smoother updates
        startTransition(() => {
          setEmails(data.emails);
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        if (!silent) {
          setLoading(false);
        }
      }
    };
    fetchEmails(false);
    isInitialLoad.current = false;
    const intervalId = setInterval(() => {
      fetchEmails(true);
    }, 5000);
    return () => clearInterval(intervalId);
  }, [emailAddressIdToShowMailsFor]);

  if (loading) {
    return (
      <div className="flex flex-col h-full w-full">
        <div className="p-3 md:p-4 border-b">
          <Skeleton className="h-8 w-48" />
        </div>
        <Separator />
        <ScrollArea className="flex-1">
          <InlineMailListSkeleton count={8} />
        </ScrollArea>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-100 text-muted-foreground">
        <AlertCircle className="h-12 w-12 mb-4" />
        <p className="text-lg font-semibold">Error loading emails</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full">
      <MailListHeader
        emailAddresses={emailAddresses}
        selectedEmailAddressId={emailAddressIdToShowMailsFor}
        emailCount={emails.length}
      />
      <Separator />
      <ScrollArea className="flex-1 h-[calc(100vh-12rem)] relative">
        {isPending && (
          <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10 flex items-center justify-center">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span>Updating...</span>
            </div>
          </div>
        )}
        <div className="divide-y divide-border">
          {emails.length === 0 && (
            <div className="flex flex-col items-center justify-center h-100 text-muted-foreground">
              <Inbox className="h-16 w-16 mb-4" />
              <p className="text-lg font-semibold">No emails yet</p>
              <p className="text-sm">
                Emails sent to this address will appear here
              </p>
            </div>
          )}
          {emails.map((email) => (
            <div
              key={email.id}
              onClick={() => onEmailSelect(email.id)}
              className={cn(
                "flex items-start gap-3 md:gap-4 px-4 md:px-6 py-3 md:py-4 cursor-pointer transition-all duration-150 hover:shadow-sm",
                selectedEmailId === email.id
                  ? "bg-accent"
                  : "hover:bg-muted/50",
                isEmailNew(email.date) &&
                  selectedEmailId !== email.id &&
                  "bg-blue-50 dark:bg-blue-950/20 border-l-4 border-l-blue-500",
              )}
            >
              <Avatar className="h-10 w-10 md:h-12 md:w-12 shrink-0">
                <AvatarFallback className="bg-primary/10 text-primary text-xs md:text-sm font-semibold">
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
                        className="h-5 px-1.5 md:px-2 text-[10px] md:text-xs font-semibold shrink-0"
                      >
                        NEW
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs md:text-sm text-muted-foreground whitespace-nowrap font-medium shrink-0">
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
