"use server";

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import prisma from "@/lib/db";

// Configure DynamoDB client
const dynamoClient = new DynamoDBClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
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

    // Fetch the email with its attachments
    const email = await prisma.emails.findUnique({
      where: {
        id: emailId,
      },
      include: {
        attachments: true,
      },
    });

    if (!email) {
      return {
        success: false,
        message: "Email not found",
      };
    }

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

    // Delete the email from the database
    // This will cascade delete the attachments due to the onDelete: Cascade setting
    await prisma.emails.delete({
      where: {
        id: emailId,
      },
    });

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
