import axios from "axios";

// Ye line ab environment variable use karegi, jo humne Render par set kiya hai
export const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"; 

const API = axios.create({
  baseURL: `${BACKEND_URL}/api`,
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default API;