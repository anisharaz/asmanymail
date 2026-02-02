"use client";
import { useEffect, useState } from "react";
import { type Emails, Attachments } from "@/lib/generated/prisma/client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  X,
  Calendar,
  User,
  Mail as MailIcon,
  Download,
  ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

function ShowMailDetails({
  emailId,
  onClose,
}: {
  emailId: string;
  onClose: () => void;
}) {
  const [email, setEmail] = useState<
    (Emails & { attachments: Attachments[] }) | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    return emailDate.toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatFileSize = (bytes: string | number | bigint) => {
    const size =
      typeof bytes === "bigint"
        ? Number(bytes)
        : typeof bytes === "string"
          ? parseInt(bytes)
          : bytes;
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
    if (size < 1024 * 1024 * 1024)
      return `${(size / (1024 * 1024)).toFixed(2)} MB`;
    return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  useEffect(() => {
    const fetchEmail = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/mails/${emailId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch email");
        }

        const data = await response.json();
        setEmail(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (emailId) {
      fetchEmail();
    }
  }, [emailId]);

  if (loading) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-3 md:p-4 border-b">
          <Skeleton className="h-6 w-40" />
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-4 md:p-6 space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (error || !email) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-3 md:p-4 border-b">
          <h2 className="text-base md:text-lg font-semibold">Error</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center justify-center h-full text-muted-foreground">
          <p>{error || "Email not found"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-auto">
      <div className="flex items-center justify-between p-3 md:p-4 border-b">
        <h2 className="text-base md:text-lg font-semibold">Email Details</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-4 md:space-y-6 p-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">
            {email.subject || "(No Subject)"}
          </h1>
          <div className="flex items-start gap-3 md:gap-4">
            <Avatar className="h-10 w-10 md:h-12 md:w-12">
              <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                {getInitials(email.from)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2 md:space-y-3">
              <div>
                <div className="flex items-center gap-2">
                  <User className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
                  <span className="text-sm md:text-base font-semibold truncate">
                    {email.from.split("<")[0].trim() || email.from}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground mt-1">
                  <MailIcon className="h-3 w-3" />
                  <span className="truncate">{email.from}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
                <Calendar className="h-3 w-3 md:h-4 md:w-4" />
                <span className="text-xs md:text-sm">
                  {formatDate(email.date)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs md:text-sm">
                <span className="text-muted-foreground">To:</span>
                <span className="font-medium truncate">{email.to}</span>
              </div>
              <div>
                <Badge variant="default">
                  {email.attachments.length} Attachment
                  {email.attachments.length !== 1 ? "s" : ""}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        <div>
          {email.html ? (
            <div
              className="prose prose-sm md:prose-base max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: email.html }}
            />
          ) : email.text ? (
            <div className="whitespace-pre-wrap text-xs md:text-sm leading-relaxed">
              {email.text}
            </div>
          ) : (
            <p className="text-xs md:text-sm text-muted-foreground italic">
              No content
            </p>
          )}
        </div>

        <Separator />

        {email.attachments && email.attachments.length > 0 && (
          <div className="">
            <div className="space-y-2">
              {email.attachments.map((attachment, index) => (
                <a
                  key={index}
                  href={attachment.url}
                  download={attachment.filename}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 border rounded-lg bg-muted/50 hover:bg-muted transition-colors group"
                >
                  <Download className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate group-hover:text-primary">
                      {attachment.filename}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(attachment.size)}
                    </p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ShowMailDetails;
