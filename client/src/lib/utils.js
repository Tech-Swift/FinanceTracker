// utils.js
import axios from "axios";

// Detect environment automatically
const isLocalhost =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1");

// ✅ Auto-pick base URL based on environment
const API_BASE_URL = isLocalhost
  ? "http://localhost:3000/api" // Local backend
  : import.meta.env.VITE_API_BASE_URL || "https://financetracker-3u4m.onrender.com/api"; // Production

console.info(`🔗 Using API base URL: ${API_BASE_URL}`);

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export default axiosInstance;

// ✅ Utility function (required by ShadCN/UI)
export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}
