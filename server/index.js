const express = require("express");
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const cors = require("cors");
const { database } = require("./firebase");

const app = express();
const server = createServer(app);
const io = new Server(server);
const port = 3001;

app.use(cors());
app.use(express.json());

const registerRoomController = require("./controllers/roomController");

registerRoomController(app, database);

io.on("connection", (socket) => {
  const { userId, roomId } = socket.handshake.query;
  const log = (...args) => console.log(...args, `user: ${userId} room: ${roomId} `);
  log('event: connect');

  socket.join(roomId);
  io.to(roomId).emit("message", {
    type: "msg",
    data: `${userId}加入房間`,
  });

  socket.on('startGame', () => {
    log('event: startGame');
  });

  socket.on("disconnect", () => {
    log('event: disconnect');
  });
});

server.listen(port, () => {
  console.log(`server running at http://localhost:${port}`);
});
