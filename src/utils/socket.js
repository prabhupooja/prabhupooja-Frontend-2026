import { io } from "socket.io-client";

const getSocketUrl = () => {
  if (typeof window !== "undefined") {
    const { protocol, hostname } = window.location;
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return `${protocol}//${hostname}:3002`;
    }
  }

  return process.env.REACT_APP_SOCKET_URL || "wss://prabhupooja-backend.onrender.com";
};

export const socket = io(getSocketUrl(), {
  transports: ["websocket"],
  autoConnect: false,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});
