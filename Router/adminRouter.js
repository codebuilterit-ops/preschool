import express from "express";
import {
  adminLogin,
  listPreschools,
  deletePreschool,
  getStats,
  approvePreschool,
  blockPreschool,
  unblockPreschool,
} from "../Controllers/adminController.js";
import { adminAuth } from "../Middleware/adminAuth.js";
import { upload } from "../Config/cloudinary.js";
import {
  createAds,
  deleteAd,
  createYouTubeAds,
} from "../Controllers/advertController.js";
import {
  createYouTube,
  deleteYouTube,
} from "../Controllers/youtubeController.js";

const router = express.Router();

// Admin login (returns token)
router.post("/login", adminLogin);

// Protected admin routes
router.get("/preschools", adminAuth, listPreschools);
router.delete("/preschool/:id", adminAuth, deletePreschool);
router.get("/stats", adminAuth, getStats);
router.post("/preschool/:id/approve", adminAuth, approvePreschool);
router.post("/preschool/:id/block", adminAuth, blockPreschool);
router.post("/preschool/:id/unblock", adminAuth, unblockPreschool);

// Admin advertisement management
// Upload multiple files (field name: files)
router.post("/ads", adminAuth, upload.array("files"), createAds);
// Upload YouTube links as JSON: { youtubeLink: "url or url1,url2" }
router.post("/ads/youtube", adminAuth, createYouTubeAds);
// Upload YouTube links to separate YouTube collection
router.post("/youtube", adminAuth, createYouTube);
router.delete("/ads/:id", adminAuth, deleteAd);
router.delete("/youtube/:id", adminAuth, deleteYouTube);

export default router;
