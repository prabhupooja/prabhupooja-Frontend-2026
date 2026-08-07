import axios from "axios";

const api = axios.create({
  // baseURL: 'http://localhost:3002/api/v1',
  // baseURL: "https://prabhupooja-backend.onrender.com/api/v1",
  baseURL: 'https://prabhupooja-backend.onrender.com/api/v1',
  timeout: 100000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
