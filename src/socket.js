import { io } from "socket.io-client";

const url = process.env.REACT_APP_WS_SERVER_URL;
const options = {
  autoConnect: false, // This option prevents immediate connection
  transports: ['websocket'],
};

export const createSocket = ({ emit }) => {
  const socket = io(url, options);

  // Event listener for 'connect' event
  socket.on("connect", function () {
    console.log("Connected to server!");
    emit({
      type: "connect",
      data: null,
    });
  });

  // Event listener for 'message' event
  socket.on("message", function (message) {
    console.log("Received message:", message);
    emit({
      type: "message",
      data: message,
    });
  });

  // Event listener for 'disconnect' event
  socket.on("disconnect", function () {
    console.log("Disconnected from server!");
    emit({
      type: "disconnect",
      data: null,
    });
  });

  return socket;
};
