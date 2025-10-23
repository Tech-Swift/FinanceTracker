import axios from "axios";

// Axios setup
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

if (!import.meta.env.VITE_API_BASE_URL) {
  // helpful during development to know which backend is being used
  // Vite will replace import.meta.env values at build time
  console.info(`Using fallback API_BASE_URL: ${API_BASE_URL}`);
}

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export default axiosInstance;

export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}
