"use client";
import { useEffect, useState, useRef } from "react";
import { type Emails } from "@/lib/generated/prisma/client";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Inbox, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

function AllMails({
  emailAddressId,
  onEmailSelect,
  selectedEmailId,
  children,
}: {
  emailAddressId: string;
  onEmailSelect: (emailId: string) => void;
  selectedEmailId: string | null;
  children: React.ReactNode;
}) {
  const [emails, setEmails] = useState<Emails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isInitialLoad = useRef(true);

  const isEmailNew = (emailDate: Date | string) => {
    const now = new Date();
    const emailTime = new Date(emailDate);
    const diffInMinutes = (now.getTime() - emailTime.getTime()) / (1000 * 60);
    return diffInMinutes < 5;
  };

  const getInitials = (email: string) => {
    const name = email.split("@")[0];
    return name
      .split(/[._-]/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  const formatDate = (date: Date | string) => {
    const emailDate = new Date(date);
    const now = new Date();
    const diffInHours =
      (now.getTime() - emailDate.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return emailDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } else if (diffInHours < 168) {
      return emailDate.toLocaleDateString("en-US", { weekday: "short" });
    } else {
      return emailDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  const stripHtml = (html: string) => {
    if (!html) return "";
    return html
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  };

  const getEmailPreview = (email: Emails) => {
    const content = email.text || stripHtml(email.html || "");
    return truncateText(content, 150);
  };

  useEffect(() => {
    if (!emailAddressId) {
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
          `/api/mails?emailAddressId=${emailAddressId}`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch emails");
        }

        const data = await response.json();
        setEmails(data.emails);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        if (!silent) {
          setLoading(false);
        }
      }
    };

    // Initial fetch
    fetchEmails(false);
    isInitialLoad.current = false;

    // Set up polling every 5 seconds
    const intervalId = setInterval(() => {
      fetchEmails(true); // Silent fetch
    }, 5000);

    return () => clearInterval(intervalId);
  }, [emailAddressId]);

  if (loading) {
    return (
      <div className="flex flex-col space-y-3 p-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4 p-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
            <Skeleton className="h-4 w-[60px]" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] text-muted-foreground">
        <AlertCircle className="h-12 w-12 mb-4" />
        <p className="text-lg font-semibold">Error loading emails</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (emails.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] text-muted-foreground">
        <Inbox className="h-16 w-16 mb-4" />
        <p className="text-lg font-semibold">No emails yet</p>
        <p className="text-sm">Emails sent to this address will appear here</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full gap-1">
      <div className="">
        <div className="md:flex md:px-3 md:py-1 items-center justify-between ">
          <h2 className="flex items-center text-lg md:text-xl font-medium">
            <SidebarTrigger />
            <div className="md:flex items-center">
              <div>Inbox of</div>
              {children}
            </div>
          </h2>
          <Separator className="md:hidden mt-2" />
          <span className="text-xs pl-2 md:text-sm text-muted-foreground">
            {emails.length} {emails.length === 1 ? "message" : "messages"}
          </span>
        </div>
      </div>
      <Separator />
      <ScrollArea className="flex-1">
        <div className="divide-y divide-border">
          {emails.map((email) => (
            <div
              key={email.id}
              onClick={() => onEmailSelect(email.id)}
              className={cn(
                "flex items-start gap-3 md:gap-4 px-3 md:px-6 py-2 md:py-3 cursor-pointer transition-all duration-150 hover:shadow-sm",
                selectedEmailId === email.id
                  ? "bg-accent"
                  : "hover:bg-muted/50",
                isEmailNew(email.date) &&
                  selectedEmailId !== email.id &&
                  "bg-blue-50 dark:bg-blue-950/20 border-l-4 border-l-blue-500",
              )}
            >
              <Avatar className="h-9 w-9 md:h-11 md:w-11 flex-shrink-0 mt-0.5">
                <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                  {getInitials(email.from)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span
                      className={cn(
                        "text-sm truncate",
                        isEmailNew(email.date) ? "font-bold" : "font-medium",
                      )}
                    >
                      {email.from.split("<")[0].trim() || email.from}
                    </span>
                    {isEmailNew(email.date) && (
                      <Badge
                        variant="default"
                        className="h-5 px-2 text-xs font-semibold"
                      >
                        NEW
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap font-medium">
                    {formatDate(email.date)}
                  </span>
                </div>

                <div className="space-y-1">
                  <p
                    className={cn(
                      "text-sm truncate",
                      isEmailNew(email.date) ? "font-semibold" : "font-normal",
                    )}
                  >
                    {email.subject || "(No Subject)"}
                  </p>
                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
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

export default AllMails;
