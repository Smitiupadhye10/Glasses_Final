// frontend/src/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

// Attach token automatically
api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('token');
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {}
  return config;
});

export default api;
