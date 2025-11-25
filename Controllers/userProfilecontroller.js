// Delete own account
export const deleteAccount = async (req, res) => {
  try {
    const deleted = await PreSchool.findByIdAndDelete(req.user.id);
    if (!deleted) return res.status(404).json({ message: "Account not found" });
    res.json({ message: "Account deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
import PreSchool from "../Schema/ProfileUser.js";
import { cloudinary } from "../Config/cloudinary.js";
import { v4 as uuidv4 } from "uuid";

// Get own profile
export const getProfile = async (req, res) => {
  try {
    const profile = await PreSchool.findById(req.user.id);
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.json(profile);
  } catch (err) {
    console.error("uploadProfileImage error:", err);
    // include more error info for debugging
    res
      .status(500)
      .json({ message: "Server error", error: err.message, details: err });
  }
};

// Upload and set profile or cover image
export const uploadProfileImage = async (req, res) => {
  const { type } = req.body; // expected 'cover' or 'profile'
  const file = req.file;

  if (!file) return res.status(400).json({ message: "No file uploaded" });

  try {
    const profile = await PreSchool.findById(req.user.id);
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    const dataUri = `data:${file.mimetype};base64,${file.buffer.toString(
      "base64"
    )}`;
    const folderName = type === "cover" ? `cover` : `profile`;
    const uploaded = await cloudinary.uploader.upload(dataUri, {
      folder: `preschool/${profile._id}/${folderName}`,
    });

    if (type === "cover") profile.coverImage = uploaded.secure_url;
    else profile.profileImage = uploaded.secure_url;

    await profile.save();
    // debug: show the current gallery summary
    console.log(
      "gallery summary:",
      profile.gallery.map((g) => ({
        folderName: g.folderName,
        images: (g.images || []).length,
        videos: (g.videos || []).length,
        lastUpdated: g.lastUpdated,
      }))
    );
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update profile info
export const updateProfile = async (req, res) => {
  try {
    const updatedProfile = await PreSchool.findByIdAndUpdate(
      req.user.id,
      req.body,
      { new: true }
    );
    res.json(updatedProfile);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Add image/video to gallery
export const addGalleryItem = async (req, res) => {
  const { folderName } = req.body;
  const addAsCoderImage =
    req.body.addAsCoderImage === "true" || req.body.addAsCoderImage === true;
  const coderFolderName = req.body.coderFolder || "coderImage";
  // Multer .fields() provides req.files as an object: { file: [...], coverImage: [...] }
  const files = req.files?.file || [];
  const coverImageFile = req.files?.coverImage?.[0];

  if (!files || files.length === 0)
    return res.status(400).json({ message: "No album images/videos uploaded" });
  if (!coverImageFile)
    return res.status(400).json({ message: "No album cover image uploaded" });

  try {
    const profile = await PreSchool.findById(req.user.id);
    if (!profile.gallery) profile.gallery = [];
    const targetFolderName = addAsCoderImage ? coderFolderName : folderName;
    const reqDescription =
      req.body.description || req.body.folderDescription || "";
    let folder = profile.gallery.find((f) => f.folderName === targetFolderName);
    if (!folder) {
      folder = {
        folderName: targetFolderName,
        galleryId: uuidv4(),
        description: reqDescription,
        coverImage: null,
        images: [],
        videos: [],
        lastUpdated: Date.now(),
      };
      profile.gallery.push(folder);
      await profile.save();
      folder = profile.gallery.find((f) => f.folderName === targetFolderName);
    } else {
      if (reqDescription) folder.description = reqDescription;
    }

    // Upload cover image first and set as album cover
    const coverDataUri = `data:${
      coverImageFile.mimetype
    };base64,${coverImageFile.buffer.toString("base64")}`;
    const coverUploaded = await cloudinary.uploader.upload(coverDataUri, {
      folder: `preschool/${profile._id}/${targetFolderName}`,
    });
    folder.coverImage = coverUploaded.secure_url;

    // Upload album images/videos
    const uploadedFiles = [];
    for (const file of files) {
      const dataUri = `data:${file.mimetype};base64,${file.buffer.toString(
        "base64"
      )}`;
      let uploaded;
      if (file.mimetype.startsWith("video")) {
        uploaded = await cloudinary.uploader.upload(dataUri, {
          resource_type: "video",
          folder: `preschool/${profile._id}/${targetFolderName}`,
        });
        folder.videos.push(uploaded.secure_url);
        uploadedFiles.push({ type: "video", url: uploaded.secure_url });
      } else {
        uploaded = await cloudinary.uploader.upload(dataUri, {
          folder: `preschool/${profile._id}/${targetFolderName}`,
        });
        folder.images.push(uploaded.secure_url);
        uploadedFiles.push({ type: "image", url: uploaded.secure_url });
      }
      folder.lastUpdated = Date.now();
    }

    await profile.save();
    const freshProfile = await PreSchool.findById(req.user.id);
    if (freshProfile && freshProfile.gallery) {
      freshProfile.gallery.sort((a, b) => {
        const ta = a.lastUpdated ? new Date(a.lastUpdated).getTime() : 0;
        const tb = b.lastUpdated ? new Date(b.lastUpdated).getTime() : 0;
        return tb - ta;
      });
    }
    res.json({ profile: freshProfile, uploaded: uploadedFiles });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete a gallery folder by galleryId or folderName
export const deleteGalleryFolder = async (req, res) => {
  const { folderId } = req.params;
  try {
    const profile = await PreSchool.findById(req.user.id);
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    const decoded = decodeURIComponent(folderId || "");
    const idx = profile.gallery.findIndex(
      (g) =>
        g.galleryId === folderId ||
        g.galleryId === decoded ||
        g.folderName === folderId ||
        g.folderName === decoded
    );
    if (idx === -1)
      return res.status(404).json({ message: "Gallery folder not found" });

    // remove the folder from profile
    profile.gallery.splice(idx, 1);
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error("deleteGalleryFolder error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Set a gallery folder's privacy (public/private)
export const setGalleryPrivacy = async (req, res) => {
  const { folderId } = req.params;
  const { isPrivate } = req.body;
  try {
    const profile = await PreSchool.findById(req.user.id);
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    const decoded = decodeURIComponent(folderId || "");
    const folder = profile.gallery.find(
      (g) =>
        g.galleryId === folderId ||
        g.galleryId === decoded ||
        g.folderName === folderId ||
        g.folderName === decoded
    );
    if (!folder) return res.status(404).json({ message: "Folder not found" });

    folder.isPrivate = !!isPrivate;
    await profile.save();

    const fresh = await PreSchool.findById(req.user.id);
    res.json(fresh);
  } catch (err) {
    console.error("setGalleryPrivacy error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Debug endpoint: echo received files and body (DO NOT enable in production)
export const debugReceiveUpload = async (req, res) => {
  try {
    const files = req.files || (req.file ? [req.file] : []);
    console.log("debugReceiveUpload body:", req.body);
    files.forEach((f, i) =>
      console.log(
        `debug file[${i}]: name=${f.originalname} type=${f.mimetype} size=${f.size}`
      )
    );
    return res.json({
      received: files.map((f) => ({
        originalname: f.originalname,
        mimetype: f.mimetype,
        size: f.size,
      })),
      body: req.body,
    });
  } catch (err) {
    console.error("debugReceiveUpload error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Public: list all preschools (read-only). Filters out private gallery folders.
export const listPublicProfiles = async (req, res) => {
  try {
    // return public-facing fields and strip sensitive data like password
    const profiles = await PreSchool.find({}, "-password -__v").lean();

    // Filter out blocked profiles
    const sanitized = profiles
      .filter((p) => p.status !== "blocked")
      .map((p) => {
        const copy = { ...p };
        // ensure gallery only contains public folders
        copy.gallery = (copy.gallery || []).filter((g) => !g.isPrivate);
        return copy;
      });
    res.json(sanitized);
  } catch (err) {
    console.error("listPublicProfiles error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Public: get one preschool by id (public view). Strip private gallery folders.
export const getPublicProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const profile = await PreSchool.findById(id, "-password -__v").lean();
    if (!profile)
      return res.status(404).json({ message: "Preschool not found" });
    profile.gallery = (profile.gallery || []).filter((g) => !g.isPrivate);
    res.json(profile);
  } catch (err) {
    console.error("getPublicProfile error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Public: like or unlike a gallery folder (no auth required).
// Body: { action: 'like' | 'unlike', visitorId?: string }
export const likeGalleryFolder = async (req, res) => {
  try {
    const { id, folderId } = req.params; // id = preschool id
    const { action, visitorId } = req.body;

    const profile = await PreSchool.findById(id);
    if (!profile)
      return res.status(404).json({ message: "Preschool not found" });

    const decoded = decodeURIComponent(folderId || "");
    const folder = profile.gallery.find(
      (g) =>
        g.galleryId === folderId ||
        g.galleryId === decoded ||
        g.folderName === folderId ||
        g.folderName === decoded
    );
    if (!folder)
      return res.status(404).json({ message: "Gallery folder not found" });

    // Default action: like
    const act = (action || "like").toLowerCase();

    if (act === "like") {
      // prevent duplicate visitorId adds if provided
      if (visitorId) {
        if (!folder.likedBy) folder.likedBy = [];
        if (!folder.likedBy.includes(visitorId)) {
          folder.likedBy.push(visitorId);
          folder.likes = (folder.likes || 0) + 1;
        }
      } else {
        folder.likes = (folder.likes || 0) + 1;
      }
    } else if (act === "unlike") {
      if (visitorId && folder.likedBy && folder.likedBy.includes(visitorId)) {
        folder.likedBy = folder.likedBy.filter((v) => v !== visitorId);
        folder.likes = Math.max(0, (folder.likes || 0) - 1);
      } else if (!visitorId) {
        folder.likes = Math.max(0, (folder.likes || 0) - 1);
      }
    } else {
      return res.status(400).json({ message: "Invalid action" });
    }

    await profile.save();

    // return updated folder info
    const updated = profile.gallery.find(
      (g) => g.galleryId === folder.galleryId
    );
    res.json({ folder: updated });
  } catch (err) {
    console.error("likeGalleryFolder error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
