"use client";
import { useState } from "react";
import { type Emails, type Attachments } from "@/lib/generated/prisma/client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  X,
  Calendar,
  User,
  Mail as MailIcon,
  Download,
  ExternalLink,
  Trash2,
  Loader2,
} from "lucide-react";
import { deleteEmail } from "@/app/actions/delete-email";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getInitials, formatDetailedDate, formatFileSize } from "@/lib/utils";
import {
  EmailHtmlViewer,
  EmailTextViewer,
} from "../../../components/mail-html-text-viewer";
import { useRouter } from "next/navigation";

interface MailDetailViewProps {
  email: Emails & { attachments: Attachments[] };
  onClose: () => void;
}

function MailDetailView({ email, onClose }: MailDetailViewProps) {
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this email?")) {
      return;
    }

    try {
      setDeleting(true);
      const result = await deleteEmail(email.id);

      if (result.success) {
        // Close the detail view after successful deletion
        onClose();
        router.refresh();
      } else {
        alert(`Failed to delete email: ${result.message}`);
      }
    } catch (err) {
      alert(
        `Error deleting email: ${
          err instanceof Error ? err.message : "Unknown error"
        }`,
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between p-3 md:p-4 border-b shrink-0 gap-2">
        <h2 className="text-lg md:text-xl font-semibold truncate">
          Email Details
        </h2>
        <div className="flex items-center gap-1 md:gap-2 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            disabled={deleting}
            className="h-9 w-9 md:h-10 md:w-10 text-destructive hover:text-destructive shrink-0"
          >
            {deleting ? (
              <Loader2 className="h-4 w-4 md:h-5 md:w-5 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4 md:h-5 md:w-5" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-9 w-9 md:h-10 md:w-10 shrink-0"
          >
            <X className="h-4 w-4 md:h-5 md:w-5" />
          </Button>
        </div>
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

          <div className="max-w-none">
            {email.html ? (
              <EmailHtmlViewer html={email.html} />
            ) : email.text ? (
              <div className="prose prose-sm md:prose-base lg:prose-lg dark:prose-invert">
                <EmailTextViewer text={email.text} />
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
                    <Download className="h-5 w-5 text-muted-foreground shrink-0" />
                    <div className="flex-1 overflow-hidden">
                      <p
                        className="text-sm md:text-base font-medium group-hover:text-primary"
                        title={attachment.filename}
                      >
                        {attachment.filename}
                      </p>
                      <p className="text-xs md:text-sm text-muted-foreground">
                        {formatFileSize(Number(attachment.size))}
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
