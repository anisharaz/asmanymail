"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field";
import {
  submitFeedback,
  type FeedbackSchema,
} from "@/app/actions/feedback-actions";
import { Loader2 } from "lucide-react";

const feedbackSchema = z.object({
  message: z
    .string()
    .min(10, "Feedback must be at least 10 characters")
    .max(1000, "Feedback must be less than 1000 characters"),
});

export function FeedbackForm() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FeedbackSchema>({
    resolver: zodResolver(feedbackSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: FeedbackSchema) => {
    try {
      setSubmitError(null);
      const result = await submitFeedback(data);

      if (!result.success) {
        setSubmitError(result.message);
        return;
      }

      // Reload the page to reflect the new feedback
      router.refresh();
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setSubmitError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <Card className="border-2">
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-2">Send Feedback</h2>
        <p className="text-muted-foreground text-sm mb-6">
          We&apos;d love to hear your thoughts, suggestions, or any issues
          you&apos;ve encountered.
        </p>

        {/* Error Message */}
        {submitError && (
          <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 animate-in slide-in-from-top duration-300">
            <p className="text-destructive text-sm font-semibold">
              {submitError}
            </p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Field>
            <FieldLabel htmlFor="message">Your Feedback</FieldLabel>
            <FieldDescription>
              Share your experience, report bugs, or suggest new features.
              Minimum 10 characters.
            </FieldDescription>
            <Textarea
              id="message"
              placeholder="I really like this app, but I think it would be even better if..."
              rows={6}
              {...register("message")}
              aria-invalid={!!errors.message}
              disabled={isSubmitting}
            />
            <FieldError>{errors.message?.message}</FieldError>
          </Field>

          <div className="flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                setSubmitError(null);
              }}
              disabled={isSubmitting}
            >
              Clear
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Feedback"
              )}
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
}
