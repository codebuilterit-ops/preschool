import mongoose from "mongoose";

const GalleryFolderSchema = new mongoose.Schema({
  folderName: String,
  galleryId: String,
  description: String,
  coverImage: String,
  isPrivate: { type: Boolean, default: false },
  images: [String],
  videos: [String],
  lastUpdated: { type: Date },
  // Likes: simple counter and optional list of visitor ids (if you later want to support toggling per-user)
  likes: { type: Number, default: 0 },
  likedBy: { type: [String], default: [] },
});

const PreschoolSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  preschoolname: { type: String, required: true },
  district: { type: String, required: true },
  phonenumber: { type: String, required: true },
  password: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "approved", "blocked"],
    default: "pending",
  },
  coverImage: String,
  description: String,
  openTime: String,
  closedTime: String,
  monthlyFee: String,
  gallery: [GalleryFolderSchema],
  whyYouImportant: [String],
});

const PreSchool = mongoose.model("Preschool", PreschoolSchema);
export default PreSchool;
