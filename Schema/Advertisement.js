import mongoose from "mongoose";

const AdvertisementSchema = new mongoose.Schema({
  title: { type: String },
  description: { type: String },
  mediaUrl: { type: String, required: true },
  youtubeLink: { type: String },
  public_id: { type: String },
  resource_type: {
    type: String,
    enum: ["image", "video", "youtube"],
    default: "image",
  },
  mimeType: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Advertisement = mongoose.model("Advertisement", AdvertisementSchema);
export default Advertisement;
