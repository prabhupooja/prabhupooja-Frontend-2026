import {io} from 'socket.io-client'

const SOCKET_URL1 = "http://localhost:3002";
export const socket = io(SOCKET_URL1, {
    transports: ["websocket"],
    autoConnect: false,
});