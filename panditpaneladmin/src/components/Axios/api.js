import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 80000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;

