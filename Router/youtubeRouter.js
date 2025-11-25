import express from "express";
import { getYouTubes } from "../Controllers/youtubeController.js";

const router = express.Router();

// Public route: get all youtube videos
router.get("/", getYouTubes);

export default router;
