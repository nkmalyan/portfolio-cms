import axios from "axios";

// Change this to your Render URL after deploying backend in Step 2
export const BACKEND_URL = "http://localhost:5000"; 

const API = axios.create({
  baseURL: `${BACKEND_URL}/api`,
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default API;
