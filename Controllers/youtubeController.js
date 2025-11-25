import YouTubeVideo from "../Schema/YouTubeVideo.js";

// Extract YouTube ID (reuse similar logic)
const extractYouTubeId = (url) => {
  if (!url || typeof url !== "string") return null;
  const trimmed = url.trim();
  const regex =
    /(?:youtube(?:-nocookie)?\.com\/(?:.*v=|v\/|.*embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = trimmed.match(regex);
  if (match && match[1]) return match[1];
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  return null;
};

export const createYouTube = async (req, res) => {
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
      const vid = new YouTubeVideo({
        title: title || undefined,
        description: description || undefined,
        youtubeLink: link,
        thumbnailUrl: thumbnail,
      });
      await vid.save();
      results.push(vid);
    }

    if (results.length === 0) {
      return res
        .status(400)
        .json({ message: "No valid YouTube links provided" });
    }

    return res.status(201).json({ success: true, data: results });
  } catch (err) {
    console.error("createYouTube error", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

export const getYouTubes = async (req, res) => {
  try {
    const vids = await YouTubeVideo.find({}).sort({ createdAt: -1 });
    return res.json({ success: true, data: vids });
  } catch (err) {
    console.error("getYouTubes error", err);
    return res
      .status(500)
      .json({ message: "Server error fetching youtube videos" });
  }
};

export const deleteYouTube = async (req, res) => {
  try {
    const { id } = req.params;
    const vid = await YouTubeVideo.findById(id);
    if (!vid)
      return res.status(404).json({ message: "YouTube video not found" });
    await vid.deleteOne();
    return res.json({ success: true, message: "YouTube video deleted" });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error deleting youtube video" });
  }
};
