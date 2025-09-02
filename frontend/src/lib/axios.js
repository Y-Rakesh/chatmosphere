import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development"
    ? "http://localhost:5001/api"   // local backend
    : import.meta.env.VITE_API_URL + "/api", // production backend from Vercel env vars
  withCredentials: true,
});
