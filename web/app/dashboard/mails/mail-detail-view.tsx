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
import { getInitials, formatDetailedDate, formatFileSize } from "@/lib/utils";

interface MailDetailViewProps {
  emailId: string;
  onClose: () => void;
}

function MailDetailView({ emailId, onClose }: MailDetailViewProps) {
  const [email, setEmail] = useState<
    (Emails & { attachments: Attachments[] }) | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between p-2 border-b flex-shrink-0">
        <h2 className="text-lg md:text-xl font-semibold">Email Details</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="md:h-10 md:w-10"
        >
          <X className="h-4 w-4 md:h-5 md:w-5" />
        </Button>
      </div>
      <div className="flex-1 overflow-auto">
        <div className="space-y-4 md:space-y-6 p-4 md:p-5 pb-8">
          <div>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 md:mb-5">
              {email.subject || "(No Subject)"}
            </h1>
            <div className="flex items-start gap-3 md:gap-4">
              <Avatar className="h-12 w-12 md:h-14 md:w-14 flex-shrink-0">
                <AvatarFallback className="bg-primary/10 text-primary text-sm md:text-base font-semibold">
                  {getInitials(email.from)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0 space-y-2 md:space-y-3">
                <div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm md:text-base font-semibold truncate">
                      {email.from.split("<")[0].trim() || email.from}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground mt-1">
                    <MailIcon className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
                    <span className="truncate">{email.from}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 flex-shrink-0" />
                  <span className="text-xs md:text-sm">
                    {formatDetailedDate(email.date)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs md:text-sm">
                  <span className="text-muted-foreground font-medium">To:</span>
                  <span className="font-semibold truncate">{email.to}</span>
                </div>
                {email.attachments.length > 0 && (
                  <div>
                    <Badge variant="default" className="text-xs">
                      {email.attachments.length} Attachment
                      {email.attachments.length !== 1 ? "s" : ""}
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Separator />

          <div className="prose prose-sm md:prose-base lg:prose-lg max-w-none dark:prose-invert">
            {email.html ? (
              <div dangerouslySetInnerHTML={{ __html: email.html }} />
            ) : email.text ? (
              <div className="whitespace-pre-wrap text-sm md:text-base leading-relaxed">
                {email.text}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">No content</p>
            )}
          </div>

          <Separator />

          {email.attachments && email.attachments.length > 0 && (
            <div>
              <h3 className="text-base md:text-lg font-semibold mb-3">
                Attachments
              </h3>
              <div className="space-y-2 md:space-y-3">
                {email.attachments.map((attachment, index) => (
                  <a
                    key={index}
                    href={attachment.url}
                    download={attachment.filename}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 md:p-4 border rounded-lg bg-muted/50 hover:bg-muted transition-colors group"
                  >
                    <Download className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm md:text-base font-medium truncate group-hover:text-primary">
                        {attachment.filename}
                      </p>
                      <p className="text-xs md:text-sm text-muted-foreground">
                        {formatFileSize(attachment.size)}
                      </p>
                    </div>
                    <ExternalLink className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MailDetailView;
