export const deleteAccount = (token) =>
  API.delete("/profile/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
import axios from "axios";

// Use local backend when running frontend on localhost for easier testing
const detectedHost =
  typeof window !== "undefined" ? window.location.hostname : null;
const baseURL =
  detectedHost && detectedHost.includes("localhost")
    ? "http://localhost:4000"
    : "https://pre-school-backend1.onrender.com";

const API = axios.create({ baseURL });

export const getProfile = (token) =>
  API.get("/profile/me", { headers: { Authorization: `Bearer ${token}` } });

export const updateProfile = (token, data) =>
  API.put("/profile/update", data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const uploadGallery = (token, formData) =>
  API.post("/profile/gallery", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const uploadProfileImage = (token, formData) =>
  API.post("/profile/upload-image", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const deleteGallery = (token, folderId) =>
  API.delete(`/profile/gallery/${encodeURIComponent(folderId)}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const setGalleryPrivacy = (token, folderId, isPrivate) =>
  API.put(
    `/profile/gallery/${encodeURIComponent(folderId)}/privacy`,
    { isPrivate },
    { headers: { Authorization: `Bearer ${token}` } }
  );

// Public endpoints (no auth)
export const getPublicProfiles = () => API.get(`/profile/public`);
export const getPublicProfile = (id) =>
  API.get(`/profile/public/${encodeURIComponent(id)}`);

// Public: like/unlike a gallery folder
export const likeGalleryFolderPublic = (
  preschoolId,
  folderId,
  action = "like",
  visitorId
) =>
  API.post(
    `/profile/public/${encodeURIComponent(
      preschoolId
    )}/gallery/${encodeURIComponent(folderId)}/like`,
    { action, visitorId }
  );
