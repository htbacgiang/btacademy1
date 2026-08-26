import { v2 as cloudinary } from "cloudinary";

const cloud_name =
  process.env.CLOUD_NAME ||
  process.env.CLOUDINARY_CLOUD_NAME ||
  process.env.NEXT_PUBLIC_CLOUD_NAME ||
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

const api_key =
  process.env.CLOUD_API_KEY ||
  process.env.CLOUDINARY_API_KEY;

const api_secret =
  process.env.CLOUD_API_SECRET ||
  process.env.CLOUDINARY_API_SECRET;

cloudinary.config({
  cloud_name,
  api_key,
  api_secret,
  secure: true,
});

if (!api_key || !cloud_name || !api_secret) {
  console.warn(
    "⚠️ Cloudinary configuration is missing required environment variables:",
    {
      cloud_name: Boolean(cloud_name),
      api_key: Boolean(api_key),
      api_secret: Boolean(api_secret),
    }
  );
}

export default cloudinary;