"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { headers } from "next/headers";

export async function CreateFirstEmail({ email }: { email: string }) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new Error("Unauthorized");
    }

    const existingEmailAddress = await prisma.emailAddresses.findUnique({
      where: {
        email: email,
      },
    });
    if (existingEmailAddress) {
      throw new Error("Email address not available");
    }

    await prisma.$transaction(async (tx) => {
      await tx.emailAddresses.create({
        data: {
          email: email,
          userId: session.user.id,
          id: crypto.randomUUID(),
        },
      });

      await tx.user.update({
        where: {
          id: session.user.id,
        },
        data: {
          completedSignup: "true",
        },
      });
    });

    return {
      success: true,
      message: "Email address created successfully",
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to create email address",
    };
  }
}

export async function AddEmailAddress({ email }: { email: string }) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new Error("Unauthorized");
    }

    const existingEmailAddress = await prisma.emailAddresses.findUnique({
      where: {
        email: email,
      },
    });
    if (existingEmailAddress) {
      throw new Error("Email address not available");
    }

    await prisma.emailAddresses.create({
      data: {
        email: email,
        userId: session.user.id,
        id: crypto.randomUUID(),
      },
    });

    return {
      success: true,
      message: "Email address added successfully",
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      message: error.message,
    };
  }
}
