import axios from "axios";

// Use local backend when running on localhost for development convenience.
const defaultBase =
  window && window.location && window.location.hostname
    ? window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1"
      ? "http://localhost:4000"
      : "https://pre-school-backend1.onrender.com"
    : "https://pre-school-backend1.onrender.com";

const API = axios.create({ baseURL: defaultBase });

// Public: fetch advertisements (backend exposes /ads and /api/ads)
export const getAds = () => API.get("/ads");

// Admin endpoints are mounted under /api/admin on the server
export const adminUploadAds = (formData, token) =>
  API.post("/api/admin/ads", formData, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const adminDeleteAd = (id, token) =>
  API.delete(`/api/admin/ads/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const adminUploadYouTube = (body, token) =>
  API.post("/api/admin/ads/youtube", body, {
    headers: { Authorization: `Bearer ${token}` },
  });

// Separate youtube collection endpoints
export const adminUploadYouTubeSeparate = (body, token) =>
  API.post("/api/admin/youtube", body, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getYouTubeVideos = () => API.get("/api/youtube");

export const adminDeleteYouTube = (id, token) =>
  API.delete(`/api/admin/youtube/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export default {
  getAds,
  adminUploadAds,
  adminDeleteAd,
  adminUploadYouTube,
  adminUploadYouTubeSeparate,
  getYouTubeVideos,
  adminDeleteYouTube,
};
