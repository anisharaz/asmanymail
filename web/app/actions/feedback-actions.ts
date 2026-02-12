"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { headers } from "next/headers";
import { z } from "zod";

const feedbackSchema = z.object({
  message: z
    .string()
    .min(10, "Feedback must be at least 10 characters")
    .max(1000, "Feedback must be less than 1000 characters"),
});

export type FeedbackSchema = z.infer<typeof feedbackSchema>;

export async function submitFeedback(data: FeedbackSchema) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return {
        success: false,
        message: "Unauthorized. Please log in to submit feedback.",
      };
    }

    // Validate the input
    const validatedData = feedbackSchema.parse(data);

    // Create feedback in database
    await prisma.feedback.create({
      data: {
        id: crypto.randomUUID(),
        userId: session.user.id,
        message: validatedData.message,
      },
    });

    return {
      success: true,
      message: "Thank you for your feedback!",
    };
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: error.issues[0]?.message || "Invalid feedback data",
      };
    }

    console.error("Error submitting feedback:", error);
    return {
      success: false,
      message: "Failed to submit feedback. Please try again.",
    };
  }
}

export async function deleteFeedback(feedbackId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return {
        success: false,
        message: "Unauthorized. Please log in to delete feedback.",
      };
    }

    // Verify the feedback belongs to the user
    const feedback = await prisma.feedback.findUnique({
      where: { id: feedbackId },
      select: { userId: true },
    });

    if (!feedback) {
      return {
        success: false,
        message: "Feedback not found.",
      };
    }

    if (feedback.userId !== session.user.id) {
      return {
        success: false,
        message: "Unauthorized. You can only delete your own feedback.",
      };
    }

    // Delete the feedback
    await prisma.feedback.delete({
      where: { id: feedbackId },
    });

    return {
      success: true,
      message: "Feedback deleted successfully.",
    };
  } catch (error: unknown) {
    console.error("Error deleting feedback:", error);
    return {
      success: false,
      message: "Failed to delete feedback. Please try again.",
    };
  }
}
