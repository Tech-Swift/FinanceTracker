import axios from 'axios';

// Detect environment
const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// Choose base URL automatically
const API_BASE_URL = isLocal
  ? 'http://localhost:3000/api'
  : import.meta.env.VITE_API_BASE_URL || 'https://financetracker-3u4m.onrender.com/api';

// Create Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Optional: log which backend is used
if (isLocal) {
  console.info(`🧑‍💻 Using local backend: ${API_BASE_URL}`);
} else {
  console.info(`🌍 Using production backend: ${API_BASE_URL}`);
}

export default api;
