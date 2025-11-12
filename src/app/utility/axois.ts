import axios from "axios";

// const base =  "https://agent-with-me-backend.onrender.com"
const base = "https://cams-api-oco8.onrender.com";
const app = axios.create({
  baseURL: base,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default { app, base };
