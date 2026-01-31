import { SMTPServer } from "smtp-server";
import PostalMime from "postal-mime";
import type { Email, PostalMimeOptions } from "postal-mime";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";
import { PrismaClient } from "./generated/prisma/client";
import { uploadFileToS3 } from "./lib/storage";
import { randomUUID } from "crypto";

dotenv.config();
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

const options: PostalMimeOptions = {
  attachmentEncoding: "base64",
  rfc822Attachments: true,
};

const server = new SMTPServer({
  disabledCommands: ["AUTH"],
  authOptional: true,
  onConnect(session, cb) {
    console.log("Client connected:", session.remoteAddress);
    cb();
  },

  onMailFrom(address, session, cb) {
    console.log("MAIL FROM:", address.address);
    cb();
  },

  onRcptTo(address, session, cb) {
    console.log("RCPT TO:", address.address);
    cb();
  },

  async onData(stream, session, cb) {
    let rawEmail = Buffer.alloc(0);

    // Collect the raw email data
    stream.on("data", (chunk) => {
      rawEmail = Buffer.concat([rawEmail, chunk]);
    });

    stream.on("end", async () => {
      try {
        const email: Email = await PostalMime.parse(rawEmail, options);
        console.log("From:", email.from?.address);
        console.log("To:", email.to?.map((t) => t.address).join(", "));
        console.log("Subject:", email.subject);
        console.log("Date:", email.date);
        console.log("Text Body:", email.text?.substring(0, 100) + "...");
        console.log("HTML Body:", email.html ? "Present" : "None");
        console.log("Attachments:", email.attachments?.length || 0);

        // Find the email address in database first
        const recipientEmail = email.to?.[0]?.address;
        if (!recipientEmail) {
          throw new Error("No recipient email found");
        }

        const emailAddress = await prisma.emailAddresses.findUnique({
          where: { email: recipientEmail.split("@")[0] },
        });

        if (!emailAddress) {
          throw new Error(
            `Email address ${recipientEmail} not found in database`,
          );
        }

        // Save email to database
        const savedEmail = await prisma.emails.create({
          data: {
            id: randomUUID(),
            messageId: email.messageId || randomUUID(),
            from: email.from?.address || "",
            to:
              email.to?.map((t) => t.address).filter((a): a is string => !!a) ||
              [],
            cc:
              email.cc?.map((c) => c.address).filter((a): a is string => !!a) ||
              [],
            bcc:
              email.bcc
                ?.map((b) => b.address)
                .filter((a): a is string => !!a) || [],
            subject: email.subject || "",
            text: email.text || "",
            html: email.html || "",
            date: email.date ? new Date(email.date) : new Date(),
            emailAddressId: emailAddress.id,
          },
        });

        // Upload attachments to S3 and collect attachment data
        const attachmentData: Array<{
          filename: string;
          url: string;
          size: number;
        }> = [];

        if (email.attachments && email.attachments.length > 0) {
          const uploadPromises = email.attachments.map(async (attachment) => {
            const content =
              typeof attachment.content === "string"
                ? Buffer.from(attachment.content, "base64")
                : Buffer.from(new Uint8Array(attachment.content));

            // Generate a unique key for the attachment using userId
            const fileExtension = attachment.filename?.split(".").pop() || "";
            const key = `attachments/${emailAddress.userId}/${emailAddress.id}/${savedEmail.id}/${randomUUID()}${fileExtension ? "." + fileExtension : ""}`;

            // Upload to S3
            const url = await uploadFileToS3(key, content);
            console.log(
              `Uploaded attachment: ${attachment.filename} -> ${url}`,
            );

            return {
              filename: attachment.filename || "unnamed",
              url,
              size: content.length,
            };
          });

          attachmentData.push(...(await Promise.all(uploadPromises)));
        }

        // Create attachment records
        if (attachmentData.length > 0) {
          await prisma.attachments.createMany({
            data: attachmentData.map((attachment) => ({
              id: randomUUID(),
              filename: attachment.filename,
              url: attachment.url,
              size: attachment.size,
              emailId: savedEmail.id,
            })),
          });
        }

        console.log("Email saved to database successfully");
      } catch (err) {
        console.error("Error parsing email:", err);
      }

      cb(null); // accept message
    });

    stream.on("error", (err) => {
      console.error("Stream error:", err);
      cb(err);
    });
  },
});

server.listen(2525, () => {
  console.log("SMTP server is listening on port 2525");
});
