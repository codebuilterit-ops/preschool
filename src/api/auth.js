import axios from "axios";

// Use Vite env `VITE_API_URL` when available (e.g., http://localhost:4000)
const baseURL =
  (import.meta && import.meta.env && import.meta.env.VITE_API_URL) ||
  "https://pre-school-backend1.onrender.com";
const API = axios.create({ baseURL });

// Backend mounts auth routes under /api/auth
export const registerUser = (data) => API.post("/api/auth/register", data);
export const loginUser = (data) => API.post("/api/auth/login", data);
