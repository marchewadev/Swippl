import { io } from "socket.io-client";

const URL = import.meta.env.VITE_BACKEND_SERVER;

const socket = io(URL, {
  autoConnect: false,
});

export default socket;
