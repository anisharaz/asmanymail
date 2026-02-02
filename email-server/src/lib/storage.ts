import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
dotenv.config();

const isMinIO = process.env.USE_MINIO == "true";

const s3Config: any = {
  region: process.env.AWS_REGION || "us-east-1",
};

if (isMinIO) {
  s3Config.endpoint = process.env.MINIO_ENDPOINT || "http://localhost:9000";
  s3Config.credentials = {
    accessKeyId: process.env.MINIO_ACCESS_KEY || "minioadmin",
    secretAccessKey: process.env.MINIO_SECRET_KEY || "minioadmin",
  };
  s3Config.forcePathStyle = true;
}

const s3Client = new S3Client(s3Config);

export async function uploadFileToS3(
  key: string,
  buffer: Buffer,
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME as string,
    Key: key,
    Body: buffer,
  });

  await s3Client.send(command);
  const url = new URL(`https://${process.env.AWS_CDN_DOMAIN as string}/${key}`);

  // Return the file URL
  return `${url.toString()}`;
}
