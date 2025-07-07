// src/utils/customFetch.js
import axios from "axios";

const customFetch = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // if using cookies/auth
});

export default customFetch;
