import mongoose from "mongoose";

const YouTubeVideoSchema = new mongoose.Schema({
  title: { type: String },
  description: { type: String },
  youtubeLink: { type: String, required: true },
  thumbnailUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const YouTubeVideo = mongoose.model("YouTubeVideo", YouTubeVideoSchema);
export default YouTubeVideo;
