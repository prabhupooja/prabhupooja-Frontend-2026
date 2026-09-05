import { io } from 'socket.io-client';

const SOCKET_URL1 = process.env.REACT_APP_SOCKET_URL || process.env.REACT_APP_BACKEND_URL || process.env.REACT_APP_BASE_URL;
export const socket = io(SOCKET_URL1, {
    transports: ["websocket"],
    autoConnect: false,
});