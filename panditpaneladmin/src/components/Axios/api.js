import axios from "axios";

const getApiBaseUrl = () => {
  if (process.env.REACT_APP_API_URL && !process.env.REACT_APP_API_URL.includes("localhost")) {
    return process.env.REACT_APP_API_URL;
  }
  if (
    typeof window !== "undefined" &&
    !window.location.hostname.includes("localhost") &&
    !window.location.hostname.includes("127.0.0.1")
  ) {
    return "https://api.prabhupooja.com/api/v1";
  }
  return process.env.REACT_APP_API_URL || "http://localhost:3002/api/v1";
};

const api = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 80000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;


