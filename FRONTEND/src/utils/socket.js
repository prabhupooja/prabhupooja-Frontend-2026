import { io } from "socket.io-client";

const getSocketUrl = () => {
  if (process.env.REACT_APP_SOCKET_URL) return process.env.REACT_APP_SOCKET_URL;
  if (process.env.REACT_APP_BACKEND_URL) return process.env.REACT_APP_BACKEND_URL;
  if (process.env.REACT_APP_BASE_URL) return process.env.REACT_APP_BASE_URL;
  if (typeof window !== "undefined" && !window.location.hostname.includes("localhost")) {
    return "https://api.prabhupooja.com";
  }
  return "http://localhost:3002";
};

export const socket = io(getSocketUrl(), {
  transports: ["websocket", "polling"],
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});
