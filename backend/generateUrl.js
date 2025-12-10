import AWS from "aws-sdk";
import dotenv from "dotenv";
dotenv.config();

const s3 = new AWS.S3({
  endpoint: process.env.R2_ENDPOINT,
  accessKeyId: process.env.R2_ACCESS_KEY_ID,
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  signatureVersion: "v4",
});

const params = {
  Bucket: process.env.R2_BUCKET,
  Key: "test-upload.png", // change this file name as needed
  Expires: 300,           // pre-signed URL valid for 5 minutes
  ContentType: "image/png",
};

const url = s3.getSignedUrl("putObject", params);
console.log("Pre-signed URL:", url);
