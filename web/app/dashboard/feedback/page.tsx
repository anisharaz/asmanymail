import { FeedbackForm } from "./feedback-form";
import { FeedbackList } from "./feedback-list";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { headers } from "next/headers";

export default async function FeedbackPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  let feedback: { id: string; message: string; createdAt: Date }[] = [];

  if (session) {
    feedback = await prisma.feedback.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        message: true,
        createdAt: true,
      },
    });
  }

  return (
    <div className="flex flex-col items-center w-full h-[calc(100vh-36px)] py-8 px-4">
      <div className="w-full max-w-2xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Feedback</h1>
          <p className="text-muted-foreground">
            Help us improve by sharing your thoughts and suggestions
          </p>
        </div>
        <FeedbackForm />
        <FeedbackList feedback={feedback} />
      </div>
    </div>
  );
}
