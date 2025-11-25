import express from "express";
import {
  getProfile,
  updateProfile,
  addGalleryItem,
  uploadProfileImage,
  deleteGalleryFolder,
  setGalleryPrivacy,
  listPublicProfiles,
  getPublicProfile,
  likeGalleryFolder,
  debugReceiveUpload,
  deleteAccount,
} from "../Controllers/userProfilecontroller.js";
import { authMiddleware } from "../Middleware/auth.js";
import { upload } from "../Config/cloudinary.js"; // ✅ use this, no need to redeclare

const profilerouter = express.Router();
// Delete own account
profilerouter.delete("/me", authMiddleware, deleteAccount);

// Get own profile
profilerouter.get("/me", authMiddleware, getProfile);

// Public listing (read-only)
profilerouter.get("/public", listPublicProfiles);
profilerouter.get("/public/:id", getPublicProfile);

// Public: like/unlike a gallery folder
profilerouter.post("/public/:id/gallery/:folderId/like", likeGalleryFolder);

// Update profile info
profilerouter.put("/update", authMiddleware, updateProfile);

// Add image/video to gallery (supports multiple files)
profilerouter.post(
  "/gallery",
  authMiddleware,
  upload.fields([
    { name: "file", maxCount: 20 },
    { name: "coverImage", maxCount: 1 },
  ]),
  addGalleryItem
);

// Debug route to inspect multer parsing (temporary)
profilerouter.post(
  "/gallery/debug",
  authMiddleware,
  upload.array("file"),
  debugReceiveUpload
);

// Upload and set cover/profile image
profilerouter.post(
  "/upload-image",
  authMiddleware,
  upload.single("file"),
  uploadProfileImage
);

// Delete gallery folder
profilerouter.delete("/gallery/:folderId", authMiddleware, deleteGalleryFolder);

// Set gallery privacy (public/private)
profilerouter.put(
  "/gallery/:folderId/privacy",
  authMiddleware,
  setGalleryPrivacy
);

export default profilerouter;
