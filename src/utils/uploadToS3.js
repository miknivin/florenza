// utils/awsUpload.js - Corrected Utility function for AWS S3 upload
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Initialize S3 client (configure with your AWS credentials via env vars)
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
});

const BUCKET_NAME = process.env.AWS_BUCKET_NAME;
const EXPIRATION = 3600; // Signed URL expiration in seconds (1 hour)

export async function uploadToS3(buffer, key) {
  if (!BUCKET_NAME) {
    throw new Error("AWS_BUCKET_NAME environment variable is required");
  }

  try {
    // Upload the buffer to S3
    const uploadParams = {
      Bucket: BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: "application/pdf",
    };

    const uploadCommand = new PutObjectCommand(uploadParams);
    await s3Client.send(uploadCommand);

    // Generate a signed URL for DOWNLOAD/GET (not PUT) using GetObjectCommand
    const getParams = {
      Bucket: BUCKET_NAME,
      Key: key,
      ResponseContentDisposition: `attachment; filename="${key
        .split("/")
        .pop()}"`,
      ResponseContentType: "application/pdf",
    };
    const getCommand = new GetObjectCommand(getParams);
    const signedUrl = await getSignedUrl(s3Client, getCommand, {
      expiresIn: EXPIRATION,
    });

    return signedUrl;
  } catch (error) {
    console.error("Error uploading to S3:", error);
    throw new Error("Failed to upload to S3");
  }
}
