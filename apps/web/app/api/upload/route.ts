import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "node:crypto";
const s3 = new S3Client({
  region: "auto", // Required by AWS SDK, not used by R2
  // Provide your R2 endpoint: https://<ACCOUNT_ID>.r2.cloudflarestorage.com
  endpoint: process.env.S3_API,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: Request) {
  const formData = await req.formData();
  const files = formData.getAll("images") as File[];

  if (!files.length) {
    return Response.json({ message: "No files provided" }, { status: 200 });
  }

  const urls = await Promise.all(
    files.map(async (file) => {
      const buffer = Buffer.from(await file.arrayBuffer());
      const key = `pins/${randomUUID()}-${file.name}`;

      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.R2_BUCKET_NAME!,
          Key: key,
          Body: buffer,
          ContentType: file.type,
        }),
      );

      return `https://pub-6c943fcf0c9447139d523a8511236ae8.r2.dev/${key}`;
    }),
  );

  return Response.json({ urls }, { status: 200 });
}
