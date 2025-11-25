import Advertisement from "../Schema/Advertisement.js";
import { cloudinary } from "../Config/cloudinary.js";

// Helper to upload buffer by creating a data URI
const bufferToDataURI = (mimetype, buffer) => {
  const base64 = buffer.toString("base64");
  return `data:${mimetype};base64,${base64}`;
};

// Extract YouTube video id from common URL formats
const extractYouTubeId = (url) => {
  if (!url || typeof url !== "string") return null;
  // remove whitespace
  const trimmed = url.trim();
  // common patterns
  const regex =
    /(?:youtube(?:-nocookie)?\.com\/(?:.*v=|v\/|.*embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = trimmed.match(regex);
  if (match && match[1]) return match[1];
  // fallback: if it looks like an ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  return null;
};

export const createAds = async (req, res) => {
  try {
    const results = [];

    // First: handle YouTube links (can be a single string or comma/newline separated)
    if (req.body && req.body.youtubeLink) {
      const raw = Array.isArray(req.body.youtubeLink)
        ? req.body.youtubeLink
        : String(req.body.youtubeLink)
            .split(/[,\n]/)
            .map((s) => s.trim())
            .filter(Boolean);

      for (const link of raw) {
        const id = extractYouTubeId(link);
        if (!id) continue;
        const thumbnail = `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
        const ad = new Advertisement({
          title: req.body.title || undefined,
          description: req.body.description || undefined,
          mediaUrl: thumbnail,
          youtubeLink: link,
          resource_type: "youtube",
          mimeType: "image/jpeg",
        });
        await ad.save();
        results.push(ad);
      }
    }

    // Then handle file uploads (images/videos)
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const resourceType = file.mimetype.startsWith("video")
          ? "video"
          : "image";
        const dataUri = bufferToDataURI(file.mimetype, file.buffer);

        const uploadRes = await cloudinary.uploader.upload(dataUri, {
          resource_type: resourceType,
        });

        const ad = new Advertisement({
          title: req.body.title || undefined,
          description: req.body.description || undefined,
          mediaUrl: uploadRes.secure_url,
          public_id: uploadRes.public_id,
          resource_type: resourceType,
          mimeType: file.mimetype,
        });

        await ad.save();
        results.push(ad);
      }
    }

    if (results.length === 0) {
      return res
        .status(400)
        .json({ message: "No files or YouTube links provided" });
    }

    return res.status(201).json({ success: true, data: results });
  } catch (err) {
    console.error("createAds error", err);
    return res
      .status(500)
      .json({ message: "Server error uploading ads", error: err.message });
  }
};

// Create ads from JSON YouTube links (no multer required)
export const createYouTubeAds = async (req, res) => {
  try {
    const { youtubeLink, title, description } = req.body;
    if (!youtubeLink) {
      return res.status(400).json({ message: "No YouTube link provided" });
    }

    const raw = Array.isArray(youtubeLink)
      ? youtubeLink
      : String(youtubeLink)
          .split(/[\n,]/)
          .map((s) => s.trim())
          .filter(Boolean);

    const results = [];
    for (const link of raw) {
      const id = extractYouTubeId(link);
      if (!id) continue;
      const thumbnail = `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
      const ad = new Advertisement({
        title: title || undefined,
        description: description || undefined,
        mediaUrl: thumbnail,
        youtubeLink: link,
        resource_type: "youtube",
        mimeType: "image/jpeg",
      });
      await ad.save();
      results.push(ad);
    }

    if (results.length === 0) {
      return res
        .status(400)
        .json({ message: "No valid YouTube links provided" });
    }

    return res.status(201).json({ success: true, data: results });
  } catch (err) {
    console.error("createYouTubeAds error", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

export const getAds = async (req, res) => {
  try {
    const ads = await Advertisement.find({}).sort({ createdAt: -1 });
    return res.json({ success: true, data: ads });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error fetching ads" });
  }
};

export const deleteAd = async (req, res) => {
  try {
    const { id } = req.params;
    const ad = await Advertisement.findById(id);
    if (!ad) return res.status(404).json({ message: "Ad not found" });

    // attempt to remove from cloudinary if public_id exists
    if (ad.public_id) {
      try {
        await cloudinary.uploader.destroy(ad.public_id, {
          resource_type: ad.resource_type,
        });
      } catch (err) {
        console.warn("Cloudinary destroy failed", err.message);
      }
    }

    await ad.deleteOne();
    return res.json({ success: true, message: "Ad deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error deleting ad" });
  }
};
