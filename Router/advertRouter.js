import express from "express";
import { getAds } from "../Controllers/advertController.js";

const router = express.Router();

// Public: get all advertisements
router.get("/", getAds);

export default router;
