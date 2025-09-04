import axios from "axios";

const baseBackedUrl = import.meta.env.VITE_BACKED_BASE_URL;

const axiosInstance = axios.create({
  baseURL: baseBackedUrl,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// request interceptor to send auth tokens
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("amnilBlogToken") || null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response.data,
  (exception) => {
    if (exception.response) {
      throw exception.response?.data;
    } else {
      throw exception;
    }
  }
);

export default axiosInstance;
