import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: "us-east-1",
  // TODO: uncomment in production
  // credentials: {
  //   accessKeyId: "",
  //   secretAccessKey: "",
  // },
});

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
