import axios from "axios";

// const base = "https://cams-api-oco8.onrender.com";
const base = "http://localhost:5036";
const app = axios.create({
  baseURL: base,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default { app, base };
