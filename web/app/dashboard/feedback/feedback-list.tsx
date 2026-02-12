"use client";

import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { MessageSquare, Trash2 } from "lucide-react";
import { deleteFeedback } from "@/app/actions/feedback-actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface FeedbackListProps {
  feedback: { id: string; message: string; createdAt: Date }[];
}

export function FeedbackList({ feedback }: FeedbackListProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (feedbackId: string) => {
    setDeletingId(feedbackId);
    try {
      const result = await deleteFeedback(feedbackId);
      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to delete feedback");
    } finally {
      setDeletingId(null);
    }
  };
  if (feedback.length === 0) {
    return (
      <Card className="border-2">
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Your Feedback</h2>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              You haven&apos;t submitted any feedback yet.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="border-2">
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Your Feedback</h2>
        <ScrollArea className="pr-4">
          <div className="space-y-4">
            {feedback.map((item) => (
              <Card key={item.id} className="p-4 bg-muted/50">
                <div className="flex items-start gap-3">
                  <MessageSquare className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm whitespace-pre-wrap break-words">
                      {item.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(item.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(item.id)}
                    disabled={deletingId === item.id}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
}
