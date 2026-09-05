import { io } from "socket.io-client";

const getSocketUrl = () => {
  return (
    process.env.REACT_APP_SOCKET_URL ||
    process.env.REACT_APP_BACKEND_URL ||
    process.env.REACT_APP_BASE_URL ||
    ""
  );
};

export const socket = io(getSocketUrl(), {
  transports: ["websocket"],
  autoConnect: false,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});
