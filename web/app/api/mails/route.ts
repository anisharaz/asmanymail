import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Get the session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the emailAddressId from query params
    const searchParams = request.nextUrl.searchParams;
    const emailAddressId = searchParams.get("emailAddressId");

    if (!emailAddressId) {
      return NextResponse.json(
        { error: "Email address ID is required" },
        { status: 400 },
      );
    }

    // Verify that the email address belongs to the user
    const emailAddress = await prisma.emailAddresses.findUnique({
      where: {
        id: emailAddressId,
        userId: session.user.id,
      },
    });

    if (!emailAddress) {
      return NextResponse.json(
        { error: "Email address not found or unauthorized" },
        { status: 404 },
      );
    }

    // Fetch all emails for this email address
    const emails = await prisma.emails.findMany({
      where: {
        emailAddressId: emailAddressId,
      },
      orderBy: {
        date: "desc",
      },
      include: {
        attachments: true,
      },
    });

    // Convert BigInt to string for JSON serialization
    const serializedEmails = emails.map((email) => ({
      ...email,
      attachments: email.attachments.map((attachment) => ({
        ...attachment,
        size: attachment.size.toString(),
      })),
    }));

    return NextResponse.json({
      emails: serializedEmails,
      count: emails.length,
    });
  } catch (error) {
    console.error("Error fetching emails:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
