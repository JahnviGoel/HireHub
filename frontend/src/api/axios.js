import axios from "axios";

export const API_BASE_URL = process.env.REACT_APP_API_URL || "https://hirehub-7m0w.onrender.com/api";
export const SERVER_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, "");

const API = axios.create({
  baseURL: API_BASE_URL,
});

// Attach token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;
