import axios from "axios";

// Prefer a local Vite env variable `VITE_API_URL` if present (e.g. http://localhost:4000)
// otherwise fall back to the deployed backend URL.
const baseURL =
  (import.meta && import.meta.env && import.meta.env.VITE_API_URL) ||
  "https://pre-school-backend1.onrender.com";
const API = axios.create({ baseURL });

// All admin endpoints are mounted under /api/admin on the backend
export const loginAdmin = (email, password) =>
  API.post("/api/admin/login", { email, password });

export const getPendingUsers = (token) =>
  API.get("/api/admin/preschools", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const approveUser = (id, token) =>
  API.post(
    `/api/admin/preschool/${id}/approve`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );

export const blockUser = (id, token) =>
  API.post(
    `/api/admin/preschool/${id}/block`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );

export const unblockUser = (id, token) =>
  API.post(
    `/api/admin/preschool/${id}/unblock`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );

export default API;
