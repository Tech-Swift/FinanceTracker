import axios from "axios";

// Axios setup
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export default axiosInstance;

export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}
