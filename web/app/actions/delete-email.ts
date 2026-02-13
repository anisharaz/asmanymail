"use server";

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

// Configure DynamoDB client
const dynamoClient = new DynamoDBClient({
  region: process.env.AWS_REGION?.trim() || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID?.trim() || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY?.trim() || "",
  },
});

const docClient = DynamoDBDocumentClient.from(dynamoClient);

interface DeleteEmailResult {
  success: boolean;
  message: string;
  error?: string;
}

export async function deleteEmail(emailId: string): Promise<DeleteEmailResult> {
  try {
    // Validate email ID
    if (!emailId || typeof emailId !== "string") {
      return {
        success: false,
        message: "Invalid email ID provided",
      };
    }

    // Fetch the email with its attachments and email address (to get userId)
    const email = await prisma.emails.findUnique({
      where: {
        id: emailId,
      },
      include: {
        attachments: true,
        emailAddress: true,
      },
    });

    if (!email) {
      return {
        success: false,
        message: "Email not found",
      };
    }

    // Calculate total size of attachments for storage update
    const totalAttachmentSize = email.attachments.reduce((sum, attachment) => {
      return sum + Number(attachment.size);
    }, 0);

    // Extract attachment paths (S3 keys) from URLs
    const attachmentPaths = email.attachments.map((attachment) => {
      try {
        // Parse the URL and extract the pathname (S3 key)
        const url = new URL(attachment.url);
        return url.pathname.startsWith("/")
          ? url.pathname.slice(1)
          : url.pathname;
      } catch {
        // If URL parsing fails, return the original URL
        return attachment.url;
      }
    });

    // Store attachment paths in DynamoDB (if there are any attachments)
    if (attachmentPaths.length > 0) {
      const tableName =
        process.env.DYNAMODB_TABLE_NAME ||
        "asmanymail-deleted-email-attachments";

      const command = new PutCommand({
        TableName: tableName,
        Item: {
          emailId: emailId,
          attachmentPaths: attachmentPaths,
        },
      });

      await docClient.send(command);
    }

    // Update user's storage limits
    if (totalAttachmentSize > 0) {
      await prisma.userLimits.update({
        where: {
          userId: email.emailAddress.userId,
        },
        data: {
          currentStorageInBytes: {
            decrement: totalAttachmentSize,
          },
        },
      });
    }

    // Delete the email from the database
    // This will cascade delete the attachments due to the onDelete: Cascade setting
    await prisma.emails.delete({
      where: {
        id: emailId,
      },
    });

    revalidatePath("/dashboard/mails");

    return {
      success: true,
      message: `Email deleted successfully. ${attachmentPaths.length} attachment(s) archived.`,
    };
  } catch (error) {
    console.error("Error deleting email:", error);
    return {
      success: false,
      message: "Failed to delete email",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function deleteEmailAddress(
  emailAddressId: string,
): Promise<DeleteEmailResult> {
  try {
    // Validate email address ID
    if (!emailAddressId || typeof emailAddressId !== "string") {
      return {
        success: false,
        message: "Invalid email address ID provided",
      };
    }

    // Fetch the email address with all its emails and attachments
    const emailAddress = await prisma.emailAddresses.findUnique({
      where: {
        id: emailAddressId,
      },
      include: {
        emails: {
          include: {
            attachments: true,
          },
        },
      },
    });

    if (!emailAddress) {
      return {
        success: false,
        message: "Email address not found",
      };
    }

    // Collect all attachment paths from all emails
    const attachmentPaths: string[] = [];
    let totalAttachmentSize = 0;

    for (const email of emailAddress.emails) {
      for (const attachment of email.attachments) {
        totalAttachmentSize += Number(attachment.size);

        try {
          // Parse the URL and extract the pathname (S3 key)
          const url = new URL(attachment.url);
          const path = url.pathname.startsWith("/")
            ? url.pathname.slice(1)
            : url.pathname;
          attachmentPaths.push(path);
        } catch {
          // If URL parsing fails, use the original URL
          attachmentPaths.push(attachment.url);
        }
      }
    }

    // Store attachment paths in DynamoDB (if there are any attachments)
    if (attachmentPaths.length > 0) {
      const tableName =
        process.env.DYNAMODB_TABLE_NAME ||
        "asmanymail-deleted-email-attachments";

      const command = new PutCommand({
        TableName: tableName,
        Item: {
          emailId: emailAddressId, // Using email address ID as the key
          attachmentPaths: attachmentPaths,
        },
      });

      await docClient.send(command);
    }

    // Update user's storage limits and email address count
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {
      currentNumberOfEmailAddresses: {
        decrement: 1,
      },
    };

    if (totalAttachmentSize > 0) {
      updateData.currentStorageInBytes = {
        decrement: totalAttachmentSize,
      };
    }

    await prisma.userLimits.update({
      where: {
        userId: emailAddress.userId,
      },
      data: updateData,
    });

    // Delete the email address from the database
    // This will cascade delete all emails and their attachments
    await prisma.emailAddresses.delete({
      where: {
        id: emailAddressId,
      },
    });

    revalidatePath("/dashboard/mails");
    revalidatePath("/dashboard/settings");

    return {
      success: true,
      message: `Email address deleted successfully. ${emailAddress.emails.length} email(s) and ${attachmentPaths.length} attachment(s) archived.`,
    };
  } catch (error) {
    console.error("Error deleting email address:", error);
    return {
      success: false,
      message: "Failed to delete email address",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
