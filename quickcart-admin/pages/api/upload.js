import multiparty from "multiparty";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import fs from "fs";
import mime from "mime-types";

export default async function handle(req, res) {
  const form = new multiparty.Form();
  // form.parse(req, (err, fields, files) => {
  //   if (err) return res.status(500).json({ error: err.message });
  //   res.json({ fields, files });
  // });
  const { files } = await new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });

  const client = new S3Client({
    region: "us-east-2",
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
  });

  const links = [];
  for (const file of files.file) {
    const ext = file.originalFilename.split(".").pop();
    const newFilename = Date.now() + "." + ext;
    await client.send(
      new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: newFilename,
        Body: fs.readFileSync(file.path),
        ACL: "public-read",
        ContentType: mime.lookup(file.path),
      })
    );
    const link = `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${newFilename}`;
    links.push(link);
  }
  return res.json({ links });
}

export const config = {
  api: {
    bodyParser: false,
  },
};
