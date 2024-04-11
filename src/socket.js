import { io } from "socket.io-client";

const url = process.env.REACT_APP_WS_SERVER_URL;
const baseOptions = {
  autoConnect: false, // This option prevents immediate connection
  transports: ["websocket"],
};

export const createSocket = ({ options }) => {
  const socket = io(url, { ...baseOptions, ...options });
  return socket;
};
