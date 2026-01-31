import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: "auto", // for use with cloudflare r2
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME!;

export async function uploadFileToS3(
  key: string,
  buffer: Buffer,
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: buffer,
  });

  await s3Client.send(command);
  const url = new URL(`https://${process.env.AWS_CDN_DOMAIN as string}/${key}`);

  // Return the file URL
  return `${url.toString()}`;
}
