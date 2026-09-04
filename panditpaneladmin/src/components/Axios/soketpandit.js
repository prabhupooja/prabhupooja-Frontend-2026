import { io } from 'socket.io-client';

const SOCKET_URL1 = process.env.REACT_APP_SOCKET_URL || process.env.REACT_APP_BACKEND_URL || "http://localhost:3002";
export const socket = io(SOCKET_URL1, {
    transports: ["websocket"],
    autoConnect: false,
});