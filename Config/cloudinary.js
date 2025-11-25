// config/cloudinary.js
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";

// Support multiple env var naming conventions and CLOUDINARY_URL
const cloudinaryUrl = process.env.CLOUDINARY_URL;
const cloudName =
  process.env.CLOUD_NAME ||
  process.env.CLOUDINARY_CLOUD_NAME ||
  process.env.CLOUD_NAME;
const apiKey = process.env.CLOUD_API_KEY || process.env.CLOUDINARY_API_KEY;
const apiSecret =
  process.env.CLOUD_API_SECRET ||
  process.env.CLOUDINARY_SECRET_KEY ||
  process.env.CLOUDINARY_API_SECRET;

if (cloudinaryUrl) {
  cloudinary.config({ cloudinary_url: cloudinaryUrl });
} else {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });
}

// Use memory storage for multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

export { cloudinary, upload };
