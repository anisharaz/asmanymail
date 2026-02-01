import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    // Get the session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch the email
    const email = await prisma.emails.findUnique({
      where: {
        id: id,
      },
      include: {
        emailAddress: {
          select: {
            userId: true,
          },
        },
        attachments: true,
      },
    });

    if (!email) {
      return NextResponse.json({ error: "Email not found" }, { status: 404 });
    }

    // Verify that the email belongs to the user's email address
    if (email.emailAddress.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Convert BigInt to string for JSON serialization
    const serializedEmail = {
      ...email,
      attachments: email.attachments.map((attachment) => ({
        ...attachment,
        size: attachment.size.toString(),
      })),
    };

    return NextResponse.json(serializedEmail);
  } catch (error) {
    console.error("Error fetching email:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
